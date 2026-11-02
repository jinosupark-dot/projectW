/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 거버넌스 > 가정적용
 * @설명: 거버넌스 > 가정적용 화면의 JS
 * @최초작성자: 임국빈 (61000420)
 * @최초작성일: 2021. 10. 20.
 * @최종변경일: 
 * @개정이력: 
 *  임국빈 (61000420) 2021. 10. 20. 최초작성
 */

// 전역변수
var selectedTreeId; //tree의 선택한 treeId
var reset = 0;
var gUsrInfo = {};
var gSancList = [];
var gSrchFlag = "N";
var gSgOrgCd;
var gSgOrgNm;
var gHqOrgCd;
var gHqOrgNm;
var gHqOrgmId;
var gLoginInfo;

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    initCommCd();
    //로그인정보로드
    loadUserInfo();
    //event 초기화
    initEvent();
    
    initGrid();
});

function loadUserInfo() {
    
    $.callAjax({}, "/be/gv/begv141m/getUsrGvRole.do").done(function(data) {
        
    	$("#div_uploadFile").hide();
    	$("#btn_delete").hide();
    	$("#btn_addData").hide();
        
    	gUsrInfo = data.usrInfoList;
    	gCopInfo = data.copInfo;
    	gLoginInfo = data.loginInfo;
    	
		//접속 사용자 권한
		for(var i=0; i<gUsrInfo.length; i++){
			if (gUsrInfo[i].copCd == "01" || gUsrInfo[i].copCd == "02" || gUsrInfo[i].copCd == "03"){
				$("#div_uploadFile").show();
	            $("#btn_delete").show();
	            $("#btn_addData").show();
		    }
			
		}
		//선계 확인
		for (var j=0; j<gCopInfo.length; j++){
			if (gCopInfo[j].copCd == "03" ) {
				gSgOrgCd = gCopInfo[j].chrgeOrgNo;
				gSgOrgNm = gCopInfo[j].chrgeOrgAliasNm;
			}
			if (gCopInfo[j].copCd == "01" ) {
				gHqOrgCd = gCopInfo[j].chrgeOrgNo;
				gHqOrgNm = gCopInfo[j].chrgeOrgAliasNm;
				gHqOrgmId = gCopInfo[j].orgmId;
			}
		}
		
    }).fail(function(data){
        $.fn.msgBox("사용자정보 조회가 실패했습니다.");
    });
}

function initCommCd() {
    
    $.fn.loadCommonCode(["ASS_SC_CD","GVNC_TRT_STAT_CD"]);
    
    // 적용BE 조회, 콤보박스 설정
    $.fn.getAplcBe("sbx_aplcBe", 'GV');
}

