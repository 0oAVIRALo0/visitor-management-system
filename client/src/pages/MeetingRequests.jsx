import React, { useState, useEffect, useCallback } from "react";

import { MdOutlineSupervisorAccount } from "react-icons/md";
import { Grid, Paper, Typography } from "@mui/material";

import {
  Header,
  AcceptMeetingForm,
  RejectMeetingFromRequest,
} from "../components";

import axios from "../services/api";
import request from "../services/requests";

function MeetingRequest() {
  const [meetings, setMeetingRequests] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchMeetingRequests = useCallback(async () => {
    try {
      const response = await axios.get(request.meetingRequests, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.status === 200) {
        console.log("Meeting requests:", response.data.data);
        setMeetingRequests(response.data.data);
      } else {
        console.error(
          "Error fetching meeting requests:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchMeetingRequests();
  }, [fetchMeetingRequests]);

  const handleAccept = async (request) => {
    setSelectedMeeting(request);
    setOpenDialog(true);
    console.log("Selected Meeting:", request);

    setMeetingRequests((prevRequests) =>
      prevRequests.filter((req) => req.id !== request.id)
    );

    fetchMeetingRequests();
  };

  const handleReject = async (request) => {
    try {
      const deleteRequestResult = await RejectMeetingFromRequest(request);

      if (deleteRequestResult.success) {
        setMeetingRequests((prevRequests) =>
          prevRequests.filter((req) => req.id !== request.id)
        );

        fetchMeetingRequests();
      } else {
        console.error(
          "Error deleting meeting request:",
          deleteRequestResult.error
        );
        alert("An error occurred while rejecting the meeting request");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while rejecting the meeting request");
    }
  };

  return (
    <div className="m-2 md:m-10 mt-20 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Meetings" title="Meeting Requests" />

      <Grid container spacing={3}>
        {meetings.map((request) => (
          <Grid item key={request.id} xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={0}
              style={{
                borderRadius: "1rem",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
              className="p-4 shadow-sm mb-6"
            >
              <div className="flex items-center">
                <div className="text-3xl rounded-[20%] p-4 bg-cyan-100 text-cyan-500">
                  <MdOutlineSupervisorAccount />
                </div>

                <div className="ml-4">
                  <Typography variant="h6">{request.senderName}</Typography>

                  <div className="space-x-2 mt-1">
                    <button
                      className="bg-teal-500 hover:bg-teal-600 text-white text-sm py-0.5 px-2 rounded"
                      onClick={() => handleAccept(request)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white text-sm py-0.5 px-2 rounded"
                      onClick={() => handleReject(request)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>

              <Typography
                variant="body1"
                style={{ marginTop: "1rem" }}
                className="text-gray-400 mt-4"
              >
                {request.meetingDescription}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <AcceptMeetingForm
        selectedMeeting={selectedMeeting}
        setSelectedMeeting={setSelectedMeeting}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </div>
  );
}

export default MeetingRequest;
