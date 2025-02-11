export function Users() {
    return (
        <div className="flex flex-col gap-6" style={{padding: "0 2%"}} >
            <h1 className="font-bold text-xl" >Users</h1>
            <input className="w-full border rounded" style={{padding: "0.5%"}} placeholder=" Search users..."></input>

            <div className="flex flex-col gap-6" >
                
                <div className="flex" >
                    <div className="w-[50%] flex gap-4" >
                        <button className="w-8 h-8 border rounded-full" >U1</button>
                        <h1>User 1</h1>
                    </div>
                    <div className="w-[50%] flex justify-end" >
                        <button className="rounded bg-black text-white" style={{padding: "4px 10px"}}>Send Money</button>
                    </div>
                </div>

                <div className="flex" >
                    <div className="w-[50%] flex gap-4" >
                        <button className="w-8 h-8 border rounded-full" >U2</button>
                        <h1>User 2</h1>
                    </div>
                    <div className="w-[50%] flex justify-end" >
                        <button className="rounded bg-black text-white" style={{padding: "4px 10px"}}>Send Money</button>
                    </div>
                </div>
                
                <div className="flex" >
                    <div className="w-[50%] flex gap-4" >
                        <button className="w-8 h-8 border rounded-full" >U2</button>
                        <h1>User 2</h1>
                    </div>
                    <div className="w-[50%] flex justify-end" >
                        <button className="rounded bg-black text-white" style={{padding: "4px 10px"}}>Send Money</button>
                    </div>
                </div>
            </div>
        </div>
    )
}