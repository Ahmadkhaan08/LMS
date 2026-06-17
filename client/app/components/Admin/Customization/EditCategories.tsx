"use client";
import { useEffect, useState } from "react";
import {
  useEditLayoutDataMutation,
  useGetLayoutDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import Loader from "../../Loader/Loader";
import { styles } from "../../../../app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

type Props = {};

const EditCategories = (props: Props) => {
  const {
    data,
    refetch,
    isLoading: dataLoading,
  } = useGetLayoutDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading, isSuccess: layoutSuccess, error }] =
    useEditLayoutDataMutation();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  useEffect(() => {
    if (layoutSuccess) {
      refetch();
      toast.success("Categories Updated Successfully!");
    }
    if (error && "data" in error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [layoutSuccess, error]);


  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prevCategory: any) =>
      prevCategory.map((i: any) => (i._id === id ? { ...i, title: value } : i)),
    );
  };

  const newCategoriesHandler = () => {
    if (categories[categories.length - 1].title === "") {
      toast.error("Category title cannot be empty!");
    } else {
      setCategories((prevCategory: any) => [...prevCategory, { title: "" }]);
    }
  };

  const areCategoriesUnchanged = (
    originalCategories: any[],
    newCategories: any[],
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryTitleEmpty = (categories: any[]) => {
    return categories.some((c: any) => c.title === "");
  };

  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(data.layout.categories, categories) ||
      isAnyCategoryTitleEmpty(categories)
    ) {
      await editLayout({
        type: "Categories",
        categories,
      });
    }
  };

  console.log(categories);
  return (
    <>
      {dataLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories.map((item: any, index: number) => {
            return (
              <div className="p-3" key={item._id || index}>
                <div className="flex items-center w-full justify-center">
                  <input
                    className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                    value={item.title}
                    onChange={(e) =>
                      handleCategoriesAdd(item._id, e.target.value)
                    }
                    placeholder="Enter category title..."
                  />
                  <AiOutlineDelete
                    className="dark:text-white text-red-500! text-[20px] cursor-pointer"
                    onClick={() => {
                      setCategories((prevCategory: any) =>
                        prevCategory.filter((i: any) => i._id !== item._id),
                      );
                    }}
                  />
                </div>
              </div>
            );
          })}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCategoriesHandler}
            />
          </div>
          <div
            className={`${
              styles.button
            } !w-[120px] !min-h-[40px] !h-[40px] rounded-lg! dark:text-white text-black bg-[#cccccc34] 
                ${
                  areCategoriesUnchanged(
                    data?.layout?.categories,
                    categories,
                  ) || isAnyCategoryTitleEmpty(categories)
                    ? "!cursor-not-allowed text-gray-400 bg-gray-700!"
                    : "!cursor-pointer !bg-[#42d383]"
                }
                !rounded absolute bottom-12 right-12`}
            onClick={
              areCategoriesUnchanged(data?.layout?.categories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? () => null
                : editCategoriesHandler
            }
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
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;
