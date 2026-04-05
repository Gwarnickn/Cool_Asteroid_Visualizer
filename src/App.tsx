
import './App.scss'
import Dashboard from './Components/Dashboard/Dashboard'
import Galaxy from './Components/Galaxy/Galaxy'
import { useState } from 'react'
import AsteroidsContext, { type AsteroidType } from './Contexts/Asteroids'
import type { FilterType } from './Contexts/Filter'
import FilterContext from './Contexts/Filter'
function App() {
  const [asteroids, setAsteroids] = useState<AsteroidType[]>([]);
  const [filter, setFilter] = useState<FilterType>({
    hazardous: false,
    sentry: false,
    speed: false,
    minSpeed: 0,
    maxSpeed: 0,
    small: false,
    medium: false,
    big: false,
  });
  return (
    <div className='main'>
      <AsteroidsContext.Provider value={{asteroids,setAsteroids}}>
        <FilterContext.Provider value={{filter, setFilter}}>
          <Galaxy/>
          <Dashboard/>
        </FilterContext.Provider>
      </AsteroidsContext.Provider>
    </div>
  )
}

export default App
