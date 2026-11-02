/**
 * @시스템명: IFRS17
 * @업무명: 자회사익스포저정보원장 JS
 * @설명: 자회사익스포저정보원장 JS
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
		selectCompRetailExpList();
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
				//$(this).val($.fn.monthFormat(this.value, "-"));
				$(this).val($.fn.dateFormat(this.value, "-"));
				selectCompRetailExpList();
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
			//$(this).val($.fn.monthFormat(this.value, "-"));
			$(this).val($.fn.dateFormat(this.value, "-"));
			selectCompRetailExpList();
			return false;
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.");
			$(this).focus();
		}
	
	});
	
	// 자회사익스포져ID Enter키 조회
	$("#inp_subcoXpsId").on("keydown", function(e){
		if(e.which === 13){
			selectCompRetailExpList();
		}
	});

	
	
	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "자회사익스포저정보원장.xlsx";

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
		  { name: "wfgCd", title:"그룹내기관코드", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				// 신규, 엑셀업로드 외엔 수정 불가
				if(item.status != "c" && item.status != "e") {
					$result.attr("readonly", "true");
				}
				
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[그룹내기관코드] 필수 입력 항목입니다."},{validator:"maxLength", param:2, message:"[그룹내기관코드] 입력 자리수는 2자리입니다."}]
		  },
		  { name: "basDt", title:"기준일자", css:"cell", type: "text", width: 120, align:"center", editTemplate:function(value, item) {
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
					return $.fn.dateFormat(value, "-");			
				}, validate: [
						{validator:"required", message:"[기준일자] 필수 입력 항목입니다."}
					  , {validator:"minLength", param:10, message:"[기준일자] 입력 자리수는 10자리입니다."}
					  , {validator:"maxLength", param:10, message:"[기준일자] 입력 자리수는 10자리입니다."}
					  /*, {validator:"pattern", message:"[기준일자] 날짜 형식이 맞지 않습니다.", validator:function(value) {return $.isValidDate(value);}}*/
				   ]
		  },
		  { name: "lnkComCd", title:"연결회사코드", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				// 신규, 엑셀업로드 외엔 수정 불가
				if(item.status != "c" && item.status != "e") {
					$result.attr("readonly", "true");
				}
				
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[연결회사코드] 필수 입력 항목입니다."}]
		  },
		  { name: "subcoXpsId", title:"자회사익스포져ID", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				// 신규, 엑셀업로드 외엔 수정 불가
				if(item.status != "c" && item.status != "e") {
					$result.attr("readonly", "true");
				}
				
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[자회사익스포져ID] 필수 입력 항목입니다."}]
		  },
		  { name: "lmtAgrId", title:"한도약정ID", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "subcoCtpId", title:"자회사거래상대방ID", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "grpStdAccCd8", title:"그룹표준계정과목코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "fnprCatgCd", title:"금융상품범주코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "sbcmAddWdrYnCd", title:"자회사추가인출여부코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "opnDt", title:"신규일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "xprDt", title:"만기일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "lnRpyMtdCd", title:"여신상환방법코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "prnrpSdt", title:"원금상환시작일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "curCd", title:"통화코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dlCurCd", title:"취급통화코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "genAlwAm", title:"일반충당금", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
 		  { name: "krwXcGenAlwAm", title:"원화환산일반충당금", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "spcAlwAm", title:"특정충당금", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "krwXcSpcAlwAm", title:"원화환산특정충당금", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "lmtAm", title:"한도금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "krwXcLmtAm", title:"원화환산한도금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "bsBl", title:"잔액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "krwXcBsBl", title:"원화환산잔액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "crdRskAdjAm", title:"신용위험조정금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "krwXcCrdRskAdjAm", title:"원화환산신용위험조정금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "otmkdvYn", title:"장외파생여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "capAdjEvlPft", title:"자본조정평가익", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "krwXcCapAdjEvlPft", title:"원화환산자본조정평가익", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "dfrSdt", title:"연체시작일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dshYn", title:"부도여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dshOcrDt", title:"부도발생일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "stcAimDscd", title:"주식보유목적구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "scrtItmCd", title:"유가증권종목코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "genBdrAm", title:"일반준비금", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "krwXcGenBdrAm", title:"원화환산일반준비금", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "spcBdrAm", title:"특정준비금", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "krwXcSpcBdrAm", title:"원화환산특정준비금", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  
		  { name: "spltFncDtlDscd", title:"특수금융구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "spltFncOprDscd", title:"특수금융운영단계구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "ftspvYn", title:"적격부동산개발금융SPV여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "ftnsYn", title:"적격거래여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "tlacYn", title:"TLAC여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "covbRglnSfcnYn", title:"커버드본드규정충족여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "ftnsCovbYn", title:"적격커버드본드여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "asetId", title:"자산ID", css:"cell", type: "text",  width: 150, align:"center", editing: true},
		  
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
	
	var saveList = [];
	//c,u,d,e 건만 추출 후 저장 처리
	for (var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		if (item.status == "e") {
//			if(! isValid(i,item,coCdArr,trtyCdArr)) { 
//				return; 
//			}
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
			$.callAjax({"list" : JSON.stringify(saveList)}, "/rm/sn/rmsn512m/saveSubCompExpInfoList.do")
			.done(function(data) {
				if (data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					// 재조회
					selectCompRetailExpList();
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
		,"wfgCd":""//그룹내기관코드
		,"basDt":""//기준일자
		,"lnkComCd":""//연결회사코드
		,"subcoXpsId":""//자회사거래상대방ID
		,"grpStdAccCd8":""//그룹표준계정과목코드
		,"fnprCatgCd":""//금융상품범주코드
		,"sbcmAddWdrYnCd":""//자회사추가인출여부코드
		,"opnDt":""//신규일
		,"xprDt":""//만기일
		,"lnRpyMtdCd":""//여신상환방법코드
		,"prnrpSdt":""//원금상환시작일
		,"curCd":""//통화코드
		,"dlCurCd":""//취급통화코드
		,"genAlwAm":""//일반충당금
		,"krwXcGenAlwAm":""//원화환산일반충당금
		,"spcAlwAm":""//특정충당금
		,"krwXcSpcAlwAm":""//원화환산특정충당금
		,"lmtAm":""//한도금액
		,"krwXcLmtAm":""//원화환산한도금액
		,"bsBl":""//잔액
		,"krwXcBsBl":""//원화환산잔액
		,"crdRskAdjAm":""//신용위험조정금액
		,"krwXcCrdRskAdjAm":""//원화환산신용위험조정금액
		,"otmkdvYn":""//장외파생여부
		,"capAdjEvlPft":""//자본조정평가익
		,"krwXcCapAdjEvlPft":""//원화환산자본조정평가익
		,"dfrSdt":""//연체시작일
		,"dshYn":""//부도여부
		,"dshOcrDt":""//부도발생일
		,"stcAimDscd":""//주식보유목적구분코드
		,"scrtItmCd":""//유가증권종목코드
		,"genBdrAm":""//일반준비금
		,"krwXcGenBdrAm":""//원화환산일반준비금
		,"spcBdrAm":""//특정준비금
		,"krwXcSpcBdrAm":""//원화환산특정준비금
		,"spltFncDtlDscd":""//특수금융구분코드
		,"spltFncOprDscd":""//특수금융운영단계구분코드
		,"ftspvYn":""//적격부동산개발금융SPV여부
		,"ftnsYn":""//적격거래여부
		,"tlacYn":""//TLAC여부
		,"covbRglnSfcnYn":""//커버드본드규정충족여부
		,"ftnsCovbYn":""//적격커버드본드여부
			
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

	if ($.fn.isEmpty(item.basDt)) {
		$.fn.msgBox(rowIndex + "행의 기준일자를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.wfgCd)) {
		$.fn.msgBox(rowIndex + "행의 내부기관코드를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.lnkComCd)) {
		$.fn.msgBox(rowIndex + "행의 연결회사코드를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.subcoXpsId)) {
		$.fn.msgBox(rowIndex + "행의 자회사익스포져ID를 입력하시기 바랍니다.");
		return false;
	}
	
	if ($.fn.isEmpty(item.ctpId)) {
		$.fn.msgBox(rowIndex + "행의 거래상대방ID를 입력하시기 바랍니다.");
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
function selectCompRetailExpList(){
	var inpBasDt = $("#inp_basDt").val();
	var subcoXpsId = $("#inp_subcoXpsId").val();
	
	if ($.fn.isNull(inpBasDt) ) {
		$.fn.msgBox("마감년월을 모두 입력하시기 바랍니다.");
		return false;
	}
	
	//전송 파라미터 세팅 
	var req = {
			"basDt" : inpBasDt, 
			"subcoXpsId":subcoXpsId
	};
	
	//서비스url 
	$.callAjax(req, "/rm/sn/rmsn512m/selectSubCompExpInfoList.do")
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
			console.log("fail to selectCompRetailExpList");
	});		
}


