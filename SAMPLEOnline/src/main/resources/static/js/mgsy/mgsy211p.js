/**
 * @시스템명: IFRS17
 * @업무명: 시스템권한관리
 * @설명: 사원,조직,화면 검색의 팝업
 * @최초작성자: 권세림
 * @최초작성일: 2021.01.12
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  권세림 2021.01.12  최초작성
 *  권세림 2021.06.15 3차 소스표준화
 */

var resultObj = {};
var searchType = '';

$(document).ready(function(){
	initEvent();
	
	searchType = opener.roleGrideType;
	initPopupGrid(searchType);
	setTitle(searchType);
});


function initEvent() {
	//사원조회
	$("#btn_search_p").on("click", function(e){
		checkValidScValue1();
		checkValidScValue2();
		searchUser_Popup();
	});
	
	//확인
	$("#btn_submit_p").on("click", function(e){
		popupConfirm();
	});
	
	//닫기
	$("#btn_close_p").on("click", function(e){
		window.close();
	});
	
	$('#sc_cd').on('change',function(){
		$('#search_input_content_1').val("");
		$('#search_input_content_2').val("");
		if (getScCdValue() == "user") {
			$('#is_user_search').text("사원검색");
			$('#search_title_1').text("사원번호");
			$('#search_title_2').text("사원명");
		} else if (getScCdValue() == "group") {
			$('#is_user_search').text("조직검색");
			$('#search_title_1').text("조직번호");
			$('#search_title_2').text("조직명");
		}
	});
	 $('#sc_cd').on("keydown", function(e){
		if(e.which === 13){
			checkValidScValue1();
			checkValidScValue2();
			searchUser_Popup();
			return false;
		}
	});
	 $('#search_input_content_1').on("keydown", function(e){
		 if(e.which === 13){
			 checkValidScValue1();
			 checkValidScValue2();
			 searchUser_Popup();
			 return false;
		 }
	 });
	 $('#search_input_content_2').on("keydown", function(e){
		 if(e.which === 13){
			 checkValidScValue1();
			 checkValidScValue2();
			 searchUser_Popup();
			 return false;
		 }
	 });

	 searchType  = opener.roleGrideType;
	 if (searchType == "user") {
		$("#sc_cd").focus();
	} else if (searchType == "menuByRole") {
		$("#search_input_content_1").focus();
	} else if (searchType == "roleByRuleSetting") {
		$("#search_input_content_1").focus();
	}
}

