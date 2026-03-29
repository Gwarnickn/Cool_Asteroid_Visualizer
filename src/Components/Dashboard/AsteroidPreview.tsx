import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Group } from "three";




const AsteroidMType = () => {
    const { nodes, materials } = useGLTF('/models/asteroid_m.glb')
    const ref = useRef<Group>(null);
    useFrame(() => {
        if(ref.current) ref.current.rotateY(0.002);
    })
    return (
        <group dispose={null}>
            <group ref={ref} scale={50} position={[0,2.5,-6.2]}>
                <mesh geometry={(nodes.Object_2 as any).geometry} material={materials['GRO17102-0_SFM_Web-Resolution-Model_Coordinate-Unregistered']} />
                <mesh geometry={(nodes.Object_3 as any).geometry} material={materials['GRO17102-0_SFM_Web-Resolution-Model_Coordinate-Unregistered']} />
            </group>
        </group>
    )
}

const AsteroidSType = () => {
    const { nodes, materials } = useGLTF('/models/asteroid_s.glb')
    const ref = useRef<Group>(null);
    useFrame(() => {
        if(ref.current) ref.current.rotateY(0.002);
    })
    return (
        <group ref={ref} dispose={null} scale={0.0008} position={[0,0,-2]}>
            <mesh geometry={(nodes.eros_LP as any).geometry} material={materials.eros} />
        </group>
    )
}

const AsteroidCType = () => {
    const { nodes, materials } = useGLTF('/models/asteroid_c.glb')
    const ref = useRef<Group>(null);
    useFrame(() => {
        if(ref.current) ref.current.rotateY(0.002);
    })
    return (
        <group ref={ref} dispose={null} scale={64} position={[0,0,-2]}>
            <mesh geometry={(nodes.Object_2 as any).geometry} material={materials.material_1} rotation={[-Math.PI / 2, 0, 0]} />
        </group>
    )
}

const AsteroidVType = () => {
    const { nodes, materials } = useGLTF('/models/asteroid_v.glb')
    const ref = useRef<Group>(null);
    useFrame(() => {
        if(ref.current) ref.current.rotateY(0.002);
    })
    return (
        <group dispose={null}>
            <group ref={ref} rotation={[-Math.PI / 4, 0, 0]} scale={25} position={[0,0,-2]}>
                <mesh geometry={(nodes.Object_2 as any).geometry} material={materials['GRO17176-0_SFM_Web-Resolution-Model_Coordinate-Unregistered']} />
                <mesh geometry={(nodes.Object_3 as any).geometry} material={materials['GRO17176-0_SFM_Web-Resolution-Model_Coordinate-Unregistered']} />
            </group>
        </group>
    )
}

const Unknown= () => {
    const { nodes, materials } = useGLTF('/models/unknown.glb')
    const ref = useRef<Group>(null);
    useFrame(() => {
        if(ref.current) ref.current.rotateZ(0.002);
    })
    return (
        <group ref={ref} dispose={null} position={[0,0,-3]} rotation={[Math.PI / 2,0,0]}>
            <group scale={0.01}>
                <mesh geometry={(nodes.BezierCurve_Material_0 as any).geometry} material={materials.Material} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                <mesh geometry={(nodes.Cube_Material_0 as any).geometry} material={materials.Material} position={[0, 0, 123.385]} rotation={[-Math.PI / 2, 0, 0]} scale={32.754} />
            </group>
        </group>
    )
}

const AsteroidModel = ({ type }: { type?: string }) => {
    if (!type) return <Unknown />;

    switch (type.toLowerCase()) {
        case 'm': return <AsteroidMType />;
        case 's': return <AsteroidSType />;
        case 'c': return <AsteroidCType />;
        case 'v': return <AsteroidVType />;
        case 'u': 
        default:  return <Unknown />;
    }
}

const AsteroidPreview = ({ type }: { type?: string }) => {
    return (
        <div className="asteroid-preview">
            <Canvas camera={{ position: [0, 0, 0] }}>
                <Suspense fallback={null}>
                    <AsteroidModel type={type} />
                </Suspense>
                <OrbitControls />
                <ambientLight intensity={2} />
            </Canvas>
        </div>
    )
}

useGLTF.preload('/models/asteroid_m.glb');
useGLTF.preload('/models/asteroid_s.glb');
useGLTF.preload('/models/asteroid_c.glb');
useGLTF.preload('/models/asteroid_v.glb');
useGLTF.preload('/models/unknown.glb');

export default AsteroidPreview;