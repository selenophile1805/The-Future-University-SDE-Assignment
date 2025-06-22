import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { imagesAPI } from '../services/api';

const Profile = ({ onBackToFeed }) => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let profilePicture = user?.profile_picture;

            if (selectedImage) {
                const imageResponse = await imagesAPI.uploadImage(selectedImage);
                profilePicture = imageResponse.data.image_url;
            }

            await updateProfile({
                ...formData,
                profile_picture: profilePicture,
            });

            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setSelectedImage(null);
        } catch (error) {
            setError(error.response?.data?.detail || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            bio: user?.bio || '',
        });
        setSelectedImage(null);
        setIsEditing(false);
        setError('');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
                {onBackToFeed && (
                    <button
                        onClick={onBackToFeed}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back to Feed</span>
                    </button>
                )}
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl">
                            {user?.profile_picture ? (
                                <img
                                    src={user.profile_picture}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <label
                                htmlFor="profile-image"
                                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                            >
                                <span className="text-white text-2xl">📷</span>
                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h2>
                        <p className="text-gray-600 mb-3">{user?.email}</p>
                        {user?.bio && (
                            <p className="text-gray-700 italic leading-relaxed">{user.bio}</p>
                        )}
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-primary"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {isEditing && (
                    <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
                                {success}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    className="form-input resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            {selectedImage && (
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <p className="text-blue-700 font-semibold">
                                        Selected image: {selectedImage.name}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </div>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="btn-secondary"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile; 