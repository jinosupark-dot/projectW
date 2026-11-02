/**
 * @시스템명: IFRS17
 * @업무명: 연체부도 JS
 * @설명: 연체부도 JS
 * @최초작성자: 양슬기
 * @최초작성일: 2025.09.25
 * @최종변경일:
 * @개정이력:
 *  양슬기 2025.09.25 최초작성

 */
$(document).ready(function(){
	/* 2021.05.03 툴팁 추가 */
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/* 2021.06.14 화면ID 추가 */
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
    /* 2021.06.16 버튼권한처리 */
    // 엑셀업로드, 행추가, 저장
    var btnIdArr = ["btn_loadExcel", "btn_addGrid", "btn_save"];
	var permArr = [];
	for (var i = 0; i < btnIdArr.length; i++) {
		permArr.push({
			btnId : "#" + btnIdArr[i],
			type : "B"
		});
	}
    $.fn.setBtnPermission(permArr);
    
	var today = new Date();
	var year  = today.getFullYear();
	var month = ("0" + (today.getMonth() + 1)).slice(-2);
	var toYmd = year + "-" + month + "-" + ("0" + today.getDate()).slice(-2);
	$("#inp_basDt").val(toYmd);
	
	// event 초기화
	initEvent();
	
	// grid 초기화
	initGrid();
	
	// 포커스(마감년월 from)
	$("#inp_basDt").focus();
});

