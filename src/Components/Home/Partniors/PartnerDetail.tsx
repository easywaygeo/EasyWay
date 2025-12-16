import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./CSS/PartnerDetail.css";
import { ThemeContext } from "../../../Hooks/ThemeContext";
import { LanguageContext } from "../../../Hooks/LanguageContext";


const translations = {
  ge: {
    location: "მდებარეობა:",
    phone: "ტელეფონი:",
    description: "აღწერა:"
  },
  en: {
    location: "Location:",
    phone: "Phone:",
    description: "Description:"
  }
}

interface Partner {
  _id: string;
  companyName: string;
  description: string;
  images: string[];
  location: string;
  phone: string;
}

const PartnerDetail = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  //   const [showModal, setShowModal] = useState(false);

  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("ThemeContext.Provider is missing");
  }
  const { isDark } = theme;

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await axios.post(
          "https://easyway-nbqn.onrender.com/getPartnerById",
          {
            id,
          }
        );
        setPartner(res.data.partner);
      } catch (err) {
        console.error("Failed to load partner detail", err);
      }
    };

    fetchPartner();
  }, [id]);

  if (!partner) return <p>Loading...</p>;

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

const langCtx = useContext(LanguageContext);
  if (!langCtx) throw new Error("LanguageContext.Provider is missing");
  const { language } = langCtx;

  const t = translations[language];

  return (
    <div className={`partner-detail ${isDark ? "dark" : ""}`}>
      <div className="partner-detail-content">
        {/* LEFT SIDE: image and thumbnails */}
        <div className="image-section">
          <img
            src={partner.images[selectedIndex]}
            alt="Main"
            className="main-image"
            onClick={() => handleImageClick(selectedIndex)}
          />
          <div className="thumbnail-row">
            {partner.images.slice(0, 4).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumb ${index}`}
                className={`thumbnail ${
                  selectedIndex === index ? "active" : ""
                }`}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: company info */}
        <div className="info-section">
          <h1
            style={{
              color: isDark ? "#f8fafc" : "",
              transition: "color 0.2s ease-in-out",
            }}
          >
            {partner.companyName}
          </h1>
          <p
            style={{
              color: isDark ? "#f8fafc" : "",
              transition: "color 0.2s ease-in-out",
            }}
          >
            <strong>{t.location}</strong> {partner.location}
          </p>
          <p
            style={{
              color: isDark ? "#f8fafc" : "",
              transition: "color 0.2s ease-in-out",
            }}
          >
            <strong>{t.phone}</strong> {partner.phone}
          </p>
          <p
            style={{
              color: isDark ? "#f8fafc" : "",
              transition: "color 0.2s ease-in-out",
            }}
          >
            <strong>{t.description}</strong> {partner.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetail;
