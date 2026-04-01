import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPlaybookSummaryById } from "../../api/PlaybookAPI";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import PlayLibrary from "../play/PlayLibrary";

function PlaybookViewer() {

    const { playbookId } = useParams();
    const navigate = useNavigate();
     const { data, error, isSuccess } = useQuery({
        queryKey: ["playbookSummary", Number(playbookId)],
        queryFn: () => getPlaybookSummaryById(Number(playbookId)),
        retry: false
     })

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error.message, { variant: "error" });
            navigate("/");
        }
    }, [error, navigate]);


     if(isSuccess) {
        if(!data) {
            return <p>No Playbook</p>
        } else {
            return (
                <>
                    <div>
                        <h1>{data.playbookName}</h1>
                    </div>
                    <div>
                        <PlayLibrary playbookId={Number(playbookId)}/>
                    </div>
                </>
            )
        }
     }

    return (
        <>

        </>
    )
}

export default PlaybookViewer;