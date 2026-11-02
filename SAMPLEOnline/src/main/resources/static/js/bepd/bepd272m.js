/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 동적해지율
 * @설명: 동적해지율 > 산출적용 화면의 JS
 * @최초작성자: 김민우 (61000474)
 * @최초작성일: 2021. 12. 15
 * @최종변경일: 2022. 05. 03
 * @개정이력: 
 *  김민우 (61000474) 2021. 12. 15 최초작성
 *  서승호 (89000364) 2022. 05. 03 공통코드 표기 로직 수정
 */
var grdObj = {};
var condAplcBe;
var gGrd3Nm;
var gGrd4Nm;
var gGrd5Nm;
var gOriTitNm3; 
var gOriTitNm4; 
var gOriTitNm5;
var gOriTitNm6;
var gParamGbn;
var gParamVal;
var gParamBe = "";
var gOneoffEfc = "02";
var gGrd4Seq;
var gChart;
var gChartNm = "";
var gInpVal = {};
var gStts = "N";
var gTmpData={};

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //버튼 권한 처리 2021.06.14
//    $.fn.setBtnPermission([{"btnId":"#btn_exportExcel","type":"A"}])
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //event 초기화
    initEvent();
    
    // 기본 grid 세팅
    initGridDivNo1(); //상품유형별
    initGridDivNo2(); //금리연동구분별
    initGridDivNo3(); //WOL
    initGridDivNo4(); //계수입력 및 저장
    initGridDivNo5(); //Arctangent모델기준
    
    gOriTitNm3 = $("#titDiv3Nm").text();
    gOriTitNm4 = $("#titDiv4Nm").text();
    gOriTitNm5 = $("#titDiv5Nm").text();
    gOriTitNm6 = $("#titDiv6Nm").text();
    
});

/**
* @설명: 동적해지율 > 산출적용 initCommCd
* @최초작성자: 김민우 (61000474)
* @최초작성일: 2021. 12. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 (61000474) 2021. 12. 15. 최초작성
*/
function initCommCd() {
    
    // 공통코드 조회
    $.fn.loadCommonCode(["BE_NEW_LOB_CD","BE_RATE_INLCT_PRM_PROD_SC_CD"]);

    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","15");
   
}

/**
* @설명: 동적해지율 > 산출적용 initEvent
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 12. 15. 최초작성
*/
function initEvent() {
	
	// One-off 반영
	$("input:checkbox").on('click', function() {
	    if ( $(this).prop('checked')) {
	    	gOneoffEfc = "04";
	    } else {
	    	gOneoffEfc = "02";
	    }
	    initGrdAll();
	});
	
	// 적용 BE 변경
	$("#sbx_aplcBe").on("change", function(){    
		gStts = "N";
		initGrdAll();
		
		gParamBe = $("#sbx_aplcBe").val();
		
    });
	
    // 조회
    $('#btn_search').on('click', function(e){
    	gParamBe = $("#sbx_aplcBe").val();
        selectDyncRscRatProdAplcList();
    });
    
    // 엑셀다운로드
    $('#btn_excel_download').on('click', function(e){
    	getExcelDownload();
    });
    
    $('#btn_delete').on('click', function(e){
    	deleteDyncRscCoefficientCalc();
    });
    
    $('#btn_save').on('click', function(e){
    	if (gStts == "Y"){
    		saveDyncRscCoefficient();
    	} else {
    		$.fn.msgBox("계수 입력 및 계산 후 저장할 수 있습니다.");
    	}
    });
    
    $('#btn_calc').on('click', function(e){
    	selectDyncRscCoefficientCalc();
    });
    
    $('#btn_choice').on('click', function(e){
    	updateDyncRscCoefficientCalc();
    });
    
    $("#inpU").attr("disabled", true);
    $("#inpL").attr("disabled", true);
    $("#inpM").attr("disabled", true);
    
    $('#inpU').on('change', function(e){
    	$("#gridDivNo5").jsGrid("reset");
        $("#gridDivNo5").jsGrid("option", "data", []);
        $("#gridDivNo5").jsGrid("destroy");
    	initGridDivNo5();
    	gStts = "N";
    	if((gChart != undefined)) {
            gChart.destroy();
        }
    });
    $('#inpL').on('change', function(e){
    	$("#gridDivNo5").jsGrid("reset");
        $("#gridDivNo5").jsGrid("option", "data", []);
        $("#gridDivNo5").jsGrid("destroy");
    	initGridDivNo5();
    	gStts = "N";
    	if((gChart != undefined)) {
            gChart.destroy();
        }
    });
    $('#inpM').on('change', function(e){
    	$("#gridDivNo5").jsGrid("reset");
        $("#gridDivNo5").jsGrid("option", "data", []);
        $("#gridDivNo5").jsGrid("destroy");
    	initGridDivNo5();
    	gStts = "N";
    	if((gChart != undefined)) {
            gChart.destroy();
        }
    });
    
    //$("#titDiv3Nm").text("표시목록");
}

