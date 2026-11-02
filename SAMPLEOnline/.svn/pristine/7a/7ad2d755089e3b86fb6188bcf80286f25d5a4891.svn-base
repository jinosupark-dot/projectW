/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 거버넌스 - 진행현황
 * @설명: 거버넌스 - 진행현황 화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 8. 31.
 * @최종변경일: 
 * @개정이력: 
 *  2021. 8. 31. 최초작성
 */

//전역변수
var gSrchYn = "N";
var gReqCmpltYmd = "";
var gAplcBeList = [];
var gAssScCdList = [];
var gUsrInfo;
var gLoginInfo;
var gSgOrgCd = "";
var gSgOrgNm = "";
var gCopInfo;

$(document).ready(function(){
    
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //로그인정보
    loadUserInfo();
    
    //event 초기화
    initEvent();
    
    //그리드 초기화
    initGrid();
});

function loadUserInfo() {
    $.callAjax({}, "/be/gv/begv141m/getUsrGvRole.do").done(function(data) {
    	gUsrInfo = data.usrInfoList;
		gLoginInfo = data.loginInfo;
		gCopInfo = data.copInfo;
		
		$("#btn_div").hide();
		//접속 사용자 권한
		for(var i=0; i<gUsrInfo.length; i++){
			if (gUsrInfo[i].copCd == "01" || gUsrInfo[i].copCd == "02" || gUsrInfo[i].copCd == "03"){
				$("#btn_div").show();
		    }
		}
		//선계 확인
		for (var j=0; j<gCopInfo.length; j++){
			if (gCopInfo[j].copCd == "03" ) {
				gSgOrgCd = gCopInfo[j].chrgeOrgNo;
				gSgOrgNm = gCopInfo[j].chrgeOrgAliasNm;
			}
		}
    }).fail(function(data){
        $.fn.msgBox("사용자정보 조회가 실패했습니다.");
    });
}


function initCommCd() {
    
    // 공통코드 조회(가정종류)
    $.fn.loadCommonCode(["ASS_SC_CD"]);

    // 적용BE 리스트 담기
	$.fn.getAplcBe("sbx_aplcBe", 'GV');
}


function initEvent() {
    $("#btn_reqYmd").on("click", function(e){
        $('#ibx_reqYmd').datepicker('show');
    });
    
    $("#btn_search").on("click", function(e){
        gSrchYn = "Y";
        selectPrgPnstaList();
    });
    
    $("#btn_addData").on("click", function(e){
    	if (gSrchYn == "N") {
        	$.fn.msgBox("조회후 사용 가능합니다.");
            return;
        }
        openAddPopup();
    });
    
    $("#sbx_aplcBe").on("change", function(){    
    	gSrchYn = "N";
    	$("#gridDivPrgPnsta").jsGrid("reset");
    	$("#gridDivPrgPnsta").jsGrid("destroy");
    	initGrid();
    });
}

function initGrid() {
    
    //코드값 커스터마이징
    var codeDataList = [];
    var tmpCodeDataList = $._commonObj["code"]["ASS_SC_CD"];
    for(var i=0; i<tmpCodeDataList.length; i++) {
        var tmpCode = tmpCodeDataList[i];
        var newCode = {
                "code": tmpCode.code,
                "codeNm":tmpCode.codeNm+"가정"
        }
        codeDataList.push(newCode);
    }
    
    var aprvYn = "N";
    // jsGrid 빈 테이블 생성
    var gridObject = new ComJsGrid({
        id: "gridDivPrgPnsta",
        height: 600,
        editing: false,
        sorting: false,
        paging: false,
        selectHiglight:true,
        fields : [
            { name: "aplcBeNm"     , title:"적용BE"  , css:"cell", type: "text", width: 100, editing: false, align:"center", visible: false},
            { name: "assScCd"     , title:"가정종류"  , css:"cell", type: "text", width: 100, editing: false, align:"center", visible: false},
            { name: "assScCd"      , title:"가정명"  , css:"cell", type: "select", width: 100, editing: false, align:"center"
                , items: codeDataList, textField: "codeNm", valueField: "code"

            },
            { name: "itmSeq"     , title:"시퀀스"  , css:"cell", type: "text", width: 100, editing: false, align:"center", visible: false},
            { name: "orgCd"        , title:"부서코드"      , css:"cell", type: "text", width: 70, editing: false, align:"center", visible: false},
            { name: "orgNm"        , title:"부서명"      , css:"cell", type: "text", width: 70, editing: false, align:"center"},
            { name: "pesnNo"       , title:"사원번호"      , css:"cell", type: "text", width: 70, editing: false, align:"center", visible: false},
            { name: "userNm"       , title:"사원명"      , css:"cell", type: "text", width: 70, editing: false, align:"center", visible: false},
            { name: "userDutyNm"   , title:"사원명"      , css:"cell", type: "text", width: 70, editing: false, align:"center"},
            { name: "reqYmd"       , title:"요청완료일자"    , css:"cell", type: "text", width: 70, editing: false, align:"center", itemTemplate:function(value, item) {
                return $.fn.dateFormat(value, "-");         
            }},
            { name: "cmpltParngYmd", title:"완료일자(예정완료일자)", css:"cell", type: "text", width: 70, editing: false, align:"center", itemTemplate:function(value, item) {
                return $.fn.dateFormat(value, "-");         
            }},
            { name: "reqYmdStat"   , title:"요청일자현황", css:"cell", type: "text", width: 70, editing: false, align:"center",
                itemTemplate:function(value, item){
                    const $progressbar = $("<div id='progressbar" + item.itmSeq + "'>");
                    return $("<div style='display:inline-block; width: 150px;'>").append($progressbar.progressbar({ value: 100 }));                   
                }
            },
            { name: "cmpltYn"     , title:"완료여부"  , css:"cell", type: "text", width: 100, editing: false, align:"center", visible: false},
            { name: "dtlPop"       , title:"상세팝업"    , css:"cell", type: "text", width: 35, editing: false, align:"center",
                itemTemplate:function(value, item){
                	for(var i=0; i<gUsrInfo.length; i++){
            			if (gUsrInfo[i].usrGbn == "01" || gUsrInfo[i].usrGbn == "02" || gUsrInfo[i].usrGbn == "03"){
            				aprvYn = "Y";
            		    } 
            		}
                	
            		if (aprvYn == "Y"){
            			const btnFinPopup = $("<button class='grid_inbtn_s'>").text("수정")
            			var $pFinEl2 = $("<p>").addClass("fr");
            			var $aFinEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
            				// 배치실행 내역 조회팝업호출
            				openModPopup(item);
            			});
            			$aFinEl.append(btnFinPopup);
            			
            			return $("<div style='display:inline-block;'>").append($pFinEl2.append($aFinEl));
            		}
                }
            }
            
        ]
    }); 

    //그리드 생성
    gridObject.gridCreate();
}

