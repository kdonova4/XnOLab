import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPlaybooksByUser, getPlaybookSummaryById } from "../../api/PlaybookAPI";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import PlayLibrary from "../play/PlayLibrary";
import { Container, Fab, Modal, Stack, Tooltip, Typography } from "@mui/material";
import PlayCopyForm from "../play/PlayCopyForm";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


function PlaybookViewer() {

    const { playbookId } = useParams();
    const [open, setOpen] = useState(false);
    const [hasNone, setHasNone] = useState(true);
    const navigate = useNavigate();
    const { data, error, isSuccess } = useQuery({
        queryKey: ["playbookSummary", Number(playbookId)],
        queryFn: () => getPlaybookSummaryById(Number(playbookId)),
        retry: false
    })
    

    const playbookQuery = useQuery({
        queryKey: ["playbooks"],
        queryFn: () => getPlaybooksByUser(),
    })

    useEffect(() => {
        if (playbookQuery.data) {
            if (playbookQuery.data.length > 1) {
                console.log("EHREHRE")
                setHasNone(false)
            }
        }
    }, [playbookQuery.data])

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

    

    if (isSuccess) {
        if (!data) {
            return <p>No Playbook</p>
        } else {
            return (
                <>
                    <Container className="container">

                        
                        <Stack
                                direction="row"
                                p={2}
                                width="100%"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ boxSizing: "border-box" }}
                            >
                            <Typography p={2} variant="h3">{data.playbookName}</Typography>

                            <Tooltip title={hasNone ? "You Have No Other Playbooks To Copy From" : "Choose Plays From Other Playbooks To Copy From"}>
                                <span>
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
                                    disabled={hasNone}
                                    onClick={handleOpen}>
                                    <ContentCopyIcon sx={{ mr: 1 }} />
                                    Copy Plays To This Playbook
                                </Fab>
                                </span>
                                
                            </Tooltip>
                            
                        </Stack>

                        
                        <div>
                            <PlayLibrary playbookId={Number(playbookId)} />
                        </div>
                        <Modal open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description">
                            <PlayCopyForm playbookId={Number(playbookId)} handleClose={handleClose} />
                        </Modal>
                        
                    </Container>

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