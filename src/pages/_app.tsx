import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </LocalizationProvider>
  );
};

export default api.withTRPC(MyApp);
