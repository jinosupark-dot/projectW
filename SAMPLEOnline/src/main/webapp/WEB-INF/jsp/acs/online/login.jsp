<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/common/inc/commTaglibs.jsp"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<title>ACS Management System</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<!--meta name="viewport" content="width=device-width, initial-scale=1"-->
<ztag:css sheet="stylesheet" value="/css/basic.css" />
<ztag:css sheet="stylesheet" value="/css/style.css" />
<ztag:css sheet="stylesheet" value="/css/gnb.css" />
<ztag:css sheet="stylesheet" value="/css/xeicon.min.css" />
<ztag:css sheet="stylesheet" value="/css/jquery.mCustomScrollbar.css" />

<ztag:js value="/common/js/html5/html5.js" />
<ztag:js value="/common/js/jquery/jquery-1.12.4.min.js" />
<ztag:js value="/common/js/jquery-ui/jquery-ui.min.js" />
<ztag:js value="/common/js/jquery/jquery.mousewheel.min.js" />
<ztag:js value="/common/js/jquery/jquery.mCustomScrollbar.js" />
<ztag:js value="/common/js/common.js" />
<ztag:js value="/js/login.js" />
</head>
<body>
	<header class="login_header">
		<h1>
			<img src="/img/login/logo.png" alt="ABL">
			<img id="login_logo_wr" src="/img/login/logo_wr.png" alt="WR"> <!-- 추가 - 20250820 -->
		</h1>
	</header>
	<section id="login_wrap" class="clearfix">
		<div class="login_box clearfix">
			<div class="login_inner">
				<h2>아이디 로그인</h2>
				<fieldset>
					<p class="id_input">
						<input id="userId" type="text" placeholder="아이디 ">
					</p>
					<p class="pw_input">
						<input id="userPwd" type="password" placeholder="패스워드">
					</p>
					<input id="btn_login" type="button" value="로그인">
					<!--  
					<p class="plugin_area">
						<a href="#"><span>수동설치파일</span></a>
					</p>
					-->
				</fieldset>
			</div>
		</div>
		<div class="login_msg">
			본인의 ID와 password로만 사용하시기 바랍니다. 본인 이외의 다른 직원이 password를 알고 있는 경우 변경하시길 바랍니다. ABL의 모든 프로그램은 권한 없는 사용을 금지합니다.<br /> 
			Use your own ID and password only. If others know your password, change the password. Any unauthorized use of software is prothibited.
		</div>
	</section>
	<footer class="login_footer">
		<p>
			서울특별시 영등포구 의사당대로 147(여의도동 ABL타워) / 구주소 : 서울특별시 영등포구 여의도동 45-21 ABL타워<br />
			<span>콜센터 1588-6500 해외 82-1588-6500,</span> 82-2-3299-5500
		</p>
		<p class="copyright">ⓒ ABL LIFE INSURANCE Co., Ltd. 2017</p>
	</footer>
</body>
</html>
