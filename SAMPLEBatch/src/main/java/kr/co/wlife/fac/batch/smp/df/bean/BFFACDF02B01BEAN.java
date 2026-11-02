package kr.co.wlife.fac.batch.smp.df.bean;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.FlatFileItemWriter;
import org.springframework.batch.item.file.builder.FlatFileItemReaderBuilder;
import org.springframework.batch.item.file.builder.FlatFileItemWriterBuilder;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.transform.BeanWrapperFieldExtractor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;

import kr.co.wlife.common.batch.file.ByteFormatterLineAggregator;
import kr.co.wlife.fac.batch.smp.df.vo.BFFACDF02DTO;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDF02B01BEAN
 * @설명: 배치 컴포넌트 설정 클래스] BFFACDF02B 배치 Job의 Step에서 사용되는 
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
public class BFFACDF02B01BEAN {
	
	private String charset = "UTF-8";
	
	/**
     * [ItemReader 정의] BFFACDF02B01DFRead
     * - Delimited 파일 Reader 설정 (BFFACDF02_test_result.txt 읽기
     * 
     * @param inputPath
     * @return FlatFileItemReader 객체
     */
    @Bean
    @StepScope
    public FlatFileItemReader<BFFACDF02DTO.fileInputVO> BFFACDF02B01DFRead(
            @Value("#{jobParameters['inputFilePath'] ?: './output/BFFACDF01_test_result.txt'}") String inputPath) {
//		@Value("#{'${batch.data_home}' + '/' + (jobParameters['inputFilePath'] ?: './output/BFFACDF01_test_result.txt'}") String inputPath) {

        return new FlatFileItemReaderBuilder<BFFACDF02DTO.fileInputVO>()
                .name("BFFACDF02B01DFRead")
                .resource(new FileSystemResource(inputPath))
                .encoding(charset)
                .linesToSkip(1) // 첫 줄(헤더) 스킵 필요 시 설정
                .delimited()
                .delimiter(",") // 구분자 (예: 콤마 또는 파이프 '|')
                .names(new String[]{"ancmNtfId", "titl", "cont", "iqCnt", "inppCd"})
                .fieldSetMapper(new BeanWrapperFieldSetMapper<>() {{
                    setTargetType(BFFACDF02DTO.fileInputVO.class);
                }})
                .build();
    }

    /**
     * [ItemProcessor 정의] BFFACDF02B01Process
     * - 데이터 가공 Processor
     * 
     * @return ItemProcessor 객체
     */
    @Bean
    public ItemProcessor<BFFACDF02DTO.fileInputVO, BFFACDF02DTO.fileOutputVO> BFFACDF02B01Process() {
        return item -> {
        	BFFACDF02DTO.fileOutputVO output = new BFFACDF02DTO.fileOutputVO();
        	// 문자열 필드는 공백 패딩 없이 순수 값만 세팅 (Writer의 ByteFormatterLineAggregator가 바이트 기준 패딩을 자동 처리함)
            output.setAncmNtfId(item.getAncmNtfId() != null ? item.getAncmNtfId().trim() : "");
            output.setTitl(item.getTitl() != null ? item.getTitl().trim() : "");
            output.setCont(item.getCont() != null ? item.getCont().trim() : "");
            
            // 숫자인 iqCnt는 10자리 0 채우기(%010d) 포맷 적용
            Long iqCnt = item.getIqCnt() != null ? item.getIqCnt() : 0L;
            output.setIqCnt(String.format("%010d", iqCnt)); 
            
            output.setInppCd(item.getInppCd() != null ? item.getInppCd().trim() : "");
            
            return output;
        };
    }


    /**
     * [ItemWriter 정의] BFFACDF02B01FFWrite
     * - FlatFileItemWriter를 사용하여 가공된 데이터를 파일 출력
     * - 바이트 기반 고정 길이 파일 Writer 설정
     * @param filePath
     * @return FlatFileItemWriter 객체
     */
    @Bean
    @StepScope
    public FlatFileItemWriter<BFFACDF02DTO.fileOutputVO> BFFACDF02B01FFWrite(
            @Value("#{jobParameters['outputFilePath'] ?: './output/BFFACDF02_fixed_result.txt'}") String outputPath) {
//		@Value("#{'${batch.data_home}' + '/' + (jobParameters['outputFilePath'] ?: './output/BFFACDF02_fixed_result.txt'}") String inputPath) {

        // 1. VO에서 가져올 필드 이름 순서 지정
        BeanWrapperFieldExtractor<BFFACDF02DTO.fileOutputVO> fieldExtractor = new BeanWrapperFieldExtractor<>();
        fieldExtractor.setNames(new String[]{"ancmNtfId", "titl", "cont", "iqCnt", "inppCd"});

        // 2. 각 필드별 할당된 '바이트 길이' 정의 (예: 15, 30, 50, 10, 20바이트)
        int[] fieldByteLengths = new int[]{15, 30, 50, 10, 20};
        
        // 3. 커스텀 바이트 LineAggregator 생성 (UTF-8 기준 바이트 패딩)
        ByteFormatterLineAggregator<BFFACDF02DTO.fileOutputVO> lineAggregator = 
            new ByteFormatterLineAggregator<>(
                fieldByteLengths, 
                charset, 
                item -> fieldExtractor.extract(item)
            );

        return new FlatFileItemWriterBuilder<BFFACDF02DTO.fileOutputVO>()
                .name("BFFACDF02B01FFWrite")
                .resource(new FileSystemResource(outputPath))
                .append(false)
                .encoding(charset) // 파일 출력 인코딩
                .lineAggregator(lineAggregator)
                .build();
    }
}
