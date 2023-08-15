const User = ({ user }) => {
    if (!user) {
        return null;
    }

    return (
        <div className="user">
            <h1>{user.name}</h1>
            <h2>added blogs</h2>
            <ul>
                {user.blogs.map((blog) => (
                    <li key={blog.id}>
                        <p>{blog.title}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default User;
