package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.apache.commons.lang.time.FastDateFormat;


/**
*
* 시스템에서 사용하는 날짜관련 UTIL 클래스
*
* @author 	 
* @since 	2018. 6. 8. 
* @version 1.0
* @see
*
*<pre>
* << 개정이력(Modification Information) >>
*
*	     수정일		  수정자          			 수정내용
*  -----------  -----   ---------------------------
*  2018. 6. 8.         최초 생성
*
*</pre>
*/
public class DateUtil {
	/**
	 * 현재날짜 가져오기. 기본포맷적용(yyyy-MM-dd)
	 * 
	 * @return 현재일자 yyyy-MM-dd형식
	 */
	public static String getToday() {
		return getToday("yyyy-MM-dd");
	}

	/**
	 * 입력받은 형식에 맞는 현재날짜(시간) 가져오기
	 * 
	 * @param fmt 날짜형식
	 * @return 현재일자
	 */
	public static String getToday(String fmt) {
		SimpleDateFormat sfmt = new SimpleDateFormat(fmt, Locale.getDefault());
		return sfmt.format(new Date());
	}

	/**
	 * Date형을 yyyy-MM-dd형의 String으로 변환.
	 * 
	 * @param date 날짜 Date형
	 * @return 날짜 String형. null일 경우 null return
	 */
	public static String dateToString(Date date) {
		if (date != null)
			return dateToString(date, "yyyy-MM-dd");
		else
			return null;
	}

	/**
	 * Date형을 원하는 포맷으로 변환하여 스트링으로 전환한다.
	 * 
	 * @param date 날짜 Date형
	 * @return 날짜 String형. null일 경우 null return
	 */
	public static String dateToString(Date date, String fmt) {
		if (date != null && fmt != null) {
			SimpleDateFormat sfmt = new SimpleDateFormat(fmt, Locale.getDefault());
			return sfmt.format(date);
		} else
			return null;
	}

	/**
	 * 특정 Format의 String을 Date로 변환
	 * 
	 * @param date 날짜 String형
	 * @param fmt 날짜 String형의 Format
	 * @return 날짜 Date형. 날짜 String형의 오류가 있을 경우 null return
	 */
	public static java.util.Date stringToDate(String date, String fmt) {

		if (date != null && fmt != null) {
			SimpleDateFormat sfmt = new SimpleDateFormat(fmt, Locale.getDefault());
			try {
				return sfmt.parse(date);
			} catch (ParseException pe) {
				return null;
			}
		} else
			return null;
	}

	/**
	 * java.util.Date를 java.sql.Date로 변환
	 * 
	 * @param date java.util.Date
	 * @return java.sql.Date
	 */
	public static java.sql.Date dateToSqlDate(java.util.Date date) {
		return new java.sql.Date(date.getTime());
	}

	/**
	 * "MMMM dd, yyyy HH:mm:ss z" 포맷의 Time stamp 반환한다.
	 * 
	 * @return "MMMM dd, yyyy HH:mm:ss z" 포맷의 Time stamp
	 */
	public static String getTimeStamp() {
		return getTimeStamp(1);
	}

	/**
	 * 설정된 mode에 따른 Time stamp를 반환한다.
	 * 
	 * @param iMode mode
	 * @return Time stamp
	 */
	public static String getTimeStamp(int iMode) {
		String sFormat;
		// if (iMode == 1) sFormat = "E MMM dd HH:mm:ss z yyyy"; // Wed Feb 03
		// 15:26:32 GMT+09:00 1999
		if (iMode == 1)
			sFormat = "MMMM dd, yyyy HH:mm:ss z"; // Jun 03, 2001 15:26:32
													// GMT+09:00
		else if (iMode == 2)
			sFormat = "MM/dd/yyyy";// 02/15/1999
		else if (iMode == 3)
			sFormat = "yyyyMMdd";// 19990215
		else if (iMode == 4)
			sFormat = "HHmmss";// 121241
		else if (iMode == 5)
			sFormat = "dd MMM yyyy";// 15 Jan 1999
		else if (iMode == 6)
			sFormat = "yyyyMMddHHmm"; // 200101011010
		else if (iMode == 7)
			sFormat = "yyyyMMddHHmmss"; // 20010101101052
		else if (iMode == 8)
			sFormat = "HHmmss";
		else if (iMode == 9)
			sFormat = "yyyy-MM-dd";
		else if (iMode == 10)
			sFormat = "yyyy";
		else if(iMode == 11)
			sFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";
        else if(iMode == 12)
            sFormat = "yyyy-MM-dd HH:mm:ss";
		else
			sFormat = "E MMM dd HH:mm:ss z yyyy";// Wed Feb 03 15:26:32
													// GMT+09:00 1999

		Locale locale = new Locale("en", "EN");
		// SimpleTimeZone timeZone = new SimpleTimeZone(32400000, "KST");
		SimpleDateFormat formatter = new SimpleDateFormat(sFormat, locale);
		// formatter.setTimeZone(timeZone);
		// SimpleDateFormat formatter = new SimpleDateFormat(sFormat);

		return formatter.format(new Date());
	}

