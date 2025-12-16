import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import "./CSS/AddPartner.css";

const AddPartner = () => {
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).slice(0, 10);
    setFiles(selected);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("phone", phone);
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await axios.post(
        "https://easyway-nbqn.onrender.com/addPartner",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMsg(res.data.message || "პარტნიორი დაემატა წარმატებით");
      setCompanyName("");
      setDescription("");
      setLocation("");
      setFiles([]);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setMsg(error.response?.data?.message || "შეცდომა პარტნიორის დამატებისას");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-partner-form">
      <h2>დამატე პარტნიორი კომპანია</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            placeholder="კომპანიის სახელი"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="text"
            placeholder="ლოკაცია (მაგ: თბილისი)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="tel"
            placeholder="ტელეფონის ნომერი"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <label>
          <textarea
            placeholder="კომპანიის აღწერა"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </label>
        <label htmlFor="imageUpload" className="custom-file-upload">
          სურათები (მაქსიმუმ 10 სურათი)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            id="imageUpload"
            name="images"
          />
        </label>
        {files.length > 0 && <p>{files.length} სურათი დამატებულია</p>}
        <button type="submit" className="submitPartner-btn" disabled={loading}>
          {loading ? "იტვირთება..." : "დამატება"}
        </button>
        {msg && <p className="feedback">{msg}</p>}
      </form>
    </div>
  );
};

export default AddPartner;
