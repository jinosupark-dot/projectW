package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

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
public class MapUtil {

	/**
	 * List<Map>에서 key값에 해당하는 데이터를 concatStr 구분자로 나열하여 리턴한다.
	 * getMapToStringJoin 설명
	 *
	 * @param list
	 * @param key
	 * @param concatStr
	 * @return
	 */
	public static String getMapToStringJoin(List<Map<String, Object>> list, String key, String concatStr){
		String res = "";
		
		for (int i=0; i<list.size(); i++) {
			Map<String, Object> map = list.get(i);
			if(map.get(key) != null) {
				res += map.get(key).toString();
				if (i != list.size()-1) {
					res += concatStr;
				}
			}
			
		}
		return res;
	}
}
