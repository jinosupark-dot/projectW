/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 경험조정
 * @설명: 경험조정 산출적용 화면 JS
 * @최초작성자: 이준용
 * @최초작성일: 2021.07.22
 * @최종변경일: 2022.05.03
 * @개정이력:
 *  이준용 2021.07.22 최초작성
 *  서승호 2022.05.03 문구변경 연금구분 -> 보험계약대출율상품분류코드
 */
// 전역변수 선언부
var condAplcBe; //적용BE StartDt, EndDt
var condCheck = {};
var grid2ChkYn = false;
var serviceCode = "17";
var gSrchYn = "N";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";

//엑셀처리용 하이라키 체크
var gCondHichyCheck = [];

$(document).ready(function(){
    /*2021.04.30 툴팁 추가*/
    $("#imgToolTip").attr("title", parent.viewPath);
    
    /*2021.06.15 화면명에 화면ID 추가*/
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //datepickerSetting세팅
    $.fn.getTbDateInfo(serviceCode);
    
    /*2021.06.15 버튼권한처리*/
    //검증실행
    var btnIdArr = ["btn_vrfPrct"];
    var permArr = [];
    for (var i = 0; i < btnIdArr.length; i++) {
        permArr.push({
            btnId : "#" + btnIdArr[i]
        });
    }
    $.fn.setBtnPermission(permArr);
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //콤보박스 세팅
    initComboBox();
    
    //event 초기화
    initEvent();
    
    //그리드 초기화   
    initGridItem(1);
//  initGridItem(2);
    
});

function initCommCd() {
    // 공통코드 조회
    $.fn.loadCommonCode([
        "BENF_LCLSF_CD"//급부대분류코드
        , "HIGH_RSK_RAT_PRDT_SC_CD"//고위험률상품코드
        , "BE_CHNL_SC_CD"//채널코드
        , "BE_BLK_SC_CD"//블록구분코드
        , "BE_FPAY_YN_SC_CD"//완납여부구분코드
        , "BE_NEW_LOB_CD"//신규Lob코드
        , "BE_WRKEX_CHNL_SC_CD"//BE사업비채널구분코드
        , "BE_WRKEX_POTFL_SC_CD"//BE사업비포트폴리오구분코드
        , "BE_I17_EXNEX_DVD_SC_CD"//IFRS17유무배당구분코드
        , "BE_RATE_TYP_SC_CD"//금리유형구분코드
        , "PRPAD_PSB_UL_PRDT_YN"//선납가능UL상품여부
        , "BE_OBLG_PAD_YYS_CD"//의무납입년수
        , "PLLN_RAT_PRDT_CLSF_CD"//보험계약대출율상품분류코드
        
        , "DNVLD_SC_CD"
        , "PAD_PRM_DNVLD_SC_CD"
        , "POTFL_SC_CD"
        , "I17_EXNEX_DVD_SC_CD"
        , "RATE_TYP_SC_CD"
        , "RSC_RAT_PROD_SC_CD"
        , "ACDT_INSM_DNVLD_SC_CD"
        , "WRKEX_DNVLD_SC_CD"
        , "PLLN_DNVLD_SC_CD"
        , "SRDVL_DNVLD_SC_CD"
        , "PLLN_RAT_PRDT_CLSF_CD"
        , "SURV_INSM_DNVLD_SC_CD"
        , "SRDVL_DNVLD_SC_CD"
        ]);

    // 적용BE 조회
    //condAplcBe = $.fn.getAplcBe("sbx_aplcBe","17"); //경험조정코드(17)
    
}

/**
 * @설명: 콤보박스 초기화
 * @최초작성자: 이준용
 * @최초작성일: 2021. 9. 16
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 9. 16 최초작성
 */
