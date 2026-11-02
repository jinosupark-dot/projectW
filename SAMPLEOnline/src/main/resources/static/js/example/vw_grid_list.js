/*
	File Name      : vw_grid_list.js
	Description    : 공지사항 내역 조회
	Author         : sbpyeon
	Date           : 2020.12.07
 */
$(document).ready(function(){
		//사용하는 콤보박스용 코드 조회(필요한 코드는 한번에 조회한다.)
		$.fn.loadCommonCode(["IFRS_WRKEX_ITM_CD","WRKEX_DIST_TYP_CD"]);

		//화면 콤보박스 생성(사전 $.fn.loadCommonCode를 통해 코드가 메모리에 올라가 있어야 한다.)
		var paramObj = {};
		paramObj.codeArr = ["IFRS_WRKEX_ITM_CD","WRKEX_DIST_TYP_CD"];	//사용코드 배열
		paramObj.selArr = ["combo1","combo2"];	//바인딩할 Selectbox Id 배열
		/**
		paramObj.selValArr = ["05", "01"];					//콤보박스별 selected Value(optional)
		paramObj.useFirstOption = true;						//모든 콤보박스의 첫번째 option 생성여부(optional)
		paramObj.firstOptionText = "전체";					//모든 콤보박스의  첫번째 option text(optional)
		paramObj.firstOptionValue = "";						//모든 콤보박스의  첫번째 option value(optional)
		paramObj.displayMode = "label delim value";			//콤보박스 표현방식(label(default), value, label delim value, value delim label)
		paramObj.displayDelimiter = ":";					//콤보박스 Label에 사용될 delimiter(default:':')
		*/
		$.fn.renderCombobox(paramObj);
		
		//event 초기화
		initEvent();
		//그리드 초기화	
		initGrid();
});

function initEvent() {
	
	//CSV 다운로드 
	$("#btn_exportCSV").on("click", function(e){
		var paramObj = {};
		paramObj.id = "gridDiv";
		paramObj.fileName = "샘플그리드.csv";                   			//다운로드할 파일명
		paramObj.applyItemTemplate = false;								//그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
		$.fn.exportGridCSV(paramObj);
	});

	//Grid Excel 다운로드
	$("#btn_exportExcel").on("click", function(e){
		var paramObj = {};
		paramObj.id = "gridDiv";
		paramObj.fileName = "샘플그리드.xlsx";                   			//다운로드할 파일명
		paramObj.applyItemTemplate = false;								//그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
		$.fn.exportGridExcel(paramObj);
	});
		
	// 조회 버튼
	$("#btn_search").on("click", function(e){
		selectList();
	});
	
	$("#btn_msgBox").on("click", function(e){
		$.fn.msgBox("해당 기능이 잘 동작하는지 확인하세요.");
	});
	
	//메시지코드를 이용한 처리
	$("#btn_msgBox1").on("click", function(e){
		var paramObj = {
				messageKey : "IFRS009",
				messageParam : ["컬럼A", "TEST12345"],
		}
		$.fn.msgBoxByCd(paramObj);
	});

	$("#btn_msgBoxConfirm").on("click", function(e){
		$.fn.msgBox("처리하시겠습니끼?", function (obj) {
			if(obj.btn_ok) {
				alert("확인버튼 클릭됨");
			} else if(obj.btn_cancel) {
				alert("취소버튼 클릭됨");
			} else if(obj.btn_close) {
				alert("닫기 버튼이 클릭됨");
			}
		}, 2);
		
	});

	//메시지코드를 이용한 처리
	$("#btn_msgBoxConfirm1").on("click", function(e){
		var paramObj = {
				messageKey : "IFRS009",
				messageParam : ["컬럼A", "TEST12345"],
				callbackFn : function (obj) {
						if(obj.btn_ok) {
							alert("확인버튼 클릭됨");
						} else if(obj.btn_cancel) {
							alert("취소버튼 클릭됨");
						} else if(obj.btn_close) {
							alert("닫기 버튼이 클릭됨");
						}
					},	
				btnType : 2
		}
		$.fn.msgBoxByCd(paramObj);
		
	});
	
	
	$("#btn_showLoading").on("click", function(e){
		$.fn.showLoadingBar();
		setTimeout(function() {
			$.fn.hideLoadingBar();
		}, 3000);
	});

	$("#btn_openPopup").on("click", function(e){
		var popupOption = {
				url: "/example/gridSample.do",
				name: "main",
				width: 800,
				height: 600
		}
		var popup = $.fn.openPopup(popupOption);
	});

	//CSV 로드 
	$("#btn_loadCSV").on("click", function(e){
		loadCSV();
	});
	
	//CSV 로드 
	$("#btn_loadExcel").on("click", function(e){
		loadExcel();
	});
	
	// 그리드 Clear: 그리드 안에 "데이터만" 비움
	$("#btn_clear").on("click", function(e){
		grid_clear();
	});
	
	// 그리드  Destroy 버튼: 그리드 전체를 없앰
	$("#btn_destroy").on("click", function(e){
		grid_destroy();
	});

	// 서버에서 Warnning 발생
	//MainController 참고
	$("#btn_svrWarn1").on("click", function(e){
		testWarning(1);
	});

	// 서버에서 Warnning2 발생 - 에러메시지 파라미터 바인딩
	//MainController 참고
	$("#btn_svrWarn2").on("click", function(e){
		testWarning(2);
	});
	
	// common.js -> isEmpty function 예시
	$("#btn_isEmpty").on("click", function(e){
		$.fn.msgBox("isEmpty 테스트 예시:  \n" +
				"var str = ' test String ' \n" +
				"console.log($.fn.isEmpty(str));");
		var str = ' test String ';
		console.log("str isEmpty?: ",$.fn.isEmpty(str));
	});

	
	// 멀티헤더 그리드 테스트용
	$("#btn_multiheaderSample").on("click", function(e){
		//gridObejct.id("gridDiv_multiHeader");
		var popupOption = {
				url: "/example/gridSample_multiheader.do",
				name: "main",
				width: 1280,
				height: 900
		}
		var popup = $.fn.openPopup(popupOption);
	});

	// 그리드 수정, 검증, item템플릿 관련
	$("#btn_gridEdit").on("click", function(e){
		var popupOption = {
				url: "/example/gridSample_gridEdit.do",
				name: "main",
				width: 1280,
				height: 900
		}
		var popup = $.fn.openPopup(popupOption);
	});

	/*
	 * 인풋박스 테스트: Install input Filters. 예시 - 정규식 활용
	 */
	// int 정수만 가능 필터
	$("#intTextBox").inputFilter(function(value){
		 return $.isNumber(value)
	 });
	 
	// eng: 영어만 가능 필터
	 $("#engTextBox").inputFilter(function(value){		
		 return $.isEng(value)});
	 
}

