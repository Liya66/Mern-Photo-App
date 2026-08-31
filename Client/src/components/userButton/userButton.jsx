import { useState } from "react";
import './userButton.css'
import Image from "../image/image";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../../utils/authStore";
import apiRequest from "../../utils/apiRequest";

const UserButton = () => {
    const [open, setOpen] = useState(false);
    const currentUser = useAuthStore((state) => state.currentUser);
    const removeCurrentUser = useAuthStore((state) => state.removeCurrentUser);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apiRequest.post("/users/auth/logout");
            removeCurrentUser();
            navigate("/auth");
        } catch (err) {
            console.log(err);
        }
    };

    return currentUser ? (
        <div className="userButton">
            <Image
                path={currentUser.img || "/general/noAvatar.png"}
                alt=""
            />
            <Image
                onClick={() => setOpen(prev => !prev)}
                path="/general/arrow.svg"
                alt=""
                className='arrow'
            />
            {open && (
                <div className='userOptions'>
                    <Link to={`/${currentUser.username}`} className="userOption">
                        Profile
                    </Link>
                    <div className="userOption">Settings</div>
                    <div className="userOption" onClick={handleLogout}>
                        Logout
                    </div>
                </div>
            )}
        </div>
    ) : (
        <Link to="/auth" className="loginLink">Login / Sign up</Link>
    )
}

export default UserButton
