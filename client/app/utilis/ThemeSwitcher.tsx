"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center mx-4">
        <div style={{ width: 25, height: 25 }} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    );
  }

  return (
    // <div className="flex items-center justify-center mx-4">
    //   {theme === "light" ? (
    //     <BiMoon
    //       className="cursor-pointer"
    //       size={25}
    //       fill="black"
    //       onClick={() => setTheme("dark")}
    //     />
    //   ) : (
    //     <BiSun
    //       className="cursor-pointer"
    //       size={25}
    //       onClick={() => setTheme("light")}
    //     />
    //   )}
    // </div>
    <div className="flex items-center justify-center mx-4">
  {theme === "light" ? (
    <BiMoon
      className="cursor-pointer p-2 rounded-full text-black transition-all duration-300 hover:bg-gray-100 hover:text-blue-600"
      size={40}
      onClick={() => setTheme("dark")}
    />
  ) : (
    <BiSun
      className="cursor-pointer p-2 rounded-full text-white transition-all duration-300 hover:bg-gray-800 hover:text-blue-400"
      size={40}
      onClick={() => setTheme("light")}
    />
  )}
</div>
  );
};
