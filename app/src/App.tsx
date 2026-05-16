import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { store } from "./app/store";
import theme from "./theme";
import AppRouter from "./router";
import { supabase } from "./lib/supabaseClient";
import { fetchCurrentUser, setUser } from "./features/auth/authSlice";

const App: React.FC = () => {
  useEffect(() => {
    // Restore session on page load
    store.dispatch(fetchCurrentUser());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN") {
        const { auth } = store.getState() as { auth: { user: unknown } };
        if (!auth.user) store.dispatch(fetchCurrentUser());
      } else if (event === "SIGNED_OUT") {
        store.dispatch(setUser(null));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <AppRouter />
      </ChakraProvider>
    </Provider>
  );
};

export default App;
