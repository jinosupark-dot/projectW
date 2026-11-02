//IE endsWith function 추가
if(!String.prototype.endsWith) {
	String.prototype.endsWith = function(str) {
		if(this.length<str.length) {
			return false;
		}
		return this.lastIndexOf(str) + str.length == this.length;
	}
}

//IE replaceAll 추가
if(!String.prototype.replaceAll) {
	String.prototype.replaceAll = function(search, replacement) {
		var target = this;
		return target.split(search).join(replacement);
	}
}


/*************************************
 * browser 버전체크
 *************************************/
var browser = {
	checkBrowser: function() {
		var N= navigator.appName, ua= navigator.userAgent, tem;
		var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
		M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
		return M;
	},

	//쿠키 생성
	setCookie: function setCookie(cName, cValue, cDay){
		var expire = new Date();
		expire.setDate(expire.getDate() + cDay);
		cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
		if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
			document.cookie = cookies;
		},
 
	// 쿠키 가져오기
	getCookie: function (cName) {
		cName = cName + '=';
		var cookieData = document.cookie;
		var start = cookieData.indexOf(cName);
		var cValue = '';
		if(start != -1){
			start += cName.length;
			var end = cookieData.indexOf(';', start);
			if(end == -1)end = cookieData.length;
			cValue = cookieData.substring(start, end);
		}
		return unescape(cValue);
	},
	isIE: function() {
		var ua = navigator.userAgent;
		return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
		
	},
	getIEVersion: function() {
		var word;
		var version = "N/A";
		var agent = navigator.userAgent.toLowerCase();
		var name = navigator.appName;
		//IE old version (IE 10 or Lower)
		if(name == "Microsoft Internet Explorer") word = "msie ";
		else {
			//IE11
			if(agent.search("trident") > -1) word = "trident/.*rv.";
			
			//Edge
			else if(agent.search("edge/") > -1) word = "edge/";
		}
		
		var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");
		if( reg.exec(agent) != null ) version = RegExp.$1 + RegExp.$2;
		return version;
	}
};

/*************************************
 * 일반함수 정의
 *************************************/
(function ($) {

//Replace
$.replaceAll = function(str, repStr, joinStr ){return str.split(repStr).join(joinStr);};

//Replace
$.replaceNull = function(str, joinStr ){
	if(str == null) return joinStr;
	return str;
};

//숫자 제거(Replace Number)
$.replaceNumber = function(val){return val.replace(/[^0-9]/g,'');}; 
//dateStr = $.replaceAll(dateStr, sep,"");

//int 정수만 가능
$.isNumber = function(value){return /^-?\d*$/.test(value);};

//eng: 영어만 가능
$.isEng =  function(value){return (/^[a-z]*$/i).test(value);}; 

// 날짜형식만 가능: yyyymmdd
$.isValidDate = function(value){		
	// 8자리 보다 작으면 false
	if(value.length < 8 ) return false;			
	if((/^\d{4}-?(0?[1-9]|1[0-2])-?(0?[0-9]|[1-2][0-9]|3[01])$/).test(value)){
//		 console.log("Date value: ", value);
		 return true;
	 }
	console.log("형식에 맞지 않는 날짜: ", this.value);
	return false;
	};
	 
// 날짜형식만 가능: yyyymm
$.isValidYm = function(value){		
	// 6자리 보다 작으면 false
	if(value.length < 6 ) return false;			
	if((/^\d{4}-?(0?[1-9]|1[0-2])$/).test(value)){
//		 console.log("Ym value: ", value);
		 return true;
	}
	console.log("형식에 맞지 않는 날짜: ", this.value);
	return false;
	};


//Replace Number
$.replaceDecimalNumber = function(val){return val.replace(/[^0-9|\.]/g,'');}; 
//add Comma Number
$.addCommaNumber = function(val){return val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");}; 
//Trim
$.Trim = function(str){return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};
//LTrim
$.LTrim = function(str){return str.replace(/^\s+/,"");};
//RTrim
$.RTrim = function(str){return str.replace(/\s+$/,"");};

//첨부파일 멀티다운
$.MultifileDown = function(bubble_id, state){	
	var open_chk = "0";
	if(state == "Y" && $("#bubble" + bubble_id).css("display") == "none"){
		open_chk = "1";
	}

	$("[id^='bubble']").css("display", "none");	
	if(open_chk == "1") $("#bubble" + bubble_id).css("display", "block");
}; 


/******************************************************************************************
 *** Ajax 함수
 ******************************************************************************************/
$.callAjax = function(requestData, url, settings) {	

	var _settings = {};
	if(typeof settings == 'undefined') {
		settings = {};
	}
	_settings.type     = settings.type || "POST";
	if(settings.enctype != 'undefinde') {
		_settings.enctype = settings.enctype;
	}
	if(settings.processData != 'undefinde') {
		_settings.processData = settings.processData;
	}
	if(settings.contentType != 'undefinde') {
		_settings.contentType = settings.contentType;
	}
	_settings.timeout  = (settings.timeout != 'undefined') ? settings.timeout : 120*1000; //milisecond 
	_settings.cache    = (settings.cache != 'undefined') ? settings.cache : false;
	_settings.dataType = (settings.dataType != 'undefined') ? settings.dataType : "json";
	_settings.async = (settings.async != 'undefined') ? settings.async : true;
	_settings.beforeSend = function(xhr) {
		xhr.setRequestHeader("menuId", $.fn.getMenuId());
	},
	_settings.error = settings.error || function( xhr, textStatus, thrownError ) {
		console.log("[$.callAjax]error!!");
		$.fn.hideLoadingBar();
		
		var responseVal = xhr.responseText;
		
		if (xhr.status == 401 || xhr.status == 402 || xhr.status == 403) {
			var call_url = "";
			alert(responseVal);
			if(xhr.status == 401){
				call_url = "/admin/luserLogin.do";
			}else if(xhr.status == 402 || xhr.status == 403){
				call_url = "/main.do";
			}
			window.top.location.href = call_url;
		}else{
			if (xhr.status === 0) {
				alert ('Not connected.\nPlease verify your network connection.');
			} else if (xhr.status == 404) {
	        	alert ('The requested page not found. [404]');
	        } else if (xhr.status == 500) {
	        	alert ('Internal Server Error [500].');
	        } else if (thrownError === 'parsererror') {
	        	alert ('Requested JSON parse failed.');
	        } else if (thrownError === 'timeout') {
	        	alert ('Time out error.');
	        } else if (thrownError === 'abort') {
	        	alert ('Ajax request aborted.');
	        } else {
	        	alert ('Uncaught Error : \n' + responseVal);
	        }
		}
	};
	_settings.complete = _settings.complete || function(){
		$.fn.hideLoadingBar();	
	};
	
	_settings.success = function(data){
		$.fn.hideLoadingBar();
		if(data && data.warnning) {
			var errorCode = data.warnning.errorCode;
			var errorMessage = data.warnning.errorMessage;
			if(errorCode == "SESSION99") {		//LoginInterceptor SESSION 체크 응답
				alert("세션이 존재하지 않습니다.\n로그인 페이지로 이동합니다.");
				window.top.location.href = "/admin/luserLogin.do";
			} else {
				var msg = []; 
				msg.push("에러코드 : " + errorCode);
				msg.push("에러내용 : " + errorMessage);
				data.result = "-1";
				$.fn.msgBox(msg.join("\n"));
			}
		}
	};
	
	_settings.error = _settings.error || function() {
		$.fn.hideLoadingBar();
	}
	
	_settings.data = _settings.data || requestData;
	_settings.ajaxStart = $.fn.showLoadingBar();	
	
	return $.ajax(url, _settings);
};

$.callAjaxUpload = function(requestData, url, settings) {	
	var option = {"enctype":"multipart/form-data", "processData": false, "contentType": false};
	return $.callAjax(requestData, url, option);
};
})(jQuery);

/*************************************
 * 사용자 정의 함수
 *************************************/
(function ($) {

// 숫자 제외하고 모든 문자 삭제.
$.fn.removeChar = function(_v){
	if (typeof(_v) === "undefined"){
		$(this).each(function(){this.value = this.value.replace(/[^0-9]/g,'');});
	}else{
		return _v.replace(/[^0-9]/g,'');
	}
};

// 빈값 체크
$.fn.isNull = function(p){
	if(typeof(p) === "undefined"){if($(this).val().replace(/\s/g,'') == "") return true;}else{if(p.replace(/\s/g,'') == "") return true;}
	return false;
};

//form Data 직렬화(JSON 변경에 이용)
$.fn.serializeObject = function(){
	var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
    	if (o[this.name]) {
    		if (!o[this.name].push) {o[this.name] = [o[this.name]];}
    		o[this.name].push(this.value || '');
    	} else {
    		o[this.name] = this.value || '';
    	}
    });
    return o;
};

//FROM 방식 전송시 로딩바
$.fn.spin = function (opts) {
	this.each(function () {
		var $this = $(this);
		data = $this.data();

		if (data.spinner) {
			data.spinner.stop();
			delete data.spinner;
		}
		
		if (opts !== false) {window.s = data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);}
    });
    return this;
};

