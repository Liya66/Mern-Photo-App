import GalleryItem from '../galleryItem/galleryItem'
import Skeleton from '../skeleton/skeleton'
import './gallery.css'
import { useInfiniteQuery } from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest'
import InfiniteScroll from 'react-infinite-scroll-component'

const Gallery = ({ search, userId, boardId }) => {
    const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
        queryKey: ['pins', search, userId, boardId],
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams();
            if (pageParam) params.set('cursor', pageParam);
            if (search) params.set('search', search);
            if (userId) params.set('userId', userId);
            if (boardId) params.set('boardId', boardId);
            const res = await apiRequest.get(`/pins?${params.toString()}`);
            return res.data;
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    if (status === 'pending') return <Skeleton />;
    if (status === 'error') return <div>Something went wrong!</div>;

    const allPins = data.pages.flatMap((page) => page.pins);

    return (
        <InfiniteScroll
            dataLength={allPins.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<Skeleton />}
        >
            <div className='gallery'>
                {allPins.map(item => (
                    <GalleryItem key={item._id} item={item} />
                ))}
            </div>
        </InfiniteScroll>
    )
}

export default Gallery
