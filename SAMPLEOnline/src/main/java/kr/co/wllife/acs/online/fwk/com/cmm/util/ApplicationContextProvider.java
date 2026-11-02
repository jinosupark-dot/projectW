package kr.co.wllife.acs.online.fwk.com.cmm.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
*
* 시스템에서 사용하는 Map관련 UTIL 클래스
*
* @author 	신예진
* @since 	2018. 11. 26. 
* @version 1.0
* @see
*
*<pre>
* << 개정이력(Modification Information) >>
*
*	     수정일		  수정자          			 수정내용
*  -----------  -----   ---------------------------
*  2018. 11. 26.  신예진       최초 생성
*
*</pre>
*/
@Component
public class ApplicationContextProvider implements ApplicationContextAware{
	private static Logger logger = LoggerFactory.getLogger(ApplicationContextProvider.class); 
	
	private static ApplicationContext ctx = null;
	
	public static ApplicationContext getApplicationContext(){
		return ctx;
	}
	
	public void setApplicationContext(ApplicationContext ctx) throws BeansException{
		this.ctx = ctx;
	}
}
