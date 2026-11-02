/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 위험율
 * @설명: 위험율 > 기초데이터 화면의 JS
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 07. 23.
 * @최종변경일: 2023. 10. 10.
 * @개정이력: 
 *  박세라 2021. 07. 23. 최초작성
 *  서승호 2022. 05. 03. 공통코드 표기 로직 수정
 *  서승호 2023. 12. 14. 보정완료확인버튼 엑셀다운로드 옵션변경
 */
//전역변수
var gCondHichyCheck = [];
var gSrchYn = "N";
var gArrCols = [];
var gServiceCode = "01";
//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";
//one-off플래그
var gCondOneoffCheck = "N";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //MIN, MAX 년월세팅
    $.fn.getTbDateInfo(gServiceCode);
    
    //초기날짜세팅
    initSearchData();
    
    //event 초기화
    initEvent();
    
    //조회조건별 기초율 그리드 초기화 
    initGridPryRate();
    
    //조회조건별 분자항목 그리드 초기화 
    initGridNmrtItem();
    
    //조회조건별 분모항목 그리드 초기화 
    initGridDnmrItem();
});

function initEvent() {
    $.fn.loadCommonCode(["HIGH_RSK_RAT_PRDT_SC_CD","BENF_LCLSF_CD", "BE_RSK_PRM_CD", "BE_SXDS_CD"]);
    
	//*보정 배치 및 엑셀다운로드 관련 선언
	var gridTmpIdSub="gridTmpDivSub";
	var serviceNm="RSK_RAT";
    
    //시작년월 달력버튼 click
    $('#btn_strYm').on('click', function(e){
        $('#ibx_finYmFrom').datepicker('show');
    });
    
    //죵료년월 달력버튼 click
    $('#btn_finYm').on('click', function(e){
        $('#ibx_finYmTo').datepicker('show');
    });
    
    //one-off체크여부
    $("#chk_oneoff_check").on("change", function(e){
        if ($('input:checkbox[id="chk_oneoff_check"]').is(":checked") == true) {
            gCondOneoffCheck = "Y";
        } else {
            gCondOneoffCheck = "N";
        }
    }); 
    
    // 조회
    $('#btn_search').on('click', function(e){
        //조회년월 validation
        var condFinYmFrom = $("#ibx_finYmFrom").val();
        var condFinYmTo = $("#ibx_finYmTo").val();
        if(condFinYmFrom > condFinYmTo) {
            $.fn.msgBox("시작년월이 종료년월보다 클수 없습니다.");
            return;
        }
        
        //hierarchy validation
        if($('input:checkbox[name="hierarchy_check"]:checked').length == 0) {
            $.fn.msgBox("구분을 하나이상 체크해주세요.(One-off반영 제외)");
            return;
        } else {
            // 체크박스 (납입상태, 상품유형, 채널) 체크
            gCondHichyCheck = [];
            var titleText = "";
            $('input:checkbox[name="hierarchy_check"]:checked').each(function(e){
                var colId = $(this).val();
                gCondHichyCheck.push($.toUnderscore(colId));
                var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
                titleText = titleText + labelText + ", ";
            });
            titleText = titleText.substr(0,titleText.length-2)+" ";
            if(gCondOneoffCheck=="Y") titleText = titleText+", One-off 반영 "

            $("#title1").text(titleText + "기초율");
            $("#title2").text(titleText + "분자항목(순위험보험금)");
            $("#title3").text(titleText + "분모항목(On-level 위험보험료)");

            selectRskRatList();
        }
    });
    
    // 엑셀다운로드
    $('#btn_excel_download').on('click', function(e){

        if(gCondFlag == "N" || ($("#gridDivPryRate").jsGrid("option", "data").length == 0)) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        } else if(!checkCond()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        }

        var fileName = $("#title1").text().replace("기초율", "위험율") + "기초데이터.xlsx";
        $.fn.exportMultiGridExcel([
                {
                    id: 'gridDivPryRate',
                    sheetName : "기초율",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "%",
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: 'gridDivNmrtItem',
                    sheetName : "분자항목",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "원"
                },
                {
                    id: 'gridDivDnmrItem',
                    sheetName : "분모항목",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "원"
                },
                {
                    id: 'gridDivPryRate',
                    sheetName : "기초율(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "%"
                },
                {
                    id: 'gridDivNmrtItem',
                    sheetName : "분자항목(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "원"
                },
                {
                    id: 'gridDivDnmrItem',
                    sheetName : "분모항목(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "원"
                }
        ]);
    });
    
    //양식다운로드 클릭
    $("#btn_exportExcelForm").on("click", function(e){
        
        var arrColsInfo = $.fn.getTbCols("TB_IBEBDS01");
        
        console.log("양식");
        console.log(JSON.stringify(arrColsInfo));
        
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        $.fn.exportGridExcel({
            id: "gridTmpDiv", 
            fileName: $("#title1").text().replace("기초율", "위험율") + "_업로드양식.xlsx"
        });
        
    });
    
    //*보정 배치 및 엑셀다운로드 관련 선언
	$("#btn_loadBatch").on("click", function(e){
		var reqParam = {};
		var keyIndex = 0;
		var hierarchy = "";
		$("input:checkbox[name='hierarchy_check']").each(function(e){
			if ($(this).is(":checked") == true) {
				hierarchy += "Y";
			} else {
				hierarchy += "N";
			}
			keyIndex++;
		});
		for (var i=0; i <= 10; i++) {
			if (i > keyIndex) {
				hierarchy += "N";
			}
		}
        var oneOff = "0";
        if(gCondOneoffCheck == "Y") {
            oneOff = "1";
        }
        reqParam.oneOff = oneOff;
		reqParam.hierarchy = hierarchy;
		reqParam.batName=serviceNm;
	    reqParam.batStrYm = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
	    reqParam.batFinYm = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
				$.fn.msgBox('보정을 실행하시겠습니까?', function (obj) {
					if (obj.btn_ok) {
                        $.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
						.done(function(data) {
						    console.log("보정후Data??",data);
							if(data.result == '1') {
//								$.fn.msgBox('정상적으로 처리되었습니다.');
						        selectAplcData(gridTmpIdSub);
							}
						}).fail(function(data){
							$.fn.msgBox('보정 배치가 실패했습니다.');
						});
					}
				}, 2);
	});
    
    //*JOB MIND 보정 배치 처리확인 및 엑셀다운로드 관련 선언
    $("#btn_loadBatchChk").on("click", function(e){
        var reqParam = {};
        var keyIndex = 0;
        var hierarchy = "";
        $("input:checkbox[name='hierarchy_check']").each(function(e){
            if ($(this).is(":checked") == true) {
                hierarchy += "Y";
            } else {
                hierarchy += "N";
            }
            keyIndex++;
        });
        for (var i=0; i <= 10; i++) {
            if (i > keyIndex) {
                hierarchy += "N";
            }
        }
        var oneOff = "0";
        if(gCondOneoffCheck == "Y") {
            oneOff = "1";
        }
        reqParam.oneOff = oneOff;
        reqParam.hierarchy = hierarchy;
        reqParam.batName=serviceNm;
        reqParam.batStrYm = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
        reqParam.batFinYm = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');

        $.callAjax(reqParam, '/be/pd/commonBe/jobMindAplcBatchProc.do')
        .done(function(data) {
            if(data.chkStr == 'Y') {
                selectAplcData(gridTmpIdSub);
            } else {
            	$.fn.msgBox('보정 배치가 실행중입니다.');
            }
        }).fail(function(data){
            $.fn.msgBox('보정 배치가 실패했습니다.');
        });

    });
	
    //엑셀업로드 클릭
    $("#btn_loadExcel").on("click", function(e){
        if(gArrCols.length == 0) {
            $.fn.msgBox("양식다운로드를 한 후 엑셀업로드를 해주세요.");
            return;
        }
        
        var paramObj = {};
        
        paramObj.id = "gridTmpDiv";                 //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        data["colList"] = gArrCols;
                        data["tbNm"] = "TB_IBEBDS01";
                        data["menuId"] = $.fn.getMenuId();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveDtList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                                selectRskRatList();
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
    
    $("#excelFile").on("change", function(e){

        console.log("excelRead");
        
        var input = e.target;
        var reader = new FileReader();
        //var oTable = this.getView().byId("table");
        
        reader.onload = function(oFile) {
            var binary = "";
            var bytes = new Uint8Array(oFile.target.result);
            var length = bytes.byteLength;
            for(var i=0; i<length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }

            var wb = XLSX.read(binary, {type : "binary"});
            
            wb.SheetNames.forEach(function(sheetName){
                var rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
                console.log(JSON.stringify(rowObj));
            });

            
        };
        reader.readAsArrayBuffer(input.files[0]);
    });
    
    //조회조건 엔터키 조회
    $("#ibx_finYmFrom", "#ibx_finYmTo").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
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
		openPryRatGrpPopup();
	});
}

