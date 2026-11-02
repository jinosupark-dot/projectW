package kr.co.wllife.acs.online.mg.sy.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.mapper.HistoryMapper;
import lombok.extern.slf4j.Slf4j;

/**
 * @시스템명: IFRS17
 * @업무명: 공통
 * @설명: 접근이력 관리 ServiceImpl
 * @최초작성자: 서승호
 * @최초작성일: 2026. 4. 22.
 * @최종변경일:
 * @개정이력:
 *        서승호 2026. 4. 22. 최초작성
 */
@Slf4j
@Service
public class HistoryService{

	private HistoryMapper historyMapper;

	public HistoryService(HistoryMapper historyMapper) {
		this.historyMapper = historyMapper;
	}

	/**
	 * @설명: 접근이력 입력 Service Impl
	 * @최초작성자: 서승호
	 * @최초작성일: 2026. 4. 22.
	 * @최종변경일:
	 * @매개변수: @param reqMap
	 * @매개변수: @return
	 * @매개변수: @throws Exception
	 * @반환값: FwkMap
	 * @개정이력:
	 *        서승호 2026. 4. 22. 최초작성
	 */
	
	public FwkMap insertHistory(Map reqMap) throws Exception {
		FwkMap resultMap = new FwkMap();

		for (Object key : reqMap.keySet()) {
			log.debug("[insert insertHistory] key = {}, value= {}", key, reqMap.get(key));
		}

		resultMap.put("result", historyMapper.insertHistory(reqMap));
		return resultMap;
	}

}
