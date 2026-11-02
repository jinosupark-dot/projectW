package kr.co.wllife.acs.online.mg.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;

/**
 * @시스템명: IFRS17
 * @업무명: 공통
 * @설명: 로그인 이력 Mapper
 * @최초작성자: 장창환
 * @최초작성일: 2021. 1. 15.
 * @최종변경일: 
 * @개정이력: 
 *  장창환 2021. 1. 15. 최초작성
 */
@Mapper
public interface LoginHistoryMapper {

	/**
	 * @설명: 이력  전체 리스트를 조회한다.
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
	 * @설명: 로그인 이력을 저장한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: Integer
	 * @개정이력: 
	 *  장창환 2020. 12. 28. 최초작성
	 */
	Integer insertHistory(Map param) throws Exception; 
	

}

