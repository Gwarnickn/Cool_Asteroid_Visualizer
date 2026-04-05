import type { FilterType } from "../Contexts/Filter";
import type { AsteroidType } from "../Contexts/Asteroids";
import {AsteroidSizes} from "../Contexts/Asteroids";

export const filters = (filter: FilterType,asteroid: AsteroidType) => {
    let matchsize = 0;
    matchsize += filter.small ? asteroid.size === AsteroidSizes.SMALL ? 1 : 0 : 0;
    matchsize += filter.medium ? asteroid.size === AsteroidSizes.MEDIUM ? 1 : 0 : 0;
    matchsize += filter.big ? asteroid.size === AsteroidSizes.BIG ? 1 : 0 : 0;

    return (
        filter.hazardous ? asteroid.hazardous : true) && 
        (filter.sentry ? asteroid.sentry : true) && 
        (filter.speed ? (asteroid.velocity > filter.minSpeed && asteroid.velocity < filter.maxSpeed) : true) &&
        ((filter.big === filter.medium && filter.medium === filter.small) || matchsize === 1
    )
}