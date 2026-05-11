/**
 * Wheel / pinch on charts hijacks page scroll and feels like accidental zoom.
 * Keep drag-to-pan and double-click reset; disable wheel scaling & wheel scroll on chart.
 */
export const chartInteractionPageScrollFriendly = {
  handleScroll: {
    mouseWheel: false,
    pressedMouseMove: true,
    horzTouchDrag: true,
    vertTouchDrag: false,
  },
  handleScale: {
    mouseWheel: false,
    pinch: false,
    axisPressedMouseMove: true,
    axisDoubleClickReset: true,
  },
} as const

export const chartInteractionZoomFriendly = {
  handleScroll: {
    mouseWheel: false,
    pressedMouseMove: true,
    horzTouchDrag: true,
    vertTouchDrag: false,
  },
  handleScale: {
    mouseWheel: true,
    pinch: true,
    axisPressedMouseMove: true,
    axisDoubleClickReset: true,
  },
} as const
