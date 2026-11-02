package kr.co.wllife.acs.online.mg.sy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import kr.co.wllife.acs.online.fwk.com.cmm.exception.Warning;
import kr.co.wllife.acs.online.fwk.com.cmm.util.SessionUtil;
import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.mapper.MenuMapper;
import kr.co.wllife.acs.online.mg.sy.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;

/**
 * @시스템명: IFRS17
 * @업무명: MGSY 시스템관리 - 메뉴 관리
 * @설명: 
 * @최초작성자: 편신범
 * @최초작성일: 2020. 12. 28.
 * @최종변경일: 
 * @개정이력: 
 *  편신범 2020. 12. 28. 최초작성
 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
 */
@Slf4j 
@Service
public class MenuService{

	private final MenuMapper menuMapper;

	public MenuService(MenuMapper menuMapper) {
		this.menuMapper = menuMapper;
	}



	/**
	 * @설명:selectMenuListByUppMenuId  TB_IMGSYF02(메뉴 관리)에서 UPP_MENU_ID를 Key로 select하는 ServiceImpl
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public List<FwkMap> selectMenuListByUppMenuId(Map param) throws Exception {
		List<FwkMap> result = null;
		try{
			result = menuMapper.selectMenuListByUppMenuId(param);
		}catch(DataAccessException e){
			throw new Warning("ESFU011", "메뉴");
		}catch(Exception e){
			throw new Warning("ESFU011", "메뉴");
		}
		return result;
	}
	
	/**
	 * @설명: selectMenuList TB_IMGSYF02(메뉴 관리)에서 활성화중인 전체 데이터를 select하는 ServiceImpl
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public List<FwkMap> selectMenuList(Map param) throws Exception {	
		List<FwkMap> result = null;
	try{
		result = menuMapper.selectMenuList(param);
	}catch(DataAccessException e){
		throw new Warning("ESFU011", "메뉴");
	}catch(Exception e){
		throw new Warning("ESFU011", "메뉴");
	}
	return result;
	}
	
	/**
	 * @설명:insertMenuInfo TB_IMGSYF02(메뉴 관리)에 param을 insert하는 ServiceImpl
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public FwkMap insertMenuInfo(Map reqMap) throws Exception {
		FwkMap resultMap = new FwkMap();

		UserInfoVO vo = SessionUtil.getUserInfo();
		log.debug("userInfoVO:" + vo.toString());
		String userId = vo.getUserEno();
		reqMap.put("regntEno", userId);
		reqMap.put("trtrEno", userId);
		
		try{
			resultMap.put("result", menuMapper.insertMenuInfo(reqMap));
		}catch(DuplicateKeyException e){//추가 삭제시 
			throw new Warning("ECSU204", "메뉴ID");
		} catch(DataAccessException e){
			throw new Warning("ESFU009", "메뉴");
		}catch(Exception e){
			throw new Warning("ESFU009", "메뉴");
		}
		return resultMap;
	}
	
	/**
	 * @설명: updateMenuInfo TB_IMGSYF02(메뉴 관리)에 param 데이터를 update하는 ServiceImpl
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public FwkMap updateMenuInfo(Map reqMap) throws Exception {
		FwkMap resultMap = new FwkMap();
		
		UserInfoVO vo = SessionUtil.getUserInfo();
		log.debug("userInfoVO:" + vo.toString());
		String userId = vo.getUserEno();
		reqMap.put("trtrEno", userId);
		try{
			resultMap.put("result", menuMapper.updateMenuInfo(reqMap));
		}catch(DuplicateKeyException e){//추가 삭제시 
			throw new Warning("ECSU204", "메뉴ID");
		}catch(DataAccessException e){
			throw new Warning("ESFU010", "메뉴");
		}catch(Exception e){
			throw new Warning("ESFU010", "메뉴");
		}
		return resultMap;
	}
	
    /**
	 * @설명: updateMenuInfoByUseYn : TB_IMGSYF02(메뉴기본)에   MENU_ID를 Key로 메뉴의 useYn이 변경 되었을때, 
	 * 		해당 메뉴의 하위 메뉴/화면의  useYn 일괄적으로 사용여부를 변경 한다.
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map reqMap,List<FwkMap> originList
	 * @반환값: FwkMap resultMap
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	private FwkMap updateMenuInfoByUseYn(Map reqMap,List<FwkMap> originList) throws Exception {
		FwkMap resultMap = new FwkMap();
		
		String originMenuId;
		String originUseYn;
		//사번 임시 처리
		String userId = "system";  
		reqMap.put("regntEno", userId);
		reqMap.put("trtrEno", userId);
		
		try{
			String menuId = (String)reqMap.get("menuId");
			String menuTypCd = (String)reqMap.get("menuTypCd");
			String useYn = (String)reqMap.get("useYn");
			
			/**
			 * 메뉴인지 화면인지 구분
			 * 1 ; 메뉴 2 : 화면
			 * */
			if("1".equals(menuTypCd)){
				for(FwkMap menuMap : originList){
					originMenuId = (String) menuMap.get("menuId");
					originUseYn = (String) menuMap.get("useYn");
					if(menuId.equals(originMenuId)){
						if(!useYn.equals(originUseYn)){
							menuMapper.updateSubMenuList(reqMap);
						}
					}
				}
			}
			resultMap.put("result", menuMapper.updateMenuInfo(reqMap));
		}catch(DuplicateKeyException e){//추가 삭제시 
			throw new Warning("ECSU204", "메뉴ID");
		}catch(DataAccessException e){
			throw new Warning("ESFU010", "메뉴");
		}catch(Exception e){
			throw new Warning("ESFU010", "메뉴");
		}
		return resultMap;
	}
	
	/**
	 * @설명:deleteMenuInfo  TB_IMGSYF02(메뉴 관리)에서 MENU_ID를 Key로  deletet하는 ServiceImpl
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public FwkMap deleteMenuInfo(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();
		try{
			resultMap.put("result", menuMapper.deleteMenuInfo(param));
		}catch(DataAccessException e){
			throw new Warning("ESFU012", "메뉴");
		}catch(Exception e){
			throw new Warning("ESFU012", "메뉴");
		}
		return resultMap;
	}

    /**
	 * @설명: deleteMenuInfo : TB_IMGSYF02(메뉴기본)에   MENU_ID를 Key로 메뉴가 삭제 되었을때, 
	 * 		해당 메뉴의 하위 메뉴/화면을  일괄적으로 삭제 한다.
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map reqMap,List<FwkMap> originList
	 * @반환값: FwkMap resultMap
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public FwkMap deleteMenuInfo(Map param,List<FwkMap> originList) throws Exception {
		FwkMap resultMap = new FwkMap();
		String originMenuId;
		
		String menuId = (String)param.get("menuId");
		String menuTypCd = (String)param.get("menuTypCd");
		
		try{
			// 메뉴인지 화면인지 구분
			if ("1".equals(menuTypCd)) {
				for (FwkMap menuMap : originList) {
					originMenuId = (String) menuMap.get("menuId");
					if (menuId.equals(originMenuId)) {
						menuMapper.deleteMenuInfoByMenu(param);
					}
				}
			}
			resultMap.put("result", menuMapper.deleteMenuInfo(param));
		}catch(DataAccessException e){
			throw new Warning("ESFU012", "메뉴");
		}catch(Exception e){
			throw new Warning("ESFU012", "메뉴");
		}
		return resultMap;
	}
	
	/**
	 * @설명: selectMenuListByAuth 권한에 해당하는 메뉴 리스트를 조회한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 2020. 12. 28.
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  장창환 2020. 12. 28. 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public List<FwkMap> selectMenuListByAuth(Map param) throws Exception {
		List<FwkMap> result = null;
		try{
			UserInfoVO vo = SessionUtil.getUserInfo();
			log.debug("userInfoVO:" + vo.toString());
			String userId = vo.getUserEno();
			String orgNo = vo.getOrgNo();
			Map userMap = new HashMap();
			userMap.put("userId", userId);
			userMap.put("orgNo", orgNo);
			
			result = menuMapper.selectMenuListByAuth(userMap);
		}catch(DataAccessException e){
			log.error("DataAccessException occurs!", e);
			throw new Warning("ESFU011", "메뉴");
		}catch(Exception e){
			log.error("Exception occurs!", e);
			throw new Warning("ESFU011", "메뉴");
		}
		return result;
	}
	
	/**
	 * @설명: saveMenuList 그리드에서 요청한 리스트를 저장한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 2020. 12. 28.
	 * @매개변수: List<Map> paramList
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  장창환 2020. 12. 28. 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */	
	
	public FwkMap saveMenuList(List<Map> paramList) throws Exception {
		FwkMap result = new FwkMap();
		Map<String,String> param = new HashMap<String,String>();
		param.put("key", "value");
		
		List<FwkMap> originList = this.selectMenuList(param);
		
		for(Map menuMap : paramList) {
			String status = (String)menuMap.get("status");
			if("c".equals(status)) {
				result = this.insertMenuInfo(menuMap);
			} else if("u".equals(status)) {
				result = this.updateMenuInfoByUseYn(menuMap,originList);
			} else if("d".equals(status)) {
				result = this.deleteMenuInfo(menuMap,originList);
			}
		}
		return result;
	}
}
