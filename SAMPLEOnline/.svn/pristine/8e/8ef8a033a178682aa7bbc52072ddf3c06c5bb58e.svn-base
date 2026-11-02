/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-분개규칙_이력조회 관리
 * @설명: 분개규칙_이력조회 관리 화면
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.29
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.01.29 최초작성
 *  황석현 2021.04.28 2차 표준화
 *  황석현 2021.06.15 3차 표준화
 */

$(document).ready(function(){
	
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	//공통코드 및 경리계정색인코드 콤보박스 
	initCommCd();
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	//회계코드 초기화
	selectItmCode("ACCT_CD", "sbx_acctCd", "");
	
	$("#sbx_acctCd").focus();
	
});

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.29
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.01.29 최초작성
 */
function initEvent() {
	//조회
	$("#btn_search").on("click", function(e){
		selectJoulRlHstrList();
	});

	// 회계코드 change
	$("#sbx_acctCd").on("change", function(e){
		selectItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCd", $(this).val());
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "");
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", "");
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "");
	});
	
	// 업무분류 change
	$("#sbx_acntgBusnClsfCd").on("change", function(e){
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", $(this).val());
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", $(this).val());
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "");
	});
	
	// 거래유형 change
	$("#sbx_acntgDlTypCd").on("change", function(e){
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", $(this).val());
	});
	
	// 금액유형 change
//	$("#sbx_amtTypScCd").on("change", function(e){
//		selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", $(this).val());
//	});
	
	//엑셀다운로드
	$("#btn_excel_download").on("click", function(e){
		var fileName = "재무회계_분개규칙_이력조회" + ".xlsx";
		$.fn.exportGridExcel({
			id: 'gridDiv', 
			fileName: fileName
		});
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
	$("#sbx_acctCd, #sbx_acntgBusnClsfCd, #sbx_acntgDlTypCd, #sbx_acntgAmtScCd, #sbx_amtTypScCd").on("keypress", function(e) {
		if(e.keyCode == 13) {
			$("#btn_search").click();
			return false;
		}
	});
}

/**
 * @설명: 공통코드성 조회 
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.26 최초작성
 */
function initCommCd() {
	
	//공통코드 조회
	$.fn.loadCommonCode(["CRDR_SC_CD","CALC_SGN_CD"]);
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.29
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.29 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 630,
		editing: false,
		sorting: true,
		paging: true,
		confirmDeleting: false,
		fields : [
			{ name: "acctCd", title:"회계코드", css:"cell", type: "text", width: 75, editing: false, align:"center"},
			{ name: "acctCdNm", title:"회계코드명", css:"cell", type: "text", width: 80, editing: false, align:"left"},
			{ name: "acntgBusnClsfCd", title:"업무분류", css:"cell", type: "text", width: 75, editing: false, align:"center"},
			{ name: "acntgBusnClsfCdNm", title:"업무분류명", css:"cell", type: "text", width: 100, editing: false, align:"left"},
			{ name: "acntgDlTypCd", title:"거래유형", css:"cell", type: "text", width: 85, editing: false, align:"center"},
			{ name: "acntgDlTypCdNm", title:"거래유형명", css:"cell", type: "text", width: 150, editing: false, align:"left"},
			{ name: "acntgAmtScCd", title:"금액구분", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "acntgAmtScCdNm", title:"금액구분명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "amtTypScCd", title:"금액유형구분", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "amtTypScCdNm", title:"금액유형구분명", css:"cell", type: "text", width: 150, editing: false, align:"left"},
			{ name: "amtTypDtlScCd", title:"금액유형상세구분", css:"cell", type: "text", width: 130, editing: false, align:"center"},
			{ name: "amtTypDtlScCdNm", title:"금액유형상세구분명", css:"cell", type: "text", width: 250, editing: false, align:"left"},
			{ name: "joulSno", title:"번호", css:"cell", type: "number", width: 70, editing: false, align:"center"},
			{ name: "crdrScCd", title:"차대", css:"cell", type: "select", width: 90, editing: false, align:"center",
				items: $.fn.getGridCodeItem("CRDR_SC_CD", true),
				textField: "codeNm",
				valueField: "code"			
			},
			{ name: "acitmCd", title:"계정과목", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "acntNm", title:"계정과목명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "acntInxCd", title:"계정Index코드", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "acntInxCdNm", title:"계정Index", css:"cell", type: "text", width: 150, editing: false, align:"left"},
			{ name: "recptYn", title:"환입여부", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "recptAcitmCd", title:"환입계정과목", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "ecqDcdYn", title:"당분기말확정", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "calcSgnCdNm", title:"부호", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "deltYn", title:"삭제여부", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "chgTrtDtm", title:"변경처리일시", css:"cell", type: "text", width: 250, editing: false, align:"center"},
			{ name: "avlBgnYmd", title:"유효개시일자", css:"cell", type: "text", width: 100, editing: false, align:"center",
				itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");
				}
			},
			{ name: "avlEndYmd", title:"유효종료일자", css:"cell", type: "text", width: 100, editing: false, align:"center",
				itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");
				}	
			}
		]
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
 * @설명: 코드 목록 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.29
 * @최종변경일: 
 * @매개변수:	codeId : 조회할 코드 대상
 * 			selId : 조회결과 바인딩 콤보박스
 * 			value : 종속하는 코드값
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.29 최초작성
 */
function selectItmCode(codeId, selId, value) {
	//console.log("selectItmCode codeId --> " + codeId);
	var reqParam = {};
	reqParam.codeId = codeId;
	reqParam.val = value;
	
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr113m/selectItmCdList.do",{async:false})
	.done(function(data) {
		//콤보박스 세팅
		var $targetEl = $("#" + selId);
		//콤보박스 option세팅
		var codeList = data.list;
		var optionStr = '<option value="">-전체-</option>';
		for (let j = 0; j < codeList.length; j++) {
			let codeData = codeList[j];
			optionStr += '<option value="' + codeData.code + '">' + codeData.codeNm + '</option>';
		}
		$targetEl.html(optionStr);
		
	}).fail(function(data) {
		console.log("fail to selectItmCode!!!!");
	});
}

function isEmpty(value) {
	return typeof value === "undefined" || value == null || value == "" ? true : false;
}

/**
 * @설명: 분개규칙 이력 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.29
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.29 최초작성
 */
function selectJoulRlHstrList() {
	var reqParam = {};
	reqParam.acctCd = $("#sbx_acctCd").val();
	reqParam.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCd").val();
	reqParam.acntgDlTypCd = $("#sbx_acntgDlTypCd").val();
	reqParam.acntgAmtScCd = $("#sbx_acntgAmtScCd").val();
	reqParam.amtTypScCd = $("#sbx_amtTypScCd").val();
	reqParam.amtTypDtlScCd = $("#inp_amtTypDtlScCd").val();

	// 데이터 조회
	$.callAjax(reqParam, "/fi/jr/fijr112m/selectJoulRlHstrMngList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		
		//화면에 보여줄 부호 셋팅
		if(!$.fn.isEmpty(listData)){
			var calcObj = $._commonObj.code["CALC_SGN_CD"];
			for(var i=0;i<listData.length;i++){
				listData[i].calcSgnCdNm = "";
				for(var k=0;k<calcObj.length;k++){
					if(listData[i].calcSgnCd == calcObj[k].code){
						listData[i].calcSgnCdNm = calcObj[k].codeNm;
						break;
					}
				}
			}
		}
		
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulRlHstrList !!");
	});
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.29
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.29 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}