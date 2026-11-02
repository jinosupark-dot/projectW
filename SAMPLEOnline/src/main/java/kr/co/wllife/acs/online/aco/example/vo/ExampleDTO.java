package kr.co.wllife.acs.online.aco.example.vo;

import javax.validation.constraints.Size;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * =====================================================================================
 * 
 * @시스템명: ACS
 * @업무명: Example 기준 DTO
 * @설명: VO를 각 쿼리 단위 static inner class로 만든다.
 * @최초작성자: 김종호
 * @최초작성일: 2026-10-26
 * @최종변경일:
 * @개정이력:
 *        김종호 2026-10-26 최초작성
 *        =====================================================================================
 */
public class ExampleDTO {

    /** SelectList 쿼리 결과/파라미터용 */
    @Getter
    @Setter
    @ToString
    @NoArgsConstructor
    public static class selectListVO {

        /** 공지사항 ID */
        private String ancmNtfId;

        /** 제목, Jakarta Validation 예제 */
        @NotBlank(message = "제목은 필수 입력 항목입니다.")
        @Size(min = 3, max = 20, message = "제목은 3자 이상 20자 이하이어야 합니다.")
        private String titl;

        /** 내용 */
        private String cont;

        /** 조회수 */
        private String iqcnt;

        /** 등록일자 */
        private String ipdtm;

        /** 입력자 코드 */
        private String inppCd;
    }

    /** viewNoticeDetail 쿼리 결과/파라미터용 */
    @Getter
    @Setter
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    public static class viewNoticeDetailVO {

        /** 공지사항 ID */
        private String ancmNtfId;

        /** 제목 */
        private String titl;

        /** 내용 */
        private String cont;

        /** 조회수 */
        private Integer iqcnt;

        /** 입력일자 (YYYY-MM-DD) */
        private String ipdtm;

        /** 입력자 코드 */
        private String inppCd;

    }
}
