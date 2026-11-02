/**
 * @시스템명: IFRS17
 * @업무명: 배치 실행 Param 값 관리
 * @설명: 배치 실행 Param 값 관리
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.25
 * @최종변경일:
 * @개정이력:
 *  최동염 2021.01.25 최초작성
 *  최동염 2021.04.28 2차 표준화
 *  최동염 2021.06.15 3차 표준화
 *  황석현 2021.11.22 조회조건 엔터키 조회 추가
 */

var batchParamObj = {};
var commPrevClickObj = {};
var commClickObj = {};
var screenPermission = "";

$(document).ready(function(){
	batchParamObj = opener.batchParamObj;
	screenPermission = opener.screenPermission;
	
	if(screenPermission != "Y" ){
		$("#btn_comm_param_save").hide();
		$("#btn_indv_param_save").hide();
	}
	
		
	// 마감년월
	$('#inp_finYm_from').val($.fn.monthFormat(batchParamObj.finYm,'-'));
	
	initEvent();	
	initPopupGrid();
	initPopupGridDtl();
	
	$("#inp_finYm_from").focus();
});

function initEvent() {
	// 조회
	$("#btn_search").on("click", function(e) {
		selectBatchCommParamList();
	});
	
	// 공통 파라미터 저장
	$("#btn_comm_param_save").on("click", function(e) {
		saveCommGridDataAll();
	});
	
	// 개별 파라미터 저장
	$("#btn_indv_param_save").on("click", function(e) {
		saveIndvGridDataAll();
	});
	
	//닫기 
	$("#btn_close_p").on("click", function(e){
		window.close();
	});
	
	// Enter키로 조회 
	$("#inp_finYm_from, #inp_batchId, #inp_paramId").on("keydown", function(e){
		if(e.which === 13){
			$("#btn_search").click();
			return false;
		}
	});
}

function initPopupGrid(){
	var gridObject = new ComJsGrid({
		id : "gridDiv",
		height : 300,
		editing : true,
		sorting : true,
		paging : true,
		//pageSize: 10,
		confirmDeleting : false,
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				var status = 'u';	//수정
				
				if(item.status == 'c') {	//신규는 c상태 유지 후 데이터 수정
				} else if(item.status == 'dd'){	//삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				
				return item;
			}
		},
		fields : [
					{name: "paramId", title: "파라미터ID", css: "cell", type: "text", width: 30, editing: false, align: "center"},
					{name: "paramNm", title: "파라미터명", css: "cell", type: "text", width: 40, editing: false, align: "center"},
					{name: "paramCnt", title: "사용배치수", css: "cell", type: "text", width: 15, editing: false, align: "center"},
					{name: "paramVal", title: "파라미터값", css: "cell", type: "text", editing: true, align: "left"},
					{name: "status", title:"상태", css:"cell", type: "text", width: "5px", align:"center", editing: false, 
						itemTemplate:function(value, item) {return $.fn.getGridRowStatusName(value);}
					},
					{name: "gridManupulate", title:"그리드조작", css:"cell", type: "control",  width: "10px", align:"left", editing: false, deleteButton : false}
					
			     ]
		});
	
	gridObject.rowClick(function(args) {
		commPrevClickObj = commClickObj;
		commClickObj = args.item;
		selectBatchIndvParamList(commClickObj)
	});	
	
	// 그리드 생성
	gridObject.gridCreate();
}

function initPopupGridDtl(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id : "gridDtlDiv",
		height : 300,
		editing : true,
		sorting : true,
		paging : true,
		//pageSize: 10,
		confirmDeleting : false,
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				//debugger;
				var status = 'u';	//수정
				if(item.status == 'c') {	//신규는 c상태 유지 후 데이터 수정
				} else if(item.status == 'dd'){	//삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				return item;
			}
		},
		fields : [
					{name: "batchId", title: "배치ID", css: "cell", type: "text", width: 30, editing: false, align: "center"},
					{name: "paramId", title: "파라미터ID", css: "cell", type: "text", width: 30, editing: false, align: "center"},
					{name: "paramNm", title: "파라미터명", css: "cell", type: "text", width: 40, editing: false, align: "center"},
					{name: "paramVal", title: "파라미터값", css: "cell", type: "text", editing: true, align: "left"},
					{name: "status", title:"상태", css:"cell", type: "text", width: "10px", align:"center", editing: false, 
						itemTemplate:function(value, item) {return $.fn.getGridRowStatusName(value);}
					},
					{name: "gridManupulate", title:"그리드조작", css:"cell", type: "control",  width: "10px", align:"left", editing: false, deleteButton : false},
					{name: "pgmId", title: "pgmId", css: "cell", type: "text", width: 30, editing: false, align: "center", visible:false}
			     ]
		});
	
	// 그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: selectBatchCommParamList : 배치 Param 내역 조회
 * @최초작성자: 최동염
 * @최초작성일: 2021. 01. 18.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 01. 18. 최초작성
 */
