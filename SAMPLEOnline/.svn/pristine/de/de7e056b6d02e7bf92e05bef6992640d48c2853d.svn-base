/**
 * @시스템명: IFRS17
 * @업무명: IBNR 이행현금흐름 관리
 * @설명: IBNR 이행현금흐름 관리 JS
 * @최초작성자: 임나연
 * @최초작성일: 2021.01.20
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  임나연 2021.01.20 최초작성
 *  임나연 2021.06.15 3차 표준화
 *  황석현 2021.11.22 구분 엔터키 조회 추가
 */
$(document).ready(function(){
	$.fn.loadCommonCode(["RINS_CO_CD", "I17_EXNEX_DVD_SC_CD", "IBNR_COLTR_SC_CD"]);
	
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
	
	$('#gubun').focus();       // 구분 포커스
	
	
	//event 초기화
	initEvent();
	
	if($('#gubun').val('1')) {  // 구분: 원수보험
		// 그리드 초기화_원수
		initGridDwr();
	}
	else {                      // 구분: 재보험
		//그리드 초기화_재보험
		initGridRins();	
	}
	
	
});


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
	
	// 조회
	$('#gubun').on('change', function(e){
		var gubun = $('#gubun option:selected').val();
		if (gubun == '1') {
			$("#gridDivRins").jsGrid("destroy");
			initGridDwr();
		} else {
			$("#gridDivDwr").jsGrid("destroy");
			initGridRins();
		}
	});
	
	//마감년월 달력버튼 click
	$("#btn_finYm").on("click", function(e){
		$("#finYm").datepicker("show");
	});
	
	// 조회
	$('#btn_search').on('click', function(e){
		selectIbnrFlfmCflList();
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
		var gubun = $('#gubun option:selected').val().trim();          // 구분
		var gridId = (gubun == '1' ? 'gridDivDwr' : 'gridDivRins');
		var fileName = (gubun == '1' ? '원수보험_IBNR이행현금흐름_업로드양식.xlsx' : '재보험_IBNR이행현금흐름_업로드양식.xlsx');

		var paramObj = {};
		paramObj.id = gridId;
		paramObj.fileName = fileName;         // 다운로드할 파일명
		paramObj.applyItemTemplate = false;   // 그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
		$.fn.exportGridExcel(paramObj);
	});
	
	// 업로드 
	$("#btn_loadExcel").on("click", function(e){
		var gubun = $('#gubun option:selected').val().trim();  // 구분
		var gridId = (gubun == '1' ? 'gridDivDwr' : 'gridDivRins');
		
		var paramObj = {};
		paramObj.id = gridId;                    // 그리드 ID
		paramObj.callbackFn = function(data) {   // 그리드 바인딩 후 후처리 함수
			if(data.result == '1') {
				$.fn.msgBox('정상적으로 로드하였습니다.');				
			}
		};
		
		$.fn.loadGridExcel(paramObj); 
	});
	
	// 조회조건 엔터키 조회
	$('#gubun, #finYm').on("keypress", function(e) {
		if(e.keyCode === 13) {
			$("#btn_search").click();
			return false;
		}
	});
}


