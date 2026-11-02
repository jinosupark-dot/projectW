package kr.co.wllife.acs.online.fwk.com.cmm.util;

import java.util.Enumeration;
import java.util.concurrent.ConcurrentHashMap;
 
import jakarta.servlet.http.HttpSession;
 
public class FwkMultiLoginPreventor {
    public static ConcurrentHashMap<String, HttpSession> loginUsers = new ConcurrentHashMap<String, HttpSession>();
 
    public static boolean findByLoginId(String loginId){
        return loginUsers.containsKey(loginId);
    }
 
    public static void invalidateByLoginId(String loginId){
        Enumeration<String> e = loginUsers.keys();
        while (e.hasMoreElements()){
            String key = (String) e.nextElement();
            if (key.equals(loginId)){
                loginUsers.get(key).invalidate();
            }
        }
    }
}