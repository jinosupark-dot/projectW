var overLapList = []; /* 중복체크용 */
var globalBatchChecked = ""; /* 배치 관리 선택 여부(batchId) */
var globalPgmId; /* 배치 관리 선택 여부(pgmId) */
/**
 * @시스템명: IFRS17
 * @업무명: 배치 관리
 * @설명: 배치 및 파라미터 정보를 관리하는 화면이다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일: 2021. 11. 22.
 * @개정이력:
 *  김동현 2021. 03. 16.  최초작성
 *  황석현 2021. 11. 22.  조회조건 엔터키 조회 추가
 *  김방언 2024. 12. 24.  그리드 업무구분에 경영계획(S_BP) 추가
 */

$(document).ready(function() {
	/*2021.04.30 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	
	
	//버튼 권한 처리 2021.06.14
    $.fn.setBtnPermission([{"btnId":"#btn_loadCSV"}
                          ,{"btnId":"#btn_loadExcel"}
                          ,{"btnId":"#btn_moveUp"}
                          ,{"btnId":"#btn_moveDown"}
                          ,{"btnId":"#btn_addBatch"}
                          ,{"btnId":"#btn_addParam"}
                          ,{"btnId":"#btn_save_batch"}
                          ,{"btnId":"#btn_save_param"}
                          ,{"btnId":"#btn_scheduleTest"}
                          ,{"btnId":"#btn_batchTest"}]);
                          
    $("#btn_loadCSV").hide();
	$("#btn_loadExcel").hide();
	$("#btn_exportCSV").hide();
	$("#btn_exportExcel").hide();
	$("#categoryId_run").hide();
	
	
	initBatchGrid();
	
	initParamGrid();
	selectCdcValtList(); // 업무구분 조회
	initEvent();
	
});



function initEvent() {
	
	$("#busn_sc_cd").focus();
	
	// CSV 다운로드
	$("#btn_exportCSV").on("click", function(e) {
		var paramObj = {};
		paramObj.id = "batchGrid";
		paramObj.fileName = "batchGrid.csv"; // 다운로드할 파일명
		paramObj.applyItemTemplate = false; // 그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로
											// Import하기 위해서는 false)
		$.fn.exportGridCSV(paramObj);
	});
 
	$("#btn_exportExcel").on("click", function(e) {
		var paramObj = {};
		paramObj.id = "batchGrid";
		paramObj.fileName = "batchGrid.xlsx"; // 다운로드할 파일명
		paramObj.applyItemTemplate = false; // 그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로
											// Import하기 위해서는 false)
		$.fn.exportGridExcel(paramObj);
		
		//암호화 
		/*downloadTest(paramObj, "excel");*/
	});

	// CSV 로드
	$("#btn_loadCSV").on("click", function(e) {
		loadCSV();
	});

	// EXCEL 로드
	$("#btn_loadExcel").on("click", function(e) {
		loadExcel();
	});
	// 순서변경 위로
	$("#btn_moveUp").on("click", function(e) {
		moveGridRow(false);
	});

	// 순서변경 아래로
	$("#btn_moveDown").on("click", function(e) {
		moveGridRow(true);
	});

	$("#btn_addBatch").on("click", function(e) {
		addBatchData();
	});

	$("#btn_addParam").on("click", function(e) {
		addParamData();
	});

	$("#btn_save_batch").on("click", function(e) {
		saveBatchGrid();
	});

	$("#btn_save_param").on("click", function(e) {
		saveParamGrid();
	});

	$("#btn_search").on("click", function(e) {
		globalBatchChecked = "";
		globalPgmId = "";
		// 배치관리 조회
		selectBatchListbyData();

		// 아래 테이블 초기화
		$("#paramGrid").jsGrid("reset");
		$("#paramGrid").jsGrid("option", "data", []);

	});
	
	$("#btn_scheduleTest").on("click", function(e) {
		btn_scheduleTest();
	});
	
	$("#btn_batchTest").on("click", function(e){
		btn_batchTest();
	});
	
	// 조회조건 엔터키 조회
	$("#busn_sc_cd, #bat_id_content, #bat_expln_content").on("keypress", function(e) {
		if(e.keyCode === 13) {
			$("#btn_search").click();
			return false;
		}
	});
	
}



function btn_batchTest(){
	var batchCnt = $("#batchCnt").val();
	var batchId = $("#batchId").val();
	
	var reqParam = {
		"batchCnt" : batchCnt,
		"batchId" : batchId
	}
	
	$.callAjax(reqParam, "/mg/sy/mgsy915m/executeBatchByCnt.do")
	.done(function(data) {
		
		console.log("Log : executeBatch success ");
	
	}).fail(function(data) {
		console.log("Log : selectBatchParamList fail: " + data);
	});
}

//5.27 그룹 배치 실행 테스트(임시)
function btn_scheduleTest(){
	
	var value = $("#categoryId").val();
	var value2 = $("#finYm").val();
	
	var reqParam = {
		"categoryId" : value,
		"finYm" : value2 
	}
	
	$.callAjax(reqParam, "/mg/sy/mgsy915m/executeGroupBatch.do")
	.done(function(data) {
		
		if (data.JobMind){
			
			if(data.JobMind.result == "0"){
				$("#groupResult").val("JobMind 요청 성공");
			}
			else if(data.JobMind.result == "1"){
				$("#groupResult").val("JobMind 요청 실패 : "+ errorMessage);
			}
		} 
		
		console.log("Log : executeBatch success ");
	
	}).fail(function(data) {
		console.log("Log : selectBatchParamList fail: " + data);
	});

}

function downloadTest(paramObj, type){
	var gridId = paramObj.id;
	
	var gridFields = $("#batchGrid").jsGrid("option", "fields");
	var paramFields = [];
	for (var i = 0; i<gridFields.length; i++){
		var fieldItem = gridFields[i];
		
		/*console.log("fieldItem : " , fieldItem);*/
		paramFields.push({
			name : fieldItem.name,
			title : fieldItem.title,
			type : fieldItem.type,
			width: fieldItem.width
			
			
		});
	}
	
	var gridData = $("#batchGrid").jsGrid("option", "data");
	var paramData = [];
	
	for (var i = 0; i<gridData.length; i++){
		var dataItem = gridData[i];
		paramData.push(dataItem);
	}

	var reqParam = {
		"paramFields" : JSON.stringify(paramFields),
		"paramData" : JSON.stringify(paramData)
	}
	var url = "/common/makeStreamDn.do";
	$.callAjax(reqParam, url)
	.done(function(data) {
		alert(data.filePath);
		$.fn.fileDownload("/mg/sy/mgsy911m/downloadFile.do?filePath=" + encodeURIComponent(data.filePath));
	}).fail(function(data){
	});
}



function loadExcel() {
	var paramObj = {};
	paramObj.id = "batchGrid"; // 그리드 ID
	paramObj.alertYn = "Y";
	paramObj.callbackFn = function(data) { // 그리드 바인딩 후 후처리 함수
		if (data.result == "1") {
			$.fn.msgBox("정상적으로 로드하였습니다.");
		}
	};
	$.fn.loadGridExcel(paramObj);
}

