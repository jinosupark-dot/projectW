/**
 * @시스템명: IFRS17
 * @업무명: 계정과목코드조회 팝업
 * @설명: 계정과목코드조회 팝업의 JS
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일:
 * @개정이력: 
 *  이상범    2021.03.08.   최초작성
 *  이상범    2021.04.26.   2차 표준화
 *  이상범    2021.06.16.   3차 표준화
 *  황석현    2021.11.22.   focus 설정
 */

//전역변수 선언
var initObject = null;
var _INFO = null;

$(document).ready(function(){
	_INFO = opener.POPUP_SRCH_INFO;
	$(".popup_header h3").text(_INFO.name);
	
	if(!isEmpty(_INFO.srchTxt)){
		if((/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/).test(_INFO.srchTxt)) $("#inp_srchCoa").val(_INFO.srchTxt);
		else $("#inp_srchAcitmCd").val(_INFO.srchTxt);
	}
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	//목록조회
	selectSrcTbList();
	
	//Focus 설정
	$("#inp_srchAcitmCd").focus();
});

/**
 * @설명: event 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 */
function initEvent() {
	
	//enter key event
	$("#inp_srchAcitmCd,#inp_srchCoa").on("keypress", function(e){
		if(e.keyCode == 13) $("#btn_search").click();
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		resetGrid();       //gird 초기화
		selectSrcTbList(); //조회
	});
	
	//확인
	$("#btn_confirm").on("click", function(e){
		var focusRow = $("#gridDiv .jsgrid-grid-body").find("tr.highlight");
		if(focusRow.length == 0) {
			$.fn.msgBox("선택된 항목이 없습니다.");
			return;
		}
		
		popupConfirm();
	});
	
	//닫기
	$("#btn_closePopup").on("click", function(e){
		popupClose();
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
function initGrid(){
	
	var vFields = [
		{ name: "acitmCd"  , title:"계정과목코드", css:"cell", type: "text", width: 90, align:"center"},
		{ name: "vrfItmNm" , title:"CoA", css:"cell", type: "text", width: 220, align:"left"}
	];
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id      : "gridDiv",
		height  : 350,
		editing : false,
		sorting : true,
		paging  : false,
		fields : vFields
	});	
	
	//row 클릭 이벤트
	gridObject.rowClick(function(args) {
		initObject = {
			acitmCd  : args.item.acitmCd,
			vrfItmNm : args.item.vrfItmNm,
		};
	});
	
	//row rowDoubleClick
	gridObject.rowDoubleClick(function(args) {
		initObject = args.item;
		popupConfirm();
	});

	//그리드 생성
	gridObject.gridCreate();

}

/**
 * @설명: 계정과목목록을 조회한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
function selectSrcTbList() {
	var reqParam = {};

	var trgUrl = "/fi/at/fiat111m/selectAcitmCdList.do";
	if(!isEmpty($("#inp_srchAcitmCd").val())) reqParam["srchAcitmCd"] = $("#inp_srchAcitmCd").val();
	if(!isEmpty($("#inp_srchCoa").val())) reqParam["srchCoa"] = $("#inp_srchCoa").val();
	// 데이터 조회
	$.callAjax(reqParam, trgUrl)
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
	}).fail(function(data){
		alert("데이터 불러오기 실패");
		console.log("fail to selectAcitmCdList !!");
	});
}

/**
 * @설명: 계정코드, 계정명을 부모창에 전달하고 팝업을 닫는다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: {}
 */
function popupConfirm() {
	//포거스 Row 유무체크
	//var focusRow = $("#gridDiv .jsgrid-grid-body").find("tr.highlight");
	if(isEmpty(initObject)) {
		$.fn.msgBox("선택된 항목이 없습니다.");
		return;
	}

	opener.openPopupAcitmCd_callback(initObject);
	resetGrid();
	window.close();
}

/**
 * @설명: 팝업을 닫는다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
function popupClose() {
	resetGrid();
	window.close();
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}

function isEmpty(value) {
	return typeof value === "undefined" || value == null || value == "" ? true : false;
}