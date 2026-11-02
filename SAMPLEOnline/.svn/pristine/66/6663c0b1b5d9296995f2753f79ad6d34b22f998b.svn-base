/**
 * @시스템명: IFRS17(가정관리)
 * @업무명: 손해율 - 구분단위설정
 * @설명: 손해율  - 구분단위설정 화면의 JS
 * @최초작성자: 안현준
 * @최초작성일: 2026. 5. 19.
 * @최종변경일: 
 * @개정이력: 
 *  안현준 2026. 5. 19. 최초작성
 */

//조회조건obj
var gReqParam = {};
//조회flag
var gCondFlag = "N";

// 그리드 높이 맞춤
$(window).on("resize", function() {
	reSizeGrid();
});

$(document).ready(function(){
    $("#imgToolTip").attr("title", parent.viewPath);
    $($("h3")[0]).append(" :: ["+$.fn.getMenuId()+"]");
    
    //event 초기화
    initEvent();
    
    //최초로드
    initGrid();
    
    // 포커스(적용BE)
    $("#inp_aplcBeNm").focus();
});

/**
* @설명: 손해율 - 구분단위설정 - jsGrid 빈 테이블 생성 
* @최초작성자: 안현준
* @최초작성일: 2026. 5. 19.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  안현준 2026. 5. 19. 최초작성
*/
function initGrid(){
    //그리드 필드 세팅
    var fieldsArr = getGridFields();
    // jsGrid 빈 테이블 생성
    var gridObject = new ComJsGrid({
        id: "gridLossRatScUnit",
        height: "100%",
        editing: false,
        sorting: true,
        paging: true,
        fields : fieldsArr
    }); 
    //그리드 생성
    gridObject.gridCreate();
    reSizeGrid();
}

/**
 * @설명: 조회구분에 따른 그리드 필드값을 리턴
 * @최초작성자: 안현준
 * @최초작성일: 2026. 5. 28.
 * @최종변경일: 
 * @매개변수:
 * @반환값: 
 * @개정이력: 
 *  안현준 2026. 5. 28. 최초작성
 */
function getGridFields() {
    //그리드 공통부분 필드
    var resultArr = [
    	{ name: "rskPrmProdCd", title: "RSK_PRM_PROD_CD", css: "cell", type: "text", width: 150, align: "center"},
    	{ name: "rskPrmProdCdExpln", title: "담보명", css: "cell", type: "text", width: 100, align: "center"},
    	{
    		name: "exstnColtrYn", title: "기존/신규", css: "cell", type: "text", width: 100, align: "center"
	    		, itemTemplate:function(value, item) {
	    			if(item.exstnColtrYn == "Y") {
	    				return "기존";
	    			} else if(item.exstnColtrYn == "N") {
	    				return "신규";
	    			}
	            }
    	},
    	{ name: "rskRatJdgCd", title: "고지유형", css: "cell", type: "text", width: 100, align: "center"},
    	{ name: "rskRatLclsfCd", title: "대분류", css: "cell", type: "text", width: 100, align: "center"},
    	{ name: "rskRatMclsfCd", title: "중분류", css:" cell", type: "text", width: 100, align: "center"},
    	{ name: "rskRatSclsfCd", title: "기존소분류", css: "cell", type: "text", width: 150, align: "center"},
    	{ name: "jdgmtAftRskRatSclsfCd", title: "판단후소분류", css: "cell", type: "text", width: 150, align: "center"},
    	{ name: "lstRskRatSclsfCd", title: "최종소분류", css: "cell", type: "text", width: 150, align: "center"},
    	{ name: "avlStasYn", title: "충분성", css: "cell", type: "text", width: 100, align: "center"},
    	{ name: "anovaSucsYn", title: "분산분석", css: "cell", type: "text", width: 100, align: "center"},
    	{ name: "tukeySucsYn", title: "사후검정", css: "cell", type: "text", width: 100, align: "center"}
    ];
    
    return resultArr;
}

