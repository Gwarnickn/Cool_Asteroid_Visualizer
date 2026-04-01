import AsteroidBig from '../../assets/svg/asteroid-big.svg?react';
import AsteroidMedium from '../../assets/svg/asteroid-medium.svg?react';
import AsteroidSmall from '../../assets/svg/asteroid-small.svg?react';
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import api from "../../api/ApiService";
import { AxiosError } from "axios";
import { AsteroidSizes, type AsteroidType } from '../../Contexts/Asteroids';
import { useContext, useState, type CSSProperties } from "react";
import AsteroidsContext from '../../Contexts/Asteroids';
import AsteroidPreview from './AsteroidPreview';
import Visible from '../../assets/svg/eye.svg?react';
import NotVisible from '../../assets/svg/eye-off.svg?react';

type AsteroidProps = {
    asteroid: AsteroidType
} 

const AsteroidIcon: Record<AsteroidSizes, React.ReactNode> = {
    [AsteroidSizes.SMALL]: <AsteroidSmall/>,
    [AsteroidSizes.MEDIUM]: <AsteroidMedium/>,
    [AsteroidSizes.BIG]: <AsteroidBig/>,
}

type DetailsType = {
    name: string,
    density: number,
    pricePerKg: number,
    elements: {[key: string]: number}[],
}
// BASED on 29.03.2026 data
const AsteroidDetails: Record<string, DetailsType> = {
    "c": {name: "", density: 1380,  elements: [{water: 0.15},{carbon: 0.04}],pricePerKg: 0.0025},
    "s": {name: "", density: 2710, elements: [{iron: 0.108},{nickel: 0.0108},{cobalt: 0.0006}],pricePerKg: 0.2312196},
    "m": {name: "", density: 5320, elements: [{iron: 0.88},{nickel: 0.09},{cobalt: 0.005}],pricePerKg: 1.924706},
    "v": {name: "", density: 1380, elements: [{calcium: 0.105},{aluminum: 0.0125}],pricePerKg: 6.341},
    "q": {name: "", density: 3300, elements: [{iron: 0.105},{nickel: 0.013}],pricePerKg: 0.235011},
    "u": {name: "Unknown", density: 2000, elements: [],pricePerKg: 1},
}

export const BadgeColor: Record<string, object> = {
    "orange": {"--white-op30":"rgba(255, 198, 26,0.3)","--gradient-start":"rgba(255, 198, 26,0.20)","--gradient-end":"rgba(255, 198, 26,0.5)"},
    "blue": {"--white-op30":"rgba(0,0,255,0.3)","--gradient-start":"rgba(0,0,255,0.20)","--gradient-end":"rgba(0,0,255,0.5)"},
    "red": {"--white-op30":"rgba(255,0,0,0.3)","--gradient-start":"rgba(255,0,0,0.20)","--gradient-end":"rgba(255,0,0,0.5)"}
}


