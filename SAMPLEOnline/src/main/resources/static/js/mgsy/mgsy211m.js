/**
 * @시스템명: IFRS17
 * @업무명: 시스템권한관리
 * @설명: 권한을 관리하는 화면의 JS
 * @최초작성자: 61000255 (권세림)
 * @최초작성일: 2021.01.12
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  권세림 2021.01.12  최초작성
 *  권세림 2021.06.15 3차 소스표준화
 */

var selectedTreeRoleId; // tree의 선택한 roleId
var selectedAuthGrpId; 
var roleGrideType ="";
var clickIndex ;	//그리드에서 선택 object

$(document).ready(function() {
	//view 초기화
	initView();
	// event 초기화
	initEvent();

	// 그리드 초기화
	initRoleGrid();
	hideRoleInfoTable();

	selectRoleList();
	roleGrideType = "role";
});

function initView(){
	/*2021.05.03 툴팁 추가*/
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");		
    
    //버튼 권한 처리 2021.06.14
    $.fn.setBtnPermission([{"btnId":"#btn_save","type":"B"}])			//저징버튼
}

function initEvent() {
	setTabSelectedAction();
	// 그리드 행추가
	$("#btn_addGrid_Role").on("click", function(e) {
		addGridData();
	});

	// 저장
	$("#btn_save").on("click", function(e) {
		saveGridDataAll();
	});

	// 순서변경 위로
	$("#btn_moveUp").on("click", function(e) {
		moveGridRow(false);
	});

	// 순서변경 아래로
	$("#btn_moveDown").on("click", function(e) {
		moveGridRow(true);
	});
	// 역할별사용자
	$("#tab_role_by_user").on("click", function(e) {
		selectUserByRoleList();
		setRoleUserGrid();
		roleGrideType="user";
	});
	// 화면별별사용자
	$("#tab_role_menu_by_roleList").on("click", function(e) {
		selectMenuByRoleList();
		setMenuByRoleListGrid();
		roleGrideType="menuByRole";
	});
	// 자동부여조건
	$("#tab_role_by_rule_setting").on("click", function(e) {
		selectRoleByRuleSettingList();
		setRoleByRuleSettingListGrid();
		roleGrideType="roleByRuleSetting";
	});
}