	/**
	 * "yyyyMMdd" 포맷의 Time stamp 반환한다.
	 * 
	 * @return "yyyyMMdd" 포맷의 Time stamp
	 */
	public static String getDate() {
		// return getDate(0);
		return getTimeStamp(3);
	}

	/**
	 * 오늘 날짜에서 지정한 날수를 계산한 날짜 반환
	 * 
	 * @param i 더하거나 뺄 날 수
	 * @return 계산된 날짜
	 */
	public static String getDate(int i) {
		return getDate(1, null, i);
	}

	/**
	 * 지정한 날짜에서 지정한 날수를 계산한 날짜 반환
	 * 
	 * @param sDate 지정한 날짜
	 * @param i 더하거나 뺄 날 수
	 * @return 계산된 날짜
	 */
	public static String getDate(String sDate, int i) {
		return getDate(1, sDate, i);
	}

	/**
	 * 지정한 날짜에서 지정한 날수를 계산한 날짜 반환
	 * 
	 * @param iType 앞/뒤로 계산할 단위 (1:일 단위, 2:월 단위, 3:년 단위)
	 * @param sDate 기준이 되는 날짜 - null일 경우, 오늘 날짜를 기준
	 * @param i 앞/뒤로 증가/감소 시킬 수
	 * @return 계산된 날짜
	 */
	public static String getDate(int iType, String sDateTo, int i) {
		String sDate = sDateTo;
		
		if (sDate == null) sDate = getTimeStamp(3);

		if (i == 0)
			return sDate;
		else {
			Calendar cal = Calendar.getInstance();
			cal.set(Integer.parseInt(sDate.substring(0, 4)), Integer
					.parseInt(sDate.substring(4, 6)) - 1, Integer
					.parseInt(sDate.substring(6, 8)));

			if (iType == 2)
				cal.add(Calendar.MONTH, i); // 월 단위
			else if (iType == 3)
				cal.add(Calendar.YEAR, i); // 년 단위
			else
				cal.add(Calendar.DATE, i); // 일 단위

			int iYear = cal.get(Calendar.YEAR);
			int iMonth = cal.get(Calendar.MONTH) + 1;
			int iDate = cal.get(Calendar.DATE);

			String sNewDate = "" + iYear;
			if (iMonth < 10)
				sNewDate += "0" + iMonth;
			else
				sNewDate += iMonth;
			if (iDate < 10)
				sNewDate += "0" + iDate;
			else
				sNewDate += iDate;

			return sNewDate;
		}
	}

	/**
	 * 오늘 날짜에서 지정한 날수를 계산한 날짜 반환
	 * 
	 * @param iType 앞/뒤로 계산할 단위 (1:일 단위, 2:월 단위, 3:년 단위)
	 * @param i 앞/뒤로 증가/감소 시킬 수
	 * @param dFormat 날짜 포맷
	 */
	public static String getDate(int iType, int i, String dFormat) {
		if (i == 0)
			return getToday(dFormat);
		else {
			Calendar cal = Calendar.getInstance();

			if (iType == 2)
				cal.add(Calendar.MONTH, i); // 월 단위
			else if (iType == 3)
				cal.add(Calendar.YEAR, i); // 년 단위
			else
				cal.add(Calendar.DATE, i); // 일 단위

			SimpleDateFormat sdf = new SimpleDateFormat(dFormat, Locale.getDefault());
			String sNewDate = sdf.format(cal.getTime());

			return sNewDate;
		}
	}

