package com.ikhodalautomotive.appointment;

import com.ikhodalautomotive.appointment.service.ServiceService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AppointmentBookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppointmentBookingApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(ServiceService serviceService) {
		return (args) -> {
			serviceService.seedServices();
			System.out.println("Started Auto-Seeding Services...");
		};
	}

}