//실시간 comma적용
$.fn.formatCurrencyBlur = function(){
	this.css("ime-mode", "disabled");
	this.blur(function() {
		$(this).formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: 0 });
		var asNumber = String($(this).asNumber());
		if(parseFloat($(this).val().replace(/[,]/g,'')) != asNumber){$(this).val("");}
	}).keyup(function(e) {
		var ev = window.event || e;
		var keyUnicode = ev.charCode || ev.keyCode;
		if (ev !== undefined) {
			switch (keyUnicode) {
				case 16: break; // Shift
				case 27: this.value = ''; break; // Esc: clear entry
				case 35: break; // End
				case 36: break; // Home
				case 37: break; // cursor left
				case 38: break; // cursor up
				case 39: break; // cursor right
				case 40: break; // cursor down
				case 78: break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!)
				case 110: break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
				case 190: break; // .
				default: $(this).formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
			}
		}
	}).bind('decimalsEntered', function(e, cents) {
		alert('Please do not enter any cents (0.' + cents + ')');
	});
};


//*******************************************************************
//Function Name 	: isEmpty
//Description 		: String 혹은 Object가 비었거나("") 혹은 null 인지 검증한다.
/*  [빈값 정의]
	* String
		- ''
		- new Sring()
		- '' Template Literals
		- ${''} Template Literals
	* Array
		- []
		- new Array()
	* Object
		- {}
		- new Object()
		- new Proxy({},{}) Proxy
	* null
	* undefined 
	
	예시:
	*  isEmpty(null)      = true
	*  isEmpty("")        = true
	*  isEmpty(" ")       = false
	*  isEmpty("bob")     = false
	*  isEmpty("  bob  ") = false
	* 					
*/
//Argument			: value - 체크 대상 스트링오브젝트이며 null을 허용함
//Return			: true - 입력받은 값이 빈 문자열 또는 빈 Object, null인 경우
//*******************************************************************
$.fn.isEmpty = function(value){
	if(value === null) return true
	if(typeof value === "undefined" || value == null || value == '') return true 
	//	if(value.trim().length == 0) return true      // 공백도 Empty로 처리할 경우 주석 해제
	if(typeof value === 'string' && value === '') return true
	if(Array.isArray(value) && value.length < 1) return true
	if(typeof value === 'object' && value.constructor.name === 'Object' && Object.keys(value).length < 1 && 
		Object.getOwnPropertyNames(value) < 1) return true
	if(typeof value === 'object' && value.constructor.name === 'String' && Object.keys(value).length < 1) return true // new String()

	return false
}
//*******************************************************************
//Function Name 	: Validations
//Description 		: 일치하는 요소 집합의 각 요소에 대한 입력을 주어진 InputFilter로 제한한다.
//Argument			: 
//Return			: 
//*******************************************************************
 $.fn.inputFilter = function(inputFilter){
 	return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function(){
 		if(inputFilter(this.value)){
 			this.oldValue = this.value;
 			this.oldSelectionStart = this.selectionStart;
 			this.oldSelectionEnd = this.selectionEnd;
 		}	else if (this.hasOwnProperty("oldValue")){
 			this.value = this.oldValue;
 			this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
 		}	else {
// 			console.log("형식에 맞지 않는 데이터: ", this.value);
 			this.value = "";
 		}
 		});
 	};
 	
 // date 날짜 입력 Validation
$.fn.isDateFilter = function(inputFilter){
	return this.on("blur", function(){
		if(inputFilter(this.value)){
			this.oldValue = this.value;
			this.oldSelectionStart = this.selectionStart;
			this.oldSelectionEnd = this.selectionEnd;
		}	else if (this.hasOwnProperty("oldValue")){
			this.value = this.oldValue;
			this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
//			console.log("형식에 맞지 않는 날짜: ", this.value);
		}	else {
//			alert("형식에 맞지 않는 날짜입니다.");
//			console.log("형식에 맞지 않는 날짜: ", this.value);
			this.value = "";
		}
	});
};

//*******************************************************************
//Function Name 	: datepickerSetting
//Description 		: 달력 셋팅
//Argument			: 없음
//Return			: 없음
//*******************************************************************
$.fn.datepickerSetting = function(){
	if(!$.datepicker) {
		console.log("$.datepicker 객체가 존재하지 않습니다.");
		return;
	}
	$.datepicker.regional['ko'] = {
		closeText: '닫기',
		prevText: '이전달',
		nextText: '다음달',
		currentText: '오늘',
		monthNames: ['1월','2월','3월','4월','5월','6월',
		'7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월',
		'7월','8월','9월','10월','11월','12월'],
		dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
		dayNamesShort: ['일','월','화','수','목','금','토'],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		weekHeader: '주',
		dateFormat: 'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		yearRange: 'c-99:c+99',
		firstDay: 0,
		isRTL: false,
		showButtonPanel:true,		
		showMonthAfterYear: true,
		showOn: 'none',
		yearSuffix: '년',
		yearRange:'c-99:c+99'

	};

	$.datepicker.setDefaults($.datepicker.regional['ko']);

	$(function() {
		$('.datepicker').each(function(p_idx) {
			if($(this).hasClass("month")) {
				$(this).datepicker({
					closeText:"선택",
					dateFormat:"yy-mm",
					onClose:function(dateText, inst) {
						var year;
						var month;
						var selectDate = $.replaceAll(dateText, "-","");
						if(selectDate.length == 6) {
							year = selectDate.substring(0,4);
							month = Number(selectDate.substring(4,6)) - 1;
						}
						if($(".ui-datepicker-close")[0] == event.srcElement) {	//캘린더 선택 버튼 클릭
							month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
							year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
						}
						
						if(year && month) {
							$(this).datepicker("option", "defaultDate", new Date(year,month,1));
							$(this).datepicker("setDate", new Date(year, month,1));
							var selectedAfterFn = $(this).attr("selectedAfterFn");	//후처리 Function String
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
				})
				
				// date 날짜 테스트: 날짜형식 yyyymm 6자리 입력 가능.
				 $(this).isDateFilter(function(value){
					 return $.isValidYm(value);
				 });
			} else {
				if($(this).hasClass("date")) {
					var option = $.datepicker.regional['ko'];
					option.onClose = function(dateText, inst) {
						var selectedAfterFn = $(this).attr("selectedAfterFn");	//후처리 Function String
						if(selectedAfterFn && window[selectedAfterFn]) {
							window[selectedAfterFn]($(this).val());
						}
					};
					$(this).datepicker(option);
					$(".ui-datepicker").css("font-size", "0.9em");

					// date 날짜 테스트: 날짜형식 yyyymmdd 8자리 입력 가능.
					 $(this).isDateFilter(function(value){
						 return $.isValidDate(value);
					 });

				}
			}
		});
	});
}


//*******************************************************************
//Function Name 	: filteringXSS
//Description 		: XSS 취약점 대응 코딩
//Argument			: origin
//Return			: origin
//*******************************************************************
$.fn.filteringXSS = function(origin){
	return origin.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, "");
}

//*******************************************************************
//Function Name 	: pageMove
//Description 		: 메뉴 페이지 호출
//Argument			: url
//Return			: 없음
//*******************************************************************
$.fn.pageMove = function(url){
	window.location.href=filteringXSS(url);
}

//로딩바 호출
$.fn.showLoadingBar = function(){ 
	$.fn._makeLoadingElement();
	$("#loading").show();
};

//로딩바 호출 종료
$.fn.hideLoadingBar = function(){
	$.fn._makeLoadingElement();
	$("#loading").hide();
};

//날짜포맷: yyyymmdd
$.fn.dateFormat = function() {
	var arg = arguments;
	var dateStr = arg[0];
	var sep = arg[1];

	if(dateStr == null || dateStr == undefined) return "";
	if(sep == null || sep == undefined) sep = "-";
	dateStr = $.replaceAll(dateStr, sep,"");
	if(dateStr){return dateStr.length >= 8 ? (dateStr.substr(0, 4)+sep+dateStr.substr(4, 2)+sep+dateStr.substr(6, 2)):dateStr;}else{return "";}
};

//날짜포맷: yyyymm
$.fn.monthFormat = function() {
	var arg = arguments;
	var dateStr = arg[0];
	var sep = arg[1];

	if(dateStr == null || dateStr == undefined) return "";
	if(sep == null || sep == undefined) sep = "-";
//	dateStr = dateStr.replaceAll(sep, "");
	dateStr = $.replaceAll(dateStr, sep,"");
	
	if(dateStr){return dateStr.length >= 6 ? (dateStr.substr(0, 4)+sep+dateStr.substr(4, 2)):dateStr;}else{return "";}
};


$.fn._makeMsgBoxElement = function() {
	if($("#messageBox")[0]) return;
	var msgBoxElemArry = [];
	msgBoxElemArry.push("<!-- 알림 메시지 -->                                                                                                              ");
	msgBoxElemArry.push("<div id='messageBox' class='popupWrap' style='position:absolute;margin-left:0px;margin-top:0px;display:none;'>                 ");
	msgBoxElemArry.push("	<div class='popup_header'>                                                                                                    ");
	msgBoxElemArry.push("    	<h3 id='messageTitle'>알림 메시지</h3>                                                                                       ");
	msgBoxElemArry.push("    </div>                                                                                                                     ");
	msgBoxElemArry.push("    <div id='messageSubTitle' class='popup_body'>                                                                              ");
	msgBoxElemArry.push("    	<h4>내용</h4>                                                                                                              ");
	msgBoxElemArry.push("        <div style='overflow: auto;background: #f1f2f4;'>                            ");
	msgBoxElemArry.push("        <pre id='messageContent' class='popup_content' style='text-align:center;line-height: 1.5;'>                            ");
	msgBoxElemArry.push("        </pre>                                                                                                                 ");
	msgBoxElemArry.push("        </div>                                                                                                                 ");
	msgBoxElemArry.push("    </div>                                                                                                                     ");
	msgBoxElemArry.push("  <div class='popup_footer'>                                                                                                   ");
	msgBoxElemArry.push("      <input id='message_btn_ok' type='button' value='확인' style='' onclick='javascript:$.fn.closeMsgBox(event);'>             ");
	msgBoxElemArry.push("      <input id='message_btn_cn' type='button' value='취소' style='display:none' onclick='javascript:$.fn.closeMsgBox(event);'> ");
	msgBoxElemArry.push("      <input id='message_btn_cl' type='button' value='닫기' style='display:none' onclick='javascript:$.fn.closeMsgBox(event);'> ");
	msgBoxElemArry.push("    </div>                                                                                                                     ");
	msgBoxElemArry.push("</div>                                                                                                                         ");
	msgBoxElemArry.push("<div class='popupDim' style='display:none;'></div>                                                                             ");
	$(document.body).append($(msgBoxElemArry.join("")));
};

$.fn._makeLoadingElement = function() {
	if($("#loading")[0]) return;
	var loadingElemArry = [];
	loadingElemArry.push("<!-- 로딩중 -->                                                                                 ");
	loadingElemArry.push("<div id='loading' style='display:none;'>                                                      ");
	loadingElemArry.push("	<div class='loading_inner'><i class='xi-spin xi-spinner-1 xi-4x'></i>처리중 입니다.</div>       ");
	loadingElemArry.push("</div>                                                                                        ");
	$(document.body).append($(loadingElemArry.join("")));
};

/**
 * 
 * @설명: message box를 호출한다
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: 
 * 	message : 메시지 내용(\n개행코드)
 *  callbackFn : 메시지가 닫힐 떼 호출할 함수
 *  btnType : 1:확인, 2:확인/취소
 * @반환값: String
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.msgBox = function(message, callbackFn, btnType, userParam) {
	
	$.fn._makeMsgBoxElement();
	
	$(".popupDim").show();
	$("#messageBox").show();
	
	var top = (($(window).height() - $("#messageBox").outerHeight())/2 + $(window).scrollTop()) + "px";
	var left = (($(window).width() - $("#messageBox").outerWidth())/2 + $(window).scrollLeft()) + "px";
	
	$("#messageBox").css("left", left);
	$("#messageBox").css("top", top);
	$("#messageContent")[0].innerHTML = message;
	if(btnType == 1) {
		$("#message_btn_ok").show();
		$("#message_btn_cn").hide();
		$("#message_btn_cl").hide();
	} else if(btnType == 2) {
		$("#message_btn_ok").show();
		$("#message_btn_cn").show();
		$("#message_btn_cl").hide();
	}
	if(callbackFn) {
		$.fn.msgBoxCallback = callbackFn;
		$.fn.msgBoxUserparam = (typeof userParam != 'undefined') ? userParam:{};
	}
	
	$("#message_btn_ok").focus();
};

/**
 * 
 * @설명: message code로 메지지 박스를 호출한다
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: paramObj
 * 	paramObj.messageKey : 메시지 조회 키
 *  paramObj.messageParam : 메시지 바인딩 파라미터 배열
 *  paramObj.callbackFn : 메시지가 닫힐 떼 호출할 함수
 *  paramObj.btnType : 1:확인, 2:확인/취소
 *  paramObj.userParam : callbackFn에서 받을 사용자 Parameter
 * @반환값: String
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.msgBoxByCd = function(paramObj) {
	var messageKey = paramObj.messageKey;
	var messageParams = paramObj.messageParam;
	var callbackFn = paramObj.callbackFn;
	var btnType = paramObj.btnType;
	var userParam = paramObj.userParam||null;
	if(!messageKey) {
		alert("파라미터의 messageKey는 필수 입력사항입니다.");
		return;
	}
	var message = $.fn.getMessage(messageKey, messageParams);
	$.fn.msgBox(message, callbackFn, btnType, userParam);
};

//close message box
$.fn.closeMsgBox = function(e) {
	$.fn._makeMsgBoxElement();
	var returnObj = {};
	if(e) {
		var srcElemId = e.srcElement.id;
		if(srcElemId == "message_btn_ok") {
			returnObj.btn_ok = true;
		} else if(srcElemId == "message_btn_cn") {
			returnObj.btn_cancel = true;
		} else if(srcElemId == "message_btn_cl") {
			returnObj.btn_close = true;
		}
	}
	$("#message_btn_ok").show();
	$("#message_btn_cn").hide();
	$("#message_btn_cl").hide();
	$("#messageContent")[0].innerHTML = "";
	$("#messageBox").hide();
	$(".popupDim").hide();
	
	if($.fn.msgBoxUserparam) {
		returnObj.userParam = $.fn.msgBoxUserparam;
	}
	if($.fn.msgBoxCallback)	$.fn.msgBoxCallback(returnObj);
	
	delete $.fn.msgBoxCallback;
	delete $.fn.msgBoxUserparam;
};

/**
 * 
 * @설명: window 팝업을 호출한다.
 * ex)var popup = $.fn.openPopup({url:"/main.do", name:"main", width:800, height:600});
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: option 
 * @반환값: popup object
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.openPopup = function(option){
	var url = option.url;
	var width = option.width||600;
	var height = option.height||480;
	var top = option.top;
	var left = option.left;
	var resizable = option.resizable||'yes';
	var status = option.status||'no';
	var titlebar = option.titlebar||'no';
	var name = option.name||'';
	
	if(typeof top == 'undefined') {
		if(browser.checkBrowser()[0] == 'Chrome' && window.top.screen.availTop != 0) {	//듀얼스크린
			top = (window.top.screen.availTop + (window.top.screen.availHeight / 2)) - (height /2);
		} else {
			top = (($(window.top).height() - height)/2 + $(window.top).scrollTop());
		}
	}

	if(typeof left == 'undefined') {
		if(browser.checkBrowser()[0] == 'Chrome' && window.top.screen.availLeft != 0) {	//듀얼스크린
			left = (window.top.screen.availLeft + (window.top.screen.availWidth / 2)) - (width /2);
		} else {
			left = (($(window.top).width() - width)/2 + $(window.top).scrollLeft());
		}
	}
	
	var specs = 'width='+width+',height='+height+',top='+top+',left='+left+', resizable=' + resizable + ', status=' + status + ', titlebar=' + titlebar;
	return window.open(url, name, 'width='+width+',height='+height+',top='+top+',left='+left+', resizable=yes, status=no, titlebar=no' );
}

//excel download 내부함수
$.fn._s2ab = function(s){
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for(var i=0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
};

/**
 * 
 * @설명: jsGrid의 내용을 xlsx 파일로 export한다.
 * ex)$.fn.exportGridExcel({id:"girdDiv"});
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: paramObj 
 * 	paramObj.id : grid id
 *  paramObj.fileName : 파일명 (gird.xlsx)
 *  paramObj.applyItemTemplate : 그리드의 itemTemplate 적용 여부(디스플레이 포맷: true/false)
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.exportGridExcel = function(paramObj){
	if(typeof paramObj != 'object') {
		$.fn.msgBox("파라미터는 JSON Object로 요청해야 합니다.");
		return;
	}
	var gridId = paramObj.id;
	var fileName = paramObj.fileName || "export_grid.xlsx";
	if(!fileName.toLowerCase().endsWith(".xlsx")) fileName + ".xlsx";
	var checkVisible = (typeof paramObj.checkVisible != 'undefined') ? paramObj.checkVisible : true;
	var applyItemTemplate = (typeof paramObj.applyItemTemplate != 'undefined') ? paramObj.applyItemTemplate:false;
	/** 0건 다운로드 요청 처리 - 2021.01.25
	if($("#" + gridId).jsGrid("option", "data").length == 0) {
		$.fn.msgBox("export할 데이터가 존재하지 않습니다.");
		return;
	}
	*/
	var excelHandler = {
			getExcelFileName : function(){
				return fileName;
			},
			getSheetName : function(){
				return "sheet1";
			},
			getExcelData : function(){
				var _data = $("#" + gridId).jsGrid("option", "data");
				var _fields = $("#" + gridId).jsGrid("option", "fields");
				var excelObjList = [];
				
				//0건에도 타이틀 헤더가 나오도록 요청, 빈 데이터 한건 삽입 처리 - 2021.02.09
				if(_data.length == 0) {
					var dummyObj = {};
					for(var i=0; i<_fields.length; i++) {
						var field = _fields[i];
						console.log("field : ", field);
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
											if(applyItemTemplate && field.itemTemplate) {
//												kvalue = field.itemTemplate(kvalue, value);
												kvalue = field.itemTemplate(value[key], value);
										    }
											field.title = field.title.replace("<br>", "");
											excleObj[field.title] = value[key];
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
			getWorksheet : function(){
				return XLSX.utils.json_to_sheet(this.getExcelData());
			}
	}
	
	var wb = XLSX.utils.book_new();
	var newWorksheet = excelHandler.getWorksheet();
	XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());
	var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
	saveAs(new Blob([$.fn._s2ab(wbout)], {type:"application/octet-stream"}), excelHandler.getExcelFileName());
};

/**
 * 
 * @설명: CSV 또는 Excel에 출력할 헤더 코멘트 정보의 CSV 배열을 생성한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: keyStr : 3행의 조건 =>JSON.stringify({key1:"value1", key2:"value2"});
 * 		   etcStr : 4행 기타 => 개발시 필요한 경우 추가
 * @반환값: array
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.makeExportCSVCommentHeader = function(keyStr, etcStr){
	var commentHead = [];
	var url = window.location.href;
	
	if(typeof keyStr == "undefined") keyStr = "";
	if(typeof etcStr == "undefined") etcStr = "";
	
	//아래정보는 공통 처리(로그인 처리 구현 후 보완)
	var menuId = url.substring(url.lastIndexOf("/") + 1).replace(".do", "");
	var userId = "100001234";
	var userName = "홍길동";
	commentHead.push("\"메뉴ID\"" + ",\"" + menuId + "\"");			
	commentHead.push("\"사용자\"" + ",\"" + userId + "\",\"" + userName + "\"");
	commentHead.push("\"조회조건\"" + ",\"" + keyStr + "\"");
	commentHead.push("\"기타\"" + ",\"" +  etcStr + "\"");
	return commentHead;
}	

//Export시 불필요한 컬럼은 제외처리용
$.fn._isExportFieldColumn = function(fieldItem, checkVisible) {
	var title = fieldItem.title;
	var name = fieldItem.name;
	var columnVisible = fieldItem.visible;
	if(!checkVisible) {
		columnVisible = true;
	}
	
	if(columnVisible
			&& title.indexOf("checkbox") == -1		//checkbox element
			&& name.toLowerCase() != "check"	//checkbox id
			&& name != "gridManupulate"			//그리드 조작 컨트롤
			&& name != 'status'){				//status
		return true;
	} else {
		return false;
	}

}

/**
 * 
 * @설명: jsGrid의 내용을 csv 파일로 export한다.
 * ex)$.fn.exportGridCSV({id:"girdDiv"});
 * @최초작성자: 장창환
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
$.fn.exportGridCSV = function(paramObj) {
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
			row += '"' + value + '"';
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
};	

/**
 * 
 * @설명: Table Id로 Excel을 다운로드한다.
 * ex)$.fn.exportTableExcel({id:"tableId"});
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: paramObj 
 * 	paramObj.id : table id
 * 	paramObj.element : table element
 *  paramObj.fileName : 파일명 (gird.csv)
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.exportTableExcel = function(paramObj){
	if(typeof paramObj != 'object') {
		$.fn.msgBox("파라미터는 JSON Object로 요청해야 합니다.");
		return;
	}
	var tableId = paramObj.id;
	var tableElement = paramObj.tableElement;
	if(!tableElement && tableId) {
		tableElement = document.getElementById(tableId);
	}
	var fileName = paramObj.fileName || "export_table.csv";
	var excelHandler = {
			getExcelFileName : function(){
				return fileName;
			},
			getSheetName : function(){
				return "sheet1";
			},
			getExcelData : function(){
				return tableElement;
			},
			getWorksheet : function(){
				return XLSX.utils.table_to_sheet(this.getExcelData());
			}
	}
	
	var wb = XLSX.utils.book_new();
	var newWorksheet = excelHandler.getWorksheet();
	XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());
	var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
	saveAs(new Blob([$.fn._s2ab(wbout)], {type:"application/octet-stream"}), excelHandler.getExcelFileName());
	tableElement = null;
};

/**
 * 
 * @설명: 파일을 다운로드 한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: url 
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.fileDownload = function(uri) {
	var link = document.createElement("a");
	link.href = uri;
	link.click();
};

/**
 * 
 * @설명: gridId에 CSV파일을 로드한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: paramObj
 * 	paramObj.id : 그리드 id
 *  callbackFn  : callback function  
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.loadGridCSV = function (paramObj) {
	$.fn.loadGridFile(paramObj, "csv");
}

/**
 * 
 * @설명: gridId에 CSV파일을 로드한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: paramObj
 * 	paramObj.id : 그리드 id
 *  callbackFn  : callback function  
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.loadGridExcel = function (paramObj) {
	$.fn.loadGridFile(paramObj, "excel");
}

$.fn.loadGridFileCallback = null;
$.fn.loadGridFile = function (paramObj, type) {
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
	$.fn.loadGridFileCallback = paramObj.callbackFn || null;
	var uploadFormArry = [];
	uploadFormArry.push("<div id='_gridFileUpload' style='display:none;'>");
	uploadFormArry.push("<form id='_gridUploadFrom' name='_gridUploadFrom' onsubmit='return false;'>");
	uploadFormArry.push("	<input type='hidden' name='_gridId' id='_gridId'/>");
	uploadFormArry.push("	<input type='hidden' name='_fields' id='_fields'/>");
	if(type == "csv") {
		uploadFormArry.push("	<input type='hidden' name='_gridUploadType' id='_gridUploadType' value='csv'/>");
		uploadFormArry.push("   <input type='file' name='_gridImportfile' id='_gridImportfile' accept='.csv' onchange='$.fn._loadGridFile()'/>");
	} else {
		uploadFormArry.push("	<input type='hidden' name='_gridUploadType' id='_gridUploadType' value='excel'/>");
		uploadFormArry.push("   <input type='file' name='_gridImportfile' id='_gridImportfile' accept='.xlsx' onchange='$.fn._loadGridFile()'/>");
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
$.fn._loadGridFile = function() {
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
		url = "/common/loadGridByExcel.do";
	}
	
	var reqParam = new FormData(form);
	$.callAjaxUpload(reqParam, url)
	.done(function(data) {
		gridSelector.jsGrid("reset");		//그리드 데이터 초기화			
		var listData = data.list;  			//서버로 받아온 데이터 리스트
		
		console.log("listData",listData);
		//그리드 바인딩
		gridSelector.jsGrid("loadData", listData).done(function(){
			if($.fn.loadGridFileCallback) {
				$.fn.loadGridFileCallback(data);
			}
		});
		$("#_gridFileUpload").remove();
		$.fn.loadGridFileCallback = null;

	}).fail(function(data){
	});			
};

/**
 * 
 * @설명: 그리드 상태 명을 조회한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: status : 상태 코드(c:삽입, u:수정, d:삭제, e:엑셀로드)
 * 	
 * @반환값: String
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.getGridRowStatusName = function(value) {
	var elemStr = "<span class='{0}'></span>";
	if(value == 'c') {	//삽입
		return $(elemStr.replace("{0}", "btn_grid_insert"));
	} else if (value == 'u') {	//수정
		return $(elemStr.replace("{0}", "btn_grid_update"));
	} else if( value == 'd') {	//삭제
		return $(elemStr.replace("{0}", "btn_grid_delete"));
	} else if( value == 'e') {  //엑셀 로드
		return $(elemStr.replace("{0}", "btn_grid_excel"));
	} else {
		return "";
	}
};

/**
 * @설명: 소계(Stubtotal) 상태를 식별한다.
 * @최초작성자: 편신범
 * @최초작성일: 2021. 02. 05.
 * @최종변경일: 2021. 02. 05.
 * @매개변수: status : 상태 코드(true: subtotal, false: none-subtotal)
 * 	
 * @반환값: String
 * @개정이력: 
 *  편신범 2021. 02. 05. 최초작성
 */
$.fn.getGridSubtotalStatus = function(value) {
	var elemStr = "<span class='{0}'>소계</span>";
	if(value == 'u') { // = 소계
		return $(elemStr.replace("{0}", "sub-total"));
	}};
	
/**
 * 
 * @설명: 메시지키로 메시지내용을 조회한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: key : 통합메시지 번호
 * 		   args : 파라미버 배열
 * 	
 * @반환값: String
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.getMessage = function(key, args){ 
	if(window.top === window) { //top프레임
		// [window.opener                        ] : 팝업 화면 인지 확인 용(팝업이 아닐 경우 해당 오브젝트 없음)
		// [Object.keys(window.opener).length > 0] : 그룹웨어에서 링크 여부 확인용(링크로 인해 window.opener 오브젝트는 있으나 상세 항목은 없음) 
		// [window.opener.systemInfo             ] : ifrs17 내부 공통 systemInfo 오브젝트 유무확인 용
//		if(window.opener && Object.keys(window.opener).length > 0 && window.opener.systemInfo) {	//IFRS17MS 팝업이면  // CROS이슈 주석처리 - 20230309
//			return window.opener.$.fn.getMessage(key, args);
//		} else {
			if(typeof systemInfo != "undefined" && systemInfo.message) {
				var message = systemInfo.message[key];
				if(message && typeof args != 'undefined' && args.length > 0) {
			        for (var i = 0; i < args.length; i++) {
			        	message = message.replace("{"+i+"}", args[i]);
					}
				}
				return message;
			} else {
				console.log("systemInfo not found!!");
			}
//		}
	} else {
		return window.top.$.fn.getMessage(key, args);
	}
};

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
$.fn.loadCommonCode = function(codeArr) {
	
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
	$.callAjax({"list": JSON.stringify(reqArr)}, "/common/selectCommonCodeList.do",{async:false})
	.done(function(data) {
		console.log("=====loadCommonCode done!");
		
		if(! $._commonObj["code"]) {
			$._commonObj["code"] = {};
		}
		$.extend($._commonObj["code"], data);
	}).fail(function(data) {
		console.log("fail to fn.loadCommonCode!!!!");
	});
}

/**
 * 
 * @설명: Selectbox Element에 options을 랜더링 한다.
 *       본함수를 사용하기전 $.fn.loadCommonCode로 코드정보들을 조회하여야 한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: paramObj : 파라미터 Object
 *         paramObj.codeArr : 코드ID의 배열
 *         paramObj.selArr : selectbox ID 배열
 *         paramObj.selValArr : selected value 배열
 *         paramObj.useFirstOption : 첫번째 option 사용여부(default:true)
 *         paramObj.firstOptionText : 첫번째 option Text
 *         paramObj.firstOptionValue : 첫번째 option Value
 *         paramObj.displayMode : 콤보박스 표현방식(label(default), value, label delim value, value delim label)
 *         paramObj.displayDelimiter : 콤보박스 Label에 사용될 delimiter(default:':')
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.renderCombobox = function(paramObj) {
	var codeArr = paramObj.codeArr;	//codeId 배열
	var selArr = paramObj.selArr;	//selectbox ID 배열
	var useFirstOption = (typeof paramObj.useFirstOption != "undefined") ? paramObj.useFirstOption:true;	//첫번째 option 사용여부
	var firstOptionText = paramObj.firstOptionText||"-선택-";	//첫번째 option Text
	var firstOptionValue = paramObj.firstOptionValue||"";		//첫번째 option Value
	var selValArr = paramObj.selValArr||[];

	var displayMode = (typeof paramObj.displayMode != 'undefined') ? paramObj.displayMode:"label";
	var displayDelimiter = (typeof paramObj.displayDelimiter != 'undefined') ? paramObj.displayDelimiter:" : ";

	//콤보박스 세팅
	if(typeof selArr != 'undefinde' && selArr.length > 0) {
		selArr.forEach(function(selId, i) {
			try {
				var $targetEl = $("#" + selId);
				if($targetEl.length > 0) {
					let codeId = codeArr[i];
					if(!codeId) { return; }
					
					$targetEl.children().remove();
					
					//콤보박스 option세팅
					var codeList = $._commonObj["code"][codeId];
					if(useFirstOption) {
						var $oEl = $("<option>").attr("value", firstOptionValue).text(firstOptionText);
						$targetEl.append($oEl);
						
					}
					for (let j = 0; j < codeList.length; j++) {
						let codeData = codeList[j];
						var $oEl;
						if(displayMode == "label") {
							$oEl = $("<option>").attr("value", codeData.code).text(codeData.codeNm);	
						} else if(displayMode == "value") {
							$oEl = $("<option>").attr("value", codeData.code).text(codeData.code);
						} else if(displayMode == "label delim value") {
							$oEl = $("<option>").attr("value", codeData.code).text(codeData.codeNm + displayDelimiter + codeData.code);
						} else if(displayMode == "value delim label") {
							$oEl = $("<option>").attr("value", codeData.code).text(codeData.code + displayDelimiter + codeData.codeNm);
						} else {
							$oEl = $("<option>").attr("value", codeData.code).text(codeData.codeNm);	
						}
						
						if(selValArr[i] && selValArr[i] == codeData.code) {
							$oEl.attr("selected", "true");
						} 
						$targetEl.append($oEl);
					}
				}
			} catch (e) {
				console.log("공통코드 콤보 세팅 중 에러 발생!!!! [SelectBox ID] ===> " + selId);
			}
		});
	}
};

/**
 * 
 * @설명: 그리드에 사용할 코드리스트를 반환한다.
 *       본함수를 사용하기전 $.fn.loadCommonCode로 코드정보들을 조회하여야 한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: codeId : 코드 ID
 * 		   useFirstOption : 첫번째 선택배열 생성여부(default:false)
 *         firstOptionText: 첫번째 선택배열의 Text
 *         firstOptionValue: 첫번째 선택배열의 Value
 *         displayMode : 콤보박스 표현방식(label(default), value, label delim value, value delim label)
 *         displayDelimiter : 콤보박스 Label에 사용될 delimiter(default:':')
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.getGridCodeItem = function(codeId, useFirstOption, displayMode, displayDelimiter, firstOptionText, firstOptionValue) {
	var codeItemList = [];
	if(typeof codeId == 'undefined' ||! codeId) {
		$.fn.msgBox("조회할 공통코드ID가 존재하지 않습니다.");
		return;
	}
	
	if(typeof useFirstOption == 'undefined') {
		useFirstOption = false;
	}

	if(typeof firstOptionText == 'undefined') {
		firstOptionText = "-선택-";
	}

	if(typeof firstOptionValue == 'undefined') {
		firstOptionValue = "";
	}

	if(typeof displayMode == 'undefined') {
		displayMode = "label";
	}

	if(typeof displayDelimiter == 'undefined') {
		displayDelimiter = " : ";
	}
	var codeDataList = [];

	if(displayMode == "label") {
		codeDataList = $._commonObj["code"][codeId];
	} else if(displayMode == "value") {
		var tmpCodeDataList = $._commonObj["code"][codeId];
		for(var i=0; i<tmpCodeDataList.length; i++) {
			var tmpCode = tmpCodeDataList[i];
			var newCode = {
					"code": tmpCode.code,
					"codeNm":tmpCode.code
			}
			codeDataList.push(newCode);
		}
	} else if(displayMode == "label delim value") {
		var tmpCodeDataList = $._commonObj["code"][codeId];
		for(var i=0; i<tmpCodeDataList.length; i++) {
			var tmpCode = tmpCodeDataList[i];
			var newCode = {
					"code": tmpCode.code,
					"codeNm":tmpCode.codeNm + displayDelimiter + tmpCode.code
			}
			codeDataList.push(newCode);
		}
	} else if(displayMode == "value delim label") {
		var tmpCodeDataList = $._commonObj["code"][codeId];
		for(var i=0; i<tmpCodeDataList.length; i++) {
			var tmpCode = tmpCodeDataList[i];
			var newCode = {
					"code": tmpCode.code,
					"codeNm":tmpCode.code + displayDelimiter + tmpCode.codeNm
			}
			codeDataList.push(newCode);
		}
	} 
	
	if(useFirstOption) {
		codeItemList.push({code:firstOptionValue, codeNm:firstOptionText});
	}
	return codeItemList.concat(codeDataList);
};

/**
 * 
 * @설명: 선택된 메뉴ID를 얻어온다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: 
 * @반환값: String
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.getMenuId = function(){ 
	if(window.top === window) { //top프레임
		// [window.opener                        ] : 팝업 화면 인지 확인 용(팝업이 아닐 경우 해당 오브젝트 없음)
		// [Object.keys(window.opener).length > 0] : 그룹웨어에서 링크 여부 확인용(링크로 인해 window.opener 오브젝트는 있으나 상세 항목은 없음) 
		// [window.opener.systemInfo             ] : ifrs17 내부 공통 systemInfo 오브젝트 유무확인 용
//		if(window.opener && Object.keys(window.opener).length > 0 && window.opener.systemInfo) {	//IFRS17MS 팝업이면  // CROS이슈 주석처리 - 20230309
//			return window.opener.$.fn.getMenuId();
//		} else {
			if(typeof window.selectedMenuId != "undefined") {
				return window.selectedMenuId;
			} else {
				console.log("window.getMenuId not found!!");
				return "";
			}
//		}
	} else {
		return window.top.$.fn.getMenuId();
	}
};

/**
 * 
 * @설명: 선택된 메뉴명를 얻어온다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: 
 * @반환값: String
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.getMenuNm = function(){ 
	if(window.top === window) { //top프레임
		// [window.opener                        ] : 팝업 화면 인지 확인 용(팝업이 아닐 경우 해당 오브젝트 없음)
		// [Object.keys(window.opener).length > 0] : 그룹웨어에서 링크 여부 확인용(링크로 인해 window.opener 오브젝트는 있으나 상세 항목은 없음) 
		// [window.opener.systemInfo             ] : ifrs17 내부 공통 systemInfo 오브젝트 유무확인 용
//		if(window.opener && Object.keys(window.opener).length > 0 && window.opener.systemInfo) {	//IFRS17MS 팝업이면  // CROS이슈 주석처리 - 20230309
//			return window.opener.$.fn.getMenuNm();
//		} else {
			if(typeof window.selectedMenuNm != "undefined") {
				return window.selectedMenuNm;
			} else {
				console.log("window.getMenuNm not found!!");
				return "";
			}
//		}
	} else {
		return window.top.$.fn.getMenuNm();
	}
};


/**
 * 
 * @설명: 로그인한 사용자 정보를 얻어온다..
 * @최초작성자: 장창환
 * @최초작성일: 2021. 03. 02.
 * @최종변경일: 2021. 03. 02.
 * @매개변수: 
 * @반환값: Object
 * @개정이력: 
 *  장창환 2021. 03. 02. 최초작성
 */
$.fn.getLoginUserInfo = function(){ 
	if(window.top === window) { //top프레임
// CROS이슈 주석 - 20230309
//		if(opener && typeof opener.window.top.$ != "undefined" && typeof opener.window.top.$ != "unknown") {
//			return opener.window.top.$.fn.getLoginUserInfo();
//		}else{
			return _getLoginUserInfo();
//		}
	} else {
		return window.top.$.fn.getLoginUserInfo();
	}
};

/**
 * 
 * @설명: 로그인한 사용자 화면권한정보를 얻어온다..
 * @최초작성자: 장창환
 * @최초작성일: 2021. 03. 02.
 * @최종변경일: 2021. 03. 02.
 * @매개변수: 
 * @반환값: Object
 * @개정이력: 
 *  장창환 2021. 03. 02. 최초작성
 */
$.fn.getScreenPermissionInfo = function(menuId){ 
	if(window.top === window) { //top프레임
// CROS이슈 주석 - 20230309
//		if(opener && typeof opener.window.top.$ != "undefined" && typeof opener.window.top.$ != "unknown") {
//			return opener.window.top.$.fn.getScreenPermissionInfo(menuId);
//		}else{
			return _getScreenPermissionInfo(menuId);
//		}
	} else {
		return window.top.$.fn.getScreenPermissionInfo(menuId);
	}
};

/**
 * 
 * @설명: 버튼 권한 적용.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: btnId : 버튼 ID 
 * 	
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$.fn.setBtnPermission = function(btnIdList) {
	var btnType = "";
	var btnAction = "";
	var screenPermission = "";
	var menuId = $.fn.getMenuId();
	
	for(var index in btnIdList){
		screenPermission = $.fn.getScreenPermissionInfo(menuId);
		if("Y" != screenPermission){
			btnType = (typeof btnIdList[index]["type"] != 'undefined') ? btnIdList[index]["type"] : "B"; 
			btnAction = (typeof btnIdList[index]["action"] != 'undefined') ? btnIdList[index]["action"] : "D";
			
			if("D" == btnAction){
				if("B" == btnType){
					$(btnIdList[index]["btnId"]).hide();
				}else if("A" == btnType){
					$(btnIdList[index]["btnId"]).addClass("dpn");
				}else{
					$(btnIdList[index]["btnId"]).hide();
				}
			}else if("R" == btnAction){
				$(btnIdList[index]["btnId"]).remove();
			}			
		}
	}
};

/**
 * 
 * @설명: grid에 데이터가 없습니다. 표시
 * @최초작성자: 김동현
 * @최초작성일: 2021. 06. 14.
 * @최종변경일: 2021. 06. 14.
 * @매개변수: gridId
 * 	
 * @반환값: 
 * @개정이력: 
 *  김동현 2021. 06. 14. 최초작성
 */
$.fn.getReturnValue = function(args){ 
	$("#" + args + "> div.jsgrid-grid-body > table > tbody > tr > td").empty();
	$("#" + args + "> div.jsgrid-grid-body > table > tbody > tr > td").append("데이터가 없습니다.");
};

})(jQuery);

