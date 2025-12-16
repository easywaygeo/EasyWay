import Form from "./Form";
import "./CSS/Auth.css";
import axios from "axios";
import Cookie from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormDataTypes = {
  userName: string;
  email: string;
  password: string;
};

const SignIn = () => {
  const [msg, setMsg] = useState<string>("");
  const navigate = useNavigate();

  const handleSignIn = ({ email, password }: FormDataTypes) => {
    if (!email || !password) {
      return console.log("გთხოვთ შეავსოთ ყველა ველი");
    }

    // https://easyway-nbqn.onrender.com/
    axios
      .post("https://easyway-nbqn.onrender.com/signin", {
        email,
        password,
      })
      .then((response) => {
        const { token, message } = response.data;

        // ✅ Set auth cookie
        Cookie.set("userAuthToken", token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });

        // ✅ Remove leftover packet (if any)
        localStorage.removeItem("selectedPacket");

        setMsg(message);
        setTimeout(() => {
          setMsg("");
          navigate("/");
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        console.log("მოხდა რაღაც შეცდომა შესვლის დროს", err);
      });
  };

  return (
    <div className="auth-container">
      <Form handleAuth={handleSignIn} msg={msg} authType={"SignIn"} />
    </div>
  );
};

export default SignIn;
