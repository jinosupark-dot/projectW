/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 손해율 > 비실손가정
 * @설명: 손해율 - 
 * @최초작성자: 이준희
 * @최초작성일: 2026. 5. 19.
 * @최종변경일: 
 * @개정이력: 
 *  이준희 2026. 5. 19. 최초작성
 */

$(document).ready(function() {
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    $(window).on('resize', function() {
    	resizeMyGrid();
    });

    // 이벤트 초기화
    initEvent();
    
    // 비실손 갱신 목표손해율 산출결과 테이블 생성
    initgridNoLossRatRldmRes();
    
    // 비실손 갱신 보험료조정한도 산출결과 테이블 생성
    initgridNoLossRatRldmRtf();
    
    // 시작 시 적용BE에 포커스
    $("#ibx_aplcBeNm").focus();
    
	// 엔터키 조회
    $("#ibx_aplcBeNm").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
})

/**
* @설명: 이벤트 초기화
* @최초작성자: 이준희
* @최초작성일: 2026. 5. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준희 2026. 5. 20. 최초작성
*/

function initEvent() {
	var serviceMap = {
		"SP_IBECRS030":"NON_LOSS_RAT_RLDM_GOAL",
		"SP_IBECRS031":"NON_LOSS_RAT_RLDM_PRM"
	}
	
	var serviceNm1 = "NON_LOSS_RAT_RLDM_GOAL";
	var serviceNm2 = "NON_LOSS_RAT_RLDM_PRM";
	
	// 비실손가정 > 비실손 갱신 목표손해율 산출결과, 갱신 보험료조정한도 산출결과 조회
	$('#btn_search').on('click', function(e) {
		
		selectLossNonRatRldmList();
		
	});

	// 배치 실행
	$('#btn_execBatch').on('click', function(e) {

		var reqParam = {};
		
        //적용BE
        reqParam.aplcBeNm = $("#ibx_aplcBeNm").val();

    	if (reqParam.aplcBeNm == '') {
    		$.fn.msgBox('적용 BE를 입력해주세요.', function() {
    		    $("#ibx_aplcBeNm").focus();
    		});
			return;
    	}
    	
    	// 금지 키워드
    	if (reqParam.aplcBeNm.includes('BE_F')) {
    		$.fn.msgBox('해당 적용 BE는 데이터를 변경할 수 없습니다.', function() {
    		    $("#ibx_aplcBeNm").focus();
    		});
			return;
    	}
        
        $.fn.msgBox('배치를 실행하시겠습니까?', function (obj) {
        	if (obj.btn_ok) {
//        		var cnt = 0;
//        		for (var [batchId, batchNm] of Object.entries(serviceMap)) {
        			
                    // 배치 시작 - 비실손 갱신 목표손해율 산출결과
        			reqParam.batName = serviceNm1;
        			
                    $.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
            		.done(function(data) {
            			console.log('!!!first batName::' + reqParam.batName);
            			if(data.result == '0') {
            				//setTimeout(function() {
            				//	selectProdAplcList();
            		        //}, 6000); 
//                			console.log('@@@cnt::' + cnt);
            				// 배치 시작 - 비실손 갱신 보험료조정한도 산출결과
                			reqParam.batName = serviceNm2;
                			
                			$.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
                    		.done(function(data) {
                    			console.log('!!!second batName::' + reqParam.batName);
                    			if(data.result == '0') {
                    				resetGrid();
                    				$.fn.msgBox("정상적으로 처리되었습니다.");
                    			}
                			
//            				if (cnt == 1) {
//                				resetGrid();
//                				$.fn.msgBox("정상적으로 처리되었습니다.");
//            				}
                    		}).fail(function(data){
                				$.fn.msgBox("배치가 실패했습니다.");
                				return;
                    		});
            			}
//            			else {
//            				$.fn.msgBox("배치가 실패했습니다.");
//            				return;
//            			}
            		}).fail(function(data){
        				$.fn.msgBox("배치가 실패했습니다.");
        				return;
            		});
                    
                    // 배치 시작 - 비실손 갱신 보험료조정한도 산출결과
//        			reqParam.batName = serviceNm2;
//
//                    $.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
//            		.done(function(data2) {
//            			if(data2.result == '0') {
//            				//setTimeout(function() {
//            				//	selectProdAplcList();
//            		        //}, 6000);
////                			console.log('@@@cnt::' + cnt);
//                			console.log('@@@batName::' + reqParam.batName);
//                			
////            				if (cnt == 1) {
//                				resetGrid();
//                				$.fn.msgBox("정상적으로 처리되었습니다.");
////            				}
//            				
//            			}
////            			else {
////            				$.fn.msgBox("배치가 실패했습니다.");
////            				return;
////            			}
//            		}).fail(function(data2){
//        				$.fn.msgBox("배치가 실패했습니다.");
//        				return;
//            		});
//        		}
        	}
        }, 2);

	});

	// 비실손 갱신 목표손해율 산출결과 엑셀 다운로드
	$('#btn_excel_download1').on('click', function(e) {
		if($("#gridNonLossGoalRatRldm").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.", function() {
        	    $("#ibx_aplcBeNm").focus();
            });
            return;
        }
		
		let fileName = "손해율_비실손갱신목표손해율산출결과" + ".xlsx";
		
		$.fn.exportMultiGridExcel([
			{
                id: 'gridNonLossGoalRatRldm',
                sheetName : "비실손 갱신 목표손해율 산출결과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"
//                searchCond: {}
            }
		])
		
	});

	// 비실손 갱신 보험료조정한도 산출결과 엑셀 다운로드
	$('#btn_excel_download2').on('click', function(e) {
        if($("#gridNonLossPrmRldm").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.", function() {
        	    $("#ibx_aplcBeNm").focus();
            });
            return;
        }
	        
		let fileName = "손해율_비실손갱신보험료조정한도산출결과" + ".xlsx";
		
		$.fn.exportMultiGridExcel([
			{
                id: 'gridNonLossPrmRldm',
                sheetName : "비실손 갱신 보험료조정한도 산출결과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"
//                searchCond: {}
            }
		])
		
		
	});
	
	// 비실손 갱신 보험료조정한도 산출결과 엑셀 업로드
    $('#btn_uploadExcel').on('click', function(e){
    	var paramObj = {};
    	var aplcBeNm = $("#ibx_aplcBeNm").val();
    	if(aplcBeNm == '') {
    		$.fn.msgBox('적용 BE를 입력해주세요', function() {
        	    $("#ibx_aplcBeNm").focus();
    		});
    	    return;
    	}

    	// 금지 키워드
    	if (aplcBeNm.includes('BE_F')) {
    		$.fn.msgBox('해당 적용 BE는 데이터를 변경할 수 없습니다.', function() {
    		    $("#ibx_aplcBeNm").focus();
    		});
			return;
    	}
        
        paramObj.id = "gridNonLossPrmRldm";                 //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        console.log("로드데이터");
                        console.log(JSON.stringify(data["list"]));
                        
//                        console.log(gArrCols);
//                        data["colList"] = gArrCols;
                        data["aplcBeNm"] = aplcBeNm;
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd127m/saveNonLossRatRldmList.do')
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
//        $.fn.loadGridCSV(paramObj);
    });
}


