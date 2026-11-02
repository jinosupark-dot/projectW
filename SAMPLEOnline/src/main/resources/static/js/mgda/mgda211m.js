/**
 * @시스템명: IFRS17
 * @업무명: 수기데이터관리
 * @설명: 수기로 데이터를 관리하는 화면의 JS
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.27
 * @최종변경일:
 * @개정이력:
 *  심민정 2021.01.27 최초작성
 *  심민정 2021.06.15 3차 소스표준화
 *  황석현 2021.12.13 공통코드 I17_BUSN_SC_CD 수정
 */
// 전역변수 선언부
var pkListData = [];
var selectTableClumList = [];
var selectTableId="";		
var selectBusnScCd="";		
var callJsFileName = "";

$(document).ready(function(){
	/* 2021.05.03 툴팁 추가 */
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/* 2021.06.14 화면ID 추가 */
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
    /* 2021.06.14 저장 권한제어 추가 */
    $.fn.setBtnPermission([{"btnId":"#btn_save","type":"A"}]);
	
	// 공통코드 조회
	selectCommonCode();
	
	// event 초기화
	initEvent();
	
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
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @개정이력: 
 *  심민정 2021.01.27 최초작성
 */
function initEvent() {
	callJsFileName = "mgda211m";
	
	// PK컬럼 검색영역 및 버튼 hide
	$("#div_pkColumnSelect, #btn_gridTop").hide();
	
	// 업무구분 change
	$("#sbx_busnScCd").on("change", function(e){
		// 테이블명, 테이블ID input
		$("#ibx_tableId, #ibx_tableName").val(null);
		// PK컬럼 검색영역, 버튼, 그리드 hide
		$("#div_pkColumnSelect, #btn_gridTop, #gridDiv").hide();
	});
	
	// 업무구분 Enter키 조회
	$("#sbx_busnScCd").on("keypress", function(e){
		if(e.which === 13){
			$("#btn_tableNameSearch, #btn_tableIdSearch").click();
			return false;
		}
	});
	
	// 테이블 검색 팝업
	$("#btn_tableNameSearch, #btn_tableIdSearch").on("click", function(e){
		var popupOption = {
				url: "/ca/ff/caff111p.do",
				name: "caff111p",
				width: 700,
				height: 495
		}
		var popup = $.fn.openPopup(popupOption);
	});
	
	// 조회
	$("#btn_search").on("click", function(e){
		searchGridData();
	});
	
	// 행추가
	$("#btn_addGrid").on("click", function(e){
		addGridData();
	});
	
	// 저장
	$("#btn_save").on("click", function(e){
		saveGridDataAll();
	});
	
	// 엑셀 CSV다운로드
	excelDownload();
}

function searchGridData(){
	selectTableSchemaInfoContent();
	$("#btn_gridTop, #gridDiv").show();
}

function removeGridData(){
	$("#btn_gridTop, #gridDiv").hide();
	$("#gridDiv").jsGrid("option", "data", []);
	$("#gridDiv").jsGrid("destroy");
}


/**
 * @설명: 테이블조회 팝업 콜백
 * @최초작성자: 권세림
 * @최초작성일: 2021.01.08.
 * @최종변경일: 
 * @매개변수: resultObj
 * @반환값: 
 * @개정이력: 
 *  권세림 2021.01.08. 최초작성
 */
function resultTablePopup_callback(resultObj){
	selectTableId = resultObj.tableId;
	selectBusnScCd = resultObj.busnScCd;
	var tableName = resultObj.tableName;
	
	$("#sbx_busnScCd").val(selectBusnScCd);
	$("#ibx_tableName").val(tableName);
	$("#ibx_tableId").val(selectTableId);
	
	selectPkList();			//PK리스트 조회
} 

/**
 * @설명: 업무구분의 콤보박스 선택값을 가져온다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.21
 * @최종변경일: 
 * @매개변수: 
 * @반환값: busnScCd
 * @개정이력: 
 *  심민정 2021.01.21 최초작성
 */
function getBusnScCdValue(){
	var busnScCd = $("#sbx_busnScCd option:selected").val();
	return busnScCd;
}

/**
 * @설명: 검색한 테이블의 pkColumn 조회
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.26. 최초작성
 */
function selectPkList(){
	//조회에 필요한 값을 셋팅
	var reqParam = {
				"tableId": selectTableId,
				"busnScCd": selectBusnScCd
		}
		$.callAjax(reqParam, "/mg/da/mgda211m/selectPkList.do")
		.done(function(data) {
		 if(data.list == null){
			$("#div_pkColumnSelect").hide();	
			removeGridData();
		 }else{
			$("#div_pkColumnSelect").show();	// pkColumn조회영역 노출
			removeGridData();					// 버튼 및 그리드
			pkListData = data.list;
			
			// 테이블 정보 조회
//			console.log("pkListData    : ",pkListData);
			
			selectTableSchemaInfo();			// 테이블 헤더 조회
			setPkTable(pkListData);				// PkTable 그리기
		 }
		}).fail(function(data){
			console.log("fail to selectPkList");
		});		
}


/**
 * @설명: 검색한 테이블의 pkColumn리스트를 pkColumnTable로 생성
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.26.
 * @최종변경일: 
 * @매개변수: listData
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.26. 최초작성
 */
function setPkTable(listData){
	var $tr = null;
	var $tbody = $("#tbody_pkColumnList");
		$tbody.html("");
	var $txt_search = $("#txt_search");
		
	var pkColumnKraName;
	var pkColumnCnt = listData.length;

	for (var i = 0; i < pkColumnCnt; i++) {
		var json = listData[i];
		pkColumnKraName = json.clumKraNm;
		
		var $tdTitle = $("<td>").attr("style","width:auto;").append($("<p>").attr("class","title").attr("id", "pkColumn"+i).text(pkColumnKraName));
		var $tdInput = $("<td>").attr("style","width:150px; padding-right:10px;").append($("<input type=text>").attr("id", "ibx_pkSearchValue"+i));
		
		var rowCnt = Math.ceil(pkColumnCnt / 4);	
		
		if(rowCnt == 1){
			$txt_search.attr("class","").attr("style","padding:12px 0;");
		}else if(rowCnt == 2){
			$txt_search.attr("class","p2").attr("style","padding:26px 0;");
		}else if(rowCnt == 3){
			$txt_search.attr("class","p3").attr("style","padding:40px 0;");
		}else if(rowCnt == 4){
			$txt_search.attr("class","p4");
		}
		
		if(i % 4 == 0) { 
			if($tr != null) {
				$tbody.append($tr);
			}
			$tr = $("<tr>");	
			$tr.append($tdTitle).append($tdInput); 
	
			if(pkColumnCnt == (i+1)) { 
				$tr.append($tdTitle).append($tdInput);
				$tbody.append($tr);
			}
		}else { 
			if(pkColumnCnt == (i+1)) { 
				$tr.append($tdTitle).append($tdInput);
				$tbody.append($tr);
			}else{
				$tr.append($tdTitle).append($tdInput);
			}
		}
		$tdInput.on("keydown", function(e){
			if(e.keyCode === 13){
				searchGridData();
			}
		});
	}
}

/**
 * @설명: jsGrid 빈 테이블 생성
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.26.
 * @최종변경일: 
 * @매개변수: columnList
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.26. 최초작성
 */
function initGrid(columnList){
	var gridFields = [];
	var columnName;
	var columnKraName;
	var charLength;
	var nullable;
	var dataType;
	var dataTypeToString;
	var resultType;
	
		gridFields.push(
				{ name: "seq", title:"순번", css:"cell", type: "number", width: 50, editing: false, align:"center"}
				,
				{ name: "status", title:"상태", css:"cell", type: "text", width: 50, editing: false, align:"center",itemTemplate : function(value, item) {
					return $.fn.getGridRowStatusName(value);
				}}, 
				{name: "gridManupulate", title: "그리드조작", css: "cell", type: "control", width: 70, align: "left", editing: true	}
		);
	
		// columnList
		for (var i = 0; i < columnList.length; i++) {
			var json = columnList[i];
			columnName = underToCamel(json.columnName);
			columnName = replaceUnderCase(columnName);
			columnKraName = json.columnKraName;
			
			charLength = json.length;
			dataTypeToString = parseInt(charLength);
			nullable = json.nullable;
			dataType = json.dataType;
			
			var isPk = false; 	
			// pkColumnList
			for (var j = 0; j < pkListData.length; j++) {
				var jsonPk = pkListData[j];
				var clumNm = underToCamel(jsonPk.clumNm);
					clumNm = replaceUnderCase(clumNm);
				var clumKraNm = jsonPk.clumKraNm;

				// pk컬럼명과 같을 때
				if(columnName == clumNm){
					isPk = true;
				}
			}
			
			//pk컬럼일 때
			if(isPk == true){
				//pk컬럼이 NUMBER타입일 때
				if(dataType == "NUMBER"){ 
					gridFields.push(
							{ name: columnName,title : columnKraName , css:"cell", type: "text", width: 200, editing: true, align:"right",
								editTemplate:function(value,item) {
									var val = String(value);
									var $result = jsGrid.fields.text.prototype.editTemplate.call(this, val, item);
									// 신규 외엔 수정 불가
									if(item.status != "c") {
										$result.attr("readonly", "true");
									}
									// Enter 키 입력시 입력사항 반영됨
									$result.on("keydown", function(e){
										if(e.which === 13){
											$("#gridDiv").jsGrid("updateItem");
											return false;
										}
									});
									return $result;
								},
								headerTemplate : function(){
									var $spTitle = $("<span>").text(this.title);
									var $sp = $("<span>").addClass("point").text(" *");
									$spTitle.append($sp);
									return $spTitle;
								},
								itemTemplate : function(value,item){
										return $.addCommaNumber(value + "");
								}
							});
				//pk컬럼이 NUMBER타입이 아닐 때	
				}else{
					gridFields.push(
							{ name: columnName,title : columnKraName , css:"cell", type: "text", width: 200, editing: true, align:"center",
								editTemplate:function(value,item) {
									var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
									// 신규 외엔 수정 불가
									if(item.status != "c") {
										$result.attr("readonly", "true");
									}
									// Enter 키 입력시 입력사항 반영됨
									$result.on("keydown", function(e){
										if(e.which === 13){
											$("#gridDiv").jsGrid("updateItem");
											return false;
										}
									});
									return $result;
								},
								headerTemplate : function(){
									var $spTitle = $("<span>").text(this.title);
									var $sp = $("<span>").addClass("point").text(" *");
									$spTitle.append($sp);
									return $spTitle;
								}
							});
				}
			//isPk=false //일반컬럼일 때	
			}else{
				if(columnName != "regntEno" && columnName != "regDtm" && columnName != "trtrEno" && columnName !="trtDtm"){
					if(nullable == "Y"){
						if(dataType == "NUMBER"){
							gridFields.push(
									{ name: columnName, title: columnKraName, css:"cell", type: "text", width: 200, editing: true, align:"right",
										editTemplate:function(value,item) {
											var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
											
											// Enter 키 입력시 입력사항 반영됨
											$result.on("keydown", function(e){
												if(e.which === 13){
													$("#gridDiv").jsGrid("updateItem");
													return false;
												}
											});
											return $result;
										},
										itemTemplate : function(value,item){
											return $.addCommaNumber(value + "");
										}
									});
						//NUNBER타입이 아닌 NOTNULL=Y 컬럼들
						}else{
							gridFields.push(
									{ name: columnName, title: columnKraName, css:"cell", type: "text", width: 200, editing: true, align:"center",
										editTemplate:function(value,item) {
											var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
											
											// Enter 키 입력시 입력사항 반영됨
											$result.on("keydown", function(e){
												if(e.which === 13){
													$("#gridDiv").jsGrid("updateItem");
													return false;
												}
											});
											return $result;
										}
									});
						}
					// NOTNULL=N 컬럼
					}else{
						if(dataType == "NUMBER"){
							gridFields.push(
									{ name: columnName, title: columnKraName, css:"cell", type: "text", width: 200, editing: true, align:"right",
										editTemplate:function(value,item) {
											var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
											
											// Enter 키 입력시 입력사항 반영됨
											$result.on("keydown", function(e){
												if(e.which === 13){
													$("#gridDiv").jsGrid("updateItem");
													return false;
												}
											});
											return $result;
										},
										headerTemplate : function(){
											var $spTitle = $("<span>").text(this.title);
											var $sp = $("<span>").addClass("point").text(" *");
											$spTitle.append($sp);
											return $spTitle;
										},
										itemTemplate : function(value,item){
											return $.addCommaNumber(value + "");
										}
									});
						//NUMBER타입이 아닌  NOTNULL=N 컬럼들
						}else{
							gridFields.push(
									{ name: columnName, title: columnKraName, css:"cell", type: "text", width: 200, editing: true, align:"center",
										editTemplate:function(value,item) {
											var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
											
											// Enter 키 입력시 입력사항 반영됨
											$result.on("keydown", function(e){
												if(e.which === 13){
													$("#gridDiv").jsGrid("updateItem");
													return false;
												}
											});
											return $result;
										},
										headerTemplate : function(){
											var $spTitle = $("<span>").text(this.title);
											var $sp = $("<span>").addClass("point").text(" *");
											$spTitle.append($sp);
											return $spTitle;
										}
									});
						}
					}
				//등록일시,등록사번,처리일시,처리사번  [일시->일자로 변경됨(2021.04.08_컬럼명은 변경x)]
				}else{
					if(columnName == "regDtm"){
						columnKraName = "등록일자";
						gridFields.push(
								{ name: columnName, title: columnKraName, css:"cell", type: "text", width: 200, align:"center", editing: false}
						);	
					}else if(columnName == "trtDtm"){
						columnKraName = "처리일자";
						gridFields.push(
								{ name: columnName, title: columnKraName, css:"cell", type: "text", width: 200, align:"center", editing: false}
						);	
					}else{	
						gridFields.push(
								{ name: columnName, title: columnKraName, css:"cell", type: "text", width: 200, align:"center", editing: false}
						);	
					}
				}
			}
			
		}
		
		
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 500,
		editing: true,
		sorting: true,
		paging: true,
		selectHiglight:true,
		deleteConfirm: "삭제하시겠습니까?",
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				var status = "u";	//수정
				if(item.status == "c") {	//신규는 c상태 유지 후 데이터 수정
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
				if(item.status == "c") {	//신규 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else  {	//u,d 는 삭제 상태로 처리 -> updateItem에서 최종  삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#gridDiv").jsGrid("updateItem", item);
					return item;
				}
			}			
		},
		onItemEditing: function(args) {	//Grid Edit모드 진입시 처리
			//체크박스는 Edit 모드 취소
			var targetElem = (event) ? event.srcElement||null:null;
			if(targetElem) {
				if( targetElem.outerHTML.indexOf("check") > 0) {
					args.cancel = true;
				}
			}
			//delete 상태 스킵
			if( args.item.status == "d") {
				args.cancel = true;
			}
		},
		fields : gridFields
	});	
	gridObject.rowClick(function(args) {
		clickIndex = args.itemIndex;;
	});	
	
	//그리드 생성
	gridObject.gridCreate();

	
	//그리드 속성변경
