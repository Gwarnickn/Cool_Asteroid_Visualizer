import { createContext } from "react";

export enum AsteroidSizes {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    BIG = "BIG"
}

export type AsteroidType = {
    id: string,
    name: string,
    hazardous: boolean,
    sentry: boolean,
    visible: boolean,
    size: AsteroidSizes,
    date: string,
    velocity: number,
    average_diameter: number,
    absolute_magnitude_h: number,
    estimated_diameter: {
        min: number,
        max: number,
    }
} 


type AsteroidsContextType = {
    asteroids: AsteroidType[],
    setAsteroids: React.Dispatch<React.SetStateAction<AsteroidType[]>>
}

const iAsteroidsContextState = {
    asteroids: [],
    setAsteroids: () => {}
}

const AsteroidsContext = createContext<AsteroidsContextType>(iAsteroidsContextState)

export default AsteroidsContext