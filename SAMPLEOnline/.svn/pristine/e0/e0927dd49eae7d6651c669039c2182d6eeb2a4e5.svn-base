/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 중도인출율 - 부가정보
 * @설명: 중도인출율 - 부가정보 화면의 JS
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7.
 * @최종변경일: 
 * @개정이력: 
 *  이현수 2021. 7. 7. 최초작성
 */
var gCondSrchDiv = "1";
var condAplcBe; //적용BE StartDt, EndDt
//조회flag
var gCondFlag = "N";
//조회조건obj
var gReqParam = {};

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    // 공통코드 조회(납입유형,상품유형,채널)
    $.fn.loadCommonCode(["BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD","BE_CHNL_SC_CD"]);
    
    //버튼 권한 처리 2021.06.14
//    $.fn.setBtnPermission([{"btnId":"#btn_excel_download","type":"A"}]);

    //콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //최초로드
    reDrawGrid($("#sbx_midDrotCd").val());
});

/**
* @설명: 콤보박스 초기화
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initCommCd() {
    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","11");
}

/**
* @설명: event 초기화
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initEvent() {
    // 조회
    $('#btn_search').on('click', function(e){
        selectMdrotRatAdtnInfoList();
    });
    
    //엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download').on('click', function(e){
        //데이터 체크
        var dataList = $("#gridDivCnt").jsGrid("option", "data");
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
        
        let fileName = "중도인출율_" + $("#sbx_midDrotCd option:selected").text() + ".xlsx";
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivCnt',
                sheetName : "건수",
                fileName: fileName, 
                applyItemTemplate: true,
                unit: "%",
                searchCond: $.fn.getSearchCondSub("ADTN")
            },
            {
                id: 'gridDivDriver',
                sheetName : "Driver",
                fileName: fileName, 
                applyItemTemplate: true,
                unit: "%"
            },
            {
                id: 'gridDivCnt',
                sheetName : "건수(코드)",
                fileName: fileName, 
                applyItemTemplate: false,
                unit: "%"
            },
            {
                id: 'gridDivDriver',
                sheetName : "Driver(코드)",
                fileName: fileName, 
                applyItemTemplate: false,
                unit: "%"
            }
        ]);
    });
    
    //조회구분 변경 이벤트
    $("#sbx_midDrotCd").on("change", function(e){
        gCondSrchDiv = $("#sbx_midDrotCd").val();
    });
    
    //그래프 클릭
    $("#btn_popGrp").on("click", function(e) {
        if(gCondFlag == "N") {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        openAdtnInfoGrpPopup();
    });
}

/**
* @설명: 중도인출율 - 부가정보 - 건수 jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initGridCnt(midDrotCd) {
    
    var fieldsArr = getGridFields(midDrotCd);
    
    // jsGrid 빈 테이블 생성
    var gridObjectCnt = new ComJsGrid({
        id: "gridDivCnt",
        height: 300,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectCnt.gridCreate();
}

/**
* @설명: 중도인출율 - 부가정보 - Driver jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initGridDriver(midDrotCd){
    //사업비배부유형코드에 따른 그리드 필드 세팅
    var fieldsArr = getGridFields(midDrotCd);
    
    // jsGrid 빈 테이블 생성
    var gridObjectDriver = new ComJsGrid({
        id: "gridDivDriver",
        height: 300,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectDriver.gridCreate();
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
    
    //조회구분체크
    if(gReqParam.midDrotCd != $("#sbx_midDrotCd").val()) {
        return false;
    }

    return true;
}

/**
 * @설명: 건수 기준 Grid 조회
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 7 최초작성
 */
