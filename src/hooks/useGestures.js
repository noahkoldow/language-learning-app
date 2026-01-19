// Touch Gesture Detection Hook
import { useCallback, useRef, useState } from 'react';

const LONG_PRESS_DURATION = 500; // ms
const DOUBLE_TAP_DELAY = 300; // ms
const SWIPE_THRESHOLD = 50; // pixels

/**
 * Custom hook for handling touch gestures
 * @param {object} callbacks - Gesture callbacks
 * @returns {object} - Event handlers to attach to element
 */
export function useGestures({
  onTap,
  onLongPress,
  onLongPressEnd,
  onDoubleTapLongPress,
  onDoubleTapLongPressEnd,
  onSwipeLeft,
  onSwipeRight,
  onWordTap,
} = {}) {
  const [touchStart, setTouchStart] = useState(null);
  const [lastTap, setLastTap] = useState(0);
  const longPressTimer = useRef(null);
  const doubleTapTimer = useRef(null);
  const isLongPress = useRef(false);
  const isDoubleTapLongPress = useRef(false);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    const now = Date.now();
    
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: now,
      target: e.target,
    });

    // Check if this is a double tap
    const timeSinceLastTap = now - lastTap;
    const isDoubleTap = timeSinceLastTap < DOUBLE_TAP_DELAY;

    if (isDoubleTap) {
      // This is potentially a double-tap-long-press
      clearTimeout(doubleTapTimer.current);
      
      longPressTimer.current = setTimeout(() => {
        isDoubleTapLongPress.current = true;
        if (onDoubleTapLongPress) {
          onDoubleTapLongPress(e);
        }
      }, LONG_PRESS_DURATION);
    } else {
      // This is potentially a single tap or long press
      longPressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        if (onLongPress) {
          onLongPress(e);
        }
      }, LONG_PRESS_DURATION);
    }

    setLastTap(now);
  }, [lastTap, onLongPress, onDoubleTapLongPress]);

  const handleTouchMove = useCallback(() => {
    // If user moves finger, cancel long press
    clearTimeout(longPressTimer.current);
    isLongPress.current = false;
    isDoubleTapLongPress.current = false;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    clearTimeout(longPressTimer.current);
    
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const duration = Date.now() - touchStart.time;

    // If it was a long press, call the end handler and don't process as tap
    if (isLongPress.current) {
      isLongPress.current = false;
      if (onLongPressEnd) {
        onLongPressEnd(e);
      }
      setTouchStart(null);
      return;
    }
    
    if (isDoubleTapLongPress.current) {
      isDoubleTapLongPress.current = false;
      if (onDoubleTapLongPressEnd) {
        onDoubleTapLongPressEnd(e);
      }
      setTouchStart(null);
      return;
    }

    // Detect swipe
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight(e);
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft(e);
      }
    } 
    // Detect tap on word
    else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && duration < 200) {
      if (onWordTap) {
        // Get word at tap position
        const range = document.caretRangeFromPoint?.(touch.clientX, touch.clientY);
        if (range && range.startContainer) {
          // Expand range to select the word at the tap position
          const textNode = range.startContainer;
          if (textNode.nodeType === Node.TEXT_NODE) {
            const text = textNode.textContent;
            const offset = range.startOffset;
            
            // Find word boundaries
            let start = offset;
            let end = offset;
            
            // Move start backward to find word start
            while (start > 0 && /\w/.test(text[start - 1])) {
              start--;
            }
            
            // Move end forward to find word end
            while (end < text.length && /\w/.test(text[end])) {
              end++;
            }
            
            // Only select if we found a word
            if (start < end) {
              range.setStart(textNode, start);
              range.setEnd(textNode, end);
              onWordTap(e, range);
            }
          }
        }
      }
      
      if (onTap) {
        onTap(e);
      }
    }

    setTouchStart(null);
  }, [touchStart, onTap, onSwipeLeft, onSwipeRight, onWordTap, onLongPressEnd, onDoubleTapLongPressEnd]);

  const handleTouchCancel = useCallback((e) => {
    clearTimeout(longPressTimer.current);
    clearTimeout(doubleTapTimer.current);
    
    // If long press was active, call end handlers
    if (isLongPress.current && onLongPressEnd) {
      onLongPressEnd(e);
    }
    if (isDoubleTapLongPress.current && onDoubleTapLongPressEnd) {
      onDoubleTapLongPressEnd(e);
    }
    
    isLongPress.current = false;
    isDoubleTapLongPress.current = false;
    setTouchStart(null);
  }, [onLongPressEnd, onDoubleTapLongPressEnd]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };
}

export default useGestures;
