import React from 'react';
import './Restaurants.css';

const DataPreviewModal = ({ isOpen, data, onConfirm, onCancel }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Data Preview</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <button onClick={onConfirm}>Confirm Transfer</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  };

  export default DataPreviewModal
