/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-유동성위험
 * @설명: 유동성위험 화면
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.04
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.11.04 최초작성
 */

let today = new Date();
var d = new Date(today.getFullYear(), today.getMonth(), "1");
d.setMonth(today.getMonth());

let year  = d.getFullYear();
let month = ("0" + (d.getMonth() + 1)).slice(-2);
const toYm = year + "-" + month;

$(document).ready(function(){
	
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	$("#inp_finYm").select();
});

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.04
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.11.04 최초작성
 */
function initEvent() {
	//조회
	$("#btn_search").on("click", function(e){
		selectFludtRskList();
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
			$("#btn_search").click();
			return false;
		}
	});
	
	//엑셀다운로드(타이틀_일자YYYYMMDD.xlsx)
	$("#btn_xlsdown").on("click", function(e){
		let fileName = "유동성위험_" 
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
 * @최초작성일: 2021.11.04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.04 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 630,
		editing: false,
		sorting: true,
		paging: true,
		confirmDeleting: false,
		fields : [
			{ name: "potflScCd", title:"포트폴리오코드", css:"cell", type: "text", width: 65, editing: false, align:"center"},
			{ name: "potflNm", title:"포트폴리오명", css:"cell", type: "text", width: 120, editing: false, align:"left"},
			{ name: "amt01" , title:"1년이하금액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "amt02" , title:"1년초과 2년이하 금액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "amt03" , title:"2년초과 3년이하 금액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "amt04" , title:"3년초과 4년이하 금액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "amt05" , title:"4년초과 5년이하 금액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "amt06" , title:"5년초과 10년이하 금액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "amt07" , title:"10년초과금액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "totalAmt" , title:"합계", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "accbkAmt" , title:"장부금액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			}
		]
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 유동성위험 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.04 최초작성
 */
function selectFludtRskList() {
	if($.fn.isEmpty($("#inp_finYm").val())) {
		$.fn.msgBox("조회 마감년월을 입력하세요.");
		return false;
	}
	
	//조회값 셋팅
	let reqParam = {
			finYm       : $.replaceAll($("#inp_finYm").val(), '-','')
	};

	// 데이터 조회
	$.callAjax(reqParam, "/fi/dc/fidc413m/selectFludtRskList.do")
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
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectFludtRskList !!");
	});
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.04 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}