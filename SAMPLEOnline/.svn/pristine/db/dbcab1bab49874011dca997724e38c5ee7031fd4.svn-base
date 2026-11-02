/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 취소율 - 부가정보 > 그래프팝업
 * @설명: 취소율 - 기초데이터 화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 16.
 * @최종변경일: 
 * @개정이력: 
 *  2021. 9. 16. 최초작성
 */


//var gCtx = $("#cancRatGrp");
var gChart;
//조회구분
var gCondDiv = "1";
//그리드구분(건수기준/드라이버기준)
var gGridDiv = "1";
//라벨
var gArrLabels = []

var gCondHichyCheck = ["BE_NEW_LOB_CD","BE_CHNL_SC_CD"];
$(document).ready(function(){
    console.log("진입");
    gCondDiv = window.opener.popupOption.sbxDiv;

    gGridDiv = $("#sbx_gridDiv").val();
    
    
    //공통코드선언
    initCommCd();
    
    //이벤트선언
    initEvent();
        
    //초기 그래프세팅
    initGrp();
    
    
    
});

function initCommCd() {
    
    // 공통코드 조회(상품유형,채널)
    $.fn.loadCommonCode(gCondHichyCheck);
    for(var i=0; i<gCondHichyCheck.length-1; i++) {
        $._commonObj["code"][gCondHichyCheck[i]].pop();
    }
    
    //콤보박스 세팅   
    if(gCondDiv == "4") {
        $.fn.renderCombobox({
            codeArr: ["BE_CHNL_SC_CD"],
            selArr: ["sbx_beChnlScCd"],
            useFirstOption: false       //첫번째 option 사용여부
        });
        //$("#sbx_beChnlScCd option[value=" + window.opener.popupOption.sbxChnl +"]").attr("selected", true);
        $("#sbx_beChnlScCd").val(window.opener.popupOption.sbxChnl).prop("selected", true);
        $("#sbx_beChnlScCd").attr("disabled", true);
        gArrLabels = ["1차월","2차월","3차월","4차월","5+차월"];
    }else if(gCondDiv == "3") {
        $("#div_beChnlScCd").remove();
        var arr = $._commonObj["code"]["BE_CHNL_SC_CD"];
        
        for(var i=0; i<arr.length; i++) {
            gArrLabels.push(arr[i].codeNm);
        }
    }else {
        $("#div_beChnlScCd").remove();
        gArrLabels = ["1차월","2차월","3차월","4차월","5+차월"];
    }
    
}

function initEvent() {
    
    //그리드구분 콤보박스 이벤트
    $("#sbx_gridDiv").on("change", function(e) {
        gGridDiv = $("#sbx_gridDiv").val();
        initGrp();
    });
    
    //채널유형 콤보박스 이벤트
    $("#sbx_beChnlScCd").on("change", function(e) {
        
        var beChnlScCd = $("#sbx_beChnlScCd").val();
        drawAdtnInfoGrp(beChnlScCd);
    });

}

function initGrp() {
    
    if(gCondDiv == "1") {
        drawAdtnInfoGrp();
    }else if(gCondDiv == "2") {
        drawAdtnInfoGrp();
    }else if(gCondDiv == "3") {
        drawAdtnInfoGrp();
    }else {
        drawAdtnInfoGrp();
    }
}


/**
 * 그래프 데이터 세팅 및 그래프 화면 출력
 * @param hierarchyVal (선택된 하이라키의 코드값)
 * @returns
 */
function drawAdtnInfoGrp(hierarchyVal) {
    
    //메인창 그리드 데이터, 필드
    var arrData =[];
    var arrField = [];
    if(gGridDiv == "1") {
        arrData = window.opener.popupOption.gridData1;
        arrField = window.opener.popupOption.gridField1;
    }else {
        arrData = window.opener.popupOption.gridData2;
        arrField = window.opener.popupOption.gridField2;
    }
    
    //하이라키별 데이터 세팅
    var grpArrData = [];
    if(hierarchyVal != undefined || hierarchyVal != null) {
        for(var i=0; i<arrData.length; i++) {
            if(arrData[i]["beChnlScCd"] == hierarchyVal) {
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
            var arrDatasets = [];
            for(var i=0; i<arrGrpData.length; i++) {
                var objDataset = {};
                
                //하이라키 선택별 라벨 세팅
                if(gCondDiv == "1") {
                    objDataset["label"] = arrGrpData[i]["경과월"];
                    objDataset["data"]= [arrGrpData[i]["1차월"], arrGrpData[i]["2차월"], arrGrpData[i]["3차월"], arrGrpData[i]["4차월"], arrGrpData[i]["5+차월"]];
                }else if(gCondDiv == "2") {
                    objDataset["label"] = arrGrpData[i]["상품유형"];
                    objDataset["data"]= [arrGrpData[i]["1차월"], arrGrpData[i]["2차월"], arrGrpData[i]["3차월"], arrGrpData[i]["4차월"], arrGrpData[i]["5+차월"]];
                }else if(gCondDiv == "3") {
                    objDataset["label"] = arrGrpData[i]["상품유형"];
                    var arr =[];
                    for(var j=0; j<gArrLabels.length; j++) {
                        arr.push(arrGrpData[i][gArrLabels[j]]);
                    }
                    objDataset["data"] = arr;
                    //objDataset["data"]= [arrGrpData[i]["FC"], arrGrpData[i]["PA"], arrGrpData[i]["CA"], arrGrpData[i]["DM"], arrGrpData[i]["GA"],arrGrpData[i]["GB"], arrGrpData[i]["BA"], arrGrpData[i]["AR"], arrGrpData[i]["POOL"], arrGrpData[i]["기타채널"], arrGrpData[i]["개인대리점"], arrGrpData[i]["내근"]];
                }else {
                    objDataset["label"] = arrGrpData[i]["상품유형"];
                    objDataset["data"]= [arrGrpData[i]["1차월"], arrGrpData[i]["2차월"], arrGrpData[i]["3차월"], arrGrpData[i]["4차월"], arrGrpData[i]["5+차월"]];
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
                            display: true,
                            text: "취소율 통계대상의 상품유형별_경과월별 비중(건수기준)"
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
