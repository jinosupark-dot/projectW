/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 데이터관리
 * @설명: 데이터관리 화면의 JS
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 8. 23.
 * @최종변경일: 
 * @개정이력: 
 *  박세라 (61000434) 2021. 8. 23. 최초작성
 */
// 전역변수 선언부
var pkListData = [];
var selectTableId="";
var tableName="";
var clumList = "";
var gOneOff = "";

$(document).ready(function(){
    /* 2021.05.03 툴팁 추가 */
    $("#imgToolTip").attr("title", parent.viewPath);
    
    /* 2021.06.14 화면ID 추가 */
    $($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
    
    /* 2021.06.14 저장 권한제어 추가 */
//    $.fn.setBtnPermission([{"btnId":"#btn_save","type":"A"}]);
    
    // event 초기화
    initEvent();
    
    // 포커스(업무구분)
    $("#sbx_busnScCd").focus();
});

/**
* @설명: 데이터관리 기본 이벤트 세팅
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function initEvent() {

    // PK컬럼 검색영역 및 버튼 hide
    $("#div_pkColumnSelect, #btn_gridTop").hide();
    
    // 테이블 검색 팝업
    $("#btn_tableNameSearch, #btn_tableIdSearch").on("click", function(e){
        // 테이블명, 테이블ID input
        $("#ibx_tableId, #ibx_tableName").val(null);
        // PK컬럼 검색영역, 버튼, 그리드 hide
        $("#div_pkColumnSelect, #btn_gridTop, #gridDiv").hide();
        pkListData = [];
        selectTableId="";
        tableName="";
        clumList = "";
        
        var popupOption = {
                url: "/be/pd/bepd321p.do",
                name: "bepd321p",
                width: 700,
                height: 495
        }
        var popup = $.fn.openPopup(popupOption);
    });
    
    // 조회
    $("#btn_search").on("click", function(e){
        searchGridData();
    });
    
    // 일괄삭제
    $("#btn_delete").on('click', function(e) {
    	fnChkDelete();
    });
    
    // 엑셀 다운로드
    $('#btn_excel_download').on('click', function(e){
        //데이터 체크
        var dataList = $("#gridDiv").jsGrid("option", "data");
        if(dataList.length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        var fileName = tableName+"데이터관리_다운로드.xlsx";
        $.fn.exportGridExcel({
            id: 'gridDiv', 
            fileName: fileName
        });
    });
    
    //엑셀업로드
    $("#btn_loadExcel").on("click", function(e){
        var paramObj = {};
        var arrColsInfo = $.fn.getTbCols(selectTableId);
        var gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        paramObj.id = "gridDiv";                 //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols;
                        data["tbNm"] = selectTableId;
                        data["menuId"] = $.fn.getMenuId();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveDtList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                                selectTblData(clumList, selectTableId);
                            }
                        }).fail(function(data){
                            $.fn.msgBox('데이터 저장이 실패했습니다.');
                        });
                    }
                }, 2);
            }
        };
        $.fn.BeloadGridExcel(paramObj);
    });
    
    $("#excelFile").on("change", function(e){

        console.log("excelRead");
        
        var input = e.target;
        var reader = new FileReader();
        
        reader.onload = function(oFile) {
            var binary = "";
            var bytes = new Uint8Array(oFile.target.result);
            var length = bytes.byteLength;
            for(var i=0; i<length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }

            var wb = XLSX.read(binary, {type : "binary"});
            
            wb.SheetNames.forEach(function(sheetName){
                var rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
                console.log(JSON.stringify(rowObj));
            });
        };
        reader.readAsArrayBuffer(input.files[0]);
    });
}

function fnChkDelete(){
	var oneoff = "";
	//데이터 체크
	for(var i=0; i<pkListData.length; i++) {
        var txtStr = toUnderscore(pkListData[i].columnName);
        if ($("#"+txtStr).val() != null && $("#"+txtStr).val() != "") {
        	if (txtStr == "oneofEfcScCd" &&$("#"+txtStr).val() == "01") { 
        		oneoff = $("#"+txtStr).val();
        	}
        }
    }
	
    var dataList = $("#gridDiv").jsGrid("option", "data");
    var chkTableId = selectTableId.replace('TB_IBE', '').substr(0,3);
    
    if(dataList.length == 0) {
        $.fn.msgBox("삭제할 항목이 없습니다.");
        return;
    } else {
//    	if (chkTableId == 'BDS'){			// 20260622 제거요청
//    		if(gOneOff != '01') {
//    			$.fn.msgBox("One-off 업로드 데이터만 삭제가능합니다.");
//    			return;
//    		} else if (gOneOff != oneoff) {
//    			$.fn.msgBox("One-off 조회값이 변경되었습니다.");
//    			return;
//      	    }
//        } 
    	
        $.fn.msgBox(dataList.length+'건의 데이터를 삭제하시겠습니까?', function (obj) {
            if (obj.btn_ok) {
                deleteTblData();
            }
        }, 2)
	    
    }
};

function toUnderscore(strCamel) {
    if(typeof strCamel == "number") {
        return strCamel.toString();
    }
    return strCamel.toLowerCase().replace(/(\_[a-z])/g,function(arg){
        return arg.toUpperCase().replace("_","");
    });
};

// gridDiv 보여주기
function searchGridData(){
    selectTableSchemaInfo();
    $("#btn_gridTop, #gridDiv").show();
}

// grid 초기화 및 gridDiv 숨기기
function removeGridData(){
    $("#btn_gridTop, #gridDiv").hide();
    $("#gridDiv").jsGrid("option", "data", []);
    $("#gridDiv").jsGrid("destroy");
}


/**
* @설명: 데이터관리 > 팝업창 콜백
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 24.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 24. 최초작성
*/
function resultTablePopup_callback(resultObj){
    selectTableId = resultObj.tableId;
    tableName = resultObj.tableName;

    $("#ibx_tableName").val(tableName);
    $("#ibx_tableId").val(selectTableId);
    
    selectPkList();         //PK리스트 조회
}

/**
* @설명: 데이터관리 > 검색테이블의 PK컬럼 조회
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 24.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 24. 최초작성
*/
function selectPkList(){
    //조회에 필요한 값을 셋팅
    var reqParam = {
                "tableId": selectTableId
        }
        $.callAjax(reqParam, "/be/pd/bepd321m/selectPkList.do")
        .done(function(data) {
         if(data.list == null){
            $("#div_pkColumnSelect").hide();    
            removeGridData();
         }else{
            $("#div_pkColumnSelect").show();    // pkColumn조회영역 노출
            removeGridData();                   // 버튼 및 그리드
            pkListData = data.list;
            
            selectTableSchemaInfo();            // 테이블 헤더 조회
            setPkTable(pkListData);             // PkTable 그리기
         }
        }).fail(function(data){
            console.log("fail to selectPkList");
        });     
}


/**
* @설명: 데이터관리 > 가져온 PK컬럼 테이블에 세팅
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 24.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 24. 최초작성
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
        pkColumnKraName = json.comments;
        
        var $tdTitle = $("<td>").attr("style","width:auto;").append($("<p>").attr("class","title").attr("id", "pkColumn"+i).text(pkColumnKraName));
        var $tdInput = $("<td>").attr("style","width:150px; padding-right:10px;").append($("<input type=text>").attr("id", toUnderscore(json.columnName)));
        
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
* @설명: 데이터관리 > 기본 그리드 세팅
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 25.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 25. 최초작성
*/
function initGrid(arrColsInfo) {
    var fieldList = [];
    for(var i=0; i<arrColsInfo.length; i++) {
        var titleStr = toUnderscore(arrColsInfo[i].columnName).replaceAll("_", "");
//        if(arrColsInfo[i].dataType == 'NUMBER') {
        if (arrColsInfo[i].columnKraName.indexOf("코드") != -1 || arrColsInfo[i].columnKraName.indexOf("그룹ID") != -1 
         || arrColsInfo[i].columnKraName.indexOf("그룹명") != -1 || arrColsInfo[i].columnKraName.indexOf("코드명") != -1
         || arrColsInfo[i].columnKraName.indexOf("여부") != -1 || arrColsInfo[i].columnKraName.indexOf("BE명") != -1 
         || arrColsInfo[i].columnKraName.indexOf("담당조직") != -1 || arrColsInfo[i].columnKraName.indexOf("조직장") != -1){
    		var field = { name: titleStr, title: arrColsInfo[i].columnKraName.replaceAll("_", ""), css:"cell", type: "text", width: 40, align:"center", itemTemplate:function(value, item) {
    			return value}}
        } else if (arrColsInfo[i].columnKraName.indexOf("건수") != -1 || arrColsInfo[i].columnKraName.indexOf("금액") != -1
               	 || arrColsInfo[i].columnKraName.indexOf("월수") != -1 || arrColsInfo[i].columnKraName.indexOf("보험료") != -1	
            	 || arrColsInfo[i].columnKraName.indexOf("준비금") != -1 || arrColsInfo[i].columnKraName.indexOf("보험금") != -1
            	 || arrColsInfo[i].columnKraName.indexOf("유지비") != -1 || arrColsInfo[i].columnKraName.indexOf("잔액") != -1
            	 || arrColsInfo[i].columnKraName.indexOf("수금비") != -1 || arrColsInfo[i].columnKraName.indexOf("계약비") != -1
            	 || arrColsInfo[i].columnKraName.indexOf("사업비") != -1 || arrColsInfo[i].columnKraName.indexOf("계약비") != -1
            	 || arrColsInfo[i].columnKraName.indexOf("수수료") != -1 || arrColsInfo[i].columnKraName.indexOf("환급금") != -1	){
            		var field = { name: titleStr, title: arrColsInfo[i].columnKraName.replaceAll("_", ""), css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            			return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        } else if (arrColsInfo[i].columnKraName.indexOf("율") != -1 || arrColsInfo[i].columnKraName.indexOf("스프레드") != -1) {
        	var field = { name: titleStr, title: arrColsInfo[i].columnKraName.replaceAll("_", ""), css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
        	return $.fn.isEmpty(value) ? "0" : value}}
        } else if (arrColsInfo[i].columnKraName.indexOf("년월") != -1 || arrColsInfo[i].columnKraName.indexOf("기준일자") != -1) {
        	var field = { name: titleStr, title: arrColsInfo[i].columnKraName.replaceAll("_", ""), css:"cell", type: "text", width: 40, align:"center", itemTemplate:function(value, item) {
        	if (value.length == 8){
        		value = value.replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3')
        	} else {
        		value = value.replace(/(\d{4})(\d{2})/,'$1-$2')
        	}
    		return value}}
        } else if (arrColsInfo[i].columnKraName.indexOf("내용") != -1) {
        	var field = { name: titleStr, title: arrColsInfo[i].columnKraName.replaceAll("_", ""), css:"cell", type: "text", width: 40, align:"left", itemTemplate:function(value, item) {
            	return value}}
        } else {
        	var field = { name: titleStr, title: arrColsInfo[i].columnKraName.replaceAll("_", ""), css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
        	return value}}
        }
            fieldList.push(field);
//        } else {
//            var field = { name: titleStr, title: arrColsInfo[i].columnKraName, css:"cell", type: "text", width: 40, align:"center"}
//            fieldList.push(field);
//        }
    }
    
    var gridObject = new ComJsGrid({
        id: "gridDiv",
        height: 500,
        editing: false,
        sorting: true,
        paging: true,
        selectHiglight:true,
        fields : fieldList
    });
    
    //그리드 생성
    gridObject.gridCreate();
}

