import { Box, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getPlaybooksByUser } from "../../api/PlaybookAPI";
import { copyPlays, getPlaysByPlaybook } from "../../api/PlayAPI";
import { enqueueSnackbar } from "notistack";
import type{ PlayResponse } from "../../types/Response/PlayResponse";
import type { CopyRequest } from "../../types/Misc/CopyRequest";

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
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function PlayCopyForm({ playbookId, handleClose }: PlayCopyFormProps) {


    const [playIds, setPlayIds] = useState<number[]>([]);
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

    const { mutate } = useMutation<PlayResponse[], Error, CopyRequest>({
        mutationFn: copyPlays,
        onSuccess: (plays) => {
            queryClient.invalidateQueries({ queryKey: ["plays", Number(playbookId)] })
            enqueueSnackbar(`${plays.length} Plays Have Been Copied into This Playbook`, { variant: "success" })
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

    const handlePlayClick = (playId: number) => {
        if (playIds.includes(playId)) {
            setPlayIds(playIds.filter(play => play !== playId));
        } else {
            setPlayIds([...playIds, playId]);
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
                    <Typography color="black" id="modal-modal-title" variant="h6" component="h2">
                        Select Playbook to Copy From
                    </Typography>
                    <p>{selectedPlaybookId}</p>
                    <p>{playIds}</p>
                    <select
                        id="formationFilter"
                        name="formation"
                        value={selectedPlaybookId ?? ""}
                        onChange={(e) => setSelectedPlaybookId(Number(e.target.value))}
                    >
                        {filteredPlaybooks.map((playbook) => (
                            <option key={playbook.playbookId} value={playbook.playbookId}>{playbook.playbookName}</option>
                        ))}
                    </select>
                    <Stack>
                        <Typography color="black" id="modal-modal-title" variant="h6" component="h2">
                            Plays
                        </Typography>
                        <Box>
                            {playQuery.data.length === 0 && (
                                <p>No Plays</p>
                            )}
                            {playQuery.data.map((play) => (
                                <p onClick={() => handlePlayClick(play.playId)} key={play.playId} style={{ outline: '1px solid blue' }}>{play.playName}</p>
                            ))}
                        </Box>
                    </Stack>
                            <button onClick={handleCopy}>Copy Plays To This Playbook</button>
                </Box>
            </>
        )
    }

}

export default PlayCopyForm;