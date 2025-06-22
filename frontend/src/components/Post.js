import React, { useState } from 'react';
import { postsAPI } from '../services/api';

const Post = ({ post, onPostUpdated }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes || 0);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await postsAPI.likePost(post.id);
            setLikes(response.data.likes);
            setLiked(!liked);
            if (onPostUpdated) {
                onPostUpdated();
            }
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    return (
        <div className="card animate-slide-up">
            <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                    {post.user_profile_picture ? (
                        <img
                            src={post.user_profile_picture}
                            alt={post.user_name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        post.user_name?.charAt(0).toUpperCase()
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-gray-800 truncate">
                            {post.user_name || 'Unknown User'}
                        </h4>
                        <span className="text-gray-500 text-sm">
                            {formatDate(post.created_at)}
                        </span>
                    </div>
                </div>
            </div>

            {post.content && (
                <div className="mb-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>
            )}

            {post.image_url && (
                <div className="mb-6">
                    <img
                        src={post.image_url}
                        alt="Post content"
                        className="w-full max-h-96 object-cover rounded-xl shadow-lg"
                    />
                </div>
            )}

            <div className="flex items-center space-x-4">
                <button
                    onClick={handleLike}
                    disabled={loading}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${liked
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <span className="text-xl">{liked ? '❤️' : '🤍'}</span>
                    <span className="font-semibold">{likes}</span>
                </button>
            </div>
        </div>
    );
};

export default Post; 