/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 하승민
 * @최초작성일: 2026. 5. 21
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준희 2026. 5. 21 최초작성
 */

function resetGrid() {
	// 비손실 갱신 목표손해율 산출결과
	$("#gridNonLossGoalRatRldm").jsGrid("reset");
	$("#gridNonLossGoalRatRldm").jsGrid("option", "data", []);
	
	// 비손실 갱신 보험료 조정한도 산출결과
	$("#gridNonLossPrmRldm").jsGrid("reset");
	$("#gridNonLossPrmRldm").jsGrid("option", "data", []);
}


/**
 * @설명: 그리드 리로드
 * @최초작성자: 이준희
 * @최초작성일: 2026. 5. 21
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준희 2026. 5. 21 최초작성
 */

function reDrawGrid() {
	// 그리드 삭제
	$("#gridNonLossGoalRatRldm").jsGrid("destroy");
	$("#gridNonLossPrmRldm").jsGrid("destroy");
	
	// 그리드 생성
	initgridNoLossRatRldmRes();
	initgridNoLossRatRldmRtf();

}

/**
 * @설명: 손해율 비손실과정 산출결과 조회
 * @최초작성자: 이준희
 * @최초작성일: 2026. 5. 21
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준희 2026. 5. 21 최초작성
 */

function selectLossNonRatRldmList() {

	// 임시 조건
	var params = {};
	
	params.aplcBeNm = $('#ibx_aplcBeNm').val();
	console.log("ibx_aplcBeNm: ", params.aplcBeNm);
	
	if (params.aplcBeNm == '') {
		$.fn.msgBox('적용 BE를 입력해주세요.', function () {
		    $("#ibx_aplcBeNm").focus();
		});
		return;
	}

	// 적용BE - 글자수 제한(6)
	if (params.aplcBeNm.length > 7) {
		$.fn.msgBox('적용 BE 글자 수를 초과했습니다.', function () {
		    $("#ibx_aplcBeNm").focus();
		});
		return;
	}
	
    $.callAjax(params, "/be/pd/bepd127m/selectNonLossRatRldmList.do")
    .done(function(res) {
//    	if(rscRatCombo=="basRscRat") {
		// 그리드 초기화
		resetGrid();
		reDrawGrid();
		
		// 그리드 바인딩
		var gridNonLossGoalRatRldm = res.gridNonLossGoalRatRldm;
		var gridNonLossPrmRldm = res.gridNonLossPrmRldm;

		// 조회되지 않은 경우 - 비실손 갱신 목표손해율 산출결과
		if (gridNonLossGoalRatRldm == null || gridNonLossGoalRatRldm.length == 0) {
			$.fn.getReturnValue("gridNonLossGoalRatRldm");
		} else { // 조회 성공 시
	        $("#gridNonLossGoalRatRldm").jsGrid("loadData", gridNonLossGoalRatRldm);
		}
		
		// 조회되지 않은 경우 - 비실손 갱신 보험료 조정한도 산출결과
		if (gridNonLossPrmRldm == null || gridNonLossPrmRldm.length == 0) {
			$.fn.getReturnValue("gridNonLossPrmRldm");
		} else { // 조회 성공 시
	        $("#gridNonLossPrmRldm").jsGrid("loadData", gridNonLossPrmRldm);
		}
    }).fail(function(xhr, status, error) {
    	alert("서버 통신 실패! 서버 상태 확인");
    });
}


