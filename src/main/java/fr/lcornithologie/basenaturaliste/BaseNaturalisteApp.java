package fr.lcornithologie.basenaturaliste;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import javax.annotation.PostConstruct;
import javax.servlet.Filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import fr.lcornithologie.basenaturaliste.filter.SimpleCORSFilter;

@SpringBootApplication
@Configuration
public class BaseNaturalisteApp {

    private static final Logger log = LoggerFactory.getLogger(BaseNaturalisteApp.class);

    public static void main(String[] args) throws UnknownHostException {

	Environment env = SpringApplication.run(BaseNaturalisteApp.class, args).getEnvironment();
	log.info("\n----------------------------------------------------------\n\t" + "Application {} is running!"
		+ "\n\tAccess URLs:\n\t" + "Local: \thttp://base_naturaliste:{}\n\t" + "External: \thttp://{}:{}\n\t"
		+ "Date:\t{}" + "\n----------------------------------------------------------",
		env.getProperty("spring.application.name"), env.getProperty("server.port"),
		InetAddress.getLocalHost().getHostAddress(), env.getProperty("server.port"), getDate());
    }

    /**
     * Initializes basenaturaliste.
     */
    @PostConstruct
    public void initApplication() {

    }

    @Bean
    public FilterRegistrationBean httpFilterRegistration() {
	FilterRegistrationBean registration = new FilterRegistrationBean();
	registration.setFilter(httpFilter());
	registration.addUrlPatterns("/api/*");
	registration.setName("httpFilter");
	registration.setOrder(1);
	return registration;
    }

    @Bean(name = "httpFilter")
    public Filter httpFilter() {
	return new SimpleCORSFilter();
    }

    public static String getDate() {
	Calendar cal = Calendar.getInstance();
	SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
	return formatter.format(cal.getTime());
    }
}
