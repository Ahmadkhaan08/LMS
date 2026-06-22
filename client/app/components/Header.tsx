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
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ open, activeItem, setOpen, route, setRoute }) => {
  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      {
        setOpenSidebar(false);
      }
    }
  };
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  // const { user } = useSelector((state: any) => state.auth);
  const {data:userData,isLoading,refetch}=useLoadUserQuery({})
  const { data, status } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);

  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });
  // console.log(data?.user?.image);

  useEffect(() => {
    if(!isLoading){
      if (!userData) {
      if (status === "authenticated" && data) {
        socialAuth({
          email: data?.user?.email,
          name: data?.user?.name,
          avatar: data?.user?.image,
        });
        refetch()
      }
    }
    }

    if (data === null && isSuccess) {
      toast.success("Welcome back to ELearning!");
      setOpen(false);
    }

    if(data===null  && !isLoading && !userData){
      setLogout(true)
    }
  }, [data, userData, status]);

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
  // console.log(userData);

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
              {userData ? (
                userData.user.avatar ? (
                  <Link href={"/profile"}>
                    <Image
                      src={userData.user.avatar.url}
                      alt=""
                      className={`w-7.5 h-7.5 rounded-full ${
                        activeItem === 5 ? "border-2 border-blue-500" : "none"
                      }`}
                      width={100}
                      height={100}
                      // style={{border:activeItem===5?"2px solid blue":""}}
                    />
                  </Link>
                ) : (
                  <Link href={"/profile"}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-black dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white font-semibold cursor-pointer">
                      {userData.name?.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                )
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="cursor-pointer dark:text-white ml-9 my-2 text-black"
                  onClick={() => setOpen(true)}
                />
              )}
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
      {route === "Login" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
              refetch={refetch}
            />
          )}
        </>
      )}
      {route === "Sign-Up" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
