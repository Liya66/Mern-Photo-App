import './skeleton.css'

const sizes = [8, 12, 10, 14, 9, 11, 15, 8, 13, 10, 16, 9, 12, 11, 8, 14, 10, 13, 9, 11, 15];

const Skeleton = () => {
    return (
        <div className='gallery'>
            {sizes.map((size, i) => (
                <div
                    key={i}
                    className='skeletonItem'
                    style={{ gridRowEnd: `span ${size}` }}
                />
            ))}
        </div>
    )
}

export default Skeleton
