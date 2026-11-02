/**
 * @시스템명: IFRS17
 * @업무명: 현황판2 JS
 * @설명: 현황판2 JS
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.14
 * @최종변경일:
 * @개정이력:
 *  양슬기 2025.10.14 최초작성
 */

var batchRunObj = {};
var lv02ClickObj = {};
var lv02ClickIndex = null;

var userInfoObj = {};
var screenPermission = "";



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
    
    //기준일자 현재 일자 세팅 - 나중에 정의후 처리 하자!!
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
 * @최초작성일: 2025.10.14
 * @최종변경일: 
 * @개정이력: 
 *  양슬기 2025.10.14 최초작성
 */
function initEvent() {
	
	
	userInfoObj = $.fn.getLoginUserInfo();
	screenPermission = $.fn.getScreenPermissionInfo("fimt411m");
	
	// 조회
	$("#btn_search").on("click", function(e){
		selectMntr2List();
	});
	
	// 마감년월 to 달력
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
				selectMntr2List();
				return false;
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		
		}
	});
	
	// 배치ID Enter키 조회
	$("#inp_batchId").on("keydown", function(e){
		if(e.which === 13){
			if($.fn.isEmpty(this.value)) {
				return;
			}else{
				selectMntr2List();
				return false;
			}
		}
	});

	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "현황판2정보.xlsx";

		var paramObj = {};
		paramObj.id = gridId;
		paramObj.fileName = fileName;         
		paramObj.applyItemTemplate = false;   
		$.fn.exportGridExcel(paramObj);
	});
	
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.10.14 최초작성
 */
function initGrid(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDivRins",
		height: 600,
		editing: false,
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
			{ name: "a1", title:"임시1", css:"cell", type: "text", width:100, editing: false, align:"center"},
			{ name: "b1", title:"임시2", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "c1", title:"임시3", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "d1", title:"임시4", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "e1", title:"임시5", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "f1", title:"임시6", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "h1", title:"임시7", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "i1", title:"임시8", css:"cell", type: "text", width: 100, editing: false, align:"center"},

		  
	   ] 
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}


/**
 * @설명: 배치실행 팝업을 호출한다. - 비공통팝업
 * @최초작성자: 양슬기
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 양슬기 2021.01.21 최초작성
 * 배치실행 팝업을 호출 하도록 처리 - 공통팝업
 */
function callBatchRunPopup1(item) {
//console.log("  callBatchRunPopup1 called!!! ");	
	
	var batchId = item.batWkId;
	var stndYmd = item.stndYmd;
	var wkBasDt = item.stndYmd;
	var basYm   = "";
	var wkDscd  = null;  //배치 타입  : (null = all), data, file
	
	if( stndYmd.length == 6 ){
		basYm = item.stndYmd;
		wkBasDt = item.stndYmd;
	}else if( stndYmd.length == 8 ) {
		basYm = stndYmd.substring(stndYmd, 0, 6 );
		wkBasDt = item.stndYmd;
	}
	
	var reqParam = {
			"batchId" : batchId					//배치ID
			,"basYm" : basYm				//기준년월
			,"wkBasDt" : wkBasDt			//작업기준일자
			,"wkDscd" : wkDscd             //배치 타입  : (null = all), data, file
	};
	

	console.log(" 직업 배치 호출  "+reqParam);
	console.log(" 직업 배치 호출 batId "+reqParam.batchId);
	console.log(" 직업 배치 호출 basYm  "+reqParam.basYm);
	console.log(" 직업 배치 호출 wkBasDt "+reqParam.wkBasDt);
	console.log(" 직업 배치 호출 wkDscd "+reqParam.wkDscd);
	
	
	$.callAjax(reqParam, "/rm/mt/rmmt112m/execVrfPrct.do",{async:false})
	.done(function(data) {
alert("배치 수행 요청 완료 되었습니다.\n재조회 합니다.\n 배치ID:" + batchId);		
		console.log("done to callBatchRunPopup1!!!!");
		
		}).fail(function(data) {
		console.log("fail to callBatchRunPopup1!!!!");
	});
	
}

/**
 * @설명: 배치실행 팝업을 호출한다. - 비공통팝업
 * @최초작성자: 양슬기
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 양슬기 2021.01.21 최초작성
 * 배치실행 팝업을 호출 하도록 처리 - 공통팝업
 */
