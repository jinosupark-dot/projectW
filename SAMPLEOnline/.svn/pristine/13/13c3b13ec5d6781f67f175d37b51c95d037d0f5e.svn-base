/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 거버넌스 - 기초데이터검토 팝업
 * @설명: 거버넌스 - 기초데이터검토 팝업화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 09.
 * @최종변경일: 
 * @개정이력: 
 *  2021. 9. 09. 최초작성
 *  2023. 3. 09. 수정 - CROS이슈관련 주석처리
 */

//전역변수
var gSrchYn = "N";
//결재자 수정여부 N:main,pop 동일 / Y:main,pop 다름
var gDiv = "N";
var gObjParam = {};

var gUserInfo = {};

$(document).ready(function(){
    
    $("#imgToolTip").attr("title", parent.viewPath);
    //$($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]"); // CROS이슈 주석처리 - 20230309
    
    gObjParam = opener.popupOption;
    
    //로그인정보로드
    loadUserInfo();
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //그리드 초기화
    initGrid();
    
    //파라메터세팅
    initParamData();
    
});

function loadUserInfo() {
    
    $.callAjax({}, "/main/selectSystemInfo.do").done(function(data) {
        
        gUserInfo = data.userInfo;
    }).fail(function(data){
        $.fn.msgBox("사용자정보 조회가 실패했습니다.");
    });
}


function initCommCd() {
    $.fn.loadCommonCode(["DUTY_CD", "GVNC_TRT_STAT_CD"]);
    $.fn.renderCombobox({
        codeArr: ["GVNC_TRT_STAT_CD"],
        selArr: ["sbx_gvncRvwRsltScCdPop"],
        useFirstOption: false		//첫번째 option 사용여부
    });
}