function initGrid(){
	
	//이미지 건목록 jsGrid 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 580,
		editing: false,
		sorting: true,
		paging: true,
		selectHiglight:true,
		pageSize:20,
		deleteConfirm: "삭제하시겠습니까?",
		
		// 특정(소계) 행이면 "sub-total" css class를 append한다.
		rowClass: function(item, itemIndex){  // item은  Row안의 데이터이다. index는  Row Number이다. 
			if(item["ancmNtfId"] == "ID_10"){
				return "sub-total";
			}},
		
		//메뉴내용 필드를 채우기
		fields : [
			{ name: "ancmNtfId", title:"공지사항ID", css:"cell", type: "text", width: 100, align:"center"},
			{ name: "codeType", title:"공지유형", css:"cell", type: "select", width: 100, align:"center",
				items: $.fn.getGridCodeItem("IFRS_WRKEX_ITM_CD", true, "label delim value"),
				textField: "codeNm",
				valueField: "code"
			},
			{ name: "titl", title:"제목", css:"cell", type: "text", width: 200, align:"center"},
			{ name: "cont", title:"내용", css:"cell", type: "text", width: "auto", align:"center",
				
				// Enter키 치면 update apply되는 template 예시
				editTemplate: function(value){
						var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
						$result.on("keydown", function(e){
							if(e.which === 13){
								$("#gridDiv").jsGrid("updateItem");
								return false;
							}
						});
						return $result;
					}},
			{ name: "iqcnt", title:"조회건수", css:"cell", type: "number", width: 100, align:"center"},
			{ name: "ipdtm", title:"입력일시", css:"cell", type: "text", width: 100, align:"center", 
				itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");
				}
			},
			{ name: "inppCd", title:"입력자코드", css:"cell", type: "text",  width: 100, align:"left"}
//			{ name: "gridManupulate", title:"그리드조작", css:"cell", type: "control",  width: 70, align:"center",
//				// Total일 때 control 버튼 비활성화
//				itemtemplate: function(_, item){
//					if(item.isTotal)
//						return "";
//					return jsGrid.fields.control.prototype.itemTemplate.apply(this.arguments);
//				}}
		]
	});
	
	
	//row click event 샘플
	gridObject.rowClick(function(args) {
		var selectedIndex = args.itemIndex;
		var selectedObj = args.item;
		console.log("[rowClick]selectedIndex:" + selectedIndex);
		console.log("[rowClick]selectedObj:" + JSON.stringify(selectedObj));
	});
	
	//row rowDoubleClick event 샘플
	gridObject.rowDoubleClick(function(args) {
		var selectedIndex = args.itemIndex;
		var selectedObj = args.item;
		console.log("[rowDoubleClick]selectedIndex:" + selectedIndex);
		console.log("[rowDoubleClick]selectedObj:" + JSON.stringify(selectedObj));
	});
	
	
	//column 리사이즈  활성화(드래그로 컬럼 사이즈 조정)
	//gridObject.activeResizeColumn();
	
	//그리드 생성
	gridObject.gridCreate();
}


