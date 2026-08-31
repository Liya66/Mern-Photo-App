import './profilePage.css'
import Image from '../../components/image/image'
import { useState } from 'react'
import Collections from '../../components/collections/collections'
import Gallery from '../../components/gallery/gallery'
import FollowButton from '../../components/followButton/followButton'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest'
import useAuthStore from '../../utils/authStore'

const ProfilePage = () => {
    const [type, setType] = useState('created');
    const { username } = useParams();
    const currentUser = useAuthStore((state) => state.currentUser);

    const { data, isPending, error } = useQuery({
        queryKey: ['profile', username],
        queryFn: async () => {
            const res = await apiRequest.get(`/users/${username}`);
            return res.data;
        },
    });

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>User not found!</div>;

    const isOwnProfile = currentUser?._id === data._id;

    return (
        <div className='profilePage'>
            <Image
                w={100}
                h={100}
                path={data.img || '/general/noAvatar.png'}
                alt=''
            />
            <h1 className='profileName'>{data.displayName}</h1>
            <span className='profileUsername'>@{data.username}</span>
            <div className="followCounts">
                {data.followerCount} followers · {data.followingCount} following
            </div>
            <div className="profileInteractions">
                <Image path='/general/share.svg' />
                <div className="profileButtons">
                    {!isOwnProfile && currentUser && (
                        <FollowButton
                            username={data.username}
                            isFollowing={data.isFollowing}
                        />
                    )}
                </div>
                <Image path='/general/more.svg' />
            </div>
            <div className="profileOptions">
                <span
                    onClick={() => setType('created')}
                    className={type === 'created' ? 'active' : ''}
                >
                    Created
                </span>
                <span
                    onClick={() => setType('saved')}
                    className={type === 'saved' ? 'active' : ''}
                >
                    Saved
                </span>
            </div>
            {type === 'created' ? (
                <Gallery userId={data._id} />
            ) : (
                <Collections userId={data._id} />
            )}
        </div>
    )
}

export default ProfilePage
