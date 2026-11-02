/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 동적해지율
 * @설명: 동적해지율 > 기초데이터 화면의 JS
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 08. 13.
 * @최종변경일: 2023. 10. 10.
 * @개정이력: 
 *  박세라 2021. 08. 13. 최초작성
 *  김민우 2021. 12. 10 수정사항 반영
 *  서승호 2023. 12. 14. 보정완료확인버튼 엑셀다운로드 옵션변경
 */
//전역변수
var gCondHichyCheck = [];
var gArrCols = [];
//서비스코드 정의
var serviceCode = "08";
//조회조건obj
var gReqParam = {};
//조회falg
var gCondFlag = "N";
//one-off플래그
var gCondOneoffCheck = "N";

var condAplcBe;
var gSetExcel = "N";

//상품유형선택
var gSmupStnd = "";

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //datepickerSetting세팅
    $.fn.getTbDateInfo(serviceCode);
    
    // 초기 날짜 세팅
    initSearchData();
    
    //event 초기화
    initEvent();
    
    //그리드 초기화   
    $.fn.loadCommonCode(["BE_NEW_LOB_CD", "SPD_ITV_CD", "BE_RATE_INLCT_PRM_PROD_SC_CD"]);
    
    initGridRate();
    initGridNmrtItem();
    initGridDnmrItem();
});

