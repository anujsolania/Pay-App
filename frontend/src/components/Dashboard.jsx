import { Appbar } from "./smallcomponents/Appbar";
import { Balance } from "./smallcomponents/Balance";
import { UsersAnsTransactions } from "./smallcomponents/UsersAndTransactions";

export function Dashboard() {
  return (
    <div>
      <Appbar></Appbar>
      <hr className="border-t border-gray-200"></hr>
      <Balance></Balance>
      <UsersAnsTransactions></UsersAnsTransactions>
    </div>
  );
}
