"use client";
import React from "react";
import { Button } from "@/components/ui";
import Image from "next/image";
import ThreeModel from "../_components/three-model";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";

const HomePageHeroSection = () => {
  
  return (
    <div id="hero-section" className="flex w-full flex-col md:h-2/3" >
      <div ></div>

      <div className="flex h-full w-full flex-row items-center justify-center">
        <div className="flex h-full w-1/2 max-w-xl flex-col justify-center gap-4">
          <h1 className="flex-wrap text-6xl">All in one Kafka stack</h1>
          <p>
            Supercharge your data infrastructure with cloud-deployed Kafka for
            real-time insights and seamless data streaming.
          </p>
          <div className="flex gap-4">
            <a
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              href="/cluster-dashboard"
            >
              Get Started
            </a>
            <Button variant={"ghost"}>Documentation</Button>
          </div>
          <div className="h-full  w-full items-center justify-center">
            Backed by{" "}
            <Image
              alt="os-labs"
              height={208}
              width={798}
              className="inline w-16"
              src="https://static1.squarespace.com/static/63939ff270e73b58af16e77b/t/63e400c27e7ac96c9c8a4161/1685989190069/"
            />
          </div>
        </div>

        <div className="h-screen w-full ">
          <Canvas
            camera={{
              left: -7,
              right: 7,
              top: 7,
              bottom: -7,
              zoom: 125,
              position: [0, 0, 5],
            }}
            className="h-full w-full"
            orthographic
          >
            <ThreeModel model="./kafka-nimbus.gltf" />
            <OrbitControls
              enableZoom={false}
              minAzimuthAngle={-Math.PI / 4}
              maxAzimuthAngle={Math.PI / 4}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
            />
            <Environment preset="sunset" background={false} />
          </Canvas>
          {/* <HeroSvg /> */}
        </div>
      </div>
    </div>
  );
};

