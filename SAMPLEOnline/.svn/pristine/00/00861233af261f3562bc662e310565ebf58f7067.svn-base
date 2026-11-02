package kr.co.wllife.acs.online.fwk.com.cmm;

import java.util.Locale;

import org.springframework.context.NoSuchMessageException;
import org.springframework.context.support.MessageSourceAccessor;

import kr.co.wllife.acs.online.fwk.com.cmm.util.BeanUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j 
public class FwkMessageUtil {
	
	private static MessageSourceAccessor messageSourceAccessor = null;

	private static synchronized void initialize() {
		messageSourceAccessor = (MessageSourceAccessor)BeanUtil.getBean("messageSourceAccessor");
	}
	
	public static String getMessage(String messageCode) {
		return getMessage(messageCode, new Object[0]);
	}

	public static String getMessage(String messageCode, String param) {
		return getMessage(messageCode, new Object[] { param });
	}

	public static String getMessage(String messageCode, int param) {
		return getMessage(messageCode, new Object[] { Integer.valueOf(param) });
	}

	public static String getMessage(String messageCode, String param1, String param2) {
		return getMessage(messageCode, new Object[] { param1, param2 });
	}

	public static String getMessage(String messageCode, String param1, String param2, String param3) {
		return getMessage(messageCode, new Object[] { param1, param2, param3 });
	}

	private static String getMessage(String messageCode, Object[] objs) {
		String message = null;
		try {
			if(messageSourceAccessor == null) {
				initialize();
			}
			if ((messageCode == null) || ("".equals(messageCode.trim()))) {
				throw new Exception();
			}
			message = messageSourceAccessor.getMessage(messageCode, objs, Locale.getDefault());
		} catch (NoSuchMessageException e) {
			message = messageSourceAccessor.getMessage("err.0000", new Object[0], Locale.getDefault());
		} catch (Exception e) {
			log.error("Exception Occurs!!", e);
			message = "";
		}
		return message;
	}
}