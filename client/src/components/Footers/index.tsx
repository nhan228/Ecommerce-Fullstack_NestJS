import React from 'react';
import "./footer.scss"
import { useTranslation } from 'react-i18next'
import pictures from '@/pictures'

export default function Footer({handleBackToTop}: any) {
  const { t } = useTranslation();
  return (
    <footer>
      <section className="back-top" onClick={ handleBackToTop }>
        <p>Back to top</p>
      </section>
      <section className="footer-first-shortcut-links">
        <div>
          <p>Get to Know Us</p>
          <div className="links">
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">About Amazon</a>
            <a href="#">Investor Relations</a>
            <a href="#">Amazon Devices</a>
            <a href="#">Amazon Science</a>
          </div>
        </div>
        <div>
          <p>Make Money with Us</p>
          <div className="links">
            <a href="#">Sell products on Amazon</a>
            <a href="#">Sell on Amazon Business</a>
            <a href="#">Sell apps on Amazon</a>
            <a href="#">Become an Affiliate</a>
            <a href="#">Advertise Your Products</a>
            <a href="#">Self-Publish with Us</a>
            <a href="#">Host an Amazon Hub</a>
            <a href="#">
              <i className="fa-solid fa-caret-right" />
              See More Make Money <br /> with Us
            </a>
          </div>
        </div>
        <div>
          <p>Amazon Payment Products</p>
          <div className="links">
            <a href="#">Amazon Business Card</a>
            <a href="#">Shop with Points</a>
            <a href="#">About Amazon</a>
            <a href="#">Reload Your Balance</a>
            <a href="#">Amazon Currency Converter</a>
          </div>
        </div>
        <div>
          <p>Let Us Help You</p>
          <div className="links">
            <a href="#">
              Amazon and COVID-
              <br />
              19
            </a>
            <a href="#">Your Account</a>
            <a href="#">Your Orders</a>
            <a href="#">
              Shipping Rates &amp; <br />
              Policies
            </a>
            <a href="#">
              Returns &amp; <br />
              Replacements
            </a>
            <a href="#">
              Manage Your <br /> Content and Devices
            </a>
            <a href="#">Amazon Assistant</a>
            <a href="#">Help</a>
          </div>
        </div>
      </section>
      <section className="footer-middle-section">
        <div className="items">
          <div className="footer-logo">
            <img src={pictures.logo} alt="logo"/>
          </div>
          <div className="btns">
            <button>
              <i className="fa-solid fa-globe" />
              <p>English</p>
            </button>
            <button>
              <span>$</span>
              <p>USD - U.S. Dollar</p>
            </button>
            <button>
              <img src={pictures.flagEN} />
              <p>United States</p>
            </button>
          </div>
        </div>
      </section>
      <section className="footer-shortcut-links">
        <div className="links">
          <div>
            <a href="#">
              <p>Amazon Music</p>
              Stream millions of songs
            </a>
          </div>
          <div>
            <a href="#">
              <p>Amazon Advertising</p>
              Find, attract, and engage customers
            </a>
          </div>
          <div>
            <a href="#">
              <p>6pm</p>
              Score deals on fashion brands
            </a>
          </div>
          <div>
            <a href="#">
              <p>AbeBooks</p>
              Books, art &amp; collectibles
            </a>
          </div>
          <div>
            <a href="#">
              <p>ACX</p>
              Audiobook Publishing Made Easy
            </a>
          </div>
          <div>
            <a href="#">
              <p>Sell on Amazon</p>
              Start a Selling Account
            </a>
          </div>
          <div>
            <a href="#">
              <p>Amazon Business</p>
              Everything For Your Business
            </a>
          </div>
          <div>
            <a href="#">
              <p>AmazonGlobal</p>
              Ship Orders Internationally
            </a>
          </div>
          <div>
            <a href="#">
              <p>Home Services</p>
              Experienced Pros Happiness Guarantee
            </a>
          </div>
          <div>
            <a href="#">
              <p>Amazon Ignite</p>
              Sell your original Digital Educational Resources
            </a>
          </div>
          <div>
            <a href="#">
              <p>Amazon Web Services</p>
              Scalable Cloud Computing Services
            </a>
          </div>
          <div>
            <a href="#">
              <p>Audible</p>
              Listen to Books &amp; Original Audio Performances
            </a>
          </div>
          <div>
            <a href="#">
              <p>Book Depository</p>
              Books With Free Delivery Worldwide
            </a>
          </div>
          <div>
            <a href="#">
              <p>Box Office Mojo</p>
              Find Movie Box Office Data
            </a>
          </div>
          <div>
            <a href="#">
              <p>ComiXology</p>
              Thousands of Digital Comics
            </a>
          </div>
          <div>
            <a href="#">
              <p>DPReview</p>
              Digital Photography
            </a>
          </div>
          <div>
            <a href="#">
              <p>Fabric</p>
              Sewing, Quilting &amp; Knitting
            </a>
          </div>
          <div>
            <a href="#">
              <p>Goodreads</p>
              Book reviews &amp; recommendations
            </a>
          </div>
          <div>
            <a href="#">
              <p>IMDb</p>
              Movies, TV &amp; Celebrities
            </a>
          </div>
          <div>
            <a href="#">
              <p>IMDbPro</p>
              Get Info Entertainment Professionals Need
            </a>
          </div>
          <div>
            <a href="#">
              <p>Kindle Direct Publishing</p>
              Indie Digital &amp; Print Publishing Made Easy
            </a>
          </div>
          <div>
            <a href="#">
              <p>Prime Video Direct</p>
              Video Distribution Made Easy
            </a>
          </div>
          <div>
            <a href="#">
              <p>Shopbop</p>
              Designer Fashion Brands
            </a>
          </div>
          <div>
            <a href="#">
              <p>Woot!</p>
              Deals and Shenanigans
            </a>
          </div>
          <div>
            <a href="#">
              <p>Zappos!</p>
              Shoes &amp; Clothing
            </a>
          </div>
          <div>
            <a href="#">
              <p>Ring</p>
              Smart Home Security Systems
            </a>
          </div>
          <div>
            <a href="#">
              <p>eero WiFi</p>
              Stream 4K Video in Every Room
            </a>
          </div>
          <div>
            <a href="#">
              <p>Blink</p>
              Smart Security for Every Home
            </a>
          </div>
          <div>
            <a href="#">
              <p>Neighbors App</p>
              Real-Time Crime &amp; Safety Alerts
            </a>
          </div>
          <div>
            <a href="#">
              <p>Amazon Subscription Boxes</p>
              Top subscription boxes – right to your door
            </a>
          </div>
          <div>
            <a href="#">
              <p>PillPack</p>
              Pharmacy Simplified
            </a>
          </div>
        </div>
      </section>
      <section className="copyright-section">
        <div className="important-links">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
        </div>
        <p className="copyright">© Design by Nhantech ^^</p>
      </section>
    </footer>
  )
}
