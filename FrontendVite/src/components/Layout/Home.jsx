import { useState } from 'react';
import '../styles/home.css';

function Home() {
    const [values, setValues] = useState([
        {
            value: 'Здоровʼя',
            description:
                'Ми прагнемо щоб кожен міг мати якісне та довге життя наповнене енергією',
        },
        {
            value: 'Безпека',
            description:
                'Ми пояснюємо кожну вправу та стежимо за дотриманням правильної техніки',
        },
        {
            value: 'Системність',
            description:
                'Бажаний результат, залежить від системного підходу та дисципліни. Ми це враховуємо щоб сформувати здорові звички',
        },
        {
            value: 'Індивідуальність',
            description:
                'Кожна людина є особливою. І ми це враховуємо на кожному тренуванні.',
        },
        {
            value: 'Культура',
            description:
                'Ми вважаємо, що повага має бути як до себе, так і до інших',
        },
        {
            value: 'Час',
            description:
                'Єдине чого завжди не вистачає. Тому кожне тренування триває 50 хвилин, оптимально щоб тримати себе в формі',
        },
        {
            value: 'Розвиток та інноваційність',
            description:
                'Ми постійно слідкуємо за новими тенденціями, додаємо нові види занять, а тренери постійно підвищують свою кваліфікацію',
        },
    ]);

    return (
        <section className="home-section">
            <div className="intensity-hero">
                {/* <p>welcome to</p> */}
                <h1>INTENSITY</h1>
                <h3>Fitness & Danse Studio</h3>
                <h2>Health.Strength.Energy</h2>
                <p>
                    Наша місія – покращувати якість життя, без шкоди для
                    здоров'я!
                </p>
                {/* <button>Look for details</button> */}
            </div>
            <div>
                <h2>Наші цінності</h2>
                <div className="home-values">
                    {values.map((value, index) => (
                        <div key={index}>
                            <h3>{value.value}</h3>
                            <p>{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Home;
