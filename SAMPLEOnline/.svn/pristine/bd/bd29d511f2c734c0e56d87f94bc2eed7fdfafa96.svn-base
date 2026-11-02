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
var gAssScCd = "";
var gOpnInfo = {};
var gTitleOpn = "";
var gStts = ""; //New, Edit
var gUsrRole = "N";
var gUsrAprv = "N";
var gUsrInfo;
var gCopInfo;
var gLoginInfo = {};
var gOpinOrg = "";
var gSgOrgCd;
var gSgOrgNm;
var gSgRole = "N";
var gRegCnt = "";
var reset = 0;

$(document).ready(function(){
    
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    $("#btn_tmpSave1").hide();
    $("#btn_tmpSave2").hide();
    //사용자정보 얻어오기
    loadUserInfo();
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //의견입력 초기화
    initOpn();
    
    //그리드 초기화
    initGridRst();
    initGridOpn();
    initGridFile();
    
});

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
    $.fn.renderCombobox({
        codeArr: ["GVNC_RVW_RSLT_SC_CD"],
        selArr: ["sbx_gvncRvwRsltScCd"],
        useFirstOption: false		//첫번째 option 사용여부
    });
    // 적용BE 조회, 콤보박스 설정
    $.fn.getAplcBe("sbx_aplcBe", 'GV');
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
    $("#divOpnInfo").find("input, select, textarea").prop("disabled", true);
    $("#btn_orgSearch").prop("disabled", true);
    $("#btn_orgSearch").hide();
    
    //의견입력 textarea 키입력 이벤트
    $("#tar_opn").on("keydown", function(e){
        $("#lb_opn").text(getByteB($("#tar_opn").val()));
    });
    
    //답변입력 textarea 키입력 이벤트
    $("#tar_rpl").on("keydown", function(e){
        $("#lb_rpl").text(getByteB($("#tar_rpl").val()));
    });
    
    //조회버튼 이벤트
    $("#btn_search").on("click", function(e){
        selectRvwRsltList();
    });
    
    //파일 업로드
    $("#btn_uploadFile").on("click", function(e){
        uploadFile();
    });
    
    $("#sbx_aplcBe").on("change", function(){    
    	gSrchYn = "N";
    	initText();
    	$("#gridDivRst").jsGrid("reset");
    	$("#gridDivRst").jsGrid("destroy");
    	$("#gridDivOpn").jsGrid("reset");
    	$("#gridDivOpn").jsGrid("destroy");
    	$("#gridDivFileList").jsGrid("reset");
    	$("#gridDivFileList").jsGrid("destroy");
    	initGridRst();
    	initGridOpn();
        initGridFile();
    	
    	initDivOpnInfo();
    });
    
    //권한권련 추후 확인필요
    //승인
    $("#btn_sgAprv").on("click", function(e){
    	//권한 확인 - 해당 부서 소속 직원
    	console.log("선임계리사지원 일반 승인");
    	gUsrAprv = "N";
    	for(var i=0; i<gUsrInfo.length; i++){
			if (gUsrInfo[i].copCd == "03"){
				gUsrAprv = "Y";
			}
		}
    	if (gUsrAprv != "Y"){
    		$.fn.msgBox("권한이 없습니다.");
    		return;
    	} else {
    		fn_aprvChkedList("sg");
    	}
    });
    
    $("#btn_dhAprv").on("click", function(e){
    	//권한 확인 - 해당 부서 소속 직원
    	console.log("부서장 일반 승인");
    	gUsrAprv = "N";
    	for(var i=0; i<gUsrInfo.length; i++){
			if (gUsrInfo[i].copCd == "03" && gUsrInfo[i].orgmId == gLoginInfo.loginId ){
				gUsrAprv = "Y";
			}
		}
    	
    	if (gUsrAprv != "Y"){
    		$.fn.msgBox("권한이 없습니다.");
    		return;
    	} else {
    		fn_aprvChkedList("dh");
    	}
    });
    
    //선계일괄승인 버튼 이벤트
    $("#btn_sgAprvAll").on("click", function(e){
    	if (gSrchYn != "Y"){
    		$.fn.msgBox("조회후 가능합니다.");
    		return;
    	};
    	gUsrAprv = "N";
    	for(var i=0; i<gUsrInfo.length; i++){
			if (gUsrInfo[i].copCd == "02" && gUsrInfo[i].orgmId == gLoginInfo.loginId ){
				gUsrAprv = "Y";
			}
		}
    	if (gUsrAprv != "Y"){
    		$.fn.msgBox("권한이 없습니다.");
    		return;
    	} else {
    		fn_aprvChkedList("sgAll");
    	}
    });
    
    //CA일괄승인 버튼 이벤트 
    $("#btn_caAprvAll").on("click", function(e){
    	if (gSrchYn != "Y"){
    		$.fn.msgBox("조회후 가능합니다.");
    		return;
    	};
    	gUsrAprv = "N";
    	for(var i=0; i<gUsrInfo.length; i++){
			if (gUsrInfo[i].copCd == "01" && gUsrInfo[i].orgmId == gLoginInfo.loginId ){
				gUsrAprv = "Y";
			}
		}
    	if (gUsrAprv != "Y"){
    		$.fn.msgBox("권한이 없습니다.");
    		return;
    	} else {
    		fn_aprvChkedList("caAll");
    	}
    });
    
    //등록 신규
    $("#btn_regOpn").on("click", function(e){
    	//권한 확인 - 선임계리사지원
    	gUsrAprv = "N";
    	for(var i=0; i<gUsrInfo.length; i++){
			if (gUsrInfo[i].copCd == "01" || gUsrInfo[i].copCd == "02" || gUsrInfo[i].copCd == "03"){
				gUsrAprv = "Y";
			}
		}
    	if (gUsrAprv != "Y"){
    		$.fn.msgBox("권한이 없습니다.");
    		return;
    	} else {
    		fn_newOpn();
    	}
    });
    //저장
    $("#btn_saveOpn").on("click", function(e){
    	//권한 - 선임계리사지원, 해당 부서 직원
    	fn_saveOpn();
    });
    //삭제
    $("#btn_deleteOpn").on("click", function(e){
    	//권한 - 선임계리사지원, 해당 부서 직원
    	gUsrAprv = "N";
    	
    	for(var i=0; i<gUsrInfo.length; i++){
			if (gUsrInfo[i].copCd == "01" || gUsrInfo[i].copCd == "02" || gUsrInfo[i].copCd == "03"){
				gUsrAprv = "Y";
			}
		}
    	if (gUsrAprv != "Y"){
    		$.fn.msgBox("권한이 없습니다.");
    		return;
    	} else {
    		fn_deleteOpn();
    	}
    });
    

    //임시저장(의견)
    $("#btn_tmpSave1").on("click", function(e){
        $.fn.msgBox("의견을 임시저장하시겠습니까?", function (obj) {
            if (obj.btn_ok) {
                var key1 = "";
                key1 = gLoginInfo.loginId+"/검토의견/"+gAssScCd+"/"+gOpnInfo.orgCd;
                
                localStorage.setItem(key1, $("#tar_opn").val());
                if(localStorage.getItem(key1)) {
                    $.fn.msgBox("저장되었습니다.");
                }
            }
        }, 2);
    });
    
    //임시저장(답변)
    $("#btn_tmpSave2").on("click", function(e){
        $.fn.msgBox("답변을 임시저장하시겠습니까?", function (obj) {
            if (obj.btn_ok) {
                var key2 = "";
                key2 = gLoginInfo.loginId+"/검토답변/"+gAssScCd+"/"+gOpnInfo.orgCd;
                
                localStorage.setItem(key2, $("#tar_rpl").val());
                if(localStorage.getItem(key2)) {
                    $.fn.msgBox("저장되었습니다.");
                }
            }
        }, 2);
    });
    
    //부서조회
    $("#btn_orgSearch").on("click", function(e){
    	callPopupUserSearch();
    });
    
    //파일삭제
    $("#btn_deleteFiles").on("click", function(e){
        deleteFile();
    });
}

