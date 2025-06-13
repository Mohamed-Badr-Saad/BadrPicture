import type { IUser } from "@/types";

const UserDetails = ({user}:{user:IUser} ) => {
  return (
    <div className="card p-4 rounded-xl shadow-md max-w-md mx-auto bg-white">
      <div className="flex items-center space-x-4">
        <img
          src={user.imageUrl}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-semibold  text-gray-700">{user.name}</h2>
          <p className="text-gray-500">@{user.username}</p>
        </div>
      </div>

      <div className="mt-4 text-gray-700">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {user.bio && (
          <p>
            <strong>Bio:</strong> {user.bio}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
