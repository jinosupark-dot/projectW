/**
 * @시스템명: IFRS17
 * @업무명: 거래상대방참조일 JS
 * @설명: 거래상대방참조일 JS
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.15
 * @최종변경일:
 * @개정이력:
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
 * @최초작성일: 2025.10.15
 * @최종변경일: 
 * @개정이력: 
 *  양슬기 2025.10.15 최초작성
 */
function initEvent() {
	// 조회
	$("#btn_search").on("click", function(e){
		selectRinsNtrcvUnpymList();
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
				selectRinsNtrcvUnpymList();
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
			selectRinsNtrcvUnpymList();
			return false;
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.");
			$(this).focus();
		}
	
	});
	
	// 거래상대방ID Enter키 조회
	$("#inp_ctpId").on("keydown", function(e){
		if(e.which === 13){
			selectRinsNtrcvUnpymList();
		}
	});
	
	// 거래상대방명 Enter키 조회
	$("#inp_trnCptNm").on("keydown", function(e){
		if(e.which === 13){
			selectRinsNtrcvUnpymList();
		}
	});
	
	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "거래상대방참조일정보.xlsx";

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
	
	// 배치 테스트
	$("#btn_test").on("click", function(e){
		testBatch();
	});
	
	
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.15
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.10.15 최초작성
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
		  
		  { name: "ctpId", title:"거래상대방ID", css:"cell", type: "text", width: 120, align:"center", editTemplate:function(value, item) {
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
				},/* itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");			
				},*/ validate: [
						{validator:"required", message:"[거래상대방ID] 필수 입력 항목입니다."}
				   ]
			  },
		  

		  { name: "bkwCusDscd", title:"전행고객구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "cusIdfNo", title:"고객식별번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "acnmNoDscd", title:"실명번호구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "inRkCtpTpcd", title:"내부등급거래상대방유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "stdCtpTpcd", title:"표준방법거래상대방유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "fstInRkCtpTpcd", title:"최초내부거래상대방유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "fstStdCtpTpcd", title:"최초표준방법거래상대방유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rsbrItcsno24", title:"주민사업자통합번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rscoItcsno44", title:"주민법인통합고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "lstItcsno", title:"최종통합고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "bzpeCusIdfRefno", title:"사업자고객식별참조번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "corpCusIdfRefno", title:"법인고객식별참조번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "cusIdfRefno", title:"고객식별참조번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "bicCd", title:"BIC코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "trnCptNm", title:"거래상대방명", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "cosizCd", title:"기업규모코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "coKdcd", title:"기업종류코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "totAsetAm", title:"총자산금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "totSalAm", title:"총매출금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "adtOpnYn", title:"외부감사의견유무", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "brrHldYn", title:"BRR등급보유유무", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "bisCoDscd", title:"BIS관리기업구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "natCd", title:"국가코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "trnpeDscd", title:"거래자구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "stdIndsCfcd", title:"표준산업구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "affCd", title:"계열코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "fstLnRqDt", title:"최초여신신청일", css:"cell", type: "text",  width: 100, align:"center", editing: true, itemTemplate:function(value, item) {
			  	return $.fn.dateFormat(value, "");			
		   		}
		  },
		  { name: "ptntCusYn", title:"잠재고객여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "corpnoYn", title:"법인등록번호여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "coreMktEntpeYn", title:"핵심시장참가자여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rwaPrcTxt", title:"RWA처리내용", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "cptyNm", title:"가상법인번호", css:"cell", type: "text",  width: 200, align:"center", editing: true},

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


function testBatch() {
	
	var batchId =  $("#inp_batchId").val();
	var finYm =  $("#inp_param1").val();
	var wkBasDt =  $("#inp_param2").val();
	var param3 =  $("#inp_param3").val();
	var param4 =  $("#inp_param4").val();
	var param5 =  $("#inp_param5").val();
	var param6 =  $("#inp_param6").val();
	var param7 =  $("#inp_param7").val();
	var param8 =  $("#inp_param8").val();
	var param9 =  $("#inp_param9").val();
	var param10 =  $("#inp_param10").val();

	var reqParam = {
			"batchId" : batchId
			,"finYm" : finYm
			,"wkBasDt" : wkBasDt
			,"param3" : param3
			,"param4" : param4
			,"param5" : param5
			,"param6" : param6
			,"param7" : param7
			,"param8" : param8
			,"param9" : param9
			,"param10" : param10
			
			
	};
	
	$.callAjax(reqParam, "/rm/sn/rmsn112m/execVrfPrct.do",{async:false})
	.done(function(data) {

		//var codeList = data.list;
	}).fail(function(data) {
		console.log("fail to testBatch!!!!");
	});
	
	return codeItemList;
}


