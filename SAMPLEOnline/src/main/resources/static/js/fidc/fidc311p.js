/**
 * @시스템명: IFRS17
 * @업무명: 공시결과검증 팝업
 * @설명: 공시결과검증 팝업의 JS
 * @최초작성자: 황석현
 * @최초작성일: 2021.09.28
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.09.28 최초작성
 *  황석현 2021.10.05 엑셀 다운로드 버튼 추가
 */
let today = new Date();
var d = new Date(today.getFullYear(), today.getMonth(), "1");
d.setMonth(today.getMonth());

let year  = d.getFullYear();
let month = ("0" + (d.getMonth() + 1)).slice(-2);
const toYm = year + "-" + month;
var xlsx_popUpNm = opener.POPUP_INFO.name;
var xlsx_pbanNm = opener.POPUP_INFO.CUR_ROW_ITEM.pbanNm;
var xlsx_pbanItmNm = opener.POPUP_INFO.CUR_ROW_ITEM.pbanItmNm;
var xlsx_potflScCd = opener.POPUP_INFO.CUR_ROW_ITEM.potflScCd;

$(document).ready(function(){
	
	$("title").text(opener.POPUP_INFO.name);
	$(".popup_header h3").text(opener.POPUP_INFO.name);
	$("#pbanNm").html(opener.POPUP_INFO.CUR_ROW_ITEM.pbanNm);
	$("#pbanItmNm").html(opener.POPUP_INFO.CUR_ROW_ITEM.pbanItmNm);
	$("#potflScCd").html(opener.POPUP_INFO.CUR_ROW_ITEM.potflScCd);
	
	//event 초기화
	initEvent();

	//그리드 초기화	
	initGrid();
	
	//조회
	selectPbanVrfList(opener.POPUP_INFO.CUR_ROW_ITEM);
});

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.09.28
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.09.28 최초작성
 */
function initEvent() {
		
	//닫기
	$("#btn_closePopup").on("click", function(e){
		popupClose();
	});
	
	//엑셀다운로드
	$("#btn_xlsdown").on("click", function(e){
		let fileName = "공시결과검증_"
			         + xlsx_popUpNm + "_"
			         + xlsx_pbanNm + "_"
			         + xlsx_pbanItmNm + "_"
			         + xlsx_potflScCd + "_"
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
 * @최초작성일: 2021.09.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.09.28 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 300,
		editing: false,
		sorting: true,
		paging: true,
		// 특정(소계) 행이면 "sub-total" css class를 append한다.
		rowClass: function(item, itemIndex) {
			if(item.scCdNm == "합  계") { return "sub-total"; }
		},
		fields : [
			{ name: "scCdNm", title:"구분명", css:"cell", type: "text", width: 380, align:"left"},
			{ name: "amt", title:"금액", css:"cell", type: "text", width: 150, editing: false, align:"right",
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
 * @설명: 공시결과검증 목록 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.09.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.09.28 최초작성
 */
function selectPbanVrfList(val) {
	console.log("[initSetInfo]val:" + JSON.stringify(val));
	
	let reqParam = {
		finYm     : val.finYm,
		pbanNm    : val.pbanNm,
		pbanItmNm : val.pbanItmNm,
		potflScCd : val.potflScCd,
		scCd      : val.scCd
	};
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/dc/fidc311p/selectPbanVrfList.do")
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
 * @최초작성일: 2021.09.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.09.28 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}


/**
 * @설명: 팝업을 닫는다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.09.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.09.28 최초작성
 */
function popupClose() {
	window.close();
}