/**
* @설명: 동적해지율 > 산출적용 기본 그리드 헤드 세팅 
* @최초작성자: 김민우 (61000474)
* @최초작성일: 2021. 12. 15
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 (61000474) 2021. 12. 15. 최초작성
*/
function headerRenderer(grdNo) {
    var $result = $("<tr>").height(0);
        
    switch (grdNo){
    	case 1 :
    		$result.append($("<th>").width(70));
    		$result.append($("<th>").width(100));
    		$result.append($("<th>").width(40));
    		$result.append($("<th>").width(100));
    		$result.append($("<th>").width(40));
    		$result.append($("<th>").width(85));
    		
    		$result = $result.add($("<tr class='jsgrid-header-row'>")
        	    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
        	    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("충분성 통과여부"))
        	    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("상관계수 통과여부"))
        	    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("Arctangent모형적합여부"))
        	        
        	); 
        	$result = $result.add($("<tr class='jsgrid-header-row'>")
        		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("통과건수비중"))
            	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("여부"))
            	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("상관계수"))
            	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("여부"))
            );
            break;
    	case 2 :
    		$result.append($("<th>").width(70));
    		$result.append($("<th>").width(100));
    		$result.append($("<th>").width(40));
    		$result.append($("<th>").width(100));
    		$result.append($("<th>").width(40));
    		$result.append($("<th>").width(85));
    		
    		$result = $result.add($("<tr class='jsgrid-header-row'>")
    	    	.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("금리구분"))
    	        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("충분성 통과여부"))
    	        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("상관계수 통과여부"))
    	        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("Arctangent모형적합여부"))
    	        
    	    ); 
    		$result = $result.add($("<tr class='jsgrid-header-row'>")
    			 .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("통과건수비중"))
        	     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("통과여부"))
        	     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("상관계수"))
        	     .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("통과여부"))
        	);
    		break;
    	case 3:
    		$result.append($("<th>").width(40));
    		$result.append($("<th>").width(100));
    		$result.append($("<th>").width(80));
    		$result.append($("<th>").width(50));
    		$result.append($("<th>").width(80));
    		
    		$result = $result.add($("<tr class='jsgrid-header-row'>")
    	   		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("No"))
    	        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("스프레드구간대표값"))
    	        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("기초승수"))
    	        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("유효기초승수건수"))
    	        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("기초승수차이"))
    		);
    		break;
    	case 4 :
    		$result.append($("<th>").width(40));
    		$result.append($("<th>").width(90));
    		$result.append($("<th>").width(90));
    		$result.append($("<th>").width(70));
    		$result.append($("<th>").width(70));
    		$result.append($("<th>").width(110));
    		$result.append($("<th>").width(120));
    		$result.append($("<th>").width(80));
    		
    		$result = $result.add($("<tr class='jsgrid-header-row'>")
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("No"))
    		    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("계수 k"))
    		    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("계수 c"))
    		    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("입력 U"))
    		    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("입력 L"))
    		    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("계수 a"))
    		    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("결과 m"))
    		    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("최종선택"))
    		);
    		break;
    	case 5:
    		$result.append($("<th>").width(50));
    		$result.append($("<th>").width(80));
    		
    		$result = $result.add($("<tr class='jsgrid-header-row'>")
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("금리스프레드"))
    			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("모델 승수"))
    		);
    		break;
    }
    
    
//    $result = $result.add($result1);
    return $result;
}

/**
* @설명: 동적해지율 > 산출적용 기본 그리드 세팅 > 상품유형별
* @최초작성자: 김민우 (61000474)
* @최초작성일: 2021. 12. 15
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 (61000474) 2021. 12. 15. 최초작성
*/
function initGridDivNo1(){
	
	fieldList = getGrdVal(1);
	
    var header = headerRenderer(1);
    var lobNm = "";
    
    var gridDivNo1 = new ComJsGrid({
        id: "gridDivNo1",
        height: 400,
        width: 455,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        }); 
    
    //row click
    gridDivNo1.rowClick(function(args) {
    	grdObj = args.item;
    
	    if (grdObj.beNewLobCd == undefined){
	    	gGrd3Nm = gOriTitNm3;
	    	gGrd4Nm = gOriTitNm4;
	    	gGrd5Nm = gOriTitNm5;
	    	gGrd6Nm = gOriTitNm6;
	    } else {
	    	if (grdObj.beNewLobCd == 'ZZ'){
	    		gGrd3Nm = "상품유형별 : TOTAL";
	    		gGrd4Nm = "상품유형별 : TOTAL  |  " + gOriTitNm4;
	    		gGrd5Nm = "상품유형별 : TOTAL  |  " + gOriTitNm5;
	    		gGrd6Nm = "상품유형별 : TOTAL  |  " + gOriTitNm6;
		    } else {
		    	var codeArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
	            for(i=0; i<codeArr.length; i++) {
	                if(grdObj.beNewLobCd == codeArr[i].code) {
	                	lobNm = codeArr[i].codeAbbrNm;
	                }
	            }
		    	gGrd3Nm = "상품유형별 : " + lobNm;
		    	gGrd4Nm = gGrd3Nm + " | " + gOriTitNm4;
		    	gGrd5Nm = gGrd3Nm + " | " + gOriTitNm5;
		    	gGrd6Nm = gGrd3Nm + " | " + gOriTitNm6;
		    }
	    	
	    	
	    	
	    	if (grdObj.beNewLobCd != 'ZZ'){
	    		var codeArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
	            for(i=0; i<codeArr.length; i++) {
	                if(grdObj.beNewLobCd == codeArr[i].code) {
	                	lobNm = codeArr[i].codeAbbrNm;
	                }
	            }
	    		gChartNm = lobNm;
	    	} else {
	    		gChartNm = "TOTAL";
	    	}
	    	
	    	gParamGbn = "beNewLobCd";
	    	gParamVal = grdObj.beNewLobCd;
	    	
	    	fnSelectDtlInfo();
	    }
	    
	    $("#titDiv3Nm").text(gGrd3Nm);
	    $("#titDiv4Nm").text(gGrd4Nm);
	    $("#titDiv5Nm").text(gGrd5Nm);
	    $("#titDiv6Nm").text(gGrd6Nm);
    }); 
    
    //그리드 생성
    gridDivNo1.gridCreate();
}

