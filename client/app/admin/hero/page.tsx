"use client";

import Heading from "../../../app/utilis/Heading";
import AdminProtected from "../../../app/hooks/AdminProtected";
import AdminSidebar from "../../../app/components/Admin/Sidebar/AdminSidebar";
import DashboardHero from "../../../app/components/Admin/DashboardHero";
import EditHero from "../../../app/components/Admin/Customization/EditHero";


const Page = () => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Elearning - Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <div className="flex min-h-screen">
          <div className="1500px:w-[15%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <EditHero />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;