/**
 * SOUNDWAVE — Music Player
 * script.js (updated)
 *
 * Fixes & additions:
 *  - Sidebar nav: Home / Search / Library views
 *  - Mobile sidebar toggle (hamburger)
 *  - Search: albums + songs, debounced, highlighted matches
 *  - Search: "No results" message, click-to-play/open
 *  - Recent searches stored in localStorage
 *  - Liked songs / Library stored in localStorage
 *  - Keyboard shortcut: "/" → focus search, Enter → first result
 *  - Clear (X) button in search
 *  - All existing player functionality preserved
 */

'use strict';

/* =========================================================
   1. DATA — Albums & Songs
   ========================================================= */
const ALBUMS = [
  {
    id: 1,
    title: 'Langit Mong Bughaw',
    artist: 'December Avenue',
    year: 2024,
    image: 'decave.png',
    color: 'linear-gradient(135deg, #1a1a4e 0%, #2d1b69 100%)',
    songs: [
      { id: 's1_1', title: 'Bulong',         duration: '4:30', src: 'December Avenue - Bulong (OFFICIAL MUSIC VIDEO).mp3' },
      { id: 's1_2', title: 'Huling Sandali',     duration: '5:53', src: 'December Avenue - Huling Sandali (OFFICIAL LYRIC VIDEO).mp3' },
      { id: 's1_3', title: 'Kahit Di Mo Alam',     duration: '4:42', src: 'December Avenue - Kahit Di Mo Alam.mp3' },
      { id: 's1_4', title: 'Sa Ngalan Ng Pag-Ibig',        duration: '4:33', src: 'December Avenue - Sa Ngalan Ng Pag-Ibig (OFFICIAL MUSIC VIDEO).mp3' },
      { id: 's1_5', title: 'Kung Di Rin Lang Ikaw', duration: '4:20', src: 'December Avenue feat. Moira Dela Torre - Kung Di Rin Lang Ikaw (OFFICIAL MUSIC VIDEO).mp3' },
    ],
  },
  {
    id: 2,
    title: 'Fuchsiang Pag-Ibig',
    artist: 'Silent Sanctuary',
    year: 2023,
    image: 'silent.jpg',
    color: 'linear-gradient(135deg, #7c2d00 0%, #c85a00 100%)',
    songs: [
      { id: 's2_1', title: 'Rebound', duration: '4:41', src: 'Silent Sanctuary - Rebound (Official Lyric Video).mp3' },
      { id: 's2_2', title: '14',      duration: '6:15', src: 'Silent Sanctuary - 14 (Official Lyric Video).mp3' },
      { id: 's2_3', title: 'Kundiman',      duration: '5:39', src: 'Silent Sanctuary  KUNDIMAN (Lyrics).mp3' },
      { id: 's2_4', title: 'Ikaw Lamang',     duration: '5:06', src: 'Silent Sanctuary - Ikaw Lamang (Official Lyric Video).mp3' },
      { id: 's2_5', title: 'Sandali Lang',     duration: '2:47', src: 'Silent Sanctuary - Sandali Lang (Official Lyric Video).mp3' },
    ],
  },
  {
    id: 3,
    title: 'The Traveller Across Dimensions',
    artist: 'Ben&Ben',
    year: 2024,
    image: 'bnb.jpg',
    color: 'linear-gradient(135deg, #003d6b 0%, #006994 100%)',
    songs: [
      { id: 's3_1', title: 'Lifetime (Reimagined)',   duration: '4:37', src: 'Ben&Ben - Lifetime (Reimagined).mp3' },
      { id: 's3_2', title: 'Kathang Isip',    duration: '5:24', src: 'Ben&Ben - Kathang Isip (Lyrics).mp3' },
      { id: 's3_3', title: 'Saranggola', duration: '4:27', src: 'Ben&Ben - Saranggola  Official Lyric Video.mp3' },
      { id: 's3_4', title: 'Pagtingin',      duration: '5:02', src: 'Ben&Ben - Pagtingin  Official Music Video.mp3' },
      { id: 's3_5', title: 'Sa Susunod na Habang Buhay', duration: '4:33', src: 'Ben&Ben - Sa Susunod na Habang Buhay  Official Lyric Video.mp3' },
    ],
  },
  {
    id: 4,
    title: 'ClapClapClap!',
    artist: 'IV OF SPADES',
    year: 2022,
    image: 'IVofS.jpg',
    color: 'linear-gradient(135deg, #1a3a1a 0%, #2d5a27 100%)',
    songs: [
      { id: 's4_1', title: 'Mundo',   duration: '3:50', src: 'IV Of Spades - Mundo (Lyrics).mp3' },
      { id: 's4_2', title: 'Aura', duration: '4:12', src: 'IV OF SPADES - Aura (Official Music Video).mp3' },
      { id: 's4_3', title: 'Kabisado',      duration: '2:59', src: 'IV OF SPADES - Kabisado (Official Lyric Video).mp3' },
      { id: 's4_4', title: 'Dulo Ng Hangganan',        duration: '3:40', src: 'IV OF SPADES - Dulo Ng Hangganan (Official Audio).mp3' },
      { id: 's4_5', title: 'Come Inside Of My Heart',    duration: '4:55', src: 'IV OF SPADES - Come Inside Of My Heart (Official Video).mp3' },
    ],
  },
  {
    id: 5,
    title: 'Silakbo',
    artist: 'Cup of Joe',
    year: 2024,
    image: 'CoJ.jpg',
    color: 'linear-gradient(135deg, #1a0033 0%, #4b0082 100%)',
    songs: [
      { id: 's5_1', title: 'Multo', duration: '3:05', src: 'Multo - Cup of Joe (Official Lyric Video).mp3' },
      { id: 's5_2', title: 'Pahina',       duration: '3:42', src: 'Pahina - Cup of Joe (Rock Version) Renegade Stories (Lyrics).mp3' },
      { id: 's5_3', title: 'Tingin',   duration: '4:18', src: 'Tingin (Live at The Cozy Cove) - Cup of Joe. ft. Janine Teñoso.mp3' },
      { id: 's5_4', title: 'Estranghero',  duration: '3:28', src: 'Cup of Joe - Estranghero (Official Music Video).mp3' },
      { id: 's5_5', title: 'Misteryoso', duration: '5:10', src: 'Misteryoso - Cup of Joe (Official Lyric Video).mp3' },
    ],
  },
];