/**
* @설명: event 초기화
* @최초작성자: 안현준
* @최초작성일: 2026. 5. 28.
* @최종변경일: 
* @매개변수: 
* @반환값: 
* @개정이력: 
*  안현준 2026. 5. 28. 최초작성
*/
function initEvent() {
	var serviceNm = "LOSS_RAT_SC_JDGMT_RSLT_PROD";
	
	// 조회
    $('#btn_search').on('click', function(e){
    	// 리스트 조회 함수 호출
    	selectLossRatScUnitList();
    });
        

    $("#btn_batch").on("click", function(e) {
		var reqParam = {};
		// 적용BE
		reqParam.aplcBeNm = $("#inp_aplcBeNm").val(); // 적용BE
		if(reqParam.aplcBeNm == '') {
			$.fn.msgBox('적용 BE를 입력해주세요', function() {				
				// 포커스(적용BE)
				$("#inp_aplcBeNm").focus();
			});
			return;
		} else if(reqParam.aplcBeNm.toUpperCase().includes("BE_F")) {
			$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다', function() {				
				// 포커스(적용BE)
				$("#inp_aplcBeNm").focus();
			});
			return;
		}
		
		reqParam.batName = serviceNm;

		$.fn.msgBox('배치를 실행하시겠습니까?', function(obj) {
			if (obj.btn_ok) {
				$.callAjax(reqParam, '/be/pd/commonBe/aplcBatchProc.do')
					.done(function(data) {
						if (data.result == '0') {
							$.fn.msgBox('정상적으로 처리되었습니다.');							
						}
					}).fail(function(data) {
						$.fn.msgBox('배치가 실패했습니다.');
					});
			}
		}, 2);
	});
    
    // 엑셀다운로드
    $("#btn_downloadExcel").on("click", function(e){
    	if(gCondFlag == "N" || $("#gridLossRatScUnit").jsGrid("option", "data").length == 0) {
             $.fn.msgBox("조회된 항목이 없습니다.");
             return;
        }
        let fileName = "손해율_구분단위"
                     + ".xlsx";
		$.fn.exportMultiGridExcel([{
            id       : 'gridLossRatScUnit',
            sheetName : "구분단위",
            fileName : fileName
        }]);
    });
    
  //엑셀업로드 클릭
    $("#btn_uploadExcel").on("click", function(e){
    	var paramObj = {};
    	var aplcBeNm = $("#inp_aplcBeNm").val();

    	if(aplcBeNm == '') {
    		$.fn.msgBox('적용 BE를 입력해주세요', function() {
    			// 포커스(적용BE)
    			$("#inp_aplcBeNm").focus();
    		});
    		return;
    	} else if(aplcBeNm.toUpperCase().includes("BE_F")) {
			$.fn.msgBox('해당 적용BE는 데이터를 변경할 수 없습니다');
			return;
		}
    	
        paramObj.id = "gridLossRatScUnit";                 //그리드 ID
        paramObj.callbackFn = function(data) {      //그리드 바인딩 후 후처리 함수
            if(data.result == "1") {
                $.fn.msgBox('데이터를 저장하시겠습니까?', function (obj) {
                    if (obj.btn_ok) {
                        console.log("로드데이터");
                        console.log(JSON.stringify(data["list"]));

                        data["aplcBeNm"] = aplcBeNm;
                        $.callAjax({"jsonStr":JSON.stringify(data)}, '/be/pd/bepd124m/saveLossRatScUnitList.do')
                        .done(function(data) {
                            if(data.result == "success") {
                                $.fn.msgBox('정상적으로 처리되었습니다.');
                            }
                        }).fail(function(data){
                            $.fn.msgBox('데이터 저장이 실패했습니다.');
                        });
                    }
                }, 2);
            }
        };
        $.fn.loadGridExcel(paramObj);
    });
    
    // Enter조회
    $(["#inp_aplcBeNm"
        , "#inp_rskRatJdgCd"
        , "#inp_rskRatLclsfCd"
        , "#inp_rskRatMclsfCd"
        , "#inp_rskRatSclsfCd"
        , "#sbx_exstnColtrYn"
        , "#inp_lstRskRatSclsfCd"
        ].join(",")).on("keypress", function(e) {
          if(e.keyCode == 13) {
              $("#btn_search").click();
              return false;
          }
      });
    
    // 검색에 소분류에서 탭하면 기존/신규로 포커싱
    $("#inp_rskRatSclsfCd").on("keydown", function(e) {
          if(e.keyCode == 9) {
        	  e.preventDefault();
              $("#sbx_exstnColtrYn").focus();
              
          }
      });
}

