package kr.co.wllife.acs.online.mg.sy.web;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.FileUtils;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.wllife.acs.online.fwk.com.cmm.FwkWebUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.exception.Warning;
import kr.co.wllife.acs.online.fwk.com.cmm.util.DateUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.DrmUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.FwkProperties;
import kr.co.wllife.acs.online.fwk.com.cmm.util.FileDownloadUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.FileUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.JSONUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.SessionUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.StringUtil;
import kr.co.wllife.acs.online.fwk.rte.psl.dataaccess.util.FwkMap;
import kr.co.wllife.acs.online.mg.sy.service.CodeService;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @시스템명: IFRS17
 * @업무명: 공통
 * @설명: 공통 기능을 담당한다.
 * @최초작성자: 장창환
 * @최초작성일: 2020. 12. 30
 * @최종변경일: 2020. 12. 30
 * @개정이력: 장창환 2020. 12. 30. 최초작성
 */
@Slf4j 
@Controller
public class CommonController {

	@Resource(name = "codeService")
	private CodeService codeService;
	
	/**
	 * 
	 * @설명: 업로드한 CSV를 파싱하여 화면 그리드에 바인딩한다.
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 1. 12.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: ModelAndView
	 * @개정이력: 89001203 2021. 1. 12. 최초작성
	 */
	@RequestMapping(value = "/common/loadGridByCSV.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView loadGridByCSV(@RequestParam Map<String, String> reqMap, @RequestParam("_gridImportfile") MultipartFile multipartFile) throws Exception {
		ModelAndView result = new ModelAndView("jsonView");
		log.debug("reqMap:" + reqMap);
		InputStream is = null;
		InputStreamReader ir = null;
		boolean markingStatus = true; // status:e 항목 사용여부
		boolean drmChk = false;
		String decFileName = "";
		File  deleteOrginFile = null;
		File  deleteDecFile = null;
		
		try {
			String rtnStr = null;
			String pattern = "yyyyMMddHHmmssSSSSSS"; // 문자열로 변환하기 위한 패턴 설정(년도-월-일 시:분:초.초(자정이후 초))
			
			SimpleDateFormat sdfCurrent = new SimpleDateFormat(pattern, Locale.KOREA);
			Timestamp ts = new Timestamp(System.currentTimeMillis());
		
			rtnStr = sdfCurrent.format(ts.getTime());
			
			String rootPath = FwkProperties.getProperty("drm.sharePath");
			int ranNum = (int)(Math.random()*1000000000);
			String fileName = rtnStr + ranNum + ".csv";

			String newFile = rootPath + "/" + fileName;
			
			deleteOrginFile = new File(newFile);		//암호화 파일 서버에서 지우기 용도
			String deleteDecFileName = newFile.replace(".csv", "_Dec.csv");
			deleteDecFile = new File(deleteDecFileName);	//복호화된 파일 서버에서 지우기 용도
			
			log.info("fileName:" + fileName);
			if (!fileName.toLowerCase().endsWith(".csv")) {
				throw new Warning("EACU007", "지원하지 않는 파일 형식입니다.");
			}

			String limitSizeStr = FwkProperties.getProperty("mgsy.limitCsvUploadSize");
			if (limitSizeStr != null && limitSizeStr.trim().length() > 0) {
				long limitSize = Long.parseLong(limitSizeStr) * 1024 * 1024;
				log.info("limit size:" + limitSize + "byte");
				log.info("file size:" + (multipartFile.getSize()) + "byte");
				if (limitSize < multipartFile.getSize()) {
					throw new Warning("EACU007", "파일사이즈가 허용기준을 초과합니다.\n[허용기준:" + limitSizeStr + "MB이내]\n");
				}
			}

			Map<String, Map> fileTitleMap = new HashMap<>(); // field title로 fieldMap을 얻어오기 위함.
			Map<String, Map> fileNameMap = new HashMap<>(); // field name으로 fieldMap을 얻어오기 위함.
			List<Map> fieldList = JSONUtil.jsonArrayStringToList(reqMap.get("_fields"));
			
			log.debug("fieldList.size:" + fieldList.size());
			for (int i = 0; i < fieldList.size(); i++) {
				Map fieldItem = fieldList.get(i);
				String title = (String) fieldItem.get("title");
				String name = (String) fieldItem.get("name");
				fileTitleMap.put(title.trim(), fieldItem);
				fileNameMap.put(name.trim(), fieldItem);
			}
			
			log.info("===fileTitleMap:" + fileTitleMap);
			log.info("===fileNameMap:" + fileNameMap);
			
			String localAddress = FwkProperties.getProperty("prj.localAddress"); 
			
			if (localAddress.equals(SessionUtil.getClientIp())) {
				is = multipartFile.getInputStream();
			} else {
				/*if(drmChk){			*/				
					
				File targetFile = new File(newFile);
				InputStream fileStream = multipartFile.getInputStream();
				FileUtils.copyInputStreamToFile(fileStream, targetFile);
				
				DrmUtil du = new DrmUtil();
				
				if(du.streamFileChk(newFile)){
				
					decFileName = du.streamDec(newFile);							
					// 스트림 데이터
					is = new BufferedInputStream(new FileInputStream(decFileName));
					drmChk = true;
					
				}
				else {
				// Check Charset
					is = multipartFile.getInputStream();							
				}
			}
			
			byte[] BOM = new byte[4];
			is.read(BOM, 0, 4);
			String charset = "EUC-KR";
			if (StringUtil.isUFT8BOM(new String(BOM, "UTF-8"))) { // UTF-8
				log.info("detected UTF-8 charset!!");
				charset = "UTF-8";
			}
			
			if (localAddress.equals(SessionUtil.getClientIp())) {
				is = multipartFile.getInputStream();
			} else{
				if(drmChk){										
					is = new BufferedInputStream(new FileInputStream(decFileName));
				}
				else {
				// Check Charset
					is = multipartFile.getInputStream();
				}
			}
			
			ir = new InputStreamReader(is, charset);
			Iterable<CSVRecord> records = CSVFormat.EXCEL.parse(ir);
			int gridHeaderIndex = 0;

			List<Map> headFieldList = new ArrayList<>();
			List<FwkMap> list = new ArrayList<>();
			int i = 0;
			for (CSVRecord record : records) {
				String[] line = new String[record.size()];
				FwkMap item = new FwkMap();

				if (i == 0) { // 그리드 헤더정보를 이용하여 데이터가 사용하는 fieldList 생성
			
					for (int j = 0; j < record.size(); j++) {
						String value = record.get(j);
						log.info("value 1 " + value);
	
						value = StringUtil.removeUFT8BOM(value);
						log.info("value 2 " + value);		
								
						if (value.startsWith("\t")) {
							value = value.substring(1).trim();
							log.info("value 3 " + value);
							
						}
						//logger.debug("==== header value[" + j + "]:" + value + ":");
						Map fieldMap = fileTitleMap.get(new String(value));
						//logger.debug("==== header Map[" + j + "]:" + fieldMap + ":");
						if (fieldMap != null) {
							headFieldList.add(fieldMap);
						}
					}

					if (log.isDebugEnabled()) {
						log.debug("============Header Mapping Info============");
						for (int j = 0; j < headFieldList.size(); j++) {
							Map fieldMap = headFieldList.get(j);
							//logger.debug("title:" + fieldMap.get("title") + ",name:" + fieldMap.get("name"));
						}
						//logger.debug("===========================================");
					}
				}

				if (i > gridHeaderIndex) {
					for (int j = 0; j < record.size(); j++) {
						Map fieldMap = headFieldList.get(j);
						String name = (String) fieldMap.get("name");
						String title = (String) fieldMap.get("title");
						String type = (String) fieldMap.get("type");
						String value = record.get(j);
						// CSV 숫자길이가 긴 경우 처음 디스플레이가 진수 변환으로 보여짐에 따라 \\t을 VALUE
						// 앞에 추가함. 따라서 제거필요.
						if (value.startsWith("\t")) {
							value = value.substring(1);
						}
						item.put(name, value);
					}

					if (markingStatus) {
						item.put("status", "e");
					}

					list.add(item);
				}
				i++;
			}
			result.addObject("list", list);
			result.addObject("result", "1");
		} catch (IOException e) {
			log.error("Exception Occurs!", e);
			throw e;
		} finally {
			try{
				FileUtils.deleteQuietly(deleteOrginFile);	//암호화된 파일
				FileUtils.deleteQuietly(deleteDecFile);		//복호화한 파일
			}catch(Exception e){
				log.error("Exception Occurs!", e);
			}
			try {
				if (is != null)
					is.close();
			} catch (IOException ee) {
				log.error("Exception Occurs!", ee);
			}
			try {
				if (ir != null)
					ir.close();
			} catch (IOException ee) {
				log.error("Exception Occurs!", ee);
			}
		}
		return result;
	}
	
