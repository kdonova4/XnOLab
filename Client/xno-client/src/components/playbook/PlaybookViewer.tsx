import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPlaybookSummaryById } from "../../api/PlaybookAPI";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import PlayLibrary from "../play/PlayLibrary";
import { Modal } from "@mui/material";
import PlayCopyForm from "../play/PlayCopyForm";

function PlaybookViewer() {

    const { playbookId } = useParams();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
     const { data, error, isSuccess } = useQuery({
        queryKey: ["playbookSummary", Number(playbookId)],
        queryFn: () => getPlaybookSummaryById(Number(playbookId)),
        retry: false
     })

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error.message, { variant: "error" });
            navigate("/");
        }
    }, [error, navigate]);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

     if(isSuccess) {
        if(!data) {
            return <p>No Playbook</p>
        } else {
            return (
                <>
                    <div>
                        <h1>{data.playbookName}</h1>
                    </div>
                    <button onClick={handleOpen}>Copy Plays</button>
                    <div>
                        <PlayLibrary playbookId={Number(playbookId)}/>
                    </div>
                    <Modal open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description">
                            <PlayCopyForm playbookId={Number(playbookId)} handleClose={handleClose}/>
                    </Modal>
                </>
            )
        }
     }

    return (
        <>

        </>
    )
}

export default PlaybookViewer;