/**
 * @설명: event 초기화
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function initEvent() {
	// 조회
	$("#btn_search").on("click", function(e){
		selectDelayBankruptList();
	});
	
	// 마감년월 from 달력
	$("#btn_basDt").on("click", function(e){
		$("#inp_basDt").datepicker("show");
	});
	
	// 마감년월 Enter키 조회
	$("#inp_basDt").on("keydown", function(e){
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidDate(this.value)) {
				$(this).val($.fn.dateFormat(this.value, "-"));
				selectDelayBankruptList();
				return false;
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		
		}
	});
	
	// 마감년월 입력창 blur
	$("#inp_basDt").on("blur", function(e) {
		//빈값 체크
		if($.fn.isEmpty(this.value)) {
			return;
		}
	
		//날짜형식 체크
		if($.isValidDate(this.value)) {
			$(this).val($.fn.dateFormat(this.value, "-"));
			selectDelayBankruptList();
			return false;
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.");
			$(this).focus();
		}
	
	});
	
	// Enter키 조회
	$("#inp_asetid").on("keydown", function(e){
		if(e.which === 13){
			selectDelayBankruptList();
		}
	});

	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "연체부도.xlsx";

		var paramObj = {};
		paramObj.id = gridId;
		paramObj.fileName = fileName;         
		paramObj.applyItemTemplate = false;   
		$.fn.exportGridExcel(paramObj);
	});
	
	// 양식업로드 
	$("#btn_loadExcel").on("click", function(e){
		var paramObj = {};
		paramObj.id = "gridDivRins";
		paramObj.callbackFn = function(data) {
			if(data.result == "1") {
				$.fn.msgBox("정상적으로 로드하였습니다.");
			}
		};
		$.fn.loadGridExcel(paramObj);
	});
	
	// 행추가
	$("#btn_addGrid").on("click", function(e){
		addGridData();
	});
	
	// 저장
	$("#btn_save").on("click", function(e){
		saveGridDataAll();
	});
	
	
	
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function initGrid(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDivRins",
		height: 600,
		editing: true,
		sorting: true,
		paging: true,
		selectHiglight: false,
		deleteConfirm: "삭제하시겠습니까?",
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				//debugger;
				var status = "u";	//수정
				if(item.status == "c" || item.status == "e" ) {	//신규, 엑셀업로드는 c,e상태 유지 후 데이터 수정
				} else if(item.status == "dd"){	//삭제신청으로 요청되면 "삭제"로 최정 변경처리
					item.status = "d";
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { //grid 삭제 아이콘 클릭 또는 deleteItem API이용시 진입
				//deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = "dd";	//삭제 신청
				//debugger;
				if (item.status == "c" || item.status == "e" ) {	//신규, 엑셀업로드 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else {	//u,d 는 삭제 상태로 처리 -> updateItem에서 최종  삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#gridDivRins").jsGrid("updateItem", item);
					return item;
				}
			}
		},
		//그리드 컬럼 정의 !!!
	   fields: [
		  { name: "rowNum", title:"순번", css:"cell", type: "text", width: 40, editing: false, align:"center"},
		  { name: "stndYmd", title:"기준일자", css:"cell", type: "text", width: 120, align:"center", editTemplate:function(value, item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				// 신규, 엑셀업로드 외엔 수정 불가
				if(item.status != "c" && item.status != "e") {
					$result.attr("readonly", "true");
				}
				
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDivRins").jsGrid("updateItem");
						return false;
					}
				});
				return $result;
			}, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "");			
			}, validate: [
					{validator:"required", message:"[기준일자] 필수 입력 항목입니다."}
				  , {validator:"minLength", param:8, message:"[기준일자] 입력 자리수는 8자리입니다."}
				  , {validator:"maxLength", param:8, message:"[기준일자] 입력 자리수는 8자리입니다."}
				  , {validator:"pattern", message:"[기준일자] 날짜 형식이 맞지 않습니다.", validator:function(value) {return $.isValidDate(value);}}
			   ]
		  },
		  { name: "asetId", title:"자산ID", css:"cell", type: "text", width: 200, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				// 신규, 엑셀업로드 외엔 수정 불가
				if(item.status != "c" && item.status != "e") {
					$result.attr("readonly", "true");
				}
				
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[자산ID] 필수 입력 항목입니다."}
						, {validator:"maxLength", param:50, message:"[자산ID] 입력 자리수는 8자리입니다."}
			]
	      },
		  { name: "arrKnb", title:"연체식별번호", css:"cell", type: "text", width: 200, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				// 신규, 엑셀업로드 외엔 수정 불가
				if(item.status != "c" && item.status != "e") {
					$result.attr("readonly", "true");
				}
				
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[연체식별번호] 필수 입력 항목입니다."}]
	      },
		  { name: "dshnRegSno", title:"부도등록일련번호", css:"cell", type: "text", width: 200, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				// 신규, 엑셀업로드 외엔 수정 불가
				if(item.status != "c" && item.status != "e") {
					$result.attr("readonly", "true");
				}
				
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[부도등록일련번호] 필수 입력 항목입니다."}]
	      },
	      
		  { name: "cptyNm", title:"거래상대방명", css:"cell", type: "text",  width: 150, align:"left", editing: true},
		  { name: "corpRegNo", title:"법인등록번호", css:"cell", type: "text", width: 120, align:"center", editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivRins").jsGrid("updateItem");
							return false;
						}
					});
					return $result;
				}, validate: [ {validator:"maxLength", param:13, message:"[법인등록번호] 입력 자리수는 13자리입니다."}]
		  },			  
		  { name: "expYmd", title:"만기일자", css:"cell", type: "text", width: 120, align:"center", editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivRins").jsGrid("updateItem");
							return false;
						}
					});
					return $result;
				}, itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "");			
				}
//				, validate: [
//					    {validator:"minLength", param:8, message:"[만기일자] 입력 자리수는 8자리입니다."}
//					  , {validator:"maxLength", param:8, message:"[만기일자] 입력 자리수는 8자리입니다."}
//					  , {validator:"pattern", message:"[만기일자] 날짜 형식이 맞지 않습니다.", validator:function(value) {return $.isValidDate(value);}}
//				   ]
		  },		  
		  { name: "fstArrYmd", title:"최초연체일자", css:"cell", type: "text", width: 120, align:"center", editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivRins").jsGrid("updateItem");
							return false;
						}
					});
					return $result;
				}, itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "");			
				}
		  },		  
		  { name: "arrRcknYmd", title:"연체기산일자", css:"cell", type: "text", width: 120, align:"center", editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivRins").jsGrid("updateItem");
							return false;
						}
					});
					return $result;
				}, itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "");			
				}
		  },		  
		  { name: "arrObjScCd", title:"연체대상구분코드", css:"cell", type: "text", width: 120, align:"center", editTemplate:function(value, item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
						$result.on("keydown", function(e){
							if(e.which === 13){
								$("#gridDivRins").jsGrid("updateItem");
								return false;
							}
						});
						return $result;
					}, validate: [ {validator:"maxLength", param:2, message:"[연체대상구분코드] 입력 자리수는 2자리입니다."}]
		  },			  
		  { name: "arrAmt", title:"연체금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
				return $.addCommaNumber(value + "");			
				}, editTemplate:function(value, item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivRins").jsGrid("updateItem");
							return false;
						}
					});
				return $result;
				}
		  },
		  { name: "dshnRsnSno", title:"부도사유일련번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dshnOccuYmd", title:"부도발생일자", css:"cell", type: "text", width: 120, align:"center", editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivRins").jsGrid("updateItem");
							return false;
						}
					});
					return $result;
				}, itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "");			
				}
		  },		  
		  { name: "dshnRsnCd", title:"부도사유코드", css:"cell", type: "text", width: 120, align:"center", editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivRins").jsGrid("updateItem");
							return false;
						}
					});
					return $result;
				}, validate: [ {validator:"maxLength", param:3, message:"[부도사유코드] 입력 자리수는 3자리입니다."}]
		  },			  
		  { name: "dshnRscYmd", title:"부도해지일", css:"cell", type: "text", width: 120, align:"center", editTemplate:function(value, item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivRins").jsGrid("updateItem");
							return false;
						}
					});
					return $result;
				}, itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "");			
				}
		  },		  
		  { name: "regntEno", title:"등록자사번", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "regDtm", title:"등록일시", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "trtrEno", title:"처리자사번", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "trtDtm", title:"처리일시", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  
		  //편집공통	
		  { name: "status", title:"상태", css:"cell", type: "text", width: 50, align:"center", editing: false, itemTemplate:function(value, item) {
			  	return $.fn.getGridRowStatusName(value);			
		  		}
		  },
		  { name: "gridManupulate", title:"그리드조작", css:"cell", type: "control", width: 70, align:"left",editing: true}
		  

	   ] 
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}


/**
 * @설명: 신규생성, 수정, 삭제 처리한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function saveGridDataAll() {	
	var gridData = {};
	var editRowClass = {};
	
	editRowClass = $("#gridDivRins").jsGrid("option", "editRowClass");
	if ($("." + editRowClass).length > 0) {
		$("#gridDivRins").jsGrid("updateItem");
	}
	
	gridData = $("#gridDivRins").jsGrid("option", "data");
	//var coCdArr = $.fn.getGridCodeItem("RINS_CO_CD");
	//var trtyCdArr = $.fn.getGridCodeItem("RINS_TRTY_CD");
	
	var saveList = [];
	//c,u,d,e 건만 추출 후 저장 처리
	for (var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
//		if (item.status == "e") {
////			if(! isValid(i,item,coCdArr,trtyCdArr)) { 
////				return; 
////			}
//			saveList.push(item);
//		} 
//		else if (item.status == "c" || item.status == "u" || item.status == "d") {
//			saveList.push(item);
//		}
		
		//전체 딜리트 인서트 처리 
		saveList.push(item);
		
	}
	
	if (saveList.length <= 0) {
		$.fn.msgBox("저장할 데이터가 없습니다.");
		return;
	}
	
	var stndYmd = $("#inp_basDt").val();
	stndYmd = stndYmd.replace('-','');
	stndYmd = stndYmd.replace('-','');
	
console.log(" saveGridDataAll " + JSON.stringify(saveList) +"_"+stndYmd  );	
	
	$.fn.msgBox("데이터를 저장하시겠습니까?", function(obj) {
		if (obj.btn_ok) {
			$.callAjax({"list" : JSON.stringify(saveList), "stndYmd": stndYmd }, "/rm/mn/rmmn111m/saveDelayBankruptList.do")
			.done(function(data) {
				if (data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					// 재조회
					selectDelayBankruptList();
				}
			}).fail(function(data) {
				$.fn.msgBox("데이터 저장이 실패했습니다.");
			});
		}
	}, 2);
}

/**
 * @설명: 그리드 하나의 행을 추가한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function addGridData() {
	var dataList = $("#gridDivRins").jsGrid("option", "data");
	var rowNum = dataList.length + 1;
	
	$("#gridDivRins").jsGrid("insertItem", {
		"rowNum" : rowNum,
		"status" : "c"
		,"stndYmd":""//기준일자
		,"asetId":""//자산ID
		,"arrKnb":""//연체식별번호
		,"dshnRegSno":""//부도등록일련번호
		,"cptyNm":""//거래상대방명
		,"corpRegNo":""//법인등록번호
		,"expYmd":""//만기일자
		,"fstArrYmd":""//최초연체일자
		,"arrRcknYmd":""//연체기산일자
		,"arrObjScCd":""//연체대상구분코드
		,"arrAmt":""//연체금액
		,"dshnRsnSno":""//부도사유일련번호
		,"dshnOccuYmd":""//부도발생일자
		,"dshnRsnCd":""//부도사유코드
		,"dshnRscYmd":""//부도해지일
		,"regntEno":""//등록자사번
		,"regDtm":""//등록일시
		,"trtrEno":""//처리자사번
		,"trtDtm":""//처리일시

	});
	
	//마지막 페이지 이동
	var pageLastText = $("#gridDivRins").jsGrid("option", "pageLastText");
	$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
}

/**
 * @설명: 엑셀업로드 후 데이터 저장 전 validation 체크
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.10
 * @최종변경일: 
 * @매개변수: rowIndex, item, coCdArr, trtyCdArr
 * @반환값: boolean
 * @개정이력: 
 *  양슬기 2021.02.10 최초작성
 */