/* =========================================================
   2. STATE
   ========================================================= */
const state = {
  currentAlbum:    null,
  currentSong:     null,
  currentSongIdx:  -1,
  isPlaying:       false,
  isShuffle:       false,
  isRepeat:        false,
  isDragging:      false,
  currentSection:  'home',   // 'home' | 'search' | 'library'
  searchDebounce:  null,
};

/* =========================================================
   3. PERSISTENT STORAGE HELPERS
   ========================================================= */

/** Get liked song IDs from localStorage */
function getLikedSongs() {
  try { return JSON.parse(localStorage.getItem('sw_liked') || '[]'); }
  catch { return []; }
}

/** Save liked song IDs to localStorage */
function saveLikedSongs(ids) {
  localStorage.setItem('sw_liked', JSON.stringify(ids));
}

/** Get recent searches from localStorage */
function getRecentSearches() {
  try { return JSON.parse(localStorage.getItem('sw_recent_searches') || '[]'); }
  catch { return []; }
}

/** Save a new recent search term */
function saveRecentSearch(term) {
  if (!term.trim()) return;
  let recents = getRecentSearches();
  recents = recents.filter(r => r.toLowerCase() !== term.toLowerCase());
  recents.unshift(term);
  if (recents.length > 8) recents = recents.slice(0, 8);
  localStorage.setItem('sw_recent_searches', JSON.stringify(recents));
}

/** Remove a single recent search */
function removeRecentSearch(term) {
  let recents = getRecentSearches().filter(r => r !== term);
  localStorage.setItem('sw_recent_searches', JSON.stringify(recents));
}

/** Clear all recent searches */
function clearRecentSearches() {
  localStorage.removeItem('sw_recent_searches');
}

/* =========================================================
   4. DOM REFERENCES
   ========================================================= */
