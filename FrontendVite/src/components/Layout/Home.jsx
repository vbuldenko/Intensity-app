export default function Home() {
    const values = [
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
                'Бажаний результат, залежить від системного підходу та дисципліни. Завдяки цьому ми формуємо здорові звички',
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
            value: 'Розвиток та інноваційність',
            description:
                'Ми постійно слідкуємо за новими тенденціями, додаємо нові види занять, а тренери постійно підвищують свою кваліфікацію',
        },
    ];
    const rules = [
        'Дотримуватися особистої та загальної гігієни',
        'Ставитися з повагою до тренерів студії, та інших відвідувачів.',
        'Використовувати змінні взуття та одяг. Одяг має бути чистим та зручним',
        'Попередній запис обов’язковий (відбувається на сайті через вхід в особистий кабінет)',
        'Cкасувати реєстрацію на групове заняття можна не пізніше ніж за 3 години до його початку. На ранкові тренування запис відбувається до 21 години',
    ];

    return (
        <section className="main-section">
            <div className="hero card-el-bg">
                <h1 className="l-font align-left">Fitness Studio</h1>
                <p className="hero-name">INTENSITY</p>
                <h2 className="m-font align-right">Health·Strength·Energy</h2>
                <p className="s-font align-center">
                    Покращуємо якість життя, без шкоди для здоров'я!
                </p>
                {/* <button>Look for details</button> */}
            </div>
            <div className="flex-column">
                <h1 className="l-font ">Наші цінності</h1>
                <div className="info">
                    {values.map((value, index) => (
                        <div key={index} className="card-el-bg flex-col">
                            <h2 className="m-font">{value.value}</h2>
                            <p className="s-font gray-clr">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-column">
                <h1 className="l-font ">Правила студії</h1>
                <div className="info">
                    {rules.map((rule, index) => (
                        <div key={index} className="card-el-bg flex-col">
                            <p className="s-font">{rule}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
