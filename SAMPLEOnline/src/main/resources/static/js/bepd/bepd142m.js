/**
 * @시스템명: 가정관리
 * @업무명: 해지율 - 산출적용
 * @설명: 해지율 - 산출적용 화면의 JS
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 26.
 * @최종변경일: 2022. 5.  3.
 * @개정이력: 
 *  하승민 2021. 7. 26. 최초작성
 *  서승호 2022. 5.  3. 컬럼명 변경. 저무해지구분코드 -> 해지율산출구분
 */
var condAplcBe;
// 업로드 위한 컬럼 양식 (기본해지율)
var gArrCols = [];
// 업로드 위한 컬럼 양식 (유보)
var gArrCols2 = [];
// 업로드 위한 컬럼 양식 (증가)
var gArrCols3 = [];
var gArrCols4 = [];
var gTbNm = "TB_IBECRS02";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//직전년도be플래그
var gCondJsBfrYear = "N";
//one-off플래그
var gCondOneoffCheck = "N";
//조회조건 콤보박스
var rscRatCombo = "basRscRat";
//집계기준구분코드
var gSmupStnd = "02";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    // 공통코드 조회(납입상태, 채널, 상품유형)
    $.fn.loadCommonCode(["RSC_RAT_PROD_SC_CD","BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD","BE_CHNL_SC_CD","BE_BLK_SC_CD"]);

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
    
    //유보효과
    initGridRsrtEfcItm();
    initGridIncrEfcItm();
    initGridRsrtEfcUploadItm();
    initGridIncrEfcUploadItm();
    
    //Skewness
    initGridSkewItm();
    initGridSkewUploadItm();
});
/**
* @설명: 콤보박스 초기화
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 7. 최초작성
*/
function initCommCd() {
    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","03");
}

