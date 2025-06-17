
import React from 'react';
import { Award, AlertTriangle } from 'lucide-react';

const VendorMainInfo = ({ name, open_24_7, shop_open_time, shop_close_time, verified, description }) => {
  return (
    <div className="vendor-main-info">
      <div className="vendor-title-section">
        <h1 className="vendor-details-name">{name}</h1>
        <div className="vendor-badges">
          <span className="category-badge">
            {open_24_7 ? (
              <span className="open-always">🕒 Open 24/7</span>
            ) : (
              <span>🕒 {shop_open_time || 'N/A'} - {shop_close_time || 'N/A'}</span>
            )}
          </span>
          {verified ? (
            <span className="verified-badge"><Award size={16} /> Verified</span>
          ) : (
            <span className="not-verified-badge"><AlertTriangle size={16} /> Not Verified</span>
          )}
        </div>
      </div>

      <p className="vendor-description">{description || 'N/A'}</p>
    </div>
  );
};

export default VendorMainInfo;
