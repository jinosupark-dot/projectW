/**
 * @시스템명: IFRS17
 * @업무명: 재무회계-기표용 전표생성
 * @설명: 기표용 전표생성
 * @최초작성자: 황석현
 * @최초작성일: 2021.02.17
 * @최종변경일:
 * @개정이력:
 *  황석현 2021.02.17 최초작성
 *  황석현 2021.04.28 2차 표준화
 *  황석현 2021.06.15 3차 표준화
 */
var perBtnId = ["btn_smupReq", "btn_slpSugg", "btn_slpCanc"];

$(document).ready(function(){
	
	//button permission
	var arrPerBtn = new Array();
	for(var i=0; i<perBtnId.length; i++){
		var perBtn = new Object();
		perBtn.btnId  = "#" + perBtnId[i];
		perBtn.action = "R";
		arrPerBtn.push(perBtn);
	}
	$.fn.setBtnPermission(arrPerBtn);
	
	if(!$("#" + perBtnId[1]).is(":visible")){
		$("#acntgBusnClsfCd").hide();
		$("#aplc13Yn").hide();
	}
	
	$("#imgToolTip").attr("title", parent.viewPath);
	$($("h3")[0]).text($.fn.getMenuNm()+" :: ["+$.fn.getMenuId()+"]");
	
	//화면 타이틀 초기화(기표용 정보생성 - I4 원수조정)
	setTitle("");
	
	//event 초기화
	initEvent();
	
	//마감년월 초기화
	initYymm();
	
	initGrid();
	
	selectSlpTrtPnsta("F");
	
	$("#ibx_finYm").select();
	
});

/**
 * @설명: jsGrid 빈 테이블 생성 
 * @최초작성자: 이상범
 * @최초작성일: 2021.02.23
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function initGrid(){
	// jsGrid 빈 테이블 생성
	var gridObject = new ComJsGrid({
		id       : "gridDiv",
		height   : 191, //explorer기준
		editing  : false,
		sorting  : false,
		paging   : false,
		confirmDeleting: false,
		headerRowRenderer: function() {
			var $result = $("<tr>").height(0)
				.append($("<th>").width(150))
				.append($("<th>").width(100))
				.append($("<th>").width(100))
				.append($("<th>").width(100))
				.append($("<th>").width(100))
				.append($("<th>").width(100))
				.append($("<th>").width(100));

			// header 1row
			$result = $result.add($("<tr class='jsgrid-header-row'>")
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("rowspan", 2).text("업무분류"))	
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("집계"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("전표생성"))
				.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").attr("colspan", 2).text("전표발의"))
				); 
			
			// header 2row
			var $result1 = $("<tr class='jsgrid-header-row'>")
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("상태"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("건수"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("상태"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("건수"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("상태"))
					.append($("<th class='jsgrid-header-cell cell jsgrid-align-center jsgrid-header-sortable'>").text("건수"))
					;
			
			$result = $result.add($result1);

			return $result;
		},
		fields : [
			{ name: "acntgBusnClsfCdNm"   , title:"업무분류", css:"cell", type: "text", width: 150, editing: false, align:"left"},
			{ name: "smupChk"    , title:"집계여부", css:"cell", type: "text", width: 100, editing: false, align:"center", editing: false, 
				itemTemplate:function(value, item) {
					return $("<input>").attr("type", "checkbox").attr("checked", (value == "N") ? false : true).prop("disabled", true);
				}
			}, 
			{ name: "smupCnt", title:"집계건수", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())) + " 건";
				}
			},
			{ name: "slpCretChk", title:"전표생성여부", css:"cell", type: "text", width: 100, editing: false, align:"center", editing: false, 
				itemTemplate:function(value, item) {
					return $("<input>").attr("type", "checkbox").attr("checked", (value == "N") ? false : true).prop("disabled", true);
				}
			}, 
			{ name: "slpCretCnt", title:"전표생성건수", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())) + " 건";
				}
			},
			{ name: "slpSuggChk", title:"전표발의여부", css:"cell", type: "text", width: 100, editing: false, align:"center", editing: false, 
				itemTemplate:function(value, item) {
					return $("<input>").attr("type", "checkbox").attr("checked", (value == "N") ? false : true).prop("disabled", true);
				}
			}, 
			{ name: "slpSuggCnt", title:"전표발의건수", css:"cell", type: "text", width: 100, editing: false, align:"right",
				itemTemplate:function(value, item) {
					return ($.fn.isEmpty(value) ? "0" : $.addCommaNumber(value.toString())) + " 건";
				}
			}
		]
	});	

	//그리드 생성
	gridObject.gridCreate();
	
	$(".jsgrid-grid-header,.jsgrid-grid-body").css("overflow-y","hidden");
}

/**
 * @설명: event 초기화
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @개정이력: 
 *  황석현 2021.03.03 최초작성
 */
