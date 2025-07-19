// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">URS</a></li><li class="chapter-item expanded "><a href="introduction.html"><strong aria-hidden="true">1.</strong> Introduction</a></li><li class="chapter-item expanded "><a href="installation.html"><strong aria-hidden="true">2.</strong> Installation</a></li><li class="chapter-item expanded "><a href="exporting.html"><strong aria-hidden="true">3.</strong> Exporting</a></li><li class="chapter-item expanded "><a href="credentials.html"><strong aria-hidden="true">4.</strong> How to Get Reddit API Credentials for PRAW</a></li><li class="chapter-item expanded affix "><li class="part-title">Scraping Reddit</li><li class="chapter-item expanded "><a href="scraping-reddit/scrape-speeds-and-rate-limits.html"><strong aria-hidden="true">5.</strong> Scrape Speeds and Rate Limits</a></li><li class="chapter-item expanded "><a href="scraping-reddit/all-attributes-table.html"><strong aria-hidden="true">6.</strong> A Table of All Subreddit, Redditor, and Submission Comments Attributes</a></li><li class="chapter-item expanded "><a href="scraping-reddit/subreddit.html"><strong aria-hidden="true">7.</strong> Scraping Subreddits</a></li><li class="chapter-item expanded "><a href="scraping-reddit/redditor.html"><strong aria-hidden="true">8.</strong> Scraping Redditors</a></li><li class="chapter-item expanded "><a href="scraping-reddit/submission-comments.html"><strong aria-hidden="true">9.</strong> Scraping Submission Comments</a></li><li class="chapter-item expanded affix "><li class="part-title">Livestreaming Reddit</li><li class="chapter-item expanded "><a href="livestreaming-reddit/general-information.html"><strong aria-hidden="true">10.</strong> General Information</a></li><li class="chapter-item expanded "><a href="livestreaming-reddit/livestreaming-subreddits-and-redditors.html"><strong aria-hidden="true">11.</strong> Livestreaming Subreddits and Redditors</a></li><li class="chapter-item expanded affix "><li class="part-title">Analytical Tools</li><li class="chapter-item expanded "><a href="analytical-tools/general-information.html"><strong aria-hidden="true">12.</strong> General Information</a></li><li class="chapter-item expanded "><a href="analytical-tools/frequencies-and-wordclouds.html"><strong aria-hidden="true">13.</strong> Generating Word Frequencies and Wordclouds</a></li><li class="chapter-item expanded affix "><li class="part-title">Utilities</li><li class="chapter-item expanded "><a href="utilities/tree.html"><strong aria-hidden="true">14.</strong> Built-in Tree</a></li><li class="chapter-item expanded "><a href="utilities/rate-limit-checking.html"><strong aria-hidden="true">15.</strong> PRAW Rate Limit Check</a></li><li class="chapter-item expanded affix "><li class="part-title">Additional Information</li><li class="chapter-item expanded "><a href="additional-information/2fa-information.html"><strong aria-hidden="true">16.</strong> 2-Factor Authentication</a></li><li class="chapter-item expanded "><a href="additional-information/error-messages.html"><strong aria-hidden="true">17.</strong> Error Messages</a></li><li class="chapter-item expanded affix "><li class="part-title">Implementation Details</li><li class="chapter-item expanded "><a href="implementation-details/the-forest.html"><strong aria-hidden="true">18.</strong> The Forest</a></li><li class="chapter-item expanded "><a href="implementation-details/speeding-up-python-with-rust.html"><strong aria-hidden="true">19.</strong> Speeding Up Python with Rust</a></li><li class="chapter-item expanded affix "><li class="part-title">Contributing</li><li class="chapter-item expanded "><a href="contributing/before-making-pull-or-feature-requests.html"><strong aria-hidden="true">20.</strong> Before Making Pull or Feature Requests</a></li><li class="chapter-item expanded "><a href="contributing/building-on-top-of-urs.html"><strong aria-hidden="true">21.</strong> Building on Top of URS</a></li><li class="chapter-item expanded "><a href="contributing/making-pull-or-feature-requests.html"><strong aria-hidden="true">22.</strong> Making Pull or Feature Requests</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><a href="contributors.html">Contributors</a></li><li class="chapter-item expanded affix "><a href="derivative-projects.html">Derivative Projects</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
