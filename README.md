# LifeOS — Personal Life Management System

A responsive personal productivity dashboard built with HTML, CSS, and vanilla JavaScript.

## Features
- Overview dashboard with task, habit, goal, and finance summaries
- Task manager: add, complete, edit, filter, search, and delete tasks
- Habit tracker: daily check-ins, 7-day history, and current streak
- Goal tracker: create goals and update progress in 10% increments
- Finance tracker: income, expenses, categories, and current balance
- Daily journal with mood tags
- Pomodoro focus timer with 25/5/15-minute presets
- Light/dark mode and responsive mobile layout
- Browser LocalStorage persistence

## Run
1. Extract the ZIP.
2. Open the `LifeOS` folder in VS Code.
3. Open `index.html` in a browser, or use VS Code Live Server.
4. No build step or backend is required.

## Important notes
- This is a front-end demo. Data is stored locally in the current browser and device; it does not sync across devices.
- It does not include real account authentication or cloud backup.
- The weekly chart uses Chart.js from a CDN, so an internet connection is needed for that chart.
- Currency is displayed in Indian Rupees (₹).


## Sign in and reset options
- The sign-in screen supports creating a local demo account and signing in again in the same browser.
- Use **Reset app data** in the sidebar to clear tasks, habits, goals, transactions, and journal entries and restore the starter dashboard data.
- Use **Sign out** to return to the sign-in screen.
- Important: demo credentials are stored in browser LocalStorage as a learning/demo feature. Do not use a real or reused password. This is not secure production authentication; use a backend authentication service for a real deployment.
- Dark mode is available from **Toggle appearance** and its preference is saved in the browser.


## Visual refinement update
- Improved the Pomodoro timer center contrast in both light and dark themes.
- Refined dark-theme contrast for timer presets, badges, habit completion, date card, and sidebar tip.
- Reset now clearly confirms that it resets workspace content only; the demo account and theme preference are preserved.


## Reset behavior correction
- The reset button now empties every workspace collection and saves those empty collections.
- It no longer removes the LocalStorage keys, which previously caused sample starter records to be recreated on reload.
- After reset, task/habit/goal/finance totals show zero and lists show their empty states. The local demo sign-in and theme preference are preserved.


## Account profile display
- Signed-in user's name and email appear in the sidebar profile area.
- Dashboard greeting uses the first name from the demo account.
- Sign out is now a prominent sidebar button. Sidebar can scroll on shorter screens.
