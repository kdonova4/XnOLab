import { Box, Button, Container, createTheme, IconButton, Stack, Typography } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
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
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function App() {
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  return (
    <>



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


                  <Route path="/formations" element={
                    <ProtectedRoute>
                      <FormationLibrary />
                    </ProtectedRoute>} />


                  <Route path="/playbooks" element={
                    <ProtectedRoute>
                      <PlaybookLibrary />
                    </ProtectedRoute>} />
                  <Route path="/playbook/:playbookId" element={
                    <ProtectedRoute>
                      <PlaybookViewer />
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
                  backgroundColor: "#181a1b5b",
                  p: 4,
                }}
              >
                <Container>
                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    justifyContent="left"
                    gap={6}
                  >
                    {/* CONTACT */}
                    <Stack gap={2}>
                      <Typography variant="h5" fontWeight={600}>
                        Contact
                      </Typography>

                      <Typography sx={{ color: '#ffffff91' }} variant="body1">
                        EMAIL: donovankevin58@gmail.com
                      </Typography>

                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography sx={{ color: '#ffffff91' }} variant="body1">SOCIAL:</Typography>

                        <Stack direction="row" gap={1}>
                          <IconButton
                            href="https://www.linkedin.com/in/kevindonovan23"
                            target="_blank"
                            sx={{ color: '#ffffff91' }}
                          >
                            <LinkedInIcon />
                          </IconButton>

                          <IconButton
                            href="https://github.com/kdonova4"
                            target="_blank"
                            sx={{ color: '#ffffff91' }}
                          >
                            <GitHubIcon />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Stack>

                    {/* MENU */}
                    <Stack gap={2}>
                      <Typography variant="h5" fontWeight={600}>
                        Menu
                      </Typography>

                      <Typography
                        component="span"
                        onClick={() => navigate("/")}
                        sx={{
                          cursor: "pointer",
                          color: "green",
                          textDecoration: "underline",
                          "&:hover": { opacity: 0.8 },
                        }}
                      >
                        Home
                      </Typography>
                      <Typography
                        component="span"
                        onClick={() => navigate("/playbooks")}
                        sx={{
                          cursor: "pointer",
                          color: "green",
                          textDecoration: "underline",
                          "&:hover": { opacity: 0.8 },
                        }}
                      >
                        Playbooks
                      </Typography>

                      <Typography
                        component="span"
                        onClick={() => navigate("/formations")}
                        sx={{
                          cursor: "pointer",
                          color: "green",
                          textDecoration: "underline",
                          "&:hover": { opacity: 0.8 },
                        }}
                      >
                        Formations
                      </Typography>

                      <Typography
                        component="span"
                        onClick={() => navigate("/playsheets")}
                        sx={{
                          cursor: "pointer",
                          color: "green",
                          textDecoration: "underline",
                          "&:hover": { opacity: 0.8 },
                        }}
                      >
                        Playsheets
                      </Typography>
                    </Stack>
                  </Box>
                </Container>
              </Box>
            </Box>
          </AuthProvider>
        </QueryClientProvider>
      </SnackbarProvider>


    </>
  )
}

export default App;