/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-보험금진전추이
 * @설명: 보험금진전추이 화면
 * @최초작성자: 황석현
 * @최초작성일: 2021.10.29
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.10.29 최초작성
 */

let today = new Date();
var d = new Date(today.getFullYear(), today.getMonth(), "1");
d.setMonth(today.getMonth());

let year  = d.getFullYear();
let month = ("0" + (d.getMonth() + 1)).slice(-2);
const toYm = year + "-" + month;

var perBtnId = ["btn_save"];
var initObject = null;					//수정전 원데이터

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
	
	//공통코드(통합수준코드) 콤보박스
	initCommCd();
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	$("#inp_finYm").select();
});

function initCommCd() {
	//공통코드 조회(보험금진전추이코드)
	$.fn.loadCommonCode(["CLDV_CD"]);
}

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.10.29
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.10.29 최초작성
 */
function initEvent() {
	//조회
	$("#btn_search").on("click", function(e){
		if(saveValChk()) {
			$.fn.msgBox("수정 중인 내용이 저장되지 않았습니다.<br>진행하시겠습니까?", function(obj) {
				if(obj.btn_ok) {
					selectInsmDvlmtPsgList();
				}
			}, 2);
		} else {
			selectInsmDvlmtPsgList();
		}
	});

	//조회 마감년월 현재월 셋팅
	$("#inp_finYm").val(toYm);
	let calObj = $("#inp_finYm");
	calObj.val(toYm);
	calObj.on("click", function(e){
		$(this).data.prvdate = $(this).val();
		$(this).select();
	}).on("dblclick", function(e){
		$(this).select();	
	}).on("focusout", function(e){
		if($(this).val() == "") $(this).val($(this).data.prvdate);
	}).on("keyup", function(e){
		let inDt = $(this).val();
		if(inDt.length == 5 && inDt.substring(4,5) != "-"){
			$(this).val(inDt.substring(0,4) + "-" + inDt.substring(4));
		}
	}).on("keypress", function(e){
		if(e.keyCode == 13){
			$("#btn_search").click();
			return false;
		}
	});
	
	//엑셀다운로드(타이틀_일자YYYYMMDD.xlsx)
	$("#btn_xlsdown").on("click", function(e){
		let fileName = "보험금진전추이_" 
			         + $.replaceAll(toYm, '-','') 
		             + (((new Date()).getDate() < 10) ? "0" : "") + ((new Date()).getDate()) 
		             + ".xlsx";
		$.fn.exportGridExcel({
			id       : 'gridDiv', 
			fileName : fileName
		});
	});
	
	//저장버튼
	$("#btn_save").on("click", function(e){
		saveGridDataAll();
	});
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 황석현
 * @최초작성일: 2021.10.29
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.10.29 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 630,
		editing: true,
		sorting: true,
		paging: true,
		confirmDeleting: false,
		headerRowRenderer: function() {
			var $result = $("<tr>").height(0)
				.append($("<th>").width(350))
				.append($("<th>").width(150))
				.append($("<th>").width(150))
				.append($("<th>").width(150))
				.append($("<th>").width(150))
				.append($("<th>").width(150))
				.append($("<th>").width(150))
				;

			// header 1row
			$result = $result.add($("<tr class='jsgrid-header-row'>")
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("구분"))	
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 5).text("사고년도"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("합계"))
				); 
			
			// header 2row
			var $result1 = $("<tr class='jsgrid-header-row'>")
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("마감년도-4"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("마감년도-3"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("마감년도-2"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("마감년도-1"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("마감년도"))
					;
			
			$result = $result.add($result1);

			return $result;
		},
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				var status = 'u';	//수정
				if(item.status == 'c' || item.status == 'e') {	//신규, 엑셀로드는  c, e상태 유지 후 데이터 수정
				} else if(item.status == 'dd'){	//삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				return item;
			}		
		},
		onItemEditing: function(args) {	//Grid Edit모드 진입시 처리
			if(typeof event === "undefined") {
				args.cancel = true;
				return;
			}
			
		},
		fields : [
			{ name: "cldvCd", title:"구분", css:"cell", type: "text", width: 350, editing: false, align:"left", visible:false},
			{ name: "cldvNm", title:"구분", css:"cell", type: "text", width: 350, editing: false, align:"left", visible:true},
			{ name: "finYr4" , title:"마감년도-4", css:"cell", type: "text", width: 150, editing: true, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) || value == 0 ? "" : $.addCommaNumber(value.toString()));
				},
				editTemplate:function(value,item) {
					
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					
					$result.on("click", function() {
						$(this).select();
					});
					
					var chkChar = item.cldvCd;
					if(chkChar == "01" || chkChar == "03" || chkChar == "04" || chkChar == "05" || chkChar == "06" || chkChar == "07" || chkChar == "08") {
						$result.attr("readonly", true);
					}
					
					$result.inputFilter(function(value) {
						if($.isNumber(value)) {
							return true;
						} else {
							return false;
						}
					})
					
					var grid = this._grid;
					
					$result.on("focusout", function() {
						var chkChar = item.cldvCd;
						if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03") {
							var tot = Number($.fn.isEmpty($(this).val()) ? 0 : $(this).val()) + Number($.fn.isEmpty(item.finYr3) ? 0 : item.finYr3) + Number($.fn.isEmpty(item.finYr2) ? 0 : item.finYr2) + Number($.fn.isEmpty(item.finYr1) ? 0 : item.finYr1) + Number($.fn.isEmpty(item.finYr) ? 0 : item.finYr);
							item.smtot = $.fn.isEmpty(tot) ? 0 : tot;
						}
						
						grid.data = calGridData(grid, "finYr4", $(this).val(), chkChar);

						$("#gridDiv").jsGrid("loadData", grid.data);
						return false;
					});
					
					$result.on("keydown", function(e){
						if(e.which === 13){
							var chkChar = item.cldvCd;
							if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03") {
								var tot = Number($.fn.isEmpty($(this).val()) ? 0 : $(this).val()) + Number($.fn.isEmpty(item.finYr3) ? 0 : item.finYr3) + Number($.fn.isEmpty(item.finYr2) ? 0 : item.finYr2) + Number($.fn.isEmpty(item.finYr1) ? 0 : item.finYr1) + Number($.fn.isEmpty(item.finYr) ? 0 : item.finYr);
								item.smtot = $.fn.isEmpty(tot) ? 0 : tot;
							}
							
							grid.data = calGridData(grid, "finYr4", $(this).val(), chkChar);

							$("#gridDiv").jsGrid("loadData", grid.data);
							return false;
						}
					});
					
					return $result;
				}
			},
			{ name: "finYr3" , title:"마감년도-3", css:"cell", type: "text", width: 150, editing: true, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) || value == 0 ? "" : $.addCommaNumber(value.toString()));
				},
				editTemplate:function(value,item) {
					
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("click", function() {
						$(this).select();
					});
					
					var chkChar = item.cldvCd;
					if(chkChar == "01" || chkChar == "15" || chkChar == "03" || chkChar == "04" || chkChar == "05" || chkChar == "06" || chkChar == "07" || chkChar == "08") {
						$result.attr("readonly", true);
					}
					
					$result.inputFilter(function(value) {
						
						if($.isNumber(value)) {
							return true;
						} else {
							return false;
						}
					})
					
					var grid = this._grid;
					
					$result.on("focusout", function() {
						var chkChar = item.cldvCd;
						if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "02" || chkChar == "03") {
							var tot = Number($.fn.isEmpty(item.finYr4) ? 0 : item.finYr4) + Number($.fn.isEmpty($(this).val()) ? 0 : $(this).val()) + Number($.fn.isEmpty(item.finYr2) ? 0 : item.finYr2) + Number($.fn.isEmpty(item.finYr1) ? 0 : item.finYr1) + Number($.fn.isEmpty(item.finYr) ? 0 : item.finYr);
							item.smtot = tot;
						}
						
						grid.data = calGridData(grid, "finYr3", $(this).val(), chkChar);
						
						$("#gridDiv").jsGrid("loadData", grid.data);
						return false;
					});
					
					$result.on("keydown", function(e){
						if(e.which === 13){
							var chkChar = item.cldvCd;
							if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03") {
								var tot = Number($.fn.isEmpty(item.finYr4) ? 0 : item.finYr4) + Number($.fn.isEmpty($(this).val()) ? 0 : $(this).val()) + Number($.fn.isEmpty(item.finYr2) ? 0 : item.finYr2) + Number($.fn.isEmpty(item.finYr1) ? 0 : item.finYr1) + Number($.fn.isEmpty(item.finYr) ? 0 : item.finYr);
								item.smtot = $.fn.isEmpty(tot) ? 0 : tot;
							}
							
							grid.data = calGridData(grid, "finYr3", $(this).val(), chkChar);

							$("#gridDiv").jsGrid("loadData", grid.data);
							return false;
						}
					});
					
					return $result;
				}
			},
			{ name: "finYr2" , title:"마감년도-2", css:"cell", type: "text", width: 150, editing: true, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) || value == 0 ? "" : $.addCommaNumber(value.toString()));
				},
				editTemplate:function(value,item) {
					
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("click", function() {
						$(this).select();
					});
					
					var chkChar = item.cldvCd;
					if(chkChar == "01" || chkChar == "14" || chkChar == "15" || chkChar == "03" || chkChar == "04" || chkChar == "05" || chkChar == "06" || chkChar == "07" || chkChar == "08") {
						$result.attr("readonly", true);
					}

					$result.inputFilter(function(value) {
						
						if($.isNumber(value)) {
							return true;
						} else {
							return false;
						}
					})
					
					var grid = this._grid;
					
					$result.on("focusout", function() {
						var chkChar = item.cldvCd;
						if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03") {
							var tot = Number($.fn.isEmpty(item.finYr4) ? 0 : item.finYr4) + Number($.fn.isEmpty(item.finYr3) ? 0 : item.finYr3) + Number($.fn.isEmpty($(this).val()) ? 0 : $(this).val()) + Number($.fn.isEmpty(item.finYr1) ? 0 : item.finYr1) + Number($.fn.isEmpty(item.finYr) ? 0 : item.finYr);
							item.smtot = $.fn.isEmpty(tot) ? 0 : tot;
						}
						
						grid.data = calGridData(grid, "finYr2", $(this).val(), chkChar);
						
						$("#gridDiv").jsGrid("loadData", grid.data);
						return false;
					});
					
					$result.on("keydown", function(e){
						if(e.which === 13){
							var chkChar = item.cldvCd;
							if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03") {
								var tot = Number($.fn.isEmpty(item.finYr4) ? 0 : item.finYr4) + Number($.fn.isEmpty(item.finYr3) ? 0 : item.finYr3) + Number($.fn.isEmpty($(this).val()) ? 0 : $(this).val()) + Number($.fn.isEmpty(item.finYr1) ? 0 : item.finYr1) + Number($.fn.isEmpty(item.finYr) ? 0 : item.finYr);
								item.smtot = $.fn.isEmpty(tot) ? 0 : tot;
							}
							
							grid.data = calGridData(grid, "finYr2", $(this).val(), chkChar);

							$("#gridDiv").jsGrid("loadData", grid.data);
							return false;
						}
					});
					
					return $result;
				}
			},
			{ name: "finYr1" , title:"마감년도-1", css:"cell", type: "text", width: 150, editing: true, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) || value == 0 ? "" : $.addCommaNumber(value.toString()));
				},
				editTemplate:function(value,item) {
					
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("click", function() {
						$(this).select();
					});
					
					var chkChar = item.cldvCd;
					if(chkChar == "01" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "03" || chkChar == "04" || chkChar == "05" || chkChar == "06" || chkChar == "07" || chkChar == "08") {
						$result.attr("readonly", true);
					}
					
					$result.inputFilter(function(value) {
						
						if($.isNumber(value)) {
							return true;
						} else {
							return false;
						}
					})
					
					var grid = this._grid;
					
					$result.on("focusout", function() {
						var chkChar = item.cldvCd;
						if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03") {
							var tot = Number($.fn.isEmpty(item.finYr4) ? 0 : item.finYr4) + Number($.fn.isEmpty(item.finYr3) ? 0 : item.finYr3) + Number($.fn.isEmpty(item.finYr2) ? 0 : item.finYr2) + Number($.fn.isEmpty($(this).val()) ? 0 : $(this).val()) + Number($.fn.isEmpty(item.finYr) ? 0 : item.finYr);
							item.smtot = $.fn.isEmpty(tot) ? 0 : tot;
						}
						
						grid.data = calGridData(grid, "finYr1", $(this).val(), chkChar);
						
						$("#gridDiv").jsGrid("loadData", grid.data);
						return false;
					});
					
					$result.on("keydown", function(e){
						if(e.which === 13){
							var chkChar = item.cldvCd;
							if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03") {
								var tot = Number($.fn.isEmpty(item.finYr4) ? 0 : item.finYr4) + Number($.fn.isEmpty(item.finYr3) ? 0 : item.finYr3) + Number($.fn.isEmpty(item.finYr2) ? 0 : item.finYr2) + Number($.fn.isEmpty($(this).val()) ? 0 : $(this).val()) + Number($.fn.isEmpty(item.finYr) ? 0 : item.finYr);
								item.smtot = $.fn.isEmpty(tot) ? 0 : tot;
							}
							
							grid.data = calGridData(grid, "finYr1", $(this).val(), chkChar);

							$("#gridDiv").jsGrid("loadData", grid.data);
							return false;
						}
					});
					
					return $result;
				}
			},
			{ name: "finYr" , title:"마감년도", css:"cell", type: "text", width: 150, editing: true, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) || value == 0 ? "" : $.addCommaNumber(value.toString()));
				},
				editTemplate:function(value,item) {
					
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("click", function() {
						$(this).select();
					});
					
					var chkChar = item.cldvCd;
					if(chkChar == "01" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "03" || chkChar == "04" || chkChar == "05" || chkChar == "06" || chkChar == "07" || chkChar == "08") {
						$result.attr("readonly", true);
					}
					
					$result.inputFilter(function(value) {
						
						if($.isNumber(value)) {
							return true;
						} else {
							return false;
						}
					})
					
					var grid = this._grid;
					
					$result.on("focusout", function() {
						var chkChar = item.cldvCd;
						if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03") {
							var tot = Number($.fn.isEmpty(item.finYr4) ? 0 : item.finYr4) + Number($.fn.isEmpty(item.finYr3) ? 0 : item.finYr3) + Number($.fn.isEmpty(item.finYr2) ? 0 : item.finYr2) + Number($.fn.isEmpty(item.finYr1) ? 0 : item.finYr1) + Number($.fn.isEmpty($(this).val()) ? 0 : $(this).val());
							item.smtot = $.fn.isEmpty(tot) ? 0 : tot;
						}
						
						grid.data = calGridData(grid, "finYr", $(this).val(), chkChar);
						
						$("#gridDiv").jsGrid("loadData", grid.data);
						return false;
					});
					
					$result.on("keydown", function(e){
						if(e.which === 13){
							var chkChar = item.cldvCd;
							if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03") {
								var tot = Number($.fn.isEmpty(item.finYr4) ? 0 : item.finYr4) + Number($.fn.isEmpty(item.finYr3) ? 0 : item.finYr3) + Number($.fn.isEmpty(item.finYr2) ? 0 : item.finYr2) + Number($.fn.isEmpty(item.finYr1) ? 0 : item.finYr1) + Number($.fn.isEmpty($(this).val()) ? 0 : $(this).val());
								item.smtot = $.fn.isEmpty(tot) ? 0 : tot;
							}
							
							grid.data = calGridData(grid, "finYr", $(this).val(), chkChar);

							$("#gridDiv").jsGrid("loadData", grid.data);
							return false;
						}
					});
					
					return $result;
				}
			},
			{ name: "smtot" , title:"합계", css:"cell", type: "text", width: 150, editing: true, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) || value == 0 ? "" : $.addCommaNumber(value.toString()));
				},
				editTemplate:function(value,item) {
					
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("click", function() {
						$(this).select();
					});
					
					var chkChar = item.cldvCd;
					if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03" || chkChar == "07" || chkChar == "08") {
						$result.attr("readonly", true);
					}
					
					$result.inputFilter(function(value) {
						
						if($.isNumber(value)) {
							return true;
						} else {
							return false;
						}
					})
					
					var grid = this._grid;
					
					$result.on("focusout", function() {
						var chkChar = item.cldvCd;
						if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03") {
							var tot = Number($.fn.isEmpty(item.finYr4) ? 0 : item.finYr4) + Number($.fn.isEmpty(item.finYr3) ? 0 : item.finYr3) + Number($.fn.isEmpty(item.finYr2) ? 0 : item.finYr2) + Number($.fn.isEmpty(item.finYr1) ? 0 : item.finYr1) + Number($.fn.isEmpty(item.finYr) ? 0 : item.finYr);
							item.smtot = $.fn.isEmpty(tot) ? 0 : tot;
						}
						
						grid.data = calGridData(grid, "smtot", $(this).val(), chkChar);
						
						$("#gridDiv").jsGrid("loadData", grid.data);
						return false;
					});
					
					$result.on("keydown", function(e){
						if(e.which === 13){
							var chkChar = item.cldvCd;
							if(chkChar == "01" || chkChar == "11" || chkChar == "12" || chkChar == "13" || chkChar == "14" || chkChar == "15" || chkChar == "02" || chkChar == "03") {
								var tot = Number($.fn.isEmpty(item.finYr4) ? 0 : item.finYr4) + Number($.fn.isEmpty(item.finYr3) ? 0 : item.finYr3) + Number($.fn.isEmpty(item.finYr2) ? 0 : item.finYr2) + Number($.fn.isEmpty(item.finYr1) ? 0 : item.finYr1) + Number($.fn.isEmpty(item.finYr) ? 0 : item.finYr);
								item.smtot = $.fn.isEmpty(tot) ? 0 : tot;
							}
							
							grid.data = calGridData(grid, "smtot", $(this).val(), chkChar);

							$("#gridDiv").jsGrid("loadData", grid.data);
							return false;
						}
					});
					
					return $result;
				}
			}
		]
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * @설명: 그리드 자동 계산
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.10
 * @최종변경일: 
 * @매개변수: grid, clumCd, val, chkChar
 *         grid.data, grid.column, value, 구분명
 * @반환값: grid.data
 * @개정이력: 
 *  황석현 2021.11.10 최초작성
 */
