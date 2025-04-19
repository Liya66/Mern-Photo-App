import './profilePage.css'
import Image from '../../components/image/image'
import { useState } from 'react'
import Collections from '../../components/collections/collections'
import Gallery from '../../components/gallery/gallery'
const ProfilePage = () => {
    const [type, setType] = useState('saved');
    return (
        <div className='profilePage'>
            <Image
                w={100}
                h={100}
                path='/general/noAvatar.png'
                alt='' />
            <h1 className='profileName'>Joss Donna</h1>
            <span className='profileUsername'>@jossdonna</span>
            <div className="followCounts">10 followers 20 following</div>
            <div className="profileInteractions">
                < Image path='/general/share.svg' />
                <div className="profileButtons">
                    <button>Message</button>
                    <button>Follow</button>
                </div>
                < Image path='/general/more.svg' />

            </div>
            <div className="profileOptions">
                <span onClick={() => setType('created')} className={type === 'created' ? 'active' : ''}>Created</span>

                <span onClick={() => setType('saved')} className={type === 'saved' ? 'active' : ''}>Saved </span>
            </div>
            {type === 'created' ? <Gallery /> : <Collections />}
        </div>
    )
}

export default ProfilePage