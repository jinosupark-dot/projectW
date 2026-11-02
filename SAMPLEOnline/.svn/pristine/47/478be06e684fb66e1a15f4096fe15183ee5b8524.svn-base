/**
 * @시스템명: IFRS17
 * @업무명: 공시규칙 관리
 * @설명: 공시규칙 관리
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일:
 * @개정이력:
 *  이상범    2021.02.08.   최초작성
 *  이상범    2021.04.26.   2차 표준화
 *  이상범    2021.06.16.   3차 표준화
 *  이상범    2021.10.05.   공시항목구분코드 조회 조건 추가
 */

//전역변수 선언
var initObject = null;    //수정전 원데이터
var NEW_MODI_SC_CD = "U"; //신규,수정,삭제 저장 체크

let today = new Date();
let year  = today.getFullYear();
let month = ("0" + (today.getMonth() + 1)).slice(-2);
const toYmd = year + "-" + month + "-" + ("0" + today.getDate()).slice(-2);
const endYmd = "9999-12-31";
const toYm = year + "-" + month;
var perBtnId = ["btn_xlsup", "btn_save", "btn_delete", "btn_newReg", "btn_init"];

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
	
	//툴팁
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	//버튼 초기화
	$("#btn_cancel, #btn_excel_save").hide(); //취소

	//공통코드(통합수준코드) 콤보박스
	initCommCd();
	
	//event 초기화(엑셀업,다운로드,조회,저장)
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	$("#srch_sbx_pbanScCd").focus();

});

/**
 * @설명: 공통코드성 조회 
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initCommCd() {
	$.fn.loadCommonCode(["CALC_SGN_CD"]);
	
	//사용 부호만 등록
	let cdObj = $._commonObj.code["CALC_SGN_CD"];
	if(!isEmpty(cdObj)){
		for(let i=cdObj.length -1; i>=0; i--){
			if(cdObj[i].code == "1" || cdObj[i].code == "4") cdObj.splice(i,1);
		}
	}

	//콤보박스 세팅
	$.fn.renderCombobox({
		useFirstOption : true,
		codeArr        : ["CALC_SGN_CD"],
		selArr         : ["sbx_calcSgnCd"]
	});

	//코드Set
	selectItmCode("ACCT_CD", "sbx_acctCd", "");
	selectItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCd", "");
	fnItmCodeInit("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd");
	fnItmCodeInit("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd");
	fnItmCodeInit("AMT_TYP_SC_CD", "sbx_amtTypScCd");
	fnItmCodeInit("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd");
	
	//공시명,공시항목명 조회
	$("#srch_sbx_pbanScCd, #srch_sbx_pbanItmScCd").val("");
	selectPbanScCdList("PBAN_SC_CD", "srch_sbx_pbanScCd", "");
	
	//하단항목 Object disabled
	$("#footer_tbl").find("select,input,button").prop("disabled", true);
}

/**
 * @설명: event 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @개정이력: 
 */