//	document.getElementById("gridDiv").setAttribute("style","display: block");

}

var underToCamel = function(str){
	return str.toLowerCase().replace(/(\_[a-z])/g,function(arg){
		return arg.toUpperCase().replace("_","");
	});
}

function replaceUnderCase(colNm){
	if(colNm.indexOf("_") != -1){
		return $.replaceAll(colNm,"_",""); 
	}
	return colNm;
}

/**
 * @설명: 그리드 하나의 행을 추가한다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @개정이력: 
 *  심민정 2021.01.27 최초작성
 */
function addGridData() {
	var dataList = $("#gridDiv").jsGrid("option", "data");
	var seq = dataList.length + 1;
	var obj = {"seq" : seq, "status": "c"};
	var colNameList = {};
	var resultInsertItem = {};
	
	for (var i = 0; i < selectTableClumList.length; i++) {
		var json = selectTableClumList[i];
		columnName = underToCamel(json.columnName);
		colNameList[columnName] = "";
		resultInsertItem = $.extend({}, obj, colNameList);
	}
	$("#gridDiv").jsGrid("insertItem", resultInsertItem);
	
	//마지막 페이지 이동
	var pageLastText = $("#gridDiv").jsGrid("option", "pageLastText");
	$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
}

/**
 * @설명: 신규생성, 수정, 삭제 처리한다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.29.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.29. 최초작성
 */
