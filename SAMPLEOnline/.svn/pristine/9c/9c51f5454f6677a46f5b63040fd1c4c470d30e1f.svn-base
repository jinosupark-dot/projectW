package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;

import lombok.extern.slf4j.Slf4j;

/**
 *
 * 시스템에서 사용하는 문자열관련 UTIL 클래스
 *
 * @author OKLEE
 * @since 2018. 6. 8.
 * @version 1.0
 * @see
 *
 *      <pre>
 * << 개정이력(Modification Information) >>
 *
 *	     수정일		  수정자          			 수정내용
 *  -----------  -----   ---------------------------
 *  2018. 6. 8.  OKLEE       최초 생성
 *
 *      </pre>
 */
@Slf4j 
public class StringUtil extends org.apache.commons.lang3.StringUtils {

	private static final NumberFormat numberFormat = NumberFormat.getInstance(Locale.KOREAN);

	/**
	 * 출력메시지 코드를 생성하기
	 *
	 * @return String
	 * @param strMessageCd
	 * @param num
	 * @return
	 */
	public static String SetMessageCode(Object objMessageCd, Long num) {
		String value = String.format("%04d", num) + "0";

		return value;
	}

	/**
	 * 문자열이 지정한 길이를 초과했을때 지정한길이에다가 해당 문자열을 붙여주는 메서드.
	 * 
	 * @param source
	 *                원본 문자열 배열
	 * @param output
	 *                더할문자열
	 * @param slength
	 *                지정길이
	 * @return 지정길이로 잘라서 더할분자열 합친 문자열
	 */
	public static String cutString(String source, String output, int slength) {
		String returnVal = null;
		if (source != null) {
			if (source.length() > slength) {
				returnVal = source.substring(0, slength) + output;
			} else
				returnVal = source;
		}
		return returnVal;
	}

	/**
	 * 문자열이 지정한 길이를 초과했을때 해당 문자열을 삭제하는 메서드
	 * 
	 * @param source
	 *                원본 문자열 배열
	 * @param slength
	 *                지정길이
	 * @return 지정길이로 잘라서 더할분자열 합친 문자열
	 */
	public static String cutString(String source, int slength) {
		String result = null;
		if (source != null) {
			if (source.length() > slength) {
				result = source.substring(0, slength);
			} else
				result = source;
		}
		return result;
	}

	/**
	 * <p>
	 * String이 비었거나("") 혹은 null 인지 검증한다.
	 * </p>
	 *
	 * <pre>
	 *  StringUtil.isEmpty(null)      = true
	 *  StringUtil.isEmpty("")        = true
	 *  StringUtil.isEmpty(" ")       = false
	 *  StringUtil.isEmpty("bob")     = false
	 *  StringUtil.isEmpty("  bob  ") = false
	 * </pre>
	 *
	 * @param str
	 *            - 체크 대상 스트링오브젝트이며 null을 허용함
	 * @return <code>true</code> - 입력받은 String 이 빈 문자열 또는 null인 경우
	 */
	public static boolean isEmpty(String str) {
		return str == null || ((str).trim().length() == 0);
	}

	public static boolean isEmpty(Object str) {

		if (str == null) {
			return true;
		}

		if ((str instanceof String) && (((String) str).trim().length() == 0)) {
			return true;
		}

		if ((str instanceof Map)) {
			return ((Map<?, ?>) str).isEmpty();
		}

		if ((str instanceof List)) {
			return ((List<?>) str).isEmpty();
		}

		if ((str instanceof Object[])) {
			return (((Object[]) str).length == 0);
		}

		return false;
	}

	/**
	 * <p>
	 * 기준 문자열에 포함된 모든 대상 문자(char)를 제거한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.remove(null, *)       = null
	 * StringUtil.remove("", *)         = ""
	 * StringUtil.remove("queued", 'u') = "qeed"
	 * StringUtil.remove("queued", 'z') = "queued"
	 * </pre>
	 *
	 * @param str
	 *               입력받는 기준 문자열
	 * @param remove
	 *               입력받는 문자열에서 제거할 대상 문자열
	 * @return 제거대상 문자열이 제거된 입력문자열. 입력문자열이 null인 경우 출력문자열은 null
	 */
	public static String remove(String str, char remove) {
		if (isEmpty(str) || str.indexOf(remove) == -1) {
			return str;
		}
		char[] chars = str.toCharArray();
		int pos = 0;
		for (int i = 0; i < chars.length; i++) {
			if (chars[i] != remove) {
				chars[pos++] = chars[i];
			}
		}
		return new String(chars, 0, pos);
	}

	/**
	 * <p>
	 * 문자열 내부의 콤마 character(,)를 모두 제거한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.removeCommaChar(null)       = null
	 * StringUtil.removeCommaChar("")         = ""
	 * StringUtil.removeCommaChar("asdfg,qweqe") = "asdfgqweqe"
	 * </pre>
	 *
	 * @param str
	 *            입력받는 기준 문자열
	 * @return " , "가 제거된 입력문자열 입력문자열이 null인 경우 출력문자열은 null
	 */
	public static String removeCommaChar(String str) {
		return remove(str, ',');
	}

	/**
	 * <p>
	 * 문자열 내부의 마이너스 character(-)를 모두 제거한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.removeMinusChar(null)       = null
	 * StringUtil.removeMinusChar("")         = ""
	 * StringUtil.removeMinusChar("a-sdfg-qweqe") = "asdfgqweqe"
	 * </pre>
	 *
	 * @param str
	 *            입력받는 기준 문자열
	 * @return " - "가 제거된 입력문자열 입력문자열이 null인 경우 출력문자열은 null
	 */
	public static String removeMinusChar(String str) {
		return remove(str, '-');
	}

	/**
	 * 원본 문자열의 포함된 특정 문자열을 새로운 문자열로 변환하는 메서드
	 * 
	 * @param source
	 *                원본 문자열
	 * @param subject
	 *                원본 문자열에 포함된 특정 문자열
	 * @param object
	 *                변환할 문자열
	 * @return sb.toString() 새로운 문자열로 변환된 문자열
	 */
	public static String replace(String source, String subject, String object) {
		StringBuffer rtnStr = new StringBuffer();
		String preStr = "";
		String nextStr = source;
		String srcStr = source;

		while (srcStr.indexOf(subject) >= 0) {
			preStr = srcStr.substring(0, srcStr.indexOf(subject));
			nextStr = srcStr.substring(srcStr.indexOf(subject) + subject.length(), srcStr.length());
			srcStr = nextStr;
			rtnStr.append(preStr).append(object);
		}
		rtnStr.append(nextStr);
		return rtnStr.toString();
	}

	/**
	 * 원본 문자열의 포함된 특정 문자열 첫번째 한개만 새로운 문자열로 변환하는 메서드
	 * 
	 * @param source
	 *                원본 문자열
	 * @param subject
	 *                원본 문자열에 포함된 특정 문자열
	 * @param object
	 *                변환할 문자열
	 * @return sb.toString() 새로운 문자열로 변환된 문자열 / source 특정문자열이 없는 경우 원본 문자열
	 */
	public static String replaceOnce(String source, String subject, String object) {
		StringBuffer rtnStr = new StringBuffer();
		String preStr = "";
		String nextStr = source;
		if (source.indexOf(subject) >= 0) {
			preStr = source.substring(0, source.indexOf(subject));
			nextStr = source.substring(source.indexOf(subject) + subject.length(), source.length());
			rtnStr.append(preStr).append(object).append(nextStr);
			return rtnStr.toString();
		} else {
			return source;
		}
	}

