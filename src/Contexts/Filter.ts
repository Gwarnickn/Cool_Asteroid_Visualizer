import { createContext } from "react";

export type FilterType = {
    hazardous: boolean;
    sentry: boolean;
    speed: boolean;
    minSpeed: number;
    maxSpeed: number;
    small: boolean;
    medium: boolean;
    big: boolean;
};

type FilterContextType = {
    filter: FilterType;
    setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

const iFilterContextState: FilterContextType = {
    filter: {
        hazardous: false,
        sentry: false,
        speed: false,
        minSpeed: 0,
        maxSpeed: 0,
        small: false,
        medium: false,
        big: false,
    },
    setFilter: () => {}
};

const FilterContext = createContext<FilterContextType>(iFilterContextState);

export default FilterContext;