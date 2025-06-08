
import React from 'react';

const CarFeaturesAndTags = ({ features, tags }) => {
  return (
    <>
      
      {((features?.technical?.length ?? 0) > 0 || (features?.comfort?.length ?? 0) > 0) ? (
        <div className="features-section1">
          <h3 className="section-title1">Features</h3>

          {(features?.technical?.length ?? 0) > 0 && (
            <div className="feature-category1">
              <h4 className="feature-category-title1">🔧 Technical Features</h4>
              <div className="features-list1">
                {features.technical.map((feature, index) => (
                  <span key={index} className="feature-tag1">{feature}</span>
                ))}
              </div>
            </div>
          )}

          {(features?.comfort?.length ?? 0) > 0 && (
            <div className="feature-category1">
              <h4 className="feature-category-title1">🛋️ Comfort Features</h4>
              <div className="features-list1">
                {features.comfort.map((feature, index) => (
                  <span key={index} className="feature-tag1">{feature}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="features-section1">
          <h3 className="section-title1">Features</h3>
          <p>No features listed.</p>
        </div>
      )}

    
      {(tags?.length ?? 0) > 0 ? (
        <div className="tags-section1">
          <h3 className="section-title1">Tags</h3>
          <div className="tags-list1">
            {tags.map((tag, index) => (
              <span key={index} className="tag1">#{tag}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="tags-section1">
          <h3 className="section-title1">Tags</h3>
          <p>No tags available.</p>
        </div>
      )}
    </>
  );
};

export default CarFeaturesAndTags;