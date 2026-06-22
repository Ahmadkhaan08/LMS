"use client";
import {
  useGetAllCoursesQuery,
  useGetUsersAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import { useGetLayoutDataQuery } from "@/redux/features/layout/layoutApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utilis/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

type Props = {};

const page = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const { data: categoriesData } = useGetLayoutDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("All");

  const categories = categoriesData?.layout?.categories;

  useEffect(() => {
    if (category === "All") {
      setCourses(data?.courses);
    }
    if (category !== "All") {
      setCourses(
        data?.courses?.filter((item: any) => item.categories === category),
      );
    }
    if (search) {
      setCourses(
        data?.courses?.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [data, category, search]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title={"All courses - ELearning"}
              description={"ELearning is a programming community."}
              keywords={
                "programming community, coding skills, expert insights, collaboration, growth"
              }
            />
            <br />
            <div className="w-full flex items-center flex-wrap">
              <div
                className={`h-[35px] ${
                  category === "All"
                    ? "bg-[crimson]"
                    : "bg-linear-to-r from-blue-600 to-purple-600"
                } m-3 px-3 rounded-[30px] flex items-center text-white justify-center font-Poppins cursor-pointer`}
                onClick={() => {
                  setCategory("All"), router.push("/courses");
                }}
              >
                All
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`h-[35px] ${
                        category === item.title
                          ? "bg-[crimson]"
                          : "bg-linear-to-r from-blue-600 to-purple-600"
                      } m-3 px-3 rounded-[30px] text-white flex items-center justify-center font-Poppins cursor-pointer`}
                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>
            {courses && courses.length === 0 && (
              <p
                className={`${styles.label} justify-center min-h-[50vh] flex items-center`}
              >
                {search
                  ? "No courses found!"
                  : "No courses found in this category. Please try another one!"}
              </p>
            )}
            <br />
            <br />
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
              {!isLoading &&
                courses &&
                courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={index} />
                ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default page;
