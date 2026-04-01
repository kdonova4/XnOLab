import { useEffect, useState } from "react";
import type { Play } from "../../types/Play";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PlayResponse } from "../../types/Response/PlayResponse";
import type { CreatePlayInput } from "../../types/Create/CreatePlayInput";
import { createPlay, getPlayById, updatePlay } from "../../api/PlayAPI";
import { enqueueSnackbar } from "notistack";
import heroImg from "../../assets/hero.png";
import type { UpdatePlayInput } from "../../types/Update/UpdatePlayInput";
import { getAllFormationsByUser } from "../../api/FormationAPI";
import type { FormationResponse } from "../../types/Response/FormationResponse";

const PLAY_DEFAULT: Play = {
    playId: 0,
    playName: '',
    playNotes: '',
    playImageUrl: '',
    formationId: 0,
    playbookId: 0
}

function PlayForm() {

    const [play, setPlay] = useState<Play>(PLAY_DEFAULT);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [formations, setFormations] = useState<FormationResponse[]>([])
    const { playbookId, playId } = useParams();
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const createMutation = useMutation<PlayResponse, Error, CreatePlayInput>({
        mutationFn: createPlay,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["plays"] })
            enqueueSnackbar(`${variables.play.playName} Play Created`, { variant: "success" });
            setPlay(PLAY_DEFAULT);
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const updateMutation = useMutation<PlayResponse, Error, UpdatePlayInput>({
        mutationFn: updatePlay,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["plays"] })
            enqueueSnackbar(`${variables.play.playName} Play Updated`, { variant: "success" });
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        console.log("LOADING")
        const loadDefaultImage = async () => {
            const response = await fetch(heroImg);
            const blob = await response.blob();
            console.log("HERE")
            const file = new File([blob], "hero.png", {
                type: blob.type,
            });

            setImage(file);

            setPlay({
                ...play, playbookId: Number(playbookId)
            })
            if (playId) {
                try {
                    const response = await getPlayById(Number(playId));
                    const existingPlay: Play = {
                        playId: response.playId,
                        playName: response.playName,
                        playNotes: response.playNotes,
                        playImageUrl: response.playImageUrl,
                        formationId: response.formationResponse.formationId,
                        playbookId: response.playbookResponse.playbookId
                    }
                    setPlay(existingPlay);


                    // const imageResponse = await fetch(response.formationImageUrl);
                    // const blob = await imageResponse.blob();
                    // const file = new File([blob], "existing.png", { type: blob.type });
                    setImageUrl(response.playImageUrl);
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Something went wrong"
                    enqueueSnackbar(message, { variant: "error" })
                    navigate("/");
                }
            } else {
                try {
                    const response = await getAllFormationsByUser();
                    setFormations(response);
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Something went wrong"
                    enqueueSnackbar(message, { variant: "error" })

                }
            }
        };

        loadDefaultImage();
    }, [playId]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlay({
            ...play, [event.target.name]: event.target.value
        });
    }
    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPlay({
            ...play, [event.target.name]: event.target.value
        });
    }

    const handleCreate = async () => {

        if (!image) {
            enqueueSnackbar("Please Create The Play", { variant: "warning" })
            return;
        }



        const createRequest: CreatePlayInput = {
            play: play,
            file: image
        }

        createMutation.mutate(createRequest);
    }

    const handleUpdate = async () => {


        const updateRequest: UpdatePlayInput = {
            play: play,
            ...(image && { file: image })
        }

        updateMutation.mutate(updateRequest);
    }

    const handleFormationClick = (formationId: number) => {
        setPlay({
            ...play, formationId: formationId
        });
    }

    if (playId) {
        return (
            <>
                <div>
                    <input
                        name="playName"
                        type="text"
                        value={play.playName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="playNotes"
                        type="textarea"
                        value={play.playNotes}
                        onChange={handleChange}
                        required
                    />
                    <img src={imageUrl} />
                    <button onClick={handleUpdate} disabled={isPending}>{isPending ? "Updating..." : "Update Play"}</button>

                </div>
            </>
        )
    } else {
        return (
            <>
                <div>
                    <input
                        name="playName"
                        type="text"
                        placeholder="Play Name"
                        value={play.playName}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="playNotes"
                        placeholder="Notes Here..."
                        value={play.playNotes}
                        onChange={handleTextAreaChange}
                        required
                    />
                    <p>{play.formationId}</p>
                    <p>{play.playbookId}</p>
                    <div>
                        {formations.map((formation) => (
                            <li key={formation.formationId} onClick={() => handleFormationClick(formation.formationId)}>
                                {formation.formationName}
                            </li>
                        ))}
                    </div>
                    <button onClick={handleCreate} disabled={isPending}>{isPending ? "Creating..." : "Create Play"}</button>

                </div>
            </>
        )
    }


}

export default PlayForm;