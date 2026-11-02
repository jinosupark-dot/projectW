/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 거버넌스 - 검토결과
 * @설명: 거버넌스 - 검토결과 화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021.09.01
 * @최종변경일: 
 * @개정이력: 
 *  2021.09.01 최초작성
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
    
    //로그인정보
    loadUserInfo();
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //타이틀 초기화
    initText();
    
    //그리드 초기화
    initGrid();
});

function initView() {
	$("#gridDivRvwRsltOpn").jsGrid("reset");
	$("#gridDivRvwRsltOpn").jsGrid("destroy");
	initGrid();
}

/**
 * @설명: 공통코드 세팅
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function initCommCd() {
    
    // 공통코드 조회(가정종류)
    $.fn.loadCommonCode(["ASS_SC_CD","GVNC_RVW_RSLT_SC_CD"]);
    
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
	    		console.log(data.rstList);
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
    loadUserInfo();
    
    $("#sbx_aplcBe").on("change", function(e){
        initAssScCd($("#sbx_aplcBe").val());
        initView();
    });
    
    $("#sbx_assScCd").on("change", function(e){
        initView();
    });
    
    $("#btn_search").on("click", function(e){
        $("#be_title").text($("#sbx_assScCd option:selected").text() + " 검토의견");
        selectRvwOpinList();
    });
    
    $("#btn_addData").on("click", function(e) {
    	if (gSrchYn == "N") {
        	$.fn.msgBox("조회후 사용 가능합니다.");
            return;
        }
        openAddPopup();
    });
    
    //검토결과승인 화면세팅
    $("#btn_rvwRsltAppr").on("click", function(e){
        //검토승인 페이지 이동
        $(top.document).find("[menuid='begv141m']")[0].click();
    });
    
    //검토결과의견 화면세팅
    $("#btn_rvwRsltOpn").on("click", function(e){
        
    });


}

/**
 * @설명: 가정별 title 가변 세팅
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function initText() {
    
    $("#be_title").text($("#sbx_assScCd option:selected").text() + " 검토의견");
}

/**
 * @설명: 그리드 세팅
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function initGrid() {
    // jsGrid 빈 테이블 생성
    var gridObjRvwRsltOpn = new ComJsGrid({
        id: "gridDivRvwRsltOpn",
        height: 600,
        //editing: false,
        sorting: false,
        paging: false,
        selectHiglight:true,
        fields : [
            { name: "aplcBeNm"     , title:"적용BE"  , css:"cell", type: "text", width: 0, editing: false, align:"center", visible: false},
            { name: "assScCd"     , title:"가정종류"  , css:"cell", type: "text", width: 0, editing: false, align:"center", visible: false},
            { name: "orgCd"        , title:"부서코드"      , css:"cell", type: "text", width: 0, editing: false, align:"center", visible: false},
            { name: "orgNm"        , title:"부서명"      , css:"cell", type: "text", width: 70, editing: false, align:"center"},
            { name: "rvwCntnt01"   , title:"검토의견"  , type: "text", width: 250, editing: false, align:"left"
                , itemTemplate:function(value, item) {
                    if(value!=null && value!='') {
                        return value.replaceAll("\n", "<br>");
                    } else {
                        return value;
                    }
            }},
            { name: "rvwCntnt02"   , title:"답변"     , type: "text", width: 200, editing: false, align:"left"
                 , itemTemplate:function(value, item) {
                     if(value!=null && value!='') {
                         return value.replaceAll("\n", "<br>");
                     } else {
                         return value;
                     }
            }},
            { name: "gvncRvwRsltScCd"    , title:"결과"    , css:"cell", type: "select", width: 70, editing: false, align:"center", items: $.fn.getGridCodeItem("GVNC_RVW_RSLT_SC_CD"), textField: "codeNm", valueField: "code"},
            { name: "dtlPop"       , title:"상세팝업"    , css:"cell", type: "text", width: 40, editing: false, align:"center",
                itemTemplate:function(value, item){
                	for(var i=0; i<gUsrInfo.length; i++){
            			if (gUsrInfo[i].copCd == "01" || gUsrInfo[i].copCd == "02" || gUsrInfo[i].copCd == "03"){
            				gUsrAprv = "Y";
            			}
            		}
                	if (gUsrAprv == "Y"){
                        const btnFinPopup = $("<button class='grid_inbtn_s'>").text("의견입력")
                        var $pFinEl2 = $("<p>").addClass("fr");
                        var $aFinEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
                            // 배치실행 내역 조회팝업호출
                            console.log(JSON.stringify(item));
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
    gridObjRvwRsltOpn.gridCreate();
    
}

/**
 * @설명: 그리드 조회
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function selectRvwOpinList(){

    var reqParam = {
        "aplcBe": $("#sbx_aplcBe").val(),
        "assScCd": $("#sbx_assScCd").val()  
    };

    $.callAjax(reqParam, "/be/gv/begv131m/selectRvwOpinList.do")
        .done(function(data) {
            var rvwRsltList = data.rvwRsltList;
            
            $("#gridDivRvwRsltOpn").jsGrid("reset");
            $("#gridDivRvwRsltOpn").jsGrid("option", "data", []);
            $("#gridDivRvwRsltOpn").jsGrid("destroy");
            initGrid();
            
            $("#gridDivRvwRsltOpn").jsGrid("loadData", rvwRsltList).done(function() {
                if(rvwRsltList.length == 0){
                    $.fn.getReturnValue("gridDivRvwRsltOpn");
                }
            });
            
            gSrchYn = "Y";
        }).fail(function(data){
            $.fn.msgBox("목록 조회가 실패했습니다.");
    });
            
}

function openAddPopup() {
    popupOption = {
            url: "/be/gv/begv131p.do",
            name: "검토결과 상세 팝업",
            width: 600,
            height: 700,
            param: {"aplcBeNm": $("#sbx_aplcBe").val()
                  ,"assScCd": $("#sbx_assScCd").val()
                  ,"orgNm": gUserInfo.orgNm
                  ,"orgCd": gUserInfo.orgNo
                  ,"stts" : "N"
            }
    }

    $.fn.openPopup(popupOption);
}

function openAddPopup_callback(resultObj) {
    if(resultObj != "undefined") {
        selectRvwOpinList();
    }
}

/**
 * @설명: 검토결과 수정을 위한 팝업을 호출한다.
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
            url: "/be/gv/begv131p.do",
            name: "검토결과 상세 팝업",
            width: 700,
            height: 850,
            item: item
    }

    $.fn.openPopup(popupOption);
}

/**
 * @설명: 검토결과 수정을 위한 팝업 콜백
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021.08.26 최초작성
 */
function openModPopup_callback(resultObj) {
    if(resultObj != "undefined") {
        selectRvwOpinList();
    }
}

// 사용자 정보 얻어오기
function loadUserInfo() {
    
	$.callAjax({}, "/be/gv/begv141m/getUsrGvRole.do")
	.done(function(data) {
		gUsrInfo = data.usrInfoList;
		gCopInfo = data.copInfo;
		gLoginInfo = data.loginInfo;
		$("#btn_addData").hide();
		//접속 사용자 권한
		for(var i=0; i<gUsrInfo.length; i++){
			if (gUsrInfo[i].copCd == "01" || gUsrInfo[i].copCd == "02" || gUsrInfo[i].copCd == "03"){
				$("#btn_addData").show();
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