import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer} from '@react-three/postprocessing'
import { useContext, useRef } from "react";
import { Mesh, TextureLoader, Vector3 } from "three";
import './galaxy.scss';
import { OrbitControls, Text } from '@react-three/drei'
import type { AsteroidType, Position } from "../../Contexts/Asteroids";
import AsteroidsContext from "../../Contexts/Asteroids";
import { useState } from "react";
import { type OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { filters } from "../../functions/Filters";
import FilterContext from "../../Contexts/Filter";

const AU = 200;

const Earth = ({changeTarget}: {changeTarget: (position: Position) => void}) => {
    const earthRef = useRef<Mesh>(null);
    const [earthTexture, earthEmissiveMap, earthNormalMap, earthRoughnessMap] = useLoader(TextureLoader, ["/textures/earth_daymap.jpg","/textures/earth_nightmap.jpg","/textures/earth_normal_map.jpg","/textures/earth_specular_map.jpg"])
    useFrame((state) => {
        if(earthRef.current){
            const distance = state.camera.position.distanceTo(earthRef.current.position);
            const newScale = Math.max(1, distance);
            earthRef.current.scale.set(newScale,newScale,newScale);
        }
    })
    return(
        <group rotation={[0,0,-23.45 * Math.PI/ 180]} onClick={() => {changeTarget({x: 0, y: 0, z: 0})}}>
            <mesh ref={earthRef} >
                <sphereGeometry args={[0.0085, 64, 64]} />
                <meshStandardMaterial map={earthTexture} emissiveMap={earthEmissiveMap} emissive={"white"} emissiveIntensity={0.5} normalMap={earthNormalMap} roughnessMap={earthRoughnessMap} roughness={1}/>
            </mesh>
        </group>
    )
}

const Sun = () => {
    const sunRef = useRef<Mesh>(null);
    const [sunTexture] = useLoader(TextureLoader, ["/textures/sunTexture.jpg"])
    return(
        <mesh ref={sunRef} position={[AU,0,0]}>
            <pointLight position={[0,0,0]}  intensity={100000} color={"#fff"}/>
            <sphereGeometry args={[10, 24, 24]} />
            <meshBasicMaterial color={"yellow"} map={sunTexture} opacity={0.1}/>
        </mesh>
    )
}


const AsteroidModel = ({asteroid, changeTarget}: {asteroid: AsteroidType, changeTarget: (position: Position) => void}) => {
    
    if(!asteroid.position || !asteroid.visible) return null;
    const text = useRef<Mesh>(null)
    const groupRef = useRef<Mesh>(null);



    useFrame((state) => {
        if(text.current && groupRef.current){
            const distance = state.camera.position.distanceTo(groupRef.current.position);
            const newScale = Math.max(0.0625, distance * 0.25);
            groupRef.current.scale.set(newScale,newScale,newScale);
            text.current.lookAt(state.camera.position);
        }
    })
    return(
        <group key={asteroid.id} ref={groupRef}  position={[asteroid.position?.x * AU,asteroid.position?.y * AU,asteroid.position?.z * AU]} >
            <mesh onClick={() => {changeTarget(asteroid.position || {x: 0, y: 0, z:0})}}>
                <meshBasicMaterial color={asteroid.color}  opacity={1}/>
                <sphereGeometry args={[0.02, 64, 64]}/>
            </mesh>
            <Text ref={text} font={'/fonts/JetBrainsMono-ExtraLight.ttf'} anchorY={"bottom"} fontSize={0.07} position={[0,0.02,0]}>{asteroid.name}</Text>
        </group>
        
    )
}

const TargetControls = ({target}: {target: Vector3}) => {
    const controls = useRef<OrbitControlsImpl>(null);

    useFrame(() => {
        if (controls.current) {
            const distance = controls.current.target.distanceTo(target);
            if (distance > 0.001) {
                controls.current.target.lerp(target, 0.1); 
                
                controls.current.update(); 
            }
        }
    });

    return <OrbitControls ref={controls} minDistance={0.03}/>;
}


const Galaxy = () => {
    const {asteroids} = useContext(AsteroidsContext);
    const [target, setTarget] = useState(new Vector3(0,0,0));
    const {filter} = useContext(FilterContext);
    const changeTarget = (position: Position) => {
        setTarget(new Vector3(position.x * AU, position.y * AU, position.z * AU));
    }
    return(
        <Canvas className="galaxy" camera={{near: 0.001, position: [0.04,0,0]}}>
            <Sun/>
            <Earth changeTarget={changeTarget}/>
            {asteroids.filter((x) => filters(filter,x)).map((asteroid, key) => (
                <AsteroidModel key={key} asteroid={asteroid} changeTarget={changeTarget}/>
            ))}
            <TargetControls target={target}/>
            <EffectComposer>
                <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} />
            </EffectComposer>
        </Canvas>
    )
}
export default Galaxy;