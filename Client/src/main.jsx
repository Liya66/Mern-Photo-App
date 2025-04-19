import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router';
import Homepage from './routes/homepage/homepage'
import PostPage from './routes/postPage/postPage'
import CreatePage from './routes/creatPage/createPage'
import AuthPage from './routes/authPage/authPage'
import ProfilePage from './routes/profilePage/profilePage';
import SearchPage from './routes/searchPage/searchPage';
import MainLayout from './routes/layouts/mainLayout';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/pin/:id" element={<PostPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
