import { useEffect, useMemo, useState } from "react";
import { deleteFormation, getAllFormationsByUser } from "../../api/FormationAPI";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function FormationLibrary() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const { data, error, isSuccess } = useQuery({
        queryKey: ["formations"],
        queryFn: () => getAllFormationsByUser(),
        retry: false
    })

    const { mutate } = useMutation<void, Error, number>({
        mutationFn: deleteFormation,
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: ["formations"] })
            enqueueSnackbar(`Formation With ID ${deletedId} Successfully Deleted`, { variant: "success" })
        }
    })

    const filteredFormations = useMemo(() => {
            if (!data) return [];
    
            return data.filter(formation => {
                if (!formation.formationName.toLowerCase().includes(searchQuery.toLowerCase())) {
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

    const handleDelete = async (formationId: number) => {
        try {
            mutate(formationId);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    }

    if (isSuccess) {
        if (!data || data.length === 0) {
            return <p>No Formations For this User</p>
        } else {
            return (
                <>
                <div>
                    <input
                        name="searchQuery"
                        type="text"
                        placeholder="Formation Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                    />
                </div>
                    <div>
                        {filteredFormations.map((formation) => (
                            <div key={formation.formationId}>
                                <li>{formation.formationName}</li>
                                <img src={formation.formationImageUrl}></img>
                                <button onClick={() => navigate(`/formation/edit/${formation.formationId}`)}>Edit</button>
                                <button onClick={() => handleDelete(formation.formationId)}>Delete</button>
                            </div>

                        ))}
                    </div>
                </>
            )
        }
    }




}

export default FormationLibrary;