function selectMdrotRatAdtnInfoList(){
    //조회년월 load start
    var selAplcBe = $("#sbx_aplcBe").val();
    gReqParam.selAplcBe = selAplcBe;
    var condFinYmFrom = "";
    var condFinYmTo = "";

    for(var i=0; i<condAplcBe.length; i++) {
        if(condAplcBe[i].aplcBeNm == selAplcBe) {
            condFinYmFrom = condAplcBe[i].finStrYm;
            condFinYmTo = condAplcBe[i].finEndYm;
            break;
        }
    }
    if(condFinYmFrom == "" || condFinYmTo == "") {
        $.fn.msgBox("조회할 적용BE 구간이 존재하지 않습니다.");
        return;
    }
    
    gReqParam.finYmFrom = condFinYmFrom;
    gReqParam.finYmTo = condFinYmTo;
    gReqParam.midDrotCd = $("#sbx_midDrotCd").val();
    //적용BE 조회년도 
    var finYearArr = $.fn.getFinYearArr(condFinYmFrom, condFinYmTo);
    for(var i=0; i<5; i++) {
        gReqParam["finY" + i] = finYearArr[i];
    }

    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd233m/selectMdrotRatAdtnInfoList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        
        ctlTitle(gReqParam.midDrotCd);       //타이틀 세팅
        reDrawGrid(gReqParam.midDrotCd);     //그리드 로딩
        //그리드 바인딩
        var cntListData = data.cntList;
        var driverListtData = data.driverList;
        
        $("#gridDivCnt").jsGrid("loadData", cntListData).done(function(){ });
        $("#gridDivDriver").jsGrid("loadData", driverListtData).done(function(){ });
        
        // 0건 그리드 메세지 처리부분
        if(cntListData.length == 0) {
            $.fn.getReturnValue("gridDivCnt");
        }
        if(driverListtData.length == 0) {
            $.fn.getReturnValue("gridDivDriver");
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectMdrotRatMsgStatListByKeywords !!");
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
    //보정전 산출결과 
    $("#gridDivCnt").jsGrid("reset");
    $("#gridDivCnt").jsGrid("option", "data", []);
    //보정후 산출결과 
    $("#gridDivDriver").jsGrid("reset");
    $("#gridDivDriver").jsGrid("option", "data", []);
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
function reDrawGrid(midDrotCd) {
    //그리드 destroy
    $("#gridDivCnt").jsGrid("destroy");
    $("#gridDivDriver").jsGrid("destroy");
    //그리드 create
    initGridCnt(midDrotCd);
    initGridDriver(midDrotCd);
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:납입상태별 중도인출율 연도별 비중(건수/Driver 기준)
 * 2:납입상태별 상품유형별 중도인출율 경과년도별 비중(건수/Driver 기준)
 * 3:납입상태별 채널유형별 중도인출율 경과년도별 비중(건수/Driver 기준)
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function getGridFields(type) {
    var selAplcBe = $("#sbx_aplcBe").val();
    var finYFrom = "";
    var finYTo = ""

    for(var i=0; i<condAplcBe.length; i++) {
        if(condAplcBe[i].aplcBeNm == selAplcBe) {
            finYFrom = condAplcBe[i].finStrYm;
            finYTo = condAplcBe[i].finEndYm;
            break;
        }
    }

    //그리드 공통부분 필드
    var resultArr = [
        { name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 120, align:"center", 
          items: $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD"), textField: "codeNm", valueField: "code"
        }
    ];
    
    //상풍유형 필드
    var productTypeInfo = { 
            name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 100, align:"center", 
            items: $.fn.getGridCodeItem("BE_NEW_LOB_CD"), textField: "codeAbbrNm", valueField: "code"
    };
    //채널유형 필드
    var channelInfo = {
            name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 100, align:"center", 
            items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "codeNm", valueField: "code"
    };
    //전체 필드
    var total = { name: "total", title:"전체", css:"cell", type: "text",  width: 140, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            }
    };
  //전체 필드
    var totalRto = { name: "total", title:"전체비중", css:"cell", type: "text",  width: 140, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            }
    };

    //==========================================================
    //필드항목 정의 END
    //==========================================================

    switch(type) {
    case "1": //납입상태별 중도인출율 연도별 비중
        var targetArr = $.fn.getFinYearArr(finYFrom, finYTo);
        var fieldsArr = getFieldsArr(targetArr);
        resultArr = resultArr.concat(fieldsArr);
        resultArr.push(total);
        break;
    case "2": //납입상태별 상품유형별 중도인출율 연도별 비중
        var targetArr = $.fn.getFinYearArr(finYFrom, finYTo);
        var fieldsArr = getFieldsArr(targetArr);
        resultArr.push(productTypeInfo);
        resultArr = resultArr.concat(fieldsArr);
        resultArr.push(totalRto);
        break;
    case "3": //납입상태별 상품유형별 중도인출율 경과년도별 비중
        var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
        var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12+"];
        var fieldsArr = getPsgTmsFieldsArr(targetArr, titleArr);
        resultArr.push(productTypeInfo);
        resultArr = resultArr.concat(fieldsArr);
        resultArr.push(total);
        break;
    case "4": //납입상태별 채널유형별 중도인출율 연도별 비중
        var targetArr = $.fn.getFinYearArr(finYFrom, finYTo);
        var fieldsArr = getFieldsArr(targetArr);
        resultArr.push(channelInfo);
        resultArr = resultArr.concat(fieldsArr);
        resultArr.push(totalRto);
        break;
    case "5": //납입상태별 채널유형별 중도인출율 경과년도별 비중
        var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
        var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12+"];
        var fieldsArr = getPsgTmsFieldsArr(targetArr, titleArr);
        resultArr.push(channelInfo);
        resultArr = resultArr.concat(fieldsArr);
        resultArr.push(total);
        break;
    }
    
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function getFieldsArr(targetArr) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { 
                name: "finY" + i , title: target + "년도", css:"cell", type: "text", width: 140, align:"right", sorter:"number",
                itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
        };
        
        resultArr.push(distStndValField);
    }
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function getPsgTmsFieldsArr(targetArr, titleArr) {
    if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titleArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: "psgYys" + target , title: titleArr[i] + "차년", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }};
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}
/**
 * @설명: 조회구분에 따라 타이틀 세팅
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function ctlTitle(midDrotCd) {
    switch(midDrotCd) {
    case "1" :  //납입상태별 중도인출율 연도별 비중
        $("#title_cnt").text("납입상태별 연도별 비중(건수 기준)");
        $("#title_driver").text("납입상태별 연도별 비중(Driver 기준)");
        break;
        
    case "2" :  //납입상태별 상품유형별 중도인출율 연도별 비중
        $("#title_cnt").text("납입상태별 상품유형별 연도별 비중(건수 기준)");
        $("#title_driver").text("납입상태별 상품유형별 연도별 비중(Driver 기준)");
        break;
        
    case "3" :  //납입상태별 채널유형별  중도인출율 연도별 비중
        $("#title_cnt").text("납입상태별 채널유형별 연도별 비중(건수 기준)");
        $("#title_driver").text("납입상태별 채널유형별 연도별 비중(Driver 기준)");
        break;
    
    default : //납입상태별 중도인출율 연도별 비중
        $("#title_cnt").text("납입상태별 연도별 비중(건수 기준)");
        $("#title_driver").text("납입상태별 연도별 비중(Driver 기준)");
        break;
    }
}

/**
 * @설명: 그래프 팝업
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 16
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 16 최초작성
 */
function openAdtnInfoGrpPopup() {
    popupOption = {
            url: "/be/pd/bepd233p.do",
            name: "중도인출율 그래프 팝업",
            width: 1050,
            height: 850,
            sbxDiv: gCondSrchDiv,
            gridData1: $("#" + "gridDivCnt").jsGrid("option", "data"),
            gridField1: $("#" + "gridDivCnt").jsGrid("option", "fields"),
            gridData2: $("#" + "gridDivDriver").jsGrid("option", "data"),
            gridField2: $("#" + "gridDivDriver").jsGrid("option", "fields")
    }
    
    $.fn.openPopup(popupOption);
}