import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { login } from "../../features/auth/authThunk";
import { Path } from "../../types/Path";
import "./Auth.scss";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, error } = useAppSelector(selectAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const path = location.state?.from || "/account";

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await dispatch(login({ email: identifier, password }));
    setIsSubmitting(false);
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
        <h2 className="auth__title">Log in</h2>
        {error && (
          <h1 className="auth__error-message self-center card-element bg-red-100">
            {error}
          </h1>
        )}
        <div className="auth__input-wrapper">
          {/* <label htmlFor="identifier">Email or Phone Number</label> */}
          <input
            id="identifier"
            type="text"
            value={identifier}
            name="identifier"
            placeholder="Email"
            onChange={({ target }) => setIdentifier(target.value)}
          />
        </div>
        <div className="auth__input-wrapper">
          {/* <label htmlFor="password">Password</label> */}
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
          {isSubmitting && <div className="reservation-btn__spinner"></div>}
          {!isSubmitting && "Log in"}
        </button>
      </form>
      <div className="auth__signup-subsection">
        <div>
          <Link
            className="auth__signup-subsection__link auth__signup-subsection__link--accent"
            to={`/${Path.SignUp}`}
          >
            Sign Up
          </Link>
        </div>
        <Link
          className="auth__signup-subsection__link text-sm"
          to={Path.Restore}
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
