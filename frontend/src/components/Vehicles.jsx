import { useState, useEffect } from "react";
import api from "../api";
import { useToast } from "./toast/useToast";

const Vehicles = ({ user, navigate }) => {
  const toast = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    license_number: "",
    state: "MO",
    type: "Sedan",
  });

  const fetchVehicles = async () => {
    try {
      const res = await api.get(`/vehicles/user/${user.user_id}`);
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user.user_id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (formData.license_number.length > 10) {
        toast.warning(
          "Invalid License Plate",
          "License plate cannot exceed 10 characters.",
        );
        return;
      }
      await api.post("/vehicles", { ...formData, user_id: user.user_id });
      toast.success(
        "Vehicle Added",
        `${formData.license_number} has been successfully added.`,
      );
      setShowAdd(false);
      setFormData({ license_number: "", state: "MO", type: "Sedan" });
      fetchVehicles();
    } catch (err) {
      toast.error(
        "Add Vehicle Failed",
        err.response?.data?.error || "Error adding vehicle",
      );
    }
  };

  if (loading)
    return <div className="screen-container">Loading vehicles...</div>;

  return (
    <div
      className="screen-container animate-fade-in"
      style={{ padding: 0, background: "var(--background)", minHeight: "100%" }}
    >
      {/* Standardized Header */}
      <div
        style={{
          background: "white",
          padding: "50px 24px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => navigate("home")}
            style={{
              background: "rgba(29, 113, 242, 0.1)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "18px",
              marginRight: "16px",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="var(--primary)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
            My Vehicles
          </h1>
        </div>
      </div>

      <div style={{ padding: "0 24px 16px" }}>
        <div
          onClick={() => setShowAdd(!showAdd)}
          style={{
            background: showAdd ? "#fef2f2" : "rgba(29, 113, 242, 0.08)",
            border: `1px solid ${showAdd ? "#fca5a5" : "rgba(29, 113, 242, 0.2)"}`,
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: "16px",
                color: showAdd ? "#dc2626" : "var(--primary)",
              }}
            >
              {showAdd ? "Cancel Adding Vehicle" : "Add New Vehicle"}
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginTop: "2px",
              }}
            >
              {showAdd ? "" : "Tap to register a new vehicle"}
            </span>
          </div>

          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "12px",
              background: showAdd ? "#fee2e2" : "rgba(29, 113, 242, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 700,
              color: showAdd ? "#dc2626" : "var(--primary)",
            }}
          >
            {showAdd ? "−" : "+"}
          </div>
        </div>
      </div>

      <div style={{ padding: "24px", paddingTop: 0 }}>
        {showAdd && (
          <div
            className="card animate-slide-up"
            style={{ border: "2px solid var(--primary)", marginBottom: "24px" }}
          >
            <form onSubmit={handleAdd}>
              <div className="input-group">
                <label className="input-label">License Plate Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.license_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      license_number: e.target.value.toUpperCase(),
                    })
                  }
                  required
                  placeholder="EX: ABC1234"
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="input-group">
                  <label className="input-label">State</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        state: e.target.value.toUpperCase(),
                      })
                    }
                    maxLength="2"
                    required
                    placeholder="MO"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Type</label>
                  <select
                    className="input-field"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Truck</option>
                    <option>Motorcycle</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "12px" }}
              >
                Save Vehicle
              </button>
            </form>
          </div>
        )}

        <div>
          {vehicles.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-secondary)",
                padding: "40px 0",
              }}
            >
              No vehicles registered yet.
            </div>
          ) : (
            vehicles.map((v) => (
              <div
                key={v.license_number}
                className="card"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--background)",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "16px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <svg
                    width="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      fontFamily: "Outfit",
                    }}
                  >
                    {v.license_number}
                  </div>
                  <div
                    style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                  >
                    {v.state} • {v.type}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
