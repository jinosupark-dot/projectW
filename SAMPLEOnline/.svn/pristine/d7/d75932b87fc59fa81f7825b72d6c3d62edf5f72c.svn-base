/**
 * @시스템명: IFRS17
 * @업무명: 금액유형상세구분코드조회 팝업
 * @설명: 금액유형상세구분코드조회 팝업의 JS
 * @최초작성자: 양슬기
 * @최초작성일: 2025.11.26
 * @최종변경일:
 * @개정이력:
 *  양슬기 2025.11.26 최초작성
 *  양슬기 2021.06.15 3차 표준화
 */

// 전역변수 선언부
var resultObj = {};	

$(document).ready(function(){
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	if(opener.popupOption.itcsno20.length > 0) $("#inp_itcsno20").val(opener.popupOption.itcsno20);
	
	
	//포커스
	$("#inp_itcsno20").focus();
});

/**
 * @설명: event 초기화
 * @최초작성자: 양슬기
 * @최초작성일: 2025.11.26
 * @최종변경일: 
 * @개정이력: 
 *  양슬기 2025.11.26 최초작성
 */
function initEvent() {
	//조회
	$("#btn_search").on("click", function(e){
		selectAmtTypDtlScCdList();
	});
	
	//입력창 keyup
	$("#inp_itcsno20, #ibx_itcsno20Nm").on("keyup", function(e) {
		if(e.which == 13) {
			$("#btn_search").click();
		}
	});
	
	//확인
	$("#btn_confirm").on("click", function(e){
		popupConfirm();
	});
	
	//닫기
	$("#btn_closePopup").on("click", function(e){
		popupClose();
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 양슬기
 * @최초작성일: 2025.11.26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.11.26 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 250,
		editing: false,
		sorting: true,
		paging: true,
		fields : [
			{ name: "itcsno20", title:"통합고객번호", css:"cell", type: "text", width: 100, align:"center"},
			{ name: "cusRcpNo", title:"고객접수번호", css:"cell", type: "text", width: 100, align:"center"},
			{ name: "cmcmNm", title:"기업체명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "rppeFnm", title:"대표자성명", css:"cell", type: "text", width: 100, editing: false, align:"left"},
			{ name: "sicCd", title:"표준산업분류코드", css:"cell", type: "text", width: 100, editing: false, align:"left"},
			{ name: "crinfInqAgrYn", title:"신용정보조회동의여부", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "crinfOfrAgrYn", title:"신용정보제공동의여부", css:"cell", type: "text", width: 100, editing: false, align:"center"}
		]
	});	
	
	//row 클릭 이벤트
	gridObject.rowClick(function(args) {
		resultObj.itcsno20 = args.item.itcsno20;
		resultObj.cmcmNm = args.item.cmcmNm;
		resultObj.cusRcpNo = args.item.cusRcpNo;
	});
	
	//row 더블클릭 이벤트
	gridObject.rowDoubleClick(function(args) {
		popupConfirm();
	});
	
	//그리드 생성
	gridObject.gridCreate();
	
}

/**
 * @설명: 계정과목목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025.11.26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.11.26 최초작성
 */
function selectAmtTypDtlScCdList() {
	var reqParam = {};

	var itcsno20 = $("#inp_itcsno20").val();
	var cmcmNm   = $("#ibx_itcsno20Nm").val();  //기업체명
	
	reqParam.itcsno20 = itcsno20;
	reqParam.cmcmNm   = cmcmNm;
	
	// 데이터 조회
	$.callAjax(reqParam, "/rm/cb/rmcb111p/selectCompCreditEvalPopupList1.do")
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
		alert("데이터 불러오기 실패");
		console.log("fail to selectAcitmCdList !!");
	});
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 양슬기
 * @최초작성일: 2025.11.26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.11.26 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}

/**
 * @설명: 선택항목을 부모창에 전달하고 팝업을 닫는다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025.11.26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.11.26 최초작성
 */
function popupConfirm() {
	//포거스 Row 유무체크
	var focusRow = $("#gridDiv .jsgrid-grid-body").find("tr.highlight");
	if(focusRow.length == 0) {
		$.fn.msgBox("선택된 항목이 없습니다.");
		return;
	}

	opener.openPopup_callback(resultObj);
	//opener.openPopupSearch1_callback(resultObj);
	window.close();
}

/**
 * @설명: 팝업을 닫는다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025.11.26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.11.26 최초작성
 */
function popupClose() {
	window.close();
}
