package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.service.MsgService;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @시스템명: ifrs17
 * @업무명: 공통
 * @설명: IFRS17 MS의  Message 테이블을 읽어들여 Runtime에서 Message에 대한 API를 제공한다.
 * @최초작성자: 장창환
 * @최초작성일: 2021. 1. 18.
 * @최종변경일: 
 * @개정이력: 
 *  장창환 2021. 1. 18. 최초작성
 */

@Slf4j 
public class MessageUtil {
	
	// static Logger log = LoggerFactory.getLogger(MessageUtil.class);

	private static MessageUtil mu = null;
	
    private MsgService messageService;	//message 테이블 조회 Service
    
    private Map messageMap = null;		//key, value MAP
    
	private MessageUtil() {
		super();
		this.initialize();
	}

	/**
	 * 
	 * @설명: 최초 메시지 코드 로드 
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: void
	 * @개정이력: 
	 *  89001203 2021. 1. 18. 최초작성
	 */
	private synchronized void initialize() {
		log.info("-------------------------------------------------------------");
		log.info("                                                             ");
		log.info("        MessageUtil                 v1.0                     ");
		log.info("                                                             ");
		log.info("          Copyright ⓒ 2021  DB Inc.                          ");
		log.info("          All Rights Reserved.                               ");
		log.info("                                                             ");
		log.info("-------------------------------------------------------------");
		this.load();
	}
	
	/**
	 * 
	 * @설명: MessageUtil Instance를 반환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: MessageUtil
	 * @개정이력: 
	 *  장창환 2021. 1. 18. 최초작성
	 */
	public static MessageUtil getInstance() {
		if(mu == null) {
			mu = new MessageUtil();
		}
		return mu;
    }
	
	/**
	 * 
	 * @설명: key에 해당하는 Message를 조회한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: String
	 * @개정이력: 
	 *  장창환	2021. 1. 18. 최초작성
	 */
	public String getMessage(String messageKey) {
		String result = "";
		if(this.messageMap.containsKey(messageKey)) {
			result = (String)this.messageMap.get(messageKey);
		}
		return result;
	}

	/**
	 * 
	 * @설명: key에 해당하는 Message를 조회하고 param1을 바인딩한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: String
	 * @개정이력: 
	 *  장창환	2021. 1. 18. 최초작성
	 */
	public String getMessage(String messageKey, String param1) {
		String message = null;
		try {
			message = this.applyParam(this.getMessage(messageKey), new Object[] { param1 });
		} catch (Exception e) {
			log.error("Exception Occurs!!", e);
			message = "";
		}
		return message;
	}

	/**
	 * 
	 * @설명: key에 해당하는 Message를 조회하고 param1, param2를 바인딩한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: String
	 * @개정이력: 
	 *  장창환	2021. 1. 18. 최초작성
	 */
	public String getMessage(String messageKey, String param1, String param2) {
		String message = null;
		try {
			message = this.applyParam(this.getMessage(messageKey), new Object[] { param1, param2 });
		} catch (Exception e) {
			log.error("Exception Occurs!!", e);
			message = "";
		}
		return message;
	}

	/**
	 * 
	 * @설명: key에 해당하는 Message를 조회하고 param1, param2, param3를 바인딩한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: String
	 * @개정이력: 
	 *  장창환	2021. 1. 18. 최초작성
	 */
	public String getMessage(String messageKey, String param1, String param2, String param3) {
		String message = null;
		try {
			message = this.applyParam(this.getMessage(messageKey), new Object[] { param1, param2, param3 });
		} catch (Exception e) {
			log.error("Exception Occurs!!", e);
			message = "";
		}
		return message;
	}	
	
	/**
	 * 
	 * @설명: key에 해당하는 Message를 조회하고 Object 배열로 넘어온 파라미터 값을 바인딩하여 리턴한다.
	 *       message는 {0}항목은 필수 입력사항입니다.[입력값:{1}]
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: String messageKey : 메시지 코드
	 * 		    Object [] objs : 파라미터 배열
	 * @반환값: String
	 * @개정이력: 
	 *  장창환	2021. 1. 18. 최초작성
	 */
	public String getMessage(String messageKey, Object[] objs) {
		String message = null;
		try {
			message = this.applyParam(this.getMessage(messageKey), objs);
		} catch (Exception e) {
			log.error("Exception Occurs!!", e);
			message = "";
		}
		return message;
	}
	
	/**
	 * 
	 * @설명: message에 param 배열을 바인딩 한다. 
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 20.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: String
	 * @개정이력: 
	 *  장창환 2021. 1. 20. 최초작성
	 */
	private String applyParam(String msg, Object [] params) {
		String result = "";
		if( msg != null ) {
			result = msg;
			if(params != null && params.length > 0) {
		        for (int i = 0; i < params.length; i++) {
		        	result = result.replace("{"+i+"}", params[i].toString());
				}
			}
		}
		return result;
	}
	
	/**
	 * 
	 * @설명: 전체 MessageMap을 리턴한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: Map
	 * @개정이력: 
	 *  장창환 2021. 1. 18. 최초작성
	 */
	public Map getMessageAll() {
		return new HashMap(this.messageMap);
	}
	
	/**
	 * 
	 * @설명: MessageService로 부터 로드한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: void
	 * @개정이력: 
	 *  장창환	2021. 1. 18. 최초작성
	 */
	public synchronized void load() {
		try {
			this.messageMap = new HashMap();
			messageService = (MsgService)BeanUtil.getBean("msgService");
			List<FwkMap> list = messageService.selectUseMsgList(new HashMap());
			for(int i=0; i<list.size(); i++) {
				Map tmpMap = list.get(i);
				String msgId = (String)tmpMap.get("untyMsgNo");
				String msgVal = (String)tmpMap.get("untyMsgCntnt");
				log.debug("[load]" + msgId + "," + msgVal);
				messageMap.put(msgId, msgVal.replaceAll("\\\\n", "\n"));	
			}
			log.debug("message loaded!");
		} catch(Exception e) {
			log.error("Exception Occurs!", e);
		}
	}
	
	/**
	 * 
	 * @설명: 메시지 코드를 테이블로부터 리로드 한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: void
	 * @개정이력: 
	 *  장창환 2021. 1. 18. 최초작성
	 */
	public synchronized void reload() {
		this.messageMap = null;
		this.load();
	}
}
