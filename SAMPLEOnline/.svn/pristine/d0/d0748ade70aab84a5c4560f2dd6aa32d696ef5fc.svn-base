/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 손해율 - 손해율 산출적용
 * @설명: 손해율  - 손해율 산출적용 화면의 JS
 * @최초작성자: 안현준
 * @최초작성일: 2026. 5. 20.
 * @최종변경일: 
 * @개정이력: 
 *  안현준 2026. 5. 20. 최초작성
 */

//조회조건obj
var gReqParam = {};

var gCondProdRsltSarCheck = "N";
var gCondShockSarCheck = "N";

//조회flag
var gCondFlag = "N";

$(document).ready(function(){
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
	
	// 공통코드 조회(손해율연령구분, 성별)
//	$.fn.loadCommonCode(["BE_LOSS_RAT_AGE_SC_CD", "BE_SXDS_CD"]);

	//event 초기화
    initEvent();
    
    //연령구분 최초로드 
    initGridAgeScRslt();
    
    //산출결과 최초로드 
    initGridProdRslt();
    
    //Shock결과 최초로드 
    initGridShockRslt();
    
    // 포커스(적용BE)
    $("#inp_aplcBeNm").focus();
});

/**
* @설명: 손해율 - 손해율 연령구분결과 - jsGrid 빈 테이블 생성 
* @최초작성자: 안현준
* @최초작성일: 2026. 5. 19.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  안현준 2026. 5. 19. 최초작성
*/
function initGridAgeScRslt(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(1);
    var gridObject = new ComJsGrid({
        id: "gridAgeScRslt",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    //그리드 생성
    gridObject.gridCreate();
}

/**
* @설명: 손해율 - 손해율 산출결과 - jsGrid 빈 테이블 생성 
* @최초작성자: 안현준
* @최초작성일: 2026. 5. 19.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  안현준 2026. 5. 19. 최초작성
*/
function initGridProdRslt(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields(2);
    // jsGrid 빈 테이블 생성
    var gridObject = new ComJsGrid({
        id: "gridProdRslt",
        height: 300,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    //그리드 생성
    gridObject.gridCreate();
}

/**
 * @설명: 손해율 - 손해율 산출결과 - jsGrid 빈 테이블 생성 
 * @최초작성자: 안현준
 * @최초작성일: 2026. 5. 28.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  안현준 2026. 5. 28. 최초작성
 */
function initGridShockRslt(){
	//그리드 필드 세팅
	var fieldsArr = getGridFields(3);
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridShockRslt",
		height: 300,
		editing: false,
		sorting: true,
		paging: true,
		fields : fieldsArr
	}); 
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 안현준
 * @최초작성일: 2026. 6. 2
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  안현준 2026. 6. 2 최초작성
 */
function getGridFields(num) {
	
	if(num == 1) {
		// 연령구분결과
	    var resultArr = [
	    	{ name: "finalKey", title:"FinalKey", css:"cell", type: "text", width: 100, align:"center" },
	    	{
	    		name: "exstnColtrYn", title:"기존/신규", css:"cell", type: "text", sorter: "number", width: 100, align:"center"
		    		, itemTemplate:function(value, item) {
		    			if(item.exstnColtrYn == "Y") {
		    				return "기존";
		    			} else if(item.exstnColtrYn == "N") {
		    				return "신규";
		    			}
		            }
	    	},
	    	{ name: "beSxdsCd", title: "성별", css: "cell", type: "text", width: 100, align: "center" },
	    	{ name: "minAge", title: "연령하한", css: "cell", type: "number", width: 100, align: "center" },
	    	{ name: "maxAge", title: "연령상한", css: "cell", type: "number", width: 100, align: "center" },
	    	{ name: "beLossRatAgeScCd", title: "연령구분판단", css: "cell", type: "text", width: 100, align: "center"
              ,  itemTemplate:function(value, item) {
            	  	return (item.beLossRatAgeScCdNm) ? item.beLossRatAgeScCdNm : "";
              	}
	    	},
	    	{ name: "lstBeLossRatAgeScCd", title:"최종연령구분판단", css:"cell", type: "select", width: 100, align:"center" 
	    		, itemTemplate:function(value, item) {
	    			return (item.lstBeLossRatAgeScCdNm) ? item.lstBeLossRatAgeScCdNm : "";
                }
	    	},
	    ];
	} else if (num == 2) { 
		// 산출결과
	    var resultArr = [
	    	{ name: "finalKey", title: "FinalKey", css: "cell", type: "text", width: 150, align: "center" },
	    	{
	    		name: "exstnColtrYn", title: "기존/신규", css: "cell", type: "text", width: 100, align: "center"
		    		, itemTemplate:function(value, item) {
		    			if(item.exstnColtrYn == "Y") {
		    				return "기존";
		    			} else if(item.exstnColtrYn == "N") {
		    				return "신규";
		    			}
		            }
	    	},
	    	{ name: "lstBeLossRatAgeScCd", title: "상세", css: "cell", type: "select", width: 100, align: "center"
	    		, itemTemplate:function(value, item) {
	    			return (item.lstBeLossRatAgeScCdNm) ? item.lstBeLossRatAgeScCdNm : "";
                }
	    	},
	    	{ name: "beSxdsCd", title: "성별", css: "cell", type: "text", width: 100, align: "center" },
	    	{ name: "strAge", title: "시작연령", css: "cell", type: "text", width: 100, align: "center" },
	    	{ name: "endAge", title: "종료연령", css: "cell", type: "text", width: 100, align: "center" },
	    ];
	    
	    var colNm = "psgYys";
	    var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12", "13", "14", "15"];
	    var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12", "13", "14", "15"];
	    var fieldsArr = getPsgNtsFieldsArr(targetArr, titleArr, colNm);
	    resultArr = resultArr.concat(fieldsArr);
	} else if (num == 3) {
		// Shock결과 그리드
	    var resultArr = [
	    	{ name: "rskPrmProdCd", title: "RSK_PRM_PROD_CD", css: "cell", type: "text", width: 150, align: "center" },
	    	{
	    		name: "exstnColtrYn", title: "기존/신규", css: "cell", type: "text", width: 100, align: "center"
	    		, itemTemplate:function(value, item) {
	    			if(item.exstnColtrYn == "Y") {
	    				return "기존";
	    			} else if(item.exstnColtrYn == "N") {
	    				return "신규";
	    			}
	            }
	    	},
	    	{ name: "lstBeLossRatAgeScCd", title: "상세", css: "cell", type: "select", width: 100, align: "center"
	              ,  itemTemplate:function(value, item) {
		                return (item.lstBeLossRatAgeScCdNm) ? item.lstBeLossRatAgeScCdNm : "";
	                },
	    	},
	    	{ name: "beLossRatChnlScCd", title: "채널", css: "cell", type: "text", width: 100, align: "center" },
	    	{ name: "beSxdsCd", title: "성별", css: "cell", type: "text", width: 100, align: "center" },
	    	{ name: "strAge", title: "시작연령", css: "cell", type: "text", width: 100, align: "center" },
	    	{ name: "endAge", title: "종료연령", css: "cell", type: "text", width: 100, align: "center" },
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
* @설명: event 초기화
* @최초작성자: 안현준
* @최초작성일: 2026. 5. 28.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  안현준 2026. 5. 28. 최초작성
*/
function initEvent() {
	// 조회
    $('#btn_search').on('click', function(e){
    	selectLossRatProdList();
    });
    
    $('#btn_createTable').on('click', function(e){
    	
    	var serviceNm = "LOSS_RAT_AGE_SC_JDGMT_RSLT_PROD";
		var reqParam = {};
		// 적용BE
		reqParam.aplcBeNm = $("#inp_aplcBeNm").val(); // 적용BE
		reqParam.stepId = 1;
		if(reqParam.aplcBeNm == '') {
			$.fn.msgBox('적용 BE를 입력해주세요', function() {				
				// 포커스(적용BE)
				$("#inp_aplcBeNm").focus();
			});
			return;
		} else if(reqParam.aplcBeNm.toUpperCase().includes("BE_F")) {
			$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다', function() {				
				// 포커스(적용BE)
				$("#inp_aplcBeNm").focus();
			});
			return;
		}
	    
	    reqParam.batName = serviceNm;

		$.fn.msgBox('배치를 실행하시겠습니까?', function(obj) {
			if (obj.btn_ok) {
				$.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
					.done(function(data) {
						if (data.result == '0') {
							$.fn.msgBox('정상적으로 처리되었습니다.');	
						} else {
							$.fn.msgBox('배치가 실패했습니다.');
						}
					}).fail(function(data) {
						$.fn.msgBox('배치가 실패했습니다.');
					});
			}
		}, 2);
    });
    
    $('#btn_batchAgeJdgmt').on('click', function(e){
    	var serviceNm = "LOSS_RAT_AGE_SC_JDGMT_RSLT_PROD";
		var reqParam = {};
		// 적용BE
		reqParam.aplcBeNm = $("#inp_aplcBeNm").val(); // 적용BE
		reqParam.stepId = 2;
		if(reqParam.aplcBeNm == '') {
			$.fn.msgBox('적용 BE를 입력해주세요', function() {				
				// 포커스(적용BE)
				$("#inp_aplcBeNm").focus();
			});
			return;
		} else if(reqParam.aplcBeNm.toUpperCase().includes("BE_F")) {
			$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다', function() {				
				// 포커스(적용BE)
				$("#inp_aplcBeNm").focus();
			});
			return;
		}
	    
	    reqParam.batName = serviceNm;

		$.fn.msgBox('배치를 실행하시겠습니까?', function(obj) {
			if (obj.btn_ok) {
				$.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
					.done(function(data) {
						if (data.result == '0') {
							$.fn.msgBox('정상적으로 처리되었습니다.');	
						} else {
							$.fn.msgBox('배치가 실패했습니다.');
						}
					}).fail(function(data) {
						$.fn.msgBox('배치가 실패했습니다.');
					});
			}
		}, 2);
    });
    
    $('#btn_batchProd').on('click', function(e){
    	var serviceNm = "LOSS_RAT_PROD";
		var reqParam = {};
		// 적용BE
		reqParam.aplcBeNm = $("#inp_aplcBeNm").val(); // 적용BE
		if(reqParam.aplcBeNm == '') {
			$.fn.msgBox('적용 BE를 입력해주세요', function() {				
				// 포커스(적용BE)
				$("#inp_aplcBeNm").focus();
			});
			return;
		} else if(reqParam.aplcBeNm.toUpperCase().includes("BE_F")) {
			$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다', function() {				
				// 포커스(적용BE)
				$("#inp_aplcBeNm").focus();
			});
			return;
		}

	    reqParam.batName = serviceNm;

		$.fn.msgBox('배치를 실행하시겠습니까?', function(obj) {
			if (obj.btn_ok) {
				$.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
					.done(function(data) {
						if (data.result == '0') {
							$.fn.msgBox('정상적으로 처리되었습니다.');	
						}
					}).fail(function(data) {
						$.fn.msgBox('배치가 실패했습니다.');
					});
			}
		}, 2);
    });
    
    $("#cbx_prodRslt_sar").on("change", function(e){
    	if ($('input:checkbox[id="cbx_prodRslt_sar"]').is(":checked") == true) {
    		gCondProdRsltSarCheck = "Y";
    	} else {
    		gCondProdRsltSarCheck = "N";
    	}
    });
    
    $("#cbx_shockRslt_sar").on("change", function(e){
    	if ($('input:checkbox[id="cbx_shockRslt_sar"]').is(":checked") == true) {
    		gCondShockSarCheck = "Y";
    	} else {
    		gCondShockSarCheck = "N";
    	}
    });
    
    $('#btn_ageScRslt_downloadExcel').on('click', function(e){
    	if(gCondFlag == "N" || $("#gridAgeScRslt").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
    	// 엑셀 다운로드 함수 호출
		
        let fileName = "손해율_연령구분결과"
                     + ".xlsx";
        $.fn.exportMultiGridExcel([{
            id       : 'gridAgeScRslt',
            sheetName : "연령구분결과",
            fileName : fileName
        }]);
    });
    
    $('#btn_uploadExcel').on('click', function(e){
    	var paramObj = {};
    	var aplcBeNm = $("#inp_aplcBeNm").val();
    	if(aplcBeNm == '') {
    		$.fn.msgBox('적용 BE를 입력해주세요', function() {				
				// 포커스(적용BE)
				$("#inp_aplcBeNm").focus();
			});
    		return;
    	} else if(aplcBeNm.toUpperCase().includes("BE_F")) {
			$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다', function() {				
				// 포커스(적용BE)
				$("#inp_aplcBeNm").focus();
			});
			return;
		}
        paramObj.id = "gridAgeScRslt";                 //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        console.log("로드데이터");
                        console.log(JSON.stringify(data["list"]));
//                        console.log(gArrCols);
//                        data["colList"] = gArrCols;
                        data["aplcBeNm"] = aplcBeNm;
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd125m/saveLossRatAgeScRsltList.do')
                        .done(function(data) {
                            if(data.result == "success") {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                            }
                        }).fail(function(data){
                            $.fn.msgBox('데이터 저장이 실패했습니다.');
                        });
                    }
                }, 2);
            }
        };
        $.fn.loadGridExcel(paramObj);
    });
    
    $('#btn_prodRslt_downloadExcel').on('click', function(e){
    	if(gCondFlag == "N" || $("#gridProdRslt").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
    	// 엑셀 다운로드 함수 호출
        let fileName = "손해율_산출결과" + (gCondProdRsltSarCheck == "Y" ? "(SaR적용)" : "")
                     + ".xlsx";
        $.fn.exportMultiGridExcel([{
            id       : 'gridProdRslt',
            sheetName : '손해율 산출결과' + (gCondProdRsltSarCheck == "Y" ? "SaR적용" : ""),
            fileName : fileName,
        }]);
    });
    
    $('#btn_shockRslt_downloadExcel').on('click', function(e){
    	if(gCondFlag == "N" || $("#gridShockRslt").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
    	let fileName = "손해율_Shock결과" + (gCondShockSarCheck == "Y" ? "(SaR적용)" : "")
    		+ ".xlsx";
        $.fn.exportMultiGridExcel([{
            id       : 'gridShockRslt',
            sheetName : '손해율 Shock결과' + (gCondShockSarCheck == "Y" ? "SaR적용" : ""),
            fileName : fileName,
        }]);
    });

    $(["#inp_aplcBeNm"
      , "#cbx_prodRslt_sar"
      , "#inp_prodRslt_rskRatJdgCd"
      , "#inp_prodRslt_rskRatLclsfCd"
      , "#inp_prodRslt_rskRatMclsfCd"
      , "#sbx_prodRslt_exstnColtrYn"
      , "#cbx_shockRslt_sar"
      , "#inp_shockRslt_rskPrmProdCd"
      , "#inp_shockRslt_beLossRatChnlScCd"
      , "#inp_shockRslt_beSxdsCd"
      , "#sbx_shockRslt_exstnColtrYn"
      ].join(",")).on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
}

/**
 * @설명: 손해율 구분단위 Grid 조회
 * @최초작성자: 안현준
 * @최초작성일: 2026. 5. 28.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  안현준 2026. 5. 28. 최초작성
 */
function selectLossRatProdList(){
	// 조회에 필요한 값을 셋팅
    gReqParam.aplcBeNm = $("#inp_aplcBeNm").val(); //적용BE 
    if(gReqParam.aplcBeNm == "") {
    	$.fn.msgBox("적용 BE를 입력해주세요", function() {				
			// 포커스(적용BE)
			$("#inp_aplcBeNm").focus();
		});
    	return;
    }
    
    // 산출결과 조회값
    gReqParam.prodRsltSarCheck = gCondProdRsltSarCheck; // SaR적용여부
    gReqParam.prodRsltRskRatJdgCd = $("#inp_prodRslt_rskRatJdgCd").val();
    gReqParam.prodRsltRskRatLclsfCd = $("#inp_prodRslt_rskRatLclsfCd").val();
    gReqParam.prodRsltRskRatMclsfCd = $("#inp_prodRslt_rskRatMclsfCd").val();
    gReqParam.prodRsltExstnColtrYn = $("#sbx_prodRslt_exstnColtrYn").val(); // 기존/신규
    
    // shock 결과 조회값
    gReqParam.shockRsltSarCheck = gCondShockSarCheck; // SaR적용여부
    gReqParam.shockRsltRskPrmProdCd = $("#inp_shockRslt_rskPrmProdCd").val();
    gReqParam.shockRsltbeLossRatChnlScCd = $("#inp_shockRslt_beLossRatChnlScCd").val();
    gReqParam.shockRsltBeSxdsCd = $("#inp_shockRslt_beSxdsCd").val();
    gReqParam.shockRsltExstnColtrYn = $("#sbx_shockRslt_exstnColtrYn").val();
    
    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd125m/selectLossRatProdList.do")
    .done(function(data) {
    	// 그리드 초기화
    	resetGrid();
    	reDrawGrid();
    	//그리드 바인딩
    	var ageScRsltList = data.ageScRsltList;// 연령구분결과
    	var prodRsltList = data.prodRsltList;// 산출결과
    	var shockRsltList = data.shockRsltList; // Shock 결과
    	// 0건 그리드 메세지 처리부분
    	if(ageScRsltList.length == 0) {
    		$.fn.getReturnValue("gridAgeScRslt");
    	} else {
    		$("#gridAgeScRslt").jsGrid("loadData", ageScRsltList);
    	}
    	if(prodRsltList.length == 0) {
    		$.fn.getReturnValue("gridProdRslt");
    	} else {
    		$("#gridProdRslt").jsGrid("loadData", prodRsltList);
    	}
    	if(shockRsltList.length == 0) {
    		$.fn.getReturnValue("gridShockRslt");
    	} else {
    		$("#gridShockRslt").jsGrid("loadData", shockRsltList);
    	}
    	gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectMsgStatListByKeywords !!");
    });
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 안현준
 * @최초작성일: 2026. 5. 28.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  안현준 2026. 5. 28. 최초작성
 */
function resetGrid() {
    // 연령구분결과 
    $("#gridAgeScRslt").jsGrid("reset");
    $("#gridAgeScRslt").jsGrid("option", "data", []);
    // 산출결과
    $("#gridProdRslt").jsGrid("reset");
    $("#gridProdRslt").jsGrid("option", "data", []);
    // Shock결과
    $("#gridShockRslt").jsGrid("reset");
    $("#gridShockRslt").jsGrid("option", "data", []);
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 안현준
 * @최초작성일: 2026. 5. 28.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  안현준 2026. 5. 28. 최초작성
 */
function reDrawGrid() {
    //그리드 destroy
    $("#gridAgeDivRslt").jsGrid("destroy");
    $("#gridProdRslt").jsGrid("destroy");
    $("#gridShockRslt").jsGrid("destroy");
    //그리드 create
    initGridAgeScRslt();
    initGridProdRslt();
    initGridShockRslt();
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 안현준
 * @최초작성일: 2026. 5. 28.
 * @최종변경일: 
 * @매개변수: targetArr<array> : 경과월 배열 
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  안현준 2026. 5. 28. 최초작성
 */
function getPsgNtsFieldsArr(targetArr, titleArr, colNm) {
    if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titleArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: colNm + target , title: titleArr[i] + "차년", css:"cell", type: "text", width: 100, align:"right", sorter:"number",
        		itemTemplate: function(value, item) {
        			return $.fn.isEmpty(value) ? "" : (value * 100).toFixed(1) + "%"; 
        		}
        };
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}