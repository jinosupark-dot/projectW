/**
 * @시스템명: IFRS17
 * @업무명: 부도사유 JS
 * @설명: 부도사유 JS
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
		selectBankuptReasonList();
	});

	// 통합고객번호 Enter키 조회
	$("#inp_itcsno").on("keydown", function(e){
		if(e.which === 13){
			selectBankuptReasonList();
		}
	});

	
	// 익스포져ID Enter키 조회
	$("#inp_xpsId").on("keydown", function(e){
		if(e.which === 13){
			selectBankuptReasonList();
		}
	});

	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "부도사유명세.xlsx";

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
		  { name: "itcsno", title:"통합고객번호", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[통합고객번호] 필수 입력 항목입니다."}]
		  },
		  { name: "dshRgsSrno", title:"부도등록일련번호", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[부도등록일련번호] 필수 입력 항목입니다."}]
		  },
		  { name: "dshRsnCd", title:"부도사유코드", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[부도사유코드] 필수 입력 항목입니다."}]
		  },
		  { name: "dshRsnSrno", title:"부도사유일련번호", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[부도사유일련번호] 필수 입력 항목입니다."}]
		  },
		  { name: "acnmNoDscd", title:"실명번호구분코드", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[실명번호구분코드] 필수 입력 항목입니다."}]
		  },
		  { name: "accCd15", title:"계정과목코드", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[계정과목코드] 필수 입력 항목입니다."}]
		  },
		  { name: "dshRsnOccDt", title:"부도사유발생일자", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[부도사유발생일자] 필수 입력 항목입니다."}]
		  },
		  { name: "xpsId", title:"익스포져ID", css:"cell", type: "text", width: 125, editing: true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[익스포져ID] 필수 입력 항목입니다."}]
		  },
		  { name: "bkwCusDscd", title:"전행고객구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dsocActSrno", title:"부도발생계좌일련번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dfrRcknDt", title:"연체기산일자", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dshRsnRgsDt", title:"부도사유등록일자", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dshRvkRsnCd", title:"부도해제사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dshRsnRvkDt", title:"부도사유해제일자", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "dshRvkRgsDt", title:"부도해제등록일자", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "delDt", title:"삭제일", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rgsEno", title:"등록직원번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "rgsCanDt", title:"등록취소일자", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "datOnldDt", title:"데이터적재일자", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "hldItcsno", title:"차주통합고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "ldgStcd", title:"원장상태코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "ldgChgDtm", title:"원장변경일시", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "sorSrcdtDelYn", title:"SOR원천데이터삭제여부", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "nbisDatSrcDscd", title:"신BIS데이타원천구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  { name: "asetId", title:"자산ID", css:"cell", type: "text",  width: 100, align:"center", editing: true},
		  
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
			$.callAjax({"list" : JSON.stringify(saveList)}, "/rm/sn/rmsn311m/saveBankuptReasonList.do")
			.done(function(data) {
				if (data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					// 재조회
					selectBankuptReasonList();
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
		,"itcsno":""//통합고객번호
		,"dshRgsSrno":""//부도등록일련번호
		,"dshRsnCd":""//부도사유코드
		,"dshRsnSrno":""//부도사유일련번호
		,"acnmNoDscd":""//실명번호구분코드
		,"accCd15":""//계정과목코드
		,"dshRsnOccDt":""//부도사유발생일자
		,"xpsId":""//익스포져ID
		,"bkwCusDscd":""//전행고객구분코드
		,"dsocActSrno":""//부도발생계좌일련번호
		,"dfrRcknDt":""//연체기산일자
		,"dshRsnRgsDt":""//부도사유등록일자
		,"dshRvkRsnCd":""//부도해제사유코드
		,"dshRsnRvkDt":""//부도사유해제일자
		,"dshRvkRgsDt":""//부도해제등록일자
		,"delDt":""//삭제일
		,"rgsEno":""//등록직원번호
		,"rgsCanDt":""//등록취소일자
		,"datOnldDt":""//데이터적재일자
		,"hldItcsno":""//차주통합고객번호
		,"ldgStcd":""//원장상태코드
		,"ldgChgDtm":""//원장변경일시
		,"sorSrcdtDelYn":""//SOR원천데이터삭제여부
		,"nbisDatSrcDscd":""//신BIS데이타원천구분코드
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

	if ($.fn.isEmpty(item.wfgCd)) {
		$.fn.msgBox(rowIndex + "행의 내부기관코드를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.itcsno)) {
		$.fn.msgBox(rowIndex + "행의 통합고객번호를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.dshRgsSrno)) {
		$.fn.msgBox(rowIndex + "행의 부도등록일련번호를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.dshRsnCd)) {
		$.fn.msgBox(rowIndex + "행의 부도사유코드를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.dshRsnSrno)) {
		$.fn.msgBox(rowIndex + "행의 부도사유일련번호를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.acnmNoDscd)) {
		$.fn.msgBox(rowIndex + "행의 실명번호구분코드를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.accCd15)) {
		$.fn.msgBox(rowIndex + "행의 계정과목코드를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.dshRsnOccDt)) {
		$.fn.msgBox(rowIndex + "행의 부도사유발생일자를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.xpsId)) {
		$.fn.msgBox(rowIndex + "행의 익스포져ID를 입력하시기 바랍니다.");
		return false;
	}


	return true;
}

/**
 * @설명: 부도사유 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function selectBankuptReasonList(){
	var itcsno = $("#inp_itcsno").val();
	var xpsId  = $("#inp_xpsId").val();
	
	
	//전송 파라미터 세팅 
	var req = {
			"itcsno" : itcsno, 
			"xpsId" : xpsId
	};
	
	//서비스url 
	$.callAjax(req, "/rm/sn/rmsn311m/selectBankuptReasonList.do")
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
			console.log("fail to selectBankuptReasonList");
	});		
}


