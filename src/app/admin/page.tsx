"use client";
import { useState, FormEvent, ChangeEvent } from "react";

interface ScheduleData {
  title: string;
  event_type: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  day_of_week: string;
  is_recurring: boolean;
}

const EVENT_TYPES = [
  { value: "tournament", label: "Tournament" },
  { value: "open_gym", label: "Open Gym" },
];

const DAYS_OF_WEEK = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

export default function AdminPage() {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    title: "",
    event_type: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    day_of_week: "",
    is_recurring: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      });

      if (response.ok) {
        alert("Schedule item added!");
        // Reset form
        setScheduleData({
          title: "",
          event_type: "",
          description: "",
          date: "",
          start_time: "",
          end_time: "",
          day_of_week: "",
          is_recurring: false,
        });
      } else {
        alert("Error adding schedule item");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert("Error: " + errorMessage);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setScheduleData({ ...scheduleData, [name]: checked });
    } else {
      setScheduleData({ ...scheduleData, [name]: value });
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Admin Panel</h1>

      <h2>Add Schedule Item</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={scheduleData.title}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Event Type:</label>
          <select
            name="event_type"
            value={scheduleData.event_type}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          >
            <option value="">Select event type</option>
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Description:</label>
          <textarea
            name="description"
            value={scheduleData.description}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              height: "100px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Event Date:</label>
          <input
            type="date"
            name="event_date"
            value={scheduleData.date}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Start Time:</label>
          <input
            type="time"
            name="start_time"
            value={scheduleData.start_time}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>End Time:</label>
          <input
            type="time"
            name="end_time"
            value={scheduleData.end_time}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Day of Week (for recurring):</label>
          <select
            name="day_of_week"
            value={scheduleData.day_of_week}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          >
            <option value="">Select day</option>
            {DAYS_OF_WEEK.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input
              type="checkbox"
              name="is_recurring"
              checked={scheduleData.is_recurring}
              onChange={handleInputChange}
            />
            Recurring event
          </label>
        </div>

        <button
          type="submit"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Add Schedule Item
        </button>
      </form>
    </div>
  );
}
