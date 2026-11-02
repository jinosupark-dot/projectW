/**
 * @시스템명: 가정관리
 * @업무명: 해지율 - 부가정보
 * @설명: 해지율 - 부가정보 화면의 JS
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 20.
 * @최종변경일: 
 * @개정이력: 
 *  하승민 2021. 7. 20. 최초작성
 *  sampleJS : eadv111m.js
 */
var condAplcBe; //적용BE StartDt, EndDt
//조회flag
var gCondFlag = "N";
//조회조건obj
var gReqParam = {};

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    // 공통코드 조회(납입유형,상품유형,채널)
    $.fn.loadCommonCode(["BE_BLK_SC_CD","BE_NEW_LOB_CD","BE_CHNL_SC_CD","ASS_SC_CD","BE_FPAY_YN_SC_CD"]);

    //콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //최초로드
    reDrawGrid($("#sbx_rcsRat").val());
});

/**
* @설명: 콤보박스 초기화
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 20. 최초작성
*/
function initCommCd() {
    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","03");
}

/**
* @설명: event 초기화
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 20. 최초작성
*/
function initEvent() {
    ctlTitle("1");
    // 조회
    $('#btn_search').on('click', function(e){
        selectAdtnInfoList();
    });
    
    //엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download').on('click', function(e){
        if(gCondFlag == "N" || $("#gridDivCnt").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
        
        let fileName = $("#sbx_rcsRat option:selected").text() + ".xlsx";
        if($("#sbx_rcsRat").val()=='1') {
            $.fn.exportMultiGridExcel([
                {
                    id: 'gridDivCnt',
                    sheetName : "부가정보",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "%",
                    searchCond: $.fn.getSearchCondSub("ADTN")
                },
                {
                    id: 'gridDivCnt',
                    sheetName : "부가정보(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "%"
                }
            ]);
        } else {
            $.fn.exportMultiGridExcel([
                {
                    id: 'gridDivCnt',
                    sheetName : "건수",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "%",
                    searchCond: $.fn.getSearchCondSub("ADTN")
                },
                {
                    id: 'gridDivDriver',
                    sheetName : "Driver",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "%"
                },
                {
                    id: 'gridDivCnt',
                    sheetName : "건수(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "%"
                },
                {
                    id: 'gridDivDriver',
                    sheetName : "Driver(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "%"
                }
            ]);
        }
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
* @설명: 해지율 - 부가정보 - 건수 jsGrid 빈 테이블 생성 
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 20. 최초작성
*/
function initGridCnt(rcsRat) {
    //사업비배부유형코드에 따른 그리드 필드 세팅
    var fieldsArr = getGridFields(rcsRat);
    
   
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
* @설명: 해지율 - 부가정보 - Driver jsGrid 빈 테이블 생성 
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 20. 최초작성
*/
function initGridDriver(rcsRat) {
    //사업비배부유형코드에 따른 그리드 필드 세팅
    var fieldsArr = getGridFields(rcsRat);
    
   
    // jsGrid 빈 테이블 생성
    var gridObjectCnt = new ComJsGrid({
        id: "gridDivDriver",
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
* @설명: 해지율 - 부가정보 - lob 채널별 해지율 빈 테이블 생성 
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 20. 최초작성
*/
function initGridRcsBe(rcsRat){
    //사업비배부유형코드에 따른 그리드 필드 세팅
    var fieldsArr = getGridFields(rcsRat);
    var headerRowArr = getGridHederRow();
   
    if(rcsRat == '1') {
        // jsGrid 빈 테이블 생성
        var gridObjectRcsBe = new ComJsGrid({
            id: "gridDivCnt",
            height: 550,
            editing: false,
            sorting: true,
            paging: true,
            headerRowRenderer: function() {
                return headerRowArr;
            },
            fields : fieldsArr
        });
    } else {
        // jsGrid 빈 테이블 생성
        var gridObjectRcsBe = new ComJsGrid({
            id: "gridDivCnt",
            height: 300,
            editing: false,
            sorting: true,
            paging: false,
            headerRowRenderer: function() {
                return headerRowArr;
            },
            fields : fieldsArr
        });
    } 
    //그리드 생성
    gridObjectRcsBe.gridCreate();
}
/**
* @설명: 해지율 - 부가정보 - Skwness산출결과 빈 테이블 생성
* @최초작성자: 하승민
* @최초작성일: 2021. 7. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  하승민 2021. 7. 20. 최초작성
*/
function initGridSkwness(rcsRat){
    //사업비배부유형코드에 따른 그리드 필드 세팅
    var fieldsArr = getGridFields1();

       // jsGrid 빈 테이블 생성
       var gridObjectCnt = new ComJsGrid({
           id: "gridDivDriver",
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
    
    //조회구분체크
    if(gReqParam.rcsRat != $("#sbx_rcsRat").val()) {
        return false;
    }
    return true;
}

/**
 * @설명: 건수 기준 Grid 조회
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 20
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 20 최초작성
 */
function selectAdtnInfoList(){
    //조회에 필요한 값을 셋팅
    var rcsRat = $("#sbx_rcsRat").val();
    var checkList = "BE_CHNL_SC_CD";
    if(rcsRat==3) {
        checkList = "BE_NEW_LOB_CD";
    }else{
        checkList = "BE_CHNL_SC_CD";
    }

    //조회년월 load start
    var selAplcBe = $("#sbx_aplcBe").val();
    var befAplcBe = (selAplcBe.substr(0,4)-1)+"BE";
    var condFinYmFrom = "";
    var condFinYmTo = "";
    var condBefYmFrom = "";
    var condBefYmTo = "";
    
    console.log("condAplcBe", condAplcBe);

    for(var i=0; i<condAplcBe.length; i++) {
        if(condAplcBe[i].aplcBeNm == selAplcBe) {
            condFinYmFrom = condAplcBe[i].finStrYm;
            condFinYmTo = condAplcBe[i].finEndYm;
        }
        if(condAplcBe[i].aplcBeNm == befAplcBe) {
        	condBefYmFrom = condAplcBe[i].finStrYm;
        	condBefYmTo = condAplcBe[i].finEndYm;
        }
    }
     if(condFinYmFrom == "" || condFinYmTo == "") {
        $.fn.msgBox("조회할 적용BE 구간이 존재하지 않습니다.");
        return;
    }

    gReqParam.checkList = checkList; 
    gReqParam.finYmFrom = condFinYmFrom;
    gReqParam.finYmTo = condFinYmTo;
    gReqParam.befYmFrom = condBefYmFrom;
    gReqParam.befYmTo = condBefYmTo;

    gReqParam.rcsRat = $("#sbx_rcsRat").val();
    gReqParam.aplcBe = $("#sbx_aplcBe").val(); //적용BE 
    
    //적용BE 조회년도 
    var finYearArr = $.fn.getFinYearArr(condFinYmFrom, condFinYmTo);
    for(var i=0; i<5; i++) {
        gReqParam["finY" + i] = finYearArr[i];
    }
    
    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd143m/selectAdtnInfoList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        
        ctlTitle(gReqParam.rcsRat);       //타이틀 세팅
        reDrawGrid(gReqParam.rcsRat);     //그리드 로딩
        //그리드 바인딩
        var cntListData = data.cntList;
        var driverListtData = data.driverList;
        
        $("#gridDivCnt").jsGrid("loadData", cntListData).done(function(){ });
        $("#gridDivDriver").jsGrid("loadData", driverListtData).done(function(){ });
        
        // 0건 그리드 메세지 처리부분
        if(cntListData.length == 0) {
            $.fn.getReturnValue("gridDivCnt");
        }
        if(driverListtData.length == 0) {
            $.fn.getReturnValue("gridDivDriver");
        }
        gCondFlag = "Y"
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectMsgStatListByKeywords !!");
    });
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 20
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 20 최초작성
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
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 20
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 20 최초작성
 */
function reDrawGrid(rcsRat) {
    //그리드 destroy
    $("#gridDivCnt").jsGrid("destroy");
    $("#gridDivDriver").jsGrid("destroy");
    //그리드 create
    if(rcsRat==1) {
    	initGridRcsBe(rcsRat);
    	$("#gridDivDriver").jsGrid("destroy");
    } else if(rcsRat==4) {
    	initGridCnt(rcsRat);
    	initGridSkwness(rcsRat);
    }else {
    	initGridCnt(rcsRat);
        initGridDriver(rcsRat);
    }
}
/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 20
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  하승민 2021. 7. 20 최초작성
 */
function getGridFields(type) {
    var selAplcBe = $("#sbx_aplcBe").val()+" ";
    var befAplcBe = (selAplcBe.substr(0,4)-1)+"BE ";
    var codeArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
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
    var beBlkScCdArr = $.fn.getGridCodeItem("BE_BLK_SC_CD");
    var beNewLobCdArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
    //Block 필드
    var blockInfo = { 
            name: "beBlkScCd", title:"Block", css:"cell", type: "select", width: 150, align:"center"
                , itemTemplate:function(value, item) {
                	for(i=0; i<beBlkScCdArr.length; i++) {
                        if(value == beBlkScCdArr[i].code) {
                            return beBlkScCdArr[i].codeAbbrNm;
                        }
                    }
                }
    };
  //납입상태 필드
    var fpayYnScCdInfo = { 
            name: "beFpayYnScCd", title:"납입상태", css:"cell", type: "select", width: 120, align:"center"
                , items: $.fn.getGridCodeItem("BE_FPAY_YN_SC_CD"), textField: "codeNm", valueField: "code"
    };
    //상풍유형 필드
    var productTypeInfo = { 
            name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 100, align:"center"
                , itemTemplate:function(value, item) {
                        if (value=='ZZ' && item.beChnlScCd !='ZZ') {
                            return 'TOTAL';
                        } else if (item.beChnlScCd=='ZZ') {
                            return '';
                        } else {
                        	for(i=0; i<beNewLobCdArr.length; i++) {
                                if(value == beNewLobCdArr[i].code) {
                                    return beNewLobCdArr[i].codeAbbrNm;
                                }
                            }
                        }
                }
    };
    //채널유형 필드
    var channelInfo = {
            name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 100, align:"center"
                , itemTemplate:function(value, item) {
                    if (value=='ZZ') {
                        return 'TOTAL';
                    } else {
                        for(i=0; i<codeArr.length; i++) {
                            if(value == codeArr[i].code) {
                                return codeArr[i].codeNm;
                            }
                        }
                    }
            }
    };
    //전체 필드
    var allInfo = { 
            name: "total", title:"전체", css:"cell", type: "text",  width: 100, align:"right", sorter:"number"
                , itemTemplate:function(value, item) {return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);}
    };
     //==========================================================
    //필드항목 정의 END
    //==========================================================
    switch(type) {
     case "1": //LOB별 채널별 해지율 BE 변동사항 비교자료 
    	resultArr.push(blockInfo);
     	resultArr.push(fpayYnScCdInfo);
        resultArr.push(channelInfo);
    	resultArr.push(productTypeInfo);
    	var colNm = "psgYys";
    	var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12"];
    	var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
    	var fieldsArr = getPsgYysFieldsArr(targetArr, titleArr, colNm, selAplcBe);
    	resultArr = resultArr.concat(fieldsArr);
        var befFildsArr = getPsgYysFieldsArr(targetArr, titleArr, "bfrPsgYys", befAplcBe);
        resultArr = resultArr.concat(befFildsArr);
        var diffFildsArr = getPsgYysFieldsArr(targetArr, titleArr, "diff", "difference ");
        resultArr = resultArr.concat(diffFildsArr);
        break;
    
    case "2": //채널별 연도별 비중
        resultArr.push(channelInfo);
        var targetArr = $.fn.getFinYearArr(finYFrom, finYTo);
        var fieldsArr = getFieldsArr(targetArr);
        resultArr = resultArr.concat(fieldsArr);
        //합계세팅
        resultArr.push(allInfo);
        break;
        
    case "3": //상품유형별 연도별 비중
        resultArr.push(productTypeInfo);
        var targetArr = $.fn.getFinYearArr(finYFrom, finYTo);
        var fieldsArr = getFieldsArr(targetArr);
        resultArr = resultArr.concat(fieldsArr);
        //합계세팅
        resultArr.push(allInfo);
        break;
        
    case "4": //Skwness 산출
    	resultArr.push(productTypeInfo);
    	var colNm = "psgMntFgr";
    	var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15","16","17","18","19","20","21","22","23"
        	,"24","25","26","27","28","29","30","31","32","33","34","35","36"];
    	var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15","16","17","18","19","20","21","22","23"
        	,"24","25","26","27","28","29","30","31","32","33","34","35","36"];
    	var fieldsArr = getPsgMntFieldsArr(targetArr);
    	resultArr = resultArr.concat(fieldsArr);
        break;
    }
    return resultArr;
}

/* skewness 부가정보 -> 산출적용으로 메뉴 이동 및 내용 변경
 * 2022.01.04
 * 김민우
function getGridFields1(){
	
		
	    var chnlScCdArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
	    var newLobCdArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
	    
	 var resultArr = [];
	 
	 //채널유형 필드
	 var chnlScCd = {
	            name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 80, align:"center",
	            itemTemplate:function(value, item) {
	                var textField = "합계";
	                for(i=0; i<chnlScCdArr.length; i++) {
	                    if(value == chnlScCdArr[i].code) {
	                        textField = chnlScCdArr[i].codeNm;
	                        break;
	                    }
	                }
	                
	                return textField;
	            }
	    };
	    
	 var newLobCd = { 
	            name: "beNewLobCd" , title:"상품유형" , css:"cell", type: "select", width: 100, editing: false, align:"center",
                itemTemplate:function(value, item) {
                    if (value=='ZZ' && item.beChnlScCd !='ZZ') {
                        return 'TOTAL';
                    } else if (item.beChnlScCd=='ZZ') {
                        return '';
                    } else {
                        return $._commonObj["code"]["BE_NEW_LOB_CD"][value*1].codeAbbrNm;
                    }
                }
	    };
	    resultArr.push(chnlScCd);
	    resultArr.push(newLobCd);
		var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15","16","17","18","19","20","21","22","23"
        	,"24","25","26","27","28","29","30","31","32","33","34","35","36"];
    	var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11","12","13","14","15","16","17","18","19","20","21","22","23"
        	,"24","25","26","27","28","29","30","31","32","33","34","35","36"];
    	var fieldsArr = getPsgMntFieldsArr(targetArr);
    	resultArr = resultArr.concat(fieldsArr);
   
    return resultArr;
	    
}*/

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 경과월 배열 
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  하승민 2021. 7. 8 최초작성
 */
function getPsgYysFieldsArr(targetArr, titleArr, colNm, selAplcBe) {
    if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titleArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: colNm + target , title: selAplcBe + titleArr[i] + "차년도", css:"cell", type: "text", width: 100, align:"right", sorter:"number", 
                itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    
                }
        };
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  하승민 2021. 7. 8 최초작성
 */
function getFieldsArr(targetArr) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { 
                name: "finY" + i , title: target + "년도", css:"cell", type: "text", width: 140, align:"right", sorter:"number"
                    , itemTemplate:function(value, item) {
                        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                    }
        };
        
        resultArr.push(distStndValField);
    }
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  하승민 2021. 7. 8 최초작성
 */
function getPsgMntFieldsArr(targetArr) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    var resultArr = [];
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: "psgMntFgr" + target , title: target + "차월", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
            value = $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            return $.addCommaNumber(value);
        }};
        resultArr.push(distStndValField);
    }
    return resultArr;
}
/**
 * @설명: 조회구분에 따라 타이틀 세팅
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 8 최초작성
 */
function ctlTitle(rcsRat) {
    if(rcsRat == '1') {
        $("#title_driver").hide();
        $("#span_driver").hide();
        $("#gridDivDriver").hide();
    } else {
        $("#title_driver").show();
        $("#span_driver").show();
        $("#gridDivDriver").show();
    }
    switch(rcsRat) {
    case "1" :  //LOB별 채널별 해지율 BE 변동사항 비교자료
        $("#title_cnt").text("LOB별 채널별 해지율 BE 변동사항 비교자료");
        break;
        
    case "2" :  //채널별 해지율 연도별 비중
        $("#title_cnt").text("채널별 해지율 연도별 비중(건수기준)");
        $("#title_driver").text("채널별 해지율 연도별 비중(Driver 기준)");
        break;
        
    case "3" :  //상품유형별 해지율 연도별 비중
        $("#title_cnt").text("상품유형별 해지율 연도별 비중(건수 기준)");
        $("#title_driver").text("상품유형별 해지율 연도별 비중(Driver 기준)");
        break;
    
   /* default : //Skewness분석
        $("#title_cnt").text("상품유형별 분석 Skewness분석");
        $("#title_driver").text("Skewness 산출 결과");
        break;*/
    }
}

/**
 * @설명: 엑셀 오늘 날짜 세팅
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 7 최초작성
 */
