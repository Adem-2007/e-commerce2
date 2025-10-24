import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
    Inbox,
    Mail,
    Calendar,
    Loader2,
    AlertCircle,
    ChevronRight,
    MessageSquare,
    Trash2,
    Send,
    CheckCircle2
} from 'lucide-react';
import { API_BASE_URL } from '../../../api/api'; // Ensure this path is correct
import ConfirmModal from '../../../common/rusultModal/ConfirmModal'; // Ensure this path is correct
import MessagesSkeleton from './MessagesSkeleton'; // Import the skeleton component

const MessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for managing the reply functionality
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    // State for managing the delete confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    // Fetch messages from the backend when the component mounts
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Simulate a slightly longer load time to see the skeleton
                // await new Promise(resolve => setTimeout(resolve, 1000)); 
                const response = await axios.get(`${API_BASE_URL}/api/messages`);
                setMessages(response.data);
                // Automatically select the first message if the list is not empty
                if (response.data.length > 0) {
                    setSelectedMessage(response.data[0]);
                }
            } catch (err) {
                setError('Failed to fetch messages. Please try again later.');
                console.error("Fetch messages error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    // Handle selecting a message from the list
    const handleSelectMessage = async (message) => {
        setSelectedMessage(message);
        setReplyText(''); // Clear reply textarea when switching messages

        // If the selected message is unread, mark it as read
        if (!message.isRead) {
            try {
                // The API returns the updated message, which we can use directly
                const response = await axios.patch(`${API_BASE_URL}/api/messages/${message._id}/read`);
                
                // Update the state locally to reflect the change immediately
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg._id === message._id ? response.data : msg
                    )
                );

                // Also update the selected message state directly
                setSelectedMessage(response.data);
            } catch (err) {
                console.error('Failed to mark message as read:', err);
            }
        }
    };

    // Open the confirmation modal when a delete button is clicked
    const handleDeleteClick = (id, e) => {
        e.stopPropagation(); // Prevent the message from being selected
        setMessageToDelete(id);
        setIsModalOpen(true);
    };

    // Execute the deletion after user confirmation
    const handleConfirmDelete = async () => {
        if (!messageToDelete) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/messages/${messageToDelete}`);
            const updatedMessages = messages.filter(msg => msg._id !== messageToDelete);
            setMessages(updatedMessages);

            // If the deleted message was being viewed, select the next one or show empty state
            if (selectedMessage?._id === messageToDelete) {
                setSelectedMessage(updatedMessages.length > 0 ? updatedMessages[0] : null);
            }
        } catch (err) {
            console.error('Failed to delete message:', err);
            alert('Could not delete the message. The server might be down or the message was already removed.');
        } finally {
            // Reset modal state
            setMessageToDelete(null);
            setIsModalOpen(false);
        }
    };
    
    // Handle sending the reply
    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedMessage) return;

        setIsReplying(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/messages/${selectedMessage._id}/reply`, {
                reply: replyText
            });

            const updatedMessage = response.data.data;
            
            // Update the message in the main list
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                )
            );
            
            // Update the currently viewed message to show the reply
            setSelectedMessage(updatedMessage);
            setReplyText(''); // Clear the input field

        } catch (err) {
            console.error('Failed to send reply:', err);
            alert('Failed to send reply. Please try again.');
        } finally {
            setIsReplying(false);
        }
    };


    // --- RENDER LOGIC ---

    // 1. Loading State with Skeleton
    if (loading) {
        return <MessagesSkeleton />;
    }

    // 2. Error State
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 rounded-lg p-8">
                <AlertCircle className="w-16 h-16 mb-4" />
                <p className="text-xl font-semibold">An Error Occurred</p>
                <p>{error}</p>
            </div>
        );
    }

    // 3. Main Component Render
    return (
        <>
            <ConfirmModal
                showModal={isModalOpen}
                setShowModal={setIsModalOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Message"
                message="Are you sure you want to permanently delete this message? This action cannot be undone."
                confirmText="Delete"
            />
            
            <div className="mx-auto max-w-7xl w-full h-full">
                <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-2xl shadow-xl overflow-hidden">
                    <header className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <Inbox className="w-7 h-7 mr-3 text-blue-600" />
                            <span>Inbox</span>
                        </h1>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-[minmax(320px,_1fr)_2fr] flex-1 overflow-hidden">
                        
                        {/* Panel 1: Messages List */}
                        <aside className="border-r border-gray-200 overflow-y-auto bg-gray-50/50 custom-scrollbar">
                            {messages.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {messages.map(msg => (
                                        <li
                                            key={msg._id}
                                            onClick={() => handleSelectMessage(msg)}
                                            className={`p-4 cursor-pointer transition-colors duration-200 flex items-start gap-3 group relative ${selectedMessage?._id === msg._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                                        >
                                            <div className="flex-shrink-0 w-5 flex justify-center pt-1.5">
                                                {!msg.isRead && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full" aria-label="Unread message"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex items-baseline justify-between">
                                                    <p className={`font-bold truncate ${selectedMessage?._id === msg._id ? 'text-blue-800' : 'text-gray-800'}`}>
                                                        {msg.name}
                                                    </p>
                                                    {selectedMessage?._id === msg._id && (
                                                        <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 hidden md:block" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 truncate pr-4">{msg.message}</p>
                                                <div className="flex items-center gap-4">
                                                   <p className="text-xs text-gray-400 mt-1">
                                                        {format(new Date(msg.createdAt), 'MMM d, yyyy')}
                                                    </p>
                                                    {msg.reply && (
                                                        <div className="flex items-center text-xs text-green-600 mt-1">
                                                            <CheckCircle2 className="w-3 h-3 mr-1"/>
                                                            <span>Replied</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteClick(msg._id, e)}
                                                className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-200 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                                                title="Delete message"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                                    <MessageSquare className="w-16 h-16 mx-auto text-gray-300" />
                                    <p className="mt-4 font-semibold">No messages yet.</p>
                                    <p className="text-sm">New messages from your contact form will appear here.</p>
                                </div>
                            )}
                        </aside>
                        
                        {/* Panel 2: Message Content Display */}
                        <main className="flex-1 p-6 md:p-8 overflow-y-auto hidden md:block custom-scrollbar">
                            {selectedMessage ? (
                                <div>
                                    <div className="pb-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between gap-4">
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedMessage.name}</h2>
                                            <button
                                                onClick={(e) => handleDeleteClick(selectedMessage._id, e)}
                                                className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors duration-200 flex-shrink-0"
                                                title="Delete message"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                <a href={`mailto:${selectedMessage.email}`} className="hover:underline text-blue-600">{selectedMessage.email}</a>
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>{format(new Date(selectedMessage.createdAt), 'PPPp')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                                        <p>{selectedMessage.message}</p>
                                    </div>

                                    {/* --- Reply Section --- */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        {selectedMessage.reply ? (
                                            // View if message has already been replied to
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600"/>
                                                    You Replied on {format(new Date(selectedMessage.repliedAt), 'PPP')}
                                                </h3>
                                                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap">
                                                    {selectedMessage.reply}
                                                </div>
                                            </div>
                                        ) : (
                                            // View to send a new reply
                                            <form onSubmit={handleSendReply}>
                                                <h3 className="text-lg font-semibold text-gray-800">Your Reply</h3>
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    className="w-full h-32 p-3 mt-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                                                    placeholder={`Reply to ${selectedMessage.name}...`}
                                                    required
                                                />
                                                <div className="mt-3 flex justify-end">
                                                    <button
                                                        type="submit"
                                                        disabled={isReplying || !replyText.trim()}
                                                        className="inline-flex items-center px-6 py-2.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        {isReplying ? (
                                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        ) : (
                                                            <Send className="w-5 h-5 mr-2" />
                                                        )}
                                                        <span>{isReplying ? 'Sending...' : 'Send Reply'}</span>
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>

                                </div>
                            ) : (
                                // This view shows if there are no messages at all, or none selected
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <Inbox className="w-24 h-24 text-gray-300" />
                                    <h2 className="mt-4 text-xl font-semibold">
                                        {messages.length > 0 ? "Select a message to read" : "Your inbox is empty"}
                                    </h2>
                                    <p className="mt-1">
                                        {messages.length > 0 ? "Choose a message from the list on the left." : "Messages from your users will be displayed here."}
                                    </p>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessagesPage;