/*******************************************************************
**   시스템명   : (부채결산)IFRS17
**   업무명     : 특약 포트폴리오 기본
**   설명      : 특약 포트폴리오 기본 수정입력 화면
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
	/*2021.04.30 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/*2021.06.15 화면명에 화면ID 추가*/
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
    /* 2021.06.16 저장 권한제어 추가 */
    $.fn.setBtnPermission([{"btnId":"#btn_save"}]);
    
	//초기데이터 세팅
	initSearchData();
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
});

/**
 * @설명: event 초기화
 * @최초작성자: 박상준
 * @최초작성일: 2021. 04. 12.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 04. 12. 최초작성
 */
function initEvent() {	
	//마감년월 입력창 blur
	$('#regYm').on('blur', function(e) {
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
	});
	
	//마감년월 달력버튼 click
	$("#btn_regYm").on("click", function(e){
		$("#regYm").datepicker("show");
	});		
	
	// 조회
	$('#btn_search').on('click', function(e){
		selectTrtyPotflList();
	});
	
	// 저장
	$('#btn_save').on('click', function(e){
		saveGridDataAll();
	});
	
	// 양식다운로드
	$('#btn_exportExcel').on('click', function(e){
		var paramObj = {};
		paramObj.id = 'gridDiv';
		paramObj.fileName = '특약포트폴리오기본정보.xlsx';	// 다운로드할 파일명
		paramObj.applyItemTemplate = false;				// 그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
		$.fn.exportGridExcel(paramObj);
	});
	
	// 업로드 
	$('#btn_loadExcel').on('click', function(e){
		loadExcel();
	});
	
	//조회조건 엔터키 조회
	$("#regYm").on("keypress", function(e) {
		if(e.keyCode == 13) {
			$("#btn_search").click();
			return false;
		}
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 박상준
 * @최초작성일: 2021. 04. 12.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 04. 12. 최초작성
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
				var status = "u";	//수정
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
			{ name: 'rinsTrtyCd', title:'재보험특약코드', css:'cell', type: 'text', width: 100, align:'center', editing: false, itemTemplate:function(value, item) {
				return $.fn.monthFormat(value, "-");
			}},
			{ name: 'rinsCoCd', title:'재보험회사코드', css:'cell', type: 'text', width: 80, align:'center', editing: false},
			{ name: 'prprScCd', title:'비례구분코드', css:'cell', type: 'text', width: 80, align:'center', editing: false},
			{ name: 'trtyVlntrScCd', title:'특약임의구분코드', css:'cell', type: 'text', width: 80, align:'center', editing: false},
			{ name: 'rinsPotflScCd', title:'재보험포트폴리오구분코드', css:'cell', type: 'text', width: 120, align:'center', editTemplate:function(value, item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);					
					$result.on('keydown', function(e){
						if(e.which === 13){
							$('#gridDiv').jsGrid('updateItem');
							return false;
						}
					});
				
					return $result;
				}, 
				validate: [{validator:'required', message:'[재보험포트폴리오구분코드]'}]
			},			
			{ name: 'regYm', title:'등록년월', css:'cell', type: 'text', width: 100, align:'center', editing: false, itemTemplate:function(value, item) {
				return $.fn.monthFormat(value, "-");			
			}},			
			{ name: 'regntEno', title:'등록자사번', css:'cell', type: 'text',  width: 90, align:'center', editing: false},
			{ name: 'regDtm', title:'등록일', css:'cell', type: 'text',  width: 100, align:'center', editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: 'trtrEno', title:'처리자사번', css:'cell', type: 'text',  width: 90, align:'center', editing: false},
			{ name: 'trtDtm', title:'처리일', css:'cell', type: 'text',  width: 100, align:'center', editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: 'status', title:'상태', css:'cell', type: 'text', width: 50, align:'center', editing: false, itemTemplate:function(value, item) {
				   return $.fn.getGridRowStatusName(value);			
			}},
			{ name: 'gridManupulate', title:'그리드조작', css:'cell', type: 'control', width: 70, align:'left',editing: true , deleteButton : false}
		]
	});
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 초기데이터 세팅
 * @최초작성자: 박상준
 * @최초작성일: 2021. 04. 12.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 04. 12. 최초작성
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
	
	var regYm = $.fn.monthFormat((year+month),'-');
	
	$('#regYm').val(regYm);    // 마감년월
	$('#regYm').focus();
}

/**
 * @설명: 특약포트폴리오 목록 조회
 * @최초작성자: 박상준
 * @최초작성일: 2021. 04. 12.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 04. 12. 최초작성
 */
