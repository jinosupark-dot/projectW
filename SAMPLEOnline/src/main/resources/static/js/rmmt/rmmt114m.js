/**
 * @시스템명: IFRS17
 * @업무명: 배치관리 JS
 * @설명: 배치관리 JS
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.14
 * @최종변경일:
 * @개정이력:
 *  양슬기 2025.10.14 최초작성
 */


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
    
	var today = new Date();
	var year  = today.getFullYear();
	var month = ("0" + (today.getMonth() + 1)).slice(-2);
	var toYmd = year + "-" + month + "-" + ("0" + today.getDate()).slice(-2);
	var toYm = year + "-" + month ;
	
	$("#inp_basDt1").val(toYm);  //기준년월 YYYY-MM
	$("#inp_basDt2").val(toYmd); //작업기준일자 YYYY_MM_DD
	
	$("#inp_param3").val("data");		//배치 작업구분코드 기본값 세팅 - data
	
	// event 초기화
	initEvent();
	
	// grid 초기화
	initGrid();
	
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
		selectBatchMgntList();
	});
	
	// 마감년월 to 달력
	$("#btn_basDt1").on("click", function(e){
		$("#inp_basDt1").datepicker("show");
	});
	// 마감년월 to 달력
	$("#btn_basDt2").on("click", function(e){
		$("#inp_basDt2").datepicker("show");
	});

	
	
	// 단건 배치수행
	$("#btn_runBatch").on("click", function(e){
		runBatch();
	});

	// 배치수행 - 순차
	$("#btn_runBatch2").on("click", function(e){
		runBatch2();
	});
	
	
	// 마감년월 Enter키 조회
	$("#inp_basDt1").on("keydown", function(e){
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidDate(this.value)) {
				//$(this).val($.fn.monthFormat(this.value, "-"));
				$(this).val($.fn.dateFormat(this.value, "-"));
				selectBatchMgntList();
				return false;
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		
		}
	});
	// 마감년월 Enter키 조회
	$("#inp_basDt2").on("keydown", function(e){
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidDate(this.value)) {
				//$(this).val($.fn.monthFormat(this.value, "-"));
				$(this).val($.fn.dateFormat(this.value, "-"));
				selectBatchMgntList();
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
				selectBatchMgntList();
				return false;
			}
		}
	});

	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "배치관리정보.xlsx";

		var paramObj = {};
		paramObj.id = gridId;
		paramObj.fileName = fileName;         
		paramObj.applyItemTemplate = false;   
		$.fn.exportGridExcel(paramObj);
	});
	
	// 전체 체크 버튼  - 클릭시 체크 안한 로우는 체크 처리. 체크 된 부분은 체크 해제 처리 
	$("#btn_checkAll").on("click", function(e){
		var list = $("#gridDivRins").jsGrid("option", "data");
		for( var i =0; i < list.length; i++  ){
			var item = list[i];
			if( list[i].Checked ){
				list[i].Checked = false;
			}else{
				list[i].Checked = true;
			}
		}
		//그리드 데이터 다시 세팅  
		$("#gridDivRins").jsGrid("loadData", list).done(function() {
		});
		
		//배치 수행리스트 다시 세팅 처리 
        var list = $("#gridDivRins").jsGrid("option", "data");
    	var batchId = $("#inp_batchId").val() ;
    	var stndYmd = $("#inp_basDt1").val() ;
    	var wkBasDt = $("#inp_basDt2").val() ;
    	
    	//작업기준년월 처리 
    	stndYmd = stndYmd.replace("-","");
    	stndYmd = stndYmd.replace("-","");
    	stndYmd = stndYmd.substr(0,6);
    	
    	wkBasDt = wkBasDt.replace("-","");
    	wkBasDt = wkBasDt.replace("-","");
    	
    	var wkDscd  = $("#inp_param3").val() ;  //배치 타입  : (null = all), data, file
    	var basYm = stndYmd;
        
      //alert(list.length);    
          var delList = [];
          var multiBatchCnt = "";
          $("#multiBatch").val("");		//배치 수행리스트 초기화 처리 
          for(var i=0; i<list.length; i++) {
              var item = list[i];
              item.batchId = item.batId;
              item.basYm = stndYmd;
              item.wkBasDt = wkBasDt;
              item.wkDscd = wkDscd;
console.log(" item.Checked " + item.Checked);              
              if(item.Checked == true) {
              	multiBatchCnt += "배치ID : " +  item.batId + ", 배치 설명 : " + item.batExpln + ", 기준년월 : " + item.basYm + ", 작업기준일자 : " + item.wkBasDt + ", 작업구분코드 : " + item.wkDscd + " \n";
              	$("#multiBatch").val(multiBatchCnt);
              }
          }
		
	});
	

	//체크박스 해제 처리 
	$("#btn_uncheckAll").on("click", function(e){
		//그리드 체크 해제 처리 	
		var list = $("#gridDivRins").jsGrid("option", "data");
		for( var i =0; i < list.length; i++  ){
			var item = list[i];
			list[i].Checked = false;
		}
		//그리드 데이터 다시 세팅  
		$("#gridDivRins").jsGrid("loadData", list).done(function() {
		});
        $("#multiBatch").val("");		//배치 수행리스트 초기화 처리 
	
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
		height: 400,
		editing: false,
		sorting: true,
		//paging: true,
		paging: false,  //2025.11.21 이미란 이사님 요청으로 페이징 처리 제거 - 전체 조회 처리 
		//pageSize: 50,
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
		    //{ name: "rowNum", title:"순번", css:"cell", type: "text", width: 40, editing: false, align:"center"},
			//{ name: "stndYmd", title:"기준일자", css:"cell", type: "text", width:60, editing: false, align:"center"},
		   
           { name: "check", title:"선택", width: 20, sorting: false, align:"center", editing: false, itemTemplate:function(value, item) {
               var elem = $("<input>").attr("type", "checkbox").attr("checked", value|| item.Checked).on("change", function() {
                       item.Checked = $(this).is(":checked");
                   });
               //if (item.treeId == "..") elem.attr("disabled", "true");
               //elem.attr("style", "width:5px");
               return elem;
           }},
		   
		   		   
			{ name: "dayMonCdNm", title:"일월구분", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "batId", title:"배치ID", css:"cell", type: "text", width: 90, editing: false, align:"left"},
			{ name: "sendRcvCdNm", title:"송신수신구분", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "batExpln", title:"배치설명", css:"cell", type: "text", width: 250, editing: false, align:"left"},
			{ name: "spId", title:"SPID", css:"cell", type: "text", width: 100, editing: false, align:"left"},
			{ name: "runSeq", title:"실행순서", css:"cell", type: "text", width: 80, editing: false, align:"right"},
			{ name: "strDtm", title:"배치시작시간", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "endDtm", title:"배치종료시간", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "sucsYn", title:"성공여부", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "objCnt", title:"대상건수", css:"cell", type: "text", width: 80, editing: false, align:"right"},
			{ name: "trtCnt", title:"처리건수", css:"cell", type: "text", width: 80, editing: false, align:"right"},
			//{ name: "trtrEno", title:"처리사원", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "trtDtm", title:"처리시간", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "batRsltScCd", title:"배치결과코드", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "batRsltMsgCntnt", title:"배치결과메시지", css:"cell", type: "text", width: 400, editing: false, align:"left"}
			
			
		  
	   ] 
	});	
	
	
	
    // row click
	gridObject.rowClick(function(args) {
    	grdObj = args.item;
        var list = $("#gridDivRins").jsGrid("option", "data");
    	var stndYmd = $("#inp_basDt1").val() ;
    	var wkBasDt = $("#inp_basDt2").val() ;
    	//작업기준년월 처리 
    	stndYmd = stndYmd.replace("-","");
    	stndYmd = stndYmd.replace("-","");
    	stndYmd = stndYmd.substr(0,6);
    	wkBasDt = wkBasDt.replace("-","");
    	wkBasDt = wkBasDt.replace("-","");
    	var wkDscd  = $("#inp_param3").val() ;  //배치 타입  : (null = all), data, file
    	var basYm = stndYmd;
    	var multiBatchCnt = "";
      	$("#multiBatch").val("");
        for(var i=0; i<list.length; i++) {
        	var item = list[i];
            item.batchId = item.batId;
            item.basYm = stndYmd;
            item.wkBasDt = wkBasDt;
            item.wkDscd = wkDscd;
            if(item.Checked == true) {
            	multiBatchCnt += "배치ID : " +  item.batId + ", 배치 설명 : " + item.batExpln + ", 기준년월 : " + item.basYm + ", 작업기준일자 : " + item.wkBasDt + ", 작업구분코드 : " + item.wkDscd + " \n";
              	$("#multiBatch").val(multiBatchCnt);
            }
        }
    });

	
	//그리드 생성
	gridObject.gridCreate();
}

