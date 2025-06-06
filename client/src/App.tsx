import Layout from "./components/Layout";
import { Toaster } from "sonner";
import Index from "./pages/Index/Index";
import useTheme from "@contexts/theme/useTheme";

export default function App() {
  const {isDarkMode} = useTheme()
  return <Layout>
    <Toaster richColors gap={10} theme={isDarkMode ? 'dark' : 'light'} position="top-center" duration={3500} closeButton />
    <Index />
  </Layout>
}