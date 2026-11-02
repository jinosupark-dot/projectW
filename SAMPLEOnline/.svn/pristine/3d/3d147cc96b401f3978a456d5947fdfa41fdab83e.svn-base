/**
 * @시스템명: IFRS17
 * @업무명: 경영계획 
 * @설명: 경영게획 배치프로그램 실행하는 화면
 * @최초작성자: 김방언
 * @최초작성일: 2024.12.03
 * @최종변경일: 2024.12.03
 * @개정이력:
 *  김방언 2024.12.03 최초작성
 *
 */
// 전역변수 선언부
var batchGridType ="";
var itemObj = {};
var batchRunObj = {};
var batchParamObj = {};
var lv02ClickObj = {};
var lv02ClickIndex = null;
var userInfoObj = {};
var screenPermission = "";

/**
 * @설명: ready
 * @최초작성자: 김방언
 * @최초작성일: 2024. 12. 03.
 * @최종변경일:
 * @개정이력: 김방언 2024. 12. 03. 최초작성
 */
$(document).ready(function() {
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	//$("#busn_sc_cd").append("<option value='S_BP'>경영계획</option");
		
	// event 초기화
	initEvent();

	// 그리드 초기화
	initGrid();
	
	$("#inp_finYm_from").focus();
});

/**
 * @설명: event 초기화
 * @최초작성자: 김방언
 * @최초작성일: 2024. 12. 03.
 * @최종변경일:
 * @개정이력: 김방언 2024. 12. 03. 최초작성
 */
function initEvent() {
	userInfoObj = $.fn.getLoginUserInfo();
	screenPermission = $.fn.getScreenPermissionInfo("bpco001m");
	console.log("$.fn.getScreenPermissionInfo : ",$.fn.getScreenPermissionInfo("bpco001m"));
	console.log("$.fn.getLoginUserInfo : ",$.fn.getLoginUserInfo());
	
	// $.fn.setBtnPermission([{"btnId":"#btn_bndlManopFin"}]);
	
	// 마감년월
	$('#inp_finYm_from').val(setFinYm());
	
	setFinDate();
	
	//마감년월 입력창 blur
	$('#inp_finYm_from').on('blur', function(e) {
		//빈값 체크
		if($.fn.isEmpty(this.value)) {
			return;
		}
		
		//날짜형식 체크
		if($.isValidYm(this.value)) {
			$(this).val($.fn.monthFormat(this.value, "-"));
			setFinDate();
		} else {
			$.fn.msgBox('마감년월의 날짜 형식이 맞지 않습니다. 다시 입력해주세요.');
			$(this).focus();
		}
		
	});
	
	// Enter키로 조회 : 마감년월
	$("#inp_finYm_from").on("keyup", function(e){
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidYm(this.value)) {
				$(this).val($.fn.monthFormat(this.value, "-"));
				$("#btn_search").click();
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		}else{
			initReGrid();
			
			if($.replaceAll($(this).val().trim(), '-','').length == 6){
				setFinDate();
			}
		}
	});
	
	//마감년월 입력창 click
	$("#inp_finYm_from").on("click", function(e){
		$(this).select();
	});
	
	// 조회
	$("#btn_search").on("click", function(e) {
		lv02ClickObj = {};
		lv02ClickIndex = null;

		// 입력날짜 체크
		var today = new Date();
		var year = today.getFullYear();
		var month = ( '0' + (today.getMonth() + 1)).slice(-2);
		var todayString = year + '-' + month;
		
		if(  $("#inp_finYm_from").val() > todayString ){
			$.fn.msgBox('마감년월은 현재보다 이전월로 입력하시기 바랍니다.');
			return false;
		}
		
		// 업무상세구분이 주요지표(KI)이면 프로렛런번호구분을 선택할 수 없음  
		// IFRS17 및 K-ICS Prophet 결과 적재에만 프로펫런번호 구분을 선택할수 있음  
		if ( $("#busn_dtl_sc_cd").val() == "KI" && $("#prpht_run_no_sc_cd").val() != "" ){
			$.fn.msgBox('업무상세구분이 주요지표(KI)이면 프로렛런번호구분을 선택할 수 없습니다.');
			return false;
		}

		// 조회 실행
		selectBusinessPlanningBatchList();
	});
	
	// 조회조건 엔터키 조회
	$("#busn_sc_cd, #bat_id_content, #bat_expln_content").on("keypress", function(e) {
		if(e.keyCode === 13) {
			$("#btn_search").click();
			return false;
		}
	});
	
}

