import axios from "axios";
import { useState, useEffect } from "react";
import 'index.css'

const App = () => {
  const [fact,setFact] = useState()
  
  useEffect(()=> {
    const getCatFacts = async ()=>{
      try{
        const response = await axios.get('https://catfact.ninja/fact')
        setFact(response.data)
       }
       catch(err){
         console.error(err)
       }
    }
    
    getCatFacts()
  },[])

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center">
      <h1 className="text-5xl">Generate An Excuse</h1>
      <div className="flex flex-col my-10 space-y-8 w-20">
        <button className="bg-gray-500">Party</button>
        <button className="button bg-gray-500">Family</button>
        <button className="button bg-gray-500">Office</button>
      </div>
      <p></p>
            
    </div>
  );
};

export default App;
