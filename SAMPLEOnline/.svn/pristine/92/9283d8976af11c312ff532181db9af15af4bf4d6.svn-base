/**
 * @시스템명: IFRS17
 * @업무명: 기말잔액검증 팝업
 * @설명: 기말잔액검증 팝업의 JS
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.17
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.11.17 최초작성
 */
let today = new Date();
var d = new Date(today.getFullYear(), today.getMonth(), "1");
d.setMonth(today.getMonth());

let year  = d.getFullYear();
let month = ("0" + (d.getMonth() + 1)).slice(-2);
const toYm = year + "-" + month;
var xlsx_popUpNm = opener.POPUP_INFO.name;
var xlsx_vrfItmNm = opener.POPUP_INFO.CUR_ROW_ITEM.vrfItmNm;

$(document).ready(function(){
	
	$("title").text(opener.POPUP_INFO.name);
	$(".popup_header h3").text(opener.POPUP_INFO.name);
	$("#vrfItmNm").html(opener.POPUP_INFO.CUR_ROW_ITEM.vrfItmNm);
	
	//event 초기화
	initEvent();

	//그리드 초기화	
	initGrid(opener.POPUP_INFO.CUR_ROW_ITEM.mapnScCd);
	
	//조회
	selectEpRamtVrfDtlList(opener.POPUP_INFO.CUR_ROW_ITEM);
});

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.17
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.11.17 최초작성
 */
function initEvent() {
		
	//닫기
	$("#btn_closePopup").on("click", function(e){
		popupClose();
	});
	
	//엑셀다운로드
	$("#btn_xlsdown").on("click", function(e){
		let fileName = xlsx_popUpNm + "_"
			         + xlsx_vrfItmNm + "_"
			         + $.replaceAll(toYm, '-','') 
		             + (((new Date()).getDate() < 10) ? "0" : "") + ((new Date()).getDate()) 
		             + ".xlsx";
		$.fn.exportGridExcel({
			id       : 'gridDiv', 
			fileName : fileName
		});
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.17
 * @최종변경일: 
 * @매개변수: val(1 : 원천데이터, 2 : 재무제표)
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.17 최초작성
 */
function initGrid(val){
	
	//그리드 destroy
	$("#gridDiv").jsGrid("destroy");
	
	//fields 세팅
	var fieldsArr = getGridFields(val);

	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 310,
		editing: false,
		sorting: true,
		paging: true,
		// 특정(소계) 행이면 "sub-total" css class를 append한다.
		rowClass: function(item, itemIndex) {
			if(item.scCd == "합  계") { return "sub-total"; }
		},
		fields : fieldsArr
	});	
	
	//그리드 생성
	gridObject.gridCreate();
	
}

/**
 * @설명: SAP금액, 원천테이블금액 목록 변경
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.17
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.17 최초작성
 */
function getGridFields(val) {
	var resultArr = [];

	if(val == "1") {
		resultArr = [
			{ name: "scCd", title:"테이블", css:"cell", type: "text", width: 80, align:"center"},
			{ name: "tbNm", title:"테이블명", css:"cell", type: "text", width: 120, align:"left"},
			{ name: "clumNm", title:"컬럼", css:"cell", type: "text", width: 100, align:"left"},
			{ name: "clumKraNm", title:"컬럼명", css:"cell", type: "text", width: 120, align:"left"},
			{ name: "amt", title:"금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			}
		];
	} else {
		resultArr = [
			{ name: "scCd", title:"계정", css:"cell", type: "text", width: 130, align:"center"},
			{ name: "acntNm", title:"계정명", css:"cell", type: "text", width: 300, align:"left"},
			{ name: "amt", title:"금액", css:"cell", type: "text", width: 150, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			}
		];
	}
	
	return resultArr;
}

/**
 * @설명: SAP금액, 원천테이블금액 목록 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.17
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.17 최초작성
 */
function selectEpRamtVrfDtlList(val) {
	console.log("[initSetInfo]val:" + JSON.stringify(val));
	
	let reqParam = {
		finYm			: val.finYm,
		vrfItmClsfId	: val.vrfItmClsfId,
		mapnScCd		: val.mapnScCd
	};
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/at/fiat114p/selectEpRamtVrfDtlList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		alert("데이터 불러오기 실패");
		console.log("fail to selectPbanVrfList !!");
	});
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.17
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.17 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}


/**
 * @설명: 팝업을 닫는다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.17
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.17 최초작성
 */
function popupClose() {
	window.close();
}