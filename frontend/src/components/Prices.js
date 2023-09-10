import './styles/prices.css';
import group from '../images/group.webp';
import indiv from '../images/indiv.jpg';
import kids from '../images/kids.webp';

function Prices() {
    return (
        <section className="prices-section">
            <div className="prices-subsection">
                <span>Group classes</span>
                <img src={group} />
                <div className="abonements">
                    <div>
                        <p>Test</p>
                        <p>₴350</p>
                    </div>
                    <div>
                        <p>4 classes</p>
                        <p>₴1300</p>
                        <p>225</p>
                    </div>
                    <div>
                        <p>6 classes</p>
                        <p>₴1800</p>
                        <p>225</p>
                    </div>
                    <div>
                        <p>8 classes</p>
                        <p>₴2200</p>
                        <p>225</p>
                    </div>
                    <div>
                        <p>10 classes</p>
                        <p>₴2500</p>
                        <p>225</p>
                    </div>
                    <div>
                        <p>12 classes</p>
                        <p>₴2700</p>
                        <p>225</p>
                    </div>
                    <div>
                        <p>Unlimited</p>
                        <p>₴4500</p>
                    </div>
                </div>
            </div>
            <div className="prices-subsection">
                <span>Individual trainings</span>
                <img src={indiv} />
                <div className="abonements">
                    <div>
                        <p>1 training</p>
                        <p>₴600</p>
                    </div>
                    <div>
                        <p>5 trainings</p>
                        <p>₴2700</p>
                        <p>225</p>
                    </div>
                    <div>
                        <p>10 trainings</p>
                        <p>₴5500</p>
                        <p>225</p>
                    </div>
                </div>
            </div>
            <div className="prices-subsection">
                <span>Children groups</span>
                <img src={kids} />
                <div className="abonements">
                    <div>
                        <p>1 training</p>
                        <p>₴250</p>
                    </div>
                    <div>
                        <p>8 trainings</p>
                        <p>₴1000</p>
                        <p>225</p>
                    </div>
                    <div>
                        <p>12 trainings</p>
                        <p>₴1500</p>
                        <p>225</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Prices;
