package kr.co.wlife.batch.test;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.BatchStatus;
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
import kr.co.wlife.fac.batch.smp.df.bean.BFFACDF03B01BEAN;
import kr.co.wlife.fac.batch.smp.df.jobs.BFFACDF03B;

import java.io.File;
import java.nio.file.Files;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * BFFACDF03B Job 통합 테스트
 * - 고정 길이 파일을 읽어 DB(TBPSB0016)에 정상적으로 인서트되는지 검증
 */
@SpringBatchTest
@SpringBootTest(classes = {
    SAMPLEBatchApplication.class, 
    BFFACDF03B.class, 
    BFFACDF03B01BEAN.class
})
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.batch.job.enabled=false"
})
class BFFACDF03BTest {

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @Autowired
    @Qualifier("BFFACDF03BJob")
    private Job BFFACDF03BJob;
    
    // 테스트용 입력 파일 경로 (Reader가 읽어갈 파일)
    private final String testInputPath = "./output/BFFACDF02_fixed_result.txt";//BFFACDF02_fixed_result.txt

    @BeforeEach
    void setUp() throws Exception {
        // 테스트 대상 Job 명시적 주입
        jobLauncherTestUtils.setJob(BFFACDF03BJob);

        // 1. output 디렉토리 생성
        File dir = new File("./output");
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 2. 테스트용 고정 길이 샘플 입력 파일 생성 (Range 규격에 맞춘 포맷)
        // Range: 1~15(ancmNtfId), 16~45(titl), 46~95(cont), 96~105(iqCnt), 106~115(inppCd)
        File inputFile = new File(testInputPath);
        if (!inputFile.exists()) {
        
            String sampleLine = String.format("%-15s%-30s%-50s%010d%-20s%n", 
                    "A111011094", "TITL 111011094", "계약조건:CONT 111011094", 1800L, "INPP_CD");
            Files.writeString(inputFile.toPath(), sampleLine);
//            sampleLine = String.format("%-15s%-30s%-50s%010d%-10s%n", 
//                    "A111011094", "TITL 111011094", "계약조건:CONT 111011094", 1800L, "INPP_CD");
            Files.writeString(inputFile.toPath(), sampleLine);
        }
    }

    @AfterEach
    void tearDown() {
        // 테스트 종료 후 생성된 파일 정리가 필요할 경우 주석 해제
        // File file = new File(testInputPath);
        // if (file.exists()) {
        //     file.delete();
        // }
    }

    @Test
    void testBFFACDF03B() throws Exception {
        // given - Job 파라미터 설정
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("ancmAtfId", "A")
//                .addString("inputFilePath", testInputPath)
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();

        // when - Job 실행
        JobExecution jobExecution = jobLauncherTestUtils.launchJob(jobParameters);

        // then - Job 실행 결과 상태 검증 (COMPLETED 여부 확인)
        assertThat(jobExecution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
    }
}