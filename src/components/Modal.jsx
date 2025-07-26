import React from 'react';

const Modal = ({ isOpen, onClose, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 transition-opacity duration-300 ease-in-out animate-[fadeIn_0.3s_ease-in-out] ${className}`}
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <div
        className="bg-gray-900 rounded-xl shadow-2xl overflow-y-auto transform transition-all duration-300 ease-in-out animate-[scaleIn_0.3s_ease-in-out] px-2 sm:px-6 py-2 sm:py-6"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'scaleIn 0.3s ease-in-out',
          maxHeight: '90vh',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
