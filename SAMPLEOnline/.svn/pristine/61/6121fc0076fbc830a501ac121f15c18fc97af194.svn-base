/**
 * @시스템명: IFRS17
 * @업무명: 결산모니터링 
 * @설명: 결산모니터링 화면의 JS
 * @최초작성자: chlehddua
 * @최초작성일: 2021.01.26
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  최동염 2021.01.26 최초작성
 *  최동염 2021.06.14 그리드 너비 수정
 *  최동염 2021.06.15 3차 소스표준화
 *  서승호 2023.06.12 배치PARAM 체크 추가 
 */
// 전역변수 선언부
var batchGridType ="";
var itemObj = {};
var batchRunObj = {};
var batchParamObj = {};
var lv02ClickObj = {};
var lv02ClickIndex = null;
var userInfoObj = {};
var screenPermission = "";

/**
 * @설명: ready
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일:
 * @개정이력: 최동염 2021. 02. 08. 최초작성
 */
$(document).ready(function() {
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
		
	// event 초기화
	initEvent();

	// 그리드 초기화
	initGrid();
	
	// 그리드 초기화
	initGridDtl();
	
	// 그리드 초기화
	initGridExcel();
	
	$("#inp_finYm_from").focus();
});

/**
 * @설명: event 초기화
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일:
 * @개정이력: 최동염 2021. 02. 08. 최초작성
 */
