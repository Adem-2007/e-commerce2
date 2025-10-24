// components/your-path/MessagesSkeleton.jsx

import React from 'react';
import { Inbox, Mail, Calendar } from 'lucide-react';

// This component represents a single list item in the skeleton message list
const SkeletonListItem = () => (
    <li className="p-4 flex items-start gap-3">
        {/* Placeholder for the unread dot */}
        <div className="w-5 flex-shrink-0 pt-1.5">
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
        </div>
        {/* Placeholder for message content */}
        <div className="flex-1 overflow-hidden space-y-2">
            <div className="flex items-baseline justify-between">
                <div className="h-5 w-1/3 bg-gray-300 rounded"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        </div>
    </li>
);


const MessagesSkeleton = () => {
    return (
        <div className="mx-auto max-w-7xl w-full h-full animate-pulse">
            <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* --- Skeleton Header --- */}
                <header className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center">
                        <Inbox className="w-7 h-7 mr-3 text-gray-300" />
                        <div className="h-7 w-24 bg-gray-300 rounded-md"></div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-[minmax(320px,_1fr)_2fr] flex-1 overflow-hidden">
                    
                    {/* --- Panel 1: Skeleton Messages List --- */}
                    <aside className="border-r border-gray-200 bg-gray-50/50">
                        <ul className="divide-y divide-gray-200">
                            {/* Create an array to repeat the list item skeleton, simulating a list */}
                            {Array.from({ length: 8 }).map((_, index) => (
                                <SkeletonListItem key={index} />
                            ))}
                        </ul>
                    </aside>
                    
                    {/* --- Panel 2: Skeleton Message Content --- */}
                    <main className="flex-1 p-6 md:p-8 hidden md:block">
                        <div>
                            {/* Skeleton for message header */}
                            <div className="pb-6 border-b border-gray-200">
                                <div className="h-8 w-1/2 bg-gray-300 rounded-lg"></div>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 mr-2 text-gray-300" />
                                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-300" />
                                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Skeleton for message body */}
                            <div className="mt-6 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                            </div>

                            {/* Skeleton for reply section */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="h-6 w-1/4 bg-gray-300 rounded-md"></div>
                                <div className="mt-4 h-32 w-full bg-gray-200 rounded-lg"></div>
                                <div className="mt-4 flex justify-end">
                                    <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MessagesSkeleton;