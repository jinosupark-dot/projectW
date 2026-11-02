/**
 * @시스템명: IFRS17
 * @업무명: 기업CB항목송수신이력 JS
 * @설명: 기업CB항목송수신이력 JS
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
		selectCompCBComponHistList();
	});
	
	// 마감년월 from 달력
	$("#btn_basDt").on("click", function(e){
		$("#inp_basDt").datepicker("show");
	});

	
	// 양식다운로드
	$("#btn_exportExcel").on("click", function(e){
		var gridId = "gridDivRins";
		var fileName = "기업CB항목송수신이력.xlsx";

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
	      { name: "dlUnqNo", title:"거래고유번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "cbCustNo", title:"CB고객번호", css:"cell", type: "text",  width: 100, align:"center", editing: false},
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
	      
		  { name: "cbSelngAmt", title:"CB대출금액", css:"cell", type: "number", width: 140, align:"right", itemTemplate:function(value, item) {
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
	      { name: "wgTrnsItvCd01", title:"외감IFRS경공업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd02", title:"외감IFRS경공업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd03", title:"외감IFRS경공업총자산다비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd04", title:"외감IFRS경공업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd05", title:"외감IFRS경공업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd06", title:"외간IFRS중공업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd07", title:"외감IFRS중공업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd08", title:"외감IFRS중공업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd09", title:"외감IFRS중공업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd10", title:"외감IFRS중공업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd11", title:"외감IFRS건설업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd12", title:"외감IFRS건설업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd13", title:"외감IFRS건설업외간IFRS건설업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd14", title:"외감IFRS도소매업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd15", title:"외감IFRS도소매업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd16", title:"외감IFRS도소매업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd17", title:"외감IFRS도소매업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd18", title:"외감IFRS도소매업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd19", title:"외감IFRS서비스업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd20", title:"외감IFRS서비스업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd21", title:"외감IFRS서비스업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd22", title:"외감IFRS매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd23", title:"외감IFRS서비스업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd24", title:"외감GAAP경공업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd25", title:"외감GAAP경공업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd26", title:"외감GAAP경공업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd27", title:"외감GAAP경공업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd28", title:"외감GAAP경공업매출액대비신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd29", title:"외감GAAP중공업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd30", title:"외감GAAP중공업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd31", title:"외감GAAP중공업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd32", title:"외감GAAP중공업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd33", title:"외감GAAP중공업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd34", title:"외감GAAP건설업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd35", title:"외감GAAP건설업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd36", title:"외감GAAP건설업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd37", title:"외감GAAP도소매업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd38", title:"외감GAAP도소매업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd39", title:"외감GAAP도소매업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd40", title:"외감GAAP도소매업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},


	      { name: "wgTrnsItvCd41", title:"외감GAAP도소매업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      
	      { name: "wgTrnsItvCd42", title:"외감GAAP서비스업비은행업총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd43", title:"외감GAAP서비스업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd44", title:"외감GAAP서비스업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd45", title:"외감GAAP서비스업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd46", title:"외감GAAP서비스업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      
	      { name: "wgTrnsItvCd47", title:"비외감1경공업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd48", title:"비외감1경공업업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd49", title:"비외감1경공업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd50", title:"비외감1경공업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd51", title:"비외감1경공업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      
	      { name: "wgTrnsItvCd52", title:"비외감1중공업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd53", title:"비외감1중공업업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd54", title:"비외감1중공업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd55", title:"비외감1중공업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd56", title:"비외감1중공업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      
	      { name: "wgTrnsItvCd57", title:"비외감1건설업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd58", title:"비외감1건설업업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd59", title:"비외감1건설업총자산대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd60", title:"비외감1도소매업비은행업권종신용공여금약구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd61", title:"비외감1도소매최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      
	      { name: "wgTrnsItvCd62", title:"비외감1도소매총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd63", title:"비외감1도소매업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd64", title:"비외감1도소매업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd65", title:"비외감1서비스업비은행업권총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd66", title:"비외감1서비스업최근월대출거래종기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      
	      { name: "wgTrnsItvCd67", title:"비외감1서비스업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd68", title:"비외감1서비스업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd69", title:"비외감1서비스업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd70", title:"비외감2경공업비은행업권총신용공여금약구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd71", title:"비외감2경공업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      
	      { name: "wgTrnsItvCd72", title:"비외감2경공업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd73", title:"비외감2경공업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd74", title:"비외감2경공업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd75", title:"비외감2중공업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd76", title:"비외감2중공업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      
	      { name: "wgTrnsItvCd77", title:"비외감2중공업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd78", title:"비외감2중공업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd79", title:"비외감2중공업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd80", title:"비외감2건설업비은행업권총신옹공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd81", title:"비외감2건설업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd82", title:"비외감2건설업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd83", title:"비외감2건설업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd84", title:"비외감2건설업매출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd85", title:"비외감2도소매업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd86", title:"비외감2도소매업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd87", title:"비외감2도소매업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd88", title:"비외감2도소매업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd89", title:"비외감2도소매업대출액대비총신용공여구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd90", title:"비외감2서비스업비은행업권총신옹공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      
	      { name: "wgTrnsItvCd91", title:"비외감2서비스업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd92", title:"비외감2서비스업총자산대비최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd93", title:"비외감2서비스업매출액대비제2금융권최근6개월이내평균신용공여비율구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd94", title:"비외감2서비스업매출액대비총신용구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd95", title:"개인사업자경공업비은행업총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd96", title:"개인사업자경공업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd97", title:"개인사업자중공업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd98", title:"개인사업자중공업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd99", title:"개인사업자건설업비은행업총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd100", title:"개인사업자건설업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd101", title:"개인사업자도소매업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd102", title:"개인사업자도소매업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd103", title:"개인사업자서비스업비은행업권총신용공여금액구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd104", title:"개인사업자서비스업최근월대출거래총기관수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd105", title:"외감IFRS채무불이행최근5년부도경험총선수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd106", title:"외감IFRS채무불이행최근5년이내발생기간일수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd107", title:"외감IFRS세금체납미해제등록구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd108", title:"외감IFRS이외채무불이행최근5년연체보유총건수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd109", title:"외감IFRS이외채무불이행최근5년부도경험총건수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd110", title:"외감IFRS이외채무불이행최근5년이내발생기간일수구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      { name: "wgTrnsItvCd111", title:"외함IFRS이외세금체납미해제등록구간코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},

	      { name: "respCd", title:"NICE응답코드", css:"cell", type: "text",  width: 100, align:"center", editing: false},
	      
	      
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
 * @설명: 기업CB항목송수신이력 목록을 조회한다.
 * @최초작성자: 양슬기
 * @최초작성일: 2021.02.09
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  양슬기 2021.02.09 최초작성
 */
function selectCompCBComponHistList(){

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
	$.callAjax(req, "/rm/cb/rmcb211m/selectCompCBComponHistList.do")
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
			console.log("fail to selectCompCBComponHistList");
	});		
}



