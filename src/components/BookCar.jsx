import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BookCar() {
  const [brand, setBrand] = useState("");
  const [location, setLocation] = useState("");
  const [pickTime, setPickTime] = useState("");
  const [dropTime, setDropTime] = useState("");
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["homeData"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5050/api/home");
      return res.data;
    },
  });

  const toggleModal = async (e) => {
    e.preventDefault();

    const errorMsg = document.querySelector(".error-message");
    errorMsg.style.display = "none";

    const page = 1;
    const limit = 10;

    try {
      const res = await axios.get(
        `http://localhost:5050/api/cars?brand=${encodeURIComponent(
          brand
        )}&location=${encodeURIComponent(location)}&pickTime=${encodeURIComponent(pickTime)}&dropTime=${encodeURIComponent(dropTime)}&page=${page}&limit=${limit}`
      );

      const resultData = res.data;
      const cars = resultData.data;

      if (cars && cars.length > 0) {
        const enhancedResultData = {
          ...resultData,
          searchFilters: {
            brand: brand,
            location: location,
            pickTime: pickTime,
            dropTime: dropTime
          }
        };

        navigate("/results", { 
          state: { 
            resultData: enhancedResultData
          } 
        });
      } else {
        alert("No matching cars were found");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("An error occurred while searching for cars.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const brands = data?.brands || [];
  const locations = data?.regions?.map((region) => region.name_en) || [];

  return (
    <section id="booking-section" className="book-section">
      <div className="container">
        <div className="book-content">
          <div className="book-content__box">
            <h2>Book a car</h2>

            <p className="error-message" style={{ display: "none" }}>
              All fields are required!<i className="fa-solid fa-xmark"></i>
            </p>

            <form className="box-form" onSubmit={toggleModal}>
              <div className="box-form__car-type">
                <label>
                  <i className="fa-solid fa-car"></i> &nbsp; Choose a car brand <b></b>
                </label>
                <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                  <option value="">Choose your car brand</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="box-form__car-type">
                <label>
                  <i className="fa-solid fa-location-dot"></i> &nbsp; Pick-up Location <b></b>
                </label>
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="">Choose a pickup location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="box-form__car-time">
                <label htmlFor="picktime">
                  <i className="fa-regular fa-calendar-days"></i> &nbsp;Time of Pick-up <b></b>
                </label>
                <input
                  id="picktime"
                  type="date"
                  value={pickTime}
                  onChange={(e) => setPickTime(e.target.value)}
                />
              </div>

              <div className="box-form__car-time">
                <label htmlFor="droptime">
                  <i className="fa-regular fa-calendar-days"></i> &nbsp; Time of Drop-off <b></b>
                </label>
                <input
                  id="droptime"
                  type="date"
                  value={dropTime}
                  onChange={(e) => setDropTime(e.target.value)}
                />
              </div>

              <button type="submit">Search</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookCar;