/**
 * @시스템명: IFRS17
 * @업무명: 공지사항관리
 * @설명: 공지사항을 관리하는 화면의 JS
 * @최초작성자: 61000255 (권세림)
 * @최초작성일: 2021.02.03
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  권세림 2021.02.03  최초작성
 *  권세림 2021.06.15 3차 소스표준화
 */


var clickIndex ;	
var clickObject={};	//그리드에서 선택 object
var ignoreAnucEndYmd = "" ;
var saveType="";

$(document).ready(function(){
	
	//view 초기화
	initView();
	//event 초기화
	initEvent();
	//그리드 초기화	
	initGrid();
	selectNoticeList();
	showInsertDiv();
	
});

function initView(){
	/*2021.05.03 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");		
    
    //포커스(게시 일자) 2021.06.14
    $("#notice_search_dtae_to_txt").focus();
    
    //버튼 권한 처리 2021.06.14
    $.fn.setBtnPermission([{"btnId":"#notice_btn_edit","type":"B"}])			//저징버튼
    $.fn.setBtnPermission([{"btnId":"#notice_btn_save","type":"B"}])			//저징버튼
    $.fn.setBtnPermission([{"btnId":"#notice_btn_delete","type":"B"}])		//삭제버튼
}

function initEvent() {
	//저장
	
	$("#notice_search_dtae_to_txt").focus();
	
	$("#notice_btn_save").on("click", function(e){
		console.log("notice_btn_save click   :      "+ saveType);
		saveGridData();
	});
	$("#notice_btn_edit").on("click", function(e){
		saveGridData();
	});
	//삭제
	$("#notice_btn_delete").on("click", function(e){
		deleteNotice();
	});
	//신규등록
	$("#notice_add_data").on("click", function(e){
		reset();
		showInsertDiv();
	});
	//취소
	$("#notice_cancel").on("click", function(e){
		console.log("notice_cancel click   :      "+ saveType);
		saveType = "I";
		reset();
	});
	
	$("#notice_btn_search").on("click", function(e){
		if(isValidSc($("#notice_search_input_user").val())){
			$.fn.msgBox("특수문자는 입력이 불가합니다.");
			return;
		}
		selectNoticeListByInfo();
	});
	
	$("#notice_search_dtae_to").on("click", function(e){
		$("#notice_search_dtae_to_txt").datepicker("show");
	});
	
	$("#notice_search_dtae_from").on("click", function(e){
		$("#notice_search_dtae_from_txt").datepicker("show");
	});
	
	$("#anucStrYmd_btn").on("click", function(e){
		$("#anucStrYmd").datepicker("show");
	});
	
	$("#notice_search_check").on("change", function(e){
		if ($('input:checkbox[id="notice_search_check"]').is(":checked") == true) {
			ignoreAnucEndYmd = "Y";
		} else {
			ignoreAnucEndYmd = "N";
		}
	});
	$("#notice_search_input_user,#notice_search_input_org").on("keydown", function(e){
		if(e.which === 13){
			if(isValidSc($("#notice_search_input_user").val())){
				$.fn.msgBox("특수문자는 입력이 불가합니다.");
				return;
			}
			selectNoticeListByInfo();
		}
	});
	$("#notice_search_dtae_to_txt , #notice_search_dtae_from_txt").on("keydown", function(e){
		if(e.which === 13){
			selectNoticeListByInfo();
		}
	});
	
	reset();
}

function isValidSc(value){
	if(value==""){
		return;
	}
	var reg = (/[`~!@#$%^&*|\\\'\";:\/?]/g);
	return reg.test(value);
}
function getDateFormate(){
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();
	var date = today.getDate();
	
	var calcDate = new Date(year, month, date,"1");

	year = calcDate.getFullYear();
	month = '' + (calcDate.getMonth() + 1);
	date = '' + (calcDate.getDate());

	if (month.length < 2)
		month = '0' + month;
	
	if (date.length == 1)
		date = '0' + date;

	var resultDate = year + month + date;
	
	return formatDate = $.fn.dateFormat(resultDate, '-');
}

function initGrid(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "noticeGrid",
		height: 250,
		editing: false,
		sorting: false,
		paging: true,
		selectHiglight:true,
		fields : [
			{ name: "rowNum", title:"순번", css:"cell", type: "text", width: 20, editing: false, align:"center"},
			{ name: "anucTitl", title:"제목", css:"cell", type: "text", width: 150, align:"left"},
			{ name: "anucStrYmd", title:"게시일자", css:"cell", type: "text",  width: 50, align:"center", editing: true, itemTemplate:function(value, item) {
							return $.fn.dateFormat(value, "-");			
						}},
			{ name: "avlPrd", title:"게시기간", css:"cell", type: "text", width: 50, editing: false, align:"center", itemTemplate:function(value, item) {
				return getSelectedAvlPrdType(value, "-");			
			}},
			{ name: "userNm", title:"게시자", css:"cell", type: "text", width: 50, editing: false, align:"center"},
			{ name: "orgNm", title:"게시부서", css:"cell", type: "text", width: 50, editing: false, align:"center"}
		]
	});	
	
	gridObject.rowClick(function(args) {
		clickIndex = args.itemIndex;
		clickObject = args.item;
		showNoticeContent(clickObject);
//		console.log("rowClick sno   :      "+ clickObject.sno);
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}
function reset(){
	clickIndex = 0;
	clickObject = {};
	
	var userInfo = $.fn.getLoginUserInfo();
	var userNm = userInfo.userNm;
	var orgNm = userInfo.orgNm;

	
	showInsertDiv();
	$("#avlPrd").val("");
	$("#anucStrYmd").val(getDateFormate());
	$("#anucTitl").val("");
	$("#userNm").text(userNm);
	$("#orgNm").text(orgNm);
	$("#anucCntnt").val("");
//	console.log("reset clickIndex   :      "+ clickIndex
//			+"		reset clickObject   :      ",clickObject
//			+"		reset saveType   :      "+ saveType
//			);
}
function showInsertDiv(){
	saveType = "I";
	$("#default_div").hide();
	$("#insert_div").show();
}
function showEditDiv(){
	$("#default_div").show();
	$("#insert_div").hide();
}

function showNoticeContent(clickObject){
	showEditDiv();
	saveType = "U";
	$("#avlPrd").val(clickObject.avlPrd);
	$("#anucStrYmd").val( $.fn.dateFormat(clickObject.anucStrYmd, '-'));
	$("#anucTitl").val(clickObject.anucTitl);
	$("#userNm").text(clickObject.userNm);
	$("#orgNm").text(clickObject.orgNm);
	$("#anucCntnt").val(clickObject.anucCntnt);
	

}

function getSelectedAvlPrdType(avlPrd){
	switch (avlPrd) {
	case "09":
		return "영구";
	case "1M":
		return "1개월";
	case "3M":
		return "3개월";
	case "6M":
		return "6개월";
	case "1Y":
		return "1년";
	}	
}

function selectNoticeList() {
	console.log("selectNoticeList");
	
	var reqParam = {};
	$.callAjax(reqParam, "/mg/sy/mgsy111m/selectNoticeList.do")
	.done(function(data) {
        $("#noticeGrid").jsGrid("reset");		//그리드 데이터 초기화	
		var listData = data.list;
		$("#noticeGrid").jsGrid("loadData", listData).done(function(){ 
			reset();
		});
		   // --------------------------------------------------					
        // 0건 그리드 메세지 처리 부분					
        // --------------------------------------------------					
        if(listData.length == 0){					
            $.fn.getReturnValue("noticeGrid");					
        }					
        // --------------------------------------------------					
			
	}).fail(function(data){
		  console.log("fail to selectNoticeList");		
	});		
}

function selectNoticeListByInfo() {
	console.log("selectNoticeListByInfo");
	
	var anucStrYmd = $.replaceAll($('#notice_search_dtae_to_txt').val().trim(), '-','');
	var anucStrYmd2 = $.replaceAll($('#notice_search_dtae_from_txt').val().trim(), '-','');
	var userNm =$("#notice_search_input_user").val();
	var orgNm = $("#notice_search_input_org").val();
	
	var reqParam = {
			"ignoreAnucEndYmd" : ignoreAnucEndYmd,
			"anucStrYmd" : anucStrYmd,
			"anucStrYmd2" : anucStrYmd2,
			"userNm" : userNm,
			"orgNm" : orgNm
			
	};
	console.log(reqParam);
	
	$.callAjax(reqParam, "/mg/sy/mgsy111m/selectNoticeListByInfo.do")
	.done(function(data) {
	    $("#noticeGrid").jsGrid("reset");	
		var listData = data.list;
		$("#noticeGrid").jsGrid("loadData", listData).done(function(){
			 // --------------------------------------------------					
	           // 0건 그리드 메세지 처리 부분					
	           // --------------------------------------------------					
			if (listData.length == 0) {
				$.fn.getReturnValue("noticeGrid");
			}
			reset();
		});
	}).fail(function(data){
        console.log("fail to selectNoticeListByInfo");	
	});		
}

function saveGridData() {
//	console.log("saveType   :   "+saveType);
	var callUrl = "";
	var sno = "";
	var anucStrYmd = $.replaceAll($('#anucStrYmd').val().trim(), '-','');
	var anucTitl= $("#anucTitl").val();
	var anucCntnt= $("#anucCntnt").val();
	var avlPrd= $("#avlPrd").val();
	
	
	var userInfo = $.fn.getLoginUserInfo();
	var userNm = userInfo.userNm;
	var orgNm = userInfo.orgNm;
	var userId = userInfo.userId;
	var regntEno = userInfo.userEno;
	var orgNo = userInfo.orgNo;
	

	if (anucStrYmd == "") {
		alert("게시일자를 입력하세요.");
		return;
	}
	if (anucTitl == "") {
		alert("제목를 입력하세요.");
		return;
	}
	if (avlPrd == "") {
		alert("게시기간를 선택하세요.");
		return;
	}
	if (anucCntnt == "") {
		alert("내용를 입력하세요.");
		return;
	}

	if (saveType == "U" && clickObject != null) {
		sno = clickObject.sno;
	}
//	console.log("saveGridData clickIndex   :   "+clickIndex);
//	console.log("saveGridData sno   :   "+sno);

	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if (saveType == "I") {
			callUrl = "/mg/sy/mgsy111m/insertNotice.do";
			var reqParam = {
					"regntEno" : regntEno,
					"userNm" : userNm,
					"orgNo" : orgNo,
					"orgNm" : orgNm,
					"anucStrYmd" : anucStrYmd,
					"anucTitl" : anucTitl,
					"anucCntnt" : anucCntnt,
					"avlPrd" : avlPrd
			};
			console.log(reqParam);
			
		} else if (saveType == "U") {
			callUrl = "/mg/sy/mgsy111m/updateNotice.do";
			var reqParam = {
					"sno" : sno,
					"anucStrYmd" : anucStrYmd,
					"anucTitl" : anucTitl,
					"anucCntnt" : anucCntnt,
					"avlPrd" : avlPrd
			};
			console.log(reqParam);
		}
		if(obj.btn_ok) {
			$.callAjax(reqParam,callUrl )
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					//재조회
					selectNoticeList();
					reset();
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}
function deleteNotice() {
	console.log("deleteNotice");
	var sno = clickObject.sno;
	var reqParam = {
			"sno" : sno
			
	};
	console.log(reqParam);
	$.fn.msgBox("삭제하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam,"/mg/sy/mgsy111m/deleteNotice.do" )
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					//재조회
					selectNoticeList();
					reset();
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

