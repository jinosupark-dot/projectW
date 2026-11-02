/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 연금선택율
 * @설명: 연금선택율 > 산출적용 화면의 JS
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 7. 22.
 * @최종변경일: 2022. 5.  3.
 * @개정이력: 
 *  박세라 (61000434) 2021. 7. 22. 최초작성
 *  서승호 (89000364) 2022. 5. 03. 공통표기 로직 수정 
 */
var condAplcBe = [];
var gArrCols = [];
var gTbNm = "TB_IBECRS05";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//직전년도be플래그
var gCondJsBfrYear = "N";
//one-off플래그
var gCondOneoffCheck = "N";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //버튼 권한 처리 2021.06.14
//    $.fn.setBtnPermission([{"btnId":"#btn_exportExcel","type":"A"}])
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //event 초기화
    initEvent();
    
    // 기본 grid 세팅
    initGridDivBeforeRtf();
    initGridDivLastBe();

});

/**
* @설명: 연금선택율 > 산출적용 기본 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 22.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 22. 최초작성
*/
function initCommCd() {
    
    // 공통코드 조회
    $.fn.loadCommonCode(["BE_NEW_LOB_CD","BE_ANUT_PYM_MTH_CD"]);

    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","06");
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
    
    // 조회
    $('#btn_search').on('click', function(e){
        if (gCondOneoffCheck == 'Y') {
            $("#title1").text("산출결과(One-off 반영)");
            $("#title2").text("최종 BE 적용 결과(One-off 반영)");
        } else {
            $("#title1").text("산출결과");
            $("#title2").text("최종 BE 적용 결과");
        }
        
        selectAnutSlctRatProdAplcList();
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
                    id: 'gridDivBeforeRtf',
                    sheetName : "보정전",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "%",
                    searchCond: $.fn.getSearchCondSub("PROD")
                },
                {
                    id: 'gridDivLastBe',
                    sheetName : "최종BE적용",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "%"
                },
                {
                    id: 'gridDivBeforeRtf',
                    sheetName : "보정전(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "%"
                },
                {
                    id: 'gridDivLastBe',
                    sheetName : "최종BE적용(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "%"
                }
        ]);

    });

    
    // 최종BE - 엑셀다운로드
    $('#btn_xlsdown').on('click', function(e){
        //직전년도BE비교 체크
        if($("#gridDivLastBe").jsGrid("option", "fields").length > 7) {
            $.fn.msgBox("조회 후 다운로드 해주세요.");
            return;
        }
        
        var arrColsInfo = $.fn.getTbCols(gTbNm);
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
         var fileName = "연금선택율_산출적용_최종BE적용결과"+".xlsx";
         $.fn.exportMultiGridExcel([
             {
                 id: 'gridDivLastBe',
                 fileName: fileName
             }
         ]);
    });
    
    //엑셀업로드 클릭
    $("#btn_loadExcel").on("click", function(e){
        
        //직전년도BE비교 체크
        if($("#gridDivLastBe").jsGrid("option", "fields").length > 7) {
            $.fn.msgBox("조회 후 업로드 해주세요.");
            return;
        }
        //
        if(gArrCols.length == 0) {
            $.fn.msgBox("최종BE 적용결과를 다운로드한 후 엑셀업로드를 해주세요.");
            return;
        }
        
        var paramObj = {};
        
        paramObj.id = "gridDivLastBe";                  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols;
                        data["tbNm"] = gTbNm;
                        data["aplcBe"] = $("#sbx_aplcBe").val();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd172m/saveAnutLstBeList.do')
                        .done(function(data) {
                            console.log(data);
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
* @설명: 연금선택율 > 산출적용 기본 그리드 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 22.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 22. 최초작성
*/
function settingFields() {
    var selAplcBe = $("#sbx_aplcBe").val()+" ";
    var comBe = (selAplcBe.substr(0,4)-1)+"BE ";
    
    var newLobCdArr = $.fn.getGridCodeItem('NEW_LOB_CD');
    
    var fieldList = [
        { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 40, align:"center", itemTemplate:function(value, item) {
        	var codeArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
            for(i=0; i<codeArr.length; i++) {
                if(value == codeArr[i].code) {
                    return codeArr[i].codeAbbrNm;
                }
            }    
        }},
        { name: "beAnutPymMthCd", title:"연금지급방법", css:"cell", type: "select", width: 40, align:"left", itemTemplate:function(value, item) {
                //TOTAL 항목 표시 및 NULL처리
                if(value=='ZZ') {
                    if(item.beNewLobCd == 'ZZ') {
                        return ""
                    }
                    return 'TOTAL';
                } else if(value=='' || value==null) {
                    return null;
                } else {
                	var codeArr = $.fn.getGridCodeItem("BE_ANUT_PYM_MTH_CD");
                    for(i=0; i<codeArr.length; i++) {
                        if(value == codeArr[i].code) {
                            return codeArr[i].codeAbbrNm;
                        }
                    }
                }
            }
        },
        { name: "wholeLife", title:selAplcBe+"종신", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}},
        { name: "establish", title:selAplcBe+"확정", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}},
        { name: "inheritance", title:selAplcBe+"상속", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}},
    ];

    if ($('input:checkbox[id="cbx_comprBe"]').is(":checked") == true) {
        var wholeLife = { name: "comprWholeLife", title:comBe+"종신", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
        var establish = { name: "comprEstablish", title:comBe+"확정", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
        var inheritance = { name: "comprInheritance", title:comBe+"상속", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
        var wholeLife2 = { name: "diffWholeLife", title:"diff 종신", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
        var establish2 = { name: "diffEstablish", title:"diff 확정", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
        var inheritance2 = { name: "diffInheritance", title:"diff 상속", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}

        fieldList.push(wholeLife);
        fieldList.push(establish);
        fieldList.push(inheritance);
        fieldList.push(wholeLife2);
        fieldList.push(establish2);
        fieldList.push(inheritance2);
    } else {
        var last = { name: "total", title:"전체", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
        fieldList.push(last);
    }
    
    return fieldList;
}

function headerRenderer() {
    var $result = $("<tr>").height(0);
    for(var i=0; i<5; i++) {
        $result.append($("<th>").width(40))
    }
    if ($('input:checkbox[id="cbx_comprBe"]').is(":checked") == true) {
        for(var i=0; i<5; i++) {
            $result.append($("<th>").width(40))
        }
    }
    $result.append($("<th>").width(40));
    
    var selAplcBe = $("#sbx_aplcBe").val();
    if ($('input:checkbox[id="cbx_comprBe"]').is(":checked") != true) {
        $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("연금지급방법"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text(selAplcBe))
        );
        var $result1 = $("<tr class='jsgrid-header-row'>")
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("종신"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("확정"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("상속"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전체"));
    } else {
        var comBe = (selAplcBe.substr(0,4)-1)+"BE";
        $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("연금지급방법"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text(selAplcBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text(comBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("difference"))
        );
        var $result1 = $("<tr class='jsgrid-header-row'>")
        for(var i=0; i<3; i++) {
            $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("종신"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("확정"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("상속"))
        }
        ;
    }
    
    $result = $result.add($result1);
    return $result;
}

function initGridDivBeforeRtf(){

    var fieldList = settingFields();
    var header = headerRenderer();
    
    var gridDivBeforeRtf = new ComJsGrid({
        id: "gridDivBeforeRtf",
        height: 250,
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
}

function initGridDivLastBe(){

    var fieldList = settingFields();
    var header = headerRenderer();
    
    var gridDivLastBe = new ComJsGrid({
        id: "gridDivLastBe",
        height: 250,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        });
    
    //그리드 생성
    gridDivLastBe.gridCreate();
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
    return true;
}

/**
* @설명: 연금선택율 > 산출적용 조회시 데이터 얻어오기
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 22.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 22. 최초작성
*/
function selectAnutSlctRatProdAplcList(){

    var selAplcBe = $("#sbx_aplcBe").val();
    var comBe = (selAplcBe.substr(0,4)-1)+"BE";

    var rtfBfcOneOff = '01';
    if ($('input:checkbox[id="chk_oneoff_check"]').is(":checked") == true) {
        rtfBfcOneOff = '03';
    }

    // 조회에 필요한 값을 셋팅
   gReqParam = {
               "comprBe" : gCondJsBfrYear,
               "selAplcBe" : selAplcBe,
               "comBe" : comBe,
               "rtfBfcOneOff" : rtfBfcOneOff,
               "oneoffCheck" : gCondOneoffCheck,
               "comprBe" : gCondJsBfrYear
        };
        $.callAjax(gReqParam, "/be/pd/bepd172m/selectAnutSlctRatProdAplcList.do")
        .done(function(data) {
            // 서버로 받아온 데이터 리스트
            var beforeRtfData = data.beforeRtf;
            var rsltBeData = data.rsltBe;
            
            $('#gridDivBeforeRtf').jsGrid('reset');
            $("#gridDivBeforeRtf").jsGrid("option", "data", []);
            $('#gridDivBeforeRtf').jsGrid('destroy');
            initGridDivBeforeRtf();
            $('#gridDivLastBe').jsGrid('reset');
            $("#gridDivLastBe").jsGrid("option", "data", []);
            $('#gridDivLastBe').jsGrid('destroy');
            initGridDivLastBe();
            
            // 0건 그리드 메세지 처리부분
            if(beforeRtfData==null || beforeRtfData.length==0){
                $.fn.getReturnValue("gridDivBeforeRtf");
            } else {
                $('#gridDivBeforeRtf').jsGrid('reset');
                initGridDivBeforeRtf();
                $('#gridDivBeforeRtf').jsGrid('loadData', beforeRtfData);
            }
            if(rsltBeData==null || rsltBeData.length==0){
                $.fn.getReturnValue("gridDivLastBe");
            } else {
                $('#gridDivLastBe').jsGrid('reset');
                initGridDivLastBe();
                $('#gridDivLastBe').jsGrid('loadData', rsltBeData);
            }
            gCondFlag = "Y";
        }).fail(function(data){
            console.log("fail to selectTableSchemaInfo");
        }); 
}