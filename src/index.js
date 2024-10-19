import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import FeedPage from "./feature/feed/FeedPage";
import SearchPage from './feature/search/SearchPage';
import CreatePostPage from './feature/createPost/CreatePostPage';
import MyPage from './feature/myPage/MyPage';
import PostPage from './feature/post/PostPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<FeedPage />} />            
            <Route path="search" element={<SearchPage />} />       
            <Route path="write" element={<CreatePostPage />} />    
            <Route path="mypage" element={<MyPage />} />          
            <Route path="post/:id" element={<PostPage />} />  
        </Routes>
    </BrowserRouter>
);
