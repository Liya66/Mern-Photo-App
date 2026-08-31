import './createPage.css'
import Image from '../../components/image/image'
import Editor from '../../components/editor/editor'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest'
import useAuthStore from '../../utils/authStore'
import useEditorStore from '../../utils/editorStore'

const BoardForm = ({ onClose, onCreated }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const title = e.target.title.value.trim();
        if (title) {
            onCreated(title);
            onClose();
        }
    };

    return (
        <div className="boardForm" onClick={onClose}>
            <div className="boardFormContainer" onClick={(e) => e.stopPropagation()}>
                <span className="boardFormClose" onClick={onClose}>✕</span>
                <h1>Create Board</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Board name" required />
                    <button type="submit">Create</button>
                </form>
            </div>
        </div>
    )
};

const CreatePage = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [boardFormOpen, setBoardFormOpen] = useState(false);
    const [newBoard, setNewBoard] = useState('');
    const [error, setError] = useState('');
    const fileRef = useRef(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentUser = useAuthStore((s) => s.currentUser);
    const textOptions = useEditorStore((s) => s.textOptions);
    const resetStore = useEditorStore((s) => s.resetStore);

    const { data: boards } = useQuery({
        queryKey: ['formBoards'],
        queryFn: async () => {
            if (!currentUser) return [];
            const res = await apiRequest.get(`/boards/${currentUser._id}`);
            return res.data;
        },
        enabled: !!currentUser,
    });

    const mutation = useMutation({
        mutationFn: async (formData) => {
            return apiRequest.post('/pins', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            resetStore();
            queryClient.invalidateQueries({ queryKey: ['pins'] });
            navigate('/');
        },
        onError: (err) => {
            setError(err.response?.data || 'Something went wrong!');
        },
    });

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) return setError('Please select an image!');

        const formData = new FormData();
        formData.append('media', file);
        formData.append('title', e.target.title.value);
        formData.append('description', e.target.description.value);
        formData.append('link', e.target.link.value);
        formData.append('tags', e.target.tags.value);

        if (newBoard) {
            formData.append('newBoard', newBoard);
        } else if (e.target.board.value) {
            formData.append('board', e.target.board.value);
        }

        if (textOptions) {
            formData.append('textOptions', JSON.stringify(textOptions));
        }

        mutation.mutate(formData);
    };

    return (
        <div className='createPage'>
            {editorOpen && (
                <Editor
                    previewUrl={previewUrl}
                    onClose={() => setEditorOpen(false)}
                />
            )}
            {boardFormOpen && (
                <BoardForm
                    onClose={() => setBoardFormOpen(false)}
                    onCreated={(title) => setNewBoard(title)}
                />
            )}
            <form onSubmit={handleSubmit}>
                <div className="createTop">
                    <h1>Create Pin</h1>
                    <button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
                <div className="createBottom">
                    {previewUrl ? (
                        <div className="preview">
                            <img src={previewUrl} alt="preview" />
                            <div
                                className="editIcon"
                                onClick={() => setEditorOpen(true)}
                            >
                                <Image path="/general/edit.svg" alt="" />
                            </div>
                        </div>
                    ) : (
                        <div
                            className="upload"
                            onClick={() => fileRef.current.click()}
                        >
                            <div className="uploadTitle">
                                <Image path='/general/upload.svg' />
                            </div>
                            <div className="uploadInfo">
                                We recommend using high quality .jpg files less than 20 MB
                            </div>
                        </div>
                    )}
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        hidden
                    />
                    <div className='createForm'>
                        <div className="createFormItem">
                            <label htmlFor="title">Title</label>
                            <input type="text"
                                placeholder='Add a title'
                                name='title' id='title' required />
                        </div>
                        <div className="createFormItem">
                            <label htmlFor="description">Description</label>
                            <input type="text"
                                placeholder='Add a detailed description'
                                name='description'
                                id='description' required />
                        </div>
                        <div className="createFormItem">
                            <label htmlFor="link">Link</label>
                            <input type="text"
                                placeholder='Add a link'
                                name='link'
                                id='link' />
                        </div>
                        <div className="createFormItem">
                            <label htmlFor="board">Board</label>
                            {newBoard ? (
                                <div className="newBoard">
                                    <div className="newBoardContainer">
                                        <span className="newBoardItem">{newBoard}</span>
                                    </div>
                                    <span
                                        style={{ cursor: 'pointer', fontSize: '13px', color: 'gray' }}
                                        onClick={() => setNewBoard('')}
                                    >
                                        ✕
                                    </span>
                                </div>
                            ) : (
                                <select name='board' id='board'>
                                    <option value="">Choose a board</option>
                                    {boards?.map((b) => (
                                        <option key={b._id} value={b._id}>
                                            {b.title}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <button
                                type="button"
                                className="createBoardButton"
                                onClick={() => setBoardFormOpen(true)}
                            >
                                + Create board
                            </button>
                        </div>
                        <div className="createFormItem">
                            <label htmlFor="tags">Tagged topics</label>
                            <input type="text"
                                placeholder='Add tags (comma separated)'
                                name='tags'
                                id='tags' />
                            <small>Don't worry, people won't see your tags</small>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreatePage
