import "./App.css";
import { ThemeProvider } from "./components/ui/themeprovider";
import { AppSidebar } from "./components/Structure/appSidebar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/main";
import Projects from "./pages/Projects/main";
import Settings from "./pages/Settings/main";
import Tools from "./pages/Tools/main";
function App() {


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />

      <Router>
        <div className="flex flex-row">
          <div className="width= 13rem">
            <AppSidebar />
          </div>

          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>

      </Router>
  </ThemeProvider>
  );
}

export default App;
