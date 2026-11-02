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
import kr.co.wllife.acs.online.mg.sy.mapper.RoleMapper;
import kr.co.wllife.acs.online.mg.sy.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;

/**
 * @시스템명: IFRS17
 * @업무명: MGSY 시스템관리 - 권한 관리
 * @설명: 
 * @최초작성자: 권세림(61000255)
 * @최초작성일: 2021.01.12
 * @최종변경일: 
 * @개정이력: 
 *  권세림(61000255) 2021.01.12 최초작성
 *  권세림(61000255) 2021.04.29 IM 계정정보 변동정보 동기화처리
 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
 */
@Slf4j 
@Service 
public class RoleService {

	private final RoleMapper roleMapper;

	public RoleService(RoleMapper roleMapper) {
		this.roleMapper = roleMapper;
	}

	/**
	 * @설명: selectRoleList : TB_IMGSYF03(역할기본)에서  등록된 역할 리스트를 SELECT하는  ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public List<FwkMap> selectRoleList(Map param) throws Exception {
		List<FwkMap> result = null;
		try{
			result = roleMapper.selectRoleList(param);
		}catch (DataAccessException e) {
			throw new Warning("ESFU011", "역할");
		} catch (Exception e) {
			throw new Warning("ESFU011", "역할");
		}
		return result;
	}
	
	/**
	 * @설명: selectRoleListByUppRoleId : TB_IMGSYF03(역할기본)에서  등록된 역할 리스트를 UPP_AUTH_GRP_ID로 SELECT하는  ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public List<FwkMap> selectRoleListByUppRoleId(Map param) throws Exception {
		List<FwkMap> result = null;
		try{
			result = roleMapper.selectRoleListByUppRoleId(param);
		}catch(DataAccessException e){
			throw new Warning("ESFU011", "역할");
		}catch(Exception e){
			throw new Warning("ESFU011", "역할");
		}
		return result;
	} 

	/**
	 * @설명: selectUserByRoleList : TB_IMGSYF04(역할기본)에서  역할별 특별사용자를 SELECT하는  ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public List<FwkMap> selectUserByRoleList(Map param) throws Exception {
		List<FwkMap> result = null;
		try{
			result = roleMapper.selectUserByRoleList(param);
		}catch(DataAccessException e){
			throw new Warning("ESFU011", "역할별 특별사용자");
		}catch(Exception e){
			throw new Warning("ESFU011", "역할별 특별사용자");
		}
		return result;
	}
	
	
	/**
	 * @설명: selectMenuByRoleList : TB_IMGSYF05(역할별 화면)에서  역할별 특별사용자를 SELECT하는  ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public List<FwkMap> selectMenuByRoleList(Map param) throws Exception {
		List<FwkMap> result = null;
		try{
			result = roleMapper.selectMenuByRoleList(param);
		}catch(DataAccessException e){
			throw new Warning("ESFU011", "역할별 화면");
		}catch(Exception e){
			throw new Warning("ESFU011", "역할별 화면");
		}
		return result;
	}
	

	
	/**
	 * @설명: selectRoleByRuleSettingList : TB_IMGSYF04(역할별 부서)에서  역할별 특별사용자를 SELECT하는  ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public List<FwkMap> selectRoleByRuleSettingList(Map param) throws Exception {
		List<FwkMap> result = null;
		try{
			result = roleMapper.selectRoleByRuleSettingList(param);
		}catch(DataAccessException e){
			throw new Warning("ESFU011", "");
		}catch(Exception e){
			throw new Warning("ESFU011", "");
		}
		return roleMapper.selectRoleByRuleSettingList(param);
	}


	/**
	 * @설명: insertRoleList : TB_IMGSYF03(역할기본)에 reqMap의 데이터를  INSERT하는 ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map reqMap
	 * @반환값: List<FwkMap> resultMap
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public FwkMap insertRoleList(Map reqMap) throws Exception {
		FwkMap resultMap = new FwkMap();

		UserInfoVO vo = SessionUtil.getUserInfo();
		String userId = vo.getUserEno();
		reqMap.put("mdfcPsbYn", "Y");
		reqMap.put("regntEno", userId);
		reqMap.put("trtrEno", userId);
		
		try{
			resultMap.put("result", roleMapper.insertRoleList(reqMap));
		}catch(DuplicateKeyException e){//추가 삭제시 
			throw new Warning("ECSU204", "역할ID");
		} catch(DataAccessException e){
			throw new Warning("ESFU009", "역할");
		}catch(Exception e){
			throw new Warning("ESFU009", "역할");	
		}
		
		return resultMap;
	}

    /**
	 * @설명:  insertUserByRoleList : TB_IMGSYF04(역할별 특별사용자)에 reqMap의 데이터를  INSERT하는 ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result 
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public FwkMap insertUserByRoleList(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();

		UserInfoVO vo = SessionUtil.getUserInfo();
		String userId = vo.getUserEno();
		param.put("regntEno", userId);
		param.put("trtrEno", userId);
		try {

			resultMap.put("result", roleMapper.insertUserByRoleList(param));
			
		}catch(DuplicateKeyException e){//추가 삭제시 
			throw new Warning("ENBU920"); 
		} catch(DataAccessException e){
			throw new Warning("ESFU009", "역할별 특별사용자");
		}catch(Exception e){
			throw new Warning("ESFU009", "역할별 특별사용자");
		}
		return resultMap;
	}

  /**
	 * @설명:  insertMenuByRoleList : TB_IMGSYF05(역할별 화면)에 reqMap의 데이터를  INSERT하는 ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result 
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
    public FwkMap insertMenuByRoleList(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();
		UserInfoVO vo = SessionUtil.getUserInfo();
		String userId = vo.getUserEno();
		param.put("regntEno", userId);
		param.put("trtrEno", userId);
		try{
			resultMap.put("result", roleMapper.insertMenuByRoleList(param));
		}catch(DuplicateKeyException e){//추가 삭제시 
			throw new Warning("ENBU920");
		} catch(DataAccessException e){
			throw new Warning("ESFU009", "역할별 화면");
		}catch(Exception e){
			throw new Warning("ESFU009", "역할별 화면");
		}
		return resultMap;
	}

      /**
	 * @설명:  insertRoleByRuleSettingList : TB_IMGSYF06(역할별 부서)에 reqMap의 데이터를  INSERT하는 ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result 
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
     	public FwkMap insertRoleByRuleSettingList(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();
		UserInfoVO vo = SessionUtil.getUserInfo();
		String userId = vo.getUserEno();
		param.put("regntEno", userId);
		param.put("trtrEno", userId);
		try{
			resultMap.put("result", roleMapper.insertRoleByRuleSettingList(param));
		}catch(DuplicateKeyException e){//추가 삭제시 
			throw new Warning("ENBU920"); 
		} catch(DataAccessException e){
			throw new Warning("ESFU009", "역할별 부서");
		}catch(Exception e){
			throw new Warning("ESFU009", "역할별 부서");
		}
		
		return resultMap;
	}

    /**
	 * @설명: updateRoleList : TB_IMGSYF03(역할기본)에  reqMap의 데이터를 UPDATE하는 ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map reqMap
	 * @반환값: List<FwkMap> resultMap
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public FwkMap updateRoleList(Map reqMap) throws Exception {
		FwkMap resultMap = new FwkMap();
		UserInfoVO vo = SessionUtil.getUserInfo();
		String userId = vo.getUserEno();  
		reqMap.put("regntEno", userId);
		reqMap.put("trtrEno", userId);
		
		try{
			resultMap.put("result", roleMapper.updateRoleList(reqMap));
		}catch(DuplicateKeyException e){//추가 삭제시 
			throw new Warning("ECSU204", "역할ID");
		} catch(DataAccessException e){
			throw new Warning("ESFU010", "역할");
		}catch(Exception e){
			throw new Warning("ESFU010", "역할");
		}

		return resultMap;
	}

    	
	/**
	 * @설명: deleteRoleList : TB_IMGSYF03(역할기본)에   AUTH_GRP_ID를 Key로  DELETE하는 ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: FwkMap resultMap
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public FwkMap deleteRoleList(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();
		try{
			resultMap.put("result", roleMapper.deleteRoleList(param));
		}catch(DataAccessException e){
			throw new Warning("ESFU012", "역할");
		}catch(Exception e){
			throw new Warning("ESFU012", "역할");
		}
		return resultMap;
	}

    /**
	 * @설명: deleteRoleList : TB_IMGSYF03(역할기본)에   AUTH_GRP_ID를 Key로 그룹/역할이 DELETE 되었을때, 
	 * 		해당 AUTH_GRP_ID 를 Key로 가지고 있는  TB_IMGSYF04(역할별특별사용자),TB_IMGSYF05(역할별화면),TB_IMGSYF06(역할별 부서) 데이터도 일괄적으로 삭제를 한다.
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: FwkMap resultMap
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public FwkMap deleteRoleList(Map param, List<FwkMap> originList) throws Exception {
		FwkMap resultMap = new FwkMap();
		String originAuthGrpId;
		
		String authGrpId = (String)param.get("authGrpId");			//역할아이디
		String authGrpTypCd = (String)param.get("authGrpTypCd");	//1 : 그룹 2: 역할
		
		try{
			/* 역할그룹인지 역할인지 구분 */
			if ("1".equals(authGrpTypCd)) {
				for (FwkMap roleMap : originList) {
					originAuthGrpId = (String) roleMap.get("authGrpId");
					if (authGrpId.equals(originAuthGrpId)) {
						roleMapper.deleteRoleInfoByGroup(param);		//해당그룹의 하위 역할내용 삭제
						roleMapper.deleteUserByRoleListBundle(param);		//해당역할의  특별사용자,화면,역할별 부서삭제
						roleMapper.deleteMenuByRoleListBundle(param);
						roleMapper.deleteRoleByRuleSettingListBundle(param);
					}
				}
			}else if("2".equals(authGrpTypCd)){
				for (FwkMap roleMap : originList) {
					originAuthGrpId = (String) roleMap.get("authGrpId");
					if (authGrpId.equals(originAuthGrpId)) {       
						roleMapper.deleteUserByRoleListBundle(param);	//해당역할의  특별사용자,화면,역할별 부서삭제
						roleMapper.deleteMenuByRoleListBundle(param);
						roleMapper.deleteRoleByRuleSettingListBundle(param);
					}
				}
			}else{
				throw new Warning("ENBU204", "역할");
			}
			resultMap.put("result", roleMapper.deleteRoleList(param));
		}catch(DataAccessException e){
			throw new Warning("ENBU204", "역할");
		}catch(Exception e){
			throw new Warning("ENBU204", "역할");
		}
		return resultMap;
	}
		/**
	 * @설명:  deleteUserByRoleList : TB_IMGSYF04(역할별 특별사용자)의  AUTH_ROL_ID,USER_ID 를 Key로  DELETE하는 ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: FwkMap resultMap
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public FwkMap deleteUserByRoleList(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();
		try{
			resultMap.put("result", roleMapper.deleteUserByRoleList(param));
		}catch(DataAccessException e){
			throw new Warning("ESFU012", "역할별 특별사용자");
		}catch(Exception e){
			throw new Warning("ESFU012", "역할별 특별사용자");
		}
		return resultMap;
	}
	
	/**
	 * @설명:  deleteMenuByRoleList : TB_IMGSYF05(역할별화면)의   AUTH_ROL_ID ,MENU_ID 를 Key로  DELETE하는 ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: FwkMap resultMap
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public FwkMap deleteMenuByRoleList(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();
		try{
			resultMap.put("result", roleMapper.deleteMenuByRoleList(param));
		}catch(DataAccessException e){
			throw new Warning("ESFU012", "역할별 화면");
		}catch(Exception e){
			throw new Warning("ESFU012", "역할별 화면");
		}
		return resultMap;
	}

    /**
	 * @설명:  deleteRoleByRuleSettingList : TB_IMGSYF06(역할별 부서)의  AUTH_ROL_ID, ORG_CD, DUTY_ID를 Key로  DELETE하는 ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: FwkMap resultMap
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public FwkMap deleteRoleByRuleSettingList(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();
		try{
			resultMap.put("result", roleMapper.deleteRoleByRuleSettingList(param));
		}catch(DataAccessException e){
			throw new Warning("ESFU012", "역할별 부서");
		}catch(Exception e){
			throw new Warning("ESFU012", "역할별 부서");
		}
		return resultMap;
	}
	
	/**
	 * @설명: saveRoleList : 그리드에서 요청한 리스트를 TB_IMGSYF03(역할기본)에 저장한다.
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: List<Map> paramList
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public FwkMap saveRoleList(List<Map> paramList) throws Exception {
		FwkMap result = new FwkMap();
		Map<String,String> param = new HashMap<String,String>();
		param.put("key", "value");
		List<FwkMap> originList = this.selectRoleList(param);
		
		for(Map roleMap : paramList) {
			String status = (String)roleMap.get("status");
			if("c".equals(status)) {
				result = this.insertRoleList(roleMap);
			} else if("u".equals(status)) {
				result = this.updateRoleList(roleMap);
			} else if("d".equals(status)) {
				result = this.deleteRoleList(roleMap,originList);
			}else{
				throw new Warning("ESFU012", "");
			}
		}
		return result;
	}
	
	/**
	 * @설명: saveUserByRoleList : 그리드에서 요청한 리스트를 TB_IMGSYF04(력할볗특별사용자)에 저장한다.
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: List<Map> paramList
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public FwkMap saveUserByRoleList(List<Map> paramList) throws Exception {
		FwkMap result = new FwkMap();
		for(Map roleMap : paramList) {
			String status = (String)roleMap.get("status");
			if("c".equals(status)) {
				result = this.insertUserByRoleList(roleMap);
			} else if("d".equals(status)) {
				result = this.deleteUserByRoleList(roleMap);
			} else if("u".equals(status)) {
				result = this.updateUserByRoleList(roleMap);
			} else{
				throw new Warning("ESFU012", "");
			}
		}
		return result;
	}
	
	public FwkMap updateUserByRoleList(Map reqMap) throws Exception {

		FwkMap resultMap = new FwkMap();
		
		UserInfoVO vo = SessionUtil.getUserInfo();
		String userId = vo.getUserEno();
		
		reqMap.put("trtrEno", userId);
		
		try {
		
			resultMap.put("result", roleMapper.updateUserByRoleList(reqMap));

		} catch (DuplicateKeyException e) {// 추가 삭제시
			throw new Warning("ESFU011", "권한역할ID, 사용자ID");
		} catch (DataAccessException e) {
			throw new Warning("ESFU011", "사원 수정가능여부");
		} catch (Exception e) {
			throw new Warning("ESFU011", "사원 수정가능여부");
		}
		
		return resultMap;
	}
	
	/**
	 * @설명: saveMenuByRoleList : 그리드에서 요청한 리스트를 TB_IMGSYF05(역할별 화면)에 저장한다.
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: List<Map> paramList
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public FwkMap saveMenuByRoleList(List<Map> paramList) throws Exception {
		FwkMap result = new FwkMap();
		for(Map roleMap : paramList) {
			String status = (String)roleMap.get("status");
			if("c".equals(status)) {
				result = this.insertMenuByRoleList(roleMap);
			}else if("d".equals(status)) {
				result = this.deleteMenuByRoleList(roleMap);
			}else{
				throw new Warning("ESFU012", "");
			}
		}
		return result;
	}
	/**
	 * @설명: saveRoleByRuleSettingList : 그리드에서 요청한 리스트를 TB_IMGSYF06(역할별부서)에 저장한다.
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: List<Map> paramList
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public FwkMap saveRoleByRuleSettingList(List<Map> paramList) throws Exception {
		FwkMap result = new FwkMap();
		for(Map roleMap : paramList) {
			String status = (String)roleMap.get("status");
			if("c".equals(status)) {
				result = this.insertRoleByRuleSettingList(roleMap);
			} else if("d".equals(status)) {
				result = this.deleteRoleByRuleSettingList(roleMap);
			}else{
				throw new Warning("ESFU012", "");
			}
		}
		return result;
	}
	
	/**
	 * @설명: showSelect_Popup : 화면에서 요청한 팝업에 따라 사원/화면/조직 SELECT 함수를 호출한다.
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result 
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public List<FwkMap> showSelect_Popup(Map param) throws Exception {
		List<FwkMap> result =null;
		String searchType = (String)param.get("searchType");
		if("user".equals(searchType)){
			result = this.searchStaff_Popup(param);
		}else if("menuByRole".equals(searchType)){
			result = this.searchMenu_Popup(param);
		}else if("roleByRuleSetting".equals(searchType)){
			result = this.searchOrg_Popup(param);
		}else{
			throw new Warning("ESFU012", "");
		}
		return result;
	}
	

	/**
	 * @설명: searchStaff_Popup : TB_IMGSYF01(사용자)테이블과 TB_SAOGF01(조직기본)테이블에서  사원과 조직 정보를 SELECT 하는 Serviceimple
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public List<FwkMap> searchStaff_Popup(Map param) throws Exception {
		List<FwkMap> result = null;
		try{
			result = roleMapper.searchStaff_Popup(param);
		}catch(DataAccessException e){
			throw new Warning("ESFU011", "사원");
		}catch(Exception e){
			throw new Warning("ESFU011", "사원");
		}
		return result;
	}
	/**
	 * @설명: searchOrg_Popup :  TB_SAOGF01(조직기본)테이블에서 조직 정보를 SELECT 하는 Serviceimple
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public List<FwkMap> searchOrg_Popup(Map param) throws Exception {
		List<FwkMap> result = null;
		try{
			result = roleMapper.searchOrg_Popup(param);
		}catch(DataAccessException e){
			throw new Warning("ESFU011", "조직");
		}catch(Exception e){
			throw new Warning("ESFU011", "조직");
		}
		return result;
	}
	/**
	 * @설명: searchMenu_Popup : TB_IMGSYF02(메뉴기본)테이블에서 화면정보를 SELECT 하는 Serviceimple
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.01.12
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.01.12 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	public List<FwkMap> searchMenu_Popup(Map param) throws Exception {
		List<FwkMap> result = null;
		try{
			result = roleMapper.searchMenu_Popup(param);
		}catch(DataAccessException e){
			throw new Warning("ESFU011", "화면");
		}catch(Exception e){
			throw new Warning("ESFU011", "화면");
		}
		return result;
	}
}
