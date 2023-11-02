import './styles/home.css';
import background from '../images/home_background.jpg';

function Home() {
    return (
        <section
            style={{ backgroundImage: `url(${background})` }}
            className="home-section"
        >
            <div className="intensity-hero">
                {/* <p>welcome to</p> */}
                <h1>INTENSITY</h1>
                <h3>FITNESS AND DANSE STUDIO</h3>
                <div>
                    <h2>A place of your health, strength and energy</h2>
                    <button>Look for details</button>
                </div>
            </div>
        </section>
    );
}

export default Home;