function initEvent() {
	
	//마감년월 입력창 click
	var calObj = $("#ibx_finYm");
	calObj.on("click", function(e){
		$(this).data.prvdate = $(this).val();
		$(this).select();
	}).on("focusout", function(e){
		if($(this).val() == "") $(this).val($(this).data.prvdate);
	}).on("keyup", function(e){
		var inDt = $(this).val();
		if(inDt.length == 5 && inDt.substring(4,5) != "-") {
			$(this).val(inDt.substring(0,4) + "-" + inDt.substring(4));
		}
	}).on("keypress", function(e){
		if(e.keyCode == 13) {
			//날짜형식 체크
			if($.isValidYm(this.value)) {
				$(this).val($.fn.monthFormat(this.value, "-"));
				selectSlpTrtPnsta("S");
			} else {
				$.fn.msgBox("날짜 형식이 맞지 않습니다.");
				$(this).focus();
			}
		}
	}).on("blur", function(e){
		var _this = this;
		
		//빈값 체크
		if($.fn.isEmpty(_this.value)) {
			return;
		}
		
		//날짜형식 체크
		if($.isValidYm(_this.value)) {
			$(_this).val($.fn.monthFormat(_this.value, "-"));
		} else {
			$.fn.msgBox("날짜 형식이 맞지 않습니다.", function() {
				$(_this).focus();
			});
		}
	});
	
	//마감년월 달력버튼 click
	$("#btn_finYm").on("click", function(e){
		$("#ibx_finYm").datepicker("show");
	});
	
	//집계요청
	$("#btn_smupReq").on("click", function(e){
		callBatPrct("smupReq");
	});
	
	//전표취소
	$("#btn_slpCanc").on("click", function(e){
		callBatPrct("slpCanc");
	});
	
	//전표발의
	$("#btn_slpSugg").on("click", function(e){
		callBatPrct("slpSugg");
	});
	
	//조회
	$("#btn_search").on("click", function(e){
		selectSlpTrtPnsta("S");
	});
	
	//업무분류 change
	$("input[name=rad_acntgBusnClsfCd]").on("change", function(e){
		var rdoChkNm = $(this).next("label").text();

		setTitle(rdoChkNm);
		
		//13기간 적용 구분 visible
		if($(this).val() == "10" || $(this).val() == "20") {
			$("#aplc13Yn").show();
			$("#aplc13Mm").prop("checked", true);
		} else {
			$("#aplc13Yn").hide();
		}
	});
}

/**
 * @설명: 코드 목록 조회한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.03
 * @최종변경일: 
 * @매개변수:	codeId : 조회할 코드 대상
 * 			selId : 조회결과 바인딩 콤보박스
 * 			value : 종속하는 코드값
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.03 최초작성
 */
function selectItmCode(codeId, selId, value) {
	//console.log("selectItmCode codeId --> " + codeId);
	var reqParam = {};
	reqParam.codeId = codeId;
	reqParam.val = value;
	
	//공통코드 유효값 조회
	$.callAjax(reqParam, "/fi/jr/fijr113m/selectItmCdList.do",{async:false})
	.done(function(data) {
		//콤보박스 세팅
		var $targetEl = $("#" + selId);
		//콤보박스 option세팅
		var codeList = data.list;
		var optionStr = '<option value="">-선택-</option>';
		for (let j = 0; j < codeList.length; j++) {
			let codeData = codeList[j];
			optionStr += '<option value="' + codeData.code + '">' + codeData.codeNm + '</option>';
		}
		$targetEl.html(optionStr);
		
	}).fail(function(data) {
		console.log("fail to selectItmCode!!!!");
	});
}

function isEmpty(value) {
	return typeof value === "undefined" || value == null || value == "" ? true : false;
}

/**
 * @설명: 년월 설정
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.02
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.02 최초작성
 */
function initYymm() {
	//마감년월 - 전월
	var nowDate = new Date();
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth();
	
	var temp = new Date(year, month, "1");
	temp.setMonth(month - 1);
	
	year = temp.getFullYear();
	month = (temp.getMonth() + 1).toString();
	month = month.length == 1 ? "0" + month : month;
	
	//마감년월 세팅
	$("#ibx_finYm").val($.fn.monthFormat(year + month, "-"));
}

/**
 * @설명: 타이틀 설정
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.02
 * @최종변경일: 
 * @매개변수: val
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.02 최초작성
 */
