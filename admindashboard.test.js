const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, 'admindashboard.hbs'), 'utf8');

describe('Admin Dashboard', () => {
  let window;
  let document;
  let nextPageButton;
  let prevPageButton;
  let currentPageSpan;

  beforeEach(() => {
    const { JSDOM } = jsdom;
    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    window = dom.window;
    document = window.document;

    // You may need to update these selectors based on your HTML structure
    nextPageButton = document.querySelector('button[onclick="nextPage()"]');
    prevPageButton = document.querySelector('button[onclick="prevPage()"]');
    currentPageSpan = document.getElementById('currentPage');
  });

  function clickButton(button) {
    const event = new window.Event('click');
    button.dispatchEvent(event);
  }

  test('Next Page should update the current page number', () => {
    // Initially, currentPage is 1
    expect(currentPageSpan.textContent).toBe('1');

    // Click the "Next Page" button
    clickButton(nextPageButton);

    // After clicking the "Next Page" button, currentPage should be 2
    expect(currentPageSpan.textContent).toBe('2');
  });

  test('Previous Page should update the current page number', () => {
    // Initially, currentPage is 1
    expect(currentPageSpan.textContent).toBe('1');

    // Click the "Previous Page" button
    clickButton(prevPageButton);

    // After clicking the "Previous Page" button, currentPage should be 1 (minimum)
    expect(currentPageSpan.textContent).toBe('1');
  });
});
