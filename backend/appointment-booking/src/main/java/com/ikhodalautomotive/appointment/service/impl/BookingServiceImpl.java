package com.ikhodalautomotive.appointment.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.model.AppointmentService;
import com.ikhodalautomotive.appointment.model.Services;
import com.ikhodalautomotive.appointment.model.User;
import com.ikhodalautomotive.appointment.repository.AppointmentRepository;
import com.ikhodalautomotive.appointment.repository.AppointmentServiceRepository;
import com.ikhodalautomotive.appointment.repository.PaymentRepository;
import com.ikhodalautomotive.appointment.repository.ServiceRepository;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.service.AvailabilityService;
import com.ikhodalautomotive.appointment.service.BookingService;
import com.stripe.model.PaymentIntent;
import com.ikhodalautomotive.appointment.dto.request.CreateBookingRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.AdminBookingResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.BookingDetailsResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.BookingResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.MyBookingResponseDTO;
import com.ikhodalautomotive.appointment.enums.PaymentStatus;

@Service
public class BookingServiceImpl implements BookingService {

        private final AppointmentRepository appointmentRepository;
        private final AppointmentServiceRepository appointmentServiceRepository;
        private final ServiceRepository serviceRepository;
        private final UserRepository userRepository;
        private final AvailabilityService availabilityService;
        private final PaymentRepository paymentRepository;

        public BookingServiceImpl(
                        AppointmentRepository appointmentRepository,
                        AppointmentServiceRepository appointmentServiceRepository,
                        ServiceRepository serviceRepository,
                        UserRepository userRepository,
                        AvailabilityService availabilityService,
                        PaymentRepository paymentRepository) {
                this.appointmentRepository = appointmentRepository;
                this.appointmentServiceRepository = appointmentServiceRepository;
                this.serviceRepository = serviceRepository;
                this.userRepository = userRepository;
                this.availabilityService = availabilityService;
                this.paymentRepository = paymentRepository;
        }

        @Override
        @Transactional
        public BookingResponseDTO createBooking(CreateBookingRequestDTO request, String userEmail) {

                // 1️⃣ Validate slot availability (CRITICAL)
                boolean available = availabilityService.isSlotAvailable(
                                request.getDate(),
                                request.getStartTime(),
                                request.getEndTime());

                if (!available) {
                        throw new ApiException("Selected time slot is no longer available");
                }

                // 2️⃣ Fetch user
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new ApiException("User not found"));

                // 3️⃣ Create appointment
                Appointment appointment = new Appointment();
                appointment.setUser(user);
                appointment.setAppointmentDate(request.getDate());
                appointment.setStartTime(request.getStartTime());
                appointment.setEndTime(request.getEndTime());
                appointment.setStatus("PENDING");
                appointment.setCreatedAt(LocalDateTime.now());

                // Vehicle information
                appointment.setRegistrationNumber(request.getRegistrationNumber());
                appointment.setVehicleMake(request.getMake());
                appointment.setVehicleModel(request.getModel());
                appointment.setVehicleYear(request.getYear());

                // Contact information
                appointment.setFullName(request.getFullName());
                appointment.setAddress(request.getAddress());
                appointment.setPostcode(request.getPostcode());
                appointment.setAdditionalComments(request.getAdditionalComments());

                appointmentRepository.save(appointment);

                // 4️⃣ Attach services
                if (request.getServiceIds() == null || request.getServiceIds().isEmpty()) {
                        throw new ApiException("At least one service must be selected");
                }

                List<Services> services = serviceRepository.findAllById(request.getServiceIds());

                if (services.size() != request.getServiceIds().size()) {
                        throw new ApiException("One or more services are invalid");
                }

                for (Services service : services) {
                        AppointmentService as = new AppointmentService();
                        as.setAppointment(appointment);
                        as.setService(service);
                        as.setServicePrice(service.getPrice());

                        appointmentServiceRepository.save(as);
                }

