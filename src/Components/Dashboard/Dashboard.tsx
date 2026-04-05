import { useContext, useEffect, useRef, useState, type CSSProperties } from "react";
import api from "../../api/ApiService";
import type { AsteroidType } from "../../Contexts/Asteroids";
import "./dashboards.scss";
import { AxiosError } from "axios";
import AsteroidsContext, { AsteroidSizes } from "../../Contexts/Asteroids";
import Asteroid from "./Asteroid";
import { Checkbox } from "../Checkbox/Checkbox";
import { BadgeColor } from "./Asteroid";
import Select from 'react-select'
import Button from "../Button/Button";
import Ascending from '../../assets/svg/sorter-ascending.svg?react';
import Descending from '../../assets/svg/sorter-descending.svg?react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FilterContext from "../../Contexts/Filter";
import { filters } from "../../functions/Filters";
import Visible from '../../assets/svg/eye.svg?react';
import NotVisible from '../../assets/svg/eye-off.svg?react';
import Search from '../../assets/svg/search.svg?react';
import List from '../../assets/svg/list.svg?react';
import { OrbitProgress } from "react-loading-indicators";
import uniqolor from "uniqolor";

type SortOption = {
    value: keyof AsteroidType | 'NONE'; 
    label: string;
};

const options: SortOption[] = [
  { value: 'NONE', label: 'Select' },
  { value: 'average_diameter', label: 'Diameter' },
  { value: 'velocity', label: 'Velocity' },
  { value: 'absolute_magnitude_h', label: 'Magnitude' },
];

const maxDate = new Date("2200-21-31")
const minDate = new Date("1900-1-1")

