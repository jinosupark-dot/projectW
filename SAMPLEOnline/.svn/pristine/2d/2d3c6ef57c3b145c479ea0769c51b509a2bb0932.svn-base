/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-결산항목 관리
 * @설명: 결산항목 관리
 * @최초작성자: 최동염
 * @최초작성일: 2021.01.25
 * @최종변경일:
 * @개정이력:
 *  최동염 2021.01.25 최초작성
 *  최동염 2021.04.28 2차 표준화
 *  최동염 2021.06.15 3차 표준화
 */

var selectedTreeActivityId;	//tree의 선택한 activityId
var selectedTreeActFinTypCd;	//tree의 선택한 actFinTypCd
var selectedTreeActLvl;	//tree의 선택한 actLvl
var userScreenClickYn = 'Y';	//화면에서 tree 클릭 유무 
var clickIndex ;	//그리드에서 선택 object
var activityGrideType ="";
var rowItem = null;

/**
 * 
 * @설명:  로딩 후 호출
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 2021. 02. 08.
 * @매개변수:  
 * @반환값: void
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *//**
* 
*/
$(document).ready(function(){
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	$.fn.loadCommonCode(['STACT_ACT_FIN_CYL_CD']);
	
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	selectActivityList();
});

/**
 * 
 * @설명: event 생성
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 2021. 02. 08.
 * @매개변수:  
 * @반환값: void
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *//**
* 
*/
function initEvent() {
	$.fn.setBtnPermission([{"btnId":"#btn_save"}]);
	
	//그리드 행추가
	$("#btn_addGrid").on("click", function(e){
		addGridData();
	});
	
	//저장
	$("#btn_save").on("click", function(e){
		saveGridDataAll();
	});
	
	//순서변경 위로
	$("#btn_moveUp").on("click", function(e){
		moveGridRow(false);
	});

	//순서변경 아래로
	$("#btn_moveDown").on("click", function(e){
		moveGridRow(true);
	});
}

/**
* 
* @설명: 팜업 - 부서정보
* @최초작성자: 최동염
* @최초작성일: 2021. 02. 08.
* @최종변경일:
* @매개변수: item
* @반환값: 
* @개정이력: 최동염 2021. 02. 08. 최초작성
* 
*/
function callDeptSearchPopup(){
	activityGrideType = "dept";	
	var popupOption = {
			url: "/fi/mt/fimt311p.do",
			name: "부서번호조회팝업",
			width: 800,
			height: 464
	}
	var popup = $.fn.openPopup(popupOption);
}

/**
* 
* @설명: 팜업 - 배치정보
* @최초작성자: 최동염
* @최초작성일: 2021. 02. 08.
* @최종변경일:
* @매개변수: item
* @반환값: 
* @개정이력: 최동염 2021. 02. 08. 최초작성
* 
*/
function callBatchSearchPopup(){
	activityGrideType = "batch";	
	var popupOption = {
			url: "/fi/mt/fimt311p.do",
			name: "배치정보조회팝업",
			width: 800,
			height: 464
	}
	var popup = $.fn.openPopup(popupOption);
}