function initGridDwr(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: 'gridDivDwr',
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
				if (item.status == 'c' || item.status == 'e' ) {	//신규, 엑셀업로드 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else {	//u,d 는 삭제 상태로 처리 -> updateItem에서 최종  삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#gridDivDwr").jsGrid("updateItem", item);
					return item;
				}
			}
		},
	   fields: [
		{ name: 'seq', title:'순번', css:'cell', type: 'text', width: 50, align:'center', editing: false},
		{ name: 'finYm', title:'마감년월', css:'cell', type: 'text', width: 100, align:'center', editTemplate:function(value, item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				// 신규 외엔 수정 불가
				if(item.status != 'c') {
					$result.attr('readonly', 'true');
				}
				
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDivDwr").jsGrid("updateItem");
						return false;
					}
				}).on("input",function(e){
					var val = $(this).val();
					$(this).val(val.replace(/[^\d]/g, ""));
				});
				
				return $result;
			}, 
			validate: [{validator:"required", message:"[마감년월] 필수 입력 항목입니다."}
						, {validator:"minLength", param:6, message:"[마감년월] 입력 자리수는 6자리입니다."}
						, {validator:"maxLength", param:6, message:"[마감년월] 입력 자리수는 6자리입니다."}
						, {validator:'pattern', message:'[마감년월] 날짜 형식이 맞지 않습니다.', validator:function(value) {return $.isValidYm(value);}}
						]
		},
		{ name: 'ibnrColtrScCd', title:'IBNR담보구분코드', css:'cell', type: 'select', width: 100, align:'center', editTemplate:function(value, item) {
			var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value, item);
				// 신규 외엔 수정 불가
				if(item.status != 'c' && item.status != 'e') {
					$result.attr('disabled', 'true');
				}
				
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDivDwr").jsGrid("updateItem");
						return false;
					}
				});
				
				return $result;
			}, 
			items: $.fn.getGridCodeItem('IBNR_COLTR_SC_CD'),
			textField: 'codeNm',
			valueField: 'code',
			validate: [{validator:"required", message:"[IBNR담보구분코드] 필수 입력 항목입니다."}]
		},
		{ name: 'i17ExnexDvdScCd', title:'IFRS17유무배당코드', css:'cell', type: 'select', width: 110, align:'center', editTemplate:function(value, item) {
			var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value, item);
				// 신규 외엔 수정 불가
				if(item.status != 'c' && item.status != 'e') {
					$result.attr('disabled', 'true');
				}
				
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDivDwr").jsGrid("updateItem");
						return false;
					}
				});
				
				return $result;
			}, 
			items: $.fn.getGridCodeItem('I17_EXNEX_DVD_SC_CD'),
			textField: 'codeNm',
			valueField: 'code',
			validate: [{validator:"required", message:"[IFRS17유무배당코드] 필수 입력 항목입니다."}]
		},
		{ name: 'acdtYm', title:'사고년월', css:'cell', type: 'text', width: 90, align:'center', editTemplate:function(value, item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			// 신규 외엔 수정 불가
			if(item.status != 'c' && item.status != 'e') {
				$result.attr('readonly', 'true');
			}
			
			$result.on("keydown", function(e){
				if(e.which === 13){
					$("#gridDivDwr").jsGrid("updateItem");
					return false;
				}
			}).on("input",function(e){
				var val = $(this).val();
				$(this).val(val.replace(/[^\d]/g, ""));
			});
			
			return $result;
		}, 
			validate: [{validator:"required", message:"[사고년월] 필수 입력 항목입니다."}
						, {validator:"minLength", param:6, message:"[사고년월] 입력 자리수는 6자리입니다."}
						, {validator:"maxLength", param:6, message:"[사고년월] 입력 자리수는 6자리입니다."}
						, {validator:'pattern', message:'[사고년월] 날짜 형식이 맞지 않습니다.', validator:function(value) {return $.isValidYm(value);}}
						]
		},
		{ name: 'dvlmtYm', title:'진전년월', css:'cell', type: 'text', width: 90, align:'center', editTemplate:function(value, item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			// 신규 외엔 수정 불가
			if(item.status != 'c' && item.status != 'e') {
				$result.attr('readonly', 'true');
			}
			
			$result.on("keydown", function(e){
				if(e.which === 13){
					$("#gridDivDwr").jsGrid("updateItem");
					return false;
				}
			}).on("input",function(e){
				var val = $(this).val();
				$(this).val(val.replace(/[^\d]/g, ""));
			});
			
			return $result;
		}, 
			validate: [{validator:"required", message:"[진전년월] 필수 입력 항목입니다."}
						, {validator:"minLength", param:6, message:"[진전년월] 입력 자리수는 6자리입니다."}
						, {validator:"maxLength", param:6, message:"[진전년월] 입력 자리수는 6자리입니다."}
						, {validator:'pattern', message:'[진전년월] 날짜 형식이 맞지 않습니다.', validator:function(value) {return $.isValidYm(value);}}
						]
		},
		{ name: 'basCfStndExptPymInsm', title:'기본CF기준예상지급보험금', css:'cell', type: 'number', width: 160, align:'right',
			editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				$result.on("input",function(e){
					var val = $(this).val();
					$(this).val(val.replace(/[^\d]/g, ""));
				});
				
				return $result;
			},
			itemTemplate : function(value,item){
				return $.addCommaNumber(value + "");
			}	
		},
		{ name: 'shkCfStndExptPymInsm', title:'충격CF기준예상지급보험금', css:'cell', type: 'number', width: 160, align:'right', 
			editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				$result.on("input",function(e){
					var val = $(this).val();
					$(this).val(val.replace(/[^\d]/g, ""));
				});
				
				return $result;
			},
			itemTemplate : function(value,item){
				return $.addCommaNumber(value + "");
			}		
		},
		{ name: 'ibnrRaRto', title:'IBNRRA비율', css:'cell', type: 'text', width: 100, align:'right', editTemplate:function(value, item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			
			$result.on("input",function(e){
				var val = $(this).val();
				if(val.indexOf(".") > -1) {
					var arr = val.split(".");
					$(this).val(arr[0].replace(/[^\d]/g, "") + "." + arr[1].replace(/[^\d]/g, ""));
				} else {
					$(this).val(val.replace(/[^\d]/g, ""));
				}
			});
			
			return $result;
		}},
		{ name: 'regntEno', title:'등록자사번', css:'cell', type: 'text',  width: 100, align:'center', editing: false},
		{ name: 'regDtm', title:'등록일자', css:'cell', type: 'text',  width: 100, align:'center', editing: false, itemTemplate:function(value, item) {
			return $.fn.dateFormat(value, "-");			
		}},
		{ name: 'trtrEno', title:'처리자사번', css:'cell', type: 'text',  width: 100, align:'center', editing: false},
		{ name: 'trtDtm', title:'처리일자', css:'cell', type: 'text',  width: 100, align:'center', editing: false, itemTemplate:function(value, item) {
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



function initGridRins(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: 'gridDivRins',
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
				if(item.status == 'c' || item.status == 'e' ) {	//신규,엑셀업로드는 c,e상태 유지 후 데이터 수정
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
					$("#gridDivRins").jsGrid("updateItem", item);
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
					
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivDwr").jsGrid("updateItem");
							return false;
						}
					}).on("input",function(e){
						var val = $(this).val();
						$(this).val(val.replace(/[^\d]/g, ""));
					});
					
					return $result;
				}, 
				validate: [{validator:"required", message:"[마감년월] 필수 입력 항목입니다."}
							, {validator:"minLength", param:6, message:"[마감년월] 입력 자리수는 6자리입니다."}
							, {validator:"maxLength", param:6, message:"[마감년월] 입력 자리수는 6자리입니다."}
							, {validator:'pattern', message:'[마감년월] 날짜 형식이 맞지 않습니다.', validator:function(value) {return $.isValidYm(value);}}
							]
			},
			{ name: 'rinsCoCd', title:'재보험회사코드', css:'cell', type: 'select', width: 100, align:'center', editTemplate:function(value, item) {
				var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value, item);
					// 신규 외엔 수정 불가
					if(item.status != 'c' && item.status != 'e') {
						$result.attr('disabled', 'true');
					}
					
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivDwr").jsGrid("updateItem");
							return false;
						}
					});
					
					return $result;
				}, 
				items: $.fn.getGridCodeItem('RINS_CO_CD'),
				textField: 'codeNm',
				valueField: 'code',
				validate: [{validator:"required", message:"[재보험회사코드] 필수 입력 항목입니다."}]
			},
			{ name: 'ibnrColtrScCd', title:'IBNR담보구분코드', css:'cell', type: 'select', width: 110, align:'center', editTemplate:function(value, item) {
				var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value, item);
					// 신규 외엔 수정 불가
					if(item.status != 'c' && item.status != 'e') {
						$result.attr('disabled', 'true');
					}
					
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivDwr").jsGrid("updateItem");
							return false;
						}
					});
					
					return $result;
				}, 
				items: $.fn.getGridCodeItem('IBNR_COLTR_SC_CD'),
				textField: 'codeNm',
				valueField: 'code',
				validate: [{validator:"required", message:"[IBNR담보구분코드] 필수 입력 항목입니다."}]
			},
			{ name: 'acdtYm', title:'사고년월', css:'cell', type: 'text', width: 90, align:'center', editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				// 신규 외엔 수정 불가
				if(item.status != 'c' && item.status != 'e') {
					$result.attr('readonly', 'true');
				}
				
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDivDwr").jsGrid("updateItem");
						return false;
					}
				}).on("input",function(e){
					var val = $(this).val();
					$(this).val(val.replace(/[^\d]/g, ""));
				});
				
				return $result;
			}, 
				validate: [{validator:"required", message:"[사고년월] 필수 입력 항목입니다."}
							, {validator:"minLength", param:6, message:"[사고년월] 입력 자리수는 6자리입니다."}
							, {validator:"maxLength", param:6, message:"[사고년월] 입력 자리수는 6자리입니다."}
							, {validator:'pattern', message:'[사고년월] 날짜 형식이 맞지 않습니다.', validator:function(value) {return $.isValidYm(value);}}
							]
			},
			{ name: 'dvlmtYm', title:'진전년월', css:'cell', type: 'text', width: 90, align:'center', editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				// 신규 외엔 수정 불가
				if(item.status != 'c' && item.status != 'e') {
					$result.attr('readonly', 'true');
				}
				
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDivDwr").jsGrid("updateItem");
						return false;
					}
				}).on("input",function(e){
					var val = $(this).val();
					$(this).val(val.replace(/[^\d]/g, ""));
				});
				
				return $result;
			}, 
				validate: [{validator:"required", message:"[진전년월] 필수 입력 항목입니다."}
							, {validator:"minLength", param:6, message:"[진전년월] 입력 자리수는 6자리입니다."}
							, {validator:"maxLength", param:6, message:"[진전년월] 입력 자리수는 6자리입니다."}
							, {validator:'pattern', message:'[진전년월] 날짜 형식이 맞지 않습니다.', validator:function(value) {return $.isValidYm(value);}}
							]
			},
			{ name: 'cfExptCedePymInsm', title:'CF예상출재지급보험금', css:'cell', type: 'number', width: 150, align:'right', 
				editTemplate:function(value, item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					
					$result.on("input",function(e){
						var val = $(this).val();
						$(this).val(val.replace(/[^\d]/g, ""));
					});
					
					return $result;
				},
				itemTemplate : function(value,item){
					return $.addCommaNumber(value + "");
				}
			},
			{ name: 'shkCfExptCedePymInsm', title:'충격CF예상출재지급보험금', css:'cell', type: 'number', width: 150, align:'right', 
				editTemplate:function(value, item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					
					$result.on("input",function(e){
						var val = $(this).val();
						$(this).val(val.replace(/[^\d]/g, ""));
					});
					
					return $result;
				},
				itemTemplate : function(value,item){
					return $.addCommaNumber(value + "");
				}
			},
			{ name: 'nflfmCfExptCedePymInsm', title:'불이행CF예상출재지급보험금', css:'cell', type: 'number', width: 150, align:'right', 
				editTemplate:function(value, item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					
					$result.on("input",function(e){
						var val = $(this).val();
						$(this).val(val.replace(/[^\d]/g, ""));
					});
					
					return $result;
				},
				itemTemplate : function(value,item){
					return $.addCommaNumber(value + "");
				}
			},
			{ name: 'ibnrRaRto', title:'IBNRRA비율', css:'cell', type: 'text', width: 150, align:'right', editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				$result.on("input",function(e){
					var val = $(this).val();
					if(val.indexOf(".") > -1) {
						var arr = val.split(".");
						$(this).val(arr[0].replace(/[^\d]/g, "") + "." + arr[1].replace(/[^\d]/g, ""));
					} else {
						$(this).val(val.replace(/[^\d]/g, ""));
					}
				});
				
				return $result;
			}},
			{ name: 'regntEno', title:'등록자사번', css:'cell', type: 'text',  width: 100, align:'center', editing: false},
			{ name: 'regDtm', title:'등록일자', css:'cell', type: 'text',  width: 100, align:'center', editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: 'trtrEno', title:'처리자사번', css:'cell', type: 'text',  width: 100, align:'center', editing: false},
			{ name: 'trtDtm', title:'처리일자', css:'cell', type: 'text',  width: 100, align:'center', editing: false, itemTemplate:function(value, item) {
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


// 조회
function selectIbnrFlfmCflList() {			
	var gubun = $('#gubun option:selected').val();              // 구분
	var finYm = $.replaceAll($('#finYm').val().trim(),'-','');  // 마감년월
	
	if ($.fn.isEmpty(finYm)) {
		$.fn.msgBox('마감년월을 입력하시기 바랍니다.');
		return false;
	}
	
	var reqParam = {};
	reqParam.gubun = gubun
	reqParam.finYm = finYm;

	$.callAjax(reqParam, '/ca/pr/capr411m/selectIbnrFlfmCflList.do')
	.done(function(data) {	
		var listData = data.list;  	  	    //서버로 받아온 데이터 리스트
		
		//그리드 바인딩
		if (gubun == '1') {
			$('#gridDivDwr').jsGrid('reset');
			$('#gridDivDwr').jsGrid('loadData', listData).done(function(){
			});	
			
			// 2021.06.15 0건 그리드 메세지 처리
			if (listData.length == 0) {
				$.fn.getReturnValue('gridDivDwr');
			}
		} else {
			$('#gridDivRins').jsGrid('reset');
			$('#gridDivRins').jsGrid('loadData', listData).done(function(){
			});	
			
			// 2021.06.15 0건 그리드 메세지 처리
			if (listData.length == 0) {
				$.fn.getReturnValue('gridDivRins');
			}
		}
			
	}).fail(function(data){
		$.fn.msgBox('목록 조회가 실패했습니다.');
	});		
}


// 저장
function saveGridDataAll() {	
	var gubun = $('#gubun option:selected').val();  // 구분
	var gridData = {};
	var editRowClass = {};
	
	if (gubun == '1') {
		gridData = $('#gridDivDwr').jsGrid('option', 'data'); 
		editRowClass = $("#gridDivDwr").jsGrid("option", "editRowClass");
		if($("." + editRowClass).length > 0) {
			$("#gridDivDwr").jsGrid("updateItem");
		}
	} else {
		gridData = $('#gridDivRins').jsGrid('option', 'data');
		editRowClass = $("#gridDivRins").jsGrid("option", "editRowClass");
		if($("." + editRowClass).length > 0) {
			$("#gridDivRins").jsGrid("updateItem");
		}
	}
	
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
			if (gubun == '1') {
				$.callAjax({'list':JSON.stringify(saveList)}, '/ca/pr/capr411m/saveDwrIbnrFlfmCflList.do')
				.done(function(data) {
					if(data.result == '1') {
						$.fn.msgBox('정상적으로 처리되었습니다.');
						selectIbnrFlfmCflList();
					}
				}).fail(function(data){
					$.fn.msgBox('데이터 저장이 실패했습니다.');
				});
			} else {
				$.callAjax({'list':JSON.stringify(saveList)}, '/ca/pr/capr411m/saveRinsIbnrFlfmCflList.do')
				.done(function(data) {
					if(data.result == '1') {
						$.fn.msgBox('정상적으로 처리되었습니다.');
						selectIbnrFlfmCflList();
					}
				}).fail(function(data){
					$.fn.msgBox('데이터 저장이 실패했습니다.');
				});
			}			
		}
	}, 2);
}


