/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 연금전환율 - 기초데이터 > 그래프팝업
 * @설명: 연금전환율 - 기초데이터 화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 16.
 * @최종변경일: 
 * @개정이력: 
 *  2021. 9. 16. 최초작성
 */

var gChart;
var gCondHichyCheck = ["BE_NEW_LOB_CD"];
//그리드구분(기초율/분자/본모)
var gGridDiv = "1";

var gDriverDiv = "1";

var gColNm = [];

var gFinYm = [];

$(document).ready(function(){
    
    $("#div_driver").hide();
    //하이라키 세팅
    initHichy();
    
    //공통코드선언
    initCommCd();
    
    //이벤트선언
    initEvent();
        
    //초기 그래프세팅
    initGrp($("#sbx_finYm").val());
    
});

function initHichy() {
    //체크한 하이라키를 받아온다
    var finYmFrom = window.opener.popupOption.finYmFrom.replace("-","");
    var finYmTo = window.opener.popupOption.finYmTo.replace("-","");

    for(var i=finYmFrom; i<=finYmTo; i++) {
        var mm = i.toString().substring(4);
        var yy = i.toString().substring(0,4);
        if(mm == "13") {
            i = (parseInt(yy)+1) + "01";
        }
        gFinYm.push(i);
    }
    
    $.each(gFinYm, function(key, value){
        $("#sbx_finYm").append($("<option></option>").attr("value", value).text(value));
    });
    
    for(var i=0; i<gCondHichyCheck.length; i++) {
        gCondHichyCheck[i] = gCondHichyCheck[i].toUpperCase(); 
    }
}

function initCommCd() {
    
    // 공통코드 조회(상품유형,채널)
    $.fn.loadCommonCode(gCondHichyCheck[0]);

    //콤보박스 세팅   
    for(var i=0; i<gCondHichyCheck.length-1; i++) {
        var newCdList = [];
        var tmpCdList = $._commonObj["code"][gCondHichyCheck[i]];
        
        for (var j=0; j<tmpCdList.length; j++) {
            var tmpCd = tmpCdList[j];
            if(tmpCd.codeNm.indexOf('TOTAL') == -1) {
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
    gColNm = [];
    var codeList = $._commonObj["code"]["BE_NEW_LOB_CD"];
    for(var i=0; i<codeList.length; i++) {
        if(codeList[i]["codeAbbrNm"] != 'TOTAL') {
            gColNm.push(codeList[i]["codeAbbrNm"]);
        }
    }
}

function initEvent() {
    
    //그리드구분 콤보박스 이벤트
    $("#sbx_gridDiv").on("change", function(e) {
        gGridDiv = $("#sbx_gridDiv").val();
        if(gGridDiv == "1") {
            $("#div_driver").hide();
            $("#div_finYm").show();

            var codeList = $._commonObj["code"]["BE_NEW_LOB_CD"];
            gColNm = [];
            
            for(var i=0; i<codeList.length; i++) {
            	if(codeList[i]["codeAbbrNm"] != 'TOTAL') {
                    gColNm.push(codeList[i]["codeAbbrNm"]);
                }
            }
            initGrp($("#sbx_finYm").val());
        }else {
            gColNm = ["대상금액", "전환금액"];
            $("#div_finYm").hide();
            $("#div_driver").show();
            
            initGrp();
        }
        
    });
    
    //마감년도 콤보박스 이벤트
    $("#sbx_finYm").on("change", function(e) {
        initGrp($("#sbx_finYm").val());
    });
    
    //그리드구분 콤보박스 이벤트
    $("#sbx_driver").on("change", function(e) {
        gDriverDiv = $("#sbx_driver").val();
        if(gDriverDiv == "1") {
            gColNm = ["대상금액", "전환금액"];
        }else {
            gColNm = ["대상건수", "전환건수"];
        }
        initGrp();
    });

}

function initGrp(pFinYm) {
    //하이라키체크 2개이상된경우
    
    drawPryRatGrp(pFinYm);

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
    }else {
        arrData = window.opener.popupOption.gridData2;
        arrField = window.opener.popupOption.gridField2;
    }
    //하이라키별 데이터 세팅
    var grpArrData = [];
    if(hierarchyVal != undefined || hierarchyVal != null) {
        for(var i=0; i<arrData.length; i++) {
            if(arrData[i]["finYm"] == hierarchyVal) {
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
                                
                                if(typeof value[key] == "string" || kvalue == "합계(연금제외)" || kvalue == "TOTAL") {
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
            
            var vLabels = gColNm;
            var vType = "line";
            //chartjs dataset 세팅
            var arrDatasets = [];
            console.log("arrGrpData ?? ", arrGrpData);
            for(var i=0; i<arrGrpData.length; i++) {
                var objDataset = {};
                
                objDataset["data"] = [];
                for(var j=0; j<gColNm.length; j++) {
                    if(gColNm[j] != 'TOTAL') {
                        objDataset["data"].push(arrGrpData[i][gColNm[j]]);
                    }
                } 
                //하이라키 선택별 라벨 세팅
                if(gGridDiv == "1") {
                    //시작년월~종료년월
                    objDataset["label"] = arrGrpData[i]["마감년도"];
                    objDataset["backgroundColor"] = ["rgba(0,0,0,0)"]; //backgroundcolor : false
                }else {
                    vType = "bar";
                    //newLobCd
                    objDataset["label"] = arrGrpData[i]["상품유형"];
                    objDataset["backgroundColor"] = arrBackgroundColor[i];//["rgba(0,0,0,0)"]; //backgroundcolor : false

                }
                
                objDataset["lineTension"] = 0;
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
            var ctx = $("#anutCnvrRatGrp");
            
            //이전 차트 지우기
            if((gChart != undefined)) {
                gChart.destroy();
            }
            gChart = new Chart(ctx, {
                //type: "bar",
                type: vType,
                data:{
                    
                    //1차월,2차월,...
                    labels: vLabels,
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
                            text: "연금전환율 통계대상의 상품유형별_경과월별 비중(건수기준)"
                        }
                    },
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: 1
                            }
                        }]
                    }
                }
            });
        }
    };
    
    grpHandler.drawGrp(grpHandler.getGrpData());
}
