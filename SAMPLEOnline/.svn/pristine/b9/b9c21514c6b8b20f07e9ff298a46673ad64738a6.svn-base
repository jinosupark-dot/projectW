package kr.co.wllife.acs.online.fwk.cfg;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.BeanNameViewResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import kr.co.wllife.acs.online.fwk.com.cmm.interceptor.HistoryInterceptor;
import kr.co.wllife.acs.online.fwk.com.cmm.interceptor.LoginInterceptor;

@Configuration
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public LoginInterceptor loginInterceptor() {
        return new LoginInterceptor();
    }

    @Bean
    public HistoryInterceptor historyInterceptor() {
        return new HistoryInterceptor();
    }

    // Spring Boot 3.5 에서는 LocaleResolver를 Bean으로 등록하지 않아도 기본
    // @Bean
    // public LocaleResolver localeResolver() {
    //     return new SessionLocaleResolver();
    // }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 1. Login Interceptor 등록 (기존 exclude-mapping 반영)
        registry.addInterceptor(loginInterceptor())
                .addPathPatterns("/**/*.do") // 기존 "**/*" 를 "/**/*.do"로 변경하여 .do 요청만 인터셉트하도록 수정. by jhkim
                .excludePathPatterns(
                        "/admin/luserLogin.do",
                        "/admin/doLogin.do",
                        "/admin/doSessChk.do",
                        "/admin/doLogout.do");

        // 2. History Interceptor 등록 (20260421 추가분)
        registry.addInterceptor(historyInterceptor())
                .addPathPatterns("/**/*.do");
    }

    // ==========================================
    // 1. Static Resources Mapping
    // ==========================================
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. src/main/resources/static/ 아래에 있는 경우
        registry.addResourceHandler("/js/**").addResourceLocations("classpath:/static/js/");
        registry.addResourceHandler("/css/**").addResourceLocations("classpath:/static/css/");
        registry.addResourceHandler("/img/**").addResourceLocations("classpath:/static/img/");
        registry.addResourceHandler("/font/**").addResourceLocations("classpath:/static/font/");
        registry.addResourceHandler("/htmlTemplate/**").addResourceLocations("classpath:/static/htmlTemplate/");
        registry.addResourceHandler("/common/**").addResourceLocations("classpath:/static/common/");

    }
    // ==========================================
    // 1. View Resolvers (BeanNameViewResolver & JSP)
    // ==========================================

    /**
     * 뷰 이름("jsonView")과 일치하는 빈을 최우선(Order 0)으로 찾아주는 Resolver
     */
    @Bean
    public BeanNameViewResolver beanNameViewResolver() {
        BeanNameViewResolver resolver = new BeanNameViewResolver();
        resolver.setOrder(0);
        return resolver;
    }

    /**
     * jsonView 빈 설정
     */
    @Bean(name = "jsonView")
    public MappingJackson2JsonView jsonView() {
        MappingJackson2JsonView jsonView = new MappingJackson2JsonView();
        jsonView.setContentType("application/json;charset=UTF-8");
        return jsonView;
    }

    /**
     * JSP ViewResolver 설정 (Order 1)
     */
    @Bean
    public InternalResourceViewResolver jspViewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setOrder(1);
        resolver.setViewClass(JstlView.class);
        resolver.setPrefix("/WEB-INF/jsp/acs/online/");
        resolver.setSuffix(".jsp");
        resolver.setContentType("text/plain;charset=UTF-8"); // 기존 설정 유지를 원할 때 사용
        return resolver;
    }

}