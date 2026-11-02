package kr.co.wlife.fac.batch.smp.dd.bean;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisBatchItemWriter;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisBatchItemWriterBuilder;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import kr.co.wlife.fac.batch.smp.dd.vo.BFFACDD01DTO;

import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDD01B02BEAN
 * @설명: [배치 컴포넌트 설정 클래스] BFFACDD01B 배치 Job의 두 번째 스텝에서 사용되는 
 *                ItemReader, ItemProcessor, ItemWriter 및 StepExecutionListener 
 *                빈(Bean)을 정의하는 설정 클래스
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
@Slf4j
@Configuration
public class BFFACDD01B02BEAN {
	
	/**
     * [ItemReader 정의] BFFACDD01B02Read
     * - MyBatisCursorItemReader를 활용하여 데이터베이스에서 과일 소스 데이터를 커서 방식으로 대량 조회
     * 
     * @param sqlSessionFactory MyBatis SQL 세션 팩토리
     * @return MyBatisCursorItemReader 객체
     */
    @Bean
    public MyBatisCursorItemReader<BFFACDD01DTO.selectFruitSourceListVO> BFFACDD01B02Read(SqlSessionFactory sqlSessionFactory) {
        return new MyBatisCursorItemReaderBuilder<BFFACDD01DTO.selectFruitSourceListVO>()
                .sqlSessionFactory(sqlSessionFactory)
                .queryId("kr.co.wlife.fac.batch.smp.dd.mapper.BFFACDD01MAPPER.selectFruitSource")              
                // 일반적인 where 절
                .parameterValues(Map.of("fruitColor", "RED"))

                // 동적 조건절 사용 예 — 조건 중 하나라도 null이면 <if>가 알아서 빠짐
                //.parameterValues(Map.of("fruitColor", "red", "fruitQty", 10))
                // foreach IN절 사용 예
                //.parameterValues(Map.of("ids", List.of("F001", "F002", "F003")))

                .build();
    }

    private static final String STATUS_READY = "READY";
    
    /**
     * [ItemProcessor 정의] BFFACDD01B02Process
     * - 과일 이름이 누락된 데이터는 대상을 필터링(null 반환 시 Writer로 전달되지 않고 스킵 처리)
     * - 샘플용 난수 수량을 생성하고 'READY' 상태의 fruitTargetVO 객체로 변환
     * 
     * @return ItemProcessor 객체
     */
    @Bean
    public ItemProcessor<BFFACDD01DTO.selectFruitSourceListVO, BFFACDD01DTO.fruitTargetVO> BFFACDD01B02Process() {
        return item -> {
            // 수량이 없는 건은 대상에서 제외 (null 반환 = skip, Writer로 전달되지 않음)
            if (item.getFruitName() == null || item.getFruitName().isBlank()) {
                log.warn("[BFFACDD01B02Process] skip: fruitId={}", item.getFruitId());
                return null;
            }

            // 샘플용 난수: 0 이상 1,000,000 미만
            int qty = ThreadLocalRandom.current().nextInt(1_000_000);

            BFFACDD01DTO.fruitTargetVO processed = BFFACDD01DTO.fruitTargetVO.builder()
                    .fruitName(item.getFruitName())
                    .fruitQty(qty)
                    .status(STATUS_READY)
                    .build();

            log.debug("[BFFACDD01B02Process] {} qty {} -> {}", item.getFruitName(), item.getFruitQty(), qty);
            return processed;
        };
    }
    
    /**
     * [ItemWriter 정의] BFFACDD01B02Write
     * - MyBatisBatchItemWriter를 사용하여 가공된 과일 타겟 데이터를 타겟 테이블에 일괄(Batch) 적재
     * 
     * @param sqlSessionFactory MyBatis SQL 세션 팩토리
     * @return MyBatisBatchItemWriter 객체
     */
    @Bean
    public MyBatisBatchItemWriter<BFFACDD01DTO.fruitTargetVO> BFFACDD01B02Write(SqlSessionFactory sqlSessionFactory) {
        return new MyBatisBatchItemWriterBuilder<BFFACDD01DTO.fruitTargetVO>()
                .sqlSessionFactory(sqlSessionFactory)
                .statementId("kr.co.wlife.fac.batch.smp.dd.mapper.BFFACDD01MAPPER.insertFruitTarget")
                .itemToParameterConverter(item -> Map.of("item", item))
                .build();
    }
    
    /**
     * [StepExecutionListener 정의] BFFACDD01B02Listener
     * - Step 실행 전(beforeStep) 시작 로그 출력
     * - Step 실행 후(afterStep) 처리 건수 및 상태를 로깅하고, 쓰기 건수가 0건인 경우 FAILED 상태 처리
     * 
     * @return StepExecutionListener 객체
     */
    @Bean
    public StepExecutionListener BFFACDD01B02Listener() {
        return new StepExecutionListener() {

            @Override
            public void beforeStep(StepExecution stepExecution) {
                log.debug("===== [beforeStep][Another] Step 시작: " + stepExecution.getStepName() + " =====");
            }

            @Override
            public ExitStatus afterStep(StepExecution stepExecution) {
                log.debug("===== [afterStep][Another] Step 종료: " + stepExecution.getStepName() + " =====");
                log.debug("Read Count: " + stepExecution.getReadCount());
                log.debug("Write Count: " + stepExecution.getWriteCount());
                log.debug("Commit Count: " + stepExecution.getCommitCount());
                log.debug("Exit Status: " + stepExecution.getExitStatus());

                if (stepExecution.getWriteCount() == 0) {
                    return ExitStatus.FAILED;
                }
                return stepExecution.getExitStatus();
            }
        };
    }
}