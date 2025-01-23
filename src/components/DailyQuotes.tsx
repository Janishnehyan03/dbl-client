import { useEffect, useState } from "react";
import Axios from "../utils/Axios";

interface Quote {
    text: string;
    author: string;
}

const DailyQuotes = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const response = await Axios.get("/dailyQuotes");
                setQuotes(response.data);
            } catch (error) {
                console.error("Error fetching quotes:", error);
            }
        };

        fetchQuotes();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
            );
        }, 6000);

        return () => clearInterval(interval);
    }, [quotes]);

    if (quotes.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                Loading quotes...
            </div>
        );
    }

    return (
        <div className="relative max-w-3xl mx-auto p-8 bg-white text-black rounded-lg shadow-lg overflow-hidden font-dmsans">
            <div className="transition-all duration-1000 ease-in-out text-center">
                <p
                    className={`text-lg  ${/[\u0600-\u06FF]/.test(quotes[currentIndex]?.text) ? "font-arabic" :
                            /[\u0D00-\u0D7F]/.test(quotes[currentIndex]?.text) ? "font-malayalam" :
                                /[\u0600-\u06FF]/.test(quotes[currentIndex]?.text) ? "font-urdu" :
                                    "font-dmsans"
                        }`}
                >
                    "{quotes[currentIndex]?.text}"
                </p>

                <p className="mt-4 text-lg font-medium">
                    - {quotes[currentIndex]?.author || "Unknown"}
                </p>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {quotes.map((_, index) => (
                    <span
                        key={index}
                        className={`w-3 h-3  rounded-full ${index === currentIndex ? "bg-black" : "bg-gray-400"
                            } transition-all`}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default DailyQuotes;
