/**
 * @시스템명: IFRS17
 * @업무명: 계정과목목록조회 팝업
 * @설명: 계정과목목록조회 팝업의 JS
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
let year = today.getFullYear();
let month = ((today.getMonth() + 1) < 10) ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
const toYm = year + "-" + month;
var NEW_MODI_SC_CD = ""; //엑셀E

$(document).ready(function(){

	$("#btn_excel_save,#btn_cancel").hide();
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	//목록조회
	selectRamtSpcfAcitmCdList();
});

/**
 * @설명: event 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 */
function initEvent() {
	//엑셀다운로드
	$("#btn_xlsdown").on("click", function(e){
		var fileName = "잔액명세_계정과목코드관리_"
			         + $.replaceAll(toYm, '-','') 
                     + (((new Date()).getDate() < 10) ? "0" : "") + ((new Date()).getDate()) 
                     + ".xlsx";
		$.fn.exportGridExcel({
			id       : 'gridDiv', 
			fileName : fileName
		});
	});
	
	//엑셀로드
	$("#btn_xlsup").on("click", function(e){
		var paramObj = {};
		paramObj.id = "gridDiv";					//그리드 ID
		paramObj.callbackFn = function(data) {		//그리드 바인딩 후 후처리 함수
			if(typeof data.list !== "undefined" && data.list.length > 0) {
				//데이터 체크
				if(data.result != -1) {
					NEW_MODI_SC_CD = "E";
					$("#btn_xlsup,#btn_save,#btn_addGrid,#btn_xlsdown").hide();//attr("disabled", true);
					$("#btn_excel_save,#btn_cancel").show();
					$.fn.msgBox(data.list.length + "건 정상적으로 로드하였습니다.");
				} else{
					resetGrid();
					$.fn.msgBox("엑셀로드 중 오류가 발생했습니다.");
				}
			}
		};
		$.fn.loadGridExcel(paramObj); 
	});
	
	//엑셀저장
	$("#btn_excel_save").on("click", function(e){
		saveRamtSpcfAcitmCdExcel();
	});
	
	//엑셀저장 취소
	$("#btn_cancel").on("click", function(e){
		$("#btn_excel_save,#btn_cancel").hide(); //엑셀저장,취소
		$("#btn_xlsup,#btn_save,#btn_addGrid,#btn_xlsdown").show();//removeAttr("disabled");
		resetGrid();
		
		selectRamtSpcfAcitmCdList();
	});
	
	//행추가
	$("#btn_addGrid").on("click", function(e){
		addGridData();
	});
	
	// 저장
	$("#btn_save").on("click", function(e) {
		saveGridDataAll();
	});
	
	//확인
	$("#btn_confirm").on("click", function(e){
		popupConfirm();
	});
	
	//닫기
	$("#btn_closePopup").on("click", function(e){
		popupClose();
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id      : "gridDiv",
		height  : 600,
		editing : true,
		sorting : true,
		paging  : false,
		controller : {
			updateItem : function(item) { // Edit모드에서 적용 아이콘 또는 updateItem
											// API를 이용시 진입
				// debugger;
				var status = 'u'; // 수정
				if (item.status == 'c') { // 신규는 c상태 유지 후 데이터 수정
				} else if (item.status == 'dd') { // 삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { // grid 삭제 아이콘 클릭 또는 deleteItem
											// API이용시 진입
				// deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = 'dd'; // 삭제 신청
				if (item.status == 'c') { // 신규 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else { // u,d 는 삭제 상태로 처리 -> updateItem에서 최종 삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#gridDiv").jsGrid("updateItem", item);
					return item;
				}
			}
		},
		onItemEditing : function(args) { // Grid Edit모드 진입시 처리
			// debugger;
			// 체크박스는 Edit 모드 취소
			var targetElem = (event) ? event.srcElement || null : null;
			if (targetElem) {
				if (targetElem.outerHTML.indexOf("check") > 0) {
					args.cancel = true;
				}
			}

			// delete 상태 스킵
			if (args.item.status == 'd') {
				args.cancel = true;
			}
		},
		fields : [
			{ name: "acitmCd"  , title:"계정과목코드", css:"cell", type: "text", width: 150, align:"center", editing : true,
				editTemplate : function(value, item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDiv").jsGrid("updateItem");
							return false;
						}
					});

					$result.attr("maxlength","10");

					return $result;
				},
				// 최대 150Byte 제한(한글 기준 50글자 제한)
				validate : {
					validator : "rangeLength",
					param : [ 1, 10 ],
					message : "[계정과목코드] 1~10글자를 넣어주세요."
				},	
			},
			{ name: "vrfItmNm" , title:"CoA", css:"cell", type: "text", width: 350, align:"left",editing : false},
			{ name: "status", title:"상태", css:"cell", type: "text", width: 40, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.getGridRowStatusName(value);		
			}},
			{ name: "gridManupulate", title:"그리드조작", css:"cell", type: "control",  width: 55, align:"left"}
		]
	});	
	//hideStyle

	//그리드 생성
	gridObject.gridCreate();

}

