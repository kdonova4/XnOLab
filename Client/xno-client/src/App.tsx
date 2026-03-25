import { Container } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./components/other/HomePage";
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import FormationForm from "./components/formation/FormationForm";
import PlayCopyForm from "./components/play/PlayCopyForm";
import PlayForm from "./components/play/PlayLibrary";
import PlaybookLibrary from "./components/playbook/PlaybookLibrary";
import PlaybookViewer from "./components/playbook/PlaybookViewer";
import PlaybookForm from "./components/playbook/PlaybookForm";
import PlaySheetForm from "./components/playsheet/PlaySheetForm";
import PlaySheetLibrary from "./components/playsheet/PlaySheetLibrary";
import PlaySheetViewer from "./components/playsheet/PlaySheetViewer";
import { AuthProvider } from "./components/hooks/AuthContext";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <Router>
        <Container maxWidth="xl">
          <SnackbarProvider maxSnack={5} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />

                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/formation/create" element={<FormationForm />} />
                  <Route path="/formation/edit/:id" element={<FormationForm />} />
                  <Route path="/copy/:destinationPlaybookId" element={<PlayCopyForm />} />
                  <Route path="/play/create" element={<PlayForm />} />
                  <Route path="/play/edit/:id" element={<PlayForm />} />
                  <Route path="/playbooks" element={<PlaybookLibrary />} />
                  <Route path="/playbook/:id" element={<PlaybookViewer />} />
                  <Route path="/playbook/create" element={<PlaybookForm />} />
                  <Route path="/playbook/edit/:id" element={<PlaybookForm />} />
                  <Route path="/playsheet/create" element={<PlaySheetForm />} />
                  <Route path="/playsheet/edit/:id" element={<PlaySheetForm />} />
                  <Route path="/playsheets" element={<PlaySheetLibrary />} />
                  <Route path="/playsheet/:id" element={<PlaySheetViewer />} />

                </Routes>
              </AuthProvider>
            </QueryClientProvider>
          </SnackbarProvider>
        </Container>
      </Router>
    </>
  )
}

export default App;