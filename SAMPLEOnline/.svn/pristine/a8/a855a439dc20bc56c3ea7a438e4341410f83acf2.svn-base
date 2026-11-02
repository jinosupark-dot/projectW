/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 연금개시후해지율- 부가정보 > 그래프팝업
 * @설명: 연금개시후해지율- 부가정보 화면의 JS
 * @최초작성자: 이현수
 * @최초작성일: 2021. 10. 18.
 * @최종변경일: 
 * @개정이력: 
 *  이현수 2021. 10. 18. 최초작성
 */

var gChart;
//조회구분
var gCondDiv = "1";
//그리드구분(건수기준/드라이버기준)
var gGridDiv = "1";
//라벨
var gArrLabels = [];

$(document).ready(function(){

    gCondDiv = window.opener.popupOption.sbxDiv;
    gGridDiv = $("#sbx_gridDiv").val();
    
    //공통코드선언
    initCommCd();
    
    //이벤트선언
    initEvent();
    
    //초기 그래프세팅
    initGrp();
    
    ctlExnexDvdSbx($("#sbx_blockScCd").val());
});

/**
 * @설명: 콤보박스 초기화
 * @최초작성자: 이현수
 * @최초작성일: 2021. 10. 18
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 10. 18 최초작성
 */
function initCommCd() {
    // 공통코드 조회(BLOCK구분코드,유무배당구분코드)
    $.fn.loadCommonCode(["BE_BLK_SC_CD","BE_I17EXNEX_DVD_SC_CD"]);
    
    //parent 조회기준
    if(gCondDiv == "1") {
        $("#div_blockScCd").show();
    } else {
        $("#div_blockScCd").hide();
        $("#div_exnexDvdScCd").hide();
    }
}

/**
 * @설명: event 초기화
 * @최초작성자: 이현수
 * @최초작성일: 2021. 10. 18
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 10. 18 최초작성
 */
function initEvent() {
    //그리드구분 콤보박스 이벤트
    $("#sbx_gridDiv").on("change", function(e) {
        gGridDiv = $("#sbx_gridDiv").val();
        initGrp();
    });
    
    //block유형 구분 (OLD_BLOCK:2, NEW_BLOCK:1)
    $("#sbx_blockScCd").on("change", function(e) {
        var blockScCd = $("#sbx_blockScCd").val();
        var exnexDvdScCd = $("#sbx_exnexDvdScCd").val();
        
        drawAdtnInfoGrp(blockScCd, exnexDvdScCd);
        ctlExnexDvdSbx(blockScCd);
    });
    
    //상품유형 콤보박스 이벤트(유배당, 무배당)
    $("#div_exnexDvdScCd").on("change", function(e) {
        var blockScCd = $("#sbx_blockScCd").val();
        var exnexDvdScCd = $("#sbx_exnexDvdScCd").val();
        
        drawAdtnInfoGrp(blockScCd, exnexDvdScCd);
        ctlExnexDvdSbx(blockScCd);
    });
}

/**
 * @설명: 조회구분에 따른 차트 리로드
 * @최초작성자: 이현수
 * @최초작성일: 2021. 10. 18
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 10. 18 최초작성
 */
function initGrp() {
    //parent 조회구분 : 상품유형별 연도별 비중
    if(gCondDiv == "1") {
        var blockScCd = $("#sbx_blockScCd").val();
        var exnexDvdScCd = $("#sbx_exnexDvdScCd").val();
        
        drawAdtnInfoGrp(blockScCd, exnexDvdScCd);
    //parent 조회구분 :연금지급유형별 연도별 비중
    } else {
        drawAdtnInfoGrp();
    }
}

/**
 * @설명: 하이라키별 데이터 추출
 * @최초작성자: 이현수
 * @최초작성일: 2021. 10. 18
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 10. 18 최초작성
 */
