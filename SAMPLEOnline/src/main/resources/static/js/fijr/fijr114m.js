/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-집계마스터 테이블 관리
 * @설명: 집계마스터 테이블 관리 화면
 * @최초작성자: 류승민
 * @최초작성일: 2021.03.08
 * @최종변경일:
 * @개정이력:
 *  류승민 2021.03.08 최초작성
 *  류승민 2021.04.28 2차 표준화
 *  류승민 2021.06.15 3차 표준화
 */

//전역변수 선언
var NEW_MODI_SC_CD = "U";			//수정, 신규 저장 체크
var initObject = null;				//수정전 원데이터
var perBtnId = ["btn_excel_upload", "btn_delete_all", "btn_save", "btn_excel_save", "btn_delete", "ibx_pswd", "txt_pswd"];

$(document).ready(function(){

	//button permission
	var arrPerBtn = new Array();
	for(var i=0; i<perBtnId.length; i++){
		var perBtn = new Object();
		perBtn.btnId = "#" + perBtnId[i];
		perBtn.action = "R";
		arrPerBtn.push(perBtn);
	}
	$.fn.setBtnPermission(arrPerBtn);
	
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	//버튼 초기화
	$("#btn_cancel").hide(); //취소
	$("#btn_excel_save").hide(); //엑셀저장
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();

	setObjStateChg("");
	
	//회계코드 초기화
	selectItmCode("ACCT_CD", "sbx_acctCd", "");

	//원천테이블 초기화
	selectSmupItmCode("TB_ID", "sbx_tbId", "", "S");
	selectSmupItmCode("CLUM_NM", "sbx_clumNm", "", "S");
	selectSmupItmCode("OCCU_ACDT_DBT_SC_CD", "sbx_occuAcdtDbtScCd", "", "S");

	$("#sbx_acctCd").focus();
	
});

/**
 * @설명: event 초기화
 */
