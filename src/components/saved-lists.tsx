
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { API_BASE_URL } from "../config";

interface SavedItem {
  _id: string;
  user_id: string;
  video: {
    _id?: string | null;
    video_id?: number | null;
    title?: string;
    url?: string;
    description?: string;
    likes?: number;
    views?: number;
  };
}

const SavedLists: React.FC = () => {
  const [cookies] = useCookies(["userid"]);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadSaved() {
    const userId = cookies["userid"];
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/${encodeURIComponent(userId)}/saved`);
      setSaved(res.data || []);
    } catch (err) {
      console.error("Could not fetch saved list:", err);
      setSaved([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSaved();
  }, []);

  async function handleRemove(savedId: string) {
    try {
      const userId = cookies["userid"];
      if (!userId) return;
      await axios.delete(`${API_BASE_URL}/api/users/${encodeURIComponent(userId)}/saved/${savedId}`);
      loadSaved();
    } catch (err) {
      console.error("Delete saved error:", err);
      alert("Could not remove saved item.");
    }
  }

  if (loading) return <div style={{ padding: 16, color: "#fff" }}>Loading saved videos...</div>;
  if (!saved || saved.length === 0) {
    return (
      <div style={{ width: "100%", padding: 16 }}>
        <h2 style={{ color: "#fff", marginLeft: 12 }}>Saved Videos</h2>
        <div style={{ color: "#fff", margin: 20 }}>There are no saved videos.</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", padding: 16 }}>
      <h2 style={{ color: "#fff", marginLeft: 12 }}>Saved Videos</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, padding: 12 }}>
        {saved.map((s) => (
          <div key={s._id} style={{ background: "#fff", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: 200, overflow: "hidden" }}>
              <iframe
                src={s.video?.url || ""}
                title={s.video?.title || "video"}
                style={{ width: "100%", height: "100%", border: "none" }}
                allowFullScreen
              />
            </div>
            <div style={{ padding: 12 }}>
              <h4 style={{ margin: 0 }}>{s.video?.title || "Untitled"}</h4>
              <p style={{ marginTop: 8 }}>{s.video?.description}</p>

              <div style={{ marginTop: 8 }}>
                <button onClick={() => handleRemove(s._id)} className="btn btn-danger btn-sm">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedLists;
