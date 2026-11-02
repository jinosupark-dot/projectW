package kr.co.wllife.acs.online.fwk.com.cmm.exception;

import kr.co.wllife.acs.online.fwk.com.cmm.util.MessageUtil;
import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;

public class Warning extends Exception {
	
	public final static int MSG = 0;
	public final static int WARNING = 1;
	public final static int ERROR = 2;
	public final static int NONE = 3;
	public static String KEY_RESULT = "result";
	public static String KEY_LEVEL = "errorLevel";
	public static String KEY_CODE = "errorCode";
	public static String KEY_MESSAGE = "errorMessage";
	
	protected int result = -1;
	protected int warnLevel = 1;
	protected String warnMessage = "";
	protected String warnCode = "";
	
	/**
     * Construct a new Warning with no detailed message.
	 */
	protected Warning() {
		super();
	}
	
	public Warning(String warnCode) {
		super(MessageUtil.getInstance().getMessage(warnCode));
		this.warnLevel = WARNING;
		this.warnCode = warnCode;
		this.warnMessage = super.getMessage();
	}

	public Warning(String warnCode, String param) {
		super(MessageUtil.getInstance().getMessage(warnCode, param));
		this.warnLevel = WARNING;
		this.warnCode = warnCode;
		this.warnMessage = super.getMessage();
	}

	public Warning(String warnCode, String param1, String param2) {
		super(MessageUtil.getInstance().getMessage(warnCode, param1, param2));
		this.warnLevel = WARNING;
		this.warnCode = warnCode;
		this.warnMessage = super.getMessage();
	}

	public Warning(String warnCode, Object [] args) {
		super(MessageUtil.getInstance().getMessage(warnCode, args));
		this.warnLevel = WARNING;
		this.warnCode = warnCode;
		this.warnMessage = super.getMessage();
	}

	/**
	 * 2020. 06. 10
	 * warning 사용자가 입력한 메시지를 처리하기위해 수정 
	 * @param warnLevel
	 * @param warnCode
	 * @param warnMessage
	 */
	public Warning(int warnLevel, String warnCode, String warnMessage) {
		super(warnMessage);
		this.warnLevel = warnLevel;
		this.warnCode = warnCode;
		this.warnMessage = warnMessage;
	}

	public FwkMap toMap() {
		FwkMap map = new FwkMap();
		map.put(KEY_RESULT, this.result);
		map.put(KEY_LEVEL, this.warnLevel);
		map.put(KEY_CODE, this.warnCode);
		map.put(KEY_MESSAGE, this.warnMessage);
		return map;
	}
	
	public String toString() {
		StringBuilder sb = new StringBuilder("");
		sb.append("{ " );
		sb.append(" result:" + this.result );
		sb.append(",errorLevel:" + this.warnLevel );
		sb.append(",errorCode:" + this.warnCode );
		sb.append(",errorMessage:" + this.warnMessage );
		sb.append("} " );
		return sb.toString();
	}

	public int getWarnLevel() {
		return warnLevel;
	}

	public String getWarnMessage() {
		return warnMessage;
	}

	public String getWarnCode() {
		return warnCode;
	}

}