function selectBatchCommParamList() {
	var reqParam = {};
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	reqParam.batchId = $("#inp_batchId").val();
	reqParam.paramId = $("#inp_paramId").val();
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/mt/fimt413p/selectBundleRunBatchCommParamList_Popup.do").done(
			function(data) {
				// 그리드 초기화
				resetGrid("gridDtlDiv");
				
				// 그리드 바인딩
				var listData = data.list;
				
				for(var i=0; i<listData.length; i++) {
					if(listData[i].paramVal == null){
						listData[i].paramVal = "";
					}
				}
				
				$("#gridDiv").jsGrid("loadData", listData).done(function() {
				});
			}).fail(function(data) {
		console.log("fail to selectBatchCommParamList !!");
	});
}

/**
 * @설명: selectBatchIndvParamList : 배치 개별 Param 내역  조회
 * @최초작성자: 최동염
 * @최초작성일: 2021. 01. 18.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 01. 18. 최초작성
 */
function selectBatchIndvParamList(clickObject) {
	var reqParam = {};
	reqParam.batchId = $("#inp_batchId").val();
	reqParam.paramId = clickObject.paramId;
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/mt/fimt413p/selectBundleRunBatchIndvParamList_Popup.do").done(
			function(data) {
				// 그리드 초기화
				//resetGrid("gridDiv");
				
				// 그리드 바인딩
				var listData = data.list;
				
				for(var i=0; i<listData.length; i++) {
					if(listData[i].paramVal == null){
						listData[i].paramVal = "";
					}
				}
				
				$("#gridDtlDiv").jsGrid("loadData", listData).done(function() {
				});
			}).fail(function(data) {
		console.log("fail to selectBatchIndvParamList !!");
	});
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 02. 08. 최초작성
 */
function resetGrid(gridNm) {
	$("#"+gridNm).jsGrid("reset");
	$("#"+gridNm).jsGrid("option", "data", []);
}

/**
 * @설명: 변수 체크
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 02. 08. 최초작성
 */
function isValid(rowIndex, item) {
	
	return true;
}

/**
 * 
 * @설명: 배치 공통 파라미터 저장
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function saveCommGridDataAll() {
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	
	var gridData = $("#gridDiv").jsGrid("option", "data");
	
	var reqParam = {};
	var saveList = [];
	//c,u,d 건만 추출 후 저장 처리
	for(var i=0; i<gridData.length; i++) {
		var item = gridData[i];
		
		reqParam = item;
		reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
		
		if(reqParam.status == 'u') {
			saveList.push(reqParam);
		}
	}
	
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({"list":JSON.stringify(saveList)}, "/fi/mt/fimt413p/saveBundleRunCommParamList.do")
			.done(function(data){
				if(data.result > "0") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					selectBatchCommParamList();
				}
			}).fail(function(data){
			});
		}
	}, 2);
}

/**
 * 
 * @설명: 배치 개별 파라미터 저장
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function saveIndvGridDataAll() {
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	
	var editRowClass = $("#gridDtlDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDtlDiv").jsGrid("updateItem");
	}
	
	var gridData = $("#gridDtlDiv").jsGrid("option", "data");
	
	var saveList = [];
	//c,u,d 건만 추출 후 저장 처리
	for(var i=0; i<gridData.length; i++) {
		var item = gridData[i];
		
		if(item.status == 'u') {
			saveList.push(item);
		}
	}
	
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({"list":JSON.stringify(saveList)}, "/fi/mt/fimt413p/saveBundleRunIndvParamList.do")
			.done(function(data){
				if(data.result > "0") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					selectBatchCommParamList();
					selectBatchIndvParamList(commClickObj);
				}
			}).fail(function(data){
			});
		}
	}, 2);
}