/**
* @설명: event 초기화
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 26. 최초작성
*/
function initEvent() {
    $("#div_hide").show();
    $("#div_show").hide();
    $("#div_skew").hide();
    
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
    
    // 조회조건 변경시 그리드 초기화
    $("#sbx_rscRat").on("change", function(e){
        rscRatCombo = $("#sbx_rscRat").val();
        if(rscRatCombo == "basRscRat") {
            $("#cbx_oneOff").show();
            $("#cbx_oneOff_label").show();
            $("#sbx_smupStnd").prop("disabled", false);
            $("#div_hide").show();
            $("#div_show").hide();
            $("#div_skew").hide();
            resetAllGrd();
        } else if(rscRatCombo == "incrEfcCtrlRat"){
            $("#cbx_oneOff").hide();
            $("#cbx_oneOff_label").hide();
            $("#sbx_smupStnd").prop("disabled", true);
            $("#div_hide").hide();
            $("#div_show").show();
            $("#div_skew").hide();
            resetAllGrd();
        } else {
        	$("#cbx_oneOff").hide();
            $("#cbx_oneOff_label").hide();
            $("#cbx_jsBfrYear").hide();
            $("#cbx_jsBfrYear_label").hide();
            $("#sbx_smupStnd").prop("disabled", false);
            $("#div_hide").hide();
            $("#div_show").hide();
            $("#div_skew").show();
            resetAllGrd();
        }
    });
    
    // 집계기준 변경이벤트
    $("#sbx_smupStnd").on("change", function(e){
        gSmupStnd = $("#sbx_smupStnd").val();
        resetAllGrd();
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
        selectProdAplcList();
    });
    
    //보정전:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download').on('click', function(e){
        if(gCondFlag == "N" || $("#gridDivRtfBfc").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
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
    
    //유보효과 엑셀다운
    $('#btn_excel_download2').on('click', function(e){
        if(gCondFlag == "N" || $("#rsrtEfcItm").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        let fileName = "유보증가효과 조정율 산출결과_"+$("#sbx_aplcBe").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'rsrtEfcItm',
                sheetName : "유보산출",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%",
                searchCond: $.fn.getSearchCondSub("PROD")
            },
            {
                id: 'incrEfcItm',
                sheetName : "증가산출",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%"
            },
            {
                id: 'rsrtEfcUploadItm',
                sheetName : "유보업로드",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%"
            },
            {
                id: 'incrEfcUploadItm',
                sheetName : "증가업로드",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%"
            },
            {
                id: 'rsrtEfcItm',
                sheetName : "유보산출(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            },
            {
                id: 'incrEfcItm',
                sheetName : "증가산출(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            },
            {
                id: 'rsrtEfcUploadItm',
                sheetName : "유보업로드(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            },
            {
                id: 'incrEfcUploadItm',
                sheetName : "증가업로드(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            }
        ]);
    });
    
    //최종BE적용결과:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $("#btn_xlsdown").on("click", function(e){
        var arrColsInfo = $.fn.getTbCols(gTbNm);
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        //직전년도BE비교 체크
        if(gCondFlag == "N" || $("#gridDivLastBe").jsGrid("option", "fields").length > 20) {
            $.fn.msgBox("조회 후 다운로드 해주세요.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        let fileName = "기본해지율_산출적용_최종BE적용결과.xlsx";
        $.fn.exportGridExcel({
            id       : 'gridDivLastBe', 
            fileName : fileName
        });
    });
    
    // 유보 양식다운
    $("#btn_excelDown1").on("click", function(e){
        var arrColsInfo = $.fn.getTbCols("TB_IBECRS23");
        gArrCols2 = $.fn.createTmpExcelGrid(arrColsInfo);
        
        //직전년도BE비교 체크
        if(gCondFlag == "N" || $("#rsrtEfcUploadItm").jsGrid("option", "fields").length > 12) {
            $.fn.msgBox("조회 후 다운로드 해주세요.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        let fileName = "유보해지율_산출적용_업로드양식.xlsx";
        $.fn.exportGridExcel({
            id       : 'rsrtEfcUploadItm', 
            fileName : fileName
        });
    });
    
    // 증가 양식다운
    $("#btn_excelDown2").on("click", function(e){ 
        var arrColsInfo = $.fn.getTbCols("TB_IBECRS23");
        gArrCols3 = $.fn.createTmpExcelGrid(arrColsInfo);
        
        //직전년도BE비교 체크
        if(gCondFlag == "N" || $("#incrEfcUploadItm").jsGrid("option", "fields").length > 12) {
            $.fn.msgBox("조회 후 다운로드 해주세요.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        let fileName = "증가해지율_산출적용_업로드양식.xlsx";
        $.fn.exportGridExcel({
            id       : 'incrEfcUploadItm', 
            fileName : fileName
        });
    });
    
    //엑셀업로드 클릭 (기본해지율)
    $("#btn_loadExcel").on("click", function(e){
        
        //직전년도BE비교 체크
        if($("#gridDivLastBe").jsGrid("option", "fields").length > 20) {
            $.fn.msgBox("조회 후 업로드 해주세요.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
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
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveLstBeList.do')
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
        console.log("paramObj", paramObj);
        $.fn.BeloadGridExcel(paramObj);
        
    });
    
    //엑셀업로드 클릭 (유보)
    $("#btn_excelUpload1").on("click", function(e){
        
        //직전년도BE비교 체크
        if($("#rsrtEfcUploadItm").jsGrid("option", "fields").length > 12) {
            $.fn.msgBox("조회 후 업로드 해주세요.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        if(gArrCols2.length == 0) {
            $.fn.msgBox("최종BE 적용결과를 다운로드한 후 엑셀업로드를 해주세요.");
            return;
        }
        var paramObj = {};
        
        paramObj.id = "rsrtEfcUploadItm";                  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        console.log("로드데이터");
                        console.log(JSON.stringify(data["list"]));
                        console.log(gArrCols2);
                        data["colList"] = gArrCols2;
                        data["tbNm"] = "TB_IBECRS23";
                        data["aplcBe"] = $("#sbx_aplcBe").val();
                        data["smupStnd"] = gSmupStnd;
                        data["efcCd"] = "rsrt";
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveLstBeList.do')
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
        console.log("paramObj", paramObj);
        $.fn.BeloadGridExcel(paramObj);
        
    });
    
    //엑셀업로드 클릭 (증가)
    $("#btn_excelUpload2").on("click", function(e){
        
        //직전년도BE비교 체크
        if($("#incrEfcUploadItm").jsGrid("option", "fields").length > 12) {
            $.fn.msgBox("조회 후 업로드 해주세요.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        if(gArrCols3.length == 0) {
            $.fn.msgBox("최종BE 적용결과를 다운로드한 후 엑셀업로드를 해주세요.");
            return;
        }
        var paramObj = {};
        
        paramObj.id = "incrEfcUploadItm";                  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        console.log("로드데이터");
                        console.log(JSON.stringify(data["list"]));
                        console.log(gArrCols3);
                        data["colList"] = gArrCols3;
                        data["tbNm"] = "TB_IBECRS23";
                        data["aplcBe"] = $("#sbx_aplcBe").val();
                        data["smupStnd"] = gSmupStnd;
                        data["efcCd"] = "incr";
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveLstBeList.do')
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
        console.log("paramObj", paramObj);
        $.fn.BeloadGridExcel(paramObj);
        
    });
    
    //Skewness 산출결과 엑셀 다운로드
    $('#btn_excel_download3').on('click', function(e){
        if(gCondFlag == "N" || $("#skewItm").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(3)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = "Skewness산출결과_"+$("#sbx_aplcBe").val()+"_"+$("#sbx_smupStnd option:selected").text()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'skewItm',
                sheetName : "Skewness산출결과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%",
                searchCond: $.fn.getSearchCondSub("ADTN")
            },
            {
                id: 'skewUploadItm',
                sheetName : "Skewness최종",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%"
            },
            {
                id: 'skewItm',
                sheetName : "Skewness산출결과(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            },
            {
                id: 'skewUploadItm',
                sheetName : "Skewness최종(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            }
        ]);
    });
    
    //Skewness양식다운
    $("#btn_excelDown3").on("click", function(e){ 
        var arrColsInfo = $.fn.getTbCols("TB_IBECRS18");
        gArrCols4 = $.fn.createTmpExcelGrid(arrColsInfo);
        console.log(gArrCols4);
        //직전년도BE비교 체크
        if(gCondFlag == "N" ) {
            $.fn.msgBox("조회 후 다운로드 해주세요.");
            return;
        }
        if(!checkCond(3)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        let fileName = "Skewness_산출적용_업로드양식.xlsx";
        $.fn.exportGridExcel({
            id       : 'skewUploadItm', 
            fileName : fileName
        });
    });
    
    //btn_excelUpload3
    $("#btn_excelUpload3").on("click", function(e){
        
        //조회조건 확인
        if(!checkCond(3)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        if(gArrCols4.length == 0) {
            $.fn.msgBox("최종BE 적용결과를 다운로드한 후 엑셀업로드를 해주세요.");
            return;
        }
        
        var paramObj = {};
        
        paramObj.id = "skewUploadItm";                  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols4;
                        data["aplcBe"] = $("#sbx_aplcBe").val();
                        data["smupStnd"] = gSmupStnd;
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd142m/saveSkewBeList.do')
                        .done(function(data) {
                        	console.log(data);
                            if(data.result == 'success') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                            }
                        }).fail(function(data){
                            $.fn.msgBox('데이터 저장이 실패했습니다.');
                        });
                    }
                }, 2);
            }
        };
        console.log("paramObj", paramObj);
        $.fn.BeloadGridExcel(paramObj);
        
    });
}

/**
* @설명: 해지율 - 산출적용 - 보정전 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 26. 최초작성
*/
function initGridRtfBfc(){
    
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();
    
    var gridObjectRtfBfc = new ComJsGrid({
        id: "gridDivRtfBfc",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRtfBfc.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 - 보정후 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 26. 최초작성
*/
function initGridRftAfc(){
    
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();
    
    var gridObjectRftAfc = new ComJsGrid({
        id: "gridDivRtfAfc",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRftAfc.gridCreate();
}

/**
 * @설명: 해지율 - 산출적용 - 최종BE 적용결과 jsGrid 빈 테이블 생성 
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  하승민 2021. 7. 26. 최초작성
 */
function initGridLastBe(){
    
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();
    
    var gridObjectLastBe = new ComJsGrid({
        id: "gridDivLastBe",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectLastBe.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 유보
* @최초작성자: 박세라
* @최초작성일: 2021. 10. 18
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 2021. 10. 18 최초작성
*/
function initGridRsrtEfcItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(4);
    var headerRowArr = getRsrtEfcHeader(1);
    
    var gridRsrtEfcItm = new ComJsGrid({
        id: "rsrtEfcItm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridRsrtEfcItm.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 증가 
* @최초작성자: 박세라
* @최초작성일: 2021. 12. 08
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 2021. 12. 08 최초작성
*/
function initGridIncrEfcItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(5);
    var headerRowArr = getRsrtEfcHeader(2);
    
    var gridIncrEfcItm = new ComJsGrid({
        id: "incrEfcItm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridIncrEfcItm.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 유보 업로드
* @최초작성자: 박세라
* @최초작성일: 2021. 12. 08
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 2021. 12. 08 최초작성
*/
function initGridRsrtEfcUploadItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(4);
    var headerRowArr = getRsrtEfcHeader(1);
    
    var gridRsrtEfcUploadItm = new ComJsGrid({
        id: "rsrtEfcUploadItm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridRsrtEfcUploadItm.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 증가 업로드
* @최초작성자: 박세라
* @최초작성일: 2021. 12. 08
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 2021. 12. 08 최초작성
*/
function initGridIncrEfcUploadItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(5);
    var headerRowArr = getRsrtEfcHeader(2);
    
    var gridIncrEfcUploadItm = new ComJsGrid({
        id: "incrEfcUploadItm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridIncrEfcUploadItm.gridCreate();
}

/////////////////////////////////////////////	
/**
* @설명: 해지율 - 산출적용 - Skewness jsGrid 빈 테이블 생성 
* @최초작성자: 김민우
* @최초작성일: 2022. 01. 04.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 2022. 01. 04. 최초작성
*/
function initGridSkewItm(){
    
    var fieldsArr = getGridSkewFields();
    //var headerRowArr = getGridHederRow();
    
    var gridObjectSkewItm = new ComJsGrid({
        id: "skewItm",
        height: 300,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectSkewItm.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 - 보정후 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 김민우
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 26. 최초작성
*/
function initGridSkewUploadItm(){
    
    var fieldsArr = getGridSkewFields();
    //var headerRowArr = getGridHederRow();
    
    var gridObjectSkewUploadItm = new ComJsGrid({
        id: "skewUploadItm",
        height: 300,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectSkewUploadItm.gridCreate();
}

/////////////////////////////////////////////
	
/**
 * @설명: 유형의 배열을 기준으로 그리드 헤더 생성하여 리턴
 * @최초작성자: 박세라
 * @최초작성일: 2021. 10. 20
 * @최종변경일: 
 * @매개변수:
 * @반환값: $result : 그리드헤더
 * @개정이력: 
 *  박세라 2021. 10. 20 최초작성
 *  
 */
function getRsrtEfcHeader(type) {
    var txt = "";
    if (type == "1") {
        txt = "유보";
    } else if (type == "2") {
        txt = "증가";
    }
    var $result = $("<tr>").height(0);
    //현재조건 열
    for(var i=0; i<7; i++) {
        $result.append($("<th>").width(150))
    }
    //현재적용BE 열
    for(var i=0; i<3; i++) {
        $result.append($("<th>").width(120))
    }
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
        for(var i=0; i<18; i++) {
            $result.append($("<th>").width(120))
        }
    } 
    $result.append($("<th>").width(120));

    var selAplcBe = $("#sbx_aplcBe").val();
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") != true) {
        $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("해지율산출구분"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입중환급금비율값"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입후환급금비율값"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("BLOCK"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("채널"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text(selAplcBe))
        );
        var $result1 = $("<tr class='jsgrid-header-row'>");
            $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율1"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율2"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율3"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율4"));
            $result = $result.add($result1);
    } else {
        var comBe = (selAplcBe.substr(0,4)-1)+"BE";
        $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("해지율산출구분"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입중환급금비율값"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입후환급금비율값"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("BLOCK"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("채널"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text(selAplcBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text(comBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text("difference"))
        );
        var $result1 = $("<tr class='jsgrid-header-row'>");
        var $result2 = $("<tr class='jsgrid-header-row'>");
        for(var i=0; i<3; i++) {
            $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율1"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율2"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율3"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율4"));
        }
        $result = $result.add($result1);
    }
    
    return $result;
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
function checkCond(val) {
	
	//적용BE체크
	if(gReqParam.aplcBe != $('#sbx_aplcBe').val()) {
		return false;
	}
	
	// 조회조건체크
	if(gReqParam.rscRatCombo != rscRatCombo) {
		return false;
	}
	if (val == 1){
		//직전년도BE체크
		if(gReqParam.jsBfrYear != gCondJsBfrYear) {
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
	} else if (val == 2){
		//직전년도BE체크
		if(gReqParam.jsBfrYear != gCondJsBfrYear) {
			return false;
		}
		// 조회조건체크
		if(gReqParam.rscRatCombo != rscRatCombo) {
			return false;
		}
	} else {
		// 조회조건체크
		if(gReqParam.smupStnd != gSmupStnd) {
			return false;
		}
	}
    return true;
}

/**
 * @설명: 보정전 산출결과 Grid 조회
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 26 최초작성
 */
function selectProdAplcList(){
    if(rscRatCombo == "basRscRat") { //기본해지율
        $("#div_hide").show();
        $("#div_show").hide();
        $("#div_skew").hide();
    } else if(rscRatCombo == "incrEfcCtrlRat") { //유보증가효과조정율
        $("#div_hide").hide();
        $("#div_show").show();
        $("#div_skew").hide();
    } else { //Skewness 분석
    	$("#div_hide").hide();
        $("#div_show").hide();
        $("#div_skew").show();
    }
    
    // 조회에 필요한 값을 셋팅
    gReqParam.aplcBe = $("#sbx_aplcBe").val(); //적용BE 
    gReqParam.befAplcBe = (gReqParam.aplcBe.substr(0,4)-1)+"BE";
    gReqParam.rscRatCombo = rscRatCombo;
    gReqParam.smupStnd = gSmupStnd;
    
    //직전년도BE 체크
    var jsBfrYear = "N";
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
        jsBfrYear = "Y";
    } else {
        jsBfrYear = "N";
    }
    gReqParam.jsBfrYear = jsBfrYear;
    
    //One-off 체크
    gReqParam.rtfBfcOneOff = "01";
    gReqParam.rtfAfcOneOff = "02";
    if ($('input:checkbox[id="cbx_oneOff"]').is(":checked") == true) {
        gReqParam.rtfBfcOneOff = "03";
        gReqParam.rtfAfcOneOff = "04";
    }
    gReqParam.oneoffCheck = gCondOneoffCheck;

    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd142m/selectProdAplcList.do")
    .done(function(data) {
        if(rscRatCombo=="basRscRat") {
            // 그리드 초기화
            resetGrid();
            reDrawGrid();
            //그리드 바인딩
            var rtfBfcListData = data.rtfBfcList;
            var rtfAfcListData = data.rtfAfcList;
            var lastBeListData = data.lastBeList;
            // 0건 그리드 메세지 처리부분
            if(rtfBfcListData.length == 0) {
                $.fn.getReturnValue("gridDivRtfBfc");
            } else {
                $("#gridDivRtfBfc").jsGrid("loadData", rtfBfcListData);
            }
            if(rtfAfcListData.length == 0) {
                $.fn.getReturnValue("gridDivRtfAfc");
            } else {
                $("#gridDivRtfAfc").jsGrid("loadData", rtfAfcListData);
            }
            if(lastBeListData.length == 0) {
                $.fn.getReturnValue("gridDivLastBe");
            } else {
                $("#gridDivLastBe").jsGrid("loadData", lastBeListData);
            }
        } else if (rscRatCombo == "incrEfcCtrlRat"){
            // 그리드 초기화
            resetGrid2();
            reDrawGrid2();
            var rsrtEfc = data.rsrtEfc;
            var incrEfc = data.incrEfc;
            var rsrtEfcUp = data.rsrtEfcUp;
            var incrEfcUp = data.incrEfcUp;
            
            if(rsrtEfc.length == 0) {
                $.fn.getReturnValue("rsrtEfcItm");
            } else {
                $("#rsrtEfcItm").jsGrid("loadData", rsrtEfc);
            }
            if(incrEfc.length == 0) {
                $.fn.getReturnValue("incrEfcItm");
            } else {
                $("#incrEfcItm").jsGrid("loadData", incrEfc);
            }
            if(rsrtEfcUp.length == 0) {
                $.fn.getReturnValue("rsrtEfcUploadItm");
            } else {
                $("#rsrtEfcUploadItm").jsGrid("loadData", rsrtEfcUp);
            }
            if(incrEfcUp.length == 0) {
                $.fn.getReturnValue("incrEfcUploadItm");
            } else {
                $("#incrEfcUploadItm").jsGrid("loadData", incrEfcUp);
            }
        } else {
        	resetGrid3();
            reDrawGrid3();
            
            var rstList = data.rstList;
            var uploadList = data.uploadList;
            
            if(rstList.length == 0) {
                $.fn.getReturnValue("skewItm");
            } else {
                $("#skewItm").jsGrid("loadData", rstList);
            }
            if(uploadList.length == 0) {
                $.fn.getReturnValue("skewUploadItm");
            } else {
                $("#skewUploadItm").jsGrid("loadData", uploadList);
            }
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectMsgStatListByKeywords !!");
    });
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 26 최초작성
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
 * @설명: 그리드 데이터 초기화(유보증가)
 * @최초작성자: 박세라
 * @최초작성일: 2021. 12. 09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2021. 12. 09 최초작성
 */
function resetGrid2() {
    //유보산출결과 
    $("#rsrtEfcItm").jsGrid("reset");
    $("#rsrtEfcItm").jsGrid("option", "data", []);
    //증가산출결과 
    $("#incrEfcItm").jsGrid("reset");
    $("#incrEfcItm").jsGrid("option", "data", []);
    //유보업로드
    $("#rsrtEfcUploadItm").jsGrid("reset");
    $("#rsrtEfcUploadItm").jsGrid("option", "data", []);
    //증가업로드
    $("#incrEfcUploadItm").jsGrid("reset");
    $("#incrEfcUploadItm").jsGrid("option", "data", []);
}

/**
 * @설명: 그리드 데이터 초기화(Skewness)
 * @최초작성자: 김민우
 * @최초작성일: 2022. 1. 04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2022. 1. 04 최초작성
 */
function resetGrid3() {
    //유보산출결과 
    $("#skewItm").jsGrid("reset");
    $("#skewItm").jsGrid("option", "data", []);
    //업로드
    $("#skewUploadItm").jsGrid("reset");
    $("#skewUploadItm").jsGrid("option", "data", []);
}
/**
 * @설명: 그리드 리로드
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 8 최초작성
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
 * @설명: 그리드 리로드 (유보증가)
 * @최초작성자: 박세라
 * @최초작성일: 2021. 12. 09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2021. 12. 09 최초작성
 */
function reDrawGrid2() {
    //그리드 destroy
    $("#incrEfcItm").jsGrid("destroy");
    $("#rsrtEfcItm").jsGrid("destroy");
    $("#rsrtEfcUploadItm").jsGrid("destroy");
    $("#incrEfcUploadItm").jsGrid("destroy");
    //그리드 create
    initGridRsrtEfcItm();
    initGridIncrEfcItm();
    initGridRsrtEfcUploadItm();
    initGridIncrEfcUploadItm();
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 김민우
 * @최초작성일: 2022. 1. 4
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김민우 2022. 1. 4 최초작성
 */
function reDrawGrid3() {
    //그리드 destroy
    $("#skewItm").jsGrid("destroy");
    $("#skewUploadItm").jsGrid("destroy");
    //그리드 create
    initGridSkewItm();
    initGridSkewUploadItm();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  하승민 2021. 7. 8 최초작성
 */
function getGridSkewFields() {
	var selAplcBe = $("#sbx_aplcBe").val();
	var codeArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
	//코드 목록
    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
    
    var resultArr = [
        { name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value=='ZZ') {
                    return 'TOTAL';
                } else if (value==null || value=='') {
                    return value;
                } else {
                    return $._commonObj["code"]["RSC_RAT_PROD_SC_CD"][value-1].codeNm;
                }
            }
        },
        { name: "dupayRefndRtoVal", title:"납입중환급금비율값", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value=='ZZ') {
                    if(item.rscRatProdScCd == 'ZZ') {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                    return value;
                }
            }
        },
        { name: "padAftRefndRtoVal", title:"납입후환급금비율값", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value=='ZZ') {
                    if(item.dupayRefndRtoVal == 'ZZ') {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                    return value;
                }
            }
        },
        { name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 150, align:"center", 
            itemTemplate:function(value, item) {
                if(value=='ZZ') {
                    if(item.padAftRefndRtoVal == 'ZZ') {
                        return '';
                    }
                    return 'TOTAL';
                } else if (value==null || value=='') {
                    return value;
                } else if (value==1) {
                    return 'NEW';
                } else if (value==2) {
                    return 'OLD';
                }
            }
        },
        { name: "beFpayYnScCd", title:"납입유형", css:"cell", type: "select", width: 150, align:"center", 
            itemTemplate:function(value, item) {
                if(value=='ZZ') {
                    if(item.beBlkScCd == 'ZZ') {
                        return '';
                    }
                    return 'TOTAL';
                } else if (value==null || value=='') {
                    return value;
                } else {
                    for(i=0; i<fpayYnScCdArr.length; i++) {
                        if(value == fpayYnScCdArr[i].code) {
                            return fpayYnScCdArr[i].codeNm;
                        }
                    }
                }
            }
        },
        { name: "beChnlScCd", title:"채널", css:"cell", type: "select", width: 150, align:"center", 
        	itemTemplate:function(value, item) {
        		var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
        		
        		if(value=='ZZ') {
                  if(item.beFpayYnScCd == 'ZZ') {
                      return '';
                  }
                  return 'TOTAL';
        		} else if (value==null || value=='') {
                  return value;
        		} else {
        			for(var i=0; i<tmpCodeDataList.length; i++) {
        				var tmpCode = tmpCodeDataList[i];
        				if (tmpCode.code == value){
        					return tmpCode.codeNm;
        				}
        			}
        		}
        	}
        },
        { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 150, align:"center", 
            itemTemplate:function(value, item) {
                if(value=='ZZ') {
                    if(item.beChnlScCd == 'ZZ') {
                        return '';
                    }
                    return 'TOTAL';
                } else if (value==null || value=='') {
                    return value;
                } else {
                    return $._commonObj["code"]["BE_NEW_LOB_CD"][value*1].codeAbbrNm;
                }
                return textField;
            }
        }
    ];
    
    var colNm = "psgMntFgr";
	var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15","16","17","18","19","20","21","22","23"
    	,"24","25","26","27","28","29","30","31","32","33","34","35","36"];
	var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15","16","17","18","19","20","21","22","23"
    	,"24","25","26","27","28","29","30","31","32","33","34","35","36"];
	var fieldsArr = getPsgMntFieldsArr(targetArr);
	resultArr = resultArr.concat(fieldsArr);
	
	return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  하승민 2021. 7. 8 최초작성
 */
function getPsgMntFieldsArr(targetArr) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    var resultArr = [];
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: "psgMntFgr" + target , title: target + "차월", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
            value = $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            return $.addCommaNumber(value);
        }};
        resultArr.push(distStndValField);
    }
    return resultArr;
}
/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  하승민 2021. 7. 8 최초작성
 */
function getGridFields(num) {
    
    //코드 목록
    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
    var chnlScCdArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
    //적용BE
    var aplcBe = $("#sbx_aplcBe").val(); 
    var befAplcBe = (aplcBe.substr(0,4)-1)+"BE";
    
    //그리드 공통부분 필드
    if(num==4 || num==5) {
        var resultArr = [
            { name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        return 'TOTAL';
                    } else if (value==null || value=='') {
                        return value;
                    } else {
                        return $._commonObj["code"]["RSC_RAT_PROD_SC_CD"][value-1].codeNm;
                    }
                }
            },
            { name: "dupayRefndRtoVal", title:"납입중환급금비율값", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.rscRatProdScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
            },
            { name: "padAftRefndRtoVal", title:"납입후환급금비율값", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.dupayRefndRtoVal == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
            },
            { name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 150, align:"center", 
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.padAftRefndRtoVal == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else if (value==null || value=='') {
                        return value;
                    } else if (value==1) {
                        return 'NEW';
                    } else if (value==2) {
                        return 'OLD';
                    }
                }
            },
            { name: "beFpayYnScCd", title:"납입유형", css:"cell", type: "select", width: 150, align:"center", 
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.beBlkScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else if (value==null || value=='') {
                        return value;
                    } else {
                        for(i=0; i<fpayYnScCdArr.length; i++) {
                            if(value == fpayYnScCdArr[i].code) {
                                return fpayYnScCdArr[i].codeNm;
                            }
                        }
                    }
                }
            },
            { name: "beChnlScCd", title:"채널", css:"cell", type: "select", width: 150, align:"center", 
            	items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "codeNm", valueField: "code",
            	itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.beFpayYnScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else if(value=="77"){
                        return "AR";
                    } else if(value=="87"){
                        return "POOL";
                    } else if(value=="88"){
                        return "기타채널";
                    } else if(value=="98"){
                        return "개인대리점";
                    } else if(value=="99"){
                        return "내근";
                    } else if (value==null || value=='') {
                        return value;
                    } else {
                    	var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
                		
            			for(var i=0; i<tmpCodeDataList.length; i++) {
            				var tmpCode = tmpCodeDataList[i];
            				if (tmpCode.code == value){
            					return tmpCode.codeNm;
            				}
            			}
                    }
                }
            },
            { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 150, align:"center", 
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.beChnlScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else if (value==null || value=='') {
                        return value;
                    } else {
                        return $._commonObj["code"]["BE_NEW_LOB_CD"][value*1].codeAbbrNm;
                    }
                    return textField;
                }
            }
        ];
        if(num==4) {
            // 유보효과조정율 필드
            for(var i=1; i<=4; i++) {
                var field = {name:"rsrtCtrlRat"+i, title:aplcBe+" 유보효과조정율"+i, css:"cell", type:"text", width:120, align:"right", sorter:"number",
                        itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                }
                resultArr.push(field);
            }
        } else {
            // 증가효과조정율 필드
            for(var i=1; i<=4; i++) {
                var field = {name:"incrCtrlRat"+i, title:aplcBe+" 증가효과조정율"+i, css:"cell", type:"text", width:120, align:"right", sorter:"number",
                        itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                }
                resultArr.push(field);
            }
        }
        if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
            if(num==4) {
                // 유보효과조정율 직년be 필드
                for(var i=1; i<=4; i++) {
                    var field = {name:"bfrRsrtCtrlRat"+i, title:befAplcBe+" 유보효과조정율"+i, css:"cell", type:"text", width:120, align:"right", sorter:"number",
                            itemTemplate:function(value, item) {
                                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                            }
                    }
                    resultArr.push(field);
                }
                // diff
                for(var i=1; i<=4; i++) {
                    var field = {name:"diffRsrtCtrlRat"+i, title:+" diff유보효과조정율"+i, css:"cell", type:"text", width:120, align:"right", sorter:"number",
                            itemTemplate:function(value, item) {
                                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                            }
                    }
                    resultArr.push(field);
                }
            } else {
                // 증가효과조정율 직년be 필드
                for(var i=1; i<=4; i++) {
                    var field = {name:"bfrIncrCtrlRat"+i, title:befAplcBe+" 증가효과조정율"+i, css:"cell", type:"text", width:120, align:"right", sorter:"number",
                            itemTemplate:function(value, item) {
                                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                            }
                    }
                    resultArr.push(field);
                }
                // 증가효과조정율 diff 필드
                for(var i=1; i<=4; i++) {
                    var field = {name:"diffIncrCtrlRat"+i, title:" diff증가효과조정율"+i, css:"cell", type:"text", width:120, align:"right", sorter:"number",
                            itemTemplate:function(value, item) {
                                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                            }
                    }
                    resultArr.push(field);
                }
            }
        }
    } else {
        var resultArr = [
            { name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                	var codeArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
                    for(i=0; i<codeArr.length; i++) {
                        if(value == codeArr[i].code) {
                            return codeArr[i].codeAbbrNm;
                        }
                    }
                }
            },
            { name: "dupayRefndRtoVal", title:"납입중환급금비율값", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value == '' || value == null) {
                        if(item.rscRatProdScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
            },
            { name: "padAftRefndRtoVal", title:"납입후환급금비율값", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value == '' || value == null) {
                        if(item.dupayRefndRtoVal == null || item.dupayRefndRtoVal == '') {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
            },
            { name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 150, align:"center", 
                itemTemplate:function(value, item) {
                    //TOTAL 항목 표시 및 NULL처리
                    if(value=='ZZ') {
                        if(item.padAftRefndRtoVal == 'ZZZZZZZZZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                    	var codeArr = $.fn.getGridCodeItem("BE_BLK_SC_CD");
                        for(i=0; i<codeArr.length; i++) {
                            if(value == codeArr[i].code) {
                                return codeArr[i].codeAbbrNm;
                            }
                        }
                    }
                }
            },
            { name: "beFpayYnScCd", title:"납입유형", css:"cell", type: "select", width: 150, align:"center", 
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.beBlkScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else if (value==null || value=='') {
                        return value;
                    } else {
                        for(i=0; i<fpayYnScCdArr.length; i++) {
                            if(value == fpayYnScCdArr[i].code) {
                                return fpayYnScCdArr[i].codeNm;
                            }
                        }
                    }
                }
            },
            { name: "beChnlScCd", title:"채널", css:"cell", type: "select", width: 150, align:"center", 
            	itemTemplate:function(value, item) {
            		var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
            		//TOTAL 항목 표시 및 NULL처리
            		if(value=='ZZ') {
                      if(item.beFpayYnScCd == 'ZZ') {
                          return '';
                      }
                      return 'TOTAL';
            		} else {
            			for(var i=0; i<tmpCodeDataList.length; i++) {
            				var tmpCode = tmpCodeDataList[i];
            				if (tmpCode.code == value){
            					return tmpCode.codeNm;
            				}
            			}
            		}
            	}
            },
            { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 150, align:"center", 
            	itemTemplate:function(value, item) {
            		var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
            		//TOTAL 항목 표시 및 NULL처리
            		if(value=='ZZ') {
                      if(item.beFpayYnScCd == 'ZZ') {
                          return '';
                      }
                      return 'TOTAL';
            		} else {
            			for(var i=0; i<tmpCodeDataList.length; i++) {
            				var tmpCode = tmpCodeDataList[i];
            				if (tmpCode.code == value){
            					return tmpCode.codeNm;
            				}
            			}
            		}
            	}
            }
        ];
       var colNm = "psgYys";
       var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
       var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12+"];
       var fieldsArr = getPsgNtsFieldsArr(targetArr, titleArr, colNm, aplcBe);
       resultArr = resultArr.concat(fieldsArr);
       
       //직전년도BE 체크
       if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
           var befFildsArr = getPsgNtsFieldsArr(targetArr, titleArr, "bfrPsgYys", befAplcBe);
           resultArr = resultArr.concat(befFildsArr);
           var diffFildsArr = getPsgNtsFieldsArr(targetArr, titleArr, "diff", "difference");
           resultArr = resultArr.concat(diffFildsArr);
       } else {
           var whole = { name: "total" , title: "전체", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
                   itemTemplate:function(value, item) {
                       return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                   }
           };
           resultArr.push(whole);
       }
   }
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 경과월 배열 
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  하승민 2021. 7. 8 최초작성
 */
function getPsgNtsFieldsArr(targetArr, titleArr, colNm, aplcBe) {
    if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titleArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: colNm + target , title: aplcBe + titleArr[i] + "차년도", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
                itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
        };
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}
/**
 * @설명: 유형의 배열을 기준으로 그리드 헤더 생성하여 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수:
 * @반환값: $result : 그리드헤더
 * @개정이력: 
 *  하승민 2021. 7. 28 최초작성
 *  
 */
function getGridHederRow() {
    var $result = $("<tr>").height(0);
    //현재적용BE 열
    for(var i=0; i<7; i++) {
        $result.append($("<th>").width(150))
    }
    //현재적용BE 열
    for(var i=0; i<12; i++) {
        $result.append($("<th>").width(120))
    }
    //직전년도 적용BE 열
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
        for(var i=0; i<23; i++) {
            $result.append($("<th>").width(120))
        }
    }
    
    $result.append($("<th>").width(120));
    
    var selAplcBe = $("#sbx_aplcBe").val();
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") != true) {
        $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("해지율산출구분"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입중환급금비율값"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입후환급금비율값"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("BLOCK"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("채널"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 13).text(selAplcBe+" "))
        );
        var $result1 = $("<tr class='jsgrid-header-row'>")
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("2차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("3차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("4차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("5차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("6차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("7차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("8차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("9차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("10차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("11차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("12+차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전체"));
    } else {
        var comBe = (selAplcBe.substr(0,4)-1)+"BE";
        $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("해지율산출구분"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입중환급금비율값"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입후환급금비율값"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("BLOCK"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입상태"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("채널"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 12).text(selAplcBe+" "))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 12).text(comBe+" "))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 12).text("difference "))
        );
        var $result1 = $("<tr class='jsgrid-header-row'>")
        for(var i=0; i<3; i++) {
            $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("2차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("3차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("4차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("5차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("6차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("7차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("8차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("9차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("10차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("11차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("12+차년도"));
        }
    }
    
    $result = $result.add($result1);
    
    return $result;
}

function resetAllGrd() {
	resetGrid();
    reDrawGrid();
    resetGrid2();
    reDrawGrid2();
    resetGrid3();
    reDrawGrid3();
}