function selectList() {
	console.log("selectList");
	
	var reqParam = {
			"param1": "value1",
			"param2": "value2"
	}
	//example 조회 서비스 AJAX호출 후 그리드 바인딩
	//param 조건에 맞게 select한 데이터 가져옴
	$.callAjax(reqParam, "/example/selectList.do")
	.done(function(data) {
		$("#gridDiv").jsGrid("reset");		//그리드 데이터 초기화			
		var listData = data.dataList;  		//서버로 받아온 데이터 리스트
		//그리드 바인딩
		$("#gridDiv").jsGrid("loadData", listData).done(function(){  
		});
	}).fail(function(data){
	});		
}

function grid_clear() {
	console.log("grid_clear");
	$("#gridDiv").jsGrid("option", "data", []);	
}


function grid_destroy() {
	console.log("grid_destroy");
	$("#gridDiv").jsGrid("destroy");	
}

/**
 * 
 * @설명: CSV 파일을 그리드에 로드한다.
 * @최초작성자: 장창환
 * @최초작성일: 2021. 1. 14.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  장창환 2021. 1. 14. 최초작성
 *
 */
function loadCSV() {
	var paramObj = {};
	paramObj.id = "gridDiv";					//그리드 ID
	paramObj.callbackFn = function(data) {		//그리드 바인딩 후 후처리 함수
		if(data.result == "1") {
			$.fn.msgBox("정상적으로 로드하였습니다.");
		}
	};
	
	$.fn.loadGridCSV(paramObj); 
}

/**
 * 
 * @설명: Excel 파일을 그리드에 로드한다.
 * @최초작성자: 장창환
 * @최초작성일: 2021. 1. 14.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  장창환 2021. 1. 14. 최초작성
 *
 */
function loadExcel() {
	var paramObj = {};
	paramObj.id = "gridDiv";					//그리드 ID
	paramObj.callbackFn = function(data) {		//그리드 바인딩 후 후처리 함수
		if(data.result == "1") {
			$.fn.msgBox("정상적으로 로드하였습니다.");
		}
	};
	$.fn.loadGridExcel(paramObj); 
}

/**
 * 
 * @설명: 서버에서 Warnning 발생 예시
 * @최초작성자: 89001203
 * @최초작성일: 2021. 1. 20.
 * @최종변경일: 
 * @매개변수: type (1:일반 메시지 예시, 2: 파라미터 바인딩 메시지 예시
 * @반환값: any
 * @개정이력: 
 *  89001203 2021. 1. 20. 최초작성
 *
 */
function testWarning(type) {
	var url = "";
	if(type == 1) {
		url = "/main/warnnignTest.do";
	} else {
		url = "/main/warnnignTestParam.do";
	}
	
	$.callAjax({}, url)
	.done(function(data) {
	}).fail(function(data){
	});		
}

/**
 * 마감년월 달력 Selected 후처리
 * @설명: 
 * @최초작성자: 89001203
 * @최초작성일: 2021. 3. 4.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  89001203 2021. 3. 4. 최초작성
 *
 */
function afterMonth(value) {
	alert(value);
}
	

/**
 * 마감일 달력 Selected 후처리
 * @설명: 
 * @최초작성자: 89001203
 * @최초작성일: 2021. 3. 4.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  89001203 2021. 3. 4. 최초작성
 *
 */
function afterDate(value) {
	alert(value);
}

