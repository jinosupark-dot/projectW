/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 갱신율
 * @설명: 갱신율 > 산출적용 화면의 JS
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 7. 23.
 * @최종변경일: 
 * @개정이력: 
 *  박세라 (61000434) 2021. 7. 23. 최초작성
 */
var condAplcBe = [];
var gArrCols = [];
var gTbNm = "TB_IBECRS07";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//직전년도be플래그
var gCondJsBfrYear = "N";
//one-off플래그
var gCondOneoffCheck = "N";
//집계기준구분코드
var gSmupStnd = "01";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");

    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //event 초기화
    initEvent();
    
    // 기본 grid 세팅
    initGridDivBeforeRtf();
    initGridDivAfterRtf();
    initGridDivLastBe();
    initGridDivHidden();
    
    $("#gridDivBeforeRtfHidden").hide();
    $("#gridDivAfterRtfHidden").hide();
    $("#gridDivLastBeHidden").hide();
});

/**
* @설명: 갱신율 > 산출적용 기본 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 23. 최초작성
*/

function initCommCd() {
    
    // 공통코드 조회
    $.fn.loadCommonCode(["RENW_TYP_PRDT_SC_CD","RENW_CYL_SC_CD","ASS_SC_CD"]);

    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","09");
}

function initEvent() {
    //직전년도BE비교
    $("#cbx_comprBe").on("change", function(e){
        if ($('input:checkbox[id="cbx_comprBe"]').is(":checked") == true) {
            gCondJsBfrYear = "Y";
            $("#btn_loadExcel").hide();
            $("#btn_xlsdown").hide();
        } else {
            gCondJsBfrYear = "N";
            $("#btn_loadExcel").show();
            $("#btn_xlsdown").show();
        }
    });
    
    //one-off체크여부
    $("#chk_oneoff_check").on("change", function(e){
        if ($('input:checkbox[id="chk_oneoff_check"]').is(":checked") == true) {
            gCondOneoffCheck = "Y";
        } else {
            gCondOneoffCheck = "N";
        }
    });
    
    // 집계기준 변경이벤트
    $("#sbx_smupStnd").on("change", function(e){
        gSmupStnd = $("#sbx_smupStnd").val();
    });
    
    // 조회
    $('#btn_search').on('click', function(e){
        if (gCondOneoffCheck == 'Y') {
            $("#title_rtfBfc").text("보정전 산출결과(One-off 반영)");
            $("#title_rtfAfc").text("보정후 산출결과(One-off 반영)");
            $("#title_rtfLst").text("최종BE 산출결과(One-off 반영)");
        } else {
            $("#title_rtfBfc").text("보정전 산출결과");
            $("#title_rtfAfc").text("보정후 산출결과");
            $("#title_rtfLst").text("최종BE 산출결과");
        }
        selectRenwRatProdAplcList();
    });
    
    // 보정전 - 엑셀다운로드
    $('#btn_excel_download').on('click', function(e){
        
        if(gCondFlag == "N" || $("#gridDivBeforeRtf").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = $(document).find("title").text()+"_"+$("#sbx_aplcBe").val()+".xlsx";
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivBeforeRtfHidden',
                sheetName : "보정전",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%",
                searchCond: $.fn.getSearchCondSub("PROD")
            },
            {
                id: 'gridDivAfterRtfHidden',
                sheetName : "보정후",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%"
            },
            {
                id: 'gridDivLastBeHidden',
                sheetName : "최종BE적용결과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%"
            },
            {
                id: 'gridDivBeforeRtfHidden',
                sheetName : "보정전(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            },
            {
                id: 'gridDivAfterRtfHidden',
                sheetName : "보정후(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            },
            {
                id: 'gridDivLastBeHidden',
                sheetName : "최종BE적용결과(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            }
        ]);
    });
    
    //최종BE적용결과 - 엑셀다운로드
    $("#btn_xlsdown").on("click", function(e){
        var arrColsInfo = $.fn.getTbCols(gTbNm);
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        if(gCondFlag == "N" || $("#gridDivLastBe").jsGrid("option", "fields").length > 9) {
            $.fn.msgBox("조회 후 다운로드 해주세요.");
            return;
        }
        
        let fileName = "갱신율_산출적용_최종BE적용결과.xlsx";
        $.fn.exportGridExcel({
            id       : 'gridDivLastBeHidden', 
            fileName : fileName
        });
    });
    
    //엑셀업로드 클릭
    $("#btn_loadExcel").on("click", function(e){
        
        //직전년도BE비교 체크
        if(gCondFlag == "N" || $("#gridDivLastBe").jsGrid("option", "fields").length > 9) {
            $.fn.msgBox("조회 후 업로드 해주세요.");
            return;
        }
        //
        if(gArrCols.length == 0) {
            $.fn.msgBox("최종BE 적용결과를 다운로드한 후 엑셀업로드를 해주세요.");
            return;
        }
        
        var paramObj = {};
        
        paramObj.id = "gridDivLastBeHidden";                  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols;
                        data["tbNm"] = gTbNm;
                        data["aplcBe"] = $("#sbx_aplcBe").val();
                        data["smupStnd"] = gSmupStnd;
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveLstBeList.do')
                        .done(function(data) {
                            console.log("갱신율data?", data);
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
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
    
}

/**
* @설명: 갱신율 > 산출적용 기본 그리드 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 23. 최초작성
*/

function settingFields() {
    var selAplcBe = $("#sbx_aplcBe").val();
    var comBe = (selAplcBe.substr(0,4)-1)+"BE";
    
    var fieldList = [];
    var smupStndScCd = {name: "smupStndScCd", title: "집계기준구분코드", css:"cell", type:"text", width:40}
    fieldList.push(smupStndScCd);
    var rldmScCd = {name: "rldmScCd", title: "실손구분코드", css:"cell", type:"text", width:40}
    // 코드 추가되면 살릴부분
/*    var rldmScCd = {name: "rldmScCd", title: "실손구분코드", type:"select", width:0, itemTemplate:function(value, item){
                        if(value == 'ZZ') {
                            return 'TOTAL';
                        } else {
                            return $._commonObj["code"]["RENW_TYP_PRDT_SC_CD"][value-1].codeNm;
                        }
                    }
                }*/
    fieldList.push(rldmScCd);
    var common =  { name: "renwTypPrdtScCd", title:"상품유형", css:"cell", type: "select", width: 40, align:"center",
                        itemTemplate:function(value, item){ // 상품유형, 합계 동시 표시
                            if(value == 'ZZ' && item.rldmScCd == 'ZZ') {
                                return 'TOTAL';
                            } else if(value == 'ZZ' && item.rldmScCd == '01') {
                                return '실손TOTAL';
                            } else if(value == 'ZZ' && item.rldmScCd == '02') {
                                return '실손외TOTAL';
                            } else if (value == null || value == '') {
                                return '';
                            } else {
                                return $._commonObj["code"]["RENW_TYP_PRDT_SC_CD"][value-1].codeNm;
                            }
                        }
                   }
    fieldList.push(common);
    var common2 = { name: "renwCylScCd", title:"갱신주기", css:"cell", type: "select", width: 40, align:"center",
                        itemTemplate:function(value, item){ // 상품유형, 합계 동시 표시
                            if(value == 'ZZ' && item.renwTypPrdtScCd == 'ZZ') {
                                return '';
                            } else if (value == 'ZZ' && item.renwTypPrdtScCd != 'ZZ') {
                                return 'TOTAL'
                            } else if (value == null || value == '') {
                                return '';
                            } else {
                                return $._commonObj["code"]["RENW_CYL_SC_CD"][value-1].codeNm;
                            }
                        }
                    }
    fieldList.push(common2);
    for(var i=1; i<=4; i++) {
        var field = { name: "renwTms"+i, title:selAplcBe+" "+i+"회차", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
        fieldList.push(field);
    }

    if ($('input:checkbox[id="cbx_comprBe"]').is(":checked")) {
        for(var i=1; i<=4; i++) {
            var field = { name: "comprRenwTms"+i, title:comBe+" "+i+"회차", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
            fieldList.push(field);
        }
        for(var i=1; i<=4; i++) {
            var field = { name: "diffRenwTms"+i, title:"difference "+i+"회차", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
            fieldList.push(field);
        }
    } else {
        var field = { name: "total", title:"전체", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
        fieldList.push(field);
    }
    return fieldList;
}

function headerRenderer(type) {
    var $result = $("<tr>").height(0);
    if (type == "hidden") {
        $result.append($("<th>").width(40))
        $result.append($("<th>").width(40))
    }
    for(var i=0; i<6; i++) {
        $result.append($("<th>").width(40))
    }
    if ($('input:checkbox[id="cbx_comprBe"]').is(":checked")) {
        for(var i=0; i<7; i++) {
            $result.append($("<th>").width(40))
        }
    }
    $result.append($("<th>").width(40));
    
    var selAplcBe = $("#sbx_aplcBe").val();
    if (type == 'hidden') {
        $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("집계기준구분코드"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("실손구분코드"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("갱신주기"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text(selAplcBe))
        );
        var $result1 = $("<tr class='jsgrid-header-row'>")
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1회차"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("2회차"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("3회차"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("4+회차"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전체"))
    } else {
        if ($('input:checkbox[id="cbx_comprBe"]').is(":checked") != true) {
            $result = $result.add($("<tr class='jsgrid-header-row'>")
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("갱신주기"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text(selAplcBe))
            );
            var $result1 = $("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1회차"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("2회차"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("3회차"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("4+회차"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전체"))
        } else {
            var comBe = (selAplcBe.substr(0,4)-1)+"BE";
            $result = $result.add($("<tr class='jsgrid-header-row'>")
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("갱신주기"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text(selAplcBe))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text(comBe))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text("difference"))
            );
            var $result1 = $("<tr class='jsgrid-header-row'>")
            for(var i=0; i<3; i++) {
                $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1회차"))
                        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("2회차"))
                        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("3회차"))
                        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("4+회차"))
            }
            ;
        }
    }

    $result = $result.add($result1);
    return $result;
}

function initGridDivBeforeRtf(){

    var fieldList = settingFields();
    var header = headerRenderer();
    
    var gridDivBeforeRtf = new ComJsGrid({
        id: "gridDivBeforeRtf",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        }); 
    
    //그리드 생성
    gridDivBeforeRtf.gridCreate();
    $("#gridDivBeforeRtf").jsGrid("fieldOption", "rldmScCd", "visible", false);
    $("#gridDivBeforeRtf").jsGrid("fieldOption", "smupStndScCd", "visible", false);
}

function initGridDivHidden(){

    var fieldList = settingFields();
    var header = headerRenderer("hidden");
    
    var gridDivBeforeRtfHidden = new ComJsGrid({
        id: "gridDivBeforeRtfHidden",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
    });
    var gridDivAfterRtfHidden = new ComJsGrid({
        id: "gridDivAfterRtfHidden",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
    });
    var gridDivLastBeHidden = new ComJsGrid({
        id: "gridDivLastBeHidden",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
    }); 
    
    //그리드 생성
    gridDivBeforeRtfHidden.gridCreate();
    gridDivAfterRtfHidden.gridCreate();
    gridDivLastBeHidden.gridCreate();
}

function initGridDivAfterRtf(){

    var fieldList = settingFields();
    var header = headerRenderer();
    
    var gridDivAfterRtf = new ComJsGrid({
        id: "gridDivAfterRtf",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        }); 
    
    //그리드 생성
    gridDivAfterRtf.gridCreate();
    $("#gridDivAfterRtf").jsGrid("fieldOption", "rldmScCd", "visible", false);
    $("#gridDivAfterRtf").jsGrid("fieldOption", "smupStndScCd", "visible", false);
}

function initGridDivLastBe(){

    var fieldList = settingFields();
    var header = headerRenderer();
    
    var gridDivRsltBe = new ComJsGrid({
        id: "gridDivLastBe",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        });
    
    //그리드 생성
    gridDivRsltBe.gridCreate();
    $("#gridDivLastBe").jsGrid("fieldOption", "rldmScCd", "visible", false);
    $("#gridDivLastBe").jsGrid("fieldOption", "smupStndScCd", "visible", false);
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
    //적용BE체크
    if(gReqParam.selAplcBe != $('#sbx_aplcBe').val()) {
        return false;
    }
    
    //직전년도BE체크
    if(gReqParam.comprBe != gCondJsBfrYear) {
        return false;
    }
    
    //원오프체크
    if(gReqParam.oneoffCheck != gCondOneoffCheck) {
        return false;
    }
    
    // 집계기준체크
    if(gReqParam.smupStnd != gSmupStnd) {
        return false;
    }
    
    return true;
}

/**
* @설명: 갱신율 > 산출적용 조회시 데이터 얻어오기
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 23. 최초작성
*/
function selectRenwRatProdAplcList(){

    var selAplcBe = $("#sbx_aplcBe").val();
    var comBe = (selAplcBe.substr(0,4)-1)+"BE";

    var rtfBfcOneOff = '01';
    var rtfAfcOneOff = '02';
    if ($('input:checkbox[id="chk_oneoff_check"]').is(":checked") == true) {
        rtfBfcOneOff = '03';
        rtfAfcOneOff = '04';
    }

    // 조회에 필요한 값을 셋팅
    gReqParam = {
                "comprBe" : gCondJsBfrYear,
                "selAplcBe" : selAplcBe,
                "comBe" : comBe,
                "rtfBfcOneOff" : rtfBfcOneOff,
                "rtfAfcOneOff" : rtfAfcOneOff,
                "oneoffCheck" : gCondOneoffCheck,
                "smupStnd" : gSmupStnd
        };

        $.callAjax(gReqParam, "/be/pd/bepd212m/selectRenwRatProdAplcList.do")
        .done(function(data) {
         // 초기화
            $("#gridDivBeforeRtf").jsGrid("reset");
            $("#gridDivBeforeRtf").jsGrid("option", "data", []);
            $("#gridDivAfterRtf").jsGrid("reset");
            $("#gridDivAfterRtf").jsGrid("option", "data", []);
            $("#gridDivLastBe").jsGrid("reset");
            $("#gridDivLastBe").jsGrid("option", "data", []);
            $("#gridDivBeforeRtfHidden").jsGrid("reset");
            $("#gridDivBeforeRtfHidden").jsGrid("option", "data", []);
            $("#gridDivAfterRtfHidden").jsGrid("reset");
            $("#gridDivAfterRtfHidden").jsGrid("option", "data", []);
            $("#gridDivLastBeHidden").jsGrid("reset");
            $("#gridDivLastBeHidden").jsGrid("option", "data", []);
            $("#gridDivBeforeRtf").jsGrid("destroy");
            $("#gridDivAfterRtf").jsGrid("destroy");
            $("#gridDivLastBe").jsGrid("destroy");
            $("#gridDivBeforeRtfHidden").jsGrid("destroy");
            $("#gridDivAfterRtfHidden").jsGrid("destroy");
            $("#gridDivLastBeHidden").jsGrid("destroy");
            initGridDivBeforeRtf();
            initGridDivAfterRtf();
            initGridDivLastBe();
            initGridDivHidden();
            
            // 서버로 받아온 데이터 리스트
            var beforeRtfData = data.beforeRtf;
            var afterRtfData = data.afterRtf;
            var rsltBeData = data.rsltBe;
            
            // 0건 그리드 메세지 처리부분
            if(beforeRtfData==null || beforeRtfData.length==0){
                $.fn.getReturnValue("gridDivBeforeRtf");
            } else {
                $('#gridDivBeforeRtf').jsGrid('reset');
                $('#gridDivBeforeRtfHidden').jsGrid('reset');
                initGridDivBeforeRtf();
                $('#gridDivBeforeRtf').jsGrid('loadData', beforeRtfData);
                $('#gridDivBeforeRtfHidden').jsGrid('loadData', beforeRtfData);
            }
            if(afterRtfData==null || afterRtfData.length==0){
                $.fn.getReturnValue("gridDivAfterRtf");
            } else {
                $('#gridDivAfterRtf').jsGrid('reset');
                $('#gridDivAfterRtfHidden').jsGrid('reset');
                initGridDivAfterRtf();
                $('#gridDivAfterRtf').jsGrid('loadData', afterRtfData);
                $('#gridDivAfterRtfHidden').jsGrid('loadData', afterRtfData);
            }
            if(rsltBeData==null || rsltBeData.length==0){
                $.fn.getReturnValue("gridDivLastBe");
            } else {
                $('#gridDivLastBe').jsGrid('reset');
                $('#gridDivLastBeHidden').jsGrid('reset');
                initGridDivLastBe();
                $('#gridDivLastBe').jsGrid('loadData', rsltBeData);
                $('#gridDivLastBeHidden').jsGrid('loadData', rsltBeData);
            }
            gCondFlag = "Y";
        }).fail(function(data){
            console.log("fail to selectTableSchemaInfo");
        }); 
}