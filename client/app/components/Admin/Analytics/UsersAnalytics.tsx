// import React from "react";
// import {
//   Area,
//   AreaChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import Loader from "../../Loader/Loader";
// import { styles } from "../../../../app/styles/style";
// import { useGetUsersAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";

// type Props = {
//   isDashboard?: boolean;
// };

// const UsersAnalytics = ({ isDashboard }: Props) => {
//   const { data, isLoading } = useGetUsersAnalyticsQuery({});

//   const analyticsData = [
//     { name: "January 2026", count: 512 },
//     { name: "February 2026", count: 7890 },
//     { name: "March 2026", count: 3988 },
//     { name: "April 2026", count: 4620 },
//     { name: "May 2026", count: 2176 },
//     { name: "June 2026", count: 3290 },
//     { name: "July 2026", count: 488 },
//     { name: "August 2026", count: 5932 },
//     { name: "September 2026", count: 1435 },
//     { name: "October 2026", count: 6720 },
//     { name: "November 2026", count: 5301 },
//     { name: "December 2026", count: 620 },
//   ];

//   // const analyticsData: any = []

//   // if (data && data.users && data.users.last12Months) {
//   //     data.users.last12Months.forEach((item: any) => {
//   //         analyticsData.push({
//   //             name: item.month,
//   //             count: item.count
//   //         })
//   //     })
//   // }

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <div
//           className={`${
//             !isDashboard
//               ? ""
//               : "mt-[50px] dark:bg-[#111C43] shadow-sm pb-5 rounded-sm"
//           }`}
//         >
//           <div className={`${isDashboard ? "!ml-8 mb-5" : ""} p-8!`}>
//             <h1
//               className={`${styles.title} ${
//                 isDashboard && "!text-[20px]"
//               } px-5 !text-start`}
//             >
//               Users Analytics
//             </h1>
//             {!isDashboard && (
//               <p className={`${styles.label} px-5`}>
//                 Last 12 months analytics data
//               </p>
//             )}
//           </div>

//           <div
//             className={`w-full ${
//               isDashboard ? "h-[30vh]" : "h-screen"
//             } flex items-center justify-center `}
//           >
//             <ResponsiveContainer
//               width={isDashboard ? "100%" : "90%"}
//               height={!isDashboard ? "50%" : "100%"}
//             >
//               <AreaChart
//                 data={analyticsData}
//                 margin={{
//                   top: 5,
//                   right: 5,
//                   left: 0,
//                   bottom: 25,
//                 }}
//               >
//                 <XAxis
//                   dataKey="name"
//                   tickMargin={10}
//                   interval={0}
//                   angle={-45}
//                   textAnchor="end"
//                   height={80}
//                 />
//                 <YAxis tickMargin={10} />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="count"
//                   stroke="#4d62d9"
//                   fill="#4d62d9"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UsersAnalytics;

import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../../Loader/Loader";
import { styles } from "../../../../app/styles/style";
import { useGetUsersAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";

type Props = {
  isDashboard?: boolean;
};

const UsersAnalytics = ({ isDashboard }: Props) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});

//   const analyticsData = [
//     { name: "January 2026", count: 512 },
//     { name: "February 2026", count: 7890 },
//     { name: "March 2026", count: 3988 },
//     { name: "April 2026", count: 4620 },
//     { name: "May 2026", count: 2176 },
//     { name: "June 2026", count: 3290 },
//     { name: "July 2026", count: 488 },
//     { name: "August 2026", count: 5932 },
//     { name: "September 2026", count: 1435 },
//     { name: "October 2026", count: 6720 },
//     { name: "November 2026", count: 5301 },
//     { name: "December 2026", count: 620 },
//   ];


   const analyticsData: any = []

    if (data && data.users && data.users.last12Months) {
        data.users.last12Months.forEach((item: any) => {
            analyticsData.push({
                name: item.month,
                Users_Count: item.count
            })
        })
    }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className={`${
            isDashboard
              ? "mt-[50px] dark:bg-[#111C43] shadow-sm pb-5 rounded-sm"
              : "p-6"
          }`}
        >
          {/* Heading Section */}
          <div className={`${isDashboard ? "!ml-8 mb-1" : ""} px-5 pt-4`}>
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } !text-start`}
            >
              Users Analytics
            </h1>

            {!isDashboard && (
              <p className={`${styles.label}`}>
                Last 12 months analytics data
              </p>
            )}
          </div>

          {/* Chart Section */}
          <div
            className={`w-full ${
              isDashboard ? "h-[350px]" : "h-[500px]"
            } flex items-start justify-center mt-20`}
          >
            <ResponsiveContainer
              width={isDashboard ? "90%" : "90%"}
              height={isDashboard ? "100%" : "80%"}
            >
              <AreaChart
                data={analyticsData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 25,
                }}
              >
                <XAxis
                  dataKey="name"
                  tickMargin={10}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />

                <YAxis tickMargin={10} />

                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="Users_Count"
                  stroke="#4d62d9"
                  fill="#4d62d9"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersAnalytics;