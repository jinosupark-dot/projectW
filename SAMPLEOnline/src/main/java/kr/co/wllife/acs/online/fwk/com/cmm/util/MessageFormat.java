package kr.co.wllife.acs.online.fwk.com.cmm.util;

//import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

//import org.apache.commons.logging.Log;
//import org.apache.commons.logging.LogFactory;

/**
 * File Name   : MessageFormat.java
 * Description : 
 * Author      : ksyoon
 * Date        : 2019. 5. 17.
 */
public final class MessageFormat {
	
	private MessageFormat() {}
	
	/**
	* 파라메터를 받아 에러 메세지를 아래와 같은 형식으로 생성 리턴한다.
	* 형식: SOURCE:<본 메소드 호출 소스 파일명>, LINE:<본 메소드 호출 소스의 라인넘버>, CLASS:<본 메소드 호출 클래스명>, METHOD:<본 메소드 호출 메소드명>, ERROR:[CLASS:<Exception 클래스명>, MESSAGE:<Exception 에러메시지>] 
	* 
	* @param p_objSrc 본 메소드 호출 인스턴스 (일반적으로 this 넘김)
	* @param p_errSrc 본 메소드 호출 당시 발생 Exception 혹은 Error
	* @return java.lang.String 포맷팅된 스트링 결과물
	* @see #toErrorMsg(Class, Throwable)
	*/
	public static String toErrorMsg(Object p_objSrc, Throwable p_errSrc) {
		return toErrorMsgClass(p_objSrc.getClass(), p_errSrc);
	}
	
	/**
	* <p>파라메터를 받아 에러 메세지를 아래와 같은 형식으로 생성 리턴한다.</p>
	* 
	* <p>형식: SOURCE:<본 메소드 호출 소스 파일명>, LINE:<본 메소드 호출 소스의 라인넘버>, CLASS:<본 메소드 호출 클래스명>, METHOD:<본 메소드 호출 메소드명>, ERROR:[CLASS:<Exception 클래스명>, MESSAGE:<Exception 에러메시지>] 
	* 주로 static 함수 혹은 스코프에서 사용된다.</p>
	* 
	* @param p_clsSrc 본 메소드 호출 클래스
	* @param p_errSrc 본 메소드 호출 당시 발생 Exception 혹은 Error
	* @return java.lang.String 포맷팅된 스트링 결과물
	*/
	@SuppressWarnings("rawtypes")
	public static String toErrorMsgClass(Class p_clsSrc, Throwable p_errSrc) {
		String date = new SimpleDateFormat("HH:mm:ss").format(new Date());
		String classNm = p_clsSrc.getName();
		StackTraceElement[] elements = Thread.currentThread().getStackTrace();
		
		for(int i = 0; i < elements.length; i++) {
			StackTraceElement e = elements[i];
			if(e.getClassName().contains(classNm)) {
				String src = e.getFileName();
				int line = e.getLineNumber();
				String cls = e.getClassName();
				String mth = e.getMethodName();
				String errCls = p_errSrc.getClass().getName();
				String errMsg = p_errSrc.getMessage();
				
				return date + " SOURCE:" + src + ", LINE:" + line + ", CLASS:" + cls + ", METHOD:" + mth + ", ERROR:[CLASS:" + errCls + ", MESSAGE:" + errMsg + "]";
			}
		}
		
		return p_errSrc.toString();
	}
	
	/**
	* <p>파라메터를 받아 에러 메세지를 아래와 같은 형식으로 생성 리턴한다.</p>
	* 
	* <p>형식: SOURCE:<본 메소드 호출 소스 파일명>, LINE:<본 메소드 호출 소스의 라인넘버>, CLASS:<본 메소드 호출 클래스명>, METHOD:<본 메소드 호출 메소드명>, ERROR:[CLASS:<Exception 클래스명>, MESSAGE:<Exception 에러메시지>]</p> 
	* 
	* @param p_objSrc 본 메소드 호출 인스턴스 (일반적으로 this 넘김)
	* @param p_format {@link String#format(String, Object...)} 의 첫 파라메터 참조
	* @param p_args {@link String#format(String, Object...)} 의 두번째 파라메터 참조
	* @return java.lang.String 포맷팅된 스트링 결과물
	* @see #toDebugMsg(Class)
	*/
	public static String toDebugMsgf(Object p_objSrc, String p_format, Object ... p_args) {
		return new StringBuilder(toDebugMsg(p_objSrc.getClass())).append(" - ").append(String.format(p_format, p_args)).toString();
	}
	
	/**
	* 파라메터를 받아 에러 메세지를 아래와 같은 형식으로 생성 리턴한다.
	* 형식: SOURCE:<본 메소드 호출 소스 파일명>, LINE:<본 메소드 호출 소스의 라인넘버>, CLASS:<본 메소드 호출 클래스명>, METHOD:<본 메소드 호출 메소드명>, ERROR:[CLASS:<Exception 클래스명>, MESSAGE:<Exception 에러메시지>] 
	* 
	* @param p_objSrc 본 메소드 호출 인스턴스 (일반적으로 this 넘김)
	* @return java.lang.String 포맷팅된 스트링 결과물
	* @see #toDebugMsg(Class)
	*/
	public static String toDebugMsg(Object p_objSrc) {
		return toDebugMsgClass(p_objSrc.getClass());
	}
	
	/**
	* 파라메터를 받아 에러 메세지를 아래와 같은 형식으로 생성 리턴한다.
	* 형식: SOURCE:<본 메소드 호출 소스 파일명>, LINE:<본 메소드 호출 소스의 라인넘버>, CLASS:<본 메소드 호출 클래스명>, METHOD:<본 메소드 호출 메소드명>, ERROR:[CLASS:<Exception 클래스명>, MESSAGE:<Exception 에러메시지>]
	* 주로 static 함수 혹은 스코프에서 사용된다. 
	* 
	* @param p_clsSrc 본 메소드 호출 클래스
	* @return java.lang.String 포맷팅된 스트링 결과물
	* @see java.lang.Thread#getStackTrace()
	*/
	@SuppressWarnings("rawtypes")
	public static String toDebugMsgClass(Class p_clsSrc) {
		String date = new SimpleDateFormat("HH:mm:ss").format(new Date());
		String classNm = p_clsSrc.getName();
		StackTraceElement[] elements = Thread.currentThread().getStackTrace();
		
		for(int i = 0; i < elements.length; i++) {
			StackTraceElement e = elements[i];
			if(e.getClassName().contains(classNm)) {
				String src = e.getFileName();
				int line = e.getLineNumber();
				String cls = e.getClassName();
				String mth = e.getMethodName();
				
				return date + " SOURCE:" + src + ", LINE:" + line + ", CLASS:" + cls + ", METHOD:" + mth;
			}
		}
		
		return "";
	}
	
}
