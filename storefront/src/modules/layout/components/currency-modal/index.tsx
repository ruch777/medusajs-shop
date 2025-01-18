import { useState } from "react";

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CurrencyModal: React.FC<CurrencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">Select Currency</h2>
        <button onClick={onClose} className="block w-full text-left px-2 py-1 hover:bg-ui-bg-subtle rounded">USD</button>
        <button onClick={onClose} className="block w-full text-left px-2 py-1 hover:bg-ui-bg-subtle rounded">EUR</button>
        <button onClick={onClose} className="block w-full text-left px-2 py-1 hover:bg-ui-bg-subtle rounded">GBP</button>
      </div>
    </div>
  );
};

export default CurrencyModal;