/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 사업비율 - 부가정보
 * @설명: 사업비율 - 부가정보 화면의 JS
 * @최초작성자: 이현수
 * @최초작성일: 2021. 8. 2.
 * @최종변경일: 
 * @개정이력: 
 *  이현수 2021. 8. 2. 최초작성
 */
var condAplcBe; //적용BE StartDt, EndDt
//조회flag
var gCondFlag = "N";
var gPotflScCdList;
var gChnlScCdList;

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    // 공통코드 조회(사업비배부그룹, 사업비채널코드, 포트폴리오, 사업비)
    $.fn.loadBeCmmnCode(["WRKEX_COCNT_DIST_CHNL_CD", "BE_WRKEX_CHNL_SC_CD", "BE_WRKEX_POTFL_SC_CD", "BE_WRKEX_ITM_CD"]);
    
    //콤보박스 세팅
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //Grid초기화
    initGrid();
    
    //셀렉트박스 컨트롤
    //콤보박스 세팅
    initComboBox();
    ctlInqrScCond("");
});

/**
* @설명: 콤보박스 초기화
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initCommCd() {
    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","02");
}

/**
 * @설명: 콤보박스 초기화
 * @최초작성자: 이현수
 * @최초작성일: 2021. 8. 3
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 8. 3 최초작성
 */
function initComboBox(inqrSc) {
	var firstOptionText = "";

    //사업비배부채널코드, 사업비채널
    $.fn.loadBeCmmnCode(["BE_WRKEX_POTFL_SC_CD","BE_WRKEX_CHNL_SC_CD"]);	
	
    //조회구분:Consolidated
    if(inqrSc == "01") {
    	firstOptionText = ["-전체-"];
    //그외
    } else {
    	firstOptionText = ["-선택-"];
    }
    
    //콤보박스 세팅 - 채널코드 설정
    var newChnlScCdList = [];
    gChnlScCdList = $._commonObj["code"]["BE_WRKEX_CHNL_SC_CD"];
    var tmpChnlScCdList = $._commonObj["code"]["BE_WRKEX_CHNL_SC_CD"];
    for(var i=0; i<tmpChnlScCdList.length-1; i++) {
    	if("ZZ" == tmpChnlScCdList[i]["code"]){
    		tmpChnlScCdList.splice(i, 1);
    	} else {
    		var tmpChnlCd = tmpChnlScCdList[i];
    		var newChnlCd = {
    				"code": tmpChnlCd.code,
    				"codeNm": tmpChnlCd.codeAbbrNm,
    		}
    	}
    	newChnlScCdList.push(newChnlCd);
    }
    $._commonObj.code["BE_WRKEX_CHNL_SC_CD"] = newChnlScCdList;
    
    // 콤보박스 세팅
    $.fn.renderCombobox({
        codeArr: ["BE_WRKEX_CHNL_SC_CD"],
        selArr: ["sbx_beWrkexChnlScCd"],
        firstOptionText: firstOptionText
    });      
    
    //콤보박스 세팅 - 포트폴리오 설정
    var newPotflScCdList = [];
    gPotflScCdList = $._commonObj["code"]["BE_WRKEX_POTFL_SC_CD"];
    var tmpPotflCdList = $._commonObj["code"]["BE_WRKEX_POTFL_SC_CD"];
    
    for(var i=0; i<tmpPotflCdList.length-1; i++) {
    	if("TOTAL" == tmpPotflCdList[i]["code"]){
    		tmpPotflCdList.splice(i, 1);
    	} else {
    		var tmpPotflCd = tmpPotflCdList[i];
    		var newPotflCd = {
    				"code": tmpPotflCd.code,
    				"codeNm": tmpPotflCd.codeAbbrNm,
    		}
    	}
        newPotflScCdList.push(newPotflCd);
    }
    $._commonObj.code["BE_WRKEX_POTFL_SC_CD"] = newPotflScCdList;
    
    // 콤보박스 세팅
    $.fn.renderCombobox({
        codeArr: ["BE_WRKEX_POTFL_SC_CD"],
        selArr: ["sbx_bePotflScCd"],
        firstOptionText: firstOptionText
    });    
    
    
}
/**
* @설명: event 초기화
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 26. 최초작성
*/
function initEvent() {
    // 조회
    $('#btn_search').on('click', function(e){
        selectWrkexRatProdAplcList();
    });
    
    //부가정보:엑셀다운로드(타이틀.xlsx)
    $('#btn_excel_download').on('click', function(e){
        //데이터 체크
        var dataList = $("#gridDiv").jsGrid("option", "data");
        if(dataList.length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        if(gCondFlag == "N") {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        var title1 = "";
        var title2 = "";
        var title3 = "";
        //
        if($("#sbx_inqrSc").val() == "01") {
            title1 = $("#sbx_inqrSc option:selected").text();
            title2 = "_" + $("#sbx_conSolScCd option:selected").text();
            if($("#sbx_beWrkexChnlScCd").val() != "") {
                title3 = "_" + $("#sbx_beWrkexChnlScCd option:selected").text();
            } else {
                title3 = "_" + "전체";
            }
        } else {
            title1 = $("#sbx_inqrSc option:selected").text();
            title2 = "_" + $("#sbx_beWrkexChnlScCd option:selected").text();
            title3 = "_" + $("#sbx_bePotflScCd option:selected").text();
        }

        let fileName = "사업비율_부가정보_"+title1 + title2 + title3 + ".xlsx";
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDiv',
                sheetName : "부가정보",
                fileName: fileName,
                applyItemTemplate: true,
                unit: "%, 원",
                searchCond: $.fn.getSearchCondSub("ADTN")
            },
            {
                id: 'gridDiv',
                sheetName : "부가정보(코드)",
                fileName: fileName,
                applyItemTemplate: false,
                unit: "%, 원",
                searchCond: $.fn.getSearchCondSub("ADTN")
            }
        ]);
    });
    
    //조회구분
    $("#sbx_inqrSc").on("change", function(e){
        var inqrSc = $(this).val();
        ctlInqrScCond(inqrSc);  //조회구분
    });
}

