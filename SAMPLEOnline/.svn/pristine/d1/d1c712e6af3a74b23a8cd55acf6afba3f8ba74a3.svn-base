/**
 * @시스템명: IFRS17
 * @업무명: 계정과목목록조회 팝업
 * @설명: 계정과목목록조회 팝업의 JS
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.01.28 최초작성
 *  황석현 2021.04.28 2차 표준화
 *  황석현 2021.06.15 3차 표준화
 */

// 전역변수 선언부
var resultObj = {};	

$(document).ready(function(){
	
	//console.log("opener.POPUP_INFO.name ===> " + opener.POPUP_INFO.name);
	$("title").text(opener.POPUP_INFO.name);
	$(".popup_header h3").text(opener.POPUP_INFO.name);

	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	//포커스(계정그룹ID)
	$("#ibx_acitmCd").focus();
});

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
function initEvent() {
	//조회
	$("#btn_search").on("click", function(e){
		//계정과목목록 조회
		selectAcitmCdList();
	});
	
	//입력창 keyup
	$("#ibx_acitmCd, #ibx_acitmCdNm").on("keyup", function(e) {
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
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
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
			{ name: "acitmcd", title:"계정과목", css:"cell", type: "text", width: 50, align:"center"},
			{ name: "acitmcdnm", title:"계정과목명", css:"cell", type: "text", width: 100, align:"left"},
			{ name: "acitmcdexpln", title:"계정과목설명", css:"cell", type: "text", width: 120, align:"left"}
		]
	});	
	
	//row 클릭 이벤트
	gridObject.rowClick(function(args) {
		resultObj.acitmCd = args.item.acitmcd;
		resultObj.acitmCdNm = args.item.acitmcdexpln;
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
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
function selectAcitmCdList() {
	var reqParam = {};
	reqParam.acitmCd = $("#ibx_acitmCd").val();
	reqParam.acitmCdNm = $("#ibx_acitmCdNm").val();
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/jr/fijr111m/selectAcItmCdList.do")
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
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}

/**
 * @설명: 계정코드, 계정명을 부모창에 전달하고 팝업을 닫는다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
function popupConfirm() {
	//포거스 Row 유무체크
	var focusRow = $("#gridDiv .jsgrid-grid-body").find("tr.highlight");
	if(focusRow.length == 0) {
		$.fn.msgBox("선택된 항목이 없습니다.");
		return;
	}

	opener.openPopupAcitmCd_callback(resultObj);
	window.close();
}

/**
 * @설명: 팝업을 닫는다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
function popupClose() {
	window.close();
}