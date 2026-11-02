/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 보험계약대출율 기초데이터
 * @설명: 보험계약대출율 기초데이터 화면 JS
 * @최초작성자: 이준용
 * @최초작성일: 2021. 07. 26.
 * @최종변경일: 2023. 10. 10.
 * @개정이력:
 *  이준용 2021. 07. 26. 최초작성
 *  서승호 2022. 05. 03. 공통코드표기 로직 수정
 *  서승호 2023. 12. 14. 보정완료확인버튼 엑셀다운로드 옵션변경
 */
// 전역변수 선언부
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

//서비스코드 정의
var serviceCode = "12";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //datepickerSetting세팅
    $.fn.getTbDateInfo(serviceCode);
    
    //공통코드 조회
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
    // 공통코드 조회(해지율산출구분코드, BE완납여부구분코드, BE채널구분코드, BE신규LOB코드)
	$.fn.loadCommonCode(["PLLN_RAT_SC_CD", "BE_CHNL_SC_CD","BE_WRKEX_POTFL_SC_CD","LOW_NHV_RSC_SC_CD","RSTR_RAT_SC_CD","PLLN_RAT_PRDT_CLSF_CD","PLLN_RAT_KICS_PRDT_SC_CD"]);
}

function initEvent() {
    //엑셀 업로드 및 다운로드 관련 선언
    var tbNm="TB_IBEBDS10";
    var gridTmpId="gridTmpDiv";
    
    //*보정 배치 및 엑셀다운로드 관련 선언
    var gridTmpIdSub="gridTmpDivSub";
    var serviceNm="PLLN_RAT";
    
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
    
    //조회
    $('#btn_search').on('click', function(e){
        //조회년월 validation
        var condFinYmFrom = $("#ibx_finYmFrom").val();
        var condFinYmTo = $("#ibx_finYmTo").val();
        
        if(condFinYmFrom > condFinYmTo) {
            $.fn.msgBox("시작년월이 종료년월보다 클수 없습니다.");
            return;
        }
        
        if($("#sbx_srhType").val() == "") {
            $.fn.msgBox("조회기준은 필수선택 항목입니다.");
            return;
        }
        
        if($("#sbx_stndSc").val() == "") {
            $.fn.msgBox("기준구분은 필수선택 항목입니다.");
            return;
        }
        
        //체크된 건수
        var checkCnt = $("input[name='hierarchy_check']:checked").length; 
        if(checkCnt <= 0) {
            $.fn.msgBox("구분을 하나이상 체크해주세요.(One-off반영 제외)");
            return;
        } else {
            gCondHichyCheck = [];
            condCheck = {};
            var titleText = "";
            $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
                var colId = $(this).val();
                condCheck[$(this).attr("id")] = colId;
                gCondHichyCheck.push($.toUnderscore(colId));
                labelText = $("label[for='"+ $(this).attr("id") +"']").text();
                titleText = titleText + ", " + labelText;
            });
            if(gCondOneoffCheck=="Y") {
                titleText = titleText+", One-off 반영 "
            }
            titleText = titleText.substr(1);
            if ($("#sbx_srhType").val() == "01"){
            	$("#titleNm1").text(titleText + " 기초율");
            	$("#titleNm2").text(titleText + " 분자항목(대출잔액)");
            	$("#titleNm3").text(titleText + " 분모항목(해약식보험료적립금)");
            } else if ($("#sbx_srhType").val() == "02"){
		    	$("#titleNm1").text(titleText + " 기초율");
		    	$("#titleNm2").text(titleText + " 분자항목(신규대출액)");
		    	$("#titleNm3").text(titleText + " 분모항목(해약식보험료적립금)");
            } else {
            	$("#titleNm1").text(titleText + " 기초율");
            	$("#titleNm2").text(titleText + " 분자항목(중도상환액)");
            	$("#titleNm3").text(titleText + " 분모항목(대출잔액)");
            }

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
        
        let fileName = $("#sbx_srhType option:selected").text() + "_" + $("#sbx_stndSc option:selected").text() + "_"
                     + $("#titleNm1").text().replaceAll("기초율", "보험계약대출율") + "기초데이터.xlsx";
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
        
        initGridHidden();
        
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
            });
        };
        reader.readAsArrayBuffer(input.files[0]);
    });
    
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
* @설명: 보험계약대출율 - 기초데이터 jsGrid 빈 테이블 생성 
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
* @설명: 보험계약대출율 - 기초데이터 jsGrid 빈 테이블 생성 
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
 * @설명: 보험계약대출율 - 기초데이터 jsGrid 빈 테이블 생성 
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
    var fieldsArr = getGridFields();
    var gridObjectDnmrItem = new ComJsGrid({
        id: "gridDivDnmrItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectDnmrItem.gridCreate();
}

/**
* @설명: 보험계약대출율 - 업로드용 히든 jsGrid 빈 테이블 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 7. 최초작성
*/
function initGridHidden(){
    //그리드 필드 세팅
    var fieldsArr = getGridFieldsHidden();
    // jsGrid 빈 테이블 생성
    var gridObjectHidden = new ComJsGrid({
        id: "gridTmpDiv",
        height: 0,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    //그리드 생성
    gridObjectHidden.gridCreate();
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
function getGridFields(param) {
    //그리드 공통부분 필드
    var resultArr = [];
    
    //가정항목
    var pllnRatScCd = { 
            name: "pllnRatScCd", title:"가정항목", css:"cell", type: "select", width: 120, align:"center"
            , items: $.fn.getGridCodeItem("PLLN_RAT_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //채널 필드
    var beChnlScCd = { 
            name: "beChnlScCd", title:"채널", css:"cell", type: "select", width: 120, align:"center"
            , items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //포트폴리오
    var beWrkexPotflScCd = { 
            name: "beWrkexPotflScCd", title:"포트폴리오", css:"cell", type: "select", width: 120, align:"center"
            , items: $.fn.getGridCodeItem("BE_WRKEX_POTFL_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //저무해지구분
    var lowNhvRscScCd = { 
            name: "lowNhvRscScCd", title:"저무해지구분", css:"cell", type: "select", width: 120, align:"center"
            , items: $.fn.getGridCodeItem("LOW_NHV_RSC_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //환급율구분
    var rstrRatScCd = { 
    		name: "rstrRatScCd", title:"환급율구분", css:"cell", type: "select", width: 120, align:"center"
    			, items: $.fn.getGridCodeItem("RSTR_RAT_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //상품유형
    var pllnRatPrdtClsfCd = { 
    		name: "pllnRatPrdtClsfCd", title:"상품유형", css:"cell", type: "select", width: 120, align:"center"
    			, items: $.fn.getGridCodeItem("PLLN_RAT_PRDT_CLSF_CD"), textField: "codeNm", valueField: "code"
    };
    
    //KICS상품구분
    var pllnRatKicsPrdtScCd = { 
    		name: "pllnRatKicsPrdtScCd", title:"KICS상품유형", css:"cell", type: "select", width: 120, align:"center"
    			, items: $.fn.getGridCodeItem("PLLN_RAT_KICS_PRDT_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //전체 필드
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
    
    resultArr.push(pllnRatScCd);	
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var colId = $(this).val();
        switch(colId) {
        case "beChnlScCd":
            resultArr.push(beChnlScCd);
            break;
        case "beChnlScCd":
        	resultArr.push(beChnlScCd);
        	break;
        case "beWrkexPotflScCd":
        	resultArr.push(beWrkexPotflScCd);
        	break;
        case "lowNhvRscScCd":
        	resultArr.push(lowNhvRscScCd);
        	break;
        case "rstrRatScCd":
            resultArr.push(rstrRatScCd);
            break;
        case "pllnRatPrdtClsfCd":
            resultArr.push(pllnRatPrdtClsfCd);
            break;
        case "pllnRatKicsPrdtScCd":
            resultArr.push(pllnRatKicsPrdtScCd);
            break;
        }
    });

    var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
    var fieldsArr = getFieldsArr(targetArr, param);
    resultArr = resultArr.concat(fieldsArr);
    //합계세팅
    resultArr.push(allInfo);
    
    return resultArr;
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
function getGridFieldsHidden() {
    //그리드 공통부분 필드
    var resultArr = []; 
    //그리드 공통부분 필드
     var resultArr = [
            { name: "finYm", title:"마감년월", css:"cell", type: "text", width: 90, align:"center"},
            { name: "oneoffEfcScCd", title:"ONEOFF효과구분코드", css:"cell", type: "text", width: 90, align:"center"},
            { name: "pllnRatScCd", title:"보험계약대출율구분코드", css:"cell", type: "text", width: 90, align:"center"},
            { name: "beChnlScCd", title:"BE채널구분코드", css:"cell", type: "text", width: 90, align:"center"},
            { name: "beWrkexPotflScCd", title:"BE사업비포트폴리오구분코드", css:"cell", type: "text", width: 90, align:"center"},
            { name: "lowNhvRscScCd", title:"저무해지구분코드", css:"cell", type: "text", width: 90, align:"center"},
            { name: "rstrRatScCd", title:"환급율구분코드", css:"cell", type: "text", width: 90, align:"center"},
            { name: "pllnRatPrdtClsfCd", title:"보험계약대출율상품분류코드", css:"cell", type: "text", width: 90, align:"center"},
            { name: "pllnRatKicsPrdtScCd", title:"보험계약대출율KICS상품구분코드", css:"cell", type: "text", width: 90, align:"center"},
            { name: "pllnPsbRatCd", title:"보험계약대출가능율코드", css:"cell", type: "text", width: 90, align:"center"},
            { name: "psgYys", title:"경과년수", css:"cell", type: "text", width: 90, align:"center"},
            { name: "occuCnt", title:"발생건수", css:"cell", type: "text", width: 90, align:"center"},
            { name: "whlObjCnt", title:"전체대상건수", css:"cell", type: "text", width: 90, align:"center"},
            { name: "pllnAmt01", title:"보험계약대출금액_01", css:"cell", type: "text", width: 90, align:"center"},
            { name: "pllnAmt02", title:"보험계약대출금액_02", css:"cell", type: "text", width: 90, align:"center"},
            { name: "pllnAmt03", title:"보험계약대출금액_03", css:"cell", type: "text", width: 90, align:"center"}
        ];
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
function getFieldsArr(targetArr, val) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    var targetNm = "";
    var widthPx;
    
    if (val == "1") {
        widthPx = "60";
    } else {
        widthPx = "120";
    }
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
       
        if (targetArr.length == i+1) {
            targetNm = target+"+";
        } else {
            targetNm = target;
        }
        
        var distStndValField = { name: "psgYys" + target , title: targetNm + "차년", css:"cell", type: "text", width: widthPx, align:"right", sorter:"number", itemTemplate:function(value, item) {
            if(val==1) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            } else {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
            }
        }};
   
        resultArr.push(distStndValField);
    }
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
    reqParam.hierarchyCheck1 = condCheck["cbx_pllnRatPrdtClsfCd"];
    reqParam.hierarchyCheck2 = condCheck["cbx_beChnlScCd"];
    reqParam.srhType = $("#sbx_srhType").val();
    reqParam.stndSc = $("#sbx_stndSc").val();
    
    // 체크박스 (가정항목, 상품유형, 채널) 체크
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        strColumArr.push($.toUnderscore($(this).val()));
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
    
    gReqParam = reqParam;
    gReqParam.srhType = $("#sbx_srhType").val();
    gReqParam.stndSc = $("#sbx_stndSc").val();
    gReqParam.hierarchyCheck = gCondHichyCheck;
    gReqParam.oneoffChk = gCondOneoffCheck;
    
    // 기간계 데이터 조회
   $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd241m/selectPllnRatPryDtList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid("pryDt");
        reDrawGrid("pryDt");

        //가정항목 영역 DEPT의 TOTAL은 데이터 특성상 화면에 표현할 필요가 없음으로 제거
        data.rateList.splice(data.rateList.length-1,1);
        data.nmrtList.splice(data.nmrtList.length-1,1);
        data.dnmrList.splice(data.dnmrList.length-1,1);
        
        // 그리드 바인딩
        var rateListData = setTotal(data.rateList);
        var nmrtListData = setTotal(data.nmrtList);
        var dnmrListData = setTotal(data.dnmrList);
        
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
        $.fn.msgBox("[ajax] 서버 통신 실패입니다.");
        console.log("fail to selectPllnRatPryDtList !!");
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
        $("#gridTmpDiv").jsGrid("reset");
        $("#gridTmpDiv").jsGrid("option", "data", []);
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
        $("#gridTmpDiv").jsGrid("destroy");
        //그리드 create
        initGridPryRate();
        initGridNmrtItem();
        initGridDnmrItem();
   }
}

/**
 * @설명: 보험계약대출율 - 보정데이터 jsGrid 빈 테이블 생성 (*보정 히든 그리드용)
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
    var resultArr = [];
    //가정항목
    var pllnRatScCd = { 
            name: "pllnRatScCd", title:"가정항목", css:"cell", type: "select", width: 120, align:"center"
            , items: $.fn.getGridCodeItem("PLLN_RAT_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //채널 필드
    var beChnlScCd = { 
            name: "beChnlScCd", title:"채널", css:"cell", type: "select", width: 120, align:"center"
            , items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //포트폴리오
    var beWrkexPotflScCd = { 
            name: "beWrkexPotflScCd", title:"포트폴리오", css:"cell", type: "select", width: 120, align:"center"
            , items: $.fn.getGridCodeItem("BE_WRKEX_POTFL_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //저무해지구분
    var lowNhvRscScCd = { 
            name: "lowNhvRscScCd", title:"저무해지구분", css:"cell", type: "select", width: 120, align:"center"
            , items: $.fn.getGridCodeItem("LOW_NHV_RSC_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //환급율구분
    var rstrRatScCd = { 
    		name: "rstrRatScCd", title:"환급율구분", css:"cell", type: "select", width: 120, align:"center"
    			, items: $.fn.getGridCodeItem("RSTR_RAT_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //상품유형
    var pllnRatPrdtClsfCd = { 
    		name: "pllnRatPrdtClsfCd", title:"상품유형", css:"cell", type: "select", width: 120, align:"center"
    			, items: $.fn.getGridCodeItem("PLLN_RAT_PRDT_CLSF_CD"), textField: "codeNm", valueField: "code"
    };
    
    //KICS상품구분
    var pllnRatKicsPrdtScCd = { 
    		name: "pllnRatKicsPrdtScCd", title:"KICS상품유형", css:"cell", type: "select", width: 120, align:"center"
    			, items: $.fn.getGridCodeItem("PLLN_RAT_KICS_PRDT_SC_CD"), textField: "codeNm", valueField: "code"
    };
    
    //전체 필드
    var allInfo = { name: "total", title:"전체", css:"cell", type: "text",  width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    }};
    
    resultArr.push(pllnRatScCd);
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var colId = $(this).val();
        switch(colId) {
        case "beChnlScCd":
            resultArr.push(beChnlScCd);
            break;
        case "beChnlScCd":
        	resultArr.push(beChnlScCd);
        	break;
        case "beWrkexPotflScCd":
        	resultArr.push(beWrkexPotflScCd);
        	break;
        case "lowNhvRscScCd":
        	resultArr.push(lowNhvRscScCd);
        	break;
        case "rstrRatScCd":
            resultArr.push(rstrRatScCd);
            break;
        case "pllnRatPrdtClsfCd":
            resultArr.push(pllnRatPrdtClsfCd);
            break;
        case "pllnRatKicsPrdtScCd":
            resultArr.push(pllnRatKicsPrdtScCd);
            break;
        }
    });
    
    var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
    var fieldsArr = getPsgYysFieldsArrSub(targetArr, "psgYys");
    resultArr = resultArr.concat(fieldsArr);
    resultArr.push(allInfo);
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
function getPsgYysFieldsArrSub(targetArr, colNm) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    var addVal="";
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        if (i==11) addVal = "+";
        var distStndValField = { name: colNm+target , title: target+addVal+"차년", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
            value = $.fn.isEmpty(value) ? "0" : value.toString();
            return $.addCommaNumber(value);
        }};
   
        resultArr.push(distStndValField);
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
    
    // 체크박스 (채널, 상품유형) 체크
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        strColumArr.push($.toUnderscore($(this).val()));
    });
    
    if($("#sbx_stndSc").val()==null || $("#sbx_stndSc").val()=='') {
        $.fn.msgBox("기준구분을 확인해주세요.");
        return;
    }
    reqParam.strColumArr = strColumArr;
    reqParam.stndSc = $("#sbx_stndSc").val();
    reqParam.srhType = $("#sbx_srhType").val();	//조회조건추가 - 20231208
    
    $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd241m/selectPllnRatProdAplc.do",{async:false})
    .done(function(data) {
        console.log("보정완료, data >> ", data);
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
    if(gReqParam.srhType != $("#sbx_srhType").val()) {
        return false;
    }
    if(gReqParam.stndSc != $("#sbx_stndSc").val()) {
        return false;
    }
    //원오프체크
    if(gReqParam.oneoffChk != gCondOneoffCheck) {
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
            url: "/be/pd/bepd241p.do",
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