function initEvent() {
	//조회
	$("#btn_search").on("click", function(e){
		NEW_MODI_SC_CD = "U";
		selectSmupMstrTbMngList();
	});
	
	//저장
	$("#btn_save").on("click", function(e){
		NEW_MODI_SC_CD = "U";
		saveSmupMstr();
	});
	
	//취소 
	$("#btn_cancel").on("click", function(e){
		NEW_MODI_SC_CD = "U";
		setObjStateChg("");
	});
	
	//단건 삭제
	$("#btn_delete").on("click", function(e){
		NEW_MODI_SC_CD = "D";
		saveSmupMstr();
	});

	//집계마스터 초기화(전체 삭제)
	$("#btn_delete_all").on("click", function(e){
		deleteSmupMstr();
	});
	
	// 회계코드 change
	$("#sbx_acctCd").on("change", function(e){
		selectItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCd", $(this).val());
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "");
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "");
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", "");
	});
	
	// 업무분류 change
	$("#sbx_acntgBusnClsfCd").on("change", function(e){
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", $(this).val());
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "");
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", $(this).val());
	});
	
	// 거래유형 change
	$("#sbx_acntgDlTypCd").on("change", function(e){
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", $(this).val());
	});

	// 원천테이블 change
	$("#sbx_tbId").on("change", function(e){
		selectSmupItmCode("CLUM_NM", "sbx_clumNm", $(this).val(), "S");
	});

	// 하단 회계코드 change
	$("#sbx_acctCdDtl").on("change", function(e){
		selectItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCdDtl", $(this).val());
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCdDtl", "");
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCdDtl", "");
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCdDtl", "");
		selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCdDtl", "");
	});

	// 하단 업무분류 change
	$("#sbx_acntgBusnClsfCdDtl").on("change", function(e){
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCdDtl", $(this).val());
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCdDtl", "");
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCdDtl", $(this).val());
		selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCdDtl", "");
	});

	// 하단 거래유형 change
	$("#sbx_acntgDlTypCdDtl").on("change", function(e){
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCdDtl", $(this).val());
	});

	// 하단 금액유형구분 change
	$("#sbx_amtTypScCdDtl").on("change", function(e){
		selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCdDtl", $(this).val());
	});

	// 하단 원천테이블 change
	$("#sbx_tbIdDtl").on("change", function(e){
		selectSmupItmCode("CLUM_NM", "sbx_clumNmDtl", $(this).val(), "");
	});

	//엑셀다운로드
	$("#btn_excel_download").on("click", function(e){
		var fileName = "집계마스터_테이블_관리" + ".xlsx";
		$.fn.exportGridExcel({
			id: 'gridDiv', 
			fileName: fileName
		});
	});
	
	//엑셀로드
	$("#btn_excel_upload").on("click", function(e){
		var paramObj = {};
		paramObj.id = "gridDiv";					//그리드 ID
		paramObj.callbackFn = function(data) {		//그리드 바인딩 후 후처리 함수
			if(typeof data.list !== "undefined" && data.list.length > 0) {
				if(data.result == "1") {
					$.fn.msgBox(data.list.length + "건 정상적으로 로드하였습니다.");
					$("#btn_save").hide();
					$("#btn_delete").hide();
					$("#btn_cancel").show();
					$("#btn_excel_save").show();
					NEW_MODI_SC_CD = "XLSX";
					setObjStateChg();
				} else {
					$.fn.msgBox("처리 실패하였습니다.");
				}
			}
		};
		$.fn.loadGridExcel(paramObj); 
	});
	
	//엑셀저장
	$("#btn_excel_save").on("click", function(e){
		saveSmupMstrExcel();
	});

	//금액유형상세구분코드 팝업창 호출
	$("#btn_amtTypDtlScCdSearch").on("click", function(e){
		openPopup();
	});
	
	//금액유형상세구분코드 조회조건
	$("#inp_amtTypDtlScCd").on("focusout", function(e){
		if($(this).val().length == 0) {
			$("#inp_amtTypDtlScCdNm").val("");
		} else {
			selectAmtTypDtlScCdNm($(this).val(), "focusout");
		}
	}).on("keypress", function(e){
		if(e.keyCode == 13){
			selectAmtTypDtlScCdNm($(this).val(), "keypress");
			return false;
		}
	});

	//조회조건 엔터키 조회
	$("#sbx_acctCd, #sbx_acntgBusnClsfCd, #sbx_acntgDlTypCd, #sbx_acntgAmtScCd, #sbx_amtTypScCd, #sbx_tbId, #sbx_clumNm, #sbx_occuAcdtDbtScCd").on("keypress", function(e) {
		if(e.keyCode == 13) {
			$("#btn_search").click();
			return false;
		}
	});
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 350,
		editing: false,
		sorting: true,
		paging: true,
		confirmDeleting: false,
		pageSize: 10,
		fields : [
			{ name: "acctCd", title:"회계코드", css:"cell", type: "text", width: 70, editing: false, align:"center"},
			{ name: "acctCdNm", title:"회계코드명", css:"cell", type: "text", width: 80, editing: false, align:"left"},
			{ name: "acntgBusnClsfCd", title:"업무분류", css:"cell", type: "text", width: 70, editing: false, align:"center"},
			{ name: "acntgBusnClsfCdNm", title:"업무분류명", css:"cell", type: "text", width: 80, editing: false, align:"left"},
			{ name: "acntgDlTypCd", title:"거래유형", css:"cell", type: "text", width: 70, editing: false, align:"center"},
			{ name: "acntgDlTypCdNm", title:"거래유형명", css:"cell", type: "text", width: 180, editing: false, align:"left"},
			{ name: "acntgAmtScCd", title:"금액구분", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "acntgAmtScCdNm", title:"금액구분명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "amtTypScCd", title:"금액유형구분", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "amtTypScCdNm", title:"금액유형구분명", css:"cell", type: "text", width: 150, editing: false, align:"left"},
			{ name: "amtTypDtlScCd", title:"금액유형상세구분", css:"cell", type: "text", width: 120, editing: false, align:"center"},
			{ name: "amtTypDtlScCdNm", title:"금액유형상세구분명", css:"cell", type: "text", width: 300, editing: false, align:"left"},
			{ name: "tbId", title:"원천테이블ID", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "tbNm", title:"원천테이블명", css:"cell", type: "text", width: 260, editing: false, align:"left"},
			{ name: "clumNm", title:"컬럼명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "clumKraNm", title:"컬럼한글명", css:"cell", type: "text", width: 170, editing: false, align:"left"},
			{ name: "occuAcdtDbtScCd", title:"발생사고부채항목/<br>사업비항목", css:"cell", type: "text", width: 120, editing: false, align:"center"},
			{ name: "occuAcdtDbtScCdNm", title:"발생사고부채항목/<br>사업비항목명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "aplcStrYm", title:"유효개시월", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "aplcEndYm", title:"유효종료월", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "note", title:"비고", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "trtDtm", title:"처리일시", css:"cell", type: "text", width: 150, editing: false, align:"center"}
		]
	});	
	
	//row rowDoubleClick
	gridObject.rowDoubleClick(function(args) {
		initObject = args.item;
		if (NEW_MODI_SC_CD != "XLSX")
			setDoubleClickDtlInfo(args);
	});
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 금액유형상세구분코드 팝업을 호출한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: rowItem 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
var popupOption = null;
function openPopup() {

	popupOption = {
		url: "/fi/jr/fijr113p.do",
		name: "금액유형상세구분코드 조회 팝업",
		width: 1000,
		height: 434,
		acctCd: $("#sbx_acctCd").val(),
		acntgBusnClsfCd: $("#sbx_acntgBusnClsfCd").val(),
		amtTypScCd: $("#sbx_amtTypScCd").val() == "-전체-" ? "" : $("#sbx_amtTypScCd").val(),
		amtTypDtlScCd: $("#inp_amtTypDtlScCd").val()
	}

	$.fn.openPopup(popupOption);
}

/**
 * @설명: 금액유형상세구분코드조회 팝업 콜백
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
function openPopup_callback(resultObj) {
	console.log("[금액유형상세구분코드조회 팝업 콜백] resultObj", resultObj);
	
	if(typeof resultObj === "undefined" || resultObj == null) return;
	
	$("#sbx_acctCd").val(resultObj.acctCd);
	$("#sbx_acctCd").change();
	$("#sbx_acntgBusnClsfCd").val(resultObj.acntgBusnClsfCd);
	$("#sbx_acntgBusnClsfCd").change();
	$("#sbx_amtTypScCd").val(resultObj.amtTypScCd);
	$("#inp_amtTypDtlScCd").val(resultObj.amtTypDtlScCd);
	$("#inp_amtTypDtlScCdNm").val(resultObj.amtTypDtlScCdNm);
	
	$("#inp_amtTypDtlScCd").focus();
	
}

/**
 * @설명: 금액유형상세구분코드명 조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: val 금액유형상세구분코드
 * 			scCd 이벤트코드
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
function selectAmtTypDtlScCdNm(val, scCd) {
	var reqParam = {};
	reqParam.codeId = "AMT_TYP_DTL_SC_CD";
	reqParam.val = $("#inp_amtTypDtlScCd").val();
	
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr113m/selectItmCdNm.do")
	.done(function(data) {

		$("#inp_amtTypDtlScCd").val(val);
		$("#inp_amtTypDtlScCdNm").val(data.codeNm);
		
		if(scCd == "keypress") $("#btn_search").click();
		
	}).fail(function(data) {
		console.log("fail to selectAmtTypDtlScCdNm!!!!");
	});
}

/**
 * @설명: 집계마스터 테이블 목록을 조회한다.
 */
function selectSmupMstrTbMngList() {

	var reqParam = {
			acctCd             : $("#sbx_acctCd").val(),
			acntgBusnClsfCd    : $("#sbx_acntgBusnClsfCd").val(),
			acntgDlTypCd       : $("#sbx_acntgDlTypCd").val(),
			acntgAmtScCd       : $("#sbx_acntgAmtScCd").val(),
			amtTypScCd         : $("#sbx_amtTypScCd").val(),
			amtTypDtlScCd      : $("#inp_amtTypDtlScCd").val(),
			tbId               : $("#sbx_tbId").val(),
			clumNm             : $("#sbx_clumNm").val(),
			occuAcdtDbtScCd    : $("#sbx_occuAcdtDbtScCd").val()
		};
	
//	console.log("★★★★★★★★★★★★reqParam★★★★★★★★★★★★");
//	console.log(reqParam);
	// 데이터 조회
	$.callAjax(reqParam, "/fi/jr/fijr114m/selectSmupMstrTbMngList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		if(listData.length ==0){
			$.fn.getReturnValue("gridDiv");
		}
		setObjStateChg("");
		
		NEW_MODI_SC_CD = "U";
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
//		console.log("fail to selectSmupMstrTbMngList !!");
	});
}

