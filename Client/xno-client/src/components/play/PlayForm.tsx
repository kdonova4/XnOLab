import { useEffect, useRef, useState } from "react";
import type { Play } from "../../types/Play";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PlayResponse } from "../../types/Response/PlayResponse";
import type { CreatePlayInput } from "../../types/Create/CreatePlayInput";
import { createPlay, getPlayById, updatePlay } from "../../api/PlayAPI";
import { enqueueSnackbar } from "notistack";
import heroImg from "../../assets/hero.png";
import type { UpdatePlayInput } from "../../types/Update/UpdatePlayInput";
import { getAllFormationsByUser } from "../../api/FormationAPI";
import type { FormationResponse } from "../../types/Response/FormationResponse";
import Canvas from "../other/Canvas";
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const PLAY_DEFAULT: Play = {
    playId: 0,
    playName: '',
    playNotes: '',
    playImageUrl: '',
    formationId: 0,
    playbookId: 0
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: '#181a1b',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function PlayForm() {

    const [selectedFormationId, setSelectedFormationId] = useState<number>(0);
    const [formationImageUrl, setFormationImageUrl] = useState<string>("");
    const [play, setPlay] = useState<Play>(PLAY_DEFAULT);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [formations, setFormations] = useState<FormationResponse[]>([])
    const [updatingImage, setUpdatingImage] = useState(false);
    const { playbookId, playId } = useParams();
    const navigate = useNavigate();

    const canvasRef = useRef<{ getImage: () => Promise<Blob | null> }>(null);

    const queryClient = useQueryClient();
    const createMutation = useMutation<PlayResponse, Error, CreatePlayInput>({
        mutationFn: createPlay,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["plays"] })
            enqueueSnackbar(`${variables.play.playName} Play Created`, { variant: "success" });
            setPlay(PLAY_DEFAULT);
            navigate(`/playbook/${playbookId}`)
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const updateMutation = useMutation<PlayResponse, Error, UpdatePlayInput>({
        mutationFn: updatePlay,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["plays"] })
            enqueueSnackbar(`${variables.play.playName} Play Updated`, { variant: "success" });
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        console.log("LOADING")
        const loadDefaultImage = async () => {
            const response = await fetch(heroImg);
            const blob = await response.blob();
            console.log("HERE")
            const file = new File([blob], "hero.png", {
                type: blob.type,
            });

            setImage(file);

            setPlay({
                ...play, playbookId: Number(playbookId)
            })
            if (playId) {
                try {
                    const response = await getPlayById(Number(playId));
                    const existingPlay: Play = {
                        playId: response.playId,
                        playName: response.playName,
                        playNotes: response.playNotes,
                        playImageUrl: response.playImageUrl,
                        formationId: response.formationResponse.formationId,
                        playbookId: response.playbookResponse.playbookId
                    }
                    setPlay(existingPlay);
                    setFormationImageUrl(response.formationResponse.formationImageUrl);

                    // const imageResponse = await fetch(response.formationImageUrl);
                    // const blob = await imageResponse.blob();
                    // const file = new File([blob], "existing.png", { type: blob.type });
                    setImageUrl(response.playImageUrl);
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Something went wrong"
                    enqueueSnackbar(message, { variant: "error" })
                    navigate("/");
                }
            } else {
                try {
                    const response = await getAllFormationsByUser();
                    setFormations(response);
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Something went wrong"
                    enqueueSnackbar(message, { variant: "error" })

                }
            }
        };

        loadDefaultImage();
    }, [playId]);



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlay({
            ...play, [event.target.name]: event.target.value
        });
    }
    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPlay({
            ...play, [event.target.name]: event.target.value
        });
    }

    const handleCreate = async () => {
        if (!canvasRef.current) {
            console.log("NO CANVAS")
            return;
        };
        const blob = await canvasRef.current.getImage();
        if (!blob) {
            console.log("NO BLOB")
            return
        };
        if (!image) {
            enqueueSnackbar("Please Create The Play", { variant: "warning" })
            return;
        }

        const file = new File([blob], play.playName + ".png", { type: blob.type })


        const createRequest: CreatePlayInput = {
            play: play,
            file: file
        }

        createMutation.mutate(createRequest);
    }

    const handleUpdate = async () => {


        if (updatingImage) {
            if (!canvasRef.current) {
                console.log("NO CANVAS")
                return;
            };
            const blob = await canvasRef.current.getImage();
            if (!blob) {
                console.log("NO BLOB")
                return
            };
            if (!image) {
                enqueueSnackbar("Please Create The Play", { variant: "warning" })
                return;
            }

            const file = new File([blob], play.playName + ".png", { type: blob.type })

            const updateRequest: UpdatePlayInput = {
                play: play,
                file: file
            }

            updateMutation.mutate(updateRequest);

        } else {
            const updateRequest: UpdatePlayInput = {
                play: play,
            }
            updateMutation.mutate(updateRequest);
        }




    }

    const handleFormationChange = (formationId: number) => {
        setSelectedFormationId(formationId)
        setPlay({
            ...play, formationId: formationId
        });
        const currentForm = formations.find((form) => form.formationId === formationId);
        if(!currentForm) return;
        setFormationImageUrl(currentForm.formationImageUrl)
    }

    const handleNewImage = () => {
        setUpdatingImage(true);
    }

    const handleCancel = () => {
        setUpdatingImage(false);
    }

    if (playId) {
        return (
            <>
                <Container className="container">
                    {!updatingImage && (
                        <button onClick={handleNewImage}>Create New Image</button>
                    )}

                    {updatingImage && (
                        <div>
                            <Canvas ref={canvasRef} imageUrl={formationImageUrl} />
                            <button onClick={handleCancel}>Cancel</button>
                        </div>


                    )}
                    <div>
                        <input
                            name="playName"
                            type="text"
                            value={play.playName}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="playNotes"
                            value={play.playNotes}
                            onChange={handleTextAreaChange}
                            required
                        />
                        <img src={imageUrl} />
                        <button onClick={handleUpdate} disabled={isPending}>{isPending ? "Updating..." : "Update Play"}</button>

                    </div>
                </Container>

            </>
        )
    } else {
        return (
            <>
                <Container className="container">
                    <Box sx={style}>
                        <Canvas ref={canvasRef} imageUrl={formationImageUrl} />
                        <div>
                            <h1>Play Details</h1>
                            <Stack direction="column" gap={2} p={2}>
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
                                        id="playName-input"
                                        label="Play Name"
                                        name="playName"
                                        value={play.playName}
                                        onChange={handleChange}
                                    />
                                </FormControl>
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
                                        id="playNotes-input"
                                        label="Play Notes"
                                        name="playNotes"
                                        multiline
                                        maxRows={8}
                                        value={play.playNotes}
                                        onChange={handleChange}
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
                                    <InputLabel id="demo-simple-select-standard-label">Select Formation</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={selectedFormationId}
                                        onChange={(e) => handleFormationChange(e.target.value)}
                                        label="Filter By Formation"
                                        sx={{
                                                    color: 'white', // selected value text
                                                    '& .MuiSvgIcon-root': {
                                                        color: 'white', // dropdown arrow
                                                    },
                                                }}
                                    >
                                        <MenuItem value={0}>
                                            None
                                        </MenuItem>
                                        {formations.map((formation) => (
                                            <MenuItem key={formation.formationId} value={formation.formationId}>{formation.formationName}</MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </Stack>

                            <Box display='flex' justifyContent='center'>
                                
                                
                                <LoadingButton
                                    variant="contained"
                                    type="submit"
                                    onClick={handleCreate}
                                    loading={isPending}
                                    sx={{
                                        backgroundColor: "green",
                                        color: "black",

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
                                    Create
                                </LoadingButton>
                                
                            </Box>
                            

                        </div>
                    </Box>

                </Container>

            </>
        )
    }


}

export default PlayForm;