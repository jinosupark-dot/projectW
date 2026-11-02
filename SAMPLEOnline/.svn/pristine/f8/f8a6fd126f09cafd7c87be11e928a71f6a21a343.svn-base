/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 해지율 - 기초데이터 > 그래프팝업
 * @설명: 해지율 - 기초데이터 화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 16.
 * @최종변경일: 2022. 5. 3
 * @개정이력: 
 *  임국빈 2021. 9. 16. 최초작성
 *  서승호 2022. 5.  3. 컬럼명 변경. 저무해지구분코드 -> 해지율산출구분
 */


//var gCtx = $("#cancRatGrp");
var gChart;
var gCondHichyCheck = [];
//그리드구분(기초율/분자/본모)
var gGridDiv = "1";
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
    //ex ["NEW_LOB_CD", "BE_CHNL_SC_CD"]
    gCondHichyCheck = window.opener.popupOption.arrCheck;
    for(var i=0; i<gCondHichyCheck.length; i++) {
        gCondHichyCheck[i] = $.toUnderscore(gCondHichyCheck[i]).toUpperCase(); 
    }
}

function initCommCd() {
    
    // 공통코드 조회(상품유형,채널)
    $.fn.loadCommonCode(gCondHichyCheck);
    
    //콤보박스 세팅   
    if(gCondHichyCheck.length >= 2) {
        //선택한 하이라키갯수 - 1개의 콤보박스 생성
        for(var i=0; i<gCondHichyCheck.length-1; i++) {
            if(gCondHichyCheck[i] != 'DUPAY_REFND_RTO_VAL' && gCondHichyCheck[i] != 'PAD_AFT_REFND_RTO_VAL' && gCondHichyCheck[i] != 'BE_BLK_SC_CD') {
                var newCdList = [];
                var tmpCdList = $._commonObj["code"][gCondHichyCheck[i]];
                
                for (var j=0; j<tmpCdList.length; j++) {
                    var tmpCd = tmpCdList[j];
                    if(tmpCd.code.indexOf('Z') == -1) {
                        var newCd = {
                                "code" : tmpCd.code,
                                "codeNm" : tmpCd.codeNm
                        }
                        newCdList.push(newCd);
                    }
                }
                $._commonObj.code[gCondHichyCheck[i]] = newCdList;
                
                $.fn.renderCombobox({
                    codeArr: [gCondHichyCheck[i]],
                    selArr: ["sbx_" + $.toCamel(gCondHichyCheck[i])],
                    useFirstOption: false       //첫번째 option 사용여부
                });
            }
        }
    }
}

function initEvent() {
    
    //그리드구분 콤보박스 이벤트
    $("#sbx_gridDiv").on("change", function(e) {
        gGridDiv = $("#sbx_gridDiv").val();
        initGrp();
    });
    
    $("#sbx_rscRatProdScCd").on("change", function(e) {
        initGrp();
    });
    
    $("#sbx_dupayRefndRtoVal").on("change", function(e) {
        initGrp();
    });
    
    $("#sbx_padAftRefndRtoVal").on("change", function(e) {
        initGrp();
    });
    
    //block 콤보박스 이벤트
    $("#sbx_beBlkScCd").on("change", function(e) {
        initGrp();
    });
    
    //납입상태 콤보박스 이벤트
    $("#sbx_beFpayYnScCd").on("change", function(e) {
        initGrp();
    });
    
    //채널유형 콤보박스 이벤트
    $("#sbx_beChnlScCd").on("change", function(e) {
        initGrp();
    });
}

function initGrp() {
//["BLK_SC_CD","FPAY_YN_SC_CD","BE_CHNL_SC_CD","NEW_LOB_CD"]
    var removeParam = ["rscRatProdScCd","dupayRefndRtoVal","padAftRefndRtoVal","beBlkScCd","beFpayYnScCd","beChnlScCd"];
    var arrParam = [];

    
    for(var j=0; j<removeParam.length; j++) {
        var checkParam = "0";
        var removeStr = $.toUnderscore(removeParam[j]).toUpperCase();
        for(var i=0; i<gCondHichyCheck.length; i++) {
            if(removeStr == gCondHichyCheck[i]) {
                arrParam.push($("#sbx_"+removeParam[j]).val());
                checkParam = "1";
            }
        }
        if(checkParam == "0") {
            $("#div_"+removeParam[j]).remove();
        }
    }
    drawPryRatGrp(arrParam);
}