/**
* @설명: 데이터관리 > 검색테이블 헤더용 컬럼 세팅
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 25.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 25. 최초작성
*/
function selectTableSchemaInfo(){
    var arrColsInfo = $.fn.getTbCols(selectTableId);
    clumList = "";
    for(var i=0; i<arrColsInfo.length; i++) {
        var clumStr = arrColsInfo[i].columnName;
        clumList = clumList + "," + clumStr;
    }
    if(clumList.substr(0,1) == ',') {
        clumList = clumList.substr(1);
    }
    initGrid(arrColsInfo);
    selectTblData(clumList, selectTableId);
}

/**
* @설명: 데이터관리 > 조회조건 얻어서 데이터 가져오기
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 25.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 25. 최초작성
*/
function selectTblData(clumList, selectTableId) {
    var valList = [];
    for(var i=0; i<pkListData.length; i++) {
        var txtStr = toUnderscore(pkListData[i].columnName);
        if($("#"+txtStr).val() != null && $("#"+txtStr).val() != "") {
            valList.push("AND "+pkListData[i].columnName+" = '"+$("#"+txtStr).val()+"'");
            if (txtStr = "oneofEfcScCd") {
            	gOneOff = $("#"+txtStr).val(); 
            }
        }
    }
    if(selectTableId.substr(0,4) != 'S_BE') {
        selectTableId = "S_BE."+selectTableId;
    }
    var reqParam = {
            "tableId": selectTableId,
            "clumList" : clumList,
            "valList" : valList
    }
    $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd321m/selectTblData.do")
    .done(function(data) {
        $("#gridDiv").jsGrid("option", "data", []);
        
        var dataList = data.list;
        // 0건 그리드 메세지 처리부분
        if(dataList == null || dataList.length == 0){
            $.fn.getReturnValue("gridDiv");
        } else {
            $('#gridDiv').jsGrid('loadData', dataList);
        }
    }).fail(function(data){
        console.log("fail to selectTableSchemaInfo");
    });
}

