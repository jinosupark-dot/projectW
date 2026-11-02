/*
	File Name      : vw_grid_list_gridEdit.js
	Description    : 그리드 편집 관련 코드 예시
	Author         : sbpyeon
	Date           : 2021.02.016
 */
$(document).ready(function(){
		//event 초기화
		initEvent();
		//그리드 초기화	
		initGrid_gridEdit();
		// 전체조회
		selectList();
});
	
function initEvent() {
	// 조회 버튼
	$("#btn_search").on("click", function(e){
		selectList();
	});
	
	$("#intTextBox").on("blur", function(){
		isValid = $.isNumber(this.value);
		if(isValid){
			console.log("Valid!");
		}
		else{
			console.log("Not Valid!");
		}
	});
	
	// int 정수만 입력 가능한 필터
	$("#intTextBox").inputFilter(function(value){
		 return $.isNumber(value)
	 });
	
	// eng: 영어만 입력 가능한 필터
	 $("#engTextBox").inputFilter(function(value){		
		 return $.isEng(value)});

}

function initGrid_gridEdit(){
	
	//이미지 건목록 jsGrid 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv_gridEdit",
		height: 500,
		editing: true,
		sorting: true,
		paging: true,
		selectHiglight:true,
		deleteConfirm: "삭제하시겠습니까?",
		
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
		
		//메뉴내용 필드를 채우기
		fields : [
			{ name: "ancmNtfId", title:"공지사항ID", css:"cell", type: "text", width: 20, align:"center"},
			
			{ name: "sampleEng", title:"샘플Eng", css:"cell", type: "text", width: 50, align:"center",
				// validate: value(입력값) 확인: eng
				validate:{validator: "pattern",
					message: "필드값에 영어만 입력 가능합니다.",
					validator: function(value){	
		            	console.log("value : ", value);
		                return $.isEng(value);
		                }},
		                
	            // editTemplate:Enter 키 입력시 입력사항 반영됨
		        editTemplate:function(value,item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDiv_gridEdit").jsGrid("updateItem");
						}}); 
					return $result;}
			},
			
			{ name: "sampleNum", title:"샘플 Number", css:"cell", type: "text", width: 20, align:"center",
				
//				validate: value(입력값) 확인: number
				validate:{validator: "pattern",
					message: "필드값에 숫자만 입력 가능합니다.",
					validator: function(value){	
		            	console.log("value : ", value);
		                return $.isNumber(value);
		                }},

				// editTemplate:Enter 키 입력시 입력사항 반영됨
		        editTemplate:function(value,item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDiv_gridEdit").jsGrid("updateItem");
						}}); 
					return $result;}},
			
			{ name: "sampleDate", title:"샘플 Date", css:"cell", type: "text", width: 50, align:"center", 
				itemTemplate:function(value, item) {
					return $.fn.dateFormat(value, "-");
				},
			// validate: value(입력값) 확인: yyyymmdd
			validate:{validator: "pattern",
				message: "필드값이 yyyymmdd 패턴에 맞지 않습니다.",
				validator: function(value){	
	            	console.log("value : ", value);
	                return $.isValidDate(value);
	                }},
	                
            // editTemplate:Enter 키 입력시 입력사항 반영됨
	        editTemplate:function(value,item) {
				var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				
				$result.on("keydown", function(e){
					if(e.which === 13){
						$("#gridDiv_gridEdit").jsGrid("updateItem");
					}}); 
				return $result;}
			},
			{ name: "status", title:"상태", css:"cell", type: "text", width: 10, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.getGridRowStatusName(value);		
			}},
			{ name: "gridManupulate", title:"그리드조작", css:"cell", type: "control",  width: 15, align:"left"}
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
		$("#gridDiv_gridEdit").jsGrid("reset");		//그리드 데이터 초기화			
		var listData = data.dataList;  		//서버로 받아온 데이터 리스트
		//그리드 바인딩
		$("#gridDiv_gridEdit").jsGrid("loadData", listData).done(function(){  
		});
	}).fail(function(data){
	});		
}

