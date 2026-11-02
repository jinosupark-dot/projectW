/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 거버넌스 - 검토의견 팝업
 * @설명: 거버넌스 - 검토의견 팝업화면의 JS
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 8. 18.
 * @최종변경일: 
 * @개정이력: 
 *  2021. 8. 18. 최초작성
 */

//전역변수
var gSrchYn = "N";
var gDiv = "";
var gObjParam = {};
var gSeq = "";
var gUserInfo = "";
var gObjParamItem = {};
var gStts = "N"; //N new

$(document).ready(function(){
    
    $("#imgToolTip").attr("title", parent.viewPath);
    
    gObjParam = opener.popupOption.param;
    gObjParamItem = opener.popupOption.item;
    console.log("gObjParam ? ", gObjParam);
    console.log("gObjParamItem ? ", gObjParamItem);
    //사용자정보 얻어오기
    loadUserInfo();
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();
    
    //event 초기화
    initEvent();
    
    //파일목록 그리드 생성
    initGrid();
    
//    var chkCfm = "";
//    if (gObjParamItem != null){
//    	chkCfm = gObjParamItem.stts;
//    } else {
//    	chkCfm = gObjParam.stts;
//    }
//    
//    
//    if (chkCfm != "E"){
//    	document.getElementById("btn_cfm").style.display = "none";
//    } 
    
    
});

/**
 * @설명: 공통코드 세팅
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function initCommCd() {
    
    // 공통코드 조회(가정종류)
    $.fn.loadCommonCode(["ASS_SC_CD","GVNC_RVW_RSLT_SC_CD"]);
    $.fn.renderCombobox({
        codeArr: ["ASS_SC_CD","GVNC_RVW_RSLT_SC_CD"],
        selArr: ["sbx_assScCd","sbx_gvncRvwRsltScCd"],
        useFirstOption: false       //첫번째 option 사용여부
    });
    // 공통코드 조회(적용BE)
    $.fn.getAplcBe("sbx_aplcBe",$("#sbx_assScCd option:selected").val());
    
}

/**
 * @설명: opner화면에서 가져온 파라미터 세팅
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function initParamData() {

    //수정버튼으로 진입
    if(gObjParamItem != "undefined" && gObjParamItem != null) {
        gDiv = "mod";
        //적용BE, 가정종류세팅
        $("#sbx_aplcBe").val(gObjParamItem.aplcBeNm).prop("selected",true);
        $("#sbx_aplcBe").attr("disabled", true);
        $("#sbx_assScCd").val(gObjParamItem.assScCd).prop("selected",true);
        $("#sbx_assScCd").attr("disabled", true);
        $("#ibx_orgCd").val(gObjParamItem.orgCd);
        $("#ibx_orgNm").val(gObjParamItem.orgNm);
        $("#sbx_gvncRvwRsltScCd").val(gObjParamItem.gvncRvwRsltScCd).prop("selected",true);
        
        var reqParam = {};
        reqParam["aplcBeNm"] = gObjParamItem.aplcBeNm;
        reqParam["assScCd"] = gObjParamItem.assScCd;
        reqParam["orgCd"] = gObjParamItem.orgCd;
        reqParam["apndFileSno"] = 3;
        
        $.callAjax(reqParam, "/be/gv/begv111p/selectPryDtRvwFileList.do")
        .done(function(data) {
            var fileList = data.fileList;
            gFileList = fileList;
            
            $("#gridDivFileList").jsGrid("loadData", fileList).done(function() {
                if(fileList == null || fileList.length == 0){
                    $.fn.getReturnValue("gridDivFileList");
                }
            });
            
        }).fail(function(data){
            $.fn.msgBox("데이터조회를 실패했습니다.");
        });
        
        var key1 = gUserInfo.userEno+"/검토의견/"+$("#sbx_assScCd").val()+"/"+gObjParamItem.orgCd;
        var key1Val = localStorage.getItem(key1);
        console.log("key1 ? ", key1, "key1Val ? ", key1Val);
        if(key1Val) {
            $("#tar_opn").val(key1Val);
        } else {
            $("#tar_opn").val(gObjParamItem.rvwCntnt01);
        }
        var key2 = gUserInfo.userEno+"/검토답변/"+$("#sbx_assScCd").val()+"/"+gObjParamItem.orgCd;
        var key2Val = localStorage.getItem(key2);
        console.log("key2", key2, "key2Val ? ", key2Val);
        if(key2Val) {
            $("#tar_rpl").val(key2Val);
        } else {
            $("#tar_rpl").val(gObjParamItem.rvwCntnt02);
        }
    }
    //등록버튼으로 진입
    else {
        var param = opener.popupOption.param;
        gDiv = "add";
        $("#btn_delete").remove();
        $("#btn_tmpSave1").remove();
        $("#btn_tmpSave2").remove();
        $("#tr_fileList .clearfix").text("파일이 없습니다");
        //적용BE, 가정종류세팅
        $("#sbx_aplcBe").val(gObjParam.aplcBeNm).prop("selected",true);
        $("#sbx_aplcBe").attr("disabled", true);
        $("#sbx_assScCd").val(gObjParam.assScCd).prop("selected",true);
        $("#sbx_assScCd").attr("disabled", true);
    }
}

/**
 * @설명: 이벤트 세팅
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function initEvent() {
    
    //의견입력 textarea 키입력 이벤트
    $("#tar_opn").on("keydown", function(e){
        $("#lb_opn").text(getByteB($("#tar_opn").val()));
    });
    
    //답변입력 textarea 키입력 이벤트
    $("#tar_rpl").on("keydown", function(e){
        $("#lb_rpl").text(getByteB($("#tar_rpl").val()));
    });
    
    //담당자 검색 팝업창
    $("#btn_orgSearch").on("click", function(e){
        callPopupUserSearch();
    });
    
    //저장버튼 이벤트
    $("#btn_save").on("click", function(e){
        var reqParam = getInputData();
        if(reqParam != false) {
            $.fn.msgBox("데이터를 저장하시겠습니까?", function (obj) {
                if (obj.btn_ok) {
                    $.callAjax(reqParam, "/be/gv/begv131p/saveRvwOpin.do")
                    .done(function(data) {
                        console.log("저장결과 ? ", data);
                        if(data.result == "1") {
                            uploadFile();
                            var key1, key2;
                            if(gDiv == "mod") {
                                key1 = gUserInfo.userEno+"/검토의견/"+$("#sbx_assScCd").val()+"/"+gObjParamItem.orgCd;
                                key2 = gUserInfo.userEno+"/검토답변/"+$("#sbx_assScCd").val()+"/"+gObjParamItem.orgCd;
                            } else {
                                key1 = gUserInfo.userEno+"/검토의견/"+$("#sbx_assScCd").val()+"/"+gObjParam.orgCd;
                                key2 = gUserInfo.userEno+"/검토답변/"+$("#sbx_assScCd").val()+"/"+gObjParam.orgCd;
                            }
                            localStorage.removeItem(key1);
                            localStorage.removeItem(key2);
                            $.fn.msgBox("정상적으로 처리되었습니다.", function(){
                                window.close();
                                opener.openAddPopup_callback(reqParam);
                            });
                        }
                    }).fail(function(data){
                        $.fn.msgBox("데이터 저장이 실패했습니다.");
                    });
                }
            }, 2);
        }
    });
    
    //파일추가
    $("#btn_addFile").on("click", function(e){
        var fileVal = $("#uploadFiles").val();
        if($.fn.isNull(fileVal)) {
            $.fn.msgBox("파일을 선택해주세요");
            return false;
        }
        var fileVals = [];
        fileVals = fileVal.split(",");
        
        if(fileVals.length > 5) {
            $.fn.msgBox("파일을 5개 미만으로 선택해주세요");
            return false;
        }

        
        var reqAplcBe = $("#sbx_aplcBe").val();
        var reqAssScCd = $("#sbx_assScCd").val();
        var reqOrgCd = $("#ibx_orgCd").val();
        var reqUserId = $("#ibx_trtr").val();
        var item = {
            "aplcBeNm": reqAplcBe,
            "assScCd": reqAssScCd,
            "orgCd": reqOrgCd,
            "userId": reqUserId,
            "apndFileSno": 3
        };
        addGridData(item,fileVals,"add");
    });
    
    //임시저장(의견)
    $("#btn_tmpSave1").on("click", function(e){
        $.fn.msgBox("의견을 임시저장하시겠습니까?", function (obj) {
            if (obj.btn_ok) {
                var key1 = "";
                if(gDiv == "mod") {
                    key1 = gUserInfo.userEno+"/검토의견/"+$("#sbx_assScCd").val()+"/"+gObjParamItem.orgCd;
                } else {
                    key1 = gUserInfo.userEno+"/검토의견/"+$("#sbx_assScCd").val()+"/"+gObjParam.orgCd;
                }
                localStorage.setItem(key1, $("#tar_opn").val());
                if(localStorage.getItem(key1)) {
                    $.fn.msgBox("저장되었습니다.");
                }
            }
        }, 2);
    });
    
    //임시저장(답변)
    $("#btn_tmpSave2").on("click", function(e){
        $.fn.msgBox("답변을 임시저장하시겠습니까?", function (obj) {
            if (obj.btn_ok) {
                var key2 = "";
                if(gDiv == "mod") {
                    key2 = gUserInfo.userEno+"/검토답변/"+$("#sbx_assScCd").val()+"/"+gObjParamItem.orgCd;
                } else {
                    key2 = gUserInfo.userEno+"/검토답변/"+$("#sbx_assScCd").val()+"/"+gObjParam.orgCd;
                }
                localStorage.setItem(key2, $("#tar_rpl").val());
                if(localStorage.getItem(key2)) {
                    $.fn.msgBox("저장되었습니다.");
                }
            }
        }, 2);
    });
    
    //파일삭제
    $("#btn_deleteFiles").on("click", function(e){
        deleteFile();
    });
    
    //가정삭제
    $("#btn_delete").on("click", function(e){
        var reqParam = getInputData();
        console.log(reqParam);
        $.fn.msgBox("데이터를 삭제하시겠습니까?", function (obj) {
            if (obj.btn_ok) {
                $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/gv/begv131p/deleteRvwOpin.do")
                .done(function(data) {
                    console.log("삭제결과 ? ", data.result);
                    if(data.result == "1") {
                        var key1, key2;
                        if(gDiv == "mod") {
                            key1 = gUserInfo.userEno+"/검토의견/"+$("#sbx_assScCd").val()+"/"+gObjParamItem.orgCd;
                            key2 = gUserInfo.userEno+"/검토답변/"+$("#sbx_assScCd").val()+"/"+gObjParamItem.orgCd;
                        } else {
                            key1 = gUserInfo.userEno+"/검토의견/"+$("#sbx_assScCd").val()+"/"+gObjParam.orgCd;
                            key2 = gUserInfo.userEno+"/검토답변/"+$("#sbx_assScCd").val()+"/"+gObjParam.orgCd;
                        }
                        localStorage.removeItem(key1);
                        localStorage.removeItem(key2);
                        $.fn.msgBox("정상적으로 처리되었습니다.", function(){
                            window.close();
                            opener.openModPopup_callback(reqParam);
                        });
                    }
                }).fail(function(data){
                    $.fn.msgBox("데이터 저장이 실패했습니다.");
                });
            }
        }, 2);
    });
    
    //팝업창 닫기
    $("#btn_closePopup").on("click", function(e){
        window.close();
    });
}

/**
 * @설명: 부서검색 팝업을 호출한다.
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 임국빈 2021.08.26 최초작성
 */
