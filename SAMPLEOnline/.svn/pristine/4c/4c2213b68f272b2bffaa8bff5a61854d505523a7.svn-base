package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONObject;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j 
public class JSONUtil {

	/**
	 * @param jsonStr
	 * @return
	 */
	public static String decodeJSONString(String jsonStr) {
		if(jsonStr == null) return "";
		return jsonStr.replaceAll("&quot;","\"").replace("&amp;", "&").replace("&apos;", "\\").replace("&lt;", "<").replace("&gt;", ">");
	}
	
	/**
	 * Map to JSONObject
	 * @param map
	 * @return
	 */
	public static JSONObject mapToJSON(Map map) {
		JSONObject result = null;
		result = new JSONObject();
		result.putAll(map);
		return result;
	}

	/**
	 * Map to JSONObject
	 * @param map
	 * @return
	 */
	public static String mapToJSONString(Map map) {
		JSONObject result = null;
		result = new JSONObject();
		result.putAll(map);
		return result.toJSONString();
	}

	/**
	 * JSON Object 문자열을 Map 객체로 변환한다.
	 * @설명: 
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 7.
	 * @최종변경일: 
	 * @매개변수: String jsonArrayStr
	 * @반환값: List
	 * @개정이력: 
	 *  89001203 2021. 1. 7. 최초작성
	 */
	public static Map<String, Object> jsonObjectStringToMap(String jsonObjStr) {
		Map<String, Object> result = null;
		jsonObjStr = decodeJSONString(jsonObjStr);
		ObjectMapper mapper = new ObjectMapper();
		try {
			result = mapper.readValue(jsonObjStr, new TypeReference<Map<String, Object>>(){});
		} catch(JsonParseException je) {
			log.error("JsonParseException", je);
		} catch(IOException ie) {
			log.error("IOException", ie);
		}
		return result;
	}

	/**
	 * JSON Array 문자열을 List<Map> 객체로 변환한다.
	 * @설명: 
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 7.
	 * @최종변경일: 
	 * @매개변수: String jsonArrayStr
	 * @반환값: List
	 * @개정이력: 
	 *  89001203 2021. 1. 7. 최초작성
	 */
	public static List jsonArrayStringToList(String jsonArrayStr) {
		List<Map<String, Object>> result = null;
		jsonArrayStr = decodeJSONString(jsonArrayStr);
		ObjectMapper mapper = new ObjectMapper();
		try {
			result = mapper.readValue(jsonArrayStr, new TypeReference<List<Map<String, Object>>>(){});
		} catch(JsonParseException je) {
			log.error("JsonParseException", je);
		} catch(IOException ie) {
			log.error("IOException", ie);
		}
		return result;
	}
}
