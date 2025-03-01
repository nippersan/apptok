import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div>
          <div className="text-xl font-medium text-black">apptok</div>
          <p className="text-gray-500">アプリケーションが正常に起動しました！</p>
        </div>
      </div>
    </div>
  );
};

export default App;