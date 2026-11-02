package kr.co.wllife.acs.online.mg.sy.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import kr.co.wllife.acs.online.fwk.com.cmm.exception.Warning;
import kr.co.wllife.acs.online.fwk.com.cmm.util.CommonUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.DateUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.FwkProperties;
import kr.co.wllife.acs.online.fwk.com.cmm.util.SessionUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.StringUtil;
import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.mapper.LoginHistoryMapper;
import kr.co.wllife.acs.online.mg.sy.mapper.UserMapper;
import kr.co.wllife.acs.online.mg.sy.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;

/**
 * @시스템명: IFRS17
 * @업무명: 공통
 * @설명: 로그인처리를 위한 서비스
 * @최초작성자: 장창환
 * @최초작성일: 2021. 1. 15.
 * @최종변경일: 
 * @개정이력: 
 *  장창환 2021. 1. 15. 최초작성
 *  류승민 2021. 6. 01. 로그인 세션 체크
 */
@Slf4j 
@Service
public class LoginService  {

	private static final String DEV_CONT_SC_CD = "DII";	    //IFRS(내부망-개발)
	private static final String TEST_CONT_SC_CD = "SII";	//IFRS(내부망-검증)
	private static final String PROD_CONT_SC_CD = "PII";	//IFRS(내부망-운영)

	// Y:중복불가 or N:중복가능
	private String loginDblCk = FwkProperties.getProperty("login.double.check");
	
	private final UserMapper userMapper;
	
	private final LoginHistoryMapper loginHistoryMapper;

	public LoginService(UserMapper userMapper, LoginHistoryMapper loginHistoryMapper) {
		this.userMapper = userMapper;
		this.loginHistoryMapper = loginHistoryMapper;
	}


	/**
	 * @설명: 로그인 세션 체크
	 * @최초작성자: 류승민
	 * @최초작성일: 2021. 6. 01.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  류승민 2021. 6. 01. 최초작성
	 */
	
	public FwkMap sessChk(Map param) throws Exception {

		FwkMap result = new FwkMap();
		String userId = (String)param.get("userId");
		String userPwd = (String)param.get("userPwd");
		String sha256Pwd = StringUtil.sha256Encode(userPwd);
		
		/**
		 * 로그인 체크 : 비밀번호 오류 건수 확인
		 */
		int pwErrCnt = userMapper.selectUserPswdErrCnt(param);
		if(pwErrCnt >= 5){
			result.put("result", 0);
			result.put("errorcd", "ECIU023");
			return result;
		}
		
		UserInfoVO vo = userMapper.selectUserInfoByLogin(param);
		//logger.debug("userInfoVo:" + vo);
		
		Map inserErrtMap = new HashMap<>();
		/**
		 * 로그인 체크 : 사용자정보 유무 확인
		 */
		if(vo == null || vo.getUserId().length() == 0) {
			inserErrtMap.put("mstkInfoId", "ECIS099");
			inserErrtMap.put("userId", "");
			inserErrtMap.put("mstkCntnt", userId);
			userMapper.insertLoginErrInfo(inserErrtMap);
			
			result.put("result", 0);
			result.put("errorcd", "ECIS099");
			return result;
			//throw new Warning("ECIS099");	//사용자 정보가 일치하지 않습니다.			
		}

		/**
		 * 로그인 체크 : 비밀번호 확인
		 */
		String pwdEncr = vo.getPswdEncr();
		// System.out.println("seoyoung "+pwdEncr+", sha256Pwd: "+sha256Pwd);
		if(! pwdEncr.equals(sha256Pwd)) {
			inserErrtMap.put("mstkInfoId", "ECIU022");
			inserErrtMap.put("userId", userId);
			inserErrtMap.put("mstkCntnt", userPwd);
			userMapper.insertLoginErrInfo(inserErrtMap);
			userMapper.insertPswdErrCnt(inserErrtMap);
			
			result.put("result", 0);
			result.put("pwErrCnt", pwErrCnt + 1);
			result.put("ErrorCd", "ECIU022");
			return result;
			//throw new Warning("ECIU022");	//비밀번호를 확인하십시오.
		} else {
			log.debug("correct password!");
		}
		
		String sessExist = "0";

		/**
		 * 로그인시 로그세션ID값 조회
		 */
		if("Y".equals(loginDblCk)) {
			Map selectLogSesn = new HashMap<>();
			selectLogSesn = this.selectLogSesnIdVal(param);
			
			String logSesnIdVal = (String)selectLogSesn.get("sesnId");
			if(null == logSesnIdVal || "".equals(logSesnIdVal)) {
				sessExist = "0";
			}
			else {
				sessExist = "1";
			}
		}
		
		result.put("result", "1");
		result.put("sessExist", sessExist);

		return result;
	}
	
	/**
	 * @설명: 로그인 ID, PWD로 로그인 처리한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  장창환 2020. 12. 28. 최초작성
	 */
	
