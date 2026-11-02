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
var callJsFileName = "mgda111m"; //화면ID
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

	// event 초기화
	initEvent();

	// 그리드 초기화
	initGrid();
	
	// 포커스(업무구분)
	$("#sbx_busnScCd").focus();
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
	// 공통코드 조회(업무구분코드)
	$.fn.loadCommonCode(["I17_BUSN_SC_CD"]);

	// 업무구분 S_BE 삭제
	var busnArr = $._commonObj["code"]["I17_BUSN_SC_CD"]; // 얕은복사
	var busnArrTemp = [];
	
	for (var i = busnArr.length-1; i >= 0; i--) {
		if("S_BE" != busnArr[i]["code"]) {
			busnArrTemp.push(busnArr[i]);
		}
	}
	
	$._commonObj.code["BUSN_SC_CD_TM"] = busnArrTemp;
	
	// 콤보박스 세팅
	$.fn.renderCombobox({
		codeArr: ["BUSN_SC_CD_TM"],
		selArr: ["sbx_busnScCd"],
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
	// 조회 후 업무구분 변경 시, input[text]값 초기화
	$("#sbx_busnScCd").on("change", function(e) {
		$("#ibx_tableName").val(null);
		$("#ibx_tableId").val(null);
	});

	// 업무구분 Enter키 조회
	$("#sbx_busnScCd").on("keypress", function(e){
		if(e.which === 13){
			selectManlTbAttrMngList();
			return false;
		}
	});
	
	// 테이블 조회 팝업
	$("#btn_tableNameSearch, #btn_tableIdSearch").on("click", function(e) {
		openPopupManlTb(null);
	});

	// 조회
	$("#btn_search").on("click", function(e) {
		selectManlTbAttrMngList();
	});

	// 저장
	$("#btn_save").on("click", function(e) {
		saveGridDataAll();
	});

	// 그리드 행추가
	$("#btn_addGrid").on("click", function(e) {
		addGridData();
	});
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
			updateItem : function(item) { // Edit모드에서 적용 아이콘 또는
											// updateItem API를 이용시 진입
				var status = "u"; // 수정
				if (item.status == "c") { // 신규는 c상태 유지 후 데이터 수정
				} else if (item.status == "dd") { // 삭제신청으로 요청되면 "삭제"로
													// 최정 변경처리
					item.status = "d";
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { // grid 삭제 아이콘 클릭 또는
											// deleteItem API이용시 진입
				// deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = "dd"; // 삭제 신청
				if (item.status == "c") { // 신규 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else { // u,d 는 삭제 상태로 처리 -> updateItem에서 최종 삭제대기가
							// 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#gridDiv").jsGrid("updateItem", item);
					return item;
				}
			}
		},
		onItemEditing : function(args) { // Grid Edit모드 진입시 처리
			if (typeof event === "undefined") {
				args.cancel = true;
				return;
			}

			// 체크박스는 Edit 모드 취소
			var targetElem = event.srcElement;
			if (targetElem.outerHTML.indexOf("check") > 0) {
				args.cancel = true;
			}

			// delete 상태 스킵
			if (args.item.status == "d") {
				args.cancel = true;
			}
		},
		fields : [
			{name: "seq", title: "순번", css: "cell", type: "text", width: 20, editing: false, align: "center"
			},
			{name: "tableName", title: "테이블명", css: "cell", type: "text", width: 70, align: "left", editing: false, itemTemplate: function(value, item) {
					// 신규 외엔 수정 불가
					if (item.status == "c") {
						var $pEl = $("<p>").addClass("fl line-height20").text(value);
						var $pEl2 = $("<p>").addClass("fr");
						var $aEl = $("<a>").attr("href","javascript:void(0);").on("click",function() {
							openPopupManlTb(item); // 테이블조회 팝업 호출
						});
						var $iEl = $("<img>").attr("src","/img/btn_icon_search.png");
						return $("<div>").append($pEl).append($pEl2.append($aEl.append($iEl)));
					}
					return value;
				},
				validate : {validator: "required", message: "[테이블명] 필수 입력 항목입니다."}
			},
			{name: "tableId", title: "테이블ID", css: "cell", type: "text", width: 50, align: "center", editing: false, itemTemplate: function(value, item) {
					// 신규 외엔 수정 불가
					if (item.status == "c") {
						var $pEl = $("<p>").addClass("fl line-height20").text(value);
						var $pEl2 = $("<p>").addClass("fr");
						var $aEl = $("<a>").attr("href","javascript:void(0);").on("click",function() {
							openPopupManlTb(item); // 테이블조회 팝업 호출
						});
						var $iEl = $("<img>").attr("src","/img/btn_icon_search.png");
						return $("<div>").append($pEl).append($pEl2.append($aEl.append($iEl)));
					}
					return value;
				},
				validate : {validator: "required", message: "[테이블ID] 필수 입력 항목입니다."}
			},
			{name: "busnScCd", title: "업무구분", css: "cell", type: "text", width: 45, editing: false, align: "center", itemTemplate : function(value){
				return getBusnScCdNm(value);
			}},
			{name: "manlYn", title: "수기관리여부", css: "cell", type: "select", width: 45, align: "center"
				, items : [{Name : "Y", Id : "Y"}, {Name : "N", Id : "N"}]
				, textField : "Name"
				, valueField : "Id"
				, editTemplate : function(value) {
					var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value);
					// Enter 키 입력시 updateItem apply됨.
					$result.on("keydown", function(e) {
						if (e.which === 13) {
							$("#gridDiv").jsGrid("updateItem");
							return false;
						}
					});
					return $result;
				}
			}, 
			{name: "trtDtm", title: "최종업데이트일자", css: "cell", type: "text", width: 45, align: "center", editing: false, itemTemplate: function(value, item) {
				return $.fn.dateFormat(value, "-");
			}}, 
			{name: "trtrEno", title: "최종업데이트사번", css: "cell", type: "text", width: 45, align: "center", editing: false}, 
			{name: "status", title: "상태", css: "cell", type: "text", width: 20, align: "center", editing: false, itemTemplate: function(value, item) {
				return $.fn.getGridRowStatusName(value);
			}}, 
			{name: "gridManupulate", title: "그리드조작", css: "cell", type: "control", width: 20, align: "left"} 
		]
	});

	// 그리드 생성
	gridObject.gridCreate();

}

