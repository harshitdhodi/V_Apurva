import React, { forwardRef } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = forwardRef(({ onClick }, ref) => {
    return (
        <div
            ref={ref}
            className="fixed bottom-8 right-8 w-10 h-10 bg-[#bf2e2e] text-white rounded-md flex items-center justify-center cursor-pointer z-40 hover:bg-secondary transition-colors duration-200"
            onClick={onClick}
        >
            <ArrowUp className="w-6 h-6" />
        </div>
    );
});

export default ScrollToTopButton;
