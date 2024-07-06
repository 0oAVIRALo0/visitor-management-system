import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ icon, bgColor, color, bgHoverColor, size, text, borderRadius, width, customFunc, to }) => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    if (to) {
      navigate(to); 
    }
    if (customFunc) {
      customFunc();
    }
  };

  return (
    <button
      type="button"
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={`flex items-center justify-center text-${size} p-2 w-${width} hover:drop-shadow-xl `}
      onClick={handleClick}
    >
      {icon && React.cloneElement(icon, { size: "2em"})}
      <span>{text}</span>
    </button>
  );
};

export default Button;
