package kr.co.wlife.fac.batch.smp.df.mapper;  
  
import java.util.List;

import kr.co.wlife.fac.batch.smp.df.vo.BFFACDF01DTO;
import kr.co.wlife.common.batch.config.BusinessMapper;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDF01MAPPER
 * @설명: BFFACDF01B 배치 Job에서 사용하는 MyBatis 매퍼 인터페이스
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
@BusinessMapper
public interface BFFACDF01MAPPER {  
	
	/**
	 * =====================================================================================
	 * @설명: 계약정보 조회 ItemReader selectSample01List
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: List<BFFACDF01DTO.selectSample01ListVO>
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    List<BFFACDF01DTO.selectSample01ListVO> selectSample01List();  
}