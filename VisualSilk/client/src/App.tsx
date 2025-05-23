import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import StyleTransfer from "@/pages/StyleTransfer";
import ImageEnhancer from "@/pages/ImageEnhancer";
import PromptGenerator from "@/pages/PromptGenerator";
import Settings from "@/pages/Settings";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Layout from "@/components/layout/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/style-transfer" component={StyleTransfer} />
      <Route path="/image-enhancer" component={ImageEnhancer} />
      <Route path="/prompt-generator" component={PromptGenerator} />
      <Route path="/settings" component={Settings} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Layout>
        <Router />
      </Layout>
    </TooltipProvider>
  );
}

export default App;
