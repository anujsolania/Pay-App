import { Link } from "react-router-dom";

export default function Navabar({shownav,setshownav}) {
    return (
        <div className="border h-screen border-l-gray-500 flex flex-col items-center fixed  top-[0] bg-white transition transition-all duration-1000" style={{padding: "2%",right: shownav ? "0px" : "-300px"}}  >
            <h1>
            <i className="ri-arrow-right-line" onClick={() => {setshownav(false)}} ></i>
            <p >Anuj Solania</p>
            </h1>
            <div className="flex flex-col gap-4 mt-3"  >
                <Link className=""  >Update Info </Link>
                <Link>Home</Link>
                <Link>Log Out</Link>
                <Link>Services</Link>
            </div>

        </div>
    )
}