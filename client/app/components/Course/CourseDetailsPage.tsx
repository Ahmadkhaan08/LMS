'use client'
import { useGetCourseDetailsQuery } from "../../../redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "../../../app/utilis/Heading";
import Header from "../Header";
import CourseDetails from "./CourseDetails";
import Footer from "../Footer";

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Login");
  const { data, isLoading } = useGetCourseDetailsQuery(id);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={`${data?.course?.name}-ELearning`}
            description="ELearning is a platform for online learning and education."
            keywords={data?.course?.tags}
          />
          <Header
            open={open}
            setOpen={setOpen}
            activeItem={1}
            route={active}
            setRoute={setActive}
          />
          <CourseDetails 
          data={data.course}
          />
          <Footer/>
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;
