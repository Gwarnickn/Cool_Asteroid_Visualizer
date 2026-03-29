import { useContext, useRef, useState, type CSSProperties } from "react";
import api from "../../api/ApiService";
import type { AsteroidType } from "../../Contexts/Asteroids";
import "./dashboards.scss";
import { AxiosError } from "axios";
import AsteroidsContext, { AsteroidSizes } from "../../Contexts/Asteroids";
import AsteroidBig from '../../assets/svg/asteroid-big.svg?react';
import AsteroidMedium from '../../assets/svg/asteroid-medium.svg?react';
import AsteroidSmall from '../../assets/svg/asteroid-small.svg?react';
import ArrowLeft from '../../assets/svg/arrow-left.svg?react';
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
type AsteroidProps = {
    asteroid: AsteroidType
} 

const AsteroidIcon: Record<AsteroidSizes, React.ReactNode> = {
    [AsteroidSizes.SMALL]: <AsteroidSmall/>,
    [AsteroidSizes.MEDIUM]: <AsteroidMedium/>,
    [AsteroidSizes.BIG]: <AsteroidBig/>,
}

const BadgeColor: Record<string, object> = {
    "orange": {"--white-op30":"rgba(255, 198, 26,0.3)","--gradient-start":"rgba(255, 198, 26,0.20)","--gradient-end":"rgba(255, 198, 26,0.5)"},
    "blue": {"--white-op30":"rgba(0,0,255,0.3)","--gradient-start":"rgba(0,0,255,0.20)","--gradient-end":"rgba(0,0,255,0.5)"},
    "red": {"--white-op30":"rgba(255,0,0,0.3)","--gradient-start":"rgba(255,0,0,0.20)","--gradient-end":"rgba(255,0,0,0.5)"}
}


const Asteroid = ({asteroid}: AsteroidProps) => {
    const [isModalOpen, setModalOpen] = useState(false);
    return (
        <div className="asteroid">
            <div className="asteroid-icon">{AsteroidIcon[asteroid.size]}</div>
            <div className="asteroid-name">{asteroid.name}</div>
            <div className="asteroid-badges">
                {asteroid.size == AsteroidSizes.MEDIUM && <div className="badge blur-background" style={BadgeColor["red"]  as CSSProperties}>
                    {asteroid.average_diameter > 140 ? (asteroid.average_diameter > 1000 ? (asteroid.average_diameter > 2000 ? "Mass Extinction" : "Civilization Ender") : "Continent Killer") : "City Killer"}
                </div>}
                {asteroid.hazardous && <div className="badge blur-background" style={BadgeColor["orange"] as CSSProperties}>
                    Hazardous
                </div>}
                {asteroid.sentry && <div className="badge blur-background" style={BadgeColor["blue"]  as CSSProperties}>
                    Sentry
                </div>}
            </div>
            <Button className="asteroid-button" onClick={(e) => {setModalOpen(true);console.log("XD");e.preventDefault();e.stopPropagation();}}>Details</Button>
            <Modal isOpen={isModalOpen} handleClose={() => {setModalOpen(false)}}>TEST</Modal>
        </div>
    )
}


const Dashboard = () => {
    const [expanded, setExpanded] = useState(false);
    const canChangeExpand = useRef(true);
    const {asteroids, setAsteroids} = useContext(AsteroidsContext);
    const handleClick = async () => {
        try{
            const response = await api.getExample();
            console.log(response);
            const combined: AsteroidType[] = [];
            Object.keys(response.near_earth_objects).forEach((key) => {
                response.near_earth_objects[key].map((asteroid: any) => {
                    const average_diameter = (asteroid.estimated_diameter.kilometers.estimated_diameter_min + asteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2 + 49.5;
                    const size = average_diameter > 50 ? (average_diameter > 1000 ? AsteroidSizes.BIG : AsteroidSizes.MEDIUM) : AsteroidSizes.SMALL;
                    combined.push({
                        id: asteroid.id,
                        name: asteroid.name,
                        hazardous: asteroid.is_potentially_hazardous_asteroid,
                        sentry: asteroid.is_sentry_object,
                        absolute_magnitude_h: asteroid.absolute_magnitude_h,
                        size,
                        average_diameter,
                        velocity: asteroid.close_approach_data[0].relative_velocity.kilometers_per_second,
                        date: asteroid.close_approach_data[0].close_approach_date,
                        visible: true,
                        estimated_diameter:{
                            min: asteroid.estimated_diameter.kilometers.estimated_diameter_min,
                            max: asteroid.estimated_diameter.kilometers.estimated_diameter_max,
                        }
                    })
                })
            });
            console.log(combined);
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


    return (
        <div className="dashboard">
            <button className="TEST" onClick={handleClick}>XD</button>
            <div className={`right-section blur-background ${expanded && "expanded"}`}>
                <div className="expand-block blur-background" onClick={handleExpandClick}>
                    {expanded ? "<<" : ">>"}
                </div>
                <div className="section-header">Asteroids</div>
                <div className="section-results">results: {asteroids.length}</div>
                <div className="asteroids-container">
                    {asteroids.map((asteroid) => (
                        <Asteroid asteroid={asteroid}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Dashboard;