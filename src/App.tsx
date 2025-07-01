import { QueryClientProvider, QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Routes from './Routes';

const handleErrorRequest = (error: any) => {
  const url = error?.config?.url;
  const statusCode = error?.response?.status;
  const errorMessage = error?.response?.data?.message || 'Un erreur est survenue';
  console.log('Request url', url);
  console.log('Request statusCode', statusCode);

  if (statusCode === 401) {
    localStorage.removeItem('token');
  }

  if (statusCode === 401 && !window.location.href.includes('/signin')) {
    window.location.replace('/signin');
  }

  // Endpoints that handle error inside the component that use them
  if (
    /\/auth\/login$/.test(url) ||
    /\/auth\/forgot-password$/.test(url) ||
    /\/auth\/reset-password/.test(url) ||
    /\/auth\/change-password/.test(url)
  )
    return;

  toast.error(errorMessage);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      handleErrorRequest(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: error => {
      // (error, _variables, _context, mutation)
      handleErrorRequest(error);
    },
  }),
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes />
        <ToastContainer position="bottom-right" stacked />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
