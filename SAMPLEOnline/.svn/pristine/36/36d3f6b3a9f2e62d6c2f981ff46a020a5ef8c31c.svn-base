/**
 * @시스템명: IFRS17
 * @업무명: 현황판1 JS
 * @설명: 현황판1 JS
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.14
 * @최종변경일:
 * @개정이력:
 *  양슬기 2025.10.14 최초작성
 */

var batchRunObj = {};
var lv02ClickObj = {};
var lv02ClickIndex = null;

var userInfoObj = {};
var screenPermission = "";



$(document).ready(function(){
	/* 2021.05.03 툴팁 추가 */
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/* 2021.06.14 화면ID 추가 */
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
    /* 2021.06.16 버튼권한처리 */
    // 엑셀업로드, 행추가, 저장
    var btnIdArr = ["btn_loadExcel", "btn_addGrid", "btn_save"];
	var permArr = [];
	for (var i = 0; i < btnIdArr.length; i++) {
		permArr.push({
			btnId : "#" + btnIdArr[i],
			type : "B"
		});
	}
    $.fn.setBtnPermission(permArr);
    
	var today = new Date();
	var year  = today.getFullYear();
	var month = ("0" + (today.getMonth() + 1)).slice(-2);
	var toYmd = year + "-" + month + "-" + ("0" + today.getDate()).slice(-2);
	$("#inp_basDt").val(toYmd);
	
	// event 초기화
	initEvent();
	
	// grid 초기화
	initGrid();
	
	// 포커스(마감년월 from)
	$("#inp_basDt").focus();
});


/**
 * @설명: event 초기화
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.14
 * @최종변경일: 
 * @개정이력: 
 *  양슬기 2025.10.14 최초작성
 */
function initEvent() {
	
	
	userInfoObj = $.fn.getLoginUserInfo();
	screenPermission = $.fn.getScreenPermissionInfo("fimt411m");
	
	// 조회
	$("#btn_search").on("click", function(e){
		selectMntr1List();
	});
	
	// 마감년월 to 달력
	$("#btn_basDt").on("click", function(e){
		$("#inp_basDt").datepicker("show");
	});
	
	// 마감년월 Enter키 조회
	$("#inp_basDt").on("keydown", function(e){
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidDate(this.value)) {
				//$(this).val($.fn.monthFormat(this.value, "-"));
				$(this).val($.fn.dateFormat(this.value, "-"));
				selectMntr1List();
				return false;
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		
		}
	});
	
	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "현황판1정보.xlsx";

		var paramObj = {};
		paramObj.id = gridId;
		paramObj.fileName = fileName;         
		paramObj.applyItemTemplate = false;   
		$.fn.exportGridExcel(paramObj);
	});
	
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.10.14 최초작성
 */
function initGrid(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDivRins",
		height: 600,
		editing: false,
		sorting: true,
		//paging: true,
		paging: false,
		
		selectHiglight: false,
		deleteConfirm: "삭제하시겠습니까?",
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				//debugger;
				var status = "u";	//수정
				if(item.status == "c" || item.status == "e" ) {	//신규, 엑셀업로드는 c,e상태 유지 후 데이터 수정
				} else if(item.status == "dd"){	//삭제신청으로 요청되면 "삭제"로 최정 변경처리
					item.status = "d";
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { //grid 삭제 아이콘 클릭 또는 deleteItem API이용시 진입
				//deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = "dd";	//삭제 신청
				//debugger;
				if (item.status == "c" || item.status == "e" ) {	//신규, 엑셀업로드 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else {	//u,d 는 삭제 상태로 처리 -> updateItem에서 최종  삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#gridDivRins").jsGrid("updateItem", item);
					return item;
				}
			}
		},
		//그리드 컬럼 정의 !!!
	   fields: [
		    { name: "rowNum", title:"순번", css:"cell", type: "text", width: 40, editing: false, align:"center"},
			{ name: "acntCd", title:"계정과목코드", css:"cell", type: "text", width:100, editing: false, align:"center"},
			{ name: "accoNm", title:"계정과목명", css:"cell", type: "text", width: 250, editing: false, align:"left"},
			{ name: "thmmCnt", title:"건수", css:"cell", type: "text", width: 60, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			},
			{ name: "thmmRamt", title:"원장금액", css:"cell", type: "text", width: 150, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			},
			{ name: "bsAmt", title:"BS금액", css:"cell", type: "text", width: 150, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			},
			{ name: "vrfOccuDifAmt", title:"차이금액", css:"cell", type: "text", width: 150, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			},
			{ name: "note01", title:"비고1", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "note02", title:"비고2", css:"cell", type: "text", width: 200, editing: false, align:"left"}
		  
	   ] 
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}




/**
 * @설명: 현황판1 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.10.14 최초작성
 */
function selectMntr1List(){
	
	//var inpBasDt = $.replaceAll($("#inp_basDt").val().trim(), "-","");
	var inpBasDt = $("#inp_basDt").val();
	inpBasDt = inpBasDt.replace('-','');
	inpBasDt = inpBasDt.replace('-','');
	var batchId  = $("#inp_batchId").val();
	
	var wkScCd = $("#wkScCd").val();
	
	if ($.fn.isNull(inpBasDt) ) {
		$.fn.msgBox("기준일자를 모두 입력하시기 바랍니다.");
		return false;
	}
	
console.log("basDt:"+inpBasDt+"_batchId:"+batchId);	
	//전송 파라미터 세팅 
	var req = {
			"stndYmd" : inpBasDt,
			"wkScCd" : wkScCd
	};
	
	lv02ClickObj = {};
	lv02ClickIndex = null;
	
	
	//서비스url 
	$.callAjax(req, "/rm/mt/rmmt111m/selectMntr1List.do")
		.done(function(data) {
			// 그리드 데이터 초기화
			$("#gridDivRins").jsGrid("reset");

			// 그리드 바인딩
			var listData = data.list;
			$("#gridDivRins").jsGrid("loadData", listData).done(function() {
			});
			
			
			//alert(JSON.stringfy(listData));
			/* 2021.06.15 0건 그리드 메세지 처리 */
			if(listData.length == 0) {
				$.fn.getReturnValue("gridDivRins");
			}
			
		}).fail(function(data){
			console.log("fail to selectMntr1List");
	});		
}


