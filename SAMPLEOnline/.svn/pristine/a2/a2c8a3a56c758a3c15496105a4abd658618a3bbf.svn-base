/**
 * @시스템명: 가정관리
 * @업무명: 해지율 - Fac파일
 * @설명: 해지율 - Fac파일 화면의 JS
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26.
 * @최종변경일: 2026. 5. 26.
 * @개정이력: 
 *  김광섭 2026. 5. 26. 최초작성
 */
//var condAplcBe;
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//조회조건 콤보박스
//var rscRatCombo = "skewness";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    // 공통코드 조회(납입상태, 채널, 상품유형)
    $.fn.loadCommonCode(["RSC_RAT_PROD_SC_CD","BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD","BE_CHNL_SC_CD","BE_BLK_SC_CD"]);

    //적용BE 콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //FAC
    initGridRscRatItm();//해지율
    initGridSkewItm();//skew
    initGridLpdfeItm();//해지유보효과
    initGridRscIncrEfcItm();//해지증가효과
    
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
    //condAplcBe = $.fn.getAplcBe("sbx_aplcBe","03");
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
    $("#div_fac").show();
    
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

	// FAC 파일 다운로드
	$("#btn_csv_download1").on("click", function(e){
    	if ($.fn.isEmpty($("#ibx_FacVer").val())) {
    		$.fn.msgBox("Fac 버전을 입력하세요.", function() {
        	    $("#ibx_FacVer").focus();
    		});
    		return;
    	}
    	
		saveFacFileRscRat();
		saveFacFileSkew();
		saveFacFileLpdfe();
		saveFacFileRscIncrEfc();
	});
	
    // 엔터키 조회 - 적용BE
    $("#ibx_aplcBeNm").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
    
    // 엔터키 조회 - Fac 버전
    $("#ibx_FacVer").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
}

