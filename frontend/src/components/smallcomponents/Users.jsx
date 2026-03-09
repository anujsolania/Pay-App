export const Users = ({
  allusers,
  navigate,
  userLoaderRef,
  hasMore,
  userLoading,
}) => {
  return (
    <div>
      {allusers && allusers.length > 0 ? (
        allusers.map((user) => (
          <div key={user._id} className="flex flex-col">
            <div className="flex py-3">
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
      ) : userLoading ? null : (
        <h1 className="text-center my-10 text-gray-400 text-xl">
          {" "}
          no users found ...{" "}
        </h1>
      )}
      {/* loadMore....div */}
      <div ref={userLoaderRef} className="text-gray-500 text-center m-5">
        {hasMore ? "loading users...." : "no more users . . ."}
      </div>
    </div>
  );
};
