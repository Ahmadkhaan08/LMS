import { Box, Modal } from "@mui/material";
import React, { FC } from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: any;
  component: any;
  setRoute?: (route: string) => void;
  refetch?:any
};

const CustomModel: FC<Props> = ({
  open,
  setOpen,
  setRoute,
  component: Component,
  refetch
}) => {
  return (
    <Modal
      open={open}
      onClose={()=>setOpen(false)}
      disableScrollLock
      aria-labelledby="model-model-title"
      aria-describedby="model-model-description"
    >
      <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-112.5 bg-white dark:bg-slate-900 rounded-xl shadow p-6   outline-none">
        <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch}/>
      </Box>
    </Modal>
  );
};

export default CustomModel;
