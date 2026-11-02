package kr.co.wlife.fac.batch.smp.dd.jobs;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.StepExecutionListener;
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
import kr.co.wlife.fac.batch.smp.dd.vo.BFFACDD01DTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDD01B
 * @설명: [배치 Job 설정 클래스] 다중 STEP(Step 1, Step 2)으로 구성된 
 *                샘플/테스트 데이터 처리 배치 Job 정의
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
public class BFFACDD01B {

    private final CommonBatchBuilders builders; // for CommonLogging 공통로그
    private int chunkSize = 10;
    
    /**
     * [Job 정의] BFFACDD01BJob
     * - 순차적으로 BFFACDD01B01 STEP 실행 후 BFFACDD01B02 STEP을 연이어 실행
     * 
     * @param BFFACDD01B01 첫 번째 실행할 메인 STEP BEAN
     * @param BFFACDD01B02 두 번째 이어서 실행할 STEP BEAN
     * @return Job 객체
     */
    @Bean
	public Job BFFACDD01BJob(/* JobRepository jobRepository, */ Step BFFACDD01B01, Step BFFACDD01B02) {
		return builders.jobBuilder(
				"BFFACDD01B"/* , jobRepository */)
                .incrementer(new RunIdIncrementer())
                .start(BFFACDD01B01)
                .next(BFFACDD01B02)
                .build();
    }
    
    /**
     * [Step 정의] BFFACDD01B01 (첫 번째 STEP)
     * - Chunk Size: 10
     * - selectTest01List 대상 데이터를 읽고, 가공하여 동일 타입으로 기록
     * - 전역 청크 로깅 Listener  및 커스텀 STEP Listener  등록
     * 
     * @param jobRepository Job 메타데이터 저장소
     * @param transactionManager 트랜잭션 관리자
     * @param BFFACDD01B01Read 데이터 reader BEAN
     * @param BFFACDD01B01Process 데이터 processor BEAN
     * @param BFFACDD01B01Write 데이터 writer BEAN
     * @param BFFACDD01B01Listener STEP  Listener 
     * @return Step 객체
     */
    @Bean
    public Step BFFACDD01B01(JobRepository jobRepository,
                          PlatformTransactionManager transactionManager,
                          ItemReader<BFFACDD01DTO.selectTest01ListVO> BFFACDD01B01Read,
                          ItemProcessor<BFFACDD01DTO.selectTest01ListVO, BFFACDD01DTO.selectTest01ListVO> BFFACDD01B01Process,
                          ItemWriter<BFFACDD01DTO.selectTest01ListVO> BFFACDD01B01Write,
                          @Qualifier("BFFACDD01B01Listener") StepExecutionListener BFFACDD01B01Listener) {

        return builders.stepBuilder("BFFACDD01B01")
                .<BFFACDD01DTO.selectTest01ListVO, BFFACDD01DTO.selectTest01ListVO>chunk(chunkSize, transactionManager)
                .reader(BFFACDD01B01Read)
                .processor(BFFACDD01B01Process)
                .writer(BFFACDD01B01Write)
                .listener(BFFACDD01B01Listener)
                .build();
    }
    
    /**
     * [Step 정의] BFFACDD01B02 (두 번째 스텝)
     * - Chunk Size: 10
     * - selectFruitSourceListVO 데이터를 읽어 fruitTargetVO 타입으로 변환 및 적재
     * - 전역 청크 로깅 리스너 등록
     * 
     * @param jobRepository Job 메타데이터 저장소
     * @param transactionManager 트랜잭션 관리자
     * @param BFFACDD01B02Read  데이터 reader 빈
     * @param BFFACDD01B02Process 데이터 변환 processor 빈
     * @param BFFACDD01B02Write  데이터 writer 빈
     * @return Step 객체
     */
    @Bean
    public Step BFFACDD01B02(JobRepository jobRepository,
                          PlatformTransactionManager transactionManager,
                          ItemReader<BFFACDD01DTO.selectFruitSourceListVO> BFFACDD01B02Read,
                          ItemProcessor<BFFACDD01DTO.selectFruitSourceListVO, BFFACDD01DTO.fruitTargetVO> BFFACDD01B02Process,
                          ItemWriter<BFFACDD01DTO.fruitTargetVO> BFFACDD01B02Write) {
    	
        return builders.stepBuilder("BFFACDD01B02")
                .<BFFACDD01DTO.selectFruitSourceListVO, BFFACDD01DTO.fruitTargetVO>chunk(chunkSize, transactionManager)
                .reader(BFFACDD01B02Read)
                .processor(BFFACDD01B02Process)
                .writer(BFFACDD01B02Write)
                .build();
    }

}