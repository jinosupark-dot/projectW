/**
 * @시스템명: 경영계획
 * @업무명: 배치 실행
 * @설명: JobMind or shell을 이용하여 배치를 실행하는 화면이다.
 * @최초작성자: 김방언
 * @최초작성일: 2025. 01. 10.
 * @개정이력:
 *  김방언 2025. 01. 10.  최초작성
 */

var executeChk = true;
var openerFinYm = "";
$(document).ready(function() {

	var recvData = {
		batchId : opener.batchRunObj.batchId,
		finYm : opener.batchRunObj.finYm
	};
	
	openerFinYm = recvData.finYm;
	
	console.log("recvData.finYm : " + recvData.finYm);
	console.log("recvData.batchId : " + recvData.batchId);

	initGrid();
	initParamGrid();

	initEvent();
	
	selectBusinessPlanningBatchList_Popup(recvData);
	//$("#bat_id_content").val(recvData.batchId); // 배치ID 복사
	//selectBusinessPlanningBatchParamList(recvData.batchId);
	
	//executeBatch(); 체크로직추가 - 20230628 
	chkExecuteBatch();
	
});

function initEvent() {
	// 닫기
	$("#btn_close_p").on("click", function(e) {
		opener.resultBusinessPlanningBatchRunPopup_callback();
		window.close();
	});
}

/**
 * @설명: : recvData = ? 에 해당하는 Batch 리스트를 조회한다.
 * @최초작성자: 김방언
 * @최초작성일: 2025. 01. 10.
 * @최종변경일:
 * @매개변수: recvData
 * @반환값:
 * @개정이력: 김방언 2025. 01. 10. 최초작성
 */
function selectBusinessPlanningBatchList_Popup(recvData) {
	console.log("Log : selectBusinessPlanningBatchList_Popup Called");
	var reqParam = recvData;
	console.log("reqParam : " + JSON.stringify(recvData));

	$.callAjax(reqParam, "/bp/co/bpco001p/selectBusinessPlanningBatchList_Popup.do").done(		
			function(data) {
				var listData = data.list;
				console.log(listData);

				$("#gridBatchList").jsGrid("loadData", listData).done(
						function() {
						});

			}).fail(function(data) {
		console.log("Log : selectBusinessPlanningBatchList_Popup fail: " + data);
	});
}

function showBatchInfo(clickObject) {
	console.log("Log : showBatchInfo Called");
	$("#bat_id_content").val(clickObject.batId); // 배치ID 복사
	
	console.log("clickObject.batExpln : " + clickObject.batExpln);
	$("#bat_nm_expln_content").val(clickObject.batExpln); // 배치명 복사 (hidden)
	
	
	$("#batchLog").val("");
	console.log("showBatchInfo : ", clickObject.batId);
	executeChk = true;
	$('.disableLink').css("backgroundColor", "#EE3124");
	console.log("showBatchInfo : ", clickObject.batId);
	selectBusinessPlanningBatchParamList(clickObject.batId);
}

/**
 * @설명: : batId = ? 에 사용되는 파라미터를 조회한다.
 * @최초작성자: 김방언
 * @최초작성일: 2025. 01. 10.
 * @최종변경일:
 * @매개변수: batId (배치ID)
 * @반환값:
 * @개정이력: 김방언 2025. 01. 10. 최초작성
 */
function selectBusinessPlanningBatchParamList(batchId) {
	console.log("Log : selectBusinessPlanningBatchParamList Called");
	/*
	 * var reqParam = { "actUppId" : recvData.actUppId, "batchId" :
	 * recvData.batchId };
	 */

	var reqParam = {
		"finYm" : openerFinYm,	
		"batchId" : batchId
	};
	console.log("selectBusinessPlanningBatchParamList Test: " + JSON.stringify(reqParam));

	$.callAjax(reqParam, "/bp/co/bpco001p/selectBusinessPlanningBatchParamList.do").done(
			function(data) {
				var strListData = $.replaceAll(JSON.stringify(data.list), "null", "\"\"");
				var listData = JSON.parse(strListData);
				
				console.log("selectBusinessPlanningBatchParamList : " + JSON.stringify(reqParam));
				
				$("#gridBatchParam").jsGrid("loadData", listData).done(
						function() {
						});

			}).fail(function(data) {
		console.log("Log : selectBusinessPlanningBatchParamList fail: " + data);
	});
}

/**
 * @설명: : 배치를 실행전 체크로직 수행
 * @최초작성자: 김방언
 * @최초작성일: 2025. 01. 10.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김방언 2025. 01. 10. 최초작성
 */
function chkExecuteBatch() {
	
	var reqParam = {};
	
	//TODO - 체클로직 수행 후 정상이면 배치수행되도록 변경 
	$("#executeBatch").on("click", function() {
		if(executeChk){
			
			if( $("#bat_id_content").val() == "") {
				$.fn.msgBox("배치 ID를 선택하시고 진행하세요.");
				return;
			}
		
			var editRowClass = $("#gridBatchParam").jsGrid("option", "editRowClass");
		
			if ($("." + editRowClass).length > 0) {
				$("#gridBatchParam").jsGrid("updateItem");			
			}
		
			/*null and length check*/
			items = $("#gridBatchParam").jsGrid("option", "data");
		
			var finYm = "";
			for (var i = 0; i<items.length; i++){
				if(items[i].useYn == "Y"){
					if($.fn.isNull(items[i].inptPrmtrByUser)){
						$.fn.msgBox(items[i].inptPrmtrId+"는 필수 입력값입니다.");
						return;
					}
					
//					if(items[i].inptPrmtrByUser.length != items[i].inptPrmtrExpln.length){
//						$.fn.msgBox(items[i].inptPrmtrId+"의 입력 길이를 확인 해주세요.");
//						return;
//					}
					
					if(items[i].inptPrmtrId == 'finYm'){
						finYm = items[i].inptPrmtrByUser;
					}
				}
			}
			
			reqParam.finYm = finYm;
			reqParam.batchId = $("#bat_id_content").val();
		
			executeBatch();
		
		}else{
			
			$.fn.msgBox("배치 ID를 다시 선택해주세요.");
			return;
			
		}
		
	});
}