//}
/**
 * @설명: 손해율 구분단위 Grid 조회
 * @최초작성자: 안현준
 * @최초작성일: 2026. 5. 28.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  안현준 2026. 5. 28. 최초작성
 */
function selectLossRatScUnitList(){
    // 조회에 필요한 값을 셋팅
    gReqParam.aplcBeNm = $("#inp_aplcBeNm").val(); // 적용BE
	if(gReqParam.aplcBeNm == '') {
		$.fn.msgBox('적용 BE를 입력해주세요', function() {				
			// 포커스(적용BE)
			$("#inp_aplcBeNm").focus();
		});
		return;
	}
    
    gReqParam.rskRatJdgCd = $("#inp_rskRatJdgCd").val(); // 고지유형
    gReqParam.rskRatLclsfCd = $("#inp_rskRatLclsfCd").val(); // 대분류
    gReqParam.rskRatMclsfCd = $("#inp_rskRatMclsfCd").val(); // 중분류
    gReqParam.rskRatSclsfCd = $("#inp_rskRatSclsfCd").val(); // 소분류
    gReqParam.exstnColtrYn =  $("#sbx_exstnColtrYn").val(); // 기존/신규
    gReqParam.lstRskRatSclsfCd = $("#inp_lstRskRatSclsfCd").val(); // 최종소분류 

    // 데이터 조회
    $.callAjax(gReqParam, "/be/pd/bepd124m/selectLossRatScUnitList.do")
    .done(function(data) {
        // 그리드 초기화
        resetGrid();
        reDrawGrid();
        // 그리드 바인딩
        var lossRatScUnitList = data.lossRatScUnitList;
        
        $("#gridLossRatScUnit").jsGrid("loadData", lossRatScUnitList);
        
        if(lossRatScUnitList.length == 0) {
            $.fn.getReturnValue("gridLossRatScUnit");
        }
        gCondFlag = "Y";
    }).fail(function(data){
        $.fn.msgBox("데이터 불러오기 실패");
    });
}

/**
 * @설명: 그리드 데이터 초기화
 * @최초작성자: 안현준
 * @최초작성일: 2026. 5. 28.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  안현준 2026. 5. 28. 최초작성
 */
function resetGrid() {
    // 구분단위
    $("#gridLossRatScUnit").jsGrid("reset");
    $("#gridLossRatScUnit").jsGrid("option", "data", []);
}

/**
 * @설명: 그리드 리로드
 * @최초작성자: 안현준
 * @최초작성일: 2026. 5. 28.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  안현준 2026. 5. 28. 최초작성
 */
function reDrawGrid() {
    //그리드 destroy
    $("#gridLossRatScUnit").jsGrid("destroy");
    //그리드 create
    initGrid();
}

/**
 * @설명: 그리드 크기 조절
 * @최초작성자: 안현준
 * @최초작성일: 2026. 6. 15.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  안현준 2026. 6. 15. 최초작성
 */
function reSizeGrid() {
	var h = $(window).height() - 300;
	
	if(h < 250) {
		h = 250;
	}
	
	$("#tableWrap").css("height", h + "px");
	$("#gridLossRatScUnit").css("height", h + "px");
}

/**
* @설명: 그리드의 코드부분 한글코드명 제거 
* @최초작성자: 안현준
* @최초작성일: 2026. 5. 27.
* @최종변경일: 
* @매개변수: value
* @반환값: 
* @개정이력: 
*  안현준 2026. 5. 27. 최초작성
*/
function extractCode(value) {
	if(value == null) return "";
	
	value = String(value).trim();
	
	var idx = value.indexOf("(");
	
	if(idx > -1) {
		return value.substring(0, idx).trim
	}
	
	return value
	
}