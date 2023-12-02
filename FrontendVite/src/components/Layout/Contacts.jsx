import '../styles/Contact.css';
import {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

export default function Contacts() {
    return (
        <section className="contact-section">
            <div className="contact-subsection">
                <h2>Наші контакти</h2>
                <div>
                    <div className="content">
                        <PhoneIcon className="h-6 w-6 text-green-800" />
                        <p>+38(097)-99-100-70</p>
                    </div>
                    <div className="content">
                        <EnvelopeIcon className="h-6 w-6 text-green-800" />
                        <p>in10sity.trainer@gmail.com</p>
                    </div>
                    <div className="content">
                        <MapPinIcon className="h-6 w-6 text-green-800" />
                        <p>Volodymyra Ivasiuka Ave, 24, Kyiv, 04210</p>
                    </div>
                </div>
            </div>
            <div className="contact-subsection">
                <h2>Графік роботи</h2>
                <div>
                    <div className="content">
                        <ClockIcon className="h-6 w-6 text-green-800" />
                        <p>
                            Пн-Пт - з 9:00 до 21:00 <br /> Сб - з 9:00 до 15:00
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
