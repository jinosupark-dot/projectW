/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 사업비율 - 기초데이터
 * @설명: 사업비율  - 기초데이터 화면의 JS
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 12.
 * @최종변경일: 
 * @개정이력: 
 *  이현수 2021. 7. 12. 최초작성
 */
//전역변수
var gCondHichyCheck = [];
var gArrCols = [];
var gServiceCode = "02";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//one-off플래그
var gCondOneoffCheck = "N";
var gNewLobCdList;
var gPotflScCdList;
var gChnlScCdList;

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //datepickerSetting세팅
    $.fn.getTbDateInfo(gServiceCode);
    
    // 초기 날짜 세팅
    initSearchData();
    
    // 공통코드 조회(사업비배부그룹, 사업비채널코드, 포트폴리오, 사업비그룹코드, 신규LOB코드)
    $.fn.loadBeCmmnCode(["WRKEX_COCNT_DIST_CHNL_CD", "BE_WRKEX_CHNL_SC_CD", "BE_WRKEX_POTFL_SC_CD", "BE_WRKEX_ITM_CD", "BE_NEW_LOB_CD"]);
    
    //콤보박스 세팅
    initComboBox();

    //event 초기화
    initEvent();
    
    //채널/포트폴리오 기초율(상단) 그리드 초기화 
    initGridTop("", "03");
    
    //채널/포트폴리오 기초율(하단) 그리드 초기화 
    initGridBtm("", "");
    ctlTypSc("");
    ctlGrid("");
    ctlInqrScCond("");
});

/**
 * @설명: 콤보박스 초기화
 * @최초작성자: 이현수
 * @최초작성일: 2021. 8. 3
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 8. 3 최초작성
 */
function initComboBox(inqrSc) {
    var firstOptionText = "";
    
    //사업비배부채널코드, 사업비채널, 신규LOB코드
    $.fn.loadBeCmmnCode(["BE_WRKEX_POTFL_SC_CD","BE_WRKEX_CHNL_SC_CD", "BE_NEW_LOB_CD"]);

    //조회구분:실제사업비(상세)
    if(inqrSc == "03") {
        firstOptionText = "-전체-";
    } else {
        firstOptionText = "-선택-";
    }    
    
    //콤보박스 세팅 - 채널코드 설정
    var newChnlScCdList = [];
    gChnlScCdList = $._commonObj["code"]["BE_WRKEX_CHNL_SC_CD"];
    var tmpChnlScCdList = $._commonObj["code"]["BE_WRKEX_CHNL_SC_CD"];
    for(var i=0; i<tmpChnlScCdList.length-1; i++) {
    	if("ZZ" == tmpChnlScCdList[i]["code"]){
    		tmpChnlScCdList.splice(i, 1);
    	} else {
    		var tmpChnlCd = tmpChnlScCdList[i];
    		var newChnlCd = {
    				"code": tmpChnlCd.code,
    				"codeNm": tmpChnlCd.codeAbbrNm,
    		}
    	}
    	newChnlScCdList.push(newChnlCd);
    }
    $._commonObj.code["BE_WRKEX_CHNL_SC_CD"] = newChnlScCdList;
    
    // 콤보박스 세팅
    $.fn.renderCombobox({
        codeArr: ["BE_WRKEX_CHNL_SC_CD"],
        selArr: ["sbx_beWrkexChnlScCd"],
        firstOptionText: firstOptionText
    });      
    
    //콤보박스 세팅 - 포트폴리오 설정
    var newPotflScCdList = [];
    gPotflScCdList = $._commonObj["code"]["BE_WRKEX_POTFL_SC_CD"];
    var tmpPotflCdList = $._commonObj["code"]["BE_WRKEX_POTFL_SC_CD"];
    
    for(var i=0; i<tmpPotflCdList.length-1; i++) {
    	if("TOTAL" == tmpPotflCdList[i]["code"]){
    		tmpPotflCdList.splice(i, 1);
    	} else {
    		var tmpPotflCd = tmpPotflCdList[i];
    		var newPotflCd = {
    				"code": tmpPotflCd.code,
    				"codeNm": tmpPotflCd.codeAbbrNm,
    		}
    	}
        newPotflScCdList.push(newPotflCd);
    }
    $._commonObj.code["BE_WRKEX_POTFL_SC_CD"] = newPotflScCdList;
    
    // 콤보박스 세팅
    $.fn.renderCombobox({
        codeArr: ["BE_WRKEX_POTFL_SC_CD"],
        selArr: ["sbx_bePotflScCd"],
        firstOptionText: firstOptionText
    });    

    //콤보박스 세팅 - 신규LOB코드
    var newLobCdList = [];
    gNewLobCdList = $._commonObj["code"]["BE_NEW_LOB_CD"];
    var tmpCdList = $._commonObj["code"]["BE_NEW_LOB_CD"];
    for(var i=0; i<tmpCdList.length-1; i++) {
    	if("ZZ" == tmpCdList[i]["code"]){
    		tmpCdList.splice(i, 1);
    	} else {
    		var tmpCd = tmpCdList[i];
    		var newCd = {
    				"code": tmpCd.code,
    				"codeNm": tmpCd.codeAbbrNm,
    		}
    	}
        newLobCdList.push(newCd);
    }
    $._commonObj.code["BE_NEW_LOB_CD"] = newLobCdList;
    
    // 콤보박스 세팅
    $.fn.renderCombobox({
        codeArr: ["BE_NEW_LOB_CD"],
        selArr: ["sbx_newLobCd"],
        firstOptionText: firstOptionText
    });
}

/**
 * @설명: 이벤트 초기화
 * @최초작성자: 이현수
 * @최초작성일: 2021. 8. 3
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 8. 3 최초작성
 */
