import { useEffect, useMemo, useState } from "react";
import { deleteFormation, getAllFormationsByUser } from "../../api/FormationAPI";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alpha, Box, Button, Card, CardMedia, Container, Fab, IconButton, InputBase, Menu, MenuItem, Stack, styled, Tooltip, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import { Search, SearchIconWrapper, StyledInputBase } from "../other/MUISearchLibraryComponents";



function FormationLibrary() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedFormationId, setSelectedFormationId] = useState<null | number>(null)
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

    

    const [anchorElFormation, setAnchorElFormation] = useState<null | HTMLElement>(null);
    const handleOpenPlaybookMenu = (event: React.MouseEvent<HTMLElement>, formationId: number) => {
        setAnchorElFormation(event.currentTarget);
        setSelectedFormationId(formationId);
    }

    const handleCloseFormationMenu = () => {
        setAnchorElFormation(null);
        setSelectedFormationId(null);
    }


    const handleEdit = (formationId: number) => {
        handleCloseFormationMenu();
        navigate(`/formation/edit/${formationId}`)
    }

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
            const confirmed = window.confirm("Are You Sure? Deleting This Formation Will Delete All Associated Plays.")
            if (confirmed) {
                mutate(formationId);
            }
            handleCloseFormationMenu()
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    }



    if (isSuccess) {
            return (
                <>
                <Container className="container">
                    <Typography variant="h3" p={2}>
                            Your Formations
                        </Typography>
                        <Stack>
                            <Box sx={{ backgroundColor: 'darkgreen', borderTopRightRadius: '40px', borderTopLeftRadius: '40px' }}>
                                <Stack
                                    direction="row"
                                    p={2}
                                    width="100%"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ boxSizing: "border-box" }}
                                >
                                    <Search>
                                        <SearchIconWrapper>
                                            <SearchIcon />
                                        </SearchIconWrapper>

                                        <StyledInputBase
                                            name="searchQuery"
                                            placeholder="Filter By Name"
                                            inputProps={{ 'aria-label': 'search' }}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </Search>

                                    <Fab
                                        variant="extended"
                                        sx={{
                                            backgroundColor: 'green',
                                            color: 'black',

                                            '&:hover': {
                                                backgroundColor: 'lightgreen', // hover color
                                            },

                                            '&:active': {
                                                backgroundColor: 'darkgreen', // click/pressed color
                                            },
                                        }}
                                     onClick={() => navigate("/formation/create")}>
                                        <AddIcon sx={{ mr: 1 }} />
                                        Create New
                                    </Fab>
                                </Stack>
                            </Box>
                            <Box sx={{ backgroundColor: '#181a1b', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderBottomRightRadius: '20px', borderBottomLeftRadius: '20px' }}>
                                {data && data.length > 0 && (
                                    filteredFormations.map((formation) => (
                                    <Card key={formation.formationId} sx={{
                                        width: '20%', margin: 2, backgroundColor: 'green', 
                                    }}>
                                        <CardMedia sx={{ height: 155 }} image={formation.formationImageUrl} title={formation.formationName}/>
                                        <Stack sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }} direction="row">

                                            <Typography sx={{ width: '100%' }} overflow="hidden" textOverflow="ellipsis" noWrap p={1} variant="h6">{formation.formationName}</Typography>

                                            <Tooltip sx={{ alignContent: 'flex-end', }} title="Open Settings">
                                                <IconButton onClick={(e) => handleOpenPlaybookMenu(e, formation.formationId)} sx={{ p: 0 }}>
                                                    <MoreVertIcon fontSize="large" sx={{ color: 'black' }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Menu
                                                anchorEl={anchorElFormation}
                                                open={Boolean(anchorElFormation)}
                                                onClose={handleCloseFormationMenu}
                                                disableScrollLock={true}
                                            >
                                                <MenuItem onClick={() => handleEdit(selectedFormationId!!)}>Edit</MenuItem>
                                                <MenuItem onClick={() => handleDelete(selectedFormationId!!)}>Delete</MenuItem>
                                            </Menu>
                                        </Stack>
                                    </Card>
                                ))
                                )}
                                
                                




                                <Card sx={{ width: '20%', height: '203px', margin: 2, backgroundColor: 'rgba(187, 187, 187, 0.27)' }}>
                                    <Button sx={{
                                        width: '100%', height: '100%', color: 'black', backgroundColor: 'darkgreen',

                                        '&:hover': {
                                            backgroundColor: 'lightgreen', // hover color
                                        },

                                        '&:active': {
                                            backgroundColor: 'darkgreen', // click/pressed color
                                        },
                                        '& .MuiButton-label': {
                                            color: 'black',
                                        },
                                    }} onClick={() => navigate("/formation/create")}>Create New</Button>
                                </Card>
                            </Box>
                        </Stack>

                    </Container>
                
                <Container className="container">
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
                </Container>
                
                </>
            )
        
    }




}

export default FormationLibrary;