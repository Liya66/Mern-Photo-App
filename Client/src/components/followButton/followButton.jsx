import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest'

const FollowButton = ({ username, isFollowing }) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            return apiRequest.post(`/users/follow/${username}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', username] });
        },
    });

    return (
        <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
    )
}

export default FollowButton