/**
 * @설명: 초기 조회일자 세팅
 * @최초작성자: 박세라
 * @최초작성일: 2021. 11. 17
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2021. 11. 17 최초작성
 */
function initSearchData() {
    reqParam = {
            "serviceCode" : gServiceCode
    }
    $.callAjax(reqParam, "/be/pd/commonBe/settingFirstDate.do")
    .done(function(data) {
        var tbDateInfo = data.tbDateInfo;
        $('#ibx_finYmFrom').val($.fn.monthFormat(tbDateInfo[0].finStrYm));
        $("#ibx_finYmTo").val($.fn.monthFormat(tbDateInfo[0].finEndYm));
    });
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
    
    //시작년월체크
    if(gReqParam.finYmFrom != $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','')) {
        return false;
    }
    //종료년월체크
    if(gReqParam.finYmTo != $.replaceAll($('#ibx_finYmTo').val().trim(), '-','')) {
        return false;
    }

    //하이라키체크
    var checkList = "";
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var check = $.toUnderscore($(this).val()).toUpperCase();
        checkList += ","+check;
    });
    checkList = checkList.substr(1);

    if(gReqParam.checkList != checkList) {
        return false;
    }
    
    //원오프체크
    if(gReqParam.oneoffCheck != gCondOneoffCheck) {
        return false;
    }
    return true;
}

