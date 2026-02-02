function DetailModal({ isOpen, onClose, children }) {
if(!isOpen) return null;

return (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg relative w-auto max-w-md">
      <button onClick={onClose} className="absolute top-2 right-4 text-gray-500">X</button>
      {children}
    </div>
  </div>
);
}

export default DetailModal;