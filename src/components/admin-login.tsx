import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { API_BASE_URL } from "../config";

export function AdminLogin() {
  const [, setCookie] = useCookies(["admin_id"]);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" }, 
    onSubmit: (admin) => {
      axios.post(`${API_BASE_URL}/api/admin/login`, admin).then((res) => {
        if (res.data?.success) {
          setCookie("admin_id", res.data.admin_id);
          navigate("/admin-dashboard");
        } else {
          alert("Invalid credentials");
        }
      }).catch(() => alert("Login failed"));
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Admin Login</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Admin Id</label>
            <input className="form-control auth-input" type="text" name="email"
              onChange={formik.handleChange} value={formik.values.email}/>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control auth-input" type="password" name="password"
              onChange={formik.handleChange} value={formik.values.password}/>
          </div>

          <button type="submit" className="btn btn-warning w-100">Login</button>
        </form>
      </div>
    </div>
  );
}