/**
 * @설명: opner화면에서 가져온 파라미터 세팅
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function initParamData() {

    //메인화면에서 선택한 적용BE 세팅
    var $oEl = $("<option>").attr("value", gObjParam.aplcBe).text(gObjParam.aplcBe);
    $("#sbx_aplcBe").append($oEl);
    
    var sancList = gObjParam.sancList;
    //메인화면의 결재리스트 세팅
    $("#gridDivSancrList").jsGrid("loadData", sancList).done(function() {
    
    });
    if(sancList.length > 0) {
        $("#ibx_title").val(gObjParam.sancList[0].rvwCntnt01);
        $("#tar_cont").val(gObjParam.sancList[0].rvwCntnt02);
        $("#lb_cont").text(getByteB($("#tar_cont").val()));
    }
}

/**
 * @설명: 이벤트 세팅
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function initEvent() {
    
    //담당자 검색 팝업창
    $("#btn_trtrSearch").on("click", function(e){
        callPopupUserSearch();
    });
    
    //결재자추가 버튼클릭
    $("#btn_sancrAdd").on("click", function(e){
        var reqDutyCd = $("#ibx_dutyCd").val();
        var reqPesnNo = $("#ibx_trtr").val();
        var reqPesnNm = $("#ibx_trtrNm").val();
        var reqGvStatCd = $("#sbx_gvncRvwRsltScCdPop option:selected").val();
        
        console.log("chk ", reqGvStatCd);
        
        if($.fn.isEmpty(reqDutyCd) || $.fn.isEmpty(reqPesnNo) || $.fn.isEmpty(reqPesnNm)) {
            $.fn.msgBox("담당자를 입력해주세요.");
            return false;
        }
        
        var sancrList = $("#gridDivSancrList").jsGrid("option", "data");
        for(var i=0; i<sancrList.length; i++) {
            if(sancrList[i].pesnNo == reqPesnNo) {
                $.fn.msgBox("이미 추가된 담당자 입니다.");
                return false;
            }
        }
        /* ie es6 지원X
        if(sancrList.findIndex(i => i.pesnNo == reqPesnNo) > -1) {
            $.fn.msgBox("이미 추가된 담당자 입니다.");
            return false;
        }
        */
        
        var item = {
            "dutyCd": reqDutyCd,
            "pesnNo": reqPesnNo,
            "pesnNm": reqPesnNm,
            "gvStatCd" : reqGvStatCd
        };
        
        addGridData(item);
    });
    
    //내용입력 textarea 키입력 이벤트
    $("#tar_cont").on("keydown", function(e){
        $("#lb_cont").text(getByteB($("#tar_cont").val()));
    });
    
    //승인 이벤트
    $("#btn_aprove").on("click", function(e){
        var reqParam = getInputData();

        $.fn.msgBox("승인하시겠습니까?", function(obj){
            if (obj.btn_ok) {
                opener.openModPopup_callback(reqParam);
                window.close();
            }
        }, 2);
    });
    
    //저장버튼 이벤트
    $("#btn_save").on("click", function(e){
        if($("#gridDivSancrList").jsGrid("option", "data").length < 5) {
            $.fn.msgBox("기안자, 1차승인자, 합의자(2), 최종승인자 순서로 5명 모두 등록해주세요.");
            return false;
        } else if($("#gridDivSancrList").jsGrid("option", "data").length > 5) {
            $.fn.msgBox("결재단계는 5명까지 등록 가능합니다.");
            return false;
        }
        var reqParam = getInputData();      
        console.log(reqParam);
        if(reqParam != false) {
            //결재자 수정
            if(gDiv == "Y") {
                $.fn.msgBox("데이터를 저장하시겠습니까?\n기존 결재과정이 초기화됩니다.", function (obj) {
                    if (obj.btn_ok) {
                        //의견등 입력정보 저장
                        $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/gv/begv151p/saveSancList.do")
                        .done(function(data) {
                            
                            if(data.result >= 1) {
                                $.fn.msgBox("정상적으로 처리되었습니다.", function(){
                                    opener.openAddPopup_callback(reqParam);
                                    window.close();
                                });
                            }else if(data.result == 0){
                                $.fn.msgBox("변경된 사항이 없습니다.");
                            }else {
                                $.fn.msgBox("데이터 저장이 실패했습니다.");
                            }
                        }).fail(function(data){
                            $.fn.msgBox("데이터 저장이 실패했습니다.");
                        });
                    }
                }, 2);
            }
            //타이틀 및 내용만 수정
            else {
                mainList = opener.gSancList;
                $.fn.msgBox("데이터를 저장하시겠습니까?", function (obj) {
                    if (obj.btn_ok) {
                        //의견등 입력정보 저장
                        
                        if(mainList.length == 0) {
                            reqParam["div"] = "add";
                        }else {
                            reqParam["div"] = "mod";
                        }
                        $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/gv/begv151p/saveRvwCntnt.do")
                        .done(function(data) {
                            
                            if(data.result >= 1) {
                                $.fn.msgBox("정상적으로 처리되었습니다.", function(){
                                    opener.openAddPopup_callback(reqParam);
                                    window.close();
                                });
                            }else if(data.result == 0){
                                $.fn.msgBox("변경된 사항이 없습니다.");
                            }else {
                                $.fn.msgBox("데이터 저장이 실패했습니다.");
                            }
                        }).fail(function(data){
                            $.fn.msgBox("데이터 저장이 실패했습니다.");
                        });
                    }
                }, 2);
            }
        }
    });
    
    //팝업창 닫기
    $("#btn_closePopup").on("click", function(e){
        opener.openAddPopup_callback();
        window.close();
    });
}

function initGrid() {
    // jsGrid 빈 테이블 생성
	var gvncTrtStatCdArr = $.fn.getGridCodeItem("GVNC_TRT_STAT_CD");
    var sancrGridObject = new ComJsGrid({
        id: "gridDivSancrList",
        height: 150,
        editing: false,
        sorting: false,
        paging: false,
        selectHiglight:true,
        controller : {
            
            insertItem : function(item) {
                
                opener.selectSancList();
            },
            deleteItem : function(item) {
                
                opener.selectSancList();
            }
        },

        fields : [
            
            { name: "seq"       , title:"순서"    , css:"cell", type: "text", width: 15, editing: false, align:"center"},
            { name: "dutyCd", title:"직급", css:"cell", type: "select", width: 30, editing: false, align:"center", 
                items: $.fn.getGridCodeItem("DUTY_CD"), textField: "codeNm", valueField: "code"
            },
            { name: "pesnNo"   , title:"인사번호"    , css:"cell", type: "text", width: 50, editing: false, align:"center", visible:false},
            { name: "pesnNm"   , title:"성명"    , css:"cell", type: "text", width: 50, editing: false, align:"center"},
            { name: "gvncTrtStatCd"   , title:"구분"  , css:"cell", type: "select", width: 50, editing: true, align:"center",
            	items: $.fn.getGridCodeItem("GVNC_TRT_STAT_CD"), textField: "codeNm", valueField: "code"
            },
            { name: "delete"       , title:""    , css:"cell", type: "text", width: 15, editing: false, align:"center",
                itemTemplate:function(value, item){
                    var status = item.status;
                    const btnFinPopup = $("<button class='btn_grid_delete'>")
                    var $pFinEl2 = $("<p>").addClass("fr");
                    var $aFinEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
                        
                        $("#gridDivSancrList").jsGrid("deleteItem", item);
                    });
                    
                    $aFinEl.append(btnFinPopup);
                    
                    return $("<div style='display:inline-block;'>").append($pFinEl2.append($aFinEl));
                }
            }
            
        ]
    }); 
    
    //그리드 생성
    sancrGridObject.gridCreate();
}

