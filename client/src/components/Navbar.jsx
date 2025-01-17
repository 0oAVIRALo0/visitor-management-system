import React, { useEffect } from "react";

import { AiOutlineMenu } from "react-icons/ai";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { Notification, UserProfile } from ".";

import { useStateContext } from "../contexts/ContextProvider";

const NavButton = ({ customFunc, icon, color, dotColor }) => (
  <button
    type="button"
    onClick={() => customFunc()}
    style={{ color }}
    className="relative text-xl rounded-full p-3"
  >
    <span
      style={{ background: dotColor }}
      className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
    />
    {icon}
  </button>
);

const Navbar = () => {
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
    userData,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="flex justify-between p-2 md:mr-6 relative">
      <div className="flex items-center">
        <NavButton
          title="Menu"
          customFunc={handleActiveMenu}
          color={currentColor}
          icon={<AiOutlineMenu />}
        />
        <p className="ml-2">
          <span className="text-gray-700 text-2xl font-poppins">Hi,</span>{" "}
          <span className="text-gray-700 font-bold ml-1 text-2xl font-poppins">
            {userData.userType === 'security' ? 'security' : userData.name}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        {userData.userType !== 'security' ? (
          <NavButton
            title="Notification"
            dotColor="rgb(254, 201, 15)"
            customFunc={() => handleClick("notification")}
            color={currentColor}
            icon={<RiNotification3Line />}
          />
        ) : (
          <></>
        )}

        <div
          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
          onClick={() => handleClick("userProfile")}
        >
          <div>
            {userData.imageUrl ? (
              <img
                src={userData.imageUrl}
                alt="User Image"
                className="w-12 h-12 rounded-[20%]"
              />
            ) : (
              <div className="text-lg rounded-[20%] p-2 bg-teal-100 text-teal-500">
                <MdOutlineSupervisorAccount />
              </div>
            )}
          </div>
          {/* 
          <p>
            <span className="text-gray-400 text-14">Hi,</span>{" "}
            <span className="text-gray-400 font-bold ml-1 text-14">
              {userData.name}
            </span>
          </p>
          <MdKeyboardArrowDown className="text-gray-400 text-14" /> */}
        </div>

        {userData.userType !== 'security' ? (
          isClicked.notification && <Notification />
        ) : (
          <></>
        )}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
