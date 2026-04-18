import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deletePlay, getPlaysByPlaybook } from "../../api/PlayAPI";
import { useEffect, useMemo, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { getAllFormationsByUser } from "../../api/FormationAPI";
import { Box, Button, Card, CardMedia, Container, Fab, FormControl, IconButton, InputLabel, Menu, MenuItem, Modal, Select, Stack, Tooltip, Typography } from "@mui/material";
import FormationViewer from "../formation/FormationViewer";
import type { FormationResponse } from "../../types/Response/FormationResponse";
import type { PlayResponse } from "../../types/Response/PlayResponse";
import PlayViewer from "./PlayViewer";
import { Search, SearchIconWrapper, StyledInputBase } from "../other/MUISearchLibraryComponents";
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';

type PlayLibraryProps = {
    playbookId: number
}

function PlayLibrary({ playbookId }: PlayLibraryProps) {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [formationViewOpen, setFormationViewOpen] = useState(false);
    const [playViewOpen, setPlayViewOpen] = useState(false);
    const [viewedFormation, setViewedFormation] = useState<FormationResponse>()
    const [selectedPlay, setSelectedPlay] = useState<PlayResponse | null>(null);
    const [selectedFormationId, setSelectedFormationId] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("")

    const [anchorElPlay, setAnchorElPlay] = useState<null | HTMLElement>(null);
    const handleOpenPlayMenu = (event: React.MouseEvent<HTMLElement>, play: PlayResponse) => {
        setAnchorElPlay(event.currentTarget);
        setSelectedPlay(play);
    }

    const handleClosePlayMenu = () => {
        setAnchorElPlay(null);
        setSelectedPlay(null);
    }

    const handleEdit = (playId: number) => {
        handleClosePlayMenu();
        navigate(`/play/edit/${playId}`)
    }


    const { data, error, isSuccess } = useQuery({
        queryKey: ["plays", playbookId],
        queryFn: () => getPlaysByPlaybook(Number(playbookId)),
        retry: false
    })
    const formationsQuery = useQuery({
        queryKey: ["formations"],
        queryFn: () => getAllFormationsByUser(),
        retry: false
    })

    const { mutate } = useMutation<void, Error, number>({
        mutationFn: deletePlay,
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: ["plays", playbookId] })
            enqueueSnackbar(`Play With ID ${deletedId} Successfully Deleted`, { variant: "success" })
        }
    })

    const filteredPlays = useMemo(() => {
        if (!data) return [];

        return data.filter(play => {
            if (selectedFormationId && play.formationResponse.formationId !== selectedFormationId) {
                return false;
            }

            if (!play.playName.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            return true;
        })
    }, [data, selectedFormationId, searchQuery])

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error.message, { variant: "error" });
            navigate("/");
        }
    }, [error, navigate]);

    const handleDelete = async (playId: number) => {
        try {
            const confirm = window.confirm("Are you sure?")
            if (confirm) mutate(playId);
            handleClosePlayMenu();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    }

    const handleFormationOpen = (formation: FormationResponse) => {
        setFormationViewOpen(true);
        setViewedFormation(formation)
    }

    const handlePlayOpen = (play: PlayResponse) => {
        setSelectedPlay(play)
        setPlayViewOpen(true);
    }

    const handleFormationClose = () => {
        setFormationViewOpen(false);
    }

    const handlePlayClose = () => {
        setPlayViewOpen(false)
    }

    if (isSuccess) {
        if (data.length > 0 && formationsQuery.data) {
            return (
                <>

                    <Container>
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
                                    <Box width='85%' display="flex" alignItems="baseline">
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

                                        <FormControl variant="standard" sx={{
                                            minWidth: 200,
                                            ml: 4,

                                            // default underline
                                            '& .MuiInput-underline:before': {
                                                borderBottomColor: 'darkgreen',
                                            },

                                            // hover underline
                                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                borderBottomColor: 'lightgreen',
                                            },

                                            // focused underline (THIS is the main one you want)
                                            '& .MuiInput-underline:after': {
                                                borderBottomColor: 'lightgreen',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: 'black',
                                            },
                                        }}>
                                            <InputLabel id="demo-simple-select-standard-label" shrink={!!selectedFormationId}>Filter By Formation</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                value={selectedFormationId ?? ""}
                                                onChange={(e) => setSelectedFormationId(Number(e.target.value))}
                                                label="Filter By Formation"
                                            >
                                                <MenuItem value="">
                                                    None
                                                </MenuItem>
                                                {formationsQuery.data.map((formation) => (
                                                    <MenuItem key={formation.formationId} value={formation.formationId}>{formation.formationName}</MenuItem>
                                                ))}

                                            </Select>
                                        </FormControl>

                                    </Box>


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
                                        onClick={() => navigate(`/play/${playbookId}/create`)}>
                                        <AddIcon sx={{ mr: 1 }} />
                                        Create New
                                    </Fab>
                                </Stack>
                            </Box>
                            <Box sx={{ backgroundColor: '#181a1b', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderBottomRightRadius: '20px', borderBottomLeftRadius: '20px' }}>
                                {data && data.length > 0 && formationsQuery.data && (
                                    filteredPlays.map((play) => (
                                        <Card key={play.playId} sx={{
                                            width: '20%', margin: 2, backgroundColor: 'green', transition: 'background-color 0.3s ease', cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'lightgreen',
                                            },
                                        }}>
                                            <CardMedia sx={{ height: 155 }} onClick={() => handlePlayOpen(play)} image={play.playImageUrl} title={play.playName} />
                                            <Stack sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }} direction="row">

                                                <Typography onClick={() => handlePlayOpen(play)} sx={{ width: '100%' }} overflow="hidden" textOverflow="ellipsis" noWrap p={1} variant="h6">{play.playName}</Typography>

                                                <Tooltip sx={{ alignContent: 'flex-end', }} title="Open Settings">
                                                    <IconButton onClick={(e) => handleOpenPlayMenu(e, play)} sx={{ p: 0 }}>
                                                        <MoreVertIcon fontSize="large" sx={{ color: 'black' }} />
                                                    </IconButton>
                                                </Tooltip>

                                            </Stack>
                                        </Card>
                                    ))
                                )}

                                <Menu
                                    anchorEl={anchorElPlay}
                                    open={Boolean(anchorElPlay)}
                                    onClose={handleClosePlayMenu}
                                    disableScrollLock={true}
                                >
                                    <MenuItem onClick={() => handleEdit(selectedPlay?.playId!!)}>Edit</MenuItem>
                                    <MenuItem onClick={() => handleDelete(selectedPlay?.playId!!)}>Delete</MenuItem>
                                </Menu>




                                <Card sx={{ width: '20%', height: '203px', margin: 2, backgroundColor: 'rgba(187, 187, 187, 0.27)' }}>
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
                                    }} onClick={() => navigate(`/play/${playbookId}/create`)}>Create New</Button>
                                </Card>
                            </Box>
                        </Stack>
                    </Container>
                    
                    <Modal
                        open={formationViewOpen}
                        onClose={handleFormationClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >

                        <FormationViewer formation={viewedFormation}></FormationViewer>


                    </Modal>
                    <Modal
                        open={playViewOpen}
                        onClose={handlePlayClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <PlayViewer play={selectedPlay} />
                    </Modal>

                </>
            )
        } else if (data.length === 0) {
            return (
                <>
                    <Container>
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
                                    <Box width='85%' display="flex" alignItems="baseline">
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

                                        

                                    </Box>


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
                                        onClick={() => navigate(`/play/${playbookId}/create`)}>
                                        <AddIcon sx={{ mr: 1 }} />
                                        Create New
                                    </Fab>
                                </Stack>
                            </Box>
                            <Box sx={{ backgroundColor: '#181a1b', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderBottomRightRadius: '20px', borderBottomLeftRadius: '20px' }}>
                                
                                <Card sx={{ width: '20%', height: '203px', margin: 2, backgroundColor: 'rgba(187, 187, 187, 0.27)' }}>
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
                                    }} onClick={() => navigate(`/play/${playbookId}/create`)}>Create New</Button>
                                </Card>
                            </Box>
                        </Stack>
                    </Container>
                </>
            )
        }
    }

}

export default PlayLibrary;