function selectPrgPnstaList(){
    var reqParam = {
        "aplcBe": $("#sbx_aplcBe").val()
    };
    $.callAjax(reqParam, "/be/gv/begv121m/selectPrgPnstaList.do")
        .done(function(data) {
            
            var prgPnstaList = data.prgPnstaList;
            
            $("#gridDivPrgPnsta").jsGrid("reset");
            $("#gridDivPrgPnsta").jsGrid("loadData", prgPnstaList).done(function() {
                if(prgPnstaList.length == 0){
                    $.fn.getReturnValue("gridDivPrgPnsta");
                }else {
                    for(var i=0; i<prgPnstaList.length; i++) {
                        gAssScCdList.push(prgPnstaList[i].assScCd);
                        
                        for(var i=0; i<prgPnstaList.length; i++) {
                            var $prgbar = $("#progressbar" + prgPnstaList[i].itmSeq + " > div");
                            var sysYmdStat = prgPnstaList[i].sysYmdStat;
                            var cmpltYn = prgPnstaList[i].cmpltYn;
                            if(sysYmdStat == 1) {
                                $prgbar.css({"background": "#1DDB16"});
                            }else if(sysYmdStat == 2) {
                                $prgbar.css({"background": "#FFE400"});
                            }else if(sysYmdStat == 3) {
                                $prgbar.css({"background": "#F00000"});
                            }else {
                                $prgbar.css({"background": "#0100FF"});
                            }
                        }
                    }
                }
            });
        }).fail(function(data){
            $.fn.msgBox("목록 조회가 실패했습니다.");
    });
            
}

/**
 * @설명: 기초데이터검토 등록을 위한 팝업을 호출한다.
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일: 
 * @매개변수: rowItem 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021.08.26 최초작성
 */
var popupOption = null;
function openAddPopup() {
    popupOption = {
        url: "/be/gv/begv121p.do",
        name: "기초데이터검토 상세 팝업",
        width: 700,
        height: 640,    
        stts : "N",
        userInfo: gUsrInfo,
        loginInfo: gLoginInfo,
        sgOrgCd: gSgOrgCd,
        sgOrgNm: gSgOrgNm,
        aplcBe: $("#sbx_aplcBe").val(),
        aplcBeList: gAplcBeList,
        arrAss: gAssScCdList
    }

    $.fn.openPopup(popupOption);
}

/**
 * @설명: 기초데이터검토 등록을 위한 팝업 콜백
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021.08.26 최초작성
 */
function openAddPopup_callback(resultObj) {
    selectPrgPnstaList();
}

/**
 * @설명: 기초데이터검토 수정을 위한 팝업을 호출한다.
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일: 
 * @매개변수: rowItem 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021.08.26 최초작성
 */
function openModPopup(item) {
    popupOption = {
            url: "/be/gv/begv121p.do",
            name: "기초데이터검토 상세 팝업",
            width: 700,
            height: 940,
            stts: "E",
            userInfo: gUsrInfo,
            loginInfo: gLoginInfo,
            sgOrgCd: gSgOrgCd,
            sgOrgNm: gSgOrgNm,
            item: item
    }

    $.fn.openPopup(popupOption);
}

/**
 * @설명: 기초데이터검토 수정을 위한 팝업 콜백
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021.08.26 최초작성
 */
function openModPopup_callback(resultObj) {
    selectPrgPnstaList();
}


/**
 * @설명: 팝업창으로 보낼 param 세팅
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021.08.26 최초작성
 */
function getParamVal() {
    
}