function initEvent() {
    //시작년월 달력버튼 click
    $("#btn_finYmFrom").on("click", function(e){
        $('#ibx_finYmFrom').datepicker("show");
    });
    
    //죵료년월 달력버튼 click
    $("#btn_finYmTo").on("click", function(e){
        $("#ibx_finYmTo").datepicker("show");
    });
    
    //one-off체크여부
    $("#cbx_oneoff").on("change", function(e){
        if ($('input:checkbox[id="cbx_oneoff"]').is(":checked") == true) {
            gCondOneoffCheck = "Y";
        } else {
            gCondOneoffCheck = "N";
        }
    }); 
    
    // 조회
    $("#btn_search").on("click", function(e){
        selectWrkexRatPryDtList();
    });
    
    // 엑셀다운로드
    $("#btn_excel_download").on("click", function(e) {
        //데이터 체크
        var dataList = $("#gridDivTop").jsGrid("option", "data");
        if(dataList.length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        if(gCondFlag == "N") {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }

        //조회구분 : 기초율
        if($("#sbx_inqrSc").val() == "01") {
            var sbxTxt = "사업비율_기초데이터_" + $("#sbx_typSc option:selected").text() + "_" + 
                            $("#sbx_inqrSc option:selected").text() + "_" + 
                            $("#sbx_beWrkexChnlScCd option:selected").text() + "_" ;
            if($("#sbx_typSc").val() == "01") {
                sbxTxt += $("#sbx_bePotflScCd option:selected").text()
            } else {
                sbxTxt += $("#sbx_newLobCd option:selected").text()
            }
             
            let fileName = sbxTxt + ".xlsx";
            $.fn.exportMultiGridExcel([
                {
                    id: "gridDivCase", 
                    sheetName : "기준값", 
                    fileName: fileName,
                    applyItemTemplate: true,
                    unit: "%",
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: "gridDivTop", 
                    sheetName : "One-off비용 반영 전",
                    fileName: fileName,
                    applyItemTemplate: true,
                    unit: "%, 원",
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: "gridDivBtm",
                    sheetName : "One-off비용 반영 후", 
                    fileName: fileName,
                    applyItemTemplate: true,
                    unit: "%, 원"
                },
                {
                    id: "gridDivCase", 
                    sheetName : "기준값(코드)", 
                    fileName: fileName,
                    applyItemTemplate: false,
                    unit: "%",
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: "gridDivTop", 
                    sheetName : "One-off비용 반영 전(코드)",
                    fileName: fileName,
                    applyItemTemplate: false,
                    unit: "%, 원",
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: "gridDivBtm",
                    sheetName : "One-off비용 반영 후(코드)", 
                    fileName: fileName,
                    applyItemTemplate: false,
                    unit: "%, 원"
                }
            ]);
        } else if ($("#sbx_inqrSc").val() == "03") { //실제사업비(상세)
            var fileName = "사업비율_기초데이터_" + $("#sbx_typSc option:selected").text() + "_" + 
                        $("#sbx_inqrSc option:selected").text() + "_" ;
            
            if($("#sbx_beWrkexChnlScCd").val() == "") {
                fileName += "전체"
            } else {
                fileName += $("#sbx_beWrkexChnlScCd option:selected").text();
            }
            
            if($("#sbx_bePotflScCd").val() == "") {
                fileName += "_전체";
            } else {
                fileName += "_" + $("#sbx_newLobCd option:selected").text()
            }
            
            if ($('input:checkbox[id="cbx_oneoff"]').is(":checked") == true) {
                fileName += "_" + "One-off 포함";
            } 
            
            fileName = fileName + ".xlsx";
            
            $.fn.exportMultiGridExcel([
                {
                    id: "gridDivTop", 
                    sheetName : "일반 사업비배부 현황" , 
                    fileName: fileName,
                    applyItemTemplate: true,
                    unit: "%, 원",
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: "gridDivSubTop", 
                    sheetName : "수수료 사업비 현황" , 
                    fileName: fileName,
                    unit: "%, 원",
                    applyItemTemplate: true
                },
//                {
//                    id: "gridDivFctrCr", 
//                    sheetName : "Factor Creation" , 
//                    fileName: fileName,
//                    unit: "%, 원",
//                    applyItemTemplate: true
//                },
                {
                    id: "gridDivTop", 
                    sheetName : "사업비배부 현황(코드)" , 
                    fileName: fileName,
                    applyItemTemplate: false,
                    unit: "%, 원",
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: "gridDivSubTop", 
                    sheetName : "수수료 사업비 현황(코드)" , 
                    fileName: fileName,
                    unit: "%, 원",
                    applyItemTemplate: false
                }
//                {
//                    id: "gridDivFctrCr", 
//                    sheetName : "Factor Creation(코드)" , 
//                    fileName: fileName,
//                    applyItemTemplate: false,
//                    unit: "%, 원",
//                    searchCond: $.fn.getSearchCond(gReqParam)
//                }
            ]);
        } else if ($("#sbx_inqrSc").val() == "02") { //실제사업비(요약)
            var fileName = "사업비율_기초데이터_" + $("#sbx_typSc option:selected").text() + "_" + 
                            $("#sbx_inqrSc option:selected").text() + "_" ;

            if($("#sbx_beWrkexChnlScCd").val() == "") {
                fileName += "전체"
            } else {
                fileName += $("#sbx_beWrkexChnlScCd option:selected").text();
            }
            
            if ($('input:checkbox[id="cbx_oneoff"]').is(":checked") == true) {
                fileName += "_" + "One-off 포함";
            } 
            
            fileName = fileName + ".xlsx";

            var unit = "%, 원";
            
            if($("#sbx_inqrSc").val() == "04") {
                unit = "원";
            } 
            
            $.fn.exportMultiGridExcel([
                {
                    id: "gridDivTop", 
                    sheetName : $("#titlTop").text().replace(/\s/gi, "").substring(0,30) , 
                    fileName: fileName,
                    applyItemTemplate: true,
                    unit: unit,
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: "gridDivSubTop", 
                    sheetName : "수수료 사업비 현황" , 
                    fileName: fileName,
                    unit: "%, 원",
                    applyItemTemplate: true
                },
                {
                    id: "gridDivTop", 
                    sheetName : $("#titlTop").text().replace(/\s/gi, "").substring(0,20) + "(코드)" , 
                    fileName: fileName,
                    applyItemTemplate: false,
                    unit: unit,
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: "gridDivSubTop", 
                    sheetName : "수수료 사업비 현황(코드)" , 
                    fileName: fileName,
                    unit: "%, 원",
                    applyItemTemplate: false
                }
            ]);
        } else {
            var fileName = "사업비율_기초데이터_" + $("#sbx_typSc option:selected").text() + "_" + 
                        $("#sbx_inqrSc option:selected").text() + "_" ;

            if($("#sbx_beWrkexChnlScCd").val() == "") {
                fileName += "전체"
            } else {
                fileName += $("#sbx_beWrkexChnlScCd option:selected").text();
            }

            fileName = fileName + ".xlsx";
                
             var unit = "%, 원";
                
            if($("#sbx_inqrSc").val() == "04") {
                unit = "원";
            } 
                
            $.fn.exportMultiGridExcel([
                {
                    id: "gridDivTop", 
                    sheetName : $("#titlTop").text().replace(/\s/gi, "").substring(0,30) , 
                    fileName: fileName,
                    applyItemTemplate: true,
                    unit: unit,
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: "gridDivTop", 
                    sheetName : $("#titlTop").text().replace(/\s/gi, "").substring(0,20) + "(코드)" , 
                    fileName: fileName,
                    applyItemTemplate: false,
                    unit: unit,
                    searchCond: $.fn.getSearchCond(gReqParam)
                }
            ]);
        }
    });
    
    //엑셀 일괄 다운로드
    $("#btn_excelBudlDownload").on("click", function(e) {
        selectWrkexRatPryDtWhlList();
        
        $.fn.showLoadingBar();
        setTimeout(function() {
            $.fn.hideLoadingBar();
        }, 9000);
        
    });
    
    //유형구분
    $("#sbx_typSc").on("change", function(e) {
       var typSc = $(this).val();
       ctlTypSc(typSc);
    });
    
    //조회구분
    $("#sbx_inqrSc").on("change", function(e){
        var inqrSc = $(this).val();
        ctlInqrScCond(inqrSc);  //조회구분
    });
    
    //채널유형 
    $("#sbx_beWrkexChnlScCd").on("change", function(e) {
        //실제사업비(상세)
        if($("#sbx_inqrSc").val() == "03") {
            var val = $(this).val();
            if(val == "") {
                $("#sbx_bePotflScCd").attr("disabled", true).val("");
                $("#sbx_newLobCd").attr("disabled", true).val("");
            } else {
                $("#sbx_bePotflScCd").attr("disabled", false).val("");
                $("#sbx_newLobCd").attr("disabled", false).val("");
            }
        }
    });
    
    //양식다운로드 클릭
    $("#btn_exportExcelForm").on("click", function(e){
        //그리드 생성
        var arrColsInfo = $.fn.getTbCols("TB_IBEBDS16");
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        $.fn.exportGridExcel({
            id: "gridTmpDiv", 
            fileName: "사업비율 실제사업비(상세)_업로드양식.xlsx"
        });
    });
    
    //엑셀업로드 클릭-
    $("#btn_loadExcel").on("click", function(e){
        
        if(gArrCols.length == 0) {
            $.fn.msgBox("양식다운로드를 한 후 엑셀업로드를 해주세요.");
            return;
        }
        var paramObj = {};
        
        paramObj.id = "gridTmpDiv";                 //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols;
                        data["tbNm"] = "TB_IBEBDS16";
                        data["menuId"] = $.fn.getMenuId();

                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd131m/saveDtList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                                //SelectInsRIvtContMngInqrList();
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
        var input = e.target;
        var reader = new FileReader();
        //var oTable = this.getView().byId("table");
        
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
            });
            
        };
        reader.readAsArrayBuffer(input.files[0]);
    });
    
    //조회조건 엔터키 조회
    $("#ibx_finYmFrom", "#ibx_finYmTo").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
}

