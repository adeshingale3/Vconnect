import React from 'react'
import Navbar from './Navbar'
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const handleBrowseEventClick = () => {
        navigate("/browse-events");
    };

    return (
        <div className='mt-4 w-full h-full'>
            <div className="h-screen flex flex-col justify-center items-center text-center">
                <div className="text-6xl font-bold mb-4">
                    <h1>MAKE A DIFFERENCE IN</h1>
                    <h1>YOUR COMMUNITY</h1>
                </div>
                <div className="text-xl mt-4 font-semibold text-gray-500">
                    <h1>Join our platform to discover meaningful volunteer opportunities and connect</h1>
                    <h1>with like-minded people.</h1>
                </div>
                <div className='text-white mt-4 bg-blue-500 w-40 h-10 flex justify-center items-center rounded-xl hover:bg-blue-600 transition duration-200'>
                    <button onClick={handleBrowseEventClick} className="text-white w-full h-full">
                        Browse Events
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
