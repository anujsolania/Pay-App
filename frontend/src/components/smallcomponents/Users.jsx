export const Users = ({ allusers, navigate }) => {
  return allusers && allusers.length > 0 ? (
    allusers.map((user) => (
      <div key={user._id} className="flex flex-col gap-6">
        <div className="flex">
          <div className="w-[50%] flex items-center gap-4">
            <button className="w-8 h-8 border rounded-full">
              {user.firstname.charAt(0)}
            </button>
            <h1>
              {user.firstname} {user.lastname}
            </h1>
          </div>
          <div className="w-[50%] flex justify-end">
            <button
              className="rounded bg-black text-white py-[4px] px-[10px]"
              onClick={async () => {
                navigate(`/sendmoney/${user._id}`);
              }}
            >
              Send Money
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <h1 className="text-center my-10 text-gray-400 text-xl">
      {" "}
      no users found ...{" "}
    </h1>
  );
};
