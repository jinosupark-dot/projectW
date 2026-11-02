/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 거버넌스 - 기초데이터검토 팝업
 * @설명: 거버넌스 - 기초데이터검토 팝업화면의 JS
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
var gFileList = [];
var gOpnList = [];
var gNewFileCnt = 0;
var gNewFileList = [];
var gUsrInfo = "";
var gLoginInfo;
var gSgOrgCd = "";
var gSgOrgNm = "";

$(document).ready(function(){
    
    $("#imgToolTip").attr("title", parent.viewPath);
    //$($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    gObjParam = opener.popupOption;
    
    //공통코드(통합수준코드) 콤보박스
    initCommCd();

    //파라메터세팅
    initParamData();
    
    //event 초기화
    initEvent();

    //그리드 초기화
    initGrid();
    
});


function initCommCd() {
    
    // 공통코드 조회(가정종류)
    $.fn.loadCommonCode(["ASS_SC_CD"]);
    $.fn.renderCombobox({
        codeArr: ["ASS_SC_CD"],
        selArr: ["sbx_assScCd"],
        useFirstOption: false       //첫번째 option 사용여부
    });
    
    // 공통코드 조회(적용BE)
    $.fn.getAplcBe("sbx_aplcBe",$("#sbx_assScCd option:selected").val());
    

    
}

function initParamData() {

    gUsrInfo = opener.popupOption.userInfo;
    gLoginInfo = opener.popupOption.loginInfo;
    gSgOrgCd = opener.popupOption.sgOrgCd;
    gSgOrgNm = opener.popupOption.sgOrgNm;
    //해당 rowData
    var gObjParamItem = opener.popupOption.item;
    
    //등록버튼으로 진입
    if(gObjParamItem == "undefined" || gObjParamItem == null) {
        gDiv = "add";
        $("#btn_delete").remove();
        $("#tr_fileList .clearfix").text("파일이 없습니다");
        $("#tr_opnList .clearfix").text("의견이 없습니다");
        //적용BE, 가정종류세팅
        $("#sbx_aplcBe").val(gObjParam.aplcBe).prop("selected",true);
        $("#sbx_aplcBe").attr("disabled", true);
        $("#sbx_assScCd").val(gObjParam.assScCd).prop("selected",true);
        $("#sbx_assScCd").attr("disabled", true);
        
        $("#ibx_reqYmd").val($.fn.dateFormat(opener.popupOption.today));
        
        $("#ibx_cmpltParngYmd").val($.fn.dateFormat(opener.popupOption.today));
    }
    //수정버튼으로 진입
    else {
        var $fileTagList = $("#ul_fileList");
        var $opnTagList = $("#tr_opnList .clearfix");
        gDiv = "mod";
        //적용BE, 가정종류세팅
        $("#sbx_aplcBe").val(gObjParamItem.aplcBeNm).prop("selected",true);
        $("#sbx_aplcBe").attr("disabled", true);
        $("#sbx_assScCd").val(gObjParamItem.assScCd).prop("selected",true);
        $("#sbx_assScCd").attr("disabled", true);
        
        $("#ibx_mesrCmpltYmd").val($.fn.dateFormat(gObjParamItem.mesrCmpltYmd));
        $("#ibx_fileNm").val(gObjParamItem.dtDtlVal);
        $("#ibx_trtr").val(gObjParamItem.pesnNo);
        $("#ibx_trtrNm").val(gObjParamItem.userNm);
        $("#ibx_orgCd").val(gObjParamItem.orgCd);
        $("#ibx_orgNm").val(gObjParamItem.orgNm);
        $("#ibx_reqYmd").val($.fn.dateFormat(gObjParamItem.reqYmd));
        $("#ibx_cmpltParngYmd").val($.fn.dateFormat(gObjParamItem.cmpltParngYmd));
        $("#sbx_cmpltYn").val(gObjParamItem.cmpltYn);
        gSeq = gObjParamItem.itmSeq;
        
        var reqParam = {};
        reqParam["aplcBeNm"] = gObjParamItem.aplcBeNm;
        reqParam["assScCd"] = gObjParamItem.assScCd;
        reqParam["orgCd"] = gObjParamItem.orgCd;
        reqParam["apndFileSno"] = 1;
        
        $.callAjax(reqParam, "/be/gv/begv111p/selectPryDtRvwFileList.do")
        .done(function(data) {
            var fileList = data.fileList;
            gFileList = fileList;
            
            $("#gridDivFileList").jsGrid("loadData", fileList).done(function() {
                //$(".jsgrid-header-row").attr("style", "display: none");
                if(fileList == null || fileList.length == 0){
                    $.fn.getReturnValue("gridDivFileList");
                }
            });
            
        }).fail(function(data){
            $.fn.msgBox("데이터조회를 실패했습니다.");
        });
        
        $.callAjax(reqParam, "/be/gv/begv111p/selectPryDtRvwOpnList.do")
        .done(function(data) {
            var opnList = data.opnList;
            gOpnList = opnList;
            
            $("#gridDivOpnList").jsGrid("loadData", opnList).done(function() {
                //$(".jsgrid-header-row").attr("style", "display: none");
                if(opnList == null || opnList.length == 0){
                    $.fn.getReturnValue("gridDivOpnList");
                }
            });
        }).fail(function(data){
            $.fn.msgBox("데이터조회를 실패했습니다.");
        });
        var key = gUsrInfo.userEno+"/기초데이터/"+$("#ibx_fileNm").val();
        $("#tar_opn").val(localStorage.getItem(key));
    }
    
}

function initEvent() {
    
    //날짜형식 체크
    $("#ibx_mesrCmpltYmd").on("change", function(e){
        $.isValidDate($("#ibx_mesrCmpltYmd").val().replaceAll("-",""));
    });
    $("#ibx_reqYmd").on("change", function(e){
        $.isValidDate($("#ibx_reqYmd").val().replaceAll("-",""));
    });
    $("#ibx_cmpltParngYmd").on("change", function(e){
        $.isValidDate($("#ibx_cmpltParngYmd").val().replaceAll("-",""));
    });
    
    //요청완료일 datepicker
    $("#btn_mesrCmpltYmd").on("click", function(e){
        $("#ibx_mesrCmpltYmd").datepicker("show");
    });
    
    //요청일 datepicker
    $("#btn_reqYmd").on("click", function(e){
        $("#ibx_reqYmd").datepicker("show");
    });
    
    //예상완료일 datepicker
    $("#btn_cmpltParngYmd").on("click", function(e){
        $("#ibx_cmpltParngYmd").datepicker("show");
    });
    
    //담당자 검색 팝업창
    $("#btn_trtrSearch").on("click", function(e){
        callPopupUserSearch();
    });
    
    //의견입력 textarea 키입력 이벤트
    $("#tar_opn").on("keydown", function(e){
        $("#lb_opn").text(getByteB($("#tar_opn").val()));
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
            "apndFileSno" : 1
        };
        addGridData(item,fileVals,"add");
    });
    
    //데이터확인 테스트
    $("#btn_confirm").on("click", function(e){
        getInputData();
    });
    
    $("#btn_save").on("click", function(e){
        var reqParam = getInputData();
        if(reqParam != false) {
            $.fn.msgBox("데이터를 저장하시겠습니까?", function (obj) {
                if (obj.btn_ok) {
                    $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/gv/begv111p/savePryDtRvw.do")
                    .done(function(data) {
                        if(data.result == "1") {
                            uploadFile();
                            $.fn.msgBox("정상적으로 처리되었습니다.", function(){
                                if(gDiv == "add") {
                                    opener.openAddPopup_callback(reqParam);
                                }else {
                                    opener.openModPopup_callback(reqParam);
                                }
                                var key = gUsrInfo.userEno+"/기초데이터/"+$("#ibx_fileNm").val();
                                localStorage.removeItem(key);
                                window.close();
                            });
                        }else if(data.result == "0"){
                            $.fn.msgBox("기존에 등록된 부서입니다.");
                        }else {
                            $.fn.msgBox("데이터 저장이 실패했습니다.");
                        }
                    }).fail(function(data){
                        $.fn.msgBox("데이터 저장이 실패했습니다.");
                    });
                }
            }, 2);
        }
    });
    
    
    $("#btn_delete").on("click", function(e){
        var reqParam = getInputData();
        $.fn.msgBox("데이터를 삭제하시겠습니까?", function (obj) {
            if (obj.btn_ok) {
                $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/gv/begv111p/deletePryDtRvw.do")
                .done(function(data) {
                    if(data.result == "1") {
                        $.fn.msgBox("정상적으로 처리되었습니다.", function(){
                            window.close();
                            opener.openModPopup_callback(reqParam);
                        });
                    }
                }).fail(function(data){
                    $.fn.msgBox("데이터 삭제에 실패했습니다.");
                });
            }
        }, 2);
    });
    
    $("#btn_tmpSave").on("click", function(e){
        $.fn.msgBox("의견을 임시저장하시겠습니까?", function (obj) {
            if (obj.btn_ok) {
                var key = gUsrInfo.userEno+"/기초데이터/"+$("#ibx_fileNm").val();
                localStorage.setItem(key, $("#tar_opn").val());
                if(localStorage.getItem(key)) {
                    $.fn.msgBox("저장되었습니다.");
                }
            }
        }, 2);
    });
    
    //파일삭제
    $("#btn_deleteFiles").on("click", function(e){
        deleteFile();
    });
    
    //의견삭제
    $("#btn_deleteOpns").on("click", function(e){
        deleteOpn();
    });
    
    //팝업창 닫기
    $("#btn_closePopup").on("click", function(e){
        window.close();
    });
}

