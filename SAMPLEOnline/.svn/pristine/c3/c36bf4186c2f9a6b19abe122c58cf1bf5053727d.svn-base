/**
 * 가정고도화를 위한 공통js
 */
/*************************************
 * 사용자 정의 함수
 *************************************/
(function ($) {
    /*********************가정고도화 추가 start*****************************/
    /**
     * 
     * @설명: 배열 비교
     * ex) arr.equals(arr2);
     * @최초작성자: 임국빈
     * @최초작성일: 2021. 09. 28.
     * @최종변경일: 2021. 09. 28.
     * @매개변수: Array
     * @반환값: true / false
     * @개정이력: 
     *  임국빈 2021. 09. 28. 최초작성
     */ 
    Array.prototype.equals = function(getArray) {
        if(this.length != getArray.length) return false;
        
        for(var i=0; i<getArray.length; i++) {
            if(this[i] instanceof Array && getArray[i] instanceof Array) {
                if(!this[i].equals(getArray[i])) return false;
            }else if(this[i] != getArray[i]) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * 
     * @설명: 카멜표기법을 팟홀표기법으로 변환해준다.
     * ex)$.toUnderscore("imKukBeen");
     * @최초작성자: 임국빈
     * @최초작성일: 2021. 07. 19.
     * @최종변경일: 2021. 07. 19.
     * @매개변수: strCamel (카멜표기문자)
     * @반환값: underscore (팟홀표기)
     * @개정이력: 
     *  임국빈 2021. 07. 19. 최초작성
     */ 
    $.toUnderscore = function(strCamel) {
        
        if(typeof strCamel == "number") {
            return strCamel.toString();
        }
        return strCamel.replace(/[A-Z0-9]/g, function(upp,i,st) {
            return (i==0?"":"_") + upp.toLowerCase();
        });
    };
    /**
     * 
     * @설명: 팟홀표기법을 카멜표기법으로 변환해준다.
     * ex)$.toCamel("im_kuk_been");
     * @최초작성자: 임국빈
     * @최초작성일: 2021. 07. 19.
     * @최종변경일: 2021. 07. 19.
     * @매개변수: strUnderscore (팟홀표기 문자열)
     * @반환값: camel (카멜표기 문자열)
     * @개정이력: 
     *  임국빈 2021. 07. 19. 최초작성
     */
    $.toCamel = function(strUnderscore) {
        
        if(typeof strUnderscore == "number") {
            return strUnderscore.toString();
        }
        return strUnderscore.toLowerCase().replace(/(\_[a-z0-9])/g, function(arg) {
            return arg.toUpperCase().replace("_","");
        });
        
    };

    $.fn.deleteTotalCode = function(arr) {
        
        for(var i=0; i<arr.length-1; i++) {
            $._commonObj["code"][arr[i]].pop();
        }
    };
    
    /**
     * @설명: SQL 조회 년도 가변적 세팅
     * @부가설명: 적용BE에 대한 from to로 연도별 비중의 연도list를 얻는다
     * @최초작성자: 이현수
     * @최초작성일: 2021. 7. 14
     * @최종변경일: 
     * @매개변수: "201507" "202006"
     * @반환값: ["2016","2017","2018","2019","2020"]
     * @개정이력: 
     *  이현수 2021. 7. 14 최초작성
     *  임국빈 2021. 7. 20 현업과 혐의후 변경
     */
    $.fn.getFinYearArr = function(finYmFrom, finYmTo) {
        var finYearArr = [];
        var dateFrom = new Date(finYmFrom.substring(0,4), finYmFrom.substring(4,6)-1);
        var dateTo = new Date(finYmTo.substring(0,4), finYmTo.substring(4,6)-1);
        var yFrom = dateFrom.getFullYear();
        var yTo = dateTo.getFullYear();
        var gapFromTo = yTo - yFrom;
        
        for (var i = yFrom; i <= yTo; i++) {
            dateFrom.setMonth(dateFrom.getMonth()+11);
            if(dateFrom > dateTo) break;
            finYearArr.push(dateFrom.getFullYear());
            dateFrom.setMonth(dateFrom.getMonth()+1);
        }
        return finYearArr;
    };
    
    /**
     * 
     * @설명: 각 가정의 부가정보 적용BE정보를 가져온다.
     * ex)$.getAplcBe();
     * @최초작성자: 임국빈
     * @최초작성일: 2021. 07. 16.
     * @최종변경일: 2021. 07. 16.
     * @매개변수: assScCd (최적가정구분코드)
     * @반환값: list
     * @개정이력: 
     *  임국빈 2021. 07. 16. 최초작성
     */
    $.fn.getAplcBe = function(selId,assScCd,pAplcBeList) {
        //null 체크
        if(typeof assScCd === "undefined" || assScCd == null || assScCd == "") {
            $.fn.msgBox("조회할 가정코드가 존재하지 않습니다.");
            return;
        }
        
        var reqParam = {
                "assScCd" : assScCd,
        };
        
        var aplcBeList = [];
        //be리스트를 직접 받는경우
        if(typeof pAplcBeList != "undefined" && pAplcBeList.length != 0) {
            aplcBeList = pAplcBeList;
        }
        //be리스트를 가져와야 하는경우
        else {
            //공통코드 유효값 조회
            $.callAjax(reqParam, "/be/pd/commonBe/selectAplcBeList.do",{async:false})
            .done(function(data) {
                aplcBeList = data.aplcBeList;

            }).fail(function(data) {
                console.log("fail to fn.getAplcBe!!!!");
            });
        }
        try {
            var $targetId = $("#" + selId);
            if($targetId.length > 0) {
                $targetId.children().remove();

                for(var i=0; i<aplcBeList.length; i++) {
                    var $oEl;
                    $oEl = $("<option>").attr("value", aplcBeList[i].aplcBeNm).text(aplcBeList[i].aplcBeNm);
                    $targetId.append($oEl);
                }
            }
        } catch(e) {
            console.log("적용BE 콤보 세팅 중 에러 발생!!!! [SelectBox ID] ===> " + selId);
        }
        
        return aplcBeList;
    };
    
    /**
     * 
     * @설명: 검색조건의 내용을 xlsx 파일로 export시 전송할 용도.
     * ex)$.getObjSrchCond();
     * @최초작성자: 임국빈
     * @최초작성일: 2021. 06. 03.
     * @최종변경일: 2021. 06. 03.
     * @매개변수: paramObj 
     *  paramObj.id : grid id
     *  paramObj.fileName : 파일명 (gird.xlsx)
     *  paramObj.applyItemTemplate : 그리드의 itemTemplate 적용 여부(디스플레이 포맷: true/false)
     * @반환값: object
     * @개정이력: 
     *  임국빈 2021. 06. 03. 최초작성
     */
    $.fn.getSearchCond = function(pObjCond) {
        //조회조건 object변수선언
        var objCond = {
            "시작년월": $.fn.monthFormat(pObjCond.finYmFrom, "-"),
            "종료년월": $.fn.monthFormat(pObjCond.finYmTo, "-"),
            "hierarchyAllNm": []
        };
        
        if (pObjCond.ec == "EC"){
        	return objCond;
        }
        
        // 해지율 조회조건 추가
        if(pObjCond.rscRatCombo) {
            if(pObjCond.rscRatCombo == "basRscRat") {
                objCond["조회조건"] = "기본해지율";
            } else if (pObjCond.rscRatCombo == "incrEfcCtrlRat") {
                objCond["조회조건"] = "유보증가효과조정율";
            }
        }
        // 집계기준 추가
        if(pObjCond.smupStnd) {
            if(pObjCond.smupStnd == "01") {
                objCond["집계기준"] = "건수";
            } else if (pObjCond.smupStnd == "02") {
                objCond["집계기준"] = "금액";
            }
        }
        // 조회기준 추가
        if(pObjCond.srhType) {
            if(pObjCond.srhType == "01") {
                objCond["조회기준"] = "대출잔액율";
            } else if (pObjCond.srhType == "02") {
                objCond["조회기준"] = "신규대출율";
            } else if (pObjCond.srhType == "03") {
                objCond["조회기준"] = "중도상환율";
            }
        }
        // 기준구분 추가
        if(pObjCond.stndSc) {
            if(pObjCond.stndSc == "1") {
                objCond["기준구분"] = "주특합산기준";
            } else if (pObjCond.stndSc == "2") {
                objCond["기준구분"] = "주계약기준";
            }
        }
        
        //전체하이라키
        var arrChy = [];
        $("input:checkbox[name='hierarchy_check']").each(function(e) {
            var colId = $(this).val();
            objCond.hierarchyAllNm.push($.toUnderscore(colId));
            arrChy.push($("label[for='"+ $(this).attr("id") +"']").text());
        });
        //체크한 하이라키
        var hierarchyChk = [];
        $("input:checkbox[name='hierarchy_check']:checked").each(function(e) {
            var colId = $(this).val();
            hierarchyChk.push($.toUnderscore(colId));
        });
        //체크한 하이라키에 체크모양 push
        for(var i=0; i<objCond.hierarchyAllNm.length; i++) {
            var obj = {};
            var nm = arrChy[i];

            for( var ii=0;ii<hierarchyChk.length;ii++) {
                if(objCond.hierarchyAllNm[i] == hierarchyChk[ii]) {
                    obj[nm] = "▣";
                    break;
                } else {
                    obj[nm] = "□";
                }
            }
            arrChy.push(obj);
        }
        
        //object타입이 아닌 값 삭제
        var arrObjChy = [];
        for(var i=0; i<arrChy.length; i++) {
            if(typeof arrChy[i] == "object") {
                arrObjChy.push(arrChy[i]);
            }
        }
        
        //하이라키 yn세팅 값
        objCond["hierarchyAllYn"] = arrObjChy;
        //원오프 세팅 값
        objCond["One-off 반영"] = oneOffChk()?"▣":"□";
        return objCond;
    }
    
    /**
     * 
     * @설명: 검색조건의 내용을 xlsx 파일로 export시 전송할 용도.
     * ex)$.getObjSrchCond();
     * @최초작성자: 임국빈
     * @최초작성일: 2021. 09. 30.
     * @최종변경일: 2021. 09. 30.
     * @매개변수: paramObj
     *  PROD : 산출적용 
     *  ADTN : 부가정보
     * @반환값: object
     * @개정이력: 
     *  임국빈 2021. 06. 03. 최초작성
     */
    $.fn.getSearchCondSub = function(pDiv) {
        //조회조건 object변수선언
        var objCond = {
            "적용BE": $("#sbx_aplcBe").val()
        };
        
        //부가정보는 적용BE만 넘겨줌
        if(pDiv == "ADTN") {
            return objCond;
        }
        
        //직전년도
        objCond["직전년도BE비교"] = comprBe()?"▣":"□";  //pObjCond.jsBfrYear=="Y"?"▣":"□"; //
        //원오프 세팅 값
        objCond["One-off 반영"] = oneOffChk()?"▣":"□";  //pObjCond.rtfBfcOneOff=="03"?"▣":"□"; //
        
        return objCond;
    }
    
    /**
     * 
     * @설명: 모니터링 검색조건의 내용을 xlsx 파일로 export시 전송할 용도.
     * ex)$.getObjSrchCond();
     * @최초작성자: 임국빈
     * @최초작성일: 2021. 09. 30.
     * @최종변경일: 2021. 09. 30.
     * @매개변수: paramObj
     * @반환값: object
     * @개정이력: 
     *  임국빈 2021. 06. 03. 최초작성
     */
    $.fn.getSearchCondSubMntr = function(aplcBe) {
        //조회조건 object변수선언
        var objCond = {
            "적용BE": aplcBe
        };
        return objCond;
    }
    
    function comprBe() {
        if($('input:checkbox[id="cbx_comprBe"]').is(":checked") || $('input:checkbox[id="cbx_jsBfrYear"]').is(":checked")) {
            return true;
        } else {
            return false;
        }
    }
    
    function oneOffChk() {
        if($('input:checkbox[id="cbx_oneOff"]').is(":checked") || $('input:checkbox[id="chk_oneoff_check"]').is(":checked") 
                || $('input:checkbox[id="cbx_oneoff"]').is(":checked") || $('input:checkbox[id="oneoff_check"]').is(":checked")) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 
     * @설명: jsGrid들의 내용을 xlsx 파일로 export한다.(그리드 2개이상 sheet별 export)
     * ex)$.exportMultiGridExcel([{
                id: 'gridExcelDiv1',
                sheetName: '시트명',
                fileName: fileName},
                {id: 'gridExcelDiv2',
                fileName: fileName,
                sheetName: '시트명',
                //검색조건(필수X)
                searchCond: $.fn.getSearchCond(["inp_finYm_from","inp_stactStartDate_from","inp_actFinDeptNm","srch_sbx_actLv01Cd","srch_cbx_01Cd","srch_cbx_02Cd","srch_cbx_03Cd"])},
                ...,
                {id: 'gridExcelDivN',
                sheetName: '시트명',
                fileName: fileName}
            }]);
            
     * @최초작성자: 임국빈
     * @최초작성일: 2021. 06. 03.
     * @최종변경일: 2021. 06. 03.
     * @매개변수: paramObj 
     *  paramObj.id : grid id
     *  paramObj.fileName : 파일명 (gird.xlsx)
     *  paramObj.applyItemTemplate : 그리드의 itemTemplate 적용 여부(디스플레이 포맷: true/false)
     * @반환값: void
     * @개정이력: 
     *  임국빈 2021. 06. 03. 최초작성
     */
    $.fn.exportMultiGridExcel = function(paramObjList){

        var wb = XLSX.utils.book_new();
        
        var fileName = "";
        var gridId = "";
        var checkVisible = true;
        var applyItemTemplate = (typeof paramObjList[0].applyItemTemplate != 'undefined') ? paramObjList[0].applyItemTemplate:false;
        var newWorksheet = "";
        
        var gridIds = [];
        var checkVisibles = [];
        var applyItemTemplates = [];
        var newWorksheets = [];
        
        var fieldLen = 0;
        
        fileName = paramObjList[0].fileName || "export_grid.xlsx";
        if(!fileName.toLowerCase().endsWith(".xlsx")) fileName + ".xlsx";   
        var excelHandler = {
                getExcelFileName : function(){
                    return fileName;
                },
                getSheetName : function(){
                    return "sheet1";
                },
                getSearchCond : function(idx){
                    if(paramObjList[0].searchCond == null) return;
                    var arrSrchCond = [];
                    var ws = XLSX.utils.aoa_to_sheet([]);

                    var objSrch = paramObjList[0].searchCond;
                    for(var key in objSrch) {
                        //하이라키 코드명
                        if(key == "hierarchyAllNm") {
                            
                        }//하이라키 한글명:□/▣
                        else if(key == "hierarchyAllYn") {
                            
                            for(var i=0; i<objSrch[key].length; i++) {
                                var objSrchChk = objSrch[key][i];
                                for(var ckey in objSrchChk) {
                                    arrSrchCond.push(objSrchChk[ckey]);
                                    arrSrchCond.push(ckey);
                                    arrSrchCond.push("");
                                }
                            }
                        }//One-off반영
                        else if(key == "One-off 반영" || key == "직전년도BE비교") {
                            arrSrchCond.push(objSrch[key]);
                            arrSrchCond.push(key);
                            arrSrchCond.push("");
                        }//일반 수치값
                        else {
                            arrSrchCond.push(key);
                            arrSrchCond.push(objSrch[key]);
                            arrSrchCond.push("");
                        }
                    }

                    XLSX.utils.sheet_add_aoa(ws, [arrSrchCond], {origin: "A1"});
                    var fieldLen = $("#" + paramObjList[0].id).jsGrid("option", "fields").length-1;
                    var arrAlphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
                                      ,"AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ"];
                    if(paramObjList[idx].unit != "X") {
                        XLSX.utils.sheet_add_aoa(ws, [["(단위:" + paramObjList[idx].unit + ")"]], {origin: arrAlphabet[fieldLen]+"3"});
                    }
                    return ws;
                },
                getExcelData : function(gridId,applyItemTemplate){
                    var _data = $("#" + gridId).jsGrid("option", "data");
                    var _fields = $("#" + gridId).jsGrid("option", "fields");
                    var excelObjList = [];
                    
                    //0건에도 타이틀 헤더가 나오도록 요청, 빈 데이터 한건 삽입 처리 - 2021.02.09
                    if(_data.length == 0) {
                        var dummyObj = {};
                        for(var i=0; i<_fields.length; i++) {
                            var field = _fields[i];
                            dummyObj[field.name] = "";
                        }
                        _data.push(dummyObj);
                    }

                    $.each(_data, function(key, value){
                        var excleObj = {};
                        $.grep(_fields, function( field ){
                            
                            for(var key in value){
                                if(field.title && field.visible != false){                                  
                                    var fTitle = field.title;
                                    //체크박스 컬럼인 경우 제외
                                    if($.fn._isExportFieldColumn(field, checkVisible)){
                                        if( field.name === key ){
                                            var kvalue = String(value[key]);
                                            if(kvalue.indexOf("checkbox") == -1){
                                                kvalue = field.itemTemplate(value[key], value);
                                                if(applyItemTemplate && field.itemTemplate) {   
//                                                  kvalue = field.itemTemplate(kvalue, value);
                                                    if(field.type == "select") {
                                                        excleObj[field.title] = kvalue;
                                                    }else {
                                                        excleObj[field.title] = value[key];
                                                    }
                                                } else {
                                                    if(field.type == "select") {
                                                        if(value[key] == null || value[key] == "합계" || value[key] == "025" || value[key] == "026" || value[key] == "027"
                                                            || value[key] == "045" || value[key] == "046" || value[key] == "047") {
                                                            excleObj[field.title] = kvalue;
                                                        }else {
                                                            excleObj[field.title] = value[key];
                                                        }
                                                    }else {
                                                        excleObj[field.title] = value[key];//parseFloat(value[key]);
                                                    }
                                                    
                                                }
                                                
                                            }
                                        }
                                    }
                                }
                            }                       
                        });
                        excelObjList.push(excleObj);
                    });
                    return excelObjList
                },
                getWorksheet : function(gridId,applyItemTemplate,idx){
                    
                    var startCell = "A1";
                    if(paramObjList[0].searchCond != null) startCell = "A4";//paramObjList[0].searchCond.length+3;
                    return XLSX.utils.sheet_add_json(this.getSearchCond(idx), this.getExcelData(gridId,applyItemTemplate), {origin: startCell});
                }
        }
        
        for(var i=0; i<paramObjList.length; i++) {
            gridIds[i] = paramObjList[i].id;
            checkVisibles[i] = (typeof paramObjList[i].applyItemTemplate != 'undefined') ? paramObjList[i].applyItemTemplate:false;
            applyItemTemplates[i] = (typeof paramObjList[i].applyItemTemplate != 'undefined') ? paramObjList[i].applyItemTemplate:false;
            newWorksheets[i] = excelHandler.getWorksheet(gridIds[i],applyItemTemplates[i],i);
            
            //컬럼갯수만큼 width값 설정
            fieldLen = $("#" + gridIds[i]).jsGrid("option", "fields").length;
            newWorksheets[i]["!cols"] = [];
            for(var j=0; j < fieldLen; j++) {
                newWorksheets[i]["!cols"].push({width:16});
            }
            
            XLSX.utils.book_append_sheet(wb, newWorksheets[i], paramObjList[i].sheetName);
        }

        var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
        saveAs(new Blob([$.fn._s2ab(wbout)], {type:"application/octet-stream"}), excelHandler.getExcelFileName());
    };
    
    $.fn.getTbCols = function(tbNm) {
        //null 체크
        if(typeof tbNm === "undefined" || tbNm == null || tbNm == "") {
            $.fn.msgBox("조회할 테이블이 존재하지 않습니다.");
            return;
        }
        //기초데이터, 산출적용, 부가정보 화면 구분값
        var div = $.fn.getMenuId().substring(6,7);
        var reqParam = {
                "tbNm" : tbNm,
        };
        var tbColsList = [];        
        var arrCols = [];

        //공통코드 유효값 조회
        $.callAjax(reqParam, "/be/pd/commonBe/selectTbColsList.do",{async:false})
        .done(function(data) {
            console.log("=====loadTbCols done!");
            tbColsList = data.tbColsList;           


        }).fail(function(data) {
            console.log("fail to fn.getTbCols!!!!");
        });
        
        return tbColsList;
        
    }
    
    $.fn.createTmpExcelGrid = function(gArrTbCols) {
        var resultArr = [];
        var fieldsArr = [];
        
        for(var i=0; i<gArrTbCols.length; i++) {
            var resultMap = {};
            field = { name: $.toCamel(gArrTbCols[i].columnName), title: gArrTbCols[i].columnKraName, css:"cell", type: (gArrTbCols[i].dataType=="NUMBER")?"number":"text",  width: 30, editing: false, align:"center" };
            resultMap["colNm"] = gArrTbCols[i].columnName;
            resultMap["dataType"] = gArrTbCols[i].dataType;
            resultMap["pkYn"] = gArrTbCols[i].pkYn;
            resultArr.push(resultMap);
            fieldsArr.push(field);
        }

        var gridObject = new ComJsGrid({
            id: "gridTmpDiv",
            height: 0,
            editing: false,
            sorting: true,
            paging: true,
            fields : fieldsArr
        }); 
        //그리드 생성
        gridObject.gridCreate();
        return resultArr;
    };
    
    $.fn.createTmpExcelGridSub = function(gArrTbCols) {
        var resultArr = [];
        var fieldsArr = [];
        
        for(var i=0; i<gArrTbCols.length; i++) {
            var resultMap = {};
            field = { name: $.toCamel(gArrTbCols[i].columnName), title: gArrTbCols[i].columnKraName, css:"cell", type: (gArrTbCols[i].dataType=="NUMBER")?"number":"text",  width: 30, editing: false, align:"center" };
            resultMap["colNm"] = gArrTbCols[i].columnName;
            resultMap["dataType"] = gArrTbCols[i].dataType;
            resultMap["pkYn"] = gArrTbCols[i].pkYn;
            resultArr.push(resultMap);
            fieldsArr.push(field);
        }

        var gridObject = new ComJsGrid({
            id: "gridTmpDivSub",
            height: 0,
            editing: false,
            sorting: true,
            paging: true,
            fields : fieldsArr
        }); 
        //그리드 생성
        gridObject.gridCreate();
        return resultArr;
    };
    
    $.fn.getTbDt = function(tbNm,arrColsInfo,finYmFrom,finYmTo) {
        var tbDtList = [];

        var arrCols = [];
        for(var i=0; i<arrColsInfo.length; i++) {
            arrCols[i] = arrColsInfo[i].columnName;
        }
        var reqParam = {
                "finYmFrom" : finYmFrom,
                "finYmTo" : finYmTo,
                "tbNm" : tbNm,
                "arrCols": arrCols
            };
        $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/commonBe/selectTbDataList.do",{async:false})
        .done(function(data) {
            tbDtList = data.tbDtList;
            $("#gridDiv").jsGrid("loadData", tbDtList).done(function(){
                if(tbDtList.length == 0){
                    $.fn.getReturnValue("gridDiv");
                }
            });
        }).fail(function(data) {
            console.log("fail to fn.getTbCols!!!!");
        });
            
    }
    
    // datePickerBe
    $.fn.initDatePicker = function(obj) {
        var strDate = "";
        var finDate = "";
        var strYear = "";
        var finYear = "";
        var strMonth = "";
        var finMonth = "";
        var dateChkYn = false;
        if (obj == "" || obj == undefined || obj == null || obj.strYm == null || obj.finYm == null || obj.strYm == "" || obj.finYm == "") {
            strDate = "";
            finDate = "";
            dateChkYn = false;
            $.fn.msgBox("유효한 날짜 정보가 존재하지 않습니다.");
            return;
        } else {
            strDate = obj.strYm;
            finDate = obj.finYm;
            strYear = strDate.substring(0,4);
            finYear = finDate.substring(0,4);
            strMonth = strDate.substring(4,6);
            finMonth = finDate.substring(4,6);
            dateChkYn = true;
        }
        if (dateChkYn == true){
            $("#ibx_finYmFrom, #inp_strYm").val(strYear+"-"+strMonth);
            $("#ibx_finYmTo, #inp_finYm").val(finYear+"-"+finMonth);
        }
        
        //시작년월 입력창 blur
        $("#ibx_finYmFrom, #inp_strYm").unbind();
        $("#ibx_finYmFrom, #inp_strYm").on('blur', function(e) {
            var _this = this;
            //빈값 체크
            if($.fn.isEmpty(this.value)) {
                if (dateChkYn == true){
                    $("#ibx_finYmFrom, #inp_strYm").val(strYear+"-"+strMonth);
                }
                return;
            }
            
            //값 오버 체크
            var ibxStrYYMMfrom = 0;
            var ibxStrYYMMfrom2 = 0;
            ibxStrYYMMfrom = $(this).val();
            ibxStrYYMMfrom = ibxStrYYMMfrom.replace(/[^0-9]/g,"");
            ibxStrYYMMfrom = ibxStrYYMMfrom.substring(0,4)+$.fn._addZero(ibxStrYYMMfrom.substring(4,6));
            ibxStrYYMMfrom2 = strYear+strMonth;
            ibxFinYYMMfrom2 = finYear+finMonth;
            ibxStrYYfrom = ibxStrYYMMfrom.substring(0,4);
            ibxStrMMfrom = ibxStrYYMMfrom.substring(4,6);
            if (ibxStrYYMMfrom < ibxStrYYMMfrom2) {
                $(this).val(strYear+"-"+strMonth);
            } else {
                if (ibxStrYYMMfrom > ibxFinYYMMfrom2) {
                    $(this).val(strYear+"-"+strMonth);
                } else {
                    $(this).val(ibxStrYYfrom+"-"+ibxStrMMfrom);
                }
                
            }
            
        }).on("focus", function() {
            $(this).select();
        });
        
        //마감년월 입력창 blur
        $("#ibx_finYmTo, #inp_finYm").unbind();
        $("#ibx_finYmTo, #inp_finYm").on('blur', function(e) {
            var _this = this;

            //빈값 체크
            if($.fn.isEmpty(this.value)) {
                if (dateChkYn == true){
                    $("#ibx_finYmTo, #inp_finYm").val(finYear+"-"+finMonth);
                }
                return;
            }
            
            //값 오버 체크
            var ibxFinYYMMfrom = 0;
            var ibxFinYYMMfrom2 = 0;
            ibxFinYYMMfrom = $(this).val();
            ibxFinYYMMfrom = ibxFinYYMMfrom.replace(/[^0-9]/g,"");
            ibxFinYYMMfrom = ibxFinYYMMfrom.substring(0,4)+$.fn._addZero(ibxFinYYMMfrom.substring(4,6));
            ibxFinYYMMfrom2 = finYear+finMonth;
            ibxStrYYMMfrom2 = strYear+strMonth;
            ibxFinYYfrom = ibxFinYYMMfrom.substring(0,4);
            ibxFinMMfrom = ibxFinYYMMfrom.substring(4,6);
            if (ibxFinYYMMfrom > ibxFinYYMMfrom2) {
                $(this).val(finYear+"-"+finMonth);
            } else {
                if (ibxFinYYMMfrom < ibxStrYYMMfrom2) {
                    $(this).val(finYear+"-"+finMonth);
                } else {
                    $(this).val(ibxFinYYfrom+"-"+ibxFinMMfrom);
                }
                
            }
            
        }).on("focus", function() {
            $(this).select();
        });
        $('.datepicker').datepicker("destroy");
        $('.datepicker').each(function(p_idx) {
            if($(this).hasClass("month")) {
            $('.datepicker').datepicker({
                closeText: '선택',
                prevText: '이전달',
                nextText: '다음달',
                minDate: new Date(strYear, strMonth - 1),
                maxDate: new Date(finYear, finMonth - 1),
                currentText: '오늘',
                monthNames: ['1월','2월','3월','4월','5월','6월',
                '7월','8월','9월','10월','11월','12월'],
                monthNamesShort: ['1월','2월','3월','4월','5월','6월',
                '7월','8월','9월','10월','11월','12월'],
                dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
                dayNamesShort: ['일','월','화','수','목','금','토'],
                dayNamesMin: ['일','월','화','수','목','금','토'],
                weekHeader: '주',
                dateFormat: 'yy-mm',
                changeMonth: true,
                changeYear: true,
                yearRange: strDate.substring(0,4)+':'+finDate.substring(0,4),
                firstDay: 0,
                isRTL: false,
                showButtonPanel:true,       
                showMonthAfterYear: true,
                showOn: 'none',
                yearSuffix: '년',
                onClose:function(dateText, inst) {
                    var year;
                    var month;
                    var selectDate = $.replaceAll(dateText, "-","");
                    if(selectDate.length == 6) {
                        year = selectDate.substring(0,4);
                        month = Number(selectDate.substring(4,6)) - 1;
                    }
                    if($(".ui-datepicker-close")[0] == event.srcElement) {  //캘린더 선택 버튼 클릭
                        month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                        year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                    }
                    
                    if(year && month) {
                        $(this).datepicker("option", "defaultDate", new Date(year,month,1));
                        $(this).datepicker("setDate", new Date(year, month,1));
                        var selectedAfterFn = $(this).attr("selectedAfterFn");  //후처리 Function String
                        if(selectedAfterFn && window[selectedAfterFn]) {
                            window[selectedAfterFn]($(this).val());
                        }
                    }
                },
                beforeShow:function() {
                    $("ui-datepicker-calendar > table").css("display","none");
                    var selectDate = $(this).val().split("-");
                    var year = Number(selectDate[0]);
                    var month = Number(selectDate[1]) - 1;
                    $(this).datepicker("option", "defaultDate", new Date(year, month, 1));
                }
            });
        $(".ui-datepicker").css("font-size", "0.9em");
                $(this).focus(function() {
                    $(".ui-datepicker-calendar").css("display", "none");
                    if (dateChkYn == false){
                        $(".ui-datepicker-year").remove();
                        $(".ui-datepicker-month").remove();
                        $(".ui-datepicker-title").text("유효한 날짜 정보가 존재하지 않습니다."); //ENBU401메시지코드 참조
                    }
                });
            }
        });
    }
    
    $.fn.getTbDateInfo = function(serviceCode) {
        var reqParam = {
                "serviceCode" : serviceCode
            };
        
        $.callAjax({"jsonStr":JSON.stringify(reqParam)}, "/be/pd/commonBe/selectTbDateInfo.do",{async:false})
        .done(function(data) {
    		tbDateInfo = data.tbDateInfo[0];
    		$.fn.initDatePicker(tbDateInfo);
        }).fail(function(data) {
            console.log("fail to fn.getTbDateInfo!!!!");
        });
    }
})(jQuery);

