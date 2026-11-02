package kr.co.wlife.fac.batch.smp.df.mapper;

import org.apache.ibatis.annotations.Param;

import kr.co.wlife.fac.batch.smp.df.vo.BFFACDF03DTO;
import kr.co.wlife.common.batch.config.BusinessMapper;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDF03MAPPER
 * @설명: BFFACDD03B 배치 Job에서 사용하는 MyBatis 매퍼 인터페이스
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
@BusinessMapper
public interface BFFACDF03MAPPER {
	/**
	 * =====================================================================================
	 * @설명: 기본정보 insertTBPSB0016Info
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수: BFFACDF03DTO.insertTBPSB0016InfoVO
	 * @반환값: 
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    int insertTBPSB0016Info(@Param("item") BFFACDF03DTO.insertTBPSB0016InfoVO item);

}
