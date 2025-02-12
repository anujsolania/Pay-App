export function Appbar() {
    return (
    <div style={{ padding: "2%"}}  >
        <div className="flex w-full" > 
        <div className="w-[50%] text-2xl font-extrabold" >
            <h1>Payments App</h1>
        </div>
        <div className="w-[50%] flex items-center justify-end gap-3" >
            <p>Hello, User</p>
            <button className="w-8 h-8 border rounded-full">U</button>
        </div>
        </div> 
    </div>
    )
}