import { FaArrowRight } from 'react-icons/fa6';

import '../../App.css';

function SideBar({className, setClassName}: {className:string, setClassName: any}) {
  return (
    <aside className={className}>
        <div>
        <FaArrowRight onClick={() => {setClassName('')}} />
        </div>
        <div className='User'>
            <h2>You</h2>
            <ul>
                <li><a href="/profile/">Profile</a></li>
            </ul>
        </div>
        <div className='Owner'>
            <h2>SaifChan</h2>
            <ul>
                <li><a href="https://saifchan.online/about/">About</a></li>
                <li><a href="https://saifchan.online/contact/">Contact</a></li>
                <li><a href="https://saifchan.online/skills/">Skills</a></li>
                <li><a href="https://saifchan.online/portfolio/">Portfolio</a></li>
            </ul>
        </div>
    </aside>
  )
}

export default SideBar;