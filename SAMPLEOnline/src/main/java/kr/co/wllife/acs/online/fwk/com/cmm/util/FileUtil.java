package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Enumeration;
import java.util.Stack;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

import org.apache.commons.codec.binary.Base64;

import kr.co.wllife.acs.online.fwk.com.cmm.FwkWebUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * File Name   : FileUtil.java
 * Description : File 관련 Method들을 모아둔 Class
 * Author      : ksyoon
 * Date        : 2019. 5. 17.
 */

@Slf4j 
public class FileUtil {

	/**
	 * 파일인지 여부
	 * 
	 * @param sFileName
	 * @return
	 */
	public static boolean isFile(String sFileName) {
        if ( sFileName.indexOf("..") > -1) {
        	log.warn("[FileUtil.isFile] sFileName is can't include charactor '..'");
            return false;
        }
		File fd = new File(sFileName);
		return fd.exists();
	}

	/**
	 * 이미지파일인지 여부
	 * 
	 * @param sFileName
	 * @return
	 */
	public static boolean isImageFile(String sFileName) {
		boolean bRetVal = false;
		String sExt = "";

		if (sFileName == null || sFileName.length() == 0)
			return bRetVal;
		if (sFileName.lastIndexOf('.') < 0)
			return bRetVal;

		sExt = sFileName.substring(sFileName.lastIndexOf('.') + 1);

		if (sExt.equalsIgnoreCase("gif") || sExt.equalsIgnoreCase("jpg"))
			bRetVal = true;

		return bRetVal;
	}
	
	/**
	 * 이미지 파일을 base64로 변환한다.
	 * @param imagFile
	 * @return
	 */
	public static String isImageBase64String(File imagFile){
		
		String base64 = null;
		
		if( isFile(imagFile.getAbsolutePath() ) ){
			
			String fileName = imagFile.getName();
			String fileExtName = fileName.substring( fileName.lastIndexOf(".") + 1 );
			
			FileInputStream inputStream = null;
			ByteArrayOutputStream byteOutputStream = null;
			
			try{
				
				inputStream = new FileInputStream(imagFile);
				byteOutputStream = new ByteArrayOutputStream();
				
				int len = 0;
				byte[] buf = new byte[1024];
				while ( (len = inputStream.read(buf)) != -1 ){
					byteOutputStream.write(buf, 0, len);
				}
				
				byte[] fileArray = byteOutputStream.toByteArray();
				base64 = "data:image/" + fileExtName + ";base64," + new String( Base64.encodeBase64(fileArray) );
				
				
			} catch ( IOException e) {
				log.error(e.toString());
				return null;
			} catch (Exception e) {
				log.error(e.toString());
				return null;
			} finally {
				if (inputStream != null)
					try {
						inputStream.close();
					} catch (IOException e) {
						log.error(e.toString());
					}
				if (byteOutputStream != null)
					try {
						byteOutputStream.close();
					} catch (IOException e) {
						log.error(e.toString());
					}
			}
			
		}
		
		return base64;
	}

	/**
	 * 파일을 byte[] 형태로 변환
	 * 
	 * @param file
	 *            바꿀 대상 @return byte[] 바뀐 byte[] @exception
	 */

	public static byte[] getByteArray(File file) {

		FileInputStream fin = null;

		try {
			fin = new FileInputStream(file);

			byte[] fileByte = new byte[fin.available()];
			byte[] buf = new byte[1024];
			int nRead = 0;
			int nWrote = 0;

			while ((nRead = fin.read(buf, 0, 1024)) >= 0) {
				for (int i = 0; i < nRead; i++) {
					fileByte[i + nWrote] = buf[i];
				}
				nWrote += nRead;
			}

			return fileByte;
		} catch (Exception e) {
			log.error(e.toString());
			return null;
		} finally {
			if (fin != null)
				try {
					fin.close();
				} catch (IOException e) {
					log.error(e.toString());
				}
		}
	}

	/**
	 * 문자열내 패턴으로 변경
	 * 
	 * @param source
	 *            기존 문자열 @param patten 바꾸고자하는 패턴 @param replace 바꿔지는 문자열 @return
	 *            String 바꾼후의 문자열 @exception
	 */

