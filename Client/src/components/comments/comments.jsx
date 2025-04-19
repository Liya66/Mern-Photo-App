import './comments.css'
import Image from '../image/image'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
const Comments = () => {
    const [open, setOpen] = useState(false);
    return (


        <div className='comments'>
            <div className="commentList">
                <span className='commentCount'>5 comments</span>
                {/* comment */}
                <div className="comment">
                    <Image path="/general/noAvatar.png" alt="" />
                    <div className="commentContent">
                        <span className='commentUsername'>Li Hua</span>
                        <p className='commentText'>
                            This is such a lovely photo!Absolutely love it!
                        </p>
                        <span className='commentTime'>1h</span>
                    </div>
                </div>
                <div className="comment">
                    <Image path="/general/noAvatar.png" alt="" />
                    <div className="commentContent">
                        <span className='commentUsername'>Li Hua</span>
                        <p className='commentText'>
                            This is such a lovely photo!Absolutely love it!
                        </p>
                        <span className='commentTime'>1h</span>
                    </div>
                </div>
                <div className="comment">
                    <Image path="/general/noAvatar.png" alt="" />
                    <div className="commentContent">
                        <span className='commentUsername'>Li Hua</span>
                        <p className='commentText'>
                            This is such a lovely photo!Absolutely love it!
                        </p>
                        <span className='commentTime'>1h</span>
                    </div>
                </div>
                <div className="comment">
                    <Image path="/general/noAvatar.png" alt="" />
                    <div className="commentContent">
                        <span className='commentUsername'>Li Hua</span>
                        <p className='commentText'>
                            This is such a lovely photo!Absolutely love it!
                        </p>
                        <span className='commentTime'>1h</span>
                    </div>
                </div>
                <div className="comment">
                    <Image path="/general/noAvatar.png" alt="" />
                    <div className="commentContent">
                        <span className='commentUsername'>Li Hua</span>
                        <p className='commentText'>
                            This is such a lovely photo!Absolutely love it!
                        </p>
                        <span className='commentTime'>1h</span>
                    </div>
                </div>

            </div>
            <form className='commentForm'>
                <input type="text" placeholder="Add a comment" />
                <div className="emoji">
                    <div onClick={() => setOpen(prev => !prev)}>😄</div>
                    {open && <div className="emojiPicker">
                        <EmojiPicker />
                    </div>}
                </div>
            </form>
        </div>
    )
}

export default Comments