package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;


/**
 * @시스템명: IFRS17
 * @업무명: Util
 * @설명: Shell Script 실행  Util
 * @최초작성자: 편신범
 * @최초작성일: 2020. 11. 14.
 * @최종변경일: 
 * @개정이력: 
 *  편신범 2020. 11. 14. 최초작성
 */
@Slf4j 
public class RunnerUtil {
	boolean useOutLog = true;
	boolean debugMode = false;
	
    public boolean isUseOutLog() {
		return useOutLog;
	}

	public void setUseOutLog(boolean useOutLog) {
		this.useOutLog = useOutLog;
	}
	
	public boolean isDebugMode() {
		return debugMode;
	}

	public void setDebugMode(boolean debugMode) {
		this.debugMode = debugMode;
	}

	public Map execCommand(String... str) {
    	
		log.info("execCommand:");
		for(int i=0; i<str.length; i++) {
			log.info(str[i]);
		}

		
        Map<Integer, String> map = new HashMap<>();
        ProcessBuilder pb = new ProcessBuilder(str);
        pb.redirectErrorStream(true);
        Process process = null;
        try {
            process = pb.start();
        } catch (IOException e) {
			log.error("IOException occurs!!", e);
        }

        BufferedReader reader = null;
        if (process != null) {
            reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        }
        
        String line;
        StringBuilder stringBuilder = new StringBuilder();
        try {
            if (reader != null) {
                while ((line = reader.readLine()) != null) {
                    if(useOutLog) {
                    	stringBuilder.append(line).append("\n");
                    }
                    if(debugMode) {
                    	log.info(line);
                    }
                }
            }
        } catch (IOException e) {
			log.error("IOException occurs!!", e);
        }

        try {
            if (process != null) {
                process.waitFor();
            }
        } catch (InterruptedException e) {
			log.error("InterruptedException occurs!!", e);
        }

        if (process != null) {
            map.put(0, String.valueOf(process.exitValue()));
        }

        try {
            map.put(1, stringBuilder.toString());
        } catch (StringIndexOutOfBoundsException e) {
            if (stringBuilder.toString().length() == 0) {
                return map;
            }
        }
        return map;
    }
}
