/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-분개규칙 관리
 * @설명: 분개규칙 화면
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.25
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.01.25 최초작성
 *  황석현 2021.04.28 2차 표준화
 *  황석현 2021.06.15 3차 표준화
 *  황석현 2021.09.30 reqParam 비밀번호 설정 추가(delCanJoulRl 함수)
 *  황석현 2021.11.22 check->dbclick 오류 수정
 *  황석현 2021.12.03 콤보박스 세팅 삭제
 *  황석현 2021.12.14 chgValCheck() 수정
 */


//전역변수 선언
var NEW_MODI_SC_CD = "U";				//신규,수정,삭제 저장 체크
var initObject = null;					//수정전 원데이터
var popUpscCd = "";						//팝업창 구분(계정과목, 환입계정과목)
var perBtnId = ["btn_excel_upload", "btn_save", "btn_delete", "btn_newReg", "btn_init", "ibx_pswd", "txt_pswd"];

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
	
	$("#btn_excel_save").hide(); //엑셀저장	
	$("#btn_cancel").hide(); //취소
	$("#btn_delete_cancel").hide(); //삭제취소
	
	$("#table_detail").find("select,input,button").attr("disabled", true);
	
	$("#sbx_deltYn").val("N"); //삭제여부 초기화
	
	//공통코드 및 경리계정색인코드 콤보박스 
	initCommCd();
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	//경리업무분류코드 초기화
	selectItmCode("ACCT_CD", "sbx_acctCd", "");
	
	$("#sbx_acctCd").focus();

});

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.25
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.01.25 최초작성
 */
function initEvent() {
	//엑셀다운로드
	$("#btn_excel_download").on("click", function(e){
		var fileName = "재무회계_분개규칙관리" + ".xlsx";
		$.fn.exportGridExcel({
			id: 'gridDiv', 
			fileName: fileName
		});
	});
	
	//엑셀로드
	$("#btn_excel_upload").on("click", function(e){
		var paramObj = {};
		paramObj.id = "gridDiv";					//그리드 ID
		paramObj.callbackFn = function(data) {		//그리드 바인딩 후 후처리 함수
			if(typeof data.list !== "undefined" && data.list.length > 0) {
				if(data.result == "1") {
					$.fn.msgBox(data.list.length + "건 정상적으로 로드하였습니다.");
					$("#btn_save").hide();
					$("#btn_delete").hide();
					$("#btn_delete_cancel").hide();
					$("#btn_newReg").hide();
					$("#btn_init").hide();
					$("#btn_cancel").show();
					$("#btn_excel_save").show();
					NEW_MODI_SC_CD = "XLSX";
				}
			}
		};
		$.fn.loadGridExcel(paramObj);
	});
	
	//엑셀저장
	$("#btn_excel_save").on("click", function(e){
		saveJoulRlExcel();
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		if(chgValCheck()){
			$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					selectJoulRlList();
				}
			}, 2);
		} else {
			selectJoulRlList();
		}
	});
	
	//저장
	$("#btn_save").on("click", function(e){
		if(NEW_MODI_SC_CD != "I") NEW_MODI_SC_CD = "U"; 
		saveJoulRl();
	});
	
	//단건 삭제
	$("#btn_delete").on("click", function(e){
		// 더블클릭으로 선택된 항목 여부
		if(!$.fn.isEmpty(initObject)){
			delJoulRl();
		} else {
			delJoulRlList();
		}
	});
	
	//신규등록
	$("#btn_newReg").on("click", function(e){
		$(".sub_title h4").text("분개규칙 신규입력");
		if(chgValCheck()){
			$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
					setBtnAction("I");
				}
			}, 2);
		} else {
			$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
			setBtnAction("I");
		}
		$("#ckb_all").prop("checked", false);
		grid_check_all(false);
	});
	
	//취소
	$("#btn_cancel").on("click", function(e){
		$(".sub_title h4").text("분개규칙 수정/삭제");
		if(newChgValCheck()) {
			$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					setBtnAction("U");
				}
			}, 2);
		} else {
			setBtnAction("U");
		}
	});
	
	//삭제취소
	$("#btn_delete_cancel").on("click", function(e){
		// 더블클릭으로 선택된 항목 여부
		if(!$.fn.isEmpty(initObject)){
			delCanJoulRl();
		} else {
			delCanJoulRlList();
		}
	});
	
	//초기화
	$("#btn_init").on("click", function(e){
		if(chgValCheck()){
			$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					fninit("U");
				}
			}, 2);
		} else {
			fninit("U");
		}
	});
	
	// 회계코드 change
	$("#sbx_acctCd").on("change", function(e){
		selectItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCd", $(this).val());
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "");
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "");
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", "");
//		selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", "");
	});
		
	//업무분류 change
	$("#sbx_acntgBusnClsfCd").on("change", function(e){
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", $(this).val());
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "");
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", $(this).val());
//		selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", "");
	});
	
 	//거래유형 change
	$("#sbx_acntgDlTypCd").on("change", function(e){
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", $(this).val());
	});
	
	//금액유형 change
