import React, { useEffect, useState } from "react";

import io from "socket.io-client";

import { Dialog } from "@mui/material";

import ProfileCard from "./ProfileCard";

const socket = io("http://localhost:8080");

function PopUp() {
  const [openDialogs, setOpenDialogs] = useState([]);

  useEffect(() => {
    socket.on("newEntry", (data) => {
      setOpenDialogs((prevDialogs) => [
        ...prevDialogs,
        { id: Date.now(), open: true, entryData: data },
      ]);
    });

    return () => {
      socket.off("newEntry");
    };
  }, []);

  const handleClose = (id) => {
    setOpenDialogs((prevDialogs) =>
      prevDialogs.filter((dialog) => dialog.id !== id)
    );
  };

  return (
    <div>
      {openDialogs.map((dialog) => (
        <Dialog
          key={dialog.id}
          open={dialog.open}
          onClose={() => handleClose(dialog.id)}
        >
          <ProfileCard data={dialog.entryData.data[0]}/>
        </Dialog>
      ))}
    </div>
  );
}

export default PopUp;

{/* {Object.entries(dialog.entryData.data[0])
  .filter(([key]) => key !== "ImageUrl")
  .map(([key, value]) => (
    <div key={key}>
      <Typography fontWeight="bold" noWrap gutterBottom>
        {`${key}: `}
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight="regular"
        >
          {value}
        </Typography>
      </Typography>
    </div>
  ))} */}