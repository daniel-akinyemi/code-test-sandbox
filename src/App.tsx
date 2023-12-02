import Header from "../components/Header";
import Users from "../components/Users";


const App = () => {

  return (
    <div className="max-w-[1480px] mx-auto flex flex-col items-center my-8">
      <Header/>
      <Users/>     
    </div>
  );
};

export default App;
