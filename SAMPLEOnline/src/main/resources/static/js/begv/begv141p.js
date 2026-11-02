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
var gDiv = "";
var gObjParam = {};
var gStts = "";

$(document).ready(function(){
	
	$("#imgToolTip").attr("title", parent.viewPath);
	//$($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]"); // CROS이슈 주석처리 - 20230309
	
	gObjParam = opener.popupOption;
	
	//공통코드(통합수준코드) 콤보박스
	initCommCd();

    //파라메터세팅
    initParamData();
    
    //event 초기화
    initEvent();
    
});


function initCommCd() {
	
	// 공통코드 조회(가정종류)
	$.fn.loadCommonCode(["ASS_SC_CD","GVNC_RVW_RSLT_SC_CD"]);
    $.fn.renderCombobox({
        codeArr: ["ASS_SC_CD","GVNC_RVW_RSLT_SC_CD"],
        selArr: ["sbx_assScCd","sbx_gvncRvwRsltScCd"],
        useFirstOption: false		//첫번째 option 사용여부
    });
    
    // 공통코드 조회(적용BE)
	$.fn.getAplcBe("sbx_aplcBe",$("#sbx_assScCd option:selected").val());
    
	if (gObjParam.div == "2"){
		$("#tar_opn").prop("disabled", true);
		$("#tar_rpl").prop("disabled", true);
	}
	if (gObjParam.div == "3" || gObjParam.div == "4"){
		$("#tar_rpl").prop("disabled", true);
	}

	
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
	
	//해당 rowData
	var gObjParamItem = opener.popupOption.item;
	var div = opener.popupOption.div;
	var stts = opener.popupOption.stts;
	gDiv = div;
	gStts = stts;
	
	//수정버튼으로 진입
	if(gObjParamItem != "undefined" && gObjParamItem != null) {
		
	    //적용BE, 가정종류세팅
	    $("#sbx_aplcBe").val(gObjParamItem.aplcBeNm).prop("selected",true);
	    $("#sbx_aplcBe").attr("disabled", true);
		$("#sbx_assScCd").val(gObjParamItem.assScCd).prop("selected",true);
		$("#sbx_assScCd").attr("disabled", true);
		
		$("#ibx_cnfYn01").val(gObjParamItem.cnfYn01);
		$("#ibx_cnfYn02").val(gObjParamItem.cnfYn02);
		$("#ibx_aprvYn01").val(gObjParamItem.aprvYn01);
		$("#ibx_aprvYn02").val(gObjParamItem.aprvYn02);
		//담당자(선임계리사지원)
		if(div == "1") { //선임계리사지원
			console.log(" chk 1  :: " + $("#ibx_orgCd").val(gObjParamItem.tbdOrgCd));
			
			$("#ibx_orgCd").val(gObjParamItem.tbdOrgCd);
			$("#ibx_orgNm").val("선임계리사지원");
			$("#sbx_gvncRvwRsltScCd").val(gObjParamItem.tbdGvncRvwRsltScCd).prop("selected",true);
			$("#tar_opn").val(gObjParamItem.tbdRvwCntnt01);
			$("#tar_rpl").val(gObjParamItem.tbdRvwCntnt02);
		}//부서장(선임계리사)
		else if(div == "3") { //선임계리사
			$("#ibx_orgCd").val(gObjParamItem.sgOrgCd);
			if (gObjParamItem.caOrgCd == null || gObjParamItem.caOrgCd == ""){
				$("#ibx_orgCd").val("001311");
			}
			$("#ibx_orgNm").val("선임계리사");
			$("#sbx_gvncRvwRsltScCd").val(gObjParamItem.sgGvncRvwRsltScCd).prop("selected",true);
			$("#tar_opn").val(gObjParamItem.sgRvwCntnt01);
			$("#tar_rpl").val(gObjParamItem.sgRvwCntnt02);
		}//선임계리사
		else if(div == "2") { //부서장
			$("#ibx_orgCd").val(gObjParamItem.sgOrgCd);
			//$("#ibx_orgCd").val(gObjParamItem.tbdOrgCd);
			if (gObjParamItem.caOrgCd == null || gObjParamItem.caOrgCd == ""){
				$("#ibx_orgCd").val("001311");
			}
			$("#ibx_orgNm").val("선임계리사");
			$("#sbx_gvncRvwRsltScCd").val(gObjParamItem.sgGvncRvwRsltScCd).prop("selected",true);
			$("#tar_opn").val(gObjParamItem.sgRvwCntnt01);
			$("#tar_rpl").val(gObjParamItem.sgRvwCntnt02);
		}//CA
		else if(div == "4") { //CA
			$("#ibx_orgCd").val(gObjParamItem.caOrgCd);
			$("#ibx_orgNm").val("재무실");
			if (gObjParamItem.caOrgCd == null || gObjParamItem.caOrgCd == ""){
				$("#ibx_orgCd").val("000328");
			}
			$("#sbx_gvncRvwRsltScCd").val(gObjParamItem.caGvncRvwRsltScCd).prop("selected",true);
			$("#tar_opn").val(gObjParamItem.caRvwCntnt01);
			$("#tar_rpl").val(gObjParamItem.caRvwCntnt02);
		}else {
			$.fn.msgBox("잘못된 진입 입니다.", function(){
				window.close();
			});
		}
		
		//의견입력 화면진입 최초 글자수
		$("#lb_opn").text(getByteB($("#tar_opn").val()));
		//답변입력 화면진입 최초 글자수
		$("#lb_rpl").text(getByteB($("#tar_rpl").val()));
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
	
	
	//의견입력 textarea 키입력 이벤트
	$("#tar_opn").on("keydown", function(e){
		$("#lb_opn").text(getByteB($("#tar_opn").val()));
	});
	
	//답변입력 textarea 키입력 이벤트
	$("#tar_rpl").on("keydown", function(e){
		$("#lb_rpl").text(getByteB($("#tar_rpl").val()));
	});
	
	//승인 이벤트
	$("#btn_aprove").on("click", function(e){
		var reqParam = getInputData();
		
		if (gDiv == "3" || gDiv == "4"){
			if (!($("#ibx_cnfYn01").val() == "Y" && $("#ibx_cnfYn01").val() == "Y")){
				$.fn.msgBox("담당자 또는 부서장 상태를 확인하세요.");
				return;
			}
		}
		
		$.fn.msgBox("승인하시겠습니까?", function(obj){
			if (obj.btn_ok) {
				opener.openModPopup_callback(reqParam);
				window.close();
			}
		}, 2);
	});
	
	//저장버튼 이벤트
	$("#btn_save").on("click", function(e){
		var reqParam = getInputData();
		if(reqParam != false) {
			
			$.fn.msgBox("데이터를 저장하시겠습니까?", function (obj) {
				if (obj.btn_ok) {
					//의견등 입력정보 저장
	                $.callAjax(reqParam, "/be/gv/begv131p/saveRvwOpin.do")
					.done(function(data) {
						if(data.result == "1") {
							//담당자(TBD), 부서장(선계)
							if(reqParam.div == "1" || reqParam.div == "2") {
								$.fn.msgBox("정상적으로 처리되었습니다.", function(){
									opener.openModPopup_callback(reqParam);
									window.close();
								});
							}else {
								//선계, CA 미승인인경우
								if((reqParam.div == 3 && reqParam.aprvYn01 == "N")
								|| (reqParam.div == 4 && reqParam.aprvYn02 == "N")  
								  ) {
									$.fn.msgBox("정상적으로 처리되었습니다. \n승인하시겠습니까?", function(obj){
										if (obj.btn_ok) {
											if (!($("#ibx_cnfYn01").val() == "Y" && $("#ibx_cnfYn01").val() == "Y")){
												$.fn.msgBox("담당자 또는 부서장 상태를 확인하세요.");
												return;
											}
											opener.openModPopup_callback(reqParam);
											window.close();
										}
									}, 2);
								} else {
									window.close();
								}
								
							}
							
						}
					}).fail(function(data){
						$.fn.msgBox("데이터 저장이 실패했습니다.");
					});
				}
			}, 2);
		}
	});
	
	//팝업창 닫기
	$("#btn_closePopup").on("click", function(e){
		window.close();
	});
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
	var reqAssScCd = $("#sbx_assScCd").val();
	var reqOrgCd = $("#ibx_orgCd").val();
	var reqOrgNm = $("#ibx_orgNm").val();
	var reqGvncRvwRsltScCd = $("#sbx_gvncRvwRsltScCd").val();
	var reqRvwCntnt01 = $("#tar_opn").val();
	var reqRvwCntnt02 = $("#tar_rpl").val();
	var reqCnfYn01 = $("#ibx_cnfYn01").val();
	var reqCnfYn02 = $("#ibx_cnfYn02").val();
	var reqAprvYn01 = $("#ibx_aprvYn01").val();
	var reqAprvYn02 = $("#ibx_aprvYn02").val();
	var reqStts = gStts;
	var reqDiv = gDiv;
	
		
	obj["div"] = gDiv;
	obj["aplcBe"] = reqAplcBe;
	obj["assScCd"] = reqAssScCd;
	obj["orgCd"] = reqOrgCd;
	obj["gvncRvwRsltScCd"] = reqGvncRvwRsltScCd;
	obj["rvwCntnt01"] = reqRvwCntnt01;
	obj["rvwCntnt02"] = reqRvwCntnt02;
	obj["cnfYn01"] = reqCnfYn01;
	obj["cnfYn02"] = reqCnfYn02;
	obj["aprvYn01"] = reqAprvYn01;
	obj["aprvYn02"] = reqAprvYn02;
	obj["stts"] = reqStts;

//  파라미터 확인
/*	console.log(reqAplcBe);
	console.log(reqAssScCd);
	console.log(reqOrgCd);
	console.log(reqOrgNm);
	console.log(reqRvwCntnt01);
	console.log(reqRvwCntnt02);
	console.log(reqCnfYn01);
	console.log(reqCnfYn02);
	console.log(reqAprvYn01);
	console.log(reqAprvYn02);*/
//	console.log(reqAplcBe);
//	console.log(reqAssScCd);
//	console.log(reqOrgCd);
//	console.log("1  :: " +reqCnfYn01);
//	console.log("2  :: " +reqCnfYn02);
//	

	
	if($.fn.isEmpty(reqAplcBe)) {
		$.fn.msgBox("적용BE"  + "을(를) 입력하시기 바랍니다.");
		return false;
	}
	
	if($.fn.isEmpty(reqAssScCd)) {
		$.fn.msgBox("가정종류"  + "을(를) 입력하시기 바랍니다.");
		return false;
	}
	
	if($.fn.isEmpty(reqOrgCd)) {
		$.fn.msgBox("부서명"  + "을(를) 입력하시기 바랍니다.");
		return false;
	}
	
	return obj;

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