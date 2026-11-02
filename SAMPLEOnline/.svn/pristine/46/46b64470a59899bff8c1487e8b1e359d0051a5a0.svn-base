/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 모니터링
 * @설명: 모니터링 화면 JS 
 * (모니터링은 각 서비스 업데이트에 따라 수시로 소스가 변경될수 있기 때문에 초기 개발단계에서 부득이하게 코드구조를 하나로 통일할수가 없었음. 
 *  따라서 공통적으로는 불필요한 선언이 있을수 있으나, 유지보수시 해당 서비스별 오리지날 소스를 그대로 카피 사용이 가능함)
 * @최초작성자: 이준용
 * @최초작성일: 2021.07.22
 * @최종변경일: 
 * @개정이력:
 *  이준용 2021.07.22 최초작성
 */
// 전역변수 선언부
var condAplcBe; //적용BE StartDt, EndDt
var condCheck = {};
var gSrchYn = "N";
//var serviceCode = "01";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//조회Be
var gAplcBe = "";
//캘린더 체크용
var dateYnChk = false;

//엑셀처리용 하이라키 체크
var gCondHichyCheck = [];

//전역날짜 변수
var reObj = {};
var gStrStYYMM = "";
var gFinStYYMM = "";

$(document).ready(function(){
    /*2021.04.30 툴팁 추가*/
    $("#imgToolTip").attr("title", parent.viewPath);
    
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //datepickerSetting세팅
    initDate();
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //콤보박스 세팅
    initComboBox();
    
    //그리드 초기화   
    initGridItem(1);
    initGridItem(2);
    
});

function initCommCd() {
    var assScCd;
    
    // 공통코드 조회(납입유형,상품유형,채널,BLOCK)
    $.fn.loadCommonCode([
        "PLLN_RAT_PRDT_CLSF_CD" //보험계약대출율 상품유형코드
        , "BE_FPAY_YN_SC_CD" //납입상태코드
         //상품유형코드
        , "BE_CHNL_SC_CD" //BE채널구분코드
        , "BE_BLK_SC_CD" //블럭유형코드
        , "HIGH_RSK_RAT_PRDT_SC_CD" //Bad상품구분코드
        , "BE_RSK_PRM_CD" //BE위험보험료코드
        , "BENF_LCLSF_CD" //급부대분류코드
        , "BE_SXDS_CD" //성별코드
        , "BE_KIDI_ONPAD_SC_CD" //보험개발원일시납구분코드
        , "BE_ANUT_PYM_MTH_CD" //연금지급방법코드
        , "BE_ANUT_PYM_MTH_CD" //BE연금지급방법코드
        , "WRKEX_COCNT_DIST_CHNL_CD"//사업비배부그룹코드
        , "BE_WRKEX_CHNL_SC_CD"//사업비채널코드
        , "RENW_TYP_PRDT_SC_CD"//갱신유형상품유형코드
        , "RENW_CYL_SC_CD"//갱신주기코드
        , "ASS_SC_CD"//구분코드
        , "RTF_MTH_SC_CD"//보정코드
        , "PLLN_RAT_SC_CD"//납입상태코드
        , "BE_WRKEX_ITM_CD"//사업비코드
        , "BE_OBLG_PAD_YYS_CD"//의무납입년수코드
        , "LOW_NHV_RSC_SC_CD"//저무해지구분
        , "RSTR_RAT_SC_CD"//환급유형
        , "RENW_CYL_SC_CD"//갱신주기"
        ]);
    $.fn.loadBeCmmnCode(["BE_WRKEX_POTFL_SC_CD", "BE_NEW_LOB_CD"]);
}

/**
 * @설명: event 초기화
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
 */

function initEvent() {
    //채널, 포트폴리오별 콤보박스 조회구분(사업비율 구분에서만 보여준다)
    $("#divSel1").hide();
    $("#divSel2").hide();
    $("#divSel3").hide();
    $("#divSel4").hide();
    
    //조회구분 변경 이벤트
    $("#sbx_srhGubun").on("change", function(e){
        initDate();
        // 그리드 초기화
        resetGrid();
        reDrawGrid();
        if(!dateYnChk) {
            $("#ibx_finYmTo").attr("disabled", true);
        } else {
            $("#ibx_finYmTo").attr("disabled", false);
        }
        if($("#sbx_srhGubun").val() == "2") {//사업비율
            $("#divSel1").show();
            $("#divSel4").show();
            $("#sbx_srhGubunSub").on("change", function(e){
                if ($("#sbx_srhGubunSub option:selected").val() == "01") {
                    $("#divSel2").show();
                    $("#divSel3").hide();
                }
                if ($("#sbx_srhGubunSub option:selected").val() == "02") {
                    $("#divSel3").show();
                    $("#divSel2").hide();
                }
            });
        } else {
            $("#divSel1").hide();
            $("#divSel2").hide();
            $("#divSel3").hide();
            $("#divSel4").hide();
        }
    });

    
    //죵료년월 달력버튼 click
    $('#btn_finYmTo').on('click', function(e){
        $('#ibx_finYmTo').datepicker('show');
    });
    
    // 조회
    $('#btn_search').on('click', function(e){
        if(!dateYnChk) {
            $.fn.msgBox("조회할 데이터가 없습니다.");
            return;
        }
        selectMntrList();
    });
    
    // 엑셀다운로드
    $('#btn_excel_download').unbind();
    $('#btn_excel_download').on('click', function(e){
        //데이터 체크
        var dataList1 = $("#gridDiv1").jsGrid("option", "data");
        var dataList2 = $("#gridDiv2").jsGrid("option", "data");
        if(dataList1.length == 0 && dataList2.length == 0) {
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
        var fileName = "";
        if ($("#sbx_srhGubun").val() != "2") {
            fileName = $(document).find("title").text() + "_" + $("#sbx_srhGubun option:selected").text()
                + ".xlsx";
        } else {
            if ($("#sbx_srhGubunSub").val() == "01") {
                fileName = $(document).find("title").text() + "_" + $("#sbx_srhGubun option:selected").text() + "_" + $("#sbx_srhGubunSub option:selected").text() + "_" + 
                $("#sbx_srhType option:selected").text() + "_" + $("#sbx_srhTypeSub option:selected").text()+".xlsx";
            }
            if ($("#sbx_srhGubunSub").val() == "02") {
                fileName = $(document).find("title").text() + "_" + $("#sbx_srhGubun option:selected").text() + "_" + $("#sbx_srhGubunSub option:selected").text() + "_" + 
                $("#sbx_srhType option:selected").text() + "_" + $("#sbx_srhTypeSub2 option:selected").text()+".xlsx";
            }
        }
       
        var sheetNameVal1 = $("#titleNm1").text().replace(/\s/gi, "");
        var sheetNameVal2 = $("#titleNm2").text().replace(/\s/gi, "");

        $.fn.exportMultiGridExcel([
            {
                id: 'gridDiv1',
                sheetName : sheetNameVal1,
                fileName: fileName, 
                applyItemTemplate: true,
                unit: "%",
                searchCond: $.fn.getSearchCondSubMntr(gAplcBe)
            },
            {
                id: 'gridDiv2',
                sheetName : sheetNameVal2,
                fileName: fileName, 
                applyItemTemplate: true,
                unit: "%",
                searchCond: $.fn.getSearchCondSubMntr(gAplcBe)
            },
            {
                id: 'gridDiv1',
                sheetName : sheetNameVal1+"(코드)",
                fileName: fileName, 
                applyItemTemplate: false,
                unit: "%",
                searchCond: $.fn.getSearchCondSubMntr(gAplcBe)
            },
            {
                id: 'gridDiv2',
                sheetName : sheetNameVal2+"(코드)",
                fileName: fileName, 
                applyItemTemplate: false,
                unit: "%",
                searchCond: $.fn.getSearchCondSubMntr(gAplcBe)
            }
        ]);
    });
    
    //조회조건 엔터키 조회
    $("#ibx_finYmTo", "#search-item").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
}

/**
 * @설명: 콤보박스 초기화
 * @최초작성자: 이준용
 * @최초작성일: 2021. 8. 3
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 8. 3 최초작성
 */
function initComboBox() {
    var inqrSc = "01";
    var firstOptionText = "";

    //콤보박스 세팅 - 사업비배부채널코드
    var paramObj1 = {};
    paramObj1.codeArr = ["BE_WRKEX_CHNL_SC_CD"];
    paramObj1.selArr = ["sbx_srhType"];
    //콤보박스 세팅 - 사업비채널
    var paramObj2 = {};
    paramObj2.codeArr = ["BE_WRKEX_POTFL_SC_CD"];
    paramObj2.selArr = ["sbx_srhTypeSub"];
    paramObj2.displayMode = "value";

    //조회구분:실제사업비(상세)
    if(inqrSc == "03") {
        paramObj1.firstOptionText = ["-전체-"];
        paramObj2.firstOptionText = ["-전체-"];
        firstOptionText = "-전체-";
    //그외
    } else {
        paramObj1.firstOptionText = ["-선택-"];
        paramObj2.firstOptionText = ["-선택-"];
        firstOptionText = "-선택-";
    }
    
    $.fn.renderCombobox(paramObj1);
    $.fn.renderCombobox(paramObj2);
    
    //콤보박스 세팅 - 신규LOB코드
    var beNewLobCdList = [];
    var tmpCdList = $._commonObj["code"]["BE_NEW_LOB_CD"];
    for(var i=0; i<tmpCdList.length; i++) {
        var tmpCd = tmpCdList[i];
        var newCd = {
                "code": tmpCd.code,
                "codeNm": tmpCd.codeAbbrNm,
        }
        beNewLobCdList.push(newCd);
    }
    //사업비율 콤보박스용 상품구분 공통코드 축약이름으로 전환
    $._commonObj.code["BE_NEW_LOB_CD"] = beNewLobCdList;
    
    // 콤보박스 세팅
    $.fn.renderCombobox({
        codeArr: ["BE_NEW_LOB_CD"],
        selArr: ["sbx_srhTypeSub2"],
        firstOptionText: firstOptionText
    });
    //상품이름 공통코드 원상복구
    $._commonObj.code["BE_NEW_LOB_CD"] = tmpCdList;
}

function getGridHederRow1(potfl, inqrSc) {  
    var $result = $("<tr>").height(0);
    
    //조회구분:기초율
    if(inqrSc == "01") {
        $result.append($("<th>").width(140))
        $result.append($("<th>").width(140))
        for(var i=0; i<14; i++) {
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
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("Expense"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 15).text("Unit Driver"))
        
        // header 2row
        var $result2 = $("<tr class='jsgrid-header-row'>")
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
        $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("마감년월"))
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

function getGridHederRow2() {
    var $result = $("<tr>").height(0);
    var $result1, $result2;
    var gridTitle = "";
    
    if ($("#sbx_srhGubun").val() == "4") {
        gridTitle = "납입방법";
    }
    
    if ($("#sbx_srhGubun").val() == "5") {
        gridTitle = "연금지급유형";
    }
    
     // header 1row
    if ($("#sbx_srhGubun").val() == "4" || $("#sbx_srhGubun").val() == "5") { //연금일시해지율, 연금개시후해지율
        $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text(gridTitle))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("Old_block"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text("New_Block"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("전체"))
        );
    }
    
    // header 2row
    var $result1 = $("<tr class='jsgrid-header-row'>")
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("유배당"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("무배당"));
    // header 3row
    var $result2 = $("<tr class='jsgrid-header-row'>")
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리확정형"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리연동형"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리확정형"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리연동형"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("변액"));

    $result = $result.add($result1);
    $result = $result.add($result2);
    return $result;
}

