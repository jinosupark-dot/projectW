package kr.co.wllife.acs.online.mg.sy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import kr.co.wllife.acs.online.fwk.com.cmm.exception.Warning;
import kr.co.wllife.acs.online.fwk.com.cmm.util.SessionUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.StringUtil;
import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.mapper.BatchMapper;
import kr.co.wllife.acs.online.mg.sy.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;

/**
 * @시스템명: IFRS17
 * @업무명:
 * @설명: 배치 및 파라미터를 조회하는 ServiceImpl
 * @최초작성자: 김동현
 * @최초작성일: 2021. 03. 08.
 * @최종변경일:
 * @개정이력: 
 * 김동현 2021. 03. 08. 최초작성
 * 서승호 2023. 06. 28. 수정작성
 */
@Slf4j 
@Service
public class BatchService {
	private final BatchMapper batchMapper;

	public BatchService(BatchMapper batchMapper) {
		this.batchMapper = batchMapper;
	}

	/**
	 * @설명: 배치 리스트를 조회한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 08.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 08. 최초작성
	 */
	public List<FwkMap> selectBatchList(Map param) throws Exception {
		List<FwkMap> result = null;
		result = batchMapper.selectBatchList(param);

		return result;
	}

	/**
	 * @설명: 배치 파라미터를 조회한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 08.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 08. 최초작성
	 */
	public List<FwkMap> selectBatchParamList(Map param) throws Exception {
		List<FwkMap> result = null;
		result = batchMapper.selectBatchParamList(param);

		return result;
	}

	/**
	 * @설명: 배치관리(mgsy914m) - 배치 리스트를 조회한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 11.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 11. 최초작성
	 */
	public List<FwkMap> selectMngBatchList(Map param) throws Exception {
		List<FwkMap> result = null;
		result = batchMapper.selectMngBatchList(param);

		return result;
	}

	/**
	 * @설명: 배치관리(mgsy914m) - 배치 파라미터 리스트를 조회한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 11.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 11. 최초작성
	 */
	public List<FwkMap> selectMngParamList(Map param) throws Exception {
		List<FwkMap> result = null;
		result = batchMapper.selectMngParamList(param);

		return result;
	}

	/**
	 * @설명: 업무구분코드를 조회한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 11.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 11. 최초작성
	 */
	public List<FwkMap> selectCdcValtList(Map param) throws Exception {
		List<FwkMap> result = null;
		result = batchMapper.selectCdcValtList(param);

		return result;
	}

	/**
	 * @설명: 입력값으로 배치 리스트를 조회한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 11.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 11. 최초작성
	 */
	public List<FwkMap> selectBatchListbyData(Map param) throws Exception {
		List<FwkMap> result = null;
		result = batchMapper.selectBatchListbyData(param);

		return result;
	}

	/**
	 * @설명: 배치 그리드 데이터를 저장한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 12.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 12. 최초작성
	 */
	public FwkMap saveBatchGridList(List<Map> paramList) throws Exception {
		FwkMap result = new FwkMap();
		Map<String, String> param = new HashMap<String, String>();

		/* List<FwkMap> originList = this.selectBatchList(param); */
		param.put("key", "value");

		System.out.println("로그 테스트");

		for (Map map : paramList) {
			// System.out.println(m);
			// System.out.println(m.get("batId"));

			String status = (String) map.get("status");

			if ("c".equals(status)) {
				log.debug("saveBatchGridList map : [" + map.toString() + "]");
				result = this.insertBatchGridInfo(map);

			} else if ("u".equals(status)) {
				result = this.updateBatchGridInfo(map);
			} else if ("d".equals(status)) {
				result = this.deleteBatchGridInfo(map);
			}
		}

		log.debug("saveBatchGridList result : [" + result + "]");
		return result;
	}

