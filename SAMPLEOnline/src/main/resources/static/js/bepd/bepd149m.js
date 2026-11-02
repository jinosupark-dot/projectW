/**
 * @시스템명: 가정관리
 * @업무명: 해지율 - 산출적용
 * @설명: 해지율 - 산출적용 화면의 JS
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 26.
 * @최종변경일: 2022. 5.  3.
 * @개정이력: 
 *  김광섭 2026. 5. 26. 최초작성
 */
//var condAplcBe;
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
////조회조건 콤보박스
//var rscRatCombo = "basRscRat";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    // 공통코드 조회(납입상태, 채널, 상품유형)
    $.fn.loadCommonCode(["RSC_RAT_PROD_SC_CD","BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD","BE_CHNL_SC_CD","BE_BLK_SC_CD"]);

    //적용BE 콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //해지증가효과
    initGridRtfBfc();
    
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
    //condAplcBeNm = $.fn.getAplcBe("sbx_aplcBe","03");
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
    //$("#div_hide").show();
    
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
    
    //해지증가효과:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download').on('click', function(e){
        if(gCondFlag == "N" || $("#gridDivRtfBfc").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond(1)) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = "해지증가효과_"+$("#ibx_aplcBeNm").val()+".xlsx";
        console.log(""+fileName);
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivRtfBfc',
                sheetName : "해지증가효과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X"/*,
                searchCond: $.fn.getSearchCondSub("PROD")*/
            },
            {
                id: 'gridDivRtfBfc',
                sheetName : "해지증가효과(코드)",
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
    var headerRowArr = getGridHederRow();
    
    var gridObjectRtfBfc = new ComJsGrid({
        id: "gridDivRtfBfc",
        height: 500,
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
	
	/*// 조회조건체크
	if(gReqParam.rscRatCombo != rscRatCombo) {
		return false;
	}*/
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
	$("#div_hide").show();
    
    // 조회에 필요한 값을 셋팅
    gReqParam.aplcBeNm = $("#ibx_aplcBeNm").val(); //적용BE 
//    gReqParam.rscRatCombo = rscRatCombo;
    
    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd149m/selectRscIncrEfcList.do")
    .done(function(data) {
    	// 그리드 초기화
    	resetGrid();
    	reDrawGrid();
    	//그리드 바인딩
    	var rtfBfcListData = data.rscIncrEfcList;
    	// 0건 그리드 메세지 처리부분
    	if(rtfBfcListData.length == 0) {
    		$.fn.getReturnValue("gridDivRtfBfc");
    	} else {
    		$("#gridDivRtfBfc").jsGrid("loadData", rtfBfcListData);
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
    //그리드 create
    initGridRtfBfc();
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
    
    //그리드 공통부분 필드
    var resultArr = [
    	{ name: "rscRatProdScCd", title:"해지율산출구분", css:"cell", type: "select", width: 130, align:"center",
    		itemTemplate:function(value, item) {
    			var codeArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
    			for(i=0; i<codeArr.length; i++) {
    				if(value == codeArr[i].code) {
    					return codeArr[i].codeAbbrNm;
    				}
    			}
    		}
    	},
    	{ name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 130, align:"center", 
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
    	{ name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 130, align:"center", 
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
    	{ name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 130, align:"center", 
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
    	{ name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 130, align:"center", 
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
    						return tmpCode.codeAbbrNm;
    					}
    				}
    			}
    		}
    	},
    	{ name: "dupayRefndRtoVal", title:"납입중환급금비율", css:"cell", type: "select", width: 130, align:"center",
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
    	{ name: "padAftRefndRtoVal", title:"납입후환급금비율", css:"cell", type: "select", width: 130, align:"center",
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
    	{ name: "reprPadPrd" , title: "납입기간", css:"cell", type: "text", width: 130, align:"center", sorter:"number", 
        	itemTemplate:function(value, item) {
        		if (value == "99") {
        			return "납기 통합산출";
        		} else {
        			return $.fn.isEmpty(value) ? "" : value + "년납";
        		}
        	}
    	},
    	{ name: "padPrd" , title: "실납입기간", css:"cell", type: "text", width: 130, align:"center", sorter:"number", 
        	itemTemplate:function(value, item) {
        		return $.fn.isEmpty(value) ? "" : value;
        	}
    	},
    	{ name: "fpayBefTyOversRscRat" , title: "완납 2년전", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
    		itemTemplate:function(value, item) {
    			return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    		}
    	},
    	{ name: "fpayBefOyOversRscRat" , title: "완납 1년전", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
    		itemTemplate:function(value, item) {
    			return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    		}
    	},
    	{ name: "fpayYrOversRscRat" , title: "완납시점", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
    		itemTemplate:function(value, item) {
    			return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    		}
    	},
    	{ name: "fpaySmtotOversRscRat" , title: "합계", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
    		itemTemplate:function(value, item) {
    			return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    		}
    	},
    	{ name: "fpayBefTyBeAssRat" , title: "종국해약률_완납 2년전", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
    		itemTemplate:function(value, item) {
    			return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    		}
    	},
    	{ name: "fpayBefOyBeAssRat" , title: "종국해약률_완납 1년전", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
    		itemTemplate:function(value, item) {
    			return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    		}
    	},
    	{ name: "fpayYrBeAssRat" , title: "종국해약률_완납시점", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
    		itemTemplate:function(value, item) {
    			return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    		}
    	},
    	{ name: "fpaySmtotBeAssRat" , title: "종국해약률_합계", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
    		itemTemplate:function(value, item) {
    			return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    		}
    	},
    	{ name: "addmLpsuEfcRat" , title: "추가해지상승효과", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
    		itemTemplate:function(value, item) {
    			return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    		}
    	},
    	{ name: "stnrdPadAftRscRat" , title: "표준형 납후 해지율", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
    		itemTemplate:function(value, item) {
    			return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    		}
    	},
    	{ name: "rscIncrEfcRat" , title: "해지증가효과", css:"cell", type: "text", width: 120, align:"right", sorter:"number", 
    		itemTemplate:function(value, item) {
    			return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
    		}
    	}
    	];
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
    for(var i=0; i<9; i++) {
        $result.append($("<th>").width(130))
    }
    //해외통계 열
    for(var i=0; i<4; i++) {
        $result.append($("<th>").width(120))
    }
    //종국해약률 열
    for(var i=0; i<4; i++) {
        $result.append($("<th>").width(120))
    }
    //나머지 열
    for(var i=0; i<3; i++) {
        $result.append($("<th>").width(120))
    }
    
    $result.append($("<th>").width(120));
    
    var selAplcBeNm = $("#ibx_aplcBeNm").val();
    $result = $result.add($("<tr class='jsgrid-header-row'>")
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("해지율산출구분"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("BLOCK"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입상태"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("채널유형"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입중환급금비율"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입후환급금비율"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입기간"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("실납입기간"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text("해외통계 "))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text("종국해약률 "))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("추가해지상승효과"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("표준형 납후 해지율"))
    		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("해지증가효과"))
    );
    var $result1 = $("<tr class='jsgrid-header-row'>");
    	$result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("완납 2년전"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("완납 1년전"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("완납시점"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("합계"))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("완납 2년전 "))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("완납 1년전 "))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("완납시점 "))
    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("합계 "));
    
    $result = $result.add($result1);
    
    return $result;
}

function resetAllGrd() {
	resetGrid();
    reDrawGrid();
}