function getGridHederRow3() {
    var $result = $("<tr>").height(0)
        .append($("<th>").width(100))
        .append($("<th>").width(100))
        .append($("<th>").width(100))
        .append($("<th>").width(100));
    
    // 1row
    $result = $result.add($("<tr class='jsgrid-header-row'>")
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("해약식보험료적립금(백만원)")));
    var $result1 = $("<tr class='jsgrid-header-row'>")
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전환금액"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("대상금액"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전환율"));
    
    $result = $result.add($result1);
    return $result;
}

function getGridHederRow4() {
    var $result = $("<tr>").height(0)
        .append($("<th>").width(50))
        .append($("<th>").width(100))
        .append($("<th>").width(100))
        .append($("<th>").width(100))
        .append($("<th>").width(100))
        .append($("<th>").width(100));
    
    // 1row
    $result = $result.add($("<tr class='jsgrid-header-row'>")
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("마감년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("발생건수 및 누적건수 현황"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("분자 및 분모")));
    var $result1 = $("<tr class='jsgrid-header-row'>")
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("발생건수"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("누적건수"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("분자"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("분모"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전환율"));
    
    $result = $result.add($result1);
    return $result;
}



function getEmptyFieldText(val, textField, item){
    if ($("#sbx_srhGubun").val() == "7" //유예납입율
        || $("#sbx_srhGubun").val() == "9" //추가납입율
        || $("#sbx_srhGubun").val() == "10" //중도인출율
        || $("#sbx_srhGubun").val() == "11") { //보험계약대출율
            if ($("#sbx_srhGubun").val() == "7") { //유예납입율
                if (val=="2"){
                    if($.fn.isEmpty(item.prpadPsbUlPrdtYn) || item.prpadPsbUlPrdtYn == "TOTAL") {
                          textField = "";
                    }
                }
                if (val=="3"){
                    if($.fn.isEmpty(item.beNewLobCd) || item.beNewLobCd == "TOTAL") {
                          textField = "";
                    }
                }
                
            }

            if ($("#sbx_srhGubun").val() == "9") { //추가납입율
                if (val=="2"){
                    if($.fn.isEmpty(item.beFpayYnScCd) || item.beFpayYnScCd == "TOTAL") {
                          textField = "";
                    }
                }
                if (val=="3"){
                    if($.fn.isEmpty(item.beChnlScCd) || item.beChnlScCd == "TOTAL") {
                          textField = "";
                    }
                }
            }

            if ($("#sbx_srhGubun").val() == "10") { //중도인출율
                if (val=="2"){
                    if($.fn.isEmpty(item.beFpayYnScCd) || item.beFpayYnScCd == "TOTAL") {
                          textField = "";
                    }
                }
                if (val=="3"){
                    if($.fn.isEmpty(item.beChnlScCd) || item.beChnlScCd == "TOTAL") {
                          textField = "";
                    }
                }
            }
            
            if ($("#sbx_srhGubun").val() == "11") { //보험계약대출율
                if (val=="2"){
                    if($.fn.isEmpty(item.pllnRatScCd) || item.pllnRatScCd == "TOTAL") {
                          textField = "";
                    }
                }
                if (val=="3"){
                    if($.fn.isEmpty(item.beChnlScCd) || item.beChnlScCd == "TOTAL") {
                          textField = "";
                    }
                }
                if (val=="4"){
                    if($.fn.isEmpty(item.beWrkexPotflScCd) || item.beWrkexPotflScCd == "TOTAL") {
                          textField = "";
                    }
                }
                if (val=="5"){
                    if($.fn.isEmpty(item.lowNhvRscScCd) || item.lowNhvRscScCd == "TOTAL") {
                          textField = "";
                    }
                }
                if (val=="6"){
                    if($.fn.isEmpty(item.rstrRatScCd) || item.rstrRatScCd == "TOTAL") {
                          textField = "";
                    }
                }
            }
      return textField;
    }
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
 */
function getGridFields(val){
    var fieldsArrayObj;
    var fieldsArray1 = [{}];
    
    var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
    var fieldsArr;
    var benfLclsfCdArr = $.fn.getGridCodeItem("BENF_LCLSF_CD");
    var beRskPrmCdArr = $.fn.getGridCodeItem("BE_RSK_PRM_CD");
    var beSxdsCdArr = $.fn.getGridCodeItem("BE_SXDS_CD");
    var beBlkScCdArr = $.fn.getGridCodeItem("BE_BLK_SC_CD");
    var beFpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
    var beChnlScCdArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
    var beNewLobCdArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
    var pllnRatScCdArr = $.fn.getGridCodeItem("PLLN_RAT_SC_CD");
    var pllnRatPrdtClsfCdArr = $.fn.getGridCodeItem("PLLN_RAT_PRDT_CLSF_CD");
    var beOblgPadYysCdArr = $.fn.getGridCodeItem("BE_OBLG_PAD_YYS_CD");
    var beWrkexPotflScCdArr = $.fn.getGridCodeItem("BE_WRKEX_POTFL_SC_CD");
    var lowNhvRscScCdArr = $.fn.getGridCodeItem("LOW_NHV_RSC_SC_CD");
    var rstrRatScCdArr = $.fn.getGridCodeItem("RSTR_RAT_SC_CD");
    var subTxt = "";

    //전체 필드
    var allInfo = { name: "total", title:"전체", css:"cell", type: "text",  width: 60, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
//                return $.fn.isEmpty(value) ? "0"+subTxt : value.toString()+subTxt;
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            }
    }
    
    if ($("#sbx_srhGubun").val() == "1") { //위험율
        fieldsArray1 =  
            [
                { name: 'highRskRatPrdtScCd', title:'고위험율상품구분', css:'cell', type: 'select', width: 100, align:'center', editing: false,
                    itemTemplate:function(value, item){
                        if(value==null || value=='' || value=='ZZ') {
                            return 'TOTAL';
                        } else {
                            return $._commonObj["code"]["HIGH_RSK_RAT_PRDT_SC_CD"][value-1].codeNm;
                        }
                    }
                },
                { name: 'benfLclsfCd', title:'급부대분류', css:'cell', type: 'select', width: 100, align:'center', editing: false
                    ,  itemTemplate:function(value, item) {
                        if(value==null || value=='' || value == 'ZZZ') {
                            if(item.highRskRatPrdtScCd == null || item.highRskRatPrdtScCd == "ZZ") {
                                return "";
                            }
                            return "TOTAL";
                        } else {
                            for(i=0; i<benfLclsfCdArr.length; i++) {
                                if(value == benfLclsfCdArr[i].code) {
                                    return benfLclsfCdArr[i].codeNm;
                                    break;
                                }
                            }
                        }
                    }
                },
                { name: 'beRskPrmCd', title:'급부중분류', css:'cell', type: 'select', width: 100, align:'center', editing: false
                    ,  itemTemplate:function(value, item) {
                        if(value==null || value=='' || value=='ZZZZZZ') {
                            if(item.highRskRatPrdtScCd == null || item.benfLclsfCd == null || item.highRskRatPrdtScCd == "ZZ" || item.benfLclsfCd == "ZZZ") {
                                return "";
                            }
                            return "TOTAL";
                        } else {
                            for(i=0; i<beRskPrmCdArr.length; i++) {
                                if(value == beRskPrmCdArr[i].code) {
                                    return beRskPrmCdArr[i].codeNm;
                                    break;
                                }
                            }
                        }
                    }
                },
                { name: 'beSxdsCd', title:'성별', css:'cell', type: 'select', width: 100, align:'center', editing: false
                    ,  itemTemplate:function(value, item) {
                        if(value==null || value=='' || value=='Z') {
                            if(item.highRskRatPrdtScCd == null || item.benfLclsfCd == null || item.beRskPrmCd == null
                                    || item.highRskRatPrdtScCd == "ZZ" || item.benfLclsfCd == "ZZZ" || item.beRskPrmCd == "ZZZZZZ") {
                                return "";
                            }
                            return "TOTAL";
                        } else {
                            return $._commonObj["code"]["BE_SXDS_CD"][value-1].codeNm;
                        }
                    }
                }
            ];
        fieldsArr = getPsgYysFieldsArr(targetArr, subTxt);
        fieldsArray1 = fieldsArray1.concat(fieldsArr);
        fieldsArray1.push(allInfo);
    }
    
    if ($("#sbx_srhGubun").val() == "2") { //사업비율
        if (val=="1") { //최종BE
            var fieldsArray1 = [];
            var beWrkexItmCdVal = $.fn.getGridCodeItem("BE_WRKEX_ITM_CD");
            var colNm ="";
            var aplcBe = selectFinYmInfo($("#ibx_finYmTo").val().replace("-", ""));
            var beWrkexPotflScCd = { name:"beWrkexPotflScCd" + colNm, title: aplcBe + "_" + "Potfolio Code", css:"cell", type: "text", width:140, align:"center"};
            var beWrkexItmCd = { name:"beWrkexItmCd" + colNm, title: aplcBe + "_" + "Expense", css:"sub-total", type: "select", width:140, align:"left",
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
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else {
                            value = "";
                        }
                        
                        return value;
                    }
            };
            // TODO :: Expense 3개로 나눠지면서 추가분 발생
            var ralWrkex2 = {name:"ralWrkex01", title:"Unit Driver Single", css:"sub-total", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        return value;
                    }
            };
            var ralWrkex3 = {name:"ralWrkex02", title:"Unit Driver Regular", css:"sub-total", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        return value;
                    }
            };
            var anpS = { name:"anpS" + colNm, title: aplcBe + "_" + "ANP Single", css:"cell", type: "text", width:140, align:"right",
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                        value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                    }
                    
                    return value;
                }
            };
            var anpN = { name:"anpN" + colNm, title: aplcBe + "_" + "ANP Regular", css:"cell", type: "text", width:140, align:"right",
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                        value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                    }
                    
                    return value;
                }
            };
            var pniB = { name:"pniB" + colNm, title: aplcBe + "_" + "PNB Base", css:"cell", type: "text", width:140, align:"right",
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "02") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    }
                    return value;
                }
            };
            var pniR = { name:"pniR" + colNm, title: aplcBe + "_" + "PNB Rider", css:"cell", type: "text", width:140, align:"right", 
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "02") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    }
                    return value;
                }
            };
            var gwpS = { name:"gwpS" + colNm, title: aplcBe + "_" + "GWP Single", css:"cell", type: "text", width:140, align:"right",
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    } else if(beWrkexItmCd == "03" || beWrkexItmCd == "09" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                        value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                    }
                    
                    return value;
                }
            };
            
            var gwpN = { name:"gwpN" + colNm, title: aplcBe + "_" + "GWP Regular", css:"cell", type: "text", width:140, align:"right",
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    } else if(beWrkexItmCd == "03" || beWrkexItmCd == "09" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                        value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                    }
                    
                    return value;
                }
            };
            var pifB = { name:"pifB" + colNm, title: aplcBe + "_" + "PIF Base", css:"cell", type: "text", width:140, align:"right",
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "03") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    }
                    return value;
                }
            };
            var pifR = { name:"pifR" + colNm, title: aplcBe + "_" + "PIF Rider", css:"cell", type: "text", width:140, align:"right",
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "03") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    }
                    return value;
                }
            };
            var claimA = { name:"claimA" + colNm, title: aplcBe + "_" + "CLAIM Amount", css:"cell", type: "text", width:140, align:"right",
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    } else if(beWrkexItmCd == "04" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                        value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                    }
                    
                    return value;
                }
            };
            var csvS = { name:"csvS" + colNm, title: aplcBe + "_" + "CSV Single", css:"cell", type: "text", width:140, align:"right", 
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    } else if(beWrkexItmCd == "0501" || beWrkexItmCd == "0502" || beWrkexItmCd == "08" 
                        || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                        value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                    }
                    
                    return value;
                }
            };
            var csvN = { name:"csvN" + colNm, title: aplcBe + "_" + "CSV Regular", css:"cell", type: "text", width:140, align:"right",
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    } else if(beWrkexItmCd == "0501" || beWrkexItmCd == "0502" || beWrkexItmCd == "08" 
                        || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                        value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                    }
                    
                    return value;
                }
            };
            var bpl = { name:"bpl" + colNm, title: aplcBe + "_" + "BPL", css:"cell", type: "text", width:140, align:"right",
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    } else if(beWrkexItmCd == "06" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                        value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                    }
                    
                    return value;
                }
            };
            var pricingA = { name:"pricingA" + colNm, title: aplcBe + "_" + "Pricing Alpha", css:"cell", type: "text", width:140, align:"right",
                itemTemplate:function(value, item) {
                    var beWrkexItmCd = item.beWrkexItmCd;
                    
                    if(value == "9999999999") {
                        value = "E";
                    } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                        value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                    }
                    
                    return value;
                }
            };
            
            var pricingB = { name:"pricingB" + colNm, title: aplcBe + "_" + "Pricing Beta+Gamma", css:"cell", type: "text", width:140, align:"right",
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
                    }  else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                        value = $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                    } else if(beWrkexItmCd == "02" || beWrkexItmCd == "03" || beWrkexItmCd == "07" || beWrkexItmCd == "09" || 
                            beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                        value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                    }

                    return value;
                }
            };
            
            //직전년도BE 체크
            if (colNm == "JsBfrYr" || colNm == "Diff") {
                resultArr = [ralWrkex2, ralWrkex3, ralWrkex, anpS, anpN, pniB, pniR, gwpS, gwpN, pifB, pifR, claimA, csvS, csvN, bpl, pricingA, pricingB ];
            } else {
                resultArr = [beWrkexItmCd, ralWrkex2, ralWrkex3, ralWrkex, anpS, anpN, pniB, pniR, gwpS, gwpN, pifB, pifR, claimA, csvS, csvN, bpl, pricingA, pricingB ];
            }
        }
        
        if (val=="2") { //기초율
            var inqrSc = "01";
            //그리드 필드 배열
            //그리드 필드 배열
            var fieldsArray1 = [];

            var finYm = {name:"finYm", title:"마감년월", css:"cell", type: "text", width:80, align:"center"};
            var beWrkexPotflScCd = {name:"potflLobCdVal", title:"포트폴리오명", css:"cell", type: "text", width:170, align:"center"};
            var newLobCd = { name:"potflLobCdVal", title:"상품유형", css:"cell", type: "select", width: 170, align:"center",
                    items: $.fn.getGridCodeItem("NEW_LOB_CD"), textField: "codeNm", valueField: "code"
            };
            var beWrkexItmCd = {name:"beWrkexItmCd", title:"Expense", css:"sub-total", type: "select", width:140, align:"left",
                    items: [
                        {Name:"", Id: "00"},
                        {Name:"DA_P", Id: "01"},
                        {Name:"DA_N", Id: "02"},
                        {Name:"DM", Id: "03"},
                        {Name:"DC", Id: "04"},
                        {Name:"DI_GA", Id: "0501"},
                        {Name:"DI_SA", Id: "0502"},
                        {Name:"DP", Id: "06"},
                        {Name:"IM", Id: "07"},
                        {Name:"II", Id: "08"},
                        {Name:"IO", Id: "09"},
                        {Name:"Direct Costs Related", Id: "Z1"},
                        {Name:"Indirect Costs Related", Id: "Z2"},
                        {Name:"Total Unit Costs", Id: "Z3"},
                        {Name:"Check", Id: "Z4"},
                        {Name:"OAC", Id: "Z5"},
                        ], 
                        textField: "Name", valueField: "Id"
            };
            
            var ralWrkex = {name:"ralWrkex03", title:"Unit Driver Total", css:"sub-total", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        
                        if(item.beWrkexItmCd != "00") {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else {
                            value = "";
                        }
                        
                        return value;
                    }
            };
            // TODO :: Expense 3개로 나눠지면서 추가분 발생
            var ralWrkex2 = {name:"ralWrkex01", title:"Unit Driver Single", css:"sub-total", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        return value;
                    }
            };
            var ralWrkex3 = {name:"ralWrkex02", title:"Unit Driver Regular", css:"sub-total", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        return value;
                    }
            };
            
            var anpS = { name:"anpS", title:"ANP Single", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        var beWrkexItmCd = item.beWrkexItmCd;
                        
                        if(value == "9999999999") {
                            value = "E";
                        } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                            value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                        } 
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        }
                        return value;
                    }
            };
            
            var anpN = { name:"anpN", title:"ANP Regular", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        var beWrkexItmCd = item.beWrkexItmCd;
                        
                        if(value == "9999999999") {
                            value = "E";
                        } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                            value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                        } 
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } 
                        
                        return value;
                    }
            };
            
            var pniB = { name:"pniB", title:"PNB Base", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        
                        if(value == "9999999999") {
                            value = "E";
                        } else if(value % 1 == 0) {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        }
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } 
                        
                        return value;
                    }
            };
            
            var pniR = { name:"pniR", title:"PNB Rider", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        
                        if(value == "9999999999") {
                            value = "E";
                        } else if(value % 1 == 0) {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        }
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } 
                        return value;
                    }
            };
            
            var gwpS = { name:"gwpS", title:"GWP Single", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        var beWrkexItmCd = item.beWrkexItmCd;
                        
                        if(value == "9999999999") {
                            value = "E";
                        } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else if(beWrkexItmCd == "03" || beWrkexItmCd == "09" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                            value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                        }
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        }
                        
                        return value;
                    }
            };
            
            var gwpN = { name:"gwpN", title:"GWP Regular", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        var beWrkexItmCd = item.beWrkexItmCd;
                        
                        if(value == "9999999999") {
                            value = "E";
                        } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else if(beWrkexItmCd == "03" || beWrkexItmCd == "09" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                            value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                        }
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } 
                        return value;
                    }
            };
            
            var pifB = { name:"pifB", title:"PIF Base", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        
                        if(value  == "9999999999") {
                            value = "E";
                        } else if(value % 1 == 0) {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        }
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        }
                        
                        return value;
                    }
            };
            
            var pifR = { name:"pifR", title:"PIF Rider", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        
                        if(value == "9999999999") {
                            value = "E";
                        } else if(value % 1 == 0) {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        }
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        }
                        
                        return value;
                    }
            };
            
            var claimA = { name:"claimA", title:"CLAIM Amount", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        var beWrkexItmCd = item.beWrkexItmCd;
                        
                        if(value == "9999999999") {
                            value = "E";
                        } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else if(beWrkexItmCd == "04" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                            value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                        }
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } 
                        
                        return value;
                    }
            };
            
            var csvS = { name:"csvS", title:"CSV Single", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        var beWrkexItmCd = item.beWrkexItmCd;
                        
                        if(value == "9999999999") {
                            value = "E";
                        } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else if(beWrkexItmCd == "0501" || beWrkexItmCd == "0502" || beWrkexItmCd == "08" 
                            || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                            value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                        }
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } 
                        
                        return value;
                    }
            };
            
            var csvN = { name:"csvN", title:"CSV Regular", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        var beWrkexItmCd = item.beWrkexItmCd;
                        
                        if(value == "9999999999") {
                            value = "E";
                        } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else if(beWrkexItmCd == "0501" || beWrkexItmCd == "0502" || beWrkexItmCd == "08" 
                            || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                            value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                        }
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        }
                        
                        return value;
                    }
            };
            
            var bpl = { name:"bpl", title:"BPL", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        var beWrkexItmCd = item.beWrkexItmCd;
                        
                        if(value  == "9999999999") {
                            value = "E";
                        } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else if(beWrkexItmCd == "06" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                            value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                        }
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        }
                        
                        return value;
                    }
            };
            
            var pricingA = { name:"pricingA", title:"Pricing Alpha", css:"cell", type: "text", width:140, align:"right",
                    itemTemplate:function(value, item) {
                        var beWrkexItmCd = item.beWrkexItmCd;
                        
                        if(value == "9999999999") {
                            value = "E";
                        } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                            value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                        }
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
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
                        } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4") {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        } else if(beWrkexItmCd == "02" || beWrkexItmCd == "03" || beWrkexItmCd == "07" || beWrkexItmCd == "09" || 
                                beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                            value =  $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5);
                        }
                        
                        if(inqrSc == '04') {
                            value = $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                        }
                        return value;
                    }
            };
            
            //기초율
            if(inqrSc == "01") {
                fieldsArray1 = [beWrkexItmCd, ralWrkex2, ralWrkex3, ralWrkex, anpS, anpN, pniB, pniR, gwpS, gwpN, pifB, pifR, claimA, csvS, csvN, bpl, pricingA, pricingB ];
            } else {
                var typSc = $("#sbx_typSc").val();
                //포트폴리오
                if(typSc == "01") {
                    fieldsArray1 = [finYm, beWrkexPotflScCd, anpS, anpN, pniB, pniR, gwpS, gwpN, pifB, pifR, claimA, csvS, csvN, bpl, pricingA, pricingB];
                //상품유형
                } else {
                    fieldsArray1 = [finYm, newLobCd, anpS, anpN, pniB, pniR, gwpS, gwpN, pifB, pifR, claimA, csvS, csvN, bpl, pricingA, pricingB];
                }
            }
        }
    }
    
    if ($("#sbx_srhGubun").val() == "3") { //해지율
        //저무해지 구분코드 필드
        var lowNhvRscScCd = { 
                name: "lowNhvRscScCd", title:"저무해지구분코드", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value==null || value=='' || value=='ZZ') {
                        return 'TOTAL';
                    } else {
                        return $._commonObj["code"]["LOW_NHV_RSC_SC_CD"][value-1].codeNm;
                    }
                }
        };
        
        //납입중환급금비율 필드
        var dupayRefndRtoVal = { 
                name: "dupayRefndRtoVal", title:"납입중환급금비율", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value==null || value=='' || value=='ZZ') {
                        if((item.lowNhvRscScCd == null || item.lowNhvRscScCd == "ZZ")) {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
        };
        
        //납입후환급금비율
        var padAftRefndRtoVal = { 
                name: "padAftRefndRtoVal", title:"납입후환급금비율", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value==null || value=='' || value=='ZZ') {
                        if(item.lowNhvRscScCd == null || item.lowNhvRscScCd == "ZZ"
                                || item.dupayRefndRtoVal == null || item.dupayRefndRtoVal == "ZZ") {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
        };
        
        //BLOCK 필드
        var beBlkScCd = { 
                name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 150, align:"center", 
                itemTemplate:function(value, item) {
                    if(value==null || value=='' || value=='ZZ') {
                        if((item.lowNhvRscScCd == null || item.lowNhvRscScCd == "ZZ")
                                || (item.dupayRefndRtoVal == null || item.dupayRefndRtoVal == "ZZ")
                                || (item.padAftRefndRtoVal == null || item.padAftRefndRtoVal == "ZZ") ) {
                            return '';
                        }
                        return 'TOTAL';
                    } else if (value==1) {
                        return 'NEW';
                    } else if (value==2) {
                        return 'OLD';
                    }
                }
        };
     
        //납입상태 필드
        var beFpayYnScCd = { 
                name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 120, align:"center",
                itemTemplate:function(value, item) {
                    if(value==null || value=='' || value=='ZZ') {
                        if((item.lowNhvRscScCd == null || item.lowNhvRscScCd == "ZZ")
                                || (item.dupayRefndRtoVal == null || item.dupayRefndRtoVal == "ZZ")
                                || (item.padAftRefndRtoVal == null || item.padAftRefndRtoVal == "ZZ")
                                || (item.beBlkScCd == null) || item.beBlkScCd == "ZZ") {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        for(i=0; i<beFpayYnScCdArr.length; i++) {
                            if(value == beFpayYnScCdArr[i].code) {
                                return beFpayYnScCdArr[i].codeNm;
                            }
                        }
                        return value;
                    }
                }
        };
        //채널유형 필드
        var beChnlScCd = {
                name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 80, align:"center",
                itemTemplate:function(value, item) {
                    if(value==null || value=='' || value=='ZZ') {
                        if((item.lowNhvRscScCd == null || item.lowNhvRscScCd == "ZZ")
                                || (item.dupayRefndRtoVal == null || item.dupayRefndRtoVal == "ZZ")
                                || (item.padAftRefndRtoVal == null || item.padAftRefndRtoVal == "ZZ")
                                || (item.beBlkScCd == null || item.beBlkScCd == "ZZ")
                                || (item.beFpayYnScCd == null || item.beFpayYnScCd == "ZZ") ) {
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
                    } else {
                        return $._commonObj["code"]["BE_CHNL_SC_CD"][value-1].codeNm;
                    }
                }
        };
        //상풍유형 필드
        var beNewLobCd = { 
                name: "beNewLobCd" , title:"상품유형" , css:"cell", type: "select", width: 100, editing: false, align:"center",
                itemTemplate:function(value, item) {
                    if(value==null || value==''|| value=='ZZ') {
                        if((item.lowNhvRscScCd == null || item.lowNhvRscScCd == "ZZ")
                                || (item.dupayRefndRtoVal == null || item.dupayRefndRtoVal == "ZZ")
                                || (item.padAftRefndRtoVal == null || item.padAftRefndRtoVal == "ZZ")
                                || (item.beBlkScCd == null || item.beBlkScCd == "ZZ")
                                || (item.beFpayYnScCd == null || item.beFpayYnScCd == "ZZ")
                                || (item.beChnlScCd == null || item.beChnlScCd == "ZZ") ) {
                            return '';
                        }
                        return 'TOTAL';
                   } else {
                       return $._commonObj["code"]["BE_NEW_LOB_CD"][value*1].codeAbbrNm;
                   }
                }
        };
        
        //전체 필드
        var allInfo = { name: "total", title:"전체", css:"cell", type: "text",  width: 80, align:"right", sorter:"number",
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
        };
        
        fieldsArray1 = [];
        fieldsArray1.push(lowNhvRscScCd);
        fieldsArray1.push(dupayRefndRtoVal);
        fieldsArray1.push(padAftRefndRtoVal);
        fieldsArray1.push(beBlkScCd);
        fieldsArray1.push(beFpayYnScCd);
        fieldsArray1.push(beChnlScCd);
        fieldsArray1.push(beNewLobCd);
       
        var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
        var titelArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12+"];
        var fieldsArr = getPsgYysFieldsArr(targetArr, titelArr);
        fieldsArray1 = fieldsArray1.concat(fieldsArr);
        //TOTAL세팅
        fieldsArray1.push(allInfo);
    }
    
    if ($("#sbx_srhGubun").val() == "4" //연금일시해지율
    || $("#sbx_srhGubun").val() == "5") { //연금개시후해지율
        if ($("#sbx_srhGubun").val() == "4") { //연금일시해지율
            var gridNm = "beKidiOnpadScCd";
            var gridTitle = "납입방법";
            var gridCode = "BE_KIDI_ONPAD_SC_CD";
        }
        if ($("#sbx_srhGubun").val() == "5") { //연금개시후해지율
            var gridNm = "beAnutPymMthCd";
            var gridTitle = "연금지급유형";
            var gridCode = "BE_ANUT_PYM_MTH_CD";
        }

        fieldsArray1 =  
            [
                { name: gridNm, title:gridTitle, css:"cell", type: "select", width: 100, align:"center"
                    , items: $.fn.getGridCodeItem(gridCode, true, "label", "", "TOTAL", "TOTAL"), textField: "codeNm", valueField: "code"},
                { name: "blkScOld", title:"Old_block", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "dvdRateDcdTp", title:"(유배당)금리확정형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                         return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "dvdRateInlckTp", title:"(유배당)금리연동형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "woDivRateDcdTp", title:"(무배당)금리확정형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "woDivRateInlckTp", title:"(무배당)금리연동형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "vaIns", title:"(무배당)변액", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                }
            ];
            if ($("#sbx_srhGubun").val() == "4" || $("#sbx_srhGubun").val() == "5") {
                fieldsArray1.push(
                { name: "total", title: "전체", css:"cell", type: "text", width: 100, align:"right", 
                        itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                }
                );
            }
        }

    if ($("#sbx_srhGubun").val() == "6") { //연금선택율
        fieldsArray1 =  
        [
            { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 40, align:"center",
                itemTemplate:function(value, item){ // 상품유형, TOTAL 동시 표시
                      if(value==null || value=="") {
                        return 'TOTAL';
                      } else if(value=="ZZ") {
                          return 'TOTAL';
                      } else {
                        return $._commonObj["code"]["BE_NEW_LOB_CD"][value*1].codeAbbrNm;
                      }
                }
            },
            { name: "beAnutPymMthCd", title:"연금지급방법", css:"cell", type: "select", width: 40, align:"center",
                itemTemplate:function(value, item){ // 상품유형, TOTAL 동시 표시
                     if(value==null || value=="") {
                        if (item.beNewLobCd == null) {
                            return '';
                        } else if(item.beNewLobCd != null) {
                            return 'TOTAL';
                        }
                     } else if(value=="ZZ") {
                         return 'TOTAL';
                     } else {
                        return $._commonObj["code"]["BE_ANUT_PYM_MTH_CD"][value-1].codeNm;
                     }
                
                }
            },
            { name: "wholeLife", title:"종신", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);}},
            { name: "establish", title:"확정", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);}},
            { name: "inheritance", title:"상속", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);}},
            { name: "whole", title:"전체", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);}}
            ]
        }

        if ($("#sbx_srhGubun").val() == "7" //유예납입율
        || $("#sbx_srhGubun").val() == "9" //추가납입율
        || $("#sbx_srhGubun").val() == "10") { //중도인출율
            if ($("#sbx_srhGubun").val() == "7") { //유예납입율
                var gridNm1 = "prpadPsbUlPrdtYn";
                var gridTitle1 = "납입유형";
                var gridCode1 = "PRPAD_PSB_UL_PRDT_YN";
                var gridCodeArr1 = "";
                
                var gridNm2 = "beNewLobCd";
                var gridTitle2 = "상품유형";
                var gridCode2 = "BE_NEW_LOB_CD";
                var gridCodeArr2 = beNewLobCdArr;
                
                var gridNm3 = "beOblgPadYysCd";
                var gridTitle3 = "의무납입기간";
                var gridCode3 = "BE_OBLG_PAD_YYS_CD";
                var gridCodeArr3 = beOblgPadYysCdArr;
            }

            if ($("#sbx_srhGubun").val() == "9") { //추가납입율
                var gridNm1 = "beFpayYnScCd";
                var gridTitle1 = "납입상태";
                var gridCode1 = "BE_FPAY_YN_SC_CD";
                var gridCodeArr1 = beFpayYnScCdArr;
                
                var gridNm2 = "beChnlScCd";
                var gridTitle2 = "채널유형";
                var gridCode2 = "BE_CHNL_SC_CD";
                var gridCodeArr2 = beChnlScCdArr;
                
                var gridNm3 = "beNewLobCd";
                var gridTitle3 = "상품유형";
                var gridCode3 = "BE_NEW_LOB_CD";
                var gridCodeArr3 = beNewLobCdArr;
            }

            if ($("#sbx_srhGubun").val() == "10") { //중도인출율
                var gridNm1 = "beFpayYnScCd";
                var gridTitle1 = "납입상태";
                var gridCode1 = "BE_FPAY_YN_SC_CD";
                var gridCodeArr1 = beFpayYnScCdArr;
                
                var gridNm2 = "beChnlScCd";
                var gridTitle2 = "채널유형";
                var gridCode2 = "BE_CHNL_SC_CD";
                var gridCodeArr2 = beChnlScCdArr;
                
                var gridNm3 = "beNewLobCd";
                var gridTitle3 = "상품유형";
                var gridCode3 = "BE_NEW_LOB_CD";
                var gridCodeArr3 = beNewLobCdArr;
            }
            
            fieldsArray1 =  
                [
                    { name: gridNm1, title:gridTitle1, css:'cell', type: 'select', width: 100, align:'center', editing: false
                        ,  itemTemplate:function(value, item) {
                            var textField = "TOTAL";
                            if ($("#sbx_srhGubun").val() == "7") {
                                if(value == "N") {
                                    textField = "GENERAL";
                                } else if(value == "Y") {
                                    textField = "PREPAY";
                                }
                            } else {
                                for(i=0; i<gridCodeArr1.length; i++) {
                                    if(value == gridCodeArr1[i].code) {
                                        textField = gridCodeArr1[i].codeNm;
                                        break;
                                    }
                                }
                            }
                            return textField;
                        }
                    },
                    { name: gridNm2, title:gridTitle2, css:'cell', type: 'select', width: 100, align:'center', editing: false
                        ,  itemTemplate:function(value, item) {
                            var textField = "TOTAL";
                            for(i=0; i<gridCodeArr2.length; i++) {
                                if(value == gridCodeArr2[i].code) {
                                    if ($("#sbx_srhGubun").val() == "7") { //유예납입율
                                        textField = gridCodeArr2[i].codeAbbrNm;
//                                      textField = gridCodeArr2[i].codeNm;
                                    } else {
                                        textField = gridCodeArr2[i].codeNm;
                                    }
                                    break;
                                }
                            }
                            textField = getEmptyFieldText("2", textField, item);
                            return textField;
                        }
                    },
                    { name: gridNm3, title:gridTitle3, css:'cell', type: 'select', width: 100, align:'center', editing: false
                        ,  itemTemplate:function(value, item) {
                            var textField = "TOTAL";
                            for(i=0; i<gridCodeArr3.length; i++) {
                                if(value == gridCodeArr3[i].code) {
                                    if ($("#sbx_srhGubun").val() == "9" || $("#sbx_srhGubun").val() == "10") { //중도인출율
                                        textField = gridCodeArr3[i].codeAbbrNm;
//                                      textField = gridCodeArr3[i].codeNm;
                                    } else { //그 외
                                        textField = gridCodeArr3[i].codeNm;
                                    }
                                    break;
                                }
                            }
                            textField = getEmptyFieldText("3", textField, item);
                            return textField;
                        }
                    }
                ];
                fieldsArr = getPsgYysFieldsArr(targetArr, subTxt);
                fieldsArray1 = fieldsArray1.concat(fieldsArr);
                fieldsArray1.push(allInfo); 
        }
        if ($("#sbx_srhGubun").val() == "8"){ //갱신율
            fieldsArray1 =  
                [
                    { name: "renwTypPrdtScCd", title:"상품유형", css:"cell", type: "select", width: 100, align:"center",
                        itemTemplate:function(value, item){ // 상품유형, TOTAL 동시 표시
                            if (val == "1") { //산출적용
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
                            } else { //기초데이터
                                 if(value==null) {
                                     return 'TOTAL';
                                 } else if (value=='025' || value=='026' || value=='027') {
                                     return '실손 TOTAL'
                                 } else if (value=='045' || value=='046' || value=='047') {
                                     return '실손외 TOTAL'
                                 } else {
                                     return $._commonObj["code"]["RENW_TYP_PRDT_SC_CD"][value-1].codeNm;
                                 }
                            }
                            
                            
                        }
                    },
                    { name: "renwCylScCd", title:"갱신주기", css:"cell", type: "select", width: 100, align:"center",
                        itemTemplate:function(value, item){ // 상품유형, TOTAL 동시 표시
                            if (val == "1") { //산출적용
                                if(value == 'ZZ' && item.renwTypPrdtScCd == 'ZZ') {
                                    return '';
                                } else if (value == 'ZZ' && item.renwTypPrdtScCd != 'ZZ') {
                                    return 'TOTAL'
                                } else if (value == null || value == '') {
                                    return '';
                                } else {
                                    return $._commonObj["code"]["RENW_CYL_SC_CD"][value-1].codeNm;
                                }
                            } else { //기초데이터
                                if(value==null) {
                                    if(item.renwTypPrdtScCd==null && $('input:checkbox[id="chk_hierachy_check1"]').is(":checked") == true) return "";
                                    else return 'TOTAL';
                                } else if (value=='025' || value=='026' || value=='027') {
                                    return "";
                                } else if (value=='045' || value=='046' || value=='047') {
                                    return "";
                                } else {
                                    return $._commonObj["code"]["RENW_CYL_SC_CD"][value-1].codeNm;
                                }
                            }
                            
                        }
                    },
//                  { name: "renwTms1", title:"1회차", css:"cell", type: "text", width: 90, align:"right", itemTemplate:function(value, item) {
//                      return $.fn.isEmpty(value) ? "0"+subTxt : (value.toString()+subTxt)}},
//                  { name: "renwTms2", title:"2회차", css:"cell", type: "text", width: 90, align:"right", itemTemplate:function(value, item) {
//                      return $.fn.isEmpty(value) ? "0"+subTxt : (value.toString()+subTxt)}},
//                  { name: "renwTms3", title:"3회차", css:"cell", type: "text", width: 90, align:"right", itemTemplate:function(value, item) {
//                      return $.fn.isEmpty(value) ? "0"+subTxt : (value.toString()+subTxt)}},
//                  { name: "renwTms4", title:"4회차+", css:"cell", type: "text", width: 90, align:"right", itemTemplate:function(value, item) {
//                      return $.fn.isEmpty(value) ? "0"+subTxt : (value.toString()+subTxt)}}
                    ];
            for(var i=1; i<=4; i++) {
                if(i==4) {
                    var field = { name: "renwTms"+i, title:i+"회차+", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
                    fieldsArray1.push(field);
                } else {
                    var field = { name: "renwTms"+i, title:i+"회차", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
                    fieldsArray1.push(field);
                }
            }
            if (val=="2") {
                fieldsArray1.push({ name: "whole", title:"전체", css:"cell", type: "text", width: 90, align:"right", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}});
            }
        }
        
        if ($("#sbx_srhGubun").val() == "11"){ //보험계약대출율
            var gridNm1 = "pllnRatScCd";
            var gridTitle1 = "납입상태";
            var gridCode1 = "PLLN_RAT_SC_CD";
            var gridCodeArr1 = pllnRatScCdArr;
                
            var gridNm2 = "beChnlScCd";
            var gridTitle2 = "채널유형";
            var gridCode2  = "BE_CHNL_SC_CD";
            var gridCodeArr2 = beChnlScCdArr;
                
            var gridNm3 = "beWrkexPotflScCd";
            var gridTitle3 = "포트폴리오";
            var gridCode3 = "BE_WRKEX_POTFL_SC_CD";
            var gridCodeArr3 = beWrkexPotflScCdArr;
                
            var gridNm4 = "lowNhvRscScCd";
            var gridTitle4 = "저무해지구분";
            var gridCode4 = "LOW_NHV_RSC_SC_CD";
            var gridCodeArr4 = lowNhvRscScCdArr;
                
            var gridNm5 = "rstrRatScCd";
            var gridTitle5 = "환급유형";
            var gridCode5 = "RSTR_RAT_SC_CD";
            var gridCodeArr5 = rstrRatScCdArr;
                
            var gridNm6 = "pllnRatPrdtClsfCd";
            var gridTitle6 = "상품유형";
            var gridCode6 = "PLLN_RAT_PRDT_CLSF_CD";
            var gridCodeArr6 = pllnRatPrdtClsfCdArr;
            
            fieldsArray1 =  
                [
                    { name: "pllnRatScCd", title:"납입상태", css:'cell', type: 'select', width: 90, align:'center', editing: false
                        ,  itemTemplate:function(value, item) {
                            var textField = "TOTAL";
                            for(i=0; i<gridCodeArr1.length; i++) {
                                if(value == gridCodeArr1[i].code) {
                                    textField = gridCodeArr1[i].codeNm;
                                    break;
                                }
                            }
                            return textField;
                        }
                    },
                    { name: "beChnlScCd", title:"채널", css:'cell', type: 'select', width: 90, align:'center', editing: false
                        ,  itemTemplate:function(value, item) {
                            var textField = "TOTAL";
                            for(i=0; i<gridCodeArr2.length; i++) {
                                if(value == gridCodeArr2[i].code) {
                                    textField = gridCodeArr2[i].codeNm;
                                    break;
                                }
                            }
                            textField = getEmptyFieldText("2", textField, item);
                            return textField;
                        }
                    },
                    { name: "beWrkexPotflScCd", title:"포트폴리오", css:'cell', type: 'select', width: 90, align:'center', editing: false
                        ,  itemTemplate:function(value, item) {
                            var textField = "TOTAL";
                            for(i=0; i<gridCodeArr3.length; i++) {
                                if(value == gridCodeArr3[i].code) {
                                    textField = gridCodeArr3[i].codeNm;
                                    break;
                                }
                            }
                            textField = getEmptyFieldText("3", textField, item);
                            return textField;
                        }
                    }
                    ,
                    { name: "lowNhvRscScCd", title:"저무해지구분", css:'cell', type: 'select', width: 90, align:'center', editing: false
                        ,  itemTemplate:function(value, item) {
                            var textField = "TOTAL";
                            for(i=0; i<gridCodeArr4.length; i++) {
                                if(value == gridCodeArr4[i].code) {
                                    textField = gridCodeArr4[i].codeNm;
                                    break;
                                }
                            }
                            textField = getEmptyFieldText("4", textField, item);
                            return textField;
                        }
                    }
                    ,
                    { name: "rstrRatScCd", title:"환급유형", css:'cell', type: 'select', width: 90, align:'center', editing: false
                        ,  itemTemplate:function(value, item) {
                            var textField = "TOTAL";
                            for(i=0; i<gridCodeArr5.length; i++) {
                                if(value == gridCodeArr5[i].code) {
                                    textField = gridCodeArr5[i].codeNm;
                                    break;
                                }
                            }
                            textField = getEmptyFieldText("5", textField, item);
                            return textField;
                        }
                    }
                    ,
                    { name: "pllnRatPrdtClsfCd", title:"상품유형", css:'cell', type: 'select', width: 90, align:'center', editing: false
                        ,  itemTemplate:function(value, item) {
                            var textField = "TOTAL";
                            for(i=0; i<gridCodeArr6.length; i++) {
                                if(value == gridCodeArr6[i].code) {
                                    textField = gridCodeArr6[i].codeNm;
                                    break;
                                }
                            }
                            textField = getEmptyFieldText("6", textField, item);
                            return textField;
                        }
                    }
                ];
            fieldsArr = getPsgYysFieldsArr(targetArr, subTxt);
            fieldsArray1 = fieldsArray1.concat(fieldsArr);
            fieldsArray1.push(allInfo); 
        }
        
        if ($("#sbx_srhGubun").val() == "12"){ //연금전환율
            fieldsArray1 = [];
            if (val=="1"){ //상품유형기준
            	
                fieldsArray1.push(
                        { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 100, align:"center"
                            , itemTemplate:function(value, item) {
                                if(value=="ZZ") {
                                    return 'TOTAL';
                                } else if(value.substr(0,1)==0) {
                                    var index = value.substr(1,2);
                                    return $._commonObj["code"]["BE_NEW_LOB_CD"][index].codeAbbrNm;
                                } else {
                                    return $._commonObj["code"]["BE_NEW_LOB_CD"][value].codeAbbrNm;
                                }
                            }
                        },
                        { name: "srndmPrmAcumAmt01", title:"전환금액", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},
                        { name: "srndmPrmAcumAmt02", title:"대상금액", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},
                        { name: "cnvrRat", title:"전환율", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5)}}
                    )

            } else { //마감년도기준
            	
            	fieldsArray1.push(
                        { name: "finYm", title:"마감년도", css:"cell", type: "text", width: 50, align:"center"
                        	, itemTemplate:function(value, item) {
			                    if(value==null) {
			                    	return 'TOTAL';
			                    } else {
			                    	return value;
			                    }
                        	}
		                },
                        { name: "occuCnt", title:"발생건수", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},
                        { name: "accrueCnt", title:"누적건수", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},
                        { name: "srndmPrmAcumAmt01", title:"전환금액", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},
                        { name: "srndmPrmAcumAmt02", title:"대상금액", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},     
                        { name: "cnvrRat", title:"전환율", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5)}}
            	)
            }
        }
        
    fieldsArrayObj = fieldsArray1;
    return fieldsArrayObj;
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
function getPsgYysFieldsArr(targetArr, subTxt) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    var addVal="";
    var fieldNm = "psgYys";
    var widthPx = 60;
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        if (i==11) addVal = "+";
        var distStndValField = { name: fieldNm+target , title: target+addVal+"차년", css:"cell", type: "text", width: widthPx, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }};
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}

