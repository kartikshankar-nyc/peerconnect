import React from 'react';
import { InformationCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/apiService';

const DemoBanner: React.FC = () => {
    if (!apiService.isRunningDemo()) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 border-b border-blue-300/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-4">
                    <div className="flex items-center space-x-3 text-white">
                        <div className="flex items-center space-x-2">
                            <SparklesIcon className="w-5 h-5 text-yellow-300 animate-pulse" />
                            <span className="text-base font-bold">🎭 Demo Mode</span>
                        </div>
                        <span className="hidden sm:inline text-white/90">•</span>
                        <p className="text-sm font-medium text-white/90">
                            You're exploring PeerConnect with simulated data.
                            <span className="hidden md:inline ml-1">All features are functional but data isn't persistent.</span>
                        </p>
                        <a
                            href="https://github.com/kartikshankar-nyc/peerconnect"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center text-yellow-200 hover:text-yellow-100 font-medium underline underline-offset-2 ml-3 transition-colors duration-200"
                        >
                            <span>View Source</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoBanner; 