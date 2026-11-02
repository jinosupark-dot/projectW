/**
 * @시스템명: IFRS17
 * @업무명: 공시결과집계
 * @설명: 공시결과집계
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.23
 * @최종변경일:
 * @개정이력:
 *  이상범    2021.02.23.   최초작성
 *  이상범    2021.04.26.   2차 표준화
 *  이상범    2021.06.16.   3차 표준화
 *  황석현    2021.12.13.   공통코드 통합수준구분코드(UNTY_LV_SC_CD) 수정
 */

let today = new Date();
var d = new Date(today.getFullYear(), today.getMonth(), "1");
d.setMonth(today.getMonth());

let year  = d.getFullYear();
let month = ("0" + (d.getMonth() + 1)).slice(-2);
const toYm = year + "-" + month;
var perBtnId = ["btn_batAccoRamtSmup", "btn_batIvtPfnlsProd", "btn_batPbanRsltSmup"];
	
$(document).ready(function(){
	
	//button permission
	var arrPerBtn = new Array();
	for(var i=0; i<perBtnId.length; i++){
		var perBtn = new Object();
		perBtn.btnId  = "#" + perBtnId[i];
		perBtn.action = "R";
		arrPerBtn.push(perBtn);
	}
	$.fn.setBtnPermission(arrPerBtn);
	
	if(!$("#" + perBtnId[0]).is(":visible")){
		$(".info-box").find(".clearfix").hide();
	}
	
	//툴팁
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");

	//공통코드(통합수준코드) 콤보박스
	initCommCd();
	
	//event 초기화(엑셀업,다운로드,조회,저장)
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	$("#inp_finYm").focus();
	
});

/**
 * @설명: 공통코드성 조회 
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.23
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initCommCd() {
	
	//공통코드 조회(통합수준코드)
	$.fn.loadCommonCode(["UNTY_LV_SC_CD"]);
	let commObj = $._commonObj.code.UNTY_LV_SC_CD;

	//통합수준코드 콤보박스 세팅
	$.fn.renderCombobox({
		useFirstOption  : true,
		firstOptionText : "-전체-",
		codeArr         : ["UNTY_LV_SC_CD"],
		selArr          : ["srch_sbx_untyLvScCdDtl"]
	});
	
	//공시,포트폴리오 콤보박스 세팅
	selectSrchCdList("PBAN_SC_CD", "srch_sbx_pbanScCd", "");   //공시구분 콤보박스세팅
	selectSrchCdList("POTFL_SC_CD", "srch_sbx_potflScCd", ""); //포트폴리오 콤보박스세팅
}

/**
 * @설명: event 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.23
 * @최종변경일: 
 * @개정이력: 
 */
