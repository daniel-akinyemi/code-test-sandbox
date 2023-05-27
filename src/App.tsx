const App = () => {

  const planets = [
    {name:'Mars', isGasPlanet:false},
    {name:'Earth', isGasPlanet:false},
    {name:'Jupiter', isGasPlanet:true},
    {name:'Venus', isGasPlanet:false},
    {name:'Neptune', isGasPlanet:true},
    {name:'Uranus', isGasPlanet:true},
  ];
  return (
    <div>
      {planets.map((planet,key) =>{
        <div key={key}> {planet.isGasPlanet} && {planet.name}</div>
      })}
    </div>
  )
}

export default App