/**
 * @설명: 더블클릭한 행의 데이터를 하단 Detail 영역으로 값으로 셋팅한다.
 */
function setDoubleClickDtlInfo(args) {

	setDisabled("0");
	
	var selectedIndex = args.itemIndex;
	var selectedObj = args.item;
//	console.log("[rowDoubleClick]selectedIndex:" + selectedIndex);
//	console.log("[rowDoubleClick]selectedObj:" + JSON.stringify(selectedObj));

//	$("#ipt_dtl").find("select,input,button,textarea").attr("disabled", false);

	selectItmCode("ACCT_CD", "sbx_acctCdDtl", selectedObj.acctCd);
	selectItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCdDtl", selectedObj.acctCd);
	selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCdDtl", selectedObj.acntgBusnClsfCd);
	selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCdDtl", selectedObj.acntgDlTypCd);
	selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCdDtl", selectedObj.acntgBusnClsfCd);
	selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCdDtl", selectedObj.amtTypScCd);
	
	$("#sbx_acctCdDtl").val(selectedObj.acctCd);
	$("#sbx_acntgBusnClsfCdDtl").val(selectedObj.acntgBusnClsfCd);
	$("#sbx_acntgDlTypCdDtl").val(selectedObj.acntgDlTypCd);
	$("#sbx_acntgAmtScCdDtl").val(selectedObj.acntgAmtScCd);
	$("#sbx_amtTypScCdDtl").val(selectedObj.amtTypScCd);
	$("#sbx_amtTypDtlScCdDtl").val(selectedObj.amtTypDtlScCd);
	
	selectSmupItmCode("TB_ID", "sbx_tbIdDtl", "", "");
	selectSmupItmCode("CLUM_NM", "sbx_clumNmDtl", selectedObj.tbId, "");
	selectSmupItmCode("OCCU_ACDT_DBT_SC_CD", "sbx_occuAcdtDbtScCdDtl", selectedObj.occuAcdtDbtScCdDtl, "");
	$("#sbx_tbIdDtl").val(selectedObj.tbId);
	$("#sbx_clumNmDtl").val(selectedObj.clumNm);
	$("#sbx_occuAcdtDbtScCdDtl").val(selectedObj.occuAcdtDbtScCd);

	
//	유효개시월 default
	var today = new Date();
	var year = today.getFullYear();
	var month = '' + (today.getMonth()+1);
	if (month.length < 2) month = '0' + month;
	
	if(selectedObj.aplcStrYm == null || selectedObj.aplcStrYm == "")
		selectedObj.aplcStrYm = $.fn.monthFormat((year+month),'-');
	
//	유효종료월 default
	if(selectedObj.aplcEndYm == null || selectedObj.aplcEndYm == "")
		selectedObj.aplcEndYm = "9999-12";

	$("#inp_aplcStrYm").val(selectedObj.aplcStrYm);
	$("#inp_aplcEndYm").val(selectedObj.aplcEndYm);
	$("#inp_note").val(selectedObj.note);
	
	
}

