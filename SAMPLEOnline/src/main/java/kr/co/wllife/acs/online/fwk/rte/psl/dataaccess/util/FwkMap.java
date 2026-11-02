package kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util;

import org.apache.commons.collections4.map.ListOrderedMap;

public class FwkMap extends ListOrderedMap<String, Object> {

    @Override
    public Object put(String key, Object value) {
        // DB 컬럼명(CDC_VAL_NM 등)을 camelCase(cdcValNm)로 자동 변환
        return super.put(FwkMap.toCamelCase(key), value);
    }

    @Override
    public void putAll(java.util.Map<? extends String, ?> m) {
        if (m != null) {
            for (Entry<? extends String, ?> entry : m.entrySet()) {
                put(entry.getKey(), entry.getValue());
            }
        }
    }

private static String toCamelCase(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }

        // 1. 언더바가 없는 경우
        if (!str.contains("_")) {
            // 전체가 대문자(예: "CODE")인 경우에만 소문자로 변환 ("code")
            if (str.equals(str.toUpperCase())) {
                return str.toLowerCase();
            }
            // 그 외(이미 카멜케이스이거나 소문자 섞인 경우)는 원본 유지
            return str;
        }

        // 2. 언더바가 포함된 경우 기존 snake_case -> camelCase 변환 로직 수행
        String[] words = str.toLowerCase().split("_");
        StringBuilder result = new StringBuilder(words[0]);

        for (int i = 1; i < words.length; i++) {
            if (!words[i].isEmpty()) {
                result.append(Character.toUpperCase(words[i].charAt(0)));
                result.append(words[i].substring(1));
            }
        }

        return result.toString();
    }
}