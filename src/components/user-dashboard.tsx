
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToSaveList, replaceSavedId } from "../slices/video-slice";
import { API_BASE_URL } from "../config";

interface VideoContract {
  _id?: string;
  video_id?: number;
  title: string;
  url: string;
  description?: string;
  likes?: number;
  views?: number;
  category_id?: number;
}

export function UserDashBoard(): JSX.Element {
  const [cookies, , removeCookie] = useCookies(["userid"]);
  const [videos, setVideos] = useState<VideoContract[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function normalizeYouTubeUrl(url?: string): string {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    const match = url.match(/[?&]v=([^&]+)/);
    if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`;
    const short = url.match(/youtu\.be\/([^?&/]+)/);
    if (short && short[1]) return `https://www.youtube.com/embed/${short[1]}`;
    return url;
  }

  async function loadVideos() {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/videos`);
      setVideos(res.data || []);
    } catch (err) {
      console.error("Could not load videos:", err);
      setVideos([]);
    }
  }

  useEffect(() => {
    const userId = cookies["userid"];
    if (!userId) {
      navigate("/user-login");
      return;
    }
    loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSignout() {
    removeCookie("userid");
    navigate("/");
  }

  async function handleSaveClick(e: React.MouseEvent, v: VideoContract) {
    e.preventDefault();
    e.stopPropagation();
    const userId = cookies["userid"];
    if (!userId) {
      alert("Please login first.");
      navigate("/user-login");
      return;
    }

    // id used only for local optimistic UI
    const localId = v._id ?? (v.video_id !== undefined && v.video_id !== null ? String(v.video_id) : Math.random().toString(36).slice(2, 9));
    const normalizedUrl = normalizeYouTubeUrl(v.url);

    // optimistic local save (redux) — _id must be present so reducer accepts it
    dispatch(
      addToSaveList({
        _id: localId,
        title: v.title,
        url: normalizedUrl,
        description: v.description,
        likes: v.likes ?? 0,
        views: v.views ?? 0
      })
    );

    try {
      const url = `${API_BASE_URL}/api/users/${encodeURIComponent(userId)}/saved`;

      // Build server payload: prefer video_id (Number) if available, else _id (string)
      const videoPayload: any = {
        title: v.title,
        url: normalizedUrl,
        description: v.description,
        likes: v.likes ?? 0,
        views: v.views ?? 0,
        category_id: v.category_id ?? 0
      };

      if (v.video_id !== undefined && v.video_id !== null) {
        videoPayload.video_id = v.video_id; // send numeric video_id
      } else if (v._id) {
        videoPayload._id = v._id; // send mongo _id if available
      } else {
        // neither present: don't set id fields (backend will accept by url)
      }

      // POST to server
      const res = await axios.post(url, { video: videoPayload });

      // If server returned saved doc with _id, replace local id with server id in redux
      const savedFromServer = res.data?.saved;
      if (savedFromServer && savedFromServer._id) {
        dispatch(replaceSavedId({ oldId: localId, newId: String(savedFromServer._id) }));
      }

      console.log("Saved server response:", res.data);
    } catch (err) {
      console.error("Failed to save on server:", err);
      alert("Saved locally; server save failed. Check console.");
    }
  }

  return (
    <div>
      <header className="d-flex justify-content-between align-items-center p-2 border-bottom">
        <h2>{cookies["userid"] || "User"} - Dashboard</h2>
        <div>
          <Link to="/saved-lists" className="btn btn-info me-2">
            Saved
          </Link>
          <button onClick={handleSignout} className="btn btn-secondary">
            Signout
          </button>
        </div>
      </header>

      <section className="mt-4 d-flex flex-wrap">
        {videos.map((video) => {
          const vidId = video._id ?? (video.video_id !== undefined && video.video_id !== null ? String(video.video_id) : Math.random().toString(36).slice(2, 9));
          const safeUrl = normalizeYouTubeUrl(video.url);
          return (
            <div key={vidId} className="card m-2 p-1 shadow-sm" style={{ width: "250px", position: "relative" }}>
              <div style={{ height: 140, overflow: "hidden" }}>
                {safeUrl ? (
                  <iframe src={safeUrl} height="140" title={video.title} style={{ width: "100%", border: "none" }} allowFullScreen />
                ) : (
                  <div style={{ height: 140, background: "#eee" }} />
                )}
              </div>

              <div className="card-header">
                <h5 className="mb-0">{video.title}</h5>
              </div>

              <div className="card-body">
                <p>{video.description}</p>
              </div>

              <div className="card-footer d-flex justify-content-between align-items-center" style={{ zIndex: 2 }}>
                <div>
                  <span className="bi bi-hand-thumbs-up me-2"> {video.likes ?? 0} </span>
                  <span className="bi bi-eye"> {video.views ?? 0} </span>
                </div>

                <button type="button" onClick={(e) => handleSaveClick(e, video)} className="btn btn-success" title="Save" style={{ position: "relative", zIndex: 9999 }}>
                  <span className="bi bi-bookmarks"></span> Save
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default UserDashBoard;
