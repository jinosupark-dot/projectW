/**
 * @시스템명: IFRS17
 * @업무명: 연금선택율 > 기초데이터
 * @설명: 연금선택율 > 기초데이터 화면의 JS
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 7. 16.
 * @최종변경일: 
 * @개정이력: 
 *  박세라 (61000434) 2021. 7. 16. 최초작성
 */
//전역변수
var gCondHichyCheck = [];
var gArrCols = [];
var serviceCode = "06";
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
    $.fn.loadCommonCode(["BE_NEW_LOB_CD","BE_ANUT_PYM_MTH_CD"]);
    initGridDivPryRate();
    initGridDivNmrtItem();
    initGridDivDnmrItem();
});

/**
* @설명: 연금선택율 > 기초데이터 기본 이벤트 세팅
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
        var finYm = $("#ibx_finYmTo").val();
        if(strYm > finYm) {
            $.fn.msgBox("시작년월이 종료년월보다 클수 없습니다.");
            return;
        }
        
        //hierachy validation
        if($('input:checkbox[name="hierarchy_check"]:checked').length == 0) {
            $.fn.msgBox("구분을 하나이상 체크해주세요.(One-off반영 제외)");
            return;
        }
        
        $("#gridDivPryRate").jsGrid("fieldOption", "beNewLobCd", "visible", false);
        $("#gridDivPryRate").jsGrid("fieldOption", "beAnutPymMthCd", "visible", false);
        $("#gridDivNmrtItem").jsGrid("fieldOption", "beNewLobCd", "visible", false);
        $("#gridDivNmrtItem").jsGrid("fieldOption", "beAnutPymMthCd", "visible", false);
        $("#gridDivDnmrItem").jsGrid("fieldOption", "beNewLobCd", "visible", false);
        $("#gridDivDnmrItem").jsGrid("fieldOption", "beAnutPymMthCd", "visible", false);
        
        // 체크박스 (납입상태, 상품유형, 채널) 체크
        gCondHichyCheck = [];
        var titleText = "";
        $('input:checkbox[name="hierarchy_check"]:checked').each(function(e){
            var colId = $(this).val();
            $("#gridDivPryRate").jsGrid("fieldOption", colId, "visible", true);
            $("#gridDivNmrtItem").jsGrid("fieldOption", colId, "visible", true);
            $("#gridDivDnmrItem").jsGrid("fieldOption", colId, "visible", true);
            gCondHichyCheck.push($.toUnderscore(colId));
            var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
            titleText = titleText + labelText + ", ";
        });
        titleText = titleText.substr(0, titleText.length-2)+" ";
        if(gCondOneoffCheck=="Y") titleText = titleText+", One-off 반영 "

        $("#title1").text(titleText + "기초율");
        $("#title2").text(titleText + "분자항목(해약식보험료적립금)");
        $("#title3").text(titleText + "분모항목(해약식보험료적립금)");
        
        selectAnutSlctRatList();
    });
    
    // 엑셀다운로드
    $('#btn_excel_download').on('click', function(e){
        
        if(gCondFlag == "N" || $("#gridDivPryRate").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회 후 엑셀다운로드를 해주세요.");
            return;
        }
        if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        var fileName = $("#title1").text().replace("기초율", "연금선택율") + "기초데이터.xlsx";
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivPryRate',
                sheetName : "기초율",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%",
                searchCond: $.fn.getSearchCond(gReqParam)
            },
            {
                id: 'gridDivNmrtItem',
                sheetName : "분자항목",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "원"
            },
            {
                id: 'gridDivDnmrItem',
                sheetName : "분모항목",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "원"
            },
            {
                id: 'gridDivPryRate',
                sheetName : "기초율(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            },
            {
                id: 'gridDivNmrtItem',
                sheetName : "분자항목(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "원"
            },
            {
                id: 'gridDivDnmrItem',
                sheetName : "분모항목(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "원"
            }
        ]);
    });
    
    //양식다운로드 클릭
    $("#btn_exportExcelForm").on("click", function(e){
        
        var arrColsInfo = $.fn.getTbCols("TB_IBEBDS05");
        
        console.log("양식");
        console.log(JSON.stringify(arrColsInfo));
        
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        console.log("파일명", $("#title2").text());
        
        $.fn.exportGridExcel({
            id: "gridTmpDiv", 
            fileName: $("#title2").text() + "_업로드양식.xlsx"
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
                        data["tbNm"] = "TB_IBEBDS05";
                        data["menuId"] = $.fn.getMenuId();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveDtList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                                selectAnutSlctRatList();
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

        console.log("excelRead");
        
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
* @설명: 연금선택율 > 기초데이터 기본 그리드 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 16.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 16. 최초작성
*/

