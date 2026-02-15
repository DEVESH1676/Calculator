import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#00f5ff]/30 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#00f5ff] rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
