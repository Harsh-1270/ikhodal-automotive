package com.ikhodalautomotive.appointment.service.impl;

import com.ikhodalautomotive.appointment.dto.request.CreateServiceRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.ServiceResponseDTO;
import com.ikhodalautomotive.appointment.repository.ServiceRepository;
import com.ikhodalautomotive.appointment.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ikhodalautomotive.appointment.model.Services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceServiceImpl implements ServiceService {

        @Autowired
        private ServiceRepository serviceRepository;

        @Override
        public List<ServiceResponseDTO> getAllActiveServices() {

                return serviceRepository.findByIsActiveTrue()
                                .stream()
                                .map(service -> {
                                        ServiceResponseDTO dto = new ServiceResponseDTO();
                                        dto.setId(service.getId());
                                        dto.setName(service.getName());
                                        dto.setDescription(service.getDescription());
                                        dto.setPrice(service.getPrice());

                                        // New fields
                                        dto.setIcon(service.getIcon());
                                        dto.setDuration(service.getDuration());
                                        dto.setCategory(service.getCategory());
                                        dto.setIsPopular(service.getIsPopular());
                                        dto.setRating(service.getRating());

                                        dto.setIsActive(service.getIsActive());
                                        dto.setCreatedAt(service.getCreatedAt());

                                        return dto;
                                })
                                .collect(Collectors.toList());
        }

        @Override
        public void addService(CreateServiceRequestDTO request) {

                Services service = new Services();
                service.setName(request.getName());
                service.setDescription(request.getDescription());
                service.setPrice(request.getPrice());

                // New fields
                service.setIcon(request.getIcon());
                service.setDuration(request.getDuration());
                service.setCategory(request.getCategory());
                service.setIsPopular(request.getIsPopular());
                service.setRating(request.getRating());

                // default active = true
                service.setIsActive(
                                request.getIsActive() != null ? request.getIsActive() : true);

                service.setCreatedAt(LocalDateTime.now());

                serviceRepository.save(service);
        }

        @Override
        public void seedServices() {
                // No deleteAll() to avoid FK constraint violations with existing appointments

                // Mobile Call-Out Service
                createSeedService("Mobile Mechanic Call-Out",
                                "Fast mobile mechanic to your location for inspections, diagnostics, and repairs.",
                                new java.math.BigDecimal("89"),
                                "Car", "30 mins", "mobile", true, 4.9);

                // Service Packages
                createSeedService("Essential Care Service",
                                "Affordable basic car service including oil change, safety check, and fluid top-ups.",
                                new java.math.BigDecimal("149"),
                                "OilCan", "1-2 hours", "service-packages", false, 4.8);

                createSeedService("Complete Care Service",
                                "Most Popular: Comprehensive logbook-style service including brakes, suspension & battery checks.",
                                new java.math.BigDecimal("189"),
                                "Clipboard", "2-3 hours", "service-packages", true, 4.9);

                createSeedService("Premium Care Service",
                                "Detailed full vehicle health check including air filters, cooling system, and maintenance report.",
                                new java.math.BigDecimal("209"),
                                "Package", "3-4 hours", "service-packages", false, 4.9);

                // Mechanical Repairs
                createSeedService("Mechanical Repairs",
                                "Professional repairs including brakes, suspension, cooling system, and general engine work.",
                                new java.math.BigDecimal("179"),
                                "Engine", "1-2 hours", "repairs", false, 4.7);

                createSeedService("Brake Repairs & Replacement",
                                "Complete brake inspections, pad replacement, and rotor checks for safety.",
                                new java.math.BigDecimal("149"),
                                "Brakes", "1-2 hours", "repairs", true, 4.8);

                // Diagnostics & Testing
                createSeedService("Vehicle Diagnostics",
                                "Advanced diagnostic scan for engine lights, ABS, airbags, and fault codes.",
                                new java.math.BigDecimal("49"),
                                "Cog", "30-45 mins", "diagnostics", true, 4.9);

                createSeedService("Battery Testing & Replacement",
                                "Battery testing, supply, and installation to prevent unexpected breakdowns.",
                                new java.math.BigDecimal("29"),
                                "Battery", "30 mins", "diagnostics", false, 4.8);

                // Electrical Services
                createSeedService("Auto Electrical Services",
                                "Reliable repairs for lighting faults, wiring issues, fuses, and sensors.",
                                new java.math.BigDecimal("99"),
                                "Bulb", "1 hour", "electrical", false, 4.7);

                createSeedService("Dash Cam Installation",
                                "Professional dash cam installation with clean hidden wiring (Front/Rear).",
                                new java.math.BigDecimal("149"),
                                "Camera", "1-2 hours", "electrical", true, 4.9);

                createSeedService("Car Audio & Sound Upgrades",
                                "Speaker upgrades, amplifiers, and subwoofers with professional installation.",
                                new java.math.BigDecimal("199"),
                                "Speaker", "2-3 hours", "electrical", false, 4.8);

                // Air Conditioning
                createSeedService("Air Conditioning Inspection",
                                "AC system checks including pressure testing, compressor operation, and performance.",
                                new java.math.BigDecimal("220"),
                                "Snowflake", "45 mins", "inspection", false, 4.7);

                // Inspections
                createSeedService("Pre-Purchase Vehicle Inspection",
                                "Detailed inspection to assess mechanical condition before buying a used vehicle.",
                                new java.math.BigDecimal("59"),
                                "Magnifier", "1-2 hours", "inspection", true, 4.9);

                createSeedService("General Vehicle Safety Inspection",
                                "Overall safety check covering brakes, suspension, fluids, tyres, and major components.",
                                new java.math.BigDecimal("29"),
                                "ShieldCheck", "1 hour", "inspection", false, 4.8);

                // Accessories
                createSeedService("Accessory Fitment",
                                "Installation of reverse cameras, lighting upgrades, USB ports, and electrical accessories.",
                                new java.math.BigDecimal("99"),
                                "Plug", "1-2 hours", "accessories", false, 4.7);

                // Prestige Steering Cover
                createSeedService("Prestige HandStitch steering Cover",
                                "Premium leather steering cover with hand-stitched detailing for enhanced grip and style.",
                                new java.math.BigDecimal("49.99"),
                                "Steering", "1 hour", "accessories", false, 4.9);
        }

        private void createSeedService(String name, String description, java.math.BigDecimal price,
                        String icon, String duration, String category,
                        Boolean isPopular, Double rating) {

                // check if exists by name
                List<Services> services = serviceRepository.findByName(name);
                Services service;

                if (services.isEmpty()) {
                        service = new Services();
                        service.setName(name);
                        service.setCreatedAt(LocalDateTime.now());
                } else {
                        // If duplicates exist, pick the first one to update
                        service = services.get(0);

                        // Optional: Log warning if duplicates found
                        if (services.size() > 1) {
                                System.out.println("WARNING: Duplicate services found for name: " + name
                                                + ". Updating the first one.");
                        }
                }

                // update fields
                service.setDescription(description);
                service.setPrice(price);
                service.setIcon(icon);
                service.setDuration(duration);
                service.setCategory(category);
                service.setIsPopular(isPopular);
                service.setRating(rating);
                service.setIsActive(true);

                serviceRepository.save(service);
        }
}
