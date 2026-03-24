import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, ChevronLeft, ChevronRight } from '@mui/icons-material';

// A very lightweight slider/carousel implementation using CSS transform.
// Props:
//   children - slide elements
//   slidesToShow - number of slides visible at once (default 1)
//   autoplay - boolean to enable auto sliding
//   autoplaySpeed - ms between automatic transitions
//   showArrows - whether to render navigation arrows
// Additional props are spread onto the outer container Box.

const CustomSlider = ({
    children,
    slidesToShow = 1,
    breakpoints = null,
    autoplay = false,
    autoplaySpeed = 3000,
    showArrows = true,
    dots = false,
    arrowsInside = false, // render arrows overlayed inside the slider container
    dotsInside = false,   // new: position dots inside the slider area
    styledArrows = true,  // if false, don't apply default blue/white styling
    arrowSize = 25,       // size in px for the square button
    LeftArrowIcon = ChevronLeft,  // optional custom arrow components
    RightArrowIcon = ChevronRight,
    ...props
}) => {
    const [index, setIndex] = useState(0);
    const total = React.Children.count(children);
    const containerRef = useRef(null);
    const [currentSlides, setCurrentSlides] = useState(slidesToShow);

    const goTo = (idx) => {
        if (idx < 0) idx = 0;
        if (idx > total - currentSlides) idx = total - currentSlides;
        setIndex(idx);
    };

    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    // handle breakpoints
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
        };
        evaluate();
        window.addEventListener('resize', evaluate);
        return () => window.removeEventListener('resize', evaluate);
    }, [breakpoints, slidesToShow]);

    useEffect(() => {
        if (autoplay) {
            const id = setInterval(() => {
                setIndex((prev) => {
                    const nextIdx = prev + 1;
                    return nextIdx > total - currentSlides ? 0 : nextIdx;
                });
            }, autoplaySpeed);
            return () => clearInterval(id);
        }
    }, [autoplay, autoplaySpeed, currentSlides, total]);

    // Resize handler to keep index in range when container shrinks
    useEffect(() => {
        const handleResize = () => {
            if (index > total - slidesToShow) {
                setIndex(total - slidesToShow);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [index, slidesToShow, total]);

    // choose layout based on arrowsInside or dotsInside flags
    const wrapperStyles = {
        width: '100%',
        position: arrowsInside || dotsInside ? 'relative' : 'static',
        overflow: arrowsInside ? 'hidden' : 'visible'
    };

    // default arrow button styling
    const arrowSx = styledArrows ? {
        backgroundColor: '#1976D2',
        color: '#fff',
        '&:hover': { backgroundColor: '#115293' },
        borderRadius: '50%',
        width: arrowSize,
        height: arrowSize,
        p: 0, // use explicit size
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    } : {};  // empty object when styling disabled

    const sliderContent = (
        <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden', width: '100%' }}>
            <Box
                ref={containerRef}
                sx={{
                    display: 'flex',
                    transition: 'transform 0.5s ease',
                    transform: `translateX(-${(index * 100) / currentSlides}%)`,
                    width: '100%',
                }}
            >
                {React.Children.map(children, (child, idx) => (
                    <Box sx={{ flex: `0 0 ${100 / currentSlides}%`, width: `${100 / currentSlides}%` }}>{child}</Box>
                ))}
            </Box>
        </Box>
    );

    return (
        <Box {...props} sx={wrapperStyles}>
            {arrowsInside ? (
                // arrows overlayed on top of slider
                <>
                    {showArrows && (
                        <IconButton
                            onClick={prev}
                            sx={{
                                position: 'absolute',
                                left: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 2,
                                ...arrowSx,
                            }}
                        >
                            <LeftArrowIcon />
                        </IconButton>
                    )}
                    {sliderContent}
                    {showArrows && (
                        <IconButton
                            onClick={next}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 2,
                                ...arrowSx,
                            }}
                        >
                            <RightArrowIcon />
                        </IconButton>
                    )}
                </>
            ) : (
                // arrows outside, separated by flexbox
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, width: '100%' }}>
                    {showArrows && (
                        <IconButton
                            onClick={prev}
                            sx={{
                                flexShrink: 0,
                                zIndex: 1,
                                ...arrowSx,
                            }}
                        >
                            <LeftArrowIcon />
                        </IconButton>
                    )}
                    {sliderContent}
                    {showArrows && (
                        <IconButton
                            onClick={next}
                            sx={{
                                flexShrink: 0,
                                zIndex: 1,
                                ...arrowSx,
                            }}
                        >
                            <RightArrowIcon />
                        </IconButton>
                    )}        </Box>
            )}
            {dots && (
                dotsInside ? (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        {Array.from({ length: total - currentSlides + 1 }).map((_, i) => (
                            <Box
                                key={i}
                                onClick={() => goTo(i)}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    bgcolor: i === index ? 'primary.main' : 'grey.400',
                                    borderRadius: '50%',
                                    mx: 0.5,
                                    cursor: 'pointer',
                                }}
                            />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, width: '100%' }}>
                        {Array.from({ length: total - currentSlides + 1 }).map((_, i) => (
                            <Box
                                key={i}
                                onClick={() => goTo(i)}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    bgcolor: i === index ? 'primary.main' : 'grey.400',
                                    borderRadius: '50%',
                                    mx: 0.5,
                                    cursor: 'pointer',
                                }}
                            />
                        ))}
                    </Box>
                )
            )}
        </Box>
    );
};

export default CustomSlider;
