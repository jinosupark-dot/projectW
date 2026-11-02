/**
 * @시스템명: IFRS17
 * @업무명: 사업비 배부결과 검증  
 * @설명: 사업비 배부결과 검증 및 검증하는 화면 JS
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  김정민 2021.02.22 최초작성
 *  김정민 2021.06.15 3차 소스표준화
 */
// 전역변수 선언부
var CUR_ROW_ITEM = null;

$(document).ready(function(){
	/*2021.04.30 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/*2021.06.15 화면명에 화면ID 추가*/
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	/*2021.06.15 버튼권한처리*/
	//검증실행
	var btnIdArr = ["btn_vrfPrct"];
	var permArr = [];
	for (var i = 0; i < btnIdArr.length; i++) {
		permArr.push({
			btnId : "#" + btnIdArr[i]
		});
	}
	$.fn.setBtnPermission(permArr);
	
	//공통코드 조회
	selectCommonCode();
	
	//조회조건 초기화
	initSearchData();
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	//포커스 select(마감년월)
	$("#ibx_finYm").select();
});

/**
 * @설명: 공통코드 조회
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
 */
function selectCommonCode() {
	//공통코드 조회(사업비항목코드, 사업비코스트센터배부채널코드, 금감원보험종류코드, 사업비채널코드)
	$.fn.loadCommonCode(["WRKEX_ITM_CD", "WRKEX_COCNT_DIST_CHNL_CD", "FSS_INSR_KND_CD", "RAL_WRKEX_CHNL_CD"]);
}

/**
 * @설명: 조회조건 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
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
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
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
		resetGrid();
	});
	
	//입력창 keyup(마감년월, 배부유형)
	$(".search-item").find("input[type=text], select").on("keypress", function(e) {
		if(e.which == 13) {
			$("#btn_colgtSearch").click();
			return false;
		}
	});
	
	//총괄조회
	$("#btn_colgtSearch").on("click", function(e){
		selectWrkexDistRsltColgtList();
	});
	
	//검증실행
	$("#btn_vrfPrct").on("click", function(e){
		//검증실행 여부 확인
		selectWrkexDistRsltByMngSeqNoInfo();
	});
	
	//검증조회-오류내역조회
	$("#btn_vrfSearch").on("click", function(e){
		//오류내역 목록조회
		selectWrkexDistRsltMstkList();
	});
	
	//오류내역리스트 csv다운로드
	$("#btn_csv_download").on("click", function(e){
		var list = $("#gridDiv").jsGrid("option", "data");
		if(list.length == 0) {
			$.fn.msgBox("조회된 오류내역이 없습니다.");
			return;
		}
		
		csvDownload("gridDiv", "오류내역리스트");
	});
	
	//오류내역상세 csv다운로드
	$("#btn_dtl_csv_download").on("click", function(e){
		//오류상세내역 조회
		selectWrkexDistRsltMstkDtlList();
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 397,
//		pageSize: 10,
		editing: false,
		sorting: true,
		paging: false,
		fields : [
			{ name: "check", title: "checkbox", width: 40, sorting: false, align:"center", editing: false, headerTemplate:function() {
				return $("<input>").attr("id", "ckb_all").attr("type", "checkbox").on("change", function() {
					grid_check_all(this.checked);
				});
			}, itemTemplate:function(value, item) {
				return $("<input>").attr("type", "checkbox").attr("checked", value || item.checked).on("change", function() {
					item.checked = $(this).is(":checked");
					
					//천체선택 체크여부
					var totalCnt = $("#gridDiv .jsgrid-grid-body input[type=checkbox]").length;			//그리드총건수
					var checkCnt = $("#gridDiv .jsgrid-grid-body input[type=checkbox]:checked").length;	//체크된 건수
					if(totalCnt == checkCnt) {
						$("#ckb_all").prop("checked", true);
					} else {
						$("#ckb_all").prop("checked", false);
					}
				});
			}}, 
			{ name: "finYm", title:"마감년월", css:"cell", type: "text", width: 110, align:"center", itemTemplate:function(value, item) {
				return $.fn.monthFormat(value, "-");
			}},
			{ name: "accoNo", title:"계정번호", css:"cell", type: "text", width: 110, align:"center", sorter:"number"},
			{ name: "cocntCd", title:"코스트센터", css:"cell", type: "text", width: 110, align:"center"},
			{ name: "wrkexCocntDistChnlCd", title:"사업비배부채널", css:"cell", type: "select", width: 120, align:"center", 
				items: $.fn.getGridCodeItem("WRKEX_COCNT_DIST_CHNL_CD", false),
				textField: "codeNm",
				valueField: "code"},
			{ name: "ralWrkexChnlCd", title:"사업비채널", css:"cell", type: "select", width: 110, align:"center", 
				items: $.fn.getGridCodeItem("RAL_WRKEX_CHNL_CD", false),
				textField: "codeNm",
				valueField: "code"},
			{ name: "potflScCd", title:"포트폴리오구분", css:"cell", type: "text", width: 120, align:"center"},
			{ name: "congrId", title:"계약집합", css:"cell", type: "text", width: 150, align:"center"},
			{ name: "contNo", title:"계약번호", css:"cell", type: "text", width: 110, align:"center", sorter:"number"},
			{ name: "insrId", title:"보험ID", css:"cell", type: "text", width: 170, align:"center", sorter:"number"},
			{ name: "wrkexDeptGrpCd", title:"부서그룹", css:"cell", type: "text", width: 110, align:"center"},
			{ name: "fssWrkexAccoClsfCd", title:"금감원분류코드", css:"cell", type: "text", width: 110, align:"center", visible:false},
			{ name: "fssWrkexAccoClsfNm", title:"금감원분류", css:"cell", type: "text", width: 110, align:"center"},
			{ name: "wrkexAccoGrpId", title:"계정그룹", css:"cell", type: "text", width: 110, align:"center"},
			{ name: "wrkexItmCd", title:"사업비항목", css:"cell", type: "select", width: 110, align:"center", 
				items: $.fn.getGridCodeItem("WRKEX_ITM_CD", false),
				textField: "codeNm",
				valueField: "code"},
			{ name: "distObjI17Wrkex", title:"대상사업비", css:"cell", type: "text", width: 170, align:"right", sorter:"number", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "i17Wrkex", title:"배분사업비계", css:"cell", type: "text", width: 170, align:"right", sorter:"number", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "vrfOccuDifAmt", title:"차액", css:"cell", type: "text", width: 170, align:"right", sorter:"number", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}}
		]
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 사업비배부산출 총괄 조회한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
 */
