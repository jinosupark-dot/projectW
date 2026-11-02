/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 갱신율
 * @설명: 갱신율 > 기초데이터 화면의 JS
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 07. 07.
 * @최종변경일: 2023. 10. 10. 
 * @개정이력: 
 *  박세라 2021. 07. 07. 최초작성
 *  서승호 2022. 05. 03. 공통코드 표기 로직 수정
 *  서승호 2023. 12. 14. 보정완료확인버튼 엑셀다운로드 옵션변경
 */
//전역변수
var gCondHichyCheck = [];
var gSrchYn = "N";
var gArrCols = [];
var serviceCode = "09";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//one-off플래그
var gCondOneoffCheck = "N";
//집계기준구분코드
var gSmupStnd = "02";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //datepickerSetting세팅
    $.fn.getTbDateInfo(serviceCode);
    
    //버튼 권한 처리 2021.06.14
//    $.fn.setBtnPermission([{"btnId":"#btn_exportExcel","type":"A"}])

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

/**
* @설명: 갱신율 > 기초데이터 기본 이벤트 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 13.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 13. 최초작성
*/

function initEvent() {
    //*보정 배치 및 엑셀다운로드 관련 선언
    var gridTmpIdSub="gridTmpDivSub";
    var serviceNm="RENW_RAT";
    $.fn.loadCommonCode(["SMUP_STND_SC_CD","RLDM_SC_CD","RENW_TYP_PRDT_SC_CD","RENW_CYL_SC_CD"]);
    
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
    
    // 집계기준 변경이벤트
    $("#sbx_smupStnd").on("change", function(e){
        gSmupStnd = $("#sbx_smupStnd").val();
    });
    
    // 조회
    $('#btn_search').on('click', function(e){
        //조회년월 validation
        var condFinYmFrom = $("#ibx_finYmFrom").val();
        var condFinYmTo = $("#ibx_finYmTo").val();
        if(condFinYmFrom > condFinYmTo) {
            $.fn.msgBox("시작년월이 종료년월보다 클수 없습니다.");
            return;
        }
        
        //hierachy validation
        if($("input:checkbox[name='hierarchy_check']:checked").length == 0) {
            $.fn.msgBox("구분을 하나이상 체크해주세요.(One-off반영 제외)");
            return;
        }
        
        // 체크박스 (납입상태, 상품유형, 채널) 체크
        gCondHichyCheck = [];
        var titleText = "";
        $('input:checkbox[name="hierarchy_check"]:checked').each(function(e){
            var colId = $(this).val();
            gCondHichyCheck.push($.toUnderscore(colId));
            var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
            titleText = titleText + labelText + ", ";
        });
        titleText = titleText.substr(0,titleText.length-2)+" ";
        if(gCondOneoffCheck=="Y") titleText = titleText+", One-off 반영 "

        $("#title1").text(titleText + "기초율");
        $("#title2").text(titleText + "분자항목(갱신계약건)");
        $("#title3").text(titleText + "분모항목(갱신도래계약건)");
        
        selectRenwRatList();
    });
    
    // 엑셀다운로드
    $('#btn_excel_download').on('click', function(e){
        if(gCondFlag == "N" || $("#gridDivPryRate").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        } else if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        var unit = "";
        if($("#sbx_smupStnd").val()=='01') {
            unit = "건";
        } else {
            unit = "원";
        }

        var fileName = $("#sbx_smupStnd option:selected").text() + "_" + $("#title1").text().replace("기초율", "갱신율") + "기초데이터.xlsx";
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
                unit: unit
            },
            {
                id: 'gridDivDnmrItem',
                sheetName : "분모항목",
                fileName: fileName,
                applyItemTemplate : true,
                unit: unit
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
                unit: unit
            },
            {
                id: 'gridDivDnmrItem',
                sheetName : "분모항목(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: unit
            }
        ]);
    });
    
    //양식다운로드 클릭
    $("#btn_exportExcelForm").on("click", function(e){
        
        var arrColsInfo = $.fn.getTbCols("TB_IBEBDS07");
        
        console.log("양식");
        console.log(JSON.stringify(arrColsInfo));
        
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        $.fn.exportGridExcel({
            id: "gridTmpDiv", 
            fileName: $("#title1").text().replace("기초율", "갱신율") + "_업로드양식.xlsx"
        });
        
    });
    
    //*보정 배치 및 엑셀다운로드 관련 선언
    $("#btn_loadBatch").on("click", function(e){
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
                        data["tbNm"] = "TB_IBEBDS07";
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
    $("#btn_finYm_from", "#btn_finYm_to").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
    
    //그래프 클릭
    $("#btn_graph").on("click", function(e) {
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
* @설명: 갱신율 > 기초데이터 기본 그리드 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 13.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 13. 최초작성
*/

function getGridFieldList(num) {
    var fieldList = [];
    if($('input:checkbox[id="chk_hierachy_check1"]').is(":checked") == true) {
        var common = { name: "renwTypPrdtScCd", title:"상품유형", css:"cell", type: "select", width: 40, align:"center",
                        itemTemplate:function(value, item){ // 상품유형, 합계 동시 표시
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
        fieldList.push(common);
    }
    if($('input:checkbox[id="chk_hierachy_check2"]').is(":checked") == true) {
        var common2 = { name: "renwCylScCd", title:"갱신주기", css:"cell", type: "select", width: 40, align:"center",
                        //사업비 항목 처리
                        itemTemplate:function(value, item){ // 상품유형, 합계 동시 표시
                            if(value==null) {
                                if(item.renwTypPrdtScCd==null && $('input:checkbox[id="chk_hierachy_check1"]').is(":checked") == true) return "";
                                else return 'TOTAL';
                            } else if (value=='025' || value=='026' || value=='027') {
                                return "";
                            } else if (value=='045' || value=='046' || value=='047') {
                                return "";
                            } else {
                            	var codeArr = $.fn.getGridCodeItem("RENW_CYL_SC_CD");
                                for(i=0; i<codeArr.length; i++) {
                                    if(value == codeArr[i].code) {
                                        return codeArr[i].codeAbbrNm;
                                    }
                                }
                            }
                        }
                    }
        fieldList.push(common2);
    }
    if(num==1) {
        for(var i=1; i<=4; i++) {
            if(i==4) {
                var field = { name: "renwTms"+i, title:i+"회차+", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
                fieldList.push(field);
            } else {
                var field = { name: "renwTms"+i, title:i+"회차", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
                fieldList.push(field);
            }
        }
        var last = { name: "whole", title:"전체", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
        fieldList.push(last);
    } else {
        for(var i=1; i<=4; i++) {
            if(i==4) {
                var field = { name: "renwTms"+i, title:i+"회차+", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
                fieldList.push(field);
            } else {
                var field = { name: "renwTms"+i, title:i+"회차", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
                fieldList.push(field);
            }
        }
        var last = { name: "whole", title:"전체", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        fieldList.push(last);
    }
    return fieldList;
}

function initGridPryRate(){

    var fieldListArr = getGridFieldList(1);
    var gridObjectPryRate = new ComJsGrid({
        id: "gridDivPryRate",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        
        fields : fieldListArr
        }); 
    
    //그리드 생성
    gridObjectPryRate.gridCreate();
}

function initGridNmrtItem(){

    var fieldListArr = getGridFieldList(2);
    var gridObjectNmrtItem = new ComJsGrid({
        id: "gridDivNmrtItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        
        fields : fieldListArr
        }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
}

function initGridDnmrItem(){
    
    var fieldListArr = getGridFieldList(3);
    var gridObjectNmrtItem = new ComJsGrid({
        id: "gridDivDnmrItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        
        fields : fieldListArr
    }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
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
    // 집계기준체크
    if(gReqParam.smupStnd != gSmupStnd) {
        return false;
    }
    
    return true;
}

/**
* @설명: 갱신율 > 기초데이터 데이터 얻어오기
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 13.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 13. 최초작성
*/

function selectRenwRatList(){
    if(gSmupStnd == "01") {
        $("#change_span1").text("(단위: 건)");
        $("#change_span2").text("(단위: 건)");
    } else {
        $("#change_span1").text("(단위: 원)");
        $("#change_span2").text("(단위: 원)");
    }
    
    // 기간받아오기
    var strYm = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
    var finYm = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');

    var checkList = "";
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var check = $.toUnderscore($(this).val());
        check = check.toUpperCase();
        checkList += ","+check;
    });
    checkList = checkList.substr(1);
    
    // 조회에 필요한 값을 셋팅
    gReqParam = {
                "finYmFrom": strYm,
                "finYmTo": finYm,
                "checkList" : checkList,
                "oneoffCheck" : gCondOneoffCheck,
                "smupStnd" : gSmupStnd
        }
        $.callAjax(gReqParam, "/be/pd/bepd211m/selectRenwRatList.do")
        .done(function(data) {
         // 초기화
            $("#gridDivPryRate").jsGrid("reset");
            $("#gridDivPryRate").jsGrid("option", "data", []);
            $("#gridDivNmrtItem").jsGrid("reset");
            $("#gridDivNmrtItem").jsGrid("option", "data", []);
            $("#gridDivDnmrItem").jsGrid("reset");
            $("#gridDivDnmrItem").jsGrid("option", "data", []);
            $("#gridDivPryRate").jsGrid("destroy");
            $("#gridDivNmrtItem").jsGrid("destroy");
            $("#gridDivDnmrItem").jsGrid("destroy");
            initGridPryRate();
            initGridNmrtItem();
            initGridDnmrItem();
            
            // 서버로 받아온 데이터 리스트
            var ratListData = data.ratList;
            var nmrtListData = data.nmrtList;
            var dnmrListData = data.dnmrList;
            var midList = data.midList;
            if(midList != null && midList.length>0) {
                for(var i=0; i<ratListData.length; i++) {
                    if(ratListData[i].renwTypPrdtScCd == '02' && ratListData[i].renwCylScCd == null) {
                        ratListData.splice(i+1, 0, midList[0]);
                        nmrtListData.splice(i+1, 0, midList[1]);
                        dnmrListData.splice(i+1, 0, midList[2]);
                        continue;
                    } else if(ratListData[i].renwTypPrdtScCd == '04' && ratListData[i].renwCylScCd == null) {
                        ratListData.splice(i+1, 0, midList[3]);
                        nmrtListData.splice(i+1, 0, midList[4]);
                        dnmrListData.splice(i+1, 0, midList[5]);
                        continue;
                    }
                }
            }

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
 * @설명: 갱신율 - 보정데이터 jsGrid 빈 테이블 생성 (*보정 히든 그리드용)
 * @최초작성자: 박세라
 * @최초작성일: 2021. 7. 7.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  박세라 2021. 7. 7. 최초작성
 */
function initGridTmpSubItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFieldsSub();
    var gridObjectTmpSubItem = new ComJsGrid({
        id: "gridTmpDivSub",
        height: 0,
        editing: false,
        sorting: true,
        paging: true,	//변경(false -> true) -  20231214
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectTmpSubItem.gridCreate();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 박세라
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:갱신율 보정 연도별 비중
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  박세라 2021. 7. 8 최초작성
 */
function getGridFieldsSub() {
    var fieldList = [];
	//코드 목록
    $._commonObj["code"]["SMUP_STND_SC_CD"];
    $._commonObj["code"]["RLDM_SC_CD"];
	$._commonObj["code"]["RENW_TYP_PRDT_SC_CD"];
	$._commonObj["code"]["RENW_CYL_SC_CD"];

	var common0 =  { name: "smupStndScCd", title:"집계기준구분코드", css:"cell", type: "select", width: 40, align:"center",
            items: $.fn.getGridCodeItem("SMUP_STND_SC_CD"), textField: "code", valueField:"code" ,
            itemTemplate:function(value, item) {
                if (value == null || value == '') {
                    return '';
                } else {
                    value;
                }
            }
	}
	
	var common1 =  { name: "rldmScCd", title:"실손구분코드", css:"cell", type: "select", width: 40, align:"center",
            items: $.fn.getGridCodeItem("RLDM_SC_CD"), textField: "code", valueField:"code" ,
            itemTemplate:function(value, item) {
                if (value == null || value == '') {
                    return '';
                } else {
                    value;
                }
            }
	}
	
    var common =  { name: "renwTypPrdtScCd", title:"상품유형", css:"cell", type: "select", width: 40, align:"center",
                        items: $.fn.getGridCodeItem("RENW_TYP_PRDT_SC_CD"), textField: "code", valueField:"code" ,
                        itemTemplate:function(value, item) {
                            //TOTAL 항목 표시 및 NULL처리
                            if(value == 'ZZ' && item.rldmScCd == 'ZZ') {
                                return 'ZZ';
                            } else if(value == 'ZZ' && item.rldmScCd == '01') {
                                return '실손TOTAL';
                            } else if(value == 'ZZ' && item.rldmScCd == '02') {
                                return '실손외TOTAL';
                            } else if (value == null || value == '') {
                                return '';
                            } else {
                                value;
                            }
                        }
    }
    var common2 = { name: "renwCylScCd", title:"갱신주기", css:"cell", type: "select", width: 40, align:"center",
                        items: $.fn.getGridCodeItem("RENW_CYL_SC_CD"), textField: "code", valueField:"code" ,
                        itemTemplate:function(value, item) {
                        	 //TOTAL 항목 표시 및 NULL처리
                        	 if ($('input:checkbox[id="chk_hierachy_check1"]').is(":checked") == true) {
                                 if(value == 'ZZ' && item.renwTypPrdtScCd == 'ZZ') {
                                     return '';
                                 } else if (value == 'ZZ' && item.renwTypPrdtScCd != 'ZZ') {
                                     return 'ZZ'
                                 } else if (value == null || value == '') {
                                     return '';
                                 } else {
                                     return value;
                                 }
                             }
                            var codeArr = $.fn.getGridCodeItem("RENW_CYL_SC_CD");
                            for(i=0; i<codeArr.length; i++) {
                                if(value == codeArr[i].code) {
                                    return codeArr[i].code;
                                }
                            }
//                        	 return value;
                        }
    }
	
	fieldList.push(common0);
	fieldList.push(common1);
	
    if ($("#chk_hierachy_check1").is(":checked") == true) {
    	fieldList.push(common);
	}
	if ($("#chk_hierachy_check2").is(":checked") == true) {
		fieldList.push(common2);
	}

    for(var i=1; i<=4; i++) {
        var field = { name: "renwTms"+i, title:i+"회차", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        fieldList.push(field);
    }
    var last = { name: "whole", title:"전체", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
        return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
    fieldList.push(last);
    
    return fieldList;
}

/**
 * @설명: 보정데이터 엑셀 출력용 hidden gridTable 조회 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 박세라
 * @최초작성일: 2021. 7. 7
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 박세라 2021. 7. 7 최초작성
 */
function selectAplcData(gridTmpIdSub){
    // 조회에 필요한 값을 셋팅
    var reqParam = {};
    var strColumArr = [];
    
    // 체크박스 (채널, 상품유형) 체크
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
    	strColumArr.push($.toUnderscore($(this).val()));
    });
    
    reqParam.strColumArr = strColumArr;
    reqParam.smupStnd = gSmupStnd;
    $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd211m/selectRenwRatProdAplc.do",{async:false})
    .done(function(data) {
         // 그리드 초기화
        $("#gridTmpDivSub").jsGrid("reset");
        $("#gridTmpDivSub").jsGrid("option", "data", []);
        $("#gridTmpDivSub").jsGrid("destroy");
        initGridTmpSubItem();
        
        hiddenGridList = data.hiddenGridList;
//      console.log("hiddenGridList:"+JSON.stringify(hiddenGridList));
        $("#"+gridTmpIdSub).jsGrid("loadData", hiddenGridList).done(function(){
//          if(tbDtList.length == 0){
//              $.fn.getReturnValue(gridId);
//          }
            let fileName = $(document).find("title").text() + "_보정.xlsx";
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
            url: "/be/pd/bepd211p.do",
            name: "그래프 팝업",
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