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
	<ztag:js value="/js/example/vw_grid_list.js" />

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
	              		<input id="inp_closeDate" type="text" autocomplete="off" class="cal-input form-control datepicker date"  selectedAfterFn="afterDate"
	              		onblur="if(this.value) if($.isValidDate(this.value)) {this.value = $.fn.dateFormat(this.value);} else { alert('형식에 맞지 않습니다');}">
	              		<button class="cal" onclick="$('#inp_closeDate').datepicker('show');"><img src="/img/icon_cal.png"></button>
	              </div>
	              
	            </div>
	            <div class="item">
	              <p class="title">마감년월</p>
	              <!--
	              	input calendar 년월 
	              -->
	              	<div class="cal-group">
	              		<input id="inp_closeYm" type="text" autocomplete="off" class="cal-input form-control datepicker month" selectedAfterFn="afterMonth"
	              		onblur="if(this.value) if($.isValidYm(this.value)) {this.value = $.fn.monthFormat(this.value);} else { alert('형식에 맞지 않습니다'); this.focus()}">
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
        <div class="btnWrap fr mt0"> 
	        <a id="btn_exportCSV" href="javascript:void(0)" class="blue_btn" style="">엑셀(CSV) 다운로드</a>
	        <a id="btn_exportExcel" href="javascript:void(0)" class="blue_btn" style="">엑셀(XLSX) 다운로드</a>
	        <a id="btn_loadCSV" href="javascript:void(0)" class="blue_btn" style="">엑셀(CSV)로드</a>
	        <a id="btn_loadExcel" href="javascript:void(0)" class="blue_btn" style="">엑셀(XLSX)로드</a>
        </div>
        <!-- table -->
        <div class="tableWrap gridtable">
			<!-- jsgrid 테이블: 생성된 selectList jsgrid가 표시되는 영역 -->
			<div id="gridDiv"/></div>
        </div>
      </div>
      <!--grid table --> 

    <div class="main_title clearfix">
      <h3 class="title">기타 샘플</h3>
    </div>
     <div class="btnWrap fl mt0"> 
      <a id="btn_msgBox" href="javascript:void(0)" class="blue_btn" style="">확인 메시지 박스</a>
      <a id="btn_msgBox1" href="javascript:void(0)" class="blue_btn" style="">확인 메시지 박스(메시지코드사용)</a>
      <a id="btn_msgBoxConfirm" href="javascript:void(0)" class="blue_btn" style="">컨펌 메시지 박스</a>
      <a id="btn_msgBoxConfirm1" href="javascript:void(0)" class="blue_btn" style="">확인 메시지 박스(메시지코드사용)</a>
      <a id="btn_showLoading" href="javascript:void(0)" class="blue_btn" style="margin-left:2px;">show Loading</a> 
      <a id="btn_openPopup" href="javascript:void(0)" class="blue_btn" style="margin-left:2px;">openPopup</a> 
      <a id="btn_destroy" href="javascript:void(0)" class="blue_btn" style="margin-left:2px;">grid destroy</a> 
      <a id="btn_clear" href="javascript:void(0)" class="blue_btn" style="margin-left:2px;">grid clear</a> 
      <a id="btn_svrWarn1" href="javascript:void(0)" class="blue_btn" style="margin-left:2px;">서버에러메시지 발생1</a> 
      <a id="btn_svrWarn2" href="javascript:void(0)" class="blue_btn" style="margin-left:2px;">서버에러메시지 발생2</a>
      <a id="btn_isEmpty" href="javascript:void(0)" class="blue_btn" style="">isEmpty 테스트</a>
      
      <div class="mt10">
      <a id="btn_multiheaderSample" href="javascript:void(0)" class="blue_btn" style="margin-left:2px;">멀티헤더 샘플</a>
      <a id="btn_gridEdit" href="javascript:void(0)" class="blue_btn" style="margin-left:2px;">그리드 수정, 검증, 아이템 템플릿 관련</a>
      <a id="btn_test" href="javascript:void(0)" class="blue_btn" style="margin-left:2px;">공통코드 테스트</a> 
	  </div>

	<div class="mt10">
	  <p class="title">int 테스트</p>
		<div>
		<input id="intTextBox" type="text" class="wi120px">
		</div>
	  <p class="title">A-Z only (Eng only) 테스트</p>
		<div>
		<input id="engTextBox" type="text" autocomplete="off" class="wi120px">
		</div>
		<br>
	  <p class="title">날짜포맷 테스트</p>
		<div>
      		<input id="dateTextBox" type="text" autocomplete="off" class="" 
      		onblur="if($.isValidDate(this.value)) {this.value = $.fn.dateFormat(this.value);} else {alert('날짜 형식을 입력해주세요(yyyymmdd)'); this.value = '';}">
		</div>
	</div>
     </div>
    </div>
    </div>
    
    
</body>
</html>