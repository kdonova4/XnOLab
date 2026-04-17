import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePlaySheet, getPlaySheetsByUser } from "../../api/PlaySheetAPI";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Box, Button, Card, Container, Fab, FormControl, IconButton, InputLabel, Menu, MenuItem, Modal, Select, Stack, Tooltip, Typography } from "@mui/material";
import GenerationDetailsForm from "./GenerationDetailsForm";
import type { PlaySheetSummaryResponse } from "../../types/Response/PlaySheetSummaryResponse";
import { Search, SearchIconWrapper, StyledInputBase } from "../other/MUISearchLibraryComponents";
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import { getPlaybooksByUser } from "../../api/PlaybookAPI";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#181a1b',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function PlaySheetLibrary() {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [playSheet, setPlaySheet] = useState<PlaySheetSummaryResponse | null | undefined>();
    const [open, setOpen] = useState(false);
    const [playbookSelectOpen, setPlaybookSelectOpen] = useState(false);
    const [selectedPlaybookId, setSelectedPlaybookId] = useState<null | number>(null);
    const playbookQuery = useQuery({
        queryKey: ["playbooks"],
        queryFn: () => getPlaybooksByUser(),
    })



    const { data, error, isSuccess } = useQuery({
        queryKey: ["playsheets"],
        queryFn: () => getPlaySheetsByUser(),
        retry: false
    })
    const [anchorElPlaysheet, setAnchorElPlaysheet] = useState<null | HTMLElement>(null);
    const [selectedPlaysheet, setSelectedPlaysheet] = useState<null | PlaySheetSummaryResponse>(null);
    const handleOpenPlaysheetMenu = (event: React.MouseEvent<HTMLElement>, playSheet: PlaySheetSummaryResponse) => {
        setAnchorElPlaysheet(event.currentTarget);
        setSelectedPlaysheet(playSheet);
    }

    const handleClosePlaysheetMenu = () => {
        setAnchorElPlaysheet(null);
        setSelectedPlaysheet(null);
    }

    const handleEdit = (playSheetId: number) => {
        handleClosePlaysheetMenu();
        navigate(`/playsheet/edit/${playSheetId}`)
    }

    const { mutate } = useMutation<void, Error, number>({
        mutationFn: deletePlaySheet,
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: ["playsheets"] })
            enqueueSnackbar(`PlaySheet With ID ${deletedId} Successfully Deleted`, { variant: "success" })
        }
    })

    const filteredPlaySheets = useMemo(() => {
        if (!data) return [];

        return data.filter(playsheet => {
            if (!playsheet.playSheetName.toLowerCase().includes(searchQuery.toLowerCase())) {
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

    const handleDelete = async (playSheetId: number) => {
        try {
            const confirm = window.confirm("Are your Sure?")
            if (confirm) {
                mutate(playSheetId);
            }
            handleClosePlaysheetMenu();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            enqueueSnackbar(message, { variant: "error" })
        }
    }

    const handleOpen = (playSheet: PlaySheetSummaryResponse) => {
        setOpen(true);
        setPlaySheet(playSheet)
        handleClosePlaysheetMenu();
    }

    const handleClose = () => {
        setOpen(false);
        setPlaySheet(null)
    }

    const handlePlaybookOpen = () => {
        setPlaybookSelectOpen(true);
    }

    const handlePlaybookSelectClose = () => {
        setPlaybookSelectOpen(false);
    }


    if (isSuccess) {

        return (
            <>
                <Container className="container">
                    <Typography variant="h3" p={2}>
                        Your Playsheets
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
                                    onClick={handlePlaybookOpen}>
                                    <AddIcon sx={{ mr: 1 }} />
                                    Create New
                                </Fab>
                            </Stack>
                        </Box>
                        <Box sx={{ backgroundColor: '#181a1b', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderBottomRightRadius: '20px', borderBottomLeftRadius: '20px' }}>
                            {data && data.length > 0 && (
                                filteredPlaySheets.map((playsheet) => (
                                    <Card key={playsheet.playSheetId} sx={{
                                        width: '20%', margin: 2, backgroundColor: 'green'
                                    }}>
                                        <Stack sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }} direction="row">

                                            <Typography sx={{ width: '100%' }} overflow="hidden" textOverflow="ellipsis" noWrap p={1} variant="h6">{playsheet.playSheetName}</Typography>

                                            <Tooltip sx={{ alignContent: 'flex-end', }} title="Open Settings">
                                                <IconButton onClick={(e) => handleOpenPlaysheetMenu(e, playsheet)} sx={{ p: 0 }}>
                                                    <MoreVertIcon fontSize="large" sx={{ color: 'black' }} />
                                                </IconButton>
                                            </Tooltip>

                                        </Stack>

                                    </Card>
                                ))
                            )}



                            <Menu
                                anchorEl={anchorElPlaysheet}
                                open={Boolean(anchorElPlaysheet)}
                                onClose={handleClosePlaysheetMenu}
                                disableScrollLock={true}
                            >
                                <MenuItem onClick={() => handleEdit(selectedPlaysheet?.playSheetId!!)}>Edit</MenuItem>
                                <MenuItem onClick={() => handleDelete(selectedPlaysheet?.playSheetId!!)}>Delete</MenuItem>
                                <MenuItem onClick={() => handleOpen(selectedPlaysheet!!)}>Generate</MenuItem>
                            </Menu>


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
                                }} onClick={handlePlaybookOpen}>Create New</Button>
                            </Card>
                        </Box>
                    </Stack>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <GenerationDetailsForm playSheet={playSheet} handleClose={handleClose} />
                    </Modal>
                    {playbookQuery.data && playbookQuery.data.length > 0 && (
                        <Modal
                            open={playbookSelectOpen}
                            onClose={handlePlaybookSelectClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>

                                <Stack>
                                    <Stack flexDirection={"row"} alignItems={"center"} gap={1}>

                                        <FormControl variant="standard" sx={{
                                            minWidth: 200,
                                            maxWidth: 350,
                                            ml: 2,
                                            mb: 2,
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
                                                color: 'white',
                                            },
                                        }}>
                                            <InputLabel
                                                id="demo-simple-select-standard-label"
                                                shrink={!!selectedPlaybookId}
                                                sx={{
                                                    color: 'white',
                                                    '&.Mui-focused': {
                                                        color: 'white',
                                                    },
                                                }}
                                            >
                                                Select Playbook
                                            </InputLabel>                                                
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                value={selectedPlaybookId ?? ""}
                                                onChange={(e) => setSelectedPlaybookId(Number(e.target.value))}
                                                label="Select Playbook"
                                                sx={{
                                                    color: 'white', // selected value text
                                                    '& .MuiSvgIcon-root': {
                                                        color: 'white', // dropdown arrow
                                                    },
                                                }}
                                            >
                                                <MenuItem value="">
                                                    None
                                                </MenuItem>
                                                {playbookQuery.data.map((playbook) => (
                                                    <MenuItem key={playbook.playbookId} value={playbook.playbookId}>{playbook.playbookName}</MenuItem>
                                                ))}

                                            </Select>
                                        </FormControl>
                                    </Stack>

                                    <Button sx={{
                                        m: 1,
                                        backgroundColor: 'green',
                                        color: 'black',

                                        '&:hover': {
                                            backgroundColor: 'lightgreen', // hover color
                                        },

                                        '&:active': {
                                            backgroundColor: 'darkgreen', // click/pressed color
                                        },
                                    }} variant="contained" onClick={() => navigate(selectedPlaybookId ? `/playsheet/${selectedPlaybookId}/create` : "")}>Go</Button>


                                </Stack>
                            </Box>
                        </Modal>
                    )}

                </Container>



            </>
        )

    }


}

export default PlaySheetLibrary;