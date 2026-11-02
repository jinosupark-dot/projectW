package kr.co.wllife.acs.online.aco.example.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.co.wllife.acs.online.aco.example.mapper.ExampleMapper;
import kr.co.wllife.acs.online.aco.example.vo.ExampleDTO;

/**
 * @시스템명: IFRS17
 * @업무명: 공통
 * @설명: 예제 Service, Interface를 따로 만들지 않는다.
 * @최초작성자: 김종호
 * @최초작성일: 2026. 10. 26.
 * @최종변경일: 2026. 10. 26.
 * @개정이력:
 *        김종호 2026. 10. 26. 최초작성
 */
@Service
public class ExampleService {
    private final ExampleMapper exampleMapper;

    /**
     * 
     * @설명: ExampleService 생성자, 생성자 주입 방식으로 ExampleMapper를 주입받는다.
     * @최초작성자: 김종호
     * @최초작성일: 2026. 10. 26.
     * @최종변경일: 2026. 10. 26.
     * @매개변수: exampleMapper
     * @반환값: 없음
     * @개정이력:
     *        김종호 2026. 10. 26. 최초 생성
     */
    public ExampleService(ExampleMapper exampleMapper) {
        this.exampleMapper = exampleMapper;
    }

    /**
     * @설명: 예제 데이터 조회
     * @최초작성자: 김종호
     * @최초작성일: 2026. 10. 26.
     * @최종변경일: 2026. 10. 26.
     * @매개변수: paramMap
     * @반환값: List<ExampleDTO.selectListVO>
     * @개정이력:
     *        김종호 2026. 10. 26. 최초작성
     */
    public List<ExampleDTO.selectListVO> selectList(Map<String, Object> paramMap) {
        return exampleMapper.selectList(paramMap);
    }

}