/**
 * @설명: : 배치를 실행한다
 * @최초작성자: 김방언
 * @최초작성일: 2025. 01. 10.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김방언 2025. 01. 10. 최초작성
 */
function executeBatch() {

	if(executeChk){
		console.log("console Log : executeBatch Called");
	
		if( $("#bat_id_content").val() == "") {
			$.fn.msgBox("배치 ID를 선택하시고 진행하세요.");
			return;
	}

	var editRowClass = $("#gridBatchParam").jsGrid("option", "editRowClass");
	console.log($("." + editRowClass).length);

	if ($("." + editRowClass).length > 0) {
		$("#gridBatchParam").jsGrid("updateItem");			
	}
	
	/*null and length check*/
	items = $("#gridBatchParam").jsGrid("option", "data");

	batchId = $("#bat_id_content").val();
	console.log("console Log : batchId completed : " + batchId);

	var editRowClass = $("#gridBatchParam").jsGrid("option", "editRowClass");
	
	if($("." + editRowClass).length > 0) {
		$("#gridBatchParam").jsGrid("updateItem");
	}
	console.log("console Log : updateItem completed");
	console.log("console Log : items completed");
	executeChk = false;
	$('.disableLink').css("backgroundColor", "#b8b8b8");
	$.callAjax({"batchId" : batchId, "list" : JSON.stringify(items).trim()}, "/bp/co/bpco001p/executeBatch.do")
		.done(function(data) {
			var recvData = {
					batchId : opener.batchRunObj.batchId,
					finYm : opener.batchRunObj.finYm
			};
			selectBusinessPlanningBatchList_Popup(recvData);
			
			if (data.log) {
				$("#batchLog").val(data.log);
			}
			
			executeChk = false;
			console.log("Log : selectBusinessPlanningBatchList_Popup success ");
			
			if (data.JobMind){
				
				if(data.JobMind.result == "0"){
					$("#batchLog").val("JobMind 요청 성공");
				}
				else if(data.JobMind.result == "1"){
					$("#batchLog").val("JobMind 요청 실패 : "+ errorMessage);
				}
			}
			
			console.log("Log : selectBusinessPlanningBatchList_Popup success ");
		
		}).fail(function(data) {
			console.log("Log : selectBusinessPlanningBatchParamList fail: " + data);
		});
	}
	else{
		
		$.fn.msgBox("배치 ID를 다시 선택해주세요.");
		return;
		
	}
		
}

/**
 * @설명: : initGrid
 * @최초작성자: 김방언
 * @최초작성일: 2025. 01. 10.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김방언 2025. 01. 10. 최초작성
 */
function initGrid() {
	
	var gridObject = new ComJsGrid({
		id : "gridBatchList",
		height : 500,
		editing : false,
		sorting : false,
		paging : false,
		confirmDeleting : false,
		fields : [ 
			{name : "batId", 	 title : "배치ID",	css : "cell", type : "text", width : 100, 	align : "center"}, 
			{name : "batStatus", title : "상태",	  	css : "cell", type : "text", width : 100, 	align : "center"}, 
			{name : "batExpln",  title : "설명",  	css : "cell", type : "text", 				align : "center"} 
		]
	});

	// 그리드 생성
	gridObject.gridCreate();

	$("#gridBatchList").jsGrid("fieldOption", "batExpln", "visible", false);

	gridObject.rowClick(function(args) {
		clickIndex = args.itemIndex;
		clickObject = args.item;
		console.log("clickObject log:", clickObject);
		showBatchInfo(clickObject);
	});
}

/**
 * @설명: : initParamGrid
 * @최초작성자: 김방언
 * @최초작성일: 2025. 01. 10.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 김방언 2025. 01. 10. 최초작성
 */
function initParamGrid() {

	var gridObject = new ComJsGrid({
		id : "gridBatchParam",
		height : 255,
		editing : true,
		sorting : false,
		paging : false,
		selectHiglight : true,

		fields : [
				{name : "prmtrInptSeq",		title : "순서",		css : "cell",	type : "text",	width : 20,	align : "center",	editing : false},
				{name : "inptPrmtrId",		title : "파라미터ID",	css : "cell",	type : "text",	width : 80,	align : "center",	editing : false},
				{name : "inptPrmtrByUser",	title : "입력",		css : "cell",	type : "text",	width : 80,	align : "center", 	editing : true,
					editTemplate : function(value) {
						var $result = jsGrid.fields.text.prototype.editTemplate
								.call(this, value);
						$result.on("keydown", function(e) {
							if (e.which === 13) {
								$("#gridBatchParam").jsGrid("updateItem");
								return false;
							}
						});
						setTimeout(function() {
							$result.focus();
							return false;
						});
						return $result;
					}
				}, 
				{name : "useYn",			title : "필수",		css : "cell",	type : "text",		width : 20, align : "center",	editing : false},
				{name : "inptPrmtrNm",		title : "파라미터명",	css : "cell",	type : "text",		width : 100,align : "left",		editing : false}, 
				{name : "inptPrmtrExpln",	title : "입력 예",	css : "cell",	type : "text",		width : 100,align : "left",		editing : false}, 
				{name : "gridManupulate",	title : "그리드조작",	css : "cell",	type : 'control',	deleteButton : false, 			editing : true}

		],
	});

	gridObject.gridCreate();
}
