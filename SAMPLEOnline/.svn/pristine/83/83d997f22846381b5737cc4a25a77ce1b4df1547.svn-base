/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 연금일시해지율 기초데이터
 * @설명: 연금일시해지율 기초데이터 화면 JS
 * @최초작성자: 이준용
 * @최초작성일: 2021. 07. 26.
 * @최종변경일: 2023. 10. 10
 * @개정이력:
 *  이준용 2021. 07. 26. 최초작성
 *  서승호 2023. 12. 14. 보정완료확인버튼 엑셀다운로드 옵션변경
 */
// 전역변수 선언부
//전역변수
var condCheck = {};
var gSrchYn = "N";
var gArrCols = [];
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//one-off플래그
var gCondOneoffCheck = "N";
//엑셀처리용 하이라키 체크
var gCondHichyCheck = [];
//집계기준구분코드
var gSmupStnd = "02";
//서비스코드 정의
var gServiceCode = "04";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
//    $($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //datepickerSetting세팅
    $.fn.getTbDateInfo(gServiceCode);

    // 공통코드 조회(납입방법,상품유형)
    $.fn.loadCommonCode(["BE_KIDI_ONPAD_SC_CD"]);
    
    //버튼 권한 처리 2021.06.14
//    $.fn.setBtnPermission([{"btnId":"#btn_excel_download","type":"A"}])

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

function initEvent() {
    var titleTextNm;
    //엑셀 업로드 및 다운로드 관련 선언
    var tbNm="TB_IBEBDS03";
    var gridTmpId="gridTmpDiv";
    
    //*보정 배치 및 엑셀다운로드 관련 선언
    var gridTmpIdSub="gridTmpDivSub";
    var serviceNm="ANUT_LAMNT_RSC_RAT";
    
    //시작년월 달력버튼 click
    $('#btn_finYmFrom').on('click', function(e){
        $('#ibx_finYmFrom').datepicker('show');
    });
    
    //죵료년월 달력버튼 click
    $('#btn_finYmTo').on('click', function(e){
        $('#ibx_finYmTo').datepicker('show');
    });
    
    //one-off체크여부
    $("#cbx_oneoff").on("change", function(e){
        if ($('input:checkbox[id="cbx_oneoff"]').is(":checked") == true) {
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
        var titleText = "";
        
        if(condFinYmFrom > condFinYmTo) {
            $.fn.msgBox("시작년월이 종료년월보다 클수 없습니다.");
            return;
        }
        
        //체크된 건수
        var checkCnt = $("input[name='hierarchy_check']:checked").length; 
        if(checkCnt <= 0) {
            $.fn.msgBox("구분을 하나이상 체크해주세요.(One-off반영 제외)");
            return;
//          selectPryRateList();
        } else {
            gCondHichyCheck = [];
            condCheck = {};
            $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
                var colId = $(this).val();
                condCheck[$(this).attr("id")] = colId;
                gCondHichyCheck.push($.toUnderscore(colId));
                labelText = $("label[for='"+ $(this).attr("id") +"']").text();
                titleText = titleText + labelText + ", ";
            });
            titleText = titleText.substr(0,titleText.length-2)+" ";
            if(gCondOneoffCheck=="Y") titleText = titleText+", One-off 반영 "
            $("#titleNm1").text(titleText + "기초율");
            $("#titleNm2").text(titleText + "분자항목(해지환급금)");
            $("#titleNm3").text(titleText + "분모항목(해약식보험료적립금)");
            selectPryRateList();
        }
        
    });
    
    // 엑셀다운로드
    $('#btn_exportExcel').on('click', function(e){
        //데이터 체크
        var dataList = $("#gridDivPryRate").jsGrid("option", "data");
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
        var unit = "";
        if($("#sbx_smupStnd").val()=='01') {
            unit = "건";
        } else {
            unit = "원";
        }

        let fileName = $("#sbx_smupStnd option:selected").text() + "_" + $("#titleNm1").text().replaceAll("기초율", "연금일시해지율") + "기초데이터.xlsx";
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
        
        var arrColsInfo = $.fn.getTbCols(tbNm);
        
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        $.fn.exportGridExcel({
            
            id: gridTmpId, 
            fileName: $("#titleNm2").text() + "_업로드양식.xlsx"
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
        
        paramObj.id = gridTmpId;                    //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols;
                        data["tbNm"] = tbNm;
                        data["menuId"] = $.fn.getMenuId();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveDtList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                                selectPryRateList();
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
* @설명: jsGrid 헤더 템플릿 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 7. 최초작성
*/
function gridHeaderRowRender(val) {
     var result;
     
     if ($("input:checkbox[id='cbx_beKidiOnpadScCd']").is(":checked") == true) {
            if ($("input:checkbox[id='cbx_beRateTypScCd']").is(":checked") == true) {
                 result = $("<tr>").height(0)
                    .append($("<th>").width(100))
                    .append($("<th>").width(100))
                    .append($("<th>").width(100))
                    .append($("<th>").width(100))
                    .append($("<th>").width(100))
                    .append($("<th>").width(100))
                    .append($("<th>").width(100))
                    .append($("<th>").width(100));
            } else {
                 result = $("<tr>").height(0)
                    .append($("<th>").width(100))
                    .append($("<th>").width(100));
            }
     } else {
         result = $("<tr>").height(0)
            .append($("<th>").width(100))
            .append($("<th>").width(100))
            .append($("<th>").width(100))
            .append($("<th>").width(100))
            .append($("<th>").width(100))
            .append($("<th>").width(100))
            .append($("<th>").width(100));
     }
     var result1, result2;
     var gridNm;
     
     if (val==1) {
         gridNm = "연금일시 해지율";
     }
     if (val==2) {
         gridNm = "해약 환급금";
     }
     if (val==3) {
         gridNm = "해약식보험료 적립금액";
     }
     // header 1row
     if ($("input:checkbox[id='cbx_beKidiOnpadScCd']").is(":checked") == true) {
        if ($("input:checkbox[id='cbx_beRateTypScCd']").is(":checked") == true) {
            result = result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("납입방법"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("Old_block"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text("New_Block"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("전체"))
                );
            // header 2row
             var result1 = $("<tr class='jsgrid-header-row'>")
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("유배당"))
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("무배당"));
             // header 3row
             var result2 = $("<tr class='jsgrid-header-row'>")
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리확정형"))
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리연동형"))
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리확정형"))
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리연동형"))
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("변액"));
             
             } else {
                result = result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입방법"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(gridNm))
                ); 
             }
    } else {
        if ($("input:checkbox[id='cbx_beRateTypScCd']").is(":checked") == true) {
             result = result.add($("<tr class='jsgrid-header-row'>")
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("Old_block"))
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text("New_Block"))
                        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("전체"))
             );
             // header 2row
             var result1 = $("<tr class='jsgrid-header-row'>")
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("유배당"))
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("무배당"));
             // header 3row
             var result2 = $("<tr class='jsgrid-header-row'>")
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리확정형"))
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리연동형"))
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리확정형"))
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리연동형"))
                     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("변액"));
        }
            
    }
        
         result = result.add(result1);
         result = result.add(result2);
     return result;
}

