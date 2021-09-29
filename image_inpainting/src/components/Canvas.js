import React, { useState, useRef } from "react";
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@mui/material/Button';
import CanvasDraw from "react-canvas-draw";
import axios from "axios";


const Canvas = (props) => {
    const { inputPhoto, width, height } = props;
    const canvasWidth = 400 * (width / height);
    const [brushSize, setBrushSize] = useState(12);

    const canvasRef = useRef(null);

    const inpaintImage = async (data) => {
        await axios.post('http://127.0.0.1:8000/api/inpaint', data)
            .then((res) => console.log(res))
    }

    const clearCanvasHandler = () => {
        const canvas = canvasRef.current;
        canvas.clear();
    }

    const undoChangesHandler = () => {
        const canvas = canvasRef.current;
        canvas.undo();
    }

    const saveImageHandler = () => {
        const canvas = canvasRef.current;
        const mask = canvas.canvasContainer.childNodes[1].toDataURL("image/png");
        let imageFile = null;
        let maskFile = null;
        let formData = new FormData();
        fetch(inputPhoto)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "image.png", { type: 'image/png' });
                imageFile = file;
            })
        fetch(mask)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "mask.png", { type: "image/png" });
                maskFile = file;
            })
            .then(() => {
                formData.append('image', imageFile);
                formData.append('mask', maskFile);
                inpaintImage(formData);
            })
    }

    const valuetext = (value) => {
        if (brushSize !== value) {
            setBrushSize(value);
        }

        return value;
    }

    return (
        <div className="canvas" style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
            <Typography id="slider" gutterBottom>
                Brush radius
            </Typography>
            <Slider
                defaultValue={12}
                getAriaValueText={valuetext}
                aria-labelledby="slider"
                valueLabelDisplay="auto"
                min={1}
                max={100}
                style={{ color: "gray" }}
            />
            <CanvasDraw
                ref={canvasRef}
                onChange={null}
                loadTimeOffset={0}
                lazyRadius={0}
                brushRadius={brushSize}
                brushColor="#FFFFFF"
                catenaryColor="#FFFFFF"
                backgroundColor="#000000"
                hideGrid={true}
                canvasWidth={canvasWidth}
                canvasHeight={400}
                disabled={false}
                imgSrc={inputPhoto}
                saveData={null}
                immediateLoading={true}
                hideInterface={false}
            />
            <div className="controls" style={{ display: "flex", justifyContent: "space-evenly", marginTop: "15px" }}>
                <Button variant="contained" onClick={saveImageHandler}>Inpaint</Button>
                <Button variant="contained" onClick={undoChangesHandler}>Undo</Button>
                <Button variant="contained" onClick={clearCanvasHandler}>Clear</Button>
            </div>
        </div>
    );
}

export default Canvas;