function selectWrkexDistRsltColgtList() {
	//validate 체크
	if(!isValid()) { return; }
	
	//파라미터 세팅
	var reqParam = {};
	reqParam.finYm = $("#ibx_finYm").val().replace(/-/g, "");	//마감년월
	
	$.callAjax(reqParam, "/ea/dv/eadv211m/selectWrkexDistRsltColgtList.do")
	.done(function(data) {
		//Exception 발생 시, 공통 Message 제공
		if(data.result == "-1") { return; }
		
		//테이블 바인딩
		var listData = data.list;
		drawGridHtml(listData);
		
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to selectWrkexDistRsltColgtList !!");
	});
}

/**
 * @설명: 총괄조회 테이블을 그린다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
 */
function drawGridHtml(listData) {
	var $mainTr = null;
	if(listData.length == 0) {
		$mainTr = $("<tr>").append($("<td>").addClass("tc").attr("colspan", "8").text("데이터가 없습니다."));
	
	} else {
		//행 선언
		var $tr1 = $("<tr>");
		var $tr2 = $("<tr>");
		var $tr3 = $("<tr>");
		var $tr4 = $("<tr>");
		
		//2021.04.14추가: 배부유형 목록을 콤보박스에서 가져옴
		var mngSeqNoArr = $("#sbx_mngSeqNo option");
		for (var i = 0; i < mngSeqNoArr.length; i++) {
			var seqNo = mngSeqNoArr[i].value;
			var json = {};
			
			//배부유형의 값을 체크하여 조회값 세팅
			for (var j = 0; j < listData.length; j++) {
				if(listData[j]["mngSeqNo"] == seqNo) {
					json = listData[j];
					break;
				}
			}
			
			//첫번째 열 merge
			if(i == 0) {
				$tr1.append($("<td>").addClass("tc").attr("rowspan", "4").text($.fn.monthFormat(json.finYm)));
			}
			
			//사업비
			var i17Wrkex = $.fn.isEmpty(json.i17Wrkex) ? "0" : String(json.i17Wrkex);
			$tr1.append($("<td>").addClass("tr").text($.addCommaNumber(i17Wrkex)).height(24));
			
			//배부차액
			var vrfOccuDifAmt = $.fn.isEmpty(json.vrfOccuDifAmt) ? "0" : String(json.vrfOccuDifAmt);
			$tr2.append($("<td>").addClass($.isNumber(vrfOccuDifAmt) ? "tr" : "tc").text($.addCommaNumber(vrfOccuDifAmt)).height(24));
			
			//검증실행여부
			var trtYn = $.fn.isEmpty(json.trtYn) ? "" : String(json.trtYn);
			$tr3.append($("<td>").addClass("tc").text(trtYn).height(24));
			
			//검증실행일시
			var ralTrtDtm = $.fn.isEmpty(json.ralTrtDtm) ? "" : String(json.ralTrtDtm);
			$tr4.append($("<td>").addClass("tc").text(ralTrtDtm).height(24));
		}
		
		$mainTr = $tr1.add($tr2).add($tr3).add($tr4);
	}

	//총괄조회 테이블 append
	$("#tbl_colgt").html("").append($mainTr);
}