/**
* @설명: 동적해지율 > 산출적용 기본 그리드 세팅 > 금리연동구분별
* @최초작성자: 김민우 (61000474)
* @최초작성일: 2021. 12. 15
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 (61000474) 2021. 12. 15. 최초작성
*/
function initGridDivNo2(){

	var fieldList = [];
	
	fieldList = getGrdVal(2);
	
	var header = headerRenderer(2);
    var tmpNm = "";
    
    var gridDivNo2 = new ComJsGrid({
        id: "gridDivNo2",
        height: 400,
        width: 455,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        }); 
    
    //row click
    gridDivNo2.rowClick(function(args) {
    	grdObj = args.item;
    
	    if (grdObj.beRateInlctPrmProdScCd == undefined){
	    	gGrd3Nm = gOriTitNm3;
	    	gGrd4Nm = gOriTitNm4;
	    	gGrd5Nm = gOriTitNm5;
	    	gGrd6Nm = gOriTitNm6;
	    } else {
	    	if (grdObj.beRateInlctPrmProdScCd == 'Z1'){
	    		gGrd3Nm = "금리연동구분별 : ISP TOTAL";
	    		gGrd4Nm = "금리연동구분별 : ISP TOTAL | " + gOriTitNm4;
	    		gGrd5Nm = "금리연동구분별 : ISP TOTAL | " + gOriTitNm5;
	    		gGrd6Nm = "금리연동구분별 : ISP TOTAL | " + gOriTitNm6;
	    	} else if (grdObj.beRateInlctPrmProdScCd == 'Z2'){
	    		gGrd3Nm = "금리연동구분별 : 비ISP TOTAL";
	    		gGrd4Nm = "금리연동구분별 : 비ISP TOTAL | " + gOriTitNm4;
	    		gGrd5Nm = "금리연동구분별 : 비ISP TOTAL | " + gOriTitNm5;
	    		gGrd6Nm = "금리연동구분별 : 비ISP TOTAL | " + gOriTitNm6;
		    } else if (grdObj.beRateInlctPrmProdScCd == 'ZZ'){
	    		gGrd3Nm = "금리연동구분별 : TOTAL";
	    		gGrd4Nm = "금리연동구분별 : TOTAL | " + gOriTitNm4;
	    		gGrd5Nm = "금리연동구분별 : TOTAL | " + gOriTitNm5;
	    		gGrd6Nm = "금리연동구분별 : TOTAL | " + gOriTitNm6;
		    } else {
		    	var codeArr = $.fn.getGridCodeItem("BE_RATE_INLCT_PRM_PROD_SC_CD");
	            for(i=0; i<codeArr.length; i++) {
	                if(grdObj.beRateInlctPrmProdScCd == codeArr[i].code) {
	                	tmpNm = codeArr[i].codeAbbrNm;
	                }
	            }
		    	gGrd3Nm = "금리연동구분별 : " + tmpNm;
		    	gGrd4Nm = gGrd3Nm + "|" + gOriTitNm4;
	    		gGrd5Nm = gGrd3Nm + "|" + gOriTitNm5;
	    		gGrd6Nm = gGrd3Nm + "|" + gOriTitNm6;
		    }
	    	
	    	gParamGbn = "beRateInlctPrmProdScCd";
	    	gParamVal = grdObj.beRateInlctPrmProdScCd;
	    	fnSelectDtlInfo();
	    }
	    
	    $("#titDiv3Nm").text(gGrd3Nm);
	    $("#titDiv4Nm").text(gGrd4Nm);
	    $("#titDiv5Nm").text(gGrd5Nm);
	    $("#titDiv6Nm").text(gGrd6Nm);
    }); 
    
    //그리드 생성
    gridDivNo2.gridCreate();
}

/**
* @설명: 동적해지율 > 산출적용 기본 그리드 세팅 > WOL
* @최초작성자: 김민우 (61000474)
* @최초작성일: 2021. 12. 15
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 (61000474) 2021. 12. 15. 최초작성
*/
function initGridDivNo3(){

	var fieldList = [];
	fieldList = getGrdVal(3);
	
    var header = headerRenderer(3);
    
    var gridDivNo3 = new ComJsGrid({
        id: "gridDivNo3",
        height: 400,
        width: 450,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        }); 
    
  
    //그리드 생성
    gridDivNo3.gridCreate();
}

/**
* @설명: 동적해지율 > 산출적용 기본 그리드 세팅 > 계수 입력 및 저장
* @최초작성자: 김민우 (61000474)
* @최초작성일: 2021. 12. 15
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 (61000474) 2021. 12. 15. 최초작성
*/
function initGridDivNo4(){
	
	var fieldList = [];
	fieldList = getGrdVal(4);
	
    var header = headerRenderer(4);
    
    var gridDivNo4 = new ComJsGrid({
        id: "gridDivNo4",
        height: 300,
        width: 790,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        }); 
    
    //row click
    gridDivNo4.rowClick(function(args) {
    	grdObj = args.item;
    
	    if (grdObj.seq == undefined){
	    	gGrd4Seq = "";
	    } else {
	    	if (gGrd4Seq != grdObj.seq){
	    		gGrd4Seq = grdObj.seq;
	    		$("#gridDivNo5").jsGrid("reset");
	            $("#gridDivNo5").jsGrid("option", "data", []);
	            $("#gridDivNo5").jsGrid("destroy");
	        	initGridDivNo5();
	        	if((gChart != undefined)) {
	                gChart.destroy();
	            }
	    	} 
	    	$("#inpU").val(grdObj.rscRatInptMaxVal);
	    	$("#inpL").val(grdObj.rscRatInptMinVal);
	    	$("#inpM").val(grdObj.arctMdlSuitaRsltVal);
	    }
	    
    });
    //그리드 생성
    gridDivNo4.gridCreate();
}

/**
* @설명: 동적해지율 > 산출적용 기본 그리드 세팅 > Arctanget 모델 기준
* @최초작성자: 김민우 (61000474)
* @최초작성일: 2021. 12. 15
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 (61000474) 2021. 12. 15. 최초작성
*/
function initGridDivNo5(){

	var fieldList = [];
	fieldList = getGrdVal(5);
	
    var header = headerRenderer(5);
    
    var gridDivNo5 = new ComJsGrid({
        id: "gridDivNo5",
        height: 400,
        width: 360,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        }); 
    
    //그리드 생성
    gridDivNo5.gridCreate();
}

/**
* @설명: 동적해지율 > 산출적용 기본 그리드 세팅 > 엑셀 다운로드
* @최초작성자: 김민우 (61000474)
* @최초작성일: 2021. 12. 15
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 (61000474) 2021. 12. 15. 최초작성
*/
function initGridDivTmp(){
	var fieldList = [];
	fieldList = getGrdVal(6);
	
    //var header = headerRenderer(5);
    
    var gridDivTmp = new ComJsGrid({
        id: "gridDivTmp",
        height: 0,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldList
        }); 
    
    //그리드 생성
    gridDivTmp.gridCreate();
}

