import Layout from "./components/Layout";
import { Toaster } from "sonner";
import Index from "./pages/Index/Index";

export default function App() {
  return <Layout>
    <Toaster richColors position="top-center" duration={3500} closeButton />
    <Index />
  </Layout>
}