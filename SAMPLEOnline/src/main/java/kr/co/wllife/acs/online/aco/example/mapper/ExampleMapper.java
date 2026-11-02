package kr.co.wllife.acs.online.aco.example.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.wllife.acs.online.aco.example.vo.ExampleDTO;

/**
 * @시스템명: IFRS17
 * @업무명: 공통
 * @설명: 예제 테이블 관리 Mapper
 * @최초작성자: 김종호
 * @최초작성일: 2026. 10. 26.
 * @최종변경일: 2026. 10. 26.
 * @개정이력:
 *        김종호 2026. 10. 26. 최초작성
 */
@Mapper
public interface ExampleMapper {
	/**
	 * @설명: 예제리스트를 조회한다.
	 * @최초작성자: 김종호
	 * @최초작성일: 2026. 10. 26.
	 * @최종변경일: 2026. 10. 26.
	 * @매개변수: Map paramMap
	 * @반환값: List<ExampleDTO.selectListVO>
	 * @개정이력:
	 *        김종호 2026. 10. 26. 최초작성
	 */
	List<ExampleDTO.selectListVO> selectList(Map<String, Object> paramMap);
}
