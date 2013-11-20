'use strict'

/* INITIALIZE */

var projectJSON = 'portfolio.json'
var projects = {}
var quotes = []
var site_title = document.title
var mouse_is_inside = false
var scroller, scrollItemsLeftPos, scrollBoxLeftPos, scrollItemsRightPos, scrollBoxRightPos

var currentProject = null
var currentPage = null

// Initalize Foundation
$(document).foundation()

/* LOAD DATAS */

// QUOTES
$.when(
  $.ajax({
    url: 'quotes.json',
    async: true,
    dataType: 'json',
    success: function (data) {
      quotes = data.quotes
    },
    error: function (jqxhr, status, error) {
      console.log('Error loading quotes. Status: ' + status + '. Error: ' + error)
    }
  })
).then(function() {
  // Do stuff with quotes
  displayRandomQuote(quotes)
})

// PROJECTS
$.when(
  $.ajax({
    url: projectJSON,
    async: true,
    dataType: 'json',
    success: function(data) {
      projects = data;
    },
    error: function (jqxhr, status, error) {
      console.log('Error loading projects. Status: ' + status + '. Error: ' + error)
    }
  })
).then(function() {
  // Do stuff with projects
  if (currentProject) {
    loadProject(currentProject)    
  }
  displayFeaturedProjects(projects)
  displayProjectGrid(projects)
})

/* INTERFACE */
$(document).ready(function() {


  /* INITIALIZE HASHCHANGE PLUGIN */
  // Load portfolio or resume items immediately if link contains hash elements
  // Currently using BBQ's hashchange plugin for this functionality.
  // Bind hashchange event to window
  $(window).hashchange(function(){
    loadHash()
    if (currentProject) {
      loadProject(currentProject)
    }
  })
  // Trigger hashchange immediately
  $(window).hashchange()
  // Resume
/*
  $('#n-resume').click(
    function() {
      // Close all other tabs if open
      $('#d-portfolio:visible').fadeOut(200);
      $('#n-portfolio span.active').removeClass('active');
      $('#d-projects:visible').fadeOut(200);
      $('#n-projects span.active').removeClass('active');
      // Open Resume
      $('#d-resume:hidden').fadeIn(300, function(){
        document.title = 'Resume - ' + site_title;
        window.location.hash = '/resume';
      });
      $('#n-resume span').addClass('active');
    }
  );
*/

  // Portfolio - Dropdown menu
  $('#port-dropbutton').hover(
    function() {
      $('#port-dropbutton').stop(false,true).animate({opacity: 1}, 200);
    },
    function() {
      if ($('#port-dropdown').is(":hidden")) {
        $('#port-dropbutton').stop(false,true).animate({opacity: 0.5}, 200);
      }
    }
  );
  $('#port-dropbutton').click( function () {
    $('#port-dropdown:hidden').slideDown(300);
  });

  // Portfolio - Dropdown - View project
  $('#port-dropdown a').click( function () {
    $('#port-dropdown:visible').fadeOut(200);
    $('#port-dropbutton').animate({opacity: 0.5}, 200);
  });

  // Portfolio - Dropdown - Close if clicked outside
  $('#port-dropdown').hover(function(){ 
    mouse_is_inside=true; 
  }, function(){ 
    mouse_is_inside=false; 
  });
  $('body').mouseup(function(){ 
    if((! mouse_is_inside) && ($('#port-dropdown').is(':visible'))) {
      $('#port-dropdown').slideUp(200);
      $('#port-dropbutton').stop(false,true).animate({opacity: 0.5}, 200);
    }
  });
  
  // Portfolio - Back button
  $('#port-backbutton').click(function(event){
    backToMenu();
  });
  $('#port-backbutton').hover(
    function() {
      $('#port-backbutton').stop(false,true).animate({opacity: 1}, 200);
    },
    function() {
      $('#port-backbutton').stop(false,true).animate({opacity: 0.5}, 200);
    }
  );

  
});


/* FUNCTIONS */

