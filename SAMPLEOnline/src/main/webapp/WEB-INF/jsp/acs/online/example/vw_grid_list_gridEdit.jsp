<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%response.setHeader("Cache-Control", "private, no-store, no-cache, must-revalidate");response.setHeader("Pragma", "no-cache");response.setDateHeader ("Expires", -1);%>
<%@ include file="/common/inc/commTaglibs.jsp"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>그리드 조회 샘플</title>
	<c:import url="/common/inc/commCSS.jsp" />
	<c:import url="/common/inc/commJS.jsp" />
	<!-- 화면별 js -->
	<ztag:js value="/js/example/vw_grid_list_gridEdit.js" />

</head>
<body class="">
<div id="contentWrap" class="clearfix">
	<div class="content_header">
	    <div class="main_title clearfix">
	      <h3 class="title">그리드 조회 샘플</h3>
    	</div>
	      <div class="search-form-wrap">
	        <div class="search-item">
	          <div class="search-item-inner fixed">
	            <div class="item">
	              <p class="title">마감년월일</p>
	              <!--
	              	input calendar 년월일 예시 
	              -->
	              <div class="cal-group">
	              		<input id="inp_closeDate" type="text" autocomplete="off" class="cal-input form-control datepicker date" onblur="this.value = $.fn.dateFormat(this.value);">
	              		<button class="cal" onclick="$('#inp_closeDate').datepicker('show');"><img src="/img/icon_cal.png"></button>
	              </div>
	              
	            </div>
	            <div class="item">
	              <p class="title">마감년월</p>
	              <!--
	              	input calendar 년월 
	              -->
	              	<div class="cal-group">
	              		<input id="inp_closeYm" type="text" autocomplete="off" class="cal-input form-control datepicker month" onblur="this.value = $.fn.monthFormat(this.value);">
	              		<button class="cal" onclick="$('#inp_closeYm').datepicker('show');"><img src="/img/icon_cal.png"></button>
	              	</div>
	              <!-- 변경소스 0118 -->
	            </div>
	            <div class="item">
	              <p class="title">콤보박스1</p>
	              	<div class="cal-group">
	              		<select id="combo1" style="width:100px;"></select>
	              	</div>
	            </div>
	            <div class="item">
	              <p class="title">콤보박스2</p>
	              	<div class="cal-group">
	              		<select id="combo2" style="width:100px;"></select>
	              	</div>
	            </div>
	          </div>
	        </div>
	        <div class="search-item-btn"> <a id="btn_search" href="javascript:void(0);"><i class="xi-search xi-x"></i> 조회</a> </div>
	     </div>
    	
  </div>
  <div class="inner clearfix"> 
      <!--grid table -->
      <div class="">
        <!-- table -->
        <div class="tableWrap gridtable">
			<!-- jsgrid 테이블: 생성된 selectList jsgrid가 표시되는 영역 -->
			<div id="gridDiv_gridEdit"/></div>
        </div>
      </div>
      <!--grid table --> 
      
      <div class="mt10">
	  <p class="title">int 정수만 입력 가능한 테스트</p>
		<div>
		<input id="intTextBox" type="text" class="wi120px">
		</div>
	  <p class="title">A-Z only 영어만 입력 가능한 테스트</p>
		<div>
		<input id="engTextBox" type="text" autocomplete="off" class="wi120px">
		</div>
		</div>
    </div>
    </div>
</body>
</html>