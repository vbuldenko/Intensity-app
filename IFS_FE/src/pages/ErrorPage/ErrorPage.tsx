import { useRouteError, Link } from "react-router-dom";
import "./ErrorPage.scss";

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="error-page">
      <div className="error-page__container">
        <h1>Oops!</h1>
        <h1 className="error-page__title">{error.statusText}</h1>
        <p className="error-page__message">{error.message}</p>
        <Link to="/" className="error-page__link">
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