/**
 * @설명: 신규생성, 수정 처리한다.
 */
function saveSmupMstr() {
//	console.log("★★★★★★★★★★★★saveSmupMstr★★★★★★★★★★★★");
//	console.log("[saveSmupMstr]initObject:" + JSON.stringify(initObject));
//	console.log("[saveSmupMstr]NEW_MODI_SC_CD:" + NEW_MODI_SC_CD);

	if($.fn.isEmpty(initObject)) {
		$.fn.msgBox("저장/삭제 할 대상이 없습니다.");
		return;
	}

	if(NEW_MODI_SC_CD != "D") {
		var chk = true;	// 필수값 입력 체크
		$(".reqchk").each(function(){
			var tmpEle = $("#"+this.id);
			if(tmpEle.val() == null || tmpEle.val() == "" || tmpEle.val() == "-") {
				
				$.fn.msgBox(tmpEle.attr("title") + "을(를) 입력해 주십시오.");
				tmpEle.focus();
				chk = false;
				return chk;
			}
		});

		if (!chk) return;

		if($("#inp_note").val().length > 300) {
			$.fn.msgBox("비고는 300자 이하로 입력해야 합니다.");
			return;
		}
		
		if(initObject.tbId == null || initObject.tbId == "")
			NEW_MODI_SC_CD = "I";
		
	}

	var tmpNote = $("#inp_note").val();
	var tmpNoteinit = initObject.note;
	var tmpOccu = $("#sbx_occuAcdtDbtScCdDtl").val();
	var tmpOccuinit = initObject.occuAcdtDbtScCd;

	var reqParam = {
			newModiScCd        : NEW_MODI_SC_CD,
			acctCd             : $("#sbx_acctCdDtl").val(),
			acntgBusnClsfCd    : $("#sbx_acntgBusnClsfCdDtl").val(),
			acntgDlTypCd       : $("#sbx_acntgDlTypCdDtl").val(),
			acntgAmtScCd       : $("#sbx_acntgAmtScCdDtl").val(),
			amtTypScCd         : $("#sbx_amtTypScCdDtl").val(),
			amtTypDtlScCd      : $("#sbx_amtTypDtlScCdDtl").val(),
			tbId               : $("#sbx_tbIdDtl").val(),
			clumNm             : $("#sbx_clumNmDtl").val(),
			occuAcdtDbtScCd    : (tmpOccu == null || tmpOccu == "") ? "" : tmpOccu,
			aplcStrYm          : $("#inp_aplcStrYm").val(),
			aplcEndYm          : $("#inp_aplcEndYm").val(),
			note               : (tmpNote == null || tmpNote == "") ? "" : tmpNote,
			srcAcctCd          : initObject.acctCd,        //수정원데이터
			srcAcntgBusnClsfCd : initObject.acntgBusnClsfCd,
			srcAcntgDlTypCd    : initObject.acntgDlTypCd,
			srcAcntgAmtScCd    : initObject.acntgAmtScCd,
			srcAmtTypScCd      : initObject.amtTypScCd,
			srcAmtTypDtlScCd   : initObject.amtTypDtlScCd,
			srcTbId            : initObject.tbId,
			srcClumNm          : initObject.clumNm,
			srcOccuAcdtDbtScCd : (tmpOccuinit == null || tmpOccuinit == "") ? "" : tmpOccuinit,
			srcAplcStrYm       : initObject.aplcStrYm,
			srcAplcEndYm       : initObject.aplcEndYm,
			srcNote            : (tmpNoteinit == null || tmpNoteinit == "") ? "" : tmpNoteinit,
			pswd               : $("#ibx_pswd").val()
		};

	if(NEW_MODI_SC_CD != "D") {

		if(NEW_MODI_SC_CD != "I") {

			if(reqParam.acctCd == reqParam.srcAcctCd
				&& reqParam.acntgBusnClsfCd == reqParam.srcAcntgBusnClsfCd 
				&& reqParam.acntgDlTypCd == reqParam.srcAcntgDlTypCd
				&& reqParam.acntgAmtScCd == reqParam.srcAcntgAmtScCd
				&& reqParam.amtTypScCd == reqParam.srcAmtTypScCd
				&& reqParam.amtTypDtlScCd == reqParam.srcAmtTypDtlScCd
				&& reqParam.tbId == reqParam.srcTbId
				&& reqParam.clumNm == reqParam.srcClumNm
				&& reqParam.occuAcdtDbtScCd == reqParam.srcOccuAcdtDbtScCd
				&& reqParam.aplcStrYm == reqParam.srcAplcStrYm
				&& reqParam.aplcEndYm == reqParam.srcAplcEndYm
				&& reqParam.note == reqParam.srcNote) {
				$.fn.msgBox("변경사항이 없습니다.");
				return;
			}else if( reqParam.acctCd == reqParam.srcAcctCd
					&& reqParam.acntgBusnClsfCd == reqParam.srcAcntgBusnClsfCd 
					&& reqParam.acntgDlTypCd == reqParam.srcAcntgDlTypCd
					&& reqParam.acntgAmtScCd == reqParam.srcAcntgAmtScCd
					&& reqParam.amtTypScCd == reqParam.srcAmtTypScCd
					&& reqParam.amtTypDtlScCd == reqParam.srcAmtTypDtlScCd
					&& reqParam.aplcStrYm == reqParam.srcAplcStrYm
					&& reqParam.aplcEndYm == reqParam.srcAplcEndYm ) {
				reqParam.newModiScCd = "U1";
			}else if( reqParam.acctCd == reqParam.srcAcctCd
					&& reqParam.acntgBusnClsfCd == reqParam.srcAcntgBusnClsfCd 
					&& reqParam.acntgDlTypCd == reqParam.srcAcntgDlTypCd
					&& reqParam.acntgAmtScCd == reqParam.srcAcntgAmtScCd
					&& reqParam.amtTypScCd == reqParam.srcAmtTypScCd
					&& reqParam.amtTypDtlScCd == reqParam.srcAmtTypDtlScCd ) {
				reqParam.newModiScCd = "U2";
			}
		}
		
		if (reqParam.aplcStrYm < reqParam.srcAplcStrYm) {
			$.fn.msgBox("유효개시월을 기존월 이전으로는 수정 불가합니다.");
			return;
		}
		
		var sbx_acctCdDtlNm = $("#sbx_acctCdDtl option:selected").text();
		var pos = sbx_acctCdDtlNm.indexOf(': ');
		sbx_acctCdDtlNm = sbx_acctCdDtlNm.substr(pos+2);
		var sbx_acntgBusnClsfCdDtlNm = $("#sbx_acntgBusnClsfCdDtl option:selected").text();
		pos = sbx_acntgBusnClsfCdDtlNm.indexOf(': ');
		sbx_acntgBusnClsfCdDtlNm = sbx_acntgBusnClsfCdDtlNm.substr(pos+2);
		var sbx_acntgDlTypCdDtlNm = $("#sbx_acntgDlTypCdDtl option:selected").text();
		pos = sbx_acntgDlTypCdDtlNm.indexOf(': ');
		sbx_acntgDlTypCdDtlNm = sbx_acntgDlTypCdDtlNm.substr(pos+2);
		var sbx_acntgAmtScCdDtlNm = $("#sbx_acntgAmtScCdDtl option:selected").text();
		pos = sbx_acntgAmtScCdDtlNm.indexOf(': ');
		sbx_acntgAmtScCdDtlNm = sbx_acntgAmtScCdDtlNm.substr(pos+2);
		var sbx_amtTypScCdDtlNm = $("#sbx_amtTypScCdDtl option:selected").text();
		pos = sbx_amtTypScCdDtlNm.indexOf(': ');
		sbx_amtTypScCdDtlNm = sbx_amtTypScCdDtlNm.substr(pos+2);
		var sbx_amtTypDtlScCdDtlNm = $("#sbx_amtTypDtlScCdDtl option:selected").text();
		pos = sbx_amtTypDtlScCdDtlNm.indexOf(': ');
		sbx_amtTypDtlScCdDtlNm = sbx_amtTypDtlScCdDtlNm.substr(pos+2);
	
		reqParam.acctCdNm = sbx_acctCdDtlNm;
		reqParam.acntgBusnClsfCdNm = sbx_acntgBusnClsfCdDtlNm;
		reqParam.acntgDlTypCdNm = sbx_acntgDlTypCdDtlNm;
		reqParam.acntgAmtScCdNm = sbx_acntgAmtScCdDtlNm;
		reqParam.amtTypScCdNm = sbx_amtTypScCdDtlNm;
		reqParam.amtTypDtlScCdNm = sbx_amtTypDtlScCdDtlNm;
	
		reqParam.tbNm = $("#sbx_tbIdDtl option:selected").text();
		reqParam.clumKraNm = $("#sbx_clumNmDtl option:selected").text();
		reqParam.occuAcdtDbtScCdNm = $("#sbx_occuAcdtDbtScCdDtl option:selected").text();
	}

	console.log("[saveSmupMstr]reqParam:" + JSON.stringify(reqParam));

	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요.", function(obj) { 
			$("#ibx_pswd").focus(); 
		}, 1);
		return false;
	}
	
	var tmpMsg = "저장하시겠습니까?";
	if(NEW_MODI_SC_CD == "D") {
		tmpMsg = "삭제하시겠습니까?";
	}
	else {
		//집계마스터 원천테이블,컬럼,발생사고부채항목/사업비항목 중복건수 조회
		$.callAjax(reqParam, "/fi/jr/fijr114m/selectCntDetailCont.do",{async:false})
		.done(function(data) {
			console.log("[selectCntDetailCont]data.cnt:" + JSON.stringify(data));

			if (data.cnt > "0") {
				tmpMsg = "중복되는 테이블/컬럼/발생사고부채구분이 존재합니다.\n계속하시겠습니까?";
			}
		});
	}

	$.fn.msgBox(tmpMsg, function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/jr/fijr114m/saveSmupMstrTbMng.do")
			.done(function(data) {
				console.log(data);
				if(data.result == "1") {
					$.fn.msgBox("정상처리되었습니다");					
				}
				else if(data.result == "0") {
					$.fn.msgBox("처리된 데이터가 없습니다.");
				}
				else {
					$.fn.msgBox($.fn.isEmpty(data.warnning) ? "처리 실패하였습니다." : data.warnning.errorMessage);
				}
				
				setObjStateChg("SAV");
				//재조회
				selectSmupMstrTbMngList();
				
			}).fail(function(data){
				$.fn.msgBox("처리 실패하였습니다.");
			});
		}
	}, 2);
}