/**
 * 그래프 데이터 세팅 및 그래프 화면 출력
 * @param hierarchyVal (선택된 하이라키의 코드값)
 * @returns
 */
function drawPryRatGrp(pHichyArr) {
    
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
    //체크된 하이라키 하나일때 grid데이터 그대로 사용(여기선 안탐 삭제예정)
    else {
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
            
            var rscRatProdScCd = $("#sbx_rscRatProdScCd option:selected").text();
            var dupayRefndRtoVal = $("#sbx_dupayRefndRtoVal option:selected").text();
            var padAftRefndRtoVal = $("#sbx_padAftRefndRtoVal option:selected").text();
            var beBlkScCd = $("#sbx_beBlkScCd option:selected").text();
            var beFpayYnScCd = $("#sbx_beFpayYnScCd option:selected").text();
            var beChnlScCd = $("#sbx_beChnlScCd option:selected").text();

            for(var i=0; i<arrGrpData.length; i++) {
                var objDataset = {};
                
                if (arrGrpData[i]["해지율산출구분"] == rscRatProdScCd) {
                    if (arrGrpData[i]["납입중환급금비율"] == dupayRefndRtoVal) {
                        if (arrGrpData[i]["납입후환급금비율"] == padAftRefndRtoVal) {
                            if (arrGrpData[i]["BLOCK"] == beBlkScCd) {
                                if (arrGrpData[i]["납입상태"] == beFpayYnScCd) {
                                    if (arrGrpData[i]["채널유형"] == beChnlScCd) {
                                        objDataset["label"] = arrGrpData[i]["상품유형"];
                                        var arr =[];
                                        for(var j=1; j<=12; j++) {
                                            var text = "차년";
                                            if(j==12) {
                                                text = "+차년";
                                            } else {
                                                text = "차년";
                                            }
                                            arr.push(arrGrpData[i][j+text]);
                                        }
                                        objDataset["data"] = arr;
                                    } else {
                                        continue;
                                    }
                                } else {
                                    continue;
                                }
                            } else {
                                continue;
                            }
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
                
                //objDataset["data"]= [arrGrpData[i]["1차년"], arrGrpData[i]["2차년"], arrGrpData[i]["3차년"], arrGrpData[i]["4차년"], arrGrpData[i]["5차년"], arrGrpData[i]["6차년"], arrGrpData[i]["7차년"], arrGrpData[i]["8차년"], arrGrpData[i]["9차년"], arrGrpData[i]["10차년"], arrGrpData[i]["11차년"], arrGrpData[i]["12+차년"]]; 
                
                objDataset["lineTension"] = 0;
                
                objDataset["backgroundColor"] = ["rgba(0,0,0,0)"]; //backgroundcolor : false
                objDataset["borderColor"] = arrBorderColor[i%17];
                arrDatasets.push(objDataset);
                console.log("arrDatasets??",arrDatasets);
            }
            if(arrDatasets == null || arrDatasets.length == 0) {
                $.fn.msgBox("조회기준에 맞는 데이터가 없습니다.");
                gChart.destroy();
                return;
            }
            //그래프 그리기
            var ctx = $("#rscRatGrp");
            
            //이전 차트 지우기
            if((gChart != undefined)) {
                gChart.destroy();
            }
            gChart = new Chart(ctx, {
                //type: "bar",
                type: "line",
                data:{
                    //1차년,2차년,...
                    labels: ["1차년","2차년","3차년","4차년","5차년","6차년","7차년","8차년","9차년","10차년","11차년","12+차년"],
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
                            text: "해지율 기초데이터 그래프"
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
