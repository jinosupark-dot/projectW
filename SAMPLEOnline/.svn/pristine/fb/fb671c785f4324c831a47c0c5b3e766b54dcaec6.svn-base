package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.co.wllife.acs.online.mg.sy.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @시스템명: ifrs17
 * @업무명: Session 객체를 핸들링하는 Util
 * @설명:
 * @최초작성자: 장창환
 * @최초작성일: 2021. 1. 8.
 * @최종변경일: 2021. 1. 8.
 * @개정이력:
 *        장창환 2021. 1. 8. 최초작성
 */
@Slf4j
public class SessionUtil {

	public static final String KEY_CLIENT_IP = "client_ip";
	public static final String KEY_CLIENT_HOST = "client_host";
	public static final String KEY_USER_INFO = "user_info";

	/**
	 * 
	 * @설명: 현재 세션의 String Attribute 조회
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        89001203 2021. 1. 8. 최초작성
	 */
	public static String getAttribute(String key) {
		return (String) RequestContextHolder.getRequestAttributes().getAttribute(key, RequestAttributes.SCOPE_SESSION);
	}

	/**
	 * 
	 * @설명: 현재 세션의 Object Attribute 조회
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        89001203 2021. 1. 8. 최초작성
	 */
	public static Object getObject(String key) {
		return (Object) RequestContextHolder.getRequestAttributes().getAttribute(key, RequestAttributes.SCOPE_SESSION);
	}

	/**
	 * 
	 * @설명: 현재 세션의 Attribute 셋팅
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        89001203 2021. 1. 8. 최초작성
	 */
	public static void setAttribute(String key, Object value) {
		// HttpServletRequest req =
		// ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
		HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		HttpSession session = req.getSession();
		session.setAttribute(key, value);
	}

	/**
	 * 
	 * @설명: 현재 세션의 Attribute 삭제
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        89001203 2021. 1. 8. 최초작성
	 */
	public static void removeAttribute(String key) {
		RequestContextHolder.getRequestAttributes().removeAttribute(key, RequestAttributes.SCOPE_SESSION);
		;
	}

	/**
	 * 
	 * @설명: 로그인 사용자 정보 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: UserInfoVO
	 * @개정이력:
	 *        장창환 2021. 1. 8. 최초작성
	 */
	public static UserInfoVO getUserInfo() {
		UserInfoVO vo = null;
		vo = (UserInfoVO) getObject(KEY_USER_INFO);
		return vo;
	}

	/**
	 * 
	 * @설명: Client IP 조회
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        89001203 2021. 1. 8. 최초작성
	 */
	// public static String getClientIp_old() {
	// 	String clientIp = "";
	// 	try {
	// 		clientIp = (String) RequestContextHolder.getRequestAttributes().getAttribute(KEY_CLIENT_IP,
	// 				RequestAttributes.SCOPE_SESSION);
	// 	} catch (Exception e) {
	// 		log.error("Exception occurs!!", e);
	// 	}
	// 	return clientIp;
	// }

	/**
	 * 
	 * @설명: Client IP 조회
	 * @최초작성자: J.H.Kim
	 * @최초작성일: 2026.10.26.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        J.H.Kim 2026.10.26. 최초작성
	 */
	public static String getClientIp() {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
				.getRequest();

		String ip = request.getHeader("X-Forwarded-For");

		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("X-Real-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("X-RealIP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("REMOTE_ADDR");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}

		// 기본적으로 IP 주소가 IPv6로 반환되는 경우가 있어, 로컬호스트를 IPv4로 변환
		if (ip != null) {
			if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) { 
				ip = "127.0.0.1";
			}
		}

		// 여러 프록시를 거친 경우 콤마(,)로 구분되므로 첫 번째 IP를 실제 클라이언트 IP로 간주
		if (ip != null && ip.contains(",")) {
			ip = ip.split(",")[0].trim();
		}

		return ip;
	}

	/**
	 * 
	 * @설명: Client IP 셋팅
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        89001203 2021. 1. 8. 최초작성
	 */
	public static void setClientIp(String clientIp) {
		setAttribute(KEY_CLIENT_IP, clientIp);
	}

	/**
	 * 
	 * @설명: Client Host 조회
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        89001203 2021. 1. 8. 최초작성
	 */
	// public static String getClientHost_old() {
	// 	String clientHost = "";
	// 	try {
	// 		clientHost = (String) RequestContextHolder.getRequestAttributes().getAttribute(KEY_CLIENT_HOST,
	// 				RequestAttributes.SCOPE_SESSION);
	// 	} catch (Exception e) {
	// 		log.error("Exception occurs!!", e);
	// 	}
	// 	return clientHost;
	// }

	/**
	 * 
	 * @설명: Client Host 조회
	 * @최초작성자: J.H.Kim
	 * @최초작성일: 2026.10.26.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        J.H.Kim 2026.10.26. 최초작성
	 */
	public static String getClientHost() {
		try {
			InetAddress localHost = InetAddress.getLocalHost();
			return localHost.getHostAddress(); // 예: 192.168.1.50 또는 10.0.0.5
		} catch (UnknownHostException e) {
			return "127.0.0.1"; // 예외 발생 시 루프백 주소 반환
		}
	}

	/**
	 * 
	 * @설명: Client Host 셋팅
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 8.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        89001203 2021. 1. 8. 최초작성
	 */
	public static void setClientHost(String clientHost) {
		setAttribute(KEY_CLIENT_HOST, clientHost);
	}

	/**
	 * 입력받은 사용자 패스워드가 유효한지 체크한다.
	 * 
	 * @설명:
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 2.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: boolean
	 * @개정이력:
	 *        장창환 2021. 3. 2. 최초작성
	 */
	public static boolean checkPassword(String argPwd) {
		boolean ret = false;
		UserInfoVO vo = getUserInfo();
		if (vo != null && argPwd != null) {
			String argPwdEnc = StringUtil.sha256Encode(argPwd);
			if (argPwdEnc.equals(vo.getPswdEncr())) {
				ret = true;
			}
		}
		return ret;
	}
}