function initEvent() {
	userInfoObj = $.fn.getLoginUserInfo();
	screenPermission = $.fn.getScreenPermissionInfo("fimt411m");
	
	$("#btn_bndlManopFin").hide();
	
	$.fn.setBtnPermission([{"btnId":"#btn_bndlManopFin"}]);
	
	// 마감년월
	$('#inp_finYm_from').val(setFinYm());
	
	setFinDate();
	
	selectSrchCdList("ACT_LV01_CD", "srch_sbx_actLv01Cd");
	
	//마감년월 입력창 blur
	$('#inp_finYm_from').on('blur', function(e) {
		//빈값 체크
		if($.fn.isEmpty(this.value)) {
			$('#inp_stactStartDate_from').val("");
			return;
		}
		
		//날짜형식 체크
		if($.isValidYm(this.value)) {
			$(this).val($.fn.monthFormat(this.value, "-"));
			setFinDate();
		} else {
			$('#inp_stactStartDate_from').val("");
			$.fn.msgBox('마감년월의 날짜 형식이 맞지 않습니다. 다시 입력해주세요.');
			$(this).focus();
		}
		
		//[2021-11-03 제외]initReGrid();
		document.getElementById("btn_new_tms").innerHTML = "<img src='/img/btn_new_center.png' > 결산개시";
	});
	
	// Enter키로 조회 : 마감년월
	$("#inp_finYm_from").on("keyup", function(e){
		if(e.which === 13){
			//날짜형식 체크
			if($.isValidYm(this.value)) {
				$(this).val($.fn.monthFormat(this.value, "-"));
				$("#btn_search").click();
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		}else{
			initReGrid();
			
			if($.replaceAll($(this).val().trim(), '-','').length == 6){
				setFinDate();
			}else{
				$('#inp_stactStartDate_from').val("");
			}		
		}
	});
	
	//마감년월 입력창 click
	$("#inp_finYm_from").on("click", function(e){
		$(this).select();
	});
	
	// Enter키로 조회 : 부서코드
	$("#inp_actFinDeptCd").on("keyup", function(e){
		if(e.which === 13){
			$("#btn_search").click();
		}else{
			initReGrid();
			setFinDeptNm();
		}
	});
	
	//담당부서 팝업
	$("#btn_deptSearch").on("click", function(e){
		openPopupDeptSearch();
	});
	
	// 조회
	$("#btn_search").on("click", function(e) {
		if(selectMonitoringTmsInfo() == null){
			$.fn.msgBox("결산개시정보가 없습니다. 결산개시 먼저 진행해주세요.");
			document.getElementById("btn_new_tms").innerHTML = "<img src='/img/btn_new_center.png' > 결산개시";
			initReGrid();
			return false;
		}else{			
			document.getElementById("btn_new_tms").innerHTML = "<img src='/img/btn_new_center.png' > 결산재개시";
			callInsertMonitoringAddmTmsInfo();
		}	
		
		lv02ClickObj = {};
		lv02ClickIndex = null;
		selectMonitoringMngList();
	});
	
	// 일괄수동마감
	$("#btn_bndlManopFin").on("click", function(e) {
		saveBndlManopFin();
	});
	
	// N1원장입수결과
	$("#btn_n1Result").on("click", function(e) {
		openPopupN1ResultSearch();
	});
	
	//엑셀다운로드 버튼 click
	$("#btn_excel_download").on("click", function(e){
		selectMonitoringExcelList();
		
		var fileName = $(".main_title h3.title").text() + "_" + $.replaceAll($("#inp_finYm_from").val().trim(), '-','') + ".xlsx";
		$.fn.exportGridExcel({
			id: 'gridExcelDiv', 
			fileName: fileName
		});
	});
	
	// N1원장입수결과
	$("#srch_sbx_actLv01Cd").on("change", function(e) {
		initReGrid();
	});
	
	// New 마감회차 등록
	$("#btn_new_tms").on("click", function(e) {
		$.fn.msgBox("기 진행된 결산마감처리정보가 초기화 됩니다. 처리하시겠습니끼?", function (obj) {
			if(obj.btn_ok) {
				callInsertMonitoringNewTmsInfo();				
			} else if(obj.btn_cancel) {
			} else if(obj.btn_close) {
			}
		}, 2);
	});
	
	// 배치 Param 등록
	$("#btn_batch_param").on("click", function(e) {
		openPopupBatchParamMng();
	});
}

/**
 * @설명: initGrid : GridTable 생성
 * @최초작성자: 최동염
 * @최초작성일: 2021. 01. 18.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 01. 18. 최초작성
 */
function initGrid() {

	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id : "gridDiv",
		height : 350,
		editing : true,
		sorting : true,
		paging : false,
		//pageSize: 10,
		confirmDeleting : false,
		headerRowRenderer: function() {
			var $result = $("<tr>").height(0)
				.append($("<th>").width(70))
				.append($("<th>").width(15))
				.append($("<th>").width(150))
				.append($("<th>").width(20))
				.append($("<th>").width(15))
				.append($("<th>").width(15))
				.append($("<th>").width(25))
				.append($("<th>").width(35))
				.append($("<th>").width(30));
		
			$result = $result.add($("<tr class='jsgrid-header-row'>")
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("구분"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("결산순서"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("결산 Activity"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("진행상태"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("오류여부"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("D-day"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("마감시각"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("담당부서"))
				); 
			return $result;
		},
		fields : [
					{name: "actNm01", title: "구분", css: "cell", type: "text", width: 70, editing: false, align: "center"},
					{name: "actSeq", title: "결산순서", css: "cell", type: "text", width: 15, editing: false, align: "center"},
					{name: "actNm02", title: "결산 Activity", css: "cell", type: "text", width: 150, editing: false, align: "left"},
					{name: "actPrgStat", title: "진행상태", css:"cell", type: "text",  width: 20, align:"center", editing: false, 
						itemTemplate : function(value, item) {
							
							var $img = "";
							if(value == "S"){
								$img = $("<img>").attr("src","/img/img_status_03.png;")
							}else if(value == "R"){
								$img = $("<img>").attr("src","/img/img_status_02.png;")
							}else if(value == "F"){
								$img = $("<img>").attr("src","/img/img_status_01.png;")
							}
							
							return $("<div>").append($img);					
						}
					},
					{name: "mstkYn", title: "오류여부", css: "cell", type: "text", width: 15, editing: false, align: "center"},
					{name: "dDay", title: "D-day", css: "cell", type: "text", width: 15, editing: false, align: "center"},
					{name: "dDate", title: "D-date", css: "cell", type: "text", width: 25, editing: false, align: "center"},
					{name: "finTod", title: "마감시각", css: "cell", type: "text", width: 35, editing: false, align: "center"},
					{name: "actFinDeptNm", title: "담당부서", css: "cell", type: "text", width: 30, editing: false, align: "center"},
					{name: "actFinDeptCd", title: "담당부서", css: "cell", type: "text", width: 30, editing: false, align: "center", visible:false}
			     ]
		});
	
	gridObject.rowClick(function(args) {
		lv02ClickIndex = args.itemIndex;
		clickObject = args.item;
		console.log("clickObject : ",clickObject);
		showActivityContent(clickObject);
	});	
	
	// 그리드 생성
	
	gridObject.gridCreate();
}



/**
 * @설명: initGrid : GridTable 생성
 * @최초작성자: 최동염
 * @최초작성일: 2021. 01. 18.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 01. 18. 최초작성
 */
function initGridDtl() {

	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id : "gridDtlDiv",
		height : 230,
		editing : true,
		sorting : true,
		paging : false,
		confirmDeleting : false,
		fields : [
					{name: "actSeq", title: "결산순서", css: "cell", type: "text", width: 15, editing: false, align: "center"},
					{name: "actNm03", title: "결산 상세 Activity", css: "cell", type: "text", width: 200, editing: false, align: "left"},
					{name: "actPrgStat", title: "진행상태", css: "cell", type: "text", width: 20, editing: false, align: "center", 
						itemTemplate : function(value, item) {
							var $img = "";
							if(value == "S"){
								$img = $("<img>").attr("src","/img/img_status_03.png;")
							}else if(value == "R"){
								$img = $("<img>").attr("src","/img/img_status_02.png;")
							}else if(value == "F"){
								$img = $("<img>").attr("src","/img/img_status_01.png;")
							}
							return $("<div>").append($img);					
						}
					},
					{name: "mstkYn", title: "오류여부", css: "cell", type: "text", width: 20, editing: false, align: "center"},
					{name: "actFinTypNm", title: "작업유형", css: "cell", type: "text", width: 20, editing: false, align: "center"},
					{name: "batGroupId", title: "배치그룹ID", css: "cell", type: "text", width: 25, editing: false, align: "center"},
					{name: "finTod", title: "마감시각", css: "cell", type: "text", width: 50, editing: false, align: "center"},
					{name: "gridBtn", title:"", css:"cell", type: "text",  width: 30, editing: false, align:"left", 
						itemTemplate:function(value, item){
							if(item.actFinTypCd == '1'){
								const btnFinPopup = $("<button class='grid_inbtn_s'>").text("작업내역")
								var $pFinEl2 = $("<p>").addClass("fr");
								var $aFinEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
									// 배치실행 내역 조회팝업호출
									callBatchSearchPopup(item);
								});
								$aFinEl.append(btnFinPopup);
								
								return $("<div style='display:inline-block;'>").append($pFinEl2.append($aFinEl));
							}else{		
								if(lv02ClickObj.actFinDeptCd == userInfoObj.orgNo && screenPermission == 'Y'){
									if (item.actPrgStat == "F") {
										const btnFinPopup = $("<button class='grid_inbtn_s'>").text("마감취소")
										var $pFinEl2 = $("<p>").addClass("fr");
										var $aFinEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
											// 마감처리 취소
											$.fn.msgBox("마감을 취소하면 결산이 진행됐던 후속 단계까지 모두 취소 됩니다.\n마감 취소를 하겠습니까?", function (obj) {
												if(obj.btn_ok) {
													callFinCencelPopup(item);
												} else if(obj.btn_cancel) {
												} else if(obj.btn_close) {
												}
											}, 2);
										});
										$aFinEl.append(btnFinPopup);
										
										return $("<div style='display:inline-block;'>").append($pFinEl2.append($aFinEl));
									}else{
										const btnBatPopup = $("<button class='grid_inbtn_s'>").text("마감확정")
										var $pBatEl2 = $("<p>").addClass("fr");
										var $aBatEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
											// 수동마감 처리
											$.fn.msgBox("마감 확정되고 후속 단계가 [자동마감]인 경우 이어서 결산활동이 진행됩니다.\n마감 확정을 하겠습니까?", function (obj) {
												if(obj.btn_ok) {
													//callFinRunPopup(item); 
													selectBundleRunParamInfo(item); //배치 PARAM 체크 추가 - 20230612 
												} else if(obj.btn_cancel) {
												} else if(obj.btn_close) {
												}
											}, 2);
										});
										$aBatEl.append(btnBatPopup);
																			
										return $("<div style='display:inline-block;'>").append($pBatEl2.append($aBatEl));
									}
									
								}
							}
						}
					},
					{name: "actFinTypCd", title: "작업유형코드", css: "cell", type: "text", width: 30, editing: false, align: "center", visible:false}
			   ]
			});
	
	// 그리드 생성
	gridObject.gridCreate();

}