function setTitle(val) {
	var busnScCdNm = val;
	if(isEmpty(val)) busnScCdNm = "I4 원수조정";
	
	var msg = "기표용 정보생성 ";
	busnScCdNm = msg + "- " + busnScCdNm;
	
	$(".fl h4").text(busnScCdNm);
}

/**
 * @설명: 배치 실행
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.02
 * @최종변경일: 
 * @매개변수: val
 * @반환값: 
 * @개정이력: 
 *  황석현 2021.03.02 최초작성
 */
function callBatPrct(val) {
	var finYm = $("#ibx_finYm").val();
	finYm = finYm.replace(/-/g, "");
	if(finYm.length != 6) {
		$.fn.msgBox("마감년월 입력값을 확인하세요.");
		return false;
	}
	
	var $acntgBusnScCd = $("input:radio[name='rad_acntgBusnClsfCd']:checked");
	var acntgBusnScCd = $acntgBusnScCd.val();
	if($.fn.isEmpty(acntgBusnScCd)) {
		$.fn.msgBox("업무분류코드를 선택하세요.");
		return false;
	}
	
	var acntgBusnScCdNm = $acntgBusnScCd.next("label").text();
	console.log(acntgBusnScCd + "/" + acntgBusnScCdNm);
	
	finYm = finYm.substr(0, 4) + "년 " + finYm.substr(4, 2) + "월, ";
	
	var msg = "";
	var reqParam = {};
	reqParam.fscyr = $("#ibx_finYm").val().replace(/-/g, "").substr(0, 4);
	reqParam.acctPrdCd = $("#ibx_finYm").val().replace(/-/g, "").substr(4, 2);
	reqParam.finYm = $("#ibx_finYm").val().replace(/-/g, "");
	reqParam.acntgBusnClsfCd = acntgBusnScCd;
	reqParam.batId = "";
	reqParam.aplcYn = "";

	//집계요청
	if(val == "smupReq") {
		if(acntgBusnScCd == "10" || acntgBusnScCd == "20") {
			reqParam.batId = "BTIFIJR011";
			var rdoChkVal = $("input:radio[name='rad_useYn']:checked").val();
			if(rdoChkVal == "A") { //13기간 적용
				reqParam.aplcYn = "Y";
			} else {
				reqParam.aplcYn = "N";
			}
		}else if(acntgBusnScCd == "30") {
			reqParam.batId = "BTIFIJR012";
		}else if(acntgBusnScCd == "40") {
			reqParam.batId = "BTIFIJR013";
		}else{
			reqParam.batId = "BTIFIJR014";
		}
		
		msg = finYm + acntgBusnScCdNm + " 업무의 집계를 하시겠습니까?";
		$.fn.msgBox(msg, function(obj) {
			if(obj.btn_ok) {
				$.callAjax(reqParam, "/fi/jr/fijr211m/selectSmupYn.do")
				.done(function(data) {
					//Exception 발생 시, 공통 Message 제공
					if(data.info == "-1") { return; }
					
					var info = data.info
					// info.smupyn 리턴값 케이스별 처리방법
					// 1 : SJR 기표 건수가 있을 경우임. -> 전표취소 작업 요청 메세지.
					// 2 : JR row count = 0 AND AR row count > 0 -> 재집계
					// 3 : JR row count = 0 AND AR row count = 0 -> 집계
					if(info.smupyn == "1") {
						$.fn.msgBox("전표 내역이 존재합니다. 전표취소 후 재수행하십시오.");
						return false;
					} else if(info.smupyn == "2") {
						$.fn.msgBox("집계 내역이 존재합니다. 삭제 후 재집계를 수행합니다.", function() {
							// 배치 실행
							exeBatch(reqParam, val);
						}, 1);
					} else {
						// 배치 실행
						exeBatch(reqParam, val);
					}
					
				}).fail(function(data){
					$.fn.msgBox("처리 실패");
				});
				
			}
		}, 2);

		//전표취소
	}else if(val == "slpCanc") {
		reqParam.batId = "BTIFIJR041";
		
		msg = finYm + acntgBusnScCdNm + " 업무의 전표 취소를 하시겠습니까?";
		$.fn.msgBox(msg, function(obj) {
			if(obj.btn_ok) {
				$.callAjax(reqParam, "/fi/jr/fijr211m/selectBltgYn.do")
				.done(function(data) {
					//Exception 발생 시, 공통 Message 제공
					if(data.info == "-1") { return; }
					
					var info = data.info
					// info.bltgyn 리턴값 케이스별 처리방법
					// 1 : 기표 진행 불가(ar건 없음)
					// 2 : 기표 진행(jr건 있음)
					// 3 : 기표 진행 불가(jr건 없음)
					console.log(info.bltgyn);
					if(info.bltgyn == "1" || info.bltgyn == "3") {
						$.fn.msgBox("전표 내역이 없어 취소할 수 없습니다.");
						return false;
					} else {
						// 배치 실행
						exeBatch(reqParam, val);
					}
					
				}).fail(function(data){
					$.fn.msgBox("처리 실패");
				});
				
			}
		}, 2);
		
	//전표발의
	}else if(val == "slpSugg") {
		if(acntgBusnScCd == "10" || acntgBusnScCd == "20") {
			reqParam.batId = "BTIFIJR031";
		}else if(acntgBusnScCd == "30" || acntgBusnScCd == "40" || acntgBusnScCd == "50") {
			reqParam.batId = "BTIFIJR032";
		}
		
		msg = finYm + acntgBusnScCdNm + " 업무의 전표 발의를 하시겠습니까?";
		$.fn.msgBox(msg, function(obj) {
			if(obj.btn_ok) {
				$.callAjax(reqParam, "/fi/jr/fijr211m/selectBltgYn.do")
				.done(function(data) {
					//Exception 발생 시, 공통 Message 제공
					if(data.info == "-1") { return; }
					
					var info = data.info
					// info.bltgyn 리턴값 케이스별 처리방법
					// 1 : 기표 진행 불가(ar건 없음)
					// 2 : 기표 진행(jr건 있음)
					// 3 : 기표 진행 불가(jr건 없음)
					if(info.bltgyn == "1") {
						$.fn.msgBox("집계 내역이 없어 진행할 수 없습니다.");
						return false;
					} else if(info.bltgyn == "2") {
						$.fn.msgBox("전표 내역이 존재하여 진행할 수 없습니다.");
						return false;
					} else {
						// 배치 실행
						exeBatch(reqParam, val);
					}
					
				}).fail(function(data){
					$.fn.msgBox("처리 실패");
				});
				
			}
		}, 2);
		
	}
}

