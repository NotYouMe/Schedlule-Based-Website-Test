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

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize Supabase with Service Role Key (Server-side ONLY)
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY
);

// Your API Endpoint
app.get('/api/data', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) return res.status(500).json(error);
  res.status(200).json(data);
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));
// ... (previous supabase init code) ...

const authContainer = document.getElementById('auth-container');
const mainApp = document.getElementById('main-app');

// 1. Monitor Auth State
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        authContainer.style.display = 'none';
        mainApp.style.display = 'block';
        fetchUserEvents(); // Only fetch when logged in
    } else {
        authContainer.style.display = 'flex';
        mainApp.style.display = 'none';
    }
});

// 2. Sign Up / Login Functions
document.getElementById('signup-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for the confirmation link!");
});

document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
});

document.getElementById('logout-btn').addEventListener('click', () => supabase.auth.signOut());

// 3. Modified Fetch: Uses the User's Unique ID (UID)
async function fetchUserEvents() {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', user.id) // Filter by the logged-in user
        .order('assigned_time', { ascending: true });

    if (!error) renderEvents(data);
}