/**
* 
* @설명: 팜업 콜백
* @최초작성자: 최동염
* @최초작성일: 2021. 02. 08.
* @최종변경일:
* @매개변수: selectedObj
* @반환값: 
* @개정이력: 최동염 2021. 02. 08. 최초작성
* 
*/
function resultPopup_callback(selectedObj){
	$("#gridDiv").jsGrid("updateItem");
	var gridData = $("#gridDiv").jsGrid("option", "data");
	rowItem = gridData[clickIndex];
	
	if(typeof rowItem === "undefined" || rowItem == null) return;
	
	var newRowItem = $.extend({}, rowItem, selectedObj);
	$("#gridDiv").jsGrid("updateItem", rowItem, newRowItem);
} 

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: any
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 685,
		editing: true,
		sorting: false,
		paging: false,
		selectHiglight:true,
		deleteConfirm: "삭제하시겠습니까?",
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
				
				console.log("item3 : ",item);
				
				//debugger;
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
				//debugger;
				if(item.status == 'c') {	//신규 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else  {	//u,d 는 삭제 상태로 처리 -> updateItem에서 최종  삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#gridDiv").jsGrid("updateItem", item);
					return item;
				}
			},
			insertItem : function(item) { //insertItem API이용시 진입
//				setTimeout(function(){
//					$("#gridDiv").jsGrid("editItem", item);
//				});
			}	
		},
		onItemEditing: function(args) {	//Grid Edit모드 진입시 처리
			
			//delete 상태 스킵
			if( args.item.status == 'd') {
				args.cancel = true;
			}
		},
		onOptionChanged: function(args) {	//Grid Edit모드 진입시 처리
			
			console.log("args.item : ",args.item);
		},
		fields : [
			{ name: "stactActSeq", title:"순번", css:"cell", type: "text", width: 30, editing: false, align:"center"},
			{ name: "stactActTypCd", title:"Activity유형", css:"cell", type: "select", width: 35, align:"center", editing: false,
				items: [
					{Name:"그룹", Id: "1"},
					{Name:"배치", Id: "2"},
					{Name:"수동", Id: "3"}],
				textField: "Name",
				valueField: "Id",
			},
			{ name: "useYn", title:"사용여부", css:"cell", type: "select", width: 30, align:"center",
				
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
				},
				items: [
					{Name:"Y", Id: "Y"},
					{Name:"N", Id: "N"}],
				textField: 'Name',
				valueField: 'Id',
				validate: [{validator:'required', message:'[사용여부] 필수 입력 항목입니다.'}]
			},
			{ name: "batId", title:"배치ID", css:"cell", type: "text",  width: 50, align:"left", editing: false, 
				itemTemplate : function(value, item) {
					var $pEl = $("<p>").addClass("fl line-height20").text(value)
					var $pEl2 = $("<p>").addClass("fr");
					var $aEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
						//배치 조회팝업호출
						callBatchSearchPopup(item);
					});
					var img = $("<img>").attr("src","/img/btn_icon_search.png;")
					$aEl.append(img);
					return $("<div>").append($pEl).append($pEl2.append($aEl));					
				}
			},
			{ name: "batGroupId", title:"배치그룹ID", css:"cell", type: "text", width: 50, align:"left",
				//[2021-11-03 제외]editTemplate: function(value, item){
				//[2021-11-03 제외]	var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
				//[2021-11-03 제외]	
				//[2021-11-03 제외]	if(item.stactActFinTypCd != '2') {
				//[2021-11-03 제외]		$result.attr("readonly", "true");
				//[2021-11-03 제외]	}
				//[2021-11-03 제외]	return $result;
				//[2021-11-03 제외]},
			},
			{ name: "stactActNm", title:"Activity명", css:"cell", type: "text", width: 150, align:"left",
				// Enter 키 입력시 updateItem apply됨.
				editTemplate: function(value, item){
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
					
					if(item.stactActTypCd != '2') {
						setTimeout(function(){
							$result.focus();
						});
					}
					return $result;
				},
				validate:{validator:"rangeLength", param:[1,50],message:"[Activity명] 1~50글자를 넣어주세요."},
			},
			{ name: "stactActFinCylCd", title:"D-day", css:"cell", type: "select",  width: 40, align:"center",
				items: [
						{Name:"D-2", Id: "-2"},
						{Name:"D-1", Id: "-1"},
						{Name:"D+0", Id: "0"},
						{Name:"D+1", Id: "1"},
						{Name:"D+2", Id: "2"},
						{Name:"D+3", Id: "3"},
						{Name:"D+4", Id: "4"},
						{Name:"D+5", Id: "5"},
						{Name:"D+6", Id: "6"},
						{Name:"D+7", Id: "7"},
						{Name:"D+8", Id: "8"},
						{Name:"D+9", Id: "9"},
						{Name:"D+10", Id: "10"},
						{Name:"D+11", Id: "11"},
						{Name:"D+12", Id: "12"},
						{Name:"D+13", Id: "13"},
						{Name:"D+14", Id: "14"},
						{Name:"D+15", Id: "15"}],
				textField: "Name",
				valueField: "Id"
			},
			{ name: "stactActFinDeptCd", title:"담당부서", css:"cell", type: "text",  width: 50, align:"left", editing: false, 
				itemTemplate : function(value, item) {
					var $pEl = $("<p>").addClass("fl line-height20").text(value)
					var $pEl2 = $("<p>").addClass("fr");
					var $aEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
						// 담당부서 조회팝업호출
						callDeptSearchPopup();
					});
					var img = $("<img>").attr("src","/img/btn_icon_search.png;")
					$aEl.append(img);
					return $("<div>").append($pEl).append($pEl2.append($aEl));					
				},
				validate:{validator:"rangeLength", param:[0,1],
				  	  message : "[담당부서] 담당부서를 입력해주세요."
				}
			},
			{ name: "stactActFinDeptNm", title:"담당부서명", css:"cell", type: "text",  width: 50, align:"left", editing: false},
			{ name: "stactActFinTypCd", title:"작업유형", css:"cell", type: "select",  width: 50, align:"center",
				//[2021-11-03 제외]editTemplate: function(value, item){
				//[2021-11-03 제외]	var grid = this._grid;
				//[2021-11-03 제외]	var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value);
				//[2021-11-03 제외]	$result.change(function(value, item){
				//[2021-11-03 제외]		var selectedValue = $(this).val();
				//[2021-11-03 제외]		
				//[2021-11-03 제외]		//console.log("grid.fields[4].editControl[0]", grid.fields[4].editControl);
				//[2021-11-03 제외]		
				//[2021-11-03 제외]		if(selectedValue == "2"){
				//[2021-11-03 제외]			grid.fields[4].editControl[0].readOnly = false;
				//[2021-11-03 제외]		}else{
				//[2021-11-03 제외]			grid.fields[4].editControl[0].value = "";
				//[2021-11-03 제외]			grid.fields[4].editControl[0].readOnly = true;
				//[2021-11-03 제외]		}
				//[2021-11-03 제외]	});
				//[2021-11-03 제외]	
				//[2021-11-03 제외]	return $result;
				//[2021-11-03 제외]},
				items: [
					{Name:"전산마감", Id: "1"},
					{Name:"수동마감", Id: "2"}],
				textField: "Name",
				valueField: "Id",
				validate:{validator:"rangeLength", param:[0,15],
				  	  message : "[작업유형] 작업유형을 입력해주세요."
				}
			},
			{ name: "regDtm", title:"등록일시", css:"cell", type: "text",  width: 50, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: "trtDtm", title:"처리일시", css:"cell", type: "text",  width: 50, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: "status", title:"상태", css:"cell", type: "text", width: 30, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.getGridRowStatusName(value);			
			}},
			{ name: "gridManupulate", title:"그리드조작", css:"cell", type: "control",  width: 30, align:"left", editing: true},
			{ name: "stactActId", title:"ActivityID", css:"cell", type: "text", width: 50, align:"center", visible:false},
			{ name: "stactActLvl", title:"Depth", css:"cell", type: "text", visible:false},
			{ name: "stactActUppId", title:"stactActUppId", css:"cell", type: "text", visible:false},
			{ name: "stactActPrctSeq", title:"결산활동실행순서", css:"cell", type: "text",  width: 30, align:"left", editing: true, visible:false},
			{ name: "stactActBusnDmnCd", title:"업무영역", css:"cell", type: "text",  width: 30, align:"left", editing: true, visible:false},
			{ name: "stactActSystmCd", title:"시스템", css:"cell", type: "text",  width: 30, align:"left", editing: true, visible:false},
			{ name: "stactActGoalFinDdCd", title:"목표마감일", css:"cell", type: "text",  width: 30, align:"left", editing: true, visible:false},
			{ name: "stactActFinPercEno", title:"마감담당자", css:"cell", type: "text",  width: 30, align:"left", editing: true, visible:false}
		]
	});	
	
	
	gridObject.rowClick(function(args) {
		clickIndex = args.itemIndex;;
	});	
		
	//그리드 생성
	gridObject.gridCreate();
}

/**
 * 1차원 리스트를 Tree데이터로 변환
 * @설명: 
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
var activityMap = {}; //id, {}
function makeActivityTree(activtyList) {
	var depthList = [];		//depth, []
	activityMap = {};
	for(var i=0; i<activtyList.length; i++) {
		var activityObj = activtyList[i];
		var depth = Number(activityObj.stactActLvl);
		var tempList = depthList[depth]||[];
		tempList.push(activityObj);
		depthList[depth] = tempList;
		activityMap[activityObj.stactActId] = activityObj;
	}

	
	for(var i=depthList.length-1; i>0; i--) {
		var subList = depthList[i];
		for(var j=0; j<subList.length; j++) {
			var activityId = subList[j].stactActId;
			var activityObj = activityMap[activityId];
			var parentActivity = activityMap[activityObj.stactActUppId];
			if(parentActivity) {
				var children = parentActivity.children||[];
				children.push(activityObj);
				parentActivity.children = children;
				delete activityMap[activityId];	
			} else {
				console.log(activityObj.stactActUppId + "does not exist!(" + JSON.stringify(activityObj) + ")");
				alert("[" + activityId + ":" + activityObj.stactActNm + "]의 상위메뉴 ID[" + activityObj.stactActUppId + "]가 존재하지 않습니다.");
//				break;
			}			
		}
	}		
	return activityMap;
}

/**
 * 
 * @설명: activityId로 activityObject를 얻어온다.
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: searchId 메뉴ID
 * @반환값: activityObj
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function getActivityObj(searchId) {
	for(var key in activityMap) {
		var activityObj = activityMap[key];
		var activityId = activityObj.stactActId;
		
		if(activityId == searchId) {
			return activityObj;
		} else {
			return _searchChildActivity(searchId, activityObj);
		}
	}
}

/**
 * 
 * @설명: activityId로 children을 검색한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: searchId 메뉴ID
 * @반환값: activityObj
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function _searchChildActivity(searchId, targetObj) {
	var children = targetObj.children;
	if(!children || children.length == 0) return;
	for(var i=0; i<children.length; i++) {
		var activityObj = children[i];
		var activityId = activityObj.stactActId;
		if(activityId == searchId) {
			return activityObj;
		}
		var retActivityObj = _searchChildActivity(searchId, activityObj);
		if(retActivityObj) return retActivityObj;
	}
}

/**
 * 
 * @설명: 메뉴트리를 생성한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: activtyList 
 * @반환값: void
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function renderTreeView(activtyList) {
	//remove activity;
	$("#treeActivityDiv").children().remove();

	var treeObj = makeActivityTree(activtyList);
	
	var treeElement = document.createElement("div");
	treeElement.setAttribute("class", "tree_wrap");
	
	var key = Object.keys(treeObj)[0];
	var firstActivityObj = treeObj[key];
	var firstElement = _makeTreeElement(firstActivityObj);
	treeElement.appendChild(firstElement);
	
	_appendTreeChild(firstActivityObj, treeElement);
	
	//console.log(treeElement.innerHTML);
	var treeActivityElement = document.getElementById("treeActivityDiv");
	treeActivityElement.appendChild(treeElement);
	
	//add Event
	$(".tree_main").click(function() {
		var activityId = $(this)[0].getAttribute("activityId");
		var activityObj = getActivityObj(activityId);
		
		$(this).parents().find(".tree_dep1 > a").removeClass('active'); 
		$("ul.tree_dep2").slideUp();
		$(this).parents().find(".tree_dep2 > a").removeClass('active'); 
		$("ul.tree_dep3").slideUp();
		$(this).parents().find(".tree_dep3 > a").removeClass('active'); 
		$("ul.tree_dep4").slideUp();
		$(this).parents().find(".tree_dep4 > a").removeClass('active'); 
		
		selectActivityListByUppActivityId(activityObj);
	});
	
	$(".tree_dep1 > a").click(function(){
		var activityId = $(this)[0].getAttribute("activityId")		
		var activityObj = getActivityObj(activityId);
		
		if(activityObj && activityObj.stactActTypCd == "1") {
			if(selectedTreeActivityId != activityObj.stactActUppId) {
				$("ul.tree_dep2").slideUp();
				$(this).parents().find(".tree_dep2 > a").removeClass('active'); 
				$("ul.tree_dep3").slideUp();
				$(this).parents().find(".tree_dep3 > a").removeClass('active'); 
				$("ul.tree_dep4").slideUp();
				$(this).parents().find(".tree_dep4 > a").removeClass('active');
			}
			
			$(this).parents().find(".tree_dep1 > a").removeClass('active');
			if($(this).parent().find("+ul").is(":hidden")){
				$(this).parent().find("+ul").slideDown();
				$(".tree_dep1 > a").removeClass('active'); 	
			}
			$(this).addClass('active'); 
			
			if(userScreenClickYn == "Y"){
				selectedTreeActLvl = activityObj.stactActLvl;
			}
			
			if(selectedTreeActLvl == activityObj.stactActLvl){
				selectActivityListByUppActivityId(activityObj);
			}			
		}
	});

	$(".tree_dep2 > a").click(function(){
		var activityId = $(this)[0].getAttribute("activityId");
		var activityObj = getActivityObj(activityId);
		
		if(activityObj && activityObj.stactActTypCd == "1") {
			if(selectedTreeActivityId != activityObj.stactActUppId) {
				$("ul.tree_dep3").slideUp();
				$(this).parents().find(".tree_dep3 > a").removeClass('active'); 
				$("ul.tree_dep4").slideUp();
				$(this).parents().find(".tree_dep4 > a").removeClass('active');
			}
			
			$(this).parents().find(".tree_dep2 > a").removeClass('active'); 
			if($(this).parent().find("+ul").is(":hidden")){
				$(this).parent().find("+ul").slideDown();
				$(".tree_dep2 > a").removeClass('active'); 
			}
			$(this).addClass('active');
			
			if(userScreenClickYn == "Y"){
				selectedTreeActLvl = activityObj.stactActLvl;
			}
			
			if(selectedTreeActLvl == activityObj.stactActLvl){
				selectActivityListByUppActivityId(activityObj);
			}	
		}
	});	
	
	$(".tree_dep3 > a").click(function(){
		var activityId = $(this)[0].getAttribute("activityId");
		var activityObj = getActivityObj(activityId);
		
		if(activityObj && activityObj.stactActTypCd == "1") {
			if(selectedTreeActivityId != activityObj.stactActUppId) {
				$("ul.tree_dep4").slideUp();
				$(this).parents().find(".tree_dep4 > a").removeClass('active');
			}
			
			$(this).parents().find(".tree_dep3 > a").removeClass('active'); 
			if($(this).parent().find("+ul").is(":hidden")){
				$(this).parent().find("+ul").slideDown(); 
			}
			$(this).addClass('active');
			
			if(userScreenClickYn == "Y"){
				selectedTreeActLvl = activityObj.stactActLvl;
			}
			
			if(selectedTreeActLvl == activityObj.stactActLvl){
				selectActivityListByUppActivityId(activityObj);
			}	
		}
	});	

	
	if(selectedTreeActivityId) {
		selectTree(selectedTreeActivityId);
	}else{
		$(".tree_main").click();
	}
	
	userScreenClickYn = 'Y';
}

/**
 * 트리메뉴 Child Element 생성
 * @설명: 
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function _appendTreeChild(activityObj, targetElement) {
	var depth = activityObj.stactActLvl;
	var activtyList = activityObj.children;
	if(!activtyList || activtyList.length == 0) {
		return;
	}
	var ulElement = document.createElement("ul");
	ulElement.setAttribute("class", "tree_dep" + (Number(depth) + 1));

	for(var i=0; i<activtyList.length; i++) {
		var activityObj = activtyList[i];
		var liElement = _makeTreeElement(activityObj);
		ulElement.appendChild(liElement);
		_appendTreeChild(activityObj, liElement);
	}
	targetElement.appendChild(ulElement);
}

/**
 * 트리메뉴 Element 생성
 * @설명: 
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function _makeTreeElement(activityObj) {
	var depth = activityObj.stactActLvl;
	var activityId = activityObj.stactActId;
	var activityNm = activityObj.stactActNm;
	var activityTypCd = activityObj.stactActTypCd; //1:메뉴, 2:배치, 3:수동
	if(depth == "0") {
		var firstElement = document.createElement("p");
		firstElement.setAttribute("activityId", activityId);
		firstElement.setAttribute("class","tree_main");
		var iElement = document.createElement("i");
		iElement.setAttribute("class", "xi-home xi-x");
		firstElement.innerHTML = iElement.outerHTML + activityObj.stactActNm;
		return firstElement;
	} else {
		var lElement = document.createElement("li");
		var pElement = document.createElement("p");
		var className = "tree_dep" + depth;
		if(activityTypCd != 1) {
			className += " notree";
		}
		pElement.setAttribute("class", className);
		var aElement = document.createElement("a");
		aElement.setAttribute("href", "javascript:void(0);");
		aElement.setAttribute("activityId", activityId);
		aElement.innerText = activityNm;
		pElement.appendChild(aElement);
		lElement.appendChild(pElement);
		return lElement;
	}
}

function selectTree(activityId) {
	var activityObj1 = getActivityObj(activityId);
	var parentId1 = activityObj1.stactActUppId;
	var activityObj2;
	var parentId2 = '';
	
	if(activityObj1.stactActLvl != '0'){
		activityObj2 = getActivityObj(parentId1);
		parentId2 = activityObj2.stactActUppId;
	}
	
	var list = $(".tree_main");
	for(var i=0; i<list.length; i++) {
		var elem  = list[i];
		var elemActivityId = elem.getAttribute("activityId");
		if(parentId2 == elemActivityId || parentId1 == elemActivityId || activityId == elemActivityId) {
			elem.click();
		}
	}
	
	list = $(".tree_dep1 > a");
	for(var i=0; i<list.length; i++) {
		var elem  = list[i];
		var elemActivityId = elem.getAttribute("activityId");
		if(parentId2 == elemActivityId || parentId1 == elemActivityId || activityId == elemActivityId) {
			elem.click();
		}
	}
	
	list = $(".tree_dep2 > a");
	for(var i=0; i<list.length; i++) {
		var elem  = list[i];
		var elemActivityId = elem.getAttribute("activityId");
		if(parentId2 == elemActivityId || parentId1 == elemActivityId || activityId == elemActivityId) {
			elem.click();
		}
	}
	
	list = $(".tree_dep3 > a");
	for(var i=0; i<list.length; i++) {
		var elem  = list[i];
		var elemActivityId = elem.getAttribute("activityId");
		if(parentId2 == elemActivityId || parentId1 == elemActivityId || activityId == elemActivityId) {
			elem.click();
		}
	}
}

/**
 * Activity 조회후 트리정보 랜더링
 * @설명: 
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: void
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function selectActivityList() {
	var reqParam = {};
	//example 조회 서비스 AJAX호출 후 그리드 바인딩
	//param 조건에 맞게 select한 데이터 가져옴
	$.callAjax(reqParam, "/fi/mt/fimt311m/selectBundleRunActivityList.do")
	.done(function(data) {
		renderTreeView(data.list);
	}).fail(function(data){
	});		
}

/**
 * @설명: selectActivityListByUppActivityId
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: any
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 */
function selectActivityListByUppActivityId(activityObj) {
	selectedTreeActivityId = activityObj.stactActId;
	selectedTreeActFinTypCd = activityObj.stactActFinTypCd;
	var activityLvl = activityObj.stactActLvl;
	var activityNm = activityObj.stactActNm;
	
	var activityFinTypNm = "전산마감";
	$('#btnWrap').show();
	$('#grid_control_btn').show();
	if(activityObj.stactActFinTypCd == '2'){
		activityFinTypNm = "수동마감";
		$('#btnWrap').hide();
		$('#grid_control_btn').hide();
	}
	
	var activityLvlNm = ""
	if(activityLvl == 0){activityLvlNm = "상분류";}
	else if(activityLvl == 1){activityLvlNm = "중분류";}
	else if(activityLvl == 2){activityLvlNm = "하분류";}
	else if(activityLvl == 3){activityLvlNm = "배치그룹 - " + activityFinTypNm;}
	else{activityLvlNm = "";}
	
	if(activityLvl == 1){
		$("#gridDiv").jsGrid("fieldOption","stactActFinCylCd","visible", true);
		$("#gridDiv").jsGrid("fieldOption","stactActFinDeptCd","visible", true);
		$("#gridDiv").jsGrid("fieldOption","stactActFinDeptNm","visible", true);
		$("#gridDiv").jsGrid("fieldOption","stactActFinTypCd","visible", false);
		$("#gridDiv").jsGrid("fieldOption","batId","visible", false);
		$("#gridDiv").jsGrid("fieldOption","batGroupId","visible", false);
		$("#gridDiv").jsGrid("fieldOption","stactActNm","editing", true);
	} else if(activityLvl == 2){
		$("#gridDiv").jsGrid("fieldOption","stactActFinCylCd","visible", false);
		$("#gridDiv").jsGrid("fieldOption","stactActFinDeptCd","visible", false);
		$("#gridDiv").jsGrid("fieldOption","stactActFinDeptNm","visible", false);
		$("#gridDiv").jsGrid("fieldOption","stactActFinTypCd","visible", true);
		$("#gridDiv").jsGrid("fieldOption","batId","visible", false);
		$("#gridDiv").jsGrid("fieldOption","batGroupId","visible", true);
		$("#gridDiv").jsGrid("fieldOption","stactActNm","editing", true);
	} else if(activityLvl == 3){
		$("#gridDiv").jsGrid("fieldOption","stactActFinCylCd","visible", false);
		$("#gridDiv").jsGrid("fieldOption","stactActFinDeptCd","visible", false);
		$("#gridDiv").jsGrid("fieldOption","stactActFinDeptNm","visible", false);
		$("#gridDiv").jsGrid("fieldOption","stactActFinTypCd","visible", false);
		
		if(selectedTreeActFinTypCd == '1'){
			$("#gridDiv").jsGrid("fieldOption","batId","visible", true);
			$("#gridDiv").jsGrid("fieldOption","stactActNm","editing", false);
		}else{
			$("#gridDiv").jsGrid("fieldOption","batId","visible", false);
			$("#gridDiv").jsGrid("fieldOption","stactActNm","editing", true);
		}
		$("#gridDiv").jsGrid("fieldOption","batGroupId","visible", false);
	} else {
		$("#gridDiv").jsGrid("fieldOption","stactActFinCylCd","visible", false);
		$("#gridDiv").jsGrid("fieldOption","stactActFinDeptCd","visible", false);
		$("#gridDiv").jsGrid("fieldOption","stactActFinDeptNm","visible", false);
		$("#gridDiv").jsGrid("fieldOption","stactActFinTypCd","visible", false);
		$("#gridDiv").jsGrid("fieldOption","batId","visible", false);
		$("#gridDiv").jsGrid("fieldOption","batGroupId","visible", false);
		$("#gridDiv").jsGrid("fieldOption","stactActNm","editing", true);
	}
		
	var reqParam = {
			"stactActId": activityObj.stactActId
	}

	//param 조건에 맞게 select한 데이터 가져옴
	$.callAjax(reqParam, "/fi/mt/fimt311m/selectBundleRunActivityListByUppActivityId.do")
	.done(function(data) {
		$("#gridTitle")[0].innerText = "Activity 정보 [" + activityLvlNm + "] - " + activityNm; 
		var listData = data.list;  		//서버로 받아온 데이터 리스트		
		
		if(listData.length > 0) {
			var strListData = $.replaceAll(JSON.stringify(listData), "null", "\"\"");
			listData = JSON.parse(strListData);
		}
		
		//그리드 바인딩
		$("#gridDiv").jsGrid("loadData", listData).done(function(){  
		});
		
		//0건 그리드 메세지 처리
		if(listData.length == 0){
			$.fn.getReturnValue("gridDiv");
		}
		
	}).fail(function(data){
		console.log("fail to selectActivityListByUppActivityId");
	});		
}


