/**
 * local-storage.js - localStorage management for user annotations and preferences
 */

class LocalStorageManager {
  constructor(namespace = 'rhetoric-site') {
    this.namespace = namespace;
  }

  /**
   * Get item from localStorage with namespace
   */
  getItem(key) {
    try {
      const fullKey = `${this.namespace}:${key}`;
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage with namespace
   */
  setItem(key, value) {
    try {
      const fullKey = `${this.namespace}:${key}`;
      localStorage.setItem(fullKey, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key) {
    try {
      const fullKey = `${this.namespace}:${key}`;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all items with this namespace
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`${this.namespace}:`)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Get all keys with this namespace
   */
  getAllKeys() {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(`${this.namespace}:`))
      .map(key => key.replace(`${this.namespace}:`, ''));
  }
}

// User Notes Manager
class UserNotesManager extends LocalStorageManager {
  constructor() {
    super('rhetoric-site');
    this.notesKey = 'user-notes';
  }

  /**
   * Get all user notes
   */
  getAllNotes() {
    return this.getItem(this.notesKey) || [];
  }

  /**
   * Add a new note
   */
  addNote(note) {
    const notes = this.getAllNotes();
    const newNote = {
      id: Date.now().toString(),
      page: note.page,
      content: note.content,
      timestamp: new Date().toISOString()
    };
    notes.push(newNote);
    this.setItem(this.notesKey, notes);
    return newNote;
  }

  /**
   * Update an existing note
   */
  updateNote(id, updatedContent) {
    const notes = this.getAllNotes();
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
      notes[index].content = updatedContent;
      notes[index].timestamp = new Date().toISOString();
      this.setItem(this.notesKey, notes);
      return notes[index];
    }
    return null;
  }

  /**
   * Delete a note
   */
  deleteNote(id) {
    const notes = this.getAllNotes();
    const filtered = notes.filter(note => note.id !== id);
    this.setItem(this.notesKey, filtered);
    return filtered;
  }

  /**
   * Get notes for a specific page
   */
  getNotesByPage(page) {
    const notes = this.getAllNotes();
    return notes.filter(note => note.page === page);
  }

  /**
   * Export notes as JSON
   */
  exportNotes() {
    const notes = this.getAllNotes();
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `rhetoric-notes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Import notes from JSON file
   */
  async importNotes(file) {
    try {
      const text = await file.text();
      const notes = JSON.parse(text);

      if (Array.isArray(notes)) {
        this.setItem(this.notesKey, notes);
        return { success: true, count: notes.length };
      } else {
        return { success: false, error: 'Invalid format' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.storageManager = new LocalStorageManager();
  window.userNotes = new UserNotesManager();

  // Set up local notes form if it exists
  const localForm = document.getElementById('local-contribution-form');
  if (localForm) {
    setupLocalNotesForm(localForm);
  }

  // Display existing notes if display element exists
  const notesList = document.getElementById('local-notes-list');
  if (notesList) {
    displayLocalNotes(notesList);
  }
});

/**
 * Set up local notes form
 */
function setupLocalNotesForm(form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const page = document.getElementById('local-page').value;
    const content = document.getElementById('local-note').value;

    if (page && content) {
      const note = window.userNotes.addNote({ page, content });

      // Show success message
      window.a11y.announce('Note saved successfully');

      // Clear form
      form.reset();

      // Refresh display
      const notesList = document.getElementById('local-notes-list');
      if (notesList) {
        displayLocalNotes(notesList);
      }

      // Show notes display
      const notesDisplay = document.getElementById('local-notes-display');
      if (notesDisplay) {
        notesDisplay.hidden = false;
      }
    }
  });

  // Cancel button
  const cancelBtn = document.getElementById('cancel-local');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      form.reset();
      const section = document.getElementById('local-contribution-section');
      if (section) section.hidden = true;
    });
  }
}

/**
 * Display all local notes
 */
function displayLocalNotes(container) {
  const notes = window.userNotes.getAllNotes();

  if (notes.length === 0) {
    container.innerHTML = '<p class="no-notes">No notes saved yet.</p>';
    return;
  }

  // Sort by most recent first
  notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const html = notes.map(note => `
    <div class="note-card" data-note-id="${note.id}">
      <div class="note-header">
        <span class="note-page">${window.utils.sanitizeHTML(note.page)}</span>
        <span class="note-date">${new Date(note.timestamp).toLocaleDateString()}</span>
      </div>
      <div class="note-content">${window.utils.sanitizeHTML(note.content)}</div>
      <div class="note-actions">
        <button class="btn btn-small delete-note" data-id="${note.id}">Delete</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;

  // Add delete handlers
  container.querySelectorAll('.delete-note').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('Delete this note?')) {
        window.userNotes.deleteNote(id);
        displayLocalNotes(container);
        window.a11y.announce('Note deleted');
      }
    });
  });
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LocalStorageManager, UserNotesManager };
}
