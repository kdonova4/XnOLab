import React, { useEffect, useState } from "react";
import type { PlaySheet } from "../../types/PlaySheet";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlaysByPlaybook } from "../../api/PlayAPI";
import type { PlaySheetSummaryResponse } from "../../types/Response/PlaySheetSummaryResponse";
import type { PlaySheetCreateRequest } from "../../types/Create/PlaySheetCreateRequest";
import { createPlaySheet } from "../../api/PlaySheetAPI";
import { enqueueSnackbar } from "notistack";
import type { PlaySheetSituation } from "../../types/PlaySheetSituation";
import { Stack } from "@mui/material";
import { blue } from "@mui/material/colors";

const PLAYSHEETSITUATION_DEFAULT: PlaySheetSituation = {
    playSheetSituationId: 0,
    situationName: "",
    situationColor: "",
    playSheetId: 0,
    plays: []
}
const PLAYSHEET_DEFAULT: PlaySheet = {
    playSheetId: 0,
    playSheetName: "",
    createdAt: "",
    updatedAt: "",
    playbookId: 0,
    situations: [{ ...PLAYSHEETSITUATION_DEFAULT }],
    userId: 0

}


function PlaySheetForm() {

    const [playSheet, setPlaySheet] = useState<PlaySheet>(PLAYSHEET_DEFAULT)
    const [selectedSitaution, setSelectedSituation] = useState<number | null>(null)
    const navigate = useNavigate();
    const { id, playbookId } = useParams();
    const playQuery = useQuery({
        queryKey: ["plays", playbookId],
        queryFn: () => getPlaysByPlaybook(Number(playbookId)!),
        retry: false,
        enabled: !!playbookId,

    })

    const queryClient = useQueryClient();

    useEffect(() => {
        if (playbookId) {
            setPlaySheet(prev => ({
                ...prev,
                playbookId: Number(playbookId)
            }));
        }
    }, [playbookId]);

    useEffect(() => {
        if (playQuery.error) {
            enqueueSnackbar(playQuery.error.message, { variant: "error" });
            navigate("/");
        }
    }, [playQuery.error, navigate]);

    const createMutation = useMutation<PlaySheetSummaryResponse, Error, PlaySheetCreateRequest>({
        mutationFn: createPlaySheet,
        onSuccess: (_, playsheet) => {
            queryClient.invalidateQueries({ queryKey: ["playsheets"] });
            enqueueSnackbar(`${playsheet.playSheetName} PlaySheet Created`, { variant: "success" });
            setPlaySheet(PLAYSHEET_DEFAULT);
            // navigate("/playsheet/create")
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaySheet({
            ...playSheet, [event.target.name]: event.target.value
        });
    }

    const newSituation = () => {
        setPlaySheet(prev => {
            const currentSituations = [...prev.situations];
            currentSituations.push({ ...PLAYSHEETSITUATION_DEFAULT })

            return {
                ...prev,
                situations: currentSituations
            };
        })
    }

    const handlePlayClick = (playId: number) => {
        if (selectedSitaution === null) {
            console.log("No Situation")
            return
        }
        if (!playQuery.data) return;

        console.log(`${playId} Clicked`)
        const clickedPlay = playQuery.data.find((play) => play.playId === playId);

        if (clickedPlay) {
            const indexToDelete = playSheet.situations[selectedSitaution].plays.findIndex((play) => play.playId === playId)
            
            if(indexToDelete >= 0) {
                setPlaySheet(prev => ({
                ...prev,
                situations: prev.situations.map((situation, index) =>
                    index === selectedSitaution ? {
                        ...situation,
                        plays: situation.plays.filter((play) => play.playId !== playId),
                    }
                        : situation
                )
            }))
            } else {
                setPlaySheet(prev => ({
                ...prev,
                situations: prev.situations.map((situation, index) =>
                    index === selectedSitaution ? {
                        ...situation,
                        plays: [...situation.plays, clickedPlay],
                    }
                        : situation
                )
            }))
            }
            
        }

    }

    if (playQuery.isSuccess) {
        if (!playQuery.data) {

        } else {
            return (
                <>
                    <div>
                        <p>{selectedSitaution}</p>
                        <input
                            name="playSheetName"
                            type="text"
                            placeholder="PlaySheet Name"
                            value={playSheet.playSheetName}
                            onChange={handleChange}
                            required
                        />
                        <p>--------------------------------------</p>
                        <Stack flexDirection="row" gap={10} justifyContent="center">
                            <div>
                                {playSheet.situations.map((situation, index) => (
                                    <div onClick={() => setSelectedSituation(index)} style={{ outline: index === selectedSitaution ? "1px solid blue" : "1px solid white", margin: "50px" }} key={index}>
                                        <input
                                            name="playSheetName"
                                            type="text"
                                            placeholder="PlaySheet Name"
                                            value={situation.situationName}
                                            onChange={handleChange}
                                        />
                                        <input
                                            name="playSheetName"
                                            type="text"
                                            placeholder="PlaySheet Name"
                                            value={situation.situationName}
                                            onChange={handleChange}
                                        />
                                        <p>Plays:</p>
                                        {situation.plays?.map((play) => (
                                            <p>{play.playName}</p>
                                        ))}
                                    </div>

                                ))}
                                <button onClick={newSituation}>Hello</button>
                            </div>
                            <div>
                                {playQuery.data && (
                                    playQuery.data.map((play) => (
                                        <div style={{ outline: '1px solid blue'}} onClick={() => handlePlayClick(play.playId)}>
                                            <p key={play.playId} >{play.playName} {play.playId}</p>
                                        </div>


                                    ))
                                )}
                            </div>
                        </Stack>


                    </div>
                </>
            )
        }
    }

}

export default PlaySheetForm;