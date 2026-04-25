import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import type { PlayResponse } from "../../types/Response/PlayResponse";
import type { FormationResponse } from "../../types/Response/FormationResponse";
import FormationViewer from "../formation/FormationViewer";

type PlayViewerProps = {
    play: PlayResponse | null;
    handleFormationOpen: (formation: FormationResponse) => void;
    handleFormationClose: () => void;
    formationViewOpen: boolean;
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
    pt: 2,
    px: 4,
    pb: 3,
};

function PlayViewer({ play, handleFormationOpen, handleFormationClose, formationViewOpen }: PlayViewerProps) {





    if (play) {
        return (
            <>

                <Box sx={style}>
                    <Stack>
                        <Stack>
                            <img src={play.playImageUrl}></img>
                        </Stack>
                    </Stack>
                    <Typography p={1} id="modal-modal-title" variant="h6" component="h2">
                        {play.playName}
                    </Typography>
                    <Typography p={1}>
                        Notes:
                    </Typography>
                    <Typography p={1} sx={{ whiteSpace: 'pre-wrap' }}>
                        {play.playNotes}
                    </Typography>
                    <br></br>
                    <Typography p={1}>
                        Formation: <Button
                            onClick={() => handleFormationOpen(play.formationResponse)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'green',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                textTransform: 'none'
                            }}
                        >
                            {play.formationResponse.formationName}
                        </Button>
                    </Typography>
                    <Modal
                        open={formationViewOpen}
                        onClose={handleFormationClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >

                        <FormationViewer formation={play.formationResponse} ></FormationViewer>


                    </Modal>


                </Box>



            </>
        )
    }
}

export default PlayViewer;