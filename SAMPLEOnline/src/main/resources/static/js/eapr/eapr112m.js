/**
 * @시스템명: IFRS17
 * @업무명: 계정그룹매핑
 * @설명: 계정번호와 계정그룹ID를 매핑하는 화면 JS
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.05
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  김정민 2021.01.05 최초작성
 *  김정민 2021.06.10	-조회조건(사용기준년월) 추가
 *				  	-중복된 데이터는 수정불가하던 로직을 수정가능하게 처리함
 *	김정민 2021.06.14	-전체삭제 추가
 *				  	-그리드 너비 수정
 *  김정민 2021.06.15 3차 소스표준화
 */
// 전역변수 선언부
var CUR_ROW_ITEM = null;	//선택한 그리드 Row

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
	
	//포커스(계정번호)
	$("#ibx_accoNo").focus();
});

/**
 * @설명: event 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.05 최초작성
 */
function initEvent() {
	//조회조건 입력창 keyup(계정번호, 계정명, 계정그룹ID, 사용기준년월)
	$(".search-item").find("input[type=text]").on("keypress", function(e) {
		if(e.which == 13) {
			$("#btn_search").click();
			return false;
		}
	});
	
	//계정그룹조회팝업
	$("#btn_accoGrpSearch").on("click", function(e){
		openPopupAccoGrp(null);
	});
	
	//조회구분
	$("input[name=rad_inqrSc]").on("change", function(e){
		//그리드 데이터 초기화
		resetGrid();
		
		//선택된 조회구분에 따라 기준년월 제어(E:최신, I:이력)
		$("#ibx_useStndYm").val("").attr("disabled", $(this).val() == "E" ? true : false);
	});

	//사용기준년월 입력창 blur/focus/input
	$("#ibx_useStndYm").on("blur", function(e) {
		var _this = this;
		
		//빈값 체크
		if($.fn.isEmpty(_this.value)) {
			return;
		}
		
		//날짜형식 체크
		if($.isValidYm(_this.value)) {
			$(_this).val($.fn.monthFormat(_this.value, "-"));
			
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.", function() {
				_this.value = "";
				$(_this).focus();
			});
		}
	}).on("focus", function() {
		$(this).select();
		
	}).on("input", function(e) {
		//숫자입력만 가능
		var val = $(this).val();
		$(this).val(val.replace(/[^\d]/g, "").substr(0,6));
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		selectAccoGrpMapnList();
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
	
	//신규계정 불러오기
	$("#btn_getNewAcco").on("click", function(e){
		selectNewAccoList();
	});
	
	//저장
	$("#btn_save").on("click", function(e){
		//저장데이터 검증
		vrfGridDataAll();
		//20210611 saveGridDataAll();
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
 * @최초작성일: 2021.01.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.05 최초작성
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
				return;
			}
			
			//신규, 엑셀업로드, 적용종료일이 999912가 아닌 경우  Edit 모드 취소
			if(!(args.item.status == "c" || args.item.status == "e" || args.item.aplcEndYm == "999912")) {
				args.cancel = true;
				return;
			}
		},
		fields : [
			{ name: "seq", title:"순번", css:"cell", type: "text", width: 60, align:"center", sorter:"number", editing:false},
			{ name: "accoNo", title:"계정번호", css:"cell", type: "text", width: 120, align:"center", editing:false, itemTemplate:function(value,item) {
				//신규, 엑셀로드 외엔 수정 불가
				if(item.status == 'c' || item.status == 'e') {
					var $pEl = $("<p>").addClass("fl line-height20").text(value);
					var $pEl2 = $("<p>").addClass("fr");
					var $aEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
						openPopupAcco(item); //계정목록조회 팝업 호출
					});
					var $iEl = $("<img>").attr("src", "/img/btn_icon_search.png");
					return $("<div>").append($pEl).append($pEl2.append($aEl.append($iEl)));
				}
				return value;
			}},
			{ name: "accoNm", title:"계정명", css:"cell", type: "text", width: 315, align:"left", editing:false},
			{ name: "wrkexAccoGrpId", title:"계정그룹ID", css:"cell", type: "text", width: 120, align:"left", editing:false, itemTemplate:function(value, item) {
				//신규, 엑셀업로드이거나, 적용종료일이 9999-99만 수정 가능
				if(item.status == "c" || item.status == "e" || item.aplcEndYm == "999912") {
					var $pEl = $("<p>").addClass("fl line-height20").text(value)
					var $pEl2 = $("<p>").addClass("fr");
					var $aEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
						openPopupAccoGrp(item); //계정그룹목록조회 팝업 호출
					});
					var $iEl = $("<img>").attr("src", "/img/btn_icon_search.png");
					return $("<div>").append($pEl).append($pEl2.append($aEl.append($iEl)));
				} else {
					return value;
				}
			}},
			{ name: "wrkexAccoGrpNm", title:"계정그룹명", css:"cell", type: "text", width: 230, align:"left", editing:false},
			{ name: "aplcStrYm", title:"적용시작년월", css:"cell", type: "text",  width: 100, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				/*2021.06.16 특정 브라우저에서 edite모드로 전환될 때 스크롤이 한칸 올라가는 현상 방지*/
				setTimeout(function() {
					$result.focus();
				});
				
				$result
				.attr("maxlength", "6")
				.on("keydown", function(e){
					//Enter 키 입력시 updateItem apply됨.
					if(e.which === 13){
						$("#gridDiv").jsGrid("updateItem");
					}
				}).on("input keyup", function(e) {
					//숫자입력만 가능
					var val = $(this).val();
					$(this).val(val.replace(/[^\d]/g, "").substr(0,6));
				}).on("blur", function() {
					$("#gridDiv").jsGrid("updateItem");
				});
				
				//신규, 엑셀업로드, 적용종료일이 999912가 아닌 경우 수정 불가
				if(!(item.status == "c" || item.status == "e" || item.aplcEndYm == "999912")) {
					$result.attr("readonly", true);
				}
				
				return $result;
			}, itemTemplate:function(value, item) {
				return $.fn.monthFormat(value, "-");			
			}},
			{ name: "aplcStrYmOri", title:"적용시작년월_hidden", css:"cell", type: "text", editing:false, visible:false},
			{ name: "aplcEndYm", title:"적용종료년월", css:"cell", type: "text",  width: 100, align:"center", editing:false, itemTemplate:function(value, item) {
				return item.status == "e" ? "" : $.fn.monthFormat(value, "-");
			}},
			{ name: "status", title:"상태", css:"cell", type: "text", width: 60, align:"center", editing:false, itemTemplate:function(value, item) {
				return $.fn.getGridRowStatusName(value);			
			}},
			{ name: "gridManupulate", title:"그리드조작", css:"cell", type: "control",  width: 80, align:"left", itemTemplate:function(value, item) {
				var $result = $([]);
				//적용종료년월이 999912, 신규생성, 엑셀업로드 일 경우 editButton, deleteButton 생성
	            if(item.aplcEndYm == "999912" || item.status == "c" || item.status == "e") {
	            	$result = $result.add(this._createEditButton(item));
	                $result = $result.add(this._createDeleteButton(item));
	            }
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
			}}
		]
	});	
	
	//그리드 생성
	gridObject.gridCreate();
	
}

