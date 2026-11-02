package kr.co.wllife.acs.online.fwk.com.cmm.util;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * @시스템명: ifrs17Batch
 * @업무명: 공통 
 * @설명: AES256 암/복호화를 처리한다. 
 *       openssl command와의 상호 호환성을 제공한다.
 *       ex)echo 'test'| openssl enc -base64 -aes-256-cbc -md sha256 -k pass -pbkdf2
 *       ex)echo 'U2FsdGVkX1+HU7WvIFW7YuvtWHkyOCfLA91F3I4PHIc='| openssl aes-256-cbc -a -d -k pass -pbkdf2
 * @최초작성자: 장창환
 * @최초작성일: 2021. 2. 16.
 * @최종변경일: 
 * @개정이력: 
 *  89001203 2021. 2. 16. 최초작성
 */
public class AES256Util {
	
	private static final Logger logger = LoggerFactory.getLogger(AES256Util.class);

	private static final byte[] SALTED_MAGIC = "Salted__".getBytes();
	private final String pbeAlgorithm;
	private final String digestAlgorithm;
	private final int keyLengthInByte;
	//private String encryptionPassword = "";			//openssl command의 암호화된 key의 password로 사용됨. command의 keypassword의 입력 없이 암호화 및 복호화 수행시 해당 값이 비어야 함.
	private int keyObtentionIterations = 10000; // 10000 is openssl's default
	
	/**
	 * "AES/CBC/PKCS5Padding", "SHA-256"을 이용한 256bit 암복호화 객체 생성
	 * @throws NoSuchPaddingException 
	 * @throws NoSuchAlgorithmException 
	 */
	public AES256Util() throws NoSuchAlgorithmException, NoSuchPaddingException {
		this("AES/CBC/PKCS5Padding", "SHA-256", 256);
	}
	
	/**
	 * 
	 * @param pbeAlgorithm - "AES/CBC/PKCS5Padding", "AES/ECB/PKCS5Padding"
	 * @param digestAlgorithm - "SHA-256", "MD5"
	 * @param keyLengthInBit - 128, 256
	 * @throws NoSuchPaddingException 
	 * @throws NoSuchAlgorithmException 
	 */
	public AES256Util(String pbeAlgorithm, String digestAlgorithm, int keyLengthInBit) throws NoSuchAlgorithmException, NoSuchPaddingException {
		super();
		this.pbeAlgorithm = pbeAlgorithm;
		this.digestAlgorithm = digestAlgorithm;
		this.keyLengthInByte = keyLengthInBit / 8;	
	}

//	public String getEncryptionPassowrd() {
//		return encryptionPassword;
//	}

//	public void setEncryptionPassowrd(String encryptionPassowrd) {
//		this.encryptionPassword = encryptionPassowrd;
//	}

	
	public int getKeyObtentionIterations() {
		return keyObtentionIterations;
	}

	public void setKeyObtentionIterations(int keyObtentionIterations) {
		this.keyObtentionIterations = keyObtentionIterations;
	}

	private String encryptStringWithPBKDF2(String clearText, String password, int hashIterations) 
			throws InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeySpecException {   
	    return this.encryptString(clearText, password, true, hashIterations);
	}
	
	private String encryptString(String clearText, String password, boolean pbkdf2, int hashIterations) 
			throws InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeySpecException {
		final byte[] salt = (new SecureRandom()).generateSeed(8);
	    final byte[] inBytes = clearText.getBytes(StandardCharsets.UTF_8);
	    	    
	    byte[] keyAndIv = new byte[0];
	    if(pbkdf2) {
	    	keyAndIv = deriveKeyAndIvWithPBKDF2(password, hashIterations, salt);
	    }else {
	    	keyAndIv = deriveKeyAndIv(password.getBytes(StandardCharsets.ISO_8859_1), salt);
	    }
	    
	    // AES-256: 32 bytes key, 16 bytes iv
	    // AES-128: 16 bytes key, 16 bytes iv
	    final byte[] keyValue = Arrays.copyOfRange(keyAndIv, 0, this.keyLengthInByte);    	    
	    final SecretKeySpec key = new SecretKeySpec(keyValue, "AES");

		Cipher cipher = Cipher.getInstance(this.pbeAlgorithm);
	    if(this.pbeAlgorithm.contains("ECB")) {
	    	cipher.init(Cipher.ENCRYPT_MODE, key);
	    }else {
	    	// CBC
	    	final byte[] iv = Arrays.copyOfRange(keyAndIv, this.keyLengthInByte, (this.keyLengthInByte + 16));
	    	cipher.init(Cipher.ENCRYPT_MODE, key, new IvParameterSpec(iv));
	    }
	    
	    byte[] data = cipher.doFinal(inBytes);
	    data =  array_concat(array_concat(SALTED_MAGIC, salt), data);
	    return Base64.getEncoder().encodeToString( data );
	}
	
	public String encryptStringWithPBKDF2(String clearText) 
			throws InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeySpecException {
		return this.encryptStringWithPBKDF2(clearText, "", keyObtentionIterations);
	}
	
	public String encryptStringWithPBKDF2(String clearText, String password) 
			throws InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeySpecException {
		return this.encryptStringWithPBKDF2(clearText, password, keyObtentionIterations);
	}
	
