import { useEffect, useRef, useState } from "react";
import type { FormationResponse } from "../../types/Response/FormationResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFormation, getFormationById, updateFormation } from "../../api/FormationAPI";
import { enqueueSnackbar } from "notistack";
import type { CreateFormationInput } from "../../types/Create/CreateFormationInput";
import heroImg from "../../assets/hero.png";
import { useNavigate, useParams } from "react-router-dom";
import type { UpdateFormationInput } from "../../types/Update/UpdateFormationInput";
import type { Formation } from "../../types/Formation";
import Canvas from "../other/Canvas";

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
    const [isUpdatingImage, setIsUpdatingImage] = useState(false);

    const canvasRef = useRef<{ getImage: () => Promise<Blob | null> }>(null);


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

        if (!canvasRef.current) {
            console.log("NO CANVAS")
            return;
        };
        const blob = await canvasRef.current.getImage();
        if (!blob) {
            console.log("NO BLOB")
            return
        };
        if (!image) {
            enqueueSnackbar("Please Create The Formation", { variant: "warning" })
            return;
        }

        const file = new File([blob], formation.formationName + ".png", { type: blob.type })

        const createRequest: CreateFormationInput = {
            formation: formation,
            file: file
        }

        createMutation.mutate(createRequest);
    }

    const handleUpdate = async () => {


        if (isUpdatingImage) {
            if (!canvasRef.current) {
                console.log("NO CANVAS")
                return;
            };

            const blob = await canvasRef.current.getImage();

            if (!blob) {
                console.log("NO BLOB")
                return
            };

            if (!image) {
                enqueueSnackbar("Please Create The Play", { variant: "warning" })
                return;
            }

            const file = new File([blob], formation.formationName + ".png", { type: blob.type })
            const updateRequest: UpdateFormationInput = {
                formation: formation,
                file: file
            }

            updateMutation.mutate(updateRequest);
        } else {
            const updateRequest: UpdateFormationInput = {
                formation: formation,
            }
            updateMutation.mutate(updateRequest);
        }
    }

    const handleNewImage = () => {
        setIsUpdatingImage(true);
    }

    const handleCancel = () => {
        setIsUpdatingImage(false);
    }

    if (id) {
        return (
            <>
                {isUpdatingImage && (
                    <div>
                        <Canvas ref={canvasRef} />
                        <button onClick={handleCancel}>Cancel</button>
                    </div>

                )}

                {!isUpdatingImage && (
                    <button onClick={handleNewImage}>Create New Formation Image</button>
                )}
                <div>
                    <input
                        name="formationName"
                        type="text"
                        value={formation.formationName}
                        onChange={handleChange}
                        required
                    />
                    <img src={imageUrl} />
                    <button onClick={handleUpdate} disabled={isPending}>{isPending ? "Updating..." : "Update Formation"}</button>

                </div>
            </>
        )
    } else {
        return (
            <>
                <Canvas ref={canvasRef} />
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