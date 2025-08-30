import { useNavigate } from "react-router-dom";
import { USERS } from "../types/user";

export function ProfileSelection() {
  const navigate = useNavigate();

  const handleProfileSelect = (userId: string) => {
    navigate(`/rules?user=${userId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
          Who's voting?
        </h1>
        <p className="text-xl text-gray-400 text-center mb-12">
          Choose your profile to start voting on Biome rules
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 justify-items-center">
          {USERS.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleProfileSelect(user.name)}
              className="group flex flex-col items-center space-y-4 p-6 rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-6xl group-hover:shadow-2xl transition-shadow duration-200">
                {user.emoji}
              </div>
              <span className="text-xl font-medium text-gray-300 group-hover:text-white transition-colors duration-200">
                {user.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
