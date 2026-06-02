"use client";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import NavItems from "../utilis/NavItems";
import { ThemeSwitcher } from "../utilis/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModel from "../utilis/CustomModel";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route:string;
  setRoute:(route:string)=>void
};

const Header: FC<Props> = ({open, activeItem, setOpen, route,setRoute }) => {
  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      {
        setOpenSidebar(false);
      }
    }
  };
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 85);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-linear-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-20 z-80 border-b dark:border-[#ffffff11c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-20 z-80 dark:shadow "
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-20 flex items-center justify-between p-3 ">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins font-medium text-black dark:text-white`}
              >
                ELearning
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* only for mobile */}
              <div className="800px:hidden flex">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white mr-3 text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              <HiOutlineUserCircle
                size={40}
                className="hidden 800px:block cursor-pointer text-black dark:text-white p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
        </div>
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-99999 dark:bg-[unset] bg-[#00000024]"
            id="screen"
            onClick={handleClose}
          >
            <div className="w-[70%] fixed z-999999999 h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 ">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer dark:text-white ml-9 my-2 text-black"
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright © 2026 ELearning{" "}
              </p>
            </div>
          </div>
        )}
      </div>
      {
        route==="Login" && (
          <>
          {
            open && (
              <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}/>
            )
          }
          
          </>
        )
      }
      {
        route==="Sign-Up" && (
          <>
          {
            open && (
              <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}/>
            )
          }
          
          </>
        )
      }
      {
        route==="Verification" && (
          <>
          {
            open && (
              <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}/>
            )
          }
          
          </>
        )
      }
    </div>
  );
};

export default Header;