/**
 * @설명: 계정과목목록을 조회한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
function selectRamtSpcfAcitmCdList() {
	var reqParam = {};

	// 데이터 조회
	$.callAjax(reqParam, "/fi/at/fiat111p/selectRamtSpcfAcitmCdList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
	}).fail(function(data){
		alert("데이터 불러오기 실패");
		console.log("fail to selectAcitmCdList !!");
	});
}

/**
 * @설명: 엑셀저장 처리한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 */
function saveRamtSpcfAcitmCdExcel() {
	
	var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	
	if(gridData.length == 0) {
		$.fn.msgBox("저장할 대상이 없습니다.");
		return;
	}
	
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(gridData)}, "/fi/at/fiat111p/saveRamtSpcfAcitmCdExcel.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("총" +data.targetCnt+"건 중 "+ data.resultCnt +"건 정상처리되었습니다");
					resetGrid();
					$("#btn_cancel").click(); //버튼 초기화, 조회
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 그리드 하나의 행을 추가한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 */
function addGridData() {
	var dataList = $("#gridDiv").jsGrid("option", "data");
	dataList.unshift({
		acitmCd: "",
		vrfItmNm: "",
		"status" : "c"
	});

	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", dataList);
}

/**
 * 
 * @설명: 그리드 변경건 저장
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일:
 */
function saveGridDataAll() {
	// 전체 데이터
	var gridData = $("#gridDiv").jsGrid("option", "data");

	var saveList = [];
	var msgTxt = "";
	gridData.forEach(function(data, idx){
		
		if (data["status"] == 'c' || data["status"] == 'u' || data["status"] == 'd'){
			if (data["status"] == 'c' || data["status"] == 'u'){
				if(isEmpty(data["acitmCd"])){
					msgTxt = "계정과목코드를 입력하세요.";
					return false;
				}
				
				var cnt = 0;
				gridData.forEach(function(data2, idx2){ if (data["acitmCd"] == data2["acitmCd"]) cnt++; });
				if(cnt > 1){
					msgTxt = "저장 하려는 계정과목코드와 동일한 코드가 존재합니다.";
					return false;
				}
			}
			saveList.push(data);
		}
	});
	
	if(msgTxt != ""){
		$.fn.msgBox(msgTxt);
		return false;
	}
	
	if(saveList.length == 0){
		$.fn.msgBox("저장할 데이터가 없습니다.");
		return false;
	}

	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/at/fiat111p/saveRamtSpcfAcitmCd.do")
			.done(function(data) {
				if(data.result == "1") {
					if(saveList.length > 0){
						$.fn.msgBox("총" +data.targetCnt+"건 중 "+ data.resultCnt +"건 정상처리되었습니다");
					} else {
						$.fn.msgBox("정상처리되었습니다");
					}
					
					resetGrid();
					$("#btn_cancel").click(); //버튼 초기화, 조회
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}

/**
 * @설명: 팝업을 닫는다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 */
function popupClose() {
	resetGrid();
	window.close();
}

function isEmpty(value) {
	return typeof value === "undefined" || value == null || value == "" ? true : false;
}