/**
* @설명: 해지율 - FAC - 해지율 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 04.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 04. 최초작성
*/
function initGridRscRatItm(){
    
    var fieldsArr = getGridRscRatFields();
    //var headerRowArr = getGridHederRow();
    
    var gridObjectRscRatItm = new ComJsGrid({
        id: "rscRatItm",
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
    gridObjectRscRatItm.gridCreate();
}

/**
* @설명: 해지율 - Fac - Skewness jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 04.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 05. 04. 최초작성
*/
function initGridSkewItm(){
    
    var fieldsArr = getGridSkewFields();
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
* @설명: 해지율 - Fac - 해지유보효과 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 26. 최초작성
*/
function initGridLpdfeItm(){
    
    var fieldsArr = getGridLpdfeFields();
    //var headerRowArr = getGridHederRow();
    
    var gridObjectLpdfeItm = new ComJsGrid({
        id: "lpdfeItm",
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
    gridObjectLpdfeItm.gridCreate();
}

/**
* @설명: 해지율 - Fac - 해지증가효과 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 26. 최초작성
*/
function initGridRscIncrEfcItm(){
    
    var fieldsArr = getGridRscIncrEfcFields();
    //var headerRowArr = getGridHederRow();
    
    var gridObjectRscIncrEfcItm = new ComJsGrid({
        id: "rscIncrEfcItm",
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
    gridObjectRscIncrEfcItm.gridCreate();
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
	$("#div_fac").show();
    
    // 조회에 필요한 값을 셋팅
    gReqParam.aplcBeNm = $("#ibx_aplcBeNm").val(); //적용BE 
    gReqParam.lumpSum1 = $("#ibx_lump_sum_1").val(); //lump_sum
    gReqParam.lumpSum2 = $("#ibx_lump_sum_2").val(); //lump_sum
    gReqParam.lumpSum3 = $("#ibx_lump_sum_3").val(); //lump_sum

    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd411m/selectFacDataList.do")
    .done(function(data) {

    	resetGrid3();
        reDrawGrid3();

        var rscRatList     = data.rscRatList;//해지율 Fac
        var skewList       = data.skewList;//Skew Fac 
        var lpdfeList      = data.lpdfeList;//해지유보효과 Fac
        var rscIncrEfcList = data.rscIncrEfcList;//해지증가효과 Fac
        
        if(rscRatList && rscRatList.length == 0) {
            $.fn.getReturnValue("rscRatItm");
        } else {
            $("#rscRatItm").jsGrid("loadData", rscRatList);
        }
        if(skewList && skewList.length == 0) {
            $.fn.getReturnValue("skewItm");
        } else {
            $("#skewItm").jsGrid("loadData", skewList);
        }
        if(lpdfeList && lpdfeList.length == 0) {
            $.fn.getReturnValue("lpdfeItm");
        } else {
            $("#lpdfeItm").jsGrid("loadData", lpdfeList);
        }
        if(rscIncrEfcList && rscIncrEfcList.length == 0) {
            $.fn.getReturnValue("rscIncrEfcItm");
        } else {
            $("#rscIncrEfcItm").jsGrid("loadData", rscIncrEfcList);
        }
    
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectMsgStatListByKeywords !!");
    });
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
    //해지율 
    $("#rscRatItm").jsGrid("reset");
    $("#rscRatItm").jsGrid("option", "data", []);
    //skew 
    $("#skewItm").jsGrid("reset");
    $("#skewItm").jsGrid("option", "data", []);
    //해지유보
    $("#lpdfeItm").jsGrid("reset");
    $("#lpdfeItm").jsGrid("option", "data", []);
    //해지증가
    $("#rscIncrEfcItm").jsGrid("reset");
    $("#rscIncrEfcItm").jsGrid("option", "data", []);
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
	$("#rscRatItm").jsGrid("destroy");
    $("#skewItm").jsGrid("destroy");
    $("#lpdfeItm").jsGrid("destroy");
    $("#rscIncrEfcItm").jsGrid("destroy");
    //그리드 create
    initGridRscRatItm();
    initGridSkewItm();
    initGridLpdfeItm();
    initGridRscIncrEfcItm();
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
function getGridRscRatFields() {
	var selAplcBeNm = $("#ibx_aplcBeNm").val();
//	var codeArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
//	//코드 목록
//    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
//    var rscRatProdScCdArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
    
    var resultArr = [
        { name: "!8", title:"!8", css:"cell", type: "text",  width: 50, align:"center", visible:false,
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        },
        { name: "lapseBand", title:"LAPSE_BAND", css:"cell", type: "text",  width: 100, align:"center",
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        },
        { name: "channel", title:"CHANNEL", css:"cell", type: "text",  width: 100, align:"center",
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        },
        { name: "spRp", title:"SP_RP", css:"cell", type: "text",  width: 100, align:"center",
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        },
        { name: "lapseIdx1", title:"LAPSE_IDX_1", css:"cell", type: "text",  width: 100, align:"center",
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        },
        { name: "lapseIdx2", title:"LAPSE_IDX_2", css:"cell", type: "text",  width: 100, align:"center",
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        },
        { name: "lpsAddpremIdx", title:"LPS_ADDPREM_IDX", css:"cell", type: "text",  width: 130, align:"center",
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        },
        { name: "paidPeriod", title:"PAID_PERIOD", css:"cell", type: "text",  width: 100, align:"center",
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        }
    ];
    
    var colNm = "psgMntFgr";
	var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15"];
	var titleArr  = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15"];
	var fieldsArr = getPsgMntFieldsArr(targetArr);
	resultArr = resultArr.concat(fieldsArr);
	
	var lapseKeyBand = 
	{ name: "lapseKeyBand", title:"LAPSE_KEY_BAND", css:"cell", type: "text",  width: 150, align:"center",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "" : value;
			}
	};
	resultArr.push(lapseKeyBand);
	
	var lapseType = { name: "lapseType", title:"LAPSE_TYPE", css:"cell", type: "text",  width: 150, align:"center",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "" : value;
			}
	};
	resultArr.push(lapseType);
	
	var pcrLapsePc = { name: "pcrLapsePc", title:"PCR_LAPSE_PC", css:"cell", type: "text",  width: 150, align:"center",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "" : value;
			}
	};
	resultArr.push(pcrLapsePc);
	
	var lapseShockType = { name: "lapseShockType", title:"LAPSE_SHOCK_TYPE", css:"cell", type: "text",  width: 150, align:"center",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "" : value;
			}
	};
	resultArr.push(lapseShockType);
	
	var lapseShockPc = { name: "lapseShockPc", title:"LAPSE_SHOCK_PC", css:"cell", type: "text",  width: 150, align:"center",
			itemTemplate:function(value, item) {
				//console.log("value:::" + value);
				//console.log("item:::" + item);
				//return $.fn.isEmpty(value) ? "" : value;
				return value;
			}
	};
	resultArr.push(lapseShockPc);
	
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
function getGridSkewFields() {
	var selAplcBeNm = $("#ibx_aplcBeNm").val();
	var codeArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
	//코드 목록
    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
    var rscRatProdScCdArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
    
    var resultArr = [
        { name: "!2", title:"!2", css:"cell", type: "text",  width: 50, align:"center", visible:false,
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        },
        { name: "lapseKeyBand", title:"LAPSE_KEY_BAND", css:"cell", type: "text",  width: 150, align:"center",
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        }
    ];
    
    var colNm = "psgMntFgr";
	var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15","16","17","18","19","20","21","22","23"
    	,"24","25","26","27","28","29","30","31","32","33","34","35","36"];
	var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15","16","17","18","19","20","21","22","23"
    	,"24","25","26","27","28","29","30","31","32","33","34","35","36"];
	var fieldsArr = getPsgMntFieldsArr(targetArr);
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
function getGridLpdfeFields() {
	var selAplcBeNm = $("#ibx_aplcBeNm").val();
//	var codeArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
//	//코드 목록
//    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
//    var rscRatProdScCdArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
    
    var resultArr = [
        { name: "!2", title:"!2", css:"cell", type: "text",  width: 50, align:"center", visible:false,
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        },
        { name: "lapseKeyBand", title:"LAPSE_KEY_BAND", css:"cell", type: "text",  width: 150, align:"center",
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
        }
    ];
    
    //var colNm = "psgMntFgr";
	var targetArr = ["1", "2", "3"];
	var titleArr  = ["1", "2", "3"];
	var fieldsArr = getPsgMntFieldsArr(targetArr);
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
function getGridRscIncrEfcFields() {
	var selAplcBeNm = $("#ibx_aplcBeNm").val();
//	var codeArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
//	//코드 목록
//    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
//    var rscRatProdScCdArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
    
    var resultArr = [
        { name: "!3", title:"!3", css:"cell", type: "text",  width: 50, align:"center", visible:false,
        	itemTemplate:function(value, item) {
        		//return $.fn.isEmpty(value) ? "" : value;
        		return value;
        	}
        },
        { name: "lapseKeyBand", title:"LAPSE_KEY_BAND", css:"cell", type: "text",  width: 150, align:"center",
        	itemTemplate:function(value, item) {
        		return value;
        	}
        },
        { name: "lapsePuYear", title:"LAPSE_PU_YEAR", css:"cell", type: "text",  width: 150, align:"center",
        	itemTemplate:function(value, item) {
        		return value;
        	}
        },
        { name: "lapseIncreasePc", title:"LAPSE_INCREASE_PC", css:"cell", type: "text",  width: 150, align:"center",
        	itemTemplate:function(value, item) {
        		return value;
        	}
        }
    ];
    
//    var colNm = "psgMntFgr";
//	var targetArr = ["1", "2", "3"];
//	var titleArr  = ["1", "2", "3"];
//	var fieldsArr = getPsgMntFieldsArr(targetArr);
//	resultArr = resultArr.concat(fieldsArr);
	
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
function getPsgMntFieldsArr(targetArr) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    var resultArr = [];
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: target , title: target + "", css:"cell", type: "text", width: 80, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return value;
        }};
        resultArr.push(distStndValField);
    }
    return resultArr;
}

/**
 * @설명: 산출결과 Grid Fac 파일 다운로드
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 26 최초작성
 */
function saveFacFileRscRat(){
	var gridId = "rscRatItm";
	var fileName = "lapse_" + $('#ibx_FacVer').val();//lapse_202512e_v1.4
	var title = "20 " + fileName;

	var paramObj = {};
	paramObj.id = gridId;
	paramObj.showHeader = true;										//그리드헤더(컬럼제목) 출력 여부	
	paramObj.fileName = fileName + ".fac";                   		//다운로드할 파일명
	paramObj.applyItemTemplate = false;								//그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
	paramObj.checkVisible = false;								    //visible false인 컬럼의 출력여부(false인경우 visible=false인 컬럼이 출력됨)
	//paramObj.commentHeaderKey = "{key1='value1',key2='value2'}";	//CommentHeader 3행 조회조건(key,value를 JSON String으로 전달)
	//paramObj.commentHeaderEtc = "부가적으로 입력할 사항";					//CommentHeader 4행 기타
	paramObj.title = title;					//CommentHeader
	$.fn.exportGridFAC(paramObj);
}

/**
 * @설명: 산출결과 Grid Fac 파일 다운로드
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 26 최초작성
 */
function saveFacFileSkew(){
	var gridId = "skewItm";
	var fileName = "lapse_skew_" + $('#ibx_FacVer').val();//202512e_v1";//lapse_202512e_v1.4.fac
	var title = "36 " + fileName;

	var paramObj = {};
	paramObj.id = gridId;
	paramObj.showHeader = true;										//그리드헤더(컬럼제목) 출력 여부	
	paramObj.fileName = fileName + ".fac";                   			//다운로드할 파일명
	paramObj.applyItemTemplate = false;								//그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
	paramObj.checkVisible = false;								    //visible false인 컬럼의 출력여부(false인경우 visible=false인 컬럼이 출력됨)
	//paramObj.commentHeaderKey = "{key1='value1',key2='value2'}";	//CommentHeader 3행 조회조건(key,value를 JSON String으로 전달)
	//paramObj.commentHeaderEtc = "부가적으로 입력할 사항";					//CommentHeader 4행 기타
	paramObj.title = title;					//CommentHeader
	$.fn.exportGridFAC(paramObj);
}

/**
 * @설명: 산출결과 Grid Fac 파일 다운로드
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 26 최초작성
 */
function saveFacFileLpdfe(){
	var gridId = "lpdfeItm";
	var fileName = "lapse_defer_" + $('#ibx_FacVer').val();//lapse_202512e_v1.4.fac
	var title = "3 " + fileName;

	var paramObj = {};
	paramObj.id = gridId;
	paramObj.showHeader = true;										//그리드헤더(컬럼제목) 출력 여부	
	paramObj.fileName = fileName + ".fac";                   			//다운로드할 파일명
	paramObj.applyItemTemplate = false;								//그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
	paramObj.checkVisible = false;								    //visible false인 컬럼의 출력여부(false인경우 visible=false인 컬럼이 출력됨)
	//paramObj.commentHeaderKey = "{key1='value1',key2='value2'}";	//CommentHeader 3행 조회조건(key,value를 JSON String으로 전달)
	//paramObj.commentHeaderEtc = "부가적으로 입력할 사항";					//CommentHeader 4행 기타
	paramObj.title = title;					//CommentHeader
	$.fn.exportGridFAC(paramObj);
}

/**
 * @설명: 산출결과 Grid Fac 파일 다운로드
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 26 최초작성
 */
function saveFacFileRscIncrEfc(){
	var gridId = "rscIncrEfcItm";
	var fileName = "lapse_paidup_inc_" + $('#ibx_FacVer').val();//lapse_202512e_v1.4.fac
	var title = "1 " + fileName;

	var paramObj = {};
	paramObj.id = gridId;
	paramObj.showHeader = true;										//그리드헤더(컬럼제목) 출력 여부	
	paramObj.fileName = fileName + ".fac";                   			//다운로드할 파일명
	paramObj.applyItemTemplate = false;								//그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
	paramObj.checkVisible = false;								    //visible false인 컬럼의 출력여부(false인경우 visible=false인 컬럼이 출력됨)
	//paramObj.commentHeaderKey = "{key1='value1',key2='value2'}";	//CommentHeader 3행 조회조건(key,value를 JSON String으로 전달)
	//paramObj.commentHeaderEtc = "부가적으로 입력할 사항";					//CommentHeader 4행 기타
	paramObj.title = title;					//CommentHeader
	$.fn.exportGridFAC(paramObj);
}

function resetAllGrd() {
    resetGrid3();
    reDrawGrid3();
}