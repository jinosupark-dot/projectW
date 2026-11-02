package kr.co.wllife.acs.online.mg.sy.web;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import jakarta.annotation.Resource;
import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.service.NoticeService;
import lombok.extern.slf4j.Slf4j;
/**
 * @시스템명: IFRS17
 * @업무명: 공지사항관리 
 * @설명: 공지사항관리 컨트롤러
 * @최초작성자: 권세림(61000255)
 * @최초작성일: 2021.02.03 
 * @최종변경일: 
 * @개정이력: 
 *  권세림(61000255) 2021.02.03  최초작성
 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
 */
@Slf4j 
@Controller
@RequestMapping("/mg/sy")
public class NoticeController {

	@Resource(name = "noticeService")
	private NoticeService noticeService;

	/**
	 * @설명: viewMenu 공지사항관리 
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.02.03
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: String
	 * @개정이력: 
	 *  권세림(61000255) 2021.02.03 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	@RequestMapping("/mgsy111m.do")
	public String viewMenu() throws Exception {
		log.debug("==============viewNotice!!!!!!!");
		return "mgsy/mgsy111m";
	}

	/**
	 * @설명: selectNoticeListByInfo 공지사항관리 화면의 공지사항리스트를 상세조회
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.02.03
	 * @최종변경일: 
	 * @매개변수: Map<String, String> reqMap
	 * @반환값: ModelAndView result
	 * @개정이력: 
	 *  권세림(61000255) 2021.02.03 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	@RequestMapping(value = "/mgsy111m/selectNoticeListByInfo.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView selectNoticeListByInfo(@RequestParam Map<String, String> reqMap) throws Exception {

		ModelAndView result = new ModelAndView("jsonView");
		List<FwkMap> list = noticeService.selectNoticeListByInfo(reqMap);

		result.addObject("list", list);
		return result;
	}
	/**
	 * @설명: selectNoticeListByInfo 공지사항관리 화면의 공지사항리스트를 조회
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.02.03
	 * @최종변경일: 
	 * @매개변수: Map<String, String> reqMap
	 * @반환값: ModelAndView result
	 * @개정이력: 
	 *  권세림(61000255) 2021.02.03 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	@RequestMapping(value = "/mgsy111m/selectNoticeList.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView selectNoticeList(@RequestParam Map<String, String> reqMap) throws Exception {

		ModelAndView result = new ModelAndView("jsonView");
		List<FwkMap> list = noticeService.selectNoticeList(reqMap);

		result.addObject("list", list);
		return result;
	}
	
	/**
	 * @설명: insertNotice 공지사항 추가
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.02.03
	 * @최종변경일: 
	 * @매개변수: Map<String, String> reqMap
	 * @반환값: ModelAndView result
	 * @개정이력: 
	 *  권세림(61000255) 2021.02.03 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	@RequestMapping(value = "/mgsy111m/insertNotice.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView insertNotice(@RequestParam Map<String, String> reqMap) throws Exception {
		FwkMap resultMap = noticeService.insertNotice(reqMap); 		
		ModelAndView result = new ModelAndView("jsonView", resultMap);
		return result;
	}
	/**
	 * @설명: updateNotice 공지사항 수정
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.02.03
	 * @최종변경일: 
	 * @매개변수: Map<String, String> reqMap
	 * @반환값: ModelAndView result
	 * @개정이력: 
	 *  권세림(61000255) 2021.02.03 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	@RequestMapping(value = "/mgsy111m/updateNotice.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView updateNotice(@RequestParam Map<String, String> reqMap) throws Exception {
		FwkMap resultMap = noticeService.updateNotice(reqMap); 		
		ModelAndView result = new ModelAndView("jsonView", resultMap);
		return result;
	}
	/**
	 * @설명: deleteNotice 공지사항 삭제
	 * @최초작성자: 권세림(61000255)
	 * @최초작성일: 2021.02.03
	 * @최종변경일: 
	 * @매개변수: Map<String, String> reqMap
	 * @반환값: ModelAndView result
	 * @개정이력: 
	 *  권세림(61000255) 2021.02.03 최초작성
	 *  권세림(61000255) 2021.05.03  2차 소스 표준화 적용
	 */
	@RequestMapping(value = "/mgsy111m/deleteNotice.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView deleteNotice(@RequestParam Map<String, String> reqMap) throws Exception {
		FwkMap resultMap = noticeService.deleteNotice(reqMap); 		
		ModelAndView result = new ModelAndView("jsonView", resultMap);
		return result;
	}

}