/**
 * @시스템명: IFRS17
 * @업무명: 배부결과리포트
 * @설명: 배부결과를 조회하여 보고서 다운로드하는 화면 JS
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.10
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  김정민 2021.03.10 최초작성
 *  김정민 2021.06.15 3차 소스표준화
 */

$(document).ready(function(){
	/*2021.04.30 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/*2021.06.15 화면명에 화면ID 추가*/
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	//마감종료년월 hide
	$(".cls_finYmTo").hide();
	
	//조회조건 초기화
	initSearchData();
	
	//event 초기화
	initEvent();
	
	//포커스(보고서 유형)
	$("#sbx_rprtTyp").focus();
});

/**
 * @설명: 조회조건 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.10
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.10 최초작성
 */
function initSearchData() {
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
	$("#ibx_finYm_from").val($.fn.monthFormat(year + month, "-"));
	$("#ibx_finYm_to").val($.fn.monthFormat(year + month, "-"));
}

/**
 * @설명: event 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.10
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.10 최초작성
 */
function initEvent() {
	//마감년월 입력창 blur & click
	$("#ibx_finYm_from, #ibx_finYm_to").on("blur", function(e) {
		var _this = this;
		
		//빈값 체크
		if($.fn.isEmpty(_this.value)) {
			return;
		}
		
		//날짜형식 체크
		if($.isValidYm(_this.value)) {
			$(_this).val($.fn.monthFormat(_this.value, "-"));
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.", function() {
				$(_this).focus();
			});
		}
	}).on("focus", function() {
		$(this).select();
	});
	
	//마감년월 입력창 keyup
	$("#ibx_finYm_from").on("keyup", function(e) {
		//enter key
		if(e.which === 13) {
			//보고서유형에 따라 마감종료년월로 이동
			var rprtTyp = $("#sbx_rprtTyp").val();
			if(rprtTyp == "02" || rprtTyp == "03") {
				$("#ibx_finYm_to").focus();
			}
		}
	});
	
	//마감년월 달력버튼 click
	$("#btn_finYm_from, #btn_finYm_to").on("click", function(e){
		var targetId = $(this).data("targetId");
		$("#" + targetId).datepicker("show");
	});
	
	//보고서 유형 change
	$("#sbx_rprtTyp").on("change", function(e){
		var rprtTyp = this.value;
		
		//마감종료년월 제어
		if(rprtTyp == "02" || rprtTyp == "03") {
			$(".cls_finYmTo").show();
		} else {
			$(".cls_finYmTo").hide();
		}
		
		//sub title 세팅
		var sbxText = $.fn.isEmpty(rprtTyp) ? "" : " - " + $("#sbx_rprtTyp option:selected").text();
		$("#txt_subTitle").text(sbxText);
		
		//그리드 세팅
		initGrid(rprtTyp);
	});
	
	//엑셀다운로드
	$("#btn_excel_download").on("click", function(e){
		//validate 체크
		if(!isValid()) { return; }
		
		var sbxText = $("#sbx_rprtTyp option:selected").text();
		var msg = "[" + sbxText + "] 엑셀다운로드 하시겠습니까?";
		$.fn.msgBox(msg, function(obj) {
			if(obj.btn_ok) {
				//보고서유형에 따른 사업비 보고서 내용 조회 후 다운로드
				selectWrkexRprt();
			}
		}, 2);
		
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.10
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.10 최초작성
 */
function initGrid(rprtTyp) {
	
	//그리드 destroy
	$("#gridDiv").jsGrid("destroy");
	
	//fields 세팅
	var fieldsArr = getGridFields(rprtTyp);
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 200,
		editing: false,
		sorting: false,
		paging: true,
		fields : fieldsArr
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 보고서유형에 따른 그리드 필드값을 리턴한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.10
 * @최종변경일: 
 * @매개변수: rprtTyp<string> : 레포트유형
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김정민 2021.03.10 최초작성
 */
function getGridFields(rprtTyp) {
	
	var resultArr = [];
	switch(rprtTyp) {
	case "01" : //금감원코드별 사업비 월계 현황
	case "02" : //금감원코드별 사업비 누계 현황
		resultArr = [
			{name: "itmNm01", title:"상품군", css:"cell", type: "text"},
			{name: "itmNm02", title:"상품코드", css:"cell", type: "text"},
			{name: "itmNm03", title:"상품명", css:"cell", type: "text"},
			{name: "amt01", title:"신계약비례수당", css:"cell", type: "text"},
			{name: "amt02", title:"신계약비례수당_대리점", css:"cell", type: "text"},
			{name: "amt03", title:"기타신계약비", css:"cell", type: "text"},
			{name: "amt04", title:"신계약비", css:"cell", type: "text"},
			{name: "amt05", title:"유지비", css:"cell", type: "text"},
			{name: "amt06", title:"손해조사비", css:"cell", type: "text"},
			{name: "amt07", title:"직접투자비용", css:"cell", type: "text"},
			{name: "amt08", title:"약대관련비용", css:"cell", type: "text"},
			{name: "amt09", title:"실제사업비계", css:"cell", type: "text"},
			{name: "amt10", title:"기타사업비_유지비", css:"cell", type: "text"},
			{name: "amt11", title:"기타사업비_재산관리비", css:"cell", type: "text"},
			{name: "amt12", title:"영업외손익", css:"cell", type: "text"}
		];
		break;
		
	case "03" : //금융위 보험산업장기전망 보고서
		resultArr = [
			{name: "itmNm01", title:"채널", css:"cell", type: "text"},
			{name: "itmNm02", title:"금감원상품코드", css:"cell", type: "text"},
			{name: "itmNm03", title:"보험코드", css:"cell", type: "text"},
			{name: "amt01", title:"초년도신계약비(DA_P)", css:"cell", type: "text"},
			{name: "amt02", title:"2차년도신계약비(DA_P)", css:"cell", type: "text"},
			{name: "amt03", title:"3차년도이상신계약비(DA_P)", css:"cell", type: "text"},
			{name: "amt04", title:"보험료유관신계약비", css:"cell", type: "text"},
			{name: "amt05", title:"초년도신계약비(DA_N)", css:"cell", type: "text"},
			{name: "amt06", title:"2차년도신계약비(DA_N)", css:"cell", type: "text"},
			{name: "amt07", title:"3차년도이상신계약비(DA_N)", css:"cell", type: "text"},
			{name: "amt08", title:"보험료무관신계약비", css:"cell", type: "text"},
			{name: "amt09", title:"초년도유지비", css:"cell", type: "text"},
			{name: "amt10", title:"2차년도유지비", css:"cell", type: "text"},
			{name: "amt11", title:"3차년도이상유지비", css:"cell", type: "text"},
			{name: "amt12", title:"유지비계", css:"cell", type: "text"},
			{name: "amt13", title:"초년도손해조사비", css:"cell", type: "text"},
			{name: "amt14", title:"2차년도손해조사비", css:"cell", type: "text"},
			{name: "amt15", title:"3차년도이상손해조사비", css:"cell", type: "text"},
			{name: "amt16", title:"손해조사비계", css:"cell", type: "text"},
			{name: "amt17", title:"초년도직접투자비용", css:"cell", type: "text"},
			{name: "amt18", title:"2차년직접투자비용", css:"cell", type: "text"},
			{name: "amt19", title:"3차년도이상직접투자비용", css:"cell", type: "text"},
			{name: "amt20", title:"직접투자비용계", css:"cell", type: "text"},
			{name: "amt21", title:"초년도약대관련비용", css:"cell", type: "text"},
			{name: "amt22", title:"2차년약대관련비용", css:"cell", type: "text"},
			{name: "amt23", title:"3차년도이상약대관련비용", css:"cell", type: "text"},
			{name: "amt24", title:"약대관련비용계", css:"cell", type: "text"},
			{name: "amt25", title:"사업비합계", css:"cell", type: "text"},
			{name: "amt26", title:"초년도기타사업비_유지비", css:"cell", type: "text"},
			{name: "amt27", title:"2차년기타사업비_유지비", css:"cell", type: "text"},
			{name: "amt28", title:"3차년도이상기타사업비_유지비", css:"cell", type: "text"},
			{name: "amt29", title:"기타사업비_유지비계", css:"cell", type: "text"},
			{name: "amt30", title:"초년도기타사업비_재산관리비", css:"cell", type: "text"},
			{name: "amt31", title:"2차년기타사업비_재산관리비", css:"cell", type: "text"},
			{name: "amt32", title:"3차년도이상기타사업비_재산관리비", css:"cell", type: "text"},
			{name: "amt33", title:"기타사업비_재산관리비계", css:"cell", type: "text"},
			{name: "amt34", title:"초년도영업외비용", css:"cell", type: "text"},
			{name: "amt35", title:"2차년영업외비용", css:"cell", type: "text"},
			{name: "amt36", title:"3차년도이상영업외비용", css:"cell", type: "text"},
			{name: "amt37", title:"영업외비용계", css:"cell", type: "text"}
		];
		break;
		
	case "04" : //금융위 보험산업장기전망 자료
		resultArr = [
			{name: "itmNm01", title:"채널", css:"cell", type: "text"},
			{name: "itmNm02", title:"보험코드", css:"cell", type: "text"},
			{name: "amt01", title:"유지비1", css:"cell", type: "text"},
			{name: "amt02", title:"유지비2", css:"cell", type: "text"},
			{name: "amt03", title:"손해조사비1", css:"cell", type: "text"},
			{name: "amt04", title:"손해조사비2", css:"cell", type: "text"}
		];
		
		//1차월1(DA_P) ~ 24차월2(DA_P) && 1차월1(DA_N) ~ 24차월2(DA_N) 세팅
		var arrP = new Array();	//DA_P차월 배열
		var arrN = new Array();	//DA_N차월 배열
		var strNumP = 5;		//DA_P차월 시작번호
		var strNumN = 58;		//DA_N차월 시작번호
		for (var i = 1; i < 25; i++) {
			for (var j = 1; j < 3; j++) {
				//5 ~ 52생성
				arrP.push({
					name: "amt" + (strNumP < 10 ? "0" : "") + strNumP,	//ex) amt05
					title:i + "차월"+ j + "(DA_P)",						//ex) 1차월1(DA_P)
					css:"cell",
					type: "text"
				});
				strNumP++;
				
				//58 ~ 105생성
				arrN.push({
					name: "amt" + strNumN,			//ex) amt58
					title:i + "차월"+ j + "(DA_N)",	//ex) 1차월1(DA_N)
					css:"cell",
					type: "text"
				});
				strNumN++;
			}
		}
		
		arrP.push(
			{name: "amt53", title:"24이후차월1(DA_P)", css:"cell", type: "text"},
			{name: "amt54", title:"24이후차월2(DA_P)", css:"cell", type: "text"},
			{name: "amt55", title:"신계약비계1(DA_P)", css:"cell", type: "text"},
			{name: "amt56", title:"신계약비계2(DA_P)", css:"cell", type: "text"},
			{name: "amt57", title:"신계약비(DA_P)계", css:"cell", type: "text"}
		);
		
		arrN.push(
			{name: "amt106", title:"24이후차월1(DA_N)", css:"cell", type: "text"},
			{name: "amt107", title:"24이후차월2(DA_N)", css:"cell", type: "text"},
			{name: "amt108", title:"신계약비계1(DA_N)", css:"cell", type: "text"},
			{name: "amt109", title:"신계약비계2(DA_N)", css:"cell", type: "text"},
			{name: "amt110", title:"신계약비(DA_N)계", css:"cell", type: "text"}
		);
		
		resultArr = resultArr.concat(arrP).concat(arrN);
		break;
	}
	
	return resultArr;
}

/**
 * @설명: 보고서유형에 따른 사업비 보고서 내용을 조회 후 파일다운로드 한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.10
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.10 최초작성
 */
function selectWrkexRprt() {
	//파라미터 세팅
	var reqParam = {};
	reqParam.rprtTyp = $("#sbx_rprtTyp").val();										//보고서유형
	reqParam.rprtTypNm = $("#sbx_rprtTyp option:selected").text();					//보고서유형명
	reqParam.finYmFrom = $.trim($("#ibx_finYm_from").val()).replaceAll("-", "");	//마감시작년월
	reqParam.finYmTo = $.trim($("#ibx_finYm_to").val()).replaceAll("-", "");		//마감종료년월
	
	//그리드 초기화
	resetGrid();
	
	$.callAjax(reqParam, "/ea/rt/eart211m/selectWrkexRprt.do")
	.done(function(data) {
		//Exception 발생 시, 공통 Message 제공
		if(data.result == "-1") { return; }
		
		//그리드 바인딩
		var listData = data.list;
		
		//목록건수 체트
		if(listData.length == 0) {
			$.fn.msgBox("조회된 항목이 없습니다.");
			return;
		}
		
		//그리드 데이터 세팅
		$("#gridDiv").jsGrid("loadData", listData).done(function() {
			//엑셀다운로드
			var finYm = reqParam.finYmFrom + ((reqParam.rprtTyp == "02" || reqParam.rprtTyp == "03") ? "-" + reqParam.finYmTo : "");
			var fileName = reqParam.rprtTypNm + "(" + finYm + ")" + "_" + getToday() + ".xlsx";
			$.fn.exportGridExcel({
				id: 'gridDiv', 
				fileName: fileName
			});
		});
		
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to selectWrkexRprt !!");
	});
}
/**
 * @설명: 저장 전 validation 체크
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.10
 * @최종변경일: 
 * @매개변수: 
 * @반환값: boolean
 * @개정이력: 
 *  김정민 2021.03.10 최초작성
 */
function isValid() {
	var rprtTyp = $("#sbx_rprtTyp").val();				//보고서유형
	var finYmFrom = $.trim($("#ibx_finYm_from").val());	//마감시작년월
	var finYmTo = $.trim($("#ibx_finYm_to").val());		//마감종료년월
	
	//필수값 체크
	if($.fn.isEmpty(rprtTyp)) {
		$.fn.msgBox("보고서유형은 필수입력항목입니다.", function() {
			$("#sbx_rprtTyp").focus();
		});
		return false;
	}
	
	if($.fn.isEmpty(finYmFrom)) {
		$.fn.msgBox("마감시작년월은 필수입력항목입니다.", function() {
			$("#ibx_finYm_from").focus();
		});
		return false;
	}
	
	//보고서유형에 따라 마감종료년월 체크
	if(rprtTyp == "02" || rprtTyp == "03") {
		if($.fn.isEmpty(finYmTo)) {
			$.fn.msgBox("마감종료년월은 필수입력항목입니다.", function() {
				$("#ibx_finYm_to").focus();
			});
			return false;
		}
	}
	
	//날짜형식 체크
	if(!$.isValidYm(finYmFrom)) {
		$.fn.msgBox("마감시작년월 입력값을 확인하세요.", function() {
			$("#ibx_finYm_from").focus();
		});
		
		return false;
	}
	
	//보고서유형에 따라 마감종료년월 체크
	if(rprtTyp == "02" || rprtTyp == "03") {
		//날짜형식 체크
		if(!$.isValidYm(finYmTo)) {
			$.fn.msgBox("마감종료년월 입력값을 확인하세요.", function() {
				$("#ibx_finYm_to").focus();
			});
			return false;
		}
		
		//시작년월-종료년월 비교
		finYmFrom = Number(finYmFrom.replaceAll("-", ""));
		finYmTo = Number(finYmTo.replaceAll("-", ""));
		if(finYmFrom > finYmTo) {
			$.fn.msgBox("마감시작년월이 마감종료년월보다 큽니다.\n마감시작년월을 확인하세요.", function() {
				$("#ibx_finYm_from").focus();
			});
			return false;
		}
	}
	
	return true;
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.10
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.03.10 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("option", "data", []);
	$("#gridDiv").jsGrid("reset");
}

/**
 * @설명: 오늘 날짜를 조회한다.(YYYYMMDDHH24MISS)
 * @최초작성자: 김정민
 * @최초작성일: 2021.03.12
 * @최종변경일: 
 * @매개변수: 
 * @반환값: result<string>
 * @개정이력: 
 *  김정민 2021.03.12 최초작성
 */
function getToday() {
	//자리수만큼 value의 좌측에 "0" 채움
	var fillZero = function(value, len) {
		var strNum = "" + value;
		while ( strNum.length < len ) {
			strNum = "0" + strNum;
		}
		return strNum;
	}
	
	var dt = new Date();
	var result = "";
	result += fillZero(dt.getFullYear(), 2);
	result += fillZero(dt.getMonth() + 1, 2);
	result += fillZero(dt.getDate(), 2);
	result += fillZero(dt.getHours(), 2);
	result += fillZero(dt.getMinutes(), 2);
	result += fillZero(dt.getSeconds(), 2);
	
	return result;
}
