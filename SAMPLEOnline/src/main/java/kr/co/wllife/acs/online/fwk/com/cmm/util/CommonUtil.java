package kr.co.wllife.acs.online.fwk.com.cmm.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * @시스템명: ifrs17
 * @업무명: 공통
 * @설명: 서버 공통 유틸성 함수를 제공
 * @최초작성자: 장창환
 * @최초작성일: 2021. 1. 8.
 * @최종변경일: 2021. 1. 8.
 * @개정이력: 
 *  장창환 2021. 1. 8. 최초작성
 */
public class CommonUtil {
	static final Logger logger = LoggerFactory.getLogger(CommonUtil.class);
	static final String PROPERTY_KEY_STAGE = "stage";
	static final String PROPERTY_VAL_DEV = "DEV";
	static final String PROPERTY_VAL_TEST = "TEST";
	static final String PROPERTY_VAL_PROD = "PROD";
	
	
	/**
	 * 
	 * @설명: 현재 접속한 서버 스테이지 코드 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: String
	 * 	DEV : 개발
	 * 	test : 검증
	 * 	prod : 운영
	 * @개정이력: 
	 *  장창환 2021. 1. 8. 최초작성
	 */
	public static String getStage() {
		String stage = FwkProperties.getProperty(PROPERTY_KEY_STAGE);
		return stage;
	}

	/**
	 * 
	 * @설명: 현재 접속한 서버가 개발 서버 유무 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: boolean
	 * @개정이력: 
	 *  장창환 2021. 1. 8. 최초작성
	 */
	public static boolean isDev() {
		boolean ret = false;
		String stage = getStage();
		if(PROPERTY_VAL_DEV.equals(stage)) {
			ret = true;
		} else {
			ret = false;
		}
		return ret;
	}
	/**
	 * 
	 * @설명: 현재 접속한 서버가 검증 서버 유무 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: boolean
	 * @개정이력: 
	 *  장창환 2021. 1. 8. 최초작성
	 */
	public static boolean isTest() {
		boolean ret = false;
		String stage = getStage();
		if(PROPERTY_VAL_TEST.equals(stage)) {
			ret = true;
		} else {
			ret = false;
		}
		return ret;
	}
	
	/**
	 * 
	 * @설명: 현재 접속한 서버가 개발/검증 서버 유무 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: boolean
	 * @개정이력: 
	 *  장창환 2021. 1. 8. 최초작성
	 */
	public static boolean isDevAndTest() {
		boolean ret = false;
		String stage = getStage();
		if(PROPERTY_VAL_PROD.equals(stage)) {
			ret = false;
		} else {
			ret = true;
		}
		return ret;
	}

	/**
	 * 
	 * @설명: 현재 접속한 서버가 운영인지 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: boolean
	 * @개정이력: 
	 *  장창환 2021. 1. 8. 최초작성
	 */
	public static boolean isProd() {
		boolean ret = false;
		String stage = getStage();
		if(PROPERTY_VAL_PROD.equals(stage)) {
			ret = true;
		} else {
			ret = false;
		}
		return ret;
	}

}
