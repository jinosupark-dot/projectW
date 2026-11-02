/**
 * @시스템명: IFRS17
 * @업무명: 수기테이블속성관리 JS
 * @설명: 수기테이블속성관리 JS
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.19
 * @최종변경일:
 * @개정이력:
 *  심민정 2021.01.19 최초작성
 *  심민정 2021.06.15 3차 소스표준화
 *  황석현 2021.12.13 공통코드 I17_BUSN_SC_CD 수정
 */
// 전역변수 선언부
var callJsFileName = "mgda311m"; //화면ID
var CUR_ROW_ITEM = null;

$(document).ready(function() {
	/* 2021.05.03 툴팁 추가 */
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/* 2021.06.14 화면ID 추가 */
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
    /* 2021.06.14 저장 권한제어 추가 */
    $.fn.setBtnPermission([{"btnId":"#btn_save","type":"B"}]);
	
	// 공통코드 조회
	selectCommonCode();
	
	//조회조건 초기화
	initSearchData();

	// event 초기화
	initEvent();

	// 그리드 초기화
	initGrid();
});

/**
 * @설명: 공통코드 조회
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.25
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 
 *  심민정 2021.01.25 최초작성
 */
function selectCommonCode() {
	//공통코드 조회(사업비코스트센터배부채널코드)
	$.fn.loadCommonCode(["BAT_PRG_STAT_CD"]);
	
	//콤보박스 세팅
	$.fn.renderCombobox({
		codeArr: ["BAT_PRG_STAT_CD"],
		selArr: ["sbx_batPrgStatCd"],
		firstOptionText: ["-전체-"]
	});
}

/**
 * @설명: event 초기화
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.19.
 * @최종변경일:
 * @개정이력: 
 *  심민정 2021.01.19. 최초작성
 */
function initEvent() {
	// 조회
	$("#btn_search").on("click", function(e) {
		selectBatLogMngList();
	});

	// 저장
	$("#btn_save").on("click", function(e) {
		saveBatLogMngList();
	});
	
	//마감년월 달력버튼 click
	$("#btn_finYm").on("click", function(e) {
		$("#ibx_finYm").datepicker("show");
	});
	
	//조회조건 엔터키 조회
	$("#ibx_finYm, #ibx_batWkId, #ibx_strDtm").on("keypress", function(e) {
	    if(e.keyCode == 13) {
	        $("#btn_search").click();
	        return false;
	    }
	});
}

/**
 * @설명: 조회조건 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.27 최초작성
 */
function initSearchData() {
	//마감년월 - 전월
	var nowDate = new Date();
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth();
	
	var temp = new Date(year, month, "1");
	temp.setMonth(month - 1);
	
	year = temp.getFullYear();
	month = (temp.getMonth() + 1).toString();
	month = month.length == 1 ? "0" + month : month;
	
	//마감년월 세팅
	$("#ibx_finYm").val($.fn.monthFormat(year + month, "-"));
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.18.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 
 *  심민정 2021.01.18. 최초작성
 */
function initGrid() {

	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id : "gridDiv",
		height : 470,
		editing : true,
		sorting : true,
		paging : true,
		confirmDeleting : false,
		deleteConfirm : "삭제하시겠습니까?",
		controller : {
			updateItem : function(item) { // Edit모드에서 적용 아이콘 또는 updateItem
											// API를 이용시 진입
				// debugger;
				var status = 'u'; // 수정
				if (item.status == 'c') { // 신규는 c상태 유지 후 데이터 수정
				} else if (item.status == 'dd') { // 삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { // grid 삭제 아이콘 클릭 또는 deleteItem
											// API이용시 진입
				// deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = 'dd'; // 삭제 신청
				// debugger;
				if (item.status == 'c') { // 신규 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else { // u,d 는 삭제 상태로 처리 -> updateItem에서 최종 삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#roleGrid").jsGrid("updateItem", item);
					return item;
				}
			}
		},
		onItemEditing : function(args) { // Grid Edit모드 진입시 처리
			// debugger;
			// 체크박스는 Edit 모드 취소
			var targetElem = (event) ? event.srcElement || null : null;
			if (targetElem) {
				if (targetElem.outerHTML.indexOf("check") > 0) {
					args.cancel = true;
				}
			}
			// delete 상태 스킵
			if (args.item.status == 'd') {
				args.cancel = true;
			}
		},
		fields : [
			{name: "finYm", title: "마감년월", css: "cell", type: "text", width: 50, align: "center", editing: false
			},
			{name: "batWkId", title: "배치작업ID", css: "cell", type: "text", width: 70, align: "left", editing: false
			},
			{name: "strDtm", title: "시작일시", css: "cell", type: "text", width: 70, align: "center", editing: false
			},
			{name: "endDtm", title: "종료일시", css: "cell", type: "text", width: 70, align: "center", editing: false
			},
			{name: "batPrgStatCd", title: "배치진행상태코드", css: "cell", type: "select", width: 50, align: "center", editing: true
	            , items: $.fn.getGridCodeItem("BAT_PRG_STAT_CD"), textField: "codeNm", valueField: "code"
			},
			{name: "inptPrmtrExpln", title: "입력파라미터설명", css: "cell", type: "text", width: 70, align: "left", editing: false
			},
			{name: "regntEno", title: "등록자사번", css: "cell", type: "text", width: 50, align: "center", editing: false
			},
			{name: "regDtm", title: "등록일시", css: "cell", type: "text", width: 50, align: "center", editing: false
			},
			{name: "trtrEno", title: "처리자사번", css: "cell", type: "text", width: 50, align: "center", editing: false
			},
			{name: "trtDtm", title: "처리일시", css: "cell", type: "text", width: 50, align: "center", editing: false
			},
			{name : "status",title : "상태",css : "cell",type : "text",width : 30,align : "center",editing : false,itemTemplate : function(value, item) {
				return $.fn.getGridRowStatusName(value);
				}
			}
		]
	});

	// 그리드 생성
	gridObject.gridCreate();


}

/**
 * @설명: 배치로그관리 조회
 * @최초작성자: 서승호
 * @최초작성일: 2023.12.26
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 
 */
function selectBatLogMngList() {
	var reqParam = {};
	reqParam.finYm = $("#ibx_finYm").val().replace(/-/g, "");
	reqParam.batWkId = $("#ibx_batWkId").val();
	reqParam.strDtm = $("#ibx_strDtm").val();
	reqParam.batPrgStatCd = $("#sbx_batPrgStatCd option:selected").val(); //포트폴리오 코드

	$.callAjax(reqParam, "/mg/da/mgda311m/selectBatLogMngList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//서버로 받아온 데이터 리스트
		var listData = data.list;
		
		// 그리드 바인딩
		$("#gridDiv").jsGrid("loadData", listData).done(function() {
		});

		/* 2021.06.15 0건 그리드 메세지 처리 */
		if(listData.length == 0) {
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data) {
		console.log("fail to selectBatLogMngList !!");
	});
}


/**
 * @설명: 배치로그관리 수정
 * @최초작성자: 서승호
 * @최초작성일: 2023.12.26
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 
 */
function saveBatLogMngList() {
	var reqParam = {};
	
	// 전체 데이터
	var gridData = $("#gridDiv").jsGrid("option", "data");
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	
	var saveList = [];
	// c,u,d 건만 추출 후 저장 처리
	for (var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		if (item.status == 'u') {
			saveList.push(item);
		}  
	}
	
	console.log(JSON.stringify(saveList));

	$.callAjax({"saveList": JSON.stringify(saveList)}, "/mg/da/mgda311m/updateBatLogMngList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//정상처리 후 재 조회
		if(data && data.result && data.result > 0){
			alert(data.result+"건 저장 정상처리되었습니다.");
			selectBatLogMngList();
		}else{
			alert("저장 실패!!");
		}
		
	}).fail(function(data) {
		console.log("fail to selectBatLogMngList !!");
	});
}


/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 서승호
 * @최초작성일: 2023.12.26
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}
