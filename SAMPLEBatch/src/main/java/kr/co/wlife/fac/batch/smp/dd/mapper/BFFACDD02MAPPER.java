package kr.co.wlife.fac.batch.smp.dd.mapper;

import java.time.LocalDate;
import java.util.List;

//import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.wlife.fac.batch.smp.dd.vo.BFFACDD01DTO;
import kr.co.wlife.fac.batch.smp.dd.vo.BFFACDD02DTO;
import kr.co.wlife.fac.batch.smp.dd.vo.BFFACDD02DTO.selectSample01ListVO;
import kr.co.wlife.common.batch.config.BusinessMapper;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDD02MAPPER
 * @설명: BFFACDD02B 배치 Job에서 사용하는 MyBatis 매퍼 인터페이스
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
@BusinessMapper
public interface BFFACDD02MAPPER {

	/**
	 * =====================================================================================
	 * @설명: 계약정보 조회 ItemReader selectSample01List
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: List<BFFACDD02DTO.selectSample01ListVO>
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    List<BFFACDD02DTO.selectSample01ListVO> selectSample01List();

	/**
	 * =====================================================================================
	 * @설명: 계약정보 이력 생성 ItemWriter insertSample02Info
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수: BFFACDD02DTO.selectSample02ListVO 
	 * @반환값: int
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */    
    int insertSample02Info(@Param("item") BFFACDD02DTO.selectSample02ListVO item);
   
	/**
	 * =====================================================================================
	 * @설명: 계약정보 이력 생성 ItemWriter updateSample01Info
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수: BFFACDD02DTO.selectSample02ListVO 
	 * @반환값: int
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */ 
    int updateSample01Info(@Param("item") BFFACDD02DTO.selectSample01ListVO item);        

	/**
	 * =====================================================================================
	 * @설명: 계약정보 조회  selectSample01Info
	 * @최초작성자: 김우리
	 * @최초작성일: 2026-10-24
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: List<BFFACDD02DTO.selectSample01ListVO>
	 * @개정이력:
	 *   김우리 2026-10-24 최초작성
	 * =====================================================================================
	 */
    BFFACDD02DTO.selectSample01ListVO selectSample01Info(@Param("ancmNtfId") String ancmNtfId);
}