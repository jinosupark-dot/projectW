package kr.co.wllife.acs.online.fwk.com.cmm.interceptor;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.servlet.HandlerInterceptor; // [중요] Spring Boot 3.x 필수 (Adapter 삭제됨)
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.wllife.acs.online.fwk.com.cmm.exception.Warning;
import kr.co.wllife.acs.online.fwk.com.cmm.util.BeanUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.FwkProperties;
import kr.co.wllife.acs.online.fwk.com.cmm.util.SessionUtil;
import kr.co.wllife.acs.online.mg.sy.service.LoginService;
import kr.co.wllife.acs.online.mg.sy.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;

/**
 * @시스템명: ifrs17
 * @업무명: 공통
 * @설명: 로그인 체크 Interceptor (Spring Boot 3.5 호환)
 */

@Slf4j 
public class LoginInterceptor implements HandlerInterceptor { // 인터페이스 구현 방식으로 변경
    private static final String loginUri = "/admin/luserLogin.do";
    private static final String moveLoginPage = "<script>alert('세션이 존재하지 않습니다.\\n로그인 페이지로 이동합니다.');window.top.location.href = '" + loginUri + "';</script>";

    // Y:중복불가 or N:중복가능 (globals.properties에서 로드)
    private String loginDblCk = FwkProperties.getProperty("login.double.check");
    
    private LoginService loginService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        boolean result = false;
        PrintWriter out = null;
        try {
            String uri = request.getRequestURI().trim();
            log.info("session Check:" + uri);
            
            UserInfoVO sessionVO = SessionUtil.getUserInfo();
            
            String loginOK = "0";

            if("Y".equals(loginDblCk)) {
                if (sessionVO != null) {
                    Cookie[] cookies = request.getCookies();
                    String logSesnIdVal = "";
                    
                    // 쿠키가 존재할 경우에만 순회 (NullPointerException 방지)
                    if (cookies != null) {
                        for(Cookie cookie : cookies) {
                            String cName = cookie.getName();
                            log.debug("====cookie  [name]" + cookie.getName() + " / [value]" + cookie.getValue());
                            if("JSESSIONID".equals(cName)) {
                                logSesnIdVal = cookie.getValue();
                            }
                        }
                    }
                    
                    String userId = sessionVO.getUserId();
                    Map<String, Object> reqMap = new HashMap<>();
                    reqMap.put("userId", userId);
                    reqMap.put("logSesnIdVal", logSesnIdVal);

                    loginService = (LoginService) BeanUtil.getBean("loginService");
                    loginOK = loginService.selectLogSesnIdExist(reqMap);
                }   
            } 
            else {
                if (sessionVO != null) {
                    loginOK = "1";
                }
            }
            
            if (!"1".equals(loginOK)) {
                // Ajax 처리 sessionTimeout 체크
                if(isAjaxRequest(request)){                
                    log.debug("==============isAJAX!!!!!!=====================");
                    Warning w = new Warning("SESSION99");   
                    throw w;
                } else {
                    log.debug("==============is not AJAX!!!!!!=====================");
                }
                response.setContentType("text/html; charset=UTF-8");
                response.setCharacterEncoding("UTF-8");
                out = response.getWriter();
                out.write(moveLoginPage);
                result = false;
            } else {
                result = true;
            }       
        } catch (Exception e) {
            log.error("Exception Occurs!", e);
            throw e;
        } finally {
            if(out != null) {
                try { 
                    out.close(); 
                } catch(Exception ee) {
                    log.error("Exception Occurs!!", ee);
                }
            }
        }
        return result;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
    
    /**
     * @설명: XMLHttpRequest 여부를 체크한다. 
     */
    private boolean isAjaxRequest(HttpServletRequest req) {
        String ajaxHeader = "X-Requested-With";
        log.info("X-Requested-With : " + req.getHeader(ajaxHeader));
        return req.getHeader(ajaxHeader) != null && "XMLHttpRequest".equals(req.getHeader(ajaxHeader));
    }
}