	/**
	 * timstame 값을 패턴에 맞는 DATE String으로 반환한다.
	 * 
	 * @param long date
	 * @param pattern
	 */
	public static String getFormattedDate( long date, String pattern) throws NullPointerException, IllegalArgumentException {
		SimpleDateFormat sdf = new SimpleDateFormat(pattern, Locale.getDefault());
		return sdf.format( new Date(date) );
	}
	
	
	/**
	 * 오늘 날짜보다 일주일 전 날짜를 반환한다.
	 * 
	 * @return 오늘 날짜보다 일주일 전 날짜
	 */
	public static String getPreviousWeek() {
		return getDate(1, null, -7);
	}

	/**
	 * 오늘 날짜보다 일주일 후 날짜를 반환한다.
	 * 
	 * @return 오늘 날짜보다 일주일 후 날짜
	 */
	public static String getNextWeek() {
		return getDate(1, null, 7);
	}

	/**
	 * 오늘 날짜보다 한달 전 날짜를 반환한다.
	 * 
	 * @return 오늘 날짜보다 한달 전 날짜
	 */
	public static String getPreviousMonth() {
		return getDate(2, null, -1);
	}

	/**
	 * 오늘 날짜보다 한달 후 날짜를 반환한다.
	 * 
	 * @return 오늘 날짜보다 한달 후 날짜
	 */
	public static String getNextMonth() {
		return getDate(2, null, 1);
	}
	
	/**
	 * 날짜를 비교하여 차이값을 정수값으로 리턴,
	 * 0이면 동일한 날짜,
	 * 양수이면 fromDateStr가 toDateStr보다 큼
	 * 음수이면 fromDateStr가 toDateStr보다 작음
	 *
	 * @param fromDateStr 시작일자
	 * @param toDateStr 종료일자
	 * @return 차이값
	 */
	public static long compareDate(String fromDateStr, String toDateStr) {
		long result = 0;
		
		Date fromDate = stringToDate(fromDateStr.replaceAll("-", ""), "yyyyMMdd");
		Date toDate = stringToDate(toDateStr.replaceAll("-", ""), "yyyyMMdd");
		
		if(fromDate != null && toDate != null) {
			result = (fromDate.getTime()-toDate.getTime())/(60*60*24*1000);
		} else {
			result = 0;
		}
		return result;
	}
	
    /**
     * 날짜를 비교하여 개월수를 정수값으로 리턴,
     * 0이면 동일한 월,
     * 양수이면 fromDateStr가 toDateStr보다 큼
     * 음수이면 fromDateStr가 toDateStr보다 작음
     *
     * @param fromDateStr 시작일자
     * @param toDateStr 종료일자
     * @return 개월수
     */
    public static long compareMonth(String fromDateStr, String toDateStr) {
        if (fromDateStr == null || "".equals(fromDateStr.trim())
                || toDateStr == null || "".equals(toDateStr.trim())) {
            return 0;
        }
        long result = 0;
        
        Calendar fromCal = Calendar.getInstance();
        Calendar toCal = Calendar.getInstance();
        
        fromCal.setTime(stringToDate(fromDateStr.replaceAll("-", ""), "yyyyMMdd"));
        toCal.setTime(stringToDate(toDateStr.replaceAll("-", ""), "yyyyMMdd"));
        int year1 = fromCal.get(Calendar.YEAR);
        int month1 = fromCal.get(Calendar.MONTH);
        int date1 = fromCal.get(Calendar.DATE);
        int year2 = toCal.get(Calendar.YEAR);
        int month2 = toCal.get(Calendar.MONTH);
        int date2 = toCal.get(Calendar.DATE);
        result = ((year2 * 12) + month2) - ((year1 * 12) + month1);
        result = (date1 > date2) ? result - 1 : result;
        
        return result;
    }
    
    /**
     * 입력받은 두 수 사이의 순차값을 List 형태로 반환.
     * 
     * @param startYear 시작 값
     * @param endYear 종료 값
     * @return 순차값 배열, 종료 값이 작은경우  Null 반환
     */
    public static List<String> yearList(int startYear, int endYear){
    	if(startYear > endYear)	return null;
    	
    	List<String> result = new ArrayList<String>();
    	
    	for(int i = startYear; i <= endYear; ++i){
    		result.add(String.valueOf(i));
    	}
    	
    	return result;
    }
    
