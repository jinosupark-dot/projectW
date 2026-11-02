package kr.co.wlife.fac.batch.smp.df.jobs;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import kr.co.wlife.common.batch.builder.CommonBatchBuilders;
import kr.co.wlife.fac.batch.smp.df.vo.BFFACDF01DTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDF01B
 * @설명: [배치 Job] 공지사항/샘플 데이터 테이블을 조회하여 
 *                조건에 맞게 가공한 뒤 파일 출력(Delimited File)
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class BFFACDF01B {

    private final CommonBatchBuilders builders; // for CommonLogging 공통로그
    private int chunkSize = 10;

    /**
     * [Job 정의] BFFACDF01BJob
     * - BFFACDF01B01 스텝을 시작으로 배치 구동
     * 
     * @param BFFACDD02B01 실행할 메인 Step bean
     * @return Job 객체
     */ 
    @Bean
    public Job BFFACDF01BJob(
    		@Qualifier("BFFACDF01B01") Step BFFACDF01B01,
    		@Qualifier("BFFACDF01JobListener") JobExecutionListener BFFACDF01JobListener) {  
        return builders.jobBuilder("BFFACDF01B")  
                .incrementer(new RunIdIncrementer())  
                .start(BFFACDF01B01)  
                //.listener(BFFACDF01JobListener)  // JobListener 등록 예시
                .build();  
    }
    
    /**
     * [Step 정의] BFFACDF01B01
     * - 청크 지향 처리(Chunk-oriented Processing) 설정 (Chunk Size: 10)
     * - Reader, Processor, Writer 및 공통 로깅 리스너, 커스텀 리스너 등록
     * 
     * @param transactionManager 트랜잭션 관리자
     * @param BFFACDF01B01Read 데이터 읽기 컴포넌트
     * @param BFFACDF01B01Process 데이터 가공 컴포넌트
     * @param BFFACDF01B01DFWrite 파일 쓰기 컴포넌트(Delimited File)
     * @return Step 객체
     * @param BFFACDD02B01Listener Step 리스너
     */
    @Bean
    public Step BFFACDF01B01(
            PlatformTransactionManager transactionManager,  
            @Qualifier("BFFACDF01B01Read") ItemReader<BFFACDF01DTO.selectSample01ListVO> BFFACDF01B01Read,  
            @Qualifier("BFFACDF01B01Process") ItemProcessor<BFFACDF01DTO.selectSample01ListVO, BFFACDF01DTO.selectSample02ListVO> BFFACDF01B01Process,  
            @Qualifier("BFFACDF01B01DFWrite") ItemWriter<BFFACDF01DTO.selectSample02ListVO> BFFACDF01B01DFWrite,  
            @Qualifier("BFFACDF01B01Listener") StepExecutionListener BFFACDF01B01Listener) {  
  
        return builders.stepBuilder("BFFACDF01B01")  
                .<BFFACDF01DTO.selectSample01ListVO, BFFACDF01DTO.selectSample02ListVO>chunk(this.chunkSize, transactionManager)  
                .reader(BFFACDF01B01Read)  
                .processor(BFFACDF01B01Process)  
                .writer(BFFACDF01B01DFWrite)  
                .listener(BFFACDF01B01Listener)  
                .build();  
    }


    /**
     * JobExecutionListener 빈 정의 (beforeJob / afterJob)
     */
    @Bean
    public JobExecutionListener BFFACDF01JobListener() {
        return new JobExecutionListener() {
            @Override
            public void beforeJob(JobExecution jobExecution) {
                log.info("===== [beforeJob] Job 시작: {} =====", jobExecution.getJobInstance().getJobName());

                // 1. Job 파라미터 추출
                JobParameters jobParameters = jobExecution.getJobParameters();
                String ancmAtfId = jobParameters.getString("ancmAtfId");
                // 2. JobExecution의 ExecutionContext 가져오기
                var jobContext = jobExecution.getExecutionContext();

                // 3. ExecutionContext에 필요한 데이터 저장 (Job 내 모든 Step에서 공유 가능)
                jobContext.put("sharedAncmAtfId", ancmAtfId);
                jobContext.put("jobStartTime", System.currentTimeMillis());

                log.info("▶ [JobExecutionContext] ancmAtfId 저장 완료: {}", ancmAtfId);
            }

            @Override
            public void afterJob(JobExecution jobExecution) {
                log.info("===== [afterJob] Job 종료 (Status: {}) =====", jobExecution.getStatus());

                // 저장된 ExecutionContext 값 조회 예시
                var jobContext = jobExecution.getExecutionContext();
                long startTime = jobContext.getLong("jobStartTime", 0L);
                if (startTime > 0) {
                    log.info("▶ Job 총 소요 시간: {}ms", System.currentTimeMillis() - startTime);
                }
            }
        };
    }
}