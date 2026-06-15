"use client";
import { title } from "process";
import React, { useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {};

const CreateCourse = (props: Props) => {
  const [createCourse,{isLoading,error,isSuccess}]=useCreateCourseMutation()

  useEffect(()=>{
    if(isSuccess){
      toast.success("Course Created Successfully!")
      redirect("/admin/all-courses")
    }

    if(error){
      if("data" in error){
        const errorMessage=error as any
        toast.error(errorMessage.data.message)
      }
    }
  },[isLoading,isSuccess,error])
  const [active, setActive] = useState(3);
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisities, setPrerequisities] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      videoLength: "",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestions: "",
    },
  ]);
  const [courseData, setCourseData] = useState({});

  const handleSubmit = async () => {
    // format benefit array
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    // format prerequisities array
    const formattedPrerequisities = prerequisities.map((prerequisities) => ({
      title: prerequisities.title,
    }));
    // formatted course content array
    const formattedCourseContentData = courseContentData.map(
      (CourseContent) => ({
        videoUrl: CourseContent.videoUrl,
        title: CourseContent.title,
        description: CourseContent.description,
        videoSection: CourseContent.videoSection,
        links: CourseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        suggestions: CourseContent.suggestions,
      }),
    );

    // prepare the data object
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisities: formattedPrerequisities,
      courseContent: formattedCourseContentData,
    };
    setCourseData(data);
  };

  console.log(courseData);

  const handleCourseCreate = async (e: any) => {
    const data = courseData;

    if(!isLoading){
      await createCourse(data)
    }
  };
  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisities={prerequisities}
            setPrerequisities={setPrerequisities}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
          isLoading={isLoading}
            active={active}
            setActive={setActive}
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default CreateCourse;
