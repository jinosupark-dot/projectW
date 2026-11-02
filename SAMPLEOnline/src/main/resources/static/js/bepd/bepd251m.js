/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 취소율 - 기초데이터
 * @설명: 취소율 - 기초데이터 화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 07. 13.
 * @최종변경일: 2023. 10. 10.
 * @개정이력: 
 *  2021. 07. 13. 최초작성
 *  2022. 05. 03. 공통코드 표기 로직 수정
 *  2022. 12. 14. 보정완료확인버튼 엑셀다운로드 옵션변경
 */

//전역변수
var gCondHichyCheck = [];
//조회여부
var gSrchYn = "N";
//취소율 기초데이터 테이블 컬럼
var gArrCols = [];
//취소율 기초데이터 테이블명
const gTbNm = "TB_IBEBDS11";
var gServiceCode = "13";
//조회조건obj
var gReqParam = {};
//조회falg
var gCondFlag = "N";
//one-off플래그
var gCondOneoffCheck = "N";

$(document).ready(function(){
    
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //MIN, MAX 년월세팅
    $.fn.getTbDateInfo(gServiceCode);
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();

    //조회조건 초기화
    initSearchData();
    
    //event 초기화
    initEvent();
    
    //조회조건별 기초율 그리드 초기화 
    initGridPryRate();
    
    //조회조건별 분자항목 그리드 초기화 
    initGridNmrtItem();
    
    //조회조건별 분모항목 그리드 초기화 
    initGridDnmrItem();
    
});


function initCommCd() {
    
    // 공통코드 조회(상품유형,채널)
    $.fn.loadCommonCode(["BE_NEW_LOB_CD","BE_CHNL_SC_CD"]);

    // 콤보박스 세팅
    /*
    $.fn.renderCombobox({
        codeArr : ["BUSN_SC_CD"],
        selArr : ["sbx_busnScCd"],
        firstOptionText : ["-전체-"]
    });
    */
}

