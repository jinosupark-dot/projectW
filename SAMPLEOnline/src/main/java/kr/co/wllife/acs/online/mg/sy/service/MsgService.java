package kr.co.wllife.acs.online.mg.sy.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.mapper.MsgMapper;
import lombok.extern.slf4j.Slf4j;

/**
 * @시스템명: IFRS17
 * @업무명: 메시지코드관리
 * @설명: 메시지코드관리 Service Impl
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 15.
 * @최종변경일: 
 * @개정이력: 
 *  편신범 2021. 1. 15. 최초작성
 */
@Slf4j 
@Service
public class MsgService  {

	private final MsgMapper msgMapper;

	public MsgService(MsgMapper msgMapper) {
		this.msgMapper = msgMapper;
	}

	/**
	 * @설명: 메시지코드관리 전체 조회 Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 15.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2021. 1. 15. 최초작성
	 */
	
	public List<FwkMap> selectMsgList(Map param) throws Exception {
		return msgMapper.selectMsgList(param);
	}

	/**
	 * @설명: 사용하는 메시지코드  전체 조회 Service Impl
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 15.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2021. 1. 15. 최초작성
	 */
	
	public List<FwkMap> selectUseMsgList(Map param) throws Exception {
		return msgMapper.selectUseMsgList(param);
	}

	/**
	 * @설명: 메시지코드관리 메시지번호,메시지내용으로 조회 Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 15.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2021. 1. 15. 최초작성
	 */
	
	public List<FwkMap> selectMsgListByKeywords(Map param) throws Exception {
		return msgMapper.selectMsgListByKeywords(param);
	}

	/**
	 * @설명: 메시지코드관리 insert Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 15.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2021. 1. 15. 최초작성
	 */
	
	public FwkMap insertMsgInfo(Map reqMap) throws Exception {
		FwkMap resultMap = new FwkMap();

		//사번 임시 처리
		String userId = "system";
		reqMap.put("regntEno", userId);
		reqMap.put("trtrEno", userId);
		
		resultMap.put("result", msgMapper.insertMsgInfo(reqMap));
		return resultMap;
	}
	

	/**
	 * @설명: 메시지코드관리 update Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 15.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2021. 1. 15. 최초작성
	 */
	
	public FwkMap updateMsgInfo(Map reqMap) throws Exception {
		FwkMap resultMap = new FwkMap();
		
		//사번 임시 처리
		String userId = "system";
		reqMap.put("regntEno", userId);
		reqMap.put("trtrEno", userId);
		
		resultMap.put("result", msgMapper.updateMsgInfo(reqMap));
		return resultMap;
	}
	

	/**
	 * @설명: 메시지코드관리 delete Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 15.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2021. 1. 15. 최초작성
	 */
	
	public FwkMap deleteMsgInfo(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();
		resultMap.put("result", msgMapper.deleteMsgInfo(param));
		return resultMap;
	}
	
	/**
	 * @설명: 메시지코드관리 그리드에서 요청한 리스트를 저장 Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 15.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2021. 1. 15. 최초작성
	 */
	
	public FwkMap saveMsgList(List<Map> paramList) throws Exception {
		FwkMap result = new FwkMap();
		for(Map msgMap : paramList) {
			String status = (String)msgMap.get("status");
			if("c".equals(status)) {
				result = this.insertMsgInfo(msgMap);
			} else if("u".equals(status)) {
				result = this.updateMsgInfo(msgMap);
			} else if("d".equals(status)) {
				result = this.deleteMsgInfo(msgMap);
			}
		}
		return result;
	}
	
	/**
	 * @설명: 통합메시지기본통계(기간계) 전체 조회 Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 20.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2021. 1. 20. 최초작성
	 */
	
	public List<FwkMap> selectMsgStatList(Map param) throws Exception {
		return msgMapper.selectMsgStatList(param);
	}
	
	
	/**
	 * @설명: 통합메시지기본통계(기간계) 메시지번호,메시지내용으로 조회 Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 15.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2021. 1. 15. 최초작성
	 */
	
	public List<FwkMap> selectMsgStatListByKeywords(Map param) throws Exception {
		return msgMapper.selectMsgStatListByKeywords(param);
	}
	
	
}