function initComboBox() {
    //조회구분
    $.fn.renderCombobox({
        codeArr: ["DNVLD_SC_CD"],
        selArr: ["sbx_srhGubun"],
        useFirstOption: false		//첫번째 option 사용여부
    });
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
	$("#cbx_gubunType1").attr("disabled", false);
	$("#cbx_gubunType2").attr("disabled", true);
	$("#cbx_gubunType3").attr("disabled", true);
	$("#cbx_gubunType4").attr("disabled", true);
	$("#cbx_gubunType5").attr("disabled", true);
	$("#cbx_gubunType6").attr("disabled", true);
	
	//시작년월 달력버튼 click
    $("#btn_finYmFrom").on("click", function(e){
        $('#ibx_finYmFrom').datepicker("show");
    });
    
    //죵료년월 달력버튼 click
    $("#btn_finYmTo").on("click", function(e){
        $("#ibx_finYmTo").datepicker("show");
    });
    
    //조회구분 변경 이벤트
    $("#sbx_srhGubun").on("change", function(e){
    	$("#titleNm1").text($("#sbx_srhGubun option:selected").text());
    	
//        $("#sbx_srhType1").css('display', 'none');
//        $("#sbx_srhType2").css('display', 'none');
        $("input:checkbox[name='hierarchy_check']:checked").removeAttr("checked");

        for (var i=1;i<=9;i++) {
            $("#cbx_gubunType"+i).css('display', 'none');
            if($("#sbx_srhGubun").val() == i) {
                $("#cbx_gubunType"+i).css('display', 'block');
            }
        }
        
        if($("#sbx_srhGubun").val() == "01") {
//            $("#cbx_highRskRatPrdtScCd1").prop("checked", true);
//            $("#cbx_beChnlScCd1").prop("checked", true);
        	$("#cbx_potflScCd1").prop("checked", true);
        	$("#cbx_i17ExnexDvdScCd1").prop("checked", true);
        	$("#cbx_rateTypScCd1").prop("checked", true);
        	$("#cbx_rscRatProdScCd1").prop("checked", true);
        	
        	$("#cbx_gubunType1").attr("disabled", false);
        	$("#cbx_gubunType2").attr("disabled", true);
        	$("#cbx_gubunType3").attr("disabled", true);
        	$("#cbx_gubunType4").attr("disabled", true);
        	$("#cbx_gubunType5").attr("disabled", true);
        	$("#cbx_gubunType6").attr("disabled", true);
        } else if($("#sbx_srhGubun").val() == "02") {
//            $("#cbx_beWrkexChnlScCd2").prop("checked", true);
//            $("#cbx_beWrkexPotflScCd2").prop("checked", true);
        	$("#cbx_highRskRatPrdtScCd2").prop("checked", true);
        	$("#cbx_beChnlScCd2").prop("checked", true);
        	
        	$("#cbx_gubunType1").attr("disabled", true);
        	$("#cbx_gubunType2").attr("disabled", false);
        	$("#cbx_gubunType3").attr("disabled", true);
        	$("#cbx_gubunType4").attr("disabled", true);
        	$("#cbx_gubunType5").attr("disabled", true);
        	$("#cbx_gubunType6").attr("disabled", true);
        } else if($("#sbx_srhGubun").val() == "03") {
//            $("#cbx_beBlkScCd3").prop("checked", true);
//            $("#cbx_beFpayYnScCd3").prop("checked", true);
//            $("#cbx_beChnlScCd3").prop("checked", true);
//            $("#cbx_beNewLobCd3").prop("checked", true);
//            $("#cbx_dupayRefndRtoVal3").prop("checked", true);
//            $("#cbx_padAftRefndRtoVal3").prop("checked", true);
        	$("#cbx_beChnlScCd3").prop("checked", true);
        	$("#cbx_potflScCd3").prop("checked", true);
        	
        	$("#cbx_gubunType1").attr("disabled", true);
        	$("#cbx_gubunType2").attr("disabled", true);
        	$("#cbx_gubunType3").attr("disabled", false);
        	$("#cbx_gubunType4").attr("disabled", true);
        	$("#cbx_gubunType5").attr("disabled", true);
        	$("#cbx_gubunType6").attr("disabled", true);
        } else if($("#sbx_srhGubun").val() == "04") {
//            $("#cbx_beBlkScCd4").prop("checked", true);
//            $("#cbx_beI17ExnexDvdScCd4").prop("checked", true);
//            $("#cbx_beRateTypScCd4").prop("checked", true);
        	$("#cbx_potflScCd4").prop("checked", true);
        	$("#cbx_i17ExnexDvdScCd4").prop("checked", true);
        	$("#cbx_rateTypScCd4").prop("checked", true);
        	$("#cbx_rscRatProdScCd4").prop("checked", true);
        	
        	$("#cbx_gubunType1").attr("disabled", true);
        	$("#cbx_gubunType2").attr("disabled", true);
        	$("#cbx_gubunType3").attr("disabled", true);
        	$("#cbx_gubunType4").attr("disabled", false);
        	$("#cbx_gubunType5").attr("disabled", true);
        	$("#cbx_gubunType6").attr("disabled", true);
        } else if($("#sbx_srhGubun").val() == "05") {
//            $("#cbx_beBlkScCd5").prop("checked", true);
//            $("#cbx_beI17ExnexDvdScCd5").prop("checked", true);
//            $("#cbx_beRateTypScCd5").prop("checked", true);
        	$("#cbx_potflScCd5").prop("checked", true);
        	$("#cbx_i17ExnexDvdScCd5").prop("checked", true);
        	$("#cbx_rateTypScCd5").prop("checked", true);
        	$("#cbx_rscRatProdScCd5").prop("checked", true);
        	
        	$("#cbx_gubunType1").attr("disabled", true);
        	$("#cbx_gubunType2").attr("disabled", true);
        	$("#cbx_gubunType3").attr("disabled", true);
        	$("#cbx_gubunType4").attr("disabled", true);
        	$("#cbx_gubunType5").attr("disabled", false);
        	$("#cbx_gubunType6").attr("disabled", true);
        } else if($("#sbx_srhGubun").val() == "06") {
//            $("#cbx_prpadPsbUlPrdtYn6").prop("checked", true);
//            $("#cbx_beOblgPadYysCd6").prop("checked", true);
//            $("#cbx_beNewLobCd6").prop("checked", true);
        	$("#cbx_beChnlScCd6").prop("checked", true);
        	$("#cbx_pllnRatPrdtClsfCd6").prop("checked", true);
        	
        	$("#cbx_gubunType1").attr("disabled", true);
        	$("#cbx_gubunType2").attr("disabled", true);
        	$("#cbx_gubunType3").attr("disabled", true);
        	$("#cbx_gubunType4").attr("disabled", true);
        	$("#cbx_gubunType5").attr("disabled", true);
        	$("#cbx_gubunType6").attr("disabled", false);
        }
    });
    
    // 조회
    $('#btn_search').on('click', function(e){
        selectExprCtrlList();
    });
    
    //조회조건 엔터키 조회
    $("#search-item").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
    
 // 엑셀다운로드
    $('#btn_excel_download').on('click', function(e){
        excelMultiDownload()
    });
}