	public static boolean saveFile(String path, String fileName, byte[] content) throws Exception {
		String separator = System.getProperties().getProperty("file.separator");
		if(separator == null) {
			separator = File.separator;
		}

		if (separator != null && path.trim().lastIndexOf(separator) != path.trim().length() - 1)
			path += separator;
		log.debug("FileUtil.saveFile() / Path Check : " + path);

        if ( path.indexOf("..") > -1) {
        	log.warn("[FileUtil.saveFile] path is can't include charactor '..'");
            return false;
        }
		File file = new File(path);
		if (!file.exists()) {
			log.debug("FileUtil.saveFile() / Creat Path : " + path);
			file.mkdirs();
		}
		return saveFile(path + fileName, content);
	}

	/**
	 * 파일저장
	 * 
	 * @param fileName
	 * @param content
	 * @return
	 * @throws Exception
	 */
	public static boolean saveFile(String fileName, byte[] content) throws Exception {
		FileOutputStream fout = null;
		boolean rValue = false;

		long startTime = System.currentTimeMillis();

		try {
        	if ( fileName.indexOf("..") > -1) {
        		log.warn("[FileUtil.saveFile] fileName is can't include charactor '..'");
            	return false;
        	}		
			fout = new FileOutputStream(fileName);
			fout.write(content);
			fout.flush();
			log.debug("FileUtil.saveFile() / " + fileName + " 저장");
			rValue = true;
		} catch (Exception e) {
			log.debug("FileUtil.saveFile() / err :" + e.toString());
			rValue = false;
		} finally {
			if (fout != null)
				try {
					fout.close();
				} catch (Exception e) {
					log.error("Exception occurs!", e);
				}
		}

		log.debug("FileUtil.saveFile() / " + fileName + " 저장 시간 : " + (System.currentTimeMillis() - startTime));

		return rValue;
	}

	/**
	 * 파일읽기
	 * 
	 * @param file
	 * @return
	 */
	public static String readFile(String file) {
		FileReader fr = null;
		BufferedReader br = null;

		StringBuffer tmp = new StringBuffer();
		try {
			fr = new FileReader(file);
			br = new BufferedReader(fr);
			for (String readLine; (readLine = br.readLine()) != null;)
				tmp.append(readLine + "\n");
			return tmp.toString();

		} catch (Exception e) {
			return tmp.toString();
			// return e.toString();
		} finally {
			if (br != null)
				try {
					br.close();
				} catch (Exception e) {
					log.error("Exception occurs!", e);
				}
			if (fr != null)
				try {
					fr.close();
				} catch (Exception e) {
					log.error("Exception occurs!", e);
				}
		}
	}

	/**
	 * 파일 copy
	 * 
	 * @param targetPath
	 * @param source
	 * @param target
	 * @return
	 * @throws Exception
	 */
	public static boolean copy(String targetPath, String source, String target) throws Exception {
		String separator = File.separator;

		if (targetPath.trim().lastIndexOf(separator) != targetPath.trim().length() - 1)
			targetPath += separator;
		log.debug("FileUtil.copyFile() / Path Check : " + targetPath);

        if ( targetPath.indexOf("..") > -1) {
        	log.warn("[FileUtil.copy] targetPath is can't include charactor '..'");
            return false;
        }
		File file = new File(targetPath);
        
		if (!file.exists()) {
			log.debug("FileUtil.copyFile() / Creat Path : " + targetPath);
			file.mkdirs();
		}
		return copy(source, target);
	}

	/**
	 * 파일 copy
	 * 
	 * @param source
	 * @param target
	 * @return
	 */
	public static boolean copy(String source, String target) {
		FileInputStream fis = null;
		OutputStream os = null;
		try {
			int c;
			fis = new FileInputStream(FwkWebUtil.getValidPath(source));
			os = new FileOutputStream(FwkWebUtil.getValidPath(target));
			while ((c = fis.read()) != -1) {
				os.write(c);
			}

			return true;
		} catch (Exception e) {
			return false;
		} finally {
			if(fis != null) {
				safeClose(fis);
			}
			if(os != null) {
				safeClose(os);
			}
		}
	}

