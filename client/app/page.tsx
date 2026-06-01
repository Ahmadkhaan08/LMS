'use client'
import Heading from "./utilis/Heading";
import { useState } from "react";
import Header from "./components/Header";
import Hero from "./Route/Hero";



const Page = () => {
  const [open,setOpen]=useState(false)
  const [activeItem,setActiveItem]=useState(0)
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
      activeItem={activeItem}/>
      <Hero/>
    </div>
  );
};

export default Page;