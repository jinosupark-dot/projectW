package kr.co.wllife.acs.online.mg.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;

/**
 * @시스템명: IFRS17
 * @업무명: TB_ICBETM02(메시지코드관리)테이블 메시지 코드 관리
 * @설명: 메시지 코드를 관리하는 Mapper 
 * @최초작성자: 편신범
 * @최초작성일: 2021. 1. 15.
 * @최종변경일: 
 * @개정이력: 
 *  편신범 2021. 1. 15. 최초작성
 */
@Mapper
public interface MsgMapper {

	/**
	 * @설명: 전체 데이터를 select하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 */
	List<FwkMap> selectMsgList(Map param) throws Exception; 
	
	/**
	 * @설명: TB_ICBETM02(메시지코드관리)테이블에서 사용으로 정이된 메시지만 조회한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  장창환 2020. 12. 28. 최초작성
	 */
	List<FwkMap> selectUseMsgList(Map param) throws Exception; 
	
	/**
	 * @설명: UNTY_MSG_No(통합메시지번호)와 UNTY_MSG_CNTNT(통합메시지내용)로 데이터를 select하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 */
	List<FwkMap> selectMsgListByKeywords(Map param) throws Exception; 

	/**
	 * @설명: param 데이터를 insert하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 */
	Integer insertMsgInfo(Map param) throws Exception; 
	
	/**
	 * @설명: param 데이터를 update하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 */
	Integer updateMsgInfo(Map param) throws Exception; 
	
	/**
	 * @설명: param 데이터를 Key로 받아 deletet하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: FwkMap
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 */
	Integer deleteMsgInfo(Map param) throws Exception; 
	
	
	/**
	 * @설명: 통합메시지기본통계(기간계) 전체 데이터를 select하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 */
	List<FwkMap> selectMsgStatList(Map param) throws Exception; 
	
	/**
	 * @설명: 통합메시지기본통계(기간계) UNTY_MSG_No(통합메시지번호)와 UNTY_MSG_CNTNT(통합메시지내용)로 데이터를 select하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 
	 *  편신범 2020. 12. 28. 최초작성
	 */
	List<FwkMap> selectMsgStatListByKeywords(Map param) throws Exception; 

}

