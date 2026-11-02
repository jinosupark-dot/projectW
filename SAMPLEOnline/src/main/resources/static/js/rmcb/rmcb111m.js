/**
 * @시스템명: IFRS17
 * @업무명: 기업신용평가 관리
 * @설명: 기업신용평가 관리 화면
 * @최초작성자: 양슬기
 * @최초작성일: 2025.12.02
 * @최종변경일:
 * @개정이력:
 *  양슬기 2025.12.02 최초작성
 *  
 */


//전역변수 선언
var NEW_MODI_SC_CD = "U";			//수정, 신규 저장 체크
var initObject = null;				//수정전 원데이터
var EXCEL_SAVE_YN = "N";			//엑셀로드 여부
var perBtnId = ["btn_excel_upload", "btn_save", "btn_delete", "btn_newReg", "btn_init", "ibx_pswd", "txt_pswd"];
var popCd      = "";//01 - 조회_통합고객번호, 02-조회_고객접수번호  - 사용
                     //미사용- 이후 업무 요건이 변경되면 사용한다!!
                    //, 03-수정_통합고객번호, 04-수정_고객접수번호, 05-수정_대표자카드고객번호, 06-수정_표준산업분류코드, 
					//07-신규_통합고객번호, 08-신규_고객접수번호, 09-신규_대표자카드고객번호, 10-신규_표준산업분류코드



$(document).ready(function(){
	
	//button permission
	var arrPerBtn = new Array();
	for(var i=0; i<perBtnId.length; i++){
		var perBtn = new Object();
		perBtn.btnId  = "#" + perBtnId[i];
		perBtn.action = "R";
		arrPerBtn.push(perBtn);
	}
	$.fn.setBtnPermission(arrPerBtn);
	
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	

	//가장 최근월 조회 
	selectMaxCompCreditEvalMngList();
	
	//수정란
	$("#inqrMdfcZon").hide(); //수정입력부분
	
	//입력란
	$("#newRegZon").hide(); //신규입력부분
	
	
	
	//버튼 초기화
	$("#btn_cancel").hide(); //취소
	$("#btn_excel_save").hide(); //엑셀저장
	$("#btn_delete_cancel").hide(); //삭제취소
	
	$("#sbx_deltYn").val("N");
	
	//하단 항목 초기화
	$("#inqrMdfcZon").find("select,input,button").attr("disabled", true);
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	
});

/**
 * @설명: event 초기화
 * @최초작성자: 양슬기
 * @최초작성일: 2025.12.02
 * @최종변경일: 
 * @개정이력: 
 *  양슬기 2025.12.02 최초작성
 */
function initEvent() {

	//조회
	$("#btn_search").on("click", function(e){
		selectCompCreditEvalMngList();
	});
	
	//전송
	$("#btn_send").on("click", function(e){
		sendCompCreditEval();
	});
	
	// 마감년월 to 달력
	$("#btn_basDt").on("click", function(e){
		$("#inp_basDt").datepicker("show");
	});
	
	//저장 처리
	$("#btn_save").on("click", function(e){
		saveCompCreditEval();
	});
	
	
	//엑셀다운로드
	$("#btn_excel_download").on("click", function(e){
		var fileName = "재무회계_분개/공시_항목코드_관리" + ".xlsx";
		$.fn.exportGridExcel({
			id: 'gridDiv', 
			fileName: fileName
		});
	});

	//엑셀저장
	$("#btn_excel_save").on("click", function(e){
		saveCompCreditEvalExcel();
	});
	
	//조회 팝업창들
	//통합고객번호 팝업창 호출
	$("#btn_itcsno20_1").on("click", function(e){
		popCd = "01";
		openPopup();
	});

	//고객접수번호 팝업창 호출
	$("#btn_cusRcpNo_1").on("click", function(e){
		popCd = "02";
		openPopup();
	});

}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 양슬기
 * @최초작성일: 2025.12.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.12.02 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 450,
		editing: true,
		sorting: true,
		paging: true,
		confirmDeleting: false,
		pageSize: 20,
		
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
					$("#gridDiv").jsGrid("updateItem", item);
					return item;
				}
			}
		},
		