// 행추가
function addGridData() {
	var gubun = $('#gubun option:selected').val();
	var dataList = {};
	var seq = 0;
	
	if (gubun == '1') {
		dataList = $("#gridDivDwr").jsGrid("option", "data");
		seq = dataList.length + 1;
		$('#gridDivDwr').jsGrid('insertItem', 
				{ 
                  'seq': seq,
				  'status': 'c',
				  'finYm': $.replaceAll($('#finYm').val().trim(),'-',''),
				  'ibnrColtrScCd': '',
				  'i17ExnexDvdScCd': '',
				  'acdtYm': '',
				  'dvlmtYm': '',
				  'basCfStndExptPymInsm': '',
				  'shkCfStndExptPymInsm': '',
				  'ibnrRaRto': '',
				  'regntEno':'',
				  'regDtm': '',
				  'trtrEno':'',
				  'trtDtm': ''
				}
		);
		
		var pageLastText = $("#gridDivDwr").jsGrid("option", "pageLastText");
		$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
		
	} else {
		dataList = $("#gridDivRins").jsGrid("option", "data");
		seq = dataList.length + 1;
		$('#gridDivRins').jsGrid('insertItem', 
				{ 
                  'seq': seq,
				  'status': 'c',
				  'finYm': $.replaceAll($('#finYm').val().trim(),'-',''),
				  'rinsCoCd': '',
				  'ibnrColtrScCd': '',
				  'acdtYm': '',
				  'dvlmtYm': '',
				  'ibnrRaRto': '',
				  'cfExptCedePymInsm':'',
				  'shkCfExptCedePymInsm': '',
				  'nflfmCfExptCedePymInsm': '',
				  'regntEno':'',
				  'regDtm': '',
				  'trtrEno':'',
				  'trtDtm': ''
				}
		);
		
		var pageLastText = $("#gridDivRins").jsGrid("option", "pageLastText");
		$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
	}
}

