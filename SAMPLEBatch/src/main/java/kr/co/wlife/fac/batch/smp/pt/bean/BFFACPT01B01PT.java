package kr.co.wlife.fac.batch.smp.pt.bean;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.batch.core.partition.support.Partitioner;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import kr.co.wlife.fac.batch.smp.pt.mapper.BFFACPT01MAPPER;
import kr.co.wlife.fac.batch.smp.pt.vo.BFFACPT01DTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * =====================================================================================
 * @시스템명: FAC
 * @업무명: Partitioner class - BFFACPT01B01PT
 * @설명: 대용량 데이터를 멀티 스레드로 병렬 처리하기 위해 데이터의 전체 ID 범위(MIN ~ MAX)를 조회한 뒤, 
 * 지정한 파티션 수(gridSize)만큼 균등하게 쪼개어 
 * 각 스레드에 할당할 범위를 생성해 주는 Partitioner 컴포넌트
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
public class BFFACPT01B01PT implements Partitioner {

    private static final String JOB_NAME = "BFFACPT01B";
	
	private final BFFACPT01MAPPER bMapper;
	
	/**
     * [partition 정의] 
     * - 파티션별 ExecutionContext 생성
     * 
     * @param gridSize 파티션 갯수
     * @return partitions 객체
     */
    @Override
    public Map<String, ExecutionContext> partition(int gridSize) {
        Map<String, ExecutionContext> partitions = new LinkedHashMap<>();

        BFFACPT01DTO.selectPartitionRangeVO range = bMapper.selectPartitionRange();

        if (range == null || range.getMinId() == null || range.getMaxId() == null) {
            log.warn("[{}] 처리 대상 데이터가 없어 파티션을 생성하지 않습니다.", JOB_NAME);
            return partitions;
        }

        long min = range.getMinId().longValue();
        long max = range.getMaxId().longValue();

        long total = max - min + 1;
        long size = (total + gridSize - 1) / gridSize; // 올림 나눗셈

        for (int i = 0; i < gridSize; i++) {
            long start = min + size * i;
            if (start > max) {
                break; // 데이터가 적어 파티션 수보다 범위가 먼저 소진된 경우
            }
            long end = Math.min(start + size - 1, max);

            ExecutionContext ctx = new ExecutionContext();
            ctx.putLong("minId", start);
            ctx.putLong("maxId", end);
            partitions.put("partition" + i, ctx);

            log.info("[{}] partition{} : fruit_id {} ~ {}", JOB_NAME, i, start, end);
        }
        return partitions;
    }
}