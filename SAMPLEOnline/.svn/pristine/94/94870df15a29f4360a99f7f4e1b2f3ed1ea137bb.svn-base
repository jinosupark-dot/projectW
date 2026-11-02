/**
 * @시스템명: IFRS17
 * @업무명: 변동분석 Audit Trail
 * @설명: 변동분석 Audit Trail JSP
 * @최초작성자: 66000409(김완태)
 * @최초작성일: 2021.11
 * @최종변경일: 
 * @개정이력:
 */
$(document).ready(function(){
	/* 툴팁 추가 */
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/* 화면ID  */
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	$._commonObj["code"] = {}; //초기화
	$._commonObj.code["AUDIT_SCR_COMBO"] = [{code:"A",codeNm:"원수잔여보장요소조회"}
	                                      , {code:"B",codeNm:"원수발생사고요소조회"}
	                                      , {code:"C",codeNm:"재보험잔여보장요소조회"}
	                                      , {code:"D",codeNm:"재보험발생사고요소조회"}];
	$.fn.renderCombobox({
		useFirstOption  : false,
		codeArr         : ["AUDIT_SCR_COMBO"],
		selArr          : ["sbx_flctClass"]
	});
	
	//공통코드(통합수준코드) 콤보박스
	initCommCd();
	
	// event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
});

/**
 * @설명: 업무구분 조회 
 * @최초작성자: 66000409(김완태)
 * @최초작성일: 2021.11
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initCommCd() {
	let reqParam = {headerCombocd : '1', flctClass : $("#sbx_flctClass").val()};
	
	$.callAjax(reqParam, "/fi/at/fiat311m/selectAuditTrailHeader.do",{async:false})
	.done(function(data) {
		
		$._commonObj.code["AUDIT_COMBO"] = data.list;
		$.fn.renderCombobox({
			useFirstOption  : false,
			codeArr         : ["AUDIT_COMBO"],
			selArr          : ["sbx_flctAnly"]
		});
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectAuditTrailHeader !!");
	});
}

/**
 * @설명: event 초기화
 * @최초작성자: 66000409(김완태)
 * @최초작성일: 2021.11
 * @최종변경일: 
 * @개정이력: 
 */
function initEvent() {
	//엔터조회
	$(document).on("keypress", function(e){
		if(e.keycode == 13 || e.which == 13){
			$("#btn_search").trigger("click");
		}
	});
	
	// 조회
	$("#btn_search").on("click", function(e){
		selectAuditTrail();
	});
	
	//콤보박스 change
	$("#sbx_flctClass").on("change", function(e) {
		initCommCd();
		$("#sbx_flctAnly").trigger("change");
	});
	$("#sbx_flctAnly").on("change", function(e) {
		$("#gridDiv").jsGrid("destroy");

		initGrid();
		
		if(!$.fn.isEmpty($('#inp_finYm').val())) {
			selectAuditTrail();
		}
	});
	
	//마감년월 입력창 blur
	$("#inp_finYm").on("blur", function(e) {
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
				$(_this).focus();
			});
		}
	}).on("focus", function() {
		$(this).select();
	});
	
	//마감년월 달력버튼 click
	$('#btn_finYm').on('click', function(e){
		$('#inp_finYm').datepicker('show');
	});
	
	//엑셀다운로드(타이틀_일자YYYYMMDD.xlsx)
	$("#btn_xlsdown").on("click", function(e){
		var fileName = "부채결산_AuditTrail_" +  $('#sbx_flctAnly option:selected').text()
			         + $.replaceAll($('#inp_finYm').val(), '-','') 
		             + ".xlsx";
		exportGridExcel({
			id       : 'gridDiv', 
			fileName : fileName
		});
	});
}

/**
 * @설명: grid생성
 * @최초작성자: 66000409(김완태)
 * @최초작성일: 2021.11
 * @최종변경일: 
 * @개정이력: 
 */