function initOpn(){
	$("#divOpnInfo").find("input, select, textarea").prop("disabled", true);
    $("#btn_orgSearch").prop("disabled", true);
    $("#btn_orgSearch").hide();
    $("#btn_tmpSave1").hide();
    $("#btn_tmpSave2").hide();
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
    $("#be_title").text($("#sbx_aplcBe option:selected").text() + " 검토결과 ");
}

/**
 * @설명: 그리드 세팅
 * @최초작성자: 김민우
 * @최초작성일: 2022. 1. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김민우 2022. 1. 7 최초작성
 */
function initGridRst() {
	var titleNm = "";
	var fieldList = [];
	var tmpNm = "";
	fieldList = getGrdVal(1);
    var gridObjRst = new ComJsGrid({
        id: "gridDivRst",
        height: 600,
        sorting: false,
        paging: false,
        selectHiglight:true,
        fields : fieldList
    });
        
    // row click
    gridObjRst.rowClick(function(args) {
    	grdObj = args.item;
        gAssScCd = grdObj.assScCd;
        
        var codeArr = $.fn.getGridCodeItem("ASS_SC_CD");
        for(i=0; i<codeArr.length; i++) {
            if(grdObj.assScCd == codeArr[i].code) {
            	tmpNm = codeArr[i].codeAbbrNm;
            }
        }
        gAssScNm = tmpNm;
        gTitleOpn = tmpNm;
        gRegCnt = grdObj.regCnt;
        $("#titleOpn").text("상세의견  (" + gTitleOpn +")");
        $("#titleOpnDtl").text("의견입력");
        initDivOpnInfo();
        initGridFile();
        fn_getRstOpn();
        initGridOpn();
    }); 
    
    //그리드 생성
    gridObjRst.gridCreate();
}

function initGridOpn(){
	var fieldList = [];
	fieldList = getGrdVal(2);

    var gridObjOpn = new ComJsGrid({
        id: "gridDivOpn",
        height: 262,
        sorting: false,
        paging: false,
        selectHiglight:true,
        fields : fieldList
    }); 
    
    // row click
    gridObjOpn.rowClick(function(args) {
    	grdObj = args.item;
        //부서명, 결과, 검토의견, 답변
    	gOpnInfo.orgCd = grdObj.orgCd;
    	gOpnInfo.orgNm = grdObj.orgNm;
    	gOpnInfo.rvwCntnt01 = grdObj.rvwCntnt01;
    	gOpnInfo.rvwCntnt02 = grdObj.rvwCntnt02;
    	gOpnInfo.gvncRstScCd = grdObj.gvncRvwRsltScCd;
    	$("#titleOpnDtl").text("의견입력 (" + gTitleOpn + ") [" + grdObj.orgNm + "]");
    	initOpn();
        fn_setOpnInfo();
    });
    
    //그리드 생성
    gridObjOpn.gridCreate();
}

