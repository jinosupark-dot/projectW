/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 연금개시후 해지율 - 기초데이터
 * @설명: 연금개시후 해지율  - 기초데이터 화면의 JS
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 12.
 * @최종변경일: 2023. 10. 10.
 * @개정이력: 
 *  이현수 2021. 07. 12. 최초작성
 *  서승호 2023. 12. 14. 보정완료확인버튼 엑셀다운로드 옵션변경
 */
//전역변수
var condCheck = {};
var gArrCols = [];
//조회조건obj
var gReqParam = {};
//조회falg
var gCondFlag = "N";
//one-off플래그
var gCondOneoffCheck = "N";
//서비스코드 정의
var serviceCode = "05";
//집계기준구분코드
var gSmupStnd = "02";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //datepickerSetting세팅
	$.fn.getTbDateInfo(serviceCode);
	
	// 초기 날짜 세팅
	initSearchData();
    
    // 공통코드 조회(연금지급유형)
    $.fn.loadCommonCode(["BE_ANUT_PYM_MTH_CD"]);

    //event 초기화
    initEvent();
    
    //조회조건별 기초율 그리드 초기화 
    initGridPryRate();
    
    //조회조건별 분자항목 그리드 초기화 
    initGridNmrtItem();
    
    //조회조건별 분모항목 그리드 초기화 
    initGridDnmrItem();
    
    initGridTmpSubItem();
});

