"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";

// Wrap the app with the Redux store. This must be a Client Component because
// Redux's <Provider> uses React context under the hood.
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
