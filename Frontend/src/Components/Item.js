import "./item.css";

import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { Button } from "@mui/material";
import Footer from "./Footer";
import axios from "axios";

const domain = process.env.REACT_APP_BACKEND_DOMAIN;

function Item() {
    const { id } = useParams(); // Get the product ID from URL parameters
    const [product, setProduct] = useState(null); // State to store product details
    const [selectedImage, setSelectedImage] = useState(null); // State to track selected image
    const [zoomedIn, setZoomedIn] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [zoomedImagePosition, setZoomedImagePosition] = useState({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        // Fetch product details based on the product ID
        const fetchProduct = async () => {
            try {
                const response = await axios.get(
                    `${domain}/product-by-id/${id}`
                ); // Adjust the endpoint URL as per your backend
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (zoomedIn) {
            calculateZoomedImagePosition();
        }
    }, [cursorPosition, zoomedIn, product]);

    // Function to handle image click
    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    // Render loading message if product is still being fetched
    if (!product) {
        return <div>Loading...</div>;
    }

    const handleMouseEnter = (event) => {
        setCursorPosition({ x: event.clientX, y: event.clientY });
        setZoomedIn(true);
    };

    const handleMouseMove = (event) => {
        setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseLeave = () => {
        setZoomedIn(false);
    };

    const calculateZoomedImagePosition = () => {
        const halfWidth = product.width / 2;
        const halfHeight = product.height / 2;
        const xOffset = cursorPosition.x - 5; // Adjust to center the 10x10 area
        const yOffset = cursorPosition.y - 5; // Adjust to center the 10x10 area
        const zoomedImageX =
            xOffset < halfWidth
                ? cursorPosition.x
                : product.width - cursorPosition.x;
        const zoomedImageY =
            yOffset < halfHeight
                ? cursorPosition.y
                : product.height - cursorPosition.y;

        setZoomedImagePosition({ x: zoomedImageX, y: zoomedImageY });
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "40px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "80px",
                        marginTop: "40px",
                    }}
                >
                    {/* First Clickable Image */}
                    <a onClick={() => handleImageClick(product.front_img)}>
                        {" "}
                        {/* Assuming 'front_img' is the key for the front image in product details */}
                        <img
                            src={product.front_img}
                            alt="Clickable Image 1"
                            style={{
                                width: "150px",
                                height: "150px",
                                marginBottom: "10px",
                                border:
                                    selectedImage === product.front_img
                                        ? "4px solid brown"
                                        : "none",
                            }}
                        />
                    </a>

                    {/* Second Clickable Image */}
                    <a onClick={() => handleImageClick(product.back_img)}>
                        {" "}
                        {/* Assuming 'back_img' is the key for the back image in product details */}
                        <img
                            src={product.back_img}
                            alt="Clickable Image 2"
                            style={{
                                width: "150px",
                                height: "150px",
                                marginBottom: "10px",
                                border:
                                    selectedImage === product.back_img
                                        ? "4px solid brown"
                                        : "none",
                            }}
                        />
                    </a>
                </div>

                <div style={{ marginTop: "40px", marginLeft: "110px" }}>
                    {/* Big Image on the Right */}
                    <div style={{ position: "relative" }}>
                        <img
                            src={selectedImage || product.front_img}
                            alt={product.name}
                            style={{ height: "600px" }}
                            onMouseEnter={handleMouseEnter}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        />
                        {zoomedIn && (
                            <div
                                className="zoomed-image-overlay"
                                style={{
                                    left: cursorPosition.x,
                                    top: cursorPosition.y,
                                }}
                            >
                                <img
                                    src={selectedImage}
                                    alt={product.product_name}
                                    style={{
                                        position: "absolute",
                                        transform: "scale(2)", // This will zoom the image by 2 times
                                        transformOrigin: `${cursorPosition.x}px ${cursorPosition.y}px`, // This will set the origin of transformation
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        width: "30%",
                        backgroundColor: "#f0f0f0",
                        padding: "20px",
                        marginLeft: "350px",
                        height: "100%",
                        overflowY: "auto",
                        marginRight: "30px",
                        marginTop: "40px",
                    }}
                >
                    {/* Product Name */}
                    <h2>{product.product_name}</h2>

                    {/* Product Price */}
                    <h3>Price: {product.price} Rs</h3>

                    {/* Product Details */}
                    <h3>Product Details</h3>
                    <ul>
                        <li>Size: {product.size}</li>
                        <li>Color: {product.color}</li>
                        <li>Material: {product.material}</li>
                        <li>Brand: {product.brand}</li>
                    </ul>

                    {/* Short Product Description */}
                    <p>
                        {"A Perfect Elegant" +
                            " " +
                            product.color +
                            " " +
                            product.product_name}
                    </p>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginTop: "40px",
                        }}
                    >
                        <Link
                            to="/cart"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <Button
                                sx={{
                                    backgroundColor: "#4d3d18",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#3b2e12",
                                    },
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                    marginTop: "30px",
                                    marginBottom: "5px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    alignItems: "center",
                                    width: "110%",
                                    display: "block",
                                }}
                            >
                                ADD TO CART
                            </Button>
                        </Link>

                        <Link
                            to="/checkout"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <Button
                                sx={{
                                    backgroundColor: "white",
                                    color: "#4d3d18",
                                    border: "2px solid #4d3d18",
                                    "&:hover": {
                                        backgroundColor: "#f0f0f0",
                                    },
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                    marginTop: "5px",
                                    marginBottom: "20px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    alignItems: "center",
                                    marginLeft: "-8px",
                                    width: "130%",
                                    display: "block",
                                }}
                            >
                                BUY NOW
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Item;
