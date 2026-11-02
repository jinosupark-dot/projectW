/**
 * @시스템명: IFRS17
 * @업무명: 통합수준 관리
 * @설명: 통합수준 매핑 관리
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.03
 * @최종변경일:
 * @개정이력: 
 *  이상범    2021.02.03.   최초작성
 *  이상범    2021.04.26.   2차 표준화
 *  이상범    2021.06.16.   3차 표준화
 *  황석현    2021.12.13.   공통코드 통합수준구분코드(UNTY_LV_SC_CD) 수정
 */

//전역변수 선언
var initObject = null;					//수정전 원데이터
let today = new Date();
let year = today.getFullYear();
let month = ((today.getMonth() + 1) < 10) ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
const toYm = year + "-" + month;
var perBtnId = ["btn_xlsup", "btn_save"];

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
	$("#btn_cancel").hide(); //취소
	$("#btn_excel_save").hide(); //엑셀저장
	
	//공통코드(통합수준코드) 콤보박스
	initCommCd();
	
	//event 초기화(엑셀업,다운로드,조회,저장)
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	$("#srch_sbx_untyLvScCdDtl").focus();
	
});

/**
 * @설명: 공통코드성 조회 
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initCommCd() {
	
	//공통코드 조회(통합수준코드)
	$.fn.loadCommonCode(["UNTY_LV_SC_CD"]);
	let commObj = $._commonObj.code.UNTY_LV_SC_CD;
	
	//통합수준코드명 변경(code : codeNm) 
	if(commObj.length > 0){
		for(let i=0; i<commObj.length; i++){
			let chgCodeNm = commObj[i].code + " : " + commObj[i].codeNm;
			commObj[i].codeNm = chgCodeNm;
		}
	}

	//콤보박스 세팅
	$.fn.renderCombobox({
		useFirstOption  : true,
		firstOptionText : "-전체-",
		codeArr         : ["UNTY_LV_SC_CD"],
		selArr          : ["srch_sbx_untyLvScCdDtl"]
	});
	$.fn.renderCombobox({
		useFirstOption  : true,
		codeArr         : ["UNTY_LV_SC_CD"],
		selArr          : ["sbx_untyLvScCdDtl"]
	});
}

/**
 * @설명: event 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @개정이력: 
 */
