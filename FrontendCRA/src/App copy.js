import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useMatch } from 'react-router-dom';

import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import Blogs from './components/Blogs';
import Blog from './components/Blog';
import Menu from './components/Menu';
import Users from './components/Users';
import User from './components/User';

import { initializeBlogs } from './reducers/blogReducer';
import { loadLoggedInUser } from './reducers/userReducer';
import { initializeUsers } from './reducers/usersReducer';

function App() {
    const dispatch = useDispatch();
    const user = useSelector(({ user }) => user);
    const blogs = useSelector(({ blogs }) => blogs);
    const users = useSelector(({ users }) => users);

    const matchUser = useMatch('/users/:id');
    const matchBlog = useMatch('/blogs/:id');

    const selectedUser = matchUser
        ? users.find((user) => user.id === matchUser.params.id) // if user.id is a number format matched id to number as well
        : null;
    const selectedBlog = matchBlog
        ? blogs.find((blog) => blog.id === matchBlog.params.id) // if blog.id is a number format matched id to number as well
        : null;

    useEffect(() => {
        dispatch(loadLoggedInUser());
        dispatch(initializeBlogs());
        dispatch(initializeUsers());
    }, []);

    return (
        <div className="App">
            <Notification />
            <Menu user={user} />
            <Routes>
                <Route path="/" element={<Blogs blogs={blogs} />} />
                <Route
                    path="/blogs/:id"
                    element={<Blog user={user} blog={selectedBlog} />}
                />
                <Route path="/users" element={<Users users={users} />} />
                <Route
                    path="/users/:id"
                    element={<User user={selectedUser} />}
                />
                <Route path="/login" element={<LoginForm />} />
            </Routes>
        </div>
    );
}

export default App;
