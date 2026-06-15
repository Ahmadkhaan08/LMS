'use client'
import AllUsers from '../../../app/components/Admin/Users/AllUsers'
import DashboardHeader from '../../../app/components/Admin/DashboardHeader'
import AdminSidebar from '../../../app/components/Admin/Sidebar/AdminSidebar'
import Heading from '../../../app/utilis/Heading'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
        <Heading
          title="Elearning - Admin"
          description="Elearning is a platform for students to learn & get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className='flex h-screen'>
            <div className='1500px:w-[16%] w-1/5'>
            <AdminSidebar/>
            </div>
            <div className='w-4/5 p-4'>
                <DashboardHeader/>
                <AllUsers isTeam={true}/>
            </div>
        </div>
    </div>
  )
}

export default page