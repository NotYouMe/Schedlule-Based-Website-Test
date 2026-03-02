document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const timeInput = document.getElementById('time-input');
    const addBtn = document.getElementById('add-btn');
    const grid = document.getElementById('timetable-grid');
    const alarmSound = document.getElementById('alarm-sound');

    let events = JSON.parse(localStorage.getItem('mindgrid_events')) || [];

    // Initialize
    renderEvents();
    setInterval(tick, 1000);

    // Add Event
    addBtn.addEventListener('click', () => {
        if (!taskInput.value || !timeInput.value) return alert("Fill in both fields!");

        const newEvent = {
            id: Date.now(),
            task: taskInput.value,
            time: timeInput.value,
            triggered: false
        };

        events.push(newEvent);
        saveAndRender();
        taskInput.value = '';
    });

    function tick() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        document.getElementById('live-clock').textContent = now.toLocaleTimeString();

        events.forEach(ev => {
            if (ev.time === currentTime && !ev.triggered) {
                triggerAlarm(ev);
            }
        });
    }

    function triggerAlarm(ev) {
        ev.triggered = true;
        alarmSound.play();
        const card = document.querySelector(`[data-id="${ev.id}"]`);
        if (card) card.classList.add('alarm-active');
        
        setTimeout(() => {
            alert(`ALARM: ${ev.task}`);
            saveAndRender();
        }, 500);
    }

    function renderEvents() {
        grid.innerHTML = '';
        // Sort by time
        events.sort((a, b) => a.time.localeCompare(b.time));

        events.forEach(ev => {
            const card = document.createElement('div');
            card.className = `event-card ${ev.triggered ? 'alarm-active' : ''}`;
            card.setAttribute('data-id', ev.id);
            card.innerHTML = `
                <h4>${ev.task}</h4>
                <span>Time: ${ev.time}</span>
            `;
            grid.appendChild(card);
        });
    }

    function saveAndRender() {
        localStorage.setItem('mindgrid_events', JSON.stringify(events));
        renderEvents();
    }

    document.getElementById('clear-data').addEventListener('click', () => {
        events = [];
        saveAndRender();
    });
});
