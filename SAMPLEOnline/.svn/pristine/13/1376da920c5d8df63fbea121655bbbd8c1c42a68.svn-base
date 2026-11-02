/**
 * @시스템명: IFRS17
 * @업무명: 로그인
 * @설명: 로그인하는 화면이다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30.
 * @최종변경일: 2020. 12. 30.
 * @개정이력:
 *  장창환 2020. 12. 30.  최초작성
 */


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
	//event 초기화
	initEvent();
	
	//로컬 및 개발서버 기본 admin 로그인 셋팅(임시-향후 삭제)
	if(location.href.indexOf("localhost:7070") > 0 || location.href.indexOf("10.10.10.151") > 0) {
		$("#userId").val("admin");
		$("#userPwd").val("admin");
	}
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

	$("#userPwd").on("keydown", function(e){
		if(e.keyCode == '13') {
			doLogin();
		}
	});
	
	//로그인
	$("#btn_login").on("click", function(e){
		doLogin();
	});


}

/**
 * 
 * @설명: id, pwd를 이용하여 로그인 처리 
 * @최초작성자: 장창환
 * @최초작성일: 2021. 2. 10.
 * @최종변경일: 
 * @매개변수: 
 * @반환값: void
 * @개정이력: 
 *  장창환 2021. 2. 10. 최초작성
 *
 */
function doLogin() {
	var userId = $("#userId").val();
	if($.fn.isEmpty(userId)) {
		$.fn.msgBox("아이디를 입력하십시오.");
		$("#userId").focus();
		return;
	}
	var userPwd = $("#userPwd").val();
	if($.fn.isEmpty(userPwd)) {
		$.fn.msgBox("패스워드를 입력하십시오.");
		$("#userPwd").focus();
		return;
	}

	var reqParam = {
			userId : userId,
			userPwd : userPwd
	};

	$.callAjax(reqParam, "/admin/doSessChk.do")
	.done(function(data) {
		if(data.result == "1") {
			if(data.sessExist == "1") {
				$.fn.msgBox("이미 접속중입니다. 기존의 접속을 종료하시겠습니까?", function(obj) {
					if(obj.btn_ok) {
						doLoginProc(reqParam);
					}
				}, 2);
			}else{
				doLoginProc(reqParam);
			}
		}else{
			if(data.errorcd == "ECIS099") {
				$.fn.msgBox("["+data.errorcd+"]"+" 사용자 정보가 일치하지 않습니다.");
			}else if(data.errorcd == "ECIU022") {
				$.fn.msgBox("["+data.errorcd+"]"+" 비밀번호가 일치하지 않습니다. 비밀번호를 확인하십시오("+ data.pwErrCnt +"/5회 실패).");
			}else if(data.errorcd == "ECIU023") {
				$.fn.msgBox("["+data.errorcd+"]"+" 비밀번호5회오류! 초기화후 사용하십시오.");
			}else{
				$.fn.msgBox("로그인에 실패하였습니다.");
			}
		}
	}).fail(function(data){
	});		
}

function doLoginProc(reqParam) {

	$.callAjax(reqParam, "/admin/doLogin.do")
	.done(function(data) {
		if(data.result == "1") {
			location.href = "/main.do";
		}else{
			if(data.errorcd == "ECIS099") {
				$.fn.msgBox("["+data.errorcd+"]"+" 사용자 정보가 일치하지 않습니다.");
			}else if(data.errorcd == "ECIU022") {
				$.fn.msgBox("["+data.errorcd+"]"+" 비밀번호가 일치하지 않습니다. 비밀번호를 확인하십시오("+ data.pwErrCnt +"/5회 실패).");
			}else if(data.errorcd == "ECIU023") {
				$.fn.msgBox("["+data.errorcd+"]"+" 비밀번호5회오류! 초기화후 사용하십시오.");
			}else{
				$.fn.msgBox("로그인에 실패하였습니다.");
			}
		}
	}).fail(function(data){
	});		

}