function getToday() {
    var today = new Date();
    var d = new Date(today.getFullYear(), today.getMonth(), "1");
    d.setMonth(today.getMonth());
    let year  = d.getFullYear();
    let month = ("0" + (d.getMonth() + 1)).slice(-2);
    const toYm = year + "-" + month;
    return toYm;
}

/**
 * @설명: 시작년월 - 종료년월에 따른 해당 년도 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  하승민 2021. 7. 14 최초작성
 */
function getFinYear(finYear) {
    var d =  new Date(finYear.substring(0,4), finYear.substring(5,7)-1);
    d.setMonth(d.getMonth()+6);
    return d.getFullYear();
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 헤더 생성하여 리턴
 * @최초작성자: 하승민
 * @최초작성일: 2021. 7. 28
 * @최종변경일: 
 * @매개변수:
 * @반환값: $result : 그리드헤더
 * @개정이력: 
 *  하승민 2021. 7. 28 최초작성
 */
function getGridHederRow() {
    var $result = $("<tr>").height(0);
    $result.append($("<th>").width(150))
    $result.append($("<th>").width(120))
        for(var i=0; i<37; i++) {
            $result.append($("<th>").width(100))
        }
    $result.append($("<th>").width(100));
    
    var selAplcBe = $("#sbx_aplcBe").val();
        var comBe = (selAplcBe.substr(0,4)-1)+"BE";
        $result = $result.add($("<tr class='jsgrid-header-row'>")
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("BLOCK"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("납입상태"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("채널유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 12).text(selAplcBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 12).text(comBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 12).text("difference"))
        );
        var $result1 = $("<tr class='jsgrid-header-row'>")
        for(var i=0; i<3; i++) {
            $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("2차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("3차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("4차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("5차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("6차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("7차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("8차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("9차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("10차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("11차년도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("12차년도"));
        }
    $result = $result.add($result1);
    return $result;
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
            url: "/be/pd/bepd143p.do",
            name: "해지율 그래프 팝업",
            width: 1050,
            height: 850,
            sbxDiv: $("#sbx_rcsRat option:selected").val(),
            aplcBe: $("#sbx_aplcBe").val().substr(0,4),
            gridData1: $("#" + "gridDivCnt").jsGrid("option", "data"),
            gridField1: $("#" + "gridDivCnt").jsGrid("option", "fields"),
            gridData2: $("#" + "gridDivDriver").jsGrid("option", "data"),
            gridField2: $("#" + "gridDivDriver").jsGrid("option", "fields"),           
        }

        $.fn.openPopup(popupOption);
}

function openAdtnInfoGrpPopup_callback() {

    
}