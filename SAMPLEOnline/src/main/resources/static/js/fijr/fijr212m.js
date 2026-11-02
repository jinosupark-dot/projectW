/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-ARE내역관리
 * @설명: ARE내역관리
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.04
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.03.04 최초작성
 *  황석현 2021.04.28 2차 표준화
 *  황석현 2021.06.15 3차 표준화
 *  황석현 2021.10.26 SAP재무제표버전수신 버튼 추가(BTIFIDC100 호출)
 *  황석현 2021.10.26 통화 조회조건 공통코드 set으로 변경
 */
var perBtnId = ["btn_reTrt", "btn_rsltFile", "btn_fnstVcdReci", "ibx_pswd", "txt_pswd"];

$(document).ready(function(){
	
	//button permission
	var arrPerBtn = new Array();
	for(var i=0; i<perBtnId.length; i++){
		var perBtn = new Object();
		perBtn.btnId  = "#" + perBtnId[i];
		perBtn.action = "R";
		arrPerBtn.push(perBtn);
	}
	$.fn.setBtnPermission(arrPerBtn);
	
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	//공통코드성 초기화
	initCommCd();
	
	//event 초기화
	initEvent();
	
	//마감년월 초기화
	initYymm();
	
	//그리드 초기화	
	initGrid();
	
	//회계코드 초기화
	selectItmCode("ACCT_CD", "sbx_acctCd", "");
	
	$("#ibx_finYm").select();
});

/**
 * @설명: 공통코드성 조회 
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.03 최초작성
 */
function initCommCd() {
	
	//공통코드 조회
	$.fn.loadCommonCode(["JOUL_MSTK_CD", "STND_CRNCY_CD"]);
	
	//콤보박스 세팅
	$.fn.renderCombobox({
		codeArr: ["STND_CRNCY_CD"],
		selArr: ["sbx_crncyCd"],
		firstOptionText: ["-전체-"]
	});
	
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
	
	//마감년월 입력창 blur
	$("#ibx_finYm").on("blur", function(e) {
		//빈값 체크
		if($.fn.isEmpty(this.value)) {
			return;
		}
		
		//날짜형식 체크
		if($.isValidYm(this.value)) {
			$(this).val($.fn.monthFormat(this.value, "-"));
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.");
			$(this).focus();
		}
	}).on("keydown", function(e){	// Enter키로 검색어 조회: #표준용엉한글명
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidYm(this.value)) {
				$(this).val($.fn.monthFormat(this.value, "-"));
				
				
				selectAreList();
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		}
	}).on("click", function(e){	//마감년월 입력창 click
		$(this).select();
	});
	
	//마감년월 달력버튼 click
	$("#btn_finYm").on("click", function(e){
		$("#ibx_finYm").datepicker("show");
	});
	
	//발의부서
	$("#ibx_suggDept").on("blur", function(e) {
		//빈값 체크
		if($.fn.isEmpty(this.value)) {
			$("#ibx_suggDeptNm").val("");
		}
	});
	
	//발의부서 검색 팝업창
	$("#btn_deptSearch").on("click", function(e){
		callPopupDeptSearch();
	});

	//처리자
	$("#ibx_trtr").on("blur", function(e) {
		//빈값 체크
		if($.fn.isEmpty(this.value)) {
			$("#ibx_trtrNm").val("");
		}
	});

	//처리자 검색 팝업창
	$("#btn_trtrSearch").on("click", function(e){
		callPopupUserSearch();
	});
	
	// 회계코드 change
	$("#sbx_acctCd").on("change", function(e){
		selectItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCd", $(this).val());
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "");
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", "");
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "");
//		selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", "");
	});
	
	// 업무분류 change
	$("#sbx_acntgBusnClsfCd").on("change", function(e){
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", $(this).val());
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", $(this).val());
	});
	
	// 거래유형 change
	$("#sbx_acntgDlTypCd").on("change", function(e){
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", $(this).val());
	});
	
	// 금액유형 change