/**
* @설명: 사업비율 - jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 26. 최초작성
*/
function initGrid(beWrkexChnlScCd, beWrkexPotflScCd){
    
    var fieldsArr = getGridFields(beWrkexPotflScCd);
    var headerRowArr = getGridHederRow(beWrkexChnlScCd, beWrkexPotflScCd);
    
    var gridObject = new ComJsGrid({
        id: "gridDiv",
        height: 670,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObject.gridCreate();
}


/**
 * @설명: 보정전 산출결과 Grid 조회
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 26 최초작성
 */
function selectWrkexRatProdAplcList(){
    //validate 체크
    if(!isValid()) { return; }
    // 조회에 필요한 값을 셋팅
    var reqParam = {};
    var inqrSc = $("#sbx_inqrSc").val(); //조회구분
    var selAplcBe = $("#sbx_aplcBe").val(); //적용BE 
    var conSolScCd = $("#sbx_conSolScCd").val(); //Consol구분
    var beWrkexChnlScCd = $("#sbx_beWrkexChnlScCd").val(); //채널
    var beWrkexPotflScCd = $("#sbx_bePotflScCd").val(); //포트폴리오
    
    reqParam.inqrSc = inqrSc ;//조회구분
    reqParam.aplcBe = selAplcBe; //적용BE
    reqParam.conSolScCd = conSolScCd;
    reqParam.beWrkexChnlScCd = beWrkexChnlScCd;
    reqParam.beWrkexPotflScCd = beWrkexPotflScCd;
    reqParam.potflLobScCd = '01'; //TODO: 조회구분 추가
    
    //포트폴리오
    if(inqrSc == "02") {
        reqParam.potflLobCdVal = beWrkexPotflScCd;
    } 
    
    //적용BE 시작일, 종료일
    var condFinYmFrom = "";
    var condFinYmTo = "";

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
    //시작년월, 종료년월
    reqParam.finYmFrom = condFinYmFrom;
    reqParam.finYmTo = condFinYmTo;
    //직전년도BE 체크
    var jsBfrYear = "N";
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
        jsBfrYear = "Y";
        var befAplcBe = (selAplcBe.substr(0,4)-1)+"BE"; //직전년도
        //직전년도BE: 시작일,종료일
        for(var i=0; i<condAplcBe.length; i++) {
            if(condAplcBe[i].aplcBeNm == befAplcBe) {
                reqParam.befFinYmFrom = condAplcBe[i].finStrYm;
                reqParam.befFinYmTo = condAplcBe[i].finEndYm;
                break;
            }
        }
        reqParam.befAplcBe = befAplcBe;
    } else {
        jsBfrYear = "N";
    }
    reqParam.jsBfrYear = jsBfrYear;
    
    // 데이터 조회
    $.callAjax(reqParam, "/be/pd/bepd133m/selectWrkexRatAdtnInfoList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        
        if(inqrSc == "01") {
            reDrawGrid(beWrkexChnlScCd, conSolScCd);
        } else {
            reDrawGrid(beWrkexChnlScCd, beWrkexPotflScCd);
        }

        // 그리드 바인딩
        var dataList = data.dataList;

        $("#gridDiv").jsGrid("loadData", dataList);
        
        // 0건 그리드 메세지 처리부분
        if($.fn.isEmpty(dataList) || dataList.length == 0) {
            $.fn.getReturnValue("gridDiv");
        }
        
        gCondFlag = "Y"
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectWrkexRatProdAplcListByKeywords !!");
    });
}

