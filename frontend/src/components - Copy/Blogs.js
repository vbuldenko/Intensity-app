import { Link } from 'react-router-dom';
import BlogForm from './BlogForm';
import Togglable from './Togglable';
import './blogs.css';

const Blogs = ({ blogs }) => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes); //Implemented sorting by likes
    return (
        <div className="blogs">
            <Togglable>
                <BlogForm />
            </Togglable>

            {sortedBlogs.map((blog) => (
                <div className="blog-item" key={blog.id}>
                    <Link className="blog-link" to={`/blogs/${blog.id}`}>
                        {blog.title}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Blogs;
