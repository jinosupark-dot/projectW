package kr.co.wllife.acs.online.mg.sy.web;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.wllife.acs.online.fwk.com.cmm.exception.Warning;
import kr.co.wllife.acs.online.fwk.com.cmm.util.FwkProperties;
import kr.co.wllife.acs.online.fwk.com.cmm.util.MessageUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.SessionUtil;
import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.service.MenuService;
import kr.co.wllife.acs.online.mg.sy.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @시스템명: IFRS17
 * @업무명: 공통
 * @설명: 메인 화면 관련 처리를 담당한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30
 * @최종변경일: 2020. 12. 30
 * @개정이력:
 *        장창환 2020. 12. 30. 최초작성
 */
@Slf4j
@Controller
public class MainController {

	private final MenuService menuService;

	/**
	 * 
	 * @설명: MainController 생성자
	 * @최초작성자: 김종호
	 * @최초작성일: 2026. 10. 26.
	 * @최종변경일: 2026. 10. 26.
	 * @매개변수: menuService
	 * @반환값: 없음
	 * @개정이력:
	 *        김종호 2026. 10. 26. 생성자 주입
	 */
	public MainController(MenuService menuService) {
		this.menuService = menuService;
	}

	/**
	 * 
	 * @설명: 메인화면 호출
	 * @최초작성자: 장창환
	 * @최초작성일: 2026. 10. 26.
	 * @최종변경일: 2026. 10. 26.
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        김종호 2026. 10. 26. 최초작성
	 */
	@GetMapping("/")
	public String index() {
		return "redirect:/main.do";
	}

	/**
	 * 
	 * @설명: 메인화면 호출
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 30.
	 * @최종변경일: 2020. 12. 30.
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        장창환 2020. 12. 30. 최초작성
	 */
	@RequestMapping("/main.do")
	public String main(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		log.debug("Call Main!!!");
		return "main";
	}

	/**
	 * 
	 * @설명: 사용자 권한 메뉴 호출
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 30.
	 * @최종변경일: 2020. 12. 30.
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        장창환 2020. 12. 30. 최초작성
	 */
	@RequestMapping(value = "/main/selectMenuListByAuth.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView selectMenuList(@RequestParam Map<String, String> reqMap) throws Exception {

		ModelAndView result = new ModelAndView("jsonView");
		List<FwkMap> list = menuService.selectMenuListByAuth(reqMap);
		result.addObject("list", list);
		return result;
	}

	/**
	 * 
	 * @설명: 시스템 정보 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 30.
	 * @최종변경일: 2020. 12. 30.
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        장창환 2020. 12. 30. 최초작성
	 */
	@RequestMapping(value = "/main/selectSystemInfo.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView selectSystemInfo(@RequestParam Map<String, String> reqMap) throws Exception {

		ModelAndView result = new ModelAndView("jsonView");

		UserInfoVO vo = SessionUtil.getUserInfo();

		// 사용자 정보
		result.addObject("userInfo", vo);

		// 설정정보
		result.addObject("properties", FwkProperties.getProperties());

		// 메시지 정보
		Map<String, String> msgMap = MessageUtil.getInstance().getMessageAll();
		result.addObject("message", msgMap);

		// 메뉴 정보
		List<FwkMap> list = menuService.selectMenuListByAuth(reqMap);
		result.addObject("menuList", list);

		return result;
	}

	/**
	 * 
	 * @설명: 메시지리스트 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 30.
	 * @최종변경일: 2020. 12. 30.
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        장창환 2020. 12. 30. 최초작성
	 */
	@RequestMapping(value = "/main/selectMsgList.do", method = { RequestMethod.POST, RequestMethod.GET })
	@ResponseBody
	public ModelAndView selectMsgList(@RequestParam Map<String, String> reqMap) throws Exception {

		Map<String, String> msgMap = MessageUtil.getInstance().getMessageAll();
		ModelAndView result = new ModelAndView("jsonView", msgMap);
		return result;
	}

	/**
	 * 
	 * @설명: 404 에러화면을 리턴한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 30.
	 * @최종변경일: 2020. 12. 30.
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        장창환 2020. 12. 30. 최초작성
	 */
	@RequestMapping("/error/view404Error.do")
	public String select404ErrorInfoList(HttpServletRequest request, Model model) throws Exception {
		return "error/vw_404Error_form";
	}

	/**
	 * 
	 * @설명: 500 에러화면을 리턴한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 30.
	 * @최종변경일: 2020. 12. 30.
	 * @매개변수:
	 * @반환값: String
	 * @개정이력:
	 *        장창환 2020. 12. 30. 최초작성
	 */
	@RequestMapping("/error/view500Error.do")
	public String select500ErrorInfoList(HttpServletRequest request, Model model) throws Exception {
		return "error/vw_500Error_form";
	}

	@RequestMapping(value = "/main/warnnignTest.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView warnnignTest(@RequestParam Map<String, String> reqMap) throws Exception {

		log.debug("=======warnningTest!!!");
		throw new Warning("ECIS004"); // 입력된 기준일자가 없습니다. 확인 후 다시 처리하세요.
	}

	@RequestMapping(value = "/main/warnnignTestParam.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView warnnignTestParam(@RequestParam Map<String, String> reqMap) throws Exception {

		log.debug("=======warnningTest!!!");
		// {0}을(를) 입력해 주십시오.
		throw new Warning("ECIU105", "통합메시지번호 항목에 입력된 값이 없습니다. 통합메세지번호"); // 통합메시지번호 항목에 입력된 값이 없습니다. 통합메세지번호을(를) 입력해
																			// 주십시오.
	}

	@RequestMapping(value = "/main/exceptionTest.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView exceptionTest(@RequestParam Map<String, String> reqMap) throws Exception {

		log.debug("=======exceptionTest!!!");
		throw new Exception("예외가 발생하였습니다.");
	}

}