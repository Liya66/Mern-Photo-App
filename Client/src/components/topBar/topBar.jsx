import UserButton from '../userButton/userButton'
import './topBar.css'
import Image from '../image/image'
import { useNavigate } from 'react-router'

const TopBar = () => {
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const search = e.target.search.value;
        if (search) {
            navigate(`/search?search=${search}`);
        }
    };

    return (
        <div className='topBar'>
            <form className='search' onSubmit={handleSearch}>
                <Image path="/general/search.svg" alt="" />
                <input type="text" name="search" placeholder='Search' />
            </form>
            <UserButton />
        </div>
    )
}

export default TopBar
