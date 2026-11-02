/**
 * @시스템명: IFRS17
 * @업무명: 사업비-계정목록조회 팝업
 * @설명: 계정목록조회 팝업의 JS
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  김정민 2021.01.07 최초작성
 *  김정민 2021.06.15 3차 소스표준화
 */

// 전역변수 선언부
var resultObj = {};	

$(document).ready(function(){
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	//포커스(계정번호)
	$("#ibx_accoNo").focus();
});

/**
 * @설명: event 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function initEvent() {
	//조회
	$("#btn_search").on("click", function(e){
		//사업비 계정목록 조회
		selectAccoList();
	});

	//입력창 keyup(계정번호, 계정명)
	$(".search-item").find("input[type=text]").on("keypress", function(e) {
		if(e.which == 13) {
			$("#btn_search").click();
			return false;
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
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
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
			{ name: "seq", title:"순번", css:"cell", type: "text", width: 30, align:"center", sorter:"number"},
			{ name: "accoNo", title:"계정번호", css:"cell", type: "text", width: 50, align:"center"},
			{ name: "accoNm", title:"계정명", css:"cell", type: "text", width: 100, align:"left"}
		]
	});	
	
	//row 클릭 이벤트
	gridObject.rowClick(function(args) {
		resultObj.accoNo = args.item.accoNo;
		resultObj.accoNm = args.item.accoNm;
	});
	
	//row 더블클릭 이벤트
	gridObject.rowDoubleClick(function(args) {
		popupConfirm();
	});
	
	//그리드 생성
	gridObject.gridCreate();
	
}

/**
 * @설명: 계정목록을 조회한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function selectAccoList() {
	var reqParam = {};
	reqParam.accoNo = $("#ibx_accoNo").val();
	reqParam.accoNm = $("#ibx_accoNm").val();;
	
	// 그리드 초기화
	resetGrid();
	
	// 데이터 조회
	$.callAjax(reqParam, "/ea/pr/eapr111p/selectAccoList.do")
	.done(function(data) {
		//Exception 발생 시, 공통 Message 제공
		if(data.result == "-1") { return; }
		
		//그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		/*2021.06.15 0건 그리드 메세지 처리*/
		if(listData.length == 0) {
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to selectAccoGrpList !!");
	});
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("option", "data", []);
	$("#gridDiv").jsGrid("reset");
}

/**
 * @설명: 계정번호, 계정명을 부모창에 전달하고 팝업을 닫는다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function popupConfirm() {
	//포거스 Row 유무체크
	var focusRow = $("#gridDiv .jsgrid-grid-body").find("tr.highlight");
	if(focusRow.length == 0) {
		$.fn.msgBox("선택된 항목이 없습니다.");
		return;
	}
	
	//부모창 함수 호출
	opener.openPopupAcco_callback(resultObj);
	window.close();
}

/**
 * @설명: 팝업을 닫는다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function popupClose() {
	window.close();
}