/**
* @설명: 비실손 갱신 목표손해율 산출결과 그리드 생성 및 초기화
* @최초작성자: 이준희
* @최초작성일: 2026. 5. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준희 2026. 5. 20. 최초작성
*/
function initgridNoLossRatRldmRes() {
	
	var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();

    var gridObjectNonLossRskRldm = new ComJsGrid({
        id: "gridNonLossGoalRatRldm",
        height: "100%",
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 

    // 그리드 생성
    gridObjectNonLossRskRldm.gridCreate();
    resizeMyGrid();
}


/**
* @설명: 비실손 갱신 보험료조정한도 산출결과 그리드 생성 및 초기화
* @최초작성자: 이준희
* @최초작성일: 2026. 5. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준희 2026. 5. 20. 최초작성
*/
function initgridNoLossRatRldmRtf() {
	
	var fieldsArr = getGridFields(2);
    var headerRowArr = getGridHederRow(2);

    var gridObjectNonLossRskRldm = new ComJsGrid({
        id: "gridNonLossPrmRldm",
        height: "100%",
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 

    // 그리드 생성
    gridObjectNonLossRskRldm.gridCreate();
    resizeMyGrid();
}


/**
* @설명: 조회구분에 따른 드리드 필드값을 리턴
* @최초작성자: 이준희
* @최초작성일: 2026. 5. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준희 2026. 5. 20. 최초작성
*/

function getGridFields(num) {
	
	// 적용 BE
    var aplcBeNm = $("#ibx_aplcBeNm").val(); 

    // 그리드 공통부분 필드
    if (num != 2) {
    	var resultArr = [
        	{ name: "lossDvlmtCltnProdGrCd", title:"손해진전계수산출집합코드", css:"cell", type: "select", width: 150, align:"center",
                itemTemplate:function(value, item) {
//                	var codeArr = $.fn.getGridCodeItem("RSK_RAT_LCLSF_CD");
//                	for(i=0; i<codeArr.length; i++) {
//                        if(value == codeArr[i].code) {
//                            return codeArr[i].codeAbbrNm;
//                        }
//                    }
                	return value;
                }
            },
        	{ name: "goalLossRat", title:"목표손해율", css:"cell", type: "text", width: 150, align:"center",
                itemTemplate:function(value, item) {

                	return $.fn.isEmpty(value) ? 0.00 : (value*100).toFixed(2) + "%";
//                	return (value*100).toFixed(2) + "%";
                }
            }
        ];
    } else {
    	var resultArr = [
        	{ name: "inscd", title:"INSCD", css:"cell", type: "text", width: 150, align:"center",
                itemTemplate:function(value, item) {
                	
                	return value;
                	
                }
            },
        	{ name: "prmCtrlLmtRat", title:"보험료조정한도율", css:"cell", type: "text", width: 100, align:"center",
                itemTemplate:function(value, item) {

                	return $.fn.isEmpty(value) ? 0.00 : (value*100).toFixed(2) + "%";
//                	return (value*100).toFixed(2) + "%";
                }
            },
        	{ name: "rtfAftPrmCtrlLmtRat", title:"보정후보험료조정한도율", css:"cell", type: "text", width: 100, align:"center",
                itemTemplate:function(value, item) {
                	
                	return $.fn.isEmpty(value) ? 0.00 : (value*100).toFixed(2) + "%";
//                	return (value*100).toFixed(2) + "%";
                }
            }
        ];
    }

    return resultArr;
}

/**
* @설명: 그리드 헤더 생성하여 리턴
* @최초작성자: 이준희
* @최초작성일: 2026. 5. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: $result : 그리드 헤더
* @개정이력: 
*  이준희 2026. 5. 20. 최초작성
*/

function getGridHederRow(num) {
	var $result = $("<tr class='jsgrid-header-row'>");
	
	if (num != 2) {
		$result.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("손해진전계수산출집합코드"))
		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("목표손해율"));
		
	} else {
		$result.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("INSCD"))
		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 100px;'>").text("보험료조정한도율"))
		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 100px;'>").text("보정후보험료조정한도율"));
	}
	
	return $result;
}

/**
* @설명: 윈도우 창 크기에 맞춰 데이터 그리드 영역 재설정
* @최초작성자: 이준희
* @최초작성일: 2026. 6. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준희 2026. 6. 15. 최초작성
*/
$(window).on('resize', function() {
	resizeMyGrid();
});

function getCalculatedHeight() {
	// 현재 창 크기
	var windowHeight = $(window).height();

	// 적용할 그리드 높이
	var gridHeight = windowHeight - 300;
	
	// 최소 높이 제한
	if (gridHeight < 200)
		gridHeight = 200;
	
	return gridHeight;
}


function resizeMyGrid() {
	var newHeight = getCalculatedHeight();
	
	// 데이터 그리드 영역 높이 조절
	$('#gridNonLossGoalRatRldm').css('height', newHeight + 'px');
	$('#gridNonLossPrmRldm').css('height', newHeight + 'px');
}
