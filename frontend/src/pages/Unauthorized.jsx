import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5ed] p-4">
      <div className="text-center">
        <ShieldX size={64} className="mx-auto text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-[#5c3e1f] mb-2">Unauthorized Access</h1>
        <p className="text-[#8b6f47] mb-6">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate('/intelligent-dashboard')}
          className="px-6 py-3 rounded-lg text-white font-medium"
          style={{
            background: 'linear-gradient(to bottom, #557a3e, #3e5a2c)'
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
