/**
 * @시스템명: IFRS17
 * @업무명: 재보험미수미지급업로드 JS
 * @설명: 재보험미수미지급업로드 JS
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일:
 * @개정이력:
 *  심민정 2021.02.09 최초작성
 *  심민정 2021.05.06 2차 표준화
 *  심민정 2021.06.18 3차 표준화
 *  황석현 2021.09.24 선급비용금액 추가
 *  황석현 2021.12.09 재보험특약코드 그리드 RENDER 변경(selectRinsTrtyCdList)
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
    
	// 마감년월
	$("#inp_finYm_from").val(setFinYm());
	$("#inp_finYm_to").val(setFinYm());
	
	// 공통코드 조회
	selectCommonCode();

	// event 초기화
	initEvent();
	
	// grid 초기화
	initGrid();
	
	// 포커스(마감년월 from)
	$("#inp_finYm_from").focus();
});

/**
 * @설명: 공통코드 조회
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.02.09 최초작성
 */
function selectCommonCode() {
	// 공통코드 조회(재보험회사코드, 재보험특약코드)
	$.fn.loadCommonCode(["RINS_CO_CD"]);
	
	// 콤보박스 세팅
	var paramObj = {};
	paramObj.codeArr = ["RINS_CO_CD"];	
	paramObj.selArr = ["sbx_rinsCoCd"];
	paramObj.displayMode = "value delim label";			
	paramObj.displayDelimiter = " : ";					
	paramObj.firstOptionText = ["-전체-"];
	
	$.fn.renderCombobox(paramObj);
	
	$._commonObj.code["RINS_TRTY_CD"] = selectRinsTrtyCdList();
}

/**
 * @설명: event 초기화
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @개정이력: 
 *  심민정 2021.02.09 최초작성
 */
