<%
/**
 * @시스템명: IFRS17
 * @업무명: 공지사항관리
 * @설명: 공지사항을 관리하는 화면의 JS
 * @최초작성자: 61000255 (권세림)
 * @최초작성일: 2021.02.03
 * @최종변경일: 2021.06.15
 * @개정이력:
 *  권세림 2021.02.03  최초작성
 *  권세림 2021.06.15 3차 소스표준화
 */

%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/inc/commTaglibs.jsp"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<title>공지사항관리</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<c:import url="/common/inc/commCSS.jsp" />
<c:import url="/common/inc/commJS.jsp" />
<!-- 화면별 js -->
<ztag:js value="/js/mgsy/mgsy111m.js" />
</head>
<body>

  <!-- content01-->
  <div id="contentWrap" class="clearfix">
    <div class="content_header">
      <div class="main_title clearfix">
      	<!-- 20210430 툴팁 관련 변경 -->
        <h3 class="title fl">공지사항</h3>
        <!-- class="fl tootip" class 추가 -->
			<span class="fl tooltip"><img src="/img/img_tooltip.png" title="" id="imgToolTip"></span>
		<!-- 20210430 툴팁 관련 변경 -->
      </div>
      <!-- searchform -->
      <div class="search-form-wrap">
        <div class="search-item">
          <div class="search-item-inner fixed">
            <div class="item">
              <p class="title">게시일자</p>
              <div class="cal-group">
                <input id = "notice_search_dtae_to_txt" type="text" class="cal-input form-control datepicker date" style="width: 80px;" autocomplete="off">
                <button class="cal"  id = "notice_search_dtae_to" ><img src="/img/icon_cal.png"></button>
              </div>
              <span class="text">~</span>
              <div class="cal-group">
                <input id = "notice_search_dtae_from_txt" type="text"  class="cal-input form-control datepicker date" style="width: 80px;"autocomplete="off">
                <button id = "notice_search_dtae_from" class="cal"><img src="/img/icon_cal.png"></button>
              </div>
            </div>
            <div>
              <input id = "notice_search_check" type="checkbox"><label>게시종료건 제외</label>
            </div>
            <div class="item">
              <p class="title">게시자</p>
              <div>
                <input id = "notice_search_input_user" type="text" class="wi180px">
              </div>
            </div>
            <div class="item">
              <p class="title">게시부서</p>
              <div>
                <input id = "notice_search_input_org"  type="text" class="wi180px">
              </div>
            </div>
          </div>
        </div>
        <div id = "notice_btn_search" class="search-item-btn"> <a href="javascript:void(0);"><i class="xi-search xi-x"></i> 조회</a> </div>
      </div>
      <!-- searchform // --> 
    </div>
    <!-- btn -->
    <div class="sub_title">
    <h4 class="title">공지사항 리스트</h4>
    </div>
    <!-- btn//--> 
    <!-- table -->
   <div class="">
       <div class="tableWrap gridtable" style="overflow:hidden;">
			<!-- jsgrid 테이블: 생성된 selectList jsgrid가 표시되는 영역 -->
	<div id="noticeGrid"/></div>
	<div class="sub_title clearfix">
		      <h4 class="title">공지사항 상세내용</h4>
	</div>
     	</div>
     	<div class="tableWrap">
     	<table class="table-detail">
     		<colgroup>
     			<col style="width:10%">
     			<col style="width:12%">
     			<col style="width:10%">
     			<col style="width:12%">
     			<col style="width:10%">
     			<col style="width:12%">
     			<col style="width:10%">
     		</colgroup>          
	          <tbody>
	            <tr>
	              <th>제목</th>
	              <td colspan="7">
	                <div class="clearfix">
	                  <input id="anucTitl" type="text" class="wi290px fl mr5">
	                </div>
	              </td>
	            </tr>
	            <tr>
	              <th>게시일자</th>
	              <td>
	              <div class="cal-group">
	               	 <input id = "anucStrYmd" type="text"  class="cal-input form-control datepicker date" style="width: 100px;"autocomplete="off">
	                <button id = "anucStrYmd_btn" class="cal"><img src="/img/icon_cal.png"></button>															
              </div>
	              </td>
	              <th>게시기간</th>
	              <td>
	                <div class="clearfix">
	                    <select id="avlPrd" class="wi100">
		                <option value=""></option>
		                <option value="09">영구</option>
		                <option value="1M">1개월</option>
		                <option value="3M">3개월</option>
		                <option value="6M">6개월</option>
		                <option value="1Y">1년</option>
		              </select>
	                </div>
	              </td>
	              <th>게시자</th>
	              <td id="userNm" style="width: 150px;">
	              </td>
	              <th>게시부서</th>
	              <td id="orgNm" style="width: 150px;" >
	              </td>
	            </tr>
	          <tbody>
	        </table>
     	</div>
      
      	<div style="margin-top: 20px;">
      	  <div id="notice_content_area_div">
		    <div class="tableWrap">
		    	<div class="">
		      		<textarea id = "anucCntnt" cols="70" rows="15"></textarea>
		    	</div>
		    </div>
		  </div>
		</div>
		  <div style="margin-bottom: 33px;"> 
		      <div id="default_div" class="btnWrap txtar">
		        <button  id = "notice_btn_edit" class="btn-save"><span>저장</span></button>
		        <button  id = "notice_btn_delete" class="blue_btn"><span>삭제</span></button>
		        <button  id = "notice_add_data" class="blue_btn"><span>신규등록</span></button>
		      </div>
		      <div id="insert_div"class="btnWrap txtar">
		        <button  id = "notice_btn_save" class="btn-save"><span>저장</span></button>
		        <button  id = "notice_cancel" class="blue_btn"><span>취소</span></button>
		      </div>
		 </div>      
      </div>
      
    </div>
    <!--공지사하 상세 내용 //-->
    <!-- table // --> 
    <!--공지사항 상세 내용-->
  <!-- content01//--> 
  <!-- Content //--> 

</body>
</html>