function saveSmupMstrExcel() {

	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요.", function(obj) { 
			$("#ibx_pswd").focus(); 
		}, 1);
		return false;
	}

	var saveList= new Array();	//저장대상 배열 선언
	var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	
	//c,u,d,e 건만 추출
	for(var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		gridData[i]["pswd"] = $("#ibx_pswd").val();
		for(var key in item) {
			//유효값체크
			
			item[key] = $.trim(item[key]);
		}
		
		item["seq"] = i + 1 + "행";
		//유효값체크
		if(!isValid(i, item)) {
			$("#ibx_pswd").val("");
			return;
		}
		
		saveList.push(item);
	}
	
	if(saveList.length == 0) {
		$.fn.msgBox("저장할 대상이 없습니다.");
		$("#ibx_pswd").val("");
		return;
	}
//	console.log("grid Data --> " + JSON.stringify(saveList));
	
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/jr/fijr114m/saveSmupMstrTbMngList.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상처리되었습니다");

					NEW_MODI_SC_CD = "U";
					setObjStateChg("SAV");
					//재조회
					selectSmupMstrTbMngList();

				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패하였습니다.");
			});
		}
	}, 2);

	setDisabled("1");
}

/**
 * @설명: byte length
 */
function strByteLength(value) {
	if(typeof value === "undefined" || value == null || value == "") {
		return 0;
	}
	
	var num = 0;
	for (var i = 0; i < value.length; i++) {
		var c = escape(value.charAt(i));
		if(c.length == 1) { num++; }
		else if(c.indexOf("%u") != -1) { num += 2; }
		else if(c.indexOf("%") != -1) { num += c.length / 3; }
	}
	
	return num;
}

