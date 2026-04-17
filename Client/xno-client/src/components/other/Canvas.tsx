import { Box, Fab, Slider, Stack } from "@mui/material";
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import ModeIcon from '@mui/icons-material/Mode';
import ClearIcon from '@mui/icons-material/Clear';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import ReplayIcon from '@mui/icons-material/Replay';

type CanvasHandle = {
    getImage: () => Promise<Blob | null>
}

type CanvasProps = {
    imageUrl?: string;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>((props, ref) => {
    // Ref to access the canvas DOM element
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Track whether the user is currently drawing
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawColor, setDrawColor] = useState("");
    const [drawSize, setDrawSize] = useState(3);
    const [snapshots, setSnapshots] = useState<ImageData[]>([])

    useImperativeHandle(ref, () => ({
        getImage: () => {
            return new Promise<Blob | null>((resolve) => {
                const canvas = canvasRef.current;
                if (!canvas) return resolve(null)
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, "image/png");
            });
        },
    }));

    // Runs once when component mounts
    useEffect(() => {
        // 1. Get canvas from ref
        const canvas = canvasRef.current;
        // 2. If no canvas, return
        if (!canvas) return;
        // 3. Get 2D context from canvas
        const ctx = canvas.getContext("2d");
        // 4. If no context, return
        if (!ctx) return;
        if (props.imageUrl) {
            console.log("IMAGE URL IS" + props.imageUrl)
            const bg = new Image();
            bg.crossOrigin = "anonymous"
            bg.src = props.imageUrl;
            bg.onload = () => {
                ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
            }
        } else {
            ctx.fillStyle = "#1a7e01";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        // 5. Set drawing styles:
        //    - lineWidth
        ctx.lineWidth = drawSize;
        //    - lineCap
        ctx.lineCap = "round"
        //    - strokeStyle
        ctx.strokeStyle = "black"

        console.log("Drawing")
    }, [props.imageUrl]);




    // Helper: convert mouse event to canvas coordinates
    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // 1. Get canvas from ref
        const canvas = canvasRef.current;
        // 2. If no canvas, return default { x: 0, y: 0 }
        if (!canvas) {
            return { x: 0, y: 0 }
        }
        // 3. Get bounding rectangle of canvas
        const rect = canvas.getBoundingClientRect();
        // 4. Calculate x:
        //    e.clientX - rect.left
        const x = e.clientX - rect.left;

        // 5. Calculate y:
        //    e.clientY - rect.top 
        const y = e.clientY - rect.top;
        // 6. Return { x, y }

        return { x, y }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // 1. Get canvas from ref
        const canvas = canvasRef.current;
        // 2. If no canvas, return
        if (!canvas) return;
        // 3. Get context
        const ctx = canvas.getContext("2d");
        // 4. If no context, return
        if (!ctx) return;

        setSnapshots(prevSnapshots => [...prevSnapshots, ctx.getImageData(0, 0, canvas.width, canvas.height)])
        // 5. Get mouse position using helper
        const { x, y } = getMousePos(e);
        // 6. Start a new path:
        //    ctx.beginPath()
        ctx.beginPath()
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawSize;

        // 7. Move to starting point:
        //    ctx.moveTo(x, y)
        ctx.moveTo(x, y);
        // 8. Set isDrawing = true
        setIsDrawing(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // 1. If NOT currently drawing, return
        if (!isDrawing) return;
        // 2. Get canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        // 3. Get context
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // 4. Get mouse position
        const { x, y } = getMousePos(e)
        // 5. Draw line to new position:
        //    ctx.lineTo(x, y)
        ctx.lineTo(x, y);
        // 6. Render the line:
        //    ctx.stroke()
        ctx.stroke();
    };

    const handleMouseUp = () => {
        // 1. Stop drawing
        //    setIsDrawing(false)
        setIsDrawing(false);
    };

    const handleUndo = () => {
        if (snapshots.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const data = snapshots[snapshots.length - 1];
        if (!data) return;

        ctx.putImageData(data, 0, 0);

        setSnapshots(prev => {
            const index = prev.lastIndexOf(data)
            const newSnapshots = prev.slice(0, index);
            return newSnapshots;
        })
    }

    const handleClear = () => {
        // 1. Get canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        // 2. Get context
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // 3. Clear entire canvas:
        //    ctx.clearRect(0, 0, canvas.width, canvas.height)
        setSnapshots(prevSnapshots => [...prevSnapshots, ctx.getImageData(0, 0, canvas.width, canvas.height)])
        if (props.imageUrl) {
            console.log("IMAGE URL IS" + props.imageUrl)
            const bg = new Image();
            bg.crossOrigin = "anonymous"
            bg.src = props.imageUrl;
            bg.onload = () => {
                ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
            }
        } else {
            ctx.fillStyle = "#1a7e01";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.beginPath()
    };




    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                {/* CANVAS (true center) */}
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    style={{ border: "1px solid black", cursor: 'crosshair' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                />

                {/* SIDE BUTTONS (do NOT affect layout) */}
                <Box
                    sx={{
                        position: 'absolute',
                        right: 80,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >

                    <Fab sx={{
                        outline: '4px solid grey',
                        backgroundColor: 'black',
                        filter: drawColor === 'black' ? 'brightness(1.9)' : 'brightness(1)',
                        color: 'black',

                        '&:hover': {
                            backgroundColor: 'black',
                            filter: 'brightness(1.5)'
                        },

                        '&:active': {
                            backgroundColor: 'black',
                            filter: 'brightness(1.9)'
                        },
                    }} size="small" onClick={() => setDrawColor('black')}></Fab>
                    <Fab sx={{
                        outline: '4px solid grey',
                        backgroundColor: 'red',
                        filter: drawColor === 'red' ? 'brightness(1.9)' : 'brightness(1)',
                        color: 'black',

                        '&:hover': {
                            backgroundColor: 'red',
                            filter: 'brightness(1.5)'
                        },

                        '&:active': {
                            backgroundColor: 'red',
                            filter: 'brightness(1.9)'
                        },
                    }} size="small" onClick={() => setDrawColor('red')}></Fab>
                    <Fab sx={{
                        outline: '4px solid grey',
                        backgroundColor: 'blue',
                        filter: drawColor === 'blue' ? 'brightness(1.9)' : 'brightness(1)',
                        color: 'black',

                        '&:hover': {
                            backgroundColor: 'blue',
                            filter: 'brightness(1.5)'
                        },

                        '&:active': {
                            backgroundColor: 'blue',
                            filter: 'brightness(1.9)'
                        },
                    }} size="small" onClick={() => setDrawColor('blue')}></Fab>
                    <Fab sx={{
                        outline: '4px solid grey',
                        backgroundColor: 'white',
                        filter: drawColor === 'white' ? 'brightness(1.9)' : 'brightness(1)',
                        color: 'black',

                        '&:hover': {
                            backgroundColor: 'white',
                            filter: 'brightness(1.5)'
                        },

                        '&:active': {
                            backgroundColor: 'white',
                            filter: 'brightness(1.9)'
                        },
                    }} size="small" onClick={() => setDrawColor('white')}></Fab>
                    <Fab size="small" onClick={() => setDrawColor("#1a7e01")} sx={{
                        outline: '4px solid grey', '&:hover': {
                            backgroundColor: 'white',
                            filter: 'brightness(1.5)'
                        },
                        filter: drawColor === '#1a7e01' ? 'brightness(1.9)' : 'brightness(1)',

                        '&:active': {
                            backgroundColor: 'white',
                            filter: 'brightness(1.9)'
                        },
                    }}><AutoFixNormalIcon /></Fab>

                </Box>
            </Box>

            <Box mt={1} display='flex' justifyContent='center'>
                <Stack direction="row" gap={10}>
                    <Stack spacing={3} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
                        <ModeIcon />
                        <Slider sx={{
                            width: 100,
                            color: 'green', // base track color

                            // THUMB (the circle)
                            '& .MuiSlider-thumb': {
                                backgroundColor: 'green',
                            },

                            // HOVER on thumb
                            '& .MuiSlider-thumb:hover': {
                                boxShadow: '0 0 0 8px rgba(0, 128, 0, 0.2)',
                            },

                            // ACTIVE / CLICKED (while dragging or pressing)
                            '& .MuiSlider-thumb.Mui-active': {
                                boxShadow: '0 0 0 12px rgba(0, 128, 0, 0.3)',
                            },

                            // FOCUS (keyboard click / accessibility)
                            '& .MuiSlider-thumb.Mui-focusVisible': {
                                boxShadow: '0 0 0 8px rgba(0, 128, 0, 0.25)',
                            },

                            // TRACK (left side of slider)
                            '& .MuiSlider-track': {
                                backgroundColor: 'green',
                            },

                            // RAIL (background line)
                            '& .MuiSlider-rail': {
                                opacity: 0.3,
                                backgroundColor: 'darkgreen',
                            },
                        }} aria-label="Volume" value={drawSize} onChange={(_e, val) => setDrawSize(val)} defaultValue={drawSize} max={20} min={3} />
                        <ModeIcon fontSize="large" />
                    </Stack>
                    <Fab size="small" onClick={handleClear}><ClearIcon /></Fab>
                    <Fab size="small" onClick={handleUndo}><ReplayIcon /></Fab>
                </Stack>
            </Box>
            <br />



        </>
    );
})

export default Canvas;
