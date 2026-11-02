package kr.co.wlife.fac.batch.smp.dd.bean;

import kr.co.wlife.fac.batch.smp.dd.vo.BFFACDD02DTO;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisBatchItemWriter;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisBatchItemWriterBuilder;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDD02B01BEAN
 * @설명: 배치 컴포넌트 설정 클래스] BFFACDD02B 배치 Job의 Step에서 사용되는 
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
public class BFFACDD02B01BEAN {
	
	/**
     * [ItemReader 정의] BFFACDD02B01Read
     * - @StepScope를 적용하여 Step 실행 시점에 빈이 생성되도록 설정
     * - StepExecution에서 ancmAtfId Job 파라미터를 추출하여(기본값 "A") MyBatis 커서 리더 쿼리에 전달
     * 
     * @param sqlSessionFactory MyBatis SQL 세션 팩토리
     * @param stepExecution 스텝 실행 컨텍스트 (Job 파라미터 추출용)
     * @return MyBatisCursorItemReader 객체
     */
    @Bean
    @StepScope // 1. Step 실행 시점에 빈이 생성되도록 설정 (필수)
    public MyBatisCursorItemReader<BFFACDD02DTO.selectSample01ListVO> BFFACDD02B01Read(
    		SqlSessionFactory sqlSessionFactory, 
    		@Value("#{stepExecution}") StepExecution stepExecution) {
    	
    	String ancmAtfId = stepExecution.getJobParameters().getString("ancmAtfId", "A");
    	
        return new MyBatisCursorItemReaderBuilder<BFFACDD02DTO.selectSample01ListVO>()
                .sqlSessionFactory(sqlSessionFactory)
                .queryId("kr.co.wlife.fac.batch.smp.dd.mapper.BFFACDD02MAPPER.selectSample01List")
                .parameterValues(Map.of("ancmAtfId",ancmAtfId))
                .build();
    }
    
    /**
     * [ItemProcessor 정의] BFFACDD02B01Process
     * - selectSample01ListVO 데이터를 읽어와 selectSample02ListVO 타겟 객체로 변환
     * - cont 필드가 "CONT"로 시작하는 경우 iqCnt를 2배로 곱하고, 아닐 경우 0으로 처리
     * - cont 문자열 앞에 "계약조건:" 접두사 추가
     * 
     * @return ItemProcessor 객체
     */
    @Bean
    public ItemProcessor<BFFACDD02DTO.selectSample01ListVO, BFFACDD02DTO.selectSample02ListVO> BFFACDD02B01Process() {
        return item -> {
        	BFFACDD02DTO.selectSample02ListVO target = new BFFACDD02DTO.selectSample02ListVO();
        	target.setAncmNtfId(item.getAncmNtfId());
        	target.setCont("계약조건:" + item.getCont());
            target.setInppCd(item.getInppCd());
            
        	if(item.getCont().startsWith("CONT")) {
        		target.setIqCnt(item.getIqCnt() * 2);
        	} else { 
        		target.setIqCnt(0);
        	}
        	
            target.setTitl(item.getTitl());
        	return target;
        };
    }
    
    /**
     * [ItemWriter 정의] BFFACDD02B01Write
     * - MyBatisBatchItemWriter를 사용하여 가공된 데이터를 타겟 테이블에 일괄(Batch) 적재
     * - 내부적으로 JDBC의 addBatch() / executeBatch() 기능을 활용하여 고속 일괄 처리 수행
     * 
     * @param sqlSessionFactory MyBatis SQL 세션 팩토리
     * @return MyBatisBatchItemWriter 객체
     */
    @Bean
    public MyBatisBatchItemWriter<BFFACDD02DTO.selectSample02ListVO> BFFACDD02B01Write(SqlSessionFactory sqlSessionFactory) {
    	//내부적으로 JDBC의 addBatch() / executeBatch() 기능을 활용. 네트워크를 매번 타지 않고 한 번에 묶어서 DB로 전송합니다.
        return new MyBatisBatchItemWriterBuilder<BFFACDD02DTO.selectSample02ListVO>()
                .sqlSessionFactory(sqlSessionFactory)
                .statementId("kr.co.wlife.fac.batch.smp.dd.mapper.BFFACDD02MAPPER.insertSample02Info")
                .itemToParameterConverter(item -> Map.of("item", item))
                .build();
    }
    
    /**
     * [StepExecutionListener 정의] BFFACDD02B01Listener
     * - Step 실행 전(beforeStep) 시작 로그 출력, 실행 시작 시간 기록, 필수 파라미터(ancmAtfId) 검증
     * - Step 실행 후(afterStep) 종료 상태 반환
     * 
     * @return StepExecutionListener 객체
     */
    @Bean
    public StepExecutionListener BFFACDD02B01Listener() {
        return new StepExecutionListener() {

            @Override
            public void beforeStep(StepExecution stepExecution) {
                log.debug("===== [beforeStep] Step 시작: " + stepExecution.getStepName() + " =====");
                stepExecution.getExecutionContext().putLong("startTime", System.currentTimeMillis());

                JobParameters params = stepExecution.getJobParameters();
                String ancmAtfId = params.getString("ancmAtfId");

                if (ancmAtfId == null) {
                    throw new IllegalArgumentException("ancmAtfId 파라미터는 필수입니다.");
                }
            }

            @Override
            public ExitStatus afterStep(StepExecution stepExecution) {
                return stepExecution.getExitStatus();
            }
        };
    }
}