import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AccountProvider } from "./components/AccountProvider";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <AccountProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </AccountProvider>
  );
}