/**
 * @설명: 계정조회 팝업을 호출한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: rowItem 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function openPopupAcco(rowItem) {
	CUR_ROW_ITEM = rowItem;
	var popupOption = {
		url: "/ea/pr/eapr111p.do",
		name: "계정목록조회 팝업",
		width: 700,
		height: 434
	}
	
	//※참고) 팝업콜백함수: openPopupAcco_callback
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 계정조회 팝업 콜백
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function openPopupAcco_callback(resultObj) {
	console.log("[계정조회 팝업 콜백] resultObj", resultObj);
	
	if(typeof CUR_ROW_ITEM === "undefined" || CUR_ROW_ITEM == null) return;
	
	var newRowItem = $.extend({}, CUR_ROW_ITEM, resultObj);
	$("#gridDiv").jsGrid("updateItem", CUR_ROW_ITEM, newRowItem);
}

/**
 * @설명: 계정그룹조회 팝업을 호출한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.05
 * @최종변경일: 
 * @매개변수: rowItem
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.05 최초작성
 */
function openPopupAccoGrp(rowItem) {
	CUR_ROW_ITEM = rowItem;
	
	var popupOption = {
		url: "/ea/pr/eapr112p.do",
		name: "계정그룹목록조회 팝업",
		width: 700,
		height: 434
	}

	//※참고) 팝업콜백함수: openPopupAccoGrp_callback
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 계정그룹조회 팝업 콜백
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function openPopupAccoGrp_callback(resultObj) {
	console.log("[계정그룹조회 팝업 콜백] resultObj", resultObj);
	
	if(typeof CUR_ROW_ITEM === "undefined" || CUR_ROW_ITEM == null) {
		//그리드 데이터 초기화
		resetGrid();
		
		$("#ibx_wrkexAccoGrpId").val(resultObj.wrkexAccoGrpId);
	} else {
		var newRowItem = $.extend({}, CUR_ROW_ITEM, resultObj);
		$("#gridDiv").jsGrid("updateItem", CUR_ROW_ITEM, newRowItem);
	}
}

/**
 * @설명: 계정그룹매핑목록을 조회한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.05 최초작성
 */
function selectAccoGrpMapnList() {
	//사용기준년월 유효값 검증
	var useStndYm = $("#ibx_useStndYm").val().replace(/-/g, "");	
	if(!$.fn.isEmpty(useStndYm) && !$.isValidYm(useStndYm)) {
		$.fn.msgBox("날짜 형식이 맞지 않습니다.", function() {
			$("#ibx_useStndYm").focus();
		});
		return;
	}
	
	var reqParam = {};
	reqParam.accoNo = $("#ibx_accoNo").val();						//계정번호
	reqParam.accoNm = $("#ibx_accoNm").val();						//계정명
	reqParam.wrkexAccoGrpId = $("#ibx_wrkexAccoGrpId").val();		//계정그룹ID
	reqParam.inqrSc = $("input[name=rad_inqrSc]:checked").val();	//조회조건(E:제외, I:포함)
	reqParam.useStndYm = useStndYm;									//사용기준년월

	// 그리드 초기화
	resetGrid();

	// 데이터 조회
	$.callAjax(reqParam, "/ea/pr/eapr112m/selectAccoGrpMapnList.do")
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
		
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to selectAccoGrpMapnList !!");
	});
}

