import { useToken } from "../../Hooks/TokenContext";
import Card from "./Card";
import "./CSS/UserProfile.css";
import { useEffect, useState } from "react";
import axios from "axios";

type CardType = {
  _id: string;
  cardId: string;
  cardUser: string;
  duration: string;
  startDate: string;
  endDate: string;
  partnerCompany: {
    companyName: string;
    companyId: string;
  };
};

const UserProfile = () => {
  const { decoded } = useToken();
  const [userCards, setUserCards] = useState<CardType[]>([]);

  useEffect(() => {
    if (!decoded || !decoded.id) return;

    axios
      .post("https://easyway-nbqn.onrender.comuser/cards", {
        userId: decoded.id,
      })
      .then((response) => {
        const cards = response.data;
        setUserCards(cards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [decoded]);

  return (
    <div className="profile-container">
      <div className="profile-upperPart">
        <h1>გამარჯობა: {decoded?.userName}</h1>
        <h2 style={{ fontSize: "30px" }}>პროფილი</h2>
      </div>

      {userCards.length > 0 ? (
        <div className="profile-card-part">
          {userCards.map((card) => (
            <Card key={card._id} card={card} />
          ))}
        </div>
      ) : (
        <p style={{ marginLeft: "30px" }}>ბარათი ჯერ არ გაქვს</p>
      )}
      <p style={{ paddingInline: "30px" }}>
        თქვენი ბარათის ID აუცილებელია პარტნიორ კომპანიებში იდენტიფიკაციისთვის.
        გთხოვთ, არ გაუზიაროთ იგი სხვა პირებს. ბარათის ID-ის ნახვა შეგიძლიათ
        ბარათის უკანა მხარზე დაჭერით.
      </p>
    </div>
  );
};

export default UserProfile;
