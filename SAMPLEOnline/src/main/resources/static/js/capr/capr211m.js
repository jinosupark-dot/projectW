/**
 * @시스템명: IFRS17
 * @업무명: 할인율 관리
 * @설명: 할인율 관리 JS
 * @최초작성자: 임나연
 * @최초작성일: 2021.01.14
 * @최종변경일: 2021.11.22
 * @개정이력:
 *  임나연 2021.01.14 최초작성
 *  임나연 2021.06.15 3차 표준화
 *  황석현 2021.11.22 화폐코드 엔터키 조회 추가
 */
$(document).ready(function(){
	$.fn.loadCommonCode(["CRNCY_CD", "STND_CRNCY_CD"]);
	
	/*2021.05.03 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	
	// 2021.06.15 화면ID 셋팅
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	// 2021.06.15 버튼 권한 처리
	$.fn.setBtnPermission([{"btnId":"#btn_save","type":"A"}]);
	
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
	$('#fromPsgMms').val(1);   // From시점
	$('#toPsgMms').val(1200);  // To시점
	
	$('#finYm').focus();       // 구분 포커스
	
	//공통코드성 초기화
	initCommCd();
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
});

/**
 * @설명: 공통코드성 조회 
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.22
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.22 최초작성
 */
function initCommCd() {
	
	//콤보박스 세팅
	$.fn.renderCombobox({
		codeArr: ["STND_CRNCY_CD"],
		selArr: ["crncyCd"],
		firstOptionText: ["-전체-"]
	});
	
}

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
	});
	
	//마감년월 달력버튼 click
	$('#btn_finYm').on('click', function(e){
		$('#finYm').datepicker('show');
	});
	
	// from시점
	$('#fromPsgMms').inputFilter(function(value){
		 return $.isNumber(value)
	 });

	// to시점
	$('#toPsgMms').inputFilter(function(value){
		 return $.isNumber(value)
	 });
	
	// 조회
	$('#btn_search').on('click', function(e){
		selectDiscRatList();
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
	$('#btn_exportCSV').on('click', function(e){		
		var paramObj = {};
		paramObj.id = 'gridDiv';
		paramObj.fileName = '할인율업로드양식.csv';                // 다운로드할 파일명
		paramObj.applyItemTemplate = false;                    // 그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
		$.fn.exportGridCSV(paramObj);
	});
	
	// 업로드 
	$('#btn_loadCSV').on('click', function(e){
		loadCSV();
	});
	
	// 조회조건 엔터키 조회
	$('#fromPsgMms, #toPsgMms , #finYm, #crncyCd').on("keypress", function(e) {
		if(e.keyCode === 13) {
			$("#btn_search").click();
			return false;
		}
	});
	
}


function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: 'gridDiv',
		height: 600,
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
				//debugger;
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
		    { name: 'seq', title:'순번', css:'cell', type: 'text', width: 50, align:'center', editing: false},
			{ name: 'finYm', title:'마감년월', css:'cell', type: 'text', width: 100, align:'center', editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					// 신규 외엔 수정 불가
					if(item.status != 'c' && item.status != 'e') {
						$result.attr('readonly', 'true');
					}
					
					$result.on('keydown', function(e){
						if(e.which === 13){
							$('#gridDiv').jsGrid('updateItem');
							return false;
						}
					}).on("input",function(e){
						var val = $(this).val();
						$(this).val(val.replace(/[^\d]/g, ""));
					});
					
					return $result;
				}, 
				validate: [{validator:'required', message:'[마감년월] 필수 입력 항목입니다.'}
							, {validator:'minLength', param:6, message:'[마감년월] 입력 자리수는 6자리입니다.'}
							, {validator:'maxLength', param:6, message:'[마감년월] 입력 자리수는 6자리입니다.'}
							, {validator:'pattern', message:'[마감년월] 날짜 형식이 맞지 않습니다.', validator:function(value) {return $.isValidYm(value);}}
							]
			},
			{ name: 'crncyCd', title:'화폐코드', css:'cell', type: 'select', width: 100, align:'center', editTemplate:function(value, item) {
				var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value, item);
					// 신규 외엔 수정 불가
					if(item.status != 'c' && item.status != 'e') {
						$result.attr('disabled', 'true');
					}
					
					$result.on('keydown', function(e){
						if(e.which === 13){
							$('#gridDiv').jsGrid('updateItem');
							return false;
						}
					});
					
					return $result;
				}, 
				items: $.fn.getGridCodeItem('CRNCY_CD'),
				textField: 'code',
				valueField: 'code',
				validate: [{validator:'required', message:'[화폐코드] 필수 입력 항목입니다.'}]
			},
			{ name: 'psgMms', title:'시점', css:'cell', type: 'number', width: 100, align:'center', editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					// 신규 외엔 수정 불가
					if(item.status != 'c' && item.status != 'e') {
						$result.attr('readonly', 'true');
					}
					
					$result.on('keydown', function(e){
						if(e.which === 13){
							$('#gridDiv').jsGrid('updateItem');
							return false;
						}
					}).on("input",function(e){
						var val = $(this).val();
						$(this).val(val.replace(/[^\d]/g, ""));
					});
					
					return $result;
				}, 
				validate: [{validator:'required', message:'[시점] 필수 입력 항목입니다.'}
							, {validator:'min', param:1, message:'[시점] 허용범위를 초과한 입력값입니다.(허용범위: 1~1200)'}
							, {validator:'max', param:1200, message:'[시점] 허용범위를 초과한 입력값입니다.(허용범위: 1~1200)'}
							, {validator:'pattern', message:'[시점] 숫자만 입력 가능합니다.', validator:function(value) {return $.isNumber(value);}}
							]
			},
			{ name: 'ycDiscRat', title:'할인율', css:'cell', type: 'text', width: 150, align:'right', editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				$result.on('keydown', function(e){
					if(e.which === 13){
						$('#gridDiv').jsGrid('updateItem');
						return false;
					}
				}).on("input",function(e){
					var val = $(this).val();
					if(val.indexOf(".") > -1) {
						var arr = val.split(".");
						$(this).val(arr[0].replace(/[^\d]/g, "") + "." + arr[1].replace(/[^\d]/g, ""));
					} else {
						$(this).val(val.replace(/[^\d]/g, ""));
					}
				});
				
				return $result;
			},
				validate: [{validator:'required', message:'[할인율] 필수 입력 항목입니다.'}]
			},
			{ name: 'regntEno', title:'등록자사번', css:'cell', type: 'text',  width: 100, align:'center', editing: false},
			{ name: 'regDtm', title:'등록일자', css:'cell', type: 'text',  width: 70, align:'center', editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: 'trtrEno', title:'처리자사번', css:'cell', type: 'text',  width: 100, align:'center', editing: false},
			{ name: 'trtDtm', title:'처리일자', css:'cell', type: 'text',  width: 70, align:'center', editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: 'status', title:'상태', css:'cell', type: 'text', width: 30, align:'center', editing: false, itemTemplate:function(value, item) {
				return $.fn.getGridRowStatusName(value);			
			}},
			{ name: 'gridManupulate', title:'그리드조작', css:'cell', type: 'control', width: 70, align:'left',editing: true }
		]
	});	

	//그리드 생성
	gridObject.gridCreate();
}


// 조회
function selectDiscRatList() {			
	var finYm = $.replaceAll($('#finYm').val().trim(), '-',''); // 마감년월
	var crncyCd = $('#crncyCd option:selected').val().trim();   // 화폐코드
	var fromPsgMms = $('#fromPsgMms').val();                    // From시점
	var toPsgMms = $('#toPsgMms').val();                        // To시점
	
	if ($.fn.isEmpty(finYm)) {
		$.fn.msgBox('마감년월을 입력하시기 바랍니다.');
		return false;
	}
	
	if ($.fn.isEmpty(fromPsgMms)) {
		$.fn.msgBox('From시점을 입력하시기 바랍니다.(허용범위: 1~1200)');
		return false;
	}
	
	if ($.fn.isEmpty(toPsgMms)) {
		$.fn.msgBox('To시점을 입력하시기 바랍니다.(허용범위: 1~1200)');
		return false;
	}
	
	if (fromPsgMms < 0 || fromPsgMms > 1200) {
		$.fn.msgBox('From시점의 허용범위를 초과한 입력값입니다.(허용범위: 1~1200)');
		return false;
	}
	
	if (toPsgMms < 0 || toPsgMms > 1200) {
		$.fn.msgBox('To시점의 허용범위를 초과한 입력값입니다.(허용범위: 1~1200)');
		return false;
	}
	
	var reqParam = {};
	reqParam.finYm = finYm;
	reqParam.crncyCd = crncyCd;
	reqParam.fromPsgMms = fromPsgMms;
	reqParam.toPsgMms = toPsgMms;

	$.callAjax(reqParam, '/ca/pr/capr211m/selectDiscRatList.do')
	.done(function(data) {	
		$('#gridDiv').jsGrid('reset');
		var listData = data.list;  	  	    //서버로 받아온 데이터 리스트
		// 그리드 바인딩
		$('#gridDiv').jsGrid('loadData', listData).done(function(){
		});		
		
		// 2021.06.15 0건 그리드 메세지 처리
		if (listData.length == 0) {
			$.fn.getReturnValue('gridDiv');
		}
	}).fail(function(data){
		$.fn.msgBox('목록 조회가 실패했습니다.');
	});		
}


