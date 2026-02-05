package com.ikhodalautomotive.appointment.service;

import com.stripe.model.Event;

public interface PaymentWebhookService {
    void processEvent(Event event);
}
