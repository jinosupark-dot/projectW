/**
 * @시스템명: IFRS17
 * @업무명: 배부기준코드_생성 JS
 * @설명: 배부기준코드_생성하는 화면 JS
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.06
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  김정민 2021.01.06 최초작성
 *  김정민 2021.06.14	-전체삭제 추가
 *  				-그리드 너비 수정
 *  김정민 2021.06.15 3차 소스표준화
 */
$(document).ready(function(){
	/*2021.04.30 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/*2021.06.15 화면명에 화면ID 추가*/
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	/*2021.06.15 버튼권한처리*/
	//전체삭제, 엑셀업로드, 행추가, 저장
	var btnIdArr = ["btn_delete", "btn_excel_upload", "btn_addGrid", "btn_save"];
	var permArr = [];
	for (var i = 0; i < btnIdArr.length; i++) {
		permArr.push({
			btnId : "#" + btnIdArr[i],
			type : "A"
		});
	}
	$.fn.setBtnPermission(permArr);
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	//포커스(배부기준코드)
	$("#ibx_wrkexDistStndCd").focus();
});

/**
 * @설명: event 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.06
 * @최종변경일: 
 * @개정이력: 
 *  김정민 2021.01.06 최초작성
 */
function initEvent() {
	//조회조건 입력창 keyup(배부기준코드)
	$("#ibx_wrkexDistStndCd").on("keypress", function(e){
		if(e.which == 13) {
			$("#btn_search").click();
			return false;
		}
	});
	
	//배부기준코드 조회 팝업
	$("#btn_distSearch").on("click", function(e){
		openPopupDistStndCd();
	});

	//조회
	$("#btn_search").on("click", function(e){
		selectDistStndCdList();
	});
	
	//엑셀다운로드
	$("#btn_excel_download").on("click", function(e){
		var strDate = $.datepicker.formatDate('yymmdd', new Date());
		var fileName = $(".main_title h3.title").text() + "_" + strDate + ".xlsx";
		$.fn.exportGridExcel({
			id: 'gridDiv', 
			fileName: fileName
		});
	});
	
	//엑셀업로드
	$("#btn_excel_upload").on("click", function(e){
		var paramObj = {};
		paramObj.id = "gridDiv";					//그리드 ID
		paramObj.callbackFn = function(data) {		//그리드 바인딩 후 후처리 함수
			if(data.result == "1") {
				$.fn.msgBox("정상적으로 로드하였습니다.");
			}
		};
		$.fn.loadGridExcel(paramObj); 
	});
		
	//저장
	$("#btn_save").on("click", function(e){
		saveGridDataAll();
	});
	
	//그리드 행추가
	$("#btn_addGrid").on("click", function(e){
		addGridData();
	});
	
	//전체삭제
	$("#btn_delete").on("click", function() {
		deleteAllData();
	});
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.06
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.06 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 600,
		editing: true,
		sorting: true,
		paging: true,
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				var status = 'u';	//수정
				if(item.status == 'c' || item.status == 'e') {	//신규, 엑셀로드는 c,e상태 유지 후 데이터 수정
				} else if(item.status == 'dd'){	//삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { //grid 삭제 아이콘 클릭 또는 deleteItem API이용시 진입
				//deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = 'dd';	//삭제 신청
				if(item.status == 'c' || item.status == 'e') {	//신규, 엑셀로드 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else  {	//u,d 는 삭제 상태로 처리 -> updateItem에서 최종  삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#gridDiv").jsGrid("updateItem", item);
					return item;
				}
			}
		},
		onItemEditing: function(args) {	//Grid Edit모드 진입시 처리
			if(typeof event === "undefined") {
				args.cancel = true;
				return;
			}
			
			//delete 상태 스킵
			if( args.item.status == 'd') {
				args.cancel = true;
			}
		},
		fields : [
			{ name: "seq", title:"순번", css:"cell", type: "text", width: 60, editing: false, align:"center", sorter:"number"},
			{ name: "wrkexDistStndCd", title:"배부기준코드", css:"cell", type: "text", width: 100, editing:true, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				/*2021.06.16 특정 브라우저에서 edite모드로 전환될 때 스크롤이 한칸 올라가는 현상 방지*/
				setTimeout(function() {
					$result.focus();
				});
				
				//maxlength
				//Enter 키 입력시 updateItem apply됨.
				$result
				.attr("maxlength", "5")
				.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDiv").jsGrid("updateItem");
					}
				});
				
				//신규, 엑셀로드 외엔 수정 불가
				if(item.status == "c" || item.status == "e") {
				} else {
					$result.attr("readonly", "true");
				}
				
				return $result;
			}},
			{ name: "wrkexDistStndCdNm", title:"배부기준코드명", css:"cell", type: "text", width: 300, editing:true, align:"left", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				//Enter 키 입력시 updateItem apply됨.
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDiv").jsGrid("updateItem");
					}
				});
				return $result;
			}},
			{ name: "extrtCntnt", title:"계산식설명", css:"cell", type: "text", width: 370, editing:true, align:"left", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				//Enter 키 입력시 updateItem apply됨.
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDiv").jsGrid("updateItem");
					}
				});
				return $result;
			}},
			{ name: "regDtm", title:"등록일자", css:"cell", type: "text",  width: 120, align:"center", editing: false, itemTemplate:function(value, item) {
				return item.status == "e" ? "" : $.fn.dateFormat(value, "-");			
			}},
			{ name: "trtDtm", title:"변경일자", css:"cell", type: "text",  width: 120, align:"center", editing: false, itemTemplate:function(value, item) {
				return item.status == "e" ? "" : $.fn.dateFormat(value, "-");			
			}},
			{ name: "trtrEno", title:"변경자사번", css:"cell", type: "text", width: 120, editing: false, align:"center", itemTemplate:function(value, item) {
				return item.status == "e" ? "" : value;			
			}},
			{ name: "status", title:"상태", css:"cell", type: "text", width: 60, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.getGridRowStatusName(value);			
			}},
			{ name: "gridManupulate", title:"그리드조작", css:"cell", type: "control",  width: 80, align:"left"}
		]
	});	
	
	//그리드 생성
	gridObject.gridCreate();
	
}

