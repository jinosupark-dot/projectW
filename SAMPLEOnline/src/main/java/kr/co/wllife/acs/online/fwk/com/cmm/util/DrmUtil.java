package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import MarkAny.MaSaferJava.MaFileChk;
import MarkAny.MaSaferJava.Madec;
import MarkAny.MaSaferJava.Madn;
import lombok.extern.slf4j.Slf4j;

@Slf4j 
public class DrmUtil {
	 private static DrmUtil du = null; 
	
	/*private DrmUtil() { super(); this.streamFileChk(); this.streamDec();
	 
	}*/
	 
	public boolean streamFileChk(String newFile) {
		// TODO Auto-generated method stub

		log.info("streamFileChk called");

		MaFileChk clMaFileChk = null; // 클래스 생성 준비
		BufferedInputStream in = null;
		String strRetCode = "";
		long outFileLength = 0;

		String fileName = new String(newFile); // 파일체크
		// 파일
		File file = new File(fileName); // 파일체크 대상 파일

		if (file.length() == 0) {
			log.info("Error 파일크기 에러입니다.");
			return false;

		}

		try {
			in = new BufferedInputStream(new FileInputStream(file));
		} catch (Exception e) {
			log.info("스트림 객체 생성 에러입니다.");
			return false;

		}

		// create Instance
		// 파일체크 클래스 생성
		try {
			String MarkAnyDrmInfoDatPath = FwkProperties.getProperty("drm.datPath");
			clMaFileChk = new MaFileChk(MarkAnyDrmInfoDatPath);

		} catch (Exception e) {
			log.info("MarkAny 파일체크 클래스 생성 에러입니다.");
			log.info("MarkAnyDrmInfo.dat 파일의 경로와 권한을 확인 해주세요.");
			return false;
		}

		// 파일체크 대상 파일의 크기를 가져옵니다.
		long fileLen = file.length();

		// 파일체크 및 파라미터 점검을 합니다.
		log.info("fileName : " + fileName);
		log.info("fileLen : " + fileLen);
		log.info("in : " + in);
		outFileLength = clMaFileChk.lGetFileChkFileSize(fileName, fileLen, in);

		// 파일체크 준비를 합니다.
		if (outFileLength > 0) {
			// 파일을 체크합니다.
			strRetCode = clMaFileChk.strMaFileChk();

		} else {

			log.info("파일에 문제가 있습니다.");
			strRetCode = clMaFileChk.strGetErrorCode();
			return false;
		}

		if ("00000".equals(strRetCode)) {
			// 파일체크를 성공하였습니다.
			log.info("파일체크를 성공 하였습니다. 해당 파일은 암호화 파일 입니다.");
			// 암호 파일의 속성 체크

			log.info("strGetUserID() = [" + clMaFileChk.strGetUserID() + "]");
			log.info("strGetMultiUserID() = [" + clMaFileChk.strGetMultiUserID() + "]");
			log.info("strGetEnterpriseID() = [" + clMaFileChk.strGetEnterpriseID() + "]");
			log.info("strGetCompanyID() = [" + clMaFileChk.strGetCompanyID() + "]");
			log.info("strGetGroupID() = [" + clMaFileChk.strGetGroupID() + "]");
			log.info("strGetDeptID() = [" + clMaFileChk.strGetDeptID() + "]");
			log.info("strGetPositionID() = [" + clMaFileChk.strGetPositionID() + "]");
			log.info("strGetPositionLevel() = [" + clMaFileChk.strGetPositionLevel() + "]");
			log.info("strGetSecurityLevel() = [" + clMaFileChk.strGetSecurityLevel() + "]");
			log.info("strGetDocumentGrade() = [" + clMaFileChk.strGetDocumentGrade() + "]");
			log.info("strGetDocExchangePolicy() = [" + clMaFileChk.strGetDocExchangePolicy() + "]");

			log.info("strGetMachineKey() = [" + clMaFileChk.strGetMachineKey() + "]");
			log.info("strGetDocumentKey() = [" + clMaFileChk.strGetDocumentKey() + "]");
			log.info("strGetCreatorID() = [" + clMaFileChk.strGetCreatorID() + "]");
			log.info("strGetCreatorCompanyID() = [" + clMaFileChk.strGetCreatorCompanyID() + "]");
			log.info("strGetCreatorDeptID() = [" + clMaFileChk.strGetCreatorDeptID() + "]");
			log.info("strGetCreatorGroupID() = [" + clMaFileChk.strGetCreatorGroupID() + "]");
			log.info("strGetCreatorPositionID() = [" + clMaFileChk.strGetCreatorPositionID() + "]");
			log.info("strGetCreateBy() = [" + clMaFileChk.strGetCreateBy() + "]");

			return true;

		} else {
			// 파일체크를 실패했습니다.
			log.info("파일체크에 오류가 발생했습니다. ERR [ErrorCode] = [" + strRetCode + "]" + "[ErrorDescription] = ["
					+ clMaFileChk.strGetErrorMessage(strRetCode) + "]");

			return false;
		}

	}

