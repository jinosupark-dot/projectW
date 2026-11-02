package kr.co.wlife.fac.batch.smp.dd.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import kr.co.wlife.fac.batch.smp.dd.vo.BFFACDD01DTO;
import kr.co.wlife.common.batch.config.BusinessMapper;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDD01MAPPER
 * @설명: BFFACDD01B 배치 Job에서 사용하는 MyBatis 매퍼 인터페이스
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
@BusinessMapper
public interface BFFACDD01MAPPER {

	/**
	 * =====================================================================================
	 * @설명: 기본정보 조회 ItemReader select
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: List<BFFACDD01DTO.selectTest01ListVO>
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    List<BFFACDD01DTO.selectTest01ListVO> selectTest01List();

	/**
	 * =====================================================================================
	 * @설명: 기본정보 insertTestItem
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수: BFFACDD01DTO.selectTest01ListVO
	 * @반환값: 
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    void insertTestItem(@Param("item") BFFACDD01DTO.selectTest01ListVO item);

	/**
	 * =====================================================================================
	 * @설명: 동적 조건절 (if) 사용예제
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수: fruitColor,minQty
	 * @반환값: List<BFFACDD01DTO.selectFruitSourceListVO>
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    List<BFFACDD01DTO.selectFruitSourceListVO> selectFruitSource(@Param("fruitColor") String fruitColor,
                                                              @Param("minQty") Integer minQty);


	/**
	 * =====================================================================================
	 * @설명: updateFruitStatus사용예제
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수: BFFACDD01DTO.fruitTargetVO
	 * @반환값: 
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    void updateFruitStatus(@Param("item") BFFACDD01DTO.fruitTargetVO item);

	/**
	 * =====================================================================================
	 * @설명: deleteOldFruitTarget사용예제
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수: cutoffDate
	 * @반환값: 
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    void deleteOldFruitTarget(@Param("cutoffDate") LocalDate cutoffDate);

	/**
	 * =====================================================================================
	 * @설명: foreach IN절 사용예제
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수: List<String> ids
	 * @반환값: 
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    List<BFFACDD01DTO.selectFruitSourceListVO> selectFruitSourceByIds(@Param("ids") List<String> ids);

	/**
	 * =====================================================================================
	 * @설명: insertFruitTarget  사용예제
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수: BFFACDD01DTO.fruitTargetVO
	 * @반환값: 
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    void insertFruitTarget(@Param("item") BFFACDD01DTO.fruitTargetVO item);
}