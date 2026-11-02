/**
 * @시스템명: IFRS17
 * @업무명: 결산Monitoring 관리
 * @설명: 결산 관련 배치 실행 내역 조회
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.25
 * @최종변경일:
 * @개정이력:
 *  최동염 2021.01.25 최초작성
 *  최동염 2021.04.28 2차 표준화
 *  최동염 2021.06.15 3차 표준화
 */

var itemObj = {};
var batchRunObj = {};
var userInfoObj = {};
var lv02ClickObj = {};
var screenPermission = "";

$(document).ready(function(){
	itemObj = opener.itemObj;
	userInfoObj = opener.userInfoObj;
	lv02ClickObj = opener.lv02ClickObj;
	screenPermission = opener.screenPermission;
	initEvent();	
	initPopupGrid(itemObj);
	selectBatchList(itemObj);
});

function initEvent() {
	//닫기 
	$("#btn_close_p").on("click", function(e){
		window.close();
	});
}

function initPopupGrid(itemObj){
	var gridObject = new ComJsGrid();	
	gridObject.id("gridDiv");
	gridObject.height(300);
	
	if(itemObj.mstkYn == "Y"){
		gridObject.fields([
			{ name: "batSeq", title:"실행순서", css:"cell", type: "text", width: 17, editing: false, align:"center"},
			{ name: "batId", title:"배치ID", css:"cell", type: "text", width: 25, align:"left"},
			{ name: "stactActNm", title:"배치명", css:"cell", type: "text", width: 80, align:"left"},
			{ name: "prgStat", title:"수행결과", css:"cell", type: "text", width: 17, align:"center"},
			{ name: "finTod", title:"처리시각", css:"cell", type: "text", width: 42, align:"center"},
			{ name: "runTime", title:"수행시간", css:"cell", type: "text", width: 32, align:"center"},
			{ name: "trtCnt", title:"적재건수", css:"cell", type: "text", width: 18, align:"center"},
			{ name: "errMsg", title:"오류상세내역", css:"cell", type: "text", width: 70, align:"left"},
			{ name: "", title:"", css:"cell", type: "text", width: 18, align:"center", 
				itemTemplate:function(value, item){
					if(lv02ClickObj.actFinDeptCd == userInfoObj.orgNo && screenPermission == 'Y'){
						const btnBatPopup = $("<button class='grid_inbtn_s'>").text("재수행")
						var $pBatEl2 = $("<p>").addClass("fr");
						var $aBatEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
							// 배치작업 실행 팝업호출
							callBatchRunPopup(item);
						});
						$aBatEl.append(btnBatPopup);
						
						return $("<div>").append($pBatEl2.append($aBatEl));
					}
				}
			},
		]);
	}else{
		gridObject.fields([
			{ name: "batSeq", title:"실행순서", css:"cell", type: "text", width: 24, editing: false, align:"center"},
			{ name: "batId", title:"배치ID", css:"cell", type: "text", width: 35, align:"left"},
			{ name: "stactActNm", title:"배치명", css:"cell", type: "text", width: 200, align:"left"},
			{ name: "prgStat", title:"수행결과", css:"cell", type: "text", width: 25, align:"center"},
			{ name: "finTod", title:"처리시각", css:"cell", type: "text", width: 60, align:"center"},
			{ name: "runTime", title:"수행시간", css:"cell", type: "text", width: 45, align:"center"},
			{ name: "trtCnt", title:"적재건수", css:"cell", type: "text", width: 30, align:"center"},
			{ name: "", title:"", css:"cell", type: "text", width: 25, align:"left",
				itemTemplate:function(value, item){
					if(lv02ClickObj.actFinDeptCd == userInfoObj.orgNo && screenPermission == 'Y'){
						const btnBatPopup = $("<button class='grid_inbtn_s'>").text("재수행")
						var $pBatEl2 = $("<p>").addClass("fr");
						var $aBatEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
							// 배치작업 실행 팝업호출
							callBatchRunPopup(item);
						});
						$aBatEl.append(btnBatPopup);
						
						return $("<div style='display:inline-block;'>").append($pBatEl2.append($aBatEl));
					}
				}
			},
		]);
	}

	// 그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: selectBatchList : 배치실행 내역 조회
 * @최초작성자: 최동염
 * @최초작성일: 2021. 01. 18.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 01. 18. 최초작성
 */
function selectBatchList(itemObj) {
	var reqParam = {};
	reqParam.stactActUppId = itemObj.actId03;
	reqParam.mstkYn = itemObj.mstkYn;
	reqParam.finYm = itemObj.finYm;
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/mt/fimt411p/selectBundleRunBatchList_Popup.do").done(
			function(data) {
				// 그리드 초기화
				//resetGrid("gridDiv");

				// 그리드 바인딩
				var listData = data.list;
				$("#gridDiv").jsGrid("loadData", listData).done(function() {
				});
			}).fail(function(data) {
		console.log("fail to selectBatchList !!");
	});
}

/**
 * @설명: 현재 접속한 서버 스테이지 코드 조회
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function selectStage(){
	var reStage = "";
		
	// 데이터 조회
	$.callAjax({},"/fi/mt/fimt411m/selectBundleRunStage.do",{async:false}).done(
			function(data) {
				reStage = data.stage;
			}).fail(function(data) {
		console.log("fail to selectStage !!");
	});
	
	return reStage;	
}

/**
 * @설명: 배치실행 팝업을 호출한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function callBatchRunPopup(item) {
	var stage = selectStage();
	var url = "";
	
	if(stage == "PROD"){
		url = "/mg/sy/mgsy915p.do"
	}else if(stage == "TEST"){
		url = "/mg/sy/mgsy915p.do"
	}else{
		url = "/mg/sy/mgsy915p.do"
	}
	
	batchRunObj.actUppId = itemObj.actId03;
	batchRunObj.batchId = item.batId;
	batchRunObj.finYm = itemObj.finYm;
	
	var popupOption = {
			url: url,
			name: "배치실행팝업",
			width: 1200,
			height: 650
	}
	$.fn.openPopup(popupOption);
}

/**
* 
* @설명: 팜업 콜백
* @최초작성자: 최동염
* @최초작성일: 2021. 02. 08.
* @최종변경일:
* @매개변수: 
* @반환값: 
* @개정이력: 최동염 2021. 02. 08. 최초작성
* 
*/
function resultBatchRunPopup_callback(){
	selectBatchList(itemObj);
}