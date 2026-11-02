package kr.co.wlife.fac.batch.smp.ts.bean;

import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import kr.co.wlife.fac.batch.smp.ts.mapper.BFFACTS01MAPPER;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACTS01B01BEAN
 * @설명: 배치 컴포넌트 설정 클래스] BFFACTS01B 배치 Job의 Step에서 사용되는 
 *               taskletStep 에서 단건등 일괄처리를 위한 STEP  빈(Bean)을 정의하는 설정 클래스
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
public class BFFACTS01B01BEAN {
	
	private final BFFACTS01MAPPER bMapper;

    /**
     * [Tasklet 정의] BFFACTS01B01Tasklet
     * - 특정 조건 데이터 삭제후 일괄 DB 적재(insert~select)
     * 
     * @return Tasklet 객체
     */
    @Bean
    @StepScope
    public Tasklet BFFACTS01B01Tasklet(
            @Value("#{stepExecution}") StepExecution stepExecution) {

    	String ancmAtfId = stepExecution.getJobExecution().getJobParameters().getString("ancmAtfId", "A");
        log.info("ancmAtfId: {}", ancmAtfId);

        return (contribution, chunkContext) -> {

            // 1) 해당 조건 데이터 삭제
            int deleted = bMapper.deleteTBPSB0016ByAncmAtfIdList(ancmAtfId);
            log.info("기존 데이터 삭제: {}건", deleted);

            // 2) 해당 조건 데이터 INSERT ... SELECT
            int inserted = bMapper.insertTBPSB0016List(ancmAtfId);
            log.info("신규 데이터 입력: {}건", inserted);

            // 3) 건수를 StepExecution에 반영 
            contribution.incrementWriteCount(inserted);

            return RepeatStatus.FINISHED;
        };
    }
}