function initEvent() {
    //*보정 배치 및 엑셀다운로드 관련 선언
    var gridTmpIdSub="gridTmpDivSub";
    var serviceNm="CANC_RAT";
    
    $("#btn_finYm_from").on("click", function(e) {
        $('#ibx_finYmFrom').datepicker('show');
    });
    
    $("#btn_finYm_to").on("click", function(e){
        $('#ibx_finYmTo').datepicker('show');
    });
    
    //one-off체크여부
    $("#oneoff_check").on("change", function(e) {

        if ($('input:checkbox[id="oneoff_check"]').is(":checked") == true) {
            gCondOneoffCheck = "Y";
        } else {
            gCondOneoffCheck = "N";
        }
    });
    
    $("#btn_search").on("click", function(e) {
        console.log("btn_search click!");

        //selectCommonCodeList();
        
        //조회년월 validation
        var condFinYmFrom = $("#ibx_finYmFrom").val();
        var condFinYmTo = $("#ibx_finYmTo").val();
        
        if(condFinYmFrom > condFinYmTo) {
            $.fn.msgBox("시작년월이 종료년월보다 클수 없습니다.");
            return;
        }
        
        //hierarchy validation
        if($("input:checkbox[name='hierarchy_check']:checked").length == 0) {
            $.fn.msgBox("구분을 하나이상 체크해주세요.(One-off반영 제외)");
            return;
        } else {            
            selectCancelrateBasedata();
        }
    }); 
    

    //엑셀다운로드 버튼 click
    $("#btn_exportExcel").on("click", function(e) {
        
        if(gCondFlag == "N" || $("#gridDivPryRate").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        var fileName = $("#title1").text().replaceAll("기초율", "취소율") + "기초데이터.xlsx";
        
        $.fn.exportMultiGridExcel([{
            
            id: 'gridDivPryRate', 
            sheetName: "기초율",
            fileName: fileName,
            applyItemTemplate: true,
            unit: "%",
            searchCond: $.fn.getSearchCond(gReqParam)
        }, {
                
            id: 'gridDivNmrtItem', 
            sheetName: "취소계약 응당보험료",
            fileName: fileName,
            applyItemTemplate: true,
            unit: "원"
            //searchCond: $.fn.getSearchCond(["inp_finYm_from","inp_finYm_to","hierachy_check1","hierachy_check2"])
        }, {
                
            id: 'gridDivDnmrItem', 
            sheetName: "응당보험료",
            fileName: fileName,
            applyItemTemplate: true,
            unit: "원"
            //searchCond: $.fn.getSearchCond(["inp_finYm_from","inp_finYm_to","hierachy_check1","hierachy_check2"])
        }, {
            
            id: 'gridDivPryRate', 
            sheetName: "기초율(코드)",
            fileName: fileName,
            applyItemTemplate: false
            ,
            unit: "%"
            //searchCond: $.fn.getSearchCond(["inp_finYm_from","inp_finYm_to","hierachy_check1","hierachy_check2"])
        }, {
                
            id: 'gridDivNmrtItem', 
            sheetName: "취소계약 응당보험료(코드)",
            fileName: fileName,
            applyItemTemplate: false,
            unit: "원"
            //searchCond: $.fn.getSearchCond(["inp_finYm_from","inp_finYm_to","hierachy_check1","hierachy_check2"])
        }, {
                
            id: 'gridDivDnmrItem', 
            sheetName: "응당보험료(코드)",
            fileName: fileName,
            applyItemTemplate: false,
            unit: "원"
            //searchCond: $.fn.getSearchCond(["inp_finYm_from","inp_finYm_to","hierachy_check1","hierachy_check2"])
        }]);

    }); 
    
    //양식다운로드 클릭
    $("#btn_exportExcelForm").on("click", function(e) {
        
        var arrColsInfo = $.fn.getTbCols(gTbNm);
        
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        $.fn.exportGridExcel({
            
            id: "gridTmpDiv", 
            fileName: $("#title2").text() + "_업로드양식.xlsx"
        });
        
    });
    
    //*보정 배치 및 엑셀다운로드 관련 선언
    $("#btn_loadBatch").on("click", function(e) {
        var reqParam = {};
        var keyIndex = 0;
        var hierarchy = "";
        $("input:checkbox[name='hierarchy_check']").each(function(e){
            if ($(this).is(":checked") == true) {
                hierarchy += "Y";
            } else {
                hierarchy += "N";
            }
            keyIndex++;
        });
        for (var i=0; i <= 10; i++) {
            if (i > keyIndex) {
                hierarchy += "N";
            }
        }
        reqParam.hierarchy = hierarchy;
        var strY = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','').substr(0,4);
        var strM = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','').substr(4);
        
        var nowDate = new Date(strY, strM, "1");
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth() - 1;
        
        var temp = new Date(year, month, "1");
        
        month = temp.getMonth().toString();
        month = month.length == 1 ? "0" + month : month;
        var strYm = year.toString() + month.toString();
        var oneOff = "0";
        if(gCondOneoffCheck == "Y") {
            oneOff = "1";
        }
        reqParam.oneOff = oneOff;
        reqParam.batName=serviceNm;
        //reqParam.batStrYm = strYm;
        reqParam.batStrYm = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
        reqParam.batFinYm = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
                $.fn.msgBox('보정을 실행하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        $.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
                        .done(function(data) {
                            if(data.result == '1') {
//                              $.fn.msgBox('정상적으로 처리되었습니다.');
                                selectAplcData(gridTmpIdSub);
                            }
                        }).fail(function(data){
                            $.fn.msgBox('보정 배치가 실패했습니다.');
                        });
                    }
                }, 2);
    });

    //*JOB MIND 보정 배치 처리확인 및 엑셀다운로드 관련 선언
    $("#btn_loadBatchChk").on("click", function(e){
        var reqParam = {};
        var keyIndex = 0;
        var hierarchy = "";
        $("input:checkbox[name='hierarchy_check']").each(function(e){
            if ($(this).is(":checked") == true) {
                hierarchy += "Y";
            } else {
                hierarchy += "N";
            }
            keyIndex++;
        });
        for (var i=0; i <= 10; i++) {
            if (i > keyIndex) {
                hierarchy += "N";
            }
        }
        var oneOff = "0";
        if(gCondOneoffCheck == "Y") {
            oneOff = "1";
        }
        reqParam.oneOff = oneOff;
        reqParam.hierarchy = hierarchy;
        reqParam.batName=serviceNm;
        reqParam.batStrYm = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
        reqParam.batFinYm = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');

        $.callAjax(reqParam, '/be/pd/commonBe/jobMindAplcBatchProc.do')
        .done(function(data) {
            if(data.chkStr == 'Y') {
                selectAplcData(gridTmpIdSub);
            } else {
            	$.fn.msgBox('보정 배치가 실행중입니다.');
            }
        }).fail(function(data){
            $.fn.msgBox('보정 배치가 실패했습니다.');
        });

    });
    
    //엑셀업로드 클릭
    $("#btn_loadExcel").on("click", function(e) {
        
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
                        data["colList"] = gArrCols;
                        data["tbNm"] = gTbNm;
                        data["menuId"] = $.fn.getMenuId();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveDtList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                                selectCancelrateBasedata();
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
* @설명: 취소율 - 조회시 조건, 현재 조건 체크 
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
    //체크한 하이라키
    gCondHichyCheck = [];
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e) {
        var colId = $(this).val();
        gCondHichyCheck.push($.toUnderscore(colId));
    });
    if(!gReqParam.hierarchyCheck.equals(gCondHichyCheck)) {
        return false;
    }
    
    //원오프체크
    if(gReqParam.oneoffCheck != gCondOneoffCheck) {
        return false;
    }
    

    return true;
}

