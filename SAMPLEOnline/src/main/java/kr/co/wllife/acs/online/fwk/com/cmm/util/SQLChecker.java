package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import com.github.rkpunjal.sqlsafe.SQLInjectionSafeValidator;

import kr.co.wllife.acs.online.fwk.com.cmm.exception.Warning;
import lombok.extern.slf4j.Slf4j;

/**
 * @시스템명: IFRS17
 * @업무명: SQL Injection Validator
 * @설명: Parameter 값을 받아서 SQL Injection 위험이 있는지 체크하는 Util 클래스
 * 		- 사용방법:
 * 			// 파라미터를 받는 Controller에 SQLChecker import
 * 			import fwk.com.cmm.util.SQLChecker;
 *  		
 *  		// 파라미터를 받은 map (reqMap)을 SQLChecker에 파라미터로 받음 
 * 			SQLChecker.checkValid(reqMap);
 * 
 * 			* 내부 함수: sql-injection-safe-1.0.2.jar 참고
 * 
 * @최초작성자: 편신범
 * @최초작성일: 2021. 2. 24.
 * @최종변경일: 
 * @개정이력: 
 *  편신범 2021. 2. 24. 최초작성
 */
@Slf4j 
public class SQLChecker {
	public static SQLInjectionSafeValidator sqlValidator = new SQLInjectionSafeValidator();

	/**
	 * @설명: String을 파라미터로 받아서 SQL Injection Validator 걸리면 thorows 'Warning' 
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 2. 19.
	 * @최종변경일: 
	 * @매개변수:String sqlStr
	 * @반환값: void: Warning
	 * @개정이력: 
	 *  편신범 2021. 2. 19. 최초작성
	 */
	public static void checkValid(String sqlStr) throws Warning {
		// 시간 측정
		long sTime = System.currentTimeMillis();
		try {
			_checkValid(sqlStr);
		} finally {
			log.info("[checkValid]elapsed time:" + (System.currentTimeMillis() - sTime+"\n"));
		}
	}
	
	/**
	 * @설명: Map을 파라미터로 받아서 SQL Injection Validator에걸리면  thorows 'Warning' 
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 2. 19.
	 * @최종변경일: 
	 * @매개변수: Map reqMap
	 * @개정이력: 
	 *  편신범 2021. 2. 19. 최초작성
	 */
	public static void checkValid(Map reqMap) throws Warning {
		// 시간 측정
		long sTime = System.currentTimeMillis();
		try {
			_checkValid(reqMap);
		} finally {
			log.info("[checkValid]elapsed time:" + (System.currentTimeMillis() - sTime)+"\n");
		}
	}
		
	/**
	 * @설명: String을 파라미터로 받아서 SQL Injection Validator 걸리면 thorows 'Warning' 
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 2. 19.
	 * @최종변경일: 
	 * @매개변수:String sqlStr
	 * @반환값: void: Warning
	 * @개정이력: 
	 *  편신범 2021. 2. 19. 최초작성
	 */
	public static void _checkValid(String sqlStr) throws Warning {
		if(!sqlValidator.isValid(sqlStr, null)) {					// isValid가 true가 아니면 log를 남기고 thow Warning
			log.info("Invalid sqlStr : {}", sqlStr);	
			
			// Wanring은 상세화 하지 않음
			throw new Warning("EACU007", "SQL Checker 적합성 오류");
		}
		log.debug("[SQLInjectionSafeValidator] { {} } is Valid String ! \n",sqlStr);
	}

	/**
	 * @설명: Map을 파라미터로 받아서 SQL Injection Validator에걸리면  thorows 'Warning' 
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 2. 19.
	 * @최종변경일: 
	 * @매개변수: Map reqMap
	 * @개정이력: 
	 *  편신범 2021. 2. 19. 최초작성
	 */
	private static void _checkValid(Map reqMap) throws Warning {
		log.debug("reqMap: "+reqMap.toString());
		
		/* Map의 키, 값을 Iterator로 꺼내서 체크: Using Iterator and toString */
		Iterator keys = reqMap.keySet().iterator();
		while(keys.hasNext()){
			Object checkKey = keys.next();
			Object checkValue= reqMap.get(checkKey);
			
			log.debug("Checked Key: { {} }, Checked Value: { {} }", checkKey, checkValue);
			
			// instanceof String인 경우만 체크
			if(checkValue instanceof String){
				_checkValid((String)checkValue);
			// Map 인 경우
			} else if(checkValue instanceof Map){
				log.debug("Key {{}}'s Value Type is HashMap \n", checkKey);
				_checkValid((Map)checkValue);
			// ArrayList인 경우
			} else if(checkValue instanceof ArrayList){
				log.debug("Key {{}}'s Value Type is ArrayList \n", checkKey);
				ArrayList arry = (ArrayList)checkValue;

				for(Object values : arry){
					if(values instanceof String){
						_checkValid((String)values);
					}
					else if(values instanceof Map){
						log.debug("ArrayList's Value {{}}'s Type is HashMap \n", values);
						_checkValid((Map)values);
					}
					else{
						log.debug("ArrayList's Value {{}}'s Type is {{}} \n", values, values.getClass().getName());
					}
				}
			// 이외의 경우
			} else {
				// String, Map, ArrayList가 아닌 경우 (hashtable, vector 등) toString으로 log 남기기
				log.debug("Key {{}}'s Value Type is not String", checkKey);
				
				// checkValue값이 null 또는  빈값("")
				if(StringUtils.isEmpty(checkValue)){ 
					log.debug("Key {{}}'s Value is null or empty \n", checkKey);
				} else{
					log.debug("The Value {{}}'s Type is {{}} \n",checkValue.toString(),checkValue.getClass().getName());
				}
			}
		}
		log.debug("SQL Check Done!!!!!!!!!!!!!!!!!!");
	}
}
	