/**
 * @설명: 사업비배부산출 오류 목록을 조회한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
 */
function selectWrkexDistRsltMstkList() {
	//validate 체크
	if(!isValid("vrf")) { return; }
	
	//파라미터 세팅
	var reqParam = {};
	reqParam.finYm = $("#ibx_finYm").val().replace(/-/g, "");			//마감년월
	reqParam.mngSeqNo = $("#sbx_mngSeqNo").val();						//관리순서번호(사업비배부유형)
	reqParam.mngSeqNoNm = $("#sbx_mngSeqNo option:selected").text();	//관리순서번호 라벨(사업비배부유형명)
	
	//그리드 초기화
	resetGrid();
	
	$.callAjax(reqParam, "/ea/dv/eadv211m/selectWrkexDistRsltMstkList.do")
	.done(function(data) {
		//Exception 발생 시, 공통 Message 제공
		if(data.result == "-1") { return; }
		
		//그리드 바인딩
		var listData = data.list;
		
		//그리드 데이터 세팅
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		$("#txt_total").text("Total rows : " + listData.length);
		
		/*2021.06.15 0건 그리드 메세지 처리*/
		if(listData.length == 0) {
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to selectWrkexDistRsltMstkList !!");
	});
}

/**
 * @설명: 사업비배부산출 검증실행 정보 단건조회한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.24
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.24 최초작성
 */
function selectWrkexDistRsltByMngSeqNoInfo() {
	//validate 체크
	if(!isValid("vrf")) { return; }
	
	//파라미터 세팅
	var reqParam = {};
	reqParam.finYm = $("#ibx_finYm").val().replace(/-/g, "");			//마감년월
	reqParam.mngSeqNo = $("#sbx_mngSeqNo").val();						//관리순서번호(사업비배부유형)
	reqParam.mngSeqNoNm = $("#sbx_mngSeqNo option:selected").text();	//관리순서번호 라벨(사업비배부유형명)
	
	//1. 배부산출 검증실행 내역이 있는지 확인
	$.callAjax(reqParam, "/ea/dv/eadv211m/selectWrkexDistRsltByMngSeqNoInfo.do")
	.done(function(data) {
		//Exception 발생 시, 공통 Message 제공
		if(data.result == "-1") { return; }
		
		//데이터 세팅
		var info = data.info;

		//2. 검증실행내역이 존재할 경우, confirm 제공
		if(info.trtYn == "Y") {
			$.fn.msgBox("이미 검증실행 내역이 있습니다. 재실행 하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					//3.검증실행
					execVrfPrct(reqParam);
				}
			}, 2);
			
		} else {
			//3.검증실행
			execVrfPrct(reqParam);
		}
		
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to selectWrkexDistRsltByMngSeqNoInfo !!");
	});
}

