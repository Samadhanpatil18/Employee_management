import React from 'react';

const ErrorPage = ({ statusCode, message }) => {
    return (
        <div className="flex items-center justify-center absolute top-0 left-0 bg-white dark:bg-slate-800 w-full h-full">
            <div className="text-center">
                <h1 className="text-9xl font-extrabold text-red-500">{statusCode}</h1>
                <p className="text-2xl md:text-3xl font-semibold text-gray-700 mt-4">
                    {message}
                </p>
                <p className="mt-4 text-gray-500">Oops! Something went wrong.</p>
                <a 
                    href="/" 
                    className="mt-6 inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
};

export default ErrorPage;