//	$("#sbx_amtTypScCd").on("change", function(e){
//		selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", $(this).val());
//	});
	
	// 하단 회계코드 change
	$("#sbx_acctCdDtl").on("change", function(e){
		setItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCdDtl", "");
	});
	
	//하단 업무분류 change
	$("#sbx_acntgBusnClsfCdDtl").on("change", function(e){
		setItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCdDtl", "MAIN");
		setItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCdDtl", "MAIN");
		setItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCdDtl", "MAIN");
		setItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCdDtl", "MAIN");
	});
	
	//하단 거래유형 change
	$("#sbx_acntgDlTypCdDtl").on("change", function(e){
		setItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCdDtl", "");
		setItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCdDtl", "");
		setItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCdDtl", "");
	});
	
	//하단 금액구분 change
	$("#sbx_acntgAmtScCdDtl").on("change", function(e){
		setItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCdDtl", "");
		setItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCdDtl", "");
		setItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCdDtl", "");
	});
	
	//하단 금액유형 change
	$("#sbx_amtTypScCdDtl").on("change", function(e){
		setItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCdDtl", "");
		setItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCdDtl", "");
		setItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCdDtl", "");
	});

	//하단 금액유형상세 change
	$("#sbx_amtTypDtlScCdDtl").on("change", function(e){
		setItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCdDtl", "");
		setItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCdDtl", "");
		setItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCdDtl", "");
	});
	
	//계정과목코드 팝업창 조회조건
	$("#btn_acitCdSearchTop").on("click", function(e){
		openPopupAcitCd("1");
	});
	
	//계정과목코드 조회조건
	$("#inp_acitmCdTop").on("focusout", function(e){
		console.log($(this).val());
		if($(this).val().length == 0 || $(this).val().length < 10) {
			$("#inp_acitmCdNmTop").val("");
		}else{
			//10자리 경우 조회하여 계정과목명에 셋팅한다.
			selectAcitmNm($(this).val());
		}
	});

	//계정과목코드
	$("#btn_acitCdSearch").on("click", function(e){
		openPopupAcitCd("2");
	});
	
	//계정과목코드
	$("#btn_recptAcitmCdSearch").on("click", function(e){
		openPopupAcitCd("3");
	});
	
	//금액유형상세구분코드 팝업창 호출
	$("#btn_amtTypDtlScCdSearch").on("click", function(e){
		openPopup();
	});
	
	//금액유형상세구분코드 조회조건
	$("#inp_amtTypDtlScCd").on("focusout", function(e){
		if($(this).val().length == 0) {
			$("#inp_amtTypDtlScCdNm").val("");
		} else {
			selectAmtTypDtlScCdNm($(this).val(), "focusout");
		}
	}).on("keypress", function(e){
		if(e.keyCode == 13){
			selectAmtTypDtlScCdNm($(this).val(), "keypress");
			return false;
		}
	});
	
	//조회조건 엔터키 조회
	$("#sbx_acctCd, #sbx_acntgBusnClsfCd, #sbx_acntgDlTypCd, #sbx_acntgAmtScCd, #sbx_amtTypScCd, #inp_acitmCdTop, #sbx_deltYn").on("keypress", function(e) {
		if(e.keyCode == 13) {
			$("#btn_search").click();
			return false;
		}
	});
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.25
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.25 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 350,
		editing: false,
		sorting: true,
		paging: true,
		confirmDeleting: false,
		pageSize: 10,
		fields : [
			{ name: "check", title: "선택", width: 30, sorting: false, editing: false, align:"center", headerTemplate:function() {
				return $("<input>").attr("id", "ckb_all").attr("type", "checkbox").on("change", function() {
					if($("#sbx_deltYn").val() != "-전체-") {
						if((this.checked && !$.fn.isEmpty(initObject)) || NEW_MODI_SC_CD == "I"){
							if(chgValCheck()){
								$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
									if(obj.btn_ok) {
				        	   			$("#ckb_all").prop("checked", true);
										setBtnAction("U");
										grid_check_all(true);
									} else {
										$("#ckb_all").prop("checked", false);
									}
								}, 2);
							} else {
								$("#ckb_all").prop("checked", true);
								setBtnAction("U");
		        	   			grid_check_all(this.checked);
							}
						} else {
							grid_check_all(this.checked);
						}
					} else {
						$("#ckb_all").prop("checked", false);
					}
				});
			}, itemTemplate:function(value, item) {
					
				var $result = $("<input>").attr("type", "checkbox").attr("id", "ckb_" + item.rn).attr("checked", value || item.checked).on("change", function() {
					item.checked = $(this).is(":checked");
					//더블클릭된 항목이 있는데 선택했을때 선택 불가하게
					if( ($(this).is(":checked") && !$.fn.isEmpty(initObject)) || NEW_MODI_SC_CD == "I"){
						if(chgValCheck()){
            				$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
            					if(obj.btn_ok) {
            						setBtnAction("U");
            					} else {
            						//앞에서 변경된 항목 초기화
            						item.checked = false;
            						$("#ckb_" + item.rn).prop("checked", false);
            						
            						//선택 row색상 돌림
            						$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
            						$("#ckb_" + initObject.rn).closest("tr").addClass("highlight");
            					}
            				}, 2);
            			} else {
            				setBtnAction("U");
            			}
        	   		} else {
        	   			item.checked = $(this).is(":checked");
        	   			
        	   			var data = $("#gridDiv").jsGrid("option", "data");
        	   			var checkCnt = 0;
        	   			for (var i = 0; i < data.length; i++) {
        	   				if(data[i].checked) {
        	   					checkCnt++;
        	   				}
        	   			}
        	   			if(data.length == checkCnt) $("#ckb_all").prop("checked", true);
        	   		}
					
				});
				
				// 삭제여부 -전체-인 경우 disabled 
				if($("#sbx_deltYn").val() == "-전체-") {
					$result.attr("disabled", true);
				}
				return $result;
			}},
			{ name: "acctCd", title:"회계코드", css:"cell", type: "text", width: 70, editing: false, align:"center"},
			{ name: "acctCdNm", title:"회계코드명", css:"cell", type: "text", width: 75, editing: false, align:"left"},
			{ name: "acntgBusnClsfCd", title:"업무분류", css:"cell", type: "text", width: 70, editing: false, align:"center"},
			{ name: "acntgBusnClsfCdNm", title:"업무분류명", css:"cell", type: "text", width: 95, editing: false, align:"left"},
			{ name: "acntgDlTypCd", title:"거래유형", css:"cell", type: "text", width: 70, editing: false, align:"center"},
			{ name: "acntgDlTypCdNm", title:"거래유형명", css:"cell", type: "text", width: 180, editing: false, align:"left"},
			{ name: "acntgAmtScCd", title:"금액구분", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "acntgAmtScCdNm", title:"금액구분명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "amtTypScCd", title:"금액유형구분", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "amtTypScCdNm", title:"금액유형구분명", css:"cell", type: "text", width: 150, editing: false, align:"left"},
			{ name: "amtTypDtlScCd", title:"금액유형구분상세", css:"cell", type: "text", width: 130, editing: false, align:"center"},
			{ name: "amtTypDtlScCdNm", title:"금액유형구분상세명", css:"cell", type: "text", width: 300, editing: false, align:"left"},
			{ name: "joulSno", title:"번호", css:"cell", type: "number", width: 70, editing: false, align:"center"},
			{ name: "crdrScCd", title:"차대", css:"cell", type: "text", width: 50, editing: false, align:"center"},
			{ name: "crdrScCdNm", title:"차대명", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "acitmCd", title:"계정과목", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "acntNm", title:"계정과목명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "acntInxCd", title:"계정Index코드", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "acntInxCdNm", title:"계정Index", css:"cell", type: "text", width: 150, editing: false, align:"left"},
			{ name: "recptYn", title:"환입여부", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "recptAcitmCd", title:"환입계정과목", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "recptAcitmCdNm", title:"환입계정과목명", css:"cell", type: "text", width: 200, editing: false, align:"left"},			
			{ name: "ecqDcdYn", title:"당분기말확정", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "calcSgnCdNm", title:"부호", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "avlBgnYmd", title:"유효개시일자", css:"cell", type: "text", width: 100, editing: false, align:"center",
				itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");
				}
			},
			{ name: "avlEndYmd", title:"유효종료일자", css:"cell", type: "text", width: 100, editing: false, align:"center",
				itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");
				}
			},
			{ name: "deltYn", title:"삭제여부", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "trtDtm", title:"처리일시", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "rn", title:"RN", css:"cell", type: "text", width: 30, editing: false, align:"center", visible: false}
		]
	});	
	
	//row rowDoubleClick
	gridObject.rowDoubleClick(function(args) {
		//하단항목 초기화
		if(NEW_MODI_SC_CD != "XLSX"){
			
			var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
			var chkCnt = 0;
			for(var i=0; i<gridData.length; i++){
				if(gridData[i].checked) chkCnt++;
			}
			if(chkCnt == 0){
				//chgValCheck == true 변경되었을때
				if(chgValCheck()){
					$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
						if(obj.btn_ok) {
							initObject = args.item;
							setDoubleClickDtlInfo(args);
						} else {
							$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
							$("#ckb_" + initObject.rn).closest("tr").addClass("highlight");
						}
					}, 2);
				} else {
					initObject = args.item;
					setDoubleClickDtlInfo(args);
				}
			}
		}
	});
	
	//그리드 생성
	gridObject.gridCreate();
	
}