/**
 * @설명: initGridExcel : GridTable 생성
 * @최초작성자: 최동염
 * @최초작성일: 2021. 01. 18.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 01. 18. 최초작성
 */
function initGridExcel() {

	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id : "gridExcelDiv",
		height : 250,
		editing : true,
		sorting : true,
		paging : false,
		confirmDeleting : false,
		fields : [
					{name: "actSeq", title: "결산순서", css: "cell", type: "text", width: 15, editing: false, align: "center"},
					{name: "actNm01", title: "결산 Activity(상분류)명", css: "cell", type: "text", width: 200, editing: false, align: "left"},
					{name: "actNm02", title: "결산 Activity(중분류)명", css: "cell", type: "text", width: 200, editing: false, align: "left"},
					{name: "actNm03", title: "결산 Activity(하분류)명", css: "cell", type: "text", width: 200, editing: false, align: "left"},
					{name: "batchId04", title: "결산 배치ID", css: "cell", type: "text", width: 200, editing: false, align: "left"},
					{name: "actNm04", title: "결산 배치명", css: "cell", type: "text", width: 200, editing: false, align: "left"},
					{name: "actPrgStat", title: "진행상태", css: "cell", type: "text", width: 20, editing: false, align: "center"},
					{name: "mstkYn", title: "오류여부", css: "cell", type: "text", width: 20, editing: false, align: "center"},
					{name: "dDay", title: "D-DAY", css: "cell", type: "text", width: 20, editing: false, align: "center"},
					{name: "dDate", title: "D-DATE", css: "cell", type: "text", width: 20, editing: false, align: "center"},
					{name: "finTod", title: "마감시각", css: "cell", type: "text", width: 50, editing: false, align: "center"},
					{name: "actFinDeptNm", title: "담당부서명", css: "cell", type: "text", width: 30, editing: false, align: "center"},
					{name: "actFinDeptCd", title: "담당부서코드", css: "cell", type: "text", width: 30, editing: false, align: "center"},
			   ]
			});
	
	// 그리드 생성
	gridObject.gridCreate();
	
	$('#gridExcelDiv').hide();
}



