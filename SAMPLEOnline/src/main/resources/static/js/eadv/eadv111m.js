/**
 * @시스템명: IFRS17
 * @업무명: 사업비 배부기준 검증
 * @설명: 사업비배부기준 검증 데이터을 조회하는 화면의 JS
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.26
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  김정민 2021.01.26 최초작성
 *  김정민 2021.06.14 그리드 너비 수정
 *  김정민 2021.06.15 3차 소스표준화
 */
$(document).ready(function(){
	/*2021.04.30 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/*2021.06.15 화면명에 화면ID 추가*/
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	//공통코드 조회
	selectCommonCode();
	
	//조회조건 초기화
	initSearchData();
	
	//event 초기화
	initEvent();
	
	//2021.02.02 수정 :: 배부유형 콤보박스 이벤트를 강제발생하여 initGrid한다.
	//그리드 초기화
	//initGrid("1");
	
	//배부유형 change 이벤트 발생하여 그리드세팅, 조회조건세팅
	$("#sbx_wrkexDistTypCd").change();
	
	//포커스 select(마감년월)
	$("#ibx_finYm").select();
});

/**
 * @설명: 공통코드 조회
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.27 최초작성
 */
function selectCommonCode() {
	//공통코드 조회(사업비배부유형코드, 사업비채널코드)
	$.fn.loadCommonCode(["WRKEX_DIST_TYP_CD", "RAL_WRKEX_CHNL_CD"]);
	
	//사업비채널코드 DM, CC, CM 삭제
	var targetArr = $._commonObj["code"]["RAL_WRKEX_CHNL_CD"]; // 얕은복사
	for (var i = targetArr.length-1; i >= 0; i--) {
		if("DM" == targetArr[i]["code"] || "CC" == targetArr[i]["code"] || "CM" == targetArr[i]["code"]) {
			//참조하는 변수이므로, splice처리 후 결과값을 따로 세팅 안함
			targetArr.splice(i, 1);
		}
	}
	
	//콤보박스 세팅(사업비배부유형코드)
	$.fn.renderCombobox({
		codeArr: ["WRKEX_DIST_TYP_CD"],		//codeId 배열
		selArr: ["sbx_wrkexDistTypCd"],		//selectbox ID 배열
		useFirstOption: false				//첫번째 option 사용여부
	});
	
	//콤보박스 세팅(사업비채널코드)
	$.fn.renderCombobox({
		codeArr: ["RAL_WRKEX_CHNL_CD"],	//codeId 배열
		selArr: ["sbx_ralWrkexChnlCd"],	//selectbox ID 배열
		useFirstOption: true,			//첫번째 option 사용여부
		firstOptionText: "-전체-"		//첫번째 option Text
	});
}

/**
 * @설명: 조회조건 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.27 최초작성
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
	$("#ibx_finYm").val($.fn.monthFormat(year + month, "-"));
}

/**
 * @설명: event 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.26
 * @최종변경일: 
 * @개정이력: 
 *  김정민 2021.01.04 최초작성
 */