/**
* @설명: 사업비율 jsGrid(기초율:상단) 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initGridCase(){
    var gridObjectCase = new ComJsGrid({
        id: "gridDivCase",
        height: "100",
        width: "25%",
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            var $result = $("<tr>").height(0)
            .append($("<th>"))
            .append($("<th>"));
            //heder 1row
            $result = $result.add($("<tr class='jsgrid-header-row'>")
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("B/R")));
            //heder 2row
            $result = $result.add($("<tr class='jsgrid-header-row'>")
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("NB(%)"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("IF(%)")));
            
            return $result;
        },
        fields : [
            { name: "brNb", title:"B/R NB", css:"cell", type: "text", align:"center"},
            { name: "brIf", title:"B/R IF", css:"cell", type: "text", align:"center"},
            ]
        
    });
    //그리드 생성
    gridObjectCase.gridCreate();
}

/**
* @설명: 사업비율 jsGrid(상단) 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 12.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 12. 최초작성
*/
function initGridTop(potfl, inqrSc){
    var fieldsArr = [];
    var headerRowArr = [];
    var gridObjectTop;
    //그리드 세팅
    ctlGrid(inqrSc);
    //조회구분 : 실제사업비(요약), 실제사업비(상세)
    if(inqrSc == "02" || inqrSc == "03" ) {
        fieldsArr = getGridFieldsRalWrkex(inqrSc);
        
        gridObjectTop = new ComJsGrid({
            id: "gridDivTop",
            height: "670",
            editing: false,
            sorting: true,
            paging: false,
            fields : fieldsArr
        });
        gridObjectSubTop = new ComJsGrid({
            id: "gridDivSubTop",
            height: "300",
            editing: false,
            sorting: true,
            paging: false,
            fields : fieldsArr
        });
        gridObjectSubTop.gridCreate();
    } else {
        fieldsArr = getGridFields(inqrSc);
        headerRowArr = getGridHederRow(potfl, inqrSc);
        
        gridObjectTop = new ComJsGrid({
            id: "gridDivTop",
            height: 520,
            editing: false,
            sorting: true,
            paging: false,
            rowClass: function(item, itemIndex) {
                if(inqrSc == "01" && itemIndex <= 1) {
                    return "sub-total";
                }
            },
            headerRowRenderer: function() {
                return headerRowArr;
            },
            fields : fieldsArr
        });
        //조회구분 : Unit Driver
        if(inqrSc == "04") {
            gridObjectTop.height("670");
        }
    }

    //그리드 생성
    gridObjectTop.gridCreate();
}

/**
* @설명: 사업비율 jsGrid(하단) 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initGridBtm(chnlVal, inqrSc){
    var fieldsArr = getGridFields(inqrSc);
    var headerRowArr = getGridHederRow(chnlVal, inqrSc);
    
    var gridObjectBtm = new ComJsGrid({
        id: "gridDivBtm",
        height: 520,
        editing: false,
        sorting: true,
        paging: false,
        rowClass: function(item, itemIndex) {
            if(inqrSc == "01" && itemIndex <= 1) {
                return "sub-total";
            }
        },
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
        
    });
    //그리드 생성
    gridObjectBtm.gridCreate();
}

/**
* @설명: 사업비율 jsGrid(기초율:상단) 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
//function initGridFctrCr(){
//    var beWrkexItmCdVal = $.fn.getGridCodeItem("BE_WRKEX_ITM_CD");
//    
//    var gridObjectFctrCr = new ComJsGrid({
//        id: "gridDivFctrCr",
//        height: 300,
//        editing: false,
//        sorting: true,
//        paging: false,
//        fields : [
//            { name: "beWrkexItmCd", title:"사업비계정그룹명", css:"cell", type: "select", align:"center", 
//                itemTemplate:function(value, item){
//                    if(value=='0501') {
//                        return 'DI_GA';
//                    } else if(value=='0502') {
//                        return 'DI_SA';
//                    } else if(value=='00') {
//                        return '';
//                    } else {
//                        for(i=0; i<beWrkexItmCdVal.length; i++) {
//                            if(value == beWrkexItmCdVal[i].code) {
//                                return beWrkexItmCdVal[i].codeAbbrNm;
//                            }
//                        }
//                    }
//                }
//            },
//            { name: "wrkexDistStndCdNm", title:"SKF", css:"cell", type: "text", align:"left"},
//            { name: "ralWrkex", title:"SKF 해당 실제사업비", css:"cell", type: "text", align:"right",
//                itemTemplate:function(value, item) {
//                    return $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
//                }
//            },
//            { name: "rto", title:"구성비(%)", css:"cell", type: "text", align:"center"},
//            ]
//        
//    });
//    //그리드 생성
//    gridObjectFctrCr.gridCreate();
//}

/**
* @설명: 사업비율 양식다운로드용 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initGridTmp(){
    var gridObjectTmp = new ComJsGrid({
        id: "gridTmpDiv",
        height: 300,
        editing: false,
        sorting: true,
        paging: false,
        fields : [
            { name: "finYm", title:"마감년월", css:"cell", type: "text", align:"right", },
            { name: "oneoffEfcScCd", title:"ONEOFF효과구분코드", css:"cell", type: "text", align:"right"},
            { name: "potflLobScCd", title:"포트폴리오LOB구분코드", css:"cell", type: "text", align:"right",},
            { name: "beWrkexChnlScCd", title:"사업비계정그룹ID", css:"cell", type: "text", align:"right"},
            { name: "beWrkexItmCd", title:"사업비항목코드", css:"cell", type: "text", align:"right", },
            { name: "beGenSpcAccoScCd", title:"일반특별계정구분코드", css:"cell", type: "text", align:"right"},
            { name: "ralWrkex", title:"실제사업비", css:"cell", type: "text", align:"right"}
            ]
        
    });
    //그리드 생성
    gridObjectTmp.gridCreate();
}
/**
* @설명: 조회시 조건, 현재 조건 체크 
* @최초작성자: 임국빈
* @최초작성일: 2021. 9. 28.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  임국빈 2021. 9. 28. 최초작성
*/
function checkCond() {
    
    //시작년월체크
    if(gReqParam.finYmFrom != $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','')) {
        return false;
    }
    //종료년월체크
    if(gReqParam.finYmTo != $.replaceAll($('#ibx_finYmTo').val().trim(), '-','')) {
        return false;
    }
    if($("#sbx_inqrSc").val() != '01') {
        //원오프체크
        if(gReqParam.oneoffCheck != gCondOneoffCheck) {
            return false;
        }
    } else {
        if(gReqParam.beWrkexChnlScCd != $("#sbx_beWrkexChnlScCd").val()) {
            return false;
        } else if (gReqParam.beWrkexPotflScCd != $("#sbx_bePotflScCd option:selected").val()) {
            return false;
        } else if(gReqParam.inqrSc != $("#sbx_inqrSc").val()) {
            return false;
        }
    }
    return true;
}

