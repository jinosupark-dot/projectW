/**
 * @시스템명: IFRS17
 * @업무명: 잔액명세_원천 조회
 * @설명: 잔액명세_원천 조회
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.05
 * @최종변경일:
 * @개정이력: 
 *  이상범    2021.03.05.   최초작성
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
var perBtnId = ["btn-acitmCdPop"];

$(document).ready(function(){
	
	//button permission
	var arrPerBtn = new Array();
	for(var i=0; i<perBtnId.length; i++){
		var perBtn = new Object();
		perBtn.btnId = "#" + perBtnId[i];
		arrPerBtn.push(perBtn);
	}
	$.fn.setBtnPermission(arrPerBtn);
	
	//툴팁
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");

	//event 초기화(엑셀업,다운로드,조회,저장)
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	$("#inp_finYm").focus();
	
});

/**
 * @설명: event 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.05
 * @최종변경일: 
 * @개정이력: 
 */
function initEvent() {
	
	//조회 마감년월 현재월 셋팅
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
	});
	
	$("#inp_finYm").on("keypress", function(e){
		if(e.keyCode == 13){
			selectRamtSpcfSrcArJrList();
		}
	});
	
	$("#inp_tbNm,#inp_colNm").on("keypress", function(e){
		if(e.keyCode == 13){
			//if($(this).val() == ""){
			//오픈팝업
			if($(this).attr("id") == "inp_tbNm") openPopup("TB");
			else openPopup("COL");
			//}
			//selectRamtSpcfSrcArJrList();
		}
	});

	//조회
	$("#btn_search").on("click", function(e){
		selectRamtSpcfSrcArJrList();
	});
	
	//table name 팝업
	$("#btn_srchTbNm").on("click", function(e){
		openPopup("TB");
	});
	
	//column name 팝업
	$("#btn_srchColNm").on("click", function(e){
		openPopup("COL");
	});
	
	//엑셀다운로드(타이틀_일자YYYYMMDD.xlsx)
	$("#btn_xlsdown").on("click", function(e){
		var fileName = "재무회계_AuditTrail_원천데이터조회_" 
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
			selectRamtSpcfSrcArJrList();
			return false;
		}
	});
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id       : "gridDiv",
		height   : 580,
		editing  : false,
		sorting  : false,
		paging   : true,
		pageSize : 20,
		confirmDeleting: false,
		headerRowRenderer: function() {
			var $result = $("<tr>").height(0)
				.append($("<th>").width(210))
				.append($("<th>").width(210))
				.append($("<th>").width(120))
				.append($("<th>").width(120))
				.append($("<th>").width(120))
				.append($("<th>").width(120))
				.append($("<th>").width(120));

			$result = $result.add($("<tr class='jsgrid-header-row'>")
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("원천TB"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("원천 금액"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("AR 금액"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("JR 금액"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("차이(원천-AR)"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("차이(AR-JR)"))
				); 
			
			$result = $result.add($("<tr class='jsgrid-header-row'>")
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("원천 TB"))
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("원천 Column")));

			return $result;
		},
		fields : [
			{ name: "tabComment"   , title:"원천 TB", css:"cell", type: "text", width: 210, editing: false, align:"left"},
			{ name: "comments"     , title:"원천 Column", css:"cell", type: "text", width: 210, editing: false, align:"left"},
			{ name: "columnAmt"    , title:"원천 금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			},
			{ name: "arSumpAmt"    , title:"AR 금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			},
			{ name: "jrSumpAmt"    , title:"JR 금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			},
			{ name: "srcArDifAmt"  , title:"차이(원천-AR)", css:"cell", type: "text", width: 120, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			},
			{ name: "arJrDifAmt"   , title:"차이(AR-JR)", css:"cell", type: "text", width: 120, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
				}
			}
		]
	});	
	
	gridObject.rowDoubleClick(function(args) {
		//하단항목 초기화
		loadLayerPop(args);
	});

	//그리드 생성
	gridObject.gridCreate();
	
	makeLayerPop();
	
}

/**
 * @설명: 레이어팝업 생성.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function makeLayerPop() {
	var lyElemArry = [];
	lyElemArry.push("<div id='layGridPop' class='popupWrap' style='position:absolute;margin-left:0px;margin-top:0px;display:none;'>");
	lyElemArry.push("<div class='popup_header'>");
	lyElemArry.push("<h3 id='layGridTitle'>원천TB 정보</h3>");
	lyElemArry.push("</div>");
	lyElemArry.push("<div id=layGridSubTitle' class='popup_body'>");
	lyElemArry.push("<div style='overflow: auto;background: #f1f2f4;'>");
	lyElemArry.push("<div class='tableWrap'>");
	lyElemArry.push("<table class='tableA'>");
	lyElemArry.push("<tbody>");
	lyElemArry.push("<tr>");
	lyElemArry.push("<th width='170px;'>테이블명</th>");
	lyElemArry.push("<td id='layTableName'> </td></tr>");
	lyElemArry.push("<tr>");
	lyElemArry.push("<th>테이블한글명</th>");
	lyElemArry.push("<td id='layTabComment'> </td></tr>");    
	lyElemArry.push("<tr>");
	lyElemArry.push("<th>컬럼명</th>");
	lyElemArry.push("<td id='layColumnName'> </td></tr>");  
	lyElemArry.push("<tr>");
	lyElemArry.push("<th>컬럼한글명</th>");
	lyElemArry.push("<td id='layComments'> </td></tr>");
	lyElemArry.push("<tr>");
	lyElemArry.push("<th>금액</th>");
	lyElemArry.push("<td id='layAmt'> </td></tr>");   
	lyElemArry.push("</tbody>");
	lyElemArry.push("</table>");
	lyElemArry.push("</div>");
	lyElemArry.push("</div>");
	lyElemArry.push("</div>");
	lyElemArry.push("<div class='popup_footer'>");
	lyElemArry.push("<input id='layGridBtnCl' type='button' value='닫기' onclick='javascript:closeMsgBox();'>");
	lyElemArry.push("</div>");
	lyElemArry.push("</div>");
	lyElemArry.push("<div class='layGridpopupDim' style='display:none;'></div>");
	$(document.body).append($(lyElemArry.join("")));
}

/**
 * @설명: 더블클릭 레이어 팝업 호출
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function loadLayerPop(args) {
	$.fn.showLoadingBar();
	var amt = $.fn.isEmpty(args.item["columnAmt"]) ? "0" : $.addCommaNumber(args.item["columnAmt"].toString());

	$(".layGridpopupDim").show();
	$("#layGridPop").show();
	var top = (($(window).height() - $("#layGridPop").outerHeight())/2 + $(window).scrollTop()) + "px";
	var left = (($(window).width() - $("#layGridPop").outerWidth())/2 + $(window).scrollLeft()) + "px";
	$("#layGridPop").css("left", left);
	$("#layGridPop").css("top", top);
	
	$("#layGridPop").find("#layTableName").html(args.item["tableName"]);
	$("#layGridPop").find("#layTabComment").html(args.item["tabComment"]);
	$("#layGridPop").find("#layColumnName").html(args.item["columnName"]);
	$("#layGridPop").find("#layComments").html(args.item["comments"]);
	$("#layGridPop").find("#layAmt").html(amt);
}

/**
 * @설명: 레이어팝업을 닫는다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function closeMsgBox(){
	$.fn.hideLoadingBar();
	$("#layGridPop").hide();
}

/**
 * @설명: 잔액명세_원천을 조회한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectRamtSpcfSrcArJrList() {
	
	if(isEmpty($('#inp_finYm').val())) {
		$.fn.msgBox("조회 마감년월을 입력하세요.");
		return false;
	}
	
	//조회값 셋팅
	var reqParam = {
			srchFinYm       : $.replaceAll($("#inp_finYm").val(), '-',''),
			srchTbNm        : $("#inp_tbNm").val(),
			srchColNm       : $("#inp_colNm").val(),
			srcArDifAmtSrch : $("input:radio[name='rad_useYn1']:checked").val(),
			arJrDifAmtSrch  : $("input:radio[name='rad_useYn2']:checked").val(),
			unMapnSrch      : $("input:radio[name='rad_useYn3']:checked").val()
	};
	
	var rdoChkVal = $("input:radio[name='rad_useYn']:checked").val();
	if(rdoChkVal == "A"){
		reqParam["srcArDifAmtSrch"]  = "N";
		reqParam["arJrDifAmtSrch"]   = "N";
		reqParam["unMapnSrch"]       = "N";
	} else if(rdoChkVal == "S") {
		reqParam["srcArDifAmtSrch"]  = "Y";
		reqParam["arJrDifAmtSrch"]   = "N";
		reqParam["unMapnSrch"]       = "N";
	} else if(rdoChkVal == "J") {
		reqParam["srcArDifAmtSrch"]  = "N";
		reqParam["arJrDifAmtSrch"]   = "Y";
		reqParam["unMapnSrch"]       = "N";
	} else if(rdoChkVal == "U") {
		reqParam["srcArDifAmtSrch"]  = "N";
		reqParam["arJrDifAmtSrch"]   = "N";
		reqParam["unMapnSrch"]       = "Y";
	}
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/at/fiat112m/selectRamtSpcfSrcArJrList.do")
	.done(function(data) {
		
		if(typeof data.list !== "undefined" && data.list.length > 0) {
			for(var i=0;i<data.list.length;i++){
				var objList = data.list[i];
				var arSumpAmt = (isEmpty(objList["arSumpAmt"]) ? 0 : objList["arSumpAmt"]); 
				var jrSumpAmt = (isEmpty(objList["jrSumpAmt"]) ? 0 : objList["jrSumpAmt"]); 
				data.list[i]["arSumpAmt"] = arSumpAmt;
				data.list[i]["jrSumpAmt"] = jrSumpAmt;
				
				for(var prop in objList){
					if(objList.hasOwnProperty(prop) && objList[prop] != null && !isNaN(objList[prop])){
						objList[prop] = +objList[prop];
					}
				}
			}
		}

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
		console.log("fail to selectJoulRlList !!");
	});
}

/**
 * @설명: 테이블조회 팝업을 호출한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
var POPUP_INFO = {};
function openPopup(sc) {
	POPUP_INFO = {
			url    : "/fi/at/fiat112p.do",
			name   : "",
			popSc  : sc,
			width  : 700,
			height : 530	
		};
	
	if(sc == "TB"){
		POPUP_INFO.name         = "원천 TABLE 조회 팝업";
		POPUP_INFO["srchTbId"]  = $("#inp_tbNm").val();
	} else if(sc == "COL"){
		POPUP_INFO.width        = 1000;
		POPUP_INFO.height       = 550;
		POPUP_INFO.name         = "TB Column 조회 팝업";
		POPUP_INFO["srchTbId"]  = $("#inp_tbNm").val();
		POPUP_INFO["srchColId"] = $("#inp_colNm").val();
	}
	
	//※참고) 팝업콜백함수: openPopupRamtSpcf_callback
	$.fn.openPopup(POPUP_INFO);
}

/**
 * @설명: 팝업 콜백
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.05
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 */
function openPopupRamtSpcf_callback(resultObj) {
	if(!isEmpty(resultObj)){
		if(resultObj.popSc == "TB"){
			if($("#inp_tbNm").val() != ""){
				if($("#inp_tbNm").val() != resultObj.tbId){
					$("#inp_colNm").val("");
				}
			}
			$("#inp_tbNm").val(resultObj.tbId);
		} else if(resultObj.popSc == "COL"){
			$("#inp_tbNm").val(resultObj.tbId);
			$("#inp_colNm").val(resultObj.clumNm);
		}
	}
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.05
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