	public String streamDec(String newFile) {
		Madec clMadec = null; // 클래스 생성 준비
		BufferedInputStream in = null;
		BufferedOutputStream out = null;

		String strRetCode = "";
		long outFileLength = 0;

		// Parameter
		String fileName = new String(newFile); // 파일이름 지정

		File file = new File(fileName);
		String outPutFileName = "";

		if (newFile.toLowerCase().endsWith(".xlsx")) {
			outPutFileName = fileName.replace(".xlsx", "_Dec.xlsx");
		} else {
			outPutFileName = fileName.replace(".csv", "_Dec.csv");
		}

		File fileOut = new File(outPutFileName);
		log.info("fileOut : " + fileOut);

		if (file.length() == 0) {
			log.info("ERR 파일크기 에러입니다.");
			return "ERR";
		}

		try {
			in = new BufferedInputStream(new FileInputStream(file));
			out = new BufferedOutputStream(new FileOutputStream(fileOut));

		} catch (Exception e) {
			log.info("스트림 객체 생성 에러입니다.");
			return "ERR";
		}

		// create instance
		// 복호화 클래스 생성

		try {
			String MarkAnyDrmInfoDatPath = FwkProperties.getProperty("drm.datPath");
			clMadec = new Madec(MarkAnyDrmInfoDatPath);

		} catch (Exception e) {
			log.info("마크애니 복호화 클래스 생성 에러입니다.");
			log.info("MarkAnyDrmInfo.dat 파일의 경로와 권환을 확인 해주세요");
			return "ERR";
		}

		// 복호화 대상 파일의 크기를 가져옵니다.
		long fileLen = file.length();

		// 복호화 및 파라미터 점검을 합니다.
		outFileLength = clMadec.lGetDecryptFileSize(fileName, fileLen, in);

		// 복호화 준비를 합니다.
		if (outFileLength > 0) {

			// 복호화 합니다.
			strRetCode = clMadec.strMadec(out);
		} else {
			log.info("복호화 시작 전에 실패 하였습니다.");
			strRetCode = clMadec.strGetErrorCode();
			log.info("ERR [ErrorCode] = [" + strRetCode + "]" + "[ErrorDescription] = ["
					+ clMadec.strGetErrorMessage(strRetCode) + "]");
			return "ERR";

		}

		if ("00000".equals(strRetCode)) {
			// 복호화를 성공했습니다.
			log.info("복호화에 성공 하였습니다.");
			log.info("RetCode = [" + strRetCode + "]");
			return outPutFileName;
		} else {
			// 복호화에 실패했습니다.
			fileOut.delete();
			log.info("복호화에 실패 하였습니다.");
			log.info("ERR [ErrorCode] = [" + strRetCode + "]" + "[ErrorDescription] = ["
					+ clMadec.strGetErrorMessage(strRetCode) + "]");
			return "ERR";
		}
	}

