package kr.co.wllife.acs.online.mg.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;

/**
 * @시스템명: IFRS17
 * @업무명: 공통
 * @설명: 코드 테이블 관리 Mapper
 * @최초작성자: 장창환
 * @최초작성일: 2021. 1. 15.
 * @최종변경일:
 * @개정이력:
 *        장창환 2021. 1. 15. 최초작성
 */
@Mapper
public interface CodeMapper {

	/**
	 * @설명: 코드ID로 코드리스트를 조회한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일:
	 * @매개변수: Map param
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        장창환 2020. 12. 28. 최초작성
	 */
	List<FwkMap> selectCommonCodeListById(Map param) throws Exception;

	/**
	 * @설명: 전체 데이터를 select하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        편신범 2020. 12. 28. 최초작성
	 */
	List<FwkMap> selectCodeList(Map param) throws Exception;

	/**
	 * @설명: TB_ICBETM01(개별코드관리) 테이블에서 사용으로 정의된 코드만 조회한다.
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param param
	 * @매개변수: @throws Exception
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	// List<FwkMap> selectUseCodeList(Map param) throws Exception;
	// 아직 사용 미정

	/**
	 * @설명: 키워드로 데이터를 select하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param param
	 * @매개변수: @throws Exception
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	List<FwkMap> selectCodeListByKeywords(Map param) throws Exception;

	/**
	 * @설명: param 데이터를 insert하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param param
	 * @매개변수: @throws Exception
	 * @반환값: Integer
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	Integer insertCodeInfo(Map param) throws Exception;

	/**
	 * @설명: param 데이터를 update하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param param
	 * @매개변수: @return
	 * @매개변수: @throws Exception
	 * @반환값: Integer
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	Integer updateCodeInfo(Map param) throws Exception;

	/**
	 * @설명: param 데이터를 Key로 받아 deletet하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param param
	 * @매개변수: @throws Exception
	 * @반환값: Integer
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	Integer deleteCodeInfo(Map param) throws Exception;

	/**
	 * @설명: [유지]통합코드중심(기간계) 전체 데이터를 select하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param param
	 * @매개변수: @return
	 * @매개변수: @throws Exception
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	List<FwkMap> selectCodeStatList(Map param) throws Exception;

	/**
	 * @설명: [유지]통합코드중심(기간계) 키워드로 데이터를 select하는 Map
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param param
	 * @매개변수: @return
	 * @매개변수: @throws Exception
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	List<FwkMap> selectCodeStatListByKeywords(Map param) throws Exception;

}
