"use client";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";

interface ScheduleData {
  id?: string;
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

const initialScheduleData: ScheduleData = {
  title: "",
  event_type: "",
  description: "",
  date: "",
  start_time: "",
  end_time: "",
  day_of_week: "",
  is_recurring: false,
};

export default function AdminPage() {
  const [scheduleData, setScheduleData] =
    useState<ScheduleData>(initialScheduleData);
  const [existingEvents, setExistingEvents] = useState<ScheduleData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/schedule");
      if (response.ok) {
        const data = await response.json();
        setExistingEvents(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId
        ? `/api/admin/schedule?id=${editingId}`
        : "/api/admin/schedule";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      });

      if (response.ok) {
        alert(editingId ? "Schedule item updated!" : "Schedule item added!");
        resetForm();
        fetchEvents(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert("Error: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: ScheduleData) => {
    setScheduleData(event);
    setEditingId(event.id || null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/schedule?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Schedule item deleted!");
        fetchEvents(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert("Error: " + errorMessage);
    }
  };

  const resetForm = () => {
    setScheduleData(initialScheduleData);
    setEditingId(null);
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

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    // For TIME fields, just format as HH:MM
    return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Admin Panel</h1>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
      >
        {/* Form Section */}
        <div>
          <h2>{editingId ? "Edit Schedule Item" : "Add Schedule Item"}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={scheduleData.title}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.25rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>Event Type:</label>
              <select
                name="event_type"
                value={scheduleData.event_type}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.25rem",
                }}
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
                name="date"
                value={scheduleData.date}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.25rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>Start Time:</label>
              <input
                type="time"
                name="start_time"
                value={scheduleData.start_time}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.25rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>End Time:</label>
              <input
                type="time"
                name="end_time"
                value={scheduleData.end_time}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.25rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>Day of Week (for recurring):</label>
              <select
                name="day_of_week"
                value={scheduleData.day_of_week}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.25rem",
                }}
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

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: editingId ? "#f59e0b" : "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading
                  ? "Processing..."
                  : editingId
                  ? "Update Event"
                  : "Add Event"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Events List Section */}
        <div>
          <h2>Existing Events</h2>
          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {existingEvents.length === 0 ? (
              <p>No events found.</p>
            ) : (
              existingEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    backgroundColor:
                      editingId === event.id ? "#f0f9ff" : "white",
                  }}
                >
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{event.title}</h3>
                  <p
                    style={{
                      margin: "0.25rem 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    <strong>Type:</strong>{" "}
                    {
                      EVENT_TYPES.find((t) => t.value === event.event_type)
                        ?.label
                    }
                  </p>
                  {event.description && (
                    <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                      <strong>Description:</strong> {event.description}
                    </p>
                  )}
                  {event.date && (
                    <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  )}
                  {(event.start_time || event.end_time) && (
                    <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                      <strong>Time:</strong> {formatTime(event.start_time)} -{" "}
                      {formatTime(event.end_time)}
                    </p>
                  )}
                  {event.day_of_week && (
                    <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                      <strong>Day:</strong> {event.day_of_week}
                    </p>
                  )}
                  {event.is_recurring && (
                    <p
                      style={{
                        margin: "0.25rem 0",
                        fontSize: "0.9rem",
                        color: "#059669",
                      }}
                    >
                      <strong>Recurring Event</strong>
                    </p>
                  )}

                  <div
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => handleEdit(event)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#f59e0b",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id!)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
