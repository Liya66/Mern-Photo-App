import './comments.css'
import Image from '../image/image'
import EmojiPicker from 'emoji-picker-react'
import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest'
import useAuthStore from '../../utils/authStore'
import { format } from 'timeago.js'

const Comments = ({ pinId }) => {
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);
    const queryClient = useQueryClient();
    const currentUser = useAuthStore((state) => state.currentUser);

    const { data: comments, isPending } = useQuery({
        queryKey: ['comments', pinId],
        queryFn: async () => {
            const res = await apiRequest.get(`/comments/${pinId}`);
            return res.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async (description) => {
            return apiRequest.post('/comments', { description, pin: pinId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', pinId] });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = inputRef.current.value.trim();
        if (!text) return;
        mutation.mutate(text);
        inputRef.current.value = '';
    };

    const handleEmoji = (emojiObj) => {
        inputRef.current.value += emojiObj.emoji;
        setOpen(false);
    };

    return (
        <div className='comments'>
            <div className="commentList">
                <span className='commentCount'>
                    {isPending ? '...' : `${comments.length} comments`}
                </span>
                {!isPending && comments.map((comment) => (
                    <div className="comment" key={comment._id}>
                        <Image
                            path={comment.user.img || "/general/noAvatar.png"}
                            alt=""
                        />
                        <div className="commentContent">
                            <span className='commentUsername'>
                                {comment.user.displayName}
                            </span>
                            <p className='commentText'>{comment.description}</p>
                            <span className='commentTime'>
                                {format(comment.createdAt)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {currentUser && (
                <form className='commentForm' onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Add a comment"
                    />
                    <div className="emoji">
                        <div onClick={() => setOpen(prev => !prev)}>😄</div>
                        {open && (
                            <div className="emojiPicker">
                                <EmojiPicker onEmojiClick={handleEmoji} />
                            </div>
                        )}
                    </div>
                </form>
            )}
        </div>
    )
}

export default Comments
