import './collections.css'
import Image from '../image/image'
import { useQuery } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest'
import { Link } from 'react-router'
import { format } from 'timeago.js'

const Collections = ({ userId }) => {
    const { data, isPending } = useQuery({
        queryKey: ['boards', userId],
        queryFn: async () => {
            const res = await apiRequest.get(`/boards/${userId}`);
            return res.data;
        },
    });

    if (isPending) return <div>Loading...</div>;
    if (!data || data.length === 0) return <div>No boards yet</div>;

    return (
        <div className='collections'>
            {data.map((board) => (
                <Link
                    to={`/search?boardId=${board._id}`}
                    className="collection"
                    key={board._id}
                >
                    <Image
                        path={board.firstPin || '/general/noAvatar.png'}
                        alt=''
                    />
                    <div className="collectionInfo">
                        <h1>{board.title}</h1>
                        <span>
                            {board.pinCount} Pins · {format(board.createdAt)}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Collections