function saveGridDataAll() {
	//전체 데이터
	var gridData = $("#gridDiv").jsGrid("option", "data");
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}

	var saveList = []; 
	var finallyList = [];

	//c,u,d 건만 추출 후 저장 처리
	for(var i=0; i<gridData.length; i++) {
		var item = gridData[i];
		if (!isValid(i, item)) {
			return;
		}
		
		var itemObj = Object.keys(item);
		for (var j = 0; j < itemObj.length; j++) {
			var itemKey = itemObj[j];
			if(itemKey!="seq"){
				item[itemKey] = String(item[itemKey]);
			}
		}
		
		if (item.status == "c") {
			saveList.push(item);
		} else if(item.status == "u") {
			saveList.push(item);
		} else if(item.status == "d") {
			saveList.push(item);
		}
	}

	
	
	finallyList = getUpdateTableSchemaInfoContentReqParam();
	finallyList.saveList = saveList;
	
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({"jsonStr":JSON.stringify(finallyList)}, "/mg/da/mgda211m/saveManlDtList.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					selectTableSchemaInfoContent();
				}
			}).fail(function(data){
			});
		}
	}, 2);
}

/**
 * @설명: 저장 전 validation 체크
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.26.
 * @최종변경일: 
 * @매개변수: i, item
 * @반환값: boolean
 * @개정이력: 
 *  심민정 2021.01.26 최초작성
 */
