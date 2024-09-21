// import { Link } from "react-router-dom";

const CheckEmail = () => {
  return (
    <div className="check-email card-element flex flex-col p-4 gap-5 items-center">
      <h1 className="font-bold">Check Your Email</h1>
      <p>
        We've sent you an email with an activation link. Please click the link
        in the email to activate your account.
      </p>
      {/* <p className="flex gap-4 items-center">
        Didn't receive the email?{" "}
        <Link
          className="text-teal-500 font-bold card-element text-center p-1"
          to="/resend-activation"
        >
          Resend Activation Email
        </Link>
      </p> */}
    </div>
  );
};

export default CheckEmail;
