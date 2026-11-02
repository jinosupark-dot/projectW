package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.springframework.core.io.ClassPathResource;

import kr.co.wllife.acs.online.fwk.com.cmm.FwkWebUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @시스템명: ifrs17
 * @업무명: 공통
 * @설명: 시스템 설정정보를 관리한다.
 * @최초작성자: 장창환
 * @최초작성일: 2021. 1. 8.
 * @최종변경일: 2021. 1. 8.
 * @개정이력:
 *        장창환 2021. 1. 8. 최초작성
 */
@Slf4j
public class FwkProperties {

	final static String FILE_SEPARATOR = System.getProperty("file.separator");

	private static Properties globalProps = null;

	/**
	 * properties 파일을 로드하여 Properties객체를 생성한다.
	 */
	public static synchronized void initialize() {
		try {
			// 1. src/main/resources/application.properties를 직접 읽어 활성 프로파일 파악
			Properties appProps = new Properties();
			try (InputStream appStream = new ClassPathResource("config/application.properties").getInputStream()) {
				appProps.load(appStream);
			}

			// spring.profiles.active 값 읽기 (기본값 loc)
			String activeProfile = appProps.getProperty("spring.profiles.active", "loc").trim();

			globalProps = new Properties();
			// 2. 폴더 경로 조합 (예: loc/globals.properties, dev/globals.properties)
			String targetPath = "config/" + activeProfile + "/globals.properties";

			// 3. 해당 환경 폴더의 globals.properties 로드
			try (InputStream globalStream = new ClassPathResource(targetPath).getInputStream()) {
				globalProps.load(globalStream);
				log.info(">>> [Globals] 환경별 설정 파일 로드 성공: classpath:" + targetPath);
			}

		} catch (IOException e) {
			System.err.println(">>> [Globals] 설정 파일 로드 중 오류 발생: " + e.getMessage());
			e.printStackTrace();
		}
	}

	/*
	 * public static synchronized void initialize_bak() {
	 * FileInputStream fis = null;
	 * try {
	 * 
	 * LOGGER.
	 * warn("====================== initialize EgovProperties ========================="
	 * );
	 * String RELATIVE_PATH_PREFIX = "";
	 * if (null != EgovProperties.class.getResource("")) {
	 * RELATIVE_PATH_PREFIX = EgovProperties.class.getResource("").getPath();
	 * int num = EgovProperties.class.getResource("").getPath().lastIndexOf("com");
	 * 
	 * if (null != RELATIVE_PATH_PREFIX) {
	 * if (null != EgovProperties.class.getResource("").getPath()) {
	 * RELATIVE_PATH_PREFIX = RELATIVE_PATH_PREFIX.substring(0, num);
	 * }
	 * }
	 * }
	 * String GLOBALS_PROPERTIES_FILE = RELATIVE_PATH_PREFIX + "egovProps" +
	 * FILE_SEPARATOR + "globals.properties";
	 * props = new Properties();
	 * fis = new FileInputStream(EgovWebUtil.getValidPath(GLOBALS_PROPERTIES_FILE));
	 * props.load(new BufferedInputStream(fis));
	 * 
	 * LOGGER.warn("properties file :" + GLOBALS_PROPERTIES_FILE);
	 * LOGGER.warn(
	 * "=============================================================================="
	 * );
	 * } catch (FileNotFoundException fne) {
	 * LOGGER.error("[initialize]Property file not found.", fne);
	 * throw new RuntimeException("Property file not found", fne);
	 * } catch (IOException ioe) {
	 * LOGGER.error("[initialize]Property file IO exception", ioe);
	 * throw new RuntimeException("Property file IO exception", ioe);
	 * } catch (Exception e) {
	 * LOGGER.error("[initialize]Exception occurs!", e);
	 * throw new RuntimeException("[initialize]Exception occurs!", e);
	 * } finally {
	 * EgovResourceCloseHelper.close(fis);
	 * }
	 * }
	 */
	/**
	 * 인자로 주어진 문자열을 Key값으로 하는 프로퍼티 값을 반환한다(Globals.java 전용)
	 * 
	 * @param keyName String
	 * @return String
	 */
	public static String getProperty(String keyName) {

		String value = "";
		try {
			if (globalProps == null) {
				initialize();
			}
			if (globalProps.getProperty(keyName) == null) {
				return "";
			}
			value = globalProps.getProperty(keyName).trim();
		} catch (Exception e) {
			log.error("[getProperty]Exception occurs!", e);
		}

		return value;
	}

	/**
	 * property 파일을 메모리에 리로드 한다.
	 */
	public static synchronized void reload() {
		initialize();
	}

	/**
	 * 주어진 파일에서 인자로 주어진 문자열을 Key값으로 하는 프로퍼티 값을 반환한다
	 * 
	 * @param fileName String
	 * @param key      String
	 * @return String
	 */
	public static String getProperty(String fileName, String key) {
		FileInputStream fis = null;
		try {
			Properties props = new Properties();

			fis = new FileInputStream(FwkWebUtil.filePathBlackList(fileName));
			props.load(new BufferedInputStream(fis));
			fis.close();

			String value = props.getProperty(key);

			return value;
		} catch (FileNotFoundException fne) {
			log.debug("Property file not found.", fne);
			throw new RuntimeException("Property file not found", fne);
		} catch (IOException ioe) {
			log.debug("Property file IO exception", ioe);
			throw new RuntimeException("Property file IO exception", ioe);
		} finally {
			FwkResourceCloseHelper.close(fis);
		}
	}

	/**
	 * 주어진 프로파일의 내용을 파싱하여 (key-value) 형태의 구조체 배열을 반환한다.
	 * 
	 * @param property String
	 * @return ArrayList
	 */
	public static ArrayList<Map<String, String>> loadPropertyFile(String property) {

		// key - value 형태로 된 배열 결과
		ArrayList<Map<String, String>> keyList = new ArrayList<Map<String, String>>();

		String src = property.replace('\\', File.separatorChar).replace('/', File.separatorChar);
		FileInputStream fis = null;
		try {

			File srcFile = new File(FwkWebUtil.filePathBlackList(src));
			if (srcFile.exists()) {

				Properties props = new Properties();
				fis = new FileInputStream(src);
				props.load(new BufferedInputStream(fis));
				fis.close();

				Enumeration<?> plist = props.propertyNames();
				if (plist != null) {
					while (plist.hasMoreElements()) {
						Map<String, String> map = new HashMap<String, String>();
						String key = (String) plist.nextElement();
						map.put(key, props.getProperty(key));
						keyList.add(map);
					}
				}
			}
		} catch (IOException ex) {
			log.debug("IO Exception", ex);
			throw new RuntimeException(ex);
		} finally {
			FwkResourceCloseHelper.close(fis);
		}
		return keyList;
	}

	/**
	 * 
	 * @설명: 현재 설정 정보를 반환한다.
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: Properties
	 * @개정이력:
	 *        89001203 2021. 1. 8. 최초작성
	 */
	public static Properties getProperties() {
		try {
			if (globalProps == null) {
				initialize();
			}
		} catch (Exception e) {
			log.error("[getProperty]Exception occurs!", e);
		}
		return globalProps;
	}
}