/**
 * @설명: 사업비율 기초데이터 조회
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 7 최초작성
 */
function selectWrkexRatPryDtList(){
    //validate 체크
    if(!isValid()) { return; }
    
    var typSc = $("#sbx_typSc").val(); //유형구분
    var inqrSc = $("#sbx_inqrSc").val(); //조회구분
    var beWrkexChnlScCd = $("#sbx_beWrkexChnlScCd").val(); //채널
    var beWrkexChnlScNm = $("#sbx_beWrkexChnlScCd option:selected").text(); //채널명
    var beWrkexPotflScCd = $("#sbx_bePotflScCd option:selected").val(); //포트폴리오 코드
    var newLobCd = $("#sbx_newLobCd option:selected").val(); //상품유형 코드
    var stnrdTrmnEngNm = "";
    var potflLobCdVal = "";
    
    //조회에 필요한 값을 셋팅
    gReqParam.finYmFrom = $("#ibx_finYmFrom").val().replace(/-/g, "");
    gReqParam.finYmTo = $("#ibx_finYmTo").val().replace(/-/g, "");
    //One-off 체크박스
    gReqParam.oneoffChk = gCondOneoffCheck;
    gReqParam.potflLobScCd = typSc; //유형구분
    gReqParam.inqrSc = inqrSc; //조회구분
    gReqParam.beWrkexChnlScCd = beWrkexChnlScCd; //채널
    
    //유형구분: 포트폴리오
    if(typSc == "01") {
        gReqParam.potflLobCdVal = beWrkexPotflScCd;
        stnrdTrmnEngNm = "BE_WRKEX_POTFL_SC_CD";
        potflLobCdVal = beWrkexPotflScCd;
    } else {
        gReqParam.potflLobCdVal = newLobCd;
        stnrdTrmnEngNm = "BE_NEW_LOB_CD";
        if(newLobCd != "") {
            potflLobCdVal =  $("#sbx_newLobCd option:selected").text();
        }
    }
    
    gReqParam.stnrdTrmnEngNm = stnrdTrmnEngNm;
    //그리드 세팅
    ctlGrid(inqrSc);
    
    // 기간계 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd131m/selectWrkexRatPryDtList.do")
    .done(function(data) {
        //타이틀
        if(beWrkexChnlScCd == "") {
            beWrkexChnlScNm = "전체";
            potflLobCdVal = "";
        }
        
        // 그리드 초기화
        resetGrid();
        reDrawGrid(beWrkexPotflScCd, inqrSc);
        initTitle(beWrkexChnlScNm, potflLobCdVal, inqrSc, stnrdTrmnEngNm);
        // 그리드 바인딩
        var topListData = data.topList;
        var subListData = data.subList;

        $("#gridDivTop").jsGrid("loadData", topListData);
        
        if(topListData == null || topListData.length == 0) {
            $.fn.getReturnValue("gridDivTop");
        }
        
        //조회구분: 기초율 활성화
        if(inqrSc == "01") {
            var caseDataList = data.caseDataList
            var btmListData = data.btmList;
            
            $("#gridDivCase").jsGrid("loadData", caseDataList);
            $("#gridDivBtm").jsGrid("loadData", btmListData);

            if($.fn.isEmpty(caseDataList) || caseDataList.length == 0) {
                $.fn.getReturnValue("gridDivCase");
            }
            
            if(btmListData.length == 0) {
                $.fn.getReturnValue("gridDivBtm");
            }
            
          //실제사업비(상세)
        } else if(inqrSc == "03") {
//            var fctrCrList = data.fctrCrList;
//            if($.fn.isEmpty(fctrCrList) || fctrCrList.length == 0) {
//                $.fn.getReturnValue("gridDivFctrCr");
//            } else {
//                $("#gridDivFctrCr").jsGrid("loadData", fctrCrList);
//            }
            if($.fn.isEmpty(subListData) || subListData.length == 0) {
                $.fn.getReturnValue("gridDivSubTop");
            } else {
                $("#gridDivSubTop").jsGrid("loadData", subListData);
            }
        } else if(inqrSc == "02") { // 실제 - 요약
            if($.fn.isEmpty(subListData) || subListData.length == 0) {
                $.fn.getReturnValue("gridDivSubTop");
            } else {
                $("#gridDivSubTop").jsGrid("loadData", subListData);
            }
        }
        
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
    });
}

/**
 * @설명: 초기 조회일자 세팅
 * @최초작성자: 박세라
 * @최초작성일: 2021. 11. 17
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2021. 11. 17 최초작성
 */
