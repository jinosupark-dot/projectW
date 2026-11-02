/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 연금일시해지율 산출적용
 * @설명: 연금일시해지율 산출적용 화면 JS
 * @최초작성자: 이준용
 * @최초작성일: 2021. 07. 26.
 * @최종변경일: 
 * @개정이력: 
 *  이준용 2021. 07. 26 최초작성
 */

//전역변수
var gArrCols = []; //대상테이블 컬럼리스트(for 엑셀업로드)
const gTbNm = "TB_IBECRS03";
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
    
    //버튼 권한 처리 2021.06.14
//    $.fn.setBtnPermission([{"btnId":"#btn_xlsdown","type":"A"}
//                          ,{"btnId":"#btn_exportExcel","type":"A"}])
                          
    //적용BE 콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //보정전 산출결과
    initGridRtfBfc();
    
    //보정후 산출결과
    initGridRftAfc();
    
    //최종BE 적용결과
    initGridLastBe();

});

/**
* @설명: 콤보박스 초기화
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 7. 최초작성
*/
function initCommCd() {
    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","04");
    
    // 공통코드 조회(채널, 상품유형)
    $.fn.loadCommonCode(["BE_KIDI_ONPAD_SC_CD"]);
}

/**
* @설명: event 초기화
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 26. 최초작성
*/
function initEvent() {
    //셀렉트박스별 타이틀명 추출
    var bfcTitle = $("#title_rtfBfc").text().replace(/\s/gi, "");
    var afcTitle = $("#title_rtfAfc").text().replace(/\s/gi, "");
    var lastTitle = $("#title_lastBe").text().replace(/\s/gi, "");
    
    //직전년도BE비교
    $("#cbx_jsBfrYear").on("change", function(e){
        if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
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
    $("#cbx_oneOff").on("change", function(e){
        if ($('input:checkbox[id="cbx_oneOff"]').is(":checked") == true) {
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
            $("#title_lastBe").text("최종BE 산출결과(One-off 반영)");
        } else {
            $("#title_rtfBfc").text("보정전 산출결과");
            $("#title_rtfAfc").text("보정후 산출결과");
            $("#title_lastBe").text("최종BE 산출결과");
        }
        selectProdAplcList();
    });
    
    //보정전:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download').on('click', function(e){
        //데이터 체크
        var dataList = $("#gridDivRtfBfc").jsGrid("option", "data");
        if(dataList.length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        if(gCondFlag == "N") {
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
                id: 'gridDivRtfBfc',
                sheetName : "보정전",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%",
                searchCond: $.fn.getSearchCondSub("PROD")
            },
            {
                id: 'gridDivRtfAfc',
                sheetName : "보정후",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%"
            },
            {
                id: 'gridDivLastBe',
                sheetName : "최종BE적용결과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%"
            },
            {
                id: 'gridDivRtfBfc',
                sheetName : "보정전(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            },
            {
                id: 'gridDivRtfAfc',
                sheetName : "보정후(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            },
            {
                id: 'gridDivLastBe',
                sheetName : "최종BE적용결과(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            }
        ]);
    });
    
    //최종BE적용결과:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $("#btn_xlsdown").on("click", function(e){
        //직전년도BE비교 체크
        if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
            $.fn.msgBox("직전년도be비교 체크 해제 후 다운로드 해주세요.");
            return;
        }
        if(gCondFlag == "N" || $("#gridDivLastBe").jsGrid("option", "fields").length > 10) {
            $.fn.msgBox("조회 후 다운로드 해주세요.");
            return;
        }
        let fileName = $(document).find("title").text()
                     + ".xlsx";
        $.fn.exportGridExcel({
            id       : 'gridDivLastBe', 
            fileName : fileName
//          , applyItemTemplate: true
        });
        
        var arrColsInfo = $.fn.getTbCols(gTbNm);
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
    });
    
    //엑셀업로드 클릭
    $("#btn_loadExcel").on("click", function(e){
        //직전년도BE비교 체크
        if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
            $.fn.msgBox("직전년도be비교 체크 해제 후 다운로드 해주세요.");
            return;
        }
        
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
                        console.log("로드데이터");
                        console.log(JSON.stringify(data["list"]));
                        console.log(gArrCols);
                        data["colList"] = gArrCols;
                        data["tbNm"] = gTbNm;
                        data["aplcBe"] = $("#sbx_aplcBe").val();
                        data["smupStnd"] = gSmupStnd;
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd152m/saveAnutLstBeList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                            }
                        }).fail(function(data){
                            $.fn.msgBox('데이터 저장이 실패했습니다.');
                        });
                    }
                }, 2);

                //엑셀데이터 형식 맞추기
                //loadGridSetting();
            }
        };
        $.fn.BeloadGridExcel(paramObj);
        
    });
}