//		onItemEditing: function(args) {	//Grid Edit모드 진입시 처리
//			if(typeof event === "undefined") {
//				args.cancel = true;
//				return;
//			}
//			
//			//delete 상태 스킵
//			if( args.item.status == 'd') {
//				args.cancel = true;
//				return;
//			}
//			
//			//신규, 엑셀업로드, 표준산업분류코드다수가 아닌 경우  Edit 모드 취소
//			if(!(args.item.status == "c" || args.item.status == "e" || args.item.sicCdMultYn == "Y")) {
//				$.fn.msgBox("표준산업분류코드가 다수가 아닐경우 편집이 불가합니다.");				
//				args.cancel = true;
//				return;
//			}
//		},
		
		fields : [
			
//	           { name: "check", title:"선택", width: 20, sorting: false, align:"center", editing: false, itemTemplate:function(value, item) {
//	               var elem = $("<input>").attr("type", "checkbox").attr("checked", value|| item.Checked).on("change", function() {
//	                       item.Checked = $(this).is(":checked");
//	                   });
//	               //if (item.treeId == "..") elem.attr("disabled", "true");
//	               //elem.attr("style", "width:5px");
//	               return elem;
//	           }},
			
			
			{ name: "check", title: "선택", width: 20, sorting: false, editing: false, align:"center", headerTemplate:function() {
//				return $("<input>").attr("id", "ckb_all").attr("type", "checkbox").on("change", function() {
//					
//						//grid_check_all(this.checked);
//				});
			}, 
			
			itemTemplate:function(value, item) {
					
				var $result = $("<input>").attr("type", "checkbox").attr("id", "ckb_" + item.rn).attr("checked", value || item.checked).on("change", function() {
					item.checked = $(this).is(":checked");
					//더블클릭된 항목이 있는데 선택했을때 선택 불가하게 
//        	   		if(($(this).is(":checked") && !$.fn.isEmpty(initObject)) || NEW_MODI_SC_CD == "I"){
//        	   			if(chgValCheck()){
//            				$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
//            					if(obj.btn_ok) {
//            						//setObjStateChg("INI");
//            					} else {
//            						//앞에서 변경된 항목 초기화
//            						item.checked = false;
//            						$("#ckb_" + item.rn).prop("checked", false);
//            						
//            						//선택 row색상 돌림
//            						$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
//            						$("#ckb_" + initObject.rn).closest("tr").addClass("highlight");
//            					}
//            				}, 2);
//            			} else {
//            				//setObjStateChg("INI");
//            			}
//        	   		} else {
        	   			if(!$(this).is(":checked")) $("#ckb_all").prop("checked", false);
        	   			
        	   			var data = $("#gridDiv").jsGrid("option", "data");
        	   			var checkCnt = 0;
        	   			for (var i = 0; i < data.length; i++) {
        	   				if(data[i].checked) {
        	   					checkCnt++;
        	   				}
        	   			}
        	   			
        	   			if(data.length == checkCnt) $("#ckb_all").prop("checked", true);
					
				});
				
				return $result;
			}},
			
			{ name: "stndYm", title:"기준년월", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "wfgCd", title:"그룹내기관코드", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "itcsno20", title:"통합고객번호", css:"cell", type: "text", width: 120, editing: false, align:"left"},
			{ name: "cusRcpNo", title:"고객접수번호", css:"cell", type: "text", width: 120, editing: false, align:"left"},
			{ name: "crno", title:"법인등록번호", css:"cell", type: "text", width: 120, editing: false, align:"left"},
			{ name: "bzno", title:"사업자등록번호", css:"cell", type: "text", width: 120, editing: false, align:"left"},
			{ name: "rppeCadCusEno", title:"대표자카드고객번호", css:"cell", type: "text", width: 120, editing: false, align:"left"},
			{ name: "rppeEncyAcnmNo", title:"대표자암호화실명번호", css:"cell", type: "text", width: 150, editing: false, align:"left"},
			{name : "psnCorpDscd",title : "개인법인구분코드",css : "cell",type : "select",width : 100,editing: false,align : "center",
				items : [ 
					{Name : "개인",Id : "1"}, 
					{Name : "법인",Id : "2"} 
				],
				textField : 'Name',
				valueField : 'Id'
			},
			
			{ name: "cmcmNm", title:"기업체명", css:"cell", type: "text", width: 300, editing: true, align:"left"},
			{ name: "inflCmcmNm", title:"약식기업체명", css:"cell", type: "text", width: 150, editing: true, align:"left"},
			{ name: "rppeFnm", title:"대표자성명", css:"cell", type: "text", width: 140, editing: true, align:"left"},
			{ name: "sicCd", title:"표준산업분류코드", css:"cell", type: "text", width: 100, editing: true, align:"center"},
			{name : "sicCdMultYn",title : "표준산업분류코드다수여부",css : "cell",type : "select",width : 100,editing: false,align : "center",
				items : [ 
					{Name : "다수",Id : "Y"}, 
					{Name : "단일",Id : "N"} 
				],
				textField : 'Name',
				valueField : 'Id'
			},
			
			{ name: "estbDt", title:"설립일자", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "rppeIngtYm", title:"대표자취임년월", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "crinfInqAgrYn", title:"신용정보조회동의여부", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "crinfOfrAgrYn", title:"신용정보제공동의여부", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "rspCd", title:"전송결과", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "trnsDtm", title:"전송일시", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			
			
			  //편집공통	
			  { name: "status", title:"상태", css:"cell", type: "text", width: 0, align:"center", editing: false, itemTemplate:function(value, item) {return $.fn.getGridRowStatusName(value);}},
			  { name: "gridManupulate", title:"그리드조작", css:"cell", type: "control", width: 0, align:"left",editing: false}
			
		]
	});	
	
