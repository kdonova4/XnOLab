import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deletePlaybook, getPlaybooksByUser } from "../../api/PlaybookAPI";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";

function PlaybookLibrary() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState<string>("")
    const { data, error, isSuccess } = useQuery({
        queryKey: ["playbooks"],
        queryFn: () => getPlaybooksByUser(),
        retry: false
    })

    const { mutate } = useMutation<void, Error, number>({
        mutationFn: deletePlaybook,
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: ["playbooks"] })
            enqueueSnackbar(`Playbook With ID ${deletedId} Successfully Deleted`, { variant: "success" })
        }
    })

    const filteredPlaybooks = useMemo(() => {
        if (!data) return [];

        return data.filter(playbook => {
            if (!playbook.playbookName.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            return true;
        })
    }, [data, searchQuery])

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error.message, { variant: "error" });
            navigate("/");
        }
    }, [error, navigate]);

    const handleDelete = async (playbookId: number) => {
        try {
            mutate(playbookId)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "success" });
        }
    }

    if (isSuccess) {
        if (!data || data.length === 0) {
            return <p>No Playbooks</p>
        } else {
            return (
                <>
                <div>
                    <input
                        name="searchQuery"
                        type="text"
                        placeholder="Playbook Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                    />
                </div>
                    <div>
                        {filteredPlaybooks.map((playbook) => (
                            <div key={playbook.playbookId}>
                                <p>{playbook.playbookName}</p>
                                
                                <button onClick={() => navigate(`/playbook/edit/${playbook.playbookId}`)}>Edit</button>
                                <button onClick={() => handleDelete(playbook.playbookId)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </>
            )
        }
    }
}

export default PlaybookLibrary;