	/**
	 * @설명: 암호화 파일로 만든다.
	 * @최초작성자: 김동현
	 * @최초작성일: 2021.04.15
	 * @최종변경일:
	 * @매개변수: 
	 * @반환 값: String
	 * @개정이력: 김동현 2021.04.15 최초작성
	 */
	@RequestMapping(value = "/common/makeStreamDn.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView makeStreamDn(@RequestParam Map<String, String> reqMap, HttpServletRequest request, HttpServletResponse response) throws Exception {
		ModelAndView result = new ModelAndView("jsonView");
		
		System.out.println("fields : " + reqMap.get("paramFields"));
		System.out.println("data : " + reqMap.get("paramData"));
		XSSFWorkbook workbook = null;
		Map<String, Map> fileTitleMap = new HashMap(); // field title로 fieldMap을 얻어오기 위함.
		Map<String, Map> fileNameMap = new HashMap(); // field name으로 fieldMap을 얻어오기 위함.
		XSSFWorkbook curWbook = new XSSFWorkbook();
		XSSFSheet curSheet = null;
		XSSFRow curRow = null;
		XSSFCell curCell = null;
		String outfile = null;
		/*BufferedInputStream bin = null;
		OutputStream bout = null;*/
		
		
		try{
			String rtnStr = null;
			String pattern = "yyyyMMddHHmmssSSSSSS"; // 문자열로 변환하기 위한 패턴 설정(년도-월-일 시:분:초.초(자정이후 초))
			
			SimpleDateFormat sdfCurrent = new SimpleDateFormat(pattern, Locale.KOREA);
			Timestamp ts = new Timestamp(System.currentTimeMillis());
		
			rtnStr = sdfCurrent.format(ts.getTime());
			String rootPath = FwkProperties.getProperty("drm.sharePath");
			String fileName = rtnStr + ".xlsx";
			
			String newFile = rootPath + "/" + fileName;
			newFile = FwkWebUtil.filePathBlackList(newFile);
		
			int row_num = 0;
			curSheet = curWbook.createSheet("sheet1");
			
			List<Map> fieldList = JSONUtil.jsonArrayStringToList(reqMap.get("paramFields"));

			
			int fieldSize = fieldList.size() - 2;
			curRow = curSheet.createRow(row_num++);
			
			FileOutputStream output = new FileOutputStream(newFile);
			
			String[] titleList = new String[fieldSize];
			
			for (int i = 0; i < fieldSize; i++){
				String title = (String) fieldList.get(i).get("title");
				curCell = curRow.createCell(i);
				curCell.setCellValue(title);
				titleList[i] = (String) fieldList.get(i).get("name");
			}
				
			List<Map> dataList = JSONUtil.jsonArrayStringToList(reqMap.get("paramData"));
			
			for (int i = 0; i<dataList.size(); i++){
				curRow = curSheet.createRow(row_num++);
				
				Map m = dataList.get(i);
				
				for (int j= 0; j<m.size(); j++){	
					String value= (String) m.get(titleList[j]);
					curCell = curRow.createCell(j);
					curCell.setCellValue(value);
				}
			}
			
				
			curWbook.write(output);
			output.close();
			System.out.println("생성 완료");
			
			DrmUtil du = new DrmUtil();
			
			//암호화파일이 아니면 암호화 진행
			if (!du.streamFileChk(newFile)) {
				
				outfile = du.streamDn(newFile);
				
				result.addObject("filePath", outfile);
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		(this).downloadFile(outfile, request, response);
		return result;
	}
	
	/**
	 * 
	 * @설명: 업로드한 Excel 파일을 파싱하여 화면 그리드에 바인딩한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 1. 12.
	 * @최종변경일:
	 * @매개변수:
	 * @반환값: ModelAndView
	 * @개정이력: 장창환 2021. 1. 12. 최초작성
	 */

	@RequestMapping(value = "/common/loadGridByExcel.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView loadGridByExcel(@RequestParam Map<String, String> reqMap,
			@RequestParam("_gridImportfile") MultipartFile multipartFile) throws Exception {
		ModelAndView result = new ModelAndView("jsonView");

		InputStream fis = null;
		XSSFWorkbook workbook = null;
		boolean markingStatus = true; // status:e 항목 사용여부
		Map<String, Map> fileTitleMap = new HashMap(); // field title로 fieldMap을
														// 얻어오기 위함.
		Map<String, Map> fileNameMap = new HashMap(); // field name으로 fieldMap을
														// 얻어오기 위함.
		File deleteOrginFile = null;
		File deleteDecFile = null;
		String rootPath = "";

		try {
			
			String rtnStr = null;
			String pattern = "yyyyMMddHHmmssSSSSSS"; // 문자열로 변환하기 위한 패턴
														// 설정(년도-월-일
														// 시:분:초.초(자정이후 초))

			SimpleDateFormat sdfCurrent = new SimpleDateFormat(pattern, Locale.KOREA);
			Timestamp ts = new Timestamp(System.currentTimeMillis());

			rtnStr = sdfCurrent.format(ts.getTime());

			rootPath = FwkProperties.getProperty("drm.sharePath");

			/* String rootPath = EgovProperties.getProperty("drm.sharePath"); */
			int ranNum = (int)(Math.random()*1000000000);
			String fileName = rtnStr + ranNum + ".xlsx";

			String newFile = rootPath + "/" + fileName;
			newFile = FwkWebUtil.filePathBlackList(newFile);

			deleteOrginFile = new File(newFile); // 암호화 파일 서버에서 지우기 용도

			String deleteDecFileName = newFile.replace(".xlsx", "_Dec.xlsx");
			deleteDecFile = new File(deleteDecFileName); // 복호화된 파일 서버에서 지우기 용도

			log.debug("reqMap:" + reqMap);
			log.info("fileName:" + fileName);

			String limitSizeStr = FwkProperties.getProperty("mgsy.limitExcelUploadSize");
			if (limitSizeStr != null && limitSizeStr.trim().length() > 0) {
				long limitSize = Long.parseLong(limitSizeStr) * 1024 * 1024;
				log.info("limit size:" + limitSize + "byte");
				log.info("file size:" + (multipartFile.getSize()) + "byte");
				if (limitSize < multipartFile.getSize()) {
					throw new Warning("EACU007", "파일사이즈가 허용기준을 초과합니다.\n[허용기준:" + limitSizeStr + "MB이내]\n");
				}
			}

			if (!fileName.toLowerCase().endsWith(".xlsx")) {
				throw new Warning("EACU007", "지원하지 않는 파일 형식입니다.");
			}

			List<Map> fieldList = JSONUtil.jsonArrayStringToList(reqMap.get("_fields"));

			log.debug("fieldList.size:" + fieldList.size());
			
			for (int i = 0; i < fieldList.size(); i++) {
				Map fieldItem = fieldList.get(i);
				String title = (String) fieldItem.get("title");
				String name = (String) fieldItem.get("name");
				fileTitleMap.put(title.trim(), fieldItem);
				fileNameMap.put(name.trim(), fieldItem);
			}
			
			String localAddress = FwkProperties.getProperty("prj.localAddress"); 
			
			if (localAddress.equals(SessionUtil.getClientIp())) {
				fis = multipartFile.getInputStream();
			} else {
				File targetFile = new File(newFile);
				InputStream fileStream = multipartFile.getInputStream();
				FileUtils.copyInputStreamToFile(fileStream, targetFile);
				DrmUtil du = new DrmUtil();

				// 암호화 파일인지 체크
				if (du.streamFileChk(newFile)) {
					// 암호화 파일이면 복호화 실행
					String decFileName = du.streamDec(newFile);
					// 스트림 데이터
					fis = new BufferedInputStream(new FileInputStream(decFileName));
				}
				// HSSFWorkbook은 엑셀파일 전체 내용을 담고 있는 객체
				else {
					fis = multipartFile.getInputStream();
				}
			}

			workbook = new XSSFWorkbook(fis);

			// 탐색에 사용할 Sheet, Row, Cell 객체
			XSSFSheet curSheet;
			XSSFRow curRow;
			XSSFCell curCell;
			Map<String, String> item;
			int gridHeaderIndex = 0;

			List<Map> headFieldList = new ArrayList();
			List<Map> list = new ArrayList();

			// Sheet 탐색 for문
			for (int sheetIndex = 0; sheetIndex < workbook.getNumberOfSheets(); sheetIndex++) {
				if (workbook.isSheetHidden(sheetIndex) || workbook.isSheetVeryHidden(sheetIndex)) {
					log.info("skip hidden sheet:" + sheetIndex);
					continue;
				}
				// 현재 Sheet 반환
				curSheet = workbook.getSheetAt(sheetIndex);

				for (int rowIndex = 0; rowIndex < curSheet.getPhysicalNumberOfRows(); rowIndex++) {

					curRow = curSheet.getRow(rowIndex);

					item = new HashMap();
					String value;
					if (rowIndex == 0) { // 그리드 헤더정보를 이용하여 데이터가 사용하는 fieldList
											// 생성

						curRow = curSheet.getRow(rowIndex);
						for (int cellIndex = 0; cellIndex < curRow.getPhysicalNumberOfCells(); cellIndex++) {
							curCell = curRow.getCell(cellIndex);
							value = this.cellReader(curCell);
							Map fieldMap = fileTitleMap.get(new String(value));
							if (fieldMap != null) {
								headFieldList.add(fieldMap);
							}
						}

						if (log.isDebugEnabled()) {
							log.debug("============Header Mapping Info============");
							for (int j = 0; j < headFieldList.size(); j++) {
								Map fieldMap = headFieldList.get(j);
								log.debug("title:" + fieldMap.get("title") + ",name:" + fieldMap.get("name"));
							}
							log.debug("===========================================");
						}
					}

					if (rowIndex > gridHeaderIndex) {
						curRow = curSheet.getRow(rowIndex);

						for (int cellIndex = 0; cellIndex < curRow.getLastCellNum(); cellIndex++) {
							curCell = curRow.getCell(cellIndex);
							value = this.cellReader(curCell);
							Map fieldMap = headFieldList.get(cellIndex);
							String name = (String) fieldMap.get("name");
							String title = (String) fieldMap.get("title");
							// logger.debug("[" + rowIndex + "-"+ cellIndex +
							// "]name:" + name + ",title:" + title);
							String type = (String) fieldMap.get("type");
							item.put(name, value);
						}
						if (markingStatus) {
							item.put("status", "e");
						}
						list.add(item);
					}
				}
			}
			result.addObject("list", list);
			result.addObject("result", "1");
		} catch (IOException e) {
			log.error("IOException Occurs!", e);
			throw e;
		} finally {
			try {
				// 암호화 파일 업로드한거 지우기
				FileUtils.deleteQuietly(deleteOrginFile); // 암호화된 파일
				FileUtils.deleteQuietly(deleteDecFile); // 복호화한 파일
			} catch (Exception e) {
				log.error("IOException Occurs!", e);
			}
			try {
				// 사용한 자원은 finally에서 해제

				if (workbook != null)
					workbook.close();
				if (fis != null)
					fis.close();
			} catch (IOException e) {
				log.error("IOException Occurs!", e);
			}
		}
		return result;
	}

	/**
	 * @설명: XLSX CELL의 유형별 값을 조회한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021.01.18
	 * @최종변경일:
	 * @매개변수: XSSFCell
	 * @반환 값: String
	 * @개정이력: 장창환 2021.01.18 최초작성
	 */
	private static String cellReader(XSSFCell cell) {
		DataFormatter fmt  = new DataFormatter();
		String value = "";
		if (cell == null) {
			return value;
		}
		CellType ct = cell.getCellType();
		if (ct != null) {
			switch (cell.getCellType()) {
			case FORMULA:
				value = cell.getCellFormula();
				break;
			case NUMERIC:
				// 엑셀 일반 타입으로 날짜(20210101) 입력 -> Numeric으로 파싱 -> 지수형태로 나오는 문제 처리
				// value = Double.toString(cell.getNumericCellValue()); ==>
				// 20000 -> 20000.0으로 나오는 문제
				//cell.setCellType(XSSFCell.CELL_TYPE_STRING);
				//value = cell.getStringCellValue();
				value = fmt.formatCellValue(cell).toString();
				break;
			case STRING:
				value = cell.getStringCellValue() + "";
				break;
			case BOOLEAN:
				value = cell.getBooleanCellValue() + "";
				break;
			case ERROR:
				value = cell.getErrorCellValue() + "";
				break;
			default:
				value = new String();
				break;
			}
		}
		return value;
	}

	/**
	 * @설명: 공통코드 목록을 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2021.01.18
	 * @최종변경일:
	 * @매개변수: Map<String, String>
	 * @반환 값: ModelAndView
	 * @개정이력: 장창환 2021.01.18 최초작성
	 */
	@RequestMapping(value = "/common/selectCommonCodeList.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView selectCommonCodeList(@RequestParam Map<String, String> reqMap) throws Exception {
		Map resultMap = new HashMap<>();

		List<Map> list = JSONUtil.jsonArrayStringToList(reqMap.get("list"));
		resultMap = codeService.selectCommonCodeList(list);
		ModelAndView mav = new ModelAndView("jsonView", resultMap);
		return mav;
	}

	/**
	 * 
	 * @설명: 메인화면 호출
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 30.
	 * @최종변경일: 2020. 12. 30.
	 * @매개변수:
	 * @반환값: String
	 * @개정이력: 장창환 2020. 12. 30. 최초작성
	 */
	@RequestMapping("/mg/sy/mgsy911m.do")
	public String dwnConter(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		return "mgsy/mgsy911m";
	}

	/**
	 * @설명: 개발 프로젝트 공유 폴더 리스트 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일:
	 * @매개변수: reqMap
	 * @반환값: ModelAndView
	 * @개정이력: 장창환 2020. 12. 28. 최초작성
	 */
	@RequestMapping(value = "/mg/sy/mgsy911m/selectPathPathTree.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView selectPathTree(@RequestParam Map<String, String> reqMap) throws Exception {

		String rootPath = FwkProperties.getProperty("prj.sharePath");
		log.debug("====rootPath:" + rootPath);
		if ("C:/temp".equals(rootPath)) {
			log.debug("====rootPath equals:" + true);
		} else {
			log.debug("====rootPath equals:" + false);
		}
		File rootF = new File(rootPath);
		System.out.println("seoyoung"+rootF);
		FwkMap map = selectPathTree(rootF, 0, null, null, 1); // js에서 ajax통신 ->
																// sql 조회한 data가
																// list형태로 들어옴.
		ModelAndView result = new ModelAndView("jsonView", map);
		return result;
	}

	/**
	 * @설명: 개발 프로젝트 공유 폴더 리스트 조회
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일:
	 * @매개변수: reqMap
	 * @반환값: ModelAndView
	 * @개정이력: 장창환 2020. 12. 28. 최초작성
	 */
	private FwkMap selectPathTree(File f, int depth, String parentId, List<FwkMap> list, int seq) {
		if (list == null)
			list = new ArrayList<FwkMap>();
		if (parentId == null)
			parentId = "";
		if (f == null || !f.exists()) {
			log.info("file is null or not exists!!");
			return null;
		}
		FwkMap map = new FwkMap();
		String id = f.getAbsolutePath();
		map.put("treeId", id);
		map.put("treeNm", f.getName());
		if (f.isDirectory()) {
			map.put("treeTypCd", "1"); // 1:폴더, 2:파일
		} else {
			map.put("treeTypCd", "2"); // 1:폴더, 2:파일
		}
		map.put("treeLvl", depth);
		map.put("treeSeq", seq);
		if (depth > 0) {
			map.put("uppTreeId", parentId);
		}
		long lastModified = f.lastModified();
		String dateTime = DateUtil.getFormattedDate(lastModified, "yyyy-MM-dd HH:mm:ss");
		map.put("chgDtm", dateTime);

		double size = f.length(); // byte
		map.put("size", size);

		if (f.isDirectory()) {
			List<FwkMap> subList = new ArrayList();
			File[] listFiles = f.listFiles();
			// logger.debug("===list:" + listFiles.length);
			int subSeq = 1;
			for (int i = 0; i < listFiles.length; i++) {
				File subFile = listFiles[i];
				int subDepth = depth + 1;
				selectPathTree(subFile, subDepth, id, subList, subSeq++);
			}
			map.put("children", subList);
		}
		list.add(map);
		return map;
	}

	/**
	 * @설명: 파일다운로드
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일:
	 * @매개변수: reqMap
	 * @반환값: ModelAndView
	 * @개정이력: 장창환 2020. 12. 28. 최초작성
	 */
	@RequestMapping(value = "/mg/sy/mgsy911m/downloadFile.do")
	@ResponseBody
	public void downloadFile(@RequestParam String filePath, HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		// &지원처리
		filePath = JSONUtil.decodeJSONString(filePath);
		String rootPath = FwkProperties.getProperty("prj.sharePath");
		if (filePath == null) {
			throw new Exception("fileId null!");
		}

		String osName = System.getProperty("os.name");
		if (osName != null && osName.toLowerCase().contains("window")) {
			filePath = filePath.replaceAll("\\\\", "/");
		}
		filePath = FwkWebUtil.filePathBlackList(filePath);
/*
		if (!filePath.startsWith(rootPath)) {
			throw new Exception("[" + rootPath + "]하위의 파일만 다운로드 가능합니다.");
		}*/

		Map<String, String> downloadMap = new HashMap();
		downloadMap.put("filePath", filePath);
		
		log.info("downloadFile filePath : "+ filePath);
		FileDownloadUtil.downloadFile(downloadMap, request, response);
	}

	/**
	 * @설명: 파일다운로드
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일:
	 * @매개변수: reqMap
	 * @반환값: ModelAndView
	 * @개정이력: 장창환 2020. 12. 28. 최초작성
	 */
	@RequestMapping(value = "/mg/sy/mgsy911m/uploadFile.do", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView uploadFile(@RequestParam String filePath, @RequestParam("file") MultipartFile multipartFile)
			throws Exception {

		log.debug("filePath:" + filePath);
		Map<String, String> map = new HashMap();
		String rootPath1 = FwkProperties.getProperty("prj.sharePath");
		String rootPath2 = FwkProperties.getProperty("drm.sharePath");
		String fileName = multipartFile.getOriginalFilename();
		log.debug("fileName:" + fileName);
		String newFile = filePath + "/" + fileName;
		String osName = System.getProperty("os.name");
		if (osName != null && osName.toLowerCase().contains("window")) {
			newFile = newFile.replaceAll("\\\\", "/");
		}
		newFile = FwkWebUtil.filePathBlackList(newFile);
		log.debug("rootPath1:" + rootPath1);
		log.debug("rootPath2:" + rootPath2);
		log.debug("newFile:" + newFile);

		if (!newFile.startsWith(rootPath1) && !newFile.startsWith(rootPath2)) {
			throw new Exception("[" + rootPath1 + " or " + rootPath2 + "]하위의 파일만 업로드가 가능합니다.");
		}
		File targetFile = new File(newFile);
		try {
			InputStream fileStream = multipartFile.getInputStream();
			FileUtils.copyInputStreamToFile(fileStream, targetFile);
			map.put("result", "1");
		} catch (IOException e) {
			FileUtils.deleteQuietly(targetFile);
			log.error("Exception Occurs!", e);
			map.put("result", "0");
		}

		ModelAndView result = new ModelAndView("jsonView", map);
		return result;
	}

	/**
	 * @설명: 파일다운로드
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일:
	 * @매개변수: reqMap
	 * @반환값: ModelAndView
	 * @개정이력: 장창환 2020. 12. 28. 최초작성
	 */
	@RequestMapping(value = "/mg/sy/mgsy911m/makeFolder.do")
	@ResponseBody
	public ModelAndView makeFolder(@RequestParam String filePath, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		Map<String, String> map = new HashMap();
		String rootPath = FwkProperties.getProperty("prj.sharePath");
		if (filePath == null) {
			throw new Exception("fileId null!");

		}

		String osName = System.getProperty("os.name");

		if (osName != null && osName.toLowerCase().contains("window")) {
			filePath = filePath.replaceAll("\\\\", "/");
		}
		filePath = FwkWebUtil.filePathBlackList(filePath);

		if (!filePath.startsWith(rootPath)) {
			throw new Exception("[" + rootPath + "]가 포함되는 디렉토리만 생성 가능합니다.");
		}

		File f = new File(filePath);
		if (f.exists()) {
			throw new Exception("파일 또는 디렉토리가 존재합니다.[" + filePath + "]");
		}

		if (f.mkdir()) {
			map.put("result", "1");
		} else {
			map.put("result", "0");
		}

		ModelAndView result = new ModelAndView("jsonView", map);
		return result;
	}

	/**
	 * @설명: 파일다운로드
	 * @최초작성자: 장창환
	 * @최초작성일: 2020. 12. 28.
	 * @최종변경일:
	 * @매개변수: reqMap
	 * @반환값: ModelAndView
	 * @개정이력: 장창환 2020. 12. 28. 최초작성
	 */
	@RequestMapping(value = "/mg/sy/mgsy911m/deleteFileList.do")
	@ResponseBody
	public ModelAndView deleteFileList(@RequestParam Map<String, String> reqMap) throws Exception {

		Map<String, String> map = new HashMap();
		String rootPath = FwkProperties.getProperty("prj.sharePath");
		List<Map> list = JSONUtil.jsonArrayStringToList(reqMap.get("list"));

		String osName = System.getProperty("os.name");
		int ret = 0;
		for (int i = 0; i < list.size(); i++) {
			Map item = list.get(i);
			String filePath = (String) item.get("treeId");
			if (filePath == null) {
				throw new Exception("fileId null!");
			}
			filePath = FwkWebUtil.filePathBlackList(filePath);

			if (osName != null && osName.toLowerCase().contains("window")) {
				filePath = filePath.replaceAll("\\\\", "/");
			}

			log.debug("[" + i + "]:item:" + item);
			log.debug("[" + i + "]:rootPath:" + rootPath);
			log.debug("[" + i + "]:filePath:" + filePath);
			if (!filePath.startsWith(rootPath)) {
				throw new Exception("[" + rootPath + "]가 포함되는 디렉토리만 삭제 가능합니다.");
			}
			File f = new File(filePath);
			if (!f.exists()) {
				throw new Exception("[" + filePath + "]가 존재하지 않습니다.");
			}

			if (FileUtil.deleteFile(f)) {
				ret = 1;
			} else {
				ret = 0;
			}
		}
		map.put("result", ret + "");

		ModelAndView result = new ModelAndView("jsonView", map);
		return result;
	}
	
	
}