function getInputData() {
    var obj = {};

    var reqAplcBe = $("#sbx_aplcBe").val();
    var reqAssScCd = $("#sbx_assScCd").val();
    var reqDtDtlVal = $("#ibx_fileNm").val();
    var reqMesrCmpltYmd = $("#ibx_mesrCmpltYmd").val().replaceAll("-","");
    var reqFileNm = $("#ibx_fileNm").val();
    var reqOrgCd = $("#ibx_orgCd").val();
    var reqOrgNm = $("#ibx_orgNm").val();
    var reqUserId = $("#ibx_trtr").val();
    var reqPesnNm = $("#ibx_trtrNm").val();
    var reqReqYmd = $("#ibx_reqYmd").val().replaceAll("-","");
    var reqCmpltParngYmd = $("#ibx_cmpltParngYmd").val().replaceAll("-","");
    var reqCmpltYn = $("#sbx_cmpltYn").val();
    if(reqCmpltYn == "Y") {
        var now = new Date();
        var y = now.getFullYear();
        var m = ("0" + (1 + now.getMonth())).slice(-2);
        var d = ("0" + now.getDate()).slice(-2);
        reqCmpltParngYmd = y+m+d;
    }
    var reqRvwCntnt = $("#tar_opn").val();
    
    obj["div"] = gDiv;
    if(gDiv=="mod") {
        obj["itmSeq"] = gSeq;
    }
    obj["aplcBe"] = reqAplcBe;
    obj["aplcBeNm"] = reqAplcBe;
    obj["assScCd"] = reqAssScCd;
    obj["dtDtlVal"] = reqDtDtlVal;
    obj["mesrCmpltYmd"] = reqMesrCmpltYmd;
    obj["fileNm"] = reqFileNm;
    obj["orgCd"] = reqOrgCd;
    obj["userId"] = reqUserId;
    obj["reqYmd"] = reqReqYmd;
    obj["cmpltParngYmd"] = reqCmpltParngYmd;
    obj["cmpltYn"] = reqCmpltYn;
    
    var fileList = $("#gridDivFileList").jsGrid("option", "data");
    obj["rvwCntnt"] = reqRvwCntnt;
    obj["trtrEno"] = gUsrInfo.userEno;
    
//    console.log(reqAplcBe);
//    console.log(reqAssScCd);
//    console.log(reqFileNm);
//    console.log(reqOrgCd);
//    console.log(reqOrgNm);
//    console.log(reqUserId);
//    console.log(reqPesnNm);
//    console.log(reqReqYmd);
//    console.log(reqMesrCmpltYmd);
//    console.log(reqCmpltParngYmd);
//    
//    console.log(JSON.stringify(fileList));
//    console.log(reqRvwCntnt);
    
    
    if($.fn.isEmpty(reqAplcBe)) {
        $.fn.msgBox("적용BE"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if($.fn.isEmpty(reqAssScCd)) {
        $.fn.msgBox("가정종류"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if($.fn.isEmpty(reqMesrCmpltYmd)) {
        $.fn.msgBox("요청완료일"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }   

    if($.fn.isEmpty(reqFileNm)) {
        $.fn.msgBox("파일명"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if($.fn.isEmpty(reqOrgCd)) {
        $.fn.msgBox("부서명"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if($.fn.isEmpty(reqUserId)) {
        $.fn.msgBox("담당자"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }

    if($.fn.isEmpty(reqReqYmd)) {
        $.fn.msgBox("요청완료일자"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if($.fn.isEmpty(reqCmpltParngYmd)) {
        $.fn.msgBox("완료예정일자"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    if(reqCmpltParngYmd < reqReqYmd) {
        $.fn.msgBox("완료예정일보다 요청일자가 늦을 수 없습니다.");
        return false;
    } 
    
    if($.fn.isEmpty(reqCmpltYn)) {
        $.fn.msgBox("완료여부"  + "을(를) 입력하시기 바랍니다.");
        return false;
    }
    
    return obj;
    

}

/**
 * @설명: 사원검색 팝업을 호출한다.
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
 * @설명: 사원조회 팝업 콜백
 * @최초작성자: 임국빈
 * @최초작성일: 2021.08.26
 * @최종변경일:
 * @매개변수: 
 * @반환값:
 * @개정이력: 임국빈 2021.08.26 최초작성
 */
function resultUserPopup_callback(resultObj){
    console.log("resultTablePopup_callback   resultObj", JSON.stringify(resultObj));
    if(gDiv == "mod" && resultObj.orgNo != opener.popupOption.item.orgCd) {
        $.fn.msgBox(opener.popupOption.item.orgNm + " 부서만 입력가능합니다.");
        return;
    }
    if(resultObj.orgNo == gSgOrgCd) {
        $.fn.msgBox(gSgOrgNm +" 부서는 입력불가능합니다.");
        return;
    }

    $("#ibx_trtr").val(resultObj.userEno);
    $("#ibx_trtrNm").val(resultObj.userNm);
    $("#ibx_orgCd").val(resultObj.orgNo);
    $("#ibx_orgNm").val(resultObj.orgNm);
}

function addGridData(item,fileVals,flag) {
    var dataList = $("#gridDivFileList").jsGrid("option", "data");
    
    if(dataList.length == 0) {
        $("#gridDivFileList").jsGrid("loadData", dataList).done(function() {
            
        });
    }
    //첨부파일 그리드에 추가
    if(flag == "add") {
        
        for(var i=0; i<fileVals.length; i++) {

            $("#gridDivFileList").jsGrid("insertItem", 
                {
                  "aplcBeNm": item.aplcBeNm,
                  "assScCd": item.assScCd,
                  "userId": item.userId,
                  "orgCd": item.orgCd,
                  "fileVal": fileVals[i],
                  "apndFilePathNm": fileVals[i].substring(0,fileVals[i].lastIndexOf("\\")),
                  "apndFileNm": fileVals[i].substring(fileVals[i].lastIndexOf("\\")+1),
                  "status": "add"
                }
            );
        }
    }
    //추가된 첨부파일 그리드에서 삭제
    else {
        $("#gridDivFileList").jsGrid("deleteItem", item);

    }
    //$(".jsgrid-header-row").attr("style", "display: none");
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
            "trtrEno": gLoginInfo.loginId,
            "status": "add",
            "apndFileSno" : 1
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
                    initParamData();
                    //initGrid();
                    $.fn.msgBox("정상적으로 처리되었습니다.");
                    
                }
            }).fail(function(data){
            });
        }
    }, 2);
}

/**
* @설명: 체크의견삭제
* @최초작성자: 임국빈 (61000420)
* @최초작성일: 2021. 10. 19.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  임국빈 (61000420) 2021. 10. 19. 최초작성
*/
function deleteOpn() {
    reset = 1;
    var list = $("#gridDivOpnList").jsGrid("option", "data");
    var delList = [];
    for(var i=0; i<list.length; i++) {
        var item = list[i];
        if(item.Checked) {
            delList.push(item);
        }
    }
    if(delList.length ==0) {
        $.fn.msgBox("삭제할 의견을 체크하세요.");
        return;
    }
    $.fn.msgBox("선택한 의견을 삭제 하시겠습니까?", function (obj) {
        if(obj.btn_ok) {
            $.callAjax({"list": JSON.stringify(delList)}, "/be/gv/begv111p/deleteOpnList.do")
            .done(function(data) {
                if(data.result == "1") {
                    initParamData();
                    //initGrid();
                    $.fn.msgBox("정상적으로 처리되었습니다.");
                    
                }
            }).fail(function(data){
            });
        }
    }, 2);
}


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

function checkFile(e){
    
    var file = e.files;
    if(file[0] && file) {
        if(file[0].size > 1024*1024*10) {
            $.fn.msgBox("10MB 이하 파일만 등록할 수 있습니다.");
            $("#uploadFile").val("");
        }   
    }
    
}

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
                //file탑입으로 태그 생성
                //var $input = "<input type='file' id='newFile" + gNewFileCnt + "' name='newFile" + gNewFileCnt + "'/>";
                //$("#uploadTemp").append($input);
                //$("#newFile" + gNewFileCnt).val(item.fileVal);
                //$("#newFile" + gNewFileCnt).hide();
                //var $input = "<input type='file' id='file' name='file' value='" + item.fileVal +"'/>";
                //$("#uploadForm").append($input);
                //$("#file").val(item.fileVal);
                
                $("#uploadForm")[0].file.value = item.fileVal;
                //$("#file").hide();
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
                //if (item.treeId == "..") elem.attr("disabled", "true");
                //elem.attr("style", "width:5px");
                return elem;
            }},
            { name: "apndFileNm"       , title:"파일명"    , css:"cell", type: "text", width: 100, editing: false, align:"left"},
            { name: "dtlPop"       , title:"다운"    , css:"cell", type: "text", width: 15, editing: false, align:"center",
                itemTemplate:function(value, item){
                    var status = item.status;
                    const btnFinPopup = (status=="add")?$("<button class='grid_inbtn_s' style='width:7px'>").text("삭제"):$("<button class='grid_inbtn_s'>").text("다운");
                    var $pFinEl2 = $("<p>").addClass("fr");
                    var $aFinEl = $("<a>").attr("href", "javascript:void(0);").on("click", function() {
                        // 배치실행 내역 조회팝업호출
                        
                        if(status == "add") {
                            
                            addGridData(item);
                            
                        }else {
                            
                            $.fn.fileDownload("/mg/sy/mgsy911m/downloadFile.do?filePath=" + encodeURIComponent(item.apndFilePathNm + "/" + item.apndFileNm));
                        }
                    });
                    
                    $aFinEl.append(btnFinPopup);
                    //$(".jsgrid-header-row").attr("style", "display: none");
                    return $("<div style='display:inline-block;'>").append($pFinEl2.append($aFinEl));
                }
            }
            //,{ name: "gridManupulate", title:"그리드조작", css:"cell", type: "control",  width: 15, align:"left"}
            
        ]
    }); 
    
    var opnGridObject = new ComJsGrid({
        id: "gridDivOpnList",
        height: 150,
        editing: false,
        sorting: false,
        paging: false,
        selectHiglight:true,
        rowClass: function(item, itemIndex){
            return "file_list";
        },
        fields : [
            { name: "hstrSno"       , title:"이력일련번호", css:"cell", type: "text", width: 100, editing: false, align:"left", visible:false},
            { name: "check", title:"선택", width: 3, sorting: false, align:"center", editing: false, itemTemplate:function(value, item) {
                var elem = $("<input>").attr("type", "checkbox").attr("checked", value|| item.Checked).on("change", function() {
                        item.Checked = $(this).is(":checked");
                    });
                //if (item.treeId == "..") elem.attr("disabled", "true");
                //elem.attr("style", "width:5px");
                return elem;
            }},
            { name: "rvwCntnt"       , title:"의견내용"    , css:"cell", type: "text", width: 80, editing: false, align:"left"},
            { name: "trtrEno"       , title:"처리자"    , css:"cell", type: "text", width: 20, editing: false, align:"center"},
            { name: "trtDtm"       , title:"처리일자"    , css:"cell", type: "text", width: 35, editing: false, align:"center"}
            
        ]
    }); 
    
    // row click
    opnGridObject.rowDoubleClick(function(args) {
        
        if($("#tar_opn").val() != "") {
            $.fn.msgBox("선택한 의견을 불러옵니다.\n입력한 의견은 지워집니다.", function(obj){
                if (obj.btn_ok) {
                    $("#tar_opn").val(args.item.rvwCntnt);
                }
            }, 2);
        }else {
            $("#tar_opn").val(args.item.rvwCntnt);
        }
    });

    //그리드 생성
    fileGridObject.gridCreate();
    opnGridObject.gridCreate();
    
}