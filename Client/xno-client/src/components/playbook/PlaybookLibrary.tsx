import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deletePlaybook, getPlaybooksByUser } from "../../api/PlaybookAPI";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { alpha, Box, Button, Card, Container, Fab, IconButton, InputBase, Menu, MenuItem, Stack, styled, Tooltip, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '50%',

    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: '20%',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function PlaybookLibrary() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState<string>("")
    const { data, error, isSuccess } = useQuery({
        queryKey: ["playbooks"],
        queryFn: () => getPlaybooksByUser(),
        retry: false
    })

    const [anchorElPlaybook, setAnchorElPlaybook] = useState<null | HTMLElement>(null);
    const [selectedPlaybookId, setSelectedPlaybookId] = useState<null | number>(null);
    const handleOpenPlaybookMenu = (event: React.MouseEvent<HTMLElement>, playbookId: number) => {
        setAnchorElPlaybook(event.currentTarget);
        setSelectedPlaybookId(playbookId);
    }

    const handleClosePlaybookmenu = () => {
        setAnchorElPlaybook(null);
        setSelectedPlaybookId(null);
    }

    const handleEdit = (playbookId: number) => {
        handleClosePlaybookmenu();
        navigate(`/playbook/edit/${playbookId}`)
    }



    const { mutate } = useMutation<void, Error, number>({
        mutationFn: deletePlaybook,
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: ["playbooks"] })
            enqueueSnackbar(`Playbook With ID ${deletedId} Successfully Deleted`, { variant: "success" })
        }
    })

    const filteredPlaybooks = useMemo(() => {
        if (!data) return [];

        return data.filter(playbook => {
            if (!playbook.playbookName.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            return true;
        })
    }, [data, searchQuery])

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error.message, { variant: "error" });
            navigate("/");
        }
    }, [error, navigate]);

    const handleDelete = async (playbookId: number) => {
        try {
            const confirmed = window.confirm("Are You Sure? Deleting This Playbook Will Delete All Associated Plays.")
            if (confirmed) {
                mutate(playbookId)

            }
            handleClosePlaybookmenu()
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "success" });
        }
    }

    if (isSuccess) {
        if (!data || data.length === 0) {
            return <p>No Playbooks</p>
        } else {
            return (
                <>
                    <Container className="container">
                        <Typography variant="h3" p={2}>
                            Your Playbooks
                        </Typography>
                        <Stack>
                            <Box sx={{ backgroundColor: 'darkgreen', borderTopRightRadius: '40px', borderTopLeftRadius: '40px' }}>
                                <Stack
                                    direction="row"
                                    p={2}
                                    width="100%"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ boxSizing: "border-box" }}
                                >
                                    <Search>
                                        <SearchIconWrapper>
                                            <SearchIcon />
                                        </SearchIconWrapper>

                                        <StyledInputBase
                                            name="searchQuery"
                                            placeholder="Filter By Name"
                                            inputProps={{ 'aria-label': 'search' }}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </Search>

                                    <Fab
                                        variant="extended"
                                        sx={{
                                            backgroundColor: 'green',
                                            color: 'black',

                                            '&:hover': {
                                                backgroundColor: 'lightgreen', // hover color
                                            },

                                            '&:active': {
                                                backgroundColor: 'darkgreen', // click/pressed color
                                            },
                                        }}
                                    >
                                        <AddIcon sx={{ mr: 1 }} />
                                        Create New
                                    </Fab>
                                </Stack>
                            </Box>
                            <Box sx={{ backgroundColor: '#181a1b', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderBottomRightRadius: '20px', borderBottomLeftRadius: '20px' }}>
                                {filteredPlaybooks.map((playbook) => (
                                    <Card key={playbook.playbookId} sx={{
                                        width: '20%', margin: 2, backgroundColor: 'green', transition: 'background-color 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'lightgreen',
                                        },
                                    }}>
                                        <Stack sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }} direction="row">
                                            <Typography sx={{ cursor: 'pointer', width: '100%' }} onClick={() => navigate(`/playbook/${playbook.playbookId}`)} overflow="hidden" textOverflow="ellipsis" noWrap p={1} variant="h6">{playbook.playbookName}</Typography>

                                            <Tooltip sx={{ alignContent: 'flex-end', }} title="Open Settings">
                                                <IconButton onClick={(e) => handleOpenPlaybookMenu(e, playbook.playbookId)} sx={{ p: 0 }}>
                                                    <MoreVertIcon fontSize="large" sx={{ color: 'black' }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Menu
                                                anchorEl={anchorElPlaybook}
                                                open={Boolean(anchorElPlaybook)}
                                                onClose={handleClosePlaybookmenu}
                                                disableScrollLock={true}
                                            >
                                                <MenuItem onClick={() => handleEdit(selectedPlaybookId!!)}>Edit</MenuItem>
                                                <MenuItem onClick={() => handleDelete(selectedPlaybookId!!)}>Delete</MenuItem>
                                            </Menu>
                                        </Stack>
                                    </Card>
                                ))}




                                <Card sx={{ width: '20%', margin: 2, backgroundColor: 'rgba(187, 187, 187, 0.27)' }}>
                                    <Button sx={{
                                        width: '100%', height: '100%', color: 'black', backgroundColor: 'darkgreen',

                                        '&:hover': {
                                            backgroundColor: 'lightgreen', // hover color
                                        },

                                        '&:active': {
                                            backgroundColor: 'darkgreen', // click/pressed color
                                        },
                                        '& .MuiButton-label': {
                                            color: 'black',
                                        },
                                    }} onClick={() => navigate("/playbook/create")}>Create New</Button>
                                </Card>
                            </Box>
                        </Stack>

                    </Container>
                </>
            )
        }
    }
}

export default PlaybookLibrary;