/**
 * 
 * @설명: jsGrid를 생성한다.
 * ex)var gridObj = new ComJsGrid();
 *    gridObj.id("gridDiv");
 *    gridObj.gridCreate();
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: paramOption jsGrid의 option 
 * @반환값: 
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
var ComJsGrid = function(paramOption){
	if(typeof paramOption == 'undefined') paramOption = {};
	
	//default option From jsgrid.js
	this.option = {
			"id": "#" + paramOption.id||"",
			width: paramOption.width || "100%",
			height: paramOption.height + "px" || "auto",
			noDataContent: paramOption.noDataContent || "",
			invalidMessage: "[잘못된 입력 데이터]",
			pagerContainer: paramOption.pagerContainer || null,
			pageIndex: paramOption.pageIndex || 1,
			pageSize: paramOption.pageSize || 20,
			pageButtonCount: paramOption.pageButtonCount || 10,
			pagerFormat: paramOption.pagerFormat || "{first} {prev} {pages} {next} {last} &nbsp;&nbsp;&nbsp; {pageIndex} / {pageCount} &nbsp;&nbsp; Total rows : {itemCount}",
			pagePrevText: paramOption.pagePrevText || "Prev",
			pageNextText: paramOption.pageNextText || "Next",
			pageFirstText: paramOption.pageFirstText || "First",
			pageLastText: paramOption.pageLastText || "Last",
			pageNavigatorNextText: paramOption.pageNavigatorNextText || "...",
			pageNavigatorPrevText: paramOption.pageNavigatorPrevText || "...",
			loadIndication: (paramOption.loadIndication != undefined) ? paramOption.loadIndication : true,
			loadIndicationDelay: paramOption.loadIndicationDelay || 500,
			loadMessage: paramOption.loadMessage || "데이터 조회 중입니다.",
			sorting: (paramOption.sorting != undefined) ? paramOption.sorting : true,
			editing: (paramOption.editing != undefined) ? paramOption.editing : false,
			loadShading: (paramOption.loadShading != undefined) ? paramOption.loadShading : true,
			selecting:(paramOption.selecting != undefined) ? paramOption.selecting : true,
			selectHiglight:(paramOption.selectHiglight != undefined) ? paramOption.selectHiglight : true,
			paging: (paramOption.paging != undefined) ? paramOption.paging : true,
//			pageLoading: paramOption.pageLoading || true,
			autoload: (paramOption.autoload != undefined) ? paramOption.autoload : false,
			updateOnResize: (paramOption.updateOnResize != undefined) ? paramOption.updateOnResize : true,
			deleteConfirm: paramOption.deleteConfirm||"삭제하시겠습니까?",							// 삭제 확인 메시지
			fields: paramOption.fields || [],
			onInit: function(args) {
				//appen custom function
				this._compareItemData = function (preItem, curItem) {
					if(!preItem || !curItem) return false;
					for(var key in preItem) {
						if(preItem.hasOwnProperty(key)) {
							var pValue = preItem[key];
							var cValue = curItem[key];
							if(pValue != cValue) {
								return false;
							}
						}
					}
					return true;
				}
			},
			controller: {
				loadData: function(filter){
					var d = $.Deferred();
					d.resolve(filter);
					return d.promise();
				}
			},
			rowClick : function(args) {
				console.log("args : " , args);
				console.log("test : ", args.item);
				//highlight 처리
				if(this.selectHiglight) {
					$(".jsgrid-row, .jsgrid-alt-row").removeClass("highlight");
					var cRow = this.rowByItem(args.item);
					cRow.addClass("highlight");
				}

				//사용자 이벤트 호출
				if(this.userEvents["rowClick"]) {
					this.userEvents["rowClick"](args);
				}

				if(this.editing) {
					if(this._editingRow) this.updateItem();	//이전 작성중인 row apply
					this.editItem(args.item);
				}
				
				
			},
			
			rowDoubleClick: function(args) {
				//사용자 이벤트 호출
				if(this.userEvents["rowDoubleClick"]) {
					this.userEvents["rowDoubleClick"](args);
				}
			},
			onItemUpdating: function(args) { 
				var previousItem = args.previousItem;
				var item = args.item;
				if(item.status != 'dd') {	//삭제처리 제외
					if(this._compareItemData(previousItem, item)) {
							args.cancel = true;
							this.cancelEdit();
					}
				}
				
				//사용자 이벤트 호출
				if(this.userEvents["onItemUpdating"]) {
					this.userEvents["onItemUpdating"](args);
				}
			},
			onRefreshed : function (args) {	
				try{
					//헤더 사이즈와 Body 사이즈 동기화 처리
					//헤더 사이즈가 100%가 넘어가는 경우 가로스크롤이 생기지 않는 현상 처리
					//아래코드 적용시 확대/축소할 경우 헤더 바디 사이즈가 틀어짐
//					var headerWidth = this._headerRow.css("width");
//					this._bodyGrid.css("width", headerWidth);
				}catch(e){
					console.error("onRefreshed", e);
				}
		    },
			userEvents : {},
			
			rowClass: $.noop
	};
	
	if(paramOption.itemTemplate) {
		this.option.itemTemplate = paramOption.itemTemplate;
	}
	if(paramOption.rowClick) {
		this.option.userEvents["rowClick"] = paramOption.rowClick;
	}
	if(paramOption.rowDoubleClick) {
		this.option.userEvents["rowDoubleClick"] = paramOption.rowDoubleClick;
	}
	if(paramOption.onItemUpdating) {
		this.option.userEvents["onItemUpdating"] = paramOption.onItemUpdating;
	}
	if(paramOption.onDataLoading) {
		this.option.onDataLoading = paramOption.onDataLoading;
	}
	if(paramOption.onDataLoaded) {
		this.option.onDataLoaded = paramOption.onDataLoaded;
	}
	
	if(paramOption.controller && paramOption.controller.loadData) {
		this.option.controller.loadData = paramOption.controller.loadData;
	}

	if(paramOption.controller && paramOption.controller.updateItem) {
		this.option.controller.updateItem = paramOption.controller.updateItem;
	}

	if(paramOption.controller && paramOption.controller.deleteItem) {
		this.option.controller.deleteItem = paramOption.controller.deleteItem;
	}

	if(paramOption.controller && paramOption.controller.insertItem) {
		this.option.controller.insertItem = paramOption.controller.insertItem;
	}

	if(paramOption.onItemEditing) {
		this.option.onItemEditing = paramOption.onItemEditing;
	}

	if(paramOption.rowRenderer) {
		this.option.rowRenderer = paramOption.rowRenderer;
	}

	if(paramOption.headerRowRenderer) {
		this.option.headerRowRenderer = paramOption.headerRowRenderer;
	}
	
	if(paramOption.rowClass) {
		this.option.rowClass = paramOption.rowClass;
	}

	if(paramOption.filterRowRenderer) {
		this.option.filterRowRenderer = paramOption.filterRowRenderer;
	}

	if(paramOption.insertRowRenderer) {
		this.option.insertRowRenderer = paramOption.insertRowRenderer;
	}

	if(paramOption.editRowRenderer) {
		this.option.insertRowRenderer = paramOption.insertRowRenderer;
	}

	//grid insert/delete fail시 처리
	if(! window.jsGridOrigFinishInsert) {	//멀티 그리드를 생성하더라도 최초 한번만 처리하여야 한다.
		window.jsGridOrigFinishInsert = jsGrid.loadStrategies.DirectLoadingStrategy.prototype.finishInsert;
		window.jsGridInsertFailed = false;	//커스텀 전역변수
		jsGrid.loadStrategies.DirectLoadingStrategy.prototype.finishInsert = function(deletedItem, deleteItemIndex) {
			if(jsGridInsertFailed) {
				return;
			}
			jsGridOrigFinishInsert.apply(this, arguments);
		};

		window.jsGridOrigFinishDelete = jsGrid.loadStrategies.DirectLoadingStrategy.prototype.finishDelete;
		window.jsGridDeletionFailed = false;	//커스텀 전역변수
		jsGrid.loadStrategies.DirectLoadingStrategy.prototype.finishDelete = function(deletedItem, deleteItemIndex) {
			if(jsGridDeletionFailed) {
				return;
			}
			jsGridOrigFinishDelete.apply(this, arguments);
		};
		
		//"삭제하시겠습니까" Alert가 IE에서 "추가 메시지를 만들도록 허용하지 않음" 체크가 가능함에 따라 msgBox로 변경 처리
		jsGrid.Grid.prototype.deleteItem = function(item) {
		    var $row = this.rowByItem(item);
		    if(!$row.length) {
		        return;
		    }

		    var userParam = {};
			userParam.id = this.id;
			userParam.row = $row;
		    if(this.confirmDeleting) {
				 $.fn.msgBox(this.deleteConfirm, function (obj) {
					if(obj.btn_ok) {
						return $(obj.userParam.id).data("JSGrid")._deleteRow(obj.userParam.row);
					} else if(obj.btn_cancel) {
						return;
					} else if(obj.btn_close) {
						return;
					}
				}, 2, userParam);   
		    }
		}	
	}
};

//그리드 id
ComJsGrid.prototype.id = function(id){
	this.option.id = "#"+id;
};

//그리드 페이징 기능 여부
ComJsGrid.prototype.paging = function(paging){
	this.option.paging = paging;
};

//그리드 소트 기능 여부
ComJsGrid.prototype.sorting = function(sorting){
	this.option.sorting = sorting;
};

//그리드 페이징 페이지 사이즈
ComJsGrid.prototype.pageSize = function(pageSize){
	this.option.pageSize = pageSize;
};

//그리드 row에 마우스 오버시 selecting
ComJsGrid.prototype.selecting = function(selecting){
	this.option.selecting = selecting;
};

//그리드 row에 마우스 클릭시 selectHiglight
ComJsGrid.prototype.selectHiglight = function(selectHiglight){
	this.option.selectHiglight = selectHiglight;
};

//그리드 열정보 
ComJsGrid.prototype.fields = function(fields){
	this.option.fields = fields;
};

//그리드 row click 이벤트 
ComJsGrid.prototype.rowClick = function(rowClick){
	this.option.userEvents["rowClick"] = rowClick;
};

//그리드 row double click 이벤트 
ComJsGrid.prototype.rowDoubleClick = function(rowDoubleClick){
	this.option.rowDoubleClick = rowDoubleClick;
};

//그리드 rowClass 
ComJsGrid.prototype.rowClass = function(rowClass){
	this.option.rowClass = rowClass;
};

//그리드 페이징 포멧 
ComJsGrid.prototype.pagerFormat = function(totalRowsYn){
	console.log("totalRowsYn: ", totalRowsYn);
	if(totalRowsYn === "Y"){
		this.option.pagerFormat = "{first} {prev} {pages} {next} {last} &nbsp;&nbsp;&nbsp; {pageIndex} / {pageCount} &nbsp;&nbsp; Total rows : {itemCount}";
	}else{
		this.option.pagerFormat = "{first} {prev} {pages} {next} {last} &nbsp;&nbsp;&nbsp; {pageIndex} / {pageCount}";
	}
};

//그리드 height 
ComJsGrid.prototype.height = function(height){
	this.option.height = height+"px";
};

//그리드 헤더로 셀크기 지정 
ComJsGrid.prototype.activeResizeColumn = function() {
	if(this.option.editing) {
		console.log("Edit 모드의 그리드는 컬럼 resize를 지원하지 않습니다.");
		return;
	}

	if(window.onresize !== ComJsGrid.prototype._resizeGrid) {
		window.onresize = ComJsGrid.prototype._resizeGrid;
	}

	this.option.onRefreshed = function (args) {	
        //컬럼 리사이즈 처리
		try{
			ComJsGrid.prototype._resizeGrid();

			//sync column width on column resize
	        $("#"+ args.grid._container[0].id + " table").colResizable({
	        	liveDrag: true,
	        	resizeMode:"overflow",
	        	headerOnly:true,
	            onResize: function () {
	            	ComJsGrid.prototype._resizeGrid();
	            }
	        });
		}catch(e){
			console.error("onRefreshed", e);
		}
    }
};

ComJsGrid.prototype._resizeGrid = function() {
	//console.log("_resizeGrid");
	if(window._jsGridResizeTimer) clearTimeout(window._jsGridResizeTimer);
	window._jsGridResizeTimer = setTimeout(function() {
		try {
			//column resize
			$(".jsgrid-grid-header table .jsgrid-header-row .jsgrid-header-cell").each(function (i, obj) {
				var width =  $($(this)[0]).css("width");
				$(".jsgrid-grid-body table .jsgrid-row").each(function (j, obj) {
					obj.children[i].style.width = width;
				});

				$(".jsgrid-grid-body table .jsgrid-alt-row").each(function(j, obj) {
					obj.children[i].style.width = width;
				});
			});
			
			//column resize 후 header, body table width 동기화
			$(".jsgrid-grid-body table").css("min-width",$(".jsgrid-grid-header table").css("min-width"));
			$(".jsgrid-grid-body table").css("width",$(".jsgrid-grid-header table").css("width"));
			$(".jsgrid-grid-body .JCLRgrips").css("width",$(".jsgrid-grid-header table").css("width"));
			$(".jsgrid-nodata-row .jsgrid-cell").css("width",$(".jsgrid-grid-header table").css("width"));
			
			//스크롤 바 계산 후 재 셋팅
			var lastGripLeft = $(".jsgrid-grid-body .JCLRgrips").width() - 16;
			$(".jsgrid-grid-body .JCLRgrips .JCLRLastGrip").css("left",lastGripLeft + "px");
			$(".jsgrid-grid-body").css("overflow-x","auto");
			
		} catch(e) {
			console.error("ComJsGrid.prototype._resizeGird Error", e);
		}
	},100);
};

//그리드 객체 html 생성 
ComJsGrid.prototype.gridCreate = function(){
	return $(this.option.id).jsGrid(this.option);
};

/**
 * 
 * @설명: HTML 렌더링 이후 공통 처리
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @매개변수: 
 * @반환값: void
 * @개정이력: 
 *  장창환 2020. 12. 30. 최초작성
 */
$(document).ready(function(){
	//datePicker 활성화
	$.fn.datepickerSetting();
	
});