function initSearchData() {
    reqParam = {
            "serviceCode" : gServiceCode
    }
    $.callAjax(reqParam, "/be/pd/commonBe/settingFirstDate.do")
    .done(function(data) {
        var tbDateInfo = data.tbDateInfo;
        $('#ibx_finYmFrom').val($.fn.monthFormat(tbDateInfo[0].finStrYm));
        $("#ibx_finYmTo").val($.fn.monthFormat(tbDateInfo[0].finEndYm));
    });
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 7 최초작성
 */
function resetGrid() {
    $("#gridDivCase").jsGrid("reset");
    $("#gridDivCase").jsGrid("option", "data", []);
    $("#gridDivTop").jsGrid("reset");
    $("#gridDivTop").jsGrid("option", "data", []);
    $("#gridDivBtm").jsGrid("reset");
    $("#gridDivBtm").jsGrid("option", "data", []);
    $("#gridDivFctrCr").jsGrid("reset");
    $("#gridDivFctrCr").jsGrid("option", "data", []);
    $("#gridDivSubTop").jsGrid("reset");
    $("#gridDivSubTop").jsGrid("option", "data", []);
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function reDrawGrid(potfl, inqrSc) {
    //그리드 destroy
    $("#gridDivCase").jsGrid("destroy");
    $("#gridDivTop").jsGrid("destroy");
    $("#gridDivBtm").jsGrid("destroy");
    $("#gridDivFctrCr").jsGrid("destroy");
    $("#gridDivSubTop").jsGrid("destroy");
    //그리드 create
    initGridCase();
    initGridTop(potfl, inqrSc);
    initGridBtm(potfl, inqrSc);
    //initGridFctrCr();
}

/**
 * @설명: 그리드 타이틀 변경
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function initTitle(beWrkexChnlScNm, potflVal, inqrSc, stnrdTrmnEngNm) {
    var titleText = beWrkexChnlScNm +  ", " + potflVal;
    
    //실제사업비(상세) 타이틀 변경
    if(inqrSc == "03" && beWrkexChnlScNm == "전체") {
        titleText = beWrkexChnlScNm;
    } else if(inqrSc == "03" && potflVal == "") {
        titleText = beWrkexChnlScNm;
    } else if(inqrSc == "01") {
        var typSc = $("#sbx_typSc").val();
        var potflCodeArr;
        var potflNm = "";
        //포트폴리오
        if(typSc == "01") {
            potflCodeArr  = $.fn.getGridCodeItem(stnrdTrmnEngNm);
            for(i=0; i<potflCodeArr.length; i++) {
                if(potflVal == potflCodeArr[i].code) {
                   potflNm = potflCodeArr[i].codeNm;
                    break;
                }
            }
            
            titleText = titleText + "(" + potflNm + ")";
        //NEW_LOB
        } /*else {
            potflCodeArr = gNewLobCdList;
            for(i=0; i<potflCodeArr.length; i++) {
                if(potflVal == potflCodeArr[i].codeAbbrNm) {
                   potflNm = potflCodeArr[i].codeNm;
                    break;
                }
            }
        }*/
        
        //titleText = titleText + "(" + potflNm + ")";
    }
    
    var oneOffChkNm = "";
    if ($('input:checkbox[id="cbx_oneoff"]').is(":checked") == true) {
        oneOffChkNm = "(One-off 포함)";
    } else {
        oneOffChkNm = "";
    }
    
    switch(inqrSc) {
    case "01" : //기초율
        $("#titlTop").text(titleText + " 기초율(One-off비용 반영 전)");
        $("#titlBtm").text(titleText + " 기초율(One-off비용 반영 후)");
        break;
    case "02" : //실제사업비(요약)
        $("#titlTop").text(beWrkexChnlScNm + " 일반사업비배부 현황" + oneOffChkNm);
        break;
    case "03" : //실제사업비(상세)
        $("#titlTop").text(titleText + " 일반사업비배부 현황" + oneOffChkNm);
        break;
    case "04": //Unit Driver
        $("#titlTop").text(beWrkexChnlScNm + " Unit Driver");
        break;
    default :
        $("#titlTop").text(titleText + " 기초율(One-off비용 반영 전)");
        $("#titlBtm").text(titleText + " 기초율(One-off비용 반영 후)");
    }
}

/**
 * @설명: 유형구분
 * @최초작성자: 이현수
 * @최초작성일: 2021.08.13
 * @최종변경일: 
 * @매개변수: typSc<string> : 유형구분
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 8.13 최초작성
 */
function ctlTypSc(typSc) {
    switch(typSc) {
    //포트폴리오
    case "01" :
        $("#sbx_inqrSc").attr("disabled", false).val("");
        $("#sbx_beWrkexChnlScCd").attr("disabled", true).val("");
        $("#sbx_bePotflScCd").show();
        $("#lbl_bePotflScCd").show();
        $("#sbx_newLobCd").hide();
        $("#lbl_newLobCd").hide();
        $("#cbx_oneoff").attr("checked", false).val("");
        $("#cbx_oneoff").attr("disabled", true).val("");
        $("#cbx_oneoff").hide();
        $("#lbl_oneoff").hide();
        break;
    //NEW LOB
    case "02" :
        $("#sbx_inqrSc").attr("disabled", false).val("");
        $("#sbx_beWrkexChnlScCd").attr("disabled", true).val("");
        $("#sbx_newLobCd").attr("disabled", true).val("");
        $("#sbx_bePotflScCd").hide();
        $("#lbl_bePotflScCd").hide();
        $("#sbx_newLobCd").show();
        $("#lbl_newLobCd").show();
        $("#cbx_oneoff").attr("checked", false).val("");
        $("#cbx_oneoff").attr("disabled", true).val("");
        $("#cbx_oneoff").hide();
        $("#lbl_oneoff").hide();
        break;
    default :
        $("#sbx_inqrSc").attr("disabled", true).val("");
        $("#sbx_beWrkexChnlScCd").attr("disabled", true).val("");
        $("#sbx_bePotflScCd").hide();
        $("#lbl_bePotflScCd").hide();
        $("#sbx_newLobCd").hide();
        $("#lbl_newLobCd").hide();
        $("#cbx_oneoff").attr("checked", false).val("");
        $("#cbx_oneoff").attr("disabled", true).val("");
        $("#cbx_oneoff").hide();
        $("#lbl_oneoff").hide();
        break;
    }
}

/**
 * @설명: 조회구분에 따른 one-off 세팅
 * @최초작성자: 이현수
 * @최초작성일: 2021.08.13
 * @최종변경일: 
 * @매개변수: inqrSc<string> : 조회구분
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 8.13 최초작성
 */
