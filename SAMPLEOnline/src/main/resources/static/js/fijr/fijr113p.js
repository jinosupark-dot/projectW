/**
 * @시스템명: IFRS17
 * @업무명: 금액유형상세구분코드조회 팝업
 * @설명: 금액유형상세구분코드조회 팝업의 JS
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.06.09 최초작성
 *  황석현 2021.06.15 3차 표준화
 */

// 전역변수 선언부
var resultObj = {};	

$(document).ready(function(){
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	if(opener.popupOption.amtTypDtlScCd.length > 0) $("#ibx_amtTypDtlScCd").val(opener.popupOption.amtTypDtlScCd);
	
	//포커스
	$("#ibx_amtTypDtlScCd").focus();
});

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
function initEvent() {
	//조회
	$("#btn_search").on("click", function(e){
		selectAmtTypDtlScCdList();
	});
	
	//입력창 keyup
	$("#ibx_amtTypDtlScCd, #ibx_amtTypDtlScCdNm").on("keyup", function(e) {
		if(e.which == 13) {
			$("#btn_search").click();
		}
	});
	
	//확인
	$("#btn_confirm").on("click", function(e){
		popupConfirm();
	});
	
	//닫기
	$("#btn_closePopup").on("click", function(e){
		popupClose();
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 250,
		editing: false,
		sorting: true,
		paging: true,
		fields : [
			{ name: "acctCd", title:"회계코드", css:"cell", type: "text", width: 40, align:"center"},
			{ name: "acctCdNm", title:"회계코드명", css:"cell", type: "text", width: 50, align:"left"},
			{ name: "acntgBusnClsfCd", title:"업무분류", css:"cell", type: "text", width: 40, editing: false, align:"center"},
			{ name: "acntgBusnClsfCdNm", title:"업무분류명", css:"cell", type: "text", width: 55, editing: false, align:"left"},
			{ name: "amtTypScCd", title:"금액유형구분", css:"cell", type: "text", width: 55, editing: false, align:"center"},
			{ name: "amtTypScCdNm", title:"금액유형구분명", css:"cell", type: "text", width: 120, editing: false, align:"left"},
			{ name: "amtTypDtlScCd", title:"금액유형상세구분", css:"cell", type: "text", width: 75, editing: false, align:"center"},
			{ name: "amtTypDtlScCdNm", title:"금액유형상세구분명", css:"cell", type: "text", width: 140, editing: false, align:"left"}
		]
	});	
	
	//row 클릭 이벤트
	gridObject.rowClick(function(args) {
		resultObj.acctCd = args.item.acctCd;
		resultObj.acctCdNm = args.item.acctCdNm;
		resultObj.acntgBusnClsfCd = args.item.acntgBusnClsfCd;
		resultObj.acntgBusnClsfCdNm = args.item.acntgBusnClsfCdNm;
		resultObj.amtTypScCd = args.item.amtTypScCd;
		resultObj.amtTypScCdNm = args.item.amtTypScCdNm;
		resultObj.amtTypDtlScCd = args.item.amtTypDtlScCd;
		resultObj.amtTypDtlScCdNm = args.item.amtTypDtlScCdNm;
	});
	
	//row 더블클릭 이벤트
	gridObject.rowDoubleClick(function(args) {
		popupConfirm();
	});
	
	//그리드 생성
	gridObject.gridCreate();
	
}

/**
 * @설명: 계정과목목록을 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
function selectAmtTypDtlScCdList() {
	var reqParam = {};
	reqParam.acctCd = opener.popupOption.acctCd;
	reqParam.acntgBusnClsfCd = opener.popupOption.acntgBusnClsfCd;
	reqParam.amtTypScCd = opener.popupOption.amtTypScCd;
	reqParam.amtTypDtlScCd = $("#ibx_amtTypDtlScCd").val();
	reqParam.amtTypDtlScCdNm = $("#ibx_amtTypDtlScCdNm").val();

	// 데이터 조회
	$.callAjax(reqParam, "/fi/jr/fijr113p/selectPopupList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		alert("데이터 불러오기 실패");
		console.log("fail to selectAcitmCdList !!");
	});
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}

/**
 * @설명: 선택항목을 부모창에 전달하고 팝업을 닫는다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
function popupConfirm() {
	//포거스 Row 유무체크
	var focusRow = $("#gridDiv .jsgrid-grid-body").find("tr.highlight");
	if(focusRow.length == 0) {
		$.fn.msgBox("선택된 항목이 없습니다.");
		return;
	}

	opener.openPopup_callback(resultObj);
	window.close();
}

/**
 * @설명: 팝업을 닫는다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
function popupClose() {
	window.close();
}