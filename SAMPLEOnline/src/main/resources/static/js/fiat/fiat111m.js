/**
 * @시스템명: IFRS17
 * @업무명: 잔액명세조회
 * @설명: 잔액명세 조회
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일:
 * @개정이력: 
 *  이상범    2021.03.08.   최초작성
 *  이상범    2021.04.26.   2차 표준화
 *  이상범    2021.06.16.   3차 표준화
 */

//전역변수 선언
let today = new Date();
var d = new Date(today.getFullYear(), today.getMonth(), "1");
d.setMonth(today.getMonth() - 1);

let year  = d.getFullYear();
let month = ("0" + (d.getMonth() + 1)).slice(-2);
const toYm = year + "-" + month;

$(document).ready(function(){
	
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
}

/**
 * @설명: event 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
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
			selectRamtAcitmList();
		}
	});

	//계정과목관리
	$("#btn-acitmCdPop").on("click", function(e){
		openPopup();
	});
	
	//계정과목조회
	$("#btn_srchAcitmCdPop").on("click", function(e){
		openSrchPopup();
	});
	
	$("#srch_inp_acitmCd").on("keypress", function(e){
		if(e.keyCode == 13) openSrchPopup();
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		selectRamtAcitmList();
	});

	//엑셀다운로드(타이틀_일자YYYYMMDD.xlsx)
	$("#btn_xlsdown").on("click", function(e){
		var fileName = "재무회계_AuditTrail_잔액명세조회_" 
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
			selectRamtAcitmList();
			return false;
		}
	});
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initGrid(){

	var reqParam = {};
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/at/fiat111m/selectRamtAcitmMstrList.do",{async:false})
	.done(function(data) {
		
		var gridObject = setGrid(data.list);
		gridObject.gridCreate();

	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulRlList !!");
	});
}

/**
 * @설명: jsGrid 원천테이블 Header셋팅
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function setGrid(dataList){

	var thCss  = "jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable";
	var thSize = 120;
	
	//head size 및 col갯수 set
	var $result = $("<tr>").height(0).append($("<th>").width(100)).append($("<th>").width(320)); //기본테이블 앞2개
	
	dataList.forEach(function(data, idx){
		var nSize = thSize;
		if(Math.ceil(data["tbNm"].length * 12.5) > thSize) nSize = Math.ceil(data["tbNm"].length * 12.5) + 10;
		data["colSize"] = nSize; //글자수에 따라 th width를 조정
		$result = $result.append($("<th>").width(data["colSize"]));
	});
	$result = $result.append($("<th>").width(thSize))
					 .append($("<th>").width(thSize))
					 .append($("<th>").width(thSize))
					 .append($("<th>").width(thSize)); //마지막 4개
	
	//head 1row set
	$result = $result.add($("<tr class='jsgrid-header-row'>")
			.append($("<th class='"+thCss+"'>").attr("colspan", 2).text("검증항목"))
			.append($("<th class='"+thCss+"'>").attr("colspan", dataList.length).text("JR금액"))
			.append($("<th class='"+thCss+"'>").attr("rowspan", 2).text("SJR"))
			.append($("<th class='"+thCss+"'>").attr("rowspan", 2).text("SAP(N1)"))
			.append($("<th class='"+thCss+"'>").attr("rowspan", 2).text("차이(JR-SJR)")) 
			.append($("<th class='"+thCss+"'>").attr("rowspan", 2).text("차이(SJR-SAP)"))); 
	
	//head 2row set
	var $result1 = $("<tr class='jsgrid-header-row'>")
			.append($("<th class='"+thCss+"'>").text("계정과목코드"))
			.append($("<th class='"+thCss+"'>").text("계정과목"));
	dataList.forEach(function(data, idx){
		$result1 = $result1.append($("<th class='"+thCss+"'>").text(data["tbNm"]));
	});
	//$result1 = $result1.append($("<th class='"+thCss+"'>").text("N1"));
	$result = $result.add($result1);
	
	var vFields = [{ name: "acitmCd"   , title:"계정과목코드", css:"cell", type: "text", width: 100, editing: false, align:"center"},
		           { name: "vrfItmNm"  , title:"계정과목", css:"cell", type: "text", width: 320, editing: false, align:"left"}];
	dataList.forEach(function(data, idx){
		vFields.push({ name: data["tbId"], title:data["tbNm"], css:"cell", type: "text", width: data["colSize"], editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		});
	});

	vFields.push({ name: "sjrAmt"  , title:"SJR", css:"cell", type: "text", width: 120, editing: false, align:"right",
		itemTemplate:function(value, item) {
			return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
		}
	},
	{ name: "sapAmt"  , title:"SAP(N1)", css:"cell", type: "text", width: 120, editing: false, align:"right",
		itemTemplate:function(value, item) {
			return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
		}
	},
	{ name: "jrSjrDifAmt"   , title:"차이(JR-SJR)", css:"cell", type: "text", width: 120, editing: false, align:"right",
		itemTemplate:function(value, item) {
			return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
		}
	},
	{ name: "sjrSapDifAmt"   , title:"차이(SJR-SAP)", css:"cell", type: "text", width: 120, editing: false, align:"right",
		itemTemplate:function(value, item) {
			return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
		}
	});
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id                : "gridDiv",
		height            : 610,
		editing           : false,
		sorting           : false,
		paging            : true,
		pageSize          : 30,
		confirmDeleting   : false,
		headerRowRenderer : function() {
			return $result;
		},
		fields : vFields
	});

	return gridObject;
}

/**
 * @설명: 계정과목관리 팝업을 호출한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
function openPopup() {
	var POPUP_INFO = {
			url: "/fi/at/fiat111p.do",
			name: "잔액명세_계정과목코드관리 팝업",
			width: 700,
			height: 800				
		};
	
	//※참고) 팝업콜백함수: openPopupAcitmCd_callback
	$.fn.openPopup(POPUP_INFO);
}

/**
 * @설명: 계정과목조회 팝업을 호출한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.06.07
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
var POPUP_SRCH_INFO = {};
function openSrchPopup() {
	POPUP_SRCH_INFO = {
			url     : "/fi/at/fiat113p.do",
			name    : "계정과목조회 팝업",
			srchTxt : $("#srch_inp_acitmCd").val(),
			width   : 700,
			height  : 530				
		};
	
	//※참고) 팝업콜백함수: openPopupAcitmCd_callback
	$.fn.openPopup(POPUP_SRCH_INFO);
}

/**
 * @설명: 팝업 콜백
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.05
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 */
function openPopupAcitmCd_callback(resultObj) {
	if(!isEmpty(resultObj)){
		$("#srch_inp_acitmCd").val(resultObj.acitmCd);
	}
}

/**
 * @설명: 잔액명세를 조회한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
function selectRamtAcitmList() {
	
	if(isEmpty($('#inp_finYm').val())) {
		$.fn.msgBox("조회 마감년월을 입력하세요.");
		return false;
	}
	
	var srchAcitmCd = $("#srch_inp_acitmCd").val();
	if(!isEmpty(srchAcitmCd)){
		if(srchAcitmCd.length != 10 || isNaN(srchAcitmCd)){
			$.fn.msgBox("조회할 계정과목을 선택하세요.");
			return false;
		}
	}
	
	var reqParam = {
			srchFinYm    : $.replaceAll($("#inp_finYm").val(), '-',''),
			srchAcitmCd  : srchAcitmCd
	};
	
	var rdoChkVal = $("input:radio[name='rad_useYn']:checked").val();
	if(rdoChkVal == "A"){
		reqParam["jrSjrdifAmtSrch"]  = "N";
		reqParam["sjrSapdifAmtSrch"] = "N";
	} else if(rdoChkVal == "J") {
		reqParam["jrSjrdifAmtSrch"]  = "Y";
		reqParam["sjrSapdifAmtSrch"] = "N";
	} else if(rdoChkVal == "S") {
		reqParam["jrSjrdifAmtSrch"]  = "N";
		reqParam["sjrSapdifAmtSrch"] = "Y";
	}
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/at/fiat111m/selectRamtAcitmList.do")
	.done(function(data) {
		
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		if(!isEmpty(data.list)){
			var listData = data.list;
			if(listData.length > 0){
				listData.forEach(function(data, idx){
					$.each(data,function(key, value){
						if(key.indexOf("tb") != -1) if(isEmpty(value)) listData[idx][key] = 0;
					});
				});
				
				//숫자값의 JSON text를 number형으로 변경(sample:"111" => sample:111)
				for(var i = 0; i < listData.length; i++){
					var obj = listData[i];
					for(var prop in obj){
						//계정과목코드는 숫자형으로 변경하지 않음.
						if(prop != "acitmCd"){
							if(obj.hasOwnProperty(prop) && obj[prop] != null && !isNaN(obj[prop])){
								obj[prop] = +obj[prop];
							}
						}
					}
				}
			}
			
			$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
			
			
		}
		
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
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.03
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