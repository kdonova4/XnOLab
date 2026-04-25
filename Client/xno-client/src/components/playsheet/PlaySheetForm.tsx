import React, { useEffect, useState } from "react";
import type { PlaySheet } from "../../types/PlaySheet";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlaysByPlaybook } from "../../api/PlayAPI";
import type { PlaySheetSummaryResponse } from "../../types/Response/PlaySheetSummaryResponse";
import type { PlaySheetCreateRequest } from "../../types/Create/PlaySheetCreateRequest";
import { createPlaySheet, getPlaySheetDetailsById, updatePlaySheet } from "../../api/PlaySheetAPI";
import { enqueueSnackbar } from "notistack";
import type { PlaySheetSituation } from "../../types/PlaySheetSituation";
import { Backdrop, Box, Button, CircularProgress, Container, Divider, Fab, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography } from "@mui/material";
import type { PlaySheetSituationCreateRequest } from "../../types/Create/PlaySheetSituationCreateRequest";
import type { PlaySheetUpdateRequest } from "../../types/Update/PlaySheetUpdateRequest";
import type { PlaySheetSituationUpdateRequest } from "../../types/Update/PlaySheetSituationUpdateRequest";
import type { PlayResponse } from "../../types/Response/PlayResponse";
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from "@mui/lab";

const PLAYSHEETSITUATION_DEFAULT: PlaySheetSituation = {
    playSheetSituationId: 0,
    situationName: "",
    situationColor: "",
    playSheetId: 0,
    plays: []
}
const PLAYSHEET_DEFAULT: PlaySheet = {
    playSheetId: 0,
    playSheetName: "",
    createdAt: "",
    updatedAt: "",
    playbookId: 0,
    situations: [{ ...PLAYSHEETSITUATION_DEFAULT }],
    userId: 0

}


