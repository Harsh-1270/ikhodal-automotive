/**
 * Centralized mock data for E2E tests
 * ----------------------------------
 * Purpose:
 * - Ensure deterministic, stable tests
 * - Avoid backend dependency
 * - Keep data realistic but controlled
 */

export const mockUsers = {
    customer: {
        email: 'user@test.com',
        password: 'User@123',
        name: 'Test User',
    },
    admin: {
        email: 'admin@test.com',
        password: 'Admin@123',
        name: 'Admin User',
    },
};

export const mockServices = [
    {
        id: 'service-oil',
        name: 'Oil Change',
        price: 499,
        duration: '30 mins',
    },
    {
        id: 'service-wash',
        name: 'Car Wash',
        price: 299,
        duration: '20 mins',
    },
];

export const mockTimeSlots = {
    available: ['09:00', '09:30', '10:00', '15:00'],
    unavailable: ['10:30', '11:00', '11:30', '14:00'],
};

export const mockBookings = [
    {
        id: 'booking-1',
        serviceName: 'Oil Change',
        date: '2026-02-10',
        time: '09:00',
        status: 'Pending',
    },
    {
        id: 'booking-2',
        serviceName: 'Car Wash',
        date: '2026-02-05',
        time: '15:00',
        status: 'Completed',
    },
];
