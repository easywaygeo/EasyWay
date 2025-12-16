import Form from "./Form";
import "./CSS/Auth.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usePacket } from "../../Hooks/PacketContext";

type FormDataTypes = {
  userName: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const [msg, setMsg] = useState<string>("");
  const navigate = useNavigate();
  const { selectedPacket } = usePacket();

  useEffect(() => {
    if (!selectedPacket) {
      window.alert("რეგისტრაციამდე გთხოვთ შეარჩიოთ ერთ-ერთი პაკეტი");
      navigate("/packets");
    }
  }, [selectedPacket, navigate]);

  const handleSignUp = async ({ userName, email, password }: FormDataTypes) => {
    if (!userName || !email || !password || !selectedPacket) {
      setMsg("გთხოვთ შეავსოთ ყველა ველი");
      return;
    }

    try {
      setMsg("გადამისამართება ბანკზე...");
      console.log("Sending request to backend...");

      // Save user data temporarily
      localStorage.setItem(
        "pendingUser",
        JSON.stringify({ userName, email, password, selectedPacket })
      );
      console.log({
        duration: selectedPacket?.duration,
        type: selectedPacket?.type,
        price: selectedPacket?.price.replace(/[^\d.]/g, ""),
        userName,
        email,
        password,
        selectedPacket,
      });

      // Create BOG order
      const response = await axios.post(
        "https://easyway-nbqn.onrender.com/create-order",
        {
          duration: selectedPacket.duration,
          type: selectedPacket.type,
          price: selectedPacket.price.replace(/[^\d.]/g, ""),
          userName,
          email,
          password,
          selectedPacket,
        }
      );

      console.log("BOG order response:", response.data);

      const redirectUrl: string | undefined =
        response.data?._links?.redirect?.href;

      if (redirectUrl) {
        console.log("Redirecting to BOG payment page:", redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.log("Redirect URL not found in response");
        setMsg("ბანკის გადამისამართების ბმული ვერ მოიძებნა");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Payment initiation error:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unknown error:", error);
      }
      setMsg("დაფიქსირდა შეცდომა გადახდის წამოწყებისას");
    }
  };

  return (
    <div className="auth-container">
      <Form handleAuth={handleSignUp} msg={msg} authType="SignUp" />
    </div>
  );
};

export default SignUp;