	/**
	 * <code>subject</code>에 포함된 각각의 문자를 object로 변환한다.
	 * 
	 * @param source
	 *                원본 문자열
	 * @param subject
	 *                원본 문자열에 포함된 특정 문자열
	 * @param object
	 *                변환할 문자열
	 * @return sb.toString() 새로운 문자열로 변환된 문자열
	 */
	public static String replaceChar(String source, String subject, String object) {
		StringBuffer rtnStr = new StringBuffer();
		String preStr = "";
		String nextStr = source;
		String srcStr = source;

		char chA;

		for (int i = 0; i < subject.length(); i++) {
			chA = subject.charAt(i);

			if (srcStr.indexOf(chA) >= 0) {
				preStr = srcStr.substring(0, srcStr.indexOf(chA));
				nextStr = srcStr.substring(srcStr.indexOf(chA) + 1, srcStr.length());
				srcStr = rtnStr.append(preStr).append(object).append(nextStr).toString();
			}
		}

		return srcStr;
	}

	/**
	 * <p>
	 * <code>str</code> 중 <code>searchStr</code>의 시작(index) 위치를 반환.
	 * </p>
	 *
	 * <p>
	 * 입력값 중 <code>null</code>이 있을 경우 <code>-1</code>을 반환.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.indexOf(null, *)          = -1
	 * StringUtil.indexOf(*, null)          = -1
	 * StringUtil.indexOf("", "")           = 0
	 * StringUtil.indexOf("aabaabaa", "a")  = 0
	 * StringUtil.indexOf("aabaabaa", "b")  = 2
	 * StringUtil.indexOf("aabaabaa", "ab") = 1
	 * StringUtil.indexOf("aabaabaa", "")   = 0
	 * </pre>
	 *
	 * @param str
	 *                  검색 문자열
	 * @param searchStr
	 *                  검색 대상문자열
	 * @return 검색 문자열 중 검색 대상문자열이 있는 시작 위치 검색대상 문자열이 없거나 null인 경우 -1
	 */
	public static int indexOf(String str, String searchStr) {
		if (str == null || searchStr == null) {
			return -1;
		}
		return str.indexOf(searchStr);
	}

	/**
	 * <p>
	 * 오라클의 decode 함수와 동일한 기능을 가진 메서드이다. <code>sourStr</code>과
	 * <code>compareStr</code>의 값이 같으면 <code>returStr</code>을 반환하며, 다르면
	 * <code>defaultStr</code>을 반환한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.decode(null, null, "foo", "bar")= "foo"
	 * StringUtil.decode("", null, "foo", "bar") = "bar"
	 * StringUtil.decode(null, "", "foo", "bar") = "bar"
	 * StringUtil.decode("하이", "하이", null, "bar") = null
	 * StringUtil.decode("하이", "하이  ", "foo", null) = null
	 * StringUtil.decode("하이", "하이", "foo", "bar") = "foo"
	 * StringUtil.decode("하이", "하이  ", "foo", "bar") = "bar"
	 * </pre>
	 *
	 * @param sourceStr
	 *                   비교할 문자열
	 * @param compareStr
	 *                   비교 대상 문자열
	 * @param returnStr
	 *                   sourceStr와 compareStr의 값이 같을 때 반환할 문자열
	 * @param defaultStr
	 *                   sourceStr와 compareStr의 값이 다를 때 반환할 문자열
	 * @return sourceStr과 compareStr의 값이 동일(equal)할 때 returnStr을 반환하며, <br/>
	 *         다르면 defaultStr을 반환한다.
	 */
	public static String decode(String sourceStr, String compareStr, String returnStr, String defaultStr) {
		if (sourceStr == null && compareStr == null) {
			return returnStr;
		}

		if (sourceStr == null && compareStr != null) {
			return defaultStr;
		}

		if (sourceStr.trim().equals(compareStr)) {
			return returnStr;
		}

		return defaultStr;
	}

	/**
	 * <p>
	 * 오라클의 decode 함수와 동일한 기능을 가진 메서드이다. <code>sourStr</code>과
	 * <code>compareStr</code>의 값이 같으면 <code>returStr</code>을 반환하며, 다르면
	 * <code>sourceStr</code>을 반환한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.decode(null, null, "foo") = "foo"
	 * StringUtil.decode("", null, "foo") = ""
	 * StringUtil.decode(null, "", "foo") = null
	 * StringUtil.decode("하이", "하이", "foo") = "foo"
	 * StringUtil.decode("하이", "하이 ", "foo") = "하이"
	 * StringUtil.decode("하이", "바이", "foo") = "하이"
	 * </pre>
	 *
	 * @param sourceStr
	 *                   비교할 문자열
	 * @param compareStr
	 *                   비교 대상 문자열
	 * @param returnStr
	 *                   sourceStr와 compareStr의 값이 같을 때 반환할 문자열
	 * @return sourceStr과 compareStr의 값이 동일(equal)할 때 returnStr을 반환하며, <br/>
	 *         다르면 sourceStr을 반환한다.
	 */
	public static String decode(String sourceStr, String compareStr, String returnStr) {
		return decode(sourceStr, compareStr, returnStr, sourceStr);
	}

	/**
	 * 객체가 null인지 확인하고 null인 경우 "" 로 바꾸는 메서드
	 *
	 * @param object
	 *               원본 객체
	 * @return resultVal 문자열
	 */
	public static String isNullToString(Object object, String reval) {
		String string = "";

		if (object == null || "null".equals(object)) {
			if (reval != null)
				string = reval;
		} else {
			string = object.toString().trim();
		}

		return string;
	}

	/**
	 * <pre>
	 * 인자로 받은 String이 null일 경우 &quot;&quot;로 리턴한다.
	 * &#064;param src null값일 가능성이 있는 String 값.
	 * &#064;return 만약 String이 null 값일 경우 &quot;&quot;로 바꾼 String 값.
	 * </pre>
	 */
	public static String nullConvert(Object src) {
		// if (src != null &&
		// src.getClass().getName().equals("java.math.BigDecimal")) {
		if (src != null && src instanceof java.math.BigDecimal) {
			return ((BigDecimal) src).toString();
		}

		if (src == null || "null".equals(src)) {
			return "";
		} else {
			return ((String) src).trim();
		}
	}

	/**
	 * <pre>
	 * 인자로 받은 String이 null일 경우 &quot;&quot;로 리턴한다.
	 * &#064;param src null값일 가능성이 있는 String 값.
	 * &#064;return 만약 String이 null 값일 경우 &quot;&quot;로 바꾼 String 값.
	 * </pre>
	 */
	public static String nullConvert(String src) {

		if (src == null || "null".equals(src) || "".equals(src) || " ".equals(src)) {
			return "";
		} else {
			return src.trim();
		}
	}

	/**
	 * <pre>
	 * 인자로 받은 String이 null일 경우 &quot;0&quot;로 리턴한다.
	 * &#064;param src null값일 가능성이 있는 String 값.
	 * &#064;return 만약 String이 null 값일 경우 &quot;0&quot;로 바꾼 String 값.
	 * </pre>
	 */
	public static int zeroConvert(Object src) {

		if (src == null || "null".equals(src)) {
			return 0;
		} else {
			return Integer.parseInt(((String) src).trim());
		}
	}