/**
* @설명: 동적해지율 > 산출적용 조회시 상품유형별/금리연동구분별 데이터 얻어오기
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 12. 15. 최초작성
*/
function selectDyncRscRatProdAplcList(){
	gStts = "N";
		
	initGridDivNo1();
	initGridDivNo2();
	initGridDivNo3();
	initGridDivNo4();
	initGridDivNo5();
	initGridDivTmp();
	
    // 조회에 필요한 값을 셋팅
    var reqParam = {
                "paramAplcBe" : gParamBe,
                "paramOneoffEfc" : gOneoffEfc
        };

        $.callAjax(reqParam, "/be/pd/bepd272m/selectDyncRscAplcList.do")
        .done(function(data) {
         // 초기화
            $("#gridDivNo1").jsGrid("reset");
            $("#gridDivNo1").jsGrid("option", "data", []);
            $("#gridDivNo2").jsGrid("reset");
            $("#gridDivNo2").jsGrid("option", "data", []);
            $("#gridDivNo3").jsGrid("reset");
            $("#gridDivNo3").jsGrid("option", "data", []);
            $("#gridDivNo4").jsGrid("reset");
            $("#gridDivNo4").jsGrid("option", "data", []);
            $("#gridDivNo5").jsGrid("reset");
            $("#gridDivNo5").jsGrid("option", "data", []);
            $("#gridDivTmp").jsGrid("reset");
            $("#gridDivTmp").jsGrid("option", "data", []);
            
            $("#gridDivNo1").jsGrid("destroy");
            $("#gridDivNo2").jsGrid("destroy");
            $("#gridDivNo3").jsGrid("destroy");
            $("#gridDivNo4").jsGrid("destroy");
            $("#gridDivNo5").jsGrid("destroy");
            $("#gridDivTmp").jsGrid("destroy");
            
            initGridDivNo1();
        	initGridDivNo2();
        	initGridDivNo3();
        	initGridDivNo4();
        	initGridDivNo5();
        	initGridDivTmp();
            
        	if((gChart != undefined)) {
                gChart.destroy();
            }
        	
        	// 서버로 받아온 데이터 리스트
        	var prodData = data.prodList;
        	var crncyData = data.crncyList;
        	
        	// 0건 그리드 메세지 처리부분
        	if(prodData == null || prodData.length == 0){
                $.fn.getReturnValue("gridDivNo1");
            } else {
                $('#gridDivNo1').jsGrid('reset');
                initGridDivNo1();
                $('#gridDivNo1').jsGrid('loadData', prodData);
            }
        	
        	if(crncyData == null || crncyData.length == 0){
                $.fn.getReturnValue("gridDivNo2");
            } else {
                $('#gridDivNo2').jsGrid('reset');
                initGridDivNo2();
                $('#gridDivNo2').jsGrid('loadData', crncyData);
            }
        	
        }).fail(function(data){
            console.log("fail to selectTableSchemaInfo");
        }); 
}