function initEvent() {
	
	$(".search-item").find(".item").each(function(){ $(this).css({"margin-right":"15px"}) });
	
	//날짜 입력 숫자외 제거
	$("#inp_avlBgnYmd, #inp_avlEndYmd").on("keyup", function(){
		$(this).val(($(this).val()).replace(/[^0-9]/g,''));
	});
	
	//엑셀다운로드
	$(".btn-xlsdown").on("click", function(e){
		let fileName = "공시규칙관리_"
			         + $.replaceAll(toYm, '-','') 
                     + (((new Date()).getDate() < 10) ? "0" : "") + ((new Date()).getDate()) 
                     + ".xlsx";
		$.fn.exportGridExcel({
			id: 'gridDiv', 
			fileName: fileName
		});
	});
	
	//공시 change
	$("#srch_sbx_pbanScCd").on("change", function(e){
		selectPbanScCdList("PBAN_ITM_SC_CD", "srch_sbx_pbanItmScCd", $(this).val());
	});
	
	//하단공시 change
	$("#sbx_pbanScCd").on("change", function(e){
		if($(this).val() == ""){
			$("#sbx_pbanItmScCd").val("").prop("disabled", true);
		} else {
			selectPbanScCdList("PBAN_ITM_SC_CD", "sbx_pbanItmScCd", $(this).val());
			$("#sbx_pbanItmScCd").prop("disabled", false);
		}
	});
	
	//엑셀로드
	$(".btn-xlsup").on("click", function(e){
		let paramObj = {};
		let dataChk = true;
		paramObj.id = "gridDiv";					//그리드 ID
		paramObj.callbackFn = function(data) {		//그리드 바인딩 후 후처리 함수
			
			if(typeof data.list !== "undefined" && data.list.length > 0) {
				//데이터 체크
				for(let i=0; i<data.list.length;i++){
					data.list[i]["rowNo"] = i+2;
					if(!isValid(i+2, data.list[i])) dataChk = false; 
				}
				
				if(data.result == "1" && dataChk) {
					$.fn.msgBox(data.list.length + "건 정상적으로 로드하였습니다.");
					$("#btn_excel_save, #btn_cancel").show(); //저장,취소 show
					$("#btn_save, #btn_delete, #btn_newReg, #btn_init").hide(); //저장,삭제,신규등록,초기화 hide
					NEW_MODI_SC_CD = "E";
				} else{
					resetGrid();
				}
			} else {
				$.fn.msgBox("로드할 데이터가 없습니다.");
			}
			$("#inp_pswd").val("");
		};
		
		$.fn.loadGridExcel(paramObj);
	});
	
	//엑셀저장
	$("#btn_excel_save").on("click", function(e){
		if(NEW_MODI_SC_CD == "E") savePbanRlExcel();
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		resetGrid();              //gird 초기화
		fnFooterInit(true);       //하단영역 초기화
		$("#btn_save,#btn_delete,#btn_init,#btn_newReg").show(); //저장,삭제,신규등록,초기화 show
		$("#btn_cancel,#btn_excel_save").hide(); //취소,엑셀저장
		selectPbanRlList();       //조회
	});
	
	//저장
	$("#btn_save").on("click", function(e){
		if(!$.fn.isEmpty(initObject) && initObject.deltYn == "Y"){
			NEW_MODI_SC_CD = "D";
			modifyDelPlPbanRl();
		} else {
			if(NEW_MODI_SC_CD == "N"){
				savePbanRlNew();
			} else {
				NEW_MODI_SC_CD = "U";
				modifyPbanRl();
			}
		}
	});
	
	//삭제
	$("#btn_delete").on("click", function(e){
		NEW_MODI_SC_CD = "D";
		var vDeltYn = $("#sbx_deltYn").val();
		
		//더블클릭으로 선택된 항목이 없거나, 
		if(!$.fn.isEmpty(initObject)){
			modifyPbanRl();
		} else {
			modifyPlPbanRl();
		}
	});

	//신규등록
	$("#btn_newReg").on("click", function(e){
		if(chgValCheck()){
			$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>선택하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
					$("#btn_save, #btn_cancel").show(); //저장,취소 show
					$("#btn_delete, #btn_excel_save, #btn_newReg, #btn_init").hide(); //삭제,신규등록,초기화 hide
					fnFooterInit(false);
					NEW_MODI_SC_CD = "N";
					$("#sbx_pbanItmScCd,#sbx_acntgBusnClsfCd,#sbx_acntgDlTypCd,#sbx_acntgAmtScCd,#sbx_amtTypScCd,#sbx_amtTypDtlScCd").attr("disabled", true);
					$("#sbx_deltYn").val("N");
					
					$("#inp_avlBgnYmd").val(toYmd);
					$("#inp_avlEndYmd").val(endYmd);
					grid_check_all(false);
				}
			}, 2);
		} else {
			$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
			$("#btn_save, #btn_cancel").show(); //저장,취소 show
			$("#btn_delete, #btn_excel_save, #btn_newReg, #btn_init").hide(); //삭제,신규등록,초기화 hide
			fnFooterInit(false);
			NEW_MODI_SC_CD = "N";
			$("#sbx_pbanItmScCd,#sbx_acntgBusnClsfCd,#sbx_acntgDlTypCd,#sbx_acntgAmtScCd,#sbx_amtTypScCd,#sbx_amtTypDtlScCd").attr("disabled", true);
			$("#sbx_deltYn").val("N");
			
			$("#inp_avlBgnYmd").val(toYmd);
			$("#inp_avlEndYmd").val(endYmd);
			grid_check_all(false);
		}
	});
	
	//신규등록취소
	$("#btn_cancel").on("click", function(e){
		$("#btn_save,#btn_delete,#btn_init,#btn_newReg").show(); //저장,삭제,신규등록,초기화 show
		$("#btn_cancel,#btn_excel_save").hide(); //취소,엑셀저장
		$("#inp_avlBgnYmd").val("");
		$("#inp_avlEndYmd").val(""); 
		if(NEW_MODI_SC_CD == "E") resetGrid(); //엑셀로드 취소면 그리드를 초기화
		fnFooterInit(true);
	});
	
	//초기화
	$("#btn_init").on("click", function(e){
		if(chgValCheck()){
			$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>선택하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					fnBodyInit();
					fnFooterInit(true);
					$("#btn_delete").show();
					$("#ckb_all").prop("disabled", true);
				}
			}, 2);
		} else {
			fnBodyInit();
			fnFooterInit(true);
			$("#btn_delete").show();
			$("#ckb_all").prop("disabled", true);
		}
	});
	
	//회계코드 change
	$("#sbx_acctCd").on("change", function(e){
		$("#sbx_acntgBusnClsfCd").val("");	
		if($(this).val() == ""){
			fnItmCodeInit("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCd");
			$("#sbx_acntgBusnClsfCd,#sbx_acntgDlTypCd,#sbx_acntgAmtScCd,#sbx_amtTypScCd,#sbx_amtTypDtlScCd").val("").attr("disabled", true);
		} else {
			setItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCd", "");
			$("#sbx_acntgBusnClsfCd").attr("disabled", false);
		}
		fnItmCodeInit("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd");
		fnItmCodeInit("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd");
		fnItmCodeInit("AMT_TYP_SC_CD", "sbx_amtTypScCd");
		fnItmCodeInit("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd");
		
	});
	
	//경리업무구분 change
	$("#sbx_acntgBusnClsfCd").on("change", function(e){
		if($(this).val() == ""){
			$("#sbx_acntgDlTypCd,#sbx_acntgAmtScCd,#sbx_amtTypScCd,#sbx_amtTypDtlScCd").val("").attr("disabled", true);
		} else {
			setItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "MAIN"); //경리거래유형명
			setItmCode("ACNTG_AMT_SC_CD", "sbx_acntgAmtScCd", "MAIN"); //경리금액구분명
			setItmCode("AMT_TYP_SC_CD", "sbx_amtTypScCd", "MAIN"); //금액유형구분명 
			fnItmCodeInit("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd"); //금액유형상세구분명
			$("#sbx_acntgDlTypCd,#sbx_acntgAmtScCd,#sbx_amtTypScCd").attr("disabled", false);
		}
	});
	
	//거래유형 change
	//거래유형이 변경되면 금액구분값을 비교 같은 코드분류값이면(앞4자리) 유지, 다르면 선택으로 돌림
	$("#sbx_acntgDlTypCd").on("change", function(e){
		if($("#sbx_acntgAmtScCd").val() != "" && ($("#sbx_acntgAmtScCd").val()).indexOf($(this).val()) == -1){
			$("#sbx_acntgAmtScCd").val("");
		} else if($(this).val() == ""){
			$("#sbx_acntgAmtScCd").val("");
		}
		let param = {
				codeId           : "AMT_TYP_SC_CD",
				selId            : "sbx_amtTypScCd",
				orgAmtTypScCd    : $("#sbx_amtTypScCd").val(),
				orgAmtTypDtlScCd : $("#sbx_amtTypDtlScCd").val(),
				acntgDlTypCd     : $("#sbx_acntgDlTypCd").val(),
				acntgAmtScCd     : $("#sbx_acntgAmtScCd").val(),
				amtTypScCd       : "",
				amtTypDtlScCd    : ""
				
		};
		setItmCode2(param);
		
		if($(this).val() == "" || ($("#sbx_acntgAmtScCd").val()).substring(0,4) != $(this).val()){
			param.codeId = "ACNTG_AMT_SC_CD";
			param.selId = "sbx_acntgAmtScCd";
			setItmCode2(param);
		}
	});
	
	//금액구분 change
	//금액구분이 변경되면 앞4자리가 동일한 경리거래유형 셋팅
	$("#sbx_acntgAmtScCd").on("change", function(e){
		if($(this).val()!="") $("#sbx_acntgDlTypCd").val(($(this).val()).substring(0,4));
		let param = {
				codeId           : "AMT_TYP_SC_CD",
				selId            : "sbx_amtTypScCd",
				orgAmtTypScCd    : $("#sbx_amtTypScCd").val(),
				orgAmtTypDtlScCd : $("#sbx_amtTypDtlScCd").val(),
				acntgDlTypCd     : $("#sbx_acntgDlTypCd").val(),
				acntgAmtScCd     : $("#sbx_acntgAmtScCd").val(),
				amtTypScCd       : "",
				amtTypDtlScCd    : ""
				
		};
		setItmCode2(param);
	});
	
	//금액유형 change
	$("#sbx_amtTypScCd").on("change", function(e){
		if($(this).val() == ""){
			$("#sbx_amtTypDtlScCd").val("").prop("disabled", true);
		} else {
			setItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", "");
			$("#sbx_amtTypDtlScCd").prop("disabled", false);
		}
		
	});

	//금액유형상세 change
	$("#sbx_amtTypDtlScCd").on("change", function(e){
	});
	
	$(".search-item").find("select, input").on("keypress", function(e){
		if(e.keyCode == 13){
			$("#btn_search").click();
			return false;
		}
	});
}

/**
 * @설명: 엑셀로드 validate check
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function isValid(rowIndex, item) {
	//필수항목체크(공시,공시항목,유효일자,부호,삭제여부)
	var arrCd = ["pbanScCd","pbanItmScCd","avlBgnYmd","avlEndYmd","calcSgnCdNm","deltYn"];
	var arrNm = ["공시구분코드","공시항목코드","유효시작일","유효종료일","부호","삭제여부"];
	var arrAcntgCd = ["acctCd","acntgBusnClsfCd","acntgDlTypCd","acntgAmtScCd","amtTypScCd","amtTypDtlScCd"];
	var arrAcntgNm = ["회계코드","경리업무분류코드","경리거래유효코드","경리금액구분코드","금액유형구분코드","금액유형상세구분코드"];

	var errMsg = "";
	var pbanScCdList = $._commonObj.code["PBAN_SC_CD"];
	var dtPattern = /^(19|20|99)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/; //날짜 패턴 정규식 
	
	for(var i=0;i<arrCd.length;i++){
		//항목있는지체크
		if(isEmpty(item[arrCd[i]])){
			errMsg = arrNm[i] + "가 없습니다.";
			break;
		} 
		//항목에 값이 있는지 체크
		if($.trim(item[arrCd[i]]) == ""){
			errMsg = arrNm[i] + "입력값이 없습니다.";
			break;
		}
		//----------항목별 입력값 체크
		var val = $.trim(item[arrCd[i]]);
		
		//공시코드
		if(arrCd[i] == "pbanScCd"){
			var chkPbanCd = false;
			for(var k=0;k<pbanScCdList.length;k++){
				if($.trim(val) == pbanScCdList[k].code){
					chkPbanCd = true;
					break;
				}
			}
			if(!chkPbanCd){
				errMsg = arrNm[i] + "를 찾을 수 없습니다.";
				break;
			}
		}
		
		//날짜형식체크
		if(arrCd[i] == "avlBgnYmd" || arrCd[i] == "avlEndYmd"){
			var ymd = $.replaceAll(val, '-','');
			var bgnYmdCompare = new Date(ymd.substring(0,4), parseInt(ymd.substring(4,6))-1, ymd.substring(6));
			//날짜형식체크
			if(!dtPattern.test(ymd)){
				errMsg = arrNm[i] + "("+ymd+") 날짜 형식이 올바르지 않습니다.";
				break;
			}
		}
		//유효종료일자
		if(arrCd[i] == "avlEndYmd"){
			var bgnYmd = $.replaceAll($.trim(item["avlEndYmd"]), '-','');
			var endYmd = $.replaceAll(val, '-','');
			
			//시작일이 종료일이 클때
			var bgnYmdCompare = new Date(bgnYmd.substring(0,4), parseInt(bgnYmd.substring(4,6))-1, bgnYmd.substring(6));
			var endYmdCompare = new Date(endYmd.substring(0,4), parseInt(endYmd.substring(4,6))-1, endYmd.substring(6));
			if(bgnYmdCompare.getTime() > endYmdCompare.getTime()){
				errMsg = "유효시작일이 " + arrNm[i] + " 보다 클 수 없습니다.";
				break;
			}
		}
		//부호
		if(arrCd[i] == "calcSgnCdNm"){
			if(val != "+" && val != "-"){
				errMsg = arrNm[i] + "(+,-)를 확인하세요.";
				break;
			}
		}
		//삭제여부
		if(arrCd[i] == "deltYn"){
			val = val.toUpperCase(); //대문자
			if(val != "Y" && val != "N"){
				errMsg = arrNm[i] + "(Y,N)를 확인하세요.";
				break;
			}
		}
	}
	if(errMsg != ""){
		$.fn.msgBox(rowIndex + "행의 " + errMsg);
		return false;
	}
	
	errMsg = "";
	//5개 항목코드 모두 등록 되던가 모두 안되던가 
	var anctgCdChk = false;
	var defAcntgVal = (isEmpty(item[arrAcntgCd[0]])) ? "" : $.trim(item[arrAcntgCd[0]]);
	for(var i=0;i<arrAcntgCd.length;i++){
		var val = (isEmpty(item[arrAcntgCd[i]])) ? "" : $.trim(item[arrAcntgCd[i]]);
		//모두 빈값
		if(defAcntgVal == ""){
			if(val != ""){
				errMsg = "항목코드는 모두 입력하거나 제외되어야 합니다.";
				break;
			}
		}
		//모두 입력값
		else {
			if(val == ""){
				errMsg = "항목코드는 모두 입력하거나 제외되어야 합니다.";
				break;
			}
		}
	}
	if(errMsg != ""){
		$.fn.msgBox(rowIndex + "행의 " + errMsg);
		return false;
	}
	
	return true;
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initGrid(){

	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 340,
		editing: false,
		sorting: true,
		paging: true,
		confirmDeleting: false,
		fields : [
			{ name: "check", title: "선택", width: 40, sorting: false, editing: false, align:"center", headerTemplate:function() {
				return $("<input>").attr("id", "ckb_all").attr("type", "checkbox").prop("disabled",true)
				                   .on("change", function() {
										if(this.checked && !$.fn.isEmpty(initObject)){
											if(chgValCheck()){
												$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>선택하시겠습니까?", function(obj) {
													if(obj.btn_ok) {
														fnFooterInit(true);
								        	   			$("#btn_delete").show();
								        	   			$("#ckb_all").prop("checked", true);
								        	   			grid_check_all(true);
													} else {
														$("#ckb_all").prop("checked", false);
													}
												}, 2);
											} else {
												fnFooterInit(true);
						        	   			$("#btn_delete").show();
						        	   			$("#ckb_all").prop("checked", true);
						        	   			grid_check_all(this.checked);
											}
										} else {
											grid_check_all(this.checked);
										}
				                   });
			}, itemTemplate:function(value, item) {
				var $result = $("<input>").attr("type", "checkbox")
				            .attr("id", "ckb_" + item.pbanSno)
				            .attr("checked",  (item.deltYn=="Y") ? false : (value || item.checked))
				            .prop("disabled", (item.deltYn=="Y") ? true : false)
				            .on("change", function(){
				            	item.checked = $(this).is(":checked");
				            	    
			            	   	//더블클릭된 항목이 있는데 선택했을때  
			            	   	if($(this).is(":checked") && !$.fn.isEmpty(initObject)){
			            	   		//항목이 있을때 변경여부 체크( chgValCheck == true 변경됨)
			            			if(chgValCheck()){
			            				$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>선택하시겠습니까?", function(obj) {
			            					if(obj.btn_ok) {
			            						fnFooterInit(true);
						           	   			$("#btn_delete").show();
			            					} else {
			            						//앞에서 변경된 항목 초기화
			            						item.checked = false;
			            						$("#ckb_" + item.pbanSno).prop("checked", false);
			            						
			            						//선택 row색상 돌림
			            						$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
			            						$("#ckb_" + initObject.pbanSno).closest("tr").addClass("highlight");
			            					}
			            				}, 2);
			            			} else {
			            				fnFooterInit(true);
				            			$("#btn_delete").show();
			            			}
			            	   	} else {
				            		if(!$(this).is(":checked")) $("#ckb_all").prop("checked", false);
				            	  		
				            		//체크했을때는 전체건수 체크
				            		let gridData = $("#gridDiv").jsGrid("option", "data");
				            		let chkCnt = 0;
				            		gridData.forEach(function(data, idx){
				            	   		if(data.checked) chkCnt++;
				            	   	});  
				    				if(gridData.length == chkCnt) $("#ckb_all").prop("checked", true);
			            	   	}
				            });

				return $result;
			}},
			{ name: "pbanScCd"         , title:"공시구분코드", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "pbanNm"           , title:"공시명", css:"cell", type: "text", width: 250, editing: false, align:"left"},
			{ name: "pbanItmScCd"      , title:"공시항목구분코드", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "pbanItmNm"        , title:"공시항목명", css:"cell", type: "text", width: 500, editing: false, align:"left"},
			{ name: "acctCd"           , title:"회계코드", css:"hideStyle", type: "text", width: 100, editing: false, align:"left"},
			{ name: "acctCdNm"         , title:"회계코드명", css:"cell", type: "text", width: 100, editing: false, align:"left"},
			{ name: "acntgBusnClsfCd"  , title:"경리업무분류코드", css:"hideStyle", type: "text", width: 150, editing: false, align:"center"},
			{ name: "acntgBusnClsfCdNm", title:"경리업무분류명", css:"cell", type: "text", width: 150, editing: false, align:"left"},
			{ name: "acntgDlTypCd"     , title:"경리거래유형코드", css:"hideStyle", type: "text", width: 150, editing: false, align:"center"},
			{ name: "acntgDlTypCdNm"   , title:"경리거래유형명", css:"cell", type: "text", width: 240, editing: false, align:"left"},
			{ name: "acntgAmtScCd"     , title:"경리금액구분코드", css:"hideStyle", type: "text", width: 260, editing: false, align:"center"},
			{ name: "acntgAmtScCdNm"   , title:"경리금액구분명", css:"cell", type: "text", width: 360, editing: false, align:"left"},
			{ name: "amtTypScCd"       , title:"금액유형구분코드", css:"hideStyle", type: "text", width: 150, editing: false, align:"center"},
			{ name: "amtTypScCdNm"     , title:"금액유형구분명", css:"cell", type: "text", width: 150, editing: false, align:"left"},
			{ name: "amtTypDtlScCd"    , title:"금액유형상세구분코드", css:"hideStyle", type: "text", width: 150, editing: false, align:"center"},
			{ name: "amtTypDtlScCdNm"  , title:"금액유형상세구분명", css:"cell", type: "text", width: 350, editing: false, align:"left"},
			{ name: "deltYn"           , title:"삭제여부", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "calcSgnCdNm"      , title:"부호", css:"cell", type: "text", width: 100, editing: false, align:"center"},
			{ name: "avlBgnYmd"        , title:"유효시작일자", css:"cell", type: "text", width: 100, editing: false, align:"center",
				itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");
				}
			},
			{ name: "avlEndYmd", title:"유효종료일자", css:"cell", type: "text", width: 100, editing: false, align:"center",
				itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");
				}
			},
			{ name: "trtDtm", title:"변경처리일시", css:"cell", type: "text", width: 150, editing: false, align:"center"}
		]
	});	
	
	//row rowDoubleClick
	gridObject.rowDoubleClick(function(args) {
		//하단항목 초기화
		if(NEW_MODI_SC_CD != "E"){
			
			let gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
			let chkCnt = 0;
			gridData.forEach(function(data, idx){
				if(data.checked) chkCnt++;
			});

			if(chkCnt == 0){
				//chgValCheck == true 변경되었을때
				if(chgValCheck()){
					$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>선택하시겠습니까?", function(obj) {
						if(obj.btn_ok) {
							$("#btn_cancel").click();
							initObject = args.item;
							setDtlInfo(args);	
						} else {
							$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
							$("#ckb_" + initObject.pbanSno).closest("tr").addClass("highlight");
						}
					}, 2);
				} else {
					$("#btn_cancel").click();
					initObject = args.item;
					setDtlInfo(args);
				}
			}
		}
	});
	
	//그리드 생성
	gridObject.gridCreate();
	
}

/**
 * @설명: 선택변경전 변경항목 체크
 * @최초작성자: 이상범
 * @최초작성일: 2021.04.20
 * @최종변경일: 
 * @매개변수:	
 * @반환값: 
 * @개정이력: 
 */
function chgValCheck(){
	let rtnValChk = false;
	let chgValChk = "N";
	
	if(!isEmpty(initObject)){
		//화면정보 json
		let bgnYmd = $("#inp_avlBgnYmd").val().trim();
		let endYmd = $("#inp_avlEndYmd").val().trim();
		let paramObj = {
				acctCd             : $("#sbx_acctCd").val(),
				acntgAmtScCd       : $("#sbx_acntgAmtScCd").val(),
				acntgBusnClsfCd    : $("#sbx_acntgBusnClsfCd").val(),
				acntgDlTypCd       : $("#sbx_acntgDlTypCd").val(),
				amtTypDtlScCd      : $("#sbx_amtTypDtlScCd").val(),
				amtTypScCd         : $("#sbx_amtTypScCd").val(),
				avlBgnYmd          : (bgnYmd != "") ? $.replaceAll(bgnYmd, '-','') : bgnYmd,
				avlEndYmd          : (endYmd != "") ? $.replaceAll(endYmd, '-','') : endYmd,
				calcSgnCd          : $("#sbx_calcSgnCd").val(),
				deltYn             : $("#sbx_deltYn").val(),		
				pbanItmScCd        : initObject.pbanItmScCd,
				pbanScCd           : initObject.pbanScCd,
				pbanSno            : initObject.pbanSno
			};
		
		//원본 json
		let orgParam = {
				acctCd             : initObject.acctCd,
				acntgAmtScCd       : initObject.acntgAmtScCd,
				acntgBusnClsfCd    : initObject.acntgBusnClsfCd,
				acntgDlTypCd       : initObject.acntgDlTypCd,
				amtTypDtlScCd      : initObject.amtTypDtlScCd,
				amtTypScCd         : initObject.amtTypScCd,
				avlBgnYmd          : initObject.avlBgnYmd,
				avlEndYmd          : initObject.avlEndYmd,
				calcSgnCd          : initObject.calcSgnCd,
				deltYn             : initObject.deltYn,		
				pbanItmScCd        : initObject.pbanItmScCd,
				pbanScCd           : initObject.pbanScCd,
				pbanSno            : initObject.pbanSno
			};
		chgValChk = (JSON.stringify(orgParam) === JSON.stringify(paramObj)) ? "N" : "Y";
	}
	if(NEW_MODI_SC_CD == "N" || chgValChk == "Y") rtnValChk = true;
	
	return rtnValChk;
}