	/**
	 * <pre>
	 * 인자로 받은 String이 null일 경우 &quot;&quot;로 리턴한다.
	 * &#064;param src null값일 가능성이 있는 String 값.
	 * &#064;return 만약 String이 null 값일 경우 &quot;&quot;로 바꾼 String 값.
	 * </pre>
	 */
	public static int zeroConvert(String src) {

		if (src == null || "null".equals(src) || "".equals(src) || " ".equals(src)) {
			return 0;
		} else {
			return Integer.parseInt(src.trim());
		}
	}

	/**
	 * <p>
	 * 문자열에서 {@link Character#isWhitespace(char)}에 정의된 모든 공백문자를 제거한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.removeWhitespace(null)         = null
	 * StringUtil.removeWhitespace("")           = ""
	 * StringUtil.removeWhitespace("abc")        = "abc"
	 * StringUtil.removeWhitespace("   ab  c  ") = "abc"
	 * </pre>
	 *
	 * @param str
	 *            공백문자가 제거도어야 할 문자열
	 * @return the 공백문자가 제거된 문자열, null이 입력되면 <code>null</code>이 리턴
	 */
	public static String removeWhitespace(String str) {
		if (isEmpty(str)) {
			return str;
		}
		int sz = str.length();
		char[] chs = new char[sz];
		int count = 0;
		for (int i = 0; i < sz; i++) {
			if (!Character.isWhitespace(str.charAt(i))) {
				chs[count++] = str.charAt(i);
			}
		}
		if (count == sz) {
			return str;
		}

		return new String(chs, 0, count);
	}

	/**
	 * Html 코드가 들어간 문서를 표시할때 태그에 손상없이 보이기 위한 메서드
	 *
	 * @param strString
	 * @return HTML 태그를 치환한 문자열
	 */
	public static String checkHtmlView(String strString) {
		String strNew = "";

		try {
			StringBuffer strTxt = new StringBuffer("");

			char chrBuff;
			int len = strString.length();

			for (int i = 0; i < len; i++) {
				chrBuff = (char) strString.charAt(i);

				switch (chrBuff) {
					case '<':
						strTxt.append("&lt;");
						break;
					case '>':
						strTxt.append("&gt;");
						break;
					case '"':
						strTxt.append("&quot;");
						break;
					case 10:
						strTxt.append("<br>");
						break;
					case ' ':
						strTxt.append("&nbsp;");
						break;
					// case '&' :
					// strTxt.append("&amp;");
					// break;
					default:
						strTxt.append(chrBuff);
				}
			}

			strNew = strTxt.toString();

		} catch (Exception ex) {
			return null;
		}

		return strNew;
	}

	/**
	 * 문자열을 지정한 분리자에 의해 배열로 리턴하는 메서드.
	 *
	 * @param source
	 *                  원본 문자열
	 * @param separator
	 *                  분리자
	 * @return result 분리자로 나뉘어진 문자열 배열
	 */
	public static String[] split(String source, String separator) throws NullPointerException {
		String[] returnVal = null;
		int cnt = 1;

		int index = source.indexOf(separator);
		int index0 = 0;
		while (index >= 0) {
			cnt++;
			index = source.indexOf(separator, index + 1);
		}
		returnVal = new String[cnt];
		cnt = 0;
		index = source.indexOf(separator);
		while (index >= 0) {
			returnVal[cnt] = source.substring(index0, index);
			index0 = index + 1;
			index = source.indexOf(separator, index + 1);
			cnt++;
		}
		returnVal[cnt] = source.substring(index0);

		return returnVal;
	}

	/**
	 * <p>
	 * {@link String#toLowerCase()}를 이용하여 소문자로 변환한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.lowerCase(null)  = null
	 * StringUtil.lowerCase("")    = ""
	 * StringUtil.lowerCase("aBc") = "abc"
	 * </pre>
	 *
	 * @param str
	 *            소문자로 변환되어야 할 문자열
	 * @return 소문자로 변환된 문자열, null이 입력되면 <code>null</code> 리턴
	 */
	public static String lowerCase(String str) {
		if (str == null) {
			return null;
		}

		return str.toLowerCase();
	}

	/**
	 * <p>
	 * {@link String#toUpperCase()}를 이용하여 대문자로 변환한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.upperCase(null)  = null
	 * StringUtil.upperCase("")    = ""
	 * StringUtil.upperCase("aBc") = "ABC"
	 * </pre>
	 *
	 * @param str
	 *            대문자로 변환되어야 할 문자열
	 * @return 대문자로 변환된 문자열, null이 입력되면 <code>null</code> 리턴
	 */
	public static String upperCase(String str) {
		if (str == null) {
			return null;
		}

		return str.toUpperCase();
	}

	/**
	 * <p>
	 * 입력된 String의 앞쪽에서 두번째 인자로 전달된 문자(stripChars)를 모두 제거한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.stripStart(null, *)          = null
	 * StringUtil.stripStart("", *)            = ""
	 * StringUtil.stripStart("abc", "")        = "abc"
	 * StringUtil.stripStart("abc", null)      = "abc"
	 * StringUtil.stripStart("  abc", null)    = "abc"
	 * StringUtil.stripStart("abc  ", null)    = "abc  "
	 * StringUtil.stripStart(" abc ", null)    = "abc "
	 * StringUtil.stripStart("yxabc  ", "xyz") = "abc  "
	 * </pre>
	 *
	 * @param str
	 *                   지정된 문자가 제거되어야 할 문자열
	 * @param stripChars
	 *                   제거대상 문자열
	 * @return 지정된 문자가 제거된 문자열, null이 입력되면 <code>null</code> 리턴
	 */
	public static String stripStart(String str, String stripChars) {
		int strLen;
		if (str == null || (strLen = str.length()) == 0) {
			return str;
		}
		int start = 0;
		if (stripChars == null) {
			while ((start != strLen) && Character.isWhitespace(str.charAt(start))) {
				start++;
			}
		} else if (stripChars.length() == 0) {
			return str;
		} else {
			while ((start != strLen) && (stripChars.indexOf(str.charAt(start)) != -1)) {
				start++;
			}
		}

		return str.substring(start);
	}

	/**
	 * <p>
	 * 입력된 String의 뒤쪽에서 두번째 인자로 전달된 문자(stripChars)를 모두 제거한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.stripEnd(null, *)          = null
	 * StringUtil.stripEnd("", *)            = ""
	 * StringUtil.stripEnd("abc", "")        = "abc"
	 * StringUtil.stripEnd("abc", null)      = "abc"
	 * StringUtil.stripEnd("  abc", null)    = "  abc"
	 * StringUtil.stripEnd("abc  ", null)    = "abc"
	 * StringUtil.stripEnd(" abc ", null)    = " abc"
	 * StringUtil.stripEnd("  abcyx", "xyz") = "  abc"
	 * </pre>
	 *
	 * @param str
	 *                   지정된 문자가 제거되어야 할 문자열
	 * @param stripChars
	 *                   제거대상 문자열
	 * @return 지정된 문자가 제거된 문자열, null이 입력되면 <code>null</code> 리턴
	 */
	public static String stripEnd(String str, String stripChars) {
		int end;
		if (str == null || (end = str.length()) == 0) {
			return str;
		}

		if (stripChars == null) {
			while ((end != 0) && Character.isWhitespace(str.charAt(end - 1))) {
				end--;
			}
		} else if (stripChars.length() == 0) {
			return str;
		} else {
			while ((end != 0) && (stripChars.indexOf(str.charAt(end - 1)) != -1)) {
				end--;
			}
		}

		return str.substring(0, end);
	}