/**
* @설명: 동적해지율 > 산출적용 > 그리드 값 매칭
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 12. 15. 최초작성
*/
function getGrdVal(grdNo) {
	var fieldList = [];
	var newLobCd;
	var aplcYn;
	var cecnt;
	var cecntYn;
	var arctSuitaYn;
	var rateInlctPrmProdScCd;
	
	switch (grdNo){
	case 1 : 
		newLobCd = { name: "beNewLobCd", title: "상품유형", css:"cell", type: "select", width: 70, align:"center",
    					items: $.fn.getGridCodeItem("BE_NEW_LOB_CD"), textField: "codeAbbrNm", valueField:"code" };
		//충분성 통과여부 - 통과건수 비중
		assAplcRto = { name:"assAplcRto", title:"통과건수비중", css:"cell", type: "text", width:100, align:"right",
	            itemTemplate:function(value, item) {
	                  value =  $.fn.isEmpty(value) ? "0" : (value * 100).toFixed(8);
	                return value;
	            }
	    };
		//충분성 통과여부 - 통과여부
		aplcYn = { name:"aplcYn", title:"여부", css:"cell", type: "text", width:40, align:"center",
	            itemTemplate:function(value, item) {
	                return value;
	            }
	    };
		//상관계수 통과여부 - 상관게수
		cecnt = { name:"cecnt", title:"상관계수", css:"cell", type: "text", width:100, align:"right",
	            itemTemplate:function(value, item) {
	                  value =  $.fn.isEmpty(value) ? "0" : value.toFixed(8);
	                return value;
	            }
	    };
		//상관계수 통과여부 - 통과여부
		cecntYn = { name:"cecntYn", title:"여부", css:"cell", type: "text", width:40, align:"center",
	            itemTemplate:function(value, item) {
	                return value;
	            }
	    };
		//Arctangent 모형 적합여부
		arctSuitaYn = { name:"arctSuitaYn", title:"Arctangent모형적합여부", css:"cell", type: "text", width:85, align:"center",
	            itemTemplate:function(value, item) {
	                return value;
	            }
	    };
		fieldList.push(newLobCd, assAplcRto, aplcYn, cecnt, cecntYn, arctSuitaYn);
		break;
		
	case 2 :
		rateInlctPrmProdScCd = { name: "beRateInlctPrmProdScCd", title: "상품분류", css:"cell", type: "select", width: 70, align:"center",
			items: $.fn.getGridCodeItem("BE_RATE_INLCT_PRM_PROD_SC_CD"), textField: "codeAbbrNm", valueField:"code" };
		//충분성 통과여부 - 통과건수 비중
		assAplcRto = { name:"assAplcRto", title:"통과건수비중", css:"cell", type: "text", width:100, align:"right",
	            itemTemplate:function(value, item) {
	                  value =  $.fn.isEmpty(value) ? "0" : (value * 100).toFixed(8);
	                return value;
	            }
	    };
		//충분성 통과여부 - 통과여부
		aplcYn = { name:"aplcYn", title:"여부", css:"cell", type: "text", width:40, align:"center",
	            itemTemplate:function(value, item) {
	                return value;
	            }
	    };
		//상관계수 통과여부 - 상관게수
		cecnt = { name:"cecnt", title:"상관계수", css:"cell", type: "text", width:100, align:"right",
	            itemTemplate:function(value, item) {
	                  value =  $.fn.isEmpty(value) ? "0" : value.toFixed(8);
	                return value;
	            }
	    };
		//상관계수 통과여부 - 통과여부
		cecntYn = { name:"cecntYn", title:"여부", css:"cell", type: "text", width:40, align:"center",
	            itemTemplate:function(value, item) {
	                return value;
	            }
	    };
		//Arctangent 모형 적합여부
		arctSuitaYn = { name:"arctSuitaYn", title:"Arctangent모형적합여부", css:"cell", type: "text", width:85, align:"center",
	            itemTemplate:function(value, item) {
	                return value;
	            }
	    };
		fieldList.push(rateInlctPrmProdScCd, assAplcRto, aplcYn, cecnt, cecntYn, arctSuitaYn);
		break;
		
	case 3 :
		beNewLobCd = { name: "beNewLobCd", title: "", css:"cell", type: "select", width: 0, align:"center",
			items: $.fn.getGridCodeItem("BE_NEW_LOB_CD"), textField: "codeAbbrNm", valueField:"code" };
		//항목순서
		itmSeq = { name:"itmSeq", title:"No.", css:"cell", type: "text", width:40, align:"right", 
				itemTemplate:function(value, item) {
	            	return value;
	            }
		};
		//금리구간대표율
		rateItvReprRat = { name:"rateItvReprRat", title:"스프레드구간대표값", css:"cell", type: "text", width:100, align:"right",
	            itemTemplate:function(value, item) {
	            	value =  $.fn.isEmpty(value) ? "0" : (value * 100).toFixed(8);
	            	return value;
	            }
	    };
		//기초승수평균값
		pryMultpAvrVal = { name:"pryMultpAvrVal", title:"기초승수", css:"cell", type: "text", width:80, align:"right",
	            itemTemplate:function(value, item) {
	                value =  $.fn.isEmpty(value) ? "0" : value.toFixed(8);
	                return value;
	            }
	    };
		//유효기총승수건수
		occuCnt03 = { name:"occuCnt03", title:"유효기총승수건수", css:"cell", type: "text", width:50, align:"right",
	            itemTemplate:function(value, item) {
	                return value;
	            }
	    };
		//기초승수차이값
		pryMultpDifVal = { name:"pryMultpDifVal", title:"기초승수차이값", css:"cell", type: "text", width:80, align:"right",
	            itemTemplate:function(value, item) {
	            	value =  $.fn.isEmpty(value) ? "0" : value.toFixed(8);
	                return value;
	            }
	    };
		fieldList.push(itmSeq, rateItvReprRat, pryMultpAvrVal, occuCnt03, pryMultpDifVal);
		
		break;
	case 4 :
		//적용BE명
		aplcBeNm = { name: "aplcBeNm", title: "", css:"cell", type: "text", width: 0, align:"center",
			itemTemplate:function(value, item) {
            	return value;
            }
	    };
		beNewLobCd = { name: "beNewLobCd", title: "", css:"cell", type: "select", width: 0, align:"center",
				items: $.fn.getGridCodeItem("BE_NEW_LOB_CD"), textField: "codeAbbrNm", valueField:"code" };
		//가정산출적용구분코드
		assProdAplcScCd = { name: "assProdAplcScCd", title: "", css:"cell", type: "select", width: 0, align:"center",
				items: $.fn.getGridCodeItem("ASS_PROD_APLC_SC_CD"), textField: "codeAbbrNm", valueField:"code" };
		
		//순서
		seq = { name: "seq", title: "No", css:"", type: "text", width: 40, align:"right",
				itemTemplate:function(value, item) {
					return value;
				}
		};
		//순번
		rnum = { name: "rnum", title: "No", css:"cell", type: "text", width: 40, align:"right",
				itemTemplate:function(value, item) {
					return value;
				}
		};
		//계수값 k
		var arctCltnVal01 = { name:"arctCltnVal01", title:"계수 k", css:"cell", type: "text", width:90, align:"right", 
				itemTemplate:function(value, item) {
	            	return value.toFixed(8);
	            }
		};
		//계수값 c
		var arctCltnVal02 = { name:"arctCltnVal02", title:"계수 c", css:"cell", type: "text", width:90, align:"right", 
				itemTemplate:function(value, item) {
	            	return value.toFixed(8);
	            }
		};
		//입력 U
		var rscRatInptMaxVal = { name:"rscRatInptMaxVal", title:"입력 U", css:"cell", type: "text", width:70, align:"right", 
				itemTemplate:function(value, item) {
	            	return value;
	            }
		};
		//입력 L
		var rscRatInptMinVal = { name:"rscRatInptMinVal", title:"입력 L", css:"cell", type: "text", width:70, align:"right", 
				itemTemplate:function(value, item) {
	            	return value;
	            }
		};
		//계수값 a
		var arctCltnVal03 = { name:"arctCltnVal03", title:"계수 a", css:"cell", type: "text", width:110, align:"right", 
				itemTemplate:function(value, item) {
	            	return value.toFixed(8);
	            }
		};
		//결과 m
		var arctMdlSuitaRsltVal = { name:"arctMdlSuitaRsltVal", title:"결과 m", css:"cell", type: "text", width:120, align:"right", 
				itemTemplate:function(value, item) {
	            	return value;
	            }
		};
		
		var slctYn = { name:"slctYn", title:"최종선택", css:"cell", type: "text", width:80, align:"center", 
				itemTemplate:function(value, item) {
	            	return value;
	            }
		};
		
		fieldList.push(seq, arctCltnVal01, arctCltnVal02, rscRatInptMaxVal, rscRatInptMinVal, arctCltnVal03, arctMdlSuitaRsltVal, slctYn);
		break;
	case 5 :
		//금리스프레드
		var guideVal = { name:"guideVal", title:"금리스프레드", css:"cell", type: "text", width:50, align:"right", 
				itemTemplate:function(value, item) {
	            	return (value * 100).toFixed(1);
	            }
		};
		//모델 승수
		var arctMdlBseMultp = { name:"arctMdlBseMultp", title:"모델 승수", css:"cell", type: "text", width:80, align:"right",
	            itemTemplate:function(value, item) {
	            	value =  $.fn.isEmpty(value) ? "0" : value.toFixed(8);
	            	return value;
	            }
	    };
		fieldList.push(guideVal, arctMdlBseMultp);
		break;
	case 6 :
		beNewLobCd = { name: "beNewLobCd", title: "BE신규LOB코드", css:"cell", type: "select", width: 0, align:"center",
			items: $.fn.getGridCodeItem("BE_NEW_LOB_CD"), textField: "codeAbbrNm", valueField:"code" };
		
		beRateInlctPrmProdScCd = { name: "beRateInlctPrmProdScCd", title: "", css:"cell", type: "select", width: 0, align:"center",
				items: $.fn.getGridCodeItem("BE_RATE_INLCT_PRM_PROD_SC_CD"), textField: "codeAbbrNm", valueField:"code" };
		//항목순서
		rankVal = { name:"rankVal", title:"랭크", css:"cell", type: "text", width:40, align:"right", 
				itemTemplate:function(value, item) {
	            	return value;
	            }
		};
		//금리구간대표율
		rateItvReprRat = { name:"rateItvReprRat", title:"금리구간대표값", css:"cell", type: "text", width:100, align:"right",
	            itemTemplate:function(value, item) {
	            	value =  $.fn.isEmpty(value) ? "0" : value.toFixed(8);
	            	return value;
	            }
	    };
		//기초승수평균값
		pryMultpAvrVal = { name:"pryMultpAvrVal", title:"기초승수평균값", css:"cell", type: "text", width:80, align:"right",
	            itemTemplate:function(value, item) {
	                value =  $.fn.isEmpty(value) ? "0" : value.toFixed(8);
	                return value;
	            }
	    };
		mdlMultpVal = { name:"mdlMultpVal", title:"모델승수값", css:"cell", type: "text", width:80, align:"right",
	            itemTemplate:function(value, item) {
	                value =  $.fn.isEmpty(value) ? "0" : value.toFixed(8);
	                return value;
	            }
	    };
		//유효기총승수건수
		occuCnt03 = { name:"occuCnt03", title:"유효기총승수건수", css:"cell", type: "text", width:50, align:"right",
	            itemTemplate:function(value, item) {
	                return value;
	            }
	    };
		//기초승수차이값
		mseVal = { name:"mseVal", title:"MSE값", css:"cell", type: "text", width:80, align:"right",
	            itemTemplate:function(value, item) {
	                return value.toFixed(8);
	            }
	    };
		if (gParamGbn == "beNewLobCd"){
			fieldList.push(beNewLobCd, rankVal, rateItvReprRat, pryMultpAvrVal, mdlMultpVal, occuCnt03, mseVal);
		} else {
			fieldList.push(beRateInlctPrmProdScCd, rankVal, rateItvReprRat, pryMultpAvrVal, mdlMultpVal, occuCnt03, mseVal);
		}
		
		break;
	}

	return fieldList;
}

