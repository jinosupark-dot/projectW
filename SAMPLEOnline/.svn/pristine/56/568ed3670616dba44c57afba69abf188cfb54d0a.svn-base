/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 감액율 부가정보
 * @설명: 감액율 부가정보 화면 JS
 * @최초작성자: 이준용
 * @최초작성일: 2021. 07. 26.
 * @최종변경일: 
 * @개정이력:
 *  이준용 2021. 07. 26 최초작성
 */
var gCondSrchDiv = "1";
// 전역변수 선언부
var condAplcBe; //적용BE StartDt, EndDt
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";

$(document).ready(function(){
	/*2021.04.30 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/*2021.06.15 화면명에 화면ID 추가*/
//	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	$($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
	
	/*2021.06.15 버튼권한처리*/
	//검증실행
//	var btnIdArr = ["btn_vrfPrct"];
//	var permArr = [];
//	for (var i = 0; i < btnIdArr.length; i++) {
//		permArr.push({
//			btnId : "#" + btnIdArr[i]
//		});
//	}
//	$.fn.setBtnPermission(permArr);
	
	//공통코드(통합수준코드) 콤보박스
	initCommCd();
	
	//조회조건 초기화
	initSearchData();
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGridItem(1);
	initGridItem(2);
	
});

function initCommCd() {
	//채널별 콤보박스는 조회구분(상품유형 채널별 감액율 경과년도별 비중 에서만 보여준다)
	$("#divSel").hide();
	
	// 적용BE 조회
	condAplcBe = $.fn.getAplcBe("sbx_aplcBe","14");
	
	// 공통코드 조회(상품유형,채널)
	$.fn.loadCommonCode(["BE_NEW_LOB_CD","BE_CHNL_SC_CD"]);
	
    //콤보박스 세팅 - 신규LOB코드
    var beNewLobCdList = [];
    var tmpCdList = $._commonObj["code"]["BE_NEW_LOB_CD"];
    for(var i=0; i<tmpCdList.length; i++) {
        var tmpCd = tmpCdList[i];
        var newCd = {
                "code": tmpCd.code,
                "codeNm":tmpCd.codeAbbrNm
        }
        beNewLobCdList.push(newCd);
    }
    $._commonObj.code["BE_NEW_LOB_CD"] = beNewLobCdList;
    
    // 콤보박스 세팅
    $.fn.renderCombobox({
        codeArr: ["BE_NEW_LOB_CD"],
        selArr: ["sbx_srhGubun"],
        useFirstOption: false
    });
	
	// 콤보박스 세팅
//	$.fn.renderCombobox({
//		codeArr : ["BE_NEW_LOB_CD"],			//code id 배열
//		selArr : ["sbx_srhGubun"],			//selectbox id 배열
//		useFirstOption: false				//첫번째 option 사용여부
//	});
}

/**
 * @설명: event 초기화
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
 */