function initEvent() {
	//마감년월 입력창 blur & click
	$("#ibx_finYm").on("blur", function(e) {
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
	
	//마감년월 달력버튼 click
	$("#btn_finYm").on("click", function(e) {
		$("#ibx_finYm").datepicker("show");
	});
	
	//배부유형 콤보박스 change
	$("#sbx_wrkexDistTypCd").on("change", function(e) {
		var wrkexDistTypCd = $(this).val();

		ctlInqrCond(wrkexDistTypCd);	//배부유형에 맞는 조회조건 세팅
		reDrawGrid(wrkexDistTypCd);		//배부유형에 맞는 그리드 로딩
	});
	
	//사업비배부기초코드 버튼 click
	$("#btn_wrkexDistPryCd").on("click", function(e) {
		//사업비배부기초코드조회 팝업 호출
		openPopupWrkexDistPryCd();
	});
	
	//입력창 keyup(마감년월, 배부유형, 사업비배부기초코드, 사업비채널, 포트폴리오코드, 계약그룹ID, 계약번호)
	$(".search-item").find("input[type=text], select").on("keypress", function(e) {
		if(e.which == 13) {
			$("#btn_search").click();
			return false;
		}
	});

	//조회 버튼 click
	$("#btn_search").on("click", function(e) {
		selectWrkexDistStndProdList();
	});
	
	//엑셀다운로드 버튼 click
	$("#btn_excel_download").on("click", function(e) {
		//데이터 체크
		var dataList = $("#gridDiv").jsGrid("option", "data");
		if(dataList.length == 0) {
			$.fn.msgBox("조회된 항목이 없습니다.");
			return;
		}
		
		//엑셀다운로드
		var sbxText = $("#sbx_wrkexDistTypCd option:selected").text();
		var fileName = $(".main_title h3.title").text() + "(" + sbxText + ")_" + getToday() + ".xlsx";
		$.fn.exportGridExcel({
			id: 'gridDiv', 
			fileName: fileName
		});
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.04
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.04 최초작성
 */
function initGrid(wrkexDistTypCd){

	//사업비배부유형코드에 따른 그리드 필드 세팅
	var fieldsArr = getGridFields(wrkexDistTypCd);
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 600,
		editing: false,
		sorting: true,
		paging: true,
		// 특정(소계) 행이면 "sub-total" css class를 append한다.
		rowClass: function(item, itemIndex) {
			//포트폴리오별, 계약그룹별 소계 css 세팅
			switch(wrkexDistTypCd) {
			case "2":
				if(item.potflScCd == "소계") { return "sub-total"; }
				break;
			case "3":
				if(item.congrId == "소계") { return "sub-total"; }
				break;
			}
		},
		fields : fieldsArr
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 사업비배부기준산출 목록을 조회한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.27 최초작성
 */
function selectWrkexDistStndProdList() {
	//validate 체크
	if(!isValid()) { return; }
	
	//파라미터 세팅
	var reqParam = {};
	reqParam.finYm = $("#ibx_finYm").val().replace(/-/g, "");	//마감년월
	reqParam.wrkexDistTypCd = $("#sbx_wrkexDistTypCd").val();	//사업비배부유형코드
	reqParam.wrkexDistPryCd = $("#ibx_wrkexDistPryCd").val();	//사업비배부기초코드
	reqParam.ralWrkexChnlCd = $("#sbx_ralWrkexChnlCd").val();	//사업비채널
	reqParam.potflScCd = $("#ibx_potflScCd").val();				//포트폴리오코드
	reqParam.congrId = $("#ibx_congrId").val();					//계약그룹ID
	reqParam.contNo = $("#ibx_contNo").val();					//계약번호
	
	//그리드 초기화
	resetGrid();

	$.callAjax(reqParam, "/ea/dv/eadv111m/selectWrkexDistStndProdList.do")
	.done(function(data) {
		//Exception 발생 시, 공통 Message 제공
		if(data.result == "-1") { return; }
		
		//그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		/*2021.06.15 0건 그리드 메세지 처리*/
		if(listData.length == 0) {
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to selectWrkexDistStndProdList !!");
	});
}

/**
 * @설명: 사업비배부기초코드조회 팝업을 호출한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수:  
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.27 최초작성
 */
function openPopupWrkexDistPryCd() {
	var popupOption = {
		url: "/ea/dv/eadv111p.do",
		name: "사업비배부기초코드조회 팝업",
		width: 700,
		height: 432
	}
	
	//※참고) 팝업콜백함수: openPopupWrkexDistPryCd_callback
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 사업비배부기초코드조회 팝업 콜백
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.27 최초작성
 */
function openPopupWrkexDistPryCd_callback(resultObj) {
	//사업비배부기초코드 입력창 값 세팅
	$("#ibx_wrkexDistPryCd").val(resultObj.wrkexDistPryCd);
	
	//그리드 초기화
	resetGrid();
}

/**
 * @설명: 조회 전 validation 체크
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수: 
 * @반환값: boolean
 * @개정이력: 
 *  김정민 2021.01.27 최초작성
 */
function isValid() {
	var finYm = $("#ibx_finYm").val();						//마감년월
	var wrkexDistTypCd = $("#sbx_wrkexDistTypCd").val();	//사업비배부유형코드
	
	if($.fn.isEmpty(finYm)) {
		$.fn.msgBox("마감년월은 필수입력항목입니다.", function() {
			$("#ibx_finYm").focus();
		});
		return false;
	}
	if($.fn.isEmpty(wrkexDistTypCd)) {
		$.fn.msgBox("배부유형은 필수선택항목입니다.", function() {
			$("#sbx_wrkexDistTypCd").focus();
		});
		return false;
	}
	
	//날짜형식 체크
	if(!$.isValidYm(finYm)) {
		$.fn.msgBox("마감년월 입력값을 확인하세요.", function() {
			$("#ibx_finYm").focus();
		});
		return false;
	}
	
	return true;
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.28 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("option", "data", []);
	$("#gridDiv").jsGrid("reset");
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.27 최초작성
 */
function reDrawGrid(wrkexDistTypCd) {
	
	//그리드 destroy
	$("#gridDiv").jsGrid("destroy");
	
	//그리드 create
	initGrid(wrkexDistTypCd);
}

/**
 * @설명: 사업비배부유형코드에 따른 그리드 필드값을 리턴한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수: type<string> : 사업비배부유형코드(1:채널별, 2:PF별, 3:계약그룹별, 4:증번별, 5:주특별)
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김정민 2021.01.27 최초작성
 */
function getGridFields(type) {
	
	//==========================================================
	//필드항목 정의 START
	//==========================================================
	//그리드 공통부분 필드
	var resultArr = [
		{ name: "finYm", title:"마감년월", css:"cell", type: "text", width: 70, align:"center", sorter:"number", itemTemplate:function(value, item) {
			return $.fn.monthFormat(value, "-");			
		}},
		{ name: "wrkexDistPryCd", title:"기초코드", css:"cell", type: "text", width: 80, align:"center", sorter:"number"},
		{ name: "wrkexDistPryCdNm", title:"기초코드명", css:"cell", type: "text", width: 220, align:"left"}
	];
	//사업비채널코드 필드
	var ralWrkexChnlCdInfo = { name: "ralWrkexChnlCd", title:"사업비채널코드", css:"cell", type: "select", width: 105, align:"center",
		items: $.fn.getGridCodeItem("RAL_WRKEX_CHNL_CD", false), textField: "codeNm", valueField: "code"
	};
	//포트폴리오코드 필드
	var potflScCdInfo = { name: "potflScCd", title:"포트폴리오코드", css:"cell", type: "text", width: 100, align:"center"};
	//계약그룹ID 필드
	var congrIdInfo = { name: "congrId", title:"계약그룹ID", css:"cell", type: "text", width: 130, align:"center"};
	//계약번호 필드
	var contNoInfo = { name: "contNo", title:"계약번호", css:"cell", type: "text", width: 85, align:"center", sorter:"number"};
	//보험ID 필드
	var insrIdInfo = { name: "insrId", title:"보험ID", css:"cell", type: "text", width: 170, align:"center", sorter:"number"};
	//기초값 필드
	var distStndValInfo = {name: "distStndVal", title:"기초값", css:"cell", type: "text", width: 140, align:"right", sorter:"number", itemTemplate:function(value, item) {
		return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
	}};
	//비율 필드
	var distStndRtoInfo = {name: "distStndRto", title:"비율(%)", css:"cell", type: "text", width: 80, align:"right", sorter:"number", itemTemplate:function(value, item) {
		var rtn = "";
		if($.fn.isEmpty(value)) {
			//value가 number 타입인 0으로 들어올 경우, 추가 처리
			if(typeof value === "number" && value == 0) {
				rtn = "0";
			}
		} else {
			rtn = $.addCommaNumber(value.toString());
		}
		return rtn;
	}};
	//합계 필드
	var smtotInfo = { name: "smtot", title:"합계", css:"cell", type: "text",  width: 140, align:"right", sorter:"number", itemTemplate:function(value, item) {
		return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
	}};
	//==========================================================
	//필드항목 정의 END
	//==========================================================
	
	switch(type) {
	case "1": //채널별
		//채널필드 세팅
		var targetArr = ["FC", "BA", "CA", "GA", "GB", "PA", "AR"];
		var fieldsArr = getFieldsArr(targetArr);
		resultArr = resultArr.concat(fieldsArr);
		
		//합계세팅
		resultArr.push(smtotInfo);

		break;
	
	case "2": //PF별
		//필드세팅(사업비채널코드, 포트폴리오코드, 기초값, 비율)
		var fieldsArr = [ralWrkexChnlCdInfo, potflScCdInfo, distStndValInfo, distStndRtoInfo];
		resultArr = resultArr.concat(fieldsArr);
		break;
		
	case "3": //계약그룹별
		//필드세팅(사업비채널코드, 포트폴리오코드, 계약그룹ID, 기초값, 비율)
		var fieldsArr = [ralWrkexChnlCdInfo, potflScCdInfo, congrIdInfo, distStndValInfo, distStndRtoInfo];
		resultArr = resultArr.concat(fieldsArr);
		break;
		
	case "4": //증번별
		//필드세팅(사업비채널코드, 포트폴리오코드, 계약그룹ID, 계약번호, 기초값, 비율)
		var fieldsArr = [ralWrkexChnlCdInfo, potflScCdInfo, congrIdInfo, contNoInfo, distStndValInfo, distStndRtoInfo];
		resultArr = resultArr.concat(fieldsArr);
		break;
		
	case "5": //주특별
		//필드세팅(사업비채널코드, 포트폴리오코드, 계약그룹ID, 계약번호, 보험ID, 기초값, 비율)
		var fieldsArr = [ralWrkexChnlCdInfo, potflScCdInfo, congrIdInfo, contNoInfo, insrIdInfo, distStndValInfo, distStndRtoInfo];
		resultArr = resultArr.concat(fieldsArr);
		break;
	}
	
	return resultArr;
}

/**
 * @설명: 유형의 배열을 기준으로 그리드 필드 배열을 생성하여 리턴한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.29
 * @최종변경일: 
 * @매개변수: targetArr<array> : 유형(채널 or PF) 배열
 * @반환값: resultArr<array> : 그리드필드배열
 * @개정이력: 
 *  김정민 2021.01.29 최초작성
 */
function getFieldsArr(targetArr) {
	if($.fn.isEmpty(targetArr)) {
		return [];
	}
	
	var resultArr = [];
	
	for (var i = 0; i < targetArr.length; i++) {
		var target = targetArr[i];
		var distStndValField = { name: target.toLowerCase() + "DistStndVal", title: target + "기초값", css:"cell", type: "text",  width: 140, align:"right", sorter:"number", itemTemplate:function(value, item) {
			value = $.fn.isEmpty(value) ? "0" : value.toString();
			return $.addCommaNumber(value);
		}};
		var distStndRtoField = { name: target.toLowerCase() + "DistStndRto", title: target + "비율(%)", css:"cell", type: "text",  width: 90, align:"right", sorter:"number", itemTemplate:function(value, item) {
			return $.fn.isEmpty(value) ? "0" : value;
		}};
		
		resultArr.push(distStndValField);
		resultArr.push(distStndRtoField);
	}
	
	return resultArr;
}

/**
 * @설명: 배부유형에 따라 조회조건 필드 세팅
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.02 최초작성
 */
function ctlInqrCond(wrkexDistTypCd) {
	switch(wrkexDistTypCd) {
	case "1" :	//채널별
		$("#ibx_wrkexDistPryCd").val("");							//사업비배부기초코드
		$("#sbx_ralWrkexChnlCd").attr("disabled", true).val("");	//사업비채널코드
		$("#ibx_potflScCd").attr("disabled", true).val("");			//포트폴리오코드
		$("#ibx_congrId").attr("disabled", true).val("");			//계약그룹ID
		$("#ibx_contNo").attr("disabled", true).val("");			//계약번호
		$("#spn_guide").hide();										//가이드 숨김
		break;
		
	case "2" :	//PF별
		$("#ibx_wrkexDistPryCd").val("");							//사업비배부기초코드
		$("#sbx_ralWrkexChnlCd").attr("disabled", false).val("");	//사업비채널코드
		$("#ibx_potflScCd").attr("disabled", false).val("");		//포트폴리오코드
		$("#ibx_congrId").attr("disabled", true).val("");			//계약그룹ID
		$("#ibx_contNo").attr("disabled", true).val("");			//계약번호
		$("#spn_guide").hide();										//가이드 숨김
		break;
		
	case "3" :	//계약그룹ID별
		$("#ibx_wrkexDistPryCd").val("");							//사업비배부기초코드
		$("#sbx_ralWrkexChnlCd").attr("disabled", false).val("");	//사업비채널코드
		$("#ibx_potflScCd").attr("disabled", false).val("");		//포트폴리오코드
		$("#ibx_congrId").attr("disabled", false).val("");			//계약그룹ID
		$("#ibx_contNo").attr("disabled", true).val("");			//계약번호
		$("#spn_guide").hide();										//가이드 숨김
		break;
		
	case "4" :	//증번별
		$("#ibx_wrkexDistPryCd").val("");							//사업비배부기초코드
		$("#sbx_ralWrkexChnlCd").attr("disabled", true).val("");	//사업비채널코드
		$("#ibx_potflScCd").attr("disabled", true).val("");			//포트폴리오코드
		$("#ibx_congrId").attr("disabled", true).val("");			//계약그룹ID
		$("#ibx_contNo").attr("disabled", false).val("");			//계약번호
		$("#spn_guide").show();										//가이드 보임
		break;
		
	case "5" :	//주특별
		$("#ibx_wrkexDistPryCd").val("");							//사업비배부기초코드
		$("#sbx_ralWrkexChnlCd").attr("disabled", true).val("");	//사업비채널코드
		$("#ibx_potflScCd").attr("disabled", true).val("");			//포트폴리오코드
		$("#ibx_congrId").attr("disabled", true).val("");			//계약그룹ID
		$("#ibx_contNo").attr("disabled", false).val("");			//계약번호
		$("#spn_guide").show();										//가이드 보임
		break;
		
	default :
		$("#ibx_wrkexDistPryCd").val("");							//사업비배부기초코드
		$("#sbx_ralWrkexChnlCd").attr("disabled", true).val("");	//사업비채널코드
		$("#ibx_potflScCd").attr("disabled", true).val("");			//포트폴리오코드
		$("#ibx_congrId").attr("disabled", true).val("");			//계약그룹ID
		$("#ibx_contNo").attr("disabled", true).val("");			//계약번호
		$("#spn_guide").hide();										//가이드 숨김
		break;
		
	}
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
