/**
 * @시스템명: IFRS17
 * @업무명: 예제
 * @설명: 예제 샘플 소스코드이다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @개정이력:
 *  장창환 2020. 12. 30.  최초작성
 */


$(document).ready(function(){

	$("#searchKeyword").keypress(function(e){
		if(e.keyCode === 13){
			fn_getPagedList();
			return false;
		}
	})
	
	$("#user").select2({minimumResultsForSearch: -1})
	
	//jsGrid 초기 셋팅
	init_userSearchGridCreate();
	fn_getPagedList();
});

//*******************************************************************
//Function Name 	: init_userSearchGridCreate
//Description 		: 사용자검색 테이블 그리드 생성
//Argument			: 없음
//Return			: 없음
//*******************************************************************
function init_userSearchGridCreate(){
	
	// 상세내용 jsGrid 생성
	var userSearchTable = new ComJsGrid();
	// id 설정
	userSearchTable.id("userSearchTable");
	//패이징 처리
	userSearchTable.paging(true);
	//메뉴내용 필드를 채우기
	userSearchTable.fields([
		{ name: "ancmNtfId", title:"공지사항ID", css:"cell", type: "text", width: 50, align:"center"},
		{ name: "titl", title:"제목", css:"cell", type: "text", width: 60, align:"center"},
		{ name: "cont", title:"내용", css:"cell", type: "text", width: 80, align:"center"},
		{ name: "iqcnt", title:"조회건수", css:"cell", type: "text", width: 70, align:"center"},
		{ name: "ipdtm", title:"입력일시", css:"cell", type: "text", width: 70, align:"center"},
		{ name: "inppCd", title:"입력자코드", css:"cell", type: "text",  width: 250, align:"left"},
	]);
	
//	-------------------------------------------------------------------------------------------------------------
//	-------------------------------------------------------------------------------------------------------------
	_rowClick = new Object();
	// 사용자 선택시 이벤트
	_rowClick.event = "fn_setUserNoNm(args.item.userNo, args.item.userNm)" 
	_rowClick.noClick = [];
	
	userSearchTable.pagerFormat("N");
	userSearchTable.rowClick(_rowClick);
	userSearchTable.gridCreate();
	
}

// *******************************************************************
// Function Name 	: fn_getPagedList
// Description 		: 사용자 리스트 조회 
// Argument			: p_pageNo(페이지)
// Return			: 없음
// *******************************************************************
function fn_getPagedList(){

	Ajax($("#frmPopupUser").serialize(), "/cmm/user/selectSearch.do")
	.done(function(data) {

		$("#userSearchTable").jsGrid("option", "data", []);
		$("#userSearchTable").jsGrid("reset");
		
		var dataObjList = [];
		if(!isEmpty(data) && !isEmpty(data.pagedList)){
			
			if(data.pagedList.length > 0){

				for(var i = 0; i < data.pagedList.length; i++){
					
					var dataObj = {};
					dataObj.no = (i+1);
					dataObj.userNo = data.pagedList[i].userNo;
					dataObj.userNm = data.pagedList[i].userNm;
					dataObj.deptNm = data.pagedList[i].deptNm;
					
					dataObjList.push(dataObj);
					
				}
				
				$("#userSearchTable").jsGrid("loadData", dataObjList);
//				$("#userSearchTable").jsGrid("option", "data", dataObjList);
			}
		}else{
			$("#userSearchTable").jsGrid("loadData", dataObjList);
		}
	
	}).fail(function(data){
		//실패
		if(data.status === 900){
			custom_alert("세션이 종료 되었습니다.", "사용자검색");
			top.location.href = "/isSessiontimeout.do";
		}else if(data.status === 800){
			custom_alert("데이터 조회중 에러가 발생하였습니다.", "사용자검색");
		}else{
			console.log("error", data);	
		}
	});
	
}

//*******************************************************************
//Function Name 	: fn_setUserNoNm
//Description 		: 사용자 선택
//Argument			: userNo(사용자ID), userNm(사용자명)
//Return			: 없음
//*******************************************************************
function fn_setUserNoNm(userNo, userNm){
	opener.fn_callBackUserNoNm(userNo,userNm);
	window.close();
}

