/**
 * @시스템명: 가정관리
 * @업무명: 해지율 - 기초데이터
 * @설명: 해지율 - 기초데이터 화면의 JS
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 05. 09.
 * @개정이력: 
 *  김광섭 2026. 05. 09. 	최초작성'
 */
//전역변수
var gCondHichyCheck = [];
//var gArrCols = [];
//서비스코드 정의
var serviceCode = "03";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//one-off플래그
var gCondOneoffCheck = "N";
//3년제외플래그
var gCondY3ExcluCheck = "N";
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
    
    //표준형해지율 - 3
    //조회조건별 기초율 그리드 초기화 
    initGridPryRate();
    //조회조건별 분자항목 그리드 초기화 
    initGridNmrtItem();
    //조회조건별 분모항목 그리드 초기화 
    initGridDnmrItem();
    
    //무저해지형 해지율 - 4개
    initGridPryRate1();
    initGridNmrtItem1();
    initGridDnmrItem1();
    //initGridReprItem1();
    //표준형Skew - 2
    initGridSkewNmrtItm();
    initGridSkewDnmrItm();
    //무저해지형Skew - 2
    initGridInhvLowSkewNmrtItm();
    initGridInhvLowSkewDnmrItm();
    //해지유보효과 - 2
    initGridLpdfe3YItm();
    initGridLpdfe4YItm();
    
});

function initEvent() {
    $("#div_hide").show();
    $("#div_inhv").hide();
    $("#div_skew").hide();
    $("#div_inhvLowSkew").hide();
    $("#div_lpdfe").hide();
    
    $("#cbx_hide").show();
    
    //*보정 배치 및 엑셀다운로드 관련 선언
    //var gridTmpIdSub="gridTmpDivSub";
    //var serviceNm="RSC_RAT";
    
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
    
    //3년제외체크여부
    $("#cbx_y3Exclu").on("change", function(e){

        if ($('input:checkbox[id="cbx_y3Exclu"]').is(":checked") == true) {
            gCondY3ExcluCheck = "Y";
        } else {
        	gCondY3ExcluCheck = "N";
        }
    });
    
    // 조회조건 변경시 그리드 초기화
    $("#sbx_rscRat").on("change", function(e){
        gRscRatCombo = $("#sbx_rscRat").val();
    	if(gRscRatCombo == "basRscRat") {
            $("#div_hide").show();
            $("#div_inhv").hide();
            $("#div_skew").hide();
            $("#div_inhvLowSkew").hide();
            $("#div_lpdfe").hide();
            $("#cbx_hide").show();
        } else if(gRscRatCombo == "inhvLowRsc") {
            $("#div_hide").hide();
            $("#div_inhv").show();
            $("#div_skew").hide();
            $("#div_inhvLowSkew").hide();
            $("#div_lpdfe").hide();
            $("#cbx_hide").show();
        } else if(gRscRatCombo == "basSkew") {
            $("#div_hide").hide();
            $("#div_inhv").hide();
            $("#div_skew").show();
            $("#div_inhvLowSkew").hide();
            $("#div_lpdfe").hide();
            $("#cbx_hide").show();
        } else if(gRscRatCombo == "inhvLowSkew") {
            $("#div_hide").hide();
            $("#div_inhv").hide();
            $("#div_skew").hide();
            $("#div_inhvLowSkew").show();
            $("#div_lpdfe").hide();
            $("#cbx_hide").show();
        } else if(gRscRatCombo == "lpdfe") {
            $("#div_hide").hide();
            $("#div_inhv").hide();
            $("#div_skew").hide();
            $("#div_inhvLowSkew").hide();
            $("#div_lpdfe").show();
            $("#cbx_hide").show();
        } else {
            $("#div_hide").hide();
            $("#div_inhv").hide();
            $("#div_skew").hide();
            $("#div_inhvLowSkew").hide();
            $("#div_lpdfe").hide();
            $("#cbx_hide").hide();
        }

        resetAllGrd();
        
        if(gRscRatCombo == 'basRscRat') {
            $("#sbx_smupStnd").prop("disabled", false);
        } else if(gRscRatCombo == 'inhvLowRsc') {
            $("#sbx_smupStnd").prop("disabled", false);
        } else {
            $("#sbx_smupStnd").prop("disabled", true);
        }

        if (gRscRatCombo == 'lpdfe') {
            $("#sbx_smupStnd").hide();
        } else {
            $("#sbx_smupStnd").show();
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
        	
            if (gRscRatCombo == 'basRscRat' || gRscRatCombo == 'inhvLowRsc') {
            	if(gSmupStnd == "01") {
            		$("#titlNmrtItm").text("조회조건별 기초데이터(분자항목_해지건수)");
            		$("#titlDnmrItm").text("조회조건별 기초데이터(분모항목_보유건수)");
            		$("#titlNmrtItm1").text("조회조건별 기초데이터(분자항목_해지건수)");
            		$("#titlDnmrItm1").text("조회조건별 기초데이터(분모항목_보유건수)");
                } else {
            		$("#titlNmrtItm").text("조회조건별 기초데이터(분자항목_해지보험료)");
            		$("#titlDnmrItm").text("조회조건별 기초데이터(분모항목_보유보험료)");
            		$("#titlNmrtItm1").text("조회조건별 기초데이터(분자항목_해지보험료)");
            		$("#titlDnmrItm1").text("조회조건별 기초데이터(분모항목_보유보험료)");
                }
            }

            selectRscRatPryRateList();
        }
        
    });
    
    // 표준형해지율 엑셀다운로드
    $("#btn_excel_download").on("click", function(e){
        if(gCondFlag == "N" || $("#gridDivPryRate").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        } else if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        var unit = "X";
        /*if($("#sbx_smupStnd").val()=='01') {
            unit = "건";
        } else {
            unit = "원";
        }*/
        
      //gCondHichyCheck = [];
        var titleText = "";
        $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
            var colId = $(this).val();
            //gCondHichyCheck.push($.toUnderscore(colId));
            var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
            titleText = titleText + labelText + ", ";
        });
        titleText = titleText.substr(0,titleText.length-2)+" ";
        if(gCondOneoffCheck=="Y") titleText = titleText+", One-off 반영 ";
        if(gCondY3ExcluCheck=="Y") titleText = titleText+", 3년제외 ";

        var condFinYmFrom = $("#ibx_finYmFrom").val();
        var condFinYmTo = $("#ibx_finYmTo").val();
        titleText = titleText+", " +condFinYmFrom + " " +condFinYmTo;
        
        var fileName = $("#sbx_rscRat option:selected").text() + "_" + $("#sbx_smupStnd option:selected").text() + "_" + titleText + "_" + " 기초데이터.xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivPryRate',
                sheetName : "기초해지율",
                fileName: fileName,
                applyItemTemplate : true,
                unit: unit
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
                sheetName : "기초해지율(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: unit
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
    
    // 엑셀다운로드 -무저해지
    $("#btn_excel_download1").on("click", function(e){
        if(gCondFlag == "N" || $("#gridDivPryRate1").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        } else if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        var unit = "X";
        /*if($("#sbx_smupStnd").val()=='01') {
            unit = "건";
        } else {
            unit = "원";
        }*/
        
        //gCondHichyCheck = [];
        var titleText = "";
        $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        	var colId = $(this).val();
        	//gCondHichyCheck.push($.toUnderscore(colId));
        	var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
        	titleText = titleText + labelText + ", ";
        });
        titleText = titleText.substr(0,titleText.length-2)+" ";
        if(gCondOneoffCheck=="Y") titleText = titleText+", One-off 반영 ";
        if(gCondY3ExcluCheck=="Y") titleText = titleText+", 3년제외 ";
        
        var condFinYmFrom = $("#ibx_finYmFrom").val();
        var condFinYmTo = $("#ibx_finYmTo").val();
        titleText = titleText+", " +condFinYmFrom + " " +condFinYmTo;
        
        var fileName = $("#sbx_rscRat option:selected").text() + "_" + $("#sbx_smupStnd option:selected").text() + "_" + titleText + "_" + " 기초데이터.xlsx";
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivPryRate1',
                sheetName : "기초율",
                fileName: fileName,
                applyItemTemplate : true,
                unit: unit/*,
                searchCond: $.fn.getSearchCond(gReqParam)*/
            },
            {
                id: 'gridDivNmrtItem1',
                sheetName : "분자항목",
                fileName: fileName,
                applyItemTemplate : true,
                unit: unit
            },
            {
                id: 'gridDivDnmrItem1',
                sheetName : "분모항목",
                fileName: fileName,
                applyItemTemplate : true,
                unit: unit
            },
