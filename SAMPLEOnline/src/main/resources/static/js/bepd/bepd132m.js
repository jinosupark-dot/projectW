/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 사업비율 - 산출적용
 * @설명: 사업비율 - 산출적용 화면의 JS
 * @최초작성자: 이현수
 * @최초작성일: 2021. 8. 2.
 * @최종변경일: 
 * @개정이력: 
 *  이현수 2021. 8. 2. 최초작성
 */
var condAplcBe; //적용BE StartDt, EndDt
var gArrCols = [];
var gTbNm = "TB_IBECRS16";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//직전년도be플래그
var gCondJsBfrYear = "N";
//one-off플래그
var gCondOneoffCheck = "N";
//엑셀 양식 다운로드 여부
var gSetExcel = "N";
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
    
    initGridCase();
    
    //산출결과(One-off비용 반영 전)
    initGridRtfBfc();
    
    //산출결과(One-off비용 반영 후)
    initGridRftAfc();
    
    //최종BE 적용결과
    initGridLastBe();

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

    //콤보박스 세팅 - 사업비배부채널코드
    var paramObj1 = {};
    paramObj1.codeArr = ["BE_WRKEX_CHNL_SC_CD"];
    paramObj1.selArr = ["sbx_beWrkexChnlScCd"];
    paramObj1.firstOptionText = ["-선택-"];

    $.fn.renderCombobox(paramObj1);
    
    //콤보박스 세팅 - 포트폴리오 설정
    var newPotflScCdList = [];
    gPotflScCdList = $._commonObj["code"]["BE_WRKEX_POTFL_SC_CD"];
    var tmpPotflCdList = $._commonObj["code"]["BE_WRKEX_POTFL_SC_CD"];
    
    for(var i=0; i<tmpPotflCdList.length; i++) {
		var tmpPotflCd = tmpPotflCdList[i];
		var newPotflCd = {
				"code": tmpPotflCd.code,
				"codeNm": tmpPotflCd.codeAbbrNm,
		}
        newPotflScCdList.push(newPotflCd);
    }
    $._commonObj.code["BE_WRKEX_POTFL_SC_CD"] = newPotflScCdList;
    
    // 콤보박스 세팅
    $.fn.renderCombobox({
        codeArr: ["BE_WRKEX_POTFL_SC_CD"],
        selArr: ["sbx_bePotflScCd"],
        firstOptionText: "-선택-"
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
    //직전년도BE비교
    $("#cbx_jsBfrYear").on("change", function(e){
        if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
            gCondJsBfrYear = "Y";
            $("#btn_loadExcel").hide();
            $("#btn_xlsdown").hide();
        } else {
            gCondJsBfrYear = "N";
            $("#btn_loadExcel").show();
            $("#btn_xlsdown").show();
        }
    });
    
    // 조회
    $('#btn_search').on('click', function(e){
        selectWrkexRatProdAplcList();
    });
    
    //산출적용:엑셀다운로드(타이틀.xlsx)
    $('#btn_excel_download').on('click', function(e){
        //데이터 체크
        var dataList = $("#gridDivRtfBfc").jsGrid("option", "data");
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
        
        var fileName = "사업비율_산출적용_" + $("#sbx_aplcBe option:selected").text() + "_" + $("#sbx_beWrkexChnlScCd option:selected").text() + "_" + 
        $("#sbx_bePotflScCd option:selected").text() ;
        
        if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
            fileName += "_" + "직전년도BE비교";
        } 

        fileName = fileName + ".xlsx";

        $.fn.exportMultiGridExcel([
            {
                id: "gridDivCase", 
                sheetName : "기준율", 
                fileName: fileName,
                applyItemTemplate: true,
                unit: "%",
            },
            {
                id: 'gridDivRtfBfc',
                sheetName : "산출결과(One-off비용 반영 전)",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%, 원",
            },
            {
                id: 'gridDivRtfAfc',
                sheetName : "산출결과(One-off비용 반영 후)",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%, 원",
            },
            {
                id: 'gridDivLastBe',
                sheetName : "최종BE적용결과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%, 원",
            },
            {
                id: 'gridDivRtfBfc',
                sheetName : "산출결과(One-off비용 반영 전)(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%, 원",
            },
            {
                id: 'gridDivRtfAfc',
                sheetName : "산출결과(One-off비용 반영 후)(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%, 원",
            },
            {
                id: 'gridDivLastBe',
                sheetName : "최종BE적용결과(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%, 원",
            }
        ]);
    });
    
    //최종BE적용결과:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $("#btn_xlsdown").on("click", function(e) {

        //직전년도BE비교 체크
        if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
            $.fn.msgBox("직전년도BE비교 체크를 해제해주세요.");
            return;
        }
        
        var arrColsInfo = $.fn.getTbCols(gTbNm);
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        let fileName = "사업비율_산출적용_최종BE적용결과"
                     + ".xlsx";
        $.fn.exportGridExcel({
            id       : 'gridDivLastBe', 
            fileName : fileName
        });
    });
    
  //양식다운로드 클릭
    $("#btn_exportExcelForm").on("click", function(e){
        var fieldList = [];
        var col1 = { name: "aplcBeNm" , title:"적용BE명" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col2 = { name: "beWrkexChnlScCd" , title:"BE사업비채널구분코드" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col3 = { name: "potflLobCdVal" , title:"포트폴리오LOB코드값" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col4 = { name: "beWrkexItmCd" , title:"BE사업비항목코드" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        //var col5 = { name: "beGenSpcAccoScCd" , title:"BE일반특별계정구분코드" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col6 = { name: "ralWrkex01" , title:"실제사업비_01(single)" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col7 = { name: "ralWrkex02" , title:"실제사업비_02(regular)" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col8 = { name: "ralWrkex03" , title:"실제사업비_03(total)" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col9 = { name: "beAssRat01" , title:"ANP Single" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col10 = { name: "beAssRat02" , title:"ANP Regular" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col11 = { name: "beAssRat03" , title:"PNB Base" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col12 = { name: "beAssRat04" , title:"PNB Rider" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col13 = { name: "beAssRat05" , title:"GWP Single" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col14 = { name: "beAssRat06" , title:"GWP Regular" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col15 = { name: "beAssRat07" , title:"PIF Base" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col16 = { name: "beAssRat08" , title:"PIF Rider" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col17 = { name: "beAssRat09" , title:"CLAIM Amount" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col18 = { name: "beAssRat10" , title:"CSV Single" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col19 = { name: "beAssRat11" , title:"CSV Regular" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col20 = { name: "beAssRat12" , title:"BPL" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col21 = { name: "beAssRat13" , title:"Pricing A" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col22 = { name: "beAssRat14" , title:"Pricing BG" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        
        //fieldList.push(col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12, col13, col14, col15, col16, col17, col18, col19, col20, col21, col22);
        fieldList.push(col1, col2, col3, col4, col6, col7, col8, col9, col10, col11, col12, col13, col14, col15, col16, col17, col18, col19, col20, col21, col22);
        $("#gridTmpDiv").jsGrid("destroy");
        
        var gridObject = new ComJsGrid({
            id: "gridTmpDiv",
            height: 0,
            editing: false,
            sorting: true,
            paging: true,
            fields : fieldList
        }); 
        //그리드 생성
        gridObject.gridCreate();
        
        $.fn.exportGridExcel({
            id: "gridTmpDiv", 
            fileName: "사업비_최종BE_업로드양식.xlsx"
        });
        
        gSetExcel = "Y";
        
    });
    //엑셀업로드 클릭
    $("#btn_loadExcel").on("click", function(e){
        
        //직전년도BE비교 체크
        if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
            $.fn.msgBox("직전년도BE비교 체크를 해제해주세요.");
            return;
        }

        if(gSetExcel != "Y") {
            $.fn.msgBox("사업비 최종BE 업로드양식을 다운로드한 후 엑셀업로드를 해주세요.");
            return;
        }
        //채널/포트폴리오 필수 선택
      //validate 체크
        if(!isValid()) { return; }
        
        var paramObj = {};

        paramObj.id = "gridTmpDiv";               //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                    	$.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd132m/saveLstBeList.do')
                        .done(function(data) {
                            if(data.result == 'success') {
                                $.fn.msgBox('정상적으로 처리되었습니다.', function(obj) {
                                    selectWrkexRatProdAplcList();
                                });
                            } else if (data.result == "NO_DATA"){
								$.fn.msgBox('등록할 내용이 없습니다.');
							} else if (data.result == "xls_error"){
								$.fn.msgBox('양식에 입력된 값을 확인해 주십시오.');
							} else {
								$.fn.msgBox('Excel Upload 중 에러가 발생하였습니다.\n관리자에 문의하세요.');
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
    
}

/**
* @설명: 사업비율 jsGrid(기초율:상단) 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initGridCase(){
    var gridObjectCase = new ComJsGrid({
        id: "gridDivCase",
        height: "100",
        width: "25%",
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            var $result = $("<tr>").height(0)
            .append($("<th>"))
            .append($("<th>"));
            //heder 1row
            $result = $result.add($("<tr class='jsgrid-header-row'>")
            		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("B/R")));
            //heder 2row
            $result = $result.add($("<tr class='jsgrid-header-row'>")
            		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("NB(%)"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("IF(%)")));
            
            return $result;
        },
        fields : [
            { name: "brNb", title:"B/R NB", css:"cell", type: "text", align:"center"},
            { name: "brIf", title:"B/R IF", css:"cell", type: "text", align:"center"},
            ]
        
    });
    //그리드 생성
    gridObjectCase.gridCreate();
}

/**
* @설명: 사업비율 - 산출적용 - 보정전 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 26. 최초작성
*/
function initGridRtfBfc(beWrkexChnlScCd, beWrkexPotflScCd){
    
    var fieldsArr = getGridFields(beWrkexPotflScCd);
    var headerRowArr = getGridHederRow(beWrkexChnlScCd, beWrkexPotflScCd);
    
    var gridObjectRtfBfc = new ComJsGrid({
        id: "gridDivRtfBfc",
        height: 520,
        editing: false,
        sorting: true,
        paging: false,
        rowClass: function(item, itemIndex) {
            if(itemIndex <= 1) {
                return "sub-total";
            }
        },
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRtfBfc.gridCreate();
}

/**
* @설명: 사업비율 - 산출적용 - 보정후 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 26. 최초작성
*/
function initGridRftAfc(beWrkexChnlScCd, beWrkexPotflScCd){
    
    var fieldsArr = getGridFields(beWrkexPotflScCd);
    var headerRowArr = getGridHederRow(beWrkexChnlScCd, beWrkexPotflScCd);
    
    var gridObjectRftAfc = new ComJsGrid({
        id: "gridDivRtfAfc",
        height: 520,
        editing: false,
        sorting: true,
        paging: false,
        rowClass: function(item, itemIndex) {
            if(itemIndex <= 1) {
                return "sub-total";
            }
        },
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRftAfc.gridCreate();
}

/**
 * @설명: 사업비율 - 산출적용 - 최종BE 적용결과 jsGrid 빈 테이블 생성 
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  이현수 2021. 7. 26. 최초작성
 */
function initGridLastBe(beWrkexChnlScCd, beWrkexPotflScCd){
    
    var fieldsArr = getGridFields(beWrkexPotflScCd);
    var headerRowArr = getGridHederRow(beWrkexChnlScCd, beWrkexPotflScCd, 'Y');
    
    var gridObjectLastBe = new ComJsGrid({
        id: "gridDivLastBe",
        height: 520,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectLastBe.gridCreate();
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
    var selAplcBe = $("#sbx_aplcBe").val(); //적용BE 
    var beWrkexChnlScCd = $("#sbx_beWrkexChnlScCd").val(); //채널
    var bePotflScCd = $("#sbx_bePotflScCd").val(); //포트폴리오구분
    //var typSc = $("#sbx_typSc").val(); //TODO : NEWLOB 적용시 주석해제
    
    gReqParam.aplcBe = selAplcBe; //적용BE
    gReqParam.beWrkexChnlScCd = beWrkexChnlScCd; //채널
    gReqParam.beWrkexPotflScCd = bePotflScCd; //포트폴리오
    gReqParam.potflLobScCd = "01"; //TODO : NEWLOB 적용시 삭제
    //gReqParam.potflLobScCd = typSc; //TODO : NEWLOB 적용시 주석해제
    
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
    gReqParam.finYmFrom = condFinYmFrom;
    gReqParam.finYmTo = condFinYmTo;
    
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
        gReqParam.befAplcBe = befAplcBe;
    } else {
        jsBfrYear = "N";
    }
    gReqParam.jsBfrYear = jsBfrYear;
    
    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd132m/selectWrkexRatProdAplcList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        reDrawGrid(beWrkexChnlScCd, bePotflScCd);

        // 그리드 바인딩
        var caseListData = data.caseList;
        var rtfBfcListData = data.rtfBfcList;
        var rtfAfcListData = data.rtfAfcList;
        var lastBeListData = data.lastBeList;

        $("#gridDivCase").jsGrid("loadData", caseListData);
        $("#gridDivRtfBfc").jsGrid("loadData", rtfBfcListData);
        $("#gridDivRtfAfc").jsGrid("loadData", rtfAfcListData);
        $("#gridDivLastBe").jsGrid("loadData", lastBeListData);
        
        // 0건 그리드 메세지 처리부분
        if($.fn.isEmpty(caseListData) || caseListData.length == 0) {
            $.fn.getReturnValue("gridDivCase");
        }
        if($.fn.isEmpty(rtfBfcListData) || rtfBfcListData.length == 1) {
            $("#gridDivRtfBfc").jsGrid("reset");
            $("#gridDivRtfBfc").jsGrid("option", "data", []);
            $.fn.getReturnValue("gridDivRtfBfc");
        }
        if($.fn.isEmpty(rtfAfcListData) || rtfAfcListData.length == 1) {
            $("#gridDivRtfAfc").jsGrid("reset");
            $("#gridDivRtfAfc").jsGrid("option", "data", []);
            $.fn.getReturnValue("gridDivRtfAfc");
        }
        if($.fn.isEmpty(lastBeListData) || lastBeListData.length == 1) {
            //최종BE 적용결과
            $("#gridDivLastBe").jsGrid("reset");
            $("#gridDivLastBe").jsGrid("option", "data", []);
            $.fn.getReturnValue("gridDivLastBe");
        }
        gCondFlag = "Y";
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
    var $beWrkexChnlScCd = $("#sbx_beWrkexChnlScCd");  //채널
    var $bePotflScCd = $("#sbx_bePotflScCd");          //포트폴리오구분
    
    //채널 체크
    if($.fn.isEmpty($beWrkexChnlScCd.val())) {
        $.fn.msgBox("채널은 필수입력항목입니다.", function() {
            $beWrkexChnlScCd.focus();
        });
        return false;
    }
    //포트폴리오구분 체크
    if($.fn.isEmpty($bePotflScCd.val())) {
        $.fn.msgBox("포트폴리오구분은 필수 입력항목입니다.", function() {
            $bePotflScCd.focus();
        });
        return false;
    }

    return true;
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
    //보정전 산출결과 
    $("#gridDivRtfBfc").jsGrid("reset");
    $("#gridDivRtfBfc").jsGrid("option", "data", []);
    //보정후 산출결과 
    $("#gridDivRtfAfc").jsGrid("reset");
    $("#gridDivRtfAfc").jsGrid("option", "data", []);
    //최종BE 적용결과
    $("#gridDivLastBe").jsGrid("reset");
    $("#gridDivLastBe").jsGrid("option", "data", []);
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
    $("#gridDivRtfBfc").jsGrid("destroy");
    $("#gridDivRtfAfc").jsGrid("destroy");
    $("#gridDivLastBe").jsGrid("destroy");
    //그리드 create
    initGridCase();
    initGridRtfBfc(chnlCd, potfl);
    initGridRftAfc(chnlCd, potfl);
    initGridLastBe(chnlCd, potfl);
}

/**
 * @설명: 그리드 필드값을 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 포트폴리오구분
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
    
    var beWrkexPotflScCd = { name:"beWrkexPotflScCd" + colNm, title: aplcBe + "_" + "Potfolio Code", css:"cell", type: "text", width:140, align:"center"};
    var beWrkexItmCd = { name:"beWrkexItmCd" + colNm, title: aplcBe + "_" + "Expense", css:"sub-total", type: "select", width:140, align:"left",
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
    
    var ralWrkex = { name:"ralWrkex03" + colNm, title: aplcBe + "_" + "Unit Driver Total", css:"sub-total", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            //실제사업비 Sum 타이틀  값 공백처리
            value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
            return value;                
        }
    };
    // TODO :: Expense 3개로 나눠지면서 추가분 발생
    var ralWrkex2 = {name:"ralWrkex01" + colNm, title: aplcBe + "_" + "Unit Driver Single", css:"sub-total", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                    return value;
            }
    };
    var ralWrkex3 = {name:"ralWrkex02" + colNm, title: aplcBe + "_" + "Unit Driver Regular", css:"sub-total", type: "text", width:140, align:"right",
            itemTemplate:function(value, item) {
                    value = $.fn.isEmpty(value) ? value : $.fn.addCommaFixed(value.toString());
                    return value;
            }
    };
    var anpS = { name:"anpS" + colNm, title: aplcBe + "_" + "ANP Single", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var anpN = { name:"anpN" + colNm, title: aplcBe + "_" + "ANP Regular", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var pniB = { name:"pniB" + colNm, title: aplcBe + "_" + "PNB Base", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "02"
                || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            }
            return value;
        }
    };
    var pniR = { name:"pniR" + colNm, title: aplcBe + "_" + "PNB Rider", css:"cell", type: "text", width:140, align:"right", 
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "02"
                || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            }
            return value;
        }
    };
    var gwpS = { name:"gwpS" + colNm, title: aplcBe + "_" + "GWP Single", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "03" || beWrkexItmCd == "07" || beWrkexItmCd == "09" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    
    var gwpN = { name:"gwpN" + colNm, title: aplcBe + "_" + "GWP Regular", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "03" || beWrkexItmCd == "07" || beWrkexItmCd == "09" 
                || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var pifB = { name:"pifB" + colNm, title: aplcBe + "_" + "PIF Base", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "03" 
                || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            }
            return value;
        }
    };
    var pifR = { name:"pifR" + colNm, title: aplcBe + "_" + "PIF Rider", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "03" 
                || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3"|| beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            }
            return value;
        }
    };
    var claimA = { name:"claimA" + colNm, title: aplcBe + "_" + "CLAIM Amount", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "04" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var csvS = { name:"csvS" + colNm, title: aplcBe + "_" + "CSV Single", css:"cell", type: "text", width:140, align:"right", 
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "0501" || beWrkexItmCd == "0502" || beWrkexItmCd == "08" 
                || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var csvN = { name:"csvN" + colNm, title: aplcBe + "_" + "CSV Regular", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "0501" || beWrkexItmCd == "0502" || beWrkexItmCd == "08" 
                || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var bpl = { name:"bpl" + colNm, title: aplcBe + "_" + "BPL", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "06" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    var pricingA = { name:"pricingA" + colNm, title: aplcBe + "_" + "Pricing Alpha", css:"cell", type: "text", width:140, align:"right",
        itemTemplate:function(value, item) {
            var beWrkexItmCd = item.beWrkexItmCd;
            
            if(value == "9999999999") {
                value = "E";
            } else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "01" || beWrkexItmCd == "Z1" || beWrkexItmCd == "Z2" || beWrkexItmCd == "Z3") {
                value =  $.fn.isEmpty(value) ? "0.00000" : $.fn.addCommaFixed((value*1).toFixed(5).toString());
            }
            
            return value;
        }
    };
    
    var pricingB = { name:"pricingB" + colNm, title: aplcBe + "_" + "Pricing Beta+Gamma", css:"cell", type: "text", width:140, align:"right",
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
            }  else if(beWrkexItmCd == "00" || beWrkexItmCd == "99" || beWrkexItmCd == "Z4" || beWrkexItmCd == "Z5") {
                value = $.fn.isEmpty(value) ? "0" : $.fn.addCommaFixed(value.toString());
            } else if(beWrkexItmCd == "03" || beWrkexItmCd == "04" || beWrkexItmCd == "0501" || beWrkexItmCd == "07" || beWrkexItmCd == "08" || beWrkexItmCd == "09" || 
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
function getGridHederRow(chnlCd, potfl, lastYn) {
    var $result = $("<tr>").height(0);
    var vlastYn = lastYn;
    
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
        $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text("Category"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 15).text(selAplcBe)));
        
        //header 1row
        var $result1 = $("<tr class='jsgrid-header-row'>")
        	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 3).text(potfl))
        	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 3).text("Expense"))
           	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 15).text("Unit Driver"))		

        // header 2row
        var $result2 = $("<tr class='jsgrid-header-row'>")
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("Single"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("Regular"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("TOTAL"))
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
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text("Category"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 14).text(selAplcBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 17).text(comBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 17).text("difference")));
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
function checkCond() {
    //적용BE체크
    if(gReqParam.aplcBe != $('#sbx_aplcBe').val()) {
        return false;
    }
    
    if(gReqParam.beWrkexChnlScCd != $("#sbx_beWrkexChnlScCd").val()) {
        return false;
    }
    
    if(gReqParam.beWrkexPotflScCd != $("#sbx_bePotflScCd").val()) {
        return false;
    }
    //직전년도BE체크
    if(gReqParam.jsBfrYear != gCondJsBfrYear) {
        return false;
    }

    return true;
}