/**
 * @시스템명: IFRS17
 * @업무명: 대표자CB항목송수신이력 JS
 * @설명: 대표자CB항목송수신이력 JS
 * @최초작성자: 양슬기
 * @최초작성일: 2025.09.25
 * @최종변경일:
 * @개정이력:
 *  양슬기 2025.09.25 최초작성

 */
$(document).ready(function(){
	/* 2021.05.03 툴팁 추가 */
	$("#imgToolTip").attr("title", parent.viewPath);
	
	/* 2021.06.14 화면ID 추가 */
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
    /* 2021.06.16 버튼권한처리 */
    // 엑셀업로드, 행추가, 저장
    var btnIdArr = ["btn_loadExcel", "btn_addGrid", "btn_save"];
	var permArr = [];
	for (var i = 0; i < btnIdArr.length; i++) {
		permArr.push({
			btnId : "#" + btnIdArr[i],
			type : "B"
		});
	}
    $.fn.setBtnPermission(permArr);

	var today = new Date();
	var year  = today.getFullYear();
	var month = ("0" + (today.getMonth() + 1)).slice(-2);
	var toYmd = year + "-" + month + "-" + ("0" + today.getDate()).slice(-2);
	$("#inp_basDt").val(toYmd);


    
	// event 초기화
	initEvent();
	
	// grid 초기화
	initGrid();
	
	
});


/**
 * @설명: event 초기화
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function initEvent() {
	// 조회
	$("#btn_search").on("click", function(e){
		selectReprCBComponHistList();
	});
	
	// 마감년월 from 달력
	$("#btn_basDt").on("click", function(e){
		$("#inp_basDt").datepicker("show");
	});

	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "대표자CB항목송수신이력.xlsx";

		var paramObj = {};
		paramObj.id = gridId;
		paramObj.fileName = fileName;         
		paramObj.applyItemTemplate = false;   
		$.fn.exportGridExcel(paramObj);
	});
	
	
	
}

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function initGrid(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDivRins",
		height: 600,
		editing: true,
		sorting: true,
		paging: true,
		selectHiglight: false,
		deleteConfirm: "삭제하시겠습니까?",
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				//debugger;
				var status = "u";	//수정
				if(item.status == "c" || item.status == "e" ) {	//신규, 엑셀업로드는 c,e상태 유지 후 데이터 수정
				} else if(item.status == "dd"){	//삭제신청으로 요청되면 "삭제"로 최정 변경처리
					item.status = "d";
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { //grid 삭제 아이콘 클릭 또는 deleteItem API이용시 진입
				//deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = "dd";	//삭제 신청
				//debugger;
				if (item.status == "c" || item.status == "e" ) {	//신규, 엑셀업로드 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else {	//u,d 는 삭제 상태로 처리 -> updateItem에서 최종  삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#gridDivRins").jsGrid("updateItem", item);
					return item;
				}
			},
			insertItem : function(item) {}	
			
		},
		onItemEditing: function(args) {	//Grid Edit모드 진입시 처리
			
			//delete 상태 스킵
			if( args.item.status == 'd') {
				args.cancel = true;
			}
		},
		
		//그리드 컬럼 정의 !!!
	   fields: [
		  { name: "stndYmd", title:"기준일자", css:"cell", type: "text", width: 100, editing: false, align:"center"},
	      { name: "dlUnqNo", title:"거래고유번호", css:"cell", type: "text",  width: 150, align:"center", editing: false},
	      { name: "cbCustNo", title:"CB고객번호", css:"cell", type: "text",  width: 150, align:"center", editing: false},
	      
		  { name: "cbTotAsetAmt", title:"CB총자산금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
				return $.addCommaNumber(value + "");			
				}, editTemplate:function(value, item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivRins").jsGrid("updateItem");
							return false;
						}
					});
				return $result;
				}
		  },
	      
		  { name: "cbSelngAmt", title:"CB매출금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
				return $.addCommaNumber(value + "");			
				}, editTemplate:function(value, item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDivRins").jsGrid("updateItem");
							return false;
						}
					});
				return $result;
				}
		  },
	      
	      { name: "cbMdlScCd", title:"CB모델구분코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd01", title:"비외감최근1년이내최장연체일수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd02", title:"비외감1최근6개월대출이용유형구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd03", title:"비외감1최근6개월이내신용카드신판이용율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd04", title:"비외감1현금서비스이용잔액기간수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd05", title:"비외감1미해지보증총건수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd06", title:"비외감1은행업권제외총보증금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd07", title:"비외감1은행연합회6개월이내대출총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd08", title:"비외감1최근3개월이내연체총건수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd09", title:"비외감1최근1년이내최장연체일수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd10", title:"비외감1최근6개월업권대출이용유형구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd11", title:"비외감2최근6개월이내신용카드신판이용율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd12", title:"비외감2미해지보증기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd13", title:"비외감2은행연합회미상환카드론기간수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd14", title:"비외감2최근3개월이내연체총건수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd15", title:"개인사업자최근1년이내최장연체일수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd16", title:"개인사업자최근6개월업권채대출이용유형구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd17", title:"개인사업자최근12개월이내평균신용카드신판이용율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd18", title:"개인사업자은행업제외보증기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd19", title:"개인사업자신용대출담보제외총잔액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd20", title:"개인사업자최근3개월이내연체총건수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd21", title:"대표자미해제등록총건수존재구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd22", title:"대표자최근1년이내30일이상연체구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "respCd01", title:"NICE응답코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},

		
		  { name: "status", title:"상태", css:"cell", type: "text", width: 50, align:"center", editing: false, itemTemplate:function(value, item) {
			  	return $.fn.getGridRowStatusName(value);			
		  		}
		  },
		  { name: "gridManupulate", title:"그리드조작", css:"cell", type: "control", width: 70, align:"left",editing: true}

			  
			  
	   ] 
	});	
	
	//그리드 생성
	gridObject.gridCreate();
}





/**
 * @설명: 대표자CB항목송수신이력 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function selectReprCBComponHistList(){

	var basDt = $("#inp_basDt").val();
	basDt = basDt.replace("-","");
	basDt = basDt.replace("-","");
	
	var dlUnqNo = $("#inp_dlUnqNo").val();
	var cbCustNo = $("#inp_cbCustNo").val();
	
	//전송 파라미터 세팅 
	var req = {
			"stndYmd" : basDt,
			"dlUnqNo" : dlUnqNo,
			"cbCustNo" : cbCustNo
	};
	
	//서비스url 
	$.callAjax(req, "/rm/cb/rmcb212m/selectReprCBComponHistList.do")
		.done(function(data) {
			// 그리드 데이터 초기화
			$("#gridDivRins").jsGrid("reset");

			// 그리드 바인딩
			var listData = data.list;
			$("#gridDivRins").jsGrid("loadData", listData).done(function() {
			});
			
			/* 2021.06.15 0건 그리드 메세지 처리 */
			if(listData.length == 0) {
				$.fn.getReturnValue("gridDivRins");
			}
			
		}).fail(function(data){
			console.log("fail to selectReprCBComponHistList");
	});		
}



