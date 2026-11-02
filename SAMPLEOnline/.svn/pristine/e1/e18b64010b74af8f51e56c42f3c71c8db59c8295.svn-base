/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 보험계약대출율
 * @설명: 보험계약대출율 부가정보 화면 JS
 * @최초작성자: 이준용
 * @최초작성일: 2021.07.22
 * @최종변경일: 
 * @개정이력:
 *  이준용 2021.07.22 최초작성
 */
// 전역변수 선언부
var gCondSrchDiv = "1";
var condAplcBe; //적용BE StartDt, EndDt
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";

$(document).ready(function(){
    /*2021.04.30 툴팁 추가*/
    $("#imgToolTip").attr("title", parent.viewPath);
    
    /*2021.06.15 화면명에 화면ID 추가*/
//  $($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    /*2021.06.15 버튼권한처리*/
    //검증실행
//  var btnIdArr = ["btn_vrfPrct"];
//  var permArr = [];
//  for (var i = 0; i < btnIdArr.length; i++) {
//      permArr.push({
//          btnId : "#" + btnIdArr[i]
//      });
//  }
//  $.fn.setBtnPermission(permArr);
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //콤보박스 세팅
//    initComboBox();
    
    //event 초기화
    initEvent();
    
    //그리드 초기화   
    initGridItem(1);
    initGridItem(2);
    
});

function initCommCd() {
    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","12");
    
    // 공통코드 조회(상품유형,채널,보험계약대출율구분코드)
    $.fn.loadCommonCode(["PLLN_RAT_PRDT_CLSF_CD","BE_CHNL_SC_CD","PLLN_RAT_SC_CD"]);
}

/**
 * @설명: 콤보박스 초기화
 * @최초작성자: 이준용
 * @최초작성일: 2021. 9. 16
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 9. 16 최초작성
 */
