package kr.co.wllife.acs.online.mg.sy.service;

import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import kr.co.wllife.acs.online.fwk.com.cmm.exception.Warning;
import kr.co.wllife.acs.online.fwk.com.cmm.util.DateUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.SessionUtil;
import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.mapper.NoticeMapper;
import kr.co.wllife.acs.online.mg.sy.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;

/**
 * @시스템명: IFRS17
 * @업무명: MGSY 시스템관리 - 공지사항 관리
 * @설명: 
 * @최초작성자: 권세림(61000255)
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @개정이력: 
 *  권세림(61000255) 2021.02.03 최초작성
 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
 *  황석현(61000280) 2021.11.19 에러 알림메시지 코드 수정
 */
@Slf4j 
@Service
public class NoticeService {

	private final NoticeMapper noticeMapper;

	public NoticeService(NoticeMapper noticeMapper) {
		this.noticeMapper = noticeMapper;
	}

	/**
	 * @설명: selectNoticeListByInfo : TB_IMGSYF07(공지사항 기본)에서  등록된 공지사항 리스트를 게시일자로 상세하게 SELECT하는  ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.02.03
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.02.03 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
     *  황석현(61000280) 2021.11.19 에러 알림메시지 코드 수정
	 */
	
	public List<FwkMap> selectNoticeListByInfo(Map param) throws Exception {
		List<FwkMap> result = null;
			String anucStrYmd = (String)param.get("anucStrYmd");			//TO 게시일자
			String anucStrYmd2 = (String)param.get("anucStrYmd2");			//FROM 게시일자
			
			if (DateUtil.compareDate(anucStrYmd, anucStrYmd2) > 0) {
				throw new Warning("EBLU553");
			}
		try {
			result = noticeMapper.selectNoticeListByInfo(param);
		} catch (DataAccessException e) {
			throw new Warning("ESFU011", "공지사항");
		} catch (Exception e) {
			throw new Warning("ESFU011", "공지사항");
		}
		return result;
	}

	/**
	 * @설명: selectNoticeList : TB_IMGSYF07(공지사항 기본)에서  등록된 공지사항 리스트를  SELECT하는  ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.02.03
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: List<FwkMap> result
	 * @개정이력: 
	 *  권세림(61000255) 2021.02.03 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public List<FwkMap> selectNoticeList(Map param) throws Exception {
		List<FwkMap> result = null;
		try {
			result = noticeMapper.selectNoticeList(param);
		} catch (DataAccessException e) {
			throw new Warning("ESFU011", "공지사항");
		} catch (Exception e) {
			throw new Warning("ESFU011", "공지사항");
		}
		return result;
	}

	
	/**
	 * @설명: insertNotice : TB_IMGSYF07(공지사항 기본)에 reqMap의 데이터를  INSERT하는 ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.02.03
	 * @최종변경일: 
	 * @매개변수: Map reqMap
	 * @반환값: List<FwkMap> resultMap
	 * @개정이력: 
	 *  권세림(61000255) 2021.02.03 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public FwkMap insertNotice(Map reqMap) throws Exception {
		FwkMap resultMap = new FwkMap();

		UserInfoVO vo = SessionUtil.getUserInfo();
		log.debug("userInfoVO:" + vo.toString());
		String userId = vo.getUserEno();
		reqMap.put("trtrEno", userId);
		
		try {	
			String anucStrYmd = (String) reqMap.get("anucStrYmd");			//게시시작날짜
			String anucEndYmd = "";											//게시종료날짜
			String avlPrd = (String) reqMap.get("avlPrd");					//유효기간
			
			/**
			 * 게시 시작일과 게시기간을 계산해 게시 종료일자를 param값에 추가한다.
			 * */
			switch(avlPrd){
			case "09" :
				anucEndYmd = "99991231";
				break;
			case "1M" :
				anucEndYmd = DateUtil.getDate(2, anucStrYmd,1);
				break;
			case "3M" :
				anucEndYmd = DateUtil.getDate(2, anucStrYmd,3);
				break;
			case "6M" :
				anucEndYmd = DateUtil.getDate(2, anucStrYmd,6);
				break;
			case "1Y" :
				anucEndYmd = DateUtil.getDate(3, anucStrYmd,1);
				break;
			default : 
				throw new Warning("ESFU009", "공지사항");
			}

			reqMap.put("anucEndYmd", anucEndYmd);						// 게시 종료일자 put
			
			resultMap.put("result", noticeMapper.insertNotice(reqMap));
			
		} catch (DuplicateKeyException e) {// 추가 삭제시
			throw new Warning("ECSU204", "공지사항ID");
		} catch (DataAccessException e) {
			throw new Warning("ESFU009", "공지사항");
		} catch (Exception e) {
			throw new Warning("ESFU009", "공지사항");
		}
		return resultMap;
	}
	
	 /**
		 * @설명: updateNotice : TB_IMGSYF07(공지사항 기본)에  reqMap의 데이터를 UPDATE하는 ServiceImpl
		 * @최초작성자: 권세림(61000255)
		 * @최초작성일: 2021.02.03
		 * @최종변경일: 
		 * @매개변수: Map reqMap
		 * @반환값: List<FwkMap> resultMap
		 * @개정이력: 
		 *  권세림(61000255) 2021.02.03 최초작성
	     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
		 */
	
	public FwkMap updateNotice(Map reqMap) throws Exception {
		FwkMap resultMap = new FwkMap();

		UserInfoVO vo = SessionUtil.getUserInfo();
		log.debug("userInfoVO:" + vo.toString());
		String userId = vo.getUserEno();
		reqMap.put("trtrEno", userId);

		try {
			String anucStrYmd = (String) reqMap.get("anucStrYmd");			//게시시작날짜
			String anucEndYmd = "";											//게시종료날짜
			String avlPrd = (String) reqMap.get("avlPrd");					//유효기간
			
			/**
			 * 게시 시작일과 게시기간을 계산해 게시 종료일자를 param값에 추가한다.
			 * */
			switch(avlPrd){
			case "09" :
				anucEndYmd = "99991231";
				break;
			case "1M" :
				anucEndYmd = DateUtil.getDate(2, anucStrYmd,1);
				break;
			case "3M" :
				anucEndYmd = DateUtil.getDate(2, anucStrYmd,3);
				break;
			case "6M" :
				anucEndYmd = DateUtil.getDate(2, anucStrYmd,6);
				break;
			case "1Y" :
				anucEndYmd = DateUtil.getDate(3, anucStrYmd,1);
				break;
			default : 
				throw new Warning("ESFU009", "공지사항");
			}
			reqMap.put("anucEndYmd", anucEndYmd);
			
			resultMap.put("result", noticeMapper.updateNotice(reqMap));
		} catch (DuplicateKeyException e) {// 추가 삭제시
			throw new Warning("ECSU204", "공지사항ID");
		} catch (DataAccessException e) {
			throw new Warning("ESFU010", "공지사항");
		} catch (Exception e) {
			throw new Warning("ESFU010", "공지사항");
		}
		return resultMap;
	}
	
	/**
	 * @설명: deleteNotice : TB_IMGSYF07(공지사항 기본)에  SNO를 Key로  DELETE하는 ServiceImpl
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.02.03
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: FwkMap resultMap
	 * @개정이력: 
	 *  권세림(61000255) 2021.02.03 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	
	public FwkMap deleteNotice(Map param) throws Exception {
		FwkMap resultMap = new FwkMap();
		try {
			resultMap.put("result", noticeMapper.deleteNotice(param));
		} catch (DataAccessException e) {
			throw new Warning("ESFU012", "공지사항");
		} catch (Exception e) {
			throw new Warning("ESFU012", "공지사항");
		}
		return resultMap;
	}
}