function initEvent() {
    //시작년월 달력버튼 click
    $("#btn_finYmFrom").on("click", function(e){
        $('#ibx_finYmFrom').datepicker("show");
    });
    
    //죵료년월 달력버튼 click
    $("#btn_finYmTo").on("click", function(e){
        $("#ibx_finYmTo").datepicker("show");
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
    $("#btn_search").on("click", function(e){
        //조회년월 validation
        var condFinYmFrom = $("#ibx_finYmFrom").val();
        var condFinYmTo = $("#ibx_finYmTo").val();
        
        if(condFinYmFrom > condFinYmTo) {
            $.fn.msgBox("시작년월이 종료년월보다 클수 없습니다.");
            return;
        }
        
        if (gCondOneoffCheck == 'Y') {
            $("#title1").text("조회조건별 기초율[One-off 반영]");
            $("#title2").text("조회조건별 분자항목[One-off 반영](해지환급금)");
            $("#title3").text("조회조건별 분모항목[One-off 반영](해약식보험료적립금)");
        } else {
            $("#title1").text("조회조건별 기초율");
            $("#title2").text("조회조건별 분자항목(해지환급금)");
            $("#title3").text("조회조건별 분모항목(해약식보험료적립금)");
        }
        
        selectAnutBgnAftRscRatPryRateList();
        
    });
    
    //*보정 배치 및 엑셀다운로드 관련 선언
    $("#btn_loadBatch").on("click", function(e){
        var reqParam = {};
		var keyIndex = 0;
		var hierarchy = "NNNNNNNNNN";
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
    
    // 엑셀다운로드
    $("#btn_excel_download").on("click", function(e) {
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
        
        let fileName = "";
        if (gCondOneoffCheck == 'Y') {
            fileName =  $("#sbx_smupStnd option:selected").text() + "_" + "One-off반영 연금개시후 해지율 기초데이터.xlsx";
        } else {
            fileName =  $("#sbx_smupStnd option:selected").text() + "_" + "연금개시후 해지율 기초데이터.xlsx";
        }
        var unit = "";
        if($("#sbx_smupStnd").val()=='01') {
            unit = "건";
        } else {
            unit = "원";
        }
        
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
        var arrColsInfo = $.fn.getTbCols("TB_IBEBDS04");

        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        $.fn.exportGridExcel({
            
            id: "gridTmpDiv", 
            fileName: "연금개시후해지율_업로드양식.xlsx"
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
                        data["colList"] = gArrCols;
                        data["tbNm"] = "TB_IBEBDS04";
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
    
    //*보정 배치 및 엑셀다운로드 관련 선언
    var gridTmpIdSub="gridTmpDivSub";
    var serviceNm="ANUT_BGN_AFT_RSC";
}

/**
* @설명: 연금개시후 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 12.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 12. 최초작성
*/
function initGridPryRate(){
    
    var fieldsArr = getGridFields(1);
    var headerRowArr = getGridHederRow();
    
    var gridObjectPryRate = new ComJsGrid({
        id: "gridDivPryRate",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
        
    }); 
    
    //그리드 생성
    gridObjectPryRate.gridCreate();
}

/**
* @설명: 연금개시후 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initGridNmrtItem(){
    
    var fieldsArr = getGridFields(2);
    var headerRowArr = getGridHederRow();
    
    var gridObjectNmrtItem = new ComJsGrid({
        id: "gridDivNmrtItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
        
    }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
}

/**
 * @설명: 연금개시후 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  이현수 2021. 7. 7. 최초작성
 */
function initGridDnmrItem(){
    
    var fieldsArr = getGridFields(3);
    var headerRowArr = getGridHederRow();
    
    var gridObjectNmrtItem = new ComJsGrid({
        id: "gridDivDnmrItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
        
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
    //원오프체크
    if(gReqParam.oneoffChk != gCondOneoffCheck) {
        return false;
    }
    // 집계기준체크
    if(gReqParam.smupStnd != gSmupStnd) {
        return false;
    }
    return true;
}

/**
 * @설명: gridTable의 header조회
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 7 최초작성
 */
function selectAnutBgnAftRscRatPryRateList(){
    if(gSmupStnd == "01") {
        $("#change_span1").text("(단위: 건)");
        $("#change_span2").text("(단위: 건)");
    } else {
        $("#change_span1").text("(단위: 원)");
        $("#change_span2").text("(단위: 원)");
    }
    
    // 조회에 필요한 값을 셋팅
    gReqParam.finYmFrom = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
    gReqParam.finYmTo = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
    gReqParam.oneoffChk = gCondOneoffCheck;
    gReqParam.smupStnd = gSmupStnd;

    // 기간계 데이터 조회
   $.callAjax(gReqParam, "/be/pd/bepd161m/selectAnutBgnAftRscRatPryRatList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid("pryDt");
        // 그리드 바인딩
        var rateListData = data.rateList;
        var nmrtListData = data.nmrtList;
        var dnmrListData = data.dnmrList;
        
        $("#gridDivPryRate").jsGrid("loadData", rateListData).done(function(){ });
        $("#gridDivNmrtItem").jsGrid("loadData", nmrtListData).done(function(){ });
        $("#gridDivDnmrItem").jsGrid("loadData", dnmrListData).done(function(){ });
        
        // 0건 그리드 메세지 처리부분
        if(rateListData == null || rateListData.length == 0) {
            $.fn.getReturnValue("gridDivPryRate");
        }
        if(nmrtListData == null || nmrtListData.length == 0) {
            $.fn.getReturnValue("gridDivNmrtItem");
        }
        if(dnmrListData == null || dnmrListData.length == 0) {
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
    }
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수: String: 구분자
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 28 최초작성
 */
function getGridFields(num) {
    var resultArr = [];
    var anutPymMthCdArr = $.fn.getGridCodeItem("BE_ANUT_PYM_MTH_CD");
    resultArr = [
        { name: "beAnutPymMthCd", title:"연금지급유형", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
                var textField = "TOTAL";
                for(i=0; i<anutPymMthCdArr.length; i++) {
                    if(value == anutPymMthCdArr[i].code) {
                        textField = anutPymMthCdArr[i].codeAbbrNm;
                        break;
                    }
                }
                return textField;
            }
        },
        { name: "blkScOld", title: "Old_block", css:"cell", type: "text", width: 100, align:"right", 
            itemTemplate:function(value, item) {
                if(num != 1) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                } else {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
            }
        },
        { name: "dvdRateDcdTp", title: "(유배당) 금리확정형", css:"cell", type: "text", width: 100, align:"right", 
            itemTemplate:function(value, item) {
                if(num != 1) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                } else {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
            }
        },
        { name: "dvdRateInlckTp", title: "(유배당) 금리연동형", css:"cell", type: "text", width: 100, align:"right", 
            itemTemplate:function(value, item) {
                if(num != 1) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                } else {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
            }
        },
        { name: "woDivDemTp", title: "(무배당) 금리확정형", css:"cell", type: "text", width: 100, align:"right", 
            itemTemplate:function(value, item) {
                if(num != 1) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                } else {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
            }
        },
        { name: "woDivRateInlckTp", title:  "(무배당) 금리연동형",  css:"cell", type: "text", width: 100, align:"right", 
            itemTemplate:function(value, item) {
                if(num != 1) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                } else {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
            }
        },
        { name: "vaIns", title: "(무배당) 변액", css:"cell", type: "text", width: 100, align:"right", 
            itemTemplate:function(value, item) {
                if(num != 1) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                } else {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
            }
        },
        { name: "total", title: "전체", css:"cell", type: "text", width: 100, align:"right", 
            itemTemplate:function(value, item) {
                if(num != 1) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                } else {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
            }
        },
        ];
    
    return resultArr;
}

/**
 * @설명: 그리드 헤더 세팅
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 28 최초작성
 */
function getGridHederRow() {
    var $result = $("<tr>").height(0)
    .append($("<th>").width(150))
    .append($("<th>").width(100))
    .append($("<th>").width(100))
    .append($("<th>").width(100))
    .append($("<th>").width(100))
    .append($("<th>").width(100))
    .append($("<th>").width(100))
    .append($("<th>").width(100));

    // header 1row
    $result = $result.add($("<tr class='jsgrid-header-row'>")
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("연금지급유형"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("Old_block"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text("New_block"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text("전체"))); 
    
    //header 2row
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
    //그리드 공통부분 필드
    var resultArr = [
        { name: "beAnutPymMthCd", title:"연금지급유형", css:"cell", type: "select", width: 100, align:"center"},
        { name: "blkScOld", title: "Old_block", css:"cell", type: "text", width: 100, align:"right"},
        { name: "dvdRateDcdTp", title: "(유배당)금리확정형", css:"cell", type: "text", width: 100, align:"right"},
        { name: "dvdRateInlckTp", title: "(유배당)금리연동형", css:"cell", type: "text", width: 100, align:"right"},
        { name: "woDivDemTp", title: "(무배당)금리확정형", css:"cell", type: "text", width: 100, align:"right"},
        { name: "woDivRateInlckTp", title: "(무배당)금리연동형",  css:"cell", type: "text", width: 100, align:"right"},
        { name: "vaIns", title: "(무배당)변액", css:"cell", type: "text", width: 100, align:"right"},
        { name: "total", title:"전체", css:"cell", type: "text",  width: 100, align:"right", sorter:"number"}
    ];

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
    reqParam.smupStnd = gSmupStnd;
    $.callAjax(reqParam, "/be/pd/bepd161m/selectAnutBgnAftRscRatProdAplc.do",{async:false})
    .done(function(data) {
         // 그리드 초기화
         resetGrid("aplc");
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
			url: "/be/pd/bepd161p.do",
			name: "연금개시후해지율 그래프 팝업",
			width: 1050,
			height: 850,
			arrCheck: ["BE_ANUT_PYM_MTH_CD"],
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