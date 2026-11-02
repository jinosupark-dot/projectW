/**
 * @시스템명: IFRS17
 * @업무명: 기업소매익스포져월 JS
 * @설명: 기업소매익스포져월 JS
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
	
	// 익스포져ID Enter키 조회
	$("#inp_xpsId").on("keydown", function(e){
		if(e.which === 13){
			selectCompRetailExpList();
		}
	});
	
	
	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "기업소매익스포져월.xlsx";

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
			{ name: "accCd", title:"계정코드", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			   },validate: [{validator:"required", message:"[계정코드] 필수 입력 항목입니다."}]
		    },
		    
			{ name: "xpsId30", title:"익스포져ID", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			   },validate: [{validator:"required", message:"[익스포져ID] 필수 입력 항목입니다."}]
		    },
		  { name: "accDscd", title:"계정구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "actNo", title:"계좌번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "lmtAgrId", title:"한도약정ID", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "apvrqNo", title:"승인신청번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "actMngbrCd", title:"계좌관리점코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "cusNo15", title:"고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "ctpId20", title:"거래상대방ID", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rsbrItcsno11", title:"주민사업자통합고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "coRtselDscd", title:"기업소매구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "coRtselCgnzTpcd", title:"기업소매인식유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "pscoDscd", title:"개인법인구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "xpsTpcd", title:"익스포져유형구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "lnOpDscd", title:"여신운용구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "actSdt", title:"계좌시작일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "actXpdt", title:"계좌만기일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "fstActXpdt", title:"최초계좌만기일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "xpsAgrXprYcn", title:"EXPOSURE약정만기년수", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dmnDshYn", title:"월중부도여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dshYn", title:"부도여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dshRsnCd", title:"부도사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dshOcrDt", title:"부도발생일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dshCanDt", title:"부도해지일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "curCd", title:"통화코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "lnBl", title:"여신잔액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "dfrDcn", title:"연체일수", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rcCrdrkCd", title:"RC신용등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dfrYn", title:"연체여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dfrRckdt", title:"연체기산일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dfrDcnDscd", title:"연체일수구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rtselPolId", title:"소매POOLID", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "bfchgRtselPolId", title:"변경전소매POOLID", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "xpsStcd", title:"EXPOSURE상태코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "abslRtselYn", title:"절대소매여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "lstLmtAm", title:"최종한도금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		  { name: "smepeCgnzNo", title:"동일인인식번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "asetId", title:"자산ID", css:"cell", type: "text",  width: 200, align:"center", editing: true},
		  
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
			$.callAjax({"list" : JSON.stringify(saveList)}, "/rm/sn/rmsn212m/saveMonthCompRetailExpList.do")
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
		,"wfgCd":"32"//그룹내기관코드
		,"basDt":""//기준일자
		,"accCd":""//계정코드
		,"xpsId30":""//익스포져ID
		,"accDscd":""//계정구분코드
		,"actNo":""//계좌번호
		,"lmtAgrId":""//한도약정ID
		,"apvrqNo":""//승인신청번호
		,"actMngbrCd":""//계좌관리점코드
		,"cusNo15":""//고객번호
		,"ctpId20":""//거래상대방ID
		,"rsbrItcsno11":""//주민사업자통합고객번호
		,"coRtselDscd":""//기업소매구분코드
		,"coRtselCgnzTpcd":""//기업소매인식유형코드
		,"pscoDscd":""//개인법인구분코드
		,"xpsTpcd":""//익스포져유형구분코드
		,"lnOpDscd":""//여신운용구분코드
		,"actSdt":""//계좌시작일
		,"actXpdt":""//계좌만기일
		,"fstActXpdt":""//최초계좌만기일
		,"xpsAgrXprYcn":""//EXPOSURE약정만기년수
		,"dmnDshYn":""//월중부도여부
		,"dshYn":""//부도여부
		,"dshRsnCd":""//부도사유코드
		,"dshOcrDt":""//부도발생일
		,"dshCanDt":""//부도해지일
		,"curCd":""//통화코드
		,"lnBl":""//여신잔액
		,"dfrDcn":""//연체일수
		,"rcCrdrkCd":""//RC신용등급코드
		,"dfrYn":""//연체여부
		,"dfrRckdt":""//연체기산일
		,"dfrDcnDscd":""//연체일수구분코드
		,"rtselPolId":""//소매POOLID
		,"bfchgRtselPolId":""//변경전소매POOLID
		,"xpsStcd":""//EXPOSURE상태코드
		,"abslRtselYn":""//절대소매여부
		,"lstLmtAm":""//최종한도금액
		,"smepeCgnzNo":""//동일인인식번호			
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
	if ($.fn.isEmpty(item.accCd)) {
		$.fn.msgBox(rowIndex + "행의 계정코드를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.xpsId30)) {
		$.fn.msgBox(rowIndex + "행의 익스포져ID를 입력하시기 바랍니다.");
		return false;
	}


	return true;
}

/**
 * @설명: 목록을 조회한다.
 * @최초작성자: 
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function selectCompRetailExpList(){

	var inpBasDt = $("#inp_basDt").val();
	var xpsId    = $("#inp_xpsId").val();
	
	
	if ($.fn.isNull(inpBasDt) ) {
		$.fn.msgBox("마감년월을 모두 입력하시기 바랍니다.");
		return false;
	}

	//전송 파라미터 세팅 
	var req = {
			"basDt" : inpBasDt,
			"xpsId30" : xpsId
	};
	
	//서비스url 
	$.callAjax(req, "/rm/sn/rmsn212m/selectMonthCompRetailExpList.do")
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