function initRoleGrid() {
	// jsGrid 빈 테이블 생성
	$("#roleGrid").jsGrid("destroy");	
	
	var gridObject = new ComJsGrid({
		id : "roleGrid",
		height : 450,
		editing : true,
		sorting : false,
		paging : false,
		selectHiglight : true,
		deleteConfirm : "삭제하시겠습니까?",
		controller : {
			updateItem : function(item) { // Edit모드에서 적용 아이콘 또는 updateItem
											// API를 이용시 진입
				// debugger;
				var status = 'u'; // 수정
				if (item.status == 'c') { // 신규는 c상태 유지 후 데이터 수정
				} else if (item.status == 'dd') { // 삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { // grid 삭제 아이콘 클릭 또는 deleteItem
											// API이용시 진입
				// deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = 'dd'; // 삭제 신청
				// debugger;
				if (item.status == 'c') { // 신규 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else { // u,d 는 삭제 상태로 처리 -> updateItem에서 최종 삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#roleGrid").jsGrid("updateItem", item);
					return item;
				}
			}
		},
		onItemEditing : function(args) { // Grid Edit모드 진입시 처리
			// debugger;
			// 체크박스는 Edit 모드 취소
			var targetElem = (event) ? event.srcElement || null : null;
			if (targetElem) {
				if (targetElem.outerHTML.indexOf("check") > 0) {
					args.cancel = true;
				}
			}

			// delete 상태 스킵
			if (args.item.status == 'd') {
				args.cancel = true;
			}
		},
		fields : [
				{name : "authGrpSeq",title : "순번",css : "cell",type : "text",width : 30,editing : false,align : "center",},
				{name : "authGrpTypCd",title : "역할유형",css : "cell",type : "text",width : 50,align : "center",editing : false,itemTemplate : function(value, item) {
					return getAuthGrpTypCdeValue(value);
				}},
				{name : "authGrpId",title : "역할ID",css : "cell",type : "text",width : 40,align : "center",editing : false,itemTemplate : function(value, item) {
						return "<authGrpId>" + value + "</authGrpId>";
					},
				}, {name : "authGrpNm",title : "역할명",css : "cell",type : "text",width : 60,align : "center",editing : true,
					editTemplate : function(value, item) {
						var $result = jsGrid.fields.text.prototype.editTemplate
								.call(this, value, item);
						$result.on("keydown", function(e){
							if(e.which === 13){
								$("#roleGrid").jsGrid("updateItem");
								return false;
							}
						});

						$result.attr("maxlength","50");

						return $result;
					},
					// 최대 150Byte 제한(한글 기준 50글자 제한)
					validate : {
						validator : "rangeLength",
						param : [ 1, 50 ],
						message : "[역할명] 1~50글자를 넣어주세요."
					},
				}, {name : "authGrpExpln",title : "역할설명",css : "cell",type : "text",width : 120,align : "center",editing : true,
					editTemplate : function(value, item) {
						var $result = jsGrid.fields.text.prototype.editTemplate
								.call(this, value, item);
						$result.on("keydown", function(e){
							if(e.which === 13){
								$("#roleGrid").jsGrid("updateItem");
								return false;
							}
						});
						return $result;
					},
				},
				{name : "regDtm",title : "등록일자",css : "cell",type : "text",width : 70,align : "center",editing : false,itemTemplate : function(value, item) {
						return $.fn.dateFormat(value, "-");
					}
				}, {name : "trtDtm",title : "처리일자",css : "cell",type : "text",width : 70,align : "center",editing : false,
					itemTemplate : function(value, item) {
						return $.fn.dateFormat(value, "-");
					}
				},
				{name : "status",title : "상태",css : "cell",type : "text",width : 30,align : "center",editing : false,itemTemplate : function(value, item) {
					return $.fn.getGridRowStatusName(value);
				}
				}, {name : "gridManupulate",title : "그리드조작",css : "cell",type : "control",width : 70,align : "left",editing : true
				} ]
	});

	gridObject.rowClick(function(args) {
		clickIndex = args.itemIndex;
	});	
	
	// 그리드 생성
	gridObject.gridCreate();
}

function getAuthGrpTypCdeValue(value){
	if(value == "1"){
		return "그룹";
	}else if(value == "2"){
		return "역할";
	}else{
		$.fn.msgBox("처리 중 오류가 발생했습니다.");
		return;
	}
}

//탭셀렉트 리스너
function setTabSelectedAction(){
	  $(".tabs > li ").click(function() {
		$(".tabs li:first").addClass("active").show();
		$(".tabs li").click(function() {
			$(".tabs li").removeClass("active");
			$(this).addClass("active");
			var activeTab = $(this).find("a").attr("href");
			return false;
		});

	});
}

//역할그룹 선택시 역할정보테이블 숨김처리
function hideRoleInfoTable() {
	$("#role_info_div").hide();
	$("#btn_moveUp").show();
	$("#btn_moveDown").show();
}

//역할선택시 역할정보테이블 보임
function showRoleInfoTable(roleObj) {
	var authGrpId = roleObj.authGrpId;
	var authGrpNm = roleObj.authGrpNm;
	var authGrpExpln = roleObj.authGrpExpln;
	var regDtm = $.fn.dateFormat(roleObj.regDtm, "-");
	var trtDtm = $.fn.dateFormat(roleObj.trtDtm, "-");

	$("#role_info_div").show();

	$("#td_role_id")[0].innerText = authGrpId
	$("#td_role_name")[0].innerText = authGrpNm
	$("#td_role_decs")[0].innerText = authGrpExpln
	$("#td_role_regdtm")[0].innerText = regDtm
	$("#td_role_trtDtm")[0].innerText = trtDtm

	$("#btn_moveUp").hide();
	$("#btn_moveDown").hide();

}

var roleMap = {}; // id, {}
function makeRoleTree(roleList) {
	var depthList = []; // depth, []
	roleMap = {};
	for (var i = 0; i < roleList.length; i++) {
		var roleObj = roleList[i];
		var depth = Number(roleObj.authGrpLvl);
		var tempList = depthList[depth] || [];
		tempList.push(roleObj);
		depthList[depth] = tempList;
		roleMap[roleObj.authGrpId] = roleObj;
	}

	for (var i = depthList.length - 1; i > 0; i--) {
		var subList = depthList[i];
		for (var j = 0; j < subList.length; j++) {
			var authGrpId = subList[j].authGrpId;
			var roleObj = roleMap[authGrpId];
			var parentRole = roleMap[roleObj.uppAuthGrpId];
			if (parentRole) {
				var children = parentRole.children || [];
				children.push(roleObj);
				parentRole.children = children;
				delete roleMap[authGrpId];
			} else {
				console.log(roleObj.uppAuthGrpId + "does not exist!");
				break;
			}
		}
	}
	return roleMap;
}

/**
 * 
 * @설명: roleId로 roleObject를 얻어온다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일:
 * @매개변수: searchId 역할ID
 * @반환값: roleObj
 * @개정이력: 장창환 2020. 12. 29. 최초작성
 * 
 */
function getRoleObj(searchId) {
	for ( var key in roleMap) {
		var roleObj = roleMap[key];
		var authGrpId = roleObj.authGrpId;
		if (authGrpId == searchId) {
			return roleObj;
		} else {
			return _searchChildRole(searchId, roleObj);
		}
	}
}

/**
 * 
 * @설명: roleId로 children을 검색한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일:
 * @매개변수: searchId 역할ID
 * @반환값: roleObj
 * @개정이력: 장창환 2020. 12. 29. 최초작성
 * 
 */
function _searchChildRole(searchId, targetObj) {
	var children = targetObj.children;
	if (!children || children.length == 0)
		return;
	for (var i = 0; i < children.length; i++) {
		var roleObj = children[i];
		var authGrpId = roleObj.authGrpId;
		if (authGrpId == searchId) {
			return roleObj;
		}
		var retRoleObj = _searchChildRole(searchId, roleObj);
		if (retRoleObj)
			return retRoleObj;
	}
}

/**
 * 
 * @설명: 트리를 생성한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일:
 * @매개변수: roleList
 * @반환값: void
 * @개정이력: 장창환 2020. 12. 29. 최초작성
 * 
 */
function renderTreeView(roleList) {
	// remove role;
	console.log("roleGrideType   :    " + roleGrideType);
	$("#treeRoleDiv").children().remove();

	var treeObj = makeRoleTree(roleList);

	var treeElement = document.createElement("div");
	treeElement.setAttribute("class", "tree_wrap");

	var key = Object.keys(treeObj)[0];
	var firstRoleObj = treeObj[key];
	var firstElement = _makeTreeElement(firstRoleObj);
	treeElement.appendChild(firstElement);

	_appendTreeChild(firstRoleObj, treeElement);

	// console.log(treeElement.innerHTML);
	var treeRoleElement = document.getElementById("treeRoleDiv");
	treeRoleElement.appendChild(treeElement);

	// add Event
	$(".tree_main").click(function() {
		var authGrpId = $(this)[0].getAttribute("authGrpId");
		var roleObj = getRoleObj(authGrpId);
		roleGrideType="role";
		selectRoleListByUppRoleId(roleObj);
		initRoleGrid();
		hideRoleInfoTable();
	});

	$(".tree_dep1 > a").click(function() {
		var authGrpId = $(this)[0].getAttribute("authGrpId");
		var roleObj = getRoleObj(authGrpId);
		if (roleObj && roleObj.authGrpTypCd == "1") {
			$("ul.tree_dep2").slideUp();
			$(this).parents().find(".tree_dep1 > a").removeClass('active');
			if ($(this).parent().find("+ul").is(":hidden")) {
				$(this).parent().find("+ul").slideDown();
				$("#tree_dep1 > a").removeClass('active');
				$(this).addClass('active');
			}
			roleGrideType="role";
			selectRoleListByUppRoleId(roleObj);
			initRoleGrid();
			hideRoleInfoTable();
		}
	});

	$(".tree_dep2 > a").click(function() {
		var authGrpId = $(this)[0].getAttribute("authGrpId");
		var roleObj = getRoleObj(authGrpId);
		selectedAuthGrpId = roleObj.authGrpId;
		showRoleInfoTable(roleObj);
		selectRoleByRuleSettingList();
		setRoleByRuleSettingListGrid();
		roleGrideType="roleByRuleSetting";
		$("#tab_role_by_rule_setting").click();
	});
	if (selectedTreeRoleId) {
		selectTree(selectedTreeRoleId);
	}
	
	$(".tree_main").click();
}

/**
 * 트리메뉴 Child Element 생성
 * 
 * @설명:
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일:
 * @매개변수:
 * @반환값: any
 * @개정이력: 장창환 2020. 12. 29. 최초작성
 * 
 */
function _appendTreeChild(roleObj, targetElement) {
	var depth = roleObj.authGrpLvl;
	var roleList = roleObj.children;
	if (!roleList || roleList.length == 0) {
		return;
	}
	var ulElement = document.createElement("ul");
	ulElement.setAttribute("class", "tree_dep" + (Number(depth) + 1));

	for (var i = 0; i < roleList.length; i++) {
		var roleObj = roleList[i];
		var liElement = _makeTreeElement(roleObj);
		ulElement.appendChild(liElement);
		_appendTreeChild(roleObj, liElement);
	}
	targetElement.appendChild(ulElement);
}

/**
 * 트리메뉴 Element 생성
 * 
 * @설명:
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일:
 * @매개변수:
 * @반환값: any
 * @개정이력: 장창환 2020. 12. 29. 최초작성
 * 
 */
function _makeTreeElement(roleObj) {
	var depth = roleObj.authGrpLvl;
	var authGrpId = roleObj.authGrpId;
	var authGrpNm = roleObj.authGrpNm;
	var authGrpTypCd = roleObj.authGrpTypCd; // 1:그룹, 2:역할
	if (depth == "0") {
		var firstElement = document.createElement("p");
		firstElement.setAttribute("authGrpId", authGrpId);
		firstElement.setAttribute("class", "tree_main");
		var iElement = document.createElement("i");
		iElement.setAttribute("class", "xi-home xi-x");
		firstElement.innerHTML = iElement.outerHTML + roleObj.authGrpNm;
		return firstElement;
	} else {
		var lElement = document.createElement("li");
		var pElement = document.createElement("p");
		var className = "tree_dep" + depth;
		if (authGrpTypCd == 2) {
			className += " notree";
		}
		pElement.setAttribute("class", className);
		var aElement = document.createElement("a");
		aElement.setAttribute("href", "javascript:void(0);");
		aElement.setAttribute("authGrpId", authGrpId);
		aElement.innerText = authGrpNm;
		pElement.appendChild(aElement);
		lElement.appendChild(pElement);
		return lElement;
	}
}

function selectTree(authGrpId) {
	var roleObj = getRoleObj(authGrpId);
	var parentId = roleObj.uppAuthGrpId;
	var list = $(".tree_dep1 > a");
	for (var i = 0; i < list.length; i++) {
		var elem = list[i];
		var elemRoleId = elem.getAttribute("authGrpId");
		if (parentId == elemRoleId || authGrpId == elemRoleId) {
			elem.click();
		}
	}
	list = $(".tree_dep2 > a");
	for (var i = 0; i < list.length; i++) {
		var elem = list[i];
		var elemRoleId = elem.getAttribute("authGrpId");
		if (parentId == elemRoleId || authGrpId == elemRoleId) {
			elem.click();
		}
	}
}

function getGridStatusName(value) {
	if (value == 'c') {
		return "신규";
	} else if (value == 'u') {
		return "수정";
	} else if (value == 'd') {
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
 * @개정이력: 89001203 2020. 12. 31. 최초작성
 * 
 */
function saveGridDataAll() {
	// 전체 데이터
	var gridData = $("#roleGrid").jsGrid("option", "data");
	var editRowClass = $("#roleGrid").jsGrid("option", "editRowClass");
	if($("." + editRowClass).length > 0) {
		$("#roleGrid").jsGrid("updateItem");
	}
	
	var saveList = [];
	// c,u,d 건만 추출 후 저장 처리
	for (var i = 0; i < gridData.length; i++) {
		var item = gridData[i];
		if (!isValid(i, item)) {
			return;
		}
		if (item.status == 'c') {
			saveList.push(item);
		} else if (item.status == 'u') {
			saveList.push(item);
		} else if (item.status == 'd') {
			if(roleGrideType == 'role'){
				setSeq();
			}
			saveList.push(item);
		}
	}
	$.fn.msgBox("저장하시겠습니까?", function(obj) {
		if(obj.btn_ok) {
			switch (roleGrideType){
			case "role":
				$.callAjax({"list" : JSON.stringify(saveList)}, "/mg/sy/mgsy211m/saveRoleList.do").done(function(data) {
					if (data.result == "1") {
						$.fn.msgBox("정상적으로 처리되었습니다.");
						selectRoleList();
					}
				}).fail(function(data) {
				});
				break;
			case "user" :
				$.callAjax({"list" : JSON.stringify(saveList)}, "/mg/sy/mgsy211m/saveUserByRoleList.do").done(function(data) {
					if (data.result == "1") {
						$.fn.msgBox("정상적으로 처리되었습니다.");
						selectUserByRoleList();
					}
				}).fail(function(data) {
				});
				break;
			case "menuByRole" :
				$.callAjax({"list" : JSON.stringify(saveList)}, "/mg/sy/mgsy211m/saveMenuByRoleList.do").done(function(data) {
					if (data.result == "1") {
						$.fn.msgBox("정상적으로 처리되었습니다.");
						selectMenuByRoleList();
					}
				}).fail(function(data) {
				});
				break;
			case "roleByRuleSetting" :
				$.callAjax({"list" : JSON.stringify(saveList)}, "/mg/sy/mgsy211m/saveRoleByRuleSettingList.do").done(function(data) {
					if (data.result == "1") {
						$.fn.msgBox("정상적으로 처리되었습니다.");
						selectRoleByRuleSettingList();
					}
				}).fail(function(data) {
				});
				break;
				default :
					$.fn.msgBox("처리 중 오류가 발생했습니다.");
				break;
					
			}
		}
	}, 2);
	
}

function setAuthGrpTypCd(uppAuthGrpId){
	if(uppAuthGrpId.length == 2){
		return "1";
	}else if(uppAuthGrpId.length == 5){
		return "2";		
	}else{
		$.fn.msgBox("처리 중 오류가 발생했습니다.");
		return;
	}
}
function setAuthGrpId(uppAuthGrpId, seq) {
	var authId = "688";
	var resultSeq = "";
	var result = "";
	var seqToString = String(seq);
	
	if(seqToString.length == 1){
		resultSeq = "0" + seqToString;
		console.log("seq.length == 1 resultSeq   :   ", resultSeq);
	}else{
		resultSeq = seqToString;
		console.log(" resultSeq   :   ", resultSeq);
	}

	if (uppAuthGrpId.length == 2) {
		result = authId + resultSeq;
		return result;
	} else if (uppAuthGrpId.length == 5) {
		result = uppAuthGrpId + resultSeq;
		return result;
	}else{
		$.fn.msgBox("처리 중 오류가 발생했습니다.");
		return;
	}
}
/**
* 
* @설명: 그리드 추가
* @최초작성자: 61000255
* @최초작성일: 2021. 01. 26.
* @최종변경일:
* @매개변수:
* @반환값: 
* @개정이력: 61000255 2021. 01. 26. 최초작성
* 
*/
function addGridData() {
	if (!selectedTreeRoleId) {
		alert("Tree 항목을 선택 후 진행하세요.");
		return;
	}
	var parentRoleObj = getRoleObj(selectedTreeRoleId);
	var dataList = $("#roleGrid").jsGrid("option", "data");
	var seq = dataList.length + 1;
	
	switch (roleGrideType) {
	case "role":
		var authGrpLvl = (Number(parentRoleObj.authGrpLvl) + 1);
//		console.log("authGrpLvl   :   "+ authGrpLvl);
		var uppAuthGrpId = parentRoleObj.authGrpId;
		// status컬럼은 그리드 상태 핸들링 하기 위함.(c:신규, u:수정, d:삭제)
		$("#roleGrid").jsGrid("insertItem", {
			"status" : "c",
			"authGrpSeq" : seq,
			"authGrpTypCd" : setAuthGrpTypCd(uppAuthGrpId),
			"uppAuthGrpId" : uppAuthGrpId,
			"authGrpLvl" :  authGrpLvl+ "",
			"authGrpId" : setAuthGrpId(uppAuthGrpId,seq),
			"authGrpNm" : "",
			"authGrpExpln" : "",
			"regDtm" : "",
			"trtDtm" : ""
		});
		break;
	case "user":
		$("#roleGrid").jsGrid("insertItem", {
			"status" : "c",
			"rowNum" : seq,
			"authRolId" : selectedAuthGrpId,
			"userEno" : "",
			"userId" : "",
			"userNm" : "",
			"mdfcPsbYn" : "N",
			"regDtm" : "",
			"trtDtm" : ""
		});
		break;
	case "menuByRole":
		$("#roleGrid").jsGrid("insertItem", {
			"rowNum" : seq,
		  	"authRolId" : selectedAuthGrpId,
			"status" : "c",
			"menuId" : "",
			"menuNm" : "",
			"mdfcPsbYn" : "Y",
			"regDtm" : "",
			"trtDtm" : ""
		});
		break;
	case "roleByRuleSetting":
		$("#roleGrid").jsGrid("insertItem", {
			"status" : "c",
			"authRolId" : selectedAuthGrpId,
			"rowNum" : seq,
			"orgNo" : "",
			"orgNm" : "",
			"regDtm" : "",
			"trtDtm" : ""
		});
		break;
	default :
		$.fn.msgBox("처리 중 오류가 발생했습니다.");
	break;
	}
}

function setSeq(){
	var gridData = $("#roleGrid").jsGrid("option", "data");
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
		item["authGrpSeq"] = (i + 1);
		if (item.status != 'c' && item.status !='d') {
			item["status"] = "u";
	}
		newList.push(item);
		
	}
	$("#roleGrid").jsGrid("loadData", newList).done(function() {
	});
}
function isValid(rowIndex, item) {
	switch (roleGrideType){
		case "role":
			if (item.authGrpId.trim() == "") {
				$.fn.msgBox(rowIndex +1+ "행의 역할ID를 입력하세요.");
				return false;
			}
			if (item.authGrpNm.trim() == "") {
				$.fn.msgBox(rowIndex+1 + "행의 역할명을 입력하세요.");
				return false;
			}
			return true;	
			break;
		case "user" :
			if (item.userEno.trim() == "") {
				$.fn.msgBox(rowIndex +1+ "행의 사원번호를 입력하세요.");
				return false;
			}
			return true;	
			break;
		case "menuByRole" :
			if (item.menuId.trim() == "") {
				$.fn.msgBox(rowIndex +1+ "행의  화면ID를 입력하세요.");
				return false;
			}
			return true;	
			break;
		case "roleByRuleSetting" :
			if (item.orgNo.trim() == "") {
				$.fn.msgBox(rowIndex +1+ "행의 조직코드를 입력하세요.");
				return false;
			}
			return true;	
			break;
		default :
			$.fn.msgBox("처리 중 오류가 발생했습니다.");
		return false;
		break;
	}
}

/**
* 
* @설명: 클릭한 그리드의 행을 이동한다
* @최초작성자: 61000255
* @최초작성일: 2021. 01. 26.
* @최종변경일:
* @매개변수:
* @반환값: 
* @개정이력: 61000255 2021. 01. 26. 최초작성
* 
*/
function moveGridRow(isDown) {
	var gridData = $("#roleGrid").jsGrid("option", "data");
	var checkedList = [];
	var isEdit = false;
	
	console.log("clickIndex", clickIndex);
	
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
		item["authGrpSeq"] = (i+1);
		if(item.status != 'c') {
			item["status"] = "u";
		}
		newList.push(item);
	}
	$("#roleGrid").jsGrid("loadData", newList).done(function() {
		console.log("newFocusIndex = " + newFocusIndex);
		var $trEl = $("#roleGrid div.jsgrid-grid-body tr").eq(newFocusIndex);
		
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
 * 
 * @설명:
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 31.
 * @최종변경일:
 * @매개변수: arr, old_index, new_index
 * @반환값: any
 * @개정이력: 장창환 2020. 12. 31. 최초작성
 * 
 */
function array_move(arr, old_index, new_index) {
	if (new_index >= arr.length) {
		var k = new_index - arr.length + 1;
		while (k--) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr;
}

var rowItem = null;
function callUserSearchPopup(item){
	rowItem = item;
	var popupOption = {
			url: "/mg/sy/mgsy211p.do",
			name: "사원번호조회팝업",
			width: 800,
			height: 464
	}
	var popup = $.fn.openPopup(popupOption);
}

/**
* 
* @설명: 팜업 콜백
* @최초작성자: 61000255
* @최초작성일: 2021. 01. 26.
* @최종변경일:
* @매개변수: selectedObj
* @반환값: 
* @개정이력: 61000255 2021. 01. 26. 최초작성
* 
*/
function resultUserPopup_callback(selectedObj){
	console.log("resultTablePopup_callback   resultObj", selectedObj);
	
	if(typeof rowItem === "undefined" || rowItem == null) return;
	
	selectedObj.rowNum = rowItem.rowNum;
	selectedObj.regDtm = "";
	
	var newRowItem = $.extend({}, rowItem, selectedObj);
	$("#roleGrid").jsGrid("updateItem", rowItem, newRowItem);
} 

function selectRoleList() {
	console.log("selectRoleList");

	var reqParam = {};
	// example 조회 서비스 AJAX호출 후 그리드 바인딩
	// param 조건에 맞게 select한 데이터 가져옴
	$.callAjax(reqParam, "/mg/sy/mgsy211m/selectRoleList.do").done(
			function(data) {
				renderTreeView(data.list);
			}).fail(function(data) {
	});
}

function selectRoleListByUppRoleId(roleObj) {
//	console.log("selectRoleListByUppRoleId");
	console.log("roleGrideType   :    " + roleGrideType);
	selectedTreeRoleId = roleObj.authGrpId;
	var authGrpLvl = roleObj.authGrpLvl;
	var roleNm = roleObj.authGrpNm;

	var reqParam = {
		"authGrpId" : roleObj.authGrpId
	}

	// param 조건에 맞게 select한 데이터 가져옴
	$.callAjax(reqParam, "/mg/sy/mgsy211m/selectRoleListByUppRoleId.do").done(
			function(data) {
			    $("#roleGrid").jsGrid("reset");	
				// $("#gridTitle")[0].innerText = "역할 정보[" + authGrpLvl + "level] -
				// " + roleNm;
				var listData = data.list; // 서버로 받아온 데이터 리스트
				// 그리드 바인딩
				$("#roleGrid").jsGrid("loadData", listData).done(function() {
				});
				 // --------------------------------------------------					
		           // 0건 그리드 메세지 처리 부분					
		           // --------------------------------------------------					
				if (listData.length == 0) {
					$.fn.getReturnValue("roleGrid");
				}
			}).fail(function(data) {
				console.log("fail to selectRoleListByUppRoleId");
	});
}
//역할별 사용자 그리드를 그린다
function setRoleUserGrid() {
	console.log("setRoleUserGrid!!!")
	$("#roleGrid").jsGrid("destroy");	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id : "roleGrid",
		height : 450,
		editing : true,
		sorting : false,
		paging : false,
		selectHiglight : false,
		deleteConfirm : "삭제하시겠습니까?",
		controller : {
			updateItem : function(item) { // Edit모드에서 적용 아이콘 또는 updateItem
											// API를 이용시 진입
				// debugger;
				var status = 'u'; // 수정
				if (item.status == 'c') { // 신규는 c상태 유지 후 데이터 수정
				} else if (item.status == 'dd') { // 삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { // grid 삭제 아이콘 클릭 또는 deleteItem
											// API이용시 진입
				// deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = 'dd'; // 삭제 신청
				// debugger;
				if (item.status == 'c') { // 신규 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else { // u,d 는 삭제 상태로 처리 -> updateItem에서 최종 삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#roleGrid").jsGrid("updateItem", item);
					return item;
				}
			}
		},
		onItemEditing : function(args) { // Grid Edit모드 진입시 처리
			// debugger;
			// 체크박스는 Edit 모드 취소
			var targetElem = (event) ? event.srcElement || null : null;
			if (targetElem) {
				if (targetElem.outerHTML.indexOf("check") > 0) {
					args.cancel = true;
				}
			}
			// delete 상태 스킵
			if (args.item.status == 'd') {
				args.cancel = true;
			}
		},
		fields : [
				{name : "rowNum",title : "순번",css : "cell",type : "text",width : 30,editing : false,align : "center"
				},
				{name : "userEno",title : "사원번호",css : "cell",type : "text",width : 70,align : "left",editing : false,
					itemTemplate : function(value, item) {
						if(item.status =="c") {
							var $pEl = $("<p>").addClass("fl line-height20").text(value)
							var $pEl2 = $("<p>").addClass("fr");
							var $aEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
								// 사원번호 조회팝업호출
								callUserSearchPopup(item);
							});
							var img = $("<img>").attr("src","/img/btn_icon_search.png;")
							$aEl.append(img);
							return $("<div>").append($pEl).append($pEl2.append($aEl));
						} else {
							return value;
						}
						
					},
					validate:{validator:"rangeLength", param:[0,1],
					  	  message : "[사원번호] 사원번호를 입력해주세요."
				}
				}, {name : "userNm",title : "성명",css : "cell",type : "text",width : 70,align : "center",editing : false,
				}, {name : "orgNm",title : "소속",css : "cell",type : "text",width : 70,align : "center",editing : false,
				},{name : "regDtm",title : "등록일자",css : "cell",type : "text",width : 70,align : "center",editing : false,
					itemTemplate : function(value, item) {
						return $.fn.dateFormat(value, "-");
					}
				}, 
				{name : "mdfcPsbYn",title : "수정가능여부",css : "cell",type : "select",width : 35,align : "center",
					// Enter 키 입력시 updateItem apply됨.
					editTemplate : function(value) {
						var $result = jsGrid.fields.select.prototype.editTemplate
								.call(this, value);
						$result.on("keydown", function(e) {
							if (e.which === 13) {
								$("#roleGrid").jsGrid("updateItem");
								return false;
							}
						});
						return $result;
					},
					items : [ {
						Name : "Y",
						Id : "Y"
					}, {
						Name : "N",
						Id : "N"
					} ],
					textField : 'Name',
					valueField : 'Id',
				},
				{name : "status",title : "상태",css : "cell",type : "text",width : 30,align : "center",editing : false,itemTemplate : function(value, item) {
					return $.fn.getGridRowStatusName(value);
				}
				}, {name : "gridManupulate",title : "그리드조작",css : "cell",type : "control",width : 70,align : "left",editButton : false
				} ]
	});
	// 그리드 생성
	gridObject.gridCreate();
}

function selectUserByRoleList() {
//	console.log("selectRoleUserList");
	var reqParam = {
		"authGrpId" : selectedAuthGrpId
	};
	// example 조회 서비스 AJAX호출 후 그리드 바인딩
	// param 조건에 맞게 select한 데이터 가져옴
	$.callAjax(reqParam, "/mg/sy/mgsy211m/selectUserByRoleList.do").done(
			function(data) {
			    $("#roleGrid").jsGrid("reset");	
				var listData = data.list; // 서버로 받아온 데이터 리스트
				// 그리드 바인딩
				$("#roleGrid").jsGrid("loadData", listData).done(function() {
				});
				 // --------------------------------------------------					
		           // 0건 그리드 메세지 처리 부분					
		           // --------------------------------------------------					
				if (listData.length == 0) {
					$.fn.getReturnValue("roleGrid");
				}
			}).fail(function(data) {
	});
}

//역할별 화면 그리드를 그린다
function setMenuByRoleListGrid() {
	$("#roleGrid").jsGrid("destroy");	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id : "roleGrid",
		height : 450,
		editing : true,
		sorting : false,
		paging : false,
		selectHiglight : false,
		deleteConfirm : "삭제하시겠습니까?",
		controller : {
			updateItem : function(item) { // Edit모드에서 적용 아이콘 또는 updateItem
											// API를 이용시 진입
				// debugger;
				var status = 'u'; // 수정
				if (item.status == 'c') { // 신규는 c상태 유지 후 데이터 수정
				} else if (item.status == 'dd') { // 삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { // grid 삭제 아이콘 클릭 또는 deleteItem
											// API이용시 진입
				// deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = 'dd'; // 삭제 신청
				// debugger;
				if (item.status == 'c') { // 신규 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else { // u,d 는 삭제 상태로 처리 -> updateItem에서 최종 삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#roleGrid").jsGrid("updateItem", item);
					return item;
				}
			}
		},
		onItemEditing : function(args) { // Grid Edit모드 진입시 처리
			// debugger;
			// 체크박스는 Edit 모드 취소
			var targetElem = (event) ? event.srcElement || null : null;
			if (targetElem) {
				if (targetElem.outerHTML.indexOf("check") > 0) {
					args.cancel = true;
				}
			}
			// delete 상태 스킵
			if (args.item.status == 'd') {
				args.cancel = true;
			}
		},
		fields : [
				{name : "rowNum",title : "순번",css : "cell",type : "text",width : 30,editing : false,align : "center"
				},
				{name : "menuId",title : "화면ID",css : "cell",type : "text",width : 70,align : "left",editing : false,
					itemTemplate : function(value, item) {
						if(item.status =="c") {
						var $pEl = $("<p>").addClass("fl line-height20").text(value)
						var $pEl2 = $("<p>").addClass("fr");
						var $aEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
							callUserSearchPopup(item);
						});
						var img = $("<img>").attr("src","/img/btn_icon_search.png;")
						$aEl.append(img);
						return $("<div>").append($pEl).append($pEl2.append($aEl));
					}else{
						return value;
					}},
					validate:{validator:"rangeLength", param:[0,1],
						  	  message : "[화면ID] 화면ID 입력해주세요."
					}
				}, {name : "menuNm",title : "화면명",css : "cell",type : "text",width : 70,align : "center",editing : false,
				}, {name : "regDtm",title : "등록일자",css : "cell",type : "text",width : 70,align : "center",editing : false,
					itemTemplate : function(value, item) {
						return $.fn.dateFormat(value, "-");
					}
				}, {name : "status",title : "상태",css : "cell",type : "text",width : 30,align : "center",editing : false,itemTemplate : function(value, item) {
					return $.fn.getGridRowStatusName(value);
				}
				}, {name : "gridManupulate",title : "그리드조작",css : "cell",type : "control",width : 70,align : "left",editButton : false
				}]
	});
	// 그리드 생성
	gridObject.gridCreate();
	
}
function selectMenuByRoleList() {
//	console.log("selectMenuByRoleList");
	var reqParam = {
		"authGrpId" : selectedAuthGrpId
	};
	// example 조회 서비스 AJAX호출 후 그리드 바인딩
	// param 조건에 맞게 select한 데이터 가져옴
	$.callAjax(reqParam, "/mg/sy/mgsy211m/selectMenuByRoleList.do").done(
			function(data) {
			    $("#roleGrid").jsGrid("reset");	
				var listData = data.list; // 서버로 받아온 데이터 리스트
				// 그리드 바인딩
				$("#roleGrid").jsGrid("loadData", listData).done(function() {
				});
				// --------------------------------------------------					
		           // 0건 그리드 메세지 처리 부분					
		           // --------------------------------------------------					
				if (listData.length == 0) {
					$.fn.getReturnValue("roleGrid");
				}
			}).fail(function(data) {
	});
	
}