	/**
	 * <p>
	 * 입력된 String의 앞, 뒤에서 두번째 인자로 전달된 문자(stripChars)를 모두 제거한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.strip(null, *)          = null
	 * StringUtil.strip("", *)            = ""
	 * StringUtil.strip("abc", null)      = "abc"
	 * StringUtil.strip("  abc", null)    = "abc"
	 * StringUtil.strip("abc  ", null)    = "abc"
	 * StringUtil.strip(" abc ", null)    = "abc"
	 * StringUtil.strip("  abcyx", "xyz") = "  abc"
	 * </pre>
	 *
	 * @param str
	 *                   지정된 문자가 제거되어야 할 문자열
	 * @param stripChars
	 *                   제거대상 문자열
	 * @return 지정된 문자가 제거된 문자열, null이 입력되면 <code>null</code> 리턴
	 */
	public static String strip(String str, String stripChars) {
		if (isEmpty(str)) {
			return str;
		}

		String srcStr = str;
		srcStr = stripStart(srcStr, stripChars);

		return stripEnd(srcStr, stripChars);
	}

	/**
	 * 문자열을 지정한 분리자에 의해 지정된 길이의 배열로 리턴하는 메서드.
	 * 
	 * @param source
	 *                    원본 문자열
	 * @param separator
	 *                    분리자
	 * @param arraylength
	 *                    배열 길이
	 * @return 분리자로 나뉘어진 문자열 배열
	 */
	public static String[] split(String source, String separator, int arraylength) throws NullPointerException {
		String[] returnVal = new String[arraylength];
		int cnt = 0;
		int index0 = 0;
		int index = source.indexOf(separator);
		while (index >= 0 && cnt < (arraylength - 1)) {
			returnVal[cnt] = source.substring(index0, index);
			index0 = index + 1;
			index = source.indexOf(separator, index + 1);
			cnt++;
		}
		returnVal[cnt] = source.substring(index0);
		if (cnt < (arraylength - 1)) {
			for (int i = cnt + 1; i < arraylength; i++) {
				returnVal[i] = "";
			}
		}

		return returnVal;
	}

	/**
	 * 문자열 A에서 Z사이의 랜덤 문자열을 구하는 기능을 제공 시작문자열과 종료문자열 사이의 랜덤 문자열을 구하는 기능
	 * 
	 * @param startChr
	 *                 - 첫 문자
	 * @param endChr
	 *                 - 마지막문자
	 * @return 랜덤문자
	 * @exception MyException
	 * @see
	 */
	public static String getRandomStr(char startChr, char endChr) {

		int randomInt;
		String randomStr = null;

		// 시작문자 및 종료문자를 아스키숫자로 변환한다.
		int startInt = Integer.valueOf(startChr);
		int endInt = Integer.valueOf(endChr);

		// 시작문자열이 종료문자열보가 클경우
		if (startInt > endInt) {
			throw new IllegalArgumentException("Start String: " + startChr + " End String: " + endChr);
		}

		try {

			// 랜덤 객체 생성
			SecureRandom rnd = new SecureRandom();

			do {
				// 시작문자 및 종료문자 중에서 랜덤 숫자를 발생시킨다.
				rnd.setSeed(System.currentTimeMillis());
				randomInt = rnd.nextInt(endInt + 1);
			} while (randomInt < startInt); // 입력받은 문자 'A'(65)보다 작으면 다시 랜덤 숫자
			// 발생.

			// 랜덤 숫자를 문자로 변환 후 스트링으로 다시 변환
			randomStr = (char) randomInt + "";
		} catch (Exception e) {
			log.error("Exception Occurs!!", e);
			throw new RuntimeException(e); // 2011.10.10 보안점검 후속조치
		}

		// 랜덤문자열를 리턴
		return randomStr;
	}

	/**
	 * 문자열을 다양한 문자셋(EUC-KR[KSC5601],UTF-8..)을 사용하여 인코딩하는 기능 역으로 디코딩하여 원래의 문자열을
	 * 복원하는 기능을 제공함 String temp = new String(문자열.getBytes("바꾸기전 인코딩"),"바꿀 인코딩");
	 * String temp = new String(문자열.getBytes("8859_1"),"KSC5601"); => UTF-8 에서
	 * EUC-KR
	 * 
	 * @param srcString
	 *                     - 문자열
	 * @param srcCharsetNm
	 *                     - 원래 CharsetNm
	 * @param charsetNm
	 *                     - CharsetNm
	 * @return 인(디)코딩 문자열
	 * @exception MyException
	 * @see
	 */
	public static String getEncdDcd(String srcString, String srcCharsetNm, String cnvrCharsetNm) {

		String rtnStr = null;

		if (srcString == null)
			return null;

		try {
			rtnStr = new String(srcString.getBytes(srcCharsetNm), cnvrCharsetNm);
		} catch (UnsupportedEncodingException e) {
			rtnStr = null;
		}

		return rtnStr;
	}

	/**
	 * 특수문자를 웹 브라우저에서 정상적으로 보이기 위해 특수문자를 처리('<' -> & lT)하는 기능이다
	 * 
	 * @param srcString
	 *                  - '<'
	 * @return 변환문자열('<' -> "&lt"
	 * @exception MyException
	 * @see
	 */
	public static String getSpclStrCnvr(String srcString) {

		String rtnStr = null;

		try {
			StringBuffer strTxt = new StringBuffer("");

			char chrBuff;
			int len = srcString.length();

			for (int i = 0; i < len; i++) {
				chrBuff = (char) srcString.charAt(i);

				switch (chrBuff) {
					case '<':
						strTxt.append("&lt;");
						break;
					case '>':
						strTxt.append("&gt;");
						break;
					case '&':
						strTxt.append("&amp;");
						break;
					default:
						strTxt.append(chrBuff);
				}
			}

			rtnStr = strTxt.toString();

		} catch (Exception e) {
			log.error("Exception Occurs!!", e);
			throw new RuntimeException(e); // 2011.10.10 보안점검 후속조치
		}

		return rtnStr;
	}

	/**
	 * 응용어플리케이션에서 고유값을 사용하기 위해 시스템에서17자리의TIMESTAMP값을 구하는 기능
	 * 
	 * @param
	 * @return Timestamp 값
	 * @exception MyException
	 * @see
	 */
	public static String getTimeStamp() {

		String rtnStr = null;

		// 문자열로 변환하기 위한 패턴 설정(년도-월-일 시:분:초:초(자정이후 초))
		String pattern = "yyyyMMddHHmmssSSS";

		try {
			SimpleDateFormat sdfCurrent = new SimpleDateFormat(pattern, Locale.KOREA);
			Timestamp ts = new Timestamp(System.currentTimeMillis());

			rtnStr = sdfCurrent.format(ts.getTime());
		} catch (Exception e) {
			log.error("Exception Occurs!!", e);
			throw new RuntimeException(e); // 2011.10.10 보안점검 후속조치
		}

		return rtnStr;
	}

