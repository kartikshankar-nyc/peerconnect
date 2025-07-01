import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/apiService';

const DemoBanner: React.FC = () => {
    if (!apiService.isRunningDemo()) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-3">
                    <div className="flex items-center space-x-3">
                        <InformationCircleIcon className="w-5 h-5 text-amber-600" />
                        <p className="text-sm font-medium text-amber-800">
                            🎭 <span className="font-semibold">Demo Mode:</span> You're exploring PeerNexus with simulated data.
                            <span className="hidden sm:inline"> All features are functional but data isn't persistent.</span>
                        </p>
                        <a
                            href="https://github.com/kartikshankar/peernexus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-700 hover:text-amber-900 font-medium underline ml-2"
                        >
                            View Source
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoBanner; 