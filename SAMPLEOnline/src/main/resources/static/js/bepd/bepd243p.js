/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 보험계약대출율- 부가정보 > 그래프팝업
 * @설명: 보험계약대출율- 부가정보 화면의 JS
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
// 대출한도율 구분
var chk = "";

$(document).ready(function(){

    gCondDiv = window.opener.popupOption.sbxDiv;
    gGridDiv = $("#sbx_gridDiv").val();
    
    if(window.opener.popupOption.gridData2 == undefined || window.opener.popupOption.gridData2 == null) {
        $("#sbx_gridDiv").hide();
        chk = "Y";
    } else {
        $("#sbx_gridDiv").show();
        chk = "N";
    }
    
    //이벤트선언
    initEvent();
    //초기 그래프세팅
    initGrp();
});

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
    var hierarchyVal = "";
    var delimiter = "";
    //parent 조회구분
    if(gCondDiv == "1") {
        hierarchyVal = "경과년도";
        delimiter = "차년";
    } else if(gCondDiv == "2") {
        hierarchyVal = "상품유형";
        delimiter = "차년";
    } else if(gCondDiv == "3") {
        hierarchyVal = "채널";
        delimiter = "차년";
    } else if(gCondDiv == "4") {
        hierarchyVal = "상품유형";
        delimiter = "차년도";
    } else {
        hierarchyVal = "채널";
        delimiter = "차년도";
    }
    
    drawAdtnInfoGrp(hierarchyVal, delimiter);
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
 * @설명: 그래프 데이터 세팅 및 그래프 화면 출력
 * @최초작성자: 이현수
 * @최초작성일: 2021. 10. 18
 * @최종변경일: 
 * @매개변수: hierarchyVal (선택된 하이라키의 코드값)
 * @반환값: 
 * @개정이력: 
 *  이현수 2021. 10. 18 최초작성
 */
function drawAdtnInfoGrp(hierarchyVal, delimiter) {
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
    gArrLabels = getLabels(arrField, delimiter);
    
    //데이터 세팅
    var grpArrData = getData(arrData);

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

            for(var i=0; i<arrGrpData.length; i++) {
                var objDataset = {};
                //parent 조회구분
                //하이라키 라벨 세팅
                objDataset["label"] = arrGrpData[i][hierarchyVal]; 
                var arr =[];
                for(var j=0; j<gArrLabels.length; j++) {
                    arr.push(arrGrpData[i][gArrLabels[j]]);
                }
                objDataset["data"] = arr;
                
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
            var ctx = $("#pllnRatGrp");
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
                            text: "보험계약대출율 통계대상의 상품유형별_연도별 비중(건수기준)"
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