/**
 * @설명: 그리드 전체선택 처리
 * @최초작성자: 이상범
 * @최초작성일: 2021.04.20
 * @최종변경일: 
 * @매개변수:	boolean
 * @반환값: 
 * @개정이력: 
 */
function grid_check_all(value) {
	var gridData = $("#gridDiv").jsGrid("option", "data");
	if(gridData.length > 0){
		for (let i = 0; i < gridData.length; i++) {
			gridData[i]["checked"] = value;
		}
		$("#gridDiv").jsGrid("option", "data", gridData);
	}
}

/**
 * @설명: 더블클릭한 행의 데이터를 하단 Detail 영역으로 값으로 셋팅한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수:	args
 * @반환값: 
 * @개정이력: 
 */
function setDtlInfo(args) {
	
	var selectedIndex = args.itemIndex;
	var selectedObj = args.item;

	$("#sbx_pbanScCd").val(selectedObj.pbanScCd);
	selectPbanScCdList("PBAN_ITM_SC_CD", "sbx_pbanItmScCd", selectedObj.pbanScCd);
	$("#sbx_pbanItmScCd").val(selectedObj.pbanItmScCd);
	$("#sbx_acctCd").val(selectedObj.acctCd);
	setItmCode("ACNTG_BUSN_CLSF_CD", "sbx_acntgBusnClsfCd", "");
	$("#sbx_acntgBusnClsfCd").val(selectedObj.acntgBusnClsfCd);
	
	//경리업무코드가 등록되어 있으면 관련된 코드들을 조회
	if(selectedObj.acntgBusnClsfCd != ""){
		setItmCode("ACNTG_DL_TYP_CD", "sbx_acntgDlTypCd", "MAIN"); //경리거래유형명
		var param = {
				codeId           : "ACNTG_AMT_SC_CD",
				selId            : "sbx_acntgAmtScCd",
				orgAmtTypScCd    : selectedObj.amtTypScCd,
				orgAmtTypDtlScCd : selectedObj.amtTypDtlScCd,
				acntgDlTypCd     : selectedObj.acntgDlTypCd,
				acntgAmtScCd     : "",
				amtTypScCd       : "",
				amtTypDtlScCd    : ""
				
		};
		setItmCode2(param);
		
		param.codeId = "AMT_TYP_SC_CD";
		param.selId = "sbx_amtTypScCd";
		param.acntgAmtScCd = selectedObj.acntgAmtScCd;
		setItmCode2(param);
	}
	
	$("#sbx_acntgDlTypCd").val(selectedObj.acntgDlTypCd);
	$("#sbx_acntgAmtScCd").val(selectedObj.acntgAmtScCd);
	$("#sbx_amtTypScCd").val(selectedObj.amtTypScCd);
	if(selectedObj.amtTypDtlScCd != ""){
		setItmCode("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd", ""); //금액유형상세구분명
		$("#sbx_amtTypDtlScCd").val(selectedObj.amtTypDtlScCd);
	}
	
	//공시명,공시항목명을 제외한 모두 활성화
	$("#footer_tbl").find("select,input,button").attr("disabled", false);
	$("#sbx_pbanScCd,#sbx_pbanItmScCd").attr("disabled", true);

	$("#inp_avlBgnYmd").val($.fn.dateFormat(selectedObj.avlBgnYmd, "-"));
	$("#inp_avlEndYmd").val($.fn.dateFormat(selectedObj.avlEndYmd, "-"));
	$("#sbx_calcSgnCd").val(selectedObj.calcSgnCd);
	$("#sbx_deltYn").val(selectedObj.deltYn);
	
	//삭제건은 삭제선택 외 모두 비활성화
	if(selectedObj.deltYn == "Y"){
		$("#footer_tbl").find("select,input,button").attr("disabled", true);
		$("#sbx_deltYn").attr("disabled", false);
		$("#btn_delete").hide();
	} else {
		$("#btn_delete").show();
	}
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
function setItmCode2(param) {
	let reqParam = {};
	reqParam.codeId = param.codeId;
	reqParam.acctCd = $("#sbx_acctCd").val();
	reqParam.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCd").val();
	
	reqParam.acntgDlTypCd = param.acntgDlTypCd;
	reqParam.acntgAmtScCd = param.acntgAmtScCd;
	reqParam.amtTypScCd = param.amtTypScCd;
	reqParam.amtTypDtlScCd = param.amtTypDtlScCd;
	reqParam.deltYn = "N";

	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr111m/setItmCode.do",{async:false})
	.done(function(data) {
		//콤보박스 세팅
		$._commonObj.code[param.codeId] = data.list;
		
		$.fn.renderCombobox({
			useFirstOption: true,
			codeArr: [param.codeId],
			selArr: [param.selId]
		});
		
		//기존있던값은 그대로 셋팅
		var chkCd = false;
		if(param.codeId == "AMT_TYP_SC_CD" && param.orgAmtTypScCd != ""){
			for(let i=0;i<data.list.length;i++){
				if(param.orgAmtTypScCd == data.list[i].code){
					chkCd = true; 
					break;
				}
			}
		}
		if(chkCd){
			$("#sbx_amtTypScCd").val(param.orgAmtTypScCd);
		} else  {
			$("#sbx_amtTypScCd").val("");
			fnItmCodeInit("AMT_TYP_DTL_SC_CD", "sbx_amtTypDtlScCd");
		}
	}).fail(function(data) {
		console.log("fail to setItmCode!!!!");
	});
}

/**
 * @설명: 공시,공시항목을 조회한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectPbanScCdList(codeId, selId, val) {
	let reqParam = {};
	reqParam.pbanScCd = val;
	
	let trgUrl = "/fi/dc/fidc112m/";
		trgUrl = trgUrl + ((codeId == "PBAN_SC_CD") ? "selectPbanScCdList.do" : "selectPbanItmScCdList.do"); 

	// 데이터 조회
	$.callAjax(reqParam, trgUrl,{async:false})
	.done(function(data) {
		
		$._commonObj.code[codeId] = data.list; //요청된 셀렉트박스 적용
		
		let firstText = "-선택-";
		if(selId.indexOf("srch_") != -1) firstText = "-전체-";
		
		$.fn.renderCombobox({
			useFirstOption  : true,
			firstOptionText : firstText,
			codeArr         : [codeId],
			selArr          : [selId]
		});
		
		//공시는 페이지로드될때 1번만 호출되므로 공시,공시항목은 모두 초기화한다.
		if(codeId == "PBAN_SC_CD"){
			//조회공시명 외 하단 공시 셋팅
			$.fn.renderCombobox({
				useFirstOption : true,
				codeArr        : ["PBAN_SC_CD"],
				selArr         : ["sbx_pbanScCd"]
			});
			
			//조회공시항목,하단공시항목 초기화 셋팅
			$._commonObj.code["PBAN_ITM_SC_CD"] = [];
			$.fn.renderCombobox({
				useFirstOption  : true,
				codeArr         : ["PBAN_ITM_SC_CD"],
				selArr          : ["sbx_pbanItmScCd"]
			});
			
			$.fn.renderCombobox({
				useFirstOption  : true,
				firstOptionText : "-전체-",
				codeArr         : ["PBAN_ITM_SC_CD"],
				selArr          : ["srch_sbx_pbanItmScCd"]
			});
		}
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulRlList !!");
	});
}

/**
 * @설명: 공시규칙목록을 조회한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectPbanRlList() {
	var reqParam = {
			pbanScCd    : $("#srch_sbx_pbanScCd").val(),
			pbanItmScCd : $("#srch_sbx_pbanItmScCd").val(),
			deltYn      : $("#srch_sbx_deltYn").val(),
			inpPbanItmScCd : $("#srch_inp_pbanItmScCd").val()
	};
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/dc/fidc112m/selectPbanRlList.do")
	.done(function(data) {
		resetGrid(); // 그리드 초기화
		let listData = data.list; //그리드 바인딩

		//화면에 보여줄 부호 셋팅
		if(!isEmpty(listData)){
			let calcObj = $._commonObj.code["CALC_SGN_CD"];
			for(let i=0;i<listData.length;i++){
				for(let k=0;k<calcObj.length;k++){
					if(listData[i].calcSgnCd == calcObj[k].code){
						listData[i].calcSgnCdNm = calcObj[k].codeNm;
						break;
					}
				}
			}
		}
		
		if(listData.length > 0) $("#ckb_all").prop("disabled", false);
		
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulRlList !!");
	});
}

/**
 * @설명: 공시규칙을 수정한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function modifyPbanRl(){
	let msgTxt = (NEW_MODI_SC_CD == "D") ? "삭제" : "저장"; 
	if(NEW_MODI_SC_CD != "N" && $.fn.isEmpty(initObject)) {
		$.fn.msgBox(msgTxt + "할 대상이 없습니다.");	
		return;
	}
	
	if(NEW_MODI_SC_CD == "D" && initObject.deltYn == "Y"){
		$.fn.msgBox("이미 삭제된 대상입니다.");	
		return;
	}
	
	let bgnYmd = $("#inp_avlBgnYmd").val().trim();
	let endYmd = $("#inp_avlEndYmd").val().trim();
	let paramObj = {
			pbanSno            : initObject.pbanSno,
			pbanScCd           : initObject.pbanScCd,
			pbanItmScCd        : initObject.pbanItmScCd,
			acctCd             : $("#sbx_acctCd").val(),
			acntgBusnClsfCd    : $("#sbx_acntgBusnClsfCd").val(),
			acntgDlTypCd       : $("#sbx_acntgDlTypCd").val(),
			acntgAmtScCd       : $("#sbx_acntgAmtScCd").val(),
			amtTypScCd         : $("#sbx_amtTypScCd").val(),
			amtTypDtlScCd      : $("#sbx_amtTypDtlScCd").val(),
			pbanNm             : $("#sbx_pbanScCd option:checked").text(),
			pbanItmNm          : $("#sbx_pbanItmScCd option:checked").text(),
			avlBgnYmd          : (bgnYmd != "") ? $.replaceAll(bgnYmd, '-','') : bgnYmd,
			avlEndYmd          : (endYmd != "") ? $.replaceAll(endYmd, '-','') : endYmd,
			calcSgnCd          : $("#sbx_calcSgnCd").val(),
			deltYn             : $("#sbx_deltYn").val()
		};

	let reqParam = {
			initObject  : paramObj,
			msgTxt      : msgTxt
		};
	if(NEW_MODI_SC_CD == "D") reqParam.initObject.deltYn = "Y";
	
	this.savePbanRl(reqParam);
}

/**
 * @설명: 체크박스선택 복수개의 공시규칙을 수정(삭제)
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function modifyPlPbanRl(){
	var saveList = new Array();	//저장대상 배열 선언
	let gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	let delChkCnt = 0;
	
	gridData.forEach(function(data, idx){
		if(data.checked){
			let pswd = "";
			if(delChkCnt == 0) pswd = $("#inp_pswd").val();
				
			delChkCnt++;
			saveList.push({
				pbanSno      : data.pbanSno,
				pbanScCd     : data.pbanScCd,
				pbanItmScCd  : data.pbanItmScCd,
				deltYn       : "Y",
				pswd         : pswd
			});
		}
	});

	if(delChkCnt == 0){
		$.fn.msgBox("삭제할 대상을 선택하세요.");	
		return;
	}
	
	if($.fn.isEmpty($("#inp_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요.", function(obj) { 
			$("#inp_pswd").focus(); 
		}, 1);
		return false;
	}
	
	$.fn.msgBox(delChkCnt + "건을 삭제하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/dc/fidc112m/modifyPlPbanRl.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("총" +data.targetCnt+"건 중 "+ data.resultCnt +"건 정상처리되었습니다");
					resetGrid();
					$("#btn_cancel").click();
					
					selectPbanRlList(); //재조회
				}
			}).fail(function(data){
				$("#inp_pswd").val("");
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 삭제된 공시규칙을 수정(삭제항목만 수정)
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function modifyDelPlPbanRl(){
	var saveList = new Array();	//저장대상 배열 선언
	
	if($.fn.isEmpty($("#inp_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요.", function(obj) { 
			$("#inp_pswd").focus(); 
		}, 1);
		return false;
	}
	
	if($("#sbx_deltYn").val() == "Y"){
		$.fn.msgBox("삭제여부를 변경하세요.");
		return false;
	}
	
	saveList.push({
		pbanSno      : initObject.pbanSno,
		pbanScCd     : initObject.pbanScCd,
		pbanItmScCd  : initObject.pbanItmScCd,
		deltYn       : "N",
		pswd         : $("#inp_pswd").val()
	});

	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/dc/fidc112m/modifyPlPbanRl.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상처리되었습니다");
					resetGrid();
					$("#btn_cancel").click();
					
					selectPbanRlList(); //재조회
				}
			}).fail(function(data){
				$("#inp_pswd").val("");
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 공시규칙을 신규저장한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function savePbanRlNew(){
	let bgnYmd = $("#inp_avlBgnYmd").val().trim();
	let endYmd = $("#inp_avlEndYmd").val().trim();
	let paramObj = {
			pbanScCd           : $("#sbx_pbanScCd").val(),
			pbanItmScCd        : $("#sbx_pbanItmScCd").val(),
			acctCd             : $("#sbx_acctCd").val(),
			acntgBusnClsfCd    : $("#sbx_acntgBusnClsfCd").val(),
			acntgDlTypCd       : $("#sbx_acntgDlTypCd").val(),
			acntgAmtScCd       : $("#sbx_acntgAmtScCd").val(),
			amtTypScCd         : $("#sbx_amtTypScCd").val(),
			amtTypDtlScCd      : $("#sbx_amtTypDtlScCd").val(),
			pbanNm             : $("#sbx_pbanScCd option:checked").text(),
			pbanItmNm          : $("#sbx_pbanItmScCd option:checked").text(),
			avlBgnYmd          : (bgnYmd != "") ? $.replaceAll(bgnYmd, '-','') : bgnYmd,
			avlEndYmd          : (endYmd != "") ? $.replaceAll(endYmd, '-','') : endYmd,
			calcSgnCd          : $("#sbx_calcSgnCd").val(),
			deltYn             : $("#sbx_deltYn").val()
		};

	let param = {};
	    param.msgTxt = "저장";
	    param.initObject = paramObj;
	
	savePbanRl(param);
}

/**
 * @설명: 저장 처리한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 */
function savePbanRl(param){
	if($.fn.isEmpty(param)) return;
	
	let reqParam = param;
		reqParam.initObject.newModiScCd = NEW_MODI_SC_CD;
		reqParam.initObject["acntgModChk"] = "N"; //Y|N 경리업무이하 셀렉트박스의 입력여부(N이면 미등록건으로 등록시 PK외 중복여부 체크하지 않는다)
	let msg = reqParam.msgTxt + "하시겠습니까?";
	
	if(NEW_MODI_SC_CD != "D"){
		if(isEmpty(param.initObject.pbanScCd)){
			$.fn.msgBox("공시명를 선택하세요.");
			return false;
		}
		if(isEmpty(param.initObject.pbanItmScCd)){
			$.fn.msgBox("공시항목명을 선택하세요.");
			return false;
		}
		
		//셀렉트박스 선택체크
		let titleNm = "";
		let obj = $("#footer_tbl").find("select");
		//acntg인 셀렉트박스에 값이 모두 없으면 통과
		let chkValAcntg = false;
		$.each(obj, function(){
			let id = "#" + $(this).attr("id");
			if($(this).attr("id").indexOf("sbx_acntg") > -1 || $(this).attr("id") == "sbx_acctCd"){
				if($.trim($(id).val()) != "") chkValAcntg = true;
			}
		});
		if(chkValAcntg){
			reqParam.initObject.acntgModChk = "Y";
			$.each(obj, function(){
				let id = "#" + $(this).attr("id");
				if($.trim($(id).val()) == ""){
					titleNm = $(id).closest("td").prev("th").html();
					return false;
				}
			});
		}
		
		if(titleNm == ""){
			if(reqParam.initObject.calcSgnCd == "") titleNm = "부호";
			if(reqParam.initObject.deltYn == "")titleNm = "삭제여부";
		}
		
		if(titleNm != ""){
			$.fn.msgBox(titleNm + "을(를) 선택하세요.");
			return false;
		}
		
		//유효일자 체크
		let dtPattern = /^(19|20|99)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/; //날짜 패턴 정규식 
		if($.trim($("#inp_avlBgnYmd").val()) == ""){
			$.fn.msgBox("유효시작일을 입력하세요.");
			return false;
		} else {
			let ymd = $.replaceAll($("#inp_avlBgnYmd").val().trim(), '-','');
			let bgnYmdCompare = new Date(ymd.substring(0,4), parseInt(ymd.substring(4,6))-1, ymd.substring(6));
			//날짜형식체크
			if(!dtPattern.test(ymd)){
				$.fn.msgBox("유효시작일 날짜 형식이 올바르지 않습니다.");
				return false;
			}
		}
		
		if($.trim($("#inp_avlEndYmd").val()) == ""){
			$.fn.msgBox("유효종료일을 입력하세요.");
			return false;
		} else {
			let bgnYmd = $.replaceAll($("#inp_avlBgnYmd").val().trim(), '-','');
			let endYmd = $.replaceAll($("#inp_avlEndYmd").val().trim(), '-','');
			if(!dtPattern.test(bgnYmd)){
				$.fn.msgBox("유효종료일 날짜 형식이 올바르지 않습니다.");
				return false;
			}
			
			//시작일이 종료일이 클때
			let bgnYmdCompare = new Date(bgnYmd.substring(0,4), parseInt(bgnYmd.substring(4,6))-1, bgnYmd.substring(6));
			let endYmdCompare = new Date(endYmd.substring(0,4), parseInt(endYmd.substring(4,6))-1, endYmd.substring(6));
			if(bgnYmdCompare.getTime() > endYmdCompare.getTime()){
				$.fn.msgBox("유효시작일이 종료일자보다 클 수 없습니다.");
				return false;
			}
		}
	}
	
	if($.fn.isEmpty($("#inp_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요.", function(obj) { 
			$("#inp_pswd").focus(); 
		}, 1);
		return false;
	}
	reqParam.initObject["pswd"] = $("#inp_pswd").val();
	
	$.fn.msgBox(msg, function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam.initObject, "/fi/dc/fidc112m/savePbanRl.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					$("#inp_pswd").val("");
					initObject = reqParam.initObject;
					if(NEW_MODI_SC_CD == "N"){
						$("#btn_cancel").click();
					}
					selectPbanRlList();
				}
			}).fail(function(data){
				$("#inp_pswd").val("");
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 엑셀저장 처리한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 */
function savePbanRlExcel() {
	
	var saveList = new Array();	//저장대상 배열 선언
	let gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	let cdObj = $._commonObj.code["CALC_SGN_CD"];
	
	if($.fn.isEmpty($("#inp_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요.", function(obj) { 
			$("#inp_pswd").focus(); 
		}, 1);
		return false;
	}
	let pswd = $("#inp_pswd").val();
	
	//c,u,d,e 건만 추출
	gridData.forEach(function(data, idx){
		data["pswd"] = pswd;
		let calcSgnChk = false;
		$.each(cdObj, function(){
			if(this["codeNm"] == $.trim(data.calcSgnCdNm)){
				calcSgnChk = true;
				data["calcSgnCd"] = this["code"];
				return false;
			}
		});
		if(calcSgnChk) saveList.push(data);
	});

	if(saveList.length == 0) {
		$.fn.msgBox("저장할 대상이 없습니다.");
		return;
	}

	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/dc/fidc112m/savePbanRlExcel.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("총" +data.targetCnt+"건 중 "+ data.resultCnt +"건 정상처리되었습니다");
					resetGrid();
					$("#btn_cancel").click(); //초기화
					
					selectPbanRlList(); //재조회
				}
			}).fail(function(data){
				$("#inp_pswd").val("");
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
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
	let reqParam = {};
	reqParam.codeId = codeId;
	reqParam.acctCd = $("#sbx_acctCd").val();
	reqParam.acntgBusnClsfCd = $("#sbx_acntgBusnClsfCd").val();

	//업무구분 변경시
	if(val != "MAIN") {
		reqParam.acntgDlTypCd = $("#sbx_acntgDlTypCd").val();
		reqParam.acntgAmtScCd = $("#sbx_acntgAmtScCd").val();
		reqParam.amtTypScCd = $("#sbx_amtTypScCd").val();
		reqParam.amtTypDtlScCd = $("#sbx_amtTypDtlScCd").val();
	}

	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr111m/setItmCode.do",{async:false})
	.done(function(data) {
		//콤보박스 세팅
		$._commonObj.code[codeId] = data.list;
		
		$.fn.renderCombobox({
			useFirstOption : true,
			codeArr        : [codeId],
			selArr         : [selId]
		});
		
		//기존있던값은 그대로 셋팅
		$("#sbx_acntgBusnClsfCd").val(reqParam.acntgBusnClsfCd);
		$("#sbx_acntgDlTypCd").val(reqParam.acntgDlTypCd);
		$("#sbx_acntgAmtScCd").val(reqParam.acntgAmtScCd);
		$("#sbx_amtTypScCd").val(reqParam.amtTypScCd);
		$("#sbx_amtTypDtlScCd").val(reqParam.amtTypDtlScCd);
		
	}).fail(function(data) {
		console.log("fail to setItmCode!!!!");
	});
}




/**
 * @설명: 코드 목록 조회한다.
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

	//코드 목록 조회
	$.callAjax(reqParam, "/fi/jr/fijr111m/selectItmCdList.do",{async:false})
	.done(function(data) {
		$._commonObj.code[codeId] = data.list;

		$.fn.renderCombobox({
			useFirstOption : true,
			codeArr        : [codeId],
			selArr         : [selId]
		});
	}).fail(function(data) {
		console.log("fail to selectItmCode!!!!");
	});
}

/**
 * @설명: Body 화면 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function fnBodyInit(){
	//조회 공시,조회 공시항목
	$("#srch_sbx_pbanScCd, #srch_sbx_pbanItmScCd").val(""); 
	resetGrid();
}

/**
 * @설명: 하단 화면 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function fnFooterInit(blnDis) {
	initObject = null;
	$("#footer_tbl").find("select,input").val("");
	$("#footer_tbl").find("select,input,button").prop("disabled", blnDis);
	$("#inp_pswd").val("");
	$("#ckb_all").prop("checked", false);
	
	NEW_MODI_SC_CD = "U";
}

/**
 * @설명: 드롭다운 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 */
function fnItmCodeInit(codeId, selId){
	$._commonObj.code[codeId] = [];
	$.fn.renderCombobox({
		useFirstOption : true,
		codeArr        : [codeId],
		selArr         : [selId]
	});
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.08
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}

function isEmpty(value) {
	return typeof value === "undefined" || value == null || value == "" ? true : false;
}