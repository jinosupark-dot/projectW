package kr.co.wllife.acs.online;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;


/**
 * 
 * @시스템명: ACS
 * @업무명: 공통
 * @설명: Spring Boot Application 을 외부 톰캣에 배포하기 위해서 필요함.
 * @최초작성자: 김종호
 * @최초작성일: 2026. 10. 27
 * @최종변경일: 2026. 10. 27
 * @개정이력:  
			 2026. 10. 27. 최초작성
 */
public class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(OnlineApplication.class);
	}

}