function calGridData(grid, clumCd, val, chkChar) {

	for(var i=0; i<grid.data.length; i++) {
		if(grid.data[i].cldvCd == chkChar){
			grid.data[i][clumCd] = val;
		}
	}
	
	//1.할인되지 않은 보험금에 대한 추정치
	var totSum = 0;
	for(var i = 1; i < 6; i++) {
		totSum += Number(grid.data[i][clumCd]);
	}
	grid.data[0][clumCd] = totSum;
	grid.data[0]["smtot"] = Number(grid.data[0]["finYr4"]) + Number(grid.data[0]["finYr3"]) + Number(grid.data[0]["finYr2"]) + Number(grid.data[0]["finYr1"]) + Number(grid.data[0]["finYr"]);
		
	//3.보험금추정치와지급액차이
	grid.data[7][clumCd] = grid.data[0][clumCd] - grid.data[6][clumCd];
	
	//3.보험금추정치와지급액차이 합계
	grid.data[7]["smtot"] = Number(grid.data[7]["finYr4"]) + Number(grid.data[7]["finYr3"]) + Number(grid.data[7]["finYr2"]) + Number(grid.data[7]["finYr1"]) + Number(grid.data[7]["finYr"]);
	
	return grid.data;
	
}

/**
 * @설명: 보험금진전추이 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.10.29
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.10.29 최초작성
 */
function selectInsmDvlmtPsgList() {
	if($.fn.isEmpty($("#inp_finYm").val())) {
		$.fn.msgBox("조회 마감년월을 입력하세요.");
		return false;
	}
	
	//조회값 셋팅
	let reqParam = {
			finYm       : $.replaceAll($("#inp_finYm").val(), '-','')
	};

	// 데이터 조회
	$.callAjax(reqParam, "/fi/dc/fidc412m/selectInsmDvlmtPsgList.do")
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		} else {
			initObject = [];
			var finYm = $.replaceAll($("#inp_finYm").val(), '-','');
			var finYy = $("#inp_finYm").val().substring(0, 4);
		
			for(var i=0; i<listData.length; i++) {
				
				let reqParam = {};
				
				if(i == 0 || i == 7 ) continue;
				
				//1.할인되지 않은 보험금에 대한 추정치(1행 ~ 5행)
				if(i == 1) {
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 4),
						cldvAsptnYr			: String(finYy - 4),
						krwAmt				: Number(listData[i]["finYr4"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 3),
						cldvAsptnYr			: String(finYy - 3),
						krwAmt				: Number(listData[i]["finYr3"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 2),
						cldvAsptnYr			: String(finYy - 2),
						krwAmt				: Number(listData[i]["finYr2"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 1),
						cldvAsptnYr			: String(finYy - 1),
						krwAmt				: Number(listData[i]["finYr1"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: finYy,
						cldvAsptnYr			: finYy,
						krwAmt				: Number(listData[i]["finYr"])
					};
					initObject.push(reqParam);
					
				} else if(i == 2) {
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 4),
						cldvAsptnYr			: String(finYy - 3),
						krwAmt				: Number(listData[i]["finYr4"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 3),
						cldvAsptnYr			: String(finYy - 2),
						krwAmt				: Number(listData[i]["finYr3"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 2),
						cldvAsptnYr			: String(finYy - 1),
						krwAmt				: Number(listData[i]["finYr2"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 1),
						cldvAsptnYr			: finYy,
						krwAmt				: Number(listData[i]["finYr1"])
					};
					initObject.push(reqParam);
					
				} else if(i == 3) {
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 4),
						cldvAsptnYr			: String(finYy - 2),
						krwAmt				: Number(listData[i]["finYr4"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 3),
						cldvAsptnYr			: String(finYy - 1),
						krwAmt				: Number(listData[i]["finYr3"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 2),
						cldvAsptnYr			: finYy,
						krwAmt				: Number(listData[i]["finYr2"])
					};
					initObject.push(reqParam);
					
				} else if(i == 4) {
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 4),
						cldvAsptnYr			: String(finYy - 1),
						krwAmt				: Number(listData[i]["finYr4"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 3),
						cldvAsptnYr			: finYy,
						krwAmt				: Number(listData[i]["finYr3"])
					};
					initObject.push(reqParam);
					
				} else if(i == 5) {
					reqParam = {
						finYm				: finYm,
						cldvCd				: "01",
						cldvAcdtYr			: String(finYy - 4),
						cldvAsptnYr			: finYy,
						krwAmt				: Number(listData[i]["finYr4"])
					};
					initObject.push(reqParam);
					
				//2.누적 보험금지급액(7행)
				} else if(i == 6) {
					reqParam = {
						finYm				: finYm,
						cldvCd				: "02",
						cldvAcdtYr			: String(finYy - 4),
						cldvAsptnYr			: "0000",
						krwAmt				: Number(listData[i]["finYr4"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "02",
						cldvAcdtYr			: String(finYy - 3),
						cldvAsptnYr			: "0000",
						krwAmt				: Number(listData[i]["finYr3"])
					};
					initObject.push(reqParam);
					
					reqParam = {
						finYm				: finYm,
						cldvCd				: "02",
						cldvAcdtYr			: String(finYy - 2),
						cldvAsptnYr			: "0000",
						krwAmt				: Number(listData[i]["finYr2"])
					};
					initObject.push(reqParam);
						
					reqParam = {
						finYm				: finYm,
						cldvCd				: "02",
						cldvAcdtYr			: String(finYy - 1),
						cldvAsptnYr			: "0000",
						krwAmt				: Number(listData[i]["finYr1"])
					};
					initObject.push(reqParam);

					reqParam = {
						finYm				: finYm,
						cldvCd				: "02",
						cldvAcdtYr			: finYy,
						cldvAsptnYr			: "0000",
						krwAmt				: Number(listData[i]["finYr"])
					};
					initObject.push(reqParam);
				
				//4.사고년도 이전에 발생한 보험금에 대한 추정치(9행)
				} else if(i == 8) {
					reqParam = {
						finYm				: finYm,
						cldvCd				: "04",
						cldvAcdtYr			: "0000",
						cldvAsptnYr			: "0000",
						krwAmt				: Number(listData[i]["smtot"])
					};
					initObject.push(reqParam);
					
				//5.할인효과(10행)
				} else if(i == 9) {
					reqParam = {
						finYm				: finYm,
						cldvCd				: "05",
						cldvAcdtYr			: "0000",
						cldvAsptnYr			: "0000",
						krwAmt				: Number(listData[i]["smtot"])
					};
					initObject.push(reqParam);
					
				//6.발생 후 1년 이내에 지급될 것으로 예상하는 발생사고부채(11행)
				} else if(i == 10) {
					reqParam = {
						finYm				: finYm,
						cldvCd				: "06",
						cldvAcdtYr			: "0000",
						cldvAsptnYr			: "0000",
						krwAmt				: Number(listData[i]["smtot"])
					};
					initObject.push(reqParam);
				
				//7.비금융위험에 대한 위첨조치(12행)
				} else if(i == 11) {
					reqParam = {
						finYm				: finYm,
						cldvCd				: "07",
						cldvAcdtYr			: "0000",
						cldvAsptnYr			: "0000",
						krwAmt				: Number(listData[i]["smtot"])
					};
					initObject.push(reqParam);
					
				//8.마감년도말 발생사고부채(13행)
				} else if(i == 12) {
					reqParam = {
						finYm				: finYm,
						cldvCd				: "08",
						cldvAcdtYr			: "0000",
						cldvAsptnYr			: "0000",
						krwAmt				: Number(listData[i]["smtot"])
					};
					initObject.push(reqParam);
				}
			}			
			
		}
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectInsmDvlmtPsgList !!");
	});
}

/**
 * @설명: 그리드 데이터 조회/저장 전 데이터수정여부 체크
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.02 최초작성
 */
function saveValChk() {
	let rtnValChk = false;
	let chgValChk = "N";
	
	if(!$.fn.isEmpty(initObject)){
		var copyIinitObject = initObject;
		for(var i = 0; i < copyIinitObject.length; i++) {
			delete copyIinitObject[i].finYm;
			delete copyIinitObject[i].cldvAcdtYr;
			delete copyIinitObject[i].cldvAsptnYr;
		}
		
		var gridData = $("#gridDiv").jsGrid("option", "data");
		var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
		if($("." + editRowClass).length > 0) {
			$("#gridDiv").jsGrid("updateItem");
		}

		var saveList = [];
		var finYm = $.replaceAll($("#inp_finYm").val(), '-','');
		var finYy = $("#inp_finYm").val().substring(0, 4);
		
		if(!$.fn.isEmpty(gridData)) {
			//마감년월, 보험금진전구분, 사고년도, 추정년도, 금액
			//조회값 셋팅
			for(var i=0; i<gridData.length; i++) {
				
				let reqParam = {};
				
				if(i == 0 || i == 7 ) continue;
				
				//1.할인되지 않은 보험금에 대한 추정치(1행 ~ 5행)
				if(i == 1) {
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr4"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr3"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr2"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr1"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr"])
					};
					saveList.push(reqParam);
					
				} else if(i == 2) {
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr4"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr3"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr2"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr1"])
					};
					saveList.push(reqParam);
					
				} else if(i == 3) {
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr4"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr3"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr2"])
					};
					saveList.push(reqParam);
					
				} else if(i == 4) {
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr4"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr3"])
					};
					saveList.push(reqParam);
					
				} else if(i == 5) {
					reqParam = {
						cldvCd				: "01",
						krwAmt				: Number(gridData[i]["finYr4"])
					};
					saveList.push(reqParam);
					
				//2.누적 보험금지급액(7행)
				} else if(i == 6) {
					reqParam = {
						cldvCd				: "02",
						krwAmt				: Number(gridData[i]["finYr4"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "02",
						krwAmt				: Number(gridData[i]["finYr3"])
					};
					saveList.push(reqParam);
					
					reqParam = {
						cldvCd				: "02",
						krwAmt				: Number(gridData[i]["finYr2"])
					};
					saveList.push(reqParam);
						
					reqParam = {
						cldvCd				: "02",
						krwAmt				: Number(gridData[i]["finYr1"])
					};
					saveList.push(reqParam);

					reqParam = {
						cldvCd				: "02",
						krwAmt				: Number(gridData[i]["finYr"])
					};
					saveList.push(reqParam);
				
				//4.사고년도 이전에 발생한 보험금에 대한 추정치(9행)
				} else if(i == 8) {
					reqParam = {
						cldvCd				: "04",
						krwAmt				: Number(gridData[i]["smtot"])
					};
					saveList.push(reqParam);
					
				//5.할인효과(10행)
				} else if(i == 9) {
					reqParam = {
						cldvCd				: "05",
						krwAmt				: Number(gridData[i]["smtot"])
					};
					saveList.push(reqParam);
					
				//6.발생 후 1년 이내에 지급될 것으로 예상하는 발생사고부채(11행)
				} else if(i == 10) {
					reqParam = {
						cldvCd				: "06",
						krwAmt				: Number(gridData[i]["smtot"])
					};
					saveList.push(reqParam);
				
				//7.비금융위험에 대한 위첨조치(12행)
				} else if(i == 11) {
					reqParam = {
						cldvCd				: "07",
						krwAmt				: Number(gridData[i]["smtot"])
					};
					saveList.push(reqParam);
					
				//8.마감년도말 발생사고부채(13행)
				} else if(i == 12) {
					reqParam = {
						cldvCd				: "08",
						krwAmt				: Number(gridData[i]["smtot"])
					};
					saveList.push(reqParam);
				}
			}
		}
		
		chgValChk = (JSON.stringify(copyIinitObject) === JSON.stringify(saveList)) ? "N" : "Y";
		if(chgValChk == "Y") rtnValChk = true;
	}
	
	return rtnValChk;
}

