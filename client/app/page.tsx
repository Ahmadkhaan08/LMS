'use client'
import Heading from "./utilis/Heading";
import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";



const Page = () => {
  const [open,setOpen]=useState(false)
  const [activeItem,setActiveItem]=useState(0)
  const [route,setRoute]=useState("Login")

  return (
    <div>
       <Heading
        title="ELearning"
        description=
        "ELearning is a platform for students to learn and get help from teachers"
        keywords="Programming, MERN, Redux, ML, AI"
      />
      <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      setRoute={setRoute}
      route={route}/>
      <Hero/>
    </div>
  );
};

export default Page;