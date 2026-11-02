/**
 * @시스템명: 가정관리
 * @업무명: 해지율 - 기초데이터
 * @설명: 해지율 - 기초데이터 화면의 JS
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 05. 08.
 * @최종변경일: 2026. 05. 08.
 * @개정이력: 
 *  김광섭 2026. 05. 08. 	최초작성'
 */
//전역변수
//var gCondHichyCheck = [];
var gArrCols = [];
//서비스코드 정의
var serviceCode = "03";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//one-off플래그
//var gCondOneoffCheck = "N";
//3년제외플래그
//var gCondY3ExcluCheck = "N";
//조회조건 콤보박스
var gRscRatCombo = "addmLpsuEfc";
// 집계기준구분코드
//var gSmupStnd = "02";
// 적용BE
var gAplcBeNm = "";
//var gTbNm = "TB_IBECIF17";//해지율가정산출키추가해지상승효과기본

// 추가해지상승효과 그리드 클릭시 설정
var gBeChnlScCd = "";
var gBeNewLobCd = "";
var gPadPrd     = "";
var gAddmLpsuEfcRat    = "";
var gDupayRefndRtoVal  = "";
var gPadAftRefndRtoVal = "";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //datepickerSetting세팅
    $.fn.getTbDateInfo(serviceCode);
    
   // 공통코드 조회(납입유형,상품유형,채널,BLOCK)
    $.fn.loadCommonCode(["RSC_RAT_PROD_SC_CD","BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD","BE_CHNL_SC_CD","BE_BLK_SC_CD","INSCD_SC_CD","BE_ADDM_LPSU_EFC_RFLT_PNTM_CD","NEW_LOB_CD"]);

    //조회조건 초기화
    initSearchData();
    
    //event 초기화
    initEvent();
    
    //조회조건별 추가해지상승효과 그리드 초기화 
    initGridPryRate();
    
    //조회조건별 상품정보 그리드 초기화 
    initGridNmrtItem();
    
    // 시작 시 적용BE 포커스
    $("#ibx_aplcBeNm").focus();
    
});

function initEvent() {
    $("#div_hide").show();
    
    var serviceNm="RSC_RAT";
    
    // 적용BE 변경이벤트
    $("#ibx_aplcBeNm").on("change", function(e){
    	gAplcBeNm = $("#ibx_aplcBeNm").val();
    });
    
    // 조회
    $("#btn_search").on("click", function(e){
    	//적용BE validation
    	if ($.fn.isEmpty($("#ibx_aplcBeNm").val())) {
    		$.fn.msgBox("적용BE를 입력하세요.");
    		return;
    	}
    	
    	selectRscRatPryRateList();
        
    });
    
    // 엑셀다운로드
    $("#btn_excel_download").on("click", function(e){
        if(gCondFlag == "N" || $("#gridDivNmrtItem").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        } else if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        var unit = "X";
        var fileName = $("#sbx_rscRat option:selected").text() + "_" + $("#sbx_smupStnd option:selected").text() + "_" +
                       $("#titlPryRat").text() + "_" + $("#titlNmrtItm").text() + " .xlsx";
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivNmrtItem',
                sheetName : "추가해지상승효과",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"/*,
                searchCond: $.fn.getSearchCond(gReqParam)*/
            },
            {
                id: 'gridDivNmrtItem',
                sheetName : "추가해지상승효과(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "X"
            } 
        ]);
    });
    
    //엑셀업로드 클릭
    $("#btn_excel_upload").on("click", function(e){
//        if(gArrCols.length == 0) {
//            $.fn.msgBox("양식다운로드를 한 후 엑셀업로드를 해주세요.");
//            return;
//        }
        var paramObj = {};
        
        paramObj.id = "gridTmpDiv";                 //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        console.log("로드데이터");
                        console.log(JSON.stringify(data["list"]));
                        console.log(gArrCols);
                        data["colList"] = gArrCols;
                        data["tbNm"] = "TB_IBECIF17";
                        data["menuId"] = $.fn.getMenuId();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveDtList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                                selectRscRatPryRateList();
                            }
                        }).fail(function(data){
                            $.fn.msgBox('데이터 저장이 실패했습니다.');
                        });
                    }
                }, 2);
            }
        };
        $.fn.BeloadGridExcel(paramObj);
        
    });
    
    //조회조건 엔터키 조회
    $("#ibx_aplcBeNm").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
    
}

