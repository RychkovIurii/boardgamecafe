import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import i18n from "./i18n";
import AuthProvider from "./context/AuthContext";

/**
 * A custom render function that wraps `ui` in all needed Providers.
 * This ensures your components have the same environment as Main.jsx:
 * - i18n for translations
 * - React Router (MemoryRouter instead of BrowserRouter)
 * - AuthProvider for authentication context
 */
export function customRender(
  ui,
  { route = "/", authProps = {}, ...options } = {}
) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider {...authProps}>{ui}</AuthProvider>
      </MemoryRouter>
    </I18nextProvider>,
    options
  );
}
