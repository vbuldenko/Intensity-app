import { useState } from 'react';
import './blogform.css';

import { useDispatch } from 'react-redux';
import { notifyWith } from '../reducers/notificationReducer';
import { createBlog } from '../reducers/blogReducer';

const BlogForm = ({ toggleVisibility }) => {
    const initBlogForm = { title: '', author: '', url: '' };
    const [newBlog, setNewBlog] = useState(initBlogForm);
    const dispatch = useDispatch();

    const addBlog = async (event) => {
        event.preventDefault();
        try {
            dispatch(createBlog(newBlog));
            dispatch(
                notifyWith({
                    text: `a new blog titled ${newBlog.title} by ${newBlog.author} was added!`,
                    error: false,
                })
            );
            setNewBlog(initBlogForm);
            toggleVisibility();
        } catch (error) {
            dispatch(
                notifyWith({ text: error.response.data.error, error: true })
            );
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewBlog((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <form className="blog-form" onSubmit={addBlog}>
            <div>
                Title
                <input
                    id="title"
                    value={newBlog.title}
                    name="title"
                    onChange={handleChange}
                />
            </div>

            <div>
                Author
                <input
                    id="author"
                    value={newBlog.author}
                    name="author"
                    onChange={handleChange}
                />
            </div>

            <div>
                Url
                <input
                    id="url"
                    value={newBlog.url}
                    name="url"
                    onChange={handleChange}
                />
            </div>

            <button type="submit">save</button>
        </form>
    );
};

export default BlogForm;
