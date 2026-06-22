'use client'
import React, { useState } from 'react'
import Heading from '../utilis/Heading';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Faq from '../components/FAQ/FAQ';

type Props = {}

const page = (props: Props) => {
   const [open, setOpen] = useState(false);
    const [activeItem] = useState(4);
    const [route, setRoute] = useState("Login");
    return (
        <div className='min-h-screen'>
            <Heading
                title="FAQ - ELearning"
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
            <Faq/>
            <Footer />
        </div>
    )
}

export default page