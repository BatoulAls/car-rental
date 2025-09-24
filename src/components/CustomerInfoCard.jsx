import React from 'react';
import { User, Phone, Mail } from 'lucide-react';
import '../styles/BookingDetails.css'

export const CustomerInfoCard = ({ user }) => {
    if (!user) return null;

    return (
        <div className="Booking-card customer-info-card">
            <h3 className="Booking-section-title">Customer Information</h3>
            <div className="Booking-info-item">
                <User size={20} className="info-icon" />
                <span className="info-label">Name:</span>
                <span>{user.username}</span>
            </div>
            <div className="Booking-info-item">
                <Mail size={20} className="info-icon" />
                <span className="info-label">Email:</span>
                <span>{user.email}</span>
            </div>
            {user.phone && (
                <div className="Booking-info-item">
                    <Phone size={20} className="info-icon" />
                    <span className="info-label">Phone:</span>
                    <span>{user.phone}</span>
                </div>
            )}
        </div>
    );
};