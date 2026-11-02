package kr.co.wlife.fac.batch.smp.ts.jobs;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import kr.co.wlife.common.batch.builder.CommonBatchBuilders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACTS01B
 * @설명: [배치 Job] 데이터를  타겟 테이블로 일괄 적재하는 배치 Job 설정 클래스
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
public class BFFACTS01B {

    private final CommonBatchBuilders builders;

    private final Tasklet BFFACTS01B01Tasklet;

    /**
     * [Job 정의] BFFACTS01BJob
     * - BFFACTS01B01 스텝을 시작으로 배치 구동
     * 
     * @param BFFACTS01B01 실행할 메인 Step bean
     * @return Job 객체
     */ 
    @Bean
    public Job BFFACTS01BJob(@Qualifier("BFFACTS01B01") Step BFFACTS01B01,
    		JobExecutionListener BFFACTS01JobListener) {
        return builders.jobBuilder("BFFACTS01B")
                .incrementer(new RunIdIncrementer())
                .start(BFFACTS01B01)
                .listener(BFFACTS01JobListener)
                .build();
    }

    /**
     * [Step 정의] BFFACTS01B01
     * - taskletStep 에서 단건등 일괄처리를 위한 STEP
     * 
     * @param
     * @return Step 객체
     */
    @Bean
    public Step BFFACTS01B01() {
        return builders.taskletStepBuilder("BFFACTS01B01", BFFACTS01B01Tasklet)
                .build();
    }

    /**
     * JobExecutionListener 빈 정의 (beforeJob / afterJob)
     */
    @Bean
    public JobExecutionListener BFFACTS01JobListener() {
        return new JobExecutionListener() {
            @Override
            public void beforeJob(JobExecution jobExecution) {
                log.info("===== [beforeJob] Job 시작: {} =====", jobExecution.getJobInstance().getJobName());

                // 1. Job 파라미터 추출
                JobParameters jobParameters = jobExecution.getJobParameters();
                String ancmAtfId = jobParameters.getString("ancmAtfId","A");
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