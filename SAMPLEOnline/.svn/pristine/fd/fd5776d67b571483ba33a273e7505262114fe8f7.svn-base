package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @시스템명: ifrs17
 * @업무명: XML Document를 처리하기 위한 유틸
 * @설명:
 * @최초작성자: 장창환
 * @최초작성일: 2021. 3. 17.
 * @최종변경일:
 * @개정이력: 장창환 2021. 3. 17. 최초작성
 */
@Slf4j 
public class XMLUtil {

	// static final Logger log = LoggerFactory.getLogger(XMLUtil.class);
	
	static final String XML_DOC_TYPE = "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>";
	/**
	 * 
	 * @설명: XML 문자열로 Document 객체를 생성한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 17.
	 * @최종변경일:
	 * @매개변수: String xmlString : XML 문자열
	 * @반환값: Document
	 * @개정이력: 장창환 2021. 3. 17. 최초작성
	 */
	public static Document getDocument(String xmlString) {
		Document doc = null;
		try {
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			InputSource is = new InputSource(new StringReader(xmlString));
			doc = dBuilder.parse(is);
		} catch (Exception e) {
			log.error("Exception Occurs!", e);
		}
		return doc;
	}

	/**
	 * 
	 * @설명: tag의 TextNode값을 반환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 17.
	 * @최종변경일:
	 * @매개변수: Document doc : Document
	 * @매개변수: String tag : Tag Name
	 * @반환값: String
	 * @개정이력: 장창환 2021. 3. 17. 최초작성
	 */
	public static String getTagValue(Document doc, String tag) {
		NodeList nList = doc.getElementsByTagName(tag).item(0).getChildNodes();
		Node nValue = (Node) nList.item(0);
		if (nValue == null) {
			return null;
		}
		return nValue.getNodeValue();
	}

	/**
	 * 
	 * @설명: XML 요소들의 Encoding 처리를 한다.
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 3. 18.
	 * @최종변경일: 
	 * @매개변수: String s : Encoding 할 Document String
	 * @반환값: String
	 * @개정이력: 
	 *  89001203 2021. 3. 18. 최초작성
	 */
	public static String XMLEncoder(String s) {
		StringBuffer str = new StringBuffer();

		int len = (s != null) ? s.length() : 0;
		for (int i = 0; i < len; i++) {
			char ch = s.charAt(i);
			switch (ch) {
				case '<':
					str.append("&lt;");
					break;
				case '>':
					str.append("&gt;");
					break;
				case '&':
					str.append("&amp;");
					break;
				case '"':
					str.append("&quot;");
					break;
				case '\'':
					str.append("&apos;");
					break;
				default:
					if (ch >= 0 && ch <= 9) {
						str.append(" ");
					} else if (ch >= 11 && ch <= 12) {
						str.append(" ");
					} else if (ch >= 14 && ch <= 31) {
						str.append(" ");
					} else {
						str.append(ch);
					}
			}
		}
		return str.toString();
	}

	/**
	 * 
	 * @설명: XMLDecoder. XML String을 Decoding한다. ( &gt;는 >로 변환) str 변환할 String
	 * @최초작성자: 89001203
	 * @최초작성일: 2021. 3. 18.
	 * @최종변경일: 
	 * @매개변수: String s : Encoding 할 Document String
	 * @반환값: String
	 * @개정이력: 
	 *  89001203 2021. 3. 18. 최초작성
	 */
	public static String XMLDecoder(String s) {
		String re1 = "&lt;"; // Initialize pattern.
		String re2 = "&gt;"; // Initialize pattern.
		String re3 = "&apos;"; // Initialize pattern.
		String re4 = "&quot;"; // Initialize pattern.
		String re5 = "&amp;"; // Initialize pattern.
		return s.replaceAll(re1, "<").replaceAll(re2, ">").replaceAll(re3, "'").replaceAll(re4, "\"").replaceAll(re5,
				"&");
	}

