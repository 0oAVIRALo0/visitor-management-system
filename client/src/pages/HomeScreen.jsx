import React, { useEffect, useState } from "react";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { Button } from "../components";

import { useStateContext } from "../contexts/ContextProvider";

import Spline from '@splinetool/react-spline';
import homescreen from "/vectorImages/homescreen.svg";

import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

import axios from "../services/api";
import request from "../services/requests";

const clientID = "638350294661-ldfnn1crje198q6ph0utgfr1ck1rodqa.apps.googleusercontent.com";

const HomeScreen = () => {
  const { userData, currentColor } = useStateContext();
  const [noOfMeetings, setNoOfMeetings] = useState(0);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(request.numberOfMeetings, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (response.status === 200) {
          console.log(response.data.numberOfMeetings);
          setNoOfMeetings(response.data.numberOfMeetings); 
        } else {
          console.error(
            "Error fetching accepted meetings:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMeetings();
  }, []);

  function GoogleLoginButton() {
    const googleLogin = useGoogleLogin({
      flow: "auth-code",
      onSuccess: async (codeResponse) => {
        console.log(codeResponse);
        console.log("code: ", codeResponse.code);
        try {
          const tokens = await axios.post(
            "http://localhost:8083/auth/google",
            {
              code: codeResponse.code,
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          console.log("data: ", tokens.data);
        } catch (error) {
          console.log("Error:", error);
        }
      },
      onError: (errorResponse) => console.log(errorResponse),
    });

    return (
      <Button
        color="white"
        bgColor={currentColor}
        text="Sign-In With Google"
        borderRadius="10px"
        customFunc={googleLogin}
      />
    );
  }

  return (
    <div className="m-2 md:m-10 mt-20 p-2 md:p-10 bg-white rounded-3xl">
      {userData.userType != 'security' ?
        <div className="flex justify-between w-full">
          <div>
            <p className="font-bold text-gray-500 text-xl font-poppins">Today's Meetings:</p>
            <p className="text-4xl font-poppins">{noOfMeetings}</p> 
          </div>
          <div className="mt-4 flex">
            {userData["profileUpdated"] ? (
              <GoogleOAuthProvider clientId={clientID}>
                <GoogleLoginButton />
              </GoogleOAuthProvider>
            ) : (
              <Button
                color="white"
                bgColor={currentColor}
                text="Update your profile"
                borderRadius="10px"
                icon={<ErrorOutlineIcon style={{ color: "red" }} />}
                to="/form"
              />
            )}
          </div>
        </div>
        :
        <></>
      }
      <div className="mt-4 ml-40">
        <img src={homescreen} alt="Home Screen" className="w-4/5 h-auto" />
      </div>
    </div>
  );
};

export default HomeScreen;