/**
 * @설명: 신규생성, 수정, 삭제 처리한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.15
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  양슬기 2025.10.15 최초작성
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
			$.callAjax({"list" : JSON.stringify(saveList)}, "/rm/sn/rmsn112m/saveTrOpstRefDaiInfoList.do")
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
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.15
 * @최종변경일: 
 * @개정이력: 
 *  양슬기 2025.10.15 최초작성
 */
function addGridData() {
	var dataList = $("#gridDivRins").jsGrid("option", "data");
	var rowNum = dataList.length + 1;
	
	$("#gridDivRins").jsGrid("insertItem", {
		"rowNum" : rowNum,
		"status" : "c",
		"wfgCd" : "32",				/*그룹내기관코드*/
		"basDt" : "",				/*기준일자*/
		"ctpId" : "", 			    /*거래상대방ID*/
		"bkwCusDscd" : "",			/*전행고객구분코드*/
		//"bkwCusDscdNm" : "",			/*전행고객구분코드*/
		"cusIdfNo" : "",			/*고객식별번호*/
		"acnmNoDscd" : "",		    /*실명번호구분코드*/
		//"acnmNoDscdNm" : "",		    /*실명번호구분코드*/
		"inRkCtpTpcd" : "",			/*내부등급거래상대방유형코드*/
		"stdCtpTpcd" : "",			/*표준방법거래상대방유형코드*/
		"fstInRkCtpTpcd" : "",		/*최초내부거래상대방유형코드*/
		"fstStdCtpTpcd" : "",		/*최초표준방법거래상대방유형코드*/
		"rsbrItcsno24" : "",		/*주민사업자통합번호*/
		"rscoItcsno44" : "",		/*주민법인통합고객번호*/
		"lstItcsno" : "",		    /*최종통합고객번호*/
		"bzpeCusIdfRefno" : "",		/*사업자고객식별참조번호*/
		"corpCusIdfRefno" : "",		/*법인고객식별참조번호*/
		"cusIdfRefno" : "",		    /*고객식별참조번호*/
		"bicCd" : "",		        /*BIC코드*/
		"trnCptNm" : "",		    /*거래상대방명*/
		"cosizCd" : "",		        /*기업규모코드*/
		"coKdcd" : "",		        /*기업종류코드*/
		"totAsetAm" : "",		    /*총자산금액*/
		"totSalAm" : "",		    /*총매출금액*/
		"adtOpnYn" : "",		    /*외부감사의견유무*/
		"brrHldYn" : "",		    /*BRR등급보유유무*/
		"bisCoDscd" : "",		    /*BIS관리기업구분코드*/
		"natCd" : "",		        /*국가코드*/
		//"natCdNm" : "",		        /*국가코드*/
		"trnpeDscd" : "",		    /*거래자구분코드*/
		//"trnpeDscdNm" : "",		    /*거래자구분코드*/
		"stdIndsCfcd" : "",		    /*표준산업구분코드*/
		"affCd" : "",		        /*계열코드*/
		"fstLnRqDt" : "",		    /*최초여신신청일*/
		"ptntCusYn" : "",		    /*잠재고객여부*/
		"corpnoYn" : "",		    /*법인등록번호여부*/
		"coreMktEntpeYn" : "",		/*핵심시장참가자여부*/
		"rwaPrcTxt" : ""		    /*RWA처리내용*/
			
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
	if ($.fn.isEmpty(item.ctpId)) {
		$.fn.msgBox(rowIndex + "행의 거래상대방ID를 입력하시기 바랍니다.");
		return false;
	}
	
	return true;
}

/**
 * @설명: 거래상대방참조일 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.15
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.10.15 최초작성
 */
function selectRinsNtrcvUnpymList(){
	var inpBasDt = $("#inp_basDt").val();
	var ctpId    = $("#inp_ctpId").val();
	var trnCptNm =$("#inp_trnCptNm").val();	
	
	if ($.fn.isNull(inpBasDt) ) {
		$.fn.msgBox("마감년월을 모두 입력하시기 바랍니다.");
		return false;
	}
	
	//전송 파라미터 세팅 
	var req = {
			"basDt" : inpBasDt,
			"ctpId" : ctpId,
			"trnCptNm" : trnCptNm
	};
	
	//서비스url 
	$.callAjax(req, "/rm/sn/rmsn112m/selectTrOpstRefDaiInfoList.do")
		.done(function(data) {
			// 그리드 데이터 초기화
			$("#gridDivRins").jsGrid("reset");

			// 그리드 바인딩
			var listData = data.list;
			$("#gridDivRins").jsGrid("loadData", listData).done(function() {
			});
			
			
			//alert(JSON.stringfy(listData));
			/* 2021.06.15 0건 그리드 메세지 처리 */
			if(listData.length == 0) {
				$.fn.getReturnValue("gridDivRins");
			}
			
		}).fail(function(data){
			console.log("fail to selectTrOpstRefDaiInfoList");
	});		
}


