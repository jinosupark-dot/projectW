/**
 * @시스템명: IFRS17
 * @업무명: 관리 - 개별코드관리
 * @설명: 개별코드를 관리를 관리하는 화면의 JS
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
 */

$(document).ready(function(){
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");		
	
	//버튼 권한 처리 2021.06.14
    $.fn.setBtnPermission([{"btnId":"#btn_save"}
                          ,{"btnId":"#btn_addGrid"}])
                          
	//event 초기화
	initEvent();

	//Stat 그리드 초기화	
	initGridStat();
	
	//그리드 초기화	
	initGrid();
	
	// (기간계) 전체 조회
//	selectCodeStatList(); 
	
	//개별코드관리 전체 조회
	selectCodeList(); 
});

/**
 * @설명: event 초기화
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
 */
function initEvent() {
	$("#ibx_stnrdTrmnEngNm").focus();
	
	// 메시지 검색 결과 조회: 검색 내용이 없으면 전체 조회
	$("#btn_search").on("click", function(e){
		selectCodeStatListByKeywords();
		selectCodeListByKeywords(); 
	});
	
	// IFRS17 CSV다운로드
	$("#btn_csv_download").on("click", function(e){
		$.fn.exportGridCSV({id: 'gridDiv', fileName: "개별코드관리(IFRS17).csv"});
	});
	
	// 기간계 CSV다운로드
	$("#btn_csv_download_stat").on("click", function(e){
		$.fn.exportGridCSV({id: 'gridDivStat', fileName: "개별코드관리(기간계).csv"});
	});
	
	//저장
	$("#btn_save").on("click", function(e){
		saveGridDataAll();
	});
	
	//그리드 행추가
	$("#btn_addGrid").on("click", function(e){
		addGridData();
	});
	
	// Enter키로 검색어 조회: #표준용엉영문명 #표준용어한글명 #통합코드값명
	$("#ibx_stnrdTrmnEngNm, #ibx_stnrdTrmnKraNm, #ibx_cdcValNm").on("keydown", function(e){
		if(e.which === 13){    			// Enter 키-> 조회
			$("#btn_search").click();
	}});
	
}

/**
 * @설명: 기간계 통합코드관리 - jsGrid 테이블 생성, 조회만 가능 
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
 */
