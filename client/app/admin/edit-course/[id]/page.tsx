'use client'
import DashboardHeader from '../../../../app/components/Admin/DashboardHeader'
import AdminSidebar from '../../../../app/components/Admin/Sidebar/AdminSidebar'
import Heading from '../../../../app/utilis/Heading'
import React from 'react'
import CreateCourse from '../../../../app/components/Admin/Course/CreateCourse'
import EditCourse from '@/app/components/Admin/Course/EditCourse'
import { useParams } from 'next/navigation'

type Props = {}

const page = (props:Props) => {
    const params=useParams()
    const id=params?.id as string
  return (
    <div>
        <Heading
          title="Elearning - Admin"
          description="Elearning is a platform for students to learn & get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className='flex'>
            <div className='1500px:w-[16%] w-1/5'>
            <AdminSidebar/>
            </div>
            <div className='w-[85%]'>
                <DashboardHeader/>
                <EditCourse id={id}/>
            </div>
        </div>
    </div>
  )
}

export default page