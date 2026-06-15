"use client";
import { Box, Button, capitalize, Modal } from "@mui/material";
import { useTheme } from "next-themes";
import { format } from "timeago.js";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../Loader/Loader";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "../../../../redux/features/user/userApi";
import { FC, useEffect, useState } from "react";
import { styles } from "../../../../app/styles/style";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

type Props = {
  isTeam: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("admin");
  const { isLoading, error, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation({});
  const [updateUserRole, { isSuccess, error: updateError }] =
    useUpdateUserRoleMutation();

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError as any;
        toast.error(errorMessage.data.message);
      }
    }

    if (isSuccess) {
      toast.success("User role updated successfully");
      setActive(false);
      refetch();
    }
    if (deleteSuccess) {
      refetch();
      toast.success("Delete user successfully!");
      setOpen(false);
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [deleteError, deleteSuccess, updateError, isSuccess, refetch]);
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
              onClick={() => {
                setOpen(!open);
                setUserId(params.row.id);
              }}
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

  if (isTeam) {
    const newData =
      data && data.users.filter((item: any) => item.role === "admin");
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
  } else {
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
  const handleSubmit = async () => {
    await updateUserRole({ email, role });
  };

  const handleDelete = async () => {
    const id = userId;
    await deleteUser(id);
  };
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
          {active && (
            <Modal
              open={active}
              onClose={() => setActive(!active)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>Add New Member</h1>
                <div className="mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    className={`${styles.input}`}
                  />
                  <select
                    name=""
                    id=""
                    className={`${styles.input} !mt-6 text-black`}
                    onChange={(e: any) => setRole(e.target.value)}
                  >
                    <option value="admin" className="text-black">
                      Admin
                    </option>
                    <option className="text-black" value="user">
                      User
                    </option>
                  </select>
                  <br />
                  <div>
                    <button
                      type="button"
                      disabled={isLoading}
                      className={`${styles.button} my-6 !h-[30px] ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      onClick={handleSubmit}
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" size={20} />
                          Updating...
                        </>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </div>
              </Box>
            </Modal>
          )}
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#57c7a3]!`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </div>
                  <div>
                    <button
                      type="button"
                      disabled={isLoading}
                      className={`${styles.button} bg-[#d63f3f]! ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      onClick={handleDelete}
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" size={20} />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllUsers;