const dom = {
  // Views
  albumsView:    document.getElementById('albumsView'),
  songsView:     document.getElementById('songsView'),
  searchView:    document.getElementById('searchView'),
  libraryView:   document.getElementById('libraryView'),

  // Albums
  albumsGrid:    document.getElementById('albumsGrid'),
  songsList:     document.getElementById('songsList'),
  heroTitle:     document.getElementById('heroTitle'),
  heroArtist:    document.getElementById('heroArtist'),
  heroMeta:      document.getElementById('heroMeta'),
  herocover:     document.getElementById('herocover'),
  backToAlbums:  document.getElementById('backToAlbums'),
  playAllBtn:    document.getElementById('playAllBtn'),

  // Search
  searchInput:         document.getElementById('searchInput'),
  searchClear:         document.getElementById('searchClear'),
  searchResults:       document.getElementById('searchResults'),
  searchAlbumsSection: document.getElementById('searchAlbumsSection'),
  searchAlbumsGrid:    document.getElementById('searchAlbumsGrid'),
  searchSongsSection:  document.getElementById('searchSongsSection'),
  searchSongsList:     document.getElementById('searchSongsList'),
  searchSubtitle:      document.getElementById('searchSubtitle'),
  noResults:           document.getElementById('noResults'),
  recentSearches:      document.getElementById('recentSearches'),
  recentList:          document.getElementById('recentList'),
  clearRecent:         document.getElementById('clearRecent'),

  // Library
  librarySongsList: document.getElementById('librarySongsList'),
  libraryEmpty:     document.getElementById('libraryEmpty'),

  // Player bar
  playerSong:    document.getElementById('playerSong'),
  playerArtist:  document.getElementById('playerArtist'),
  playerCover:   document.getElementById('playerCover'),
  playPauseBtn:  document.getElementById('playPauseBtn'),
  iconPlay:      document.querySelector('.icon-play'),
  iconPause:     document.querySelector('.icon-pause'),
  prevBtn:       document.getElementById('prevBtn'),
  nextBtn:       document.getElementById('nextBtn'),
  shuffleBtn:    document.getElementById('shuffleBtn'),
  repeatBtn:     document.getElementById('repeatBtn'),
  likeBtn:       document.getElementById('likeBtn'),
  progressBar:   document.getElementById('progressBar'),
  progressFill:  document.getElementById('progressFill'),
  progressThumb: document.getElementById('progressThumb'),
  currentTime:   document.getElementById('currentTime'),
  totalTime:     document.getElementById('totalTime'),
  volumeSlider:  document.getElementById('volumeSlider'),
  audio:         document.getElementById('audioEl'),

  // Sidebar & mobile
  sidebar:        document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  sidebarToggle:  document.getElementById('sidebarToggle'),
};

/* Wrap player buttons into a controls-row div */
(function wrapControlsRow() {
  const controls = document.querySelector('.player__controls');
  const btns = [dom.shuffleBtn, dom.prevBtn, dom.playPauseBtn, dom.nextBtn, dom.repeatBtn];
  const row = document.createElement('div');
  row.className = 'controls-row';
  btns.forEach(b => row.appendChild(b));
  controls.insertBefore(row, controls.firstChild);
})();

/* =========================================================
   5. VIEW MANAGEMENT
   ========================================================= */

/** All view sections */
const VIEWS = {
  home:    dom.albumsView,
  songs:   dom.songsView,
  search:  dom.searchView,
  library: dom.libraryView,
};

/** Show a named view, hide others. section is sidebar nav section or 'songs' */
function showView(view) {
  Object.values(VIEWS).forEach(el => el.classList.add('hidden'));
  const el = VIEWS[view];
  if (el) el.classList.remove('hidden');
}

/* =========================================================
   6. SIDEBAR NAVIGATION
   ========================================================= */

/** Activate a sidebar nav item and show corresponding view */
function activateSection(section) {
  state.currentSection = section;

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    const isActive = item.dataset.section === section;
    item.classList.toggle('active', isActive);
  });

  if (section === 'home') {
    showView('home');
  } else if (section === 'search') {
    showView('search');
    renderRecentSearches();
    // Focus search input
    setTimeout(() => dom.searchInput.focus(), 50);
  } else if (section === 'library') {
    showView('library');
    renderLibrary();
  }

  // Close mobile sidebar
  closeMobileSidebar();
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => activateSection(item.dataset.section));
});