	/**
	 * unzip 파일
	 * 
	 * @param srcFile
	 * @return
	 */
	public static File unzip(File srcFile) {
		String srcFilePath = null;
		String strDir = null;
		File tarDir = null;
		ZipFile zip = null;
		FileOutputStream fos = null;
		BufferedInputStream bis = null;
		if (srcFile == null || !srcFile.exists())
			return null;
		try {
			srcFilePath = srcFile.getAbsolutePath();
			// strDir = srcFilePath.substring(0, srcFilePath.lastIndexOf(".")) +
			// "_" + PODODate.getDate( new
			// Timestamp(System.currentTimeMillis()), PODODate.FULLTIME );
			strDir = srcFilePath.substring(0, srcFilePath.lastIndexOf("."));

			tarDir = new File(strDir);
			if (!tarDir.exists())
				tarDir.mkdirs();

			zip = new ZipFile(srcFile);
			for (Enumeration e = zip.entries(); e.hasMoreElements();) {
				ZipEntry ze = (ZipEntry) e.nextElement();
				if (ze == null) {
					log.debug("FileUtil.unzip() / Zip Entry is null ");
					continue;
				}
				if (ze.isDirectory()) {
					log.debug("FileUtil.unzip() / Zip Entry is Directory ");
					continue;
				} else {
					// String strFileName = strDir + File.separator +
					// ze.getName().substring(ze.getName().lastIndexOf(File.separator)+1,
					// ze.getName().length());
					// 2004-08-24
					// kdw
					// 확장자 소문자로 바꿈.
					String strFileName = strDir + File.separator
							+ ze.getName()
									.substring(ze.getName().lastIndexOf(File.separator) + 1, ze.getName().length())
									.toLowerCase();
					
			        if ( strFileName.indexOf("..") > -1) {
			        	log.warn("[FileUtil.zip] strFileName is can't include charactor '..'");
			            return null;
			        }
			        
			        //validation zip Entry overwrite
			        validateFilenameInDir(strFileName, strDir);
					
			        try {
						bis = new BufferedInputStream(zip.getInputStream(ze));
						if(bis != null && bis.available() > 0) {
							fos = new FileOutputStream(FwkWebUtil.getValidPath(strFileName));
						}
						int sz = (int) ze.getSize();
						final int N = 1024;
						byte buf[] = new byte[N];
						int ln = 0;
						if(fos != null) {
							while ((sz > 0) && ((ln = bis.read(buf, 0, Math.min(N, sz))) != -1)) {
								fos.write(buf, 0, ln);
								sz -= ln;
							}
						}
			        } finally {
			        	if(bis != null) {
			        		safeClose(bis);
			        	}
			        	if(fos != null) {
			        		fos.flush();
			        		safeClose(fos);
			        	}
						log.debug("FileUtil.unzip() / unzip entry : " + strFileName);
			        }
				}
			}
			return tarDir;
		} catch (Exception e) {
			log.error("FileUtil.unzip() / err : " + e.toString());
			return null;
		} finally {
			if(zip != null) {
				safeClose(zip);
			}
		}

	}

	/**
	 * 파일갯수
	 * 
	 * @param dir
	 * @param ext
	 * @return
	 */
	public static int getFileCnt(File dir, String ext) {

		if (dir == null)
			return 0;
		if (dir.isFile()) {
			log.debug("FileUtil.java - getFileCnt() / err : " + dir.getName() + " is not a directory.");
			return 0;
		}

		File[] fileList = dir.listFiles(new FileExtFilter(ext));

		if (fileList == null || fileList.length == 0) {
			log.debug("FileUtil.java - getFileCnt() / err : " + dir.getName() + " has no file");
			return 0;
		}

		return fileList.length;
	}

	/**
	 * 파일삭제
	 * 
	 * @param dir
	 * @return
	 */
	public static boolean deleteFile(File dir) {
		boolean bSuccess = false;
		if (dir == null)
			return bSuccess;
		if (!dir.exists())
			return bSuccess;
		if (dir.isFile()) {
			bSuccess = dir.delete();
		} else {
			File[] fileList = dir.listFiles();
			if(fileList != null) {
				for (int i = 0; i < fileList.length; i++) {
					bSuccess = deleteFile(fileList[i]);
				}
			}
			bSuccess = dir.delete();
		}
		return bSuccess;
	}