/**
 * @설명: 사업비 배부기준코드 팝업을 호출한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.11
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.11 최초작성
 */
function openPopupDistStndCd() {
	var popupOption = {
		url: "/ea/pr/eapr311p.do",
		name: "사업비 배부기준코드 조회 팝업",
		width: 700,
		height: 434
	}
	
	//※참고) 팝업콜백함수: openPopupDistStndCd_callback
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 사업비 배부기준코드 팝업 콜백
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.11
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.11 최초작성
 */
function openPopupDistStndCd_callback(resultObj) {
	//그리드 데이터 초기화
	resetGrid();
	
	$("#ibx_wrkexDistStndCd").val(resultObj.wrkexDistStndCd);
}

/**
 * @설명: 배부기준코드 목록을 조회한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.06
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.06 최초작성
 */
function selectDistStndCdList() {
	var reqParam = {};
	reqParam.wrkexDistStndCd = $("#ibx_wrkexDistStndCd").val();

	//그리드 초기화
	resetGrid();

	$.callAjax(reqParam, "/ea/pr/eapr311m/selectDistStndCdList.do")
	.done(function(data) {
		//Exception 발생 시, 공통 Message 제공
		if(data.result == "-1") { return; }
		
		//그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		/*2021.06.15 0건 그리드 메세지 처리*/
		if(listData.length == 0) {
			$.fn.getReturnValue("gridDiv");
		}

	}).fail(function(data) {
		$.fn.msgBox("데이터 조회 실패");
		console.log("fail to selectDistStndCdList");
	});
}

/**
 * @설명: 신규생성, 수정, 삭제 처리한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.06
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  김정민 2021.01.06 최초작성
 */
function saveGridDataAll() {
	//그리드 edit모드가 있을 경우, 수정사항 반영
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	
	var saveList = new Array();	//저장대상 배열 선언
	var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	
	//c,u,d,e 건만 추출
	for(var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		if(item.status == "c" || item.status == "u" || item.status == "d" || item.status == "e") {
			//유효값체크
			if(!isValid(i, item)) { return; }
			
			//데이터 세팅
			saveList.push(item);
		}
	}
	
	if(saveList.length == 0) {
		$.fn.msgBox("저장할 대상이 없습니다.");
		return;
	}
	
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({"list" : JSON.stringify(saveList)}, "/ea/pr/eapr311m/saveDistStndCdList.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					//재조회
					selectDistStndCdList();
				}
			}).fail(function(data){
				$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
			});
		}
	}, 2);
}


/**
 * @설명: 그리드 하나의 행을 추가한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.06
 * @최종변경일: 
 * @개정이력: 
 *  김정민 2021.01.06 최초작성
 */
