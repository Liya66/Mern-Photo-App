import './settingsPage.css'
import Image from '../../components/image/image'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest'
import useAuthStore from '../../utils/authStore'

const SettingsPage = () => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const updateCurrentUser = useAuthStore((s) => s.updateCurrentUser);
    const navigate = useNavigate();
    const fileRef = useRef(null);

    const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    if (!currentUser) {
        navigate('/auth');
        return null;
    }

    const mutation = useMutation({
        mutationFn: async (formData) => {
            return apiRequest.put('/users', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: (res) => {
            updateCurrentUser(res.data);
            setAvatarFile(null);
            setAvatarPreview(null);
            setError('');
            setSuccess('Profile updated!');
            setTimeout(() => setSuccess(''), 3000);
        },
        onError: (err) => {
            setSuccess('');
            setError(err.response?.data || 'Something went wrong!');
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('displayName', displayName);
        if (avatarFile) formData.append('img', avatarFile);
        mutation.mutate(formData);
    };

    const handleReset = () => {
        setDisplayName(currentUser.displayName);
        setAvatarFile(null);
        setAvatarPreview(null);
        setError('');
        setSuccess('');
    };

    return (
        <div className="settingsPage">
            <h1>Edit Profile</h1>
            <form className="settingsForm" onSubmit={handleSubmit}>
                <div className="avatarSection">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="" className="avatarPreview" />
                    ) : (
                        <Image
                            path={currentUser.img || '/general/noAvatar.png'}
                            alt=""
                            w={80}
                            h={80}
                            className="avatarPreview"
                        />
                    )}
                    <div className="avatarActions">
                        <button type="button" onClick={() => fileRef.current.click()}>
                            Change photo
                        </button>
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        hidden
                    />
                </div>
                <div className="settingsFormItem">
                    <label htmlFor="displayName">Name</label>
                    <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                </div>
                <div className="settingsFormItem">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={currentUser.username}
                        disabled
                    />
                </div>
                <div className="settingsFormItem">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={currentUser.email}
                        disabled
                    />
                </div>
                {success && <p className="settingsSuccess">{success}</p>}
                {error && <p className="settingsError">{error}</p>}
                <div className="settingsActions">
                    <button type="button" onClick={handleReset}>Reset</button>
                    <button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SettingsPage