//	$("#sbx_amtTypScCd").on("change", function(e){
//		selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", $(this).val());
//	});
	
	//집계명세ID
	$("#ibx_smupSpcfId").on("keyup", function(e) {
		//숫자입력만 가능
		var val = $(this).val();
		$(this).val(val.replace(/[^\d]/g, ""));
	});
	
	//회계전표ID
	$("#ibx_acctSlpId").on("keyup", function(e) {
		var val = $(this).val();
//		$(this).val(val.replace(/[^\d]/g, ""));
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		selectAreList();
	});
	
	//재처리
	$("#btn_reTrt").on("click", function(e){
		reTrns();
	});
	
	//SAP결과파일 수신
	$("#btn_rsltFile").on("click", function(e){
		callReciRsltFile();
	});
	
	//SAP재무제표버전수신
	$("#btn_fnstVcdReci").on("click", function(e){
		callReciFnstVcd();
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
	$("#ibx_suggDept, #ibx_trtr, #sbx_OnlBatScCd, #sbx_acctCd, #sbx_acntgBusnClsfCd, #sbx_acntgDlTypCd, #sbx_acntgAmtScCd, #sbx_amtTypScCd, #sbx_trnsStatCd, #sbx_nrmCancScCd, #sbx_crncyCd, #ibx_smupSpcfId").on("keypress", function(e) {
		if(e.keyCode == 13) {
			$("#btn_search").click();
			return false;
		}
	});
}

/**
 * @설명: 마감년월 설정
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.04 최초작성
 */
function initYymm() {
	//마감년월 - 전월
	var nowDate = new Date();
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth();
	
	var temp = new Date(year, month, "1");
	temp.setMonth(month - 1);
	
	year = temp.getFullYear();
	month = (temp.getMonth() + 1).toString();
	month = month.length == 1 ? "0" + month : month;
	
	//마감년월 세팅
	$("#ibx_finYm").val($.fn.monthFormat(year + month, "-"));
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
		height: 550,
		editing: false,
		sorting: true,
		paging: true,
		confirmDeleting: false,
		pageSize: 17,
		fields : [
			{ name: "check", title: "선택", width: 40, sorting: false, editing: false, align:"center", headerTemplate:function() {
				return $("<input>").attr("id", "ckb_all").attr("type", "checkbox").on("change", function() {
					grid_check_all(this.checked);
				});
			}, itemTemplate:function(value, item) {
				var $result = $("<input>").attr("type", "checkbox").attr("checked", value || item.checked).on("change", function() {
					item.checked = $(this).is(":checked");
					
					var data = $("#gridDiv").jsGrid("option", "data");
					var listCnt = 0;
					var checkCnt = 0;
					for (var i = 0; i < data.length; i++) {
						if(data[i].statNm == "전표생성" || data[i].statNm == "전표발의오류" || (data[i].statNm == "접수" && !$.fn.isEmpty(data[i].dtlMstkCntnt)) ) {
							listCnt++;
						}
						if(data[i].checked) {
							checkCnt++;
						}
					}
					
					if(checkCnt == listCnt) {
						$("#ckb_all").prop("checked", true);
					} else {
						$("#ckb_all").prop("checked", false);
					}
					
				});

				//접수, 전표발의중, 전표발의 경우는 체크 못 함
				//접수 && 처리결과 있는 경우 = 분개 오류 상태(분개규칙 부재, 필수값 부재) 재처리 진행(JR생성-SJR생성-SAP 전송)
				if(!(item.statNm == "전표생성" || item.statNm == "전표발의오류" || (item.statNm == "접수" && !$.fn.isEmpty(item.dtlMstkCntnt)))   ) {
					$result.attr("disabled", true);
				}

				return $result;
			}},
			{ name: "smupSpcfId", title:"집계명세ID", css:"cell", type: "text", width: 180, editing: false, align:"center"
				, itemTemplate:function(value, item) {
				var $aEl = $("<a>").attr("href", "javascript:void(0);").css("text-decoration", "underline").text(value).on("click", function() {
					callPopupAreSearch("smup", item);
			});
				return $("<div>").append($aEl);
			}},
			{ name: "acctCdNm", title:"회계코드", css:"cell", type: "text", width: 70, editing: false, align:"left"},
			{ name: "acntgBusnClsfCdNm", title:"업무분류", css:"cell", type: "text", width: 85, editing: false, align:"left"},
			{ name: "acntgDlTypCdNm", title:"거래유형", css:"cell", type: "text", width: 140, editing: false, align:"left"},
			{ name: "acntgAmtScCdNm", title:"금액구분", css:"cell", type: "text", width: 220, editing: false, align:"left"},
			{ name: "amtTypScCdNm", title:"금액유형", css:"cell", type: "text", width: 140, editing: false, align:"left"},
			{ name: "amtTypDtlScCdNm", title:"금액유형상세", css:"cell", type: "text", width: 230, editing: false, align:"left"},
			{ name: "suggYmd", title:"발의일자", css:"cell", type: "text", width: 100, editing: false, align:"center", itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: "statNm", title:"상태", css:"cell", type: "text", width: 90, editing: false, align:"center", itemTemplate:function(value, item) {
				if(!$.fn.isEmpty(item.acctSlpId)) {
					var $aEl = $("<a>").attr("href", "javascript:void(0);").css("text-decoration", "underline").text(value).on("click", function() {
						callPopupAreSearch("acntg", item);
					});
					return $("<div>").append($aEl);
				}
				else{
					var $aEl = $("<a>").text(value);
					return $("<div>").append($aEl);
				}
			}},
			{ name: "dtlMstkCntnt", title:"처리결과", css:"cell", type: "text", width: 200, editing: false, align:"center"},
			{ name: "slpTypCd", title:"유형", css:"cell", type: "text", width: 40, editing: false, align:"center"},
			{ name: "trtOrgNoNm", title:"발의부서", css:"cell", type: "text", width: 110, editing: false, align:"left"},
			{ name: "percEnoNm", title:"처리자", css:"cell", type: "text", width: 85, editing: false, align:"center"},
			{ name: "cancYn", title:"취소여부", css:"cell", type: "text", width: 70, editing: false, align:"center"},
			{ name: "crncyCd", title:"통화", css:"cell", type: "text", width: 70, editing: false, align:"center"},
			{ name: "dlCrncyFlctAmt", title:"거래화폐변동금액", css:"cell", type: "text", width: 130, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "acplcCrncyFlctAmt", title:"현지화폐변동금액", css:"cell", type: "text", width: 130, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "whlCongrId", title:"계약집합ID", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "potflScCd", title:"포트폴리오", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "potflNm", title:"포트폴리오명", css:"cell", type: "text", width: 170, editing: false, align:"center"},
			{ name: "acntgSlpId", title:"경리전표ID", css:"cell", type: "text", width: 170, editing: false, align:"center"	},
			{ name: "acctSlpId", title:"회계전표ID", css:"cell", type: "text", width: 170, editing: false, align:"center"},
			{ name: "smupOnlBatScCd", title:"배치구분", css:"cell", type: "text", width: 70, editing: false, align:"center"},			
			{ name: "trtOrgNo", title:"발의부서코드", css:"cell", type: "text", width: 110, editing: false, visible: false, align:"left"},
			{ name: "percEno", title:"처리자", css:"cell", type: "text", width: 90, editing: false, visible: false, align:"center"},
			{ name: "acntgOnlBatScCd", title:"JR배치구분", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "acctCd", title:"회계코드", css:"cell", type: "text", width: 70, editing: false, visible: false, align:"center"},
			{ name: "acntgBusnClsfCd", title:"업무분류", css:"cell", type: "text", width: 70, editing: false, visible: false, align:"center"},
			{ name: "acntgDlTypCd", title:"거래유형", css:"cell", type: "text", width: 70, editing: false, visible: false, align:"center"},
			{ name: "acntgAmtScCd", title:"금액구분", css:"cell", type: "text", width: 70, editing: false, visible: false, align:"center"},
			{ name: "amtTypScCd", title:"금액유형", css:"cell", type: "text", width: 70, editing: false, visible: false, align:"center"},
			{ name: "amtTypDtlScCd", title:"금액유형상세", css:"cell", type: "text", width: 70, editing: false, visible: false, align:"center"},
			{ name: "slpCretYn", title:"전표생성여부", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "sapsSlpNo", title:"SAPS전표번호", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "faceoAcntgSlpId", title:"상대경리전표ID", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "orgnAcctSlpId", title:"원회계전표ID", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "faceoAcctSlpId", title:"상대회계전표ID", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "slpCntnt", title:"전표내용", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "acctLedKndCd", title:"회계원장종류코드", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "slpTypCd", title:"전표유형코드", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "slpTrnsScCd", title:"전표전송구분코드", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "smupRegDtm", title:"등록일시", css:"cell", type: "text", width: 200, visible : false, editing: false, visible: false, align:"center"},
			{ name: "smupTrtDtm", title:"처리일시", css:"cell", type: "text", width: 200, visible : false, editing: false, visible: false, align:"center"},
			{ name: "acntgRegDtm", title:"등록일시", css:"cell", type: "text", width: 200, visible : false, editing: false, visible: false, align:"center"},
			{ name: "acntgTrtDtm", title:"처리일시", css:"cell", type: "text", width: 200, visible : false, editing: false, visible: false, align:"center"},
			{ name: "smupRegntEno", title:"AR등록자", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "smupRegntEnoNm", title:"AR등록자", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "smupTrtrEno", title:"AR처리자", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "smupTrtrEnoNm", title:"AR처리자", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "acntgRegntEno", title:"JR등록자", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "acntgRegntEnoNm", title:"JR등록자", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "acntgTrtrEno", title:"JR처리자", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "acntgTrtrEnoNm", title:"JR처리자", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "slpOtln", title:"전표적요", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "indvCancYn", title:"건별취소여부", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "tbId", title:"테이블ID", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "tbNm", title:"테이블명", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "clumNm", title:"컬럼명", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "clumKraNm", title:"컬럼한글명", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "finYm", title:"마감년월", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "fscyr", title:"회계연도", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "acctPrdCd", title:"회계기간코드", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "suggDeptOrgNo", title:"회계기간코드", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"},
			{ name: "reTrtYn", title:"재처리여부", css:"cell", type: "text", width: 80, editing: false, visible: false, align:"center"}
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
 *          scCd 이벤트코드
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
 * @설명: 그리드 전체선택
 * @최초작성자: 황석현
 * @최초작성일: 2021.04.20
 * @최종변경일: 
 * @매개변수:	boolean
 * @반환값: 
 * @개정이력: 
 */
function grid_check_all(value) {
//	$("#gridDiv .jsgrid-grid-body input[type=checkbox]").prop("checked", value).change();
//	$("#ckb_all").prop("checked", value);
	console.log(value);
	var data = $("#gridDiv").jsGrid("option", "data");
	var temp = [];
	for (var i = 0; i < data.length; i++) {
		if(data[i].statNm == "전표생성" || data[i].statNm == "전표발의오류" || (data[i].statNm == "접수" && !$.fn.isEmpty(data[i].dtlMstkCntnt))) {
			data[i]["checked"] = value;
		}else{
			data[i]["checked"] = false;
		}
		temp.push(data[i]);
	}
//	console.log(temp);

	$("#gridDiv").jsGrid("option", "data", temp);
}

/**
 * @설명: 집계내역관리/경리전표상세조회 팝업을 호출한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.05
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 황석현 2021.03.05 최초작성
 */
//전역변수 선언부
var POPUP_INFO = {};
var screenPermission = $.fn.getScreenPermissionInfo("fijr212m");
function callPopupAreSearch(type, val) {
	var CUR_ROW_ITEM = null;	//선택한 그리드 Row
	CUR_ROW_ITEM = val;

	if(type == "smup") {
	// smup 집계내역, acntg : 경리
		POPUP_INFO = {
				url: "/fi/jr/fijr212p.do",
				name: "집계내역관리",
				width: 1400,
				height: 530,
				CUR_ROW_ITEM: val,
				screenPermission: screenPermission
		}
		$.fn.openPopup(POPUP_INFO);
	}else{
		POPUP_INFO = {
				url: "/fi/jr/fijr213p.do",
				name: "경리전표상세조회",
				width: 1300,
				height: 720,
				CUR_ROW_ITEM:val,
				screenPermission: screenPermission
		}
		$.fn.openPopup(POPUP_INFO);

	}
}


/**
 * @설명: 집계명세ID, 경리전표ID 팝업 콜백
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.08 최초작성
 */
function openPopupId_callback(resultObj) {
	console.log("[팝업 콜백] resultObj", resultObj.result);
	if(resultObj.result == "1") {
		console.log("[팝업창 콜백] resultObj 1", resultObj.result);
		
		selectAreList()
		
	}else{
		console.log("[팝업창 콜백] resultObj 2", resultObj.result);
	}
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
function callPopupDeptSearch() {
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
	
	$("#ibx_suggDept").focus();
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

	$("#ibx_trtr").val(resultObj.userEno);
	$("#ibx_trtrNm").val(resultObj.userNm);
	
	$("#ibx_trtr").focus();
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

/**
 * @설명: ARE 데이터 조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: val
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.04 최초작성
 */
function selectAreList() {
	
	var finYm = $("#ibx_finYm").val();
	finYm = finYm.replace(/-/g, "");
	if(finYm.length != 6) {
		$.fn.msgBox("마감년월 입력값을 확인하세요.");
		return false;
	}
	
	var reqParam = {};
	reqParam.finYm = finYm;
	reqParam.suggDept = $("#ibx_suggDept").val();
	reqParam.trtr = $("#ibx_trtr").val();
	reqParam.onlBatScCd = $("#sbx_OnlBatScCd").val();
	reqParam.acctCd = $("#sbx_acctCd").val();
	reqParam.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCd").val();
	reqParam.acntgDlTypCd = $("#sbx_acntgDlTypCd").val();
	reqParam.acntgAmtScCd = $("#sbx_acntgAmtScCd").val();
	reqParam.amtTypScCd = $("#sbx_amtTypScCd").val();
	reqParam.amtTypDtlScCd = $("#inp_amtTypDtlScCd").val();
	reqParam.trnsStatCd = $("#sbx_trnsStatCd").val();
	reqParam.nrmCancScCd = $("#sbx_nrmCancScCd").val();
	reqParam.crncyCd = $("#sbx_crncyCd").val();
	reqParam.smupSpcfId = $("#ibx_smupSpcfId").val();
	reqParam.acctSlpId = $("#ibx_acctSlpId").val();

//	console.log(">>>:" + reqParam.trnsStatCd);
	// 데이터 조회
	$.callAjax(reqParam, "/fi/jr/fijr212m/selectAreList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		
		//처리결과 조회, 분개오류코드(접수상태) 조회
		if(!$.fn.isEmpty(listData)){
			var obj = $._commonObj.code["JOUL_MSTK_CD"];
			for(var i=0;i<listData.length;i++){
				if(!$.fn.isEmpty(listData[i].dtlMstkCntnt) && listData[i].dtlMstkCntnt.length == 2) {
					for(var k=0;k<obj.length;k++){
						if(listData[i].dtlMstkCntnt == obj[k].code){
							listData[i].dtlMstkCntnt = obj[k].codeNm;
							break;
						}
					}
				}
			}
		}
		
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
		$("#ibx_pswd").val("");
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectAreList !!");
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
 * @설명: 배치 실행
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.02
 * @최종변경일: 
 * @매개변수: val
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.02 최초작성
 */
function reTrns() {
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}

	var checkDataList = new Array();
	var gridData = $("#gridDiv").jsGrid("option", "data");
	for (var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		console.log(item.checked);
		if(item.checked) {
			item.pswd = $("#ibx_pswd").val();
			item.bltgObjYn = "";
			if(gridData[i].statNm == "접수" && !$.fn.isEmpty(gridData[i].dtlMstkCntnt)) item.bltgObjYn = "Y";
			checkDataList.push(item);
		}
	}
	
	if($.fn.isEmpty(checkDataList)) {
		$.fn.msgBox("재처리할 대상을 선택하세요!"); //EPYU901 {0}을(를) 선택하세요!
		return false;
	}
	
	$.fn.msgBox("재처리(전송)하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'checkDataList':JSON.stringify(checkDataList)}, "/fi/jr/fijr212m/reTrns.do")
			.done(function(data) {
				//Exception 발생 시, 공통 Message 제공
				
				console.log(data.result);
				if(data.result == "-1") { return; }
				$.fn.msgBox("정상적으로 처리되었습니다.");

				console.log("data.result");
				
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
			
		}
	}, 2);
}

/**
 * @설명: 배치 실행 - SAP결과파일 수신
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.02
 * @최종변경일: 
 * @매개변수: val
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.02 최초작성
 */
function callReciRsltFile() {

	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}
	
	var reqParam = {};
	reqParam.finYm = $("#ibx_finYm").val().replace(/-/g, "");
	reqParam.batId = "BTIFIJR033";
	
	$.fn.msgBox("SAP 결과 파일 수신하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/jr/fijr212m/setSapRsltFile.do")
			.done(function(data) {
				//Exception 발생 시, 공통 Message 제공

				console.log("::: BATCH RETURN DATA ::: \n", JSON.stringify(data));
				
				//BATCH result : 0:성공, 1:실패
				if(data.result == "0") {
					$.fn.msgBox("정상적으로 배치 실행되었습니다.");
				} else {
					var msg = $.fn.isEmpty(data.errorMessage) ? "SAP결과파일 처리 배치 실행 도중 오류가 발생하였습니다." : data.errorMessage;
					$.fn.msgBox(msg);
				}

			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
			
		}
	}, 2);
}

/**
 * @설명: 배치 실행 - SAP재무제표버전수신
 * @최초작성자: 황석현
 * @최초작성일: 2021.10.26
 * @최종변경일: 
 * @매개변수:
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.10.26 최초작성
 */
function callReciFnstVcd() {

	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}
	
	var reqParam = {};
	reqParam.finYm = $("#ibx_finYm").val().replace(/-/g, "");
	reqParam.batId = "BTIFIDC100";
	
	$.fn.msgBox("SAP 재무제표버전 파일을 수신하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/jr/fijr212m/callReciFnstVcd.do")
			.done(function(data) {
				//Exception 발생 시, 공통 Message 제공

				console.log("::: BATCH RETURN DATA ::: \n", JSON.stringify(data));
				
				//BATCH result : 0:성공, 1:실패
				if(data.result == "0") {
					$.fn.msgBox("정상적으로 배치 실행되었습니다.");
				} else {
					var msg = $.fn.isEmpty(data.errorMessage) ? "SAP재무제표버전수신 처리 배치 실행 도중 오류가 발생하였습니다." : data.errorMessage;
					$.fn.msgBox(msg);
				}

			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
			
		}
	}, 2);
}
