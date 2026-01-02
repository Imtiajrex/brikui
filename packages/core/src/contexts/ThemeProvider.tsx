import { GlobalActionSheet, GlobalAlertDialog, PortalHost, Toaster } from '../components';

interface ThemeProviderProps {
  children: React.ReactNode;
}
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <>
      <PortalHost />
      <GlobalAlertDialog />
      <GlobalActionSheet.Global />
      <Toaster />
      {children}
    </>
  );
};