/**
* @설명: 취소율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initGridPryRate(){
    //그리드 필드 세팅
    var param = "gridDivPryRate";
    var fieldsArr = getGridFields(param);
    // jsGrid 빈 테이블 생성
    var gridObjectPryRate = new ComJsGrid({
        id: "gridDivPryRate",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr
    }); 
    //그리드 생성
    gridObjectPryRate.gridCreate();
}

/**
* @설명: 취소율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initGridNmrtItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields();
    var gridObjectNmrtItem = new ComJsGrid({
        id: "gridDivNmrtItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr
        }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
}

/**
 * @설명: 취소율 - 기초데이터 jsGrid 빈 테이블 생성 
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  이현수 2021. 7. 7. 최초작성
 */
function initGridDnmrItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields();
    var gridObjectNmrtItem = new ComJsGrid({
        id: "gridDivDnmrItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function getGridFields(param) {
    
    $._commonObj["code"]["BE_NEW_LOB_CD"];
    $._commonObj["code"]["BE_CHNL_SC_CD"];
    //그리드 공통부분 필드
    var resultArr = [];
    //납입상태 필드
    var fpayYnScCd = { 
            name: "fpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 120, align:"center"
                , items: $.fn.getGridCodeItem("FPAY_YN_SC_CD"), textField: "codeNm", valueField: "code"
    };
    //채널유형 필드
    var chnlScCd = {
            name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 80, align:"center"
                , items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "codeNm", valueField: "code"
    };
    //상풍유형 필드
    var beNewLobCd = { 
            name: "beNewLobCd" , title:"상품유형" , css:"cell", type: "select", width: 100, editing: false, align:"center"
                , itemTemplate:function(value, item) {
                    if(item.beChnlScCd == null && $('input:checkbox[id="hierarchy_check1"]').is(":checked")){
                        return null;
                    }else {
                        var codeArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
                        for(i=0; i<codeArr.length; i++) {
                            if(value == codeArr[i].code) {
                                return codeArr[i].codeAbbrNm;
                            }
                        }
                    }
                }
    };
    //전체 필드
    var allInfo = { name: "total", title:"전체", css:"cell", type: "text",  width: 100, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
            }
    };
    //율 필드
    var allRto = { 
            name: "total", title:"전체", css:"cell", type: "text",  width: 100, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : ((value*1).toFixed(2));
            }
    };
    
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e) {
        var colId = $(this).val();
        switch(colId) {
        case "fpayYnScCd":
            resultArr.push(fpayYnScCd);
            break;
        case "beNewLobCd":
            resultArr.push(beNewLobCd);
            break;
        case "beChnlScCd":
            resultArr.push(chnlScCd);
            break;
        }
    });

    var targetArr = ["1", "2", "3", "4", "5+"];
    var fieldsArr = getFieldsArr(targetArr,param);
    resultArr = resultArr.concat(fieldsArr);
    //합계세팅
    if(param === "gridDivPryRate") {
        resultArr.push(allRto);
    } else {
        resultArr.push(allInfo);
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
function getFieldsArr(targetArr,param) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: "psgMntFgr" + $.replaceAll(target,"5+","5") , title: target + "차월", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
            if(param === "gridDivPryRate") {
                return $.fn.isEmpty(value) ? "0.00" : ((value*1).toFixed(2));
            }else {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
            }
        }};
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}

