"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";

const Hero = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (search.trim() === "") return;
    router.push(`/courses?title=${search}`);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-[10%] lg:top-[15%] lg:left-[5%] w-75 h-75 lg:w-125 lg:h-125 hero_animation rounded-full opacity-20 lg:opacity-30 pointer-events-none z-0 blur-3xl"></div>

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-0 relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Hero Content Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Badge */}
          <div className="mb-4 inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 backdrop-blur-sm">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              🚀 Elevate your learning journey
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
            Unlock Your Potential with{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Expert-Led Courses
            </span>
          </h1>

          {/* Subtitle or description */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl leading-relaxed">
            Discover thousands of high-quality courses. Learn at your own pace and build the skills you need for the career you want.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="w-full max-w-lg mb-10 relative group">
            <div className="relative flex items-center shadow-lg dark:shadow-none rounded-full bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <input
                type="search"
                placeholder="What do you want to learn today?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 pl-6 pr-16 text-base text-gray-700 bg-transparent dark:text-white rounded-full focus:outline-none placeholder-gray-400"
              />
              <button
                type="submit"
                onClick={handleSearch}
                className="absolute right-1.5 top-1.5 bottom-1.5 w-12 flex items-center justify-center bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-md"
              >
                <BiSearch className="text-white" size={22} />
              </button>
            </div>
          </form>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((num) => (
                <Image
                  key={num}
                  src={`/assets/client-${num}.jpg`}
                  alt={`Student ${num}`}
                  width={44}
                  height={44}
                  className="rounded-full border-2 border-white dark:border-gray-900 shadow-sm"
                />
              ))}
            </div>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Join <span className="font-bold text-gray-900 dark:text-white">500K+</span> students already learning.{" "}
              <Link href="/courses" className="text-blue-600 dark:text-blue-400 font-medium hover:underline hover:text-blue-700 transition-colors">
                Explore Courses &rarr;
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Hero Banner Image */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative">
          {/* Second animated element for balance (optional, uses your global animation) */}
          <div className="absolute w-62.5 h-62.5 lg:w-100 lg:h-100 hero_animation rounded-full opacity-10 lg:opacity-20 z-0 blur-2xl"></div>
          
          <Image
            src={require("../../public/assets/hero-banner-1.png")}
            width={600}
            height={600}
            alt="Students learning online"
            className="object-contain w-full max-w-75 sm:max-w-100 lg:max-w-137.5 h-auto z-10 drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500 ease-in-out"
            priority
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;