import { useEffect } from "react";
import { BiError, BiCheck } from "react-icons/bi";
import "./alert.css";

type AlertProps = {
  message: string;
  status: "error" | "success";
  onClose: () => void;
};

const Alert = ({ message, status, onClose }: AlertProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer); // limpia si se desmonta
  }, []);

  return (
    <div
      className={
        status === "error" ? "alert-container error" : "alert-container success"
      }
    >
      {status === "error" ? <BiError size={20}/> : <BiCheck size={20}/>}
      <p>{message}</p>
    </div>
  );
};

export default Alert;
