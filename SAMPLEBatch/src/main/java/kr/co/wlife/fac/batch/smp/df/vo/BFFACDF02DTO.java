package kr.co.wlife.fac.batch.smp.df.vo;

import lombok.*;  

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: Job ID(BFFACDF02B) 기준 VO - BFFACDF02DTO
 * @설명: 각 Step/쿼리 단위로 static inner class를 둔다.
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
public class BFFACDF02DTO {
	
	/** Delimited 파일 읽기용 VO (입력) */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    @Builder
    public static class fileInputVO {
        private String ancmNtfId;
        private String titl;
        private String cont;
        private Long iqCnt;
        private String inppCd;
    }

    /** Fixed-Length 파일 쓰기용 VO (출력) */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    @Builder
    public static class fileOutputVO {
        private String ancmNtfId;
        private String titl;
        private String cont;
        private String iqCnt;
        private String inppCd;
    }
}