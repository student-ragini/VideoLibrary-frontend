
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import type { VideoContract } from "../contracts/VideoContract";
import axios from "axios";
import { API_BASE_URL } from "../config";

/** Helper: youtube URL -> embed URL */
function toEmbedUrl(url?: string): string {
  if (!url) return "";
  try {
    // short youtu.be/ID
    const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (short && short[1]) return `https://www.youtube.com/embed/${short[1]}`;

    // embed already
    const emb = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (emb && emb[1]) return `https://www.youtube.com/embed/${emb[1]}`;

    // watch?v=ID
    const watch = url.match(/[?&]v=([^&]+)/);
    if (watch && watch[1]) return `https://www.youtube.com/embed/${watch[1]}`;

    // if just id given
    const maybeId = url.match(/^[a-zA-Z0-9_-]{6,}$/);
    if (maybeId) return `https://www.youtube.com/embed/${url}`;

    return "";
  } catch (err) {
    console.error("embed convert error", err);
    return "";
  }
}

export function AdminDashboard() {
  const [, , removeCookie] = useCookies(["admin_id"]);
  const [videos, setVideos] = useState<VideoContract[] | undefined>();
  const navigate = useNavigate();

  function LoadVideos() {
    axios.get(`${API_BASE_URL}/api/videos`).then((res) => setVideos(res.data)).catch(err => {
      console.error("Load videos error:", err);
    });
  }

  useEffect(() => {
    LoadVideos();
  }, []);

  function handleSignout() {
    removeCookie("admin_id");
    navigate("/");
  }

  return (
    <div className="container py-3">
      <header className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Dashboard</h2>
        <div>
          <Link to="/add-video" className="btn btn-primary">Add New Video</Link>
          <button className="btn btn-success me-2" onClick={handleSignout}>Signout</button>
           </div>
      </header>

      <section>
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th style={{width: "30%"}}>Title</th>
              <th style={{width: "50%"}}>Preview</th>
              <th style={{width: "20%"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos?.map((video) => {
              const embed = toEmbedUrl(video.url);
              return (
                <tr key={video._id || video.video_id}>
                  <td>{video.title}</td>
                  <td>
                    {embed ? (
                      <div style={{ maxWidth: 600 }}>
                        <div style={{position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden"}}>
                          <iframe
                            src={embed}
                            title={video.title}
                            style={{position: "absolute", top:0, left:0, width: "100%", height: "100%", border: 0, zIndex: 2}}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : (
                      // fallback: show link to open video in new tab
                      <div>
                        <div style={{background: "#eee", padding: 16}}>No embed available</div>
                        <a href={video.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary mt-2">Open original</a>
                      </div>
                    )}
                  </td>
                  <td>
                    <Link to={`/edit-video/${video._id || video.video_id}`} className="btn btn-warning me-2">
                      <span className="bi bi-pen-fill"></span> Edit
                    </Link>
                    <Link to={`/delete-video/${video._id || video.video_id}`} className="btn btn-danger">
                      <span className="bi bi-trash-fill"></span> Delete
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}