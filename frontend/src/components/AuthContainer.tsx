import axios from "axios";
import { ReactNode } from "react";

function AuthContainer({ children }: { children: ReactNode }) {
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.baseURL = "http://localhost:4000";

  return (
    <main className="h-full w-full flex items-center justify-center relative">
      {children}
    </main>
  );
}

export default AuthContainer;
