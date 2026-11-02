/**
 * @시스템명: IFRS17
 * @업무명: 자회사파생상품익스포저원장 JS
 * @설명: 자회사파생상품익스포저원장 JS
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
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @개정이력: 
 *  심민정 2021.02.09 최초작성
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
		var fileName = "자회사파생상품익스포저원장.xlsx";

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
		  { name: "dvprdSrcDscd", title:"파생상품원천구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "subcoBzpeCrno", title:"자회사사업자법인등록번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "ctpNm", title:"거래상대방명", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "ofsetYn", title:"상계여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "trnSabDscd", title:"거래청산소구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "inmrOtmrDscd", title:"장내장외구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "mrgnTrnYn", title:"증거금거래여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "evdnmAcclDcnt", title:"증거금산정일수", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "basAsetDscd", title:"기초자산구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dvprdTpNm", title:"파생상품유형명", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dvprdHedgGrpId", title:"파생상품헷지군ID", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "stcDvprdMltpValNv", title:"주식파생상품승수값수치", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "stcDvprdCtrUnitNv", title:"주식파생계약단위수치", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "basAsetTpcd", title:"기초자산유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "basAsetItmsId", title:"기초자산종목ID", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "basAsetItmsNm", title:"기초자산종목명", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "basAsetCtAm", title:"기초자산현재금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "stcDvprdFltYn", title:"주식파생상품변동여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dvprdPstnDscd", title:"파생상품포지션구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dvprdRprsPstnDscd", title:"파생상품대표포지션구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "basCucd", title:"기준통화코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rcvgCucd", title:"수취통화코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "payCucd", title:"지급통화코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rcvgSwapCurAplXrt", title:"수취SWAP통화적용환율", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "paySwapCurAplXrt", title:"지급SWAP통화적용환율", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "ctrPrtxAm", title:"계약명목금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "krwCtrPrtxAm", title:"원화환산명목금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "rcvgKrwCtrPrtxAm", title:"수취원화환산명목금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "payKrwCtrPrtxAm", title:"지급원화환산명목금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "bsPrtxAm", title:"BS명목금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "ccrPrtxAm", title:"CCR명목금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "mkprEvlAm", title:"시가평가금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "dvprdOptYn", title:"파생상품옵션여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "optKdcd", title:"옵션종류코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dvprdTbkPtcpRt", title:"파생상품당행참여비율", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "crdDvprdUndasTpcd", title:"신용파생상품기초자산유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "crdDvprdUndasTpcdTxt", title:"신용파생상품기초자산유형코드내용", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "crdDvprdUndasCrdrkTxt", title:"신용파생상품기초자산신용등급내용", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "lbltScrdSecrLossBgnRt", title:"부채담보부증권손실개시율", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "lbltScrdSecrLossEndRt", title:"부채담보부증권손실종료율", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dvprdCtrLstEvtDt", title:"파생상품계약최종행사일자", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dvprdCtrEvtAm", title:"파생상품계약행사금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  
		  { name: "basAsetStaDt", title:"기초자산시작일자", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "basAsetEndDt", title:"기초자산종료일자", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "irXprDscd", title:"금리만기구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rcvgIrTpcd", title:"수취금리유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rcvgIrAplIndxvTxt", title:"수취금리적용색인값내용", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "payIrTpcd", title:"지급금리유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "payIrAplIndxvTxt", title:"지급금리적용색인값내용", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "curRcpIrt", title:"현재수취금리", css:"cell", type: "text",  width: 100, align:"right", editing: true},
		  { name: "curPayIrt", title:"현재지급금리", css:"cell", type: "text",  width: 100, align:"right", editing: true},
		  { name: "rcvgIrMgnRt", title:"수취금리마진비율", css:"cell", type: "text",  width: 100, align:"right", editing: true},
		  { name: "payIrMgnRt", title:"지급금리마진비율", css:"cell", type: "text",  width: 100, align:"right", editing: true},
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
			$.callAjax({"list" : JSON.stringify(saveList)}, "/rm/sn/rmsn515m/saveSubCompDerivateExpList.do")
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
		"status" : "c"
		,"wfgCd":""//그룹내기관코드
		,"basDt":""//기준일자
		,"lnkComCd":""//연결회사코드
		,"subcoXpsId":""//자회사익스포져ID
		,"dvprdSrcDscd":""//파생상품원천구분코드
		,"subcoBzpeCrno":""//자회사사업자법인등록번호
		,"ctpNm":""//거래상대방명ID
		,"ofsetYn":""//상계여부
		,"trnSabDscd":""//거래청산소구분코드
		,"inmrOtmrDscd":""//장내장외구분코드
		,"mrgnTrnYn":""//증거금거래여부
		,"evdnmAcclDcnt":""//증거금산정일수
		,"basAsetDscd":""//기초자산구분코드
		,"dvprdTpNm":""//파생상품유형명
		,"dvprdHedgGrpId":""//파생상품헷지군ID
		,"stcDvprdMltpValNv":""//주식파생상품승수값수치
		,"stcDvprdCtrUnitNv":""//주식파생계약단위수치
		,"basAsetTpcd":""//기초자산유형코드
		,"basAsetItmsId":""//기초자산종목ID
		,"basAsetItmsNm":""//기초자산종목명
		,"basAsetCtAm":""//기초자산현재금액
		,"stcDvprdFltYn":""//주식파생상품변동여부
		,"dvprdPstnDscd":""//파생상품포지션구분코드
		,"dvprdRprsPstnDscd":""//파생상품대표포지션구분코드
		,"basCucd":""//기준통화코드
		,"rcvgCucd":""//수취통화코드
		,"payCucd":""//지급통화코드
		,"rcvgSwapCurAplXrt":""//수취SWAP통화적용환율
		,"paySwapCurAplXrt":""//지급SWAP통화적용환율
		,"ctrPrtxAm":""//계약명목금액
		,"krwCtrPrtxAm":""//RWA원화환산명목금액
		,"rcvgKrwCtrPrtxAm":""//RWA수취원화환산명목금액
		,"payKrwCtrPrtxAm":""//RWA지급원화환산명목금액
		,"bsPrtxAm":""//BS명목금액
		,"ccrPrtxAm":""//CCR명목금액
		,"mkprEvlAm":""//시가평가금액
		,"dvprdOptYn":""//파생상품옵션여부
		,"optKdcd":""//옵션종류코드
		,"dvprdTbkPtcpRt":""//파생상품당행참여비율
		,"crdDvprdUndasTpcd":""//신용파생상품기초자산유형코드
		,"crdDvprdUndasTpcdTxt":""//신용파생상품기초자산유형코드내용
		,"crdDvprdUndasCrdrkTxt":""//신용파생상품기초자산신용등급내용
		,"lbltScrdSecrLossBgnRt":""//부채담보부증권손실개시율
		,"lbltScrdSecrLossEndRt":""//부채담보부증권손실종료율
		,"dvprdCtrLstEvtDt":""//파생상품계약최종행사일자
		,"dvprdCtrEvtAm":""//파생상품계약행사금액
		,"basAsetStaDt":""//기초자산시작일자
		,"basAsetEndDt":""//기초자산종료일자 
		,"irXprDscd":""//금리만기구분코드
		,"rcvgIrTpcd":""//수취금리유형코드
		,"rcvgIrAplIndxvTxt":""//수취금리적용색인값내용
		,"payIrTpcd":""//지급금리유형코드
		,"payIrAplIndxvTxt":""//지급금리적용색인값내용
		,"curRcpIrt":""//현재수취금리
		,"curPayIrt":""//현재지급금리
		,"rcvgIrMgnRt":"" //수취금리마진비율 	
		,"payIrMgnRt":""//지급금리마진비율
			
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
	
	return true;
}

/**
 * @설명: 목록을 조회한다.
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.02.09 최초작성
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
			"subcoXpsId" : subcoXpsId
	};
	
	//서비스url 
	$.callAjax(req, "/rm/sn/rmsn515m/selectSubCompDerivateExpList.do")
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
			console.log("fail to selectSubCompDerivateExpList");
	});		
}