function initComboBox() {
    //보험계약대출율구분코드
    $.fn.renderCombobox({
        codeArr: ["PLLN_RAT_SC_CD"],
        selArr: ["sbx_srhType"],
        firstOptionText: "-선택-"
    });
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
    //조회구분 변경 이벤트
    $("#sbx_srhGubun").on("change", function(e){
        gCondSrchDiv = $("#sbx_srhGubun").val();
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
    
    //조회구분 변경 이벤트
    $("#sbx_srhType").on("change", function(e){
        if($("#sbx_srhType").val() == "04") {//대출한도율
            $("#sbx_srhGubun").prop("disabled", true);
        } else {
            $("#sbx_srhGubun").prop("disabled", false);
        }
    });
    
    // 조회
    $('#btn_search').on('click', function(e){
        var titleText = $("#sbx_srhType option:selected").text();
        if ($("#sbx_srhGubun").val() == "1") {
            $("#titleNm1").text("경과기간별 연도별 "+titleText+" 비중(건수 기준)");
            $("#titleNm2").text("경과기간별 연도별 "+titleText+" 비중(Driver 기준)");
        }
        if ($("#sbx_srhGubun").val() == "2") {
            $("#titleNm1").text("상품유형별 연도별 "+titleText+" 비중(건수 기준)");
            $("#titleNm2").text("상품유형별 연도별 "+titleText+" 비중(Driver 기준)");
        }
        if ($("#sbx_srhGubun").val() == "3") {
            $("#titleNm1").text("채널유형별 연도별 "+titleText+" 비중(건수 기준)");
            $("#titleNm2").text("채널유형별 연도별 "+titleText+" 비중(Driver 기준)");
        }   
        
        if ($("#sbx_srhGubun").val() == "4") {
            $("#titleNm1").text("상품유형별 경과년도별 "+titleText+" 비중(건수 기준)");
            $("#titleNm2").text("상품유형별 경과년도별 "+titleText+" 비중(Driver 기준)");
        }
        if ($("#sbx_srhGubun").val() == "5") {
            $("#titleNm1").text("채널유형별 경과년도별 "+titleText+" 비중(건수 기준)");
            $("#titleNm2").text("채널유형별 경과년도별 "+titleText+" 비중(Driver 기준)");
        }
        if ($("#sbx_srhType").val() == "04") {
            $("#titleNm1").text(titleText);
            $("#divNm2").hide();
            $("#divSubNm2").hide();
            $("#btn_popGrp").hide();
        } else {
            $("#divNm2").show();
            $("#divSubNm2").show();
            $("#btn_popGrp").show();
        }
        selectPllnRatList();
    });
    
    // 엑셀다운로드
    $('#btn_excel_download').on('click', function(e){
        //데이터 체크
        var dataList = $("#gridDiv1").jsGrid("option", "data");
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
        
        let fileName = "보험계약대출율_" + $("#sbx_srhGubun option:selected").text() + "_" + $("#sbx_srhType option:selected").text() + ".xlsx";
        if ($("#sbx_srhType").val() != "04") {
            $.fn.exportMultiGridExcel([
                {
                    id: 'gridDiv1',
                    sheetName : "건수",
                    fileName: fileName, 
                    applyItemTemplate: true,
                    searchCond: $.fn.getSearchCondSub("ADTN"),
                    unit: "%"
                },
                {
                    id: 'gridDiv2',
                    sheetName : "Driver",
                    fileName: fileName, 
                    applyItemTemplate: true,
                    unit: "%"
                },
                {
                    id: 'gridDiv1',
                    sheetName : "건수(코드)",
                    fileName: fileName, 
                    applyItemTemplate: false,
                    unit: "%"
                },
                {
                    id: 'gridDiv2',
                    sheetName : "Driver(코드)",
                    fileName: fileName, 
                    applyItemTemplate: false,
                    unit: "%"
                }
            ]);
        } else {
            $.fn.exportMultiGridExcel([
                {
                    id: 'gridDiv1',
                    sheetName : "건수",
                    fileName: fileName, 
                    applyItemTemplate: true,
                    searchCond: $.fn.getSearchCondSub("ADTN"),
                    unit: "%"
                },
                {
                    id: 'gridDiv1',
                    sheetName : "건수(코드)",
                    fileName: fileName, 
                    applyItemTemplate: false,
                    unit: "%"
                }
            ]);
        }
        
        
        
    });
    
    //조회조건 엔터키 조회
    $("#search-item").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
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
function getGridFields(){
    var fieldsArrayObj;
    var fieldsArray1, fieldsArray2 = [{}];
    var fieldCdArr = [];
    var targetArr = [];
    var targetArrNts = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
    var fieldsArr;
    var selAplcBe = $("#sbx_aplcBe").val();
    var finYFrom = "";
    var finYTo = "";
    var fieldNm;
    var titleNm;
    var codeItem;
    
    for (var i = 0; i < condAplcBe.length; i++) {
        if (condAplcBe[i].aplcBeNm == selAplcBe) {
            finYFrom = condAplcBe[i].finStrYm;
            finYTo = condAplcBe[i].finEndYm;
            break;
        }
    }
    targetArr = $.fn.getFinYearArr(finYFrom, finYTo);
    
    //전체 필드
    var allInfo = { name: "total", title:"전체", css:"cell", type: "text",  width: 100, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            }
    }

    if ($("#sbx_srhGubun").val() == "1"){
        fieldNm = "psgNts";
        titleNm = "경과년도";
//      fieldCdArr = $.fn.getGridCodeItem(codeItem);
    }
     
    if ($("#sbx_srhGubun").val() == "2" || $("#sbx_srhGubun").val() == "4") {
        fieldNm = "pllnRatPrdtClsfCd";
        titleNm = "상품유형";
        codeItem = "PLLN_RAT_PRDT_CLSF_CD";
        fieldCdArr = $.fn.getGridCodeItem(codeItem);
    }
    
    if ($("#sbx_srhGubun").val() == "3" || $("#sbx_srhGubun").val() == "5") {
        fieldNm = "beChnlScCd";
        titleNm = "채널";
        codeItem = "BE_CHNL_SC_CD";
        fieldCdArr = $.fn.getGridCodeItem(codeItem);
    }
    
    if ($("#sbx_srhType").val() == "04") {
        codeItem = "BE_CHNL_SC_CD";
        fieldCdArr = $.fn.getGridCodeItem(codeItem);
        fieldsArray1 =  
            [
                { name: 'pllnPsbRatCd', title:'보험계약가능대출률코드', css:"cell", type: "text",  width: 100, align:"center", editing: false
                    ,  itemTemplate:function(value, item) {
                        var textField = item.pllnPsbRatCd;
                        if($.fn.isEmpty(item.pllnPsbRatCd)) {
                            textField = "TOTAL";
                        }
                        
                         return textField;
                   }
                },
                { name: 'targetNm', title:'대상', css:'cell', type: 'text', width: 100, align:'center', editing: false},
                { name: 'setNum', title:'대출한도 설정값(A)', css:'cell', type: "text",  width: 100, align:"right", sorter:"number", editing: false},
                { name: 'ndNum', title:'분자/분모(B)', css:'cell', type: "text",  width: 100, align:"right", sorter:"number", editing: false,
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: 'lRate', title:'대출한도율(A*B)', css:'cell', type: 'text', width: 100, align:'right', editing: false,
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                }
            ];
        fieldsArrayObj = fieldsArray1;
        return fieldsArrayObj;
    } else if ($("#sbx_srhGubun").val() == "1") {
        fieldsArray1 =  
            [
                { name: fieldNm, title:titleNm, css:'cell', type: 'text', width: 60, align:'center', editing: false,  itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "12+" : $.addCommaNumber(value.toString());}}
            ];
        fieldsArr = getFieldsArr(targetArr);
        fieldsArray1 = fieldsArray1.concat(fieldsArr);
        fieldsArray1.push(allInfo);
    } else {
        fieldsArray1 =  
        [
            { name: fieldNm, title:titleNm, css:'cell', type: 'select', width: 160, align:'center', editing: false
                ,  itemTemplate:function(value, item) {
                    var textField = "TOTAL";
                    for(i=0; i<fieldCdArr.length; i++) {
                        if(value == fieldCdArr[i].code) {
                            textField = fieldCdArr[i].codeNm;
                            break;
                        }
                    }
                        return textField;
                   }
            }
        ];
        fieldsArray2 =  
        [
            { name: fieldNm, title:titleNm, css:'cell', type: 'select', width: 160, align:'center', editing: false
                ,  itemTemplate:function(value, item) {
                    var textField = "TOTAL";
                    for(i=0; i<fieldCdArr.length; i++) {
                        if(value == fieldCdArr[i].code) {
                            textField = fieldCdArr[i].codeNm;
                            break;
                        }
                    }
                    return textField;
                }
            }
        ];
        fieldsArr = getFieldsArr(targetArr);
        fieldsArray1 = fieldsArray1.concat(fieldsArr);
        fieldsArray1.push(allInfo);
        
        fieldsArr = getPsgNtsFieldsArr(targetArrNts);
        fieldsArray2 = fieldsArray2.concat(fieldsArr);
        fieldsArray2.push(allInfo);
    }

    if ($("#sbx_srhGubun").val() == "1" || $("#sbx_srhGubun").val() == "2" || $("#sbx_srhGubun").val() == "3" || $("#sbx_srhType").val() == "04") {
        fieldsArrayObj = fieldsArray1;
    }
    
    if ($("#sbx_srhGubun").val() == "4" || $("#sbx_srhGubun").val() == "5") {
        fieldsArrayObj = fieldsArray2;
    }
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
function getPsgNtsFieldsArr(targetArr) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    var addVal="";
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        if (i==11) addVal = "+";
        var distStndValField = { name: "psgNts"+target , title: target+addVal+"차년도", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }};
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function getFieldsArr(targetArr) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];

    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: "finY" + i, title: target + "차년", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }};
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}

