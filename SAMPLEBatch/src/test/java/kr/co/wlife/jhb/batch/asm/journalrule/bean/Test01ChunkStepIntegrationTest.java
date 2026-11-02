package kr.co.wlife.jhb.batch.asm.journalrule.bean;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.test.JobLauncherTestUtils;
import org.springframework.batch.test.context.SpringBatchTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * TEST01BEAN(Reader/Processor/Writer/Step) 통합 테스트
 * - 실제 DB 기본 프로파일)를 그대로 사용
 * - t_test1(원본), t_test2(적재 대상) 테이블 기준
 */
@SpringBatchTest
@SpringBootTest
class Test01ChunkStepIntegrationTest {

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @Autowired
    private ApplicationContext context;


    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        // 컨텍스트에 Job이 여러 개 있을 수 있으므로 테스트 대상 Job을 명시적으로 지정
        Job testChunkJob = context.getBean("testChunkJob", Job.class);
        jobLauncherTestUtils.setJob(testChunkJob);

        // 이전 테스트 실행으로 남아있을 수 있는 잔여 데이터 정리
        jdbcTemplate.update("DELETE FROM t_test2");
    }

    @AfterEach
    void tearDown() {
        // 테스트가 실제 DB에 남긴 데이터 정리 (운영/개발 DB 오염 방지)
        jdbcTemplate.update("DELETE FROM t_test2");
    }

    @Test
    void testChunkJob_전체_실행_성공() throws Exception {
        // given
        // t_test1 원본 데이터 기준 건수를 미리 파악 (검증에 사용)
        Integer sourceCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM t_test1", Integer.class);

        JobParameters jobParameters = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis()) // 매 실행마다 다른 JobInstance로 인식시키기 위함
                .toJobParameters();

        // when
        JobExecution jobExecution = jobLauncherTestUtils.launchJob(jobParameters);

        // then - Job 상태 검증
        assertThat(jobExecution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        assertThat(jobExecution.getExitStatus().getExitCode()).isEqualTo("COMPLETED");

        // then - Step 처리 건수 검증 (읽은 만큼 썼는지)
        StepExecution stepExecution = jobExecution.getStepExecutions().iterator().next();
        assertThat(stepExecution.getStepName()).isEqualTo("testChunkStep");
        assertThat(stepExecution.getReadCount()).isEqualTo(sourceCount);
        assertThat(stepExecution.getWriteCount()).isEqualTo(sourceCount);
        assertThat(stepExecution.getReadSkipCount()).isZero();
        assertThat(stepExecution.getWriteSkipCount()).isZero();

        // then - 실제 t_test2 테이블에 적재된 데이터 검증
        Integer resultCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM t_test2", Integer.class);
        assertThat(resultCount).isEqualTo(sourceCount);

        // then - processor에서 upperCase 처리가 실제로 적용됐는지 검증
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT col1 FROM t_test2");
        assertThat(rows)
                .extracting(row -> (String) row.get("col1"))
                .allMatch(col1 -> col1.equals(col1.toUpperCase()));
    }

    @Test
    void testChunkStep_단독_실행() {
        // when - Step만 단독으로 실행
        JobExecution jobExecution = jobLauncherTestUtils.launchStep("testChunkStep");

        // then
        assertThat(jobExecution.getStepExecutions())
                .allMatch(step -> step.getExitStatus().getExitCode().equals("COMPLETED"));
    }
}