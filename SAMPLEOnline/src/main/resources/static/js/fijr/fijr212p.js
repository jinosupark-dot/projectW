/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-ARE내역관리-집계내역관리
 * @설명: ARE내역관리
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.05
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.03.05 최초작성
 *  황석현 2021.04.28 2차 표준화
 *  황석현 2021.06.15 3차 표준화
 *  황석현 2021.10.26 통화 조회조건 공통코드 set으로 변경
 */
var initObject = null;					//수정전 원데이터
var orgnObject = null;					//처음 조회된 원데이터
var perBtnId = ["btn_mdfc", "btn_canc", "ibx_pswd", "txt_pswd"];

$(document).ready(function(){
	var screenPermission = opener.screenPermission;
	if(screenPermission == "N") {
		//button permission
		var arrPerBtn = new Array();
		for(var i=0; i<perBtnId.length; i++){
			var perBtn = new Object();
			perBtn.btnId  = "#" + perBtnId[i];
			perBtn.action = "R";
			arrPerBtn.push(perBtn);
		}
		$.fn.setBtnPermission(arrPerBtn);
	}
		
	//포트폴리오코드조회
	selectPotflCode();
	
	//공통코드 조회
	initCommCd();
	
	//event 초기화
	initEvent();
	
	//초기설정
	initSetInfo(opener.POPUP_INFO.CUR_ROW_ITEM);
	
	//그리드 초기화	
	initGrid();
});

/**
 * @설명: 공통코드성 조회 
 * @최초작성자: 황석현
 * @최초작성일: 2021.10.26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.10.26 최초작성
 */
function initCommCd() {
	
	//공통코드 조회
	$.fn.loadCommonCode(["STND_CRNCY_CD"]);
	
	//콤보박스 세팅
	$.fn.renderCombobox({
		codeArr: ["STND_CRNCY_CD"],
		selArr: ["sbx_crncyCd"],
		firstOptionText: ["-전체-"]
	});
	
}

/**
 * @설명: 집계명세ID 정보 설정
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.03.08 최초작성
 */
function initSetInfo(val) {
	console.log("[initSetInfo]val:" + JSON.stringify(val));
	if(!$.fn.isEmpty(val)) {
		initObject = val;
		
		$("#ibx_smupSpcfId").val(val.smupSpcfId);
		$("#ibx_suggDept").val(val.trtOrgNo);
		$("#ibx_suggDeptNm").val(val.trtOrgNoNm);
		$("#ibx_suggYmd").val($.fn.dateFormat(val.suggYmd, "-"));
		$("#ibx_percEno").val(val.percEno);
		$("#ibx_percEnoNm").val(val.percEnoNm);
		$("#ibx_onlBatScCd").val(val.smupOnlBatScCd);
		$("#ibx_regntEno").val(val.smupRegntEno + " / " + val.smupRegntEnoNm);
		$("#ibx_regDtm").val(val.smupRegDtm);
		$("#ibx_trtrEno").val(val.smupTrtrEno + " / " + val.smupTrtrEnoNm);
		$("#ibx_trtDtm").val(val.smupTrtDtm);
		$("#ibx_slpOtln").val(val.slpOtln);
		
		selectSmupSpcfIdList(val.smupSpcfId);
		
		setValue(val);
	}
}

/**
 * @설명: 집계명세ID 상단 정보 설정
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.03.08 최초작성
 */
function setValue(val) {
	
	selectItmCode("ACCT_CD", "sbx_acctCd", "");
	selectItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCd", val.acctCd);
	selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", val.acntgBusnClsfCd);
	selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", val.acntgDlTypCd);
	selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", val.acntgBusnClsfCd);
	selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", val.amtTypScCd);

	$("#sbx_acctCd").val(val.acctCd);
	$("#sbx_acntgBusnClsfCd").val(val.acntgBusnClsfCd);
	$("#sbx_acntgDlTypCd").val(val.acntgDlTypCd);
	$("#sbx_acntgAmtScCd").val(val.acntgAmtScCd);
	$("#sbx_amtTypScCd").val(val.amtTypScCd);
	$("#sbx_amtTypDtlScCd").val(val.amtTypDtlScCd);
	$("#sbx_crncyCd").val(val.crncyCd);
	$("#ibx_slpTrnsScCd").val(val.slpTrnsScCd);  //전표전송구분
	
	//전표생성여부
	if(val.slpCretYn == "Y") {
		$("#slpCretY").prop("checked", true);
		$("#slpCretN").prop("checked", false);
	}else{
		$("#slpCretY").prop("checked", false);
		$("#slpCretN").prop("checked", true);
	}
	//취소여부
	if(val.cancYn == "Y") {
		$("#cancY").prop("checked", true);
		$("#cancN").prop("checked", false);
	}else{
		$("#cancY").prop("checked", false);
		$("#cancN").prop("checked", true);
	}
	//건별취소여부
	if(val.indvCancYn == "Y") {
		$("#indvCancY").prop("checked", true);
		$("#indvCancN").prop("checked", false);
	}else{
		$("#indvCancY").prop("checked", false);
		$("#indvCancN").prop("checked", true);
	}
}

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.03.03 최초작성
 */
