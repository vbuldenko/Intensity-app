import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { login } from "../../features/auth/authThunk";
import { NavLinks } from "../../types/NavLinks";
import "./Auth.scss";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, error } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const path = location.state?.from || "/account";

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login({ email: identifier, password }));
    // setIdentifier("");
    // setPassword("");
    // navigate(path, { replace: true });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, navigate, path]);

  return (
    <div className="auth__form-wrapper card-element">
      <form className="auth__form" onSubmit={handleLogin}>
        <h2 className="auth__title">Log in to application</h2>
        {error && (
          <h1 className="auth__error-message self-center card-element bg-red-100">
            {error}
          </h1>
        )}
        <div className="auth__input-wrapper">
          <label htmlFor="identifier">Email or Phone Number</label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            name="identifier"
            placeholder="Email or Phone Number"
            onChange={({ target }) => setIdentifier(target.value)}
          />
        </div>
        <div className="auth__input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            placeholder="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" className="auth__button">
          Log In
        </button>
      </form>
      <div className="auth__signup-subsection">
        <div>
          <p>New here?</p>
          <Link
            className="auth__signup-subsection__link--accent"
            to={`/${NavLinks.SignUp}`}
          >
            Sign Up
          </Link>
        </div>
        <Link className="auth__signup-subsection__link" to={NavLinks.Restore}>
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
