import React, { useState, useRef, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

const SuccessCardPopup = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const cardRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setIsModalOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [cardRef]);

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div ref={cardRef} className="relative">
                        <Card className="flex flex-col justify-center items-center gap-10 text-foreground p-6 w-[30vw] h-[50vh]">
                            <CardHeader>
                                <CardTitle className="text-foreground text-3xl">Login Success</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center items-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
                                    <svg
                                        aria-hidden="true"
                                        className="w-8 h-8 text-green-500 dark:text-green-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <span className="sr-only">Success</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
};

export default SuccessCardPopup;
