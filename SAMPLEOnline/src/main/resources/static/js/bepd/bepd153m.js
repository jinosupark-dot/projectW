/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 연금일시해지율 부가정보
 * @설명: 연금일시해지율 부가정보 화면 JS
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
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //버튼 권한 처리 2021.06.14
//    $.fn.setBtnPermission([{"btnId":"#btn_excel_download","type":"A"}]);
    
    //적용BE 콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //최초로드
    reDrawGrid($("#sbx_midDrotCd").val());
});
/**
* @설명: 콤보박스 초기화
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 7. 최초작성
*/
function initCommCd() {
    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","04");
    
    // 공통코드 조회(BLOCK구분코드,유무배당구분코드,연금지급유형, 납입방법)
    $.fn.loadCommonCode(["BE_BLK_SC_CD", "BE_I17_EXNEX_DVD_SC_CD", "BE_RATE_TYP_SC_CD", "BE_KIDI_ONPAD_SC_CD"]);
}

/**
* @설명: event 초기화
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 7. 최초작성
*/
function initEvent() {
    // 조회
    $('#btn_search').on('click', function(e){
        selectAdtnInfoList();
    });
    
    //엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download').on('click', function(e){
        //데이터 체크
        var dataList = $("#gridDivCnt").jsGrid("option", "data");
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
    	
        let fileName = "연금일시해지율_" + $("#sbx_midDrotCd option:selected").text() + ".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivCnt',
                sheetName : "건수",
                fileName: fileName, 
                applyItemTemplate: true,
                unit : "%",
                searchCond: $.fn.getSearchCondSub("ADTN")
            },
            {
                id: 'gridDivDriver',
                sheetName : "Driver",
                fileName: fileName, 
                applyItemTemplate: true,
                unit : "%",
            },
            {
                id: 'gridDivCnt',
                sheetName : "건수(코드)",
                fileName: fileName, 
                applyItemTemplate: false,
                unit : "%",
            },
            {
                id: 'gridDivDriver',
                sheetName : "Driver(코드)",
                fileName: fileName, 
                applyItemTemplate: false,
                unit : "%",
            }
        ]);
    });
    
    //조회구분 변경 이벤트
    $("#sbx_midDrotCd").on("change", function(e){
        gCondSrchDiv = $("#sbx_midDrotCd").val();
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
* @설명: 연금개시후 - 부가정보 - 건수 jsGrid 빈 테이블 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 7. 최초작성
*/
function initGridCnt(midDrotCd) {
    //사업비배부유형코드에 따른 그리드 필드 세팅
    var fieldsArr = getGridFields(midDrotCd);
    
    // jsGrid 빈 테이블 생성
    var gridObjectCnt = new ComJsGrid({
        id: "gridDivCnt",
        height: 300,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectCnt.gridCreate();
}

/**
* @설명: 연금개시후 - 부가정보 - Driver jsGrid 빈 테이블 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 7. 최초작성
*/
function initGridDriver(midDrotCd){

    //사업비배부유형코드에 따른 그리드 필드 세팅
    var fieldsArr = getGridFields(midDrotCd);
    
    // jsGrid 빈 테이블 생성
    var gridObjectDriver = new ComJsGrid({
        id: "gridDivDriver",
        height: 300,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectDriver.gridCreate();
}

/**
 * @설명: 건수 기준 Grid 조회
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 7 최초작성
 */
function selectAdtnInfoList(){
    //조회에 필요한 값을 셋팅
    var reqParam = {};

    //조회년월 load start
    var selAplcBe = $("#sbx_aplcBe").val();
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
    
    //적용BE 조회년도 
    var finYearArr = $.fn.getFinYearArr(condFinYmFrom, condFinYmTo);
    for(var i=0; i<5; i++) {
        reqParam["finY" + i] = finYearArr[i];
    }
    
    reqParam.finYmFrom = condFinYmFrom;
    reqParam.finYmTo = condFinYmTo;
    reqParam.midDrotCd = $("#sbx_midDrotCd").val();
    
    //엑셀 validation 체크용 오브젝트
    gReqParam.aplcBe = $("#sbx_aplcBe").val();
    gReqParam.midDrotCd = $("#sbx_midDrotCd").val();
    
    // 데이터 조회
    $.callAjax(reqParam, "/be/pd/bepd153m/selectAnutLamntRscRatProdList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        
        ctlTitle(reqParam.midDrotCd);       //타이틀 세팅
        reDrawGrid(reqParam.midDrotCd);     //그리드 로딩
        //그리드 바인딩
        var cntListData = data.cntList;
        var driverListData = data.driverList;
        
        $("#gridDivCnt").jsGrid("loadData", cntListData).done();
        $("#gridDivCnt").jsGrid({onRefreshed:function(args) { gridMerge("#gridDivCnt");}});
//      if ($("#sbx_midDrotCd").val() == "1") {
        $("#gridDivDriver").jsGrid("loadData", driverListData).done();
        $("#gridDivDriver").jsGrid({onRefreshed:function(args) { gridMerge("#gridDivDriver");}});
//       }
        
        // 0건 그리드 메세지 처리부분
        if(cntListData.length == 0) {
            $.fn.getReturnValue("gridDivCnt");
        }
//        if ($("#sbx_midDrotCd").val() == "1") {
//	        if(driverListData.length == 0) {
//	            $.fn.getReturnValue("gridDivDriver");
//	        }
//        }
        if(driverListData.length == 0) {
            $.fn.getReturnValue("gridDivDriver");
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectAnutLamntRscRatProdList !!");
    });
}



/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 7 최초작성
 */
function resetGrid() {
    //보정전 산출결과 
    $("#gridDivCnt").jsGrid("reset");
    $("#gridDivCnt").jsGrid("option", "data", []);
    //보정후 산출결과 
    $("#gridDivDriver").jsGrid("reset");
    $("#gridDivDriver").jsGrid("option", "data", []);
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
function reDrawGrid(midDrotCd) {
    //그리드 destroy
    $("#gridDivCnt").jsGrid("destroy");
    $("#gridDivDriver").jsGrid("destroy");
    //그리드 create
    initGridCnt(midDrotCd);
    initGridDriver(midDrotCd);
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:연금지급유형별 연금개시후 해지율 연도별 비중(건수/Driver 기준)
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function getGridFields(type) {
    var selAplcBe = $("#sbx_aplcBe").val();
    var beKidiOnpadScCdArr = $.fn.getGridCodeItem("BE_KIDI_ONPAD_SC_CD");
    var finYFrom = "";
    var finYTo = ""

    for(var i=0; i<condAplcBe.length; i++) {
        if(condAplcBe[i].aplcBeNm == selAplcBe) {
            finYFrom = condAplcBe[i].finStrYm;
            finYTo = condAplcBe[i].finEndYm;
            break;
        }
    }

    //그리드 공통부분 필드
    var resultArr = [];
    var beBlkScCd = { name: "beBlkScCd", title:"BLOCK유형", css:"cell", type: "select", width: 100, align:"center", 
            items: [{Name:"New_Block", Id: "1"},{Name:"Old_Block", Id: "2"}],textField: "Name",valueField: "Id"
    };
    var beI17ExnexDvdScCd = { name: "beI17ExnexDvdScCd", title:"상품유형", css:"cell", type: "select", width: 100, align:"center", 
            items: [{Name:"무배당", Id: "1"},{Name:"유배당", Id: "2"}], textField: "Name", valueField: "Id"
    };
    var beRateTypScCd = { name: "beRateTypScCd", title:"금리유형", css:"cell", type: "select", width: 100, align:"center", items: $.fn.getGridCodeItem("BE_RATE_TYP_SC_CD"), textField: "codeNm", valueField: "code"};
    var beKidiOnpadScCd = { name: "beKidiOnpadScCd", title:"납입방법", css:"cell", type: "select", width: 100, align:"center"
    	,  itemTemplate:function(value, item) {
            var textField = "TOTAL";
            for(i=0; i<beKidiOnpadScCdArr.length; i++) {
                if(value ==beKidiOnpadScCdArr[i].code) {
                    textField = beKidiOnpadScCdArr[i].codeNm;
                    break;
                }
            }
            return textField;
        }
    };
    //전체 필드
    var allInfo = { 
            name: "total", title:"전체", css:"cell", type: "text",  width: 140, align:"right", sorter:"number"
                , itemTemplate:function(value, item) {return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);}
    };

    //==========================================================
    //필드항목 정의 END
    //==========================================================
    
    switch(type) {
    case "1": //상품유형별 연금일시 해지율 연도별 비중
        resultArr.push(beBlkScCd);
        resultArr.push(beI17ExnexDvdScCd);
        resultArr.push(beRateTypScCd);
        var targetArr = $.fn.getFinYearArr(finYFrom, finYTo);
        var fieldsArr = getFieldsArr(targetArr);
        resultArr = resultArr.concat(fieldsArr);
        //합계세팅
        resultArr.push(allInfo);
        break;
    case "2": //납입방법별 연금일시 해지율 연도별 비중
        resultArr.push(beKidiOnpadScCd);
        var targetArr = $.fn.getFinYearArr(finYFrom, finYTo);
        var fieldsArr = getFieldsArr(targetArr);
        resultArr = resultArr.concat(fieldsArr);
        //합계세팅
//        resultArr.push(allInfo);
        break;
    default :  //연금지급유형별 연금일시 해지율 연도별 비중
        resultArr.push(beI17ExnexDvdScCd);
        var targetArr = $.fn.getFinYearArr(finYFrom, finYTo);
        var fieldsArr = getFieldsArr(targetArr);
        resultArr = resultArr.concat(fieldsArr);
        //합계세팅
        resultArr.push(allInfo);
        break;
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
        var distStndValField = { name: "finY" + i, title: target + "년도", css:"cell", type: "text", width: 140, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }};
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}

/**
 * @설명: Grid Merge
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function gridMerge(gridTag){
    let gridRowTag = gridTag +"> div.jsgrid-grid-body > table > tbody > tr";
    let gridRowLen = $(gridRowTag).length;
    
    let cnt1 = 0;
    let cnt2 = 0;
    
    $.each($(gridRowTag), function(index, item){
        let idx = gridRowLen-(index+1);
        cnt1++;
        cnt2++;
        
        if(idx > 0){
            //값 비교를 위해 전항목 txt값과 현재 txt값을 얻는다.
            let tdTxt1    = $(gridRowTag + ":eq(" + idx + ") > td:eq(0)").text(); //Block유형
            let tdTxt2    = $(gridRowTag + ":eq(" + idx + ") > td:eq(1)").text(); //상품유형
            let prvTdTxt1 = $(gridRowTag + ":eq(" + (gridRowLen-(index+2)) + ") > td:eq(0)").text(); //이전 Block유형
            let prvTdTxt2 = $(gridRowTag + ":eq(" + (gridRowLen-(index+2)) + ") > td:eq(1)").text(); //상품유형

            //같을때는 td를 지운다.
            if(tdTxt1 == prvTdTxt1) { //무배당-무배당 
                //뒷쪽 td부터 지워야 eq 순번을 유지할 수 있다.
                if(tdTxt2 == prvTdTxt2) {
                    $(gridRowTag + ":eq(" + idx + ") > td:eq(1)").remove();
                } else {
                    $(gridRowTag + ":eq(" + idx + ") > td:eq(1)").attr("rowspan",cnt2);
                    cnt2 = 0;
                }
                $(gridRowTag + ":eq(" + idx + ") > td:eq(0)").remove();
            } else {
                //다르면 앞에서 카운트한 row수 + 1값을 rowspan으로 지정한다.
                $(gridRowTag + ":eq(" + idx + ") > td:eq(1)").attr("rowspan",cnt2);
                $(gridRowTag + ":eq(" + idx + ") > td:eq(0)").attr("rowspan",cnt1);
                cnt1 = 0;
                cnt2 = 0;
            }
        } else if(idx == 0){
            //맨처음이면 rowspan한다.
            $(gridRowTag + ":eq(" + idx + ") > td:eq(0)").attr("rowspan",cnt1);
            $(gridRowTag + ":eq(" + idx + ") > td:eq(1)").attr("rowspan",cnt2);
        }
    });
}

/**
 * @설명: 조회구분에 따라 타이틀 세팅
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function ctlTitle(midDrotCd) {
    switch(midDrotCd) {
    case "1" :  //상품유형별 연금개시후 해지율 연도별 비중
        $("#title_cnt").text("상품유형별 연도별 비중(발생건수 기준)");
        $("#title_driver").text("상품유형별 연도별 비중(Driver 기준)");
//        $("#title_driver").show();
//		$("#gridDivDriver").show();
        break;
    case "2" :  //연금지급유형별 연금개시후 해지율 연도별 비중
        $("#title_cnt").text("납입방법별 연도별 비중(건수기준)");
        $("#title_driver").text("납입방법별 연도별 비중(Driver 기준)");
//        $("#title_driver").hide();
//		$("#gridDivDriver").hide();
        break;
    default :  //연금지급유형별 연금개시후 해지율 연도별 비중
        $("#title_cnt").text("상품유형별 연도별 비중(발생건수 기준)");
        $("#title_driver").text("상품유형별 연도별 비중(Driver 기준)");
        break;
    }
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
* @설명: 연금일시해지율 - 조회시 조건, 현재 조건 체크 
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
	if(gReqParam.midDrotCd != $('#sbx_midDrotCd').val()) {
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
            url: "/be/pd/bepd153p.do",
            name: "연금일시해지율 그래프 팝업",
            width: 1050,
            height: 850,
            sbxDiv: gCondSrchDiv,
            gridData1: $("#" + "gridDivCnt").jsGrid("option", "data"),
            gridField1: $("#" + "gridDivCnt").jsGrid("option", "fields"),
            gridData2: $("#" + "gridDivDriver").jsGrid("option", "data"),
            gridField2: $("#" + "gridDivDriver").jsGrid("option", "fields")
    }

    $.fn.openPopup(popupOption);
}