var roleGrideType="user";
function callPopupUserSearch() {
    var popupOption = {
            url: "/mg/sy/mgsy211p.do",
            name: "사원번호조회팝업",
            width: 800,
            height: 464
    }
    var popup = $.fn.openPopup(popupOption);
}

/**
 * @설명: 부서조회 팝업 콜백
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 임국빈 2021.08.26 최초작성
 */
function resultUserPopup_callback(resultObj){
    console.log("resultTablePopup_callback   resultObj", JSON.stringify(resultObj));

    $("#ibx_orgCd").val(resultObj.orgNo);
    $("#ibx_orgNm").val(resultObj.orgNm);
}

/**
 * 
 * @설명: 첨부파일을 업로드 한다.
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 07.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  89001203 2021. 9. 07. 최초작성
 *
 */
function uploadFile() {
    console.log("function : upload!!!!!!");
    var fileVal = $("#uploadFile").val();
    var form = $("#uploadForm")[0];
    
    if(!form.file.value) {
        
        return;
    }
    var fObj = getInputData();
    fObj["fileList"] = [
        {
            "aplcBeNm": fObj.aplcBe,
            "assScCd": fObj.assScCd,
            "userId": fObj.userId,
            "orgCd": fObj.orgCd,
            "apndFilePathNm": fileVal.substring(0,fileVal.lastIndexOf("\\")),
            "apndFileNm": fileVal.substring(fileVal.lastIndexOf("\\")+1),
            "trtrEno": gUserInfo.userEno,
            "status": "add",
            "apndFileSno" : 3
        }
    ];
    
    var reqParam = new FormData(form);
    
    $.callAjaxUpload(reqParam, "/be/gv/begv111p/uploadFile.do")
    .done(function(data) {
        
        if(data.result == "1") {
            $.fn.msgBox("정상적으로 처리되었습니다.");
            $("#uploadForm")[0].file.value = "";
            //insert 로직
            $.callAjax({"jsonStr":JSON.stringify(fObj)}, "/be/gv/begv111p/savePryDtRvwFile.do")
                .done(function(data) {
                    
            }).fail(function(data){
                console.log("파일데이터insert 실패!");
            }); 
            
        }
    }).fail(function(data){
        console.log("파일업로드 실패!");
    });     
}