/**
 * 
 * @설명: gridId에 CSV파일을 로드한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: paramObj
 *  paramObj.id : 그리드 id
 *  callbackFn  : callback function  
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.BeloadGridExcel = function (paramObj) {
    $.fn.BeloadGridFile(paramObj, "excel");
}

$.fn.BeloadGridFileCallback = null;
$.fn.BeloadGridFile = function (paramObj, type) {
    var gridId = paramObj.id;
    if(type == "undefined") {
        type = "csv";
    }
    
    if(type != "csv" && type != "excel") {
        $.fn.msgBox("[" + gridId + "]파일 로드 유형이 잘못되었습니다.[" + type + "]");
        return;
    }
    
    var checkVisible = (typeof paramObj.checkVisible != 'undefined') ? paramObj.checkVisible : true;
    
    if(!gridId || !$("#" + gridId).jsGrid) {
        $.fn.msgBox("[" + gridId + "]객체가 존재하지 않습니다.");
        return;
    }
    
    var gridFields = $("#" + gridId).jsGrid("option", "fields");
    var paramFields = [];
    for(var i=0;i<gridFields.length; i++) {
        var fieldItem = gridFields[i];
        paramFields.push({
            name : fieldItem.name,
            title : fieldItem.title,
            type : fieldItem.type,
            width: fieldItem.width
        });
    }
    $("#_gridFileUpload").remove();
    $.fn.BeloadGridFileCallback = paramObj.callbackFn || null;
    var uploadFormArry = [];
    uploadFormArry.push("<div id='_gridFileUpload' style='display:none;'>");
    uploadFormArry.push("<form id='_gridUploadFrom' name='_gridUploadFrom' onsubmit='return false;'>");
    uploadFormArry.push("   <input type='hidden' name='_gridId' id='_gridId'/>");
    uploadFormArry.push("   <input type='hidden' name='_fields' id='_fields'/>");
    if(type == "csv") {
        uploadFormArry.push("   <input type='hidden' name='_gridUploadType' id='_gridUploadType' value='csv'/>");
        uploadFormArry.push("   <input type='file' name='_gridImportfile' id='_gridImportfile' accept='.csv' onchange='$.fn._BeloadGridFile()'/>");
    } else {
        uploadFormArry.push("   <input type='hidden' name='_gridUploadType' id='_gridUploadType' value='excel'/>");
        uploadFormArry.push("   <input type='file' name='_gridImportfile' id='_gridImportfile' accept='.xlsx' onchange='$.fn._BeloadGridFile()'/>");
    }
    uploadFormArry.push("</form>");
    uploadFormArry.push("</div>");
    $(document.body).append(uploadFormArry.join(""));   
    $("#_gridUploadFrom")[0]._gridId.value = gridId;
    $("#_gridUploadFrom")[0]._fields.value = JSON.stringify(paramFields);
    setTimeout(function () {
        $("#_gridImportfile")[0].click();
    },1);
};

/**
 * 
 * @설명: loadGridFile 호출후 사용자가 파일을 선택하면 서버에서 파싱하여 그리드에 바인딩한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: 
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn._BeloadGridFile = function() {
    var form = $("#_gridUploadFrom")[0];
    var gridId = form._gridId.value;
    var uploadType = form._gridUploadType.value;
    var gridSelector = $("#" + gridId);
    if(!form._gridImportfile.value) {
        alert("업로드할 파일을 입력하세요.");
        return;
    }
    
    var url = "/common/loadGridByCSV.do";
    if(uploadType == "excel") {
        url = "/be/pd/commonBe/loadGridByExcel.do";
    }
    
    var reqParam = new FormData(form);
    $.callAjaxUpload(reqParam, url)
    .done(function(data) {
        gridSelector.jsGrid("reset");       //그리드 데이터 초기화           
        var listData = data.list;           //서버로 받아온 데이터 리스트
        
        //그리드 바인딩
        gridSelector.jsGrid("loadData", listData).done(function(){
            if($.fn.BeloadGridFileCallback) {
                $.fn.BeloadGridFileCallback(data);
            }
        });
        $("#_gridFileUpload").remove();
        $.fn.loadGridFileCallback = null;

    }).fail(function(data){
    });         
};

/**
 * @설명: 10이하의 숫자 앞에 0추가
 * @최초작성자: 이준용
 * @최초작성일: 2021. 09. 28.
 * @최종변경일: 2021. 09. 28.
 * @매개변수: 
 * @반환값: void
 * @개정이력: 
 *  이준용 2021. 09. 28. 최초작성
 */
