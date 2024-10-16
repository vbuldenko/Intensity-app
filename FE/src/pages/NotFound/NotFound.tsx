import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 card-element px-4 py-8">
      <h3 className="text-center">
        Sorry, the page you were looking for was not found.
      </h3>
      <Link
        to="/"
        className="link-button text-teal-500 bg-teal-100 px-4 py-2 rounded-lg"
      >
        Return to Home
      </Link>
    </div>
  );
}
