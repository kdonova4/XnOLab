import { useEffect, useState } from "react";
import type { FormationCreateRequest } from "../../types/Create/FormationCreateRequest";
import type { FormationResponse } from "../../types/Response/FormationResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFormation } from "../../api/FormationAPI";
import { enqueueSnackbar } from "notistack";
import type { CreateFormationInput } from "../../types/Create/CreateFormationInput";
import heroImg from "../../assets/hero.png";
import { useParams } from "react-router-dom";

const FORMATION_DEFAULT: FormationCreateRequest = {
    formationName: ''
}

function FormationForm() {

    const [formation, setFormation] = useState<FormationCreateRequest>(FORMATION_DEFAULT);
    const [image, setImage] = useState<File | null>(null);
    const { id } = useParams();


    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation<FormationResponse, Error, CreateFormationInput>({
        mutationFn: createFormation,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['formations'] })
            enqueueSnackbar(`${variables.formation.formationName} Formation Created`, { variant: "success" });
            setFormation(FORMATION_DEFAULT);
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })


    useEffect(() => {
        const loadDefaultImage = async () => {
            const response = await fetch(heroImg);
            const blob = await response.blob();
            console.log("HERE")
            const file = new File([blob], "hero.png", {
                type: blob.type,
            });

            setImage(file);
        };

        loadDefaultImage();
    }, [id]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormation({
            ...formation, [event.target.name]: event.target.value
        });
    }

    const handleCreate = async () => {
        
        if (!image) {
            enqueueSnackbar("Please Create The Formation", { variant: "warning" })
            return;
        }
        const createRequest: CreateFormationInput = {
            formation: formation,
            file: image
        }

        mutate(createRequest);
    }

    return (
        <>
            <div>
                <input
                    name="formationName"
                    type="text"
                    value={formation.formationName}
                    onChange={handleChange}
                    required
                />
                <button onClick={handleCreate} disabled={isPending}>{isPending ? "Creating..." : "Create Formation"}</button>

            </div>
        </>
    )
}

export default FormationForm;