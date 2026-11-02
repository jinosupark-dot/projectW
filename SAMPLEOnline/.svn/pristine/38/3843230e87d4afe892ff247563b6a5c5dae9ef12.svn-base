/**
 * @시스템명: IFRS17
 * @업무명: 메인 화면
 * @설명: 로그인 성공시 뜨는 메인 화면으로 상단, 좌측, iframe으로 구성된다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @개정이력:
 *  장창환 2020. 12. 30.  최초작성
 */


var systemInfo = {};	
var selectedMenuId = "";
var selectedMenuNm = "";

/**
 * 
 * @설명: html 로딩 후 호출
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
$(document).ready(function(){
	$(".group_gnb").mCustomScrollbar();
	
	console.log("[1]initEvent");
	//event 초기화
	initEvent();
	
	console.log("[1]getSystemInfo");
	//systemInfo 조회
	getSystemInfo();
	
	console.log("[1]selectMenuList");
	//메뉴 조회
	selectMenuList();
});

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
	//로고
	$("#img_logo").on("click", function(e){
		window.top.location.href = "/main.do";
	});
	
	//logout
	$("#logout").on("click", function(e){
		logout();
	});
	
	//화면 검색 기능
	$("#lvlSearch").on("click", function(e) {
		lvlSearch();
	});
	
	//화면 검색 엔터로도 되게.
	$("#lvl_search_input").keyup(function(e){
		if(e.keyCode == 13){
			lvlSearch();
		}
	});
}

/**
 * 
 * @설명: MenuTypCd = 2(화면)에 해당하는 리스트(list)를 만든다. -> 화면 검색(list)에 사용됨
 * @최초작성자: 김동현
 * @최초작성일: 2021. 04. 09.
 * @최종변경일: 2021. 04. 09.
 * @매개변수:
 * @반환값: void
 * @개정이력: 김동현 2021. 04. 09. 최초작성
 */
/**
 * 
 */
function makeViewList(){
	viewList = [];
	var list = document.getElementById('viewDataList');
	
	for (var i = 0; i<allDataList.length; i++){
		if(allDataList[i].menuTypCd == 2){
			var option = document.createElement('option');
			option.value = allDataList[i].menuId; // menuId
			option.label = allDataList[i].menuNm; // menuNm
			
			list.appendChild(option);
			viewList.push(option.value);
		}
	}
}

/**
 * 
 * @설명: menuId에 해당하는 MENU_LVL = 1의 MENU_SEQ를 찾는다. 
 * @최초작성자: 김동현
 * @최초작성일: 2021. 04. 09.
 * @최종변경일: 2021. 04. 09.
 * @매개변수: menuId
 * @반환값: menuSeq
 * @개정이력: 김동현 2021. 04. 09. 최초작성
 */
/**
 * 
 */
function topSeqCheck(menuId){
	for (var i = 0; i<allDataList.length; i++){
		if(allDataList[i].menuId == menuId){
			
			if(allDataList[i].uppMenuId == 17){
				return allDataList[i].menuSeq - 1;
			
				break;
			}
			menuId = allDataList[i].uppMenuId;
			i= 0;
		}
	}
}

/**
 * 
 * @설명: 검색(= MENU_ID)으로 해당하는 화면으로 이동한다.
 * @최초작성자: 김동현
 * @최초작성일: 2021. 04. 09.
 * @최종변경일: 2021. 04. 09.
 * @매개변수:
 * @반환값: void
 * @개정이력: 김동현 2021. 04. 09. 최초작성
 */
/**
 * 
 */
var lvl1List = [];
var lvl2List = [];
var lvl3List = [];
var lvl4List = [];
var viewList = [];
var allDataList = [];

