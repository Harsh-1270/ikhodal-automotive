import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Scrolls the .main-content container to the top on every route change.
 * .main-content is the actual scroll container in this app (overflow-y: auto in App.css).
 * window.scrollTo() won't work here because html/body have overflow: hidden.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Target the real scroll container (.main-content, not window)
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