function initGridFile(){
	$("#gridDivFileList").jsGrid("reset");
	$("#gridDivFileList").jsGrid("destroy");
	
	var fileGridObject = new ComJsGrid({
		id: "gridDivFileList",
        height: 180,
        editing: false,
        sorting: false,
        paging: false,
        selectHiglight:true,
        controller : {
            insertItem : function(item) {
                $("#uploadForm")[0].file.value = item.fileVal;
                gNewFileCnt ++;
            },
            deleteItem : function(item) {
                //file타입으로 생성된 태그 삭제
                $("#newFile"+gNewFileCnt).remove();
                gNewFileCnt--;
            }
        },
        fields : [
            { name: "apndFileSno", title:"파일일련번호", css:"cell", type: "text", width: 100, editing: false, align:"left", visible:false},
            //{ name: "apndFilePathNm"   , title:"파일경로"    , css:"cell", type: "text", width: 50, editing: false, align:"left", visible:false},
            { name: "check", title:"선택", width: 3, sorting: false, align:"center", editing: false, itemTemplate:function(value, item) {
                var elem = $("<input>").attr("type", "checkbox").attr("checked", value|| item.Checked).on("change", function() {
                        item.Checked = $(this).is(":checked");
                    });
                return elem;
            }},
            { name: "apndFileNm"       , title:"파일명"    , css:"cell", type: "text", width: 100, editing: false, align:"left"}
        ]
	});
	
	// row double click 파일 다운로드
	fileGridObject.rowDoubleClick(function(args) {
    	$.fn.fileDownload("/mg/sy/mgsy911m/downloadFile.do?filePath=" + encodeURIComponent(args.item.apndFilePathNm + "/" + args.item.apndFileNm));
    });
    
	fileGridObject.gridCreate();
}