/**
 * @설명: 그리드 하나의 행을 추가한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.05 최초작성
 */
function addGridData() {
	var dataList = $("#gridDiv").jsGrid("option", "data");
	var seq = dataList.length + 1;
	
	//status컬럼은 그리드 상태 핸들링 하기 위함.(c:신규, u:수정, d:삭제, e:엑셀로드)
	$("#gridDiv").jsGrid("insertItem", 
		{"seq" : seq,
		 "status" :  "c",
		 "accoNo" : "",
		 "accoNm" : "",
		 "wrkexAccoGrpId" : "",
		 "wrkexAccoGrpNm" : "",
		 "aplcStrYm" : "",
		 "aplcStrYmOri":"",
		 "aplcEndYm" : ""
		}
	);
	
	//마지막 페이지 이동
	goLastPage();
	
}

/**
 * @설명: 신규계정을 불러온다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  김정민 2021.01.05 최초작성
 */
function selectNewAccoList() {
	
	$.callAjax({}, "/ea/pr/eapr112m/selectNewAccoList.do")
	.done(function(data) {
		
		//Exception 발생 시, 공통 Message 제공
		if(data.result == "-1") { return; }
		
		//그리드 초기화하지 않고, 마지막페이지 하단에 해당 list를 그리드에 출력
		var listData = data.list;
		if(listData.length == 0) {
			$.fn.msgBox("신규계정이 없습니다.");
			return;
		}

		var totalCnt = $("#gridDiv").jsGrid("option", "data").length;
		
		//신규계정 그리드 세팅
		listData.forEach(function(el, i) {
			el.seq = totalCnt + i + 1;
			el.status = "c";
			el.wrkexAccoGrpId = "";
			el.wrkexAccoGrpNm = "";
			el.aplcStrYm = "";
			el.aplcEndYm = "";
			$("#gridDiv").jsGrid("insertItem", el);
		});

		//마지막 페이지 이동
		goLastPage();

	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
	});
}

/**
 * @설명: 신규생성, 수정, 삭제 처리한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.05
 * @최종변경일: 
 * @매개변수: saveList
 * @반환값: any
 * @개정이력: 
 *  김정민 2021.01.05 최초작성
 */
function saveGridDataAll(saveList) {
	$.callAjax({"list" : JSON.stringify(saveList)}, "/ea/pr/eapr112m/saveAccoGrpMapnList.do")
	.done(function(data) {
		if(data.result == "1") {
			$.fn.msgBox("정상적으로 처리되었습니다.");
			
			//재조회
			selectAccoGrpMapnList();
		}
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
	});
}