	// 암호화
	public String streamDn(String newFile) {
		// ERROR 명 CODE EXPLN
		// ISUCCESS 00000 Success
		// IFAILED 10000 Failed
		// IORGFILE 00001 Original File
		// E_CONNECT_ERROR 10001 Connect error
		// E_SOCK_ERROR 10014 Socket error
		// E_WRITE_SOCKET 10015 Socket Write error
		// E_READ_SOCKET 10016 Socket Read error
		// E_SOCK_SIG_ERROR 10020 Pack signal error
		// E_SDMS_RULE_ERROR 30001 DocLevel rule setting error
		// E_SDMS_DECRYPT_ERROR 30004 Document decryption error
		// E_HEADER_SIZE_ERROR 30007 File Header error
		// E_COMPANY_ID_ERROR 30008 Company Id error
		// E_FILE_OPEN_ERROR 40001 File not exist error
		// E_ARGUMENT_ERROR 90001 Parameter length error
		// E_DISMATCH_COMPANY_ERROR 90004 Company Id Mismatch error
		// E_MISMATCH_MARKANY_SIGNATURE 90005 Plain File error
		// E_DISMATCH_ENTERPRISE_ERROR 90006 Enterprise Id Mismatch error
		// E_NOTSUPPORT_VERSION_ERROR 90009 Not Supported Version error
		// E_INPUTSTREAM_LENGTH_ERROR 99006 Input Stream Length error

		Madn clMadn = null; // 클래스 생성 준비

		BufferedInputStream in = null;
		BufferedOutputStream out = null;

		String strRetCode = "";
		long outFileLength = 0;

		String fileName = new String(newFile); // 파일이름 지정
		log.info("fileName : " + fileName);
		
		String outPutFileName = "";
		if (newFile.toLowerCase().endsWith(".xlsx")) {
			outPutFileName = fileName.replace(".xlsx", "_Dn.xlsx");
		} else {
			outPutFileName = fileName.replace(".csv", "_Dn.csv");
		}
		log.info("outFFFFFFFFFFFFFFFFFFFNAME:" + outPutFileName);
		log.info("111111111111111111111111111111111111");
		// Parameter
		File file = new File(fileName); // 암호화 대상 평문 파일
		File fileOut = new File(outPutFileName); // 암호화 결과로 생성할 파일

		if (file.length() == 0) {
			log.info("ERR 파일크기 에러입니다");
			return "ERR";
		}

		try {
			in = new BufferedInputStream(new FileInputStream(file));
			out = new BufferedOutputStream(new FileOutputStream(fileOut));
		} catch (Exception e) {
			log.info("스트림 객체 생성 에러입니다");
			return "ERR";
		}

		// create Instance
		// 암호화 클래스 생성
		try {
			String MarkAnyDrmInfoDatPath = FwkProperties.getProperty("drm.datPath");
			clMadn = new Madn(MarkAnyDrmInfoDatPath);

		} catch (Exception e) {
			log.info("마크애니 암호화 클래스 생성 에러입니다.");
			log.info("MarkAnyDrmInfo.dat 파일의 경로와 권한을 확인 해줒세요");
			return "ERR";
		}
		
		

		// Sample Parameter
		int piAclFlag = 0;
		String pstrDocLevel = new String("0");
		String pstrUserId = new String("마크애니");//////////////////////
		
		String pstrFileName = new String(fileName);///암호화하려는 파일이름///
		String pstrOwnerId = new String("pstrOwnerId");
		String pstrGroupId = new String("pstrGroupId");
		String pstrPositionId = new String("pstrPositionId");
		String pstrGrade = new String("pstrGrade");
		String pstrFileId = new String(
				"20100804165120000abcedfasdf20100804165120000abcedfasdf20100804165120000abcedfasdf20100804165120000abcedfasdf20100804165120000abcedfasdf_endofstring");//////////////////////
		String pstrCompanyId = new String("ALLIANZLIF-B2CD-A167-4184");
		String strEnterpriseID = new String("ALLIANZLIFG-70AF-8919-4EA4");
		int piCanSave = 1;
		int piCanEdit = 1;
		int piBlockCopy = 0;
		int piOpenCount = -99;
		int piPrintCount = -99;
		int piValidPeriod = -99;
		int piSaveLog = 1;
		int piPrintLog = 1;
		int piOpenLog = 1;
		int piVisualPrint = 1;
		int piImageSafer = 1;
		int piRealTimeAcl = 0;
		String pstrDocumentTitle = new String("");
		String pstrCompanyName = new String("ABL");
		String pstrGroupName = new String("pstrGroupName");
		String pstrPositionName = new String("pstrPositionName");
		String pstrUserName = new String("drm001"); //////////////////////
		String pstrUserIp = new String("127.0.0.1"); //////////////////////
		String pstrServerOrigin = new String("IFRS17");
		int piExchangePolicy = 1;
		int piDrmFlag = 0;
		int iBlockSize = 0;
		String strMachineKey = new String("");

		String strFileVersion = new String("");
		String strMultiUserID = new String("userid;userid2;");
		// String strMultiUserID = new String(
		// "userid;userid2;length_test;userid_markany1234567890;userid_markany1234567890;userid_markany1234567890;userid_markany1234567890;userid_markany1234567890;long_userid_test;"
		// );
		String strMultiUserName = new String("multiusername1;");
		String strEnterpriseName = new String("ABL");
		// String strDeptID = new String( "deptid" );
		String strDeptID = new String("deptid;"); //////////////////////
		// String strDeptName = new String( "deptname" );
		String strDeptName = new String("deptname;"); //////////////////////
		String strPositionLevel = new String("");
		String strSecurityLevel = new String("1");
		String strSecurityLevelName = new String("");
		String strPgCode = new String("");
		String strCipherBlockSize = new String("16");
		String strCreatorID = new String("");
		String strCreatorName = new String("");
		String strOnlineContorl = new String("0");
		String strOfflinePolicy = new String("");
		String strValidPeriodType = new String("");
		String strUsableAlways = new String("0");
		String strPriPubKey = new String("");
		String strCreatorCompanyId = new String("mark1");
		String strCreatorDeptId = new String("mark2");
		String strCreatorGroupId = new String("mark3");
		String strCreatorPositionId = new String("mark4");
		String strFileSize = new String("4567");
		String strHeaderUpdateTime = new String("");
		String strReserved01 = new String("reserved01");
		String strReserved02 = new String("reserved02");
		String strReserved03 = new String("reserved03");
		String strReserved04 = new String("reserved04");
		String strReserved05 = new String("reserved05");

		// 원본(암호화 대상 파일) 파일 크기를 가져옵니다.
		long plFileSize = file.length();

		// 암호화 및 파라미터 점검을 합니다.
		try {
			outFileLength = clMadn.lGetEncryptFileSize(piAclFlag, // ACL 참조 방식(
																	// 고정값 0 )
					pstrDocLevel, // 암호화 문서 등급 ( 고정값 0 )
					pstrUserId, // 사용자 ID
					pstrFileName, // 파일 이름
					plFileSize, // 암호화하려는 원본 파일 크기
					pstrOwnerId, // 암호화 대상 파일 소유자
					pstrCompanyId, // 회사코드 ID
					pstrGroupId, // 그룹코드 ID
					pstrPositionId, // 직위코드 ID
					pstrGrade, // 등급
					pstrFileId, // 파일 고유 ID
					piCanSave, // 저장 권한 (가능 1, 불가 0)
					piCanEdit, // 수정 권한 (가능 1, 불가 0)
					piBlockCopy, // 블룩복사 권한 (가능 1, 불가 0)
					piOpenCount, // 열람 가능 회수 (회수 또는 제한없음 -99)
					piPrintCount, // 출력 가능 회수 (회수 또는 제한없음 -99)
					piValidPeriod, // 문서 사용 가능 기간(기간 또는 제한없음 -99)
					piSaveLog, // 저장 로그 (가능 1, 불가 0)
					piPrintLog, // 출력 로그 (가능 1, 불가 0)
					piOpenLog, // 열람 로그 (가능 1, 불가 0)
					piVisualPrint, // 인쇄시 워터마크 적용(적용1, 미적용 0)
					piImageSafer, // 캡쳐방지 적용(적용1, 미적용 0)
					piRealTimeAcl, // 사용하지 않음
					pstrDocumentTitle, // 문서 제목
					pstrCompanyName, // 회사명
					pstrGroupName, // 그룹명
					pstrPositionName, // 직위명
					pstrUserName, // 사용자 이름
					pstrUserIp, // 사용자 PC IP
					pstrServerOrigin, // 시스템명
					piExchangePolicy, // 암호화 문서 정책 ( 고정값 1 )
					piDrmFlag, // 암호화 여부( 고정값 0 )
					iBlockSize, // 블럭크기 ( 고정값 0 )
					strMachineKey, // 머신키
					strFileVersion, // 암호화 파일 버전
					strMultiUserID, // 다중 사용자 ID
					strMultiUserName, // 다중 사용명
					strEnterpriseID, // 회사 대표 ID
					strEnterpriseName, // 회사 대표명
					strDeptID, // 부서코드 ID
					strDeptName, // 부서명
					strPositionLevel, // 직위레벨
					strSecurityLevel, // 보안레벨
					strSecurityLevelName, // 보안레벨명
					strPgCode, // 사용하지 않음
					strCipherBlockSize, // 사이퍼블럭크기 ( 고정값 16 )
					strCreatorID, // 생성자 ID
					strCreatorName, // 생성자 이름
					strOnlineContorl, // 고정값 0
					strOfflinePolicy, // 고정값
					strValidPeriodType, // 고정값
					strUsableAlways, // 고정값 0
					strPriPubKey, // 고정값
					strCreatorCompanyId, // 생성자 회사코드 ID
					strCreatorDeptId, // 생성자 부서코드 ID
					strCreatorGroupId, // 생성자 그룹코드 ID
					strCreatorPositionId, // 생성자 직위코드 ID
					strFileSize, // 원본파일크기
					strHeaderUpdateTime, // 헤더업데이트시간
					strReserved01, // 지정 필드1
					strReserved02, // 지정 필드2
					strReserved03, // 지정 필드3
					strReserved04, // 지정 필드4
					strReserved05, // 지정 필드5
					in);

		} catch (Exception e) {
			log.info("lGetEncryptFileSize 암호화 메소드 Exception Error. Exception = [" + e.toString() + "]");
			log.info("NumberFormat, NullPointer Exception일 경우 MarkAnyDrmInfo.dat 파일의 경로와 권한을 확인 해 주세요.");
			return "Err";
		}
		// 암호화 준비를 합니다.
		if (outFileLength > 0) {
			// 암호화 합니다.
			strRetCode = clMadn.strMadn(out);
		} else // 암호화 시작전 에러가 발생했습니다.
		{
			log.info("암호화 시작 전에 실패 하였습니다.");
			strRetCode = clMadn.strGetErrorCode();
			log.info("[ErrorCode] = [" + strRetCode + "]" + "[ErrorDescription] = ["
					+ clMadn.strGetErrorMessage(strRetCode) + "]");
			return "ERR";

		}

		if ("00000".equals(strRetCode)) {
			// 암호화를 성공
			log.info("암호화에 성공 하였습니다");
			log.info("RetCode = [" + strRetCode + "]");
			return outPutFileName;
		} else {
			// 암호화에 실패했습니다.
			log.info("암호화에 실패 하였습니다.");
			log.info("[ErrorCode] = [" + strRetCode + "]" + "[ErrorDescription] = ["
					+ clMadn.strGetErrorMessage(strRetCode) + "]");
			return "false";
		}

	}
}