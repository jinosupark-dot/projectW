package kr.co.wlife.fac.batch.smp.pt.bean;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisBatchItemWriter;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisBatchItemWriterBuilder;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import kr.co.wlife.fac.batch.smp.pt.vo.BFFACPT01DTO;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACPT01B01BEAN
 * @설명: 배치 컴포넌트 설정 클래스] BFFACDF01B 배치 Job의 Step에서 사용되는 
 *                ItemReader, ItemProcessor, ItemWriter 및 StepExecutionListener 
 *                빈(Bean)을 정의하는 설정 클래스
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
@Slf4j
@Configuration
public class BFFACPT01B01BEAN {

    private static final String MAPPER = "kr.co.wlife.fac.batch.smp.pt.mapper.BFFACPT01MAPPER.";

    /**
     * [ItemReader 정의] BFFACPT01B01Read
     * - @StepScope 필수 (파티션마다 별도 인스턴스 생성)
     * - ExecutionContext에 담긴 minId와 maxId 값은 
     *  이후 각 Step의 Reader(MyBatisCursorItemReader)가 쿼리를 수행할 때 파라미터로 전달
     *  
     * @param sqlSessionFactory MyBatis SQL 세션 팩토리
     * @param minId
     * @param maxId
     * @return MyBatisCursorItemReader 객체
     */
    @Bean
    @StepScope
    public MyBatisCursorItemReader<BFFACPT01DTO.selectFruitSourceListVO> BFFACPT01B01Read(
            SqlSessionFactory sqlSessionFactory,
            @Value("#{stepExecutionContext['minId']}") Long minId,
            @Value("#{stepExecutionContext['maxId']}") Long maxId) {

        Map<String, Object> params = new HashMap<>();
        params.put("minId", minId);
        params.put("maxId", maxId);

        return new MyBatisCursorItemReaderBuilder<BFFACPT01DTO.selectFruitSourceListVO>()
                .sqlSessionFactory(sqlSessionFactory)
                .queryId(MAPPER + "selectFruitSourceByRange")
                .parameterValues(params)
                .build();
    }

    /**
     * [ItemProcessor 정의] BFFACPT01B01Process
     * - SelectFruitSourceListVO 데이터를 읽어와 FruitTargetVO 타겟 객체로 변환
     * 
     * @return ItemProcessor 객체
     */
    @Bean
    public ItemProcessor<BFFACPT01DTO.selectFruitSourceListVO, BFFACPT01DTO.fruitTargetVO> BFFACPT01B01Process() {
        return item -> {
            if (item.getFruitName() == null || item.getFruitName().isBlank()) {
                log.warn("[BFFACPT01B01Process] skip: fruitId={}", item.getFruitId());
                return null;
            }

            //샘플용 임의값
            int qty = ThreadLocalRandom.current().nextInt(1_000_000);

            return BFFACPT01DTO.fruitTargetVO.builder()
                    .fruitName(item.getFruitName())
                    .fruitQty(qty)
                    .status("READY")
                    .build();
        };
    }

    /**
     * [ItemWriter 정의] BFFACPT01B01Write
     * - MyBatisBatchItemWriter를 사용하여 가공된 데이터를 타겟 테이블에 일괄(Batch) 적재
     * - 내부적으로 JDBC의 addBatch() / executeBatch() 기능을 활용하여 고속 일괄 처리 수행
     * 
     * @param sqlSessionFactory MyBatis SQL 세션 팩토리
     * @return MyBatisBatchItemWriter 객체
     */
    @Bean
    public MyBatisBatchItemWriter<BFFACPT01DTO.fruitTargetVO> BFFACPT01B01Write(SqlSessionFactory sqlSessionFactory) {
        return new MyBatisBatchItemWriterBuilder<BFFACPT01DTO.fruitTargetVO>()
                .sqlSessionFactory(sqlSessionFactory)
                .statementId(MAPPER + "insertFruitTargetPartition")
                .assertUpdates(false)
                .build();
    }
}