/**
 * @설명: 배치 실행한다.
 * @최초작성자: 황석현
 * @최초작성일: 2021.03.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function exeBatch(param, val) {
	var scNm = "";
	
	if(val == "smupReq") {
		scNm = "집계";
	} else if(val == "slpCanc") {
		scNm = "전표 취소";
	} else {
		scNm = "전표 발의";
	}
	
	// 배치 실행
	$.callAjax(param, "/fi/jr/fijr211m/execOnlineBat.do")
	.done(function(data) {

		console.log("::: BATCH RETURN DATA ::: \n", JSON.stringify(data));
		
		//BATCH result : 0:성공, 1:실패
		if(data.result == "0") {
			$.fn.msgBox("정상적으로 배치 실행되었습니다.");
		} else {
			var msg = $.fn.isEmpty(data.errorMessage) ? scNm + " 배치 실행 도중 오류가 발생하였습니다." : data.errorMessage;
			$.fn.msgBox(msg);
		}
		
	}).fail(function(data){
		$.fn.msgBox("[ajax] 서버 통신 실패입니다.");
		console.log("fail to execOnlineBat !!");
	});
}

/**
 * @설명: 전표처리현황 조회한다.
 * @최초작성자: 이상범
 * @최초작성일: 2021.03.05
 * @최종변경일: 
 * @매개변수: 
 * @반환값: 
 * @개정이력: 
 */
function selectSlpTrtPnsta(gb) {
	
	if(isEmpty($('#ibx_finYm').val())) {
		$.fn.msgBox("마감년월을 입력하세요.");
		return false;
	}
	
	var vasync = true;
	if(gb == "F") vasync = false;
	
	//조회값 셋팅
	var reqParam = {
			srchFinYm : $.replaceAll($("#ibx_finYm").val(), '-','')
	};
	
	// 데이터 조회
	$.callAjax(reqParam, "/fi/jr/fijr211m/selectSlpTrtPnsta.do",{async:vasync})
	.done(function(data) {
		// 그리드 초기화
		resetGrid();
		
		//그리드 바인딩
		var listData = data.list;
		$("#gridDiv").jsGrid("loadData", listData).done(function(){ });
		
	}).fail(function(data){
		$.fn.msgBox("데이터 불러오기 실패");
		console.log("fail to selectJoulRlList !!");
	});
}

function resetGrid() {
	$("#gridDiv").jsGrid("reset");
	$("#gridDiv").jsGrid("option", "data", []);
}