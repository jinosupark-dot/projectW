/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 취소율
 * @설명: 취소율 > 산출적용 화면의 JS
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 7. 29.
 * @최종변경일: 
 * @개정이력: 
 *  박세라 (61000434) 2021. 7. 29. 최초작성
 */
var condAplcBe;
var gTbNm = "TB_IBECRS11";
var gArrCols = [];
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
//    $.fn.setBtnPermission([{"btnId":"#btn_exportExcel","type":"A"}])
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //event 초기화
    initEvent();
    
    // 기본 grid 세팅
    initGridDivBeforeRtf();
    initGridDivAfterRtf();
    initGridDivRsltBe();
});

/**
* @설명: 취소율 > 산출적용 기본 세팅
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 7. 29.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 29. 최초작성
*/

function initCommCd() {
    
    // 공통코드 조회
    $.fn.loadCommonCode(["BE_CHNL_SC_CD","BE_NEW_LOB_CD"]);

    // 적용BE 조회
    condAplcBe = $.fn.getAplcBe("sbx_aplcBe","13");
}

function initEvent() {
    //직전년도BE비교
    $("#cbx_comprBe").on("change", function(e){
        if ($('input:checkbox[id="cbx_comprBe"]').is(":checked") == true) {
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
            $("#title_rtfLst").text("최종BE 산출결과(One-off 반영)");
        } else {
            $("#title_rtfBfc").text("보정전 산출결과");
            $("#title_rtfAfc").text("보정후 산출결과");
            $("#title_rtfLst").text("최종BE 산출결과");
        }
        selectCancRatProdAplcList();
    });
    
    // 엑셀다운로드
    $('#btn_excel_download').on('click', function(e){
        if(gCondFlag == "N" || $("#gridDivBeforeRtf").jsGrid("option", "data").length == 0) {
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
                    id: 'gridDivBeforeRtf',
                    sheetName : "보정전",
                    fileName: fileName,
        			applyItemTemplate: true,
        			unit: "%",
        			searchCond: $.fn.getSearchCondSub("PROD")
                },
                {
                    id: 'gridDivAfterRtf',
                    sheetName : "보정후",
                    fileName: fileName,
        			applyItemTemplate: true,
        			unit: "%",
        			searchCond: $.fn.getSearchCondSub("PROD")
                },
                {
                    id: 'gridDivRsltBe',
                    sheetName : "최종BE적용",
                    fileName: fileName,
        			applyItemTemplate: true,
        			unit: "%",
        			searchCond: $.fn.getSearchCondSub("PROD")
                },
                {
                    id: 'gridDivBeforeRtf',
                    sheetName : "보정전(코드)",
                    fileName: fileName,
        			applyItemTemplate: false,
        			unit: "%",
        			searchCond: $.fn.getSearchCondSub("PROD")
                },
                {
                    id: 'gridDivAfterRtf',
                    sheetName : "보정후(코드)",
                    fileName: fileName,
        			applyItemTemplate: false,
        			unit: "%",
        			searchCond: $.fn.getSearchCondSub("PROD")
                },
                {
                    id: 'gridDivRsltBe',
                    sheetName : "최종BE적용(코드)",
                    fileName: fileName,
        			applyItemTemplate: false,
        			unit: "%",
        			searchCond: $.fn.getSearchCondSub("PROD")
                }
        ]);
    });
    
    //최종BE적용결과:엑셀다운로드(타이틀_YYYYMMDD.xlsx)
    $("#btn_xlsdown").on("click", function(e){
        //직전년도BE비교 체크
        if($("#gridDivRsltBe").jsGrid("option", "fields").length > 8) {
            $.fn.msgBox("조회 후 다운로드 해주세요.");
            return;
        }
        
		var arrColsInfo = $.fn.getTbCols(gTbNm);
		gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
		
        let fileName = "취소율_산출적용_최종BE적용결과.xlsx";
        $.fn.exportGridExcel({
            id       : 'gridDivRsltBe', 
            fileName : fileName
        });
    });
    
	//엑셀업로드 클릭
	$("#btn_loadExcel").on("click", function(e){
		
        //직전년도BE비교 체크
        if($("#gridDivRsltBe").jsGrid("option", "fields").length > 8) {
            $.fn.msgBox("조회 후 업로드 해주세요.");
            return;
        }
		
		if(gArrCols.length == 0) {
			$.fn.msgBox("최종BE 적용결과를 다운로드한 후 엑셀업로드를 해주세요.");
			return;
		}
		var paramObj = {};
		
		paramObj.id = "gridDivRsltBe";					//그리드 ID
		paramObj.callbackFn = function(data) {		//그리드 바인딩 후 후처리 함수
			if(data.result == "1") {
				$.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
					if (obj.btn_ok) {
						data["colList"] = gArrCols;
						data["tbNm"] = gTbNm;
						data["aplcBe"] = $("#sbx_aplcBe").val();
						$.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveLstBeList.do')
						.done(function(data) {
							if(data.result == '1') {
								$.fn.msgBox('정상적으로 처리되었습니다.');
								//SelectInsRIvtContMngInqrList();
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
* @설명: 취소율 > 산출적용 기본 그리드 세팅
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 7. 29.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 29. 최초작성
*/

function settingFields() {
    var selAplcBe = $("#sbx_aplcBe").val();
    var comBe = (selAplcBe.substr(0,4)-1)+"BE";
    
    var fieldList = [];
    var common = { name: "beChnlScCd", title:"채널유형", css:"cell", type: "select", width: 40, align:"center",
            items: $.fn.getGridCodeItem("BE_CHNL_SC_CD"), textField: "codeNm", valueField:"code"}
    fieldList.push(common);    
    var common2 =  { name: "beNewLobCd", title:"상품유형", css:"cell", type: "select", width: 40, align:"center"
    		, itemTemplate:function(value, item) {
            	if(item.beChnlScCd == "ZZ") {
            		return null;
            	}else {
                	var codeArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
                    for(i=0; i<codeArr.length; i++) {
                        if(value == codeArr[i].code) {
                            return codeArr[i].codeAbbrNm;
                        }
                    }
            	}
            }
    }
    fieldList.push(common2);

    for(var i=1; i<=5; i++) {
        if(i==5) {
            var field = { name: "psgMntFgr"+i, title:selAplcBe+" "+i+"+차월도", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            	return $.fn.isEmpty(value) ? "0.00" : ((value*1).toFixed(2));}}
        } else {
            var field = { name: "psgMntFgr"+i, title:selAplcBe+" "+i+"차월도", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
            	return $.fn.isEmpty(value) ? "0.00" : ((value*1).toFixed(2));}}
        }
        fieldList.push(field);
    }
    
    if ($('input:checkbox[id="cbx_comprBe"]').is(":checked") == true) {
        for(var i=1; i<=5; i++) {
            if(i==5) {
                var field = { name: "comprPsgMntFgr"+i, title:comBe+" "+i+"+차월도", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
                	return $.fn.isEmpty(value) ? "0.00" : ((value*1).toFixed(2));}}
            } else {
                var field = { name: "comprPsgMntFgr"+i, title:comBe+" "+i+"차월도", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
                	return $.fn.isEmpty(value) ? "0.00" : ((value*1).toFixed(2));}}
            }
            fieldList.push(field);
        }
        for(var i=1; i<=5; i++) {
            if(i==5) {
                var field = { name: "diffPsgMntFgr"+i, title:"difference "+i+"+차월도", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
                	return $.fn.isEmpty(value) ? "0.00" : ((value*1).toFixed(2));}}
            } else {
                var field = { name: "diffPsgMntFgr"+i, title:"difference "+i+"차월도", css:"cell", type: "text", width: 40, align:"right", itemTemplate:function(value, item) {
                	return $.fn.isEmpty(value) ? "0.00" : ((value*1).toFixed(2));}}
            }
            fieldList.push(field);
        }
    } else {
        //전체 필드
        var allInfo = { 
                name: "total", title:"전체", css:"cell", type: "text",  width: 40, align:"right", sorter:"number"
                    , itemTemplate:function(value, item) {return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2);}
        };
        fieldList.push(allInfo);
    }
    console.log("fieldList?", fieldList);
    return fieldList;
}

function headerRenderer() {
    var $result = $("<tr>").height(0);
    for(var i=0; i<7; i++) {
        $result.append($("<th>").width(40))
    }
    if ($('input:checkbox[id="cbx_comprBe"]').is(":checked") == true) {
        for(var i=0; i<9; i++) {
            $result.append($("<th>").width(40))
        }
    }
    $result.append($("<th>").width(40));
    
    var selAplcBe = $("#sbx_aplcBe").val();
    if ($('input:checkbox[id="cbx_comprBe"]').is(":checked") != true) {
        $result = $result.add($("<tr class='jsgrid-header-row'>")
        		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("채널유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 6).text(selAplcBe))
        );
        var $result1 = $("<tr class='jsgrid-header-row'>")
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1차월도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("2차월도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("3차월도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("4차월도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("5+차월도"))
            .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("전체"));
    } else {
        var comBe = (selAplcBe.substr(0,4)-1)+"BE";
        $result = $result.add($("<tr class='jsgrid-header-row'>")
        		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("채널유형"))
        		.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("상품유형"))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text(selAplcBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text(comBe))
                .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text("difference"))
        );
        var $result1 = $("<tr class='jsgrid-header-row'>")
        for(var i=0; i<3; i++) {
            $result1.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("1차월도"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("2차월도"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("3차월도"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("4차월도"))
                    .append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("5+차월도"))
        }
        ;
    }
    
    $result = $result.add($result1);
    return $result;
}

function initGridDivBeforeRtf(){

    var fieldList = settingFields();
    var header = headerRenderer();
    
    var gridDivBeforeRtf = new ComJsGrid({
        id: "gridDivBeforeRtf",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        }); 
    
    //그리드 생성
    gridDivBeforeRtf.gridCreate();
}

function initGridDivAfterRtf(){

    var fieldList = settingFields();
    var header = headerRenderer();
    
    var gridDivAfterRtf = new ComJsGrid({
        id: "gridDivAfterRtf",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        }); 
    
    //그리드 생성
    gridDivAfterRtf.gridCreate();
}

function initGridDivRsltBe(){

    var fieldList = settingFields();
    var header = headerRenderer();
    
    var gridDivRsltBe = new ComJsGrid({
        id: "gridDivRsltBe",
        height: 200,
        editing: false,
        sorting: true,
        paging: false,
        headerRowRenderer: function() {
            return header;
        },
        fields : fieldList
        });
    
    //그리드 생성
    gridDivRsltBe.gridCreate();
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
    
    //직전년도BE체크
    if(gReqParam.comprBe != gCondJsBfrYear) {
        return false;
    }
    
    //원오프체크
    if(gReqParam.oneoffCheck != gCondOneoffCheck) {
        return false;
    }
    return true;
}

/**
* @설명: 갱신율 > 산출적용 조회시 데이터 얻어오기
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 23. 최초작성
*/
function selectCancRatProdAplcList(){

    var selAplcBe = $("#sbx_aplcBe").val();
    var comBe = (selAplcBe.substr(0,4)-1)+"BE";

    var rtfBfcOneOff = '01';
    var rtfAfcOneOff = '02';
    if ($('input:checkbox[id="cbx_oneOff"]').is(":checked") == true) {
        rtfBfcOneOff = '03';
        rtfAfcOneOff = '04';
    }

    // 조회에 필요한 값을 셋팅
    gReqParam = {
                "comprBe" : gCondJsBfrYear,
                "selAplcBe" : selAplcBe,
                "comBe" : comBe,
                "rtfBfcOneOff" : rtfBfcOneOff,
                "rtfAfcOneOff" : rtfAfcOneOff,
                "oneoffCheck" : gCondOneoffCheck
        };

        $.callAjax(gReqParam, "/be/pd/bepd252m/selectCancRatProdAplcList.do")
        .done(function(data) {
         // 초기화
            $("#gridDivBeforeRtf").jsGrid("reset");
            $("#gridDivBeforeRtf").jsGrid("option", "data", []);
            $("#gridDivAfterRtf").jsGrid("reset");
            $("#gridDivAfterRtf").jsGrid("option", "data", []);
            $("#gridDivRsltBe").jsGrid("reset");
            $("#gridDivRsltBe").jsGrid("option", "data", []);
            $("#gridDivBeforeRtf").jsGrid("destroy");
            $("#gridDivAfterRtf").jsGrid("destroy");
            $("#gridDivRsltBe").jsGrid("destroy");
            initGridDivBeforeRtf();
            initGridDivAfterRtf();
            initGridDivRsltBe();
            
            // 서버로 받아온 데이터 리스트
            var beforeRtfData = data.beforeRtf;
            var afterRtfData = data.afterRtf;
            var rsltBeData = data.rsltBe;
            
            // 0건 그리드 메세지 처리부분
            if(beforeRtfData==null || beforeRtfData.length==0){
                $.fn.getReturnValue("gridDivBeforeRtf");
            } else {
                $('#gridDivBeforeRtf').jsGrid('reset');
                initGridDivBeforeRtf();
                $('#gridDivBeforeRtf').jsGrid('loadData', beforeRtfData);
            }
            if(afterRtfData==null || afterRtfData.length==0){
                $.fn.getReturnValue("gridDivAfterRtf");
            } else {
                $('#gridDivAfterRtf').jsGrid('reset');
                initGridDivAfterRtf();
                $('#gridDivAfterRtf').jsGrid('loadData', afterRtfData);
            }
            if(rsltBeData==null || rsltBeData.length==0){
                $.fn.getReturnValue("gridDivRsltBe");
            } else {
                $('#gridDivRsltBe').jsGrid('reset');
                initGridDivRsltBe();
                $('#gridDivRsltBe').jsGrid('loadData', rsltBeData);
            }
            gCondFlag = "Y";
        }).fail(function(data){
            console.log("fail to selectTableSchemaInfo");
        }); 
}