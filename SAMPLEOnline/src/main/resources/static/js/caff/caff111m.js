/**
 * @시스템명: IFRS17
 * @업무명: 결산정보결과조회
 * @설명: 결산정보결과를 조회하는 화면의 JS
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.06
 * @최종변경일:
 * @개정이력:
 *  심민정 2021.01.06 최초작성
 *  심민정 2021.06.15 3차 소스표준화
 *  황석현 2021.12.13 공통코드 I17_BUSN_SC_CD 수정
 */

// 전역변수 선언부
var pkListData = [];
var selectTableClumList = [];
var selectTableId = "";		
var selectBusnScCd = "";		
var callJsFileName = "";

$(document).ready(function(){
	/* 2021.05.03 툴팁 추가 */
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/* 2021.06.14 화면ID 추가 */
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
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
		if("S_BE" != busnArr[i]["code"] && "S_MG" != busnArr[i]["code"]) {
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
 * @최초작성일: 2021.01.06
 * @최종변경일: 
 * @개정이력: 
 *  심민정 2021.01.06 최초작성
 */
function initEvent() {
	callJsFileName = "caff111m";
	
	// PK컬럼 검색영역 및 버튼 hide
	$("#div_pkColumnSelect, #btn_csv_download").hide();
	
	// 업무구분 change
	$("#sbx_busnScCd").on("change", function(e){
		// 테이블명, 테이블ID input
		$("#ibx_tableName, #ibx_tableId").val(null);
		// PK컬럼 검색영역, 엑셀다운로드 버튼, 그리드 hide
		$("#div_pkColumnSelect, #btn_csv_download, #gridDiv").hide();
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
		selectStactInfoRsltList();
	});

	// 엑셀 다운로드
	$("#btn_csv_download").on("click", function(e){
		var gridId = "gridDiv";
		var fileName = "결산정보결과조회.csv";

		var paramObj = {};
		paramObj.id = gridId;
		paramObj.fileName = fileName;       
		paramObj.applyItemTemplate = false;
		$.fn.exportGridCSV(paramObj);
	});
	
}

function selectStactInfoRsltList(){
	selectTableSchemaInfoContent();
	$("#btn_csv_download").show();
}


/**
 * @설명: 테이블조회 팝업 콜백
 * @최초작성자: 권세림
 * @최초작성일: 2021.01.08
 * @최종변경일: 
 * @매개변수: resultObj
 * @반환값: 
 * @개정이력: 
 *  권세림 2021.01.08 최초작성
 */
function resultTablePopup_callback(resultObj){
	var tableName = resultObj.tableName;
	selectTableId = resultObj.tableId;
	selectBusnScCd = resultObj.busnScCd;
	
	$("#sbx_busnScCd").val(selectBusnScCd);
	$("#ibx_tableName").val(tableName);
	$("#ibx_tableId").val(selectTableId);
	
	// PK목록 조회
	selectPkList();
	
	// PK컬럼 검색영역 노출
	$("#div_pkColumnSelect").show();			
	
	// 그리드 Clear: 그리드 안에 "데이터만" 비움
	$("#gridDiv").jsGrid("option", "data", []);
} 


/**
 * @설명: 업무구분의 콤보박스 선택값을 가져온다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.06
 * @최종변경일: 
 * @매개변수: 
 * @반환값: busnScCd
 * @개정이력: 
 *  심민정 2021.01.06 최초작성
 */
function getBusnScCdValue(){
	var busnScCd = $("#sbx_busnScCd option:selected").val();
	return busnScCd;
}


/**
 * @설명: 조회하는 테이블의 PK목록 조회
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.14 최초작성
 */

function selectPkList(){
	//조회에 필요한 값을 셋팅
	var reqParam = {
				"tableId": selectTableId
		}
		$.callAjax(reqParam, "/ca/ff/caff111m/selectPkList.do")
		.done(function(data) {
			 if(data.list == null){
				$("#div_pkColumnSelect").hide();	
				$("#btn_csv_download, #gridDiv").hide();
			 }else{
				$("#div_pkColumnSelect").show();			//pkColumn조회영역 노출
				$("#btn_csv_download, #gridDiv").hide();
				pkListData = data.list;  					//서버로 받아온 데이터 리스트
				selectTableSchemaInfo();					//테이블 헤더 조회
				setPkTable(pkListData);						//PkTable 그리기
			 }
		}).fail(function(data){
			console.log("fail to selectPkList");
		});		
}


/**
 * @설명: 조회하는 테이블의 PK검색영역 생성
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.14
 * @최종변경일: 
 * @매개변수: listData
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.14 최초작성
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
				selectStactInfoRsltList();
			}
		});
	}
}

/**
 * @설명: GridTable 생성
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.14
 * @최종변경일: 
 * @매개변수: columnList
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.14 최초작성
 */
function initGrid(columnList){
	var gridFields = [];
	var columnName = [];
	var columnKraName = [];
	var dataType;

	for (var i = 0; i < columnList.length; i++) {
		var json = columnList[i];
		columnName = underToCamel(json.columnName);
		columnName = replaceUnderCase(columnName);
		columnKraName = json.columnKraName;
		dataType = json.dataType;
		
		//등록일시,처리일시->"등록일자,처리일자"로 변경됨(2021.04.08_컬럼명은 변경x)
		if(columnName == "regDtm"){
			columnKraName = "등록일자";
		}else if(columnName == "trtDtm"){
			columnKraName = "처리일자";
		}
		
		if(dataType == "NUMBER"){ 
			gridFields.push(
				{ name: columnName, title: columnKraName, css:"cell", type: "text", width: 200, sorting:true,editing: false, align:"right",
					itemTemplate : function(value,item){
						return $.addCommaNumber(value + "");
					}
				});
		//데이터타입이 NUMBER가 아닐 때		
		}else{
			gridFields.push(
				{ name: columnName, title: columnKraName, css:"cell", type: "text", width: 200, sorting:true,editing: false, align:"center" });
		}
	}
	
	var gridObject = new ComJsGrid();
	gridObject.id("gridDiv");
	gridObject.height(500);
	gridObject.paging(true);
	gridObject.selectHiglight(false);

	// 테이블조회 필드를 채우기
	gridObject.fields(gridFields);
	
	// 그리드 생성
	gridObject.gridCreate();
	
	// 그리드 속성변경 
	document.getElementById("gridDiv").setAttribute("style","display: block");

}

function replaceUnderCase(colNm){
	if(colNm.indexOf("_") != -1){ 
		return $.replaceAll(colNm,"_",""); 
	}
	return colNm;
}


/**
 * @설명: getSelectTableSchemaInfoContentReqParam : 
 * tableId pkInputValue..... 스키마 컨텐츠 조회시 reqParam에 담을 배열을 만드는 함수
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: contentSelectReqParam
 * @개정이력: 
 *  심민정 2021.01.14 최초작성
 */
function getSelectTableSchemaInfoContentReqParam(){
	//Schema컨텐츠 조회시 사용할 reqParam배열
	var contentSelectReqParam = [];
	var pkInputValue;
	var pkListToString;
	var columnName;
	
	contentSelectReqParam.push({"busnScCd": selectBusnScCd, "tableId" : selectTableId});
	
	if(pkListData != null){
		for (var i = 0; i < pkListData.length; i++) {
			var json = pkListData[i];
			pkColumnEngName = json.clumNm;
			pkColumnDataType = json.dataType;
			pkInputValue = $("#ibx_pkSearchValue"+i).val();
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

var underToCamel = function(str){
	return str.toLowerCase().replace(/(\_[a-z])/g,function(arg){
		return arg.toUpperCase().replace("_","");
	});
}

/**
 * @설명: gridTable의 header조회
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.14 최초작성
 */
function selectTableSchemaInfo(){
	// 조회에 필요한 값을 셋팅
	var reqParam = {
				"tableId": selectTableId,
				"busnScCd": selectBusnScCd
		}
		$.callAjax(reqParam, "/ca/ff/caff111m/selectTableSchemaInfo.do")
		.done(function(data) {
			// 그리드 데이터 초기화	
			$("#gridDiv").jsGrid("reset");				
			
			// 서버로 받아온 데이터 리스트
			selectTableClumList = data.list;
			
			// 그리드 바인딩
			initGrid(selectTableClumList);
			
		}).fail(function(data){
			console.log("fail to selectTableSchemaInfo");
		});		
	}

/**
 * @설명: gridTable의 content조회
 * @최초작성자: 심민정
 * @최초작성일: 2021.01.14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.01.14 최초작성
 */
function selectTableSchemaInfoContent(){
	$.callAjax({"list":JSON.stringify(getSelectTableSchemaInfoContentReqParam())}, "/ca/ff/caff111m/selectTableSchemaInfoContent.do")
	.done(function(data) {
		// 그리드 데이터 초기화	
		$("#gridDiv").jsGrid("reset");
		
		// 그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		/* 2021.06.15 0건 그리드 메세지 처리 */
		if(listData.length == 0) {
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		console.log("fail to selectTableSchemaInfoContent");
	});		
}
