
import React from 'react';

const CarDescriptionAndTerms = ({ overview, mileageLimit, additionalMileageCharge, insuranceIncluded }) => {
  return (
    <>
    
      <div className="description-section1">
        <h3 className="section-title1">Description</h3>
        <div className="description-text1" dangerouslySetInnerHTML={{ __html: overview ?? 'No detailed description available for this car.' }} />
      </div>

    
      <div className="rental-terms-section1">
        <h3 className="section-title1">Rental Terms & Conditions</h3>
        <div className="rental-terms-grid1">
          <div className="rental-term1">
            <div className="term-icon1">📏</div>
            <div className="term-content1">
              <div className="term-title1">Daily Mileage Limit</div>
              <div className="term-value1">{mileageLimit ?? 'N/A'} km/day</div>
            </div>
          </div>

          <div className="rental-term1">
            <div className="term-icon1">➕</div>
            <div className="term-content1">
              <div className="term-title1">Extra Mileage</div>
              <div className="term-value1">AED {additionalMileageCharge ?? 'N/A'}/km</div>
            </div>
          </div>

          <div className="rental-term1">
            <div className="term-icon1">🛡️</div>
            <div className="term-content1">
              <div className="term-title1">Insurance</div>
              <div className="term-value1">
                {insuranceIncluded ?? false ? 'Included' : 'Not Included'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarDescriptionAndTerms;