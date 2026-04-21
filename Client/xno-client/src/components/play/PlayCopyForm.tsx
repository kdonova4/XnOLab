import { Box, Fab, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getPlaybooksByUser } from "../../api/PlaybookAPI";
import { copyPlays, getPlaysByPlaybook } from "../../api/PlayAPI";
import { enqueueSnackbar } from "notistack";
import type { PlayResponse } from "../../types/Response/PlayResponse";
import type { CopyRequest } from "../../types/Misc/CopyRequest";
import ClearIcon from '@mui/icons-material/Clear';
import { LoadingButton } from "@mui/lab";

type PlayCopyFormProps = {
    playbookId: number;
    handleClose: () => void;
}

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

function PlayCopyForm({ playbookId, handleClose }: PlayCopyFormProps) {


    const [playIds, setPlayIds] = useState<number[]>([]);
    const [fullPlays, setFullPlays] = useState<PlayResponse[]>([])
    const [selectedPlaybookId, setSelectedPlaybookId] = useState<number | undefined>(undefined)
    const queryClient = useQueryClient();
    const playbookQuery = useQuery({
        queryKey: ["playbooks"],
        queryFn: () => getPlaybooksByUser(),
    })

    const playQuery = useQuery({
        queryKey: ["plays", selectedPlaybookId],
        queryFn: () => getPlaysByPlaybook(selectedPlaybookId as number),
        enabled: selectedPlaybookId !== undefined
    })

    const { mutate, isPending } = useMutation<PlayResponse[], Error, CopyRequest>({
        mutationFn: copyPlays,
        onSuccess: (plays) => {
            queryClient.invalidateQueries({ queryKey: ["plays", Number(playbookId)] })
            enqueueSnackbar(`${plays.length} Plays Have Been Copied into This Playbook`, { variant: "success" })
            handleClose()
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    

    const filteredPlaybooks = useMemo(() => {
        if (!playbookQuery.data) return [];

        return playbookQuery.data.filter(playbook => {
            if (playbook.playbookId === Number(playbookId)) {
                return false;
            }
            console.log("HERE")
            return true;
        })
    }, [playbookQuery.data])

    useEffect(() => {
        if (playbookQuery.isLoading) return;

        if (!playbookQuery.data || playbookQuery.data.length === 0 || filteredPlaybooks.length === 0) {
            enqueueSnackbar("No Other Playbooks Found")
            handleClose();
        } else if (filteredPlaybooks && filteredPlaybooks.length > 0) {
            setSelectedPlaybookId(filteredPlaybooks[0].playbookId)
        }
    }, [playbookQuery.isLoading, filteredPlaybooks])

    useEffect(() => {
        if (selectedPlaybookId !== undefined) {
            playQuery.refetch()
        }
        if (playQuery.data) {
            console.log(playQuery.data)
        }

    }, [selectedPlaybookId, playQuery.data])

    const handlePlayClick = (play: PlayResponse) => {
        
        if (fullPlays.includes(play)) {
            setFullPlays(fullPlays.filter(plays => plays !== play))
            setPlayIds(playIds.filter(plays => plays !== play.playId));
        } else {
            setPlayIds([...playIds, play.playId]);
            setFullPlays([...fullPlays, play])
        }
    }

    const handleCopy = () => {
        const copyRequest: CopyRequest = {
            playbookId: Number(playbookId),
            playIds: playIds
        }

        mutate(copyRequest);
    }

    if (playbookQuery.data && playQuery.data) {
        return (
            <>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Select Playbook to Copy From
                    </Typography>
                    
                    <Box sx={{ maxHeight: '400px', overflow: 'auto'}} display='flex' flexWrap='wrap'>
                            
                            {fullPlays.map((play) => (
                                <div>
                                    
                                        <Fab
                                            variant="extended"
                                            sx={{
                                                backgroundColor: 'green',
                                                color: 'black',
                                                m: 1,
                                                fontSize: '.7rem',
                                                height: '50%',
                                                '&:hover': {
                                                    backgroundColor: 'lightgreen', // hover color
                                                },

                                                '&:active': {
                                                    backgroundColor: 'darkgreen', // click/pressed color
                                                },
                                            }}
                                            onClick={() => handlePlayClick(play)}
                                        >
                                            <ClearIcon sx={{ mr: .1 }} fontSize="small"/>
                                            {play.playName}
                                        </Fab>
                                    


                                </div>

                            ))}
                        </Box>

                    <Stack>
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
                                value={selectedPlaybookId}
                                onChange={(e) => setSelectedPlaybookId(e.target.value)}
                                label="Select Playbook"
                                sx={{
                                    color: 'white', // selected value text
                                    '& .MuiSvgIcon-root': {
                                        color: 'white', // dropdown arrow
                                    },
                                }}
                            >

                                {filteredPlaybooks.map((playbook) => (
                                    <MenuItem key={playbook.playbookId} value={playbook.playbookId}>{playbook.playbookName}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Plays
                        </Typography>
                        <Box sx={{ maxHeight: '400px', overflow: 'auto'}} display='flex' flexWrap='wrap'>
                            {playQuery.data.length === 0 && (
                                <Typography p={1}>No Plays In This Playbook</Typography>
                            )}
                            {playQuery.data.map((play) => (
                                <div>
                                    {!playIds.includes(play.playId) && (
                                        <Fab
                                            variant="extended"
                                            sx={{
                                                backgroundColor: 'green',
                                                color: 'black',
                                                m: 1,
                                                fontSize: '.7rem',
                                                height: '50%',
                                                '&:hover': {
                                                    backgroundColor: 'lightgreen', // hover color
                                                },

                                                '&:active': {
                                                    backgroundColor: 'darkgreen', // click/pressed color
                                                },
                                            }}
                                            onClick={() => handlePlayClick(play)}
                                        >
                                            {play.playName}
                                        </Fab>
                                    )}


                                </div>

                            ))}
                        </Box>
                    </Stack>











                    
                    <Box display='flex' justifyContent='center'>


                                <LoadingButton
                                    variant="contained"
                                    type="submit"
                                    onClick={handleCopy}
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
                                    Copy Plays To This Playbook
                                </LoadingButton>

                            </Box>
                </Box>
            </>
        )
    }

}

export default PlayCopyForm;