/**
* @설명: 체크파일삭제
* @최초작성자: 임국빈 (61000420)
* @최초작성일: 2021. 10. 19.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  임국빈 (61000420) 2021. 10. 19. 최초작성
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
                    $("#gridDivFileList").jsGrid("reset");
                    $("#gridDivFileList").jsGrid("option", "data", []);
                    $("#gridDivFileList").jsGrid("destroy");
                    initGrid();
                    initParamData();
                    $.fn.msgBox("정상적으로 처리되었습니다.");
                    
                }
            }).fail(function(data){
            });
        }
    }, 2);
}

/**
 * @설명: 입력값 세팅
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function getInputData() {
    var obj = {};

    var reqAplcBe = $("#sbx_aplcBe").val();
    var reqAssScCd = $("#sbx_assScCd").val();
    var reqOrgCd = $("#ibx_orgCd").val();
    var reqOrgNm = $("#ibx_orgNm").val();
    var reqGvncRvwRsltScCd = $("#sbx_gvncRvwRsltScCd").val();
    var reqRvwCntnt01 = $("#tar_opn").val();
    var reqRvwCntnt02 = $("#tar_rpl").val();
    var userId = gUserInfo.userEno;
        
    obj["div"] = gDiv;
    obj["aplcBe"] = reqAplcBe;
    obj["assScCd"] = reqAssScCd;
    obj["orgCd"] = reqOrgCd;
    obj["gvncRvwRsltScCd"] = reqGvncRvwRsltScCd;
    obj["rvwCntnt01"] = reqRvwCntnt01;
    obj["rvwCntnt02"] = reqRvwCntnt02;
    obj["userId"] = userId;
    obj["stts"] = gStts;
    
    if($.fn.isEmpty(reqAplcBe)) {
        $.fn.msgBox("적용BE"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if($.fn.isEmpty(reqAssScCd)) {
        $.fn.msgBox("가정종류"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if($.fn.isEmpty(reqOrgCd)) {
        $.fn.msgBox("부서명"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    return obj;
}

/**
 * @설명: 의견 입력시 byte 계산
 * @최초작성자: 임국빈
 * @최초작성일: 2021. 9. 7
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  임국빈 2021. 9. 7 최초작성
 */