/**
* @설명: 경험조정 - jsGrid 빈 테이블 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 7. 최초작성
*/
function initGridItem(val){
    // jsGrid 빈 테이블 생성
    var fieldsArr;
    var gridObject;
    if ($("#sbx_srhGubun").val() == "2") { //사업비율
        var beWrkexPotflScCd = "";
        
        if ($("#sbx_srhGubunSub option:selected").val() == "01") {
            beWrkexPotflScCd = $("#sbx_srhTypeSub option:selected").val();
            $("#divSel2").show();
            $("#divSel3").hide();
        }
        if ($("#sbx_srhGubunSub option:selected").val() == "02") {
            beWrkexPotflScCd = "";
            $("#divSel3").show();
            $("#divSel2").hide();
        }

        fieldsArr = getGridFields(val);
        gridObject = new ComJsGrid({
            id: "gridDiv"+val,  
            height: "320",
            editing: false,
            sorting: true,
            paging: false,
            rowClass: function(item, itemIndex) {
                if(val == "2" && itemIndex == 0) {
                    return "sub-total";
                }
            },
            headerRowRenderer: function() {
              return getGridHederRow1(beWrkexPotflScCd, "01");
            },
            selectHiglight:true,
            fields : fieldsArr
        });
    } else if ($("#sbx_srhGubun").val() == "4" || $("#sbx_srhGubun").val() == "5") { //연금일시해지율, 연금개시후해지율
        fieldsArr = getGridFields(val);
        gridObject = new ComJsGrid({
            id: "gridDiv"+val,  
            height: "320",
            editing: false,
            sorting: true,
            paging: false,
            headerRowRenderer: function() {
              return getGridHederRow2();
            },
            selectHiglight:true,
            fields : fieldsArr
        });
    } else if ($("#sbx_srhGubun").val() == "12") { //연금전환율
        fieldsArr = getGridFields(val);
        //상품유형기준
        if (val=="1"){
            gridObject = new ComJsGrid({
                id: "gridDiv"+val,  
                height: "320",
                editing: false,
                sorting: true,
                paging: false,
                headerRowRenderer: function() {
                  return getGridHederRow3();
                },
                selectHiglight:true,
                fields : fieldsArr
            });
        } else { //마감년도기준
            gridObject = new ComJsGrid({
                id: "gridDiv"+val,  
                height: "320",
                editing: false,
                sorting: true,
                paging: false,
                headerRowRenderer: function() {
                    return getGridHederRow4();
                  },
                selectHiglight:true,
                fields : fieldsArr
            });
        }
    }
    else { //그외
        var pagingYn = false;
        if ($("#sbx_srhGubun").val() == "1" //위험율
            || $("#sbx_srhGubun").val() == "3" //해지율
            || $("#sbx_srhGubun").val() == "7" //유예납입율
            || $("#sbx_srhGubun").val() == "9" //추가납입율
            || $("#sbx_srhGubun").val() == "10" //중도인출율
            || $("#sbx_srhGubun").val() == "11") { //보험계약대출율
            pagingYn = true;
        }
        
        fieldsArr = getGridFields(val);
        gridObject = new ComJsGrid({
            id: "gridDiv"+val,  
            height: "320",
            editing: false,
            sorting: true,
            paging: pagingYn,
            selectHiglight:true,
            fields : fieldsArr
        });
    }
    
    //연금전환율 우측 상단 표시단위 처리
    if ($("#sbx_srhGubun").val() == "12") { //연금전환율
		$("#fr").text("(단위: 백만, %)");
		$("#fr2").text("(단위: 건, 원, %)");
    } else {
		$("#fr").text("(단위: %)");
		$("#fr2").text("(단위: %)");
    }

    //그리드 생성
    gridObject.gridCreate();
}