function initDivOpnInfo(){
	$("#ibx_orgNm").val('');
	$("#ibx_orgCd").val('');
	$("#sbx_gvncRvwRsltScCd").val('');
	$("#tar_opn").val('');
	$("#tar_rpl").val('');
	
	$("#ibx_orgNm").prop("disabled", true);
	$("#ibx_orgCd").prop("disabled", true);
	$("#sbx_gvncRvwRsltScCd").prop("disabled", true);
	$("#tar_opn").prop("disabled", true);
	$("#tar_rpl").prop("disabled", true);
	$("#uploadFile").prop("disabled", true);
	$("#btn_uploadFile").prop("disabled", true);
	$("#btn_deleteFiles").prop("disabled", true);
	
}
/**
* @설명: 거버넌스 > 검토결과 > 그리드 값 매칭
* @최초작성자: 김민우
* @최초작성일: 2021. 12. 15.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  2021. 12. 15. 최초작성
*/
function getGrdVal(grdNo) {
	var fieldList = [];
	
	switch (grdNo){
	case 1 : 
		chk = {name : "check", title: "선택", width: 20, sorting: false, editing: false, align:"center", headerTemplate:function() {
				return $("<input>").attr("id", "chk_all").attr("type", "checkbox").on("change", function() {
			    grd_check_all(this.checked);
				//$("#chk_all").prop("checked", true);
			});
		}, itemTemplate:function(value, item) {
			//if (item.regCnt > 0){
			gUsrAprv = "N";
	    	for(var i=0; i<gUsrInfo.length; i++){
				if (gUsrInfo[i].copCd == "01" || gUsrInfo[i].copCd == "02" ){
					gUsrAprv = "Y";
				}
			}
			if (gUsrAprv == "Y"){
				
				var $result = $("<input>").attr("type", "checkbox").attr("id", "chk_" + item.rn).attr("checked", value || item.checked).on("change", function() {
					item.checked = $(this).is(":checked");
					
				if(!$(this).is(":checked")) $("#chk_all").prop("checked", false);
		   			
		   		var data = $("#gridDivRst").jsGrid("option", "data");
		   		var checkCnt = 0;
		   		for (var i = 0; i < data.length; i++) {
		   			if(data[i].checked) {
		   				checkCnt++;
		   			}
		   		}
		   			
		   		if(data.length == checkCnt) $("#chk_all").prop("checked", true);
				})
			}
			
			return $result;
		}		};
		
		assScCdVal = { name: "assScCd", title: "가정", css:"cell", type: "select", align:"center"
			      , items: $.fn.getGridCodeItem("ASS_SC_CD"), textField: "codeNm", valueField:"code" };
		tbdOrgCdVal = { name:"tbdOrgCd", title:"TBD부서코드", css:"cell", type: "text", visible:false};
		tbdRstScCdVal = { name:"tbdGvncRvwRsltScCd", title:"TBD검토결과", css:"cell", type: "text", visible:false};
		tbdCntnt01 = { name: "tbdRvwCntnt01", title:"TBD의견" , css:"cell", type: "text", visible:false};
		tbdCntnt02 = { name: "tbdRvwCntnt02"     , title:"TBD답변" , css:"cell", type: "text", visible:false};
		
		sgOrgCdVal = { name: "sgOrgCd", title:"선계부서코드" , css:"cell", type: "text", visible:false};
		sgRstScCdVal = { name: "sgGvncRvwRsltScCd", title:"선계검토결과" , css:"cell", type: "text", visible:false};
		sgCntnt01 = { name: "sgRvwCntnt01", title:"선계의견" , css:"cell", type: "text", visible:false};
		sgCntnt02 = { name: "sgRvwCntnt02", title:"선계답변" , css:"cell", type: "text", visible:false};
        
		caOrgCdVal = { name: "caOrgCd", title:"CA부서코드" , css:"cell", type: "text", visible:false};
		caRstScCdVal = { name: "caGvncRvwRsltScCd"          , title:"CA검토결과" , css:"cell", type: "text", visible:false};
		caCntnt01 = { name: "caRvwCntnt01", title:"CA의견" , css:"cell", type: "text", visible:false};
		caCntnt02 = { name: "caRvwCntnt02", title:"CA답변" , css:"cell", type: "text", visible:false};
		
		cnfYn01 = { name: "cnfYn01", title:"담당자", css:"cell", type: "text", editing: false, align:"center",
            itemTemplate:function(value, item){                     
                if (value == "Y") {
                	value = "확인";
                } else if (value == "N"){
                	value = "미확인";
                } else {
                	value = "";
                }
                return value;
            }
        };
        cnfYn02 = { name: "cnfYn02", title:"부서장", css:"cell", type: "text", editing: false, align:"center",
        	itemTemplate:function(value, item){
        		if (value == "Y") {
                	value = "확인";
                } else if (value == "N"){
                	value = "미확인";
                } else {
                	value = "";
                }
                return value;
        	}
        };
        aprvYn01 = { name: "aprvYn01", title:"선임계리사", css:"cell", type: "text", editing: false, align:"center",
	        itemTemplate: function(value,item){
	        	if (value == "Y") {
                	value = "승인";
                } else if (value == "N"){
                	value = "미승인";
                } else {
                	value = "";
                }
                return value;
	        }
        };
        aprvYn02 = { name: "aprvYn02", title:"계리실장", css:"cell", type: "text", editing: false, align:"center",
	        itemTemplate: function(value,item){
	        	if (value == "Y") {
                	value = "승인";
                } else if (value == "N"){
                	value = "미승인";
                } else {
                	value = "";
                }
                return value;
	        }
        };
        
		fieldList.push(chk, assScCdVal, cnfYn01, cnfYn02, aprvYn01, aprvYn02);
		break;
		
	case 2 :
		orgCd = { name: "orgCd", title:"부서코드", css:"cell", type: "text", width: 0, editing: false, align:"center", visible: false};
		orgNm = { name: "orgNm", title:"부서명", css:"cell", type: "text", width: 60, editing: false, align:"center"};
		rvwCntnt01 = { name: "rvwCntnt01", title:"검토의견", type: "text", editing: false, align:"left"
                , itemTemplate:function(value, item) {
                    if(value!=null && value!='') {
                        return value.replaceAll("\n", "<br>");
                    } else {
                        return value;
                    }
            }};
		rvwCntnt02 = { name: "rvwCntnt02", title:"답변", type: "text", editing: false, align:"left"
                 , itemTemplate:function(value, item) {
                     if(value!=null && value!='') {
                         return value.replaceAll("\n", "<br>");
                     } else {
                         return value;
                     }
            }};
		gvncRstScCdVal = { name: "gvncRvwRsltScCd", title:"결과", css:"cell", type: "select", width: 40, editing: false, align:"center"
			             , items: $.fn.getGridCodeItem("GVNC_RVW_RSLT_SC_CD"), textField: "codeNm", valueField: "code"};
            
		fieldList.push(orgCd, orgNm, rvwCntnt01, rvwCntnt02, gvncRstScCdVal);
		break;
		
	}

	return fieldList;
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
function selectRvwRsltList(){

    var reqParam = {
        "aplcBe": $("#sbx_aplcBe").val(),
    };

    $.callAjax(reqParam, "/be/gv/begv141m/selectRvwRsltList.do")
        .done(function(data) {
        	gSrchYn = "Y";
            var rvwRsltAprvList = data.rvwRsltAprvList;
            
            $("#gridDivRst").jsGrid("reset");
            $("#gridDivRst").jsGrid("loadData", rvwRsltAprvList).done(function() {
            });
            initText();
            
        }).fail(function(data){
            $.fn.msgBox("목록 조회가 실패했습니다.");
    });
            
}

//사용자 정보 얻어오기
function loadUserInfo() {

    $.callAjax({}, "/be/gv/begv141m/getUsrGvRole.do")
        .done(function(data) {
		gUsrInfo = data.usrInfoList;
		gLoginInfo = data.loginInfo;
		gCopInfo = data.copInfo;
		$("#chk_all").prop("disabled", true);
		
		for(var i=0; i<gUsrInfo.length; i++){
			if (gUsrInfo[i].copCd == "01" || gUsrInfo[i].copCd == "02"){
		    	$("#chk_all").prop("disabled", false);
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

//적용Be, 가정종류에 따른 의견 목록 조회
function fn_getRstOpn(){
	$("#btn_orgSearch").hide();
	var reqParam = {"aplcBe" : $("#sbx_aplcBe").val(), "assScCd" : gAssScCd};
	
	$.callAjax(reqParam, "/be/gv/begv141m/selectRstOpnList.do")
    .done(function(data) {
    	//의견 목록 조회
    	var opnList = data.rstList;
    	$("#gridDivOpn").jsGrid("reset");
        $("#gridDivOpn").jsGrid("option", "data", []);
        $("#gridDivOpn").jsGrid("destroy");
        initGridOpn();
        
        $("#gridDivOpn").jsGrid("loadData", opnList).done(function() {
            if(opnList.length == 0){
                $.fn.getReturnValue("gridDivOpn");
            }
        });
        
        //가정산출 부서
        gUsrAprv = "N";
    	for(var i=0; i<gUsrInfo.length; i++){
    		if (gUsrInfo[i].copCd == "03" ){
    			gUsrAprv = "Y";
    		}
    	}
    	if (gUsrAprv == "Y"){
    		//첨부파일 목록 조회
    		initGridFile();
    	}
    	
        gSrchYn = "Y";
        
    });
}

//적용BE, 가정종류에 다른 의견의 상세 정보
function fn_setOpnInfo(){
	$("#ibx_orgCd").val(gOpnInfo.orgCd);
	$("#ibx_orgNm").val(gOpnInfo.orgNm);
	$("#tar_opn").val(gOpnInfo.rvwCntnt01);
	$("#tar_rpl").val(gOpnInfo.rvwCntnt02);
	$("#sbx_gvncRvwRsltScCd").val(gOpnInfo.gvncRstScCd).prop("selected",true);
	$("#uploadFile").val('');
	
	initGridFile();
	//권한에 따라 버튼 및 텍스트 활성화
	gSgRole = "N";
	gUsrAprv = "N";
	
	for(var i=0; i<gUsrInfo.length; i++){
		if (gUsrInfo[i].copCd == "03" ){
			gUsrAprv = "Y";
			gSgRole = "Y";
		}
	}
	
	if (gOpnInfo.orgCd == gLoginInfo.loginOrg){
		gUsrAprv = "Y";
	}
	
	if (gUsrAprv != "Y"){
		return;
	}
	
	if (gUsrAprv == "Y"){
		$("#sbx_gvncRvwRsltScCd").prop("disabled", false);
		$("#tar_opn").prop("disabled", false);
		
		var key1 = gLoginInfo.loginId+"/검토의견/"+gAssScCd+"/"+gOpnInfo.orgCd;
	    var key1Val = localStorage.getItem(key1);
	    //console.log("key1 ? ", key1, "key1Val ? ", key1Val);
	    if(key1Val) {
	        $("#tar_opn").val(key1Val);
	    } else {
	        $("#tar_opn").val(gOpnInfo.rvwCntnt01);
	    }
	    $("#btn_tmpSave1").prop("disabled", false);
	    $("#btn_tmpSave1").show();
	} 
	
	if (gSgRole == "Y"){
		$("#tar_rpl").prop("disabled", false);
		//$("#tar_opn").prop("disabled", false);
		$("#btn_tmpSave2").prop("disabled", false);
	    $("#btn_tmpSave2").show();
	    
		var key2 = gLoginInfo.loginId+"/검토답변/"+gAssScCd+"/"+gOpnInfo.orgCd;
	    var key2Val = localStorage.getItem(key2);
	    //console.log("key2", key2, "key2Val ? ", key2Val);
	    if(key2Val) {
	        $("#tar_rpl").val(key2Val);
	    } else {
	        $("#tar_rpl").val(gOpnInfo.rvwCntnt02);
	    }
	}
	
	if (gUsrAprv == "Y" || gSgRole == "Y"){
		$("#uploadFile").prop("disabled", false);
		$("#btn_uploadFile").prop("disabled", false);
	    $("#btn_deleteFiles").prop("disabled", false);
	    
		var reqParam = {};
		reqParam["aplcBeNm"] = $("#sbx_aplcBe").val();
		reqParam["assScCd"] = gAssScCd
		reqParam["orgCd"] = $("#ibx_orgCd").val();
		reqParam["apndFileSno"] = 3;
		
		$.callAjax(reqParam, "/be/gv/begv111p/selectPryDtRvwFileList.do")
		.done(function(data) {
			var fileList = data.fileList;
			
			$("#gridDivFileList").jsGrid("loadData", fileList).done(function() {
				if(fileList == null || fileList.length == 0){
					$.fn.getReturnValue("gridDivFileList");
				}
			});
			gStts = "E";
			
		}).fail(function(data){
			$.fn.msgBox("첨부파일 목록 조회에 실패했습니다.");
		});
	}
//	else {
//		gUsrAprv = "N";
//		$("#sbx_gvncRvwRsltScCd").prop("disabled", true);
//		$("#tar_opn").prop("disabled", true);
//		$("#tar_rpl").prop("disabled", true);
//		$("#btn_tmpSave1").prop("disabled", true);
//	    $("#btn_tmpSave1").hide();
//	}
	
	
	
//    $("#btn_orgSearch").hide();
//    $("#sbx_gvncRvwRsltScCd").prop("disabled", false);
//    //$("#btn_orgSearch").prop("disabled", true);
//    
//    var key1 = gLoginInfo.loginId+"/검토의견/"+gAssScCd+"/"+gOpnInfo.orgCd;
//    var key1Val = localStorage.getItem(key1);
//    //console.log("key1 ? ", key1, "key1Val ? ", key1Val);
//    if(key1Val) {
//        $("#tar_opn").val(key1Val);
//    } else {
//        $("#tar_opn").val(gOpnInfo.rvwCntnt01);
//    }
//    var key2 = gLoginInfo.loginId+"/검토답변/"+gAssScCd+"/"+gOpnInfo.orgCd;
//    var key2Val = localStorage.getItem(key2);
//    //console.log("key2", key2, "key2Val ? ", key2Val);
//    if(key2Val) {
//        $("#tar_rpl").val(key2Val);
//    } else {
//        $("#tar_rpl").val(gOpnInfo.rvwCntnt02);
//    }
    
	//본인 작성 또는 권한 부서일 경우 excel 목록 조회
//    gUsrAprv = "N";
//	for(var i=0; i<gUsrInfo.length; i++){
//		if (gUsrInfo[i].copCd == "03"){
//			gUsrAprv = "Y";
//			$("#tar_opn").prop("disabled", false);
//			$("#btn_tmpSave1").prop("disabled", false);
//		    $("#btn_tmpSave1").show();
//		}
//	}
//	if (gOpnInfo.orgCd == gLoginInfo.loginOrg){
//		gUsrAprv = "Y";
//	}
//	if (gUsrAprv != "Y"){
//		$("#tar_opn").prop("disabled", true);
//		$("#btn_tmpSave1").prop("disabled", true);
//	    $("#btn_tmpSave1").hide();
//		$("#uploadFile").prop("disabled", true);
//		return;
//		
//	} else {
//		if (gOpnInfo.orgCd == gLoginInfo.loginOrg){
//			$("#tar_rpl").prop("disabled", true);
//			$("#tar_opn").prop("disabled", false);
//		} else {
//			$("#tar_rpl").prop("disabled", false);
//			$("#tar_opn").prop("disabled", false);
//			$("#btn_tmpSave2").show();
//			$("#btn_tmpSave2").prop("disabled", false);
//		}
//		
//		$("#uploadFile").prop("disabled", false);
//	    $("#btn_deleteFiles").prop("disabled", false);
//	    
//		var reqParam = {};
//		reqParam["aplcBeNm"] = $("#sbx_aplcBe").val();
//		reqParam["assScCd"] = gAssScCd
//		reqParam["orgCd"] = $("#ibx_orgCd").val();
//		reqParam["apndFileSno"] = 3;
//		
//		$.callAjax(reqParam, "/be/gv/begv111p/selectPryDtRvwFileList.do")
//		.done(function(data) {
//			var fileList = data.fileList;
//			
//			$("#gridDivFileList").jsGrid("loadData", fileList).done(function() {
//				if(fileList == null || fileList.length == 0){
//					$.fn.getReturnValue("gridDivFileList");
//				}
//			});
//			gStts = "E";
//			
//		}).fail(function(data){
//			$.fn.msgBox("첨부파일 목록 조회에 실패했습니다.");
//		});
//	} 
}

// 그리드 체크박스 전체 선택
function grd_check_all(value) {
	var data = $("#gridDivRst").jsGrid("option", "data");
	for (var i = 0; i < data.length; i++) {
			data[i]["checked"] = value;
	}

	$("#gridDivRst").jsGrid("option", "data", data);
}

//일괄승인 대상
function fn_aprvChkedList(gbnVal){
	//gbnVal : 선계 sg-div5, CA ca-div6
	var chkList = new Array();
	var grdData = $("#gridDivRst").jsGrid("option", "data");
	var chkCnt = 0;
	
	var chkParam = {"aplcBe" : $("#sbx_aplcBe").val(), "assScCd" : gAssScCd, "gbnVal" : gbnVal};
	
	if (gSrchYn != "Y"){
		$.fn.msgBox("조회 후 가능합니다.");
		return;
	}
	if (gbnVal == "sg" || gbnVal == "dh"){
		if (gAssScCd == "" || gAssScCd == undefined){
			$.fn.msgBox("가정을 선택해 주십시오.");
			return;
		}
	}
	
	$.callAjax(chkParam, "/be/gv/begv141m/chkOpnRvwCntnt.do")
	.done(function(data){
		console.log(data);
		if (data.result == "no_ans"){
			$.fn.msgBox("검토의견을 등록해 주세요.");
			return;
		}
		if (data.result == "failed"){
			if (gbnVal == "sg") {
				$.fn.msgBox("미확인 의견이 존재합니다.");
				return;
			} else if (gbnVal == "dh") {
				$.fn.msgBox("담당자의 상태를 확인하십시오.");
				return;
			} else if (gbnVal == "sgAll") {
				$.fn.msgBox("담당자나 부서장의 상태를 확인하십시오.");
				return;
			} else if (gbnVal == "caAll") {
				$.fn.msgBox("담당자나 선임계리사의 상태를 확인하십시오.");
				return;
			}
		} else {
			if (gbnVal == "sg" || gbnVal == "dh" ) {
				chkList.push({
					aplcBe : $("#sbx_aplcBe option:selected").val(),
					gbnVal : gbnVal,
					assScCd : gAssScCd,
					regCnt : gRegCnt
				});
			} else {
				for (var i=0; i<grdData.length; i++){
					if(grdData[i].checked){
						chkCnt++;
						chkList.push({
							aplcBe : $("#sbx_aplcBe option:selected").val(),
							gbnVal : gbnVal,
							assScCd : grdData[i].assScCd,
							regCnt : grdData[i].regCnt
						});
					}
				}
			}
			
			if (gbnVal == "sgAll" || gbnVal == "caAll"){
				if (chkCnt == 0){
					$.fn.msgBox("승인할 대상이 없습니다.");
					return;
				}
				$.fn.msgBox(chkCnt + "건을 승인처리하시겠습니까?", function(obj) {
					if(obj.btn_ok) {
						$.callAjax({'reqParam':JSON.stringify(chkList)}, "/be/gv/begv141m/aprvCfm.do")
						.done(function(data) {
							if(data.result == "success") {
								$.fn.msgBox("정상적으로 승인 처리 되었습니다.");
								selectRvwRsltList(); //재조회
							}
						}).fail(function(data){
							$.fn.msgBox("일괄 승인 실패");
						});
					}
				}, 2);
			} else {
				$.fn.msgBox(gAssScNm + " 을(를) 확인처리하시겠습니까?", function(obj) {
					if(obj.btn_ok) {
						$.callAjax({'reqParam':JSON.stringify(chkList)}, "/be/gv/begv141m/aprvCfm.do")
						.done(function(data) {
							if(data.result == "success") {
								$.fn.msgBox("정상적으로 확인처리 되었습니다.");
								selectRvwRsltList(); //재조회
							}
						}).fail(function(data){
							$.fn.msgBox(gAssScNm + " 확인처리 실패");
						});
					}
				}, 2);
			}
		}
	});
	
	
}

function fn_setBtnPrc(param){
	$("#divOpnInfo").find("input, select, textarea").prop("disabled", false);
	$("#btn_orgSearch").prop("disabled", false);
	$("#ibx_orgNm").prop("disabled", true);

	if (param == "Y"){
		$("#divOpnInfo").find("button").prop("disabled", false);
	}
	//1 권한없음 : 부서명, 결과, 의견, 답변 조회만 가능, 엑셀 비활성화
	
	//2 선임계리사 또는 해당부서 : 수정 및 엑셀파일 활성화
}

//신규 의견 정보 등록
function fn_newOpn() {
	gUsrAprv = "N";
	for(var i=0; i<gUsrInfo.length; i++){
		if (gUsrInfo[i].copCd == "03"){
			gUsrAprv = "Y";
		}
	}
	if (gUsrAprv != "Y"){
		$.fn.msgBox("권한이 없습니다.");
		return;
	}
	
	if (gAssScCd == "" || gAssScCd == undefined || gAssScCd == null){
		$.fn.msgBox("가정을 선택한 후 등록이 가능합니다.");
		return;
	}
	
	$("#ibx_orgNm").val('');
	$("#ibx_orgCd").val('');
	$("#tar_opn").val('');
	$("#tar_rpl").val('');
	$("#sbx_gvncRvwRsltScCd").val('');
	$("#gridDivFileList").jsGrid("reset");
	$("#gridDivFileList").jsGrid("destroy");
	$("#tar_opn").prop("disabled", false);
	$("#tar_rpl").prop("disabled", true);
	$("#uploadFile").prop("disabled", false);
	$("#btn_uploadFile").prop("disabled", false);
	$("#sbx_gvncRvwRsltScCd").prop("disabled", false);
	$("#btn_orgSearch").prop("disabled", false);
	initGridFile();
	gStts = "N";
	
	$("#btn_orgSearch").show();
	
	$("#btn_tmpSave1").hide();
    $("#btn_tmpSave2").hide();
    $("#tr_fileList .clearfix").text("파일이 없습니다");
}

//저장
function fn_saveOpn(){
	var reqParam = getInputData();
	
	if(reqParam != false) {
        $.fn.msgBox("데이터를 저장하시겠습니까?", function (obj) {
            if (obj.btn_ok) {
                $.callAjax(reqParam, "/be/gv/begv141m/saveOpin.do")
                .done(function(data) {
                    //console.log("저장결과 ? ", data);
                    //console.log("저장결과 ::  " + data.result);
                    if(data.result == "success") {
                        //uploadFile();
                        var key1, key2;
                        key1 = gLoginInfo.loginId+"/검토의견/"+gAssScCd+"/"+reqParam.orgCd;
                        key2 = gLoginInfo.loginId+"/검토답변/"+gAssScCd+"/"+reqParam.orgCd;
                        
                        localStorage.removeItem(key1);
                        localStorage.removeItem(key2);
                        
                        $.fn.msgBox("정상적으로 처리되었습니다.", function(){
                        	fn_getRstOpn(); //상세의견 목록 조회
                        	initOpn();
                        });
                    } else if (data.result == "error_dup"){
                    	$.fn.msgBox("이미 등록된 부서가 있습니다.");
                    }
                }).fail(function(data){
                    $.fn.msgBox("데이터 저장이 실패했습니다.");
                });
            }
        }, 2);
    }
}
/**
 * @설명: 부서검색 팝업을 호출한다.
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
 * @설명: 부서조회 팝업 콜백
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 임국빈 2021.08.26 최초작성
 */
function resultUserPopup_callback(resultObj){
    console.log("resultTablePopup_callback   resultObj", JSON.stringify(resultObj));

    $("#ibx_orgCd").val(resultObj.orgNo);
    $("#ibx_orgNm").val(resultObj.orgNm);
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
    var obj = {};

    var reqAplcBe = $("#sbx_aplcBe").val();
    var reqAssScCd = gAssScCd;
    var reqOrgCd = $("#ibx_orgCd").val();
    var reqOrgNm = $("#ibx_orgNm").val();
    var reqGvncRvwRsltScCd = $("#sbx_gvncRvwRsltScCd").val();
    var reqRvwCntnt01 = $("#tar_opn").val();
    var reqRvwCntnt02 = $("#tar_rpl").val();
    //var userId = gUserInfo.userEno;
        
    //obj["div"] = gDiv;
    obj["aplcBe"] = reqAplcBe;
    obj["assScCd"] = reqAssScCd;
    obj["orgCd"] = reqOrgCd;
    obj["gvncRvwRsltScCd"] = reqGvncRvwRsltScCd;
    obj["rvwCntnt01"] = reqRvwCntnt01;
    obj["rvwCntnt02"] = reqRvwCntnt02;
    //obj["userId"] = userId;
    obj["stts"] = gStts;
    
    if($.fn.isEmpty(reqOrgCd)) {
        $.fn.msgBox("부서명"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    return obj;
}

/**
 * 
 * @설명: 첨부파일을 업로드 한다.
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 07.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  89001203 2021. 9. 07. 최초작성
 *
 */
function uploadFile() {
	reset = 1;
    var filePath = "";
    
    
	
    var form = $("#uploadForm")[0];
    if(!form.file.value) {
        alert("업로드할 파일을 입력하세요.")
        return;
    }
    
    form.filePath.value = filePath;
    form.aplcBeNm.value = $("#sbx_aplcBe").val();
    var reqFileParam = new FormData(form);
    var fileVal = $("#uploadFile").val();
    var $files = document.querySelector("#uploadFile");
    var size = $files.files[0].size;
    var fObj = {};
    fObj["fileList"] = [
        {
            "aplcBeNm": $("#sbx_aplcBe").val(),
            "assScCd": gAssScCd,
            "userId": gLoginInfo.loginId,
            "orgCd": $("#ibx_orgCd").val(),
            "apndFilePathNm": fileVal.substring(0,fileVal.lastIndexOf("\\")),
            "apndFileNm": fileVal.substring(fileVal.lastIndexOf("\\")+1),
            "apndFileSize": size,
            "trtrEno": gLoginInfo.loginId,
            "status": "add",
            "apndFileSno": 3
        }
    ];
    
    $.callAjaxUpload(reqFileParam, "/be/gv/begv111p/uploadFile.do")
    .done(function(data) {
        
        if(data.result == "1") {
            $.fn.msgBox("정상적으로 처리되었습니다.");
            $("#uploadForm")[0].file.value = "";
            //insert 로직
            $.callAjax({"jsonStr":JSON.stringify(fObj)}, "/be/gv/begv111p/savePryDtRvwFile.do")
                .done(function(data) {
                	selectFileList();
            }).fail(function(data){
                console.log("파일데이터insert 실패!");
            });
            
        }
    }).fail(function(data){
    });  
}

function checkFile(e){
    
    var file = e.files;
    
    if(file[0].size > 1024*1024*10) {
        $.fn.msgBox("10MB 이하 파일만 등록할 수 있습니다.");
        $("#uploadFile").val("");
    }
}

function fn_deleteOpn() {
	gUsrAprv = "N";
	for(var i=0; i<gUsrInfo.length; i++){
		if (gUsrInfo[i].copCd == "03"){
			gUsrAprv = "Y";
		}
	}
	
	if (gUsrAprv != "Y"){
		$.fn.msgBox("권한이 없습니다.");
		return;
	}
	if (gAssScCd == null || gAssScCd == "" || gAssScCd == undefined){
		$.fn.msgBox("조회 후 삭제가능합니다.");
		return;
	}
	if (gOpnInfo.orgCd == null || gOpnInfo.orgCd == "" || gOpnInfo.orgCd == undefined){
		$.fn.msgBox("삭제할 의견을 선택해 주세요.");
		return;
	}
	
	var reqParam = getInputData();
    $.fn.msgBox("의견을 삭제하시겠습니까?", function (obj) {
        if (obj.btn_ok) {
            $.callAjax(reqParam, "/be/gv/begv141m/deleteOpin.do")
            .done(function(data) {
                if(data.result == "success") {
                    var key1, key2;
                    key1 = gLoginInfo.loginId+"/검토의견/"+gAssScCd+"/"+reqParam.orgCd;
                    key2 = gLoginInfo.loginId+"/검토답변/"+gAssScCd+"/"+reqParam.orgCd;
                    localStorage.removeItem(key1);
                    localStorage.removeItem(key2);
                    $.fn.msgBox("정상적으로 처리되었습니다.", function(){
                    	fn_getRstOpn(); //상세의견 목록 조회
                    	initOpn();
                    });
                }
            }).fail(function(data){
                $.fn.msgBox("의견 삭제에 실패했습니다.");
            });
        }
    }, 2);
}

/**
* @설명: 체크파일삭제
* @최초작성자: 임국빈 (61000420)
* @최초작성일: 2021. 10. 19.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  임국빈 (61000420) 2021. 10. 19. 최초작성
*/
function deleteFile() {
    reset = 1;
    var list = $("#gridDivFileList").jsGrid("option", "data");
    var delList = [];
    for(var i=0; i<list.length; i++) {
        var item = list[i];
        if(item.Checked) {
            delList.push(item);
        }
    }
    
    if(delList.length ==0) {
        $.fn.msgBox("삭제할 파일을 체크하세요.");
        return;
    }
    $.fn.msgBox("선택한 파일을 삭제 하시겠습니까?", function (obj) {
        if(obj.btn_ok) {
            $.callAjax({"list": JSON.stringify(delList)}, "/be/gv/begv111p/deleteFileList.do")
            .done(function(data) {
                if(data.result == "1") {
                    $("#gridDivFileList").jsGrid("reset");
                    $("#gridDivFileList").jsGrid("option", "data", []);
                    $("#gridDivFileList").jsGrid("destroy");
                    initGridFile();
                    $.fn.msgBox("정상적으로 처리되었습니다.");
                    selectFileList();
                }
            }).fail(function(data){
            });
        }
    }, 2);
}

function selectFileList(){
	var reqParam = {};
	reqParam["aplcBeNm"] = $("#sbx_aplcBe").val();
	reqParam["assScCd"] = gAssScCd
	reqParam["orgCd"] = $("#ibx_orgCd").val();
	reqParam["apndFileSno"] = 3;
	
	$.callAjax(reqParam, "/be/gv/begv111p/selectPryDtRvwFileList.do")
	.done(function(data) {
		var fileList = data.fileList;
		
		$("#gridDivFileList").jsGrid("loadData", fileList).done(function() {
			if(fileList == null || fileList.length == 0){
				$.fn.getReturnValue("gridDivFileList");
			}
		});
		
	}).fail(function(data){
		$.fn.msgBox("첨부파일 목록 조회에 실패했습니다.");
	});
}