function isValid(rowIndex, item) {

	//회계코드
	if($.trim(item.acctCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 회계코드를 입력하세요.");
		return false;
	}
	if($.trim(item.acntgBusnClsfCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 업무분류코드를 입력하세요.");
		return false;
	}
	if($.trim(item.acntgDlTypCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 거래유형코드를 입력하세요.");
		return false;
	}
	if($.trim(item.acntgAmtScCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액구분코드를 입력하세요.");
		return false;
	}
	if($.trim(item.amtTypScCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형구분코드를 입력하세요.");
		return false;
	}
	if($.trim(item.amtTypDtlScCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형상세구분코드를 입력하세요.");
		return false;
	}
	if($.trim(item.tbId) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 원천테이블ID를 입력하세요.");
		return false;
	}
	if($.trim(item.clumNm) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 컬럼명을 입력하세요.");
		return false;
	}
	if($.trim(item.aplcStrYm) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 유효개시월을 입력하세요.");
		return false;
	}
	if($.trim(item.aplcEndYm) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 유효종료월을 입력하세요.");
		return false;
	}
	if(strByteLength(item.note) > 300) {
		$.fn.msgBox((rowIndex + 1) + "행의 비고는 300자 이내로 입력하세요.");
		return false;
	}
	
	return true;
}

/**
 * @설명: 집계마스터 초기화(전체삭제)
 */
function deleteSmupMstr() {
//	console.log("[deleteSmupMstr]initObject:" + JSON.stringify(initObject));

	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요.", function(obj) { 
			$("#ibx_pswd").focus(); 
		}, 1);
		return false;
	}

	var reqParam = {};
	reqParam.pswd = $("#ibx_pswd").val();
	
	$.fn.msgBox("집계마스터 테이블 정보가 모두 삭제됩니다.\n진행하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/jr/fijr114m/deleteAllSmupMstrTb.do")
			.done(function(data) {
				
				console.log("[data]data:" + JSON.stringify(data));
				if(data.result >= "1") {
					$.fn.msgBox("정상처리되었습니다");
					
					setObjStateChg("SAV");
					//재조회
					selectSmupMstrTbMngList();
					
				}
				else {
					$.fn.msgBox("삭제된 데이터가 없습니다.");
				}
					
			}).fail(function(data){
				$.fn.msgBox("처리 실패하였습니다.");
			});
		}
	}, 2);
	
	setDisabled("1");
}

