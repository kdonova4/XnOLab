import React, { useEffect, useState } from "react";
import type { PlaySheet } from "../../types/PlaySheet";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlaysByPlaybook } from "../../api/PlayAPI";
import type { PlaySheetSummaryResponse } from "../../types/Response/PlaySheetSummaryResponse";
import type { PlaySheetCreateRequest } from "../../types/Create/PlaySheetCreateRequest";
import { createPlaySheet, getPlaySheetDetailsById, updatePlaySheet } from "../../api/PlaySheetAPI";
import { enqueueSnackbar } from "notistack";
import type { PlaySheetSituation } from "../../types/PlaySheetSituation";
import { Container, Stack } from "@mui/material";
import type { PlaySheetSituationCreateRequest } from "../../types/Create/PlaySheetSituationCreateRequest";
import type { PlaySheetUpdateRequest } from "../../types/Update/PlaySheetUpdateRequest";
import type { PlaySheetSituationUpdateRequest } from "../../types/Update/PlaySheetSituationUpdateRequest";
import type { PlayResponse } from "../../types/Response/PlayResponse";

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

    const finalPlaybookId =
        playbookId !== undefined
            ? Number(playbookId)
            : playSheet.playbookId;

    const playQuery = useQuery({
        queryKey: ["plays", finalPlaybookId],
        queryFn: () => getPlaysByPlaybook(finalPlaybookId),
        retry: false,
        enabled: finalPlaybookId !== undefined && finalPlaybookId !== 0,
    });

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

    useEffect(() => {


        const loadPlaySheet = async () => {
            try {
                const data = await getPlaySheetDetailsById(Number(id));
                console.log(data)
                const existingPlaySheet: PlaySheet = {
                    playSheetId: data.playSheetId,
                    playSheetName: data.playSheetName,
                    playbookId: data.playbook.playbookId,
                    userId: 0,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    situations: data.situations.map((situation => {
                        const updateSituation: PlaySheetSituation = {
                            playSheetSituationId: situation.playSheetSituationId,
                            situationName: situation.situationName,
                            situationColor: situation.situationColor,
                            playSheetId: situation.playSheetId,
                            plays: situation.plays.map((play) => {
                                const playResponse: PlayResponse = {
                                    playId: play.playResponse.playId,
                                    playName: play.playResponse.playName,
                                    playNotes: play.playResponse.playNotes,
                                    playImageUrl: play.playResponse.playImageUrl,
                                    playbookResponse: play.playResponse.playbookResponse,
                                    formationResponse: play.playResponse.formationResponse
                                }

                                return playResponse;
                            })

                        }

                        return updateSituation
                    }))

                }

                setPlaySheet(existingPlaySheet);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Something went wrong";
                enqueueSnackbar(message, { variant: "success" });
                navigate("/playsheets")
            }
        };


        if (id) {
            loadPlaySheet();
        }
    }, [id]);

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

    const updateMutation = useMutation<PlaySheetSummaryResponse, Error, PlaySheetUpdateRequest>({
        mutationFn: updatePlaySheet,
        onSuccess: (_, playsheet) => {
            queryClient.invalidateQueries({ queryKey: ["playsheets"] });
            enqueueSnackbar(`${playsheet.playSheetName} PlaySheet Updated`, { variant: "success" });

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

    const handleDeleteSituation = (index: number) => {
        setPlaySheet(prev => {
            const newSituations = [...prev.situations];
            newSituations.splice(index, 1);
            return {
                ...prev,
                situations: newSituations
            };
        })
    }

    const handleSituationChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = event.target;
        setPlaySheet(prev => {
            const updatedSituations = [...prev.situations];
            updatedSituations[index] = {
                ...updatedSituations[index],
                [name]: value
            }

            return {
                ...prev,
                situations: updatedSituations
            }
        })
    }

    const handlePlayClick = (playId: number) => {
        if (selectedSitaution === null || playSheet.situations[selectedSitaution] === undefined) {
            console.log("No Situation")
            return
        }
        if (!playQuery.data) return;
        console.log(playSheet.situations[selectedSitaution])
        console.log(`${playId} Clicked`)
        const clickedPlay = playQuery.data.find((play) => play.playId === playId);

        if (clickedPlay) {
            const indexToDelete = playSheet.situations[selectedSitaution].plays.findIndex((play) => play.playId === playId)

            if (indexToDelete >= 0) {
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

    const handleCreate = () => {
        const createRequest: PlaySheetCreateRequest = {
            playSheetName: playSheet.playSheetName,
            playbookId: Number(playbookId),
            situations: playSheet.situations.map((situation) => {
                const createSituation: PlaySheetSituationCreateRequest = {
                    situationName: situation.situationName,
                    situationColor: situation.situationColor,
                    playSheetId: playSheet.playSheetId,
                    playIds: situation.plays.map((play) => play.playId)
                }

                return createSituation;
            })
        }


        createMutation.mutate(createRequest);
    }

    const handleUpdate = () => {
        const updateRequest: PlaySheetUpdateRequest = {
            playSheetId: playSheet.playSheetId,
            playSheetName: playSheet.playSheetName,
            situations: playSheet.situations.map((situation) => {
                const updateSituation: PlaySheetSituationUpdateRequest = {
                    playSheetSituationId: situation.playSheetSituationId,
                    situationName: situation.situationName,
                    situationColor: situation.situationColor,
                    playIds: situation.plays.map((play) => play.playId)
                }

                return updateSituation
            })
        }
        console.log(JSON.stringify(updateRequest, null, 2));
        updateMutation.mutate(updateRequest);
    }

    if (playQuery.isSuccess) {
        if (!playQuery.data) {
            console.log("UPDATE")
        } else {

            if (id) {
                return (
                    <>
                    <Container className="container">
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
                            <button onClick={handleUpdate}>Update PlaySheet</button>
                            <p>--------------------------------------</p>
                            <Stack flexDirection="row" gap={10} justifyContent="center">
                                <div>
                                    {playSheet.situations.map((situation, index) => (
                                        <div onClick={() => setSelectedSituation(index)} style={{ outline: index === selectedSitaution ? "1px solid blue" : "1px solid white", margin: "50px" }} key={index}>
                                            <input
                                                name="situationName"
                                                type="text"
                                                placeholder="Situation Name"
                                                value={situation.situationName}
                                                onChange={(e) => handleSituationChange(index, e)}
                                            />
                                            <input
                                                name="situationColor"
                                                type="text"
                                                placeholder="Situation Color"
                                                value={situation.situationColor}
                                                onChange={(e) => handleSituationChange(index, e)}
                                            />
                                            <p key={index}>Plays:</p>
                                            {situation.plays?.map((play) => (
                                                <p>{play.playName}</p>
                                            ))}
                                            <button onClick={() => handleDeleteSituation(index)}>Remove Situation</button>
                                        </div>

                                    ))}
                                    <button onClick={newSituation}>Hello</button>
                                </div>
                                <div>
                                    {playQuery.data && (
                                        playQuery.data.map((play) => (
                                            <div key={play.playId} style={{ outline: '1px solid blue' }} onClick={() => handlePlayClick(play.playId)}>
                                                <p key={play.playId} >{play.playName} {play.playId}</p>
                                            </div>


                                        ))
                                    )}
                                </div>
                            </Stack>



                        </div>
                    </Container>
                        
                    </>
                )
            } else {
                return (
                    <>
                    <Container className="container">
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
                            <button onClick={handleCreate}>Create PlaySheet</button>
                            <p>--------------------------------------</p>
                            <Stack flexDirection="row" gap={10} justifyContent="center">
                                <div>
                                    {playSheet.situations.map((situation, index) => (
                                        <div onClick={() => setSelectedSituation(index)} style={{ outline: index === selectedSitaution ? "1px solid blue" : "1px solid white", margin: "50px" }} key={index}>
                                            <input
                                                name="situationName"
                                                type="text"
                                                placeholder="Situation Name"
                                                value={situation.situationName}
                                                onChange={(e) => handleSituationChange(index, e)}
                                            />
                                            <input
                                                name="situationColor"
                                                type="text"
                                                placeholder="Situation Color"
                                                value={situation.situationColor}
                                                onChange={(e) => handleSituationChange(index, e)}
                                            />
                                            <p key={index}>Plays:</p>
                                            {situation.plays?.map((play) => (
                                                <p>{play.playName}</p>
                                            ))}
                                            <button onClick={() => handleDeleteSituation(index)}>Remove Situation</button>
                                        </div>

                                    ))}
                                    <button onClick={newSituation}>Hello</button>
                                </div>
                                <div>
                                    {playQuery.data && (
                                        playQuery.data.map((play) => (
                                            <div key={play.playId} style={{ outline: '1px solid blue' }} onClick={() => handlePlayClick(play.playId)}>
                                                <p key={play.playId} >{play.playName} {play.playId}</p>
                                            </div>


                                        ))
                                    )}
                                </div>
                            </Stack>



                        </div>
                    </Container>
                        
                    </>
                )
            }

        }
    }

}

export default PlaySheetForm;