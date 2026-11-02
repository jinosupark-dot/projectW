/**
 * @시스템명: IFRS17
 * @업무명: NICE기업CB항목송수신이력 JS
 * @설명: NICE기업CB항목송수신이력 JS
 * @최초작성자: 양슬기
 * @최초작성일: 2025.09.25
 * @최종변경일:
 * @개정이력:
 *  양슬기 2025.09.25 최초작성

 */
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
    
	// event 초기화
	initEvent();
	
	// grid 초기화
	initGrid();
	
	var today = new Date();
	var year  = today.getFullYear();
	var month = ("0" + (today.getMonth() + 1)).slice(-2);
	var toYmd = year + "-" + month + "-" + ("0" + today.getDate()).slice(-2);
	$("#inp_basDt").val(toYmd);

});


/**
 * @설명: event 초기화
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function initEvent() {
	// 조회
	$("#btn_search").on("click", function(e){
		selectNiceCompCBComponHistList();
	});

	// 기준일자 달력
	$("#btn_basDt").on("click", function(e){
		$("#inp_basDt").datepicker("show");
	});

	// 마감년월 Enter키 조회
	$("#inp_basDt").on("keydown", function(e){
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidDate(this.value)) {
				$(this).val($.fn.dateFormat(this.value, ""));
				selectNiceCompCBComponHistList();
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
		var fileName = "NICE기업CB항목송수신이력.xlsx";

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
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function initGrid(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDivRins",
		height: 600,
		editing: true,
		sorting: true,
		paging: true,
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
			},
			insertItem : function(item) {}	
			
		},
		onItemEditing: function(args) {	//Grid Edit모드 진입시 처리
			
			//delete 상태 스킵
			if( args.item.status == 'd') {
				args.cancel = true;
			}
		},
		
		//그리드 컬럼 정의 !!!
	   fields: [
		  { name: "stndYmd", title:"기준일자", css:"cell", type: "text", width: 100, editing: false, align:"center"},
	      { name: "dlUnqNo", title:"거래고유번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "cbItmVal01", title:"KC1000001", css:"cell", type: "text",  width: 100, align:"right", editing: false},
	      { name: "cbItmVal02", title:"KC1000003", css:"cell", type: "text",  width: 100, align:"right", editing: false},
	      { name: "cbItmVal03", title:"KC1000009", css:"cell", type: "text",  width: 100, align:"right", editing: false},
	      { name: "cbItmVal04", title:"KC1000034", css:"cell", type: "text",  width: 100, align:"right", editing: false},
	      { name: "cbItmVal05", title:"KC1000033", css:"cell", type: "text",  width: 100, align:"right", editing: false},
	      { name: "cbItmVal06", title:"KC1000664", css:"cell", type: "text",  width: 100, align:"right", editing: false},
	      { name: "cbItmVal07", title:"KC1000917", css:"cell", type: "text",  width: 100, align:"right", editing: false},
	      { name: "cbItmVal08", title:"KC1000925", css:"cell", type: "text",  width: 100, align:"right", editing: false},
	      { name: "cbItmVal09", title:"KC1000927", css:"cell", type: "text",  width: 100, align:"right", editing: false}

	   ] 
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}





/**
 * @설명: NICE기업CB항목송수신이력 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function selectNiceCompCBComponHistList(){

	var stndYmd = $("#inp_basDt").val();
	stndYmd = stndYmd.replace('-','');
	stndYmd = stndYmd.replace('-','');
	
	//전송 파라미터 세팅 
	var req = {
			"stndYmd" : stndYmd
	};
	
	//서비스url 
	$.callAjax(req, "/rm/cb/rmcb311m/selectNiceCompCBComponHistList.do")
		.done(function(data) {
			// 그리드 데이터 초기화
			$("#gridDivRins").jsGrid("reset");

			// 그리드 바인딩
			var listData = data.list;
			$("#gridDivRins").jsGrid("loadData", listData).done(function() {
			});
			
			/* 2021.06.15 0건 그리드 메세지 처리 */
			if(listData.length == 0) {
				$.fn.getReturnValue("gridDivRins");
			}
			
		}).fail(function(data){
			console.log("fail to selectNiceCompCBComponHistList");
	});		
}



