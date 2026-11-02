/*******************************************************************
**   시스템명   : (부채결산)IFRS17
**   업무명     : 재보험 포트폴리오 기본
**   설명      : 재보험 포트폴리오 기본 조회 화면
**   최초작성자  : 박상준
**   최초작성일  : 2021.03.02
**   최종변경일  : 2021.06.18
**   개정이력    :
**    - 박상준 2021.03.02 신규작성
**    - 박상준 2021.03.18 1차검증
**    - 박상준 2021.04.27 2차표준화 
**    - 박상준 2021.06.18 3차표준화  
*******************************************************************/

var savetp = 0;	//엑셀업로드 시, 건수 비교(0:저장가능, 1:저장불가)

$(document).ready(function(){
	//초기데이터 세팅
	//initSearchData();
	/*2021.04.30 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]"); /*2021.06.15 3차표준화*/
	
	/* 2021.06.16 저장 권한제어 추가 */    
    $.fn.setBtnPermission([{"btnId":"#btn_save"}]);
    
	//공통코드 조회
	selectCommonCode();	
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
});

/**
 * @설명: 공통코드 조회
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.25
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.25 최초작성
 */
function selectCommonCode() {
	//공통코드 조회(특약임의구분코드, 비례구분코드, 재보험포트폴리오위험구분코드)
	$.fn.loadCommonCode(["TRTY_VLNTR_SC_CD","PRPR_SC_CD","RINS_POTFL_RSK_SC_CD"]);
	
	// 콤보박스 세팅
	var paramObj = {};
	paramObj.codeArr = ["TRTY_VLNTR_SC_CD","PRPR_SC_CD","RINS_POTFL_RSK_SC_CD"];	
	paramObj.selArr = ["sbx_trtyVlntrScCd", "sbx_prprScCd", "sbx_rinsPotflRskScCd"];	
	paramObj.displayMode = "value delim label";			
	paramObj.displayDelimiter = ":";
	paramObj.firstOptionText = ["-전체-"];
	
	$.fn.renderCombobox(paramObj);	
}

/**
 * @설명: event 초기화
 * @최초작성자: 박상준
 * @최초작성일: 2021. 03. 26.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 03. 26. 최초작성
 */
function initEvent() {	
		
	$('#btn_search').focus();
	
	// 조회
	$('#btn_search').on('click', function(e){
		selectRinsPotflBasList();
	});
	
	// 저장
	$('#btn_save').on('click', function(e){
		saveGridDataAll();
	});
	
	// 양식다운로드
	$('#btn_exportExcel').on('click', function(e){
		var paramObj = {};
		paramObj.id = 'gridDiv';
		paramObj.fileName = '재보험포트폴리오기본정보.xlsx';	// 다운로드할 파일명
		paramObj.applyItemTemplate = false;			// 그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
		$.fn.exportGridExcel(paramObj);
	});
	
	// 업로드 
	$('#btn_loadExcel').on('click', function(e){
		loadExcel();
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 박상준
 * @최초작성일: 2021. 03. 26.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 03. 26. 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: 'gridDiv',
		height: 600,
		editing: true,
		sorting: true,
		paging: true,
		deleteConfirm: '삭제하시겠습니까?',
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				var status = 'u';	//수정
				if(item.status == 'c' || item.status == 'e' ) {	//신규, 엑셀업로드는 c,e상태 유지 후 데이터 수정
				} else if(item.status == 'dd'){	//삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { //grid 삭제 아이콘 클릭 또는 deleteItem API이용시 진입
				//deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = 'dd';	//삭제 신청
				if (item.status == 'c' || item.status == 'e' ) {	//신규,엑셀업로드 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else {	//u,d 는 삭제 상태로 처리 -> updateItem에서 최종  삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$('#gridDiv').jsGrid('updateItem', item);
					return item;
				}
			}
		},
		fields: [
			{ name: 'rinsPotflScCd', title:'재보험포트폴리오구분', css:'cell', type: 'text', width: 105, align:'center', editing: false},
			{ name: 'rinsPotflNm', title:'재보험포트폴리오명', css:'cell', type: 'text', width: 140, align:'left', editing: false},
			{ name: 'trtyVlntrScCd', title:'특약임의구분코드', css:'cell', type: 'text', width: 100, align:'center', editing: false},
			{ name: 'prprScCd', title:'비례구분코드', css:'cell', type: 'text', width: 150, align:'center',editing: false},		
			{ name: 'rinsPotflRskScCd', title:'재보험포트폴리오위험구분코드', css:'cell', type: 'text', width: 120, align:'center', editing: false},
			{ name: 'regntEno', title:'등록자사번', css:'cell', type: 'text',  width: 70, align:'center', editing: false},
			{ name: 'regDtm', title:'등록일', css:'cell', type: 'text',  width: 110, align:'center', editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: 'trtrEno', title:'처리자사번', css:'cell', type: 'text',  width: 70, align:'center', editing: false},
			{ name: 'trtDtm', title:'처리일', css:'cell', type: 'text',  width: 110, align:'center', editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}}			
//			{ name: 'status', title:'상태', css:'cell', type: 'text', width: 50, align:'center', editing: false, itemTemplate:function(value, item) {
//				   return $.fn.getGridRowStatusName(value);			
//			}},
//			{ name: 'gridManupulate', title:'그리드조작', css:'cell', type: 'control', width: 70, align:'left',editing: false , deleteButton : false}
		]
	});
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 초기데이터 세팅
 * @최초작성자: 박상준
 * @최초작성일: 2021. 03. 26.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 03. 26. 최초작성
 */