/**
 * @설명: validation 체크
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: boolean
 * @개정이력: 
 *  이현수 2021. 7. 28 최초작성
 */
function isValid() {
    var $inqrSc = $("#sbx_inqrSc")                    //조회구분
    var $conSolScCd = $("#sbx_conSolScCd");          //Consol구분
    var $beWrkexChnlScCd = $("#sbx_beWrkexChnlScCd");  //채널
    var $beWrkexPotflScCd = $("#sbx_bePotflScCd");  //채널

    //조회구분 체크
    if($.fn.isEmpty($inqrSc.val())) {
        $.fn.msgBox("조회구분는 필수입력항목입니다.", function() {
            $inqrSc.focus();
        });
        return false;
    }

    //조회구분 - 01:Consolidated
    if($inqrSc.val() === "01") {
        //Consol구분 체크
        if($.fn.isEmpty($conSolScCd.val())) {
            $.fn.msgBox("Consol Group은 필수입력항목입니다.", function() {
                $conSolScCd.focus();
            });
            return false;
        }
    } else {
      //채널 체크
        if($.fn.isEmpty($beWrkexChnlScCd.val())) {
            $.fn.msgBox("채널은 필수입력항목입니다.", function() {
                $beWrkexChnlScCd.focus();
            });
            return false;
        }
       //포트폴리오 체크
        if($.fn.isEmpty($beWrkexPotflScCd.val())) {
            $.fn.msgBox("포트폴리오은 필수입력항목입니다.", function() {
                $beWrkexPotflScCd.focus();
            });
            return false;
        }
    }

    return true;
}

/**
 * @설명: 조회구분에 따른 Console구분 세팅
 * @최초작성자: 이현수
 * @최초작성일: 2021.08.13
 * @최종변경일: 
 * @매개변수: inqrSc<string> : 조회구분
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 8.13 최초작성
 */
