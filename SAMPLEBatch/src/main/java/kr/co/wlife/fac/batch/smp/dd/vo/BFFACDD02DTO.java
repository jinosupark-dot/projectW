package kr.co.wlife.fac.batch.smp.dd.vo;

import lombok.*;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: Job ID(BFFACDD02B) 기준 VO - BFFACDD02DTO
 * @설명: 각 Step/쿼리 단위로 static inner class를 둔다.
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
public class BFFACDD02DTO {

	/** SelectSample01ListVO 쿼리 결과/파라미터용 (Step1) */
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@ToString
	@Builder
	public static class selectSample01ListVO {
		private String ancmNtfId;
		private String titl;
		private String cont;
		private long iqCnt;
		private String inppCd;
	}

	/** SelectSample02ListVO 쿼리 결과/파라미터용 select/insert용 (Step1) */
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@ToString
	@Builder
	public static class selectSample02ListVO {
		private String ancmNtfId;
		private String titl;
		private String cont;
		private long iqCnt;
		private String inppCd;
	}
}