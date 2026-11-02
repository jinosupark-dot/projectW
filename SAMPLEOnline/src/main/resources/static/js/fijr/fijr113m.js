/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-분개 항목코드 관리
 * @설명: 분개 항목코드 관리 화면
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.19
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.01.19 최초작성
 *  황석현 2021.04.28 2차 표준화
 *  황석현 2021.06.15 3차 표준화
 */

//전역변수 선언
var NEW_MODI_SC_CD = "U";			//수정, 신규 저장 체크
var initObject = null;				//수정전 원데이터
var EXCEL_SAVE_YN = "N";			//엑셀로드 여부
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
	
	//공통코드 조회
	$.fn.loadCommonCode(["JOUL_PBAN_SC_CD"]);
	
	//콤보박스 세팅
	$.fn.renderCombobox({
		useFirstOption : true,
		codeArr        : ["JOUL_PBAN_SC_CD"],
		selArr         : ["sbx_joulPbanScCd"],
		firstOptionText: ["-전체-"]
	});
	
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
	
	//회계코드 초기화
	selectItmCode("ACCT_CD", "sbx_acctCd", "", "1");
	
	$("#sbx_acctCd").focus();
	
});

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.19
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.01.19 최초작성
 */
function initEvent() {

	//조회
	$("#btn_search").on("click", function(e){
		if(chgValCheck()){
			$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					selectJoulItmCdMngList();
				}
			}, 2);
		} else {
			selectJoulItmCdMngList();
		}
	});
	
	//저장
	$("#btn_save").on("click", function(e){
		saveJoulItmCd();
	});
	
	//신규등록
	$("#btn_newReg").on("click", function(e){
		if(chgValCheck()){
			$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
					setObjStateChg("NEW");
					NEW_MODI_SC_CD = "I";
				}
			}, 2);
		} else {
			$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
			$.fn.renderCombobox({
				useFirstOption : true,
				codeArr        : ["JOUL_PBAN_SC_CD"],
				selArr         : ["ibx_joulPbanScCd"],
				firstOptionText: ["-선택-"]
			});
			
			setObjStateChg("NEW");
			NEW_MODI_SC_CD = "I";
		}
		$("#ckb_all").prop("checked", false);
		grid_check_all(false);
	});
	
	//취소 
	$("#btn_cancel").on("click", function(e){
		if(newChgValCheck()) {
			$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					setObjStateChg("CAN");
					NEW_MODI_SC_CD = "U";
				}
			}, 2);
		} else {
			setObjStateChg("CAN");
			NEW_MODI_SC_CD = "U";
		}
	});
	
	//초기화
	$("#btn_init").on("click", function(e){
		if(chgValCheck()){
			$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					setObjStateChg("INI");
					NEW_MODI_SC_CD = "U";
				}
			}, 2);
		} else {
			setObjStateChg("INI");
			NEW_MODI_SC_CD = "U";
		}
	});
	
	//단건 삭제
	$("#btn_delete").on("click", function(e){
		// 더블클릭으로 선택된 항목 여부
		if(!$.fn.isEmpty(initObject)){
			delJoulItmCd();
		} else {
			delJoulItmCdList();
		}
	});
	
	//삭제취소
	$("#btn_delete_cancel").on("click", function(e){
		// 더블클릭으로 선택된 항목 여부
		if(!$.fn.isEmpty(initObject)){
			delCanJoulItmCd();
		} else {
			delCanJoulItmCdList();
		}
	});
	
	// 회계코드 change
	$("#sbx_acctCd").on("change", function(e){
		selectItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCd", $(this).val(), "1");
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "", "1");
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", "", "1");
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "", "1");
	});
	
	// 업무분류 change
	$("#sbx_acntgBusnClsfCd").on("change", function(e){
		selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", $(this).val(), "1");
		selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", $(this).val(), "1");
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "", "1");
	});
	
	// 거래유형 change
	$("#sbx_acntgDlTypCd").on("change", function(e){
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", $(this).val(), "1");
	});
	
	// 금액유형 change
