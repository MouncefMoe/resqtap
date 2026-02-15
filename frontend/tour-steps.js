// Tour Step Definitions - Simplified Home Page Tour
// Focuses on main app features visible on home screen
// Profile and CPR are separate pages - user will discover them naturally

export const TOUR_STEPS = [
  // WELCOME
  {
    id: 1,
    target: '.header',
    title: 'Welcome to ResqTap!',
    message: 'This app provides step-by-step emergency first aid instructions. Let me show you around.',
    action: 'continue',
    page: 'home'
  },

  // SEARCH
  {
    id: 2,
    target: '#searchInput',
    title: 'Search',
    message: 'Search for any injury by name, like "burn" or "choking".',
    action: 'continue',
    page: 'home'
  },

  // CATEGORIES
  {
    id: 3,
    target: '#categoryDropdownToggle',
    title: 'Categories',
    message: 'Tap here to filter injuries by category like burns, allergies, fractures, and more.',
    action: 'continue',
    page: 'home'
  },

  // SEVERITY
  {
    id: 4,
    target: '#severityDropdownToggle',
    title: 'Severity Filter',
    message: 'Filter injuries by severity level: Critical, High, Medium, or Low.',
    action: 'continue',
    page: 'home'
  },

  // FAVORITES
  {
    id: 5,
    target: '#favoritesToggle',
    title: 'Favorites',
    message: 'Save your most-used emergencies here for quick access.',
    action: 'continue',
    page: 'home'
  },

  // INJURY CARDS
  {
    id: 6,
    target: '#crisisContainer',
    title: 'Injury Cards',
    message: 'Tap any card to see step-by-step first aid instructions. Swipe to see more.',
    action: 'continue',
    page: 'home'
  },

  // BOTTOM NAV - CPR
  {
    id: 7,
    target: '.bottom-nav .nav-item:nth-child(2)',
    title: 'CPR Guide',
    message: 'Tap here to access interactive CPR guidance with voice prompts and timing.',
    action: 'continue',
    page: 'home'
  },

  // BOTTOM NAV - PROFILE
  {
    id: 8,
    target: '.bottom-nav .nav-item:nth-child(3)',
    title: 'Your Profile',
    message: 'Store your health information, emergency contacts, and take first aid quizzes.',
    action: 'continue',
    page: 'home'
  },

  // EMERGENCY CALL
  {
    id: 9,
    target: '.bottom-nav .call-911',
    title: 'Emergency Call',
    message: 'Tap here to quickly call 911 in an emergency.',
    action: 'continue',
    page: 'home'
  },

  // COMPLETION
  {
    id: 10,
    target: '.bottom-nav .nav-item:first-child',
    title: 'You\'re Ready!',
    message: 'That\'s it! You now know how to use ResqTap. Stay safe and prepared!',
    action: 'finish',
    page: 'home',
    isLast: true
  }
];
