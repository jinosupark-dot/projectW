package kr.co.wlife.batch.test;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.test.JobLauncherTestUtils;
import org.springframework.batch.test.context.SpringBatchTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBatchTest
//@SpringBootTest(classes = {SAMPLEBatchApplication.class, BFFACTS01B.class})
@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.batch.job.enabled=false",            // 기동 시 자동 실행 방지
})
class BFFACTS01BTest {
//java -jar target/SAMPLEBatch-0.0.1-SNAPSHOT.jar --spring.batch.job.name=BFFACTS01B targetDate=20261001 schdBtchId=schdBtchId1 2>&1 | tee me.log
    // 1. 실행할 jobId + "Job" 이름을 문자열 변수로 관리
    String jobId = "BFFACTS01BJob";// Job class내 jobBuilder 메소드명
    
	@Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @Autowired
    private ApplicationContext applicationContext; // 스프링 컨텍스트 주입

    @Test
    void testBatchJob() throws Exception {

        // 2. ApplicationContext를 통해 런타임에 동적으로 Job 빈 가져오기
        Job dynamicJob = applicationContext.getBean(jobId, Job.class);
        jobLauncherTestUtils.setJob(dynamicJob);

        // 3. Job 실행 및 실행 결과(ID 등)를 변수에 담기
        JobParameters jobParameters = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();

        JobExecution jobExecution = jobLauncherTestUtils.launchJob(jobParameters);

        // 4. 잡 아이디(Execution ID)를 변수에 담아 활용
        Long jobExecutionId = jobExecution.getId();
        String jobName = jobExecution.getJobInstance().getJobName();

        System.out.println("실행된 Job 이름: " + jobName);
        System.out.println("실행된 Job Execution ID: " + jobExecutionId);
        
        assertThat(jobExecution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
    }
}