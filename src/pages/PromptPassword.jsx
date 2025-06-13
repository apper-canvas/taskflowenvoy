import { useEffect } from 'react';

const PromptPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showPromptPassword('#authentication-prompt-password');
    }, []);

    return (
        <div className="flex-1 py-12 px-5 flex justify-center items-center bg-black">
            <div id="authentication-prompt-password" className="bg-surface mx-auto w-[400px] max-w-full p-10 rounded-2xl border border-gray-700"></div>
        </div>
    );
};

export default PromptPassword;