/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 감액율 산출적용
 * @설명: 감액율 산출적용 화면 JS
 * @최초작성자: 이준용
 * @최초작성일: 2021. 07. 26.
 * @최종변경일: 
 * @개정이력: 
 *  이준용 2021. 07. 26 최초작성
 */

//전역변수
var gArrCols = []; //대상테이블 컬럼리스트(for 엑셀업로드)
const gTbNm = "TB_IBECRS12";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//직전년도be플래그
var gCondJsBfrYear = "N";
//one-off플래그
var gCondOneoffCheck = "N";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //버튼 권한 처리 2021.06.14
//    $.fn.setBtnPermission([{"btnId":"#btn_xlsdown","type":"A"}
//                          ,{"btnId":"#btn_exportExcel","type":"A"}])
                          
    //적용BE 콤보박스 초기화
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //보정전 산출결과
    initGridRtfBfc();
    
    //보정후 산출결과
    initGridRftAfc();
    
    //최종BE 적용결과
    initGridLastBe();

});

/**
* @설명: 콤보박스 초기화
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 7.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이현수 2021. 7. 7. 최초작성
*/
function initCommCd() {
    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","14");
    
 // 공통코드 조회(채널, 상품유형)
    $.fn.loadCommonCode(["BE_CHNL_SC_CD", "BE_NEW_LOB_CD"]);
}

/**
* @설명: event 초기화
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 26. 최초작성
*/
function initEvent() {
	//셀렉트박스별 타이틀명 추출
    var bfcTitle = $("#title_rtfBfc").text().replace(/\s/gi, "");
    var afcTitle = $("#title_rtfAfc").text().replace(/\s/gi, "");
    var lastTitle = $("#title_lastBe").text().replace(/\s/gi, "");
    
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
    
	//one-off체크여부
	$("#cbx_oneOff").on("change", function(e){
		if ($('input:checkbox[id="cbx_oneOff"]').is(":checked") == true) {
			gCondOneoffCheck = "Y";
		} else {
			gCondOneoffCheck = "N";
		}
	});
    
    // 조회
    $('#btn_search').on('click', function(e){
        if (gCondOneoffCheck == 'Y') {
            $("#title_rtfBfc").text("보정전 산출결과(One-off 반영)");
            $("#title_rtfAfc").text("보정후 산출결과(One-off 반영)");
            $("#title_lastBe").text("최종BE 산출결과(One-off 반영)");
        } else {
            $("#title_rtfBfc").text("보정전 산출결과");
            $("#title_rtfAfc").text("보정후 산출결과");
            $("#title_lastBe").text("최종BE 산출결과");
        }
        
        selectProdAplcList();
    });
    
    //보정전:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
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
        
        let fileName = $(document).find("title").text()+"_"+$("#sbx_aplcBe").val()+".xlsx";
        
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDivRtfBfc',
                sheetName : "보정전",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%",
                searchCond: $.fn.getSearchCondSub("PROD")
            },
            {
                id: 'gridDivRtfAfc',
                sheetName : "보정후",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%"
            },
            {
                id: 'gridDivLastBe',
                sheetName : "최종BE적용결과",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "%"
            },
            {
                id: 'gridDivRtfBfc',
                sheetName : "보정전(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            },
            {
                id: 'gridDivRtfAfc',
                sheetName : "보정후(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            },
            {
                id: 'gridDivLastBe',
                sheetName : "최종BE적용결과(코드)",
                fileName: fileName,
                applyItemTemplate : false,
                unit: "%"
            }
        ]);
    });
    
    //최종BE적용결과:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $("#btn_xlsdown").on("click", function(e){
        //직전년도BE비교 체크
    	if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
            $.fn.msgBox("직전년도be비교 체크 해제 후 다운로드 해주세요.");
            return;
        }
        
        let fileName = "감액율_산출적용_최종BE적용결과" 
                     + ".xlsx";
        $.fn.exportGridExcel({
            id       : 'gridDivLastBe', 
//            sheetName : lastTitle,
            fileName : fileName, 
            applyItemTemplate: true
        });
        
		var arrColsInfo = $.fn.getTbCols(gTbNm);
		gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
    });
    
	//엑셀업로드 클릭
	$("#btn_loadExcel").on("click", function(e){
        //직전년도BE비교 체크
		if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
            $.fn.msgBox("직전년도be비교 체크 해제 후 다운로드 해주세요.");
            return;
        }
        
		if(gArrCols.length == 0) {
			$.fn.msgBox("최종BE 적용결과를 다운로드한 후 엑셀업로드를 해주세요.");
			return;
		}
		var paramObj = {};
		
		paramObj.id = "gridDivLastBe";					//그리드 ID
		paramObj.callbackFn = function(data) {		//그리드 바인딩 후 후처리 함수
			if(data.result == "1") {
				$.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
					if (obj.btn_ok) {
						console.log("로드데이터");
						console.log(JSON.stringify(data["list"]));
						console.log(gArrCols);
						data["colList"] = gArrCols;
						data["tbNm"] = gTbNm;
						data["aplcBe"] = $("#sbx_aplcBe").val();
						$.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveLstBeList.do')
						.done(function(data) {
							if(data.result == '1') {
								$.fn.msgBox('정상적으로 처리되었습니다.');
							}
						}).fail(function(data){
							$.fn.msgBox('데이터 저장이 실패했습니다.');
						});
					}
				}, 2);

				//엑셀데이터 형식 맞추기
				//loadGridSetting();
			}
		};
		$.fn.BeloadGridExcel(paramObj);
		
	});
}

