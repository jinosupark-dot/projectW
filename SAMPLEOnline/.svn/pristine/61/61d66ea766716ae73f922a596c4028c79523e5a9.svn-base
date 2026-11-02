package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.Reader;

import lombok.extern.slf4j.Slf4j;

@Slf4j 
public class StreamUtil {
	
	/**
	 *  스트림을 읽어 들인 후 string으로 반환한다.
	 */
	public static String getString( InputStream in ) {
		try {
			if(in == null) {
				throw new Exception("InputStream is null!");
			}
			if ( !( in instanceof BufferedInputStream ) ) {
				if( log.isDebugEnabled() ) log.debug( "[StreamUtil.getString] Current InputStream is not BufferedInputStream. Convert BufferedInputStream." );
				in = new BufferedInputStream( in );
			}

			ByteBuffer bb = new ByteBuffer();
			int size = 1024;
			if(size < 0) size = 1024;
			byte[] buf = new byte[size];
			int readSize = 0;
			int totalRead = 0;

			while ( true ) {
				if(buf == null || totalRead < 0 || size - totalRead < 0) break;
				readSize = in.read( buf, totalRead, size - totalRead );
				if ( readSize == -1 ) {
					if ( totalRead > 0 ) {
						bb.append( buf, totalRead );
					}
					break;
				}
				totalRead += readSize;
				if ( totalRead == size ) {
					bb.append( buf, totalRead );
					totalRead = 0;
				}
			}
			return bb.toString();
		} catch ( Exception e ) {
			log.error("Exception Occurs.", e);
			return "";
		} catch (Throwable t) {
			log.error("Throwable Occurs.", t);
			return "";
		}
	}

	/**
	 *  스트림을 읽어 들여 String으로 반환한다.
	 *
	 *@param  in       Description of Parameter
	 *@param  charset  Description of Parameter
	 *@return          The String value
	 */
	public static String getString( InputStream in, String charset ) {
		try {
			if(in == null) {
				throw new Exception("InputStream is null!");
			}
			if(charset == null) {
				throw new Exception("charset is null!");
			}
			if ( !( in instanceof BufferedInputStream ) ) {
				if( log.isDebugEnabled() ) log.debug( "[StreamUtil.getString] Current InputStream is not BufferedInputStream. Convert BufferedInputStream." );
				in = new BufferedInputStream( in );
			}

			ByteBuffer bb = new ByteBuffer();
			int size = 1024;
			if(size < 0) size = 1024;
			byte[] buf = new byte[size];
			int readSize = 0;
			int totalRead = 0;

			while ( true ) {
				if(buf == null || totalRead < 0 || size - totalRead < 0) break;
				readSize = in.read( buf, totalRead, size - totalRead );
				if ( readSize == -1 ) {
					if ( totalRead > 0 ) {
						bb.append( buf, totalRead );
					}
					break;
				}
				totalRead += readSize;
				if ( totalRead == size ) {
					bb.append( buf, totalRead );
					totalRead = 0;
				}
			}
			return bb.toString( charset );
		} catch ( Exception e ) {
			log.error("Exception Occurs.", e);
			return "";
		} catch (Throwable t) {
			log.error("Throwable Occurs.", t);
			return "";
		}
	}

	/**
	 *  스트림을 읽어 들인 후 string으로 반환한다.
	 *
	 *@param  in  Description of Parameter
	 *@return     The String value
	 */
	public static String getString( Reader in ) {
		try {
			if(in == null) {
				throw new Exception("Reader is null!");
			}
			if ( !( in instanceof BufferedReader ) ) {
				if( log.isDebugEnabled() ) log.debug( "[StreamUtil.getString] Current Reader is not BufferedReader. Convert BufferedReader." );
				in = new BufferedReader( in );
			}

			StringBuffer bb = new StringBuffer();
			int size = 1024;

			char[] buf = new char[size];
			int readSize = 0;
			int totalRead = 0;

			while ( true ) {
				if(buf == null || totalRead < 0 || size - totalRead < 0) break;
				readSize = in.read( buf, totalRead, size - totalRead );
				if ( readSize == -1 ) {
					if ( totalRead > 0 ) {
						bb.append( buf, 0, totalRead );
					}
					break;
				}
				totalRead += readSize;
				if ( totalRead == size ) {
					bb.append( buf );
					totalRead = 0;
				}
			}
			return bb.toString();
		} catch ( Exception e ) {
			log.error("Exception Occurs.", e);
			return "";
		} catch (Throwable t) {
			log.error("Throwable Occurs.", t);
			return "";
		}
	}

	/**
	 *  스트림을 읽어 들여 byte[]로 반환한다.
	 *
	 *@param  in  Description of Parameter
	 *@return     The Bytes value
	 */
	public static byte[] getBytes( InputStream in ) {
		try {
			if(in == null) {
				throw new Exception("InputStream is null!");
			}
			if ( !( in instanceof BufferedInputStream ) ) {
				if( log.isDebugEnabled() ) log.debug( "[StreamUtil.getBytes] Current InputStream is not BufferedInputStream. Convert BufferedInputStream." );
				in = new BufferedInputStream( in );
			}

			ByteBuffer bb = new ByteBuffer();
			int size = 1024;
			if(size < 0) size = 1024;
			byte[] buf = new byte[size];
			int readSize = 0;
			int totalRead = 0;

			while ( true ) {
				if(buf == null || totalRead < 0 || size - totalRead < 0) break;
				readSize = in.read( buf, totalRead, size - totalRead );
				if ( readSize == -1 ) {
					if ( totalRead > 0 ) {
						bb.append( buf, totalRead );
					}
					break;
				}
				totalRead += readSize;
				if ( totalRead == size ) {
					bb.append( buf, totalRead );
					totalRead = 0;
				}
			}
			return bb.getBytes();
		} catch ( Exception e ) {
			log.error("Exception Occurs.", e);
			return null;
		} catch (Throwable t) {
			log.error("Throwable Occurs.", t);
			return null;
		}
	}
}

