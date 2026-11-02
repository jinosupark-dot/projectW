/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 취소율 - 부가정보
 * @설명: 취소율 - 부가정보 화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 7. 13.
 * @최종변경일: 
 * @개정이력: 
 *  2021. 7. 13. 최초작성
 */

//전역변수
var gCondSrchDiv = "1";
var gCondAplcBe;
var gCondChnlDiv = null;
//조회flag
var gCondFlag = "N";
//조회조건obj
var gReqParam = {};

$(document).ready(function(){
    
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();

    //event 초기화(엑셀업,다운로드,조회,저장)
    initEvent();
    
    //최초로드
    reDrawGrid(gCondSrchDiv);
    
});


function initCommCd() {
    
    // 공통코드 조회(상품유형,채널)
    $.fn.loadCommonCode(["BE_NEW_LOB_CD","BE_CHNL_SC_CD"]);

    // 적용BE 조회
    gCondAplcBe = $.fn.getAplcBe("sbx_aplcBe","13");
    
    // 콤보박스 세팅
    $.fn.renderCombobox({
        codeArr : ["BE_CHNL_SC_CD"],            //code id 배열
        selArr : ["sbx_chnlScCd"],          //selectbox id 배열
        useFirstOption: false               //첫번째 option 사용여부
    });
    
    //채널별 콤보박스는 조회구분(상품유형별 채널별 취소율 경과월별 비중 에서만 보여준다)
    $("#divSel").hide();
    
}