var subHeader = ['금액', '차이', '비고'];
var audHeader = null;
function initGrid(){
	
	var audScrid = $("#sbx_flctAnly option").index($("#sbx_flctAnly option:selected"));
	
	if(audScrid<0){
		return;
	}
	
	let reqParam = {headerCombocd : '2', srchSrnId : $("#sbx_flctAnly").val()};
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/at/fiat311m/selectAuditTrailHeader.do",{async:false})
	.done(function(data) {
		
		audHeader = data.list;
		var gridFields = [];
		
		gridFields.push({ name:'auditNm' , title:'항목명', css:"cell", type: "text", width: 220, align:"left" });
		for (var i = 1; i <= audHeader.length; i++) {
			if(i!=2){
				gridFields.push({ name:'tab'+i+'Unitamt' , title: '금액'+i, css:"cell", type: "text", width: 180, align:"right",
					itemTemplate : function(value,item){
						return $.fn.isEmpty(value) ? value :$.addCommaNumber(value + "");
					}});
			}
			gridFields.push({ name:'tab'+i+'Itmprodcntnt' , title: (i==2?'금액':'차이')+i, css:"cell", type: "text", width: 180, align:"right",
					itemTemplate : function(value,item){
						return $.fn.isEmpty(value) ? value :$.addCommaNumber(value + "");
					} });
			gridFields.push({ name:'tab'+i+'Note' , title: '비고'+i, css:"cell", type: "text", width: 180, align:"center"});
		}
		
		var gridObject = new ComJsGrid({
			id       : "gridDiv",
			height   : 675,
			editing  : false,
			sorting  : false,
			paging   : false,
			confirmDeleting: false,
			//2줄 헤더 /fijr211m.js 참조...fidc411m..
			headerRowRenderer: function() {
				var $tr = $("<tr>").height(0).append($("<th>").width(220));
				for(var i=1 ; i<(audHeader.length*3) ;i++){
					$tr.append($("<th>").width(180));
				}
				
				var $result =$tr; 
				
				// header 1row
				$tr = $("<tr class='jsgrid-header-row'>")
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center'>").attr("rowspan", 2).text("항목명"));
				for(var i=0 ; i<audHeader.length ; i++){
					$tr.append($("<th class='jsgrid-header-cell cell jsgrid-align-center'>").attr("colspan", i==1?2:3).text(audHeader[i].codeNm));
				}
				$result = $result.add($tr);
				
				// header 2row
				$tr = $("<tr class='jsgrid-header-row'>");
				for(var i=0 ; i<audHeader.length ; i++){
					for (var j = 0; j < subHeader.length; j++) {
						if(!(i==1&&j==1)){
							$tr.append($("<th class='jsgrid-header-cell cell jsgrid-align-center'>").text(subHeader[j]));
						}
					}
				}
				$result = $result.add($tr);
				
				return $result;
			},
			fields : gridFields
		});
		
		//row rowDoubleClick event - 비고에 #이 붙으면 첨부파일을 다운로드 처리. - 운영계 환경에서 파일 처리 문제로 폐기처리 함.
//		gridObject.rowDoubleClick(function(args) {
//			downloadFile(args);
//		});
		
		// 그리드 생성
		gridObject.gridCreate();

	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectAuditTrailHeader !!");
	});

}

/**
 * @설명: 파일 다운로드 ref from mgsy911m.js
 * @최초작성자: 66000409(김완태)
 * @최초작성일: 2021.12
 * @최종변경일: 
 * @매개변수:
 * @반환값: 
 * @개정이력: 
 */
function downloadFile(args) {

	var cellVal = args.event.target.outerText;
	
	if($.fn.isEmpty(cellVal) || !cellVal.startsWith("#")){
		return;
	}
	
	$.fn.msgBox("첨부 파일을 다운로드 하시겠습니까?", function (obj) {
		if(obj.btn_ok) {
			$.fn.fileDownload("/mg/sy/mgsy911m/downloadFile.do?filePath=" + encodeURIComponent("/SHARE/program/AUDITTRAIL/" + cellVal + ".xlsm"));			
		}
	}, 2);
}


/**
 * @설명: AuditTrail 데이터 조회
 * @최초작성자: 66000409(김완태)
 * @최초작성일: 2021.11
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectAuditTrail(){
	if($.fn.isEmpty($('#inp_finYm').val())) {
		$.fn.msgBox("조회 마감년월을 입력하세요.");
		return;
	}
	if($.fn.isEmpty($('#sbx_flctAnly').val())) {
		$.fn.msgBox("조회 업무구분을 입력하세요.");
		return;
	}
	
	var reqParam = {};
	reqParam.srchFinYm = $("#inp_finYm").val().replace(/-/g, "");
	reqParam.srchSrnId = $("#sbx_flctAnly").val();
	
	

	$.callAjax(reqParam, "/fi/at/fiat311m/selectAuditTrailList.do")
	.done(function(data) {
		// 그리드 데이터 초기화	
		$("#gridDiv").jsGrid("reset");
		
		// 그리드 바인딩
		var listData = data.list;
		//gridInit field에 eval을 넣었더니.. 엑셀다운로드 할 때 수식이 나옴... transaction done에서 json 데이터 수정.
		$.each(listData, function(key, value){
			for(var fkey in value){
				if(fkey.endsWith("Itmprodcntnt") && !$.fn.isEmpty(value)){
					value[fkey] = eval(value[fkey]);
				}
			}
		});
		$("#gridDiv").jsGrid("loadData", listData).done(function(){});
		
		/* 0건 그리드 메세지 처리 */
		if(listData.length == 0) {
			$.fn.getReturnValue("gridDiv");
		}
		
		
	}).fail(function(data){
		console.log("fail to selectAuditTrail");
	});		
}