	/**
	 * 해당 지역의 현재 날짜를 리턴한다.
	 *
	 * @param		pattern		the pattern describing the date and time format.
	 * @param		locale		the locale whose date format symbols should be used.
	 * @return		the formatted date-time string.
	 * @exception	NullPointerException if the given pattern is null.
	 * @exception	IllegalArgumentException if the given pattern is invalid.
	 */

	public static String getCurrentDate( String pattern, Locale locale ) throws NullPointerException, IllegalArgumentException {
		Format formatter = FastDateFormat.getInstance(pattern, locale);
		return formatter.format(new java.util.Date());
	}    
    
	/**
	 * 기본패턴을 인자로 하여 default로 대한민국의 현재 날짜를 반환한다.
	 *
	 * @param		pattern		the pattern describing the date and time format.
	 * @return		the formatted date-time string.
	 * @exception	NullPointerException if the given pattern is null.
	 * @exception	IllegalArgumentException if the given pattern is invalid.
	 */

	public static String getCurrentDate( String pattern ) throws NullPointerException, IllegalArgumentException {
		return getCurrentDate( pattern, Locale.KOREA);
	}
	
	/**
	 * 날자정보 치환 (-)yyyy-mm-dd
	 *
	 * @param yyyymmdd
	 * @param addDay
	 * @return
	 */
	public static String getDateFormat(String str, String format) {
		String result = "";
		if(str !=null && str.length() > 7){
			result = str.substring(0,4)+format+str.substring(4,6)+format+str.substring(6,8);
		}
		return result;
	}
	
	
	
	/**
	 * 입력받은 년월의 시작일자를 반환한다.
	 *
	 * @param	srtYm
	 * @return	입력받은 년월의 시작일자
	 */
	public static Date getFirstDayOfMonth( String srtYm ) {
			
		if (srtYm.isEmpty()) return null;

		Calendar cal = Calendar.getInstance();
		
		cal.setTime(stringToDate(srtYm.replaceAll("-", ""), "yyyyMM"));
		cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum((Calendar.DAY_OF_MONTH)));
		
		return cal.getTime();
	}
	
	
	/**
	 * 입력받은 년월의 마지막일자를 반환한다.
	 *
	 * @param	srtYm
	 * @return	입력받은 년월의 마지막일자
	 */
	public static Date getLastDayOfMonth( String srtYm ) {
			
		if (srtYm.isEmpty()) return null;

		Calendar cal = Calendar.getInstance();
		
		cal.setTime(stringToDate(srtYm.replaceAll("-", ""), "yyyyMM"));
		cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum((Calendar.DAY_OF_MONTH)));
		
		return cal.getTime();
	}
	
	
	/**
	 * 입력받은 년월에 해당하는 분기의 시작일자를 반환한다.
	 *
	 * @param	srtYm
	 * @return	입력받은 일자에 해당하는 분기의 시작일자
	 */
	public static Date getFirstDayOfQuarter( String srtYm ) {
			
		if (srtYm.isEmpty()) return null;

		Calendar cal = Calendar.getInstance();
        
		cal.setTime(stringToDate(srtYm.replaceAll("-", ""), "yyyyMM"));
		cal.set(Calendar.MONTH, cal.get(Calendar.MONTH)/3 * 3);
		
		return cal.getTime();
	}
	
	
	/**
	 * 입력받은 년월에 해당하는 전분기의 마지막일자를 반환한다.
	 *
	 * @param	srtYm
	 * @return	입력받은 일자에 해당하는 전분기의 마지막일자
	 */
	public static Date getLastDayOfPreQuarter( String srtYm ) {
			
		if (srtYm.isEmpty()) return null;

		Calendar cal = Calendar.getInstance();
        
		cal.setTime(stringToDate(srtYm.replaceAll("-", ""), "yyyyMM"));
		cal.set(Calendar.MONTH, cal.get(Calendar.MONTH)/3 * 3 - 1);
		cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
		
		return cal.getTime();
	}

    
}