function lvlSearch() {
	var menuChk = false;
	var menuId = $("#lvl_search_input").val();
	//초기화
	lvl1List = [];
	lvl2List = [];
	lvl3List = [];
	lvl4List = [];
	
	for (var i = 0; i<viewList.length; i++){
		if(viewList[i] == menuId){
			menuChk = true;
		}
	}
	
	//
	//등록된 화면이면 
	if(menuChk){
		$('.top_menu_a')[topSeqCheck(menuId)].click();
		for (var i = 0; i<lvl4List.length; i++){
			if(lvl4List[i].menuId == menuId){
				// 화면(lvl4) 클릭
				$(".menu-leaf > a")[i].click();
				//입력한 화면 MENU_ID가 lvl 4인 경우
				if(lvl4List[i].menuLvl == 4 ){
					for(var j = 0; j<lvl3List.length; j++){
						if(lvl4List[i].uppMenuId == lvl3List[j].menuId){
							//lvl3메뉴 클릭
							$('#cssmenu li.has-sub1>a')[j].click();
							for (var k = 0; k <lvl2List.length; k++){
								if(lvl3List[j].uppMenuId == lvl2List[k].menuId){
									//lvl2메뉴 클릭
									$('#cssmenu li.has-sub>a')[k].click();
									break;
								}
							}
							break;
						}		
					}
				//입력한 화면 MENU_ID가 lvl 3인 경우
				}else{
					for (var k = 0; k <lvl2List.length; k++){
						if(lvl4List[i].uppMenuId == lvl2List[k].menuId){
							//lvl2메뉴 클릭
							$('#cssmenu li.has-sub>a')[k].click();
							break;
						}
					}
				}
				break;
			}
		}
	}
	//등록된 화면이 아니면
	else{
		$.fn.msgBox("등록된 화면이 아닙니다.");
		return;
	}
}

/**
 * 
 * @설명: 화면의 경로를 상단(LVL1부터 LVL4로)부터 저장, 각 화면의 tooltip에 사용됨
 * @최초작성자: 김동현
 * @최초작성일: 2021. 04. 09.
 * @최종변경일: 2021. 04. 09.
 * @매개변수:
 * @반환값: void
 * @개정이력: 김동현 2021. 04. 09. 최초작성
 */
/**
 * 
 */
var viewPath = "";
function makePath(menuId){
	
	selectedMenuNm = "";
	
	if(menuId == 17){
		//lvl1 메뉴id 까지만 
		return;
	}
	
	for(var i = 0; i <allDataList.length; i++){
		if(allDataList[i].menuId == menuId){
			menuId = allDataList[i].uppMenuId;
			makePath(menuId);
			//lvl1 -> lvl4 까지 화면명 담음
			viewPath += allDataList[i].menuNm + " -> ";
			selectedMenuNm = allDataList[i].menuNm;
		}
	}
	
	//selectedMenuNm = $.replaceAll(selectedMenuNm,"_"," ");
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
		//console.log("menuObj", menuObj);
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
				console.log(menuObj.uppMenuId + "does not exist!")
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
 * @설명: 탑메뉴를 생성한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일: 
 * @매개변수: menuList 
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 29. 최초작성
 *
 */
function renderTopMenu(menuList) {
	
	//remove menu
	$("#tnb_menu").children().remove();
	
	var treeObj = makeMenuTree(menuList);
	var key = Object.keys(treeObj)[0];
	var firstMenuObj = treeObj[key];
	var childMenuList = firstMenuObj.children;
	var menuElem = document.getElementById("tnb_menu");
	var ulElem = document.createElement("ul");
	for(var i= 0; i<childMenuList.length; i++) {
		var menuObj = childMenuList[i];
		var menuId = menuObj.menuId;
		var menuNm = menuObj.menuNm;
		var liElem = document.createElement("li");
		var aElem = document.createElement("a");
		aElem.setAttribute("href", "javascript:void(0);");
		aElem.setAttribute("menuId", menuId);
		aElem.setAttribute("class", "top_menu_a");
		var iElem = document.createElement("i");
		var clssName = "";

		if(i == 0) {
			className = "m1";
		} else if(i == 1) {
			className = "m2";
		} else if(i == 2) {
			className = "m3";
		} else if(i == 3) {
			className = "m4";
		} else if(i == 4) {
			className = "m5";
		} else if(i == 5) {
			className = "m6";
		} 
		iElem.setAttribute("class", className);
		aElem.innerHTML = iElem.outerHTML + menuNm;
		liElem.appendChild(aElem);
		ulElem.appendChild(liElem);
	}
	menuElem.appendChild(ulElem);
		
	//add Event
	//top menu
	$(".top_menu_a").click(function() {
		$(this).parents().find(".top_menu_a").removeClass('active');
		var menuId = $(this)[0].getAttribute("menuId");
		var menuObj = getMenuObj(menuId);
		$(this).addClass('active'); 
		renderLeftMenu(menuId);		
		if(menuObj.menuTypCd == '2') {	//화면 
			callMenuUrl(menuId);
		}
	});
	
	$('.top_menu_a')[0].click(); //공지사항 클릭
	
}

/**
 * 
 * @설명: 좌측 메뉴를 생성한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 29.
 * @최종변경일: 
 * @매개변수: menuList 
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 29. 최초작성
 *
 */
function renderLeftMenu(menuId) {

	//remove menu
	$("#cssmenu").children().remove();
	var menuElem = $("#cssmenu")[0];
	var menuObj = getMenuObj(menuId);
	if(menuObj.menuTypCd == '2') {	//화면
		return;
	}
	_appendLeftMenuChild(menuObj,menuElem);

	$('#cssmenu li.has-sub>a').on('click', function(){
        var element = $(this).parent('li');
        if (element.hasClass('open')) {
            element.removeClass('open');
            element.find('li').removeClass('open');
            element.find('ul').slideUp(200);
        }
        else {
            element.addClass('open');
            element.children('ul').slideDown(200);
        }
    });
    $('#cssmenu li.has-sub1>a').on('click', function(){
        $(this).removeAttr('href');
        var element = $(this).parent('li');
        if (element.hasClass('open')) {
            element.removeClass('open');
            element.find('li').removeClass('open');
            element.find('ul').slideUp(200);
        }
        else {
            element.addClass('open');
            element.children('ul').slideDown(200);
        }
    });
    $('#cssmenu li.has-sub2>a').on('click', function(){
        $(this).removeAttr('href');
        var element = $(this).parent('li');
        if (element.hasClass('open')) {
            element.removeClass('open');
            element.find('li').removeClass('open');
            element.find('ul').slideUp(200);
        }
        else {
            element.addClass('open');
            element.children('ul').slideDown(200);
        }
    });
    
    //화면 클릭
    $(".menu-leaf > a").click(function(){
    	viewPath = "";
		$(this).parents().find(".menu-leaf > a").removeClass('left_active');
    	var menuId = $(this)[0].getAttribute("menuId");
    	makePath(menuId);
    	callMenuUrl(menuId);
		$(this).addClass('left_active'); 
    });     
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
 *  김동현 2021. 04. 30. 화면 검색에 사용되는 switch문 추가
 *
 */
function _appendLeftMenuChild(menuObj, targetElement) {
	var depth = Number(menuObj.menuLvl) -1;	//CSS에 맞춤	
	var menuTypCd = menuObj.menuTypCd;	//1:메뉴, 2:화면
	
	var menuList = menuObj.children;
	
	switch(menuObj.menuLvl){
	case "1":
		lvl1List.push(menuObj);
		break;
	case "2":
		lvl2List.push(menuObj);
		break;
	case "3":
		
		//1이면 메뉴
		if(menuObj.menuTypCd == 1){
			lvl3List.push(menuObj);
			break;
		}
		//2면 화면이기 때문에 lvl4에 담음
		else if(menuObj.menuTypCd == 2){
			lvl4List.push(menuObj);
			break;
		}
		break;
	case "4":
		if(menuObj.menuTypCd ==2){
			lvl4List.push(menuObj);
			break;
		}else if(menuObj.menuTypCd == 1){
			lvl3List.push(menuObj);
			break;
		}
		break;
}
	
	if(!menuList || menuList.length == 0) {
		return;
	}
	var ulElement = document.createElement("ul");
	if(depth == 0) {
		ulElement.setAttribute("class", "dep");
	} else {
		ulElement.setAttribute("class", "dep" + depth);
	}	
	for(var i=0; i<menuList.length; i++) {
		var menuObj = menuList[i];
		var liElement = _makeLeftMenuElement(menuObj);
		if(menuObj.menuTypCd == '1') {	//메뉴인 경우만 
			if(depth == 0) {	
				liElement.setAttribute("class", "has-sub");
			} else {
				liElement.setAttribute("class", "has-sub" + depth);
			}
		} else {
			liElement.setAttribute("class", "menu-leaf");
		}
		ulElement.appendChild(liElement);
		_appendLeftMenuChild(menuObj, liElement);
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
function _makeLeftMenuElement(menuObj) {
	var menuId = menuObj.menuId;
	var menuNm = menuObj.menuNm;
	var menuTypCd = menuObj.menuTypCd;
	var lElement = document.createElement("li");
	var aElement = document.createElement("a");
	aElement.setAttribute("href", "javascript:void(0);");
	aElement.setAttribute("menuId", menuId);
	aElement.setAttribute("menuTypCd", menuTypCd);
	aElement.innerText = menuNm;
	lElement.appendChild(aElement);
	return lElement;
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
	console.log("selectMainMenuList");
	
	var reqParam = {};
	//example 조회 서비스 AJAX호출 후 그리드 바인딩
	//param 조건에 맞게 select한 데이터 가져옴
	$.callAjax(reqParam, "/main/selectMenuListByAuth.do")
//	$.callAjax(reqParam, "/common/menuJson/menu.json")
//	$.callAjax(reqParam, "/main/warnnignTest.do")
	.done(function(data) {
		
		allDataList = data.list;
		renderTopMenu(data.list);
		makeViewList();
	}).fail(function(data){
	});		
}

/**
 * 시스템 정보 조회
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
function getSystemInfo() {
	console.log("selectSystemInfo");
	
	var reqParam = {};
	$.callAjax(reqParam, "/main/selectSystemInfo.do")
	.done(function(data) {
		systemInfo = data;
		var userInfo = data.userInfo;		//사용자정보
		var menuList = data.menuList;		//메뉴정보
		var properties = data.properties;	//설정
		var message = data.message;			//통합메시지
		
		var userNm = userInfo.userNm;
		var orgNm = userInfo.orgNm;
		var loginDtm = userInfo.loginDtm;
		var preLoginDtm = userInfo.preLoginDtm;
		
		$("#userName")[0].innerHTML = orgNm + " " + userNm;
		$("#loginDateTime")[0].innerHTML = preLoginDtm;
		$("#loinControl").show();
		
		//메뉴 생성
		renderTopMenu(menuList);
		
		//설정처리
		callBackSystemInfo(properties);
		
	}).fail(function(data){
	});		
}

/**
 * 시스템 정보 조회 callBack
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
function callBackSystemInfo(egovProp) {
	var stage = "";
	if(egovProp.stage == "DEV") {
		stage = "[개발]";
	} else if(egovProp.stage == "TEST") {
		stage = "[검증]";
	}
	$("#stage")[0].innerHTML = stage;
}

/**
 * 
 * @설명: 메뉴ID에 해당하는 URL을 호출한다. 
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: menuId 메뉴ID 
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 *  김동현 2021. 04. 09. 화면명 path(viewPath) 추가 -> tooltip에 사용
 *
 */
function callMenuUrl(menuId) {
	
	if(!menuId) {
		alert("menuId가 존재하지 않습니다.");
		return;
	}
	if(menuId.length > 8) {
		alert("Menu Id 형식이 일치하지 않습니다.[" + menuId + "]\n예시)주제영역 + 세부주제영역 + 일련번호(3자리) + m or p(메인 또는 팝업)");
		return;
	}
	selectedMenuId = menuId;
	menuId = menuId.toLowerCase();
	
	selectedMenuNm = menuId == "mgsy111m" ? "공지사항" : selectedMenuNm;
	viewPath = menuId == "mgsy111m" ? "공지사항" : viewPath.substr(0, viewPath.length - 3);
	
	
	var url = "/" + menuId.substring(0, 2) + "/" + menuId.substring(2, 4) + "/"
	+ menuId + ".do";
	
	console.log("call Menu url:" + url);
	$("#content_frame")[0].src = url;
	
}



/**
 * 
 * @설명: 로그아웃 
 * @최초작성자: 장창환
 * @최초작성일: 2021. 2. 26.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: void
 * @개정이력: 
 *  장창환 2021. 2. 26. 최초작성
 *
 */
function logout() {
	var reqParam = {};
	$.callAjax(reqParam, "/admin/doLogout.do")
	.done(function(data) {
		if(data.result == '1') {
			alert("정상적으로 로그아웃 되었습니다.");
			location.href = "/admin/luserLogin.do";
		}
	}).fail(function(data){
	});		
	
}

/**
 * 로그인 사용자 정보를 반환한다.
 * @설명: 
 * @최초작성자: 장창환
 * @최초작성일: 2021. 3. 2.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: object
 * @개정이력: 
 *  장창환 2021. 3. 2. 최초작성
 *
 */
function _getLoginUserInfo() {
	if(systemInfo && systemInfo.userInfo) {
		return systemInfo.userInfo;
	} else {
		return null;
	}
}


/**
 * 로그인 사용자 정보를 반환한다.
 * @설명: 
 * @최초작성자: 장창환
 * @최초작성일: 2021. 3. 2.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: object
 * @개정이력: 
 *  장창환 2021. 3. 2. 최초작성
 *
 */
function _getScreenPermissionInfo(menuId) {
	if(systemInfo && systemInfo.menuList) {
		var mdfcPsbYn = "";
		menuList = systemInfo.menuList;
		for(var i=0; i<menuList.length; i++) {
			var menuObj = menuList[i];
			if(menuId == menuObj["menuId"]){
				mdfcPsbYn = menuObj["mdfcPsbYn"];
				break;
			}
		}
		return mdfcPsbYn;
	} else {
		return null;
	}
}
