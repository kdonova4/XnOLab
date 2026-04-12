import { Box, Stack, Typography } from "@mui/material";
import type { FormationResponse } from "../../types/Response/FormationResponse";

type FormationViewerProps = {
    formation: FormationResponse | undefined,
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

function FormationViewer({ formation }: FormationViewerProps) {



    if(formation) {
        return (
            <>
                <Box sx={style}>
                    <Typography color="black" id="modal-modal-title" variant="h6" component="h2">
                        {formation.formationName}
                    </Typography>
                    <Stack>
                        <Stack>
                            <img src={formation.formationImageUrl}></img>
                        </Stack>
                    </Stack>
                </Box>
            </>
        )
    }
    
}

export default FormationViewer;