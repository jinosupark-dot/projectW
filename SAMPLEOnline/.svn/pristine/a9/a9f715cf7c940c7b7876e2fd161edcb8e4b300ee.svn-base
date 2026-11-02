/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 해지율 > 부가정보 > 그래프팝업
 * @설명: 해지율 부가정보 그래프팝업 JS
 * @최초작성자: 박세라
 * @최초작성일: 2021. 11. 03.
 * @최종변경일: 
 * @개정이력: 
 *  2021. 11. 03. 최초작성
 */

var gChart;
//조회구분
var gCondDiv = "1";
//라벨
var gArrLabels = [];
//그리드
var gGridDiv = "1";
//BE받아오기
var gAplcBe = 2020;
// gCondHichyCheck
var gCondHichyCheck = ["BE_BLK_SC_CD","BE_CHNL_SC_CD","BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD"]

$(document).ready(function(){

    gCondDiv = window.opener.popupOption.sbxDiv;
    gAplcBe = window.opener.popupOption.aplcBe;
    
    //공통코드선언
    initCommCd();
    
    //이벤트선언
    initEvent();
    
    //초기 그래프세팅
    drawAdtnInfoGrp();
});

/**
 * @설명: 콤보박스 초기화
 * @최초작성자: 박세라
 * @최초작성일: 2021. 11. 03.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2021. 11. 03. 최초작성
 */