	/**
	 * 
	 * @설명: XML 문자열로 Document 객체를 생성한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 17.
	 * @최종변경일:
	 * @매개변수: String xmlString : XML 문자열
	 * @반환값: Document
	 * @개정이력: 장창환 2021. 3. 17. 최초작성
	 */
	public static Document mapToDocument(Map reqMap, String rootName) {
		Document doc = null;
		try {
			String rootElementName = "";
			if (StringUtil.isEmpty(rootName)) {
				rootElementName = "<doc/>";
			} else {
				if (rootName.indexOf("<") > -1) {
					rootElementName = rootName;
				} else {
					rootElementName = "<" + rootName + "/>";
				}
			}
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			InputSource is = new InputSource(new StringReader(XML_DOC_TYPE + rootElementName));
			log.debug("DocType:" + XML_DOC_TYPE);
			log.debug("rootElementName:" + rootElementName);
			doc = dBuilder.parse(is);
			Element root = doc.getDocumentElement();
			Iterator keys = reqMap.keySet().iterator();
			while (keys.hasNext()) {
				String key = (String) keys.next();
				Object value = reqMap.get(key);
				if(value == null) value = "";
				if (value instanceof Map) {
					Element _childNode = doc.createElement(key);
					root.appendChild(mapToElement(_childNode, (Map) value));
				} else if (value instanceof List) {
					listToElement(root, (List) value, key);
				} else {
					String nodeValue = value.toString();
					Element _childNode = doc.createElement(key);
					_childNode.setTextContent(nodeValue);
					root.appendChild(_childNode);
				}
			}

		} catch (Exception e) {
			log.error("Exception Occurs!", e);
		}
		return doc;
	}

	/**
	 * 
	 * @설명: Document를 Map객체로 변환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 17.
	 * @최종변경일:
	 * @매개변수: Document doc
	 * @반환값: Map
	 * @개정이력: 장창환 2021. 3. 17. 최초작성
	 */
	public static Map documentToMap(Document doc) {
		Map retMap = new LinkedHashMap();
		try {
			Element rootElement = doc.getDocumentElement();
			retMap = elementToMap(rootElement);
		} catch (Exception ex) {
			log.error("Parsing Exception.", ex);
		}
		
		return retMap;
	}

	/**
	 * 
	 * @설명: Document String을 Map객체로 변환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 17.
	 * @최종변경일:
	 * @매개변수: Document doc
	 * @반환값: Map
	 * @개정이력: 장창환 2021. 3. 17. 최초작성
	 */
	public static Map documentStringToMap(String xmlStr) {
		Map retMap = new LinkedHashMap();
		try {
			Document doc = getDocument(xmlStr);
			retMap = documentToMap(doc);
		} catch (Exception ex) {
			log.error("Parsing Exception.", ex);
		}
		
		return retMap;
	}

	/**
	 * 
	 * @설명: XML Element 객체를 Map객체로 변환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 17.
	 * @최종변경일:
	 * @매개변수: Element element
	 * @반환값: Map
	 * @개정이력: 장창환 2021. 3. 17. 최초작성
	 */
	private static Map elementToMap(Element element) {
		Map retMap = new LinkedHashMap();
		try {
			NodeList dataList = element.getChildNodes();
			for (int i = 0; i < dataList.getLength(); i++) {
				Node dataNode = dataList.item(i);
				String nodeName = dataNode.getNodeName();
				int nodeType = dataNode.getNodeType();
				
//				if(logger.isDebugEnabled()) {
//					NodeList subList = dataNode.getChildNodes();
//					logger.debug("nodeName:" + nodeName + ", nodeType:" + nodeType + ", text:" + dataNode.getTextContent() + ",childeren:" + subList.getLength() + ",sampeNode cnt:" + element.getElementsByTagName(nodeName).getLength());
//				}

				if(nodeType == Node.ELEMENT_NODE) {
					Element dataElement = (Element)dataNode;
					Element firstElement = null;
					NodeList list = dataElement.getChildNodes();
					for(int j=0; j<list.getLength(); j++) {
						if(list.item(j).getNodeType() == Node.ELEMENT_NODE) {
							firstElement = (Element)list.item(j);
							break;
						}
					}
					
					//동일 다건처리
					if(element.getElementsByTagName(nodeName).getLength() > 1) {
						if(!retMap.containsKey(nodeName)) {
							retMap.put(nodeName, new ArrayList());
						}
						List tempList = (ArrayList)retMap.get(nodeName);
						tempList.add(elementToMap(dataElement));
					} else {
						//첫번째 노드가 ELEMENT이면 MAP으로 처리
						if(firstElement != null) {	
							Map firstMap = elementToMap(dataElement);
							retMap.put(nodeName, firstMap);
						} else {
							String value = dataElement.getTextContent();
							retMap.put(nodeName, value);
						}
					}
				}
			}
		} catch (Exception ex) {
			log.error("Parsing Exception.", ex);
		}
		
		return retMap;
	}
	