function ctlInqrScCond(inqrSc) {
    switch(inqrSc) {
    case "01" : //기초율
        $("#btn_loadExcel").hide();
        $("#btn_exportExcelForm").hide();
        $("#btn_excelBudlDownload").show();
        $("#cbx_oneoff").attr("checked", false).val("");
        $("#cbx_oneoff").attr("disabled", true).val("");
        $("#cbx_oneoff").hide();
        $("#lbl_oneoff").hide();
        $("#subTitle").hide();
        $("#gridDivSubTop").hide();
        $("#sbx_beWrkexChnlScCd").attr("disabled", false).val("");
        $("#sbx_bePotflScCd").attr("disabled", false).val("");
        $("#sbx_newLobCd").attr("disabled", false).val("");
        initComboBox(inqrSc);
        break;
    case "02" : //실제사업비(요약)
        $("#btn_loadExcel").hide();
        $("#btn_exportExcelForm").hide();
        $("#btn_excelBudlDownload").hide();
        $("#cbx_oneoff").attr("disabled", false).val("");
        $("#cbx_oneoff").show();
        $("#lbl_oneoff").show();
        $("#subTitle").show();
        $("#gridDivSubTop").show();
        $("#sbx_beWrkexChnlScCd").attr("disabled", false).val("");
        $("#sbx_bePotflScCd").attr("disabled", true).val("");
        $("#sbx_newLobCd").attr("disabled", true).val("");
        initComboBox(inqrSc);
        break;
    case "03" : //실제사업비(상세)
        $("#btn_loadExcel").show();
        $("#btn_exportExcelForm").show();
        $("#btn_excelBudlDownload").hide();
        $("#cbx_oneoff").attr("disabled", false).val("");
        $("#cbx_oneoff").show();
        $("#lbl_oneoff").show();
        $("#subTitle").show();
        $("#gridDivSubTop").show();
        $("#sbx_beWrkexChnlScCd").attr("disabled", false).val("");
        $("#sbx_bePotflScCd").attr("disabled", true).val("");
        $("#sbx_newLobCd").attr("disabled", true).val("");
        initComboBox(inqrSc);
        break;
    case "04": //Unit Driver
        $("#btn_loadExcel").hide();
        $("#btn_exportExcelForm").hide();
        $("#btn_excelBudlDownload").hide();
        $("#cbx_oneoff").attr("checked", false).val("");
        $("#cbx_oneoff").attr("disabled", true).val("");
        $("#cbx_oneoff").hide();
        $("#lbl_oneoff").hide();
        $("#subTitle").hide();
        $("#gridDivSubTop").hide();
        $("#sbx_beWrkexChnlScCd").attr("disabled", false).val("");
        $("#sbx_bePotflScCd").attr("disabled", true).val("");
        $("#sbx_newLobCd").attr("disabled", true).val("");
        initComboBox(inqrSc);
        break;
    default :
        $("#btn_loadExcel").hide();
        $("#btn_excelBudlDownload").hide();
        $("#btn_exportExcelForm").hide();
        $("#cbx_oneoff").attr("checked", false).val("");
        $("#cbx_oneoff").attr("disabled", true).val("");
        $("#cbx_oneoff").hide();
        $("#lbl_oneoff").hide();
        $("#cbx_oneoff > label").hide();
        $("#subTitle").hide();
        $("#gridDivSubTop").hide();
        $("#sbx_beWrkexChnlScCd").attr("disabled", true).val("");
        $("#sbx_bePotflScCd").attr("disabled", true).val("");
        $("#sbx_newLobCd").attr("disabled", true).val("");
        initComboBox(inqrSc);
    }
}

/**
 * @설명: 조회구분에 따른 Grid 세팅
 * @최초작성자: 이현수
 * @최초작성일: 2021.08.13
 * @최종변경일: 
 * @매개변수: inqrSc<string> : 조회구분
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 8.13 최초작성
 */
function ctlGrid(inqrSc) {
    switch(inqrSc) {
    case "01" : //기초율
        $("#gridDivCase").show();
        $("#titlBtm").show();
        $("#gridDivBtm").show();
        $("#titlFctrCr").hide();
        $("#gridDivFctrCr").hide();
        break;
    case "03" : //실제사업비(상세)
        $("#gridDivCase").hide();
        $("#titlBtm").hide();
        $("#gridDivBtm").hide();
        $("#titlFctrCr").show();
        $("#gridDivFctrCr").show();
        break;
    default :
        $("#gridDivCase").hide();
        $("#titlBtm").hide();
        $("#gridDivBtm").hide();
        $("#titlFctrCr").hide();
        $("#gridDivFctrCr").hide();
        break;
    }
}
/**
 * @설명: validation 체크
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: boolean
 * @개정이력: 
 *  이현수 2021. 7. 28 최초작성
 */