function initSearchData() {
	// 마감년월 셋팅
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();
	
	var calcDate = new Date(year, month, "1");
	calcDate.setMonth(month - 1);
	
	year = calcDate.getFullYear();
	month = '' + (calcDate.getMonth()+1);
	
	if (month.length < 2) month = '0' + month;
	
	var finYm = $.fn.monthFormat((year+month),'-');
	
	$('#finYm').val(finYm);    // 마감년월
}

/**
 * @설명: IFRS17 재보험 포트폴리오 정보목록 조회
 * @최초작성자: 박상준
 * @최초작성일: 2021. 03. 26.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 03. 26. 최초작성
 */
function selectRinsPotflBasList() {
	
	var finYm = "";
	
	var reqParam = {};
	reqParam.finYm = finYm;

	$.callAjax(reqParam, '/ca/pr/capr811m/selectRinsPotflBasList.do')
	.done(function(data) {	
		$('#gridDiv').jsGrid('reset');	//그리드 초기화
		savetp = 0;						//엑셀업로드 여부 초기화
		
		var listData = data.list;		//서버로 받아온 데이터 리스트
		var strListData = "";
		if(listData.length > 0) {
			strListData = $.replaceAll(JSON.stringify(listData), "null", "\"\"");
			listData = JSON.parse(strListData);
		}
		
		//그리드 바인딩
		$('#gridDiv').jsGrid('loadData', listData);
		
		// 0건 그리드 메세지 처리부분
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		$.fn.msgBox('목록 조회가 실패했습니다.');
	});		

}

/**
 * @설명: IFRS17 재보험 포트폴리오 정보 저장 처리
 * @최초작성자: 박상준
 * @최초작성일: 2021. 03. 26.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  ㅍ 2021. 03. 26. 최초작성
 */
function saveGridDataAll() {
	
//	if(savetp == '1') {
//		$.fn.msgBox('기존에 없던 계약번호가 존재합니다.\n계약번호를 확인하시기 바랍니다.');
//		return;
//	}
	
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	
	//전체 데이터
	var gridData = $('#gridDiv').jsGrid('option', 'data');
	
	var saveList = [];
	//c,u,d,e 건만 추출 후 저장 처리
	for (var i=0; i<gridData.length; i++) {
		var item = gridData[i];
		
		if (item.status == 'e' || item.status == 'u') {
			if(!isValid(i, item)) { 
				return; 
			}
			saveList.push(item);
			
		} else if (item.status == 'c' || item.status == 'd') {
			saveList.push(item);
		}
	}
	
	if (saveList.length <= 0) {
		$.fn.msgBox('저장할 데이터가 없습니다.');
		return;
	}
	
	$.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
		if (obj.btn_ok) {
			$.callAjax({'list':JSON.stringify(saveList)}, '/ca/pr/capr811m/saveRinsPotflBasList.do')
			.done(function(data) {
				if(data.result == '1') {
					$.fn.msgBox('정상적으로 처리되었습니다.', function() {
						//재조회
						selectRinsPotflBasList();
					});
				}
			}).fail(function(data){
				$.fn.msgBox('데이터 저장이 실패했습니다.');
			});
		}
	}, 2);
}

/**
 * @설명: 데이터 저장전 validation 체크
 * @최초작성자: 박상준
 * @최초작성일: 2021. 03. 26.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 03. 26. 최초작성
 */
function isValid(rowIndex, item) {
	var rowIdx = rowIndex+1;
	
	//필수입력 PK컬럼	
	if ($.fn.isEmpty(item.rinsPotflScCd)) {
		$.fn.msgBox(rowIdx + '행의 재보험포트폴리오구분를 입력하시기 바랍니다.');
		return false;
	}
	if (item.rinsPotflScCd.trim().length > 3) {
		$.fn.msgBox(rowIdx + '행의 재보험포트폴리오구분 입력 자리수를 확인해 주시기 바랍니다.');
		return false;
	}		
	if ($.fn.isEmpty(item.rinsPotflNm)) {
		$.fn.msgBox(rowIdx + '행의 재보험포트폴리오명을 입력하시기 바랍니다.');
		return false;
	}
	if (item.rinsPotflNm.trim().length > 300) {
		$.fn.msgBox(rowIdx + '행의 재보험포트폴리오명을 입력 자리수를 확인해 주시기 바랍니다.');
		return false;
	}		
	if ($.fn.isEmpty(item.trtyVlntrScCd)) {
		$.fn.msgBox(rowIdx + '행의 특약임의구분코드를 입력하시기 바랍니다.');
		return false;
	}
	
	//수정가능한 컬럼
	if ($.fn.isEmpty(item.prprScCd)) {
		$.fn.msgBox(rowIdx + '행의 비례구분코드를 입력하시기 바랍니다.');		
		return false;
	}
	if ($.fn.isEmpty(item.rinsPotflRskScCd)) {
		$.fn.msgBox(rowIdx + '행의 재보험포트폴리오위험구분코드를 입력하시기 바랍니다.');
		return false;
	}
	
	
	return true;
}

/**
 * @설명: Excel 업로드
 * @최초작성자: 박상준
 * @최초작성일: 2021. 03. 26.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 03. 26. 최초작성
 */
function loadExcel() {
	var paramObj = {};
	paramObj.id = 'gridDiv';                 // 그리드 ID
	paramObj.callbackFn = function(data) {   // 그리드 바인딩 후 후처리 함수
		$.fn.msgBox('정상적으로 로드하였습니다.');
		//compr();
	};
	
	$.fn.loadGridExcel(paramObj);
}

/**
 * @설명: Excel 업로드 데이터와 마감년월의 데이터를 조회하여 건수 비교
 * @최초작성자: 박상준
 * @최초작성일: 2021. 03. 26.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 03. 26. 최초작성
 */
function compr() {	
	
	var reqParam = {};	
	
	var finYm = $.replaceAll($('#finYm').val().trim(), '-',''); // 마감년월
	reqParam.finYm = finYm;

	$.callAjax(reqParam, '/ca/pr/capr811m/selectRinsInsrIvtContMngCnt.do')
	.done(function(data) {
		//DB 조회한 데이터
		var recordCnt = data.cnt;
		
		//엑셀업로드로 그리드에 import된 데이터
		var gridData = $('#gridDiv').jsGrid('option', 'data');
		var uploadCnt = gridData.length;
		
		if(uploadCnt != recordCnt){
			savetp = '1';
		    $.fn.msgBox('기존에 없던 계약번호가 존재합니다.\n계약번호를 확인하시기 바랍니다.');		    
		} else {
			savetp = '0'; 
			$.fn.msgBox('정상적으로 로드하였습니다.');
		}
		
	}).fail(function(data){
		$.fn.msgBox('엑셀업로드를 실패했습니다.');
		$('#gridDiv').jsGrid('option', 'data', []);
	});	
	
}

/**
 * 
 * @설명: 그리드에 사용할 코드리스트를 반환한다.
 *       본함수를 사용하기전 $.fn.loadCommonCode로 코드정보들을 조회하여야 한다.
 * @최초작성자: 62000290
 * @최초작성일: 2021. 04. 23.
 * @최종변경일: 2021. 04. 23.
 * @매개변수: codeId : 코드 ID
 * @반환값: void
 * @개정이력: 
 *  62000290 2021. 04. 23. 최초작성
 */
$.getCodeItem = function(codeId) {
	var codeItemList = [];
	var codeDataList = [];
	var displayDelimiter = ":";
	var firstOptionText = "-선택-";
	var firstOptionValue = "";

	var tmpCodeDataList = $._commonObj["code"][codeId];
	for(var i=0; i<tmpCodeDataList.length; i++) {
		var tmpCode = tmpCodeDataList[i];
		codeDataList.push(tmpCode);		
	}	
	
	codeItemList.push({code:firstOptionValue, codeNm:firstOptionText});
	
	return codeItemList.concat(codeDataList);
};

/* 
 * @설명: 키입력 이벤트
 *       - enterkey 입력시 조회
 * @최초작성자: 62000293
 * @최초작성일: 2021. 06. 16.
 * @최종변경일: 2021. 06. 16.
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 * */

function keyevent()
{
	var keycode = event.keyCode;
	
	if(keycode == 13) {
		$("#btn_search").click();
		return false;
	}	
};