/**
* @설명: 갱신율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 7. 최초작성
*/
function initGridPryRate(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(1);
    // jsGrid 빈 테이블 생성
    var gridObjectPryRate = new ComJsGrid({
        id: "gridDivPryRate",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr,
        headerRowRenderer: function() {
            var $result = gridHeaderRowRender(1);
            return $result;
        }
    }); 
    //그리드 생성
    gridObjectPryRate.gridCreate();
}

/**
* @설명: 갱신율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 7. 최초작성
*/
function initGridNmrtItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(2);
    var gridObjectNmrtItem = new ComJsGrid({
        id: "gridDivNmrtItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr,
        headerRowRenderer: function() {
            var $result = gridHeaderRowRender(2);
            return $result;
        }
     }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
}

/**
 * @설명: 갱신율 - 기초데이터 jsGrid 빈 테이블 생성 
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  이준용 2021. 7. 7. 최초작성
 */
function initGridDnmrItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(3);
    var gridObjectNmrtItem = new ComJsGrid({
        id: "gridDivDnmrItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr,
        headerRowRenderer: function() {
            var $result = gridHeaderRowRender(3);
            return $result;
        }
    }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function getGridFields(val) {
    //그리드 공통부분 필드
    var resultArr = [];
    
    if ($("input:checkbox[id='cbx_beKidiOnpadScCd']").is(":checked") == true) {
        if ($("input:checkbox[id='cbx_beRateTypScCd']").is(":checked") == true) {
            resultArr = [
                { name: "beKidiOnpadScCd", title:"납입방법", css:"cell", type: "select", width: 100, align:"center"
                    , items: $.fn.getGridCodeItem("BE_KIDI_ONPAD_SC_CD", true, "label", "", "TOTAL", "TOTAL"), textField: "codeNm", valueField: "code"},
                { name: "blkScOld", title:"Old_block", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "dvdRateDcdTp", title:"(유배당) 금리확정형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "dvdRateInlckTp", title:"(유배당) 금리연동형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "woDivRateDcdTp", title:"(무배당) 금리확정형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "woDivRateInlckTp", title:"(무배당) 금리연동형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "vaIns", title:"(무배당) 변액", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "total", title: "전체", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                }
               ]
        } else {
            resultArr = [
                { name: "beKidiOnpadScCd", title:"납입방법", css:"cell", type: "select", width: 100, align:"center"
                    , items: $.fn.getGridCodeItem("BE_KIDI_ONPAD_SC_CD", true, "label", "", "TOTAL", "TOTAL"), textField: "codeNm", valueField: "code"},
                { name: "total", title:"집계", css:"cell", type: "text", width: 100, align:"right", 
                        itemTemplate:function(value, item) {
                            if(val != 1) {
                                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                            } else {
                                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                            }
                        }
                }
               ]
        }
    } else {
        if ($("input:checkbox[id='cbx_beRateTypScCd']").is(":checked") == true) {
            resultArr = [
                { name: "blkScOld", title:"Old_block", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "dvdRateDcdTp", title:"(유배당) 금리확정형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "dvdRateInlckTp", title:"(유배당) 금리연동형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "woDivRateDcdTp", title:"(무배당) 금리확정형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "woDivRateInlckTp", title:"(무배당) 금리연동형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "vaIns", title:"(무배당) 변액", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                },
                { name: "total", title: "전체", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                }
            ]
        } else {
            resultArr = [
                { name: "pryDt", title:"Old_block", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        if(val != 1) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                        } else {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                    }
                }
               ]
        }
    }
    
    /////////
    return resultArr;
}

/**
 * @설명: gridTable의 header조회
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 7 최초작성
 */
function selectPryRateList(){
    // 조회에 필요한 값을 셋팅
    var reqParam = {};
    var strColumArr = [];
    reqParam.finYmFrom = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
    reqParam.finYmTo = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
    reqParam.hierarchyCheck1 = condCheck["cbx_beKidiOnpadScCd"];
    reqParam.hierarchyCheck2 = condCheck["cbx_beRateTypScCd"];
    
    // 단위
    if(gSmupStnd == "01") {
        $("#change_span1").text("(단위: 건)");
        $("#change_span2").text("(단위: 건)");
    } else {
        $("#change_span1").text("(단위: 원)");
        $("#change_span2").text("(단위: 원)");
    }
    
    // 체크박스 (납입상태, 상품유형, 채널) 체크
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        strColumArr.push($(this).val());
    });
    
    reqParam.strColumArr = strColumArr;
    
    //One-off 체크
    var oneoffChk = "N";
    if ($('input:checkbox[id="cbx_oneoff"]').is(":checked") == true) {
        oneoffChk = "Y";
    } else {
        oneoffChk = "N";
    }

    reqParam.oneoffChk = oneoffChk;
    reqParam.smupStnd = gSmupStnd;
    
    gReqParam = reqParam;
    gReqParam.oneoffCheck = gCondOneoffCheck;
    gReqParam.hierarchyCheck = gCondHichyCheck;
    gReqParam.smupStnd = gSmupStnd;
    // 기간계 데이터 조회
   $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd151m/selectAnutLamntRscRatPryDtList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid("pryDt");
        reDrawGrid("pryDt");
        
        // 그리드 바인딩
        var rateListData = data.rateList;
        var nmrtListData = data.nmrtList;
        var dnmrListData = data.dnmrList;
        
        $("#gridDivPryRate").jsGrid("loadData", rateListData).done();
        $("#gridDivNmrtItem").jsGrid("loadData", nmrtListData).done();
        $("#gridDivDnmrItem").jsGrid("loadData", dnmrListData).done();
        
         // 0건 그리드 메세지 처리부분
        if(rateListData.length == 0) {
            $.fn.getReturnValue("gridDivPryRate");
        }
        if(nmrtListData.length == 0) {
            $.fn.getReturnValue("gridDivNmrtItem");
        }
        if(dnmrListData.length == 0) {
            $.fn.getReturnValue("gridDivDnmrItem");
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
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
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 7 최초작성
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
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
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
 * @설명: 연금일시해지율 - 보정데이터 jsGrid 빈 테이블 생성 (*보정 히든 그리드용)
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  이준용 2021. 7. 7. 최초작성
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
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:감액율 보정 연도별 비중
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function getGridFieldsSub() {
    var resultArr = [];
    var fieldsArr = getTargetFieldsArrSub();
    resultArr = resultArr.concat(fieldsArr);
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 경과월 배열 
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function getTargetFieldsArrSub() {
    var resultArr = [];
    if ($("input:checkbox[id='cbx_beKidiOnpadScCd']").is(":checked") == true) {
         //그리드 공통부분 필드
        resultArr.push(
//          { name: "beKidiOnpadScCd", title:"납입방법", css:"cell", type: "select", width: 100, align:"center", 
//              items: $.fn.getGridCodeItem("BE_KIDI_ONPAD_SC_CD", true, "label", "", "TOTAL", "TOTAL"), textField: "codeNm", valueField: "code",
//          }
            { name: "beKidiOnpadScCd", title:"납입방법", css:"cell", type: "text", width: 100, align:"center"}
        );
        if ($("input:checkbox[id='cbx_beRateTypScCd']").is(":checked") == true) {
            resultArr.push(
                { name: "blkScOld", title: "Old_block", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "dvdRateDcdTp", title: "(유배당)금리확정형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "dvdRateInlckTp", title: "(유배당)금리연동형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "woDivRateDcdTp", title: "(무배당)금리확정형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "woDivRateInlckTp", title: "(무배당)금리연동형",  css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "vaIns", title: "(무배당)변액", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "total", title:"전체", css:"cell", type: "text",  width: 100, align:"right", sorter:"number", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                }
            );
        } else {
            resultArr.push(
                { name: "beKidiOnpadScCd", title:"납입방법", css:"cell", type: "select", width: 100, align:"center"},
                { name: "total", title:"집계", css:"cell", type: "text", width: 100, align:"right", 
                        itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                }
            );
        }
    } else {
        resultArr.push(
                { name: "blkScOld", title: "Old_block", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "dvdRateDcdTp", title: "(유배당)금리확정형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "dvdRateInlckTp", title: "(유배당)금리연동형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "woDivRateDcdTp", title: "(무배당)금리확정형", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "woDivRateInlckTp", title: "(무배당)금리연동형",  css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "vaIns", title: "(무배당)변액", css:"cell", type: "text", width: 100, align:"right", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                },
                { name: "total", title:"전체", css:"cell", type: "text",  width: 100, align:"right", sorter:"number", 
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
                }
            );
    }
    return resultArr;
}

/**
 * @설명: 보정데이터 엑셀 출력용 hidden gridTable 조회 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 7 최초작성
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
    reqParam.smupStnd = gSmupStnd;
    $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd151m/selectAnutLamntRscRatProdAplc.do",{async:false})
    .done(function(data) {
         // 그리드 초기화
         resetGrid("aplc");
         reDrawGrid("aplc");
         hiddenGridList = data.hiddenGridList;
        $("#"+gridTmpIdSub).jsGrid("loadData", hiddenGridList).done(function(){
            let fileName = $(document).find("title").text() + "_보정"
            + ".xlsx";
            //보정임시 테이블에서 엑셀다운
            $.fn.exportGridExcel({
                id: gridTmpIdSub, 
                fileName: fileName
            });
        });
    }).fail(function(data) {
        console.log("fail to fn.getTbDtSub!!!!");
    });
}

/**
* @설명: 연금일시해지율 - 조회시 조건, 현재 조건 체크 
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
    gCondHichyCheck = [];
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var colId = $(this).val();
        gCondHichyCheck.push($.toUnderscore(colId));
    });
    if(!gReqParam.hierarchyCheck.equals(gCondHichyCheck)) {
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
            url: "/be/pd/bepd151p.do",
            name: "연금일시해지율 그래프 팝업",
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