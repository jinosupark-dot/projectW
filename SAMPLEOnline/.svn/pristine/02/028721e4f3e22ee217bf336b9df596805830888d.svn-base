package kr.co.wllife.acs.online.fwk.com.cmm.util;
import jakarta.servlet.http.HttpSessionBindingEvent;
import jakarta.servlet.http.HttpSessionBindingListener;
 
public class FwkHttpSessionBindingListener implements HttpSessionBindingListener{
 
    @Override
    public void valueBound(HttpSessionBindingEvent event){
        if (FwkMultiLoginPreventor.findByLoginId(event.getName())){
            FwkMultiLoginPreventor.invalidateByLoginId(event.getName());
        }
        FwkMultiLoginPreventor.loginUsers.put(event.getName(), event.getSession());
    }
 
    @Override
    public void valueUnbound(HttpSessionBindingEvent event) {
        FwkMultiLoginPreventor.loginUsers.remove(event.getName(), event.getSession());
    }
}