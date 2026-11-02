/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 손해율 > 실손가정
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
    
    // 이벤트 초기화
    initEvent();
    
    // 실손가정 산출결과 테이블 생성
    initGridData();

    // 그리드 크기 조정
	resizeMyGrid();

    $(window).on('resize', function() {
    	resizeMyGrid();
    });

    // 시작 시 적용BE 포커스
    $("#ibx_aplcBeNm").focus();

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
	var serviceNm = "LOSS_RAT_RLDM";
	
	// 실손가정 산출결과 조회
	$('#btn_search').on('click', function(e) {
		selectLossRatRldmList();
	});
	
	// 배치 실행
	$('#btn_execBatch').on('click', function(e) {
		
		var reqParam = {};
		
        //적용BE
        reqParam.aplcBeNm = $("#ibx_aplcBeNm").val();
        
        if (reqParam.aplcBeNm == "") {
    		$.fn.msgBox('적용BE를 입력해주세요.', function() {
        	    $("#ibx_aplcBeNm").focus();
    		});
    		return;
        }
        
    	// 금지 키워드
    	if (reqParam.aplcBeNm.includes('BE_F')) {
    		$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
        	    $("#ibx_aplcBeNm").focus();
    		});
    		return;
    	}
        
        reqParam.batName=serviceNm;
        
        $.fn.msgBox('배치를 실행하시겠습니까?', function (obj) {
        	if (obj.btn_ok) {
        		$.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
        		.done(function(data) {
        			if(data.result == '0') {
        				//setTimeout(function() {
        				//	selectProdAplcList();
        		        //}, 6000);
        				resetGrid();
        				$.fn.msgBox('정상적으로 처리되었습니다.');
        			}
        			else if(data.result == '1') {
        				//setTimeout(function() {
        				//	selectProdAplcList();
        		        //}, 6000);
        				$.fn.msgBox('배치가 실패했습니다.');
        			}
        		}).fail(function(data){
        			$.fn.msgBox('배치가 실패했습니다.');
        		});
        	}
        }, 2);
		
	});

	// 실손가정 산출결과 엑셀 다운로드
	$('#btn_excel_download').on('click', function(e) {
        if($("#gridLossRatRldmRate").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.", function() {
        	    $("#ibx_aplcBeNm").focus();
            });
            return;
        }
        
		let fileName = "손해율_실손가정산출결과" + ".xlsx";

		$.fn.exportMultiGridExcel([
			{
                id: 'gridLossRatRldmRate',
                sheetName : "실손가정 산출결과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"
//                searchCond: {}
            }
		])

//		 테스트용 CSV
//		let fileName2 = "실손가정 산출결과_" + ".csv";
//		
//		var paramObj = {};
//		paramObj.id = 'gridLossRatRldmRate';
//		paramObj.fileName = fileName2;       
//		paramObj.applyItemTemplate = false;
//		$.fn.exportGridCSV(paramObj);
	});

	// 실손가정 산출결과 엑셀 업로드
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
    		$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다.', function() {
        	    $("#ibx_aplcBeNm").focus();
    		});
    		return;
    	}
    	
        paramObj.id = "gridLossRatRldmRate";                 //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수

        	if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {

                        console.log("로드데이터");
                        console.log(JSON.stringify(data["list"]));
                        
                    	data.list.forEach(item => {
                    		// 결정계수 00.00% -> 0.0000 형태로 바꾸기
                        	item.linAsptnDtrmCltnVal = parseFloat(item.linAsptnDtrmCltnVal.slice(0, -1)) / 100;
                        	item.logAsptnDtrmCltnVal = parseFloat(item.logAsptnDtrmCltnVal.slice(0, -1)) / 100;
                        	item.expnnAsptnDtrmCltnVal = parseFloat(item.expnnAsptnDtrmCltnVal.slice(0, -1)) / 100;
                        
                        	// 구분 매핑
//                        	if (item.rldmAssScCd == '보험금가정') {
//                        		item.rldmAssScCd = '1';
//                        	} else {
//                        		item.rldmAssScCd = '2';
//                        	}
                        	 
                        })
                        
//                        console.log(gArrCols);
//                        data["colList"] = gArrCols;
                        data["aplcBeNm"] = aplcBeNm;
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd126m/saveLossRatRldmList.do')
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
    
    // 엔터키 조회
    $("#ibx_aplcBeNm").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
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
	$("#gridLossRatRldmRate").jsGrid("reset");
	$("#gridLossRatRldmRate").jsGrid("option", "data", []);
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
	$("#gridLossRatRldmRate").jsGrid("destroy");
	
	// 그리드 생성
	initGridData();
}


/**
* @설명: 실손가정 산출결과 조회
* @최초작성자: 이준희
* @최초작성일: 2026. 5. 21.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준희 2026. 5. 21. 최초작성
*/

