/**
 * @시스템명: IFRS17
 * @업무명: 배부기준코드_설정 JS
 * @설명: 배부기준코드_설정 JS
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  김정민 2021.06.10 최초작성
 *  김정민 2021.06.10 전체삭제 추가
 *  김정민 2021.06.14 그리드 너비 수정
 *  김정민 2021.06.15 3차 소스표준화
 *  안소연 2023.06.08 사업비배부유형코드 편집 
 */

// 전역변수 선언부
var CUR_ROW_ITEM = null;	//선택한 그리드 Row
var MAX_ROW_CNT = 10000;	//그리드에 표현되는 최대 row 개수

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
	
	//공통코드 조회
	selectCommonCode();
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	//포커스(배부유형)
	$("#sbx_wrkexDistTypCd").focus();
});

/**
 * @설명: 공통코드 조회
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.25
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.25 최초작성
 *  안소연 2023.06.08 사업비배부유형코드 편집
 */
function selectCommonCode() {
	//공통코드 조회(사업비배부유형코드, 사업비항목코드, 실제사업비채널코드)
	$.fn.loadCommonCode(["WRKEX_DIST_TYP_CD","WRKEX_ITM_CD","RAL_WRKEX_CHNL_CD"]);
	
	//사업비배부유형코드 6~9 삭제
	var targetArr_typ = $._commonObj["code"]["WRKEX_DIST_TYP_CD"]; // 얕은복사
	targetArr_typ.splice(5, 4);
	
	//사업비채널코드 DM, CC, CM 삭제
	var targetArr = $._commonObj["code"]["RAL_WRKEX_CHNL_CD"]; // 얕은복사
	for (var i = targetArr.length-1; i >= 0; i--) {
		if("DM" === targetArr[i]["code"] || "CC" == targetArr[i]["code"] || "CM" == targetArr[i]["code"]) {
			//참조하는 변수이므로, splice처리 후 결과값을 따로 세팅 안함
			targetArr.splice(i, 1);
		}
	}
	
	//콤보박스 세팅
	$.fn.renderCombobox({
		codeArr: ["WRKEX_DIST_TYP_CD","WRKEX_ITM_CD","RAL_WRKEX_CHNL_CD"],
		selArr: ["sbx_wrkexDistTypCd", "sbx_wrkexItmCd", "sbx_ralWrkexChnlCd"],
		firstOptionText: "-전체-"
	});
}

/**
 * @설명: event 초기화
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function initEvent() {
	//배부유형
	$("#sbx_wrkexDistTypCd").on("change", function(e){
		//그리드 데이터 초기화
		resetGrid();
	});

	//조회조건 입력창 keyup(배부유형, 사업비채널, 계정그룹ID, 사업비항목, 사용기준년월)
	$(".search-item").find("input[type=text], select").on("keypress", function(e) {
		if(e.which == 13) {
			$("#btn_search").click();
			return false;
		}
	});
	
	//계정그룹 조회 팝업
	$("#btn_accoGrpSearch").on("click", function(e){
		openPopupAccoGrp(null);
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
	
	//사업비채널, 사업비항목 change
	$("#sbx_ralWrkexChnlCd, #sbx_wrkexItmCd").on("change", function(e){
		//그리드 데이터 초기화
		resetGrid();
	});
	
	//조회구분 change
	$("input[name=rad_inqrSc]").on("change", function(e){
		//그리드 데이터 초기화
		resetGrid();
		
		//선택된 조회구분에 따라 기준년월 제어(E:최신, I:이력)
		$("#ibx_useStndYm").val("").attr("disabled", $(this).val() == "E" ? true : false);
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		selectDistStndMapnList();
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
		//저장데이터 검증
		vrfGridDataAll();
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
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
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
			{ name: "seq", title:"순번", css:"cell", type: "text", width: 60, editing: false, align:"center", sorter:"number"},
			{ name: "wrkexDistTypCd", title:"배부유형", css:"cell", type: "select", width: 90, editing:true, align:"left", 
				items: $.fn.getGridCodeItem("WRKEX_DIST_TYP_CD", true),
				textField: "codeNm",
				valueField: "code",
				editTemplate:function(value,item) {
					var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value, item);
					
					/*2021.06.16 특정 브라우저에서 edite모드로 전환될 때 스크롤이 한칸 올라가는 현상 방지*/
					setTimeout(function() {
						$result.focus();
					});
					
					$result.on("change", function() {
						$("#gridDiv").jsGrid("updateItem");
					});
					
					//신규, 엑셀로드 외엔 수정 불가
					if(item.status == "c" || item.status == "e") {
					} else {
						$result.attr("disabled", "true");
					}
					return $result;
				}
			},
			{ name: "ralWrkexChnlCd", title:"사업비채널코드", css:"cell", type: "select", width: 110, editing:true, align:"left",
				items: $.fn.getGridCodeItem("RAL_WRKEX_CHNL_CD", true),
				textField: "codeNm",
				valueField: "code",
				editTemplate:function(value,item) {
					var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value, item);
					
					$result.on("change", function() {
						$("#gridDiv").jsGrid("updateItem");
					});
					
					//신규, 엑셀로드 외엔 수정 불가
					if(item.status == "c" || item.status == "e") {
					} else {
						$result.attr("disabled", "true");
					}
					
					return $result;
				}
			},
			{ name: "wrkexAccoGrpId", title:"계정그룹ID", css:"cell", type: "text", width:110, align:"center", editing: false, itemTemplate:function(value, item) {
				//신규,엑셀업로드가 아니면 수정 불가
				if(item.status == "c" || item.status == "e") {
					var $pEl = $("<p>").addClass("fl line-height20").text(value);
					var $pEl2 = $("<p>").addClass("fr");
					var $aEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
						//계정그룹 팝업 호출
						openPopupAccoGrp(item);
					});
					var $iEl = $("<img>").attr("src", "/img/btn_icon_search.png");
					return $("<div>").append($pEl).append($pEl2.append($aEl.append($iEl)));
				} else {
					return value;
				}
			}},
			{ name: "wrkexAccoGrpNm", title:"계정그룹명", css:"cell", type: "text", width: 230, editing:false, align:"left"},
			{ name: "wrkexItmCd", title:"사업비항목코드", css:"cell", type: "select", width: 110, editing:true, align:"left",
				items: $.fn.getGridCodeItem("WRKEX_ITM_CD", true),
				textField: "codeNm",
				valueField: "code",
				editTemplate:function(value,item) {
					var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value, item);
					
					$result.on("change", function() {
						$("#gridDiv").jsGrid("updateItem");
					});
					
					//신규, 엑셀로드 외엔 수정 불가
					if(item.status == "c" || item.status == "e") {
					} else {
						$result.attr("disabled", "true");
					}
					
					return $result;
				}
			},
			{ name: "wrkexDistStndCd", title:"배부기준코드", css:"cell", type: "text", width: 100, editing:false, align:"left", itemTemplate:function(value, item) {
				//신규,엑셀업로드가 아니고 적용종료년월이 999912가 아니면 수정 불가
				if(item.status == "c" || item.status == "e" || item.aplcEndYm == "999912") {
					var $pEl = $("<p>").addClass("fl line-height20").text(value);	
					var $pEl2 = $("<p>").addClass("fr");
					var $aEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
						//배부기준코드 조회 팝업 호출
						openPopupDistStndCd(item);
					});
					var $iEl = $("<img>").attr("src", "/img/btn_icon_search.png");
					return $("<div>").append($pEl).append($pEl2.append($aEl.append($iEl)));
				} else {
					return value;
				}
				
			}},
			{ name: "wrkexDistStndCdNm", title:"배부기준명", css:"cell", type: "text", width: 290, editing:false, align:"left"},
			{ name: "aplcStrYm", title:"적용시작년월", css:"cell", type: "text",  width: 100, align:"center", editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				//Enter 키 입력시 updateItem apply됨.
				$result.on("keydown", function(e){
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
			{ name: "aplcEndYm", title:"적용종료년월", css:"cell", type: "text",  width: 100, align:"center", editing: false, itemTemplate:function(value, item) {
				return item.status == "e" ? "" : $.fn.monthFormat(value, "-");			
			}},
			{ name: "status", title:"상태", css:"cell", type: "text", width: 60, align:"center", editing: false, itemTemplate:function(value, item) {
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
			{ name: "trtrEno", title:"변경자사번", css:"cell", type: "text", width: 110, editing: false, align:"center", itemTemplate:function(value, item) {
				return item.status == "e" ? "" : value;			
			}}
		]
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 계정그룹조회 팝업을 호출한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.11
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.11 최초작성
 */
function openPopupAccoGrp(rowItem) {
	CUR_ROW_ITEM = rowItem;
	
	console.log("CUR_ROW_ITEM => ", CUR_ROW_ITEM);
	
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
 * @최초작성일: 2021.01.11
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.11 최초작성
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
 * @설명: 배부기준코드조회 팝업을 호출한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.11
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.11 최초작성
 */
function openPopupDistStndCd(rowItem) {
	CUR_ROW_ITEM = rowItem;
	
	console.log("CUR_ROW_ITEM => ", CUR_ROW_ITEM);
	
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
	var newRowItem = $.extend({}, CUR_ROW_ITEM, resultObj);
	$("#gridDiv").jsGrid("updateItem", CUR_ROW_ITEM, newRowItem);
}

/**
 * @설명: 사업비배부기준Mapping 목록을 조회한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function selectDistStndMapnList() {
	//사용기준년월 유효값 검증
	var useStndYm = $("#ibx_useStndYm").val().replace(/-/g, "");	
	if(!$.fn.isEmpty(useStndYm) && !$.isValidYm(useStndYm)) {
		$.fn.msgBox("날짜 형식이 맞지 않습니다.", function() {
			$("#ibx_useStndYm").focus();
		});
		return;
	}
	
	var reqParam = {};
	reqParam.wrkexDistTypCd = $("#sbx_wrkexDistTypCd").val();		//사업비배부유형코드
	reqParam.ralWrkexChnlCd = $("#sbx_ralWrkexChnlCd").val();		//사업비채널코드
	reqParam.wrkexAccoGrpId = $("#ibx_wrkexAccoGrpId").val();		//사업비계정그룹ID
	reqParam.wrkexItmCd = $("#sbx_wrkexItmCd").val();				//사업비항목코드
	reqParam.inqrSc = $("input[name=rad_inqrSc]:checked").val();	//조회조건(E:제외, I:포함)
	reqParam.useStndYm = useStndYm;									//사용기준년월
	
	//그리드 초기화
	resetGrid();

	$.callAjax(reqParam, "/ea/pr/eapr312m/selectDistStndMapnList.do")
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
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to selectDistStndMapnList");
	});
}

/**
 * @설명: 저장 전 데이터 검증(적용시작년월이 동일한 건수 체크)
 * @최초작성자: 김정민
 * @최초작성일: 2021.04.27
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  김정민 2021.04.27 최초작성
 */
function vrfGridDataAll() {
	var saveList = new Array();								//저장대상 배열 선언
	var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터

	var distTypArr = $.fn.getGridCodeItem("WRKEX_DIST_TYP_CD", false);	//사업비배부유형코드 List
	var wrkexItmArr = $.fn.getGridCodeItem("WRKEX_ITM_CD", false);		//사업비항목코드 List
	
	//c,u,d,e 건만 추출
	for(var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		if(item.status == "c" || item.status == "u" || item.status == "d" || item.status == "e") {
			//유효값체크
			if(!isValid(i, item)) { return; }
			
			//삭제가 아닐 경우, 배부유형&사업비항목코드 Label 세팅
			if(item.status != "d") {
				item.wrkexDistTypCdNm = getSelectboxLabel(item.wrkexDistTypCd, distTypArr);
				item.wrkexItmCdNm = getSelectboxLabel(item.wrkexItmCd, wrkexItmArr);
			}
			
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
			$.callAjax({"list" : JSON.stringify(saveList)}, "/ea/pr/eapr312m/vrfDistStndMapnList.do")
			.done(function(data) {
				//Exception 발생 시, 공통 Message 제공
				if(data.result == "-1") { return; }
				
				//적용시작년월이 동일한 데이터 건수 체크
				if(data.sameCnt > 0) {
					var msg = "이미 존재하는 데이터가 있습니다.\n히스토리를 남기지 않고 덮어쓰시겠습니까?\n";
					msg += "[총건수 " + $.addCommaNumber(saveList.length + "") + "건 / 중복건수 " + $.addCommaNumber(data.sameCnt + "") + "건]"
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
 * @설명: 신규생성, 수정, 삭제 처리한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function saveGridDataAll(saveList) {
	$.callAjax({"list" : JSON.stringify(saveList)}, "/ea/pr/eapr312m/saveDistStndMapnList.do")
	.done(function(data) {
		if(data.result == "1") {
			$.fn.msgBox("정상적으로 처리되었습니다.\n재조회 하시겠습니까?", function(obj) {
				//2021.04.26 컨설팅 요청으로 인해 재조회 여부 확인 추가
				//저장 후 재조회 시, 만건이상 데이터가 조회되면 error메세지 발생하여 정상적으로 저장되었는지 판별이 어려우므로 재조회여부를 확인함
				if(obj.btn_ok) {
					//재조회
					selectDistStndMapnList();
				} else {
					//그리드 데이터 초기화
					resetGrid();
				}
			}, 2);
			
		}
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
	});
}

/**
 * @설명: 그리드 하나의 행을 추가한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function addGridData() {
	var dataList = $("#gridDiv").jsGrid("option", "data");
	var seq = dataList.length + 1;
	
	//status컬럼은 그리드 상태 핸들링 하기 위함.(c:신규, u:수정, d:삭제, e:엑셀로드)
	$("#gridDiv").jsGrid("insertItem", 
		{"seq" : seq,
		 "status" :  "c",
		 "wrkexDistTypCd" : "",
		 "wrkexAccoGrpId" : "",
		 "wrkexAccoGrpNm" : "",
		 "wrkexItmCd" : "",
		 "ralWrkexChnlCd" : "",
		 "wrkexDistStndCd" : "",
		 "wrkexDistStndCdNm" : "",
		 "aplcStrYmOri":"",
		 "aplcStrYm" : "",
		 "aplcEndYm" : ""
		}
	);
	
	//마지막 페이지 이동
	var pageLastText = $("#gridDiv").jsGrid("option", "pageLastText");
	$(".jsgrid-pager-nav-button a:contains('" + pageLastText + "')").click();
}

/**
 * @설명: 테이블(TB_IEAPRA02 배부기준매핑) 데이터 전체 삭제
 * @최초작성자: 김정민
 * @최초작성일: 2021.06.10
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.06.10 최초작성
 */
function deleteAllData() {
	$.fn.msgBox("<span class='fcr fwb'>배부기준코드매핑 전체 데이터가 삭제됩니다.</span>\n백업이 필요하시면 백업을 받아주시길 바랍니다.\n\n계속 진행하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({}, "/ea/pr/eapr312m/deleteAllData.do")
			.done(function(data) {
				//Exception 발생 시, 공통 Message 제공
				if(data.result == "-1") { return; }
				
				if(data.result > 0) {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					//재조회
					selectDistStndMapnList();
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
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: rowIndex, item
 * @반환값: boolean
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function isValid(rowIndex, item) {
	var aplcStrYm = $.trim(item.aplcStrYm);
	var aplcStrYmOri = $.trim(item.aplcStrYmOri);

	if($.trim(item.wrkexDistTypCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 배부유형은 필수항목입니다.");
		return false;
	}
	if($.trim(item.ralWrkexChnlCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 사업비채널은 필수항목입니다.");
		return false;
	}
	if($.trim(item.wrkexAccoGrpId) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 계정그룹ID는 필수항목입니다.");
		return false;
	}
	if($.trim(item.wrkexItmCd) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 사업비항목코드는 필수항목입니다.");
		return false;
	}
	if(aplcStrYm == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 적용시작년월을 입력하세요.");
		return false;
	}
	
	if(item.status != "d") {
		if($.trim(item.wrkexDistStndCd) == "") {
			$.fn.msgBox((rowIndex + 1) + "행의 배부기준코드는 필수항목입니다.");
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
		
		//수정일 경우, 적용시작년월의 수정여부를 확인한다.
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
 * @최초작성일: 2021.01.07
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.07 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("option", "data", []);
	$("#gridDiv").jsGrid("reset");
}

/**
 * @설명: 콤보박스의 value로 label을 리턴한다.
 * @최초작성자: 김정민
 * @최초작성일: 2021.01.25
 * @최종변경일: 
 * @매개변수: value<string> : 콤보박스의 value
 *         items<array> : 콤보박스 items
 * @반환값: 
 * @개정이력: 
 *  김정민 2021.01.025 최초작성
 */
function getSelectboxLabel(value, items) {
	var label = "";
	var arr = items.filter(function(item) {
		return item.code == value;
	});
	
	if(arr.length != 0) {
		label = arr[0].codeNm;
	}
	
	return label;
}
