/**
 * @시스템명: IFRS17
 * @업무명: 테이블조회 팝업
 * @설명: 테이블조회 팝업의 JS
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
	_INFO = opener.POPUP_INFO;
	$(".popup_header h3").text(_INFO.name);
	if(_INFO.popSc == "COL"){
		$("#colSearchDiv").css("display","block");
		$("#btn_search").attr("class","p2");
	}
	
	if(!isEmpty(_INFO.srchTbId)){
		if((/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/).test(_INFO.srchTbId)) $("#inp_srchTbNm").val(_INFO.srchTbId);
		else $("#inp_srchTbId").val(_INFO.srchTbId);
	}
	if(!isEmpty(_INFO.srchColId)){
		if((/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/).test(_INFO.srchColId)) $("#inp_srchColNm").val(_INFO.srchColId);
		else $("#inp_srchColId").val(_INFO.srchColId);
	}

	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	//목록조회
	selectSrcTbList();
	
	//Focus 설정
	$("#inp_srchTbId").focus();
});

/**
 * @설명: event 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 */
function initEvent() {
	
	//enter key event
	$("#inp_srchTbId,#inp_srchTbNm,#inp_srchColId,#inp_srchColNm").on("keypress", function(e){
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
		{ name: "tbId"  , title:"Table ID", css:"cell", type: "text", width: 110, align:"center"},
		{ name: "tbNm" , title:"Table 명", css:"cell", type: "text", width: 200, align:"left"}
	];
	if(_INFO.popSc == "COL"){
		vFields.push(
				{ name: "clumNm", title:"Column ID", css:"cell", type: "text", width: 280, editing: false, align:"left"},
				{ name: "clumKraNm", title:"Column 명", css:"cell", type: "text", width: 300, editing: false, align:"left"}
		);
	}
		
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
				tbId : args.item.tbId,
				tbNm : args.item.tbNm,
		};
		if(_INFO.popSc == "COL"){
			initObject["clumNm"] = args.item.clumNm;
			initObject["clumKraNm"] = args.item.clumKraNm;
		}
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
	
	var trgUrl = "/fi/at/fiat112p/selectSrcTbList.do";
	if(_INFO.popSc == "COL"){
		if(!isEmpty($("#inp_srchTbId").val())) reqParam["srchTbId"] = $("#inp_srchTbId").val();
		if(!isEmpty($("#inp_srchTbNm").val())) reqParam["srchTbNm"] = $("#inp_srchTbNm").val();
		if(!isEmpty($("#inp_srchColId").val())) reqParam["srchColId"] = $("#inp_srchColId").val();
		if(!isEmpty($("#inp_srchColNm").val())) reqParam["srchColNm"] = $("#inp_srchColNm").val();
		trgUrl = "/fi/at/fiat112p/selectSrcTbColList.do";
	} else {
		if(!isEmpty($("#inp_srchTbId").val())) reqParam["srchTbId"] = $("#inp_srchTbId").val();
		if(!isEmpty($("#inp_srchTbNm").val())) reqParam["srchTbNm"] = $("#inp_srchTbNm").val();
	}
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
	initObject["popSc"] = _INFO.popSc;
	opener.openPopupRamtSpcf_callback(initObject);
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