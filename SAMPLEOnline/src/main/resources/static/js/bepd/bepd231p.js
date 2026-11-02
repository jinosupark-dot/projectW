/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 중도인출율 - 기초데이터 > 그래프팝업
 * @설명: 중도인출율 - 기초데이터 화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 16.
 * @최종변경일: 
 * @개정이력: 
 *  2021. 9. 16. 최초작성
 */

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
        gCondHichyCheck[i] = gCondHichyCheck[i].toUpperCase(); 
    }

}

function initCommCd() {
    // 공통코드 조회(상품유형,채널)
    $.fn.loadCommonCode(gCondHichyCheck);
    
    //콤보박스 세팅   
    if(gCondHichyCheck.length >= 2) {
        //선택한 하이라키갯수 - 1개의 콤보박스 생성
        for(var i=0; i<gCondHichyCheck.length-1; i++) {
            var newCdList = [];
            var tmpCdList =  $._commonObj["code"][gCondHichyCheck[i]];

            for(var j=0; j<tmpCdList.length; j++) {
                var tmpCd = tmpCdList[j];

                if(tmpCd.code != 'ZZ' && tmpCd.code != 'Z') {
                    var newCd = {
                            "code" : tmpCd.code,
                            "codeNm" : tmpCd.codeNm,
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

function initEvent() {
    
    //그리드구분 콤보박스 이벤트
    $("#sbx_gridDiv").on("change", function(e) {
        gGridDiv = $("#sbx_gridDiv").val();
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
    var fpayYnScCdVal = $("#sbx_beFpayYnScCd").val();
    var beChnlScCdVal = $("#sbx_beChnlScCd").val();
    var arrParam = [];
    //하이라키체크 3개인경우
    if(gCondHichyCheck.length == 3) {
        arrParam.push(fpayYnScCdVal);
        arrParam.push(beChnlScCdVal);
    } 
    //하이라키체크 2개인경우
    else if (gCondHichyCheck.length == 2) {
        if(gCondHichyCheck.equals(["BE_FPAY_YN_SC_CD","BE_CHNL_SC_CD"])) {
            arrParam.push(fpayYnScCdVal);
            $("#div_beChnlScCd").remove();
        } else if(gCondHichyCheck.equals(["BE_FPAY_YN_SC_CD","BE_NEW_LOB_CD"])) {
            arrParam.push(fpayYnScCdVal);
            $("#div_beChnlScCd").remove();
        } else if(gCondHichyCheck.equals(["BE_CHNL_SC_CD","BE_NEW_LOB_CD"])) {
            arrParam.push(beChnlScCdVal);
            $("#div_beFpayYnScCd").remove();
        }
    }
    // 하이라키체크 1개인경우
    else {
        $("#div_beFpayYnScCd").remove();
        $("#div_beChnlScCd").remove();
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
                                
                                if(typeof value[key] == "string" || kvalue == "TOTAL" || kvalue == "TOTAL") {
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
                
                //하이라키 선택별 라벨 세팅
                var lstHichy = gCondHichyCheck[gCondHichyCheck.length-1];
                if(lstHichy == "BE_FPAY_YN_SC_CD") {
                    objDataset["label"] = arrGrpData[i]["납입상태"];
                } else if(lstHichy == "BE_CHNL_SC_CD") {
                    objDataset["label"] = arrGrpData[i]["채널유형"];
                }else {
                    objDataset["label"] = arrGrpData[i]["상품유형"];
                }
                
                objDataset["data"]= [arrGrpData[i]["1차년"], arrGrpData[i]["2차년"], arrGrpData[i]["3차년"], arrGrpData[i]["4차년"], arrGrpData[i]["5차년"], arrGrpData[i]["6차년"], arrGrpData[i]["7차년"], arrGrpData[i]["8차년"], arrGrpData[i]["9차년"], arrGrpData[i]["10차년"], arrGrpData[i]["11차년"], arrGrpData[i]["12+차년"]]; 
                
                objDataset["lineTension"] = 0;
                
                objDataset["backgroundColor"] = ["rgba(0,0,0,0)"]; //backgroundcolor : false
                
                objDataset["borderColor"] = arrBorderColor[i];
                arrDatasets.push(objDataset);
                
            }
            if(arrDatasets == null || arrDatasets.length == 0) {
                $.fn.msgBox("조회기준에 맞는 데이터가 없습니다.");
                gChart.destroy();
                return;
            }
            //그래프 그리기
            var ctx = $("#mdrotRatGrp");
            
            //이전 차트 지우기
            if((gChart != undefined)) {
                gChart.destroy();
            }
            gChart = new Chart(ctx, {
                //type: "bar",
                type: "line",
                data:{
                    
                    //1차년,2차년,...
                    labels: ["1차년","2차년","3차년","4차년","5차년","6차년","7차년","8차년","9차년","10차년","11차년","12차년+"],
                    //
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
                            text: "중도인출율 통계대상의 상품유형별_경과월별 비중(건수기준)"
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
