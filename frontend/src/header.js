export default function Header(){
    return(
        <header className="header">
    
        <nav className="nav-header">
            <div className="logo">
               <a href="/">9ja<span>Moives</span>.com</a>
            </div>
            <div >
            <ul className="menu">
              <li ><a href="/">Home</a></li>
              <li ><a href="#">About Us</a></li>
              <li ><a href="#">terms snd Condition</a></li>
              <li ><a href="#">Contact Us</a></li>
            </ul>

            </div>
            <div>
                 <h2 className="sub-header">Sub<span>scribe</span></h2>
            </div>
            <button id="mobileMenuBtn" className="mobileMenuBtn">☰</button>
        
            <div className="mobileMenu"  id="mobileMenu">
                <ul>
                  <li ><a href="/">Home</a></li>
                  <li ><a href="#">About Us</a></li>
                  <li ><a href="#">terms snd Condition</a></li>
                  <li ><a href="#">Contact Us</a></li>
                </ul>
            </div>
        </nav>
    </header>      
    );
}