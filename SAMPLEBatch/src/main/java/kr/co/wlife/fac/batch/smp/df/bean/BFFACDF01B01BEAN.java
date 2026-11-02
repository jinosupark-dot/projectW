package kr.co.wlife.fac.batch.smp.df.bean;

import java.util.Map;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.mybatis.spring.batch.builder.MyBatisCursorItemReaderBuilder;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.file.FlatFileItemWriter;
import org.springframework.batch.item.file.builder.FlatFileItemWriterBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;

import kr.co.wlife.fac.batch.smp.df.vo.BFFACDF01DTO;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: 재무회계 배치 프로그램 샘플 - BFFACDF01B01BEAN
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
public class BFFACDF01B01BEAN {

	private String charset = "UTF-8";
	
	/**
     * [ItemReader 정의] BFFACDF01B01Read
     * - @StepScope를 적용하여 Step 실행 시점에 빈이 생성되도록 설정
     * - StepExecution에서 ancmAtfId Job 파라미터를 추출하여(기본값 "A") MyBatis 커서 리더 쿼리에 전달
     * 
     * @param sqlSessionFactory MyBatis SQL 세션 팩토리
     * @param stepExecution 스텝 실행 컨텍스트 (Job 파라미터 추출용)
     * @return MyBatisCursorItemReader 객체
     */
    @Bean
    @StepScope 
    public MyBatisCursorItemReader<BFFACDF01DTO.selectSample01ListVO> BFFACDF01B01Read(
            SqlSessionFactory sqlSessionFactory, 
            @Value("#{stepExecution}") StepExecution stepExecution) {
   
        String ancmAtfId = stepExecution.getJobParameters().getString("ancmAtfId", "A");
   
        return new MyBatisCursorItemReaderBuilder<BFFACDF01DTO.selectSample01ListVO>()
                .sqlSessionFactory(sqlSessionFactory)
                .queryId("kr.co.wlife.fac.batch.smp.df.mapper.BFFACDF01MAPPER.selectSample01List")
                .parameterValues(Map.of("ancmAtfId", ancmAtfId))
                .build();
    }  

    /**
     * [ItemProcessor 정의] BFFACDF01B01Process
     * - selectSample01ListVO 데이터를 읽어와 selectSample02ListVO 타겟 객체로 변환
     * - cont 필드가 "CONT"로 시작하는 경우 iqCnt를 2배로 곱하고, 아닐 경우 0으로 처리
     * - cont 문자열 앞에 "계약조건:" 접두사 추가
     * 
     * @return ItemProcessor 객체
     */
    @Bean
    public ItemProcessor<BFFACDF01DTO.selectSample01ListVO, BFFACDF01DTO.selectSample02ListVO> BFFACDF01B01Process() {
        return item -> {
            BFFACDF01DTO.selectSample02ListVO target = new BFFACDF01DTO.selectSample02ListVO();
            target.setAncmNtfId(item.getAncmNtfId());
            target.setCont("계약조건:" + item.getCont());
            target.setInppCd(item.getInppCd());
            if(item.getCont().startsWith("CONT")) {
                target.setIqCnt(item.getIqCnt() * 2);
            } else { 
                target.setIqCnt(0);
            }
            target.setTitl(item.getTitl());
            return target;
        };
    }  

    /**
     * [ItemWriter 정의] BFFACDF01B01DFWrite
     * - FlatFileItemWriter를 사용하여 가공된 데이터를 파일 출력
     * 
     * @param filePath
     * @return FlatFileItemWriter 객체
     */
    @Bean
    @StepScope
    public FlatFileItemWriter<BFFACDF01DTO.selectSample02ListVO> BFFACDF01B01DFWrite(
            @Value("#{jobParameters['outputFilePath'] ?: './output/BFFACDF01_result.txt'}") String filePath) {
//		@Value("#{'${batch.data_home}' + '/' + (jobParameters['outputFilePath'] ?: './output/BFFACDF01_result.txt'}") String inputPath) {

        return new FlatFileItemWriterBuilder<BFFACDF01DTO.selectSample02ListVO>()
                .name("BFFACDF01FileWrite")
                .resource(new FileSystemResource(filePath))
                .append(false)
                .encoding(charset)
                .delimited()
                .delimiter(",") //구분자 설정 (콤마 ',' 또는 파이프 '|' 등으로 변경 가능)
                .names(new String[]{"ancmNtfId", "titl", "cont", "iqCnt", "inppCd"})
                .headerCallback(writer -> writer.write("ANCM_NTF_ID,TITL,CONT,IQ_CNT,INPP_CD"))
                .build();
    }

    /**
     * [StepExecutionListener 정의] BFFACDD02B01Listener
     * - Step 실행 전(beforeStep) 시작 로그 출력, 실행 시작 시간 기록, 필수 파라미터(ancmAtfId) 검증
     * - Step 실행 후(afterStep) 종료 상태 반환
     * 
     * @return StepExecutionListener 객체
     */
    @Bean
    public StepExecutionListener BFFACDF01B01Listener() {
        return new StepExecutionListener() {  
            @Override
            public void beforeStep(StepExecution stepExecution) {  
                log.debug("===== [beforeStep] Step 시작: " + stepExecution.getStepName() + " =====");  
                stepExecution.getExecutionContext().putLong("startTime", System.currentTimeMillis());  
  
                JobParameters params = stepExecution.getJobParameters();  
                String ancmAtfId = params.getString("ancmAtfId");  
  
                if (ancmAtfId == null) {  
                    throw new IllegalArgumentException("ancmAtfId 파라미터는 필수입니다.");  
                }  
            }  
  
            @Override
            public ExitStatus afterStep(StepExecution stepExecution) {  
                return stepExecution.getExitStatus();  
            }  
        };  
    }
}