import React, { useState } from 'react';
import '../styles/UserProfile.css'; 

const RentalHistory = () => {
   
    const [rentalHistory] = useState([
        {
            id: 1,
            carModel: 'Toyota Camry 2023',
            startDate: '2024-03-15',
            endDate: '2024-03-20',
            totalCost: '$350',
            status: 'Completed',
        },
        {
            id: 2,
            carModel: 'Honda CR-V 2023',
            startDate: '2024-02-10',
            endDate: '2024-02-12',
            totalCost: '$180',
            status: 'Completed',
        },
        {
            id: 3,
            carModel: 'BMW X3 2024',
            startDate: '2024-01-25',
            endDate: '2024-01-28',
            totalCost: '$480',
            status: 'Completed',
        },
    ]);

    return (
        <div className="tab-content">
            <h3 className="section-title">Rental History</h3>
            <div className="rental-list">
                {rentalHistory.map((rental) => (
                    <div key={rental.id} className="rental-card">
                        <div className="rental-info">
                            <h4 className="car-model">{rental.carModel}</h4>
                            <div className="rental-dates">
                                {rental.startDate} to {rental.endDate}
                            </div>
                        </div>
                        <div className="rental-details">
                            <div className="total-cost">{rental.totalCost}</div>
                            <div className={`status ${rental.status === 'Completed' ? 'completed' : 'active'}`}>
                                {rental.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RentalHistory;