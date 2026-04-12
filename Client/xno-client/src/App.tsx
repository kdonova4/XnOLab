import { Box, Container } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./components/other/HomePage";
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import FormationForm from "./components/formation/FormationForm";
import PlayForm from "./components/play/PlayForm";
import PlaybookLibrary from "./components/playbook/PlaybookLibrary";
import PlaybookViewer from "./components/playbook/PlaybookViewer";
import PlaybookForm from "./components/playbook/PlaybookForm";
import PlaySheetForm from "./components/playsheet/PlaySheetForm";
import PlaySheetLibrary from "./components/playsheet/PlaySheetLibrary";
import { AuthProvider } from "./components/hooks/AuthContext";
import FormationLibrary from "./components/formation/FormationLibrary";
import ProtectedRoute from "./components/other/ProtectedRoute";
import AppBarComponent from "./components/other/AppBarComponent";



function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <Router>


        <SnackbarProvider maxSnack={5} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Box
  sx={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}
>
              <AppBarComponent />
              <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/formation/create" element={
                  <ProtectedRoute>
                    <FormationForm />
                  </ProtectedRoute>} />
                <Route path="/formation/edit/:id" element={
                  <ProtectedRoute>
                    <FormationForm />
                  </ProtectedRoute>} />
                <Route path="/formations" element={
                  <ProtectedRoute>
                    <FormationLibrary />
                  </ProtectedRoute>} />
                <Route path="/play/:playbookId/create" element={
                  <ProtectedRoute>
                    <PlayForm />
                  </ProtectedRoute>} />
                <Route path="/play/edit/:playId" element={
                  <ProtectedRoute>
                    <PlayForm />
                  </ProtectedRoute>} />
                <Route path="/playbooks" element={
                  <ProtectedRoute>
                    <PlaybookLibrary />
                  </ProtectedRoute>} />
                <Route path="/playbook/:playbookId" element={
                  <ProtectedRoute>
                    <PlaybookViewer />
                  </ProtectedRoute>} />
                <Route path="/playbook/create" element={
                  <ProtectedRoute>
                    <PlaybookForm />
                  </ProtectedRoute>} />
                <Route path="/playbook/edit/:id" element={
                  <ProtectedRoute>
                    <PlaybookForm />
                  </ProtectedRoute>} />
                <Route path="/playsheet/:playbookId/create" element={
                  <ProtectedRoute>
                    <PlaySheetForm />
                  </ProtectedRoute>} />
                <Route path="/playsheet/edit/:id" element={
                  <ProtectedRoute>
                    <PlaySheetForm />
                  </ProtectedRoute>} />
                <Route path="/playsheets" element={
                  <ProtectedRoute>
                    <PlaySheetLibrary />
                  </ProtectedRoute>} />

              </Routes>
              </Box>
<Box
    component="footer"
    sx={{
      backgroundColor: '#181a1b5b',
      p: 2
    }}
  >
    <Container>
      Hello
    </Container>
  </Box>
</Box>
            </AuthProvider>
          </QueryClientProvider>
        </SnackbarProvider>

      </Router>
    </>
  )
}

export default App;