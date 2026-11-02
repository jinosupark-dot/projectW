/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 거버넌스 - 기초데이터검토
 * @설명: 거버넌스 - 기초데이터검토 화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 8. 18.
 * @최종변경일: 
 * @개정이력: 
 *  2021. 8. 18. 최초작성
 */

//전역변수
var gSrchYn = "N";
var gUsrInfo;
var gLoginInfo;
var gSgOrgCd;
var gSgOrgNm;
var gCopInfo;

$(document).ready(function(){
    
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //로그인정보로드
    loadUserInfo();
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //타이틀 초기화
    initText();
    
    //그리드 초기화
    initGrid();
    
    //버튼권한처리
    initBtn();
    
});

function initBtn() {
	/* 2021.06.16 버튼권한처리 */
    // 등록, 직전년도Data가져오기, 그리드 수정 버튼
    var btnIdArr = ["btn_addData", "btn_addDataPrev", "btn_Edit"];
	var permArr = [];
	for (var i = 0; i < btnIdArr.length; i++) {
		permArr.push({
			btnId : "#" + btnIdArr[i],
			type : "A"
		});
	}
    $.fn.setBtnPermission(permArr);
}

function loadUserInfo() {
    $.callAjax({}, "/be/gv/begv141m/getUsrGvRole.do")
	.done(function(data) {
		gUsrInfo = data.usrInfoList;
		gCopInfo = data.copInfo;
		gLoginInfo = data.loginInfo;
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
	initAssScCd($("#sbx_aplcBe").val());
}

function initAssScCd(aplcBe) {
	var reqParam = {"aplcBe" : aplcBe};
	var newCdList = [];
	if (reqParam != ''){
		$.callAjax(reqParam, "/beCmmn/selectAssScList.do")
	    .done(function(data) {
	    	if (data.rstList.length > 0){
	    		for (var j=0; j<data.rstList.length; j++) {
	                var tmpCd = data.rstList[j];
	                var newCd = {
	                        "code" : tmpCd.code,
	                        "codeNm" : tmpCd.codeNm
	                }
	                newCdList.push(newCd);
	            }
	            $._commonObj.code["ASS_SC_CD"] = newCdList;
	            
	            $.fn.renderCombobox({
	                codeArr: ["ASS_SC_CD"],
	                selArr: ["sbx_" + $.toCamel("ASS_SC_CD")],
	                useFirstOption: false       //첫번째 option 사용여부
	            });
	    	} else {
	    		$.fn.msgBox("해당 BE에 등록된 가정이 없습니다.");
	    	}
	    });
	}
}

function initView() {
	$("#gridDivPryDtRvw").jsGrid("reset");
	$("#gridDivPryDtRvw").jsGrid("destroy");
	initGrid();
	gSrchYn = "N";
}

function initEvent() {
    
    $("#sbx_aplcBe").on("change", function(e){
        initAssScCd($("#sbx_aplcBe").val());
        initView();
    });
    
    $("#sbx_assScCd").on("change", function(e){
        initView();
    });
    
    $("#btn_search").on("click", function(e){
        $("#be_title").text($("#sbx_assScCd option:selected").text());
        selectPryDtRvwList();
    });
    
    $("#btn_addData").on("click", function(e){
    	if (gSrchYn == "N") {
        	$.fn.msgBox("조회후 사용 가능합니다.");
            return;
        }
        openAddPopup();
    });
    
    $("#btn_addDataPrev").on("click", function(e){
    	if (gSrchYn == "N") {
        	$.fn.msgBox("조회후 사용 가능합니다.");
            return;
        }
    	
        if($("#gridDivPryDtRvw").jsGrid("option", "data").length > 0) {
            $.fn.msgBox("이미 존재하는 데이터가 있어 불러오기가 불가능합니다.");
            return;
        }
        
        var reqParam = {
                "aplcBe1": $("#sbx_aplcBe").val(),
                "assScCd": $("#sbx_assScCd").val(),
                "aplcBe2": ($("#sbx_aplcBe").val().substr(0,4)-1)+"BE"
        };
        $.fn.msgBox('선택하신 가정의 직전년도 데이터를 가져오시겠습니까?', function (obj) {
            if (obj.btn_ok) {
                $.callAjax(reqParam, "/be/gv/begv111m/insertSelectPryDtList.do")
                .done(function(data) {
                    var fin = data.pryDtRvwList;
                    if(fin.result > 0) {
                        $.fn.msgBox("완료되었습니다.");
                        selectPryDtRvwList();
                    }
                });
            }
        }, 2)
    });
}

function initText() {
    $("#be_title").text($("#sbx_assScCd option:selected").text());
}

function initGrid() {
    // jsGrid 빈 테이블 생성
	var aprvYn = "N";
    var gridObject = new ComJsGrid({
        id: "gridDivPryDtRvw",
        height: 600,
        editing: false,
        sorting: false,
        paging: false,
        selectHiglight:true,
        fields : [
            { name: "aplcBeNm"     , title:"적용BE"  , css:"cell", type: "text", width: 100, editing: false, align:"center", visible: false},
            { name: "assScCd"     , title:"가정종류"  , css:"cell", type: "text", width: 100, editing: false, align:"center", visible: false},
            { name: "itmSeq"     , title:"시퀀스"  , css:"cell", type: "text", width: 100, editing: false, align:"center", visible: false},
            { name: "dtDtlVal"     , title:"데이터상세값"  , css:"cell", type: "text", width: 100, editing: false, align:"center"},
            { name: "mesrCmpltYmd"  , title:"요청완료일자", css:"cell", type: "text", width: 70, editing: false, align:"center", itemTemplate:function(value, item) {
                return $.fn.dateFormat(value, "-");         
            }},
            { name: "orgCd"        , title:"부서코드"      , css:"cell", type: "text", width: 70, editing: false, align:"center", visible: false},
            { name: "orgNm"        , title:"부서명"      , css:"cell", type: "text", width: 70, editing: false, align:"center"},
            { name: "pesnNo"       , title:"사원번호"      , css:"cell", type: "text", width: 70, editing: false, align:"center", visible: false},
            { name: "userNm"       , title:"사원명"      , css:"cell", type: "text", width: 70, editing: false, align:"center", visible: false},
            { name: "userDutyNm"   , title:"사원명"      , css:"cell", type: "text", width: 70, editing: false, align:"center"},
            { name: "reqYmd"       , title:"요청일자"    , css:"cell", type: "text", width: 70, editing: false, align:"center", itemTemplate:function(value, item) {
                return $.fn.dateFormat(value, "-");         
            }},
            { name: "cmpltParngYmd", title:"완료일자(예정완료일자)", css:"cell", type: "text", width: 70, editing: false, align:"center", itemTemplate:function(value, item) {
                return $.fn.dateFormat(value, "-");         
            }},
            { name: "reqYmdStat"   , title:"요청일자현황", css:"cell", type: "text", width: 70, editing: false, align:"center",
                itemTemplate:function(value, item){
                    
                    const $progressbar = $("<div id='progressbar" + item.itmSeq + "'>");

                    var prgBarVal = $progressbar.find(".ui-progressbar-value");
                    prgBarVal.css({"background": "##FF0000"});
                    //$("#progressbar"+item.itmSeq).progressbar({ value: value*100 });
                    
                    return $("<div style='display:inline-block; width: 150px;'>").append($progressbar.progressbar({ value: value*100 }));
                    
                }
            },
            { name: "cmpltYn"     , title:"완료여부"  , css:"cell", type: "text", width: 100, editing: false, align:"center", visible: false},
            { name: "dtlPop"       , title:"상세팝업"    , css:"cell", type: "text", width: 35, editing: false, align:"center",
                itemTemplate:function(value, item){
            		for(var i=0; i<gUsrInfo.length; i++){
            			if (gUsrInfo[i].copCd == "01" || gUsrInfo[i].copCd == "02" || gUsrInfo[i].copCd == "03"){
            				aprvYn = "Y";
            		    } 
            		}
            		if (aprvYn == "Y"){
            			const btnFinPopup = $("<button class='grid_inbtn_s' id='btn_Edit'>").text("수정")
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

function selectPryDtRvwList(){

    var reqParam = {
        "aplcBe": $("#sbx_aplcBe").val(),
        "assScCd": $("#sbx_assScCd").val()
    };
    $.callAjax(reqParam, "/be/gv/begv111m/selectPryDtRvwList.do")
        .done(function(data) {
            
            var pryDtRvwList = data.pryDtRvwList;
            
            $("#gridDivPryDtRvw").jsGrid("reset");
            $("#gridDivPryDtRvw").jsGrid("loadData", pryDtRvwList).done(function() {
                if(pryDtRvwList.length == 0){
                    $.fn.getReturnValue("gridDivPryDtRvw");
                }else {
                    for(var i=0; i<pryDtRvwList.length; i++) {
                        var $prgbar = $("#progressbar" + pryDtRvwList[i].itmSeq + " > div");
                        var sysYmdStat = pryDtRvwList[i].sysYmdStat;
                        var cmpltYn = pryDtRvwList[i].cmpltYn;
                        if(sysYmdStat == 1) {
                            $prgbar.css({"background": "#1DDB16"});  //green
                        }else if(sysYmdStat == 2) {
                            $prgbar.css({"background": "#FFE400"});  //yellow
                        }else if(sysYmdStat == 3) {
                            $prgbar.css({"background": "#F00000"});  //red
                        }else if(sysYmdStat == 4) {
                            $prgbar.css({"background": "#0100FF"});  //blue
                        }else {
                            $prgbar.css({"background": "#1DDB16"});  //green
                        }
                    }
                     
                }
            });
            
            gSrchYn = "Y";
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
    var now = new Date();
    var year = now.getFullYear();
    var month = ('0' + now.getMonth() + 1).slice(-2);
    var day = ('0' + now.getDate()).slice(-2);
    var today = year + '-' + month + '-' + day;
    
    popupOption = {
        url: "/be/gv/begv111p.do",
        name: "기초데이터검토 등록 팝업",
        width: 700,
        height: 670,    
        userInfo: gUsrInfo,
        loginInfo: gLoginInfo,
        sgOrgCd: gSgOrgCd,
        sgOrgNm: gSgOrgNm,
        aplcBe: $("#sbx_aplcBe").val(),
        assScCd: $("#sbx_assScCd").val(),
        today: today
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

    selectPryDtRvwList();
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
            url: "/be/gv/begv111p.do",
            name: "기초데이터검토 상세 팝업",
            width: 700,
            height: 940,
            userInfo: gUsrInfo,
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

    selectPryDtRvwList();
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
