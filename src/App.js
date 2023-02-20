// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import { UserAuthContextProvider } from './context/UserAuthContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
       <UserAuthContextProvider>
       <ScrollToTop />
      <StyledChart />
      <Router />
    </UserAuthContextProvider>
    </ThemeProvider>

  );
}
