import React, { useState, memo, useMemo } from "react";
import ursData from "../data/urs.json";
import "../styles/urs.css";

function addMonths(date, months) {
   const d = new Date(date);
   d.setMonth(d.getMonth() + months);
   return d;
}

export default function UrsCalendar() {
   const [selectedUrs, setSelectedUrs] = useState(null);
   const [baseMonth, setBaseMonth] = useState(new Date());

   const upcomingThisMonth = useMemo(() => {
      const today = new Date();
      return ursData.filter((u) => ursHasMonth(u, today.getMonth()));
   }, []);

   const months = [0, 1, 2].map((i) => addMonths(baseMonth, i));

   const prev = () => setBaseMonth((m) => addMonths(m, -1));
   const next = () => setBaseMonth((m) => addMonths(m, 1));

   return (
      <div className="urs-container">
         <section className="upcoming-urs-section">
            <h2>Upcoming Urs</h2>
            <div className="upcoming-urs-list">
               {upcomingThisMonth.length > 0 ? (
                  upcomingThisMonth.map((urs) => (
                     <div key={urs.id} className="urs-card highlighted" onClick={() => setSelectedUrs(urs)}>
                        <div className="urs-card-header">
                           <h3>{urs.name}</h3>
                           <span className="urs-date">{urs.ursDateGregorian}</span>
                        </div>
                        <p className="urs-card-location">{urs.location}</p>
                     </div>
                  ))
               ) : (
                  <p className="no-urs">No Urs events this month</p>
               )}
            </div>
         </section>

         <section className="calendar-section">
            <div className="calendar-header">
               <button onClick={prev} className="nav-btn">❮</button>
               <h2>Three Month Overview</h2>
               <button onClick={next} className="nav-btn">❯</button>
            </div>

            <div className="three-months-grid">
               {months.map((m) => (
                  <div className="mini-month" key={m.toISOString()}>
                     <div className="mini-header">{m.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
                     <div className="mini-weekdays">
                        <div className="weekday">Sun</div>
                        <div className="weekday">Mon</div>
                        <div className="weekday">Tue</div>
                        <div className="weekday">Wed</div>
                        <div className="weekday">Thu</div>
                        <div className="weekday">Fri</div>
                        <div className="weekday">Sat</div>
                     </div>
                     <div className="mini-days">
                        <CalendarDays month={m} ursData={ursData} onSelectUrs={setSelectedUrs} />
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {selectedUrs && <UrsDetailPopup urs={selectedUrs} onClose={() => setSelectedUrs(null)} />}
      </div>
   );
}

function ursHasMonth(urs, monthIndex) {
   if (!urs.ursDateGregorian) return false;
   const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];
   const mName = monthNames[monthIndex];
   return urs.ursDateGregorian.includes(mName);
}

const CalendarDays = memo(function CalendarDays({ month, ursData, onSelectUrs }) {
   const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
   const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
   const days = [];

   const ursOnDate = (day) => {
      const monthName = month.toLocaleDateString("en-US", { month: "long" });
      return ursData.filter((u) => {
         if (!u.ursDateGregorian) return false;
         if (!u.ursDateGregorian.includes(monthName)) return false;
         const nums = (u.ursDateGregorian.match(/\d+/g) || []).map((n) => parseInt(n, 10));
         if (nums.length === 0) return true;
         for (let i = 0; i < nums.length; i++) {
            if (nums[i] === day) return true;
            if (i + 1 < nums.length && nums[i + 1] > nums[i]) {
               if (day >= nums[i] && day <= nums[i + 1]) return true;
            }
         }
         return false;
      });
   };

   for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="calendar-day empty" />);

   for (let day = 1; day <= daysInMonth; day++) {
      const ursList = ursOnDate(day);
      days.push(
         <div
            key={day}
            className={`calendar-day ${ursList.length > 0 ? "has-urs" : ""}`}
            onClick={() => ursList.length > 0 && onSelectUrs(ursList[0])}
         >
            <span className="day-number">{day}</span>
            {ursList.length > 0 && (
               <div className="urs-list">
                  {ursList.slice(0, 2).map((u) => (
                     <div key={u.id} className="urs-label">{u.name}</div>
                  ))}
                  {ursList.length > 2 && <div className="urs-more">+{ursList.length - 2}</div>}
               </div>
            )}
         </div>
      );
   }

   return <>{days}</>;
});

const UrsDetailPopup = memo(function UrsDetailPopup({ urs, onClose }) {
   return (
      <div className="urs-popup-overlay" onClick={onClose}>
         <div className="urs-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popupbtn-close" onClick={onClose}>×</button>
            <div className="urs-popup-content">
               <h2>{urs.name}</h2>
               {urs.titleArabic && <p className="title-arabic">{urs.titleArabic}</p>}

               <div className="urs-details">
                  <div className="detail-row">
                     <strong>Date of Birth:</strong>
                     <span>{urs.dateOfBirth || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Date of Death:</strong>
                     <span>{urs.dateOfDeath || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Urs Date (Islamic):</strong>
                     <span>{urs.ursDate}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Urs Date (Gregorian):</strong>
                     <span>{urs.ursDateGregorian}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Khanqah:</strong>
                     <span>{urs.khanqahName || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Sajjada Nashin:</strong>
                     <span>{urs.sajjadaName || "None"}</span>
                  </div>
                  <div className="detail-row">
                     <strong>Location:</strong>
                     <span>{urs.location || "None"}</span>
                  </div>
                  {urs.mapLink && (
                     <div className="detail-row">
                        <a href={urs.mapLink} target="_blank" rel="noopener noreferrer" className="map-link">
                           🗺️ View on Google Maps
                        </a>
                     </div>
                  )}
               </div>

               {urs.description && (
                  <div className="urs-description">
                     <h3>About</h3>
                     <p>{urs.description}</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
});
