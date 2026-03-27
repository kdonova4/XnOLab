import { useEffect, useState } from "react";
import type { FormationResponse } from "../../types/Response/FormationResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFormation, getFormationById, updateFormation } from "../../api/FormationAPI";
import { enqueueSnackbar } from "notistack";
import type { CreateFormationInput } from "../../types/Create/CreateFormationInput";
import heroImg from "../../assets/hero.png";
import { useNavigate, useParams } from "react-router-dom";
import type { UpdateFormationInput } from "../../types/Update/UpdateFormationInput";
import type { Formation } from "../../types/Formation";

const FORMATION_DEFAULT: Formation = {
    formationId: 0,
    formationName: '',
    formationImageUrl: ''
}

function FormationForm() {

    const [formation, setFormation] = useState<Formation>(FORMATION_DEFAULT);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const { id } = useParams();
    const navigate = useNavigate();


    const queryClient = useQueryClient();
    const createMutation = useMutation<FormationResponse, Error, CreateFormationInput>({
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

    const updateMutation = useMutation<FormationResponse, Error, UpdateFormationInput>({
        mutationFn: updateFormation,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['formations'] })
            enqueueSnackbar(`${variables.formation.formationName} Formation Updated`, { variant: "success" });
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    })

    const isPending = createMutation.isPending || updateMutation.isPending;


    useEffect(() => {
        const loadDefaultImage = async () => {
            const response = await fetch(heroImg);
            const blob = await response.blob();
            console.log("HERE")
            const file = new File([blob], "hero.png", {
                type: blob.type,
            });

            setImage(file);


            if (id) {
                try {
                    const response = await getFormationById(Number(id));
                    const existingFormation: Formation = {
                        formationId: response.formationId,
                        formationName: response.formationName,
                        formationImageUrl: response.formationImageUrl
                    }
                    setFormation(existingFormation);


                    // const imageResponse = await fetch(response.formationImageUrl);
                    // const blob = await imageResponse.blob();
                    // const file = new File([blob], "existing.png", { type: blob.type });
                    setImageUrl(response.formationImageUrl);
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Something went wrong"
                    enqueueSnackbar(message, { variant: "error" })
                    navigate("/");
                }
            }
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

        createMutation.mutate(createRequest);
    }

    const handleUpdate = async () => {


        const updateRequest: UpdateFormationInput = {
            formation: formation,
            ...(image && { file: image})
        }

        updateMutation.mutate(updateRequest);
    }

    if (id) {
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
                    <img src={imageUrl}/>
                    <button onClick={handleUpdate} disabled={isPending}>{isPending ? "Updating..." : "Update Formation"}</button>

                </div>
            </>
        )
    } else {
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
}

export default FormationForm;