function initGridItem(val){
    // jsGrid 빈 테이블 생성
    var fieldsArr = getGridFields();
    var gridObject = new ComJsGrid({
        id: "gridDiv"+val,  
        height: 300,
        editing: false,
        sorting: true,
        paging: false,
        selectHiglight:true,
        fields : fieldsArr
    });
    

    //그리드 생성
    gridObject.gridCreate();
}

/**
 * @설명: 조회조건별 보험계약대출율 부가정보 - 연도, 경과기간, 상품유형, 채널유형별 보험계약대출율 연도별 비중 (건수 / Driver 기준) 조회한다.
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
 */
function selectPllnRatList() {
    var reqParam = {};
    var selAplcBe = $("#sbx_aplcBe").val();
    var condFinYmFrom = "";
    var condFinYmTo = "";
    var list = {};
    var strColum = "";
    
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
    
    if($("#sbx_srhType").val() == "") {
        $.fn.msgBox("조회기준은 필수선택 항목입니다.");
        return;
    }
    
    //적용BE 조회년도 
    var finYearArr = $.fn.getFinYearArr(condFinYmFrom, condFinYmTo);
    for(var i=0; i<5; i++) {
        reqParam["finY" + i] = finYearArr[i];
    }
    
    reqParam.finYmFrom = condFinYmFrom-1;
    reqParam.finYmTo = condFinYmTo-1;
    reqParam.srhType = $("#sbx_srhType").val();
    reqParam.srhGubun = $("#sbx_srhGubun").val();

    // 체크박스 (가정항목, 상품유형, 채널) 체크
    $("input:checkbox[name='hierachy_check']:checked").each(function(e){
        strColum = $(this).val();
    });
    if ($("#sbx_srhGubun").val() == "1") { /* 경과기간 */
        strColum = "psgNts";
    }
    if ($("#sbx_srhGubun").val() == "2" || $("#sbx_srhGubun").val() == "4") { /* 상품유형 */
        strColum = "pllnRatPrdtClsfCd";
    }
    if ($("#sbx_srhGubun").val() == "3" || $("#sbx_srhGubun").val() == "5") { /* 채널 */
        strColum = "beChnlScCd";
    }
    
    reqParam.strColum = strColum;
    
    //엑셀 validation 체크용 오브젝트
    gReqParam.aplcBe = $("#sbx_aplcBe").val();
    gReqParam.srhGubun = $("#sbx_srhGubun").val();
    gReqParam.srhType = $("#sbx_srhType").val();
    
    //파라미터 세팅
      $.callAjax(reqParam, "/be/pd/bepd243m/selectPllnRatList.do")
        .done(function(data) {
            // 그리드 초기화
            resetGrid();
            reDrawGrid();
            
            var grid1List = [];
            var grid2List = [];
            
            if ($("#sbx_srhType").val() != "04") {
                if ($("#sbx_srhGubun").val() == "1") {
                    if(data.pllnRatCntList.length != 0){
                        data.pllnRatCntList[data.pllnRatCntList.length-1].psgNts = "12+";
                    }
                    if(data.pllnRatDriverList.length != 0){
                        data.pllnRatDriverList[data.pllnRatDriverList.length-1].psgNts = "12+";
                    }
                }
            }
            
            if ($("#sbx_srhType").val() == "04") {
                grid1List = data.pllnRatDriverList;
            } else {
                grid1List = data.pllnRatCntList;
                grid2List = data.pllnRatDriverList;
            }

            if ($("#sbx_srhType").val() != "04") { //대출한도율이 아닐 경우 화면분기
                
                $("#gridDiv1").jsGrid("loadData", grid1List).done();
                $("#gridDiv2").jsGrid("loadData", grid2List).done();

                // 0건 그리드 메세지 처리부분
                if(grid1List.length == 0){
                    $.fn.getReturnValue("gridDiv1");
                }

                if(grid2List.length == 0){
                    $.fn.getReturnValue("gridDiv2");
                }
            } else { //대출한도율일 경우
                $("#gridDiv1").jsGrid("loadData", grid1List).done();
                // 0건 그리드 메세지 처리부분
                if(grid1List.length == 0){
                    $.fn.getReturnValue("gridDiv1");
                }
            }
            
            gCondFlag = "Y";
        }).fail(function(data){
        $.fn.msgBox("[ajax] 서버 통신 실패입니다.");
        console.log("fail to selectPllnRatYearList !!");
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
    if ($("#sbx_srhType").val() != "04") {
        initGridItem(2);
    }
    
 
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
* @설명: 보험계약대출율 - 조회시 조건, 현재 조건 체크 
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
    
    //조회구분체크
    if(gReqParam.srhGubun != $('#sbx_srhGubun').val()) {
        return false;
    }
    
    //조회기준체크
    if(gReqParam.srhType != $('#sbx_srhType').val()) {
        return false;
    }
    return true;
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
    if ($("#sbx_srhType").val() != "04") {
         popupOption = {
                    url: "/be/pd/bepd243p.do",
                    name: "보험계약대출율 그래프 팝업",
                    width: 1050,
                    height: 850,
                    sbxDiv: gCondSrchDiv,
                    gridData1: $("#" + "gridDiv1").jsGrid("option", "data"),
                    gridField1: $("#" + "gridDiv1").jsGrid("option", "fields"),
                    gridData2: $("#" + "gridDiv2").jsGrid("option", "data"),
                    gridField2: $("#" + "gridDiv2").jsGrid("option", "fields")
            }
    } else {
         popupOption = {
                    url: "/be/pd/bepd243p.do",
                    name: "보험계약대출율 그래프 팝업",
                    width: 1050,
                    height: 850,
                    sbxDiv: gCondSrchDiv,
                    gridData1: $("#" + "gridDiv1").jsGrid("option", "data"),
                    gridField1: $("#" + "gridDiv1").jsGrid("option", "fields")
            }
    }
   
    $.fn.openPopup(popupOption);
}