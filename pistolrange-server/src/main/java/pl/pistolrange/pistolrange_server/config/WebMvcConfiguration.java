package pl.pistolrange.pistolrange_server.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Map;

@Component
public class  WebMvcConfiguration implements ErrorViewResolver{
    @Override
    public ModelAndView resolveErrorView(HttpServletRequest request, HttpStatus status, Map<String, Object> model) {
        if (status == HttpStatus.NOT_FOUND) {
            return new ModelAndView("forward:/");
        }
        return null;
    }
}
