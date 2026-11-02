package kr.co.wlife;

import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.ExitCodeGenerator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@SpringBootApplication
public class SAMPLEBatchApplication {

    public static void main(String[] args) {
        System.exit(SpringApplication.exit(SpringApplication.run(SAMPLEBatchApplication.class, args))); // thread 처리
    }

    private final AtomicInteger exitCode = new AtomicInteger(0);

    // Job 결과를 종료코드로 반영
    @Bean
    public ExitCodeGenerator jobExitCodeGenerator() {
        return exitCode::get;
    }

    // parameter 같아도 재실행 강제
    @Bean
    @Profile("!test") // <-- 테스트 환경(test 프로필 등)에서는 이 빈을 생성하지 않음
    public ApplicationRunner jobRunner(JobLauncher jobLauncher,
                                       List<Job> jobs,
                                       @Value("${spring.batch.job.name:}") String jobName) {
        System.out.println("MAIN 20261015 14:38 - always forced doing with even same parameter");
        return args -> {
            Job job = jobs.stream()
                    .filter(j -> j.getName().equals(jobName))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobName));

            JobParametersBuilder builder = new JobParametersBuilder()
                    .addLong("time_for_retriable", System.currentTimeMillis());

            // --targetDate=20261001 형태의 옵션 인자를 JobParameter로 변환
//            for (String name : args.getOptionNames()) {
//                if (name.startsWith("spring.")) continue;   // Spring 설정 제외
//                builder.addString(name, args.getOptionValues(name).get(0));
//            }

            // targetDate=20261001 형태의 파라미터
            for (String arg : args.getNonOptionArgs()) {
                int idx = arg.indexOf('=');
                if (idx > 0) {
                    builder.addString(arg.substring(0, idx), arg.substring(idx + 1));
                }
            }

            //JobExecution execution = jobLauncher.run(job, params);
            JobExecution execution = jobLauncher.run(job, builder.toJobParameters());
            if (execution.getStatus() != BatchStatus.COMPLETED) {
                throw new IllegalStateException("Job failed: " + execution.getStatus());
            }
        };
    }
}