function initEvent() {
	//배치 마감년월 셋팅
	$("#inp_batFinYm").val(toYm);
	let calObjBat = $("#inp_batFinYm");
	calObjBat.val(toYm);
	calObjBat.on("click", function(e){
		$(this).data.prvdate = $(this).val();
		$(this).val("");
	}).on("focusout", function(e){
		if($(this).val() == "") $(this).val($(this).data.prvdate);
	}).on("keyup", function(e){
		let inDt = $(this).val();
		if(inDt.length == 5 && inDt.substring(4,5) != "-"){
			$(this).val(inDt.substring(0,4) + "-" + inDt.substring(4));
		}
	});
	
	//조회 마감년월 현재월 셋팅
	$("#inp_finYm").val(toYm);
	let calObj = $("#inp_finYm");
	calObj.val(toYm);
	calObj.on("click", function(e){
		$(this).data.prvdate = $(this).val();
		$(this).select();
	}).on("dblclick", function(e){
		$(this).select();	
	}).on("focusout", function(e){
		if($(this).val() == "") $(this).val($(this).data.prvdate);
	}).on("keyup", function(e){
		let inDt = $(this).val();
		if(inDt.length == 5 && inDt.substring(4,5) != "-"){
			$(this).val(inDt.substring(0,4) + "-" + inDt.substring(4));
		}
	}).on("keypress", function(e){
		if(e.keyCode == 13){
			selectPbanRsltSmupList();
		}
	});
	
	let wd = [];
	$(".search-item").find(".search-item-inner").each(function(index, val){
		$(this).find(".item").each(function(idx, val){
			if(index == 0) wd[idx] = 0;
			wd[idx] = (wd[idx] < $(this).find("p").outerWidth()) ? $(this).find("p").outerWidth() : wd[idx];
		});
	});
	$(".search-item").find(".search-item-inner").each(function(){
		$(this).find(".item").each(function(idx, val){
			$(this).find("p").width(wd[idx]-10 + 'px');
		});
	});

	//조회
	$("#btn_search").on("click", function(e){
		selectPbanRsltSmupList(); //조회
	});
	
	//엑셀다운로드(타이틀_일자YYYYMMDD.xlsx)
	$("#btn_xlsdown").on("click", function(e){
		let fileName = "공시결과집계_" 
			         + $.replaceAll(toYm, '-','') 
		             + (((new Date()).getDate() < 10) ? "0" : "") + ((new Date()).getDate()) 
		             + ".xlsx";
		$.fn.exportGridExcel({
			id       : 'gridDiv', 
			fileName : fileName
		});
	});
	
	//배치실행
	$("#btn_batAccoRamtSmup,#btn_batIvtPfnlsProd,#btn_batPbanRsltSmup").on("click", function(e){
		selectBatPryDtChkList($(this)); 
	});
	
	$(".search-item").find("select").on("keypress", function(e){
		if(e.keyCode == 13){
			$("#btn_search").click();
			return false;
		}
	});

}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.23
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initGrid(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id              : "gridDiv",
		height          : 500,
		editing         : false,
		sorting         : false,
		paging          : true,
		confirmDeleting : false,
		fields : [
			{ name: "finYm", title:"마감년월", css:"cell", type: "text", width: 80, editing: false, align:"center",
				itemTemplate:function(value, item) {
					return $.fn.monthFormat(value, "-");
				}
			},
			{ name: "pbanScCd"   , title:"공시구분코드" , css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "pbanNm"     , title:"공시명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "pbanItmScCd", title:"공시항목구분코드", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "pbanItmNm"  , title:"공시항목명", css:"cell", type: "text", width: 500, editing: false, align:"left"},
			{ name: "whlCongrId" , title:"계약집합ID", css:"cell", type: "text", width: 120, editing: false, align:"center"},
			{ name: "potflScCd"  , title:"포트폴리오구분코드", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "potflNm"    , title:"포트폴리오명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "prftyScCd"  , title:"수익성구분코드", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "cnvrMthCd"  , title:"전환방법코드", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "untyLvScCd" , title:"통합수준코드", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "untyLvNm"   , title:"통합수준", css:"cell", type: "text", width: 250, editing: false, align:"left"},
			{ name: "pbanSmupAmt", title:"금액", css:"cell", type: "text", width: 150, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			}
		]
	});	

	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 조회 항목코드를 조회
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.23
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectSrchCdList(codeId, selId, val) {
	let reqParam = {};
	$._commonObj.code[codeId] = [];
	
	$.fn.renderCombobox({
		useFirstOption  : true,
		codeArr         : [codeId],
		selArr          : [selId]
	});
	
	//포트폴리오,공시구분 target url
	let trgUrl = "/fi/dc/fidc211m/selectPotflScCdList.do";
	if(codeId == "PBAN_SC_CD") trgUrl = "/fi/dc/fidc112m/selectPbanScCdList.do";

	// 데이터 조회
	$.callAjax(reqParam, trgUrl,{async:false})
	.done(function(data) {
		var cdList = new Array();
		
		//요청된 셀렉트박스 적용
		if(codeId == "PBAN_SC_CD"){
			var newCdList = new Array();
			for(let i=0; i<data.list.length; i++){
				//공시구분일때 투자손익 항목을 강제 추가
				if(i == 0) newCdList.push({
					code        : "A6",
					codeAbbrNm  : "투자손익",
					codeId      : "PBAN_SC_CD",
					codeNm      : "투자손익"
				});
				newCdList.push(data.list[i]);
			}
			cdList = newCdList;
		} else {
			cdList = data.list;
		} 

		$._commonObj.code[codeId] = cdList;

		$.fn.renderCombobox({
			useFirstOption  : true,
			firstOptionText : "-전체-",
			codeArr         : [codeId],
			selArr          : [selId]
		});
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulRlList !!");
	});
}

/**
 * @설명: 공시결과집계 조회
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.23
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectPbanRsltSmupList() {
	if(isEmpty($('#inp_finYm').val())) {
		$.fn.msgBox("조회 마감년월을 입력하세요.");
		return false;
	}
	
	//조회값 셋팅
	let reqParam = {
			srchFinYm       : $.replaceAll($("#inp_finYm").val(), '-',''),
			srchPbanScCd    : $("#srch_sbx_pbanScCd").val(),
			srchPotflScCd   : $("#srch_sbx_potflScCd").val(),
			srchUntyLvScCd  : $("#srch_sbx_untyLvScCdDtl").val()
	};
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/dc/fidc211m/selectPbanRsltSmupList.do")
	.done(function(data) {
		
		resetGrid(); // 그리드 초기화
		$("#gridDiv").jsGrid("loadData", data.list).done(function(){ }); //그리드 바인딩
		
		//0건 그리드 메세지 처리
		if(data.list.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulRlList !!");
	});
}

/**
 * @설명: 공시배치 수행건수 조회
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.23
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectBatPryDtChkList(vObj) {
	
	if($.fn.isEmpty(vObj)) return;
	
	//실행버튼 object의 id값 
	let id = "#" + vObj.attr("id");
	let nm = vObj.data().batName;
	if(isEmpty($('#inp_batFinYm').val())) {
		$.fn.msgBox("[" + ($(id + " > span").html()) + "] 배치 작업 마감년월을 입력하세요.");
		return false;
	}
	
	//조회값 셋팅
	let vBatFinYm = $('#inp_batFinYm').val().trim();
	let reqParam = {
			batFinYm : $.replaceAll(vBatFinYm, '-','')
	};
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/dc/fidc211m/selectBatPryDtChkList.do",{async:false})
	.done(function(data) {

		//IFRS17계정잔액집계 또는 투자손익산출일때 공시집계결과항목의 건수를 체크
		let msg = "";
		if(nm == "ACCO_RAMT_SMUP" || nm == "IVT_PFNLS_PROD"){
			for(let i=0;i<data.list.length;i++){
				if(data.list[i].prcsNm == "PBAN_RSLT_SMUP"){
					if(data.list[i].cnt > 0){
						msg =  "[" + data.list[i].trtDtm + "] 에 등록된<br>" 
						msg += $.replaceAll(vBatFinYm, '-','년') 
						msg += "월 공시결과집계 데이터가 있습니다.<br> 삭제 후 ";
					}
					break;
				}
			}
			
			savePbanRsltSmup(vObj, msg);
		} 
		//공시결과집계일때 IFRS17계정잔액집계,투자손익산출 건수를 체크
		else {
			let accoChk = true;
			let msgTxtSc = ""; 
			for(let i=0;i<data.list.length;i++){
				let vPrcsNm = data.list[i].prcsNm; 
				if(vPrcsNm != "PBAN_RSLT_SMUP"){
					if(data.list[i].cnt == 0){
						let msgTxt = "";
						if(vPrcsNm.indexOf("ACCO_RAMT_SMUP") > -1){
							msgTxtSc += (msgTxtSc == "") ? "" : ",";
							msgTxtSc += (vPrcsNm == "PBAN_ACCO_RAMT_SMUP") ? "공시" : "분개"; 
							
							if(!accoChk) continue;
							
							accoChk = false;
							msgTxt = "IFRS계정잔액집계(#)";
							
						}
						else if(vPrcsNm == "IVT_PFNLS_PROD") msgTxt = "투자손익산출";
						
						msg += (msgTxt != "") ? ((msg != "") ? ", " + msgTxt : msgTxt) : ""; 
					}
				}
			}
			
			if(msg != ""){
				if(msgTxtSc != "") msg = msg.replace("#", msgTxtSc);
				$.fn.msgBox("[" + $.replaceAll(vBatFinYm, '-','년') + "월] 공시결과집계에 필요한 <br>" + msg + " 데이터가 없습니다.");
			} else {
				savePbanRsltSmup(vObj, "");
			}
		}
		

	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulRlList !!");
	});
}

/**
 * @설명: 배치실행 처리
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.23
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 */
function savePbanRsltSmup(obj, vmsg){
	if($.fn.isEmpty(obj)) return;
	
	//실행버튼 object의 id값 
	let id = "#" + obj.attr("id");
	if(isEmpty($('#inp_batFinYm').val())) {
		$.fn.msgBox("[" + ($(id + " > span").html()) + "] 배치 작업 마감년월을 입력하세요.");
		return false;
	}
	 
	let reqParam = {
			batName  : obj.data().batName,
			batFinYm : $.replaceAll($('#inp_batFinYm').val().trim(), '-','')
	};	
	let msg = vmsg + ($(id + " > span").html()) + " 배치 작업을 실행 하시겠습니까?";

	$.fn.msgBox(msg, function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/dc/fidc211m/prctPbanRsltSmup.do")
			.done(function(data) {
				
				//BATCH result : 0:성공, 1:실패
				if(!isEmpty(data.jsonView) && data.jsonView.result == "0") {
					$.fn.msgBox(vmsg + ($(id + " > span").html()) + " 배치 작업을 정상적으로 요청하였습니다.");
				} else {
					let msg = $.fn.isEmpty(data.warnning) ? "집계 배치 실행 도중 오류가 발생하였습니다." : data.warnning.errorMessage;
					$.fn.msgBox(msg);
				}
				
			}).fail(function(data){
				$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
				console.log("fail to execOnlineBat !!");
			});
		}
	}, 2);
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.23
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}

function isEmpty(value) {
	return typeof value === "undefined" || value == null || value == "" ? true : false;
}