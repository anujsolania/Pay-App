export function Sendmoney(params) {
    return (
        <div className="flex justify-center items-center h-screen w-screen bg-gray-200" >
            <div className="rounded flex flex-col gap-15 bg-white" style={{padding: "3% 5%"}} >
                <p className="text-center text-2xl font-bold" >Send Money</p>


                <div>

                <div className="flex gap-2" >
                <button className="h-8 w-8 bg-green-500 rounded-full text-white" >A</button>
                <h1 className="font-semibold" >Friend's Name</h1>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                    <p className="text-sm font-semibold" >Amount (in Rs)</p>
                    <input className="border rounded w-full " type="text" placeholder=" Enter amount"></input>
                    </div>
                    <button className="border-2 border-green-500 rounded bg-green-500 text-white text-sm" style={{padding: "3px 4px"}} >Initiate Transfer</button>
                </div>

                </div>
            </div>
        </div>
    )
}