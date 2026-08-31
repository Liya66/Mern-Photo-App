import './postPage.css'
import Image from '../../components/image/image'
import PostInteractions from '../../components/postInteractions/postInteractions'
import { Link, useParams, useNavigate } from 'react-router'
import Comments from '../../components/comments/comments'
import { useQuery } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest'

const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isPending, error } = useQuery({
        queryKey: ['pin', id],
        queryFn: async () => {
            const res = await apiRequest.get(`/pins/${id}`);
            return res.data;
        },
    });

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Something went wrong!</div>;

    return (
        <div className='postPage'>
            <svg
                height="20"
                viewBox="0 0 24 24"
                width="20"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(-1)}
            >
                <path d="M8.41 4.59a2 2 0 1 1 2.83 2.82L8.66 10H21a2 2 0 0 1 0 4H8.66l2.58 2.59a2 2 0 1 1-2.82 2.82L1 12z"></path>
            </svg>
            <div className="postContainer">
                <div className="postImg">
                    <Image path={data.media} alt="" w={736} />
                </div>
                <div className="postDetails">
                    <PostInteractions pinId={data._id} />
                    <Link to={`/${data.user.username}`} className='postUser'>
                        <Image path={data.user.img || '/general/noAvatar.png'} />
                        <span>{data.user.displayName}</span>
                    </Link>
                    <h2>{data.title}</h2>
                    <p>{data.description}</p>
                    {data.link && (
                        <a href={data.link} target="_blank" rel="noopener noreferrer">
                            {data.link}
                        </a>
                    )}
                    <Comments pinId={data._id} />
                </div>
            </div>
        </div>
    )
}

export default PostPage
