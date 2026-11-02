/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 위험율 - 부가정보 > 그래프팝업
 * @설명: 위험율 - 기초데이터 화면의 JS
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
var gArrLabels = [];
//
var gCondHichyCheck = ["HIGH_RSK_RAT_PRDT_SC_CD","BENF_LCLSF_CD","ON_LEVEL"];
$(document).ready(function(){
    
    //gCondDiv = window.opener.popupOption.sbxDiv;

    //gGridDiv = $("#sbx_gridDiv").val();
    
    
    //공통코드선언
    initCommCd();
    
    //이벤트선언
    initEvent();
        
    //초기 그래프세팅
    initGrp();
    
    
    
});

function initCommCd() {
    
    // 공통코드 조회(고위험상품구분,급부대분류)
    $.fn.loadCommonCode(gCondHichyCheck);

    //콤보박스 세팅
    for(var i=0; i<gCondHichyCheck.length-1; i++) {
        var newCdList = [];
        var tmpCdList = $._commonObj["code"][gCondHichyCheck[i]];
        
        for (var j=0; j<tmpCdList.length; j++) {
            var tmpCd = tmpCdList[j];
            if(tmpCd.codeNm.indexOf('TOTAL') == -1) {
                var newCd = {
                        "code" : tmpCd.code,
                        "codeNm" : tmpCd.codeNm
                }
                newCdList.push(newCd);
            }
        }
        $._commonObj.code[gCondHichyCheck[i]] = newCdList;
        console.log("newCdList ? ", newCdList);
        $.fn.renderCombobox({
            codeArr: [gCondHichyCheck[i]],
            selArr: ["sbx_" + $.toCamel(gCondHichyCheck[i])],
            useFirstOption: false       //첫번째 option 사용여부
        });
    }

}

function initEvent() {
    
    //고위험상품구분 콤보박스 이벤트
    $("#sbx_highRskRatPrdtScCd").on("change", function(e) {
        
        initGrp();
    });
    
    //급부대분류 콤보박스 이벤트
    $("#sbx_benfLclsfCd").on("change", function(e) {
        
        initGrp();
    });

}

function initGrp() {

    var highRskRatPrdtScCdVal = $("#sbx_highRskRatPrdtScCd").val();
    var benfLclsfCdVal = $("#sbx_benfLclsfCd").val();
    var arrParam = [];
    
    arrParam.push(highRskRatPrdtScCdVal);
    arrParam.push(benfLclsfCdVal);
    drawAdtnInfoGrp(arrParam);
}


/**
 * 그래프 데이터 세팅 및 그래프 화면 출력
 * @param hierarchyVal (선택된 하이라키의 코드값)
 * @returns
 */
function drawAdtnInfoGrp(pHichyArr) {
    
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
    if(pHichyArr != undefined || pHichyArr != null) {
        //grid데이터 반복문
        for(var i=0; i<arrData.length; i++) {
            var arrHichyVal = [];
            //체크된 하이라키 코드값 세팅
            for(var j=0; j<gCondHichyCheck.length-1; j++) {
                arrHichyVal.push(arrData[i][$.toCamel(gCondHichyCheck[j])]);
            }
            //하이라키 코드값이 일치하는것만 그래프 데이터로 세팅
            if(arrHichyVal.equals(pHichyArr)) {
                grpArrData.push(arrData[i]);
            }
        }
    }
    
    if(arrData.length == 0) {
        $.fn.msgBox("조회기준에 맞는 데이터가 없습니다.");
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
                                
                                if(typeof value[key] == "string" || kvalue == "TOTAL") {
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
            console.log("그래프데이터");
            console.log(JSON.stringify(arrObjData));
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
                
                objDataset["label"] = arrGrpData[i]["On-Level"];
                
                objDataset["data"] = [arrGrpData[i]["1차년"], arrGrpData[i]["2차년"], arrGrpData[i]["3차년"], arrGrpData[i]["4차년"], arrGrpData[i]["5차년"], arrGrpData[i]["6차년"], arrGrpData[i]["7차년"], arrGrpData[i]["8차년"], arrGrpData[i]["9차년"], arrGrpData[i]["10차년"], arrGrpData[i]["11차년"], arrGrpData[i]["12+차년"]];
                
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
            var ctx = $("#rskRatGrp");
            
            //이전 차트 지우기
            if((gChart != undefined)) {
                gChart.destroy();
            }
            gChart = new Chart(ctx, {
                type: "bar",
                data:{
                    //1차월,2차월,... 등
                    labels: ["1차년","2차년","3차년","4차년","5차년","6차년","7차년","8차년","9차년","10차년","11차년","12+차년"],
                    
                    //
                    datasets: arrDatasets
                },
                options: {
                    responsive: false,
                    plugins: {
                        lengend: {
                            position: "top"
                        },
                        title: {
                            display: true,
                            text: "위험율 부가정보"
                        }
                    },
                    maintainAspectRatio: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                userCallback: function(value, index, values){
                                	value = value.toString();
                                	value = value.replace(/\B(?=(\d{3})+(?!\d))/g,",");
                                	return value;
                                }
                            }
                        }]
                    }
                }
            });

        }
    };

    grpHandler.drawGrp(grpHandler.getGrpData());
}