function isValid(rowIndex, item, coCdArr, trtyCdArr) {
	var rowIndex = rowIndex + 1;
	var isValidCoCd = false;
	var isValidTrty = false;

	if ($.fn.isEmpty(item.stndYmd)) {
		$.fn.msgBox(rowIndex + "행의 기준일자를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.asetId)) {
		$.fn.msgBox(rowIndex + "행의 자산ID를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.arrKnb)) {
		$.fn.msgBox(rowIndex + "행의 연체식별번호를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.dshnRegSno)) {
		$.fn.msgBox(rowIndex + "행의 부도등록일련번호를 입력하시기 바랍니다.");
		return false;
	}
	
	
	//기준일자 길이 체크
	var value = item.stndYmd;
	if( value.length < 8 ){
		$.fn.msgBox(rowIndex + "행의 기준일자의 길이가 8자보다 적습니다.");
		return false;
	}
	//기준일자 형식 체크 
	if((/^\d{4}-?(0?[1-9]|1[0-2])-?(0?[0-9]|[1-2][0-9]|3[01])$/).test(value)){
		$.fn.msgBox(rowIndex + "행의 기준일자가 형식이 맞지 않습니다.");
		return false;
	}

	//만기일자 길이 체크
	value = item.expYmd;
	if( value.length < 8 ){
		$.fn.msgBox(rowIndex + "행의 만기일자의 길이가 8자보다 적습니다.");
		return false;
	}
	//기준일자 형식 체크 
	if((/^\d{4}-?(0?[1-9]|1[0-2])-?(0?[0-9]|[1-2][0-9]|3[01])$/).test(value)){
		$.fn.msgBox(rowIndex + "행의 만기일자가 형식이 맞지 않습니다.");
		return false;
	}

	//최초연체일자 길이 체크
	value = item.fstArrYmd;
	if( value.length < 8 ){
		$.fn.msgBox(rowIndex + "행의 최초연체일자의 길이가 8자보다 적습니다.");
		return false;
	}
	//최초연체일자 형식 체크 
	if((/^\d{4}-?(0?[1-9]|1[0-2])-?(0?[0-9]|[1-2][0-9]|3[01])$/).test(value)){
		$.fn.msgBox(rowIndex + "행의 최초연체일자가 형식이 맞지 않습니다.");
		return false;
	}
	
	//연체기산일자 길이 체크
	value = item.arrRcknYmd;
	if( value.length < 8 ){
		$.fn.msgBox(rowIndex + "행의 연체기산일자의 길이가 8자보다 적습니다.");
		return false;
	}
	//연체기산일자 형식 체크 
	if((/^\d{4}-?(0?[1-9]|1[0-2])-?(0?[0-9]|[1-2][0-9]|3[01])$/).test(value)){
		$.fn.msgBox(rowIndex + "행의 연체기산일자가 형식이 맞지 않습니다.");
		return false;
	}

	//부도발생일자 길이 체크
	value = item.dshnOccuYmd;
	if( value.length < 8 ){
		$.fn.msgBox(rowIndex + "행의 부도발생일자의 길이가 8자보다 적습니다.");
		return false;
	}
	//부도발생일자 형식 체크 
	if((/^\d{4}-?(0?[1-9]|1[0-2])-?(0?[0-9]|[1-2][0-9]|3[01])$/).test(value)){
		$.fn.msgBox(rowIndex + "행의 부도발생일자가 형식이 맞지 않습니다.");
		return false;
	}

	value = item.dshnRscYmd;
	if( value.length < 8 ){
		$.fn.msgBox(rowIndex + "행의 부도해지일자의 길이가 8자보다 적습니다.");
		return false;
	}
	//부도해지일자 형식 체크 
	if((/^\d{4}-?(0?[1-9]|1[0-2])-?(0?[0-9]|[1-2][0-9]|3[01])$/).test(value)){
		$.fn.msgBox(rowIndex + "행의 부도해지일자가 형식이 맞지 않습니다.");
		return false;
	}
	
	
	return true;
}

/**
 * @설명: 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function selectDelayBankruptList(){
	var inpBasDt = $("#inp_basDt").val();
	inpBasDt = inpBasDt.replace("-","");
	inpBasDt = inpBasDt.replace("-","");
	
	var inpAsetId = $("#inp_asetid").val();
	
	if ($.fn.isNull(inpBasDt) ) {
		$.fn.msgBox("기준일자를 모두 입력하시기 바랍니다.");
		return false;
	}
	
	//전송 파라미터 세팅 
	var req = {
			"asetId" : inpAsetId,
			"stndYmd" : inpBasDt
	};
	
	//서비스url 
	$.callAjax(req, "/rm/mn/rmmn111m/selectDelayBankruptList.do")
		.done(function(data) {
			// 그리드 데이터 초기화
			$("#gridDivRins").jsGrid("reset");

			// 그리드 바인딩
			var listData = data.list;
			$("#gridDivRins").jsGrid("loadData", listData).done(function() {
			});
			
			/* 2021.06.15 0건 그리드 메세지 처리 */
			if(listData.length == 0) {
				$.fn.getReturnValue("gridDivRins");
			}
			
		}).fail(function(data){
			console.log("fail to selectDelayBankruptList");
	});		
}

