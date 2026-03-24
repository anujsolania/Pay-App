function getTransactionDetails(txn, userId) {
  const isSender = txn.userId?._id === userId;
  let mssg;
  let iconCharacter;
  let sign;

  const date = new Date(txn.updatedAt);
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
  const formattedTime = date
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();

  if (!txn.receiverId) {
    mssg = "Added Money to Wallet";
    iconCharacter = txn.userId?.firstname.charAt(0).toUpperCase();
    txn.status == "EXPIRED" || txn.status == "FAILED"
      ? (sign = "!")
      : (sign = "+");
  } else if (isSender && txn.receiverId) {
    mssg = `Sent to ${`${txn.receiverId?.firstname} ${txn.receiverId?.lastname}`}`;
    iconCharacter = txn.receiverId?.firstname.charAt(0).toUpperCase();
    txn.status == "EXPIRED" || txn.status == "FAILED"
      ? (sign = "!")
      : (sign = "-");
  } else {
    mssg = `Received from ${`${txn.userId?.firstname} ${txn.userId?.lastname}`}`;
    iconCharacter = txn.userId?.firstname.charAt(0).toUpperCase();
    txn.status == "EXPIRED" || txn.status == "FAILED"
      ? (sign = "!")
      : (sign = "+");
  }

  return {
    iconCharacter,
    mssg,
    sign,
    formattedDate,
    formattedTime,
  };
}

export const Transactions = ({
  allTransactions,
  userId,
  loaderRef,
  hasMore,
}) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        {console.log("FILTERED", allTransactions)}
        {allTransactions && allTransactions.length > 0 ? (
          allTransactions.map((txn) => {
            const { iconCharacter, mssg, sign, formattedDate, formattedTime } =
              getTransactionDetails(txn, userId);
            return (
              <div key={txn._id} className="px-10 py-5 border rounded">
                <div className="flex flex-row w-full">
                  {/* icon and mssg div */}
                  <div className="flex flex-row flex-2 gap-28 items-center">
                    <button className="w-10 h-10 border rounded-full bg-gray-600 text-white">
                      {iconCharacter}
                    </button>
                    <div className="flex flex-col items-center">
                      <p>{mssg}</p>
                    </div>
                  </div>
                  {/* date and amount div */}
                  <div className="flex flex-1 justify-between items-center">
                    <p>
                      {formattedDate} {formattedTime} {txn.status}
                    </p>
                    <div
                      className={`font-semibold text-lg ${
                        sign === "+"
                          ? "text-green-500"
                          : sign === "-"
                          ? "text-red-500"
                          : "text-black"
                      }`}
                    >
                      {sign} {txn.amount}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h1 className="text-center my-10 text-gray-400 text-xl">
            {" "}
            no transactions yet ...{" "}
          </h1>
        )}{" "}
      </div>
      {/* loadMore....div */}
      <div ref={loaderRef} className="text-gray-500 text-center m-5">
        {hasMore ? "loading transactions...." : "no more transactions . . ."}
      </div>
    </>
  );
};