                // 5️⃣ Response
                return new BookingResponseDTO(
                                appointment.getId(),
                                appointment.getStatus(),
                                "Booking created successfully");
        }

        @Override
        public List<MyBookingResponseDTO> getMyBookings(String userEmail) {

                List<Appointment> appointments = appointmentRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);

                return appointments.stream()
                                .map(a -> {
                                        // Calculate total and service names for this appointment
                                        List<AppointmentService> appServices = appointmentServiceRepository
                                                        .findByAppointment_Id(a.getId());
                                        BigDecimal total = appServices.stream()
                                                        .map(AppointmentService::getServicePrice)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                                        String serviceNames = appServices.stream()
                                                        .map(as -> as.getService().getName())
                                                        .collect(Collectors.joining(", "));
                                        String serviceIcon = appServices.isEmpty() ? "Wrench"
                                                        : appServices.get(0).getService().getIcon();

                                        return new MyBookingResponseDTO(
                                                        a.getId(),
                                                        a.getAppointmentDate(),
                                                        a.getStartTime(),
                                                        a.getEndTime(),
                                                        a.getStatus(),
                                                        total,
                                                        serviceNames.isEmpty() ? "Service Appointment" : serviceNames,
                                                        serviceIcon,
                                                        a.getVehicleMake(),
                                                        a.getVehicleModel(),
                                                        a.getFullName(),
                                                        a.getAddress());
                                })
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
        public BookingDetailsResponseDTO getBookingById(
                        Long bookingId,
                        String userEmail,
                        boolean isAdmin) {

                Appointment appointment = appointmentRepository.findById(bookingId)
                                .orElseThrow(() -> new ApiException("Booking not found"));

                // 🔐 Ownership check (CRITICAL)
                if (!isAdmin && !appointment.getUser().getEmail().equals(userEmail)) {
                        throw new ApiException("You are not allowed to access this booking");
                }

                List<AppointmentService> appointmentServices = appointmentServiceRepository
                                .findByAppointment_Id(bookingId);

                List<BookingDetailsResponseDTO.ServiceItemDTO> services = appointmentServices.stream()
                                .map(as -> new BookingDetailsResponseDTO.ServiceItemDTO(
                                                as.getService().getId(),
                                                as.getService().getName(),
                                                as.getServicePrice()))
                                .collect(Collectors.toList());

                BigDecimal total = appointmentServices.stream()
                                .map(AppointmentService::getServicePrice)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                String serviceIcon = appointmentServices.isEmpty() ? "Wrench"
                                : appointmentServices.get(0).getService().getIcon();

                // Fetch payment data
                var paymentOpt = paymentRepository.findByAppointmentId(bookingId);

                return BookingDetailsResponseDTO.builder()
                                .bookingId(appointment.getId())
                                .date(appointment.getAppointmentDate())
                                .startTime(appointment.getStartTime())
                                .endTime(appointment.getEndTime())
                                .status(appointment.getStatus())
                                .totalAmount(total)
                                .serviceIcon(serviceIcon)
                                .services(services)
                                .registrationNumber(appointment.getRegistrationNumber())
                                .vehicleMake(appointment.getVehicleMake())
                                .vehicleModel(appointment.getVehicleModel())
                                .vehicleYear(appointment.getVehicleYear())
                                .fullName(appointment.getFullName())
                                .address(appointment.getAddress())
                                .postcode(appointment.getPostcode())
                                .additionalComments(appointment.getAdditionalComments())
                                .customerEmail(appointment.getUser().getEmail())
                                .paymentStatus(paymentOpt.map(p -> p.getStatus().name()).orElse(null))
                                .stripePaymentId(paymentOpt.map(p -> p.getStripePaymentId()).orElse(null))
                                .paymentTime(paymentOpt.map(p -> p.getPaymentTime()).orElse(null))
                                .build();
        }

        /*
         * ==========================================
         * ADMIN METHODS
         * ==========================================
         */

        @Override
        @Transactional(readOnly = true)
        public List<AdminBookingResponseDTO> getAllBookingsForAdmin(String status) {

                List<Appointment> appointments;

                if (status != null && !status.isEmpty()) {
                        appointments = appointmentRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
                } else {
                        appointments = appointmentRepository.findAllByOrderByCreatedAtDesc();
                }

                return appointments.stream()
                                .map(a -> {
                                        List<AppointmentService> appServices = appointmentServiceRepository
                                                        .findByAppointment_Id(a.getId());

                                        BigDecimal total = appServices.stream()
                                                        .map(AppointmentService::getServicePrice)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        String serviceNames = appServices.stream()
                                                        .map(as -> as.getService().getName())
                                                        .collect(Collectors.joining(", "));

                                        String serviceIcon = appServices.isEmpty() ? "Wrench"
                                                        : appServices.get(0).getService().getIcon();

                                        return new AdminBookingResponseDTO(
                                                        a.getId(),
                                                        a.getFullName() != null ? a.getFullName()
                                                                        : a.getUser().getName(),
                                                        a.getUser().getEmail(),
                                                        a.getAppointmentDate(),
                                                        a.getStartTime(),
                                                        a.getEndTime(),
                                                        a.getStatus(),
                                                        total,
                                                        serviceNames.isEmpty() ? "Service Appointment" : serviceNames,
                                                        serviceIcon,
                                                        a.getVehicleMake(),
                                                        a.getVehicleModel(),
                                                        a.getAddress(),
                                                        a.getCreatedAt());
                                })
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public void completeBooking(Long bookingId) {
                Appointment appointment = appointmentRepository.findById(bookingId)
                                .orElseThrow(() -> new ApiException("Booking not found"));

                appointment.setStatus("COMPLETED");
                appointmentRepository.save(appointment);
        }

        @Override
        @Transactional
        public void deleteBooking(Long bookingId) {
                Appointment appointment = appointmentRepository.findById(bookingId)
                                .orElseThrow(() -> new ApiException("Booking not found"));

                // Check for associated payment
                var paymentOpt = paymentRepository.findByAppointmentId(bookingId);
                if (paymentOpt.isPresent()) {
                        var payment = paymentOpt.get();
                        if (PaymentStatus.SUCCESS.equals(payment.getStatus())) {
                                throw new ApiException("Booking cannot be deleted because the user has already done the payment.");
                        }
                        // If it exists but not SUCCESS (e.g. INITIATED/FAILED), delete it to avoid FK errors
                        paymentRepository.delete(payment);
                }

                // Delete associated services first
                List<AppointmentService> appServices = appointmentServiceRepository
                                .findByAppointment_Id(bookingId);
                appointmentServiceRepository.deleteAll(appServices);

                // Delete the appointment
                appointmentRepository.delete(appointment);
        }

        @Override
        @Transactional
        public void cancelBooking(Long bookingId, String userEmail) {

                // 1. Find appointment
                Appointment appointment = appointmentRepository.findById(bookingId)
                                .orElseThrow(() -> new ApiException("Booking not found"));

                // 2. Ownership check — user can only cancel their own booking
                if (!appointment.getUser().getEmail().equals(userEmail)) {
                        throw new ApiException("You are not allowed to cancel this booking");
                }

                // 3. Only PENDING bookings can be cancelled
                if (!"PENDING".equals(appointment.getStatus())) {
                        throw new ApiException("Only pending bookings can be cancelled");
                }

                // 4. Cancel Stripe PaymentIntent if one exists
                var paymentOpt = paymentRepository.findByAppointmentId(bookingId);
                if (paymentOpt.isPresent()) {
                        String stripePaymentId = paymentOpt.get().getStripePaymentId();
                        try {
                                PaymentIntent intent = PaymentIntent.retrieve(stripePaymentId);
                                // Only cancel if it's in a cancellable state
                                String intentStatus = intent.getStatus();
                                if ("requires_payment_method".equals(intentStatus)
                                                || "requires_confirmation".equals(intentStatus)
                                                || "requires_action".equals(intentStatus)
                                                || "processing".equals(intentStatus)) {
                                        intent.cancel();
                                }
                        } catch (Exception e) {
                                // Log but don't block cancellation — intent may already be expired
                        }
                        // Delete the payment record from DB
                        paymentRepository.delete(paymentOpt.get());
                }

                // 5. Delete associated appointment services
                List<AppointmentService> appServices = appointmentServiceRepository
                                .findByAppointment_Id(bookingId);
                appointmentServiceRepository.deleteAll(appServices);

                // 6. Delete the appointment
                appointmentRepository.delete(appointment);
        }

}
