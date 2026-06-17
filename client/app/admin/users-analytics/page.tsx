"use client";
import Heading from "../../utilis/Heading";
import AdminSidebar from "../../components/Admin/Sidebar/AdminSidebar";
import AdminProtected from "../../hooks/AdminProtected";
import DashboardHero from "../../components/Admin/DashboardHero";
import UsersAnalytics from "../../../app/components/Admin/Analytics/UsersAnalytics";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Elearning - Admin"
          description="Elearning is a platform for students to learn & get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className="flex h-[200vh]">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%] min-h-screen">
            <DashboardHero />
            <UsersAnalytics/>
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
