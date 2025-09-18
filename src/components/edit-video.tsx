
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { VideoContract } from "../contracts/VideoContract";
import { API_BASE_URL } from "../config";

export function EditVideo() {
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
        console.error("Failed to load video:", err);
        setError(err?.response?.data?.error || err.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) load();
  }, [params.id]);

  const formik = useFormik({
    enableReinitialize: true, 
    initialValues:
      video || { title: "", description: "", comments: "", url: "", views: 0, likes: 0, category_id: 0 },
    onSubmit: async (values) => {
      try {
        await axios.put(`${API_BASE_URL}/api/videos/${params.id}`, values);
        alert("Video Modified Successfully.");
        navigate("/admin-dashboard");
      } catch (err) {
        console.error("Update failed:", err);
        alert("Failed to update video");
      }
    },
  });

  if (loading) return <div>Loading video...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div>
      <h2>Edit Video</h2>
      <form onSubmit={formik.handleSubmit}>
        <dl className="row">
          <dt className="col-2">Title</dt>
          <dd className="col-10">
            <input name="title" className="form-control" value={formik.values.title} onChange={formik.handleChange} />
          </dd>

          <dt className="col-2">Description</dt>
          <dd className="col-10">
            <input name="description" className="form-control" value={formik.values.description} onChange={formik.handleChange} />
          </dd>

          <dt className="col-2">Comments</dt>
          <dd className="col-10">
            <input name="comments" className="form-control" value={formik.values.comments} onChange={formik.handleChange} />
          </dd>

          <dt className="col-2">Url</dt>
          <dd className="col-10">
            <input name="url" className="form-control" value={formik.values.url} onChange={formik.handleChange} />
          </dd>

          <dt className="col-2">Likes</dt>
          <dd className="col-10">
            <input type="number" name="likes" className="form-control" value={formik.values.likes} onChange={formik.handleChange} />
          </dd>

          <dt className="col-2">Views</dt>
          <dd className="col-10">
            <input type="number" name="views" className="form-control" value={formik.values.views} onChange={formik.handleChange} />
          </dd>

          <dt className="col-2">Category Id</dt>
          <dd className="col-10">
            <input type="number" name="category_id" className="form-control" value={formik.values.category_id} onChange={formik.handleChange} />
          </dd>
        </dl>

        <button type="submit" className="btn btn-success mx-2">Save</button>
        <Link to="/admin-dashboard" className="btn btn-danger">Cancel</Link>
      </form>
    </div>
  );
}
