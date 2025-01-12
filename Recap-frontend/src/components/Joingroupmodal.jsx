import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { X } from 'lucide-react';

const JoinGroupModal = ({ isOpen, onClose }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { joinGroupByCode } = useFirebase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await joinGroupByCode(inviteCode);
      if (result.success) {
        onClose();
      } else {
        setError(result.error.message);
      }
    } catch (error) {
      setError('Failed to join group. Please check the invite code and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">Join a Group</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Enter Invite Code</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="Enter the 8-character invite code"
            />
          </div>

          {error && (
            <div className="mb-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !inviteCode}
            className={`w-full py-2 rounded-lg ${
              loading || !inviteCode
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600'
            } text-white transition-colors`}
          >
            {loading ? 'Joining...' : 'Join Group'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinGroupModal;