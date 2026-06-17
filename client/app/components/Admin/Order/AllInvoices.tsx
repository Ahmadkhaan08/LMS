"use client";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { useGetAllOrdersQuery } from "../../../../redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "../../../../redux/features/user/userApi";
import { useGetAllCoursesQuery } from "../../../../redux/features/courses/coursesApi";
import { format } from "timeago.js";
import { AiOutlineMail } from "react-icons/ai";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme;

  const { isLoading: ordersLoading, data: OrdersData } = useGetAllOrdersQuery(
    {},
  );
  const { isLoading: usersLoading, data: UsersData } = useGetAllUsersQuery({});
  const { isLoading: coursesLoading, data: CoursesData } =
    useGetAllCoursesQuery({});

  const [orderData, setOrderData] = useState<any[]>([]);

  const isLoading = ordersLoading || usersLoading || coursesLoading;

  useEffect(() => {
    if (OrdersData && UsersData && CoursesData) {
      const temp = OrdersData.orders.map((order: any) => {
        const user = UsersData.users.find((u: any) => u._id === order.userId);
        const course = CoursesData.courses.find(
          (c: any) => c._id === order.courseId,
        );
        return {
          ...order,
          userName: user?.name,
          userEmail: user?.Email,
          title: user?.name,
          price: "$" + course?.price,
        };
      });
      setOrderData(temp);
    }
  }, [UsersData, OrdersData, CoursesData]);

  const columns: any = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: 1 },
          { field: "title", headerName: "Course Title", flex: 1 },
        ]),
    { field: "price", headerName: "Price", flex: 0.5 },
    ...(isDashboard
      ? [{ field: "formattedDate", headerName: "Created At", flex: 0.5 }]
      : [
          {
            field: " ",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params: any) => (
              <a href={`mailto:${params.row.userEmail}`}>
                <AiOutlineMail
                  className="dark:text-white text-black flex items-center"
                  size={20}
                />
              </a>
            ),
          },
        ]),
  ];

  const rows = orderData.map((item: any) => ({
    id: item._id,
    userName: item.userName,
    userEmail: item.userEmail,
    title: item.title,
    price: item.price,
    formattedDate: format(item.createdAt),
  }));

  return (
    <div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{ m: isDashboard ? "0px" : "40px" }}>
          <Box
            sx={{
              m: isDashboard ? "0" : "40px 0 0 0",
              height: isDashboard ? "35vh" : "82.49vh",
              width: "100%",
              "& .MuiDataGrid-root": { border: "none", outline: "none" },

              "& .MuiDataGrid-columnHeaders": {
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: `${
                  currentTheme === "dark" ? "#3e4396" : "#A4A9FC"
                } !important`,
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: `${
                  currentTheme === "dark" ? "#3e4396" : "#A4A9FC"
                } !important`,
              },
              "& .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-columnHeaderTitleContainer":
                {
                  color: `${
                    currentTheme === "dark" ? "#fff" : "#000"
                  } !important`,
                },

              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: currentTheme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: currentTheme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: currentTheme === "dark" ? "#fff" : "#000",
                borderBottom:
                  currentTheme === "dark"
                    ? "1px solid #ffffff30!important"
                    : "1px solid #ccc!important",
              },
              "& .MuiTablePagination-root": {
                color: currentTheme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none!important",
              },
              "& .name-column--cell": {
                color: currentTheme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
              },
              "& .MuiDataGrid-menuIconButton": {
                color: currentTheme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-iconSeparator": {
                color: currentTheme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor:
                  currentTheme === "dark" ? "#1F2A40" : "#F2F0F0",
                overflow: "auto",
              },
              "& .MuiDataGrid-footerContainer": {
                color: currentTheme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor:
                  currentTheme === "dark" ? "#3e4396" : "#A4A9FC",
              },
              "& .MuiCheckbox-root": {
                color:
                  currentTheme === "dark"
                    ? `#b7ebde !important`
                    : `#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${
                  currentTheme === "dark" ? "#fff" : "#000"
                } !important`,
              },
            }}
          >
            <DataGrid
              checkboxSelection={!isDashboard}
              rows={rows}
              columns={columns}
              slots={isDashboard ? {} : { toolbar: GridToolbar }}
              sx={{ height: "100%", width: "100%" }}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;