//자동부여 조건 그리드를 그린다
function setRoleByRuleSettingListGrid() {
	$("#roleGrid").jsGrid("destroy");	
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id : "roleGrid",
		height : 450,
		editing : true,
		sorting : false,
		paging : false,
		selectHiglight : false,
		deleteConfirm : "삭제하시겠습니까?",
		controller : {
			updateItem : function(item) { // Edit모드에서 적용 아이콘 또는 updateItem
											// API를 이용시 진입
				// debugger;
				var status = 'u'; // 수정
				if (item.status == 'c') { // 신규는 c상태 유지 후 데이터 수정
				} else if (item.status == 'dd') { // 삭제신청으로 요청되면 '삭제'로 최정 변경처리
					item.status = 'd';
				} else {
					item.status = status;
				}
				return item;
			},
			deleteItem : function(item) { // grid 삭제 아이콘 클릭 또는 deleteItem
											// API이용시 진입
				// deleteItem에서 dd로 -> updateItem에서 최종 d상태가 됨.
				var status = 'dd'; // 삭제 신청
				// debugger;
				if (item.status == 'c') { // 신규 입력대상건으로 그리드만 삭제처리
					jsGridDeletionFailed = false;
				} else { // u,d 는 삭제 상태로 처리 -> updateItem에서 최종 삭제대기가 됨.
					jsGridDeletionFailed = true;
					item.status = status;
					$("#roleGrid").jsGrid("updateItem", item);
					return item;
				}
			}
		},
		onItemEditing : function(args) { // Grid Edit모드 진입시 처리
			// debugger;
			// 체크박스는 Edit 모드 취소
			var targetElem = (event) ? event.srcElement || null : null;
			if (targetElem) {
				if (targetElem.outerHTML.indexOf("check") > 0) {
					args.cancel = true;
				}
			}
			// delete 상태 스킵
			if (args.item.status == 'd') {
				args.cancel = true;
			}
		},
		fields : [
				{name : "rowNum",title : "순번",css : "cell",type : "text",width : 30,editing : false,align : "center"
				},
				{name : "orgNo",title : "조직코드",css : "cell",type : "text",width : 70,align : "left",editing : false,
					itemTemplate : function(value, item) {
						if(item.status =="c") {
						var $pEl = $("<p>").addClass("fl line-height20").text(value)
						var $pEl2 = $("<p>").addClass("fr");
						var $aEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
							// 조직번호 조회팝업호출
							callUserSearchPopup(item);
						});
						var img = $("<img>").attr("src","/img/btn_icon_search.png;")
						$aEl.append(img);
						return $("<div>").append($pEl).append($pEl2.append($aEl));
					}else {
						return value;
					}},
					validate:{validator:"rangeLength", param:[0,1],
					  	  message:"[조직코드] 조직코드를 입력해주세요."
					 	}
				}, {name : "orgNm",title : "조직명",css : "cell",type : "text",width : 100,align : "center",editing : false,
				}, {name : "regDtm",title : "등록일자",css : "cell",type : "text",width : 70,align : "center",editing : false,
					itemTemplate : function(value, item) {
						return $.fn.dateFormat(value, "-");
					}
				}, {name : "status",title : "상태",css : "cell",type : "text",width : 30,align : "center",editing : false,itemTemplate : function(value, item) {
					return $.fn.getGridRowStatusName(value);
				}
				}, {name : "gridManupulate",title : "그리드조작",css : "cell",type : "control",width : 70,align : "left",editButton : false
				} ]
	});
	// 그리드 생성
	gridObject.gridCreate();
}

function selectRoleByRuleSettingList() {
	var reqParam = {
		"authGrpId" : selectedAuthGrpId
	};
	// example 조회 서비스 AJAX호출 후 그리드 바인딩
	// param 조건에 맞게 select한 데이터 가져옴
	$.callAjax(reqParam, "/mg/sy/mgsy211m/selectRoleByRuleSettingList.do").done(
			function(data) {
			    $("#roleGrid").jsGrid("reset");	
				var listData = data.list; // 서버로 받아온 데이터 리스트
				// 그리드 바인딩
				$("#roleGrid").jsGrid("loadData", listData).done(function() {
				});
				// --------------------------------------------------					
		           // 0건 그리드 메세지 처리 부분					
		           // --------------------------------------------------					
				if (listData.length == 0) {
					$.fn.getReturnValue("roleGrid");
				}
			}).fail(function(data) {
	});
}
