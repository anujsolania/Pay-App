import { useContext, useEffect, useState } from "react";
import { Appbar } from "./smallcomponents/Appbar";
import { Balance } from "./smallcomponents/Balance";
import { Users } from "./smallcomponents/Users";

export function Dashboard() {
 
    return (
        <div>
            <Appbar></Appbar>
            <hr className="border-t border-gray-200" ></hr>
            <Balance></Balance>
            <Users></Users>
        </div>
    )
}