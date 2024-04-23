import { React, useEffect, useState } from "react";
import BookDetails from "../BookDetails/BookDetails";
import axios from "axios";
import "./Dashboard.css";
import io from "socket.io-client";
import Swal from "sweetalert2";

const Dashboard = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const [books, setBooks] = useState([]);
    const [ isFetching, setIsFetching ] = useState(false);
    const [myBooks, setMyBooks] = useState([]);

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        const getBooks = async () => {
            const response = await axios.get("http://34.197.57.0:4000/books", {
                headers: {
                    Authorization: token,
                },
            });

            console.log(response.data);
            setBooks(response.data.data.books);
        }

        getBooks();
        setIsFetching(true);
    }, []);

    useEffect(() => {
        const getMyBooks = async (books) => {
            if (books.length > 0) {
                const response = await axios.get("http://34.197.57.0:4000/posessions",{
                    headers: {
                        Authorization: token,
                    },
                });

                console.log(response);

                const posessions = response.data.data.posessions;

                const myBooks = posessions.map((posession) => {
                    const myBook = books.find((book) => book.id === posession.idProduct);
                    return myBook;
                }).filter(book => book !== undefined);
                
                setMyBooks(myBooks);
            }
        }

        getMyBooks(books);
    }, [books]);


    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem("userId"));
        console.log("User ID:", userId);

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

    const handleOrder = async (bookId) => {
        console.log("Comprando libro", bookId);
        alert("Comprando libro");
        const response = await axios
            .post(
                "http://34.197.57.0:4000/orders",
                {
                    productId: bookId,
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
                {books.map((book) => (
                    <BookDetails
                        key={book.id}
                        book={{
                            id: book.id,
                            name: book.title,
                            price: book.price,
                            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREqlXro4gShzXiZQ-ZHarMn_HXWra4Z1MVYGBZDoC6jA&s",
                        }}
                        buyMethod={handleOrder}
                    />
                ))}
            </div>

            <h2>Mis libros</h2>

            <div className="book-list">
                {myBooks.map((book) => (
                    <BookDetails
                        key={book.id}
                        book={{
                            id: book.id,
                            name: book.title,
                            price: book.price,
                            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREqlXro4gShzXiZQ-ZHarMn_HXWra4Z1MVYGBZDoC6jA&s",
                        }}
                        purchased={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