function isValid(i,item){
	var colName;
	var columnName;
	var nullable;
	var itemData;
	 
	for(var j=0; j<selectTableClumList.length;j++){
		var json = selectTableClumList[j];
		colName = json.columnName;
		nullable = json.nullable;
		columnName = underToCamel(colName);
		itemData = item[columnName];
		
		if(columnName == "regDtm" || columnName == "regntEno" || columnName == "trtrEno" || columnName == "trtDtm"){
			return true;
		}
		
		if(nullable == "N") {
			if(itemData != "0") { // 데이터 값이 0인 경우에도 저장하기 위해 체크
				if(itemData == "") {
					$.fn.msgBox((i+1) + "행의 필수입력항목을 입력하세요.");
					return false;
				}
			}
		}else{
			return true;
		}
	}
	return true;
}

/**
 * @설명: 스키마 컨텐츠 조회시 reqParam에 담을 배열을 만드는 함수
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: contentSelectReqParam
 * @개정이력: 
 *  심민정 2021.01.26. 최초작성
 */
function getSelectTableSchemaInfoContentReqParam(){
	//Schema컨텐츠 조회시 사용할 reqParam배열
	var contentSelectReqParam = [];
	var pkInputValue;
	var pkListToString;
	var columnName;
	
	contentSelectReqParam.push({"busnScCd":selectBusnScCd,"tableId" : selectTableId});
	
	if(pkListData != null){
		for (var i = 0; i < pkListData.length; i++) {
			var json = pkListData[i];
			pkColumnEngName = json.clumNm; 
			pkColumnDataType = json.dataType; 
			pkInputValue = $("#ibx_pkSearchValue"+i).val();
			
			if(pkColumnEngName == "FIN_YM"){
				if(pkInputValue == ""){
					return null;
				}
			}
			
			contentSelectReqParam.push({
				"pkColumnEngName" : pkColumnEngName,
				"pkColumnDataType" : pkColumnDataType, 
				"pkInputValue" : pkInputValue
			});
		}
	}
	var array = [];
	if(selectTableClumList != null){
		for (var i = 0; i < selectTableClumList.length; i++) {
			var columnName = selectTableClumList[i].columnName;
			array.push(columnName);
		}
		pkListToString = array.join(",");
		contentSelectReqParam.push({"columnName" : pkListToString});
	}
	
	return contentSelectReqParam;
}