/**
* @설명: 감액율 - 산출적용 - 보정전 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 26. 최초작성
*/
function initGridRtfBfc(){
    
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();
    
    var gridObjectRtfBfc = new ComJsGrid({
        id: "gridDivRtfBfc",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRtfBfc.gridCreate();
}

/**
* @설명: 감액율 - 산출적용 - 보정후 산출결과 jsGrid 빈 테이블 생성 
* @최초작성자: 이준용
* @최초작성일: 2021. 7. 26.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  이준용 2021. 7. 26. 최초작성
*/
function initGridRftAfc(){
    
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();
    
    var gridObjectRftAfc = new ComJsGrid({
        id: "gridDivRtfAfc",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        headerRowRenderer: function() {
            return headerRowArr;
        },
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectRftAfc.gridCreate();
}

/**
 * @설명: 감액율 - 산출적용 - 최종BE 적용결과 jsGrid 빈 테이블 생성 
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  이준용 2021. 7. 26. 최초작성
 */
function initGridLastBe(){
    
    var fieldsArr = getGridFields();
    var headerRowArr = getGridHederRow();
    
    var gridObjectLastBe = new ComJsGrid({
        id: "gridDivLastBe",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
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
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 26 최초작성
 */
function selectProdAplcList(){
    // 조회에 필요한 값을 셋팅
    var reqParam = {};
    reqParam.aplcBe = $("#sbx_aplcBe").val(); //적용BE 
    reqParam.befAplcBe = (reqParam.aplcBe.substr(0,4)-1)+"BE";
    
    //직전년도BE 체크
    var jsBfrYear = "N";
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
        jsBfrYear = "Y";
    } else {
        jsBfrYear = "N";
    }
    reqParam.jsBfrYear = jsBfrYear;
    
    //One-off 체크
    reqParam.rtfBfcOneOff = "01";
    reqParam.rtfAfcOneOff = "02";
    if ($('input:checkbox[id="cbx_oneOff"]').is(":checked") == true) {
        reqParam.rtfBfcOneOff = "03";
        reqParam.rtfAfcOneOff = "04";
    }

    //엑셀 validation 체크용 오브젝트
    gReqParam.aplcBe = $("#sbx_aplcBe").val();
    gReqParam.jsBfrYear = gCondJsBfrYear;
    gReqParam.oneoffCheck = gCondOneoffCheck;
    
    // 데이터 조회
    $.callAjax(reqParam, "/be/pd/bepd262m/selectProdAplcList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        reDrawGrid();
        //그리드 바인딩
        var rtfBfcListData = data.rtfBfcList;
        var rtfAfcListData = data.rtfAfcList;
        var lastBeListData = data.lastBeList;
        
        $("#gridDivRtfBfc").jsGrid("loadData", rtfBfcListData);
        $("#gridDivRtfAfc").jsGrid("loadData", rtfAfcListData);
        $("#gridDivLastBe").jsGrid("loadData", lastBeListData);
        
        // 0건 그리드 메세지 처리부분
        if(rtfBfcListData.length == 0) {
            $.fn.getReturnValue("gridDivRtfBfc");
        }
        if(rtfAfcListData.length == 0) {
            $.fn.getReturnValue("gridDivRtfAfc");
        }
        if(lastBeListData.length == 0) {
            $.fn.getReturnValue("gridDivLastBe");
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
        console.log("fail to selectMsgStatListByKeywords !!");
    });
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 7. 26 최초작성
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
    $("#gridDivRtfBfc").jsGrid("destroy");
    $("#gridDivRtfAfc").jsGrid("destroy");
    $("#gridDivLastBe").jsGrid("destroy");
    //그리드 create
    initGridRtfBfc();
    initGridRftAfc();
    initGridLastBe();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 이준용
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:감액율 산출 연도별 비중(건수/Driver 기준)
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  이준용 2021. 7. 8 최초작성
 */
function getGridFields() {
    var aplcBe = $("#sbx_aplcBe").val(); //적용BE
    var befAplcBe = (aplcBe.substr(0,4)-1)+"BE";
    
    //코드 목록
    var beChnlScCdArr = $.fn.getGridCodeItem("BE_CHNL_SC_CD");
    var beNewLobCdArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
    
    //그리드 공통부분 필드
    var resultArr = [
        { name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 100, align:"center", 
            itemTemplate:function(value, item) {
                var textField = "TOTAL";
                for(i=0; i<beChnlScCdArr.length; i++) {
                    if(value == beChnlScCdArr[i].code) {
                        textField = beChnlScCdArr[i].codeNm;
                        break;
                    }
                }

                return textField;
            }
        },
        { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 100, align:"center", 
            itemTemplate:function(value, item) {
                var textField = "TOTAL";
                for(i=0; i<beNewLobCdArr.length; i++) {
                    if(value == beNewLobCdArr[i].code) {
                        textField = beNewLobCdArr[i].codeAbbrNm;
                        break;
                    }
                }
                
                if($.fn.isEmpty(item.beChnlScCd) || item.beChnlScCd == "ZZ") {
                    textField = "";
                }
                
                return textField;
            }
        }
    ];
    //전체 필드
    var allInfo = { 
            name: "total", title:"전체", css:"cell", type: "text",  width: 100, align:"right", sorter:"number"
                , itemTemplate:function(value, item) {return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);}
    };
    
    var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
    var fieldsArr = getPsgYysFieldsArr(targetArr, "psgYys", aplcBe);
    resultArr = resultArr.concat(fieldsArr);
    
    //직전년도BE 체크
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
        var befFildsArr = getPsgYysFieldsArr(targetArr, "bfrPsgYys", befAplcBe);
        resultArr = resultArr.concat(befFildsArr);
        var diffFildsArr = getPsgYysFieldsArr(targetArr, "diff", "difference");
        resultArr = resultArr.concat(diffFildsArr);
    } else {
        resultArr.push(allInfo);
    }

    return resultArr;
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
function getPsgYysFieldsArr(targetArr, colNm, aplcBe) {
    if($.fn.isEmpty(targetArr)) {
        return [];
    }
    
    var resultArr = [];
    var addVal="";
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        if (i==11) addVal = "+";
        var distStndValField = { name: colNm+target , title: aplcBe+" "+target+addVal+"차년도", css:"cell", type: "text", width: 100, align:"right", sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);
        }};
   
        resultArr.push(distStndValField);
    }
    return resultArr;
}

function getGridHederRow() {
    var $result = $("<tr>").height(0);
    for(var i=0; i<15; i++) {
        $result.append($("<th>").width(100))
    }
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") == true) {
        for(var i=0; i<24; i++) {
            $result.append($("<th>").width(100))
        }
    }
//    $result.append($("<th>").width(100));
    
    var selAplcBe = $("#sbx_aplcBe").val();
    if ($('input:checkbox[id="cbx_jsBfrYear"]').is(":checked") != true) {
        $result = $result.add($("<tr class='jsgrid-header-row'>")

                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("채널유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 13).text(selAplcBe))
        );
        var $result1 = $("<tr class='jsgrid-header-row'>")
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1차년도"))
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
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("12+차년도"))
        .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전체"));
    } else {
        var comBe = (selAplcBe.substr(0,4)-1)+"BE";
        $result = $result.add($("<tr class='jsgrid-header-row'>")

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
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("12+차년도"));
        }
    }
    
    $result = $result.add($result1);
    return $result;
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
	
	//직전년도BE체크
	if(gReqParam.jsBfrYear != gCondJsBfrYear) {
		return false;
	}
	
	//원오프체크
	if(gReqParam.oneoffCheck != gCondOneoffCheck) {
		return false;
	}
	return true;
}