const Dashboard = () => {
    const [expanded, setExpanded] = useState(false);
    const [dateRange, setDateRange] = useState<{startDate: Date, endDate: Date}>({startDate: new Date(), endDate: new Date()});
    const canChangeExpand = useRef(true);
    const {asteroids, setAsteroids} = useContext(AsteroidsContext);
    const {filter, setFilter} = useContext(FilterContext);
    const [sorter, setSorter] = useState<{option: {value: string, label: string}, isDescending: boolean}>({option: options[0], isDescending: false});
    const [allVisible, setAllVisible] = useState<boolean>(false);
    const [isPending, setPending] = useState(false);
    const [exampleExpanded, setExampleExpanded] = useState(false);

    const handleClick = async () => {
        try{
            const response = await api.getAsteroids(dateRange.startDate,dateRange.endDate);
            const combined: AsteroidType[] = [];
            console.log(response);
            Object.keys(response.near_earth_objects).forEach((key) => {
                response.near_earth_objects[key].map((asteroid: any) => {
                    const average_diameter = (asteroid.estimated_diameter.kilometers.estimated_diameter_min + asteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2;
                    const size = average_diameter > 0.05 ? (average_diameter > 1 ? AsteroidSizes.BIG : AsteroidSizes.MEDIUM) : AsteroidSizes.SMALL;
                    combined.push({
                        id: asteroid.id,
                        name: asteroid.name,
                        hazardous: asteroid.is_potentially_hazardous_asteroid,
                        sentry: asteroid.is_sentry_object,
                        absolute_magnitude_h: asteroid.absolute_magnitude_h,
                        size,
                        volume: (4/3*Math.PI*Math.pow((average_diameter * 1000),3)),
                        average_diameter,
                        velocity: asteroid.close_approach_data[0].relative_velocity.kilometers_per_second,
                        date: asteroid.close_approach_data[0].close_approach_date,
                        visible: false,
                        color: uniqolor.random({differencePoint: 0}).color,
                        miss_distance: asteroid.close_approach_data[0].miss_distance.kilometers,
                        details: null,
                        estimated_diameter:{
                            min: asteroid.estimated_diameter.kilometers.estimated_diameter_min,
                            max: asteroid.estimated_diameter.kilometers.estimated_diameter_max,
                        }
                    })
                })
            });
            setAsteroids(combined);
        }catch(err){
            const error = err as AxiosError;
            console.error(error);
        }
    }

    const handleExpandClick = () => {
        if(canChangeExpand.current){
            canChangeExpand.current = false;
            setExpanded(!expanded);
            setTimeout(() => {
                canChangeExpand.current = true;
            },500)
        }
    }

    const handleShowAll = async () => {
        const newVisible = !allVisible;
        if(newVisible){
            const newAsteroids:AsteroidType[] = [];
            for(const asteroid of asteroids){
                setPending(true)
                if(!asteroid.position){
                    try{
                        const response = await api.getVectors(asteroid.id, asteroid.date);
                        const parts = response.split(/\$\$SOE|\$\$EOE/);
                        const vectors = parts[1].split(/X =|Y =|Z =|\n/);
                            
                        newAsteroids.push({...asteroid, position: {x: parseFloat(vectors[3]), y: parseFloat(vectors[4]),z: parseFloat(vectors[5])}, visible: true})
                        await new Promise(resolve => setTimeout(resolve, 250));
                    }catch(err){
                        const error = err as AxiosError;
                        console.error(error);
                    }
                }else{
                    newAsteroids.push({...asteroid, visible: true})
                }
            }
            setAsteroids(newAsteroids);
            setAllVisible(newVisible);
            setPending(false);
        }else{
            const newAsteroids = asteroids.map((asteroid) => {
                return {...asteroid, visible: false};
            })
            setAsteroids(newAsteroids);
            setAllVisible(newVisible);
        }
    }

    useEffect(() => {
        handleClick();
    },[])



    return (
        <div className="dashboard">
            
            <div className="date-picker blur-background">
                <div className="date-picker-top">
                    <Button className="blur-background" onClick={() => {setExampleExpanded(!exampleExpanded)}}><List/></Button>
                    <DatePicker dateFormat="dd-MM-yyyy" minDate={minDate} maxDate={maxDate} selected={dateRange.startDate} onChange={(date: Date | null) => {date ? setDateRange({startDate: date, endDate: dateRange.endDate.getTime() - date.getTime() > 518400000 ? new Date(date.getTime() + 518400000) : (date.getTime() > dateRange.endDate.getTime() ? date : dateRange.endDate)}) : null}} startDate={dateRange.startDate} endDate={dateRange.endDate} selectsStart/>
                    <span>-</span>
                    <DatePicker dateFormat="dd-MM-yyyy"  minDate={dateRange.startDate} maxDate={dateRange.startDate.getTime() + 518400000 > maxDate.getTime() ? maxDate : new Date(dateRange.startDate.getTime() + 518400000)} selected={dateRange.endDate} onChange={(date: Date | null) => {date ? setDateRange({...dateRange, endDate: date}) : null}} startDate={dateRange.startDate} endDate={dateRange.endDate} selectsEnd/>
                    <Button className="blur-background" onClick={handleClick}><Search/></Button>
                </div>
                {exampleExpanded && <div className="example-dates">
                    <Button className="blur-background" onClick={() => {setDateRange({startDate: new Date(2017, 8, 2), endDate: new Date(2017, 8, 2)})}}>Florence - Giant Rock [02-09-2017]</Button>
                    <Button className="blur-background" onClick={() => {setDateRange({startDate: new Date(2029, 3, 14), endDate: new Date(2029, 3, 14)})}}>Apophis - Scary Friday [14-04-2029]</Button>
                    <Button className="blur-background" onClick={() => {setDateRange({startDate: new Date(1999, 8, 23), endDate: new Date(1999, 8, 23)})}}>Bennu - Dirt Thief [23-09-1999]</Button>
                    <Button className="blur-background" onClick={() => {setDateRange({startDate: new Date(2020, 10, 30), endDate: new Date(2020, 10, 30)})}}>2000 WO 107 (X-Type) [29-11-2020]</Button>
                </div>}
            </div>
            
            <div className={`right-section blur-background ${expanded && "expanded"}`}>
                <Button className="expand-block blur-background" onClick={handleExpandClick}>
                    {expanded ? "<<" : ">>"}
                </Button>
                <div className="section-header">Asteroids</div>
                <div className="section-filters">
                    <div className="spacer">
                        <div className="spacer-text blur-background">Type</div>
                        <div className="line"/>
                    </div>
                    <div className="filter-container">
                        <Checkbox value={filter.hazardous == true} onClick={() => {setFilter({...filter,hazardous: !filter.hazardous})}}>
                            <div className="badge blur-background" style={BadgeColor["orange"] as CSSProperties}>Hazardous</div>
                        </Checkbox>
                        <Checkbox value={filter.sentry == true} onClick={() => {setFilter({...filter,sentry: !filter.sentry})}}>
                            <div className="badge blur-background" style={BadgeColor["blue"]  as CSSProperties}>Sentry</div>
                        </Checkbox>
                    </div>
                    <div className="spacer">
                        <div className="spacer-text blur-background">Speed</div>
                        <div className="line"/>
                    </div>
                    <div className={`speed-filter ${filter.speed && "active"}`}>
                        <input placeholder="min" type="number" min={0} max={1000} value={filter.minSpeed} onChange={(e) => {setFilter({...filter, minSpeed: parseFloat(e.target.value)})}}/> 
                        - 
                        <input placeholder="max" type="number" min={0} max={1000} value={filter.maxSpeed} onChange={(e) => {setFilter({...filter, maxSpeed: parseFloat(e.target.value)})}}/> [km/s]
                        <Checkbox value={filter.speed == true} onClick={() => {setFilter({...filter,speed: !filter.speed})}}/>
                    </div>
                    <div className="spacer">
                        <div className="spacer-text blur-background">Size</div>
                        <div className="line"/>
                    </div>
                    <div className="filter-container">
                        <Checkbox value={filter.small} onClick={() => {setFilter({...filter, small: !filter.small})}}>
                            Small
                        </Checkbox>
                        <Checkbox value={filter.medium} onClick={() => {setFilter({...filter, medium: !filter.medium})}}>
                            Medium
                        </Checkbox>
                        <Checkbox value={filter.big} onClick={() => {setFilter({...filter, big: !filter.big})}}>
                            Big
                        </Checkbox>
                    </div>
                </div>
                <div className="section-results">results: {asteroids.filter((asteroid) => filters(filter,asteroid)).length}</div>
                <div className="sorting-container">
                    <Button className={`blur-background`} onClick={handleShowAll}>{isPending ?  <OrbitProgress dense color="#ffffff" size="medium" text="" textColor="" /> : allVisible ? <Visible/> : <NotVisible/>}</Button>                
                    <Select options={options} className={`react-select-container ${sorter.option.value !== 'NONE' && "react-select-full"}`}  classNamePrefix="react-select" value={sorter.option} onChange={(e) => {setSorter({...sorter, option: e ? {label: e?.label, value: e?.value} : options[0]})}}/>
                    <Button className={`${sorter.option.value !== options[0].value && "blur-background"}`} onClick={() => {setSorter({...sorter, isDescending: !sorter.isDescending})}}>{sorter.isDescending ? <Descending/> : <Ascending/>}</Button>                
                </div>
                <div className="asteroids-container">
                    {asteroids.filter((asteroid) => filters(filter,asteroid)).sort((a: AsteroidType,b: AsteroidType) => {
                        if(sorter.option.value === "NONE" ) return 0
                        const sortBy = sorter.option.value as keyof AsteroidType;
                        const aValue = a[sortBy] as number;
                        const bValue = b[sortBy] as number;
                        return sorter.isDescending ? bValue - aValue : aValue - bValue;
                    }).map((asteroid, key) => (
                        <Asteroid asteroid={asteroid} key={key}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Dashboard;