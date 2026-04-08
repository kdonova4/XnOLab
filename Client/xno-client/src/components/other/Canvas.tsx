import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";

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
                if(!canvas) return resolve(null)
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
        if(props.imageUrl) {
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
        if(props.imageUrl) {
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
            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                style={{ border: "1px solid black" }}

                // 1. On mouse down → start drawing
                onMouseDown={handleMouseDown}

                // 2. On mouse move → draw if active
                onMouseMove={handleMouseMove}

                // 3. On mouse up → stop drawing
                onMouseUp={handleMouseUp}

                // 4. If mouse leaves canvas → also stop drawing
                onMouseLeave={handleMouseUp}
            />

            <br />
            <select
                id="drawColor"
                name="drawColorChange"
                value={drawColor ?? ""}
                onChange={(e) => setDrawColor(e.target.value)}
            >
                <option value={"rgb(0, 0, 0)"}>Black</option>
                <option value={"rgb(255, 0, 0)"}>Red</option>
                <option value={"rgb(0, 4, 255)"}>Blue</option>
                <option value={"rgb(255, 255, 255)"}>White</option>
                <option value={"#1a7e01"}>Eraser</option>

            </select>

            <select
                id="drawSize"
                name="drawSizeChange"
                value={drawSize ?? ""}
                onChange={(e) => setDrawSize(Number(e.target.value))}
            >
                <option>3</option>
                <option>5</option>
                <option>8</option>
                <option>12</option>
                <option>15</option>


            </select>

            {/* Button to clear the canvas */}
            <button onClick={handleClear}>Clear</button>
            <button onClick={handleUndo}>Undo</button>
        </>
    );
})

export default Canvas;