/**
* @설명: 동적해지율 > 산출적용 조회시 상품유형별/금리연동구분별 스프레드, 계수입력및저장 조회
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 12. 15. 최초작성
*/
function fnSelectDtlInfo(){
	gStts = "N";
	$("#inpU").val('');
	$("#inpL").val('');
	$("#inpM").val('');
	
	if((gChart != undefined)) {
        gChart.destroy();
    }
    // 조회에 필요한 값을 셋팅
    var reqParam = {
                "paramAplcBe" : gParamBe,
                "paramOneoffEfc" : gOneoffEfc,
                "paramGbn" : gParamGbn, // beNewLobCd, beRateInlctPrmProdScCd
                "paramVal" : gParamVal  
        };
    
    $.callAjax(reqParam, "/be/pd/bepd272m/selectDyncRscCalcListByItm.do")
    .done(function(data) {
    	gTmpData = {};
     // 초기화
        $("#gridDivNo3").jsGrid("reset");
        $("#gridDivNo3").jsGrid("option", "data", []);
        $("#gridDivNo4").jsGrid("reset");
        $("#gridDivNo4").jsGrid("option", "data", []);
        $("#gridDivNo5").jsGrid("reset");
        $("#gridDivNo5").jsGrid("option", "data", []);
        
        $("#gridDivNo3").jsGrid("destroy");
        $("#gridDivNo4").jsGrid("destroy");
        $("#gridDivNo5").jsGrid("destroy");
        
    	initGridDivNo3();
    	initGridDivNo4();
    	initGridDivNo5();
        
    	// 서버로 받아온 데이터 리스트
    	var rstList3 = data.rstList3;
    	var rstList4 = data.rstList4;
    	gTmpData = data.rstList3;
    	
    	// 0건 그리드 메세지 처리부분
    	if(rstList3 == null || rstList3.length == 0){
            $.fn.getReturnValue("gridDivNo3");
        } else {
            $('#gridDivNo3').jsGrid('reset');
            initGridDivNo3();
            $('#gridDivNo3').jsGrid('loadData', rstList3);
        }
    	
    	if(rstList4 == null || rstList4.length == 0){
            $.fn.getReturnValue("gridDivNo4");
        } else {
            $('#gridDivNo4').jsGrid('reset');
            initGridDivNo4();
            $('#gridDivNo4').jsGrid('loadData', rstList4);
        }
        $("#inpU").attr("disabled", false);
        $("#inpL").attr("disabled", false);
        $("#inpM").attr("disabled", false);
        
    }).fail(function(data){
        console.log("fail to selectTableSchemaInfo");
    }); 
}