//엑셀 다운로드 선언
function excelMultiDownload() {
    if(gCondFlag == "N") {
        $.fn.msgBox("조회된 항목이 없습니다.");
        return;
    }
    
    if(!checkCond()) {
        $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
        return;
    }
    
    var sheetNameVal1 = $("#titleNm1").text();
        
    let fileName = "경험조정_"+$("#sbx_srhGubun option:selected").text()
    
    fileName = fileName+".xlsx";
    
    $.fn.exportMultiGridExcel([
        {
            id: 'gridDiv',
            sheetName : sheetNameVal1,
            fileName: fileName,
            applyItemTemplate : true,
            unit: "원",
            searchCond: $.fn.getSearchCond(gReqParam)
        },
        {
            id: 'gridDiv',
            sheetName : sheetNameVal1+"(코드)",
            fileName: fileName,
            applyItemTemplate : false,
            unit: "원"
        }
    ]);
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
function getGridFields(val){
    var fieldsArrayObj;
    var fieldsArray = [];

    var dnvldScCd = {name: "dnvldScCd", title: "경험조정구분", width:"90", css:"cell", type: "select", align:"center",
    		items: $.fn.getGridCodeItem("DNVLD_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var padPrmDnvldScCd = {name: "padPrmDnvldScCd", title: "납입보험료구분", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("PAD_PRM_DNVLD_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var potflScCd = {name: "potflScCd", title: "포트폴리오구분", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("POTFL_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var i17ExnexDvdScCd = {name: "i17ExnexDvdScCd", title: "유무배당구분", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("I17_EXNEX_DVD_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var rateTypScCd = {name: "rateTypScCd", title: "금리유형", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("RATE_TYP_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var rscRatProdScCd = {name: "rscRatProdScCd", title: "저무해지구분", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("RSC_RAT_PROD_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var highRskRatPrdtScCd = {name: "highRskRatPrdtScCd", title: "고위험률상품구분", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("HIGH_RSK_RAT_PRDT_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var beChnlScCd = {name: "beChnlScCd", title: "채널", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var acdtInsmDnvldScCd = {name: "acdtInsmDnvldScCd", title: "보험금구분", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("ACDT_INSM_DNVLD_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var wrkexDnvldScCd = {name: "wrkexDnvldScCd", title: "사업비구분", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("WRKEX_DNVLD_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var survInsmDnvldScCd = {name: "survInsmDnvldScCd", title: "생존보험금구분", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("SURV_INSM_DNVLD_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var pllnDnvldScCd = {name: "pllnDnvldScCd", title: "약관대출구분", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("PLLN_DNVLD_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var pllnRatPrdtClsfCd = {name: "pllnRatPrdtClsfCd", title: "보험계약대출율상품분류코드", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("PLLN_RAT_PRDT_CLSF_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var srdvlDnvldScCd = {name: "srdvlDnvldScCd", title: "해약환금금구분", css:"cell", type: "select", align:"center",
			items: $.fn.getGridCodeItem("SRDVL_DNVLD_SC_CD"), textField: "codeAbbrNm", valueField:"code"};
    
    var expt = { name: "expt", title:"예상", css:"cell", type: "text",align:"right", sorter:"number"
		       , itemTemplate:function(value, item) {
		           return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}
    	       };
    var real = { name: "real", title:"실제", css:"cell", type: "text",align:"right", sorter:"number"
	       , itemTemplate:function(value, item) {
	           return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}
	       };
    var difAmt = { name: "difAmt", title:"차이", css:"cell", type: "text",align:"right", sorter:"number"
	       , itemTemplate:function(value, item) {
	           return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}
	       };
    
    if ($("#sbx_srhGubun").val() == "01") {  //납입보험료
    	fieldsArray.push(dnvldScCd, padPrmDnvldScCd);
    	if ($('input:checkbox[id="cbx_potflScCd1"]').is(":checked") == true ) { //채널
            fieldsArray.push(potflScCd);
        }
    	if ($('input:checkbox[id="cbx_i17ExnexDvdScCd1"]').is(":checked") == true ) { //채널
            fieldsArray.push(i17ExnexDvdScCd);
        }
    	if ($('input:checkbox[id="cbx_rateTypScCd1"]').is(":checked") == true ) { //채널
            fieldsArray.push(rateTypScCd);
        }
    	if ($('input:checkbox[id="cbx_rscRatProdScCd1"]').is(":checked") == true ) { //채널
            fieldsArray.push(rscRatProdScCd);
        }
    	fieldsArray.push(expt, real, difAmt);
    } else if ($("#sbx_srhGubun").val() == "02") {  //사고보험금
    	fieldsArray.push(dnvldScCd, acdtInsmDnvldScCd);
    	if ($('input:checkbox[id="cbx_highRskRatPrdtScCd2"]').is(":checked") == true ) { //채널
            fieldsArray.push(highRskRatPrdtScCd);
        }
    	if ($('input:checkbox[id="cbx_beChnlScCd2"]').is(":checked") == true ) { //채널
            fieldsArray.push(beChnlScCd);
        }
    	fieldsArray.push(expt, real, difAmt);
    } else if ($("#sbx_srhGubun").val() == "03") {  //사업비
    	fieldsArray.push(dnvldScCd, wrkexDnvldScCd);
    	if ($('input:checkbox[id="cbx_beChnlScCd3"]').is(":checked") == true ) { //채널
            fieldsArray.push(beChnlScCd);
        }
    	if ($('input:checkbox[id="cbx_potflScCd3"]').is(":checked") == true ) { //채널
            fieldsArray.push(potflScCd);
        }
    	fieldsArray.push(expt, real, difAmt);
    } else if ($("#sbx_srhGubun").val() == "04"){
    	fieldsArray.push(dnvldScCd, survInsmDnvldScCd);
    	
    	if ($('input:checkbox[id="cbx_potflScCd4"]').is(":checked") == true ) {
            fieldsArray.push(potflScCd);
        }
    	if ($('input:checkbox[id="cbx_i17ExnexDvdScCd4"]').is(":checked") == true ) {
            fieldsArray.push(i17ExnexDvdScCd);
        }
    	if ($('input:checkbox[id="cbx_rateTypScCd4"]').is(":checked") == true ) {
            fieldsArray.push(rateTypScCd);
        }
    	if ($('input:checkbox[id="cbx_rscRatProdScCd4"]').is(":checked") == true ) {
            fieldsArray.push(rscRatProdScCd);
        }
    	fieldsArray.push(expt, real, difAmt);
    } else if ($("#sbx_srhGubun").val() == "05") { // 생존보험금  // 해약환급금
    	fieldsArray.push(dnvldScCd, srdvlDnvldScCd);
    	
    	if ($('input:checkbox[id="cbx_potflScCd5"]').is(":checked") == true ) {
            fieldsArray.push(potflScCd);
        }
    	if ($('input:checkbox[id="cbx_i17ExnexDvdScCd5"]').is(":checked") == true ) {
            fieldsArray.push(i17ExnexDvdScCd);
        }
    	if ($('input:checkbox[id="cbx_rateTypScCd5"]').is(":checked") == true ) {
            fieldsArray.push(rateTypScCd);
        }
    	if ($('input:checkbox[id="cbx_rscRatProdScCd5"]').is(":checked") == true ) {
            fieldsArray.push(rscRatProdScCd);
        }
    	
    	fieldsArray.push(expt, real, difAmt);
    } else if ($("#sbx_srhGubun").val() == "06") {  //약관대출
    	fieldsArray.push(dnvldScCd, pllnDnvldScCd);
    	if ($('input:checkbox[id="cbx_beChnlScCd6"]').is(":checked") == true ) {
            fieldsArray.push(beChnlScCd);
        }
    	if ($('input:checkbox[id="cbx_pllnRatPrdtClsfCd6"]').is(":checked") == true ) {
            fieldsArray.push(pllnRatPrdtClsfCd);
        }
    	fieldsArray.push(expt, real, difAmt);
    }
    return fieldsArray;
}

/**
 * @설명: 경험조정 - jsGrid 빈 테이블 생성
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 7.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 이준용 2021. 7. 7. 최초작성
 */
function initGridItem(){
    // jsGrid 빈 테이블 생성
    var fieldsArr = getGridFields();
    var gridObject = new ComJsGrid({
        id: "gridDiv", 
        height: 600,
        editing: false,
        sorting: true,
        paging: true,
        selectHiglight:true,
        fields : fieldsArr
    });

    //그리드 생성
    gridObject.gridCreate();
}


/**
 * @설명: 조회조건별 경험조정 산출적용 조회한다.
 * @최초작성자: 이준용
 * @최초작성일: 2021.02.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021.02.22 최초작성
 */
function selectExprCtrlList() {
    var reqParam = {};
    var condFinYmFrom = $("#ibx_finYmFrom").val().replace("-","");
    var condFinYmTo = $("#ibx_finYmTo").val().replace("-","");
    
    var list = {};
    var strColumArr = [];

    if(condFinYmFrom > condFinYmTo ) {
       $.fn.msgBox("조회 기간값이 잘 못 되었습니다.");
       return;
    }
    
    //체크된 건수
    var checkCnt = $("input[name='hierarchy_check']:checked").length; 
    if(checkCnt <= 0) {
        $.fn.msgBox("구분을 하나이상 체크해주세요.");
        return;
    }
    
    var titleText = "";
    condCheck = {};
    gCondHichyCheck = [];
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var colId = $(this).val();
        condCheck[$(this).attr("id")] = colId;
    	gCondHichyCheck.push($.toUnderscore(colId));
    	labelText = $("label[for='"+ $(this).attr("id") +"']").text();
    	titleText = titleText + labelText + ", ";
    	strColumArr.push($(this).val());
    });
    titleText = titleText.substr(0,titleText.length-2)+" ";
    
    reqParam.strColumArr = strColumArr;
    reqParam.finYmFrom = condFinYmFrom;
    reqParam.finYmTo = condFinYmTo;
    reqParam.srhGubun = $("#sbx_srhGubun").val();
    //reqParam.aplcBe = $("#sbx_aplcBe").val();
   
    gReqParam = reqParam;
    gReqParam.hierarchyCheck = gCondHichyCheck;
    
    gReqParam.ec = "EC";
    //파라미터 세팅
      $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd291m/selectExprCtrlList.do")
        .done(function(data) {
            // 그리드 초기화
            resetGrid();
            reDrawGrid();
            
            // 그리드 바인딩
            var grid1List = data.rstList;

         // 0건 그리드 메세지 처리부분
            if(grid1List.length == 0 || grid1List == undefined){
                $.fn.getReturnValue("gridDiv");
            } else {
                $("#gridDiv").jsGrid("loadData", grid1List).done();
            }
            
            gCondFlag = "Y";
        }).fail(function(data){
        $.fn.msgBox("[ajax] 서버 통신 실패입니다.");
        console.log("fail to selectExprCtrlList !!");
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
    $("#gridDiv").jsGrid("reset");
    $("#gridDiv").jsGrid("option", "data", []);
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
    $("#gridDiv").jsGrid("destroy");

    //그리드 create
    initGridItem();
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
 * @설명: SQL 조회 년도 가변적 세팅
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 14 최초작성
 */
function getFinYearArr(finYmFrom, finYmTo) {
    var finYearArr = [];
    var finYFrom = getFinYear(finYmFrom);
    var finYTo= getFinYear(finYmTo);
    
    for (var i = finYFrom; i <= finYTo; i++) {
        finYearArr.push(i);
    }
    
    return finYearArr;
}

/**
* @설명: 경험조정 - 조회시 조건, 현재 조건 체크 
* @최초작성자: 임국빈
* @최초작성일: 2021. 9. 28.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  임국빈 2021. 9. 28. 최초작성
*/
function checkCond() {
    //하이라키체크
    gCondHichyCheck = [];
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var colId = $(this).val();
        gCondHichyCheck.push($.toUnderscore(colId));
    });
    if(!gReqParam.hierarchyCheck.equals(gCondHichyCheck)) {
        return false;
    }
    
    return true;
}
