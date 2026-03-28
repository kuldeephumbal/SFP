import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

/**
 * CustomSlider:
 * 1. Infinite looping with onTransitionEnd for snappy repeats.
 * 2. Drag/Swipe support with default cursor.
 */

const CustomSlider = ({
    children,
    slidesToShow = 1,
    breakpoints = null,
    autoplay = false,
    autoplaySpeed = 3000,
    showArrows = true,
    dots = false,
    arrowsInside = false,
    dotsInside = false,
    styledArrows = true,
    arrowSize = 25,
    LeftArrowIcon = ChevronLeft,
    RightArrowIcon = ChevronRight,
    ...props
}) => {
    const childrenArray = React.Children.toArray(children);
    const total = childrenArray.length;
    const [currentSlides, setCurrentSlides] = useState(slidesToShow);

    // Index: 0 is the last-item-clone, [1 to total] are original items, total+1 is the first-item-clone
    const [index, setIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef(null);
    const dragStartX = useRef(0);
    const dragCurrentX = useRef(0);
    const autoplayTimer = useRef(null);

    // Breakpoint logic
    useEffect(() => {
        if (!breakpoints) {
            setCurrentSlides(slidesToShow);
            return;
        }
        const evaluate = () => {
            const width = window.innerWidth;
            let matched = slidesToShow;
            Object.keys(breakpoints)
                .map((k) => parseInt(k, 10))
                .sort((a, b) => a - b)
                .forEach((bp) => {
                    if (width >= bp) {
                        const setting = breakpoints[bp];
                        if (setting && setting.slidesToShow != null) {
                            matched = setting.slidesToShow;
                        }
                    }
                });
            setCurrentSlides(matched);
            setIndex(matched); // Initialize index to the first real slide
        };
        evaluate();
        window.addEventListener('resize', evaluate);
        return () => window.removeEventListener('resize', evaluate);
    }, [breakpoints, slidesToShow]);

    const next = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIndex(prev => prev + 1);
    }, [isTransitioning]);

    const prev = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIndex(prev => prev - 1);
    }, [isTransitioning]);

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        // If we are at the end clone, snap instantly to the real first item
        if (index >= total + currentSlides) {
            setIndex(currentSlides);
        }
        // If we are at the start clone, snap instantly to the real last item
        if (index < currentSlides) {
            setIndex(total + index);
        }
    };

    const goTo = (i) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIndex(i + currentSlides);
    };

    // Autoplay logic
    useEffect(() => {
        if (autoplay && !isDragging) {
            autoplayTimer.current = setInterval(() => {
                next();
            }, autoplaySpeed);
            return () => clearInterval(autoplayTimer.current);
        }
    }, [autoplay, autoplaySpeed, next, isDragging]);

    useEffect(() => {
        // Ensure index is valid after currentSlides changes
        setIndex(prev => {
            const relIndex = (prev - currentSlides + total) % total;
            return relIndex + currentSlides;
        });
    }, [currentSlides, total]);

    // Dragging logic
    const handleDragStart = (e) => {
        if (isTransitioning) return;
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        dragStartX.current = clientX;
        dragCurrentX.current = clientX;
        setIsDragging(true);
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        dragCurrentX.current = clientX;
        const offset = clientX - dragStartX.current;
        setDragOffset(offset);

        // Prevent page scroll if dragging horizontally significantly
        if (e.type === 'touchmove' && Math.abs(offset) > 10) {
            // e.preventDefault(); // This is often passive now, use touch-action instead
        }
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        setIsTransitioning(true); // Snap back or move with animation

        const diff = dragCurrentX.current - dragStartX.current;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) prev();
            else next();
        }
        setDragOffset(0);
    };

    // Clones for infinite loop with multiple slides
    // We need currentSlides amount of clones at each end
    const clonesAtStart = childrenArray.slice(-currentSlides);
    const clonesAtEnd = childrenArray.slice(0, currentSlides);
    const allSlides = [...clonesAtStart, ...childrenArray, ...clonesAtEnd];

    const wrapperStyles = {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'auto',
        touchAction: 'pan-y' // Allow vertical scroll, handle horizontal swipe
    };

    const arrowSx = styledArrows ? {
        backgroundColor: '#1976D2',
        color: '#fff',
        '&:hover': { backgroundColor: '#115293' },
        borderRadius: '50%',
        width: arrowSize,
        height: arrowSize,
        p: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    } : {};

    const sliderContent = (
        <Box
            sx={{ flex: 1, position: 'relative', overflow: 'hidden', width: '100%', touchAction: 'pan-y' }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
        >
            <Box
                ref={containerRef}
                onTransitionEnd={handleTransitionEnd}
                sx={{
                    display: 'flex',
                    transition: isTransitioning ? 'transform 0.5s ease' : 'none',
                    transform: `translateX(calc(-${(index * 100) / currentSlides}% + ${dragOffset}px))`,
                    width: '100%',
                    '& img': { pointerEvents: 'none', userSelect: 'none' } // Disables sticking behavior
                }}
            >
                {allSlides.map((child, idx) => (
                    <Box key={idx} sx={{ flex: `0 0 ${100 / currentSlides}%`, width: `${100 / currentSlides}%` }}>
                        {child}
                    </Box>
                ))}
            </Box>
        </Box>
    );

    return (
        <Box {...props} sx={wrapperStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: arrowsInside ? 0 : 2, width: '100%' }}>
                {showArrows && !arrowsInside && (
                    <IconButton onClick={prev} sx={{ ...arrowSx, zIndex: 1 }}><LeftArrowIcon /></IconButton>
                )}

                <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                    {showArrows && arrowsInside && (
                        <IconButton
                            onClick={prev}
                            sx={{
                                position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                                zIndex: 2, ...arrowSx
                            }}
                        >
                            <LeftArrowIcon />
                        </IconButton>
                    )}

                    {sliderContent}

                    {showArrows && arrowsInside && (
                        <IconButton
                            onClick={next}
                            sx={{
                                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                                zIndex: 2, ...arrowSx
                            }}
                        >
                            <RightArrowIcon />
                        </IconButton>
                    )}
                </Box>

                {showArrows && !arrowsInside && (
                    <IconButton onClick={next} sx={{ ...arrowSx, zIndex: 1 }}><RightArrowIcon /></IconButton>
                )}
            </Box>

            {dots && (
                <Box
                    sx={{
                        position: dotsInside ? 'absolute' : 'static',
                        bottom: dotsInside ? 16 : 0,
                        mt: dotsInside ? 0 : 2,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex: 2
                    }}
                >
                    {childrenArray.map((_, i) => (
                        <Box
                            key={i}
                            onClick={() => goTo(i)}
                            sx={{
                                width: 8,
                                height: 8,
                                bgcolor: (index - 1 + total) % total === i ? 'primary.main' : 'rgba(0,0,0,0.2)',
                                borderRadius: '50%',
                                mx: 0.5,
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default CustomSlider;
