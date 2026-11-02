/**
 * @시스템명: IFRS17
 * @업무명: 민감도분석
 * @설명: fidc211m.js
 * @최초작성자: 황석현
 * @최초작성일: 2021.08.27
 * @최종변경일:
 * @개정이력:
 *  황석현    2021.08.27.   최초작성
 *  황석현    2021.09.08.   원수/출재 민감도분석 배치 호출 추가
 */

let today = new Date();
var d = new Date(today.getFullYear(), today.getMonth(), "1");
d.setMonth(today.getMonth());

let year  = d.getFullYear();
let month = ("0" + (d.getMonth() + 1)).slice(-2);
const toYm = year + "-" + month;
var perBtnId = ["btn_dwrRspsAnlyProd", "btn_cedeRspsAnlyProd"];
	
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
	
	if(!$("#" + perBtnId[0]).is(":visible")){
		$(".info-box").find(".clearfix").hide();
	}
	
	//툴팁
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");

	//event 초기화(엑셀업,다운로드,조회,저장)
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	$("#inp_finYm").select();
	
});

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.08.27
 * @최종변경일: 
 * @개정이력: 
 */
function initEvent() {
	//배치 마감년월 셋팅
	$("#inp_batFinYm").val(toYm);
	let calObjBat = $("#inp_batFinYm");
	calObjBat.val(toYm);
	calObjBat.on("click", function(e){
		$(this).data.prvdate = $(this).val();
		$(this).val("");
	}).on("focusout", function(e){
		if($(this).val() == "") $(this).val($(this).data.prvdate);
	}).on("keyup", function(e){
		let inDt = $(this).val();
		if(inDt.length == 5 && inDt.substring(4,5) != "-"){
			$(this).val(inDt.substring(0,4) + "-" + inDt.substring(4));
		}
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
			selectRspsAnlyList();
		}
	});

	//조회
	$("#btn_search").on("click", function(e){
		selectRspsAnlyList(); //조회
	});
	
	//엑셀다운로드(타이틀_일자YYYYMMDD.xlsx)
	$("#btn_xlsdown").on("click", function(e){
		let fileName = "민감도분석_" 
			         + $.replaceAll(toYm, '-','') 
		             + (((new Date()).getDate() < 10) ? "0" : "") + ((new Date()).getDate()) 
		             + ".xlsx";
		$.fn.exportGridExcel({
			id       : 'gridDiv', 
			fileName : fileName
		});
	});
	
	//배치실행
	$("#btn_dwrRspsAnlyProd, #btn_cedeRspsAnlyProd").on("click", function(e){
		selectRspsAnlyProdBatChk($(this)); 
	});
	
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 황석현
 * @최초작성일: 2021.08.27
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initGrid(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id              : "gridDiv",
		height          : 500,
		editing         : false,
		sorting         : false,
		paging          : true,
		confirmDeleting : false,
		headerRowRenderer: function() {
			var $result = $("<tr>").height(0)
				.append($("<th>").width(150))
				.append($("<th>").width(100))
				.append($("<th>").width(100))
				.append($("<th>").width(100))
				.append($("<th>").width(100))
				.append($("<th>").width(100))
				.append($("<th>").width(100));

			// header 1row
			$result = $result.add($("<tr class='jsgrid-header-row'>")
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("민감도항목"))	
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("CSM"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("당기손익"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("자본효과"))
				); 
			
			// header 2row
			var $result1 = $("<tr class='jsgrid-header-row'>")
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("총액"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("순액"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("총액"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("순액"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("총액"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("순액"))
					;
			
			$result = $result.add($result1);

			return $result;
		},
		fields : [
			{ name: "rspsItmNm" , title:"민감도항목" , css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "csmAmt", title:"CSM총액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "csmNetAmt" , title:"CSM순액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "tstrmPfnlsAmt", title:"당기손익총액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "tstrmPfnlsNetAmt"  , title:"당기손익순액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "cptEfcAmt" , title:"자본효과총액", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString()));
				}
			},
			{ name: "cptEfcNetAmt"  , title:"자본효과순액", css:"cell", type: "text", width: 100, editing: false, align:"right",
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
 * @설명: 민감도분석 조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.08.27.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectRspsAnlyList() {
	if($.fn.isEmpty($("#inp_finYm").val())) {
		$.fn.msgBox("조회 마감년월을 입력하세요.");
		return false;
	}
	
	//조회값 셋팅
	let reqParam = {
			finYm       : $.replaceAll($("#inp_finYm").val(), '-','')
	};
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/dc/fidc411m/selectRspsAnlyList.do")
	.done(function(data) {
		
		resetGrid(); // 그리드 초기화
		$("#gridDiv").jsGrid("loadData", data.list).done(function(){ }); //그리드 바인딩
		
		//0건 그리드 메세지 처리
		if(data.list.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectRspsAnlyList !!");
	});
}

/**
 * @설명: 배치 실행
 * @최초작성자: 황석현
 * @최초작성일: 2021.09.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectRspsAnlyProdBatChk(vObj) {
	
	if($.fn.isEmpty(vObj)) return;
	
	//실행버튼 object의 id값 
	let id = "#" + vObj.attr("id");
	let nm = vObj.data().batName;
	if($.fn.isEmpty($('#inp_batFinYm').val())) {
		$.fn.msgBox("[" + ($(id + " > span").html()) + "] 배치 작업 마감년월을 입력하세요.");
		return false;
	}
	
	//조회값 셋팅
	let vBatFinYm = $('#inp_batFinYm').val().trim();
	let reqParam = {
			batFinYm : $.replaceAll(vBatFinYm, '-','')
	};
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/dc/fidc411m/selectRspsAnlyProdBatChk.do",{async:false})
	.done(function(data) {

		if(data.list.length > 0) {
			
			for(let i=0;i<data.list.length;i++){
				if(nm == data.list[i].prcsNm) {
					if(data.list[i].cnt == 0) {
						$.fn.msgBox($.replaceAll(vBatFinYm, '-','년 ') + "월 " + ($(id + " > span").html()) + " 데이터가 존재하지 않습니다.");
						return false;
					}
					break;
				}
			}
			
			// 배치 실행
			batchProd(vObj);
			
		}

	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectRspsAnlyProdBatChk !!");
	});
}

/**
 * @설명: 배치실행 처리
 * @최초작성자: 황석현
 * @최초작성일: 2021.09.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function batchProd(vObj){
	if($.fn.isEmpty(vObj)) return;
	
	//실행버튼 object의 id값 
	let id = "#" + vObj.attr("id");
	let nm = vObj.data().batName;
	let reqParam = {
			batName  : nm,
			batFinYm : $.replaceAll($('#inp_batFinYm').val().trim(), '-','')
	};	
	let msg = ($(id + " > span").html()) + " 배치 작업을 실행 하시겠습니까?";

	$.fn.msgBox(msg, function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/dc/fidc411m/batchProd.do")
			.done(function(data) {
				console.log("::: BATCH RETURN DATA ::: \n", JSON.stringify(data));
				//BATCH result : 0:성공, 1:실패
				if(!$.fn.isEmpty(data.jsonView) && data.jsonView.result == "0") {
					$.fn.msgBox(vmsg + ($(id + " > span").html()) + " 배치 작업을 정상적으로 요청하였습니다.");
				} else {
					let msg = $.fn.isEmpty(data.warnning) ? ($(id + " > span").html()) + " 산출 배치 실행 도중 오류가 발생하였습니다." : data.warnning.errorMessage;
					$.fn.msgBox(msg);
				}
				
			}).fail(function(data){
				$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
				console.log("fail to batchProd !!");
			});
		}
	}, 2);
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.08.27
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}