const HeroSvg = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="678.62"
        height="365.87"
        viewBox="0 0 678.62 365.87"
      >
        <path
          d="m607.96,364.37H158.96c-6.78,0-12.29-5.51-12.29-12.29V99.44c0-6.78,5.51-12.29,12.29-12.29h449c6.78,0,12.29,5.51,12.29,12.29v252.64c0,6.78-5.51,12.29-12.29,12.29h0ZM158.96,95.15c-2.37,0-4.29,1.92-4.29,4.29v252.64c0,2.37,1.92,4.29,4.29,4.29h449c2.37,0,4.29-1.92,4.29-4.29V99.44c0-2.37-1.92-4.29-4.29-4.29H158.96Z"
          fill="#d5d5d6"
          stroke-width="0"
        />
        <rect
          x="249.78"
          y="210.85"
          width="21.66"
          height="55.08"
          fill="#6c63ff"
          stroke-width="0"
        />
        <rect
          x="284.88"
          y="205.56"
          width="21.66"
          height="60.37"
          fill="#6c63ff"
          stroke-width="0"
        />
        <rect
          x="319.98"
          y="226.22"
          width="21.66"
          height="39.71"
          fill="#6c63ff"
          stroke-width="0"
        />
        <rect
          x="355.08"
          y="213.96"
          width="21.66"
          height="51.97"
          fill="#6c63ff"
          stroke-width="0"
        />
        <rect
          x="390.18"
          y="224.46"
          width="21.66"
          height="41.46"
          fill="#6c63ff"
          stroke-width="0"
        />
        <rect
          x="425.28"
          y="193.52"
          width="21.66"
          height="72.41"
          fill="#6c63ff"
          stroke-width="0"
        />
        <rect
          x="460.38"
          y="205.56"
          width="21.66"
          height="60.37"
          fill="#6c63ff"
          stroke-width="0"
        />
        <rect
          x="495.48"
          y="195.07"
          width="21.66"
          height="70.86"
          fill="#6c63ff"
          stroke-width="0"
        />
        <path
          d="m176.84,122.18h159.86c1.44,0,2.61,1.17,2.61,2.61h0c0,1.44-1.17,2.61-2.61,2.61h-159.86c-1.44,0-2.61-1.17-2.61-2.61h0c0-1.44,1.17-2.61,2.61-2.61h0Z"
          fill="#d5d5d6"
          stroke-width="0"
        />
        <path
          d="m678.62,364.37c0,.83-.67,1.5-1.5,1.5H1.5c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5h675.62c.83,0,1.5.67,1.5,1.5Z"
          fill="#2e2e41"
          stroke-width="0"
        />
        <polygon
          points="133.7 60.68 153.35 67.14 153.35 38.85 135.52 38.85 133.7 60.68"
          fill="#f3a3a6"
          stroke-width="0"
        />
        <circle
          cx="150.92"
          cy="27.1"
          r="19.58"
          fill="#f3a3a6"
          stroke-width="0"
        />
        <path
          d="m145.93,28.63l2.7,3.28,4.88-8.54s6.23.32,6.23-4.3,5.72-4.75,5.72-4.75c0,0,8.09-14.13-8.67-10.41,0,0-11.63-7.97-17.41-1.16,0,0-17.73,8.93-12.66,24.48l8.43,16.02,1.91-3.63s-1.16-15.23,8.87-10.99Z"
          fill="#2f2e43"
          stroke-width="0"
        />
        <rect
          x="128.3"
          y="328.67"
          width="15.82"
          height="22.44"
          fill="#f3a3a6"
          stroke-width="0"
        />
        <path
          d="m142.37,363.96c-2.71.25-16.24,1.31-16.92-1.79-.62-2.85.29-5.83.42-6.23,1.3-12.94,1.78-13.09,2.07-13.18.46-.13,1.81.5,3.99,1.91l.14.09.03.16c.04.2,1.01,4.95,5.59,4.23,3.14-.5,4.16-1.19,4.49-1.53-.27-.12-.6-.33-.83-.7-.34-.53-.4-1.21-.18-2.02.59-2.15,2.36-5.33,2.43-5.46l.2-.36,17.98,12.13,11.1,3.17c.84.24,1.51.84,1.85,1.64h0c.47,1.12.18,2.42-.72,3.23-2.02,1.81-6.02,4.92-10.23,5.3-1.12.1-2.6.14-4.26.14-6.95,0-17.08-.72-17.16-.73h0Z"
          fill="#2f2e43"
          stroke-width="0"
        />
        <rect
          x="82.49"
          y="300.76"
          width="22.44"
          height="15.82"
          transform="translate(-203.86 184.12) rotate(-50.4)"
          fill="#f3a3a6"
          stroke-width="0"
        />
        <path
          d="m83.13,331.15c-2.24-1.54-13.35-9.34-11.9-12.16,1.34-2.59,3.94-4.3,4.3-4.53,9.25-9.14,9.72-8.95,10-8.83.44.19,1.07,1.54,1.86,4.01l.05.15-.08.14c-.1.18-2.38,4.46,1.61,6.82,2.74,1.62,3.97,1.73,4.43,1.68-.13-.26-.25-.64-.2-1.07.07-.62.46-1.19,1.16-1.67,1.83-1.28,5.21-2.6,5.36-2.66l.38-.15,6.12,20.81,6.53,9.52c.49.72.63,1.61.38,2.45h0c-.35,1.16-1.4,1.98-2.62,2.03-2.71.11-7.77-.05-11.26-2.44-.92-.63-2.09-1.54-3.37-2.6-5.35-4.43-12.7-11.44-12.76-11.5h.01Z"
          fill="#2f2e43"
          stroke-width="0"
        />
        <path
          d="m170.28,155.58h-54.26l12.06,179.36h18.09l24.12-179.36h0Z"
          fill="#2f2e43"
          stroke-width="0"
        />
        <polygon
          points="159.23 165.46 170.28 155.58 164.75 254.23 102.96 313.01 87.55 300.28 123.56 253.56 159.23 165.46"
          fill="#2f2e43"
          stroke-width="0"
        />
        <path
          d="m159.23,50.08l-26.8-4.35-8.32,14.55c-10.58,18.5-14.89,39.92-12.3,61.07l4.21,34.25h54.26l-11.05-105.51h0Z"
          fill="#6c63ff"
          stroke-width="0"
        />
        <path
          id="uuid-b665f492-9b4b-4e5e-8d83-e9db200bf715-44-44-44-44"
          d="m137.47,187.88c1.11,5.53-.96,10.58-4.61,11.28-3.66.69-7.52-3.23-8.63-8.77-.47-2.21-.39-4.49.24-6.66l-4.4-23.51,11.5-1.79,3.11,23.37c1.42,1.79,2.38,3.87,2.79,6.09h0Z"
          fill="#f3a3a6"
          stroke-width="0"
        />
        <path
          d="m123.48,181.51l-16.89-52.18v-.08l6.38-53.73c.98-8.23,7.96-14.43,16.24-14.43,5.07,0,9.77,2.29,12.89,6.29s4.21,9.11,2.98,14.04l-11.27,45.07,2.69,51.15-13.03,3.87h.01Z"
          fill="#6c63ff"
          stroke-width="0"
        />
      </svg>
    </div>
  );
};

export default HomePageHeroSection;