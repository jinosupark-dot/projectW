package kr.co.wllife.acs.online.mg.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;

/**
 * @시스템명: IFRS17
 * @업무명:
 * @설명: 배치 및 파라미터를 조회하는 Mapper
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 08.
 * @최종변경일:
 * @개정이력: 
 *  김동현 2021. 03. 08. 최초작성
 *  서승호 2023. 06. 28. 수정작성
 */
@Mapper
public interface BatchMapper {

	/**
	 * @설명: 배치 리스트를 조회한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 08.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 08. 최초작성
	 */
	List<FwkMap> selectBatchList(Map param) throws Exception;

	/**
	 * @설명: 배치 파라미터를 조회한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 08.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 08. 최초작성
	 */
	List<FwkMap> selectBatchParamList(Map param) throws Exception;

	/**
	 * @설명: 배치관리(mgsy914m) - 배치 리스트를 조회한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 11.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 11. 최초작성
	 */
	List<FwkMap> selectMngBatchList(Map param) throws Exception;

	/**
	 * @설명: 배치관리(mgsy914m) - 배치 파라미터 리스트를 조회한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 11.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 11. 최초작성
	 */
	List<FwkMap> selectMngParamList(Map param) throws Exception;

	/**
	 * @설명: 업무구분코드를 조회한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 11.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 11. 최초작성
	 */
	List<FwkMap> selectCdcValtList(Map param) throws Exception;
	
	/**
	 * @설명: 입력값으로 배치 리스트를 조회한다. 
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 11.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 11. 최초작성
	 */
	List<FwkMap> selectBatchListbyData(Map param) throws Exception;
	
	
	/**
	 * @설명: 배치 관리 그리드에 insert한다. 
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 12.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 12. 최초작성
	 */
	Integer insertBatchGridInfo(Map param) throws Exception;
	
	/**
	 * @설명: 배치 관리 그리드에 update한다.  
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 12.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 12. 최초작성
	 */
	Integer updateBatchGridInfo(Map param) throws Exception;
	
	/**
	 * @설명: 배치 관리 그리드에 delete한다. 
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 12.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 12. 최초작성
	 */
	Integer deleteBatchGridInfo(Map param) throws Exception;
	
	/**
	 * @설명: 파라미터 관리 그리드에 insert한다. 
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 15.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 15. 최초작성
	 */
	Integer insertParamGridInfo(Map param) throws Exception;
	
	/**
	 * @설명: 파라미터 관리 그리드에 update한다.  
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 15.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 15. 최초작성
	 */
	Integer updateParamGridInfo(Map param) throws Exception;
	
	/**
	 * @설명: 파라미터 관리 그리드에 delete한다. 
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 15.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 15. 최초작성
	 */
	Integer deleteParamGridInfo(Map param) throws Exception;
	
	/**
	 * @설명: 파라미터 관리 그리드에 delete한다. 
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 15.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 15. 최초작성
	 */
	Integer deleteParamInfobyId(Map param) throws Exception;
	
	/**
	 * @설명: 총계정원장 코스트센터코드 IFRS17 부서그룹정보기본에 존재여부 체크(사업비)
	 * @최초작성자: 서승호
	 * @최초작성일: 2023. 06. 28.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 서승호 2023. 06. 28. 최초작성
	 */
	Integer chkGlBrkdnCocntCd(Map param) throws Exception;
	
	/**
	 * @설명: 총계정원장내역 기능영역 오류 체크(사업비)
	 * @최초작성자: 서승호
	 * @최초작성일: 2023. 06. 28.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 서승호 2023. 06. 28. 최초작성
	 */
	Integer chkGlBrkdnFnctDmnCd(Map param) throws Exception;
	
	/**
	 * @설명: 총계정원장내역 기능영역 오류 체크(사업비)
	 * @최초작성자: 서승호
	 * @최초작성일: 2023. 06. 28.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 서승호 2023. 06. 28. 최초작성
	 */
	Integer chkGlBrkdnPotflscCd(Map param) throws Exception;

	/**
	 * @설명: IFRS17_실제사업비계약별정보내역  실제사업비계약별정보내역의 동일 증번에 채널이 다른건 존재체크(사업비)
	 * @최초작성자: 서승호
	 * @최초작성일: 2023. 06. 28.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 서승호 2023. 06. 28. 최초작성
	 */
	Integer chkRalWrkexEqualsContno(Map param) throws Exception;
	
	/**
	 * @설명: 이전단계 배부금액 오류 체크 01
	 * @최초작성자: 서승호
	 * @최초작성일: 2023. 06. 28.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 서승호 2023. 06. 28. 최초작성
	 */
	Integer chkRmvlDistAmt01(Map param) throws Exception;
	
	/**
	 * @설명: 이전단계 배부금액 오류 체크 02
	 * @최초작성자: 서승호
	 * @최초작성일: 2023. 06. 28.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 서승호 2023. 06. 28. 최초작성
	 */
	Integer chkRmvlDistAmt02(Map param) throws Exception;
	
	/**
	 * @설명: 이전단계 배부금액 오류 체크 03
	 * @최초작성자: 서승호
	 * @최초작성일: 2023. 06. 28.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 서승호 2023. 06. 28. 최초작성
	 */
	Integer chkRmvlDistAmt03(Map param) throws Exception;
	
	/**
	 * @설명: 이전단계 배부금액 오류 체크 04
	 * @최초작성자: 서승호
	 * @최초작성일: 2023. 06. 28.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: Integer
	 * @개정이력: 서승호 2023. 06. 28. 최초작성
	 */
	Integer chkRmvlDistAmt04(Map param) throws Exception;
	
}
