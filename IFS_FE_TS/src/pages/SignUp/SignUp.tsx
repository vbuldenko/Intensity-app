import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  notifyWith,
  selectNotification,
} from "../../features/notification/notificationSlice";
import { authService } from "../../services/authService";
import { AuthCredentials } from "../../types/Auth";

const SignUp = () => {
  const defaultUserData: AuthCredentials = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "client",
  };

  const [signUpData, setSignUpData] = useState(defaultUserData);
  const navigate = useNavigate();
  const notification = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await authService.register(signUpData);
      setSignUpData(defaultUserData);
      navigate("/check-email", { replace: true });
    } catch (error) {
      console.log(error);
      dispatch(notifyWith(error.message));
    }
  };

  return (
    <div className="auth__form-wrapper card-element">
      <form className="auth__form" onSubmit={handleSubmit}>
        <h1 className="auth__title">Create an account</h1>
        {notification && (
          <h1 className="auth__error-message self-center card-element bg-red-100">
            {notification}
          </h1>
        )}
        <div className="auth__input-wrapper">
          <input
            id="firstName"
            type="text"
            value={signUpData.firstName}
            name="firstName"
            placeholder="first name"
            onChange={handleChange}
          />
        </div>
        <div className="auth__input-wrapper">
          <input
            id="lastName"
            type="text"
            value={signUpData.lastName}
            name="lastName"
            placeholder="last name"
            onChange={handleChange}
          />
        </div>
        <div className="auth__input-wrapper">
          <input
            id="email"
            type="text"
            value={signUpData.email}
            name="email"
            placeholder="email"
            onChange={handleChange}
          />
        </div>
        <div className="auth__input-wrapper">
          <input
            id="phone"
            type="text"
            value={signUpData.phone}
            name="phone"
            placeholder="phone number"
            onChange={handleChange}
          />
        </div>
        <div className="auth__input-wrapper">
          <input
            id="password"
            type="password"
            value={signUpData.password}
            name="password"
            placeholder="password"
            onChange={handleChange}
          />
        </div>
        <div className="auth__radio-role flex flex-col gap-2">
          <label className="self-center font-bold text-teal-500">
            Choose your role:
          </label>
          <div className="card-element flex gap-6 justify-center p-1">
            <label className="label flex gap-1">
              <input
                type="radio"
                name="role"
                value="client"
                checked={signUpData.role === "client"}
                onChange={handleChange}
              />
              <span>Client</span>
            </label>
            <label className="label flex gap-1">
              <input
                type="radio"
                name="role"
                value="trainer"
                checked={signUpData.role === "trainer"}
                onChange={handleChange}
              />
              <span>Trainer</span>
            </label>
          </div>
        </div>
        <button id="login-button" type="submit" className="auth__button">
          Sign Up
        </button>
      </form>
      <div className="auth__subsection">
        <div className="flex gap-4 p-4 justify-center">
          <p>Already have an account?</p>
          <Link className="font-bold text-xl text-teal-500" to="/sign-in">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
