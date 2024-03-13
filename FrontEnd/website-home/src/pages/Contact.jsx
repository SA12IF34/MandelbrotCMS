import React from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import Header from './components/Header';
import '../Contact.css';
import '../App.css';

function Contact() {
  return (
    <div className='ContactPage'>
      <Header title={'Contact'} />
      <main>
        <div className='Accounts'>
          <h2>You can find me on</h2>
          <br />
          <div>
            <ul>
              <li><a style={{color: 'black'}} href="http://github.com/SA12IF34" target="_blank" >GitHub</a></li>
              {/* <li>Stack Overflow</li> */}
              {/* <li>Leetcode</li> */}
              <li><a style={{color: 'black'}} href="https://medium.com/@saifchan" target='_blank'>Medium</a></li>
              <li><a style={{color:'black'}} href="http://www.linkedin.com/in/saifchan" target="_blank">LinkedIn</a></li>
              <li><a style={{color: 'black'}} href="http://www.upwork.com/freelancers/~01ef34f2c2b3e1bcb1" target='_blank'>Upwork</a></li>
            </ul>
          </div>
        </div>
        <div className='Info'>
          <h2>You can contact me over</h2>
          <br />
          <div>
            <span>Phone No. +962799562745</span>
            <span>Email saifchan@mail.com</span>
          </div>
        </div>
        <div className='Form'>
          <h2>Say Hello</h2>
          <br />
          <form action="https://api.web3forms.com/submit" method="POST">
            <input type="hidden" name="access_key" value="a51e0962-12dd-43c9-8339-021ca55d9582" />
            <input type="hidden" name="redirect" value="https://saifchan.online/" />
            <div className='FullW'>
              <input type="text" name="First Name" id="name" required placeholder='Your Name' />
              <input type="email" name="email" id="email" required placeholder='Your Email' />
            </div>
            <div className='FullW'>
              <input type="text" name="subject" id="subject" required placeholder='Subject' />
            </div>
            <textarea className='FullW' name="content" required cols="30" rows="10" placeholder='Message..'></textarea>
            <input type="submit" value="Send" />
          </form>
        </div>
        <div className='bg'>
          <div className='RightBg'></div>
          <div className='LeftBg'></div>
        </div>
      </main>
    </div>
  )
}

export default Contact;