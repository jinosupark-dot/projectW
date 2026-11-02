/**
  * @시스템명: IFRS17
 * @업무명: 테이블 목록 조회
 * @설명: 테이블 목록 조회 팝업 JS
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.06
 * @최종변경일:
 * @개정이력:
 *  심민정 2021.01.06 최초작성
 *  심민정 2021.06.15 3차 소스표준화
 */

// 전역변수 선언부
var callJsFileName = "";
var resultObj = {};
var busnScCd = "";


$(document).ready(function(){
	initData();
	
	//event 초기화
	initEvent();
	
	//팝업그리드 초기화	
	initPopupGrid();
	
	//팝업창 띄울 때 첫 자동 조회
	searchTable_Popup();
	
	// 포커스(테이블ID)
	$("#ibx_tableId").focus();
});

function initEvent() {
	//테이블 조회
	$("#btn_search_p").on("click", function(e){
		searchTable_Popup();
	});
	
	//테이블 조회 검색 keydown
	$("#ibx_tableId, #ibx_tableName").on("keydown", function(key) {
		if(key.keyCode == 13){
			searchTable_Popup();
		}
	});
	
	//확인
	$("#btn_submit_p").on("click", function(e){
		popupConfirm();
	});
	
	//닫기
	$("#btn_close_p").on("click", function(e){
		window.close();
	});
}

function initData(){
	callJsFileName = opener.callJsFileName;
	busnScCd = opener.getBusnScCdValue();
}

function initPopupGrid(){
	var gridObject = new ComJsGrid();	
	gridObject.id("gridDiv");
	gridObject.height(315);

	//테이블조회 필드를 채우기
	gridObject.fields([
		{ name: "rowNum", title:"순번", css:"cell", type: "text", width: 30, editing: false, align:"center"},
		{ name: "busnScCd", title:"업무구분", css:"cell", type: "text", width: 50, align:"center"},
		{ name: "tableId", title:"테이블ID", css:"cell", type: "text", width: 65, align:"center"},
		{ name: "tableName", title:"테이블명", css:"cell", type: "text",  width: 250, align:"center"},
	]);

	//row click
	gridObject.rowClick(function(args) {
		resultObj = args.item;
	});	

	//double click
	gridObject.rowDoubleClick(function(args) {
		popupConfirm();
	});
	
	//그리드 생성
	gridObject.gridCreate();
}


/**
 * @설명: searchTable_Popup : 테이블조회 
 * @최초작성자: 권세림
 * @최초작성일: 2021. 01. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  권세림 2021. 01. 08. 최초작성
 */
function searchTable_Popup(){
//	console.log("searchTable_Popup");
	var tableId = $("#ibx_tableId").val();
	var tableName = $("#ibx_tableName").val();
	
	var reqParam = {
			"callJsFileName" : callJsFileName,
			"busnScCd" : busnScCd,
			"tableName": tableName,
			"tableId": tableId
	}
	$.callAjax(reqParam, "/ca/ff/caff111m/searchTable_Popup.do")
	.done(function(data) {
		// 그리드 초기화
		$("#gridDiv").jsGrid("reset");
		
		//서버로 받아온 데이터 리스트
		var listData = data.list;  		
		
		//그리드 바인딩
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		/* 2021.06.24 0건 그리드 메세지 처리 */
		if(listData.length == 0) {
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		console.log("fail to searchTable_Popup");
	});		
}

function popupConfirm() {
	if (resultObj.tableName==null || resultObj.tableId==null){
		alert("선택된 테이블이 없습니다. 테이블을 선택하세요.");
	}else{
		opener.resultTablePopup_callback(resultObj);
		window.close();
	}
}

