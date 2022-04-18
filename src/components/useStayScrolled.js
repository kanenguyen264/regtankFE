import React from "react";
import { memoize } from "lodash";

// check if element is scrollable
const isScrollAble = function (ele) {
  const hasScrollAbleContent = ele.scrollHeight > ele.clientHeight;

  const overflowYStyle = window.getComputedStyle(ele).overflowY;
  const isOverflowHidden = overflowYStyle.indexOf("hidden") !== -1;

  return hasScrollAbleContent && !isOverflowHidden;
};
/**
 *
 * @param {HTMLElement} ele
 * @returns {HTMLElement}
 */
const getScrollAbleParent = function (ele) {
  return !ele || ele === document.body
    ? document.body
    : isScrollAble(ele)
    ? ele
    : getScrollAbleParent(ele.parentNode);
};

const runScrollCreator = memoize(
  /**
   * @param {React.MutableRefObject<HTMLElement>} domRef
   * @returns {function(*): void}
   */
  (domRef) => (offset) => {
    domRef.scrollTop = offset;
  }
);

/**
 *
 * @param {HTMLElement} dom
 * @returns {number}
 */
const maxScrollTop = (dom) => dom.scrollHeight - dom.clientHeight;

function useStayScrolled() {
  const lastScrolled = React.useRef(null),
    /**
     *
     * @type {React.MutableRefObject<function(*)>}
     */
    runScroll = React.useRef(),
    /**
     *
     * @type {React.MutableRefObject<HTMLElement>}
     */
    scrollAbleRef = React.useRef(null);

  const setRef = React.useCallback((ref) => {
    scrollAbleRef.current = getScrollAbleParent(ref);
    lastScrolled.current = getLastScroll();
    runScroll.current = runScrollCreator(scrollAbleRef.current);
    const onScroll = (e) => {
      lastScrolled.current = getLastScroll();
    };
    scrollAbleRef.current.onscroll = onScroll;
  }, []);

  const getLastScroll = React.useCallback(() => {
    return Math.ceil(scrollAbleRef.current.scrollTop);
  }, []);

  const scroll = (position) => {
    const offset = Math.min(maxScrollTop(scrollAbleRef.current), position);
    runScroll.current(offset);
  };

  const stayScrolled = () => {
    scroll(lastScrolled.current);
    return lastScrolled.current;
  };

  return { setRef, stayScrolled, scrolledRef: scrollAbleRef.current };
}

export default useStayScrolled;
