import React from "react";

const getYearSuffix = (year) => {
  if (year === 1) {
    return "1st";
  } else if (year === 2) {
    return "2nd";
  } else if (year === 3) {
    return "3rd";
  } else {
    return `${year}th`;
  }
};

const ProfileCard = ({ data }) => {
  console.log(data);
  return (
    <div className="bg-main-bg">
      <div className="flex w-38rem h-25rem rounded-xl overflow-hidden relative font-poppins">
        <div className="w-1/2">
          <div class="relative w-full h-full overflow-hidden">
            <img
              className="absolute inset-0 w-full h-full object-cover scale-160"
              src={data.ImageUrl}
              alt="Profile"
            />
          </div>
        </div>

        <div className="w-1/2 bg-main-bg py-6 px-4 pb-16 relative"> 
          <div class="flex justify-center pb-4 text-3xl font-bold bg-gradient-to-r from-green-500 to-green-800 bg-clip-text text-transparent">
            <div class="border-4 border-green-500 p-1">
              Access Granted
            </div>
          </div>


          <div className="absolute right-4 text-gray-800 text-xs flex items-center">
            {data["User Type"]}

            <div className="ml-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>

          <div className="text-2xl bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
            {data.Name}
          </div>

          <div className="text-gray-800 text-xs mt-4">
            {data.Email} {data["Meeting Date"] ? data["Roll No"] : null}
          </div>

          <div className="text-gray-800 text-xs mt-1">
            {data["Meeting Date"]
              ? "Roll No: " +
                data["Roll No"] +
                ", " +
                getYearSuffix(data.Year) +
                " Year student"
              : "Roll No: 2021334, 3rd Year student"}
          </div>

          <div style={{ color: "#1A97F5" }} className="mt-4 text-xl">
            {data["Meeting Date"] ? "Meeting Details" : "Meeting Details"}
          </div>

          <div className="text-gray-800 text-xs mt-2 whitespace-pre-line">
            {data["Meeting Date"]
              ? data["Meeting Time"] +
                ", " +
                data["Meeting Date"] +
                ", \n" +
                data["Meeting Location"]
              : "1:00 PM, 16th Mar '24, \nRnD Block"}
          </div>

          <div
            style={{ color: "#1A97F5" }}
            className="text-blue-500 mt-4 text-xl"
          >
            Meeting Description
          </div>
          <div className="text-gray-800 text-xs mt-2">
            Regarding IP, I would like to meet you and discuss if there any
            projects under you which i can take.
          </div>
        </div>
        {/* <div
          style={{
            position: "absolute",
            bottom: "-0rem",
            width: "100%",
            height: "3rem",
            background: "linear-gradient(#fe8361, #f83487)",
            clipPath: "polygon(0 0, 0% 100%, 100% 100%)",
          }}
        ></div> */}
      </div>
    </div>
  );
};

export default ProfileCard;
