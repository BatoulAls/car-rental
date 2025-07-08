import React from 'react';

export const AdditionalInfoCard = ({ car }) => {
  if (!car) return null;

  const hasAdditionalInfo =
    car.mileage_limit !== undefined ||
    car.additional_mileage_charge !== undefined ||
    car.deposit_amount !== undefined ||
    car.insurance_included !== undefined;

  if (!hasAdditionalInfo) return null;

  return (
    <div className="preview-additional-info">
      <h4 className="preview-section-title">Additional Information</h4>
      {car.mileage_limit !== undefined && (
        <div className="preview-info-item">
          <span className="preview-info-label">Mileage Limit:</span> {car.mileage_limit} km/day
        </div>
      )}
      {car.additional_mileage_charge !== undefined && (
        <div className="preview-info-item">
          <span className="preview-info-label">Additional Mileage:</span> AED {car.additional_mileage_charge}/km
        </div>
      )}
      {car.deposit_amount !== undefined && (
        <div className="preview-info-item">
          <span className="preview-info-label">Deposit:</span> AED {car.deposit_amount}
        </div>
      )}
      {car.insurance_included !== undefined && (
        <div className="preview-info-item">
          <span className="preview-info-label">Insurance:</span> {car.insurance_included ? 'Included' : 'Not Included'}
        </div>
      )}
    </div>
  );
};
export default AdditionalInfoCard