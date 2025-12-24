import { RouterProvider } from 'react-router-dom';
import router from './router';
import { DataProvider } from './DataContext';

function App() {
  return (
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  );
}

export default App;