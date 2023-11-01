'use client'
import React from "react";
import { type MeshProps, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface ThreeModelProps extends MeshProps {
  model: string;
}

export default function ThreeModel({ model, ...props }: ThreeModelProps) {
  const gltf = useLoader(GLTFLoader, model);
  return (
    <>
      <primitive object={gltf.scene} scale={1} {...props} />
    </>
  );
}
