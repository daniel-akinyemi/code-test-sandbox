import { data } from '../src/MockData'
import User from './User'

const Users = () => {
  return (
  <div className='grid grid-cols-4'>
    {data.map((item =>(

    <div key={item.id}>
        <User firstName={item.first_name} lastName={item.last_name} occupation={item.occupation}/>
    </div>
    )))}
   </div>
  )
}

export default Users