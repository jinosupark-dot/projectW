package kr.co.wlife.fac.batch.smp.pt.vo;

import lombok.*;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: Job ID(BFFACDF01B) 기준 VO - BFFACDF01DTO
 * @설명: 각 Step/쿼리 단위로 static inner class를 둔다.
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
public class BFFACPT01DTO {

    /** selectPartitionRangeVO 쿼리 결과/파라미터용 (Step1) */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    @Builder
    public static class selectPartitionRangeVO {
        private Long minId;
        private Long maxId;
    }

    /** selectFruitSource 쿼리 결과/파라미터용 (Step2 - 조회) */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    @Builder
    public static class selectFruitSourceListVO {
        private String fruitId;
        private String fruitName;
        private String fruitColor;
        private Integer fruitQty;
    }

    /** T_FRUIT_TARGET insert/update/resultMap 예시용 (Step2 - 적재) */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    @Builder
    public static class fruitTargetVO {
        private Long targetId;
        private String fruitName;
        private Integer fruitQty;
        private String fruitColor;
        private String status;
    }
}