function addGridData() {
	var dataList = $("#gridDiv").jsGrid("option", "data");
	var seq = dataList.length + 1;
	
	//status컬럼은 그리드 상태 핸들링 하기 위함.(c:신규, u:수정, d:삭제, e:엑셀로드)
	$("#gridDiv").jsGrid("insertItem", 
		{"seq" : seq,
		 "status" :  "c",
		 "wrkexDistStndCd" : "",
		 "wrkexDistStndCdNm" : "",
		 "extrtCntnt" : "",
		 "regDtm" : "",
		 "trtDtm" : ""}
	);
	
	//마지막 페이지 이동
	var pageLastText = $("#gridDiv").jsGrid("option", "pageLastText");
	$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
}

/**
 * @설명: 테이블(TB_IEAPRF04 사업비배부기준코드) 데이터 전체 삭제
 * @최초작성자: 김정민
 * @최초작성일: 2021.06.14
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.06.14 최초작성
 */
function deleteAllData() {
	//
	$.fn.msgBox("<span class='fcr fwb'>배부기준코드 전체 데이터가 삭제됩니다.</span>\n백업이 필요하시면 백업을 받아주시길 바랍니다.\n\n계속 진행하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({}, "/ea/pr/eapr311m/deleteAllData.do")
			.done(function(data) {
				//Exception 발생 시, 공통 Message 제공
				if(data.result == "-1") { return; }
				
				if(data.result > 0) {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					//재조회
					selectDistStndCdList();
				} else {
					$.fn.msgBox("삭제할 데이터가 없습니다.");
				}
				
			}).fail(function(data){
				$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
				console.log("fail to deleteAllData()");
			});
		}
	}, 2);
}

/**
 * @설명: 저장 전 validation 체크
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.06
 * @최종변경일: 
 * @매개변수: rowIndex, item
 * @반환값: boolean
 * @개정이력: 
 *  김정민 2021.01.06 최초작성
 */
function isValid(rowIndex, item) {
	var tStndCd = $.trim(item.wrkexDistStndCd);
	//필수값체크
	if(tStndCd == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 배부기준코드는 필수항목입니다.");
		return false;
	}
	 
	//삭제처리상태가 아닐 경우
	if(item.status != "d") {
		var tCdNm = $.trim(item.wrkexDistStndCdNm);
		var tCntnt = $.trim(item.extrtCntnt);

		if(tCdNm == "") {
			$.fn.msgBox((rowIndex + 1) + "행의 배부기준명은 필수항목입니다.");
			return false;
		}
		if(tCntnt == "") {
			$.fn.msgBox((rowIndex + 1) + "행의 계산식설명은 필수항목입니다.");
			return false;
		}
		
		//한글체크
		if(isCheckKo(tStndCd)) {
			$.fn.msgBox((rowIndex + 1) + "행의 배부기준코드는 영문, 숫자로 입력하세요.");
			return false;
		}
		
		//length체크
		if(strByteLength(tStndCd) > 5) {
			$.fn.msgBox((rowIndex + 1) + "행의 배부기준명은 5자 이내로 입력하세요.");
			return false;
		}
		if(strByteLength(tCdNm) > 200) {
			$.fn.msgBox((rowIndex + 1) + "행의 배부기준명은 영문200자, 한글100자 이내로 입력하세요.");
			return false;
		}
		if(strByteLength(tCntnt) > 1000) {
			$.fn.msgBox((rowIndex + 1) + "행의 배부기준명은 영문1000자, 한글500자 이내로 입력하세요.");
			return false;
		}
	}
	 
	return true;
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.06
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.06 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("option", "data", []);
	$("#gridDiv").jsGrid("reset");
}


/**
 * @설명: byte length
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.01
 * @최종변경일: 
 * @매개변수: value
 * @반환값: num
 * @개정이력: 
 *  김정민 2021.02.01 최초작성
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
 * @설명: 한글여부체크
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.01
 * @최종변경일: 
 * @매개변수: strVal<string>
 * @반환값: rtn<boolean>: 한글여부(true:한글유, false:할글무)
 * @개정이력: 
 *  김정민 2021.02.01 최초작성
 */
function isCheckKo(strVal) {
	var rtn = false;
	var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
	var leng = strVal.length;
	
	for (var i = 0; i < leng; i++) {
		var strChar = strVal.substr(i, 1);
		if(check.test(strChar)) {
			rtn = true;
			break;
		}
	}
	return rtn;
}