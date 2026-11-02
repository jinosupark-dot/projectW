package kr.co.wlife.fac.batch.smp.df.jobs;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import kr.co.wlife.common.batch.builder.CommonBatchBuilders;
import kr.co.wlife.fac.batch.smp.df.vo.BFFACDF03DTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDF03B
 * @설명: [배치 Job] 샘플 데이터 파일을 읽어서 (Fixed Length File)
 *                조건에 맞게 가공한 뒤 DB 저장
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
public class BFFACDF03B {

    private final CommonBatchBuilders builders;
    private int chunkSize = 10;

    /**
     * [Job 정의] BFFACDF03BJob
     * - BFFACDF03B01 스텝을 시작으로 배치 구동
     * 
     * @param BFFACDF03B01 실행할 메인 Step bean
     * @param BFFACDF03JobListener 실행할 메인 JobListener bean
     * @return Job 객체
     */ 
    @Bean
    public Job BFFACDF03BJob(
    		@Qualifier("BFFACDF03B01") Step BFFACDF03B01,
    		@Qualifier("BFFACDF03JobListener")  JobExecutionListener BFFACDF03JobListener) {
        return builders.jobBuilder("BFFACDF03B")
                .incrementer(new RunIdIncrementer())
                .start(BFFACDF03B01)
                .listener(BFFACDF03JobListener)
                .build();
    }


    /**
     * [Step 정의] BFFACDF03B01
     * - 청크 지향 처리(Chunk-oriented Processing) 설정 (Chunk Size: 10)
     * - Reader, Processor, Writer 
     * 
     * @param transactionManager 트랜잭션 관리자
     * @param BFFACDF03B01FFRead 파일 읽기 컴포넌트(Fixed Length File)
     * @param BFFACDF03B01Process 데이터 가공 컴포넌트
     * @param BFFACDF03B01Write DB insert
     * @return Step 객체
     */
    @Bean
    public Step BFFACDF03B01(
            PlatformTransactionManager transactionManager,
            @Qualifier("BFFACDF03B01FFRead") ItemReader<BFFACDF03DTO.fileInputVO> BFFACDF03B01FFRead,
            @Qualifier("BFFACDF03B01Process") ItemProcessor<BFFACDF03DTO.fileInputVO, BFFACDF03DTO.insertTBPSB0016InfoVO> BFFACDF03B01Process,
            @Qualifier("BFFACDF03B01Write") ItemWriter<BFFACDF03DTO.insertTBPSB0016InfoVO> BFFACDF03B01Write) {

        return builders.stepBuilder("BFFACDF03B01")
                .<BFFACDF03DTO.fileInputVO, BFFACDF03DTO.insertTBPSB0016InfoVO>chunk(this.chunkSize, transactionManager)
                .reader(BFFACDF03B01FFRead)
                .processor(BFFACDF03B01Process)
                .writer(BFFACDF03B01Write)
                .build();
    }

    /**
     * JobExecutionListener 빈 정의 (beforeJob / afterJob)
     */
    @Bean
    public JobExecutionListener BFFACDF03JobListener() {
        return new JobExecutionListener() {
            @Override
            public void beforeJob(JobExecution jobExecution) {
                log.info("===== [beforeJob] Job 시작: {} =====", jobExecution.getJobInstance().getJobName());
                JobParameters jobParameters = jobExecution.getJobParameters();
                String ancmAtfId = jobParameters.getString("ancmAtfId");
                
                var jobContext = jobExecution.getExecutionContext();
                jobContext.put("sharedAncmAtfId", ancmAtfId);
                jobContext.put("jobStartTime", System.currentTimeMillis());
                
                log.info("▶ [JobExecutionContext] ancmAtfId 저장 완료: {}", ancmAtfId);
            }

            @Override
            public void afterJob(JobExecution jobExecution) {
                log.info("===== [afterJob] Job 종료 (Status: {}) =====", jobExecution.getStatus());
                var jobContext = jobExecution.getExecutionContext();
                long startTime = jobContext.getLong("jobStartTime", 0L);
                if (startTime > 0) {
                    log.info("▶ Job 총 소요 시간: {}ms", System.currentTimeMillis() - startTime);
                }
            }
        };
    }
}