const Asteroid = ({asteroid}: AsteroidProps) => {
    const {asteroids,setAsteroids} = useContext(AsteroidsContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const badge = (
        <div className="asteroid-badges">
            {asteroid.average_diameter > 0.1 && <div className="badge blur-background" style={BadgeColor["red"]  as CSSProperties}>
                {asteroid.average_diameter > 0.14 ? (asteroid.average_diameter > 1 ? (asteroid.average_diameter > 2 ? "Mass Extinction" : "Civilization Ender") : "Continent Killer") : "City Killer"}
            </div>}
            {asteroid.hazardous && <div className="badge blur-background" style={BadgeColor["orange"] as CSSProperties}>
                Hazardous
            </div>}
            {asteroid.sentry && <div className="badge blur-background" style={BadgeColor["blue"]  as CSSProperties}>
                Sentry
            </div>}
        </div>
    )


    const handleDetailsClick = async () => {
        if(!asteroid.details){
            try{
                const response = await api.getDetails(asteroid.id);
                let type = "u";
                if(response.phys_par){
                    const param = response.phys_par.find((param: {name: string}) => param.name == "spec_B" || param.name == "spec_T");
                    if(param){
                        type = param.value;
                    }
                }
                const tempAsteroids = asteroids;
                tempAsteroids.map((x) => {
                    if(x.id == asteroid.id){
                        x.details = {type}
                    }
                });
                setAsteroids(tempAsteroids);
            }catch(err){
                const error = err as AxiosError;
                console.error(error);
            }
        }
        setModalOpen(true)
    }

    const handleVisibleClick =  async () => {
        if(!asteroid.position){
            console.log(asteroid.id)
            try{
                const response = await api.getVectors(asteroid.id, asteroid.date);
                console.log(asteroid.id)
                const parts = response.split(/\$\$SOE|\$\$EOE/);
                console.log(parts[1])
            }catch(err){
                const error = err as AxiosError;
                console.error(error);
            }
        }
            const tempAsteroids = asteroids.map((x) => {
                if(x.id == asteroid.id){
                    return {...x, visible: !x.visible}
                }
                return x
            });
            setAsteroids(tempAsteroids);
            console.log(asteroids);
    }


    return (
        <div className="asteroid" key={asteroid.id + asteroid.visible && "visible"}>
            <div className="asteroid-icon">{AsteroidIcon[asteroid.size]}</div>
            <div className="asteroid-name">{asteroid.name}</div>
            {badge}
            <Button className="asteroid-button blur-background" onClick={handleDetailsClick}>Details</Button>
            <Button className="asteroid-visible" onClick={handleVisibleClick}>{asteroid.visible ? <Visible className="visible"/> : <NotVisible/>}</Button>
            <Modal isOpen={isModalOpen} handleClose={() => {setModalOpen(false)}}>
                <div className="asteroid-details">
                    <AsteroidPreview type={asteroid.details?.type[0]}/>
                    <div className="details-header">
                        {asteroid.name}
                        {badge}
                    </div>
                    {asteroid.details?.type && <>
                        <div className="details-type">type: {AsteroidDetails[asteroid.details?.type[0].toLocaleLowerCase()].name}</div>
                        <div className="details-type">velocity: {Math.round(asteroid.velocity * 100) / 100} km/s</div>
                        <div className="details-type">magnitude: {asteroid.absolute_magnitude_h}</div>
                        <div className="details-type">volume: ~{asteroid.volume.toExponential(5)} m<sup>3</sup></div>
                        <div className="details-type">density: {AsteroidDetails[asteroid.details?.type[0].toLocaleLowerCase()].density} kg/m<sup>3</sup></div>
                        <div className="details-type">composition: {AsteroidDetails[asteroid.details?.type[0].toLocaleLowerCase()].elements.length > 0 ? AsteroidDetails[asteroid.details?.type[0].toLocaleLowerCase()].elements.map((element) => {
                            const [elementName, elementValue] = Object.entries(element)[0];
                            return(
                                <li>{elementName}: {elementValue* 100}%</li>
                            )
                        }): "unknown"}</div>
                        <div className="details-price">
                            <div className="details-separate"><span>mass:</span> <span>~{(asteroid.volume * AsteroidDetails[asteroid.details?.type[0].toLocaleLowerCase()].density).toExponential(5)}  kg ‎ ‎</span></div>
                            <div className="details-separate"><span>price per kg:</span> <span>~{Math.round(AsteroidDetails[asteroid.details?.type[0].toLocaleLowerCase()].pricePerKg * 100) / 100} $/kg</span></div>
                            <div className="details-separate"><span>price:</span> <span>{(asteroid.volume * AsteroidDetails[asteroid.details?.type[0].toLocaleLowerCase()].density) * AsteroidDetails[asteroid.details?.type[0].toLocaleLowerCase()].pricePerKg} <span className="money">$$$</span> ‎</span></div>
                        </div>
                    </>}

                </div>
            </Modal>
        </div>
    )
}
export default Asteroid;