// 데이터 저장전 validation 체크
function isValid(rowIndex, item) {
	var rowIdx = rowIndex+1;
	var gubun = $('#gubun option:selected').val();  // 구분
	
	if (item.status == 'e') {
		if ($.fn.isEmpty(item.finYm)) {
			$.fn.msgBox(rowIdx + '행의 마감년월을 입력하시기 바랍니다.');
			return false;
		}
		
		if (item.finYm.trim().length != 6) {
			$.fn.msgBox(rowIdx + '행의 마감년월 입력 자리수를 확인해 주시기 바랍니다.');
			return false;
		}	
		
		if ($.fn.isEmpty(item.ibnrColtrScCd)) {
			$.fn.msgBox(rowIdx + '행의 IBNR담보구분코드를 입력하시기 바랍니다.');
			return false;
		}
		
		if ($.fn.isEmpty(item.acdtYm)) {
			$.fn.msgBox(rowIdx + '행의 사고년월을 입력하시기 바랍니다.');
			return false;
		}
		
		if ($.fn.isEmpty(item.dvlmtYm)) {
			$.fn.msgBox(rowIdx, + '행의 진전년월을 입력하시기 바랍니다.');
			return false;
		}	
		
		if (item.acdtYm.trim().length != 6) {
			$.fn.msgBox(rowIdx + '행의 사고년월 입력 자리수를 확인해 주시기 바랍니다.');
			return false;
		}	
		
		if (item.dvlmtYm.trim().length != 6) {
			$.fn.msgBox(rowIdx + '행의  진전년월 입력 자리수를 확인해 주시기 바랍니다.');
			return false;
		}	
		
		if (gubun == '1') {
			if ($.fn.isEmpty(item.i17ExnexDvdScCd)) {
				$.fn.msgBox(rowIdx + '행의 IFRS17유무배당코드를 입력하시기 바랍니다.');
				return false;
			}
		}
	
		if (gubun == '2') {
			if ($.fn.isEmpty(item.rinsCoCd)) {
				$.fn.msgBox(rowIdx + '행의 재보험회사코드를 입력하시기 바랍니다.');
				return false;
			}
		}
	}
	
	return true;
}
