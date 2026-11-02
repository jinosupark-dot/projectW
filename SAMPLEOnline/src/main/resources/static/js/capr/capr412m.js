/*******************************************************************
**   시스템명   : (부채결산)IFRS17
**   업무명     : IBNR장래손해조사비용IBNR비율_관리
**   설명      :   
**   최초작성자  : 서승호
**   최초작성일  : 2025.08.25
**   최종변경일  : 2025.08.25
**   개정이력    :
**    - 서승호 2025.08.25 신규작성
**    - 서승호 2026.02.23 수정작성 
*******************************************************************/

$(document).ready(function(){
	/*2021.04.30 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]"); /*2021.06.15 3차표준화*/
	
    /* 2021.06.16 저장 권한제어 추가 */
    $.fn.setBtnPermission([{"btnId":"#btn_save","type":"B"}]);
    
	//조회조건 초기화
	//initSearchData();
	
	//event 초기화
	initEvent();
	
	// 그리드 초기화_원수
	initGrid();	
	
});

/* 변수값 셋팅 */
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
	$('#finYm').focus();
}

/* 이벤트 바인딩 */
function initEvent() {
	//마감년월 입력창 blur
	$('#finYm').on('blur', function(e) {
		//빈값 체크
		if($.fn.isEmpty(this.value)) {
			return;
		}
		
		//날짜형식 체크
		if($.isValidYm(this.value)) {
			$(this).val($.fn.monthFormat(this.value));
		} else {
			$.fn.msgBox('마감년월의 날짜 형식이 맞지 않습니다. 다시 입력해주세요.');
			$(this).focus();
		}
	}).on("focus", function() {
		$(this).select();
	});
	
	//마감년월 달력버튼 click
	$("#btn_finYm").on("click", function(e){
		$("#finYm").datepicker("show");
	});
	
	// 조회
	$('#btn_search').on('click', function(e){
		selectIbnrFutLossInveCstRtoList();
	});
	
	// 저장
	$('#btn_save').on('click', function(e){
		saveGridDataAll();
	});
	
	// 행추가
	$('#btn_addGrid').on('click', function(e){
		addGridData();
	});
	
	// 양식다운로드
	$('#btn_exportExcel').on('click', function(e){
		exportExcel();
	});
	
	// 업로드 
	$('#btn_loadExcel').on('click', function(e){
		loadExcel();
	});
	
	//조회조건 엔터키 조회
	$("#finYm").on("keypress", function(e) {
		if(e.keyCode == 13) {
			$("#btn_search").click();
			return false;
		}
	});
}

/* 그리드 초기화 */
function initGrid(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: 'gridDiv',
		height: 500,  
		editing: true,
		sorting: true,
		paging: true,
		selectHiglight:false,
		deleteConfirm: '삭제하시겠습니까?',
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				//debugger;
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
				if (item.status == 'c' || item.status == 'e' ) {	//신규, 엑셀업로드 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else {	//u,d 는 삭제 상태로 처리 -> updateItem에서 최종  삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#gridDiv").jsGrid("updateItem", item);
					return item;
				}
			}
		},
	   fields: [		
		{ name: 'finYm', title:'마감년월', css:'cell', type: 'text', width: 90, align:'center', editing: true},
		{ name: 'futLossInveCstIbnrRto', title:'장래손해조사비용IBNR비율', css:'cell', type: 'text', width: 150, align:'right', editTemplate:function(value, item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDiv").jsGrid("updateItem");
						return false;
					}
				});

				$result.inputFilter(function(value) {					
					if($.isNumberFormat(value)) {
						return true;
					} else {
						return false;
					}
				})
				
				return $result;
			},
			validate: [{validator:'pattern', message:'[장래손해조사비용IBNR비율] 소수점 형식이 맞지 않습니다.', validator:function(value) {return $.isNumberFormat(value);}}]
		},
		{ name: 'futLossInveCstRbnsRto', title:'장래손해조사비용개별추산액비율', css:'cell', type: 'text', width: 150, align:'right', editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				$result.prop("readonly",true).attr("placeholder","저장 시 자동 계산(장래손해조사비용IBNR비율 * 0.5)");
				return $result;
			}
		},
		{ name: 'regntEno', title:'등록자사번', css:'cell', type: 'text',  width: 80, align:'center', editing: false},
		{ name: 'regDtm', title:'등록일시', css:'cell', type: 'text',  width: 80, align:'center', editing: false, itemTemplate:function(value, item) {
			return $.fn.dateFormat(value, "-");			
		}},
		{ name: 'trtrEno', title:'처리자사번', css:'cell', type: 'text',  width: 80, align:'center', editing: false},
		{ name: 'trtDtm', title:'처리일시', css:'cell', type: 'text',  width: 80, align:'center', editing: false, itemTemplate:function(value, item) {
			return $.fn.dateFormat(value, "-");			
		}},
		{ name: 'status', title:'상태', css:'cell', type: 'text', width: 50, align:'center', editing: false, itemTemplate:function(value, item) {
			return $.fn.getGridRowStatusName(value);			
		}},
		{ name: 'gridManupulate', title:'그리드조작', css:'cell', type: 'control', width: 70, align:'left',editing: true}] 
	});	

	//그리드 생성
	gridObject.gridCreate();
}

/* 조회 */
function selectIbnrFutLossInveCstRtoList() {		
	
	var finYm = $.replaceAll($('#finYm').val().trim(),'-','');  // 마감년월
	
//	if ($.fn.isEmpty(finYm)) {
//		$.fn.msgBox('마감년월을 입력하시기 바랍니다.');
//		return false;
//	}
	
	var reqParam = {};
	reqParam.finYm = finYm;
	
	$.callAjax(reqParam, '/ca/pr/capr412m/selectIbnrFutLossInveCstRtoList.do')
	.done(function(data) {	
		var listData = data.list;  	  	    //서버로 받아온 데이터 리스트
		//그리드 바인딩
		$('#gridDiv').jsGrid('reset');
		$('#gridDiv').jsGrid('loadData', listData).done(function(){
		});
			
		// 0건 그리드 메세지 처리부분
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		$.fn.msgBox('목록 조회가 실패했습니다.');
	});		
}

/* 저장 */
function saveGridDataAll() {	
	var gridData = {};
	var editRowClass = {};   
	
	gridData = $('#gridDiv').jsGrid('option', 'data'); 
	editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	
	var saveList = [];
	//c,u,d,e 건만 추출 후 저장 처리
	for (var i=0; i<gridData.length; i++) {
		var item = gridData[i];
		
		//삭제를 제외한 경우에만 유효값 체크
		if(item.status != "d") {
			//유효값체크
			if(!isValid(i, item)) { return; }
		}
		
		if (item.status == 'e') {
			if(! isValid(i,item)) { 
				return; 
			}
	
			saveList.push(item);
		} 
		else if (item.status == 'c' || item.status == 'u' || item.status == 'd') {
			
			saveList.push(item);
		}
	}
	
	//업로드 후 저장할 경우 그리드 데이터가 있는 경우만 저장 처리
	if( gridData.length > 0)
	{	
		$.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
			if (obj.btn_ok) {
				$.callAjax({'list':JSON.stringify(saveList)}, '/ca/pr/capr412m/saveIbnrFutLossInveCstRtoList.do')
				.done(function(data) {
					if(data.result == '1') {
						$.fn.msgBox('정상적으로 처리되었습니다.');
						selectIbnrFutLossInveCstRtoList();					
					}
				}).fail(function(data){
					$.fn.msgBox('데이터 저장이 실패했습니다.');
				});
							
			}
		}, 2);	
	}
	else {
		$.fn.msgBox('저장할 데이터가 없습니다.');
		return;
	}
		
}

/* 행추가 */
function addGridData() {
	var dataList = {};
	var seq = 0;
		
	dataList = $("#gridDiv").jsGrid("option", "data");
	seq = dataList.length + 1;
	$('#gridDiv').jsGrid('insertItem', 
			{ 
	        	'seq': seq
		      , 'status': 'c'
			  , 'finYm':$.replaceAll($('#finYm').val().trim(),'-','')              /* 마감년월                  */
			  , 'futLossInveCstIbnrRto': ''      /* 장래손해조사비용IBNR비율   */
			  , 'futLossInveCstRbnsRto': ''    /* 장래손해조사비용개별추산액비율   */
			  , 'regntEno': ''          /* 등록자사번                 */
			  , 'regDtm': ''            /* 등록일시                  */
			  , 'trtrEno': ''           /* 처리자사번                 */
			  , 'trtDtm': ''            /* 처리일시                  */	
			}
	);	 
	
	//마지막 페이지 이동
	var pageLastText = $("#gridDiv").jsGrid("option", "pageLastText");
	$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();	
}

/* 저장전 체크  */
function isValid(rowIndex, item) {
	var rowIdx = rowIndex+1;	
	
	if ($.fn.isEmpty(item.finYm)) {
		$.fn.msgBox(rowIdx + '행의 마감년월을 입력하시기 바랍니다.');
		return false;
	}
	
	if (item.finYm.trim().length != 6) {
		$.fn.msgBox(rowIdx + '행의 마감년월 입력 자리수를 확인해 주시기 바랍니다.');
		return false;
	}	
	
//	if ($.fn.isEmpty(item.futLossInveCstIbnrRto)) {	- 수정 20260223
	var futLossInveCstIbnrRto = item.futLossInveCstIbnrRto; 
	if (futLossInveCstIbnrRto === "" || futLossInveCstIbnrRto === null
			|| futLossInveCstIbnrRto === undefined) {
		$.fn.msgBox(rowIdx + '행의 장래손해조사비용IBNR비율을 입력하시기 바랍니다.');
		return false;
	}
	
	if (item.futLossInveCstIbnrRto > 1) {
		$.fn.msgBox(rowIdx + '행의 값 오류(확률은 0부터 1 사이의 값입니다.)');
		return false;
	}
	
	return true;
}

/* 엑셀양식 다운로드 */
function exportExcel() {
	var gridId = 'gridDiv';
	var fileName = 'IBNR장래손해조사비용비율_관리_업로드양식.xlsx';
	
	var paramObj = {};
	paramObj.id = gridId;
	paramObj.fileName = fileName;         // 다운로드할 파일명
	paramObj.applyItemTemplate = false;   // 그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
	$.fn.exportGridExcel(paramObj);
}

/* 엑셀 업로드 */
function loadExcel() {
	var gridId = 'gridDiv';
	
	var paramObj = {};
	paramObj.id = gridId;                    // 그리드 ID
	paramObj.callbackFn = function(data) {   // 그리드 바인딩 후 후처리 함수
		if(data.result == '1') {
			var gridData = {};
			gridData = $('#gridDiv').jsGrid('option', 'data');
			for (var i=0; i<gridData.length; i++) {
				var item = gridData[i];
				item.status = 'c'; //엑셀업로드시 중복 데이터 입력시 체크하기 위해 신규 입력으로 변경
				item.futLossInveCstRbnsRto = "";	//서버에서 계산 후 입력
				$('#gridDiv').jsGrid('refresh');	//해당 callback함수는 그리드 매핑 후 호출되는 함수라 refresh 해줘야 grid에 값이 바뀜.
			}
		}
	};
	
	$.fn.loadGridExcel(paramObj);
}


/* 숫자(율), 정수1 소수6 */
$.isNumberFormat = function(value){return /^\d{0,1}\.?\d{0,6}$/.test(value);};