	/**
	 * @설명: 배치 관리 그리드에 insert한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 12.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 12. 최초작성
	 */
	public FwkMap insertBatchGridInfo(Map reqMap) throws Exception {

		FwkMap resultMap = new FwkMap();
		UserInfoVO userInfoVO = SessionUtil.getUserInfo(); // 사용자 VO
		String userEno = userInfoVO.getUserEno(); // 사용자사번

		reqMap.put("regntEno", userEno);
		reqMap.put("trtrEno", userEno);

		try {
			String batId = (String) reqMap.get("batId");
			String batNm = (String) reqMap.get("batNm");
			String batExpln = (String) reqMap.get("batExpln");
			String busnScCd = (String) reqMap.get("busnScCd");
			String useYn = (String) reqMap.get("useYn");

			log.debug("batId 	: [" + batId + "]");
			log.debug("batNm 	: [" + batNm + "]");
			log.debug("batExpln 	: [" + batExpln + "]");
			log.debug("busnScCd 	: [" + busnScCd + "]");
			log.debug("useYn 	: [" + useYn + "]");

			resultMap.put("result", batchMapper.insertBatchGridInfo(reqMap));

		} catch (DuplicateKeyException e) {// 추가 삭제시
			throw new Warning("ECSU204", "ID");
		} catch (DataAccessException e) {
			throw new Warning("ECSU204", "insertBatchGridInfo DataAccess");
		} catch (Exception e) {
			throw new Warning("ECSU204", "insertBatchGridInfo Exception");
		}

		log.debug("insertBatchGridInfo resultMap : [" + resultMap + "]");

		return resultMap;
	}

	/**
	 * @설명: 배치 관리 그리드에 update한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 12.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 12. 최초작성
	 */
	public FwkMap updateBatchGridInfo(Map reqMap) throws Exception {

		FwkMap resultMap = new FwkMap();
		UserInfoVO userInfoVO = SessionUtil.getUserInfo(); // 사용자 VO
		String userEno = userInfoVO.getUserEno(); // 사용자사번

		reqMap.put("regntEno", userEno);
		reqMap.put("trtrEno", userEno);
		
		log.debug("reqMap 	: [" + reqMap + "]");

		try {
			String pgmId = (String) reqMap.get("pgmId");
			String batId = (String) reqMap.get("batId");
			String batNm = (String) reqMap.get("batNm");
			String batExpln = (String) reqMap.get("batExpln");
			String busnScCd = (String) reqMap.get("busnScCd");
			String useYn = (String) reqMap.get("useYn");

			log.debug("pgmId 	: [" + pgmId + "]");
			log.debug("batId 	: [" + batId + "]");
			log.debug("batNm 	: [" + batNm + "]");
			log.debug("batExpln 	: [" + batExpln + "]");
			log.debug("busnScCd 	: [" + busnScCd + "]");
			log.debug("useYn 	: [" + useYn + "]");

			resultMap.put("result", batchMapper.updateBatchGridInfo(reqMap));

		} catch (DuplicateKeyException e) {// 추가 삭제시
			throw new Warning("ECSU204", "Activity ID");
		} catch (DataAccessException e) {
			throw new Warning("ECSU204", "updateBatchGridInfo DataAccess");
		} catch (Exception e) {
			throw new Warning("ECSU204", "updateBatchGridInfo Exception");
		}

		log.debug("updateBatchGridInfo resultMap : [" + resultMap + "]");

		return resultMap;
	}