function PlaySheetForm() {

    const [playSheet, setPlaySheet] = useState<PlaySheet>(PLAYSHEET_DEFAULT)
    const [selectedSitaution, setSelectedSituation] = useState<number | null>(null)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { id, playbookId } = useParams();

    const finalPlaybookId =
        playbookId !== undefined
            ? Number(playbookId)
            : playSheet.playbookId;

    const playQuery = useQuery({
        queryKey: ["plays", finalPlaybookId],
        queryFn: () => getPlaysByPlaybook(finalPlaybookId),
        retry: false,
        enabled: finalPlaybookId !== undefined && finalPlaybookId !== 0,
    });

    const queryClient = useQueryClient();

    useEffect(() => {
        if (playbookId) {
            setPlaySheet(prev => ({
                ...prev,
                playbookId: Number(playbookId)
            }));
        }
    }, [playbookId]);

    useEffect(() => {
        if (playQuery.error) {
            enqueueSnackbar(playQuery.error.message, { variant: "error" });
            navigate("/");
        }
    }, [playQuery.error, navigate]);

    useEffect(() => {


        const loadPlaySheet = async () => {
            try {
                setLoading(true)
                const data = await getPlaySheetDetailsById(Number(id));
                console.log(data)
                const existingPlaySheet: PlaySheet = {
                    playSheetId: data.playSheetId,
                    playSheetName: data.playSheetName,
                    playbookId: data.playbook.playbookId,
                    userId: 0,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    situations: data.situations.map((situation => {
                        const updateSituation: PlaySheetSituation = {
                            playSheetSituationId: situation.playSheetSituationId,
                            situationName: situation.situationName,
                            situationColor: situation.situationColor,
                            playSheetId: situation.playSheetId,
                            plays: situation.plays.map((play) => {
                                const playResponse: PlayResponse = {
                                    playId: play.playResponse.playId,
                                    playName: play.playResponse.playName,
                                    playNotes: play.playResponse.playNotes,
                                    playImageUrl: play.playResponse.playImageUrl,
                                    playbookResponse: play.playResponse.playbookResponse,
                                    formationResponse: play.playResponse.formationResponse
                                }

                                return playResponse;
                            })

                        }

                        return updateSituation
                    }))

                }

                setPlaySheet(existingPlaySheet);
            } catch (error) {
                setLoading(false);
                const message = error instanceof Error ? error.message : "Something went wrong";
                enqueueSnackbar(message, { variant: "success" });
                navigate("/playsheets")
            } finally {
                setLoading(false);
            }
        };


        if (id) {
            loadPlaySheet();
        }
    }, [id]);

    const createMutation = useMutation<PlaySheetSummaryResponse, Error, PlaySheetCreateRequest>({
        mutationFn: createPlaySheet,
        onSuccess: (_, playsheet) => {
            queryClient.invalidateQueries({ queryKey: ["playsheets"] });
            enqueueSnackbar(`${playsheet.playSheetName} PlaySheet Created`, { variant: "success" });
            setPlaySheet(PLAYSHEET_DEFAULT);
            navigate('/playsheets')
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const updateMutation = useMutation<PlaySheetSummaryResponse, Error, PlaySheetUpdateRequest>({
        mutationFn: updatePlaySheet,
        onSuccess: (_, playsheet) => {
            queryClient.invalidateQueries({ queryKey: ["playsheets"] });
            enqueueSnackbar(`${playsheet.playSheetName} PlaySheet Updated`, { variant: "success" });
            navigate('/playsheets')
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaySheet({
            ...playSheet, [event.target.name]: event.target.value
        });
    }

    const newSituation = () => {
        setPlaySheet(prev => {
            const currentSituations = [...prev.situations];
            currentSituations.push({ ...PLAYSHEETSITUATION_DEFAULT })

            return {
                ...prev,
                situations: currentSituations
            };
        })
    }

    const handleDeleteSituation = (index: number) => {
        setPlaySheet(prev => {
            const newSituations = [...prev.situations];
            newSituations.splice(index, 1);
            return {
                ...prev,
                situations: newSituations
            };
        })
    }

    const isPending = createMutation.isPending || updateMutation.isPending;

    const handleSituationChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

        const { name, value } = event.target;
        setPlaySheet(prev => {
            const updatedSituations = [...prev.situations];
            updatedSituations[index] = {
                ...updatedSituations[index],
                [name]: value
            }

            return {
                ...prev,
                situations: updatedSituations
            }
        })
    }
    const handleSituationChangeSelect = (index: number, value: string) => {


        setPlaySheet(prev => {
            const updatedSituations = [...prev.situations];
            updatedSituations[index] = {
                ...updatedSituations[index],
                situationColor: value
            }

            return {
                ...prev,
                situations: updatedSituations
            }
        })

        console.log(playSheet)
    }

    const handleRemove = (playId: number) => {
        if (selectedSitaution === null || playSheet.situations[selectedSitaution] === undefined) {
            console.log("No Situation")
            return
        }
        if (!playQuery.data) return;
        console.log(playSheet.situations[selectedSitaution])
        console.log(`${playId} Clicked`)
        const clickedPlay = playQuery.data.find((play) => play.playId === playId);

        if (clickedPlay) {
            const indexToDelete = playSheet.situations[selectedSitaution].plays.findIndex((play) => play.playId === playId)

            if (indexToDelete >= 0) {
                setPlaySheet(prev => ({
                    ...prev,
                    situations: prev.situations.map((situation, index) =>
                        index === selectedSitaution ? {
                            ...situation,
                            plays: situation.plays.filter((play) => play.playId !== playId),
                        }
                            : situation
                    )
                }))
            }
        }
    }

    const handlePlayClick = (playId: number) => {
        if (selectedSitaution === null || playSheet.situations[selectedSitaution] === undefined) {
            console.log("No Situation")
            return
        }
        if (!playQuery.data) return;
        console.log(playSheet.situations[selectedSitaution])
        console.log(`${playId} Clicked`)
        const clickedPlay = playQuery.data.find((play) => play.playId === playId);

        if (clickedPlay) {
            const indexToDelete = playSheet.situations[selectedSitaution].plays.findIndex((play) => play.playId === playId)

            if (indexToDelete >= 0) {
                setPlaySheet(prev => ({
                    ...prev,
                    situations: prev.situations.map((situation, index) =>
                        index === selectedSitaution ? {
                            ...situation,
                            plays: situation.plays.filter((play) => play.playId !== playId),
                        }
                            : situation
                    )
                }))
            } else {
                setPlaySheet(prev => ({
                    ...prev,
                    situations: prev.situations.map((situation, index) =>
                        index === selectedSitaution ? {
                            ...situation,
                            plays: [...situation.plays, clickedPlay],
                        }
                            : situation
                    )
                }))
            }

        }

    }

    const handleCreate = () => {
        const createRequest: PlaySheetCreateRequest = {
            playSheetName: playSheet.playSheetName,
            playbookId: Number(playbookId),
            situations: playSheet.situations.map((situation) => {
                const createSituation: PlaySheetSituationCreateRequest = {
                    situationName: situation.situationName,
                    situationColor: situation.situationColor,
                    playSheetId: playSheet.playSheetId,
                    playIds: situation.plays.map((play) => play.playId)
                }

                return createSituation;
            })
        }


        createMutation.mutate(createRequest);
    }

    const handleUpdate = () => {
        const updateRequest: PlaySheetUpdateRequest = {
            playSheetId: playSheet.playSheetId,
            playSheetName: playSheet.playSheetName,
            situations: playSheet.situations.map((situation) => {
                const updateSituation: PlaySheetSituationUpdateRequest = {
                    playSheetSituationId: situation.playSheetSituationId,
                    situationName: situation.situationName,
                    situationColor: situation.situationColor,
                    playIds: situation.plays.map((play) => play.playId)
                }

                return updateSituation
            })
        }
        console.log(JSON.stringify(updateRequest, null, 2));
        updateMutation.mutate(updateRequest);
    }

    if (playQuery.isPending || loading) {

        return (
            <>

                <div>
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                        open={true}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>

            </>
        )

    }

    if (playQuery.isSuccess) {
        if (!playQuery.data) {
            console.log("UPDATE")
        } else {

            if (id) {
                return (
                    <>
                        <Container className="container">


                            <Box marginBottom={4} display='flex' justifyContent='center' alignItems='center' flexDirection='column' sx={{ backgroundColor: '#181a1b59', borderRadius: 2 }}>
                                <Typography p={2} variant="h4">Update Playsheet</Typography>
                                <Stack p={2} flexDirection='row'>
                                    <FormControl sx={{ m: 1, width: '35ch', color: 'white' }} variant="outlined">
                                        <TextField
                                            slotProps={{
                                                inputLabel: {
                                                    sx: {
                                                        color: "white",
                                                        "&.Mui-focused": {
                                                            color: "white",
                                                        },
                                                    },
                                                },
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: "green",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "lightgreen",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "white",
                                                    },
                                                },
                                                "& .MuiInputBase-input": {
                                                    color: "white",
                                                },
                                            }}
                                            id="playsheetName-input"
                                            label="Playsheet Name"
                                            name="playSheetName"
                                            value={playSheet.playSheetName}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                    <LoadingButton
                                        variant="contained"
                                        onClick={handleUpdate}
                                        loading={isPending}

                                        sx={{
                                            backgroundColor: "green",
                                            color: "black",
                                            m: 1,
                                            "&:hover": {
                                                backgroundColor: "darkgreen",
                                            },

                                            // keep button visible in loading state
                                            "&.Mui-disabled": {
                                                backgroundColor: "darkgreen",
                                                color: "transparent",   // 👈 hides text completely
                                                opacity: .7,
                                            },

                                            // hide label completely
                                            "& .MuiLoadingButton-label": {
                                                visibility: isPending ? "hidden" : "visible",
                                            },
                                        }}
                                    >
                                        Update PlaySheet
                                    </LoadingButton>


                                </Stack>

                                <Stack sx={{ height: '100%' }} flexDirection='row' gap={10} p={4}>
                                    <Stack sx={{ height: '100%' }}>
                                        <Box width={'650px'} gap={2} display='flex' flexDirection='column'>
                                            {playSheet.situations.map((situation, index) => (
                                                <Box onClick={() => setSelectedSituation(index)} p={1} width={'100%'} maxWidth={'100%'} display='flex' flexDirection='column' sx={{
                                                    transition: 'background-color 0.2s ease',
                                                    borderRadius: 2,
                                                    '&:hover': {
                                                        filter: 'brightness(1.2)'
                                                    }, cursor: 'pointer',
                                                    backgroundColor:
                                                        index === selectedSitaution ? "#0080001a" : "#181a1b"
                                                }}>
                                                    <FormControl sx={{ m: 1, width: '35ch', color: 'white' }} variant="outlined">
                                                        <TextField
                                                            slotProps={{
                                                                inputLabel: {
                                                                    sx: {
                                                                        color: "white",
                                                                        "&.Mui-focused": {
                                                                            color: "white",
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& fieldset": {
                                                                        borderColor: "green",
                                                                    },
                                                                    "&:hover fieldset": {
                                                                        borderColor: "lightgreen",
                                                                    },
                                                                    "&.Mui-focused fieldset": {
                                                                        borderColor: "lightgreen",
                                                                    },
                                                                },
                                                                "& .MuiInputBase-input": {
                                                                    color: "white",
                                                                },
                                                            }}
                                                            id="situationName-input"
                                                            label="Situation Name"
                                                            name="situationName"
                                                            value={situation.situationName}
                                                            onChange={(e) => handleSituationChange(index, e)}
                                                        />
                                                    </FormControl>
                                                    <FormControl variant="standard" sx={{
                                                        maxWidth: 250,
                                                        m: 1,

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
                                                        '& .MuiInputLabel-root': {
                                                            color: 'white',
                                                        },
                                                    }}>
                                                        <InputLabel id="demo-simple-select-standard-label">Select Color</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-standard-label"
                                                            id="demo-simple-select-standard"
                                                            value={situation.situationColor}
                                                            onChange={(e) => handleSituationChangeSelect(index, e.target.value)}
                                                            label="Select Color"
                                                            sx={{
                                                                color: 'white', // selected value text
                                                                '& .MuiSvgIcon-root': {
                                                                    color: 'white', // dropdown arrow
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem value="green">
                                                                Green
                                                            </MenuItem>
                                                            <MenuItem value="red">
                                                                Red
                                                            </MenuItem>
                                                            <MenuItem value="blue">
                                                                Blue
                                                            </MenuItem>
                                                            <MenuItem value="yellow">
                                                                Yellow
                                                            </MenuItem>
                                                            <MenuItem value="orange">
                                                                Orange
                                                            </MenuItem>
                                                            <MenuItem value="pink">
                                                                Pink
                                                            </MenuItem>
                                                            <MenuItem value="gold">
                                                                Gold
                                                            </MenuItem>
                                                            <MenuItem value="indigo">
                                                                Purple
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <Box p={1}>
                                                        <Typography>
                                                            Plays:
                                                        </Typography>
                                                        <Box display='flex' flexWrap='wrap'>
                                                            {situation.plays.length === 0 && (
                                                                <Typography p={1} color="grey">No Plays Selected</Typography>
                                                            )}
                                                            {situation.plays?.map((play) => (
                                                                <Box>
                                                                    <Tooltip enterNextDelay={2000} enterDelay={2000} leaveDelay={0} title={<img width={200} src={play.playImageUrl} />}>
                                                                        <Fab
                                                                            disabled={selectedSitaution !== index}
                                                                            variant="extended"
                                                                            sx={{
                                                                                backgroundColor: 'green',
                                                                                color: 'black',
                                                                                m: 1,
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                textTransform: 'none',
                                                                                fontSize: '.7rem',
                                                                                height: '50%',
                                                                                '&:hover': {
                                                                                    backgroundColor: 'lightgreen', // hover color
                                                                                },

                                                                                '&:active': {
                                                                                    backgroundColor: 'darkgreen', // click/pressed color
                                                                                },
                                                                                '&.Mui-disabled': {
                                                                                    backgroundColor: 'grey',
                                                                                    color: 'white', // or whatever you want
                                                                                    opacity: 0.7,   // optional (MUI defaults to ~0.38)
                                                                                }
                                                                            }}
                                                                            onClick={() => handleRemove(play.playId)}
                                                                        >
                                                                            <ClearIcon sx={{ mr: .1 }} fontSize="small" />
                                                                            {play.playName}
                                                                        </Fab>
                                                                    </Tooltip>
                                                                </Box>
                                                            ))}
                                                        </Box>

                                                    </Box>

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
                                                    }} variant="contained" onClick={() => handleDeleteSituation(index)}>Remove Situation</Button>
                                                </Box>
                                            ))}
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
                                            }} variant="contained" onClick={newSituation}><AddIcon sx={{ mr: 1 }} /> Add Situation</Button>
                                        </Box>

                                    </Stack>
                                    <Stack>
                                        <Typography textAlign='center' variant="h4">Available Plays</Typography>
                                        <Divider sx={{ borderColor: 'gray', margin: 1 }} />
                                        <Stack
                                            sx={{
                                                position: 'sticky',
                                                top: 80,
                                                height: '800px',
                                                width: '100%',
                                                overflow: 'auto',
                                                backgroundColor: "#181a1b",
                                                borderRadius: 2,
                                            }}
                                        >
                                            {playQuery.data && (
                                                playQuery.data.map((play) => (

                                                    <Box display='flex' justifyContent='center'>
                                                        <Tooltip enterNextDelay={2000} enterDelay={2000} leaveDelay={0} title={<img width={200} src={play.playImageUrl} />}>
                                                            <Fab
                                                                variant="extended"
                                                                sx={{
                                                                    backgroundColor: 'green',
                                                                    color: 'black',
                                                                    m: 1,
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    textTransform: 'none',
                                                                    fontSize: '.7rem',
                                                                    height: '50%',
                                                                    '&:hover': {
                                                                        backgroundColor: 'lightgreen', // hover color
                                                                    },

                                                                    '&:active': {
                                                                        backgroundColor: 'darkgreen', // click/pressed color
                                                                    },
                                                                }}
                                                                onClick={() => handlePlayClick(play.playId)}
                                                            >
                                                                <Typography variant="body1" noWrap textOverflow='ellipsis' overflow='hidden'>{play.playName}</Typography>
                                                            </Fab>
                                                        </Tooltip>
                                                    </Box>


                                                ))
                                            )}
                                        </Stack>



                                    </Stack>

                                </Stack>

                            </Box>
                        </Container>


                    </>
                )
            } else {
                return (
                    <>
                        <Container className="container">


                            <Box marginBottom={4} display='flex' justifyContent='center' alignItems='center' flexDirection='column' sx={{ backgroundColor: '#181a1b59', borderRadius: 2 }}>
                                <Typography p={2} variant="h4">Create Playsheet</Typography>
                                <Stack p={2} flexDirection='row'>
                                    <FormControl sx={{ m: 1, width: '35ch', color: 'white' }} variant="outlined">
                                        <TextField
                                            slotProps={{
                                                inputLabel: {
                                                    sx: {
                                                        color: "white",
                                                        "&.Mui-focused": {
                                                            color: "white",
                                                        },
                                                    },
                                                },
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: "green",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "lightgreen",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "white",
                                                    },
                                                },
                                                "& .MuiInputBase-input": {
                                                    color: "white",
                                                },
                                            }}
                                            id="playsheetName-input"
                                            label="Playsheet Name"
                                            name="playSheetName"
                                            value={playSheet.playSheetName}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                    <LoadingButton
                                        variant="contained"
                                        onClick={handleCreate}
                                        loading={isPending}

                                        sx={{
                                            backgroundColor: "green",
                                            color: "black",
                                            m: 1,
                                            "&:hover": {
                                                backgroundColor: "darkgreen",
                                            },

                                            // keep button visible in loading state
                                            "&.Mui-disabled": {
                                                backgroundColor: "darkgreen",
                                                color: "transparent",   // 👈 hides text completely
                                                opacity: .7,
                                            },

                                            // hide label completely
                                            "& .MuiLoadingButton-label": {
                                                visibility: isPending ? "hidden" : "visible",
                                            },
                                        }}
                                    >
                                        Create PlaySheet
                                    </LoadingButton>

                                </Stack>

                                <Stack sx={{ height: '100%' }} flexDirection='row' gap={10} p={4}>
                                    <Stack sx={{ height: '100%' }}>
                                        <Box width={'650px'} gap={2} display='flex' flexDirection='column'>
                                            {playSheet.situations.map((situation, index) => (
                                                <Box onClick={() => setSelectedSituation(index)} p={1} width={'100%'} maxWidth={'100%'} display='flex' flexDirection='column' sx={{
                                                    transition: 'background-color 0.2s ease',
                                                    borderRadius: 2,
                                                    '&:hover': {
                                                        filter: 'brightness(1.2)'
                                                    }, cursor: 'pointer',
                                                    backgroundColor:
                                                        index === selectedSitaution ? "#0080001a" : "#181a1b"
                                                }}>
                                                    <FormControl sx={{ m: 1, width: '35ch', color: 'white' }} variant="outlined">
                                                        <TextField
                                                            slotProps={{
                                                                inputLabel: {
                                                                    sx: {
                                                                        color: "white",
                                                                        "&.Mui-focused": {
                                                                            color: "white",
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& fieldset": {
                                                                        borderColor: "green",
                                                                    },
                                                                    "&:hover fieldset": {
                                                                        borderColor: "lightgreen",
                                                                    },
                                                                    "&.Mui-focused fieldset": {
                                                                        borderColor: "lightgreen",
                                                                    },
                                                                },
                                                                "& .MuiInputBase-input": {
                                                                    color: "white",
                                                                },
                                                            }}
                                                            id="situationName-input"
                                                            label="Situation Name"
                                                            name="situationName"
                                                            value={situation.situationName}
                                                            onChange={(e) => handleSituationChange(index, e)}
                                                        />
                                                    </FormControl>
                                                    <FormControl variant="standard" sx={{
                                                        maxWidth: 250,
                                                        m: 1,

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
                                                        '& .MuiInputLabel-root': {
                                                            color: 'white',
                                                        },
                                                    }}>
                                                        <InputLabel id="demo-simple-select-standard-label">Select Color</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-standard-label"
                                                            id="demo-simple-select-standard"
                                                            value={situation.situationColor}
                                                            onChange={(e) => handleSituationChangeSelect(index, e.target.value)}
                                                            label="Select Color"
                                                            sx={{
                                                                color: 'white', // selected value text
                                                                '& .MuiSvgIcon-root': {
                                                                    color: 'white', // dropdown arrow
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem value="green">
                                                                Green
                                                            </MenuItem>

                                                            <MenuItem value="red">
                                                                Red
                                                            </MenuItem>
                                                            <MenuItem value="blue">
                                                                Blue
                                                            </MenuItem>
                                                            <MenuItem value="yellow">
                                                                Yellow
                                                            </MenuItem>
                                                            <MenuItem value="orange">
                                                                Orange
                                                            </MenuItem>
                                                            <MenuItem value="pink">
                                                                Pink
                                                            </MenuItem>
                                                            <MenuItem value="gold">
                                                                Gold
                                                            </MenuItem>
                                                            <MenuItem value="indigo">
                                                                Purple
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <Box p={1}>
                                                        <Typography>
                                                            Plays:
                                                        </Typography>
                                                        <Box display='flex' flexWrap='wrap'>
                                                            {situation.plays.length === 0 && (
                                                                <Typography p={1} color="grey">No Plays Selected</Typography>
                                                            )}
                                                            {situation.plays?.map((play) => (
                                                                <Box>
                                                                    <Tooltip enterNextDelay={2000} enterDelay={2000} leaveDelay={0} title={<img width={200} src={play.playImageUrl} />}>
                                                                        <Fab
                                                                            disabled={selectedSitaution !== index}
                                                                            variant="extended"
                                                                            sx={{
                                                                                backgroundColor: 'green',
                                                                                color: 'black',
                                                                                m: 1,
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                textTransform: 'none',
                                                                                fontSize: '.7rem',
                                                                                height: '50%',
                                                                                '&:hover': {
                                                                                    backgroundColor: 'lightgreen', // hover color
                                                                                },

                                                                                '&:active': {
                                                                                    backgroundColor: 'darkgreen', // click/pressed color
                                                                                },
                                                                                '&.Mui-disabled': {
                                                                                    backgroundColor: 'grey',
                                                                                    color: 'white', // or whatever you want
                                                                                    opacity: 0.7,   // optional (MUI defaults to ~0.38)
                                                                                }
                                                                            }}
                                                                            onClick={() => handleRemove(play.playId)}
                                                                        >
                                                                            <ClearIcon sx={{ mr: .1 }} fontSize="small" />
                                                                            {play.playName}
                                                                        </Fab>
                                                                    </Tooltip>
                                                                </Box>
                                                            ))}
                                                        </Box>

                                                    </Box>

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
                                                    }} variant="contained" onClick={() => handleDeleteSituation(index)}>Remove Situation</Button>
                                                </Box>
                                            ))}
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
                                            }} variant="contained" onClick={newSituation}><AddIcon sx={{ mr: 1 }} /> Add Situation</Button>
                                        </Box>

                                    </Stack>
                                    <Stack>
                                        <Typography textAlign='center' variant="h4">Available Plays</Typography>
                                        <Divider sx={{ borderColor: 'gray', margin: 1 }} />
                                        <Stack
                                            sx={{
                                                position: 'sticky',
                                                top: 80,
                                                height: '800px',
                                                width: '100%',
                                                overflow: 'auto',
                                                backgroundColor: "#181a1b",
                                                borderRadius: 2,
                                            }}
                                        >
                                            {playQuery.data && (
                                                playQuery.data.map((play) => (

                                                    <Box display='flex' justifyContent='center'>
                                                        <Tooltip enterNextDelay={2000} enterDelay={2000} leaveDelay={0} title={<img width={200} src={play.playImageUrl} />}>
                                                            <Fab
                                                                variant="extended"
                                                                sx={{
                                                                    backgroundColor: 'green',
                                                                    color: 'black',
                                                                    m: 1,
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    textTransform: 'none',
                                                                    fontSize: '.7rem',
                                                                    height: '50%',
                                                                    '&:hover': {
                                                                        backgroundColor: 'lightgreen', // hover color
                                                                    },

                                                                    '&:active': {
                                                                        backgroundColor: 'darkgreen', // click/pressed color
                                                                    },
                                                                }}
                                                                onClick={() => handlePlayClick(play.playId)}
                                                            >
                                                                <Typography variant="body1" noWrap textOverflow='ellipsis' overflow='hidden'>{play.playName}</Typography>
                                                            </Fab>
                                                        </Tooltip>
                                                    </Box>


                                                ))
                                            )}
                                        </Stack>
                                    </Stack>

                                </Stack>

                            </Box>
                        </Container>



                    </>
                )
            }

        }
    }

}

export default PlaySheetForm;