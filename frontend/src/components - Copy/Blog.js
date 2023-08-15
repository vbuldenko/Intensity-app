import './blog.css';
import { useDispatch } from 'react-redux';
import { updateBlog, deleteBlog, addComment } from '../reducers/blogReducer';
import { notifyWith } from '../reducers/notificationReducer';
import { useField } from '../hooks';

const Blog = ({ blog, user }) => {
    const [comment, resetComment] = useField('text');
    const dispatch = useDispatch();
    if (!blog) {
        return null;
    }

    const handleLike = async () => {
        try {
            const newBlog = {
                ...blog,
                user: blog.user.id,
                likes: blog.likes + 1,
            };
            // const newBlog = { ...blog, likes: blog.likes + 1 };
            dispatch(updateBlog(blog.id, newBlog));
        } catch (error) {
            dispatch(
                notifyWith({ text: error.response.data.error, error: true })
            );
        }
    };

    const handleRemove = () => {
        if (window.confirm('Do you really want to delete this item?')) {
            try {
                dispatch(deleteBlog(blog.id));
            } catch (error) {
                dispatch(
                    notifyWith({ text: error.response.data.error, error: true })
                );
            }
        }
    };

    const handleComment = (e) => {
        e.preventDefault();
        dispatch(addComment(blog.id, comment.value));
        resetComment();
    };

    return (
        <div className="blog">
            <h2>
                {blog.title} - {blog.author}
            </h2>
            <p>{blog.url}</p>
            <p className="likes">
                {blog.likes} likes
                <button className="like-button" onClick={handleLike}>
                    like
                </button>
            </p>
            {blog.user && (
                <>
                    <p>added by {blog.user.name}</p>
                    {user && blog.user.username === user.username && (
                        <button
                            className="delete-button"
                            onClick={handleRemove}
                        >
                            delete
                        </button>
                    )}
                </>
            )}

            <h3>comments</h3>
            <form onSubmit={handleComment}>
                <input {...comment} />
                <button>add comment</button>
            </form>
            <ul>
                {blog.comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                ))}
            </ul>
        </div>
    );
};

export default Blog;
