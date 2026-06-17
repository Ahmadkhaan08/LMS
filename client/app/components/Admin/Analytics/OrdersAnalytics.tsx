import Loader from "../../Loader/Loader";
import { styles } from "../../../../app/styles/style";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetOrdersAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";

type Props = {
  isDashboard?: boolean;
};

const OrdersAnalytics = ({ isDashboard }: Props) => {
  const { data, isLoading } = useGetOrdersAnalyticsQuery({});

//   const analyticsData = [
//     { name: "Page A", Count: 4000 },
//     { name: "Page B", Count: 3000 },
//     { name: "Page C", Count: 5000 },
//     { name: "Page D", Count: 1000 },
//     { name: "Page E", Count: 4000 },
//     { name: "Page F", Count: 800 },
//     { name: "Page G", Count: 200 },
//   ];

  const analyticsData: any[] = [];

  if (data?.orders?.last12Months) {
    data.orders.last12Months.forEach((item: any) => {
      analyticsData.push({
        name: item.month,
        Orders_Count: item.count,
      });
    });
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={isDashboard ? "h-[30vh]" : "h-[90vh] p-4"}>
          {/* Header Section */}
          <div
            className={
              isDashboard
                ? "pl-10 pt-4 pb-3"
                : "px-8 pt-6 pb-4"
            }
          >
            <h1
              className={`${styles.title} ${
                isDashboard ? "!text-[20px]" : ""
              } !text-start`}
            >
              Orders Analytics
            </h1>

            {!isDashboard && (
              <p className={`${styles.label} mt-1`}>
                Last 12 months analytics data
              </p>
            )}
          </div>

          {/* Chart Section */}
          <div
            className={`w-full mt-15 ${
              !isDashboard ? "h-[80%]" : "h-full"
            } flex justify-center`}
          >
            <ResponsiveContainer
              width={isDashboard ? "100%" : "90%"}
              height={isDashboard ? "100%" : "85%"}
            >
              <LineChart
                data={analyticsData}
                margin={{
                  top: 0,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  tickMargin={8}
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

                {!isDashboard && <Legend />}

                <Line
                  type="monotone"
                  dataKey="Orders_Count"
                  stroke="#82ca9d"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAnalytics;