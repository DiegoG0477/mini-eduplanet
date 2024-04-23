import { React, useEffect } from "react";
import BookDetails from "../BookDetails/BookDetails";
import axios from "axios";
import "./Dashboard.css";
import io from "socket.io-client";
import Swal from "sweetalert2";

const Dashboard = () => {
    const token = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
        // Obtener el userId del localStorage
        const userId = JSON.parse(localStorage.getItem("userId"));
        console.log("User ID:", userId);

        // Conectar el socket al servidor
        const socket = io("http://184.72.246.90:4000", {
            auth: {
                userId: userId,
            }
        });

        socket.on("connect", () => {
            console.log("Conectado al servidor de WebSockets");
        });

        socket.on("disconnect", () => {
            console.log("Desconectado del servidor de WebSockets");
        });

        socket.on("notification:order_response", (data) => {
            displayResponse(data);
            console.log("Notificación de respuesta de orden:", data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const displayResponse = (data) => {
        Swal.fire({
            title: "Respuesta de orden",
            text: data.data.msg,
            icon: data.data.status === "success" ? "success" : "error",
        });
    };

    const handleOrder = async () => {
        console.log("Comprando libro");
        alert("Comprando libro");
        const response = await axios
            .post(
                "http://34.197.57.0:4000/orders",
                {
                    productId: "6626bd95f457a92ad9478eed",
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <h2>Libros</h2>
            <h5>User ID: {localStorage.getItem("userId")}</h5>
            <div className="book-list">
                <BookDetails
                    book={{
                        id: 1,
                        name: "El principito",
                        price: 200,
                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREqlXro4gShzXiZQ-ZHarMn_HXWra4Z1MVYGBZDoC6jA&s",
                    }}
                    buyMethod={handleOrder}
                />

                <BookDetails
                    book={{
                        id: 2,
                        name: "El alquimista",
                        price: 300,
                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREqlXro4gShzXiZQ-ZHarMn_HXWra4Z1MVYGBZDoC6jA&s",
                    }}
                    buyMethod={handleOrder}
                />

                <BookDetails
                    book={{
                        id: 3,
                        name: "El arte de amar",
                        price: 150,
                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREqlXro4gShzXiZQ-ZHarMn_HXWra4Z1MVYGBZDoC6jA&s",
                    }}
                    buyMethod={handleOrder}
                />

                <BookDetails
                    book={{
                        id: 4,
                        name: "La insoportable levedad del ser",
                        price: 250,
                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREqlXro4gShzXiZQ-ZHarMn_HXWra4Z1MVYGBZDoC6jA&s",
                    }}
                    buyMethod={handleOrder}
                />

                <BookDetails
                    book={{
                        id: 5,
                        name: "El amor en los tiempos del cólera",
                        price: 180,
                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREqlXro4gShzXiZQ-ZHarMn_HXWra4Z1MVYGBZDoC6jA&s",
                    }}
                    buyMethod={handleOrder}
                />
            </div>
        </div>
    );
};

export default Dashboard;
