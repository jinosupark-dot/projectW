/**
 * @시스템명: IFRS17
 * @업무명: 공시결과검증
 * @설명: 공시결과검증
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.02
 * @최종변경일:
 * @개정이력:
 *  이상범    2021.03.02.   최초작성
 *  이상범    2021.04.26.   2차 표준화
 *  이상범    2021.06.16.   3차 표준화
 *  황석현    2021.09.27.   공시결과검증 팝업창 추가
 *                        - 공시기초데이터금액(1), SAP 금액(2) 그리드 항목 더블클릭시 팝업창 생성
 */

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
	
	//포트폴리오 콤보박스 세팅
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
	
	$(".search-item").find(".item").each(function(){ $(this).css({"margin-right":"15px"}) });
	
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
			selectPbanRsltVrfList();
		}
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		selectPbanRsltVrfList(); //조회
	});
	
	//엑셀다운로드(타이틀_일자YYYYMMDD.xlsx)
	$("#btn_xlsdown").on("click", function(e){
		let fileName = "공시결과검증_" 
			         + $.replaceAll(toYm, '-','') 
		             + (((new Date()).getDate() < 10) ? "0" : "") + ((new Date()).getDate()) 
		             + ".xlsx";
		$.fn.exportGridExcel({
			id       : 'gridDiv', 
			fileName : fileName
		});
	});
	
	$(".search-item").find("select,input[type=radio]").on("keypress", function(e){
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
		height          : 575,
		editing         : false,
		sorting         : true,
		paging          : true, 
		confirmDeleting : false,
		fields : [
			{ name: "finYm", title:"마감년월", css:"cell", type: "text", width: 80, editing: false, align:"center",
				itemTemplate:function(value, item) {
					return $.fn.monthFormat(value, "-");
				}
			},
			{ name: "pbanNm"     , title:"공시명", css:"cell", type: "text", width: 250, editing: false, align:"left"},
			{ name: "pbanItmNm"  , title:"공시항목명", css:"cell", type: "text", width: 500, editing: false, align:"left"},
			{ name: "potflScCd"  , title:"포트폴리오구분코드", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "potflNm"    , title:"포트폴리오명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "pbanAmt"    , title:"공시기초데이터금액(1)", css:"cell", type: "text", width: 150, editing: false, align:"right",
				itemTemplate:function(value, item) {
					if($.fn.isEmpty(value)) {
						value = "0";
					} else {
						value = $.addCommaNumber(value.toString());
					}
					var $aEl = $("<a>").attr("href", "javascript:void(0);").text(value).on("dblclick", function() {
						//팝업 조회값 셋팅
						let reqParam = {
								finYm     : item.finYm,
								pbanNm    : item.pbanNm,
								pbanItmNm : item.pbanItmNm,
								potflScCd : item.potflScCd,
								scCd      : "p"
						};
						callPopup("pban", reqParam);
					});
					return $("<div>").append($aEl);
				}
			},
			{ name: "sapAmt"  , title:"SAP 금액(2)", css:"cell", type: "text", width: 150, editing: false, align:"right",
				itemTemplate:function(value, item) {
					if($.fn.isEmpty(value)) {
						value = "0";
					} else {
						value = $.addCommaNumber(value.toString());
					}
					var $aEl = $("<a>").attr("href", "javascript:void(0);").text(value).on("dblclick", function() {
						//팝업 조회값 셋팅
						let reqParam = {
								finYm     : item.finYm,
								pbanNm    : item.pbanNm,
								pbanItmNm : item.pbanItmNm,
								potflScCd : item.potflScCd,
								scCd      : "s"
						};
						callPopup("sap", reqParam);
					});
					return $("<div>").append($aEl);
				}
			},
			{ name: "difAmt"    , title:"차이금액(1)-(2)", css:"cell", type: "text", width: 150, editing: false, align:"right",
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
 * @설명: 팝업 호출
 * @최초작성자: 황석현
 * @최초작성일: 2021.09.28
 * @최종변경일: 
 * @매개변수: scCd, val 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.09.28 최초작성
 */
//전역변수 선언부
var POPUP_INFO = {};
function callPopup(scCd, val) {
	if(typeof val === "undefined" || val == null) return;
	
	var CUR_ROW_ITEM = null;
	CUR_ROW_ITEM = val;
	POPUP_INFO = {};

	POPUP_INFO = {
		url: "/fi/dc/fidc311p.do",
		name: scCd == "pban" ? "공시기초데이터금액(1)" : "SAP금액(2)",
		width: 600,
		height: 550,
		CUR_ROW_ITEM: val
	}
	$.fn.openPopup(POPUP_INFO);
}

function gridMerge(){
	let gridRowTag = "#gridDiv > div.jsgrid-grid-body > table > tbody > tr";
	let gridRowLen = $(gridRowTag).length;

	let cnt1 = 0;
	let cnt2 = 0;
	$.each($(gridRowTag), function(index, item){
		let idx = gridRowLen-(index+1);
		cnt1++;
		cnt2++;
		
		if(idx > 0){
			//값 비교를 위해 전항목 txt값과 현재 txt값을 얻는다.
			let tdTxt1    = $(gridRowTag + ":eq(" + idx + ") > td:eq(1)").text();
			let tdTxt2    = $(gridRowTag + ":eq(" + idx + ") > td:eq(2)").text();
			let prvTdTxt1 = $(gridRowTag + ":eq(" + (gridRowLen-(index+2)) + ") > td:eq(1)").text();
			let prvTdTxt2 = $(gridRowTag + ":eq(" + (gridRowLen-(index+2)) + ") > td:eq(2)").text();
			
			//같을때는 td를 지운다.
			if(tdTxt1 == prvTdTxt1){
				//뒷쪽 td부터 지워야 eq 순번을 유지할 수 있다.
				if(tdTxt2 == prvTdTxt2){
					$(gridRowTag + ":eq(" + idx + ") > td:eq(2)").remove();
				} else {
					$(gridRowTag + ":eq(" + idx + ") > td:eq(2)").attr("rowspan",cnt2);
					cnt2 = 0;
				}
				$(gridRowTag + ":eq(" + idx + ") > td:eq(1)").remove();
			} else {
				//다르면 앞에서 카운트한 row수 + 1값을 rowspan으로 지정한다.
				$(gridRowTag + ":eq(" + idx + ") > td:eq(2)").attr("rowspan",cnt2);
				$(gridRowTag + ":eq(" + idx + ") > td:eq(1)").attr("rowspan",cnt1);
				cnt1 = 0;
				cnt2 = 0;
			}
		} else if(idx == 0){
			//맨처음이면 rowspan한다.
			$(gridRowTag + ":eq(" + idx + ") > td:eq(1)").attr("rowspan",cnt1);
			$(gridRowTag + ":eq(" + idx + ") > td:eq(2)").attr("rowspan",cnt2);
		}
	});
}

/**
 * @설명: 조회 항목코드를 조회한다. - 포트폴리오
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectSrchCdList(codeId, selId, val) {

	$._commonObj = {};
	
	// 데이터 조회
	$.callAjax({}, "/fi/dc/fidc211m/selectPotflScCdList.do",{async:false})
	.done(function(data) {

		$._commonObj["code"] = {}; //초기화
		$.extend($._commonObj["code"], data);
		$._commonObj.code[codeId] = data.list;

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
 * @설명: 공시결과집계 조회한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.23
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectPbanRsltVrfList() {
	
	if(isEmpty($('#inp_finYm').val())) {
		$.fn.msgBox("조회 마감년월을 입력하세요.", function(obj){
			$('#inp_finYm').focus();
		}, 1);
		return false;
	}
	
	//조회값 셋팅
	let reqParam = {
			srchFinYm       : $.replaceAll($("#inp_finYm").val(), '-',''),
			srchPotflScCd   : $("#srch_sbx_potflScCd").val()
	};
	
	let rdoChkVal = $("input:radio[name='rad_useYn']:checked").val();
	reqParam["srchDcSapDifAmt"]  = (rdoChkVal == "A") ? "N" : "Y";
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/dc/fidc311m/selectPbanRsltVrfList.do")
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