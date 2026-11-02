/**
 * @시스템명: 가정관리
 * @업무명: 해지율 - 산출적용
 * @설명: 해지율 - 산출적용 화면의 JS
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
var rscRatCombo = "skewness";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    // 공통코드 조회(납입상태, 채널, 상품유형)
    $.fn.loadCommonCode(["RSC_RAT_PROD_SC_CD","BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD","BE_CHNL_SC_CD","BE_BLK_SC_CD"]);

    //적용BE 콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //Skewness
    initGridSkewItm();
    initGridSkewRtfAftItm();
    
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
    $("#div_skew").show();
    
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
        
        let fileName = "Skewness산출결과_"+$("#ibx_aplcBeNm").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'skewItm',
                sheetName : "보정전 Skewness",//RTF_BEF
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"/*,
                searchCond: $.fn.getSearchCondSub("ADTN")*/
            },
            {
                id: 'skewRtfAftItm',
                sheetName : "보정후 Skewness",//RTF_AFT
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"
            },
            {
                id: 'skewItm',
                sheetName : "보정전 Skewness(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            },
            {
                id: 'skewRtfAftItm',
                sheetName : "보정후 Skewness(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            }
        ]);
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
* @설명: 해지율 - 산출적용 - Skewness jsGrid 빈 테이블 생성 
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
        height: 300,
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
function initGridSkewRtfAftItm(){
    
    var fieldsArr = getGridSkewFields();
    //var headerRowArr = getGridHederRow();
    
    var gridObjectSkewRtfAftItm = new ComJsGrid({
        id: "skewRtfAftItm",
        height: 300,
        editing: false,
        sorting: true,
        paging: true,
//        headerRowRenderer: function() {
//            return headerRowArr;
//        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectSkewRtfAftItm.gridCreate();
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
	$("#div_skew").show();
    
    // 조회에 필요한 값을 셋팅
    gReqParam.aplcBeNm = $("#ibx_aplcBeNm").val(); //적용BE 
    gReqParam.befAplcBeNm = (gReqParam.aplcBeNm.substr(0,4)-1)+"BE";
    gReqParam.rscRatCombo = rscRatCombo;

    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd148m/selectSkewnessList.do")
    .done(function(data) {

    	resetGrid3();
        reDrawGrid3();

        var rtfBefList = data.rtfBefList;
        var rtfAftList = data.rtfAftList;
        
        if(rtfBefList.length == 0) {
            $.fn.getReturnValue("skewItm");
        } else {
            $("#skewItm").jsGrid("loadData", rtfBefList);
        }
        if(rtfAftList.length == 0) {
            $.fn.getReturnValue("skewRtfAftItm");
        } else {
            $("#skewRtfAftItm").jsGrid("loadData", rtfAftList);
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
    //유보산출결과 
    $("#skewItm").jsGrid("reset");
    $("#skewItm").jsGrid("option", "data", []);
    //업로드
    $("#skewRtfAftItm").jsGrid("reset");
    $("#skewRtfAftItm").jsGrid("option", "data", []);
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
    $("#skewRtfAftItm").jsGrid("destroy");
    //그리드 create
    initGridSkewItm();
    initGridSkewRtfAftItm();
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
        { name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 120, align:"center",
            itemTemplate:function(value, item) {
                /*if(value=='ZZ') {
                    return 'TOTAL';
                } else if (value==null || value=='') {
                    return value;
                } else {
                    return $._commonObj["code"]["RSC_RAT_PROD_SC_CD"][value-1].codeNm;
                }*/
                for(i=0; i<rscRatProdScCdArr.length; i++) {
                    if(value == rscRatProdScCdArr[i].code) {
                        return rscRatProdScCdArr[i].codeNm;
                    }
                }
            }
        },
        { name: "lpdfeAplcYn", title:"해지유보적용여부", css:"cell", type: "text",  width: 120, align:"center",
        	itemTemplate:function(value, item) {
        		//console.log("해지유보적용여부 value=" + value);
        		//console.log("해지유보적용여부 item=" + item);
        		if ($.fn.isEmpty(value)) {
        			return "유보효과X";
        		} else if (value == "Y") {
        			return "유보효과O";
        		} else {
        			return "유보효과X";
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
        { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 120, align:"center", 
            itemTemplate:function(value, item) {
                if(value=='ZZ') {
                    if(item.beChnlScCd == 'ZZ') {
                        return '';
                    }
                    return 'TOTAL';
                } else if (value==null || value=='') {
                    return value;
                } else {
                    return $._commonObj["code"]["BE_NEW_LOB_CD"][value*1].codeAbbrNm;
                }
                return textField;
            }
        },
        { name: "dupayRefndRtoVal", title:"납입중환급금비율", css:"cell", type: "select", width: 120, align:"center",
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
        { name: "padAftRefndRtoVal", title:"납입후환급금비율", css:"cell", type: "select", width: 120, align:"center",
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
        { name: "padPrd", title:"납입기간", css:"cell", type: "text",  width: 120, align:"center",
        	itemTemplate:function(value, item) {
        		if (value == "99") {
        			return "납기 통합산출";
        		} else {
        			return $.fn.isEmpty(value) ? " " : value + "년납";
        		}
        	}
        },
        { name: "beMapnKey", title:"Mapping Key", css:"cell", type: "text",  width: 150, align:"center",
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
        var distStndValField = { name: "psgMntFgr" + target , title: target + "차월", css:"cell", type: "text", width: 80, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return value;
        }};
        resultArr.push(distStndValField);
    }
    return resultArr;
}

function resetAllGrd() {
    resetGrid3();
    reDrawGrid3();
}