function selectTrtyPotflList() {			
	var regYm = $.replaceAll($('#regYm').val().trim(), '-', ''); // 마감년월
	
	if ($.fn.isEmpty(regYm)) {
		$.fn.msgBox('마감년월을 입력하시기 바랍니다.');
		return false;
	}
	
	var reqParam = {};
	reqParam.regYm = regYm;

	$.callAjax(reqParam, '/ca/pr/capr911m/selectTrtyPotflList.do')
	.done(function(data) {	
		$('#gridDiv').jsGrid('reset');	//그리드 초기화
		savetp = 0;						//엑셀업로드 여부 초기화
		
		var listData = data.list;		//서버로 받아온 데이터 리스트
		
		//null -> "" 처리
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
 * @설명: 특약포트폴리오 저장 처리
 * @최초작성자: 박상준
 * @최초작성일: 2021. 04. 12.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 04. 12. 최초작성
 */
function saveGridDataAll() {
	
	if(savetp == '1') {
		$.fn.msgBox('기존에 없던 계약번호가 존재합니다.\n계약번호를 확인하시기 바랍니다.');
		return;
	}
	
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	
	//전체 데이터
	var gridData = $('#gridDiv').jsGrid('option', 'data');
	var ldYm = $.replaceAll($('#regYm').val().trim(), '-',''); // 마감년월
	
	var saveList = [];
	//c,u,d,e 건만 추출 후 저장 처리
	for (var i=0; i<gridData.length; i++) {
		var item = gridData[i];
		
		if (item.status == 'e' ) {
			if(!isValid(i, item)) { 
				return; 
			}
			saveList.push(item);
			
		} else if (item.status == 'c' || item.status == 'd'|| item.status == 'u') {
			if(!isValid(i, item)) { 
				return; 
			}
			saveList.push(item);
		}
	}
	
	if (saveList.length <= 0) {
		$.fn.msgBox('저장할 데이터가 없습니다.');
		return;
	}
	
	$.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
		if (obj.btn_ok) {
			$.callAjax({'list':JSON.stringify(saveList)}, '/ca/pr/capr911m/saveTrtyPotflList.do')
			.done(function(data) {
				if(data.result == '1') {
					$.fn.msgBox('정상적으로 처리되었습니다.', function() {
						//재조회
						selectTrtyPotflList();
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
 * @최초작성일: 2021. 04. 12.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 04. 12. 최초작성
 */
function isValid(rowIndex, item) {
	var rowIdx = rowIndex+1;
	
	//수정가능한 컬럼
	if ($.fn.isEmpty(item.rinsPotflScCd)) {
		$.fn.msgBox(rowIdx + '행의 재보험포트폴리오구분코드를 입력하시기 바랍니다.');
		return false;
	}
	
	if ($.fn.isEmpty(item.prprScCd)) {
		$.fn.msgBox(rowIdx + '행의 비례구분코드를 입력하시기 바랍니다.');
		return false;
	}	
	
	if ($.fn.isEmpty(item.trtyVlntrScCd)) {
		$.fn.msgBox(rowIdx + '행의 특약임의구분코드를 입력하시기 바랍니다.');
		return false;
	}
	
	/* 재보험포트폴리오구분코드 validation 체크 - 앞 두자리 문자 체크 */
	var tmp  = $.trim(item.trtyVlntrScCd) 
	var tmp2 = $.trim(item.prprScCd);
	var tmp3 = tmp+tmp2;
	var tmp4 = $.trim(item.rinsPotflScCd).substring(0,2);
	
	//console.log(tmp3);	
	
	if(tmp3 != tmp4)
	{
		$.fn.msgBox(rowIdx + "행의 재보험포트폴리오구분코드를 확인하시기 바랍니다." );	
		return false;
	}
	
	var isEng = /^[A-Z]{3,3}$/
	if (!isEng.test(item.rinsPotflScCd)) {
		$.fn.msgBox(rowIdx + '행의 재보험포트폴리오구분코드를 세자리 대문자 영문코드로 입력하시기 바랍니다.');
		return false;
	}	
	
	return true;
}

/**
 * @설명: EXCEL 업로드
 * @최초작성자: 박상준
 * @최초작성일: 2021. 04. 12.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: 
 * @개정이력: 
 *  박상준 2021. 04. 12. 최초작성
 */
function loadExcel() {
	var paramObj = {};
	paramObj.id = 'gridDiv';                 // 그리드 ID
	paramObj.callbackFn = function(data) {   // 그리드 바인딩 후 후처리 함수
		$.fn.msgBox('정상적으로 로드하였습니다.');		
	};
	
	$.fn.loadGridExcel(paramObj);
}
