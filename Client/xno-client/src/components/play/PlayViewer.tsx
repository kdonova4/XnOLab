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
  bgcolor: '#181a1b',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function PlayViewer({ play }: PlayViewerProps) {





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
                    <Typography p={1} sx={{ whiteSpace: 'pre-wrap'}}>
                        {play.playNotes}
                    </Typography>
                    <br></br>
                    <Typography p={1}>
                        Formation: {play.formationResponse.formationName}
                    </Typography>

                    

                </Box>



            </>
        )
    }
}

export default PlayViewer;