/**
 * 
 * @설명: 그리드 변경 구분 처리
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: value
 * @반환값:
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function getGridStatusName(value) {
	if(value == 'c') {
		return "신규";
	} else if (value == 'u') {
		return "수정";
	} else if( value == 'd') {
		return "삭제";
	} else {
		return "";
	}
}

/**
 * 
 * @설명: 그리드 변경건 전체를 삭제한다.
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function saveGridDataAll() {
	//전체 데이터
	userScreenClickYn = 'N';
	
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	
	var gridData = $("#gridDiv").jsGrid("option", "data");
	
	var saveList = [];
	//c,u,d 건만 추출 후 저장 처리
	for(var i=0; i<gridData.length; i++) {
		var item = gridData[i];
		if(! isValid(i,item)) { 
			return; 
		}
		
		if(item.stactActLvl == 3){
			item.batId = item.batGroupId;
		}		
		
		if(item.status == 'c') {
			saveList.push(item);
		} else if(item.status == 'u') {
			saveList.push(item);
		} else if(item.status == 'd') {
			setSeq();
			saveList.push(item);
		}
	}
	
	console.log("=======================================");
	console.log(saveList);
	
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({"list":JSON.stringify(saveList)}, "/fi/mt/fimt311m/saveBundleRunActivityList.do")
			.done(function(data){
				if(data.result > "0") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					selectActivityList();
				}
			}).fail(function(data){
			});
		}
	}, 2);
}

function addGridData() {
	
	if(!selectedTreeActivityId) {
		alert("Tree 항목을 선택 후 진행하세요.");
		return;
	}
	var parentActivityObj = getActivityObj(selectedTreeActivityId);
	var dataList = $("#gridDiv").jsGrid("option", "data");
	var seq = dataList.length + 1;
	
	var activityLvl = (Number(parentActivityObj.stactActLvl) + 1);
	var activityTypCd = "1"
	var activityFinTypCd = ""
	if(activityLvl == 3){
		activityFinTypCd = "1"
	}else if(activityLvl == 4){

		if(selectedTreeActFinTypCd == 2){
			activityTypCd = "3"
		}else{
			activityTypCd = "2"
		}
		
	}
	var uppActivityId = parentActivityObj.stactActId;
	//status컬럼은 그리드 상태 핸들링 하기 위함.(c:신규, u:수정, d:삭제)
	
	var item = { 
			  "status":"c",
			  "stactActSeq":seq,
			  "stactActTypCd":activityTypCd,
			  "useYn":"Y",
			  "stactActId":"",
			  "stactActNm":"",
			  "regDtm":"",
			  "trtDtm":"",
			  "stactActLvl":activityLvl + "",
			  "stactActUppId":uppActivityId,
			  "stactActPrctSeq":seq,
			  "batId":"",
			  "batGroupId":"",
			  "stactActBusnDmnCd":"",
			  "stactActSystmCd":"",
			  "stactActFinTypCd":activityFinTypCd + "",
			  "stactActFinCylCd":"",
			  "stactActGoalFinDdCd":"",
			  "stactActFinDeptCd":"",
			  "stactActFinPercEno":""
			};
	
	$("#gridDiv").jsGrid("insertItem", item);
}

function setSeq(){
	var gridData = $("#gridDiv").jsGrid("option", "data");
	var updateList = [];
	var newList = [];

	for (var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		if (item.status != 'd') {
			updateList.push(item);
		}
	}
	var item ;
	for(var i = 0; i < updateList.length; i++){
		item = updateList[i];
		item["stactActSeq"] = (i + 1);
		if (item.status != 'c' && item.status !='d') {
			item["status"] = "u";
	}
		newList.push(item);
		
	}
	$("#gridDiv").jsGrid("loadData", newList).done(function() {
	});
}
function isValid(rowIndex, item) {
	if(item.stactActNm.trim() == "") {
		$.fn.msgBox(rowIndex+1 + "행의 Activity명을 입력하세요.");
		return false;
	}
	return true;
}

/**
 * 
 * @설명: 클릭한 그리드의 행을 이동시킨다
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function moveGridRow(isDown) {
	var gridData = $("#gridDiv").jsGrid("option", "data");
	var checkedList = [];
	var isEdit = false;
	
	if(gridData.length <= 0) return;
	
	var item = gridData[clickIndex];
	checkedList.push(item);
	if (item.status) {
		isEdit = true;
	}
	if(isDown) {
		if(clickIndex == gridData.length -1) return;
	} else {
		if(clickIndex == 0) return;
	}
	
	var newFocusIndex = 0;
	var tempList = [];
	if(isDown) {
		tempList = array_move(gridData, clickIndex, clickIndex+1);
		newFocusIndex = clickIndex+1;
	} else {
		tempList = array_move(gridData, clickIndex, clickIndex-1);
		newFocusIndex = clickIndex-1;
	}
	var newList = [];
	for(var i=0; i<tempList.length; i++) {
		var item = tempList[i];
		item["stactActSeq"] = (i+1);
		if(item.status != 'c') {
			item["status"] = "u";
		}
		newList.push(item);
	}
	$("#gridDiv").jsGrid("loadData", newList).done(function() {
		console.log("newFocusIndex = " + newFocusIndex);
		var $trEl = $("#gridDiv div.jsgrid-grid-body tr").eq(newFocusIndex);
		
		//엘리먼트 유무 확인
		if(typeof $trEl === "undefined"|| $trEl.length == 0) {
			return;
		}
		
		$trEl.addClass("highlight");
		clickIndex = newFocusIndex;
	});
}

/**
 * 배열의 순서를 변경한다.
 * @설명: 
 * @최초작성자: 최동염
 * @최초작성일: 2021. 02. 08.
 * @최종변경일: 
 * @매개변수:  arr, old_index, new_index
 * @반환값: any
 * @개정이력: 
 *  최동염 2021. 02. 08. 최초작성
 *
 */
function array_move(arr, old_index, new_index) {
	if(new_index >= arr.length) {
		var k = new_index - arr.length +1;
		while(k--) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr;
}