/**
 * @설명: 서비스코드 정의
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
**/
function getAssScCd() {
    var assScCd;
    
    if ($("#sbx_srhGubun").val() == "1") { //위험율
        assScCd = "01";
    }
    if ($("#sbx_srhGubun").val() == "2") { //사업비율
        assScCd = "02";
    }
    if ($("#sbx_srhGubun").val() == "3") { //해지율
        assScCd = "03";
    }
    if ($("#sbx_srhGubun").val() == "4") { //연금일시해지율
        assScCd = "04";
    }
    if ($("#sbx_srhGubun").val() == "5") { //연금개시후해지율
        assScCd = "05";
    }
    if ($("#sbx_srhGubun").val() == "6") { //연금선택율
        assScCd = "06";
    }
    if ($("#sbx_srhGubun").val() == "7") { //유예납입율
        assScCd = "08";
    }
    if ($("#sbx_srhGubun").val() == "8") { //갱신율
        assScCd = "09";
    }
    if ($("#sbx_srhGubun").val() == "9") { //추가납입율
        assScCd = "10";
    }
    if ($("#sbx_srhGubun").val() == "10") { //중도인출율
        assScCd = "11";
    }
    if ($("#sbx_srhGubun").val() == "11") { //보험계약대출율
        assScCd = "12";
    }
    if ($("#sbx_srhGubun").val() == "12"){ //연금전환율
        assScCd = "07";
    }
    return assScCd;
}

