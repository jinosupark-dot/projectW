package kr.co.wllife.acs.online.fwk.com.cmm.tag;

import java.io.IOException;

import jakarta.servlet.jsp.JspException;
import jakarta.servlet.jsp.tagext.TagSupport;
import kr.co.wllife.acs.online.fwk.com.cmm.util.CommonUtil;
import kr.co.wllife.acs.online.fwk.com.cmm.util.StringUtil;

/**
 * 
 * @시스템명: ifrs17
 * @업무명: 공통
 * @설명: js 요청에 대한 캐싱처리
 * @최초작성자: 89001203
 * @최초작성일: 2021. 1. 8.
 * @최종변경일: 
 * @개정이력: 
 *  89001203 2021. 1. 8. 최초작성
 */
public class JsTag extends TagSupport {
	
	private static final long serialVersionUID = 1L;
	
	/**	대상 위치 */
	private String type;
	private String value;

	/** 캐싱 파라미터 */
	private static String version = null;
	
	/**	개발용 대상 위치 */
//	private String devonlyurl;
	
	/**	defer 적용여부 */
	private boolean defer;
	
	/** async 적용여부 */
	private boolean async;
	
	/**	캐릭터 인코딩 */
	private String charset;
	

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
			
			String jsurl = value;
			String jsType = StringUtil.isNotEmpty(type) ? type : "text/javascript";
			StringBuilder sb = new StringBuilder()
            .append("<script")
            .append(" type='").append(jsType).append("'")
            .append(" src='").append(jsurl).append("?v=").append(version).append("'");
			if(defer) sb.append(" defer='defer'");
			if(async) sb.append(" async='async'");
			if(StringUtil.isNotEmpty(charset)) {
				sb.append(" charset='" + charset + "'");
			} else {
				sb.append(" charset='utf-8'");
			}
            sb.append("></script>");
            pageContext.getOut().print(sb.toString());
            return SKIP_BODY;
            
        } catch (IOException e) {
            throw new JspException();
        }
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public void setValue(String value) {
		this.value = value;
	}

	public void setDefer(boolean defer) {
		this.defer = defer;
	}

	public void setAsync(boolean async) {
		this.async = async;
	}

	public void setCharset(String charset) {
		this.charset = charset;
	}
}
