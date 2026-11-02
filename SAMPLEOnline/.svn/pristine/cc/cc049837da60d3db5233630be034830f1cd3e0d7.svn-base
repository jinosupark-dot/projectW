/**
 * @시스템명: 가정관리
 * @업무명: 해지율 - 산출적용 - 무저해지형
 * @설명: 해지율 - 산출적용 화면의 JS
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26.
 * @최종변경일: 2026. 5.  3.
 * @개정이력: 
 *  김광섭 2026. 5. 26. 최초작성
 */
//var condAplcBeNm;
// 업로드 위한 컬럼 양식 (기본해지율)
var gArrCols = [];
// 업로드 위한 컬럼 양식 (유보)
var gArrCols2 = [];
// 업로드 위한 컬럼 양식 (증가)
var gArrCols3 = [];
var gArrCols4 = [];
//var gTbNm = "TB_IBECRD10";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//조회조건 콤보박스
var gRscRatCombo = "basRscRat";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    // 공통코드 조회(납입상태, 채널, 상품유형)
    $.fn.loadCommonCode(["RSC_RAT_PROD_SC_CD","BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD","BE_CHNL_SC_CD","BE_BLK_SC_CD"]);

    //적용BE 콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //조해지율_1. 통계적 충분성 만족 전(보정전 산출결과)
    initGridRtfBfc();
    //대표종국납기
    initGridReprLst();
    //조해지율_2. 통계적 충분성 만족 후(보정후 산출결과)
    initGridRftAfc();
    
    //2.보정과정
    initGridRsrtEfcItm();
    initGridIncrEfcItm();
    initGridRsrtEfcUploadItm();
    
    //3.산출결과 Skewness
    initGridSkewItm();
    initGridSkewUploadItm();
    
    //4. 비교결과
    initGridComprRst1Itm();
    initGridComprRst2Itm();
    initGridComprRst3Itm();
    
    // 시작 시 적용BE 포커스
    $("#ibx_aplcBeNm").focus();
});
/**
* @설명: 콤보박스 초기화
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 7. 최초작성
*/
function initCommCd() {
    // 적용BE 조회
    //condAplcBeNm = $.fn.getAplcBe("sbx_aplcBeNm","03");
}