function initEvent() {
	
	//공통코드 조회
	$.fn.loadCommonCode(["JOUL_MSTK_CD", "SLP_TRNS_SC_CD"]);
	
	//콤보박스 세팅
	$.fn.renderCombobox({
		codeArr: ["SLP_TRNS_SC_CD"],
		selArr: ["ibx_slpTrnsScCd"],
		firstOptionText: [""]
	});
	
	//발의부서 검색 팝업창
	$("#btn_deptSearch").on("click", function(e){
		openPopupDeptSearch();
	});
	
	//처리자 검색 팝업창
	$("#btn_trtrSearch").on("click", function(e){
		callPopupUserSearch();
	});
	
	// 회계코드 change
	$("#sbx_acctCd").on("change", function(e){
		selectItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCd", $(this).val());
	});
	
	// 업무분류 change
	$("#sbx_acntgBusnClsfCd").on("change", function(e){
		setItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "MAIN");
		setItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "MAIN");
		setItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", "MAIN");
		setItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", "MAIN");
	});
	
	// 거래유형 change
	$("#sbx_acntgDlTypCd").on("change", function(e){
		setItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "");
		setItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "");
		setItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", "");
		setItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", "");
	});
	
	// 금액구분 change
	$("#sbx_acntgAmtScCd").on("change", function(e){
		setItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "");
		setItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "");
		setItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", "");
		setItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", "");
	});
	
	// 금액유형 change
	$("#sbx_amtTypScCd").on("change", function(e){
		setItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "");
		setItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "");
		setItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", "");
		setItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", "");
	});

	// 금액유형상세 change
	$("#sbx_amtTypDtlScCd").on("change", function(e){
		setItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "");
		setItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "");
		setItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", "");
		setItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", "");
	});
	
	//수정
	$("#btn_mdfc").on("click", function(e){
		callMdfcTrt();
	});
	
	//취소
	$("#btn_canc").on("click", function(e){
		callCancTrt();
	});
	
	//초기화
	$("#btn_init").on("click", function(e){
		selectSmupSpcfIdList($("#ibx_smupSpcfId").val());
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.03 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 80,
		editing: true,
		sorting: true,
		paging: false,
		confirmDeleting: false,
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				var status = 'u';	//수정
				if(item.status == 'c' || item.status == 'e') {	//신규, 엑셀로드는  c, e상태 유지 후 데이터 수정
				} else if(item.status == 'dd'){	//삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				return item;
			}		
		},
		fields : [
			{ name: "finYm", title:"마감년월", css:"cell", type: "text", width: 60, editing: false, align:"center", itemTemplate:function(value, item) {
				return $.fn.monthFormat(value, "-");			
			}},
			{ name: "whlCongrId", title:"계약집합ID", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				
				return $result;
			}},
			{ name: "potflScCd", title:"포트폴리오구분코드", css:"cell", type: "select", width: 140, editing: true, align:"center", 
				items : codeItemList,
				textField: "codeNm",
				valueField: "code",
				editTemplate:function(value,item) {
			
				var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value, item);
				
				$result.on("click", function() {
					$(this).select();
				});
				
				return $result;
			}},
			{ name: "dlCrncyFlctAmt", title:"거래화폐변동금액", css:"cell", type: "text", width: 120, editing: true, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}, editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				$result.on("click", function() {
					$(this).select();
				});
				
				$result.inputFilter(function(value) {
					
					if($.isNumber(value)) {
						return true;
					} else {
						return false;
					}
				})
				
				return $result;
			}},
			{ name: "acplcCrncyFlctAmt", title:"현지화폐변동금액", css:"cell", type: "text", width: 120, editing: true, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}, editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				$result.on("click", function() {
					$(this).select();
				});
				
				$result.inputFilter(function(value) {
					
					if($.isNumber(value)) {
						return true;
					} else {
						return false;
					}
				})
				
				return $result;
			}},
			{ name: "acplcCrncyCumlAmt", title:"현지화폐누적금액", css:"cell", type: "text", width: 120, editing: true, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}, editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				$result.on("click", function() {
					$(this).select();
				});
				
				$result.inputFilter(function(value) {
					
					if($.isNumber(value)) {
						return true;
					} else {
						return false;
					}
				})
				
				return $result;
			}},
			{ name: "acntgBatKeyVal", title:"경리배치키값", css:"cell", type: "text", width: 70, editing: false, align:"center"},
			{ name: "tbNm", title:"테이블명", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "clumKraNm", title:"컬럼명", css:"cell", type: "text", width: 90, editing: false, align:"center"},
			{ name: "joulMstkCd", title:"분개오류코드", css:"cell", type: "select", width: 100, editing: false, align:"center",
				items: $.fn.getGridCodeItem("JOUL_MSTK_CD", true),
				textField: "codeNm",
				valueField: "code"
			}
		]
	});	
	
	//그리드 생성
	gridObject.gridCreate();
	
	$(".jsgrid-grid-header,.jsgrid-grid-body").css("overflow-y","hidden");
}

