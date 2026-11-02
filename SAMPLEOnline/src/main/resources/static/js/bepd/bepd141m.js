/**
 * @시스템명: 가정관리
 * @업무명: 해지율 - 기초데이터
 * @설명: 해지율 - 기초데이터 화면의 JS
 * @최초작성자: 하승민
 * @최초작성일: 2021. 07. 09.
 * @최종변경일: 2023. 10. 10.
 * @개정이력: 
 *  하승민 2021. 07. 09. 	최초작성'
 *  서승호 2022. 05. 03. 	컬럼명 변경. 저무해지구분코드 -> 해지율산출구분, 공통코드 표기 로직 수정
 *  서승호 2023. 12. 14. 	보정완료확인버튼 엑셀다운로드 옵션변경
 */
//전역변수
var gCondHichyCheck = [];
var gArrCols = [];
//서비스코드 정의
var serviceCode = "03";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//one-off플래그
var gCondOneoffCheck = "N";
//조회조건 콤보박스
var gRscRatCombo = "basRscRat";
// 집계기준구분코드
var gSmupStnd = "02";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //datepickerSetting세팅
    $.fn.getTbDateInfo(serviceCode);
    
   // 공통코드 조회(납입유형,상품유형,채널,BLOCK)
    $.fn.loadCommonCode(["RSC_RAT_PROD_SC_CD","BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD","BE_CHNL_SC_CD","BE_BLK_SC_CD"]);

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
    $("#div_hide").show();
    $("#div_show").hide();
    $("#cbx_hide").show();
    
    //*보정 배치 및 엑셀다운로드 관련 선언
    var gridTmpIdSub="gridTmpDivSub";
    var serviceNm="RSC_RAT";
    
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
    
    // 조회조건 변경시 그리드 초기화
    $("#sbx_rscRat").on("change", function(e){
        gRscRatCombo = $("#sbx_rscRat").val();
        console.log("gRscRatCombo : " + gRscRatCombo); 
        if(gRscRatCombo == 'basRscRat') {
            $("#sbx_smupStnd").prop("disabled", false);
//            $("#cbx_hide").show();
        } else {
            $("#sbx_smupStnd").prop("disabled", true);
//            $("#cbx_hide").hide();
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
        
        //체크된 건수
        var checkCnt = $("input:checkbox[name='hierarchy_check']:checked").length; 
        if(checkCnt <= 0) {
            $.fn.msgBox("구분을 하나이상 체크해주세요.(One-off반영 제외)");
            return;
        } else {
            gCondHichyCheck = [];
            var titleText = "";
            $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
                var colId = $(this).val();
                gCondHichyCheck.push($.toUnderscore(colId));
                var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
                titleText = titleText + labelText + ", ";
            });
            titleText = titleText.substr(0,titleText.length-2)+" ";
            if(gCondOneoffCheck=="Y") titleText = titleText+", One-off 반영 "

            $("#titlPryRat").text(titleText + "기초율");
            $("#titlNmrtItm").text(titleText + "분자항목(연환산보험료)");
            $("#titlDnmrItm").text(titleText + "분모항목(연환산보험료)");
            
            selectRscRatPryRateList();
        }
        
    });
    
    // 엑셀다운로드
    $("#btn_excel_download").on("click", function(e){
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
        var fileName = $("#sbx_rscRat option:selected").text() + "_" + $("#sbx_smupStnd option:selected").text() + "_" +
                       $("#titlPryRat").text().replace("기초율", "해지율") + " 기초데이터.xlsx";
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
    
    // 유보증가효과 엑셀다운로드
    $('#btn_excel_download2').on('click', function(e){

        if(gCondFlag == "N" || ($("#rsrtEfcItm").jsGrid("option", "data").length == 0 && $("#incrEfcItm").jsGrid("option", "data").length == 0)) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }

        var fileName = "해지율_유보증가효과_기초데이터.xlsx";
        $.fn.exportMultiGridExcel([
                {
                    id: 'rsrtEfcItm',
                    sheetName : "유보효과",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "%",
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: 'incrEfcItm',
                    sheetName : "증가효과",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "%"
                },
                {
                    id: 'rsrtEfcItm',
                    sheetName : "유보효과(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "%"
                },
                {
                    id: 'incrEfcItm',
                    sheetName : "증가효과(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "%"
                }
        ]);
    });
    
  //양식다운로드 클릭
    $("#btn_loadExcel").on("click", function(e){
        var arrColsInfo = $.fn.getTbCols("TB_IBEBDS02");

        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        $.fn.exportGridExcel({
            
            id: "gridTmpDiv", 
            fileName: $("#titlNmrtItm").text() + "_업로드양식.xlsx"
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
		for (var i=0; i <= 8; i++) {
			if (i > keyIndex) {
				hierarchy += "N";
			}
		}
		hierarchy = hierarchy + gSmupStnd;
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
        for (var i=0; i <= 8; i++) {
            if (i > keyIndex) {
                hierarchy += "N";
            }
        }
        hierarchy = hierarchy + gSmupStnd;
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
    $("#btn_exportExcelForm").on("click", function(e){
        
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
                        data["tbNm"] = "TB_IBEBDS02";
                        data["menuId"] = $.fn.getMenuId();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveDtList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                                selectRscRatPryRateList();
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

    if(gRscRatCombo == "basRscRat") {
        //하이라키체크
        gCondHichyCheck = [];
        // 체크박스 (납입상태, 상품유형, 채널) 체크
        $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
            gCondHichyCheck.push($(this).val());
        });
        if(!gReqParam.strColumArr.equals(gCondHichyCheck)) {
            return false;
        }
        // 집계기준체크
        if(gReqParam.smupStnd != gSmupStnd) {
            return false;
        }
    }
    
    //원오프체크
    if(gReqParam.oneoffChk != gCondOneoffCheck) {
        return false;
    }
    
    // 조회조건체크
    if(gReqParam.rscRatCombo != gRscRatCombo) {
        return false;
    }
    return true;
}

/**
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 9.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 9. 최초작성
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
        paging: true,
        fields : fieldsArr
    }); 
    //그리드 생성
    gridObjectPryRate.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 9.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 9. 최초작성
*/
function initGridNmrtItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(2);
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
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 9.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 9. 최초작성
*/
function initGridDnmrItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(3);
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
* @설명: 해지율 - 기초데이터 유보증가 
* @최초작성자: 박세라
* @최초작성일: 2021. 10. 18
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 2021. 10. 18 최초작성
*/
function initGridRsrtEfcItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(4);
    var gridRsrtEfcItm = new ComJsGrid({
        id: "rsrtEfcItm",
        height: 250,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridRsrtEfcItm.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 유보증가 
* @최초작성자: 박세라
* @최초작성일: 2021. 10. 18
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 2021. 10. 18 최초작성
*/
function initGridIncrEfcItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(5);
    var gridIncrEfcItm = new ComJsGrid({
        id: "incrEfcItm",
        height: 250,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridIncrEfcItm.gridCreate();
}

/**
 * @설명: 해지율 - 보정데이터 jsGrid 빈 테이블 생성 (*보정 히든 그리드용)
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 7.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  하승민 2021. 7. 7. 최초작성
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
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:감액율 보정 연도별 비중
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  하승민 2021. 7. 8 최초작성
 */
function getGridFieldsSub() {
    var fieldList = [];
    //해지율산출구분 필드
    var rscRatProdScCd = { 
            name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
            	var codeArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
                for(i=0; i<codeArr.length; i++) {
                    if(value == codeArr[i].code) {
                        return codeArr[i].codeAbbrNm;
                    }
                }
            }
    };
    if ($("#cbx_rscRatProdScCd").is(":checked") == true) {
        fieldList.push(rscRatProdScCd);
    }
    //납입중환급금비율 필드
    var dupayRefndRtoVal = { 
            name: "dupayRefndRtoVal", title:"납입중환급금비율", css:"cell", type: "text", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value==null || value=='') {
                    if(($('input:checkbox[id="cbx_rscRatProdScCd"]').is(":checked") == true && item.rscRatProdScCd == null)) {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                    return value;
                }
            }
    };
    if ($("#cbx_dupayRefndRtoVal").is(":checked") == true) {
        fieldList.push(dupayRefndRtoVal);
    }
    //납입후환급금비율
    var padAftRefndRtoVal = { 
            name: "padAftRefndRtoVal", title:"납입후환급금비율", css:"cell", type: "text", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value==null || value=='') {
                    if(($('input:checkbox[id="cbx_rscRatProdScCd"]').is(":checked") == true && item.rscRatProdScCd == null)
                            || ($('input:checkbox[id="cbx_dupayRefndRtoVal"]').is(":checked") == true && item.dupayRefndRtoVal == null)) {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                    return value;
                }
            }
    };
    if ($("#cbx_padAftRefndRtoVal").is(":checked") == true) {
        fieldList.push(padAftRefndRtoVal);
    }
    var common =  { name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 40, align:"center"
    	, items: $.fn.getGridCodeItem("BE_BLK_SC_CD"), textField: "code", valueField: "code"
    }
    var common2 = { name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 40, align:"center"
    	, items: $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD"), textField: "code", valueField: "code",
        itemTemplate:function(value, item) {
            if ($('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true) {
            	if(item.beBlkScCd == "Z") {
            		return "";
            	}
            }
            var codeArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
            for(i=0; i<codeArr.length; i++) {
                if(value == codeArr[i].code) {
                    return codeArr[i].code;
                }
            }
        }
    }
    var common3 =  { name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 40, align:"center"
    	, items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "code", valueField: "code",
        itemTemplate:function(value, item) {
        	var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
        	
            if ($('input:checkbox[id="cbx_fpayYnScCd"]').is(":checked") == true) {
                if(item.beFpayYnScCd == "Z") {
                	return "";
                }
            } else if ($('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true) {
                if(item.beBlkScCd == "Z") {
                	return "";
                }
            } else {
            	for(var i=0; i<tmpCodeDataList.length; i++) {
            		var tmpCode = tmpCodeDataList[i];
            		if (tmpCode.code == value){
            			return tmpCode.codeNm;
            		}
            	}
            }
        }
    }
	var common4 = { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 40, align:"center"
		, items: $.fn.getGridCodeItem("BE_NEW_LOB_CD"), textField: "code", valueField: "code",
        itemTemplate:function(value, item) {
            if ($('input:checkbox[id="cbx_beChnlScCd"]').is(":checked") == true) {
                if(item.beChnlScCd == "ZZ") {
                	return "";
                }
            } else if ($('input:checkbox[id="cbx_beChnlScCd"]').is(":checked") == false
            		&& $('input:checkbox[id="cbx_fpayYnScCd"]').is(":checked") == true) {
                if(item.beFpayYnScCd == "Z") {
                	return "";
                }
            } else if ($('input:checkbox[id="cbx_fpayYnScCd"]').is(":checked") == false
            		&& $('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true) {
                if(item.beBlkScCd == "Z") {
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
	
	if ($("#cbx_blkScCd").is(":checked") == true) {
	    fieldList.push(common);
	}
	if ($("#cbx_fpayYnScCd").is(":checked") == true) {
		fieldList.push(common2);
	}
	if ($("#cbx_beChnlScCd").is(":checked") == true) {
		fieldList.push(common3);
	}
	if ($("#cbx_newLobCd").is(":checked") == true) {
		fieldList.push(common4);
	}
	
    for(var i=1; i<=12; i++) {
        var field = { name: "psgYys"+i, title:i+"년차", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
        	return $.fn.isEmpty(value) ? "0%" : (value.toString() + "%")}}
        fieldList.push(field);
    }
    var last = { name: "total", title:"전체", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
        return $.fn.isEmpty(value) ? "0%" : (value.toString() + "%")}}
    fieldList.push(last);
    
    return fieldList;
}

/**
 * @설명: 보정데이터 엑셀 출력용 hidden gridTable 조회 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 7
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 하승민 2021. 7. 7 최초작성
 */
function selectAplcData(gridTmpIdSub){
    // 조회에 필요한 값을 셋팅
    var reqParam = {};
    var strColumArr = [];
    
    // 체크박스 (채널, 상품유형) 체크
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        strColumArr.push($(this).val());
    });
    
    reqParam.strColumArr = strColumArr;
    reqParam.smupStnd = gSmupStnd;
	$.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd141m/selectRscRatProdAplc.do",{async:false})
	.done(function(data) {
		 // 그리드 초기화
			$("#gridTmpDivSub").jsGrid("reset");
		    $("#gridTmpDivSub").jsGrid("option", "data", []);
		    $("#gridTmpDivSub").jsGrid("destroy");
		    initGridTmpSubItem();
		    
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
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 9
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  하승민 2021. 7. 9 최초작성
 */
function getGridFields(num) {
    //코드 목록
    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
    var rscRatProdScCdArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
    //그리드 공통부분 필드
    var resultArr = [];
    
    var rscRatProdScCd = { 
            name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
            	var codeArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
                for(i=0; i<codeArr.length; i++) {
                    if(value == codeArr[i].code) {
                        return codeArr[i].codeAbbrNm;
                    }
                }
            }
    };
    
    //납입중환급금비율 필드
    var dupayRefndRtoVal = { 
            name: "dupayRefndRtoVal", title:"납입중환급금비율", css:"cell", type: "text", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value==null || value=='') {
                    if(($('input:checkbox[id="cbx_rscRatProdScCd"]').is(":checked") == true && item.rscRatProdScCd == null)) {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                    return value;
                }
            }
    };
    
    //납입후환급금비율
    var padAftRefndRtoVal = { 
            name: "padAftRefndRtoVal", title:"납입후환급금비율", css:"cell", type: "text", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value==null || value=='') {
                    if(($('input:checkbox[id="cbx_rscRatProdScCd"]').is(":checked") == true && item.rscRatProdScCd == null)
                            || ($('input:checkbox[id="cbx_dupayRefndRtoVal"]').is(":checked") == true && item.dupayRefndRtoVal == null)) {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                    return value;
                }
            }
    };
    
    //BLOCK 필드
    var blkScCd = { 
            name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value==null || value=='') {
                    if(($('input:checkbox[id="cbx_rscRatProdScCd"]').is(":checked") == true && item.rscRatProdScCd == null)
                            || ($('input:checkbox[id="cbx_dupayRefndRtoVal"]').is(":checked") == true && item.dupayRefndRtoVal == null)
                            || ($('input:checkbox[id="cbx_padAftRefndRtoVal"]').is(":checked") == true && item.padAftRefndRtoVal == null) ) {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                	var codeArr = $.fn.getGridCodeItem("BE_BLK_SC_CD");
                    for(i=0; i<codeArr.length; i++) {
                        if(value == codeArr[i].code) {
                            return codeArr[i].codeAbbrNm;
                        }
                    }
                }
            }
    };
 
    //납입상태 필드
    var fpayYnScCd = { 
            name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 120, align:"center",
            itemTemplate:function(value, item) {
                if(value==null || value=='') {
                    if(($('input:checkbox[id="cbx_rscRatProdScCd"]').is(":checked") == true && item.rscRatProdScCd == null)
                            || ($('input:checkbox[id="cbx_dupayRefndRtoVal"]').is(":checked") == true && item.dupayRefndRtoVal == null)
                            || ($('input:checkbox[id="cbx_padAftRefndRtoVal"]').is(":checked") == true && item.padAftRefndRtoVal == null)
                            || ($('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true && item.beBlkScCd == null) ) {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                    for(i=0; i<fpayYnScCdArr.length; i++) {
                        if(value == fpayYnScCdArr[i].code) {
                            return fpayYnScCdArr[i].codeNm;
                        }
                    }
                    return value;
                }
            }
    };
    //채널유형 필드
    var beChnlScCd = {
            name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 80, align:"center",
            itemTemplate:function(value, item) {
            	var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
            	if(value==null || value=='') {
                    if(($('input:checkbox[id="cbx_rscRatProdScCd"]').is(":checked") == true && item.rscRatProdScCd == null)
                            || ($('input:checkbox[id="cbx_dupayRefndRtoVal"]').is(":checked") == true && item.dupayRefndRtoVal == null)
                            || ($('input:checkbox[id="cbx_padAftRefndRtoVal"]').is(":checked") == true && item.padAftRefndRtoVal == null)
                            || ($('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true && item.beBlkScCd == null)
                            || ($('input:checkbox[id="cbx_fpayYnScCd"]').is(":checked") == true && item.beFpayYnScCd == null) ) {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                	for(var i=0; i<tmpCodeDataList.length; i++) {
        				var tmpCode = tmpCodeDataList[i];
        				if (tmpCode.code == value){
        					return tmpCode.codeNm;
        				}
        			}
                }
            }
    };
    //상풍유형 필드
    var newLobCd = { 
            name: "beNewLobCd" , title:"상품유형" , css:"cell", type: "select", width: 100, editing: false, align:"center",
            itemTemplate:function(value, item) {
                if(value==null || value=='') {
                    if(($('input:checkbox[id="cbx_rscRatProdScCd"]').is(":checked") == true && item.rscRatProdScCd == null)
                            || ($('input:checkbox[id="cbx_dupayRefndRtoVal"]').is(":checked") == true && item.dupayRefndRtoVal == null)
                            || ($('input:checkbox[id="cbx_padAftRefndRtoVal"]').is(":checked") == true && item.padAftRefndRtoVal == null)
                            || ($('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true && item.beBlkScCd == null)
                            || ($('input:checkbox[id="cbx_fpayYnScCd"]').is(":checked") == true && item.beFpayYnScCd == null)
                            || ($('input:checkbox[id="cbx_beChnlScCd"]').is(":checked") == true && item.beChnlScCd == null) ) {
                        return '';
                    }
                    return 'TOTAL';
               } else {
            	   var codeArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
                   for(i=0; i<codeArr.length; i++) {
                       if(value == codeArr[i].code) {
                           return codeArr[i].codeAbbrNm;
                       }
                   }
               }
            }
    };
    
    var allInfo;
    //전체 필드
    if(num == 1) {
        allInfo = { name: "total", title:"전체", css:"cell", type: "text",  width: 80, align:"right", sorter:"number",
                itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
        };
    } else {
        allInfo = { name: "total", title:"전체", css:"cell", type: "text",  width: 170, align:"right", sorter:"number",
                itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                }
        };
    }
    
    if(num != 4 && num != 5) {
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
            case "beBlkScCd":
                resultArr.push(blkScCd);
                break;
            case "beFpayYnScCd":
                resultArr.push(fpayYnScCd);
                break;
            case "beChnlScCd":
                resultArr.push(beChnlScCd);
                break;
            case "beNewLobCd":
                resultArr.push(newLobCd);
                break;
            }
        });

        var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
        var titelArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12+"];
        var fieldsArr = getFieldsArr(targetArr, titelArr, num);
        resultArr = resultArr.concat(fieldsArr);
        //합계세팅
        resultArr.push(allInfo);
    } else {
        resultArr.push(rscRatProdScCd);
        resultArr.push(dupayRefndRtoVal);
        resultArr.push(padAftRefndRtoVal);
        resultArr.push(blkScCd);
        resultArr.push(fpayYnScCd);
        resultArr.push(beChnlScCd);
        resultArr.push(newLobCd);
        if(num==4) {
            // 유보효과조정율 필드
            for(var i=1; i<=4; i++) {
                var field = {name:"rsrtCtrlRat"+i, title:"유보효과조정율"+i, css:"cell", type:"text", width:120, align:"right", sorter:"number",
                        itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                }
                resultArr.push(field);
            }
        } else {
            // 증가효과조정율 필드
            for(var i=1; i<=4; i++) {
                var field = {name:"incrCtrlRat"+i, title:"증가효과조정율"+i, css:"cell", type:"text", width:120, align:"right", sorter:"number",
                        itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                        }
                }
                resultArr.push(field);
            }
        }
    }


    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 9
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  하승민 2021. 7. 9 최초작성
 */
function getFieldsArr(targetArr, titelArr, num) {
    if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titelArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        if(num == 1) {
            var distStndValField = { name: "psgYys" + target , title: titelArr[i] + "차년", css:"cell", type: "text", width: 80, align:"right", sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            }};
        } else {
            var distStndValField = { name: "psgYys" + target , title: titelArr[i] + "차년", css:"cell", type: "text", width: 170, align:"right", sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
            }};
        }
        resultArr.push(distStndValField);
    }
    return resultArr;
}
/**
 * @설명: gridTable의 header조회
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 9
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 9 최초작성
 */
function isEmpty(value) {
    if(typeof value === "undefined" || value == null || value == "") {
        value = "";
    }
    return value;
}

function selectRscRatPryRateList(){
    if(gRscRatCombo == "basRscRat") {
        $("#div_hide").show();
        $("#div_show").hide();
        $("#cbx_hide").show();
    } else {
        $("#div_hide").hide();
        $("#div_show").show();
        $("#cbx_hide").hide();
    }
    
    if(gSmupStnd == "01") {
        $("#change_span1").text("(단위: 건)");
        $("#change_span2").text("(단위: 건)");
    } else {
        $("#change_span1").text("(단위: 원)");
        $("#change_span2").text("(단위: 원)");
    }
    
    if ($("#cbx_rscRatProdScCd").is(':checked') == true){
    	gReqParam.chkLow = "T";	
    } else {
    	gReqParam.chkLow = "F";
    }
    		
    // 조회에 필요한 값을 셋팅
    var strColumArr = [];
    gReqParam.finYmFrom = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
    gReqParam.finYmTo = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
    // 체크박스 (납입상태, 상품유형, 채널) 체크
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        strColumArr.push($(this).val());
    });
    gReqParam.strColumArr = strColumArr;
    gReqParam.oneoffChk = gCondOneoffCheck;
    gReqParam.rscRatCombo = gRscRatCombo;
    gReqParam.smupStnd = gSmupStnd;

    // 기간계 데이터 조회
   $.callAjax({"jsonStr":JSON.stringify(gReqParam)}, "/be/pd/bepd141m/selectRscRatPryRateList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        reDrawGrid();
        // 그리드 바인딩
        if(gRscRatCombo=='basRscRat') {
            var rateListData = data.rateList;
            var nmrtListData = data.nmrtList;
            var dnmrListData = data.dnmrList;
            if(rateListData == null || rateListData.length == 0) {
                $.fn.getReturnValue("gridDivPryRate");
            } else {
                $("#gridDivPryRate").jsGrid("loadData", rateListData);
            }
            if(nmrtListData == null || nmrtListData.length == 0) {
                $.fn.getReturnValue("gridDivNmrtItem");
            } else {
                $("#gridDivNmrtItem").jsGrid("loadData", nmrtListData);
            }
            if(dnmrListData == null || dnmrListData.length == 0) {
                $.fn.getReturnValue("gridDivDnmrItem");
            } else {
                $("#gridDivDnmrItem").jsGrid("loadData", dnmrListData);
            }
        } else {
            $('#rsrtEfcItm').jsGrid('reset');
            $('#incrEfcItm').jsGrid('reset');
            $("#rsrtEfcItm").jsGrid("option", "data", []);
            $("#rsrtEfcItm").jsGrid("destroy");
            $("#incrEfcItm").jsGrid("option", "data", []);
            $("#incrEfcItm").jsGrid("destroy");
            initGridRsrtEfcItm();
            initGridIncrEfcItm();
            
            var nmrtListData = data.nmrtList;
            var dnmrListData = data.dnmrList;

            if(nmrtListData == null || nmrtListData.length == 0) {
                $.fn.getReturnValue("rsrtEfcItm");
            } else {
                
                $("#rsrtEfcItm").jsGrid("loadData", nmrtListData);
            }
            
            if(dnmrListData == null || dnmrListData.length == 0) {
                $.fn.getReturnValue("incrEfcItm");
            } else {
                $("#incrEfcItm").jsGrid("loadData", dnmrListData);
            }
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
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 9
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 9 최초작성
 */
function resetGrid() {
        $("#gridDivPryRate").jsGrid("option", "data", []);
        $("#gridDivPryRate").jsGrid("reset");
        
        $("#gridDivNmrtItem").jsGrid("option", "data", []);
        $("#gridDivNmrtItem").jsGrid("reset");
        
        $("#gridDivDnmrItem").jsGrid("option", "data", []);
        $("#gridDivDnmrItem").jsGrid("reset");
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 9
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 9 최초작성
 */
function reDrawGrid() {
    //그리드 destroy
    $("#gridDivPryRate").jsGrid("destroy");
    $("#gridDivNmrtItem").jsGrid("destroy");
    $("#gridDivDnmrItem").jsGrid("destroy");
    //그리드 create
    initGridPryRate();
    initGridNmrtItem();
    initGridDnmrItem();
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
            url: "/be/pd/bepd141p.do",
            name: "해지율 그래프 팝업",
            width: 1050,
            height: 850,
            arrCheck: gCondHichyCheck,
            gridData1: $("#gridDivPryRate").jsGrid("option", "data"),
            gridField1: $("#gridDivPryRate").jsGrid("option", "fields"),
            gridData2: $("#gridDivNmrtItem").jsGrid("option", "data"),
            gridField2: $("#gridDivNmrtItem").jsGrid("option", "fields"),
            gridData3: $("#gridDivDnmrItem").jsGrid("option", "data"),
            gridField3: $("#gridDivDnmrItem").jsGrid("option", "fields"),
            
        }

        $.fn.openPopup(popupOption);
}

function openPryRatGrpPopup_callback() {

    
}