	/**
	 * 디렉토리삭제
	 * 
	 * @param path
	 */
	public static void deleteDir(String path) {
		deleteDir(new File(path));
	}

	/**
	 * 디렉토리삭제
	 * 
	 * @param file
	 */
	public static void deleteDir(File f) {
		boolean bSuccess = false;
		if (!f.exists()) {
			return;
		}

		File[] list = f.listFiles();
		if( list != null ) {
			for (int i = 0; i < list.length; i++) {
				if (list[i].isDirectory()) {
					deleteDir(list[i]);
				} else {
					if(list[i].exists()) bSuccess = list[i].delete();
					// logger(
					// "FileUtil.deleteDir() / fileName["+files[i].getName()+"]
					// 삭제["+bSuccess+"]"
					// );
				}
			}
		}
		if(f.exists()) f.delete();
	}

	/**
	 * 파일삭제
	 * 
	 * @param path
	 * @return
	 */
	public static int deleteFile(String path) {
		int returnValue = 2; // 0:실패, 1:성공, 2:파일 없음.

		File file = new File(path);
		if (file.exists()) {
			if (file.delete()) {
				returnValue = 1;
			} else {
				returnValue = 0;
			}
		}

		return returnValue;
	}

	/**
	 * 폴더생성
	 * 
	 * @param path
	 */

	public static void makefolder(String path) {
		File folder = new File(path);
		if (!folder.exists()) {
			folder.mkdirs();
		}
	}

	/**
	 * compresses the given src file(or directory) and create the compressed
	 * file under the given destDir.
	 * 
	 * @param src
	 * @param destDir
	 * @param charSetName
	 * @param includeSrc
	 * @throws IOException
	 */
	public static File zip(File src, File destDir, String charSetName, boolean includeSrc) throws IOException {
		String fileName = src.getName();
		if (!src.isDirectory()) {
			int pos = fileName.lastIndexOf(".");
			if (pos > 0) {
				fileName = fileName.substring(0, pos);
			}
		}
		fileName += ".zip";

		String tempDir = FwkProperties.getProperty("requestImagesPath").toString();
		tempDir += File.separator + "tempZip" + File.separator;

        if ( tempDir.indexOf("..") > -1) {
        	log.warn("[FileUtil.zip] tempDir is can't include charactor '..'");
            return null;
        }
        
		File tempZipDir = new File(tempDir);
		
		if (!tempZipDir.exists())
			tempZipDir.mkdirs();

        if ( fileName.indexOf("..") > -1) {
        	log.warn("[FileUtil.zip] fileName is can't include charactor '..'");
            return null;
        }
        
		File zippedFile = new File(tempDir, fileName);
		if (!zippedFile.exists()) {
			zippedFile.createNewFile();
		}
		
		FileOutputStream fos = null;
		boolean result = false;
		try {
			fos = new FileOutputStream(zippedFile);
			result = zip(src, fos, charSetName, includeSrc);
			if (result) {
				Path file = Paths.get(tempDir + File.separator + fileName);
				Path movePath = Paths.get(destDir.getPath());

				Files.move(file, movePath.resolve(file.getFileName()));
			}

			return new File(destDir.getPath() + File.separator + fileName);
		} catch(IOException ie) {
			log.error("[FileUtil.zip]IOException occurs!", ie);
			throw ie;
		} finally {
			if(fos != null) {
				safeClose(fos);
			}
		}
	}