function getByteB(str) {
    var byte = 0;
    for(var i=0; i<str.length; ++i) {
        if(str.charCodeAt(i) > 127) {
            byte += 3;
        }else {
            byte++;
        }
    }
    return byte;
}

// 파일목록 Grid 생성
function initGrid() {
    // jsGrid 빈 테이블 생성
    var fileGridObject = new ComJsGrid({
        id: "gridDivFileList",
        height: 150,
        editing: false,
        sorting: false,
        paging: false,
        selectHiglight:true,
        controller : {
            insertItem : function(item) {
                $("#uploadForm")[0].file.value = item.fileVal;
                gNewFileCnt ++;
            },
            deleteItem : function(item) {
                //file타입으로 생성된 태그 삭제
                $("#newFile"+gNewFileCnt).remove();
                gNewFileCnt--;
            }
        },
        fields : [
            { name: "apndFileSno", title:"파일일련번호", css:"cell", type: "text", width: 100, editing: false, align:"left", visible:false},
            { name: "apndFilePathNm"   , title:"파일경로"    , css:"cell", type: "text", width: 50, editing: false, align:"left", visible:false},
            { name: "check", title:"선택", width: 3, sorting: false, align:"center", editing: false, itemTemplate:function(value, item) {
                var elem = $("<input>").attr("type", "checkbox").attr("checked", value|| item.Checked).on("change", function() {
                        item.Checked = $(this).is(":checked");
                    });
                return elem;
            }},
            { name: "apndFileNm"       , title:"파일명"    , css:"cell", type: "text", width: 100, editing: false, align:"left"},
            { name: "dtlPop"       , title:"다운"    , css:"cell", type: "text", width: 15, editing: false, align:"center",
                itemTemplate:function(value, item){
                    var status = item.status;
                    const btnFinPopup = (status=="add")?$("<button class='grid_inbtn_s'>").text("삭제"):$("<button class='grid_inbtn_s'>").text("다운");
                    var $pFinEl2 = $("<p>").addClass("fr");
                    var $aFinEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
                        // 배치실행 내역 조회팝업호출
                        console.log(JSON.stringify(item));
                        
                        if(status == "add") {
                            
                            addGridData(item);
                            
                        }else {
                            
                            $.fn.fileDownload("/mg/sy/mgsy911m/downloadFile.do?filePath=" + encodeURIComponent(item.apndFilePathNm + "/" + item.apndFileNm));
                        }
                    });
                    $aFinEl.append(btnFinPopup);
                    return $("<div style='display:inline-block;'>").append($pFinEl2.append($aFinEl));
                }
            }
        ]
    }); 

    //그리드 생성
    fileGridObject.gridCreate();
}

function checkFile(e){
    var file = e.files;
    if(file[0] && file) {
        if(file[0].size > 1024*1024*10) {
            $.fn.msgBox("10MB 이하 파일만 등록할 수 있습니다.");
            $("#uploadFile").val("");
        }   
    }
}

//사용자 정보 얻어오기
function loadUserInfo() {
    $.callAjax({}, "/main/selectSystemInfo.do").done(function(data) {
        gUserInfo = data.userInfo;
        if(gUserInfo.pesnNo == '68804716' || gUserInfo.orgNm == '선임계리사지원' || gUserInfo.orgNm == '선임계리사') {
            $("#tar_rpl").attr("disabled",false);
            $("#btn_delete").show();
            $("#btn_tmpSave2").show();
        } else {
            $("#tar_rpl").attr("disabled",true);
            $("#btn_delete").hide();
            $("#btn_tmpSave2").hide();
        }
        initParamData();
    }).fail(function(data){
        $.fn.msgBox("사용자정보 조회가 실패했습니다.");
    });
}