"use client";

import {
  useEditLayoutDataMutation,
  useGetLayoutDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";

type Props = {};

const EditHero: FC<Props> = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  const { data, refetch } = useGetLayoutDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess, isLoading, error }] =
    useEditLayoutDataMutation();

  useEffect(() => {
    if (data) {
      setTitle(data?.layout?.banner?.title || "");
      setSubTitle(data?.layout?.banner?.subTitle || "");
      setImage(data?.layout?.banner?.image?.url || "");
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Hero Section Updated Successfully!");
    }
    if (error && "data" in error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [isSuccess, error]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    // update banner api call
    await editLayout({
      type: "Banner",
      image,
      title,
      subTitle,
    });
  };

  const isChanged =
    data?.layout?.banner?.title !== title ||
    data?.layout?.banner?.subTitle !== subTitle ||
    data?.layout?.banner?.image?.url !== image;

  return (
    <div className="w-full min-h-screen mt-6 px-4 sm:px-6 md:px-10 lg:px-16 py-8">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        {/* Left Side - Banner Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div
            className="
              relative flex items-center justify-center
              w-[220px] h-[220px]
              sm:w-[280px] sm:h-[280px]
              md:w-[350px] md:h-[350px]
              lg:w-[420px] lg:h-[420px]
              xl:w-[500px] xl:h-[500px]
              rounded-full bg-[#0B0F2A]
              shrink-0
            "
          >
            {image && (
              <img
                src={image}
                alt="Banner"
                className="w-[85%] h-[85%] object-contain"
              />
            )}

            <input
              type="file"
              id="banner"
              accept="image/*"
              className="hidden"
              onChange={handleUpdate}
            />

            <label
              htmlFor="banner"
              className="
                absolute bottom-6 right-6
                sm:bottom-8 sm:right-8
                cursor-pointer
                bg-black/60 hover:bg-black
                p-3 rounded-full
                transition-all duration-300
              "
            >
              <AiOutlineCamera className="text-white text-[20px]" />
            </label>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Title */}
          <textarea
            rows={4}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Improve Your Online Learning Experience Better Instantly"
            className="
              w-full bg-transparent outline-none resize-none overflow-hidden
              dark:text-white text-gray-900
              font-Josefin font-[700]
              leading-tight

              text-3xl
              sm:text-4xl
              md:text-5xl
              lg:text-5xl
              xl:text-6xl
            "
          />

          {/* Subtitle */}
          <textarea
            rows={3}
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            placeholder="Learn from the best instructors and take your skills to the next level."
            className="
              mt-4
              w-full bg-transparent outline-none resize-none overflow-hidden
              dark:text-gray-200 text-gray-600
              font-Josefin

              text-base
              sm:text-lg
              lg:text-xl
            "
          />

          {/* Save Button */}
          <div className="flex justify-center lg:justify-end mt-8">
            <button
              type="button"
              disabled={!isChanged || isLoading}
              onClick={isChanged ? handleEdit : undefined}
              className={`
                px-8 py-2 rounded-md font-medium transition-all duration-300
                ${
                  isChanged
                    ? "bg-[#37a39a] text-white hover:opacity-90 cursor-pointer"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }
              `}
            >
              <div className="flex items-center justify-center">
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" size={20} />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHero;