	public static boolean zip(File src, OutputStream os, String charsetName, boolean includeSrc) {

		ZipOutputStream zos = new ZipOutputStream(os);
		FileInputStream fis = null;
		int length;
		ZipEntry ze;
		byte[] buf = new byte[8 * 1024];
		String name;

		try {

			Stack<File> stack = new Stack<File>();
			File root;
			if (src.isDirectory()) {
				if (includeSrc) {
					stack.push(src);
					root = src.getParentFile();
				} else {
					File[] fs = src.listFiles();
					if(fs != null) {
						for (int i = 0; i < fs.length; i++) {
							stack.push(fs[i]);
						}
					}
					root = src;
				}
			} else {
				stack.push(src);
				root = src.getParentFile();
			}

			while (!stack.isEmpty()) {
				File f = stack.pop();
				if(root != null) {
					name = toPath(root, f);
				} else {
					log.warn("root is null!!");
					name = "";
				}
				if (f.isDirectory()) {

					File[] fs = f.listFiles();
					if(fs != null) {
						for (int i = 0; i < fs.length; i++) {
							if (fs[i].isDirectory())
								stack.push(fs[i]);
							else
								stack.add(0, fs[i]);
						}
					}
				} else {

					ze = new ZipEntry(name);
					zos.putNextEntry(ze);
					try {
						fis = new FileInputStream(f);
						while ((length = fis.read(buf, 0, buf.length)) >= 0) {
							zos.write(buf, 0, length);
						}
						
					} finally {
						if(fis != null) {
							safeClose(fis);
						}
						if(fis != null) {
							zos.closeEntry();
						}
					}
				}
			}
		} catch (Exception e) {
			return false;
		} finally {
			if(zos != null) {
				safeClose(zos);
			}
		}

		return true;
	}

	private static String toPath(File root, File dir) {

		String path = dir.getAbsolutePath();
		path = path.substring(root.getAbsolutePath().length()).replace(File.separatorChar, '/');
		if (path.startsWith("/"))
			path = path.substring(1);
		if (dir.isDirectory() && !path.endsWith("/"))
			path += "/";
		return path;
	}
	
	public static void safeClose(ZipFile zf) {
		if(zf != null) {
			try {
				zf.close();
			} catch(IOException e) {
				log.error("[FileUtil.safeClose]exception occurs!", e);
			}
		} else {
			return;
		}
	}

	public static void safeClose(BufferedInputStream bis) {
		if(bis != null) {
			try {
				bis.close();
			} catch(IOException e) {
				log.error("[FileUtil.safeClose]exception occurs!", e);
			}
		} else {
			return;
		}
	}
	
	public static void safeClose(FileInputStream fis) {
		if(fis != null) {
			try {
				fis.close();
			} catch(IOException e) {
				log.error("[FileUtil.safeClose]exception occurs!", e);
			}
		} else {
			return;
		}
	}

	public static void safeClose(InputStream is) {
		if(is != null) {
			try {
				is.close();
			} catch(IOException e) {
				log.error("[FileUtil.safeClose]exception occurs!", e);
			}
		} else {
			return;
		}
	}
	
	public static void safeClose(OutputStream os) {
		if(os != null) {
			try {
				os.close();
			} catch(IOException e) {
				log.error("[FileUtil.safeClose]exception occurs!", e);
			}
		} else {
			return;
		}
	}
	
	public static void validateFilenameInDir(String filename, String intendedDirectory) throws IOException {
		filename = FwkWebUtil.filePathBlackList(filename);
		intendedDirectory = FwkWebUtil.filePathBlackList(filename);
		File checkFile = new File(filename);
		String canonicalPathToCheck = checkFile.getCanonicalPath();
		File intendedDir = new File(intendedDirectory);
		String canonicalPathToVerify = intendedDir.getCanonicalPath();
		if(canonicalPathToCheck.startsWith(canonicalPathToVerify)) {
			return;
		} else {
			throw new IllegalStateException("This file is outside the intended eextraction directory.");
		}
	}
}

class FileExtFilter implements java.io.FileFilter {

	private String pattern;

	public FileExtFilter(String pattern) {
		this.pattern = pattern;
	}

	// Returns true if filename matches one of the patterns.
	public boolean accept(File file) {

		if (file.isDirectory()) {
			return false;
		}

		String s = file.getName();

		if (pattern == null || pattern.length() == 0) {
			return true;
		} else if (s.indexOf(".") == -1) {
			return false;
		} else {
			if (s.substring(s.lastIndexOf(".") + 1).equals(pattern)) {
				return true;
			}
		}
		return false;
	}
}
