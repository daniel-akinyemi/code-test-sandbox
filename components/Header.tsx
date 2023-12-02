import Filter from "./Filter"


const Header = ()=>{
    return(
        <div className="bg-gray-700 py-4 px-4">
            <header className="header flex space-x-24  mx-auto">
                <div>
                    <img src="vite.svg" />
                </div>
                <div className="flex flex-col justify-center text-white">
                    <span>Discover and connect</span>
                </div>
                <div className="flex flex-col justify-center">
                    <Filter/>
                </div>
            </header>
        </div>
    )
}

export default Header