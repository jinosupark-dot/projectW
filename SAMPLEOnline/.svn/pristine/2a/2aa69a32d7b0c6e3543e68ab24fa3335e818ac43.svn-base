/**
 * @시스템명: IFRS17
 * @업무명: 시스템권한관리
 * @설명: 메뉴를 관리하는 화면의 JS
 * @최초작성자: 장창환
 * @최초작성일: 2021.01.12
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  장창환 2020. 12. 30.  최초작성
 *  권세림 2021.06.15 3차 소스표준화
 */


var selectedTreeMenuId;	//tree의 선택한 menuId
var clickIndex ;	//그리드에서 선택 object

/**
 * 
 * @설명:  로딩 후 호출
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수:  
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */

$(document).ready(function(){
	//view 초기화
	initView();
	//event 초기화
	initEvent();
	
	//그리드 초기화	
	initGrid();
	
	selectMenuList();
});

function initView(){
	/*2021.05.03 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");	
    
    //버튼 권한 처리 2021.06.14
    $.fn.setBtnPermission([{"btnId":"#btn_save","type":"B"}])			//저징버튼
}

/**
 * 
 * @설명: event 생성
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수:  
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 *//**
* 
*/
function initEvent() {
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
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 편신범
 * @최초작성일: 2020. 12. 29.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: any
 * @개정이력: 
 *  편신범 2020. 12. 29. 최초작성
 */
function initGrid(){
	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id: "gridDiv",
		height: 450,
		editing: true,
		sorting: false,
		paging: false,
		selectHiglight:true,
		deleteConfirm: "삭제하시겠습니까?",
		controller : {
			updateItem : function(item) {	//Edit모드에서 적용 아이콘 또는 updateItem API를 이용시 진입
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
			}			
		},
		onItemEditing: function(args) {	//Grid Edit모드 진입시 처리
			//debugger;
			
			//체크박스는 Edit 모드 취소
			var targetElem = (event) ? event.srcElement||null:null;
			if(targetElem) {
				if( targetElem.outerHTML.indexOf("check") > 0) {
					args.cancel = true;
				}
			}
			
			//delete 상태 스킵
			if( args.item.status == 'd') {
				args.cancel = true;
			}
		},
		fields : [
			{ name: "menuSeq", title:"순번", css:"cell", type: "text", width: 30, editing: false, align:"center"},
			{ name: "menuTypCd", title:"메뉴유형", css:"cell", type: "select", width: 50, align:"center",
				items: [
					{Name:"", Id: ""},
					{Name:"메뉴", Id: "1"},
					{Name:"화면", Id: "2"}],
				textField: "Name",
				valueField: "Id",
				// Enter 키 입력시 updateItem apply됨.
				editTemplate: function(value,item){
					var $result = jsGrid.fields.select.prototype.editTemplate.call(this, value,item);
					if (item.status != 'c') {
						$result.attr("disabled", "true");
					}
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDiv").jsGrid("updateItem");
							return false;
						}
					});
					return $result;
				},
				validate:{validator:"required",
				  	  message:"[메뉴유형] 메뉴유형을 선택해주세요"
				 	}
			},
			{ name: "useYn", title:"사용여부", css:"cell", type: "select", width: 50, align:"center",
				items: [
					{Name:"", Id: ""},
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
				},
				validate:{validator:"required",
				  	  message:"[사용여부] 사용여부를 선택해주세요"
				 	}
			},
			{ name: "menuId", title:"메뉴ID", css:"cell", type: "text", width: 50, align:"center", itemTemplate:function(value, item) {
					return "<menuId>" + value + "</menuId>";
				}
				,
				editTemplate:function(value,item) {
					var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value, item);
					//신규 외엔 메뉴ID  불가
					if(item.status != 'c') {
						$result.attr("readonly", "true");
					}
					// Enter 키 입력시 입력사항 반영됨
					$result.on("keydown", function(e){
						if(e.which === 13){
							$("#gridDiv").jsGrid("updateItem");
							return false;
						}
					});
					
					$result.attr("maxlength","8");
					
					return $result;
				},
				// menuId: 7자리 입력
				validate:[{validator:"rangeLength", param:[1,8],
					  	  message:"[메뉴ID] 1~8글자를 넣어주세요."},
					  	{validator: "pattern",
						message: "영문,숫자만 입력가능합니다.",
						validator: function(value){	
							var reg = (/[`~!@#$%^&*|\\\'\";:\/?ㄱ-ㅎ]/g);
			                return !reg.test(value);
			                }}]
				},
			{ name: "menuNm", title:"메뉴명", css:"cell", type: "text", width: 100, align:"center",
					// 최대 150Byte 제한(한글 기준 50글자 제한)
					validate:{validator:"rangeLength", param:[1,50],
						  	message:"[메뉴명] 1~50글자를 넣어주세요."},
					// Enter 키 입력시 입력사항 반영됨
					editTemplate: function(value){
						var $result = jsGrid.fields.text.prototype.editTemplate.call(this, value);
						$result.on("keydown", function(e){
							if(e.which === 13){
								$("#gridDiv").jsGrid("updateItem");
								return false;
							}
						});
						$result.attr("maxlength","50");
						return $result;
						}},

			{ name: "regDtm", title:"등록일자", css:"cell", type: "text",  width: 70, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: "trtDtm", title:"처리일자", css:"cell", type: "text",  width: 70, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.dateFormat(value, "-");			
			}},
			{ name: "status", title:"상태", css:"cell", type: "text", width: 30, align:"center", editing: false, itemTemplate:function(value, item) {
				return $.fn.getGridRowStatusName(value);			
			}},
			{ name: "gridManupulate", title:"그리드조작", css:"cell", type: "control",  width: 70, align:"left",editing: true}
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
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  장창환 2020. 12. 29. 최초작성
 *
 */
var menuMap = {}; //id, {}
function makeMenuTree(menuList) {
	var depthList = [];		//depth, []
	menuMap = {};
	for(var i=0; i<menuList.length; i++) {
		var menuObj = menuList[i];
		var depth = Number(menuObj.menuLvl);
		var tempList = depthList[depth]||[];
		tempList.push(menuObj);
		depthList[depth] = tempList;
		menuMap[menuObj.menuId] = menuObj;
	}

	for(var i=depthList.length-1; i>0; i--) {
		var subList = depthList[i];
		for(var j=0; j<subList.length; j++) {
		  var menuId = subList[j].menuId;
			var menuObj = menuMap[menuId];
			var parentMenu = menuMap[menuObj.uppMenuId];
			if(parentMenu) {
				var children = parentMenu.children||[];
				children.push(menuObj);
				parentMenu.children = children;
				delete menuMap[menuId];	
			} else {
				console.log(menuObj.uppMenuId + "does not exist!(" + JSON.stringify(menuObj) + ")");
				alert("[" + menuId + ":" + menuObj.menuNm + "]의 상위메뉴 ID[" + menuObj.uppMenuId + "]가 존재하지 않습니다.");
//				break;
			}			
		}
	}		
	return menuMap;
}

/**
 * 
 * @설명: menuId로 menuObject를 얻어온다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일: 
 * @매개변수: searchId 메뉴ID
 * @반환값: menuObj
 * @개정이력: 
 *  장창환 2020. 12. 29. 최초작성
 *
 */
function getMenuObj(searchId) {
	for(var key in menuMap) {
		var menuObj = menuMap[key];
		var menuId = menuObj.menuId;
		if(menuId == searchId) {
			return menuObj;
		} else {
			return _searchChildMenu(searchId, menuObj);
		}
	}
}

/**
 * 
 * @설명: menuId로 children을 검색한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일: 
 * @매개변수: searchId 메뉴ID
 * @반환값: menuObj
 * @개정이력: 
 *  장창환 2020. 12. 29. 최초작성
 *
 */
function _searchChildMenu(searchId, targetObj) {
	var children = targetObj.children;
	if(!children || children.length == 0) return;
	for(var i=0; i<children.length; i++) {
		var menuObj = children[i];
		var menuId = menuObj.menuId;
		if(menuId == searchId) {
			return menuObj;
		}
		var retMenuObj = _searchChildMenu(searchId, menuObj);
		if(retMenuObj) return retMenuObj;
	}
}

/**
 * 
 * @설명: 메뉴트리를 생성한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일: 
 * @매개변수: menuList 
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 29. 최초작성
 *
 */
function renderTreeView(menuList) {
	//remove menu;
	$("#treeMenuDiv").children().remove();

	var treeObj = makeMenuTree(menuList);
	
	var treeElement = document.createElement("div");
	treeElement.setAttribute("class", "tree_wrap");
	
	var key = Object.keys(treeObj)[0];
	var firstMenuObj = treeObj[key];
	var firstElement = _makeTreeElement(firstMenuObj);
	treeElement.appendChild(firstElement);
	
	_appendTreeChild(firstMenuObj, treeElement);
	
	//console.log(treeElement.innerHTML);
	var treeMenuElement = document.getElementById("treeMenuDiv");
	treeMenuElement.appendChild(treeElement);
	
	//add Event
	$(".tree_main").click(function() {
		var menuId = $(this)[0].getAttribute("menuId");
		var menuObj = getMenuObj(menuId);
		console.log("current menuId : " + menuId);
		selectMenuListByUppMenuId(menuObj);
	});
	
	$(".tree_dep1 > a").click(function(){
		var menuId = $(this)[0].getAttribute("menuId");
		var menuObj = getMenuObj(menuId);
		if(menuObj && menuObj.menuTypCd == "1") {
			$("ul.tree_dep2").slideUp();
			$(this).parents().find(".tree_dep1 > a").removeClass('active'); 
			if($(this).parent().find("+ul").is(":hidden")){
				$(this).parent().find("+ul").slideDown();
				$(".tree_dep1 > a").removeClass('active'); 
				$(this).addClass('active'); 
			}
			selectMenuListByUppMenuId(menuObj);
		}
	});
	$(".tree_dep2 > a").click(function(){
		var menuId = $(this)[0].getAttribute("menuId");
		var menuObj = getMenuObj(menuId);
		if(menuObj && menuObj.menuTypCd == "1") {
			$("ul.tree_dep3").slideUp();
			$(this).parents().find(".tree_dep2 > a").removeClass('active'); 
			if($(this).parent().find("+ul").is(":hidden")){
				$(this).parent().find("+ul").slideDown();
				$(this).addClass('active'); 
			}
			selectMenuListByUppMenuId(menuObj);
		}
	});	
	
	$(".tree_dep3 > a").click(function(){
		var menuId = $(this)[0].getAttribute("menuId");
		var menuObj = getMenuObj(menuId);
		if(menuObj && menuObj.menuTypCd == "1") {
			$("ul.tree_dep4").slideUp();
			$(this).parents().find(".tree_dep3 > a").removeClass('active'); 
			if($(this).parent().find("+ul").is(":hidden")){
				$(this).parent().find("+ul").slideDown();
				$(this).addClass('active'); 
			}
			selectMenuListByUppMenuId(menuObj);
		}
	});	
	
	if(selectedTreeMenuId) {
		selectTree(selectedTreeMenuId);
	}
	
	$(".tree_main").click();
}

/**
 * 트리메뉴 Child Element 생성
 * @설명: 
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  장창환 2020. 12. 29. 최초작성
 *
 */
function _appendTreeChild(menuObj, targetElement) {
	var depth = menuObj.menuLvl;
	var menuList = menuObj.children;
	if(!menuList || menuList.length == 0) {
		return;
	}
	var ulElement = document.createElement("ul");
	ulElement.setAttribute("class", "tree_dep" + (Number(depth) + 1));

	for(var i=0; i<menuList.length; i++) {
		var menuObj = menuList[i];
		var liElement = _makeTreeElement(menuObj);
		ulElement.appendChild(liElement);
		_appendTreeChild(menuObj, liElement);
	}
	targetElement.appendChild(ulElement);
}

/**
 * 트리메뉴 Element 생성
 * @설명: 
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  장창환 2020. 12. 29. 최초작성
 *
 */
function _makeTreeElement(menuObj) {
	var depth = menuObj.menuLvl;
	var menuId = menuObj.menuId;
	var menuNm = menuObj.menuNm;
	var menuTypCd = menuObj.menuTypCd; //1:메뉴, 2:화면
	if(depth == "0") {
		var firstElement = document.createElement("p");
		firstElement.setAttribute("menuId", menuId);
		firstElement.setAttribute("class","tree_main");
		var iElement = document.createElement("i");
		iElement.setAttribute("class", "xi-home xi-x");
		firstElement.innerHTML = iElement.outerHTML + menuObj.menuNm;
		return firstElement;
	} else {
		var lElement = document.createElement("li");
		var pElement = document.createElement("p");
		var className = "tree_dep" + depth;
		if(menuTypCd == 2) {
			className += " notree";
		}
		pElement.setAttribute("class", className);
		var aElement = document.createElement("a");
		aElement.setAttribute("href", "javascript:void(0);");
		aElement.setAttribute("menuId", menuId);
		aElement.innerText = menuNm;
		pElement.appendChild(aElement);
		lElement.appendChild(pElement);
		return lElement;
	}
}

function selectTree(menuId) {
	var menuObj = getMenuObj(menuId);
	var parentId = menuObj.uppMenuId;
	var list = $(".tree_dep1 > a");
	for(var i=0; i<list.length; i++) {
		var elem  = list[i];
		var elemMenuId = elem.getAttribute("menuId");
		if(parentId == elemMenuId || menuId == elemMenuId) {
			elem.click();
		}
	}

	list = $(".tree_dep2 > a");
	for(var i=0; i<list.length; i++) {
		var elem  = list[i];
		var elemMenuId = elem.getAttribute("menuId");
		if(parentId == elemMenuId || menuId == elemMenuId) {
			elem.click();
		}
	}
}

/**
 * 메뉴 조회후 트리정보 랜더링
 * @설명: 
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 29. 최초작성
 *
 */
function selectMenuList() {
	console.log("selectMenuList");
	
	var reqParam = {};
	//example 조회 서비스 AJAX호출 후 그리드 바인딩
	//param 조건에 맞게 select한 데이터 가져옴
	$.callAjax(reqParam, "/mg/sy/mgsy311m/selectMenuList.do")
	.done(function(data) {
		renderTreeView(data.list);
	}).fail(function(data){
	});		
}

/**
 * @설명: selectMenuListByUppMenuId
 * @최초작성자: 편신범
 * @최초작성일: 2020. 12. 29.
 * @최종변경일: 
 * @매개변수: @returns
 * @반환값: any
 * @개정이력: 
 *  편신범 2020. 12. 29. 최초작성
 */
function selectMenuListByUppMenuId(menuObj) {
	selectedTreeMenuId = menuObj.menuId;
	var menuLvl = menuObj.menuLvl;
	var menuNm = menuObj.menuNm;
	console.log("selectMenuListByUppMenuId");
	
	var reqParam = {
			"menuId": menuObj.menuId
	}

	//param 조건에 맞게 select한 데이터 가져옴
	$.callAjax(reqParam, "/mg/sy/mgsy311m/selectMenuListByUppMenuId.do")
	.done(function(data) {
	    $("#gridDiv").jsGrid("reset");	
		$("#gridTitle")[0].innerText = "메뉴 정보[" + menuLvl + "level] - " + menuNm; 
		var listData = data.list;  		//서버로 받아온 데이터 리스트
		//그리드 바인딩
		$("#gridDiv").jsGrid("loadData", listData).done(function(){  
		});
		// --------------------------------------------------					
        // 0건 그리드 메세지 처리 부분					
        // --------------------------------------------------					
		if (listData.length == 0) {
			$.fn.getReturnValue("gridDiv");
		}
	}).fail(function(data){
		console.log("fail to selectMenuListByUppMenuId");
	});		
}


function grid_check_all() {
	alert("check All");
}

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
 * @최초작성자: 89001203
 * @최초작성일: 2020. 12. 31.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: any
 * @개정이력: 
 *  89001203 2020. 12. 31. 최초작성
 *
 */
function saveGridDataAll() {
	//전체 데이터
	var gridData = $("#gridDiv").jsGrid("option", "data");
	var editRowClass = $("#gridDiv").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#gridDiv").jsGrid("updateItem");
	}
	
	var saveList = [];
	//c,u,d 건만 추출 후 저장 처리
	for(var i=0; i<gridData.length; i++) {
		var item = gridData[i];
		if(! isValid(i,item)) { 
			return; 
		}
		if(item.status == 'c') {
			saveList.push(item);
		} else if(item.status == 'u') {
			saveList.push(item);
			console.log("item   :   ",item);
		} else if(item.status == 'd') {
			setSeq();
			saveList.push(item);
		}
	}
	
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			$.callAjax({"list":JSON.stringify(saveList)}, "/mg/sy/mgsy311m/saveMenuList.do")
			.done(function(data) {
				if(data.result == "1") {
					$.fn.msgBox("정상적으로 처리되었습니다.");
					selectMenuList();
				}
			}).fail(function(data){
			});
		}
	}, 2);
}

function addGridData() {
	if(!selectedTreeMenuId) {
		alert("Tree 항목을 선택 후 진행하세요.");
		return;
	}
	var parentMenuObj = getMenuObj(selectedTreeMenuId);
	var dataList = $("#gridDiv").jsGrid("option", "data");
	var seq = dataList.length + 1;
	
	var menuLvl = (Number(parentMenuObj.menuLvl) + 1);
	var uppMenuId = parentMenuObj.menuId;
	//status컬럼은 그리드 상태 핸들링 하기 위함.(c:신규, u:수정, d:삭제)
	$("#gridDiv").jsGrid("insertItem", 
		{ 
		  "status": "c",
		  "menuSeq":seq,
		  "menuTypCd":"",
		  "menuLvl": menuLvl + "",
		  "uppMenuId": uppMenuId,
		  "useYn":"",
		  "menuId":"",
		  "menuNm":"",
		  "regDtm":"",
		  "trtDtm":""
		}
	);
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
		item["menuSeq"] = (i + 1);
		if (item.status != 'c' && item.status !='d') {
			item["status"] = "u";
	}
		newList.push(item);
		
	}
	$("#gridDiv").jsGrid("loadData", newList).done(function() {
	});
}
function isValid(rowIndex, item) {
	if(item.menuId.trim() == "") {
		$.fn.msgBox(rowIndex+1 + "행의 메뉴ID를 입력하세요.");
		return false;
	}
	if(item.menuNm.trim() == "") {
		$.fn.msgBox(rowIndex+1 + "행의 메뉴명을 입력하세요.");
		return false;
	}
	return true;
}

/**
 * 
 * @설명: 클릭한 그리드의 행을 이동시킨다
 * @최초작성자: 89001203
 * @최초작성일: 2021. 01. 31.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  89001203 2020. 12. 31. 최초작성
 *  61000255 2021. 01. 18 체크박스에서 rowClick 으로 변경
 *
 */
function moveGridRow(isDown) {
	var gridData = $("#gridDiv").jsGrid("option", "data");
	var checkedList = [];
	var isEdit = false;
	
	
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
		item["menuSeq"] = (i+1);
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
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 31.
 * @최종변경일: 
 * @매개변수:  arr, old_index, new_index
 * @반환값: any
 * @개정이력: 
 *  장창환 2020. 12. 31. 최초작성
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