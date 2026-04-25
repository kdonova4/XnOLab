import { useEffect, useRef, useState } from "react";
import type { FormationResponse } from "../../types/Response/FormationResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFormation, getFormationById, updateFormation } from "../../api/FormationAPI";
import { enqueueSnackbar } from "notistack";
import type { CreateFormationInput } from "../../types/Create/CreateFormationInput";
import heroImg from "../../assets/hero.png";
import { useNavigate } from "react-router-dom";
import type { UpdateFormationInput } from "../../types/Update/UpdateFormationInput";
import type { Formation } from "../../types/Formation";
import Canvas from "../other/Canvas";
import { Backdrop, Box, Button, CircularProgress, Container, FormControl, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const FORMATION_DEFAULT: Formation = {
    formationId: 0,
    formationName: '',
    formationImageUrl: ''
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

type FormationFormProps = {
    handleFormationFormClose: () => void;
    formationId: number | null
}

function FormationForm({ handleFormationFormClose, formationId }: FormationFormProps) {

    const [formation, setFormation] = useState<Formation>(FORMATION_DEFAULT);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isUpdatingImage, setIsUpdatingImage] = useState(false);

    const canvasRef = useRef<{ getImage: () => Promise<Blob | null> }>(null);


    const queryClient = useQueryClient();
    const createMutation = useMutation<FormationResponse, Error, CreateFormationInput>({
        mutationFn: createFormation,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['formations'] })
            enqueueSnackbar(`${variables.formation.formationName} Formation Created`, { variant: "success" });
            setFormation(FORMATION_DEFAULT);
            handleFormationFormClose();
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const updateMutation = useMutation<FormationResponse, Error, UpdateFormationInput>({
        mutationFn: updateFormation,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['formations'] })
            enqueueSnackbar(`${variables.formation.formationName} Formation Updated`, { variant: "success" });
            handleFormationFormClose();
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const isPending = createMutation.isPending || updateMutation.isPending;


    useEffect(() => {
        const loadDefaultImage = async () => {
            const response = await fetch(heroImg);
            const blob = await response.blob();
            console.log("HERE")
            const file = new File([blob], "hero.png", {
                type: blob.type,
            });

            setImage(file);


            if (formationId) {
                try {
                    const response = await getFormationById(formationId);
                    const existingFormation: Formation = {
                        formationId: response.formationId,
                        formationName: response.formationName,
                        formationImageUrl: response.formationImageUrl
                    }
                    setFormation(existingFormation);


                    // const imageResponse = await fetch(response.formationImageUrl);
                    // const blob = await imageResponse.blob();
                    // const file = new File([blob], "existing.png", { type: blob.type });
                    setImageUrl(response.formationImageUrl);
                } catch (error) {
                    setLoading(false);
                    const message = error instanceof Error ? error.message : "Something went wrong"
                    enqueueSnackbar(message, { variant: "error" })
                    navigate("/");
                } finally {
                    setLoading(false);
                }
            }
        };

        loadDefaultImage();
        
    }, [formationId]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormation({
            ...formation, [event.target.name]: event.target.value
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
            enqueueSnackbar("Please Create The Formation", { variant: "warning" })
            return;
        }

        const file = new File([blob], formation.formationName + ".png", { type: blob.type })

        const createRequest: CreateFormationInput = {
            formation: formation,
            file: file
        }

        createMutation.mutate(createRequest);
    }

    const handleUpdate = async () => {


        if (isUpdatingImage) {
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

            const file = new File([blob], formation.formationName + ".png", { type: blob.type })
            const updateRequest: UpdateFormationInput = {
                formation: formation,
                file: file
            }

            updateMutation.mutate(updateRequest);
        } else {
            const updateRequest: UpdateFormationInput = {
                formation: formation,
            }
            updateMutation.mutate(updateRequest);
        }
    }

    const handleNewImage = () => {
        setIsUpdatingImage(true);
    }

    const handleCancel = () => {
        setIsUpdatingImage(false);
    }

    if (formationId) {
        return (
            <>
                {loading && (
<div>
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={true}
                    >
                    <CircularProgress color="inherit"/>
                    </Backdrop>
            </div>
            )}
                <Container className="container">
                    <Box sx={style}>
                        {isUpdatingImage && (
                            <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
                                <Canvas ref={canvasRef}/>
                                <Button sx={{
                                    m: 1,
                                    backgroundColor: 'green',
                                    color: 'black',
                                    width: '50%',
                                    '&:hover': {
                                        backgroundColor: 'lightgreen', // hover color
                                    },

                                    '&:active': {
                                        backgroundColor: 'darkgreen', // click/pressed color
                                    },
                                }} variant="contained" onClick={handleCancel}>Cancel</Button>
                            </Box>

                        )}
                        {!isUpdatingImage && (
                            <Box display='flex' justifyContent='center'>

                                <Box
                                    sx={{
                                        position: 'relative',
                                        '&:hover .overlay': {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    {imageUrl && (
                                        <img
                                        src={imageUrl}
                                        style={{ display: 'block', width: '100%' }}
                                        />
                                    )}
                                    

                                    <Button
                                        className="overlay"
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            color: 'white',
                                            borderRadius: 0,
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                            backgroundColor: 'rgba(0,0,0,0.4)',

                                            '&:hover': {
                                                backgroundColor: 'rgba(0,0,0,0.6)',
                                            },
                                        }}
                                        onClick={handleNewImage}
                                    >
                                        Create New Image
                                    </Button>
                                </Box>

                            </Box>


                        )}

                        <div>
                            <h1>Formation Details</h1>
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
                                                    borderColor: "lightgreen",
                                                },
                                            },
                                            "& .MuiInputBase-input": {
                                                color: "white",
                                            },
                                        }}
                                        id="formationName-input"
                                        label="Formation Name"
                                        name="formationName"
                                        value={formation.formationName}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Stack>
                        </div>
                        <Box display='flex' justifyContent='center'>


                            <LoadingButton
                                variant="contained"
                                type="submit"
                                onClick={handleUpdate}
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
                                Update
                            </LoadingButton>

                        </Box>
                    </Box>
                </Container>

            </>
        )
    } else {
        return (
            <>
                <Container className="container">
                    <Box sx={style}>
                        <Canvas ref={canvasRef} />
                        <div>
                            <h1>Formation Details</h1>
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
                                                    borderColor: "lightgreen",
                                                },
                                            },
                                            "& .MuiInputBase-input": {
                                                color: "white",
                                            },
                                        }}
                                        id="formationName-input"
                                        label="Formation Name"
                                        name="formationName"
                                        value={formation.formationName}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Stack>
                        </div>
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
                    </Box>

                </Container>

            
            </>
        )
    }
}

export default FormationForm;