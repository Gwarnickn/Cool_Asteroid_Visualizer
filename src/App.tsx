
import './App.scss'
import Dashboard from './Components/Dashboard/Dashboard'
import Galaxy from './Components/Galaxy/Galaxy'
import { useState } from 'react'
import AsteroidsContext, { type AsteroidType } from './Contexts/Asteroids'
function App() {
  const [asteroids, setAsteroids] = useState<AsteroidType[]>([]);
  return (
    <div className='main'>
      <AsteroidsContext.Provider value={{asteroids,setAsteroids}}>
        {/* <Galaxy/> */}
        <Dashboard/>
      </AsteroidsContext.Provider>
    </div>
  )
}

export default App