/**
 * @설명: 사업비 검증실행
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.24
 * @최종변경일: 
 * @매개변수: reqParam
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.24 최초작성
 */
function execVrfPrct(reqParam) {
	$.callAjax(reqParam, "/ea/dv/eadv211m/execVrfPrct.do")
	.done(function(data) {
		//Exception 발생 시, 공통 Message 제공
		if(data.result == "-1") { return; }
		
		console.log("::: BATCH RETURN DATA ::: \n", JSON.stringify(data));
		
		//BATCH result : 0:성공, 1:실패
		if(data.result == "0") {
			$.fn.msgBox("정상적으로 배부검증 배치 실행되었습니다.");
		} else {
			var msg = $.fn.isEmpty(data.errorMessage) ? "배부검증 배치 실행 도중 오류가 발생하였습니다." : data.errorMessage;
			$.fn.msgBox(msg);
		}
		
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to execVrfPrct !!");
	});
}


/**
 * @설명: 그리드 체크박스 전체선택
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: value
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
 */
function grid_check_all(value) {
	$("#gridDiv .jsgrid-grid-body input[type=checkbox]").prop("checked", value).change();
	$("#ckb_all").prop("checked", value);
}

/**
 * @설명: 저장 전 validation 체크
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: boolean
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
 */
function isValid(strType) {
	var finYm = $.trim($("#ibx_finYm").val());		//마감년월
	var mngSeqNo = $("#sbx_mngSeqNo").val();		//사업비배부유형코드
	
	if($.fn.isEmpty(finYm)) {
		$.fn.msgBox("마감년월은 필수입력항목입니다.", function() {
			$("#ibx_finYm").focus();
		});
		return false;
	}
	
	//검증실행 or 검증조회(오류목록조회)일 경우에만 배부유형 필수
	if("vrf" == strType && $.fn.isEmpty(mngSeqNo)) {
		$.fn.msgBox("배부유형은 필수선택항목입니다.", function() {
			$("#sbx_mngSeqNo").focus();
		});
		return false;
	}
	//날짜형식 체크
	if(!$.isValidYm(finYm)) {
		$.fn.msgBox("마감년월 입력값을 확인하세요.", function() {
			$("#ibx_finYm").focus();
		});
		return false;
	}
	
	return true;
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("option", "data", []);
	$("#gridDiv").jsGrid("reset");
	grid_check_all(false);
	$("#txt_total").text("Total rows : 0");
}


//========================================================
//오류상세내역 hidden 그리드 세팅
//========================================================
/**
 * @설명: 오류상세내역 그리드 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
 */
