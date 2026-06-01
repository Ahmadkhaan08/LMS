import Link from "next/link";
import React from "react";

export const navItemsData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];
type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
  {navItemsData &&
    navItemsData.map((item, index) => (
      <Link href={`${item.url}`} key={index} passHref>
        <span
          className={`text-[18px] px-6 py-2 rounded-full font-Poppins font-medium transition-all duration-300 ${
            activeItem === index
              ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md dark:shadow-none"
              : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          {item.name}
        </span>
      </Link>
    ))}
</div>
      {isMobile && (
  <div className="800px:hidden mt-5">
    <div className="w-full text-center py-6">
      <Link
        href={"/"}
        className={`text-[25px] font-Poppins font-medium text-black dark:text-white`}
      >
        ELearning
      </Link>
    </div>
    {navItemsData &&
      navItemsData.map((item, index) => (
        <Link href={item.url} key={index} passHref>
          <span
            className={`block text-[18px] px-6 py-3 mx-4 mb-3 rounded-full font-Poppins font-medium transition-all duration-300 ${
              activeItem === index
                ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md dark:shadow-none"
                : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            {item.name}
          </span>
        </Link>
      ))}
  </div>
)}
    </>
  );
};

export default NavItems;