	/**
	 * 
	 * @설명: Element 객체를 Map 객체로 변환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 17.
	 * @최종변경일:
	 * @매개변수: Element element : 대상 Element
	 * @매개변수: Map reqMap : 대상 Map
	 * @반환값: Element
	 * @개정이력: 장창환 2021. 3. 17. 최초작성
	 */
	private static Element mapToElement(Element targetElement, Map<String, Object> reqMap) {
		try {
			Iterator keys = reqMap.keySet().iterator();
			while (keys.hasNext()) {
				String key = (String) keys.next();
				Object value = reqMap.get(key);
				if(value == null) value = "";
				if (value instanceof Map) {
					Element _childNode = targetElement.getOwnerDocument().createElement(key);
					targetElement.appendChild(mapToElement(_childNode, (Map) value));
				} else if (value instanceof List) {
					targetElement.appendChild(listToElement(targetElement, (List) value, key));
				} else {
					String nodeValue = value.toString();
					Element _childNode = targetElement.getOwnerDocument().createElement(key);
					_childNode.setTextContent(nodeValue);
					targetElement.appendChild(_childNode);
				}
			}
		} catch (Exception e) {
			log.error("Exception Occurs!", e);
		}
		return targetElement;
	}

	/**
	 * 
	 * @설명: List 객체를 Element 객체로 변환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 17.
	 * @최종변경일:
	 * @매개변수: Element targetElement : 대상 Element
	 * @매개변수: List reqList : 대상 List
	 * @매개변수: String NodeName : XML Element명
	 * @반환값: Element
	 * @개정이력: 장창환 2021. 3. 17. 최초작성
	 */
	private static Element listToElement(Element targetElement, List<Object> reqList, String NodeName) {
		try {
			for (int i = 0; i < reqList.size(); i++) {
				Object value = reqList.get(i);
				if (value instanceof Map) {
					Element _childNode = targetElement.getOwnerDocument().createElement(NodeName);
					targetElement.appendChild(mapToElement(_childNode, (Map) value));
				} else if (value instanceof List) {
					// LIST에 LIST는 미지원
					throw new Exception("Not Supported List in List");
				} else {
					String nodeValue = value.toString();
					targetElement.setTextContent(nodeValue);
				}
			}
		} catch (Exception e) {
			log.error("Exception Occurs!", e);
		}
		return targetElement;
	}

	/**
	 * 
	 * @설명: XML Document 객체를 String으로 변환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 17.
	 * @최종변경일:
	 * @매개변수: Document doc : 변환할 Document
	 * @반환값: String
	 * @개정이력: 장창환 2021. 3. 17. 최초작성
	 */
	public static String serializeDom(Document doc) {
		String output = "";
		try {
			output = serializeDom(doc, false);
		} catch (Exception ex) {
			log.error("Parsing Exception.", ex);
		}
		return output;
	}
	
	/**
	 * 
	 * @설명: XML Document 객체를 String으로 변환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 17.
	 * @최종변경일:
	 * @매개변수: Document doc : 변환할 Document
	 * @매개변수: boolean docType : XML Doctype 생성 여부
	 * @반환값: String
	 * @개정이력: 장창환 2021. 3. 17. 최초작성
	 */
	public static String serializeDom(Document doc, boolean docType) {
		String output = "";
		try {
			TransformerFactory tf = TransformerFactory.newInstance();
			Transformer transformer = tf.newTransformer();
			transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
			StringWriter writer = new StringWriter();
			transformer.transform(new DOMSource(doc), new StreamResult(writer));
			output = writer.getBuffer().toString();
			if(docType) {
				output = XML_DOC_TYPE + output;
			}
		} catch (Exception ex) {
			log.error("Parsing Exception.", ex);
		}
		return output;
	}
	
	/**
	 * 
	 * @설명: Map 객체를 XML String 객체로 변환한다.
	 * @최초작성자: 장창환
	 * @최초작성일: 2021. 3. 17.
	 * @최종변경일:
	 * @매개변수: Map reqMap : 변환할 Map
	 * @매개변수: String : Root Node명
	 * @반환값: String
	 * @개정이력: 장창환 2021. 3. 17. 최초작성
	 */	public static String mapToDocumentString(Map reqMap, String rootName) {
		Document doc = mapToDocument(reqMap, rootName);
		return XMLUtil.serializeDom(doc, true);
	}

	/** 
	public static void main(String[] args) throws Exception {
		Map headerMap = new LinkedHashMap();
		headerMap.put("sbadoc", "1");
		headerMap.put("tcode", "2");
		headerMap.put("bpcode", "3");

		List<Map> list = new ArrayList();
		for (int i = 0; i < 3; i++) {
			Map subMap = new LinkedHashMap();
			subMap.put("buzei", "002");
			subMap.put("newbs", "50");
			list.add(subMap);
		}

		Map map = new LinkedHashMap();
		map.put("eSubrc", "<test>");
		map.put("eMessage", "b");
		map.put("eBelnr", "c");
		map.put("iPSapsSlpSndHedrVO", headerMap);
		map.put("listIPSapsSlpSndItmVO", list);

		Document doc = XMLUtil.mapToDocument(map, "iPSapsSlpSndVO");
		log.info("doc:" + serializeDom(doc,true));
		
		log.info("documentToMap:" + documentToMap(doc));
	}
	**/
}