function initHiddenGrid() {
	//배부유형에 따라 컬럼이 다름
	var fieldsArr = getGridFields();
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv_hidden",
		height: 300,
		editing: false,
		sorting: false,
		paging: false,
		fields : fieldsArr
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 그리드 필드Array 세팅
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
 */
function getGridFields() {
	var finYm                  = {name: "finYm", title:"마감년월", css:"cell", type: "text", align:"center"};
	var accoNo                 = {name: "accoNo", title:"계정번호", css:"cell", type: "text", align:"center"};
	var accoNm                 = {name: "accoNm", title:"계정명", css:"cell", type: "text", align:"center"};
	var cocntCd                = {name: "cocntCd", title:"코스트센터코드", css:"cell", type: "text", align:"center"};
	var cocntNm                = {name: "cocntNm", title:"코스트센터명", css:"cell", type: "text", align:"center"};
	var wrkexCocntDistChnlCd   = {name: "wrkexCocntDistChnlCd", title:"배부채널코드", css:"cell", type: "text", align:"center"};
	var wrkexAccoGrpId         = {name: "wrkexAccoGrpId", title:"계정그룹ID", css:"cell", type: "text", align:"center"};
	var wrkexAccoGrpNm         = {name: "wrkexAccoGrpNm", title:"계정그룹명", css:"cell", type: "text", align:"center"};
	var wrkexItmCd             = {name: "wrkexItmCd", title:"사업비항목코드", css:"cell", type: "text", align:"center"};
	var wrkexItmCdNm           = {name: "wrkexItmCdNm", title:"사업비항목명", css:"cell", type: "text", align:"center"};
	var wrkexDeptGrpCd         = {name: "wrkexDeptGrpCd", title:"부서그룹코드", css:"cell", type: "text", align:"center"};
	var wrkexDeptGrpNm         = {name: "wrkexDeptGrpNm", title:"부서그룹명", css:"cell", type: "text", align:"center"};
	var fssWrkexAccoClsfCd     = {name: "fssWrkexAccoClsfCd", title:"FSS코드", css:"cell", type: "text", align:"center"};
	var fssWrkexAccoClsfNm     = {name: "fssWrkexAccoClsfNm", title:"FSS명", css:"cell", type: "text", align:"center"};
	var wrkexDistStndCd        = {name: "wrkexDistStndCd", title:"사업비배부기준", css:"cell", type: "text", align:"center"};
	var ralWrkexChnlCd         = {name: "ralWrkexChnlCd", title:"사업비채널코드", css:"cell", type: "text", align:"center"};
	var potflScCd              = {name: "potflScCd", title:"PF코드", css:"cell", type: "text", align:"center"};
	var congrId                = {name: "congrId", title:"계약집합ID", css:"cell", type: "text", align:"center"};
	var contNo                 = {name: "contNo", title:"증번", css:"cell", type: "text", align:"center"};
	var insrId                 = {name: "insrId", title:"보험ID", css:"cell", type: "text", align:"center"};
	var distObjI17Wrkex        = {name: "distObjI17Wrkex", title:"대상사업비", css:"cell", type: "text", align:"center"};
	var distStndRto            = {name: "distStndRto", title:"배부기준비율", css:"cell", type: "text", align:"center"};
	var i17Wrkex               = {name: "i17Wrkex", title:"배분사업비", css:"cell", type: "text", align:"center"};
	
	var resultArr = [];
	var mngSeqNo = $("#sbx_mngSeqNo").val();
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
 * @설명: 오류상세내역 조회 후, csv다운로드 한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.22 최초작성
 */
function selectWrkexDistRsltMstkDtlList() {
	//1. 조회여부 확인
	var list = $("#gridDiv").jsGrid("option", "data");
	if(list.length == 0) {
		$.fn.msgBox("조회된 오류내역이 없습니다.");
		return;
	}
	//2. 체크된 항목 세팅 & 체크여부확인
	var checkList = [];
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		if(item.checked) {
			checkList.push(item);
		}
	}
	if(checkList.length == 0) {
		$.fn.msgBox("체크된 항목이 없습니다.");
		return;
	}
	
	//3. 그리드 destroy
	$("#gridDiv_hidden").jsGrid("destroy");
	
	//4. 그리드 init
	initHiddenGrid();
	
	//5. 오류상세목록 조회(java쪽에서 10,000건 이상인지 체크하여 exception처리)
	$.callAjax({"list" : JSON.stringify(checkList)}, "/ea/dv/eadv211m/selectWrkexDistRsltMstkDtlList.do")
	.done(function(data) {
		//Exception 발생 시, 공통 Message 제공
		if(data.result == "-1") { return; }
		
		//그리드 바인딩
		var listData = data.list;
		
		//조회된 목록이 없을 경우
		if(listData.length == 0) {
			$.fn.msgBox("조회된 오류내역상세 목록이 없습니다.");
			return;
		}
		
		//그리드 데이터 세팅 & 파일다운로드
		$("#gridDiv_hidden").jsGrid("loadData", listData).done(function() {
			//csv다운로드
			csvDownload("gridDiv_hidden", "오류내역상세");
		});
		
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to selectWrkexDistRsltMstkDtlList !!");
	});
}

/**
 * @설명: csv 파일다운로드 한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.30
 * @최종변경일: 
 * @매개변수: gridId<string> : 다운받을 그리드 ID
 *         subName<string> : 파일명
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.30 최초작성
 */
function csvDownload(gridId, subName) {
	var title = $(".main_title h3.title").text();				//화면타이틀
	var sbxText = $("#sbx_mngSeqNo option:selected").text();	//배부유형
	
	//파일명 세팅
	var fileName = title + "(" + sbxText + ")_" + subName + "_" + getToday() + ".csv";
	
	$.fn.exportGridCSV({
		id: gridId, 
		fileName: fileName
	});
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
