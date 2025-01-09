import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function Modal({ setModalOpen }) {
  const navigate = useNavigate();
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={() => setModalOpen(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Modal Header */}
        <div className="w-full flex justify-between items-center mb-4">
          <h5 className="text-lg font-semibold text-gray-800">Confirm</h5>
          <button
            className="text-gray-500 hover:text-gray-800 transition transform hover:scale-110"
            onClick={() => setModalOpen(false)}
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="text-gray-600 text-center mb-6">
          Are you sure you want to log out?
        </div>

        {/* Modal Actions */}
        <div className="flex space-x-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
            onClick={() => {
              setModalOpen(false);
              localStorage.clear();
              navigate("/signin");
            }}
          >
            Log Out
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}