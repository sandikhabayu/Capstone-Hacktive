import './Footer.css';

const Footer = () => {
  return (
    <footer>
        <div className='container'>
            <div>
                <h2>Newsip</h2>
                <p>Newsip is a digital news platform that provides the latest, most accurate, and most in-depth information. We cover a wide range of topics, from politics and economics to technology and lifestyle.</p>
            </div>
            <div>
                <h2>Contact</h2>
                <p>Email: newsipxxx@example.com</p>
                <p>Phone: +1 (123) 456-7890</p>
            </div>
            <div>
                <h2>Explore</h2>
            </div>
        </div>
        <div className='footer-bottom'>
            <p>&copy; {new Date().getFullYear()} Newsip. All rights reserved.</p>
        </div>
    </footer>
  );
}

export default Footer;