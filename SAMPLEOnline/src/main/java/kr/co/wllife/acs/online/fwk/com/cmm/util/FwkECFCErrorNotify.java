package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.util.HashMap;

import lombok.extern.slf4j.Slf4j;

 
/**
 *
 * FwkECFCErrorNotify.java 설명
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

 @Slf4j 
public class FwkECFCErrorNotify {  
		/**
		 * 
		 * sendMessage 설명
		 *
		 * @return void
		 * @param error
		 * @param declaringTypeName
		 * @param hmTranInfo
		 */
		public static void sendMessage(Throwable error, String declaringTypeName, HashMap hmTranInfo) {
			// TODO Auto-generated method stub
	
			log.info("1=================================================================== Error = " + declaringTypeName + "=======");
			//logger.info(error.toString());
			log.info("1=================================================================== Error = " + declaringTypeName + "=======");
			
		}
}
