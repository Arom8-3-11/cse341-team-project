const hookTripsCatalog = async () => {
    const listEl = document.getElementById('trips-list');
    const templateEl = document.getElementById('trip-card-template');
    const loadingEl = document.getElementById('trips-loading');
    const errorEl = document.getElementById('trips-error');
    const regionSelect = document.getElementById('region-filter');
    const seasonSelect = document.getElementById('season-filter');

    if (!listEl || !templateEl) {
        return;
    }

    const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

    const populateOptions = (select, values, selectedValue) => {
        if (!select) {
            return;
        }

        values.forEach((value) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = capitalize(value);
            if (value === selectedValue) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    };

    const applyFilters = () => {
        const region = regionSelect ? regionSelect.value : 'all';
        const season = seasonSelect ? seasonSelect.value : 'all';

        listEl.querySelectorAll('.route-card').forEach((card) => {
            const matchesRegion = region === 'all' || card.dataset.region === region;
            const matchesSeason = season === 'all' || card.dataset.season === season;
            card.hidden = !(matchesRegion && matchesSeason);
        });

        // Keep the URL shareable without reloading the page.
        const url = new URL(window.location.href);
        if (region !== 'all') {
            url.searchParams.set('region', region);
        } else {
            url.searchParams.delete('region');
        }
        if (season !== 'all') {
            url.searchParams.set('season', season);
        } else {
            url.searchParams.delete('season');
        }
        window.history.replaceState({}, '', url);
    };

    try {
        const response = await fetch('/api/trips');
        if (!response.ok) {
            throw new Error(`Failed to load trips (${response.status})`);
        }

        const trips = await response.json();
        const params = new URLSearchParams(window.location.search);
        const fragment = document.createDocumentFragment();

        populateOptions(regionSelect, [...new Set(trips.map((trip) => trip.region))], params.get('region'));
        populateOptions(seasonSelect, [...new Set(trips.map((trip) => trip.bestSeason))], params.get('season'));

        trips.forEach((trip) => {
            const card = templateEl.content.cloneNode(true);
            const cardEl = card.querySelector('.route-card');

            cardEl.classList.add(trip.region);
            cardEl.dataset.region = trip.region;
            cardEl.dataset.season = trip.bestSeason;

            card.querySelector('[data-field="name"]').textContent = trip.name;
            card.querySelector('[data-field="region"]').textContent = trip.region;
            card.querySelector('[data-field="start-station"]').textContent = trip.startStation;
            card.querySelector('[data-field="end-station"]').textContent = trip.endStation;
            card.querySelector('[data-field="duration"]').textContent = trip.duration;
            card.querySelector('[data-field="distance"]').textContent = `${trip.distance}km`;

            const seasonEl = card.querySelector('[data-field="season"]');
            seasonEl.classList.add(`season-${trip.bestSeason}`);
            seasonEl.textContent = `Best in ${trip.bestSeason}`;

            card.querySelector('[data-field="description"]').textContent = trip.description;

            const highlightsEl = card.querySelector('[data-field="highlights"]');
            (trip.highlights || []).forEach((highlight) => {
                const tag = document.createElement('span');
                tag.className = 'highlight-tag';
                tag.textContent = highlight;
                highlightsEl.appendChild(tag);
            });

            card.querySelector('[data-field="details-link"]').href = `/trips/${trip.id}`;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
        applyFilters();

        if (regionSelect) {
            regionSelect.addEventListener('change', applyFilters);
        }
        if (seasonSelect) {
            seasonSelect.addEventListener('change', applyFilters);
        }

        if (loadingEl) {
            loadingEl.hidden = true;
        }
    } catch (error) {
        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load trips right now. Please try again in a moment.';
        }
    }
};

const hookTrainsCatalog = async () => {
    const listEl = document.getElementById('trains-list');
    const templateEl = document.getElementById('train-card-template');
    const loadingEl = document.getElementById('trains-loading');
    const errorEl = document.getElementById('trains-error');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/trains');
        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        const payload = await response.json();
        const trains = Array.isArray(payload) ? payload : payload.trains || [];
        const fragment = document.createDocumentFragment();

        trains.forEach((train) => {
            const card = templateEl.content.cloneNode(true);
            const imageEl = card.querySelector('[data-field="image"]');

            imageEl.src = train.imageUrl;
            imageEl.alt = train.imageAlt || `${train.name} train`;

            card.querySelector('[data-field="name"]').textContent = train.name;
            card.querySelector('[data-field="operator"]').textContent = train.operator;
            card.querySelector('[data-field="type"]').textContent = train.type;
            card.querySelector('[data-field="speed"]').textContent = `${train.maxSpeedKmh} km/h`;
            card.querySelector('[data-field="seats"]').textContent = `${train.capacity} seats`;
            card.querySelector('[data-field="power"]').textContent = train.powerSource;
            card.querySelector('[data-field="description"]').textContent = train.description;
            card.querySelector('[data-field="best-for"]').textContent = train.bestFor;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
        if (loadingEl) {
            loadingEl.hidden = true;
        }
    } catch (error) {
        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load trains right now. Please try again in a moment.';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    hookTripsCatalog();
    hookTrainsCatalog();
});