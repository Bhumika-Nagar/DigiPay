import { Link } from "react-router-dom";
import { Button } from "./Button";


export function Users({ users, setFilter }) {
  return (
    <div className="p-4">
      <div className="font-semibold mb-2">Users</div>

      <input onChange={(e)=>{
        setFilter(e.target.value)
      }}
        type="text"
        placeholder="Search users..."
        className="w-full px-2 py-1 border rounded mb-3"
      />

      {users?.map((user) => (
        <div
          key={user._id}
          className="flex justify-between items-center mb-2"
        >
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
              {user.firstname?.[0]}
            </div>
            <div>{user.firstname}</div>
          </div>

          {/* ✅ simple navigation using Link */}
          <Link to={`/send?id=${user._id}&name=${user.firstname}`}>
            <Button label="Send Money" />
          </Link>
        </div>
      ))}
    </div>
  );
}