function initGridStat(){
	
	// jsGrid 빈 테이블 생성
	var gridObjectStat = new ComJsGrid({
		id: "gridDivStat",
		height: 300,
		editing: false,
		sorting: true,
		paging: true,
		
		fields : [
			{ name: "stnrdTrmnEngNm", title:"표준용어영문명", css:"cell", type: "text", width: 40, align:"center"},
			{ name: "cdcValt", title:"통합코드텍스트값", css:"cell", type: "text", width: 40, align:"center"},
			{ name: "cdcValAbbrNm", title:"통합코드값축약명", css:"cell", type: "text", width: 40, align:"center"},
			{ name: "cdcValNm", title:"통합코드값명", css:"cell", type: "text", width: 40, align:"center"},
			{ name: "useYn", title:"사용여부", css:"cell", type: "select", width: 30, align:"center",
			items: [
				{Name:"활성화", Id: "Y"},
				{Name:"비활성화", Id: "N"}],
			textField: "Name",
			valueField: "Id"},
			{ name: "avlStrYmd", title:"유효시작일자", css:"cell", type: "text",  width: 30, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");}},
			{ name: "avlEndYmd", title:"유효종료일자", css:"cell", type: "text",  width: 30, align:"center", editing: false, itemTemplate:function(value, item) {
				var foramttedValue = $.fn.dateFormat(value, "-");
			}},
			{ name: "trtDtm", title:"변경일시", css:"cell", type: "text",  width: 30, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");	}}]
		});	
	
	//그리드 생성
	gridObjectStat.gridCreate();
}
	

/**
 * @설명: IFRS17 개발계 개별코드관리- jsGrid 빈 테이블 생성 
 * @최초작성자: 편신범
 * @최초작성일: 2021. 3. 8.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 그리드 
 * @개정이력: 
 *  편신범 2021. 3. 8. 최초작성
 */
function initGrid(){

 	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 400,
		editing: true,
		sorting: true,
		paging: false,
		
		selectHiglight:false,
		
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				var status = 'u';	//수정
				if(item.status == 'c') {	//신규는 c상태 유지 후 데이터 수정
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
				if(item.status == 'c') {	//신규 입력대상건으로 그리드만 삭제처리
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
			//체크박스는 Edit 모드 취소
			var targetElem = event.srcElement;
			if( targetElem.outerHTML.indexOf("check") > 0) {
				args.cancel = true;
			}
			//delete 상태 스킵
			if( args.item.status == 'd') {
				args.cancel = true;
			}
		},
		
		fields : [
			{ name: "stnrdTrmnEngNm", title:"표준용어영문명", css:"cell", type: "text", width: 40, align:"left", 
				editTemplate:function(value,item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					//신규 외엔 메뉴ID 수정 불가
					if(item.status != 'c') {
						$result.attr("readonly", "true");
					}
					// Enter 키 입력시 입력사항 반영됨
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDiv").jsGrid("updateItem");
							return false;
						}});
					return $result;
				}, validate:{validator:"rangeLength", param:[1,30], message:"[표준영어영문명] 1~30글자를 넣어주세요"}}
			
			,{ name: "stnrdTrmnKraNm", title:"표준용어한글명", css:"cell", type: "text", width: 40, align:"left", 
				editTemplate:function(value,item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					// Enter 키 입력시 입력사항 반영됨
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDiv").jsGrid("updateItem");
							return false;
						}});
					return $result;
				}, 
				validate:{validator:"rangeLength", param:[0,40], message:"[표준용어한글명] 0~40글자를 넣어주세요"}}
			
			,{ name: "stdilSeq", title:"정렬순서", css:"cell", type: "text", width: 18, align:"center",
					sorter: "number", // name of SortStrategy or function to compare elements
					validate:{validator:"rangeLength", param:[1,3], message:"[정렬순서] 1~999 숫자를 넣어주세요."},
					editTemplate:function(value,item) {
						var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
						//신규 외엔 메뉴ID 수정 불가
						if(item.status != 'c') {
							$result.attr("readonly", "true");
						}
						// Enter 키 입력시 입력사항 반영됨
						$result.on("keydown", function(e){
							if(e.which === 13){
								$("#gridDiv").jsGrid("updateItem");
								return false;
							}});
						return $result;
					}},

				{ name: "cdcValt", title:"통합코드텍스트값", css:"cell", type: "text", width: 30, align:"left",
					// Validation: 1~7 글자 제한(한글 불가능)
					validate:{validator:"rangeLength", param:[1,30], message:"[통합코드텍스트값] 영문: 1~30글자, 한글:1~10글자를 넣어주세요."},
					 editTemplate:function(value,item) {
						var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
						//신규 외엔 메뉴ID 수정 불가
						if(item.status != 'c') {
							$result.attr("readonly", "true");
						}
						// Enter 키 입력시 입력사항 반영됨
						$result.on("keydown", function(e){
							if(e.which === 13){
								$("#gridDiv").jsGrid("updateItem");
								return false;
							}});
						return $result;
					}},

				
					{ name: "cdcValAbbrNm", title:"통합코드값축약명", css:"cell", type: "text", width: 30, align:"left",
						// Validation: 1~7 글자 제한(한글 불가능)
						validate:{validator:"rangeLength", param:[0,60], message:"[통합코드값축약명] 0~60글자를 넣어주세요."},
						 editTemplate:function(value,item) {
							var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
							// Enter 키 입력시 입력사항 반영됨
							$result.on("keydown", function(e){
								if(e.which === 13){
									$("#gridDiv").jsGrid("updateItem");
									return false;
								}});
							return $result;
						}},
						
						{ name: "cdcValNm", title:"통합코드값명", css:"cell", type: "text", width: 30, align:"left",
							// Validation: 1~7 글자 제한(한글 불가능)
							validate:{validator:"rangeLength", param:[0,120], message:"[통합코드값명] 0~120글자를 넣어주세요."},
							 editTemplate:function(value,item) {
								var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
								// Enter 키 입력시 입력사항 반영됨
								$result.on("keydown", function(e){
									if(e.which === 13){
										$("#gridDiv").jsGrid("updateItem");
										return false;
									}});
								return $result;
							}},
							
				{ name: "useYn", title:"사용여부", css:"cell", type: "select", width: 20, align:"center",
				items: [
					{Name:"활성화", Id: "Y"},
					{Name:"비활성화", Id: "N"}],
				textField: "Name",
				valueField: "Id",
				// Enter 키 입력시 updateItem apply됨.
				editTemplate: function(value){
					var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDiv").jsGrid("updateItem");
							return false;
						}
					});
					return $result;
				},validate:{validator:"required", message:"[사용여부] 필수 입력 항목입니다."}
				},
				
				{ name: "avlStrYmd", title:"유효시작일자", css:"cell", type: "text",  width: 30, align:"center", editing: true, itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");			
					},
					// value(입력값) 확인: yyyymmdd
					validate:{validator: "pattern",
						message: "필드값이 정의된 날짜 패턴(yyyymmdd)과 맞지 않습니다.",
						validator: function(value){	
			                return $.isValidDate(value);
			                }},
					editTemplate:function(value,item) {
						var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
						// Enter 키 입력시 입력사항 반영됨
						$result.on("keydown", function(e){
							if(e.which === 13){
								$("#gridDiv").jsGrid("updateItem");
								return false;
							}
						}).on("input keyup", function(e) {
							//숫자입력만 가능
							$(this).val($.fn.removeChar(this.value));
						});
						return $result;
					}
			    },
				{ name: "avlEndYmd", title:"유효종료일자", css:"cell", type: "text",  width: 30, align:"center", editing: true, itemTemplate:function(value, item) {
						return $.fn.dateFormat(value, "-");			
					},
					validate:{validator: "pattern",
						message: "필드값이 정의된 날짜 패턴(yyyymmdd)과 맞지 않습니다.",
						validator: function(value){	
			                return $.isValidDate(value);
			                }},
					editTemplate:function(value,item) {
						var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
						// Enter 키 입력시 입력사항 반영됨
						$result.on("keydown", function(e){
							if(e.which === 13){
								$("#gridDiv").jsGrid("updateItem");
								return false;
							}
						}).on("input keyup", function(e) {
							//숫자입력만 가능
							$(this).val($.fn.removeChar(this.value));
						});
						return $result;
					}
            },
			
			{ name: "regDtm", title:"등록일시", css:"cell", type: "text",  width: 30, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: "trtDtm", title:"변경일시", css:"cell", type: "text",  width: 30, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			
			{ name: "status", title:"상태", css:"cell", type: "text", width: 10, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.getGridRowStatusName(value);		
			}},
			{ name: "gridManupulate", title:"그리드조작", css:"cell", type: "control",  width: 15, align:"left"}
		]
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 통합메시지기본통계(TB_CISSS99) 목록을 전체 조회한다. (SELECT ALL)
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 20.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  편신범 2021. 1. 20. 최초작성
 */
