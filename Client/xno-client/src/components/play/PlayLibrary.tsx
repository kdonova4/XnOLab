import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deletePlay, getPlaysByPlaybook } from "../../api/PlayAPI";
import { useEffect, useMemo, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { getAllFormationsByUser } from "../../api/FormationAPI";
import { Modal } from "@mui/material";
import FormationViewer from "../formation/FormationViewer";
import type { FormationResponse } from "../../types/Response/FormationResponse";
import type { PlayResponse } from "../../types/Response/PlayResponse";
import PlayViewer from "./PlayViewer";

type PlayLibraryProps = {
    playbookId: number
}

function PlayLibrary({ playbookId }: PlayLibraryProps) {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [viewedFormation, setViewedFormation] = useState<FormationResponse>()
    const [selectedPlay, setSelectedPlay] = useState<PlayResponse | null>(null);
    const [selectedFormationId, setSelectedFormationId] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("")

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
            mutate(playId);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    }

    const handleOpen = (formation: FormationResponse) => {
        setOpen(true);
        setViewedFormation(formation)
    }

    const handleOpenPlay = (play: PlayResponse) => {
        setSelectedPlay(play)
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    if (isSuccess) {
        if (data.length > 0 && formationsQuery.data) {
            return (
                <>
                    <div className="mt-60">
                        <input
                            name="searchQuery"
                            type="text"
                            placeholder="Play Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            required
                        />
                        <select
                            id="formationFilter"
                            name="formation"
                            value={selectedFormationId ?? ""}
                            onChange={(e) => setSelectedFormationId(Number(e.target.value))}
                        >
                            <option value={0}>None</option>
                            {formationsQuery.data.map((formation) => (
                                <option key={formation.formationId} value={formation.formationId}>{formation.formationName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        {filteredPlays.map((play) => (
                            <div key={play.playId}>
                                <p onClick={() => handleOpenPlay(play)}>Name: {play.playName}</p>
                                {play.playNotes && (
                                    <p>Notes: {play.playNotes}</p>
                                )}

                                <img src={play.playImageUrl} />
                                <p onClick={() => handleOpen(play.formationResponse)}>{play.formationResponse.formationName}</p>
                                <button onClick={() => navigate(`/play/edit/${play.playId}`)}>Edit</button>
                                <button onClick={() => handleDelete(play.playId)}>Delete</button>
                            </div>
                        ))}
                    </div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        
                        <FormationViewer handleClose={handleClose} formation={viewedFormation}></FormationViewer>
                        
                        
                    </Modal>
                    <PlayViewer play={selectedPlay} open={open} handleClose={handleClose}/>
                </>
            )
        } else if (data.length === 0) {
            return <p>No Plays...</p>
        }
    }

}

export default PlayLibrary;