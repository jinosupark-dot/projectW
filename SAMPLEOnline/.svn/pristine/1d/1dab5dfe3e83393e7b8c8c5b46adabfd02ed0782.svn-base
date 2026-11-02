/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 위험율 - 부가정보
 * @설명: 위험율 - 부가정보 화면의 JS
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 28.
 * @최종변경일: 
 * @개정이력: 
 *  이현수 2021. 7. 28. 최초작성
 */
var condAplcBe; //적용BE StartDt, EndDt
//조회flag
var gCondFlag = "N";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    // 공통코드 조회(납입유형,급부대분류)
    $.fn.loadCommonCode(["HIGH_RSK_RAT_PRDT_SC_CD","BENF_LCLSF_CD"]);

    //콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //최초로드
    reDrawGrid($("#sbx_midDrotCd").val());
});

/**
* @설명: 콤보박스 초기화
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 28.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 28. 최초작성
*/
function initCommCd() {
    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","01");
}

/**
* @설명: event 초기화
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 28.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 28. 최초작성
*/
function initEvent() {
    // 조회
    $('#btn_search').on('click', function(e){
        selectRskRatAdtnInfoList();
    });
    
    //엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $('#btn_excel_download').on('click', function(e){
        if(gCondFlag == "N"
            || ($("#gridDiv").jsGrid("option", "data").length == 0)) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        let fileName = "위험율_" + $("#sbx_midDrotCd option:selected").text() + ".xlsx";

        $.fn.exportMultiGridExcel([
            {
                id: 'gridDiv',
                sheetName : "On-level 전·후 위험보험료 비교",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "원/%",
                searchCond: $.fn.getSearchCondSub("ADTN")
            },
            {
                id: 'gridDiv',
                sheetName : "On-level 전·후 위험보험료 비교(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "원/%"
            }
        ]);
    });
    
	//그래프 클릭
	$("#btn_popGrp").on("click", function(e) {
		
		if(gCondFlag == "N") {
			$.fn.msgBox("조회된 항목이 없습니다.");
			return;
		}
		/*
		if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }
		*/
		openAdtnInfoGrpPopup();
	});
	
	//조회구분 셀렉트박스 선택 목록 1건
	$("#sbx_midDrotCd").prop("disabled", true);
}

/**
* @설명: 위험율 - 부가정보 - 건수 jsGrid 빈 테이블 생성 
* @최초작성자: 이현수
* @최초작성일: 2021. 7. 28.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 28. 최초작성
*/
function initGrid(midDrotCd) {
    
    var fieldsArr = getGridFields(midDrotCd);
    
    // jsGrid 빈 테이블 생성
    var gridObjectCnt = new ComJsGrid({
        id: "gridDiv",
        height: 650,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectCnt.gridCreate();
}

/**
 * @설명: 건수 기준 Grid 조회
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 7 최초작성
 */
function selectRskRatAdtnInfoList(){
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
    
    reqParam.finYmFrom = condFinYmFrom;
    reqParam.finYmTo = condFinYmTo;
    
    reqParam.midDrotCd = $("#sbx_midDrotCd").val();
    
    // 데이터 조회
    $.callAjax(reqParam, "/be/pd/bepd123m/selectRskRatAdtnInfoList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        
        ctlTitle(reqParam.midDrotCd);       //타이틀 세팅
        reDrawGrid(reqParam.midDrotCd);     //그리드 로딩
        //그리드 바인딩
        var listData = data.dataList;

        $("#gridDiv").jsGrid("loadData", listData).done(function(){ });
        
        // 0건 그리드 메세지 처리부분
        if(listData.length == 0) {
            $.fn.getReturnValue("gridDiv");
        }
        gCondFlag = "Y"
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectRskRatMsgStatListByKeywords !!");
    });
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
    $("#gridDiv").jsGrid("reset");
    $("#gridDiv").jsGrid("option", "data", []);
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
function reDrawGrid(midDrotCd) {
    //그리드 destroy
    $("#gridDiv").jsGrid("destroy");
    //그리드 create
    initGrid(midDrotCd);
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:급부대분류 경과기간별 On-level 전/후 위험보험료 비교
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function getGridFields(type) {
    var selAplcBe = $("#sbx_aplcBe").val();
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
    var resultArr = [
        { name: "highRskRatPrdtScCd", title:"고위험율상품구분", css:"cell", type: "select", width: 130, align:"center"
            , items: $.fn.getGridCodeItem("HIGH_RSK_RAT_PRDT_SC_CD"), textField: "codeNm", valueField: "code"
        },
        { name: "benfLclsfCd", title:"급부대분류", css:"cell", type: "select", width: 100, align:"center"
            , items: $.fn.getGridCodeItem("BENF_LCLSF_CD"), textField: "codeNm", valueField: "code"
        },
        { name: "lv", title:"On-Level", css:"cell", type: "text", width: 120, align:"center"}
    ];
    
    var total = { name: "total", title:"전체", css:"cell", type: "text", width: 150, align:"right", sorter:"number", 
            itemTemplate:function(value, item) {
                if(item.lv.indexOf("비율") == -1) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
                } else {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
                }
            }
    };
    
    switch(type) {
    case "1": //급부대분류 경과기간별 On-level 전/후 위험보험료 비교
        var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
        var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12+"];
        var fieldsArr = getPsgYysFieldsArr(targetArr, titleArr);
        resultArr = resultArr.concat(fieldsArr);
        break;
    }
    
    resultArr.push(total);
    
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형배열 / titleArr<array> : 타이틀 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이현수 2021. 7. 8 최초작성
 */
function getPsgYysFieldsArr(targetArr, titleArr) {
    if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titleArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var title = titleArr[i];
        var distStndValField = { name: "psgYys" + target , title: title + "차년", css:"cell", type: "text", width: 150, align:"right", sorter:"number", itemTemplate:function(value, item) {
            if(item.lv.indexOf("비율") == -1) {
                return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
            } else {
                return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
            }
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
function ctlTitle(midDrotCd) {
    switch(midDrotCd) {
    case "1" :
        $("#title_cnt").text("On-level 전ㆍ후 위험보험료 비교");
        break;
    default :
        $("#title_cnt").text("On-level 전ㆍ후 위험보험료 비교");
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
			url: "/be/pd/bepd123p.do",
			name: "위험율 그래프 팝업",
			width: 1050,
			height: 850,
			//sbxDiv: gCondSrchDiv,
			sbxChnl: $("#sbx_chnlScCd").val(),
			gridData1: $("#" + "gridDiv").jsGrid("option", "data"),
			gridField1: $("#" + "gridDiv").jsGrid("option", "fields")
			//gridData2: $("#" + "gridDivDrv").jsGrid("option", "data"),
			//gridField2: $("#" + "gridDivDrv").jsGrid("option", "fields")			
	}

	$.fn.openPopup(popupOption);
}

function openAdtnInfoGrpPopup_callback() {

	
}