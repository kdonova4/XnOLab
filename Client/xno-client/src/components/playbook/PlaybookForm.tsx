import { useEffect, useState } from "react";
import type { Playbook } from "../../types/Playbook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import type { PlaybookSummaryResponse } from "../../types/Response/PlaybookSummaryResponse";
import type { PlaybookCreateRequest } from "../../types/Create/PlaybookCreateRequest";
import { createPlaybook, getPlaybookSummaryById, updatePlaybook } from "../../api/PlaybookAPI";
import { enqueueSnackbar } from "notistack";
import type { PlaybookUpdateRequest } from "../../types/Update/PlaybookUpdateRequest";
import { Box, Container, FormControl, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const PLAYBOOK_DEFAULT: Playbook = {
    playbookId: 0,
    playbookName: ''
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: '#181a1b',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type PlaybookFormProps = {
    handlePlaybookFormClose: () => void;
    playbookId: number | null;
}

function PlaybookForm({ handlePlaybookFormClose, playbookId }: PlaybookFormProps) {

    const [playbook, setPlaybook] = useState<Playbook>(PLAYBOOK_DEFAULT)

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const createMutation = useMutation<PlaybookSummaryResponse, Error, PlaybookCreateRequest>({
        mutationFn: createPlaybook,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["playbooks"] })
            enqueueSnackbar(`${variables.playbookName} Playbook Created`, { variant: "success" });
            setPlaybook(PLAYBOOK_DEFAULT);
            handlePlaybookFormClose();
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const updateMutation = useMutation<PlaybookSummaryResponse, Error, PlaybookUpdateRequest>({
        mutationFn: updatePlaybook,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["playbooks"] })
            enqueueSnackbar(`${variables.playbookName} Playbook Updated`, { variant: "success" });
            handlePlaybookFormClose();
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })



    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        const fetchPlaybook = async () => {
            if (playbookId) {
                try {
                    console.log("FETCHING")
                    const response = await getPlaybookSummaryById(playbookId);
                    const existingPlaybook: Playbook = {
                        playbookId: response.playbookId,
                        playbookName: response.playbookName
                    }
                    setPlaybook(existingPlaybook);
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Something went wrong"
                    enqueueSnackbar(message, { variant: "error" })
                    navigate("/");
                }
            }
        }

        fetchPlaybook();
    }, [playbookId]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaybook({
            ...playbook, [event.target.name]: event.target.value
        });
    }



    const handleCreate = async () => {



        const createRequest: PlaybookCreateRequest = {
            playbookName: playbook.playbookName
        }

        createMutation.mutate(createRequest);
    }

    const handleUpdate = async () => {


        const updateRequest: PlaybookUpdateRequest = {
            playbookId: playbook.playbookId,
            playbookName: playbook.playbookName
        }

        updateMutation.mutate(updateRequest);
    }

    if (playbookId) {
        return (
            <>
                <Container className="container">
                    <Box sx={style} display='flex' alignItems='center' flexDirection='column'>

                        <div>
                            <h1 style={{ textAlign: 'center' }}>Update Playbook</h1>
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
                                    id="playbook]ame-input"
                                    label="Playbook Name"
                                    name="playbookName"
                                    value={playbook.playbookName}
                                    onChange={handleChange}
                                />
                            </FormControl>
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
                                    mt: 2,
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
                    <Box sx={style} display='flex' alignItems='center' flexDirection='column'>

                        <div>
                            <h1 style={{ textAlign: 'center' }}>Create Playbook</h1>
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
                                    id="playbook]ame-input"
                                    label="Playbook Name"
                                    name="playbookName"
                                    value={playbook.playbookName}
                                    onChange={handleChange}
                                />
                            </FormControl>
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
                                    mt: 2,
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

export default PlaybookForm;