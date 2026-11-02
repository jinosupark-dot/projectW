/**
 * @시스템명: 가정관리
 * @업무명: 해지율 - 산출적용
 * @설명: 해지율 - 산출적용 화면의 JS
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26.
 * @개정이력: 
 *  김광섭 2026. 5. 26. 최초작성
 */
//var condAplcBeNm;
// 업로드 위한 컬럼 양식 (기본해지율)
var gArrCols = [];
//// 업로드 위한 컬럼 양식 (유보)
//var gArrCols2 = [];
//// 업로드 위한 컬럼 양식 (증가)
//var gArrCols3 = [];
//var gArrCols4 = [];
var gTbNm = "TB_IBECRS26";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//조회조건 콤보박스
var rscRatCombo = "basRscRat";
////집계기준구분코드
//var gSmupStnd = "02";
//시뮬레이션 체크
var gCondSmultCheck = "N";
//RSE판단값-시뮬레이션전
var gRseJdgmtValBef="20";
//RSE반영비율
var gRseRfltRtoBef="50";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    $("#btn_smultBatch").prop("disabled", true);
    
    //RSE적용대상기준값 (예 0.2), RSE반영비율(예 0.5)
    //$.fn.getTbDateInfo(serviceCode);
    
    // 공통코드 조회(납입상태, 채널, 상품유형)
    $.fn.loadCommonCode(["RSC_RAT_PROD_SC_CD","BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD","BE_CHNL_SC_CD","BE_BLK_SC_CD"]);

    //적용BE 콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //RSE보정후 산출결과
    initGridRtfBfc();
    
    //매핑후 산출결과
    initGridRftAfc();
    
    //최종 표준형 해지율
    initGridLastBe();

    selectRseJdgmtRfltRtoList();

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
    
    var serviceNm="RSC_RAT_STNRD";//TODO 표준형 시뮬레이션 배치 ID 확인 필요
    
    //시뮬레이션 체크여부
    $("#cbx_smult").on("change", function(e){
    	if ($('input:checkbox[id="cbx_smult"]').is(":checked") == true) {
    		gCondSmultCheck = "Y";
    		$("#rse_smult_bef").hide();
    		$("#rse_smult_aft").show();
    		$("#btn_smultBatch").prop("disabled", false);
    	} else {
    		gCondSmultCheck = "N";
    		$("#rse_smult_bef").show();
    		$("#rse_smult_aft").hide();
    		$("#btn_smultBatch").prop("disabled", true);
    	}
    });
    
    // 조회조건 변경시 그리드 초기화
    $("#sbx_rscRat").on("change", function(e){
        rscRatCombo = $("#sbx_rscRat").val();
        if(rscRatCombo == "stnrd") {
            $("#div_hide").show();
            resetAllGrd();
        }
    });
    
    // 조회
    $('#btn_search').on('click', function(e){
    	//적용BE validation
    	if ($.fn.isEmpty($("#ibx_aplcBeNm").val())) {
    		$.fn.msgBox("적용BE를 입력하세요.", function() {
    			$("#ibx_aplcBeNm").focus();
    		});
    		return;
    	}
        selectProdAplcList();
    });
    
    //RSE보정후산출결과:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download').on('click', function(e){
        if(gCondFlag == "N" || $("#gridDivRtfBfc").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = $(document).find("title").text()+"_"+$("#sbx_rscRat option:selected").text()+"_"+$("#ibx_aplcBeNm").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivRtfBfc',
                sheetName : "RSE보정 후 산출결과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"/*,
                searchCond: $.fn.getSearchCondSub("PROD")*/
            },
            {
                id: 'gridDivRtfBfc',
                sheetName : "RSE보정 후 산출결과(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //매핑후산출결과 엑셀다운
    $('#btn_excel_download2').on('click', function(e){
        if(gCondFlag == "N" || $("#gridDivRtfAfc").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        var arrColsInfo = $.fn.getTbCols(gTbNm);
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        let fileName = $(document).find("title").text()+"_"+$("#sbx_rscRat option:selected").text()+"_"+"매핑 후 산출결과_"+$("#ibx_aplcBeNm").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivRtfAfc',
                sheetName : "매핑 후 산출결과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"/*,
                searchCond: $.fn.getSearchCondSub("PROD")*/
            },
            {
                id: 'gridDivRtfAfc',
                sheetName : "매핑 후 산출결과(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //최종표준형해지율:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $("#btn_excel_download3").on("click", function(e){
        var arrColsInfo = $.fn.getTbCols(gTbNm);
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        //직전년도BE비교 체크
        if(gCondFlag == "N" || $("#gridDivLastBe").jsGrid("option", "fields").length > 20) {
            $.fn.msgBox("조회 후 다운로드 해주세요.");
            return;
        }
        if(!checkCond(2)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        let fileName = $(document).find("title").text()+"_"+$("#sbx_rscRat option:selected").text()+"_"+"최종 표준형 해지율_"+$("#ibx_aplcBeNm").val()+".xlsx";
        $.fn.exportGridExcel({
            id       : 'gridDivLastBe',
            sheetName : "최종 표준형 해지율",
            fileName : fileName
        });
    });
    
    //엑셀업로드 클릭 (기본해지율)
    $("#btn_loadExcel").on("click", function(e){
        if ($("#ibx_aplcBeNm").val().endsWith('BE_F')) {
        	$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
    			$("#ibx_aplcBeNm").focus();
        	});
        	return;
        }
        
        //조회조건 확인
        if(!checkCond(3)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        var arrColsInfo = $.fn.getTbCols(gTbNm);
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);    
        if(gArrCols.length == 0) {
            $.fn.msgBox("최종 표준형 해지율을 다운로드한 후 엑셀업로드를 해주세요.");
            return;
        }
        
        var paramObj = {};
        
        paramObj.id = "gridDivLastBe";//"skewUploadItm";                  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols;
                        data["aplcBeNm"] = $("#ibx_aplcBeNm").val();
//                        data["smupStnd"] = gSmupStnd;
//                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd142m/saveSkewBeList.do')
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd146m/saveStnrdRtfCdList.do')
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
    
    //시뮬레이션
    $("#btn_smultBatch").on("click", function(e){

        if ($("#ibx_aplcBeNm").val().endsWith('BE_F')) {
        	$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
        	    $("#ibx_aplcBeNm").focus();
        	});
        	return;
        }
        
    	var reqParam = {};

        if(gCondSmultCheck != "Y") {
        	return;
        }
        /*if ($("#rseJdgmtValBef").val() == $("#rseJdgmtValAft").val()
        		&& $("#rseRfltRtoBef").val() == $("#rseRfltRtoAft").val()) {
        	$.fn.msgBox("RSE판단값, RSE반영비율이 동일합니다.");
        	return;
        }*/
        
        //시뮬레이션
        reqParam.smultYn = gCondSmultCheck;
        //적용BE
        reqParam.aplcBeNm = $("#ibx_aplcBeNm").val();
        //RSE판단값
        reqParam.rseJdgmtValAft = $("#rseJdgmtValAft").val();
        //RSE반영비율
        reqParam.rseRfltRtoAft = $("#rseRfltRtoAft").val();
        
        reqParam.batName=serviceNm;
        //DUMMY
        reqParam.batStrYm  = "";
        reqParam.batFinYm  = "";
        reqParam.hierarchy = "";
        reqParam.oneOff    = "";
        
        $.fn.msgBox('시뮬레이션을 실행하시겠습니까?', function (obj) {
        	if (obj.btn_ok) {
        		$.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
        		.done(function(data) {
        			console.log("data===" + data);
        			if(data.result == '0') {
        				//setTimeout(function() {
        				//	selectProdAplcList();
        		        //}, 6000);
        				//resetGrid();
        				$.fn.msgBox('시뮬레이션 배치가 성공했습니다.');
        			} else if(data.result == '1') {
        				$.fn.msgBox('시뮬레이션 배치 호출에 실패했습니다.');
        			} else {
        				console.log("data===" + data);
        			}
        		}).fail(function(data){
        			$.fn.msgBox('시뮬레이션 배치가 실패했습니다.');
        		});
        	}
        }, 2);
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
* @설명: 해지율 - 산출적용 - RSE보정후 산출결과 jsGrid 빈 테이블 생성 
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
    var headerRowArr = getGridHederRow();
    
    var gridObjectRtfBfc = new ComJsGrid({
        id: "gridDivRtfBfc",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRtfBfc.gridCreate();
}

/**
* @설명: 해지율 - 산출적용 - 매핑후 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 26. 최초작성
*/
function initGridRftAfc(){
    
    var fieldsArr = getGridFields(4);
    var headerRowArr = getGridHederRow(4);
    
    var gridObjectRftAfc = new ComJsGrid({
        id: "gridDivRtfAfc",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRftAfc.gridCreate();
}

/**
 * @설명: 해지율 - 산출적용 - 최종표준형 해지율 jsGrid 빈 테이블 생성 
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  김광섭 2026. 5. 26. 최초작성
 */
function initGridLastBe(){
    
    var fieldsArr = getGridFields(4);
    var headerRowArr = getGridHederRow(4);
    
    var gridObjectLastBe = new ComJsGrid({
        id: "gridDivLastBe",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectLastBe.gridCreate();
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
	var $result = $("<tr class='jsgrid-header-row'>");
	$result.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("해지율산출구분"))
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("BLOCK"))
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입상태"))
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("채널유형"))
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("상품유형"))
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입중환급금비율값"))
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입후환급금비율값"))
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입기간"))
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("산출항목"))
	var $result1 = $("<tr class='jsgrid-header-row'>");
	for(var i=0; i<3; i++) {
		$result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율1"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율2"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율3"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text(txt+"효과조정율4"));
	}
	$result = $result.add($result1);
    
    return $result;
}

/**
* @설명: 조회시 조건, 현재 조건 체크 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 28.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 28. 최초작성
*/
function checkCond(val) {
	
	//적용BE체크
	if(gReqParam.aplcBeNm != $('#ibx_aplcBeNm').val()) {
		return false;
	}
	
	// 조회조건체크
	if(gReqParam.rscRatCombo != rscRatCombo) {
		return false;
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
	if(rscRatCombo == "stnrd") { //표준형 해지율
        $("#div_hide").show();
    } 
    
	//시뮬레이션
	gReqParam.smultYn = gCondSmultCheck;
    // 조회에 필요한 값을 셋팅
    gReqParam.aplcBeNm = $("#ibx_aplcBeNm").val(); //적용BE 
//    gReqParam.befAplcBeNm = (gReqParam.aplcBeNm.substr(0,4)-1)+"BE";
    gReqParam.rscRatCombo = rscRatCombo;
    if (gCondSmultCheck == "Y") {
    	gReqParam.aplcBeNmSmult = (gReqParam.aplcBeNm.substr(0,4))+"S1";
    }
    
    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd146m/selectProdAplcList.do")
    .done(function(data) {
        if(rscRatCombo=="basRscRat") {
            // 그리드 초기화
            resetGrid();
            reDrawGrid();
            //그리드 바인딩
            var rtfBfcListData = data.rtfBfcList;
            var rtfAfcListData = data.rtfAfcList;
            var lastBeListData = data.lastBeList;
            // 0건 그리드 메세지 처리부분
            if(rtfBfcListData == null || rtfBfcListData.length == 0) {
                $.fn.getReturnValue("gridDivRtfBfc");
            } else {
                $("#gridDivRtfBfc").jsGrid("loadData", rtfBfcListData);
            }
            if(rtfAfcListData == null || rtfAfcListData.length == 0) {
                $.fn.getReturnValue("gridDivRtfAfc");
            } else {
                $("#gridDivRtfAfc").jsGrid("loadData", rtfAfcListData);
            }
            if(lastBeListData == null || lastBeListData.length == 0) {
                $.fn.getReturnValue("gridDivLastBe");
            } else {
                $("#gridDivLastBe").jsGrid("loadData", lastBeListData);
            }
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectMsgStatListByKeywords !!");
    });
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
function selectRseJdgmtRfltRtoList(){
    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd146m/selectRseJdgmtRfltRtoList.do")
    .done(function(data) {
        var rseJdgmtRfltRtoList = data.rseJdgmtRfltRtoList;
        //console.log(rseJdgmtRfltRtoList);
        //console.log("rseJdgmtVal:" + rseJdgmtRfltRtoList[0]['rseJdgmtVal']);
        // 0건 그리드 메세지 처리부분
        if (rseJdgmtRfltRtoList && rseJdgmtRfltRtoList.length > 0) {
        	$("#rseJdgmtValBef").val = rseJdgmtRfltRtoList[0]['rseJdgmtVal'];
        	$("#rseRfltRtoBef").val = rseJdgmtRfltRtoList[0]['rseRfltRto'];
        } else {
        	$("#rseJdgmtValBef").val = "";
        	$("#rseRfltRtoBef").val = "";
        }
        //gCondFlag = "Y";
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
    //보정후 산출결과 
    $("#gridDivRtfAfc").jsGrid("reset");
    $("#gridDivRtfAfc").jsGrid("option", "data", []);
    //최종BE 적용결과
    $("#gridDivLastBe").jsGrid("reset");
    $("#gridDivLastBe").jsGrid("option", "data", []);
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
    $("#gridDivRtfAfc").jsGrid("destroy");
    $("#gridDivLastBe").jsGrid("destroy");
    //그리드 create
    initGridRtfBfc();
    initGridRftAfc();
    initGridLastBe();
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
//    var befAplcBe = (aplcBe.substr(0,4)-1)+"BE";
    
    //그리드 공통부분 필드
    if(num==4 || num==5) {
        var resultArr = [
            { name: "beDsmtKey", title:"Original Key", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
//                    if(value=='ZZ') {
//                        return 'TOTAL';
//                    } else if (value==null || value=='') {
//                        return value;
//                    } else {
//                        return $._commonObj["code"]["RSC_RAT_PROD_SC_CD"][value-1].codeNm;
//                    }
                    return value;
                }
            },
            { name: "beMapnKey", title:"Mapping Key", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
//                    if(value=='ZZ') {
//                        if(item.rscRatProdScCd == 'ZZ') {
//                            return '';
//                        }
//                        return 'TOTAL';
//                    } else {
//                        return value;
//                    }
                    return value;
                }
            },
//            { name: "stnrdRscRatRtfCd", title:"가정 구분단위", css:"cell", type: "select", width: 150, align:"center",
//                itemTemplate:function(value, item) {
//                    if(value=='ZZ') {
//                        if(item.dupayRefndRtoVal == 'ZZ') {
//                            return '';
//                        }
//                        return 'TOTAL';
//                    } else {
//                        return value;
//                    }
//                }
//            },
            { name: "stnrdRscRatRtfCd", title:"보정코드", css:"cell", type: "select", width: 150, align:"center", 
                itemTemplate:function(value, item) {
//                    if(value=='ZZ') {
//                        if(item.padAftRefndRtoVal == 'ZZ') {
//                            return '';
//                        }
//                        return 'TOTAL';
//                    } else if (value==null || value=='') {
//                        return value;
//                    } else if (value==1) {
//                        return 'NEW';
//                    } else if (value==2) {
//                        return 'OLD';
//                    }
                    return value;
                }
            },
            { name: "assRatRtfBrkdnExpln", title:"보정사유", css:"cell", type: "select", width: 150, align:"center", 
            	itemTemplate:function(value, item) {
//            		if(value=='ZZ') {
//            			if(item.beChnlScCd == 'ZZ') {
//            				return '';
//            			}
//            			return 'TOTAL';
//            		} else if (value==null || value=='') {
//            			return value;
//            		} else {
//            			return $._commonObj["code"]["STNRD_RSC_RAT_RTF_CD"][value*1].codeAbbrNm;
//            		}
//            		return textField;
            		return value;
            	}
            }
        ];
    } else {
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
            { name: "dupayRefndRtoVal", title:"납입중환급금비율값", css:"cell", type: "select", width: 150, align:"center",
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
            { name: "padAftRefndRtoVal", title:"납입후환급금비율값", css:"cell", type: "select", width: 150, align:"center",
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
            { name: "padPrd", title:"납입기간", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
                	if ($.fn.isEmpty(value)) {
                		return "";
                	} else {
                		if (value == "99") {
                			return "납기 통합산출";
                		} else {
                			return "";
                		}
                	}
                }
            },
            { name: "prodNm", title:"산출항목", css:"cell", type: "select", width: 150, align:"center", 
            	itemTemplate:function(value, item) {
                	return $.fn.isEmpty(value) ? "" : value;
//            		var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
//            		//TOTAL 항목 표시 및 NULL처리
//            		if(value=='ZZ') {
//                      if(item.beFpayYnScCd == 'ZZ') {
//                          return '';
//                      }
//                      return 'TOTAL';
//            		} else {
//            			for(var i=0; i<tmpCodeDataList.length; i++) {
//            				var tmpCode = tmpCodeDataList[i];
//            				if (tmpCode.code == value){
//            					return tmpCode.codeNm;
//            				}
//            			}
//            		}
            	}
            }
        ];
   }
    var colNm = "psgYys";
    var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12", "13", "14", "15"];
    var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12", "13", "14", "15"];
    var fieldsArr = getPsgNtsFieldsArr(targetArr, titleArr, colNm, aplcBeNm);
    resultArr = resultArr.concat(fieldsArr);

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
function getPsgNtsFieldsArr(targetArr, titleArr, colNm, aplcBeNm) {
    if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titleArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: colNm + target , title: titleArr[i] + "차년", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
        //var distStndValField = { name: colNm + target , title: aplcBeNm + titleArr[i] + "차년", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
                itemTemplate:function(value, item) {
                	/*console.log("차년별 value=" + value);
                	console.log("차년별 item=" + item.cd);*/
                	if(item.cd == '2') {
                		return (value=="1")?"대상":"비대상";
                	} else {
                		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                	}
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
function getGridHederRow(num) {
	var $result = $("<tr class='jsgrid-header-row'>");
    if (num == 4) {
    	$result.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("Original Key"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("Mapping Key"))
    	//.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("가정 구분단위"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("보정코드"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("보정사유"));
    } else {
    	$result.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("해지율산출구분"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("BLOCK"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("납입상태"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("채널유형"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("상품유형"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("납입중환급금비율값"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("납입후환급금비율값"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("납입기간"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("산출항목"));
    }
	
	$result.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("1차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("2차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("3차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("4차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("5차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("6차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("7차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("8차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("9차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("10차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("11차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("12차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("13차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("14차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("15차년"));
	
    return $result;
}

function resetAllGrd() {
	resetGrid();
    reDrawGrid();
    resetGrid2();
    reDrawGrid2();
    resetGrid3();
    reDrawGrid3();
}