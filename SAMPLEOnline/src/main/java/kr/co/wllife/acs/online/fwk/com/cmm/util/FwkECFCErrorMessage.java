package kr.co.wllife.acs.online.fwk.com.cmm.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

 
/**
 *
 * 시스템 에러메시지 결과 값을 처리하는 클래스
 *
 * @author 	OKLEE
 * @since 	2018. 6. 8. 
 * @version 1.0
 * @see
 *
 *<pre>
 * << 개정이력(Modification Information) >>
 *
 *	     수정일		  수정자          			 수정내용
 *  -----------  -----   ---------------------------
 *  2018. 6. 8.  OKLEE       최초 생성
 *
 *</pre>
 */
public class FwkECFCErrorMessage {  

	@SuppressWarnings("unused")
	private static Logger logger = LoggerFactory.getLogger(FwkECFCErrorMessage.class);

	/**
	 * Throwable를 통해 에러메시지 코드를 구분하여 처리함.
	 *
	 * @param cause
	 * @return
	 */
	public static int setErrorCode(Throwable cause) {
		// TODO Auto-generated method stub		
		int intErrorCode = -1;
		
		String strErrorMsg = cause.getMessage();
		
		if (null != strErrorMsg){
			//RULE ERROR
			if (strErrorMsg.contains("[IRE-")){
				intErrorCode = -3;
			}
		}
		
		
		
		return intErrorCode;
	}
}