	private String decryptWithPBKDF2(String encryptedBase64, String password, int hashIterations) 
			throws IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException {
	    
	    return this.decrypt(encryptedBase64, password, true, hashIterations);
	}
	
	private String decrypt(String encryptedBase64, String password, boolean pbkdf2, int hashIterations) 
			throws IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException {
	    
		final byte[] inBytes = Base64.getDecoder().decode(encryptedBase64);
	    final byte[] shouldBeMagic = Arrays.copyOfRange(inBytes, 0, SALTED_MAGIC.length);
	    if (!Arrays.equals(shouldBeMagic, SALTED_MAGIC)) {
	        throw new IllegalArgumentException("Bad magic number. Initial bytes from input do not match OpenSSL SALTED_MAGIC salt value.");
	    }

	    final byte[] salt = Arrays.copyOfRange(inBytes, SALTED_MAGIC.length, SALTED_MAGIC.length + 8);
	    
	    byte[] keyAndIv = new byte[0];
	    if(pbkdf2) {
	    	keyAndIv = deriveKeyAndIvWithPBKDF2(password, hashIterations, salt);
	    }else {
	    	keyAndIv = deriveKeyAndIv(password.getBytes(StandardCharsets.UTF_8), salt);
	    }	    

	    final byte[] keyValue = Arrays.copyOfRange(keyAndIv, 0, this.keyLengthInByte);
	    final SecretKeySpec key = new SecretKeySpec(keyValue, "AES");


		Cipher cipher = Cipher.getInstance(this.pbeAlgorithm);
	    if(this.pbeAlgorithm.contains("ECB")) {
	    	cipher.init(Cipher.DECRYPT_MODE, key);
	    }else {
	    	// CBC
	    	final byte[] iv = Arrays.copyOfRange(keyAndIv, this.keyLengthInByte, (this.keyLengthInByte + 16));
	    	cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(iv));
	    }
	    
	    final byte[] clear = cipher.doFinal(inBytes, 16, inBytes.length - 16);
	    String decryptStr = new String(clear, StandardCharsets.UTF_8);
	    decryptStr  = decryptStr.replaceAll("\\n", "");
	    return decryptStr;
	}
	
	public String decryptWithPBKDF2(String encryptedBase64) 
			throws IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException {
		return this.decryptWithPBKDF2(encryptedBase64, "", this.keyObtentionIterations);
	}
	
	public String decryptWithPBKDF2(String encryptedBase64, String password) 
			throws IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException {
		return this.decryptWithPBKDF2(encryptedBase64, password, this.keyObtentionIterations);
	}
	
	private byte[] deriveKeyAndIv(final byte[] pass, final byte[] salt) throws NoSuchAlgorithmException {
		MessageDigest md = MessageDigest.getInstance(this.digestAlgorithm);
	    final byte[] passAndSalt = array_concat(pass, salt);
	    byte[] hash = new byte[0];
	    byte[] keyAndIv = new byte[0];
	    for (int i = 0; i < 3 && keyAndIv.length < 48; i++) {
	        final byte[] hashData = array_concat(hash, passAndSalt);
	        hash = md.digest(hashData);
	        keyAndIv = array_concat(keyAndIv, hash);
	    }
		return keyAndIv;
	}

	private byte[] deriveKeyAndIvWithPBKDF2(String password, int hashIterations, final byte[] salt)
			throws NoSuchAlgorithmException, InvalidKeySpecException {
		SecretKeyFactory keyFactory = null;
	    if("SHA-256".equals(this.digestAlgorithm)) {
	    	keyFactory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
	    } else {
	    	// MD5
	    	// Reference: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/04-Testing_for_Weak_Encryption.html
	    	// "In addition, MD5 hash function is forbidden to be used with PBKDF2 such as PBKDF2WithHmacMD5."
	    	throw new UnsupportedOperationException("MD5 hash function is not supported with PBKDF2");
	    }
	    
	    PBEKeySpec keySpec = new PBEKeySpec(password.toCharArray(), salt, hashIterations, 48 * 8);
	    byte[] keyAndIv = keyFactory.generateSecret(keySpec).getEncoded();
		return keyAndIv;
	}
	
	private byte[] array_concat(final byte[] a, final byte[] b) {
		final byte[] c = new byte[a.length + b.length];
		System.arraycopy(a, 0, c, 0, a.length);
		System.arraycopy(b, 0, c, a.length, b.length);
		return c;
	}
	
	/**
	public static void main(String[] args) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, InvalidKeySpecException {
		String encrypted = "";
		
		//echo 'test'| openssl enc -base64 -aes-256-cbc -md sha256 -k pass -pbkdf2
		//echo 'U2FsdGVkX1+HU7WvIFW7YuvtWHkyOCfLA91F3I4PHIc='| openssl aes-256-cbc -a -d -k pass -pbkdf2
		AES256Util aes256Cbc = new AES256Util();
		encrypted = aes256Cbc.encryptStringWithPBKDF2("Abllife-1!", "937dcb68f7308eecdb702ef15faa0273");
		System.out.println("Encrypted aes-256-cbc sha256 pbkdf2: " + encrypted + ", Decrypted: " + aes256Cbc.decryptWithPBKDF2("U2FsdGVkX1/ERfgPeW1gQiVk/mDT0k1wScK0u3jXeu4=", "937dcb68f7308eecdb702ef15faa0273")  + "::");
		
	}
	*/
}