function getData(arrData, hierarchyVal, hierarchyNm) {
    var grpArrData = [];
    
    if(hierarchyVal != undefined || hierarchyVal != null) {
        for(var i=0; i<arrData.length; i++) {
            if(arrData[i][hierarchyNm] == hierarchyVal) {
                grpArrData.push(arrData[i]);
            }
        }
    } else {
        grpArrData = arrData;
    }
    
    return grpArrData;
}
/**
 * 그래프 데이터 세팅 및 그래프 화면 출력
 * @param hierarchyVal (선택된 하이라키의 코드값)
 * @returns
 */
function drawAdtnInfoGrp(hierarchyVal1, hierarchyVal2) {
    //메인창 그리드 데이터, 필드
    var arrData =[];
    var arrField = [];
    //그리드기준:건수 기준
    if(gGridDiv == "1") {
        arrData = window.opener.popupOption.gridData1;
        arrField = window.opener.popupOption.gridField1;
    //그리드기준:드라이브 기준
    } else {
        arrData = window.opener.popupOption.gridData2;
        arrField = window.opener.popupOption.gridField2;
    }
    //그래프 라벨 세팅
    gArrLabels = getLabels(arrField, "년도");

    //하이라키별 데이터 세팅
    var grpArrData = [];

    //parent 조회구분:상품유형별 연도별 비중
    if(gCondDiv == "1") {
        grpArrData = getData(arrData, hierarchyVal1, "beBlkScCd");
        //Block유형(2:NEW_BLOCK)
        if($("#sbx_blockScCd").val() == "1") {
            grpArrData = getData(grpArrData, hierarchyVal2, "exnexDvdScCd");
        }
    } else {
        grpArrData = getData(arrData, null, "beAnutPymMthCd");
    }
    
    if(grpArrData.length == 0) {
        console.log("데이터가없습니다.");
        return;
    }
    
    var grpHandler = {
        //그래프 데이터 세팅
        getGrpData : function() {
            var arrObjData = [];

            var _datas = grpArrData;
            var _fields = arrField;
            $.each(_datas, function(key, value){
                var grpObj = {};
                $.grep(_fields, function( field ){
                    for(var key in value){
                        if(field.title && field.visible != false){
                            var fTitle = field.title;
                            //체크박스 컬럼인 경우 제외
                            
                            if( field.name === key ){
                                var kvalue = String(value[key]);
                                kvalue = field.itemTemplate(value[key], value);
                                
                                if(typeof value[key] == "string" || kvalue == "Total" || kvalue == "TOTAL") {
                                    grpObj[field.title] = kvalue;
                                }else {
                                    grpObj[field.title] = value[key];
                                }
                                
                            }
                            
                        }
                    }
                });
                arrObjData.push(grpObj);
            });
            return arrObjData;
        },
        //백그라운드컬러 세팅 (사용X)
        getBackgroundColor : function() {
            
            var arrBackgroundColor = [
                "rgba(255,0,0,0.2)",
                "rgba(255,94,0,0.2)",
                "rgba(255,228,0,0.2)",
                "rgba(29,219,22,0.2)",
                "rgba(0,216,255,0.2)",
                "rgba(1,0,255,0.2)",
                "rgba(95,0,255,0.2)",
                "rgba(102,204,255,0.2)",
                "rgba(153,102,51,0.2)",
                "rgba(51,153,153,0.2)",
                "rgba(153,204,255,0.2)",
                "rgba(51,153,0,0.2)",
                "rgba(153,0,255,0.2)",
                "rgba(204,102,0,0.2)",
                "rgba(153,0,204,0.2)",
                "rgba(255,153,204,0.2)",
                "rgba(153,204,204,0.2)"
            ];

            return arrBackgroundColor;
        },
        //그래프 표현 색상 세팅
        getBorderColor : function() {
            
            var arrBorderColor = [
                "rgba(255,0,0,1)",
                "rgba(255,94,0,1)",
                "rgba(255,228,0,1)",
                "rgba(29,219,22,1)",
                "rgba(0,216,255,1)",
                "rgba(1,0,255,1)",
                "rgba(95,0,255,1)",
                "rgba(102,204,255,1)",
                "rgba(153,102,51,1)",
                "rgba(51,153,153,1)",
                "rgba(153,204,255,1)",
                "rgba(51,153,0,1)",
                "rgba(153,0,255,1)",
                "rgba(204,102,0,1)",
                "rgba(153,0,204,1)",
                "rgba(255,153,204,1)",
                "rgba(153,204,204,1)"
            ];
        
            return arrBorderColor;
        },
        
        //그래프데이터 매핑하여 그래프 생성
        drawGrp : function(arrObjData) {
            
            var arrGrpData = this.getGrpData();
            var arrBackgroundColor = this.getBackgroundColor();
            var arrBorderColor = this.getBorderColor();

            //chartjs dataset 세팅
            var arrDatasets = [];
            var blockScCd = $("#sbx_blockScCd").val(); //BLOCK유형
            var exnexDvdScCd = $("#sbx_exnexDvdScCd").val(); //상품유형
            
            for(var i=0; i<arrGrpData.length; i++) {
                var objDataset = {};
                //parent 조회구분
                if(gCondDiv == "1") {
                    //Block유형별
                    if(blockScCd == "1") {
                        //하이라키 선택별 라벨 세팅
                        objDataset["label"] = arrGrpData[i]["금리유형"];
                        var arr =[];
                        for(var j=0; j<gArrLabels.length; j++) {
                            arr.push(arrGrpData[i][gArrLabels[j]]);
                        }
                        objDataset["data"] = arr;
                    } else {
                        objDataset["label"] = arrGrpData[i]["BLOCK유형"];
                        var arr =[];
                        for(var j=0; j<gArrLabels.length; j++) {
                            arr.push(arrGrpData[i][gArrLabels[j]]);
                        }
                        objDataset["data"] = arr;
                    }
                } else {
                    objDataset["label"] = arrGrpData[i]["연금지급유형"];
                    var arr =[];
                    for(var j=0; j<gArrLabels.length; j++) {
                        arr.push(arrGrpData[i][gArrLabels[j]]);
                    }
                    objDataset["data"] = arr;
                }
                
                objDataset["lineTension"] = 0;
                
                objDataset["backgroundColor"] = arrBackgroundColor[i];//["rgba(0,0,0,0)"]; //backgroundcolor : false
                
                objDataset["borderColor"] = arrBorderColor[i];
                
                objDataset["borderWidth"] = 1;
                
                arrDatasets.push(objDataset);
                
            }
            if(arrDatasets == null || arrDatasets.length == 0) {
                $.fn.msgBox("조회기준에 맞는 데이터가 없습니다.");
                gChart.destroy();
                return;
            }
            //그래프 그리기
            var ctx = $("#cancRatGrp");
            //이전 차트 지우기
            if((gChart != undefined)) {
                gChart.destroy();
            }
            gChart = new Chart(ctx, {
                type: "bar",
                //type: "line",
                data:{
                    //1차월,2차월,... 등
                    labels: gArrLabels,
                    datasets: arrDatasets

                },
                option: {
                    responsive: true,
                    plugins: {
                        lengend: {
                            position: "top"
                        },
                        title: {
                            display: true,
                            text: "연금개시후해지율 통계대상의 상품유형별_연도별 비중(건수기준)"
                        }
                    },
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    };

    grpHandler.drawGrp(grpHandler.getGrpData());
}

/**
 * @설명: 조회구분에 따른 그래프 라벨 세팅
 * @최초작성자: 이현수
 * @최초작성일: 2021. 10. 18
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 10. 18 최초작성
 */
function getLabels(gridField, delimiter) {
    var labelArr = [];
    
    for(var i=0; i<gridField.length; i++) {
        var field = gridField[i]["title"];
        
        if(field.indexOf(delimiter) !== -1) {
            labelArr.push(field);
        }
    }
    
    return labelArr;
}

/**
 * @설명: Block 조회구분에 따른 상품유형 컨트롤
 * @최초작성자: 이현수
 * @최초작성일: 2021. 10. 18
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 10. 18 최초작성
 */
function ctlExnexDvdSbx(blockScCd) {
    //NEW_BLOCK
    if(blockScCd == "1") {
        $("#div_exnexDvdScCd").show();
    } else {
        $("#div_exnexDvdScCd").hide();
    }
}