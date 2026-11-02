package kr.co.wlife.batch.test;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.test.JobLauncherTestUtils;
import org.springframework.batch.test.JobRepositoryTestUtils;
import org.springframework.batch.test.context.SpringBatchTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import kr.co.wlife.SAMPLEBatchApplication;
import kr.co.wlife.fac.batch.smp.dd.jobs.BFFACDD01B;

@SpringBatchTest
@SpringBootTest(classes = {SAMPLEBatchApplication.class, BFFACDD01B.class})
@ActiveProfiles("test")   // 추가
@TestPropertySource(properties = {
    "spring.batch.job.enabled=false",            // 기동 시 자동 실행 방지
 //   "spring.batch.jdbc.initialize-schema=always" // 메타데이터 테이블 부재 시 자동 생성
})
class BFFACDD01BTest {

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @Autowired
    private JobRepositoryTestUtils jobRepositoryTestUtils;
    
    private JobExecution jobExecution;

    // BFFACDD01B에 정의된 Job 빈 주입
    @Autowired
    @Qualifier("BFFACDD01BJob")
    private Job BFFACDD01BJob;

    @BeforeEach
    void setUp() {
        // 테스트할 대상 Job을 JobLauncherTestUtils에 지정
        jobLauncherTestUtils.setJob(BFFACDD01BJob);
    }

    @AfterEach
    void tearDown() {
        // 테스트 후 BATCH_* 메타데이터 실행 이력 정리 (반복 실행 충돌 방지)
//        jobRepositoryTestUtils.removeJobExecution(jobExecution);
    }

    @Test
    @DisplayName("BFFACDD01B 배치 Job 로컬 실행 및 COMPLETED 검증")
    void testBFFACDD01B() throws Exception {
        // 1. JobParameter 생성 (중복 실행 방지용 타임스탬프 포함)
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("requestDate", "20261015")
                .addString("targetDate","20261015")
                .addLong("runTime", System.currentTimeMillis())
                .toJobParameters();

        // 2. Job 실행
        jobExecution = jobLauncherTestUtils.launchJob(jobParameters);

        // 3. 로그 출력
        System.out.println("==================================================");
        System.out.println("Job Name      : " + jobExecution.getJobInstance().getJobName());
        System.out.println("Batch Status  : " + jobExecution.getStatus());
        System.out.println("Exit Status   : " + jobExecution.getExitStatus().getExitCode());
        System.out.println("Execution ID  : " + jobExecution.getId());
        System.out.println("==================================================");

        // 4. 상태 검증
        Assertions.assertEquals(BatchStatus.COMPLETED, jobExecution.getStatus(), "배치 상태가 COMPLETED여야 합니다.");
        Assertions.assertEquals(ExitStatus.COMPLETED, jobExecution.getExitStatus(), "ExitStatus가 COMPLETED여야 합니다.");
    }
}