function ctlInqrScCond(inqrSc) {
    switch(inqrSc) {
    case "01" : //Consolidated
        $("#sbx_conSolScCd").attr("disabled", false).val("");
        $("#sbx_beWrkexChnlScCd").attr("disabled", false).val("");
        $("#sbx_bePotflScCd").attr("disabled", true).val("");
        initComboBox(inqrSc);
        break;
    case "02" : //marginal(overhead방식)
        $("#sbx_conSolScCd").attr("disabled", true).val("");
        $("#sbx_beWrkexChnlScCd").attr("disabled", false).val("");
        $("#sbx_bePotflScCd").attr("disabled", false).val("");
        initComboBox(inqrSc);
        break;
    default :
        $("#sbx_conSolScCd").attr("disabled", true).val("");
        $("#sbx_beWrkexChnlScCd").attr("disabled", true).val("");
        $("#sbx_bePotflScCd").attr("disabled", true).val("");
        initComboBox(inqrSc);
        break;
    }
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 26 최초작성
 */
function resetGrid() {
    //산출결과 
    $("#gridDiv").jsGrid("reset");
    $("#gridDiv").jsGrid("option", "data", []);
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function reDrawGrid(chnlCd, potfl) {
    //그리드 destroy
    $("#gridDiv").jsGrid("destroy");
    initGrid(chnlCd, potfl);
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function getGridFields(potflCd) {
    //적용BE
    var aplcBe = $("#sbx_aplcBe").val(); 
    var befAplcBe = (aplcBe.substr(0,4)-1)+"BE";
    var resultArr = [];
    //적용BE
    var fieldsArr = getTargetFieldsArr("", aplcBe);
    resultArr = resultArr.concat(fieldsArr);
    //직전년도BE 체크    
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") === true) {
        var befFildsArr = getTargetFieldsArr("JsBfrYr", befAplcBe);
        resultArr = resultArr.concat(befFildsArr);
        var diffFildsArr = getTargetFieldsArr("Diff", "difference");
        resultArr = resultArr.concat(diffFildsArr);
    }

    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수: String : 컬럼명, String : 적용BE
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 28 최초작성
 */
function getTargetFieldsArr(colNm, aplcBe) {
    var resultArr = [];
    var beWrkexItmCdVal = $.fn.getGridCodeItem("BE_WRKEX_ITM_CD");
    
    var beWrkexPotflScCd = { name:"beWrkexPotflScCd" + colNm, title: "Potfolio Code", css:"cell", type: "text", width:140, align:"center"};
    var beWrkexItmCd = { name:"beWrkexItmCd" + colNm, title: "Expense", css:"sub-total", type: "select", width:140, align:"left",
            itemTemplate:function(value, item){
                if(value=='0501') {
                    return 'DI_GA';
                } else if(value=='0502') {
                    return 'DI_SA';
                } else if(value=='00') {
                    return '';
                } else {
                    for(i=0; i<beWrkexItmCdVal.length; i++) {
                        if(value == beWrkexItmCdVal[i].code) {
                            return beWrkexItmCdVal[i].codeAbbrNm;
                        }
                    }
                }
            }
    };
    var ralWrkex = { name:"ralWrkex03" + colNm, title: "Unit Driver", css:"sub-total", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            //실제사업비 Sum 타이틀  값 공백처리
            value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            return value;                
        }
    };
    // TODO :: Expense 3개로 나눠지면서 추가분 발생
    var ralWrkex2 = {name:"ralWrkex01", title:"Unit Driver Single", css:"sub-total", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            return value;
        }
    };
    var ralWrkex3 = {name:"ralWrkex02", title:"Unit Driver Regular", css:"sub-total", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            return value;
        }
    };
    var anpS = { name:"anpS" + colNm, title: "ANP Single", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var anpN = { name:"anpN" + colNm, title: "ANP Regular", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var pniB = { name:"pniB" + colNm, title: "PNB Base", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            
            if(value == "9999999999") {
                value = "E";
            } else if(value % 1 == 0) {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            }
            
            return value;
        }
    };
    var pniR = { name:"pniR" + colNm, title: "PNB Rider", css:"cell", type: "text", width:140, align:"right", 
        itemTemplate:function(value, item) {
            
            if(value == "9999999999") {
                value = "E";
            } else if(value % 1 == 0) {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            }
            return value;
        }
    };
    var gwpS = { name:"gwpS" + colNm, title: "GWP Single", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "03" || beWrkexItmCd == "09" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    
    var gwpN = { name:"gwpN" + colNm, title: "GWP Regular", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "03" || beWrkexItmCd == "09" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var pifB = { name:"pifB" + colNm, title: "PIF Base", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            
            if(value == "9999999999") {
                value = "E";
            } else if(value % 1 == 0) {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            }
            return value;
        }
    };
    var pifR = { name:"pifR" + colNm, title: "PIF Rider", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            
            if(value == "9999999999") {
                value = "E";
            } else if(value % 1 == 0) {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            }
            return value;
        }
    };
    var claimA = { name:"claimA" + colNm, title: "CLAIM Amount", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "04" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var csvS = { name:"csvS" + colNm, title: "CSV Single", css:"cell", type: "text", width:140, align:"right", 
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "0501" || beWrkexItmCd == "0502" || beWrkexItmCd == "08" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var csvN = { name:"csvN" + colNm, title: "CSV Regular", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "0501" || beWrkexItmCd == "0502" || beWrkexItmCd == "08" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var bpl = { name:"bpl" + colNm, title: "BPL", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "06" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var pricingA = { name:"pricingA" + colNm, title: "Pricing Alpha", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var pricingB = { name:"pricingB" + colNm, title: "Pricing Beta+Gamma", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999998" && beWrkexItmCd == "02") {
                value = "S";
            } else if(value == "9999999998" && beWrkexItmCd == "03") {
                value = "S";
            } else if(value == "9999999999" && beWrkexItmCd == "07") {
                value = "E";
            } else if(value == "9999999999" && beWrkexItmCd == "09") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "03" || beWrkexItmCd == "07" || beWrkexItmCd == "09" || 
                    beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            return value;
        }
    };
    
    //직전년도BE 체크
    if (colNm == "JsBfrYr" || colNm == "Diff") {
        resultArr = [ralWrkex2, ralWrkex3, ralWrkex, anpS, anpN, pniB, pniR, gwpS, gwpN, pifB, pifR, claimA, csvS, csvN, bpl, pricingA, pricingB ];
    } else {
        resultArr = [beWrkexItmCd, ralWrkex2, ralWrkex3, ralWrkex, anpS, anpN, pniB, pniR, gwpS, gwpN, pifB, pifR, claimA, csvS, csvN, bpl, pricingA, pricingB ];
    }
    
    return resultArr;
}

/**
 * @설명: 그리드 헤더 세팅
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 28 최초작성
 */
function getGridHederRow(chnlCd, potfl) {
    var $result = $("<tr>").height(0);
   
    for(var i=0; i<19; i++) {
        $result.append($("<th>").width(140))
    }
    
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
        for(var i=0; i<34; i++) {
          $result.append($("<th>").width(140))
        }
    }
    
    var selAplcBe = $("#sbx_aplcBe").val();
    
    //적용BE
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") != true) {
        /*$result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("Category"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 15).text(selAplcBe)));*/
        
        //header 1row
        var $result1 = $("<tr class='jsgrid-header-row'>")
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text(potfl))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 17).text("Unit Driver"))
        // header 2row
        var $result2 = $("<tr class='jsgrid-header-row'>")
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("Expense"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("ANP (% of)"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("PNB (per policy)"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("GWP (% of)"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("PIF (per policy)"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 1).text("CLAIM (% of)"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("CSV (% of)"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("BPL (% of)"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("Pricing (% of)"))
        // header 3row
        var $result3 = $("<tr class='jsgrid-header-row'>")
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Single"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Regular"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("TOTAL"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Single"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Regular"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Base"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Rider"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Single"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Regular"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Base"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Rider"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Amout"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Single"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Regular"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Alpha"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Beta+Gamma"));
        
        $result = $result.add($result1);
        $result = $result.add($result2);
        $result = $result.add($result3);
    } else { //직전년도BE 체크
        var comBe = (selAplcBe.substr(0,4)-1)+"BE";

        $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("Category"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 14).text(selAplcBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 15).text(comBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 15).text("difference")));
        var $result1 = $("<tr class='jsgrid-header-row'>")
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text(potfl))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 15).text("Unit Driver"));
        var $result2 = $("<tr class='jsgrid-header-row'>");
        var $result3 = $("<tr class='jsgrid-header-row'>");
        
        for(var i=0; i<3; i++) {
          //header 1row
            $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 15).text("Unit Driver"));
            // header 2row
            $result2.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("Expense"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("ANP (% of)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("PNB (per policy)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("GWP (% of)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("PIF (per policy)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 1).text("CLAIM (% of)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("CSV (% of)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("BPL (% of)"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("Pricing (% of)"));
            // header 3row
            $result3.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Single"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Regular"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("TOTAL"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Single"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Regular"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Base"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Rider"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Single"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Regular"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Base"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Rider"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Amout"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Single"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Regular"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Alpha"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("Beta+Gamma"));
        }
        
        
        $result = $result.add($result1);
        $result = $result.add($result2);
        $result = $result.add($result3);
    }
    
    return $result;
}