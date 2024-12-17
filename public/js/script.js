document.addEventListener('DOMContentLoaded', function(){

  const allButtons = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');
  const body = document.querySelector('.main');

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', function() {
      searchBar.style.visibility = 'visible';
      body.style.background = '#9292924d';
      searchBar.classList.add('open');
      this.setAttribute('aria-expanded', 'true');
      searchInput.focus();
    });
  }

  searchClose.addEventListener('click', function() {
    searchBar.style.visibility = 'hidden';
    body.style.background = 'unset';

    searchBar.classList.remove('open');
    this.setAttribute('aria-expanded', 'false');
  });

  body.addEventListener('click',()=>{
    searchBar.style.background = 'hidden';
    body.style.background = 'unset';

    searchBar.classList.remove('open');
    this.setAttribute('aria-expanded', 'false')
  })
  


});