/**
 * @설명: initGrid : GridTable 생성
 * @최초작성자: 김방언
 * @최초작성일: 2024. 12. 03.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김방언 2024. 12. 03. 최초작성
 */
function initGrid() {

	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id : "gridDiv",
		height : 500,
		editing : false,
		sorting : true,
		paging : true,
		//pageSize: 10,
		confirmDeleting : false,
		fields : [
					{ name: "pgmId", title:"프로그램ID", css:"cell", type: "text", width: 24, editing: false, align:"center"},
					{ name: "batId", title:"배치ID", css:"cell", type: "text", width: 35, align:"left"},
					{ name: "batExpln", title:"배치설명", css:"cell", type: "text", width: 150, align:"left"},
					{ name: "statNm", title:"수행결과", css:"cell", type: "text", width: 25, align:"center"},
					{ name: "strDtm", title:"시작일시", css:"cell", type: "text", width: 60, align:"center"},
					{ name: "endDtm", title:"종료일시", css:"cell", type: "text", width: 45, align:"center"},
					{ name: "trtCnt", title:"적재건수", css:"cell", type: "number", width: 30, align:"right", itemTemplate:function(value, item) {
						return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
					}},
					{ name: "", title:"", css:"cell", type: "text", width: 18, align:"center", 
						itemTemplate:function(value, item){
							//if(lv02ClickObj.actFinDeptCd == userInfoObj.orgNo && screenPermission == 'Y'){
								var btnBatPopup = "";
								//if ( $statNm == "수행전" ){
									btnBatPopup = $("<button class='grid_inbtn_s'>").text("수행");
								//	}								
								//else
								//	{
								//	btnBatPopup = $("<button class='grid_inbtn_s'>").text("재수행");
								//	}
								var $pBatEl2 = $("<p>").addClass("fr");
								var $aBatEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
									// 배치작업 실행 팝업호출
									callBatchRunPopup(item);
								});
								$aBatEl.append(btnBatPopup);
								
								return $("<div>").append($pBatEl2.append($aBatEl));
							//}
						}
					},
			     ]
		});
	
	// 그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: selectBusinessPlanningBatchList : 경영계획 배치프로그램목 목록을 조회한다.
 * @최초작성자: 김방언
 * @최초작성일: 2024. 12. 03.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김방언 2024. 12. 03. 최초작성
 */
function selectBusinessPlanningBatchList() {
	console.log("selectBusinessPlanningBatchList js 실행!!!");
	var reqParam = {};
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val().trim(), '-','');
	reqParam.batchId = $("#bat_id_content").val();
	reqParam.batchExpln = $("#bat_expln_content").val();
	reqParam.busnScCd = $("#busn_sc_cd").val();
	reqParam.busnDtlScCd = $("#busn_dtl_sc_cd").val();
	reqParam.prphtRunNoScCd = $("#prpht_run_no_sc_cd").val();
	
	console.log("reqParam",reqParam);
	
	if ($.fn.isEmpty(reqParam.finYm)) {
		$.fn.msgBox('마감년월을 입력하시기 바랍니다.');
		return false;
	}

	// 데이터 조회
	$.callAjax(reqParam, "/bp/co/bpco001m/selectBusinessPlanningBatchList.do",{async:false}).done(
			function(data) {
				initReGrid();

				// 그리드 바인딩
				var listData = data.list;
				$("#gridDiv").jsGrid("loadData", listData).done(function() {
					//if(lv02ClickIndex != null){
					//	showActivityContent(lv02ClickObj);
					//}
				});
				
				//0건 그리드 메세지 처리
				if(listData.length == 0){
					$.fn.getReturnValue("gridDiv");
				}
			}).fail(function(data) {
		console.log("fail to selectBusinessPlanningBatchList !!");
	});
}

/**
 * @설명: 결산모니터링 상세
 * @최초작성자: 김방언
 * @최초작성일: 2024. 12. 03.
 * @최종변경일:
 * @매개변수:clickObject
 * @반환값:
 * @개정이력: 김방언 2024. 12. 03. 최초작성
 */