/**
* @설명: 데이터관리 > 조회조건 얻어서 데이터 가져오기
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 25.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 25. 최초작성
*/
function deleteTblData() {
    var valList = [];
    for(var i=0; i<pkListData.length; i++) {
        var txtStr = toUnderscore(pkListData[i].columnName);
        if($("#"+txtStr).val() != null && $("#"+txtStr).val() != "") {
            valList.push("AND "+pkListData[i].columnName+" LIKE '%"+$("#"+txtStr).val()+"%'")
        }
    }
    if(selectTableId.substr(0,4) != 'S_BE') {
        selectTableId = "S_BE."+selectTableId;
    }
    var reqParam = {
            "tableId": selectTableId,
            "clumList" : clumList,
            "valList" : valList
    }
    $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd321m/deleteTblData.do")
    .done(function(data) {
        if(data.result > 0) {
            $.fn.msgBox("삭제가 완료되었습니다.");
            selectTableId = selectTableId.substr(5);
            // 삭제 후 TEXTBOX 리셋
            for(var i=0; i<pkListData.length; i++) {
                var txtStr = toUnderscore(pkListData[i].columnName);
                $("#"+txtStr).val("");
            }
//            selectTableSchemaInfo();
            removeGridData();
        }
    }).fail(function(data){
        console.log("fail to selectTableSchemaInfo");
    });
}