function initEvent() {
	//시작년월 입력창 blur
	$("#ibx_finYmFrom").on('blur', function(e) {
        var _this = this;
        //빈값 체크
        if($.fn.isEmpty(this.value)) {
        	 $("#ibx_finYmFrom").val(setFinYmFrom());
            return;
        }
        
    }).on("focus", function() {
        $(this).select();
    });
	
	//마감년월 입력창 blur
    $("#ibx_finYmTo").on('blur', function(e) {
        var _this = this;
        //빈값 체크
        if($.fn.isEmpty(this.value)) {
        	 $("#ibx_finYmTo").val(setFinYmTo());
            return;
        }
        
    }).on("focus", function() {
        $(this).select();
    });
    
    //시작년월 달력버튼 click
    $('#btn_finYmFrom').on('click', function(e){
        $('#ibx_finYmFrom').datepicker('show');
    });
    
    //죵료년월 달력버튼 click
    $('#btn_finYmTo').on('click', function(e){
        $('#ibx_finYmTo').datepicker('show');
    });
	
  //조회구분 변경 이벤트
	$("#sbx_srhType").on("change", function(e){
		if($("#sbx_srhType").val() == "6") {
			$("#divSel").show();
		} else {
			$("#divSel").hide();
		}
	});
    
    // 조회
    $('#btn_search').on('click', function(e){
        
    	 //조회년월 validation
        var condFinYmFrom = $("#ibx_finYmFrom").val();
        var condFinYmTo = $("#ibx_finYmTo").val();
        
        if(condFinYmFrom > condFinYmTo) {
            $.fn.msgBox("시작년월이 종료년월보다 클수 없습니다.");
            return;
        }

        if ($("#sbx_srhType").val() == "1") {
        	$("#titleNm1").text("상품유형별 경과년도별 비중(건수 기준)");
    		$("#titleNm2").text("상품유형별 경과년도별 비중(Driver 기준)");	
        	
        }
        if ($("#sbx_srhType").val() == "2") {
        	$("#titleNm1").text("채널유형별 경과년도별 비중(건수 기준)");
    		$("#titleNm2").text("채널유형별 감액율 경과년도별 비중(Driver 기준)");
        }
        if ($("#sbx_srhType").val() == "3") {
        	$("#titleNm1").text("경과월별 비중(건수 기준)");
    		$("#titleNm2").text("경과월별 비중(Driver 기준)");
        }
        if ($("#sbx_srhType").val() == "4") {
        	$("#titleNm1").text("상품유형별 경과월별 비중(건수 기준)");
    		$("#titleNm2").text("상품유형별 경과월별 비중(Driver 기준)");
        }
        if ($("#sbx_srhType").val() == "5") {
        	$("#titleNm1").text("상품유형별 연도별 비중(건수 기준)");
    		$("#titleNm2").text("상품유형별 연도별 비중(Driver 기준)");
        }	
        if ($("#sbx_srhType").val() == "6") {
        	$("#titleNm1").text("상품유형 채널별 경과년도별" +$("#sbx_srhGubun option:selected").text()+ "비중(건수 기준)");
    		$("#titleNm2").text("상품유형 채널별 경과년도별" +$("#sbx_srhGubun option:selected").text()+ "비중(Driver 기준)");
        }	
        selectRdctRatList();
    });

    // 엑셀다운로드
    $('#btn_exportExcel').on('click', function(e){
        //데이터 체크
        var dataList = $("#gridDiv1").jsGrid("option", "data");
        if(dataList.length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        if(gCondFlag == "N") {
        	$.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        if(!checkCond()) {
			$.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
			return;
		}
        
        let fileName = "감액율_" + $("#sbx_srhType option:selected").text() + ".xlsx";
    	 $.fn.exportMultiGridExcel([
             {
                 id: 'gridDiv1',
                 sheetName : "건수",
                 fileName: fileName, 
                 applyItemTemplate: true,
                 unit: "%",
                 searchCond: $.fn.getSearchCondSub("ADTN")
             },
             {
                 id: 'gridDiv2',
                 sheetName : "Driver",
                 fileName: fileName, 
                 applyItemTemplate: true,
                 unit: "%"
             },
             {
                 id: 'gridDiv1',
                 sheetName : "건수(코드)",
                 fileName: fileName, 
                 applyItemTemplate: false,
                 unit: "%"
             },
             {
                 id: 'gridDiv2',
                 sheetName : "Driver(코드)",
                 fileName: fileName, 
                 applyItemTemplate: false,
                 unit: "%"
             }
         ]);
    });
    
    //조회조건 엔터키 조회
    $("#search-item").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
    
    //조회구분 변경 이벤트
    $("#sbx_srhType").on("change", function(e){
        gCondSrchDiv = $("#sbx_srhType").val();
    });
    
    //그래프 클릭
    $("#btn_popGrp").on("click", function(e) {
        if(gCondFlag == "N") {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        openAdtnInfoGrpPopup();
    });
}

/**
 * @설명: 초기 데이타 세팅
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 7 최초작성
 */
function initSearchData() {
    // 시작년월, 종료년월
    $("#ibx_finYmFrom").val(setFinYmFrom());
    $("#ibx_finYmTo").val(setFinYmTo());
}

/**
 * @설명: 최종년월 셋팅 - 년도:현재년 -1년/ 월:6월(고정)
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 최종년월 ex.2020-06
 * @개정이력: 
 *  이준용 2021. 7. 7 최초작성
 */
function setFinYmTo() {
    var nowDate = new Date();
    var year = nowDate.getFullYear() - 1;
    var month = nowDate.getMonth();
    
    var temp = new Date(year, month, "1");
    temp.setMonth(6);
    
    month = temp.getMonth().toString();
    month = month.length == 1 ? "0" + month : month;
    
    var finYm = $.fn.monthFormat(year + month, "-");
    
    return finYm;
}

/**
 * @설명: 시작년월 셋팅 - 년도:종료년월-5년
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 최종년월 ex.2015-07
 * @개정이력: 
 *  이준용 2021. 7. 7 최초작성
 */
function setFinYmFrom() {
    var nowDate = new Date();
    var year = nowDate.getFullYear() - 6;
    var month = nowDate.getMonth();
    
    var temp = new Date(year, month, "1");
    temp.setMonth(6);
    
    month = (temp.getMonth() +1).toString();
    month = month.length == 1 ? "0" + month : month;
    
    var strYm = $.fn.monthFormat(year + month, "-");
    
    return strYm;
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
 */
function getGridFields(){
	var fieldArr = [];
	var beNewLobCdArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
    var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
    var fieldsArr;
    
    //전체 필드
    var allInfo = { name: "total", title:"전체", css:"cell", type: "text",  width: 100, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            }
    }
    
	if ($("#sbx_srhType").val() == "1") {
		fieldNm = "beNewLobCd";
		titleNm = "상품유형";
		itemNm = "BE_NEW_LOB_CD";
	} 
	 if ($("#sbx_srhType").val() == "2") {
		fieldNm = "beChnlScCd";
		titleNm = "채널유형";
		itemNm = "BE_CHNL_SC_CD";
	}
	
	if ($("#sbx_srhType").val() == "3") {
			fieldNm = "psgYys";
			titleNm = "경과기간";
	}
	if ($("#sbx_srhType").val() == "4") {
			fieldNm = "beNewLobCd";
			titleNm = "상품유형";
			itemNm = "BE_NEW_LOB_CD";
	}
	if ($("#sbx_srhType").val() == "5") {
		fieldNm = "beNewLobCd";
		titleNm = "상품유형";
		itemNm = "BE_NEW_LOB_CD";
	}
	if ($("#sbx_srhType").val() == "6") {
		fieldNm = "beChnlScCd";
		for(i=0; i<beNewLobCdArr.length; i++) {
			if($("select[id='sbx_srhGubun'] option:selected").val() == beNewLobCdArr[i].code) {
				titleNm = beNewLobCdArr[i].codeNm;
				break;
			}
		}
		
		itemNm = "BE_CHNL_SC_CD";
	}
	
	 if ($("#sbx_srhType").val() == "3") {
		 fieldArr = [
				{ name: fieldNm, title:titleNm, css:'cell', type: 'text', width: 60, align:'center', editing: false}
			]
		 fieldsArr = getPsgYysFieldsArr(targetArr);
		 fieldArr = fieldArr.concat(fieldsArr);
		 fieldArr.push(allInfo);
	 }
	
	 if ($("#sbx_srhType").val() == "1" || $("#sbx_srhType").val() == "2" || $("#sbx_srhType").val() == "4" || $("#sbx_srhType").val() == "6") {
		 if ($("#sbx_srhType").val() == "1" || $("#sbx_srhType").val() == "4") {
			 fieldArr = [
					{ name: fieldNm, title:titleNm, css:'cell', type: 'select', width: 60, align:'center', editing: false
						, items: $.fn.getGridCodeItem(itemNm), textField: "codeNm", valueField: "code",  itemTemplate:function(value, item) {
							var textField = "TOTAL";
							for(i=0; i<beNewLobCdArr.length; i++) {
								if(value == beNewLobCdArr[i].code) {
									textField = beNewLobCdArr[i].codeNm;
									break;
								}
							}
							return textField;
						}
					}
				]
		 } else {
			 fieldArr = [
					{ name: fieldNm, title:titleNm, css:'cell', type: 'select', width: 60, align:'center', editing: false
						, items: $.fn.getGridCodeItem(itemNm), textField: "codeNm", valueField: "code"}
				]
		 }
		 
		 fieldsArr = getPsgYysFieldsArr(targetArr);
		 fieldArr = fieldArr.concat(fieldsArr);
		 fieldArr.push(allInfo);
	 }
	 
	 if ($("#sbx_srhType").val() == "5") {
		var selAplcBe = $("#sbx_aplcBe").val();
		var finYFrom = "";
		var finYTo = ""

		for (var i = 0; i < condAplcBe.length; i++) {
			if (condAplcBe[i].aplcBeNm == selAplcBe) {
				finYFrom = condAplcBe[i].finStrYm;
				finYTo = condAplcBe[i].finEndYm;
				break;
			}
		}
		
		 fieldArr =  
				[
		    	    { name: fieldNm, title:titleNm, css:"cell", type: "select", width: 100, align:"center"
//		    	        , items: $.fn.getGridCodeItem(itemNm, true, "label", "", "TOTAL", "TOTAL"), textField: "codeNm", valueField: "code"},
		    	    	,  itemTemplate:function(value, item) {
		    	            var textField = "TOTAL";
		    	            for(i=0; i<beNewLobCdArr.length; i++) {
		    	                if(value == beNewLobCdArr[i].code) {
		    	                    textField = beNewLobCdArr[i].codeNm;
		    	                    break;
		    	                }
		    	            }
		    	            return textField;
		    	        }
		    	    }
				];
		 targetArr = $.fn.getFinYearArr(finYFrom, finYTo);
		 fieldsArr = getFieldsArr(targetArr);
		 fieldArr = fieldArr.concat(fieldsArr);
		 fieldArr.push(allInfo);

	}
	 return fieldArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 경과월 배열 
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function getPsgYysFieldsArr(targetArr) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    var addVal="";
    var txt = "차년";
    if($("#sbx_srhType").val() == "3" || $("#sbx_srhType").val() == "4") {
        txt = "차월"
    }
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        if (i==11) addVal = "+";
        var distStndValField = { name: "psgYys"+target , title: target+addVal+txt, css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }};
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function getFieldsArr(targetArr) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { 
                name: "finY" + i , title: target + "차년", css:"cell", type: "text", width: 140, align:"right", sorter:"number"
                    , itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
        };
        
        resultArr.push(distStndValField);
    }
    return resultArr;
}

/**
* @설명: 갱신율 - 부가정보 jsGrid 빈 테이블 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 7. 최초작성
*/
function initGridItem(val){
	// jsGrid 빈 테이블 생성
	var fieldsArr = getGridFields();
	var gridObject = new ComJsGrid({
		id: "gridDiv"+val,
		height: 300,
		editing: false,
		sorting: true,
		paging: false,
		selectHiglight:true,
		fields : fieldsArr
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 조회조건별 감액율 부가정보 - 상품종류별, 채널별 조회한다.
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
 */
function selectRdctRatList() {
	//조회년월 load start
	var selAplcBe = $("#sbx_aplcBe").val();
	var condFinYmFrom = "";
	var condFinYmTo = "";
	var list = {};
	
    //조회에 필요한 값을 셋팅
    var reqParam = {};
    
	for(var i=0; i<condAplcBe.length; i++) {
		
		if(condAplcBe[i].aplcBeNm == selAplcBe) {
			condFinYmFrom = condAplcBe[i].finStrYm;
			condFinYmTo = condAplcBe[i].finEndYm;
			break;
		}
	}
	if(condFinYmFrom == "" || condFinYmTo == "") {
		$.fn.msgBox("조회할 적용BE 구간이 존재하지 않습니다.");
		return;
	}
	
	//조회년월 load end
	var srchDiv = $("#sbx_srhType").val();
	
	reqParam.finYmFrom = condFinYmFrom;
	reqParam.finYmTo = condFinYmTo;
	reqParam.srchGubun = $("#sbx_srhGubun").val();
	reqParam.srchDiv = srchDiv;
	
    //적용BE 조회년도 
    var finYearArr = $.fn.getFinYearArr(condFinYmFrom, condFinYmTo);
    for(var i=0; i<5; i++) {
        reqParam["finY" + i] = finYearArr[i];
    }
    
    //엑셀 validation 체크용 오브젝트
    gReqParam.aplcBe = $("#sbx_aplcBe").val();
    gReqParam.srhType = $("#sbx_srhType").val();
    gReqParam.srhGubun = $("#sbx_srhGubun").val();
    
	//파라미터 세팅
	  $.callAjax(reqParam, "/be/pd/bepd263m/selectRdctRatList.do")
	    .done(function(data) {
	        // 그리드 초기화
	        resetGrid();
	        reDrawGrid();
	        
	        // 그리드 바인딩
	        var grid1List = data.cntList;
	        var grid2List = data.driverList;
	        
	        $("#gridDiv1").jsGrid("loadData", grid1List).done();
	        $("#gridDiv2").jsGrid("loadData", grid2List).done();
	        
	        // 0건 그리드 메세지 처리부분
			if(grid1List.length == 0){
				$.fn.getReturnValue("gridDiv1");
			}

			if(grid2List.length == 0){
				$.fn.getReturnValue("gridDiv2");
			}
			gCondFlag = "Y";
	    }).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to selectRdctRatProdList !!");
	});
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
 */
function resetGrid() {
	$("#gridDiv1").jsGrid("reset");
    $("#gridDiv1").jsGrid("option", "data", []);
    $("#gridDiv2").jsGrid("reset");
    $("#gridDiv2").jsGrid("option", "data", []);
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function reDrawGrid() {
    //그리드 destroy
    $("#gridDiv1").jsGrid("destroy");
    $("#gridDiv2").jsGrid("destroy");

    //그리드 create
    initGridItem(1);
    initGridItem(2);
}

/**
 * @설명: 시작년월 - 종료년월에 따른 해당 년도 리턴
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 14 최초작성
 */
function getFinYear(finYear) {
    var d =  new Date(finYear.substring(0,4), finYear.substring(5,7)-1);
    
    d.setMonth(d.getMonth()+6);
    
    return d.getFullYear();
}

/**
* @설명: 감액율 - 조회시 조건, 현재 조건 체크 
* @최초작성자: 임국빈
* @최초작성일: 2021. 9. 28.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  임국빈 2021. 9. 28. 최초작성
*/
function checkCond() {
    //적용BE체크
	if(gReqParam.aplcBe != $('#sbx_aplcBe').val()) {
		return false;
	}
	
    //조회구분체크
	if(gReqParam.srhType != $('#sbx_srhType').val()) {
		return false;
	}
	
    //조회기준체크
	if(gReqParam.srhGubun != $('#sbx_srhGubun').val()) {
		return false;
	}	
	return true;
}

/**
 * @설명: 그래프 팝업
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 16
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 16 최초작성
 */
function openAdtnInfoGrpPopup() {
    popupOption = {
            url: "/be/pd/bepd263p.do",
            name: "감액율 그래프 팝업",
            width: 1050,
            height: 850,
            sbxDiv: gCondSrchDiv,
            sbxNewLobCd: $("#sbx_srhGubun").val(),
            gridData1: $("#" + "gridDiv1").jsGrid("option", "data"),
            gridField1: $("#" + "gridDiv1").jsGrid("option", "fields"),
            gridData2: $("#" + "gridDiv2").jsGrid("option", "data"),
            gridField2: $("#" + "gridDiv2").jsGrid("option", "fields")
    }
    
    $.fn.openPopup(popupOption);
}