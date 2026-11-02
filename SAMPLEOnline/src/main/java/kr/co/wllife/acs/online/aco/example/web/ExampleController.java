package kr.co.wllife.acs.online.aco.example.web;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import kr.co.wllife.acs.online.aco.example.service.ExampleService;
import kr.co.wllife.acs.online.aco.example.vo.ExampleDTO;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @시스템명: Online
 * @업무명: 공통
 * @설명: 예제 화면 관련 처리를 담당한다.
 * @최초작성자: 장창환
 * @최초작성일: 2026. 10. 26
 * @최종변경일: 2026. 10. 26
 * @개정이력:
 *        김종호 2026. 10. 26. 최초작성
 */
@Slf4j
@Controller
@RequestMapping("/example")
public class ExampleController {
	private final ExampleService exampleService;

	/**
	 * 
	 * @설명: ExampleController 생성자, 생성자 주입 방식으로 ExampleService를 주입받는다.
	 * @최초작성자: 김종호
	 * @최초작성일: 2026. 10. 26.
	 * @최종변경일: 2026. 10. 26.
	 * @매개변수: exampleService
	 * @반환값: 없음
	 * @개정이력:
	 *        김종호 2026. 10. 26. 최초 생성
	 */
	public ExampleController(ExampleService exampleService) {
		this.exampleService = exampleService;
	}

	/**
	 * 
	 * @설명: 예제화면 /example.do 호출
	 * @최초작성자: 김종호
	 * @최초작성일: 2026. 10. 26.
	 * @최종변경일: 2026. 10. 26.
	 * @매개변수: 없음
	 * @반환값: String
	 * @개정이력:
	 *        김종호 2026. 10. 26. 최초작성
	 */
	@GetMapping("/example.do")
	public String index(Model model) {
		model.addAttribute("message", "Spring Boot 3.5 + JSP 연동 성공!");
		return "example/index"; // /WEB-INF/views/index.jsp 로 뷰 맵핑
	}

	/**
	 * 
	 * @설명: 예제 조회화면
	 * @최초작성자: 김종호
	 * @최초작성일: 2026. 10. 26.
	 * @최종변경일: 2026. 10. 26.
	 * @매개변수: 없음
	 * @반환값: String
	 * @개정이력:
	 *        김종호 2026. 10. 26. 최초작성
	 */
	@RequestMapping("/gridSample.do")
	public String viewGridList() throws Exception {
		log.debug("=====call gridSmaple.do!!!!!!!!!!!");
		return "example/vw_grid_list";
	}

	/**
	 * 
	 * @설명: 예제 멀티헤더 조회화면
	 * @최초작성자: 김종호
	 * @최초작성일: 2026. 10. 26.
	 * @최종변경일: 2026. 10. 26.
	 * @매개변수: 없음
	 * @반환값: String
	 * @개정이력:
	 *        김종호 2026. 10. 26. 최초작성
	 */
	@RequestMapping("/gridSample_multiheader.do")
	public String viewGridList_multiheader() throws Exception {
		log.debug("=====call gridSample_multiheader.do!!!!!!!!!!!");
		return "example/vw_grid_list_multiheader";
	}

	/**
	 * 
	 * @설명: 예제 그리드 수정, 검증, item템플릿 관련 조회화면
	 * @최초작성자: 김종호
	 * @최초작성일: 2026. 10. 26.
	 * @최종변경일: 2026. 10. 26.
	 * @매개변수: 없음
	 * @반환값: String
	 * @개정이력:
	 *        김종호 2026. 10. 26. 최초작성
	 */
	@RequestMapping("/gridSample_gridEdit.do")
	public String viewGridList_gridEdit() throws Exception {
		log.debug("=====call viewGridList_gridEdit.do!!!!!!!!!!!");
		return "example/vw_grid_list_gridEdit";
	}

	/**
	 * @설명: 예제 그리드 조회
	 * @최초작성자: 김종호
	 * @최초작성일: 2026. 10. 26.
	 * @최종변경일: 2026. 10. 26.
	 * @매개변수: 없음
	 * @매개변수: @throws Exception
	 * @반환값: ModelAndView
	 * @개정이력:
	 *        김종호 2026. 10. 26. EgovMap -> ExampleDTO.selectListVO로 변경
	 */
	@RequestMapping("/selectList.do")
	@ResponseBody
	public ModelAndView selectGridList(@RequestParam Map<String, Object> reqMap) throws Exception {
		ModelAndView result = new ModelAndView("jsonView");
		List<ExampleDTO.selectListVO> list = exampleService.selectList(reqMap);
		result.addObject("dataList", list);
		return result;
	}

	// @RequestMapping("/selectList2.do")
	// @ResponseBody
	// public ModelAndView selectGridList2(@RequestParam Map<String, String> reqMap) throws Exception {
	// 	// String param1 = reqMap.get("param1");
	// 	// String param2 = reqMap.get("param2");

	// 	// SQL injection check Case1 : reqMap을 체크
	// 	SQLChecker.checkValid(reqMap);

	// 	// SQL injection check Case2 : 개별 컬럼만 별도 체크 - UntyMsgNo, untyMsgCntnt를 key로 받는다
	// 	String param1 = (String) reqMap.get("param1");
	// 	String param2 = (String) reqMap.get("param2");
	// 	SQLChecker.checkValid(param1);
	// 	SQLChecker.checkValid(param2);

	// 	ModelAndView result = new ModelAndView("jsonView");
	// 	// List list = exampleService.selectList(reqMap); // js에서 ajax통신 -> sql 조회한
	// 	// data가 list형태로 들어옴.
	// 	// 테스트용 데이터
	// 	List<ExampleVO> list = new ArrayList<>();
	// 	for (int i = 0; i < 100; i++) {
	// 		ExampleVO vo = new ExampleVO();
	// 		vo.setAncmNtfId("ID_" + i);
	// 		// vo.setCodeType("0" + (i % 10));
	// 		vo.setTitl("공지사항제목_" + i);
	// 		vo.setCont("공지사항내용입니다." + i);
	// 		vo.setIqcnt(i + "");
	// 		vo.setIpdtm("");
	// 		vo.setInppCd("testdata");

	// 		list.add(vo);
	// 	}

	// 	result.addObject("dataList", list);
	// 	return result;
	// }
}
