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
<ztag:js value="/js/main.js" />

</head>
<body>
	<!-- top -->
	<header class="header_wrap clearfix">
		<h1>
			<img id="img_logo" src="img/common/logo.png" alt="ABL"
				style="cursor: pointer" />
		</h1>
		<h1 id="stage"
			style="position: absolute; left: 80px; top: 1px; color: #ee3124; font-size: 19pt;"></h1>
		<nav id="tnb_menu" class="clearfix"></nav>
		<div id="loinControl" class="header_right" style="display: none;margin-top:12px;">
			<p>
				<strong id="userName"></strong>님 <strong id="loginDateTime"></strong>
				로그인 하셨습니다.
			</p>
			<!--  
			<a href="javascript:void(0);"><img src="img/common/header_modify_info_icon.png" alt="정보변경" />정보변경</a>
			-->
			<a id="logout" href="javascript:void(0);"><img
				src="img/common/header_logout_info_icon.png" alt="로그아웃" />로그아웃</a>
			<img id="Main_logo_wr" src="img/common/logo_wr.png" alt="WR"/>
		</div>
		<!-- 0430 div 추가 -->
		<div class=""
			style="display: block; float: right; position: relative; top: 13px; margin-right: 40px">
			<input id="lvl_search_input" list="viewDataList"
				style="width: 150px; border: 1px solid #b8b8b8; position: relative; height: 21px" />
			<datalist id=viewDataList></datalist>
			<input type="button" id="lvlSearch" value="검색" class="t_btn_search">
			<!-- <input type="button" id="openAllView" value="펼치기" class="t_btn_search"> -->
		</div>
		<!-- //0430 div 추가 -->
	</header>
	<!-- top END -->
	<!--- Section Start-->
	<section>
		<!-- Nav -->
		<div id="gnb">
			<div id="lnb_wrap">
				<div class="group_gnb">
					<nav id="cssmenu"></nav>
				</div>
			</div>
		</div>
		<!-- lnb -->
		<!-- Nav //-->
		<!-- Content -->
		<div id="iframe_contentDiv" class="iframe_contentDiv">
			<iframe id="content_frame" src="about:blank" class="iframe_content"></iframe>
		</div>
		<!-- Content END//-->
	</section>
	<!--- Section END-->
</body>
</html>