//	$("#sbx_amtTypScCd").on("change", function(e){
//		selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", $(this).val(), "1");
//	});
	
	// 하단 거래유형 change
	$("#sbx_acntgDlTypCdDtl").on("change", function(e){
		selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCdDtl", $(this).val(), "2");
	});
	
	// 하단 금액유형 change
	$("#sbx_amtTypScCdDtl").on("change", function(e){
		selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCdDtl", $(this).val(), "2");
	});
	
	// 입력 회계코드
	$("#ibx_acctCd").on("focusout", function(e){
		if($(this).val().length > 0 && $(this).val().length != 1) {
			$.fn.msgBox("회계코드는 1자리로 입력해야 합니다.");
			$(this).val("");
		} else {
			
			if($(this).val().length == 1) {
				//기존 등록된 코드명을 가져온다.
				setIbxNm("ACCT_CD", "ibx_acctCdNm", $(this).val());
			} else {
				$("#ibx_acctCdNm").removeAttr("disabled");
				$("#ibx_acctCdNm").val("");
			}
		}
	});
	
	$("#ibx_acctCd").on("keyup", function(e) {
		//숫자입력만 가능
		var val = $(this).val();
		$(this).val(val.replace(/[^\d]/g, ""));
	});
	
	// 입력 업무분류
	$("#ibx_acntgBusnClsfCd").on("focusout", function(e){
		if($(this).val().length > 0 && $(this).val().length != 2) {
			$.fn.msgBox("업무분류코드는 2자리로 입력해야 합니다.");
			$(this).val("");
		} else {
			
			if($(this).val().length == 2) {
				//기존 등록된 코드명을 가져온다.
				setIbxNm("ACNTG_BUSN_CLSF_CD", "ibx_acntgBusnClsfCdNm", $(this).val());
			} else {
				$("#ibx_acntgBusnClsfCdNm").removeAttr("disabled");
				$("#ibx_acntgBusnClsfCdNm").val("");
			}
		}
	});

	$("#ibx_acntgBusnClsfCd").on("keyup", function(e) {
		//숫자입력만 가능
		var val = $(this).val();
		$(this).val(val.replace(/[^\d]/g, ""));
	});
	
	// 입력 거래유형
	$("#ibx_acntgDlTypCd").on("focusout", function(e){
		
		if($(this).val().length > 0 && $(this).val().length != 4) {
			$.fn.msgBox("거래유형코드는 4자리로 입력해야 합니다.");
			$(this).val("");
		} else {
			
			if($(this).val().length == 4) {
				//기존 등록된 코드명을 가져온다.
				setIbxNm("ACNTG_DL_TYP_CD", "ibx_acntgDlTypCdNm", $(this).val());
			} else {
				$("#ibx_acntgDlTypCdNm").removeAttr("disabled");
				$("#ibx_acntgDlTypCdNm").val("");
			}
		}
	});
	
	$("#ibx_acntgDlTypCd").on("keyup", function(e) {
		//숫자입력만 가능
		var val = $(this).val();
		$(this).val(val.replace(/[^\d]/g, ""));
	});

	// 입력 금액구분
	$("#ibx_acntgAmtScCd").on("focusout", function(e){
		if($(this).val().length > 0 && $(this).val().length != 7) {
			$.fn.msgBox("금액구분코드는 7자리로 입력해야 합니다.");
			$(this).val("");
		} else {

			if($(this).val().length == 7) {
				//기존 등록된 코드명을 가져온다.
				setIbxNm("ACNTG_AMT_SC_CD", "ibx_acntgAmtScCdNm", $(this).val());
			} else {
				$("#ibx_acntgAmtScCdNm").removeAttr("disabled");
				$("#ibx_acntgAmtScCdNm").val("");
			}
		}
	});
	
	$("#ibx_acntgAmtScCd").on("keyup", function(e) {
		//숫자입력만 가능
		var val = $(this).val();
		$(this).val(val.replace(/[^\d]/g, ""));
	});

	// 입력 금액유형구분
	$("#ibx_amtTypScCd").on("focusout", function(e){
		if($(this).val().length > 0 && $(this).val().length != 2) {
			$.fn.msgBox("금액유형구분코드는 2자리로 입력해야 합니다.");
			$(this).val("");
		} else {
			
			if($(this).val().length == 2) {
				//기존 등록된 코드명을 가져온다.
				setIbxNm("AMT_TYP_SC_CD", "ibx_amtTypScCdNm", $(this).val());
			} else {
				$("#ibx_amtTypScCdNm").removeAttr("disabled");
				$("#ibx_amtTypScCdNm").val("");
			}
		}
	});

	$("#ibx_amtTypScCd").on("keyup", function(e) {
		//숫자입력만 가능
		var val = $(this).val();
		$(this).val(val.replace(/[^\d]/g, ""));
	});
	
	// 입력 금액유형상세구분
	$("#ibx_amtTypDtlScCd").on("focusout", function(e){
		if($(this).val().length > 0 && ($(this).val().length != 2 && $(this).val().length != 3 && $(this).val().length != 10)) {
			$.fn.msgBox("금액유형상세구분코드는 2자리 또는 3자리 또는 10자리로 입력해야 합니다.");
			$(this).val("");
		} else {
			
			if($(this).val().length == 2 || $(this).val().length == 10) {
				//기존 등록된 코드명을 가져온다.
				setIbxNm("AMT_TYP_DTL_SC_CD", "ibx_amtTypDtlScCdNm", $(this).val());
			} else {
				$("#ibx_amtTypDtlScCdNm").removeAttr("disabled");
				$("#ibx_amtTypDtlScCdNm").val("");
			}
		}
	});
	
	$("#ibx_amtTypDtlScCd").on("keyup", function(e) {
		//숫자입력만 가능
		var val = $(this).val();
		$(this).val(val.replace(/[^\d]/g, ""));
	});

	//엑셀다운로드
	$("#btn_excel_download").on("click", function(e){
		var fileName = "재무회계_분개/공시_항목코드_관리" + ".xlsx";
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
				$("#ckb_all").prop("checked", false);
				if(data.result == "1") {
					$.fn.msgBox(data.list.length + "건 정상적으로 로드하였습니다.");
					$("#btn_save").hide();
					$("#btn_delete").hide();
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
		saveJoulItmCdExcel();
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
	$("#sbx_acctCd, #sbx_acntgBusnClsfCd, #sbx_acntgDlTypCd, #sbx_acntgAmtScCd, #sbx_amtTypScCd, #sbx_joulPbanScCd, #sbx_deltYn").on("keypress", function(e) {
		if(e.keyCode == 13) {
			$("#btn_search").click();
			return false;
		}
	});
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.19
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.19 최초작성
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
		pageSize: 20,
		fields : [
			{ name: "check", title: "선택", width: 15, sorting: false, editing: false, align:"center", headerTemplate:function() {
				return $("<input>").attr("id", "ckb_all").attr("type", "checkbox").on("change", function() {
					if($("#sbx_deltYn").val() != "-전체-") {
						if((this.checked && !$.fn.isEmpty(initObject)) || NEW_MODI_SC_CD == "I"){
							if(chgValCheck()){
								$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
									if(obj.btn_ok) {
										setObjStateChg("INI");
				        	   			$("#ckb_all").prop("checked", true);
				        	   			grid_check_all(true);
									} else {
										$("#ckb_all").prop("checked", false);
									}
								}, 2);
							} else {
								setObjStateChg("INI");
		        	   			$("#ckb_all").prop("checked", true);
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
        	   		if(($(this).is(":checked") && !$.fn.isEmpty(initObject)) || NEW_MODI_SC_CD == "I"){
        	   			if(chgValCheck()){
            				$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
            					if(obj.btn_ok) {
            						setObjStateChg("INI");
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
            				setObjStateChg("INI");
            			}
        	   		} else {
        	   			if(!$(this).is(":checked")) $("#ckb_all").prop("checked", false);
        	   			
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
			{ name: "acctCd", title:"회계코드", css:"cell", type: "text", width: 40, editing: false, align:"center"},
			{ name: "acctCdNm", title:"회계코드명", css:"cell", type: "text", width: 50, editing: false, align:"left"},
			{ name: "acntgBusnClsfCd", title:"업무분류", css:"cell", type: "text", width: 40, editing: false, align:"center"},
			{ name: "acntgBusnClsfCdNm", title:"업무분류명", css:"cell", type: "text", width: 55, editing: false, align:"left"},
			{ name: "acntgDlTypCd", title:"거래유형", css:"cell", type: "text", width: 40, editing: false, align:"center"},
			{ name: "acntgDlTypCdNm", title:"거래유형명", css:"cell", type: "text", width: 70, editing: false, align:"left"},
			{ name: "acntgAmtScCd", title:"금액구분", css:"cell", type: "text", width: 40, editing: false, align:"center"},
			{ name: "acntgAmtScCdNm", title:"금액구분명", css:"cell", type: "text", width: 95, editing: false, align:"left"},
			{ name: "amtTypScCd", title:"금액유형구분", css:"cell", type: "text", width: 55, editing: false, align:"center"},
			{ name: "amtTypScCdNm", title:"금액유형구분명", css:"cell", type: "text", width: 120, editing: false, align:"left"},
			{ name: "amtTypDtlScCd", title:"금액유형상세구분", css:"cell", type: "text", width: 75, editing: false, align:"center"},
			{ name: "amtTypDtlScCdNm", title:"금액유형상세구분명", css:"cell", type: "text", width: 140, editing: false, align:"left"},
			{ name: "slpTypCd", title:"전표유형", css:"cell", type: "text", width: 45, editing: false, align:"center"},
			{ name: "joulPbanScCd", title:"분개공시구분", css:"cell", type: "select", width: 60, editing: false, align:"center",
				items: $.fn.getGridCodeItem("JOUL_PBAN_SC_CD", true),
				textField: "codeNm",
				valueField: "code"			
		},
			{ name: "deltYn", title:"삭제여부", css:"cell", type: "text", width: 40, editing: false, align:"center"},
			{ name: "trtDtm", title:"처리일시", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "rn", title:"RN", css:"cell", type: "text", width: 30, editing: false, align:"center", visible: false}
		]
	});	
	
	//row rowDoubleClick
	gridObject.rowDoubleClick(function(args) {
		
		console.log("doubleclick NEW_MODI_SC_CD:"+NEW_MODI_SC_CD);
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
 * 			scCd 이벤트코드
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
 *  황석현 2021.04.20 최초작성
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
 *  황석현 2021.05.06 최초작성
 */
function chgValCheck(){
	let rtnValChk = false;
	let chgValChk = "N";

	if(!$.fn.isEmpty(initObject)){
		//화면정보 json
		let paramObj = {
				acctCd				: $("#sbx_acctCdDtl").val(),
				acntgBusnClsfCd		: $("#sbx_acntgBusnClsfCdDtl").val(),
				acntgDlTypCd		: $("#sbx_acntgDlTypCdDtl").val(),
				acntgAmtScCd		: $("#sbx_acntgAmtScCdDtl").val(),
				amtTypScCd			: $("#sbx_amtTypScCdDtl").val(),
				amtTypDtlScCd		: $("#sbx_amtTypDtlScCdDtl").val(),
				slpTypCd			: $("#sbx_slpTypCdDtl").val(),
				joulPbanScCd		: $("#sbx_joulPbanScCdDtl").val(),
				deltYn				: $("#sbx_deltYn").val()		
			};
		
		//원본 json
		let orgParam = {
				acctCd				: initObject.acctCd,
				acntgBusnClsfCd		: initObject.acntgBusnClsfCd,
				acntgDlTypCd		: initObject.acntgDlTypCd,
				acntgAmtScCd		: initObject.acntgAmtScCd,
				amtTypScCd			: initObject.amtTypScCd,
				amtTypDtlScCd		: initObject.amtTypDtlScCd,
				slpTypCd			: initObject.slpTypCd,
				joulPbanScCd		: initObject.joulPbanScCd,
				deltYn				: initObject.deltYn
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
 *  황석현 2021.05.06 최초작성
 */
function newChgValCheck() {
	let rtnValChk = false;
	console.log("newChgValCheck:"+$("#ibx_acctCd").val().length);
	if($("#ibx_acctCd").val().length > 0
			|| $("#ibx_acctCdNm").val().length > 0
			|| $("#ibx_acntgBusnClsfCd").val().length > 0
			|| $("#ibx_acntgBusnClsfCdNm").val().length > 0
			|| $("#ibx_acntgDlTypCd").val().length > 0
			|| $("#ibx_acntgDlTypCdNm").val().length > 0
			|| $("#ibx_acntgAmtScCd").val().length > 0
			|| $("#ibx_acntgAmtScCdNm").val().length > 0
			|| $("#ibx_amtTypScCd").val().length > 0
			|| $("#ibx_amtTypScCdNm").val().length > 0
			|| $("#ibx_amtTypDtlScCd").val().length > 0
			|| $("#ibx_amtTypDtlScCdNm").val().length > 0
			|| $("#ibx_slpTypCd").val().length > 0
			|| $("#ibx_joulPbanScCd").val().length > 0) {
		rtnValChk = true;
	}
	return rtnValChk;
}

/**
 * @설명: 입력된 코드를 조회하여 조회건이 있는 경우 신규 입력명에 세팅한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.02.02
 * @최종변경일: 
 * @매개변수: codeId : 조회할 코드 대상
 * 			ibxId : 조회결과 바인딩 콤보박스
 * 			value : 코드값
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.02.02 최초작성
 */
function setIbxNm(codeId, ibxId, value) {
	var reqParam = {};
	reqParam.codeId = codeId;
	reqParam.val = value;
	
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr113m/selectItmCdNm.do")
	.done(function(data) {

		var $targetEl = $("#" + ibxId);
		
		var codeNm = data.codeNm;
		if($.fn.isEmpty(codeNm)) {
			codeNm = "";
			$targetEl.removeAttr("disabled");
		} else {
			codeNm = codeNm;
			$targetEl.attr("disabled", "false");
		}
		$targetEl.val(codeNm);
		
	}).fail(function(data) {
		console.log("fail to selectItmCdNm!!!!");
	});
}

/**
 * @설명: 엑셀 저장
 * @최초작성자: 황석현
 * @최초작성일: 2021.02.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.02.02 최초작성
 */
function saveJoulItmCdExcel() {
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}
	
	var saveList= new Array();	//저장대상 배열 선언
	var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	
	//c,u,d,e 건만 추출
	for(var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		for(var key in item) {
			
			//유효값체크
			if(!isValid(i, item)) {
				$("#ibx_pswd").val("");
				return;
			}
			
			item[key] = $.trim(item[key]);
			item["seq"] = i + 1 + "행";
			item["amtTypScCd"] = item["amtTypScCd"];
			item["amtTypScCdNm"] = item["amtTypScCdNm"];
			item["amtTypDtlScCd"] = item["amtTypDtlScCd"];
			item["amtTypDtlScCdNm"] = item["amtTypDtlScCdNm"];
			item["pswd"] = $("#ibx_pswd").val();
		}
		saveList.push(item);
	}
	
	if(saveList.length == 0) {
		$.fn.msgBox("저장할 대상이 없습니다.");
		return;
	}

	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/jr/fijr113m/saveJoulItmCdMngListInfo.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상처리되었습니다");
					
					//재조회
					selectJoulItmCdMngList();
					
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
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

function isValid(rowIndex, item) {
	//회계코드
	if($.trim(item.acctCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 회계코드를 입력하세요.");
		return false;
	}
	if($.trim(item.acctCdNm) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 회계코드명을 입력하세요.");
		return false;
	}
	if(item.acctCd.length != 1) {
		$.fn.msgBox((rowIndex + 1) + "행의 회계코드는 1자리를 입력하세요.");
		return false;
	}
	if(strByteLength(item.acctCdNm) > 50) {
		$.fn.msgBox((rowIndex + 1) + "행의 회계코드명은 50자 이내로 입력하세요.");
		return false;
	}
	
	//업무분류코드
	if($.trim(item.acntgBusnClsfCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 업무분류코드를 입력하세요.");
		return false;
	}
	if($.trim(item.acntgBusnClsfCdNm) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 업무분류코드명을 입력하세요.");
		return false;
	}
	if(item.acntgBusnClsfCd.length != 2) {
		$.fn.msgBox((rowIndex + 1) + "행의 업무분류코드는 2자리를 입력하세요.");
		return false;
	}
	if(strByteLength(item.acntgBusnClsfCdNm) > 90) {
		$.fn.msgBox((rowIndex + 1) + "행의 업무분류코드명은 90자 이내로 입력하세요.");
		return false;
	}
	
	//거래유형코드
	if($.trim(item.acntgDlTypCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 거래유형코드를 입력하세요.");
		return false;
	}
	if($.trim(item.acntgDlTypCdNm) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 거래유형코드명을 입력하세요.");
		return false;
	}
	if(item.acntgDlTypCd.length != 4) {
		$.fn.msgBox((rowIndex + 1) + "행의 거래유형코드는 4자리를 입력하세요.");
		return false;
	}
	if(strByteLength(item.acntgDlTypCdNm) > 90) {
		$.fn.msgBox((rowIndex + 1) + "행의 거래유형코드명은 90자 이내로 입력하세요.");
		return false;
	}
	
	//금액구분코드
	if($.trim(item.acntgAmtScCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액구분코드를 입력하세요.");
		return false;
	}
	if($.trim(item.acntgAmtScCdNm) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액구분코드명을 입력하세요.");
		return false;
	}
	if(item.acntgAmtScCd.length != 7) {
		$.fn.msgBox((rowIndex + 1) + "행의금액구분코드는 7자리를 입력하세요.");
		return false;
	}
	if(strByteLength(item.acntgAmtScCdNm) > 150) {
		$.fn.msgBox((rowIndex + 1) + "행의 금액구분코드명은 150자 이내로 입력하세요.");
		return false;
	}
	
	//금액유형구분코드
	if($.trim(item.amtTypScCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형구분코드를 입력하세요.");
		return false;
	}
	if($.trim(item.amtTypScCdNm) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형구분코드명을 입력하세요.");
		return false;
	}
	if(item.amtTypScCd.length != 2) {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형구분코드는 2자리를 입력하세요.");
		return false;
	}
	if(strByteLength(item.amtTypScCdNm) > 150) {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형구분코드명은 150자 이내로 입력하세요.");
		return false;
	}
	
	//금액유형상세구분코드
	if($.trim(item.amtTypDtlScCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형상세구분코드를 입력하세요.");
		return false;
	}
	if($.trim(item.amtTypDtlScCdNm) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형상세구분코드명을 입력하세요.");
		return false;
	}
	if(item.amtTypDtlScCd.length != 2 && item.amtTypDtlScCd.length != 3 && item.amtTypDtlScCd.length != 10) {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형상세구분코드는 2자리 또는 3자리 또는 10자리를 입력하세요.");
		return false;
	}
	if(strByteLength(item.amtTypDtlScCdNm) > 150) {
		$.fn.msgBox((rowIndex + 1) + "행의 금액유형상세구분코드명은 150자 이내로 입력하세요.");
		return false;
	}
	
	//코드 종속성 체크
	if(item.acntgBusnClsfCd != item.acntgDlTypCd.substr(0, 2)) {
		$.fn.msgBox((rowIndex + 1) + "행의 거래유형코드를 등록할 수 없습니다.(업무분류코드:" + item.acntgBusnClsfCd + ")");
		return;
	}
	
	if(item.acntgDlTypCd != item.acntgAmtScCd.substr(0, 4)) {
		$.fn.msgBox((rowIndex + 1) + "행의 금액구분코드를 등록할 수 없습니다.(거래유형코드:" + item.acntgDlTypCd + ")");
		return;
	}

	//분개공시구분 체크
	if($.trim(item.joulPbanScCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 분개공시구분코드를 입력하세요.");
		return false;
	}
	if(item.joulPbanScCd.length != 1) {
		$.fn.msgBox((rowIndex + 1) + "행의 분개공시구분코드는 1자리를 입력하세요.");
		return false;
	}
	
	return true;
}

/**
 * @설명: 코드 목록 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.19
 * @최종변경일: 
 * @매개변수:	codeId : 조회할 코드 대상
 * 			selId : 조회결과 바인딩 콤보박스
 * 			value : 종속하는 코드값
 * 			scCd : 전체,선택 표시 구분값
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.19 최초작성
 */
function selectItmCode(codeId, selId, value, scCd) {
	var reqParam = {};
	reqParam.codeId = codeId;
	reqParam.val = value;
	
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr113m/selectItmCdList.do",{async:false})
	.done(function(data) {
		//콤보박스 세팅
		var $targetEl = $("#" + selId);
		//콤보박스 option세팅
		var codeList = data.list;
		var optionStr = '<option value="">-전체-</option>';
		if(scCd == "2") optionStr = '<option value="">-선택-</option>';
		
		for (let j = 0; j < codeList.length; j++) {
			let codeData = codeList[j];
			optionStr += '<option value="' + codeData.code + '">' + codeData.codeNm + '</option>';
		}
		$targetEl.html(optionStr);
		
	}).fail(function(data) {
		console.log("fail to selectItmCode!!!!");
	});
}

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
 * @최초작성일: 2021.01.19
 * @최종변경일: 
 * @매개변수:	args
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.19 최초작성
 */
function setDoubleClickDtlInfo(args) {
	
	var selectedIndex = args.itemIndex;
	var selectedObj = args.item;

	//신규등록 모드에서 더블클릭할 경우
	if(NEW_MODI_SC_CD == "I") {
		setObjStateChg("CAN");
		NEW_MODI_SC_CD = "U";
	}
	
	selectItmCode("ACCT_CD", "sbx_acctCdDtl", selectedObj.acctCd, "2");
	selectItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCdDtl", selectedObj.acctCd, "2");
	selectItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCdDtl", selectedObj.acntgBusnClsfCd, "2");
	selectItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCdDtl", selectedObj.acntgDlTypCd, "2");
	selectItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCdDtl", selectedObj.acntgBusnClsfCd, "2");
	selectItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCdDtl", selectedObj.amtTypScCd, "2");
	selectItmCode("SLP_TYP_CD", "sbx_slpTypCdDtl", selectedObj.slpTypCd, "2");
	$.fn.renderCombobox({
		useFirstOption : true,
		codeArr        : ["JOUL_PBAN_SC_CD"],
		selArr         : ["sbx_joulPbanScCdDtl"]
	});
	
	$("#sbx_acctCdDtl").val(selectedObj.acctCd);
	$("#sbx_acntgBusnClsfCdDtl").val(selectedObj.acntgBusnClsfCd);
	$("#sbx_acntgDlTypCdDtl").val(selectedObj.acntgDlTypCd);
	$("#sbx_acntgAmtScCdDtl").val(selectedObj.acntgAmtScCd);
	$("#sbx_amtTypScCdDtl").val(selectedObj.amtTypScCd);
	$("#sbx_amtTypDtlScCdDtl").val(selectedObj.amtTypDtlScCd);
	$("#sbx_slpTypCdDtl").val(selectedObj.slpTypCd);
	$("#sbx_joulPbanScCdDtl").val(selectedObj.joulPbanScCd);
	$("#sbx_deltYnDtl").val(selectedObj.deltYn);
	
	$("#sbx_acctCdDtl").attr("disabled", "false");
	$("#sbx_acntgBusnClsfCdDtl").attr("disabled", "false");
	if(selectedObj.deltYn == "Y") {
		$("#inqrMdfcZon").find("select").attr("disabled", true);
		$("#sbx_deltYnDtl").removeAttr("disabled");
	} else {
		$("#inqrMdfcZon").find("select").attr("disabled", false);
		$("#sbx_deltYnDtl").attr("disabled", "false");
	}
}

/**
 * @설명: 신규등록, 취소, 초기화 버튼 클릭시 화면 컨트롤
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.19
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.19 최초작성
 */
function setObjStateChg(value) {

	initObject = null;
	$("#ibx_pswd").val("");
	
	$("#sbx_acctCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_acntgBusnClsfCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_acntgDlTypCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_acntgAmtScCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_amtTypScCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_amtTypDtlScCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_slpTypCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_joulPbanScCdDtl").empty().append("<option value=''>-선택-</option>");
	$("#sbx_deltYnDtl").val("");
	
	if(value == "NEW"){
		$("#inqrMdfcZon").hide();
		$("#newRegZon").show();
		$("#btn_cancel").show();
		$("#btn_delete").hide();
		$("#btn_delete_cancel").hide();
		$("#btn_newReg").hide();
		$("#btn_init").hide();
		$("#newRegZon").find("select,input,button").attr("disabled", false);
		$("#ibx_acctCd").focus();
	} else {
		$("#inqrMdfcZon").show();
		$("#newRegZon").hide();
		$("#btn_cancel").hide();
		$("#btn_excel_save").hide();
		$("#btn_delete").show();
		$("#btn_newReg").show();
		$("#btn_init").show();
		$("#btn_save").show();
		
		$("#ibx_acctCd, #ibx_acctCdNm").val("");
		$("#ibx_acntgBusnClsfCd, #ibx_acntgBusnClsfCdNm").val("");
		$("#ibx_acntgDlTypCd, #ibx_acntgDlTypCdNm").val("");
		$("#ibx_acntgAmtScCd, #ibx_acntgAmtScCdNm").val("");
		$("#ibx_amtTypScCd, #ibx_amtTypScCdNm").val("");
		$("#ibx_amtTypDtlScCd, #ibx_amtTypDtlScCdNm").val("");
		$("#ibx_slpTypCd").val("");
		$("#ibx_joulPbanScCd").val("");
		
		$("#inqrMdfcZon").find("select").attr("disabled", true);
		$("#newRegZon").find("select,input,button").attr("disabled", true);
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
	}
}

/**
 * @설명: 분개 항목코드를 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.19
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.19 최초작성
 */
function selectJoulItmCdMngList() {
	$("#ckb_all").prop("checked", false);
	
	var reqParam = {};
	reqParam.acctCd = $("#sbx_acctCd").val();
	reqParam.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCd").val();
	reqParam.acntgDlTypCd = $("#sbx_acntgDlTypCd").val();
	reqParam.acntgAmtScCd = $("#sbx_acntgAmtScCd").val();
	reqParam.amtTypScCd = $("#sbx_amtTypScCd").val();
	reqParam.amtTypDtlScCd = $("#inp_amtTypDtlScCd").val();
	reqParam.deltYn = $("#sbx_deltYn").val();
	reqParam.joulPbanScCd = $("#sbx_joulPbanScCd").val();
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/jr/fijr113m/selectJoulItmCdMngList.do")
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
		setObjStateChg("INI");
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulItmCdMngList !!");
	});
}

/**
 * @설명: 신규생성, 수정 처리한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.19
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  황석현 2021.01.19 최초작성
 */
function saveJoulItmCd() {

	var reqParam = {};
	reqParam.newModiScCd = NEW_MODI_SC_CD;
	if(NEW_MODI_SC_CD == "I") {
		reqParam.acctCd = $("#ibx_acctCd").val();
		reqParam.acntgBusnClsfCd = $("#ibx_acntgBusnClsfCd").val();
		reqParam.acntgDlTypCd = $("#ibx_acntgDlTypCd").val();
		reqParam.acntgAmtScCd = $("#ibx_acntgAmtScCd").val();
		reqParam.amtTypScCd = $("#ibx_amtTypScCd").val();
		reqParam.amtTypDtlScCd = $("#ibx_amtTypDtlScCd").val();
		reqParam.acctCdNm = $("#ibx_acctCdNm").val();
		reqParam.acntgBusnClsfCdNm = $("#ibx_acntgBusnClsfCdNm").val();
		reqParam.acntgDlTypCdNm = $("#ibx_acntgDlTypCdNm").val();
		reqParam.acntgAmtScCdNm = $("#ibx_acntgAmtScCdNm").val();
		reqParam.amtTypScCdNm = $("#ibx_amtTypScCdNm").val();
		reqParam.amtTypDtlScCdNm = $("#ibx_amtTypDtlScCdNm").val();
		reqParam.slpTypCd = $("#ibx_slpTypCd").val();	//전표유형코드
		reqParam.joulPbanScCd = $("#ibx_joulPbanScCd").val();	//분개공시구분코드
		
		if($.fn.isEmpty(reqParam.acctCd) || $.trim(reqParam.acctCd).length != 1) {
			$.fn.msgBox("회계코드는 1자리로 입력해야 합니다.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.acctCdNm)) {
			$.fn.msgBox("회계코드명을 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgBusnClsfCd) || $.trim(reqParam.acntgBusnClsfCd).length != 2) {
			$.fn.msgBox("업무분류코드는 2자리로 입력해야 합니다.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgBusnClsfCdNm)) {
			$.fn.msgBox("업무분류코드명을 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgDlTypCd) || $.trim(reqParam.acntgDlTypCd).length != 4) {
			$.fn.msgBox("거래유형코드는 4자리로 입력해야 합니다.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgDlTypCdNm)) {
			$.fn.msgBox("거래유형코드명을 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgAmtScCd) || $.trim(reqParam.acntgAmtScCd).length != 7) {
			$.fn.msgBox("금액구분코드는 7자리로 입력해야 합니다.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgAmtScCdNm)) {
			$.fn.msgBox("금액구분코드명을 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.amtTypScCd) || $.trim(reqParam.amtTypScCd).length != 2) {
			$.fn.msgBox("금액유형구분코드는 2자리로 입력해야 합니다.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.amtTypScCdNm)) {
			$.fn.msgBox("금액유형구분코드명을 입력해 주십시오.");
			return;
		}

		if($.fn.isEmpty(reqParam.amtTypDtlScCd) || ($.trim(reqParam.amtTypDtlScCd).length != 2 && $.trim(reqParam.amtTypDtlScCd).length != 3 && $.trim(reqParam.amtTypDtlScCd).length != 10) ) {
			$.fn.msgBox("금액유형상세구분코드는  2자리 또는 3자리 또는 10자리로 입력해야 합니다.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.amtTypDtlScCdNm)) {
			$.fn.msgBox("금액유형상세구분코드명을 입력해 주십시오.");
			return;
		}
		
		if(!$.fn.isEmpty(reqParam.slpTypCd) && $.trim(reqParam.slpTypCd).length != 2) {
			$.fn.msgBox("전표유형코드는 2자리로 입력해야 합니다.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.joulPbanScCd)) {
			$.fn.msgBox("분개공시구분코드를 선택해 주십시오.");
			return;
		}
		
		if(reqParam.acntgBusnClsfCd != reqParam.acntgDlTypCd.substr(0, 2)) {
			$.fn.msgBox("거래유형코드를 등록할 수 없습니다.(업무분류코드:" + reqParam.acntgBusnClsfCd + ")");
			return;
		}
		
		if(reqParam.acntgDlTypCd != reqParam.acntgAmtScCd.substr(0, 4)) {
			$.fn.msgBox("금액구분코드를 등록할 수 없습니다.(거래유형코드:" + reqParam.acntgDlTypCd + ")");
			return;
		}
	} else {
		if($.fn.isEmpty(initObject)) {
			$.fn.msgBox("저장할 대상이 없습니다.");
			return;
		}
		
		//수정원데이터
		reqParam.srcAcctCd = initObject.acctCd;
		reqParam.srcAcntgBusnClsfCd = initObject.acntgBusnClsfCd;
		reqParam.srcAcntgDlTypCd = initObject.acntgDlTypCd;
		reqParam.srcAcntgAmtScCd = initObject.acntgAmtScCd;
		reqParam.srcAmtTypScCd = initObject.amtTypScCd;
		reqParam.srcAmtTypDtlScCd = initObject.amtTypDtlScCd;
		reqParam.srcSlpTypCd = initObject.slpTypCd;
		reqParam.srcJoulPbanScCd = initObject.joulPbanScCd;
		reqParam.srcDeltYn = initObject.deltYn;
		
		//저장할 값
		reqParam.acctCd = $("#sbx_acctCdDtl").val();
		reqParam.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCdDtl").val();
		reqParam.acntgDlTypCd = $("#sbx_acntgDlTypCdDtl").val();
		reqParam.acntgAmtScCd = $("#sbx_acntgAmtScCdDtl").val();
		reqParam.amtTypScCd = $("#sbx_amtTypScCdDtl").val();
		reqParam.amtTypDtlScCd = $("#sbx_amtTypDtlScCdDtl").val();
		reqParam.slpTypCd = $("#sbx_slpTypCdDtl").val();
		reqParam.joulPbanScCd = $("#sbx_joulPbanScCdDtl").val();
		reqParam.deltYn = $("#sbx_deltYnDtl").val();

		if($.fn.isEmpty(reqParam.acctCd)) {
			$.fn.msgBox("회계코드를 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgBusnClsfCd)) {
			$.fn.msgBox("업무분류코드를 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgDlTypCd)) {
			$.fn.msgBox("거래유형코드를 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.acntgAmtScCd)) {
			$.fn.msgBox("금액구분코드를 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.amtTypScCd)) {
			$.fn.msgBox("금액유형구분코드를 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.amtTypDtlScCd)) {
			$.fn.msgBox("금액유형상세구분코드를 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.slpTypCd)) {
			$.fn.msgBox("전표유형코드를 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.joulPbanScCd)) {
			$.fn.msgBox("분개공시구분코드를 입력해 주십시오.");
			return;
		}
		
		if($.fn.isEmpty(reqParam.deltYn)) {
			$.fn.msgBox("삭제여부를 입력해 주십시오.");
			return;
		}
		
		if(reqParam.acctCd == reqParam.srcAcctCd
			&& reqParam.acntgBusnClsfCd == reqParam.srcAcntgBusnClsfCd 
			&& reqParam.acntgDlTypCd == reqParam.srcAcntgDlTypCd
			&& reqParam.acntgAmtScCd == reqParam.srcAcntgAmtScCd
			&& reqParam.amtTypScCd == reqParam.srcAmtTypScCd
			&& reqParam.amtTypDtlScCd == reqParam.srcAmtTypDtlScCd
			&& reqParam.slpTypCd == reqParam.srcSlpTypCd
			&& reqParam.joulPbanScCd == reqParam.srcJoulPbanScCd
			&& reqParam.deltYn == reqParam.srcDeltYn
		) {
			$.fn.msgBox("변경사항이 없습니다."); //ECBU003
			return;
		}else if( reqParam.acntgDlTypCd == reqParam.srcAcntgDlTypCd
				&& reqParam.acntgAmtScCd == reqParam.srcAcntgAmtScCd
				&& reqParam.amtTypScCd == reqParam.srcAmtTypScCd
				&& reqParam.amtTypDtlScCd == reqParam.srcAmtTypDtlScCd
				&& (reqParam.slpTypCd != reqParam.srcSlpTypCd
				|| reqParam.joulPbanScCd != reqParam.srcJoulPbanScCd) ) {
			reqParam.newModiScCd = "U1";  //키값제외 전표유형코드, 분개공시구분코드  수정
		}
		//삭제Y->N
		if(initObject.deltYn == "Y" && reqParam.deltYn == "N"){
			reqParam.newModiScCd = "U2";
		}

		var sbx_acctCdDtlNm = $("#sbx_acctCdDtl option:selected").text();
		var pos = sbx_acctCdDtlNm.indexOf(': ');
		sbx_acctCdDtlNm = sbx_acctCdDtlNm.substr(pos+2);
		var sbx_acntgBusnClsfCdDtlNm = $("#sbx_acntgBusnClsfCdDtl option:selected").text();
		pos = sbx_acntgBusnClsfCdDtlNm.indexOf(': ');
		sbx_acntgBusnClsfCdDtlNm = sbx_acntgBusnClsfCdDtlNm.substr(pos+2);
		var sbx_acntgDlTypCdDtlNm = $("#sbx_acntgDlTypCdDtl option:selected").text();
		pos = sbx_acntgDlTypCdDtlNm.indexOf(': ');
		sbx_acntgDlTypCdDtlNm = sbx_acntgDlTypCdDtlNm.substr(pos+2);
		var sbx_acntgAmtScCdDtlNm = $("#sbx_acntgAmtScCdDtl option:selected").text();
		pos = sbx_acntgAmtScCdDtlNm.indexOf(': ');
		sbx_acntgAmtScCdDtlNm = sbx_acntgAmtScCdDtlNm.substr(pos+2);
		var sbx_amtTypScCdDtlNm = $("#sbx_amtTypScCdDtl option:selected").text();
		pos = sbx_amtTypScCdDtlNm.indexOf(': ');
		sbx_amtTypScCdDtlNm = sbx_amtTypScCdDtlNm.substr(pos+2);
		var sbx_amtTypDtlScCdDtlNm = $("#sbx_amtTypDtlScCdDtl option:selected").text();
		pos = sbx_amtTypDtlScCdDtlNm.indexOf(': ');
		sbx_amtTypDtlScCdDtlNm = sbx_amtTypDtlScCdDtlNm.substr(pos+2);

		reqParam.acctCdNm = sbx_acctCdDtlNm;
		reqParam.acntgBusnClsfCdNm = sbx_acntgBusnClsfCdDtlNm;
		reqParam.acntgDlTypCdNm = sbx_acntgDlTypCdDtlNm;
		reqParam.acntgAmtScCdNm = sbx_acntgAmtScCdDtlNm;
		reqParam.amtTypScCdNm = sbx_amtTypScCdDtlNm;
		reqParam.amtTypDtlScCdNm = sbx_amtTypDtlScCdDtlNm;
	}
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}
	reqParam.pswd = $("#ibx_pswd").val();
	
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/jr/fijr113m/saveJoulItmCdMngInfo.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상처리되었습니다");

					//재조회
					selectJoulItmCdMngList();
					
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 선택된 건 삭제한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.01.19
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  황석현 2021.01.19 최초작성
 */
function delJoulItmCd() {

	if($.fn.isEmpty(initObject)) {
		$.fn.msgBox("삭제할 대상이 없습니다."); //ECLU042
		return;
	}
	
	if(!$.fn.isEmpty(initObject) && initObject.deltYn == "Y") {
		$.fn.msgBox("삭제할수 없는 자료입니다."); //ECSU159
		return;
	}
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}
	
	var reqParam = {};
	reqParam.acctCd = $("#sbx_acctCdDtl").val();
	reqParam.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCdDtl").val();
	reqParam.acntgDlTypCd = $("#sbx_acntgDlTypCdDtl").val();
	reqParam.acntgAmtScCd = $("#sbx_acntgAmtScCdDtl").val();
	reqParam.amtTypScCd = $("#sbx_amtTypScCdDtl").val();
	reqParam.amtTypDtlScCd = $("#sbx_amtTypDtlScCdDtl").val();
	reqParam.deltYn = $("#sbx_deltYnDtl").val();
	reqParam.pswd = $("#ibx_pswd").val();
	
	$.fn.msgBox("삭제하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/jr/fijr113m/deleteJoulItmCdMngInfo.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상처리되었습니다");
					
					//재조회
					selectJoulItmCdMngList();
					
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
function delJoulItmCdList() {
	
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
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/jr/fijr113m/delJoulItmCdList.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("총" +data.targetCnt+"건 중 "+ data.resultCnt +"건 정상처리되었습니다");
					resetGrid();
					
					selectJoulItmCdMngList(); //재조회
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
 */
function delCanJoulItmCd() {
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}
	
	var reqParam = {
			acctCd 				: $("#sbx_acctCdDtl").val(),
			acntgBusnClsfCd		: $("#sbx_acntgBusnClsfCdDtl").val(),
			acntgDlTypCd		: $("#sbx_acntgDlTypCdDtl").val(),
			acntgAmtScCd		: $("#sbx_acntgAmtScCdDtl").val(),
			amtTypScCd			: $("#sbx_amtTypScCdDtl").val(),
			amtTypDtlScCd		: $("#sbx_amtTypDtlScCdDtl").val(),
			deltYn				: $("#sbx_deltYnDtl").val(),
			pswd				: $("#ibx_pswd").val()
	};
	
	if($.fn.isEmpty(reqParam.acntgBusnClsfCd)) {
		$.fn.msgBox("삭제할 대상이 없습니다."); //ECLU042
		return;
	}
		
	$.fn.msgBox("삭제취소 하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/jr/fijr113m/deleteCancelJoulItmCd.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상처리되었습니다");
					
					//재조회
					selectJoulItmCdMngList();
					
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
function delCanJoulItmCdList() {
	
	if($.fn.isEmpty($("#ibx_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요."); //ECIU037 비밀번호를 입력하세요.
		return false;
	}
	
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
				deltYn				: "N",
				pswd         		: pswd
			});
		}
	}
	
	if(delChkCnt == 0){
		$.fn.msgBox("삭제 취소할 대상이 없습니다."); //ECLU042
		return;
	}
	
	$.fn.msgBox(delChkCnt + "건을 삭제취소 하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/jr/fijr113m/deleteCancelJoulItmCdList.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("총" +data.targetCnt+"건 중 "+ data.resultCnt +"건 정상처리되었습니다");
					resetGrid();
					
					selectJoulItmCdMngList(); //재조회
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
 * @최초작성일: 2021.01.19
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.01.19 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}