function selectLossRatRldmList() {
	
	// 조회 조건
	var params = {};
	
	params.aplcBeNm = $('#ibx_aplcBeNm').val();
	console.log("ibx_aplcBeNm: ", params.aplcBeNm);
	if (params.aplcBeNm == '') {
		$.fn.msgBox('적용BE를 입력해주세요.', function() {
		    $("#ibx_aplcBeNm").focus();
		});
		return;
	}

	// 적용BE - 글자수 제한(6)
	if (params.aplcBeNm.length > 7) {
		$.fn.msgBox('적용BE 글자 수를 초과했습니다.', function() {
		    $("#ibx_aplcBeNm").focus();
		});
		return;
	}
    
    $.callAjax(params, "/be/pd/bepd126m/selectLossRatRldmList.do")
    .done(function(res) {
		// 그리드 초기화
		resetGrid();
		reDrawGrid();
    		
		// 그리드 바인딩
		var lossRatRldmRateData = res.gridLossRatRldmRate;
		
		// 조회되지 않은 경우
		if (lossRatRldmRateData == null || lossRatRldmRateData.length == 0) {
			$.fn.getReturnValue("gridLossRatRldmRate");
		} else { // 조회 성공 시
			$("#gridLossRatRldmRate").jsGrid("loadData", res.gridLossRatRldmRate);
		
			
			console.log("searching window Size: " + $(window).height());
		}

		console.log("조회된 데이터 목록: ", res.gridLossRatRldmRate);
    	
    }).fail(function(xhr, status, error) {
    	alert("서버 통신 실패! 서버 상태 확인");
    });
}

/**
* @설명: 데이터그리드 생성 및 초기화
* @최초작성자: 이준희
* @최초작성일: 2026. 5. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준희 2026. 5. 20. 최초작성
*/

function initGridData() {
	
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();

    var gridObjectLossRskRldm = new ComJsGrid({
        id: "gridLossRatRldmRate",
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
    gridObjectLossRskRldm.gridCreate();
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

function getGridFields() {
	
	// 적용 BE
    var aplcBeNm = $("#ibx_aplcBeNm").val(); 

    // 그리드 공통부분 필드
    var resultArr = [
    	{ name: "rskPrmProdCd", title:"RSK_PRM_PROD_CD", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
//            	var codeArr = $.fn.getGridCodeItem("OLD_RSK_PRM_CD");
//            	for(i=0; i<codeArr.length; i++) {
//                    if(value == codeArr[i].code) {
//                        return codeArr[i].codeAbbrNm;
//                    }
//                }
            	return value;
            }
        },
    	{ name: "rskPrmProdCdExpln", title:"담보명", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
            	
                return value;
            }
        },
    	{ name: "rldmAssScCd", title:"구분", css:"cell", type: "select", width: 100, align:"center",
            itemTemplate:function(value, item) {
            	
            	if (value == '1') {
            		return "보험금가정"
            	} else {
            		return "갱신보험료가정"
            	}
            	
            }
        },
    	{ name: "beSxdsCd", title:"성별", css:"cell", type: "select", width: 50, align:"center",
            itemTemplate:function(value, item) {
            	
                return value;
            }
        },
    	{ name: "linAsptnDtrmCltnVal", title:"선형결정계수", css:"cell", type: "text", width: 120, align:"center",
            itemTemplate:function(value, item) {
            	
                return (value*100).toFixed(2) + "%";
            }
        },
    	{ name: "logAsptnDtrmCltnVal", title:"로그결정계수", css:"cell", type: "text", width: 120, align:"center",
            itemTemplate:function(value, item) {
            	
                return (value*100).toFixed(2) + "%";
            }
        },
    	{ name: "expnnAsptnDtrmCltnVal", title:"지수결정계수", css:"cell", type: "text", width: 120, align:"center",
            itemTemplate:function(value, item) {
            	
                return (value*100).toFixed(2) + "%";
            }
        },
    	{ name: "rldmAssAsptnScCd", title:"최종모형", css:"cell", type: "select", width: 100, align:"center",
            itemTemplate:function(value, item) {
            	
            	if (value == '1') {
            		return "선형"
            	} else if (value == '2') {
            		return "로그"
            	} else {
            		return "지수"
            	}
            	
            }
        }
    ];
    var colNm = "psgYys";
    var targetArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
    var titleArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
    var fieldsArr = getPsgNtsFieldsArr(targetArr, titleArr, colNm, aplcBeNm);
    resultArr = resultArr.concat(fieldsArr);

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

function getGridHederRow() {
	var $result = $("<tr class='jsgrid-header-row'>");
	$result.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("RSK_PRM_PROD_CD"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 150px;'>").text("담보명"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 100px;'>").text("구분"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 50px;'>").text("성별"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("선형결정계수"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("로그결정계수"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 120px;'>").text("지수결정계수"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 100px;'>").text("최종모형"));
	
	
	$result.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("1차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("2차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("3차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("4차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("5차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("6차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("7차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("8차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("9차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("10차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("11차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("12차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("13차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("14차년"))
	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 80px;'>").text("15차년"));

	return $result;
}


/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이준희
 * @최초작성일: 2026. 5. 20
 * @최종변경일: 
 * @매개변수: targetArr<array> : 경과월 배열 
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준희 2026. 5. 20 최초작성
 */
function getPsgNtsFieldsArr(targetArr, titleArr, colNm) {
	if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titleArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: colNm + target , title: titleArr[i] + "차년", css:"cell", type: "text", width: 80, align:"right", sorter:"number", 
                itemTemplate:function(value, item) {
//                	console.log("차년별 value=" + value);
//                	console.log("차년별 item=" + item.cd);
                	
                	return $.fn.isEmpty(value) ? 0.00 : (value*100).toFixed(2) + "%";
                }
        };
   
        resultArr.push(distStndValField);
    }
    return resultArr;
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
	
	// 최소 높이
	if (gridHeight < 200)
		gridHeight = 200;
	
	return gridHeight;
}


function resizeMyGrid() {
	var newHeight = getCalculatedHeight();
	
	// 데이터 그리드 영역 높이 조절
	$('#gridLossRatRldmRate').css('height', newHeight + 'px');
}

