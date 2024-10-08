import React, { useState } from 'react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace this with actual authentication logic
    const userData = { username };
    onLogin(userData);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-11/12 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">登录</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-2">
            用户名:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </label>
          <label className="mb-4">
            密码:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </label>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              取消
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              登录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthDialog;