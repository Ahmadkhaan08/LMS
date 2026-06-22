"use client";
import UsersAnalytics from "../Analytics/UsersAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import AllInvoices from "../Order/AllInvoices";
import { useEffect, useState } from "react";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type Props = {
  open: boolean;
  value?: number;
};

const CircularProgressWithLabel = ({ open, value }: Props) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets = ({ open }: Props) => {
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>();
  const [userComparePercentage, setuserComparePercentage] = useState<any>();

  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    if (isLoading && ordersLoading) {
      return;
    } else {
      if (data && ordersData) {
        const usersLastTwoMonths = data.users.last12Months.slice(-2);
        const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

        if (
          usersLastTwoMonths.length === 2 &&
          ordersLastTwoMonths.length === 2
        ) {
          const usersCurrentMonth = usersLastTwoMonths[1].count;
          const usersPreviousMonth = usersLastTwoMonths[0].count;
          const ordersCurrentMonth = ordersLastTwoMonths[1].count;
          const ordersPreviousMonth = ordersLastTwoMonths[0].count;

          const usersPercentChange =
            usersPreviousMonth !== 0
              ? ((usersCurrentMonth - usersPreviousMonth) /
                  usersPreviousMonth) *
                100
              : 100;

          const ordersPercentChange =
            ordersPreviousMonth !== 0
              ? ((ordersCurrentMonth - ordersPreviousMonth) /
                  ordersPreviousMonth) *
                100
              : 100;

          setuserComparePercentage({
            currentMonth: usersCurrentMonth,
            previousMonth: usersPreviousMonth,
            percentChange: usersPercentChange,
          });

          setOrdersComparePercentage({
            currentMonth: ordersCurrentMonth,
            previousMonth: ordersPreviousMonth,
            percentChange: ordersPercentChange,
          });
        }
      }
    }
  }, [isLoading, ordersLoading, data, ordersData]);

  return (
    <div className="min-h-screen w-full p-4 pt-12 md:p-8 md:pt-12">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: User Analytics Chart */}
        <div className="col-span-1 lg:col-span-2 w-full dark:bg-[#111C43] rounded-xl shadow-md p-4">
          <UsersAnalytics isDashboard={true} />
        </div>

        {/* Right Side: Stats Cards Stack */}
        <div className="col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 w-full">
          {/* Card 1: Sales Obtained */}
          <div className="w-full dark:bg-[#111C43] rounded-xl shadow-md p-6 flex flex-col justify-between hover:bg-[#1a2963] transition duration-300">
            <div className="flex items-center justify-between">
              <div>
                <BiBorderLeft className="dark:text-[#45CBA0] text-[#000] text-[32px]" />
                <h5 className="pt-3 font-Poppins dark:text-[#fff] text-black text-[24px] font-semibold">
                 {ordersComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-1 font-Poppins dark:text-[#45CBA0] text-black text-[15px] font-[500]">
                  Sales Obtained
                </h5>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgressWithLabel value={ ordersComparePercentage?.percentChange > 0?100:0} open={open} />
                <h5 className="text-center pt-3 text-[14px] font-semibold dark:text-white">
                 { ordersComparePercentage?.percentChange > 0
                    ? "+" + ordersComparePercentage?.percentChange.toFixed(2)
                    : "-" + ordersComparePercentage?.percentChange.toFixed(2)} %
                </h5>
              </div>
            </div>
          </div>

          {/* Card 2: New Users */}
          <div className="w-full dark:bg-[#111C43] rounded-xl shadow-md p-6 flex flex-col justify-between hover:bg-[#1a2963] transition duration-300">
            <div className="flex items-center justify-between">
              <div>
                <PiUsersFourLight className="dark:text-[#45CBA0] text-[#000] text-[32px]" />
                <h5 className="pt-3 font-Poppins dark:text-[#fff] text-black text-[24px] font-semibold">
                  {userComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-1 font-Poppins dark:text-[#45CBA0] text-black text-[15px] font-[500]">
                  New Users
                </h5>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgressWithLabel value={userComparePercentage?.percentChange > 0?100:0} open={open} />
                <h5 className="text-center pt-3 text-[14px] font-semibold dark:text-white">
                  {userComparePercentage?.percentChange > 0
                    ? "+" + userComparePercentage?.percentChange.toFixed(2)
                    : "-" + userComparePercentage?.percentChange.toFixed(2)} %
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Side: Orders Analytics Chart */}
        <div className="col-span-1 lg:col-span-2 w-full dark:bg-[#111C43] rounded-xl shadow-md p-4">
          <OrdersAnalytics isDashboard={true} />
        </div>

        {/* Right Side: Recent Transactions Table */}
        <div className="col-span-1 w-full flex flex-col">
          <h5 className="dark:text-[#fff] text-black text-[20px] font-[500] font-Poppins pb-4">
            Recent Transactions
          </h5>
          <div className="w-full flex-1 dark:bg-[#111C43] rounded-xl shadow-md overflow-hidden">
            <AllInvoices isDashboard={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