//그리드 체크박스 전체 선택
function grd_check_all(value) {
	var data = $("#gridDivRins").jsGrid("option", "data");
	for (var i = 0; i < data.length; i++) {
			data[i]["checked"] = value;
	}

	$("#gridDivRins").jsGrid("option", "data", data);
}


/**
 * @설명: 단건 배치 수행한다!
 * @최초작성자: 양슬기
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 양슬기 2021.01.21 최초작성
 * 배치실행 팝업을 호출 하도록 처리 - 공통팝업
 */
function runBatch() {
//console.log("  callBatchRunPopup1 called!!! ");	
	$("#multiBatch").val("");	//배치 수행 목록 초기화 처리 
	
	var batchId = $("#inp_batchId").val() ;
	var stndYmd = $("#inp_basDt1").val() ;
	var wkBasDt = $("#inp_basDt2").val() ;
	
	//작업기준년월 처리 
	stndYmd = stndYmd.replace("-","");
	stndYmd = stndYmd.replace("-","");
	stndYmd = stndYmd.substr(0,6);
	
	wkBasDt = wkBasDt.replace("-","");
	wkBasDt = wkBasDt.replace("-","");
	
	var wkDscd  = $("#inp_param3").val() ;  //배치 타입  : (null = all), data, file
	
	basYm = stndYmd;
	wkBasDt = wkBasDt;
	
    var list = $("#gridDivRins").jsGrid("option", "data");
//alert(list.length);    
    var delList = [];
    var multiBatchCnt = "";
    for(var i=0; i<list.length; i++) {
        var item = list[i];
        item.batchId = item.batId;
        item.basYm = stndYmd;
        item.wkBasDt = wkBasDt;
        item.wkDscd = wkDscd;
        
        if(item.Checked) {
            
//다건 배치 수행 항목에 표시 처리 
        	//multiBatch	
        	multiBatchCnt += "배치ID : " +  item.batId + ", 배치 설명 : " + item.batExpln + ", 기준년월 : " + item.basYm + ", 작업기준일자 : " + item.wkBasDt + ", 작업구분코드 : " + item.wkDscd + " \n";
        	$("#multiBatch").val(multiBatchCnt);
        	delList.push(item);
        }
    }
    if(delList.length ==0) {
        $.fn.msgBox("수행할 배치를 체크하세요.");
        return;
    }

    if(delList.length > 1) {
        $.fn.msgBox("수행할 배치를 1건만 선택해주세요.");
        return;
    }

    
    //정렬처리 - runSeq 순서로 정렬 처리 
    delList.sort((a,b) =>{
    	if( a.runSeq < b.runSeq ) return -1;
    	if( a.runSeq > b.runSeq ) return 1;
    	return 0;
    });
    var tmpTxt = $("#multiBatch").val();    
console.log(JSON.stringify(delList));

	$.fn.msgBox(delList.length + "건을 배치수행 하시겠습니까?\n"+tmpTxt, function(obj) {
		if(obj.btn_ok) {
			$.callAjax({"list": JSON.stringify(delList)}, "/rm/mt/rmmt114m/execVrfPrct.do",{async:false}).done(function(data) {
		alert("배치 수행 요청 완료 되었습니다.\n5초후 재조회 합니다.\n 배치건수:" + delList.length);		
			//selectBatchMgntList();
		
			//2초 후에 재조회 처리 
			setTimeout( function(){
				selectBatchMgntList()
			}, 5000 );
		
//console.log("done to callBatchRunPopup1!!!!");
				}).fail(function(data) {
				console.log("fail to callBatchRunPopup1!!!!");
			});
		}
	}, 2);
    
    
	
}






/**
 * @설명: 순차 배치 수행한다 data 만들때 10초 간격 
 * @최초작성자: 양슬기
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 양슬기 2021.01.21 최초작성
 * 배치실행 팝업을 호출 하도록 처리 - 공통팝업
 */
function runBatch2() {
	
//console.log("  callBatchRunPopup1 called!!! ");	
	$("#multiBatch").val("");	//배치 수행 목록 초기화 처리 
	
	var batchId = $("#inp_batchId").val() ;
	var stndYmd = $("#inp_basDt1").val() ;
	var wkBasDt = $("#inp_basDt2").val() ;
	
	//작업기준년월 처리 
	stndYmd = stndYmd.replace("-","");
	stndYmd = stndYmd.replace("-","");
	stndYmd = stndYmd.substr(0,6);
	
	wkBasDt = wkBasDt.replace("-","");
	wkBasDt = wkBasDt.replace("-","");
	
	var wkDscd  = $("#inp_param3").val() ;  //배치 타입  : (null = all), data, file
	
	basYm = stndYmd;
	wkBasDt = wkBasDt;
	
    var list = $("#gridDivRins").jsGrid("option", "data");
//alert(list.length);    
    var delList = [];
    var multiBatchCnt = "";
    for(var i=0; i<list.length; i++) {
        var item = list[i];
        item.batchId = item.batId;
        item.basYm = stndYmd;
        item.wkBasDt = wkBasDt;
        item.wkDscd = wkDscd;
        
        if(item.Checked) {
            
//다건 배치 수행 항목에 표시 처리 
        	//multiBatch	
        	multiBatchCnt += "배치ID : " +  item.batId + ", 배치 설명 : " + item.batExpln + ", 기준년월 : " + item.basYm + ", 작업기준일자 : " + item.wkBasDt + ", 작업구분코드 : " + item.wkDscd + " \n";
        	$("#multiBatch").val(multiBatchCnt);
        	delList.push(item);
        }
    }
    if(delList.length ==0) {
        $.fn.msgBox("수행할 배치를 체크하세요.");
        return;
    }
    
    //정렬처리 - runSeq 순서로 정렬 처리 
    delList.sort((a,b) =>{
    	if( a.runSeq < b.runSeq ) return -1;
    	if( a.runSeq > b.runSeq ) return 1;
    	return 0;
    });
    var tmpTxt = $("#multiBatch").val();    
console.log(JSON.stringify(delList));

	$.fn.msgBox(delList.length + "건을 순차 배치수행 하시겠습니까?\n확인 버튼 클릭시 배치수행 합니다. 해당 시간 동안은 기타 동작 불가 합니다.\n"+tmpTxt, function(obj) {
		if(obj.btn_ok) {
			$.callAjax({"list": JSON.stringify(delList)}, "/rm/mt/rmmt114m/execVrfPrct2.do",{async:false}).done(function(data) {
			//selectBatchMgntList();
		
		alert("배치 수행 요청 완료 되었습니다.\n5초후 재조회 합니다.\n 배치건수:" + delList.length);		
		//selectBatchMgntList();
	
		//3초 후에 재조회 처리 
		setTimeout( function(){
			selectBatchMgntList()
		}, 5000 );
		
		
//console.log("done to callBatchRunPopup1!!!!");
				}).fail(function(data) {
				console.log("fail to callBatchRunPopup1!!!!");
			});
		}
	}, 2);
    
    
	
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
 * @설명: 배치관리 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2025.10.14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2025.10.14 최초작성
 */
function selectBatchMgntList(){
	
	$("#multiBatch").val("");
	
	var batchId  = $("#inp_batchId").val();
	var batchDayMonCd = $("#inp_batchDayMonCd").val();
	var batchSenRcvCd = $("#inp_batchSenRcvCd").val();
	var stndYmd       = $("#inp_basDt1").val();
	stndYmd = stndYmd.replace("-","");
	stndYmd = stndYmd.replace("-","");

	var wkBasDt       = $("#inp_basDt2").val();
	wkBasDt = wkBasDt.replace("-","");
	wkBasDt = wkBasDt.replace("-","");
	
	
	//전송 파라미터 세팅 
	var req = {
			"batchSenRcvCd" : batchSenRcvCd,
			"batchDayMonCd" : batchDayMonCd, 
			"stndYmd" : stndYmd,
			"wkBasDt" : wkBasDt
	};
	
console.log(req);	
	
	//서비스url 
	$.callAjax(req, "/rm/mt/rmmt114m/selectBatchMgntList.do")
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
			console.log("fail to selectBatchMgntList");
	});		
}