/**
 * @설명: 테이블검색 팝업 호출
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 
 *  심민정 2021.01.21 최초작성
 */
function openPopupManlTb(rowItem) {
	CUR_ROW_ITEM = rowItem;

	var popupOption = {
		url : "/ca/ff/caff111p.do",
		name : "caff111p",
		width : 700,
		height : 495
	}
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 테이블조회 팝업 콜백
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: resultObj
 * @반환값:
 * @개정이력: 
 *  심민정 2021.01.21 최초작성
 */
function resultTablePopup_callback(resultObj) {

	$("#sbx_busnScCd").val(resultObj.busnScCd);
	
	var compressName = resultObj.compressName;
	if(compressName != "ADVANCED"){
		$.fn.msgBox("선택하신 테이블은 수기데이터 관리가 불가한 테이블입니다.\n(사유: 테이블 압축형태가 HCC인 경우 데이터 수기조정 불가)");
		return;
	}
	
	if (typeof CUR_ROW_ITEM === "undefined" || CUR_ROW_ITEM == null) {
		// 그리드 데이터 초기화
		resetGrid();

		$("#ibx_tableId").val(resultObj.tableId);
		$("#ibx_tableName").val(resultObj.tableName);
	} else {
		var newRowItem = $.extend({}, CUR_ROW_ITEM, resultObj);
		$("#gridDiv").jsGrid("updateItem", CUR_ROW_ITEM, newRowItem);
	}
}


function getBusnScCdNm(busnScCd){
	var busnScCdNm = ""; 
	
	if(busnScCd == "S_CA"){
		busnScCdNm = "부채결산";
	}else if(busnScCd == "S_EA"){
		busnScCdNm = "사업비배부";
	}else if(busnScCd == "S_FI"){
		busnScCdNm = "재무회계";
	}else if(busnScCd == "S_DH"){
		busnScCdNm = "데이터허브";
	}else if(busnScCd == "S_CB"){
		busnScCdNm = "공통";
	}else if(busnScCd == "S_MG"){
		busnScCdNm = "관리";
	}else{
		console.log("fail to getBusnScCdNm");
	}
	
	return busnScCdNm;
}

/**
 * @설명: 업무구분의 콤보박스 선택값을 가져온다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.21
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.21 최초작성
 */
function getBusnScCdValue() {
	var busnScCd = $("#sbx_busnScCd option:selected").val();
	return busnScCd;
}

/**
 * @설명: 수기테이블속성관리 목록을 조회한다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.18
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 
 *  심민정 2021.01.18 최초작성
 */
function selectManlTbAttrMngList() {
	var reqParam = {};
	reqParam.busnScCd = $("#sbx_busnScCd").val();
	reqParam.tableId = $("#ibx_tableId").val();
	reqParam.tableName = $("#ibx_tableName").val();

	$.callAjax(reqParam, "/mg/da/mgda111m/selectManlTbAttrMngList.do")
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
		console.log("fail to selectManlTbAttrMngList !!");
	});
}