function loadHash() {
  var rawHash = window.location.hash
  var hash = rawHash.split('/')
  currentPage = hash[1]
  if (rawHash.match(/\/portfolio\//)) {
    currentProject = hash[2]
  }
  else {
    currentProject = null
  }
  switch(currentPage) {
    case 'resume':
      $('#n-resume').click();
      break;
    default:
      $('body').css('overflow', 'visible')
      $('#project-view').hide()
      break;
  }
}

// Displays all current / featured / recent projects
function displayFeaturedProjects(projects) {
  var template = $('#m_current_project').html()
  for (var i = 0; i < projects.items.length; i++) {
    var project = projects.items[i]
    if (project.status == 'current') {
      $('#projects').append(Mustache.render(template, project))
    }
  }
}

// Displays all portfolio projects
function displayProjectGrid(projects) {
  var template = $('#m_portfolio_grid').html()
  for (var i = 0; i < projects.items.length; i++) {
    var project = projects.items[i]
    if (project.status == 'portfolio') {
      $('#portfolio-grid').append(Mustache.render(template, project))
    }
  }
}

function displayRandomQuote (quotes) {
  // Quotes should be an array
  var i = Math.floor(Math.random() * quotes.length)
  $('.quote').html(quotes[i].quote)
  $('.author').html(quotes[i].author)
}

function portArrows() {
  // Test project's image scroller to see if arrows are needed.
  // Call this function after #port-projectdata is fully visible, otherwise offset() might return
  // unpredictable results (depending on browser)
  /*
  scroller = $('#port-images').find('.scroller');
  scrollItemsLeftPos = $(scroller).offset().left;
  scrollBoxLeftPos = $('#port-images').offset().left;
  scrollItemsRightPos = $(scroller).find('img:last').offset().left + $(scroller).find('img:last').width() - 15;
  scrollBoxRightPos = $('#port-images').offset().left + $('#port-images').width();
  if (scrollItemsLeftPos < scrollBoxLeftPos) {
    $('#port-images').find('.port-leftarrow').fadeIn(200);
  }
  if (scrollItemsLeftPos >= scrollBoxLeftPos) {
    $('#port-images').find('.port-leftarrow').fadeOut(200);
  }
  if (scrollItemsRightPos > scrollBoxRightPos) {
    $('#port-images').find('.port-rightarrow').fadeIn(200);
  }
  if (scrollItemsRightPos <= scrollBoxRightPos) {
    $('#port-images').find('.port-rightarrow').fadeOut(200);
  }
  */
}

function loadProject(projectID) {

  // Adjust DOM
  $('body').css('overflow', 'hidden')
  $('#project-view').show()

  // Create the project html snippet
  var template = $('#m_project').html()
  for (var i = 0; i < projects.items.length; i++) {
    var item = projects.items[i]
    if (item.id == projectID) {
      $('#port-projectdata').html(Mustache.render(template, item)).fadeIn(200, function() { 
        // Initialize Foundation Orbit
        $(document).foundation('orbit', {
          animation_speed: 300,
          slide_number: false,
          bullets: false,
          timer: false
        })
      })
      document.title = item.name + ' - ' + site_title
      return true
    }
  }
}

function initProjectNav () {
  /*
  // Portfolio - Project navigation
  // var projectWidth = 650;
  var projectWidth;

  $('.port-leftarrow img').on('click', function(){
    var projectWidth = $('#port-images').width();
    // Overscroll stopper - like the menu one, not that elegant but it works
    scroller = $('#port-images .scroller')
    scrollItemsLeftPos = $(scroller).offset().left + projectWidth;
    scrollBoxLeftPos = $('#port-images').offset().left;
    if (scrollItemsLeftPos <= scrollBoxLeftPos) {
      $('#port-images .scroller').filter(':not(:animated)').animate({'marginLeft': '+='
      +projectWidth}, 300, function(){
        portArrows();
      });
    }
  });
  $('.port-rightarrow img').on('click', function(){
    var projectWidth = $('#port-images').width();
    scroller = $('#port-images .scroller')
    scrollItemsRightPos = $(scroller).find('img:last').offset().left + $(scroller).find('img:last').width() - 15;
    scrollBoxRightPos = $('#port-images').offset().left + $('#port-images').width();
    if (scrollItemsRightPos > scrollBoxRightPos) {
      $('#port-images .scroller').filter(':not(:animated)').animate({'marginLeft': '-='+projectWidth}, 300, function(){
        portArrows();
      });
    }
  });
  
  // Portfolio - Project - Fade out arrows when not hovering over images
  $('#port-images').on('mouseover', function() {
    $('.port-leftarrow img').stop(true, true).fadeIn(200);  
    $('.port-rightarrow img').stop(true, true).fadeIn(200);
  });
  $('#port-images').on('mouseout', function() {
    $('.port-leftarrow img').delay(150).fadeOut(200);
    $('.port-rightarrow img').delay(150).fadeOut(200);
  });

  // Portfolio - Project - Image captions
  $('#port-images .scroller img').on('mouseenter', function (){
    $(this).next('div').stop(true, true).fadeIn(200);
  });
  $('#port-images .scroller img').on('mouseleave', function (){
    $(this).next('div').delay(150).fadeOut(200);
  });
  */
}

