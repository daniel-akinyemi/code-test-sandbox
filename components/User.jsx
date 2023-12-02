const User = ({firstName,lastName,occupation}) => {
  return (
    <div className="h-[240px] bg-gray-100 mt-8 px-4 py-4 rounded-md mx-4">
        <div className="flex items-center justify-center">
            <div className='bg-gray-500 rounded-full w-24 h-24'></div>
        </div>
        <div className="flex space-x-1 mt-4 justify-center">
            <div className="name  text-xl text-center font-bold ">{firstName} {lastName}</div>
        </div>
        <div>
        <div className="occupation text-center">{occupation}</div>
        </div>
    </div>
  )
}

export default User