//            {
//                id: 'gridDivReprItem1',
//                sheetName : "대표종국납기항목",
//                fileName: fileName,
//                applyItemTemplate : true,
//                unit: unit
//            },
            {
                id: 'gridDivPryRate1',
                sheetName : "기초율(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: unit
            },
            {
                id: 'gridDivNmrtItem1',
                sheetName : "분자항목(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: unit
            },
            {
                id: 'gridDivDnmrItem1',
                sheetName : "분모항목(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: unit
            }
//            ,
//            {
//                id: 'gridDivReprItem1',
//                sheetName : "대표종국납기항목(코드)",
//                fileName: fileName,
//                applyItemTemplate : false,
//                unit: unit
//            }
        ]);
    });

    // skew 엑셀다운로드
    $('#btn_excel_download_skew').on('click', function(e){

        if(gCondFlag == "N" || ($("#skewNmrtItm").jsGrid("option", "data").length == 0 && $("#skewDnmrItm").jsGrid("option", "data").length == 0)) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        //gCondHichyCheck = [];
        var titleText = "";
        $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        	var colId = $(this).val();
        	//gCondHichyCheck.push($.toUnderscore(colId));
        	var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
        	titleText = titleText + labelText + ", ";
        });
        titleText = titleText.substr(0,titleText.length-2)+" ";
        if(gCondOneoffCheck=="Y") titleText = titleText+", One-off 반영 ";
        if(gCondY3ExcluCheck=="Y") titleText = titleText+", 3년제외 ";
        
        var condFinYmFrom = $("#ibx_finYmFrom").val();
        var condFinYmTo = $("#ibx_finYmTo").val();
        titleText = titleText+", " +condFinYmFrom + " " +condFinYmTo;
        
        var fileName = $("#sbx_rscRat option:selected").text() + "_" + $("#sbx_smupStnd option:selected").text() + "_" + titleText + "_" + " 기초데이터.xlsx";
        
        $.fn.exportMultiGridExcel([
                {
                    id: 'skewNmrtItm',
                    sheetName : "조회조건별 기초데이터(분자항목_해지보험료)",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "X"/*,
                    searchCond: $.fn.getSearchCond(gReqParam)*/
                },
                {
                    id: 'skewDnmrItm',
                    sheetName : "조회조건별 기초데이터(분모항목_보유보험료)",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "X"
                },
                {
                    id: 'skewNmrtItm',
                    sheetName : "조회조건별 기초데이터(분자항목_해지보험료)(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "X"
                },
                {
                    id: 'skewDnmrItm',
                    sheetName : "조회조건별 기초데이터(분모항목_보유보험료)(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "X"
                }
        ]);
    });

    //무저해지 Skewness 엑셀 다운로드
    $('#btn_excel_download_inhvLowSkew').on('click', function(e){
    	if(gCondFlag == "N" || $("#inhvLowSkewNmrtItm").jsGrid("option", "data").length == 0) {
    		$.fn.msgBox("조회된 항목이 없습니다.");
    		return;
    	}
//    	if(!checkCond(3)) {
//    		$.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
//    		return;
//    	}
        
        //gCondHichyCheck = [];
        var titleText = "";
        $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        	var colId = $(this).val();
        	//gCondHichyCheck.push($.toUnderscore(colId));
        	var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
        	titleText = titleText + labelText + ", ";
        });
        titleText = titleText.substr(0,titleText.length-2)+" ";
        if(gCondOneoffCheck=="Y") titleText = titleText+", One-off 반영 ";
        if(gCondY3ExcluCheck=="Y") titleText = titleText+", 3년제외 ";
        
        var condFinYmFrom = $("#ibx_finYmFrom").val();
        var condFinYmTo = $("#ibx_finYmTo").val();
        titleText = titleText+", " +condFinYmFrom + " " +condFinYmTo;
        
        var fileName = $("#sbx_rscRat option:selected").text() + "_" + $("#sbx_smupStnd option:selected").text() + "_" + titleText + "_" + " 기초데이터.xlsx";
    	$.fn.exportMultiGridExcel([
    		{
    			id: 'inhvLowSkewNmrtItm',
    			sheetName : "조회조건별 기초데이터(분자항목_해지보험료)",//RTF_BEF
    			fileName: fileName,
    			applyItemTemplate : true,
    			unit: "X"/*,
                searchCond: $.fn.getSearchCondSub("ADTN")*/
    		},
    		{
    			id: 'inhvLowSkewDnmrItm',
    			sheetName : "조회조건별 기초데이터(분모항목_보유보험료)",//RTF_AFT
    			fileName: fileName,
    			applyItemTemplate : true,
    			unit: "X"
    		},
    		{
    			id: 'inhvLowSkewNmrtItm',
    			sheetName : "조회조건별 기초데이터(분자항목_해지보험료)(코드)",
    			fileName: fileName,
    			applyItemTemplate : false,
    			unit: "X"
    		},
    		{
    			id: 'inhvLowSkewDnmrItm',
    			sheetName : "조회조건별 기초데이터(분모항목_보유보험료)(코드)",
    			fileName: fileName,
    			applyItemTemplate : false,
    			unit: "X"
    		}
    		]);
    });
    
    // 해지유보효과 엑셀다운로드
    $('#btn_excel_download_lpdfe').on('click', function(e){

        if(gCondFlag == "N" || ($("#lpdfe3YItm").jsGrid("option", "data").length == 0 && $("#lpdfe4YItm").jsGrid("option", "data").length == 0)) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }

        //gCondHichyCheck = [];
        var titleText = "";
        $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        	var colId = $(this).val();
        	//gCondHichyCheck.push($.toUnderscore(colId));
        	var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
        	titleText = titleText + labelText + ", ";
        });
        titleText = titleText.substr(0,titleText.length-2)+" ";
        if(gCondOneoffCheck=="Y") titleText = titleText+", One-off 반영 ";
        if(gCondY3ExcluCheck=="Y") titleText = titleText+", 3년제외 ";
        
        var condFinYmFrom = $("#ibx_finYmFrom").val();
        var condFinYmTo = $("#ibx_finYmTo").val();
        titleText = titleText+", " +condFinYmFrom + " " +condFinYmTo;
        
        var fileName = $("#sbx_rscRat option:selected").text() + "_" + titleText + "_" + " 기초데이터.xlsx";
        $.fn.exportMultiGridExcel([
                {
                    id: 'lpdfe3YItm',
                    sheetName : "완납전기간 3년이내계약",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "X"/*,
                    searchCond: $.fn.getSearchCond(gReqParam)*/
                },
                {
                    id: 'lpdfe4YItm',
                    sheetName : "4차년이후",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "X"
                },
                {
                    id: 'lpdfe3YItm',
                    sheetName : "완납전기간 3년이내계약(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "X"
                },
                {
                    id: 'lpdfe4YItm',
                    sheetName : "4차년이후(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "X"
                }
        ]);
    });
}