/**
 * @설명: 공통코드에서 선택 마감년월에 대한 정보를 조회한다.
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
 */
function selectFinYmInfo(val) {
    var assScCd = getAssScCd();
    var aplcBeList = [];
    var finYm;
    var be = "";
    var reqParam = {};
    
    reqParam = {
            "assScCd" : assScCd
    };
    finYm = val;

    //공통코드 유효값 조회 및 be 조회
    $.callAjax(reqParam, "/be/pd/commonBe/selectAplcBeList.do",{async:false})
    .done(function(data) {
        aplcBeList = data.aplcBeList;
        condAplcBe = data.aplcBeList;
        aplcBeList = aplcBeList.sort(function (a, b) {
            return a.aplcBeNm.substr(0,4) < b.aplcBeNm.substr(0,4) ? -1 : a.aplcBeNm.substr(0,4) > b.aplcBeNm.substr(0,4) ? 1 : 0;
        });
        be = aplcBeList[aplcBeList.length-1].aplcBeNm;
    }).fail(function(data) {
        console.log("fail to fn.getAplcBe!!!!");
    });
    return be;
}

/**
 * @설명: 조회조건별 모니터링 조회한다.
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
 */
function selectMntrList() {
    var reqParam = {};
    var selAplcBe;
    var list = {};

    // condAplcBe
    val = $("#ibx_finYmTo").val().replace("-", "");
    selAplcBe = selectFinYmInfo(val);

    if ($("#sbx_srhGubun").val() == "2") {
        if ($.fn.isEmpty($("#sbx_srhGubunSub option:selected").val())) {
            $.fn.msgBox("유형구분은 필수선택항목입니다.", function() {
                $("#sbx_srhGubunSub").focus();
            });
            return false;
        }
        
        if ($.fn.isEmpty($("#sbx_srhType option:selected").val())) {
            $.fn.msgBox("채널유형은 필수선택항목입니다.", function() {
                $("#sbx_srhType").focus();
            });
            return false;
        }
        
        if ($("#sbx_srhGubunSub option:selected").val() == "01") {
            if ($.fn.isEmpty($("#sbx_srhTypeSub option:selected").val())) {
                $.fn.msgBox("포트폴리오는 필수선택항목입니다.", function() {
                    $("#sbx_srhTypeSub").focus();
                });
                return false;
            }
        }
        if ($("#sbx_srhGubunSub option:selected").val() == "02") {
            if ($.fn.isEmpty($("#sbx_srhTypeSub2 option:selected").val())) {
                $.fn.msgBox("상품유형은 필수선택항목입니다.", function() {
                    $("#sbx_srhTypeSub2").focus();
                });
                return false;
            }
        }
    }

    if ($("#sbx_srhGubun").val() == "1") {
        $("#titleNm1").text("위험율 최적가정(" + selAplcBe + ")");
    }
    if ($("#sbx_srhGubun").val() == "2") {
        $("#titleNm1").text("실제 사업비 최적가정(" + selAplcBe + ")");
        var beWrkexChnlScCd = $("#sbx_srhType").val(); // 채널
        var beWrkexPotflScCd = $("#sbx_srhTypeSub option:selected").val(); // 포트폴리오 코드
        var beWrkexPotflScCdSub = $("#sbx_srhTypeSub option:selected").val().substr(0, 1); // 포트폴리오 코드 서브

        reqParam.beWrkexChnlScCd = beWrkexChnlScCd;
        reqParam.beWrkexPotflScCd = beWrkexPotflScCd;
        reqParam.beWrkexPotflScCdSub = beWrkexPotflScCdSub;
    }
    if ($("#sbx_srhGubun").val() == "3") {
        $("#titleNm1").text("해지율 최적가정(" + selAplcBe + ")");
    }
    if ($("#sbx_srhGubun").val() == "4") {
        $("#titleNm1").text("연금일시해지율 최적가정(" + selAplcBe + ")");
    }
    if ($("#sbx_srhGubun").val() == "5") {
        $("#titleNm1").text("연금개시후해지율 최적가정(" + selAplcBe + ")");
    }
    if ($("#sbx_srhGubun").val() == "6") {
        $("#titleNm1").text("연금선택율 최적가정(" + selAplcBe + ")");
    }
    if ($("#sbx_srhGubun").val() == "7") {
        $("#titleNm1").text("유예납입율 최적가정(" + selAplcBe + ")");
    }
    if ($("#sbx_srhGubun").val() == "8") {
        $("#titleNm1").text("갱신율 최적가정(" + selAplcBe + ")");
    }
    if ($("#sbx_srhGubun").val() == "9") {
        $("#titleNm1").text("추가납입율 최적가정(" + selAplcBe + ")");
    }
    if ($("#sbx_srhGubun").val() == "10") {
        $("#titleNm1").text("중도인출율 최적가정(" + selAplcBe + ")");
    }
    if ($("#sbx_srhGubun").val() == "11") {
        $("#titleNm1").text("보험계약대출율 최적가정(" + selAplcBe + ")");
    }
    if ($("#sbx_srhGubun").val() == "12") {
        $("#titleNm1").text("연금전환율 모니터링_상품유형 기준");
        $("#titleNm2").text("연금전환율 모니터링_마감년도 기준");
    } 
    else {
        $("#titleNm2").text("월별 누계 모니터링");
    }
    
    //조회용 날짜 생성
    getStFnYYmmDateSet();
    
    reqParam.strYmFrom = gStrStYYMM;
    reqParam.finYmTo =  gFinStYYMM;
    reqParam.aplcBe = selAplcBe;
    reqParam.srhGubun = $("#sbx_srhGubun").val();

    gAplcBe = selAplcBe;
    
    //엑셀 validation 체크용 오브젝트
    gReqParam.finYmTo = $("#ibx_finYmTo").val().replace("-", "");
    gReqParam.srhGubun = $("#sbx_srhGubun").val();
    
    //사업비율
    if ($("#sbx_srhGubun").val() == "2") {
        typSc = $("#sbx_srhGubunSub option:selected").val();
        //사업비율 추가 인자값
        reqParam.potflLobScCd = $("#sbx_srhGubunSub").val(); //유형구분
        reqParam.beWrkexChnlScCd = $("#sbx_srhType").val(); //채널
        reqParam.beWrkexPotflScCd = $("#sbx_srhTypeSub option:selected").val(); //포트폴리오 코드
        reqParam.assProdAplcScCd = "05"; //가정산출구분코드(05:최종BE)
        
        //유형구분: 포트폴리오
        if(typSc == "01") {
            reqParam.potflLobCdVal = $("#sbx_srhTypeSub option:selected").val(); //포트폴리오 코드
        } else {
            reqParam.potflLobCdVal = $("#sbx_srhTypeSub2 option:selected").val();
        }
        
        //사업비율 엑셀 validation 체크용 오브젝트
        gReqParam.srhGubunSub = $("#sbx_srhGubunSub option:selected").val();
        gReqParam.srhType = $("#sbx_srhType").val();
        gReqParam.srhTypeSub = $("#sbx_srhTypeSub option:selected").val();
        gReqParam.srhTypeSub2 = $("#sbx_srhTypeSub2 option:selected").val();
    }

    // 파라미터 세팅
    $.callAjax(reqParam, "/be/mt/bemt111m/selectMntrList.do").done(
            function(data) {
                // 그리드 초기화
                resetGrid();
                reDrawGrid();

                // 그리드 바인딩
                var grid1List = data.lastBeList;
                var grid2List = data.rateList;
                
                if ($("#sbx_srhGubun").val() == "8"){ //갱신율
                    var midList = data.midList;
                    if(midList != null && midList.length>0) {
                        for(var i=0; i<grid2List.length; i++) {
                            if(grid2List[i].renwTypPrdtScCd == '02' && grid2List[i].renwCylScCd == null) {
                                grid2List.splice(i+1, 0, midList[0]);
                                continue;
                            } else if(grid2List[i].renwTypPrdtScCd == '04' && grid2List[i].renwCylScCd == null) {
                                grid2List.splice(i+1, 0, midList[3]);
                                continue;
                            }
                        }
                    }
                }

                // 0건 그리드 메세지 처리부분
                if(grid1List == null || grid1List.length == 0){
                    $.fn.getReturnValue("gridDiv1");
                } else {
                    if($("#sbx_srhGubun").val() == "2") {
                        if($.fn.isEmpty(grid1List) || grid1List.length == 1){
                            $.fn.getReturnValue("gridDiv1");
                        } else {
                            $("#gridDiv1").jsGrid("loadData", grid1List).done();
                        }
                    } else {
                        $("#gridDiv1").jsGrid("loadData", grid1List).done();
                    }
                    
                }
                if(grid2List == null || grid2List.length == 0){
                    $.fn.getReturnValue("gridDiv2");
                } else {
                    $("#gridDiv2").jsGrid("loadData", grid2List).done();
                }
                gCondFlag = "Y";
            }).fail(function(data) {
        // $.fn.msgBox("[ajax] 서버 통신 실패입니다.");
        console.log("fail to selectMntrList !!");
    });
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
 */
function resetGrid() {
    $("#gridDiv1").jsGrid("reset");
    $("#gridDiv1").jsGrid("option", "data", []);
    $("#gridDiv2").jsGrid("reset");
    $("#gridDiv2").jsGrid("option", "data", []);
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
    $("#gridDiv1").jsGrid("destroy");
    $("#gridDiv2").jsGrid("destroy");

    //그리드 create
    initGridItem(1);
    initGridItem(2);
}

/**
 * @설명: 시작년월 - 종료년월에 따른 해당 년도 리턴
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 14 최초작성
 */
function getFinYear(finYear) {
    var d =  new Date(finYear.substring(0,4), finYear.substring(5,7)-1);
    
    d.setMonth(d.getMonth()+6);
    
    return d.getFullYear();
}

/**
 * @설명: 최종년월 셋팅 - 년도:현재년 -1년/ 월:6월(고정)
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 최종년월 ex.2020-06
 * @개정이력: 
 *  이준용 2021. 7. 7 최초작성
 */
function setFinYmTo() {

    var nowDate = new Date();
    var year = nowDate.getFullYear() - 1;
    var month = nowDate.getMonth();
    
    var temp = new Date(year, month, "1");
    temp.setMonth(6);
    
    month = temp.getMonth().toString();
    month = month.length == 1 ? "0" + month : month;
    
    var finYm = $.fn.monthFormat(year + month, "-");
    
    return finYm;
}

/**
 * @설명: SQL 조회 년도 가변적 세팅
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 14 최초작성
 */
function getFinYearArr(finYmFrom, finYmTo) {
    var finYearArr = [];
    var finYFrom = getFinYear(finYmFrom);
    var finYTo= getFinYear(finYmTo);
    
    for (var i = finYFrom; i <= finYTo; i++) {
        finYearArr.push(i);
    }
    
    return finYearArr;
}

function initDate() {
    reObj = {};
    var reqParam = {
            "serviceCode" : getAssScCd()
        };
    
    if($("#sbx_srhGubun").val() == "12") {//연금전환율
        $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/mt/bemt111m/selectDateInfo.do",{async:false}) // min, max 데이터 얻어오기
        .done(function(data) {
            tbDateInfo = data.tbDateInfo[0];
            
            var tbStrDate = tbDateInfo.strYm;
            var tbFinDate = tbDateInfo.finYm;
            dateYnChk = false;

            if (tbStrDate != null && tbFinDate != null) {
                dateYnChk = true;
            }
            reObj = {
            		  "beStrYm" : tbStrDate
            		, "strYm" : tbStrDate
                    , "finYm" : tbFinDate
                };
            $.fn.initDatePicker(reObj);
        }).fail(function(data) {
            console.log("fail to fn.getTbDateInfo!!!!");
        });
    } else {
	    $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/commonBe/selectTbDateInfo.do",{async:false}) // min, max 데이터 얻어오기
	    .done(function(data) {
	        tbDateInfo = data.tbDateInfo[0];
	        var tbStrDate = tbDateInfo.strYm;
	        var tbFinDate = tbDateInfo.finYm;
	        var defDate;
	        dateYnChk = false;
	
	        if (tbStrDate == null && tbFinDate == null) { //사용자 min, max 날짜데이터가 없는 경우 be데이터 가져오는 분기 
	            defDate = initAplcDate2();
	            tbStrDate = defDate.finYm;
	            tbFinDate = defDate.finYm;
	            dateYnChk = false;
	        } else {
	            defDate = initAplcDate2();
	            tbStrDate = defDate.finYm+1; //be테이블의 마감날짜를 스타트날짜로 지정
	            if (tbStrDate >= tbFinDate) { //be테이블의 설정값보다 사용자의 데이터 max값이 낮을 경우 마감날짜를 be테이블의 설정값으로 기준 세팅
	                tbFinDate = tbStrDate;
	                dateYnChk = false;
	            } else {
	                dateYnChk = true;
	            }
	            
	        }
	      
	
	        var strYear = removeZero(tbStrDate.substring(0,4));
	        var finYear = removeZero(tbFinDate.substring(0,4));
	        var strMonth = 0;
	        var finMonth = 0;
	        var strYm, finYm;
	        
	        strMonth = removeZero(tbStrDate.substring(4,6));
	        finMonth = removeZero(tbFinDate.substring(4,6));
	
	        const strDateYYMM = new Date(finYear, strMonth, 1);
	        const finDateYYMM = new Date(finYear, finMonth, 1);
	        if(finDateYYMM.getMonth() == 0) {
	            finYm = (finDateYYMM.getFullYear()-1).toString()+"12";
	        } else {
	            finYm = finDateYYMM.getFullYear().toString()+$.fn._addZero(finDateYYMM.getMonth().toString()).toString();
	        }
	        initAplcDate(finYm, dateYnChk);
	        
	    }).fail(function(data) {
	        console.log("fail to fn.getTbDateInfo!!!!");
	    });
    }
}

function initAplcDate(finYmDate, dateYnChk) {
    var assScCd = getAssScCd();
    var reqParam = {};
    var aplcBeList = [];
    var strYm, finYm;
    reObj = {};
    
    reqParam = {
        "assScCd" : assScCd
    };
    $.callAjax(reqParam, "/be/pd/commonBe/selectAplcBeList.do", {
        async : false
    }).done(
            function(data) {
                aplcBeList = data.aplcBeList;
                aplcBeList = aplcBeList
                        .sort(function(a, b) {
                            return a.aplcBeNm.substr(0, 4) < b.aplcBeNm.substr(
                                    0, 4) ? -1
                                    : a.aplcBeNm.substr(0, 4) > b.aplcBeNm
                                            .substr(0, 4) ? 1 : 0;
                        });
                strYm = aplcBeList[aplcBeList.length-1].finStrYm;
                finYm = aplcBeList[aplcBeList.length-1].finEndYm;
                
                //추가
                var strYear = removeZero(strYm.substring(0,4));
                var finYear = removeZero(finYm.substring(0,4));
                var strMonth = 0;
                var finMonth = 0;
                
                strMonth = removeZero(strYm.substring(4,6));
                finMonth = removeZero(finYm.substring(4,6));
                strMonth = Number(finMonth)+1;
                finMonth = Number(finMonth);
                const strDateYYMM = new Date(finYear, strMonth,1);
                const finDateYYMM = new Date(finYear, finMonth,1);
                var stYmDate = strDateYYMM.getFullYear().toString()+$.fn._addZero(strDateYYMM.getMonth().toString()).toString();
                //사용자의 min,max 날짜데이터가 없거나 max가 be테이블의 종료날짜보다 낮거나 같을 경우 마감년원일을 be테이블의 마감날짜로 통합
                if (dateYnChk == false) {
                    finYmDate = stYmDate;
                }
                reObj = {
                        "beStrYm" : strYm
                        , "strYm" : stYmDate
                        , "finYm" : finYmDate
                    };
                $.fn.initDatePicker(reObj);
            }).fail(function(data) {
        console.log("fail to fn.getAplcBe!!!!");
    });
    return;
}

//사용자 날짜데이터가 null일 경우 기본값 설정을 위한 날짜호출 펑션
function initAplcDate2() {
    var assScCd = getAssScCd();
    var reqParam = {};
    var aplcBeList = [];
    var strYm, finYm;
    reObj = {};
    
    reqParam = {
        "assScCd" : assScCd
    };
    $.callAjax(reqParam, "/be/pd/commonBe/selectAplcBeList.do", {
        async : false
    }).done(
            function(data) {
                aplcBeList = data.aplcBeList;
                aplcBeList = aplcBeList
                        .sort(function(a, b) {
                            return a.aplcBeNm.substr(0, 4) < b.aplcBeNm.substr(
                                    0, 4) ? -1
                                    : a.aplcBeNm.substr(0, 4) > b.aplcBeNm
                                            .substr(0, 4) ? 1 : 0;
                        });
                strYm = aplcBeList[aplcBeList.length-1].finStrYm;
                finYm = aplcBeList[aplcBeList.length-1].finEndYm;
                
                //추가
                var strYear = removeZero(strYm.substring(0,4));
                var finYear = removeZero(finYm.substring(0,4));
                var strMonth = 0;
                var finMonth = 0;
                
                strMonth = removeZero(strYm.substring(4,6));
                finMonth = removeZero(finYm.substring(4,6));
                strMonth = Number(strMonth);
                finMonth = Number(finMonth);
                const strDateYYMM = new Date(strYear, strMonth,1);
                const finDateYYMM = new Date(finYear, finMonth,1);
                var stYmDate = strDateYYMM.getFullYear().toString()+$.fn._addZero(strDateYYMM.getMonth().toString()).toString();
                var finYmDate = finDateYYMM.getFullYear().toString()+$.fn._addZero(finDateYYMM.getMonth().toString()).toString();
                reObj = {
                        "beStrYm" : strYm
                        , "strYm" : stYmDate
                        , "finYm" : finYmDate
                    };
            }).fail(function(data) {
        console.log("fail to fn.getAplcBe!!!!");
    });
    return reObj;
}

//조회용 날짜 생성
function getStFnYYmmDateSet() {
    console.log("reObj ? ",reObj);
	//Be테이블에서 시작,종료날짜 호출
    var beStrYm = reObj.beStrYm;
    var strYm = reObj.strYm;
    var beFinYm = reObj.finYm;
    var stNum,setStYY, setStMM, setFinYY, setFinMM;
    
    //선택날짜
    var finYmTo = $("#ibx_finYmTo").val().replace("-", "");
    var setFinYY = finYmTo.substring(0,4);
    var setFinMM = finYmTo.substr(4);
    
    // 시작년월세팅
    if(setFinMM > strYm.substr(4)) { // 선택일자의 월 > 조회시작월
        stNum = Number(beStrYm)+(Number(finYmTo)-Number(strYm));
        setStYY = (stNum+"").substr(0,4);
        setStMM = (stNum+"").substr(4);
        if(setStMM == '12') {
            setStYY++;
            setStMM = 1;
        } else {
            setStMM = (setStMM*1)+1;
        }
    } else { // 선택일자월 < 조회시작월
        setStYY = Number(beStrYm.substr(0,4))+1;
        if(setFinMM == '01') {
            setStMM = '12'
        } else {
            setStMM = Number(setFinMM)-1;
        }
        console.log("setStYY >> ", setStYY, "setStMM >> ", setStMM);
    }
    
    if ($("#sbx_srhGubun").val() == "12"){ //연금전환율
        gStrStYYMM = beStrYm;
        gFinStYYMM = setFinYY+$.fn._addZero(setFinMM.toString()).toString();
    } else {
        gStrStYYMM = setStYY+$.fn._addZero(setStMM.toString()).toString();
        gFinStYYMM = setFinYY+$.fn._addZero(setFinMM.toString()).toString();
        console.log("gStrStYYMM >> ",gStrStYYMM,"gFinStYYMM >> ",gFinStYYMM);
    }
}

/**
* @설명: 모니터링 - 조회시 조건, 현재 조건 체크 
* @최초작성자: 임국빈
* @최초작성일: 2021. 9. 28.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  임국빈 2021. 9. 28. 최초작성
*/
function checkCond() {
    //종료년월체크
    if(gReqParam.finYmTo != $.replaceAll($('#ibx_finYmTo').val().trim(), '-','')) {
        return false;
    }
    
    //조회구분체크
    if(gReqParam.srhGubun != $('#sbx_srhGubun').val()) {
        return false;
    }
    if($("#sbx_srhGubun").val() == "2") {//사업비율
        //조회구분 서브체크
        if(gReqParam.srhGubunSub != $('#sbx_srhGubunSub').val()) {
            return false;
        }
        
        //조회타입체크
        if(gReqParam.srhType != $('#sbx_srhType').val()) {
            return false;
        }
        
        //조회타입 서브체크
        if(gReqParam.srhTypeSub != $('#sbx_srhTypeSub').val()) {
            return false;
        }
        
        //조회타입 서브체크
        if(gReqParam.srhTypeSub2 != $('#sbx_srhTypeSub2').val()) {
            return false;
        }
    }
    return true;
}

//0제거
function removeZero(number) {
    var val = "";
    if (number.length > 1) {
        if (number > 10) {
            val = number;
        } else {
            val = number.substring(1,2);
        }
    } else {
        val = number;
    }
    return val;
}
//0추가
function addZero(number) {
    var val = "";
    if (number.length < 2) {
        if (number > 10) {
            val = number;
        } else {
            val = "0"+number;
        }
    } else {
        val = number;
    }
    
    return val;
}