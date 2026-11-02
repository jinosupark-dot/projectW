/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 연금일시해지율 - 기초데이터 > 그래프팝업
 * @설명: 연금일시해지율 - 기초데이터 화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 16.
 * @최종변경일: 
 * @개정이력: 
 *  2021. 9. 16. 최초작성
 */


//var gCtx = $("#cancRatGrp");
var gChart;
var gCondHichyCheck = [];
//그리드구분(기초율/분자/본모)
var gGridDiv = "1";

var gLabels = [];
$(document).ready(function(){
    
    gGridDiv = $("#sbx_gridDiv").val();
    //하이라키 세팅
    initHichy();
    
    //공통코드선언
    initCommCd();
    
    //이벤트선언
    initEvent();
        
    //초기 그래프세팅
    initGrp();
    
});

function initHichy() {
    //체크한 하이라키를 받아온다
    //ex ["ANUT_PYM_MTH_CD"]
    gCondHichyCheck = window.opener.popupOption.arrCheck;
    for(var i=0; i<gCondHichyCheck.length; i++) {
        gCondHichyCheck[i] = gCondHichyCheck[i].toUpperCase(); 
    }
}

function initCommCd() {
    
    // 공통코드 조회(상품유형,채널)
    $.fn.loadCommonCode(gCondHichyCheck);
    
}

function initEvent() {
    
    //그리드구분 콤보박스 이벤트
    $("#sbx_gridDiv").on("change", function(e) {
        gGridDiv = $("#sbx_gridDiv").val();
        initGrp();
    });
    

}

function initGrp() {
    
    drawPryRatGrp($("#sbx_" + $.toCamel(gCondHichyCheck[0])).val());
}


/**
 * 그래프 데이터 세팅 및 그래프 화면 출력
 * @param hierarchyVal (선택된 하이라키의 코드값)
 * @returns
 */
