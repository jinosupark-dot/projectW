/**
 * @시스템명: IFRS17
 * @업무명: RWA기업PD세그먼트매핑기본원장 JS
 * @설명: RWA기업PD세그먼트매핑기본원장 JS
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
		selectRWACompPdSegList();
	});
	
	
	// 신용평가모델구분코드 Enter키 조회
	$("#inp_crdEvlMdlDscd").on("keydown", function(e){
		if(e.which === 13){
			selectRWACompPdSegList();
		}
	});

	// 내부신용등급코드 Enter키 조회
	$("#inp_inCrdrkCd").on("keydown", function(e){
		if(e.which === 13){
			selectRWACompPdSegList();
		}
	});
	
	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "RWA기업PD세그먼트매핑기본원장.xlsx";

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
		{ name: "crdEvlMdlDscd", title:"신용평가모델구분코드", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			$result.on("click", function() {
				$(this).select();
			});
			return $result;
			},validate: [{validator:"required", message:"[신용평가모델구분코드] 필수 입력 항목입니다."}]
		},
		{ name: "inCrdrkCd", title:"내부신용등급코드", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			$result.on("click", function() {
				$(this).select();
			});
			return $result;
			},validate: [{validator:"required", message:"[내부신용등급코드] 필수 입력 항목입니다."}]
		},
		{ name: "aplyEdt", title:"적용종료일", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			$result.on("click", function() {
				$(this).select();
			});
			return $result;
			},validate: [{validator:"required", message:"[적용종료일] 필수 입력 항목입니다."}]
		},

		{ name: "pdSgmnId", title:"PD세그먼트ID", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "aplySdt", title:"적용시작일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lstDbChgDtm14", title:"최종DB변경일시", css:"cell", type: "text",  width: 100, align:"center", editing: false},

		
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
			$.callAjax({"list" : JSON.stringify(saveList)}, "/rm/rc/rmrc514m/saveRWACompPdSegList.do")
			.done(function(data) {
				if (data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					// 재조회
					selectRWACompPdSegList();
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
		,"crdEvlMdlDscd":""//신용평가모델구분코드
		,"inCrdrkCd":""//내부신용등급코드
		,"aplyEdt":""//적용종료일
		,"pdSgmnId":""//
		,"aplySdt":""//적용시작일
		,"lstDbChgDtm":""//최종DB변경일시


			
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

	if ($.fn.isEmpty(item.basDt8)) {
		$.fn.msgBox(rowIndex + "행의 기준일자를 입력하시기 바랍니다.");
		return false;
	}
	if ($.fn.isEmpty(item.itcsno13)) {
		$.fn.msgBox(rowIndex + "행의 통합고객번호(법인번호)를 입력하시기 바랍니다.");
		return false;
	}

	return true;
}

/**
 * @설명: 재보험미수미지급업로드 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function selectRWACompPdSegList(){

	var wfgCd = $("#inp_wfgCd").val();
	var crdEvlMdlDscd = $("#inp_crdEvlMdlDscd").val();
	var inCrdrkCd = $("#inp_inCrdrkCd").val();
	
	//전송 파라미터 세팅 
	var req = {
			"wfgCd" : wfgCd,
			"crdEvlMdlDscd" : crdEvlMdlDscd,
			"inCrdrkCd" : inCrdrkCd
	};
	
	//서비스url 
	$.callAjax(req, "/rm/rc/rmrc514m/selectRWACompPdSegList.do")
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
			console.log("fail to selectRWACompPdSegList");
	});		
}