/**
 * @설명: 최종년월 셋팅 - 년도:현재년 -1년/ 월:6월(고정)
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 최종년월 ex.2020-06
 * @개정이력: 
 *  이현수 2021. 7. 7 최초작성
 */
function setFinYmTo() {

    var nowDate = new Date();
    var year = nowDate.getFullYear() - 1;
    var month = nowDate.getMonth();

    var temp = new Date(year, month, "1");
    temp.setMonth(6);
    
    month = temp.getMonth().toString();
    month = month.length == 1 ? "0" + month : month;
    
    var finYm = $.fn.monthFormat(year + month, "-");
    
    return finYm;
}

/**
 * @설명: 시작년월 셋팅 - 년도:종료년월-5년
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 최종년월 ex.2015-07
 * @개정이력: 
 *  이현수 2021. 7. 7 최초작성
 */
function setFinYmFrom() {
    var nowDate = new Date();
    var year = nowDate.getFullYear() - 6;
    var month = nowDate.getMonth();
    
    var temp = new Date(year, month, "1");
    temp.setMonth(6);
    
    month = (temp.getMonth() +1).toString();
    month = month.length == 1 ? "0" + month : month;
    
    var strYm = $.fn.monthFormat(year + month, "-");
    
    return strYm;
}

function settingGrid(num) {
    var fieldList = [];
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var colId = $(this).val();
        var labelText = $("label[for='"+ $(this).attr("id") +"']").text();
        var codeId = $.toUnderscore(colId);
        var codeName = codeId.toUpperCase();
        if(colId=='highRskRatPrdtScCd') {
            var highRskRatPrdtScCd = { name: 'highRskRatPrdtScCd', title:'고위험율상품구분', css:"cell", type:"select", width: 120, align:"center",
                    itemTemplate:function(value, item){
                        //TOTAL 항목 표시
                        if(value==null || value=='') {
                            return 'TOTAL';
                        } else {
                        	var codeArr = $.fn.getGridCodeItem(codeName);
                            for(i=0; i<codeArr.length; i++) {
                                if(value == codeArr[i].code) {
                                    return codeArr[i].codeNm;
                                    break;
                                }
                            }
                        }
                    }
            }
            fieldList.push(highRskRatPrdtScCd);
        } else {
            var field = { name: colId, title:labelText, css:"cell", type:"select", width: 80, align:"center",
                    itemTemplate:function(value, item){ // 상품유형, 합계 동시 표시
                        if(colId=='benfLclsfCd') {
                            if(value==null || value=='') {
                                if($('input:checkbox[id="chk_hierachy_check1"]').is(":checked") == true && item.highRskRatPrdtScCd == null) {
                                    return "";
                                }
                                return "TOTAL";
                            } else {
                                var codeArr = $.fn.getGridCodeItem(codeName);
                                for(i=0; i<codeArr.length; i++) {
                                    if(value == codeArr[i].code) {
                                        return codeArr[i].codeNm;
                                        break;
                                    }
                                }
                            }
                        } else if(colId=='beRskPrmCd') {
                            if(value==null || value=='') {
                                if(($('input:checkbox[id="chk_hierachy_check1"]').is(":checked") == true && item.highRskRatPrdtScCd == null)
                                        || ($('input:checkbox[id="chk_hierachy_check2"]').is(":checked") == true && item.benfLclsfCd == null)) {
                                    return "";
                                }
                                return "TOTAL";
                            } else {
                                var codeArr = $.fn.getGridCodeItem(codeName);
                                for(i=0; i<codeArr.length; i++) {
                                    if(value == codeArr[i].code) {
                                        return codeArr[i].codeNm;
                                        break;
                                    }
                                }
                            }
                        } else if(colId=='beSxdsCd') {
	                        //TOTAL 항목 표시
                            if(value==null || value=='') {
                                if(($('input:checkbox[id="chk_hierachy_check1"]').is(":checked") == true && item.highRskRatPrdtScCd == null)
                                        || ($('input:checkbox[id="chk_hierachy_check2"]').is(":checked") == true && item.benfLclsfCd == null)
                                        || ($('input:checkbox[id="chk_hierachy_check3"]').is(":checked") == true && item.beRskPrmCd == null) ) {
                                    return "";
                                }
                                return "TOTAL";
                            } else {
                            	var beSxdsCdArr = $.fn.getGridCodeItem(codeName);
                                for(i=0; i<beSxdsCdArr.length; i++) {
                                    if(value == beSxdsCdArr[i].code) {
                                        return beSxdsCdArr[i].codeNm;
                                    }
                                }
                            }
                        }
                    }
            }
            fieldList.push(field);
        }
        
    });
    if(num==1) {
        for(var i=1; i<=12; i++) {
            if(i==12) {
                var field = { name: 'times'+i, title:i+"차년+", css:"cell", type: "text", align:"right", width: 130, sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
                fieldList.push(field);
            } else {
                var field = { name: 'times'+i, title:i+"차년", css:"cell", type: "text", align:"right", width: 130, sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
                fieldList.push(field);
            }
        }
        var field = { name: 'whole', title:'전체', css:"cell", type: "text", align:"right", width: 130, sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
        fieldList.push(field);
    } else {
        for(var i=1; i<=12; i++) {
            if(i==12) {
                var field = { name: 'times'+i, title:i+"차년+", css:"cell", type: "text", align:"right", width: 130, sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
                fieldList.push(field);
            } else {
                var field = { name: 'times'+i, title:i+"차년", css:"cell", type: "text", align:"right", width: 130, sorter:"number", itemTemplate:function(value, item) {
                    return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
                fieldList.push(field);
            }
        }
        var field = { name: 'whole', title:'전체', css:"cell", type: "text", align:"right", width: 130, sorter:"number", itemTemplate:function(value, item) {
            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        fieldList.push(field);
    }
 
    
    return fieldList;
}

function initGridPryRate(){
    
    var fieldList = settingGrid(1);
    
    var gridObjectPryRate = new ComJsGrid({
        id: "gridDivPryRate",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        
        fields : fieldList
        }); 
    
    //그리드 생성
    gridObjectPryRate.gridCreate();
}

function initGridNmrtItem(){

    var fieldList = settingGrid(2);
    
    var gridObjectNmrtItem = new ComJsGrid({
        id: "gridDivNmrtItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        
        fields : fieldList
        }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
}

function initGridDnmrItem(){

    var fieldList = settingGrid(3);
    
    var gridObjectNmrtItem = new ComJsGrid({
        id: "gridDivDnmrItem",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        
        fields : fieldList
    }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
}



function selectRskRatList(){
    // 기간받아오기
    var strYm = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
    var finYm = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
    var checkList = "";
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        var check = $.toUnderscore($(this).val()).toUpperCase();
        checkList += ","+check;
    });
    checkList = checkList.substr(1);

    // 조회에 필요한 값을 셋팅
    gReqParam = {
                "finYmFrom": strYm,
                "finYmTo": finYm,
                "checkList" : checkList,
                "oneoffCheck" : gCondOneoffCheck
        }
        $.callAjax(gReqParam, "/be/pd/bepd121m/selectRskRatList.do")
        .done(function(data) {
            // 초기화
            $("#gridDivPryRate").jsGrid("reset");
            $("#gridDivPryRate").jsGrid("option", "data", []);
            $("#gridDivNmrtItem").jsGrid("reset");
            $("#gridDivNmrtItem").jsGrid("option", "data", []);
            $("#gridDivDnmrItem").jsGrid("reset");
            $("#gridDivDnmrItem").jsGrid("option", "data", []);
            $("#gridDivPryRate").jsGrid("destroy");
            $("#gridDivNmrtItem").jsGrid("destroy");
            $("#gridDivDnmrItem").jsGrid("destroy");
            initGridPryRate();
            initGridNmrtItem();
            initGridDnmrItem();
            
            // 서버로 받아온 데이터 리스트
            var ratListData = data.ratList;
            var nmrtListData = data.nmrtList;
            var dnmrListData = data.dnmrList;

            // 0건 그리드 메세지 처리부분
            if(ratListData == null || ratListData.length == 0){
                $.fn.getReturnValue("gridDivPryRate");
            } else {
                $('#gridDivPryRate').jsGrid('loadData', ratListData);
            }
            if(nmrtListData == null || nmrtListData.length == 0){
                $.fn.getReturnValue("gridDivNmrtItem");
            } else {
                $('#gridDivNmrtItem').jsGrid('loadData', nmrtListData);
            }
            if(dnmrListData == null || dnmrListData.length == 0){
                $.fn.getReturnValue("gridDivDnmrItem");
            } else {
                $('#gridDivDnmrItem').jsGrid('loadData', dnmrListData);
            }
            gCondFlag = "Y";
        }).fail(function(data){
            console.log("fail to selectTableSchemaInfo");
        }); 
}

/**
 * @설명: 위험율 - 보정데이터 jsGrid 빈 테이블 생성 (*보정 히든 그리드용)
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 7. 7.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  임국빈 2021. 7. 7. 최초작성
 */
function initGridTmpSubItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFieldsSub();
    var gridObjectTmpSubItem = new ComJsGrid({
        id: "gridTmpDivSub",
        height: 0,
        editing: false,
        sorting: true,
        paging: true,	//변경(false -> true) - 20231214
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectTmpSubItem.gridCreate();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:감액율 보정 연도별 비중
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  임국빈 2021. 7. 8 최초작성
 */
function getGridFieldsSub() {
    //그리드 공통부분 필드
	var resultArr = [];
	
	//코드 목록
	
	if ($("#chk_hierachy_check1").is(":checked") == true) {
		resultArr.push(
		        { name: "highRskRatPrdtScCd", title:"고위험율상품구분", css:"cell", type: "select", width: 100, align:"center"
		            , items: $.fn.getGridCodeItem("HIGH_RSK_RAT_PRDT_SC_CD"), textField: "code", valueField: "code",
		            itemTemplate:function(value, item) {
		                var codeArr = $.fn.getGridCodeItem("HIGH_RSK_RAT_PRDT_SC_CD");
	                    for(i=0; i<codeArr.length; i++) {
	                        if(value == codeArr[i].code) {
	                            return codeArr[i].codeNm;
	                        }
	                    }
	                    return value;
		            }
		        }
		);
	}
	if ($("#chk_hierachy_check2").is(":checked") == true) {
		resultArr.push(
			        { name: "benfLclsfCd", title:"급부대분류", css:"cell", type: "select", width: 100, align:"center"
			            , items: $.fn.getGridCodeItem("BENF_LCLSF_CD"), textField: "code", valueField: "code",
			            itemTemplate:function(value, item) {
			                if ($('input:checkbox[id="chk_hierachy_check1"]').is(":checked") == true) {
			                	if(item.highRskRatPrdtScCd == "ZZ") {
			                		return "";
			                	}
			                }
			                var codeArr = $.fn.getGridCodeItem("BENF_LCLSF_CD");
		                    for(i=0; i<codeArr.length; i++) {
		                        if(value == codeArr[i].code) {
		                            return codeArr[i].codeNm;
		                        }
		                    }
			            }
			        }
		);
	}
	if ($("#chk_hierachy_check3").is(":checked") == true) {
       resultArr.push(
                { name: "beRskPrmCd", title:"급부중분류", css:"cell", type: "select", width: 100, align:"center"
		            , items: $.fn.getGridCodeItem("BE_RSK_PRM_CD"), textField: "code", valueField: "code",
		            itemTemplate:function(value, item) {
		                if ($('input:checkbox[id="chk_hierachy_check2"]').is(":checked") == true) {
		                    if(item.benfLclsfCd == "ZZZ") {
		                    	return "";
		                    }
		                } else if ($('input:checkbox[id="chk_hierachy_check1"]').is(":checked") == true) {
		                    if(item.highRskRatPrdtScCd == "ZZ") {
		                    	return "";
		                    }
		                }
		                var codeArr = $.fn.getGridCodeItem("BE_RSK_PRM_CD");
	                    for(i=0; i<codeArr.length; i++) {
	                        if(value == codeArr[i].code) {
	                            return codeArr[i].codeNm;
	                        }
	                    }
		            }
                }
       );
	}
	if ($("#chk_hierachy_check4").is(":checked") == true) {
       resultArr.push(
                { name: "beSxdsCd", title:"성별", css:"cell", type: "select", width: 100, align:"center"
                	, items: $.fn.getGridCodeItem("BE_SXDS_CD"), textField: "code", valueField: "code",
		            itemTemplate:function(value, item) {
		                //TOTAL 항목 표시 및 NULL처리
		                if ($('input:checkbox[id="chk_hierachy_check3"]').is(":checked") == true) {
		                    if(item.beRskPrmCd == "ZZZZZZ") {
		                    	return "";
		                    }
		                } else if ($('input:checkbox[id="chk_hierachy_check3"]').is(":checked") == false
		                		&& $('input:checkbox[id="chk_hierachy_check2"]').is(":checked") == true) {
		                    if(item.benfLclsfCd == "ZZZ") {
		                    	return "";
		                    }
		                } else if ($('input:checkbox[id="chk_hierachy_check2"]').is(":checked") == false
		                		&& $('input:checkbox[id="chk_hierachy_check1"]').is(":checked") == true) {
		                    if(item.highRskRatPrdtScCd == "ZZ") {
		                    	return "";
		                    } 
		                }
		                var codeArr = $.fn.getGridCodeItem("BE_SXDS_CD");
	                    for(i=0; i<codeArr.length; i++) {
	                        if(value == codeArr[i].code) {
	                            return codeArr[i].codeNm;
	                        }
	                    }
		            }
                }
       );
	}
    
    var colNm = "psgYys";
    var targetArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12"];
    var titleArr = ["1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12+"];
    var fieldsArr = getPsgNtsFieldsArrSub(targetArr, titleArr, colNm);
    resultArr = resultArr.concat(fieldsArr);
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 7. 8
 * @최종변경일: 
 * @매개변수: targetArr<array> : 경과월 배열 
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  임국빈 2021. 7. 8 최초작성
 */
function getPsgNtsFieldsArrSub(targetArr, titleArr, colNm) {
    if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titleArr)) {
        return [];
    }
    
    var resultArr = [];
    
    for (var i = 0; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: colNm + target , title: titleArr[i] + "차년도", css:"cell", type: "text", width: 80, align:"right", sorter:"number", 
                itemTemplate:function(value, item) {
                	return $.fn.isEmpty(value) ? "0" : value;
                }
        };
   
        resultArr.push(distStndValField);
    }
    var field = { name: 'total', title:'전체', css:"cell", type: "text", align:"right", width: 130, sorter:"number", itemTemplate:function(value, item) {
        return $.fn.isEmpty(value) ? "0.00" : (value*1).toFixed(2)}}
    resultArr.push(field);
    return resultArr;
}

/**
 * @설명: 보정데이터 엑셀 출력용 hidden gridTable 조회 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 7. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 7. 7 최초작성
 */
function selectAplcData(gridTmpIdSub){
    // 조회에 필요한 값을 셋팅
    var reqParam = {};
    var strColumArr = [];
    
    // 체크박스 (채널, 상품유형) 체크
    $("input:checkbox[name='hierarchy_check']:checked").each(function(e){
        strColumArr.push($(this).val());
    });
    
    reqParam.strColumArr = strColumArr;
	$.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/bepd121m/selectRskRatProdAplc.do",{async:false})
	.done(function(data) {
		 // 그리드 초기화
//		 resetGrid("aplc");
//	     reDrawGrid("aplc");
	     $("#gridTmpDivSub").jsGrid("reset");
	     $("#gridTmpDivSub").jsGrid("option", "data", []);
	     $("#gridTmpDivSub").jsGrid("destroy");
	   	 initGridTmpSubItem();
	     
	     hiddenGridList = data.hiddenGridList;
//		console.log("hiddenGridList:"+JSON.stringify(hiddenGridList));
		$("#"+gridTmpIdSub).jsGrid("loadData", hiddenGridList).done(function(){
//			if(tbDtList.length == 0){
//				$.fn.getReturnValue(gridId);
//			}
			let fileName = $(document).find("title").text() + "_보정"
	        + ".xlsx";
	        //보정임시 테이블에서 엑셀다운
			$.fn.exportMultiGridExcel([{
				
				id: gridTmpIdSub, 
				fileName: fileName
			}]);
		});
	}).fail(function(data) {
		console.log("fail to fn.getTbDtSub!!!!");
	});
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
function openPryRatGrpPopup() {
	popupOption = {
			url: "/be/pd/bepd121p.do",
			name: "그래프 팝업",
			width: 1050,
			height: 850,
			arrCheck: gCondHichyCheck,
			gridData1: $("#" + "gridDivPryRate").jsGrid("option", "data"),
			gridField1: $("#" + "gridDivPryRate").jsGrid("option", "fields"),
			gridData2: $("#" + "gridDivNmrtItem").jsGrid("option", "data"),
			gridField2: $("#" + "gridDivNmrtItem").jsGrid("option", "fields"),
			gridData3: $("#" + "gridDivDnmrItem").jsGrid("option", "data"),
			gridField3: $("#" + "gridDivDnmrItem").jsGrid("option", "fields"),
			
		}

		$.fn.openPopup(popupOption);
}

function openPryRatGrpPopup_callback() {

	
}