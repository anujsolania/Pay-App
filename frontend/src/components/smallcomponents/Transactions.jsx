function getTransactionDetails(txn, userId) {
  const isSender = txn.userId._id === userId;
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
    iconCharacter = txn.userId.firstname.charAt(0).toUpperCase();
    sign = "+";
  } else if (isSender && txn.receiverId) {
    mssg = `Sent to ${`${txn.receiverId.firstname} ${txn.receiverId.lastname}`}`;
    iconCharacter = txn.receiverId.firstname.charAt(0).toUpperCase();
    sign = "-";
  } else {
    mssg = `Received from ${`${txn.userId.firstname} ${txn.userId.lastname}`}`;
    iconCharacter = txn.userId.firstname.charAt(0).toUpperCase();
    sign = "+";
  }

  return {
    iconCharacter,
    mssg,
    sign,
    formattedDate,
    formattedTime,
  };
}

export const Transactions = ({ allTransactions, userId }) => {
  return (
    <div className="flex flex-col gap-2">
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
                    {formattedDate} {formattedTime}
                  </p>
                  <div
                    className={`font-semibold text-lg ${
                      sign === "+" ? "text-green-500" : "text-red-500"
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
        <h1> no transactions </h1>
      )}{" "}
    </div>
  );
};
