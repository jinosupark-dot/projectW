/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 파일관리
 * @설명: 파일관리 화면의 JS
 * @최초작성자: 박세라 (61000434)
 * @최초작성일: 2021. 8. 23.
 * @최종변경일: 
 * @개정이력: 
 *  박세라 (61000434) 2021. 8. 23. 최초작성
 */

// 전역변수
var selectedTreeId; //tree의 선택한 treeId
var reset = 0;
var gUserInfo;

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    //삭제권한부여
    loadUserInfo();
    //event 초기화
    initEvent();
        
    selectPath();
    
    initGrid();
});

function loadUserInfo() {
    $.callAjax({}, "/main/selectSystemInfo.do").done(function(data) {
        gUserInfo = data.userInfo;
        if(gUserInfo.userId == 'admin' || gUserInfo.pesnNo == '68804716' || gUserInfo.orgNm == '선임계리사지원' || gUserInfo.orgNm == '선임계리사') {
            $("#btn_delete").show();
        } else {
            $("#btn_delete").hide();
        }
    }).fail(function(data){
        $.fn.msgBox("사용자정보 조회가 실패했습니다.");
    });
}

/**
* @설명: 파일관리 기본 이벤트 세팅
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function initEvent() {
    //폴더 추가
    $("#btn_addFolder").on("click", function(e){
        makeFolder();
    });
    
    //삭제
    $("#btn_delete").on("click", function(e){
        deleteFile();
    });
    
    //파일 업로드
    $("#btn_uploadFile").on("click", function(e){
        uploadFile();
    });
    
    

}

/**
* @설명: 파일관리 기본 그리드
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function initGrid(){
    
    // jsGrid 빈 테이블 생성
    var gridObject = new ComJsGrid({
        id: "gridDiv",
        height: 450,
        editing: false,
        sorting: true,
        paging: false,
        selectHiglight:false,
        
        fields : [
            { name: "check", title:"선택", width: 30, sorting: false, align:"center", editing: false, itemTemplate:function(value, item) {
                var elem = $("<input>").attr("type", "checkbox").attr("checked", value|| item.Checked).on("change", function() {
                        item.Checked = $(this).is(":checked");
                    });
                if (item.treeId == "..") elem.attr("disabled", "true");
                return elem;
            }}, 
            { name: "treeTypCd", title:"유형", css:"cell", type: "select", width: 50, align:"center", editing: false, visible:true, itemTemplate:function(value, item) {
                    var treeTypCd = item.treeTypCd;
                    var style = "";
                    if(treeTypCd == '1') {
                        style = "font-weight:bold;"
                    }
                    var name = "";
                    if(value == "1") {
                        name = "폴더";
                    } else {
                        name = "파일";
                    }
                    return "<div style='" + style + "'>" + name + "</div>";
                }
            },
            
            { name: "parentPath", title:"디렉토리", css:"cell", type: "text", width: 200, align:"center", editing: false, visible:false },
            { name: "treeId", title:"파일ID", css:"cell", type: "text", width: 100, align:"center", editing: false, visible:false },
            { name: "treeNm", title:"파일명", css:"cell", type: "text", width: 300, align:"left", editing: false, itemTemplate:function(value, item) {
                    var treeTypCd = item.treeTypCd;
                    var style = "";
                    if(treeTypCd == '1') {
                        style = "font-weight:bold;"
                    }
                    return "<fielId style='" + style + "'>" + value + "</fileId>";
                }
            },      
            { name: "size", title:"파일크기", css:"cell", type: "text",  width: 150, align:"right", editing: false, itemTemplate:function(value, item) {
                    var treeTypCd = item.treeTypCd; 
                    if(treeTypCd == '2') {
                        return $.addCommaNumber(value + "") + "(byte)";
                    } else {
                        return "";
                    }
                }
            },
            { name: "chgDtm", title:"변경일시", css:"cell", type: "text",  width: 150, align:"center", editing: false }
        ]
    }); 
    
    //row rowDoubleClick event 샘플
    gridObject.rowDoubleClick(function(args) {
        downloadFile(args);
    });
    
    //그리드 생성
    gridObject.gridCreate();
}

/**
* @설명: treeId로 treeObject 얻어오기
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function getFileObj(searchId) {

    if(fileMap.treeId == searchId) {
        return fileMap;
    } else {
        return _searchChildFile(searchId, fileMap);
    }
}

/**
* @설명: treeId로 children 얻어오기
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function _searchChildFile(searchId, targetObj) {
    var children = targetObj.children;
    if(!children || children.length == 0) return;
    for(var i=0; i<children.length; i++) {
        var fileObj = children[i];
        var treeId = fileObj.treeId;
        if(treeId == searchId) {
            return fileObj;
        }
        var retMenuObj = _searchChildFile(searchId, fileObj);
        if(retMenuObj) return retMenuObj;
    }
}

/**
* @설명: 메뉴트리생성
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
var fileMap = {}; 
function renderTreeView(firstMenuObj) {
    //remove menu;
    $("#treeMenuDiv").children().remove();
    fileMap = firstMenuObj;
    
    var treeElement = document.createElement("div");
    treeElement.setAttribute("class", "tree_wrap");
    var firstElement = _makeTreeElement(firstMenuObj);
    treeElement.appendChild(firstElement);
    
    _appendTreeChild(firstMenuObj, treeElement);
    
    //console.log(treeElement.innerHTML);
    var treeMenuElement = document.getElementById("treeMenuDiv");
    treeMenuElement.appendChild(treeElement);
    
    //add Event
    $(".tree_main").click(function() {
        $(this)[0].innerText = "HOME";
        $(this)[0].style.color = "#ee3124";
        var treeId = $(this)[0].getAttribute("treeId");
        var fileObj = getFileObj(treeId);
        console.log("current treeId : " + treeId);
        selectFileListByUppTreeId(fileObj);
    });
    
    $(".tree_dep1 > a").click(function(){
        var treeId = $(this)[0].getAttribute("treeId");
        var fileObj = getFileObj(treeId);
        if(fileObj && fileObj.treeTypCd == "1") {
            $("ul.tree_dep2").slideUp();
            $(this).parents().find(".tree_dep1 > a").removeClass('active'); 
            if($(this).parent().find("+ul").is(":hidden")){
                $(this).parent().find("+ul").slideDown();
                $(".tree_dep1 > a").removeClass('active'); 
                $(this).addClass('active'); 
            }
            selectFileListByUppTreeId(fileObj);
        }
    });
    $(".tree_dep2 > a").click(function(){
        var treeId = $(this)[0].getAttribute("treeId");
        var fileObj = getFileObj(treeId);
        if(fileObj && fileObj.treeTypCd == "1") {
            $("ul.tree_dep3").slideUp();
            $(this).parents().find(".tree_dep2 > a").removeClass('active'); 
            if($(this).parent().find("+ul").is(":hidden")){
                $(this).parent().find("+ul").slideDown();
                $(this).addClass('active'); 
            }
            selectFileListByUppTreeId(fileObj);
        }
    }); 
    
    $(".tree_dep3 > a").click(function(){
        var treeId = $(this)[0].getAttribute("treeId");
        var fileObj = getFileObj(treeId);
        if(fileObj && fileObj.treeTypCd == "1") {
            $("ul.tree_dep4").slideUp();
            $(this).parents().find(".tree_dep3 > a").removeClass('active'); 
            if($(this).parent().find("+ul").is(":hidden")){
                $(this).parent().find("+ul").slideDown();
                $(this).addClass('active'); 
            }
            selectFileListByUppTreeId(fileObj);
        }
    }); 

    $(".tree_dep4 > a").click(function(){
        var treeId = $(this)[0].getAttribute("treeId");
        var fileObj = getFileObj(treeId);
        if(fileObj && fileObj.treeTypCd == "1") {
            $("ul.tree_dep5").slideUp();
            $(this).parents().find(".tree_dep4 > a").removeClass('active'); 
            if($(this).parent().find("+ul").is(":hidden")){
                $(this).parent().find("+ul").slideDown();
                $(this).addClass('active'); 
            }
            selectFileListByUppTreeId(fileObj);
        }
    }); 

    if(selectedTreeId) {
        selectTree(selectedTreeId);
    }
    
    if(reset==0) {
        $(".tree_main").click();
    }
}

/**
* @설명: 트리메뉴 children 생성
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function _appendTreeChild(fileObj, targetElement) {
    var depth = fileObj.treeLvl;
    var menuList = fileObj.children;
    if(!menuList || menuList.length == 0) {
        return;
    }
    var ulElement = document.createElement("ul");
    ulElement.setAttribute("class", "tree_dep" + (Number(depth) + 1));

    for(var i=0; i<menuList.length; i++) {
        var fileObj = menuList[i];
        var liElement = _makeTreeElement(fileObj);
        
        if(fileObj.treeTypCd == "1") {  //디렉토리 구조만 보여주자
            ulElement.appendChild(liElement);
            _appendTreeChild(fileObj, liElement);
        }
    }
    targetElement.appendChild(ulElement);
}

/**
* @설명: 트리메뉴 생성
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function _makeTreeElement(fileObj) {
    var depth = fileObj.treeLvl;
    var treeId = fileObj.treeId;
    var treeNm = fileObj.treeNm;
    var treeTypCd = fileObj.treeTypCd; //1:메뉴, 2:화면
    if(depth == "0") {
        var firstElement = document.createElement("p");
        firstElement.setAttribute("treeId", treeId);
        firstElement.setAttribute("class","tree_main");
        var iElement = document.createElement("i");
        iElement.setAttribute("class", "xi-home xi-x");
        firstElement.innerHTML = iElement.outerHTML + fileObj.treeNm;
        return firstElement;
    } else {
        var lElement = document.createElement("li");
        var pElement = document.createElement("p");
        var className = "tree_dep" + depth;
        if(treeTypCd == 2) {
            className += " notree";
        }
        pElement.setAttribute("class", className);
        var aElement = document.createElement("a");
        aElement.setAttribute("href", "javascript:void(0);");
        aElement.setAttribute("treeId", treeId);
        aElement.innerText = treeNm;
        pElement.appendChild(aElement);
        lElement.appendChild(pElement);
        return lElement;
    }
}

function selectTree(treeId) {
    var fileObj = getFileObj(treeId);
    var parentId = fileObj.uppTreeId;
    var list = $(".tree_wrap > p");
    for(var i=0; i<list.length; i++) {
        var elem  = list[i];
        var elemMenuId = elem.getAttribute("treeId");
        if(treeId == elemMenuId) {
            elem.click();
            return;
        }
    }

    list = $("a");
    for(var i=0; i<list.length; i++) {
        var elem  = list[i];
        var elemMenuId = elem.getAttribute("treeId");
        if(treeId == elemMenuId) {
            elem.click();
            return;
        }
    }
}

/**
* @설명: 경로조회, 렌더링
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function selectPath(num) {
    
    var reqParam = {};
    //example 조회 서비스 AJAX호출 후 그리드 바인딩
    //param 조건에 맞게 select한 데이터 가져옴
    $.callAjax(reqParam, "/be/pd/bepd322m/selectPathTree.do")
    .done(function(data) {
        renderTreeView(data);
    }).fail(function(data){
    });     
}

/**
* @설명: selectFileListByUppTreeId
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function selectFileListByUppTreeId(fileObj) {
    selectedTreeId = fileObj.treeId;
    var treeLvl = fileObj.treeLvl;
    var treeNm = fileObj.treeNm;
    var list = fileObj.children;
    var fileList = [];
    
    fileList.push({
        treeId:"..",
        treeNm:"..",
        treeTypCd:"1",
        parentPath : "..",
        treeLvl : fileObj.treeLvl,
        uppTreeId : fileObj.uppTreeId
    });
    
    for(var i=0; i<list.length;i++ ) {
        var tmpObj = list[i];
        var treeTypCd = tmpObj.treeTypCd;
        tmpObj.parentPath = selectedTreeId;
        fileList.push(tmpObj);
    }
    $("#gridTitle2")[0].innerText = "현재경로 [" + selectedTreeId + "]";
    $("#gridDiv").jsGrid("loadData", fileList).done(function(){  
    });
    
}

/**
* @설명: 파일다운로드
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function downloadFile(args) {
    reset = 1;
    var selectedIndex = args.itemIndex;
    var selectedObj = args.item;
    if(selectedObj.treeTypCd == '2') {  //파일
        $.fn.msgBox(selectedObj.treeNm + " 파일을 다운로드 하시겠습니까?", function (obj) {
            if(obj.btn_ok) {
                
                $.fn.fileDownload("/mg/sy/mgsy911m/downloadFile.do?filePath=" + encodeURIComponent(selectedObj.treeId));
            }
        }, 2);      
    } else {
        if(selectedObj.treeId == "..") {
            if(selectedObj.treeLvl == "0") {
                $.fn.msgBox("최상위 디렉토리입니다.");
                return;
            } else {
                selectTree(selectedObj.uppTreeId);
            }
        } else {
            selectTree(selectedObj.treeId);
        }
    }
}

/**
* @설명: 체크파일삭제
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function deleteFile() {
    reset = 1;
    var list = $("#gridDiv").jsGrid("option", "data");
    var delList = [];
    var typ = "";
    for(var i=0; i<list.length; i++) {
        var item = list[i];
        if(item.Checked) {
            delList.push(item);
        }
    }
    if(delList.length ==0) {
        $.fn.msgBox("삭제할 파일을 체크하세요.");
        return;
    }
    if(delList[0].treeTypCd == 1) {
        typ = "폴더를";
    } else {
        typ = "파일을";
    }
    console.log("delList.treeLvl ? "+delList.treeLvl+"typ ? "+typ);
    $.fn.msgBox("선택한 "+typ+" 삭제 하시겠습니까?", function (obj) {
        if(obj.btn_ok) {
            $.callAjax({"list": JSON.stringify(delList)}, "/be/pd/bepd322m/deleteFileList.do")
            .done(function(data) {
                if(data.result == "1") {
                    $.fn.msgBox("정상적으로 처리되었습니다.");
                    selectPath();
                }
            }).fail(function(data){
            });
        }
    }, 2);
}

/**
* @설명: 폴더생성
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function makeFolder() {
    reset = 1;
    var folderName = $("#inp_newFolder").val();
    if(folderName.trim().length ==0) {
        alert("새폴더명을 입력하세요.");
        $("#inp_newFolder").focus();
        return;
    }

    if(selectedTreeId.indexOf('변액계정운용팀') != -1 && gUserInfo.orgNm != '변액계정운용팀') {
        $.fn.msgBox("변액계정운용팀에서만 등록 가능합니다.");
        return;
    } else if(selectedTreeId.indexOf('선임계리사지원') != -1 && gUserInfo.orgNm != '선임계리사지원') {
        $.fn.msgBox("선임계리사지원에서만 등록 가능합니다.");
        return;
    } else if(selectedTreeId.indexOf('자산운용전략부') != -1 && gUserInfo.orgNm != '자산운용전략부') {
        $.fn.msgBox("자산운용전략부에서만 등록 가능합니다.");
        return;
    }
    
    var newPath = selectedTreeId + "/" + folderName;
    $.callAjax({"filePath": newPath}, "/be/pd/bepd322m/makeFolder.do")
    .done(function(data) {
        if(data.result == "1") {
            $("#inp_newFolder").val("");
            $.fn.msgBox("정상적으로 처리되었습니다.");
            selectPath();
        }
    }).fail(function(data){
    });
}

/**
* @설명: 파일업로드
* @최초작성자: 박세라 (61000434)
* @최초작성일: 2021. 8. 23.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  박세라 (61000434) 2021. 8. 23. 최초작성
*/
function uploadFile() {
    reset = 1;
    var filePath = selectedTreeId;
    if(!filePath) {
        alert("업로드 디렉토리를 트리에서 선택하세요.");
        return;
    }
    if(selectedTreeId.indexOf('변액계정운용팀') != -1 && gUserInfo.orgNm != '변액계정운용팀') {
        $.fn.msgBox("변액계정운용팀에서만 등록 가능합니다.");
        return;
    } else if(selectedTreeId.indexOf('상품개발부') != -1 && gUserInfo.orgNm != '상품개발부') {
        $.fn.msgBox("상품개발부에서만 등록 가능합니다.");
        return;
    } else if(selectedTreeId.indexOf('선임계리사지원') != -1 && gUserInfo.orgNm != '선임계리사지원') {
        $.fn.msgBox("선임계리사지원에서만 등록 가능합니다.");
        return;
    } else if(selectedTreeId.indexOf('자산운용전략부') != -1 && gUserInfo.orgNm != '자산운용전략부') {
        $.fn.msgBox("자산운용전략부에서만 등록 가능합니다.");
        return;
    }
    var form = $("#uploadForm")[0];
    if(!form.file.value) {
        alert("업로드할 파일을 입력하세요.")
        return;
    }
    form.filePath.value = filePath;
    var reqParam = new FormData(form);
    
    $.callAjaxUpload(reqParam, "/be/pd/bepd322m/uploadFile.do")
    .done(function(data) {
        if(data.result == "1") {
            $.fn.msgBox("정상적으로 처리되었습니다.");
            $("#uploadForm")[0].file.value = "";
            selectPath();
        }
    }).fail(function(data){
    });
}
