'use client'
import React, { useState } from 'react'
import Heading from '../utilis/Heading';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Policy from './Policy';

type Props = {}

const page = (props: Props) => {
   const [open, setOpen] = useState(false);
    const [activeItem] = useState(3);
    const [route, setRoute] = useState("Login");
    return (
        <div className='min-h-screen'>
            <Heading
                title="Policy - ELearning"
                description="ELearning is a learning management system for helping programmers"
                keywords="programming,MERN"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                setRoute={setRoute}
                route={route}
            />
            <Policy/>
            <Footer />
        </div>
    )
}

export default page