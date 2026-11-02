package kr.co.wllife.acs.online.fwk.com.cmm.tag;

import java.io.IOException;

import jakarta.servlet.jsp.JspException;
import jakarta.servlet.jsp.tagext.BodyTagSupport;
import kr.co.wllife.acs.online.fwk.com.cmm.util.CommonUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.StringUtil;

/**
 * 
 * @시스템명: ifrs17
 * @업무명: 공통
 * @설명: CSS 요청에 대한 캐싱처리
 * @최초작성자: 89001203
 * @최초작성일: 2021. 1. 8.
 * @최종변경일: 
 * @개정이력: 
 *  89001203 2021. 1. 8. 최초작성
 */
public class CssTag extends BodyTagSupport {
	
	private static final long serialVersionUID = 1L;

	/**	대상 위치 */
	private String value = null;
	private String sheet = null;
	
	/** 캐싱 파라미터 */
	private static String version = null;

	/**
	 * 입력받은 정보를 참조하여 태그를 생성한다.
	 */
	public int doStartTag() throws JspException{
		try {
			if (value == null || "".equals(value)) return SKIP_BODY;

			if(CommonUtil.isDevAndTest()) {	//개발, 검증 서버 no cache
				version = System.currentTimeMillis() + "";
			} else {	//운영 서버 리스타트시에 갱신 처리
				if(version == null) {
					version = System.currentTimeMillis() + "";
				}
			}
			
			if( StringUtil.isEmpty(sheet) ) sheet = "stylesheet";
					
			StringBuilder sb = new StringBuilder()
            .append("<link")
            .append(" type=\"text/css\"")
            .append(" rel=\""+ sheet +"\"")
            .append(" href=\""+value+"?v="+version+"\"")
            .append(">");
            pageContext.getOut().print(sb.toString());
            return SKIP_BODY;
        } catch (IOException e) {
            throw new JspException();
        }
	}

	public void setValue(String value) {
		this.value = value;
	}

	public void setSheet(String sheet) {
		this.sheet = sheet;
	}
}
