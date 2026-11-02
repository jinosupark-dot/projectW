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
// 업로드 위한 컬럼 양식 (유보효과산출결과)
var gArrCols = [];
// 업로드 위한 컬럼 양식 (사용자보정)
var gArrCols2 = [];
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//조회조건 콤보박스
//var gRscRatCombo = "lpdfe";
var gAplcBeNm = "";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    // 공통코드 조회(납입상태, 채널, 상품유형)
    $.fn.loadCommonCode(["RSC_RAT_PROD_SC_CD","BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD","BE_CHNL_SC_CD","BE_BLK_SC_CD","ASS_PROD_APLC_SC_CD"]);

    //적용BE 콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //해지유보
    initGridRtfBfc();
    initGridRftAfc();
    initGridLastBe();
    initGridUserBe();

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
    //condAplcBeNm = $.fn.getAplcBe("ibx_aplcBeNm","03");
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
    
    //var serviceNm="RSC_RAT_NHVLOW";//해지유보 배치
    
    // 조회조건 변경시 그리드 초기화
    $("#ibx_aplcBeNm").on("change", function(e){
    	gAplcBeNm = $("#ibx_aplcBeNm").val();
    });
	  
    // 조회
    $('#btn_search').on('click', function(e){
    	if ($.fn.isEmpty($("#ibx_aplcBeNm").val())) {
    		$.fn.msgBox("적용BE를 입력하세요.", function () {
        	    $("#ibx_aplcBeNm").focus();
    		});
    		return;
    	}
        selectProdAplcList();
    });
    
    //유보효과산출결과:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download_1').on('click', function(e){
        var arrColsInfo = $.fn.getTbCols("TB_IBECRS24");
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        if(gCondFlag == "N" || $("#gridDivRtfBfc").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        console.log($('#title_rtfBfc'));
        
        let fileName = $(document).find("title").text()+"_유보효과산출결과_"+$("#ibx_aplcBeNm").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivRtfBfc',
                sheetName : "유보효과 산출결과(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //사용자보정전:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $("#btn_excel_download_3").on("click", function(e){
        var arrColsInfo = $.fn.getTbCols("TB_IBECRS25");
        gArrCols2 = $.fn.createTmpExcelGrid(arrColsInfo);
        
        if(gCondFlag == "N" || $("#gridDivLastBe").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = $(document).find("title").text()+"_사용자보정전_"+$("#ibx_aplcBeNm").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivLastBe',
                sheetName : "사용자 보정 전(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });
    
    //사용자보정후:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $("#btn_excel_download_4").on("click", function(e){
        if(gCondFlag == "N" || $("#gridDivUserBe").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = $(document).find("title").text()+"_사용자보정후_"+$("#ibx_aplcBeNm").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivUserBe',
                sheetName : "사용자 보정 후",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            },
            {
                id: 'gridDivUserBe',
                sheetName : "사용자 보정 후(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
    });

    //유보효과산출결과 excel upload
    $("#btn_excelUpload_1").on("click", function(e){
    	if ($("#ibx_aplcBeNm").val().endsWith('BE_F')) {
        	$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
        	    $("#ibx_aplcBeNm").focus();
        	});
        	return;
        } 
    	
        var paramObj = {};
        
        paramObj.id = "gridDivRtfBfc";  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols;
                        data["aplcBeNm"] = $("#ibx_aplcBeNm").val();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd150m/saveLpdfeProdRsltList.do')
                        .done(function(data) {
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

    //사용자보정후 excel upload
    $("#btn_excelUpload_4").on("click", function(e){
    	if ($("#ibx_aplcBeNm").val().endsWith('BE_F')) {
        	$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
        	    $("#ibx_aplcBeNm").focus();
        	});
        	return;
        } 
    	
        var paramObj = {};
        
        paramObj.id = "gridDivUserBe";  //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols2;
                        data["aplcBeNm"] = $("#ibx_aplcBeNm").val();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd150m/saveUserBeList.do')
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
    
    //사용자보정전 데이터 생성
    $("#btn_userBeRtfBef").on("click", function(e){
        // 조회에 필요한 값을 셋팅
        gReqParam.aplcBeNm = $("#ibx_aplcBeNm").val(); //적용BE 
        
        if ($("#ibx_aplcBeNm").val().endsWith('BE_F')) {
        	$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
        	    $("#ibx_aplcBeNm").focus();

        	});
        	return;
        }
        
        // 데이터 조회
        $.callAjax(gReqParam, "/be/pd/bepd150m/saveUserBeRtfBefList.do")
        .done(function(data) {
        	console.log(data);
            if(data.result == 'success') {
                $.fn.msgBox('정상적으로 처리되었습니다.');
            }
        	// 그리드 초기화
        	//resetGrid();
        	//reDrawGrid();
        	//그리드 바인딩
//        	var lastBeListData = data.rtfBfcList;// 해지유보효과_사용자보정전
//        	if(lastBeListData && lastBeListData.length == 0) {
//        		$.fn.getReturnValue("gridDivLastBe");
//        	} else {
//        		$("#gridDivLastBe").jsGrid("loadData", lastBeListData);
//        	}
        	selectProdAplcList();
            gCondFlag = "Y";
        }).fail(function(data){
            $.fn.msgBox("데이터 불러오기 실패");
            console.log("fail to selectMsgStatListByKeywords !!");
        });

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
    
    var fieldsArr = getGridFields(1);
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
    
    var fieldsArr = getGridFields(2);
    //var headerRowArr = getGridHederRow();
    
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
 * @설명: 해지율 - 산출적용 - 최종BE 적용결과 jsGrid 빈 테이블 생성 
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  김광섭 2026. 5. 26. 최초작성
 */
function initGridLastBe(){
    
    var fieldsArr = getGridFields(3);
//    var headerRowArr = getGridHederRow();
    
    var gridObjectLastBe = new ComJsGrid({
        id: "gridDivLastBe",
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
    gridObjectLastBe.gridCreate();
}

/**
 * @설명: 해지율 - 산출적용 - 최종BE 적용결과 jsGrid 빈 테이블 생성 
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  김광섭 2026. 5. 26. 최초작성
 */
function initGridUserBe(){
    
    var fieldsArr = getGridFields(3);
//    var headerRowArr = getGridHederRow();
    
    var gridObjectUserBe = new ComJsGrid({
        id: "gridDivUserBe",
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
    gridObjectUserBe.gridCreate();
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
    	$result = $result.add($("<tr class='jsgrid-header-row'>")
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("해지율산출구분"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입중환급금비율"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입후환급금비율"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("BLOCK"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("납입유형"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("채널유형"))
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
    }
    
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
	if(gReqParam.aplcBeNm != gAplcBeNm) {
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
    // 조회에 필요한 값을 셋팅
    gReqParam.aplcBeNm = $("#ibx_aplcBeNm").val(); //적용BE 
    //20260619 오픈 이후 전기에는 Q4를, 오픈 이전은 BE를 붙인다.
    if ((gReqParam.aplcBeNm.substr(0,4)) <= 2026) {
        gReqParam.befAplcBeNm = (gReqParam.aplcBeNm.substr(0,4)-1)+"BE";
    } else {
        gReqParam.befAplcBeNm = (gReqParam.aplcBeNm.substr(0,4)-1)+"Q4";
    }
    //gReqParam.rscRatCombo = gRscRatCombo;
    
    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd150m/selectLpdfeList.do")
    .done(function(data) {
    	// 그리드 초기화
    	resetGrid();
    	reDrawGrid();
    	//그리드 바인딩
    	var lpdfeProdList = data.lpdfeProdList;// 해지유보효과_유보효과산출결과
    	var rtfAfcListData = data.lpdfeRsltList;// 해지유보효과_유보효과결과
    	var lastBeListData = data.rtfBfcList;// 해지유보효과_사용자보정전
    	var userBeListData = data.userBeList;// 해지유보효과_사용자보정후
    	// 0건 그리드 메세지 처리부분
    	if(lpdfeProdList.length == 0) {
    		$.fn.getReturnValue("gridDivRtfBfc");
    	} else {
    		$("#gridDivRtfBfc").jsGrid("loadData", lpdfeProdList);
    	}
    	if(rtfAfcListData.length == 0) {
    		$.fn.getReturnValue("gridDivRtfAfc");
    	} else {
    		$("#gridDivRtfAfc").jsGrid("loadData", rtfAfcListData);
    	}
    	if(lastBeListData && lastBeListData.length == 0) {
    		$.fn.getReturnValue("gridDivLastBe");
    	} else {
    		$("#gridDivLastBe").jsGrid("loadData", lastBeListData);
    	}
    	if(userBeListData && userBeListData.length == 0) {
    		$.fn.getReturnValue("gridDivUserBe");
    	} else {
    		$("#gridDivUserBe").jsGrid("loadData", userBeListData);
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
    //보정후 산출결과 
    $("#gridDivRtfAfc").jsGrid("reset");
    $("#gridDivRtfAfc").jsGrid("option", "data", []);
    //최종BE 적용결과
    $("#gridDivLastBe").jsGrid("reset");
    $("#gridDivLastBe").jsGrid("option", "data", []);
    //사용자보정 적용결과
    $("#gridDivUserBe").jsGrid("reset");
    $("#gridDivUserBe").jsGrid("option", "data", []);
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
    $("#gridDivUserBe").jsGrid("destroy");
    //그리드 create
    initGridRtfBfc();
    initGridRftAfc();
    initGridLastBe();
    initGridUserBe();
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
    var rscRatProdScCdArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
    var chnlScCdArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
    //적용BE
    var aplcBeNm = $("#ibx_aplcBeNm").val(); 

	  if ((aplcBeNm.substr(0,4)) <= 2026) {
		  var befAplcBeNm = (aplcBeNm.substr(0,4)-1)+"BE";
		  //gReqParam.befAplcBeNm = (aplcBeNm.substr(0,4)-1)+"BE";
	  } else {
		  var befAplcBeNm = (aplcBeNm.substr(0,4)-1)+"Q4";
		  //gReqParam.befAplcBeNm = (aplcBeNm.substr(0,4)-1)+"Q4";
	  }
    
    var aplcBe = $("#ibx_aplcBeNm").val().substr(0,4); 
    var befAplcBe = (aplcBeNm.substr(0,4)-1);
    
    //그리드 공통부분 필드
    if(num==1) {
        var resultArr = [
            { name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 120, align:"center",
                itemTemplate:function(value, item) {
                    if(value=='ZZ') {
                        return 'TOTAL';
                    } else if (value==null || value=='') {
                        return value;
                    } else {
                        //return $._commonObj["code"]["RSC_RAT_PROD_SC_CD"][value-1].codeNm;
                        //return $._commonObj["code"]["RSC_RAT_PROD_SC_CD"][value-1].codeAbbrNm;
                        for(i=0; i<rscRatProdScCdArr.length; i++) {
                            if(value == rscRatProdScCdArr[i].code) {
                                return rscRatProdScCdArr[i].codeNm;
                            }
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
            { name: "reprPadPrd", title:"납입기간", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		if (value == "99") {
            			return "납기 통합산출";
            		} else {
            			return $.fn.isEmpty(value) ? " " : value + "년납";
            		}
            	}
            },
            { name: "prodStndYm", title:"마감년도", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		if (value == "888812") {
            			return "전기BE";
            		} else if (value == "999912") {
            			return "당기BE";
            		} else {
            			return $.fn.isEmpty(value) ? " " : value;
            		}
            	}
            },
            { name: "mathJdgmtAftLpdfeVal", title:"최종해지유보효과</br>(계리적 판단 후)", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? " " : value;
            	}
            },
            { name: "mathJdgmtBefLpdfeVal", title:"최종해지유보효과</br>(계리적 판단 전)", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? " " : value;
            	}
            },
            { name: "note", title:"비고", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? " " : value;
            	}
            },
            { name: "rseRfltAftLpdfeVal", title:"RSE반영후</br>해지유보효과", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            },
            { name: "cltnItvVal", title:"값", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? " " : value;
            	}
            },
            { name: "lyrCmpsnDevatVal", title:"전년도BE대비</br>표준편차", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? " " : value;
            	}
            },
            { name: "rseRfltYn", title:"수정RSE 반영여부", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		if ($.fn.isEmpty(value)) {
            			return " ";
            		} else {
            			return (value=="Y") ? "대상" : "비대상";
            		}
            	}
            },
            { name: "stnrdErrorVal", title:"표준오차", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            },
            { name: "rseRfltBefLpdfeVal", title:"RSE반영전</br>해지유보효과", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            },
            { name: "beAssRat01", title:"해지율</br>(4차년이후 기초통계)", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            },
            { name: "beAssRat02", title:"해지율</br>(완납전3년이내계약)", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            }
        ];
    } else if (num==2) {
        var resultArr = [
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
            { name: "befRseRfltBefLpdfeVal", title:befAplcBe+" 기초율", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            },
            { name: "befMathJdgmtAftLpdfeVal", title:befAplcBeNm+"", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            },
            { name: "rseRfltBefLpdfeVal", title:aplcBe+" 기초율", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            },
            { name: "rseRfltAftLpdfeVal", title:aplcBe+" RSE", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            },
            { name: "mathJdgmtAftLpdfeVal", title:aplcBe+" BE", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            }
        ];
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
            { name: "padPrd", title:"납입기간", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		if (value == "99") {
            			return "납기 통합산출";
            		} else {
            			return $.fn.isEmpty(value) ? " " : value + "년납";
            		}
            	}
            },
            { name: "thyyLpdfeVal", title:"1차년", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            },
            { name: "jsbfrOyLpdfeVal", title:"2차년", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            },
            { name: "jsbfrTyLpdfeVal", title:"3차년", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            	}
            },
            { name: "note", title:"Comments", css:"cell", type: "text",  width: 120, align:"center",
            	itemTemplate:function(value, item) {
            		return $.fn.isEmpty(value) ? " " : value;
            	}
            }
            ];
   }
    return resultArr;
}

function resetAllGrd() {
	resetGrid();
    reDrawGrid();
}