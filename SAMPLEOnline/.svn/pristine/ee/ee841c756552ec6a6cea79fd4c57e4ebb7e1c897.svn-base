package kr.co.wllife.acs.online.mg.sy.vo;

import java.io.Serializable;

import jakarta.servlet.http.HttpSessionBindingEvent;
import jakarta.servlet.http.HttpSessionBindingListener;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * 
 * @시스템명: ifrs17
 * @업무명: 공통 
 * @설명: 사용자 관리 테이블에 대응하는 VO이다. 로그인시 해당 VO를 생성하여 Session에 보관한다.
 * @최초작성자: 장창환
 * @최초작성일: 2021. 2. 10.
 * @최종변경일: 
 * @개정이력: 
 *  89001203 2021. 2. 10. 최초작성
 */
public class UserInfoVO implements HttpSessionBindingListener, Serializable {
	
	private static final long serialVersionUID = 5304934224316336445L;
	private boolean isBoundToSession;
	
	//TB_IMGSYF01 INFO
	private String userId;		    //사용자 ID
    private String userEno;		    //사용자 사번
	private String userNm;		    //사용자명
	private String pswdChgYmd;	    //비밀번호 변경일자
	private String userInfoTypCd;	//사용자정보유형코드
	private String statCd;			//상태코드
	private String ecmpYmd;		    //입사일자
	private String rtrYmd;		    //퇴사일자
	private String orgNo;		    //조직번호
	private String jobpsId;		    //직위ID
	private String dutyId;		    //직책ID
	private String pswdEncr;	    //비밀번호(암호화)
	private String rmvlPswdEncr;	//이전비밀번호암호화
	private String pswdErrCumlNts;	//비밀번호착오누적횟수
	private String regntEno;		//등록자사번
	private String regDtm;			//등록일시
	private String trtrEno;			//처리자사번
	private String trtDtm;			//처리일시
	private String orgNm;			//조직명
	private String preLoginDtm;		//직전로그인 시간
	private String loginDtm;		//로그인 시간
	private String prcPmsYn;        //처리권한 여부
	
	@Override
	public void valueBound(HttpSessionBindingEvent arg0) {
		this.isBoundToSession = true;
		
	}

	@Override
	public void valueUnbound(HttpSessionBindingEvent arg0) {
		this.isBoundToSession = false;
	}

	public boolean isBoundToSession() {
		return isBoundToSession;
	}

	public void setBoundToSession(boolean isBoundToSession) {
		this.isBoundToSession = isBoundToSession;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserEno() {
		return userEno;
	}

	public void setUserEno(String userEno) {
		this.userEno = userEno;
	}

	public String getUserNm() {
		return userNm;
	}

	public void setUserNm(String userNm) {
		this.userNm = userNm;
	}

	public String getPswdChgYmd() {
		return pswdChgYmd;
	}

	public void setPswdChgYmd(String pswdChgYmd) {
		this.pswdChgYmd = pswdChgYmd;
	}

	public String getUserInfoTypCd() {
		return userInfoTypCd;
	}

	public void setUserInfoTypCd(String userInfoTypCd) {
		this.userInfoTypCd = userInfoTypCd;
	}

	public String getStatCd() {
		return statCd;
	}

	public void setStatCd(String statCd) {
		this.statCd = statCd;
	}

	public String getEcmpYmd() {
		return ecmpYmd;
	}

	public void setEcmpYmd(String ecmpYmd) {
		this.ecmpYmd = ecmpYmd;
	}

	public String getRtrYmd() {
		return rtrYmd;
	}

	public void setRtrYmd(String rtrYmd) {
		this.rtrYmd = rtrYmd;
	}

	public String getOrgNo() {
		return orgNo;
	}

	public void setOrgNo(String orgNo) {
		this.orgNo = orgNo;
	}

	public String getJobpsId() {
		return jobpsId;
	}

	public void setJobpsId(String jobpsId) {
		this.jobpsId = jobpsId;
	}

	public String getDutyId() {
		return dutyId;
	}

	public void setDutyId(String dutyId) {
		this.dutyId = dutyId;
	}

	public String getPswdEncr() {
		return pswdEncr;
	}

	public void setPswdEncr(String pswdEncr) {
		this.pswdEncr = pswdEncr;
	}

	public String getRmvlPswdEncr() {
		return rmvlPswdEncr;
	}

	public void setRmvlPswdEncr(String rmvlPswdEncr) {
		this.rmvlPswdEncr = rmvlPswdEncr;
	}

	public String getPswdErrCumlNts() {
		return pswdErrCumlNts;
	}

	public void setPswdErrCumlNts(String pswdErrCumlNts) {
		this.pswdErrCumlNts = pswdErrCumlNts;
	}

	public String getRegntEno() {
		return regntEno;
	}

	public void setRegntEno(String regntEno) {
		this.regntEno = regntEno;
	}

	public String getRegDtm() {
		return regDtm;
	}

	public void setRegDtm(String regDtm) {
		this.regDtm = regDtm;
	}

	public String getTrtrEno() {
		return trtrEno;
	}

	public void setTrtrEno(String trtrEno) {
		this.trtrEno = trtrEno;
	}

	public String getTrtDtm() {
		return trtDtm;
	}

	public void setTrtDtm(String trtDtm) {
		this.trtDtm = trtDtm;
	}
	
	public String getOrgNm() {
		return orgNm;
	}

	public void setOrgNm(String orgNm) {
		this.orgNm = orgNm;
	}
	
	public String getPreLoginDtm() {
		return preLoginDtm;
	}

	public void setPreLoginDtm(String preLoginDtm) {
		this.preLoginDtm = preLoginDtm;
	}

	public String getLoginDtm() {
		return loginDtm;
	}

	public void setLoginDtm(String loginDtm) {
		this.loginDtm = loginDtm;
	}
	
	public String getPrcPmsYn() {
		return prcPmsYn;
	}

	public void setPrcPmsYn(String prcPmsYn) {
		this.prcPmsYn = prcPmsYn;
	}
	
	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
}