function selectCancelrateBasedata() {
    console.log("selectCancelrateBasedata");
    //$("#gridDiv").jsGrid("destroy");
    
    var condYmFrom = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
    var condYmTo = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
    
    // 체크박스 (납입상태, 상품유형, 채널) 체크
    gCondHichyCheck = [];
    var titleText = "";
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var colId = $(this).val();
        gCondHichyCheck.push($.toUnderscore(colId));
        var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
        titleText = titleText + labelText + ", ";
    });
    titleText = titleText.substr(0,titleText.length-2)+" ";
    if(gCondOneoffCheck=="Y") {
        titleText = titleText+", One-off 반영 "
    }
    
    $("#title1").text(titleText + "기초율");
    $("#title2").text(titleText + "분자항목(연환산보험료)");
    $("#title3").text(titleText + "분모항목(연환산보험료)");
    
    gReqParam = {
            "finYmFrom" : condYmFrom,
            "finYmTo" : condYmTo,
            "oneoffCheck" : gCondOneoffCheck,
            "hierarchyCheck" : gCondHichyCheck,
            "hierarchyAll" : []
    };
    resetGrid("pryDt");
    
    
    $.callAjax({"jsonStr":JSON.stringify(gReqParam)}, "/be/pd/bepd251m/selectcancRatPryDtList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid("pryDt");
        reDrawGrid("pryDt");
        
        var ratListData = data.ratList;
        var nmrtListData = data.nmrtList;
        var dnmrListData = data.dnmrList;
        
        $("#gridDivPryRate").jsGrid("loadData", ratListData).done(function(){
            console.log(JSON.stringify(ratListData));
            if(ratListData.length == 0){
                $.fn.getReturnValue("gridDivPryRate");
            }
        });
        $("#gridDivNmrtItem").jsGrid("loadData", nmrtListData).done(function(){
            console.log(JSON.stringify(nmrtListData));
            if(nmrtListData.length == 0){
                $.fn.getReturnValue("gridDivNmrtItem");
            }
        });
        $("#gridDivDnmrItem").jsGrid("loadData", dnmrListData).done(function(){
            console.log(JSON.stringify(dnmrListData));
            if(dnmrListData.length == 0){
                $.fn.getReturnValue("gridDivDnmrItem");
            }
        });
        gCondFlag = "Y";
    }).fail(function(data){
    });     
    
    
}


