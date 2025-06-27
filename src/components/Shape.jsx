import React from 'react';
import '../styles/Register.css'; // Assuming your background styles are here

const Shape = ({ children }) => {
  return (
    <div className="container-reg">
      <div className="background-shapes-reg">
        <div className="shape1-reg"></div>
        <div className="shape2-reg"></div>
        <div className="shape3-reg"></div>
      </div>
      {children}
    </div>
  );
};

export default Shape;