/**
 * @설명: 금액유형상세구분코드 팝업을 호출한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: rowItem 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
var popupOption = null;
function openPopup() {

	popupOption = {
		url: "/fi/jr/fijr113p.do",
		name: "금액유형상세구분코드 조회 팝업",
		width: 1000,
		height: 434,
		acctCd: $("#sbx_acctCd").val(),
		acntgBusnClsfCd: $("#sbx_acntgBusnClsfCd").val(),
		amtTypScCd: $("#sbx_amtTypScCd").val() == "-전체-" ? "" : $("#sbx_amtTypScCd").val(),
		amtTypDtlScCd: $("#inp_amtTypDtlScCd").val()
	}

	$.fn.openPopup(popupOption);
}

/**
 * @설명: 금액유형상세구분코드조회 팝업 콜백
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
function openPopup_callback(resultObj) {
	console.log("[금액유형상세구분코드조회 팝업 콜백] resultObj", resultObj);
	
	if(typeof resultObj === "undefined" || resultObj == null) return;
	
	$("#sbx_acctCd").val(resultObj.acctCd);
	$("#sbx_acctCd").change();
	$("#sbx_acntgBusnClsfCd").val(resultObj.acntgBusnClsfCd);
	$("#sbx_acntgBusnClsfCd").change();
	$("#sbx_amtTypScCd").val(resultObj.amtTypScCd);
	$("#inp_amtTypDtlScCd").val(resultObj.amtTypDtlScCd);
	$("#inp_amtTypDtlScCdNm").val(resultObj.amtTypDtlScCdNm);
	
	$("#inp_amtTypDtlScCd").focus();
	
}

/**
 * @설명: 금액유형상세구분코드명 조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.06.09
 * @최종변경일: 
 * @매개변수: val 금액유형상세구분코드
 *          scCd 이벤트코드
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.06.09 최초작성
 */
function selectAmtTypDtlScCdNm(val, scCd) {
	var reqParam = {};
	reqParam.codeId = "AMT_TYP_DTL_SC_CD";
	reqParam.val = $("#inp_amtTypDtlScCd").val();
	
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr113m/selectItmCdNm.do")
	.done(function(data) {

		$("#inp_amtTypDtlScCd").val(val);
		$("#inp_amtTypDtlScCdNm").val(data.codeNm);
		
		if(scCd == "keypress") $("#btn_search").click();
		
	}).fail(function(data) {
		console.log("fail to selectAmtTypDtlScCdNm!!!!");
	});
}

/**
 * @설명: 그리드 전체선택
 * @최초작성자: 황석현
 * @최초작성일: 2021.04.20
 * @최종변경일: 
 * @매개변수:	boolean
 * @반환값: 
 * @개정이력: 
 */
function grid_check_all(value) {
	var data = $("#gridDiv").jsGrid("option", "data");
	for (var i = 0; i < data.length; i++) {
			data[i]["checked"] = value;
	}

	$("#gridDiv").jsGrid("option", "data", data);
}

/**
 * @설명: 선택변경전 변경항목 체크
 * @최초작성자: 황석현
 * @최초작성일: 2021.05.06
 * @최종변경일: 
 * @매개변수:	
 * @반환값: 
 * @개정이력: 
 */
function chgValCheck(){
	let rtnValChk = false;
	let chgValChk = "N";

	if(!$.fn.isEmpty(initObject)){
		//화면정보 json
		let bgnYmd = $("#inp_avlBgnYmd").val().trim();
		let endYmd = $("#inp_avlEndYmd").val().trim();
		let paramObj = {
				crdrScCd		: $("#sbx_crdrScCdDtl").val(),
				acitmCd			: $("#inp_acitmCd").val(),
				acntInxCd		: $("#sbx_acntInxCdDtl").val(),
				recptYn			: $("#sbx_recptYnDtl").val(),
				recptAcitmCd	: $("#inp_recptAcitmCd").val(),
				ecqDcdYn		: $("#sbx_ecqDcdYnDtl").val(),
				calcSgnCd		: $("#sbx_calcSgnCdDtl").val(),
				avlBgnYmd		: (bgnYmd != "") ? $.replaceAll(bgnYmd, '-','') : bgnYmd,
				avlEndYmd		: (endYmd != "") ? $.replaceAll(endYmd, '-','') : endYmd,
				deltYn			: $("#sbx_deltYnDtl").val()		
			};
		
		//원본 json
		let orgParam = {
				crdrScCd		: $.fn.isEmpty(initObject.crdrScCd) ? "" : initObject.crdrScCd,
				acitmCd			: $.fn.isEmpty(initObject.acitmCd) ? "" : initObject.acitmCd,
				acntInxCd		: $.fn.isEmpty(initObject.acntInxCd) ? "" : initObject.acntInxCd,
				recptYn			: $.fn.isEmpty(initObject.recptYn) ? "" : initObject.recptYn,
				recptAcitmCd	: $.fn.isEmpty(initObject.recptAcitmCd) ? "" : initObject.recptAcitmCd,
				ecqDcdYn		: $.fn.isEmpty(initObject.ecqDcdYn) ? "" : initObject.ecqDcdYn,
				calcSgnCd		: $.fn.isEmpty(initObject.calcSgnCd) ? "" : initObject.calcSgnCd,
				avlBgnYmd		: $.fn.isEmpty(initObject.avlBgnYmd) ? "" : initObject.avlBgnYmd,
				avlEndYmd		: $.fn.isEmpty(initObject.avlEndYmd) ? "" : initObject.avlEndYmd,
				deltYn			: $.fn.isEmpty(initObject.deltYn) ? "" : initObject.deltYn
			};
		chgValChk = (JSON.stringify(orgParam) === JSON.stringify(paramObj)) ? "N" : "Y";
	}
	
	if(NEW_MODI_SC_CD == "I" && newChgValCheck()) {
		chgValChk = "Y";
	}
	if(chgValChk == "Y") rtnValChk = true;

	return rtnValChk;
}

/**
 * @설명: 신규등록 시 변경항목 체크
 * @최초작성자: 황석현
 * @최초작성일: 2021.05.06
 * @최종변경일: 
 * @매개변수:	
 * @반환값: 
 * @개정이력: 
 */
function newChgValCheck() {
	let rtnValChk = false;
	if($("#sbx_acctCdDtl").val().length > 0
			|| $("#sbx_acntgBusnClsfCdDtl").val().length > 0
			|| $("#sbx_acntgDlTypCdDtl").val().length > 0
			|| $("#sbx_acntgAmtScCdDtl").val().length > 0
			|| $("#sbx_amtTypScCdDtl").val().length > 0
			|| $("#sbx_amtTypDtlScCdDtl").val().length > 0) {
		rtnValChk = true;
	}
	return rtnValChk;
}

/**
 * @설명: 계정과목명 조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.04.23
 * @최종변경일: 
 * @매개변수: val 계정과목코드
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.04.23 최초작성
 */
function selectAcitmNm(val) {
	var reqParam = {};
	reqParam.acitmCd = val;
	
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr111m/selectAcitmNm.do")
	.done(function(data) {
		console.log(data);

		var acitmNm = data.acitmnm;
		if($.fn.isEmpty(acitmNm)) {
			$("#inp_acitmCdNmTop").val("");
		}else{
			$("#inp_acitmCdNmTop").val(acitmNm);
		}
		
	}).fail(function(data) {
		console.log("fail to selectAcitmNm!!!!");
	});
}
	
/**
 * @설명: 엑셀 저장
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
function saveJoulRlExcel() {
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}
	
	var saveList= new Array();	//저장대상 배열 선언
	var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	var cdObj = $._commonObj.code["CALC_SGN_CD"];
	
	//c,u,d,e 건만 추출
	for(var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		
		//명칭 제외
		delete gridData[i].acctCdNm;
		delete gridData[i].acntgBusnClsfCdNm;
		delete gridData[i].acntgDlTypCdNm;
		delete gridData[i].acntgAmtScCdNm;
		delete gridData[i].amtTypScCdNm;
		delete gridData[i].amtTypDtlScCdNm;
		delete gridData[i].acntNm;
		gridData[i]["pswd"] = $("#ibx_pswd").val();
		gridData[i]["newModiScCd"] = "XLSX";
		
		for(var key in item) {
			
			//유효값체크
			if(!isValid(i, item)) {
				$("#ibx_pswd").val("");
				return;
			}
			item[key] = $.trim(item[key]);
			
		}

		var chk = false;
		$.each(cdObj, function(){
			if(this["codeNm"] == $.trim(gridData[i].calcSgnCdNm)){
				chk = true;
				gridData[i].calcSgnCd = this["code"];
				return false;
			}
		});

		if(chk) saveList.push(gridData[i]);
	}
	console.log(saveList);
	
	if(saveList.length == 0) {
		$.fn.msgBox("저장할 대상이 없습니다.");
		$("#ibx_pswd").val("");
		return;
	}

	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/jr/fijr111m/saveJoulRlList.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상처리되었습니다");
					
					//재조회
					selectJoulRlList();
					
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 엑셀 저장 필수항목 체크
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
function isValid(rowIndex, item) {
	
	var dtPattern = /^(19|20|99)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/; //날짜 패턴 정규식
	
	//회계코드
	if($.trim(item.acctCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 회계코드를 입력하세요.");
		return false;
	}
	if(item.acctCd.length != 1) {
		$.fn.msgBox((rowIndex + 1) + "행의 회계코드는 1자리를 입력하세요.");
		return false;
	}
	
	//업무분류코드
	if($.trim(item.acntgBusnClsfCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 업무분류코드를 입력하세요.");
		return false;
	}
	if(item.acntgBusnClsfCd.length != 2) {
		$.fn.msgBox((rowIndex + 1) + "행의 업무분류코드는 2자리를 입력하세요.");
		return false;
	}
	
	//거래유형코드
	if($.trim(item.acntgDlTypCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 거래유형코드를 입력하세요.");
		return false;
	}
	if(item.acntgDlTypCd.length != 4) {
		$.fn.msgBox((rowIndex + 1) + "행의 거래유형코드는 4자리를 입력하세요.");
		return false;
	}
	
	//금액구분코드
	if($.trim(item.acntgAmtScCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액구분코드를 입력하세요.");
		return false;
	}
	if(item.acntgAmtScCd.length != 7) {
		$.fn.msgBox((rowIndex + 1) + "행의금액구분코드는 7자리를 입력하세요.");
		return false;
	}
	
	//금액유형구분코드
	if($.trim(item.amtTypScCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형구분코드를 입력하세요.");
		return false;
	}
	if(item.amtTypScCd.length != 2) {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형구분코드는 2자리를 입력하세요.");
		return false;
	}
	
	//금액유형상세구분코드
	if($.trim(item.amtTypDtlScCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형상세구분코드를 입력하세요.");
		return false;
	}
	if(item.amtTypDtlScCd.length != 2 && item.amtTypDtlScCd.length != 3 && item.amtTypDtlScCd.length != 2 && item.amtTypDtlScCd.length != 10) {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형상세구분코드는 2자리, 3자리 또는 10자리를 입력하세요.");
		return false;
	}
	
	//계정항목
	if($.trim(item.acitmCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 계정항목코드를 입력하세요.");
		return false;
	}
	
//	//유효시작일 체크
//	if($.trim(item.avlBgnYmd) == "") {
//		$.fn.msgBox((rowIndex + 1) + "행의 유효시작일을 입력하세요.");
//		return false;
//	}else{
//		var ymd = $.replaceAll(item.avlBgnYmd, '-', '');
//		//날짜형식체크
//		if(!dtPattern.test(ymd)){
//			$.fn.msgBox((rowIndex + 1) + "행의 유효시작일 형식이 올바르지 않습니다.");
//			return false;
//		}
//	}
//
//	//유효종료일 체크
//	if($.trim(item.avlEndYmd) == "") {
//		$.fn.msgBox((rowIndex + 1) + "행의 유효종료일을 입력하세요.");
//		return false;
//	}else{
//		var ymd = $.replaceAll(item.avlEndYmd, '-', '');
//		//날짜형식체크
//		if(!dtPattern.test(ymd)){
//			$.fn.msgBox((rowIndex + 1) + "행의 유효종료일 형식이 올바르지 않습니다.");
//			return false;
//		}
//		
//		var bgnYmd = $.replaceAll($.trim(item.avlBgnYmd), '-', '');
//		var endYmd = $.replaceAll($.trim(item.avlEndYmd), '-', '');
//		
//		//시작일이 종료일이 클때
//		var bgnYmdCompare = new Date(bgnYmd.substring(0,4), parseInt(bgnYmd.substring(4,6))-1, bgnYmd.substring(6));
//		var endYmdCompare = new Date(endYmd.substring(0,4), parseInt(endYmd.substring(4,6))-1, endYmd.substring(6));
//		if(bgnYmdCompare.getTime() > endYmdCompare.getTime()){
//			$.fn.msgBox((rowIndex + 1) + "행의 유효시작일이 유효종료일보다 클 수 없습니다.");
//			return false;
//		}
//	}
	
	if($.trim(item.calcSgnCdNm) == ""){
		$.fn.msgBox((rowIndex + 1) + "행의 부호계산코드(+,-)를 입력하세요.");
		return false;
	}
	
	//부호
	if($.trim(item.calcSgnCdNm) != ""){
		if(item.calcSgnCdNm != "+" && item.calcSgnCdNm != "-"){
			$.fn.msgBox((rowIndex + 1) + "행의 부호계산코드(+,-)가 유효하지 않습니다.");
			return false;
		}
	}
	
	
	//삭제여부
	if($.trim(item.deltYn) != ""){
		var val = item.deltYn.toUpperCase(); //대문자
		if(val != "Y" && val != "N"){
			$.fn.msgBox((rowIndex + 1) + "행의 삭제여부(Y,N)를 확인하세요.");
			return false;
		}
	}
	
	return true;
}

/**
 * @설명: byte length
 * @최초작성자: 황석현
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @매개변수: value
 * @반환값: num
 * @개정이력: 
 *  황석현 2021.02.03 최초작성
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

/**
 * @설명: 버튼 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
function setBtnAction(divScCd) {
	console.log("setBtnAction:" + NEW_MODI_SC_CD);
	if(divScCd == "I") {
		$("#btn_delete").hide();
		$("#btn_delete_cancel").hide();
		$("#btn_newReg").hide();
		$("#btn_init").hide();
		$("#btn_cancel").show();
		
		fninit("I");
//		selectItmCode("ACCT_CD", "sbx_acctCdDtl", "");
		setItmCode("ACCT_CD", "sbx_acctCdDtl", "");
		
		var today = new Date();
		var year  = today.getFullYear();
		var month = ("0" + (today.getMonth() + 1)).slice(-2);
		var toYmd = year + "-" + month + "-" + ("0" + today.getDate()).slice(-2);
		
		$("#inp_avlBgnYmd").val($.fn.dateFormat(toYmd, "-"));
		$("#inp_avlEndYmd").val($.fn.dateFormat("99991231", "-"));
		
		$("#sbx_acctCdDtl").focus();
		
	}else{
		$("#btn_save").show();
		$("#btn_newReg").show();
		$("#btn_init").show();
		$("#btn_cancel").hide();
		$("#btn_excel_save").hide();
		if($("#sbx_deltYn").val() == "Y") {
			$("#btn_delete").hide();
			$("#btn_delete_cancel").show();
		} else {
			$("#btn_delete").show();
			$("#btn_delete_cancel").hide();
		}
		
		if(NEW_MODI_SC_CD == "XLSX") {
			$("#gridDiv").jsGrid("reset");
			$("#gridDiv").jsGrid("option", "data", []);
			$("#ckb_all").prop("checked", false);
		}
		
		fninit("U");
	}
}

/**
 * @설명: 계정과목조회 팝업을 호출한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
var POPUP_INFO = {};
function openPopupAcitCd(scCd) {
	popUpscCd = scCd;
	var popupOption = {};
	
	if(popUpscCd == "1" || popUpscCd == "2") {
		POPUP_INFO = {
				url: "/fi/jr/fijr111p.do",
				name: "계정과목목록조회 팝업",
				width: 700,
				height: 432				
		}	
	}else{
		POPUP_INFO = {
				url: "/fi/jr/fijr111p.do",
				name: "환입계정과목목록조회 팝업",
				width: 700,
				height: 432
		}
	}

	$.fn.openPopup(POPUP_INFO);
}

/**
 * @설명: 계정과목조회 팝업 콜백
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
function openPopupAcitmCd_callback(resultObj) {
	if(popUpscCd == "1") {
		$("#inp_acitmCdTop").val(resultObj.acitmCd);
		$("#inp_acitmCdNmTop").val(resultObj.acitmCdNm);
	}else if(popUpscCd == "2") {
		$("#inp_acitmCd").val(resultObj.acitmCd);
		$("#inp_acitmCdNm").val(resultObj.acitmCdNm);
	}else{
		$("#inp_recptAcitmCd").val(resultObj.acitmCd);
		$("#inp_recptAcitmCdNm").val(resultObj.acitmCdNm);
	}
}

/**
 * @설명: 화면 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.26 최초작성
 */