/**
 * @설명: 저장 전 데이터 검증(저장할 데이터 중 적용시작년월이 동일한 건수를 체크하여 히스토리없이 수정여부를 확인함)
 * @최초작성자: 김정민
 * @최초작성일: 2021.06.10
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  김정민 2021.06.10 최초작성
 */
function vrfGridDataAll() {
	//그리드 edit모드가 있을 경우, 수정사항 반영
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	

	var saveList= new Array();	//저장대상 배열 선언
	var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	
	//c,u,d,e 건만 추출
	for(var i=0; i<gridData.length; i++) {
		var item = gridData[i];
		if(item.status == "c" || item.status == "u" || item.status == "d" || item.status == "e") {
			//유효값체크
			if(!isValid(i,item)) { return; }
			
			saveList.push(item);
		}
	}
	
	if(saveList.length == 0) {
		$.fn.msgBox("저장할 대상이 없습니다.");
		return;
	}
	
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({"list" : JSON.stringify(saveList)}, "/ea/pr/eapr112m/vrfAccoGrpMapnList.do")
			.done(function(data) {
				//Exception 발생 시, 공통 Message 제공
				if(data.result == "-1") { return; }
				
				//적용시작년월이 동일한 데이터 건수 체크
				if(data.sameCnt > 0) {
					var msg = "이미 존재하는 데이터가 있습니다.\n히스토리를 남기지 않고 덮어쓰시겠습니까?\n";
					msg += "[총저장건수 " + $.addCommaNumber(saveList.length + "") + "건 / 중복건수 " + $.addCommaNumber(data.sameCnt + "") + "건]"
					$.fn.msgBox(msg, function(obj) {
						if(obj.btn_ok) {
							//데이터 저장
							saveGridDataAll(saveList);
						}
					}, 2);
				} else {
					//데이터 저장
					saveGridDataAll(saveList);
				}
				
			}).fail(function(data){
				$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
			});
		}
	}, 2);
}

/**
 * @설명: 테이블(TB_IEAPRA01 계정그룹매핑) 데이터 전체 삭제
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
	$.fn.msgBox("<span class='fcr fwb'>계정그룹매핑 전체 데이터가 삭제됩니다.</span>\n백업이 필요하시면 백업을 받아주시길 바랍니다.\n\n계속 진행하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({}, "/ea/pr/eapr112m/deleteAllData.do")
			.done(function(data) {
				//Exception 발생 시, 공통 Message 제공
				if(data.result == "-1") { return; }
				
				if(data.result > 0) {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					//재조회
					selectAccoGrpMapnList();
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
 * @최초작성일: 2021.01.05
 * @최종변경일: 
 * @매개변수: rowIndex
 *         item
 * @반환값: boolean
 * @개정이력: 
 *  김정민 2021.01.05 최초작성
 */
function isValid(rowIndex, item) {
	var aplcStrYm = $.trim(item.aplcStrYm);
	var aplcStrYmOri = $.trim(item.aplcStrYmOri);
	
	if($.trim(item.accoNo) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 계정번호를 입력하세요.");
		return false;
	}
	if(aplcStrYm == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 적용시작년월을 입력하세요.");
		return false;
	}
	
	if(item.status != "d") {
		if($.trim(item.wrkexAccoGrpId) == "") {
			$.fn.msgBox((rowIndex + 1) + "행의 계정그룹ID를 입력하세요.");
			return false;
		}
		if(aplcStrYm.length != 6) {
			$.fn.msgBox((rowIndex + 1) + "행의 적용시작년월은 6자리를 입력하세요.");
			return false;
		}
		
		//날짜형식 체크
		if(!$.isValidYm(aplcStrYm)) {
			$.fn.msgBox((rowIndex + 1) + "행의 적용시작년월의 날짜형식을 확인하세요.");
			return false;
		}
		
		//수정일 경우, 적용시작년월일 수정여부를 확인한다.
		if(item.status == "u") {
			if(aplcStrYmOri > aplcStrYm) {
				$.fn.msgBox("입력된 적용시작년월이 등록된 적용시작년월보다 작습니다.\n" + (rowIndex + 1) + "행의 적용시작년월을 확인하세요.");
				return false;
			}
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
 * @설명: 마지막 페이지 이동한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.02.09 최초작성
 */
function goLastPage() {
	var pageLastText = $("#gridDiv").jsGrid("option", "pageLastText");
	$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
}
