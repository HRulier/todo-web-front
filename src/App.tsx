import { QueryClientProvider, QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Routes from './Routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      console.log(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: error => {
      // (error, _variables, _context, mutation)
      console.log(error);
    },
  }),
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
