import React from 'react';

function Toast({ message, onClose }) {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
      {message}
      <button onClick={onClose} className="ml-2">×</button>
    </div>
  );
}

export default Toast;