function fninit(divScCd) {
	console.log("1.fninit:" + NEW_MODI_SC_CD);
	$("#sbx_acctCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_acntgBusnClsfCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_acntgDlTypCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_acntgAmtScCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_amtTypScCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_amtTypDtlScCdDtl").empty().append("<option value=''>-선택-</option>");
	
	$("#sbx_crdrScCdDtl").val("");
	$("#inp_acitmCd").val("");
	$("#inp_acitmCdNm").val("");
	$("#sbx_acntInxCdDtl").val("");
	$("#sbx_recptYnDtl").val("");
	$("#inp_recptAcitmCd").val("");
	$("#inp_recptAcitmCdNm").val("");
	$("#sbx_ecqDcdYnDtl").val("");
	$("#sbx_calcSgnCdDtl").val("");
	$("#inp_avlBgnYmd").val("");
	$("#inp_avlEndYmd").val("");
	$("#ibx_pswd").val("");
	
	if(divScCd == "I") {
		$("#table_detail").find("select,button").attr("disabled", false);
		$("#inp_avlBgnYmd").removeAttr("disabled");
		$("#inp_avlEndYmd").removeAttr("disabled");
		$("#sbx_deltYnDtl").val("N");
	} else {
		$("#inp_avlBgnYmd").val("");
		$("#inp_avlEndYmd").val("");
		$("#sbx_deltYnDtl").val("");
		$("#table_detail").find("select,input,button").attr("disabled", true);
	}

	NEW_MODI_SC_CD = divScCd;
	console.log("2.fninit:" + NEW_MODI_SC_CD);
	initObject = null;
}

/**
 * @설명: 공통코드성 조회 
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.26 최초작성
 */
function initCommCd() {
	
	//공통코드 조회
	$.fn.loadCommonCode(["CALC_SGN_CD"]);
		
	selectAcntInxCdList();
}

/**
 * @설명: 경리계정색인코드 조회 
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.26
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.26 최초작성
 */
function selectAcntInxCdList() {
	// 경리계정색인코드 "sbx_acntInxCdDtl"
	var reqParam = {};
	
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr111m/selectAcntInxCdList.do",{async:false})
	.done(function(data) {
		//콤보박스 세팅
		var $targetEl = $("#sbx_acntInxCdDtl");
		//콤보박스 option세팅
		var codeList = data.list;
		var optionStr = '<option value="">-선택-</option>';
		for (let j = 0; j < codeList.length; j++) {
			let codeData = codeList[j];
			optionStr += '<option value="' + codeData.code + '">' + codeData.codeNm + '</option>';
		}
		$targetEl.html(optionStr);
		
	}).fail(function(data) {
		console.log("fail to selectAcntInxCdList!!!!");
	});
}

/**
 * @설명: 조회조건 코드 목록 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.25
 * @최종변경일: 
 * @매개변수:	codeId : 조회할 코드 대상
 * 			selId : 조회결과 바인딩 콤보박스
 * 			value : 종속하는 코드값
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.25 최초작성
 */
function selectItmCode(codeId, selId, value) {
	var reqParam = {};
	reqParam.codeId = codeId;
	reqParam.val = value;
	
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr111m/selectItmCdList.do",{async:false})
	.done(function(data) {
		//콤보박스 세팅
		var $targetEl = $("#" + selId);
		//콤보박스 option세팅
		var codeList = data.list;
		var optionStr = '<option value="">-전체-</option>';
		for (let j = 0; j < codeList.length; j++) {
			let codeData = codeList[j];
			optionStr += '<option value="' + codeData.code + '">' + codeData.codeNm + '</option>';
		}
		$targetEl.html(optionStr);
		
	}).fail(function(data) {
		console.log("fail to selectItmCode!!!!");
	});
}

/**
 * @설명: 신규 등록을 위한 항목코드 조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수:	codeId : 조회할 코드 대상
 * 			selId : 조회결과 바인딩 콤보박스
 * 			value : 종속하는 코드값
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
function setItmCode(codeId, selId, val) {
	var reqParam = {};
	reqParam.codeId = codeId;
	reqParam.acctCd = $("#sbx_acctCdDtl").val();
	reqParam.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCdDtl").val();
	//업무분류 변경시
	if(val != "MAIN") {
		reqParam.acntgDlTypCd = $("#sbx_acntgDlTypCdDtl").val();
		reqParam.acntgAmtScCd = $("#sbx_acntgAmtScCdDtl").val();
		reqParam.amtTypScCd = $("#sbx_amtTypScCdDtl").val();
		reqParam.amtTypDtlScCd = $("#sbx_amtTypDtlScCdDtl").val();
	}
	reqParam.deltYn = "N";

	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr111m/setItmCode.do",{async:false})
	.done(function(data) {
		//콤보박스 세팅
		var $targetEl = $("#" + selId);
		//콤보박스 option세팅
		var codeList = data.list;
		var optionStr = '<option value="">-선택-</option>';
		for (let j = 0; j < codeList.length; j++) {
			let codeData = codeList[j];
			optionStr += '<option value="' + codeData.code + '">' + codeData.codeNm + '</option>';
		}
		$targetEl.html(optionStr);

		//기존있던값은 그대로 셋팅
		$("#sbx_acctCdDtl").val(reqParam.acctCd);
		$("#sbx_acntgBusnClsfCdDtl").val(reqParam.acntgBusnClsfCd);
		$("#sbx_acntgDlTypCdDtl").val(reqParam.acntgDlTypCd);
		$("#sbx_acntgAmtScCdDtl").val(reqParam.acntgAmtScCd);
		$("#sbx_amtTypScCdDtl").val(reqParam.amtTypScCd);
		$("#sbx_amtTypDtlScCdDtl").val(reqParam.amtTypDtlScCd);
		
	}).fail(function(data) {
		console.log("fail to setItmCode!!!!");
	});
}

/**
 * @설명: 그리드 더블클릭시 하단 항목에 값 셋팅을 위한 항목코드 조회
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.28
 * @최종변경일: 
 * @매개변수:	codeId : 조회할 코드 대상
 * 			selId : 조회결과 바인딩 콤보박스
 * 			value : 종속하는 코드값
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.28 최초작성
 */
