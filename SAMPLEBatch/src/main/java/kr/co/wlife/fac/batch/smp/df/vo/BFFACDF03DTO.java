package kr.co.wlife.fac.batch.smp.df.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: Job ID(BFFACDF03B) 기준 VO - BFFACDF03DTO
 * @설명: 각 Step/쿼리 단위로 static inner class를 둔다.
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
public class BFFACDF03DTO {

    @Data
    public static class fileInputVO {
        private String ancmNtfId;
        private String titl;
        private String cont;
        private String iqCnt; // 고정 길이 문자열로 읽어온 뒤 Processor에서 숫자로 변환
        private String inppCd;
    }  
  
    @Getter  
    @Setter  
    @NoArgsConstructor  
    @AllArgsConstructor  
    @ToString  
    @Builder  
    public static class insertTBPSB0016InfoVO {  
        private String ancmNtfId;  
        private String titl;  
        private String cont;  
        private Long iqCnt;  
        private String inppCd;  
    }  
}