package kr.co.wlife.fac.batch.smp.df.bean;

import java.util.Map;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisBatchItemWriter;
import org.mybatis.spring.batch.builder.MyBatisBatchItemWriterBuilder;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;

import kr.co.wlife.common.batch.file.ByteFixedLengthTokenizer;
import kr.co.wlife.fac.batch.smp.df.mapper.BFFACDF03MAPPER;
import kr.co.wlife.fac.batch.smp.df.vo.BFFACDF03DTO;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDF03B01BEAN
 * @설명: 배치 컴포넌트 설정 클래스] BFFACDF03B 배치 Job의 Step에서 사용되는 
 *                ItemReader, ItemProcessor, ItemWriter 
 *                빈(Bean)을 정의하는 설정 클래스
 * @최초작성자: 김우리
 * @최초작성일: 2026-10-24
 * @최종변경일:
 * @개정이력:
 *   김우리 2026-10-24 최초작성
 * =====================================================================================
 */
@Configuration
public class BFFACDF03B01BEAN {

	private String charset = "UTF-8";

	/**
	 * [ItemReader 정의] BFFACDF03B01FFRead
	 * - 고정길이(Fixed Length) 파일 Reader 설정 (기본 파일: BFFACDF02_fixed_result.txt)
	 * - 필드별 '바이트 길이'로 한 줄을 분리하여 VO로 변환 후 Processor에 전달
	 *
	 * @param inputPath 입력 파일 경로 (Job 파라미터 inputFilePath, 없으면 기본 경로)
	 * @return FlatFileItemReader 객체
	 */
  	@Bean
    @StepScope
    public FlatFileItemReader<BFFACDF03DTO.fileInputVO> BFFACDF03B01FFRead(
            @Value("#{jobParameters['inputFilePath'] ?: './output/BFFACDF02_fixed_result.txt'}") String inputPath) {
//    		@Value("#{'${batch.data_home}' + '/' + (jobParameters['inputFilePath'] ?: './output/BFFACDF02_fixed_result.txt'}") String inputPath) {

        FlatFileItemReader<BFFACDF03DTO.fileInputVO> reader = new FlatFileItemReader<>();
        reader.setResource(new FileSystemResource(inputPath));
        reader.setName("BFFACDF03B01FFRead");
        reader.setEncoding(charset); // 파일 인코딩에 맞춤

        // 1. 각 필드별 할당된 '바이트 길이' 정의 (Writer에서 지정한 크기와 정확히 일치해야 함)
        int[] fieldByteLengths = new int[]{15, 30, 50, 10, 20};
        String[] names = new String[]{"ancmNtfId", "titl", "cont", "iqCnt", "inppCd"};

        // 2. 바이트 기반 커스텀 토크나이저 생성
        ByteFixedLengthTokenizer tokenizer = new ByteFixedLengthTokenizer(fieldByteLengths, names, charset);

        // 3. 필드 매퍼 설정
        BeanWrapperFieldSetMapper<BFFACDF03DTO.fileInputVO> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(BFFACDF03DTO.fileInputVO.class);

        // 4. LineMapper 조합
        DefaultLineMapper<BFFACDF03DTO.fileInputVO> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        reader.setLineMapper(lineMapper);
        return reader;
    }

    /**
     * [ItemProcessor 정의] BFFACDF03B01Process
     * - 데이터 가공 Processor (필요 시 공백 제거 및 타입 변환)
     *
     * @return ItemProcessor 객체
     */
    @Bean
    public ItemProcessor<BFFACDF03DTO.fileInputVO, BFFACDF03DTO.insertTBPSB0016InfoVO> BFFACDF03B01Process() {
        return item -> {
            BFFACDF03DTO.insertTBPSB0016InfoVO output = new BFFACDF03DTO.insertTBPSB0016InfoVO();
            output.setAncmNtfId(item.getAncmNtfId() != null ? item.getAncmNtfId().strip() : "");
            output.setTitl(item.getTitl() != null ? item.getTitl().strip() : "");
            output.setCont(item.getCont() != null ? item.getCont().strip() : "");
            
            // File 에서 String 으로 받아서 여기서 숫자형 변환 처리
            try {
                output.setIqCnt(item.getIqCnt() != null ? Long.parseLong(item.getIqCnt().strip()) : 0L);
            } catch (NumberFormatException e) {
                output.setIqCnt(0L);
            }
            
            output.setInppCd(item.getInppCd() != null ? item.getInppCd().strip() : "");
            return output;
        };
    }

    /**
     * [ItemWriter 정의] BFFACDF03B01Write
     * - MyBatis 기반 Writer 설정 (insertTBPSB0016Info 쿼리로 배치 INSERT)
     *
     * @param sqlSessionFactory MyBatis SQL 세션 팩토리
     * @return MyBatisBatchItemWriter 객체
     */
    @Bean
    public MyBatisBatchItemWriter<BFFACDF03DTO.insertTBPSB0016InfoVO> BFFACDF03B01Write(SqlSessionFactory sqlSessionFactory) {
        return new MyBatisBatchItemWriterBuilder<BFFACDF03DTO.insertTBPSB0016InfoVO>()
                .sqlSessionFactory(sqlSessionFactory)
                // MyBatis Mapper XML의 Namespace + 아이디 경로를 정확히 입력!!!
                .statementId(BFFACDF03MAPPER.class.getName() + ".insertTBPSB0016Info")
                .itemToParameterConverter(item -> Map.of("item", item))
                .build();
    }
}