import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AppBarComponent() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const { appUser, isAuthenticated, logoutUser } = useAuth();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    }

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    const handlePlaybookClick = () => {
        handleCloseNavMenu();
        navigate('/playbooks')
    }

    const handleFormationClick = () => {
        handleCloseNavMenu();
        navigate('/formations')
    }

    const handlePlaySheetClick = () => {
        handleCloseNavMenu();
        navigate('/playsheets')
    }

    const handleLogout = () => {
        handleCloseUserMenu();
        logoutUser();
    }

    const handleLogin = () => {
        handleCloseUserMenu();
        navigate('/login')
    }

    if (isAuthenticated) {
        return (
            <AppBar sx={{ backgroundColor: "#181a1b", }} position="fixed">
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{
                        position: 'relative',
                        width: '100%',
                        minHeight: { xs: 56, md: 64 },
                        height: { xs: 56, md: 64 }
                    }}>

                        {/* LEFT (mobile menu / desktop logo area) */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>

                            {/* Mobile menu */}
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>

                                <Menu
                                    anchorEl={anchorElNav}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    disableScrollLock={true}
                                >
                                    <MenuItem onClick={handlePlaybookClick}>Playbooks</MenuItem>
                                    <MenuItem onClick={handleFormationClick}>Formations</MenuItem>
                                    <MenuItem onClick={handlePlaySheetClick}>Playsheets</MenuItem>
                                </Menu>
                            </Box>

                            {/* Desktop logo */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                                <Typography
                                    variant="h6"
                                    component="a"
                                    noWrap
                                    href="/"
                                    sx={{
                                        mr: 2,
                                        display: { xs: 'none', md: 'flex' },
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none'
                                    }}
                                >
                                    XnO
                                </Typography>
                            </Box>
                            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <Button
                                    onClick={handlePlaybookClick}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    Playbooks
                                </Button>
                                <Button
                                    onClick={handleFormationClick}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    Formations
                                </Button>
                                <Button
                                    onClick={handlePlaySheetClick}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    Playsheets
                                </Button>
                            </Box>

                        </Box>

                        {/* CENTER (absolute true center) */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: { xs: 'flex', md: 'none' }
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem'
                                }}
                            >
                                LOGO
                            </Typography>
                        </Box>

                        {/* RIGHT (user info) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>

                            <Typography sx={{ mr: 1, fontFamily: 'monospace' }}>
                                {appUser?.username}
                            </Typography>

                            <Tooltip title="Open Settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <AccountCircleIcon fontSize="large" sx={{ color: 'white' }} />
                                </IconButton>
                            </Tooltip>

                            <Menu
                                anchorEl={anchorElUser}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                disableScrollLock={true}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>

                        </Box>

                    </Toolbar>
                </Container>
            </AppBar>
        )
    } else {
        return (
            <AppBar sx={{ backgroundColor: "#181a1b", }} position="fixed">
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{
                        position: 'relative',
                        width: '100%',
                        minHeight: { xs: 56, md: 64 },
                        height: { xs: 56, md: 64 }
                    }}>

                        {/* LEFT (mobile menu / desktop logo area) */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>

                            {/* Mobile menu */}
                            {isAuthenticated && (
                                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                    <IconButton
                                        size="large"
                                        onClick={handleOpenNavMenu}
                                        color="inherit"
                                    >
                                        <MenuIcon />
                                    </IconButton>

                                    <Menu
                                        anchorEl={anchorElNav}
                                        open={Boolean(anchorElNav)}
                                        onClose={handleCloseNavMenu}
                                    >
                                        <MenuItem onClick={handleCloseNavMenu}>Playbooks</MenuItem>
                                        <MenuItem onClick={handleCloseNavMenu}>Formations</MenuItem>
                                        <MenuItem onClick={handleCloseNavMenu}>Playsheets</MenuItem>
                                    </Menu>
                                </Box>
                            )}


                            {/* Desktop logo */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                                <Typography
                                    variant="h6"
                                    component="a"
                                    noWrap
                                    href="/"
                                    sx={{
                                        mr: 2,
                                        display: { xs: 'none', md: 'flex' },
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none'
                                    }}
                                >
                                    XnO
                                </Typography>
                            </Box>


                        </Box>

                        {/* CENTER (absolute true center) */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: { xs: 'flex', md: 'none' }
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem'
                                }}
                            >
                                LOGO
                            </Typography>
                        </Box>

                        {/* RIGHT (user info) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>

                            <Typography sx={{ mr: 1, fontFamily: 'monospace' }}>
                                {appUser?.username}
                            </Typography>

                            <Tooltip title="Open Settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <AccountCircleIcon fontSize="large" sx={{ color: 'white' }} />
                                </IconButton>
                            </Tooltip>

                            <Menu
                                anchorEl={anchorElUser}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                disableScrollLock={true}
                            >
                                <MenuItem onClick={handleLogin}>Login</MenuItem>
                            </Menu>

                        </Box>

                    </Toolbar>
                </Container>
            </AppBar>
        )
    }

}