function initGridDivPryRate(){
    
    var gridDivPryRate = new ComJsGrid({
        id: "gridDivPryRate",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
       
        fields : [
            { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 40, align:"center",
                itemTemplate:function(value, item){ // 상품유형, 합계 동시 표시
                    if(value==null || value=="") {
                        return 'TOTAL';
                    } else if(value=="ZZ") {
                        return 'TOTAL';
                    } else {
                        return $._commonObj["code"]["BE_NEW_LOB_CD"][value*1].codeAbbrNm;
                    }
                }
            },
            { name: "beAnutPymMthCd", title:"연금지급방법", css:"cell", type: "select", width: 40, align:"left",
                itemTemplate:function(value, item){ // 상품유형, 합계 동시 표시
                    if(value==null || value=="") {
                        if ($('input:checkbox[id="hierachy_check1"]').is(":checked") == true) {
                            return '';
                        } else {
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
        }); 
    
    //그리드 생성
    gridDivPryRate.gridCreate();
}

function initGridDivNmrtItem(){
    
    var gridDivNmrtItem = new ComJsGrid({
        id: "gridDivNmrtItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        
        fields : [
             { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 40, align:"center",
                itemTemplate:function(value, item){ // 상품유형, TOTAL 동시 표시
                     if(value==null) {
                        return 'TOTAL';
                     }  else if(value=="ZZ") {
                         return 'TOTAL';
                     } else {
                        return $._commonObj["code"]["BE_NEW_LOB_CD"][value*1].codeAbbrNm;
                     }
                }
             },
             { name: "beAnutPymMthCd", title:"연금지급방법", css:"cell", type: "select", width: 40, align:"left",
                itemTemplate:function(value, item){ // 상품유형, 합계 동시 표시
                     if(value==null) {
                        if ($('input:checkbox[id="hierachy_check1"]').is(":checked") == true) return '';
                        else return 'TOTAL';
                     }  else if(value=="ZZ") {
                         return 'TOTAL';
                     } else {
                        return $._commonObj["code"]["BE_ANUT_PYM_MTH_CD"][value-1].codeNm;
                     }
                }
             },
            { name: "wholeLife", title:"종신", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},
            { name: "establish", title:"확정", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},
            { name: "inheritance", title:"상속", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}},
            { name: "whole", title:"전체", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        ]
    }); 
    
    //그리드 생성
    gridDivNmrtItem.gridCreate();
}

function initGridDivDnmrItem(){
    
    var gridDivDnmrItem = new ComJsGrid({
        id: "gridDivDnmrItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        
        fields : [
             { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 40, align:"center",
                itemTemplate:function(value, item){ // 상품유형, 합계 동시 표시
                     if(value==null) {
                        return 'TOTAL';
                     } else if(value=="ZZ") {
                         return 'TOTAL';
                     } else {
                        return $._commonObj["code"]["BE_NEW_LOB_CD"][value*1].codeAbbrNm;
                     }
                }
             },
             { name: "beAnutPymMthCd", title:"연금지급방법", css:"cell", type: "select", width: 40, align:"left",
                itemTemplate:function(value, item){ // 상품유형, 합계 동시 표시
                     if(value==null) {
                        if ($('input:checkbox[id="hierachy_check1"]').is(":checked")) return '';
                        else return 'TOTAL';
                     } else if(value=="ZZ") {
                         return 'TOTAL';
                     } else {
                        return $._commonObj["code"]["BE_ANUT_PYM_MTH_CD"][value-1].codeNm;
                     }
                }
             },
            { name: "whole", title:"전체", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        ]
    }); 
    
    //그리드 생성
    gridDivDnmrItem.gridCreate();
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

    //하이라키체크
    var checkList = "";
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var check = $.toUnderscore($(this).val()).toUpperCase();
        checkList += ","+check;
    });
    checkList = checkList.substr(1);
    if(gReqParam.checkList != checkList) {
        return false;
    }
    
    //원오프체크
    if(gReqParam.oneoffCheck != gCondOneoffCheck) {
        return false;
    }
    return true;
}

/**
* @설명: 연금선택율 > 기초데이터 조회시 데이터 얻어오기
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 16.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 16. 최초작성
*/

function selectAnutSlctRatList(){
    // 기간받아오기
    var strYm = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
    var finYm = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
    var checkList = "";
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var check = $.toUnderscore($(this).val()).toUpperCase();
        checkList += ","+check;
    });
    checkList = checkList.substr(1);
    var rollup = 0;
    if(checkList == 'BE_NEW_LOB_CD,BE_ANUT_PYM_MTH_CD') {
        rollup = 1;
    } else {
        rollup = 0;
    }
    
    // 조회에 필요한 값을 셋팅
    gReqParam = {
                "finYmFrom": strYm,
                "finYmTo": finYm,
                "checkList" : checkList,
                "oneoffCheck" : gCondOneoffCheck,
                "rollup" : rollup
        }
        $.callAjax(gReqParam, "/be/pd/bepd171m/selectAnutSlctRatList.do")
        .done(function(data) {
         // 서버로 받아온 데이터 리스트
            var ratListData = data.ratList;
            var nmrtListData = data.nmrtList;
            var dnmrListData = data.dnmrList;

            // 0건 그리드 메세지 처리부분
            if(ratListData == null || ratListData.length == 0){
                $.fn.getReturnValue("gridDivPryRate");
            } else {
                $('#gridDivPryRate').jsGrid('loadData', ratListData);
            }
            if(nmrtListData == null || nmrtListData.length == 0){
                $.fn.getReturnValue("gridDivNmrtItem");
            } else {
                $('#gridDivNmrtItem').jsGrid('loadData', nmrtListData);
            }
            if(dnmrListData == null || dnmrListData.length == 0){
                $.fn.getReturnValue("gridDivDnmrItem");
            } else {
                $('#gridDivDnmrItem').jsGrid('loadData', dnmrListData);
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
    popupOption = {
            url: "/be/pd/bepd171p.do",
            name: "연금선택율 그래프 팝업",
            width: 1050,
            height: 850,
            arrCheck: gCondHichyCheck,
            gridData1: $("#" + "gridDivPryRate").jsGrid("option", "data"),
            gridField1: $("#" + "gridDivPryRate").jsGrid("option", "fields"),
            gridData2: $("#" + "gridDivNmrtItem").jsGrid("option", "data"),
            gridField2: $("#" + "gridDivNmrtItem").jsGrid("option", "fields"),
            gridData3: $("#" + "gridDivDnmrItem").jsGrid("option", "data"),
            gridField3: $("#" + "gridDivDnmrItem").jsGrid("option", "fields"),
            
        }

        $.fn.openPopup(popupOption);
}

function openPryRatGrpPopup_callback() {

    
}