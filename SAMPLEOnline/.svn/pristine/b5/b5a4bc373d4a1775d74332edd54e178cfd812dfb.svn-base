package kr.co.wllife.acs.online.mg.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;


/**
 * @시스템명: IFRS17
 * @업무명: MGSY 시스템관리 - 메뉴 관련 매퍼
 * @설명: 
 * @최초작성자: sbpyeon
 * @최초작성일: 2020. 12. 28.
 * @최종변경일: 
 * @개정이력: 
 *  sbpyeon 2020. 12. 28. 최초작성
 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
 */
@Mapper
public interface MenuMapper {

	/**
	 * @설명: TB_IMGSYF02(메뉴 관리)에서 UPP_MENU_ID를 Key로 select하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	List<FwkMap> selectMenuListByUppMenuId(Map param) throws Exception; 
	
	/**
	 * @설명: TB_IMGSYF02(메뉴 관리)에서  전체 데이터를 select하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	List<FwkMap> selectMenuList(Map param) throws Exception; 
	
	
	/**
	 * @설명: TB_IMGSYF02(메뉴 관리)에 param 데이터를 insert하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	Integer insertMenuInfo(Map param) throws Exception; 
	
	/**
	 * @설명: TB_IMGSYF02(메뉴 관리)에 param 데이터를 update하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	Integer updateMenuInfo(Map param) throws Exception; 
	
	/**
	 * @설명: TB_IMGSYF02(메뉴 관리)
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	Integer updateSubMenuList(Map param) throws Exception; 
	
	/**
	 * @설명: TB_IMGSYF02(메뉴 관리)에 MENU_ID를 Key로  deletet하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	Integer deleteMenuInfo(Map param) throws Exception; 
	Integer deleteMenuInfoByMenu(Map param) throws Exception; 

	/**
	 * @설명: TB_IMGSYF02(메뉴 관리)에서 UPP_MENU_ID를 Key로 select하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	List<FwkMap> selectMenuListByAuth(Map param) throws Exception; 

}

