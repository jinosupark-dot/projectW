/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 연금선택율
 * @설명: 연금선택율 > 부가정보 화면의 JS
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 7. 20.
 * @최종변경일: 
 * @개정이력: 
 *  박세라 (61000434) 2021. 7. 20. 최초작성
 */
var gCondAplcBe;
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";

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
    initGridDivCount();
    initGridDivDriver();

});

/**
* @설명: 연금선택율 > 부가정보 기본 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 20. 최초작성
*/
function initCommCd() {
    
    // 공통코드 조회
    $.fn.loadCommonCode(["BE_NEW_LOB_CD","BE_ANUT_PYM_MTH_CD"]);

    // 적용BE 조회
    gCondAplcBe = $.fn.getAplcBe("sbx_aplcBe","06");
}

function initEvent() {
    // 조회
    $('#btn_search').on('click', function(e){
            selectAnutSlctRatAdtnInfoList();
    });
    
    // 엑셀다운로드
    $('#btn_excel_download').on('click', function(e){
        if(gCondFlag == "N" || $("#gridDivCount").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        var fileName = "연금선택율_"+$("#sbx_inqSection option:selected").text()+".xlsx";
        $.fn.exportMultiGridExcel([
                {
                    id: 'gridDivCount',
                    sheetName : "건수",
                    fileName: fileName, 
                    applyItemTemplate: true,
                    unit : "%",
                    searchCond: $.fn.getSearchCondSub("ADTN")
                },
                {
                    id: 'gridDivDriver',
                    sheetName : "Driver",
                    fileName: fileName, 
                    applyItemTemplate: true,
                    unit : "%"
                },
                {
                    id: 'gridDivCount',
                    sheetName : "건수(코드)",
                    fileName: fileName, 
                    applyItemTemplate: false,
                    unit : "%"
                },
                {
                    id: 'gridDivDriver',
                    sheetName : "Driver(코드)",
                    fileName: fileName, 
                    applyItemTemplate: false,
                    unit : "%"
                }
        ]);
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
* @설명: 연금선택율 > 가변 테이블 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 22.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 22. 최초작성
*/

function settingGrid() {
    // 세팅데이터 받아오기
    var inqSection_num = $("#sbx_inqSection option:selected").val();
    //조회년월 load start
    var selAplcBe = $("#sbx_aplcBe").val();
    var condFinYmFrom = "";
    var condFinYmTo = "";
    var list = {};
    for(var i=0; i<gCondAplcBe.length; i++) {
        
        if(gCondAplcBe[i].aplcBeNm == selAplcBe) {
            condFinYmFrom = gCondAplcBe[i].finStrYm;
            condFinYmTo = gCondAplcBe[i].finEndYm;
            break;
        }
    }
    if(condFinYmFrom == "" || condFinYmTo == "") {
        $.fn.msgBox("조회할 적용BE 구간이 존재하지 않습니다.");
        return;
    }
    var yearList = $.fn.getFinYearArr(condFinYmFrom, condFinYmTo);
    var finY = yearList[yearList.length-1];
    
    var fieldList = [];

        if(inqSection_num==1) {
            var firstField = { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 40, editing: false, align:"center",
                    items: $.fn.getGridCodeItem("BE_NEW_LOB_CD"), textField: "codeAbbrNm", valueField:"code" }
            fieldList.push(firstField);
        } else if(inqSection_num==2) {
            var secondField = { name: "beAnutPymMthCd", title:"연금지급방법", css:"cell", type: "select", width: 40, align:"left",
                    items: $.fn.getGridCodeItem("BE_ANUT_PYM_MTH_CD"), textField: "codeNm", valueField:"code"}
            fieldList.push(secondField);
        }
        var j = 4;
        for(var i=0; i<5; i++) {
            var field = { name: 'finYm'+i, title:finY-j+"년도", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
            fieldList.push(field);
            j--;
        }
        var lastField = { name: "whole", title:"전체", css:"cell", type: "text", width: 30, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
        fieldList.push(lastField);
        
    return fieldList;
}

/**
* @설명: 연금선택율 > 부가정보 기본 그리드 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 22.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 22. 최초작성
*/
function initGridDivCount(){
    
    var gridField = settingGrid();
    
    var gridDivCount = new ComJsGrid({
        id: "gridDivCount",
        height: 300,
        editing: false,
        sorting: true,
        paging: false,
        
        fields : gridField
        }); 
    
    //그리드 생성
    gridDivCount.gridCreate();
}

function initGridDivDriver(){

    var gridField = settingGrid();
    
    var gridDivDriver = new ComJsGrid({
        id: "gridDivDriver",
        height: 300,
        editing: false,
        sorting: true,
        paging: false,
        
        fields : gridField
        });
    
    //그리드 생성
    gridDivDriver.gridCreate();
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
    if(gReqParam.srhType != $("#sbx_inqSection option:selected").val()) {
        return false;
    }

    return true;
}

/**
* @설명: 연금선택율 > 부가정보 조회시 데이터 얻어오기
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 22.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 22. 최초작성
*/
function selectAnutSlctRatAdtnInfoList(){
    // 넘길 데이터 받아오기
    var inqSection = $("#sbx_inqSection option:selected").val();
    var code = "";
    if(inqSection==1) {
        code = "BE_NEW_LOB_CD"
    } else if (inqSection==2) {
        code = "BE_ANUT_PYM_MTH_CD"
    }
    var selAplcBe = $("#sbx_aplcBe").val();
    var condFinYmFrom = "";
    var condFinYmTo = "";
    var list = {};
    for(var i=0; i<gCondAplcBe.length; i++) {
        
        if(gCondAplcBe[i].aplcBeNm == selAplcBe) {
            condFinYmFrom = gCondAplcBe[i].finStrYm;
            condFinYmTo = gCondAplcBe[i].finEndYm;
            break;
        }
    }
    if(condFinYmFrom == "" || condFinYmTo == "") {
        $.fn.msgBox("조회할 적용BE 구간이 존재하지 않습니다.");
        return;
    }
    var yearList = $.fn.getFinYearArr(condFinYmFrom, condFinYmTo);

    // 조회에 필요한 값을 셋팅
    gReqParam = {
            "finYmFrom" : condFinYmFrom,
            "code" : code,
            "finYmTo" : condFinYmTo,
            "selAplcBe" : selAplcBe,
            "srhType" : inqSection
        };
    for(var i=0; i<5; i++) {
        gReqParam["finY_"+i] = yearList[i];
    }

        $.callAjax(gReqParam, "/be/pd/bepd173m/selectAnutSlctRatAdtnInfoList.do")
        .done(function(data) {
            $('#gridDivCount').jsGrid('reset');
            $("#gridDivCount").jsGrid("option", "data", []);
            $('#gridDivDriver').jsGrid('reset');
            $("#gridDivDriver").jsGrid("option", "data", []);
            $("#gridDivCount").jsGrid("destroy");
            $("#gridDivDriver").jsGrid("destroy");
            initGridDivCount();
            initGridDivDriver();
            var inqSection = $("#sbx_inqSection option:selected").text();
            $("#title_cnt").text(inqSection+"(건수 기준)");
            $("#title_driver").text(inqSection+"(Driver 기준)");
            
            // 서버로 받아온 데이터 리스트
            var countListData = data.countList;
            var driverListData = data.driverList;

            
            
console.log("driverListData ====================> " + data.driverList);            
            
            // 0건 그리드 메세지 처리부분
            if(countListData==null || countListData.length==0){
                $.fn.getReturnValue("gridDivCount");
            } else {
                
                $('#gridDivCount').jsGrid('loadData', countListData);
            }
            if(driverListData==null || driverListData.length==0){
                $.fn.getReturnValue("gridDivDriver");
            } else {
                
                $('#gridDivDriver').jsGrid('loadData', driverListData);
            }
            gCondFlag = "Y";
        }).fail(function(data){
            console.log("fail to selectTableSchemaInfo");
        }); 
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
            url: "/be/pd/bepd173p.do",
            name: "연금선택율 그래프 팝업",
            width: 1050,
            height: 850,
            sbxDiv: $("#sbx_inqSection option:selected").val(),
            aplcBe: $("#sbx_aplcBe").val().substr(0,4),
            gridData1: $("#" + "gridDivCount").jsGrid("option", "data"),
            gridField1: $("#" + "gridDivCount").jsGrid("option", "fields"),
            gridData2: $("#" + "gridDivDriver").jsGrid("option", "data"),
            gridField2: $("#" + "gridDivDriver").jsGrid("option", "fields"),           
        }

        $.fn.openPopup(popupOption);
}

function openAdtnInfoGrpPopup_callback() {

    
}