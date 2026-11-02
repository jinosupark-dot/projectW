package kr.co.wllife.acs.online.mg.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;


/**
 * @시스템명: IFRS17
 * @업무명: MGSY 시스템관리 - 역할 관련 매퍼
 * @설명: 
 * @최초작성자: 권세림(61000255)
 * @최초작성일: 2021.01.12
 * @최종변경일: 
 * @개정이력: 
 *  권세림(61000255) 2021.01.12 최초작성
 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
 */
@Mapper
public interface RoleMapper {

	
	/**
	 * @설명: CRUD of TB_IMGSYF03(역할기본)
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: 
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	List<FwkMap> selectRoleList(Map param) throws Exception;  // 조회
	List<FwkMap> selectRoleListByUppRoleId(Map param) throws Exception;  // 조회
	Integer insertRoleList(Map param) throws Exception;  // 삽입
	Integer updateRoleList(Map param) throws Exception;  // 수정
	Integer deleteRoleList(Map param) throws Exception;  // 삭제
	Integer deleteRoleInfoByGroup(Map param) throws Exception;  // 일괄삭제

	/**
	 * @설명: CRUD of TB_IMGSYF04(역할별 특별사용자)
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: 
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	List<FwkMap> selectUserByRoleList(Map param) throws Exception; 
	Integer insertUserByRoleList(Map param) throws Exception; 
	Integer deleteUserByRoleList(Map param) throws Exception; 
	Integer deleteUserByGroupList(Map param) throws Exception; 
	Integer deleteUserByRoleListBundle(Map param) throws Exception; 
	Integer updateUserByRoleList(Map param) throws Exception;
	/**
	 * @설명: CRUD of TB_IMGSYF05 (역할별 화면)
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: 
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	List<FwkMap> selectMenuByRoleList(Map param) throws Exception; 
	Integer insertMenuByRoleList(Map param) throws Exception; 
	Integer deleteMenuByRoleList(Map param) throws Exception; 
	Integer deleteMenuByRoleListBundle(Map param) throws Exception; 
	
	/**
	 * @설명: CRUD of TB_IMGSYF06 (역할별 부서)
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: 
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	List<FwkMap> selectRoleByRuleSettingList(Map param) throws Exception; 
	Integer insertRoleByRuleSettingList(Map param) throws Exception; 
	Integer deleteRoleByRuleSettingList(Map param) throws Exception; 
	Integer deleteRoleByRuleSettingListBundle(Map param) throws Exception; 

	
	/**
	 * @설명: SELECT of TB_SAOGF01(조직기본),TB_IMGSYF01(사용자),TB_IMGSYF02(메뉴기본)
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: 
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */	
	List<FwkMap> searchStaff_Popup(Map param) throws Exception; 
	List<FwkMap> searchOrg_Popup(Map param) throws Exception; 
	List<FwkMap> searchMenu_Popup(Map param) throws Exception; 
}

