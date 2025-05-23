import { useEffect, useState, RefObject } from "react";

interface ScrollDetectionResult {
  needsScrolling: boolean;
  showLeftArrow: boolean;
  showRightArrow: boolean;
  scroll: (direction: "left" | "right") => void;
}

export function useScrollDetection<T extends HTMLElement = HTMLElement>(
  containerRef: RefObject<T | null>,
  contentRef: RefObject<T | null>,
  scrollAmount: number = 200
): ScrollDetectionResult {
  const [needsScrolling, setNeedsScrolling] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollState = () => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (container && content) {
      const containerWidth = container.clientWidth;
      const contentWidth = content.scrollWidth;
      const isScrollNeeded = contentWidth > containerWidth;

      setNeedsScrolling(isScrollNeeded);

      if (isScrollNeeded) {
        setShowLeftArrow(content.scrollLeft > 0);
        setShowRightArrow(
          content.scrollLeft < content.scrollWidth - content.clientWidth - 1 // -1 for precision
        );
      } else {
        setShowLeftArrow(false);
        setShowRightArrow(false);
      }
    }
  };

  const scroll = (direction: "left" | "right") => {
    const content = contentRef.current;
    if (content) {
      content.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkScrollState, 100);

    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", checkScrollState);
      window.addEventListener("resize", checkScrollState);

      return () => {
        content.removeEventListener("scroll", checkScrollState);
        window.removeEventListener("resize", checkScrollState);
        clearTimeout(timer);
      };
    }

    return () => clearTimeout(timer);
  }, [containerRef, contentRef]);

  return {
    needsScrolling,
    showLeftArrow,
    showRightArrow,
    scroll,
  };
}
