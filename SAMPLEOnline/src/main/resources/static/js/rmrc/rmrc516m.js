/**
 * @시스템명: IFRS17
 * @업무명: RWA시나리오별산출결과 JS
 * @설명: RWA시나리오별산출결과 JS
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
		selectRWAScenRWARsltList();
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
				selectRWAScenRWARsltList();
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
			selectRWAScenRWARsltList();
			return false;
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.");
			$(this).focus();
		}
	
	});
	
	// RWA산출ID Enter키 조회
	$("#inp_rwaCalId").on("keydown", function(e){
		if(e.which === 13){
			selectRWAScenRWARsltList();
		}
	});

	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
//		$.fn.msgBox("엑셀다운로드에 시간이 걸릴 수 있습니다.");
//		$.fn.showLoadingBar();
		
		var gridId = "gridDivRins";
		var fileName = "RWA시나리오별산출결과.xlsx";

		var paramObj = {};
		paramObj.id = gridId;
		paramObj.fileName = fileName;         
		paramObj.applyItemTemplate = false;   
		$.fn.exportGridExcel(paramObj);
//		$.fn.hideLoadingBar();
	
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
		{ name: "wfgCd", title:"그룹내기관코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "basDt", title:"기준일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "wkBsdt", title:"작업기준일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scnrId", title:"시나리오id", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rwaCalId", title:"rwa산출id", css:"cell", type: "text",  width: 200, align:"center", editing: false},
		{ name: "xpsId", title:"익스포져id", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "xpsTpcd", title:"익스포져유형구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "bakXpsTpcd", title:"유동화익스포져유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "xpsPreAfRkCd", title:"익스포져선후순위코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "accDscd", title:"계정구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "accCd", title:"계정코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lnkComCd", title:"연결회사코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "brKdcd", title:"점종류코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "actMngbrCd", title:"계좌관리점코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "actSdt", title:"계좌시작일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "actXpdt", title:"계좌만기일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "affCd", title:"계열코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "aplyIrt", title:"적용이율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "apvrqNo", title:"승인신청번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "dshYn", title:"부도여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "bdsysDscd", title:"사업부제구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "accBasBizHqCd", title:"계정기준사업본부코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "cusBasBizHqCd", title:"고객기준사업본부코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "bdtbActXpdt", title:"영업일기준계좌만기일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "bfxtnActXpdt", title:"연장전계좌만기일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "coRtselDscd", title:"기업소매구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "curCd", title:"통화코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "dfrDcn", title:"연체일수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "dfrtmMcn", title:"거치기간월수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "dshOcrDt", title:"부도발생일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "dshPasDcn", title:"부도경과일수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "dshRsnCd", title:"부도사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtAgrId", title:"한도약정id", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lnOpDscd", title:"여신운용구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lnRpyMtdCd", title:"여신상환방법코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lnRqDscd", title:"여신신청구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lnRqKdcd", title:"여신신청종류코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ptexeYn", title:"분할실행여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mtgtXpsYn", title:"수기익스포져반영여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mtgtXpsTxt", title:"수기익스포져반영내용", css:"cell", type: "text",  width: 400, align:"left", editing: false},
		{ name: "prdCd", title:"상품코드", css:"cell", type: "text",  width: 200, align:"left", editing: false},
		{ name: "scrtItmCd", title:"유가증권종목코드", css:"cell", type: "text",  width: 150, align:"left", editing: false},
		{ name: "stdIndsCfcd", title:"표준산업분류코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "trtuniCd", title:"신탁합동코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrtOistEvlIstCd", title:"유가증권외부평가기관코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},

		{ name: "scrtOistCrdrkTxt", title:"유가증권외신용등급내용", css:"cell", type: "text",  width: 300, align:"left", editing: false},
		{ name: "scrtOistCrdrkEvlDt", title:"유가증권외부신용등급평가일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "stmCrdrkYn", title:"단기신용등급여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrtStdCrdrkCd", title:"유가증권표준신용등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "invpdRwaAplyMtdCd", title:"집합투자증권rwa적용방법코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "invpdBastTpcd", title:"집합투자상품기초자산유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "invpdFndCd", title:"집합투자증권모펀드코드", css:"cell", type: "text",  width: 200, align:"left", editing: false},
		{ name: "invpdRw0EntRt", title:"위험가중치_0%편입비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "invpdRw20EntRt", title:"위험가중치_20%편입비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "invpdRw50EntRt", title:"위험가중치_50%편입비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "invpdRw100EntRt", title:"위험가중치_100%편입비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "invpdRw150EntRt", title:"위험가중치_150%편입비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "invpdRw250EntRt", title:"위험가중치_250%편입비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "invpdRw300EntRt", title:"위험가중치_300%편입비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "invpdRw400EntRt", title:"위험가중치_400%편입비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "invpdRw1250EntRt", title:"위험가중치_1250%편입비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ctpId", title:"거래상대방id", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rsbrItcsno", title:"주민사업자통합고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rscoItcsno", title:"주민법인통합고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "trnpeDscd", title:"거래자구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ctpTpcd", title:"거래상대방유형코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "totAsetAm", title:"총자산금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "totSalAm", title:"총매출금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "bicCd", title:"bic코드", css:"cell", type: "text",  width: 200, align:"left", editing: false},
		{ name: "bzpeCusIdfRefno", title:"사업자고객식별참조번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "coreMktEntpeYn", title:"핵심시장참가자여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "corpCusIdfRefno", title:"법인고객식별참조번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "corpnoYn", title:"법인등록번호여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "natCd", title:"국가코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "hoffLocNatCd", title:"본점소재지국가코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "oecdCrdrkTxt", title:"oecd신용등급내용", css:"cell", type: "text",  width: 300, align:"left", editing: false},
		{ name: "natOistCrdrkEvlDt", title:"국가외부신용등급평가일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "natOistCrdrkTxt", title:"국가외부신용등급내용", css:"cell", type: "text",  width: 300, align:"left", editing: false},
		{ name: "natOistEvlIstCd", title:"국가외부평가기관코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "natStdCrdrkCd", title:"국가표준신용등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ctpOistEvlIstCd", title:"거래상대방외부평가기관코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ctpOistCrdrkTxt", title:"거래상대방외부신용등급내용", css:"cell", type: "text",  width: 300, align:"left", editing: false},
		{ name: "ctpOistCrdrkEvlDt", title:"거래상대방외부신용등급평가일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ctpStdCrdrkCd", title:"거래상대방표준신용등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crdEvlMdlDscd", title:"신용평가모델구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inCrdrkCd", title:"내부신용등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inCrdrkEvlDt", title:"내부신용등급평가일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inCrdrkVldDt", title:"내부신용등급유효일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inCrdrkSrcDatDscd", title:"내부신용등급원천데이터구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inStdCrdrkCd", title:"내부표준신용등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rtselPolId", title:"소매poolid", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rcCusDscd", title:"rc고객구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "impInvsYn", title:"중대한투자여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "tamRlesMggKdcd", title:"전액부동산담보종류코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inRreCn", title:"내부주거용부동산건수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inRreSam", title:"내부주거용부동산합계금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "oistRreCn", title:"외부주거용부동산건수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "oistRreSam", title:"외부주거용부동산합계금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "fulRreCn", title:"주거용담보개수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "fulRreSam", title:"주택담보대출금액합계", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "exexYn", title:"만기연장여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rpyRt", title:"상환금액비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rtselRclsXpsSam", title:"소매재분류익스포져합계금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "totXpsBdspRt", title:"총소매익스포져기준분산비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "asetClasCd", title:"자산클래스코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "bsBl", title:"bs잔액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "notWdrBl", title:"미인출잔액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "lmtAm", title:"한도금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "aclDshptBl", title:"실제부도시점잔액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "lmtVnsRt", title:"한도소진율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "xpsAgrXprYcn", title:"익스포져약정만기년수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "addUseRt", title:"추가사용율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "onacCnvRt", title:"난내전환율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "aplyCcfCd", title:"적용ccf코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "aplyCcfRt", title:"적용ccf비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "bfdnSpcEadAm", title:"특별충당금차감전ead금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "genAlwAm", title:"일반충당금", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "spcAlwAm", title:"특별충당금", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "afdnSpcEadAm", title:"특별충당금차감후ead금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "fncMggAlocAm", title:"금융담보배분금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "rreMggAlocAm", title:"주거용부동산담보배분금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "creMggAlocAm", title:"상업용부동산담보배분금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "etcNfncMggAlocAm", title:"기타비금융담보배분금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "grnAlocAm", title:"보증배분금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "crdAlocAm", title:"신용배분금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "crdMtgAlocAm", title:"신용경감배분금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "eadAm", title:"ead금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "prdGrnDscd", title:"상품보증구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mctrCoBzpeItcsno", title:"주계약업체사업자통합고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mctrCoCorpItcsno", title:"주계약업체법인통합고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mctrCopntCd", title:"주계약업체코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ctpPdSgmnId", title:"거래상대방pd세그먼트id", css:"cell", type: "text",  width: 150, align:"left", editing: false},
		{ name: "ctpDshRt", title:"거래상대방pd율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ctpLgdSgmnId", title:"거래상대방lgd세그먼트id", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ctpLgdRt", title:"거래상대방lgd율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ctpBeelRt", title:"거래상대방beel율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "xpsPdSgmnId", title:"익스포져pd세그먼트id", css:"cell", type: "text",  width: 150, align:"left", editing: false},

		{ name: "xpsDshRt", title:"익스포져pd율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "xpsLgdSgmnId", title:"익스포져lgd세그먼트id", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "xpsLgdRt", title:"익스포져lgd율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "xpsBeelRt", title:"익스포져beel율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "wgtAvgAplyDshRt", title:"가중평균적용pd율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "wgtAvgAplyLgdRt", title:"가중평균적용lgd", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "wgtAvgAplyBeelRt", title:"가중평균적용beel", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "stmPrdTgtYn", title:"단기상품대상여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "xpsSrvivXprYcn", title:"익스포져잔존만기년수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "aplyXpsSrvivXprYcn", title:"적용익스포져잔존만기년수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "emYcn", title:"유효만기년수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rwaCalDscd", title:"rwa산출구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrtStdCrdrkRskWgtRt", title:"유가증권표준신용등급위험가중치비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ctpRskWgtRt", title:"거래상대방위험가중치비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "natRskWgtRt", title:"국가표준신용등급위험가중치비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "oecdCrdrkRskWgtRt", title:"oecd신용등급위험가중치비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inStdCrdrkRskWgtRt", title:"내부표준신용등급위험가중치비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "aplyOistCrdrkDscd", title:"적용외부신용등급구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "bkAciprkTxt", title:"은행실사등급내용", css:"cell", type: "text",  width: 300, align:"left", editing: false},
		{ name: "inTrnCtpYn", title:"내부거래상대방여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "xpsRskWgtRt", title:"익스포져위험가중치비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "wgtAvgFcstLosAm", title:"가중평균예상손실금액", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "wgtAvgAplyRskWgtRt", title:"가중평균적용위험가중치비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "aplyRskWgtRtDscd", title:"적용위험가중치구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "dshDfrRwaCalDscd", title:"부도연체rwa산출구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "eadAdjRt", title:"ead조정율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "adjCoefRt", title:"조정계수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "xpsBasRwastAm", title:"익스포져기준위험가중자산금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "rwastAm", title:"위험가중자산금액", css:"cell", type: "text", width: 120, editing: false, align:"right",
			itemTemplate:function(value, item) {
				return $.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString());
			}
		},
		{ name: "rptAsetClasCd", title:"보고서자산클래스코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "hdwRwaCalcDscd", title:"수기rwa산출구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rwaCalcTxt", title:"rwa산출내용", css:"cell", type: "text",  width: 300, align:"left", editing: false},
		
		{ name: "lstOprNo", title:"최종조작자번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lstOpDtm", title:"최종조작일시", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lstDbChgId", title:"최종db변경id", css:"cell", type: "text",  width: 250, align:"left", editing: false},
		{ name: "lstDbChgDtm", title:"최종db변경일시", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "relnYn", title:"대환여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "stdMtdAplyDscd", title:"표준방법적용구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rtselCurDcrdYn", title:"소매통화불일치여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "bkCtpYn", title:"은행거래상대방여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		
		
		
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
			$.callAjax({"list" : JSON.stringify(saveList)}, "/rm/rc/rmrc516m/saveRWAScenRWARsltList.do")
			.done(function(data) {
				if (data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					// 재조회
					selectRWAScenRWARsltList();
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
		,"oistCrdrkTxt":""//외부신용등급내
		,"oistEvlIstCd":""//외부평가기관코
		,"stmCrdrkYn":""//단기신용등급여
		,"aplyEdt":""//적용종료일
		,"stdCrdrkCd":""//표준신용등급코
		,"sortRkCn":""//정렬순위수
		,"aplySdt":""//적용시작일
		,"lstDbChgDtm":""//최종DB변경일시

			
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
 * @최초작성자: 심민정
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  심민정 2021.02.09 최초작성
 */
function selectRWAScenRWARsltList(){

	var inpBasDt = $("#inp_basDt").val();
	var rwaCalId = $("#inp_rwaCalId").val();
	if ($.fn.isNull(inpBasDt) ) {
		$.fn.msgBox("기준일자를 모두 입력하시기 바랍니다.");
		return false;
	}
	//전송 파라미터 세팅 
	var req = {
			"basDt" : inpBasDt,
			"rwaCalId" : rwaCalId
	};
	
	//서비스url 
	$.callAjax(req, "/rm/rc/rmrc516m/selectRWAScenRWARsltList.do")
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
			console.log("fail to selectRWAScenRWARsltList");
	});		
}