//	//row rowDoubleClick
//	gridObject.rowDoubleClick(function(args) {
//		
//		console.log("doubleclick NEW_MODI_SC_CD:"+NEW_MODI_SC_CD);
//		//하단항목 초기화
//		if(NEW_MODI_SC_CD != "XLSX"){
//			
//			var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
//			var chkCnt = 0;
//			for(var i=0; i<gridData.length; i++){
//				if(gridData[i].checked) chkCnt++;
//			}
//			if(chkCnt == 0){
//				//chgValCheck == true 변경되었을때
//				if(chgValCheck()){
//					$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
//						if(obj.btn_ok) {
//							initObject = args.item;
//							//setDoubleClickDtlInfo(args);	
//						} else {
//							$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
//							$("#ckb_" + initObject.rn).closest("tr").addClass("highlight");
//						}
//					}, 2);
//				} else {
//					initObject = args.item;
//					//setDoubleClickDtlInfo(args);
//				}
//			}
//		}
//	});
//	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 통합고객번호, 고객접수번호 팝업을 호출한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: rowItem 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.06.09 최초작성
 */
var popupOption = null;
function openPopup() {
	//01 - 조회_통합고객번호, 02-조회_고객접수번호
	  switch(popCd) {
	    case "01":
//alert(popCd);	    	
	    	popupOption = {
	    		url: "/rm/cb/rmcb111p.do",
	    		name: "통합고객번호 조회 팝업",
	    		width: 1000,
	    		height: 434,
	    		itcsno20: $("#inp_itcsno20_1").val()
	    	}
	    	break;
	    case "02":
	    	popupOption = {
	    		url: "/rm/cb/rmcb112p.do",
	    		name: "고객접수번호 조회 팝업",
	    		width: 1000,
	    		height: 434,
	    		cusRcpNo: $("#inp_cusRcpNo_1").val()
	    	}
	    	break;

	    default:
	    	break;
	    
	    	
	  }

	$.fn.openPopup(popupOption);
}

/**
 * @설명: 통합고객번호, 고객접수번호  팝업 콜백
 * @최초작성자: 양슬기
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.06.09 최초작성
 */
