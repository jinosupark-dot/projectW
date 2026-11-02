package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import kr.co.wllife.acs.online.mg.sy.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @시스템명: ifrs17
 * @업무명: 공통
 * @설명: 온라인 배치 실행을 지원하는 Class
 * @최초작성자: 장창환
 * @최초작성일: 2021. 3. 5.
 * @최종변경일: 
 * @개정이력: 
 *  장창환 2021. 3. 5. 최초작성
 */
@Slf4j 
public class BatchUtil {

	public static String KEY_RESULT = "result";
	public static String KEY_ERRMESSAGE = "errorMessage";
	public static String KEY_LOG = "log";	//개발계 SHELL 직접 실행시만 사용
	
	private static BatchUtil bu = null;

	private boolean jmUse = false;
	private String jmUrl = "";
	private String jmId = "";
	private String jmPd = "";
	private String jmCategoryId = "";
	private int jmConnectionTimeout = 10000;
	private int jmReadTimeout = 30000;
			
	private BatchUtil() {
		super();
		this.initialize();
	}

	/**
	 * 
	 * @설명: 최초 설정 로드
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: void
	 * @개정이력: 
	 *  89001203 2021. 1. 18. 최초작성
	 */
	private synchronized void initialize() {
		log.info("-------------------------------------------------------------");
		log.info("                                                             ");
		log.info("        BatchUtil                   v1.0                     ");
		log.info("                                                             ");
		log.info("          Copyright ⓒ 2021  DB Inc.                          ");
		log.info("          All Rights Reserved.                               ");
		log.info("                                                             ");
		log.info("-------------------------------------------------------------");
		try {
			String use = FwkProperties.getProperty("onlinebatch.use");
			String url = FwkProperties.getProperty("onlinebatch.url");
			String id = FwkProperties.getProperty("onlinebatch.id");
			String pd = FwkProperties.getProperty("onlinebatch.pd");
			String categoryId = FwkProperties.getProperty("onlinebatch.categoryId");
			String connectTimeout = FwkProperties.getProperty("onlinebatch.connectTimeout");
			String readTimeout = FwkProperties.getProperty("onlinebatch.readTimeout");
			String aesPass = FwkProperties.getProperty("aes.pass");
			log.info("use           :" + use);
			log.info("url           :" + url);
			log.info("id            :" + id);
			log.info("categoryId    :" + categoryId);
			log.info("connectTimeout:" + connectTimeout);
			log.info("readTimeout   :" + readTimeout);
			log.info("aesPass       :" + aesPass);
			if("true".equals(use)) this.jmUse = true;
			this.jmUrl = url;
			this.jmId = id;
			AES256Util aes256 = new AES256Util(); 
			this.jmPd = aes256.decryptWithPBKDF2(pd, aesPass);
			this.jmCategoryId = categoryId;
			if(!"".equals(connectTimeout)) this.jmConnectionTimeout = Integer.parseInt(connectTimeout);
			if(!"".equals(readTimeout)) this.jmReadTimeout = Integer.parseInt(readTimeout);
		} catch(Exception e) {
			log.error("Exception Occurs!", e);
		}
	}

	/**
	 * 
	 * @설명: BatchUtil Instance를 반환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 18.
	 * @최종변경일: 
	 * @매개변수: 
	 * @반환값: BatchUtil
	 * @개정이력: 
	 *  장창환 2021. 1. 18. 최초작성
	 */
	public static BatchUtil getInstance() {
		if(bu == null) {
			bu = new BatchUtil();
		}
		return bu;
    }
	
