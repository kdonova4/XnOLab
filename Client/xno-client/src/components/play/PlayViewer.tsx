import { Box, Stack, Typography } from "@mui/material";
import type { PlayResponse } from "../../types/Response/PlayResponse";

type PlayViewerProps = {
    play: PlayResponse | null;
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

function PlayViewer({ play }: PlayViewerProps) {





    if (play) {
        return (
            <>
                
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
                


            </>
        )
    }
}

export default PlayViewer;