function openPopup_callback(resultObj) {
	console.log("[금액유형상세구분코드조회 팝업 콜백] resultObj", resultObj);
//ITCSNO20  	ITCSNO20_NM   CORP_REG_NO   CB_INDS_CD_ID
	if(typeof resultObj === "undefined" || resultObj == null) return;
	

	//alert(popCd);	    	
	  switch(popCd) {
	    case "01":		//통합고객번호
	    	$("#inp_itcsno20_1").val(resultObj.itcsno20);
	    	$("#inp_itcsno20Nm_1").val(resultObj.cmcmNm);
	    	break;

	    case "02":		//고객접수번호
	    	$("#inp_cusRcpNo_1").val(resultObj.cusRcpNo);
	    	$("#inp_cusRcpNoNm_1").val(resultObj.cusRcpNoNm);
	    	break;


	    	
	    	
	    default:
	    	
	    	break;
	    	
	  }
	popCd = "";
	
}



/**
 * @설명: 그리드 전체선택
 * @최초작성자: 양슬기
 * @최초작성일: 2021.04.20
 * @최종변경일: 
 * @매개변수:	boolean
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.04.20 최초작성
 */
function grid_check_all(value) {
	var data = $("#gridDiv").jsGrid("option", "data");
	for (var i = 0; i < data.length; i++) {
			data[i]["checked"] = value;
	}

	$("#gridDiv").jsGrid("option", "data", data);
}

/**
 * @설명: byte length
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @매개변수: value
 * @반환값: num
 * @개정이력: 
 *  양슬기 2021.02.03 최초작성
 */
function strByteLength(value) {
	if(typeof value === "undefined" || value == null || value == "") {
		return 0;
	}
	
	var num = 0;
	for (var i = 0; i < value.length; i++) {
		var c = escape(value.charAt(i));
		if(c.length == 1) { num++; }
		else if(c.indexOf("%u") != -1) { num += 2; }
		else if(c.indexOf("%") != -1) { num += c.length / 3; }
	}
	
	return num;
}

//수정 처리 
function saveCompCreditEval() {

	var gridData = {};
	var editRowClass = {};
	
	editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if ($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	
	gridData = $("#gridDiv").jsGrid("option", "data");
	//var coCdArr = $.fn.getGridCodeItem("RINS_CO_CD");
	//var trtyCdArr = $.fn.getGridCodeItem("RINS_TRTY_CD");
	
	var saveList = [];
	//c,u,d,e 건만 추출 후 저장 처리
	for (var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		if (item.status == "u") {
	        if(item.checked) {
				if(!isValid(i, item)) {
					return false;
	        }
			saveList.push(item);
			
	        }
		} 
		else if (item.status == "c" || item.status == "u" || item.status == "d") {
			saveList.push(item);
		}
//		//전체 딜리트 인서트 처리 
//		saveList.push(item);
		
	}

	///alert(saveList.length);
	if (saveList.length <= 0) {
		$.fn.msgBox("저장할 데이터가 없습니다.");
		return false;
	}
	
	
	$.fn.msgBox("데이터를 저장하시겠습니까?", function(obj) {
		if (obj.btn_ok) {
			$.callAjax({"list" : JSON.stringify(saveList) }, "/rm/cb/rmcb111m/saveCompCreditEvalList.do")
			.done(function(data) {
				if (data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					// 재조회
					selectCompCreditEvalMngList();
				}
			}).fail(function(data) {
				$.fn.msgBox("데이터 저장이 실패했습니다.");
			});
		}
	}, 2);
}


function isValid(rowIndex, item) {

	if($.trim(item.sicCdMultYn) != "Y") {
		$.fn.msgBox((rowIndex + 1) + "행은 표준산업분류코드가 다수가 아니므로, 수정 불가합니다.");
		return false;
	}
	if($.trim(item.stndYm) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 기준년월을 입력하세요.");
		return false;
	}
	if($.trim(item.wfgCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 그룹내기관코드를 입력하세요.");
		return false;
	}
	if($.trim(item.itcsno20) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 통합고객번호를 입력하세요.");
		return false;
	}
	if(strByteLength(item.itcsno20) > 20) {
		$.fn.msgBox((rowIndex + 1) + "행의 통합고객번호는 20자 이내로 입력하세요.");
		return false;
	}
	
	

	
	return true;
}





/**
 * @설명: 기업신용평가를 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025.12.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.12.02 최초작성
 */
function selectMaxCompCreditEvalMngList() {
	var reqParam = {
	};
	
	$.callAjax(reqParam, "/rm/cb/rmcb111m/selectMaxCompCreditEvalList.do").done(function(data) {
		//가장 최근기준년월 세팅 
		var listData = data.list;
		var stndYm = listData[0].stndYm;
		var tmpStndYm = stndYm.substr(0,4)+"-"+stndYm.substr(4,2) ;
		
		$("#inp_basDt").val(tmpStndYm);
		
		NEW_MODI_SC_CD = "U";
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectCompCreditEvalMngList !!");
	});
}



/**
 * @설명: 기업신용평가를 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025.12.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.12.02 최초작성
 */
function selectCompCreditEvalMngList() {
	$("#ckb_all").prop("checked", false);
	
	var reqParam = {};
	reqParam.itcsno20 = $("#inp_itcsno20_1").val();
	reqParam.cusRcpNo = $("#inp_cusRcpNo_1").val();
	var basDt = $("#inp_basDt").val();
	basDt = basDt.replace("-","");
	basDt = basDt.replace("-","");
	reqParam.stndYm = basDt;
	
	//reqParam.crinfInqAgrYn = $("#sbx_crinfInqAgrYn").val();
	//reqParam.crinfOfrAgrYn = $("#sbx_crinfOfrAgrYn").val();
console.log(" reqParam " + JSON.stringify(reqParam));	
	// 데이터 조회
	$.callAjax(reqParam, "/rm/cb/rmcb111m/selectCompCreditEvalList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();

		//그리드 바인딩
		var listData = data.list;

		if(listData.length > 0) $("#ckb_all").prop("disabled", false);

		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });

		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
		NEW_MODI_SC_CD = "U";
		//setObjStateChg("INI");
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectCompCreditEvalMngList !!");
	});
}



