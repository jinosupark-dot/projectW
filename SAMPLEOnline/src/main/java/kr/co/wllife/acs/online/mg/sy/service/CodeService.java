package kr.co.wllife.acs.online.mg.sy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.co.wllife.acs.online.fwk.com.cmm.exception.Warning;
import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.mapper.CodeMapper;
import lombok.extern.slf4j.Slf4j;

/**
 * @시스템명: IFRS17
 * @업무명: 공통
 * @설명: 코드관리 Service Impl
 * @최초작성자: 장창환
 * @최초작성일: 2021. 1. 15.
 * @최종변경일:
 * @개정이력:
 *        장창환 2021. 1. 15. 최초작성
 */
@Slf4j
@Service
public class CodeService{

	private final CodeMapper codeMapper;

	public CodeService(CodeMapper codeMapper) {
		this.codeMapper = codeMapper;
	}

	/**
	 * @설명: 코드ID리스트로 코드리스트를 조회한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 15.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        장창환 2021. 1. 15. 최초작성
	 */
	
	public Map selectCommonCodeList(List<Map> param) throws Exception {
		if (param.size() == 0) {
			throw new Warning("ESFU035", "코드ID항목");
		}

		Map resultMap = new HashMap<>();

		for (Map map : param) {
			String codeId = (String) map.get("codeId");
			List<FwkMap> codeList = codeMapper.selectCommonCodeListById(map);

			log.debug("★★★★★★★★★★★★★★★★★★");
			log.debug("[common code] ======> {}", codeId);
			log.debug("[common codeList] ======> {}", codeList);
			log.debug("★★★★★★★★★★★★★★★★★★");

			resultMap.put(codeId, codeList);
		}

		return resultMap;
	}

	/**
	 * @설명: 메시지코드관리 전체 조회 Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param param
	 * @매개변수: @throws Exception
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	
	public List<FwkMap> selectCodeList(Map param) throws Exception {
		return codeMapper.selectCodeList(param);
	}

	/**
	 * @설명: 사용하는 개별코드로 전체 조회 Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param param
	 * @매개변수: @throws Exception
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	// 
	// public List<FwkMap> selectUseCodeList(Map param) throws Exception {
	// return codeMapper.selectUseCodeList(param);
	// }

	/**
	 * @설명: 메시지코드관리 메시지번호,메시지내용으로 조회 Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param param
	 * @매개변수: @throws Exception
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	
	public List<FwkMap> selectCodeListByKeywords(Map param) throws Exception {
		return codeMapper.selectCodeListByKeywords(param);
	}

	/**
	 * @설명: 메시지코드관리 insert Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param reqMap
	 * @매개변수: @return
	 * @매개변수: @throws Exception
	 * @반환값: FwkMap
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	
	public FwkMap insertCodeInfo(Map reqMap) throws Exception {
		FwkMap resultMap = new FwkMap();

		// 사번 임시 처리
		String userId = "system";
		reqMap.put("regntEno", userId);
		reqMap.put("trtrEno", userId);

		resultMap.put("result", codeMapper.insertCodeInfo(reqMap));
		return resultMap;
	}

	/**
	 * @설명: 메시지코드관리 update Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param reqMap
	 * @매개변수: @throws Exception
	 * @반환값: FwkMap
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	
	public FwkMap updateCodeInfo(Map reqMap) throws Exception {
		FwkMap resultMap = new FwkMap();

		// 사번 임시 처리
		String userId = "system";
		reqMap.put("regntEno", userId);
		reqMap.put("trtrEno", userId);

		resultMap.put("result", codeMapper.updateCodeInfo(reqMap));
		return resultMap;
	}

	/**
	 * @설명: 메시지코드관리 delete Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param param
	 * @매개변수: @return
	 * @매개변수: @throws Exception
	 * @반환값: FwkMap
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	
	public FwkMap deleteCodeInfo(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();
		resultMap.put("result", codeMapper.deleteCodeInfo(param));
		return resultMap;
	}

	/**
	 * @설명: 메시지코드관리 그리드에서 요청한 리스트를 저장 Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 22.
	 * @최종변경일:
	 * @매개변수: @param paramList
	 * @매개변수: @throws Exception
	 * @반환값: FwkMap
	 * @개정이력:
	 *        편신범 2021. 1. 22. 최초작성
	 */
	
	public FwkMap saveCodeList(List<Map> paramList) throws Exception {
		FwkMap result = new FwkMap();
		for (Map codeMap : paramList) {
			String status = (String) codeMap.get("status");
			if ("c".equals(status)) {
				result = this.insertCodeInfo(codeMap);
			} else if ("u".equals(status)) {
				result = this.updateCodeInfo(codeMap);
			} else if ("d".equals(status)) {
				result = this.deleteCodeInfo(codeMap);
			}
		}
		return result;
	}

	/**
	 * @설명: 통합메시지기본통계(기간계) 전체 조회 Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 20.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        편신범 2021. 1. 20. 최초작성
	 */
	
	public List<FwkMap> selectCodeStatList(Map param) throws Exception {
		return codeMapper.selectCodeStatList(param);
	}

	/**
	 * @설명: 통합메시지기본통계(기간계) 메시지번호,메시지내용으로 조회 Service Impl
	 * @최초작성자: 편신범
	 * @최초작성일: 2021. 1. 15.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력:
	 *        편신범 2021. 1. 15. 최초작성
	 */
	
	public List<FwkMap> selectCodeStatListByKeywords(Map param) throws Exception {
		return codeMapper.selectCodeStatListByKeywords(param);
	}

}