/**
 * @설명: getUpdateTableSchemaInfoContentReqParam : 수기데이터관리 update
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.01.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: contentSelectReqParam
 * @개정이력: 
 *  심민정 2021.02.01. 최초작성
 */
function getUpdateTableSchemaInfoContentReqParam(){
	//Schema컨텐츠 조회시 사용할 reqParam배열
	var contentSelectReqParam = {};
	
	contentSelectReqParam.busnScCd = selectBusnScCd;
	contentSelectReqParam.tableId = selectTableId;

	if (pkListData != null) {
		contentSelectReqParam.pkListData = pkListData;
	}

	return contentSelectReqParam;
}

/**
 * @설명: 수기데이터관리 GridTable의 Header조회
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.26. 최초작성
 */
function selectTableSchemaInfo(){
	//조회에 필요한 값을 셋팅
	var reqParam = {
				"tableId": selectTableId,
				"busnScCd": selectBusnScCd
		}
		$.callAjax(reqParam, "/mg/da/mgda211m/selectTableSchemaInfo.do")
		.done(function(data) {
			// 그리드 데이터 초기화	
			$("#gridDiv").jsGrid("reset");
			
			// 서버로 받아온 데이터 리스트
			selectTableClumList = data.list;  		
			
//			console.log("전체컬럼조회",selectTableClumList); 
			
			// 그리드 바인딩
			initGrid(selectTableClumList);		
			
		}).fail(function(data){
			console.log("fail to selectTableSchemaInfo");
		});		
	}

