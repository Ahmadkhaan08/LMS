import { apiSlice } from "../api/apiSlice";



export const courseApi=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        // create course
       createCourse:builder.mutation({
        query:(data)=>({
            url:"create-course",
            method:"POST",
            body:data,
            credentials:"include" as const 
        })
       }),
    //    get all courses
    getAllCourses:builder.query({
        query:()=>({
            url:"get-all-courses",
            method:"GET",
            credentials:"include" as const
        })
    })
    })
})

export const  {useCreateCourseMutation,useGetAllCoursesQuery}=courseApi