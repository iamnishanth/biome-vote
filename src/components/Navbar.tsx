import { LogOut } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { USERS } from "../types/user";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = searchParams.get("user");

  const user = USERS.find((u) => u.name === currentUser);

  const handleProfileClick = () => {
    navigate("/");
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Biome Rules Voting
            </h1>
            <p className="text-sm text-gray-600">
              Help decide which linting rules to adopt
            </p>
          </div>

          {user && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleProfileClick}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-lg">
                    {user.emoji}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
              </button>
              <button
                type="button"
                onClick={handleProfileClick}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
