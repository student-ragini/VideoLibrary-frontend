import axios from "axios";
import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export function UserRegister() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      user_id: "",
      user_name: "",
      password: "",
      email: "",
      mobile: "",
     
    },
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/user/register`, values);
        if (res.data?.success) {
          alert(`Registered successfully.\nYour user id: ${res.data.userid}`);
          navigate("/user-login");
        } else {
          alert(res.data?.error || "Registration failed");
        }
      } catch {
        alert("Registration failed");
      }
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Register User</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">User Id</label>
            <input
              className="form-control auth-input"
              name="user_id"
              value={formik.values.user_id}
              onChange={formik.handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">User Name</label>
            <input
              className="form-control auth-input"
              name="user_name"
              value={formik.values.user_name}
              onChange={formik.handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control auth-input"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control auth-input"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile</label>
            <input
              className="form-control auth-input"
              name="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>

        <div className="mt-3 text-center">
          <Link to="/user-login" className="auth-muted-link">Existing User?</Link>
        </div>
      </div>
    </div>
  );
}