/**
* @설명: 동적해지율 > 산출적용 조회시 상품유형별/금리연동구분별 > 계수 입력 및 저장 (삭제)
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 12. 15. 최초작성
*/
function deleteDyncRscCoefficientCalc() {
	
	if (gGrd4Seq == "" || gGrd4Seq == undefined) {
		$.fn.msgBox("삭제할 대상을 선택해 주세요.");
		return;
	}
    // 조회에 필요한 값을 셋팅
    var reqParam = {
                "paramAplcBe" : gParamBe,
                "paramOneoffEfc" : gOneoffEfc,
                "paramSeq" : gGrd4Seq,
                "paramVal" : gParamVal,
                "paramGbn" : gParamGbn   // beNewLobCd, beRateInlctPrmProdScCd
        };
    
    $.callAjax(reqParam, "/be/pd/bepd272m/deleteDyncRscCoefficientCalc.do")
    .done(function(data) {
        var rstCnt = data.rstCnt;
        
    	// 초기화
        $("#gridDivNo4").jsGrid("reset");
        $("#gridDivNo4").jsGrid("option", "data", []);
        $("#gridDivNo4").jsGrid("destroy");
        
    	initGridDivNo4();
        
    	// 서버로 받아온 데이터 리스트
    	var rstList = data.rstList;
    	
    	// 0건 그리드 메세지 처리부분
    	if(rstList == null || rstList.length == 0){
            $.fn.getReturnValue("gridDivNo4");
        } else {
            $('#gridDivNo4').jsGrid('reset');
            initGridDivNo4();
            $('#gridDivNo4').jsGrid('loadData', rstList);
        }
    	
    	$("#inpU").val('');
    	$("#inpL").val('');
    	$("#inpM").val('');
    }).fail(function(data){
        console.log("fail to selectTableSchemaInfo");
    }); 
}

/**
* @설명: 동적해지율 > 산출적용 조회시 상품유형별/금리연동구분별 > 계수 입력 및 저장 (저장)
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 12. 15. 최초작성
*/
function saveDyncRscCoefficient() {
	var paramValU = 0;
	var paramValL = 0;
	var paramValM = 0;
	
	paramValU = $("#inpU").val();
	paramValL = $("#inpL").val();
	paramValM = $("#inpM").val();
	
	
	if (paramValU == null || paramValL == null || paramValM == null
			|| paramValU == "" || paramValL == "" || paramValM == ""){
		$.fn.msgBox("저장 값을 확인해 주세요.");
		return;
	}
	
	var reqParam = {
            "paramAplcBe" : gParamBe,
            "paramOneoffEfc" : gOneoffEfc,
            "paramValU" : paramValU,
            "paramValL" : paramValL,
            "paramValM" : paramValM,
            "paramVal" : gParamVal,
            "paramGbn" : gParamGbn   // beNewLobCd, beRateInlctPrmProdScCd
    };

	$.callAjax(reqParam, "/be/pd/bepd272m/saveDyncRscCoefficient.do")
	.done(function(data) {
		var rstCnt = data.rstCnt;
        
    	// 초기화
        $("#gridDivNo4").jsGrid("reset");
        $("#gridDivNo4").jsGrid("option", "data", []);
        $("#gridDivNo4").jsGrid("destroy");
        
    	initGridDivNo4();
        
    	// 서버로 받아온 데이터 리스트
    	var rstList = data.rstList;
    	
    	// 0건 그리드 메세지 처리부분
    	if(rstList == null || rstList.length == 0){
            $.fn.getReturnValue("gridDivNo4");
        } else {
            $('#gridDivNo4').jsGrid('reset');
            initGridDivNo4();
            $('#gridDivNo4').jsGrid('loadData', rstList);
        }
    	$("#inpU").val('');
    	$("#inpL").val('');
    	$("#inpM").val('');
    	gStts = "N";
	}).fail(function(data){
        console.log("fail to selectTableSchemaInfo");
    }); 
}

/**
* @설명: 동적해지율 > 산출적용 조회시 상품유형별/금리연동구분별 > 계수 입력 및 저장 (계산)
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 12. 15. 최초작성
*/
function selectDyncRscCoefficientCalc() {
	var paramValU = 0;
	var paramValL = 0;
	var paramValM = 0;
	
	paramValU = $("#inpU").val();
	paramValL = $("#inpL").val();
	paramValM = $("#inpM").val();
	
	if (paramValU == null || paramValL == null || paramValM == null
			|| paramValU == "" || paramValL == "" || paramValM == ""){
		$.fn.msgBox("계산 값을 확인해 주세요.");
		return;
	}
	
	var reqParam = {
            "paramAplcBe" : gParamBe,
            "paramOneoffEfc" : gOneoffEfc,
            "paramValU" : paramValU,
            "paramValL" : paramValL,
            "paramValM" : paramValM,
            "paramVal" : gParamVal,
            "paramGbn" : gParamGbn   // beNewLobCd, beRateInlctPrmProdScCd
    };

	gInpVal = reqParam;
	
	$.callAjax(reqParam, "/be/pd/bepd272m/selectDyncRscCoefficientCalc.do")
	.done(function(data) {
		//var rstCnt = data.rstCnt;
        
    	// 초기화
        $("#gridDivNo5").jsGrid("reset");
        $("#gridDivNo5").jsGrid("option", "data", []);
        $("#gridDivNo5").jsGrid("destroy");
        
        $("#gridDivTmp").jsGrid("reset");
        $("#gridDivTmp").jsGrid("option", "data", []);
        $("#gridDivTmp").jsGrid("destroy");
        
    	initGridDivNo5();
    	initGridDivTmp();
    	
    	// 서버로 받아온 데이터 리스트
    	var rstList = data.rstList;
    	var xlsList = data.xlsList;
    	
    	// 0건 그리드 메세지 처리부분
    	if(rstList == null || rstList.length == 0){
            $.fn.getReturnValue("gridDivNo5");
        } else {
            $('#gridDivNo5').jsGrid('reset');
            initGridDivNo5();
            $('#gridDivNo5').jsGrid('loadData', rstList);
            
            $('#gridDivTmp').jsGrid('reset');
            initGridDivTmp();
            $('#gridDivTmp').jsGrid('loadData', xlsList);
            
            gStts = "Y";
            
            if((gChart != undefined)) {
                gChart.destroy();
            }
            drawDyncRscChart(rstList);
        }
	}).fail(function(data){
        console.log("fail to selectTableSchemaInfo");
    }); 
}

