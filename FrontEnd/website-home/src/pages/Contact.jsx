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
              <li>GitHub</li>
              <li>Stack Overflow</li>
              <li>Leetcode</li>
              <li>LinkedIn</li>
              <li>Upwork</li>
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
          <form action="">
            <div className='FullW'>
              <input type="text" name="name" id="name" placeholder='Your Name' />
              <input type="email" name="email" id="email" placeholder='Your Email' />
            </div>
            <div className='FullW'>
              <input type="text" name="subject" id="subject" placeholder='Subject' />
            </div>
            <textarea className='FullW' name="message" cols="30" rows="10" placeholder='Message..'></textarea>
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