/**
 * @설명: 입력값 세팅
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function getInputData() {
    opener.selectSancList();
    var obj = {};
    var arrSancr = [];
    
    var reqAplcBe = $("#sbx_aplcBe").val();
    var reqArrSancrList = $("#gridDivSancrList").jsGrid("option", "data");
    var reqRvwCntnt01 = $("#ibx_title").val();
    var reqRvwCntnt02 = $("#tar_cont").val();
    var reqGvStatCd = $("#sbx_gvncRvwRsltScCdPop option:selected").val();
    
    obj["aplcBe"] = reqAplcBe;
    for(var i=0; i<reqArrSancrList.length; i++) {
        arrSancr.push(reqArrSancrList[i]);
        
    }
    obj["sancrList"] = arrSancr;
    obj["gvStatCd"] = reqGvStatCd;
    obj["rvwCntnt01"] = reqRvwCntnt01;
    obj["rvwCntnt02"] = reqRvwCntnt02;
    obj["userEno"] = gObjParam.loginInfo.loginId;
    obj["mLength"] = opener.gSancList.length;
    
    if($.fn.isEmpty(reqAplcBe)) {
        $.fn.msgBox("적용BE"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if(reqArrSancrList == 0) {
        $.fn.msgBox("결재자"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if(reqGvStatCd == 0) {
        $.fn.msgBox("결재구분값 "  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if($.fn.isEmpty(reqRvwCntnt01)) {
        $.fn.msgBox("Title"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if($.fn.isEmpty(reqRvwCntnt02)) {
        $.fn.msgBox("내용"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    
    //메인 화면과 팝업창의 결재리스트 비교
    var arrM = [];
    for(var i=0; i<opener.gSancList.length; i++) {
        
        arrM.push({"pesnNo": opener.gSancList[i].pesnNo});
    }
    
    var arrP = [];
    for(var i=0; i<reqArrSancrList.length; i++) {
        
        arrP.push({"pesnNo": reqArrSancrList[i].pesnNo});
    }

    if(!arrM.equals(arrP)) {
        gDiv = "Y";
    }
    return obj;

}

function addGridData(item) {
    var dataList = $("#gridDivSancrList").jsGrid("option", "data");
    
    if(dataList.length == 0) {
        $("#gridDivSancrList").jsGrid("loadData", dataList).done(function(result) {
        });
    }

    $("#gridDivSancrList").jsGrid("insertItem", 
        {
          "dutyCd": item.dutyCd,
          "pesnNo": item.pesnNo,
          "pesnNm": item.pesnNm,
          "seq": dataList.length+1,
          "gvncTrtStatCd": item.gvStatCd
        }
    );
    
    $("#ibx_orgNm").val('');
    $("#ibx_orgCd").val('');
    $("#ibx_trtr").val('');
    $("#ibx_trtrNm").val('');


}


/**
 * @설명: 사원검색 팝업을 호출한다.
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 임국빈 2021.08.26 최초작성
 */
var roleGrideType="user";
function callPopupUserSearch() {
    var popupOption = {
            url: "/mg/sy/mgsy211p.do",
            name: "사원번호조회팝업",
            width: 800,
            height: 464
    }
    var popup = $.fn.openPopup(popupOption);
}

/**
 * @설명: 사원조회 팝업 콜백
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 임국빈 2021.08.26 최초작성
 */
function resultUserPopup_callback(resultObj){
    console.log("resultTablePopup_callback   resultObj", JSON.stringify(resultObj));

    $("#ibx_trtr").val(resultObj.userEno);
    $("#ibx_trtrNm").val(resultObj.userNm);
    $("#ibx_orgCd").val(resultObj.orgNo);
    $("#ibx_orgNm").val(resultObj.orgNm);
    $("#ibx_dutyCd").val(resultObj.dutyId);
}

/**
 * @설명: 의견 입력시 byte 계산
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function getByteB(str) {
    var byte = 0;
    for(var i=0; i<str.length; ++i) {
        
        if(str.charCodeAt(i) > 127) {
            byte += 3;
        }else {
            byte++;
        }
    }
    return byte;
}