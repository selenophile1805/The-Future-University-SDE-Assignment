import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import Post from './Post';
import PostForm from './PostForm';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        try {
            const response = await postsAPI.getPosts();
            setPosts(response.data);
        } catch (error) {
            setError('Failed to load posts');
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = () => {
        fetchPosts();
    };

    const handlePostUpdated = () => {
        fetchPosts();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <PostForm onPostCreated={handlePostCreated} />

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
                        <p className="text-gray-500">Be the first to share something!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <Post
                            key={post.id}
                            post={post}
                            onPostUpdated={handlePostUpdated}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Feed; 