function showActivityContent(clickObject){
	console.log("showActivityContent js 실행!!!",clickObject);
	
	lv02ClickObj = clickObject;
	
	var reqParam = {};
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	reqParam.stactActUppId = clickObject.actId02;

	// 데이터 조회
	$.callAjax(reqParam, "/bp/co/bpco001m/selectBusinessPlanningBatchList.do",{async:false}).done(
			function(data) {
				// 그리드 초기화
				resetGrid("gridDtlDiv");

				// 그리드 바인딩
				var listData = data.list;
				$("#gridDtlDiv").jsGrid("loadData", listData).done(function() {
				});
				
				//0건 그리드 메세지 처리
				if(listData.length == 0){
					$.fn.getReturnValue("gridDtlDiv");
				}
			}).fail(function(data) {
		console.log("fail to selectBusinessPlanningBatchList !!");
	});
}

/**
/**
 * @설명: 배치실행 팝업을 호출한다.
 * @최초작성자: 김방언
 * @최초작성일: 2024. 12. 03.
 * @최종변경일:
 * @매개변수:rowItem
 * @반환값:
 * @개정이력: 김방언 2024. 12. 03. 최초작성
 */
function callBatchRunPopup(item) {
	console.log("callBatchRunPopup !!",item);
	
	var stage = selectStage();
	var url = "";
	
	if(stage == "PROD"){
		url = "/bp/co/bpco001p.do"
	}else if(stage == "TEST"){
		url = "/bp/co/bpco001p.do"
	}else{
		url = "/bp/co/bpco001p.do"
	}
	
	batchRunObj.actUppId = item.actId03;
	batchRunObj.batchId = item.batId;
	batchRunObj.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	
	var popupOption = {
			url: url,
			name: "배치실행팝업",
			width: 1200,
			height: 650
	}
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 김방언
 * @최초작성일: 2024. 12. 03.
 * @최종변경일:
 * @매개변수: gridNm
 * @반환값:
 * @개정이력: 김방언 2024. 12. 03. 최초작성
 */
function resetGrid(gridNm) {
	$("#"+gridNm).jsGrid("reset");
	$("#"+gridNm).jsGrid("option", "data", []);
}

/**
 * @설명: 초기 마감월 세팅
 * @최초작성자: 김방언
 * @최초작성일: 2024. 12. 03.
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 김방언 2024. 12. 03. 최초작성
 */
function setFinYm(){
	// 마감년월 셋팅
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();
	
	var calcDate = new Date(year, month, "1");
	
	year = calcDate.getFullYear();
	month = '' + (calcDate.getMonth()+1);
	
	if (month.length < 2) month = '0' + month;
	
	var finYm = $.fn.monthFormat((year+month),'-');
	
	return finYm;
}

/**
 * @설명: 마감월 처리 결산시작일 조회
 * @최초작성자: 김방언
 * @최초작성일: 2024. 12. 03.
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 김방언 2024. 12. 03. 최초작성
 */
function setFinDate(){
	console.log("setFinDate js 실행!!!");
	
	var reqParam = {};
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
}

/**
 * @설명: 현재 접속한 서버 스테이지 코드 조회
 * @최초작성자: 김방언
 * @최초작성일: 2024. 12. 03.
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 김방언 2024. 12. 03. 최초작성
 */
function selectStage(){
	console.log("selectStage js 실행!!!");
	
	var reStage = "";
	
	// 데이터 조회
	$.callAjax({},"/bp/co/bpco001m/selectStage.do",{async:false}).done(
			function(data) {
				reStage = data.stage;
			}).fail(function(data) {
		console.log("fail to selectStage !!");
	});

	
	return reStage;	
}

/**
 * @설명: 그리드초기화
 * @설명: 배치실행 팜업 콜백
 * @최초작성자: 김방언
 * @최초작성일: 2024. 12. 03.
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 김방언 2024. 12. 03. 최초작성
 * 
 */
function initReGrid(){
		
	// 그리드 초기화
	resetGrid("gridDiv");
	
	// 그리드 초기화
	resetGrid("gridDtlDiv");
}


/**
* 
* @설명: 팜업 콜백
* @최초작성자: 김방언
* @최초작성일: 2025. 01. 24.
* @최종변경일:
* @매개변수: 
* @반환값: 
* @개정이력: 김방언 2025. 01. 24. 최초작성
* 
*/
function resultBusinessPlanningBatchRunPopup_callback(){
	selectBusinessPlanningBatchList();
}