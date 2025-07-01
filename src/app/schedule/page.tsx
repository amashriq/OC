"use client";
import { useState, useEffect } from "react";

interface Schedule {
  id: string;
  title: string;
  description: string;
  start_time: string | null;
  end_time: string | null;
  day_of_week: string | null;
  is_recurring: boolean;
  created_at: string;
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedule");
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return "";
    return new Date(dateTime).toLocaleString();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Our Schedule</h1>

      {schedules.length === 0 ? (
        <p>No schedule items found.</p>
      ) : (
        <div>
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
              }}
            >
              <h3>{schedule.title}</h3>
              {schedule.description && <p>{schedule.description}</p>}

              {schedule.day_of_week && (
                <p>
                  <strong>Day:</strong> {schedule.day_of_week}
                </p>
              )}

              {schedule.start_time && (
                <p>
                  <strong>Start:</strong> {formatDateTime(schedule.start_time)}
                </p>
              )}

              {schedule.end_time && (
                <p>
                  <strong>End:</strong> {formatDateTime(schedule.end_time)}
                </p>
              )}

              {schedule.is_recurring && (
                <p>
                  <em>This is a recurring event</em>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
