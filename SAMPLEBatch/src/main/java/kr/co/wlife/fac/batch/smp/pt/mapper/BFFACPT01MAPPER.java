package kr.co.wlife.fac.batch.smp.pt.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import kr.co.wlife.fac.batch.smp.pt.vo.BFFACPT01DTO;
import kr.co.wlife.common.batch.config.BusinessMapper;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACPT01MAPPER
 * @설명: BFFACPT01B 배치 Job에서 사용하는 MyBatis 매퍼 인터페이스
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
@BusinessMapper
public interface BFFACPT01MAPPER {
	
	/**
	 * =====================================================================================
	 * @설명: 파티션 분할을 위한 전체 MIN/MAX ID 범위 조회
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: BFFACPT01DTO.selectPartitionRangeVO
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
	BFFACPT01DTO.selectPartitionRangeVO selectPartitionRange();

	/**
	 * =====================================================================================
	 * @설명: 파티션 범위별 소스 데이터 조회 (Cursor Reader용)
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수: maxId 종료 ID
	 * @반환값: List<BFFACPT01DTO.SelectFruitSourceListVO>
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    List<BFFACPT01DTO.selectFruitSourceListVO> selectFruitSourceByRange(
            @Param("minId") Long minId, 
            @Param("maxId") Long maxId
    );


	/**
	 * =====================================================================================
	 * @설명: 기본정보 insertFruitTargetPartition
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수: BFFACPT01DTO.FruitTargetVO
	 * @반환값: 
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    int insertFruitTargetPartition(BFFACPT01DTO.fruitTargetVO targetVO);
}
