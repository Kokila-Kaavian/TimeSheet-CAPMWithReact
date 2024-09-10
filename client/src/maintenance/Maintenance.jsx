import React from "react";

import './Maintenance.css'

const Maintenance = () => {
  return (
    <div className="maintenance-main-container">
      <div className="maintenance-sub-container">
        <div className="maintenance-content">
          <h1>Application is Under Maintenance</h1>
          <p className="maintenance-sub-content">We hope to come back soon...</p>
        </div>
        <div className="maintenance-image">
          <img src="/images/maintenance.png" alt="Maintenance-Image" />
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
