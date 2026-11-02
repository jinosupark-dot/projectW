package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component("JacksonUtil")
public class JacksonUtil {

	private ObjectMapper mapper = null;
	
	public JacksonUtil(){
		this.mapper = new ObjectMapper();
	}
	
	public Map<String,Object> parse(String jsonData) throws JsonMappingException,JsonParseException,IOException{		
		Map<String,Object> result = mapper.readValue(retrieveXSS(jsonData), new TypeReference<Map<String,Object>>() { });
		return result;
	}
	
	public Map<String,String> parseStringMap(String jsonData) throws JsonMappingException,JsonParseException,IOException{		
		Map<String,String> result = mapper.readValue(retrieveXSS(jsonData), new TypeReference<Map<String,String>>() { });
		return result;
	}
	
	public <T> T parse(String jsonData, Class<T> clazz) throws JsonMappingException,JsonParseException,IOException{
		return mapper.readValue(retrieveXSS(jsonData), clazz);
	}
	
	private String retrieveXSS(String value) {		
		return value.replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&amp;","&").replaceAll("&apos;","'").replaceAll("&quot;","\"");
	}

}