/**
* @설명: 연금일시해지율 - 산출적용 - 보정전 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 26. 최초작성
*/
function initGridRtfBfc(){
    
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();
    
    var gridObjectRtfBfc = new ComJsGrid({
        id: "gridDivRtfBfc",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return headerRowArr;
        },
      //합계행 : class = 'sub-total' append
//        rowClass: function(item, itemIndex){  //item은 Row안의 데이터 / index는  Row Number
//            if(item.beKidiOnpadScCd === "합계") {
//                return "sub-total";
//            }
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRtfBfc.gridCreate();
}

/**
* @설명: 연금일시해지율 - 산출적용 - 보정후 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 26. 최초작성
*/
function initGridRftAfc(){
    
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();
    
    var gridObjectRftAfc = new ComJsGrid({
        id: "gridDivRtfAfc",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return headerRowArr;
        },
      //합계행 : class = 'sub-total' append
//        rowClass: function(item, itemIndex){  //item은 Row안의 데이터 / index는  Row Number
//            if(item.beKidiOnpadScCd === "합계") {
//                return "sub-total";
//            }
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRftAfc.gridCreate();
}

/**
 * @설명: 연금일시해지율 - 산출적용 - 최종BE 적용결과 jsGrid 빈 테이블 생성 
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  이준용 2021. 7. 26. 최초작성
 */
function initGridLastBe(){
    
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();
    
    var gridObjectLastBe = new ComJsGrid({
        id: "gridDivLastBe",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        //합계행 : class = 'sub-total' append
//        rowClass: function(item, itemIndex){  //item은 Row안의 데이터 / index는  Row Number
//            if(item.beKidiOnpadScCd === "합계") {
//                return "sub-total";
//            }
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectLastBe.gridCreate();
}

/**
 * @설명: 보정전 산출결과 Grid 조회
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 26 최초작성
 */
function selectProdAplcList(){
    // 조회에 필요한 값을 셋팅
    var reqParam = {};
    reqParam.aplcBe = $("#sbx_aplcBe").val(); //적용BE 
    reqParam.befAplcBe = (reqParam.aplcBe.substr(0,4)-1)+"BE";
    
    //직전년도BE 체크
    var jsBfrYear = "N";
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
        jsBfrYear = "Y";
    } else {
        jsBfrYear = "N";
    }
    reqParam.jsBfrYear = jsBfrYear;
    
  //One-off 체크
    reqParam.rtfBfcOneOff = "01";
    reqParam.rtfAfcOneOff = "02";
    if ($('input:checkbox[id="cbx_oneOff"]').is(":checked") == true) {
        reqParam.rtfBfcOneOff = "03";
        reqParam.rtfAfcOneOff = "04";
    }
    reqParam.smupStnd = gSmupStnd;
    //엑셀 validation 체크용 오브젝트
    gReqParam.aplcBe = $("#sbx_aplcBe").val();
    gReqParam.jsBfrYear = gCondJsBfrYear;
    gReqParam.oneoffCheck = gCondOneoffCheck;
    gReqParam.smupStnd = gSmupStnd;

    // 데이터 조회
    $.callAjax(reqParam, "/be/pd/bepd152m/selectProdAplcList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        reDrawGrid();
        //그리드 바인딩
        var rtfBfcListData = data.rtfBfcList;
        var rtfAfcListData = data.rtfAfcList;
        var lastBeListData = data.lastBeList;
        
        $("#gridDivRtfBfc").jsGrid("loadData", rtfBfcListData);
        $("#gridDivRtfAfc").jsGrid("loadData", rtfAfcListData);
        $("#gridDivLastBe").jsGrid("loadData", lastBeListData);
        
        // 0건 그리드 메세지 처리부분
        if(rtfBfcListData.length == 0) {
            $.fn.getReturnValue("gridDivRtfBfc");
        }
        if(rtfAfcListData.length == 0) {
            $.fn.getReturnValue("gridDivRtfAfc");
        }
        if(lastBeListData.length == 0) {
            $.fn.getReturnValue("gridDivLastBe");
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectMsgStatListByKeywords !!");
    });
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 26 최초작성
 */
function resetGrid() {
    //보정전 산출결과 
    $("#gridDivRtfBfc").jsGrid("reset");
    $("#gridDivRtfBfc").jsGrid("option", "data", []);
    //보정후 산출결과 
    $("#gridDivRtfAfc").jsGrid("reset");
    $("#gridDivRtfAfc").jsGrid("option", "data", []);
    //최종BE 적용결과
    $("#gridDivLastBe").jsGrid("reset");
    $("#gridDivLastBe").jsGrid("option", "data", []);
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function reDrawGrid() {
    //그리드 destroy
    $("#gridDivRtfBfc").jsGrid("destroy");
    $("#gridDivRtfAfc").jsGrid("destroy");
    $("#gridDivLastBe").jsGrid("destroy");
    //그리드 create
    initGridRtfBfc();
    initGridRftAfc();
    initGridLastBe();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:연금일시해지율 산출 연도별 비중(건수/Driver 기준)
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function getGridFields() {
    var aplcBe = $("#sbx_aplcBe").val(); //적용BE
    var befAplcBe = (aplcBe.substr(0,4)-1)+"BE";
    //그리드 공통부분 필드
    var resultArr = [
        { name: "beKidiOnpadScCd", title:"납입방법", css:"cell", type: "select", width: 100, align:"center", 
            items: $.fn.getGridCodeItem("BE_KIDI_ONPAD_SC_CD"), textField: "codeNm", valueField: "code"
        }
    ];
    //전체 필드
//    var allInfo = { name: "Total", title:"전체", css:"cell", type: "text",  width: 140, align:"right", sorter:"number"};
    

    var fieldsArr = getTargetFieldsArr("", aplcBe);
    resultArr = resultArr.concat(fieldsArr);
    
    //직전년도BE 체크
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
        var befFildsArr = getTargetFieldsArr("Bfr", befAplcBe);
        resultArr = resultArr.concat(befFildsArr);
        var diffFildsArr = getTargetFieldsArr("Diff", "difference");
        resultArr = resultArr.concat(diffFildsArr);
    } else {
//        resultArr.push(allInfo);
    }
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 경과월 배열 
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function getTargetFieldsArr(colNm, aplcBe) {
    var resultArr = [];
    resultArr = [
        { name: "blkScOld"+colNm, title: aplcBe + " Old_block", css:"cell", type: "text", width: 100, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }},
        { name: "dvdRateDcdTp"+colNm, title: aplcBe + " (유배당) 금리확정형", css:"cell", type: "text", width: 100, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }},
        { name: "dvdRateInlckTp"+colNm, title: aplcBe + " (유배당) 금리연동형", css:"cell", type: "text", width: 100, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }},
        { name: "woDivRateDcdTp"+colNm, title: aplcBe + " (무배당) 금리확정형", css:"cell", type: "text", width: 100, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }},
        { name: "woDivRateInlckTp"+colNm, title: aplcBe + " (무배당) 금리연동형",  css:"cell", type: "text", width: 100, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }},
        { name: "vaIns"+colNm, title: aplcBe + " (무배당) 변액", css:"cell", type: "text", width: 100, align:"right", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }},
       ];
        //직전년도BE 체크
        if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == false) {
            resultArr.push(
                    { name: "total", title: "전체", css:"cell", type: "text", width: 100, align:"right", 
                        itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
            );
        }
    
    return resultArr;
}

