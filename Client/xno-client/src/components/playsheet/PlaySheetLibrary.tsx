import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePlaySheet, getPlaySheetsByUser } from "../../api/PlaySheetAPI";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Modal } from "@mui/material";
import GenerationDetailsForm from "./GenerationDetailsForm";
import type { PlaySheetSummaryResponse } from "../../types/Response/PlaySheetSummaryResponse";



function PlaySheetLibrary() {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [playSheet, setPlaySheet] = useState<PlaySheetSummaryResponse | null | undefined>();
    const [open, setOpen] = useState(false);
    const { data, error, isSuccess } = useQuery({
        queryKey: ["playsheets"],
        queryFn: () => getPlaySheetsByUser(),
        retry: false
    })

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
            mutate(playSheetId);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            enqueueSnackbar(message, { variant: "error" })
        }
    }

    const handleOpen = (playSheet: PlaySheetSummaryResponse) => {
        setOpen(true);
        setPlaySheet(playSheet)
    }

    const handleClose = () => {
        setOpen(false);
        setPlaySheet(null)
    }

    if (isSuccess) {
        if (!data || data.length === 0) {
            return <p>No Playsheets</p>
        } else {
            return (
                <>
                    <div>
                        <input
                            name="searchQuery"
                            type="text"
                            placeholder="PlaySheet Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        {filteredPlaySheets.map((playsheet) => (
                            <div key={playsheet.playSheetId}>
                                <p>{playsheet.playSheetName}</p>
                                <p>{playsheet.createdAt}</p>
                                {playsheet.updatedAt && (
                                    <p>{playsheet.updatedAt}</p>
                                )}
                                <p>{playsheet.playbook.playbookName}</p>
                                <button onClick={() => navigate(`/playsheet/edit/${playsheet.playSheetId}`)}>Edit</button>
                                <button onClick={() => handleDelete(playsheet.playSheetId)}>Delete</button>
                                <button onClick={() => handleOpen(playsheet)}>Generate Playsheet</button>
                            </div>
                        ))}<Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <GenerationDetailsForm playSheet={playSheet}/>
                    </Modal>
                    </div>
                    
                </>
            )
        }
    }


}

export default PlaySheetLibrary;