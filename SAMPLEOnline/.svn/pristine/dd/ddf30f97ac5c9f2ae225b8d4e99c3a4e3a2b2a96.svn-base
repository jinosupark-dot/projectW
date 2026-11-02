/**
 * @시스템명: IFRS17
 * @업무명: 배부결과 조회
 * @설명: 배부결과 조회하는 화면 JS
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.03
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  김정민 2021.03.03 최초작성
 *  김정민 2021.06.14 그리드 너비 수정
 *  김정민 2021.06.15 3차 소스표준화
 */

$(document).ready(function(){
	/*2021.04.30 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/*2021.06.15 화면명에 화면ID 추가*/
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	//공통코드 조회
	selectCommonCode();

	//FSS코드 유효값 조회
	selectFssCodeList();
	
	//콤보박스 세팅
	initComboBox();
	
	//조회조건 초기화
	initSearchData();
	
	//event 초기화
	initEvent();
	
	//배부유형 change 이벤트 발생하여 그리드세팅, 조회조건세팅
	$("#sbx_mngSeqNo").change();
	
	//포커스 select(마감년월)
	$("#ibx_finYm").select();
});

/**
 * @설명: FSS코드 유효값 조회
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.03 최초작성
 */
function selectFssCodeList() {
	//FSS코드 유효값 조회
	$.callAjax({}, "/ea/rt/eart111m/selectFssCodeList.do", {async:false})
	.done(function(data) {
		//공통 Object에 콤보데이터 세팅
		$._commonObj.code["FSS_WRKEX_ACCO_CLSF_CD"] = data.list;
		
	}).fail(function(data) {
		console.log("fail to selectFssCode!!!!");
	});
}

/**
 * @설명: 공통코드 조회
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.03 최초작성
 */
function selectCommonCode() {
	//공통코드 조회(사업비항목코드, 사업비코스트센터배부채널코드, 사업비채널코드)
	$.fn.loadCommonCode(["WRKEX_ITM_CD", "WRKEX_COCNT_DIST_CHNL_CD", "RAL_WRKEX_CHNL_CD"]);
	
	//사업비채널코드 DM, CC, CM 삭제
	var targetArr = $._commonObj["code"]["RAL_WRKEX_CHNL_CD"]; // 얕은복사
	for (var i = targetArr.length-1; i >= 0; i--) {
		if("DM" === targetArr[i]["code"] || "CC" == targetArr[i]["code"] || "CM" == targetArr[i]["code"]) {
			//참조하는 변수이므로, splice처리 후 결과값을 따로 세팅 안함
			targetArr.splice(i, 1);
		}
	}
}

/**
 * @설명: 콤보박스 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.03 최초작성
 */
function initComboBox() {
	//사업비배부채널코드
	$.fn.renderCombobox({
		codeArr: ["WRKEX_ITM_CD"],
		selArr: ["sbx_wrkexItmCd"],
		firstOptionText: "-전체-"
	});
	
	//사업비배부채널코드, 사업비채널
	$.fn.renderCombobox({
		codeArr: ["WRKEX_COCNT_DIST_CHNL_CD", "RAL_WRKEX_CHNL_CD"],
		selArr: ["sbx_wrkexCocntDistChnlCd", "sbx_ralWrkexChnlCd"],
		firstOptionText: "-선택-"
	});
	
	//FSS코드
	$.fn.renderCombobox({
		codeArr: ["FSS_WRKEX_ACCO_CLSF_CD"],
		selArr: ["sbx_fssWrkexAccoClsfCd"],
		firstOptionText: "-선택-",
		displayMode: "value delim label",
		displayDelimiter: ". "
	});
}

/**
 * @설명: 조회조건 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.03 최초작성
 */
function initSearchData() {
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
 * @설명: event 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.03 최초작성
 */
function initEvent() {
	//마감년월 입력창 blur
	$("#ibx_finYm").on("blur", function(e) {
		var _this = this;
		
		//빈값 체크
		if($.fn.isEmpty(_this.value)) {
			return;
		}
		
		//날짜형식 체크
		if($.isValidYm(_this.value)) {
			$(_this).val($.fn.monthFormat(_this.value, "-"));
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.", function() {
				$(_this).focus();
			});
		}
	}).on("focus", function() {
		$(this).select();
	});
	
	//마감년월 달력버튼 click
	$("#btn_finYm").on("click", function(e){
		$("#ibx_finYm").datepicker("show");
	});
	
	//배부유형 변경 이벤트
	$("#sbx_mngSeqNo").on("change", function(e){
		var mngSeqNo = $(this).val();
		
		ctlInqrCond(mngSeqNo);	//배부유형에 맞는 조회조건 세팅
		initGrid(mngSeqNo);		//배부유형에 맞는 그리드 로딩
	});
	
	//계정그룹조회팝업
	$("#btn_accoGrpSearch").on("click", function(e){
		openPopupAccoGrp();
	});
	
	//조회조건 입력창 keyup(마감년월, 배부유형, 계정번호, 코스트센터, 계정그룹, 사업비항목, 사업비배부채널, 사업비채널, 포트폴리오코드, 계약그룹ID, FSS코드, 계약번호)
	$(".search-item").find("input[type=text], select").on("keypress", function(e) {
		if(e.which == 13) {
			$("#btn_search").click();
			return false;
		}
	});
	
	//조회버튼
	$("#btn_search").on("click", function() {
		selectDistInfoRsltList();
	});
	
	//엑셀다운로드
	$("#btn_excel_download").on("click", function(e){
		//데이터 체크
		var dataList = $("#gridDiv").jsGrid("option", "data");
		if(dataList.length == 0) {
			$.fn.msgBox("조회된 항목이 없습니다.");
			return;
		}
		
		//csv다운로드
		var sbxText = $("#sbx_mngSeqNo option:selected").text();
		var fileName = $(".main_title h3.title").text() + "_" + sbxText + "_" + getToday() + ".csv";
		$.fn.exportGridCSV({
			id: 'gridDiv', 
			fileName: fileName
		});
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.04 최초작성
 */
function initGrid(mngSeqNo){
	
	//그리드 destroy
	$("#gridDiv").jsGrid("destroy");
	
	//fields 세팅
	var fieldsArr = getGridFields(mngSeqNo);
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 600,
		editing: false,
		sorting: true,
		paging: true,
		fields : fieldsArr
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 사업비배부유형코드에 따른 그리드 필드값을 리턴한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: mngSeqNo<string> : 사업비배부유형코드(01:채널별, 02:PF별, 03:계약그룹별, 04:증번(계정그룹)별, 05:증번(FSS)별, 06:주특별)
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김정민 2021.03.04 최초작성
 */
function getGridFields(mngSeqNo) {
	var finYm					= {name: "finYm", title:"마감년월", css:"cell", type: "text", width: 100, align:"center", itemTemplate:function(value, item) {
									return $.fn.monthFormat(value, "-");
								}};
	var accoNo					= {name: "accoNo", title:"계정번호", css:"cell", type: "text", width: 110, align:"center"};
	var accoNm					= {name: "accoNm", title:"계정명", css:"cell", type: "text", width: 315, align:"left"};
	var cocntCd					= {name: "cocntCd", title:"코스트센터코드", css:"cell", type: "text", width: 110, align:"center"};
	var cocntNm					= {name: "cocntNm", title:"코스트센터명", css:"cell", type: "text", width: 200, align:"left"};
	var wrkexCocntDistChnlCd	= {name: "wrkexCocntDistChnlCd", title:"배부채널코드", css:"cell", type: "text", width: 120, align:"center"};
	var wrkexAccoGrpId			= {name: "wrkexAccoGrpId", title:"계정그룹ID", css:"cell", type: "text", width: 110, align:"center"};
	var wrkexAccoGrpNm			= {name: "wrkexAccoGrpNm", title:"계정그룹명", css:"cell", type: "text", width: 230, align:"left"};
	var wrkexItmCd				= {name: "wrkexItmCd", title:"사업비항목코드", css:"cell", type: "text", width: 110, align:"center"};
	var wrkexItmCdNm			= {name: "wrkexItmCdNm", title:"사업비항목명", css:"cell", type: "text", width: 110, align:"left"};
	var wrkexDeptGrpCd			= {name: "wrkexDeptGrpCd", title:"부서그룹코드", css:"cell", type: "text", width: 110, align:"center"};
	var wrkexDeptGrpNm			= {name: "wrkexDeptGrpNm", title:"부서그룹명", css:"cell", type: "text", width: 150, align:"left"};
	var fssWrkexAccoClsfCd		= {name: "fssWrkexAccoClsfCd", title:"FSS코드", css:"cell", type: "text", width: 110, align:"center"};
	var fssWrkexAccoClsfNm	    = {name: "fssWrkexAccoClsfNm", title:"FSS명", css:"cell", type: "text", width: 150, align:"left"};
	var wrkexDistStndCd			= {name: "wrkexDistStndCd", title:"사업비배부기준", css:"cell", type: "text", width: 110, align:"center"};
	var ralWrkexChnlCd			= {name: "ralWrkexChnlCd", title:"사업비채널코드", css:"cell", type: "text", width: 110, align:"center"};
	var potflScCd				= {name: "potflScCd", title:"PF코드", css:"cell", type: "text", width: 110, align:"center"};
	var congrId					= {name: "congrId", title:"계약집합ID", css:"cell", type: "text", width: 150, align:"center"};
	var contNo					= {name: "contNo", title:"증번", css:"cell", type: "text", width: 110, align:"center"};
	var insrId					= {name: "insrId", title:"보험ID", css:"cell", type: "text", width: 170, align:"center"};
	var distObjI17Wrkex			= {name: "distObjI17Wrkex", title:"대상사업비", css:"cell", type: "text", width: 150, align:"right", sorter:"number", itemTemplate:function(value, item) {
									return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
								}};
	var distStndRto				= {name: "distStndRto", title:"배부기준비율", css:"cell", type: "text", width: 110, align:"right", sorter:"number", itemTemplate:function(value, item) {
									return $.fn.isEmpty(value) ? "0" : value;
								}};
	var i17Wrkex				= {name: "i17Wrkex", title:"배분사업비", css:"cell", type: "text", width: 150, align:"right", sorter:"number", itemTemplate:function(value, item) {
									return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
								}};
	
	var resultArr = [];
	switch(mngSeqNo) {
	case "01" : //채널별
		//마감년월, 계정번호, 계정명, 코스트센터코드, 코스트센터명, 배부채널코드, 대상사업비,
		//계정그룹ID, 계정그룹명, 사업비항목코드, 사업비항목명, 사업비배부기준, 사업비채널코드, 배부기준비율, 배분사업비
		resultArr = [finYm, accoNo, accoNm, cocntCd, cocntNm, wrkexCocntDistChnlCd, distObjI17Wrkex, 
			wrkexAccoGrpId, wrkexAccoGrpNm, wrkexItmCd, wrkexItmCdNm, wrkexDistStndCd, ralWrkexChnlCd, distStndRto, i17Wrkex];
		break;
	
	case "02" : //PF별
		//마감년월, 계정번호, 계정명, 코스트센터코드, 코스트센터명, 사업비채널코드, 대상사업비,
		//계정그룹ID, 계정그룹명, 사업비항목코드, 사업비항목명, 사업비배부기준, PF코드, 배부기준비율, 배분사업비
		resultArr = [finYm, accoNo, accoNm, cocntCd, cocntNm, ralWrkexChnlCd, distObjI17Wrkex,
			wrkexAccoGrpId, wrkexAccoGrpNm, wrkexItmCd, wrkexItmCdNm, wrkexDistStndCd, potflScCd, distStndRto, i17Wrkex];
		break;
		
	case "03" : //계약그룹별
		//마감년월, 계정번호, 계정명, 부서그룹코드, 부서그룹명, 사업비채널코드, PF코드, 대상사업비, 
		//계정그룹ID, 계정그룹명, 사업비항목코드, 사업비항목명, 사업비배부기준, FSS코드, FSS명, 계약집합ID, 배부기준비율, 배분사업비
		resultArr = [finYm, accoNo, accoNm, wrkexDeptGrpCd, wrkexDeptGrpNm, ralWrkexChnlCd, potflScCd, distObjI17Wrkex,
			wrkexAccoGrpId, wrkexAccoGrpNm, wrkexItmCd, wrkexItmCdNm, wrkexDistStndCd, fssWrkexAccoClsfCd, fssWrkexAccoClsfNm, congrId, distStndRto, i17Wrkex];
		break;
		
	case "04" : //증번(계정그룹)별
		//마감년월, 사업비채널코드, PF코드, 계약집합ID, 대상사업비, 
		//계정그룹ID, 계정그룹명, 사업비항목코드, 사업비항목명, 사업비배부기준, 증번, 배부기준비율, 배분사업비
		resultArr = [finYm, ralWrkexChnlCd, potflScCd, congrId, distObjI17Wrkex,
			wrkexAccoGrpId, wrkexAccoGrpNm, wrkexItmCd, wrkexItmCdNm, wrkexDistStndCd, contNo, distStndRto, i17Wrkex];
		break;
		
	case "05" : //증번(FSS)별
		//마감년월, 사업비채널코드, PF코드, 계약집합ID, FSS코드, FSS명, 대상사업비, 
		//사업비항목코드, 사업비항목명, 증번, 배분사업비
		resultArr = [finYm, ralWrkexChnlCd, potflScCd, congrId, fssWrkexAccoClsfCd, fssWrkexAccoClsfNm, distObjI17Wrkex,
			wrkexItmCd, wrkexItmCdNm, contNo, i17Wrkex];
		break;
		
	case "06" : //주특별
		//마감년월, 사업비채널코드, PF코드, 계약집합ID, 증번, 대상사업비, 
		//사업비항목코드, 사업비항목명, 보험ID, 배분사업비
		resultArr = [finYm, ralWrkexChnlCd, potflScCd, congrId, contNo, distObjI17Wrkex,
			wrkexItmCd, wrkexItmCdNm, insrId, i17Wrkex];
		break;
	}
	
	return resultArr;
}

/**
 * @설명: 배부유형에 따른 배부정보결과를 조회한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.04 최초작성
 */
function selectDistInfoRsltList() {
	//validate 체크
	if(!isValid()) { return; }
	
	//파라미터 세팅
	var reqParam = {};
	reqParam.finYm                = $("#ibx_finYm").val().replace(/-/g, "");	//마감년월
	reqParam.mngSeqNo             = $("#sbx_mngSeqNo").val();					//관리순서번호(사업비배부유형)
	reqParam.accoNo               = $("#ibx_accoNo").val();						//계정번호
	reqParam.cocntCd              = $("#ibx_cocntCd").val();					//코스트센터
	reqParam.wrkexAccoGrpId       = $("#ibx_wrkexAccoGrpId").val();				//계정그룹
	reqParam.wrkexItmCd           = $("#sbx_wrkexItmCd").val();					//사업비항목코드
	reqParam.wrkexCocntDistChnlCd = $("#sbx_wrkexCocntDistChnlCd").val();		//사업비배부채널
	reqParam.ralWrkexChnlCd       = $("#sbx_ralWrkexChnlCd").val();				//사업비채널
	reqParam.potflScCd            = $("#ibx_potflScCd").val();					//포트폴리오코드
	reqParam.congrId              = $("#ibx_congrId").val();					//계약그룹ID
	reqParam.fssWrkexAccoClsfCd   = $("#sbx_fssWrkexAccoClsfCd").val();			//FSS코드
	reqParam.contNo               = $("#ibx_contNo").val();						//계약번호
	
	//그리드 초기화
	resetGrid();
	
	$.callAjax(reqParam, "/ea/rt/eart111m/selectDistInfoRsltList.do")
	.done(function(data) {
		//Exception 발생 시, 공통 Message 제공
		if(data.result == "-1") { return; }
		
		//그리드 바인딩
		var listData = data.list;
		
		//그리드 데이터 세팅
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		/*2021.06.15 0건 그리드 메세지 처리*/
		if(listData.length == 0) {
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to selectDistInfoRsltList !!");
	});
}

/**
 * @설명: 계정그룹조회 팝업을 호출한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.03 최초작성
 */
function openPopupAccoGrp() {
	var popupOption = {
		url: "/ea/pr/eapr112p.do",
		name: "계정그룹목록조회 팝업",
		width: 700,
		height: 434
	}

	//※참고) 팝업콜백함수: openPopupAccoGrp_callback
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 계정그룹조회 팝업 콜백
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.03 최초작성
 */
function openPopupAccoGrp_callback(resultObj) {
	console.log("[계정그룹조회 팝업 콜백] resultObj", resultObj);
	
	//그리드 데이터 초기화
	resetGrid();
	
	$("#ibx_wrkexAccoGrpId").val(resultObj.wrkexAccoGrpId);
}

/**
 * @설명: 배부유형에 따라 조회조건 필드 세팅
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: mngSeqNo<string> : 배부유형
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.03 최초작성
 */
function ctlInqrCond(mngSeqNo) {
	var targetArr = null;	//필수값인 elementID 배열
	
	switch(mngSeqNo) {
	case "01" :	//채널별
		//disabled 처리
		$("#ibx_accoNo").attr("disabled", false).val("");					//계정번호
		$("#ibx_cocntCd").attr("disabled", false).val("");					//코스트센터
		$("#ibx_wrkexAccoGrpId").attr("disabled", false).val("");			//계정그룹
		$("#sbx_wrkexItmCd").val("");										//사업비항목
		$("#sbx_wrkexCocntDistChnlCd").attr("disabled", false).val("");		//사업비배부채널
		$("#sbx_ralWrkexChnlCd").attr("disabled", true).val("");			//사업비채널
		$("#ibx_potflScCd").attr("disabled", true).val("");					//포트폴리오코드
		$("#ibx_congrId").attr("disabled", true).val("");					//계약그룹ID
		$("#sbx_fssWrkexAccoClsfCd").attr("disabled", true).val("");		//FSS코드
		$("#ibx_contNo").attr("disabled", true).val("");					//계약번호
		$("#btn_accoGrpSearch").attr("disabled", false).css("cursor", "pointer");	//계정그룹 팝업호출 버튼
		
		//필수값 대상(사업비배부채널)
		targetArr = ["sbx_wrkexCocntDistChnlCd"];
		break;
		
	case "02" :	//PF별
		//disabled 처리
		$("#ibx_accoNo").attr("disabled", false).val("");					//계정번호
		$("#ibx_cocntCd").attr("disabled", false).val("");					//코스트센터
		$("#ibx_wrkexAccoGrpId").attr("disabled", false).val("");			//계정그룹
		$("#sbx_wrkexItmCd").val("");										//사업비항목
		$("#sbx_wrkexCocntDistChnlCd").attr("disabled", true).val("");		//사업비배부채널
		$("#sbx_ralWrkexChnlCd").attr("disabled", false).val("");			//사업비채널
		$("#ibx_potflScCd").attr("disabled", true).val("");					//포트폴리오코드
		$("#ibx_congrId").attr("disabled", true).val("");					//계약그룹ID
		$("#sbx_fssWrkexAccoClsfCd").attr("disabled", true).val("");		//FSS코드
		$("#ibx_contNo").attr("disabled", true).val("");					//계약번호
		$("#btn_accoGrpSearch").attr("disabled", false).css("cursor", "pointer");	//계정그룹 팝업호출 버튼

		//필수값 대상(사업비채널)
		targetArr = ["sbx_ralWrkexChnlCd"];
		break;
		
	case "03" :	//계약그룹ID별
		//disabled 처리
		$("#ibx_accoNo").attr("disabled", false).val("");					//계정번호
		$("#ibx_cocntCd").attr("disabled", true).val("");					//코스트센터
		$("#ibx_wrkexAccoGrpId").attr("disabled", false).val("");			//계정그룹
		$("#sbx_wrkexItmCd").val("");										//사업비항목
		$("#sbx_wrkexCocntDistChnlCd").attr("disabled", true).val("");		//사업비배부채널
		$("#sbx_ralWrkexChnlCd").attr("disabled", false).val("");			//사업비채널
		$("#ibx_potflScCd").attr("disabled", false).val("");				//포트폴리오코드
		$("#ibx_congrId").attr("disabled", true).val("");					//계약그룹ID
		$("#sbx_fssWrkexAccoClsfCd").attr("disabled", true).val("");		//FSS코드
		$("#ibx_contNo").attr("disabled", true).val("");					//계약번호
		$("#btn_accoGrpSearch").attr("disabled", false).css("cursor", "pointer");	//계정그룹 팝업호출 버튼

		//필수값 대상(사업비채널, 포트폴리오코드)
		targetArr = ["sbx_ralWrkexChnlCd", "ibx_potflScCd"];
		break;
		
	case "04" :	//증번(계정그룹)별
		//disabled 처리
		$("#ibx_accoNo").attr("disabled", true).val("");					//계정번호
		$("#ibx_cocntCd").attr("disabled", true).val("");					//코스트센터
		$("#ibx_wrkexAccoGrpId").attr("disabled", false).val("");			//계정그룹
		$("#sbx_wrkexItmCd").val("");										//사업비항목
		$("#sbx_wrkexCocntDistChnlCd").attr("disabled", true).val("");		//사업비배부채널
		$("#sbx_ralWrkexChnlCd").attr("disabled", false).val("");			//사업비채널
		$("#ibx_potflScCd").attr("disabled", true).val("");					//포트폴리오코드
		$("#ibx_congrId").attr("disabled", false).val("");					//계약그룹ID
		$("#sbx_fssWrkexAccoClsfCd").attr("disabled", true).val("");		//FSS코드
		$("#ibx_contNo").attr("disabled", true).val("");					//계약번호
		$("#btn_accoGrpSearch").attr("disabled", false).css("cursor", "pointer");	//계정그룹 팝업호출 버튼

		//필수값 대상(계정그룹, 사업비채널, 계약그룹ID)
		targetArr = ["ibx_wrkexAccoGrpId", "sbx_ralWrkexChnlCd", "ibx_congrId"];
		break;
		
	case "05" :	//증번(FSS)별
		//disabled 처리
		$("#ibx_accoNo").attr("disabled", true).val("");					//계정번호
		$("#ibx_cocntCd").attr("disabled", true).val("");					//코스트센터
		$("#ibx_wrkexAccoGrpId").attr("disabled", true).val("");			//계정그룹
		$("#sbx_wrkexItmCd").val("");										//사업비항목
		$("#sbx_wrkexCocntDistChnlCd").attr("disabled", true).val("");		//사업비배부채널
		$("#sbx_ralWrkexChnlCd").attr("disabled", false).val("");			//사업비채널
		$("#ibx_potflScCd").attr("disabled", true).val("");					//포트폴리오코드
		$("#ibx_congrId").attr("disabled", false).val("");					//계약그룹ID
		$("#sbx_fssWrkexAccoClsfCd").attr("disabled", false).val("");		//FSS코드
		$("#ibx_contNo").attr("disabled", true).val("");					//계약번호
		$("#btn_accoGrpSearch").attr("disabled", true).css("cursor", "default");	//계정그룹 팝업호출 버튼

		//필수값 대상(사업비채널, 계약그룹ID, FSS코드)
		targetArr = ["sbx_ralWrkexChnlCd", "ibx_congrId", "sbx_fssWrkexAccoClsfCd"];
		break;
		
	case "06" :	//주특별
		//disabled 처리
		$("#ibx_accoNo").attr("disabled", true).val("");					//계정번호
		$("#ibx_cocntCd").attr("disabled", true).val("");					//코스트센터
		$("#ibx_wrkexAccoGrpId").attr("disabled", true).val("");			//계정그룹
		$("#sbx_wrkexItmCd").val("");										//사업비항목
		$("#sbx_wrkexCocntDistChnlCd").attr("disabled", true).val("");		//사업비배부채널
		$("#sbx_ralWrkexChnlCd").attr("disabled", true).val("");			//사업비채널
		$("#ibx_potflScCd").attr("disabled", true).val("");					//포트폴리오코드
		$("#ibx_congrId").attr("disabled", true).val("");					//계약그룹ID
		$("#sbx_fssWrkexAccoClsfCd").attr("disabled", true).val("");		//FSS코드
		$("#ibx_contNo").attr("disabled", false).val("");					//계약번호
		$("#btn_accoGrpSearch").attr("disabled", true).css("cursor", "default");	//계정그룹 팝업호출 버튼

		//필수값 대상(계약번호)
		targetArr = ["ibx_contNo"];
		break;
	}
	
	//필수값 아스타(*) 제거
	$("div.search-item p.title.choice_point span.point").remove();
	
	//입력
	if(!$.fn.isEmpty(targetArr) && targetArr.length > 0) {
		targetArr.forEach(function(el) {
			var $point = $("<span>").addClass("point").text(" *");	//필수값 아스타(*) 표시를 위한 element
			$("#" + el).parents("div.item").children("p.title.choice_point").append($point);
		});
	}
}

/**
 * @설명: 저장 전 validation 체크
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: boolean
 * @개정이력: 
 *  김정민 2021.03.04 최초작성
 */
function isValid(strType) {
	var $finYm = $("#ibx_finYm");		//마감년월
	var $mngSeqNo = $("#sbx_mngSeqNo");	//사업비배부유형코드
	
	if($.fn.isEmpty($finYm.val())) {
		$.fn.msgBox("마감년월은 필수입력항목입니다.", function() {
			$finYm.focus();
		});
		return false;
	}
	if($.fn.isEmpty($mngSeqNo.val())) {
		$.fn.msgBox("배부유형은 필수입력항목입니다.", function() {
			$mngSeqNo.focus();
		});
		return false;
	}
	
	var $accoNo = $("#ibx_accoNo");									//계정번호
	var $cocntCd = $("#ibx_cocntCd");								//코스트센터
	var $wrkexAccoGrpId = $("#ibx_wrkexAccoGrpId");					//계정그룹
	var $wrkexCocntDistChnlCd = $("#sbx_wrkexCocntDistChnlCd");		//사업비배부채널
	var $ralWrkexChnlCd = $("#sbx_ralWrkexChnlCd");					//사업비채널
	var $potflScCd = $("#ibx_potflScCd");							//포트폴리오코드
	var $congrId = $("#ibx_congrId");								//계약그룹ID
	var $fssWrkexAccoClsfCd = $("#sbx_fssWrkexAccoClsfCd");			//FSS코드
	var $contNo = $("#ibx_contNo");									//계약번호
	
	switch($mngSeqNo.val()) {
	case "01" :	//채널별
		if($.fn.isEmpty($wrkexCocntDistChnlCd.val())) {
			$.fn.msgBox("사업비배부채널은 필수입력항목입니다.", function() {
				$wrkexCocntDistChnlCd.focus();
			});
			return false;
		}
		break;
		
	case "02" :	//PF별
		if($.fn.isEmpty($ralWrkexChnlCd.val())) {
			$.fn.msgBox("사업비채널은 필수입력항목입니다.", function() {
				$ralWrkexChnlCd.focus();
			});
			return false;
		}
		break;
		
	case "03" :	//계약그룹ID별
		if($.fn.isEmpty($ralWrkexChnlCd.val())) {
			$.fn.msgBox("사업비채널은 필수입력항목입니다.", function() {
				$ralWrkexChnlCd.focus();
			});
			return false;
		}
		if($.fn.isEmpty($potflScCd.val())) {
			$.fn.msgBox("포토폴리오코드는 필수입력항목입니다.", function() {
				$potflScCd.focus();
			});
			return false;
		}
		break;
		
	case "04" :	//증번(계정그룹)별
		if($.fn.isEmpty($wrkexAccoGrpId.val())) {
			$.fn.msgBox("계정그룹ID는 필수입력항목입니다.", function() {
				$wrkexAccoGrpId.focus();
			});
			return false;
		}
		if($.fn.isEmpty($ralWrkexChnlCd.val())) {
			$.fn.msgBox("사업비채널은 필수입력항목입니다.", function() {
				$ralWrkexChnlCd.focus();
			});
			return false;
		}
		if($.fn.isEmpty($congrId.val())) {
			$.fn.msgBox("계약그룹ID는 필수입력항목입니다.", function() {
				$congrId.focus();
			});
			return false;
		}
		break;
		
	case "05" :	//증번(FSS)별
		if($.fn.isEmpty($ralWrkexChnlCd.val())) {
			$.fn.msgBox("사업비채널은 필수입력항목입니다.", function() {
				$ralWrkexChnlCd.focus();
			});
			return false;
		}
		if($.fn.isEmpty($congrId.val())) {
			$.fn.msgBox("계약그룹ID는 필수입력항목입니다.", function() {
				$congrId.focus();
			});
			return false;
		}
		if($.fn.isEmpty($fssWrkexAccoClsfCd.val())) {
			$.fn.msgBox("FSS코드는 필수입력항목입니다.", function() {
				$fssWrkexAccoClsfCd.focus();
			});
			return false;
		}
		break;
		
	case "06" :	//주특별
		if($.fn.isEmpty($contNo.val())) {
			$.fn.msgBox("계약번호는 필수입력항목입니다.", function() {
				$contNo.focus();
			});
			return false;
		}
		break;
		
	default :
		$.fn.msgBox("유효하지 않는 배부유형입니다.");
		return false;
	}
	
	//날짜형식 체크
	if(!$.isValidYm($finYm.val())) {
		$.fn.msgBox("마감년월 입력값을 확인하세요.", function() {
			$finYm.focus();
		});
		return false;
	}
	
	return true;
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.03 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("option", "data", []);
	$("#gridDiv").jsGrid("reset");
}

/**
 * @설명: 오늘 날짜를 조회한다.(YYYYMMDDHH24MISS)
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.12
 * @최종변경일: 
 * @매개변수: 
 * @반환값: result<string>
 * @개정이력: 
 *  김정민 2021.03.12 최초작성
 */
function getToday() {
	//자리수만큼 value의 좌측에 "0" 채움
	var fillZero = function(value, len) {
		var strNum = "" + value;
		while ( strNum.length < len ) {
			strNum = "0" + strNum;
		}
		return strNum;
	}
	
	var dt = new Date();
	var result = "";
	result += fillZero(dt.getFullYear(), 2);
	result += fillZero(dt.getMonth() + 1, 2);
	result += fillZero(dt.getDate(), 2);
	result += fillZero(dt.getHours(), 2);
	result += fillZero(dt.getMinutes(), 2);
	result += fillZero(dt.getSeconds(), 2);
	
	return result;
}