$.fn._addZero = function(number) {
    var val = "";
    if (number.length == 1) {
        if (number < 10) {
            val = "0"+number;
        } else {
            val = number;
        }
    } else {
        val = number;
    }
    
    return val;
}

/**
 * 
 * @설명: 화면에서 사용할 코드정보를 조회한다.
 *       화면에서 필요한 코드리스트에 대한 코드정보들을 (내부적으로) 생성한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: codeArr : 코드ID의 배열
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$._commonObj = {};	
$.fn.loadBeCmmnCode = function(codeArr) {
	
	//null 체크
	if(typeof codeArr === "undefined" || codeArr == null || codeArr == "") {
		$.fn.msgBox("조회할 공통코드ID가 존재하지 않습니다.");
		return;
	}
	
	//공통코드ID 세팅
	var _codeArr = typeof codeArr === "string" ? [codeArr] : codeArr;
	var reqArr = _codeArr.map(function(el) {
		return {"codeId":el};
	});

	//공통코드 유효값 조회
	$.callAjax({"list": JSON.stringify(reqArr)}, "/beCmmn/selectBeCmmnCodeList.do",{async:false})
	.done(function(data) {
		console.log("=====loadCommonCode done!");
		
		if(! $._commonObj["code"]) {
			$._commonObj["code"] = {};
		}
		$.extend($._commonObj["code"], data);
	}).fail(function(data) {
		console.log("fail to fn.loadBeCmmnCode!!!!");
	});
}

$.fn.addCommaFixed = function (obj){
	var regx = new RegExp(/(-?\d+)(\d{3})/);
	var bExists = obj.indexOf(".", 0);
	var strArr = obj.split('.');
	while (regx.test(strArr[0])){
		strArr[0] = strArr[0].replace(regx, "$1, $2");
	}
	if (bExists > -1){
		obj = strArr[0] + "." + strArr[1];
	} else {
		obj = strArr[0];
	}
	return obj;
}

//START 가정고도화
/**
 * 
 * @설명: jsGrid의 내용을 csv 파일로 export한다.
 * ex)$.fn.exportGridCSV({id:"girdDiv"});
 * @최초작성자: 김광섭
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: paramObj 
 * 	paramObj.id : grid id
 *  paramObj.showHeader : header 출력 여부 (true/false)
 *  paramObj.fileName : 파일명 (gird.csv)
 *  paramObj.applyItemTemplate : 그리드의 itemTemplate 적용 여부(디스플레이 포맷: true/false)
 *  paramObj.checkVisible : visible상태 체크 여부(false의 경우 visible이 false인 컬럼도 출력)
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.exportGridFAC = function(paramObj) {
	if(typeof paramObj != 'object') {
		$.fn.msgBox("파라미터는 JSON Object로 요청해야 합니다.");
		return;
	}
	var gridId = paramObj.id;
	if(!$("#" + gridId).jsGrid) {
		$.fn.msgBox("[" + gridId + "]객체를 찾을 수 없습니다.");
		return;
	}
	var showHeader = (typeof paramObj.showHeader != 'undefined') ? paramObj.showHeader:true;
	var fileName = paramObj.fileName || "export_grid.csv";
	if(!fileName.toLowerCase().endsWith(".csv")) fileName + ".csv";
	var checkVisible = (typeof paramObj.checkVisible != 'undefined') ? paramObj.checkVisible : true;
	var applyItemTemplate = (typeof paramObj.applyItemTemplate != 'undefined') ? paramObj.applyItemTemplate:false;
	//var commentHeader = (typeof paramObj.commentHeader != 'undefined') ? paramObj.commentHeader : $.fn.makeExportCSVCommentHeader(paramObj.commentHeaderKey,paramObj.commentHeaderEtc);

	var fields = $("#" + gridId).jsGrid("option", "fields");
	var arrData = $("#" + gridId).jsGrid("option", "data");
	/**	 빈 파일 다운로드 처리 -2021.01.25
	if(arrData.length == 0) {
		$.fn.msgBox("export할 데이터가 존재하지 않습니다.");
		return;
	}
	*/
	var CSV = '';
	//타이틀 추가
	var title = paramObj.title;
	CSV += title + '\r\n';
	
	//comment Header 생성
	//2021.01.25 Header 사용 안함.
	/**
	for(var i=0; i<commentHeader.length; i++) {
		CSV += commentHeader[i] + '\r\n';
	}
	*/
	
	var header = "";
	var fieldMap = {};
	var outputFields = [];
	var fieldIdx = 0;
	for(var i=0; i<fields.length;i++) {
		var item = fields[i];
		var title = item.title;
		var name = item.name;
		var isColumnVisible = item.visible;
		if(item){    								
			//체크박스 컬럼인 경우 제외
			if($.fn._isExportFieldColumn(item, checkVisible)){
				if(fieldIdx>0) header += ',';
				fieldMap[name] = item;
				outputFields.push(item);
				header += title;
				fieldIdx++;
			}
		}		
	}
	
	if (showHeader) {
		CSV += header + '\r\n';
	}

	for (var i = 0; i < arrData.length; i++) {
	    var row = "";
		var valueItem = arrData[i];

	    //2nd loop will extract each column and convert it in string comma-seprated
		for(var j=0; j<outputFields.length;j++) {
			var fieldItem = outputFields[j];
			var name = fieldItem.name;
			var value = valueItem[name];
		    if(applyItemTemplate && fieldItem.itemTemplate) {
		    	value = fieldItem.itemTemplate(value, arrData[i]);
		    }
		    if(j > 0) row += ',';
			row += '' + value + '';
		}

		//add a line break after each row
		CSV += row + '\r\n';
	}
	if (CSV == '') {
		alert("Invalid data");
	    return;
	}
	
	
	if (window.navigator && window.navigator.msSaveOrOpenBlob) {
		// IE에서 동작
		window.navigator.msSaveOrOpenBlob(new Blob(['\ufeff',CSV], { type: "application/octet-stream;charset=utf-8" }), fileName)
	} else {
		// chrome에서 동작
		var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
		var link = document.createElement("a");
		link.href = URL.createObjectURL(new Blob(['\ufeff',CSV], { type: "application/octet-stream;charset=utf-8" })); //added to fix network error problem in chrome
		link.style = "visibility:hidden";
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	//END 가정고도화
}
