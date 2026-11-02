/**
 * @시스템명: IFRS17
 * @업무명: N1원장입수결과 검색
 * @설명: N1원장입수결과 검색
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.25
 * @최종변경일: 2021.11.22
 * @개정이력:
 *  최동염 2021.01.25 최초작성
 *  최동염 2021.04.28 2차 표준화
 *  최동염 2021.06.15 3차 표준화
 *  황석현 2021.11.22 기준일자 포커스 설정
 */

$(document).ready(function(){
	initEvent();
	initPopupGrid();
	
	$("#search_input_stndYmd").focus();
});


function initEvent() {
	//$('#search_input_sapLinkTbId').val("ZZA05T");
	
	//조회
	$("#btn_search_p").on("click", function(e){
		searchN1Result_Popup();
	});
	
	// Enter키로 조회 : 부서코드
	$("#search_input_stndYmd, #search_input_sapLinkTbId").on("keydown", function(e){
		if(e.which === 13){
			$("#btn_search_p").click();
		}
	});
	
	//닫기
	$("#btn_close_p").on("click", function(e){
		window.close();
	});
}

function initPopupGrid(){
	var gridObject = new ComJsGrid();	
	gridObject.id("gridDiv");
	gridObject.height(300);
	
	gridObject.fields([
		{ name: "seq", title:"순서", css:"cell", type: "text", width: 10, editing: false, align:"center"},
		{ name: "sapLinkTbId", title:"SAP연계테이블ID", css:"cell", type: "text", width: 28, align:"left"},
		{ name: "stndYmd", title:"기준일자", css:"cell", type: "text", width: 20, align:"center"},
		{ name: "sapLinkVrfScBrkdn", title:"SAP연계검증구분내역", css:"cell", type: "text", width: 34, align:"left"},
		{ name: "sapLinkVrfScVal", title:"SAP연계검증구분값", css:"cell", type: "text", width: 30, align:"left"},
		{ name: "ldYmd", title:"적재일자", css:"cell", type: "text", width: 20, align:"center"},
		{ name: "ldVrfScVal", title:"적재검증구분값", css:"cell", type: "text", width: 25, align:"left"},
		{ name: "regntEno", title:"등록자사번", css:"cell", type: "text", width: 20, align:"left"},
		{ name: "regDtm", title:"등록일시", css:"cell", type: "text", width: 38, align:"left"},
		{ name: "trtrEno", title:"처리자사번", css:"cell", type: "text", width: 20, align:"left"},
		{ name: "trtDtm", title:"처리일시", css:"cell", type: "text", width: 38, align:"left"},
	]);
	
	
	
	// 그리드 생성
	gridObject.gridCreate();
}
/**
 * @설명:  : N1원장입수결과 검색
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 */
function searchN1Result_Popup() {
	console.log("searchN1Result_Popup");
	
	var reqParam = {
		"stndYmd" : $.replaceAll($("#search_input_stndYmd").val().trim(), '-',''),
		"sapLinkTbId" : $('#search_input_sapLinkTbId').val()
	}
	$.callAjax(reqParam, "/fi/mt/fimt212p/selectN1Result_Popup.do")
	.done(function(data) {
		$("#gridDiv").jsGrid("reset");		//그리드 데이터 초기화			
		var listData = data.list;  		//서버로 받아온 데이터 리스트
		//그리드 바인딩
		$("#gridDiv").jsGrid("loadData", listData).done(function(){  
		});
	}).fail(function(data){
		console.log("fail to searchN1Result_Popup");
	});		
}

