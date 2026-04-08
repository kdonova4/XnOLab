import { Box, Modal, Stack, Typography } from "@mui/material";
import type { PlayResponse } from "../../types/Response/PlayResponse";

type PlayViewerProps = {
    play: PlayResponse | null;
    open: boolean;
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

function PlayViewer({ open, handleClose, play }: PlayViewerProps) {





    if (play) {
        return (
            <>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography color="black" id="modal-modal-title" variant="h6" component="h2">
                            {play.playName}
                        </Typography>
                        <Typography color="black">
                            {play.playNotes}
                        </Typography>

                        <Stack>

                            <Stack>
                                <img src={play.playImageUrl}></img>
                            </Stack>


                        </Stack>

                    </Box>
                </Modal>


            </>
        )
    }
}

export default PlayViewer;