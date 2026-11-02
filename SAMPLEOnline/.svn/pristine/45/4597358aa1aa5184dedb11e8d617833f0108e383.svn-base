package kr.co.wllife.acs.online.fwk.com.cmm.exception.advice;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import kr.co.wllife.acs.online.fwk.com.cmm.exception.Warning;
import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import lombok.extern.slf4j.Slf4j;

@Slf4j 
@ControllerAdvice
@EnableWebMvc
public class CommonExceptionAdvice {
	/**
	 * Project default Error 처리
	 * @param e
	 * @return
	 */
	@ExceptionHandler(Warning.class)
	public ModelAndView returnErrorMessage(Warning e) {
		FwkMap warnMap = e.toMap();
		log.error("[CommonExceptionAdvice Warning]return :" + e.toString());
		FwkMap retMap = new FwkMap();
		retMap.put("warnning", warnMap);
		ModelAndView errorInfo = new ModelAndView("jsonView", retMap);
		return errorInfo;	
	}

	/**
	 * Project default Error 처리
	 * @param e
	 * @return
	 */
	@ExceptionHandler(Exception.class)
	public ModelAndView returnErrorMessage(Exception e) {
		String msg = "서버에서 알수 없는 오류가 발생하였습니다.";
		Warning w = new Warning(Warning.ERROR, "Exception", msg);
		log.error("[CommonExceptionAdvice Exception]return :" + e.toString());
		FwkMap retMap = new FwkMap();
		retMap.put("warnning", w.toMap());
		ModelAndView errorInfo = new ModelAndView("jsonView", retMap);
		return errorInfo;	
	}

}
