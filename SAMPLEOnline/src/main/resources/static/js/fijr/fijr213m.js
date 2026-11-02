/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-미수/미지급대상조회
 * @설명: 미수/미지급대상조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.03
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.03.03 최초작성
 *  황석현 2021.04.28 2차 표준화
 *  황석현 2021.06.15 3차 표준화
 */
var perBtnId = ["btn_dtCret"];

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
	
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	//event 초기화
	initEvent();
	
	//마감년월 초기화
	initYymm();
	
	//그리드 초기화	
	initGrid();
	
	$("#ibx_finYm").select();
	
});

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.03.03 최초작성
 */
function initEvent() {
	
	//엑셀다운로드
	$("#btn_excel_download").on("click", function(e){
		var fileName = "재무회계_미수미지급집계" + ".xlsx";
		$.fn.exportGridExcel({
			id: 'gridDiv', 
			fileName: fileName
		});
	});
	
	//마감년월 입력창 blur
	$("#ibx_finYm").on("blur", function(e) {
		//빈값 체크
		if($.fn.isEmpty(this.value)) {
			return;
		}
		
		//날짜형식 체크
		if($.isValidYm(this.value)) {
			$(this).val($.fn.monthFormat(this.value, "-"));
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.");
			$(this).focus();
		}
	});

	// Enter키로 검색어 조회: #표준용엉한글명
	$("#ibx_finYm").on("keydown", function(e){
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidYm(this.value)) {
				$(this).val($.fn.monthFormat(this.value, "-"));
				
				selectList()
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		}
	});
	
	//마감년월 입력창 click
	$("#ibx_finYm").on("click", function(e){
		$(this).select();
	});
	
	//마감년월 달력버튼 click
	$("#btn_finYm").on("click", function(e){
		$("#ibx_finYm").datepicker("show");
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		selectList();
	});
	
	//데이터생성
	$("#btn_dtCret").on("click", function(e){
		callBatPrct();
	});

}

/**
 * @설명: 년월 설정
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.02 최초작성
 */
function initYymm() {
	//마감년월 - 전월
	var nowDate = new Date();
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth();
	
	var temp = new Date(year, month, "1");
	temp.setMonth(month - 1);
	
	year = temp.getFullYear();
	month = (temp.getMonth() + 1).toString();
	month = month.length == 1 ? "0" + month : month;
	
	//마감년월 세팅
	$("#ibx_finYm").val($.fn.monthFormat(year + month, "-"));
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.03 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 580,
		editing: false,
		sorting: true,
		paging: true,
		confirmDeleting: false,
		fields : [
			{ name: "potflScCd", title:"포트폴리오", css:"cell", type: "text", width: 75, editing: false, align:"center"},
			{ name: "potflNm", title:"포트폴리오명", css:"cell", type: "text", width: 175, editing: false, align:"left"},
			{ name: "prrcpPrm", title:"선수보험료", css:"cell", type: "number", width: 128, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "prrcpPrmLvyInt", title:"선수보험료부리이자", css:"cell", type: "text", width: 128, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "prrcpPrmDiscAmt", title:"선수보험료할인", css:"cell", type: "text", width: 128, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "insrUnpymAmt", title:"보험미지급", css:"cell", type: "text", width: 128, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "pllnNtrcvInt", title:"보험약관대출 미수이자", css:"cell", type: "text", width: 135, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "pllnPrrcpInt", title:"보험약관대출 선수이자", css:"cell", type: "text", width: 135, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "irrdtRdmpCst", title:"대손상각비용", css:"cell", type: "text", width: 128, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "unpymWrkex", title:"미지급사업비", css:"cell", type: "text", width: 128, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "rinsRcamt", title:"재보험 미수금", css:"cell", type: "text", width: 128, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "rinsUnpymAmt", title:"재보험 미지급", css:"cell", type: "text", width: 128, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}},
			{ name: "adpymCstAmt", title:"선급비용금액", css:"cell", type: "text", width: 128, editing: false, align:"right", itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}}
		]
	});	
	
	//그리드 생성
	gridObject.gridCreate();
	
}

/**
 * @설명: 미수미지급 데이터 조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: val
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.04 최초작성
 */
function selectList() {
	
	var finYm = $("#ibx_finYm").val();
	finYm = finYm.replace(/-/g, "");
	if(finYm.length != 6) {
		$.fn.msgBox("마감년월 입력값을 확인하세요.");
		return false;
	}
	
	var reqParam = {};
	reqParam.finYm = finYm;

	// 데이터 조회
	$.callAjax(reqParam, "/fi/jr/fijr213m/selectList.do")
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
		console.log("fail to selectList !!");
	});
	
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.04 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}

/**
 * @설명: 배치 실행
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.02
 * @최종변경일: 
 * @매개변수: val
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.02 최초작성
 */
function callBatPrct() {
	var finYm = $("#ibx_finYm").val();
	finYm = finYm.replace(/-/g, "");
	if(finYm.length != 6) {
		$.fn.msgBox("마감년월 입력값을 확인하세요.");
		return false;
	}
	
	finYm = finYm.substr(0, 4) + "년 " + finYm.substr(4, 2) + "월, ";
	
	var msg = "";
	var reqParam = {};
	reqParam.finYm = $("#ibx_finYm").val().replace(/-/g, "");
	reqParam.acntgBusnClsfCd = "50";
	reqParam.batId = "BTIFIJR001";
	
	msg = finYm + "미수/미지급 데이터 생성 작업을 하시겠습니까?";
	$.fn.msgBox(msg, function(obj) {
		if(obj.btn_ok) {

			// 배치 실행
			$.callAjax(reqParam, "/fi/jr/fijr211m/execOnlineBat.do")
			.done(function(data) {

				console.log("::: BATCH RETURN DATA ::: \n", JSON.stringify(data));
				
				//BATCH result : 0:성공, 1:실패
				if(data.result == "0") {
					$.fn.msgBox("정상적으로 배치 실행되었습니다.");
				} else {
					var msg = $.fn.isEmpty(data.errorMessage) ? "미수/미지급 데이터 생성 배치 실행 도중 오류가 발생하였습니다." : data.errorMessage;
					$.fn.msgBox(msg);
				}
				
			}).fail(function(data){
				$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
				console.log("fail to execOnlineBat !!");
			});
			
		}
	}, 2);
}