/**
 * @설명: 조회, 엑셀업로드 취소, 저장 후 화면 컨트롤
 */
function setObjStateChg(value) {

	$("#ibx_pswd").val("");
	$("#ipt_dtl").find("select,input,textarea").val("");
	$("#ipt_dtl").find("select,input").empty().append("<option value=''>-선택-</option>");

	if (NEW_MODI_SC_CD != "XLSX"){
		$("#btn_cancel").hide();
		$("#btn_excel_save").hide();
		$("#btn_delete").show();
		$("#btn_save").show();
	}

	if(value == 'SAV'){
		selectSmupItmCode("TB_ID", "sbx_tbId", "", "S");
		selectSmupItmCode("CLUM_NM", "sbx_clumNm", "", "S");
		selectSmupItmCode("OCCU_ACDT_DBT_SC_CD", "sbx_occuAcdtDbtScCd", "", "S");
	}

	setDisabled("1");
//	$("#ipt_dtl").find("select,input,button,textarea").attr("disabled", true);
}

/**
 * @설명: 코드 목록 조회한다.
 */
function selectItmCode(codeId, selId, value) {

	var reqParam = {};
	reqParam.codeId = codeId;
	reqParam.val = value;
	
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr114m/selectItmCdList.do",{async:false})
	.done(function(data) {

		//콤보박스 세팅
		var $targetEl = $("#" + selId);
		//콤보박스 option세팅
		var codeList = data.list;
		var optionStr = '<option value="">-';
		if(selId.endsWith("Dtl"))
			optionStr += '선택';
		else
			optionStr += '전체';
		optionStr += '-</option>';

		for (let j = 0; j < codeList.length; j++) {
			let codeData = codeList[j];
			optionStr += '<option value="' + codeData.code + '">' + codeData.codeNm + '</option>';
			//var $oEl = $("<option>").attr("value", codeData.code).text(codeData.codeNm);
		}
		$targetEl.html(optionStr);
		
	}).fail(function(data) {
		console.log("fail to selectItmCode!!!!");
	});
}

