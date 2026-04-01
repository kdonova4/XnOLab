import { useEffect, useState } from "react";
import type { Playbook } from "../../types/Playbook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import type { PlaybookSummaryResponse } from "../../types/Response/PlaybookSummaryResponse";
import type { PlaybookCreateRequest } from "../../types/Create/PlaybookCreateRequest";
import { createPlaybook, getPlaybookSummaryById, updatePlaybook } from "../../api/PlaybookAPI";
import { enqueueSnackbar } from "notistack";
import type { PlaybookUpdateRequest } from "../../types/Update/PlaybookUpdateRequest";

const PLAYBOOK_DEFAULT: Playbook = {
    playbookId: 0,
    playbookName: ''
}

function PlaybookForm() {

    const [playbook, setPlaybook] = useState<Playbook>(PLAYBOOK_DEFAULT)
    const { id } = useParams();
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const createMutation = useMutation<PlaybookSummaryResponse, Error, PlaybookCreateRequest>({
        mutationFn: createPlaybook,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["playbooks"] })
            enqueueSnackbar(`${variables.playbookName} Playbook Created`, { variant: "success" });
            setPlaybook(PLAYBOOK_DEFAULT);
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const updateMutation = useMutation<PlaybookSummaryResponse, Error, PlaybookUpdateRequest>({
        mutationFn: updatePlaybook,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["playbooks"] })
            enqueueSnackbar(`${variables.playbookName} Playbook Updated`, { variant: "success" });
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })



    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        const fetchPlaybook = async () => {
            if (id) {
                try {
                    const response = await getPlaybookSummaryById(Number(id));
                    const existingPlaybook: Playbook = {
                        playbookId: response.playbookId,
                        playbookName: response.playbookName
                    }
                    setPlaybook(existingPlaybook);
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Something went wrong"
                    enqueueSnackbar(message, { variant: "error" })
                    navigate("/");
                }
            }
        }

        fetchPlaybook();
    }, [id]);

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaybook({
            ...playbook, [event.target.name]: event.target.value
        });
    }
    
    

    const handleCreate = async () => {



        const createRequest: PlaybookCreateRequest = {
            playbookName: playbook.playbookName
        }

        createMutation.mutate(createRequest);
    }

    const handleUpdate = async () => {


        const updateRequest: PlaybookUpdateRequest = {
            playbookId: playbook.playbookId,
            playbookName: playbook.playbookName
        }

        updateMutation.mutate(updateRequest);
    }

    if(id) {
        return (
            <>
                <div>
                    <input
                        name="playbookName"
                        type="text"
                        value={playbook.playbookName}
                        onChange={handleChange}
                        required
                    />
                    <button onClick={handleUpdate} disabled={isPending}>{isPending ? "Updating..." : "Update Playbook"}</button>

                </div>
            </>
        )
    } else {
        return (
            <>
                <div>
                    <input
                        name="playbookName"
                        type="text"
                        value={playbook.playbookName}
                        onChange={handleChange}
                        required
                    />
                    <button onClick={handleCreate} disabled={isPending}>{isPending ? "Creating..." : "Create Playbook"}</button>

                </div>
            </>
        )
    }
}

export default PlaybookForm;