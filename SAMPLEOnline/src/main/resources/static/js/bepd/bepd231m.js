/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 중도인출율 - 기초데이터
 * @설명: 중도인출율 - 기초데이터 화면의 JS
 * @최초작성자: 이현수
 * @최초작성일: 2021. 07. 07.
 * @최종변경일: 2023. 10. 10.
 * @개정이력: 
 *  이현수 2021. 07. 07. 최초작성
 *  서승호 2023. 12. 14. 산출구분단위 추가, 보정완료확인버튼 엑셀다운로드 옵션변경
 */
//전역변수
var gCondHichyCheck = [];
var gArrCols = [];
//서비스코드 정의
var gServiceCode = "11";
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
    
    initGridTmpSubItem();
});

function initCommCd() {
    // 공통코드 조회(해지율산출구분코드, BE완납여부구분코드, BE채널구분코드, BE신규LOB코드)
    $.fn.loadCommonCode(["RSC_RAT_PROD_SC_CD","BE_FPAY_YN_SC_CD","BE_CHNL_SC_CD","BE_NEW_LOB_CD"]);
}

function initEvent() {
    //*보정 배치 및 엑셀다운로드 관련 선언
    var gridTmpIdSub="gridTmpDivSub";
    var serviceNm="MDROT_RAT";
    
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
    
    // 조회
    $("#btn_search").on("click", function(e){
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
        	
            condCheck = {};
            var titleText = "";
            $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
                var colId = $(this).val();
                condCheck[$(this).attr("id")] = colId;
                var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
                titleText = titleText + labelText + ", ";
            });
            titleText = titleText.substr(0,titleText.length-2)+" ";
            if(gCondOneoffCheck=="Y") {
                titleText = titleText+", One-off 반영 "
            }

            $("#titlPryRat").text(titleText + "기초율");
            $("#titlNmrtItm").text(titleText + "분자항목(중도인출금)");
            $("#titlDnmrItm").text(titleText + "분모항목(해약식보험료적립금)");
            
            selectMdrotRatPryRateList();
        }
        
    });
    
    //엑셀다운로드
    $("#btn_excel_download").on("click", function(e){
        
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
        
        let fileName = $("#titlPryRat").text().replace("기초율", "중도인출율") + "기초데이터.xlsx";
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
    
    //양식다운로드 클릭
    $("#btn_exportExcelForm").on("click", function(e){
        var arrColsInfo = $.fn.getTbCols("TB_IBEBDS09");

        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        $.fn.exportGridExcel({
            
            id: "gridTmpDiv", 
            fileName: $("#titlNmrtItm").text() + "_업로드양식.xlsx"
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
                        data["tbNm"] = "TB_IBEBDS09";
                        data["menuId"] = $.fn.getMenuId();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveDtList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
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
    $("#ibx_finYmFrom, #ibx_finYmTo").on("keypress", function(e) {
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
* @설명: 중도인출율 - 기초데이터 jsGrid 빈 테이블 생성 
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
        paging: true,
        fields : fieldsArr
    }); 
    //그리드 생성
    gridObjectPryRate.gridCreate();
}

/**
* @설명: 중도인출율 - 기초데이터 jsGrid 빈 테이블 생성 
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
        paging: true,
        fields : fieldsArr
        }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
}

/**
 * @설명: 중도인출율 - 기초데이터 jsGrid 빈 테이블 생성 
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
        paging: true,
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
    //그리드 공통부분 필드
    var resultArr = [];

    //해지율산출구분코드 필드
    var rscRatProdScCd = { 
            name: "rscRatProdScCd", title:"해지율산출구분코드", css:"cell", type: "select", width: 120, align:"center"
            , items: $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //납입중환급금비율값 필드
    var dupayRefndRtoVal = { 
            name: "dupayRefndRtoVal", title:"납입중환급금비율값", css:"cell", type: "text", width: 120, align:"center"
    };
    
    //납입후환급금비율값 필드
    var padAftRefndRtoVal = { 
            name: "padAftRefndRtoVal", title:"납입후환급금비율값", css:"cell", type: "text", width: 120, align:"center"
    };
    
    //납입상태 필드
    var beFpayYnScCd = { 
            name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 120, align:"center"
            , items: $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //채널유형 필드
    var chnlScCd = {
            name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 80, align:"center"
            , items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //상풍유형 필드
    var beNewLobCd = { 
            name: "beNewLobCd" , title:"상품유형" , css:"cell", type: "select", width: 100, align:"center"
                , items: $.fn.getGridCodeItem("BE_NEW_LOB_CD"), textField: "codeNm", valueField: "code"
    };
    
    if(param == "gridDivPryRate") {
        //전체 필드
        var allInfo = { name: "total", title:"전체", css:"cell", type: "text",  width: 90, align:"right", sorter:"number",
                itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
        };
    } else {
        //전체 필드
        var allInfo = { name: "total", title:"전체", css:"cell", type: "text",  width: 170, align:"right", sorter:"number",
                itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                }
        };
    }
    
    if(param == "gridDivPryRate") {
        //율 필드
        var allRto = { 
                name: "total", title:"전체", css:"cell", type: "text",  width: 90, align:"right", sorter:"number",
                itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
        };
    } else {
        //율 필드
        var allRto = { 
                name: "total", title:"전체", css:"cell", type: "text",  width: 170, align:"right", sorter:"number",
                itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                }
        };
    }
    
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var colId = $(this).val();
        switch(colId) {
        case "rscRatProdScCd":
            resultArr.push(rscRatProdScCd);
            break;
        case "dupayRefndRtoVal":
        	resultArr.push(dupayRefndRtoVal);
        	break;
        case "padAftRefndRtoVal":
        	resultArr.push(padAftRefndRtoVal);
        	break;
        case "beFpayYnScCd":
        	resultArr.push(beFpayYnScCd);
        	break;
        case "beNewLobCd":
            resultArr.push(beNewLobCd);
            break;
        case "beChnlScCd":
            resultArr.push(chnlScCd);
            break;
        }
    });

    var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12+"];
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
 * @매개변수: targetArr<array> : 유형배열, titelArr<array> 타이틀배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function getFieldsArr(targetArr,param) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    
    if(param == "gridDivPryRate") {
        for (var i = 0; i < targetArr.length; i++) {
            var target = targetArr[i];
            var distStndValField = { name: "psgYys" + $.replaceAll(target,"12+","12"), title: target + "차년", css:"cell", type: "text", width: 90, align:"right", sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            }};
       
            resultArr.push(distStndValField);
        }
    } else {
        for (var i = 0; i < targetArr.length; i++) {
            var target = targetArr[i];
            var distStndValField = { name: "psgYys" + $.replaceAll(target,"12+","12"), title: target + "차년", css:"cell", type: "text", width: 170, align:"right", sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
            }};
       
            resultArr.push(distStndValField);
        }
    }
    return resultArr;
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
    if(gReqParam.oneoffChk != gCondOneoffCheck) {
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
function isEmpty(value) {
    if(typeof value === "undefined" || value == null || value == "") {
        value = "";
    }
    return value;
}

function selectMdrotRatPryRateList(){
    // 조회에 필요한 값을 셋팅
    var strColumArr = [];
    var hierarchyCheck = [];
    gReqParam.finYmFrom = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
    gReqParam.finYmTo = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
    // 체크박스 (납입상태, 상품유형, 채널) 체크
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
    	var colId = $(this).val();
    	
        strColumArr.push($.toUnderscore(colId));
        
        var columnName = "";
        if(colId == "fpayYnScCd") {
            columnName = "beFpayYnScCd";
        } else if(colId == "newLobCd") {
            columnName = "beNewLobCd";
        } else if(colId == "beChnlScCd") {
            columnName = "beChnlScCd";
        }
        
        hierarchyCheck.push($.toUnderscore(colId));
    });
    
    gReqParam.strColumArr = strColumArr;
    gReqParam.hierarchyCheck = hierarchyCheck
    gReqParam.oneoffChk = gCondOneoffCheck;

    // 기간계 데이터 조회
   $.callAjax({"jsonStr":JSON.stringify(gReqParam)}, "/be/pd/bepd231m/selectMdrotRatPryRateList.do")
    .done(function(data) {
    	
        // 그리드 초기화
        resetGrid();
        reDrawGrid();
        
        // 그리드 바인딩
        var rateListData = setTotal(data.rateList);
        var nmrtListData = setTotal(data.nmrtList);
        var dnmrListData = setTotal(data.dnmrList);
        
        $("#gridDivPryRate").jsGrid("loadData", rateListData).done(function(){});
        $("#gridDivNmrtItem").jsGrid("loadData", nmrtListData).done(function(){});
        $("#gridDivDnmrItem").jsGrid("loadData", dnmrListData).done(function(){});
        
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


function setTotal(ratListData){
	
	if(ratListData!=null && ratListData != ''){
		for(idx in ratListData){
	    	var colLen = $("input:checked[name=hierarchy_check]").length;
	    	for(var i=0;i<colLen;i++){
	    		var colKey = $("input:checked[name=hierarchy_check]")[i].value;
	    		if(ratListData[idx][colKey] == null || ratListData[idx][colKey] ==''){
	    			if(colKey.substr(colKey.length-2,colKey.length).toUpperCase() == "CD"){
	    				ratListData[idx][colKey] = "ZZ";
	    			}else{
	    				ratListData[idx][colKey] = "TOTAL";
	    			}
	    			break;
	    		}
	    	}
		}
	}
	
	return ratListData;
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
    if(type == "aplc") {
        $("#gridTmpDivSub").jsGrid("reset");
        $("#gridTmpDivSub").jsGrid("option", "data", []);
    } else {
        $("#gridDivPryRate").jsGrid("option", "data", []);
        $("#gridDivPryRate").jsGrid("reset");
        $("#gridDivNmrtItem").jsGrid("option", "data", []);
        $("#gridDivNmrtItem").jsGrid("reset");
        $("#gridDivDnmrItem").jsGrid("option", "data", []);
        $("#gridDivDnmrItem").jsGrid("reset");
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
        paging: true,	//변경(false -> true) -  20231010
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
 * @매개변수: 
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function getGridFieldsSub() {
	//그리드 공통부분 필드
    var resultArr = [];
    
    //해지율산출구분코드 필드
    var rscRatProdScCd = { 
            name: "rscRatProdScCd", title:"해지율산출구분코드", css:"cell", type: "select", width: 120, align:"center"
            	, items: $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD"), textField: "code", valueField: "codeNm"
    };
    
    //납입중환급금비율값 필드
    var dupayRefndRtoVal = { 
            name: "dupayRefndRtoVal", title:"납입중환급금비율값", css:"cell", type: "text", width: 120, align:"center"
    };
    
    //납입후환급금비율값 필드
    var padAftRefndRtoVal = { 
            name: "padAftRefndRtoVal", title:"납입후환급금비율값", css:"cell", type: "text", width: 120, align:"center"
    };
    
    //납입상태 필드
    var beFpayYnScCd = { 
            name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 120, align:"center"
            	, items: $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD"), textField: "code", valueField: "codeNm"
    };
    
    //채널유형 필드
    var chnlScCd = {
            name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 80, align:"center"
            	, items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "code", valueField: "codeNm"
    };
    
    //상풍유형 필드
    var beNewLobCd = { 
            name: "beNewLobCd" , title:"상품유형" , css:"cell", type: "select", width: 100, align:"center"
            	, items: $.fn.getGridCodeItem("BE_NEW_LOB_CD"), textField: "code", valueField: "codeNm"
    };
    
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var colId = $(this).val();
        switch(colId) {
        case "rscRatProdScCd":
            resultArr.push(rscRatProdScCd);
            break;
        case "dupayRefndRtoVal":
        	resultArr.push(dupayRefndRtoVal);
        	break;
        case "padAftRefndRtoVal":
        	resultArr.push(padAftRefndRtoVal);
        	break;
        case "beFpayYnScCd":
        	resultArr.push(beFpayYnScCd);
        	break;
        case "beNewLobCd":
            resultArr.push(beNewLobCd);
            break;
        case "beChnlScCd":
            resultArr.push(chnlScCd);
            break;
        }
    });
    
    var colNm = "psgYys";
    var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
    var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12+"];
    var fieldsArr = getPsgYysFieldsArrSub(targetArr, titleArr, colNm);
    resultArr = resultArr.concat(fieldsArr);
    
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 경과월 배열 
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  임국빈 2021. 7. 8 최초작성
 */
function getPsgYysFieldsArrSub(targetArr, titleArr, colNm) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: colNm + target , title: titleArr[i] + "차년도", css:"cell", type: "text", width: 100, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0" : (value.toString());
                
            }
        };
        
        resultArr.push(distStndValField);
    }
    //전체 필드
    var allInfo = { 
            name: "total", title:"전체", css:"cell", type: "text",  width: 140, align:"right", sorter:"number"
                , itemTemplate:function(value, item) {return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());}
    };
    resultArr.push(allInfo);
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
        strColumArr.push($.toUnderscore($(this).val()));
    });
    
    reqParam.strColumArr = strColumArr;
    $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd231m/selectMdrotRatProdAplc.do",{async:false})
    .done(function(data) {
		// 그리드 초기화
		resetGrid("aplc");
		reDrawGrid("aplc");
		
		hiddenGridList = data.hiddenGridList;

        $("#"+gridTmpIdSub).jsGrid("loadData", hiddenGridList).done(function(){
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
            url: "/be/pd/bepd231p.do",
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