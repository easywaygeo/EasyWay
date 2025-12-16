import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Partniors.css";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../Hooks/ThemeContext";
import { LanguageContext } from "../../../Hooks/LanguageContext";

interface Partner {
  id: string;
  imageUrl: string;
  companyName: string;
  description: string;
}

type RawPartner = {
  _id: string;
  images: string[];
  companyName: string;
  description?: string;
};

const translations = {
  ge: {
    title: "ჩვენი პარტნიორები",
    description:
      "გახდი ჩვენი პარტნიორების მომხმარებელი და მიიღე ექსკლუზიური ულიმიტო ფასდაკლება.",
  },
  en: {
    title: "Our Partners",
    description:
      "Become a user of our partners and get exclusive unlimited discounts.",
  },
};

const Partniors: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const navigate = useNavigate();

  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("ThemeContext.Provider is missing");
  }
  const { isDark } = theme;

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await axios.post(
          "https://easyway-nbqn.onrender.comloadPartners"
        );
        const formatted: Partner[] = (res.data.partners as RawPartner[]).map(
          (p) => ({
            id: p._id,
            imageUrl: p.images?.[0] || "",
            companyName: p.companyName,
            description: p.description || "",
          })
        );

        setPartners(formatted);
      } catch (err) {
        console.error("Failed to load partners", err);
      }
    };

    fetchPartners();
  }, []);

  const langCtx = useContext(LanguageContext);
  if (!langCtx) throw new Error("LanguageContext.Provider is missing");
  const { language } = langCtx;

  const t = translations[language];

  return (
    <div className={`partners-section ${isDark ? "dark" : ""}`}>
      <div className="partners-header">
        <h1 className={`partners-title ${isDark ? "dark" : ""}`}>{t.title}</h1>
        <p className={`partners-description ${isDark ? "dark" : ""}`}>
          {t.description}
        </p>
      </div>

      <div className="partners-list">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className={`partners-card ${isDark ? "dark" : ""}`}
            onClick={() => navigate(`/partners/${partner.id}`)} // ✅ click to navigate
            style={{ cursor: "pointer" }}
          >
            <img
              src={partner.imageUrl}
              alt={partner.companyName}
              className="partner-logo"
            />
            <div className="partner-info">
              <p className={`partner-name ${isDark ? "dark" : ""}`}>
                {partner.companyName}
              </p>
              <p className={`partner-description ${isDark ? "dark" : ""}`}>
                {partner.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partniors;