function isValidSc(value){
    if(value==""){
        return;
    }
    var reg = (/[`~!@#$%^&*|\\\'\";:\/?]/g);
    return reg.test(value);
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
            "serviceCode" : gServiceCode
    }
    $.callAjax(reqParam, "/be/pd/commonBe/settingFirstDate.do")
    .done(function(data) {
        var tbDateInfo = data.tbDateInfo;
        $('#ibx_finYmFrom').val($.fn.monthFormat(tbDateInfo[0].finStrYm));
        $("#ibx_finYmTo").val($.fn.monthFormat(tbDateInfo[0].finEndYm));
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
function resetGrid(type) {
  //보정grid용 초기화세팅 (*보정 히든 그리드용)
    if (type == "aplc") {
        $("#gridTmpDivSub").jsGrid("reset");
        $("#gridTmpDivSub").jsGrid("option", "data", []);
    } else {
        $("#gridDivPryRate").jsGrid("reset");
        $("#gridDivPryRate").jsGrid("option", "data", []);
        $("#gridDivNmrtItem").jsGrid("reset");
        $("#gridDivNmrtItem").jsGrid("option", "data", []);
        $("#gridDivDnmrItem").jsGrid("reset");
        $("#gridDivDnmrItem").jsGrid("option", "data", []);
    }
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
function reDrawGrid(type) {
  //보정grid용 초기화세팅 (*보정 히든 그리드용)
    if (type == "aplc") {
     $("#gridTmpDivSub").jsGrid("destroy");
     initGridTmpSubItem();
   } else {
       //그리드 destroy
        $("#gridDivPryRate").jsGrid("destroy");
        $("#gridDivNmrtItem").jsGrid("destroy");
        $("#gridDivDnmrItem").jsGrid("destroy");
        //그리드 create
        initGridPryRate();
        initGridNmrtItem();
        initGridDnmrItem();
   }
}

/**
 * @설명: 취소율 - 보정데이터 jsGrid 빈 테이블 생성 (*보정 히든 그리드용)
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 7. 7.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  임국빈 2021. 7. 7. 최초작성
 */
function initGridTmpSubItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFieldsSub();
    var gridObjectTmpSubItem = new ComJsGrid({
        id: "gridTmpDivSub",
        height: 0,
        editing: false,
        sorting: true,
        paging: true,	//변경(false -> true) -  20231010
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectTmpSubItem.gridCreate();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:감액율 보정 연도별 비중
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  임국빈 2021. 7. 8 최초작성
 */
function getGridFieldsSub() {
    var fieldList = [];
    
    //코드 목록
    $._commonObj["code"]["BE_CHNL_SC_CD"];
    $._commonObj["code"]["BE_NEW_LOB_CD"];

    var beChnlScCd = { name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 40, align:"center",
            items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "code", valueField:"code" ,
            itemTemplate:function(value, item) {
                var codeArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
                for(i=0; i<codeArr.length; i++) {
                    if(value == codeArr[i].code) {
                        return codeArr[i].code;
                    }
                }
                return value;
            }
    }
        
    var beNewLobCd = { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 40, align:"center",
            items: $.fn.getGridCodeItem("BE_NEW_LOB_CD"), textField: "code", valueField:"code" ,
            itemTemplate:function(value, item) {
                 //TOTAL 표시 및 NULL 처리
                 if ($('input:checkbox[id="hierarchy_check1"]').is(":checked") == true) {
                    if(item.beChnlScCd == "ZZ") {
                        return "";
                    }
                 }
                var codeArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
                for(i=0; i<codeArr.length; i++) {
                    if(value == codeArr[i].code) {
                        return codeArr[i].code;
                    }
                }
            }
    }
    
    //전체 필드
  var allInfo = { 
          name: "total", title:"전체", css:"cell", type: "text",  width: 140, align:"right", sorter:"number"
              , itemTemplate:function(value, item) {return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());}
  };
    
    if ($("#hierarchy_check1").is(":checked") == true) {
        fieldList.push(beChnlScCd);
    }
    if ($("#hierarchy_check2").is(":checked") == true) {
        fieldList.push(beNewLobCd);
    }
    
    for(var i=1; i<=5; i++) {
        if(i==5) {
            var field = { name: "psgMntFgr"+i, title:i+"+차월", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : (value.toString());}}
        } else {
            var field = { name: "psgMntFgr"+i, title:i+"차월", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : (value.toString());}}
        }
        fieldList.push(field);
    }
    fieldList.push(allInfo);
    
    return fieldList;
}

/**
 * @설명: 보정데이터 엑셀 출력용 hidden gridTable 조회 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 7. 7 최초작성
 */
function selectAplcData(gridTmpIdSub){
    // 조회에 필요한 값을 셋팅
    var reqParam = {};
    var strColumArr = [];
    
    // 체크박스 체크
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        strColumArr.push($(this).val());
    });
    
    reqParam.strColumArr = strColumArr;
    $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd251m/selectCancRatProdAplc.do",{async:false})
    .done(function(data) {
         // 그리드 초기화
         resetGrid("aplc");
         reDrawGrid("aplc");
         hiddenGridList = data.hiddenGridList;
//      console.log("hiddenGridList:"+JSON.stringify(hiddenGridList));
        $("#"+gridTmpIdSub).jsGrid("loadData", hiddenGridList).done(function(){
//          if(tbDtList.length == 0){
//              $.fn.getReturnValue(gridId);
//          }
            let fileName = $(document).find("title").text() + "_보정"
            + ".xlsx";
            //보정임시 테이블에서 엑셀다운
            $.fn.exportMultiGridExcel([{
                id: gridTmpIdSub, 
                fileName: fileName
            }]);
        });
    }).fail(function(data) {
        console.log("fail to fn.getTbDtSub!!!!");
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
            url: "/be/pd/bepd251p.do",
            name: "취소율 그래프 팝업",
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