function selectItmCodeDtl(codeId, selId, value) {
	var reqParam = {};
	reqParam.codeId = codeId;
	reqParam.acctCd = value.acctCd;
	reqParam.acntgBusnClsfCd = value.acntgBusnClsfCd;
	reqParam.acntgDlTypCd = value.acntgDlTypCd;
	reqParam.acntgAmtScCd = value.acntgAmtScCd;
	reqParam.amtTypScCd = value.amtTypScCd;
	reqParam.amtTypDtlScCd = value.amtTypDtlScCd;
	
	$.callAjax(reqParam, "/fi/jr/fijr111m/setItmCode.do",{async:false})
	.done(function(data) {
		//콤보박스 세팅
		var $targetEl = $("#" + selId);
		//콤보박스 option세팅
		var codeList = data.list;
		var optionStr = '<option value="">-선택-</option>';
		for (let j = 0; j < codeList.length; j++) {
			let codeData = codeList[j];
			optionStr += '<option value="' + codeData.code + '">' + codeData.codeNm + '</option>';
		}
		$targetEl.html(optionStr);

	}).fail(function(data) {
		console.log("fail to selectItmCodeDtl!!!!");
	});
}

/**
 * @설명: 더블클릭한 행의 데이터를 하단 Detail 영역으로 값으로 셋팅한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.25
 * @최종변경일: 
 * @매개변수:	args
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.25 최초작성
 */
function setDoubleClickDtlInfo(args) {
	$(".sub_title h4").text("분개규칙 수정/삭제");
	$("#sbx_acctCdDtl").attr("disabled", "false");
	$("#sbx_acntgBusnClsfCdDtl").attr("disabled", "false");
	$("#sbx_acntgDlTypCdDtl").attr("disabled", "false");
	$("#sbx_acntgAmtScCdDtl").attr("disabled", "false");
	$("#sbx_amtTypScCdDtl").attr("disabled", "false");
	$("#sbx_amtTypDtlScCdDtl").attr("disabled", "false");
	
	var selectedIndex = args.itemIndex;
	var selectedObj = args.item;
	selectItmCodeDtl("ACCT_CD", "sbx_acctCdDtl", selectedObj);
	selectItmCodeDtl("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCdDtl", selectedObj);
	selectItmCodeDtl("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCdDtl", selectedObj);
	selectItmCodeDtl("AMT_TYP_SC_CD", "sbx_amtTypScCdDtl", selectedObj);
	selectItmCodeDtl("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCdDtl", selectedObj);
	selectItmCodeDtl("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCdDtl", selectedObj);
	
	$("#sbx_acctCdDtl").val(selectedObj.acctCd);
	$("#sbx_acntgBusnClsfCdDtl").val(selectedObj.acntgBusnClsfCd);
	$("#sbx_acntgDlTypCdDtl").val(selectedObj.acntgDlTypCd);
	$("#sbx_acntgAmtScCdDtl").val(selectedObj.acntgAmtScCd);
	$("#sbx_amtTypScCdDtl").val(selectedObj.amtTypScCd);
	$("#sbx_amtTypDtlScCdDtl").val(selectedObj.amtTypDtlScCd);
	$("#sbx_crdrScCdDtl").val(selectedObj.crdrScCd); //차대구분
	$("#inp_acitmCd").val(selectedObj.acitmCd); //계정과목
	$("#inp_acitmCdNm").val(selectedObj.acntNm);
	$("#sbx_acntInxCdDtl").val(selectedObj.acntInxCd); //계정index
	$("#sbx_recptYnDtl").val(selectedObj.recptYn); //환입여부
	$("#inp_recptAcitmCd").val(selectedObj.recptAcitmCd); //환입계정과목
	$("#inp_recptAcitmCdNm").val(selectedObj.recptAcitmCdNm);
	$("#sbx_ecqDcdYnDtl").val(selectedObj.ecqDcdYn); //당분기말확정여부
	$("#sbx_calcSgnCdDtl").val(selectedObj.calcSgnCd); //부호구분
	$("#inp_avlBgnYmd").val($.fn.dateFormat(selectedObj.avlBgnYmd, "-"));//유효개시일자
	$("#inp_avlEndYmd").val($.fn.dateFormat(selectedObj.avlEndYmd, "-"));//유효종료일자
	$("#sbx_deltYnDtl").val(selectedObj.deltYn);
	
	NEW_MODI_SC_CD = "U";

	if(selectedObj.deltYn == "Y") {
		$("#sbx_crdrScCdDtl").attr("disabled", "false");
		$("#sbx_acntInxCdDtl").attr("disabled", "false");
		$("#sbx_recptYnDtl").attr("disabled", "false");
		$("#sbx_ecqDcdYnDtl").attr("disabled", "false");
		$("#sbx_calcSgnCdDtl").attr("disabled", "false");
		$("#inp_avlBgnYmd").attr("disabled", "false");
		$("#inp_avlEndYmd").attr("disabled", "false");
		$("#sbx_deltYnDtl").removeAttr("disabled");
		$("#table_detail").find("button").attr("disabled", true);
	}else{
		$("#sbx_crdrScCdDtl").removeAttr("disabled");
		$("#sbx_acntInxCdDtl").removeAttr("disabled");
		$("#sbx_recptYnDtl").removeAttr("disabled");
		$("#sbx_ecqDcdYnDtl").removeAttr("disabled");
		$("#sbx_calcSgnCdDtl").removeAttr("disabled");
		$("#inp_avlBgnYmd").removeAttr("disabled");
		$("#inp_avlEndYmd").removeAttr("disabled");
		$("#sbx_deltYnDtl").attr("disabled", "false");
		$("#table_detail").find("button").attr("disabled", false);
	}
	$("#btn_save").show();
	$("#btn_newReg").show();
	$("#btn_init").show();
	$("#btn_cancel").hide();
	if($("#sbx_deltYn").val() == "Y") {
		$("#btn_delete").hide();
		$("#btn_delete_cancel").show();
	} else {
		$("#btn_delete").show();
		$("#btn_delete_cancel").hide();
	}
}

/**
 * @설명: 분개 항목코드를 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.25
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.25 최초작성
 */
function selectJoulRlList() {
	$("#ckb_all").prop("checked", false);
	
	var reqParam = {};
	reqParam.acctCd = $("#sbx_acctCd").val();
	reqParam.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCd").val();
	reqParam.acntgDlTypCd = $("#sbx_acntgDlTypCd").val();
	reqParam.acntgAmtScCd = $("#sbx_acntgAmtScCd").val();
	reqParam.amtTypScCd = $("#sbx_amtTypScCd").val();
	reqParam.amtTypDtlScCd = $("#inp_amtTypDtlScCd").val();
	reqParam.deltYn = $("#sbx_deltYn").val();
	reqParam.acitmCd = $("#inp_acitmCdTop").val();
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/jr/fijr111m/selectJoulRlMngList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		
		//화면에 보여줄 부호 셋팅
		if(!$.fn.isEmpty(listData)){
			var calcObj = $._commonObj.code["CALC_SGN_CD"];
			for(var i=0;i<listData.length;i++){
				listData[i].calcSgnCdNm = "";
				for(var k=0;k<calcObj.length;k++){
					if(listData[i].calcSgnCd == calcObj[k].code){
						listData[i].calcSgnCdNm = calcObj[k].codeNm;
						break;
					}
				}
			}
		}
		
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });

		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
		if(listData.length > 0) $("#ckb_all").prop("disabled", false);
		
		//초기화
		NEW_MODI_SC_CD = "U";
		setBtnAction("U");
//		fninit("U");
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulRlList !!");
	});
}

/**
 * @설명: 신규생성, 수정 처리한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.25
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  황석현 2021.01.25 최초작성
 */
function saveJoulRl() {
	
	var reqParam = {};
	reqParam.newModiScCd = NEW_MODI_SC_CD;
	
	//저장 공통 부분
	reqParam.crdrScCd = $("#sbx_crdrScCdDtl").val();
	reqParam.crdrScCdNm = "";
	if(reqParam.crdrScCd == "40") {
		reqParam.crdrScCdNm = "차변";
	}else if(reqParam.crdrScCd == "50") {
		reqParam.crdrScCdNm = "대변";
	}
	reqParam.acitmCd = $("#inp_acitmCd").val();
	reqParam.acntNm = $("#inp_acitmCdNm").val();
	reqParam.acntInxCd = $("#sbx_acntInxCdDtl").val();
	reqParam.recptYn = $("#sbx_recptYnDtl").val();
	reqParam.recptAcitmCd = $("#inp_recptAcitmCd").val();
	reqParam.ecqDcdYn = $("#sbx_ecqDcdYnDtl").val();
	reqParam.calcSgnCd = $("#sbx_calcSgnCdDtl").val();
	reqParam.avlBgnYmd = $.replaceAll($("#inp_avlBgnYmd").val().trim(), '-','');
	reqParam.avlEndYmd = $.replaceAll($("#inp_avlEndYmd").val().trim(), '-','');
	reqParam.deltYn = $("#sbx_deltYnDtl").val();
	
	if(NEW_MODI_SC_CD == "I") {
		reqParam.acctCd = $("#sbx_acctCdDtl").val();
		reqParam.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCdDtl").val();
		reqParam.acntgDlTypCd = $("#sbx_acntgDlTypCdDtl").val();
		reqParam.acntgAmtScCd = $("#sbx_acntgAmtScCdDtl").val();
		reqParam.amtTypScCd = $("#sbx_amtTypScCdDtl").val();
		reqParam.amtTypDtlScCd = $("#sbx_amtTypDtlScCdDtl").val();
		
		if($.fn.isEmpty(reqParam.acctCd)) {
			$.fn.msgBox("회계코드을(를) 선택하세요."); //EBCU016
			$("#sbx_acctCdDtl").focus();
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgBusnClsfCd)) {
			$.fn.msgBox("업무분류을(를) 선택하세요."); //EBCU016
			$("#sbx_acntgBusnClsfCdDtl").focus();
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgDlTypCd)) {
			$.fn.msgBox("거래유형을(를) 선택하세요.");
			$("#sbx_acntgDlTypCdDtl").focus();
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgAmtScCd)) {
			$.fn.msgBox("금액구분을(를) 선택하세요.");
			$("#sbx_acntgAmtScCdDtl").focus();
			return;
		}
		
		if($.fn.isEmpty(reqParam.amtTypScCd)) {
			$.fn.msgBox("금액유형구분을(를) 선택하세요.");
			$("#sbx_amtTypScCdDtl").focus();
			return;
		}
		
		if($.fn.isEmpty(reqParam.amtTypDtlScCd)) {
			$.fn.msgBox("금액유형상세구분을(를) 선택하세요.");
			$("#sbx_amtTypDtlScCdDtl").focus();
			return;
		}
		
		if($.fn.isEmpty(reqParam.acitmCd) || $.fn.isEmpty(reqParam.acntNm)) {
			$.fn.msgBox("계정과목을(를) 선택하세요.");
			$("#inp_acitmCd").focus();
			return;
		}
		
		var sbx_acntgBusnClsfCdNm = $("#sbx_acntgBusnClsfCdDtl option:selected").text();
		pos = sbx_acntgBusnClsfCdNm.indexOf(': ');
		sbx_acntgBusnClsfCdNm = sbx_acntgBusnClsfCdNm.substr(pos+2);
		var sbx_acntgDlTypCdNm = $("#sbx_acntgDlTypCdDtl option:selected").text();
		pos = sbx_acntgDlTypCdNm.indexOf(': ');
		sbx_acntgDlTypCdNm = sbx_acntgDlTypCdNm.substr(pos+2);
		var sbx_acntgAmtScCdNm = $("#sbx_acntgAmtScCdDtl option:selected").text();
		pos = sbx_acntgAmtScCdNm.indexOf(': ');
		sbx_acntgAmtScCdNm = sbx_acntgAmtScCdNm.substr(pos+2);
		reqParam.acntgBusnClsfCdNm = sbx_acntgBusnClsfCdNm;
		reqParam.acntgDlTypCdNm = sbx_acntgDlTypCdNm;
		reqParam.acntgAmtScCdNm = sbx_acntgAmtScCdNm;
		
	} else {
		
		//NEW_MODI_SC_CD : U, D
		if($.fn.isEmpty(initObject)) {
			if(NEW_MODI_SC_CD =="U") {
				$.fn.msgBox("저장할 대상이 없습니다.");
			}else{
				$.fn.msgBox("삭제할 대상이 없습니다.");				
			}
			return;
		}
		
		//변경여부 체크
		if(NEW_MODI_SC_CD =="U") {
			if($.fn.isEmpty(reqParam.acitmCd) || $.fn.isEmpty(reqParam.acntNm)) {
				$.fn.msgBox("계정과목을(를) 선택하세요.");
				$("#inp_acitmCd").focus();
				return;
			}else if( (isNullStr(reqParam.crdrScCd) == isNullStr(initObject.crdrScCd))
				&& (isNullStr(reqParam.acitmCd) == isNullStr(initObject.acitmCd))
				&& (isNullStr(reqParam.acntInxCd) == isNullStr(initObject.acntInxCd))
				&& (isNullStr(reqParam.recptYn) == isNullStr(initObject.recptYn))
				&& (isNullStr(reqParam.recptAcitmCd) == isNullStr(initObject.recptAcitmCd))
				&& (isNullStr(reqParam.ecqDcdYn) == isNullStr(initObject.ecqDcdYn))
				&& (isNullStr(reqParam.calcSgnCd) == isNullStr(initObject.calcSgnCd))
				&& (isNullStr(reqParam.avlBgnYmd) == isNullStr(initObject.avlBgnYmd))
				&& (isNullStr(reqParam.avlEndYmd) == isNullStr(initObject.avlEndYmd))
				&& (isNullStr(reqParam.deltYn) == isNullStr(initObject.deltYn)) ) {
				$.fn.msgBox("변경사항이 없습니다."); //ECBU003
				return false;
			}else if( (isNullStr(reqParam.acitmCd) == isNullStr(initObject.acitmCd)) 
					&& ( (isNullStr(reqParam.crdrScCd) != isNullStr(initObject.crdrScCd))
					|| (isNullStr(reqParam.acntInxCd) != isNullStr(initObject.acntInxCd))
					|| (isNullStr(reqParam.recptYn) != isNullStr(initObject.recptYn))
					|| (isNullStr(reqParam.recptAcitmCd) != isNullStr(initObject.recptAcitmCd))
					|| (isNullStr(reqParam.ecqDcdYn) != isNullStr(initObject.ecqDcdYn))
					|| (isNullStr(reqParam.calcSgnCd) != isNullStr(initObject.calcSgnCd))
					|| (isNullStr(reqParam.avlBgnYmd) != isNullStr(initObject.avlBgnYmd))
					|| (isNullStr(reqParam.avlEndYmd) != isNullStr(initObject.avlEndYmd)) 
					|| (isNullStr(reqParam.deltYn) != isNullStr(initObject.deltYn)) ) ) {
				reqParam.newModiScCd = "U1"; //단건 처리(계정과목 변경없음)
			}
			//삭제Y->N
			if(initObject.deltYn == "Y" && reqParam.deltYn == "N"){
				reqParam.newModiScCd = "U2";
			}
		}

		reqParam.acctCd = initObject.acctCd;
		reqParam.acntgBusnClsfCd = initObject.acntgBusnClsfCd;
		reqParam.acntgDlTypCd = initObject.acntgDlTypCd;
		reqParam.acntgAmtScCd = initObject.acntgAmtScCd;
		reqParam.amtTypScCd = initObject.amtTypScCd;
		reqParam.amtTypDtlScCd = initObject.amtTypDtlScCd;
		reqParam.joulSno = initObject.joulSno;
		reqParam.acntgBusnClsfCdNm = initObject.acntgBusnClsfCdNm;
		reqParam.acntgDlTypCdNm = initObject.acntgDlTypCdNm;
		reqParam.acntgAmtScCdNm = initObject.acntgAmtScCdNm;
		
	}
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}
	
	reqParam.pswd = $("#ibx_pswd").val();
	
	var msg = "저장하시겠습니까?";
	if(NEW_MODI_SC_CD == "D") msg = "삭제하시겠습니까?";
	console.log(reqParam);
	$.fn.msgBox(msg, function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/jr/fijr111m/saveJoulRl.do")
			.done(function(data) {
				if(NEW_MODI_SC_CD == "D") {	//삭제 처리 - 6개 항목코드 기준으로 모두 삭제됨.
					if(data.result > 0) {
						$.fn.msgBox(data.result + "건 삭제 완료되었습니다."); //ECIU043  
					}
					
				}else{
					if(data.result == "-1") {
						return;
					}
					
					if(data.result > 0) {
						$.fn.msgBox("정상처리되었습니다."); //EBCU000
						
						if(NEW_MODI_SC_CD == "I") {
							$("#btn_cancel").hide();
							$("#btn_delete").show();
							$("#btn_newReg").show();
							$("#btn_init").show();
						}
					}
				}
				
				selectJoulRlList();
				
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 널 체크
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수: value
 * @반환값: value
 * @개정이력: 
 *  황석현 2021.01.27 최초작성
 */
function isNullStr(value) {
	
	if($.fn.isEmpty(value)) {
		return "";
	}
	return value;
}

/**
 * @설명: 선택된 건 삭제한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  황석현 2021.01.27 최초작성
 */
function delJoulRl() {
	
	NEW_MODI_SC_CD = "D";
	
	if(isNullStr(initObject.deltYn) == "Y") {
		$.fn.msgBox("삭제할수 없는 자료입니다."); //ECSU159
		return false;
	}
	saveJoulRl();
}


/**
 * @설명: 선택된 건 삭제한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.27
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  황석현 2021.01.27 최초작성
 */
function delJoulRlList() {
	var saveList = new Array();	//저장대상 배열 선언
	var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	var delChkCnt = 0;

	for(var i=0; i<gridData.length; i++){
		if(gridData[i].checked){
			var pswd = "";
			if(delChkCnt == 0) pswd = $("#ibx_pswd").val();
			
			delChkCnt++;
			saveList.push({
				acctCd      		: gridData[i].acctCd,
				acntgBusnClsfCd		: gridData[i].acntgBusnClsfCd,
				acntgDlTypCd		: gridData[i].acntgDlTypCd,
				acntgAmtScCd		: gridData[i].acntgAmtScCd,
				amtTypScCd			: gridData[i].amtTypScCd,
				amtTypDtlScCd		: gridData[i].amtTypDtlScCd,
				joulSno				: gridData[i].joulSno,
				acntgBusnClsfCdNm	: gridData[i].acntgBusnClsfCdNm,
				acntgDlTypCdNm		: gridData[i].acntgDlTypCdNm,
				acntgAmtScCdNm		: gridData[i].acntgAmtScCdNm,
				acitmCd				: gridData[i].acitmCd,
				deltYn				: "Y",
				pswd         		: pswd
			});
		}
	}
	
	if(delChkCnt == 0){
		$.fn.msgBox("삭제할 대상이 없습니다."); //ECLU042
		return;
	}
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}

	$.fn.msgBox(delChkCnt + "건을 삭제하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/jr/fijr111m/delJoulRlList.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox(data.resultCnt +"건 정상처리되었습니다");
					resetGrid();
					
					selectJoulRlList(); //재조회
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 선택된 건 삭제 취소한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.04.30
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  황석현 2021.04.30 최초작성
 *  황석현 2021.09.30 reqParam 설정 추가-pwsd
 */
function delCanJoulRl() {
	var sbx_acntgBusnClsfCdNm = $("#sbx_acntgBusnClsfCdDtl option:selected").text();
	pos = sbx_acntgBusnClsfCdNm.indexOf(': ');
	sbx_acntgBusnClsfCdNm = sbx_acntgBusnClsfCdNm.substr(pos+2);
	var sbx_acntgDlTypCdNm = $("#sbx_acntgDlTypCdDtl option:selected").text();
	pos = sbx_acntgDlTypCdNm.indexOf(': ');
	sbx_acntgDlTypCdNm = sbx_acntgDlTypCdNm.substr(pos+2);
	var sbx_acntgAmtScCdNm = $("#sbx_acntgAmtScCdDtl option:selected").text();
	pos = sbx_acntgAmtScCdNm.indexOf(': ');
	sbx_acntgAmtScCdNm = sbx_acntgAmtScCdNm.substr(pos+2);
	
	var reqParam = {
			acctCd 				: $("#sbx_acctCdDtl").val(),
			acntgBusnClsfCd		: $("#sbx_acntgBusnClsfCdDtl").val(),
			acntgDlTypCd		: $("#sbx_acntgDlTypCdDtl").val(),
			acntgAmtScCd		: $("#sbx_acntgAmtScCdDtl").val(),
			amtTypScCd			: $("#sbx_amtTypScCdDtl").val(),
			amtTypDtlScCd		: $("#sbx_amtTypDtlScCdDtl").val(),
			acntgBusnClsfCdNm	: sbx_acntgBusnClsfCdNm,
			acntgDlTypCdNm		: sbx_acntgDlTypCdNm,
			acntgAmtScCdNm		: sbx_acntgAmtScCdNm,
			acitmCd				: $("#inp_acitmCd").val(),
			deltYn				: "N",
			pswd                : $("#ibx_pswd").val()
	};
	
	if($.fn.isEmpty(reqParam.acntgBusnClsfCd)) {
		$.fn.msgBox("삭제할 대상이 없습니다."); //ECLU042
		return;
	}
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}
	
	$.fn.msgBox("삭제취소 하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/jr/fijr112m/deleteCancelJoulRl.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox(data.resultCnt +"건 정상처리되었습니다");
					resetGrid();
					
					selectJoulRlList(); //재조회
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 그리드에서 체크된 건 삭제한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.04.30
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  황석현 2021.04.30 최초작성
 */
function delCanJoulRlList() {
	var saveList = new Array();	//저장대상 배열 선언
	var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	var delChkCnt = 0;

	for(var i=0; i<gridData.length; i++){
		if(gridData[i].checked){
			var pswd = "";
			if(delChkCnt == 0) pswd = $("#ibx_pswd").val();
			
			delChkCnt++;
			saveList.push({
				acctCd      		: gridData[i].acctCd,
				acntgBusnClsfCd		: gridData[i].acntgBusnClsfCd,
				acntgDlTypCd		: gridData[i].acntgDlTypCd,
				acntgAmtScCd		: gridData[i].acntgAmtScCd,
				amtTypScCd			: gridData[i].amtTypScCd,
				amtTypDtlScCd		: gridData[i].amtTypDtlScCd,
				acntgBusnClsfCdNm	: gridData[i].acntgBusnClsfCdNm,
				acntgDlTypCdNm		: gridData[i].acntgDlTypCdNm,
				acntgAmtScCdNm		: gridData[i].acntgAmtScCdNm,
				acitmCd				: gridData[i].acitmCd,
				deltYn				: "N",
				pswd         		: pswd
			});
		}
	}
	
	if(delChkCnt == 0){
		$.fn.msgBox("삭제 취소할 대상이 없습니다."); //ECLU042
		return;
	}
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}

	$.fn.msgBox(delChkCnt + "건을 삭제취소 하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/jr/fijr112m/deleteCancelJoulRlList.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox(data.resultCnt +"건 정상처리되었습니다");
					resetGrid();
					
					selectJoulRlList(); //재조회
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.25
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.25 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}