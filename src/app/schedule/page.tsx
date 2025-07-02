"use client";
import { useState, useEffect } from "react";

interface Schedule {
  id: string;
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
  {
    value: "tournament",
    label: "Tournament",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "open_gym",
    label: "Open Gym",
    color: "bg-green-100 text-green-800",
  },
];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getEventTypeDisplay = (eventType: string) => {
    const type = EVENT_TYPES.find((t) => t.value === eventType);
    return (
      type || {
        value: eventType,
        label: eventType,
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const filteredSchedules = schedules.filter((schedule) => {
    if (filter === "all") return true;
    return schedule.event_type === filter;
  });

  const sortedSchedules = filteredSchedules.sort((a, b) => {
    // Sort by date, then by start time
    const dateA = new Date(a.date || "9999-12-31");
    const dateB = new Date(b.date || "9999-12-31");

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }

    // If dates are the same, sort by start time
    return (a.start_time || "").localeCompare(b.start_time || "");
  });

  const upcomingEventsCount = schedules.filter((schedule) => {
    if (!schedule.date) return false;
    const eventDate = new Date(schedule.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).length;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Loading schedule...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "0.5rem",
            margin: "0",
          }}
        >
          Events & Schedule
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem",
            color: "#6b7280",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>
            {upcomingEventsCount} Upcoming Event
            {upcomingEventsCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: filter === "all" ? "#3b82f6" : "white",
              color: filter === "all" ? "white" : "#374151",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
          >
            All Events
          </button>
          {EVENT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: filter === type.value ? "#3b82f6" : "white",
                color: filter === type.value ? "white" : "#374151",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      {sortedSchedules.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p
            style={{
              fontSize: "1.1rem",
              color: "#6b7280",
              margin: "0",
            }}
          >
            No events found.
          </p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr 120px",
              gap: "1rem",
              padding: "1rem 1.5rem",
              backgroundColor: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
              fontWeight: "600",
              fontSize: "0.875rem",
              color: "#374151",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <div>Date</div>
            <div>Event Details</div>
            <div>Type</div>
          </div>

          {/* Event Rows */}
          {sortedSchedules.map((schedule, index) => {
            const eventType = getEventTypeDisplay(schedule.event_type);
            const isToday =
              schedule.date &&
              new Date(schedule.date).toDateString() ===
                new Date().toDateString();

            return (
              <div
                key={schedule.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr 120px",
                  gap: "1rem",
                  padding: "1.5rem",
                  borderBottom:
                    index < sortedSchedules.length - 1
                      ? "1px solid #e5e7eb"
                      : "none",
                  backgroundColor: isToday ? "#fef3c7" : "white",
                  transition: "background-color 0.2s",
                }}
              >
                {/* Date Column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  {schedule.date ? (
                    <div
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: isToday ? "#92400e" : "#1f2937",
                      }}
                    >
                      {formatDate(schedule.date)}
                    </div>
                  ) : schedule.day_of_week ? (
                    <div
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#1f2937",
                      }}
                    >
                      {schedule.day_of_week}s
                    </div>
                  ) : null}

                  {(schedule.start_time || schedule.end_time) && (
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                      }}
                    >
                      {schedule.start_time && formatTime(schedule.start_time)}
                      {schedule.start_time && schedule.end_time && " - "}
                      {schedule.end_time && formatTime(schedule.end_time)}
                    </div>
                  )}

                  {schedule.is_recurring && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#059669",
                        fontWeight: "500",
                      }}
                    >
                      Recurring
                    </div>
                  )}
                </div>

                {/* Event Details Column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "#1f2937",
                      margin: "0",
                      lineHeight: "1.4",
                    }}
                  >
                    {schedule.title}
                  </h3>
                  {schedule.description && (
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        margin: "0",
                        lineHeight: "1.5",
                      }}
                    >
                      {schedule.description}
                    </p>
                  )}
                </div>

                {/* Type Column */}
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  {schedule.event_type && (
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                        ...(() => {
                          const [bgColor, textColor] =
                            eventType.color.split(" ");
                          return {
                            backgroundColor:
                              bgColor === "bg-blue-100"
                                ? "#dbeafe"
                                : bgColor === "bg-green-100"
                                ? "#dcfce7"
                                : "#f3f4f6",
                            color:
                              textColor === "text-blue-800"
                                ? "#1e40af"
                                : textColor === "text-green-800"
                                ? "#166534"
                                : "#374151",
                          };
                        })(),
                      }}
                    >
                      {eventType.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .schedule-grid {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
          }

          .schedule-header {
            display: none !important;
          }

          .schedule-row {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            padding: 1rem !important;
          }

          .date-column {
            order: -1;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
