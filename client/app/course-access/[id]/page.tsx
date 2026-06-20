"use client";
import CourseContent from "@/app/components/Course/CourseContent";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect, useParams,useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const page = (props: Props) => {
  const params = useParams();
  const router=useRouter()
  const id = params?.id as string;
  // console.log(id)
  const { isLoading, data, error } = useLoadUserQuery({});
// console.log(data)
  useEffect(() => {

    if (error) {
        router.push("/");
      }

    if (data) {
      const isPurchased = data.user.courses.find(
        (item: any) => item.courseId.toString() === id.toString(),
      );
      if (!isPurchased) {
        router.push("/");
      }
      
    }
  }, [data, error]);                
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <CourseContent id={id} user={data.user}/>
        </div>
      )}
    </>
  );
};

export default page;