/**
 * @설명: rpadding
 * @최초작성자: 66000409(김완태)
 * @최초작성일: 2021.12
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
String.prototype.rpad = function(ip, sp){
	return this + Array(ip + String(this).length + 1).join(sp||'0');
}

/**
 * @설명: 엑셀 다운로드 - 화면모양대로 엑셀 다운로드 해야 해서 공통 modding - ref from common.js
 * @최초작성자: 66000409(김완태)
 * @최초작성일: 2021.12
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
var exportGridExcel = function(paramObj){
	if(typeof paramObj != 'object') {
		$.fn.msgBox("파라미터는 JSON Object로 요청해야 합니다.");
		return;
	}
	var gridId = paramObj.id;
	var fileName = paramObj.fileName || "export_grid.xlsx";
	if(!fileName.toLowerCase().endsWith(".xlsx")) fileName + ".xlsx";
	var checkVisible = (typeof paramObj.checkVisible != 'undefined') ? paramObj.checkVisible : true;
	var applyItemTemplate = (typeof paramObj.applyItemTemplate != 'undefined') ? paramObj.applyItemTemplate:false;
	
	if($("#" + gridId).jsGrid("option", "data").length == 0) {
		$.fn.msgBox("export할 데이터가 존재하지 않습니다.");
		return;
	}
	var excelHandler = {
			getExcelFileName : function(){
				return fileName;
			},
			getSheetName : function(){
				return "sheet1";
			},
			getExcelData : function(){
				var _data = $("#" + gridId).jsGrid("option", "data");
				var _fields = $("#" + gridId).jsGrid("option", "fields");
				var excelObjList = [];
				
				//더블헤더 넣어주세요 .... 
				var headerObj = {};
				var headerKeys = {};
				headerObj['항목명'] = "";
				headerKeys['항목명'] = "항목명";
				for(var i=0 ; i<audHeader.length; i++){
					headerObj[audHeader[i].codeNm] = '금액';
					headerKeys['금액'+(i+1)] = audHeader[i].codeNm;
					if(i!=1){
						var diffkey = " ".rpad(i, " ");		//같아보이지만 다른 공백이다
						headerObj[diffkey] = '차이';
						headerKeys['차이'+(i+1)] = diffkey;
					}
					var notekey = " ".rpad(i, " ");			//같아보이지만 다른 공백이다
					headerObj[notekey] = '비고';
					headerKeys['비고'+(i+1)] = notekey;
				}
				excelObjList.push(headerObj);
				
				$.each(_data, function(key, value){
					var excleObj = {};
                    $.grep(_fields, function( field ){
                    	
                    	for(var key in value){
                    		if(field.title && field.visible != false){    								
								var fTitle = field.title;
								
								//체크박스 컬럼인 경우 제외
								if($.fn._isExportFieldColumn(field, checkVisible)){
									if( field.name === key ){
										var kvalue = String(value[key]);
										
										if(applyItemTemplate && field.itemTemplate) {
											kvalue = field.itemTemplate(value[key], value);
										}
										field.title = field.title.replace("<br>", "");
										excleObj[headerKeys[field.title]] = value[key];
									}
								}
							}
    					}                    	
                    });
                    excelObjList.push(excleObj);
				});
				return excelObjList
			},
			getWorksheet : function(){
				return XLSX.utils.json_to_sheet(this.getExcelData());
			}
	}
	
	var wb = XLSX.utils.book_new();
	var newWorksheet = excelHandler.getWorksheet();
	newWorksheet.sheet_add_aoa
	
	XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());
	var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
	saveAs(new Blob([$.fn._s2ab(wbout)], {type:"application/octet-stream"}), excelHandler.getExcelFileName());
};