function initEvent() {
    //*보정 배치 및 엑셀다운로드 관련 선언
    var serviceNm = "DYNC_RSC_RAT";
    
    //시작년월 달력버튼 click
    $("#btn_finYmFrom").on("click", function(e){
        $('#ibx_finYmFrom').datepicker("show");
    });
    
    //죵료년월 달력버튼 click
    $("#btn_finYmTo").on("click", function(e){
        $("#ibx_finYmTo").datepicker("show");
    });
    
    //one-off체크여부
    $("#cbx_oneoff").on("change", function(e){
        if ($('input:checkbox[id="cbx_oneoff"]').is(":checked") == true) {
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
        var selVal = $("#sbx_typSc option:selected").val();
        
        if(condFinYmFrom > condFinYmTo) {
            $.fn.msgBox("시작년월이 종료년월보다 클수 없습니다.");
            return;
        }
        
        if (selVal == ''){
            $.fn.msgBox("상품유형을 선택해 주세요.");
            return;
        }
        
        condCheck = {};
        var titleText = $("#sbx_typSc option:selected").text();
        
        if(gCondOneoffCheck=="Y") {
            $("#titTop").text(titleText + " 경과차년별 해지율 (One-off 반영)");
            $("#titNumAnp").text(titleText + " 분자ANP (One-off 반영)");
            $("#titDenAnp").text(titleText + " 분모ANP (One-off 반영)");
        } else {
            $("#titTop").text(titleText + " 경과차년별 해지율");
            $("#titNumAnp").text(titleText + " 분자ANP");
            $("#titDenAnp").text(titleText + " 분모ANP");
        }
        
        selectDyncRscRatPryDtList();
    });
    
    // 엑셀다운로드
    $('#btn_excel_download').on('click', function(e){
        //데이터 체크
        var dataList = $("#grdDivTop").jsGrid("option", "data");
        if(dataList.length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        if(gCondFlag == "N") {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        
        var inqrSection = $.replaceAll($("#sbx_typSc option:selected").text(), '상품유형별 ', '', ' 금리연동구분형', '');
        var fileName =  $("#titNumAnp").text().replaceAll("분자ANP", "동적해지율") + "기초데이터.xlsx";
        $.fn.exportMultiGridExcel([
                {
                    id: 'grdDivTop',
                    sheetName : "경과차년별 해지율",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "%",
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: 'grdNumAnp',
                    sheetName : "분자ANP",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "원"
                },
                {
                    id: 'grdDenAnp',
                    sheetName : "분모ANP",
                    fileName: fileName,
                    applyItemTemplate : true,
                    unit: "원"
                },
                {
                    id: 'grdDivTop',
                    sheetName : "경과차년별 해지율(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "%",
                    searchCond: $.fn.getSearchCond(gReqParam)
                },
                {
                    id: 'grdNumAnp',
                    sheetName : "분자ANP(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "원"
                },
                {
                    id: 'grdDenAnp',
                    sheetName : "분모ANP(코드)",
                    fileName: fileName,
                    applyItemTemplate : false,
                    unit: "원"
                },
        ]);
    });
    
    //*보정 배치 및 엑셀다운로드 관련 선언
    $("#btn_loadBatch").on("click", function(e){
        var selVal = $("#sbx_typSc option:selected").val();
        
        if (selVal == ''){
            $.fn.msgBox("상품유형을 선택해 주세요.");
            return;
        }
        
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
                    if(data.result == '1') {
//                              $.fn.msgBox('정상적으로 처리되었습니다.');
                        selectAplcData();
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
    
    //조회조건 엔터키 조회
    $("#ibx_finYmFrom", "#ibx_finYmTo").on("keypress", function(e) {
        if(e.keyCode == 13) {
            $("#btn_search").click();
            return false;
        }
    });
    
    // selectbox 변환 처리
    $("#sbx_typSc").on("change", function(){    
        $('#grdDivTop').jsGrid('destroy');
        $('#grdNumAnp').jsGrid('destroy');
        $('#grdDenAnp').jsGrid('destroy');
        
        $('#gridTmpDivSub').jsGrid('destroy');
        $('#gridTmpDivSubDtl').jsGrid('destroy');
        
        initGridRate();
        initGridNmrtItem();
        initGridDnmrItem();
        
        initGridTmpSubItem();
        initGridTmpSubItem2();
        
        gSmupStnd = $("#sbx_typSc option:selected").val();
    });
    
    //양식다운로드 클릭
    $("#btn_exportExcelForm").on("click", function(e){
        var fieldList = [];
        var col1 = { name: "finYm" , title:"마감년월" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col11 = { name: "oneoffEfc" , title:"One-off반영" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col2 = { name: "rscRatItmScCd" , title:"해지율항목구분코드" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col3 = { name: "newLobCd" , title:"신규LOB코드" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col4 = { name: "rateInlctPrmProdScCd" , title:"금리연동구분" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col5 = { name: "prsvAplcIrt" , title:"부리이율" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col6 = { name: "psgYys" , title:"경과년" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col7 = { name: "psgMntFgr" , title:"경과월" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col8 = { name: "occuCnt" , title:"발생건수" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col9 = { name: "anpKrwAmt" , title:"ANP" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        var col10 = { name: "srndmPrmAcumKrwAmt" , title:"해약식보험료적립금" , css:"cell", type: "select", width: 100, editing: false, align:"center"};
        
        fieldList.push(col1, col11, col2, col3, col4, col5, col6, col7, col8, col9, col10);
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
            fileName: "동적해지율_기초데이터_업로드양식.xlsx"
        });
        
        gSetExcel = "Y";
        
    });
    
    //엑셀업로드 클릭
    $("#btn_loadExcel").on("click", function(e){
        
        if(gSetExcel != "Y") {
            $.fn.msgBox("양식다운로드를 한 후 엑셀업로드를 해주세요.");
            return;
        }
        
        var paramObj = {};
        
        paramObj.id = "gridTmpDiv";                 //그리드 ID
        
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd271m/registDyncRscRatExcel.do')
                        .done(function(data) {
                        	if(data.result == 'success') {
								$.fn.msgBox('정상적으로 처리되었습니다.');
								selectDyncRscRatPryDtList();
							} else if (data.result == "NO_DATA"){
								$.fn.msgBox('등록할 내용이 없습니다.');
							} else if (data.result == "xls_error"){
								$.fn.msgBox('양식에 입력된 값을 확인해 주십시오.');
							} else if (data.result == "oneoff_error"){
								$.fn.msgBox('One-off 입력값은 01만 가능합니다.');
							} else {
								$.fn.msgBox('Excel Upload 중 에러가 발생하였습니다.\n관리자에 문의하세요.');
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
    
}

/**
* @설명: 동적해지율 - 경과차년별 해지율 jsGrid 빈 테이블 생성 
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 10.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 2021. 12. 10. 최초작성
*/
function initGridRate(){
    //그리드 필드 세팅
    var param = "grdDivTop";
    var fieldsArr = getGridFields(param);
    // jsGrid 빈 테이블 생성
    var gridObjectPryRate = new ComJsGrid({
        id: "grdDivTop",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    //그리드 생성
    gridObjectPryRate.gridCreate();
}

/**
* @설명: 동적해지율 - 분자ANP jsGrid 빈 테이블 생성 
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 10.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 2021. 12. 10. 최초작성
*/
function initGridNmrtItem(){
    //그리드 필드 세팅
    var param = "grdNumAnp";
    var fieldsArr = getGridFields(param);
    
    var gridObjectNmrtItem = new ComJsGrid({
        id: "grdNumAnp",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
        }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
}

/**
* @설명: 동적해지율 - 분모ANP 해지율 jsGrid 빈 테이블 생성 
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 10.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  김민우 2021. 12. 10. 최초작성
*/
function initGridDnmrItem(){
    //그리드 필드 세팅
    var param = "grdDenAnp";
    var fieldsArr = getGridFields(param);
    
    var gridObjectNmrtItem = new ComJsGrid({
        id: "grdDenAnp",
        height: 200,
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectNmrtItem.gridCreate();
}

function settingGridBottom() {
    // 콤보박스값 확인
    var inqrSection_num = $("#sbx_typSc option:selected").val();
    
    var bottomFieldList = [];
    
        var peprVal = { name: "peprVal", title:"대표값", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        var vi = { name: "vi", title:"vi", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        var yi = { name: "yi", title:"Yi^", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        var viMinus = { name: "viMinus", title:"(vi-vi^)^2", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        var meanVi = { name: "meanVi", title:"Mean(vi)", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}
        var meanViMinus = { name: "meanViMinus", title:"(vi^-mean(vi))^2", css:"cell", type: "text", width: 40, align:"right", sorter:"number", itemTemplate:function(value, item) {
                            return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())}}

        if(inqrSection_num==3) {
            bottomFieldList.push(peprVal);
            bottomFieldList.push(vi);
            bottomFieldList.push(yi);
            bottomFieldList.push(viMinus);
            bottomFieldList.push(meanVi);
            bottomFieldList.push(meanViMinus);
            
            return bottomFieldList;
        } else {
            return false;
        }
}

/**
* @설명: 동적해지율 > 기초데이터 데이터 얻어오기
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 13.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 13. 최초작성
*/
function selectDyncRscRatPryDtList(){
    //조회 조건 값
    gReqParam.lobScCdVal = $("#sbx_typSc option:selected").val();
    gReqParam.finYmFrom = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
    gReqParam.finYmTo = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
    var oneOff = "00";
    if(gCondOneoffCheck == "Y") {
        oneOff = "01";
    }
    gReqParam.oneoffChk = oneOff;
    
    //데이터 조회
    $.callAjax({"jsonStr":JSON.stringify(gReqParam)}, "/be/pd/bepd271m/selectDyncRscRatList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        reDrawGrid();
        // 그리드 바인딩
        var rateListData = data.rateList;
        var nmrtListData = data.nmrtList;
        var dnmrListData = data.dnmrList;
        
        $("#grdDivTop").jsGrid("loadData", rateListData).done(function(){});
        $("#grdNumAnp").jsGrid("loadData", nmrtListData).done(function(){});
        $("#grdDenAnp").jsGrid("loadData", dnmrListData).done(function(){});
        
        // 0건 그리드 메세지 처리부분
        if(rateListData.length == 0) {
            $.fn.getReturnValue("grdDivTop");
        }
        if(nmrtListData.length == 0) {
            $.fn.getReturnValue("grdNumAnp");
        }
        if(dnmrListData.length == 0) {
            $.fn.getReturnValue("grdDenAnp");
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
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
            "serviceCode" : serviceCode
    }
    $.callAjax(reqParam, "/be/pd/commonBe/settingFirstDate.do")
    .done(function(data) {
        var tbDateInfo = data.tbDateInfo;
        $('#ibx_finYmFrom').val($.fn.monthFormat(tbDateInfo[0].finStrYm));
        $("#ibx_finYmTo").val($.fn.monthFormat(tbDateInfo[0].finEndYm));
    });
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 19.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 19.최초작성
 */
function resetGrid() {
    //보정grid용 초기화세팅 (*보정 히든 그리드용)
    $("#grdDivTop").jsGrid("reset");
    $("#grdDivTop").jsGrid("option", "data", []);
    $("#grdNumAnp").jsGrid("reset");
    $("#grdNumAnp").jsGrid("option", "data", []);
    $("#grdDenAnp").jsGrid("reset");
    $("#grdDenAnp").jsGrid("option", "data", []);
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 이현수
 * @최초작성일: 2021. 7. 19.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 7. 19.최초작성
 */
function reDrawGrid(type) {
    //보정grid용 초기화세팅 (*보정 히든 그리드용)
    if (type == "aplc") {
        $("#gridTmpDivSub").jsGrid("destroy");
        $("#gridTmpDivSubDtl").jsGrid("destroy");
        initGridTmpSubItem();
        initGridTmpSubItem2();
    } else {
        //그리드 destroy
        $("#grdDivTop").jsGrid("destroy");
        $("#grdNumAnp").jsGrid("destroy");
        $("#grdDenAnp").jsGrid("destroy");
       
        //그리드 create
        initGridRate();
        initGridNmrtItem();
        initGridDnmrItem();
   }
}

/**
 * @설명: 동적해지율 기초데이터 - 보정데이터 jsGrid 빈 테이블 생성 (*보정 히든 그리드용) 상품/금리 구분별
 * @최초작성자: 김민우
 * @최초작성일: 2021. 12. 10.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  김민우 2021. 12. 10.최초작성
 */
function initGridTmpSubItem(){
    //그리드 필드 세팅
    var fieldsArr = getGridFieldsSub(1);
    var gridObjectTmpSubItem = new ComJsGrid({
        id: "gridTmpDivSub",
        height: 0,
        editing: false,
        sorting: true,
        paging: true,	//변경(false -> true) -  20231010
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectTmpSubItem.gridCreate();
}

/**
 * @설명: 동적해지율 기초데이터 - 보정데이터 jsGrid 빈 테이블 생성 (*보정 히든 그리드용) 상품/금리 표시목록
 * @최초작성자: 김민우
 * @최초작성일: 2021. 12. 10.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  김민우 2021. 12. 10.최초작성
 */
function initGridTmpSubItem2(){
    //그리드 필드 세팅
    var fieldsArr = getGridFieldsSub(2);
    var gridObjectTmpSubItem2 = new ComJsGrid({
        id: "gridTmpDivSubDtl",
        height: 0,
        editing: false,
        sorting: true,
        paging: false,
        fields : fieldsArr
    }); 
    
    //그리드 생성
    gridObjectTmpSubItem2.gridCreate();
}
/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 김민우
 * @최초작성일: 2021. 12. 10.
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김민우 2021. 12. 10.최초작성
 */
function getGridFields(param) {
    //그리드 공통부분 필드
    var resultArr = [];
    
    //코드 목록
    var newLobCdArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
    var spdItvCdArr = $.fn.getGridCodeItem("SPD_ITV_CD");
    var beRateInlctPrmProdScCdArr = $.fn.getGridCodeItem("BE_RATE_INLCT_PRM_PROD_SC_CD");
    
    //상풍유형 필드
    var newLobCd = { 
            name: "beNewLobCd" , title:"상품유형" , css:"cell", type: "select", width: 150, editing: false, align:"center",
            itemTemplate:function(value, item) {
                for(i=0; i<newLobCdArr.length; i++) {
                    if(value == newLobCdArr[i].code) {
                        return newLobCdArr[i].codeAbbrNm;
                    }
                }
            }
    };
    
    var beRateInlctPrmProdScCd = { 
            name: "beRateInlctPrmProdScCd" , title:"금리구분" , css:"cell", type: "select", width: 150, editing: false, align:"center",
            itemTemplate:function(value, item) {
                for(i=0; i<beRateInlctPrmProdScCdArr.length; i++) {
                    if(value == beRateInlctPrmProdScCdArr[i].code) {
                        return beRateInlctPrmProdScCdArr[i].codeAbbrNm;
                    }
                }
            }
    };
    
    var sprdPg = { 
            name: "spdItvCd" , title:"스프레드구간" , css:"cell", type: "select", width: 180, editing: false, align:"center",
            itemTemplate:function(value, item) {
                for(i=0; i<spdItvCdArr.length; i++) {
                    if(value == spdItvCdArr[i].code) {
                        return spdItvCdArr[i].codeAbbrNm;
                    }
                }
            }
    };
    
    var allRto = { 
            name: "bePrm99", title:"전체", css:"cell", type: "text",  width: 200, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                if (param == "grdDivTop"){
                    return $.fn.isEmpty(value) ? value : (value*1).toFixed(2);
                } else {
                    return $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                }    
            }
    };
    
    var selVal = $("#sbx_typSc option:selected").val();
    
    if (selVal == "02"){
        resultArr.push(beRateInlctPrmProdScCd, sprdPg);
    } else {
        resultArr.push(newLobCd, sprdPg);
    }
    
    var targetArr = ["", "01", "02", "03", "04", "05", "06", "07","08", "09", "10", "11", "12", ];
    var titleArr = ["", "1", "2", "3", "4", "5", "6", "7","8", "9", "10", "11", "12+"];
    var fieldsArr = getFieldsArr(targetArr, titleArr, param);
    
    //합계세팅
    resultArr = resultArr.concat(fieldsArr);
    
    resultArr.push(allRto);
    
    return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴
 * @최초작성자: 김민우
 * @최초작성일: 2021. 12. 10.
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형배열 / titleArr<array> : 타이틀배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김민우 2021. 12. 10.최초작성
 */
function getFieldsArr(targetArr, titleArr, param) {
    if($.fn.isEmpty(targetArr) || $.fn.isEmpty(titleArr)) {
        return [];
    }
    
    var resultArr = [];
    for (var i = 1; i < targetArr.length; i++) {
        var target = targetArr[i];
        var distStndValField = { name: "bePrm" + target , title: titleArr[i] + "차년", css:"cell", type: "text", width: 180, align:"right", sorter:"number"
            , itemTemplate:function(value, item) {
                if (param == "grdDivTop"){
                    return $.fn.isEmpty(value) ? value : (value*1).toFixed(2);
                } else {
                    return $.fn.isEmpty(value) ? value : $.addCommaNumber(value.toString());
                }
            }
        };
        
        resultArr.push(distStndValField);
    }

    return resultArr;
}


/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 김민우
 * @최초작성일: 2021. 12. 10
 * @최종변경일: 
 * @매개변수: type<string> : 조회구분
 * 1:갱신율 보정 연도별 비중
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김민우 2021. 12. 10 최초작성
 */
function getGridFieldsSub(gbnVal) {
    
    var resultArr = [];
    
    //$._commonObj["code"]["BE_RATE_INLCT_PRM_PROD_SC_CD"].push({"codeId":"BE_RATE_INLCT_PRM_PROD_SC_CD","code":"ZZ","codeAbbrNm":"TOTAL","codeNm":"TOTAL","codeLvl":1,"codeSeq":1});
    //코드 목록
    var newLobCdArr = $.fn.getGridCodeItem("BE_NEW_LOB_CD");
    var spdItvCdArr = $.fn.getGridCodeItem("SPD_ITV_CD");
    var beRateInlctPrmProdScCdArr = $.fn.getGridCodeItem("BE_RATE_INLCT_PRM_PROD_SC_CD");
    
    var beRateInlctPrmProdScCd = { name: "beRateInlctPrmProdScCd" , title:"BE금리연동형보험료산출구분코드" , css:"cell", type: "select", width: 100, editing: false, align:"center",
            itemTemplate:function(value, item) {
                for(i=0; i<beRateInlctPrmProdScCdArr.length; i++) {
                    if(value == beRateInlctPrmProdScCdArr[i].code) {
                        return beRateInlctPrmProdScCdArr[i].codeAbbrNm;
                    }
                }
            }
    }
    
    //상풍유형 필드
    var newLobCd = { name: "beNewLobCd" , title:"상품유형" , css:"cell", type: "select", width: 100, editing: false, align:"center",
            itemTemplate:function(value, item) {
                for(i=0; i<newLobCdArr.length; i++) {
                    if(value == newLobCdArr[i].code) {
                        return newLobCdArr[i].codeAbbrNm;
                    }
                }
            }
    }
    
    var spdItvCd =  { name: "spdItvCd", title:"스프레드구간", css:"cell", type: "select", width: 180, editing: false, align:"center",
            itemTemplate:function(value, item) {
                for(i=0; i<spdItvCdArr.length; i++) {
                    if(value == spdItvCdArr[i].code) {
                        return spdItvCdArr[i].codeAbbrNm;
                    }
                }
            }
    }
    
    var rateItvReprRat = { 
            name: "rateItvReprRat" , title:"금리구간대표율" , css:"cell", type: "text", width: 180, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? value : (value*1).toFixed(10);
            }
    };
    
    var assAplcRto = { 
            name: "assAplcRto", title:"가정적용비율_충분성비중", css:"cell", type: "text",  width: 200, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? value : (value*1).toFixed(10);
            }
    };
    
    var aplcYn = { 
            name: "aplcYn", title:"적용여부_충분성통과여부", css:"cell", type: "text",  width: 100, align:"center", sorter:"number",
            itemTemplate:function(value, item) {
                return value;
            }
    };
    
    var spdAplcYn = { 
            name: "spdAplcYn", title:"스프레드적용여부", css:"cell", type: "text",  width: 100, align:"center", sorter:"number",
            itemTemplate:function(value, item) {
                return value;
            }
    };
    
    var pryMultpAvrVal = { 
            name: "pryMultpAvrVal", title:"기초승수평균값", css:"cell", type: "text",  width: 200, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? value : (value*1).toFixed(10);
            }
    };
    
    var occuCnt03 = { 
            name: "occuCnt03", title:"유효기초승수건수", css:"cell", type: "text",  width: 200, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return value;
            }
    };
    
    var cecnt = { 
            name: "cecnt", title:"상관계수", css:"cell", type: "text",  width: 200, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? value : (value*1).toFixed(10);
            }
    };
    
    var arctSuitaYn = { 
            name: "arctSuitaYn", title:"아크탄젠트적합성여부", css:"cell", type: "text",  width: 200, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? value : (value*1).toFixed(10);
            }
    };
    
    var itmSeq = { 
            name: "itmSeq", title:"항목순서", css:"cell", type: "text",  width: 200, align:"center", sorter:"number",
            itemTemplate:function(value, item) {
                return value;
            }
    };
    
    var pryMultpDifVal = { 
            name: "pryMultpDifVal", title:"기초승수차이값", css:"cell", type: "text",  width: 200, align:"right", sorter:"number",
            itemTemplate:function(value, item) {
                return $.fn.isEmpty(value) ? value : (value*1).toFixed(10);
            }
    };
    
    var selVal = $("#sbx_typSc option:selected").val();
    
    if (selVal == "02"){
        resultArr.push(beRateInlctPrmProdScCd);
    } else {
        resultArr.push(newLobCd);
    }
    
    if (gbnVal == "2"){
        resultArr.push(rateItvReprRat, itmSeq, rateItvReprRat, occuCnt03, pryMultpDifVal);
    } else {
        resultArr.push(rateItvReprRat, assAplcRto, aplcYn, spdAplcYn, pryMultpAvrVal, occuCnt03, cecnt, arctSuitaYn);
    }
    
    return resultArr;
}

/**
 * @설명: 보정데이터 엑셀 출력용 hidden gridTable 조회 (*보정 히든 그리드용) <각각의 서비스 기준에 맞도록 변경 필요>
 * @최초작성자: 김민우
 * @최초작성일: 2021. 12. 10
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김민우 2021. 12. 10 최초작성
 */
function selectAplcData(){
    // 상품유형 선택
    gReqParam.finYmFrom = $.replaceAll($('#ibx_finYmFrom').val().trim(), '-','');
    gReqParam.finYmTo = $.replaceAll($('#ibx_finYmTo').val().trim(), '-','');
    gReqParam.oneoffChk = gCondOneoffCheck;
    gReqParam.gbnVal = $("#sbx_typSc option:selected").val();;
    
    $.callAjax({"jsonStr":JSON.stringify(gReqParam)}, "/be/pd/bepd271m/selectDyncRscRatCrrctnList.do",{async:false})
    .done(function(data) {
         // 그리드 초기화
        reDrawGrid("aplc");
        $("#gridTmpDivSub").jsGrid("reset");
        $("#gridTmpDivSub").jsGrid("option", "data", []);
        $("#gridTmpDivSubDtl").jsGrid("reset");
        $("#gridTmpDivSubDtl").jsGrid("option", "data", []);
        
        hiddenRstList = data.rstList;
        hiddenDtlList = data.dtlList;

        $("#gridTmpDivSub").jsGrid("loadData", hiddenRstList);
        $("#gridTmpDivSubDtl").jsGrid("loadData", hiddenDtlList);
        if(hiddenRstList == null || hiddenRstList.length == 0
                && hiddenDtlList == null || hiddenDtlList.length == 0){
            $.fn.msgBox("출력할 내용이 없습니다.");
        } else {
            $('#gridTmpDivSub').jsGrid('reset');
            $('#gridTmpDivSubDtl').jsGrid('reset');
            initGridTmpSubItem();
            initGridTmpSubItem2();
            
            $('#gridTmpDivSub').jsGrid('loadData', hiddenRstList);
            $('#gridTmpDivSubDtl').jsGrid('loadData', hiddenDtlList);

            let fileName = $(document).find("title").text() + "_보정.xlsx";
            //보정임시 테이블에서 엑셀다운
            $.fn.exportMultiGridExcel([
                {
                    id: 'gridTmpDivSub',
                    sheetName : "상품유형별",
                    fileName: fileName,
                    applyItemTemplate : true
                },
                {
                    id: 'gridTmpDivSubDtl', 
                    sheetName : "상세내역",
                    fileName: fileName,
                    applyItemTemplate : true
                },
                {
                    id: 'gridTmpDivSub',
                    sheetName : "상품유형별(코드)",
                    fileName: fileName,
                    applyItemTemplate : false
                },
                {
                    id: 'gridTmpDivSubDtl', 
                    sheetName : "상세내역(코드)",
                    fileName: fileName,
                    applyItemTemplate : false
                }
            ]);
        }
    }).fail(function(data) {
        console.log("fail to fn.getTbDtSub!!!!");
    });
}