function selectCodeStatList() {
	console.log("selectCodeStatList");
	var reqParam = {};
	// 데이터 조회
	$.callAjax(reqParam, "/mg/sy/mgsy913m/selectCodeStatList.do")
	.done(function(data) {
		// 그리드 초기화
//		resetGrid();
		//그리드 바인딩
		var listData = data.list;
		$("#gridDivStat").jsGrid("loadData", listData).done(function(){ });
	}).fail(function(data){
		console.log("fail to selectCodeStatList !!");
	});
}


/**
 * @설명: 개별코드관리 목록을 전체 조회한다. (SELECT ALL)
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
 */
function selectCodeList() {
	console.log("selectCodeList");
	var reqParam = {};
	// 데이터 조회
	$.callAjax(reqParam, "/mg/sy/mgsy913m/selectCodeList.do")
	.done(function(data) {
		// 그리드 초기화
//		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
	}).fail(function(data){
//		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectCodeList !!");
	});
}


/**
 * @설명: 기간계 검색 조회: 표준용어영문명, 통합코드텍스트값으로 검색, 검색 내용이 없으면 전체 조회 (SELECT BY Keywords)
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @매개변수: stnrdTrmnEngNm , cdcValt
 * @반환값: 
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
 */
function selectCodeStatListByKeywords() {
	var reqParam = {};
	reqParam.stnrdTrmnEngNm = $("#ibx_stnrdTrmnEngNm").val(); // ibx=inputbox
	reqParam.cdcValNm = $("#ibx_cdcValNm").val();;
	
	// 기간계 데이터 검색 조회
	$.callAjax(reqParam, "/mg/sy/mgsy913m/selectCodeStatListByKeywords.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		//그리드 바인딩
		var listData = data.list;
		$("#gridDivStat").jsGrid("loadData", listData).done(function(){ });
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectCodeStatListByKeywords !!");
	});
}


/**
 * @설명: 개별코드관리 검색 조회: 표준용어영문명, 통합코드텍스트값으로 검색, 검색 내용이 없으면 전체 조회 (SELECT BY Keywords)
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 21.
 * @최종변경일: 
 * @매개변수: stnrdTrmnEngNm , cdcValt
 * @반환값: 
 * @개정이력: 
 *  편신범 2021. 1. 21. 최초작성
 */
function selectCodeListByKeywords() {
	var reqParam = {};
	reqParam.stnrdTrmnEngNm = $("#ibx_stnrdTrmnEngNm").val(); // ibx=inputbox
	reqParam.stnrdTrmnKraNm = $("#ibx_stnrdTrmnKraNm").val();
	reqParam.cdcValNm = $("#ibx_cdcValNm").val();;
	
	// IFRS17 데이터 검색 조회
	$.callAjax(reqParam, "/mg/sy/mgsy913m/selectCodeListByKeywords.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		//그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectCodeListByKeywords !!");
	});
}