/**
* @설명: event 초기화
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 26. 최초작성
*/
function initEvent() {
    $("#div_hide").show();
    $("#div_show").hide();
    $("#div_skew").hide();
    $("#div_compr").hide();
    
    var serviceNm="RSC_RAT_NHVLOW";//무저해지형 배치

    // 조회조건 변경시 그리드 초기화
    $("#sbx_prodCors").on("change", function(e){
        gRscRatCombo = $("#sbx_prodCors").val();
        if(gRscRatCombo == "basRscRat") {
            $("#div_hide").show();
            $("#div_show").hide();
            $("#div_skew").hide();
            $("#div_compr").hide();
            resetAllGrd();
        } else if(gRscRatCombo == "rtfCors"){
            $("#div_hide").hide();
            $("#div_show").show();
            $("#div_skew").hide();
            $("#div_compr").hide();
            resetAllGrd();
        } else if(gRscRatCombo == "prodRsrt"){
            $("#div_hide").hide();
            $("#div_show").hide();
            $("#div_skew").show();
            $("#div_compr").hide();
            resetAllGrd();
        } else {
            $("#div_hide").hide();
            $("#div_show").hide();
            $("#div_skew").hide();
            $("#div_compr").show();
            resetAllGrd();
        }
    });
    
    // 조회
    $('#btn_search').on('click', function(e){
    	if ($.fn.isEmpty($("#ibx_aplcBeNm").val())) {
    		$.fn.msgBox("적용BE를 입력하세요.", function() {
        	    $("#ibx_aplcBeNm").focus();
    		});
    		return;
    	}
        selectProdAplcList();
    });
    
    //통계적 충분성 만족여부
    $('#btn_excel_download_reprLst').on('click', function(e){
        if(gCondFlag == "N" || $("#gridDivReprLst").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName =$("#sbx_rscRat option:selected").text() + "_" + $("#sbx_prodCors option:selected").text() + "_"
                     + "통계적 충분성 만족여부"+"_"+$("#ibx_aplcBeNm").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivReprLst',
                sheetName : "통계적 충분성 만족여부",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"/*,
                searchCond: $.fn.getSearchCondSub("PROD")*/
            },
            {
                id: 'gridDivReprLst',
                sheetName : "통계적 충분성 만족여부(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    
    //통계적충분성 만족전:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download_bfc').on('click', function(e){
        if(gCondFlag == "N" || $("#gridDivRtfBfc").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName =$("#sbx_rscRat option:selected").text() + "_" + $("#sbx_prodCors option:selected").text() + "_"
                     + "통계적 충분성 만족 전"+"_"+$("#ibx_aplcBeNm").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivRtfBfc',
                sheetName : "통계적 충분성 만족 전",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"/*,
                searchCond: $.fn.getSearchCondSub("PROD")*/
            },
            {
                id: 'gridDivRtfBfc',
                sheetName : "통계적 충분성 만족 전(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //통계적충분성 만족 후:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $("#btn_excel_download_afc").on("click", function(e){
        if(gCondFlag == "N" || $("#gridDivRtfAfc").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = $("#sbx_rscRat option:selected").text() + "_" + $("#sbx_prodCors option:selected").text() + "_"
                      + "통계적 충분성 만족 후"+"_"+$("#ibx_aplcBeNm").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivRtfAfc',
                sheetName : "통계적 충분성 만족 후",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"
            },
            {
                id: 'gridDivRtfAfc',
                sheetName : "통계적 충분성 만족 후(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //원칙모형수렴점:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download21').on('click', function(e){
        if(gCondFlag == "N" || $("#rsrtEfcItm").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = $("#sbx_rscRat option:selected").text() + "_" + $("#sbx_prodCors option:selected").text() + "_"
                      +$(document).find("title").text()+"_"+$("#ibx_aplcBeNm").val()+"_원칙모형수렴점.xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'rsrtEfcItm',
                sheetName : "원칙모형수렴점",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"/*,
                searchCond: $.fn.getSearchCondSub("PROD")*/
            },
            {
                id: 'rsrtEfcItm',
                sheetName : "원칙모형수렴점(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //1차보정해지율:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download22').on('click', function(e){
        if(gCondFlag == "N" || $("#incrEfcItm").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = $("#sbx_rscRat option:selected").text() + "_" + $("#sbx_prodCors option:selected").text() + "_" 
                      +$(document).find("title").text()+"_"+$("#ibx_aplcBeNm").val()+"_1차보정.xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'incrEfcItm',
                sheetName : "1차보정해지율(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //사용자보정:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download23').on('click', function(e){
        if(gCondFlag == "N" || $("#rsrtEfcUploadItm").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = $("#sbx_rscRat option:selected").text() + "_" + $("#sbx_prodCors option:selected").text() + "_"
                      +$(document).find("title").text()+"_"+$("#ibx_aplcBeNm").val()+"_사용자보정.xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'rsrtEfcUploadItm',
                sheetName : "사용자보정(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //1차보정해지율 배치 실행
    $("#btn_rtfBatch22").on("click", function(e){
        if ($("#ibx_aplcBeNm").val().endsWith('BE_F')) {
        	$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
        		$("#ibx_aplcBeNm").focus();
        	});
        	return;
        }
        
    	var reqParam = {};
    	
    	//적용BE
    	reqParam.batName=serviceNm;
    	reqParam.aplcBeNm = $("#ibx_aplcBeNm").val();/*배치기준년도*/
    	reqParam.stepId   = "2";/*무저해지배치스텝구분*/
    	
    	$.fn.msgBox('보정을 실행하시겠습니까?', function (obj) {
    		if (obj.btn_ok) {
    			$.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
    			.done(function(data) {
    				if(data.result == '0') {
    					//setTimeout(function() {
    					//	selectProdAplcList();
    					//}, 6000);
    				}
    			}).fail(function(data){
    				$.fn.msgBox('보정 배치가 실패했습니다.');
    			});
    		}
    	}, 2);
    });
    
    //산출결과 > 2차 보정_로그-선형 모형 추정 해지율(최종) 배치 실행
    $("#btn_rtfBatch31").on("click", function(e){
        if ($("#ibx_aplcBeNm").val().endsWith('BE_F')) {
        	$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
        	    $("#ibx_aplcBeNm").focus();
        	});
        	return;
        }
        
    	var reqParam = {};
    	
    	//적용BE
    	reqParam.batName=serviceNm;
    	reqParam.aplcBeNm = $("#ibx_aplcBeNm").val();/*배치기준년도*/
    	reqParam.stepId   = "3";/*무저해지배치스텝구분*/
    	
    	$.fn.msgBox('실행하시겠습니까?', function (obj) {
    		if (obj.btn_ok) {
    			$.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
    			.done(function(data) {
    				if(data.result == '0') {
    					//setTimeout(function() {
    					//	selectProdAplcList();
    					//}, 6000);
    				}
    			}).fail(function(data){
    				$.fn.msgBox('실행 배치가 실패했습니다.');
    			});
    		}
    	}, 2);
    });
    
    //산출결과 > 최종 해지율 집계  엑셀다운
    $('#btn_excel_download32').on('click', function(e){
        if(gCondFlag == "N" || $("#skewItm").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        let fileName = "무저해지형해지율 3.산출결과_"+$("#ibx_aplcBeNm").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'skewItm',
                sheetName : "2차 보정_로그",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"/*,
                searchCond: $.fn.getSearchCondSub("PROD")*/
            },
            {
                id: 'skewUploadItm',
                sheetName : "최종 해지율 집계",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"/*,
                searchCond: $.fn.getSearchCondSub("PROD")*/
            },
            {
                id: 'skewItm',
                sheetName : "2차 보정_로그(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            },
            {
                id: 'skewUploadItm',
                sheetName : "최종 해지율 집계(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //비교결과 > 표준형과 비교(경과차년별)  엑셀다운
    $('#btn_excelDown41').on('click', function(e){
        if(gCondFlag == "N" || $("#compr1Itm").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        let fileName = "무저해지형해지율 4.비교결과_"+$("#ibx_aplcBeNm").val()+".xlsx";
        console.log("fileName=" + fileName);
        
        $.fn.exportMultiGridExcel([
            {
                id: 'compr1Itm',
                sheetName : "표준형과 비교(경과차년별)",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"
                //searchCond: $.fn.getSearchCondSub("PROD")
            },
            {
                id: 'compr2Itm',
                sheetName : "표준형과 비교(경과차년별 누적유지율)",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"
                //searchCond: $.fn.getSearchCondSub("PROD")
            },
            {
                id: 'compr1Itm',
                sheetName : "표준형과 비교(경과차년별)(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            },
            {
                id: 'compr2Itm',
                sheetName : "표준형과 비교(경과차년별 누적유지율)(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //비교결과 > 표준형과 비교(경과차년별)  엑셀다운
    $('#btn_excelDown43').on('click', function(e){
        if(gCondFlag == "N" || $("#compr3Itm").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        let fileName = "무저해지형해지율 4.비교결과_"+$("#ibx_aplcBeNm").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'compr3Itm',
                sheetName : "무저해지형 간 비교(경과차년별)_비교(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });

    //무저해지형 간 비교(경과차년별)_비교 excel upload
    $("#btn_excelUpload43").on("click", function(e){
        if ($("#ibx_aplcBeNm").val().endsWith('BE_F')) {
        	$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
        	    $("#ibx_aplcBeNm").focus();
        	});
        	return;
        }
        
//    	var arrColsInfo = $.fn.getTbCols("TB_IBECRD10");
//        gArrCols2 = $.fn.createTmpExcelGrid(arrColsInfo);
        //조회조건 확인
//        if(!checkCond(3)) {
//            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
//            return;
//        }
//        if(gArrCols2.length == 0) {
//            $.fn.msgBox("최종 표준형 해지율을 다운로드한 후 엑셀업로드를 해주세요.");
//            return;
//        }
//        console.log(gArrCols);
        
        var paramObj = {};
        
        paramObj.id = "compr3Itm";  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols;
                        data["aplcBeNm"] = $("#ibx_aplcBeNm").val();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd147m/selectComprList.do')
                        .done(function(data) {
                        	console.log(data);
//                            if(data.result == 'success') {
//                                $.fn.msgBox('정상적으로 처리되었습니다.');//TODO.....
//                            }
                            var comprList = data.comprList;
                            if(comprList && comprList.length == 0) {
                                $.fn.getReturnValue("compr3Itm");
                            } else {
                                $("#compr3Itm").jsGrid("loadData", comprList);
                            }
                        }).fail(function(data){
                            $.fn.msgBox('데이터 저장이 실패했습니다.');
                        });
                    }
                }, 2);
            }
        };
        console.log("paramObj", paramObj);
        $.fn.BeloadGridExcel(paramObj);
    });
    
    //비교결과 > 무저해지형 간 비교(경과차년별)_비교 배치 실행
    $("#btn_rtfBatch43").on("click", function(e){
    	var reqParam = {};
    	
    	//적용BE
    	reqParam.batName=serviceNm;
    	reqParam.aplcBeNm = $("#ibx_aplcBeNm").val();/*배치기준년도*/
    	reqParam.stepId   = "3";/*무저해지배치스텝구분*/TODO
    	
    	$.fn.msgBox('실행하시겠습니까?', function (obj) {
    		if (obj.btn_ok) {
    			$.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
    			.done(function(data) {
    				if(data.result == '0') {
    					//setTimeout(function() {
    					//	selectProdAplcList();
    					//}, 6000);
    				}
    			}).fail(function(data){
    				$.fn.msgBox('실행 배치가 실패했습니다.');
    			});
    		}
    	}, 2);
    });
    
    //엑셀업로드 클릭 (2. 보정과정-1차 보정후 해지율)
    $("#btn_excelUpload22").on("click", function(e){
        if ($("#ibx_aplcBeNm").val().endsWith('BE_F')) {
        	$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
        	    $("#ibx_aplcBeNm").focus();
        	});
        	return;
        }
        
//    	var arrColsInfo = $.fn.getTbCols("TB_IBECRD10");
//        gArrCols2 = $.fn.createTmpExcelGrid(arrColsInfo);
        
//        //직전년도BE비교 체크
//        if($("#rsrtEfcUploadItm").jsGrid("option", "fields").length > 12) {
//            $.fn.msgBox("조회 후 업로드 해주세요.");
//            return;
//        }
//        if(!checkCond(2)) {
//            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
//            return;
//        }
//        if(gArrCols2.length == 0) {
//            $.fn.msgBox("최종BE 적용결과를 다운로드한 후 엑셀업로드를 해주세요.");
//            return;
//        }
        var paramObj = {};
        
        paramObj.id = "incrEfcItm";                  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        console.log("로드데이터");
                        console.log(JSON.stringify(data["list"]));
                        console.log(gArrCols2);
                        data["colList"] = gArrCols2;
                        data["tbNm"] = "TB_IBECRD10";
                        data["aplcBeNm"] = $("#ibx_aplcBeNm").val();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd147m/saveRscRatProdAplcIncrRtfList.do')
                        .done(function(data) {
                        	console.log(data);
                            if(data.result == 'success') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                            }
                        }).fail(function(data){
                            $.fn.msgBox('데이터 저장이 실패했습니다.');
                        });
                    }
                }, 2);
            }
        };
        console.log("paramObj", paramObj);
        $.fn.BeloadGridExcel(paramObj);
        
    });

    $("#btn_excelUpload23").on("click", function(e){
        if ($("#ibx_aplcBeNm").val().endsWith('BE_F')) {
        	$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
        	    $("#ibx_aplcBeNm").focus();
        	});
        	return;
        }
        
//    	var arrColsInfo = $.fn.getTbCols("TB_IBECRD10");
//        gArrCols2 = $.fn.createTmpExcelGrid(arrColsInfo);
        //조회조건 확인
//        if(!checkCond(3)) {
//            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
//            return;
//        }
//        if(gArrCols2.length == 0) {
//            $.fn.msgBox("최종 표준형 해지율을 다운로드한 후 엑셀업로드를 해주세요.");
//            return;
//        }
//        console.log(gArrCols);
        
        var paramObj = {};
        
        paramObj.id = "rsrtEfcUploadItm";  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols;
                        data["aplcBeNm"] = $("#ibx_aplcBeNm").val();
//                        data["smupStnd"] = gSmupStnd;
//                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd142m/saveSkewBeList.do')
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd147m/saveRscRatProdAplcPsrtRtfBeList.do')
                        .done(function(data) {
                        	console.log(data);
                            if(data.result == 'success') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                            }
                        }).fail(function(data){
                            $.fn.msgBox('데이터 저장이 실패했습니다.');
                        });
                    }
                }, 2);
            }
        };
        console.log("paramObj", paramObj);
        $.fn.BeloadGridExcel(paramObj);
    });
    
    //Skewness 산출결과 엑셀 다운로드
    $('#btn_excel_download3').on('click', function(e){
        if(gCondFlag == "N" || $("#skewItm").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(3)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = "Skewness산출결과_"+$("#ibx_aplcBeNm").val()+"_"+/*$("#sbx_smupStnd option:selected").text()+*/".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'skewItm',
                sheetName : "Skewness산출결과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X",
                searchCond: $.fn.getSearchCondSub("ADTN")
            },
            {
                id: 'skewUploadItm',
                sheetName : "Skewness최종",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"
            },
            {
                id: 'skewItm',
                sheetName : "Skewness산출결과(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            },
            {
                id: 'skewUploadItm',
                sheetName : "Skewness최종(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //Skewness양식다운
    $("#btn_excelDown3").on("click", function(e){ 
        var arrColsInfo = $.fn.getTbCols("TB_IBECRS18");
        gArrCols4 = $.fn.createTmpExcelGrid(arrColsInfo);
        console.log(gArrCols4);
        //직전년도BE비교 체크
        if(gCondFlag == "N" ) {
            $.fn.msgBox("조회 후 다운로드 해주세요.");
            return;
        }
        if(!checkCond(3)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        let fileName = "Skewness_산출적용_업로드양식.xlsx";
        $.fn.exportGridExcel({
            id       : 'skewUploadItm', 
            fileName : fileName
        });
    });
    
    //btn_excelUpload3
    $("#btn_excelUpload3").on("click", function(e){
        
        //조회조건 확인
        if(!checkCond(3)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        if(gArrCols4.length == 0) {
            $.fn.msgBox("최종BE 적용결과를 다운로드한 후 엑셀업로드를 해주세요.");
            return;
        }
        
        var paramObj = {};
        
        paramObj.id = "skewUploadItm";                  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols4;
                        data["aplcBeNm"] = $("#ibx_aplcBeNm").val();
//                        data["smupStnd"] = gSmupStnd;
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd142m/saveSkewBeList.do')
                        .done(function(data) {
                        	console.log(data);
                            if(data.result == 'success') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                            }
                        }).fail(function(data){
                            $.fn.msgBox('데이터 저장이 실패했습니다.');
                        });
                    }
                }, 2);
            }
        };
        console.log("paramObj", paramObj);
        $.fn.BeloadGridExcel(paramObj);
        
    });
    
    // 엔터키 조회
    $("#ibx_aplcBeNm").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
}