/**
* @설명: 조회시 조건, 현재 조건 체크 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09. 최초작성
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
    
    //3년제외
    if(gReqParam.y3ExcluChk != gCondY3ExcluCheck) {
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
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09. 최초작성
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
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09. 최초작성
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
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09. 최초작성
*/
function initGridDnmrItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(3);
    var gridObjectDnrmItem = new ComJsGrid({
        id: "gridDivDnmrItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectDnrmItem.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 Skew 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09 최초작성
*/
function initGridSkewNmrtItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(7);
    var gridSkewNmrtItm = new ComJsGrid({
        id: "skewNmrtItm",
        height: 250,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridSkewNmrtItm.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 유보증가 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09 최초작성
*/
function initGridSkewDnmrItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(8);
    var gridSkewDnmrItm = new ComJsGrid({
        id: "skewDnmrItm",
        height: 250,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridSkewDnmrItm.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 inhvLowSkew 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09 최초작성
*/
function initGridInhvLowSkewNmrtItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(7);
    var gridInhvLowSkewNmrtItm = new ComJsGrid({
        id: "inhvLowSkewNmrtItm",
        height: 250,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridInhvLowSkewNmrtItm.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 inhvLowSkew 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09 최초작성
*/
function initGridInhvLowSkewDnmrItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(8);
    var gridInhvLowSkewDnmrItm = new ComJsGrid({
        id: "inhvLowSkewDnmrItm",
        height: 250,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridInhvLowSkewDnmrItm.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09. 최초작성
*/
function initGridPryRate1(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(1);
    // jsGrid 빈 테이블 생성
    var gridObjectPryRate1 = new ComJsGrid({
        id: "gridDivPryRate1",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    //그리드 생성
    gridObjectPryRate1.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09. 최초작성
*/
function initGridNmrtItem1(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(2);
    var gridObjectNmrtItem1 = new ComJsGrid({
        id: "gridDivNmrtItem1",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
        }); 
    
    //그리드 생성
    gridObjectNmrtItem1.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09. 최초작성
*/
function initGridDnmrItem1(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(3);
    var gridObjectNmrtItem1 = new ComJsGrid({
        id: "gridDivDnmrItem1",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectNmrtItem1.gridCreate();
}

///**
//* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
//* @최초작성자: 김광섭
//* @최초작성일: 2026. 05. 09.
//* @최종변경일: 
//* @매개변수: 
//* @반환값: 
//* @개정이력: 
//*  김광섭 2026. 05. 09. 최초작성
//*/
//function initGridReprItem1(){
//    //그리드 필드 세팅
//    var fieldsArr = getGridFields(3);
//    var gridObjectReprItem1 = new ComJsGrid({
//        id: "gridDivReprItem1",
//        height: 200,
//        editing: false,
//        sorting: true,
//        paging: true,
//        fields : fieldsArr
//    }); 
//    
//    //그리드 생성
//    gridObjectReprItem1.gridCreate();
//}


/**
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09. 최초작성
*/
function initGridSkewNmrtItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(7);
    var gridObjectSkewNmrtItem = new ComJsGrid({
        id: "gridDivSkewNmrtItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
        }); 
    
    //그리드 생성
    gridObjectSkewNmrtItem.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09. 최초작성
*/
function initGridSkewDnmrItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(7);
    var gridObjectSkewDnmrItem = new ComJsGrid({
        id: "gridDivSkewDnmrItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectSkewDnmrItem.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09. 최초작성
*/
function initGridInhvLowSkewNmrtItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(8);
    var gridObjectInhvLowSkewNmrtItem = new ComJsGrid({
        id: "gridDivInhvLowSkewNmrtItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
        }); 
    
    //그리드 생성
    gridObjectInhvLowSkewNmrtItem.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09. 최초작성
*/
function initGridInhvLowSkewDnmrItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(8);
    var gridObjectInhvLowSkewDnmrItem = new ComJsGrid({
        id: "gridDivInhvLowSkewDnmrItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectInhvLowSkewDnmrItem.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 해지유보효과 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09 최초작성
*/
function initGridLpdfe3YItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(9);
    var gridLpdfe3YItm = new ComJsGrid({
        id: "lpdfe3YItm",
        height: 250,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridLpdfe3YItm.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 해지유보효과 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 09 최초작성
*/
function initGridLpdfe4YItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(9);
    var gridLpdfe4YItm = new ComJsGrid({
        id: "lpdfe4YItm",
        height: 250,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridLpdfe4YItm.gridCreate();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 05. 09
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김광섭 2026. 05. 09 최초작성
 */
function getGridFields(num) {
    //코드 목록
    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
    var rscRatProdScCdArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
    //그리드 공통부분 필드
    var resultArr = [];
    
    //해지율산출구분
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

    //BLOCK 필드
    var blkScCd = { 
            name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value==null || value=='') {
                    if(($('input:checkbox[id="cbx_rscRatProdScCd"]').is(":checked") == true && item.rscRatProdScCd == null)
                            ) {
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
                    		|| ($('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true && item.beBlkScCd == null)
                            ) {
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
                    		|| ($('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true && item.beBlkScCd == null)
                    		|| ($('input:checkbox[id="cbx_fpayYnScCd"]').is(":checked") == true && item.beFpayYnScCd == null)
                            ) {
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
                    		|| ($('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true && item.beBlkScCd == null)
                    		|| ($('input:checkbox[id="cbx_fpayYnScCd"]').is(":checked") == true && item.beFpayYnScCd == null)
                    		|| ($('input:checkbox[id="cbx_beChnlScCd"]').is(":checked") == true && item.beChnlScCd == null) 
                            ) {
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
    
    //납입중환급금비율 필드
    var dupayRefndRtoVal = { 
            name: "dupayRefndRtoVal", title:"납입중환급금비율", css:"cell", type: "text", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value==null || value=='') {
                    if(($('input:checkbox[id="cbx_rscRatProdScCd"]').is(":checked") == true && item.rscRatProdScCd == null)
                    		|| ($('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true && item.beBlkScCd == null)
                    		|| ($('input:checkbox[id="cbx_fpayYnScCd"]').is(":checked") == true && item.beFpayYnScCd == null)
                    		|| ($('input:checkbox[id="cbx_beChnlScCd"]').is(":checked") == true && item.beChnlScCd == null) 
                            || ($('input:checkbox[id="cbx_newLobCd"]').is(":checked") == true && item.beNewLobCd == null)
                            ) {
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
                    		|| ($('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true && item.beBlkScCd == null)
                    		|| ($('input:checkbox[id="cbx_fpayYnScCd"]').is(":checked") == true && item.beFpayYnScCd == null)
                    		|| ($('input:checkbox[id="cbx_beChnlScCd"]').is(":checked") == true && item.beChnlScCd == null) 
                            || ($('input:checkbox[id="cbx_newLobCd"]').is(":checked") == true && item.beNewLobCd == null)
                            || ($('input:checkbox[id="cbx_dupayRefndRtoVal"]').is(":checked") == true && item.dupayRefndRtoVal == null)
                            ) {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                    return value;
                }
            }
    };
    
    //납입기간 - 납입주기
    var padPrd = { name: "padPrd", title:"납입기간", css:"cell", type: "select",  width: 170, align:"center",
            itemTemplate:function(value, item) {
                if(value==null || value=='') {
                    if(($('input:checkbox[id="cbx_rscRatProdScCd"]').is(":checked") == true && item.rscRatProdScCd == null)
                    		|| ($('input:checkbox[id="cbx_blkScCd"]').is(":checked") == true && item.beBlkScCd == null)
                    		|| ($('input:checkbox[id="cbx_fpayYnScCd"]').is(":checked") == true && item.beFpayYnScCd == null)
                    		|| ($('input:checkbox[id="cbx_beChnlScCd"]').is(":checked") == true && item.beChnlScCd == null) 
                            || ($('input:checkbox[id="cbx_newLobCd"]').is(":checked") == true && item.beNewLobCd == null)
                            || ($('input:checkbox[id="cbx_dupayRefndRtoVal"]').is(":checked") == true && item.dupayRefndRtoVal == null)
                            || ($('input:checkbox[id="cbx_padAftRefndRtoVal"]').is(":checked") == true && item.padAftRefndRtoVal == null)
                            ) {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                    return (value=="99") ? "납기 통합산출": Number(value) + "년납";
                }
            }
    };
    
    //해지유보적용여부
    var lpdfeAplcYn = { name: "lpdfeAplcYn", title:"해지유보적용여부", css:"cell", type: "text",  width: 170, align:"center",
            itemTemplate:function(value, item) {
            	if ($.fn.isEmpty(value)) {
            		return "유보효과X";
            	} else if (value == "Y") {
            		return "유보효과O";
            	} else {
            		return "유보효과X";
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
    
    // 해지유보효과
    if(num == 9) {
        $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
            var colId = $(this).val();
            switch(colId) {
            case "rscRatProdScCd":
                resultArr.push(rscRatProdScCd);
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
            case "dupayRefndRtoVal":
                resultArr.push(dupayRefndRtoVal);
                break;
            case "padAftRefndRtoVal":
                resultArr.push(padAftRefndRtoVal);
                break;
            case "padPrd":
                resultArr.push(padPrd);
                break;
            }
        });
        
    	var field = {name:"finYm", title:"마감년도", css:"cell", type:"text", width:120, align:"center", sorter:"number",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "":value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"rscAmt", title:"해지보험료", css:"cell", type:"text", width:120, align:"right", sorter:"number",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"retAmt", title:"보유보험료", css:"cell", type:"text", width:120, align:"right", sorter:"number",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"rscCnt", title:"해지건수", css:"cell", type:"text", width:120, align:"right", sorter:"number",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"retCnt", title:"보유건수", css:"cell", type:"text", width:120, align:"right", sorter:"number",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
    			}
    	}
    	resultArr.push(field);

    } //Skew
    else if(num == 7 || num == 8) {
        $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
            var colId = $(this).val();
            switch(colId) {
            case "rscRatProdScCd":
                resultArr.push(rscRatProdScCd);
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
            case "dupayRefndRtoVal":
                resultArr.push(dupayRefndRtoVal);
                break;
            case "padAftRefndRtoVal":
                resultArr.push(padAftRefndRtoVal);
                break;
            case "padPrd":
                resultArr.push(padPrd);
                break;
            }
        });
        // Skew 1차년 ...3차년
        for(var i=1; i<=3; i++) {
        	var field = {name:"psgYys"+i, title:i+"차년", css:"cell", type:"text", width:120, align:"right", sorter:"number",
        			itemTemplate:function(value, item) {
        				return $.fn.isEmpty(value) ? "0.00" : $.addCommaNumber(value.toString());
        			}
        	}
        	resultArr.push(field);
        }
    } else if(num != 4 && num != 5) {
        $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
            var colId = $(this).val();
            switch(colId) {
            case "rscRatProdScCd":
                resultArr.push(rscRatProdScCd);
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
            case "dupayRefndRtoVal":
                resultArr.push(dupayRefndRtoVal);
                break;
            case "padAftRefndRtoVal":
                resultArr.push(padAftRefndRtoVal);
                break;
            case "padPrd":
                resultArr.push(padPrd);
                break;
            }
        });

        var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12", "13", "14", "15"];
        var titelArr  = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12", "13", "14", "15"];
        var fieldsArr = getFieldsArr(targetArr, titelArr, num);
        resultArr = resultArr.concat(fieldsArr);
        //합계세팅
        resultArr.push(allInfo);
    } else {
        $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
            var colId = $(this).val();
            switch(colId) {
            case "rscRatProdScCd":
                resultArr.push(rscRatProdScCd);
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
            case "dupayRefndRtoVal":
                resultArr.push(dupayRefndRtoVal);
                break;
            case "padAftRefndRtoVal":
                resultArr.push(padAftRefndRtoVal);
                break;
            case "padPrd":
                resultArr.push(padPrd);
                break;
            }
        });
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
        }else if(num==7) {
            // Skew 1차년 ...3차년
            for(var i=1; i<=3; i++) {
                var field = {name:"psgYys"+i, title:i+"차년", css:"cell", type:"text", width:120, align:"right", sorter:"number",
                        itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0.00" : $.addCommaNumber(value.toString());
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
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 05. 09
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김광섭 2026. 05. 09 최초작성
 */
function getFieldsArr(targetArr, titelArr, num) {
    if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titelArr)) {
        return [];
    }
    
    var resultArr = [];
    
    //console.log("num : " + num)
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        if(num == 1) {
            var distStndValField = { name: "psgYys" + target , title: titelArr[i] + "차년", css:"cell", type: "text", width: 80, align:"right", sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            }};
        } else {
            var distStndValField = { name: "psgYys" + target , title: titelArr[i] + "차년", css:"cell", type: "text", width: 170, align:"right", sorter:"number", itemTemplate:function(value, item) {
            	if(gRscRatCombo == 'inhvLowRsc') {
                	return $.fn.isEmpty(value) ? " " : $.addCommaNumber(value.toString());
                } else {
                	return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                }
            }};
        }
        resultArr.push(distStndValField);
    }
    return resultArr;
}
/**
 * @설명: gridTable의 header조회
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 05. 09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 05. 09 최초작성
 */
function isEmpty(value) {
    if(typeof value === "undefined" || value == null || value == "") {
        value = "";
    }
    return value;
}

function selectRscRatPryRateList(){
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
    gReqParam.y3ExcluChk = gCondY3ExcluCheck;
    gReqParam.rscRatCombo = gRscRatCombo;
    gReqParam.smupStnd = gSmupStnd;

    // 기간계 데이터 조회
   $.callAjax({"jsonStr":JSON.stringify(gReqParam)}, "/be/pd/bepd144m/selectRscRatPryRateAdvList.do")
    .done(function(data) {
        // 그리드 초기화
        resetAllGrd();
        //resetGrid();
        //reDrawGrid();
        // 그리드 바인딩
        if(gRscRatCombo=='basRscRat') {  //표준형
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
        } else if(gRscRatCombo=='inhvLowRsc') {  //무저해지형
            $('#gridDivPryRate1').jsGrid('reset');
            $("#gridDivPryRate1").jsGrid("option", "data", []);
            $("#gridDivPryRate1").jsGrid("destroy");
            
            $('#gridDivNmrtItem1').jsGrid('reset');
            $("#gridDivNmrtItem1").jsGrid("option", "data", []);
            $("#gridDivNmrtItem1").jsGrid("destroy");
            
            $('#gridDivDnmrItem1').jsGrid('reset');
            $("#gridDivDnmrItem1").jsGrid("option", "data", []);
            $("#gridDivDnmrItem1").jsGrid("destroy");
            
//            $('#gridDivReprItem1').jsGrid('reset');
//            $("#gridDivReprItem1").jsGrid("option", "data", []);
//            $("#gridDivReprItem1").jsGrid("destroy");

            initGridPryRate1();
            initGridNmrtItem1();
            initGridDnmrItem1();
//            initGridReprItem1();
            
            // 무저해지 조회결과
            var rateListData = data.rateList;
            var nmrtListData = data.nmrtList;
            var dnmrListData = data.dnmrList;
//            var reprListData = data.reprList;  //대표종국납기
            if(rateListData == null || rateListData.length == 0) {
                $.fn.getReturnValue("gridDivPryRate1");
            } else {
                $("#gridDivPryRate1").jsGrid("loadData", rateListData);
            }
            if(nmrtListData == null || nmrtListData.length == 0) {
                $.fn.getReturnValue("gridDivNmrtItem1");
            } else {
                $("#gridDivNmrtItem1").jsGrid("loadData", nmrtListData);
            }
            if(dnmrListData == null || dnmrListData.length == 0) {
                $.fn.getReturnValue("gridDivDnmrItem1");
            } else {
                $("#gridDivDnmrItem1").jsGrid("loadData", dnmrListData);
            }
//            if(reprListData == null || reprListData.length == 0) {
//                $.fn.getReturnValue("gridDivReprItem1");
//            } else {
//                $("#gridDivReprItem1").jsGrid("loadData", reprListData);
//            }
        } else if(gRscRatCombo=='basSkew') { //표준형Skew
            $('#skewNmrtItm').jsGrid('reset');
            $('#skewDnmrItm').jsGrid('reset');
            $("#skewNmrtItm").jsGrid("option", "data", []);
            $("#skewNmrtItm").jsGrid("destroy");
            $("#skewDnmrItm").jsGrid("option", "data", []);
            $("#skewDnmrItm").jsGrid("destroy");
            initGridSkewNmrtItm();
            initGridSkewDnmrItm();
            
            var nmrtListData = data.nmrtList;
            var dnmrListData = data.dnmrList;

            if(nmrtListData == null || nmrtListData.length == 0) {
                $.fn.getReturnValue("skewNmrtItm");
            } else {
                
                $("#skewNmrtItm").jsGrid("loadData", nmrtListData);
            }
            
            if(dnmrListData == null || dnmrListData.length == 0) {
                $.fn.getReturnValue("skewDnmrItm");
            } else {
                $("#skewDnmrItm").jsGrid("loadData", dnmrListData);
            }
        } else if(gRscRatCombo=='inhvLowSkew') { //무저해지형Skew
            $('#inhvLowSkewNmrtItm').jsGrid('reset');
            $('#inhvLowSkewDnmrItm').jsGrid('reset');
            $("#inhvLowSkewNmrtItm").jsGrid("option", "data", []);
            $("#inhvLowSkewNmrtItm").jsGrid("destroy");
            $("#inhvLowSkewDnmrItm").jsGrid("option", "data", []);
            $("#inhvLowSkewDnmrItm").jsGrid("destroy");
            initGridInhvLowSkewNmrtItm();
            initGridInhvLowSkewDnmrItm();
            
            var nmrtListData = data.nmrtList;
            var dnmrListData = data.dnmrList;

            if(nmrtListData == null || nmrtListData.length == 0) {
                $.fn.getReturnValue("inhvLowSkewNmrtItm");
            } else {
                
                $("#inhvLowSkewNmrtItm").jsGrid("loadData", nmrtListData);
            }
            
            if(dnmrListData == null || dnmrListData.length == 0) {
                $.fn.getReturnValue("inhvLowSkewDnmrItm");
            } else {
                $("#inhvLowSkewDnmrItm").jsGrid("loadData", dnmrListData);
            }
        } else if(gRscRatCombo=='lpdfe') { //해지유보효과
            $('#lpdfe3YItm').jsGrid('reset');
            $('#lpdfe4YItm').jsGrid('reset');
            $("#lpdfe3YItm").jsGrid("option", "data", []);
            $("#lpdfe3YItm").jsGrid("destroy");
            $("#lpdfe4YItm").jsGrid("option", "data", []);
            $("#lpdfe4YItm").jsGrid("destroy");
            initGridLpdfe3YItm();
            initGridLpdfe4YItm();
            
            var nmrtListData = data.nmrtList;
            var dnmrListData = data.dnmrList;

            if(nmrtListData == null || nmrtListData.length == 0) {
                $.fn.getReturnValue("lpdfe3YItm");
            } else {
                
                $("#lpdfe3YItm").jsGrid("loadData", nmrtListData);
            }
            
            if(dnmrListData == null || dnmrListData.length == 0) {
                $.fn.getReturnValue("lpdfe4YItm");
            } else {
                $("#lpdfe4YItm").jsGrid("loadData", dnmrListData);
            }
        } else {
//            $('#rsrtEfcItm').jsGrid('reset');
//            $('#incrEfcItm').jsGrid('reset');
//            $("#rsrtEfcItm").jsGrid("option", "data", []);
//            $("#rsrtEfcItm").jsGrid("destroy");
//            $("#incrEfcItm").jsGrid("option", "data", []);
//            $("#incrEfcItm").jsGrid("destroy");
//            initGridRsrtEfcItm();
//            initGridIncrEfcItm();
//            
//            var nmrtListData = data.nmrtList;
//            var dnmrListData = data.dnmrList;
//
//            if(nmrtListData == null || nmrtListData.length == 0) {
//                $.fn.getReturnValue("rsrtEfcItm");
//            } else {
//                
//                $("#rsrtEfcItm").jsGrid("loadData", nmrtListData);
//            }
//            
//            if(dnmrListData == null || dnmrListData.length == 0) {
//                $.fn.getReturnValue("incrEfcItm");
//            } else {
//                $("#incrEfcItm").jsGrid("loadData", dnmrListData);
//            }
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
    });
}

/**
 * @설명: 초기 조회일자 세팅
 * @최초작성자: 김광섭
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
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 05. 09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 05. 09 최초작성
 */
function resetGrid() {
	$("#gridDivPryRate").jsGrid("option", "data", []);
	$("#gridDivPryRate").jsGrid("reset");
	$("#gridDivNmrtItem").jsGrid("option", "data", []);
	$("#gridDivNmrtItem").jsGrid("reset");
	$("#gridDivDnmrItem").jsGrid("option", "data", []);
	$("#gridDivDnmrItem").jsGrid("reset");
//	$("#gridDivReprItem").jsGrid("option", "data", []);
//	$("#gridDivReprItem").jsGrid("reset");
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 05. 09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 05. 09 최초작성
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
//무저해지
function resetGridInhv() {
	$("#gridDivPryRate1").jsGrid("option", "data", []);
	$("#gridDivPryRate1").jsGrid("reset");
	$("#gridDivNmrtItem1").jsGrid("option", "data", []);
	$("#gridDivNmrtItem1").jsGrid("reset");
	$("#gridDivDnmrItem1").jsGrid("option", "data", []);
	$("#gridDivDnmrItem1").jsGrid("reset");
//	$("#gridDivReprItem1").jsGrid("option", "data", []);
//	$("#gridDivReprItem1").jsGrid("reset");
}
function reDrawGridInhv() {
    //그리드 destroy
    $("#gridDivPryRate1").jsGrid("destroy");
    $("#gridDivNmrtItem1").jsGrid("destroy");
    $("#gridDivDnmrItem1").jsGrid("destroy");
//    $("#gridDivReprItem1").jsGrid("destroy");
    //그리드 create
    initGridPryRate1();
    initGridNmrtItem1();
    initGridDnmrItem1();
//    initGridReprItem1();
}
//표준형skew
function resetGridSkew() {
	$("#skewNmrtItm").jsGrid("option", "data", []);
	$("#skewNmrtItm").jsGrid("reset");
	$("#skewDnmrItm").jsGrid("option", "data", []);
	$("#skewDnmrItm").jsGrid("reset");
}
function reDrawGridSkew() {
    //그리드 destroy
    $("#skewNmrtItm").jsGrid("destroy");
    $("#skewDnmrItm").jsGrid("destroy");
    //그리드 create
    initGridSkewNmrtItm();
    initGridSkewDnmrItm();
}
//무저해지형skew
function resetGridSkewInhv() {
	$("#inhvLowSkewNmrtItm").jsGrid("option", "data", []);
	$("#inhvLowSkewNmrtItm").jsGrid("reset");
	$("#inhvLowSkewDnmrItm").jsGrid("option", "data", []);
	$("#inhvLowSkewDnmrItm").jsGrid("reset");
}
function reDrawGridSkewInhv() {
    //그리드 destroy
    $("#inhvLowSkewNmrtItm").jsGrid("destroy");
    $("#inhvLowSkewDnmrItm").jsGrid("destroy");
    //그리드 create
    initGridInhvLowSkewNmrtItm();
    initGridInhvLowSkewDnmrItm();
}
//해지유보효과
function resetGridLpdfe() {
	$("#lpdfe3YItm").jsGrid("option", "data", []);
	$("#lpdfe3YItm").jsGrid("reset");
	$("#lpdfe4YItm").jsGrid("option", "data", []);
	$("#lpdfe4YItm").jsGrid("reset");
}
function reDrawGridLpdfe() {
    //그리드 destroy
    $("#lpdfe3YItm").jsGrid("destroy");
    $("#lpdfe4YItm").jsGrid("destroy");
    //그리드 create
    initGridLpdfe3YItm();
    initGridLpdfe4YItm();
}

function resetAllGrd() {
	//표준형
	resetGrid();
    reDrawGrid();
    //무저해지형
    resetGridInhv();
    reDrawGridInhv();
    //표준형skew
    resetGridSkew();
    reDrawGridSkew();
    //무저해지형skew
    resetGridSkewInhv();
    reDrawGridSkewInhv();
    //해지유보효과
    resetGridLpdfe();
    reDrawGridLpdfe();
}