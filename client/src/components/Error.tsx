import { Link } from 'react-router-dom';
import errorImg from '../assets/error.svg';

interface ErrorProps {
  message?: string;
  statusCode?: number;
}

function Error({ statusCode = 500, message }: ErrorProps) {
  return (
    <main className="flex flex-col items-center justify-center mt-6 max:h-screen">
      <img src={errorImg} alt="error" className="w-64 mb-6" />

      {message ? (
        <h1 className="heading-h1">{message}</h1>
      ) : (
        <h1 className="heading-h1">
          {statusCode === 404
            ? 'Page not found'
            : statusCode === 400
            ? 'Bad request'
            : 'Something went wrong'}
        </h1>
      )}

      <Link to="/" className="btn-cta">
        Back home
      </Link>
    </main>
  );
}

export default Error;
