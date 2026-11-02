/**
 * @시스템명: IFRS17
 * @업무명: 실시간평가이력 JS
 * @설명: 실시간평가이력 JS
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
	
	var today = new Date();
	var year  = today.getFullYear();
	var month = ("0" + (today.getMonth() + 1)).slice(-2);
	var toYmd = year + "-" + month + "-" + ("0" + today.getDate()).slice(-2);
	//$("#inp_basDt").val(toYmd);

	//월초 세팅
	var toYmd2 = year + "-" + month + "-01" ;
	$("#inp_basDt").val(toYmd2);

	
	$("#inp_basDt2").val(toYmd);
	
	
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
		selectRealTimeEvalHistList();
	});

	// 기준일자 달력
	$("#btn_basDt").on("click", function(e){
		$("#inp_basDt").datepicker("show");
	});

	// 마감년월 Enter키 조회
	$("#inp_basDt").on("keydown", function(e){
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidDate(this.value)) {
				$(this).val($.fn.dateFormat(this.value, ""));
				selectRealTimeEvalHistList();
				return false;
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		
		}
	});


	// 기준일자 달력
	$("#btn_basDt2").on("click", function(e){
		$("#inp_basDt2").datepicker("show");
	});

	// 마감년월 Enter키 조회
	$("#inp_basDt2").on("keydown", function(e){
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidDate(this.value)) {
				$(this).val($.fn.dateFormat(this.value, ""));
				selectRealTimeEvalHistList();
				return false;
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		
		}
	});

	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "실시간평가이력.xlsx";

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
			insertItem : function(item) {}	
			
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
		{ name: "itcsno20", title:"동일인식별번호", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				$result.on("click", function() {
					$(this).select();
				});
				return $result;
			},validate: [{validator:"required", message:"[동일인식별번호] 필수 입력 항목입니다."}]
		},
		{ name: "evlDt20", title:"평가일", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			$result.on("click", function() {
				$(this).select();
			});
			return $result;
			},validate: [{validator:"required", message:"[평가일] 필수 입력 항목입니다."}]
		},
		{ name: "evlpeEmpNo", title:"평가자직원번호", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			$result.on("click", function() {
				$(this).select();
			});
			return $result;
			},validate: [{validator:"required", message:"[평가자직원번호] 필수 입력 항목입니다."}]
		},
		{ name: "crevMngNo", title:"순번(신용평가관리번호)", css:"cell", type: "text", width: 125, editing: false, align:"center", editTemplate:function(value,item) {
			var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
			$result.on("click", function() {
				$(this).select();
			});
			return $result;
			},validate: [{validator:"required", message:"[순번(신용평가관리번호)] 필수 입력 항목입니다."}]
		},

		{ name: "delYn", title:"삭제여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lnrvwYn", title:"여신감리유무", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rkFixYn", title:"등급확정유무", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lstCegCd", title:"최종신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lstCegFixDt", title:"최종신용평가등급확정일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "cmdlDscd", title:"신용평가모델구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lowptMdlDscd", title:"하부모형구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "stdIndsCfcd", title:"표준산업분류코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "bzgrCd", title:"업종군코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crinsDscd", title:"신용조사구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "stcListedDscd", title:"주식상장구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "cosizDscd", title:"기업규모구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "gidGivRsnCd", title:"지침부여사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crdEvlMgrDscd", title:"신용평가관리자구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "fxRskCosizCd", title:"외환리스크기업규모코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "wlistTgtYn", title:"WATCHLIST대상유무", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "cfgSpcMngTgtYn", title:"기업금융단특별관리대상여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "asqltCfcd", title:"자산건전성분류코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrEvlDscd", title:"스코어링평가구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "fncstmBasYm", title:"재무제표기준년월", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "estmFncstmBasYr", title:"추정재무제표기준년도", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "estmFncstmSrno", title:"추정재무제표기준일련번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrFcstDshRt", title:"스코어링예상부도율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrLogitRt", title:"스코어링로짓비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "sclgFcstDshRt", title:"스코어링로짓예상부도율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrAscSc", title:"스코어링평점점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrCegCd", title:"스코어링신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "fempeEmpNo", title:"재무추정작성자직원번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "fncEstmFcdshRt", title:"재무추정예상부도율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "fncPstEvlRkCd", title:"재무추정모델제시신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "judgFcstDshRt", title:"저지먼트예상부도율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "judgEvlRkCd", title:"저지먼트평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdpsFcstDshRt", title:"모델제시예상부도율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdpsCegCd", title:"모델제시신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "evlBrCd", title:"평가점코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "insuniRcogYn", title:"심사반인정여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inspeEmpNo", title:"심사역직원번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inspePobrCd", title:"심사역소속점코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "inspDt8", title:"심사일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rvwAnlypeEmp_no", title:"감리분석자직원번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lnrvwDt", title:"여신감리일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lnrvwCegCd", title:"여신감리신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lnrvwRkAplyYn", title:"여신감리등급적용유무", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lstEvlChgDt", title:"최종평가변경일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crinsVldFxdt", title:"신용조사유효기일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "cegScfcd", title:"신용평가등급소분류코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdps2FcstDshRt", title:"모델제시2예상부도율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdps2CegCd", title:"모델제시2신용평가등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "judgTotSc", title:"저지먼트총점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "judgAscSc", title:"저지먼트평점점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "audOpiYn", title:"감사의견여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "nestYn", title:"신설여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		
		{ name: "fncstmInpCn", title:"재무제표입력개수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdpsAscSc", title:"모델제시평점점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "mdps2AscSc", title:"모델제시2평점점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crdEvlRsnCd", title:"신용평가사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crdEvlDtlRsnCd", title:"신용평가세부사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crdEvlDtlRsnNm", title:"신용평가세부사유명", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "judgEvlOpiTxt", title:"저지먼트평가의견내용", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "cbTotSc", title:"CB총점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "cbAscSc", title:"CB평점점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "evlPrcStsDscd", title:"평가처리상태구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "crdEvlApvpeDscd", title:"신용평가결재자구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "psnCoDscd", title:"개인기업구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "msrAscSc", title:"계량평점점수", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "msrRkCd", title:"계량등급코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrXcpRsnCd", title:"스코어링제외사유코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "scrXcpRsnTxt", title:"스코어링제외사유내용", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "evldocUsgYn", title:"평가서활용여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "isuNo", title:"발급번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "evldocIsuDt", title:"평가서발급일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "docRcpMngNo", title:"서류접수관리번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rpspeTotSc", title:"대표자총점수(CB총점수)", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "rpspeAscSc", title:"대표자평점점수(CB평점점수)", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj1Yn", title:"제한사항1여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj2Yn", title:"제한사항2여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj3Yn", title:"제한사항3여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj4Yn", title:"제한사항4여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj5Yn", title:"제한사항5여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj6Yn", title:"제한사항6여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj7Yn", title:"제한사항7여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj8Yn", title:"제한사항8여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj9Yn", title:"제한사항9여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj10Yn", title:"제한사항10여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj11Yn", title:"제한사항11여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj12Yn", title:"제한사항12여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj13Yn", title:"제한사항13여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lmtSbj14Yn", title:"제한사항14여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "asetTsumAm", title:"자산총계금액", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ntfndAm", title:"자기자본금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		{ name: "piCapAm", title:"납입자본금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		{ name: "salAm", title:"매출금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		{ name: "ctmNtpftAm", title:"당기순이익금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		{ name: "bizPftAm", title:"영업이익금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		{ name: "dbtTsumAm", title:"부채총계금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
		{ name: "dbtRt", title:"부채비율", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "estbDt", title:"설립일", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ingtYm", title:"대표자취임년월", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "lstLmtAm", title:"최종한도금액", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "gdBrrYn", title:"등급차용여부", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ownsWfgCd", title:"소유권그룹내기관코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ownsCrevMngNo", title:"소유권신용평가관리번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "ownsLstCrevGdCrtnDt", title:"소유권최종신용평가등급확정일자", css:"cell", type: "text",  width: 100, align:"center", editing: false},
		{ name: "adtOpiCd", title:"감사의견코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},

	   ] 
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}





/**
 * @설명: 실시간평가이력 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function selectRealTimeEvalHistList(){

	var evlDt20St = $("#inp_basDt").val();
	evlDt20St = evlDt20St.replace('-','');
	evlDt20St = evlDt20St.replace('-','');

	var evlDt20Ed = $("#inp_basDt2").val();
	evlDt20Ed = evlDt20Ed.replace('-','');
	evlDt20Ed = evlDt20Ed.replace('-','');

	
	//전송 파라미터 세팅 
	var req = {
			"evlDt20St" : evlDt20St,
			"evlDt20Ed" : evlDt20Ed
	};
	
	//서비스url 
	$.callAjax(req, "/rm/cb/rmcb411m/selectRealTimeEvalHistList.do")
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
			console.log("fail to selectRealTimeEvalHistList");
	});		
}



