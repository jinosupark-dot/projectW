package kr.co.wlife.fac.batch.smp.dd.bean;

import kr.co.wlife.common.batch.logging.QueryContext;
import kr.co.wlife.fac.batch.smp.dd.vo.BFFACDD01DTO;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisBatchItemWriter;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisBatchItemWriterBuilder;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDD01B01BEAN
 * @설명: [배치 컴포넌트 설정 클래스] BFFACDD01B 배치 Job의 Step에서 사용되는 
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
public class BFFACDD01B01BEAN {
	
	/**
     * [ItemReader 정의] BFFACDD01B01Read
     * - MyBatisCursorItemReader를 활용하여 데이터베이스에서 데이터를 커서 방식으로 대량 조회
     * 
     * @param sqlSessionFactory MyBatis SQL 세션 팩토리
     * @return MyBatisCursorItemReader 객체
     */
    @Bean
    public MyBatisCursorItemReader<BFFACDD01DTO.selectTest01ListVO> BFFACDD01B01Read(SqlSessionFactory sqlSessionFactory) {
        return new MyBatisCursorItemReaderBuilder<BFFACDD01DTO.selectTest01ListVO>()
                .sqlSessionFactory(sqlSessionFactory)
                .queryId("kr.co.wlife.fac.batch.smp.dd.mapper.BFFACDD01MAPPER.selectTest01List")
                .build();
    }
    
    /**
     * [ItemProcessor 정의] BFFACDD01B01Process
     * - 읽어온 데이터의 col1 값을 대문자로 변환하고, 쿼리 수행 시간(소요 시간)을 로깅 및 측정
     * 
     * @return ItemProcessor 객체
     */
    @Bean
    public ItemProcessor<BFFACDD01DTO.selectTest01ListVO, BFFACDD01DTO.selectTest01ListVO> BFFACDD01B01Process() {
        return item -> {
            BFFACDD01DTO.selectTest01ListVO processed = new BFFACDD01DTO.selectTest01ListVO(item.getCol1().toUpperCase());
            log.debug("Processing: {} -> {}", item.getCol1(), processed.getCol1());

            Long sqlDuration = QueryContext.getExecutionTime();
            log.debug("SELECT sqlDuration : " + sqlDuration + " ms");

            return processed;
        };
    }
    
    /**
     * [ItemWriter 정의] BFFACDD01B01Write
     * - MyBatisBatchItemWriter를 사용하여 가공된 데이터를 타겟 테이블에 일괄(Batch) 적재
     * 
     * @param sqlSessionFactory MyBatis SQL 세션 팩토리
     * @return MyBatisBatchItemWriter 객체
     */
    @Bean
    public MyBatisBatchItemWriter<BFFACDD01DTO.selectTest01ListVO> BFFACDD01B01Write(SqlSessionFactory sqlSessionFactory) {
        return new MyBatisBatchItemWriterBuilder<BFFACDD01DTO.selectTest01ListVO>()
                .sqlSessionFactory(sqlSessionFactory)
                .statementId("kr.co.wlife.fac.batch.smp.dd.mapper.BFFACDD01MAPPER.insertTestItem")
                .itemToParameterConverter(item -> Map.of("item", item))
                .build();
    }
    
    /**
     * [StepExecutionListener 정의] BFFACDD01B01Listener
     * - Step 실행 전(beforeStep) 필수 파라미터(targetDate) 검증 및 시작 시간 기록
     * - Step 실행 후(afterStep) 처리 건수 및 소요 시간 로깅, 쓰기 건수가 0건인 경우 FAILED 상태 처리
     * 
     * @return StepExecutionListener 객체
     */
    @Bean
    public StepExecutionListener BFFACDD01B01Listener() {
        return new StepExecutionListener() {

            @Override
            public void beforeStep(StepExecution stepExecution) {
                log.debug("===== [beforeStep] Step 시작: " + stepExecution.getStepName() + " =====");
                stepExecution.getExecutionContext().putLong("startTime", System.currentTimeMillis());

                JobParameters params = stepExecution.getJobParameters();
                String targetDate = params.getString("targetDate");

                if (targetDate == null) {
                    throw new IllegalArgumentException("targetDate 파라미터는 필수입니다.");
                }
            }

            @Override
            public ExitStatus afterStep(StepExecution stepExecution) {
                log.debug("===== [afterStep] Step 종료: " + stepExecution.getStepName() + " =====");
                log.debug("Read Count: " + stepExecution.getReadCount());
                log.debug("Write Count: " + stepExecution.getWriteCount());
                log.debug("Commit Count: " + stepExecution.getCommitCount());
                log.debug("Exit Status: " + stepExecution.getExitStatus());

                long start = stepExecution.getExecutionContext().getLong("startTime");
                log.info("afterStep 소요시간: {}ms", System.currentTimeMillis() - start);

                if (stepExecution.getWriteCount() == 0) {
                    return ExitStatus.FAILED;
                }
                return stepExecution.getExitStatus();
            }
        };
    }
}