/**
 * @설명: 그리드 하나의 행을 추가한다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.18
 * @최종변경일:
 * @개정이력: 
 *  심민정 2021.01.18 최초작성
 */
function addGridData() {
	var dataList = $("#gridDiv").jsGrid("option", "data");
	var seq = dataList.length + 1;

	// status컬럼은 그리드 상태 핸들링 하기 위함.(c:신규, u:수정, d:삭제)
	$("#gridDiv").jsGrid("insertItem", {
		"seq" : seq,
		"status" : "c",
		"tableName" : "",		/*테이블명*/
		"tableId" : "",			/*테이블ID*/
		"busnScCd" : "",		/*업무구분*/
		"manlYn" : "Y",			/*수기관리여부*/
		"trtDtm" : "",			/*처리일시*/
		"trtrEno" : ""			/*처리자사번 */
	});
	
	//마지막 페이지 이동
	var pageLastText = $("#gridDiv").jsGrid("option", "pageLastText");
	$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
}

/**
 * @설명: 신규생성, 수정, 삭제 처리한다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.19
 * @최종변경일:
 * @매개변수:
 * @반환값: any
 * @개정이력: 
 *  심민정 2021.01.19 최초작성
 */
function saveGridDataAll() {
	var saveList = new Array(); // 저장대상 배열 선언
	var gridData = $("#gridDiv").jsGrid("option", "data"); // 전체 데이터

	// c,u,d 건만 추출
	for (var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		if (item.status == "c" || item.status == "u" || item.status == "d") {
			// 유효값체크
			if (!isValid(i, item)) {
				return;
			}
			saveList.push(item);
		}
	}

	if (saveList.length == 0) {
		$.fn.msgBox("저장할 대상이 없습니다.");
		return;
	}

	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if (obj.btn_ok) {
			$.callAjax({"list" : JSON.stringify(saveList)}, "/mg/da/mgda111m/saveManlTbAttrMngList.do")
			.done(function(data) {
				if (data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");

					// 재조회
					selectManlTbAttrMngList();
				}
			}).fail(function(data) {
				console.log("fail to saveGridDataAll");
			});
		}
	}, 2);
}

/**
 * @설명: 저장 전 validation 체크
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.19
 * @최종변경일:
 * @매개변수: rowIndex, item
 * @반환값: boolean
 * @개정이력: 
 *  심민정 2021.01.19 최초작성
 */
function isValid(rowIndex, item) {
	if (item.tableName.trim() == "" || item.tableId.trim() == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 테이블을 입력하세요.");
		return false;
	}
	return true;
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.19
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 
 *  심민정 2021.01.19 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}
