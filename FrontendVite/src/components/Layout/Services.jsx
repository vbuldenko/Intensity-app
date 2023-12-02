import '../styles/services.css';

// Services component
function Services() {
    const classes = [
        {
            title: 'Functional',
            description:
                "Силове тренування з використанням гантель, гумових еластичних стрічок та/або власної ваги тіла. Комплексно прокачує всі м'язи тіла, робота на рельєф.",
        },
        {
            title: 'Tabata',
            description:
                'Кардіо-силове інтенсивне тренування, в часових рамках. 20 секунд - вправи, 10 секунд - відпочинок. Для охочих схуднути та витратити більше ккал за час тренування.',
        },
        {
            title: 'ABS',
            description:
                "Силове тренування. Сукупність вправ на м'язи живота, стегон, сідниць та попереку.",
        },
        {
            title: 'Healthy Back',
            description:
                "Тренування низької інтенсивності, направлене на розвиток мобільності спини, легкого витяжіння та безпечного зміцнення м'язевого корсету. Корекційний та профілактичний напрямок тренувань.",
        },
        {
            title: 'Pilates',
            description:
                "Комплексне тренування спрямоване на розвиток та зміцнення м'язів. Включає елементи статичних положень, силових занять, розтяжки, та детальне опрацювання глибоких м'язів",
        },
        {
            title: 'Yoga',
            description:
                'Комплекс асан (поз), що поєднують помірно динамічні та статичні положення, дихальні вправи та витяжіння. Практики пробуджують, заряджають енергією та налаштовують на продуктивний день.',
        },
        {
            title: 'Stretching',
            description:
                "Напрямок по витяжінню м'язів всього тіла. Збільшують амплітуду руху, розслаблюють. Чудово підійде для компенсації силових занять.",
        },
        {
            title: 'Fly Stretching',
            description:
                "Розтяжка на гамаках. Поєднання балансових вправ, для ввімкнення глибоких м'язів, разом з класичним стретчингом",
        },
        {
            title: 'Yoga Stretching',
            description:
                'Комплекс асан з йоги, направлені на усвідомлене витяжіння мязів всього тіла, покращення рухливості. Робота з диханням.',
        },
        {
            title: 'Heels',
            description:
                'Танцювальний напрям на підборах. Для вивільнення та відкриття в собі жіночності, сексуальності та грації.',
        },
    ];

    const trainingData = [
        {
            title: 'Групові тренування',
            description: 'Заняття з тренером в групі до 8 людей.',
        },
        {
            title: 'Персональні тренування',
            description: 'Тренування для однієї людини.',
        },
        {
            title: 'Спліт тренування',
            description: 'Тренування для двох.',
        },
        {
            title: 'Дитячі групи',
            description: 'Тренування для дітей та підлітків',
        },
    ];

    return (
        <section className="services-section">
            <h1>Наші послуги</h1>
            <div className="ss-trainings">
                {trainingData.map((el, i) => (
                    <div key={i}>
                        <h2>{el.title}</h2>
                        <p>{el.description}</p>
                    </div>
                ))}
            </div>

            <h1>Напрямки тренувань</h1>
            <div className="services-subsection">
                <div>
                    <p>
                        Всі напрямки та вправи до них сформовані у відповідності
                        з протоколами та техніками здорових тренувань. Кожне
                        тренування триває 50 хвилин.
                    </p>
                </div>
            </div>
            <div className="ss-trainings">
                {classes.map((el, i) => (
                    <div key={i}>
                        <h2>{el.title}</h2>
                        <p>{el.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Services;
