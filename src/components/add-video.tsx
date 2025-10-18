import axios from "axios";
import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export function AddVideo() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      comments: "",
      likes: 0,
      views: 0,
      url: "",
      category_id: 1,
      // optionally video_id if you want to set explicitly
    },
    onSubmit: (video) => {
      axios.post(`${API_BASE_URL}/api/videos`, video).then(() => {
        alert("Video Added Successfully.");
        navigate("/admin-dashboard");
      }).catch(err => {
        console.error("Add video failed:", err);
        alert("Failed to add video");
      });
    },
  });

  return (
    <div>
      <h2>Add Video</h2>
      <form onSubmit={formik.handleSubmit}>
        <dl className="row">
          <dt className="col-2">Title</dt>
          <dd className="col-10"><input className="form-control" type="text" name="title" onChange={formik.handleChange} /></dd>
          <dt className="col-2">Description</dt>
          <dd className="col-10"><input className="form-control" type="text" name="description" onChange={formik.handleChange} /></dd>
          <dt className="col-2">Comments</dt>
          <dd className="col-10"><input className="form-control" type="text" name="comments" onChange={formik.handleChange} /></dd>
          <dt className="col-2">Url</dt>
          <dd className="col-10"><input className="form-control" type="text" name="url" onChange={formik.handleChange} /></dd>
          <dt className="col-2">Likes</dt>
          <dd className="col-10"><input className="form-control" type="number" name="likes" onChange={formik.handleChange} /></dd>
          <dt className="col-2">Views</dt>
          <dd className="col-10"><input className="form-control" type="number" name="views" onChange={formik.handleChange} /></dd>
          <dt className="col-2">Category Id</dt>
          <dd className="col-10"><input className="form-control" type="number" name="category_id" onChange={formik.handleChange} /></dd>
        </dl>
        <button className="btn mx-2 btn-primary" type="submit">Add Video</button>
        <Link to="/admin-dashboard" className="btn btn-warning">Cancel</Link>
      </form>
    </div>
  );
}