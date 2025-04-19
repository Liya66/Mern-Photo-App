import GalleryItem from '../galleryItem/galleryItem'
import './gallery.css'

//temp data
const items = [
    {
        id: 1,
        media: "pins/pin1.heic",
        width: 1250,
        height: 1000,
    },
    {
        id: 2,
        media: "pins/pin2.jpg",
        width: 1250,
        height: 1800,
    },
    {
        id: 3,
        media: "pins/pin3.jpg",
        width: 1250,
        height: 1400,
    },
    {
        id: 4,
        media: "pins/pin4.JPG",
        width: 1250,
        height: 1700,
    },
    {
        id: 5,
        media: "pins/pin5.JPG",
        width: 1250,
        height: 700,
    },
    {
        id: 6,
        media: "pins/pin6.JPG",
        width: 1250,
        height: 1000,
    },
    {
        id: 7,
        media: "pins/pin7.JPG",
        width: 1250,
        height: 1600,
    },

    {
        id: 8,
        media: "pins/pin8.JPG",
        width: 1250,
        height: 1000,
    },
    {
        id: 9,
        media: "pins/pin9.JPG",
        width: 1250,
        height: 1500,
    },
    {
        id: 10,
        media: "pins/pin10.JPG",
        width: 1250,
        height: 1000,
    },
    {
        id: 11,
        media: "pins/pin11.JPG",
        width: 1250,
        height: 1750,
    },
    {
        id: 12,
        media: "pins/pin12.JPG",
        width: 1250,
        height: 1400,
    },
    {
        id: 13,
        media: "pins/pin13.JPG",
        width: 1250,
        height: 1000,
    },
    {
        id: 14,
        media: "pins/pin14.JPG",
        width: 1250,
        height: 1100,
    },
    {
        id: 15,
        media: "pins/pin15.JPG",
        width: 1250,
        height: 800,
    },
    {
        id: 16,
        media: "pins/pin16.JPG",
        width: 1250,
        height: 1400,
    },
    {
        id: 17,
        media: "pins/pin17.JPG",
        width: 1250,
        height: 1600,
    },
    {
        id: 18,
        media: "pins/pin18.JPG",
        width: 1250,
        height: 1000,
    },
    {
        id: 19,
        media: "pins/pin19.JPG",
        width: 1250,
        height: 1000,
    },
    {
        id: 20,
        media: "pins/pin20.JPG",
        width: 1250,
        height: 1800,
    },
    {
        id: 21,
        media: "pins/pin21.JPG",
        width: 1250,
        height: 1000,
    },
    {
        id: 22,
        media: "pins/pin22.JPG",
        width: 1250,
        height: 1000,
    }
    ,
    {
        id: 23,
        media: "pins/pin23.JPG",
        width: 1250,
        height: 800,
    }
    ,
    {
        id: 24,
        media: "pins/pin24.JPG",
        width: 850,
        height: 1600,
    }
    ,
    {
        id: 25,
        media: "pins/pin25.jpg",
        width: 1250,
        height: 600,
    }
    ,
    {
        id: 26,
        media: "pins/pin26.jpg",
        width: 1250,
        height: 700,
    }
]

const Gallery = () => {
    return (
        <div className='gallery'>
            {
                items.map(item => (<GalleryItem key={item.id} item={item} />))
            }
        </div>
    )
}

export default Gallery