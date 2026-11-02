package kr.co.wlife.fac.batch.smp.pt.jobs;

import org.mybatis.spring.batch.MyBatisBatchItemWriter;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.partition.support.Partitioner;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.transaction.PlatformTransactionManager;

import kr.co.wlife.common.batch.builder.CommonBatchBuilders;
import kr.co.wlife.fac.batch.smp.pt.vo.BFFACPT01DTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACPT01B
 * @설명: Partitioner와 Worker Step을 조합하여 전체 배치 잡과 Manager Step, TaskExecutor를 정의하는 메인 설정 클래스
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
public class BFFACPT01B {
    private final CommonBatchBuilders builders;

    /** 파티션(스레드) 수 */
    private static final int GRID_SIZE = 4;
    private static final int chunkSize = 10;

    /**
     * [Job 정의] BFFACPT01BJob
     * - BFFACPT01B01MS Manager 스텝을 시작으로 배치 구동
     * 
     * @param BFFACPT01B01MS 실행할 메인 Step bean
     * @return Job 객체
     */ 
    @Bean
    public Job BFFACPT01BJob(@Qualifier("BFFACPT01B01MS") Step BFFACPT01B01MS) {
        return builders.jobBuilder("BFFACPT01B")
                .start(BFFACPT01B01MS)
                .incrementer(new RunIdIncrementer())
                .build();
    }

    /**
     * [Step 정의] BFFACPT01B01MS
     * - Manager Step : 파티션 생성 + 병렬 실행
     * 
     * @param BFFACPT01B01PT Partitioner Step
     * @param BFFACPT01B01 병렬 STEP 정의
     * @param BFFACPT01B01TaskExecutor TaskExecutor 정의
     * @return Step 객체
     */
    @Bean
    public Step BFFACPT01B01MS(                                         
    		@Qualifier("BFFACPT01B01PT") Partitioner BFFACPT01B01PT,
            @Qualifier("BFFACPT01B01") Step BFFACPT01B01,
            @Qualifier("BFFACPT01B01TaskExecutor") TaskExecutor BFFACPT01B01TaskExecutor) {
        return builders.stepBuilder("BFFACPT01B01MS")
                .partitioner("BFFACPT01B01", BFFACPT01B01PT)
                .step(BFFACPT01B01)
                .gridSize(GRID_SIZE)
                .taskExecutor(BFFACPT01B01TaskExecutor)
                .build();
    }

    /**
     * [Step 정의] BFFACPT01B01
     * - 파티션 1개가 처리하는 메인 Chunked Step
     * 
     * @param transactionManager 트랜잭션 관리자
     * @param BFFACPT01B01Read 데이터 읽기 컴포넌트
     * @param BFFACPT01B01Process 데이터 가공 컴포넌트
     * @param BFFACPT01B01Write 데이터 쓰기 컴포넌트
     * @return Step 객체
     */
    @Bean
    public Step BFFACPT01B01(
    		PlatformTransactionManager transactionManager,
            MyBatisCursorItemReader<BFFACPT01DTO.selectFruitSourceListVO> BFFACPT01B01Read,
            ItemProcessor<BFFACPT01DTO.selectFruitSourceListVO, BFFACPT01DTO.fruitTargetVO> BFFACPT01B01Process,
            MyBatisBatchItemWriter<BFFACPT01DTO.fruitTargetVO> BFFACPT01B01Write) {
    	
        return builders.stepBuilder("BFFACPT01B01")
                .<BFFACPT01DTO.selectFruitSourceListVO, BFFACPT01DTO.fruitTargetVO>chunk(chunkSize, transactionManager)
                .reader(BFFACPT01B01Read)
                .processor(BFFACPT01B01Process)
                .writer(BFFACPT01B01Write)
                .build();
    }
    
    /**
     * [Step 정의] BFFACPT01B01
     * - 스레드 풀(Thread Pool)을 생성하고 설정하는 빈(Bean) 정의
     * 
     * @return TaskExecutor 객체
     */
    @Bean
    public TaskExecutor BFFACPT01B01TaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(GRID_SIZE);
        executor.setMaxPoolSize(GRID_SIZE);
        executor.setThreadNamePrefix("BFFACPT01B01-pt-");
        return executor;
    }
}
