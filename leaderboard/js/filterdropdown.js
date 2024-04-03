import { fetchUserRecords } from "./configuretable.js";

function attachEventListeners() {
  const filterBtn = document.querySelector('.filter-btn');
  const dropdownContent = document.querySelector('.dropdown-content');

  filterBtn.addEventListener('click', function() {
    dropdownContent.classList.toggle('show');
  });

  dropdownContent.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      dropdownContent.classList.remove('show');
    }
  });

  function attachClickListener(elementId, filter) {
    const element = document.getElementById(elementId);
    element.addEventListener('click', function() {
      fetchUserRecords(filter);
      return false; // Prevent default behavior of anchor tag
    });
  }

  attachClickListener('time', 'time');
  attachClickListener('round', 'round');
  attachClickListener('endless', 'endless');
}

document.addEventListener("DOMContentLoaded", attachEventListeners);
