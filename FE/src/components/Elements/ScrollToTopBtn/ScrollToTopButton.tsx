import React, { useState, useEffect } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import "./ScrollToTopButton.scss";
import { scrollToTop } from "../../../utils/utils";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    setIsVisible(scrollTop > window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    isVisible && (
      <button className="scroll-top-btn" onClick={scrollToTop}>
        <ArrowUpIcon className="scroll-top-btn__icon" />
      </button>
    )
  );
};

export default ScrollToTopButton;