/**
* @설명: 해지율 - 산출적용 - 보정전 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 26. 최초작성
*/
function initGridRtfBfc(){
    
    var fieldsArr = getGridFields();
//    var headerRowArr = getGridHederRow();
    
    var gridObjectRtfBfc = new ComJsGrid({
        id: "gridDivRtfBfc",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRtfBfc.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 - 보정후 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 26. 최초작성
*/
function initGridRftAfc(){
    
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();
    
    var gridObjectRftAfc = new ComJsGrid({
        id: "gridDivRtfAfc",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRftAfc.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 - 대표종국납기 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 26. 최초작성
*/
function initGridReprLst(){
    
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();
    
    var gridObjectReprLst = new ComJsGrid({
        id: "gridDivReprLst",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectReprLst.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 유보
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 18
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 18 최초작성
*/
function initGridRsrtEfcItm(){
    //그리드 필드 세팅
//    var fieldsArr = getGridFields(4);
//    var headerRowArr = getRsrtEfcHeader(1);
    var fieldsArr = getGridFields();
    var headerRowArr = getRsrtEfcHeader(1);
    
    var gridRsrtEfcItm = new ComJsGrid({
        id: "rsrtEfcItm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridRsrtEfcItm.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 증가 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 08
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 08 최초작성
*/
function initGridIncrEfcItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(2);
//    var headerRowArr = getRsrtEfcHeader(2);
    
    var gridIncrEfcItm = new ComJsGrid({
        id: "incrEfcItm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridIncrEfcItm.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 유보 업로드
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 08
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 08 최초작성
*/
function initGridRsrtEfcUploadItm(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(3);
//    var headerRowArr = getRsrtEfcHeader(1);
    
    var gridRsrtEfcUploadItm = new ComJsGrid({
        id: "rsrtEfcUploadItm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridRsrtEfcUploadItm.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 - Skewness jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2022. 01. 04.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2022. 01. 04. 최초작성
*/
function initGridSkewItm(){
    
    var fieldsArr = getGridSkewFields(1);
    //var headerRowArr = getGridHederRow();
    
    var gridObjectSkewItm = new ComJsGrid({
        id: "skewItm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectSkewItm.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 - 보정후 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 26. 최초작성
*/
function initGridSkewUploadItm(){
    
    var fieldsArr = getGridSkewFields(2);
    //var headerRowArr = getGridHederRow();
    
    var gridObjectSkewUploadItm = new ComJsGrid({
        id: "skewUploadItm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectSkewUploadItm.gridCreate();
}

/////////////////////////////////////////////
/**
* @설명: 해지율 - 산출적용 - 무저해지형 해지율 4.비교결과 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2022. 01. 04.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2022. 01. 04. 최초작성
*/
function initGridComprRst1Itm(){
    
//    var fieldsArr = getGridSkewFields(1);
    var fieldsArr = getGridComprFields(1);
    //var headerRowArr = getGridHederRow();
    
    var gridObjectCompr1Itm = new ComJsGrid({
        id: "compr1Itm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectCompr1Itm.gridCreate();
}
/**
* @설명: 해지율 - 산출적용 - 무저해지형 해지율 4.비교결과 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2022. 01. 04.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2022. 01. 04. 최초작성
*/
function initGridComprRst2Itm(){
    
//    var fieldsArr = getGridSkewFields(1);
    var fieldsArr = getGridComprFields(2);
    //var headerRowArr = getGridHederRow();
    
    var gridObjectCompr2Itm = new ComJsGrid({
        id: "compr2Itm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectCompr2Itm.gridCreate();
}
/**
* @설명: 해지율 - 산출적용 - 무저해지형 해지율 4.비교결과 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2022. 01. 04.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2022. 01. 04. 최초작성
*/
function initGridComprRst3Itm(){
    
//    var fieldsArr = getGridSkewFields(1);
    var fieldsArr = getGridComprFields(3);
    //var headerRowArr = getGridHederRow();
    
    var gridObjectCompr3Itm = new ComJsGrid({
        id: "compr3Itm",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectCompr3Itm.gridCreate();
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 헤더 생성하여 리턴
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 20
 * @최종변경일: 
 * @매개변수:
 * @반환값: $result : 그리드헤더
 * @개정이력: 
 *  김광섭 2026. 5. 20 최초작성
 *  
 */
function getRsrtEfcHeader(type) {

    var $result = $("<tr>").height(0);
    //현재적용BE 열
    for(var i=0; i<7; i++) {
        $result.append($("<th>").width(150))
    }
    //현재적용BE 열
    for(var i=0; i<15; i++) {
        $result.append($("<th>").width(120))
    }
    
    var selAplcBeNm = $("#ibx_aplcBeNm").val();
    if (type=="1") {  //2.보정과정-1차보정후해지율
    	$result = $result.add($("<tr class='jsgrid-header-row'>")
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("해지율산출구분"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("BLOCK"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입상태"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("채널유형"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("상품유형"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입중환급금비율"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입후환급금비율"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입기간"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("매핑KEY"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1차보정(매핑)"))
                
//        );
//        var $result1 = $("<tr class='jsgrid-header-row'>")
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("2차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("3차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("4차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("5차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("6차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("7차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("8차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("9차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("10차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("11차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("12차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("13차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("14차년"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("15차년"))
    	);
    	
    } else {
//      if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") != true) {
          $result = $result.add($("<tr class='jsgrid-header-row'>")
                  .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("해지율산출구분"))
                  .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입중환급금비율"))
                  .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입후환급금비율"))
                  .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("BLOCK"))
                  .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입유형"))
                  .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("채널유형"))
                  .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("상품유형"))
                  .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(selAplcBeNm+" "))
//          );
//          var $result1 = $("<tr class='jsgrid-header-row'>")
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("2차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("3차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("4차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("5차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("6차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("7차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("8차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("9차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("10차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("11차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("12차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("13차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("14차년"))
          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("15차년"))
//          .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전체"))
          );
    }
    
//    $result = $result.add($result1);
    
    return $result;
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
function checkCond(val) {
	
	//적용BE체크
	if(gReqParam.aplcBeNm != $('#ibx_aplcBeNm').val()) {
		return false;
	}
	
	// 조회조건체크
	if(gReqParam.rscRatCombo != gRscRatCombo) {
		return false;
	}
	if (val == 1){
//		//직전년도BE체크
//		if(gReqParam.jsBfrYear != gCondJsBfrYear) {
//			return false;
//		}
//		//원오프체크
//		if(gReqParam.oneoffCheck != gCondOneoffCheck) {
//			return false;
//		}
//		// 집계기준체크
//		if(gReqParam.smupStnd != gSmupStnd) {
//			return false;
//		}
	} else if (val == 2){
//		//직전년도BE체크
//		if(gReqParam.jsBfrYear != gCondJsBfrYear) {
//			return false;
//		}
		// 조회조건체크
		if(gReqParam.rscRatCombo != gRscRatCombo) {
			return false;
		}
	} else {
//		// 조회조건체크
//		if(gReqParam.smupStnd != gSmupStnd) {
//			return false;
//		}
	}
    return true;
}

/**
 * @설명: 보정전 산출결과 Grid 조회
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 26 최초작성
 */
function selectProdAplcList(){
    if(gRscRatCombo == "basRscRat") { //기본해지율
        $("#div_hide").show();
        $("#div_show").hide();
        $("#div_skew").hide();
        $("#div_compr").hide();
    } else if(gRscRatCombo == "rtfCors") { //보정과정
        $("#div_hide").hide();
        $("#div_show").show();
        $("#div_skew").hide();
        $("#div_compr").hide();
    } else if(gRscRatCombo == "prodRsrt") { //산출결과
        $("#div_hide").hide();
        $("#div_show").hide();
        $("#div_skew").show();
        $("#div_compr").hide();
    } else { //비교결과
    	$("#div_hide").hide();
        $("#div_show").hide();
        $("#div_skew").hide();
        $("#div_compr").show();
    }
    
    // 조회에 필요한 값을 셋팅
    gReqParam.aplcBeNm = $("#ibx_aplcBeNm").val(); //적용BE 
    gReqParam.befAplcBeNm = (gReqParam.aplcBeNm.substr(0,4)-1)+"BE";
    gReqParam.rscRatCombo = gRscRatCombo;
    
    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd147m/selectNhvLowBscRscList.do")
    .done(function(data) {
        if(gRscRatCombo=="basRscRat") {
            // 그리드 초기화
            resetGrid();
            reDrawGrid();
            //그리드 바인딩
            var rtfBfcListData = data.rtfBfcList;
            var rtfAfcListData = data.rtfAfcList;
            var reprLstListData = data.reprLstList;
            // 0건 그리드 메세지 처리부분
            if(rtfBfcListData && rtfBfcListData.length == 0) {
                $.fn.getReturnValue("gridDivRtfBfc");
            } else {
                $("#gridDivRtfBfc").jsGrid("loadData", rtfBfcListData);
            }
            if(rtfAfcListData && rtfAfcListData.length == 0) {
                $.fn.getReturnValue("gridDivRtfAfc");
            } else {
                $("#gridDivRtfAfc").jsGrid("loadData", rtfAfcListData);
            }
            if(reprLstListData && reprLstListData.length == 0) {
                $.fn.getReturnValue("gridDivReprLst");
            } else {
                $("#gridDivReprLst").jsGrid("loadData", reprLstListData);
            }
        } else if (gRscRatCombo == "rtfCors"){
            // 그리드 초기화
            resetGrid2();
            reDrawGrid2();
            var rsrtEfc = data.rsrtEfc;
            var incrEfc = data.incrEfc;
            var rsrtEfcUp = data.rsrtEfcUp;
//            var incrEfcUp = data.incrEfcUp;
            
            if(rsrtEfc.length == 0) {
                $.fn.getReturnValue("rsrtEfcItm");
            } else {
                $("#rsrtEfcItm").jsGrid("loadData", rsrtEfc);
            }
            if(incrEfc.length == 0) {
                $.fn.getReturnValue("incrEfcItm");
            } else {
                $("#incrEfcItm").jsGrid("loadData", incrEfc);
            }
            if(rsrtEfcUp.length == 0) {
                $.fn.getReturnValue("rsrtEfcUploadItm");
            } else {
                $("#rsrtEfcUploadItm").jsGrid("loadData", rsrtEfcUp);
            }
//            if(incrEfcUp.length == 0) {
//                $.fn.getReturnValue("incrEfcUploadItm");
//            } else {
//                $("#incrEfcUploadItm").jsGrid("loadData", incrEfcUp);
//            }
        } else if (gRscRatCombo == "prodRsrt") {
            // 그리드 초기화
            resetGrid3();
            reDrawGrid3();
            var rsrtEfc = data.rsrtEfc;
            var incrEfc = data.incrEfc;
//            var rsrtEfcUp = data.rsrtEfcUp;
//            var incrEfcUp = data.incrEfcUp;
            
            if(rsrtEfc.length == 0) {
                $.fn.getReturnValue("skewItm");
            } else {
                $("#skewItm").jsGrid("loadData", rsrtEfc);
            }
            if(incrEfc.length == 0) {
                $.fn.getReturnValue("skewUploadItm");
            } else {
                $("#skewUploadItm").jsGrid("loadData", incrEfc);
            }
//            if(rsrtEfcUp.length == 0) {
//                $.fn.getReturnValue("rsrtEfcUploadItm");
//            } else {
//                $("#rsrtEfcUploadItm").jsGrid("loadData", rsrtEfcUp);
//            }
//            if(incrEfcUp.length == 0) {
//                $.fn.getReturnValue("incrEfcUploadItm");
//            } else {
//                $("#incrEfcUploadItm").jsGrid("loadData", incrEfcUp);
//            }
        } else {
        	resetGrid4();
            reDrawGrid4();
            
            var rsrtEfc = data.rsrtEfc;
            var incrEfc = data.incrEfc;
            var rsrtEfcUp = data.rsrtEfcUp;
//            var incrEfcUp = data.incrEfcUp;
            
            if(rsrtEfc.length == 0) {
                $.fn.getReturnValue("compr1Itm");
            } else {
                $("#compr1Itm").jsGrid("loadData", rsrtEfc);
            }
            if(incrEfc.length == 0) {
                $.fn.getReturnValue("compr2Itm");
            } else {
                $("#compr2Itm").jsGrid("loadData", incrEfc);
            }
            if(rsrtEfcUp.length == 0) {
                $.fn.getReturnValue("compr3Itm");
            } else {
                $("#compr3Itm").jsGrid("loadData", rsrtEfcUp);
            }
//            if(incrEfcUp.length == 0) {
//                $.fn.getReturnValue("compr4Itm");
//            } else {
//                $("#compr4Itm").jsGrid("loadData", incrEfcUp);
//            }
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectMsgStatListByKeywords !!");
    });
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 26 최초작성
 */
function resetGrid() {
    //보정전 산출결과 
    $("#gridDivRtfBfc").jsGrid("reset");
    $("#gridDivRtfBfc").jsGrid("option", "data", []);
    //대표종국납기
    $("#gridDivReprLst").jsGrid("reset");
    $("#gridDivReprLst").jsGrid("option", "data", []);
    //보정후 산출결과 
    $("#gridDivRtfAfc").jsGrid("reset");
    $("#gridDivRtfAfc").jsGrid("option", "data", []);
}

/**
 * @설명: 그리드 데이터 초기화(2.보정과정)
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2026. 5. 09 최초작성
 */
function resetGrid2() {
    //유보산출결과 
    $("#rsrtEfcItm").jsGrid("reset");
    $("#rsrtEfcItm").jsGrid("option", "data", []);
    //증가산출결과 
    $("#incrEfcItm").jsGrid("reset");
    $("#incrEfcItm").jsGrid("option", "data", []);
    //유보업로드
    $("#rsrtEfcUploadItm").jsGrid("reset");
    $("#rsrtEfcUploadItm").jsGrid("option", "data", []);
}

/**
 * @설명: 그리드 데이터 초기화(Skewness)
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2026. 5. 04 최초작성
 */
function resetGrid3() {
    //유보산출결과 
    $("#skewItm").jsGrid("reset");
    $("#skewItm").jsGrid("option", "data", []);
    //업로드
    $("#skewUploadItm").jsGrid("reset");
    $("#skewUploadItm").jsGrid("option", "data", []);
}

/**
 * @설명: 그리드 데이터 초기화(4.비교결과)
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2026. 5. 04 최초작성
 */
function resetGrid4() {
    $("#compr1Itm").jsGrid("reset");
    $("#compr1Itm").jsGrid("option", "data", []);
    $("#compr2Itm").jsGrid("reset");
    $("#compr2Itm").jsGrid("option", "data", []);
    $("#compr3Itm").jsGrid("reset");
    $("#compr3Itm").jsGrid("option", "data", []);
}
/**
 * @설명: 그리드 리로드
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 8 최초작성
 */
function reDrawGrid() {
    //그리드 destroy
    $("#gridDivRtfBfc").jsGrid("destroy");
    $("#gridDivReprLst").jsGrid("destroy");
    $("#gridDivRtfAfc").jsGrid("destroy");
    //그리드 create
    initGridRtfBfc();
    initGridReprLst();
    initGridRftAfc();
}

/**
 * @설명: 그리드 리로드 (유보증가)
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2026. 5. 09 최초작성
 */
function reDrawGrid2() {
    //그리드 destroy
    $("#incrEfcItm").jsGrid("destroy");
    $("#rsrtEfcItm").jsGrid("destroy");
    $("#rsrtEfcUploadItm").jsGrid("destroy");
    //그리드 create
    initGridRsrtEfcItm();
    initGridIncrEfcItm();
    initGridRsrtEfcUploadItm();
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 4
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 4 최초작성
 */
function reDrawGrid3() {
    //그리드 destroy
    $("#skewItm").jsGrid("destroy");
    $("#skewUploadItm").jsGrid("destroy");
    //그리드 create
    initGridSkewItm();
    initGridSkewUploadItm();
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 4
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 4 최초작성
 */
function reDrawGrid4() {
    //그리드 destroy
    $("#compr1Itm").jsGrid("destroy");
    $("#compr2Itm").jsGrid("destroy");
    $("#compr3Itm").jsGrid("destroy");
    //그리드 create
    initGridComprRst1Itm();
    initGridComprRst2Itm();
    initGridComprRst3Itm();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김광섭 2026. 5. 8 최초작성
 */
function getGridSkewFields(num) {
	//console.log("num == " + num);
	var selAplcBeNm = $("#ibx_aplcBeNm").val();
	var codeArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
	//코드 목록
    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
    var resultArr = [];
    if (num==1) {
    	resultArr = [
            { name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                	var codeArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
                    for(i=0; i<codeArr.length; i++) {
                        if(value == codeArr[i].code) {
                            return codeArr[i].codeAbbrNm;
                        }
                    }
                }
            },
            { name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 150, align:"center", 
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.padAftRefndRtoVal == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else if (value==null || value=='') {
                        return value;
                    } else if (value==1) {
                        return 'NEW';
                    } else if (value==2) {
                        return 'OLD';
                    }
                }
            },
            { name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 150, align:"center", 
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.beBlkScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else if (value==null || value=='') {
                        return value;
                    } else {
                        for(i=0; i<fpayYnScCdArr.length; i++) {
                            if(value == fpayYnScCdArr[i].code) {
                                return fpayYnScCdArr[i].codeNm;
                            }
                        }
                    }
                }
            },
            { name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 150, align:"center", 
            	itemTemplate:function(value, item) {
            		var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
            		
            		if(value=='ZZ') {
                      if(item.beFpayYnScCd == 'ZZ') {
                          return '';
                      }
                      return 'TOTAL';
            		} else if (value==null || value=='') {
                      return value;
            		} else {
            			for(var i=0; i<tmpCodeDataList.length; i++) {
            				var tmpCode = tmpCodeDataList[i];
            				if (tmpCode.code == value){
            					return tmpCode.codeNm;
            				}
            			}
            		}
            	}
            },
            { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 150, align:"center", 
            	itemTemplate:function(value, item) {
            		var tmpCodeDataList = $._commonObj["code"]["BE_NEW_LOB_CD"];
            		//TOTAL 항목 표시 및 NULL처리
            		if(value=='ZZ') {
                      if(item.beFpayYnScCd == 'ZZ') {
                          return '';
                      }
                      return 'TOTAL';
            		} else {
            			for(var i=0; i<tmpCodeDataList.length; i++) {
            				var tmpCode = tmpCodeDataList[i];
            				if (tmpCode.code == value){
            					//return tmpCode.codeNm;
            					return tmpCode.codeAbbrNm;
            				}
            			}
            		}
            	}
            },
            { name: "dupayRefndRtoVal", title:"납입중환급금비율", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.rscRatProdScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
            },
            { name: "padAftRefndRtoVal", title:"납입후환급금비율", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.dupayRefndRtoVal == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
            },
            { name: "reprPadPrd", title:"납입기간", css:"cell", type: "select",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		//console.log("납입기간 value=" + value);
            		//console.log("납입기간 item=" + item);
            		//대표납입기간
//            		if(gRscRatCombo == 'basRscRat') {
//            			return $.fn.isEmpty(value) ? "납기 통합산출" : value + "년납";
//            		} else if(gRscRatCombo == 'inhvLowRsc') {
            			return $.fn.isEmpty(value) ? "" : (value=="99") ? "납기 통합산출": Number(value) + "년납";
//            		} else {
//            			return $.fn.isEmpty(value) ? "납기 통합산출" : value + "년납";
//            		}
            	}
            }
        ];

        var field = {name:"logAsptnInpSlnVal", title:"a(로그-선형_기울기)", css:"cell", type:"text", width:130, align:"right", sorter:"number",
                itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
        }
        resultArr.push(field);
        
        var field = {name:"logAsptnInpConstVal", title:"b(로그-선형_절편)", css:"cell", type:"text", width:130, align:"right", sorter:"number",
                itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
        }
        resultArr.push(field);
    } else if (num==2) {
    	var resultArr = [
    		{name:"beDsmtKey", title:"Original KEY(FAC코드)", css:"cell", type:"text", width:160, align:"right",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    		},
    		{name:"beMapnKey", title:"Mapping KEY(FAC코드)", css:"cell", type:"text", width:160, align:"right",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    		}
    		];
    }
    
    var colNm = "psgYys";
	var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15"];
	var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15"];
	var fieldsArr = getPsgMntFieldsArr(targetArr, titleArr, colNm);
	resultArr = resultArr.concat(fieldsArr);
	
	return resultArr;
}


/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김광섭 2026. 5. 8 최초작성
 */
function getGridComprFields(num) {
	var selAplcBeNm = $("#ibx_aplcBeNm").val();
	var codeArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
	//코드 목록
    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");

    var resultArr = [
        { name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
            	var codeArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
                for(i=0; i<codeArr.length; i++) {
                    if(value == codeArr[i].code) {
                        return codeArr[i].codeAbbrNm;
                    }
                }
            }
        },
        { name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 150, align:"center", 
            itemTemplate:function(value, item) {
                if(value=='ZZ') {
                    if(item.padAftRefndRtoVal == 'ZZ') {
                        return '';
                    }
                    return 'TOTAL';
                } else if (value==null || value=='') {
                    return value;
                } else if (value==1) {
                    return 'NEW';
                } else if (value==2) {
                    return 'OLD';
                }
            }
        },
        { name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 150, align:"center", 
            itemTemplate:function(value, item) {
                if(value=='ZZ') {
                    if(item.beBlkScCd == 'ZZ') {
                        return '';
                    }
                    return 'TOTAL';
                } else if (value==null || value=='') {
                    return value;
                } else {
                    for(i=0; i<fpayYnScCdArr.length; i++) {
                        if(value == fpayYnScCdArr[i].code) {
                            return fpayYnScCdArr[i].codeNm;
                        }
                    }
                }
            }
        },
        { name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 150, align:"center", 
        	itemTemplate:function(value, item) {
        		var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
        		
        		if(value=='ZZ') {
                  if(item.beFpayYnScCd == 'ZZ') {
                      return '';
                  }
                  return 'TOTAL';
        		} else if (value==null || value=='') {
                  return value;
        		} else {
        			for(var i=0; i<tmpCodeDataList.length; i++) {
        				var tmpCode = tmpCodeDataList[i];
        				if (tmpCode.code == value){
        					return tmpCode.codeNm;
        				}
        			}
        		}
        	}
        },
        { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 150, align:"center", 
        	itemTemplate:function(value, item) {
        		var tmpCodeDataList = $._commonObj["code"]["BE_NEW_LOB_CD"];
        		//TOTAL 항목 표시 및 NULL처리
        		if(value=='ZZ') {
                  if(item.beFpayYnScCd == 'ZZ') {
                      return '';
                  }
                  return 'TOTAL';
        		} else {
        			for(var i=0; i<tmpCodeDataList.length; i++) {
        				var tmpCode = tmpCodeDataList[i];
        				if (tmpCode.code == value){
        					//return tmpCode.codeNm;
        					return tmpCode.codeAbbrNm;
        				}
        			}
        		}
        	}
        },
        { name: "dupayRefndRtoVal", title:"납입중환급금비율", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value=='ZZ') {
                    if(item.rscRatProdScCd == 'ZZ') {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                    return value;
                }
            }
        },
        { name: "padAftRefndRtoVal", title:"납입후환급금비율", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
                if(value=='ZZ') {
                    if(item.dupayRefndRtoVal == 'ZZ') {
                        return '';
                    }
                    return 'TOTAL';
                } else {
                    return value;
                }
            }
        },
        { name: "reprPadPrd", title:"납입기간", css:"cell", type: "select",  width: 120, align:"center",
        	itemTemplate:function(value, item) {
        		//console.log("납입기간 value=" + value);
        		//console.log("납입기간 item=" + item);
        		//대표납입기간
//        		if(gRscRatCombo == 'basRscRat') {
//        			return $.fn.isEmpty(value) ? "납기 통합산출" : value + "년납";
//        		} else if(gRscRatCombo == 'inhvLowRsc') {
        			return $.fn.isEmpty(value) ? " " : (value=="99") ? "납기 통합산출": Number(value) + "년납";
//        		} else {
//        			return $.fn.isEmpty(value) ? "납기 통합산출" : value + "년납";
//        		}
        	}
        }
    ];
    
    if (num==3||num==4) {
        var field = {name:"comprKey", title:"비교할 KEY", css:"cell", type:"text", width:130, align:"right",
                itemTemplate:function(value, item) {
                    //return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    return $.fn.isEmpty(value) ? "" : value;
                }
        }
        resultArr.push(field);
    }
    //console.log("resultArr===" + resultArr);
    
    if (num==3) {
        var colNm = ["apsgYys", "bpsgYys", "cpsgYys"];
    	var targetArr = ["apsgYys1", "apsgYys2", "apsgYys3", "apsgYys4", "apsgYys5", "apsgYys6", "apsgYys7","apsgYys8", "apsgYys9", "apsgYys10", "apsgYys11","apsgYys12","apsgYys13","apsgYys14","apsgYys15"
    		            ,"bpsgYys1", "bpsgYys2", "bpsgYys3", "bpsgYys4", "bpsgYys5", "bpsgYys6", "bpsgYys7","bpsgYys8", "bpsgYys9", "bpsgYys10", "bpsgYys11","bpsgYys12","bpsgYys13","bpsgYys14","bpsgYys15"
    		            ,"cpsgYys1", "cpsgYys2", "cpsgYys3", "cpsgYys4", "cpsgYys5", "cpsgYys6", "cpsgYys7","cpsgYys8", "cpsgYys9", "cpsgYys10", "cpsgYys11","cpsgYys12","cpsgYys13","cpsgYys14","cpsgYys15"];
    	var titleArr  = ["무저해지형_1", "무저해지형_2", "무저해지형_3", "무저해지형_4", "무저해지형_5", "무저해지형_6", "무저해지형_7","무저해지형_8", "무저해지형_9", "무저해지형_10", "무저해지형_11","무저해지형_12","무저해지형_13","무저해지형_14","무저해지형_15"
    		            ,"무저해지형_비교_1", "무저해지형_비교_2", "무저해지형_비교_3", "무저해지형_비교_4", "무저해지형_비교_5", "무저해지형_비교_6", "무저해지형_비교_7","무저해지형_비교_8", "무저해지형_비교_9", "무저해지형_비교_10", "무저해지형_비교_11","무저해지형_비교_12","무저해지형_비교_13","무저해지형_비교_14","무저해지형_비교_15"
    		            ,"비교_1", "비교_2", "비교_3", "비교_4", "비교_5", "비교_6", "비교_7","비교_8", "비교_9", "비교_10", "비교_11","비교_12","비교_13","비교_14","비교_15"];
    	var fieldsArr = getPsgMntComprFieldsArr(targetArr, titleArr, colNm);
    	resultArr = resultArr.concat(fieldsArr);
    } else {
        var colNm = ["apsgYys", "bpsgYys", "cpsgYys"];
    	var targetArr = ["apsgYys1", "apsgYys2", "apsgYys3", "apsgYys4", "apsgYys5", "apsgYys6", "apsgYys7","apsgYys8", "apsgYys9", "apsgYys10", "apsgYys11","apsgYys12","apsgYys13","apsgYys14","apsgYys15"
    		            ,"bpsgYys1", "bpsgYys2", "bpsgYys3", "bpsgYys4", "bpsgYys5", "bpsgYys6", "bpsgYys7","bpsgYys8", "bpsgYys9", "bpsgYys10", "bpsgYys11","bpsgYys12","bpsgYys13","bpsgYys14","bpsgYys15"
    		            ,"cpsgYys1", "cpsgYys2", "cpsgYys3", "cpsgYys4", "cpsgYys5", "cpsgYys6", "cpsgYys7","cpsgYys8", "cpsgYys9", "cpsgYys10", "cpsgYys11","cpsgYys12","cpsgYys13","cpsgYys14","cpsgYys15"];
    	var titleArr  = ["무저해지형_1", "무저해지형_2", "무저해지형_3", "무저해지형_4", "무저해지형_5", "무저해지형_6", "무저해지형_7","무저해지형_8", "무저해지형_9", "무저해지형_10", "무저해지형_11","무저해지형_12","무저해지형_13","무저해지형_14","무저해지형_15"
    		            ,"표준형_1", "표준형_2", "표준형_3", "표준형_4", "표준형_5", "표준형_6", "표준형_7","표준형_8", "표준형_9", "표준형_10", "표준형_11","표준형_12","표준형_13","표준형_14","표준형_15"
    		            ,"비교_1", "비교_2", "비교_3", "비교_4", "비교_5", "비교_6", "비교_7","비교_8", "비교_9", "비교_10", "비교_11","비교_12","비교_13","비교_14","비교_15"];
    	var fieldsArr = getPsgMntComprFieldsArr(targetArr, titleArr, colNm);
    	resultArr = resultArr.concat(fieldsArr);
    }
    
	return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김광섭 2026. 5. 8 최초작성
 */
function getPsgMntComprFieldsArr(targetArr, titleArr, colNm) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    var resultArr = [];
    for (var i = 0; i < targetArr.length; i++) {
    	var target = targetArr[i];
    	var title = titleArr[i];
    	var distStndValField = { name: target , title: title + "차년", css:"cell", type: "text", width: 150, align:"right", itemTemplate:function(value, item) {
    		return $.fn.isEmpty(value) ? "" : value;//(value*1).toFixed(2);
    	}};
    	resultArr.push(distStndValField);
    }
        
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김광섭 2026. 5. 8 최초작성
 */
function getPsgMntFieldsArr(targetArr, titleArr, colNm) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    var resultArr = [];
    for (var i = 0; i < targetArr.length; i++) {
    	var target = targetArr[i];
    	var title = titleArr[i];
    	var distStndValField = { name: "psgYys" + target , title: titleArr[i] + "차년", css:"cell", type: "text", width: 120, align:"right", itemTemplate:function(value, item) {
    		//console.log("value::::" + value);
    		return value;
    	}};
    	resultArr.push(distStndValField);
    }
        
    return resultArr;
}
/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김광섭 2026. 5. 8 최초작성
 */
function getGridFields(num) {
    
    //코드 목록
    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
    var chnlScCdArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
    //적용BE
    var aplcBeNm = $("#ibx_aplcBeNm").val(); 
    var befAplcBeNm = (aplcBeNm.substr(0,4)-1)+"BE";
    
    //그리드 공통부분 필드
    if(num==2 || num==3 || num==4 || num==5) {
        var resultArr = [
            { name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 120, align:"center",
                itemTemplate:function(value, item) {
                	var codeArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
                    for(i=0; i<codeArr.length; i++) {
                        if(value == codeArr[i].code) {
                            return codeArr[i].codeAbbrNm;
                        }
                    }
                }
            },
            { name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 120, align:"center", 
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.padAftRefndRtoVal == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else if (value==null || value=='') {
                        return value;
                    } else if (value==1) {
                        return 'NEW';
                    } else if (value==2) {
                        return 'OLD';
                    }
                }
            },
            { name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 120, align:"center", 
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.beBlkScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else if (value==null || value=='') {
                        return value;
                    } else {
                        for(i=0; i<fpayYnScCdArr.length; i++) {
                            if(value == fpayYnScCdArr[i].code) {
                                return fpayYnScCdArr[i].codeNm;
                            }
                        }
                    }
                }
            },
            { name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 120, align:"center", 
            	items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "codeNm", valueField: "code",
            	itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.beFpayYnScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else if(value=="77"){
                        return "AR";
                    } else if(value=="87"){
                        return "POOL";
                    } else if(value=="88"){
                        return "기타채널";
                    } else if(value=="98"){
                        return "개인대리점";
                    } else if(value=="99"){
                        return "내근";
                    } else if (value==null || value=='') {
                        return value;
                    } else {
                    	var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
                		
            			for(var i=0; i<tmpCodeDataList.length; i++) {
            				var tmpCode = tmpCodeDataList[i];
            				if (tmpCode.code == value){
            					return tmpCode.codeNm;
            				}
            			}
                    }
                }
            },
            { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 120, align:"center", 
            	itemTemplate:function(value, item) {
            		var tmpCodeDataList = $._commonObj["code"]["BE_NEW_LOB_CD"];
            		//TOTAL 항목 표시 및 NULL처리
            		if(value=='ZZ') {
                      if(item.beFpayYnScCd == 'ZZ') {
                          return '';
                      }
                      return 'TOTAL';
            		} else {
            			for(var i=0; i<tmpCodeDataList.length; i++) {
            				var tmpCode = tmpCodeDataList[i];
            				if (tmpCode.code == value){
            					//return tmpCode.codeNm;
            					return tmpCode.codeAbbrNm;
            				}
            			}
            		}
            	}
            },
            { name: "dupayRefndRtoVal", title:"납입중환급금비율", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.rscRatProdScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
            },
            { name: "padAftRefndRtoVal", title:"납입후환급금비율", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.dupayRefndRtoVal == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
            },
            { name: "reprPadPrd", title:"납입기간", css:"cell", type: "select",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		//console.log("납입기간 value=" + value);
            		//console.log("납입기간 item=" + item);
            		//대표납입기간
//            		if(gRscRatCombo == 'basRscRat') {
//            			return $.fn.isEmpty(value) ? "납기 통합산출" : value + "년납";
//            		} else if(gRscRatCombo == 'inhvLowRsc') {
            			return $.fn.isEmpty(value) ? " " : (value=="99") ? "납기 통합산출": Number(value) + "년납";
//            		} else {
//            			return $.fn.isEmpty(value) ? "납기 통합산출" : value + "년납";
//            		}
            	}
            }
        ];
        if (num==2 || num==3) {
            var field = {name:"assRatRtfMapnKey", title:"매핑KEY", css:"cell", type:"text", width:120, align:"right",
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "" : value;
                    }
            }
            resultArr.push(field);
            
            var field = {name:"assRatRtfMapnExpln", title:"1차보정(매핑)", css:"cell", type:"text", width:120, align:"right",
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "" : value;
                    }
            }
            resultArr.push(field);
        }
        if (num==3) {
            var field = {name:"assRatRtfBrkdnExpln", title:"2차보정(수기보정)", css:"cell", type:"text", width:120, align:"right",
                    itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "" : value;
                    }
            }
            resultArr.push(field);
        }

        var colNm = "psgYys";
        var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12", "13", "14", "15"];
        var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12", "13", "14", "15"];
        var fieldsArr = getPsgNtsFieldsArr(targetArr, titleArr, colNm);
        resultArr = resultArr.concat(fieldsArr);
    } else {
        var resultArr = [
            { name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 120, align:"center",
                itemTemplate:function(value, item) {
                	var codeArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
                    for(i=0; i<codeArr.length; i++) {
                        if(value == codeArr[i].code) {
                            return codeArr[i].codeAbbrNm;
                        }
                    }
                }
            },
            { name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 120, align:"center", 
                itemTemplate:function(value, item) {
                    //TOTAL 항목 표시 및 NULL처리
                    if(value=='ZZ') {
                        if(item.padAftRefndRtoVal == 'ZZZZZZZZZZ') {
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
            },
            { name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 120, align:"center", 
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        if(item.beBlkScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else if (value==null || value=='') {
                        return value;
                    } else {
                        for(i=0; i<fpayYnScCdArr.length; i++) {
                            if(value == fpayYnScCdArr[i].code) {
                                return fpayYnScCdArr[i].codeNm;
                            }
                        }
                    }
                }
            },
            { name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 120, align:"center", 
            	itemTemplate:function(value, item) {
            		var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
            		//TOTAL 항목 표시 및 NULL처리
            		if(value=='ZZ') {
                      if(item.beFpayYnScCd == 'ZZ') {
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
            },
            { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 150, align:"center", 
            	itemTemplate:function(value, item) {
            		var tmpCodeDataList = $._commonObj["code"]["BE_NEW_LOB_CD"];
            		//TOTAL 항목 표시 및 NULL처리
            		if(value=='ZZ') {
                      if(item.beFpayYnScCd == 'ZZ') {
                          return '';
                      }
                      return 'TOTAL';
            		} else {
            			for(var i=0; i<tmpCodeDataList.length; i++) {
            				var tmpCode = tmpCodeDataList[i];
            				if (tmpCode.code == value){
            					//return tmpCode.codeNm;
            					return tmpCode.codeAbbrNm;
            				}
            			}
            		}
            	}
            },
            { name: "dupayRefndRtoVal", title:"납입중환급금비율", css:"cell", type: "select", width: 120, align:"center",
                itemTemplate:function(value, item) {
                    if(value == '' || value == null) {
                        if(item.rscRatProdScCd == 'ZZ') {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
            },
            { name: "padAftRefndRtoVal", title:"납입후환급금비율", css:"cell", type: "select", width: 120, align:"center",
                itemTemplate:function(value, item) {
                    if(value == '' || value == null) {
                        if(item.dupayRefndRtoVal == null || item.dupayRefndRtoVal == '') {
                            return '';
                        }
                        return 'TOTAL';
                    } else {
                        return value;
                    }
                }
            },
            { name: "reprPadPrd", title:"납입기간", css:"cell", type: "select",  width: 120, align:"center",
                    itemTemplate:function(value, item) {
                    	//console.log("납입기간 value=" + value);
                    	//console.log("납입기간 item=" + item);
                    	//대표납입기간
//                    	if(gRscRatCombo == 'basRscRat') {
//                    		return $.fn.isEmpty(value) ? "납기 통합산출" : value + "년납";
//                        } else if(gRscRatCombo == 'inhvLowRsc') {
                        	return $.fn.isEmpty(value) ? " " : (value=="99") ? "납기 통합산출": Number(value) + "년납";
//                        } else {
//                        	return $.fn.isEmpty(value) ? "납기 통합산출" : value + "년납";
//                        }
                    }
            }
        ];
       var colNm = "psgYys";
       var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12", "13", "14", "15"];
       var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12", "13", "14", "15"];
       var fieldsArr = getPsgNtsFieldsArr(targetArr, titleArr, colNm);
       resultArr = resultArr.concat(fieldsArr);
   }
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 경과월 배열 
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김광섭 2026. 5. 8 최초작성
 */
function getPsgNtsFieldsArr(targetArr, titleArr, colNm) {
    if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titleArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: colNm + target , title: titleArr[i] + "차년", css:"cell", type: "text", width: 120, align:"right",// sorter:"number", 
                itemTemplate:function(value, item) {
                    //return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    return $.fn.isEmpty(value) ? "" : value;
                }
        };
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}
/**
 * @설명: 유형의 배열을 기준으로 그리드 헤더 생성하여 리턴
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 28
 * @최종변경일: 
 * @매개변수:
 * @반환값: $result : 그리드헤더
 * @개정이력: 
 *  김광섭 2026. 5. 28 최초작성
 *  
 */
function getGridHederRow() {
    var $result = $("<tr>").height(0);
    //현재적용BE 열
    for(var i=0; i<7; i++) {
        $result.append($("<th>").width(150))
    }
    //현재적용BE 열
    for(var i=0; i<15; i++) {
        $result.append($("<th>").width(120))
    }
    
    var selAplcBeNm = $("#ibx_aplcBeNm").val();
    $result = $result.add($("<tr class='jsgrid-header-row'>")
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("해지율산출구분"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입중환급금비율"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입후환급금비율"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("BLOCK"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입유형"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("채널"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("상품유형"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(selAplcBeNm+" "))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("2차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("3차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("4차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("5차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("6차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("7차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("8차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("9차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("10차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("11차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("12차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("13차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("14차년"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("15차년"))
    );
    
    return $result;
}

function resetAllGrd() {
	resetGrid();
    reDrawGrid();
    resetGrid2();
    reDrawGrid2();
    resetGrid3();
    reDrawGrid3();
    resetGrid4();
    reDrawGrid4();
}