/**
* @설명: 거버넌스 > 가정적용 기본 이벤트 세팅
* @최초작성자: 임국빈 (61000420)
* @최초작성일: 2021. 10. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  임국빈 (61000420) 2021. 10. 20. 최초작성
*/
function initEvent() {
    
    //조회버튼 클릭
    $("#btn_search").on("click", function(e){
        
        //tb_ibecrd07 조회
        selectSancList();
        //tb_ibecrd06 조회
        selectFileList();
        
    });
    
    //등록버튼 클릭
    $("#btn_addData").on("click", function(e){
       if(gSrchFlag == "N") {
            $.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        //팝업창 호출
        openAddPopup();
    });
    
    //파일 업로드
    $("#btn_uploadFile").on("click", function(e){
        uploadFile();
    });
    
    // 파일삭제
    $("#btn_delete").on("click", function(e){
    	if (gSrchFlag == "N") {
        	$.fn.msgBox("조회된 항목이 없습니다.");
            return;
        }
        deleteFile();
    });
    
    $("#sbx_aplcBe").on("change", function(e){
        initView();
    });
    
    if (gSrchFlag == "N"){
    	$("#uploadFile").attr("disabled", true);
    }

}

function initView() {
	$("#gridDivSancList").jsGrid("reset");
	$("#gridDivSancList").jsGrid("destroy");
	$("#gridDivFileList").jsGrid("reset");
	$("#gridDivFileList").jsGrid("destroy");
	
	initGrid();
	gSrchFlag = "N";
	document.getElementById("td_title").innerHTML = "";
    document.getElementById("td_cont").innerHTML = "";
    $("#uploadFile").attr("disabled", true);
}
/**
* @설명: 거버넌스 > 가정적용 기본 그리드
* @최초작성자: 임국빈 (61000420)
* @최초작성일: 2021. 10. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  임국빈 (61000420) 2021. 10. 20. 최초작성
*/
function initGrid(){
    var gvncTrtStatCdArr = $.fn.getGridCodeItem("GVNC_TRT_STAT_CD");
    var textField = "";
    var gridObject1 = new ComJsGrid({
        id: "gridDivSancList",
        height: 250,
        editing: false,
        sorting: false,
        paging: false,
        selectHiglight:false,
        
        fields : [
            { name: "seq"   , title:"순서"    , css:"cell", type: "text", width: 50, editing: false, align:"center", visible:false},
            { name: "dutyNm", title:"직급", css:"cell", type: "text", width: 70, align:"center", editing: false,
                itemTemplate:function(value, item) {
                	if(item.pesnNo == gHqOrgmId) {
                        return gHqOrgNm.replace("장", "")+"/" + gHqOrgNm.replace("장", "")+"장";
                    } else {
                        return item.orgNm+"/"+value;
                    }
                }
            },
            { name: "pesnNo"   , title:"인사번호"    , css:"cell", type: "text", width: 50, editing: false, align:"center", visible:false},
            { name: "pesnNm", title:"성명", css:"cell", type: "text", width: 50, align:"center", editing: false},
            { name: "type", title:"유형", css:"cell", type: "text", width: 30, align:"center", editing: false,
                itemTemplate:function(value, item) {
                	for(i=0; i<gvncTrtStatCdArr.length; i++) {
                        if(item.gvncTrtStatCd == gvncTrtStatCdArr[i].code) {
                        	value = gvncTrtStatCdArr[i].codeNm;
                        }
                    }
                	return value;
                }
            },
            { name: "gvncTrtStatCd", title:"결재현황", css:"cell", type: "select", width: 50, align:"center", editing: false, 
                items: $.fn.getGridCodeItem("GVNC_TRT_STAT_CD"), textField: "codeNm", valueField: "code", 
                itemTemplate:function(value, item){
                	for(i=0; i<gvncTrtStatCdArr.length; i++) {
                        if(item.gvncTrtStatCd == gvncTrtStatCdArr[i].code) {
                            textField = gvncTrtStatCdArr[i].codeNm;
                        }
                    }
                	if (item.aprvYn == "Y"){
                		return textField+"완료";
                	} else {
                		return "";
                	}
                }
            },
            { name: "aprvYn", title:"승인상태", css:"cell", type: "text", width: 50, align:"center", editing: false, visible:false},
            { name: "trtDtm", title:"처리일시", css:"cell", type: "text", width: 70, align:"center", editing: false,
                itemTemplate:function(value, item) {
                    if(item.aprvYn == 'Y' ) {
                    	return value;
                    } else {
                    	return "";
                    }
                }
            },
            { name: "btn", title:"", css:"cell", type: "text", width: 50, align:"center", editing: false,
                itemTemplate:function(value, item){
                	for(i=0; i<gvncTrtStatCdArr.length; i++) {
                        if(item.gvncTrtStatCd == gvncTrtStatCdArr[i].code) {
                            textField = gvncTrtStatCdArr[i].codeNm;
                        }
                    }
                    const btnFinPopup = $("<button class='grid_inbtn_s' disabled>").text(textField)
                    var $pFinEl2 = $("<p>").addClass("fr");
                    if((item.seq == 1 && item.aprvYn == null) && (item.pesnNo == gUsrInfo.orgmId || gLoginInfo.loginId == 'admin')) {
                        btnFinPopup.attr("disabled", false);
                    } else if(item.seq == 2){
                        if((gSancList[0].aprvYn == "Y" && item.aprvYn == null) && (item.pesnNo == gUsrInfo.orgmId || gLoginInfo.loginId == 'admin')) {
                            btnFinPopup.attr("disabled", false);
                        }
                    }else if(item.seq == 3 || item.seq == 4){
                        if((gSancList[1].aprvYn == "Y" && item.aprvYn == null) && (item.pesnNo == gUsrInfo.orgmId || gLoginInfo.loginId == 'admin')) {
                            btnFinPopup.attr("disabled", false);
                        }
                    } else {
                        if((gSancList[2].aprvYn == "Y" && gSancList[3].aprvYn == "Y" && item.aprvYn == null) && (item.pesnNo == gUsrInfo.orgmId || gLoginInfo.loginId == 'admin')) {
                            btnFinPopup.attr("disabled", false);
                        }
                    }
                    var $aFinEl = btnFinPopup.on("click", function() {
                        $.fn.msgBox(textField+" 하시겠습니까?", function (obj) {
                            if (obj.btn_ok) {
                                //의견등 입력정보 저장
                                var reqParam = {
                                    "aplcBe": item.aplcBeNm,
                                    "seq": item.seq
                                    //"gvncTrtStatCd": gvncTrtStatCd
                                };
                                $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/gv/begv151m/updateAssAplcAprv.do")
                                .done(function(data) {
                                    
                                    if(data.result == "1") {
                                        $.fn.msgBox("정상적으로 처리되었습니다.", function(){
                                            selectSancList();
                                        });
                                    }else if(data.result >= 1){
                                        $.fn.msgBox("변경된 사항이 없습니다.");
                                    }else {
                                        $.fn.msgBox("데이터 저장이 실패했습니다.");
                                    }
                                }).fail(function(data){
                                    $.fn.msgBox("데이터 저장이 실패했습니다.");
                                });
                            }
                        }, 2);

                    });
                    //$aFinEl.append(btnFinPopup);
                    
                    return $("<div style='display:inline-block;'>").append($pFinEl2.append(btnFinPopup/*$aFinEl*/));
                }
            }
            
        ]
    });
    
    // jsGrid 빈 테이블 생성
    var gridObject2 = new ComJsGrid({
        id: "gridDivFileList",
        height: 250,
        editing: false,
        sorting: false,
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
            { name: "parentPath", title:"디렉토리", css:"cell", type: "text", width: 200, align:"center", editing: false, visible:false },
            { name: "treeId", title:"파일ID", css:"cell", type: "text", width: 100, align:"center", editing: false, visible:false },
            { name: "apndFileNm", title:"파일명", css:"cell", type: "text", width: 300, align:"left", editing: false, itemTemplate:function(value, item) {
                    var treeTypCd = item.treeTypCd;
                    var style = "";
                    if(treeTypCd == '1') {
                        style = "font-weight:bold;"
                    }
                    return "<fielId style='" + style + "'>" + value + "</fileId>";
                }
            },      
            { name: "apndFileSize", title:"파일크기", css:"cell", type: "text",  width: 150, align:"right", editing: false, itemTemplate:function(value, item) { 

                    return $.addCommaNumber(value + "") + "(byte)";

                }
            }
        ]
    }); 
    
    //row rowDoubleClick event 샘플
    gridObject2.rowDoubleClick(function(args) {
    //console.log('chk :; ' + encodeURIComponent(args.item.apndFilePathNm + "/" + args.item.apndFileNm));
        $.fn.fileDownload("/mg/sy/mgsy911m/downloadFile.do?filePath=" + encodeURIComponent(args.item.apndFilePathNm + "/" + args.item.apndFileNm));
    });
    
    //그리드 생성
    gridObject1.gridCreate();
    gridObject2.gridCreate();
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
    var list = $("#gridDivFileList").jsGrid("option", "data");
    var delList = [];
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
    $.fn.msgBox("선택한 파일을 삭제 하시겠습니까?", function (obj) {
        if(obj.btn_ok) {
            $.callAjax({"list": JSON.stringify(delList)}, "/be/gv/begv111p/deleteFileList.do")
            .done(function(data) {
                if(data.result == "1") {
                    selectFileList();
                    $.fn.msgBox("정상적으로 처리되었습니다.");
                }
            }).fail(function(data){
            });
        }
    }, 2);
}
/**************************************************************************/

function selectSancList() {
    
    var reqParam = {};
    reqParam["aplcBe"] = $("#sbx_aplcBe").val();
    
    $.callAjax(reqParam, "/be/gv/begv151m/selectSancList.do")
    .done(function(data) {
        document.getElementById("td_title").innerHTML = "";
        document.getElementById("td_cont").innerHTML = "";
        
        var sancList = data.sancList;
        gSancList = [].concat(sancList); 
        
        $("#gridDivSancList").jsGrid("loadData", sancList).done(function() {
            //$(".jsgrid-header-row").attr("style", "display: none");
            if(sancList == null || sancList.length == 0) {
                $.fn.getReturnValue("gridDivSancList");
            }else {
                document.getElementById("td_title").innerHTML = sancList[0].rvwCntnt01;
                document.getElementById("td_cont").innerHTML = sancList[0].rvwCntnt02.replaceAll("\n","<br>");
            }
            
            gSrchFlag = "Y";
            $("#uploadFile").attr("disabled", false);
        });
        
    }).fail(function(data){
        $.fn.msgBox("데이터조회를 실패했습니다.");
    });
}

function selectFileList() {
    
    var reqParam = {};
    reqParam["aplcBeNm"] = $("#sbx_aplcBe").val();
    reqParam["assScCd"] = "18";
    reqParam["orgCd"] = gSgOrgCd;
    //reqParam["apndFileSno"] = 4;
    
    $.callAjax(reqParam, "/be/gv/begv111p/selectPryDtRvwFileList.do")
    .done(function(data) {
        var fileList = data.fileList;
        gFileList = fileList;
        //console.log("파일List");
        //console.log(JSON.stringify(fileList));
        
        $("#gridDivFileList").jsGrid("loadData", fileList).done(function() {
            //$(".jsgrid-header-row").attr("style", "display: none");
            if(fileList == null || fileList.length == 0){
                $.fn.getReturnValue("gridDivFileList");
            }
        });
        
    }).fail(function(data){
        $.fn.msgBox("데이터조회를 실패했습니다.");
    });
}

/**
* @설명: 파일업로드
* @최초작성자: 임국빈 (61000420)
* @최초작성일: 2021. 10. 20.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  임국빈 (61000420) 2021. 10. 20. 최초작성
*/
function uploadFile() {
	if (gSrchFlag == "N") {
    	$.fn.msgBox("조회된 항목이 없습니다.");
        return;
    } else {
	    reset = 1;
	    var filePath = "";
	    
	    var form = $("#uploadForm")[0];
	    if(!form.file.value) {
	        alert("업로드할 파일을 입력하세요.")
	        return;
	    }
	    form.filePath.value = filePath;
	    form.aplcBeNm.value = $("#sbx_aplcBe").val();
	    var reqParam = new FormData(form);
	    var fileVal = $("#uploadFile").val();
	    var $files = document.querySelector("#uploadFile");
	    var size = $files.files[0].size;
	    var fObj = {};
	    fObj["fileList"] = [
	        {
	            "aplcBeNm": $("#sbx_aplcBe").val(),
	            "assScCd": "18",
	            "userId": gLoginInfo.loginId,
	            "orgCd": gLoginInfo.loginOrg,
	            "apndFilePathNm": fileVal.substring(0,fileVal.lastIndexOf("\\")),
	            "apndFileNm": fileVal.substring(fileVal.lastIndexOf("\\")+1),
	            "apndFileSize": size,
	            "trtrEno": gLoginInfo.loginId,
	            "status": "add",
	            "apndFileSno": 4
	        }
	    ];
	    
	    $.callAjaxUpload(reqParam, "/be/gv/begv111p/uploadFile.do")
	    .done(function(data) {
	        
	        if(data.result == "1") {
	            $.fn.msgBox("정상적으로 처리되었습니다.");
	            $("#uploadForm")[0].file.value = "";
	            //insert 로직
	            $.callAjax({"jsonStr":JSON.stringify(fObj)}, "/be/gv/begv111p/savePryDtRvwFile.do")
	                .done(function(data) {
	                    selectFileList();
	            }).fail(function(data){
	                console.log("파일데이터insert 실패!");
	            });
	            
	        }
	    }).fail(function(data){
	    });     
    }
}

function checkFile(e){
    
    var file = e.files;
    
    if(file[0].size > 1024*1024*10) {
        $.fn.msgBox("10MB 이하 파일만 등록할 수 있습니다.");
        $("#uploadFile").val("");
    }
}

/**
 * @설명: 기초데이터검토 등록을 위한 팝업을 호출한다.
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일: 
 * @매개변수: rowItem 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021.08.26 최초작성
 */
var popupOption = null;
function openAddPopup() {

    popupOption = {
        url: "/be/gv/begv151p.do",
        name: "거버넌스 가정적용 상세 팝업",
        width: 700,
        height: 650,    
        userInfo: gUsrInfo,
        loginInfo: gLoginInfo,
        aplcBe: $("#sbx_aplcBe").val(),
        sancList: gSancList
    }

    $.fn.openPopup(popupOption);
}

/**
 * @설명: 기초데이터검토 등록을 위한 팝업 콜백
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일: 
 * @매개변수: resultObj 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021.08.26 최초작성
 */
function openAddPopup_callback(resultObj) {

    selectSancList();
}