/**
* @설명: 조회시 조건, 현재 조건 체크 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 09. 최초작성
*/
function checkCond() {
    // 조회조건체크
    if(gReqParam.aplcBeNm != gAplcBeNm) {
        return false;
    }
    return true;
}

/**
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 09.. 최초작성
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
    
    //row click
    gridObjectPryRate.rowClick(function(args) {
    	grdObj = args.item;
    
    	gBeChnlScCd = grdObj.beChnlScCd;
    	gBeNewLobCd = grdObj.beNewLobCd;
    	gPadPrd     = grdObj.padPrd;
    	gAddmLpsuEfcRat    = grdObj.addmLpsuEfcRat;
    	gDupayRefndRtoVal  = grdObj.dupayRefndRtoVal;
    	gPadAftRefndRtoVal = grdObj.padAftRefndRtoVal;
    	
    	fnSelectDtlInfo();
    }); 
    
    //그리드 생성
    gridObjectPryRate.gridCreate();
}

/**
* @설명: 해지율 - 기초데이터 jsGrid 빈 테이블 생성 
* @최초작성자: 김광섭
* @최초작성일: 2026. 5. 9.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김광섭 2026. 5. 9. 최초작성
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
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 9
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김광섭 2026. 5. 9 최초작성
 */
function getGridFields(num) {
    //코드 목록
    var fpayYnScCdArr = $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD");
    var rscRatProdScCdArr = $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD");
    //그리드 공통부분 필드
    var resultArr = [];
    
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
    
    //납입중환급금비율 필드
    var dupayRefndRtoVal = { 
            name: "dupayRefndRtoVal", title:"납입중환급금비율", css:"cell", type: "text", width: 150, align:"center",
            itemTemplate:function(value, item) {
            	return value;
            }
    };
    
    //납입후환급금비율
    var padAftRefndRtoVal = { 
            name: "padAftRefndRtoVal", title:"납입후환급금비율", css:"cell", type: "text", width: 150, align:"center",
            itemTemplate:function(value, item) {
            	return value;
            }
    };
    
    //납입기간 - 납입주기
    var padCyl = { name: "padPrd", title:"납입기간", css:"cell", type: "text",  width: 170, align:"center",
            itemTemplate:function(value, item) {
            	return $.fn.isEmpty(value) ? "" : (value=="99") ? "납기 통합산출": Number(value) + "년납";
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

    //BLOCK 필드
    var blkScCd = { 
            name: "beBlkScCd", title:"BLOCK", css:"cell", type: "select", width: 150, align:"center",
            itemTemplate:function(value, item) {
                	var codeArr = $.fn.getGridCodeItem("BE_BLK_SC_CD");
                    for(i=0; i<codeArr.length; i++) {
                        if(value == codeArr[i].code) {
                            return codeArr[i].codeAbbrNm;
                        }
                    }
            }
    };
 
    //납입상태 필드
    var fpayYnScCd = { 
            name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 120, align:"center",
            itemTemplate:function(value, item) {
                    for(i=0; i<fpayYnScCdArr.length; i++) {
                        if(value == fpayYnScCdArr[i].code) {
                            return fpayYnScCdArr[i].codeNm;
                        }
                    }
                    return value;
            }
    };
    //채널유형 필드
    var beChnlScCd = {
            name: "beChnlScCd", title:"채널", css:"cell", type: "select", width: 80, align:"center",
            itemTemplate:function(value, item) {
            	var tmpCodeDataList = $._commonObj["code"]["BE_CHNL_SC_CD"];
                	for(var i=0; i<tmpCodeDataList.length; i++) {
        				var tmpCode = tmpCodeDataList[i];
        				if (tmpCode.code == value){
        					return tmpCode.codeNm;
        				}
        			}
            }
    };
    //상풍유형 필드
    var newLobCd = { 
            name: "beNewLobCd" , title:"상품" , css:"cell", type: "select", width: 100, editing: false, align:"center",
            itemTemplate:function(value, item) {
            	   var codeArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
                   for(i=0; i<codeArr.length; i++) {
                       if(value == codeArr[i].code) {
                           return codeArr[i].codeAbbrNm;
                       }
                   }
            }
    };
    var inscdScCd = { 
            name: "inscdScCd", title:"주특구분", css:"cell", type: "select", width: 80, align:"center",
            itemTemplate:function(value, item) {
            	var codeArr = $.fn.getGridCodeItem("INSCD_SC_CD");
                for(i=0; i<codeArr.length; i++) {
                    if(value == codeArr[i].code) {
                        return codeArr[i].codeAbbrNm;
                    }
                }
            }
    };
    var beAddmLpsuEfcRfltPntmCd = { 
            name: "beAddmLpsuEfcRfltPntmCd", title:"추가해지상승반영시점", css:"cell", type: "select", width: 140, align:"center",
            itemTemplate:function(value, item) {
            	var codeArr = $.fn.getGridCodeItem("BE_ADDM_LPSU_EFC_RFLT_PNTM_CD");
                for(i=0; i<codeArr.length; i++) {
                    if(value == codeArr[i].code) {
                        return codeArr[i].codeAbbrNm;
                    }
                }
            }
    };
    
    // 추가해지상승효과
    if (num == 1) {
    	var field = {name:"aplcBeNm", title:"BE", css:"cell", type:"text", width:120, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "":value;
    			}
    	}
    	resultArr.push(field);
    	
        resultArr.push(beChnlScCd); //채널
        resultArr.push(newLobCd);  //LOB
        
    	var field = {name:"dupayRefndRtoVal", title:"납입중환급률", css:"cell", type:"text", width:120, align:"center", sorter:"number",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "":value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"padAftRefndRtoVal", title:"납입후환급률", css:"cell", type:"text", width:120, align:"right", sorter:"number",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"padPrd", title:"납입기간", css:"cell", type:"text", width:120, align:"right", sorter:"number",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	resultArr.push(beAddmLpsuEfcRfltPntmCd); //추가해지상승반영시점 코드명
    	
    	var field = {name:"beAddmLpsuEfcRfltPntmCd", title:"추가해지상승반영시점2", css:"cell", type:"text", width:140, align:"right", sorter:"number",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"addmLpsuEfcRat", title:"추가해지상승효과", css:"cell", type:"text", width:120, align:"right", sorter:"number",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"prcbsStnrdObjYn", title:"실무표준대상여부", css:"cell", type:"text", width:120, align:"right", sorter:"number",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    } 
    // 추가해지상승효과 - 상품정보
    else {
    	var field = {name:"newLobCd", title:"신규LOB코드", css:"cell", type:"text", width:100, align:"center",
                itemTemplate:function(value, item) {
             	   var codeArr = $.fn.getGridCodeItem("NEW_LOB_CD");
                    for(i=0; i<codeArr.length; i++) {
                        if(value == codeArr[i].code) {
                            return codeArr[i].codeAbbrNm;
                        }
                    }
             }
    	}
    	resultArr.push(field);
    	
    	var field = {name:"fssPrcdNm", title:"금감원상품코드명", css:"cell", type:"text", width:120, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"fssPrcd", title:"금감원상품코드", css:"cell", type:"text", width:100, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"prcd", title:"상품코드", css:"cell", type:"text", width:80, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"prdtNm", title:"상품명", css:"cell", type:"text", width:200, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"prdtSaleBgnYmd", title:"상품판매개시일자", css:"cell", type:"text", width:120, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"prdtSaleEndYmd", title:"상품판매종료일자", css:"cell", type:"text", width:120, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"inscd", title:"보험코드", css:"cell", type:"text", width:80, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"insrNm", title:"보험명", css:"cell", type:"text", width:200, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
//    	var field = {name:"inscdScCd", title:"주특구분", css:"cell", type:"text", width:120, align:"center",
//    			itemTemplate:function(value, item) {
//    				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
//    			}
//    	}
//    	resultArr.push(field);
//    	resultArr.push(inscdScCd); //주특구분
    	
    	var field = {name:"insrSaleBgnYmd", title:"보험판매개시일자", css:"cell", type:"text", width:120, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"insrSaleEndYmd", title:"보험판매종료일자", css:"cell", type:"text", width:120, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"dupayRefndRtoVal", title:"납입중환급률값", css:"cell", type:"text", width:120, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"padAftRefndRtoVal", title:"납입후환급률값", css:"cell", type:"text", width:120, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"prcbsStnrdObjYn", title:"실무표준기준대상여부", css:"cell", type:"text", width:120, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"beAddmLpsuEfcRfltPntmCd", title:"추가해지적용시점", css:"cell", type:"text", width:120, align:"center",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    	
    	var field = {name:"addmLpsuEfcRat", title:"추가해지상승효과", css:"cell", type:"number", width:120, align:"right",
    			itemTemplate:function(value, item) {
    				return $.fn.isEmpty(value) ? "" : value;
    			}
    	}
    	resultArr.push(field);
    }

    return resultArr;
}

/**
 * @설명: gridTable의 header조회
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 9
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 9 최초작성
 */
function isEmpty(value) {
    if(typeof value === "undefined" || value == null || value == "") {
        value = "";
    }
    return value;
}

function selectRscRatPryRateList(){
    // 조회에 필요한 값을 셋팅
    gReqParam.aplcBeNm = gAplcBeNm;//$('#ibx_aplcBeNm').val().trim()

    // 기간계 데이터 조회
   $.callAjax({"jsonStr":JSON.stringify(gReqParam)}, "/be/pd/bepd145m/selectAddmLpsuEfcAdvList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        reDrawGrid();
        // 그리드 바인딩
        if(gRscRatCombo=='addmLpsuEfc') {  //추가해지상승효과
            var rateListData = data.rateList;
            if(rateListData == null || rateListData.length == 0) {
                $.fn.getReturnValue("gridDivPryRate");
            } else {
                $("#gridDivPryRate").jsGrid("loadData", rateListData);
            }
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
    });
}

/**
 * @설명: 초기 조회일자 세팅
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 9
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2026. 5. 9 최초작성
 */
function initSearchData() {
    reqParam = {
            "serviceCode" : serviceCode
    }
    $.callAjax(reqParam, "/be/pd/commonBe/settingFirstDate.do")
    .done(function(data) {
        var tbDateInfo = data.tbDateInfo;
//        $('#ibx_finYmFrom').val($.fn.monthFormat(tbDateInfo[0].finStrYm));
//        $("#ibx_finYmTo").val($.fn.monthFormat(tbDateInfo[0].finEndYm));
    });
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 9
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 9 최초작성
 */
function resetGrid() {
        $("#gridDivPryRate").jsGrid("option", "data", []);
        $("#gridDivPryRate").jsGrid("reset");
        
        $("#gridDivNmrtItem").jsGrid("option", "data", []);
        $("#gridDivNmrtItem").jsGrid("reset");
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 김광섭
 * @최초작성일: 2026. 5. 9
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김광섭 2026. 5. 9 최초작성
 */
function reDrawGrid() {
    //그리드 destroy
    $("#gridDivPryRate").jsGrid("destroy");
    $("#gridDivNmrtItem").jsGrid("destroy");
    //그리드 create
    initGridPryRate();
    initGridNmrtItem();
}

/**
* @설명: 추가해지상승효과 상품정보 조회
* @최초작성자: 김광섭
* @최초작성일: 2026. 05. 09.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2026. 05. 09. 최초작성
*/
function fnSelectDtlInfo(){
    // 조회에 필요한 값을 셋팅
    var reqParam = {
            "aplcBeNm" : gAplcBeNm,
            "beChnlScCd" : gBeChnlScCd,
            "beNewLobCd" : gBeNewLobCd,
            "padPrd"     : gPadPrd,
            "addmLpsuEfcRat"    : gAddmLpsuEfcRat,
            "dupayRefndRtoVal"  : gDupayRefndRtoVal,
            "padAftRefndRtoVal" : gPadAftRefndRtoVal
        };
    
    $.callAjax(reqParam, "/be/pd/bepd145m/selectAddmLpsuEfcPrcdAdvList.do")
    .done(function(data) {
    	gTmpData = {};
     // 초기화
        $("#gridDivNmrtItem").jsGrid("reset");
        $("#gridDivNmrtItem").jsGrid("option", "data", []);
        
        $("#gridDivNmrtItem").jsGrid("destroy");
        
        initGridNmrtItem();
        
    	// 서버로 받아온 데이터 리스트
    	var prcdList = data.prcdList;
    	
    	// 0건 그리드 메세지 처리부분
    	if(prcdList == null || prcdList.length == 0){
            $.fn.getReturnValue("gridDivNmrtItem");
        } else {
            $('#gridDivNmrtItem').jsGrid('reset');
            initGridNmrtItem();
            $('#gridDivNmrtItem').jsGrid('loadData', prcdList);
        }
    	
    }).fail(function(data){
        console.log("fail to selectTableSchemaInfo");
    }); 
}