	public FwkMap login(Map param) throws Exception {

		FwkMap result = new FwkMap();
		String userId = (String)param.get("userId");
		String userPwd = (String)param.get("userPwd");
		String sha256Pwd = StringUtil.sha256Encode(userPwd);
		
		/**
		 * 로그인 체크 : 비밀번호 오류 건수 확인
		 */
		int pwErrCnt = userMapper.selectUserPswdErrCnt(param);
		if(pwErrCnt >= 5){
			result.put("result", 0);
			result.put("errorcd", "ECIU023");
			return result;
		}
		
		UserInfoVO vo = userMapper.selectUserInfoByLogin(param);
		//logger.debug("userInfoVo:" + vo);
		
		Map inserErrtMap = new HashMap<>();
		/**
		 * 로그인 체크 : 사용자정보 유무 확인
		 */
		if(vo == null || vo.getUserId().length() == 0) {
			inserErrtMap.put("mstkInfoId", "ECIS099");
			inserErrtMap.put("userId", "");
			inserErrtMap.put("mstkCntnt", userId);
			userMapper.insertLoginErrInfo(inserErrtMap);
			
			result.put("result", 0);
			result.put("errorcd", "ECIS099");
			return result;
			//throw new Warning("ECIS099");	//사용자 정보가 일치하지 않습니다.			
		}

		/**
		 * 로그인 체크 : 비밀번호 확인
		 */
		String pwdEncr = vo.getPswdEncr();
		
		if(! pwdEncr.equals(sha256Pwd)) {
			inserErrtMap.put("mstkInfoId", "ECIU022");
			inserErrtMap.put("userId", userId);
			inserErrtMap.put("mstkCntnt", userPwd);
			userMapper.insertLoginErrInfo(inserErrtMap);
			userMapper.insertPswdErrCnt(inserErrtMap);
			
			result.put("result", 0);
			result.put("pwErrCnt", pwErrCnt + 1);
			result.put("ErrorCd", "ECIU022");
			return result;
			//throw new Warning("ECIU022");	//비밀번호를 확인하십시오.
		} else {
			log.debug("correct password!");
		}
		
		/**
		 * 비밀번호 오류 건수 초기화
		 */
		userMapper.insertPswdErrCntInit(param);

		/**
		 * 로그인 세션 정보 생성
		 */
		SessionUtil.setAttribute(SessionUtil.KEY_USER_INFO, vo);

		/**
		 * 로그인시 로그세션ID값 업데이트
		 */
		if("Y".equals(loginDblCk)) {
			this.insertLogSesnIdVal(param);
		}
		
		/**
		 * TODO:로그인 이력 보관
		 */
		Map historyMap = new HashMap();
		historyMap.put("userId", vo.getUserId());
		String contScCd = "";
		if(CommonUtil.isDev()) {
			contScCd = DEV_CONT_SC_CD;
		} else if(CommonUtil.isTest()) {
			contScCd = TEST_CONT_SC_CD;
		} else if(CommonUtil.isProd()) {
			contScCd = PROD_CONT_SC_CD;
		}
		
		historyMap.put("conctScCd", contScCd);
		historyMap.put("regntEno", "system");
		historyMap.put("trtrEno", "system");
		int historyResult = loginHistoryMapper.insertHistory(historyMap);
		vo.setLoginDtm(DateUtil.getCurrentDate("yyyy-MM-dd HH:mm:ss"));
		
		result.put("result", historyResult);
		result.put("userInfo", vo);
		return result;
	}

	/**
	 * @설명: 로그인시 로그세션ID값 업데이트
	 * @최초작성자: 류승민
	 * @최초작성일: 2021. 6. 04.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  류승민 2021. 6. 04. 최초작성
	 */
	
	public FwkMap insertLogSesnIdVal(Map param) throws Exception {

		UserInfoVO userInfoVO = SessionUtil.getUserInfo();  // 사용자 VO
		String userEno = userInfoVO.getUserEno();           // 사용자사번
		String userId = userInfoVO.getUserId();           // 사용자사번

		FwkMap req = new FwkMap();
		
		if(param == null) {
			req.put("userId", userId);
		}
		else {
			req.put("userId", param.get("userId"));
			req.put("logSesnIdVal", param.get("logSesnIdVal"));
		}
		req.put("regntEno", userEno);
		
		FwkMap result = new FwkMap();
		try {
			result.put("result", userMapper.insertLogSesnIdVal(req));
		} catch (DataAccessException e) {
			log.debug("DataAccessException =>" + e.getMessage());
			throw new Warning("ESFU010", "로그세션ID값  "); // ESFU010: {0}수정 중 오류가 발생했습니다.
		} catch (Exception e) {
			log.debug("Exception =>" + e.getMessage());
			throw new Warning("ESFU010", "로그세션ID값 "); // ESFU010: {0}수정 중 오류가 발생했습니다.
		}
		return result;
	}

	/**
	 * @설명: 타임아웃시 로그세션ID값 업데이트
	 * @최초작성자: 류승민
	 * @최초작성일: 2021. 6. 04.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  류승민 2021. 6. 04. 최초작성
	 */
	
	public int updateLogSesnIdVal(Map param) throws Exception {

		log.debug("Call updateLogSesnIdVal!!!");
		return userMapper.updateLogSesnIdVal(param);
	}

	/**
	 * @설명: 로그인시 로그세션ID값 조회
	 * @최초작성자: 류승민
	 * @최초작성일: 2021. 6. 04.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  류승민 2021. 6. 04. 최초작성
	 */
	
	public FwkMap selectLogSesnIdVal(Map param) throws Exception {
		
		FwkMap result = new FwkMap();
		result.put("sesnId", userMapper.selectLogSesnIdVal(param));
		
		return result;
	}

	/**
	 * @설명: 로그인 여부 조회
	 * @최초작성자: 류승민
	 * @최초작성일: 2021. 6. 04.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: String
	 * @개정이력: 
	 *  류승민 2021. 6. 04. 최초작성
	 */
	
	public String selectLogSesnIdExist(Map param) throws Exception {
		return userMapper.selectLogSesnIdExist(param);
	}
}