/**
 * @설명: 코드 목록 조회한다.(집계마스터테이블관리에서만 사용)
 */
function selectSmupItmCode(codeId, selId, value, sel) {
	console.log("selectSmupItmCode codeId --> " + codeId);
	var reqParam = {};
	reqParam.codeId = codeId;
	reqParam.val = value;
	reqParam.sel = sel;

	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr114m/selectSmupItmCdList.do",{async:false})
	.done(function(data) {

		//콤보박스 세팅
		$._commonObj["code"] = {}; //초기화
		$._commonObj.code[codeId] = data.list; //요청된 셀렉트박스 적용
//		console.log("[selectSmupItmCode]_commonObj:" + JSON.stringify($._commonObj));
		
		var firstText = "-전체-";
		if(selId.endsWith("Dtl")) firstText = "-선택-";

		$.fn.renderCombobox({
			useFirstOption  : true,
			firstOptionText : firstText,
			codeArr         : [codeId],
			selArr          : [selId]
		});

	}).fail(function(data) {
		console.log("fail to selectSmupItmCode!!!!");
	});
}

/**
 * @설명: 상세내용 작성 항목 활성화/비활성화 처리
 */
function setDisabled(val) {

	$(".reqchk").each(function(){
		var tmpEle = $("#"+this.id);
		if(val=="1") {
			tmpEle.attr("disabled", "false");
		}
		else {
			tmpEle.removeAttr("disabled");
		}
	});

	if(val=="1") {
		$("#sbx_occuAcdtDbtScCdDtl").attr("disabled", "false");
		$("#inp_note").attr("disabled", "false");
		$("#ipt_dtl").find("button").attr("disabled", true);
	}
	else {
		$("#sbx_occuAcdtDbtScCdDtl").removeAttr("disabled");
		$("#inp_note").removeAttr("disabled");
		$("#ipt_dtl").find("button").attr("disabled", false);
	}
}

/**
 * @설명: 그리드 데이터 초기화
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}