function initCommCd() {
    // 공통코드 조회(BLOCK구분코드,유무배당구분코드)
    $.fn.loadCommonCode(gCondHichyCheck);
    
    //콤보박스 세팅   
    if(gCondHichyCheck.length >= 2) {
        //선택한 하이라키갯수 - 1개의 콤보박스 생성
        for(var i=0; i<gCondHichyCheck.length-1; i++) {
            var newCdList = [];
            var tmpCdList = $._commonObj["code"][gCondHichyCheck[i]];
            
            for (var j=0; j<tmpCdList.length; j++) {
                var tmpCd = tmpCdList[j];
                if(tmpCd.code.indexOf('Z') == -1) {
                    var newCd = {
                            "code" : tmpCd.code,
                            "codeNm" : tmpCd.codeAbbrNm
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
    
    //parent 조회기준
    if(gCondDiv == "1") {
        $("#div_beBlkScCd").show();
        $("#div_beFpayYnScCd").show();
        $("#div_beChnlScCd").show();
        $("#div_gridDiv").hide();
    } else {
        $("#div_beBlkScCd").hide();
        $("#div_beFpayYnScCd").hide();
        $("#div_beChnlScCd").hide();
        $("#div_gridDiv").show();
    }
    
    if(gCondDiv == "2" || gCondDiv == "3") {
        gArrLabels = [[(gAplcBe-4)+"년도"], [(gAplcBe-3)+"년도"], [(gAplcBe-2)+"년도"], [(gAplcBe-1)+"년도"], [(gAplcBe*1)+"년도"]];
    } else if(gCondDiv == "4") {
        gArrLabels = [];
        for(var i=1; i<=36; i++) {
            gArrLabels.push(i+"차월");
        }
    } else {
        gArrLabels = [];
        for(var i=0; i<3; i++) {
            var text = "";
            if(i==0) {
                text = gAplcBe+"BE";
            } else if(i==1) {
                text = (gAplcBe-1)+"BE";
            } else {
                text = "difference"
            }
            for(var j=1; j<=12; j++) {
                gArrLabels.push(text+j+"차년도");
            }
        }
    }
    
}

/**
 * @설명: event 초기화
 * @최초작성자: 박세라
 * @최초작성일: 2021. 11. 03.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2021. 11. 03. 최초작성
 */
function initEvent() {

    //그리드구분 콤보박스 이벤트
    $("#sbx_gridDiv").on("change", function(e) {
        gGridDiv = $("#sbx_gridDiv").val();
        drawAdtnInfoGrp();
    });
    
    //block유형 구분 (OLD_BLOCK:2, NEW_BLOCK:1)
    $("#sbx_beBlkScCd").on("change", function(e) {
        var beBlkScCd = $("#sbx_beBlkScCd").val();
        var beFpayYnScCd = $("#sbx_beFpayYnScCd").val();
        var beChnlScCd = $("#sbx_beChnlScCd").val();
        drawAdtnInfoGrp(beBlkScCd, beFpayYnScCd, beChnlScCd);
    });
    
    $("#sbx_beFpayYnScCd").on("change", function(e) {
        var beBlkScCd = $("#sbx_beBlkScCd").val();
        var beFpayYnScCd = $("#sbx_beFpayYnScCd").val();
        var beChnlScCd = $("#sbx_beChnlScCd").val();
        drawAdtnInfoGrp(beBlkScCd, beFpayYnScCd, beChnlScCd);
    });
    
    $("#sbx_beChnlScCd").on("change", function(e) {
        var beBlkScCd = $("#sbx_beBlkScCd").val();
        var beFpayYnScCd = $("#sbx_beFpayYnScCd").val();
        var beChnlScCd = $("#sbx_beChnlScCd").val();
        drawAdtnInfoGrp(beBlkScCd, beFpayYnScCd, beChnlScCd);
    });
}

/**
 * @설명: 그래프 데이터 세팅 및 그래프 화면 출력
 * @최초작성자: 박세라
 * @최초작성일: 2021. 11. 03.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  2021. 11. 03. 최초작성
 */
function drawAdtnInfoGrp(hierarchyVal1, hierarchyVal2, hierarchyVal3) {
    console.log("drawAdtnInfoGrp!!");
    //메인창 그리드 데이터, 필드
    var arrData =[];
    var arrField = [];
    // Driver그리드
    if(gGridDiv == "2") {
        arrData = window.opener.popupOption.gridData2;
        arrField = window.opener.popupOption.gridField2;
    } else {
        arrData = window.opener.popupOption.gridData1;
        arrField = window.opener.popupOption.gridField1;
    }
    
    //하이라키별 데이터 세팅
    var grpArrData = [];
    if(hierarchyVal1 != undefined || hierarchyVal1 != null) {
        for(var i=0; i<arrData.length; i++) {
            if(arrData[i]["beBlkScCd"] == hierarchyVal1) {
                grpArrData.push(arrData[i]);
            }
        }
    } else if(hierarchyVal2 != undefined || hierarchyVal2 != null) {
        for(var i=0; i<arrData.length; i++) {
            if(arrData[i]["beFpayYnScCd"] == hierarchyVal2) {
                grpArrData.push(arrData[i]);
            }
        }
    } else if(hierarchyVal3 != undefined || hierarchyVal3 != null) {
        for(var i=0; i<arrData.length; i++) {
            if(arrData[i]["beChnlScCd"] == hierarchyVal3) {
                grpArrData.push(arrData[i]);
            }
        }
    } else {
        grpArrData = arrData;
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
                                } else {
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

            var beBlkScCd = $("#sbx_beBlkScCd option:selected").text();
            var beFpayYnScCd = $("#sbx_beFpayYnScCd option:selected").text();
            var beChnlScCd = $("#sbx_beChnlScCd option:selected").text();
            for(var i=0; i<arrGrpData.length; i++) {
                var objDataset = {};
                //parent 조회구분
                if(gCondDiv == "1") {
                    if (arrGrpData[i]["Block"] == beBlkScCd) {
                        if (arrGrpData[i]["납입상태"] == beFpayYnScCd) {
                            if (arrGrpData[i]["채널유형"] == beChnlScCd) {
                                objDataset["label"] = arrGrpData[i]["상품유형"];
                                var arr =[];
                                for(var j=0; j<gArrLabels.length; j++) {
                                    arr.push(arrGrpData[i][gArrLabels[j]]);
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
                } else if(gCondDiv == "2") {
                    objDataset["label"] = arrGrpData[i]["채널유형"];
                    objDataset["data"]= [arrGrpData[i][(gAplcBe-4)+"년도"], arrGrpData[i][(gAplcBe-3)+"년도"], arrGrpData[i][(gAplcBe-2)+"년도"], arrGrpData[i][(gAplcBe-1)+"년도"], arrGrpData[i][(gAplcBe*1)+"년도"]];
                } else if (gCondDiv == "3") {
                    objDataset["label"] = arrGrpData[i]["상품유형"];
                    objDataset["data"]= [arrGrpData[i][(gAplcBe-4)+"년도"], arrGrpData[i][(gAplcBe-3)+"년도"], arrGrpData[i][(gAplcBe-2)+"년도"], arrGrpData[i][(gAplcBe-1)+"년도"], arrGrpData[i][(gAplcBe*1)+"년도"]];
                } else {
                    if(gGridDiv == "1") {
                        objDataset["label"] = arrGrpData[i]["상품유형"];
                        var arr = [];
                        for(var j=0; j<gArrLabels.length; j++) {
                            console.log(j,"번쨰?",arrGrpData[i][gArrLabels[j]]);
                            arr.push(arrGrpData[i][gArrLabels[j]])
                        }
                        objDataset["data"] = arr;
                    } else {
                        if (arrGrpData[i]["채널유형"] == beChnlScCd) {
                            objDataset["label"] = arrGrpData[i]["상품유형"];
                            var arr =[];
                            for(var j=0; j<gArrLabels.length; j++) {
                                arr.push(arrGrpData[i][gArrLabels[j]]);
                            }
                            objDataset["data"] = arr;
                        } else {
                            continue;
                        }
                    }
                }
                
                objDataset["lineTension"] = 0;
                objDataset["backgroundColor"] = arrBackgroundColor[i%17];
                objDataset["borderColor"] = arrBorderColor[i%17];
                objDataset["borderWidth"] = 1;
                
                arrDatasets.push(objDataset);
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
                type: "bar",
                //type: "line",
                data:{
                    //1차월,2차월,... 등
                    labels: gArrLabels,
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
                            text: "해지율 부가정보 그래프"
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
 * @최초작성자: 이준용
 * @최초작성일: 2021. 10. 18
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  이준용 2021. 10. 18 최초작성
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