/**
* @설명: 동적해지율 > 산출적용 조회시 상품유형별/금리연동구분별 > 계수 입력 및 저장 후 Excel Download
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 12. 15. 최초작성
*/
function getExcelDownload(){
	var param = {};
	param.oneoffChk = "";
	
	var dataList = $("#gridDivNo3").jsGrid("option", "data");
    if(dataList.length == 0) {
        $.fn.msgBox("조회된 항목이 없습니다.");
        return;
    }
    
	var tmpNm = $.replaceAll(gGrd3Nm.trim(), ':','');
	
    var fileName = "동적해지율 산출정보_" + tmpNm +".xlsx";
    $.fn.exportMultiGridExcel([
            {
                id: 'gridDivNo3',
                sheetName : tmpNm,
                fileName: fileName,
                applyItemTemplate : true,
                unit: ""
            }
    ]);
}
/**
* @설명: 동적해지율 > 산출적용 조회시 상품유형별/금리연동구분별 > 계수 입력 및 저장 (계산) > 그래프
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 12. 15. 최초작성
*/
function drawDyncRscChart(pData) {
    
    
    //메인창 그리드 데이터, 필드
    var labelVal =[];
    var arrDataM = [];
    var tmpVal;
    var arrDataB = [];
    
	for (var i=0; i<pData.length; i++){
		labelVal.push(pData[i].guideVal);
		arrDataM.push(pData[i].arctMdlBseMultp);
		tmpVal = null;
		
		for (var j=0; j<gTmpData.length; j++){
			if (pData[i].guideVal == parseInt(gTmpData[j].rateItvReprRat * 1000 )/1000){
				tmpVal = gTmpData[j].pryMultpAvrVal;
			} 
		} 
		arrDataB.push(tmpVal);
	}
    
	var ctx = $("#dyncRscChart");
	
	gChart = new Chart(ctx, {
		type: 'line',
		data:{
			labels:labelVal,
			datasets:[
				{
					label:'모델승수',
					fill:false,
					data:arrDataM,
					backgroundColor:'rgb(255, 99, 132)',
					borderColor:'rgb(255, 99, 132, 0.5)',
					borderWidth:1,
					spanGaps:true
				},
				{
					label:'기초승수',
					fill:false,
					data:arrDataB,
					backgroundColor:'rgb(54, 162, 235)',
					borderColor:'rgb(54, 162, 235, 0.5)',
					borderWidth:1,
					spanGaps:true
				}
			]
		},
		options:{
			responsive: true,
            plugins: {
                lengend: {
                   // position: "top"
                },
                title: {
                    display: true
                }
            },
			maintainAspectRatio: false,
			scales:{
				xAxes:[
					{
						ticks:{
							userCallback: function(value, index, values){
                            	value = (value * 100).toFixed(1)
                            	return value;
                            }
						}
					}
				],
				yAxes:[
					{
						ticks:{
							suggestedMin: 0,
							suggestedMax: 2,
							beginAtZero:true
						}
					}
				]
			}
		}
	});
}


function initGrdAll(){
	$("#gridDivNo1").jsGrid("reset");
    $("#gridDivNo2").jsGrid("reset");
    $("#gridDivNo3").jsGrid("reset");
    $("#gridDivNo4").jsGrid("reset");
    $("#gridDivNo5").jsGrid("reset");
    $("#gridDivTmp").jsGrid("reset");
    
    $("#gridDivNo1").jsGrid("destroy");
    $("#gridDivNo2").jsGrid("destroy");
    $("#gridDivNo3").jsGrid("destroy");
    $("#gridDivNo4").jsGrid("destroy");
    $("#gridDivNo5").jsGrid("destroy");
    $("#gridDivTmp").jsGrid("destroy");
    
    initGridDivNo1();
	initGridDivNo2();
	initGridDivNo3();
	initGridDivNo4();
	initGridDivNo5();
	initGridDivTmp();
	
	$("#inpU").val('');
	$("#inpL").val('');
	$("#inpM").val('');
	
	if((gChart != undefined)) {
        gChart.destroy();
    }
	gStts = "N";
}

function updateDyncRscCoefficientCalc(){
	if (gStts != "Y"){
		$.fn.msgBox("계산 후 선택가능합니다.");
		return;
	} 
	
	if (gGrd4Seq == "" || gGrd4Seq == undefined) {
		$.fn.msgBox("최종선택 대상을 선택해 주세요.");
		return;
	}
	
    // 조회에 필요한 값을 셋팅
    var reqParam = {
                "paramAplcBe" : gParamBe,
                "paramOneoffEfc" : gOneoffEfc,
                "paramSeq" : gGrd4Seq,
                "paramVal" : gParamVal,
                "paramGbn" : gParamGbn   // beNewLobCd, beRateInlctPrmProdScCd
        };
    
    $.callAjax(reqParam, "/be/pd/bepd272m/updateDyncRscCoefficientCalc.do")
    .done(function(data) {
        var rstCnt = data.rstCnt;
        
    	// 초기화
        $("#gridDivNo4").jsGrid("reset");
        $("#gridDivNo4").jsGrid("option", "data", []);
        $("#gridDivNo4").jsGrid("destroy");
        
    	initGridDivNo4();
        
    	// 서버로 받아온 데이터 리스트
    	var rstList = data.rstList;
    	
    	// 0건 그리드 메세지 처리부분
    	if(rstList == null || rstList.length == 0){
            $.fn.getReturnValue("gridDivNo4");
        } else {
            $('#gridDivNo4').jsGrid('reset');
            initGridDivNo4();
            $('#gridDivNo4').jsGrid('loadData', rstList);
        }
    	
    	gStts = "N";
    }).fail(function(data){
        console.log("fail to selectTableSchemaInfo");
    }); 
}