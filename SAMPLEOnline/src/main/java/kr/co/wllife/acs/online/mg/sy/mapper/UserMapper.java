package kr.co.wllife.acs.online.mg.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.vo.UserInfoVO;

/**
 * @시스템명: IFRS17
 * @업무명: 공통
 * @설명: 사용자 테이블 관리 Mapper 
 * @최초작성자: 장창환
 * @최초작성일: 2021. 1. 15.
 * @최종변경일: 
 * @개정이력: 
 *  장창환 2021. 1. 15. 최초작성
 */
@Mapper
public interface UserMapper {

	/**
	 * @설명: 사용자 전체 리스트를 조회한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  장창환 2020. 12. 28. 최초작성
	 */
	List<FwkMap> selectList(Map param) throws Exception; 
	
	/**
	 * @설명: 로그인 사용자 정보를 조회한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: UserInfoVO
	 * @개정이력: 
	 *  장창환 2020. 12. 28. 최초작성
	 */
	UserInfoVO selectUserInfoByLogin(Map param) throws Exception; 
	
	/**
	 * @설명: 비밀번호 오류 건수 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: UserInfoVO
	 * @개정이력: 
	 *  장창환 2020. 12. 28. 최초작성
	 */
	Integer selectUserPswdErrCnt(Map param) throws Exception; 
	
	
	/**
	 * @설명: 로그인 오류 등록
	 * @최초작성자: 최동염
	 * @최초작성일: 2021. 02. 08.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 
	 *  최동염 2021. 02. 08. 최초작성
	 */
	Integer insertLoginErrInfo(Map param) throws Exception; 
	
	/**
	 * @설명: 비밀번호 오류 카운트 업데이트
	 * @최초작성자: 최동염
	 * @최초작성일: 2021. 02. 08.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 
	 *  최동염 2021. 02. 08. 최초작성
	 */
	Integer insertPswdErrCnt(Map param) throws Exception; 
	
	/**
	 * @설명: 비밀번호 오류 카운트 초기화
	 * @최초작성자: 최동염
	 * @최초작성일: 2021. 02. 08.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 
	 *  최동염 2021. 02. 08. 최초작성
	 */
	Integer insertPswdErrCntInit(Map param) throws Exception; 

	/**
	 * @설명: 로그인시 로그세션ID값 업데이트
	 * @최초작성자: 류승민
	 * @최초작성일: 2021. 06. 04.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 
	 *  류승민 2021. 06. 04. 최초작성
	 */
	Integer insertLogSesnIdVal(Map param) throws Exception; 

	/**
	 * @설명: 타임아웃시 로그세션ID값 업데이트
	 * @최초작성자: 류승민
	 * @최초작성일: 2021. 06. 04.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 
	 *  류승민 2021. 06. 04. 최초작성
	 */
	Integer updateLogSesnIdVal(Map param) throws Exception; 

	/**
	 * @설명: 로그인시 로그세션ID값 조회
	 * @최초작성자: 류승민
	 * @최초작성일: 2020. 06. 04.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: String
	 * @개정이력: 
	 *  류승민 2020. 06. 04. 최초작성
	 */
	String selectLogSesnIdVal(Map param) throws Exception; 

	/**
	 * @설명: 로그인 여부 조회
	 * @최초작성자: 류승민
	 * @최초작성일: 2020. 06. 04.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: String
	 * @개정이력: 
	 *  류승민 2020. 06. 04. 최초작성
	 */
	String selectLogSesnIdExist(Map param) throws Exception; 
	

}