function getGridHederRow() {
    var $result = $("<tr>").height(0);
    var $result1, $result2, $result3;
    for(var i=0; i<8; i++) {
        $result.append($("<th>").width(100))
    }
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
        for(var i=0; i<14; i++) {
            $result.append($("<th>").width(100))
        }
    } 
    
    var selAplcBe = $("#sbx_aplcBe").val();
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") != true) {
            $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 4).text("납입방법"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 7).text(selAplcBe)));
                 
            $result1 = $result.add($("<tr class='jsgrid-header-row'>")
//              .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("납입방법"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("Old_block"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text("New_Block"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("전체"))
                );
            // header 2row
            $result2 = $("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("유배당"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("무배당"));
            // header 3row
            $result3 = $("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리확정형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리연동형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리확정형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리연동형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("변액"));
            $result = $result.add($result1);
            $result = $result.add($result2);
            $result = $result.add($result3);
    } else {
        var comBe = (selAplcBe.substr(0,4)-1)+"BE";
           $result = $result.add($("<tr class='jsgrid-header-row'>")
               .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 4).text("납입방법"))
               .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 6).text(selAplcBe))
               .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 6).text(comBe))
               .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 6).text("difference"))
               );
        $result1 = $("<tr class='jsgrid-header-row'>");
        $result2 = $("<tr class='jsgrid-header-row'>");
        $result3 = $("<tr class='jsgrid-header-row'>");
        
        for(var i=0; i<3; i++) {
//          $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("납입방법"))
            $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("Old_block"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text("New_Block"))
                    ;
            // header 2row
            $result2.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("유배당"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("무배당"));
            // header 3row
            $result3.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리확정형"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리연동형"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리확정형"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리연동형"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("변액"));
        }
    }
    $result = $result.add($result1);
    $result = $result.add($result2);
    $result = $result.add($result3);
    return $result;
}

/**
* @설명: 감액율 - 조회시 조건, 현재 조건 체크 
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
    if(gReqParam.aplcBe != $('#sbx_aplcBe').val()) {
        return false;
    }
    //직전년도BE체크
    if(gReqParam.jsBfrYear != gCondJsBfrYear) {
        return false;
    }
    // 집계기준체크
    if(gReqParam.smupStnd != gSmupStnd) {
        return false;
    }
    //원오프체크
    if(gReqParam.oneoffCheck != gCondOneoffCheck) {
        return false;
    }
    return true;
}