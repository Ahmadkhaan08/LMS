'use client';

import CourseDetailsPage from "../../components/Course/CourseDetailsPage";
import { use } from "react";


const Page=({params}:any)=>{
    const resolvedParams = use(params) as any;
    return (
        <div>
            <CourseDetailsPage id={resolvedParams.id}/>
        </div>
    )
}

export default Page