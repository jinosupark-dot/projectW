/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-결산 관리
 * @설명: 부서/배치 조회
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.25
 * @최종변경일:
 * @개정이력:
 *  최동염 2021.01.25 최초작성
 *  최동염 2021.04.28 2차 표준화
 *  최동염 2021.06.15 3차 표준화
 */
var resultObj = {};

$(document).ready(function(){
	initEvent();
	
	var searchType = opener.activityGrideType;
	
	console.log("searchType    :   "+searchType);
	
	initPopupGrid(searchType);
	setTitle(searchType);
});


function initEvent() {
	$("#search_input_content_1").focus();
	//조회
	$("#btn_search_p").on("click", function(e){
		searchUser_Popup();
	});
	
	
	// Enter키로 조회
	$("#search_input_content_1, #search_input_content_2").on("keydown", function(e){
		if(e.which === 13){
			$("#btn_search_p").click();
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

function initPopupGrid(searchType){
	var gridObject = new ComJsGrid();	
	gridObject.id("gridDiv");
	gridObject.height(300);
	
	console.log("searchType    :   "+searchType);
	
	if (searchType == "dept") {
		gridObject.fields([
			{ name: "rowNum", title:"순번", css:"cell", type: "text", width: 35, editing: false, align:"center"},
			{ name: "stactActFinDeptCd", title:"부서코드", css:"cell", type: "text", width: 70, align:"center"},
			{ name: "stactActFinDeptNm", title:"부서명", css:"cell", type: "text", width: 130, align:"left"},
		]);
	}  else if (searchType == "batch") {
		gridObject.fields([
			{ name: "rowNum", title:"순번", css:"cell", type: "text", width: 35, editing: false, align:"center"},
			{ name: "batId", title:"배치ID", css:"cell", type: "text",  width: 70, align:"center"},
			{ name: "stactActNm", title:"배치명", css:"cell", type: "text", width: 130, align:"left"},
		]);
	}

	// row click
	gridObject.rowClick(function(args) {
		resultObj = args.item;
		
	});	

	// double click
	gridObject.rowDoubleClick(function(args) {
		popupConfirm();
	});
	
	// 그리드 생성
	gridObject.gridCreate();

}
/**
 * @설명:  : 부서/배치 
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 */
function searchUser_Popup() {
	console.log("searchUser_Popup");
	var searchType = opener.activityGrideType;
	var stactActFinDeptCd;
	var stactActFinDeptNm;
	var batId;
	var batNm;
	
	if (searchType == "dept") {
		stactActFinDeptCd = $('#search_input_content_1').val();
		stactActFinDeptNm = $('#search_input_content_2').val();
	} else if (searchType == "batch") {
		batId = $('#search_input_content_1').val();
		batNm = $('#search_input_content_2').val();
	}
	
	var reqParam = {
		"searchType" : searchType,
		"stactActFinDeptCd" : stactActFinDeptCd,
		"stactActFinDeptNm" : stactActFinDeptNm,
		"batId" : batId,
		"stactActNm" : batNm
	}
	$.callAjax(reqParam, "/fi/mt/fimt111m/showSelect_Popup.do")
	.done(function(data) {
		$("#gridDiv").jsGrid("reset");		//그리드 데이터 초기화			
		var listData = data.list;  		//서버로 받아온 데이터 리스트
		//그리드 바인딩
		$("#gridDiv").jsGrid("loadData", listData).done(function(){  
		});
	}).fail(function(data){
		console.log("fail to searchTable_Popup");
	});		
}

function popupConfirm() {
	var searchType = opener.activityGrideType;
	var returnObj = {};	

	if (searchType == "dept") {
		if (resultObj.stactActFinDeptCd == null || resultObj.stactActFinDeptNm == null) {
			alert("선택된 부서가 없습니다. 부서를 선택하세요.");
		} else {
			opener.resultPopup_callback(resultObj);
			window.close();
		}
	}  else if (searchType == "batch") {
		if (resultObj.batId == null || resultObj.stactActNm == null) {
			alert("선택된 배치가 없습니다. 배치를 선택하세요.");
		} else {
			opener.resultPopup_callback(resultObj);
			window.close();
		}
	}
}

function setTitle(searchType){
	if (searchType == "dept") {
		$('#is_user_search').text("부서정보조회 팝업");
		$('#search_title_1').text("부서번호");
		$('#search_title_2').text("부서명");
	} else if (searchType == "batch") {
		$('#is_user_search').text("배치정보조회 팝업");
		$('#search_title_1').text("배치ID");
		$('#search_title_2').text("배치명");
	}
}
