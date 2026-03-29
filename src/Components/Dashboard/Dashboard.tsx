import { useContext, useRef, useState, type CSSProperties } from "react";
import api from "../../api/ApiService";
import type { AsteroidType } from "../../Contexts/Asteroids";
import "./dashboards.scss";
import { AxiosError } from "axios";
import AsteroidsContext, { AsteroidSizes } from "../../Contexts/Asteroids";
import Asteroid from "./Asteroid";
import { Checkbox } from "../Checkbox/Checkbox";
import { BadgeColor } from "./Asteroid";

const Dashboard = () => {
    const [expanded, setExpanded] = useState(false);
    const canChangeExpand = useRef(true);
    const {asteroids, setAsteroids} = useContext(AsteroidsContext);
    const [filter, setFilter] = useState<{hazardous: boolean, sentry: boolean, speed: boolean, minSpeed: number, maxSpeed: number, small: boolean, medium: boolean, big: boolean}>({
        hazardous: false,
        sentry: false,
        speed: false,
        minSpeed: 0,
        maxSpeed: 0,
        small: false,
        medium: false,
        big: false,
    });
    const [tak, setTak] = useState(false);
    const handleClick = async () => {
        try{
            const response = await api.getExample();
            const combined: AsteroidType[] = [];
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
                        visible: true,
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

    const filters = (asteroid: AsteroidType) => {
        let matchsize = 0;
        matchsize += filter.small ? asteroid.size === AsteroidSizes.SMALL ? 1 : 0 : 0;
        matchsize += filter.medium ? asteroid.size === AsteroidSizes.MEDIUM ? 1 : 0 : 0;
        matchsize += filter.big ? asteroid.size === AsteroidSizes.BIG ? 1 : 0 : 0;

        return (filter.hazardous ? asteroid.hazardous : true) && 
        (filter.sentry ? asteroid.sentry : true) && 
        (filter.speed ? (asteroid.velocity > filter.minSpeed && asteroid.velocity < filter.maxSpeed) : true) &&
        ((filter.big === filter.medium && filter.medium === filter.small) || matchsize === 1)
    }


    return (
        <div className="dashboard">
            <button className="TEST" onClick={handleClick}>XD</button>
            <div className={`right-section blur-background ${expanded && "expanded"}`}>
                <div className="expand-block blur-background" onClick={handleExpandClick}>
                    {expanded ? "<<" : ">>"}
                </div>
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
                    <div className="speed-filter">
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
                <div className="section-results">results: {asteroids.filter((asteroid) => filters(asteroid)).length}</div>
                <div className="asteroids-container">
                    {asteroids.filter((asteroid) => filters(asteroid)).map((asteroid) => (
                        <Asteroid asteroid={asteroid}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Dashboard;