function initEvent() {
	//엑셀다운로드
	$(".btn-xlsdown").on("click", function(e){
		let fileName = "통합수준매핑관리_"
			         + $.replaceAll(toYm, '-','') 
                     + (((new Date()).getDate() < 10) ? "0" : "") + ((new Date()).getDate()) 
                     + ".xlsx";
		$.fn.exportGridExcel({
			id       : 'gridDiv', 
			fileName : fileName
		});
	});
	
	//엑셀로드
	$(".btn-xlsup").on("click", function(e){
		let paramObj = {};
		paramObj.id = "gridDiv";					//그리드 ID
		paramObj.callbackFn = function(data) {		//그리드 바인딩 후 후처리 함수
			if(typeof data.list !== "undefined" && data.list.length > 0) {
				//데이터 체크
				for(let i=0; i<data.list.length;i++){
					data.list[i]["rowNo"] = i+2; 
				}
				
				if(data.result != -1) {
					$("#btn_save").hide();
					$("#btn_excel_save,#btn_cancel").show();
					$.fn.msgBox(data.list.length + "건 정상적으로 로드하였습니다.");
				} else{
					resetGrid();
					$.fn.msgBox("엑셀로드 중 오류가 발생했습니다.");
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
		saveUntyLvMapnExcel();
	});
	
	//엑셀저장 취소
	$("#btn_cancel").on("click", function(e){
		$("#btn_excel_save,#btn_cancel").hide(); //엑셀저장,취소
		$("#btn_save").show(); //저장
		$("#inp_pswd").val("");
		
		fninit();
		resetGrid();
		
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		selectUntyLvMapnList();
	});
	
	//저장
	$("#btn_save").on("click", function(e){
		saveUntyLvMapn();
	});
	
	$(".search-item").find("select").on("keypress", function(e){
		if(e.keyCode == 13){
			selectUntyLvMapnList();
			return false;
		}
	});
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id              : "gridDiv",
		height          : 450,
		editing         : false,
		sorting         : true,
		paging          : true,
		confirmDeleting : false,
		fields : [
			{ name: "potflScCd"    , title:"포트폴리오구분코드", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "potflNm"      , title:"포트폴리오명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "untyLvScCd"   , title:"통합수준구분코드", css:"cell", type: "text", width: 150, editing: false, align:"center"},
			{ name: "untyLvNm"     , title:"통합수준명", css:"cell", type: "text", width: 200, editing: false, align:"left"},
			{ name: "caValidateChk", title:"확인", css:"cell", type: "text", width: 80, editing: false, align:"center"},
			{ name: "trtDtm"       , title:"처리일자", css:"cell", type: "text", width: 80, editing: false, align:"center",
				itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");
				}
			},
		]
	});	
	
	//row rowDoubleClick
	gridObject.rowDoubleClick(function(args) {
		initObject = args.item;
		setDtlInfo(args);
	});
	
	//그리드 생성
	gridObject.gridCreate();
	
}

/**
 * @설명: 더블클릭한 행의 데이터를 하단 Detail 영역으로 값으로 셋팅한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @매개변수:	args
 * @반환값: 
 * @개정이력: 
 */
function setDtlInfo(args) {
	
	let selectedIndex = args.itemIndex;
	let selectedObj = args.item;

	$("#sbx_untyLvScCdDtl").val(selectedObj.untyLvScCd);
	$("#inp_potflNm").val(selectedObj.potflNm); //포트폴리오명
}

/**
 * @설명: 통합수준매핑목록을 조회한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectUntyLvMapnList() {
	let reqParam = {
			untyLvScCd : $("#srch_sbx_untyLvScCdDtl").val()
	};
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/dc/fidc111m/selectUntyLvMapnList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		let listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
		//초기화
		fninit();
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulRlList !!");
	});
}

/**
 * @설명: 화면 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function fninit() {
	$("#sbx_untyLvScCdDtl, #inp_potflNm").val("");
}

/**
 * @설명: 저장 처리한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 */
function saveUntyLvMapn(){
	if(this.isEmpty($("#inp_potflNm").val())){
		$.fn.msgBox("변경할 포트폴리오를 선택하세요.");
		return;
	}
	
	if(this.isEmpty($("#sbx_untyLvScCdDtl").val())){
		$.fn.msgBox("통합수준을 선택하세요.");
		return;
	}
	
	if($("#sbx_untyLvScCdDtl").val() == initObject.untyLvScCd){
		$.fn.msgBox("변경사항이 없습니다.");
		return false;
	}
	
	if($.fn.isEmpty($("#inp_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요.", function(obj) { 
			$("#inp_pswd").focus(); 
		}, 1);
		return false;
	}
	
	var reqParam = {
			potflScCd  : initObject.potflScCd,
			untyLvScCd : $("#sbx_untyLvScCdDtl").val(),
			pswd       : $("#inp_pswd").val()
	};
	
	let commObj = $._commonObj.code.UNTY_LV_SC_CD;
	for(let i=0; i<commObj.length; i++){
		if(commObj[i].code == reqParam.untyLvScCd){
			reqParam.untyLvNm = commObj[i].codeAbbrNm;
			break;
		}
	}

	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax(reqParam, "/fi/dc/fidc111m/saveUntyLvMapn.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					selectUntyLvMapnList();
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
			
			$("#inp_pswd").val("");
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
function saveUntyLvMapnExcel() {
	
	var saveList = new Array();	//저장대상 배열 선언
	let gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	let commCdObj = $._commonObj.code.UNTY_LV_SC_CD;
	
	if(gridData.length == 0) {
		$("#inp_pswd").val("");
		$.fn.msgBox("저장할 대상이 없습니다.");
		return false;
	}
	
	if($.fn.isEmpty($("#inp_pswd").val())) {
		$.fn.msgBox("비밀번호를 입력하세요.", function(obj) { 
			$("#inp_pswd").focus(); 
		}, 1);
		return false;
	}

	//c,u,d,e 건만 추출
	let pswd = $("#inp_pswd").val();
	gridData.forEach(function(data, idx){
		data["pswd"] = pswd;

		$.each(commCdObj, function(){
			if(this["code"] == data["untyLvScCd"]){
				data["untyLvNm"] = this["codeAbbrNm"]; //통합수준명 조정
				saveList.push(data);
				return false;
			}
		});
	});

	if(gridData.length != saveList.length) {
		let nCnt = gridData.length - saveList.length;
		$("#inp_pswd").val("");
		$.fn.msgBox(nCnt + "건의 통합수준코드 정보를 찾을 수 없습니다.");
		return false;
	}

	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/dc/fidc111m/saveUntyLvMapnExcel.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("총" +data.targetCnt+"건 중 "+ data.resultCnt +"건 정상처리되었습니다");
					$("#btn_save").show();
					$("#btn_cancel,#btn_excel_save").hide();
					
					//재조회
					selectUntyLvMapnList();
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
			
			$("#inp_pswd").val("");
		}
	}, 2);
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.03
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