package kr.co.wlife.fac.batch.smp.df.jobs;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import kr.co.wlife.common.batch.builder.CommonBatchBuilders;
import kr.co.wlife.common.batch.logging.GlobalChunkJsonLogListener;
import kr.co.wlife.fac.batch.smp.df.vo.BFFACDF02DTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDF02B
 * @설명: [배치 Job] 샘플 데이터 파일을 읽어서 (Delimited File)
 *                조건에 맞게 가공한 뒤 파일 출력(Fixed Length File)
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
public class BFFACDF02B {

    private final CommonBatchBuilders builders;
    private int chunkSize = 10;

    /**
     * [Job 정의] BFFACDF02BJob
     * - BFFACDF01B01 스텝을 시작으로 배치 구동
     * 
     * @param BFFACDF02B01 실행할 메인 Step bean
     * @return Job 객체
     */ 
    @Bean
    public Job BFFACDF02BJob(
    		@Qualifier("BFFACDF02B01") Step BFFACDF02B01,
    		@Qualifier("BFFACDF02JobListener") JobExecutionListener BFFACDF02JobListener) {
        return builders.jobBuilder("BFFACDF02B")
                .incrementer(new RunIdIncrementer())
                .start(BFFACDF02B01)
                .listener(BFFACDF02JobListener)
                .build();
    }


    /**
     * [Step 정의] BFFACDF02B01
     * - 청크 지향 처리(Chunk-oriented Processing) 설정 (Chunk Size: 10)
     * - Reader, Processor, Writer 
     * 
     * @param jobRepository Job 메타데이터 저장소
     * @param transactionManager 트랜잭션 관리자
     * @param BFFACDF02B01DFRead 파일 읽기 컴포넌트(Delimited File)
     * @param BFFACDF02B01Process 데이터 가공 컴포넌트
     * @param BFFACDF02B01FFWrite 파일 쓰기 컴포넌트(Fixed Length File)
     * @return Step 객체
     */
    @Bean
    public Step BFFACDF02B01(
            PlatformTransactionManager transactionManager,
            @Qualifier("BFFACDF02B01DFRead") ItemReader<BFFACDF02DTO.fileInputVO> BFFACDF02B01DFRead,
            @Qualifier("BFFACDF02B01Process") ItemProcessor<BFFACDF02DTO.fileInputVO, BFFACDF02DTO.fileOutputVO> BFFACDF02B01Process,
            @Qualifier("BFFACDF02B01FFWrite") ItemWriter<BFFACDF02DTO.fileOutputVO> BFFACDF02B01FFWrite) {

        return builders.stepBuilder("BFFACDF02B01")
                .<BFFACDF02DTO.fileInputVO, BFFACDF02DTO.fileOutputVO>chunk(this.chunkSize, transactionManager)
                .reader(BFFACDF02B01DFRead)
                .processor(BFFACDF02B01Process)
                .writer(BFFACDF02B01FFWrite)
                .listener(new GlobalChunkJsonLogListener())
                .build();
    }

    /**
     * JobExecutionListener 빈 정의 (beforeJob / afterJob)
     */
    @Bean
    public JobExecutionListener BFFACDF02JobListener() {
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