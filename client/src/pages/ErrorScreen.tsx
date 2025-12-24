import { useRouteError } from 'react-router-dom';
import { Error } from '../components';

function ErrorScreen() {
  const error: any = useRouteError();

  return <Error statusCode={error?.status} />;
}

export default ErrorScreen;