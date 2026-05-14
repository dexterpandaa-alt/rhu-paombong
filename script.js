// Navbar scroll effect
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu toggle
let menuOpen = false;
function toggleMenu() {
    menuOpen = !menuOpen;
    document.getElementById('mobile-menu').classList.toggle('open', menuOpen);
    document.getElementById('ham').classList.toggle('open', menuOpen);
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (menuOpen && !e.target.closest('#mobile-menu') && !e.target.closest('.nav-mobile-btn')) {
        menuOpen = false;
        document.getElementById('mobile-menu').classList.remove('open');
        document.getElementById('ham').classList.remove('open');
    }
});

// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Dynamic nav height for announcement bar
function updateAnnounceBarMargin() {
    const navHeight = document.getElementById('navbar').offsetHeight;
    const announceBar = document.querySelector('.announce-bar');
    if (announceBar) announceBar.style.marginTop = navHeight + 'px';
    document.documentElement.style.setProperty('--nav-height', navHeight + 'px');
}
window.addEventListener('resize', updateAnnounceBarMargin);
updateAnnounceBarMargin();

// Auto-highlight current day in clinic hours
function highlightToday() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    
    // Remove existing today class
    document.querySelectorAll('.hours-row').forEach(row => row.classList.remove('today'));
    document.querySelectorAll('.today-chip').forEach(chip => chip.remove());
    
    // Find today's row and mark it
    const rows = document.querySelectorAll('.hours-row');
    rows.forEach(row => {
        const dayLabel = row.querySelector('.hours-day');
        if (dayLabel && dayLabel.textContent.trim().toLowerCase().startsWith(today)) {
            row.classList.add('today');
            const chip = document.createElement('span');
            chip.className = 'today-chip';
            chip.textContent = 'Today';
            dayLabel.appendChild(chip);
        }
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', highlightToday);

const STATS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-oS9Kd4sDX2XJeLELpacBqHWNriwpOZ--JY_0MJKCaJeSl0NOTgxEfAsRpjpui8SYt4iBozm2RLLr/pub?gid=0&single=true&output=csv";

async function fetchClinicStats() {
  try {
    const res = await fetch(STATS_CSV_URL);
    if (!res.ok) throw new Error("Network error");
    const text = await res.text();
    const rows = text.trim().split("\n");
    if (rows.length < 2) return; // only header, no data

    // Take the last row (today's numbers)
    const lastRow = rows[rows.length - 1].split(",");

    // Columns: PatientsSeen, OPDConsultation, Male, Female, FollowUpsPending
    const total = lastRow[0]?.trim() || "--";
    const opd = lastRow[1]?.trim() || "--";
    const male = lastRow[2]?.trim() || "--";
    const female = lastRow[3]?.trim() || "--";
    const followUps = lastRow[4]?.trim() || "--";

    // Update hero card
    document.getElementById("stat-total").textContent = total + " today";
    document.getElementById("stat-opd").textContent = opd;
    document.getElementById("stat-male").textContent = male;
    document.getElementById("stat-female").textContent = female;
    document.getElementById("stat-followups").textContent = followUps + " patient(s)";

    // Optional: If you add a 6th column "MonthTotal" in the sheet, update the badge and stats bar
    // const monthTotal = lastRow[5]?.trim();
    // if (monthTotal) {
    //   document.querySelector(".hf-num").textContent = monthTotal;
    //   document.querySelector(".stat-number").innerHTML = monthTotal + "<span>+</span>";
    // }

  } catch (error) {
    console.error("Could not load clinic stats:", error);
  }
}

// Fetch on load, then every 10 minutes
fetchClinicStats();
setInterval(fetchClinicStats, 600000);
