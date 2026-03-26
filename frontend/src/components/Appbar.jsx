export function Appbar({ user }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 shadow-sm border-b bg-white">
      <div className="text-xl font-bold text-gray-900">PayTM App</div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">
          Hello,{" "}
          <span className="font-semibold text-gray-900">
            {user?.firstname || "User"}
          </span>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold">
          {user?.firstname?.charAt(0)?.toUpperCase()}
        </div>
      </div>
    </div>
  );
}