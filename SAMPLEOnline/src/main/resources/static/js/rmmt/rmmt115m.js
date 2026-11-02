var overLapList = []; /* 중복체크용 */
var globalBatchChecked = ""; /* 공통코드 관리 선택 여부(batchId) */
var globalPgmId; /* 공통코드 관리 선택 여부(pgmId) */
/**
 * @시스템명: IFRS17
 * @업무명: 공통코드 관리
 * @설명: 공통코드 정보를 관리하는 화면이다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일: 2021. 11. 22.
 * @개정이력:
 *  양슬기 2025. 11. 20.  최초작성
 */

$(document).ready(function() {
	/*2021.04.30 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	
	
	//버튼 권한 처리 2021.06.14
    $.fn.setBtnPermission([{"btnId":"#btn_loadExcel"}
                          ,{"btnId":"#btn_moveUp"}
                          ,{"btnId":"#btn_moveDown"}
                          ,{"btnId":"#btn_addBatch"}
                          ,{"btnId":"#btn_addParam"}
                          ,{"btnId":"#btn_save_batch"}
                          ,{"btnId":"#btn_save_param"}
                          ,{"btnId":"#btn_importExcel2"}
                          ]);
                          
	//$("#btn_loadExcel").hide();
	$("#categoryId_run").hide();
	
	$("#paramGridHidden").hide();
	$("#hiddenDiv").hide();
	
	
	initBatchGrid();
	
	initParamGrid();
	
	initAllParamGrid();
	
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

	//전체 엑셀 다운로드 
	$("#btn_exportExcel2").on("click", function(e) {
		selectAllParamList();
	});

	//양식 다운로드
	$("#btn_exportExcel3").on("click", function(e) {
		var paramObj = {};
		paramObj.id = "paramGrid";
		paramObj.fileName = "paramGrid.xlsx"; // 다운로드할 파일명
		paramObj.applyItemTemplate = false; // 그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로
											// Import하기 위해서는 false)
		$.fn.exportGridExcel(paramObj);
		
		//암호화 
		/*downloadTest(paramObj, "excel");*/
	});

	
	// 양식업로드 
	$("#btn_importExcel2").on("click", function(e){
		var paramObj = {};
		paramObj.id = "paramGrid";
		paramObj.callbackFn = function(data) {
			if(data.result == "1") {
				$.fn.msgBox("정상적으로 로드하였습니다.");
			}
		};
		$.fn.loadGridExcel(paramObj);
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
	
	// 조회조건 엔터키 조회
	$("#busn_sc_cd, #bat_id_content, #bat_expln_content").on("keypress", function(e) {
		if(e.keyCode === 13) {
			$("#btn_search").click();
			return false;
		}
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
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
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
 * @설명: 공통코드 관리 그리드 데이터를 저장한다
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
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
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
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
			$.fn.msgBox("RDM컬럼ID를 확인해주세요.", function(obj) {
				return false;
			});
		};

	} else {
		$.fn.msgBox("RDM컬럼ID를 선택해주세요.", function(obj) {
			return false;
		});
	}

}

/**
 * 
 * @설명: 파라미터 관리 입력 데이터의 중복(파라미터ID)을 검사한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
 * 
 */
function checkOverlapParam() {
	var check = true;
	
	var paramGridData = $("#paramGrid").jsGrid("option", "data");
	overLapList = [];

	for (var i = 0; i < paramGridData.length; i++) {
		var checkValue = '';
		if (paramGridData[i].status == 'c' || paramGridData[i].status == 'u') {
			checkValue = paramGridData[i].rdmCommCdId;

			for (var j = 0; j < paramGridData.length; j++) {
				var $trEl1;
				var $trEl2;
				if (i != j) {
					if (checkValue.trim() == paramGridData[j].rdmCommCdId.trim()) {
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
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
 * 
 */
function checkOverlapBatch() {
	var check = true;
	var batchGridData = $("#batchGrid").jsGrid("option", "data");
	overLapList = [];

	for (var i = 0; i < batchGridData.length; i++) {
		var checkValue = '';
		if (batchGridData[i].status == 'c' || batchGridData[i].status == 'u') {
			checkValue = batchGridData[i].rdmClumId;
			for (var j = 0; j < batchGridData.length; j++) {
				var $trEl1;
				var $trEl2;
				if (i != j) {
					if (checkValue.trim() == batchGridData[j].rdmClumId.trim()) {

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
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
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
				}, "/rm/mt/rmmt115m/saveParamGridList.do").done(function(data) {
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
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
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
				}, "/rm/mt/rmmt115m/saveCommonCodeMgntGridList.do").done(function(data) {
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
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
 * 
 */
function selectBatchListbyData() {

	var reqParam = {
		"rdmClumId" : $("#bat_id_content").val()
	};
	$.callAjax(reqParam, "/rm/mt/rmmt115m/selectCommonCodeMgntList.do").done(
			
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


function getGridData() {
	selectBatchList();
}

/**
 * 
 * @설명: 배치관리 리스트를 조회한다. - 전체 조회 
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
 * 
 */
function selectBatchList() {
	console.log("selectBatchList called");

	var reqParam = {};

	$.callAjax(reqParam, "/rm/mt/rmmt115m/selectMngCommonCodeMgntList.do").done(
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
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
 * 
 */
function addBatchData() {

	$("#batchGrid").jsGrid("insertItem", {
		"status" : "c",
		"rdmClumId" : "",
		"rdmClumNm" : "",
		"avlStrYmd" : "",
		"avlEndYmd" : "",
		"clumExpln" : "",
		"note" : "",
		"regntEno" : "",
		"regDtm" : "",
		"trtrEno" : "",
		"trtDtm" : ""
	});

	var pageLastText = $("#batchGrid").jsGrid("option", "pageLastText");
	$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
	
	
}

/**
 * 
 * @설명: 파라미터관리 그리드에 행을 추가한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
 * 
 */
function addParamData() {

	var paramGridData = $("#paramGrid").jsGrid("option", "data");
	if (globalBatchChecked.length > 0 && globalBatchChecked != "") {
		$("#paramGrid").jsGrid("insertItem", {

			"rdmClumId" : globalPgmId,
			"status" : "c",
			//"prmtrInptSeq" : paramGridData.length + 1,
			//"batId" : globalBatchChecked,
			"rdmCommCdId" : "",
			"rdmCommCdNm" : "",
			"clumExpln" : "",
			"seq" : "",
			"mapnCdNm01" : "",
			"mapnCdNm02" : "",
			"mapnCdNm03" : "",
			"mapnCdNm04" : "",
			"mapnCdNm05" : "",
			"mapnCdNm06" : "",
			"mapnCdNm07" : "",
			"mapnCdNm08" : "",
			"mapnCdNm09" : "",
			"mapnCdNm10" : "",
			"note01" : "",
			"note02" : "",
			"note03" : "",
			"note04" : "",
			"note05" : "",
			"note06" : "",
			"note07" : "",
			"note08" : "",
			"note09" : "",
			"note10" : "",
			"avlStrYmd" : "",
			"avlEndYmd" : "",
			"regntEno" : "",
			"regDtm" : "",
			"trtrEno" : "",
			"trtDtm" : ""
			
			
		});

	} else {
		$.fn.msgBox("RDM컬럼ID를 선택해주세요.", function(obj) {
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
						{name : "rowNum",title : "순번",css : "cell",type : "text",width : 20,align : "center",editing : false},
						{name : "rdmClumId",title : "RDM컬럼ID",css : "cell",type : "text",width : 120,align : "center",editing : true,
							editTemplate: function(value, item){
								var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
								$result.on("keydown", function(e) {
									if (e.which === 13) {
										$("#batchGrid").jsGrid("updateItem");
										return false;
									}
								});
								return $result;
							},validate : [ {validator : 'required',message : '[RDM컬럼ID] 필수 입력 항목입니다.'}]
						},
						{name : "rdmClumNm",title : "RDM컬럼명",css : "cell",type : "text",width : 120,align : "center",editing : true},
						{name : "avlStrYmd",title : "유효시작일자",css : "cell",type : "text",width : 60,align : "center",editing : true},
						{name : "avlEndYmd",title : "유효종료일자",css : "cell",type : "text",width : 60,align : "center",editing : true},
						{name : "clumExpln",title : "컬럼설명",css : "cell",type : "text",width : 150,align : "center",editing : true},
						{name : "note",title : "비고",css : "cell",type : "text",width : 200,align : "center",editing : true},
						{name : "regntEno",title : "등록자사번",css : "cell",type : "text",width : 80,align : "center",editing : false,visible : false},
						{name : "regDtm",title : "등록일시",css : "cell",type : "text",width : 90,align : "center",editing : false,visible : false},
						{name : "trtrEno",title : "처리자사번",css : "cell",type : "text",width : 80,align : "center",editing : false,visible : false},
						{name : "trtDtm",title : "처리일시",css : "cell",type : "text",width : 90,align : "center",editing : false,visible : false},
						{
							name : "status",title : "상태",css : "cell",type : "text",width : 60,align : "center",editing : false,
							itemTemplate : function(value, item) {
								return $.fn.getGridRowStatusName(value);
							}
						}, {name : "gridManupulate",title : "그리드조작",css : "cell",type : "control",width : 40,align : "center",editing : true}, 
					]
			});

	gridObject.rowClick(function(args) {
		
		clickIndex = args.itemIndex;
		clickObject = args.item;
		console.log("clickOjbect.clickIndex : ", clickIndex);
		console.log("clickOjbect.clickObject : ", clickObject.rdmClumId); // 바꿔야함
		selectParamList(clickObject.rdmClumId);
		globalPgmId = clickObject.rdmClumId;
		globalBatchChecked = clickObject.rdmClumId// 바꿔야 함    ????????????????????????
		console.log("globalPgmId 		= ", globalPgmId);
		console.log("globalBatchChecked = ", globalBatchChecked);
	});

	// 그리드 생성
	gridObject.gridCreate();
	
	
}

/**
 * 
 * @설명: 배치에 해당하는 파라미터 리스트를 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수: pgmId
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
 * 
 */
function selectParamList(rdmClumId) {
	console.log("selectParamList called rdmClumId = ", rdmClumId);

	var reqParam = {
		"rdmClumId" : rdmClumId
	};
	
	$.callAjax(reqParam, "/rm/mt/rmmt115m/selectCommonCodeMgntParamList.do").done(
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


/**
 * 
 * @설명: 전체 파라미터 조회
 * @최초작성자: 양슬기
 * @최초작성일: 2025. 11. 20.
 * @최종변경일:
 * @매개변수: pgmId
 * @반환값:
 * @개정이력: 양슬기 2025. 11. 20. 최초작성
 * 
 */
function selectAllParamList() {

	var reqParam = {
	};
	
	$.callAjax(reqParam, "/rm/mt/rmmt115m/selectCommonCodeMgntParamList.do").done(
			function(data) {
				var listData = data.list;
				console.log(listData);
				$("#paramGridHidden").jsGrid("loadData", listData).done(function() {
				});
				
				if(listData.length == 0){
					$.fn.getReturnValue("paramGrid");
				}

				var paramObj = {};
				paramObj.id = "paramGridHidden";
				paramObj.fileName = "paramGrid.xlsx"; // 다운로드할 파일명
				paramObj.applyItemTemplate = false; // 그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로
													// Import하기 위해서는 false)
				$.fn.exportGridExcel(paramObj);

				
				
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
						{name : "rdmClumId",title : "RDM컬럼ID",css : "cell",type : "text",width : 120,align : "center",editing : true,
							editTemplate : function(value) {
								var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
								
								return $result;
							},validate : [ {validator : 'required',message : '[RDM컬럼ID] 필수 입력 항목입니다.'} ]
						},
						{name : "rdmCommCdId",title : "RDM공통코드ID",css : "cell",type : "text",width : 120,align : "center",editing : true,
							editTemplate : function(value) {
								var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
								
								return $result;
							},validate : [ {validator : 'required',message : '[RDM공통코드ID] 필수 입력 항목입니다.'} ]
						},
						{name : "rdmCommCdNm",title : "RDM공통코드명",css : "cell",type : "text",width : 120,align : "center",editing : true},
						{name : "clumExpln",title : "컬럼설명",css : "cell",type : "text",width : 150,align : "center",editing : true},
						{name : "seq",title : "순서",css : "cell",type : "text",width : 70,align : "center",editing : true},
						{name : "mapnCdNm01",title : "매핑코드명01",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm02",title : "매핑코드명02",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm03",title : "매핑코드명03",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm04",title : "매핑코드명04",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm05",title : "매핑코드명05",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm06",title : "매핑코드명06",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm07",title : "매핑코드명07",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm08",title : "매핑코드명08",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm09",title : "매핑코드명09",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm10",title : "매핑코드명10",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note01",title : "비고01",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note02",title : "비고02",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note03",title : "비고03",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note04",title : "비고04",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note05",title : "비고05",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note06",title : "비고06",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note07",title : "비고07",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note08",title : "비고08",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note09",title : "비고09",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note10",title : "비고10",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "avlStrYmd",title : "유효시작일자",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "avlEndYmd",title : "유효종료일자",css : "cell",type : "text",width : 100,align : "center",editing : true,
							editTemplate : function(value) {
								var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
								return $result;
							},validate : [ {validator : 'required',message : '[유효종료일자] 필수 입력 항목입니다.'} ]
						},
						{name : "regntEno",title : "등록자사번",css : "cell",type : "text",width : 70,align : "center",editing : true},
						{name : "regDtm",title : "등록일시",css : "cell",type : "text",width : 70,align : "center",editing : true},
						{name : "trtrEno",title : "처리자사번",css : "cell",type : "text",width : 70,align : "center",editing : true},
						{name : "trtDtm",title : "처리일시",css : "cell",type : "text",width : 70,align : "center",editing : true},

						{
							name : "status",title : "상태",css : "cell",type : "text",width : 60,align : "center",editing : false,
							itemTemplate : function(value, item) {
								return $.fn.getGridRowStatusName(value);
							}
						}, {name : "gridManupulate",title : "그리드조작",css : "cell",type : "control",width : 70,align : "center",editing : true
						} ]
			});
	

	gridObject.rowClick(function(args) {
		
		clickIndex = args.itemIndex;

	});

	// 그리드 생성
	gridObject.gridCreate();
}




function initAllParamGrid() {
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid(
			{
				id : "paramGridHidden",
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
						{name : "rdmClumId",title : "RDM컬럼ID",css : "cell",type : "text",width : 120,align : "center",editing : true,
							editTemplate : function(value) {
								var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
								
								return $result;
							},validate : [ {validator : 'required',message : '[RDM컬럼ID] 필수 입력 항목입니다.'} ]
						},
						{name : "rdmCommCdId",title : "RDM공통코드ID",css : "cell",type : "text",width : 120,align : "center",editing : true,
							editTemplate : function(value) {
								var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
								
								return $result;
							},validate : [ {validator : 'required',message : '[RDM공통코드ID] 필수 입력 항목입니다.'} ]
						},
						{name : "rdmCommCdNm",title : "RDM공통코드명",css : "cell",type : "text",width : 120,align : "center",editing : true},
						{name : "clumExpln",title : "컬럼설명",css : "cell",type : "text",width : 150,align : "center",editing : true},
						{name : "seq",title : "순서",css : "cell",type : "text",width : 70,align : "center",editing : true},
						{name : "mapnCdNm01",title : "매핑코드명01",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm02",title : "매핑코드명02",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm03",title : "매핑코드명03",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm04",title : "매핑코드명04",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm05",title : "매핑코드명05",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm06",title : "매핑코드명06",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm07",title : "매핑코드명07",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm08",title : "매핑코드명08",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm09",title : "매핑코드명09",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "mapnCdNm10",title : "매핑코드명10",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note01",title : "비고01",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note02",title : "비고02",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note03",title : "비고03",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note04",title : "비고04",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note05",title : "비고05",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note06",title : "비고06",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note07",title : "비고07",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note08",title : "비고08",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note09",title : "비고09",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "note10",title : "비고10",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "avlStrYmd",title : "유효시작일자",css : "cell",type : "text",width : 100,align : "center",editing : true},
						{name : "avlEndYmd",title : "유효종료일자",css : "cell",type : "text",width : 100,align : "center",editing : true,
							editTemplate : function(value) {
								var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
								return $result;
							},validate : [ {validator : 'required',message : '[유효종료일자] 필수 입력 항목입니다.'} ]
						},
						{name : "regntEno",title : "등록자사번",css : "cell",type : "text",width : 70,align : "center",editing : true},
						{name : "regDtm",title : "등록일시",css : "cell",type : "text",width : 70,align : "center",editing : true},
						{name : "trtrEno",title : "처리자사번",css : "cell",type : "text",width : 70,align : "center",editing : true},
						{name : "trtDtm",title : "처리일시",css : "cell",type : "text",width : 70,align : "center",editing : true},
						
						{
							name : "status",title : "상태",css : "cell",type : "text",width : 60,align : "center",editing : false,
							itemTemplate : function(value, item) {
								return $.fn.getGridRowStatusName(value);
							}
						}, {name : "gridManupulate",title : "그리드조작",css : "cell",type : "control",width : 100,align : "center",editing : true
						} ]
			});
	

	gridObject.rowClick(function(args) {
		
		clickIndex = args.itemIndex;

	});

	// 그리드 생성
	gridObject.gridCreate();
}