function loadCSV() {
	var paramObj = {};
	paramObj.id = "batchGrid"; // 그리드 ID
	paramObj.callbackFn = function(data) { // 그리드 바인딩 후 후처리 함수
		if (data.result == "1") {
			$.fn.msgBox("정상적으로 로드하였습니다.");
		}
	};

	$.fn.loadGridCSV(paramObj);
}
/**
 * 
 * @설명: 파라미터관리 그리드의 행을 위아래로 이동시킨다
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function moveGridRow(isDown) {
	var gridData = $("#paramGrid").jsGrid("option", "data");
	var checkedList = [];
	var isEdit = false;

	var item = gridData[clickIndex];
	checkedList.push(item);
	if (item.status) {
		isEdit = true;
	}
	if (isDown) {
		if (clickIndex == gridData.length - 1)
			return;
	} else {
		if (clickIndex == 0)
			return;
	}

	var newFocusIndex = 0;
	var tempList = [];
	if (isDown) {
		tempList = array_move(gridData, clickIndex, clickIndex + 1);
		newFocusIndex = clickIndex + 1;
	} else {
		tempList = array_move(gridData, clickIndex, clickIndex - 1);
		newFocusIndex = clickIndex - 1;
	}
	var newList = [];
	for (var i = 0; i < tempList.length; i++) {
		var item = tempList[i];
		item["prmtrInptSeq"] = (i + 1); // 바꿔야 함
		if (item.status != 'c') {
			item["status"] = "u";
		}
		newList.push(item);
	}
	$("#paramGrid").jsGrid("loadData", newList).done(function() {
		
		var $trEl = $("#paramGrid div.jsgrid-grid-body tr").eq(newFocusIndex);

		// 엘리먼트 유무 확인
		if (typeof $trEl === "undefined" || $trEl.length == 0) {
			return;
		}

		$trEl.addClass("highlight");
		clickIndex = newFocusIndex;
	});
}

function array_move(arr, old_index, new_index) {
	if (new_index >= arr.length) {
		var k = new_index - arr.length + 1;
		while (k--) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr;
}

/**
 * 
 * @설명: 배치 관리 그리드 데이터를 저장한다
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function saveBatchGrid() {

	var batchGridData = $("#batchGrid").jsGrid("option", "data");
	var editRowClass1 = $("#batchGrid").jsGrid("option", "editRowClass");

	if ($("." + editRowClass1).length > 0) {
		$("#batchGrid").jsGrid("updateItem");
	}

	if (checkOverlapBatch()) {
		checkBatchGridStatus(batchGridData);
	} else {
		$.fn.msgBox("배치ID를 확인해주세요.", function(obj) {
			return false;
		});
	}
	;
}

/**
 * 
 * @설명: 파라미터 관리 그리드 데이터를 저장한다
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function saveParamGrid() {

	$("#batchGrid").jsGrid("reset");

	var editRowClass = $("#paramGrid").jsGrid("option", "editRowClass");

	if ($("." + editRowClass).length > 0) {
		$("#paramGrid").jsGrid("updateItem");
	}

	var paramGridData = $("#paramGrid").jsGrid("option", "data");
	if (globalBatchChecked.length > 0 && globalBatchChecked != "") {
		if (checkOverlapParam()) {
			checkParamGridStatus(paramGridData);
		} else {
			$.fn.msgBox("파라미터ID를 확인해주세요.", function(obj) {
				return false;
			});
		};

	} else {
		$.fn.msgBox("배치ID를 선택해주세요.", function(obj) {
			return false;
		});
	}

}

/**
 * 
 * @설명: 파라미터 관리 입력 데이터의 중복(파라미터ID)을 검사한다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function checkOverlapParam() {
	var check = true;
	
	var paramGridData = $("#paramGrid").jsGrid("option", "data");
	overLapList = [];

	for (var i = 0; i < paramGridData.length; i++) {
		var checkValue = '';
		if (paramGridData[i].status == 'c' || paramGridData[i].status == 'u') {
			checkValue = paramGridData[i].inptPrmtrId;

			for (var j = 0; j < paramGridData.length; j++) {
				var $trEl1;
				var $trEl2;
				if (i != j) {
					if (checkValue.trim() == paramGridData[j].inptPrmtrId
							.trim()) {
						check = false;
					}
				}
			}
		}
	}

	return check;
}

/**
 * 
 * @설명: 배치관리 입력 데이터의 중복(배치ID)을 검사한다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function checkOverlapBatch() {
	var check = true;
	var batchGridData = $("#batchGrid").jsGrid("option", "data");
	overLapList = [];

	for (var i = 0; i < batchGridData.length; i++) {
		var checkValue = '';
		if (batchGridData[i].status == 'c' || batchGridData[i].status == 'u') {
			checkValue = batchGridData[i].batId;
			for (var j = 0; j < batchGridData.length; j++) {
				var $trEl1;
				var $trEl2;
				if (i != j) {
					if (checkValue.trim() == batchGridData[j].batId.trim()) {

						check = false;
					}
				}
			}
		}
	}
	return check;
}

/**
 * 
 * @설명: 파라미터관리 그리드의 상태 (c, u, d)를 검사하여 저장(insert, update, delete)한다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function checkParamGridStatus(data) {
	var saveList = [];

	for (var i = 0; i < data.length; i++) {
		var item = data[i];

		saveList.push(item);

	}
	if (checkOverlapParam()) {

		$.fn.msgBox("저장하시겠습니까?", function(obj) {
			if (obj.btn_ok) {
				$.callAjax({
					"list" : JSON.stringify(saveList)
				}, "/mg/sy/mgsy915p/saveParamGridList.do").done(function(data) {
					if (data.result > "0") {
						$.fn.msgBox("정상적으로 처리되었습니다.");
					}
				}).fail(function(data) {
				});
			}
		}, 2);
	} else {
		$.fn.msgBox("배치ID를 확인해주세요.", function(obj) {
			return false;
		});
	}
}

/**
 * 
 * @설명: 배치관리 그리드의 상태 (c, u, d)를 검사하여 저장(insert, update, delete)한다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function checkBatchGridStatus(data) {
	var saveList = [];

	for (var i = 0; i < data.length; i++) {
		var item = data[i];
		saveList.push(item);

	}
	if (checkOverlapBatch()) {

		$.fn.msgBox("저장하시겠습니까?", function(obj) {
			if (obj.btn_ok) {
				$.callAjax({
					"list" : JSON.stringify(saveList)
				}, "/mg/sy/mgsy915p/saveBatchGridList.do").done(function(data) {
					if (data.result > "0") {
						$.fn.msgBox("정상적으로 처리되었습니다.");
						globalBatchChecked = "";
						globalPgmId = "";
						selectParamList();
					}
				}).fail(function(data) {
				});
			}
		}, 2);
	} else {
		$.fn.msgBox("배치ID를 확인해주세요.", function(obj) {
			return false;
		});
	}
}

/**
 * 
 * @설명: 조회조건에 해당하는 배치 리스트를 조회한다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function selectBatchListbyData() {

	var reqParam = {
		"busnScCd" : $("#busn_sc_cd").val(),
		"batchId" : $("#bat_id_content").val(),
		"batchExpln" : $("#bat_expln_content").val()
	};

	$.callAjax(reqParam, "/mg/sy/mgsy915p/selectBatchListbyData.do").done(
			function(data) {
				var listData = data.list;
				// 초기화
				$("#batchGrid").jsGrid("reset");
				$("#batchGrid").jsGrid("option", "data", []);

				$("#batchGrid").jsGrid("loadData", listData).done(function() {

				});
				
				if(listData.length == 0){
					$.fn.getReturnValue("batchGrid");
				}

			}).fail(function(data) {
		console.log("Log : selectBatchListbyData fail: " + data);
	});
}

/**
 * 
 * @설명: 파라미터유형코드를 조회한다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function selectCdcValtList() {
	var reqParam = {};

	$.callAjax(reqParam, "/mg/sy/mgsy915p/selectCdcValtList.do").done(
			function(data) {

				var listData = data.list;

				// Combobox 초기화
				$("#busn_sc_cd").empty();
				$("#busn_sc_cd").append("<option value=''>전체</option");

				// Combobox 데이터 추가
				for (var i = 0; i < listData.length; i++) {
					$("#busn_sc_cd").append(
							"<option value='" + listData[i].cdcValt + "'>"
									+ listData[i].cdcValAbbrNm + "</option");
				}

				$("#busn_sc_cd").append("<option value='S_MG'>관리</option");

			}).fail(function(data) {
		console.log("Log : selectCdcValtList fail: " + data);
	});
}

function getGridData() {
	selectBatchList();
}

/**
 * 
 * @설명: 배치관리 리스트를 조회한다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function selectBatchList() {
	console.log("selectBatchList called");

	var reqParam = {};

	$.callAjax(reqParam, "/mg/sy/mgsy915p/selectMngBatchList.do").done(
			function(data) {
				var listData = data.list;
				$("#batchGrid").jsGrid("loadData", listData).done(function() {
				});
				
				if(listData.length == 0){
					$.fn.getReturnValue("batchGrid");
				}

			}).fail(function(data) {
		console.log("Log : selectMngBatchList fail: " + data);
	});
}

/**
 * 
 * @설명: 배치관리 그리드에 행을 추가한다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function addBatchData() {

	$("#batchGrid").jsGrid("insertItem", {
		"status" : "c",
		"batId" : "",
		"batNm" : "",
		"batExpln" : "",
		"busnScCd" : "",
		"useYn" : "Y"
	});

	var pageLastText = $("#batchGrid").jsGrid("option", "pageLastText");
	$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
	
	
}

/**
 * 
 * @설명: 파라미터관리 그리드에 행을 추가한다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function addParamData() {

	var paramGridData = $("#paramGrid").jsGrid("option", "data");
	if (globalBatchChecked.length > 0 && globalBatchChecked != "") {
		$("#paramGrid").jsGrid("insertItem", {

			"pgmId" : globalPgmId,
			"status" : "c",
			"prmtrInptSeq" : paramGridData.length + 1,
			"batId" : globalBatchChecked,
			"inptPrmtrId" : "",
			"inptPrmtrNm" : "",
			"inptPrmtrExpln" : "",
			"inptPrmtrTypCd" : "",
			"useYn" : "Y"
		});

	} else {
		$.fn.msgBox("배치ID를 선택해주세요.", function(obj) {
			return false;
		});
	}
	
	
}

function initBatchGrid() {

	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid(
			{
				id : "batchGrid",
				height : 300,
				editing : true,
				sorting : false,
				paging : true,
				selectHiglight : true,
				deleteConfirm : "삭제하시겠습니까?",
				controller : {
					updateItem : function(item) { // Edit모드에서 적용 아이콘 또는
						// updateItem API를 이용시 진입
						// debugger;
						var status = 'u'; // 수정
						if (item.status == 'c') { // 신규는 c상태 유지 후 데이터 수정
						} else if (item.status == 'dd') { // 삭제신청으로 요청되면 '삭제'로
							// 최정 변경처리
							item.status = 'd';
						} else {
							item.status = status;
						}
						
						
						return item;
					},
					deleteItem : function(item) { // grid 삭제 아이콘 클릭 또는
						// deleteItem API이용시 진입
						// deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
						var status = 'dd'; // 삭제 신청
						// debugger;
						if (item.status == 'c') { // 신규 입력대상건으로 그리드만 삭제처리
							jsGridDeletionFailed = false;
						} else { // u,d 는 삭제 상태로 처리 -> updateItem에서 최종 삭제대기가
							// 됨.
							jsGridDeletionFailed = true;
							item.status = status;
							$("#batchGrid").jsGrid("updateItem", item);
							
							return item;
						}
					}
				},
				onItemEditing : function(args) { // Grid Edit모드 진입시 처리
					// delete 상태 스킵
					
					if (args.item.status == 'd') {
						args.cancel = true;
					}
				},
				fields : [
						{name : "pgmId",title : "pgmID",css : "cell",type : "text",width : 20,align : "center",editing : false,visible : false},
						{name : "batId",title : "배치ID",css : "cell",type : "text",width : 30,align : "center",editing : true,
							
							editTemplate: function(value, item){
								var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
								$result.on("keydown", function(e) {
									if (e.which === 13) {
										$("#batchGrid").jsGrid("updateItem");
										return false;
									}
								});

								return $result;
							},
							
							/*,
						
							validate : [ {validator : 'required',message : '[배치ID] 필수 입력 항목입니다.'}]*/
						},
						{name : "batNm",title : "배치명",css : "cell",type : "text",width : 80,align : "left",visible : false},
						{name : "batExpln",title : "배치설명",css : "cell",type : "text",width : 80,align : "left"},
						{name : "busnScCd",title : "업무구분",css : "cell",type : "select",width : 40,align : "center",
							editTemplate : function(value) {
								var $result = jsGrid.fields.select.prototype.editTemplate
										.call(this, value);
								$result.on("keydown", function(e) {
									if (e.which === 13) {
										$("#batchGrid").jsGrid("updateItem");
										return false;
									}
								});
								
								/*setTimeout(function(){
									$result.focus();
								});*/
								
								return $result;
							},
							items : [ 
								{Name : "부채결산",Id : "S_CA"}, 
								{Name : "공통",Id : "S_CB"}, 
								{Name : "데이터허브",Id : "S_DH"}, 
								{Name : "사업비배부",Id : "S_EA"}, 
								{Name : "재무회계",Id : "S_FI"}, 
								{Name : "경영계획",Id : "S_BP"}, 
								{Name : "관리",Id : "S_MG"}, 
								{Name : "리스크관리",Id : "S_RM"} //2025.10.29 양슬기 리스크관리 추가

								],
							textField : 'Name',
							valueField : 'Id'
						},
						{name : "useYn",title : "사용여부",css : "cell",type : "select",width : 30,align : "center",
							editTemplate : function(value) {
								var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value);
								$result.on("keydown", function(e) {
									if (e.which === 13) {
										$("#batchGrid").jsGrid("updateItem");
										return false;
									}
								});
								/*setTimeout(function(){
									$result.focus();
								});*/
								
								return $result;
							},
							items : [ {
								Name : "Y",
								Id : "Y"
							}, {
								Name : "N",
								Id : "N"
							} ],
							textField : 'Name',
							valueField : 'Id'
						}, {
							name : "status",title : "상태",css : "cell",type : "text",width : 20,align : "center",editing : false,
							itemTemplate : function(value, item) {
								return $.fn.getGridRowStatusName(value);
							}
						}, {name : "gridManupulate",title : "그리드조작",css : "cell",type : "control",width : 20,align : "center",editing : true}, 
					]
			});

	gridObject.rowClick(function(args) {
		
		clickIndex = args.itemIndex;
		clickObject = args.item;
		console.log("clickOjbect.clickIndex : ", clickIndex);
		console.log("clickOjbect.clickObject : ", clickObject.pgmId); // 바꿔야함
		selectParamList(clickObject.pgmId);
		globalPgmId = clickObject.pgmId;
		globalBatchChecked = clickObject.batId// 바꿔야 함
		console.log("globalPgmId 		= ", globalPgmId);
		console.log("globalBatchChecked = ", globalBatchChecked);
	});

	// 그리드 생성
	gridObject.gridCreate();
	
	
}

/**
 * 
 * @설명: 배치에 해당하는 파라미터 리스트를 조회한다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 16.
 * @최종변경일:
 * @매개변수: pgmId
 * @반환값:
 * @개정이력: 김동현 2021. 03. 16. 최초작성
 * 
 */
function selectParamList(pgmId) {
	console.log("selectParamList called pgmId = ", pgmId);

	var reqParam = {
		"pgmId" : pgmId
	};

	$.callAjax(reqParam, "/mg/sy/mgsy915p/selectMngParamList.do").done(
			function(data) {
				var listData = data.list;
				console.log(listData);
				$("#paramGrid").jsGrid("loadData", listData).done(function() {
				});
				
				if(listData.length == 0){
					$.fn.getReturnValue("paramGrid");
				}

			}).fail(function(data) {
		console.log("Log : selectParamList fail: " + data);
	});
}

function initParamGrid() {
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid(
			{
				id : "paramGrid",
				height : 240,
				editing : true,
				sorting : false,
				paging : false,
				selectHiglight : true,
				deleteConfirm : "삭제하시겠습니까?",
				controller : {
					updateItem : function(item) { // Edit모드에서 적용 아이콘 또는
						// updateItem API를 이용시 진입
						// debugger;
						var status = 'u'; // 수정
						if (item.status == 'c') { // 신규는 c상태 유지 후 데이터 수정
						} else if (item.status == 'dd') { // 삭제신청으로 요청되면 '삭제'로
							// 최정 변경처리
							item.status = 'd';
						} else {
							item.status = status;
						}
						return item;
					},
					deleteItem : function(item) { // grid 삭제 아이콘 클릭 또는
						// deleteItem API이용시 진입
						// deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
						var status = 'dd'; // 삭제 신청
						// debugger;
						if (item.status == 'c') { // 신규 입력대상건으로 그리드만 삭제처리
							jsGridDeletionFailed = false;
						} else { // u,d 는 삭제 상태로 처리 -> updateItem에서 최종 삭제대기가
							// 됨.
							jsGridDeletionFailed = true;
							item.status = status;
							$("#paramGrid").jsGrid("updateItem", item);
							return item;
						}
					}
				},
				onItemEditing : function(args) { // Grid Edit모드 진입시 처리
					// delete 상태 스킵
					if (args.item.status == 'd') {
						args.cancel = true;
					}
				},
				fields : [
						{name : "pgmId",title : "pgmID",css : "cell",type : "text",width : 20,align : "center",editing : false,visible : false},
						{name : "itmId",title : "itmID",css : "cell",type : "text",width : 20,align : "center",editing : false,visible : false},
						{name : "batId",title : "배치ID",css : "cell",type : "text",width : 30,align : "center",editing : false},
						{name : "prmtrInptSeq",title : "파라미터입력순서",css : "cell",type : "text",width : 40,align : "center"},
						{name : "inptPrmtrId",title : "파라미터ID",css : "cell",type : "text",width : 70,align : "center",editing : true,
							editTemplate : function(value) {
								var $result = jsGrid.fields.text.prototype.editTemplate
										.call(this, value);
								
								return $result;
							}/*,

							validate : [ {
								validator : 'required',
								message : '[파라미터ID] 필수 입력 항목입니다.'
							} ]*/
						},
						{name : "inptPrmtrNm",title : "파라미터명",css : "cell",type : "text",width : 70,align : "center"/*,
							validate : [ {
								validator : 'required',
								message : '[파라미터명] 필수 입력 항목입니다.'
							} ]*/
						},
						{name : "inptPrmtrExpln",title : "파라미터설명",css : "cell",type : "text",width : 50,align : "left"
						},
						{name : "inptPrmtrTypCd",title : "파라미터유형",css : "cell",type : "select",width : 50,align : "center",
							editTemplate : function(value) {
								var $result = jsGrid.fields.select.prototype.editTemplate
										.call(this, value);
								$result.on("keydown", function(e) {
									if (e.which === 13) {
										$("#paramGrid").jsGrid("updateItem");
										return false;
									}
								});
								return $result;
							},
							items : [ 
								{Name : "숫자",Id : "N"}, 
								{Name : "문자",Id : "C"}, 
								{Name : "날짜",Id : "T"} 
							],
							textField : 'Name',
							valueField : 'Id'
						},
						{name : "useYn",title : "사용여부",css : "cell",type : "select",width : 20,align : "center",
							// Enter 키 입력시 updateItem apply됨.
							editTemplate : function(value) {
								var $result = jsGrid.fields.select.prototype.editTemplate
										.call(this, value);
								$result.on("keydown", function(e) {
									if (e.which === 13) {
										$("#paramGrid").jsGrid("updateItem");
										return false;
									}
								});
								
								
								return $result;
								
							},
							items : [ {
								Name : "Y",
								Id : "Y"
							}, {
								Name : "N",
								Id : "N"
							} ],
							textField : 'Name',
							valueField : 'Id',
						}, {
							name : "status",title : "상태",css : "cell",type : "text",width : 20,align : "center",editing : false,
							itemTemplate : function(value, item) {
								return $.fn.getGridRowStatusName(value);
							}
						}, {name : "gridManupulate",title : "그리드조작",css : "cell",type : "control",width : 10,align : "center",editing : true
						} ]
			});
	

	gridObject.rowClick(function(args) {
		
		clickIndex = args.itemIndex;

	});

	// 그리드 생성
	gridObject.gridCreate();
}