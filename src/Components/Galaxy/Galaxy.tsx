import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer} from '@react-three/postprocessing'
import { useRef } from "react";
import { Mesh, TextureLoader } from "three";
import './galaxy.scss';
import { OrbitControls } from '@react-three/drei'


const AU = 149597871;

const Earth = () => {
    const earthRef = useRef<Mesh>(null);
    const [earthTexture, earthEmissiveMap, earthNormalMap, earthRoughnessMap] = useLoader(TextureLoader, ["/textures/earth_daymap.jpg","/textures/earth_nightmap.jpg","/textures/earth_normal_map.jpg","/textures/earth_specular_map.jpg"])
    useFrame((state,delta) => {
        if(earthRef.current){         
            // earthRef.current.rotation.y += delta;
        }
    })
    return(
        <group rotation={[0,0,-23.45 * Math.PI/ 180]}>
            <mesh ref={earthRef} >
                <sphereGeometry args={[6371 / AU * 100, 36, 36]} />
                <meshStandardMaterial map={earthTexture} emissiveMap={earthEmissiveMap} emissive={"white"} emissiveIntensity={0.5} normalMap={earthNormalMap} roughnessMap={earthRoughnessMap} roughness={1}/>
            </mesh>
        </group>
    )
}

const Sun = () => {
    const sunRef = useRef<Mesh>(null);
    const [sunTexture] = useLoader(TextureLoader, ["/textures/sunTexture.jpg"])
    return(
        <mesh ref={sunRef} position={[1,0,0]}>
            
            <sphereGeometry args={[696340 / AU, 24, 24]} />
            <meshBasicMaterial color={"yellow"} map={sunTexture} opacity={0.1}/>
        </mesh>
    )
}



const Galaxy = () => {
    
    return(
        <Canvas className="galaxy" camera={{ fov: 75, near: 0.1, far: 1000, zoom: 100 }}>
            <pointLight position={[1,0,0]}  intensity={3} color={"#fff"}/>
            <Sun/>
            <Earth/>
            <OrbitControls/>
            <EffectComposer>
                <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} />
            </EffectComposer>
            
        </Canvas>
    )
}
export default Galaxy;