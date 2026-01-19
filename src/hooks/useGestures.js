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
  onDoubleTapLongPress,
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

    // If it was a long press, don't process as tap
    if (isLongPress.current || isDoubleTapLongPress.current) {
      isLongPress.current = false;
      isDoubleTapLongPress.current = false;
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
      const target = e.target;
      
      // Check if tap is on text content
      if (target.nodeType === Node.TEXT_NODE || target.tagName === 'SPAN' || target.tagName === 'P') {
        if (onWordTap) {
          // Get word at tap position
          const range = document.caretRangeFromPoint(touch.clientX, touch.clientY);
          if (range) {
            onWordTap(e, range);
          }
        }
      }
      
      if (onTap) {
        onTap(e);
      }
    }

    setTouchStart(null);
  }, [touchStart, onTap, onSwipeLeft, onSwipeRight, onWordTap]);

  const handleTouchCancel = useCallback(() => {
    clearTimeout(longPressTimer.current);
    clearTimeout(doubleTapTimer.current);
    isLongPress.current = false;
    isDoubleTapLongPress.current = false;
    setTouchStart(null);
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };
}

export default useGestures;
