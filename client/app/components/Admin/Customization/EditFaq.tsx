import { styles } from "../../../../app/styles/style";
import {
  useEditLayoutDataMutation,
  useGetLayoutDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import Loader from "../../Loader/Loader";

type Props = {};

const EditFaq = (props: Props) => {
  const { data, refetch ,isLoading:dataLoading} = useGetLayoutDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading, isSuccess: layoutSuccess, error }] =
    useEditLayoutDataMutation();
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  useEffect(() => {
    if (layoutSuccess) {
      refetch();
      toast.success("Faq Updated Successfully!");
    }
    if (error && "data" in error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [layoutSuccess, error]);

  const toggleQuestion = (id: any) => {
    setQuestions((prevQuestion) =>
      prevQuestion.map((q) => (q._id === id ? { ...q, active: !q.active } : q)),
    );
  };

  const handleQuestionChange = (id: any, value: string) => {
    setQuestions((prevQuestion) =>
      prevQuestion.map((q) => (q._id === id ? { ...q, question: value } : q)),
    );
  };

  const handleAnswerChange = (id: any, value: string) => {
    setQuestions((prevQuestion) =>
      prevQuestion.map((q) => (q._id === id ? { ...q, answer: value } : q)),
    );
  };

  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  // Function to check if the the FAQ arrays are changed or not
  const areQuestionsUnchanged = (
    originalQuestions: any[],
    newQuestions: any[],
  ) => {
    const original = originalQuestions.map(({ active, ...rest }) => rest);
    const current = newQuestions.map(({ active, ...rest }) => rest);
    return JSON.stringify(original) === JSON.stringify(current);
  };

  const isAnyQuestionEmpty = (questions: any[]) => {
    return questions.some((q) => q.question === "" || q.answer === "");
  };
  const handleEdit = async () => {
    if (
      !areQuestionsUnchanged(data.layout.faq, questions) &&
      !isAnyQuestionEmpty(questions)
    ) {
      await editLayout({ type: "FAQ", faq: questions });
    }
  };

  return (
   <>
   {
    dataLoading ? <Loader/>:(
         <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px] min-h-screen">
      <div className="mt-12">
        <dl className="space-y-8">
          {questions?.map((q: any, index) => (
            <div
              key={q._id || index}
              className={`${
                q._id !== questions[0]?._id && "border-t"
              } border-gray-200  pt-6`}
            >
              <dt className="text-lg">
                <button
                  className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                  onClick={() => toggleQuestion(q._id)}
                >
                  <input
                    className={`${styles.input} border-none`}
                    value={q.question}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleQuestionChange(q._id, e.target.value)
                    }
                    placeholder={"Add your question..."}
                  />

                  <span className="ml-6 flex-shrink-0">
                    {q.active ? (
                      <HiMinus className="h-6 w-6" />
                    ) : (
                      <HiPlus className="h-6 w-6" />
                    )}
                  </span>
                </button>
              </dt>
              {q.active && (
                <dd className="mt-2 pr-12">
                  <input
                    className={`${styles.input} border-none`}
                    value={q.answer}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleAnswerChange(q._id, e.target.value)
                    }
                    placeholder={"Add your answer..."}
                  />
                  <span className="ml-6 flex-shrink-0">
                    <AiOutlineDelete
                      className="dark:text-white text-red-500! text-[20px] cursor-pointer"
                      onClick={() => {
                        setQuestions((prevQuestions) =>
                          prevQuestions.filter((item) => item._id !== q._id),
                        );
                      }}
                    />
                  </span>
                </dd>
              )}
            </div>
          ))}
        </dl>
        <br />
        <br />
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer"
          onClick={newFaqHandler}
        />
      </div>
      <div
        className={`${
          styles.button
        } !w-[120px] min-h-[40px] h-[40px] rounded-lg! p-3! dark:text-white text-black bg-[#cccccc34] 
              ${
                areQuestionsUnchanged(data?.layout?.faq, questions) ||
                isAnyQuestionEmpty(questions)
                  ? "!cursor-not-allowed bg-gray-700! text-gray-400"
                  : "!cursor-pointer !bg-[#42d383]"
              }
              !rounded fixed bottom-12 right-12`}
        onClick={
          areQuestionsUnchanged(data?.layout?.faq, questions) ||
          isAnyQuestionEmpty(questions)
            ? () => null
            : handleEdit
        }
      >
        <div className="flex items-center justify-center ">
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
    )
   }
   </>
  );
};

export default EditFaq;