// 저장
function saveGridDataAll() {
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
		
		if (item.status == 'c'|| item.status == 'u'|| item.status == 'e' || item.status == 'd') {
			if(! isValid(i,item)) { 
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
			$.callAjax({'list':JSON.stringify(saveList)}, '/ca/pr/capr211m/saveDiscRatList.do')
			.done(function(data) {
				if(data.result == '1') {
					$.fn.msgBox('정상적으로 처리되었습니다.');
					selectDiscRatList();
				}
			}).fail(function(data){
				$.fn.msgBox('데이터 저장이 실패했습니다.');
			});
		}
	}, 2);
}


// 행추가
function addGridData() {
	var dataList = $("#gridDiv").jsGrid("option", "data");
	var seq = dataList.length + 1;
	
	$('#gridDiv').jsGrid('insertItem', 
		{
          'seq': seq,
		  'status': 'c',
		  'finYm': $.replaceAll($('#finYm').val().trim(), '-',''),
		  'crncyCd': '',
		  'psgMms': '',
		  'ycDiscRat': '',
		  'regntEno':'',
		  'regDtm': '',
		  'trtrEno':'',
		  'trtDtm': ''
		}
	);	
	
	var pageLastText = $("#gridDiv").jsGrid("option", "pageLastText");
	$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
}

// 데이터 저장전 validation 체크
function isValid(rowIndex, item) {
	
	var rowIdx = rowIndex+1;
	
	if (item.status == 'e') {
		if ($.fn.isEmpty(item.finYm)) {
			$.fn.msgBox(rowIdx + '행의 마감년월을 입력하시기 바랍니다.');
			return false;
		}
		
		if (item.finYm.trim().length != 6) {
			$.fn.msgBox(rowIdx + '행의 마감년월 입력 자리수를 확인해 주시기 바랍니다.');
			return false;
		}	
		
		if ($.fn.isEmpty(item.crncyCd)) {
			$.fn.msgBox(rowIdx + '행의 화폐코드를 입력하시기 바랍니다.');
			return false;
		}
		
		if ($.fn.isEmpty(item.psgMms)) {
			$.fn.msgBox(rowIdx + '행의 시점을 입력하시기 바랍니다.(허용범위: 1~1200)');
			return false;
		}
		
		if (item.psgMms <= 0 || item.psgMms > 1200) {
			$.fn.msgBox(rowIdx + '행의 시점이 허용범위를 초과한 입력값입니다.(허용범위: 1~1200)');
			return false;
		}
		
		if ($.fn.isEmpty(item.ycDiscRat)) {
			$.fn.msgBox(rowIdx + '행의 할인율을 입력하시기 바랍니다.');
			return false;
		}
	}
	
	return true;
}


// 업로드
function loadCSV() {
	var paramObj = {};
	paramObj.id = 'gridDiv';                 // 그리드 ID
	paramObj.callbackFn = function(data) {   // 그리드 바인딩 후 후처리 함수
		$.fn.msgBox('정상적으로 로드하였습니다.');
	};
	
	$.fn.loadGridCSV(paramObj); 
}