function callBatchRunPopup2(item) {
//console.log("  callBatchRunPopup2 called!!! ");	
	
	var batchId = item.batWkId;
	var stndYmd = item.stndYmd;
	var wkBasDt = item.stndYmd;
	var basYm   = "";
	var wkDscd  = "data";  //배치 타입  : (null = all), data, file
	
	if( stndYmd.length == 6 ){
		basYm = item.stndYmd;
		wkBasDt = item.stndYmd;
	}else if( stndYmd.length == 8 ) {
		basYm = stndYmd.substring(stndYmd, 0, 6 );
		wkBasDt = item.stndYmd;
	}
	
	var reqParam = {
			"batchId" : batchId					//배치ID
			,"basYm" : basYm				//기준년월
			,"wkBasDt" : wkBasDt			//작업기준일자
			,"wkDscd" : wkDscd             //배치 타입  : (null = all), data, file
	};
	

	console.log(" 직업 배치 호출  "+reqParam);
	console.log(" 직업 배치 호출 batId "+reqParam.batchId);
	console.log(" 직업 배치 호출 basYm  "+reqParam.basYm);
	console.log(" 직업 배치 호출 wkBasDt "+reqParam.wkBasDt);
	console.log(" 직업 배치 호출 wkDscd "+reqParam.wkDscd);
	
	
	$.callAjax(reqParam, "/rm/mt/rmmt112m/execVrfPrct.do",{async:false})
	.done(function(data) {
alert("배치 수행 요청 완료 되었습니다.\n재조회 합니다.\n 배치ID:" + batchId);		
		console.log("done to callBatchRunPopup1!!!!");
		
		}).fail(function(data) {
		console.log("fail to callBatchRunPopup1!!!!");
	});
	
}



/**
 * @설명: 배치실행 팝업을 호출한다. - 비공통팝업
 * @최초작성자: 양슬기
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 양슬기 2021.01.21 최초작성
 * 배치실행 팝업을 호출 하도록 처리 - 공통팝업
 */
function callBatchRunPopup3(item) {
//console.log("  callBatchRunPopup3 called!!! ");	
	
	var batchId = item.batWkId;
	var stndYmd = item.stndYmd;
	var wkBasDt = item.stndYmd;
	var basYm   = "";
	var wkDscd  = "file";  //배치 타입  : (null = all), data, file
	
	if( stndYmd.length == 6 ){
		basYm = item.stndYmd;
		wkBasDt = item.stndYmd;
	}else if( stndYmd.length == 8 ) {
		basYm = stndYmd.substring(stndYmd, 0, 6 );
		wkBasDt = item.stndYmd;
	}
	
	var reqParam = {
			"batchId" : batchId					//배치ID
			,"basYm" : basYm				//기준년월
			,"wkBasDt" : wkBasDt			//작업기준일자
			,"wkDscd" : wkDscd             //배치 타입  : (null = all), data, file
	};
	

	console.log(" 직업 배치 호출  "+reqParam);
	console.log(" 직업 배치 호출 batId "+reqParam.batchId);
	console.log(" 직업 배치 호출 basYm  "+reqParam.basYm);
	console.log(" 직업 배치 호출 wkBasDt "+reqParam.wkBasDt);
	console.log(" 직업 배치 호출 wkDscd "+reqParam.wkDscd);
	
	
	$.callAjax(reqParam, "/rm/mt/rmmt112m/execVrfPrct.do",{async:false})
	.done(function(data) {
alert("배치 수행 요청 완료 되었습니다.\n재조회 합니다.\n 배치ID:" + batchId);		
		console.log("done to callBatchRunPopup1!!!!");
		
		}).fail(function(data) {
		console.log("fail to callBatchRunPopup1!!!!");
	});
	
}


/**
 * @설명: 그리드 하나의 행을 추가한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.14
 * @최종변경일: 
 * @개정이력: 
 *  양슬기 2025.10.14 최초작성
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
		"cusIdfNo" : "",			/*고객식별번호*/
		"acnmNoDscd" : "",		    /*실명번호구분코드*/
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
		"trnpeDscd" : "",		    /*거래자구분코드*/
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
 * @설명: 현황판2 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.10.14 최초작성
 */
function selectMntr2List(){
	
	//var inpBasDt = $.replaceAll($("#inp_basDt").val().trim(), "-","");
	var inpBasDt = $("#inp_basDt").val();
	inpBasDt = inpBasDt.replace('-','');
	inpBasDt = inpBasDt.replace('-','');
	var batchId  = $("#inp_batchId").val();
	
	if ($.fn.isNull(inpBasDt) ) {
		$.fn.msgBox("기준일자를 모두 입력하시기 바랍니다.");
		return false;
	}
	
console.log("basDt:"+inpBasDt+"_batchId:"+batchId);	
	//전송 파라미터 세팅 
	var req = {
			"basDt" : inpBasDt,
			"batchId" : batchId
	};
	
	lv02ClickObj = {};
	lv02ClickIndex = null;
	
	
	//서비스url 
	$.callAjax(req, "/rm/mt/rmmt112m/selectMntr2List.do")
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
			console.log("fail to selectMntr2List");
	});		
}

