/**
 * @시스템명: IFRS17
 * @업무명: 월별그룹계좌별기소분류명세 JS
 * @설명: 월별그룹계좌별기소분류명세 JS
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
		selectMonthGroupBrowCompRetailList();
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
				selectMonthGroupBrowCompRetailList();
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
			selectMonthGroupBrowCompRetailList();
			return false;
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.");
			$(this).focus();
		}
	
	});
	
	// 계정코드 Enter키 조회
	$("#inp_accCd").on("keydown", function(e){
		if(e.which === 13){
			selectMonthGroupBrowCompRetailList();
		}
	});
	
	// 익스포져ID Enter키 조회
	$("#inp_xpsId").on("keydown", function(e){
		if(e.which === 13){
			selectMonthGroupBrowCompRetailList();
		}
	});
	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "월별그룹계좌별기소분류명세.xlsx";

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
			},
			insertItem : function(item) { //insertItem API이용시 진입
//				setTimeout(function(){
//					$("#gridDiv").jsGrid("editItem", item);
//				});
			}	
			
		},
		onItemEditing: function(args) {	//Grid Edit모드 진입시 처리
			
			//delete 상태 스킵
			if( args.item.status == 'd') {
				args.cancel = true;
			}
		},
		
		//그리드 컬럼 정의 !!!
	   fields: [
		  { name: "rowNum", title:"순번", css:"cell", type: "text", width: 40, editing: false, align:"center"},
		  { name: "wfgCd", title:"그룹내기관코드", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[그룹내기관코드] 필수 입력 항목입니다."}]
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
		{ name: "accCd", title:"계정코드", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[계정코드] 필수 입력 항목입니다."}]
		},
		{ name: "xpsId", title:"익스포져ID", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			$result.on("click", function() {
				$(this).select();
			});
			return $result;
			},validate: [{validator:"required", message:"[익스포져ID] 필수 입력 항목입니다."}]
		},
		{ name: "accDscd", title:"계정구분코드", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			$result.on("click", function() {
				$(this).select();
			});
			return $result;
			},validate: [{validator:"required", message:"[계정구분코드] 필수 입력 항목입니다."}]
		},
		{ name: "actNo44", title:"계좌번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "cusNo24", title:"고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "ctpId", title:"거래상대방ID", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "rsbrItcsno24", title:"주민사업자통합고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "coRtselDscd", title:"기업소매구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "coRtselCgnzTpcd", title:"기업소매인식유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "pscoDscd", title:"개인법인구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "dmnDshYn", title:"월중부도여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "dshYn", title:"부도여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "dshRsnCd", title:"부도사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "dshOcrDt", title:"부도발생일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "dshCanDt", title:"부도해지일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    
		{ name: "lnBl", title:"여신잔액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
	    
	    
	    { name: "dfrDcn", title:"연체일수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "dfrYn", title:"연체여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lstLmtAm", title:"최종한도금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
	    
	    { name: "smepeCgnzNo", title:"동일인인식번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "grpSmepeCgnzNo", title:"그룹동일인인식번호", css:"cell", type: "text",  width: 150, align:"left", editing: false},
	    { name: "grpCoRtselDscd", title:"그룹기업소매구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "grpCoRtselCgnzTpcd", title:"그룹기업소매인식유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "grpLstLmtAm", title:"그룹최종한도금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},

	    
	    { name: "grpDmnDshYn", title:"그룹월중부도여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "grpDshYn", title:"그룹부도여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "grpDshRsnCd", title:"그룹부도사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "grpDshOcrDt", title:"그룹부도발생일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "grpDshCanDt", title:"그룹부도해지일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "grpSmepeEncyAcnmNo", title:"그룹동일인암호화실명번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "acnmNoDscd", title:"실명번호구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "abslRtselYn", title:"절대소매여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	    { name: "dbChgTs", title:"DB변경일시(YYYYMMDDHH24MISS)", css:"cell", type: "text",  width: 100, align:"center", editing: false},

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
			$.callAjax({"list" : JSON.stringify(saveList)}, "/rm/rc/rmrc212m/saveMonthGroupBrowCompRetailList.do")
			.done(function(data) {
				if (data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					// 재조회
					selectMonthGroupBrowCompRetailList();
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
		,"xpsId":""//익스포져ID
		,"accDscd":""//계정구분코드
		,"actno44":""//계좌번호
		,"cusNo24":""//고객번호
		,"ctpId":""//거래상대방ID
		,"rsbrItcsno24":""//주민사업자통합고객번호
		,"coRtselDscd":""//기업소매구분코드
		,"coRtselCgnzTpcd":""//기업소매인식유형코드
		,"pscoDscd":""//개인법인구분코드
		,"dmnDshYn":""//월중부도여부
		,"dshYn":""//부도여부
		,"dshRsnCd":""//부도사유코드
		,"dshOcrDt":""//부도발생일
		,"lnBl":""//연체일수
		,"dfrDcn":""//연체일수
		,"dfrYn":""//연체여부
		,"lstLmtAm":""//최종한도금액
		,"smepeCgnzNo":""//동일인인식번호
		,"grpSmepeCgnzNo":""//그룹동일인인식번호
		,"grpCoRtselDscd":""//그룹기업소매구분코드
		,"grpCoRtselCgnzTpcd":""//그룹기업소매인식유형코드
		,"grpLstLmtAm":""//그룹최종한도금액
		,"grpDmnDshYn":""//그룹월중부도여부
		,"grpDshYn":""//그룹부도여부
		,"grpDshRsnCd":""//그룹부도사유코드
		,"grpDshOcrDt":""//그룹부도발생일
		,"grpDshCanDt":""//그룹부도해지일
		,"grpSmepeEncyAcnmNo":""//그룹동일인암호화실명번호
		,"acnmNoDscd":""//실명번호구분코드
		,"abslRtselYn":""//절대소매여부
		,"dbChgTs":""//DB변경일시(YYYYMMDDHH24MISS)

			
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
	
	if ($.fn.isEmpty(item.smepeCgnzNo)) {
		$.fn.msgBox(rowIndex + "행의 동일인인식번호를 입력하시기 바랍니다.");
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
function selectMonthGroupBrowCompRetailList(){
	var inpBasDt = $("#inp_basDt").val();
	var accCd = $("#inp_accCd").val();
	var xpsId = $("#inp_xpsId").val();
	
	if ($.fn.isNull(inpBasDt) ) {
		$.fn.msgBox("기준일자를 모두 입력하시기 바랍니다.");
		return false;
	}
	
	//전송 파라미터 세팅 
	var req = {
			"basDt" : inpBasDt, 
			"accCd" : accCd,
			"xpsId" : xpsId
	};
	
	//서비스url 
	$.callAjax(req, "/rm/rc/rmrc212m/selectMonthGroupBrowCompRetailList.do")
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
			console.log("fail to selectMonthGroupBrowCompRetailList");
	});		
}



