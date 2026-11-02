/**
 * @시스템명: IFRS17
 * @업무명: 기말잔액검증
 * @설명: 기말잔액검증
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.16
 * @최종변경일:
 * @개정이력: 
 *  황석현    2021.11.16.   최초작성
 */

//전역변수 선언
let today = new Date();
var d = new Date(today.getFullYear(), today.getMonth(), "1");
d.setMonth(today.getMonth());

let year  = d.getFullYear();
let month = ("0" + (d.getMonth() + 1)).slice(-2);
const toYm = year + "-" + month;

$(document).ready(function(){
	
	//툴팁
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	$("#inp_finYm").focus();
	$("#inp_finYm").select();
});

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.16
 * @최종변경일: 
 * @개정이력: 
 */
function initEvent() {
	
	//조회 마감년월 현재월 셋팅
	$("#inp_finYm").val(toYm);
	var calObj = $("#inp_finYm");
	calObj.val(toYm);
	calObj.on("click", function(e){
		$(this).data.prvdate = $(this).val();
		$(this).select();
	}).on("dblclick", function(e){
		$(this).select();
	}).on("focusout", function(e){
		if($(this).val() == "") $(this).val($(this).data.prvdate);
	}).on("keyup", function(e){
		var inDt = $(this).val();
		if(inDt.length == 5 && inDt.substring(4,5) != "-"){
			$(this).val(inDt.substring(0,4) + "-" + inDt.substring(4));
		}
	}).on("keypress", function(e){
		if(e.keyCode == 13){
			selectEpRamtVrfList();
		}
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		selectEpRamtVrfList();
	});

	//엑셀다운로드(타이틀_일자YYYYMMDD.xlsx)
	$("#btn_xlsdown").on("click", function(e){
		var fileName = "재무회계_AuditTrail_기말잔액검증_" 
			         + $.replaceAll(toYm, '-','') 
		             + (((new Date()).getDate() < 10) ? "0" : "") + ((new Date()).getDate()) 
		             + ".xlsx";
		$.fn.exportGridExcel({
			id       : 'gridDiv', 
			fileName : fileName
		});
	});
	
	$(".search-item").find("input[type=radio]").on("keypress", function(e){
		if(e.keyCode == 13){
			selectEpRamtVrfList();
			return false;
		}
	});
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.16
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id              : "gridDiv",
		height          : 630,
		editing         : false,
		sorting         : true,
		paging          : true,
		confirmDeleting : false,
		fields : [
			{ name: "finYm", title:"마감년월", css:"cell", type: "text", width: 150, editing: false, align:"center",
				itemTemplate:function(value, item) {
					return $.fn.monthFormat(value, "-");
				}
			},
			{ name: "vrfItmNm", title:"검증항목명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "sapAmt", title:"SAP금액(1)", css:"cell", type: "text", width: 150, editing: false, align:"right",
				itemTemplate:function(value, item) {
					if($.fn.isEmpty(value)) {
						value = "0";
					} else {
						value = $.addCommaNumber(value.toString());
					}
					var $aEl = $("<a>").attr("href", "javascript:void(0);").text(value).on("dblclick", function() {
						//팝업 조회값 셋팅
						let reqParam = {
								finYm     		: item.finYm,
								vrfItmClsfId	: item.vrfItmClsfId,
								vrfItmNm		: item.vrfItmNm,
								mapnScCd		: "2" // 재무제표
						};
						callPopup(reqParam);
					});
					return $("<div>").append($aEl);
				}
			},
			{ name: "srcAmt", title:"원천테이블금액(2)", css:"cell", type: "text", width: 200, editing: false, align:"right",
				itemTemplate:function(value, item) {
					if($.fn.isEmpty(value)) {
						value = "0";
					} else {
						value = $.addCommaNumber(value.toString());
					}
					var $aEl = $("<a>").attr("href", "javascript:void(0);").text(value).on("dblclick", function() {
						//팝업 조회값 셋팅
						let reqParam = {
								finYm     		: item.finYm,
								vrfItmClsfId	: item.vrfItmClsfId,
								vrfItmNm		: item.vrfItmNm,
								mapnScCd		: "1" // 원천데이터
						};
						callPopup(reqParam);
					});
					return $("<div>").append($aEl);
				}
			},
			{ name: "difAmt", title:"차이금액(1)-(2)", css:"cell", type: "text", width: 200, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			},
			{ name: "vrfItmClsfId", title:"검증항목분류ID", css:"cell", type: "text", width: 200, editing: false, align:"center", visible:false}
		]
	});
	
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 팝업 호출
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.17
 * @최종변경일: 
 * @매개변수: scCd, val 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.17 최초작성
 */
//전역변수 선언부
var POPUP_INFO = {};
function callPopup(val) {
	if(typeof val === "undefined" || val == null) return;
	
	var CUR_ROW_ITEM = null;
	CUR_ROW_ITEM = val;
	POPUP_INFO = {};
	
	POPUP_INFO = {
		url: "/fi/at/fiat114p.do",
		name: val.mapnScCd == "2" ? "기말잔액검증 - SAP금액(1)" : "기말잔액검증 - 원천테이블금액(2)",
		width: val.mapnScCd == "2" ? 650 : 850,
		height: 550,
		CUR_ROW_ITEM: val
	}
	$.fn.openPopup(POPUP_INFO);
}

/**
 * @설명: 기말잔액검증 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.16
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
function selectEpRamtVrfList() {
	
	if($.fn.isEmpty($('#inp_finYm').val())) {
		$.fn.msgBox("조회 마감년월을 입력하세요.");
		return false;
	}
	
	var reqParam = {
			finYm    : $.replaceAll($("#inp_finYm").val(), '-',''),
	};
	
	var rdoChkVal = $("input:radio[name='rad_useYn']:checked").val();
	if(rdoChkVal == "A"){
		reqParam["difAmtSrchYn"]  = "N";
	} else {
		reqParam["difAmtSrchYn"]  = "Y";
	}

	// 데이터 조회
	$.callAjax(reqParam, "/fi/at/fiat113m/selectEpRamtVrfList.do")
	.done(function(data) {
		
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		let listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulRlList !!");
	});
	
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.16
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}