function initEvent() {
	// 조회
	$("#btn_search").on("click", function(e){
		selectRinsNtrcvUnpymList();
	});
	
	// 마감년월 from 달력
	$("#btn_finYm_from").on("click", function(e){
		$("#inp_finYm_from").datepicker("show");
	});
	
	// 마감년월 to 달력
	$("#btn_finYm_to").on("click", function(e){
		$("#inp_finYm_to").datepicker("show");
	});
	
	// 마감년월 Enter키 조회
	$("#inp_finYm_from, #inp_finYm_to").on("keydown", function(e){
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidYm(this.value)) {
				$(this).val($.fn.monthFormat(this.value, "-"));
				selectRinsNtrcvUnpymList();
				return false;
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		}
	});
	
	// 재보험회사코드 Enter키 조회
	$("#sbx_rinsCoCd").on("keypress", function(e){
		if(e.which === 13){
			selectRinsNtrcvUnpymList();
			return false;
		}
	});
	
	// 마감년월 입력창 blur
	$("#inp_finYm_from, #inp_finYm_to").on("blur", function(e) {
		//빈값 체크
		if($.fn.isEmpty(this.value)) {
			return;
		}
		//날짜형식 체크
		if($.isValidYm(this.value)) {
			$(this).val($.fn.monthFormat(this.value, "-"));
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.");
			$(this).focus();
		}
	});
	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "재보험_미수미지급.xlsx";

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
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.02.09 최초작성
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
	   fields: [
		  { name: "rowNum", title:"순번", css:"cell", type: "text", width: 40, editing: false, align:"center"},
		  { name: "finYm", title:"마감년월", css:"cell", type: "text", width: 90, align:"center", editTemplate:function(value, item) {
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
				return $.fn.monthFormat(value, "-");			
			}, validate: [
					{validator:"required", message:"[마감년월] 필수 입력 항목입니다."}
				  , {validator:"minLength", param:6, message:"[마감년월] 입력 자리수는 6자리입니다."}
				  , {validator:"maxLength", param:6, message:"[마감년월] 입력 자리수는 6자리입니다."}
				  , {validator:"pattern", message:"[마감년월] 날짜 형식이 맞지 않습니다.", validator:function(value) {return $.isValidYm(value);}}
			   ]
		  },
		  { name: "rinsCoCd", title:"재보험회사", css:"cell", type: "select", width: 110, align:"left", editTemplate:function(value, item) {
			var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value, item);
				if(item.status != "c" && item.status != "e"){
					$result.attr("disabled","true");
				}
			
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDivRins").jsGrid("updateItem");
						return false;
					}
				});
				return $result;
			}, items:  $.fn.getGridCodeItem("RINS_CO_CD", true, "value delim label")
			 , textField: "codeNm"
			 , valueField: "code"
			 , validate: [{validator:"required", message:"[재보험회사] 필수 입력 항목입니다."}]
		  },
		  { name: "rinsTrtyCd", title:"재보험특약", css:"cell", type: "select", width: 160, align:"left", editTemplate:function(value, item) {
			var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value, item);
				if(item.status != "c" && item.status != "e"){
					$result.attr("disabled","true");
				}
			
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDivRins").jsGrid("updateItem");
						return false;
					}
				});
				return $result;
			}, items : $.fn.getGridCodeItem("RINS_TRTY_CD", true, "value delim label")
			 , textField: "codeNm"
			 , valueField: "code"
			 , validate: [{validator:"required", message:"[재보험특약] 필수 입력 항목입니다."}]
		  }, 
		  { name: "rinsRcamt", title:"재보험미수금", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "rinsUnpymAmt", title:"재보험미지급금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "adpymCstAmt", title:"선급비용금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "regntEno", title:"등록자사번", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		  { name: "regDtm", title:"등록일자", css:"cell", type: "text",  width: 100, align:"center", editing: false, itemTemplate:function(value, item) {
			  	return $.fn.dateFormat(value, "-");			
		   		}
		  },
		  { name: "trtrEno", title:"처리자사번", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		  { name: "trtDtm", title:"처리일자", css:"cell", type: "text",  width: 100, align:"center", editing: false, itemTemplate:function(value, item) {
			  	return $.fn.dateFormat(value, "-");			
		  		}
		  },
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
 * @설명: 재보험특약코드 목록 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.12.09
 * @최종변경일: 
 * @매개변수:	
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.12.09 최초작성
 */
function selectRinsTrtyCdList() {
	var reqParam = {};
	reqParam.codeId = "RINS_TRTY_CD";
	var codeItemList = [];
	
	$.callAjax(reqParam, "/fi/jr/fijr411m/selectRinsTrtyCdList.do",{async:false})
	.done(function(data) {

		var codeList = data.list;
		
		if(codeList.length > 0) {
			for(var i=0; i<codeList.length; i++) {
				var tmpCode = codeList[i];
				var newCode = {
						"code": tmpCode.code,
						"codeNm":tmpCode.codeNm
				}
				codeItemList.push(newCode);
			}
		}
		
	}).fail(function(data) {
		console.log("fail to selectRinsTrtyCdList!!!!");
	});
	
	return codeItemList;
}

/**
 * @설명: 신규생성, 수정, 삭제 처리한다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  심민정 2021.02.09 최초작성
 */
function saveGridDataAll() {	
	var gridData = {};
	var editRowClass = {};
	
	editRowClass = $("#gridDivRins").jsGrid("option", "editRowClass");
	if ($("." + editRowClass).length > 0) {
		$("#gridDivRins").jsGrid("updateItem");
	}
	
	gridData = $("#gridDivRins").jsGrid("option", "data");
	var coCdArr = $.fn.getGridCodeItem("RINS_CO_CD");
	var trtyCdArr = $.fn.getGridCodeItem("RINS_TRTY_CD");
	
	var saveList = [];
	//c,u,d,e 건만 추출 후 저장 처리
	for (var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		if (item.status == "e") {
			if(! isValid(i,item,coCdArr,trtyCdArr)) { 
				return; 
			}
			saveList.push(item);
		} 
		else if (item.status == "c" || item.status == "u" || item.status == "d") {
			saveList.push(item);
		}
	}
	
	if (saveList.length <= 0) {
		$.fn.msgBox("저장할 데이터가 없습니다.");
		return;
	}
	
	$.fn.msgBox("데이터를 저장하시겠습니까?", function(obj) {
		if (obj.btn_ok) {
			$.callAjax({"list" : JSON.stringify(saveList)}, "/fi/jr/fijr411m/saveRinsNtrcvUnpymList.do")
			.done(function(data) {
				if (data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					// 재조회
					selectRinsNtrcvUnpymList();
				}
			}).fail(function(data) {
				$.fn.msgBox("데이터 저장이 실패했습니다.");
			});
		}
	}, 2);
}

/**
 * @설명: 그리드 하나의 행을 추가한다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @개정이력: 
 *  심민정 2021.02.09 최초작성
 */
function addGridData() {
	var dataList = $("#gridDivRins").jsGrid("option", "data");
	var rowNum = dataList.length + 1;
	
	$("#gridDivRins").jsGrid("insertItem", {
		"rowNum" : rowNum,
		"status" : "c",
		"finYm" : "",				/*마감년월*/
		"rinsCoCd" : "", 			/*재보험회사*/
		"rinsTrtyCd" : "",			/*재보험특약*/
		"rinsRcamt" : "",			/*재보험미수금*/
		"rinsUnpymAmt" : "",		/*재보험미지급금액*/
		"adpymCstAmt" : "",			/*선급비용금액*/
		"regntEno" : "",			/*등록자사번*/
		"regDtm" : "",				/*등록일시*/
		"trtrEno" : "",				/*처리자사번*/
		"trtDtm" : ""				/*처리일시*/
	});
	
	//마지막 페이지 이동
	var pageLastText = $("#gridDivRins").jsGrid("option", "pageLastText");
	$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
}

/**
 * @설명: 엑셀업로드 후 데이터 저장 전 validation 체크
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.10
 * @최종변경일: 
 * @매개변수: rowIndex, item, coCdArr, trtyCdArr
 * @반환값: boolean
 * @개정이력: 
 *  심민정 2021.02.10 최초작성
 */
function isValid(rowIndex, item, coCdArr, trtyCdArr) {
	var rowIndex = rowIndex + 1;
	var isValidCoCd = false;
	var isValidTrty = false;

	if ($.fn.isEmpty(item.finYm)) {
		$.fn.msgBox(rowIndex + "행의 마감년월을 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.rinsCoCd)) {
		$.fn.msgBox(rowIndex + "행의 재보험회사를 입력하시기 바랍니다.");
		return false;
	} else {
		for (var i = 0; i < coCdArr.length; i++) {
			if (coCdArr[i].code == item.rinsCoCd) {
				isValidCoCd = true;
				break;
			} else {
				isValidCoCd = false;
			}
		}
		if (!isValidCoCd) {
			$.fn.msgBox(rowIndex + "행의 재보험회사를 입력하시기 바랍니다.");
			return false;
		}
	}
	if ($.fn.isEmpty(item.rinsTrtyCd)) {
		$.fn.msgBox(rowIndex + "행의 재보험특약을 입력하시기 바랍니다.");
		return false;
	} else {
		for (var i = 0; i < trtyCdArr.length; i++) {
			if (trtyCdArr[i].code == item.rinsTrtyCd) {
				isValidTrty = true;
				break;
			} else {
				isValidTrty = false;
			}
		}
		if (!isValidTrty) {
			$.fn.msgBox(rowIndex + "행의 재보험특약을 입력하시기 바랍니다.");
			return false;
		}
	}

	return true;
}

/**
 * @설명: 재보험미수미지급업로드 목록을 조회한다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.02.09 최초작성
 */
function selectRinsNtrcvUnpymList(){
	var finYmFrom = $.replaceAll($("#inp_finYm_from").val().trim(), "-","");
	var finYmTo = $.replaceAll($("#inp_finYm_to").val().trim(), "-","");
	var rinsCoCd = getRinsCoCdValue();

	var calFinYmFrom = new Date(finYmFrom);
	var calFinYmTo = new Date(finYmTo);
	
	if ($.fn.isNull(finYmFrom) || $.fn.isNull(finYmTo)) {
		$.fn.msgBox("마감년월을 모두 입력하시기 바랍니다.");
		return false;
	}
	
	if(calFinYmFrom > calFinYmTo){
		$.fn.msgBox("마감년월 조회구간을 확인하세요.");
		return false;
	}

	var req = {
			"finYmFrom" : finYmFrom,
			"finYmTo" : finYmTo,
			"rinsCoCd" : rinsCoCd
	};
	
	$.callAjax(req, "/fi/jr/fijr411m/selectRinsNtrcvUnpymList.do")
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
			console.log("fail to selectRinsNtrcvUnpymList");
	});		
}

/**
 * @설명: 재보험회사코드의 콤보박스 선택값을 가져온다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.02.09 최초작성
 */
function getRinsCoCdValue(){
	var rinsCoCd = $("#sbx_rinsCoCd option:selected").val();
	return rinsCoCd;
}

/**
 * @설명: 마감년월 셋팅
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.02.09 최초작성
 */
function setFinYm(){
	// 마감년월 셋팅
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();
	
	var calcDate = new Date(year, month, "1");
	calcDate.setMonth(month - 1);
	
	year = calcDate.getFullYear();
	month = "" + (calcDate.getMonth()+1);
	
	if (month.length < 2) month = "0" + month;
	
	var finYm = $.fn.monthFormat((year+month),"-");
	
	return finYm;
}