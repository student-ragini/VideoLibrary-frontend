// src/components/user-login.tsx
import axios from "axios";
import { useFormik } from "formik";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export function UserLogin() {
  const [, setCookie] = useCookies(["userid"]);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { user_id: "", password: "" },
    onSubmit: (values) => {
      // POST to /api/user/login (server expects user_id or email + password)
      axios.post(`${API_BASE_URL}/api/user/login`, values).then((res) => {
        if (res.data?.success) {
          setCookie("userid", res.data.userid, { path: "/" });
          navigate("/user-dashboard");
        } else {
          alert("Invalid credentials");
        }
      }).catch((err) => {
        console.error("Login request failed:", err);
        alert("Login failed");
      });
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">User Login</h2>

        <form onSubmit={formik.handleSubmit}>
          <div>
            <label className="form-label">User Id</label>
            <input
              className="auth-input"
              type="text"
              name="user_id"
              onChange={formik.handleChange}
              value={formik.values.user_id}
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              className="auth-input"
              type="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <button type="submit" className="btn-warning">Login</button>
          </div>
        </form>

        <div style={{ marginTop: 12 }}>
          <Link to="/user-register" className="auth-muted-link">
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
}
