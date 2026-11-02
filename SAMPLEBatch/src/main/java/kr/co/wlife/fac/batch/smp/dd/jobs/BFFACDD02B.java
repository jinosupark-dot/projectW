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
import kr.co.wlife.fac.batch.smp.dd.vo.BFFACDD02DTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDD02B
 * @설명: [배치 Job] 공지사항/샘플 데이터 테이블을 조회하여 
 *                조건에 맞게 가공한 뒤 타겟 테이블로 적재하는 배치 Job 설정 클래스
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
public class BFFACDD02B {

    private final CommonBatchBuilders builders; // for CommonLogging 공통로그
    private int chunkSize = 10;
    
    /**
     * [Job 정의] BFFACDD02BJob
     * - BFFACDD02B01 스텝을 시작으로 배치 구동
     * 
     * @param BFFACDD02B01 실행할 메인 Step bean
     * @return Job 객체
     */ 
    @Bean
	public Job BFFACDD02BJob(@Qualifier("BFFACDD02B01") Step BFFACDD02B01) {
		return builders.jobBuilder("BFFACDD02B")
                .incrementer(new RunIdIncrementer())
                .start(BFFACDD02B01)
                .build();
    }
    
    /**
     * [Step 정의] BFFACDD02B01
     * - 청크 지향 처리(Chunk-oriented Processing) 설정 (Chunk Size: 10)
     * - Reader, Processor, Writer 및 공통 로깅 리스너, 커스텀 리스너 등록
     * 
     * @param jobRepository Job 메타데이터 저장소
     * @param transactionManager 트랜잭션 관리자
     * @param BFFACDD02B01Read 데이터 읽기 컴포넌트
     * @param BFFACDD02B01Process 데이터 가공 컴포넌트
     * @param BFFACDD02B01Write 데이터 쓰기 컴포넌트
     * @return Step 객체
     * @param BFFACDD02B01Listener Step 리스너
     */
    @Bean
    public Step BFFACDD02B01(
	        PlatformTransactionManager transactionManager,
	        @Qualifier("BFFACDD02B01Read") ItemReader<BFFACDD02DTO.selectSample01ListVO> BFFACDD02B01Read,
	        @Qualifier("BFFACDD02B01Process") ItemProcessor<BFFACDD02DTO.selectSample01ListVO, BFFACDD02DTO.selectSample02ListVO> BFFACDD02B01Process,
	        @Qualifier("BFFACDD02B01Write") ItemWriter<BFFACDD02DTO.selectSample02ListVO> BFFACDD02B01Write,
	        @Qualifier("BFFACDD02B01Listener") StepExecutionListener BFFACDD02B01Listener) {

        return builders.stepBuilder("BFFACDD02B01")
                .<BFFACDD02DTO.selectSample01ListVO, BFFACDD02DTO.selectSample02ListVO>chunk(chunkSize, transactionManager)
                .reader(BFFACDD02B01Read)
                .processor(BFFACDD02B01Process)
                .writer(BFFACDD02B01Write)
                .listener(BFFACDD02B01Listener)
                .build();
    }
}