/* =========================================================
   7. MOBILE SIDEBAR
   ========================================================= */

function openMobileSidebar() {
  dom.sidebar.classList.add('open');
  dom.sidebarOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
  dom.sidebar.classList.remove('open');
  dom.sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

dom.sidebarToggle.addEventListener('click', () => {
  if (dom.sidebar.classList.contains('open')) {
    closeMobileSidebar();
  } else {
    openMobileSidebar();
  }
});

dom.sidebarOverlay.addEventListener('click', closeMobileSidebar);

/* =========================================================
   8. RENDERING — Albums Grid
   ========================================================= */
function renderAlbums() {
  dom.albumsGrid.innerHTML = '';
  ALBUMS.forEach(album => {
    dom.albumsGrid.appendChild(createAlbumCard(album));
  });
}

/** Create an album card element */
function createAlbumCard(album, query = '') {
  const card = document.createElement('div');
  card.className = 'album-card';
  card.dataset.albumId = album.id;

  const titleHtml  = query ? highlight(album.title,  query) : album.title;
  const artistHtml = query ? highlight(album.artist, query) : album.artist;

  card.innerHTML = `
    <div class="album-card__cover" style="background: ${album.color};">
      <img src="${album.image}" alt="${album.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
      <div class="play-overlay">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </div>
    <p class="album-card__title">${titleHtml}</p>
    <p class="album-card__artist">${artistHtml}</p>
  `;
  card.addEventListener('click', () => {
    showSongsView(album);
    // If in search, save query as recent
    if (state.currentSection === 'search') {
      const q = dom.searchInput.value.trim();
      if (q) saveRecentSearch(q);
    }
  });
  return card;
}

/* =========================================================
   9. RENDERING — Songs View
   ========================================================= */
function showSongsView(album) {
  state.currentAlbum = album;

  dom.heroTitle.textContent  = album.title;
  dom.heroArtist.textContent = album.artist;
  dom.heroMeta.textContent   = `${album.songs.length} songs  •  ${album.year}`;
  dom.herocover.style.backgroundImage = `url('${album.image}')`;
  dom.herocover.style.backgroundSize = 'cover';
  dom.herocover.style.backgroundPosition = 'center';
  dom.herocover.style.backgroundRepeat = 'no-repeat';
  dom.herocover.style.backgroundColor = album.color;  // Fallback
  dom.herocover.textContent = '';
  dom.herocover.style.fontSize = '';

  renderSongsList(album, dom.songsList);
  showView('songs');

  // Update nav active — none for songs sub-view, keep previous
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
}

/** Render song rows into a given container, with optional query for highlight */
function renderSongsList(album, container, query = '') {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'songs-list-header';
  header.innerHTML = `<span>#</span><span>TITLE</span><span class="col-album">ALBUM</span><span>⏱</span>`;
  container.appendChild(header);

  album.songs.forEach((song, idx) => {
    const row = document.createElement('div');
    row.className = 'song-row';
    row.dataset.songId = song.id;

    if (state.currentSong && state.currentSong.id === song.id) {
      row.classList.add('active');
    }

    const titleHtml = query ? highlight(song.title, query) : song.title;

    row.innerHTML = `
      <div class="song-row__num">
        <span class="num-text">${idx + 1}</span>
        <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <p class="song-row__title">${titleHtml}</p>
      <p class="song-row__album">${album.title}</p>
      <p class="song-row__duration">${song.duration}</p>
    `;

    row.addEventListener('click', () => playSong(song, idx, album));
    container.appendChild(row);
  });
}

/* =========================================================
   10. SEARCH — Core Functions
   ========================================================= */

/** Highlight query matches inside text, returns HTML string */
function highlight(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

/** Search albums by title or artist */
function searchAlbums(query) {
  const q = query.toLowerCase();
  return ALBUMS.filter(a =>
    a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)
  );
}

/** Search all songs across all albums */
function searchSongs(query) {
  const q = query.toLowerCase();
  const results = [];
  ALBUMS.forEach(album => {
    album.songs.forEach((song, idx) => {
      if (song.title.toLowerCase().includes(q) || album.artist.toLowerCase().includes(q)) {
        results.push({ song, idx, album });
      }
    });
  });
  return results;
}

/** Render search results into the search view */
function renderSearchResults(query) {
  const albums = searchAlbums(query);
  const songs  = searchSongs(query);
  const hasResults = albums.length > 0 || songs.length > 0;

  dom.searchResults.classList.remove('hidden');
  dom.recentSearches.classList.add('hidden');

  // No results state
  dom.noResults.classList.toggle('hidden', hasResults);
  dom.searchAlbumsSection.classList.toggle('hidden', albums.length === 0);
  dom.searchSongsSection.classList.toggle('hidden',  songs.length  === 0);

  if (!hasResults) return;

  // Albums
  if (albums.length > 0) {
    dom.searchAlbumsGrid.innerHTML = '';
    albums.forEach(album => {
      dom.searchAlbumsGrid.appendChild(createAlbumCard(album, query));
    });
  }

  // Songs
  if (songs.length > 0) {
    dom.searchSongsList.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'songs-list-header';
    header.innerHTML = `<span>#</span><span>TITLE</span><span class="col-album">ALBUM</span><span>⏱</span>`;
    dom.searchSongsList.appendChild(header);

    songs.forEach(({ song, idx, album }, i) => {
      const row = document.createElement('div');
      row.className = 'song-row';
      row.dataset.songId = song.id;
      if (state.currentSong && state.currentSong.id === song.id) row.classList.add('active');

      row.innerHTML = `
        <div class="song-row__num">
          <span class="num-text">${i + 1}</span>
          <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <p class="song-row__title">${highlight(song.title, query)}</p>
        <p class="song-row__album">${highlight(album.title, query)}</p>
        <p class="song-row__duration">${song.duration}</p>
      `;
      row.addEventListener('click', () => {
        playSong(song, idx, album);
        saveRecentSearch(query);
      });
      dom.searchSongsList.appendChild(row);
    });
  }
}

/** Clear search results back to empty search state */
function clearSearchResults() {
  dom.searchResults.classList.add('hidden');
  dom.recentSearches.classList.remove('hidden');
  renderRecentSearches();
}

/* =========================================================
   11. RECENT SEARCHES
   ========================================================= */
function renderRecentSearches() {
  const recents = getRecentSearches();
  dom.recentList.innerHTML = '';

  if (recents.length === 0) {
    dom.recentSearches.classList.add('hidden');
    return;
  }

  dom.recentSearches.classList.remove('hidden');

  recents.forEach(term => {
    const tag = document.createElement('div');
    tag.className = 'recent-tag';
    tag.innerHTML = `
      <span class="recent-tag__text">${term}</span>
      <span class="recent-tag__remove" title="Remove">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </span>
    `;
    // Click on the text → search for it
    tag.querySelector('.recent-tag__text').addEventListener('click', () => {
      dom.searchInput.value = term;
      dom.searchClear.classList.remove('hidden');
      handleSearchInput(term);
    });
    // Click on × → remove from recents
    tag.querySelector('.recent-tag__remove').addEventListener('click', (e) => {
      e.stopPropagation();
      removeRecentSearch(term);
      renderRecentSearches();
    });
    dom.recentList.appendChild(tag);
  });
}

dom.clearRecent.addEventListener('click', () => {
  clearRecentSearches();
  renderRecentSearches();
});

/* =========================================================
   12. LIBRARY (Liked Songs)
   ========================================================= */
function renderLibrary() {
  const likedIds = getLikedSongs();
  dom.librarySongsList.innerHTML = '';

  if (likedIds.length === 0) {
    dom.libraryEmpty.classList.remove('hidden');
    return;
  }

  dom.libraryEmpty.classList.add('hidden');

  // Gather liked song objects
  const likedSongs = [];
  ALBUMS.forEach(album => {
    album.songs.forEach((song, idx) => {
      if (likedIds.includes(song.id)) {
        likedSongs.push({ song, idx, album });
      }
    });
  });

  // Sort by liked order
  likedSongs.sort((a, b) => likedIds.indexOf(a.song.id) - likedIds.indexOf(b.song.id));

  const header = document.createElement('div');
  header.className = 'songs-list-header';
  header.innerHTML = `<span>#</span><span>TITLE</span><span class="col-album">ALBUM</span><span>⏱</span>`;
  dom.librarySongsList.appendChild(header);

  likedSongs.forEach(({ song, idx, album }, i) => {
    const row = document.createElement('div');
    row.className = 'song-row';
    row.dataset.songId = song.id;
    if (state.currentSong && state.currentSong.id === song.id) row.classList.add('active');

    row.innerHTML = `
      <div class="song-row__num">
        <span class="num-text">${i + 1}</span>
        <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <p class="song-row__title">${song.title}</p>
      <p class="song-row__album">${album.title}</p>
      <p class="song-row__duration">${song.duration}</p>
    `;
    row.addEventListener('click', () => playSong(song, idx, album));
    dom.librarySongsList.appendChild(row);
  });
}

/* =========================================================
   13. SEARCH INPUT — Event Handling
   ========================================================= */

function handleSearchInput(query) {
  const q = query.trim();
  dom.searchSubtitle.textContent = q
    ? `Results for "${q}"`
    : 'Type something to search albums and songs';

  if (!q) {
    clearSearchResults();
    return;
  }
  renderSearchResults(q);
}

// Debounced input handler
dom.searchInput.addEventListener('input', () => {
  const val = dom.searchInput.value;
  dom.searchClear.classList.toggle('hidden', val.length === 0);

  clearTimeout(state.searchDebounce);
  state.searchDebounce = setTimeout(() => {
    // Switch to search view if not already there
    if (state.currentSection !== 'search') {
      activateSection('search');
    }
    handleSearchInput(val);
  }, 280);
});

// Focus: switch to search view
dom.searchInput.addEventListener('focus', () => {
  if (state.currentSection !== 'search') {
    activateSection('search');
  }
});

// Clear button
dom.searchClear.addEventListener('click', () => {
  dom.searchInput.value = '';
  dom.searchClear.classList.add('hidden');
  handleSearchInput('');
  dom.searchInput.focus();
});

/* =========================================================
   14. PLAYBACK — Core
   ========================================================= */
function playSong(song, idx, album = state.currentAlbum) {
  state.currentSong    = song;
  state.currentSongIdx = idx;
  if (album) state.currentAlbum = album;

  dom.audio.src = song.src;
  dom.audio.volume = parseFloat(dom.volumeSlider.value);
  dom.audio.play().catch(err => console.warn('Audio play blocked:', err.message));

  state.isPlaying = true;
  updatePlayPauseUI();
  updatePlayerBar(song, album || state.currentAlbum);
  highlightActiveSong(song.id);
  updateLikeBtnUI();
}

function togglePlayPause() {
  if (!state.currentSong) return;
  if (state.isPlaying) {
    dom.audio.pause();
    state.isPlaying = false;
  } else {
    dom.audio.play().catch(console.warn);
    state.isPlaying = true;
  }
  updatePlayPauseUI();
}

function playNext() {
  if (!state.currentAlbum) return;
  const songs = state.currentAlbum.songs;
  let nextIdx;
  if (state.isShuffle) {
    do { nextIdx = Math.floor(Math.random() * songs.length); }
    while (nextIdx === state.currentSongIdx && songs.length > 1);
  } else {
    nextIdx = (state.currentSongIdx + 1) % songs.length;
  }
  playSong(songs[nextIdx], nextIdx);
}

function playPrev() {
  if (!state.currentAlbum) return;
  if (dom.audio.currentTime > 3) { dom.audio.currentTime = 0; return; }
  const songs = state.currentAlbum.songs;
  const prevIdx = (state.currentSongIdx - 1 + songs.length) % songs.length;
  playSong(songs[prevIdx], prevIdx);
}

/* =========================================================
   15. UI UPDATES
   ========================================================= */
function updatePlayPauseUI() {
  dom.iconPlay.classList.toggle('hidden', state.isPlaying);
  dom.iconPause.classList.toggle('hidden', !state.isPlaying);
}

function updatePlayerBar(song, album) {
  dom.playerSong.textContent   = song.title;
  dom.playerArtist.textContent = album ? album.artist : '—';
  dom.playerCover.style.background = album ? album.color : '';
  dom.playerCover.innerHTML = album
    ? `<img src="${album.image}" alt="${album.title}">`
    : '<span class="cover-placeholder">♪</span>';
}

function highlightActiveSong(songId) {
  document.querySelectorAll('.song-row').forEach(row => {
    row.classList.remove('active');
    const eqEl = row.querySelector('.eq-bars');
    if (eqEl) eqEl.remove();
    const numText = row.querySelector('.num-text');
    if (numText) numText.style.display = '';
    const playIcon = row.querySelector('.play-icon');
    if (playIcon) playIcon.style.display = '';
  });

  document.querySelectorAll(`.song-row[data-song-id="${songId}"]`).forEach(activeRow => {
    activeRow.classList.add('active');
    const numArea = activeRow.querySelector('.song-row__num');
    if (numArea) {
      const numText = numArea.querySelector('.num-text');
      if (numText) numText.style.display = 'none';
      const playIcon = numArea.querySelector('.play-icon');
      if (playIcon) playIcon.style.display = 'none';
      const eq = document.createElement('div');
      eq.className = 'eq-bars';
      eq.innerHTML = '<div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div>';
      numArea.appendChild(eq);
    }
  });
}

/** Update like button visual state based on localStorage */
function updateLikeBtnUI() {
  if (!state.currentSong) return;
  const liked = getLikedSongs().includes(state.currentSong.id);
  dom.likeBtn.classList.toggle('liked', liked);
}

/* =========================================================
   16. LIKE BUTTON — persisted to localStorage
   ========================================================= */
dom.likeBtn.addEventListener('click', () => {
  if (!state.currentSong) return;
  const songId = state.currentSong.id;
  let liked = getLikedSongs();

  if (liked.includes(songId)) {
    liked = liked.filter(id => id !== songId);
  } else {
    liked.unshift(songId);
  }
  saveLikedSongs(liked);
  updateLikeBtnUI();

  // Refresh library view if open
  if (state.currentSection === 'library') renderLibrary();
});

/* =========================================================
   17. PROGRESS BAR
   ========================================================= */
function formatTime(secs) {
  if (isNaN(secs) || !isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

dom.audio.addEventListener('timeupdate', () => {
  if (state.isDragging) return;
  const pct = dom.audio.duration ? (dom.audio.currentTime / dom.audio.duration) * 100 : 0;
  dom.progressFill.style.width = `${pct}%`;
  dom.progressThumb.style.left = `${pct}%`;
  dom.currentTime.textContent  = formatTime(dom.audio.currentTime);
  dom.totalTime.textContent    = formatTime(dom.audio.duration);
});

dom.progressBar.addEventListener('click', (e) => {
  if (!dom.audio.duration) return;
  const rect = dom.progressBar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  dom.audio.currentTime = pct * dom.audio.duration;
});

dom.progressBar.addEventListener('mousedown', (e) => { state.isDragging = true; seekFromEvent(e); });
document.addEventListener('mousemove', (e) => { if (state.isDragging) seekFromEvent(e); });
document.addEventListener('mouseup', () => { state.isDragging = false; });

function seekFromEvent(e) {
  if (!dom.audio.duration) return;
  const rect = dom.progressBar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  dom.audio.currentTime = pct * dom.audio.duration;
  dom.progressFill.style.width = `${pct * 100}%`;
  dom.progressThumb.style.left = `${pct * 100}%`;
}

dom.progressBar.addEventListener('touchstart', (e) => { state.isDragging = true; seekFromTouch(e); }, { passive: true });
document.addEventListener('touchmove', (e) => { if (state.isDragging) seekFromTouch(e); }, { passive: true });
document.addEventListener('touchend', () => { state.isDragging = false; });

function seekFromTouch(e) {
  if (!dom.audio.duration) return;
  const touch = e.touches[0];
  const rect  = dom.progressBar.getBoundingClientRect();
  const pct   = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
  dom.audio.currentTime = pct * dom.audio.duration;
}

/* =========================================================
   18. VOLUME
   ========================================================= */
dom.volumeSlider.addEventListener('input', () => {
  dom.audio.volume = parseFloat(dom.volumeSlider.value);
});

/* =========================================================
   19. SONG ENDED
   ========================================================= */
dom.audio.addEventListener('ended', () => {
  if (state.isRepeat) {
    dom.audio.currentTime = 0;
    dom.audio.play().catch(console.warn);
  } else {
    playNext();
  }
});

dom.audio.addEventListener('loadedmetadata', () => {
  dom.totalTime.textContent = formatTime(dom.audio.duration);
});

/* =========================================================
   20. CONTROL BUTTON LISTENERS
   ========================================================= */
dom.playPauseBtn.addEventListener('click', togglePlayPause);
dom.nextBtn.addEventListener('click', playNext);
dom.prevBtn.addEventListener('click', playPrev);

dom.shuffleBtn.addEventListener('click', () => {
  state.isShuffle = !state.isShuffle;
  dom.shuffleBtn.classList.toggle('active', state.isShuffle);
});

dom.repeatBtn.addEventListener('click', () => {
  state.isRepeat = !state.isRepeat;
  dom.repeatBtn.classList.toggle('active', state.isRepeat);
});

dom.playAllBtn.addEventListener('click', () => {
  if (state.currentAlbum && state.currentAlbum.songs.length > 0) {
    playSong(state.currentAlbum.songs[0], 0);
  }
});

/* =========================================================
   21. NAVIGATION LISTENERS
   ========================================================= */
dom.backToAlbums.addEventListener('click', () => {
  showView('home');
  // Restore Home as active
  document.querySelectorAll('.nav-item').forEach(i => {
    i.classList.toggle('active', i.dataset.section === 'home');
  });
  state.currentSection = 'home';
  state.currentAlbum = null;
});

/* =========================================================
   22. KEYBOARD SHORTCUTS
   ========================================================= */
document.addEventListener('keydown', (e) => {
  const inInput = e.target.tagName === 'INPUT';

  // "/" → focus search (works even outside inputs)
  if (e.key === '/' && !inInput) {
    e.preventDefault();
    activateSection('search');
    dom.searchInput.focus();
    dom.searchInput.select();
    return;
  }

  // Enter while search is focused → click first result
  if (e.key === 'Enter' && e.target === dom.searchInput) {
    e.preventDefault();
    const firstAlbum = dom.searchAlbumsGrid.querySelector('.album-card');
    const firstSong  = dom.searchSongsList.querySelector('.song-row');
    if (firstSong)  { firstSong.click();  return; }
    if (firstAlbum) { firstAlbum.click(); return; }
    return;
  }

  if (inInput) return; // don't hijack other keys while typing

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlayPause();
      break;
    case 'ArrowRight':
      e.preventDefault();
      if (dom.audio.duration) dom.audio.currentTime = Math.min(dom.audio.currentTime + 5, dom.audio.duration);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      dom.audio.currentTime = Math.max(dom.audio.currentTime - 5, 0);
      break;
    case 'ArrowUp':
      e.preventDefault();
      dom.audio.volume = Math.min(1, dom.audio.volume + 0.1);
      dom.volumeSlider.value = dom.audio.volume;
      break;
    case 'ArrowDown':
      e.preventDefault();
      dom.audio.volume = Math.max(0, dom.audio.volume - 0.1);
      dom.volumeSlider.value = dom.audio.volume;
      break;
    case 'KeyN': playNext(); break;
    case 'KeyP': playPrev(); break;
  }
});

/* =========================================================
   23. INIT
   ========================================================= */
function init() {
  renderAlbums();
  updateLikeBtnUI();
  console.log('🎵 Soundwave initialized — enjoy the music!');
  console.log('⌨️  Shortcuts: Space=play/pause, ←→=seek, ↑↓=volume, N=next, P=prev, /=search');
}

init();
