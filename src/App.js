import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './PostDetail';
import CreatePost from './pages/CreatePost';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import EditPost from './pages/EditPost';
import DeletePost from './pages/DeletePost';
import Videos from './pages/Videos';
import Reports from './pages/Reports';
import Music from './pages/Music';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    if (username) localStorage.setItem('username', username);
  }, [username]);

  return (
    <BrowserRouter>
      <Navbar token={token} setToken={setToken} username={username} />
      <Routes>
        <Route path="/" element={<Home  token={token} username={username}/>} />
        <Route
          path="/login"
          element={<Login setToken={setToken} setUsername={setUsername} />}
        />
        <Route
          path="/register"
          element={<Register setToken={setToken} setUsername={setUsername} />}
        />
        <Route
          path="/post/:id"
          element={<PostDetail token={token} username={username} />}
        />
        <Route
          path="/create"
          element={<CreatePost token={token} />}
        />
        <Route
          path="/categories"
          element={<Categories />}
        />
        <Route
          path="/profile/:username"
          element={<Profile token={token} currentUser={username} />}
        />
        <Route
          path="/profile/edit"
          element={<EditProfile token={token} username={username} />}
        />
        <Route
          path="/post/:id/edit"
          element={<EditPost token={token} />}
        />
        <Route
          path="/post/:id/delete"
          element={<DeletePost token={token} />}
        />
        <Route
        path="/videos"
        element={<Videos token={token} username={username} />}
        />
        <Route
        path="/reports"
        element={<Reports token={token} username={username} />}
        />
        <Route
        path="/music"
        element={<Music token={token} username={username} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;