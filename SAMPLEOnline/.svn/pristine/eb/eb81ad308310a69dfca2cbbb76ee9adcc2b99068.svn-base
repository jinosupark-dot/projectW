package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.util.Properties;

import lombok.extern.slf4j.Slf4j;

@Slf4j 
public class EaiConfiguration {
	
	private Properties prop;

	private static EaiConfiguration eaiConf = null;

	public EaiConfiguration() {
		super();
		this.load();
	}

	/**
	 * 
	 * @설명: EaiConfiguration Instance를 반환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: EaiConfiguration
	 * @개정이력: 장창환 2021. 1. 18. 최초작성
	 */
	public static EaiConfiguration getInstance() {
		if (eaiConf == null) {
			eaiConf = new EaiConfiguration();
		}
		return eaiConf;
	}

	public void load() {
		FileInputStream fin = null;
		try {
			prop = new java.util.Properties();
			String prop_path = EaiConfiguration.class.getProtectionDomain().getCodeSource().getLocation().getPath()
					+ "tibco.properties";
			log.info("[EaiConfiguraio]properties path:" + prop_path);
			fin = new FileInputStream(prop_path);
			prop.load(new BufferedInputStream(fin));
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (fin != null) fin.close();
			} catch (Exception e) {
				System.err.println(e.getMessage());
			}
		}
	}

	/**
	 * properties 정보받기
	 * 
	 * @param sname
	 *            KEY
	 * @return KEY에 해당하는 값
	 */
	public String get(String sname) {
		return prop.getProperty(sname);
	}
}
