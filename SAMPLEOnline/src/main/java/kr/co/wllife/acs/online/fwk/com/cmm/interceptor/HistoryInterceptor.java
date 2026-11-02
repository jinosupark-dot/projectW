package kr.co.wllife.acs.online.fwk.com.cmm.interceptor;

import org.springframework.web.servlet.HandlerInterceptor; // [중요] Spring Boot 3.x 필수 (Adapter 삭제됨)
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.wllife.acs.online.fwk.com.cmm.util.BeanUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.SessionUtil;
import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.service.HistoryService;
import kr.co.wllife.acs.online.mg.sy.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;

/**
 * @시스템명: IFRS17
 * @업무명: 공통
 * @설명: 접근이력 관리 Interceptor (Spring Boot 3.5 호환)
 */
@Slf4j 
public class HistoryInterceptor implements HandlerInterceptor { // 인터페이스 구현으로 변경
    // static final Logger log = LoggerFactory.getLogger(HistoryInterceptor.class);
    private HistoryService historyService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        boolean result = true;
        try {
            // 사전 처리 로직
        } catch (Exception e) {
            log.error("Exception Occurs!", e);
            throw e;
        }
        return result;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) throws Exception {
        
        log.debug("HistoryInterceptor postHandle call");
        String uri = request.getRequestURI().toString().trim();
        UserInfoVO sessionVO = SessionUtil.getUserInfo();
        
        try {
            if (sessionVO != null) {
                if(uri.endsWith("m.do") && "GET".equalsIgnoreCase(request.getMethod())){    // main 화면만
                    
                    String regntEno    = "system";
                    String trtrEno     = "system";
                    String menuId      = "";
                    
                    int lastSlashIndex = uri.lastIndexOf("/");
                    uri = uri.replace(".do", "");
                    if(lastSlashIndex == -1){
                        menuId = uri;
                    }else{
                        menuId = uri.substring(lastSlashIndex+1);
                    }
                    
                    FwkMap inMap = new FwkMap();
                    inMap.put("loinIpAddr", request.getRemoteAddr());   
                    inMap.put("userId", sessionVO.getUserId()); 
                    inMap.put("userNm", sessionVO.getUserNm()); 
                    inMap.put("orgNm", sessionVO.getOrgNm());   
                    inMap.put("menuId", menuId     );   
                    inMap.put("regntEno", regntEno   ); 
                    inMap.put("trtrEno", trtrEno    );  
                    
                    historyService = (HistoryService) BeanUtil.getBean("historyService");
                    historyService.insertHistory(inMap);
                }
            }
        } catch (Exception e) {
            log.error("Exception Occurs!", e);
            throw e;
        }
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        log.info("rmServiceHistoryInterceptor afterCompletion call");
    }

    // @Override
    // public void afterConcurrentHandlingStarted(HttpServletRequest request, HttpServletResponse response, Object handler)
    //         throws Exception {
    //     logger.info("rmServiceHistoryInterceptor afterConcurrentHandlingStarted call");
    // }
}