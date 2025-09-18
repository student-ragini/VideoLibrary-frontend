
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { VideoContract } from "../contracts/VideoContract";
import { API_BASE_URL } from "../config";

export function DeleteVideo() {
  const [video, setVideo] = useState<VideoContract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/videos/${params.id}`);
        setVideo(res.data);
      } catch (err: any) {
        console.error("Failed to load video for delete:", err);
        setError(err?.response?.data?.error || err.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) load();
  }, [params.id]);

  async function handleDeleteClick() {
    try {
      await axios.delete(`${API_BASE_URL}/api/videos/${params.id}`);
      alert("Video Deleted");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete video");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div>
      <h2>Delete Video</h2>
      <h4>Are you sure?</h4>

      <dl>
        <dt>Title</dt>
        <dd>{video.title}</dd>

        <dt>Preview</dt>
        <dd>
          <iframe src={video.url} width={300} height={200} title={video.title} style={{ border: "none" }} allowFullScreen />
        </dd>
      </dl>

      <button onClick={handleDeleteClick} className="btn btn-danger">Yes</button>
      <Link to="/admin-dashboard" className="btn btn-warning mx-2">No</Link>
    </div>
  );
}