	/**
	 * html의 특수문자를 표현하기 위해
	 *
	 * @param srcString
	 * @return String
	 * @exception Exception
	 * @see
	 */
	public static String getHtmlStrCnvr(String srcString) {

		String tmpString = srcString;

		try {
			tmpString = tmpString.replaceAll("&lt;", "<");
			tmpString = tmpString.replaceAll("&gt;", ">");
			tmpString = tmpString.replaceAll("&amp;", "&");
			tmpString = tmpString.replaceAll("&nbsp;", " ");
			tmpString = tmpString.replaceAll("&apos;", "\'");
			tmpString = tmpString.replaceAll("&quot;", "\"");

		} catch (Exception e) {
			log.error("Exception Occurs!!", e);
			throw new RuntimeException(e); // 2011.10.10 보안점검 후속조치
		}

		return tmpString;

	}

	/**
	 * <p>
	 * 날짜 형식의 문자열 내부에 마이너스 character(-)를 추가한다.
	 * </p>
	 *
	 * <pre>
	 * StringUtil.addMinusChar(&quot;20100901&quot;) = &quot;2010-09-01&quot;
	 * </pre>
	 *
	 * @param date
	 *             입력받는 문자열
	 * @return " - "가 추가된 입력문자열
	 */
	public static String addMinusChar(String date) {
		if (date.length() == 8)
			return date.substring(0, 4).concat("-").concat(date.substring(4, 6)).concat("-")
					.concat(date.substring(6, 8));
		else
			return "";
	}

	/**
	 * 날짜 [.] 삭제
	 * 
	 * @param date
	 * @return
	 */
	public static String delDot(String date) {
		String newDate = date.replace(".", "");
		return newDate;
	}

	/**
	 * 오늘일자 가져오기
	 * 
	 * @return
	 */
	public static String todayText() {
		String dayMode = new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date());
		return dayMode;
	}

	public static String todaySSSText() {
		String dayMode = new java.text.SimpleDateFormat("yyyyMMddHHmmssSSS").format(new java.util.Date());
		return dayMode;
	}

	public static String getDate() {
		String day = todayText();

		String year = day.substring(0, 4);
		String month = day.substring(4, 6);
		if ("0".equals(month.substring(0, 1))) {
			month = month.substring(1);
		}
		String date = day.substring(6, 8);

		return year + month + date;
	}

	public static String getYYYYMMDDDate() {
		String day = todayText();
		String year = day.substring(0, 4);
		String month = day.substring(4, 6);
		String date = day.substring(6, 8);
		return year + month + date;
	}

	public static String getYear() {
		String day = todayText();
		String year = day.substring(0, 4);
		return year;
	}

	public static String getMMMonth() {
		String day = todayText();
		String month = day.substring(4, 6);
		return month;
	}

	public static String getMonth() {
		String day = todayText();
		String month = day.substring(4, 6);
		if ("0".equals(month.substring(0, 1))) {
			month = month.substring(1);
		}
		return month;
	}

	public static String getDay() {
		String day = todayText();
		String date = day.substring(6, 8);
		return date;
	}

	public static String getCalsDate(int ymd, int term, String data_type) {

		/*
		 * getCalsDate(0,0) : 오늘
		 * getCalsDate(1,1) : 년, -1(1년전오늘) , -2(2년전오늘)...
		 * getCalsDate(2,1) : 개월, -1(1개월전오늘) , -2(2개월전오늘)....
		 * getCalsDate(3or4or8,1) : 주, -1(일주일전 같은요일) , -2(이주일전 같은요일)....
		 * getCalsDate(5or6or7,1) : 하루, -1(일주일전 같은요일) , -2(이주일전 같은요일)....
		 * getCalsDate(9,1) : 12시단, -1(12기간전) , -2(24시간전)....
		 * getCalsDate(10,1) : 1시간, -1(1시간전) , -2(2시간전)....
		 * getCalsDate(12,1) : 1분, -1(1분전) , -2(2분전)....
		 * 
		 */
		Calendar cal = Calendar.getInstance(Locale.KOREAN);

		TimeZone tz = cal.getTimeZone();
		tz = tz.getTimeZone("Asia/Seoul");

		cal = Calendar.getInstance(tz);

		cal.add(ymd, term);
		Date calDate = cal.getTime();
		SimpleDateFormat sdf = new SimpleDateFormat(data_type, Locale.KOREAN);

		return sdf.format(calDate);
	}

	public static String getYn(String yn) {
		if ("1".equals(yn) || "y".equals(yn.toLowerCase(Locale.ENGLISH))) {
			return "Y";
		} else {
			return "N";
		}
	}

	public static String toCamelCase(Object target) {
		StringBuffer buffer = new StringBuffer();
		for (String token : String.valueOf(target).toLowerCase().split("_")) {
			buffer.append(StringUtils.capitalize(token));
		}
		return StringUtils.uncapitalize(buffer.toString());
	}

	public static String toCamelCaseFirstUpperCase(Object target) {
		String response = toCamelCase(target);
		response = String.valueOf(response.charAt(0)).toUpperCase() + response.substring(1);
		return response;
	}

	public static String toCamelCaseFirstLowerCase(Object target) {
		String response = target.toString();
		response = String.valueOf(response.charAt(0)).toLowerCase() + response.substring(1);
		return response;
	}

	/**
	 * 금액문자열을 금액표시타입으로 변환 함수
	 *
	 * @param moneyString
	 *                    - 대상 문자열
	 * @return String
	 */
	public static String makeMoneyType(String moneyString) {

		return makeMoneyType(moneyString, ",");
	}

	/**
	 * 금액문자열을 금액표시타입으로 변환 함수
	 *
	 * @param moneyString
	 *                    - 금액문자열, delimeter - 금액표시구분자
	 * @return String
	 */
	public static String makeMoneyType(String moneyString, String delimeter) {

		return makeMoneyType(moneyString, delimeter, 3);
	}

	/**
	 * 금액문자열을 금액표시타입으로 변환 함수
	 *
	 * @param moneyString
	 *                    - 금액문자열, delimeter - 금액표시구분자, offset - 금액표시구분 간격
	 * @return String
	 */
	public static String makeMoneyType(String moneyString, String delimeter, int offset) {

		if (moneyString == null || moneyString.length() == 0 || StringUtil.equals(moneyString, "null"))
			return "0";

		DecimalFormat df = new DecimalFormat();
		DecimalFormatSymbols dfs = new DecimalFormatSymbols();

		dfs.setGroupingSeparator(delimeter.charAt(0));
		df.setGroupingSize(offset);
		df.setDecimalFormatSymbols(dfs);

		return (df.format(Double.parseDouble(moneyString))).toString();
	}

	/**
	 * 금액문자열을 금액표시타입으로 변환 함수
	 *
	 * @param intMoneyString
	 *                       - 금액, delimeter - 금액표시구분자, offset - 금액표시구분 간격
	 * @return String
	 */
	public static String makeMoneyType(int intMoneyString, String delimeter, int offset) {

		// String moneyString = new Integer(intMoneyString).toString();
		String moneyString =  Integer.toString(intMoneyString);

		return makeMoneyType(moneyString, delimeter, offset);
	}

	/**
	 * 금액문자열을 금액표시타입으로 변환 함수
	 *
	 * @param longMoneyString
	 *                        - 금액, delimeter - 금액표시구분자, offset - 금액표시구분 간격
	 * @return String
	 */
	public static String makeMoneyType(long longMoneyString, String delimeter, int offset) {

		String moneyString = Long.toString(longMoneyString);

		return makeMoneyType(moneyString, delimeter, offset);
	}

	/**
	 * 금액문자열을 금액표시타입으로 변환 함수
	 *
	 * @param moneyString
	 *                    - 금액문자열, b
	 * @return String
	 */
	public static String makeMoneyType(String moneyString, boolean b) {

		if (moneyString == null || moneyString.length() == 0) {
			if (b == true) {
				return "0";
			} else {
				return "";
			}
		}

		String resultMoney = makeMoneyType(moneyString);

		if (b == false) {
			if ("0".equals(resultMoney)) {
				resultMoney = "";
			}
		}

		return resultMoney;
	}

	/**
	 * 금액문자열을 금액표시타입으로 변환 함수
	 *
	 * @param intMoneyString
	 *                       - 금액
	 * @return String
	 */
	public static String makeMoneyType(int intMoneyString) {

		String moneyString = Integer.toString(intMoneyString);

		return makeMoneyType(moneyString);
	}

	/**
	 * 금액문자열을 금액표시타입으로 변환 함수
	 *
	 * @param intMoneyString
	 *                       - 금액, delimeter - 금액표시구분자
	 * @return String
	 */
	public static String makeMoneyType(int intMoneyString, String delimeter) {

		String moneyString = Integer.toString(intMoneyString);

		return makeMoneyType(moneyString, delimeter);
	}

	/**
	 * 금액문자열을 금액표시타입으로 변환 함수
	 *
	 * @param longMoneyString
	 *                        - 금액
	 * @return String
	 */
	public static String makeMoneyType(long longMoneyString) {

		String moneyString = Long.toString(longMoneyString);

		return makeMoneyType(moneyString);
	}

	/**
	 * 금액문자열을 금액표시타입으로 변환 함수
	 *
	 * @param moneyString
	 *                    - 금액, delimeter - 금액표시구분자
	 * @return String
	 */
	public static String makeMoneyType(long longMoneyString, String delimeter) {

		String moneyString = Long.toString(longMoneyString);

		return makeMoneyType(moneyString, delimeter);
	}

	/**
	 * 금액(double)을 금액표시타입으로 변환 함수
	 *
	 * @param dblMoneyString
	 *                       -금액
	 * @return String
	 */
	public static String makeUsMoneyType(double dblMoneyString) {

		return makeUsMoneyType(dblMoneyString, ",");
	}

	/**
	 * 금액(double)을 금액표시타입으로 변환 함수
	 *
	 * @param dblMoneyString
	 *                       -금액, delimeter - 금액표시구분자
	 * @return String
	 */
	public static String makeUsMoneyType(double dblMoneyString, String delimeter) {

		String moneyString =  Double.toString(dblMoneyString);

		return makeFormatString(moneyString, delimeter, 2);
	}

	/**
	 * 금액(double)을 금액표시타입으로 변환 함수
	 *
	 * @param dblMoneyString
	 *                       -금액, delimeter - 금액표시구분자, number - 소수점 자리수
	 * @return String
	 */
	public static String makeUsMoneyType(double dblMoneyString, String delimeter, int number) {

		String moneyString = Double.toString(dblMoneyString);

		return makeFormatString(moneyString, delimeter, number);
	}

	/**
	 * 소수점 자리수 맞춰주는 함수
	 *
	 * @param dblString
	 *                  -숫자, delimeter - 표시구분자, number - 소수점 자리수
	 * @return String
	 */
	public static String makeFormatString(double dblString, String delimeter, int number) {

		String moneyString = Double.toString(dblString);

		return makeFormatString(moneyString, delimeter, number);
	}

	/**
	 * 소수점 자리수 맞춰주는 함수
	 *
	 * @param str
	 *            - 숫자, delimeter - 표시구분자, number - 소수점 자리수
	 * @return String
	 */
	public static String makeFormatString(String str, String delimeter, int number) {

		if (str == null || "".equals(str))
			str = "0";

		String format = null;

		if ("".equals(delimeter)) {
			if (number == 0) {
				format = "###0";
			} else {
				format = "###0.";
			}
		} else {
			format = "#,##0.";
		}

		for (int i = 0; i < number; i++) {
			format += "0";
		}

		DecimalFormat df = new DecimalFormat(format);
		DecimalFormatSymbols dfs = new DecimalFormatSymbols();

		if (!"".equals(delimeter)) {
			dfs.setGroupingSeparator(delimeter.charAt(0));
			df.setGroupingSize(3);
			df.setDecimalFormatSymbols(dfs);
		}

		return (df.format(Double.parseDouble(str))).toString();
	}

	/**
	 * 날자,금액표시타입을 일반문자열로 변환 함수
	 *
	 * @param strString
	 *                  - 날자,금액표시문자열, delimeter - 구분자
	 * @return String
	 */
	public static String makeNoType(String strString, String delimeter) {

		if (strString == null || strString.length() == 0)
			return "0";

		return replace(strString, delimeter, "");
	}

	/**
	 * chk 가 true인경우 str값이 null 또는 str.trim()값이 ""이면 null을 리턴 chk가 false인경우
	 * notNullTrim과 동일
	 * 
	 * @param str
	 *            - 문자열
	 * @param chk
	 *            - 치환구분
	 * @return
	 */
	public static String nullChkTrim(String str, boolean chk) {
		if (str == null) {
			str = "";
		} else {
			str = str.trim();
		}

		if ("".equals(str) && chk) {
			return null;
		} else
			return str;
	}

	/**
	 * 인자값으로 null이 들어올경우 ""을 리턴하고, null이 아닌경우 앞뒤 공백을 빼고 리턴
	 * 
	 * @param str
	 */
	public static String notNullTrim(String str) {
		return nullChkTrim(str, false);
	}

	/**
	 * Base64Encoding을 수행한다. binany in ascii out
	 *
	 * @param encodeBytes
	 *                    encoding할 byte array
	 * @return encoding 된 String
	 */
	public static String encode(byte[] encodeBytes) {

		// BASE64Encoder base64Encoder = new BASE64Encoder();
		// ByteArrayInputStream bin = new ByteArrayInputStream(encodeBytes);
		// ByteArrayOutputStream bout = new ByteArrayOutputStream();
		// byte[] buf = null;

		// try {
		// base64Encoder.encodeBuffer(bin, bout);
		// buf = bout.toByteArray();
		// return new String(buf).trim();
		// } catch (Exception e) {
		// return null;
		// }

		try {
			return Base64.getMimeEncoder(76, new byte[] { '\n' })
					.encodeToString(encodeBytes)
					.trim();
		} catch (Exception e) {
			return null;
		}
	}

	public static String base64Encode(String str) throws java.io.IOException {
		// sun.misc.BASE64Encoder encoder = new sun.misc.BASE64Encoder();
		// byte[] b1 = str.getBytes();
		// String result = encoder.encode(b1);
		String result = Base64.getEncoder()
				.encodeToString(str.getBytes(java.nio.charset.StandardCharsets.UTF_8));
		return result;
	}

	public static String longTobase64(long v) {
		final char[] digits = {
				'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
				'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
				'v', 'w', 'x', 'y', 'z',
				'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
				'V', 'W', 'X', 'Y', 'Z', '#', '$'
		};
		int shift = 6;
		char[] buf = new char[64];
		int charPos = 64;
		int radix = 1 << shift;
		long mask = radix - 1;
		long number = v;

		do {
			buf[--charPos] = digits[(int) (number & mask)];
			number >>>= shift;
		} while (number != 0);

		return cutString(new String(buf, charPos, (64 - charPos)), 9);
	}

	/**
	 * 구성된 Html 파일을 mht파일형식으로 64bit 암호화 인코딩한다.
	 *
	 * @author 황승준
	 * @param sHtmFilePath
	 *                     - Htm 파일 전체 경로
	 * @throws Exception
	 * @return buffer.toString() - 인코딩된 Html 파일 String
	 */
	public static String encodeHtmlFile(String sHtmlContents) throws Exception {
		String newLine = "\n";
		String boundary = "_exsoft_uuid-settings";
		StringBuffer buffer = new StringBuffer();

		try {
			String en_str = sHtmlContents; // htm 양식
			// Mht 파일 Header 작성
			buffer.append("MIME-Version: 1.0" + newLine).append("Content-Type: multipart/related;" + newLine)
					.append("\t" + "boundary=\"=" + boundary + "\"" + newLine + newLine)
					.append("--=" + boundary + newLine).append("Content-Type: text/html;" + newLine)
					.append("charset=\"euc-kr\"" + newLine)
					.append("Content-Transfer-Encoding: base64" + newLine + newLine).append(encode(en_str.getBytes()))
					.append(newLine + newLine);

			buffer.append("--=" + boundary);
		} catch (Exception e) {
			throw e;
		}
		return buffer.toString();
	}

	/**
	 * 구성된mht파일을 Html 파일형식으로 64bit 복호화 할때 mht파일로 만들때 html 코드 외의 값들은 뺀다.
	 *
	 * @author 원동민
	 * @param sHtmFilePath
	 *                     - Htm 파일 전체 경로
	 * @throws Exception
	 * @return buffer.toString() - 인코딩된 Html 파일 String
	 */
	public static boolean isExsoftMhtCode(String sMhtContents) {

		try {
			String boundary = "_exsoft_uuid-settings";
			String boundary2 = "\t" + "boundary=\"=" + boundary + "\"";
			if ("MIME-Version: 1.0".equals(sMhtContents)) {
				return false;
			} else if ("Content-Type: multipart/related;".equals(sMhtContents)) {
				return false;
			} else if (boundary2.equals(sMhtContents)) {
				return false;
			} else if ("--=_exsoft_uuid-settings".equals(sMhtContents)) {
				return false;
			} else if ("Content-Type: text/html;".equals(sMhtContents)) {
				return false;
			} else if ("charset=\"euc-kr\"".equals(sMhtContents)) {
				return false;
			} else if ("Content-Transfer-Encoding: base64".equals(sMhtContents)) {
				return false;
			} else {
				return true;
			}
		} catch (Exception e) {
			return true;
		}
	}

	/**
	 * 인자값으로 null이 들어올경우 그대로 null을 리턴하고 null이 아닌경우 앞뒤 공백을 빼고 리턴
	 * 
	 * @param str
	 *            - 문자열
	 * @return boolean
	 */
	public static String nullTrim(String str) {
		return nullChkTrim(str, true);
	}

	public static Calendar strToCalendar(String strDate) throws Exception {
		int temp[] = { 1, 0, 1, 0, 0, 0 };
		int k = 0;
		temp[k++] = Integer.parseInt(strDate.substring(0, 4));

		for (int i = 4; i < strDate.length(); i = i + 2) {
			temp[k++] = Integer.parseInt(strDate.substring(i, i + 2));
		}

		Calendar calendar = Calendar.getInstance();
		calendar.set(temp[0], temp[1] - 1, temp[2], temp[3], temp[4], temp[5]);

		return calendar;

	}

	/**
	 * 인자값으로 null이 들어올경우 reval을 리턴하고, null이 아닌경우 앞뒤 공백을 빼고 리턴
	 * 
	 * @param str
	 */
	public static String notNullTrim(String str, String reval) {
		if (str == null || "".equals(str)) {
			return reval;
		} else {
			return str.trim();
		}
	}

	/**
	 * 문자열을 int 형으로 바꿔주는 함수
	 *
	 * @param str
	 *            - 문자열
	 * @return int
	 */
	public static int parseInt(String str) {
		try {
			double d = Double.parseDouble(str);
			if (d > 999999999) {
				return 999999999;
			} else {
				return (int) d;
			}
		} catch (Exception e) {
			return -0;
		}
	}

	/**
	 * 문자열을 long 형으로 바꿔주는 함수
	 *
	 * @param str
	 *            - 문자열
	 * @return int
	 */
	public static long parseLong(String str) {
		try {
			double d = Double.parseDouble(str);
			if (d > 999999999999999999l) {
				return 999999999999999999l;
			} else {
				return (long) d;
			}
		} catch (Exception e) {
			return -0;
		}
	}

	/**
	 * 문자열을 double 형으로 바꿔주는 함수
	 *
	 * @param str
	 *            - 문자열
	 * @return double
	 */
	public static double parseDouble(String str) {
		double d = 0;
		try {
			d = Double.parseDouble(str);
		} catch (Exception e) {
			log.error("Exception Occurs!!", e);
		}

		return d;

	}

	/**
	 * 문자열을 BigDecimal 형으로 바꿔주는 함수
	 *
	 * @param str
	 *            - 문자열
	 * @return BigDecimal
	 */
	public static BigDecimal Str2BigDecimal(String str) {
		BigDecimal bigDecimal = null;
		try {
			bigDecimal = new BigDecimal(str);
		} catch (Exception e) {
			bigDecimal = new BigDecimal(0);
		}

		return bigDecimal;
	}

	/**
	 * int,long 형을 문자열로 바꿔주는 함수
	 *
	 * @param num
	 *            - 숫자
	 * @return String
	 */
	public static String numToStr(long num) {

		try {
			return String.valueOf(num);
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * flot,double 형을 문자열로 바꿔주는 함수
	 *
	 * @param num
	 *            - 숫자
	 * @return double
	 */
	public static String numToStr(double num) {

		try {
			return String.valueOf(num);
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * BigDecimal 형을 문자열로 바꿔주는 함수
	 *
	 * @param AVALUE
	 *               - 숫자
	 * @return String
	 */
	public static String BigDecimal2Str(BigDecimal bigDecimal) {

		try {
			return bigDecimal.toString();
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * int,long 형을 문자열로 바꿔주는 함수
	 *
	 * @param AVALUE
	 *               - 숫자
	 * @return String
	 */
	public static String getMaskValue(long value) {

		return numberFormat.format(value);
	}

	/**
	 * float,double 형을 문자열로 바꿔주는 함수
	 *
	 * @param AVALUE
	 *               - 숫자
	 * @return String
	 */
	public static String getMaskValue(double value) {
		try {
			return numberFormat.format(value);
		} catch (Exception e) {
			return "0";
		}
	}

	/**
	 * BigDecimal 형을 문자열로 바꿔주는 함수
	 *
	 * @param AVALUE
	 *               - 숫자
	 * @return String
	 */
	public final static String getMaskValue(BigDecimal value) {

		try {
			return numberFormat.format(value.doubleValue());
		} catch (Exception e) {
			return "0";
		}
	}

	/**
	 * Object를 String으로 변환 , null은 "" 으로 처리
	 *
	 * @param Object
	 * @return String
	 */
	public static String stringValueOf(Object object) {
		String rtnStr = "";

		if (object == null) {
			rtnStr = "";
		} else {
			rtnStr = String.valueOf(object).trim();
		}
		return rtnStr;

	}

	/**
	 * 일반 공백(space)이 아닌 '유니코드공백(u0020)', '특수문자(u3000)','한글채움문자(u3164)' 특수공백을
	 * 일반공백으로 변경 후 trim
	 *
	 * @param str
	 * @return
	 */
	public static String spacialSpaceToStr(String str) {
		String rtnStr = "";

		if (str == null) {
			rtnStr = "";
		} else {
			rtnStr = str.replaceAll("[\\u0020\\u3000\\u3164]", " ").trim();
		}
		return rtnStr;
	}

	/**
	 * 입력받은 문자열을 인테페이스에 적합한 이름으로 변경
	 * 
	 * @param str
	 * @return
	 */
	public static String convertToInterfaceName(String str) {
		return str.substring(0, 3).toLowerCase() + str.substring(3, 9);
	}

	/**
	 * 
	 * substr 설명
	 *
	 * @param source
	 * @param startIndex
	 * @return
	 */
	public static String substr(String source, int startIndex) {
		if (!isEmpty(source) && source.length() > startIndex) {
			return source.substring(startIndex);
		}
		return "";
	}

	/**
	 * 
	 * substr 설명
	 *
	 * @param source
	 * @param startIndex
	 * @param length
	 * @return
	 */
	public static String substr(String source, int startIndex, int length) {
		if (!isEmpty(source) && source.length() > startIndex) {
			int offset = (startIndex + length);
			if (source.length() > offset) {
				return source.substring(startIndex, offset);
			} else {
				return source.substring(startIndex);
			}
		}
		return "";
	}

	/**
	 * 한글문자열자르기
	 * 
	 * @param orig      문자열원본
	 * @param maxLength 자를 문자열 byte 최대길이
	 * @throws Throwable
	 */
	public static String getShortString(String orig, int maxLength) {
		byte[] byteString = orig.getBytes();
		// int maxLength = 50;

		if (byteString.length <= maxLength) {
			return orig;
		} else {
			int minusByteCount = 0;
			for (int i = 0; i < maxLength; i++) {
				minusByteCount += (byteString[i] < 0) ? 1 : 0;
			}

			if (minusByteCount % 2 != 0) {
				maxLength--;
			}

			return new String(byteString, 0, maxLength);
		}
	}

	/**
	 * subStrByBtyesHangul 자를때 한글이 있으면 한글을 제외하고 자름
	 * 
	 * @param String
	 * 
	 *               ex)
	 * 
	 * @return String
	 */
	public static String subStrByHangul(String str, int cutByte) {
		if (isEmpty(str))
			return "";

		byte[] strByte = str.getBytes();
		if (strByte.length < cutByte) {
			return str;
		}

		int cnt = 0;
		for (int i = 0; i < cutByte; i++) {
			if (strByte[i] < 0) {
				cnt++;
			}
		}

		String r_str;
		if (cnt % 2 == 0)
			r_str = new String(strByte, 0, cutByte);
		else
			r_str = new String(strByte, 0, cutByte - 1);

		return r_str;
	}

	/**
	 * 
	 * trim 설명
	 *
	 * @param str
	 * @return
	 */
	public static String trim(String str) {
		return (isEmpty(str)) ? "" : str.trim();
	}

	/**
	 * 
	 * nvl 설명
	 *
	 * @param str
	 * @param def
	 * @return
	 */
	public static String nvl(String str) {
		return nvl(str, "");
	}

	/**
	 * 
	 * nvl 설명
	 *
	 * @param str
	 * @param def
	 * @return
	 */
	public static String nvl(String str, String def) {
		return (isEmpty(str)) ? def : str;
	}

	/**
	 * 
	 * nvl2 설명
	 *
	 * @param str
	 * @param def
	 * @return
	 */
	public static String nvl2(String str, String defVal, String nullVal) {
		return (isEmpty(str)) ? nullVal : defVal;
	}

	/**
	 * 
	 * lpad 설명
	 *
	 * @param i
	 * @param size
	 * @return
	 */
	public static String lpad(int i, int size) {
		return lpad(String.valueOf(i), size, "0");
	}

	/**
	 * 
	 * lpad 설명
	 *
	 * @param str
	 * @param size
	 * @return
	 */
	public static String lpad(String str, int size) {
		return lpad(str, size, "");
	}

	/**
	 * 
	 * lpad 설명
	 *
	 * @param str
	 * @param size
	 * @param padding
	 * @return
	 */
	public static String lpad(String str, int size, String padding) {
		return StringUtils.leftPad(nvl(str, ""), size, padding);
	}

	/**
	 * 
	 * rpad 설명
	 *
	 * @param i
	 * @param size
	 * @return
	 */
	public static String rpad(int i, int size) {
		return rpad(String.valueOf(i), size, "0");
	}

	/**
	 * 
	 * rpad 설명
	 *
	 * @param str
	 * @param size
	 * @return
	 */
	public static String rpad(String str, int size) {
		return rpad(str, size, "");
	}

	/**
	 * 
	 * rpad 설명
	 *
	 * @param str
	 * @param size
	 * @param padding
	 * @return
	 */
	public static String rpad(String str, int size, String padding) {
		return StringUtils.rightPad(nvl(str, ""), size, padding);
	}

	/**
	 * 
	 * decode 설명
	 *
	 * @param sourceStr
	 * @param values
	 * @return
	 */
	public static String decode(String sourceStr, String... values) {
		String defaultValue = "";
		if (values != null && values.length > 1) {
			int lastIdx = values.length - 1;

			for (int i = 0; i < values.length; i += 2) {
				if (lastIdx > i && sourceStr.equals(values[i])) {
					return values[i + 1];
				}
			}

			if (values.length % 2 != 0) {
				defaultValue = values[lastIdx];
			}
		}

		return defaultValue;
	}

	/**
	 * sha256Encode
	 * 
	 * @return str
	 * @throws Exception
	 */
	public static String sha256Encode(String str) {

		try {

			MessageDigest md = MessageDigest.getInstance("SHA-256");
			md.update(str.getBytes());

			StringBuilder sb = new StringBuilder();

			for (byte b : md.digest()) {
				sb.append(Integer.toString((b & 0xff) + 0x100, 16).substring(1));
			}

			str = sb.toString();

		} catch (Exception e) {
			log.error("Exception Occurs!!", e);
		}

		return str;
	}

	/**
	 * 2020. 08. 07
	 * sql inject 방지 로직
	 * 
	 * @return str
	 * @throws Exception
	 */
	public static String sqlInjectionCnvr(String str) {

		String reStr = "";

		Pattern SpecialChars = Pattern.compile("['\"\\#()@;=*/+]");
		reStr = SpecialChars.matcher(str).replaceAll("");

		String regex = "(union|select|from|where)";

		Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
		reStr = pattern.matcher(reStr).replaceAll("");

		return reStr;

	}

	public static String removeUFT8BOM(String s) {
		if (s != null && s.startsWith("\uFEFF")) {
			s = s.substring(1);
		}
		return s;
	}

	public static boolean isUFT8BOM(String s) {
		boolean ret = false;
		if(s != null && s.startsWith("\uFEFF")) {
			ret = true;
		}
		return ret;
	}

}