/**
 * @설명: 그리드 하나의 행을 추가한다.
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
 */
function addGridData() {
	var dataList = $("#gridDiv").jsGrid("option", "data");

	//status컬럼은 그리드 상태 핸들링 하기 위함.(c:신규, u:수정, d:삭제)
	
	$("#gridDiv").jsGrid("insertItem", 
		{
		"status" :  "c",
    	"stnrdTrmnEngNm" : "",
    	"stnrdTrmnKraNm" : "",
    	"cdcValt" : "",
    	"cdcValAbbrNm" : "",
    	"cdcValNm" : "",
    	"useYn" : "",
    	"avlStrYmd" : "",
    	"avlEndYmd" : "",
    	"stdilSeq" : "",
    	"regntEno" : "",
    	"regDtm" : "",
    	"trtrEno" : "",
    	"trtDtm" : ""}
	);
}

//    	"cdcLvl" : "",
//    	"uppStnrdTrmnEngNm" : "",
//    	"uppCdcValt" : "",
//    	"cdcInfoCntnt" : "",
//    	"cdcDfntExpln" : "",

/**
 * @설명: 신규생성, 수정, 삭제 처리한다.
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
 */
function saveGridDataAll() {
	var saveList= new Array();	//저장대상 배열 선언
	var gridData = $("#gridDiv").jsGrid("option", "data");	//전체 데이터
	
	//c,u,d 건만 추출
	for(var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		if(item.status == "c" || item.status == "u" || item.status == "d") {
			//유효값체크
			if(!isValid(i, item)) { return; }
			
			for(var key in item) {
				item[key] = $.trim(item[key]);
			}
			
			saveList.push(item);
		}
	}
	
	if(saveList.length == 0) {
		$.fn.msgBox("저장할 대상이 없습니다.");
		return;
	}
	
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({"list" : JSON.stringify(saveList)}, "/mg/sy/mgsy913m/saveCodeList.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					
					//재조회
					selectCodeList();
				} else {
					$.fn.msgBox("처리 실패");
				}
			}).fail(function(data){
				$.fn.msgBox("처리 실패");
			});
		}
	}, 2);
}

/**
 * @설명: 그리드 상태를 삭제로 변경한다.
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
 */
function delCheckGridData() {
	var gridData = $("#gridDiv").jsGrid("option", "data");
	
	var checkData = gridData.filter(function(el) {
		return typeof el.Checked === "undefined"? false : el.Checked;
	});
	
	if(checkData.length == 0) {
		$.fn.msgBox("삭제할 항목을 선택하세요.");
		return;
	}
	
	$.fn.msgBox("삭제하시겠습니까?", function(obj) {
		$fn.on("keydown", function(e){
				if(e.which == 27) $('message_btn_cn').click();
				$.fn.closeMsgBox(event);
//				$("#btn_search").click();
			});
//		message_btn_cn
//		javascript:$.fn.closeMsgBox(event);
		if(obj.btn_ok) {
			for (var i = 0; i < checkData.length; i++) {
				$("#gridDiv").jsGrid("deleteItem", checkData[i]);
			}
			
			// 선택된 체크박스를 unchecked 함
			grid_check_all(false);
			$("#ckb_all").prop("checked", false);
		}
	}, 2);
}


/**
 * @설명: 그리드 한글 상태값을 리턴한다.
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
 */
function getGridStatusName(value) {
	if(value == 'c') {return "신규";}
	else if(value == 'u') {return "수정";}
	else if(value == 'd') {return "삭제";}
	else {return "";}
}

/**
 * @설명: 저장 전 validation 체크
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @매개변수: rowIndex, item
 * @반환값: boolean
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
 */
function isValid(rowIndex, item) {
	if($.trim(item.stnrdTrmnEngNm) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 표준용어영문명를 입력하세요.");
		return false;
	}
	if($.trim(item.cdcValt) == "") {
		$.fn.msgBox((rowIndex + 1) + "행의 통합코드텍스트값을 입력하세요.");
		return false;
	}
	return true;
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
//	$("#gridDiv").jsGrid("option", "data", []);
	$("#ckb_all").prop("checked", false);
}

/**
 * @설명: byte length
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 22.
 * @최종변경일: 
 * @매개변수: value
 * @반환값: num
 * @개정이력: 
 *  편신범 2021. 1. 22. 최초작성
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