function initEvent() {
    
    //조회구분 변경 이벤트
    $("#sbx_srchDiv").on("change", function(e){
        gCondSrchDiv = $("#sbx_srchDiv").val();
        gCondChnlDiv = null;
        $("#divSel").hide();
        if(gCondSrchDiv == "4") {
            $("#divSel").show();
            
            gCondChnlDiv = $("#sbx_chnlScCd").val();
        }
    });
    
    $("#sbx_chnlScCd").on("change", function(e){
        gCondChnlDiv = $("#sbx_chnlScCd").val();
    });
    
    //조회버튼 클릭
    $("#btn_search").on("click", function(e){
        console.log("btn_search click!");
        
        selectCancelrateAddedInfo();
    });
    

    //엑셀다운로드 버튼 click
    $("#btn_exportExcel").on("click", function(e){
        if(gCondFlag == "N" || $("#gridDivCnt").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = "취소율_" + $("#sbx_srchDiv option:selected").text() + ".xlsx";

        $.fn.exportMultiGridExcel([{
            
            id: 'gridDivCnt', 
            sheetName: "건수",
            fileName: fileName,
            applyItemTemplate : true,
			unit: "%",
			searchCond: $.fn.getSearchCondSub("ADTN")
        }, {
                
            id: 'gridDivDrv',
            sheetName: "Driver",
            fileName: fileName,
            applyItemTemplate : true,
			unit: "%"
        }, {
            
            id: 'gridDivCnt', 
            sheetName: "건수(코드)",
            fileName: fileName,
            applyItemTemplate : false,
			unit: "%"
        }, {
                
            id: 'gridDivDrv',
            sheetName: "Driver(코드)",
            fileName: fileName,
            applyItemTemplate : false,
			unit: "%"
        }]);

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
* @설명: 취소율 - 부가정보 - 건수 jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initGridCnt(pSrchDiv) {
    //사업비배부유형코드에 따른 그리드 필드 세팅
    var fieldsArr = getGridFields(pSrchDiv);
    
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
* @설명: 취소율 - 부가정보 - Driver jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initGridDrv(pSrchDiv){
    //사업비배부유형코드에 따른 그리드 필드 세팅
    var fieldsArr = getGridFields(pSrchDiv);
    
    // jsGrid 빈 테이블 생성
    var gridObjectDriver = new ComJsGrid({
        id: "gridDivDrv",
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
    if(gReqParam.selAplcBe != $('#sbx_aplcBe').val()) {
        return false;
    }
    
    //조회구분체크
    if(gReqParam.srhType != $("#sbx_srchDiv").val()) {
        return false;
    }
    //채널체크
    if(gReqParam.chnlScCd != $("#sbx_chnlScCd").val()) {
        return false;
    }

    return true;
}

function selectCancelrateAddedInfo() {
    console.log("selectCancelrateAddedInfo");
    
    //조회년월 load start
    var selAplcBe = $("#sbx_aplcBe").val();
    var condFinYmFrom = "";
    var condFinYmTo = "";

    for(var i=0; i<gCondAplcBe.length; i++) {
        
        if(gCondAplcBe[i].aplcBeNm == selAplcBe) {
            condFinYmFrom = gCondAplcBe[i].finStrYm;
            condFinYmTo = gCondAplcBe[i].finEndYm;
            break;
        }
    }
    if(condFinYmFrom == "" || condFinYmTo == "") {
        $.fn.msgBox("조회할 적용BE 구간이 존재하지 않습니다.");
        return;
    }
    //조회년월 load end
    
    var condGroupList = [];
    var condChnlScCd = "";
    if(gCondSrchDiv == "1") {
        condGroupList.push("'발생비중'");
    } else if(gCondSrchDiv == "2") {
        condGroupList.push("BE_NEW_LOB_CD");
    } else if(gCondSrchDiv == "3"){
        condGroupList.push("BE_NEW_LOB_CD");
    } else {
        condGroupList.push("BE_NEW_LOB_CD");
        condChnlScCd = "";
    }
    

    gReqParam = {
            "finYmFrom" : condFinYmFrom,
            "finYmTo" : condFinYmTo,
            "condSrchDiv" : gCondSrchDiv,
            "condChnlDiv" : gCondChnlDiv, 
            "condGroupList" : condGroupList,
            "finYearList" : $.fn.getFinYearArr(condFinYmFrom, condFinYmTo),
            "selAplcBe" : selAplcBe,
            "srhType" : $("#sbx_srchDiv").val(),
            "chnlScCd" : $("#sbx_chnlScCd").val()
    };
    
    $.callAjax({"jsonStr":JSON.stringify(gReqParam)}, "/be/pd/bepd253m/selectcancRatAdntInfoList.do")
    .done(function(data) {


        // 그리드 초기화
        resetGrid();
        
        ctlTitle(gCondSrchDiv);       //타이틀 세팅
        reDrawGrid(gCondSrchDiv);     //그리드 로딩
        //그리드 바인딩
        var cntList = data.cntList;
        var drvList = data.drvList;


        $("#gridDivCnt").jsGrid("loadData", cntList).done(function(){
            console.log(JSON.stringify(cntList));
            if(cntList.length == 0){
                $.fn.getReturnValue("gridDivCnt");
            }
        });
        
        $("#gridDivDrv").jsGrid("loadData", drvList).done(function(){ 
            console.log(JSON.stringify(drvList));
            if(drvList.length == 0){
                $.fn.getReturnValue("gridDivDrv");
            }
        });
        gCondFlag = "Y";

    }).fail(function(data){
    });     
    
    
}


function isValidSc(value){
    if(value==""){
        return;
    }
    var reg = (/[`~!@#$%^&*|\\\'\";:\/?]/g);
    return reg.test(value);
}

function setFinYm(range){
    // 마감년월 셋팅
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();

    var calcDate = new Date(year, month, "1");
    
    year = calcDate.getFullYear();
    month = '' + (calcDate.getMonth()+1);
    
    if (month.length < 2) month = '0' + month;
    
    var finYm = $.fn.monthFormat((year+month),'-');
    
    return finYm;
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 7 최초작성
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
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function reDrawGrid(pSrchDiv) {
    //그리드 destroy
    $("#gridDivCnt").jsGrid("destroy");
    $("#gridDivDrv").jsGrid("destroy");
    //그리드 create
    initGridCnt(pSrchDiv);
    initGridDrv(pSrchDiv);
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:납입상태별 중도인출율 연도별 비중(건수/Driver 기준)
 * 2:납입상태별 상품유형별 중도인출율 경과년도별 비중(건수/Driver 기준)
 * 3:납입상태별 채널유형별 중도인출율 경과년도별 비중(건수/Driver 기준)
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function getGridFields(type) {
    var selAplcBe = $("#sbx_aplcBe").val();
    var finYFrom = "";
    var finYTo = ""

    for(var i=0; i<gCondAplcBe.length; i++) {
        if(gCondAplcBe[i].aplcBeNm == selAplcBe) {
            finYFrom = gCondAplcBe[i].finStrYm;
            finYTo = gCondAplcBe[i].finEndYm;
            break;
        }
    }

    var tmpArr = [];
    //1
    var psgInfo = { name: "'발생비중'", title:"경과월", css:"cell", type: "text", width: 120, align:"center"};
    
    var productTypeInfo = { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 100, align:"center", items: $.fn.getGridCodeItem("BE_NEW_LOB_CD"), textField: "codeAbbrNm", valueField: "code"};

    //채널유형 필드
    var channelInfo = {
            name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 100, align:"center"
                , items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "codeNm", valueField: "code"
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
    case "1": //
        var targetArr = ["1","2","3","4","5"];
        var fieldsArr = getFieldsArr(targetArr);
        tmpArr.push(psgInfo);
        tmpArr = tmpArr.concat(fieldsArr);
        tmpArr.push(allInfo);
        break;
    case "2": //
        var targetArr = ["1","2","3","4","5"];
        var fieldsArr = getFieldsArr(targetArr);
        tmpArr.push(productTypeInfo);
        tmpArr = tmpArr.concat(fieldsArr);
        tmpArr.push(allInfo);
        break;
    case "3": //
        var targetArr = ["FC","PA","CA","DM","GA","GB","BA","AR","POOL","기타채널","개인대리점","내근"];
        var fieldsArr = getFieldsArr(targetArr);
        tmpArr.push(productTypeInfo);
        tmpArr = tmpArr.concat(fieldsArr);
        tmpArr.push(allInfo);
        break;
    case "4":
        var targetArr = ["1","2","3","4","5"];
        var fieldsArr = getFieldsArr(targetArr);
        tmpArr.push(productTypeInfo);
        tmpArr = tmpArr.concat(fieldsArr);
        tmpArr.push(allInfo);
    }
    
    return tmpArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function getFieldsArr(targetArr) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        if(target == 5) {
            target = target + "+";
        }
        var distStndValField = { name: (gCondSrchDiv!=3?"psgMntFgr"+targetArr[i]:$.toCamel("BE_CHNL_SC_CD_"+targetArr[i])) , title: target + (gCondSrchDiv!=3?"차월":""), css:"cell", type: "text", width: 140, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }};
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}

/**
 * @설명: 조회구분에 따라 타이틀 세팅
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function ctlTitle(pSrchDiv) {
    switch(pSrchDiv) {
    case "1" :  //
        $("#title1").text("경과월별 비중(건수 기준)");
        $("#title2").text("경과월별 비중(Driver 기준)");
        break;
        
    case "2" :  //
        $("#title1").text("상품유형별 경과월별 비중(건수 기준)");
        $("#title2").text("상품유형별 경과월별 비중(Driver 기준)");
        break;
        
    case "3" :  //
        $("#title1").text("상품유형별 채널별 비중(건수 기준)");
        $("#title2").text("상품유형별 채널별 비중(Driver 기준)");
        break;
    case "4" :
        $("#title1").text("채널별 상품유형별 경과월별 비중(건수 기준)");
        $("#title2").text("채널별 상품유형별 경과월별 비중(Driver 기준)");       
    default : //
        $("#title1").text("경과월별 비중(건수 기준)");
        $("#title2").text("경과월별 비중(Driver 기준)");
        break;
    }
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
			url: "/be/pd/bepd253p.do",
			name: "취소율 그래프 팝업",
			width: 1050,
			height: 850,
			sbxDiv: gCondSrchDiv,
			sbxChnl: $("#sbx_chnlScCd").val(),
			gridData1: $("#" + "gridDivCnt").jsGrid("option", "data"),
			gridField1: $("#" + "gridDivCnt").jsGrid("option", "fields"),
			gridData2: $("#" + "gridDivDrv").jsGrid("option", "data"),
			gridField2: $("#" + "gridDivDrv").jsGrid("option", "fields"),			
		}

		$.fn.openPopup(popupOption);
}

function openAdtnInfoGrpPopup_callback() {

	
}