/**
 * @설명: 부서검색 팝업을 호출한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function openPopupDeptSearch() {
	activityGrideType = "dept";	
	var popupOption = {
			url: "/fi/mt/fimt311p.do",
			name: "부서번호조회팝업",
			width: 800,
			height: 464
	}
	$.fn.openPopup(popupOption);
}

/**
 * @설명: N1원장입수결과 검색 팝업을 호출한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function openPopupN1ResultSearch() {
	var popupOption = {
			url: "/fi/mt/fimt412p.do",
			name: "SAP원장입수결과조회팝업",
			width: 1200,
			height: 464
	}
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 배치 Param 관리 팝업을 호출한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function openPopupBatchParamMng() {
	
	batchParamObj.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	
	var popupOption = {
			url: "/fi/mt/fimt413p.do",
			name: "배치Param관리팝업",
			width: 1200,
			height: 870
	}
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 부서조회 팝업 콜백
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: resultObj
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function resultPopup_callback(resultObj) {
	console.log("[부서조회 팝업 콜백] resultObj", resultObj);
	
	initReGrid();
	$("#inp_actFinDeptCd").val(resultObj.stactActFinDeptCd);
	$("#inp_actFinDeptNm").val(resultObj.stactActFinDeptNm);
}

/**
 * @설명: selectMonitoringMngList : 마감및모니터링관리 목록을 조회한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021. 01. 18.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 01. 18. 최초작성
 */
