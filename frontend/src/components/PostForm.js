import React, { useState } from 'react';
import { postsAPI } from '../services/api';

const PostForm = ({ onPostCreated }) => {
    const [formData, setFormData] = useState({
        content: '',
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content.trim() && !selectedImage) {
            setError('Please add some content or an image to your post');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await postsAPI.createPost({
                content: formData.content,
                image: selectedImage,
            });

            setFormData({ content: '' });
            setSelectedImage(null);
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (error) {
            setError(error.response?.data?.detail || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mb-8 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Create a Post</h3>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                        What's on your mind?
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows="4"
                        className="form-input resize-none"
                        placeholder="Share your thoughts..."
                    />
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                        Add an Image (Optional)
                    </label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                {selectedImage && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-blue-700 font-semibold">
                            Selected image: {selectedImage.name}
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Creating post...
                        </div>
                    ) : (
                        'Create Post'
                    )}
                </button>
            </form>
        </div>
    );
};

export default PostForm; 