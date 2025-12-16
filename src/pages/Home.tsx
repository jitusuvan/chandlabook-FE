import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-8">
      {/* Card */}
      <div className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden bg-white">
        
        {/* Top Red Section */}
        <div className="bg-red-500 px-6 py-4">
          <h2 className="text-white text-lg font-semibold">
            Add Chandla Record
          </h2>
        </div>

        {/* Bottom White Section */}
        <div className="px-6 py-6 bg-white">
          <form className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="text"
              placeholder="Village"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <input
              type="number"
              placeholder="Amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <button
              type="submit"
              className="w-full py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Submit
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Home;
