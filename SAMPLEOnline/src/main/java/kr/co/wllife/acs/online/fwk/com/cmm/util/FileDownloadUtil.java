package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j 
public class FileDownloadUtil {

	// 버퍼 사이즈
	private static final int BUFFER_SIZE = 4096;
	
	/**
	 * 
	 * @설명: 파일을 브라우저로 다운로드 한다.
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 11.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: void
	 * @개정이력: 
	 *  89001203 2021. 1. 11. 최초작성
	 */
	public static void downloadFile(Map<String, String> reqMap, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String filePath = (String)reqMap.get("filePath");
		String contentType = (String)reqMap.get("contentType");
		String fileName = (String)reqMap.get("fileName");	//다운로드 파일명
		if(filePath == null) {
			throw new Exception("fileId null!");
			
		}
		
		File f = new File(filePath);
		if(!f.exists()) {
			throw new Exception("[" + filePath + "]파일이 존재하지 않습니다.");
		}
		if(f.isDirectory()) {
			throw new Exception("[" + filePath + "]디렉토리는 다운로드를 지원하지 않습니다..");
		}

		if(contentType == null) {
			contentType = "application/download; utf=8"; 
		}
		if(fileName == null) {
			fileName = f.getName();
		}
		
		response.setContentType(contentType);
		response.setContentLength((int)f.length());

		byte[] buffer = new byte[BUFFER_SIZE];

		fileName = URLEncoder.encode(fileName, "UTF-8").replace("+", "%20");

		response.setHeader("Content-disposition", "attachment; filename=\"" + fileName + "\";");
		
		response.setHeader("Content-Transger-Encoding", "binary");
		BufferedInputStream bin = null;
		BufferedOutputStream bout = null;

		try {
			bin = new BufferedInputStream(new FileInputStream(f));
			bout = new BufferedOutputStream(response.getOutputStream());
	
			int read = 0;

			while ((read = bin.read(buffer)) != -1) {
				bout.write(buffer, 0, read);
			}

		} catch (FileNotFoundException e) {
			log.error("Exception Occurs! ", e);
		} catch (IOException e) {
			log.error("Exception Occurs! ", e);
		} finally {
			try {
				if (bout != null)
					bout.close();
			} catch (IOException e) {
				log.error("BufferedOutputStream close error %s\n ", e);
			}
			try {
				if (bin != null)
					bin.close();
			} catch (IOException e) {
				log.error("BufferedInputStream close error %s\n ", e);
			}
		}

	}
}