function initPopupGrid(searchType){
	var gridObject = new ComJsGrid();	
	gridObject.id("gridDiv");
	gridObject.height(300);
	
	console.log("searchType    :   "+searchType);
	
	if (searchType == "user") {
		gridObject.fields([
			{ name: "rowNum", title:"순번", css:"cell", type: "text", width: 35, editing: false, align:"center"},
			{ name: "uppOrgNo", title:"상위조직코드", css:"cell", type: "text",  width: 100, align:"center"},
			{ name: "uppOrgNm", title:"상위조직", css:"cell", type: "text",  width: 100, align:"center"},
			{ name: "orgNo", title:"조직코드", css:"cell", type: "text", width: 100, align:"center"},
			{ name: "orgNm", title:"조직", css:"cell", type: "text", width: 100, align:"center"},
			{ name: "userEno", title:"사번", css:"cell", type: "text", width: 100, align:"center"},
			{ name: "userNm", title:"사원명", css:"cell", type: "text",  width: 100, align:"center"},
		]);
	}  else if (searchType == "menuByRole") {
		gridObject.fields([
			{ name: "rowNum", title:"순번", css:"cell", type: "text", width: 35, editing: false, align:"center"},
			{ name: "menuId", title:"화면ID", css:"cell", type: "text",  width: 100, align:"center"},
			{ name: "menuNm", title:"화면이름", css:"cell", type: "text", width: 100, align:"center"},
		]);
	}else if (searchType == "roleByRuleSetting") {
		gridObject.fields([
			{ name: "rowNum", title:"순번", css:"cell", type: "text", width: 35, editing: false, align:"center"},
			{ name: "uppOrgNo", title:"상위조직코드", css:"cell", type: "text",  width: 100, align:"center"},
			{ name: "uppOrgNm", title:"상위조직명", css:"cell", type: "text",  width: 100, align:"center"},
			{ name: "orgNo", title:"조직코드", css:"cell", type: "text", width: 100, align:"center"},
			{ name: "orgNm", title:"조직명", css:"cell", type: "text",  width: 100, align:"center"},
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

function checkValidScValue1(){
	var searchType = opener.roleGrideType;
	var value1 = $('#search_input_content_1').val();
	var reg;
	if(value1 ==""){
		return;
	}
	
	switch(searchType){
	case "user" :
	case "roleByRuleSetting" :
		if(!$.isNumber(value1)){
			$.fn.msgBox("숫자만 입력가능합니다.");
			return;
		}
		break;
	case "menuByRole" :
		reg = (/[`~!@#$%^&*|\\\'\";:\/?ㄱ-ㅎ]/g);
		if(reg.test(value1)){
			$.fn.msgBox("영문 숫자만 입력가능합니다.");
			return;
		}
		break;
	}
}
function checkValidScValue2(){
	var searchType = opener.roleGrideType;
	var value2 = $('#search_input_content_2').val();
	var reg;
	if(value2 ==""){
		return;
	}
	switch(searchType){
	case "user" :
		reg = (/[`~!@#$%^&*|\\\'\";:\/?]/g);
		if (getScCdValue() == "group") {
			return;
		}
		if(reg.test(value2)){
			$.fn.msgBox("특수문자는 입력이 불가합니다.");
			return;
		}
		break;
	}
}

/**
 * @설명:  : 사원/조직 
 * @최초작성자: 권세림
 * @최초작성일: 2021. 01. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  권세림 2021. 01. 08. 최초작성
 */
function searchUser_Popup() {
	console.log("searchUser_Popup");
	var searchType = opener.roleGrideType;
	var searchTypeResult = "";
	var scCd;
	var userEno;
	var userNm;
	var menuId;
	var menuNm;
	var orgNo;
	var orgNm;
	
	if (searchType == "user") {
		searchTypeResult = "user";
		if (getScCdValue() == "user") {
			scCd = "user";
			userEno = $('#search_input_content_1').val();
			userNm = $('#search_input_content_2').val();
		} else if (getScCdValue() == "group") {
			scCd = "group";
			orgNo = $('#search_input_content_1').val();
			orgNm = $('#search_input_content_2').val();
		}
	} else if (searchType == "menuByRole") {
		searchTypeResult = "menuByRole";
		menuId = $('#search_input_content_1').val();
		menuNm = $('#search_input_content_2').val();
		if (menuId == "" && menuNm == "") {
			alert("화면ID, 화면명 중 필수입력");
			return;
		}
	} else if (searchType == "roleByRuleSetting") {
		searchTypeResult = "roleByRuleSetting"
		orgNo = $('#search_input_content_1').val();
		orgNm = $('#search_input_content_2').val();
	}

	var reqParam = {
		"searchType" : searchTypeResult,
		"scCd" : scCd,
		"userEno" : userEno,
		"userNm" : userNm,
		"menuId" : menuId,
		"menuNm" : menuNm,
		"orgNo" : orgNo,
		"orgNm" : orgNm
	}
	$.callAjax(reqParam, "/mg/sy/mgsy211m/showSelect_Popup.do")
	.done(function(data) {
		$("#gridDiv").jsGrid("reset");		//그리드 데이터 초기화			
		var listData = data.list;  		//서버로 받아온 데이터 리스트
		//그리드 바인딩
		$("#gridDiv").jsGrid("loadData", listData).done(function(){  
		});
		 // --------------------------------------------------					
        // 0건 그리드 메세지 처리 부분					
        // --------------------------------------------------					
        if(listData.length == 0){					
            $.fn.getReturnValue("gridDiv");					
        }		
	}).fail(function(data){
		console.log("fail to searchTable_Popup");
	});		
}

function popupConfirm() {
	var searchType = opener.roleGrideType;
	var returnObj = {};	
	if (searchType == "user") {
		if (resultObj.userEno == null || resultObj.userNm == null) {
			alert("선택된 사원이 없습니다. 사원을 선택하세요.");
		} else {
			opener.resultUserPopup_callback(resultObj);
			window.close();
		}
	}  else if (searchType == "menuByRole") {
		if (resultObj.menuId == null || resultObj.menuNm == null) {
			alert("선택된 화면이 없습니다. 화면을 선택하세요.");
		} else {
			opener.resultUserPopup_callback(resultObj);
			window.close();
		}
	}else if (searchType == "roleByRuleSetting") {
		if (resultObj.orgNo == null || resultObj.orgNo == null) {
			alert("선택된 조직이 없습니다. 조직을 선택하세요.");
		} else {
			opener.resultUserPopup_callback(resultObj);
			window.close();
		}
	}

	
}
function getScCdValue(){
	var sc_cd = $("#sc_cd option:selected").val();
	return sc_cd;
}

function setTitle(searchType){
	if (searchType == "user") {
		$('#sc_cd_div').show();
		$('#is_user_search').text("사원검색");
		$('#search_title_1').text("사원번호");
		$('#search_title_2').text("사원명");
	} else if (searchType == "menuByRole") {
		$('#sc_cd_div').hide();
		$('#is_user_search').text("화면검색");
		$('#search_title_1').text("화면ID");
		$('#search_title_2').text("화면명");
	} else if (searchType == "roleByRuleSetting") {
		$('#sc_cd_div').hide();
		$('#is_user_search').text("조직검색");
		$('#search_title_1').text("조직번호");
		$('#search_title_2').text("조직명");
	}
}
