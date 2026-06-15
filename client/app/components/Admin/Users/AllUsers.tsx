'use client'
import { Box, Button, capitalize } from "@mui/material";
import { useTheme } from "next-themes";
import { format } from "timeago.js";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../Loader/Loader";
import { useGetAllUsersQuery } from "../../../../redux/features/user/userApi";
import { FC, useState } from "react";
import { styles } from "../../../../app/styles/style";


type Props = {
    isTeam:boolean
};

const AllUsers :FC<Props>= ({isTeam}) => {
  const { theme, setTheme } = useTheme();
  const [active,setActive]=useState(false)
  const { isLoading, error, data } = useGetAllUsersQuery({});

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "courses", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },
    {
      field: " ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button
            >
              <AiOutlineDelete
                className="dark:text-white text-black"
                size={20}
              />
            </Button>
          </>
        );
      },
    },
    {
      field: "  ",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <div className="flex justify-center items-center h-full">
            <a
              href={`mailto:${params.row.email}`}
              className="flex justify-center items-center"
            >
              <AiOutlineMail className="dark:text-white text-black" size={20} />
            </a>
          </div>
        );
      },
    },
  ];

  const rows: any = [];

  if(isTeam){
    const newData=data && data.users.filter((item:any)=>item.role==="admin")
    if (newData) {
    newData.forEach((item: any) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: capitalize(item.role),
        courses: item.courses.length,
        created_at: format(item.createdAt),
      });
    });
  }
  }else{

      if (data) {
          data.users.forEach((item: any) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: capitalize(item.role),
        courses: item.courses.length,
        created_at: format(item.createdAt),
    });
});
}
}

  return (
    <div className=" mt-30">
      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{ m: "20px" }}>
            {isTeam && (
                        <div className="w-full flex justify-end">
                            <div
                                className={`${styles.button} !w-[200px] !rounded-[10px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]`}
                                onClick={() => setActive(!active)}
                            >
                                Add New Member
                            </div>
                        </div>
                    )}
          <Box
            sx={{
              m: "40px 0 0 0",
              height: "80vh",
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
                backgroundColor: theme === "dark" ? "#1a1b2e" : "#A4A9FC",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark" ? "#1a1b2e" : "1px solid #ccc!important",
                backgroundColor: theme === "dark" ? "#1e2134" : "#fff",
                "&:hover": {
                  backgroundColor:
                    theme === "dark"
                      ? "#252644 !important"
                      : "#f3f4f6 !important",
                  color:
                    theme === "dark" ? "#fff !important" : "#000 !important",
                },
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none!important",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .name-column--cell": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#000" : "#A4A9FC",
                borderBottom: "none",
                color: theme === "dark" ? "##fff" : "#000",
                fontWeight: "600",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: theme === "dark" ? "#000" : "#000",
                fontWeight: "600",
              },
              "& .MuiDataGrid-columnHeader": {
                color: theme === "dark" ? "#000" : "#000",
                "&:focus, &:focus-within": {
                  outline: "none",
                },
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1a1b2e" : "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#4338ca" : "#A4A9FC",
              },

              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: theme === "dark" ? "#fff !important" : "#000 !important",
              },
              "& .MuiDataGrid-toolbar": {
                backgroundColor: theme === "dark" ? "#4338ca" : "#A4A9FC",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-toolbarContainer": {
                backgroundColor: theme === "dark" ? "#4338ca" : "#A4A9FC",
              },
              "& .MuiDataGrid-selectedRowCount": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-menuIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-iconButtonContainer": {
                color: theme === "dark" ? "#fff" : "#000",
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllUsers;
