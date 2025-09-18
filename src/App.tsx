
import "./App.css";
import { Route, Routes, Link } from "react-router-dom";
import { VideoLibraryHome } from "./components/video-library-home";
import { UserRegister } from "./components/user-register";
import { UserLogin } from "./components/user-login";
import { UserDashBoard } from "./components/user-dashboard";
import { UserLoginError } from "./components/user-login-error";
import { AdminLogin } from "./components/admin-login";
import { AdminDashboard } from "./components/admin-dashboard";
import { AddVideo } from "./components/add-video";
import { EditVideo } from "./components/edit-video";
import { DeleteVideo } from "./components/delete-video";
import SavedLists from "./components/saved-lists";

function App() {
  return (
    <div className="page container-fluid p-0">
      {/* HEADER */}
      <header className="app-header">
        {/* sirf title link header me rahega */}
        <h1>
          <Link to="/" className="video-library-title">Video Library</Link>
        </h1>
      </header>

      {/* MAIN */}
      <section>
        <Routes>
          <Route path="/" element={<VideoLibraryHome />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-dashboard" element={<UserDashBoard />} />
          <Route path="/user-login-error" element={<UserLoginError />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-video" element={<AddVideo />} />
          <Route path="/edit-video/:id" element={<EditVideo />} />
          <Route path="/delete-video/:id" element={<DeleteVideo />} />
          <Route path="/saved-lists" element={<SavedLists />} />
          {/* fallback */}
          <Route path="*" element={<VideoLibraryHome />} />
        </Routes>
      </section>
    </div>
  );
}

export default App;