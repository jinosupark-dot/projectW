package kr.co.wlife.batch.test;

import java.io.File;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.test.JobLauncherTestUtils;
import org.springframework.batch.test.context.SpringBatchTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import kr.co.wlife.SAMPLEBatchApplication;
import kr.co.wlife.fac.batch.smp.df.bean.BFFACDF01B01BEAN;
import kr.co.wlife.fac.batch.smp.df.jobs.BFFACDF01B;

/**
 * BFFACDF01B Job 통합 테스트
 * - DB에서 데이터를 읽어 가공한 뒤 구분자 파일로 정상 출력되는지 검증
 */
@SpringBatchTest
@SpringBootTest(classes = {SAMPLEBatchApplication.class, BFFACDF01B.class, BFFACDF01B01BEAN.class})
@ActiveProfiles("test")   // 추가
@TestPropertySource(properties = {
    "spring.batch.job.enabled=false",            // 기동 시 자동 실행 방지
 //   "spring.batch.jdbc.initialize-schema=always" // 메타데이터 테이블 부재 시 자동 생성
})
class BFFACDF01BTest {

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;
    // BFFACDD02B에 정의된 Job 빈 주입
    @Autowired
    @Qualifier("BFFACDF01BJob")
    private Job BFFACDF01BJob;
    
    // 테스트용 임시 파일 경로
    private final String testOutputPath = "./output/BFFACDF01_test_result.txt";

    @BeforeEach
    void setUp() {
        // 테스트 대상 Job 명시적 주입
        jobLauncherTestUtils.setJob(BFFACDF01BJob);

        // 테스트 시작 전 기존 결과 파일이 있다면 삭제
        File file = new File(testOutputPath);
        if (file.exists()) {
            file.delete();
        }
    }

    @AfterEach
    void tearDown() {
        // 테스트 종료 후 생성된 파일 정리 (선택사항)
//        File file = new File(testOutputPath);
//        if (file.exists()) {
//            file.delete();
//        }
    }

    @Test
    void testBFFACDF01B() throws Exception {
        // given - Job 파라미터 설정 (필수 ancmAtfId 및 테스트용 파일 경로 지정)
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("ancmAtfId", "A") // 조회 조건 파라미터
                .addString("outputFilePath", testOutputPath) // 파일 출력 경로 파라미터
                .addLong("time", System.currentTimeMillis()) // 중복 실행 방지용 타임스탬프
                .toJobParameters();

        // when - Job 실행
        JobExecution jobExecution = jobLauncherTestUtils.launchJob(jobParameters);
    }
}