import { useState } from "react";
import type { GenerationDetails } from "../../types/Misc/GenerationDetails";
import { Box, Checkbox, Stack, Typography } from "@mui/material";
import { generatePlaySheet } from "../../api/PlaySheetAPI";
import { useMutation } from "@tanstack/react-query";
import type { GenerateRequest } from "../../types/Misc/GenerateRequest";
import { enqueueSnackbar } from "notistack";
import type { PlaySheetSummaryResponse } from "../../types/Response/PlaySheetSummaryResponse";

const DEFAULT_GENERATION_DETAILS: GenerationDetails = {
    maxRows: 20,
    wrapPlays: false
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

type GenerationDetailsFormProps = {
    playSheet: PlaySheetSummaryResponse | null | undefined
}

function GenerationDetailsForm({ playSheet }: GenerationDetailsFormProps) {

    const [genDetails, setGenDetails] = useState<GenerationDetails>(DEFAULT_GENERATION_DETAILS)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, value, checked } = event.target;
    
        setGenDetails(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const { mutate } = useMutation<
    { blob: Blob; filename: string }, // return type
    Error,
    GenerateRequest
>({
    mutationFn: generatePlaySheet,
    onSuccess: ({ blob }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const newFilename = playSheet ? playSheet.playSheetName : "PlaySheet";
        a.download = newFilename; // use the filename from backend
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        enqueueSnackbar(`Downloaded ${newFilename}.xlsx`, { variant: 'success' });
    },
    onError: (error) => {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        enqueueSnackbar(message, { variant: 'error' });
    },
});
    
    const handleGenerate = () => {
        if(!playSheet) return;
        const request: GenerateRequest = {
            playSheetId: playSheet.playSheetId,
            generationDetails: genDetails
        }

        mutate(request);
    }

    return (
        <>

        
            <Box sx={style}>
                <Typography color="black" id="modal-modal-title" variant="h6" component="h2">
                    Enter Generation Details
                </Typography>
                <Stack>
                    <Stack color={"black"} flexDirection={"row"} alignItems={"center"} gap={1}>
                        <p>Max Rows: </p>
                        <input
                        name="maxRows"
                        type="number"
                        placeholder="Max Rows"
                        min={20}
                        value={genDetails.maxRows}
                        onChange={handleChange}
                        required
                    />
                    </Stack>
                    

                    <Stack color={"black"} flexDirection={"row"} alignItems={"center"}>
                        <p>Wrap Plays: </p>
                        <Checkbox
                            name="wrapPlays"
                            value={genDetails.wrapPlays}
                            onChange={handleChange}
                        ></Checkbox>
                    </Stack>
                    <button onClick={handleGenerate}>Generate</button>
        
                </Stack>

            </Box>
        </>
    )
}

export default GenerationDetailsForm;