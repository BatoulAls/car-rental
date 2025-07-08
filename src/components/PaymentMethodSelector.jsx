import React from 'react';
import { CreditCard } from 'lucide-react';

export const PaymentMethodSelector = ({ paymentMethods, selectedPaymentMethod, onSelectPaymentMethod, disabled }) => {
  if (!paymentMethods || paymentMethods.length === 0) return null;

  return (
    <div className="preview-payment-methods">
      <h3 className="preview-section-title">Payment Methods</h3>
      <div className="preview-payment-list">
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            
            className={`preview-payment-item ${selectedPaymentMethod === method ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && onSelectPaymentMethod(method)} 
          >
            <div className="preview-payment-radio">
              <div className="preview-payment-radio-dot"></div>
            </div>
            <span className="preview-payment-label">{method}</span>
            <CreditCard size={20} className="preview-payment-icon" />
          </div>
        ))}
      </div>
    </div>
  );
};