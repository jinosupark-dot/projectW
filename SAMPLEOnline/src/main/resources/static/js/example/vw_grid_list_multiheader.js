/*
	File Name      : vw_grid_list_multiheader.js
	Description    : 멀티헤더 그리드 예시.
	Author         : sbpyeon
	Date           : 2021.02.016
 */
$(document).ready(function(){
		//event 초기화
		initEvent();
		//그리드 초기화	
		initGrid_multiHeader();
		initGrid_multiHeader2();
		// 전체조회
		selectList();
});
	
function initEvent() {
	
	//CSV 다운로드 
	$("#btn_exportCSV").on("click", function(e){
		var paramObj = {};
		paramObj.id = "gridDiv_multiHeader";
		paramObj.showHeader = true;										//그리드헤더(컬럼제목) 출력 여부	
		paramObj.fileName = "샘플그리드.csv";                   			//다운로드할 파일명
		paramObj.applyItemTemplate = false;								//그리드 컬럼 디스플레이 포멧터 적용 출력 여부(해당엑셀로 Import하기 위해서는 false)
		paramObj.checkVisible = true;								    //visible false인 컬럼의 출력여부(false인경우 visible=false인 컬럼이 출력됨)
		paramObj.commentHeaderKey = "{key1='value1',key2='value2'}";	//CommentHeader 3행 조회조건(key,value를 JSON String으로 전달)
		paramObj.commentHeaderEtc = "부가적으로 입력할 사항";					//CommentHeader 4행 기타
		$.fn.exportGridCSV(paramObj);
	});

	//Grid Excel 다운로드
	$("#btn_exportExcel").on("click", function(e){
		$.fn.exportGridExcel({id:'gridDiv_multiHeader'});
	});
		
	// 조회 버튼
	$("#btn_search").on("click", function(e){
		selectList();
	});
	
	
	//CSV 로드 
	$("#btn_loadCSV").on("click", function(e){
		loadCSV();
	});
}
function initGrid_multiHeader(){
	
	//이미지 건목록 jsGrid 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv_multiHeader",
		height: 600,
		editing: false,
		sorting: true,
		paging: true,
		selectHiglight:true,
		deleteConfirm: "삭제하시겠습니까?",
		
		headerRowRenderer: function() {
			var $result = $("<tr>").height(0)
				.append($("<th>").width(100))
				.append($("<th>").width(20))
				.append($("<th>").width(50))
				.append($("<th>").width(100))
				.append($("<th>").width(100))
				.append($("<th>").width(250));
		
			$result = $result.add($("<tr class='jsgrid-header-row'>")
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("공지사항ID와 제목"))
				
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("내용"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("조회건수"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("입력일시"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("입력자코드"))
				); 
			
			$result = $result.add($("<tr class='jsgrid-header-row'>")
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("공지사항ID"))
			.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("제목")));


			return $result;
			
	/*
	 * Sorting해야 될 때 쓰는 방법: 
	 * */
//			var $tr = $("<tr class='jsgrid-header-row'>");
//			var grid = this;
//
//			grid._eachField(function(field, index){
//				 var $th = $("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>")
//				 .text(field.title).width(field.width).appendTo($tr);
//				 if(grid.sorting && field.sorting){
//					 $th.on("click", function(){
//						 grid.sort(index);
//					 });}
//				 }); 
//			 return $result.add($tr);   

				
	/* 
	 * HTML 그대로 삽입해서 쓰는 방법: 멀티헤더 적용시 수정해서 사용
	 */
				/*
				 * var html = [];
				html.push("<tr class='jsgrid-header-row'>");
				html.push("	<th colspan='4' class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 40px;'>그룹</th>");
				html.push("</tr>");
				html.push("<tr class='jsgrid-header-row'>");
				html.push("	<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 40px;'>헤더1</th>");
				html.push("	<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 40px;'>헤더2</th>");
				html.push("	<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 40px;'>헤더3</th>");
				html.push("	<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 40px;'>헤더4</th>");
				html.push("</tr>");
				return $(html.join(""));
				*/

		},
		
		//메뉴내용 필드를 채우기
		fields : [
			{ name: "ancmNtfId", title:"공지사항ID", css:"cell", type: "text", width: 100, align:"center"},
			{ name: "titl", title:"제목", css:"cell", type: "text", width: 20, align:"center"},
			{ name: "cont", title:"내용",css:"cell", type: "text", width: 50, align:"center",
				
				// Enter키 치면 update apply되는 template 예시
				editTemplate: function(value){
						var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
						$result.on("keydown", function(e){
							if(e.which === 13){
								$("#gridDiv_multiHeader").jsGrid("updateItem");
								return false;
							}
						});
						return $result;
					}},
			{ name: "iqcnt", title:"조회건수", css:"cell", type: "text", width: 100, align:"center"},
			{ name: "ipdtm", title:"입력일시", css:"cell", type: "text", width: 100, align:"center", 
				itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");
				}
			},
			{ name: "inppCd", title:"입력자코드", css:"cell", type: "text",  width: 250, align:"left"},
		]
	});
	
	//그리드 생성
	gridObject.gridCreate();
}


