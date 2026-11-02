/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 연금전환율
 * @설명: 연금전환율 > 기초데이터 화면의 JS
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 7. 16.
 * @최종변경일: 
 * @개정이력: 
 *  박세라 (61000434) 2021. 7. 16. 최초작성
 */
var gArrCols = [];
// 전역변수
var serviceCode = "07";
//조회조건obj
var gReqParam = {};
//조회falg
var gCondFlag = "N";
//one-off플래그
var gCondOneoffCheck = "N";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");

    //datepickerSetting세팅
    $.fn.getTbDateInfo(serviceCode);

    // 초기 날짜 세팅
    initSearchData();
    
    //event 초기화
    initEvent();
    
    //그리드 초기화   
    $.fn.loadCommonCode(["BE_NEW_LOB_CD"]);
    initGridDivCount();
    initGridDivDriver();
});

/**
* @설명: 연금전환율 > 기초데이터 기본 이벤트 처리
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 16.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 16. 최초작성
*/
function initEvent() {
    //시작년월 달력버튼 click
    $('#btn_finYm_from').on('click', function(e){
        $('#ibx_finYmFrom').datepicker('show');
    });
    
    //죵료년월 달력버튼 click
    $('#btn_finYm_to').on('click', function(e){
        $('#ibx_finYmTo').datepicker('show');
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
        //조회년월 validation
        var strYm = $("#ibx_finYmFrom").val();
        var finYm = $("#ibx_finYmTo").val()
        if(strYm > finYm) {
            $.fn.msgBox("시작년월이 종료년월보다 클수 없습니다.");
            return;
        }
        
        if (gCondOneoffCheck == 'Y') {
            $("#title_cnt").text("연금전환율 기초데이터 One-off 반영 모니터링 (건수 기준)");
            $("#title_driver").text("연금전환율 기초데이터 One-off 반영 모니터링 (Driver 기준)");
        } else {
            $("#title_cnt").text("연금전환율 기초데이터 모니터링 (건수 기준)");
            $("#title_driver").text("연금전환율 기초데이터 모니터링 (Driver 기준)");
        }
        
        selectAnutCnvrRatList();
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
        
        if (gCondOneoffCheck == 'Y') {
            fileName =  "연금전환율 기초데이터_One-off반영.xlsx";
        } else {
            fileName =  "연금전환율 기초데이터.xlsx";
        }
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivCount',
                sheetName : "건수",
                fileName: fileName, 
                applyItemTemplate: true,
                unit: "건",
                searchCond: $.fn.getSearchCond(gReqParam)
            },
            {
                id: 'gridDivDriver',
                sheetName : "Driver",
                fileName: fileName, 
                applyItemTemplate: true,
                unit: "원/%"
            },
            {
                id: 'gridDivCount',
                sheetName : "건수(코드)",
                fileName: fileName, 
                applyItemTemplate: false,
                unit: "건"
            },
            {
                id: 'gridDivDriver',
                sheetName : "Driver(코드)",
                fileName: fileName, 
                applyItemTemplate: false,
                unit: "원/%"
            }
        ]);
    });
    
    //양식다운로드 클릭
    $("#btn_exportExcelForm").on("click", function(e){
        
        var arrColsInfo = $.fn.getTbCols("TB_IBEBDS14");
        
        console.log("양식");
        console.log(JSON.stringify(arrColsInfo));
        
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        $.fn.exportGridExcel({
            id: "gridTmpDiv", 
            fileName: "연금전환율" + "_업로드양식.xlsx"
        });
        
    });
    
    //엑셀업로드 클릭
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
                        console.log("로드데이터");
                        console.log(JSON.stringify(data["list"]));
                        console.log(gArrCols);
                        data["colList"] = gArrCols;
                        data["tbNm"] = "TB_IBEBDS14";
                        data["menuId"] = $.fn.getMenuId();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveDtList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                                SelectInsRIvtContMngInqrList();
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
    
    //조회조건 엔터키 조회
    $("#ibx_finYmFrom", "#ibx_finYmTo").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
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
        openPryRatGrpPopup();
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
            "serviceCode" : serviceCode
    }
    $.callAjax(reqParam, "/be/pd/commonBe/settingFirstDate.do")
    .done(function(data) {
        var tbDateInfo = data.tbDateInfo;
        $('#ibx_finYmFrom').val($.fn.monthFormat(tbDateInfo[0].finStrYm));
        $("#ibx_finYmTo").val($.fn.monthFormat(tbDateInfo[0].finEndYm));
    });
}

/**
* @설명: 연금전환율 > 기초데이터 가변 테이블 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 16.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 16. 최초작성
*/

function initGridDivCount(){
    var fieldList = [];

    var firstField = { name: "finYm", title:"마감년도", css:"cell", type: "text", width: 50, align:"center", itemTemplate:function(value, item) {
                            if(value==null) return 'TOTAL';
                            else return value;
                        }
                    }
        fieldList.push(firstField);
    var codeNm = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
    var l = 0;
    for(var i=0; i<codeNm.length-1; i++) {
        if(i<10) {
            l = '0'+i;
        } else {
            l = i;
        }
        var field = { name: "product"+l, title: codeNm[i].codeAbbrNm, css:"cell", type: "text", width: 50, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        fieldList.push(field);
    }
    
    var lastField = { name: "whole", title:"합계(연금제외)", css:"cell", type: "text", width: 60, align:"right", sorter:"number", itemTemplate:function(value, item) {
        return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
    fieldList.push(lastField);
    
    var gridDivCount = new ComJsGrid({
        id: "gridDivCount",
        height: 250,
        editing: false,
        sorting: true,
        paging: false,

        fields : fieldList
        }); 
    
    //그리드 생성
    gridDivCount.gridCreate();

}

function initGridDivDriver(){
    
    var gridDivDriver = new ComJsGrid({
        id: "gridDivDriver",
        height: 250,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            var $result = $("<tr>").height(0)
                .append($("<th>").width(200))
                .append($("<th>").width(200))
                .append($("<th>").width(200))
                .append($("<th>").width(200))
                .append($("<th>").width(200));
            
            // 1row
            $result = $result.add($("<tr class='jsgrid-header-row'>")
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("해약식보험료적립금"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("전환건수")));
            var $result1 = $("<tr class='jsgrid-header-row'>")
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("대상금액"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전환금액"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전환율"));
            
            $result = $result.add($result1);
            return $result;
        },
        fields : [
            { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 200, align:"center", itemTemplate:function(value, item) {
                if(value==null) {
                    return 'TOTAL';
                } else {
                    return $._commonObj["code"]["BE_NEW_LOB_CD"][value*1].codeAbbrNm;
                }
            }},
            { name: "srndmPrmAcumAmt02", title:"대상금액", css:"cell", type: "text", width: 200, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},
            { name: "srndmPrmAcumAmt01", title:"전환금액", css:"cell", type: "text", width: 200, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},
            { name: "priceCnvrRat", title:"금액전환율", css:"cell", type: "text", width: 200, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00000" : (value*1).toFixed(5)}},
            { name: "occuCnt", title:"전환건수", css:"cell", type: "text", width: 200, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},
        ]
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
    
    //시작년월체크
    if(gReqParam.finYmFrom != $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','')) {
        return false;
    }
    //종료년월체크
    if(gReqParam.finYmTo != $.replaceAll($('#ibx_finYmTo').val().trim(), '-','')) {
        return false;
    }

    //원오프체크
    if(gReqParam.oneoffChk != gCondOneoffCheck) {
        return false;
    }
    

    return true;
}

/**
* @설명: 연금전환율 > 기초데이터 데이터 받아오기
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 16.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 16. 최초작성
*/
function selectAnutCnvrRatList(){

 // 기간받아오기
    var strYm = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
    var finYm = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
    
    //one-off체크여부
    var oneoffChk = "";

    // 조회에 필요한 값을 셋팅
    gReqParam = {
                 "finYmFrom": strYm,
                 "finYmTo": finYm,
                 "oneoffChk" : gCondOneoffCheck,
         }
         $.callAjax(gReqParam, "/be/pd/bepd181m/selectAnutCnvrRatList.do")
         .done(function(data) {
             // 그리드 데이터 초기화  
             $('#gridDivCount').jsGrid('reset');
             $("#gridDivCount").jsGrid("option", "data", []);
             $('#gridDivDriver').jsGrid('reset');
             $("#gridDivDriver").jsGrid("option", "data", []);
             $("#gridDivCount").jsGrid("destroy");
             $("#gridDivDriver").jsGrid("destroy");
             initGridDivCount();
             initGridDivDriver();
             
             // 서버로 받아온 데이터 리스트
             var countData = data.countList;
             var driverData = data.driverList;
             
             $('#gridDivCount').jsGrid('loadData', countData);
             $('#gridDivDriver').jsGrid('loadData', driverData);
             if(countData == null || countData.length == 0){
                 $.fn.getReturnValue("gridDivCount");
             }
             if(driverData == null || driverData.length == 0){
                 $.fn.getReturnValue("gridDivDriver");
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
function openPryRatGrpPopup() {
    var strYm = $("#ibx_finYmFrom").val();
    var finYm = $("#ibx_finYmTo").val()
    popupOption = {
            url: "/be/pd/bepd181p.do",
            name: "연금전환율 그래프 팝업",
            width: 1050,
            height: 850,
            arrCheck: [],
            finYmFrom: strYm,
            finYmTo: finYm,
            gridData1: $("#" + "gridDivCount").jsGrid("option", "data"),
            gridField1: $("#" + "gridDivCount").jsGrid("option", "fields"),
            gridData2: $("#" + "gridDivDriver").jsGrid("option", "data"),
            gridField2: $("#" + "gridDivDriver").jsGrid("option", "fields"),
            
        }

        $.fn.openPopup(popupOption);
}

function openPryRatGrpPopup_callback() {

    
}