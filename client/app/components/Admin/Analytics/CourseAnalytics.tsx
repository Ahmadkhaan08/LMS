import { styles } from "../../../../app/styles/style";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";
import Loader from "../../Loader/Loader";
import { RechartsDevtools } from "@recharts/devtools";
import { useGetCoursesAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";

type Props = {};

const CourseAnalytics = (props: Props) => {
  const { data, isLoading } = useGetCoursesAnalyticsQuery({});

  //   const analyticsData = [
  //     { name: "Jun 2026", uv: 3 },
  //     { name: "July 2026", uv: 2 },
  //     { name: "August 2026", uv: 5 },
  //     { name: "Sept 2026", uv: 7 },
  //     { name: "October 2026", uv: 2 },
  //     { name: "Nov 2026", uv: 5 },
  //     { name: "December 2026", uv: 7 },
  //   ];

  const analyticsData: any[] = [];
  if (data) {
    data.courses.last12Months.forEach((item: any) => {
      const date = new Date(item.month);
      analyticsData.push({
        name: date.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        }),
        Courses_Count: item.count,
      });
    });
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen p-6">
          <div>
            <h1 className={`${styles.title} px-5 !text-start`}>
              Courses Analytics
            </h1>
            <p className={`${styles.label} px-5`}>
              Last 12 months analytics data{" "}
            </p>
          </div>

          <div className="w-full h-[90%] flex items-center justify-center mt-12">
            <BarChart
              style={{
                width: "100%",
                maxWidth: "800px",
                maxHeight: "70vh",
                aspectRatio: 1.618,
              }}
              responsive
              data={analyticsData}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
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
              <YAxis width="auto" tickMargin={10} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Courses_Count"
                fill="#4563CD"
                activeBar={{ fill: "#1C2E6D", stroke: "black", strokeWidth: 2 }}
                radius={[10, 10, 0, 0]}
              />
              <RechartsDevtools />
            </BarChart>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;
