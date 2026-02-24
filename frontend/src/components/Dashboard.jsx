import { Appbar } from "./smallcomponents/Appbar";
import { Balance } from "./smallcomponents/Balance";
import { UsersAnsTransactions } from "./smallcomponents/UsersAndTransactions";

export function Dashboard() {
  return (
    <div>
      <Appbar></Appbar>
      <hr className="border-t border-gray-200"></hr>
      <div className="flex flex-col gap-6">
        <Balance></Balance>
        <UsersAnsTransactions></UsersAnsTransactions>
      </div>
    </div>
  );
}