function selectMonitoringMngList() {
	console.log("selectMonitoringMngList js 실행!!!");
	var reqParam = {};
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val().trim(), '-','');
	reqParam.stactStartDate = $("#inp_stactStartDate_from").val().trim();
	reqParam.actFinDeptCd = $("#inp_actFinDeptCd").val();
	reqParam.actLv01Id = $("#srch_sbx_actLv01Cd").val();
	
	console.log("reqParam",reqParam);
	
	if ($.fn.isEmpty(reqParam.finYm)) {
		$.fn.msgBox('마감년월을 입력하시기 바랍니다.');
		return false;
	}

	// 데이터 조회
	$.callAjax(reqParam, "/fi/mt/fimt411m/selectBundleRunMonitoringMngList.do",{async:false}).done(
			function(data) {
				initReGrid();

				// 그리드 바인딩
				var listData = data.list;
				$("#gridDiv").jsGrid("loadData", listData).done(function() {
					if(lv02ClickIndex != null){
						showActivityContent(lv02ClickObj);
					}
				});
				
				//0건 그리드 메세지 처리
				if(listData.length == 0){
					$.fn.getReturnValue("gridDiv");
				}
			}).fail(function(data) {
		console.log("fail to selectMonitoringMngList !!");
	});
}

/**
 * @설명: 결산모니터링 상세
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 02. 08. 최초작성
 */
function showActivityContent(clickObject){
	$('#btn_n1Result').show();
	lv02ClickObj = clickObject;
	var reqParam = {};
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	reqParam.stactActUppId = clickObject.actId02;

	// 데이터 조회
	$.callAjax(reqParam, "/fi/mt/fimt411m/selectBundleRunMonitoringDtlList.do",{async:false}).done(
			function(data) {
				// 그리드 초기화
				resetGrid("gridDtlDiv");

				// 그리드 바인딩
				var listData = data.list;
				$("#gridDtlDiv").jsGrid("loadData", listData).done(function() {
				});
				
				//0건 그리드 메세지 처리
				if(listData.length == 0){
					$.fn.getReturnValue("gridDtlDiv");
				}
			}).fail(function(data) {
		console.log("fail to selectMonitoringDtlList !!");
	});
}

/**
 * @설명: selectMonitoringExcelList : 마감및모니터링 Excel 다운 목록을 조회한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021. 01. 18.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 01. 18. 최초작성
 */
function selectMonitoringExcelList() {
	var reqParam = {};
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val().trim(), '-','');
	reqParam.stactStartDate = $("#inp_stactStartDate_from").val().trim();
	reqParam.actFinDeptCd = $("#inp_actFinDeptCd").val();
	reqParam.actLv01Id = $("#srch_sbx_actLv01Cd").val();
	
	console.log("reqParam",reqParam);
	
	if ($.fn.isEmpty(reqParam.finYm)) {
		$.fn.msgBox('마감년월을 입력하시기 바랍니다.');
		return false;
	}

	// 데이터 조회
	$.callAjax(reqParam, "/fi/mt/fimt411m/selectBundleRunMonitoringExcelList.do",{async:false}).done(
			function(data) {
								// 그리드 바인딩
				var listData = data.list;
				$("#gridExcelDiv").jsGrid("loadData", listData).done(function() {
				});
			}).fail(function(data) {
		console.log("fail to selectMonitoringExcelList !!");
	});
}

/**
 * @설명: 배치실행 팝업을 호출한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function callBatchRunPopup(item) {
	console.log("callBatchRunPopup !!",item);
	
	var stage = selectStage();
	var url = "";
	
	if(stage == "PROD"){
		url = "/mg/sy/mgsy915p.do"
	}else if(stage == "TEST"){
		url = "/mg/sy/mgsy915p.do"
	}else{
		url = "/mg/sy/mgsy915p.do"
	}
	
	batchRunObj.actUppId = item.actId03;
	batchRunObj.batchId = "";
	batchRunObj.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	
	var popupOption = {
			url: url,
			name: "배치실행팝업",
			width: 1200,
			height: 650
	}
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 배치실행 내역 팝업을 호출한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function callBatchSearchPopup(item) {
	console.log("callBatchSearchPopup !!",item);
	
	itemObj = item;
	itemObj.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	
	var popupOption = {
			url: "/fi/mt/fimt411p.do",
			name: "배치실행내역팝업",
			width: 1200,
			height: 434
	}
	$.fn.openPopup(popupOption);
}

/**
 * @설명: 수동마감처리를 한다
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function callFinRunPopup(item) {
	var reqParam = item;
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	
	console.log("reqParam",reqParam);
	
	if (item.actPrgStat == "F") {
		$.fn.msgBox('이미 마감처리된 결산항목입니다.');
		return false;
	}
	
	$.callAjax(reqParam, "/fi/mt/fimt411m/insertBundleRunFinInfo.do")
	.done(function(data) {
		if(data.result == "1") {
			selectMonitoringMngList();
		} else {
			$.fn.msgBox(data.warnning.errorMessage);
		}		
	}).fail(function(data){
	});
}

/**
 * @설명: 수동마감 취소처리를 한다
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function callFinCencelPopup(item) {
	var reqParam = item;
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	
	if (item.actPrgStat == "S") {
		$.fn.msgBox('마감처리 되지 않은 결산항목입니다.');
		return false;
	}
	
	$.callAjax(reqParam, "/fi/mt/fimt411m/updateBundleRunFinCencelInfo.do")
	.done(function(data) {
		
		if(data.result == "1") {
			selectMonitoringMngList();
		} else {
			$.fn.msgBox("처리를 실패하였습니다..");
		}
	}).fail(function(data){
	});
}

/**
 * @설명: 마감New회차정보 등록
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function callInsertMonitoringNewTmsInfo() {
	var reqParam = {};
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	
	$.callAjax(reqParam, "/fi/mt/fimt411m/insertBundleRunMonitoringNewTmsInfo.do",{async:false})
	.done(function(data) {
		if(data.tmsPermissionYn == "N"){
			$.fn.msgBox('결산개시 권한이 없습니다.');
		}else{
			if(data.result > "0") {
				$.fn.msgBox('결산마감개시가 처리되었습니다.');
				lv02ClickObj = {};
				lv02ClickIndex = null;
				selectMonitoringMngList();
			}else{
				$.fn.msgBox("처리를 실패하였습니다..");
			}
		}	
	}).fail(function(data){
	});
}

/**
 * @설명: 마감New회차정보 등록
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function callInsertMonitoringAddmTmsInfo() {
	var reqParam = {};
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	
	$.callAjax(reqParam, "/fi/mt/fimt411m/insertBundleRunMonitoringAddmTmsInfo.do")
	.done(function(data) {
		console.log("callInsertMonitoringAddmTmsInfo 처리되었습니다!!");
	}).fail(function(data){
		console.log("callInsertMonitoringAddmTmsInfo 처리를 실패하였습니다!!");
	});
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일:
 * @매개변수:
 * @반환값:
 * @개정이력: 최동염 2021. 02. 08. 최초작성
 */
function resetGrid(gridNm) {
	$("#"+gridNm).jsGrid("reset");
	$("#"+gridNm).jsGrid("option", "data", []);
}

/**
 * @설명: 초기 마감월 세팅
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function setFinYm(){
	// 마감년월 셋팅
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();
	
	var calcDate = new Date(year, month, "1");
	
	year = calcDate.getFullYear();
	month = '' + (calcDate.getMonth()+1);
	
	if (month.length < 2) month = '0' + month;
	
	var finYm = $.fn.monthFormat((year+month),'-');
	
	return finYm;
}

/**
 * @설명: 마감월 처리 결산시작일 조회
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function setFinDate(){
	var reqParam = {};
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/mt/fimt411m/selectBundleRunFinDate.do",{async:false}).done(
			function(data) {
				var thmmSalesStrYmd = data.thmmSalesStrYmd;	
				$('#inp_stactStartDate_from').val($.fn.dateFormat(thmmSalesStrYmd));
				//[2021-11-03 제외]initReGrid();
			}).fail(function(data) {
		console.log("fail to setFinDate !!");
	});
}

/**
 * @설명: 담당부서명 조회
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function setFinDeptNm(){
	var reqParam = {};
	reqParam.finDeptCd = $("#inp_actFinDeptCd").val();
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/mt/fimt411m/selectBundleRunFinDeptNm.do",{async:false}).done(
			function(data) {
				var finDeptNm = data.finDeptNm;	
				$('#inp_actFinDeptNm').val(finDeptNm);
			}).fail(function(data) {
		console.log("fail to setFinDeptNm !!");
	});
}

/**
 * @설명: 현재 접속한 서버 스테이지 코드 조회
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function selectStage(){
	var reStage = "";
		
	// 데이터 조회
	$.callAjax({},"/fi/mt/fimt411m/selectBundleRunStage.do",{async:false}).done(
			function(data) {
				reStage = data.stage;
			}).fail(function(data) {
		console.log("fail to selectStage !!");
	});
	
	return reStage;	
}

/**
 * @설명: 수동마감처리를 한다
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: rowItem
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function saveBndlManopFin() {
	var updateList = [];
	
	var gridData = $("#gridDtlDiv").jsGrid("option", "data");
	var finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	
	for (var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		if(item.actFinTypCd == "2" && item.actPrgStat != 'F'){
			item.finYm = finYm;
			updateList.push(item);
		}
	}
	
	if (updateList.length <= 0) {
		$.fn.msgBox('수동마감처리할 결산항목이 없습니다.');
		return false;
	}
	
	$.callAjax({"list":JSON.stringify(updateList)}, "/fi/mt/fimt411m/saveBundleRunBndlManopFinList.do")
	.done(function(data) {
		if(data.result == "1") {
			selectMonitoringMngList();
		} else {
			$.fn.msgBox("처리를 실패하였습니다..");
		}
	}).fail(function(data){
	});
}

/**
* 
* @설명: 배치실행 팜업 콜백
* @최초작성자: 최동염
* @최초작성일: 2021. 02. 08.
* @최종변경일:
* @매개변수: 
* @반환값: 
* @개정이력: 최동염 2021. 02. 08. 최초작성
* 
*/
function resultBatchRunPopup_callback(){
	selectMonitoringMngList();
}

/**
 * @설명: 조회 항목코드를 조회한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021.02.23
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectSrchCdList(codeId, selId) {
	var reqParam = {};
		
	// 데이터 조회
	$.callAjax(reqParam, "/fi/mt/fimt411m/selectBundleRunActLv01List.do",{async:false})
	.done(function(data) {
		$._commonObj["code"] = {}; //초기화
		$._commonObj.code[codeId] = data.list;
		
		$.fn.renderCombobox({
			useFirstOption  : true,
			firstOptionText : "전체",
			firstOptionValue: "",
			codeArr         : [codeId],
			selArr          : [selId]
		});
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectSrchCdList !!");
	});
}

/**
 * @설명: 결산개시정보 조회
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.21
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 최동염 2021.01.21 최초작성
 */
function selectMonitoringTmsInfo(){
	var finTms = "";
	var reqParam = {};
	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/mt/fimt411m/selectBundleRunMonitoringTmsInfo.do",{async:false}).done(
			function(data) {
				finTms = data.finTms;	
			}).fail(function(data) {
		console.log("fail to setFinDeptNm !!");
	});
	
	return finTms;
}


/**
 * @설명: 배치개별 Param검색
 * @최초작성자: 서승호
 * @최초작성일: 2023.06.12
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 서승호 2023.06.12 최초작성
 */
function selectBundleRunParamInfo(item){
	var reqParam = {};
	var result ='';
	var param = '';

	reqParam.finYm = $.replaceAll($("#inp_finYm_from").val(), '-','');
	reqParam.paramId = item.batGroupId;
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/mt/fimt411m/selectBundleRunParamInfo.do",{async:false}).done(
			function(data) {
				if(data.result && data.result.length > 0){
					$.fn.msgBox(data.result[0].batExpln + '(' + data.result[0].batId+')\r\n'+data.result[0].inptPrmtrId+' 는 필수 입력값입니다.');
					return false;
				}else{
					callFinRunPopup(item);
				}
			}).fail(function(data) {
		//console.log("selectBundleRunParamInfo call !!");
	});
	
	return result;
}

/**
* 
* @설명: 그리드초기화
* @최초작성자: 최동염
* @최초작성일: 2021. 02. 08.
* @최종변경일:
* @매개변수: 
* @반환값: 
* @개정이력: 최동염 2021. 02. 08. 최초작성
* 
*/
function initReGrid(){
	//$('#btn_n1Result').hide();
		
	// 그리드 초기화
	resetGrid("gridDiv");
	
	// 그리드 초기화
	resetGrid("gridDtlDiv");
}