	/**
	 * 
	 * @설명: 온라인 배치를 실행한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 5.
	 * @최종변경일: 
	 * @매개변수: Map<String, String>
	 * 	batchId : 배치 ID
	 *  param1 : 파라미터 1
	 *  param2 : 파라미터 2
	 *  param3 : 파라미터 3
	 *  param4 : 파라미터 4
	 *  param5 : 파라미터 5
	 *  param6 : 파라미터 6
	 *  param7 : 파라미터 7
	 *  param8 : 파라미터 8
	 *  param9 : 파라미터 9
	 * @반환값: Map<String,String>
	 *  result : 요청결과(0:성공, 1:실패)
	 *  log : 계발계의 경우 수행결과 로그
	 *  errorMessage : 에러시 에러메세지
	 * @개정이력: 
	 *  89001203 2021. 3. 5. 최초작성
	 */
	public Map<String, String> executeOnlineBatch(Map<String, String> paramMap) {
		UserInfoVO userInfoVO = SessionUtil.getUserInfo();  // 사용자 VO
		String userEno = userInfoVO.getUserEno();           // 사용자사번
		paramMap.put("userEno", userEno);	// 배치ID
		
		if(this.jmUse) {
			//분기 하나 태우기
			return this.executeBatchJobmind(paramMap);
		} else {
			return this.executeBatchBgShell(paramMap);
		}
	}
	
	/**
	 * 
	 * @설명: 그룹핑 된 배치를 실행 실행한다. (운영계 - 임시)
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 6. 9.
	 * @최종변경일: 
	 * @매개변수: Map<String, String>
	 *  param1 : CategoryId
	 *  param2 : 마감년월
	 *  param3 : 파라미터 3
	 *  param4 : 파라미터 4
	 *  param5 : 파라미터 5
	 *  param6 : 파라미터 6
	 *  param7 : 파라미터 7
	 *  param8 : 파라미터 8
	 *  param9 : 파라미터 9
	 * @반환값: Map<String,String>
	 *  result : 요청결과(0:성공, 1:실패)
	 *  log : 계발계의 경우 수행결과 로그
	 *  errorMessage : 에러시 에러메세지
	 * @개정이력: 
	 *  61000305 2021. 6. 9.. 최초작성
	 */
	public Map<String, String> executeOnlineGroupBatch(Map<String, String> paramMap) {
		UserInfoVO userInfoVO = SessionUtil.getUserInfo();  // 사용자 VO
		String userEno = userInfoVO.getUserEno();           // 사용자사번
		paramMap.put("userEno", userEno);	// 배치ID
		
		return this.executeGroupBatchJobmind(paramMap);
	}
	
	
	/**
	 * 
	 * @설명: 온라인 배치를 실행한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 5.
	 * @최종변경일: 
	 * @매개변수: Map<String, String>
	 * 	batchId : 배치 ID
	 *  param1 : 파라미터 1
	 *  param2 : 파라미터 2
	 *  param3 : 파라미터 3
	 *  param4 : 파라미터 4
	 *  param5 : 파라미터 5
	 *  param6 : 파라미터 6
	 *  param7 : 파라미터 7
	 *  param8 : 파라미터 8
	 *  param9 : 파라미터 9
	 * @반환값: Map<String,String>
	 * @개정이력: 
	 *  89001203 2021. 3. 5. 최초작성
	 */
	private Map<String, String> executeBatchJobmind(Map<String, String> paramMap) {

		Map<String, String> resultMap = new HashMap<String, String>();
		
		URL url;
		HttpURLConnection con = null;
		OutputStream out = null;
		BufferedReader br = null;
		String errorMessage = null;	//에러메시지
		String result = null;
		
		try {
			String batchId = (paramMap.containsKey("batchId")) ? (String)paramMap.get("batchId").trim() : "";
			String userEno = (paramMap.containsKey("userEno")) ? (String)paramMap.get("userEno").trim() : "99999999";
			String param1 = (paramMap.containsKey("param1")) ? (String)paramMap.get("param1").trim() : "";
			String param2 = (paramMap.containsKey("param2")) ? (String)paramMap.get("param2").trim() : "";
			String param3 = (paramMap.containsKey("param3")) ? (String)paramMap.get("param3").trim() : "";
			String param4 = (paramMap.containsKey("param4")) ? (String)paramMap.get("param4").trim() : "";
			String param5 = (paramMap.containsKey("param5")) ? (String)paramMap.get("param5").trim() : "";
			String param6 = (paramMap.containsKey("param6")) ? (String)paramMap.get("param6").trim() : "";
			String param7 = (paramMap.containsKey("param7")) ? (String)paramMap.get("param7").trim() : "";
			String param8 = (paramMap.containsKey("param8")) ? (String)paramMap.get("param8").trim() : "";
			String param9 = (paramMap.containsKey("param9")) ? (String)paramMap.get("param9").trim() : "";
			log.info("executeOnlineBatch paramMap:" + paramMap);			
			
			url = new URL(this.jmUrl);
			con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("POST");
			con.setConnectTimeout(this.jmConnectionTimeout);
			con.setReadTimeout(this.jmReadTimeout);
			con.setDoOutput(true);
			con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			con.setRequestProperty("Accept-Charset", "UTF-8");
			con.setUseCaches(false);
			
			String mode = "API";	//API 여부 구분값 (고정) 필수
			String reqTypeCd = "REQ_ACTJOB";	//요청 구분값(고정) 필수
			String jmId = this.jmId;			//요청자 ID 필수
			String jmPd = this.jmPd;			//요청장 계정 Password 필수
			String targetCtgryPath = this.jmCategoryId;		//수시요청 할 작업들의 카테고리 경로 
			
			//요청일자, 수행 기준일자는 16:00 전의 경의 이전일자, 16:00 이후의 경우 당일 일자로 처리한다.(ABL의 ODate 설정에 따름)
			//예를 들어 11:00에 당일자로 요청하면 14:00이후에 JobMind의 Odate가 바뀌므로 그 이후에 수행된다.
			int currentHour = Integer.parseInt(DateUtil.getCurrentDate("HH"));	//시간
			log.info("[executeBatchJobmind]Current hour:" + currentHour);
			String targetDate = DateUtil.getCurrentDate("yyyyMMdd");
			DateUtil.getDate(1, null, -1);
			if(currentHour < 16) {
				targetDate = DateUtil.getDate(1, targetDate , -1);	//이전일
			}
			log.info("[executeBatchJobmind]Target Date:" + targetDate);
			String execCrtronDt = targetDate;			//수행기준일자 필수
			String execReqDt	= targetDate;			//요청일자 필수 
			String indExecFl	= "Y";			//독립수행여부 필수 - 값이 Y이면 작업명과 컨티션에 고유번호가 붙어 독립적으로 수행
			String stTimeDelFl 	= "Y";			//시작시간 삭제여부 필수 - 값이 Y이면 기존 작업의 시작시간과 상관없이 수행
			String precdCondDelFl = "Y";		//선행조건 삭제여부 필수 - 값이 Y이면 기존 작업의 선행조건과 상관없이 수행
			String userConfirmFl = "N";			//사용자확인여부 필수 - 값이 Y이면 무조건 사용자 확인 작업으로 등록
			String reqTitle 	 = "[API]수시작업요청#";	//요청명 선택 - 값이 없으면 임의 생성
			String execTypeCd    = "SCHED"; 			//정기작업 수시요청시 필수(정기작업 수시 요청은 정기작업으로 잡을 등록후 결재 완료 후 수시처리하는 JOB)

			String insertJsonData2 = "[{\"varOrdNo\":\"1\",\"varNm\":\"batchId\",\"varVal\":\"" + batchId + "\",\"varDesc\":\"\"}";		//매개변수 선택 - 요청시 매개변수 사용 -> [{"varOrdNo":"1", "varNm":"AAA"}]
			insertJsonData2 += ",{\"varOrdNo\":\"2\",\"varNm\":\"trtrEno\",\"varVal\":\"" + userEno + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"3\",\"varNm\":\"param1\",\"varVal\":\"" + param1 + "\",\"varDesc\":\"\"}";	
			insertJsonData2 += ",{\"varOrdNo\":\"4\",\"varNm\":\"param2\",\"varVal\":\"" + param2 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"5\",\"varNm\":\"param3\",\"varVal\":\"" + param3 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"6\",\"varNm\":\"param4\",\"varVal\":\"" + param4 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"7\",\"varNm\":\"param5\",\"varVal\":\"" + param5 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"8\",\"varNm\":\"param6\",\"varVal\":\"" + param6 + "\",\"varDesc\":\"\"}";	
			insertJsonData2 += ",{\"varOrdNo\":\"9\",\"varNm\":\"param7\",\"varVal\":\"" + param7 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"10\",\"varNm\":\"param8\",\"varVal\":\"" + param8 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"11\",\"varNm\":\"param9\",\"varVal\":\"" + param9 + "\",\"varDesc\":\"\"}]";

			StringBuilder requestData = new StringBuilder();

			requestData.append("mode=").append(URLEncoder.encode(mode,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa01")).append(URLEncoder.encode(reqTypeCd,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa02")).append(URLEncoder.encode(jmId,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa03")).append(URLEncoder.encode(jmPd,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa04")).append(URLEncoder.encode(targetCtgryPath,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa05")).append(URLEncoder.encode(execCrtronDt,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa06")).append(URLEncoder.encode(execReqDt,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa07")).append(URLEncoder.encode(indExecFl,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa08")).append(URLEncoder.encode(stTimeDelFl,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa09")).append(URLEncoder.encode(precdCondDelFl,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa10")).append(URLEncoder.encode(userConfirmFl,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa11")).append(URLEncoder.encode(reqTitle,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa12")).append(URLEncoder.encode(insertJsonData2,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa13")).append(URLEncoder.encode(execTypeCd,"UTF-8"));
			
			//con.setRequestProperty("Content-Length", Integer.toString(requestData.toString().getBytes().length));

			log.debug("[JOB-MIND]API Request URL :" + this.jmUrl);

			//POST 방식으로 데이터 송신
			out = con.getOutputStream();
			out.write(requestData.toString().getBytes("UTF-8"));
			out.flush();

			int responseCode = con.getResponseCode();	//응답코드. 200인 경우 success
			if(responseCode != 200) {
				errorMessage = "JOB-MIND 서버로부터 정상적인 응답이 아닙니다.[" + responseCode + "]";
				throw new Exception(errorMessage);				
			}
			log.info("[JOB-MIND]API Http Response Code: " + responseCode);
			
			log.debug("[JOB-MIND]API Request Data :" + requestData.toString());
			
			br = new BufferedReader(new InputStreamReader(con.getInputStream()));

			String inputLine;
			StringBuffer response = new StringBuffer();
			while ((inputLine = br.readLine()) != null) {
				response.append(inputLine);
			}
			log.debug("[JOB-MIND]API Response Data :" + response.toString());

			Map<String, Object> responseMap = JSONUtil.jsonObjectStringToMap(response.toString());
			
			String resultCode = (responseMap.containsKey("resultCode")) ? (String)responseMap.get("resultCode") : "";
			String resultMsg = (responseMap.containsKey("resultMsg")) ? (String)responseMap.get("resultMsg") : "";
			log.info("[JOB-MIND]API resultCode:" + resultCode);
			if("1000".equals(resultCode)) {	//성공
				result = "0";
				errorMessage = "";
			} else {
				result = "1";
				errorMessage = resultMsg;
			}
		} catch (Exception e) {
			log.error("[BatchUtil]Exception occurs!", e);
			errorMessage = e.getMessage();
			result = "1";
		} catch (Throwable t) {
			log.error("[BatchUtil]Throwble occurs!", t);
			errorMessage = t.getMessage();
			result = "1";
		} finally {
			resultMap.put(KEY_ERRMESSAGE, errorMessage);
			resultMap.put(KEY_RESULT, result);

			try {
				if (br != null) { br.close(); }
			} catch (IOException e) {
				log.error("[BatchUtil]Exception occurs!", e);
			}
			try {
				if (out != null) { out.close(); }
			} catch (IOException e) {
				log.error("[BatchUtil]Exception occurs!", e);
			}
			try {
				if (con != null) { con.disconnect(); }
			} catch (Exception e) {
				log.error("[BatchUtil]Exception occurs!", e);
			} catch (Throwable t) {
				log.error("[BatchUtil]Throwable occurs!", t);
			}
		}
		log.debug("resultMap:" + resultMap);
		return resultMap;
	}
	
	/**
	 * 
	 * @설명: 그룹핑 된 배치를 실행 실행한다. (운영계 - 임시)
	 * @최초작성자: 김동현
	 * @최초작성일: 2021. 6. 9.
	 * @최종변경일: 
	 * @매개변수: Map<String, String>
	 *  param1 : CategoryId
	 *  param2 : 마감년월
	 *  param3 : 파라미터 3
	 *  param4 : 파라미터 4
	 *  param5 : 파라미터 5
	 *  param6 : 파라미터 6
	 *  param7 : 파라미터 7
	 *  param8 : 파라미터 8
	 *  param9 : 파라미터 9
	 * @반환값: Map<String,String>
	 * @개정이력: 
	 *  61000305 2021. 6. 9. 그룹핑 된 배치를 실행 (운영계 - 임시)
	 */
	private Map<String, String> executeGroupBatchJobmind(Map<String, String> paramMap) {
		
		Map<String, String> resultMap = new HashMap<String, String>();
		
		URL url;
		HttpURLConnection con = null;
		OutputStream out = null;
		BufferedReader br = null;
		String errorMessage = null;	//에러메시지
		String result = null;
		
		try {
			String batchId = ""; //batchId는 Jobmind 작업정보에 등록되어 있음
			String userEno = (paramMap.containsKey("userEno")) ? (String)paramMap.get("userEno").trim() : "99999999";
			String param1 = (paramMap.containsKey("param1")) ? (String)paramMap.get("param1").trim() : "";
			String param2 = (paramMap.containsKey("param2")) ? (String)paramMap.get("param2").trim() : "";
			String param3 = (paramMap.containsKey("param3")) ? (String)paramMap.get("param3").trim() : "";
			String param4 = (paramMap.containsKey("param4")) ? (String)paramMap.get("param4").trim() : "";
			String param5 = (paramMap.containsKey("param5")) ? (String)paramMap.get("param5").trim() : "";
			String param6 = (paramMap.containsKey("param6")) ? (String)paramMap.get("param6").trim() : "";
			String param7 = (paramMap.containsKey("param7")) ? (String)paramMap.get("param7").trim() : "";
			String param8 = (paramMap.containsKey("param8")) ? (String)paramMap.get("param8").trim() : "";
			String param9 = (paramMap.containsKey("param9")) ? (String)paramMap.get("param9").trim() : "";
			log.info("executeBatchJobmind paramMap:" + paramMap);			
			
			String categoryId = paramMap.get("categoryId").trim();
			
			url = new URL(this.jmUrl);
			con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("POST");
			con.setConnectTimeout(this.jmConnectionTimeout);
			con.setReadTimeout(this.jmReadTimeout);
			con.setDoOutput(true);
			con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			con.setRequestProperty("Accept-Charset", "UTF-8");
			con.setUseCaches(false);
			
			String mode = "API";	//API 여부 구분값 (고정) 필수
			String reqTypeCd = "REQ_ACTJOB";	//요청 구분값(고정) 필수
			String jmId = this.jmId;			//요청자 ID 필수
			String jmPd = this.jmPd;			//요청장 계정 Password 필수
			
			//요청일자, 수행 기준일자는 16:00 전의 경의 이전일자, 16:00 이후의 경우 당일 일자로 처리한다.(ABL의 ODate 설정에 따름)
			//예를 들어 11:00에 당일자로 요청하면 14:00이후에 JobMind의 Odate가 바뀌므로 그 이후에 수행된다.
			int currentHour = Integer.parseInt(DateUtil.getCurrentDate("HH"));	//시간
			log.info("[executeBatchJobmind]Current hour:" + currentHour);
			String targetDate = DateUtil.getCurrentDate("yyyyMMdd");
			DateUtil.getDate(1, null, -1);
			if(currentHour < 16) {
				targetDate = DateUtil.getDate(1, targetDate , -1);	//이전일
			}
			log.info("[executeBatchJobmind]Target Date:" + targetDate);
			String execCrtronDt = targetDate;			//수행기준일자 필수
			String execReqDt	= targetDate;			//요청일자 필수 
			String indExecFl	= "Y";			//독립수행여부 필수 - 값이 Y이면 작업명과 컨티션에 고유번호가 붙어 독립적으로 수행
			String stTimeDelFl 	= "Y";			//시작시간 삭제여부 필수 - 값이 Y이면 기존 작업의 시작시간과 상관없이 수행
			String precdCondDelFl = "N";		//선행조건 삭제여부 필수 - 값이 Y이면 기존 작업의 선행조건과 상관없이 수행
			String userConfirmFl = "N";			//사용자확인여부 필수 - 값이 Y이면 무조건 사용자 확인 작업으로 등록
			String reqTitle 	 = "[API]수시작업요청#";	//요청명 선택 - 값이 없으면 임의 생성
			String execTypeCd    = "SCHED"; 			//정기작업 수시요청시 필수(정기작업 수시 요청은 정기작업으로 잡을 등록후 결재 완료 후 수시처리하는 JOB)
			
			
			String insertJsonData2 = "[{\"varOrdNo\":\"1\",\"varNm\":\"batchId\",\"varVal\":\"" + batchId + "\",\"varDesc\":\"\"}";		//매개변수 선택 - 요청시 매개변수 사용 -> [{"varOrdNo":"1", "varNm":"AAA"}]
			insertJsonData2 += ",{\"varOrdNo\":\"2\",\"varNm\":\"trtrEno\",\"varVal\":\"" + userEno + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"3\",\"varNm\":\"param1\",\"varVal\":\"" + param1 + "\",\"varDesc\":\"\"}";	
			insertJsonData2 += ",{\"varOrdNo\":\"4\",\"varNm\":\"param2\",\"varVal\":\"" + param2 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"5\",\"varNm\":\"param3\",\"varVal\":\"" + param3 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"6\",\"varNm\":\"param4\",\"varVal\":\"" + param4 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"7\",\"varNm\":\"param5\",\"varVal\":\"" + param5 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"8\",\"varNm\":\"param6\",\"varVal\":\"" + param6 + "\",\"varDesc\":\"\"}";	
			insertJsonData2 += ",{\"varOrdNo\":\"9\",\"varNm\":\"param7\",\"varVal\":\"" + param7 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"10\",\"varNm\":\"param8\",\"varVal\":\"" + param8 + "\",\"varDesc\":\"\"}";
			insertJsonData2 += ",{\"varOrdNo\":\"11\",\"varNm\":\"param9\",\"varVal\":\"" + param9 + "\",\"varDesc\":\"\"}]";

			log.info("------------------------------batchId:" + batchId);
			log.info("------------------------------userEno:" + userEno);
			log.info("------------------------------categoryId:" + categoryId);
			
			log.info("------------------------------param1:" + param1);
			log.info("------------------------------param2:" + param2);
			log.info("------------------------------param3:" + param3);
			log.info("------------------------------param4:" + param4);
			log.info("------------------------------param5:" + param5);
			log.info("------------------------------param6:" + param6);
			log.info("------------------------------param7:" + param7);
			log.info("------------------------------param8:" + param8);
			log.info("------------------------------param9:" + param9);
			
			StringBuilder requestData = new StringBuilder();

			requestData.append("mode=").append(URLEncoder.encode(mode,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa01")).append(URLEncoder.encode(reqTypeCd,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa02")).append(URLEncoder.encode(jmId,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa03")).append(URLEncoder.encode(jmPd,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa04")).append(URLEncoder.encode(categoryId,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa05")).append(URLEncoder.encode(execCrtronDt,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa06")).append(URLEncoder.encode(execReqDt,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa07")).append(URLEncoder.encode(indExecFl,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa08")).append(URLEncoder.encode(stTimeDelFl,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa09")).append(URLEncoder.encode(precdCondDelFl,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa10")).append(URLEncoder.encode(userConfirmFl,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa11")).append(URLEncoder.encode(reqTitle,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa12")).append(URLEncoder.encode(insertJsonData2,"UTF-8"));
			requestData.append("&").append(FwkProperties.getProperty("onlinebatch.pa13")).append(URLEncoder.encode(execTypeCd,"UTF-8"));
			
			log.info("------------------------------mode:" + mode);
			log.info("------------------------------reqTypeCd:" + reqTypeCd);
			log.info("------------------------------jmId:" + jmId);
			log.info("------------------------------jmPd:" + jmPd);
			
			log.info("------------------------------execCrtronDt:" + execCrtronDt);
			log.info("------------------------------execReqDt:" + execReqDt);
			log.info("------------------------------indExecFl:" + indExecFl);
			log.info("------------------------------stTimeDelFl:" + stTimeDelFl);
			log.info("------------------------------precdCondDelFl:" + precdCondDelFl);
			log.info("------------------------------userConfirmFl:" + userConfirmFl);
			log.info("------------------------------reqTitle:" + reqTitle);
			log.info("------------------------------insertJsonData2:" + insertJsonData2);
			log.info("------------------------------execTypeCd:" + execTypeCd);
			
			log.info("[JOB-MIND]API Request Data :" + requestData.toString());
			
			//con.setRequestProperty("Content-Length", Integer.toString(requestData.toString().getBytes().length));

			//logger.debug("[JOB-MIND]API Request URL :" + this.jmUrl);

			//POST 방식으로 데이터 송신
			out = con.getOutputStream();
			out.write(requestData.toString().getBytes("UTF-8"));
			out.flush();
		
			int responseCode = con.getResponseCode();	//응답코드. 200인 경우 success
			
			log.info("responseCode : " + responseCode);
			if(responseCode != 200) {
				errorMessage = "JOB-MIND 서버로부터 정상적인 응답이 아닙니다.[" + responseCode + "]";
				throw new Exception(errorMessage);				
			}
			//logger.info("[JOB-MIND]API Http Response Code: " + responseCode);
			
			br = new BufferedReader(new InputStreamReader(con.getInputStream()));

			String inputLine;
			StringBuffer response = new StringBuffer();
			while ((inputLine = br.readLine()) != null) {
				response.append(inputLine);
			}
			//logger.debug("[JOB-MIND]API Response Data :" + response.toString());

			Map<String, Object> responseMap = JSONUtil.jsonObjectStringToMap(response.toString());
			
			String resultCode = (responseMap.containsKey("resultCode")) ? (String)responseMap.get("resultCode") : "";
			String resultMsg = (responseMap.containsKey("resultMsg")) ? (String)responseMap.get("resultMsg") : "";
			//logger.info("[JOB-MIND]API resultCode:" + resultCode);
			
			if("1000".equals(resultCode)) {	//성공
				result = "0";
				errorMessage = "";
			} else {
				result = "1";
				errorMessage = resultMsg;
			}
		} catch (Exception e) {
			log.error("[BatchUtil]Exception occurs!", e);
			errorMessage = e.getMessage();
			result = "1";
		} catch (Throwable t) {
			log.error("[BatchUtil]Throwble occurs!", t);
			errorMessage = t.getMessage();
			result = "1";
		} finally {
			resultMap.put(KEY_ERRMESSAGE, errorMessage);
			resultMap.put(KEY_RESULT, result);

			try {
				if (br != null) { br.close(); }
			} catch (IOException e) {
				log.error("[BatchUtil]Exception occurs!", e);
			}
			try {
				if (out != null) { out.close(); }
			} catch (IOException e) {
				log.error("[BatchUtil]Exception occurs!", e);
			}
			try {
				if (con != null) { con.disconnect(); }
			} catch (Exception e) {
				log.error("[BatchUtil]Exception occurs!", e);
			} catch (Throwable t) {
				log.error("[BatchUtil]Throwable occurs!", t);
			}
		}
		log.debug("resultMap:" + resultMap);
		return resultMap;
	}
	
	/**
	 * @설명: 개발계용으로 배치 Shell을 직접 실행한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: HashMap paramMap
	 * 	batchId : 배치 ID
	 *  param1 : 파라미터 1
	 *  param2 : 파라미터 2
	 *  param3 : 파라미터 3
	 *  param4 : 파라미터 4
	 *  param5 : 파라미터 5
	 *  param6 : 파라미터 6
	 *  param7 : 파라미터 7
	 *  param8 : 파라미터 8
	 *  param9 : 파라미터 9
	 * @반환값: HashMap
	 * @개정이력: 
	 *  장창환 2020. 12. 28. 최초작성
	 */
	public Map<String, String> executeBatchShell(Map<String, String> paramMap) {
		return executeBatchShell(paramMap, "/LIB/ifrs17Batch/shell/ifrs17Batch.sh");
	}	

	/**
	 * @설명: 개발계용으로 배치 Shell을 Bagcground로 실행한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: HashMap paramMap
	 * 	batchId : 배치 ID
	 *  param1 : 파라미터 1
	 *  param2 : 파라미터 2
	 *  param3 : 파라미터 3
	 *  param4 : 파라미터 4
	 *  param5 : 파라미터 5
	 *  param6 : 파라미터 6
	 *  param7 : 파라미터 7
	 *  param8 : 파라미터 8
	 *  param9 : 파라미터 9
	 * @반환값: HashMap
	 * @개정이력: 
	 *  장창환 2020. 12. 28. 최초작성
	 */
	public Map<String, String> executeBatchBgShell(Map<String, String> paramMap) {
		return executeBatchShell(paramMap, "/LIB/ifrs17Batch/shell/ifrs17BatchBg.sh");
	}	
	
	
	/**
	 * @설명: 개발계용으로 배치 Shell을 직접 실행한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일: 
	 * @매개변수: HashMap paramMap
	 * 	batchId : 배치 ID
	 *  param1 : 파라미터 1
	 *  param2 : 파라미터 2
	 *  param3 : 파라미터 3
	 *  param4 : 파라미터 4
	 *  param5 : 파라미터 5
	 *  param6 : 파라미터 6
	 *  param7 : 파라미터 7
	 *  param8 : 파라미터 8
	 *  param9 : 파라미터 9
	 * @매개변수: String shell
	 * @반환값: HashMap
	 * @개정이력: 
	 *  장창환 2020. 12. 28. 최초작성
	 */
	private Map<String, String> executeBatchShell(Map<String, String> paramMap, String shell) {
		Map<String, String> resultMap = new HashMap<String, String>();
		String retCd = "";	//0:성공 1:실패
		String retOutput = "";	//log
		String errorMessage = ""; //error message
		
		try {
			log.info("executeBatchShell paramMap:" + paramMap);			
			
			String batchId = (paramMap.containsKey("batchId")) ? (String)paramMap.get("batchId").trim() : "";
			String userEno = (paramMap.containsKey("userEno")) ? (String)paramMap.get("userEno").trim() : "99999999";
			String param1 = (paramMap.containsKey("param1")) ? (String)paramMap.get("param1").trim() : "";
			String param2 = (paramMap.containsKey("param2")) ? (String)paramMap.get("param2").trim() : "";
			String param3 = (paramMap.containsKey("param3")) ? (String)paramMap.get("param3").trim() : "";
			String param4 = (paramMap.containsKey("param4")) ? (String)paramMap.get("param4").trim() : "";
			String param5 = (paramMap.containsKey("param5")) ? (String)paramMap.get("param5").trim() : "";
			String param6 = (paramMap.containsKey("param6")) ? (String)paramMap.get("param6").trim() : "";
			String param7 = (paramMap.containsKey("param7")) ? (String)paramMap.get("param7").trim() : "";
			String param8 = (paramMap.containsKey("param8")) ? (String)paramMap.get("param8").trim() : "";
			String param9 = (paramMap.containsKey("param9")) ? (String)paramMap.get("param9").trim() : "";
			
			StringBuilder param = new StringBuilder();
			if(param1.length() > 0) param.append(param1);
			if(param2.length() > 0) param.append(" ").append(param2);
			if(param3.length() > 0) param.append(" ").append(param3);
			if(param4.length() > 0) param.append(" ").append(param4);
			if(param5.length() > 0) param.append(" ").append(param5);
			if(param6.length() > 0) param.append(" ").append(param6);
			if(param7.length() > 0) param.append(" ").append(param7);
			if(param8.length() > 0) param.append(" ").append(param8);
			if(param9.length() > 0) param.append(" ").append(param9);

			RunnerUtil ru = new RunnerUtil();
			
			//execute batch
			String [] cmd = {"/bin/sh", shell, batchId + " " + userEno + " " + param.toString()};
			
			Map retMap = ru.execCommand(cmd);
			retCd = (String)retMap.get(0);	//0:성공 1:실패
			retOutput = (String)retMap.get(1);
			log.debug("retMap:" + retMap);
			log.debug("retCd:" + retCd);
			log.debug("retOutput:" +retOutput);
			resultMap = new HashMap();
			
		} catch(Exception e) {
			log.error("Exception Occurs!", e);
			retCd = "1";
			errorMessage = e.getMessage();
		}  finally {
			resultMap.put(KEY_RESULT, retCd);
			resultMap.put(KEY_ERRMESSAGE, errorMessage);
			resultMap.put(KEY_LOG, retOutput);
		}
		
		return resultMap;
	}	
	
}
