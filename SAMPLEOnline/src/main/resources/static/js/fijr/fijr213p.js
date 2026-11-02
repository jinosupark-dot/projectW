/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-ARE내역관리-경리전표ID
 * @설명: ARE내역관리
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.05
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.03.05 최초작성
 *  황석현 2021.04.28 2차 표준화
 *  황석현 2021.06.15 3차 표준화
 */
$(document).ready(function(){
//	console.log("opener.POPUP_INFO.name ===> " + opener.POPUP_INFO.name);
//	console.log("opener.POPUP_INFO.CUR_ROW_ITEM ===> " + opener.POPUP_INFO.CUR_ROW_ITEM.acctCd);
	
	//공통코드 조회
	$.fn.loadCommonCode(["SLP_TRNS_SC_CD"]);
	
	initSetInfo(opener.POPUP_INFO.CUR_ROW_ITEM);
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
});

/**
 * @설명: 경리전표ID 정보 설정
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.03.08 최초작성
 */
function initSetInfo(val) {
	console.log("[initSetInfo]val:" + JSON.stringify(val));
	if(!$.fn.isEmpty(val)) {
		
		$("#ibx_acntgSlpId").val(val.acntgSlpId);
		$("#ibx_smupSpcfId").val(val.smupSpcfId);
		$("#ibx_acctSlpId").val(val.acctSlpId);
		$("#ibx_sapsSlpNo").val(val.sapsSlpNo);
		$("#ibx_faceoAcntgSlpId").val(val.faceoAcntgSlpId);
		$("#ibx_orgnAcctSlpId").val(val.orgnAcctSlpId);
		$("#ibx_faceoAcctSlpId").val(val.faceoAcctSlpId);
		$("#ibx_suggDeptOrgNo").val(val.trtOrgNo + " / " + val.trtOrgNoNm);
		$("#ibx_suggYmd").val($.fn.dateFormat(val.suggYmd, "-"));
		$("#ibx_percEno").val(val.percEno + " / " + val.percEnoNm);
		$("#ibx_acctCd").val(val.acctCdNm);
		$("#sbx_acntgBusnClsfCd").val(val.acntgBusnClsfCdNm);
		$("#sbx_acntgDlTypCd").val(val.acntgDlTypCdNm);
		$("#sbx_acntgAmtScCd").val(val.acntgAmtScCdNm);
		$("#sbx_amtTypScCd").val(val.amtTypScCdNm);
		$("#sbx_amtTypDtlScCd").val(val.amtTypDtlScCdNm);
		$("#ibx_acctLedKndCd").val(val.acctLedKndCd);
		$("#ibx_slpCntnt").val(val.slpCntnt);
		$("#ibx_slpTypCd").val(val.slpTypCd);
		var obj = $._commonObj.code["SLP_TRNS_SC_CD"];
		for(var k=0;k<obj.length;k++){
			if(val.slpTrnsScCd == obj[k].code){
				$("#ibx_slpTrnsScCd").val(obj[k].codeNm);
				break;
			}
		}
		$("#ibx_onlBatScCd").val(val.acntgOnlBatScCd);
		$("#ibx_regntEno").val(val.acntgRegntEno + " / " + val.acntgRegntEnoNm);
		$("#ibx_regDtm").val(val.acntgRegDtm);
		$("#ibx_trtrEno").val(val.acntgTrtrEno + " / " + val.acntgTrtrEnoNm);
		$("#ibx_trtDtm").val(val.acntgTrtDtm);
		
		selectAcntgSlpIdList(val.acntgSlpId);
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
	$.fn.loadCommonCode(["CRDR_SC_CD"]);
	
	//엑셀다운로드
	$("#btn_excel_download").on("click", function(e){
		var fileName = "재무회계_ARE내역관리_경리전표상세조회" + ".xlsx";
		$.fn.exportGridExcel({
			id: 'gridDiv', 
			fileName: fileName
		});
	});

	//조회
	$("#btn_search").on("click", function(e){
		selectAreList();
	});

	//닫기
	$("#btn_closePopup").on("click", function(e){
		popupClose();
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
		height: 180,
		editing: false,
		sorting: true,
		paging: false,
		confirmDeleting: false,
		// 특정(소계) 행이면 "sub-total" css class를 append한다.
		rowClass: function(item, itemIndex) {
			if(item.acitmCd == "소 계") { return "sub-total"; }
		},
		fields : [
			{ name: "slpLinNo", title:"라인", css:"cell", type: "text", width: 40, editing: false, align:"center"},
			{ name: "crdrScCd", title:"차대", css:"cell", type: "select", width: 70, editing: false, align:"center",
				items: $.fn.getGridCodeItem("CRDR_SC_CD", true),
				textField: "codeNm",
				valueField: "code"
			},
			{ name: "acitmCd", title:"계정과항목코드", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "acitmCdNm", title:"계정과목명", css:"cell", type: "text", width: 170, editing: false, align:"left"},
			{ name: "potflScCd", title:"포트폴리오구분", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "whlCongrId", title:"계약집합ID", css:"cell", type: "text", width: 95, editing: false, align:"center"},
			{ name: "crncyCd", title:"통화", css:"cell", type: "text", width: 50, editing: false, align:"center"},
			{ name: "drAmt", title:"차변금액", css:"cell", type: "text", width: 140, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "drKrwAmt", title:"차변금액KRW", css:"cell", type: "text", width: 140, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "crAmt", title:"대변금액", css:"cell", type: "text", width: 140, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "crKrwAmt", title:"대변금액KRW", css:"cell", type: "text", width: 140, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}}
		]
	});
	
	//그리드 생성
	gridObject.gridCreate();
	
}

/**
 * @설명: 경리전표ID 데이터 조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: val
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.04 최초작성
 *  황석현 2021.06.15 3차 표준화
 */
function selectAcntgSlpIdList(val) {
	
	if($.fn.isEmpty(val)) {
		$.fn.msgBox("경리전표ID 누락입니다. 확인바랍니다."); //ECIU113 {0}입니다. 확인바랍니다. 
		return false;
	}
	
	var reqParam = {};
	reqParam.acntgSlpId = val;

	// 데이터 조회
	$.callAjax(reqParam, "/fi/jr/fijr213p/selectAcntgSlpIdList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
		 
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectAcntgSlpList !!");
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
 * @설명: 팝업을 닫는다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.04 최초작성
 */
function popupClose() {
	window.close();
}