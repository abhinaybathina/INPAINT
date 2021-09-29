import React, { useRef, useState } from "react";
import SideBar from "./SideBar";
import Canvas from "./Canvas";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import '../styles/Home.css';


const Home = () => {

    const inputImageRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inputImage, setInputImage] = useState("");
    const [width, setWidth] = useState(400);
    const [height, setHeight] = useState(400);

    const BootstrapButton = styled(Button)({
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 16,
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        backgroundColor: '#0063cc',
        borderColor: '#0063cc',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            backgroundColor: '#0069d9',
            borderColor: '#0062cc',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        },
    });

    const openImageHandler = () => {
        inputImageRef.current.click();
    }

    const imageHandler = (e) => {
        e.preventDefault();
        const input = URL.createObjectURL(e.target.files[0]);
        var image = new Image();
        image.onload = function () {
            setWidth(this.width);
            setHeight(this.height);
        };
        image.src = input;
        setImageLoaded(true);
        setInputImage(input);
    }

    return (
        <React.Fragment>
            <div className="header">
                <h2 className="logo">I N P A I N T</h2>
            </div>
            <div className="mainbody">
                <div>
                    <SideBar />
                </div>
                <div className="openimage" style={imageLoaded ? { height: "600px" } : { height: "300px" }}>
                    {imageLoaded ?
                        <div>
                            <Canvas inputPhoto={inputImage} width={width} height={height} />
                        </div>
                        :
                        <div className="description">
                            <h2 className="welcome">Welcome to I N P A I N T</h2>
                            <p>A project by Naga Harshita, Abhinay and Hemanth Krishna. Start editing by clicking on the open photo button</p>
                            <input
                                ref={inputImageRef}
                                type="file"
                                id="inputImage"
                                accept="image/*"
                                onChange={(e) => imageHandler(e)}
                                hidden
                            /><br />
                            <BootstrapButton variant="contained" onClick={openImageHandler}>
                                Open Photo
                            </BootstrapButton>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

export default Home;