function isValid() {
    var $finYmFrom = $("#ibx_finYmFrom");            //시작년월
    var $finYmTo = $("#ibx_finYmTo");                //종료년월
    var $beWrkexChnlScCd = $("#sbx_beWrkexChnlScCd");  //채널
    var $bePotflScCd = $("#sbx_bePotflScCd");        //포트폴리오
    var $inqrSc = $("#sbx_inqrSc");                   //조회구분
    var $typSc = $("#sbx_typSc"); //유형구분
    var $newLobCd = $("#sbx_newLobCd"); //상품유형
    //시작년월,종료년월 체크
    if($.fn.isEmpty($finYmFrom.val())) {
        $.fn.msgBox("시작년월은 필수입력항목입니다.", function() {
            $finYmFrom.focus();
        });
        return false;
    }
    if($.fn.isEmpty($finYmTo.val())) {
        $.fn.msgBox("종료년월은 필수입력항목입니다.", function() {
            $finYmTo.focus();
        });
        return false;
    }
    if($finYmFrom.val() > $finYmTo.val()) {
        $.fn.msgBox("시작년월이 종료년월보다 클수 없습니다.");
        return false;
    }
    
    //유형구분 체크
    if($.fn.isEmpty($typSc.val())) {
        $.fn.msgBox("유형구분는 필수입력항목입니다.", function() {
            $typSc.focus();
        });
        return false;
    }
    
    //조회구분 체크
    if($.fn.isEmpty($inqrSc.val())) {
        $.fn.msgBox("조회구분는 필수입력항목입니다.", function() {
            $inqrSc.focus();
        });
        return false;
    }
    
    if($inqrSc.val() != "03") { //실제사업비(상세) 외
        if($.fn.isEmpty($beWrkexChnlScCd.val())) {
            $.fn.msgBox("채널은 필수입력항목입니다.", function() {
                $beWrkexChnlScCd.focus();
            });
            return false;
        }
    }
    //포트폴리오
    if($typSc.val() == "01") {
        if($inqrSc.val() == "01") {
            //포트폴리오 체크
              if($.fn.isEmpty($bePotflScCd.val())) {
                  $.fn.msgBox("포트폴리오는 필수입력항목입니다.", function() {
                      $bePotflScCd.focus();
                  });
                  return false;
              }
          }
    } else {
        if($inqrSc.val() == "01") {
            //포트폴리오 체크
              if($.fn.isEmpty($newLobCd.val())) {
                  $.fn.msgBox("상품유형 필수입력항목입니다.", function() {
                      $newLobCd.focus();
                  });
                  return false;
              }
          }
    }

    return true;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수: String: 구분자
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 28 최초작성
 */
function getGridFields(inqrSc) {
    //그리드 필드 배열
    var resultArr = [];
    var beWrkexItmCdVal = $.fn.getGridCodeItem("BE_WRKEX_ITM_CD");
    var beWrkexChnlScCdVal = $.fn.getGridCodeItem("BE_WRKEX_CHNL_SC_CD");
    var beNewLobCdVal = $.fn.getGridCodeItem("BE_NEW_LOB_CD");

    var finYm = {name:"beWrkexChnlScCd", title:"채널", css:"cell", type: "text", width:80, align:"center",
            itemTemplate:function(value, item){
                for(i=0; i<beWrkexChnlScCdVal.length; i++) {
                    if(value == beWrkexChnlScCdVal[i].code) {
                        return beWrkexChnlScCdVal[i].codeAbbrNm;
                    } 
                }
            }
    };
    var beWrkexPotflScCd = {name:"potflLobCdVal", title:"포트폴리오명", css:"cell", type: "text", width:170, align:"center"};
    
    var newLobCd = { name:"potflLobCdVal", title:"상품유형", css:"cell", type: "select", width: 170, align:"center", 
            itemTemplate:function(value, item) {
                var textField = "TOTAL";
                for(i=0; i<beNewLobCdVal.length; i++) {
                    if(value == beNewLobCdVal[i].code) {
                        textField = beNewLobCdVal[i].codeNm;
                        break;
                    }
                }
                return textField;
            }
    };
    
    var beWrkexItmCd = {name:"beWrkexItmCd", title:"Expense", css:"sub-total", type: "select", width:140, align:"left",
        itemTemplate:function(value, item){
            if(value=='0501') {
                return 'DI_GA';
            } else if(value=='0502') {
                return 'DI_SA';
            } else if(value=='00') {
                return '';
            } else {
                for(i=0; i<beWrkexItmCdVal.length; i++) {
                    if(value == beWrkexItmCdVal[i].code) {
                        return beWrkexItmCdVal[i].codeAbbrNm;
                    } 
                }
            }
        }
    };
    
    var ralWrkex = {name:"ralWrkex03", title:"Unit Driver Total", css:"sub-total", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                
                if(item.beWrkexItmCd != "00") {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } else {
                    value = "";
                }
                
                return value;
            }
    };
    // TODO :: Expense 3개로 나눠지면서 추가분 발생
    var ralWrkex2 = {name:"ralWrkex01", title:"Unit Driver Single", css:"sub-total", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
            	value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                return value;
            }
    };
    var ralWrkex3 = {name:"ralWrkex02", title:"Unit Driver Regular", css:"sub-total", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
            	value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                return value;
            }
    };
    
    var anpS = { name:"anpS", title:"ANP Single", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                var beWrkexItmCd = item.beWrkexItmCd;
                
                if(value == "9999999999") {
                    value = "E";
                } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                    value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
                } 
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                return value;
            }
    };
    
    var anpN = { name:"anpN", title:"ANP Regular", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                var beWrkexItmCd = item.beWrkexItmCd;
                
                if(value == "9999999999") {
                    value = "E";
                } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                    value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
                } 
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } 
                
                return value;
            }
    };
    
    var pniB = { name:"pniB", title:"PNB Base", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                
                if(value == "9999999999") {
                    value = "E";
                } else if(value % 1 == 0) {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } 
                
                return value;
            }
    };
    
    var pniR = { name:"pniR", title:"PNB Rider", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                
                if(value == "9999999999") {
                    value = "E";
                } else if(value % 1 == 0) {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } 
                return value;
            }
    };
    
    var gwpS = { name:"gwpS", title:"GWP Single", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                var beWrkexItmCd = item.beWrkexItmCd;
                
                if(value == "9999999999") {
                    value = "E";
                } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } else if(beWrkexItmCd == "03" || beWrkexItmCd == "09" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                    value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
                }
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                
                return value;
            }
    };
    
    var gwpN = { name:"gwpN", title:"GWP Regular", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                var beWrkexItmCd = item.beWrkexItmCd;
                
                if(value == "9999999999") {
                    value = "E";
                } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } else if(beWrkexItmCd == "03" || beWrkexItmCd == "09" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                    value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
                }
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } 
                return value;
            }
    };
    
    var pifB = { name:"pifB", title:"PIF Base", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                
                if(value  == "9999999999") {
                    value = "E";
                } else if(value % 1 == 0) {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                
                return value;
            }
    };
    
    var pifR = { name:"pifR", title:"PIF Rider", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                
                if(value == "9999999999") {
                    value = "E";
                } else if(value % 1 == 0) {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                
                return value;
            }
    };
    
    var claimA = { name:"claimA", title:"CLAIM Amount", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                var beWrkexItmCd = item.beWrkexItmCd;
                
                if(value == "9999999999") {
                    value = "E";
                } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } else if(beWrkexItmCd == "04" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                    value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
                }
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } 
                
                return value;
            }
    };
    
    var csvS = { name:"csvS", title:"CSV Single", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                var beWrkexItmCd = item.beWrkexItmCd;
                
                if(value == "9999999999") {
                    value = "E";
                } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                    value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                } else if(beWrkexItmCd == "0501" || beWrkexItmCd == "0502" || beWrkexItmCd == "08" 
                    || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                    value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
                }
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } 
                
                return value;
            }
    };
    
    var csvN = { name:"csvN", title:"CSV Regular", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                var beWrkexItmCd = item.beWrkexItmCd;
                
                if(value == "9999999999") {
                    value = "E";
                } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } else if(beWrkexItmCd == "0501" || beWrkexItmCd == "0502" || beWrkexItmCd == "08" 
                    || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                    value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
                }
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                
                return value;
            }
    };
    
    var bpl = { name:"bpl", title:"BPL", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                var beWrkexItmCd = item.beWrkexItmCd;
                
                if(value  == "9999999999") {
                    value = "E";
                } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } else if(beWrkexItmCd == "06" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                    value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
                }
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                
                return value;
            }
    };
    
    var pricingA = { name:"pricingA", title:"Pricing Alpha", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                var beWrkexItmCd = item.beWrkexItmCd;
                
                if(value == "9999999999") {
                    value = "E";
                } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                    value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
                }
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                
                return value;
            }
    };
    
    var pricingB = { name:"pricingB", title:"Pricing Beta+Gamma", css:"cell", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                var beWrkexItmCd = item.beWrkexItmCd;
                
                if(value == "9999999998" && beWrkexItmCd == "02") {
                    value = "S";
                } else if(value == "9999999998" && beWrkexItmCd == "03") {
                    value = "S";
                } else if(value == "9999999999" && beWrkexItmCd == "07") {
                    value = "E";
                } else if(value == "9999999999" && beWrkexItmCd == "09") {
                    value = "E";
                } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                } else if(beWrkexItmCd == "03" || beWrkexItmCd == "07" || beWrkexItmCd == "09" || 
                        beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                    value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
                }
                
                if(inqrSc == '04') {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                }
                
                return value;
            }
    };
    
    //기초율
    if(inqrSc == "01") {
        resultArr = [beWrkexItmCd, ralWrkex2, ralWrkex3, ralWrkex, anpS, anpN, pniB, pniR, gwpS, gwpN, pifB, pifR, claimA, csvS, csvN, bpl, pricingA, pricingB ];
    } else {
        var typSc = $("#sbx_typSc").val();
        //포트폴리오
        if(typSc == "01") {
            resultArr = [finYm, beWrkexPotflScCd, anpS, anpN, pniB, pniR, gwpS, gwpN, pifB, pifR, claimA, csvS, csvN, bpl, pricingA, pricingB];
        //상품유형
        } else {
            resultArr = [finYm, newLobCd, anpS, anpN, pniB, pniR, gwpS, gwpN, pifB, pifR, claimA, csvS, csvN, bpl, pricingA, pricingB];
        }
        
    }
        
    return resultArr;
}

/**
 * @설명: 그리드 필드 세팅_실제사업비(상세/요약)
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 28 최초작성
 */
