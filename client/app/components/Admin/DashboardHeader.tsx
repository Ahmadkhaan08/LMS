"use client";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "../../../redux/features/notifications/notificationApi";
import { ThemeSwitcher } from "../../../app/utilis/ThemeSwitcher";
import { FC, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const [notifications, setNotifications] = useState<any>([]);
  const { data, refetch } = useGetAllNotificationsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();


  const [audio] = useState<any>(
    typeof window !== "undefined"
      ? new Audio(
          "https://res.cloudinary.com/dasdrngo1/video/upload/v1715355770/notifications/mixkit-bubble-pop-up-alert-notification-2357_wbwviv.wav",
        )
      : null,
  );

  const playNotificationSound = () => {
    if (audio) {
      audio.play().catch((err: any) => console.log("Audio error:", err));
    }
  };

  useEffect(() => {
    if (data && data.notifications) {
      setNotifications(
        data.notifications.filter((item: any) => item.status === "unread"),
      );
    }
  }, [data]);

  useEffect(() => {
    const handleNewNotification = () => {
      refetch();
      playNotificationSound();
    };

    socketId.on("newNotification", handleNewNotification);

    return () => {
      socketId.off("newNotification", handleNewNotification);
    };
  }, [refetch]);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
    refetch();
  };
 

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {notifications && notifications.length}
        </span>
      </div>
      {open && (
        <div className="w-[350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-10 rounded">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>
          {notifications &&
            notifications.map((item: any, index: number) => (
              <div
                className="dark:bg-slate-800/50 bg-gray-50/50 font-Poppins border border-gray-100 dark:border-slate-700/50 rounded-lg mb-2 p-3 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
                key={index}
              >
                <div className="w-full flex items-center justify-between pb-2">
                  <p className="text-black dark:text-white font-medium">
                    {item.title}
                  </p>
                  <p
                    className="text-blue-600 dark:text-blue-400 cursor-pointer text-sm hover:underline"
                    onClick={() => handleNotificationStatusChange(item._id)}
                  >
                    Mark as read
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {item.message}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-[12px] mt-2 font-medium">
                  {format(item.createdAt)}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
