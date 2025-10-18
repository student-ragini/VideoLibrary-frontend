// src/components/AdminLogin.tsx
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { API_BASE_URL } from "../config";

export function AdminLogin() {
  const [, setCookie] = useCookies(["admin_id"]);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { admin_id: "", password: "" },
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/admin/login`, {
          admin_id: values.admin_id,
          password: values.password,
        });

        if (res.data?.success) {
          setCookie("admin_id", res.data.admin_id, { path: "/" });
          alert("✅ Admin Login Successful");
          navigate("/admin-dashboard");
        } else {
          alert("❌ Invalid credentials");
        }
      } catch (error) {
        console.error("Admin login error:", error);
        alert("Server error during login");
      }
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Admin Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Admin Id</label>
            <input
              className="form-control"
              type="text"
              name="admin_id"
              onChange={formik.handleChange}
              value={formik.values.admin_id}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </div>

          <button type="submit" className="btn btn-warning w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}