function getGridFieldsRalWrkex(inqrSc) {
    var resultArr = [];
    var newLobCdArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
    //실제사업비(상세)
    var chnl = { name:"beWrkexChnlScCd", title:"채널", css:"cell", type: "select", width: 30, align:"center",
            items: $.fn.getGridCodeItem("BE_WRKEX_CHNL_SC_CD"), textField: "codeAbbrNm", valueField: "code"
    };
    //실제사업비(요약)
    var potfl = { name:"potflLobCdVal", title: "포트폴리오명", css:"cell", type: "text", width: 110, align:"center"};
    var newLob = { name:"potflLobCdVal", title:"상품유형", css:"cell", type: "select", width: 110, align:"center",
            itemTemplate:function(value, item) {
                var textField = "TOTAL";
                for(i=0; i<newLobCdArr.length; i++) {
                    if(value == newLobCdArr[i].code) {
                        textField = newLobCdArr[i].codeNm;
                        break;
                    }
                }
                return textField;
            }
    };
    var wrkexAccoGrpNm = { name:"wrkexAccoGrpNm", title:"사업비계정그룹명", css:"cell", type: "text", width: 150, align:"left"};
    var total = { name: "total", title:"CoA group Sum", css:"cell", type: "text", align:"right",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
            }
    }
    //실제사업비(요약)
    if(inqrSc == "02") {
        var typSc = $("#sbx_typSc").val();
        //포트폴리오
        if(typSc == "01") {
            resultArr = [potfl];
        } else {
            resultArr = [newLob];
        }
    //실제사업비(상세)
    } else {
        resultArr = [chnl, wrkexAccoGrpNm];
    }
    //사업비배부현황
    var codeArr = ["DA_P", "DA_N", "DM", "DC", "DI-GA", "DI-SA", "DP", "IM","II", "IO"];
    for(var i=1; i<=codeArr.length; i++) {
        var l = i-1;
        var field = { name: "beWrkexItmCd"+i, title: codeArr[l], css:"cell", type: "text", align:"right", 
                itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                }
        }
        resultArr.push(field);
    }
    //실제사업비(요약)_합계
    var smTot = { name: "smTot", title:"합계", css:"cell", type: "text", align:"right",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
            }
    }
    //실제사업비(요약)_점유율
    var possRto = { name: "possRto", title:"점유율", css:"cell", type: "text", align:"right",
        itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
        }
    }
    //실제사업비(요약)
    if(inqrSc == "02") {
        resultArr.push(smTot);
        resultArr.push(possRto);
    } else {
        resultArr.push(total);
    }
    
    return resultArr;
}

/**
 * @설명: 그리드 헤더 세팅
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 28 최초작성
 */
function getGridHederRow(potfl, inqrSc) {
    var $result = $("<tr>").height(0);
    
    //조회구분:기초율
    if(inqrSc == "01") {
        $result.append($("<th>").width(140))
        $result.append($("<th>").width(140))
        for(var i=0; i<16; i++) {
            $result.append($("<th>").width(140))
        }
    } else {
        $result.append($("<th>").width(80)).append($("<th>").width(170));
        for(var i=0; i<14; i++) { //16
            $result.append($("<th>").width(140))
        }
    }

    //header 1row
    var $result1 = $("<tr class='jsgrid-header-row'>");
    var rows = 1;
    var titlTxt = "포트폴리오명";
    
    if($("#sbx_typSc").val() == "02") {
        titlTxt = "상품유형"
    } 
        
    
    //조회기준: 기초율
    if(inqrSc == "01") {
        $result1 = $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text(potfl))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("Expense"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 15).text("Unit Driver"))
        
        // header 2row
        var $result2 = $("<tr class='jsgrid-header-row'>")
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("Single"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("Regular"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("TOTAL"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("ANP (% of)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("PNB (per policy)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("GWP (% of)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("PIF (per policy)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 1).text("CLAIM (% of)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("CSV (% of)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("BPL (% of)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("Pricing (% of)"))
    } else {
        rows = 2; //BPL rowspan 계산
        $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("채널"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text(titlTxt));
    }
    
    $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("ANP"))
    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("PNB"))
    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("GWP"))
    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("PIF"))
    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 1).text("CLAIM"))
    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("CSV"))
    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", rows).text("BPL"))
    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("Pricing"))
    
    // header 3row
    var $result3 = $("<tr class='jsgrid-header-row'>")
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Single"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Regular"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Base"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Rider"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Single"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Regular"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Base"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Rider"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Amount"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Single"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Regular"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Alpha"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Beta+Gamma"));
    
    $result = $result.add($result1);
    if(inqrSc == "01") {
        $result = $result.add($result2);
    }
    
    $result = $result.add($result3);
    
    return $result;
}

/**
 * @설명: 엑셀일괄다운로드 action 세팅
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 28 최초작성
 */
function excelBudlDown(vAction, vParams) {
    //action 정보 세팅
    var vForm = document.createElement("FORM");
    vForm.action = vAction;
    vForm.method = "POST";
    
    //데이터 세팅
    appendMakeInput(vForm, "jsonStr", vParams);
    
    window.document.body.appendChild(vForm);
    
    vForm.submit();
}

/**
 * @설명: 엑셀일괄다운로드 input hidden 객체 생성
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 28 최초작성
 */
function appendMakeInput(obj, nm, val) {
    var vInput = document.createElement("INPUT");
    vInput.type = "hidden";
    vInput.name = nm;
    vInput.value = val;
    
    obj.appendChild(vInput);
}

/**
 * @설명: 엑셀 일괄 다운로드 조회
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 7 최초작성
 */
function selectWrkexRatPryDtWhlList(){
    //validate 체크
    var typSc = $("#sbx_typSc").val();
    //유형구분 체크
    if($.fn.isEmpty(typSc)) {
        $.fn.msgBox("유형구분는 필수입력항목입니다.", function() {
            $typSc.focus();
        });
        return false;
    }
    
    //조회에 필요한 값을 셋팅
    var reqParam = {};
    reqParam.finYmFrom = $("#ibx_finYmFrom").val().replace(/-/g, "");
    reqParam.finYmTo = $("#ibx_finYmTo").val().replace(/-/g, "");
    
    //One-off 체크박스
    var oneoffChk = "N";
    if ($('input:checkbox[id="cbx_oneoff"]').is(":checked") == true) {
        oneoffChk = "Y";
    } else {
        oneoffChk = "N";
    }
    reqParam.oneoffChk = oneoffChk;
    reqParam.beWrkexChnlScCdArr = $.fn.getGridCodeItem("BE_WRKEX_CHNL_SC_CD"); //채널 리스트
    reqParam.potflLobScCd = typSc; //유형구분
    //포트폴리오 
    if(typSc == "01") {
        reqParam.potflLobCdVal = $.fn.getGridCodeItem("BE_WRKEX_POTFL_SC_CD"); //포트폴리오 코드 리스트
        reqParam.excelFileNm = "사업비율_채널별_포트폴리오별_기초율";
    //상품유형
    } else {
        reqParam.potflLobCdVal = $.fn.getGridCodeItem("NEW_LOB_CD"); //NEWLOB 코드 리스트
        reqParam.excelFileNm = "사업비율_채널별_상품유형별_기초율";
    }
    
    var vAction = "/be/pd/bepd131m/selectWrkexRatPryDtExcelBndlDwnlList.do";
    var vParams = JSON.stringify(reqParam);
    
    excelBudlDown(vAction, vParams);

}