function initGrid_multiHeader2(){
	
	//이미지 건목록 jsGrid 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv_multiHeader2",
		height: 200,
		editing: false,
		sorting: true,
		paging: true,
		selectHiglight:true,
		deleteConfirm: "삭제하시겠습니까?",
		
		headerRowRenderer: function() {
			var $result = $("<tr>").height(0)
			.append($("<th>").width(100))
			.append($("<th>").width(20))
			.append($("<th>").width(50))
			.append($("<th>").width(100))
			.append($("<th>").width(100))
			.append($("<th>").width(250));
			
			$result = $result.add($("<tr class='jsgrid-header-row'>")
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("공지사항ID와 제목"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 4).text(""))
			); 
			
			/*
			 * Sorting해야 될 때 쓰는 방법: 
			 * */
			var $tr = $("<tr class='jsgrid-header-row'>");
			var grid = this;

			grid._eachField(function(field, index){
				 var $th = $("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>")
				 .text(field.title).width(field.width).appendTo($tr);
				 if(grid.sorting && field.sorting){
					 $th.on("click", function(){
						 grid.sort(index);
					 });}
				 }); 
			 return $result.add($tr);   
			
			
			/* 
			 * HTML 그대로 삽입해서 쓰는 방법: 멀티헤더 적용시 수정해서 사용
			 */
			/*
			 * var html = [];
				html.push("<tr class='jsgrid-header-row'>");
				html.push("	<th colspan='4' class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 40px;'>그룹</th>");
				html.push("</tr>");
				html.push("<tr class='jsgrid-header-row'>");
				html.push("	<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 40px;'>헤더1</th>");
				html.push("	<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 40px;'>헤더2</th>");
				html.push("	<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 40px;'>헤더3</th>");
				html.push("	<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable' style='width: 40px;'>헤더4</th>");
				html.push("</tr>");
				return $(html.join(""));
			 */
			
		},
		
		//메뉴내용 필드를 채우기
		fields : [
			{ name: "ancmNtfId", title:"공지사항ID", css:"cell", type: "text", width: 100, align:"center"},
			{ name: "titl", title:"제목", css:"cell", type: "text", width: 20, align:"center"},
			{ name: "cont", title:"내용",css:"cell", type: "text", width: 50, align:"center",
				
				// Enter키 치면 update apply되는 template 예시
				editTemplate: function(value){
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDiv_multiHeader").jsGrid("updateItem");
							return false;
						}
					});
					return $result;
				}},
				{ name: "iqcnt", title:"조회건수", css:"cell", type: "text", width: 100, align:"center"},
				{ name: "ipdtm", title:"입력일시", css:"cell", type: "text", width: 100, align:"center", 
					itemTemplate:function(value, item) {
						return $.fn.dateFormat(value, "-");
					}
				},
				{ name: "inppCd", title:"입력자코드", css:"cell", type: "text",  width: 250, align:"left"},
				]
	});
	
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
		$("#gridDiv_multiHeader").jsGrid("reset");		//그리드 데이터 초기화			
		var listData = data.dataList;  		//서버로 받아온 데이터 리스트
		//그리드 바인딩
		$("#gridDiv_multiHeader").jsGrid("loadData", listData).done(function(){  
		});
	}).fail(function(data){
	});		
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
	paramObj.id = "gridDiv_multiHeader";					//그리드 ID
	paramObj.callbackFn = function(data) {		//그리드 바인딩 후 후처리 함수
		if(data.result == "1") {
			$.fn.msgBox("정상적으로 로드하였습니다.");
		}
	};
	
	$.fn.loadGridCSV(paramObj);
	}