/**
 * @설명: 신규생성, 수정 처리한다. - 기업신용평가 요청 한다
 * @최초작성자: 양슬기
 * @최초작성일: 2025.12.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  양슬기 2025.12.02 최초작성
 */
function sendCompCreditEval() {

	//체크된 그리드의 데이터를 리스트로 담아서 평가 처리 한다. >> 자바단에서  for 돌려서 평가 배치 호출 한다.   rmmt114 참조!!!!!!!!!!!!!!!!!
    var list = $("#gridDiv").jsGrid("option", "data");
    var delList = [];
//alert(list.length);    
    var chkCnt = 0;
    for(var i=0; i<list.length; i++) {
        var item = list[i];
        
        if(item.checked) {
        	chkCnt = chkCnt +1;
        }
    }
//alert(chkCnt);    
    
	if( chkCnt > 1 ){
		$.fn.msgBox("1건만 선택 해주시기 바랍니다.");
		grid_check_all(false);
		return false;
    }
    
    for(var i=0; i<list.length; i++) {
        var item = list[i];
        
        if(item.checked) {
        	
        	if($.fn.isEmpty(item.wfgCd)) {
        		$.fn.msgBox("그룹내기관코드를 입력해 주십시오.");
        		return false;
        	}
        	if($.fn.isEmpty(item.itcsno20)) {
        		$.fn.msgBox("통합고객번호를 입력해 주십시오.");
        		return false;
        	}
        	if($.fn.isEmpty(item.cusRcpNo)) {
        		$.fn.msgBox("고객접수번호를 입력해 주십시오.");
        		return false;
        	}
        	
        	delList.push(item);
        }
    }
    
    if( delList.length == 0 ){
		$.fn.msgBox("기업평가할 대상이 없습니다.");
    }
	
	
console.log(JSON.stringify(delList));	
	
	$.fn.msgBox("업체정보 전송 하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({"list": JSON.stringify(delList)}, "/rm/cb/rmcb111m/sendCompCreditEvalInfo.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상처리되었습니다");

					//재조회
					selectCompCreditEvalMngList();
					
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}




/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 양슬기
 * @최초작성일: 2025.12.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.12.02 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}
