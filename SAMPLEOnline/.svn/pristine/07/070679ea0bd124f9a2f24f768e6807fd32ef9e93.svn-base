/**
 * @시스템명: IFRS17
 * @업무명: 그룹신용평가정보 JS
 * @설명: 그룹신용평가정보 JS
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
		selectGroupCreditEvalInfoList();
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
				selectGroupCreditEvalInfoList();
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
			selectGroupCreditEvalInfoList();
			return false;
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.");
			$(this).focus();
		}
	
	});
	
	// 법인등록번호 Enter키 조회
	$("#inp_crno").on("keydown", function(e){
		if(e.which === 13){
			selectGroupCreditEvalInfoList();
		}
	});

	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "그룹신용평가정보.xlsx";

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
		{ name: "basDt", title:"기준일자", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[기준일자] 필수 입력 항목입니다."}]
		},
		{ name: "crno", title:"법인등록번호", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			$result.on("click", function() {
				$(this).select();
			});
			return $result;
			},validate: [{validator:"required", message:"[법인등록번호] 필수 입력 항목입니다."}]
		},
		{ name: "evlDt", title:"최종신용평가등급확정일자", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			$result.on("click", function() {
				$(this).select();
			});
			return $result;
			},validate: [{validator:"required", message:"[최종신용평가등급확정일자] 필수 입력 항목입니다."}]
		},


		{ name: "crevMngNo", title:"신용평가관리번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crevSrno", title:"신용평가일련번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "evlSlalDscd", title:"평가전결구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "evlpeEmpNo", title:"평가직원번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crevStaDt", title:"신용평가시작일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lrvEn", title:"여신감리유무", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lstCegCd", title:"최종신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crdEvlMdlDscd", title:"신용평가모델구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "stdIndsCfcd", title:"신용평가표준산업분류코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "bzcgrCd", title:"업종군코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crevDscd", title:"신용평가구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crinsDscd", title:"신용조사구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "gidGivTgtYn", title:"지침부여대상여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "bdsysCd", title:"사업부제코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "gidGivRsnCd", title:"지침부여사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crevMgpeDscd", title:"신용평가관리자구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "fxRiskCmszCd", title:"외환리스크기업규모코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "wlistTgtEn", title:"watchlist대상유무", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "copFncSpclMngTgtYn", title:"기업금융특별관리대상여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "asqlCfcd", title:"자산건전성분류코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scorEvlDscd", title:"스코어링평가구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "fncstmBasYm", title:"재무제표기준년월", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "estmFncstmBasYr", title:"추정재무제표기준년도", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "estmFncstmSrno", title:"추정재무제표기준일련번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		
		{ name: "salAm", title:"매출금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		

		{ name: "asetTsumAm", title:"자산총계금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},

		{ name: "scorFrcsDshRt", title:"스코어링예상부도율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrAscSc", title:"스코어링평점점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrCegCd", title:"스코어링신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "fnafEsmnMkEno", title:"재무추정작성직원번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "fnafEsmnFrcsDshRt", title:"재무추정예상부도율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "jdgtFrcsDshRt", title:"저지먼트예상부도율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "judgEvlRkCd", title:"저지먼트평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdpsFrcsDshRt", title:"모델제시예상부도율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdpsCegCd", title:"모델제시신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rqpeBrCd", title:"의뢰인영업점코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crevBrcd", title:"신용평가점코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "insuniRcogYn", title:"심사반인정여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inspeEmpNo", title:"심사역직원번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inspePobrCd", title:"심사역소속점코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inspDt", title:"심사일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "srvlAnlsEno", title:"감리분석직원번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lrvDt", title:"여신감리일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lrvCrevGdcd", title:"여신감리신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lrvGdAplEn", title:"여신감리등급적용유무", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lstEvlChgDt10", title:"최종평가변경일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scorLogitFrcsDshRt", title:"스코어링로짓예상부도율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scorLogitRt", title:"스코어링로짓비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "cmszDscd", title:"기업규모구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "stcListedDscd", title:"주식상장구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crinsVldFxdt10", title:"신용조사유효기일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lowptMdlDscd", title:"하부모형구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "cegScfcd", title:"신용평가등급소분류코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdpsFrcsDsh2Rt", title:"모델제시예상부도2율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdps2CegCd", title:"모델제시2신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "judgTotSc", title:"저지먼트총점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "judgAscSc", title:"저지먼트평점점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "adtOpiYn", title:"감사의견여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "coNesYn", title:"업체신설여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "fnstInpNcnt", title:"재무제표입력개수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdpsAscSc", title:"모델제시평점점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdps2AscSc", title:"모델제시평점2점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crevRncd", title:"신용평가사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crevDtlsRncd", title:"신용평가세부사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crevDtlsRsnNm", title:"신용평가세부사유명", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "cbTotSc", title:"CB총점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "cbAscSc", title:"CB평점점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "evlPrcStsDscd", title:"평가처리상태구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inqAgmdCollDt", title:"조회동의서징구일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inqAgmdEno", title:"조회동의서직원번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crevSnpeDscd", title:"신용평가결재자구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "psnCopDscd", title:"개인기업구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "msrAscScre", title:"계량평점점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "msrCrevGdcd", title:"계량신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scorXtRncd", title:"스코어링제외사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scorXtRsnTxt", title:"스코어링제외사유내용", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "copWrhSq", title:"기업가치회차", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "brmrRpapYn", title:"지점장대결여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "evldUtznYn", title:"평가서활용여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "evldIsuNo", title:"평가서발급번호", css:"cell", type: "text",  width: 200, align:"center", editing: false},
		{ name: "evldIsuDt", title:"평가서발급일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "evldRcpMngNo", title:"평가서접수관리번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "eltFnstUsgYn", title:"전자재무제표사용여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "datNuseYn", title:"데이터미사용여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lstDbChgDtm", title:"최종DB변경일시", css:"cell", type: "text",  width: 100, align:"center", editing: false},

		
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
			$.callAjax({"list" : JSON.stringify(saveList)}, "/rm/rc/rmrc413m/saveGroupCreditEvalInfoList.do")
			.done(function(data) {
				if (data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					// 재조회
					selectGroupCreditEvalInfoList();
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
		,"crno":""//법인등록번호
		,"evlDt":""//최종신용평가등급확정일자
		,"crevMngNo":""//신용평가관리번호
		,"crevSrno":""//신용평가일련번호
		,"evlSlalDscd":""//평가전결구분코드
		,"evlpeEmpNo":""//평가직원번호
		,"crevStaDt":""//신용평가시작일자
		,"lrvEn":""//여신감리유무
		,"lstCegCd":""//최종신용평가등급코드
		,"crdEvlMdlDscd":""//신용평가모델구분코드
		,"stdIndsCfcd":""//신용평가표준산업분류코드
		,"bzcgrCd":""//업종군코드
		,"crevDscd":""//신용평가구분코드
		,"crinsDscd":""//신용조사구분코드
		,"gidGivTgtYn":""//지침부여대상여부
		,"bdsysCd":""//사업부제코드
		,"gidGivRsnCd":""//지침부여사유코드
		,"crevMgpeDscd":""//신용평가관리자구분코드
		,"fxRiskCmszCd":""//외환리스크기업규모코드
		,"wlistTgtEn":""//watchlist대상유무
		,"copFncSpclMngTgtYn":""//기업금융특별관리대상여부
		,"asqlCfcd":""//자산건전성분류코드
		,"scorEvlDscd":""//스코어링평가구분코드
		,"fncstmBasYm":""//재무제표기준년월
		,"estmFncstmBasYr":""//추정재무제표기준년도
		,"estmFncstmSrno":""//추정재무제표기준일련번호
		,"salAm":""//매출금액
		,"asetTsumAm":""//자산총계금액
		,"scorFrcsDshRt":""//스코어링예상부도율
		,"scrAscSc":""//스코어링평점점수
		,"scrCegCd":""//스코어링신용평가등급코드
		,"fnafEsmnMkEno":""//재무추정작성직원번호
		,"fnafEsmnFrcsDshRt":""//재무추정예상부도율
		,"jdgtFrcsDshRt":""//저지먼트예상부도율
		,"judgEvlRkCd":""//저지먼트평가등급코드
		,"mdpsFrcsDshRt":""//모델제시예상부도율
		,"mdpsCegCd":""//모델제시신용평가등급코드
		,"rqpeBrCd":""//의뢰인영업점코드
		,"crevBrcd":""//신용평가점코드
		,"insuniRcogYn":""//심사반인정여부
		,"inspeEmpNo":""//심사역직원번호
		,"inspePobrCd":""//심사역소속점코드
		,"inspDt":""//심사일자
		,"srvlAnlsEno":""//감리분석직원번호
		,"lrvDt":""//여신감리일자
		,"lrvCrevGdcd":""//여신감리신용평가등급코드
		,"lrvGdAplEn":""//여신감리등급적용유무
		,"lstEvlChgDt10":""//최종평가변경일자
		,"scorLogitFrcsDshRt":""//스코어링로짓예상부도율
		,"scorLogitRt":""//스코어링로짓비율
		,"cmszDscd":""//기업규모구분코드
		,"stcListedDscd":""//주식상장구분코드
		,"crinsVldFxdt10":""//신용조사유효기일
		,"lowptMdlDscd":""//하부모형구분코드
		,"cegScfcd":""//신용평가등급소분류코드
		,"mdpsFrcsDsh2Rt":""//모델제시예상부도2율
		,"mdps2CegCd":""//모델제시2신용평가등급코드
		,"judgTotSc":""//저지먼트총점수
		,"judgAscSc":""//저지먼트평점점수
		,"adtOpiYn":""//감사의견여부
		,"coNesYn":""//업체신설여부
		,"fnstInpNcnt":""//재무제표입력개수
		,"mdpsAscSc":""//모델제시평점점수
		,"mdps2AscSc":""//모델제시평점2점수
		,"crevRncd":""//신용평가사유코드
		,"crevDtlsRncd":""//신용평가세부사유코드
		,"crevDtlsRsnNm":""//신용평가세부사유명
		,"cbTotSc":""//CB총점수
		,"cbAscSc":""//CB평점점수
		,"evlPrcStsDscd":""//평가처리상태구분코드
		,"inqAgmdCollDt":""//조회동의서징구일자
		,"inqAgmdEno":""//조회동의서직원번호
		,"crevSnpeDscd":""//신용평가결재자구분코드
		,"psnCopDscd":""//개인기업구분코드
		,"msrAscScre":""//계량평점점수
		,"msrCrevGdcd":""//계량신용평가등급코드
		,"scorXtRncd":""//스코어링제외사유코드
		,"scorXtRsnTxt":""//스코어링제외사유내용
		,"copWrhSq":""//기업가치회차
		,"brmrRpapYn":""//지점장대결여부
		,"evldUtznYn":""//평가서활용여부
		,"evldIsuNo":""//평가서발급번호
		,"evldIsuDt":""//평가서발급일자
		,"evldRcpMngNo":""//평가서접수관리번호
		,"eltFnstUsgYn":""//전자재무제표사용여부
		,"datNuseYn":""//데이터미사용여부
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
 * @설명: 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function selectGroupCreditEvalInfoList(){
	var inpBasDt = $("#inp_basDt").val();
	var crno = $("#inp_crno").val();
	
	if ($.fn.isNull(inpBasDt) ) {
		$.fn.msgBox("기준일자를 모두 입력하시기 바랍니다.");
		return false;
	}
	
	//전송 파라미터 세팅 
	var req = {
			"basDt" : inpBasDt, 
			"crno" : crno
	};
	
	//서비스url 
	$.callAjax(req, "/rm/rc/rmrc413m/selectGroupCreditEvalInfoList.do")
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
			console.log("fail to selectGroupCreditEvalInfoList");
	});		
}


