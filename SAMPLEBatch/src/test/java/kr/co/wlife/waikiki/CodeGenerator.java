package kr.co.wlife.waikiki;

import com.hubspot.jinjava.Jinjava;
import java.nio.file.*;
import java.util.*;

public class CodeGenerator {

//    static final Path BASE = Path.of("src/main/resources/kr/co/wlife/waikiki");
    static final Path BASE = Path.of("src/test/java/kr/co/wlife/waikiki");

    // 생성되는 Java package 선언 앞에 붙는 고정 접두어 (필요 없으면 "")
    static final String PACKAGE_PREFIX = "kr.co.wlife.jhb.batch.";

    public static void main(String[] args) throws Exception {
        Map<String, String> input = readKv(BASE.resolve("config/input.yml"));
        Map<String, String> outputs = readKv(BASE.resolve("config/output_directory_struct.yml"));

        String jobId = input.get("job_id");
        String packageDirectory = input.get("package_directory");                       // asm/journalrule
        String packageName = PACKAGE_PREFIX + packageDirectory.replace('/', '.');       // kr.co.wlife.jhb.batch.asm.journalrule

        List<String> columns = new ArrayList<>();
        List<Map<String, String>> fields = new ArrayList<>();
        for (String c : input.get("colums").split(",")) {
            c = c.trim();
            if (c.isEmpty()) continue;
            columns.add(c);
            fields.add(Map.of("column", c, "property", camel(c)));
        }

        Map<String, Object> ctx = new HashMap<>();
        ctx.put("job_id", jobId);
        ctx.put("package_directory", packageDirectory);
        ctx.put("package_name", packageName);
        ctx.put("table_name_source", input.get("table_name_source"));
        ctx.put("table_name_target", input.get("table_name_target"));
        ctx.put("columns", columns);
        ctx.put("fields", fields);

        Jinjava jinjava = new Jinjava();

        // bean -> job -> mapper_java -> mapper_xml -> vo (파일에 적은 순서대로)
        for (Map.Entry<String, String> e : outputs.entrySet()) {
            String template = Files.readString(BASE.resolve("template/" + e.getKey() + ".jinja2"));
            String result = jinjava.render(template, ctx);

            String pathStr = e.getValue()
                    .replace("{job_id}", jobId)
                    .replace("{package_directory}", packageDirectory);

            Path out = Path.of(toLocalPath(pathStr));
            Files.createDirectories(out.getParent());
            Files.writeString(out, result);
            System.out.println("generated: " + out.toAbsolutePath());
        }
    }

    // "key : value" 형식 파싱 (첫 번째 ':' 기준, 빈 줄/# 주석 무시)
    static Map<String, String> readKv(Path file) throws Exception {
        Map<String, String> map = new LinkedHashMap<>();
        for (String line : Files.readAllLines(file)) {
            line = line.trim();
            if (line.isEmpty() || line.startsWith("#")) continue;
            int idx = line.indexOf(':');
            map.put(line.substring(0, idx).trim(), line.substring(idx + 1).trim());
        }
        return map;
    }

    // fruit_qty -> fruitQty
    static String camel(String s) {
        StringBuilder sb = new StringBuilder();
        for (String p : s.toLowerCase().split("_")) {
            if (p.isEmpty()) continue;
            sb.append(sb.length() == 0 ? p : Character.toUpperCase(p.charAt(0)) + p.substring(1));
        }
        return sb.toString();
    }

    // Git Bash 스타일 /d/tmp/... 를 Windows Java가 이해하는 D:/tmp/... 로 변환
    static String toLocalPath(String p) {
        boolean win = System.getProperty("os.name").toLowerCase().contains("win");
        if (win && p.matches("^/[a-zA-Z]/.*")) {
            return Character.toUpperCase(p.charAt(1)) + ":" + p.substring(2);
        }
        return p;
    }
}