function drawPryRatGrp(hierarchyVal) {
    
    //메인창 그리드 데이터, 필드
    var arrData =[];
    var arrField = [];
    if(gGridDiv == "1") {
        arrData = window.opener.popupOption.gridData1;
        arrField = window.opener.popupOption.gridField1;
    }else if(gGridDiv == "2") {
        arrData = window.opener.popupOption.gridData2;
        arrField = window.opener.popupOption.gridField2;
    }else {
        arrData = window.opener.popupOption.gridData3;
        arrField = window.opener.popupOption.gridField3;
    }
    
    //하이라키별 데이터 세팅 KIDI_ONPAD_SC_CD
    var grpArrData = [];
    if(hierarchyVal != undefined || hierarchyVal != null) {
        for(var i=0; i<arrData.length; i++) {
            if(arrData[i]["kidiOnpadScCd"] == hierarchyVal) {
                grpArrData.push(arrData[i]);
            }
        }
    }else {
        grpArrData = arrData;
    }
    
    if(arrData.length == 0) {
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
/* 01
                "rgba(255,99,132,0.2)",
                "rgba(54,162,235,0.2)",
                "rgba(255,206,86,0.2)",
                "rgba(75,192,192,0.2)",
                "rgba(153,102,255,0.2)",
                "rgba(255,159,64,0.2)"          
*/          
/* 02
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
"rgba(153,0,255,0.2)"
"rgba(204,102,0,0.2)"
"rgba(153,0,204,0.2)"
"rgba(255,153,204,0.2)"
"rgba(153,204,204,0.2)"
*/          
            
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

/*01
                "rgba(255,99,132,1)",
                "rgba(54,162,235,1)",
                "rgba(255,206,86,1)",
                "rgba(75,192,192,1)",
                "rgba(153,102,255,1)",
                "rgba(255,159,64,1)"
*/  
                    
            /* 02
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
            "rgba(153,0,255,0.2)"
            "rgba(204,102,0,0.2)"
            "rgba(153,0,204,0.2)"
            "rgba(255,153,204,0.2)"
            "rgba(153,204,204,0.2)"
            */              
            return arrBorderColor;
        },
        
        //그래프데이터 매핑하여 그래프 생성
        drawGrp : function(arrObjData) {
            
            var arrGrpData = this.getGrpData();
            var arrBackgroundColor = this.getBackgroundColor();
            var arrBorderColor = this.getBorderColor();
            
            //chartjs dataset 세팅
            var vType = "line";
            var arrDatasets = [];
            for(var i=0; i<arrGrpData.length; i++) {
                var objDataset = {};
                
                gLabels = ["Old_block","(유배당)금리확정형","(유배당)금리연동형","(무배당)금리확정형","(무배당)금리연동형","(무배당)변액"];
                
                objDataset["label"] = arrGrpData[i]["연금지급유형"];
                
                objDataset["data"] = [arrGrpData[i]["Old_block"], arrGrpData[i]["(유배당)금리확정형"], arrGrpData[i]["(유배당)금리연동형"], arrGrpData[i]["(무배당)금리확정형"], arrGrpData[i]["(무배당)금리연동형"], arrGrpData[i]["(무배당)변액"]];
                
                objDataset["lineTension"] = 0;
                
                objDataset["backgroundColor"] = ["rgba(0,0,0,0)"]; //backgroundcolor : false
                objDataset["borderWidth"] = 1;
                objDataset["borderColor"] = arrBorderColor[i];
                arrDatasets.push(objDataset);
            }
            if(arrDatasets == null || arrDatasets.length == 0) {
                $.fn.msgBox("조회기준에 맞는 데이터가 없습니다.");
                gChart.destroy();
                return;
            }
            //그래프 그리기
            var ctx = $("#anutBgnAftRscRatGrp");
            
            //이전 차트 지우기
            if((gChart != undefined)) {
                gChart.destroy();
            }
            gChart = new Chart(ctx, {
                //type: "bar",
                type: vType,
                data:{
                    
                    //1차월,2차월,...
                    labels: gLabels,
                    //
                    datasets: arrDatasets
                    
                    /* 차트js 데이터셋 와꾸
                     * datasets: [{
                        label: 'FC', //상품유형
                        data: [12,19,3,5,2,3],
                        lineTension: 0,
                        backgroundColor: //[
                            //'rgba(255,99,132,0.2)',
                            //'rgba(54,162,235,0.2)',
                            //'rgba(255,206,86,0.2)',
                            //'rgba(75,192,192,0.2)',
                            //'rgba(153,102,255,0.2)',
                            "rgba(255,159,64,0.2)"
                        //]
                        ,
                        borderColor: //[
                            //'rgba(255,99,132,1)',
                            //'rgba(54,162,235,1)',
                            //'rgba(255,206,86,1)',
                            //'rgba(75,192,192,1)',
                            //'rgba(153,102,255,1)',
                            "rgba(255,159,64,1)"
                        //]
                        ,
                        borderWidth: 1
                    
                    },
                    {
                        label: 'PA', //상품유형
                        data: [3,20,15,18,10,5],
                        lineTension: 0,
                        backgroundColor: //[
                            //'rgba(255,99,132,0.2)',
                            //'rgba(54,162,235,0.2)',
                            //'rgba(255,206,86,0.2)',
                            //'rgba(75,192,192,0.2)',
                            "rgba(153,102,255,0.2)"
                            //'rgba(255,159,64,0.2)'
                        //]
                        ,
                        borderColor: //[
                            //'rgba(255,99,132,1)',
                            //'rgba(54,162,235,1)',
                            //'rgba(255,206,86,1)',
                            //'rgba(75,192,192,1)',
                            "rgba(153,102,255,1)"
                            //'rgba(255,159,64,1)'
                        //]
                        ,
                        borderWidth: 1
                    }]*/
                },
                option: {
                    responsive: true,
                    plugins: {
                        lengend: {
                            position: "top"
                        },
                        title: {
                            display: true
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
