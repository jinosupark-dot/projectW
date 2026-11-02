package kr.co.wllife.acs.online.mg.sy.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;

/**
 * @시스템명: IFRS17
 * @업무명: MGSY 시스템관리 - 공지사항관리 매퍼
 * @설명: 
 * @최초작성자: 권세림(61000255)
 * @최초작성일: 2021.02.03
 * @최종변경일: 
 * @개정이력: 
 *  권세림(61000255) 2021.02.03 최초작성
 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
 */
@Mapper
public interface NoticeMapper {
	/**
	 * @설명: CRUD of TB_IMGSYF07(공지사항 기본)
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.02.03
	 * @최종변경일: 
	 * @매개변수: Map param
	 * @반환값: 
	 * @개정이력: 
	 *  권세림(61000255) 2021.02.03 최초작성
     *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	List<FwkMap> selectNoticeListByInfo(Map param) throws Exception; 
	List<FwkMap> selectNoticeList(Map param) throws Exception; 
	Integer insertNotice(Map param) throws Exception; 
	Integer updateNotice(Map param) throws Exception; 
	Integer deleteNotice(Map param) throws Exception; 
}

