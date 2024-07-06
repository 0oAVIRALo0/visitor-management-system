import React from "react";
import { Header } from "../components";

function Calendar() {

  return (
    <div className="m-2 md:m-10 mt-20 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Calendar" title="Calendar" />
      <div className="flex justify-center items-center">
        <iframe 
          src="https://calendar.google.com/calendar/embed?src=singh.mahansh%40gmail.com&ctz=Asia%2FKolkata" 
          style={{ border: "0", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} 
          className="w-full h-96 md:h-128 rounded-2xl overflow-hidden"
          title="Google Calendar"
        >
        </iframe>
      </div>
    </div>
  );
}

export default Calendar;