/**
 * @설명: 부서검색 팝업을 호출한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.05
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 황석현 2021.03.05 최초작성
 */
function openPopupDeptSearch() {
	activityGrideType = "dept";	
	var popupOption = {
			url: "/fi/mt/fimt111p.do",
			name: "부서번호조회팝업",
			width: 800,
			height: 464
	}
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 부서조회 팝업 콜백
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.05
 * @최종변경일:
 * @매개변수: resultObj
 * @반환값:
 * @개정이력: 황석현 2021.03.05 최초작성
 */
function resultPopup_callback(resultObj) {
	console.log("[부서조회 팝업 콜백] resultObj", resultObj);
	
	$("#ibx_suggDept").val(resultObj.stactActFinDeptCd);
	$("#ibx_suggDeptNm").val(resultObj.stactActFinDeptNm);
}

/**
 * @설명: 사원검색 팝업을 호출한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.05
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 황석현 2021.03.05 최초작성
 */
var roleGrideType="user";
function callPopupUserSearch() {
	var popupOption = {
			url: "/mg/sy/mgsy211p.do",
			name: "사원번호조회팝업",
			width: 800,
			height: 464
	}
	var popup = $.fn.openPopup(popupOption);
}

/**
 * @설명: 사원조회 팝업 콜백
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.05
 * @최종변경일:
 * @매개변수: resultObj
 * @반환값:
 * @개정이력: 황석현 2021.03.05 최초작성
 */
function resultUserPopup_callback(resultObj){
	console.log("resultTablePopup_callback   resultObj", resultObj);

	$("#ibx_percEno").val(resultObj.userEno);
	$("#ibx_percEnoNm").val(resultObj.userNm);
}

/**
 * @설명: 코드 목록 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.05
 * @최종변경일: 
 * @매개변수:	codeId : 조회할 코드 대상
 * 			selId : 조회결과 바인딩 콤보박스
 * 			value : 종속하는 코드값
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.05 최초작성
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
		var optionStr = '<option value="">-선택-</option>';
		for (let j = 0; j < codeList.length; j++) {
			let codeData = codeList[j];
			optionStr += '<option value="' + codeData.code + '">' + codeData.codeNm + '</option>';
		}
		$targetEl.html(optionStr);
		
	}).fail(function(data) {
		console.log("fail to selectItmCode!!!!");
	});
}

var codeItemList = [];
function selectPotflCode() {
	var reqParam = null;
	var codeDataList = [{code:"", codeNm:""}]; //첫줄 빈값
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr212p/selectPotflCd.do",{async:false})
	.done(function(data) {
		var tmpCodeDataList = data.list;
		for(var i=0; i<tmpCodeDataList.length; i++) {
			var tmpCode = tmpCodeDataList[i];
			var newCode = {
					"code": tmpCode.code,
					"codeNm":tmpCode.code + ":" + tmpCode.codeNm
			}
			codeDataList.push(newCode);
		}
		codeItemList = codeItemList.concat(codeDataList);
	}).fail(function(data) {
		console.log("fail to selectPotflCode!!!!");
	});
}

/**
 * @설명: 수정시 적용할 분개항목코드 조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.09
 * @최종변경일: 
 * @매개변수:	codeId : 조회할 코드 대상
 * 			selId : 조회결과 바인딩 콤보박스
 * 			value : 종속하는 코드값
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.09 최초작성
 */
function setItmCode(codeId, selId, val) {
	var reqParam = {};
	reqParam.codeId = codeId;
	reqParam.acctCd = $("#sbx_acctCd").val();
	reqParam.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCd").val();
	//업무분류 변경시
	if(val != "MAIN") {
		reqParam.acntgDlTypCd = $("#sbx_acntgDlTypCd").val();
		reqParam.acntgAmtScCd = $("#sbx_acntgAmtScCd").val();
		reqParam.amtTypScCd = $("#sbx_amtTypScCd").val();
		reqParam.amtTypDtlScCd = $("#sbx_amtTypDtlScCd").val();
	}
//	console.log("setItmCode===>" + reqParam);
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr111m/setItmCode.do",{async:false})
	.done(function(data) {
		//콤보박스 세팅
		var $targetEl = $("#" + selId);
		//콤보박스 option세팅
		var codeList = data.list;
		var optionStr = '<option value="">-선택-</option>';
		for (let j = 0; j < codeList.length; j++) {
			let codeData = codeList[j];
			optionStr += '<option value="' + codeData.code + '">' + codeData.codeNm + '</option>';
		}
		$targetEl.html(optionStr);

		//기존있던값은 그대로 셋팅
		$("#sbx_acctCd").val(reqParam.acctCd);
		$("#sbx_acntgBusnClsfCd").val(reqParam.acntgBusnClsfCd);
		$("#sbx_acntgDlTypCd").val(reqParam.acntgDlTypCd);
		$("#sbx_acntgAmtScCd").val(reqParam.acntgAmtScCd);
		$("#sbx_amtTypScCd").val(reqParam.amtTypScCd);
		$("#sbx_amtTypDtlScCd").val(reqParam.amtTypDtlScCd);
		
	}).fail(function(data) {
		console.log("fail to setItmCode!!!!");
	});
}

/**
 * @설명: 집계명세ID 데이터 조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: val
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.04 최초작성
 */
function selectSmupSpcfIdList(val) {
	
	if($.fn.isEmpty(val)) {
		$.fn.msgBox("집계명세ID 누락입니다. 확인바랍니다."); //ECIU113 {0}입니다. 확인바랍니다. 
		return false;
	}
	
	var reqParam = {};
	reqParam.smupSpcfId = val;

	// 데이터 조회
	$.callAjax(reqParam, "/fi/jr/fijr212p/selectSmupSpcfIdList.do")//,{async:false})
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		orgnObject = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectSmupSpcfIdList !!");
	});
	
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.04 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}

/**
 * @설명: 취소 실행
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수:
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.08 최초작성
 */
function callCancTrt() {
	console.log("<<<<< callCancTrt Start >>>>>");
	
	if($.fn.isEmpty(orgnObject)) {
		$.fn.msgBox("집계명세ID가 조회되지 않았습니다. 확인바랍니다."); //EACU007	{0} 확인바랍니다.
		return false;
	}
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}

	//수정할 수 있는 경우 에러 방지
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}

	var pswd = $("#ibx_pswd").val();
	var reqParam = {};
	reqParam.pswd = pswd;
	reqParam.smupSpcfId = $("#ibx_smupSpcfId").val();
	reqParam.finYm = initObject.finYm;
	reqParam.orgnAcntgSlpId = initObject.acntgSlpId;
	reqParam.orgnAcctSlpId = initObject.acctSlpId;
	
	//비밀번호 체크 성공 후 취소 배치 호출
	$.fn.msgBox("취소 하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			// 데이터 조회
			$.callAjax(reqParam, "/fi/jr/fijr212p/cancTrt.do")
			.done(function(data) {
				
				//성공이면 true 서버에서 Warning 않으면 false 값 가져옴.
				//서버에서 Warning 처리시 실패 경우 -1
				console.log("callCancTrt result0000>>>>" + data.result);
				if(data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.", function() {
						opener.openPopupId_callback(data);
						window.close();
					});
				}
			}).fail(function(data){
				$.fn.msgBox("데이터 불러오기 실패");
				console.log("fail to selectUserInfo !!");
			});			
		}
	}, 2);

}


/**
 * @설명: 수정 실행
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: val
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.08 최초작성
 */
function callMdfcTrt() {

	console.log("<<<<< callMdfcTrt Start >>>>>");

	if($.fn.isEmpty(orgnObject)) {
		$.fn.msgBox("집계명세ID가 조회되지 않았습니다. 확인바랍니다."); //EACU007	{0} 확인바랍니다.
		return false;
	}
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}

	//그리드 수정 후 버튼 클릭시 반영 
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	
	//현재 그리드 데이터 가져오기
	var reqParamCurInfo = {};
	reqParamCurInfo = $("#gridDiv").jsGrid("option", "data")[0];
	
	//화면에서 넘어온 데이터 initObject
	//신규AR 데이터 reqParamAreInfo
	var reqParamAreInfo = {};
	reqParamAreInfo.smupSpcfId = $("#ibx_smupSpcfId").val();
	reqParamAreInfo.finYm = initObject.finYm;
	reqParamAreInfo.acctCd = $("#sbx_acctCd").val();
	reqParamAreInfo.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCd").val();
	reqParamAreInfo.acntgDlTypCd = $("#sbx_acntgDlTypCd").val();
	reqParamAreInfo.acntgAmtScCd = $("#sbx_acntgAmtScCd").val();
	reqParamAreInfo.amtTypScCd = $("#sbx_amtTypScCd").val();
	reqParamAreInfo.amtTypDtlScCd = $("#sbx_amtTypDtlScCd").val();
	reqParamAreInfo.whlCongrId = reqParamCurInfo.whlCongrId;
	reqParamAreInfo.potflScCd = reqParamCurInfo.potflScCd;
	reqParamAreInfo.dlCrncyFlctAmt = reqParamCurInfo.dlCrncyFlctAmt;
	reqParamAreInfo.acplcCrncyFlctAmt = reqParamCurInfo.acplcCrncyFlctAmt;
	reqParamAreInfo.acplcCrncyCumlAmt = reqParamCurInfo.acplcCrncyCumlAmt;
	reqParamAreInfo.tbId = initObject.tbId;
	reqParamAreInfo.tbNm = initObject.tbNm;
	reqParamAreInfo.clumNm = initObject.clumNm;
	reqParamAreInfo.clumKraNm = initObject.clumKraNm;
	reqParamAreInfo.percEno = $("#ibx_percEno").val();
	reqParamAreInfo.trtOrgNo = $("#ibx_suggDept").val();
	reqParamAreInfo.crncyCd = $("#sbx_crncyCd").val();
	reqParamAreInfo.suggYmd = initObject.suggYmd;
	reqParamAreInfo.pswd = $("#ibx_pswd").val();
	reqParamAreInfo.orgnAcntgSlpId = initObject.acntgSlpId; //취소로직 필요한 경리전표ID
	reqParamAreInfo.orgnAcctSlpId = initObject.acctSlpId;
	
	console.log("[callMdfcTrt]reqParamAreInfo:" + JSON.stringify(reqParamAreInfo));
	
	$.fn.msgBox("생성 하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			// 데이터 조회
			$.callAjax(reqParamAreInfo, "/fi/jr/fijr212p/mdfcTrt.do")
			.done(function(data) {
				
				//성공이면 true 서버에서 Warning 않으면 false 값 가져옴.
				//서버에서 Warning 처리시 실패 경우 -1
				console.log("callMdfcTrt result0000>>>>" + data.result);
				if(data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.", function() {
						opener.openPopupId_callback(data);
						window.close();
					});
				}
			}).fail(function(data){
				$.fn.msgBox("데이터 불러오기 실패");
				console.log("fail to selectUserInfo !!");
			});
		}
	}, 2);

}
