document.addEventListener('DOMContentLoaded', () => {
    // Event Data Structure
    const eventsData = {
        featured: [/* ...existing featured events... */],
        sports: [
            {
                id: 'sport-1',
                title: 'Inter-College Soccer Tournament',
                date: '2024-04-15',
                venue: 'SuperSport Stadium',
                category: 'sports',
                image: './src/images/soccer.jpg',
                duration: '3 Days',
                registrationDeadline: '2024-03-30',
                participants: '16 Teams',
                description: 'Annual soccer tournament featuring teams from all TVET colleges.',
                schedule: [
                    { time: '09:00', activity: 'Opening Ceremony' },
                    { time: '10:00', activity: 'Group Stage Matches' },
                    // ... more schedule items
                ],
                requirements: [
                    'Valid student ID',
                    'Medical clearance',
                    'Team registration form'
                ]
            },
            // ... more sports events
        ],
        arts: [/* arts events */],
        workshops: [/* workshop events */]
    };

    // Search and Filter System
    const searchBar = document.createElement('div');
    searchBar.innerHTML = `
        <div class="mb-8">
            <div class="flex gap-4 max-w-2xl mx-auto">
                <input type="search" 
                    class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary" 
                    placeholder="Search events..."
                    id="eventSearch">
                <select class="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary" id="eventFilter">
                    <option value="all">All Events</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="this-month">This Month</option>
                    <option value="free">Free Events</option>
                </select>
            </div>
        </div>
    `;
    document.querySelector('.events-navigation').prepend(searchBar);

    // Event Calendar Enhancement
    class EventCalendar {
        constructor() {
            this.currentDate = new Date();
            this.events = new Map();
            this.init();
        }

        init() {
            this.renderCalendar();
            this.attachEventListeners();
        }

        renderCalendar() {
            // Calendar rendering logic
        }

        addEvent(date, event) {
            // Add event to calendar
        }

        // ... more calendar methods
    }

    // Registration System
    class EventRegistration {
        constructor() {
            this.form = null;
            this.init();
        }

        init() {
            this.createRegistrationModal();
            this.attachEventListeners();
        }

        createRegistrationModal() {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div id="registrationModal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50">
                    <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                        <h3 class="text-2xl font-bold mb-4">Event Registration</h3>
                        <form id="eventRegistrationForm">
                            <!-- Form fields will be dynamically populated -->
                        </form>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // ... more registration methods
    }

    // Event Details Modal Enhancement
    class EventModal {
        constructor() {
            this.modal = document.getElementById('eventModal');
            this.init();
        }

        show(eventId) {
            const event = this.getEventData(eventId);
            this.modal.innerHTML = this.generateModalContent(event);
            this.modal.classList.remove('hidden');
            this.modal.classList.add('flex');
            this.attachModalListeners();
        }

        generateModalContent(event) {
            return `
                <div class="bg-white rounded-xl overflow-hidden max-w-4xl w-full mx-4">
                    <div class="relative h-64">
                        <img src="${event.image}" class="w-full h-full object-cover" alt="${event.title}">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div class="absolute bottom-4 left-4 right-4 text-white">
                            <span class="inline-block px-3 py-1 bg-primary/80 rounded-full text-sm mb-2">
                                ${event.category}
                            </span>
                            <h3 class="text-2xl font-bold">${event.title}</h3>
                        </div>
                    </div>
                    <!-- Additional event details -->
                </div>
            `;
        }

        // ... more modal methods
    }

    // Interactive Tabs Enhancement
    class EventTabs {
        constructor() {
            this.tabs = document.querySelectorAll('.event-tab');
            this.init();
        }

        init() {
            this.tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    this.switchTab(tab);
                });
            });
        }

        switchTab(selectedTab) {
            // Remove active class from all tabs
            this.tabs.forEach(tab => {
                tab.classList.remove('active', 'bg-primary', 'text-white');
                tab.classList.add('text-gray-600', 'hover:text-primary');
            });

            // Add active class to selected tab
            selectedTab.classList.add('active', 'bg-primary', 'text-white');
            selectedTab.classList.remove('text-gray-600', 'hover:text-primary');

            // Switch content
            this.switchContent(selectedTab.dataset.tab);
        }

        // ... more tab methods
    }

    // Initialize all components
    const calendar = new EventCalendar();
    const registration = new EventRegistration();
    const modal = new EventModal();
    const tabs = new EventTabs();

    // Export for global access if needed
    window.eventsManager = {
        calendar,
        registration,
        modal,
        tabs
    };
});
