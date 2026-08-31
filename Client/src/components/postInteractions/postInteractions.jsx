import './postInteractions.css'
import Image from '../image/image'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest'

const PostInteractions = ({ pinId }) => {
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['interaction', pinId],
        queryFn: async () => {
            const res = await apiRequest.get(`/pins/interaction-check/${pinId}`);
            return res.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async (type) => {
            return apiRequest.post(`/pins/interact/${pinId}`, { type });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interaction', pinId] });
        },
    });

    return (
        <div className='postInteractions'>
            <div className="interactionIcons">
                <div
                    onClick={() => mutation.mutate('like')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    {data?.isLiked ? (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="#e04040">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    ) : (
                        <Image path='/general/react.svg' alt='' />
                    )}
                    <span>{data?.likeCount || 0}</span>
                </div>
                <Image path='/general/share.svg' alt='' />
                <Image path='/general/more.svg' alt='' />
            </div>
            <button
                onClick={() => mutation.mutate('save')}
                style={{
                    backgroundColor: data?.isSaved ? '#000' : '#e04040',
                    color: '#fff',
                }}
            >
                {data?.isSaved ? 'Saved' : 'Save'}
            </button>
        </div>
    )
}

export default PostInteractions