	/**
	 * @설명: 배치 관리 그리드에 delete한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 12.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 12. 최초작성
	 */
	public FwkMap deleteBatchGridInfo(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();

		try {
			//
			/*batchMapper.deleteParamGridInfo(param);*/
			//batchId로 다 지움
			
			resultMap.put("result", batchMapper.deleteBatchGridInfo(param));
			
		} catch (DataAccessException e) {
			throw new Warning("ESFU010", "deleteBatchGridInfo DataAccess");
		} catch (Exception e) {
			throw new Warning("ESFU010", "deleteBatchGridInfo Exception");
		}

		log.debug("deleteBatchGridInfo resultMap : [" + resultMap + "]");

		return resultMap;
		
		
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * @설명: 파라미터 그리드 데이터를 저장한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 15.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 15. 최초작성
	 */
	public FwkMap saveParamGridList(List<Map> paramList) throws Exception {
		FwkMap result = new FwkMap();
		Map<String, String> param = new HashMap<String, String>();

		param.put("key", "value");

		for (Map map : paramList) {
			// System.out.println(m);
			// System.out.println(m.get("batId"));
			log.debug("saveParamGridList map : [" + map.toString() + "]");
			String status = (String) map.get("status");

			if ("c".equals(status)) {
				
				result = this.insertParamGridInfo(map);

			} else if ("u".equals(status)) {
				result = this.updateParamGridInfo(map);
			} else if ("d".equals(status)) {
				result = this.deleteParamGridInfo(map);
			}
		}

		log.debug("saveParamGridList result : [" + result + "]");
		return result;
	}
	
	/**
	 * @설명: 파라미터 관리 그리드에 insert한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 15.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 15. 최초작성
	 */
	public FwkMap insertParamGridInfo(Map reqMap) throws Exception {

		FwkMap resultMap = new FwkMap();
		UserInfoVO userInfoVO = SessionUtil.getUserInfo(); // 사용자 VO
		String userEno = userInfoVO.getUserEno(); // 사용자사번

		reqMap.put("regntEno", userEno);
		reqMap.put("trtrEno", userEno);
		
		log.debug("reqMap 	!!!!		: [" + reqMap + "]");
		/*resultMap.put("result", batchMapper.insertParamGridInfo(reqMap));*/
		
		log.debug("userEno 			: [" + userEno + "]");
		log.debug("trtrEno 			: [" + userEno + "]");
		
		try {
			String pgmId = (String) reqMap.get("pgmId");
			String batId = (String) reqMap.get("batId");
			String inptPrmtrId = (String) reqMap.get("inptPrmtrId");
			String inptPrmtrNm = (String) reqMap.get("inptPrmtrNm");
			String inptPrmtrExpln = (String) reqMap.get("inptPrmtrExpln");
			String inptPrmtrTypCd = (String) reqMap.get("inptPrmtrTypCd");
			Integer prmtrInptSeq = Integer.parseInt((String) reqMap.get("prmtrInptSeq"));
			String useYn = (String) reqMap.get("useYn");
			
			log.debug("pgmId 			: [" + pgmId + "]");
			log.debug("batId 			: [" + batId + "]");
			log.debug("inptPrmtrId 		: [" + inptPrmtrId + "]");
			log.debug("inptPrmtrNm 		: [" + inptPrmtrNm + "]");
			log.debug("inptPrmtrExpln 	: [" + inptPrmtrExpln + "]");
			log.debug("inptPrmtrTypCd 	: [" + inptPrmtrTypCd + "]");
			log.debug("prmtrInptSeq 		: [" + prmtrInptSeq + "]");
			log.debug("useYn 			: [" + useYn + "]");

			resultMap.put("result", batchMapper.insertParamGridInfo(reqMap));

		}catch (DuplicateKeyException e) {// 추가 삭제시
			throw new Warning("ECSU204", "파라미터ID");
		} catch (DataAccessException e) {
			throw new Warning("ECSU204", "insertParamGridInfo DataAccess");
		} catch (Exception e) {
			throw new Warning("ECSU204", "insertParamGridInfo Exception");
		}

		log.debug("insertParamGridInfo resultMap : [" + resultMap + "]");

		return resultMap;
	}
	
	/**
	 * @설명: 파라미터 관리 그리드에 update한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 15.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 15. 최초작성
	 */
	public FwkMap updateParamGridInfo(Map reqMap) throws Exception {

		FwkMap resultMap = new FwkMap();
		UserInfoVO userInfoVO = SessionUtil.getUserInfo(); // 사용자 VO
		String userEno = userInfoVO.getUserEno(); // 사용자사번

		reqMap.put("regntEno", userEno);
		reqMap.put("trtrEno", userEno);

		try {
			String pgmId = (String) reqMap.get("pgmId");
			String itmId = (String) reqMap.get("itmId");
			String batId = (String) reqMap.get("batId");
			String inptPrmtrId = (String) reqMap.get("inptPrmtrId");
			String inptPrmtrNm = (String) reqMap.get("inptPrmtrNm");
			String inptPrmtrExpln = (String) reqMap.get("inptPrmtrExpln");
			String inptPrmtrTypCd = (String) reqMap.get("inptPrmtrTypCd");
			/*Integer prmtrInptSeq = Integer.parseInt((String) reqMap.get("prmtrInptSeq"));*/
			String useYn = (String) reqMap.get("useYn");
			
			log.debug("pgmId 			: [" + pgmId + "]");
			log.debug("itmId 			: [" + itmId + "]");
			log.debug("batId 			: [" + batId + "]");
			log.debug("inptPrmtrId 		: [" + inptPrmtrId + "]");
			log.debug("inptPrmtrNm 		: [" + inptPrmtrNm + "]");
			log.debug("inptPrmtrExpln 	: [" + inptPrmtrExpln + "]");
			log.debug("inptPrmtrTypCd 	: [" + inptPrmtrTypCd + "]");
			/*logger.debug("prmtrInptSeq 		: [" + prmtrInptSeq + "]");*/
			log.debug("useYn 			: [" + useYn + "]");

			resultMap.put("result", batchMapper.updateParamGridInfo(reqMap));

		} catch (DuplicateKeyException e) {// 추가 삭제시
			throw new Warning("ECSU204", "파라미터ID");
		} catch (DataAccessException e) {
			throw new Warning("ECSU204", "updateParamGridInfo DataAccess");
		} catch (Exception e) {
			throw new Warning("ECSU204", "updateParamGridInfo Exception");
		}

		log.debug("updateParamGridInfo resultMap : [" + resultMap + "]");

		return resultMap;
	}

	/**
	 * @설명: 파라미터 관리 그리드에 delete한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 12.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 12. 최초작성
	 */
	public FwkMap deleteParamGridInfo(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();

		try {
			resultMap.put("result", batchMapper.deleteParamGridInfo(param));
		} catch (DataAccessException e) {
			throw new Warning("ESFU010", "deleteParamGridInfo DataAccess");
		} catch (Exception e) {
			throw new Warning("ESFU010", "deleteParamGridInfo Exception");
		}

		log.debug("deleteParamGridInfo resultMap : [" + resultMap + "]");

		return resultMap;
	}
	
	/**
	 * @설명: 파라미터 관리 그리드에 delete한다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 03. 12.
	 * @최종변경일:
	 * @매개변수: param
	 * @반환값: List<FwkMap>
	 * @개정이력: 김동현 2021. 03. 12. 최초작성
	 */
	public FwkMap selectWrkexBatchChk(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();
		String batchId = StringUtil.trim((String)param.get("batchId"));
		
		try {
			
			if("BTIEART020".equals(batchId)){
				int errCnt = batchMapper.chkGlBrkdnCocntCd(param);
				if(errCnt > 0){
					resultMap.put("errCnt", errCnt);
					resultMap.put("errMsg", "부서그룹에 미등록된 코스트센터코드가 존재합니다(IFRS17)"); //ECIU143
					return resultMap;
				}
				errCnt = batchMapper.chkGlBrkdnFnctDmnCd(param);
				if(errCnt > 0){
					resultMap.put("errCnt", errCnt);
					resultMap.put("errMsg", "등록된 통합코드가 존재하지 않습니다."); //ECSU568
					return resultMap;
				}
				
			}else if("BTIEART022".equals(batchId)){
				int errCnt = batchMapper.chkRmvlDistAmt01(param);
				if(errCnt > 0){
					resultMap.put("errCnt", errCnt);
					resultMap.put("errMsg", "금액 오류입니다."); //EBLU859
					return resultMap;
				}
				
			}else if("BTIEART023".equals(batchId)){
				int errCnt = batchMapper.chkRmvlDistAmt02(param);
				if(errCnt > 0){
					resultMap.put("errCnt", errCnt);
					resultMap.put("errMsg", "금액 오류입니다."); //EBLU859
					return resultMap;
				}
				
			}else if("BTIEART024".equals(batchId) || "BTIEART025".equals(batchId)){
				int errCnt = batchMapper.chkRmvlDistAmt03(param);
				if(errCnt > 0){
					resultMap.put("errCnt", errCnt);
					resultMap.put("errMsg", "금액 오류입니다."); //EBLU859
					return resultMap;
				}
				
			}else if("BTIEART026".equals(batchId)){
				int errCnt = batchMapper.chkRmvlDistAmt04(param);
				if(errCnt > 0){
					resultMap.put("errCnt", errCnt);
					resultMap.put("errMsg", "금액 오류입니다."); //EBLU859
					return resultMap;
				}
				
			}else if("BTIEART033".equals(batchId)){
				int errCnt = batchMapper.chkRmvlDistAmt03(param);	
				if(errCnt > 0){
					resultMap.put("errCnt", errCnt);
					resultMap.put("errMsg", "금액 오류입니다."); //EBLU859
					return resultMap;
				}
				
			}else if("BTIEADV001".equals(batchId)){
				int errCnt = batchMapper.chkGlBrkdnPotflscCd(param);
				if(errCnt > 0){
					resultMap.put("errCnt", errCnt);
					resultMap.put("errMsg", "비정상 포트폴리오코드가 계약별정보내역에 존재합니다."); //ECIU140
					return resultMap;
				}
				errCnt = batchMapper.chkRalWrkexEqualsContno(param);	
				if(errCnt > 0){
					resultMap.put("errCnt", errCnt);
					resultMap.put("errMsg", "동일 계약번호에 다른 채널코드존재하는 에러입니다."); //ECIU142
					return resultMap;
				}
			}
			
		} catch (DataAccessException e) {
			throw new Warning("ESFU010", "selectWrkexBatchChk DataAccess");
		} catch (Exception e) {
			throw new Warning("ESFU010", "selectWrkexBatchChk Exception");
		}

		log.debug("selectWrkexBatchChk resultMap : [" + resultMap + "]");

		return resultMap;
	}
}
