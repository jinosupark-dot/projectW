/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 산출적용기준
 * @설명: 적용기준
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 7. 13
 * @최종변경일: 
 * @개정이력: 
 *  박세라 (61000434) 2021. 7. 13. 최초작성 
 */

// 전역변수
var gArrCols = [];
//조회조건obj
var gReqParam = {};

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //버튼 권한 처리 2021.06.14
//    $.fn.setBtnPermission([{"btnId":"#btn_exportExcel","type":"A"},
//                            {"btnId":"#btn_loadExcel","type":"A"}]);

    //공통코드(통합수준코드) 콤보박스
    initCommCd();

    // 초기Grid
    initGridDiv();

});
/**
* @설명: 적용기준 기본 세팅
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 19.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 19. 최초작성
*/
function initCommCd(num) {
    
    // 공통코드 조회
    $.fn.loadCommonCode(["ASS_SC_CD", "RTF_MTH_SC_CD"]);

    // 적용BE 조회, 콤보박스 설정
    $.callAjax("", "/be/pd/bepd111m/selectAplcStndComboList.do")
    .done(function(data) {
        document.getElementById("sbx_aplcBe").options.length=0;
        var $combo = $(data.comboList);
        var opt = "";
        if($combo==null) {
            opt = "<option selected='selected'>-전체-</option>";
            $("#sbx_aplcBe").append(opt);
        } else {
            for(var c=0; c<$combo.length; c++) {
                if(c==$combo.length-1 && num!=1) {
                    opt = "<option value='"+$combo[c].aplcBeNm+"'selected='selected'>"+$combo[c].aplcBeNm+"</option>";
                    // 적용BE에 따른 타이틀 설정
                    $("#titleBE").text($combo[c].aplcBeNm+" 적용 기준");
                    $("#sbx_aplcBe").prepend(opt);
                } else {
                    opt = "<option value='"+$combo[c].aplcBeNm+"'>"+$combo[c].aplcBeNm+"</option>";
                    $("#sbx_aplcBe").prepend(opt);
                }
            }
            if(num==1) {
                var value = $("#titleBE").text().substr(0,6);
                $("#sbx_aplcBe").val(value).attr("selected", "selected");
            }
        }
        
    }).fail(function(data){
        console.log("fail to selectTableSchemaInfo");
    });
    
    //event 초기화
    initEvent();
}

function initEvent() {

    // 조회
    $('#btn_search').on('click', function(e){
        $("#titleBE").text($("#sbx_aplcBe option:selected").text()+" 적용 기준");
        selectAplcStndList();
    });
    
    // 엑셀다운로드
    $('#btn_excel_download').on('click', function(e){
        if($("#titleBE").text().substr(0,6) != $("#sbx_aplcBe option:selected").text()) {
            $.fn.msgBox("조회조건이 변경되었습니다.\n 다시 조회해주세요.");
            return;
        } else if($("#gridDiv").jsGrid("option", "data").length == 0) {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        var fileName = $("#titleBE").text()+'.xlsx';
        $.fn.exportMultiGridExcel([
            {
                id: 'gridDiv',
                sheetName : "적용기준",
                fileName: fileName,
                applyItemTemplate : true,
                unit: "X",
                searchCond: $.fn.getSearchCondSub("ADTN")
            },
            {
                id: 'gridDiv',
                sheetName : "적용기준(코드)",
                fileName: fileName,
                unit: "X",
                applyItemTemplate : false
            }
    ]);
    });
    
    //양식다운로드 클릭
    $("#btn_exportExcelForm").on("click", function(e){
        
        var arrColsInfo = $.fn.getTbCols("TB_IBECIF04");
        
        gArrCols = $.fn.createTmpExcelGrid(arrColsInfo);
        
        $.fn.exportGridExcel({
            id: "gridTmpDiv", 
            fileName: "산출적용기준_업로드양식.xlsx"
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
                        console.log("로드데이터");
                        console.log(JSON.stringify(data["list"]));
                        console.log(gArrCols);
                        data["colList"] = gArrCols;
                        data["tbNm"] = "TB_IBECIF04";
                        data["menuId"] = $.fn.getMenuId();
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/commonBe/saveDtList.do')
                        .done(function(data) {
                            if(data.result == '1') {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                                initCommCd(1);
                                selectAplcStndList();
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

function initGridDiv(){
    // 공통코드 불러오기
    $.fn.loadCommonCode(["ASS_SC_CD", "RTF_MTH_SC_CD"]);
    
    var gridDiv = new ComJsGrid({
        id: "gridDiv",
        height: 600,
        editing: false,
        sorting: true,
        paging: false,
        
        fields : [
            { name: "assScCd", title:"구분", css:"cell", type: "select", width: 40, align:"center",
                items: $.fn.getGridCodeItem("ASS_SC_CD"), textField: "codeNm", valueField:"code"},
            { name: "exprStasPrd", title:"통계기간", css:"cell", type: "text", width: 40, align:"center",
                    itemTemplate:function(value, item) {
                        return value+"년";
                    }
            },
            { name: "finYm", title:"마감년월", css:"cell", type: "text", width: 40, align:"center"},
            { name: "prodStndCntnt", title:"내용", css:"cell", type: "text", width: 40, align:"left"},
            { name: "rtfMthScCd", title:"보정", css:"cell", type: "select", width: 40, align:"left",
                items: $.fn.getGridCodeItem("RTF_MTH_SC_CD"), textField: "codeNm", valueField:"code"},
            { name: "etcCntnt", title:"기타", css:"cell", type: "text", width: 40, align:"left"},
            { name: "rfltPrdCntnt", title:"반영기간", css:"cell", type: "text", width: 120, align:"left"}
            ]
        }); 
    
    //그리드 생성
    gridDiv.gridCreate();
}

/**
* @설명: 적용기준 조회, 데이터 얻어오기
* @최초작성자: 박세라
* @최초작성일: 2021. 7. 13.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 7. 13. 최초작성
*/
function selectAplcStndList(){
    // selectbox option value 받아오기
    var appBE = $("#sbx_aplcBe option:selected").val();
    
    // 조회에 필요한 값을 셋팅
    var gReqParam = {
                "appBE": appBE,
        }
        $.callAjax(gReqParam, "/be/pd/bepd111m/selectAplcStndList.do")
        .done(function(data) {
            $("#gridDiv").jsGrid("reset");
            $("#gridDiv").jsGrid("option", "data", []);
            $("#gridDiv").jsGrid("destroy");
            initGridDiv();
            
            var loadList = data.list;
            $('#gridDiv').jsGrid('loadData', loadList);
            
        }).fail(function(data){
            console.log("fail to selectTableSchemaInfo");
        }); 
}