/**
 * @설명: 그리드 데이터 저장
 * @최초작성자: 황석현
 * @최초작성일: 2021.11.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.11.02 최초작성
 */
function saveGridDataAll() {
		
	var gridData = $("#gridDiv").jsGrid("option", "data");
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}

	var saveList = [];
	var finYm = $.replaceAll($("#inp_finYm").val(), '-','');
	var finYy = $("#inp_finYm").val().substring(0, 4);
	
	if(!$.fn.isEmpty(gridData)) {
		//마감년월, 보험금진전구분, 사고년도, 추정년도, 금액
		//조회값 셋팅
		for(var i=0; i<gridData.length; i++) {
			
			let reqParam = {};
			
			if(i == 0 || i == 7 ) continue;
			
			//1.할인되지 않은 보험금에 대한 추정치(1행 ~ 5행)
			if(i == 1) {
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 4),
					cldvAsptnYr			: String(finYy - 4),
					krwAmt				: Number(gridData[i]["finYr4"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 3),
					cldvAsptnYr			: String(finYy - 3),
					krwAmt				: Number(gridData[i]["finYr3"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 2),
					cldvAsptnYr			: String(finYy - 2),
					krwAmt				: Number(gridData[i]["finYr2"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 1),
					cldvAsptnYr			: String(finYy - 1),
					krwAmt				: Number(gridData[i]["finYr1"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: finYy,
					cldvAsptnYr			: finYy,
					krwAmt				: Number(gridData[i]["finYr"])
				};
				saveList.push(reqParam);
				
			} else if(i == 2) {
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 4),
					cldvAsptnYr			: String(finYy - 3),
					krwAmt				: Number(gridData[i]["finYr4"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 3),
					cldvAsptnYr			: String(finYy - 2),
					krwAmt					: Number(gridData[i]["finYr3"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 2),
					cldvAsptnYr			: String(finYy - 1),
					krwAmt				: Number(gridData[i]["finYr2"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 1),
					cldvAsptnYr			: finYy,
					krwAmt				: Number(gridData[i]["finYr1"])
				};
				saveList.push(reqParam);
				
			} else if(i == 3) {
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 4),
					cldvAsptnYr			: String(finYy - 2),
					krwAmt				: Number(gridData[i]["finYr4"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 3),
					cldvAsptnYr			: String(finYy - 1),
					krwAmt				: Number(gridData[i]["finYr3"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 2),
					cldvAsptnYr			: finYy,
					krwAmt				: Number(gridData[i]["finYr2"])
				};
				saveList.push(reqParam);
				
			} else if(i == 4) {
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 4),
					cldvAsptnYr			: String(finYy - 1),
					krwAmt				: Number(gridData[i]["finYr4"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 3),
					cldvAsptnYr			: finYy,
					krwAmt				: Number(gridData[i]["finYr3"])
				};
				saveList.push(reqParam);
				
			} else if(i == 5) {
				reqParam = {
					finYm				: finYm,
					cldvCd				: "01",
					cldvAcdtYr			: String(finYy - 4),
					cldvAsptnYr			: finYy,
					krwAmt				: Number(gridData[i]["finYr4"])
				};
				saveList.push(reqParam);
				
			//2.누적 보험금지급액(7행)
			} else if(i == 6) {
				reqParam = {
					finYm				: finYm,
					cldvCd				: "02",
					cldvAcdtYr			: String(finYy - 4),
					cldvAsptnYr			: "0000",
					krwAmt				: Number(gridData[i]["finYr4"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "02",
					cldvAcdtYr			: String(finYy - 3),
					cldvAsptnYr			: "0000",
					krwAmt				: Number(gridData[i]["finYr3"])
				};
				saveList.push(reqParam);
				
				reqParam = {
					finYm				: finYm,
					cldvCd				: "02",
					cldvAcdtYr			: String(finYy - 2),
					cldvAsptnYr			: "0000",
					krwAmt				: Number(gridData[i]["finYr2"])
				};
				saveList.push(reqParam);
					
				reqParam = {
					finYm				: finYm,
					cldvCd				: "02",
					cldvAcdtYr			: String(finYy - 1),
					cldvAsptnYr			: "0000",
					krwAmt				: Number(gridData[i]["finYr1"])
				};
				saveList.push(reqParam);

				reqParam = {
					finYm				: finYm,
					cldvCd				: "02",
					cldvAcdtYr			: finYy,
					cldvAsptnYr			: "0000",
					krwAmt				: Number(gridData[i]["finYr"])
				};
				saveList.push(reqParam);
			
			//4.사고년도 이전에 발생한 보험금에 대한 추정치(9행)
			} else if(i == 8) {
				reqParam = {
					finYm				: finYm,
					cldvCd				: "04",
					cldvAcdtYr			: "0000",
					cldvAsptnYr			: "0000",
					krwAmt				: Number(gridData[i]["smtot"])
				};
				saveList.push(reqParam);
				
			//5.할인효과(10행)
			} else if(i == 9) {
				reqParam = {
					finYm				: finYm,
					cldvCd				: "05",
					cldvAcdtYr			: "0000",
					cldvAsptnYr			: "0000",
					krwAmt				: Number(gridData[i]["smtot"])
				};
				saveList.push(reqParam);
				
			//6.발생 후 1년 이내에 지급될 것으로 예상하는 발생사고부채(11행)
			} else if(i == 10) {
				reqParam = {
					finYm				: finYm,
					cldvCd				: "06",
					cldvAcdtYr			: "0000",
					cldvAsptnYr			: "0000",
					krwAmt				: Number(gridData[i]["smtot"])
				};
				saveList.push(reqParam);
			
			//7.비금융위험에 대한 위첨조치(12행)
			} else if(i == 11) {
				reqParam = {
					finYm				: finYm,
					cldvCd				: "07",
					cldvAcdtYr			: "0000",
					cldvAsptnYr			: "0000",
					krwAmt				: Number(gridData[i]["smtot"])
				};
				saveList.push(reqParam);
				
			//8.마감년도말 발생사고부채(13행)
			} else if(i == 12) {
				reqParam = {
					finYm				: finYm,
					cldvCd				: "08",
					cldvAcdtYr			: "0000",
					cldvAsptnYr			: "0000",
					krwAmt				: Number(gridData[i]["smtot"])
				};
				saveList.push(reqParam);
			}
		}
		
		let chgValChk = "N";
		chgValChk = (JSON.stringify(initObject) === JSON.stringify(saveList)) ? "N" : "Y";
				
		if(saveList.length == 0) {
			$.fn.msgBox("저장할 대상이 없습니다.");
			return false;
		}
		
		if(chgValChk == "N") {
			$.fn.msgBox("변경입력된 데이터가 없습니다. 수정할 내역을 입력한 후 저장하십시오.");  //EIPU565
			return false;
		}
		
		$.fn.msgBox("저장하시겠습니까?", function(obj) {
			if(obj.btn_ok) {
				$.callAjax({'saveList':JSON.stringify(saveList)}, "/fi/dc/fidc412m/saveCldvInfo.do")
				.done(function(data) {
					if(data.result == "1") {
						$.fn.msgBox("정상처리되었습니다");
						
						//재조회
						selectInsmDvlmtPsgList();
						
					}
				}).fail(function(data){
					$.fn.msgBox("처리 실패");
				});
			}
		}, 2);
		
	} else {
		$.fn.msgBox("저장할 내용이 없습니다.");	//ECSU395
		return false;
	}
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.10.29
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.10.29 최초작성
 */
function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}