/**
 * @설명: 수기데이터관리 GridTable의 Content조회
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.26. 최초작성
 */
function selectTableSchemaInfoContent(){
	var arr = getSelectTableSchemaInfoContentReqParam();
	
	if(arr == null){
		$.fn.msgBox("마감년월은 필수 검색항목입니다.");
		return;
	}
	
	$.callAjax({"list":JSON.stringify(arr)}, "/mg/da/mgda211m/selectTableSchemaInfoContent.do")
	.done(function(data) {
		// 그리드 데이터 초기화	
		$("#gridDiv").jsGrid("reset");				
		
		// 서버로 받아온 데이터 리스트
		var listData = data.list;  			
		
		// 그리드 바인딩
		$("#gridDiv").jsGrid("loadData", listData).done(function(){  
		});

		/* 2021.06.15 0건 그리드 메세지 처리 */
		if(listData.length == 0) {
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		console.log("fail to selectTableSchemaInfoContent");
	});		
}

/**
 * @설명: 수기데이터관리 GridTable 엑셀다운로드
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.26. 최초작성
 */
function excelDownload(){
	//CSV 다운로드 
	$("#btn_csv_download").on("click", function(e){
		var paramObj = {};
		paramObj.id = "gridDiv";
		paramObj.fileName = "수기데이터관리.csv";   
		paramObj.applyItemTemplate = false;		
		$.fn.exportGridCSV(paramObj);
	});
}
