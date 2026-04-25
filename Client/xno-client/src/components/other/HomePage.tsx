import { Box, Container, Stack, Typography } from "@mui/material";
import logo from "/XnO-Logo.png";


function HomePage() {


    return (
        <>

            <header className="home-picture">
                <img src={logo} className="fade-in" />
            </header>
            <Container sx={{ paddingBottom: 12.5 }}>
                <Typography paddingTop={2} variant="h2" className="" style={{ textAlign: 'center', color: 'green' }}>Create Your Own Playbooks</Typography>
                <Stack direction="row" justifyContent="center" gap={10} p={6}>
                    <Box display={'flex'} gap={5} alignItems={'center'}>
                        <Box>
                            <img width={400} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }} src="https://res.cloudinary.com/dhucaqc0o/image/upload/v1777071229/Screenshot_2026-04-24_at_18-53-44_XnO_Lab_xteybt.png" />
                        </Box>
                        <Box>
                            <img width={400} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }} src="https://res.cloudinary.com/dhucaqc0o/image/upload/v1777071124/Screenshot_2026-04-24_at_18-44-06_XnO_Lab_khtxbq.png" />
                        </Box>
                    </Box>

                </Stack>
                <Typography textAlign={'center'} variant="h6">Create and organize your own football playbooks. Build offensive and defensive plays, design formations, and structure your game plan exactly how you want it.</Typography>

                <Typography variant="h2" style={{ textAlign: 'center', color: 'green', marginTop: 50 }}>Design and Create Your Own Formations</Typography>
                <Stack direction="row" justifyContent="center" gap={10} p={6}>
                     <Box display={'flex'} gap={5} alignItems={'center'}>
<Box>
                        <img width={400} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }} src="https://res.cloudinary.com/dhucaqc0o/image/upload/v1777071124/Screenshot_2026-04-24_at_18-43-50_XnO_Lab_f8tihi.png" />
                    </Box>
                    <Box>
                        <img width={400} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }} src="https://res.cloudinary.com/dhucaqc0o/image/upload/v1777071519/Screenshot_2026-04-24_at_18-58-34_XnO_Lab_tuulnk.png" />
                    </Box>
                     </Box>
                    
                </Stack>
                <Typography textAlign={'center'} variant="h6">Design your own football formations directly on a simple drawing canvas. Sketch plays freely just like you would on paper and bring your ideas to life without restrictions.</Typography>


                <Typography variant="h2" style={{ textAlign: 'center', color: 'green', marginTop: 50 }}>Use Those Formations To Create Your Plays</Typography>
                <Stack direction="row" justifyContent="center" gap={10} p={6}>
                    <Box display={'flex'} gap={5} alignItems={'center'}>
                        <Box>
                            <img width={400} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }} src="https://res.cloudinary.com/dhucaqc0o/image/upload/v1777085462/Screenshot_2026-04-24_at_22-50-56_XnO_Lab_v23gcv.png" />
                        </Box>
                        <Box>
                            <img width={400} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }} src="https://res.cloudinary.com/dhucaqc0o/image/upload/v1777085401/Screenshot_2026-04-24_at_22-49-42_XnO_Lab_kc5md1.png" />
                        </Box>
                    </Box>

                </Stack>
                <Typography textAlign={'center'} variant="h6">Take your formations and bring them to life by designing plays directly over them. Sketch routes, assignments, and timing to build fully structured game plans.</Typography>

                <Typography variant="h2" style={{ textAlign: 'center', color: 'green', marginTop: 50 }}>Add Those Plays To Your Playsheets</Typography>
                <Stack direction="row" justifyContent="center" gap={10} p={6}>
                    <Box display={'flex'} gap={5} alignItems={'center'}>
                        <Box>
                            <img width={400} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }} src="https://res.cloudinary.com/dhucaqc0o/image/upload/v1777071124/Screenshot_2026-04-24_at_18-45-42_XnO_Lab_odimzt.png" />
                        </Box>
                        <Box>
                            <img width={400} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }} src="https://res.cloudinary.com/dhucaqc0o/image/upload/v1777071124/Screenshot_2026-04-24_at_18-49-04_XnO_Lab_bbq82x.png" />
                        </Box>
                        <Box>
                            <img width={400} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }} src="https://res.cloudinary.com/dhucaqc0o/image/upload/v1777071124/Screenshot_2026-04-24_at_18-46-23_XnO_Lab_vmgcv9.png" />
                        </Box>
                        
                    </Box>

                </Stack>
                <Typography textAlign={'center'} variant="h6">Compile your plays into playsheets for specific games. Organize your calls, plan your strategy, and stay ready with a structured game-day playbook.</Typography>

                <Typography variant="h2" style={{ textAlign: 'center', color: 'green', marginTop: 50 }}>Generate Your Playsheets & Get To Calling Plays!</Typography>
                <Stack direction="row" justifyContent="center" gap={10} p={6}>
                    <Box display={'flex'} gap={5} alignItems={'center'}>
                        <Box>
                            <img width={400} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }} src="https://res.cloudinary.com/dhucaqc0o/image/upload/v1777071124/Screenshot_2026-04-24_at_18-51-02_XnO_Lab_yhtwsq.png" />
                        </Box>
                        <Box>
                            <img width={400} style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }} src="https://res.cloudinary.com/dhucaqc0o/image/upload/v1777071124/generatedPlayhseet_hubagx.png" />
                        </Box>
                    </Box>

                </Stack>
                <Typography textAlign={'center'} variant="h6">Generate your playsheets and export them to Excel for full control. Customize your layout, reorder plays, and build your ideal game-day call sheet.</Typography>

                
                <br></br>
            </Container> 


        </>
    )
}

export default HomePage;